# COSMO® CIA Device — Firmware Specification v1.0

**Document:** Firmware Specification  
**Device:** COSMO® CIA v1  
**Author:** LOT Systems / COSMO® CIA  
**Date:** 2026-06-16  
**Revision:** 1.0  

---

## 1. Overview

Firmware for the CIA Device runs on the **ESP32-S3** SoC using **Espressif ESP-IDF v5.2** with FreeRTOS. The firmware handles all hardware abstraction, wireless communication, display rendering, sensor collection, and LOT API integration.

**Repository structure (separate firmware repo recommended):**
```
cia-firmware/
├── main/
│   ├── main.c                  — App entry point
│   ├── wifi_manager.c/.h       — WiFi connection + reconnect
│   ├── ws_client.c/.h          — WebSocket client (WSS)
│   ├── notification.c/.h       — Notification render logic
│   ├── display.c/.h            — ST7789V SPI display driver
│   ├── sensor_bme680.c/.h      — BME680 I2C driver
│   ├── sensor_lsm6dsox.c/.h    — LSM6DSOX SPI/I2C driver
│   ├── camera_ov2640.c/.h      — OV2640 DVP driver
│   ├── button.c/.h             — Copy button ISR + debounce
│   ├── api_client.c/.h         — LOT REST API client
│   ├── session.c/.h            — Session compress + upload
│   ├── power_mgr.c/.h          — Sleep states + wake sources
│   ├── ota.c/.h                — OTA update manager
│   └── nvs_store.c/.h          — NVS offline event buffering
├── components/
│   ├── esp_websocket_client/   — WebSocket component
│   └── esp_zlib/               — zlib compression
├── sdkconfig                   — ESP-IDF build config
├── CMakeLists.txt
└── partitions.csv              — Flash partition table
```

---

## 2. Flash Partition Table

```
# partitions.csv
# Name,     Type, SubType, Offset,   Size,   Flags
nvs,         data, nvs,     0x9000,   0x6000
otadata,     data, ota,     0xf000,   0x2000
phy_init,    data, phy,     0x11000,  0x1000
ota_0,       app,  ota_0,   0x20000,  0x1F0000
ota_1,       app,  ota_1,   0x210000, 0x1F0000
session_log, data, fat,     0x400000, 0x200000  ← offline session storage
```

---

## 3. Boot Sequence

```
Power on / Wakeup
     │
     ▼
esp_idf_init() — clocks, flash, NVS
     │
     ▼
power_mgr_init() — read wake reason (button / timer / Qi detect)
     │
     ▼
display_init() — ST7789V SPI init, show boot logo (100ms)
     │
     ▼
sensor_init() — BME680 + LSM6DSOX I2C init + self-test
     │
     ▼
button_init() — GPIO ISR attach for Copy button
     │
     ▼
wifi_manager_start() — connect to saved AP, or provision mode
     │
     ▼ (WiFi connected)
api_client_register() — authenticate device token
     │
     ▼
ws_client_connect() — open WSS to lot-systems.com
     │
     ▼
All tasks started → FreeRTOS scheduler
     │
     ▼
Display: "Ready — LOT Connected"
```

---

## 4. Task Specifications

### 4.1 wifi_manager_task (Priority 5, 4KB stack)

- Maintains WiFi connection to configured AP
- On disconnect: exponential backoff reconnect (2s, 4s, 8s, 16s, 30s, 60s)
- Provisions via BLE if no AP configured (ESP BLE WiFi Provisioning)
- Posts `WIFI_CONNECTED` / `WIFI_DISCONNECTED` events to event group

### 4.2 ws_client_task (Priority 6, 6KB stack)

- Maintains persistent WSS connection to `wss://lot-systems.com/ws/device`
- Sends ping every 30s
- On message received: parses JSON, posts to `notification_queue`
- On Copy button event (from queue): sends HTTP POST to Log API
- Handles WSS reconnect on network failure

```c
typedef struct {
    char message[128];
    char notification_id[37];
    uint32_t display_duration_ms;
    uint8_t priority;  // 0=low, 1=normal, 2=high
} notification_t;
```

### 4.3 notification_task (Priority 4, 4KB stack)

- Receives `notification_t` from ws_client
- Calls `display_show_notification()`
- Starts display timer (auto-dim after `display_duration_ms`)
- On Copy button: posts `copy_event_t` to ws_client queue with current notif ID + sensor snapshot

### 4.4 display_task (Priority 3, 8KB stack)

- Manages ST7789V SPI display
- Frame buffer: 240×240×2 bytes = 115KB (allocated in PSRAM)
- Render functions:
  - `display_show_notification(msg, time_str, batt_pct)`
  - `display_show_idle()` — minimal clock + battery
  - `display_show_connecting()` — WiFi animation
  - `display_sleep()` — display off

### 4.5 sensor_task (Priority 3, 4KB stack)

- Polls BME680 every 1000ms (BSEC library for IAQ)
- Polls LSM6DSOX every 100ms (accelerometer + gyro)
- Posts aggregated sensor_data_t to sensor_queue (used by session_task + copy event)

### 4.6 button_task (Priority 7, 2KB stack)

- GPIO ISR triggers on falling edge (button press)
- Debounce: 50ms timer (esp_timer)
- On confirmed press:
  1. Trigger LED pulse (white 200ms)
  2. Post copy_event to notification_task

### 4.7 session_task (Priority 2, 6KB stack)

- Accumulates sensor_data_t readings
- On session end (30min idle or manual trigger):
  1. Aggregate min/max/avg
  2. Serialize to compact JSON
  3. Compress with zlib deflate level 6
  4. POST to `/api/v1/devices/{id}/session`
  5. On failure: store in FAT partition for later replay

### 4.8 ota_task (Priority 1, 8KB stack)

- Checks firmware version once per day at 03:00 local
- Compares SHA-256 of latest vs. running
- If newer: download to inactive OTA partition
- Verify signature (RSA-2048 public key embedded in firmware)
- On success: set OTA boot pointer, schedule reboot at next idle

### 4.9 power_mgr_task (Priority 8, 2KB stack)

- Monitors battery SoC via BQ25120A I2C
- Detects Qi charging (VBUS present flag)
- Controls sleep states:
  - Active: screen on, WiFi full, all sensors on
  - Idle (60s no activity): screen off, WiFi modem sleep, sensors low-rate
  - Deep sleep (10min): WiFi off, only RTC + button GPIO wakeup

---

## 5. WiFi Provisioning

First-time setup (or factory reset):
1. Device broadcasts BLE advertisement: `CIA-XXXXXX`
2. User opens LOT app (or web provisioning page at `lot-systems.com/device/setup`)
3. Sends WiFi credentials + device registration token over BLE
4. Device connects, registers with server, receives `device_token`
5. Token stored in NVS (AES-256 encrypted)

---

## 6. Security

| Layer | Method |
|-------|--------|
| Transport | TLS 1.3 (mbedTLS) with certificate pinning |
| Device auth | JWT Bearer token (RS256, 30-day expiry, auto-refresh) |
| OTA signature | RSA-2048 signature verification before boot |
| NVS secrets | AES-256 encrypted NVS partition |
| BLE provisioning | ECDH key exchange, encrypted channel |

---

## 7. Build + Flash Instructions

```bash
# Install ESP-IDF v5.2
. ~/esp/esp-idf/export.sh

# Configure target
idf.py set-target esp32s3

# Build
idf.py build

# Flash (USB-C on programming jig)
idf.py -p /dev/ttyUSB0 flash

# Monitor
idf.py -p /dev/ttyUSB0 monitor

# OTA upload (for field update)
idf.py build
# Then upload build/cia_firmware.bin to OTA server
```

---

## 8. Pin Assignments (ESP32-S3-MINI-1)

| Function | GPIO | Notes |
|----------|------|-------|
| Display SPI MOSI | GPIO11 | SPI2 |
| Display SPI CLK | GPIO12 | SPI2 |
| Display CS | GPIO10 | Active low |
| Display DC | GPIO13 | Data/Command |
| Display RST | GPIO14 | Active low reset |
| Display BL | GPIO15 | PWM backlight |
| Camera D0–D7 | GPIO1–8 | DVP parallel |
| Camera PCLK | GPIO9 | DVP |
| Camera VSYNC | GPIO16 | DVP |
| Camera HREF | GPIO17 | DVP |
| Camera XCLK | GPIO18 | 20 MHz output |
| Camera SDA | GPIO19 | SCCB (I2C) |
| Camera SCL | GPIO20 | SCCB (I2C) |
| I2C SDA (sensors) | GPIO21 | BME680 + LSM6DSOX + BQ25120A |
| I2C SCL (sensors) | GPIO22 | I2C1 bus |
| Copy Button | GPIO0 | Pull-up, active low |
| LED R | GPIO36 | PWM |
| LED G | GPIO37 | PWM |
| LED B | GPIO38 | PWM |
| Qi VBUS detect | GPIO35 | ADC input |
| Battery voltage | GPIO34 | ADC (÷2 divider) |

---

## 9. Firmware Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.1.0 | — | Skeleton bring-up, display hello world |
| 0.5.0 | — | WiFi + WebSocket + notification display |
| 0.9.0 | — | Full feature set, prototype validation |
| 1.0.0 | Production target | QA signed, OTA live |

---

*Document: FIRMWARE-SPEC-v1.md*  
*Generated: 2026-06-16*
