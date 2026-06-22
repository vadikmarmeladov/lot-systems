<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# FW-001 — FIRMWARE ARCHITECTURE
## LOT Computer Hardware Device · ESP32-S3

---

## Overview

The LOT Computer firmware runs on the ESP32-S3-MINI-1U-N8 SoC.
It is a FreeRTOS application built with ESP-IDF v5.2+.

Primary responsibilities:
- Maintain a persistent WebSocket connection to lot-systems.com
- Display incoming notifications on the OLED
- Fire a REST API call when the Copy button is pressed
- Read BME688 sensor data and include it in heartbeat payloads
- Sleep deeply between events to maximize battery life

## Task Map

```
Task Name        Core  Priority  Stack   Purpose
────────────────────────────────────────────────────────────
wifi_task        0     5         4096    WiFi connect/reconnect
ws_task          0     4         8192    WebSocket client loop
display_task     1     3         4096    OLED render queue
sensor_task      1     2         4096    BME688 read + BSEC
button_task      1     6         2048    Button ISR + debounce
ota_task         0     1         8192    OTA check (on boot)
power_task       1     7         2048    Sleep gate + watchdog
```

## Data Flow

```
WebSocket RX → notification_queue → display_task → OLED
                                  → storage (last_notif)

Button ISR → button_queue → rest_client → POST /api/hardware/log-event
                          → display: "✓ Logged"

sensor_task (60 min) → heartbeat_payload → ws_task → WS send
```

## Memory Layout (8MB Flash)

```
Partition    Offset      Size    Content
────────────────────────────────────────────────────
nvs          0x9000      24KB    WiFi creds, device token
phy_init     0xF000      4KB     RF calibration
otadata      0x10000     8KB     OTA boot selection
app0         0x20000     3.5MB   Active firmware
app1         0x3A0000    3.5MB   OTA staging partition
```

## Build

```bash
# Prerequisites
idf.py --version   # must be >= 5.2.0

# Clone and build
git clone https://github.com/lot-systems/lot-hw-firmware
cd lot-hw-firmware
idf.py set-target esp32s3
idf.py build

# Flash (USB-C cable to device)
idf.py -p /dev/ttyUSB0 flash monitor
```

See FW-002-BUILD-GUIDE.md for full environment setup.
