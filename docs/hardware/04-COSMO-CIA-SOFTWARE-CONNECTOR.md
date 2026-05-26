# COSMO® CIA — Software Connector
## LOT API Integration Guide

```
DOCUMENT:  04-COSMO-CIA-SOFTWARE-CONNECTOR
REVISION:  v1.0
DATE:      2026-05-26
BASE URL:  https://lot-systems.com
PREFIX:    /api/device
```

---

## 1. Overview

The Software Connector is the server-side API layer that bridges the COSMO CIA hardware device with the LOT Systems platform. It runs on the same Node.js/Fastify server as the main LOT application.

**File:** `src/server/routes/device-api.ts`
**Route prefix:** `/api/device`
**Authentication:** Device Bearer token OR user JWT session (endpoint-dependent)

---

## 2. Device Registration Flow

The device must be registered to a user account before it can use any authenticated endpoints.

### Step 1 — User generates a registration code (browser session required)

```http
POST /api/device/registration-code
Authorization: Bearer <user JWT token>

Response 200:
{
  "code": "A3F2B1C9",
  "expiresAt": "2026-05-26T14:30:00.000Z",
  "instructions": "Enter this code in the COSMO CIA WiFi setup portal."
}
```

The code is an 8-character hex string. It is valid for 1 hour and consumed after first use.

### Step 2 — Device registers using the code

The device enters this code in its WiFiManager captive portal, then makes:

```http
POST /api/device/register
Content-Type: application/json

{
  "registrationCode": "A3F2B1C9",
  "deviceSerial": "COSMO-AA:BB:CC:DD:EE:FF",
  "deviceModel": "COSMO-CIA-v1",
  "firmwareVersion": "1.0.0"
}

Response 200:
{
  "deviceId": "uuid-...",
  "apiToken": "lot_device_a1b2c3d4...",
  "message": "Device registered successfully. Store apiToken securely in device flash.",
  "userId": "user-uuid-..."
}
```

The `apiToken` must be stored securely in the ESP32's NVS flash. It never expires but can be revoked by deregistering the device.

---

## 3. Authenticated Device Endpoints

All device-to-server calls use:
```
Authorization: Bearer lot_device_<48 hex chars>
Content-Type: application/json
```

### 3.1 Heartbeat Ping

```http
GET /api/device/ping

Response 200:
{
  "ok": true,
  "serverTime": "2026-05-26T12:00:00.000Z",
  "deviceId": "uuid-...",
  "deviceModel": "COSMO-CIA-v1",
  "userId": "user-uuid-...",
  "config": {
    "notificationPollIntervalSeconds": 30,
    "sensorUploadIntervalSeconds": 300,
    "displayBrightness": 100,
    "notifications": true
  }
}
```

Call on boot and every 10 minutes. Updates `lastSeenAt` in user metadata.

### 3.2 Poll Notifications

```http
GET /api/device/notifications

Response 200:
{
  "notifications": [
    {
      "id": "uuid-...",
      "message": "Coffee time!",
      "source": "memory_engine",
      "priority": "normal",
      "createdAt": "2026-05-26T11:30:00.000Z"
    }
  ],
  "count": 1,
  "serverTime": "2026-05-26T12:00:00.000Z"
}
```

Poll every 30 seconds. Notifications are returned in reverse-chronological order. Display the first one.

### 3.3 Acknowledge Notification

After displaying a notification on the e-paper screen, acknowledge it:

```http
POST /api/device/notifications/ack
Content-Type: application/json

{
  "notificationId": "uuid-..."
}

Response 200:
{
  "ok": true
}
```

### 3.4 Log Device Event (Copy Button)

```http
POST /api/device/event
Content-Type: application/json

{
  "event": "copy_button",
  "metadata": {
    "displayedNotification": "Coffee time!",
    "batteryLevel": 87
  }
}

Response 200:
{
  "ok": true,
  "logId": "uuid-...",
  "event": "device_copy_button"
}
```

This creates a `device_copy_button` Log entry visible in the user's **Log tab** on lot-systems.com.

**Supported event types:**
| Event string | Log event | Description |
|-------------|-----------|-------------|
| `copy_button` | `device_copy_button` | Copy button single press |
| `startup` | `device_startup` | Device booted and connected |
| `heartbeat` | `device_heartbeat` | Manual heartbeat |
| `camera_capture` | `device_camera_capture` | Photo taken |
| `ota_update` | `device_ota_update` | Firmware updated |

### 3.5 Submit Sensor Data

```http
POST /api/device/sensor
Content-Type: application/json

{
  "temperature": 22.4,
  "humidity": 48,
  "pressure": 1013.2,
  "gasResistance": 85432,
  "iaqIndex": 52,
  "batteryLevel": 87,
  "firmwareVersion": "1.0.0"
}

Response 200:
{
  "ok": true,
  "recorded": "2026-05-26T12:00:00.000Z"
}
```

Sensor data is stored in:
- `user.metadata.latestDeviceSensor` — latest reading for profile display
- `logs` table with `event: 'device_sensor'` — historical analytics

---

## 4. Server-to-Device Push (Admin / AI Engine)

The LOT Memory Engine and admins can push notifications to user devices.

```http
POST /api/device/push
Authorization: Bearer <user JWT or admin JWT>
Content-Type: application/json

{
  "userId": "target-user-uuid-...",
  "message": "Coffee time!",
  "source": "memory_engine",
  "priority": "normal"
}

Response 200:
{
  "ok": true,
  "notificationId": "uuid-...",
  "queued": "2026-05-26T12:00:00.000Z"
}
```

The notification is stored as a `device_notification` Log entry. The device retrieves it on next poll.

**Priority levels:**
- `low` — informational, can be queued
- `normal` — standard notification
- `high` — urgent, displayed immediately on next poll

---

## 5. Device Management (Browser API)

User manages their registered devices from the LOT web app:

```http
GET /api/device/devices
Authorization: Bearer <user JWT>

Response 200:
{
  "devices": [
    {
      "deviceId": "uuid-...",
      "deviceSerial": "COSMO-AA:BB:CC:DD:EE:FF",
      "deviceModel": "COSMO-CIA-v1",
      "firmwareVersion": "1.0.0",
      "registeredAt": "2026-05-01T00:00:00.000Z",
      "lastSeenAt": "2026-05-26T11:55:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 6. Error Responses

| HTTP Status | Error | Cause |
|-------------|-------|-------|
| 400 | `registrationCode and deviceSerial required` | Missing fields |
| 401 | `Bearer token required` | No Authorization header |
| 401 | `Invalid device token` | Token not found in any user |
| 401 | `Invalid or expired registration code` | Code wrong or expired |
| 403 | `Cannot push notifications to other users` | Non-admin push attempt |
| 404 | `No COSMO CIA device registered` | User has no devices |
| 409 | `Device already registered` | Duplicate serial |
| 500 | `Internal server error` | Server-side failure |

---

## 7. Database Schema (User Metadata Extensions)

Device data is stored in `users.metadata` (JSONB field).

```json
{
  "pendingDeviceCode": {
    "code": "A3F2B1C9",
    "expiresAt": "2026-05-26T14:30:00Z"
  },
  "devices": [
    {
      "deviceId": "uuid-...",
      "deviceSerial": "COSMO-AA:BB:CC:DD:EE:FF",
      "deviceModel": "COSMO-CIA-v1",
      "firmwareVersion": "1.0.0",
      "apiToken": "lot_device_...",
      "registeredAt": "2026-05-01T00:00:00Z",
      "lastSeenAt": "2026-05-26T11:55:00Z",
      "lastSensorReading": {
        "temperature": 22.4,
        "humidity": 48,
        "pressure": 1013.2,
        "iaqIndex": 52,
        "batteryLevel": 87,
        "recordedAt": "2026-05-26T11:55:00Z"
      }
    }
  ],
  "latestDeviceSensor": { ... },
  "deviceConfig": {
    "notificationPollIntervalSeconds": 30,
    "sensorUploadIntervalSeconds": 300,
    "displayBrightness": 100,
    "notifications": true
  }
}
```

---

## 8. Log Events Reference

Device activity creates entries in the `logs` table:

| event | source | Description |
|-------|--------|-------------|
| `device_registered` | User metadata | New device linked to account |
| `device_unregistered` | User action | Device removed from account |
| `device_notification` | Server push | Notification queued for device |
| `device_copy_button` | Device event | Copy button pressed |
| `device_startup` | Device event | Device booted |
| `device_sensor` | Device sensor | BME688 reading submitted |
| `device_camera_capture` | Device event | Photo captured |
| `device_ota_update` | Device event | Firmware updated |

All device log events are visible in the **Log tab** on lot-systems.com.

---

## 9. Integration with Memory Engine

The LOT Memory Engine (AI) automatically sends notifications to registered devices when:

1. A new memory question is generated → "New question ready: [preview]"
2. A significant pattern is detected → "Pattern identified: [insight]"
3. QOS mode changes → "System mode: Recovery — rest now"
4. Weather context triggers a notification → "Rain incoming — adjust plans"
5. Time-based reminders (if enabled by user) → "Coffee time!", "Hydration reminder"

To trigger a notification from the Memory Engine internals, call:

```typescript
import { models } from '#server/models'

await models.Log.create({
  userId: targetUserId,
  event: 'device_notification',
  text: 'Coffee time!',
  metadata: {
    source: 'memory_engine',
    priority: 'normal',
    delivered: false,
  },
})
```

---

```
COSMO® CIA — Software Connector
LOT Systems Corporation | lot-systems.com
Document: 04-COSMO-CIA-SOFTWARE-CONNECTOR v1.0
```
