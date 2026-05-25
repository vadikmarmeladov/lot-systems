/**
 * COSMO® CIA — LOT Device API
 * Handles hardware device registration, authentication, notifications,
 * Copy button signals, sensor data upload, and OTA firmware checks.
 *
 * All device endpoints are under: /api/device/*
 * Authentication: Bearer device token in Authorization header
 */

import crypto from 'crypto'
import { FastifyInstance, FastifyRequest } from 'fastify'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DeviceRecord {
  id: string
  token: string
  name: string
  firmwareVersion: string
  lastSeenAt: string
  batteryPct: number | null
  registeredAt: string
}

interface SensorSnapshot {
  temperature_c?: number
  humidity_pct?: number
  pressure_hpa?: number
  iaq_score?: number
  battery_pct?: number
}

interface DeviceNotification {
  id: string
  message: string
  type: string
  priority: 'normal' | 'high'
  created_at: string
  expires_at: string | null
  read: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function generateDeviceToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

function getUserDevices(metadata: Record<string, any>): DeviceRecord[] {
  return Array.isArray(metadata?.devices) ? metadata.devices : []
}

function getUserDeviceNotifications(metadata: Record<string, any>): DeviceNotification[] {
  return Array.isArray(metadata?.deviceNotifications) ? metadata.deviceNotifications : []
}

function findDeviceByToken(
  devices: DeviceRecord[],
  token: string
): DeviceRecord | null {
  return devices.find((d) => d.token === token) ?? null
}

function extractBearerToken(req: FastifyRequest): string | null {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7).trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// Route registration
// ─────────────────────────────────────────────────────────────────────────────

export default async function deviceApiRoutes(fastify: FastifyInstance) {
  const { models } = fastify

  // ── Device auth middleware (applied to all routes below except /register) ──

  async function authenticateDevice(
    req: FastifyRequest,
    reply: any
  ): Promise<{ user: InstanceType<typeof models.User>; device: DeviceRecord } | void> {
    const token = extractBearerToken(req)
    if (!token) {
      reply.status(401).send({ error: 'Missing device token' })
      return
    }

    const deviceId = (req.headers['x-device-id'] as string) ?? ''
    if (!deviceId) {
      reply.status(401).send({ error: 'Missing X-Device-ID header' })
      return
    }

    // Find user who owns this device
    const users = await models.User.findAll()
    for (const user of users) {
      const meta = (user.metadata as Record<string, any>) ?? {}
      const devices = getUserDevices(meta)
      const device = findDeviceByToken(devices, token)
      if (device && device.id === deviceId) {
        return { user, device }
      }
    }

    reply.status(401).send({ error: 'Invalid device token or device ID' })
  }

  // ── POST /api/device/register ─────────────────────────────────────────────
  // Called once on first boot. Requires a user registration code.
  // The registration code is generated from the LOT site (Settings → Devices).

  fastify.post(
    '/register',
    async (
      req: FastifyRequest<{
        Body: { registration_code: string; device_name?: string; firmware_version?: string }
      }>,
      reply
    ) => {
      const { registration_code, device_name, firmware_version } = req.body ?? {}

      if (!registration_code) {
        return reply.status(400).send({ error: 'registration_code required' })
      }

      // Look up user by registration code stored in metadata
      const users = await models.User.findAll()
      const targetUser = users.find((u) => {
        const meta = (u.metadata as Record<string, any>) ?? {}
        return meta.deviceRegistrationCode === registration_code
      })

      if (!targetUser) {
        return reply.status(404).send({ error: 'Invalid registration code' })
      }

      const meta = (targetUser.metadata as Record<string, any>) ?? {}

      // Check code is not expired (24h TTL)
      const codeCreatedAt = meta.deviceRegistrationCodeCreatedAt
      if (codeCreatedAt) {
        const ageMs = Date.now() - new Date(codeCreatedAt).getTime()
        if (ageMs > 24 * 60 * 60 * 1000) {
          return reply.status(410).send({ error: 'Registration code expired' })
        }
      }

      const deviceId = crypto.randomUUID()
      const deviceToken = generateDeviceToken()
      const now = new Date().toISOString()

      const newDevice: DeviceRecord = {
        id: deviceId,
        token: deviceToken,
        name: device_name ?? `COSMO® CIA #${deviceId.slice(0, 6)}`,
        firmwareVersion: firmware_version ?? '1.0.0',
        lastSeenAt: now,
        batteryPct: null,
        registeredAt: now,
      }

      const devices = getUserDevices(meta)
      devices.push(newDevice)

      await targetUser.update({
        metadata: {
          ...meta,
          devices,
          deviceRegistrationCode: null, // consume the code
        },
      })

      // Log registration to user's Log tab
      await models.Log.create({
        userId: targetUser.id,
        event: 'device_registered',
        text: `COSMO® CIA device "${newDevice.name}" registered`,
        metadata: { deviceId, deviceName: newDevice.name, firmwareVersion: firmware_version },
      })

      return reply.send({
        device_id: deviceId,
        device_token: deviceToken,
        user_id: targetUser.id,
        registered_at: now,
      })
    }
  )

  // ── GET /api/device/health ────────────────────────────────────────────────

  fastify.get('/health', async (_req, reply) => {
    return reply.send({ status: 'ok', server: 'lot-systems.com', time: new Date().toISOString() })
  })

  // ── GET /api/device/notifications ─────────────────────────────────────────
  // Device polls this every 60s. Returns unread notifications.

  fastify.get('/notifications', async (req: FastifyRequest, reply) => {
    const auth = await authenticateDevice(req, reply)
    if (!auth) return

    const { user, device } = auth
    const meta = (user.metadata as Record<string, any>) ?? {}
    const allNotifications = getUserDeviceNotifications(meta)
    const now = new Date()

    const pending = allNotifications.filter((n) => {
      if (n.read) return false
      if (n.expires_at && new Date(n.expires_at) < now) return false
      return true
    })

    // Update device last seen
    const devices = getUserDevices(meta)
    const deviceIndex = devices.findIndex((d) => d.id === device.id)
    if (deviceIndex >= 0) {
      devices[deviceIndex].lastSeenAt = now.toISOString()
    }
    await user.update({ metadata: { ...meta, devices } })

    return reply.send({
      notifications: pending,
      unread_count: pending.length,
    })
  })

  // ── POST /api/device/notifications/:id/read ───────────────────────────────

  fastify.post(
    '/notifications/:id/read',
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply
    ) => {
      const auth = await authenticateDevice(req, reply)
      if (!auth) return

      const { user } = auth
      const meta = (user.metadata as Record<string, any>) ?? {}
      const notifications = getUserDeviceNotifications(meta)
      const idx = notifications.findIndex((n) => n.id === req.params.id)

      if (idx < 0) {
        return reply.status(404).send({ error: 'Notification not found' })
      }

      notifications[idx].read = true
      await user.update({ metadata: { ...meta, deviceNotifications: notifications } })

      return reply.send({ ok: true })
    }
  )

  // ── POST /api/device/copy-signal ──────────────────────────────────────────
  // Called when user presses the COPY button on the device.
  // Creates a Log entry visible in the LOT Log tab.

  fastify.post(
    '/copy-signal',
    async (
      req: FastifyRequest<{
        Body: {
          timestamp?: string
          sensor_snapshot?: SensorSnapshot
          note?: string
        }
      }>,
      reply
    ) => {
      const auth = await authenticateDevice(req, reply)
      if (!auth) return

      const { user, device } = auth
      const body = req.body ?? {}

      const sensorText = body.sensor_snapshot
        ? [
            body.sensor_snapshot.temperature_c != null
              ? `${body.sensor_snapshot.temperature_c}°C`
              : null,
            body.sensor_snapshot.humidity_pct != null
              ? `${body.sensor_snapshot.humidity_pct}% RH`
              : null,
            body.sensor_snapshot.iaq_score != null
              ? `IAQ ${body.sensor_snapshot.iaq_score}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ')
        : null

      const logText = [
        `📋 COPY — ${device.name}`,
        body.note ?? null,
        sensorText ?? null,
      ]
        .filter(Boolean)
        .join(' — ')

      await models.Log.create({
        userId: user.id,
        event: 'device_copy',
        text: logText,
        metadata: {
          deviceId: device.id,
          deviceName: device.name,
          timestamp: body.timestamp ?? new Date().toISOString(),
          sensorSnapshot: body.sensor_snapshot ?? null,
        },
      })

      // Update battery level if provided
      if (body.sensor_snapshot?.battery_pct != null) {
        const meta = (user.metadata as Record<string, any>) ?? {}
        const devices = getUserDevices(meta)
        const idx = devices.findIndex((d) => d.id === device.id)
        if (idx >= 0) {
          devices[idx].batteryPct = body.sensor_snapshot.battery_pct ?? null
          devices[idx].lastSeenAt = new Date().toISOString()
          await user.update({ metadata: { ...meta, devices } })
        }
      }

      return reply.send({ ok: true, logged: true })
    }
  )

  // ── POST /api/device/sensor-data ──────────────────────────────────────────
  // Device uploads periodic BME688 + battery readings.

  fastify.post(
    '/sensor-data',
    async (
      req: FastifyRequest<{
        Body: {
          timestamp?: string
          sensor_snapshot: SensorSnapshot
        }
      }>,
      reply
    ) => {
      const auth = await authenticateDevice(req, reply)
      if (!auth) return

      const { user, device } = auth
      const { sensor_snapshot } = req.body ?? {}

      if (!sensor_snapshot) {
        return reply.status(400).send({ error: 'sensor_snapshot required' })
      }

      const meta = (user.metadata as Record<string, any>) ?? {}
      const devices = getUserDevices(meta)
      const idx = devices.findIndex((d) => d.id === device.id)

      if (idx >= 0) {
        if (sensor_snapshot.battery_pct != null) {
          devices[idx].batteryPct = sensor_snapshot.battery_pct
        }
        devices[idx].lastSeenAt = new Date().toISOString()
      }

      // Store latest sensor reading in metadata
      await user.update({
        metadata: {
          ...meta,
          devices,
          latestSensorData: {
            deviceId: device.id,
            timestamp: req.body.timestamp ?? new Date().toISOString(),
            ...sensor_snapshot,
          },
        },
      })

      return reply.send({ ok: true })
    }
  )

  // ── GET /api/device/ota/latest ────────────────────────────────────────────
  // Device checks for firmware updates daily.

  fastify.get('/ota/latest', async (req: FastifyRequest, reply) => {
    const auth = await authenticateDevice(req, reply)
    if (!auth) return

    const currentVersion = (req.headers['x-firmware-version'] as string) ?? '0.0.0'

    // OTA config — update these when a new firmware release is ready
    const latest = {
      version: process.env.COSMO_FIRMWARE_VERSION ?? '1.0.0',
      firmware_url: process.env.COSMO_FIRMWARE_URL ?? null,
      sha256: process.env.COSMO_FIRMWARE_SHA256 ?? null,
      release_notes: process.env.COSMO_FIRMWARE_NOTES ?? 'Maintenance update',
      force_update: false,
    }

    const updateAvailable = latest.version !== currentVersion && !!latest.firmware_url

    return reply.send({
      current_version: currentVersion,
      latest_version: latest.version,
      update_available: updateAvailable,
      ...(updateAvailable ? latest : {}),
    })
  })

  // ── Admin: POST /api/device/send-notification ─────────────────────────────
  // Called from the LOT site to push a notification to a user's devices.
  // Requires user session auth (not device token).

  fastify.post(
    '/send-notification',
    async (
      req: FastifyRequest<{
        Body: {
          message: string
          type?: string
          priority?: 'normal' | 'high'
          expires_in_hours?: number
        }
      }>,
      reply
    ) => {
      if (!req.user) {
        return reply.status(401).send({ error: 'User session required' })
      }

      const { message, type = 'info', priority = 'normal', expires_in_hours } = req.body ?? {}

      if (!message || message.trim().length === 0) {
        return reply.status(400).send({ error: 'message required' })
      }

      const now = new Date()
      const expiresAt = expires_in_hours
        ? new Date(now.getTime() + expires_in_hours * 60 * 60 * 1000).toISOString()
        : null

      const notification: DeviceNotification = {
        id: crypto.randomUUID(),
        message: message.trim(),
        type,
        priority,
        created_at: now.toISOString(),
        expires_at: expiresAt,
        read: false,
      }

      const meta = (req.user.metadata as Record<string, any>) ?? {}
      const existing = getUserDeviceNotifications(meta)

      // Keep only the last 50 notifications
      const updated = [notification, ...existing].slice(0, 50)

      await req.user.update({
        metadata: { ...meta, deviceNotifications: updated },
      })

      return reply.send({ ok: true, notification_id: notification.id })
    }
  )

  // ── Admin: POST /api/device/generate-registration-code ───────────────────
  // Generates a one-time registration code for pairing a new COSMO® CIA device.

  fastify.post('/generate-registration-code', async (req: FastifyRequest, reply) => {
    if (!req.user) {
      return reply.status(401).send({ error: 'User session required' })
    }

    const code = crypto.randomBytes(4).toString('hex').toUpperCase() // e.g. "A3F2C9D1"
    const now = new Date().toISOString()

    const meta = (req.user.metadata as Record<string, any>) ?? {}
    await req.user.update({
      metadata: {
        ...meta,
        deviceRegistrationCode: code,
        deviceRegistrationCodeCreatedAt: now,
      },
    })

    return reply.send({
      registration_code: code,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Enter this code on your COSMO® CIA device during first-time setup.',
    })
  })

  // ── GET /api/device/devices ───────────────────────────────────────────────
  // Returns the list of devices registered to the current user (session auth).

  fastify.get('/devices', async (req: FastifyRequest, reply) => {
    if (!req.user) {
      return reply.status(401).send({ error: 'User session required' })
    }

    const meta = (req.user.metadata as Record<string, any>) ?? {}
    const devices = getUserDevices(meta).map(({ token: _token, ...safe }) => safe)

    return reply.send({ devices })
  })
}
