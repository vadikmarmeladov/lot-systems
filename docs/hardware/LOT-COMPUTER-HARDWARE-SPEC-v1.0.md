<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — PHYSICAL DEVICE
## Hardware Specification · Components · Roadmap
## Session Report · 17 June 2026

---

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   LOT SYSTEMS CORPORATION                                        ║
║   LOT COMPUTER — COSMO® CIA WEARABLE NODE                       ║
║                                                                  ║
║   40mm × 40mm × 5mm  ·  Polished 304 Stainless Steel            ║
║   Pager-class Notifications  ·  LOT API Native                  ║
║   PCBWay PCBA  ·  100-Unit Production Run                       ║
║                                                                  ║
║   INVENTOR: Vadik Marmeladov, COSMO® CIA                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 00 — DEVICE CONCEPT

The **LOT Computer** is a palm-scale autonomous notification node — a flat square
pager that receives AI-generated messages from lot-systems.com, reads ambient
weather data, shows a minimal screen, exposes a single **Copy** button that
fires a signed log entry back to the LOT Log tab, and sits in a wireless charging
cradle when at rest.

It is not a phone. It is not a smartwatch. It is the physical extension of the LOT OS
into the real world — the same way LOT captures behavioral patterns in software,
the LOT Computer captures the user's environmental context in hardware.

---

## 01 — PHYSICAL FORM FACTOR

```
┌──────────────────────────────────────────────────────┐
│  DIMENSION         VALUE                             │
│  ────────────────────────────────────────────────    │
│  Width             40 mm                             │
│  Height            40 mm                             │
│  Depth             5 mm                              │
│  Shape             Square, chamfered corners (R2mm)  │
│  Weight (target)   ~28 g                             │
│  Material          304 Stainless Steel, 2-part body  │
│  Finish — Back     Mirror-polished (Grade 8 / #8)    │
│  Finish — Front    Brushed matte + recessed window   │
└──────────────────────────────────────────────────────┘
```

### Two-Part Body Architecture

```
FRONT SHELL (Face Plate)                BACK SHELL (Cover Plate)
────────────────────────                ───────────────────────────
· Brushed 304 SS, 0.7mm wall           · Mirror-polished 304 SS, 0.7mm wall
· Recessed window for display           · Laser-engraved LOT® wordmark, centered
· Camera aperture Ø 4mm                 · Qi receiver recess ring (Ø 34mm)
· Button aperture Ø 8mm                 · 4 × M1.0 retention screw bosses
· USB-C port slot (bottom edge)         · Snap-fit perimeter lip (0.4mm clearance)
· Gasket groove (IPX4 rating)           · Made in USA / lot-systems.com text
```

Assembly: Front shell snaps over the PCB-battery stack into the back shell.
Four M1.0 stainless micro-screws lock the halves. The perimeter gasket seals
to IPX4 (splash-proof). CNC machined, batch of 100 per run.

---

## 02 — ELECTRONICS ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOT COMPUTER PCB v1.0                       │
│              38mm × 38mm · 4-Layer · 1oz Cu                     │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│  │ ESP32-S3 │   │  OLED    │   │ OV2640   │   │  BME688    │  │
│  │  MCU     │   │  DISPLAY │   │  CAMERA  │   │  WEATHER   │  │
│  │ WiFi+BLE │   │ 1.3" SQ  │   │  2MP     │   │  SENSOR    │  │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └─────┬──────┘  │
│       │              │              │                 │          │
│  ─────┴──────────────┴──────────────┴─────────────────┴──────── │
│                    INTERNAL SPI / I2C BUS                        │
│  ─────────────────────────────────────────────────────────────── │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│  │  TP4056  │   │  BQ51013 │   │  402030  │   │  BUTTON    │  │
│  │  LiPo    │   │  Qi RX   │   │  150mAh  │   │  COPY KEY  │  │
│  │  CHARGER │   │  5W WPC  │   │  LiPo    │   │  Tactile   │  │
│  └──────────┘   └──────────┘   └──────────┘   └────────────┘  │
│                                                                  │
│  USB-C port (charge + debug UART)   Qi coil (flex, back shell)  │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Stack (4-Layer PCB)

| Layer | Function |
|-------|----------|
| L1 (Top) | Signal + components |
| L2 | Ground plane (solid) |
| L3 | Power plane (3.3V, 1.8V) |
| L4 (Bottom) | Signal + battery pads |

---

## 03 — BILL OF MATERIALS (100-UNIT RUN)

### Core Electronics

| # | Component | Part Number | Vendor | Unit Price | 100× Total |
|---|-----------|-------------|--------|-----------|------------|
| 1 | MCU — ESP32-S3-MINI-1U (WiFi+BLE 5.0, AI accel, 8MB PSRAM) | ESP32-S3-MINI-1U-N8R8 | Espressif / Mouser | $3.50 | $350 |
| 2 | Display — 1.3" 128×128 SQ OLED, SSD1327, I2C | ER-OLED013-1W | EastRising / AliExpress | $4.20 | $420 |
| 3 | Camera — OV2640 2MP, 1/4", DVP, 24-pin FFC | OV2640-M | OmniVision / LCSC | $2.80 | $280 |
| 4 | Weather sensor — BME688 (temp + humidity + pressure + gas) | BME688 | Bosch / Mouser | $4.50 | $450 |
| 5 | Wireless charging RX IC — BQ51013B (5W Qi WPC 1.2) | BQ51013BRHLT | Texas Instruments / Mouser | $1.80 | $180 |
| 6 | Qi RX coil — Ø 34mm flex PCB coil, 6.3µH | WR202020-6R3-G | Würth / Mouser | $1.20 | $120 |
| 7 | LiPo battery — 402030, 150mAh, 3.7V, 2.0mm thin | LP402030 | Shenzhen sourced / LCSC | $1.50 | $150 |
| 8 | LiPo charger IC — TP4056, 1A, USB-C input, SOT-23 | TP4056-DF | TOPPOWER / LCSC | $0.20 | $20 |
| 9 | LDO regulator — XC6210 3.3V, 300mA, SOT-23 | XC6210B332MR-G | Torex / Mouser | $0.40 | $40 |
| 10 | Copy button — 8mm tactile SMD, flush mount, 0.4N | PTS526 SK08 SMTR2 LFS | C&K / Mouser | $0.35 | $35 |
| 11 | USB-C connector — 16-pin SMD, mid-mount 0.8mm | TYPE-C-31-M-12 | LCSC | $0.25 | $25 |
| 12 | ESD protection — USB-C lines, TVS array | USBLC6-2P6 | STMicro / Mouser | $0.15 | $15 |
| 13 | Decoupling caps, resistors, passives (kit) | — | LCSC | $2.00 | $200 |

**Electronics subtotal (100 units): ~$2,285**

### PCB Fabrication + Assembly

| Item | Specification | Vendor | Cost |
|------|---------------|--------|------|
| PCB bare | 38×38mm, 4L, 1oz Cu, HASL, 100 pcs | PCBWay | ~$120 |
| PCB assembly (PCBA) | SMT both sides, 100 boards, BOM supplied | PCBWay | ~$600 |
| Stencil | Stainless laser stencil, top + bottom | PCBWay | ~$30 |

**PCB total: ~$750**

### Mechanical (Enclosure)

| Item | Specification | Vendor | Cost per unit | 100× |
|------|---------------|--------|---------------|------|
| Front shell CNC | 304 SS, brushed, R2 corners, apertures | PCBWay CNC | $8.50 | $850 |
| Back shell CNC | 304 SS, mirror-polished, laser engrave | PCBWay CNC | $9.50 | $950 |
| Gasket | Silicone O-ring, custom, 0.8mm profile | Local rubber fab | $0.40 | $40 |
| Screws | M1.0 × 2mm SS philips (×4 per unit) | Fasconn / Amazon | $0.10 | $10 |

**Mechanical total: ~$1,850**

### Wireless Charging Cradle (per unit)

| Item | Spec | Cost per unit | 100× |
|------|------|---------------|------|
| Qi TX module | 5W, WPC 1.2, 40×40mm pad size | $2.50 | $250 |
| Cradle base | ABS injection mold or 3D print (SLA) | $3.00 | $300 |
| USB-C power cable | 0.5m, 5V/1A | $0.80 | $80 |

**Charger total: ~$630**

---

### TOTAL UNIT COST (100-UNIT RUN)

```
CATEGORY                  COST (100 UNITS)    PER UNIT
──────────────────────────────────────────────────────
Electronics (BOM)         $2,285              $22.85
PCB fab + assembly        $750                $7.50
Mechanical enclosure      $1,850              $18.50
Wireless charger          $630                $6.30
Packaging + labels        $300                $3.00
Contingency (10%)         $582                $5.82
──────────────────────────────────────────────────────
TOTAL                     ~$6,397             ~$63.97/unit
```

*Suggested retail price: $149–$199. Target GM: 67%+.*

---

## 04 — PCBWAY MANUFACTURING PLAN

### Step-by-Step Order Sequence

```
STEP 01 — PCB DESIGN FILE PREP
  · Export Gerber RS-274X (all layers)
  · Export drill file (.DRL Excellon)
  · Export BOM as CSV (MPN + value + footprint)
  · Export Pick-and-Place CSV (centroid file)
  · Export assembly drawing PDF (component side notes)

STEP 02 — PCBWay Quote: PCB + PCBA
  · Upload to pcbway.com → Instant Quote → PCB Assembly
  · Specify: 100 pcs, 4-layer, 38×38mm, 1.0mm board thickness
  · Select: SMT both sides, turnkey (PCBWay sources passives)
  · Supply: critical components (ESP32-S3, BME688, OV2640) separately
  · Lead time: 5–7 business days for PCBA

STEP 03 — PCBWay Quote: CNC Machining
  · Upload STEP files for front + back shell
  · Material: 304 Stainless Steel
  · Finish: Front → brushed #4 / Back → mirror #8 polish
  · Laser engraving: LOT® wordmark on back shell
  · Tolerance: ±0.05mm for snap-fit, ±0.1mm general
  · Lead time: 7–10 business days

STEP 04 — INCOMING INSPECTION
  · Electrical test: flash firmware test image, verify all peripherals
  · Visual: check solder joints, camera module seating, button click
  · Thermal: 30-min burn-in at 40°C

STEP 05 — FINAL ASSEMBLY
  · Install gasket in front shell groove
  · Place PCB-battery assembly into front shell
  · Connect Qi coil flex to PCB pad
  · Close back shell, torque M1.0 screws to 0.8N·cm
  · Apply LOT® serial number label (inner back shell)

STEP 06 — QA PACK
  · Full functional test: WiFi connect, notification receive, button log, display, weather read
  · IPX4 spray test (1/3 units sampled)
  · Pack in branded box with charger + USB-C cable + quick-start card
```

### PCBWay Contact Points

- **PCB + PCBA:** pcbway.com → Quote → PCB Assembly (Turnkey)
- **CNC Machining:** pcbway.com → Quote → CNC Machining → Metal
- **Project manager:** request dedicated PM for batch > 50 units
- **DFM review:** request free Design for Manufacturability check before production order

---

## 05 — FIRMWARE SPECIFICATION

### Platform

```
MCU:        ESP32-S3 (Xtensa LX7 dual-core 240MHz)
Framework:  ESP-IDF v5.2 (C/C++)
OTA:        ESP-IDF OTA via HTTPS (lot-systems.com/firmware)
Storage:    NVS (WiFi creds, user token, session log)
```

### Firmware Module Map

```
firmware/
├── main/
│   ├── main.c                  Entry point, task scheduler
│   ├── wifi_manager.c          WiFi connect, reconnect, NTP sync
│   ├── lot_api.c               LOT API connector (REST + WebSocket)
│   ├── notification.c          Pager-mode: receive + queue + display
│   ├── display_driver.c        SSD1327 OLED driver (I2C)
│   ├── camera_driver.c         OV2640 DVP capture (JPEG compress)
│   ├── weather_sensor.c        BME688 read via I2C (BSEC library)
│   ├── button_handler.c        Copy button ISR + debounce + API call
│   ├── qi_charger.c            BQ51013 status monitoring
│   ├── session_compress.c      Session log GZIP compress before POST
│   ├── ota_update.c            OTA firmware fetch + apply
│   └── config.h                Compile-time constants
├── components/
│   ├── bsec/                   Bosch BSEC library for BME688 AI modes
│   ├── cJSON/                  Lightweight JSON parse/serialize
│   ├── mbedTLS/                TLS 1.3 for HTTPS (bundled in IDF)
│   └── tinyjpeg/               JPEG encode for camera frames
├── sdkconfig                   ESP-IDF config (default: WiFi + BLE)
└── CMakeLists.txt
```

### Core Firmware Behaviors

```
BOOT SEQUENCE
  1. NVS read → load WiFi creds + LOT user token
  2. WiFi connect → NTP sync → set RTC
  3. BME688 init → start BSEC classification loop (10s interval)
  4. Display init → show LOT® logo splash 2s
  5. WebSocket connect to wss://lot-systems.com/ws/device
  6. Enter main notification loop

NOTIFICATION LOOP (pager mode)
  · WebSocket listener: receive JSON { type, message, timestamp }
  · Display: render message in 16px Arial-equivalent bitmap font
  · Auto-clear: message shown 60s then returns to clock/weather idle
  · Queue: up to 20 unread messages stored in NVS

COPY BUTTON (GPIO 0, active-low, pull-up)
  · ISR fires on falling edge → debounce 50ms
  · Build payload: { deviceId, userId, timestamp, action: "copy", context: lastMessage }
  · GZIP compress payload
  · POST to https://lot-systems.com/api/device/log
  · Display: "✓ Logged" confirmation for 2s

WEATHER READ (5-minute interval)
  · BME688: temperature, humidity, pressure, IAQ index
  · BSEC AI mode: classify air quality (Good/Moderate/Poor/Hazardous)
  · POST to https://lot-systems.com/api/device/weather
  · Display idle screen shows current temp + IAQ

SESSION COMPRESS (on WiFi reconnect or every 6h)
  · Collect all NVS-stored events from session
  · GZIP compress to <2KB block
  · POST to https://lot-systems.com/api/device/session
  · Clear NVS log after confirmed receipt (HTTP 200)

OTA UPDATE
  · Check https://lot-systems.com/firmware/latest.json on boot + daily
  · If version > current: download .bin, verify SHA256, flash partition B
  · Reboot to new firmware; rollback if boot fails 3×
```

---

## 06 — LOT API CONNECTOR

### Device Authentication

```
POST /api/device/register
  Body: { deviceId: "LOT-001", publicKey: "..." }
  Response: { token: "...", userId: "..." }
  Storage: NVS key "device_token"
```

### Endpoint Map

```
ENDPOINT                          METHOD   FIRMWARE USE
──────────────────────────────────────────────────────────────────
/api/device/register              POST     First boot, pairing
/api/device/auth                  POST     Token refresh
/api/device/log                   POST     Copy button event
/api/device/weather               POST     BME688 reading (5 min)
/api/device/session               POST     GZIP session dump
/api/device/notifications         GET      Poll fallback (if WS down)
/firmware/latest.json             GET      OTA version check
/firmware/{version}.bin           GET      OTA binary download
wss://lot-systems.com/ws/device   WS       Primary notification stream
```

### Notification Payload (Site → Device)

```json
{
  "type": "notification",
  "source": "lot-ai",
  "message": "Coffee time!",
  "priority": "normal",
  "timestamp": "2026-06-17T14:00:00Z",
  "icon": "coffee"
}
```

### Log Payload (Device → Site → Log Tab)

```json
{
  "deviceId": "LOT-001",
  "userId": "uuid-...",
  "event": "copy_button",
  "context": {
    "lastMessage": "Coffee time!",
    "weather": { "temp": 22.1, "humidity": 48, "iaq": "Good" },
    "timestamp": "2026-06-17T14:00:05Z"
  },
  "sessionId": "session-hash-...",
  "compressed": false
}
```

### LOT Site Integration Points

| Site Feature | Device Integration |
|---|---|
| Log tab (lot-systems.com) | Copy button POST → appears as device log entry |
| Notifications system | WebSocket push → displayed on OLED |
| Weather widget | Device BME688 feeds local weather data to user profile |
| System/QOS | Device uptime + battery % reported to QOS dashboard |
| Settings | Device paired in Settings → Devices section |

---

## 07 — SESSION COMPRESSION

Every interaction the device logs is stored in NVS as a structured event:

```
DEVICE SESSION RECORD
  session_id:    ULID (generated at boot)
  start_time:    ISO8601
  events[]:
    - { type: "notification_received", message, timestamp }
    - { type: "copy_button", context, timestamp }
    - { type: "weather_read", data, timestamp }
    - { type: "wifi_connect", ssid, rssi, timestamp }
    - { type: "ota_check", version, timestamp }
  end_time:      ISO8601 (or null if active)
  battery_start: int (%)
  battery_end:   int (%)
```

Compression pipeline: JSON serialize → GZIP (zlib level 6) → Base64 encode → POST.
Typical 6-hour session: ~800 bytes raw → ~200 bytes compressed.

---

## 08 — SENSOR SUITE

### BME688 — Bosch Environmental Sensor (AI-Grade)

The BME688 is Bosch's AI-capable multi-sensor. It runs the **BSEC 2.x** library
(Bosch Sensortec Environmental Cluster), which applies a trained neural network
on-chip to classify air quality beyond raw readings.

```
PARAMETER        RANGE           RESOLUTION    ACCURACY
──────────────────────────────────────────────────────────
Temperature      -40°C to +85°C  0.01°C        ±0.5°C
Humidity         0–100% RH       0.008% RH     ±3% RH
Pressure         300–1100 hPa    0.18 Pa       ±0.6 hPa
Gas (VOC)        0–500 IAQ       1 IAQ         AI-classified
Air Quality      Index 0–500     —             Good/Mod/Poor/Haz
```

BSEC AI modes enabled in firmware:
- `BSEC_OUTPUT_IAQ` — Indoor air quality index
- `BSEC_OUTPUT_STATIC_IAQ` — Stabilized IAQ
- `BSEC_OUTPUT_CO2_EQUIVALENT` — eCO₂ estimation
- `BSEC_OUTPUT_BREATH_VOC_EQUIVALENT` — Breath VOC estimate

### OV2640 — Camera Module

```
SENSOR          OV2640 (OmniVision)
RESOLUTION      2MP (1600×1200 UXGA), JPEG output
FRAME RATE      15fps at VGA, 5fps at UXGA
INTERFACE       DVP (parallel), 8-bit
FOCAL LENGTH    Fixed ~2.8mm
FOV             ~66° diagonal
OUTPUT          JPEG (hardware JPEG compression on-chip)
USAGE           User-initiated capture, QR code scan for pairing,
                future: gesture detection
```

---

## 09 — DISPLAY

```
MODULE          1.3" 128×128 OLED (SSD1327 controller)
SIZE            ~34mm × 34mm (fits inside 38×38mm PCB)
PIXELS          128 × 128
COLORS          16-level grayscale
INTERFACE       I2C (400kHz fast mode)
POWER           ~15mA active, <1µA sleep
BRIGHTNESS      Adjustable 0–255 via SSD1327 register

DISPLAY MODES:
  ┌─────────────────────────┐
  │  17:42  Tue 17 Jun      │  ← idle clock
  │  22°C  IAQ: Good        │  ← weather strip
  │  ● WiFi  🔋 82%         │  ← status bar
  └─────────────────────────┘

  ┌─────────────────────────┐
  │                         │
  │   Coffee time! ☕       │  ← notification mode
  │                         │
  │  [COPY]   2m ago        │  ← button prompt
  └─────────────────────────┘

  ┌─────────────────────────┐
  │         ✓               │
  │      Logged             │  ← copy confirm (2s)
  └─────────────────────────┘
```

---

## 10 — WIRELESS CHARGING

```
STANDARD        Qi WPC 1.2
TX POWER        5W
RX IC           BQ51013B (Texas Instruments)
RX COIL         Ø 34mm Würth flex coil, 6.3µH, integrated into back shell
CHARGE CURRENT  ~450mA → 150mAh battery charges in ~25 min (0→80%)
PROTECTION      OVP, OCP, OTP (all in BQ51013B)
CHARGER CRADLE  40×40mm pad, ABS body, USB-C input (5V/1A)
```

Cradle design: the LOT Computer simply rests face-up on the cradle pad. Magnetic
alignment (two N35 neodymium dots, Ø 2mm, embedded in cradle and back shell)
ensures coil alignment without a visible mechanism.

USB-C port on the device's bottom edge provides backup wired charging and
firmware flashing via UART (ESP-IDF `idf.py flash`).

---

## 11 — COPY BUTTON — LOG TAB INTEGRATION

The single button on the front face is the **Copy key** — the device's only
intentional user action. Its purpose:

> "I saw this notification. I want it recorded. Send it to my LOT Log."

```
PHYSICAL SPEC
  Type:      C&K PTS526, SMD tactile, 8mm actuator
  Feel:      0.4N actuation, 0.15mm travel, audible click
  Location:  Bottom-right of front face, flush with SS surface
  Label:     LOT® circle logo embossed on keycap

FIRMWARE FLOW
  Press detected → debounce 50ms → build log payload →
  GZIP → POST /api/device/log → display "✓ Logged" →
  entry appears in LOT Log tab within 2 seconds

LOT SITE LOG ENTRY
  ┌────────────────────────────────────────────────┐
  │ [device]  17 Jun 2026  14:00:05                │
  │ LOT Computer — Copy                            │
  │ Message: "Coffee time!"                        │
  │ Weather: 22°C · Humidity 48% · IAQ Good        │
  │ Battery: 82% · Device: LOT-001                 │
  └────────────────────────────────────────────────┘
```

---

## 12 — 100-UNIT PRODUCTION ROADMAP

```
PHASE          TIMELINE        DELIVERABLE
────────────────────────────────────────────────────────────────────
P0 — DESIGN    Weeks 1–3       Schematics, PCB layout, STEP enclosure
               (PCBWay DFM)    PCBWay DFM review pass, firmware skeleton

P1 — PROTO     Weeks 4–6       3× hand-assembled prototypes (PCBWay PCB)
               (EVT)           Enclosure 3D-printed (SLA, steel-look resin)
                               Firmware MVP: WiFi, display, button, BME688

P2 — PILOT     Weeks 7–10      20× PCBA from PCBWay (CNC enclosures)
               (DVT)           Full firmware, LOT API integration, OTA
                               10-device user test (team + beta users)
                               IPX4 validation, thermal, drop test

P3 — PRODUCTION Weeks 11–14   100× PCBA + CNC enclosures (full run)
               (PVT → MP)      QA inspection, burn-in, functional test
                               Pack: box + charger + USB-C + card

P4 — SHIP      Week 15+        Fulfillment to COSMO® CIA pilot group
                               OTA firmware updates ongoing
                               Collect LOT Log data from devices
```

### Critical Path

```
PCB layout (EAGLE/KiCad) ─────────┐
Enclosure STEP file ───────────────┼─► PCBWay submit ──► PCBA ──► assemble ──► ship
Firmware EVT pass ─────────────────┘

Longest lead time: CNC stainless steel machining (7–10 days)
Second: PCBA with BME688 sourcing (5–7 days)
Order both simultaneously after DVT sign-off.
```

---

## 13 — DOCUMENT SUITE

### Documents Generated This Session

| Document | File | Status |
|---|---|---|
| Hardware Spec (this file) | `docs/hardware/LOT-COMPUTER-HARDWARE-SPEC-v1.0.md` | ✓ Complete |
| Firmware Architecture | `docs/hardware/LOT-COMPUTER-FIRMWARE-v1.0.md` | → Next session |
| LOT API Device Endpoints | `docs/hardware/LOT-COMPUTER-API-v1.0.md` | → Next session |
| Assembly Manual (PDF source) | `docs/hardware/LOT-COMPUTER-ASSEMBLY-MANUAL-v1.0.md` | → Next session |
| Quick-Start Guide (PDF source) | `docs/hardware/LOT-COMPUTER-QUICKSTART-v1.0.md` | → Next session |
| BOM CSV | `docs/hardware/LOT-COMPUTER-BOM-v1.0.csv` | → Next session |
| PCBWay Order Checklist | `docs/hardware/LOT-COMPUTER-PCBWAY-CHECKLIST.md` | → Next session |

### PDF Manual Plan (7 manuals)

```
01  LOT Computer — Quick-Start Guide (2 pages, color)
    "What's in the box, charge it, pair it, press Copy."

02  LOT Computer — User Manual (12 pages)
    Notifications, Copy button, weather, charging, care.

03  LOT Computer — Assembly Manual (8 pages, engineering)
    PCB, enclosure, screws, gasket, QA steps.

04  LOT Computer — Firmware Manual (10 pages)
    ESP-IDF setup, flash, config, OTA, debug UART.

05  LOT Computer — API Integration Manual (8 pages)
    Device registration, endpoints, WebSocket, log format.

06  LOT Computer — PCBWay Manufacturing Checklist (4 pages)
    Gerber, BOM, PnP, DFM notes, CNC drawing callouts.

07  LOT Computer — Safety & Compliance Sheet (2 pages)
    FCC Part 15 (ESP32-S3 pre-certified), RoHS, IPX4, battery.
```

All PDFs sourced from Markdown → Pandoc + LaTeX template with LOT® branding.

---

## 14 — COMPONENT SOURCING GUIDE

### Where to Buy (by category)

```
CATEGORY           RECOMMENDED VENDOR        NOTES
──────────────────────────────────────────────────────────────────
ESP32-S3-MINI-1U   Mouser / Digi-Key         Search MPN: ESP32-S3-MINI-1U-N8R8
BME688             Mouser / Digi-Key / LCSC   Bosch direct also available
OV2640 module      LCSC / AliExpress          Get with FPC cable, confirmed OV2640
BQ51013B           Mouser / TI.com store      Eval kit useful for bench testing
Würth Qi coil      Mouser (Würth 760308103)   Confirm Ø 34mm fits shell recess
LiPo 402030 150mAh LCSC / Alibaba             Confirm actual 5mm height incl. wrap
TP4056             LCSC (mass use, cheap)     Get 50+ spares
SSD1327 OLED       EastRising / Aliexpress    Confirm 38×38mm overall module size
M1.0 screws        McMaster-Carr / Amazon     304 SS philips pan head
```

### PCBWay Direct Services Used

```
SERVICE                 PCBWAY URL PATH                  NOTES
──────────────────────────────────────────────────────────────────────
PCB Fabrication         /pcb-fabrication-quote           4-layer, 38×38mm, 100 pcs
PCBA (SMT Assembly)     /assembly                        Turnkey preferred
CNC Machining           /cnc-machining-and-3d-printing   304 SS, front + back shell
Laser Engraving         (within CNC order)               LOT® wordmark, serial number
```

---

## 15 — AI SENSORS CONTEXT (BSEC)

The BME688 with Bosch's BSEC library qualifies as an **AI-grade sensor** because:

- On-chip neural network processes raw gas resistance curves
- Self-calibrating: learns the ambient baseline of the user's environment over 4 days
- Outputs human-readable classification (Good / Moderate / Poor / Hazardous)
  instead of raw resistance values
- BSEC state can be saved to NVS and restored after power cycle (continuity)
- No cloud dependency: inference runs on BME688 + BSEC stack on ESP32-S3

This aligns with LOT Systems' core principle: **the intelligence runs close to the person,
not in a remote datacenter.**

---

## 16 — DEVICE IDENTITY

```
PRODUCT NAME        LOT Computer
MODEL               LC-100 (100-unit pilot run)
SERIAL FORMAT       LOT-XXX (001–100)
CERTIFICATIONS      FCC Part 15 (via ESP32-S3 module cert), RoHS compliant
BATTERY TYPE        Li-Po 3.7V 150mAh (non-removable, Qi + USB-C charge)
OPERATING TEMP      0°C to +40°C
STORAGE TEMP        -20°C to +60°C
INGRESS             IPX4 (splash-resistant)
WARRANTY            12 months, LOT Systems
MADE IN             USA-designed · PCBWay-manufactured (Shenzhen)
```

---

## 17 — SESSION COMPRESSION SPECIFICATION

Each LOT Computer maintains a compressed session log that mirrors the LOT OS
session compression principle: **information density over raw volume.**

```
SESSION LIFECYCLE
  Boot          → new session ULID, battery% captured
  Active        → events appended to NVS ring buffer (max 500 events)
  Every 6h      → compress + transmit + clear buffer
  On WiFi drop  → buffer events, transmit on reconnect
  Daily 03:00   → forced flush (full session summary to LOT dashboard)

COMPRESSION RATIO (measured)
  Raw JSON 6-hour session:     ~800–1200 bytes
  GZIP level 6:                ~180–250 bytes
  Ratio:                       ~4.5–5×

DISPLAY SESSION STAT (idle screen, once per day)
  "Session 043 · 12 events · Logged 3 messages"
```

---

## 18 — CLOSING STATEMENT

The LOT Computer is the physical proof of a principle LOT Systems has held since
day one: self-awareness tools should work *for* the person, not *on* them.

A 40mm square of stainless steel that tells you "Coffee time!" from an AI that
knows your patterns, logs your moment of attention with a single button press,
reads your air quality, and charges itself wirelessly — that is not a gadget.

That is a behavioral node. A signal receiver and emitter in the network of
self-awareness that LOT Systems is building.

The LOT Computer is the hardware handshake between the LOT OS and the real world.

---

```
LOT SYSTEMS CORPORATION
LOT Computer — Physical Device Specification
v1.0 · 17 June 2026
Invented by: Vadim Marmeladov, COSMO® CIA
Made in the USA · brand.lot-systems.com
```
