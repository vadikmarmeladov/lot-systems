<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO·01 — Software Connector
## LOT Platform ↔ Hardware Bridge

**Document:** COSMO-CIA-SOFTWARE-CONNECTOR.md  
**Revision:** v1.0  
**Date:** 2026-06-10  
**Stack:** TypeScript / Node.js / LOT API  
**Location in repo:** `src/server/routes/device-api.ts` (new file)

---

## 1. Overview

The software connector is the server-side bridge between COSMO·01 hardware
and the LOT platform. It provides five responsibilities:

1. **Device enrollment** — register and authenticate hardware units
2. **Notification routing** — push LOT Memory Engine events to devices via WebSocket
3. **Log ingestion** — receive Copy button events, write to LOT Log tab
4. **Sensor ingestion** — receive weather data, update user profile
5. **Config delivery** — serve device configuration and firmware updates

---

## 2. Database Schema (Prisma additions)

Add to `prisma/schema.prisma`:

```prisma
model Device {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  serial      String   @unique
  model       String   @default("COSMO-01")
  macAddress  String   @unique
  token       String   @unique @default(uuid())
  enrolledAt  DateTime @default(now())
  lastSeenAt  DateTime?
  firmwareVer String   @default("1.0.0")

  logs        DeviceLog[]
  sensors     DeviceSensor[]

  @@map("devices")
}

model DeviceLog {
  id        String   @id @default(uuid())
  deviceId  String
  device    Device   @relation(fields: [deviceId], references: [id])
  userId    String
  action    String
  context   String?
  timestamp DateTime
  weather   Json?
  createdAt DateTime @default(now())

  @@map("device_logs")
}

model DeviceSensor {
  id          String   @id @default(uuid())
  deviceId    String
  device      Device   @relation(fields: [deviceId], references: [id])
  userId      String
  temperature Float?
  humidity    Float?
  pressure    Float?
  batteryPct  Int?
  timestamp   DateTime
  createdAt   DateTime @default(now())

  @@map("device_sensors")
}
```

Run migration:
```bash
yarn migrations:up
```

---

## 3. API Routes

### 3.1 Device Enrollment

**File:** `src/server/routes/device-api.ts`

```typescript
// POST /api/device/enroll
router.post('/enroll', async (req, res) => {
  const { email, device_model, device_serial, mac } = req.body;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const existing = await db.device.findUnique({ where: { macAddress: mac } });
  if (existing) {
    // Re-enrollment: return existing token
    return res.json({ device_id: existing.id, token: existing.token });
  }

  const device = await db.device.create({
    data: {
      userId: user.id,
      serial: device_serial,
      model: device_model,
      macAddress: mac,
    }
  });

  return res.json({ device_id: device.id, token: device.token });
});
```

### 3.2 WebSocket Notification Server

```typescript
// src/server/device-ws.ts
import { WebSocketServer, WebSocket } from 'ws';

const connectedDevices = new Map<string, WebSocket>();

export function createDeviceWSS(server: http.Server) {
  const wss = new WebSocketServer({ server, path: '/api/device/ws' });

  wss.on('connection', async (ws, req) => {
    const token = new URL(req.url!, 'http://x').searchParams.get('token');
    if (!token) return ws.close(4001, 'No token');

    const device = await db.device.findUnique({ where: { token } });
    if (!device) return ws.close(4003, 'Invalid token');

    connectedDevices.set(device.id, ws);
    await db.device.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date() }
    });

    // Ping every 30s
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30_000);

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'pong') return;  // keep-alive, no-op
      if (msg.type === 'ack') {
        // Mark notification as delivered
        markNotificationDelivered(msg.id, device.id);
      }
    });

    ws.on('close', () => {
      connectedDevices.delete(device.id);
      clearInterval(pingInterval);
    });
  });

  return { wss, connectedDevices };
}

// Call this from the Memory Engine notification dispatcher
export async function pushNotificationToDevice(
  userId: string,
  notification: { message: string; category: string; icon: string }
) {
  const device = await db.device.findFirst({ where: { userId } });
  if (!device) return;

  const ws = connectedDevices.get(device.id);
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  ws.send(JSON.stringify({
    type: 'notification',
    id: crypto.randomUUID(),
    message: notification.message,
    category: notification.category,
    icon: notification.icon,
    timestamp: new Date().toISOString(),
  }));
}
```

### 3.3 Copy Button → LOT Log

```typescript
// POST /api/device/log
router.post('/log', deviceAuth, async (req, res) => {
  const { device_id, action, timestamp, context, weather } = req.body;
  const device = req.device;  // set by deviceAuth middleware

  // Write to DeviceLog
  await db.deviceLog.create({
    data: {
      deviceId: device.id,
      userId: device.userId,
      action,
      context: context ?? null,
      timestamp: new Date(timestamp),
      weather: weather ?? undefined,
    }
  });

  // Also write to the main LOT Log tab (same table as existing log entries)
  await db.log.create({
    data: {
      userId: device.userId,
      source: 'device',
      deviceId: device.id,
      content: context
        ? `📋 Copy — "${context}" from COSMO·01`
        : `📋 Copy — COSMO·01 button pressed`,
      metadata: {
        device_serial: device.serial,
        weather,
        timestamp,
      },
      createdAt: new Date(timestamp),
    }
  });

  return res.json({ status: 'logged' });
});
```

### 3.4 Sensor Data Ingestion

```typescript
// POST /api/device/sensor
router.post('/sensor', deviceAuth, async (req, res) => {
  const { timestamp, temperature, humidity, pressure, battery_pct } = req.body;
  const device = req.device;

  await db.deviceSensor.create({
    data: {
      deviceId: device.id,
      userId: device.userId,
      temperature,
      humidity,
      pressure,
      batteryPct: battery_pct,
      timestamp: new Date(timestamp),
    }
  });

  // Update user's cached weather (overrides GeoNames for profile display)
  await db.userWeatherCache.upsert({
    where: { userId: device.userId },
    update: {
      source: 'device',
      temperature,
      humidity,
      pressure,
      updatedAt: new Date(),
    },
    create: {
      userId: device.userId,
      source: 'device',
      temperature,
      humidity,
      pressure,
    }
  });

  return res.json({ status: 'received' });
});
```

### 3.5 Device Config

```typescript
// GET /api/device/config
router.get('/config', deviceAuth, async (req, res) => {
  const device = req.device;

  return res.json({
    poll_interval_ms: 15 * 60 * 1000,   // 15 min sensor upload
    notif_hold_s: 8,
    sleep_after_idle_s: 300,
    display_brightness: 80,
    ota_check_interval_ms: 3600 * 1000,
    firmware_version: device.firmwareVer,
    user_timezone: await getUserTimezone(device.userId),
  });
});
```

### 3.6 Firmware OTA Check

```typescript
// GET /api/device/firmware
router.get('/firmware', deviceAuth, async (req, res) => {
  const { version, model } = req.query;
  const LATEST_FIRMWARE = '1.0.2';

  if (version === LATEST_FIRMWARE) {
    return res.json({ available: false });
  }

  return res.json({
    available: true,
    version: LATEST_FIRMWARE,
    url: `${process.env.APP_HOST}/firmware/cosmo01-${LATEST_FIRMWARE}.bin`,
    sha256: FIRMWARE_SHA256[LATEST_FIRMWARE],
    release_notes: 'Weather sensor accuracy improvements, display brightness fix',
    size_bytes: 1_048_576,
  });
});
```

---

## 4. Auth Middleware

```typescript
// src/server/middleware/device-auth.ts
export async function deviceAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.slice(7);
  const device = await db.device.findUnique({ where: { token } });

  if (!device) return res.status(403).json({ error: 'Invalid token' });

  req.device = device;
  next();
}
```

---

## 5. LOT Log Tab Integration

When a Copy event arrives, it appears in the user's LOT Log tab as:

```
2026-06-10  09:42 AM
📋 Copy — "Coffee time!" from COSMO·01
   ──────────────────────────────────
   Device:      COSMO·01 (C01-00042)
   Temperature: 22.4°C
   Humidity:    48%
   Pressure:    1013.2 hPa
```

The `source: 'device'` field allows the Log tab to render device events with
the COSMO·01 icon and a distinct visual treatment from manual log entries.

---

## 6. Memory Engine Integration

The Memory Engine proactively generates notifications routed to devices.
Integration point in `src/server/lib/memory-engine.ts`:

```typescript
// When Memory Engine decides to push a notification:
import { pushNotificationToDevice } from '../device-ws';

async function dispatchNotification(userId: string, message: string, category: string) {
  // Existing: send push notification / in-app
  await sendPushNotification(userId, message);

  // New: also push to hardware device if enrolled
  await pushNotificationToDevice(userId, {
    message,
    category,
    icon: categoryToIcon(category),  // "routine" → "coffee", etc.
  });
}
```

---

## 7. Public Profile Weather Override

When a COSMO·01 is enrolled and has recently uploaded sensor data, the
public profile weather field uses device data instead of GeoNames:

```typescript
// src/server/routes/public-api.ts (existing)
async function getWeatherForProfile(userId: string): Promise<Weather> {
  // Check for recent device sensor data (< 30 min old)
  const deviceWeather = await db.userWeatherCache.findFirst({
    where: { userId, source: 'device', updatedAt: { gte: new Date(Date.now() - 30 * 60_000) } }
  });

  if (deviceWeather) {
    return {
      source: 'cosmo-device',
      temperature: deviceWeather.temperature,
      humidity: deviceWeather.humidity,
      // note: device doesn't have sky conditions, use last known from GeoNames
    };
  }

  // Fallback to GeoNames
  return getWeatherFromGeoNames(userId);
}
```

---

## 8. Route Registration

Add to `src/server/routes/index.ts`:

```typescript
import deviceApiRouter from './device-api';
router.use('/device', deviceApiRouter);
```

Add WebSocket server initialization to `src/server/server.ts`:

```typescript
import { createDeviceWSS } from './device-ws';
// After http server creation:
const { wss } = createDeviceWSS(httpServer);
```

---

## 9. Environment Variables

Add to `.env` / production config:

```
# COSMO Device Firmware
FIRMWARE_DIR=/var/www/firmware
FIRMWARE_SIGNING_KEY=...    # Ed25519 private key for firmware signing
```

---

## 10. Testing

```bash
# Unit tests
yarn test src/server/routes/device-api.test.ts

# Integration: simulate device enrollment
curl -X POST https://lot-systems.com/api/device/enroll \
  -H "Content-Type: application/json" \
  -d '{"email":"vadikmarmeladov@gmail.com","device_model":"COSMO-01","device_serial":"C01-00001","mac":"AA:BB:CC:DD:EE:01"}'

# Simulate Copy button
curl -X POST https://lot-systems.com/api/device/log \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"device_id":"...","action":"copy","timestamp":"2026-06-10T09:42:00Z","context":"Coffee time!","weather":{"temperature":22.4,"humidity":48,"pressure":1013.2}}'

# Simulate sensor upload
curl -X POST https://lot-systems.com/api/device/sensor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2026-06-10T09:45:00Z","temperature":22.4,"humidity":48.1,"pressure":1013.2,"battery_pct":87}'
```

---

*Deploy device-api routes alongside the LOT platform in the same Node.js
process. The WebSocket server attaches to the same HTTP server instance.*
