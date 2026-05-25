# COSMO® CIA — Software Connector
**Document:** COSMO-SW-001 · Rev 1.0
**Date:** 2026-05-25
**Scope:** LOT API integration layer — server + ESP32 firmware

---

## 1. Overview

The Software Connector is the bridge between the COSMO® CIA hardware and the LOT Systems platform at `lot-systems.com`. It consists of two parts:

| Component | Location | Language | Purpose |
|---|---|---|---|
| **LOT Device API** | `src/server/routes/device-api.ts` | TypeScript / Fastify | Server-side endpoints for device registration, notifications, Copy signals, sensor data |
| **ESP32 HTTP Client** | `firmware/main/lot_api.c` | C (ESP-IDF) | Device-side HTTPS client that calls the LOT Device API |

---

## 2. Server-Side API (`device-api.ts`)

### 2.1 Registration
```
POST /api/device/register
Content-Type: application/json

{
  "registration_code": "A3F2C9D1",
  "device_name": "My COSMO® CIA",
  "firmware_version": "1.0.0"
}

Response 200:
{
  "device_id": "uuid-v4",
  "device_token": "64-char-hex-token",
  "user_id": "uuid-v4",
  "registered_at": "ISO8601"
}
```

The registration code is generated from the LOT site:
`POST /api/device/generate-registration-code` (requires user session)

### 2.2 Notification Polling
```
GET /api/device/notifications
Authorization: Bearer <device_token>
X-Device-ID: <device_id>

Response 200:
{
  "notifications": [
    {
      "id": "ntf_abc",
      "message": "Coffee time! ☕",
      "type": "reminder",
      "priority": "normal",
      "created_at": "ISO8601",
      "expires_at": "ISO8601 | null",
      "read": false
    }
  ],
  "unread_count": 1
}
```

### 2.3 Copy Button Signal
```
POST /api/device/copy-signal
Authorization: Bearer <device_token>
X-Device-ID: <device_id>
Content-Type: application/json

{
  "timestamp": "ISO8601",
  "note": "optional user note",
  "sensor_snapshot": {
    "temperature_c": 22.4,
    "humidity_pct": 55.1,
    "pressure_hpa": 1013.2,
    "iaq_score": 85,
    "battery_pct": 76
  }
}

Response 200:
{ "ok": true, "logged": true }
```

This creates a `Log` entry in the user's LOT Log tab with event type `device_copy`.

### 2.4 Sensor Data Upload
```
POST /api/device/sensor-data
Authorization: Bearer <device_token>
X-Device-ID: <device_id>
Content-Type: application/json

{
  "timestamp": "ISO8601",
  "sensor_snapshot": { ... }
}
```

### 2.5 OTA Check
```
GET /api/device/ota/latest
Authorization: Bearer <device_token>
X-Device-ID: <device_id>
X-Firmware-Version: 1.0.0

Response 200:
{
  "current_version": "1.0.0",
  "latest_version": "1.0.1",
  "update_available": true,
  "firmware_url": "https://...",
  "sha256": "...",
  "release_notes": "..."
}
```

### 2.6 Send Notification (from LOT site)
```
POST /api/device/send-notification
Cookie: <user session>
Content-Type: application/json

{
  "message": "Coffee time! ☕",
  "type": "reminder",
  "priority": "normal",
  "expires_in_hours": 8
}
```

### 2.7 List Registered Devices (from LOT site)
```
GET /api/device/devices
Cookie: <user session>

Response 200:
{
  "devices": [
    {
      "id": "uuid",
      "name": "My COSMO® CIA",
      "firmwareVersion": "1.0.0",
      "lastSeenAt": "ISO8601",
      "batteryPct": 76,
      "registeredAt": "ISO8601"
    }
  ]
}
```

---

## 3. Data Storage Architecture

Device data is stored in the existing `User.metadata` JSONB field — no new database tables required for the 100-unit pilot.

```json
// User.metadata structure (additions for COSMO® CIA)
{
  "devices": [
    {
      "id": "uuid",
      "token": "64-hex (never returned to client)",
      "name": "My COSMO® CIA",
      "firmwareVersion": "1.0.0",
      "lastSeenAt": "ISO8601",
      "batteryPct": 76,
      "registeredAt": "ISO8601"
    }
  ],
  "deviceNotifications": [
    {
      "id": "uuid",
      "message": "Coffee time! ☕",
      "type": "reminder",
      "priority": "normal",
      "created_at": "ISO8601",
      "expires_at": "ISO8601",
      "read": false
    }
  ],
  "deviceRegistrationCode": "A3F2C9D1",
  "deviceRegistrationCodeCreatedAt": "ISO8601",
  "latestSensorData": {
    "deviceId": "uuid",
    "timestamp": "ISO8601",
    "temperature_c": 22.4,
    "humidity_pct": 55.1,
    "pressure_hpa": 1013.2,
    "iaq_score": 85,
    "battery_pct": 76
  }
}
```

> **Migration note:** For production scale (>1,000 units), migrate device records into a dedicated `devices` table. For the 100-unit pilot the metadata approach is sufficient.

---

## 4. ESP32 Firmware HTTP Client (`lot_api.c`)

### 4.1 Key Configuration
```c
// config.h
#define LOT_API_HOST        "lot-systems.com"
#define LOT_API_BASE_PATH   "/api/device"
#define LOT_POLL_INTERVAL_S 60
#define LOT_SENSOR_INTERVAL_S 300
```

### 4.2 HTTPS Setup
```c
// Use ISRG Root X1 (Let's Encrypt) CA for TLS verification
extern const uint8_t lot_ca_cert_pem_start[] asm("_binary_lot_ca_cert_pem_start");
extern const uint8_t lot_ca_cert_pem_end[]   asm("_binary_lot_ca_cert_pem_end");

esp_http_client_config_t config = {
    .host = LOT_API_HOST,
    .path = LOT_API_BASE_PATH "/health",
    .transport_type = HTTP_TRANSPORT_OVER_SSL,
    .cert_pem = (const char *)lot_ca_cert_pem_start,
    .timeout_ms = 10000,
};
```

### 4.3 Request Pattern (C)
```c
// POST copy-signal
esp_http_client_config_t cfg = { ... };
esp_http_client_handle_t client = esp_http_client_init(&cfg);
esp_http_client_set_url(client, "https://lot-systems.com/api/device/copy-signal");
esp_http_client_set_method(client, HTTP_METHOD_POST);
esp_http_client_set_header(client, "Authorization", "Bearer " DEVICE_TOKEN);
esp_http_client_set_header(client, "X-Device-ID", DEVICE_ID);
esp_http_client_set_header(client, "Content-Type", "application/json");
esp_http_client_set_post_field(client, json_body, strlen(json_body));

esp_err_t err = esp_http_client_perform(client);
if (err == ESP_OK) {
    int status = esp_http_client_get_status_code(client);
    // handle status 200 → ok
}
esp_http_client_cleanup(client);
```

### 4.4 NVS Key Storage
```c
// Store device credentials in NVS (encrypted)
nvs_handle_t h;
nvs_open("cosmo_creds", NVS_READWRITE, &h);
nvs_set_str(h, "device_id",    device_id);
nvs_set_str(h, "device_token", device_token);
nvs_commit(h);
nvs_close(h);
```

---

## 5. LOT Site Integration Points

### 5.1 Log Tab (lot-systems.com/log)
Copy button presses appear as log entries with event type `device_copy`. The log text format is:

```
📋 COPY — My COSMO® CIA — 22.4°C · 55% RH · IAQ 85
```

### 5.2 Settings → Devices (future UI)
Admin users can:
- Generate registration codes
- View registered devices + battery/last-seen status
- Send notifications to devices
- Remove devices

### 5.3 AI Notifications
The LOT site AI engine (Together AI / Claude / Gemini) can trigger device notifications via the `/api/device/send-notification` endpoint. Example scheduled job (in `src/server/scheduled-jobs.ts`):

```typescript
// Send morning notification to all users with devices
const usersWithDevices = await User.findAll({
  where: sequelize.literal(`metadata->'devices' IS NOT NULL AND jsonb_array_length(metadata->'devices') > 0`)
})
for (const user of usersWithDevices) {
  await fetch(`${BASE_URL}/api/device/send-notification`, {
    method: 'POST',
    headers: { Cookie: adminSessionCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Good morning! ☀️', type: 'greeting', expires_in_hours: 4 })
  })
}
```

---

## 6. Environment Variables (OTA)

Add to Digital Ocean App Platform environment:

| Variable | Value | Purpose |
|---|---|---|
| `COSMO_FIRMWARE_VERSION` | `1.0.0` | Current production firmware version |
| `COSMO_FIRMWARE_URL` | `https://...` | URL to firmware `.bin` file |
| `COSMO_FIRMWARE_SHA256` | `abc123...` | SHA256 of firmware binary |
| `COSMO_FIRMWARE_NOTES` | `...` | Release notes string |

---

## 7. Security Considerations

- Device tokens are 256-bit random secrets (64 hex chars), never logged
- Tokens are hashed with SHA256 before storage for production (pilot: plaintext in JSONB)
- All endpoints use HTTPS/TLS 1.3
- ESP32-S3 stores token in AES-256 encrypted NVS partition
- Rate limiting: device endpoints are behind Fastify rate-limit (50 req/min per IP)
- The `devices` list is scanned per request — acceptable for 100-unit pilot; add indexed `Device` model for scale

---

*Document COSMO-SW-001 · lot-systems.com · Rev 1.0 · 2026-05-25*
