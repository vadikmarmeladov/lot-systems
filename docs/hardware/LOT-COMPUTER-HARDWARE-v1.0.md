<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — PHYSICAL HARDWARE DEVICE
## Design Report · Component Buying List · Roadmap
## v1.0 — 22 June 2026

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   LOT SYSTEMS CORPORATION                                     ║
║   LOT COMPUTER — HARDWARE DEVICE SPECIFICATION                ║
║                                                               ║
║   COSMO® CIA — PHYSICAL INTELLIGENCE UNIT                     ║
║   100-UNIT PILOT RUN · PCBWAY MANUFACTURING                   ║
║                                                               ║
║   INVENTOR: Vadim Marmeladov                                  ║
║   CLASSIFICATION: PRODUCT DESIGN — PUBLIC ROADMAP             ║
║   DATE: 22 June 2026                                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## EXECUTIVE SUMMARY

The LOT Computer hardware device is a precision-machined stainless steel
notification terminal — a physical node of the LOT® intelligence network.
The size of a thick credit card (40 × 40 × 8mm), it receives autonomous
push notifications from lot-systems.com ("Coffee time!", daily insights,
QOS alerts) and answers back with a single button press that logs an event
to the user's LOT Log tab.

One face: mirror-polished 316L stainless steel. Blank. Authoritative.
Other face: 1" display, micro camera, one button, Qi wireless charging.

100 units. PCBWay PCBA + CNC. Ship 2027.

---

## SECTION 1 — DEVICE OVERVIEW

### 1.1 Identity

```
NAME:           LOT Computer — Physical Node (COSMO® CIA Unit)
SKU:            LOT-HW-001
FORM FACTOR:    40 × 40 × 8mm (40 × 40 × 5mm target stretch)
WEIGHT:         ~35g (steel + battery)
BODY:           316L stainless steel, CNC machined, 2-part sandwich
SIDE A (front): Mirror-polished SS, 8K finish — no markings
SIDE B (back):  Brushed SS — 1" OLED display, camera, 1 button
CHARGING:       Qi wireless, 5W
CONNECTIVITY:   WiFi 802.11 b/g/n + BLE 5.0
PILOT RUN:      100 units
MANUFACTURER:   PCBWay (PCB + PCBA + CNC enclosure)
```

### 1.2 Physical Concept

```
SIDE A — Mirror Polish (front face)
┌────────────────────────────┐
│                            │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  ← 316L SS, 8K mirror polish
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │    Ra ≤ 0.1μm
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │    No markings, no logo
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │    Qi coil behind (ferrite shielded)
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
└────────────────────────────┘

SIDE B — Functional (back face)
┌────────────────────────────┐
│  ○                         │  ← Camera (OV2640, top-left)
│       ┌──────────────┐     │
│       │  OLED 1.0"   │     │  ← Display (center)
│       │  Coffee time!│     │
│       │  ────────    │     │
│       └──────────────┘     │
│                    [●]     │  ← Copy button (bottom-right)
└────────────────────────────┘

EDGE PROFILE (8mm):
┌──────────────────────────────┐
│ SS │  PCB + battery + coil  │ SS │
│0.8 │         6.4mm          │0.8 │
└──────────────────────────────┘
```

### 1.3 User Flow

```
lot-systems.com → WebSocket push → LOT-HW-001 display wakes
                                         │
                              "Coffee time! ☕ 14:30"
                                         │
                              User sees notification
                                         │
                              User presses [Copy] button
                                         │
                              POST /api/hardware/log-event
                                         │
                              Log tab on lot-systems.com
                              receives timestamped entry:
                              "✓ Acknowledged: Coffee time!"
```

---

## SECTION 2 — HARDWARE SPECIFICATION

### 2.1 System-on-Chip

| Parameter | Specification |
|-----------|--------------|
| Part | Espressif ESP32-S3-MINI-1U-N8 |
| Core | Xtensa LX7 dual-core, 240 MHz |
| RAM | 512 KB SRAM + 8 MB PSRAM |
| Flash | 8 MB embedded |
| WiFi | 802.11 b/g/n 2.4 GHz |
| BLE | Bluetooth 5.0 LE |
| AI | Vector instructions (neural network acceleration) |
| Package | LGA, 15.4 × 11.3 × 1.0mm |
| Power | Deep sleep 7μA, active ~160mA |

The ESP32-S3's vector instructions accelerate on-device pattern recognition
for the BME688 environmental sensor AI profiles.

### 2.2 Display

| Parameter | Specification |
|-----------|--------------|
| Part | WiseChip UG-2828TSWFG01 (or SSD1327-based) |
| Type | OLED, 128 × 128 pixels |
| Size | 1.0" diagonal |
| Interface | SPI (4-wire) |
| Colors | Monochrome white or 16-gray-level |
| Power | ~20mA active, 0μA off (OLED self-emitting) |
| Viewing angle | 160° |
| Thickness | ~1.8mm |

Alternate: ER-OLED1.54-1 (1.54", 128×64) if space allows.
Display sits behind a sapphire glass window in the SS enclosure.

### 2.3 Camera

| Parameter | Specification |
|-----------|--------------|
| Part | OV2640 module with FPC ribbon (low-profile) |
| Resolution | 2MP (1600×1200 UXGA) |
| Interface | DVP (8-bit parallel) or SCCB |
| Size | 20 × 20 × 5mm (standard module) |
| Low-profile alternative | AiThinker OV2640 MINI (22 × 22 × 3.5mm) |
| Power | ~50mA active, <1mA standby |
| Purpose | Identity verification, document capture, visual log |

Note: Camera occupies a 22 × 22mm cutout region in the PCB layout.
A sapphire or Gorilla Glass lens cover is recessed into the SS body.

### 2.4 Environmental Sensor (AI-Grade)

| Parameter | Specification |
|-----------|--------------|
| Part | Bosch BME688 |
| Measures | Temperature, Humidity, Barometric Pressure, VOC Gas |
| AI Feature | BSEC 2.x software library — AI pattern classification |
| Interface | I²C or SPI |
| Package | LGA 3.0 × 3.0 × 0.93mm |
| Power | ~2.1μA in ultra-low-power mode |
| Accuracy | ±0.5°C temp / ±3% RH / ±0.6 hPa pressure |

The BME688's Bosch Sensortec Environmental Cluster (BSEC) AI library runs
directly on the ESP32-S3, classifying air quality patterns without cloud
dependency. This is what "AI-grade sensor" means here — on-device inference.

Data from the BME688 is included in every heartbeat payload sent to
lot-systems.com and displayed in the user's dashboard.

### 2.5 Wireless Charging

| Parameter | Specification |
|-----------|--------------|
| Standard | Qi 1.2.4, 5W |
| Receiver IC | Texas Instruments BQ51013B |
| Coil | Würth 760308103 (30 × 30mm, 8μH) |
| Ferrite sheet | TDK IFL12-0R5MH-T01 (30 × 30 × 0.5mm) |
| Efficiency | ~85% |
| Placement | Behind the mirror-polish SS face (Side A) |

Ferrite sheet between the Qi coil and the stainless steel back-plate is
mandatory — without it, eddy currents in the SS dissipate charging power
and generate heat. The ferrite shields the coil and focuses the field.

### 2.6 Battery

| Parameter | Specification |
|-----------|--------------|
| Type | Li-Polymer (LiPo) |
| Capacity | 200 mAh (30 × 30 × 2.5mm) |
| Nominal Voltage | 3.7V |
| Charge IC | Texas Instruments BQ24075 |
| Protection | Overcharge, overdischarge, short-circuit |
| Expected life | 3–7 days between charges (notification-only use) |
| Charge time | ~45 min on 5W Qi |

With ESP32-S3 in deep sleep (7μA) and waking for ~2s on each notification
(~150mA peak), a 200mAh battery sustains 150+ daily notifications.

### 2.7 "Copy" Button

| Parameter | Specification |
|-----------|--------------|
| Type | Tactile push button, IP54 rated |
| Part | Panasonic EVQQ2 or Alps SKTQ series |
| Travel | 0.15mm |
| Force | 180gf |
| Lifetime | 1,000,000 cycles |
| Mount | Surface-mount, PCB edge-aligned |
| Function | Acknowledge + log current notification to LOT Log tab |

### 2.8 Connectivity Stack

```
Layer        Component
──────────────────────────────────────────────────────
WiFi         ESP32-S3 integrated (2.4 GHz, WPA3)
BLE          ESP32-S3 integrated (BLE 5.0 for setup)
TLS          mbedTLS 3.x (built into ESP-IDF)
Protocol     WebSocket over TLS (WSS://)
API calls    HTTPS REST to lot-systems.com/api/hardware/*
Provisioning BLE GATT + LOT Companion App (first-time setup)
OTA          HTTPS OTA via ESP-IDF OTA partition scheme
```

---

## SECTION 3 — BILL OF MATERIALS (BOM)

### 3.1 Electronics BOM — Per Unit

| # | Component | Part Number | Supplier | Qty | Unit $ | Total $ |
|---|-----------|-------------|----------|-----|--------|---------|
| 1 | SoC — ESP32-S3-MINI-1U | ESP32-S3-MINI-1U-N8 | Digi-Key / Mouser | 1 | $3.80 | $3.80 |
| 2 | Display — 1.0" OLED 128×128 | ER-OLED1.0-1W | BuyDisplay / AliExpress | 1 | $6.50 | $6.50 |
| 3 | Camera — OV2640 mini module | OV2640-MINI | AiThinker (via LCSC) | 1 | $4.20 | $4.20 |
| 4 | Env. sensor — BME688 | BME688 | Digi-Key (Bosch) | 1 | $8.40 | $8.40 |
| 5 | Qi receiver IC — BQ51013B | BQ51013BRHLR | Digi-Key (TI) | 1 | $3.10 | $3.10 |
| 6 | Qi coil — 30×30mm | 760308103 | Mouser (Würth) | 1 | $1.90 | $1.90 |
| 7 | Ferrite sheet — 30×30mm | IFL12-0R5MH-T01 | Digi-Key (TDK) | 1 | $1.20 | $1.20 |
| 8 | Battery IC — BQ24075 | BQ24075RGTT | Digi-Key (TI) | 1 | $2.10 | $2.10 |
| 9 | LiPo 200mAh — 30×30×2.5mm | LP302530 | Adafruit / LCSC | 1 | $4.00 | $4.00 |
| 10 | Tactile button — IP54 | EVQQ2P03W | Digi-Key (Panasonic) | 1 | $0.45 | $0.45 |
| 11 | 3.3V LDO regulator | AP2112K-3.3TRG1 | Digi-Key | 1 | $0.35 | $0.35 |
| 12 | USB-C port (firmware flash only) | USB4115-GF-A | Digi-Key (GCT) | 1 | $0.85 | $0.85 |
| 13 | Crystal 40 MHz (ESP32-S3) | ABM3B-40.000MHZ | Digi-Key (Abracon) | 1 | $0.55 | $0.55 |
| 14 | Passives (caps, resistors, inductors) | Various | LCSC bulk | ~40 | $0.02 | $0.80 |
| 15 | FPC connector — camera | 0.5mm pitch, 24-pin | LCSC | 1 | $0.30 | $0.30 |
| 16 | Sapphire glass window (display) | Custom 25×25×0.5mm | Precision Optical | 1 | $3.50 | $3.50 |
| 17 | Camera lens cover (gorilla glass) | Custom 8×8mm | Custom | 1 | $1.20 | $1.20 |
| | **PCB (4-layer, 38×38mm, ENIG)** | **PCBWay** | **PCBWay** | **1** | **$2.80** | **$2.80** |
| | **Electronics subtotal (per unit)** | | | | | **~$46** |

### 3.2 Mechanical BOM — Per Unit

| # | Component | Material | Process | Supplier | Unit $ |
|---|-----------|----------|---------|----------|--------|
| 1 | Body — Side A (mirror polish) | 316L SS, 0.8mm shell + base plate | CNC + 8K polish | PCBWay CNC | $18.00 |
| 2 | Body — Side B (functional face) | 316L SS, 0.8mm | CNC + bead blast + cutouts | PCBWay CNC | $16.00 |
| 3 | Internal frame / standoffs | Aluminum 6061 | CNC milled | PCBWay CNC | $4.00 |
| 4 | M1.2 screws × 4 | Stainless steel | Standard | McMaster | $0.40 |
| 5 | Neoprene gasket | IP54 sealing | Die cut | Custom | $1.20 |
| 6 | Thermal pad (SOC → body) | Silicone, 0.5mm | Die cut | Digi-Key | $0.50 |
| | **Mechanical subtotal (per unit)** | | | | **~$40** |

### 3.3 Total Per-Unit Cost

```
Electronics:      ~$46
Mechanical:       ~$40
Assembly (PCBA):  ~$12  (PCBWay PCBA at 100 units)
Testing:          ~$5
Packaging:        ~$8   (premium box, magnetic closure)
─────────────────────────────
TOTAL COGS:       ~$111 per unit

Suggested retail: $299–$349
Target margin:    ~64–68%
```

### 3.4 100-Unit Run Total

```
Electronics (100 units):   ~$4,600
Mechanical (100 units):    ~$4,000
PCBA assembly:             ~$1,200
PCB setup + tooling:       ~$800   (one-time)
CNC tooling (SS body):     ~$1,500 (one-time fixture cost)
Testing jig:               ~$600   (one-time)
Packaging:                 ~$800
Engineering reserve (10%): ~$1,350
─────────────────────────────────────
TOTAL 100-UNIT RUN:        ~$14,850
```

---

## SECTION 4 — SUPPLIER LINKS & ORDERING

### 4.1 PCBWay (Primary Manufacturer)

```
Service           URL
─────────────────────────────────────────────────────────
PCB Fabrication   https://www.pcbway.com/orderonline.aspx
PCBA Service      https://www.pcbway.com/pcb-assembly.html
CNC Machining     https://www.pcbway.com/rapid-prototyping/manufacture/?type=3
Sheet Metal       https://www.pcbway.com/rapid-prototyping/manufacture/?type=10
3D Printing       https://www.pcbway.com/rapid-prototyping/manufacture/?type=5
```

PCBWay PCBA quote flow:
1. Upload Gerber files (PCB fabrication)
2. Upload BOM + centroid file (component placement)
3. Select "PCBWay sources components" or supply your own
4. Request 100-unit PCBA quote (expect 15–20 business day lead time)

PCBWay CNC for stainless steel:
- Material: SS316L
- Surface finish: Request "mirror polish Side A" + "bead blast Side B"
- Tolerances: ±0.05mm on feature dimensions
- Upload STEP/IGES files for 2-part body

### 4.2 Component Suppliers

| Supplier | URL | Use |
|----------|-----|-----|
| Digi-Key | https://www.digikey.com | ICs, passives, connectors |
| Mouser | https://www.mouser.com | Würth coils, Bosch sensors |
| LCSC | https://www.lcsc.com | Passives, FPC connectors, Chinese market |
| AiThinker | https://docs.ai-thinker.com | OV2640 camera modules |
| BuyDisplay | https://www.buydisplay.com | OLED display panels |
| Adafruit | https://www.adafruit.com | LiPo batteries, testing tools |
| McMaster-Carr | https://www.mcmaster.com | M1.2 screws, gasket material |

### 4.3 Key Component Digi-Key Part Numbers

| Component | Digi-Key PN | Est. Lead Time |
|-----------|-------------|----------------|
| ESP32-S3-MINI-1U-N8 | 2958-ESP32-S3-MINI-1U-N8-ND | In stock |
| BME688 | 828-BME688CT-ND | 2–4 weeks |
| BQ51013BRHLR | 296-45430-1-ND | In stock |
| BQ24075RGTT | 296-25552-1-ND | In stock |
| EVQQ2P03W | P12960CT-ND | In stock |
| USB4115-GF-A | 2073-USB4115-GF-A-ND | In stock |

---

## SECTION 5 — MECHANICAL DESIGN

### 5.1 Enclosure Specification

```
DIMENSION:       40.0 × 40.0 × 8.0mm (nominal)
                 40.0 × 40.0 × 5.0mm (target stretch — see notes)
MATERIAL:        316L Stainless Steel
SHELL THICKNESS: 0.8mm (minimum for rigidity with CNC mill)
CORNER RADIUS:   R3.0mm (all 4 corners)
SPLIT LINE:      At mid-height (4.0mm from each face)
FASTENERS:       4× M1.2 × 3.5mm SS countersunk screws
SEALING:         1.5mm neoprene gasket at split line (IP54)
```

### 5.2 Side A — Mirror Polish Face

```
Process:
1. CNC mill from SS316L billet
2. Internal pocket for PCB + Qi coil
3. 4× M1.2 threaded inserts (internal)
4. Mechanical polish: 180 → 320 → 600 → 1200 → 2000 grit
5. Final buff: 8K mirror finish (Ra ≤ 0.1μm)
6. No markings, no logo, no engravings (clean face)

Internal layout:
- Qi coil pocket: 32 × 32 × 1.5mm recessed
- Ferrite sheet: bonded with thermally-conductive adhesive
- 4× standoff bosses for PCB mounting
```

### 5.3 Side B — Functional Face

```
Process:
1. CNC mill from SS316L billet
2. Cutouts (precise dimensions):
   - Display window: 26 × 26mm, sapphire glass press-fit
   - Camera aperture: Ø8.0mm, gorilla glass insert
   - Button hole: Ø4.0mm, button stem flush with surface
3. Surface finish: #240 brushed (horizontal grain)
4. PVD coating option: Titanium nitride (gold) or DLC (black)

Cutout positions (from top-left):
- Camera aperture center: (7.0, 7.0)
- Display window center: (20.0, 22.0)
- Button center: (33.0, 35.0)
```

### 5.4 Engineering Note on 5mm vs 8mm

```
TARGET (5mm):    Achievable with flexible PCB + thin LiPo only
                 100mAh battery (1.5mm) — 1 day battery life
                 No USB-C port (wireless only)
                 Camera: requires custom ultra-thin module

PRACTICAL (8mm): Rigid 4-layer PCB + 200mAh LiPo (2.5mm)
                 USB-C port for firmware flashing
                 Standard OV2640 mini camera module
                 3–7 day battery life

RECOMMENDATION:  Pilot run at 8mm. Market 5mm version for v2.0.
```

---

## SECTION 6 — PCB DESIGN SPECIFICATION

### 6.1 PCB Parameters

```
DIMENSIONS:      38.0 × 38.0mm (2.0mm clearance from SS body edge)
LAYERS:          4 (signal / ground / power / signal)
THICKNESS:       0.8mm (ultra-thin 4-layer)
COPPER:          1 oz (35μm) outer layers
SURFACE FINISH:  ENIG (Electroless Nickel Immersion Gold)
SILKSCREEN:      Top only, white
SOLDERMASK:      Green (or black for aesthetics)
MIN TRACE:       4 mil / 4 mil (0.1mm)
MIN VIA:         0.2mm drill / 0.4mm pad
IMPEDANCE:       50Ω controlled (WiFi antenna trace)
```

### 6.2 Component Placement Strategy

```
PCB TOP SIDE (components):
┌──────────────────────────────────────────┐
│  [CAM]      [ESP32-S3]   [BME688]        │
│  FPC conn   (center)     (corner, vent)  │
│                                           │
│  [BQ51013B]  [OLED FPC]  [BQ24075]       │
│                                           │
│  [BATT+]              [BATT-]            │
│  LiPo pads    [USB-C]    charge pads     │
│                 edge                      │
│         [Button pad]  (edge-aligned)     │
└──────────────────────────────────────────┘

PCB BOTTOM SIDE:
- All passive bypass capacitors (0402)
- Ferrite beads for power filtering
- Crystal + load caps
- Keep WiFi antenna area clear (copper-free zone)
```

### 6.3 Antenna

The ESP32-S3-MINI-1U uses an external U.FL antenna. The stainless steel
body must have a small RF window or the antenna must be positioned to face
through the internal frame gap at the split line.

Option: 2.4 GHz ceramic chip antenna (TDK TF356044) soldered directly to
PCB, positioned at the split-line gap in the SS body where RF can escape.

---

## SECTION 7 — FIRMWARE ARCHITECTURE

### 7.1 Firmware Stack

```
RTOS:            FreeRTOS (via ESP-IDF v5.x)
SDK:             ESP-IDF v5.2+ (Espressif IoT Development Framework)
Language:        C / C++
Build system:    CMake (idf.py build)
OTA:             ESP-IDF OTA via HTTPS (dual partition scheme)
Crypto:          mbedTLS 3.x (TLS 1.3)
WiFi:            esp_wifi component
BLE:             NimBLE (lightweight BLE stack)
Display driver:  SSD1327 / custom SPI driver
Camera driver:   esp32-camera component (Espressif)
BME688 driver:   Bosch BSEC 2.x library (binary, ESP32 port)
```

### 7.2 Firmware Modules

```
firmware/
├── main/
│   ├── main.c                  — Entry point, task init
│   ├── config.h                — Pin definitions, constants
│   ├── wifi_manager.c/h        — WiFi connect, reconnect logic
│   ├── ble_provisioning.c/h    — First-time WiFi setup via BLE
│   ├── websocket_client.c/h    — WSS connection to lot-systems.com
│   ├── rest_client.c/h         — HTTPS REST for button events
│   ├── display.c/h             — OLED render engine
│   ├── camera.c/h              — OV2640 capture + JPEG encode
│   ├── button.c/h              — Debounce, interrupt, long-press
│   ├── bme688.c/h              — Sensor read + BSEC AI processing
│   ├── power.c/h               — Deep sleep, wake on notification
│   ├── ota.c/h                 — OTA update check + apply
│   ├── storage.c/h             — NVS: tokens, WiFi creds, device ID
│   └── lot_api.c/h             — LOT API protocol implementation
├── components/
│   ├── esp32-camera/           — Espressif camera component
│   └── bsec_library/           — Bosch BSEC 2.x (pre-compiled)
├── sdkconfig                   — ESP-IDF configuration
└── CMakeLists.txt
```

### 7.3 Power State Machine

```
States:
  DEEP_SLEEP  ─── WebSocket push ──→  ACTIVE
  DEEP_SLEEP  ─── Timer (60 min) ──→  HEARTBEAT
  ACTIVE      ─── 30s idle       ──→  DEEP_SLEEP
  HEARTBEAT   ─── send sensor data ─→ DEEP_SLEEP
  ACTIVE      ─── button press   ──→  LOG_EVENT → DEEP_SLEEP

DEEP_SLEEP current:   ~7μA (ULP + RTC memory)
ACTIVE current:       ~160mA (WiFi + display on)
HEARTBEAT current:    ~80mA (WiFi + BME688, no display)

Battery life (200mAh):
  20 notifications/day × 3s each + 24 heartbeats/day:
  ≈ 5–7 days per charge
```

### 7.4 Boot Sequence

```
1. Power on / wake from deep sleep
2. Check NVS: device_id, auth_token, wifi_ssid/pass
3. If no credentials → BLE provisioning mode (display: "Setup mode")
4. Connect WiFi → verify TLS cert → open WebSocket to lot-systems.com
5. Subscribe to notification channel (device_id)
6. Enter ACTIVE state — display last notification
7. Wait for push or button or 30s timeout → DEEP_SLEEP
```

### 7.5 Firmware Documents Structure

```
docs/hardware/firmware/
├── FW-001-ARCHITECTURE.md       — This section (overview)
├── FW-002-BUILD-GUIDE.md        — How to compile and flash
├── FW-003-PROVISIONING.md       — BLE setup flow
├── FW-004-API-PROTOCOL.md       — LOT API wire format
├── FW-005-OTA-PROCEDURE.md      — Over-the-air update steps
├── FW-006-POWER-MANAGEMENT.md   — Sleep states, wake sources
├── FW-007-BME688-BSEC.md        — AI sensor integration
├── FW-008-TESTING.md            — Factory test procedure
└── FW-009-CHANGELOG.md          — Firmware version history
```

---

## SECTION 8 — LOT API INTEGRATION

### 8.1 API Connector Overview

The physical device communicates with lot-systems.com via two channels:

```
INBOUND  (server → device):  WebSocket push notifications
OUTBOUND (device → server):  HTTPS REST API calls
```

### 8.2 Authentication

```
Flow:
1. Device provisioned with user's LOT account (BLE setup)
2. Server generates device JWT (deviceToken, 90-day expiry)
3. Token stored in ESP32-S3 NVS encrypted flash partition
4. All requests carry: Authorization: Bearer <deviceToken>
5. Device identified by: X-Device-ID: <uuid4>

Token refresh: device requests new token 7 days before expiry
via POST /api/hardware/refresh-token
```

### 8.3 WebSocket Protocol

```
Endpoint: wss://lot-systems.com/api/hardware/ws

Connect handshake:
  GET /api/hardware/ws
  Upgrade: websocket
  Authorization: Bearer <deviceToken>
  X-Device-ID: <uuid>

Server message format (JSON):
{
  "type": "notification",
  "id": "notif_uuid",
  "text": "Coffee time! ☕",
  "priority": "normal",       // normal | urgent | silent
  "timestamp": "2026-06-22T14:30:00Z",
  "source": "scheduled_job",  // who triggered it
  "ttl": 3600                 // seconds to show
}

Device ACK:
{
  "type": "ack",
  "notification_id": "notif_uuid",
  "device_id": "<uuid>",
  "received_at": "2026-06-22T14:30:02Z"
}

Heartbeat (device → server, every 60 min):
{
  "type": "heartbeat",
  "device_id": "<uuid>",
  "battery_pct": 84,
  "sensor": {
    "temperature_c": 22.4,
    "humidity_pct": 48.2,
    "pressure_hpa": 1013.1,
    "iaq_score": 72,          // BME688 IAQ index (0-500)
    "iaq_accuracy": 3         // 0-3, 3=fully calibrated
  },
  "wifi_rssi": -62,
  "uptime_s": 3600,
  "fw_version": "1.0.3"
}
```

### 8.4 Copy Button Event — REST API

```
Endpoint: POST /api/hardware/log-event

Request:
  Content-Type: application/json
  Authorization: Bearer <deviceToken>
  X-Device-ID: <uuid>

  {
    "event_type": "copy_button",
    "notification_id": "notif_uuid",    // notification being acknowledged
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

Server side effect:
  → Creates entry in user's Log tab:
    "[14:31] HW: ✓ Coffee time! — acknowledged from device"
  → Badge trigger: "physical_log_event" signal emitted to QIE
```

### 8.5 New Server Endpoints Required

These endpoints need to be added to the LOT Computer backend:

```
POST   /api/hardware/register          — Register new device to user account
POST   /api/hardware/refresh-token     — Rotate device JWT
GET    /api/hardware/ws                — WebSocket upgrade
POST   /api/hardware/log-event         — Copy button → Log tab
GET    /api/hardware/devices           — List user's registered devices
DELETE /api/hardware/devices/:id       — Deregister device
POST   /api/hardware/send-notification — Admin: push notification to device
```

### 8.6 Site Integration — Log Tab

When a user presses the Copy button, the Log tab on lot-systems.com shows:

```
[Physical Node]  14:31:07
✓ Coffee time! — acknowledged
🌡 22.4°C · 💧 48% RH · 🌬 IAQ 72 (Good)
📍 Device: LOT-HW-001 · Battery: 84%
```

The QIE picks up `physical_log_event` as a behavioral signal, contributing
to the user's engagement patterns and Benchmark score.

---

## SECTION 9 — WIRELESS CHARGER

### 9.1 Charging Pad Specification

```
NAME:            LOT Charge Base
STANDARD:        Qi 1.2.4, 5W single-coil
DESIGN:          Flat circle, Ø80mm × 8mm
MATERIAL:        Aluminum 6061, anodized silver
TOP SURFACE:     Soft-touch matte silicone pad (non-slip)
STATUS LED:      Single RGB LED (charging = amber, full = green)
INPUT:           USB-C, 9V/1A PD or 5V/2A standard
OUTPUT COIL:     Würth 760308102 (transmitter, Ø60mm)
DRIVER IC:       IDT P9038 or STWBC2-HP
CABLE:           1.5m braided USB-C cable, included
```

### 9.2 Charger BOM (per unit)

| Component | Part | Supplier | Unit $ |
|-----------|------|----------|--------|
| Transmitter IC | IDT P9038 | Digi-Key | $3.20 |
| Tx coil 60mm | 760308102 | Mouser (Würth) | $2.40 |
| MCU (LED control) | STM8S003 | LCSC | $0.45 |
| USB-C receptacle | USB4115-GF-A | Digi-Key | $0.85 |
| 10W power supply | Internal 9V/1.1A | LCSC | $2.10 |
| Aluminum body | CNC 6061 | PCBWay CNC | $12.00 |
| Silicone pad | Die cut | Custom | $1.20 |
| USB-C cable | 1.5m braided | LCSC / Amazon | $2.50 |
| PCB (2-layer) | 80×80mm round | PCBWay | $1.80 |
| Assembly | — | PCBWay PCBA | $4.00 |
| Packaging | Box + insert | Custom | $3.00 |
| **Total charger unit** | | | **~$33.50** |

The charger is sold separately ($79) or bundled with device ($359 bundle).

---

## SECTION 10 — NOTIFICATIONS SYSTEM

### 10.1 Notification Sources

Notifications pushed from lot-systems.com to the device come from these sources:

```
Source                    Example
──────────────────────────────────────────────────────────
Scheduled jobs            "Coffee time! ☕ 14:30"
QOS alerts                "QOS: Your focus is dropping. Breathe."
Streak milestones         "🔥 Day 45 streak — keep going!"
Calendar reminders        "Meeting in 15 min: Weekly Review"
Benchmark updates         "Your benchmark moved to Purple tier ◆"
Custom user rules         User-defined triggers from Log tab
Weather integration       "Rain forecast. Bring umbrella. 🌧"
BME688 air quality        "Air quality poor — IAQ 180. Open window."
```

### 10.2 Display Layout

```
OLED 128×128 — notification display:

Line 1 (small, 8px):   "14:30 · LOT"
Line 2 (large, 24px):  "Coffee time!"
Line 3 (small, 8px):   "☕ scheduled"
Line 4 (small, 8px):   "[ Press to log ]"

Idle / sleep screen:    Blank (OLED power off)
Charging indicator:     ⚡ 84% in top-right corner
```

### 10.3 Session Compression

Each notification session compresses data before transmission:

```
Session = 1 hour of notifications + sensor readings
Compression: gzip (ESP-IDF miniz library)
Typical raw:        2–8 KB per session
After compression:  0.3–1.2 KB per session
Transport:          WSS binary frame

Session payload:
{
  "session_id": "uuid",
  "start": "2026-06-22T14:00:00Z",
  "end": "2026-06-22T15:00:00Z",
  "notifications": [...],
  "sensor_readings": [...],   // one per minute
  "events": [...]             // button presses, etc.
}
```

---

## SECTION 11 — 100-UNIT PILOT RUN PLAN

### 11.1 Manufacturing Phases

```
Phase       Activity                              Duration    Cost
─────────────────────────────────────────────────────────────────────
M1          PCB Gerber + BOM finalized            1 week      —
M2          PCBWay PCB prototype (5 units)        2 weeks     $300
M3          Firmware alpha on prototype           2 weeks     —
M4          CNC body prototype (5 units)          3 weeks     $800
M5          Fit-up test, revision                 1 week      —
M6          PCBWay PCBA quote + order (100 units) 1 week      $14,850
M7          PCBA production                       3–4 weeks   (included)
M8          CNC SS body production (100 units)    4 weeks     (included)
M9          Final assembly + testing              2 weeks     —
M10         Packaging + shipping                  1 week      —
─────────────────────────────────────────────────────────────────────
TOTAL TIMELINE:                                   ~20 weeks   ~$15,950
ESTIMATED START:    July 2026
ESTIMATED SHIP:     November 2026
```

### 11.2 Quality Checks per Unit

```
01  Power-on test (3.7V LiPo)
02  WiFi connectivity test (scan for APs)
03  BLE advertisement test (provisioning beacon)
04  Display test (full-white, full-black, checkerboard)
05  Camera capture test (JPEG at 640×480)
06  BME688 sensor read (valid temperature in range 15–35°C)
07  Button press test (interrupt fires within 5ms)
08  Qi charging test (charge starts within 3s on pad)
09  OTA test (fetch firmware manifest, parse OK)
10  LOT API handshake (WebSocket connect + auth)
11  Full notification cycle (receive, display, button, log)
12  Deep sleep test (current < 10μA after 30s idle)
13  Visual inspection (SS polish, glass alignment, no scratches)
14  Weight check (35g ± 2g)
```

---

## SECTION 12 — DOCUMENT STRUCTURE

This hardware project produces the following separate documents:

```
docs/hardware/
├── LOT-COMPUTER-HARDWARE-v1.0.md      — This document (master design report)
│
├── firmware/
│   ├── FW-001-ARCHITECTURE.md         — Firmware system design
│   ├── FW-002-BUILD-GUIDE.md          — Compile, flash, debug
│   ├── FW-003-PROVISIONING.md         — BLE WiFi setup flow
│   ├── FW-004-API-PROTOCOL.md         — WebSocket + REST wire format
│   ├── FW-005-OTA-PROCEDURE.md        — OTA update steps
│   ├── FW-006-POWER-MANAGEMENT.md     — Deep sleep + wake sources
│   ├── FW-007-BME688-BSEC.md         — AI sensor + BSEC 2.x
│   ├── FW-008-TESTING.md              — Factory test procedure
│   └── FW-009-CHANGELOG.md            — Firmware version history
│
├── software/
│   ├── SW-001-API-ENDPOINTS.md        — Server-side API spec
│   ├── SW-002-WEBSOCKET-SERVER.md     — WS server implementation guide
│   ├── SW-003-COMPANION-APP.md        — Mobile/web provisioning app
│   ├── SW-004-NOTIFICATION-ENGINE.md  — Push notification scheduler
│   └── SW-005-LOG-TAB-INTEGRATION.md  — How events appear in Log tab
│
├── mechanical/
│   ├── MECH-001-BODY-DRAWING.md       — Dimensions + tolerances
│   ├── MECH-002-PCBWAY-CNC-BRIEF.md  — CNC order instructions
│   ├── MECH-003-ASSEMBLY-SOP.md       — Hand assembly procedure
│   └── MECH-004-FINISH-SPEC.md        — Polish + surface finish spec
│
├── manuals/
│   ├── USER-MANUAL-v1.0.md            — End-user manual (→ PDF)
│   ├── QUICK-START-v1.0.md            — 1-page quick start (→ PDF)
│   ├── FIRMWARE-MANUAL-v1.0.md        — Firmware tech manual (→ PDF)
│   ├── API-MANUAL-v1.0.md             — API integration manual (→ PDF)
│   └── SERVICE-MANUAL-v1.0.md         — Repair + service guide (→ PDF)
│
└── pdf/
    └── (generated PDFs from above manuals, using pandoc)
```

### 12.1 PDF Generation Command

```bash
# Install pandoc + wkhtmltopdf
pandoc docs/hardware/manuals/USER-MANUAL-v1.0.md \
  --pdf-engine=wkhtmltopdf \
  --variable margin-top=25mm \
  --variable margin-bottom=25mm \
  --variable margin-left=20mm \
  --variable margin-right=20mm \
  -o docs/hardware/pdf/LOT-USER-MANUAL-v1.0.pdf
```

---

## SECTION 13 — ROADMAP

### 13.1 Project Phases

```
PHASE 0 — DESIGN (NOW — Aug 2026)
  ✓ Hardware specification (this document)
  ✓ BOM + supplier selection
  □ Schematic capture (KiCad)
  □ PCB layout (KiCad)
  □ 3D mechanical model (Fusion 360 / STEP)
  □ Firmware skeleton (ESP-IDF project init)
  □ LOT API endpoint design
  □ PCBWay RFQ submission

PHASE 1 — PROTOTYPE (Sep — Oct 2026)
  □ 5-unit PCB order from PCBWay
  □ Hand-solder prototype boards
  □ Firmware alpha — WiFi + display working
  □ CNC body prototype × 5 (PLA print first, then SS)
  □ Fit and finish test
  □ BME688 BSEC calibration cycle (28-day minimum)
  □ API endpoint implementation (backend)
  □ WebSocket notification delivery end-to-end test

PHASE 2 — PILOT PRODUCTION (Nov — Dec 2026)
  □ PCBWay PCBA order — 100 units
  □ PCBWay CNC SS body order — 100 units
  □ QC + test jig build
  □ 100-unit test cycle (12-point checklist)
  □ Packaging design + print
  □ PDF manual generation

PHASE 3 — SHIP (Jan 2027)
  □ Ship to first 100 LOT users (Purple tier priority)
  □ Firmware OTA channel live
  □ Monitoring dashboard for fleet (battery, online, sensor)
  □ User feedback → v1.1 firmware

PHASE 4 — V2 PLANNING (Q2 2027)
  □ 5mm target form factor
  □ LTE-M / NB-IoT cellular (no WiFi dependency)
  □ Color e-ink display
  □ Fingerprint sensor (identity gate for COSMO® eligibility)
  □ 1,000-unit run
```

### 13.2 Milestone Chart

```
2026  Jul  Aug  Sep  Oct  Nov  Dec
      ████ ████ ░░░░ ░░░░ ░░░░ ░░░░  Phase 0 — Design
                ████ ████           Phase 1 — Prototype
                          ████ ████ Phase 2 — Pilot Production

2027  Jan  Feb  Mar  Apr
      ████                          Phase 3 — Ship v1.0
           ░░░░ ░░░░ ░░░░           Phase 4 — V2 Planning
```

---

## SECTION 14 — TECHNOLOGY RISK REGISTER

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| 5mm height unachievable | High | Medium | Ship 8mm v1, design 5mm for v2 |
| SS body blocks WiFi | Medium | High | Antenna at split-line gap; test early |
| SS body blocks Qi charging | Medium | High | Ferrite sheet required; validate in prototype |
| OV2640 too thick | Medium | Medium | Alternate: ultra-thin FPC camera sensor only |
| BME688 BSEC calibration time | Low | Low | 28-day factory pre-calibration before ship |
| PCBWay CNC lead time | Medium | Medium | Order CNC body in parallel with PCBA, not sequentially |
| BLE provisioning UX | Low | Medium | Build companion web page (no app download needed) |
| WebSocket connection drops | Low | High | Auto-reconnect with exponential backoff + offline queue |
| Battery degradation | Low | Low | Li-poly with protection IC; 500-cycle rated cells |

---

## SECTION 15 — BRAND ALIGNMENT

```
DESIGN LANGUAGE:
  Mirror-polish SS face   → Authority, precision, silence
  Brushed functional face → Utility, honesty, directness
  Single button           → One action, zero ambiguity
  No logo on body         → Confidence without decoration

COSMO® CIA CONNECTION:
  Physical node of the LOT behavioral network
  Carries user's session data physically into the world
  Button press = physical signal into digital Log
  Sensor data = ambient context for QIE pattern recognition

LOT® VALUES:
  "An action that cannot be seen did not happen."
  → Every button press is logged, timestamped, attributed
  → Every notification is ACK'd and recorded in the ledger

FIRST 100 USERS:
  Purple-tier Benchmark holders get priority access
  Physical device as proof of sustained engagement
  Deepens the behavioral signal: device-logged events
  feed back into the Quantum Intent Engine
```

---

## SESSION NOTES

This document was produced in a single remote session on 22 June 2026.

The hardware specification is at design-complete status. Next immediate actions:
1. Open KiCad — begin schematic from this BOM
2. Submit PCBWay prototype inquiry (5-unit, no assembly)
3. Add `/api/hardware/*` route stubs to the LOT backend
4. Create `docs/hardware/firmware/` stub documents

The 100-unit pilot run cost (~$15,000) is within reach as a pre-IPO
product development expense. At $299 retail, 100 units = $29,900 revenue,
recovering costs and validating market demand before the $4/share offering.

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  LOT SYSTEMS CORPORATION                                      ║
║  LOT COMPUTER — HARDWARE DEVICE SPECIFICATION                 ║
║  v1.0 — 22 June 2026                                         ║
║  COSMO® CIA — PHYSICAL INTELLIGENCE UNIT                      ║
║  MADE IN THE USA                                              ║
║                                                               ║
║  Vadim Marmeladov — Inventor, CEO LOT®                        ║
║  Kuzya Cosmo Marmeladov — CEO COSMO®                          ║
║                                                               ║
║  40 × 40 × 8mm. Mirror polish. One button. All signal.        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```
