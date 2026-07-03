/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 — BASIC (RATION) MODULE API
 *
 * State machine: NONE -> PENDING -> ON_STRENGTH -> STEADY_STATE -> STAND_DOWN
 * Persisted on req.user.metadata.basicsRation (JSONB, same pattern as
 * theme/badges). No dedicated table — roster is small, low-write.
 *
 * Gate: enrollment requires the 'usership' tag (AI plan). This is the
 * UPGRADE path named in LOT-FM-001 — Usership -> Basic ration, additive.
 * STAND DOWN drops the ration record only; the usership tag (and AI
 * access) is never touched here.
 */

import { FastifyInstance, FastifyRequest } from 'fastify'
import { sync } from '../sync.js'
import { getLogContext } from '#server/utils/logs'
import {
  RationRecord,
  RationRoster,
  NO_RATION_RECORD,
  getLoadForMonth,
  nextStatusAfterIssue,
  addMonthsIso,
} from '#shared/basicsRation'

function readRation(user: { metadata: Record<string, any> }): RationRecord {
  return (user.metadata?.basicsRation as RationRecord | undefined) || NO_RATION_RECORD
}

async function writeRation(req: FastifyRequest, ration: RationRecord) {
  const currentMetadata = req.user.metadata || {}
  await req.user.set({ metadata: { ...currentMetadata, basicsRation: ration } }).save()
  sync.emit('settings_updated', { userId: req.user.id })
}

export function registerBasicsRoutes(fastify: FastifyInstance) {
  // GET /api/basics/roster — current ration record for the operator
  fastify.get('/basics/roster', async (req: FastifyRequest, reply) => {
    return readRation(req.user)
  })

  // POST /api/basics/upgrade — NONE|STAND_DOWN -> PENDING (roster intake)
  fastify.post<{ Body: RationRoster }>(
    '/basics/upgrade',
    async (req: FastifyRequest<{ Body: RationRoster }>, reply) => {
      const hasUsership = req.user.tags.some((t) => t.toLowerCase() === 'usership')
      if (!hasUsership) {
        reply.status(403)
        throw new Error('UPGRADE requires active USERSHIP (AI plan)')
      }

      const current = readRation(req.user)
      if (current.status === 'ON_STRENGTH' || current.status === 'STEADY_STATE') {
        reply.status(409)
        throw new Error('Already ON STRENGTH')
      }

      const { shirtSize, sockSize, shippingName, shippingAddress, shippingCity, shippingCountry } = req.body
      if (!shirtSize || !sockSize || !shippingName || !shippingAddress || !shippingCity || !shippingCountry) {
        reply.status(400)
        throw new Error('Roster intake incomplete')
      }

      const next: RationRecord = {
        status: 'PENDING',
        roster: { shirtSize, sockSize, shippingName, shippingAddress, shippingCity, shippingCountry },
        cadenceStart: null,
        nextIssue: null,
        issueLog: [],
        enrolledAt: new Date().toISOString(),
        standDownAt: null,
      }
      await writeRation(req, next)

      const context = await getLogContext(req.user)
      await fastify.models.Log.create({
        userId: req.user.id,
        event: 'ration_pending',
        text: 'LOT-FM-001 roster submitted.',
        metadata: { status: 'PENDING' },
        context,
      })

      return next
    }
  )

  // POST /api/basics/confirm — PENDING -> ON_STRENGTH
  fastify.post('/basics/confirm', async (req: FastifyRequest, reply) => {
    const current = readRation(req.user)
    if (current.status !== 'PENDING') {
      reply.status(409)
      throw new Error('No pending roster to confirm')
    }

    const now = new Date().toISOString()
    const next: RationRecord = {
      ...current,
      status: 'ON_STRENGTH',
      cadenceStart: now,
      nextIssue: addMonthsIso(now, 1),
    }
    await writeRation(req, next)

    const context = await getLogContext(req.user)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'ration_on_strength',
      text: 'LOT-FM-001 operator placed ON STRENGTH.',
      metadata: { status: 'ON_STRENGTH' },
      context,
    })

    return next
  })

  // POST /api/basics/stand-down — ON_STRENGTH|STEADY_STATE -> STAND_DOWN
  fastify.post('/basics/stand-down', async (req: FastifyRequest, reply) => {
    const current = readRation(req.user)
    if (current.status === 'NONE' || current.status === 'STAND_DOWN') {
      reply.status(409)
      throw new Error('Not currently on strength')
    }

    const next: RationRecord = {
      ...current,
      status: 'STAND_DOWN',
      standDownAt: new Date().toISOString(),
    }
    await writeRation(req, next)

    const context = await getLogContext(req.user)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'ration_stand_down',
      text: 'LOT-FM-001 ration dropped. USERSHIP/AI retained.',
      metadata: { status: 'STAND_DOWN' },
      context,
    })

    return next
  })

  // POST /api/basics/next-issue — quartermaster action: logs the month's
  // load, advances NEXT ISSUE, auto-promotes to STEADY_STATE at 3 issues.
  // Admin-gated: dispatch is a fulfillment-side action, not self-service.
  fastify.post<{ Body: { userId: string } }>(
    '/basics/next-issue',
    async (req: FastifyRequest<{ Body: { userId: string } }>, reply) => {
      if (!req.user.isAdmin()) {
        reply.status(401)
        throw new Error('Access denied: quartermaster action')
      }

      const targetId = req.body.userId || req.user.id
      const target = await fastify.models.User.findByPk(targetId)
      if (!target) {
        reply.status(404)
        throw new Error('Operator not found')
      }

      const current = readRation(target)
      if (current.status !== 'ON_STRENGTH' && current.status !== 'STEADY_STATE') {
        reply.status(409)
        throw new Error('Operator is not on strength')
      }

      const monthIndex = current.issueLog.length
      const load = getLoadForMonth(monthIndex)
      const now = new Date().toISOString()
      const issueLog = [
        ...current.issueLog,
        { issuedAt: now, monthIndex, items: load.map((i) => i.code) },
      ]

      const next: RationRecord = {
        ...current,
        status: nextStatusAfterIssue(issueLog.length),
        nextIssue: addMonthsIso(now, 1),
        issueLog,
      }

      const targetMetadata = target.metadata || {}
      await target.set({ metadata: { ...targetMetadata, basicsRation: next } }).save()
      sync.emit('settings_updated', { userId: target.id })

      const context = await getLogContext(target)
      await fastify.models.Log.create({
        userId: target.id,
        event: 'ration_issue',
        text: `LOT-FM-001 issue ${monthIndex + 1} dispatched.`,
        metadata: { status: next.status, monthIndex, itemCount: load.length },
        context,
      })

      return next
    }
  )
}
