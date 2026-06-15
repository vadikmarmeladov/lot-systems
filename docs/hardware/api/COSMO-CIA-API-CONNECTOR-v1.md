<!--
  LOT SYSTEMS CORPORATION — COSMO® CIA
  API Connector Specification v1.0
  Prepared: 2026-06-15
-->

# COSMO® CIA — LOT API Connector Specification v1.0

**Classification:** Internal — Backend & Firmware Engineering
**Scope:** Hardware ↔ lot-systems.com API contract

---

## 1. Authentication Model

All COSMO® CIA API calls use device-scoped Bearer tokens, separate from user session tokens.

### Token Lifecycle

```
1. User opens lot-systems.com Settings → Hardware → Pair New Device
2. System generates: device_id (UUID v4) + api_token (64-char hex)
3. User scans QR code with COSMO® CIA in provisioning mode
4. Device stores device_id + api_token in NVS
5. Token is single-device-bound — cannot be reused
6. User can revoke a token at any time from the dashboard
```

### Request Headers (all requests)

```http
Authorization: Bearer {api_token}
X-Device-ID: {device_id}
X-Firmware: {version}
Content-Type: application/json
User-Agent: COSMO-CIA/1.0 (ESP32-S3)
```

---

## 2. Device Provisioning Flow

```
Device boots without config
    │
    ▼
BLE advertising: "COSMO-CIA-{last4hex}"
    │
    ▼
User opens LOT app on phone → Settings → Pair Hardware
    │
    ▼
App performs BLE GATT write:
  Characteristic: WIFI_SSID (UUID: 6E400001-...)
  Value: "MyHomeWifi"
  
  Characteristic: WIFI_PASS (UUID: 6E400002-...)
  Value: "password123"
  
  Characteristic: API_TOKEN (UUID: 6E400003-...)
  Value: "{64-char token}"
  
  Characteristic: DEVICE_ID (UUID: 6E400004-...)
  Value: "{UUID v4}"
    │
    ▼
Device saves to NVS → reboots → connects to Wi-Fi → pings API
    │
    ▼
LOT dashboard shows device as "Online"
```

---

## 3. API Endpoint Reference

**Base URL:** `https://lot-systems.com/api/hardware`

---

### 3.1 GET /notifications

Fetch unread notifications for this device.

**Request:**
```http
GET /api/hardware/notifications?last_seen=2026-06-15T09:00:00Z
Authorization: Bearer {token}
X-Device-ID: {device_id}
```

**Response 200:**
```json
{
  "notifications": [
    {
      "id": "notif_abc123def456",
      "text": "Coffee time!",
      "priority": "normal",
      "category": "wellness",
      "created_at": "2026-06-15T09:00:00Z",
      "expires_at": "2026-06-15T11:00:00Z"
    },
    {
      "id": "notif_xyz789",
      "text": "Hydrate now.",
      "priority": "normal",
      "category": "wellness",
      "created_at": "2026-06-15T10:30:00Z",
      "expires_at": null
    }
  ],
  "server_time": "2026-06-15T10:31:00Z",
  "next_poll_seconds": 60
}
```

**Response 204:** No new notifications.

**Notification priorities:**
| Value | Behaviour |
|-------|-----------|
| `normal` | Display in queue |
| `high` | Display immediately, flash LED 3× |
| `silent` | Store only, no display |

---

### 3.2 POST /log

Signal Copy button press. Creates a Log tab entry on lot-systems.com in real time.

**Request:**
```http
POST /api/hardware/log
Authorization: Bearer {token}
X-Device-ID: {device_id}
Content-Type: application/json

{
  "notification_id": "notif_abc123def456",
  "action": "copy",
  "timestamp": "2026-06-15T09:01:45Z",
  "sensor": {
    "temperature": 22.1,
    "humidity": 48.3,
    "pressure": 1013.2,
    "iaq": 72,
    "iaq_accuracy": 3,
    "co2_equivalent": 580.0,
    "voc_equivalent": 0.45
  },
  "battery_pct": 84,
  "wifi_rssi": -62
}
```

**Valid actions:**
| Action | Trigger |
|--------|---------|
| `copy` | Single press — acknowledge notification |
| `camera` | Double press — still captured |
| `dismiss` | Notification expired without press |

**Response 200:**
```json
{
  "logged": true,
  "log_id": "log_xyz789abc",
  "log_tab_entry": {
    "display": "[09:01:45]  COSMO® CIA  ·  Copy  ·  Coffee time!  ·  IAQ 72  ·  🔋84%",
    "category": "hardware"
  }
}
```

---

### 3.3 POST /session

Upload compressed 24h session data.

**Request:**
```http
POST /api/hardware/session
Authorization: Bearer {token}
X-Device-ID: {device_id}
Content-Type: application/json

{
  "session_date": "2026-06-15",
  "payload_encoding": "lz4+base64",
  "payload": "BASE64_OF_LZ4_COMPRESSED_BINARY",
  "uncompressed_bytes": 5840,
  "compressed_bytes": 1912
}
```

**Response 200:**
```json
{
  "received": true,
  "session_id": "sess_20260615_abc123",
  "processed": false,
  "message": "Queued for processing"
}
```

Sessions are processed asynchronously. Dashboard shows session data within ~1 hour.

---

### 3.4 POST /device-ping

Heartbeat. Called on boot and every 6 hours.

**Request:**
```http
POST /api/hardware/device-ping
Authorization: Bearer {token}
X-Device-ID: {device_id}
Content-Type: application/json

{
  "firmware_version": "1.0.4",
  "battery_pct": 84,
  "wifi_rssi": -62,
  "uptime_seconds": 14400,
  "sensor": {
    "temperature": 22.1,
    "iaq": 72,
    "iaq_accuracy": 3
  }
}
```

**Response 200:**
```json
{
  "status": "ok",
  "server_time": "2026-06-15T09:00:00Z",
  "ota_available": false,
  "config": {
    "poll_interval_seconds": 60,
    "notification_limit": 8
  }
}
```

---

### 3.5 GET /firmware/latest

Check for OTA update.

**Request:**
```http
GET /api/hardware/firmware/latest?device_id={id}&current_version=10004
Authorization: Bearer {token}
X-Device-ID: {device_id}
```

**Response 200 (update available):**
```json
{
  "version": "1.0.5",
  "version_int": 10005,
  "url": "https://lot-systems.com/firmware/cosmo-cia-1.0.5.bin",
  "sha256": "a3f4b2c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2",
  "size_bytes": 819200,
  "release_notes": "Improved notification polling cadence. Fixed BME688 IAQ drift."
}
```

**Response 200 (no update):**
```json
{
  "version": "1.0.4",
  "version_int": 10004,
  "up_to_date": true
}
```

---

## 4. Error Handling

| HTTP Status | Meaning | Device Action |
|-------------|---------|--------------|
| 200 | Success | Process response |
| 204 | No content | Continue normally |
| 400 | Bad request | Log error, continue |
| 401 | Unauthorized | Show `ERR 0x03` on display, stop polling |
| 403 | Token revoked | Show `REVOKED` on display, enter provisioning mode |
| 429 | Rate limited | Back off `Retry-After` seconds |
| 500 | Server error | Retry after 5 minutes |
| Timeout | Network issue | Retry with exponential backoff (30s, 60s, 120s) |

---

## 5. Rate Limits

| Endpoint | Limit |
|----------|-------|
| GET /notifications | 120 requests/hour per device |
| POST /log | 200 requests/hour per device |
| POST /session | 2 requests/hour per device |
| POST /device-ping | 12 requests/hour per device |
| GET /firmware/latest | 24 requests/day per device |

Rate limit response includes:
```json
{
  "error": "rate_limited",
  "retry_after_seconds": 45
}
```

---

## 6. Server-Side Implementation

### 6.1 New Route File

`src/server/routes/hardware-api.ts`

```typescript
import { FastifyInstance } from 'fastify'

export async function registerHardwareRoutes(app: FastifyInstance) {
  // Auth middleware — verifies X-Device-ID + Authorization: Bearer token
  app.addHook('onRequest', hardwareAuthMiddleware)

  app.get('/api/hardware/notifications', getNotificationsHandler)
  app.post('/api/hardware/log', postLogHandler)
  app.post('/api/hardware/session', postSessionHandler)
  app.post('/api/hardware/device-ping', devicePingHandler)
  app.get('/api/hardware/firmware/latest', getFirmwareHandler)
}
```

### 6.2 Database Migrations

```sql
-- Migration: add_hardware_tables

CREATE TABLE hardware_devices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  api_token    VARCHAR(64) NOT NULL UNIQUE,
  name         VARCHAR(64) DEFAULT 'COSMO CIA',
  firmware     VARCHAR(16),
  battery_pct  INT,
  last_ping    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON hardware_devices(user_id);
CREATE INDEX ON hardware_devices(api_token);

CREATE TABLE hardware_notifications (
  id          VARCHAR(64) PRIMARY KEY,
  device_id   UUID NOT NULL REFERENCES hardware_devices(id) ON DELETE CASCADE,
  text        VARCHAR(128) NOT NULL,
  priority    VARCHAR(16) DEFAULT 'normal',
  category    VARCHAR(32) DEFAULT 'wellness',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  read_at     TIMESTAMPTZ
);
CREATE INDEX ON hardware_notifications(device_id, read_at);

CREATE TABLE hardware_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID NOT NULL REFERENCES hardware_devices(id) ON DELETE CASCADE,
  notification_id VARCHAR(64),
  action          VARCHAR(32) NOT NULL,
  sensor_data     JSONB,
  battery_pct     INT,
  wifi_rssi       INT,
  logged_at       TIMESTAMPTZ NOT NULL
);
CREATE INDEX ON hardware_logs(device_id, logged_at DESC);

CREATE TABLE hardware_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id        UUID NOT NULL REFERENCES hardware_devices(id) ON DELETE CASCADE,
  session_date     DATE NOT NULL,
  payload          BYTEA,
  uncompressed_bytes INT,
  compressed_bytes   INT,
  received_at      TIMESTAMPTZ DEFAULT NOW(),
  processed_at     TIMESTAMPTZ,
  UNIQUE(device_id, session_date)
);
```

### 6.3 Log Tab Integration

`postLogHandler` inserts into `hardware_logs` AND broadcasts a real-time event via the existing LOT sync system (`sync.broadcast`):

```typescript
sync.broadcast(userId, {
  type: 'hardware_log',
  data: {
    device_id,
    action: 'copy',
    notification_text: 'Coffee time!',
    sensor: { iaq: 72, temperature: 22.1 },
    battery_pct: 84,
    logged_at: new Date().toISOString()
  }
})
```

The Log tab component handles `hardware_log` events and renders them with a hardware badge icon.

---

## 7. Testing with curl

```bash
# Device ping
curl -X POST https://lot-systems.com/api/hardware/device-ping \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Device-ID: YOUR_DEVICE_ID" \
  -H "Content-Type: application/json" \
  -d '{"firmware_version":"1.0.0","battery_pct":100}'

# Get notifications
curl https://lot-systems.com/api/hardware/notifications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Device-ID: YOUR_DEVICE_ID"

# Log a Copy action
curl -X POST https://lot-systems.com/api/hardware/log \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Device-ID: YOUR_DEVICE_ID" \
  -H "Content-Type: application/json" \
  -d '{"notification_id":"test_001","action":"copy","timestamp":"2026-06-15T09:00:00Z","battery_pct":84}'
```

---

*COSMO® CIA API Connector v1.0 — LOT Systems, Inc.*
*© 2026 LOT Systems, Inc. All rights reserved.*
