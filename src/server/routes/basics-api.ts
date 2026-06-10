/**
 * LOT SYSTEMS CORPORATION
 * LOT-FM-001 / BASIC RATION MODULE — SERVER API
 * Routes: /api/basics/*
 */

import { FastifyInstance } from 'fastify'
import {
  BasicsMetadata,
  BasicsRoster,
  getIssueItemIds,
  calcNextIssueDate,
  calcIssueNumber,
  MONTH_NAMES,
} from '#shared/constants/basics'

export function registerBasicsRoutes(fastify: FastifyInstance) {
  // Public: count of active subscribers
  fastify.get('/basics/strength', async (_req, reply) => {
    try {
      const fastifyAny = fastify as any
      const count = await fastifyAny.models.User.count({
        where: fastifyAny.sequelize.literal(
          `(metadata->'basics'->>'status') IN ('ON_STRENGTH','STEADY_STATE')`
        ),
      })
      return reply.send({ count: count || 0 })
    } catch {
      return reply.send({ count: 0 })
    }
  })

  // GET /api/basics/status — current user's basics subscription state
  fastify.get('/basics/status', async (req: any, reply) => {
    const metadata: BasicsMetadata = (req.user.metadata?.basics) || {
      status: null,
      issues: [],
    }
    return reply.send({ basics: metadata })
  })

  // POST /api/basics/upgrade — initiate upgrade (USERSHIP → PENDING)
  fastify.post('/basics/upgrade', async (req: any, reply) => {
    const currentMeta = req.user.metadata || {}
    const basics: BasicsMetadata = currentMeta.basics || { issues: [] }

    if (basics.status === 'ON_STRENGTH' || basics.status === 'STEADY_STATE') {
      return reply.status(409).send({ error: 'ALREADY ON STRENGTH' })
    }

    const updated: BasicsMetadata = {
      ...basics,
      status: 'PENDING',
      upgradedAt: new Date().toISOString(),
      issues: basics.issues || [],
    }

    await req.user.set({ metadata: { ...currentMeta, basics: updated } }).save()
    return reply.send({ basics: updated })
  })

  // POST /api/basics/roster — save roster, confirm enrollment (PENDING → ON_STRENGTH)
  fastify.post('/basics/roster', async (req: any, reply) => {
    const currentMeta = req.user.metadata || {}
    const basics: BasicsMetadata = currentMeta.basics || { issues: [] }

    const roster = req.body as BasicsRoster
    if (!roster.firstName || !roster.address || !roster.city || !roster.zip || !roster.country) {
      return reply.status(400).send({ error: 'INCOMPLETE ROSTER' })
    }

    const cadenceStart = roster.cadenceStart || new Date().toISOString().slice(0, 10)
    const nextIssueDate = calcNextIssueDate(cadenceStart)

    const updated: BasicsMetadata = {
      ...basics,
      status: 'ON_STRENGTH',
      roster: { ...roster, cadenceStart },
      nextIssueDate: nextIssueDate.toISOString().slice(0, 10),
      issues: basics.issues || [],
    }

    await req.user.set({ metadata: { ...currentMeta, basics: updated } }).save()
    return reply.send({ basics: updated })
  })

  // POST /api/basics/standdown — downgrade (drops ration, retains AI)
  fastify.post('/basics/standdown', async (req: any, reply) => {
    const currentMeta = req.user.metadata || {}
    const basics: BasicsMetadata = currentMeta.basics || { issues: [] }

    const updated: BasicsMetadata = {
      ...basics,
      status: 'STAND_DOWN',
      standDownAt: new Date().toISOString(),
    }

    await req.user.set({ metadata: { ...currentMeta, basics: updated } }).save()
    return reply.send({ basics: updated })
  })

  // GET /api/basics/issues — issue log for the current user
  fastify.get('/basics/issues', async (req: any, reply) => {
    const basics: BasicsMetadata = (req.user.metadata?.basics) || { issues: [] }
    const issues = basics.issues || []

    if (!basics.roster?.cadenceStart) {
      return reply.send({ issues: [], nextIssue: null })
    }

    const now = new Date()
    const nextDate = calcNextIssueDate(basics.roster.cadenceStart, now)
    const nextNumber = calcIssueNumber(basics.roster.cadenceStart, nextDate)
    const nextItemIds = getIssueItemIds(nextNumber)

    return reply.send({
      issues,
      nextIssue: {
        issueNumber: nextNumber,
        month: nextDate.getMonth() + 1,
        year: nextDate.getFullYear(),
        monthName: MONTH_NAMES[nextDate.getMonth()],
        date: nextDate.toISOString().slice(0, 10),
        itemIds: nextItemIds,
        itemCount: nextItemIds.length,
      },
    })
  })

  // POST /api/basics/record-issue — admin: mark an issue as shipped
  fastify.post('/basics/record-issue', async (req: any, reply) => {
    if (!req.user.isAdmin()) {
      return reply.status(403).send({ error: 'ADMIN ONLY' })
    }

    const { userId, issueNumber, month, year } = req.body as {
      userId: string
      issueNumber: number
      month: number
      year: number
    }

    const target = await (fastify as any).models.User.findByPk(userId)
    if (!target) return reply.status(404).send({ error: 'USER NOT FOUND' })

    const currentMeta = target.metadata || {}
    const basics: BasicsMetadata = currentMeta.basics || { issues: [] }

    const itemIds = getIssueItemIds(issueNumber)
    const newIssue = {
      issueNumber,
      month,
      year,
      shippedAt: new Date().toISOString(),
      deliveredAt: null,
      itemIds,
    }

    const updated: BasicsMetadata = {
      ...basics,
      status: 'STEADY_STATE',
      issues: [...(basics.issues || []), newIssue],
    }

    if (basics.roster?.cadenceStart) {
      const nextDate = calcNextIssueDate(basics.roster.cadenceStart, new Date())
      updated.nextIssueDate = nextDate.toISOString().slice(0, 10)
    }

    await target.set({ metadata: { ...currentMeta, basics: updated } }).save()
    return reply.send({ basics: updated })
  })
}
