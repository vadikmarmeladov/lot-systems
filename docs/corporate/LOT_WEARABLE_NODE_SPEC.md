<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT WEARABLE NODE — HARDWARE SPECIFICATION & MANUFACTURING ROADMAP

**Document:** LOT_WEARABLE_NODE_SPEC.md  
**Classification:** Confidential — Product Engineering  
**Prepared:** 23 June 2026  
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems  
**Brand:** COSMO® CIA — Compact Intelligence Array  
**Revision:** v1.0.0

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║   LOT SYSTEMS CORPORATION                                                ║
║   WEARABLE NODE — COMPACT INTELLIGENCE ARRAY                             ║
║                                                                          ║
║   4 × 4 cm · 5 mm · STAINLESS STEEL · 100-UNIT RUN                      ║
║                                                                          ║
║   CONNECTED · SENSING · NOTIFYING · LOGGING                              ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 00 — PRODUCT IDENTITY

The **LOT Wearable Node** is a pager-class hardware device that bridges the LOT Memory Engine and the physical world. It is a 40 × 40 mm polished stainless steel square — 5 mm thick — that receives autonomous AI-generated notifications from lot-systems.com, senses its local environment, captures images, and sends confirmed acknowledgments back to the LOT Log tab with a single button press.

This is not a smartwatch. It is not a phone. It is a signal device: a physical object that vibrates gently to say *"Coffee time"* and waits for a tap that says *"Received."*

```
┌──────────────────────┐   ┌──────────────────────────────────────────┐
│  FRONT (ACTIVE FACE) │   │  BACK (POLISHED FACE)                    │
│                      │   │                                          │
│  ┌──────────┐        │   │  Mirror-polished stainless steel 316L    │
│  │  SCREEN  │        │   │  Laser-etched LOT® mark (reverse)        │
│  │ 1.47" AM │        │   │  Qi coil behind the steel sheet          │
│  └──────────┘        │   │  Invisible seam at 2mm from edge         │
│                      │   │                                          │
│  [CAMERA]  [BUTTON]  │   └──────────────────────────────────────────┘
│                      │
│  Brushed SS 316L     │
└──────────────────────┘
```

---

## 01 — PHYSICAL SPECIFICATION

| Attribute          | Value                                      |
|--------------------|--------------------------------------------|
| Outer dimensions   | 40 × 40 × 5 mm                             |
| Body material      | Stainless Steel 316L (2 parts)             |
| Front face         | Brushed satin SS 316L                      |
| Back face          | Mirror-polished SS 316L                    |
| Seam               | Press-fit + gasket at 2 mm from edge       |
| Weight (estimated) | 38–44 g                                    |
| IP rating (target) | IPX4 (splash-resistant)                    |
| Surface finish     | Front: #4 brushed / Back: #8 mirror        |
| Branding           | Laser-etched "LOT" (back, reversed mirror) |
| Color              | Silver (natural SS)                        |

### 2-Part Enclosure Design

```
PART A — FRONT SHELL (brushed SS 316L)
  Depth:    3.0 mm
  Features: Display window cutout (35 × 20 mm)
            Camera aperture (Ø 4 mm, chamfered)
            Button aperture (Ø 6 mm, countersunk)
            USB-C debug port slot (sealed rubber plug)
            4× M1.2 threaded inserts for PCB standoffs

PART B — BACK SHELL (polished SS 316L)
  Depth:    2.0 mm
  Features: Flat inside pocket for Qi coil (Ø 35 mm)
            Snaps into Part A press-fit ledge
            Laser-etched LOT® mark outside
            Vent-free (hermetic except USB plug)
```

### Interior Stack (cross-section, front to back)

```
[ Front SS shell — 3.0 mm ]
  ├─ Display glass + AMOLED panel    0.8 mm
  ├─ Display FPC cable               0.1 mm
  ├─ Main PCB (4-layer, FR4)         1.0 mm
  │    ├─ ESP32-S3 SoC module
  │    ├─ BME688 weather sensor
  │    ├─ Button switch
  │    ├─ BQ25672 charge management
  │    └─ USB-C connector
  ├─ LiPo battery (LP402535)         3.5 mm → RUNS BEHIND PCB BESIDE CAMERA
  └─ Camera module (OV2640 FPC)      3.2 mm → SIDE-MOUNTED
[ Back SS shell — 2.0 mm ]
  └─ Qi receiver coil (adhesive)     0.3 mm
```

> **Design Note:** Camera and battery occupy the same Z-depth as the PCB using FPC (flat flex cable) routing and side-mounting. Total electronics stack: ≤ 4.8 mm. The 0.2 mm margin is the gasket + tolerance. This requires careful mechanical engineering in the first prototype pass. PCBWay CNC will produce the trial enclosure.

---

## 02 — COMPONENT ARCHITECTURE

```
                    ┌─────────────────────────────────────┐
                    │         ESP32-S3-WROOM-1-N16R8       │
                    │  WiFi 802.11n · BLE 5.0 · 240 MHz   │
                    │  16 MB Flash · 8 MB PSRAM            │
                    └────────┬────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────────┐
         │                   │                       │
   ┌─────▼──────┐    ┌───────▼──────┐    ┌──────────▼────────┐
   │  DISPLAY   │    │   CAMERA     │    │  WEATHER SENSOR    │
   │ SH8601     │    │  OV2640      │    │  BME688 (Bosch AI) │
   │ 1.47" OLED │    │  2MP, FPC    │    │  Temp/Humid/Press  │
   │ 172×320    │    │  DVP/MIPI    │    │  Gas/AQI           │
   │ SPI/QSPI   │    │              │    │  I²C               │
   └────────────┘    └──────────────┘    └───────────────────┘
         │
   ┌─────▼──────┐    ┌───────────────┐    ┌──────────────────┐
   │  BUTTON    │    │  POWER SYS    │    │  WIRELESS CHARGE  │
   │  Omron     │    │  BQ25672      │    │  STWLC38 (ST)     │
   │  B3U-1000P │    │  USB-C +      │    │  Qi 5W receiver   │
   │  SMD tact. │    │  Qi input     │    │  + Rx coil        │
   │  GPIO INT  │    │  LiPo 250mAh  │    │  WPC 1.3          │
   └────────────┘    └───────────────┘    └──────────────────┘
         │
   ┌─────▼──────────────────────────────────────────────────┐
   │                  LOT API (HTTPS / WiFi)                │
   │   GET  /api/device/notifications                       │
   │   POST /api/device/log       ← COPY button             │
   │   POST /api/device/sensor    ← BME688 readings         │
   │   POST /api/device/ota       ← firmware update         │
   └────────────────────────────────────────────────────────┘
```

---

## 03 — BILL OF MATERIALS (BOM)

### A — Main Electronics

| # | Component | Part Number | Specification | Qty/Unit | Unit Price | 100-Unit Total | Source |
|---|-----------|-------------|---------------|----------|------------|----------------|--------|
| 1 | SoC Module | ESP32-S3-WROOM-1-N16R8 | WiFi+BLE, 16MB/8MB PSRAM, 240 MHz, 2.4 GHz | 1 | $4.50 | $450 | [Mouser 356-ESP32S3WROOM1N16](https://www.mouser.com) |
| 2 | Display | SH8601 1.47" AMOLED | 172×320, SPI/QSPI, 1.5 mm thin, 3.3V | 1 | $8.00 | $800 | [Waveshare / LCSC](https://www.lcsc.com) |
| 3 | Camera | OV2640 FPC Module | 2MP, 1/4", DVP, 24-pin FPC, 3.3V | 1 | $3.20 | $320 | [Mouser / AliExpress wholesale](https://www.mouser.com) |
| 4 | Weather Sensor | BME688 | Temp/Humidity/Pressure/Gas, I²C, 3×3×0.93 mm, AI-ready | 1 | $6.50 | $650 | [Mouser 828-BME688](https://www.mouser.com) |
| 5 | Wireless Charge IC | STWLC38 | Qi WPC 1.3, 5W, I²C config, QFN-20 2.8×2.8 mm | 1 | $2.80 | $280 | [Mouser 511-STWLC38JR](https://www.mouser.com) |
| 6 | Qi Receiver Coil | WR202020 | Ø 35 mm, 0.3 mm thick, adhesive, 5W | 1 | $1.50 | $150 | [Würth Elektronik 760308102203](https://www.mouser.com) |
| 7 | Charger/PMIC | BQ25672 | USB-C PD + Qi input, LiPo charge/protect, QFN-28 | 1 | $3.80 | $380 | [Mouser 595-BQ25672RQBR](https://www.mouser.com) |
| 8 | Battery | LP402535 | LiPo 3.7V 280mAh, 4×25×35 mm, PTC, JST-PH | 1 | $3.50 | $350 | [Adafruit #4236 / LiPol](https://www.adafruit.com) |
| 9 | Button | Omron B3U-1000P | SMD tactile, 3.5×2.9 mm, 0.8 mm height, 160 gf | 1 | $0.45 | $45 | [Mouser 653-B3U-1000P](https://www.mouser.com) |
| 10 | USB-C Connector | USB4125-GF-A | USB-C 2.0, mid-mount, 0.8 mm height, 16-pin | 1 | $0.60 | $60 | [GCT USB4125 / Digikey](https://www.digikey.com) |
| 11 | LDO 3.3V | XC6220A331MR | 3.3V, 700mA, SOT-25, for sensor rail | 1 | $0.30 | $30 | [LCSC C86534](https://www.lcsc.com) |
| 12 | Passives (R/C/L) | Various 0402 | Decoupling caps, pull-ups, filter inductors | ~40 | $0.05 avg | $200 | PCBWay turnkey |
| 13 | Crystal | ABM8-272-T3 | 40 MHz, 3.2×2.5 mm, 10pF (ESP32-S3 clock) | 1 | $0.40 | $40 | [Mouser 815-ABM8-272-T3](https://www.mouser.com) |
| 14 | ESD Protection | PRTR5V0U2X | USB-C + GPIO, dual-rail, SOT-363 | 2 | $0.35 | $70 | [Mouser 771-PRTR5V0U2X](https://www.mouser.com) |

**Electronics Subtotal (100 units): ~$3,825**

---

### B — Stainless Steel Enclosure (PCBWay CNC)

| # | Item | Material | Finish | Qty | Unit Price | 100-Unit Total | Notes |
|---|------|----------|--------|-----|------------|----------------|-------|
| 15 | Front Shell (Part A) | SS 316L | Brushed #4 satin | 100 | $22.00 | $2,200 | PCBWay CNC Machining |
| 16 | Back Shell (Part B) | SS 316L | Polished #8 mirror | 100 | $18.00 | $1,800 | PCBWay CNC Machining |
| 17 | Press-fit gasket | Silicone, 1mm | N/A | 100 | $0.80 | $80 | IPX4 seal |
| 18 | Camera lens cover | Sapphire glass, Ø 4mm | AR coated | 100 | $2.50 | $250 | Scratch-resistant |
| 19 | USB-C rubber plug | Silicone | Clear | 100 | $0.40 | $40 | Debug port seal |
| 20 | M1.2×2 screw set | SS 316L | Hex head | 400 | $0.08 | $32 | 4 per unit |
| 21 | Laser engraving | LOT® mark (back) | — | 100 | $2.00 | $200 | PCBWay laser |

**Enclosure Subtotal (100 units): ~$4,602**

---

### C — PCB Fabrication & Assembly (PCBWay)

| # | Item | Spec | Qty | Cost |
|---|------|------|-----|------|
| 22 | PCB Fabrication | 4-layer, FR4, 40×35 mm, ENIG, black mask, 1oz Cu | 100 | $380 |
| 23 | SMT Assembly (PCBA) | All 14 component types, turnkey, X-ray QC | 100 | $1,800 |
| 24 | Prototype PCB (first run) | 5 units, 2-day express | 5 | $120 |
| 25 | Stencil | Stainless steel solder paste stencil | 1 | $25 |

**PCB/PCBA Subtotal (100 units): ~$2,325**

---

### D — Wireless Charging Dock (Companion Charger)

| # | Item | Part Number | Spec | Qty/Unit | Unit Price | 100-Unit Total | Source |
|---|------|-------------|------|----------|------------|----------------|--------|
| 26 | Qi Transmitter IC | STWBC-EP | Qi 1.3 TX, up to 5W, QFN-32 | 1 | $2.50 | $250 | [Mouser 511-STWBCEP](https://www.mouser.com) |
| 27 | Tx Coil | WR202030 | Ø 40 mm, 6W, flat, adhesive | 1 | $2.20 | $220 | [Würth Elektronik](https://www.mouser.com) |
| 28 | Charger PCB | Custom, 2-layer, Ø 50 mm | USB-C input, 9V/1A PD | 100 | $1.80 | $180 | PCBWay |
| 29 | Charger enclosure | Aluminum, 55×55×8 mm | Anodized silver | 100 | $8.00 | $800 | PCBWay CNC |
| 30 | USB-C cable (1m) | USB-C to USB-C, 15W | PD, braided | 100 | $2.50 | $250 | Bulk |
| 31 | LED indicator | 0805 green LED | Charge indicator | 1 | $0.10 | $10 | LCSC |

**Charger Subtotal (100 units): ~$1,710**

---

### E — Packaging & Documentation

| # | Item | Spec | Qty | Cost |
|---|------|------|-----|------|
| 32 | Box | 80×80×25 mm white rigid box, LOT-branded | 100 | $420 |
| 33 | Insert foam | Die-cut EVA, device + charger cutouts | 100 | $150 |
| 34 | Quick Start Card | 90×90 mm, thick stock, double-sided print | 100 | $80 |
| 35 | PDF Manual (USB drive) | Includes firmware guide, API guide, user guide | 100 | $220 |

**Packaging Subtotal (100 units): ~$870**

---

### F — TOTAL COST SUMMARY

| Category | 100-Unit Total | Per Unit |
|----------|---------------|----------|
| Electronics (BOM) | $3,825 | $38.25 |
| Stainless Steel Enclosure | $4,602 | $46.02 |
| PCB Fabrication + PCBA | $2,325 | $23.25 |
| Wireless Charger Dock | $1,710 | $17.10 |
| Packaging + Documentation | $870 | $8.70 |
| **TOTAL COGS** | **$13,332** | **$133.32** |
| Engineering / NRE (one-time) | $8,000 | — |
| QA + Programming labor | $1,500 | $15.00 |
| **TOTAL ALL-IN (100 units)** | **$22,832** | **$228.32** |

> **Suggested MSRP:** $349–$399 per unit (includes charger)  
> **Gross margin at $379:** ~40%

---

## 04 — PCBWay ORDER SPECIFICATION

### PCB Fabrication Parameters

```
Service:         PCB Fabrication + PCBA (Turnkey)
URL:             https://www.pcbway.com/orderonline.aspx

PCB Spec:
  Layers:        4
  Material:      FR4-TG150
  Thickness:     1.0 mm (not standard 1.6 mm — critical for 5mm form factor)
  Copper weight: 1 oz outer / 0.5 oz inner
  Min trace:     4/4 mil (0.1 mm)
  Min drill:     0.2 mm
  Surface:       ENIG (gold pads, solder-ready)
  Solder mask:   Black, both sides
  Silkscreen:    White, top only
  Board size:    40 × 35 mm (camera occupies 5 mm offset on one side)
  Quantity:      5 (prototype) → 100 (production)
  Lead time:     Express 2–3 days (proto) / Standard 5–7 days (production)

PCBA Spec:
  Side:          Top + bottom SMT
  Components:    Turnkey (PCBWay sources)
  IPC class:     Class II
  AOI:           Required
  X-Ray:         Required (BGA/QFN packages)
  Functional test: Per custom test fixture (we supply test protocol)
```

### CNC Machining Order (Stainless Steel Enclosure)

```
Service:         CNC Machining
URL:             https://www.pcbway.com/rapid-prototype/manufacture/CNC-Machining-Service.html

Part A (Front Shell):
  Material:      Stainless Steel 316L
  Finish:        Brushed satin #4, bead-blasted inside
  Tolerance:     ±0.05 mm on display window, ±0.1 mm general
  Quantity:      5 (proto) → 100 (production)
  Files:         STEP + DXF provided by our mechanical engineer

Part B (Back Shell):
  Material:      Stainless Steel 316L
  Finish:        Mirror-polished #8 outside, bead-blasted inside
  Tolerance:     ±0.05 mm on mating ledge (press-fit)
  Laser engraving: LOT® mark, 0.1 mm depth, ≤ 10 mm height
  Quantity:      5 (proto) → 100 (production)
```

---

## 05 — FIRMWARE ARCHITECTURE

```
FIRMWARE: LOT-NODE-FW
Platform: ESP-IDF v5.2 (ESP32-S3)
Language: C (core) + C++ (display/sensor drivers)
RTOS:     FreeRTOS (built into ESP-IDF)
OTA:      ESP-IDF OTA via HTTPS (lot-systems.com/api/device/ota)
```

### Task Map (FreeRTOS)

```
CORE 0 (Protocol CPU):
  ├─ wifi_manager_task         Priority 5 — Connect, reconnect, monitor
  ├─ https_client_task         Priority 4 — Poll LOT API, POST logs
  ├─ ota_task                  Priority 3 — Check + apply firmware updates
  └─ button_isr + log_queue    Priority 6 (ISR) — Debounce, queue event

CORE 1 (Application CPU):
  ├─ display_task              Priority 5 — Render notifications, idle screen
  ├─ camera_task               Priority 3 — Capture on demand
  ├─ sensor_task               Priority 2 — BME688 read every 60 seconds
  └─ power_monitor_task        Priority 1 — Battery %, Qi charging state
```

### State Machine

```
States:
  BOOT          → init hardware, connect WiFi
  IDLE          → display clock/weather, low power
  NOTIFYING     → display message, vibrate (if haptic added), await button
  LOGGING       → POST /api/device/log (Copy button pressed)
  SENSING       → read BME688, POST /api/device/sensor
  OTA_UPDATE    → download + flash new firmware, reboot
  DEEP_SLEEP    → battery < 10%, wake on button or charger plug

Transitions:
  IDLE → NOTIFYING     : notification received from API poll
  NOTIFYING → LOGGING  : COPY button pressed
  LOGGING → IDLE       : POST successful (LOG confirmation shown 2s)
  * → SENSING          : every 60 seconds from any state
  IDLE → OTA_UPDATE    : daily OTA check (2:00 AM local time)
  * → DEEP_SLEEP       : battery < 10%
```

### Key Firmware Files

```
firmware/
  ├── main/
  │   ├── main.c                  Entry point, task spawn
  │   ├── wifi_manager.c/.h       WiFi init, reconnect loop
  │   ├── lot_api.c/.h            HTTPS client, JWT auth, all endpoints
  │   ├── display.c/.h            SH8601 AMOLED driver, notification renderer
  │   ├── camera.c/.h             OV2640 init, capture, JPEG encode
  │   ├── sensor.c/.h             BME688 via BME68x SDK, I2C
  │   ├── button.c/.h             GPIO interrupt, debounce, event queue
  │   ├── power.c/.h              BQ25672 I2C status, battery %, Qi detect
  │   ├── ota.c/.h                ESP-IDF OTA_0/OTA_1 partition update
  │   └── config.h                API URLs, GPIO pins, timing constants
  ├── components/
  │   ├── bme68x/                 Bosch BME68x SDK (official)
  │   └── lvgl/                   LVGL 8.3 (display rendering)
  ├── partitions.csv              OTA_0/OTA_1 + factory + NVS
  ├── sdkconfig.defaults          ESP32-S3 optimized defaults
  └── CMakeLists.txt
```

### GPIO Pin Assignment (ESP32-S3)

```
PIN    FUNCTION          PERIPHERAL
────────────────────────────────────────────
IO0    BOOT button       (factory use)
IO1    UART TXD          USB-CDC (debug)
IO2    UART RXD          USB-CDC (debug)
IO3    SPI CLK           SH8601 display
IO4    SPI MOSI          SH8601 display
IO5    SPI CS            SH8601 display
IO6    DISPLAY DC        SH8601 display
IO7    DISPLAY RST       SH8601 display
IO8    DISPLAY BL (PWM)  SH8601 backlight
IO10   I2C SDA           BME688 + BQ25672 + STWLC38
IO11   I2C SCL           BME688 + BQ25672 + STWLC38
IO12   COPY BUTTON       Omron B3U-1000P (pull-up, INT)
IO13   CAMERA PWDN       OV2640 power down
IO14   CAMERA RST        OV2640 reset
IO15   CAMERA VSYNC      DVP interface
IO16   CAMERA HREF       DVP interface
IO17   CAMERA PCLK       DVP interface
IO18   CAMERA D0–D7      DVP data (8 pins → IO18–IO25)
IO42   USB D-            USB-C connector
IO43   USB D+            USB-C connector
```

---

## 06 — LOT API CONNECTOR SPECIFICATION

All device communication uses HTTPS with JWT bearer token. The token is provisioned once during device setup and stored in ESP32-S3 NVS (Non-Volatile Storage, encrypted).

### Authentication

```
POST /api/device/auth
Content-Type: application/json

Request:
{
  "deviceId": "LOT-NODE-XXXX",
  "deviceSecret": "<provisioned-secret>"
}

Response:
{
  "token": "<JWT>",
  "expiresAt": "2026-12-31T00:00:00Z"
}
```

### Notification Poll

```
GET /api/device/notifications
Authorization: Bearer <token>
X-Device-ID: LOT-NODE-XXXX

Response:
{
  "notifications": [
    {
      "id": "notif_abc123",
      "message": "Coffee time!",
      "priority": "normal",
      "createdAt": "2026-06-23T09:00:00Z",
      "expiresAt": "2026-06-23T10:00:00Z"
    }
  ],
  "nextPollMs": 30000
}
```

### Copy Button Log Event

```
POST /api/device/log
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "deviceId": "LOT-NODE-XXXX",
  "notificationId": "notif_abc123",
  "action": "copy_acknowledged",
  "timestamp": "2026-06-23T09:04:22Z",
  "sensorSnapshot": {
    "tempC": 22.4,
    "humidityPct": 41.2,
    "pressureHpa": 1013.2,
    "airQualityIndex": 28
  }
}

Response:
{
  "logId": "log_xyz789",
  "status": "recorded",
  "displayConfirmation": "Logged ✓"
}
```

### Sensor Data Upload

```
POST /api/device/sensor
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "deviceId": "LOT-NODE-XXXX",
  "readings": [
    {
      "timestamp": "2026-06-23T09:00:00Z",
      "tempC": 22.4,
      "humidityPct": 41.2,
      "pressureHpa": 1013.2,
      "gasResistanceOhm": 12400,
      "airQualityIndex": 28,
      "airQualityAccuracy": 2
    }
  ]
}
```

### OTA Firmware Check

```
GET /api/device/ota/check
Authorization: Bearer <token>
X-Firmware-Version: 1.0.0
X-Device-ID: LOT-NODE-XXXX

Response (update available):
{
  "updateAvailable": true,
  "version": "1.1.0",
  "downloadUrl": "https://lot-systems.com/firmware/lot-node-v1.1.0.bin",
  "sha256": "a3f4b2..."
}

Response (up to date):
{
  "updateAvailable": false
}
```

### Log Tab Integration (server-side)

The `/api/device/log` endpoint records each Copy event in the existing `agent_ledger` table with `source = "lot-wearable-node"`, `classification = "notify"`, making it visible in the LOT Log tab under the user's account without any new database tables.

---

## 07 — SOFTWARE STACK (Desktop / Mobile Companion)

### LOT Node Provisioner (Web App — runs once)

```
Purpose: Pair the device to a LOT account on first use
Stack:   React + ESP BLE Provisioning (ESP-IDF Bluetooth LE)
Flow:
  1. User opens lot-systems.com/device/setup
  2. Browser (or phone) discovers LOT-NODE via BLE
  3. Sends WiFi credentials + LOT JWT token over BLE encrypted channel
  4. Device stores credentials in NVS, reboots into normal mode
  5. Confirmation shown on device screen and browser

Platform:  Chrome (Web Bluetooth API) or companion iOS/Android app
```

### LOT Node Dashboard (site extension)

```
New route: /device on lot-systems.com
Shows:
  - All paired devices
  - Live battery level + Qi charging state
  - Last seen timestamp
  - Notification history sent to device
  - Log tab entries from device (Copy button presses)
  - Sensor data: temperature, humidity, air quality charts
  - Firmware version + OTA update button
  - "Send notification" form (push custom message to device)
```

### Firmware Flash Tool (for factory programming)

```
Tool: esptool.py (Espressif official)
Command:
  esptool.py \
    --chip esp32s3 \
    --port /dev/ttyUSB0 \
    --baud 921600 \
    write_flash 0x0 lot-node-factory-v1.0.0.bin

Used at: PCBWay PCBA line (pre-programmed before shipping)
         Or post-assembly at LOT Systems HQ
```

---

## 08 — MANUFACTURING ROADMAP

### Phase 0 — Design (Weeks 1–3)

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| 1 | Schematic capture | EE Engineer | KiCad schematic PDF |
| 1 | PCB layout start | EE Engineer | 4-layer KiCad layout |
| 2 | PCB layout complete | EE Engineer | Gerber files + BOM CSV |
| 2 | Mechanical design | ME Engineer | STEP files, Part A + B |
| 3 | Design review | Vadik + EE + ME | Sign-off or red-line |
| 3 | PCBWay quote | Procurement | Quote PDF from PCBWay |

### Phase 1 — Prototype (Weeks 4–7)

| Week | Milestone | Qty | Lead Time | Cost |
|------|-----------|-----|-----------|------|
| 4 | PCBWay PCB order (express) | 5 | 2–3 days | $120 |
| 4 | PCBWay CNC enclosure (proto) | 5 sets | 7–10 days | $400 |
| 4 | Component hand-sourcing | 5 sets | Parallel | $200 |
| 5 | PCBs arrive, hand-solder | 5 | 2 days | Labor |
| 5 | Enclosures arrive, fit-check | 5 | Day 1 | — |
| 6 | Firmware flashed, bring-up | 5 | 3 days | — |
| 6 | LOT API integration test | 1 | 2 days | — |
| 7 | Design corrections (DFM) | — | 3 days | — |
| 7 | Proto sign-off | Vadik | 1 meeting | — |

### Phase 2 — Pilot Run (Weeks 8–14)

| Week | Milestone | Qty | Lead Time | Cost |
|------|-----------|-----|-----------|------|
| 8 | PCBWay PCBA order (100 units) | 100 | 10–14 days | $6,130 |
| 8 | PCBWay CNC order (100 enclosure sets) | 100 | 15–20 days | $4,000 |
| 8 | Battery + display bulk order | 100 each | 7–10 days | $1,150 |
| 10 | PCBAs arrive | 100 | — | — |
| 11 | Enclosures arrive | 100 | — | — |
| 11 | Final assembly (PCB + display + enclosure) | 100 | 5 days | $1,500 |
| 12 | QA test: 100% functional test | 100 | 3 days | Labor |
| 12 | Firmware flash + LOT provisioning | 100 | 2 days | Labor |
| 13 | Packaging + PDF inserts | 100 | 2 days | $870 |
| 14 | Ship to Vadik / distribution | 100 | — | — |

### Phase 3 — Production Scale (Months 5+)

```
500+ units:  MOQ unlocks lower CNC pricing (~$30/enclosure set)
             PCBWay volume discount: ~15%
             Per-unit COGS drops to ~$95 at 500 units

1,000+ units: Custom injection-molded stainless alternative
              (deep-draw stamped SS + electropolish)
              Drops enclosure cost to ~$12/unit
              Target COGS: ~$70/unit
```

### Gantt Overview

```
WEEK:  1    2    3    4    5    6    7    8    9   10   11   12   13   14
       ─────────────────────────────────────────────────────────────────────
Design [====|====|====]
Proto PCB         [====]
Proto CNC         [=========]
Bring-up               [====|====]
Fix + sign-off              [====]
PCBA 100u                        [====|====|====]
CNC 100u                         [====|====|====|====]
Assembly                                        [====]
QA + Flash                                           [====]
Packaging                                                 [===]
SHIP                                                          [=]
```

---

## 09 — AI-GRADE SENSORS — JUSTIFICATION

The **Bosch BME688** is the only sensor on this device that Bosch officially markets as *"AI-ready"*. It is used with the Bosch AI Studio software and the official `bme68x` library which includes a gas scanner algorithm that provides an **Air Quality Index (AQI)** trained by Bosch's machine learning pipeline on the gas resistance signal.

```
BME688 Capabilities:
  Temperature:  -40 to +85°C, ±1°C
  Humidity:     0–100 %rH, ±3%
  Pressure:     300–1100 hPa, ±1 hPa
  Gas / AQI:    BSEC 2.x algorithm — IAQ, CO2-eq, breath VOC
  Interface:    I2C (0x76 or 0x77) or SPI
  Package:      LGA 3.0×3.0×0.93 mm
  Current:      < 1 µA sleep, 3.1 mA peak
```

This sensor feeds:
1. **Device screen** — ambient temperature + humidity shown in idle state
2. **LOT API sensor endpoint** — sent to LOT profile every 60 seconds
3. **Copy button log** — snapshot included in every `POST /api/device/log`
4. **LOT Memory Engine** — context signal for AI-generated notification timing  
   (e.g., LOT knows it is cold and may push "Warm tea ritual?" at 8 AM)

---

## 10 — DISPLAY & NOTIFICATION SYSTEM

### SH8601 AMOLED Display

```
Part:       SH8601 (e.g., Waveshare 1.47" AMOLED Module or bare panel)
Size:       1.47 inch diagonal
Resolution: 172 × 320 pixels
Interface:  QSPI (4-wire SPI, up to 80 MHz)
Colors:     16.7M (24-bit RGB)
Thickness:  < 1.5 mm (AMOLED, no backlight layer)
Power:      ~20 mW typical (notification display)
Driver IC:  SH8601 (built-in)
```

### Notification Layout (40×40mm device screen view)

```
┌──────────────────────┐
│  09:24               │  ← Time (top-left, small)
│  22°C  41%RH         │  ← BME688 ambient (top-right, small)
│                      │
│  ┌──────────────────┐│
│  │  LOT             ││  ← LOT logo (white, 8px)
│  │                  ││
│  │  Coffee time!    ││  ← Notification body (white, 16px bold)
│  │                  ││
│  │  [COPY]          ││  ← Button prompt (gray, 12px)
│  └──────────────────┘│
│                      │
└──────────────────────┘
Idle (no notification):
  Shows: time, date, temp, humidity, battery %
  Style: minimal, white on black AMOLED (< 5 mW)
```

### Notification Sources

Any of these LOT platform events can trigger a push to the device:

| Source | Example Message |
|--------|-----------------|
| Memory Engine (AI) | "Coffee time!" |
| Memory Engine (AI) | "You mentioned you prefer morning walks — it's 21°C outside." |
| QOS system | "System pressure: LOW. Good time to plan tomorrow." |
| Calendar planner | "Intention check: did you complete your reading ritual?" |
| Mood check-in | "Time for your evening mood check-in." |
| Custom (user-sent) | Any text via /device dashboard "Send notification" |

---

## 11 — COPY BUTTON — LOG TAB INTEGRATION

The **COPY button** is the primary physical interaction on the device. Its design intent:

> "I received this. I acknowledge it. Log it."

When pressed:
1. Firmware debounces (50 ms)
2. Gets current `notificationId` (the displayed notification)
3. Includes BME688 sensor snapshot at that moment
4. `POST /api/device/log` — records in `agent_ledger` table
5. Display shows "Logged ✓" for 2 seconds
6. Returns to IDLE

On lot-systems.com **Log tab**, the entry appears as:

```
[LOT-NODE-0001]  09:04:22  Copy acknowledged — "Coffee time!"
                            Temp: 22.4°C  Humidity: 41%  AQI: 28 (Good)
                            Device: LOT-NODE-0001  Battery: 74%
```

This creates a timestamped, sensor-enriched log of every moment the user physically acknowledged an AI notification — a unique behavioral signal for the Memory Engine.

---

## 12 — DOCUMENT INDEX (PDF Manual Set)

All PDF documents are generated from the corresponding `.md` source files using a `md-to-pdf` pipeline. Delivered on USB drive + available at `lot-systems.com/device/docs`.

| # | Document | Source File | Pages (est.) | Audience |
|---|----------|-------------|--------------|----------|
| DOC-01 | User Guide — LOT Wearable Node | `docs/device/USER-GUIDE.md` | 12 | End user |
| DOC-02 | Quick Start Card | `docs/device/QUICK-START.md` | 2 | End user |
| DOC-03 | Firmware Technical Reference | `docs/device/FIRMWARE-REF.md` | 28 | Firmware engineer |
| DOC-04 | Firmware Flash Guide | `docs/device/FLASH-GUIDE.md` | 6 | Factory / engineer |
| DOC-05 | API Integration Spec | `docs/device/API-SPEC.md` | 16 | Backend developer |
| DOC-06 | Hardware Schematic | `hardware/schematic.pdf` | 4 | EE engineer |
| DOC-07 | PCB Assembly Drawing | `hardware/assembly.pdf` | 6 | PCBA factory (PCBWay) |
| DOC-08 | Mechanical Drawing (Part A) | `hardware/mech-front.pdf` | 2 | CNC machinist (PCBWay) |
| DOC-09 | Mechanical Drawing (Part B) | `hardware/mech-back.pdf` | 2 | CNC machinist (PCBWay) |
| DOC-10 | Compliance & Safety Notes | `docs/device/COMPLIANCE.md` | 4 | Legal / QA |
| DOC-11 | This Specification | `docs/corporate/LOT_WEARABLE_NODE_SPEC.md` | 30 | All |

---

## 13 — SESSION DATA COMPRESSION

Each device session between the LOT Node and lot-systems.com compresses interaction data before transmission using the following scheme:

```
COMPRESSION PROTOCOL: LOT-NODE-COMPRESS-v1

Per session (device powered on → powered off):
  ├─ Sensor readings: buffered in RAM every 60s
  │   → At upload: delta-encoded (only changes > 0.5°C / 2%RH)
  │   → JSON gzipped before POST
  │   → Typical: 480 readings/8h → 2.1 KB compressed (vs 42 KB raw)
  │
  ├─ Notification acknowledgments: queued if offline
  │   → Batched in POST on reconnect (up to 50 events per request)
  │
  └─ Session summary: posted on disconnect
      {
        "sessionStart": "2026-06-23T07:00:00Z",
        "sessionEnd":   "2026-06-23T23:00:00Z",
        "notificationsReceived": 8,
        "copyActionsLogged":     6,
        "sensorReadings":        480,
        "avgTempC":              21.8,
        "avgHumidityPct":        39.2,
        "avgAQI":                32
      }
```

This keeps device → cloud bandwidth under 10 KB/day even at maximum polling rate.

---

## 14 — POWER & BATTERY LIFE

```
BATTERY: LP402535 · LiPo 3.7V · 280 mAh

COMPONENT POWER BUDGET:
  ESP32-S3 (active WiFi):    ~100 mA × ~5s/min polling    = 8.3 mA avg
  SH8601 AMOLED (on, white): ~20 mA × ~30s/hr show        = 0.17 mA avg
  BME688 (periodic read):    ~3.1 mA × 1s/min             = 0.05 mA avg
  ESP32-S3 (deep sleep):     ~20 µA (most of the time)    = 0.02 mA avg
  BQ25672 quiescent:         ~50 µA always                = 0.05 mA avg
  STWLC38 (not charging):    ~10 µA                       = 0.01 mA avg

ESTIMATED AVERAGE CURRENT:  ~9 mA

BATTERY LIFE: 280 mAh ÷ 9 mA ≈ 31 hours per charge

Target: 1.5 days on a charge (day + night + next morning)
Wireless charge time (5W Qi): 280mAh × 3.7V ÷ 5W ≈ 42 minutes to full
```

---

## 15 — REGULATORY & COMPLIANCE NOTES

| Certification | Requirement | Path |
|--------------|-------------|------|
| FCC Part 15B | USA — unintentional radiator (ESP32-S3 WiFi/BLE) | ESP32-S3-WROOM-1 is pre-certified (FCC ID: 2AC7Z-ESP32S3WROOM1) |
| CE RED | EU — radio equipment directive | ESP32-S3 module carries CE mark |
| RoHS | Lead-free materials | PCBWay ENIG + RoHS BOM selection |
| UN38.3 | LiPo battery transport | Sourced from UN38.3-certified battery supplier |
| Qi WPC 1.3 | Wireless charging interoperability | STWLC38 is WPC-certified |

> For 100-unit pilot run, device-level FCC/CE testing is not required (pre-certified modules). At commercial scale (1,000+ units), full device certification needed (~$15,000 per jurisdiction via TUV or SGS).

---

## 16 — COSMO® CIA IDENTITY

This device is the first physical hardware product of the **COSMO® CIA** (Compact Intelligence Array) line — a sub-brand of LOT Systems under the COSMO® division.

```
Product name:   LOT Node 1 by COSMO® CIA
Model number:   CIA-NODE-001
SKU:            LOT-CIA-001-SS
Color:          Silver (natural SS 316L)
Series:         Compact Intelligence Array — Series 1

Branding on device:
  Front face (brushed SS): None (clean)
  Back face (polished SS): "LOT" laser-etched, 8mm tall
  Inside back shell:       "CIA-NODE-001 / lot-systems.com" (0.3mm engraved)
  USB-C area:              "3.7V / 280mAh / FCC ID: 2AC7Z..."
```

---

## 17 — ROADMAP ANALYSIS

### Critical Path

```
BLOCKER 1: Mechanical engineer for STEP files
  → No PCBWay CNC order without mechanical drawings
  → Recommend: hire ME freelancer (Upwork/Toptal), $1,500–3,000 fixed

BLOCKER 2: EE engineer for schematic + PCB layout
  → Recommend: hire EE freelancer with ESP32-S3 experience
  → Portfolio check: must show RF layout on 4-layer board
  → $2,000–4,000 fixed for full schematic + layout + Gerber package

BLOCKER 3: Display module confirmation
  → SH8601 availability varies. Confirm stock at LCSC or Waveshare
  → Alternative: SSD1306 1.3" OLED (simpler, thicker, monochrome)
     ↳ Advantage: 0.6mm thinner, cheaper ($1.80 vs $8)
     ↳ Disadvantage: no color, lower resolution

BLOCKER 4: 5mm total thickness is engineering-constrained
  → LP402535 battery (4mm thick) leaves only 1mm for PCB + display
  → Recommended adjustment: 7mm depth (still very slim for a pager)
  → At 7mm: LP502535 (5mm battery, 350mAh) fits comfortably
  → Enclosure re-spec: Part A = 4mm / Part B = 3mm
```

### Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Camera doesn't fit 5mm | HIGH | MEDIUM | Camera protrudes 1.5mm (lens bump) — acceptable |
| BME688 I2C conflict | LOW | LOW | Set BME688 to 0x77, BQ25672 to 0x6B, STWLC38 to 0x61 |
| WiFi RF performance inside SS enclosure | MEDIUM | HIGH | Slot antenna window in SS (0.5mm gap, filled with non-conductive paint) |
| Display FPC routing in 5mm | MEDIUM | MEDIUM | Use ZIF connector on PCB bottom-side |
| PCBWay CNC ±0.05mm tolerance on press-fit | MEDIUM | MEDIUM | Add 0.03mm clearance, gasket absorbs variance |
| LiPo swelling over time | LOW | MEDIUM | BQ25672 voltage limited to 4.2V, temp cutoff at 45°C |
| OTA brick risk | LOW | HIGH | ESP-IDF rollback partition: if new FW fails, reverts automatically |

### Next Actions (Priority Order)

```
IMMEDIATE (Week 1):
  □ Source EE + ME engineers (post brief on Upwork)
  □ Lock display choice: SH8601 vs SSD1306 (thickness decision)
  □ Get PCBWay CNC quote for 5 prototype enclosure sets
  □ Order ESP32-S3-DevKitC for firmware bringup (no waiting for PCB)
  □ Open PCBWay account, upload initial BOM for component quote

WEEK 2:
  □ EE delivers schematic draft
  □ ME delivers Part A/B STEP files (draft)
  □ Firmware: WiFi + BME688 + display on DevKit (proof of concept)
  □ LOT backend: add /api/device/* endpoints (4 routes, see §06)

WEEK 3:
  □ EE delivers Gerber files + PCB layout review
  □ ME finalizes STEP files after mechanical review
  □ Submit PCBWay orders: PCB (5 units) + CNC (5 enclosure sets)
  □ Firmware: LOT API integration complete on DevKit

WEEK 4–7:
  □ Prototype assembly and bring-up (see Phase 1, §08)
```

---

## 18 — BUDGET ALLOCATION RECOMMENDATION

```
TOTAL BUDGET FOR 100-UNIT PILOT: $35,000 (recommended)

  Engineering (EE + ME):           $7,000  (one-time NRE)
  Prototypes (Phase 1):            $1,200
  Production PCBAs (100u):         $6,130
  Production CNC enclosures (100): $4,000
  Components (batteries, display): $1,150
  Wireless charger docks (100):    $1,710
  Assembly + QA labor:             $1,500
  Packaging + USB drives:          $870
  Firmware + Backend dev:          $5,000  (if contracted out)
  Regulatory (FCC pre-cert check): $500
  Contingency (15%):               $6,940
  ───────────────────────────────────────
  TOTAL:                           $36,000

  At $379 MSRP × 100 units = $37,900 gross revenue
  Covers pilot cost + proves market demand
```

---

## 19 — WIRELESS CHARGER DESIGN

The companion charger is a 55×55×8 mm anodized aluminum puck, also silver-colored to match the device.

```
CHARGER DOCK:
  Shape:        Square, 55×55×8 mm
  Material:     Aluminum 6061, anodized silver
  Input:        USB-C, 9V/1A (9W PD)
  Output:       Qi WPC 1.3, 5W
  IC:           STWBC-EP (ST Microelectronics)
  Coil:         Ø 40mm, center-aligned
  Alignment:    Magnetic alignment ring (N52 neodymium, Ø 5mm × 2mm, ×4)
  LED:          Green = charging / White = full / Red = error
  Logo:         "LOT" laser-etched on top, centered
  Cable:        USB-C 1m braided cable (included)
```

```
MAGNETIC ALIGNMENT DETAIL:
  Device back shell has 4× N52 magnets (Ø 3mm × 1.5mm) at 28mm BCD
  Charger dock has 4× N52 magnets at same BCD (alternating polarity)
  Device snaps onto charger, auto-aligns coil centers within ±1mm
  Combined pull force: ~600g (holds device on vertical surface)
```

---

```
LOT SYSTEMS CORPORATION
COSMO® CIA — Compact Intelligence Array
LOT Wearable Node — Hardware Specification & Manufacturing Roadmap
v1.0.0 · 23 June 2026
Made in the USA
Inventor: Vadim Marmeladov
```
