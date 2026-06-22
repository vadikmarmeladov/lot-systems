<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# SW-001 — SERVER-SIDE API ENDPOINTS
## LOT Computer Hardware Integration · Backend Spec

---

## New Route Module

File: `src/server/routes/hardware-api.ts`

This module handles all LOT hardware device communication.
It plugs into the existing Fastify server alongside the existing
route modules (`api.ts`, `public-api.ts`, etc.).

## Database Models Required

### HardwareDevice model

```typescript
// src/server/models/HardwareDevice.ts
{
  id:           UUID (PK)
  userId:       UUID (FK → users)
  deviceToken:  TEXT (hashed JWT, unique)
  hwRevision:   VARCHAR(10)   // "1.0"
  fwVersion:    VARCHAR(20)   // "1.0.3"
  lastSeen:     TIMESTAMP
  batteryPct:   INTEGER
  sensorData:   JSONB         // latest heartbeat sensor snapshot
  wifiRssi:     INTEGER
  createdAt:    TIMESTAMP
  updatedAt:    TIMESTAMP
}
```

### DeviceNotification model

```typescript
// src/server/models/DeviceNotification.ts
{
  id:           UUID (PK)
  deviceId:     UUID (FK → hardware_devices)
  userId:       UUID (FK → users)
  text:         TEXT
  priority:     ENUM('normal', 'urgent', 'silent')
  source:       VARCHAR(128)   // "scheduled_job", "manual", etc.
  sentAt:       TIMESTAMP
  ackedAt:      TIMESTAMP NULL
  ttl:          INTEGER        // seconds
  createdAt:    TIMESTAMP
}
```

## Endpoint Implementations

### POST /api/hardware/register

```typescript
// Auth: user JWT (standard auth, not device token)
// Creates device record, issues deviceToken

handler: async (req, reply) => {
  const { device_id, user_token, hw_revision, fw_version } = req.body;
  const userId = req.user.id;   // from standard JWT auth

  const deviceToken = generateDeviceJWT(device_id, userId);
  await HardwareDevice.create({
    id: device_id,
    userId,
    deviceToken: hash(deviceToken),
    hwRevision: hw_revision,
    fwVersion: fw_version,
  });

  return reply.status(201).send({ device_token: deviceToken, ... });
}
```

### GET /api/hardware/ws

WebSocket upgrade. Uses Fastify WebSocket plugin (`@fastify/websocket`).

```typescript
// Per-device WebSocket connection tracked in memory Map:
const deviceSockets = new Map<string, WebSocket>();

fastify.get('/api/hardware/ws', { websocket: true }, (socket, req) => {
  const deviceId = req.headers['x-device-id'];
  deviceSockets.set(deviceId, socket);

  socket.on('message', (msg) => handleDeviceMessage(deviceId, msg));
  socket.on('close', () => deviceSockets.delete(deviceId));
});

// Push notification to device:
export function pushToDevice(deviceId: string, payload: object) {
  const ws = deviceSockets.get(deviceId);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
  // else: queue in database for next connection
}
```

### POST /api/hardware/log-event

```typescript
// Auth: device token
// Creates a Log entry in the user's Log tab
// Emits QIE signal: 'physical_log_event'

handler: async (req, reply) => {
  const { event_type, notification_id, notification_text,
          pressed_at, sensor_snapshot } = req.body;
  const { userId, deviceId } = req.device;  // from device token auth

  // Create log entry visible in Log tab
  const logEntry = await createLogEntry(userId, {
    source: 'hardware_device',
    text: `[${deviceId}] ✓ ${notification_text}`,
    metadata: { event_type, sensor_snapshot, pressed_at },
  });

  // Emit QIE signal
  await emitQIESignal(userId, 'physical_log_event', {
    device_id: deviceId,
    notification_id,
    sensor_snapshot,
  });

  return reply.status(201).send({
    log_entry_id: logEntry.id,
    created_at: logEntry.createdAt,
    display_text: '✓ Logged to LOT',
  });
}
```

## Integration with Scheduled Jobs

The existing `scheduled-jobs.ts` can push notifications to devices:

```typescript
// In scheduled-jobs.ts — add to existing daily notification logic:
import { pushToDevice } from '../routes/hardware-api';

// Example: push "Coffee time!" at 14:30 daily
await scheduleAt('14:30', async (userId) => {
  const devices = await HardwareDevice.findAll({ where: { userId } });
  for (const device of devices) {
    pushToDevice(device.id, {
      type: 'notification',
      id: generateUUID(),
      text: 'Coffee time! ☕',
      priority: 'normal',
      timestamp: new Date().toISOString(),
      ttl: 3600,
    });
  }
});
```
