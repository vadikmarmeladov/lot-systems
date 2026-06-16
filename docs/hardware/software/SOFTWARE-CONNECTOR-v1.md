# COSMO® CIA Device — Software Connector Specification v1.0

**Document:** Software Connector Specification  
**Device:** COSMO® CIA v1  
**Author:** LOT Systems / COSMO® CIA  
**Date:** 2026-06-16  
**Revision:** 1.0  

---

## 1. Overview

The **Software Connector** is the server-side service layer within `lot-systems.com` (the existing LOT Node.js backend) that bridges the CIA Device firmware with the LOT platform. It does not require a separate process — it is implemented as a set of new routes, WebSocket handlers, and database models added to the existing `src/server/` codebase.

---

## 2. New API Routes

Add the following routes to `src/server/routes/`:

### 2.1 Device Routes (`src/server/routes/devices.ts`)

```typescript
// POST /api/v1/devices/register
// Registers a new CIA device, returns auth token
router.post('/register', authenticateUser, deviceController.register);

// GET /api/v1/devices/:deviceId
// Get device status + last seen
router.get('/:deviceId', authenticateUser, deviceController.getDevice);

// POST /api/v1/devices/:deviceId/telemetry
// Ingest sensor telemetry (called by device every 5 min)
router.post('/:deviceId/telemetry', authenticateDevice, deviceController.ingestTelemetry);

// POST /api/v1/devices/:deviceId/session
// Upload compressed session summary
router.post('/:deviceId/session', authenticateDevice, deviceController.ingestSession);

// GET /api/v1/firmware/latest
// Returns latest firmware version manifest (for OTA)
router.get('/firmware/latest', deviceController.getFirmwareManifest);
```

### 2.2 Log Routes Extension (`src/server/routes/log.ts`)

```typescript
// POST /api/v1/log/event
// Receives Copy button acknowledgment from device
router.post('/event', authenticateDevice, logController.ingestDeviceEvent);
```

---

## 3. WebSocket Hub (`src/server/ws/deviceHub.ts`)

```typescript
interface DeviceConnection {
  deviceId: string;
  userId: string;
  socket: WebSocket;
  connectedAt: Date;
  lastPing: Date;
}

class DeviceHub {
  private connections: Map<string, DeviceConnection> = new Map();

  // Called when device opens WSS connection
  onConnect(deviceId: string, userId: string, socket: WebSocket): void;

  // Called when Memory Engine triggers a notification
  sendNotification(userId: string, notification: NotificationPayload): Promise<void>;

  // Ping/pong keepalive
  handlePing(deviceId: string): void;

  // Cleanup on disconnect
  onDisconnect(deviceId: string): void;
}

interface NotificationPayload {
  type: 'notification';
  id: string;            // UUID
  message: string;       // e.g. "Coffee time!"
  priority: 'low' | 'normal' | 'high';
  display_duration_ms: number;
  source: string;        // 'memory_engine' | 'manual' | 'cqgs'
  qos_mode: string;      // Current QOS state
}
```

---

## 4. Memory Engine Integration

The existing Memory Engine in `src/server/` generates proactive notifications. Add a notification emitter hook:

```typescript
// src/server/ai-engine/notificationEmitter.ts

import { deviceHub } from '../ws/deviceHub';

export async function emitDeviceNotification(
  userId: string,
  message: string,
  source: string = 'memory_engine'
): Promise<void> {
  await deviceHub.sendNotification(userId, {
    type: 'notification',
    id: uuidv4(),
    message,
    priority: 'normal',
    display_duration_ms: 8000,
    source,
    qos_mode: await getCurrentQosMode(userId),
  });
}
```

**Trigger points:**
- Memory Engine daily check-in ("Coffee time!" at user's preferred morning time)
- QOS mode transitions ("Recovery mode: rest period")
- Manual sends from LOT dashboard
- CQGS-triggered events

---

## 5. Database Models (Prisma additions)

Add to `prisma/schema.prisma`:

```prisma
model CiaDevice {
  id            String   @id @default(cuid())
  deviceId      String   @unique  // "CIA-{UUID}"
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  firmwareVersion String
  lastSeenAt    DateTime?
  batteryPct    Int?
  wifiRssi      Int?
  createdAt     DateTime @default(now())

  telemetry     CiaTelemetry[]
  sessions      CiaSession[]
  events        CiaLogEvent[]
}

model CiaTelemetry {
  id            String   @id @default(cuid())
  deviceId      String
  device        CiaDevice @relation(fields: [deviceId], references: [deviceId])
  timestamp     DateTime
  temperatureC  Float?
  humidityPct   Float?
  pressureHpa   Float?
  vocIaq        Int?
  steps         Int?
  activityType  String?
  batteryPct    Int?
  wifiRssiDbm   Int?
  createdAt     DateTime @default(now())
}

model CiaSession {
  id              String   @id @default(cuid())
  sessionId       String   @unique
  deviceId        String
  device          CiaDevice @relation(fields: [deviceId], references: [deviceId])
  startedAt       DateTime
  endedAt         DateTime
  notificationsReceived Int
  notificationsAcknowledged Int
  avgTemperatureC Float?
  avgHumidityPct  Float?
  activityProfile String?
  compressedBytes Int?
  createdAt       DateTime @default(now())
}

model CiaLogEvent {
  id             String   @id @default(cuid())
  deviceId       String
  device         CiaDevice @relation(fields: [deviceId], references: [deviceId])
  eventType      String   // 'copy_acknowledged'
  notificationId String?
  timestamp      DateTime
  sensorContext  Json?
  createdAt      DateTime @default(now())
}
```

---

## 6. Log Tab UI Update

Add CIA Device events to the existing Log tab component (`src/client/components/LogTab/`):

```tsx
// New event type in log display
{event.source === 'CIA_device' && (
  <LogEntry
    icon="📟"
    label="CIA Device — Copy"
    message={`Acknowledged: "${event.notification_message}"`}
    timestamp={event.timestamp}
    meta={`${event.sensor_context?.temperature_c?.toFixed(1)}°C · ${event.sensor_context?.humidity_pct}% RH`}
  />
)}
```

---

## 7. OTA Firmware Server

```typescript
// GET /api/v1/firmware/latest
// Returns:
{
  "version": "1.0.0",
  "sha256": "abc123...",
  "url": "https://lot-systems.com/firmware/cia/v1.0.0/cia_firmware.bin",
  "required": false,
  "release_notes": "Initial production release"
}
```

Store firmware binaries in `public/firmware/cia/` or S3 bucket.

---

## 8. Authentication

CIA Devices use a separate `authenticateDevice` middleware:

```typescript
// src/server/middleware/authenticateDevice.ts
export function authenticateDevice(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  
  const payload = jwt.verify(token, process.env.DEVICE_JWT_SECRET);
  req.deviceId = payload.deviceId;
  req.userId = payload.userId;
  next();
}
```

Device tokens are RS256 JWTs, 30-day expiry, auto-refreshed by device.

---

*Document: SOFTWARE-CONNECTOR-v1.md*  
*Generated: 2026-06-16*
