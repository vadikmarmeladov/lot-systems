/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * COSMO® Cube — LOT API connector.
 * Spec: docs/hardware/COSMO-SOFTWARE-API-v1.md
 *
 * Four endpoints a physical device speaks to directly over HTTPS, plus one
 * session-authenticated endpoint a logged-in operator uses to mint a
 * pairing code for first-boot device linking. Device auth is a bearer API
 * key (sha256-hashed at rest), never a session cookie — a COSMO® Cube has
 * no browser and no login.
 */

import crypto from 'crypto'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { Op } from 'sequelize'
import { models } from '#server/models'
import type { HardwareDevice } from '#server/models/hardware-device'

// Pairing codes are short-lived (10 min) and single-use. In-memory is
// sufficient — losing one on a deploy just means the operator re-mints it,
// and a device that hasn't paired yet has nothing to lose.
const PAIRING_CODE_TTL_MS = 10 * 60 * 1000
const pairingCodes = new Map<string, { userId: string; expiresAt: number }>()

function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I ambiguity
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[crypto.randomInt(chars.length)]
  }
  return `LOT-${code}`
}

function hashDeviceKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

function generateDeviceKey(): string {
  return `cq_${crypto.randomBytes(16).toString('hex')}`
}

async function authenticateDevice(req: FastifyRequest): Promise<HardwareDevice | null> {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  const key = auth.slice('Bearer '.length).trim()
  if (!key) return null

  const device = await models.HardwareDevice.findOne({
    where: { apiKeyHash: hashDeviceKey(key), active: true },
  })
  return device
}

export default async (fastify: FastifyInstance) => {
  // --------------------------------------------------------------------
  // Session-authenticated: operator mints a pairing code from the LOT app
  // --------------------------------------------------------------------
  fastify.post('/pairing-code', async (req: FastifyRequest, reply) => {
    if (!req.user) {
      return reply.code(401).send({ error: 'Sign in to pair a device' })
    }

    const code = generatePairingCode()
    pairingCodes.set(code, {
      userId: req.user.id,
      expiresAt: Date.now() + PAIRING_CODE_TTL_MS,
    })

    return reply.send({ pairing_code: code, expires_in: PAIRING_CODE_TTL_MS / 1000 })
  })

  // --------------------------------------------------------------------
  // POST /api/hardware/register — first-boot device registration
  // --------------------------------------------------------------------
  fastify.post('/register', async (req: FastifyRequest, reply) => {
    const body = req.body as { serial?: string; pairing_code?: string; firmware_version?: string }
    const serial = body?.serial?.trim()
    const pairingCode = body?.pairing_code?.trim().toUpperCase()

    if (!serial) {
      return reply.code(400).send({ error: 'serial is required' })
    }
    if (!pairingCode) {
      return reply.code(400).send({ error: 'pairing_code is required' })
    }

    const pairing = pairingCodes.get(pairingCode)
    if (!pairing || pairing.expiresAt < Date.now()) {
      pairingCodes.delete(pairingCode)
      return reply.code(400).send({ error: 'Invalid or expired pairing code' })
    }

    const user = await models.User.findByPk(pairing.userId)
    if (!user) {
      return reply.code(400).send({ error: 'Pairing code owner no longer exists' })
    }

    const apiKey = generateDeviceKey()
    const apiKeyHash = hashDeviceKey(apiKey)

    let device = await models.HardwareDevice.findOne({ where: { serial } })
    if (device) {
      device.apiKeyHash = apiKeyHash
      device.userId = user.id
      device.firmwareVersion = body.firmware_version ?? device.firmwareVersion
      device.active = true
      await device.save()
    } else {
      device = await models.HardwareDevice.create({
        serial,
        apiKeyHash,
        userId: user.id,
        firmwareVersion: body.firmware_version ?? null,
      })
    }

    pairingCodes.delete(pairingCode)

    return reply.send({
      api_key: apiKey,
      user_id: user.id,
      display_name: `${user.firstName || 'Operator'}'s COSMO® Cube`,
    })
  })

  // --------------------------------------------------------------------
  // GET /api/hardware/notifications — device polls for pager-style messages
  // --------------------------------------------------------------------
  fastify.get('/notifications', async (req: FastifyRequest, reply) => {
    const device = await authenticateDevice(req)
    if (!device) return reply.code(401).send({ error: 'Invalid device key' })

    device.lastSeenAt = new Date()
    await device.save()

    if (!device.userId) {
      return reply.code(204).send()
    }

    const notifications = await models.HardwareNotification.findAll({
      where: {
        userId: device.userId,
        delivered: false,
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
      },
      order: [['createdAt', 'ASC']],
      limit: 5,
    })

    if (notifications.length === 0) {
      return reply.code(204).send()
    }

    await models.HardwareNotification.update(
      { delivered: true },
      { where: { id: notifications.map((n) => n.id) } }
    )

    return reply.send({
      notifications: notifications.map((n) => ({
        id: n.id,
        message: n.message,
        source: n.source,
        created_at: n.createdAt,
        expires_at: n.expiresAt,
      })),
      count: notifications.length,
    })
  })

  // --------------------------------------------------------------------
  // POST /api/hardware/log — Copy-button press, sensor snapshot to Log tab
  // --------------------------------------------------------------------
  fastify.post('/log', async (req: FastifyRequest, reply) => {
    const device = await authenticateDevice(req)
    if (!device) return reply.code(401).send({ error: 'Invalid device key' })
    if (!device.userId) {
      return reply.code(409).send({ error: 'Device is not linked to a LOT account' })
    }

    const body = req.body as {
      event?: string
      timestamp?: string
      temperature?: number
      humidity?: number
      pressure?: number
      light_lux?: number
    }
    const eventType = body?.event || 'copy_button'
    const { temperature, humidity, pressure, light_lux: lightLux } = body || {}

    const parts: string[] = []
    if (typeof temperature === 'number') parts.push(`${temperature}°C`)
    if (typeof humidity === 'number') parts.push(`${humidity}% RH`)
    if (typeof pressure === 'number') parts.push(`${pressure} hPa`)

    const log = await models.Log.create({
      userId: device.userId,
      event: 'hardware_log',
      text: `[COSMO® Cube] ${eventType}${parts.length ? ' — ' + parts.join(', ') : ''}`,
      metadata: {
        serial: device.serial,
        source: 'cosmo_cube',
        eventType,
        temperature: temperature ?? null,
        humidity: humidity ?? null,
        pressure: pressure ?? null,
        lightLux: lightLux ?? null,
      },
      createdAt: body?.timestamp ? new Date(body.timestamp) : new Date(),
    } as any)

    await models.HardwareLog.create({
      deviceId: device.id,
      userId: device.userId,
      eventType,
      temperature: temperature ?? null,
      humidity: humidity ?? null,
      pressure: pressure ?? null,
      lightLux: lightLux ?? null,
      rawJson: body || {},
    })

    return reply.send({ status: 'logged', log_id: log.id, message: 'Entry added to Log tab.' })
  })

  // --------------------------------------------------------------------
  // GET /api/hardware/firmware — OTA version check
  // --------------------------------------------------------------------
  fastify.get('/firmware', async (req: FastifyRequest, reply) => {
    const device = await authenticateDevice(req)
    if (!device) return reply.code(401).send({ error: 'Invalid device key' })

    // No firmware builds are hosted yet — see COSMO-FIRMWARE-v1.md.
    // Every device reports up to date until a real release is published.
    return reply.code(204).send()
  })
}
