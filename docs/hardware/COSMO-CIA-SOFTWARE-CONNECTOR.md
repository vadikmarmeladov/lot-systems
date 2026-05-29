<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Software / LOT API Connector

**Document:** COSMO-CIA-SOFTWARE-CONNECTOR.md
**Version:** 1.0.0
**Prepared:** May 29, 2026
**Base URL:** `https://lot-systems.com`
**Protocol:** HTTPS + WebSocket Secure (WSS)

---

## 1. Overview

The COSMO® CIA device communicates with lot-systems.com through a dedicated **Device API** layer. This connector document covers:

1. Device registration and token issuance
2. Notification stream (WebSocket)
3. COPY button log POST
4. Weather sensor sync
5. Session sync (notification history)
6. OTA firmware update delivery
7. Site-side: Log tab rendering of device events

---

## 2. Authentication

All device requests use a **device bearer token** issued at registration. This token is distinct from the user's session JWT.

```
Authorization: Bearer <device_token>
```

Device tokens:
- Are 256-bit random, hex-encoded
- Do not expire (revocable by user from Settings → Devices)
- Scoped to: `device:notify_read`, `device:log_write`, `device:sensor_write`

---

## 3. Endpoints

### 3.1 Register Device

```
POST /api/device/register
Content-Type: application/json
Authorization: Bearer <pairing_token>   ← short-lived, from QR code
```

**Request:**
```json
{
  "device_id": "cia_8f3a2b1c",
  "firmware_version": "1.0.0",
  "hardware_revision": "A",
  "mac_address": "AA:BB:CC:DD:EE:FF"
}
```

**Response 201:**
```json
{
  "device_token": "d_tok_<256-bit-hex>",
  "user_id": "usr_vadik_001",
  "user_name": "Vadik",
  "server_time": "2026-05-29T09:45:00Z",
  "ota_check_url": "https://lot-systems.com/api/device/ota/check"
}
```

The device saves `device_token` to NVS and uses it for all subsequent calls. The pairing token is single-use and expires in 10 minutes.

---

### 3.2 Notification Stream (WebSocket)

```
GET /api/device/notifications
Upgrade: websocket
Connection: Upgrade
Authorization: Bearer <device_token>
```

Once upgraded to WebSocket, the server pushes notification frames as they are generated. The connection is persistent (kept alive with heartbeats).

**Server → Device — Notification:**
```json
{
  "type": "notification",
  "id": "notif_abc123",
  "text": "Coffee time!",
  "subtext": "Your morning ritual awaits",
  "timestamp": "2026-05-29T09:45:00Z",
  "source": "memory_engine",
  "chime": true,
  "priority": "normal"
}
```

**Notification sources:**
| `source`          | Description                                |
|------------------|--------------------------------------------|
| `memory_engine`   | AI-generated self-care reminder            |
| `qos_state`       | QOS mode change ("Recovery mode entered")  |
| `weather`         | Weather-triggered suggestion               |
| `scheduled`       | User-set timed reminder                    |
| `manual`          | User typed a message from the site         |
| `system`          | OTA available, low battery warning         |

**Device → Server — Heartbeat (every 30 s):**
```json
{
  "type": "pong",
  "battery_pct": 78,
  "temp_c": 22.4,
  "humidity_pct": 45.2,
  "pressure_hpa": 1013.2,
  "uptime_s": 3600,
  "firmware": "1.0.0"
}
```

**Server → Device — Heartbeat request:**
```json
{ "type": "ping" }
```

**Server → Device — OTA available:**
```json
{
  "type": "ota",
  "version": "1.1.0",
  "url": "https://lot-systems.com/firmware/cia-v1.1.bin",
  "sha256": "e3b0c44298fc1c149afb...",
  "changelog": "Fix: Wi-Fi reconnect stability. Add: Moon phase display."
}
```

---

### 3.3 Log COPY Button Press

When the user presses the COPY button on the device, it sends:

```
POST /api/device/log
Authorization: Bearer <device_token>
Content-Type: application/json
```

**Request:**
```json
{
  "device_id": "cia_8f3a2b1c",
  "action": "copy",
  "notification_id": "notif_abc123",
  "notification_text": "Coffee time!",
  "timestamp": "2026-05-29T09:46:00Z",
  "weather": {
    "temp_c": 22.4,
    "humidity_pct": 45.2,
    "pressure_hpa": 1013.2
  }
}
```

**Response 200:**
```json
{
  "log_entry_id": "log_xyz789",
  "message": "Logged successfully"
}
```

This creates a Log entry in the user's Log tab of type `device_ack`:

```
[COSMO CIA] "Coffee time!" — acknowledged at 9:46 AM
📍 22.4°C · 45% RH · 1013 hPa
```

---

### 3.4 Weather Sensor Sync

The device pushes BME280 readings every 60 seconds (optional, user can disable in Settings):

```
POST /api/device/weather
Authorization: Bearer <device_token>
Content-Type: application/json
```

**Request:**
```json
{
  "device_id": "cia_8f3a2b1c",
  "temp_c": 22.4,
  "humidity_pct": 45.2,
  "pressure_hpa": 1013.2,
  "timestamp": "2026-05-29T09:45:00Z"
}
```

**Response 200:**
```json
{ "accepted": true }
```

The server can optionally use this local sensor reading to supplement or override the external weather API data shown on the user's System tab and public profile.

---

### 3.5 Session Sync

After reconnecting, the device uploads its compressed notification history so the server can avoid resending already-seen notifications:

```
POST /api/device/session-sync
Authorization: Bearer <device_token>
Content-Type: application/octet-stream
X-Session-Date: 2026-05-29
X-Notification-Count: 12
```

**Body:** LZ4-compressed CBOR of notification history (binary)

**Response 200:**
```json
{
  "accepted": true,
  "last_seen_id": "notif_abc123",
  "pending_count": 3
}
```

---

### 3.6 OTA Check

```
GET /api/device/ota/check?current_version=1.0.0&device_id=cia_8f3a2b1c
Authorization: Bearer <device_token>
```

**Response — no update:**
```json
{ "update_available": false }
```

**Response — update available:**
```json
{
  "update_available": true,
  "version": "1.1.0",
  "url": "https://lot-systems.com/firmware/cia-v1.1.bin",
  "sha256": "e3b0c44298fc1c149afb...",
  "size_bytes": 892416,
  "mandatory": false
}
```

---

## 4. Site-Side: Log Tab Integration

The Log tab (`/api/log` route in `src/server/routes/api.ts`) needs a new entry type for device acknowledgements.

### New log entry type: `device_ack`

```typescript
// In src/server/types.ts or wherever LogEntry is defined
type LogEntryType =
  | 'memory_answer'
  | 'mood_checkin'
  | 'journal_entry'
  | 'intention_set'
  | 'device_ack'       // ← NEW
  | 'device_weather';  // ← NEW
```

### Log tab display

```
[COSMO CIA]  "Coffee time!"  acknowledged at 9:46 AM
             📍 22.4°C · 45% RH · 1013 hPa  ·  May 29, 2026
```

The entry uses the existing Log tab block styling (Arial font, same spacing as other log types).

---

## 5. Settings → Devices UI

A new **Devices** section in the Settings tab allows users to:

1. **Pair a new CIA device** — generates a QR code containing a 10-minute pairing token
2. **View paired devices** — shows device name, last seen timestamp, firmware version, battery %
3. **Send a message** — push a custom notification to the device instantly
4. **Manage notification types** — toggle which sources get pushed to the device
5. **Revoke device** — invalidates the device token (device shows "⚠ Unpaired")

### Pairing flow (site side)

```
1. User clicks "Pair CIA Device"
2. Server generates pairing_token (UUID, expires 10 min)
3. Server renders QR code: lot://pair?token=<pairing_token>&user=<user_id>
4. User holds device near screen; device camera scans QR
5. Device calls POST /api/device/register with pairing_token
6. Server verifies token, issues device_token, stores DeviceToken record
7. Settings page auto-refreshes: shows "✓ CIA Device connected"
```

---

## 6. Database Schema (Prisma additions)

Add to `prisma/schema.prisma`:

```prisma
model DeviceToken {
  id             String   @id @default(cuid())
  userId         String
  deviceId       String   @unique
  token          String   @unique
  firmwareVersion String?
  hardwareRev    String?
  macAddress     String?
  lastSeenAt     DateTime?
  batteryPct     Int?
  tempC          Float?
  humidityPct    Float?
  pressureHpa    Float?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [userId], references: [id])
  logs           DeviceLog[]
}

model DeviceLog {
  id             String   @id @default(cuid())
  deviceTokenId  String
  action         String   // 'copy', 'camera', 'weather'
  notificationId String?
  notificationText String?
  weatherTemp    Float?
  weatherHumidity Float?
  weatherPressure Float?
  createdAt      DateTime @default(now())

  device         DeviceToken @relation(fields: [deviceTokenId], references: [id])
}

model PairingToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  usedAt    DateTime?
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 7. Server Route Files

New routes to add to `src/server/routes/`:

### `device-api.ts` (new file)

```typescript
import { Router } from 'express';
import { requireDeviceToken, requirePairingToken } from '../lib/device-auth';
import { db } from '../lib/db';
import { createDeviceLogEntry } from '../models/log';

const router = Router();

// Registration (uses short-lived pairing token)
router.post('/device/register', requirePairingToken, async (req, res) => { /* ... */ });

// WebSocket notification stream
router.get('/device/notifications', requireDeviceToken, websocketUpgrade, async (req, res) => { /* ... */ });

// COPY button log
router.post('/device/log', requireDeviceToken, async (req, res) => {
  const { device_id, action, notification_id, notification_text, timestamp, weather } = req.body;
  // Validate, write to DeviceLog + create LogEntry for user's Log tab
  await createDeviceLogEntry({ userId: req.deviceUser.userId, ...req.body });
  res.json({ log_entry_id: newEntry.id, message: 'Logged successfully' });
});

// Weather sync
router.post('/device/weather', requireDeviceToken, async (req, res) => { /* ... */ });

// Session sync
router.post('/device/session-sync', requireDeviceToken, async (req, res) => { /* ... */ });

// OTA check
router.get('/device/ota/check', requireDeviceToken, async (req, res) => { /* ... */ });

export default router;
```

Mount in `src/server/routes/index.ts`:
```typescript
import deviceApi from './device-api';
app.use('/api', deviceApi);
```

---

## 8. Notification Composer (Site → Device)

The Memory Engine's scheduler and QOS state monitor can push notifications to connected CIA devices. Integration point:

```typescript
// In src/server/lib/notifications.ts (new or existing)
export async function pushToDevices(userId: string, notification: DeviceNotification) {
  const devices = await db.deviceToken.findMany({ where: { userId } });
  for (const device of devices) {
    wsManager.sendToDevice(device.deviceId, {
      type: 'notification',
      id: generateId(),
      text: notification.text,
      subtext: notification.subtext,
      timestamp: new Date().toISOString(),
      source: notification.source,
      chime: notification.chime ?? true,
      priority: notification.priority ?? 'normal',
    });
  }
}
```

Call `pushToDevices()` from:
- Memory Engine question scheduler (after generating question)
- QOS state change handler
- Scheduled chime system (`time-chime` feature)
- Manual message from Settings → Devices

---

*COSMO® CIA Software Connector — LOT API integration spec.*
*© 2026 LOT Systems, Inc. All rights reserved.*
