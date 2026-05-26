# COSMO LOT Computer — Software Connector
## TypeScript SDK & Bridge Layer Between Firmware and LOT Platform

**Project:** COSMO® CIA LOT Computer  
**Package:** `@lot-systems/hardware-sdk`  
**Language:** TypeScript  
**Date:** 2026-05-26

---

## 1. Overview

The Software Connector is a TypeScript SDK that:
1. Lives on the lot-systems.com Node.js backend
2. Handles all hardware-side API logic (auth, notification delivery, event ingestion)
3. Provides a clean interface for the LOT front-end to manage devices
4. Bridges firmware events into the LOT Log, Memory Engine, and QOS systems

---

## 2. Installation

```bash
# Internal package (part of LOT monorepo)
# Located at: src/server/lib/hardware/

# Or as a standalone npm package (future)
npm install @lot-systems/hardware-sdk
```

---

## 3. Package Structure

```
src/server/lib/hardware/
├── index.ts               — Public exports
├── device-registry.ts     — Device CRUD (register, list, update)
├── notification-manager.ts — Push + queue + expire notifications
├── event-processor.ts     — Process incoming device events → LOT logs
├── device-auth.ts         — JWT issuance, validation, refresh
├── provision.ts           — QR provisioning flow
├── session-processor.ts   — Ingest + store session summaries
├── config-builder.ts      — Build per-device config object
└── types.ts               — Shared TypeScript types
```

---

## 4. Types

```typescript
// types.ts

export type DeviceEventType =
  | 'copy_button_press'
  | 'device_online'
  | 'device_offline'
  | 'low_battery'
  | 'provisioned';

export type NotificationType =
  | 'reminder'
  | 'memory'
  | 'insight'
  | 'weather'
  | 'system';

export type HapticPattern =
  | 'single_soft'
  | 'double_buzz'
  | 'triple_pulse'
  | 'long_rumble';

export interface HardwareDevice {
  deviceId: string;           // "cosmo_001"
  userId: number;
  deviceName: string;
  fwVersion: string;
  hwRevision: string;
  registeredAt: Date;
  lastSeenAt: Date | null;
  isActive: boolean;
}

export interface DeviceNotification {
  id: string;
  deviceId: string;
  type: NotificationType;
  message: string;            // Max 40 chars — fits OLED
  subtext?: string;           // Max 60 chars — secondary line
  priority: 'urgent' | 'normal' | 'low';
  icon?: string;
  haptic?: HapticPattern;
  expiresAt: Date;
  ackedAt: Date | null;
  createdAt: Date;
}

export interface DeviceEvent {
  event: DeviceEventType;
  deviceId: string;
  notificationId?: string;
  timestamp: Date;
  context: {
    batteryLevel?: number;
    fwVersion?: string;
    sensorSnapshot?: SensorSnapshot;
  };
}

export interface SensorSnapshot {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  gasIndex?: number;
  lux?: number;
  steps?: number;
  charging?: boolean;
}

export interface DeviceConfig {
  pollIntervalSeconds: number;
  ssePushEnabled: boolean;
  displayBrightness: number;
  hapticEnabled: boolean;
  notificationTypes: NotificationType[];
  otaEnabled: boolean;
  sleepMode: 'light' | 'deep';
  sensorUploadIntervalMinutes: number;
  deviceName: string;
  ownerFirstName: string;
}
```

---

## 5. Device Registry

```typescript
// device-registry.ts

import { HardwareDevice } from './types'

export async function registerDevice(params: {
  userId: number
  deviceId: string
  deviceName: string
  fwVersion: string
  hwRevision: string
}): Promise<HardwareDevice> {
  // Insert into hardware_devices table
  const device = await db.hardwareDevices.create({
    userId: params.userId,
    deviceId: params.deviceId,
    deviceName: params.deviceName,
    fwVersion: params.fwVersion,
    hwRevision: params.hwRevision,
    registeredAt: new Date(),
    isActive: true,
  })
  return device
}

export async function getDeviceByDeviceId(
  deviceId: string
): Promise<HardwareDevice | null> {
  return db.hardwareDevices.findOne({ where: { deviceId } })
}

export async function getUserDevices(
  userId: number
): Promise<HardwareDevice[]> {
  return db.hardwareDevices.findAll({
    where: { userId, isActive: true },
    order: [['registeredAt', 'DESC']],
  })
}

export async function updateLastSeen(deviceId: string): Promise<void> {
  await db.hardwareDevices.update(
    { lastSeenAt: new Date() },
    { where: { deviceId } }
  )
}
```

---

## 6. Notification Manager

```typescript
// notification-manager.ts

import { DeviceNotification, NotificationType, HapticPattern } from './types'

export async function pushNotification(params: {
  deviceId: string
  type: NotificationType
  message: string
  subtext?: string
  priority?: 'urgent' | 'normal' | 'low'
  icon?: string
  haptic?: HapticPattern
  ttlMinutes?: number       // default 60
}): Promise<DeviceNotification> {
  const expiresAt = new Date(
    Date.now() + (params.ttlMinutes ?? 60) * 60 * 1000
  )

  const notification = await db.hardwareNotifications.create({
    id: generateId('notif'),
    deviceId: params.deviceId,
    type: params.type,
    message: params.message.slice(0, 40),    // enforce OLED limit
    subtext: params.subtext?.slice(0, 60),
    priority: params.priority ?? 'normal',
    icon: params.icon,
    haptic: params.haptic,
    expiresAt,
    createdAt: new Date(),
  })

  return notification
}

export async function getPendingNotifications(
  deviceId: string
): Promise<DeviceNotification[]> {
  return db.hardwareNotifications.findAll({
    where: {
      deviceId,
      ackedAt: null,
      expiresAt: { [Op.gt]: new Date() },
    },
    order: [['priority', 'ASC'], ['createdAt', 'ASC']],
    limit: 20,
  })
}

export async function acknowledgeNotification(
  notificationId: string,
  deviceId: string
): Promise<void> {
  await db.hardwareNotifications.update(
    { ackedAt: new Date() },
    { where: { id: notificationId, deviceId } }
  )
}

// Cleanup job: expire old notifications (run every hour)
export async function expireOldNotifications(): Promise<void> {
  await db.hardwareNotifications.update(
    { ackedAt: new Date() },
    { where: { ackedAt: null, expiresAt: { [Op.lt]: new Date() } } }
  )
}
```

---

## 7. Event Processor

Converts incoming device events into LOT log entries.

```typescript
// event-processor.ts

import { DeviceEvent } from './types'
import { createLog } from '../models/log'
import { getDeviceByDeviceId } from './device-registry'

export async function processDeviceEvent(event: DeviceEvent): Promise<void> {
  const device = await getDeviceByDeviceId(event.deviceId)
  if (!device) throw new Error(`Unknown device: ${event.deviceId}`)

  let logText: string
  let logMetadata: Record<string, unknown> = {
    deviceId: event.deviceId,
    deviceName: device.deviceName,
    event: event.event,
    sensor: event.context.sensorSnapshot,
  }

  switch (event.event) {
    case 'copy_button_press': {
      // Fetch the notification that was copied
      const notif = event.notificationId
        ? await db.hardwareNotifications.findByPk(event.notificationId)
        : null
      logText = notif
        ? `Copied on COSMO: "${notif.message}"`
        : 'COSMO Copy button pressed'
      logMetadata.notificationId = event.notificationId
      break
    }

    case 'device_online':
      logText = `COSMO online — battery ${event.context.batteryLevel ?? '?'}%`
      break

    case 'device_offline':
      logText = `COSMO offline`
      break

    case 'low_battery':
      logText = `COSMO battery low (${event.context.batteryLevel ?? '?'}%)`
      break

    case 'provisioned':
      logText = `COSMO device registered: ${device.deviceName}`
      break

    default:
      logText = `COSMO event: ${event.event}`
  }

  await createLog({
    userId: device.userId,
    text: logText,
    event: 'hardware_event',
    metadata: logMetadata,
    deviceId: event.deviceId,
  })
}
```

---

## 8. Device Authentication

```typescript
// device-auth.ts

import jwt from 'jsonwebtoken'
import { HardwareDevice } from './types'

const DEVICE_JWT_SECRET = process.env.DEVICE_JWT_SECRET!
const DEVICE_JWT_EXPIRY = '30d'

export function issueDeviceJwt(device: HardwareDevice): string {
  return jwt.sign(
    {
      sub: device.deviceId,
      userId: device.userId,
      deviceName: device.deviceName,
      scope: 'hardware',
    },
    DEVICE_JWT_SECRET,
    { expiresIn: DEVICE_JWT_EXPIRY }
  )
}

export function verifyDeviceJwt(token: string): {
  deviceId: string
  userId: number
} {
  const payload = jwt.verify(token, DEVICE_JWT_SECRET) as {
    sub: string
    userId: number
    scope: string
  }
  if (payload.scope !== 'hardware') {
    throw new Error('Token scope is not hardware')
  }
  return { deviceId: payload.sub, userId: payload.userId }
}

// Express middleware
export function requireDeviceAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing device token' })
  }
  try {
    const { deviceId, userId } = verifyDeviceJwt(authHeader.slice(7))
    req.deviceId = deviceId
    req.userId = userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired device token' })
  }
}
```

---

## 9. Provisioning Flow

```typescript
// provision.ts

// Step 1: Generate QR payload (called from LOT Settings UI)
export async function generateProvisionQR(userId: number): Promise<{
  qrPayload: string
  provisionToken: string
  expiresAt: Date
}> {
  const provisionToken = generateId('prov')
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min TTL

  await db.provisionTokens.create({
    token: provisionToken,
    userId,
    expiresAt,
    usedAt: null,
  })

  // QR payload — device scans this
  const qrPayload = JSON.stringify({
    t: provisionToken,
    u: 'https://lot-systems.com/api/hardware/register',
  })

  return { qrPayload, provisionToken, expiresAt }
}

// Step 2: Complete registration (called by device after scanning QR)
export async function completeProvisioning(params: {
  provisionToken: string
  deviceId: string
  deviceName: string
  fwVersion: string
  hwRevision: string
}): Promise<{ deviceJwt: string; config: DeviceConfig }> {
  // Validate provision token
  const token = await db.provisionTokens.findOne({
    where: {
      token: params.provisionToken,
      usedAt: null,
      expiresAt: { [Op.gt]: new Date() },
    },
  })
  if (!token) throw new Error('Invalid or expired provision token')

  // Mark token as used
  await token.update({ usedAt: new Date() })

  // Register device
  const device = await registerDevice({
    userId: token.userId,
    ...params,
  })

  // Issue JWT
  const deviceJwt = issueDeviceJwt(device)

  // Build initial config
  const config = await buildDeviceConfig(device)

  // Log to user's feed
  await processDeviceEvent({
    event: 'provisioned',
    deviceId: device.deviceId,
    timestamp: new Date(),
    context: {},
  })

  return { deviceJwt, config }
}
```

---

## 10. Integration with Memory Engine & QIE

When the Memory Engine generates a new question, it checks for hardware devices:

```typescript
// In src/server/lib/memory-engine.ts (existing file)
// Add after question is generated:

import { getUserDevices, pushNotification } from './hardware'

async function generateAndSendQuestion(userId: number, question: Question) {
  // ... existing question generation logic ...

  // Push to hardware device if user has one
  const devices = await getUserDevices(userId)
  for (const device of devices) {
    await pushNotification({
      deviceId: device.deviceId,
      type: 'memory',
      message: 'Memory check-in',
      subtext: question.text.slice(0, 60),
      priority: 'low',
      haptic: 'single_soft',
      ttlMinutes: 24 * 60,  // 24h TTL for memory questions
    })
  }
}
```

When QIE detects a pattern insight:

```typescript
// In src/server/lib/qie.ts (existing file)
import { getUserDevices, pushNotification } from './hardware'

async function onInsightDetected(userId: number, insight: Insight) {
  const devices = await getUserDevices(userId)
  for (const device of devices) {
    await pushNotification({
      deviceId: device.deviceId,
      type: 'insight',
      message: insight.title.slice(0, 40),
      subtext: insight.description.slice(0, 60),
      priority: 'low',
      haptic: 'single_soft',
    })
  }
}
```

---

## 11. Scheduled Jobs

```typescript
// In src/server/scheduled-jobs.ts — add:

// Every hour: expire stale notifications
schedule.every('1h', async () => {
  await hardware.expireOldNotifications()
})

// Daily: push "time chime" notification to devices
schedule.every('1d', async () => {
  const activeDevices = await hardware.getAllActiveDevices()
  for (const device of activeDevices) {
    const user = await getUser(device.userId)
    if (user.settings?.timeChimeEnabled) {
      const message = generateTimeChime(user)  // e.g. "Good morning, Vadik"
      await hardware.pushNotification({
        deviceId: device.deviceId,
        type: 'reminder',
        message,
        haptic: 'single_soft',
        ttlMinutes: 120,
      })
    }
  }
})
```

---

## 12. Environment Variables

Add to `.env`:

```
# Hardware SDK
DEVICE_JWT_SECRET="..."          # Separate secret from user JWT
LOT_FIRMWARE_CDN_URL="https://cdn.lot-systems.com/firmware/cosmo"
```

---

*COSMO® CIA — LOT Systems — Software Connector v1.0 — 2026-05-26*
