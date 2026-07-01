/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 / BASIC RATION MODULE — MONTH 2
 * UPGRADE control + state machine: PENDING → ON STRENGTH → STOOD DOWN.
 * Roster (sizing, shipping, cadence) and issue log live in user.metadata.basics —
 * kept off the `tags` column, which is CEO-gated (see admin-api.ts canEditTags()).
 * Requires USERSHIP / AI as base layer. STAND DOWN drops the ration, retains AI.
 */

import { FastifyInstance, FastifyRequest } from 'fastify'
import dayjs from '#server/utils/dayjs'
import type { BasicsState, BasicsIssueLogEntry } from '#shared/types'
import { sync } from '../sync.js'

function hasUsership(tags: string[]): boolean {
  return tags.some((t) => t.toLowerCase() === 'usership')
}

function getBasicsState(user: { metadata: Record<string, any> }): BasicsState | null {
  return (user.metadata?.basics as BasicsState | undefined) || null
}

async function saveBasicsState(user: any, state: BasicsState) {
  await user.set({ metadata: { ...(user.metadata || {}), basics: state } }).save()
}

export function registerBasicsRoutes(fastify: FastifyInstance) {
  // GET /api/basics/state — current roster status for the calling user
  fastify.get('/basics/state', async (req: FastifyRequest, reply) => {
    return { state: getBasicsState(req.user) }
  })

  // POST /api/basics/enroll — roster intake, sets status PENDING
  fastify.post(
    '/basics/enroll',
    async (
      req: FastifyRequest<{
        Body: { size: string; shippingAddress: string; cadenceStart?: string }
      }>,
      reply
    ) => {
      if (!hasUsership(req.user.tags)) {
        return reply.throw.accessDenied('BASIC ration requires USERSHIP / AI base layer')
      }

      const size = (req.body?.size || '').trim()
      const shippingAddress = (req.body?.shippingAddress || '').trim()
      if (!size || !shippingAddress) {
        return reply.throw.badParams('size and shippingAddress are required')
      }
      if (size.length > 40 || shippingAddress.length > 500) {
        return reply.throw.badParams('field too long')
      }

      const existing = getBasicsState(req.user)
      if (existing?.status === 'ON_STRENGTH') {
        return reply.throw.conflict('Already ON STRENGTH')
      }

      const cadenceStart =
        req.body?.cadenceStart || dayjs().add(1, 'month').startOf('month').toISOString()

      const state: BasicsState = {
        status: 'PENDING',
        roster: { size, shippingAddress, cadenceStart },
        enrolledAt: existing?.enrolledAt || dayjs().toISOString(),
        standDownAt: null,
        issueLog: existing?.issueLog || [],
      }

      await saveBasicsState(req.user, state)
      await fastify.models.Log.create({
        userId: req.user.id,
        event: 'basics_roster_intake',
        metadata: { size, cadenceStart },
      })
      sync.emit('settings_updated', { userId: req.user.id })

      return { state }
    }
  )

  // POST /api/basics/confirm — PENDING → ON STRENGTH, schedules first issue
  fastify.post('/basics/confirm', async (req: FastifyRequest, reply) => {
    const state = getBasicsState(req.user)
    if (!state || state.status !== 'PENDING') {
      return reply.throw.conflict('No pending enrollment to confirm')
    }

    const entry: BasicsIssueLogEntry = {
      date: dayjs().toISOString(),
      status: 'SCHEDULED',
      note: `First issue scheduled for cadence start ${state.roster?.cadenceStart ?? ''}`.trim(),
    }
    const nextState: BasicsState = {
      ...state,
      status: 'ON_STRENGTH',
      issueLog: [...state.issueLog, entry],
    }

    await saveBasicsState(req.user, nextState)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_on_strength',
      metadata: { cadenceStart: state.roster?.cadenceStart },
    })
    sync.emit('settings_updated', { userId: req.user.id })

    return { state: nextState }
  })

  // POST /api/basics/stand-down — drops the ration, retains USERSHIP / AI
  fastify.post('/basics/stand-down', async (req: FastifyRequest, reply) => {
    const state = getBasicsState(req.user)
    if (!state || state.status === 'STOOD_DOWN') {
      return reply.throw.conflict('Not currently ON STRENGTH')
    }

    const entry: BasicsIssueLogEntry = {
      date: dayjs().toISOString(),
      status: 'STOOD_DOWN',
      note: 'Ration withdrawn on operator request. AI layer retained.',
    }
    const nextState: BasicsState = {
      ...state,
      status: 'STOOD_DOWN',
      standDownAt: dayjs().toISOString(),
      issueLog: [...state.issueLog, entry],
    }

    await saveBasicsState(req.user, nextState)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'basics_stand_down',
      metadata: {},
    })
    sync.emit('settings_updated', { userId: req.user.id })

    return { state: nextState }
  })
}
