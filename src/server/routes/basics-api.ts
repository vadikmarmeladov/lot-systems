/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE — SERVER
 *
 * MONTH 2 — UPGRADE & ROSTER
 *   USERSHIP/AI -> PENDING -> ON STRENGTH -> STEADY STATE, and STAND DOWN.
 * MONTH 3 — ISSUE & FULFILLMENT
 *   Month-by-month load engine, issue log, NEXT ISSUE advance.
 *
 * State lives in user.metadata.basics (BasicsState). No new table: this is
 * a software self-assembly build, not a live commerce integration — billing
 * is SIMULATED (no payment processor call), fulfillment is a dispatch log
 * entry + printable manifest card, not a real shipment.
 */

import { FastifyInstance, FastifyRequest } from 'fastify'
import dayjs from '#server/utils/dayjs'
import { getLogContext } from '#server/utils/logs'
import { costIssue } from '#server/utils/basics-cogs'
import { COUNTRY_BY_ALPHA3 } from '#shared/constants'
import {
  BASICS_STATE_DEFAULT,
  itemsForIssue,
  type BasicsState,
} from '#shared/constants/basics'
import { sync } from '../sync.js'

function readBasics(metadata: Record<string, any>): BasicsState {
  return { ...BASICS_STATE_DEFAULT, ...(metadata?.basics || {}) }
}

function hasUsershipTag(tags: string[]): boolean {
  return tags.some((tag) => tag.toLowerCase() === 'usership')
}

export function registerBasicsRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/basics
   * Current ration status for the requesting operator. Public doctrine
   * (manifest/price/COGS ceiling) lives client-side in #shared/constants/basics
   * — this endpoint returns only the operator's own enrollment state.
   */
  fastify.get('/basics', async (req: FastifyRequest, reply) => {
    const basics = readBasics(req.user.metadata)
    return {
      basics,
      isUsership: hasUsershipTag(req.user.tags),
    }
  })

  /**
   * POST /api/basics/enroll
   * Roster intake. USERSHIP/AI -> PENDING.
   */
  fastify.post(
    '/basics/enroll',
    async (
      req: FastifyRequest<{
        Body: { householdSize: number; country: string; city: string; address: string }
      }>,
      reply
    ) => {
      if (!hasUsershipTag(req.user.tags)) {
        return reply.throw.badParams('BASIC requires USERSHIP / AI as base layer')
      }

      const basics = readBasics(req.user.metadata)
      if (basics.status !== 'NONE' && basics.status !== 'STAND_DOWN') {
        return reply.throw.badParams(`Already ${basics.status} — cannot re-enroll`)
      }

      const householdSize = Math.max(1, Math.min(12, Number(req.body.householdSize) || 1))
      const country = (req.body.country || '').trim().toUpperCase()
      const city = (req.body.city || '').trim().slice(0, 120)
      const address = (req.body.address || '').trim().slice(0, 240)

      if (!COUNTRY_BY_ALPHA3[country]) {
        return reply.throw.badParams('Invalid country code')
      }
      if (!city || !address) {
        return reply.throw.badParams('Shipping city and address are required')
      }

      const next: BasicsState = {
        ...BASICS_STATE_DEFAULT,
        status: 'PENDING',
        roster: { householdSize, country, city, address },
        enrolledAt: dayjs().toISOString(),
      }

      await req.user
        .set({ metadata: { ...req.user.metadata, basics: next } })
        .save()

      const context = await getLogContext(req.user)
      await fastify.models.Log.create({
        userId: req.user.id,
        event: 'basics_enroll',
        text: 'BASIC ration roster intake submitted',
        metadata: { householdSize, country, city },
        context,
      })

      sync.emit('settings_updated', { userId: req.user.id })
      return { basics: next }
    }
  )

  /**
   * POST /api/basics/confirm
   * Authorize the recurring charge. PENDING -> ON STRENGTH.
   */
  fastify.post('/basics/confirm', async (req: FastifyRequest, reply) => {
    const basics = readBasics(req.user.metadata)
    if (basics.status !== 'PENDING') {
      return reply.throw.badParams('No pending enrollment to confirm')
    }

    const now = dayjs()
    const next: BasicsState = {
      ...basics,
      status: 'ON_STRENGTH',
      onStrengthAt: now.toISOString(),
      nextChargeAt: now.add(1, 'month').toISOString(),
      chargeHistory: [
        ...basics.chargeHistory,
        { date: now.toISOString(), amountUsd: 100, status: 'SIMULATED' },
      ],
      nextIssueAt: now.toISOString(),
    }

    await req.user
      .set({ metadata: { ...req.user.metadata, basics: next } })
      .save()

    const context = await getLogContext(req.user)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_on_strength',
      text: 'Operator ON STRENGTH — BASIC ration active',
      metadata: { amountUsd: 100 },
      context,
    })

    sync.emit('settings_updated', { userId: req.user.id })
    return { basics: next }
  })

  /**
   * POST /api/basics/stand-down
   * Drop the ration. Retains USERSHIP/AI. ON_STRENGTH/STEADY_STATE -> STAND_DOWN.
   */
  fastify.post('/basics/stand-down', async (req: FastifyRequest, reply) => {
    const basics = readBasics(req.user.metadata)
    if (basics.status !== 'ON_STRENGTH' && basics.status !== 'STEADY_STATE') {
      return reply.throw.badParams('Not currently on strength')
    }

    const next: BasicsState = {
      ...basics,
      status: 'STAND_DOWN',
      standDownAt: dayjs().toISOString(),
      nextChargeAt: null,
      nextIssueAt: null,
    }

    await req.user
      .set({ metadata: { ...req.user.metadata, basics: next } })
      .save()

    const context = await getLogContext(req.user)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_stand_down',
      text: 'Operator STAND DOWN — BASIC ration dropped, USERSHIP/AI retained',
      metadata: {},
      context,
    })

    sync.emit('settings_updated', { userId: req.user.id })
    return { basics: next }
  })

  /**
   * POST /api/basics/issue/dispatch
   * Month-by-month load engine. Ships the current cycle's items, appends
   * the issue log, advances NEXT ISSUE. Second dispatch demonstrates the
   * recurring cadence and moves ON_STRENGTH -> STEADY STATE.
   */
  fastify.post('/basics/issue/dispatch', async (req: FastifyRequest, reply) => {
    const basics = readBasics(req.user.metadata)
    if (basics.status !== 'ON_STRENGTH' && basics.status !== 'STEADY_STATE') {
      return reply.throw.badParams('Not on strength — no issue to dispatch')
    }

    const issueNumber = basics.issueLog.length + 1
    const items = itemsForIssue(issueNumber)
    const cogs = costIssue(issueNumber, items)
    if (!cogs.underCeiling || !cogs.meetsMarginFloor) {
      // Ceiling/floor breach never ships — fail loud rather than issue at a loss.
      return reply.throw.internalError('Issue blocked: COGS ceiling or margin floor breached')
    }

    const now = dayjs()
    const nextStatus = issueNumber >= 2 ? 'STEADY_STATE' : 'ON_STRENGTH'
    const next: BasicsState = {
      ...basics,
      status: nextStatus,
      issueLog: [
        ...basics.issueLog,
        {
          issueNumber,
          dispatchedAt: now.toISOString(),
          lines: items.map((i) => i.line),
        },
      ],
      nextIssueAt: now.add(1, 'month').toISOString(),
    }

    await req.user
      .set({ metadata: { ...req.user.metadata, basics: next } })
      .save()

    const context = await getLogContext(req.user)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_issue_dispatched',
      text: `Issue ${issueNumber} dispatched — ${items.length} line items`,
      metadata: { issueNumber, itemCount: items.length, marginPct: cogs.marginPct },
      context,
    })

    sync.emit('settings_updated', { userId: req.user.id })
    return {
      basics: next,
      issue: { issueNumber, dispatchedAt: now.toISOString(), items },
    }
  })
}
