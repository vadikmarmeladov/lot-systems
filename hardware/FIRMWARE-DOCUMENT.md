# COSMO® CIA — Firmware Document
**Document:** COSMO-FW-001 · Rev 1.0
**Date:** 2026-05-25
**Platform:** ESP32-S3 · ESP-IDF v5.3+

---

## 1. Overview

The COSMO® CIA firmware runs on the ESP32-S3-WROOM-1 module. It connects to Wi-Fi, communicates with the LOT Systems API over HTTPS, drives the OLED display, reads the BME688 sensor, handles the Copy button, manages Qi charging, and delivers haptic feedback.

---

## 2. Toolchain & Build Environment

### 2.1 Required Tools
```bash
# ESP-IDF v5.3
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf && git checkout v5.3 && ./install.sh esp32s3

# PlatformIO (alternative IDE)
pip install platformio
```

### 2.2 Project Structure
```
cosmo-cia-firmware/
├── CMakeLists.txt
├── sdkconfig.defaults
├── partitions.csv
├── main/
│   ├── CMakeLists.txt
│   ├── main.c                  # App entry point
│   ├── config.h                # Compile-time config
│   ├── lot_api.c / .h          # LOT API connector
│   ├── oled.c / .h             # SSD1306 driver
│   ├── camera.c / .h           # OV2640 driver
│   ├── bme688.c / .h           # BME688 + BSEC2 driver
│   ├── haptic.c / .h           # DRV2605L driver
│   ├── battery.c / .h          # MAX17048 fuel gauge
│   ├── wifi_provision.c / .h   # BLE provisioning
│   ├── ota.c / .h              # OTA firmware update
│   └── ui.c / .h               # Notification UI renderer
├── components/
│   ├── bsec2/                  # Bosch BSEC2 precompiled lib
│   └── u8g2/                   # OLED graphics library
└── test/
    └── test_lot_api.c
```

### 2.3 Build & Flash
```bash
# Set target
idf.py set-target esp32s3

# Configure (Wi-Fi SSID/password entered via BLE provisioning at runtime)
idf.py menuconfig

# Build
idf.py build

# Flash via USB-C
idf.py -p /dev/ttyUSB0 flash monitor

# OTA update (production)
idf.py build
# → upload firmware/cosmo-cia-v1.0.bin to LOT API OTA endpoint
```

---

## 3. Firmware Architecture

### 3.1 Task Map

```
FreeRTOS Tasks (ESP-IDF)
────────────────────────────────────────────────────────────────────
Task Name          Core  Priority  Stack   Description
─────────────────────────────────────────────────────────────────────
app_main           0     5         8192    Boot, init, spawn tasks
wifi_task          0     4         4096    Wi-Fi connect + reconnect
lot_poll_task      0     3         6144    Poll LOT API for notifications
sensor_task        1     3         4096    BME688 read every 60s
ui_task            1     4         6144    OLED rendering
button_task        1     5         2048    Copy button ISR + debounce
haptic_task        1     2         2048    DRV2605L effects queue
battery_task       0     2         2048    MAX17048 SOC check every 5m
ota_task           0     1         8192    OTA update check (daily)
camera_task        1     2         8192    On-demand capture
```

### 3.2 State Machine

```
          ┌──────────────┐
          │   BOOT       │ Power on / wake from deep sleep
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐     No Wi-Fi creds
          │  PROVISION   │──────────────────► BLE provisioning mode
          └──────┬───────┘                    (LOT app scans + sends SSID/PW)
                 │ Creds stored in NVS
                 ▼
          ┌──────────────┐     Timeout (3 retries)
          │  CONNECTING  │──────────────────► SLEEP 60s → retry
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │   RUNNING    │◄─────────────────────────────────┐
          └──────┬───────┘                                  │
                 │                                          │
         ┌───────┼───────────────────────────────┐          │
         ▼       ▼                               ▼          │
    [Poll API] [Button ISR]               [Sensor read]    │
    every 60s  → copy_signal()            every 60s        │
         │       │                               │          │
         │       └───────────────────────────────┘          │
         ▼                                                   │
    [Notifications?]                                        │
         │ yes                                              │
         ▼                                                  │
    [Render OLED] → wait for dismiss → [Mark read] ────────┘
         │ no
         ▼
    [Deep sleep 55s] ──────────────────────────────────────►
```

---

## 4. LOT API Communication

### 4.1 Base URL
```c
#define LOT_API_BASE    "https://lot-systems.com/api/device"
#define LOT_API_VERSION "v1"
```

### 4.2 Authentication
Each device has a unique `device_token` (JWT, 256-bit secret) provisioned during manufacturing. Stored in ESP32-S3 NVS (Non-Volatile Storage) with flash encryption enabled.

```c
// Request headers
"Authorization: Bearer <device_token>"
"X-Device-ID: <device_uuid>"
"Content-Type: application/json"
"User-Agent: COSMO-CIA/1.0 (ESP32-S3)"
```

### 4.3 Endpoints Used

| Method | Path | Frequency | Description |
|---|---|---|---|
| GET | `/api/device/notifications` | Every 60s | Poll pending notifications |
| POST | `/api/device/copy-signal` | On button press | Log Copy event |
| POST | `/api/device/sensor-data` | Every 5 min | Upload BME688 readings |
| POST | `/api/device/register` | First boot only | Register device + get token |
| GET | `/api/device/health` | On boot | Connectivity check |
| GET | `/api/device/ota/latest` | Daily | Check for firmware update |
| POST | `/api/device/camera-upload` | On demand | Upload JPEG image |

### 4.4 Notification Poll Response
```json
{
  "notifications": [
    {
      "id": "ntf_abc123",
      "message": "Coffee time! ☕",
      "type": "reminder",
      "priority": "normal",
      "created_at": "2026-05-25T14:30:00Z",
      "expires_at": "2026-05-25T22:00:00Z"
    }
  ],
  "unread_count": 1
}
```

### 4.5 Copy Signal POST Body
```json
{
  "event": "device_copy",
  "device_id": "cosmo-cia-XXXX",
  "timestamp": "2026-05-25T14:30:15Z",
  "sensor_snapshot": {
    "temperature_c": 22.4,
    "humidity_pct": 55.1,
    "pressure_hpa": 1013.2,
    "iaq_score": 85,
    "battery_pct": 76
  }
}
```

---

## 5. OLED Display

### 5.1 Font & Layout
```
┌──────────────────────────────────────────┐
│  LOT  ·  COSMO® CIA          [bat: 76%] │  ← status bar (8px font)
├──────────────────────────────────────────┤
│                                          │
│         Coffee time! ☕                  │  ← notification (16px bold)
│                                          │
│  ─────────────────────────────────────  │
│  22.4°C · 55% RH · IAQ 85              │  ← sensor footer (6px font)
│  14:30  Fri 25 May 2026                 │  ← clock (8px font)
└──────────────────────────────────────────┘
```

### 5.2 Screen States

| State | Content |
|---|---|
| Idle | Clock + date + sensor strip |
| Notification | Full-screen message, bold |
| Provisioning | "COSMO® CIA — Scan in LOT App" + BLE icon |
| Charging | Battery animation + percent |
| Offline | "● No connection" + last sync time |
| Low battery | "⚡ Low battery — please charge" |

---

## 6. BME688 + BSEC2 Integration

### 6.1 BSEC2 Library
Bosch provides a pre-compiled binary library (BSEC2) for gas pattern recognition. It runs an on-chip neural network to produce the IAQ (Indoor Air Quality) index.

```c
#include "bsec_interface.h"

// Initialize
bsec_init();
bsec_update_subscription(requested_virtual_sensors, n_sensors, required_sensor_settings, &n_required_sensor_settings);

// In sensor_task loop
bsec_sensor_control(time_stamp, &sensor_settings);
// Read BME688 raw values per sensor_settings
bme68x_forced_mode_run();
// Feed raw values back
bsec_do_steps(inputs, n_inputs, outputs, &n_outputs);
// outputs[i].sensor_id == BSEC_OUTPUT_IAQ → IAQ value
```

### 6.2 AI Pattern Recognition
- BME AI Studio (Windows/Mac desktop app, free from Bosch Sensortec)
- Train custom gas patterns (e.g., coffee, smoke, outdoor air)
- Export as BSEC2 `.config` binary
- Flash config to device via OTA or USB

---

## 7. OTA Firmware Updates

### 7.1 OTA Partition Layout
```
partitions.csv:
# Name,   Type, SubType, Offset,   Size
nvs,      data, nvs,     0x9000,   24K
phy_init, data, phy,     0xF000,   4K
factory,  app,  factory, 0x10000,  1M
ota_0,    app,  ota_0,   0x110000, 1M
ota_1,    app,  ota_1,   0x210000, 1M
```

### 7.2 Update Flow
1. Daily: device checks `GET /api/device/ota/latest`
2. If `version > current_version`: download binary from `firmware_url`
3. Write to inactive OTA partition (ota_0 or ota_1)
4. Verify SHA256 checksum
5. `esp_ota_set_boot_partition()` → restart
6. New firmware runs → reports version to LOT API

---

## 8. Power Management

### 8.1 Sleep Strategy

| Mode | Current draw | Wake trigger |
|---|---|---|
| Active (Wi-Fi TX) | ~200 mA | N/A |
| Active (idle, Wi-Fi on) | ~80 mA | N/A |
| Modem sleep | ~15 mA | Wi-Fi DTIM beacon |
| Light sleep | ~0.9 mA | Timer, GPIO |
| Deep sleep | ~15 µA | Timer (55s), button GPIO |

**Default cycle:** 5s awake (poll + display) → 55s deep sleep → repeat.

### 8.2 Battery Life Estimates (200 mAh)
| Usage pattern | Estimate |
|---|---|
| Continuous active Wi-Fi | ~1 hour |
| Default poll cycle (5s/55s) | ~4 hours |
| Notifications only (wake on push) | ~12 hours |
| Deep sleep only | ~555 hours (~23 days) |

---

## 9. Security

| Feature | Implementation |
|---|---|
| Transport | HTTPS/TLS 1.3, ISRG Root X1 CA |
| Device identity | Unique JWT device token per unit |
| Flash encryption | AES-256, enabled at factory provisioning |
| Secure boot | ESP32-S3 secure boot v2 |
| NVS encryption | AES-256 NVS key stored in eFuse |
| OTA integrity | SHA256 + RSA-2048 signature check |
| Provisioning | BLE pairing with LOT app, one-time setup |

---

## 10. Firmware Versioning

| Version | Date | Notes |
|---|---|---|
| 0.1.0 | TBD | Prototype bring-up, basic Wi-Fi + OLED |
| 0.5.0 | TBD | All peripherals working, LOT API v1 |
| 1.0.0 | TBD | Production firmware, full OTA, secure boot |
| 1.x.x | TBD | Post-launch maintenance |

---

*Document COSMO-FW-001 · lot-systems.com · Rev 1.0 · 2026-05-25*
