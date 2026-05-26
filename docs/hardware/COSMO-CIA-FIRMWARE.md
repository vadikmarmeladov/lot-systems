# COSMO® CIA — Firmware Specification
## ESP32-S3 Embedded Firmware · v1.0
**Platform:** ESP-IDF v5.x (Espressif IoT Development Framework)  
**Language:** C (core) + C++ (sensor libraries)  
**Date:** 2026-05-26

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    COSMO® CIA Firmware                  │
├──────────────┬──────────────┬──────────────┬────────────┤
│  NET Layer   │  APP Layer   │  HAL Layer   │  SYS Layer │
│              │              │              │            │
│  WiFi Mgr    │  Notif Eng   │  Display Drv │  Power Mgr │
│  WS Client   │  Session Cmp │  Camera Drv  │  OTA Mgr   │
│  HTTPS Client│  Button Hdlr │  BME688 Drv  │  NVS Store │
│  LOT API Cli │  Haptic Ctrl │  IMU Drv     │  Log Engine│
└──────────────┴──────────────┴──────────────┴────────────┘
        ↕              ↕              ↕              ↕
                   FreeRTOS Tasks
```

All major subsystems run as independent FreeRTOS tasks communicating via queues and event groups. No blocking calls in ISRs.

---

## 2. FreeRTOS Task Map

| Task | Priority | Stack | Core | Function |
|------|----------|-------|------|---------|
| `wifi_manager_task` | 5 | 4096 | 0 | WiFi connect/reconnect state machine |
| `websocket_task` | 6 | 6144 | 0 | WebSocket connection + rx notification |
| `notification_task` | 4 | 4096 | 1 | Notification queue consumer + display |
| `sensor_task` | 3 | 4096 | 1 | BME688 + IMU polling (1 Hz) |
| `session_task` | 2 | 4096 | 0 | 30-min session compression + upload |
| `button_task` | 7 | 2048 | 1 | Debounce + Copy signal → LOT API |
| `ota_task` | 1 | 8192 | 0 | OTA check + download (background) |
| `power_task` | 8 | 2048 | 1 | Sleep/wake management |

---

## 3. Boot Sequence

```
Power on / wake from deep sleep
    │
    ▼
esp_idf_init()
    │
    ▼
NVS flash init (config + state restore)
    │
    ▼
Display init → show boot screen (COSMO® CIA + fw version)
    │
    ▼
WiFi init → connect (saved credentials from NVS)
    ├── No saved credentials → BLE provisioning mode
    └── Credentials found → connect (max 30s timeout)
              │
              ▼
         Connected → WebSocket handshake to lot-systems.com/device/ws
              │
              ▼
         BME688 init → BSEC2 state restore from NVS
              │
              ▼
         IMU init → tap detection enable
              │
              ▼
         All tasks started → enter operational loop
```

---

## 4. WiFi Management

### 4.1 State Machine

```
DISCONNECTED → CONNECTING → CONNECTED → OPERATIONAL
      ↑              │           │
      └──────────────┘           │ (dropped)
                                 ↓
                          RECONNECTING (exponential backoff)
                          2s → 4s → 8s → 16s → 60s cap
```

### 4.2 Configuration

```c
// wifi_manager.h
#define WIFI_RECONNECT_MAX_RETRIES   10
#define WIFI_RECONNECT_BASE_MS       2000
#define WIFI_CONNECT_TIMEOUT_MS      30000
#define WIFI_SSID_MAX_LEN            32
#define WIFI_PASS_MAX_LEN            64
```

### 4.3 NVS Keys

| Key | Type | Contents |
|-----|------|---------|
| `wifi/ssid` | string | Network SSID |
| `wifi/pass` | string | Network password (AES-256 encrypted) |
| `wifi/status` | uint8 | Last known connection result |

---

## 5. WebSocket Notification Client

### 5.1 Connection

```
wss://lot-systems.com/device/ws?device_id=<DEVICE_UUID>&token=<AUTH_TOKEN>
```

- Protocol: WebSocket over TLS 1.3
- Auth: JWT bearer token stored in NVS, refreshed via HTTPS
- Heartbeat: client → server PING every 30 seconds
- Auto-reconnect on disconnect: same backoff as WiFi

### 5.2 Message Protocol

**Server → Device (notification):**
```json
{
  "type": "notification",
  "id": "notif_01HXYZ",
  "text": "Coffee time!",
  "priority": "normal",
  "sender": "lot-systems.com",
  "timestamp": "2026-05-26T10:00:00Z",
  "ttl": 300
}
```

**Server → Device (command):**
```json
{
  "type": "command",
  "action": "ota_check" | "reboot" | "clear_session" | "display_test",
  "payload": {}
}
```

**Device → Server (ack):**
```json
{
  "type": "ack",
  "notif_id": "notif_01HXYZ",
  "device_id": "COSMO_001",
  "received_at": "2026-05-26T10:00:01Z"
}
```

### 5.3 Notification Queue

```c
// notification_task.h
#define NOTIF_QUEUE_SIZE    10    // Max pending notifications
#define NOTIF_DISPLAY_MS    8000  // Display each notification 8 seconds
#define NOTIF_SCROLL_SPEED  2     // pixels/frame for long text scroll
```

---

## 6. Display Engine

### 6.1 Screen Layout

```
┌────────────────────────────┐
│ LOT              10:42 AM  │  ← Header bar (8px)
├────────────────────────────┤
│                            │
│  ☁  72°F  AQI 42          │  ← Weather strip (16px)
│                            │
├────────────────────────────┤
│                            │
│   Coffee time!             │  ← Notification text
│                            │  (scrolls if > 1 line)
│                            │
├────────────────────────────┤
│ ● lot-systems.com  COPY →  │  ← Footer (8px)
└────────────────────────────┘
  80px wide × 160px tall (rotated landscape: 160×80)
```

### 6.2 Display States

| State | Trigger | Behavior |
|-------|---------|---------|
| `BOOT` | Power on | COSMO® logo + fw version, 3s |
| `ACTIVE` | Notification received | Full layout above |
| `IDLE` | No notification for 60s | Clock + weather only |
| `COPY_CONFIRM` | Button pressed | Green "Sent ✓" flash 1s |
| `SLEEP` | No activity 5 min | Screen off, IMU wake |
| `ERROR` | WiFi / server down | Red "Offline" indicator |
| `CHARGE` | Charging detected | Battery fill animation |

### 6.3 Driver Interface

```c
void display_init(void);
void display_show_notification(const char* text, const char* source);
void display_show_weather(float temp_c, uint8_t humidity, uint16_t aqi);
void display_set_state(display_state_t state);
void display_set_brightness(uint8_t percent);  // 0–100
```

---

## 7. Sensor Layer

### 7.1 BME688 + BSEC2 (AI Environmental)

```c
// sensor_bme688.h
#define BSEC_SAMPLE_RATE    BSEC_SAMPLE_RATE_LP  // 3.33 seconds
#define BSEC_STATE_SAVE_INTERVAL_S  3600          // Save state hourly to NVS

// Outputs:
//   iaq        — Indoor Air Quality index (0–500)
//   iaq_acc    — IAQ accuracy (0=unreliable, 3=high)
//   temperature — °C, compensated
//   humidity    — %RH, compensated
//   pressure    — hPa
//   co2_eq     — ppm CO₂ equivalent
//   bvoc_eq    — ppm bVOC equivalent
```

BSEC2 library runs the Bosch AI gas classification model. State is persisted to NVS so the model resumes training across reboots.

### 7.2 ICM-42688-P IMU

```c
// sensor_imu.h
#define IMU_WAKE_ON_TAP     true
#define IMU_TAP_THRESHOLD   0.5f   // g
#define IMU_TAP_DURATION_MS 20

// Single-tap → wake screen from sleep
// Double-tap → not assigned (reserved)
```

### 7.3 Sensor Aggregation

Every 60 seconds, sensor data is packaged:
```json
{
  "ts": "2026-05-26T10:00:00Z",
  "temp_c": 21.4,
  "humidity": 58.2,
  "pressure_hpa": 1013.1,
  "iaq": 42,
  "iaq_acc": 3,
  "co2_eq_ppm": 520,
  "ax": 0.01, "ay": 0.00, "az": 1.00
}
```

---

## 8. Copy Button Handler

### 8.1 Flow

```
GPIO interrupt (falling edge, debounced 20ms)
    │
    ▼
Capture state snapshot:
  - current_notif_id
  - current_notif_text
  - sensor_last (temp, humidity, iaq)
  - timestamp (UTC)
  - device_id
    │
    ▼
Trigger haptic pulse (DRV2605L effect #1, 50ms)
    │
    ▼
Display: COPY_CONFIRM state (1 second)
    │
    ▼
HTTPS POST → https://lot-systems.com/api/device/log
  Body:
  {
    "device_id": "COSMO_001",
    "event": "copy",
    "notif_id": "notif_01HXYZ",
    "notif_text": "Coffee time!",
    "context": { temp_c, humidity, iaq },
    "timestamp": "2026-05-26T10:00:01Z"
  }
    │
    ├── HTTP 200 → display stays at COPY_CONFIRM ✓
    └── HTTP error → retry once after 5s, then queue to session buffer
```

### 8.2 Offline Resilience

If not connected, Copy events are queued in a circular buffer (max 50 events) in RTC memory (survives deep sleep). Uploaded on next WiFi connection.

---

## 9. Session Compression

### 9.1 Session Window

Every 30 minutes, the session task:

1. Collects all received notifications (text + timestamps + acks)
2. Collects all sensor readings
3. Collects all Copy events
4. Serializes to JSON
5. Gzip compresses (target: 80%+ reduction)
6. Stores to SPI flash (LittleFS, max 20 sessions)
7. Uploads to `https://lot-systems.com/api/device/session` on WiFi

### 9.2 Compression Format

```
Header: COSMO_SESSION_V1\n
Body: gzip-compressed JSON
SHA256 checksum appended (32 bytes)
```

### 9.3 Flash Management

- Total flash: 8MB (ESP32-S3-WROOM-1-N8)
- Firmware partition: 2MB
- OTA partition: 2MB
- NVS: 512KB
- LittleFS (session store): 3.5MB ≈ ~200 sessions of 30min

---

## 10. OTA Firmware Updates

### 10.1 Update Check

OTA check runs once per hour (background task, low priority):

```
GET https://lot-systems.com/api/device/firmware/latest
  Response: { "version": "1.0.3", "url": "...", "sha256": "..." }
```

If new version > current version:
1. Download to OTA partition
2. Verify SHA256
3. Verify Espressif signature (RSA-2048)
4. Set OTA boot flag
5. Reboot on next idle period (not during active notification)

### 10.2 Version Format

`MAJOR.MINOR.PATCH` — e.g., `1.0.0`  
Stored in eFuse (immutable serial number) + firmware binary header.

---

## 11. Power Management

### 11.1 Power States

| State | Current draw | Condition |
|-------|-------------|-----------|
| ACTIVE (screen on) | ~120mA | Notification being displayed |
| CONNECTED (screen off) | ~40mA | WiFi active, no screen |
| LIGHT SLEEP | ~2mA | WiFi modem sleep, IMU active |
| DEEP SLEEP | ~45µA | WiFi off, RTC + IMU only |

### 11.2 Sleep Triggers

- No notification for 5 minutes → Light Sleep
- No notification for 30 minutes → Deep Sleep
- Wake events: IMU tap, WebSocket data, timer (check every 60s)

### 11.3 Battery Life Estimate (280mAh)

| Usage Profile | Estimated Life |
|--------------|---------------|
| High activity (screen on 50% of time) | ~4.5 hours |
| Normal (screen on 20% of time) | ~10 hours |
| Standby (deep sleep, wake for notifications) | ~48 hours |

---

## 12. Security

| Mechanism | Implementation |
|-----------|---------------|
| WiFi credentials | AES-256 encrypted in NVS |
| Device auth token | JWT, stored in NVS, TLS transport |
| OTA binary | RSA-2048 signed, SHA256 verified |
| TLS for all HTTP | Espressif mbedTLS, CA bundle pinned to LOT Systems cert |
| Device UUID | Burned to ESP32 eFuse (immutable) |
| Serial number | eFuse, programmed at factory flash |

---

## 13. Build System

```bash
# Prerequisites
esp-idf >= 5.1
python >= 3.10

# Clone firmware repo
git clone https://github.com/LOT-Systems/cosmo-cia-firmware
cd cosmo-cia-firmware

# Configure
idf.py menuconfig
# → Component config → COSMO CIA → Set device credentials

# Build
idf.py build

# Flash (USB-C)
idf.py -p /dev/ttyUSB0 flash monitor

# OTA build (for server delivery)
idf.py build
# Output: build/cosmo_cia.bin (signed)
```

---

## 14. Firmware File Structure

```
cosmo-cia-firmware/
├── main/
│   ├── main.c                  ← Entry point, task creation
│   ├── wifi_manager.c/h        ← WiFi state machine
│   ├── websocket_client.c/h    ← WebSocket + notification rx
│   ├── notification_engine.c/h ← Queue + display routing
│   ├── display_driver.c/h      ← ST7735 SPI driver + layouts
│   ├── camera_driver.c/h       ← OV2640 DVP driver
│   ├── sensor_bme688.c/h       ← BME688 + BSEC2 wrapper
│   ├── sensor_imu.c/h          ← ICM-42688 driver
│   ├── button_handler.c/h      ← Copy button + debounce
│   ├── haptic_controller.c/h   ← DRV2605L I2C driver
│   ├── lot_api_client.c/h      ← HTTPS LOT API calls
│   ├── session_manager.c/h     ← Session compression + upload
│   ├── ota_manager.c/h         ← OTA check + download
│   ├── power_manager.c/h       ← Sleep state machine
│   ├── nvs_store.c/h           ← Persistent config store
│   └── CMakeLists.txt
├── components/
│   ├── bsec2/                  ← Bosch BSEC2 precompiled lib
│   ├── lvgl/                   ← Light-weight graphics (optional)
│   └── esp_tls_custom/         ← Custom CA bundle
├── partitions.csv              ← Flash partition table
├── sdkconfig.defaults          ← Default menuconfig
├── CMakeLists.txt
└── README.md
```

---

## 15. Firmware Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Alpha | WiFi + WebSocket + display |
| 0.2.0 | Alpha | BME688 + BSEC2 + sensor display |
| 0.3.0 | Alpha | OV2640 camera capture |
| 0.4.0 | Alpha | Copy button + LOT API POST |
| 0.5.0 | Alpha | Session compression + flash store |
| 1.0.0 | Beta | OTA + deep sleep + BLE provisioning |
| 1.0.x | Production | Bug fixes from pilot run |

---

*Firmware specification v1.0 — subject to revision based on hardware validation results.*
