# COSMO Computer — LOT API Connector
**Document:** 07-LOT-API-CONNECTOR  
**Revision:** A  
**Date:** 2026-05-27  

---

## 1. Overview

The **LOT API Connector** defines all communication between the COSMO Computer device and the **lot-systems.com** platform. The device communicates over HTTPS (TLS 1.3) using REST + JSON. WebSocket is used for real-time push notifications.

**Base URL:** `https://lot-systems.com`  
**Device API prefix:** `/api/device/`  
**Auth:** JWT Bearer token

---

## 2. Device Registration & Authentication

### 2.1 Register Device

Called once at first boot after Wi-Fi provisioning.

```
POST /api/device/register
Content-Type: application/json
```

**Request body:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "device_secret": "a3f9b2c1d8e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
  "firmware_version": "1.0.0",
  "hardware_revision": "A",
  "user_claim_code": "COSMO-XXXX-XXXX"
}
```

> `user_claim_code` is printed on the QR sticker inside the box. User enters it on lot-systems.com/devices to link the device to their account.

**Response 201 Created:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "registered": true,
  "linked_to_user": false,
  "message": "Device registered. Awaiting user claim."
}
```

---

### 2.2 Device Authentication

Called on every boot (or when token expires).

```
POST /api/device/auth
Content-Type: application/json
```

**Request body:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "device_secret": "a3f9b2c1..."
}
```

**Response 200 OK:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiJ9...",
  "expires_in": 3600,
  "user_id": "usr_abc123",
  "linked": true
}
```

**Response 401 (not yet claimed):**
```json
{
  "error": "DEVICE_NOT_CLAIMED",
  "message": "Visit lot-systems.com/devices to link this device to your account"
}
```

Device displays: "Scan QR to link device →" with QR code pointing to `lot-systems.com/devices?claim=CC-R1-20260601-0001`

---

### 2.3 Token Refresh

```
POST /api/device/refresh
Authorization: Bearer <refresh_token>
```

**Response 200 OK:**
```json
{
  "access_token": "eyJ...",
  "expires_in": 3600
}
```

---

## 3. Notifications

### 3.1 Poll Notifications

Called every 60 seconds (or configured interval).

```
GET /api/device/notifications
Authorization: Bearer <access_token>
```

**Response 200 OK:**
```json
{
  "notifications": [
    {
      "id": "notif_7f8a9b0c",
      "text": "Coffee time!",
      "source": "LOT System",
      "category": "wellness",
      "priority": "normal",
      "timestamp": "2026-05-27T09:42:00Z",
      "ttl": 3600,
      "display_style": "standard"
    },
    {
      "id": "notif_1a2b3c4d",
      "text": "IAQ Alert: Air quality declining. 88 IAQ.",
      "source": "COSMO Sensors",
      "category": "environment",
      "priority": "urgent",
      "timestamp": "2026-05-27T10:15:00Z",
      "ttl": 900,
      "display_style": "alert"
    }
  ],
  "unread_count": 2,
  "next_poll_interval": 60
}
```

**Notification categories:**
| Category | Source | Examples |
|----------|--------|---------|
| `wellness` | LOT Memory Engine | "Coffee time!", "Time for a stretch", "How was your morning?" |
| `environment` | Device sensors | "Air quality declining", "Temperature dropped" |
| `system` | LOT platform | "Firmware update available", "Subscription renewed" |
| `reminder` | User-set | "Meeting in 15 min", "Take vitamins" |

### 3.2 Mark Notification Read

```
POST /api/device/notifications/:id/read
Authorization: Bearer <access_token>
```

**Response 200 OK:**
```json
{ "id": "notif_7f8a9b0c", "read": true }
```

---

## 4. COPY Button → Log Event

This is the **primary user interaction**. When the user presses COPY, the device logs the event to the user's **Log tab** on lot-systems.com.

```
POST /api/device/log
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "action": "COPY",
  "notification_id": "notif_7f8a9b0c",
  "notification_text": "Coffee time!",
  "timestamp": "2026-05-27T09:43:15Z",
  "sensor_snapshot": {
    "temperature": 22.4,
    "humidity": 48.2,
    "pressure": 1013.25,
    "iaq": 87,
    "co2_equivalent": 412.5,
    "voc_equivalent": 0.31,
    "ambient_lux": 324,
    "battery_percent": 85,
    "wifi_rssi": -58
  }
}
```

**Response 201 Created:**
```json
{
  "log_id": "log_x9y8z7w6",
  "logged_at": "2026-05-27T09:43:15Z",
  "appears_in": "Log tab"
}
```

**How it appears in Log tab on lot-systems.com:**
```
[2026-05-27 09:43] COSMO COPY
  "Coffee time!"
  📍 22.4°C · 48% · IAQ 87 · 85% battery
```

---

## 5. Sensor Data Upload

```
POST /api/device/sensor-data
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "timestamp": "2026-05-27T09:45:00Z",
  "readings": {
    "temperature": 22.4,
    "humidity": 48.2,
    "pressure": 1013.25,
    "iaq": 87,
    "iaq_accuracy": 3,
    "co2_equivalent": 412.5,
    "breath_voc_equivalent": 0.31,
    "ambient_lux": 324,
    "battery_voltage": 3.92,
    "battery_percent": 85,
    "charging": false,
    "wifi_rssi": -58,
    "activity": "stationary"
  }
}
```

**Response 200 OK:**
```json
{ "recorded": true }
```

Sensor data is stored and displayed in the user's System tab weather/environment widget.

---

## 6. OTA Firmware Update

### 6.1 Check Latest Firmware

```
GET /api/device/firmware/latest
Authorization: Bearer <access_token>
```

**Response 200 OK:**
```json
{
  "version": "1.0.0",
  "url": "https://firmware.lot-systems.com/cosmo/cc-r1-1.0.0.bin",
  "sha256": "a1b2c3d4e5f6...",
  "size": 1048576,
  "release_date": "2026-06-01",
  "changelog": "Initial release for Rev A pilot units.",
  "mandatory": false
}
```

### 6.2 Report OTA Result

```
POST /api/device/firmware/report
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "result": "success",
  "previous_version": "0.9.0",
  "new_version": "1.0.0",
  "timestamp": "2026-05-27T10:00:00Z"
}
```

---

## 7. Device Configuration

The server can push configuration changes to the device.

```
GET /api/device/config
Authorization: Bearer <access_token>
```

**Response 200 OK:**
```json
{
  "poll_interval": 60,
  "display_brightness": 128,
  "led_enabled": true,
  "sensor_upload_interval": 900,
  "timezone_offset": -480,
  "notifications_enabled": true,
  "copy_button_feedback": "flash_and_haptic"
}
```

---

## 8. Session Upload

Compressed session data (see [11-SESSION-COMPRESSION.md](./11-SESSION-COMPRESSION.md)) uploaded after each session.

```
POST /api/device/session-upload
Authorization: Bearer <access_token>
Content-Type: application/octet-stream
X-Session-ID: session_20260527_094200
X-Compression: lz4
X-Uncompressed-Size: 4096
X-Firmware-Version: 1.0.0
```

**Body:** LZ4-compressed session binary

**Response 200 OK:**
```json
{
  "session_id": "session_20260527_094200",
  "received": true,
  "uncompressed_size": 4096
}
```

---

## 9. Error Reporting

```
POST /api/device/error-report
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body:**
```json
{
  "device_id": "CC-R1-20260601-0001",
  "error_code": "0x03",
  "error_constant": "ERR_API_TIMEOUT",
  "context": "notification_poll",
  "timestamp": "2026-05-27T09:42:00Z",
  "firmware_version": "1.0.0"
}
```

---

## 10. WebSocket (Real-Time Push)

For instant notifications without 60-second polling delay, the device opens a persistent WebSocket:

```
wss://lot-systems.com/ws/device?token=<access_token>&device_id=CC-R1-XXXXXX
```

### WebSocket Message Types (Server → Device)

```json
// New notification
{
  "type": "notification",
  "data": {
    "id": "notif_xxx",
    "text": "Coffee time!",
    "priority": "normal"
  }
}

// Config update
{
  "type": "config_update",
  "data": { "poll_interval": 30 }
}

// OTA available
{
  "type": "ota_available",
  "data": { "version": "1.1.0" }
}

// Ping
{ "type": "ping" }
```

### WebSocket Message Types (Device → Server)

```json
// Pong
{ "type": "pong" }

// COPY button event (real-time)
{
  "type": "copy_event",
  "data": { ... }  // same as POST /api/device/log body
}

// Sensor update
{
  "type": "sensor_update",
  "data": { ... }
}
```

**Reconnection:** Exponential backoff (1s, 2s, 4s, 8s, max 60s).

---

## 11. Server-Side Implementation Required

The following routes must be added to the LOT Systems Express server (`src/server/routes/`):

```typescript
// src/server/routes/device-api.ts

router.post('/api/device/register', handleDeviceRegister)
router.post('/api/device/auth', handleDeviceAuth)
router.post('/api/device/refresh', handleDeviceRefresh)
router.get('/api/device/notifications', authDevice, handleGetNotifications)
router.post('/api/device/notifications/:id/read', authDevice, handleMarkRead)
router.post('/api/device/log', authDevice, handleDeviceLog)        // → Log tab
router.post('/api/device/sensor-data', authDevice, handleSensorData)
router.get('/api/device/firmware/latest', authDevice, handleFirmwareCheck)
router.post('/api/device/firmware/report', authDevice, handleFirmwareReport)
router.get('/api/device/config', authDevice, handleGetConfig)
router.post('/api/device/session-upload', authDevice, handleSessionUpload)
router.post('/api/device/error-report', authDevice, handleErrorReport)

// WebSocket upgrade
server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith('/ws/device')) {
    deviceWss.handleUpgrade(req, socket, head, (ws) => {
      deviceWss.emit('connection', ws, req)
    })
  }
})
```

**Database schema additions needed:**
```sql
-- Devices table
CREATE TABLE devices (
  id            TEXT PRIMARY KEY,    -- CC-R1-20260601-0001
  secret_hash   TEXT NOT NULL,       -- bcrypt hash of device_secret
  user_id       INTEGER REFERENCES users(id),
  hw_revision   TEXT,
  fw_version    TEXT,
  registered_at TIMESTAMP,
  last_seen     TIMESTAMP
);

-- Device logs (COPY button events → appears in Log tab)
CREATE TABLE device_logs (
  id                  SERIAL PRIMARY KEY,
  device_id           TEXT REFERENCES devices(id),
  user_id             INTEGER REFERENCES users(id),
  action              TEXT,             -- 'COPY'
  notification_text   TEXT,
  sensor_snapshot     JSONB,
  logged_at           TIMESTAMP
);

-- Device sensor data
CREATE TABLE device_sensor_data (
  id          SERIAL PRIMARY KEY,
  device_id   TEXT REFERENCES devices(id),
  user_id     INTEGER REFERENCES users(id),
  readings    JSONB,
  recorded_at TIMESTAMP
);
```

---

## 12. Notification Generation

Notifications are generated by the LOT Memory Engine and sent to linked devices. The AI model crafts short, contextual messages based on the user's Memory Story.

**AI Prompt for notification generation:**
```
You are LOT System, a self-care companion.
Based on this user's Memory Story and current time/weather,
generate a single short notification (max 8 words) for their COSMO Computer.
Current context: time=09:42, weather=clear, temperature=22°C
Memory context: "User prefers tea in the morning as a ritual."

Output: One line only. No punctuation at end unless exclamation.
Example: "Tea ritual time — it's a clear morning"
```

Notification schedule is managed by the LOT Memory Engine's existing AI question cadence, extended to push to devices.

---

*Document: 07-LOT-API-CONNECTOR.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
