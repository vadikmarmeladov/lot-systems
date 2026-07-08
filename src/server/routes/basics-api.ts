/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE — SERVER ROUTES
 *
 * Self-serve state machine: NONE -> PENDING -> ON_STRENGTH -> STEADY_STATE.
 * State lives on User.metadata.basics. History is append-only in
 * metadata.basicsIssues; Log entries mirror every transition for audit.
 *
 * Billing is a scaffold, not a live payment integration — no processor is
 * wired into this codebase yet. amountUsd/status/lastChargeAt are tracked
 * honestly as an internal ledger record, ready to attach to a real
 * processor later.
 */

import { FastifyInstance, FastifyRequest } from 'fastify'
import dayjs from '#server/utils/dayjs'
import { STEADY_STATE_CYCLE_THRESHOLD } from '#shared/constants/basics'
import { quoteIssue } from '#server/basics/cogs'
import { BASICS_SIZES, type BasicsSize, type BasicsState } from '#shared/types'

function hasUsership(tags: string[]): boolean {
  return tags.some((tag) => tag.toLowerCase() === 'usership')
}

function readBasics(metadata: Record<string, any>): BasicsState {
  return (
    metadata?.basics || {
      status: 'NONE',
      cycleNumber: 0,
    }
  )
}

export function registerBasicsRoutes(fastify: FastifyInstance) {
  // GET /api/basics/state
  fastify.get('/basics/state', async (req: FastifyRequest, reply) => {
    const basics = readBasics(req.user.metadata)
    const issues = (req.user.metadata as any)?.basicsIssues || []
    return { basics, issues }
  })

  // POST /api/basics/enroll — roster intake (sizing, shipping)
  fastify.post(
    '/basics/enroll',
    async (
      req: FastifyRequest<{ Body: { size: BasicsSize; shippingAddress: string } }>,
      reply
    ) => {
      if (!hasUsership(req.user.tags)) {
        return reply.throw.accessDenied(
          'BASIC requires USERSHIP / AI as base layer.'
        )
      }
      const { size, shippingAddress } = req.body || ({} as any)
      if (!size || !BASICS_SIZES.includes(size) || !shippingAddress?.trim()) {
        return reply.throw.badParams('Size and shipping address required.')
      }
      const current = readBasics(req.user.metadata)
      if (current.status !== 'NONE') {
        return reply.throw.conflict('Already on the roster.')
      }
      const basics: BasicsState = {
        status: 'PENDING',
        size,
        shippingAddress: shippingAddress.trim(),
        enrolledAt: dayjs().toISOString(),
        cycleNumber: 0,
      }
      await req.user
        .set({ metadata: { ...req.user.metadata, basics } })
        .save()
      await fastify.models.Log.create({
        userId: req.user.id,
        event: 'basics_enroll',
        text: `Roster intake submitted — size ${size}`,
        metadata: { size },
      })
      return { basics }
    }
  )

  // POST /api/basics/confirm — PENDING -> ON_STRENGTH, cadence start scheduled
  fastify.post('/basics/confirm', async (req: FastifyRequest, reply) => {
    const current = readBasics(req.user.metadata)
    if (current.status !== 'PENDING') {
      return reply.throw.conflict('No pending roster intake to confirm.')
    }
    const cadenceStartAt = dayjs().add(1, 'month').startOf('month').toISOString()
    const basics: BasicsState = {
      ...current,
      status: 'ON_STRENGTH',
      cadenceStartAt,
      nextIssueAt: cadenceStartAt,
      cycleNumber: 0,
      billing: {
        plan: 'BASIC_ADDITIVE',
        amountUsd: 100,
        status: 'ACTIVE',
        startedAt: dayjs().toISOString(),
      },
    }
    await req.user.set({ metadata: { ...req.user.metadata, basics } }).save()
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_confirm',
      text: 'Roster confirmed — ON STRENGTH',
      metadata: { cadenceStartAt },
    })
    return { basics }
  })

  // POST /api/basics/stand-down — drops ration, retains USERSHIP/AI
  fastify.post('/basics/stand-down', async (req: FastifyRequest, reply) => {
    const current = readBasics(req.user.metadata)
    if (current.status === 'NONE') {
      return reply.throw.conflict('Not on the roster.')
    }
    const basics: BasicsState = {
      status: 'NONE',
      cycleNumber: 0,
      billing: current.billing
        ? { ...current.billing, status: 'STOPPED', stoppedAt: dayjs().toISOString() }
        : undefined,
    }
    await req.user.set({ metadata: { ...req.user.metadata, basics } }).save()
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_stand_down',
      text: 'STAND DOWN — ration dropped, USERSHIP/AI retained',
      metadata: { priorStatus: current.status, priorCycleNumber: current.cycleNumber },
    })
    return { basics }
  })

  // POST /api/basics/dispatch-issue — simulated fulfillment trigger (M3).
  // No live courier/supplier API exists; this records what a real dispatch
  // would ship and verifies it against the COGS ceiling before logging it.
  fastify.post('/basics/dispatch-issue', async (req: FastifyRequest, reply) => {
    const current = readBasics(req.user.metadata)
    if (current.status !== 'ON_STRENGTH' && current.status !== 'STEADY_STATE') {
      return reply.throw.conflict('Not on strength — nothing to dispatch.')
    }
    const quote = quoteIssue(current.cycleNumber)
    if (!quote.withinCeiling) {
      return reply.throw.rejected(
        'Issue quote breaches COGS ceiling — dispatch blocked.'
      )
    }
    const nextCycleNumber = current.cycleNumber + 1
    const nextIssueAt = dayjs(current.nextIssueAt || undefined)
      .add(1, 'month')
      .toISOString()
    const basics: BasicsState = {
      ...current,
      status:
        nextCycleNumber >= STEADY_STATE_CYCLE_THRESHOLD
          ? 'STEADY_STATE'
          : current.status,
      cycleNumber: nextCycleNumber,
      nextIssueAt,
      billing: current.billing
        ? { ...current.billing, lastChargeAt: dayjs().toISOString() }
        : current.billing,
    }
    const issueRecord = {
      cycleNumber: quote.cycleNumber,
      dispatchedAt: dayjs().toISOString(),
      itemLines: quote.itemLines,
      cogsTotalUsd: quote.cogsTotalUsd,
      marginPct: quote.marginPct,
    }
    const basicsIssues = [
      ...((req.user.metadata as any)?.basicsIssues || []),
      issueRecord,
    ]
    await req.user
      .set({ metadata: { ...req.user.metadata, basics, basicsIssues } })
      .save()
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_issue',
      text: `Issue dispatched — cycle ${issueRecord.cycleNumber}, ${issueRecord.itemLines.length} lines`,
      metadata: issueRecord,
    })
    return { basics, issue: issueRecord }
  })
}
