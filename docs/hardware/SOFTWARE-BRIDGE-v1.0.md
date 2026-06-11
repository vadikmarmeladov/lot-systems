<!--
  LOT SYSTEMS CORPORATION
  LOT Computer — Software Bridge & LOT API Spec v1.0
  2026-06-11
-->

# LOT Computer — Software Bridge & LOT API Specification
## SOFTWARE-BRIDGE-v1.0 | 2026-06-11

**Classification:** Internal — Backend Engineering
**Stack:** Node.js / Fastify / TypeScript (existing lot-systems.com codebase)
**Database:** PostgreSQL (existing)
**Integration point:** New routes in `src/server/routes/api.ts`

---

## 1. Overview

The software bridge connects the LOT Computer hardware device to the lot-systems.com platform. It consists of:

1. **New API endpoints** in the existing Fastify server
2. **New Sequelize model** for device registry
3. **SSE stream** pushed from server → device
4. **Log tab integration** for COPY button events
5. **Notification generator** (AI-powered, triggered by QOS)
6. **Device settings UI** in lot-systems.com/settings

---

## 2. Database Schema

### 2.1 New Table: `lot_devices`

```sql
CREATE TABLE lot_devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id       VARCHAR(32) UNIQUE NOT NULL,   -- "LCM-001-XXXX"
  device_secret   VARCHAR(64) NOT NULL,           -- hashed bcrypt
  device_name     VARCHAR(64) DEFAULT 'LOT Computer',
  firmware_version VARCHAR(16),                   -- "1.0.0"
  activation_code VARCHAR(32),                    -- factory QR code (one-time)
  activated_at    TIMESTAMP,
  last_seen_at    TIMESTAMP,
  last_ip         INET,
  is_active       BOOLEAN DEFAULT false,
  meta            JSONB DEFAULT '{}',             -- sensor caps, serial#
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON lot_devices(user_id);
CREATE INDEX idx_devices_device_id ON lot_devices(device_id);
```

### 2.2 New Table: `device_notifications`

```sql
CREATE TABLE device_notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(32) NOT NULL,           -- reminder|insight|weather|system
  priority        SMALLINT DEFAULT 1,
  headline        VARCHAR(128) NOT NULL,
  subtext         VARCHAR(256),
  icon            VARCHAR(32),
  source          VARCHAR(64),                    -- "QOS-ScheduledJob"|"Manual"
  ttl             INTEGER DEFAULT 3600,           -- seconds
  delivered_at    TIMESTAMP,
  copied_at       TIMESTAMP,                      -- when COPY was pressed
  expires_at      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_device_notifs_user ON device_notifications(user_id);
CREATE INDEX idx_device_notifs_created ON device_notifications(created_at DESC);
```

---

## 3. New API Routes

All routes added to `src/server/routes/api.ts` (or a new `device-api.ts` file).

### 3.1 `POST /api/device/register`

Registers a new device, consuming the factory activation code.

```typescript
// Request
{
  activationCode: string;   // From QR code on box
  userId: string;           // Authenticated user ID (from session)
  deviceName?: string;      // Optional friendly name
}

// Response
{
  deviceId: string;         // "LCM-001-XXXX"
  deviceSecret: string;     // Bearer token for device (shown ONCE)
  message: string;          // "Device registered successfully"
}

// Logic:
// 1. Verify activationCode exists in factory_codes table (one-time use)
// 2. Mark code as consumed
// 3. Generate deviceId from serial (from code metadata)
// 4. Generate deviceSecret (UUID v4, store bcrypt hash)
// 5. Create lot_devices record
// 6. Return deviceSecret (plaintext, only time it's returned)
```

### 3.2 `GET /api/device/notifications` (SSE)

Server-Sent Events stream. Device subscribes and holds open.

```typescript
// Headers required:
// Authorization: Bearer <device_secret>
// X-Device-ID: LCM-001-XXXX

// SSE format:
// data: {"id":"notif_abc","type":"reminder","headline":"Coffee time!","subtext":"...","icon":"cup","priority":1,"ttl":3600,"createdAt":"2026-06-11T10:45:00Z"}\n\n

// Server-side:
// 1. Authenticate device via device_id + device_secret (bcrypt compare)
// 2. Update last_seen_at
// 3. Open SSE connection
// 4. Subscribe to user's notification queue (in-memory PubSub)
// 5. Send keep-alive comment every 30s: ": keep-alive\n\n"
// 6. On notification: serialize → send data event → mark delivered_at

// Fastify SSE setup:
fastify.get('/api/device/notifications', {
  preHandler: [deviceAuthMiddleware],
}, async (request, reply) => {
  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');
  
  const userId = request.deviceUser.userId;
  
  // Send buffered notifications (last 5 undelivered)
  const pending = await getPendingNotifications(userId);
  for (const notif of pending) {
    reply.raw.write(`data: ${JSON.stringify(notif)}\n\n`);
  }
  
  // Subscribe to new notifications
  const unsubscribe = notificationBus.subscribe(userId, (notif) => {
    reply.raw.write(`data: ${JSON.stringify(notif)}\n\n`);
  });
  
  // Keep-alive
  const keepAlive = setInterval(() => {
    reply.raw.write(': keep-alive\n\n');
  }, 30_000);
  
  request.raw.on('close', () => {
    clearInterval(keepAlive);
    unsubscribe();
  });
});
```

### 3.3 `POST /api/device/log`

COPY button sends notification content to user's Log tab.

```typescript
// Request (from device)
{
  deviceId: string;
  action: "COPY";
  notificationId: string;
  notificationText: string;
  timestamp: string;          // ISO 8601
  sensorSnapshot?: {
    temperature: number;
    humidity: number;
    pressure: number;
    airQualityIndex: number;
    voc?: number;
    co2?: number;
  };
}

// Response
{
  success: boolean;
  logEntryId: string;
  message: string;
}

// Logic:
// 1. Authenticate device
// 2. Create Log entry in existing `logs` table:
//    type: "hardware_copy"
//    content: notification text + sensor context
//    meta: { deviceId, notificationId, sensorSnapshot, action }
// 3. Mark notification as copied (copied_at timestamp)
// 4. Emit to user's SSE stream (so Log tab updates live)
// 5. Credit P-16 (Physical Anchoring) pattern tick

// Log entry format in existing system:
const logEntry = {
  userId: device.userId,
  type: 'hardware_copy',
  content: `📟 ${body.notificationText}`,
  meta: {
    source: 'LOT Computer',
    deviceId: body.deviceId,
    notificationId: body.notificationId,
    sensors: body.sensorSnapshot,
    copiedAt: body.timestamp,
  },
  createdAt: new Date(),
};
```

### 3.4 `POST /api/device/telemetry`

Device sends sensor data every 5 minutes.

```typescript
// Request (from device)
{
  deviceId: string;
  firmwareVersion: string;
  uptimeSeconds: number;
  batteryPercent: number;
  isCharging: boolean;
  wifiRssi: number;
  sensors: {
    temperature: number;
    humidity: number;
    pressure: number;
    iaq: number;
    iaqAccuracy: number;
    vocEquivalent: number;
    co2Equivalent: number;
  };
  timestamp: string;
}

// Response: { success: boolean }

// Logic:
// 1. Authenticate device
// 2. Update device last_seen_at, firmware_version
// 3. Store sensor reading in time-series (use existing answers table or new device_telemetry)
// 4. Feed temperature/humidity into user's QOS context
//    → enriches P-42 (Environmental Awareness)
//    → contributes to P-51 (Circadian Coherence)
// 5. If IAQ > 150: generate push notification "Poor air quality detected"
```

### 3.5 `DELETE /api/device/unregister`

User removes device from account.

```typescript
// Authenticated by session (user action, not device)
// Body: { deviceId: string }
// Marks device as inactive, clears secret, stops SSE
```

### 3.6 `GET /api/device/status/:deviceId`

Returns device status for the UI settings panel.

```typescript
// Response
{
  deviceId: string;
  deviceName: string;
  isOnline: boolean;         // last_seen_at < 2min ago
  lastSeen: string;
  firmwareVersion: string;
  batteryPercent: number;
  isCharging: boolean;
  currentNotification: object | null;
  sensorSnapshot: object | null;
}
```

---

## 4. Notification Generator

### 4.1 How Notifications Are Pushed to Device

The existing scheduled jobs (`src/server/scheduled-jobs.ts`) already generate self-care reminders and QOS insights. These are extended to publish to `device_notifications` and push to connected devices.

```typescript
// In scheduled-jobs.ts, add to existing job triggers:

async function publishDeviceNotification(
  userId: string,
  notif: Omit<DeviceNotification, 'id' | 'userId' | 'createdAt'>
) {
  // 1. Save to database
  const saved = await DeviceNotification.create({ userId, ...notif });
  
  // 2. Push to connected device SSE if online
  notificationBus.publish(userId, {
    id: saved.id,
    type: notif.type,
    headline: notif.headline,
    subtext: notif.subtext,
    icon: notif.icon,
    priority: notif.priority,
    ttl: notif.ttl,
    createdAt: saved.createdAt,
  });
}

// Example usage in existing reminders job:
await publishDeviceNotification(userId, {
  type: 'reminder',
  headline: 'Coffee time!',
  subtext: `${format(new Date(), 'h:mm a')} — energy peak window`,
  icon: 'cup',
  priority: 1,
  ttl: 1800,
  source: 'QOS-CaffeineOptimal',
});
```

### 4.2 Notification Icons (OLED Icon Set)

| Icon key | Meaning | u8g2 glyph |
|---------|---------|-----------|
| `cup` | Coffee / hydration | ☕ |
| `star` | Achievement / milestone | ★ |
| `sun` | Morning / energy | ☀ |
| `moon` | Evening / sleep | ☽ |
| `cloud` | Weather | ☁ |
| `rain` | Rain alert | 🌧 |
| `bolt` | Energy insight | ⚡ |
| `check` | Goal complete | ✓ |
| `bell` | General reminder | 🔔 |
| `lot` | LOT system | L (custom) |

---

## 5. LOT Site UI Changes

### 5.1 Settings Page — Device Tab

Add new tab to existing `Settings.tsx` component:

```tsx
// New tab: "Devices"
// Shows:
// - Connected devices list
// - Device status (online/offline, battery, last seen)
// - Current notification on device
// - Live sensor readings (temp, humidity, IAQ)
// - "Remove device" button
// - "Add device" → opens activation flow (QR scanner)
```

### 5.2 Log Tab — Hardware Copy Entries

Existing Log tab shows entries of type `hardware_copy` with hardware icon prefix:

```
📟  Coffee time!
     Copied from LOT Computer  ·  10:47 AM  ·  22°C / 48% RH
```

### 5.3 Activation Flow Page

New page: `/device/activate?code=XXXX`

```
1. Check if user is logged in → redirect to login if not
2. Show: "Activate LOT Computer"
   "This device will be linked to your LOT account"
3. Call POST /api/device/register with code
4. Show success: "LOT Computer activated!"
   "Your device is now connected and will receive notifications"
5. Redirect to Settings → Devices
```

---

## 6. InMemory PubSub for SSE

```typescript
// src/server/utils/notification-bus.ts
// Simple in-memory pub/sub for pushing to connected SSE clients

type NotificationCallback = (notif: DeviceNotification) => void;

class NotificationBus {
  private subscribers = new Map<string, Set<NotificationCallback>>();
  
  subscribe(userId: string, cb: NotificationCallback): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }
    this.subscribers.get(userId)!.add(cb);
    
    return () => {
      this.subscribers.get(userId)?.delete(cb);
    };
  }
  
  publish(userId: string, notif: DeviceNotification): void {
    this.subscribers.get(userId)?.forEach(cb => cb(notif));
  }
  
  isOnline(userId: string): boolean {
    return (this.subscribers.get(userId)?.size ?? 0) > 0;
  }
}

export const notificationBus = new NotificationBus();
```

*Note: For multi-instance deployment (Digital Ocean App Platform auto-scaling), replace with Redis pub/sub using existing Redis connection.*

---

## 7. Session Compression on Server Side

```typescript
// src/server/utils/session-compress.ts
// Mirrors firmware session_compress.c for consistency

import zlib from 'zlib';
import { promisify } from 'util';

const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

interface SessionData {
  notification: DeviceNotification;
  sensors: SensorSnapshot;
  timestamp: string;
}

export async function compressSession(data: SessionData): Promise<Buffer> {
  const json = JSON.stringify(data);
  const compressed = await deflate(json, { level: 6 });
  return compressed;
  // Typical: 400 byte JSON → 120 byte compressed (70% reduction)
}

export async function decompressSession(data: Buffer): Promise<SessionData> {
  const json = await inflate(data);
  return JSON.parse(json.toString());
}
```

---

## 8. Integration with Existing QIE Patterns

| Pattern | How LCM Contributes |
|---------|-------------------|
| P-16: Physical Anchoring | Every COPY button press increments P-16 signal |
| P-42: Environmental Awareness | BME688 data feeds ambient awareness signals |
| P-51: Circadian Coherence | Temperature + light cycle data from device location |
| P-59: Recovery Velocity | Sleep environment quality (IAQ, temp, humidity) |
| P-63: System Presence | Device online = user engaged with system |

---

## 9. Deployment Notes

- Zero breaking changes to existing routes
- New routes additive only
- `lot_devices` and `device_notifications` tables are new (migration required)
- `notification_bus` singleton lives in server process
- For multi-instance: add `REDIS_URL` env var + update bus to Redis pub/sub
- Digital Ocean App Platform: no code changes needed, env var sufficient

---

*LOT COMPUTER SOFTWARE BRIDGE v1.0 — COMPLETE*
*© 2026 LOT Systems. All rights reserved.*
