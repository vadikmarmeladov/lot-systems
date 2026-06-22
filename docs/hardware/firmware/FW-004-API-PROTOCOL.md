<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# FW-004 — API PROTOCOL
## LOT Computer Hardware Device · Wire Format

---

## Base URL

```
Production:  https://lot-systems.com/api/hardware
Staging:     https://staging.lot-systems.com/api/hardware
```

## Device Headers (all requests)

```
Authorization: Bearer <deviceToken>
X-Device-ID:   <uuid-v4>
X-FW-Version:  1.0.3
Content-Type:  application/json
```

## Endpoints

### POST /register

Called once during BLE provisioning. Links device to user account.

```json
Request:
{
  "device_id": "uuid",
  "user_token": "user_jwt_from_ble_setup",
  "hw_revision": "1.0",
  "fw_version": "1.0.0"
}

Response 201:
{
  "device_token": "eyJ...",
  "expires_at": "2026-09-22T00:00:00Z",
  "user_id": "uuid"
}
```

### GET /ws (WebSocket Upgrade)

```
wss://lot-systems.com/api/hardware/ws
Upgrade: websocket
Authorization: Bearer <deviceToken>
X-Device-ID: <uuid>
```

#### Server → Device messages

```json
// Notification
{
  "type": "notification",
  "id": "notif_uuid",
  "text": "Coffee time! ☕",
  "priority": "normal",
  "timestamp": "2026-06-22T14:30:00Z",
  "ttl": 3600
}

// Config update
{
  "type": "config",
  "sleep_interval_s": 60,
  "display_brightness": 80
}

// OTA trigger
{
  "type": "ota",
  "version": "1.0.4",
  "url": "https://lot-systems.com/firmware/lot-hw-1.0.4.bin",
  "sha256": "abc123..."
}
```

#### Device → Server messages

```json
// ACK
{
  "type": "ack",
  "notification_id": "notif_uuid",
  "received_at": "2026-06-22T14:30:02Z"
}

// Heartbeat (every 60 min)
{
  "type": "heartbeat",
  "battery_pct": 84,
  "sensor": {
    "temperature_c": 22.4,
    "humidity_pct": 48.2,
    "pressure_hpa": 1013.1,
    "iaq_score": 72,
    "iaq_accuracy": 3
  },
  "wifi_rssi": -62,
  "fw_version": "1.0.3"
}
```

### POST /log-event

Copy button press creates a Log entry on lot-systems.com.

```json
Request:
{
  "event_type": "copy_button",
  "notification_id": "notif_uuid",
  "notification_text": "Coffee time!",
  "pressed_at": "2026-06-22T14:31:07Z",
  "sensor_snapshot": {
    "temperature_c": 22.4,
    "humidity_pct": 48.2,
    "iaq_score": 72
  }
}

Response 201:
{
  "log_entry_id": "log_uuid",
  "created_at": "2026-06-22T14:31:07Z",
  "display_text": "✓ Logged to LOT"
}
```

## Error Codes

```
401  Unauthorized      — invalid or expired deviceToken
403  Forbidden         — device not registered to this user
429  Rate limited      — max 60 requests/min per device
503  Service down      — fallback: queue events in NVS flash
```
