# COSMO Computer — Firmware Architecture
**Document:** 04-FIRMWARE  
**Revision:** A  
**Platform:** ESP32-S3 / ESP-IDF v5.x  
**Date:** 2026-05-27  

---

## 1. Overview

The COSMO Computer firmware runs on the **ESP32-S3** using **ESP-IDF v5.2** (Espressif IoT Development Framework). It is written in C/C++ and uses **FreeRTOS** for multi-task scheduling.

The firmware is the real-time operating layer between the hardware and the LOT cloud platform. Its core purpose: wake, connect, fetch notifications, display them, and log COPY button events back to lot-systems.com.

---

## 2. Repository Structure

```
firmware/
├── CMakeLists.txt                  # Top-level build
├── sdkconfig.defaults              # ESP-IDF config defaults
├── partitions.csv                  # Flash partition table
├── main/
│   ├── CMakeLists.txt
│   ├── main.c                      # App entry point
│   ├── config.h                    # Build-time constants (Wi-Fi, API keys)
│   ├── tasks/
│   │   ├── task_wifi.c/h           # Wi-Fi management task
│   │   ├── task_lot_api.c/h        # LOT API communication task
│   │   ├── task_display.c/h        # Display rendering task
│   │   ├── task_sensors.c/h        # BME688 + LSM6DSO32 + VEML7700 task
│   │   ├── task_camera.c/h         # OV2640 camera task
│   │   ├── task_button.c/h         # COPY button ISR + task
│   │   ├── task_led.c/h            # WS2812B LED task
│   │   └── task_ota.c/h            # OTA firmware update task
│   ├── drivers/
│   │   ├── st7789v.c/h             # ST7789V display driver (SPI)
│   │   ├── ov2640.c/h              # OV2640 camera driver (DVP)
│   │   ├── bme688.c/h              # BME688 driver (I2C + BSEC2)
│   │   ├── lsm6dso32.c/h          # LSM6DSO32 IMU driver (I2C)
│   │   ├── veml7700.c/h            # VEML7700 light sensor (I2C)
│   │   └── ws2812b.c/h             # WS2812B LED driver (RMT)
│   ├── ui/
│   │   ├── ui_notification.c/h     # Notification screen renderer
│   │   ├── ui_boot.c/h             # Boot splash screen
│   │   ├── ui_status_bar.c/h       # Top status bar (time, battery, temp)
│   │   └── fonts/
│   │       ├── font_18pt.c         # 18pt font for notification text
│   │       ├── font_12pt.c         # 12pt font for labels
│   │       └── font_10pt.c         # 10pt font for timestamps
│   ├── net/
│   │   ├── https_client.c/h        # HTTPS request wrapper (esp-tls)
│   │   ├── websocket_client.c/h    # WebSocket client (esp-websocket)
│   │   └── lot_api.c/h             # LOT API calls
│   ├── storage/
│   │   ├── nvs_config.c/h          # NVMe storage for device config
│   │   └── session_store.c/h       # Session compression + storage
│   └── utils/
│       ├── battery_monitor.c/h     # ADC battery voltage monitor
│       ├── time_sync.c/h           # SNTP time synchronisation
│       └── compression.c/h         # LZ4 session data compression
└── components/
    ├── bsec2/                       # Bosch BSEC2 AI library (precompiled)
    │   ├── include/bsec_interface.h
    │   └── libalgobsec.a            # Precompiled BSEC2 for Xtensa LX7
    └── lvgl/                        # LVGL graphics library (optional v8.x)
```

---

## 3. Task Architecture

All tasks run under FreeRTOS. Priority levels (higher = more urgent):

```
Priority 10 (highest)
    task_button        — Hardware ISR handler, copies button events to queue

Priority 8
    task_wifi          — Wi-Fi association, reconnection, event posting
    task_ota           — OTA update (runs once, then exits)

Priority 6
    task_lot_api       — HTTP/WebSocket communication with LOT API
    task_sensors       — Sensor polling (BME688 every 15min, IMU every 1s)

Priority 4
    task_display       — Screen rendering (driven by event queue)
    task_camera        — Camera capture (on-demand)
    task_led           — LED animation sequences

Priority 2 (lowest)
    task_session_log   — Compresses and saves session data to NVS
```

---

## 4. Boot Sequence

```
main.c
│
├── nvs_flash_init()                 // Initialize NVM storage
├── nvs_config_load()                // Load device_id, auth_token, wifi_ssid/pass
│
├── st7789v_init()                   // Init display, show COSMO® splash
│
├── bme688_init() + bsec2_init()     // Init weather sensor + AI library
├── lsm6dso32_init()                 // Init IMU
├── veml7700_init()                  // Init ambient light sensor
│
├── task_wifi_start()                // Start Wi-Fi task → connect to AP
│   └── [EVENT: WIFI_CONNECTED]
│       └── task_lot_api_start()     // Start API task → authenticate
│           └── [EVENT: AUTH_OK]
│               ├── time_sync_start()       // SNTP sync
│               ├── task_display_start()    // Start rendering
│               ├── task_sensors_start()    // Start sensor polling
│               ├── task_led_start()        // Start LED
│               ├── task_button_start()     // Start button ISR
│               └── task_ota_check()        // Check for OTA update
│
└── Main loop (idle — FreeRTOS scheduler handles all)
```

---

## 5. Wi-Fi Provisioning

On first boot (no stored Wi-Fi credentials):

```
1. Device enters BLE provisioning mode
2. LED → Purple (pulsing)
3. Display shows: "Pair with LOT Companion app"
                  QR code linking to companion app download
4. User opens LOT Companion app on phone
5. App discovers device via BLE (device name: "COSMO-XXXXXX")
6. App sends Wi-Fi SSID + password via BLE characteristic
7. Device saves credentials to NVS
8. Device restarts and connects to Wi-Fi
```

For subsequent boots: credentials are loaded from NVS automatically.

**Emergency re-provision:** Hold COPY button for 10 seconds → factory reset, re-enters provisioning mode.

---

## 6. LOT API Communication

### 6.1 Authentication

```c
// POST /api/device/auth
// Request body:
{
  "device_id": "CC-R1-XXXXXX",    // Unique device serial (burned at factory)
  "device_secret": "...",          // Factory-provisioned secret in NVS
  "firmware_version": "1.0.0"
}

// Response:
{
  "access_token": "jwt_...",
  "refresh_token": "jwt_...",
  "user_id": "...",
  "expires_in": 3600
}
```

Token is stored in NVS. Refreshed automatically before expiry.

### 6.2 Notification Polling

```c
// GET /api/device/notifications
// Header: Authorization: Bearer <access_token>

// Response:
{
  "notifications": [
    {
      "id": "notif_001",
      "text": "Coffee time!",
      "source": "LOT System",
      "timestamp": "2026-05-27T09:42:00Z",
      "priority": "normal",         // "normal" | "urgent"
      "ttl": 3600                   // seconds to display
    }
  ],
  "unread_count": 1
}
```

Polling interval: **60 seconds** (configurable via device config endpoint).

### 6.3 COPY Button → Log Event

```c
// POST /api/device/log
// Header: Authorization: Bearer <access_token>
// Body:
{
  "device_id": "CC-R1-XXXXXX",
  "action": "COPY",
  "notification_id": "notif_001",
  "notification_text": "Coffee time!",
  "timestamp": "2026-05-27T09:43:15Z",
  "sensor_snapshot": {
    "temperature": 22.4,            // °C
    "humidity": 48.2,               // %
    "pressure": 1013.25,            // hPa
    "iaq": 87,                      // 0–500 IAQ index
    "co2_equivalent": 412.5,        // ppm
    "ambient_lux": 324              // lux
  }
}
```

This event appears instantly in the user's **Log tab** on lot-systems.com.

### 6.4 Sensor Data Upload

```c
// POST /api/device/sensor-data
// Runs every 15 minutes
// Body: same sensor_snapshot as above, without notification fields
```

### 6.5 OTA Check

```c
// GET /api/device/firmware/latest
// Response:
{
  "version": "1.1.0",
  "url": "https://lot-systems.com/firmware/cosmo-cc-r1-1.1.0.bin",
  "sha256": "abc123...",
  "size": 1048576,
  "changelog": "..."
}
```

If `version` > current firmware version → download and apply OTA update via `esp_https_ota`.

---

## 7. Display Rendering

The display task uses a **double-buffer** approach with DMA SPI transfers for smooth updates.

```c
// ui_notification.c — main screen layout

void ui_render_notification(notification_t *notif, sensor_data_t *sensors) {
    // Status bar (top 20px)
    render_status_bar(
        rtc_get_time_str(),      // "09:42"
        battery_get_percent(),   // 85
        sensors->temperature     // 22.4°C
    );

    // Notification text (center, 18pt bold, word-wrapped, max 3 lines)
    render_text_center(notif->text, FONT_18PT_BOLD, COLOR_WHITE, y=80);

    // Source label (12pt, grey)
    render_text_center(notif->source, FONT_12PT, COLOR_GREY, y=140);

    // Timestamp (10pt, dark grey)
    render_text_center(format_relative_time(notif->timestamp), FONT_10PT, COLOR_DARKGREY, y=160);

    // COPY hint (bottom 20px, subtle)
    render_text_center("[ COPY ]", FONT_10PT, COLOR_DIM, y=218);
}
```

**Color palette:**
```
Background:   #0A0A0A  (near-black)
Primary text: #F5F5F5  (near-white)
Secondary:    #888888  (grey)
Accent:       #C8A96E  (warm gold — LOT brand color)
Alert:        #FF4444  (urgent notifications)
```

---

## 8. Session Compression

Each session (boot → shutdown) accumulates:
- Notification history (text + timestamps)
- Sensor readings (sampled every 15 min)
- Button press log
- Wi-Fi RSSI log

This data is compressed using **LZ4** (fast, embedded-friendly) and stored in a dedicated NVS partition. On the next LOT API sync, compressed session data is uploaded as `POST /api/device/session-upload`.

See: [11-SESSION-COMPRESSION.md](./11-SESSION-COMPRESSION.md) for full spec.

---

## 9. Build & Flash Guide

### 9.1 Prerequisites

```bash
# Install ESP-IDF v5.2
git clone -b v5.2 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf && ./install.sh esp32s3
. ./export.sh

# Clone firmware repo
git clone https://github.com/lot-systems/lot-computer-firmware.git
cd lot-computer-firmware
```

### 9.2 Configure

```bash
# Set your Wi-Fi and LOT API credentials (for development)
idf.py menuconfig
# → Component config → COSMO Computer → Wi-Fi SSID/Password
# → Component config → COSMO Computer → LOT API Host

# Or use sdkconfig.defaults (production builds use NVS provisioning)
```

### 9.3 Build

```bash
idf.py build
# Output: build/cosmo-firmware.bin (partition table + bootloader + app)
```

### 9.4 Flash via USB-C

```bash
# Connect USB-C to COSMO Computer
# Device must be in flash mode: hold COPY button while plugging in USB-C

idf.py -p /dev/ttyUSB0 flash monitor
# Flash speed: 921600 baud
# Monitor at 115200 baud after flash
```

### 9.5 OTA Flash (Production)

```bash
# Build firmware binary
idf.py build

# Sign firmware (SHA256 hash embedded)
sha256sum build/cosmo-firmware.bin > build/cosmo-firmware.sha256

# Upload to LOT Systems firmware CDN
# (automated via CI/CD pipeline)
```

---

## 10. Factory Provisioning (Per Unit)

Each device must be provisioned at the factory before shipping:

```bash
# 1. Flash base firmware
idf.py -p /dev/ttyUSBx flash

# 2. Write unique device credentials to NVS
python3 scripts/provision_device.py \
  --port /dev/ttyUSBx \
  --device-id "CC-R1-$(date +%Y%m%d)-$(printf '%04d' $UNIT_NUMBER)" \
  --device-secret "$(openssl rand -hex 32)" \
  --firmware-version "1.0.0"

# 3. Run functional test
python3 scripts/factory_test.py --port /dev/ttyUSBx

# 4. Print QR code label with device_id
python3 scripts/print_label.py --device-id $DEVICE_ID
```

Factory test script verifies:
- All I2C sensors respond
- Display initialises
- LED cycles all colors
- COPY button triggers GPIO interrupt
- Battery ADC reads within range (3.0–4.2 V)
- Wi-Fi associates (test AP in factory)

---

## 11. Power Optimisation

The firmware uses ESP32-S3's **light sleep** mode between notification polls:

```c
// Duty cycle:
// - Wake: 2 seconds (connect, poll, render, update sensors)
// - Light sleep: 58 seconds (GPIO wakeup enabled for COPY button)

// Power in light sleep: ~0.8 mA
// Power active (Wi-Fi Tx): ~120 mA peak
// Duty cycle effective current: ~5 mA
// Battery life at 5 mA: 300 mAh / 5 mA = 60 hours
```

COPY button press during sleep: GPIO wakeup from light sleep in < 1 ms.

---

## 12. Firmware Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-01 (planned) | Initial Rev A release |

---

*Document: 04-FIRMWARE.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
