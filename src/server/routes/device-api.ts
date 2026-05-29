/**
 * LOT SYSTEMS CORPORATION
 * COSMO® CIA — Device API Route
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * Handles: CIA device registration, WebSocket notifications,
 * COPY button log, weather sync, session sync, OTA check, pairing token.
 */

import crypto from 'crypto'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import config from '#server/config'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterBody {
  device_id: string
  firmware_version?: string
  hardware_revision?: string
  mac_address?: string
}

interface LogBody {
  device_id: string
  action: 'copy'
  notification_id?: string
  notification_text?: string
  timestamp?: string
  weather?: {
    temp_c?: number
    humidity_pct?: number
    pressure_hpa?: number
  }
}

interface WeatherBody {
  device_id: string
  temp_c: number
  humidity_pct?: number
  pressure_hpa?: number
  timestamp?: string
}

interface OtaCheckQuery {
  current_version?: string
  device_id?: string
}

// ─── Token verification helper ────────────────────────────────────────────────

async function extractDeviceToken(req: FastifyRequest): Promise<string | null> {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7)
}

const LATEST_FIRMWARE_VERSION = '1.0.0'

// ─── Fastify plugin ───────────────────────────────────────────────────────────

export default async function deviceApiRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/device/register
   * Exchanges a short-lived pairing token for a permanent device bearer token.
   * Called by the CIA device camera after scanning the QR code from Settings.
   */
  fastify.post<{ Body: RegisterBody }>('/device/register', async (req, reply) => {
    const auth = req.headers['authorization']
    if (!auth || !auth.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing pairing token' })
    }

    const { device_id, firmware_version, hardware_revision, mac_address } = req.body

    if (!device_id || typeof device_id !== 'string') {
      return reply.status(400).send({ error: 'device_id is required' })
    }

    // TODO: verify pairing token from PairingToken table (single-use, 10-min expiry)
    // const pairingToken = await db.pairingToken.findUnique({ where: { token: auth.slice(7) } })
    // if (!pairingToken || pairingToken.expiresAt < new Date() || pairingToken.usedAt) {
    //   return reply.status(401).send({ error: 'Invalid or expired pairing token' })
    // }

    const deviceToken = `d_tok_${crypto.randomBytes(32).toString('hex')}`

    // TODO: persist once Prisma migration is applied:
    // await db.pairingToken.update({ where: { token: auth.slice(7) }, data: { usedAt: new Date() } })
    // await db.deviceToken.upsert({
    //   where: { deviceId: device_id },
    //   create: { id: cuid(), userId: pairingToken.userId, deviceId: device_id, token: deviceToken,
    //             firmwareVersion: firmware_version, hardwareRev: hardware_revision, macAddress: mac_address },
    //   update: { token: deviceToken, firmwareVersion: firmware_version, updatedAt: new Date() },
    // })

    return reply.status(201).send({
      device_token: deviceToken,
      user_id: 'pending_db_migration',
      user_name: 'LOT User',
      server_time: new Date().toISOString(),
      ota_check_url: `${config.appHost}/api/device/ota/check`,
    })
  })

  /**
   * POST /api/device/log
   * Records a COPY button press and writes a device_ack entry to the user's Log tab.
   */
  fastify.post<{ Body: LogBody }>('/device/log', async (req, reply) => {
    const token = await extractDeviceToken(req)
    if (!token) return reply.status(401).send({ error: 'Missing device token' })

    const { device_id, action, notification_id, notification_text, timestamp, weather } = req.body

    if (!device_id || !action) {
      return reply.status(400).send({ error: 'device_id and action are required' })
    }
    if (action !== 'copy') {
      return reply.status(400).send({ error: `Unknown action: ${action}` })
    }

    const logEntryId = `log_${crypto.randomBytes(6).toString('hex')}`

    // TODO: once DeviceToken + DeviceLog tables exist:
    // const device = await db.deviceToken.findUnique({ where: { token } })
    // if (!device) return reply.status(401).send({ error: 'Invalid device token' })
    // await db.deviceLog.create({ data: { id: cuid(), deviceTokenId: device.id, action,
    //   notificationId: notification_id, notificationText: notification_text,
    //   weatherTemp: weather?.temp_c, weatherHumidity: weather?.humidity_pct,
    //   weatherPressure: weather?.pressure_hpa, deviceTimestamp: timestamp ? new Date(timestamp) : null }})
    // Also create a user-visible LogMessage entry of type 'device_ack' in the existing log system

    req.log.info({ device_id, action, notification_text }, '[CIA] COPY button logged')

    return reply.send({ log_entry_id: logEntryId, message: 'Logged successfully' })
  })

  /**
   * POST /api/device/weather
   * Receives BME280 sensor readings from the CIA device (every 60 s).
   */
  fastify.post<{ Body: WeatherBody }>('/device/weather', async (req, reply) => {
    const token = await extractDeviceToken(req)
    if (!token) return reply.status(401).send({ error: 'Missing device token' })

    const { device_id, temp_c, humidity_pct, pressure_hpa } = req.body

    if (!device_id || temp_c == null) {
      return reply.status(400).send({ error: 'device_id and temp_c are required' })
    }

    // TODO: store on DeviceToken record, optionally update user's weather display
    // await db.deviceToken.update({ where: { deviceId: device_id },
    //   data: { tempC: temp_c, humidityPct: humidity_pct, pressureHpa: pressure_hpa, lastSeenAt: new Date() }})

    return reply.send({ accepted: true })
  })

  /**
   * POST /api/device/session-sync
   * Receives LZ4-compressed CBOR notification history from device on reconnect.
   */
  fastify.post('/device/session-sync', async (req, reply) => {
    const token = await extractDeviceToken(req)
    if (!token) return reply.status(401).send({ error: 'Missing device token' })

    // Binary body is available in req.body — skipped in this stub (no CBOR dep yet)
    return reply.send({ accepted: true, last_seen_id: null, pending_count: 0 })
  })

  /**
   * GET /api/device/ota/check
   * Returns whether a newer firmware version is available for the device.
   */
  fastify.get<{ Querystring: OtaCheckQuery }>('/device/ota/check', async (req, reply) => {
    const token = await extractDeviceToken(req)
    if (!token) return reply.status(401).send({ error: 'Missing device token' })

    const { current_version } = req.query

    if (!current_version || current_version === LATEST_FIRMWARE_VERSION) {
      return reply.send({ update_available: false })
    }

    return reply.send({
      update_available: true,
      version: LATEST_FIRMWARE_VERSION,
      url: `${config.appHost}/firmware/cia-${LATEST_FIRMWARE_VERSION}.bin`,
      sha256: '',
      size_bytes: 0,
      mandatory: false,
    })
  })

  /**
   * POST /api/device/pairing-token
   * Generates a short-lived QR pairing token. Requires authenticated user session.
   */
  fastify.post('/device/pairing-token', async (req, reply) => {
    if (!req.user) return reply.status(401).send({ error: 'Login required' })

    const token = crypto.randomBytes(16).toString('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // TODO: persist in PairingToken table
    // await db.pairingToken.create({ data: { id: cuid(), userId: req.user.id, token, expiresAt }})

    const pairingUrl = `lot://pair?token=${token}`

    return reply.status(201).send({
      pairing_token: token,
      pairing_url: pairingUrl,
      expires_at: expiresAt.toISOString(),
      qr_data: pairingUrl,
    })
  })
}
