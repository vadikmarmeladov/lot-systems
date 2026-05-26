import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { models } from '#server/models'
import crypto from 'crypto'
import { sequelize } from '#server/utils/db'
import dayjs from '#server/utils/dayjs'

// ── Token helpers ─────────────────────────────────────────────────────────────

function generateDeviceToken(): string {
  return 'lot_device_' + crypto.randomBytes(24).toString('hex')
}

function generateRegistrationCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase() // e.g. "A3F2B1C9"
}

function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  const m = authHeader.match(/^Bearer (lot_device_[a-f0-9]{48})$/)
  return m ? m[1] : null
}

// Find user whose metadata.devices[] contains a matching apiToken.
// For a 100-unit fleet this full-scan is acceptable; add a GIN index when scaling.
async function findUserByToken(token: string): Promise<any | null> {
  const escaped = token.replace(/'/g, "''")
  const users = await models.User.findAll({
    where: sequelize.literal(
      `"metadata"::jsonb -> 'devices' @> '[{"apiToken":"${escaped}"}]'`
    ),
    limit: 1,
  })
  return users[0] ?? null
}

// ── Request body types ────────────────────────────────────────────────────────

interface RegisterBody {
  registrationCode: string
  deviceSerial: string     // MAC-derived unique ID, e.g. "COSMO-AA:BB:CC:DD:EE:FF"
  deviceModel?: string     // defaults to "COSMO-CIA-v1"
  firmwareVersion?: string
}

interface EventBody {
  event: 'copy_button' | 'startup' | 'heartbeat' | 'camera_capture' | 'ota_update'
  metadata?: Record<string, unknown>
}

interface SensorBody {
  temperature: number    // °C
  humidity: number       // %
  pressure: number       // hPa
  gasResistance?: number // Ω (BME688 AI sensor)
  iaqIndex?: number      // Indoor Air Quality 0-500 (BSEC2 output)
  batteryLevel?: number  // 0–100
  firmwareVersion?: string
}

interface AckBody {
  notificationId: string
}

interface PushBody {
  userId: string
  message: string
  source?: string       // e.g. "memory_engine", "weather", "manual"
  priority?: 'low' | 'normal' | 'high'
}

// ── Route registration ────────────────────────────────────────────────────────

export default async (fastify: FastifyInstance) => {

  // ── POST /api/device/registration-code ─────────────────────────────────────
  // Authenticated user requests a one-time code to link their COSMO CIA device.
  // The code is stored in user metadata, expires in 1 hour.
  fastify.post('/registration-code', {
    preHandler: fastify.authenticate,
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as any

    const code = generateRegistrationCode()
    const expiresAt = dayjs().add(1, 'hour').toISOString()

    const meta = (user.metadata as any) ?? {}
    await models.User.update(
      {
        metadata: {
          ...meta,
          pendingDeviceCode: { code, expiresAt },
        },
      },
      { where: { id: user.id } }
    )

    return { code, expiresAt, instructions: 'Enter this code in the COSMO CIA WiFi setup portal.' }
  })

  // ── POST /api/device/register ───────────────────────────────────────────────
  // Device presents the one-time code + its serial to receive a long-lived API token.
  // No authentication required — the code is the credential.
  fastify.post<{ Body: RegisterBody }>('/register', async (req, reply) => {
    const { registrationCode, deviceSerial, deviceModel = 'COSMO-CIA-v1', firmwareVersion = 'unknown' } = req.body

    if (!registrationCode || !deviceSerial) {
      return reply.code(400).send({ error: 'registrationCode and deviceSerial required' })
    }

    // Find user whose pending code matches
    const users = await models.User.findAll({
      where: sequelize.literal(
        `"metadata"::jsonb -> 'pendingDeviceCode' ->> 'code' = '${registrationCode.replace(/'/g, "''")}'`
      ),
      limit: 1,
    })
    const user = users[0] as any
    if (!user) {
      return reply.code(401).send({ error: 'Invalid or expired registration code' })
    }

    const meta = user.metadata ?? {}
    const pending = meta.pendingDeviceCode

    // Check expiry
    if (!pending || dayjs().isAfter(dayjs(pending.expiresAt))) {
      return reply.code(401).send({ error: 'Registration code has expired. Generate a new one.' })
    }

    // Check if device serial already registered
    const devices: any[] = meta.devices ?? []
    if (devices.find((d: any) => d.deviceSerial === deviceSerial)) {
      return reply.code(409).send({ error: 'Device already registered. Use /api/device/unregister first.' })
    }

    const deviceId = crypto.randomUUID()
    const apiToken = generateDeviceToken()

    const newDevice = {
      deviceId,
      deviceSerial,
      deviceModel,
      firmwareVersion,
      apiToken,
      registeredAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    }

    await models.User.update(
      {
        metadata: {
          ...meta,
          devices: [...devices, newDevice],
          pendingDeviceCode: null, // consume the code
        },
      },
      { where: { id: user.id } }
    )

    // Log the registration event
    await models.Log.create({
      userId: user.id,
      event: 'device_registered',
      text: `COSMO CIA device registered: ${deviceSerial}`,
      metadata: { deviceId, deviceModel, firmwareVersion },
    })

    console.log(`[DEVICE-API] Device registered: ${deviceSerial} → user ${user.id}`)

    return {
      deviceId,
      apiToken,
      message: 'Device registered successfully. Store apiToken securely in device flash.',
      userId: user.id,
    }
  })

  // ── DELETE /api/device/unregister ───────────────────────────────────────────
  fastify.delete('/unregister', async (req: FastifyRequest, reply: FastifyReply) => {
    const token = extractToken(req.headers.authorization)
    if (!token) return reply.code(401).send({ error: 'Bearer token required' })

    const user = await findUserByToken(token) as any
    if (!user) return reply.code(401).send({ error: 'Invalid device token' })

    const meta = user.metadata ?? {}
    const devices: any[] = meta.devices ?? []
    const device = devices.find((d: any) => d.apiToken === token)

    await models.User.update(
      {
        metadata: {
          ...meta,
          devices: devices.filter((d: any) => d.apiToken !== token),
        },
      },
      { where: { id: user.id } }
    )

    await models.Log.create({
      userId: user.id,
      event: 'device_unregistered',
      text: `COSMO CIA device unregistered: ${device?.deviceSerial ?? 'unknown'}`,
      metadata: { deviceId: device?.deviceId },
    })

    return { message: 'Device unregistered.' }
  })

  // ── GET /api/device/ping ────────────────────────────────────────────────────
  // Heartbeat endpoint. Returns device config and current time.
  fastify.get('/ping', async (req: FastifyRequest, reply: FastifyReply) => {
    const token = extractToken(req.headers.authorization)
    if (!token) return reply.code(401).send({ error: 'Bearer token required' })

    const user = await findUserByToken(token) as any
    if (!user) return reply.code(401).send({ error: 'Invalid device token' })

    const meta = user.metadata ?? {}
    const device = (meta.devices ?? []).find((d: any) => d.apiToken === token)

    // Update lastSeenAt
    const devices = (meta.devices ?? []).map((d: any) =>
      d.apiToken === token ? { ...d, lastSeenAt: new Date().toISOString() } : d
    )
    await models.User.update(
      { metadata: { ...meta, devices } },
      { where: { id: user.id } }
    )

    return {
      ok: true,
      serverTime: new Date().toISOString(),
      deviceId: device?.deviceId,
      deviceModel: device?.deviceModel,
      userId: user.id,
      config: {
        notificationPollIntervalSeconds: 30,
        sensorUploadIntervalSeconds: 300,
        displayBrightness: meta.deviceConfig?.displayBrightness ?? 100,
        notifications: meta.deviceConfig?.notifications ?? true,
      },
    }
  })

  // ── POST /api/device/event ──────────────────────────────────────────────────
  // Device submits a user-triggered event (Copy button, etc.)
  // The event is written to the Log tab visible on lot-systems.com.
  fastify.post<{ Body: EventBody }>('/event', async (req, reply) => {
    const token = extractToken(req.headers.authorization)
    if (!token) return reply.code(401).send({ error: 'Bearer token required' })

    const user = await findUserByToken(token) as any
    if (!user) return reply.code(401).send({ error: 'Invalid device token' })

    const { event, metadata = {} } = req.body
    if (!event) return reply.code(400).send({ error: 'event field required' })

    const meta = user.metadata ?? {}
    const device = (meta.devices ?? []).find((d: any) => d.apiToken === token)

    const eventMap: Record<string, string> = {
      copy_button: 'device_copy_button',
      startup: 'device_startup',
      heartbeat: 'device_heartbeat',
      camera_capture: 'device_camera_capture',
      ota_update: 'device_ota_update',
    }

    const logEvent = eventMap[event] ?? `device_${event}`
    const logText = event === 'copy_button'
      ? 'COSMO CIA — Copy button pressed'
      : `COSMO CIA — ${event}`

    const log = await models.Log.create({
      userId: user.id,
      event: logEvent,
      text: logText,
      metadata: {
        deviceId: device?.deviceId,
        deviceSerial: device?.deviceSerial,
        deviceModel: device?.deviceModel,
        source: 'cosmo_cia_hardware',
        ...metadata,
      },
    })

    console.log(`[DEVICE-API] Event logged: ${logEvent} for user ${user.id}`)

    return { ok: true, logId: log.id, event: logEvent }
  })

  // ── POST /api/device/sensor ─────────────────────────────────────────────────
  // Device submits weather/environmental sensor data (BME688).
  fastify.post<{ Body: SensorBody }>('/sensor', async (req, reply) => {
    const token = extractToken(req.headers.authorization)
    if (!token) return reply.code(401).send({ error: 'Bearer token required' })

    const user = await findUserByToken(token) as any
    if (!user) return reply.code(401).send({ error: 'Invalid device token' })

    const {
      temperature,
      humidity,
      pressure,
      gasResistance,
      iaqIndex,
      batteryLevel,
      firmwareVersion,
    } = req.body

    const meta = user.metadata ?? {}
    const device = (meta.devices ?? []).find((d: any) => d.apiToken === token)

    // Store latest sensor reading in user metadata for profile display
    const sensorReading = {
      temperature,
      humidity,
      pressure,
      gasResistance,
      iaqIndex,
      batteryLevel,
      recordedAt: new Date().toISOString(),
      deviceId: device?.deviceId,
    }

    const devices = (meta.devices ?? []).map((d: any) =>
      d.apiToken === token
        ? { ...d, lastSensorReading: sensorReading, lastSeenAt: new Date().toISOString(), firmwareVersion: firmwareVersion ?? d.firmwareVersion }
        : d
    )

    await models.User.update(
      {
        metadata: {
          ...meta,
          devices,
          latestDeviceSensor: sensorReading,
        },
      },
      { where: { id: user.id } }
    )

    // Log sensor data for analytics
    await models.Log.create({
      userId: user.id,
      event: 'device_sensor',
      text: `COSMO CIA sensor: ${temperature?.toFixed(1)}°C, ${humidity?.toFixed(0)}% RH`,
      metadata: sensorReading,
    })

    return { ok: true, recorded: new Date().toISOString() }
  })

  // ── GET /api/device/notifications ──────────────────────────────────────────
  // Device polls for pending notifications to display on screen.
  // Returns up to 10 undelivered notifications.
  fastify.get('/notifications', async (req: FastifyRequest, reply: FastifyReply) => {
    const token = extractToken(req.headers.authorization)
    if (!token) return reply.code(401).send({ error: 'Bearer token required' })

    const user = await findUserByToken(token) as any
    if (!user) return reply.code(401).send({ error: 'Invalid device token' })

    // Fetch undelivered device notifications for this user
    const notifications = await models.Log.findAll({
      where: {
        userId: user.id,
        event: 'device_notification',
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    })

    const pending = notifications
      .filter((n: any) => !n.metadata?.delivered)
      .map((n: any) => ({
        id: n.id,
        message: n.text,
        source: n.metadata?.source ?? 'lot_system',
        priority: n.metadata?.priority ?? 'normal',
        createdAt: n.createdAt,
      }))

    return {
      notifications: pending,
      count: pending.length,
      serverTime: new Date().toISOString(),
    }
  })

  // ── POST /api/device/notifications/ack ────────────────────────────────────
  // Device acknowledges delivery of a notification (marks it delivered).
  fastify.post<{ Body: AckBody }>('/notifications/ack', async (req, reply) => {
    const token = extractToken(req.headers.authorization)
    if (!token) return reply.code(401).send({ error: 'Bearer token required' })

    const user = await findUserByToken(token) as any
    if (!user) return reply.code(401).send({ error: 'Invalid device token' })

    const { notificationId } = req.body
    if (!notificationId) return reply.code(400).send({ error: 'notificationId required' })

    const notif = await models.Log.findOne({
      where: { id: notificationId, userId: user.id, event: 'device_notification' },
    }) as any

    if (!notif) return reply.code(404).send({ error: 'Notification not found' })

    await models.Log.update(
      {
        metadata: { ...(notif.metadata ?? {}), delivered: true, deliveredAt: new Date().toISOString() },
      },
      { where: { id: notificationId } }
    )

    return { ok: true }
  })

  // ── POST /api/device/push ───────────────────────────────────────────────────
  // Server-side (admin / AI engine) pushes a notification to a user's device.
  // Called internally by the Memory Engine, Weather Engine, or admin.
  // Requires valid user session (not device token).
  fastify.post<{ Body: PushBody }>('/push', {
    preHandler: fastify.authenticate,
  }, async (req, reply) => {
    const caller = req.user as any
    const { userId, message, source = 'lot_system', priority = 'normal' } = req.body

    if (!userId || !message) {
      return reply.code(400).send({ error: 'userId and message required' })
    }

    // Only admins can push to other users; users can push to themselves
    const isAdmin = (caller.tags ?? []).some((t: string) => t.toLowerCase() === 'admin')
    if (caller.id !== userId && !isAdmin) {
      return reply.code(403).send({ error: 'Cannot push notifications to other users' })
    }

    // Verify target user has a registered device
    const targetUser = await models.User.findOne({ where: { id: userId } }) as any
    if (!targetUser) return reply.code(404).send({ error: 'User not found' })

    const devices = targetUser.metadata?.devices ?? []
    if (devices.length === 0) {
      return reply.code(404).send({ error: 'No COSMO CIA device registered for this user' })
    }

    const log = await models.Log.create({
      userId,
      event: 'device_notification',
      text: message,
      metadata: {
        source,
        priority,
        delivered: false,
        pushedBy: caller.id,
        pushedAt: new Date().toISOString(),
      },
    })

    console.log(`[DEVICE-API] Notification pushed to ${userId}: "${message}"`)

    return { ok: true, notificationId: log.id, queued: new Date().toISOString() }
  })

  // ── GET /api/device/devices ─────────────────────────────────────────────────
  // Authenticated user lists their registered COSMO CIA devices.
  fastify.get('/devices', {
    preHandler: fastify.authenticate,
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as any
    const meta = (user.metadata as any) ?? {}
    const devices = (meta.devices ?? []).map((d: any) => ({
      deviceId: d.deviceId,
      deviceSerial: d.deviceSerial,
      deviceModel: d.deviceModel,
      firmwareVersion: d.firmwareVersion,
      registeredAt: d.registeredAt,
      lastSeenAt: d.lastSeenAt,
      // Never return apiToken to the browser
    }))

    return { devices, count: devices.length }
  })
}
