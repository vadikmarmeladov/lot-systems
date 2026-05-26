# COSMO LOT Computer — LOT API Hardware Connector
## New API Endpoints for Hardware Device Integration

**Project:** COSMO® CIA LOT Computer  
**Integration target:** lot-systems.com  
**Date:** 2026-05-26  
**Base URL:** `https://lot-systems.com/api/hardware`

---

## Overview

The LOT Hardware API extends the existing lot-systems.com platform with five new endpoints that:
1. Register and authenticate COSMO devices
2. Deliver AI-powered notifications to the device screen
3. Receive Copy button events → appear in the user's Log tab
4. Deliver device configuration updates
5. Receive compressed session summaries

All endpoints require device JWT authentication (separate from user JWT).

---

## Authentication

### Device JWT

Devices authenticate with a dedicated device-scoped JWT:

```
Authorization: Bearer <device_jwt>
```

**Device JWT claims:**
```json
{
  "sub": "cosmo_001",
  "userId": 42,
  "deviceName": "Vadik's COSMO",
  "scope": "hardware",
  "iat": 1748304000,
  "exp": 1750896000
}
```

JWT lifetime: 30 days. Devices request a new token via `/api/hardware/refresh`.

### Initial Token Issuance

Tokens are issued during device provisioning (QR scan flow):

1. User opens LOT Settings → Hardware tab
2. LOT site generates a one-time provisioning QR containing a `provisionToken` (5-minute TTL)
3. Device scans QR → receives Wi-Fi credentials + `provisionToken`
4. Device calls `POST /api/hardware/register` with `provisionToken` → receives `deviceJwt`

---

## Endpoints

### 1. `POST /api/hardware/register`

Register a new COSMO device. Called once during QR provisioning.

**Auth:** One-time `provisionToken` (not device JWT)

**Request:**
```json
{
  "provisionToken": "prov_abc123xyz",
  "deviceId": "cosmo_001",
  "deviceName": "Vadik's COSMO",
  "fwVersion": "1.0.0",
  "hardwareRevision": "r1"
}
```

**Response `200`:**
```json
{
  "deviceJwt": "eyJhbGc...",
  "expiresAt": "2026-06-25T14:00:00Z",
  "config": {
    "pollIntervalSeconds": 30,
    "notificationTypes": ["reminder", "memory", "insight", "weather", "system"],
    "displayMode": "grayscale",
    "ssePushEnabled": false
  }
}
```

**Response `401`:** Invalid or expired `provisionToken`  
**Response `409`:** Device ID already registered

---

### 2. `GET /api/hardware/notifications`

Poll for pending notifications destined for this device.

**Auth:** Device JWT

**Response `200`:**
```json
{
  "notifications": [
    {
      "id": "notif_abc123",
      "type": "reminder",
      "message": "Coffee time!",
      "subtext": "Your usual 11:00 AM ritual",
      "priority": "normal",
      "icon": "cup",
      "haptic": "double_buzz",
      "expiresAt": "2026-05-26T15:30:00Z",
      "createdAt": "2026-05-26T11:00:00Z"
    },
    {
      "id": "notif_def456",
      "type": "memory",
      "message": "Memory check-in",
      "subtext": "A question is waiting",
      "priority": "low",
      "icon": "diamond",
      "haptic": "single_soft",
      "expiresAt": "2026-05-26T23:59:00Z",
      "createdAt": "2026-05-26T09:00:00Z"
    }
  ],
  "count": 2,
  "serverTime": "2026-05-26T11:05:00Z"
}
```

**Notification types:**

| type | Description | Icon hint |
|---|---|---|
| `reminder` | Custom reminder from LOT site admin/AI | cup, bell, star |
| `memory` | Memory Engine has a new question | diamond |
| `insight` | New pattern insight detected by QIE | circle |
| `weather` | Significant weather change | cloud, sun |
| `system` | Device system message (low battery, update ready) | square |

**Priority levels:** `urgent`, `normal`, `low`

---

### 3. `POST /api/hardware/event`

Send a hardware event from device to LOT platform. Primarily triggered by Copy button press.

**Auth:** Device JWT

**Request:**
```json
{
  "event": "copy_button_press",
  "notificationId": "notif_abc123",
  "timestamp": "2026-05-26T11:05:42Z",
  "context": {
    "batteryLevel": 82,
    "fwVersion": "1.0.0",
    "sensorSnapshot": {
      "temperature": 22.3,
      "humidity": 48,
      "pressure": 1013.2,
      "gasIndex": 85,
      "lux": 342,
      "steps": 1204,
      "charging": false
    }
  }
}
```

**Response `200`:**
```json
{
  "received": true,
  "logId": "log_789xyz",
  "message": "Logged to your LOT activity feed"
}
```

**Event types:**

| event | Trigger | Log tab display |
|---|---|---|
| `copy_button_press` | User presses Copy button | "📋 Copied from COSMO — [notification text]" |
| `device_online` | Device connects to Wi-Fi | "◉ COSMO online — battery 82%" |
| `device_offline` | Device disconnects | "◌ COSMO offline" |
| `low_battery` | Battery < 15% | "⚡ COSMO battery low (12%)" |
| `provisioned` | First-time QR setup | "✓ COSMO device registered" |

**Log tab integration:**
Events appear in the user's LOT Log tab (`/logs`) with:
- Device icon (COSMO® badge)
- Event text
- Sensor snapshot (expandable)
- Timestamp in user's local timezone

---

### 4. `PUT /api/hardware/ack/:notificationId`

Acknowledge (dismiss) a notification. Called after device displays + user presses Copy or notification expires.

**Auth:** Device JWT

**Response `200`:**
```json
{
  "acknowledged": true,
  "notificationId": "notif_abc123"
}
```

Acknowledged notifications are removed from the poll queue. Expired notifications are auto-acknowledged server-side.

---

### 5. `GET /api/hardware/config`

Fetch device configuration from the server. Called on boot and every 24 hours.

**Auth:** Device JWT

**Response `200`:**
```json
{
  "pollIntervalSeconds": 30,
  "ssePushEnabled": false,
  "displayBrightness": 80,
  "hapticEnabled": true,
  "notificationTypes": ["reminder", "memory", "insight", "weather", "system"],
  "otaEnabled": true,
  "sleepMode": "light",
  "sensorUploadIntervalMinutes": 60,
  "deviceName": "Vadik's COSMO",
  "ownerFirstName": "Vadik"
}
```

---

### 6. `POST /api/hardware/session`

Upload compressed session summary from device.

**Auth:** Device JWT

**Request:**
```json
{
  "sessionId": "cosmo_001_20260526_001",
  "startedAt": "2026-05-26T08:00:00Z",
  "endedAt": "2026-05-26T22:00:00Z",
  "durationSeconds": 50400,
  "fwVersion": "1.0.0",
  "stats": {
    "notificationsReceived": 12,
    "notificationsAcknowledged": 9,
    "buttonPresses": 3,
    "wifiDrops": 1,
    "batteryStart": 95,
    "batteryEnd": 62
  },
  "sensorSummary": {
    "temperature": { "min": 18.2, "max": 24.1, "avg": 21.4 },
    "humidity": { "min": 38, "max": 67, "avg": 52 },
    "pressure": { "min": 1009, "max": 1015, "avg": 1012 },
    "gasIndex": { "min": 42, "max": 210, "avg": 95 },
    "steps": 6482
  }
}
```

**Response `200`:** `{ "stored": true, "sessionId": "cosmo_001_20260526_001" }`

---

### 7. `POST /api/hardware/refresh`

Refresh device JWT (called automatically 7 days before expiry).

**Auth:** Current device JWT  

**Response `200`:**
```json
{
  "deviceJwt": "eyJhbGc...",
  "expiresAt": "2026-07-25T14:00:00Z"
}
```

---

### 8. `GET /api/hardware/firmware/latest`

Check for firmware updates. Called once per day.

**Auth:** Device JWT

**Response `200`:**
```json
{
  "version": "1.0.3",
  "url": "https://cdn.lot-systems.com/firmware/cosmo/v1.0.3/lot_computer.bin",
  "sha256": "a3f8c2e9...",
  "releaseNotes": "Improved sleep mode, BME688 calibration fix",
  "mandatory": false,
  "releasedAt": "2026-05-20T00:00:00Z"
}
```

**Response `204`:** No update available (device is up to date)

---

## LOT Site Changes Required

### Database

```sql
-- New table: hardware_devices
CREATE TABLE hardware_devices (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  device_id   VARCHAR(32) UNIQUE NOT NULL,  -- "cosmo_001"
  device_name VARCHAR(64),
  fw_version  VARCHAR(16),
  hw_revision VARCHAR(8),
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen_at  TIMESTAMP,
  jwt_hash    VARCHAR(64),     -- hash of current device JWT
  is_active   BOOLEAN DEFAULT true
);

-- New table: hardware_notifications
CREATE TABLE hardware_notifications (
  id          SERIAL PRIMARY KEY,
  device_id   VARCHAR(32) NOT NULL REFERENCES hardware_devices(device_id),
  type        VARCHAR(32) NOT NULL,
  message     TEXT NOT NULL,
  subtext     TEXT,
  priority    VARCHAR(16) DEFAULT 'normal',
  icon        VARCHAR(32),
  haptic      VARCHAR(32),
  expires_at  TIMESTAMP,
  acked_at    TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- New columns on existing logs table
ALTER TABLE logs ADD COLUMN device_id VARCHAR(32) REFERENCES hardware_devices(device_id);
ALTER TABLE logs ADD COLUMN sensor_snapshot JSONB;
```

### Server Routes (new file: `src/server/routes/hardware-api.ts`)

```typescript
// Mount at /api/hardware
router.post('/register', handleRegister)
router.get('/notifications', requireDeviceAuth, handleGetNotifications)
router.post('/event', requireDeviceAuth, handleEvent)
router.put('/ack/:id', requireDeviceAuth, handleAck)
router.get('/config', requireDeviceAuth, handleConfig)
router.post('/session', requireDeviceAuth, handleSession)
router.post('/refresh', requireDeviceAuth, handleRefresh)
router.get('/firmware/latest', requireDeviceAuth, handleFirmwareCheck)
```

### Log Tab Display

When `event === 'copy_button_press'` appears in logs, display:

```
📋  Copied on COSMO                    11:05 AM
    "Coffee time!" — from reminder
    ↳ 22.3°C · 48% RH · 1013 hPa      [expand]
```

### Settings Panel (Hardware Tab)

New tab in LOT Settings → Hardware:
- Shows registered devices
- Device name, last seen, battery level
- Button: "Generate QR for new device"
- Button: "Send notification" (custom text to device)
- Toggle: notification types on/off

---

## Notification Push from LOT Site

Admin and AI engine can push notifications to any registered device.

### AI-generated notifications (automatic)

The LOT Memory Engine and QIE check if the user has a registered COSMO device. If so, they generate device notifications alongside regular app notifications:

```typescript
// In memory_engine.ts — after generating question
if (user.hasDevice) {
  await pushDeviceNotification(user.deviceId, {
    type: 'memory',
    message: 'Memory check-in',
    subtext: question.text.slice(0, 40) + '…',
    priority: 'low',
    haptic: 'single_soft'
  })
}
```

### Manual notifications (admin/user)

From the LOT site, Vadik can send custom notifications to any device:

```
POST /api/hardware/admin/push
{
  "deviceId": "cosmo_001",
  "message": "Coffee time!",
  "type": "reminder",
  "haptic": "double_buzz"
}
```

---

*COSMO® CIA — LOT Systems — API Connector v1.0 — 2026-05-26*
