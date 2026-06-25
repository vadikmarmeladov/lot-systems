# LOT COSMO CIA — Hardware Computer Specification v1.0

**DOCUMENT:** LOT-HW-SPEC-20260625-v1.0  
**CLASS:** RESTRICTED // S-2 EYES  
**S-2:** VADIK MARMELADOV  
**DATE:** 2026-06-25  
**STATUS:** SPECIFICATION — READY FOR PCBWay NRE

---

## 1. EXECUTIVE SUMMARY

COSMO CIA is a purpose-built hardware intelligence terminal for LOT Systems operators. It connects wirelessly to lot-systems.com, displays autonomous AI-generated notifications on an integrated OLED screen, and captures environmental and visual data via onboard AI-grade sensors and camera. A dedicated "Copy" button transmits a signal burst to the LOT Log tab in real time. The device charges wirelessly via Qi standard.

**Form factor:** 40 × 40 × 7mm (Phase 1, 100-unit run) → 40 × 40 × 5mm (Phase 2)  
**Body:** 316L stainless steel, 2-part CNC machined  
**Side A:** Mirror-polished SS (Qi receiver concealed beneath)  
**Side B:** 1.3" OLED + 5MP camera + Copy button (brushed SS frame)  
**Production target:** 100 units via PCBWay  
**Connectivity:** Wi-Fi 802.11 b/g/n + BLE 5.0 via LOT API

---

## 2. DEVICE ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                  SIDE B (Operator Face)              │
│  ┌──────────┐   ┌─────────────────────────────┐    │
│  │  OV5640  │   │   1.3" OLED SH1106          │    │
│  │  Camera  │   │   128×64px  30×17mm         │    │
│  │  5MP AF  │   │   Notifications / Status    │    │
│  └──────────┘   └─────────────────────────────┘    │
│                   ┌─────────────────┐               │
│                   │  [COPY] Button  │               │
│                   │  Tactile SMD    │               │
│                   └─────────────────┘               │
└─────────────────────────────────────────────────────┘

     ← 40mm →
  ┌────────────┐ ─── Side B: Brushed SS frame (1mm)
  │  PCB Stack │ ─── 4-layer PCB + components (5mm)
  └────────────┘ ─── Side A: Polished SS plate (1mm)
     7mm total height (Phase 1)

┌─────────────────────────────────────────────────────┐
│                  SIDE A (Mirror Face)                │
│       316L Stainless Steel — Mirror Polish           │
│       Qi Wireless Charging Coil embedded             │
│       No visible features.                           │
└─────────────────────────────────────────────────────┘
```

### 2.1 PCB Stack (inside body)

```
Layer 1 (Top):    Signal + Components (ESP32-S3, sensors, OLED connector)
Layer 2:          Ground plane
Layer 3:          Power plane (3.3V / 1.8V rails)
Layer 4 (Bottom): Signal + Camera connector + Qi coil interface
```

### 2.2 Internal Layout (40×40mm PCB)

```
┌────────────────────────────────────────────────────┐
│ ┌──────────┐  ┌─────────────────────────────────┐  │
│ │ OV5640   │  │         ESP32-S3-WROOM-1        │  │
│ │ Camera   │  │         18.5 × 17.5mm            │  │
│ │ connector│  │         Wi-Fi + BLE + AI         │  │
│ └──────────┘  └─────────────────────────────────┘  │
│                                                     │
│ ┌────────────┐  ┌────────────┐  ┌────────────────┐ │
│ │  BME688    │  │  APDS-9960 │  │  LP4078120     │ │
│ │ Env Sensor │  │ Prox/Gest  │  │  LiPo 380mAh  │ │
│ └────────────┘  └────────────┘  └────────────────┘ │
│                                                     │
│ ┌───────────────────────────────────────────────┐  │
│ │  OLED FPC connector    [BTN]   [Qi IC IP5306] │  │
│ └───────────────────────────────────────────────┘  │
│                  [Qi Coil FPC — bottom side]        │
└────────────────────────────────────────────────────┘
```

---

## 3. BILL OF MATERIALS — 100-UNIT RUN

### 3.1 Core Electronics

| # | Component | Spec | Qty | Unit $ | 100-Unit $ | Source |
|---|-----------|------|-----|--------|------------|--------|
| 1 | ESP32-S3-WROOM-1-N8R8 | MCU: Xtensa LX7 dual-core 240MHz, Wi-Fi + BLE5, 8MB Flash, 8MB PSRAM | 100 | $3.80 | $380 | LCSC C3019571 |
| 2 | OV5640 Camera Module | 5MP, AF, 1/4" CMOS, MIPI CSI-2, 36×36×5.5mm module | 110 | $4.50 | $495 | LCSC / AliExpress |
| 3 | 1.3" OLED SH1106 | 128×64px, SPI, 30×27mm active, 3.3V, white | 110 | $2.80 | $308 | LCSC C409763 |
| 4 | BME688 | Bosch AI env sensor: temp/humidity/pressure/gas/VOC, I²C | 110 | $6.50 | $715 | LCSC C3304224 |
| 5 | APDS-9960 | Avago/Broadcom: proximity + gesture + RGB color, I²C | 110 | $3.20 | $352 | LCSC C115438 |
| 6 | ICM-42688-P | TDK 6-axis IMU (accel + gyro), AI-grade, SPI/I²C | 110 | $2.90 | $319 | LCSC C3001082 |
| 7 | IP5306 | Qi + 5V/3A boost + LiPo charger + fuel gauge IC | 110 | $0.80 | $88 | LCSC C181692 |
| 8 | WR-WCR-2616M | Würth Qi 5W receiver coil, 5W max, 26×16mm | 110 | $1.80 | $198 | Mouser 710-7480026160 |
| 9 | LP401740 | Thin LiPo cell, 3.7V, 380mAh, 4.0×17×40mm (custom flat) | 110 | $3.20 | $352 | GREPOW / LCSC |
| 10 | TPS63036 | TI buck-boost, 3.3V regulated output, 1A | 110 | $1.60 | $176 | LCSC C3005 |
| 11 | SW-PUSH-SMD-4 | Tactile push button 4×4mm SMD, 200gf actuation | 110 | $0.12 | $13 | LCSC C138519 |
| 12 | APA2C-LED-RGB | Status LED RGB SMD 0603 (optional corner indicator) | 110 | $0.08 | $8 | LCSC |
| 13 | Passive components | Capacitors/resistors/inductors (BOM on PCB schematic) | lot | $0.80 | $88 | LCSC |

**Electronics subtotal (100 units): ~$3,492**

### 3.2 PCB and Assembly

| # | Item | Spec | 100-Unit $ | Source |
|---|------|------|------------|--------|
| 14 | PCB Fabrication | 4-layer, FR4, 40×40mm, 1oz copper, ENIG finish, SMD+BGA | $420 | PCBWay |
| 15 | PCBA Service | SMT assembly, 100 boards, stencil included | $680 | PCBWay |
| 16 | FPC Camera Cable | 24-pin, 0.5mm pitch, 50mm length, custom | $120 | PCBWay |
| 17 | FPC OLED Cable | 14-pin, 0.5mm pitch, 30mm length | $80 | PCBWay |

**PCB/Assembly subtotal: ~$1,300**

### 3.3 Mechanical — Stainless Steel Body

| # | Part | Spec | 100-Unit $ | Source |
|---|------|------|------------|--------|
| 18 | Body Part A — Back Plate | SS316L, 40×40×1.0mm, mirror-polish (Ra ≤0.05μm), Qi coil pocket milled | $1,200 | PCBWay CNC |
| 19 | Body Part B — Front Frame | SS316L, 40×40×6.0mm, brushed #8 finish, camera aperture + display window + button cutout CNC | $1,400 | PCBWay CNC |
| 20 | Optical glass lens cover | Sapphire glass 38×38×0.5mm, AR-coated, for display window | $400 | Custom |
| 21 | Silicone gasket ring | IP54 seal between Part A and Part B | $80 | Custom mold |
| 22 | M1.2 screws × 4 | SS316, countersunk, 3mm length, internal assembly | $40 | Alibaba |
| 23 | Camera lens bezel | Machined SS316L, M7 thread, 8mm OD, part of Body B | included | PCBWay CNC |

**Mechanical subtotal: ~$3,120**

### 3.4 Packaging and Accessories

| # | Item | Spec | 100-Unit $ | Source |
|---|------|------|------------|--------|
| 24 | Qi charging pad | 10W, USB-C input, 100×100mm round, custom branded | $680 | OEM |
| 25 | Retail box | Rigid magnetic-close box, matte black, 80×80×20mm | $280 | Box supplier |
| 26 | Quick start card | 85×54mm, double-sided, 350gsm | $60 | Printer |
| 27 | USB-C cable (for pad) | 0.5m, braided, branded | $120 | OEM |

**Packaging subtotal: ~$1,140**

### 3.5 Total BOM Cost Summary

| Category | 100-Unit Total |
|----------|----------------|
| Electronics | $3,492 |
| PCB + Assembly | $1,300 |
| Mechanical SS Body | $3,120 |
| Packaging + Charger | $1,140 |
| **Subtotal BOM** | **$9,052** |
| Yield buffer 10% | $905 |
| **Total BOM (100 units)** | **~$9,957** |
| **Per-unit BOM cost** | **~$100** |

### 3.6 Non-Recurring Engineering (NRE) — One-Time

| Item | Cost |
|------|------|
| PCB schematic + layout design | $1,800 |
| SS body CNC setup + fixtures | $800 |
| Firmware development | (this session — sunk) |
| Test jig fabrication | $500 |
| FCC Part 15 certification | $4,500 |
| CE marking (EU) | $3,000 |
| **Total NRE** | **~$10,600** |

**Total first-run investment: ~$20,557 for 100 units → ~$206/unit fully loaded**

---

## 4. PCBWay MANUFACTURING GUIDE

### 4.1 PCB Order Specifications

```
URL:        https://www.pcbway.com/
Service:    Standard PCB + PCBA
Layers:     4
Dimensions: 40 × 40 mm
Thickness:  1.0 mm
Copper:     1 oz (35 μm) outer / 0.5 oz inner
Finish:     ENIG (Electroless Nickel Immersion Gold)
Solder mask: Matte black
Silkscreen:  White (top only)
Min trace:   0.1mm / 0.1mm space
Min via:     0.3mm drill / 0.5mm pad
IPC Class:   IPC-6012 Class 2
Quantity:    110 (10 spares for testing)
```

**PCBWay PCB quote URL:** https://www.pcbway.com/orderonline.aspx  
**PCBWay PCBA:** https://www.pcbway.com/pcba-service/  

### 4.2 CNC Machining Order — SS Body

**URL:** https://www.pcbway.com/rapid-prototyping/manufacture/

```
Material:       316L Stainless Steel
Tolerance:      ±0.05mm (critical fit areas), ±0.1mm (general)
Surface finish:
  Part A (back): Mirror polish Ra ≤ 0.05μm (#8 finish)
  Part B (front): Brushed satin Ra ≈ 0.8μm (#4 finish)
Quantity:        110 sets (Part A + Part B each)
Assembly fit:    Snap-fit + M1.2 recessed screws

Critical dimensions:
  Camera aperture:   8.0 × 8.0mm, centered at top-center
  Display window:    31 × 18mm, centered at mid-face
  Button cutout:     7mm diameter, centered at bottom-center
  Qi coil pocket:    28 × 18mm × 0.5mm deep (Part A interior)
  PCB ledge:         38.0 × 38.0mm × 0.5mm step
```

### 4.3 Design Files Required for PCBWay

- `gerber/` — Gerber files (RS-274X format, all layers zipped)
- `bom/LOT-COSMO-BOM-v1.0.csv` — LCSC part numbers for PCBA
- `cpl/LOT-COSMO-CPL-v1.0.csv` — Component placement list (X/Y/rotation)
- `step/LOT-COSMO-BODY-A.step` — Part A 3D model
- `step/LOT-COSMO-BODY-B.step` — Part B 3D model
- `dxf/LOT-COSMO-BODY-A.dxf` — Part A 2D drawing
- `dxf/LOT-COSMO-BODY-B.dxf` — Part B 2D drawing

---

## 5. SENSOR SPECIFICATIONS

### 5.1 BME688 — AI Environmental Sensor (Primary)

**Manufacturer:** Bosch Sensortec  
**LCSC:** C3304224  
**Protocol:** I²C (0x76/0x77) or SPI  

| Parameter | Range | Accuracy |
|-----------|-------|----------|
| Temperature | -40 to +85°C | ±0.5°C |
| Humidity | 0–100% RH | ±3% RH |
| Pressure | 300–1100 hPa | ±0.12 hPa |
| Gas/VOC (IAQ) | 0–500 IAQ index | AI-calibrated |

**AI capability:** On-chip BSEC (Bosch Sensortec Environmental Cluster) ML library runs on ESP32-S3, classifying air quality in real time. Outputs IAQ score, CO₂ equivalent (eCO₂), and breath VOC (bVOC).

**LOT integration:** BME688 data logged as `hardware_env` event to LOT Log tab every 60 seconds when device is active.

### 5.2 APDS-9960 — Proximity / Gesture / Color Sensor

**Manufacturer:** Broadcom (Avago)  
**LCSC:** C115438  
**Protocol:** I²C (0x39)  

| Feature | Detail |
|---------|--------|
| Proximity | 0–200mm contactless |
| Gesture | Up/Down/Left/Right (4-directional) |
| Color | RGBC: 16-bit per channel |
| Ambient Light | 0–65535 lux |

**LOT integration:** Proximity triggers screen wake. Gesture swipes navigate notification history. Color data feeds ambient context to QIE signal record.

### 5.3 ICM-42688-P — 6-Axis IMU

**Manufacturer:** TDK InvenSense  
**LCSC:** C3001082  
**Protocol:** SPI or I²C  

| Parameter | Range | Noise |
|-----------|-------|-------|
| Accel | ±2/4/8/16g | 70μg/√Hz |
| Gyro | ±15.625 to ±2000°/s | 2.8mdps/√Hz |

**LOT integration:** Motion detected → device active; still 30s → deep sleep. Shake gesture = alternate Copy action. Orientation determines screen rotation.

### 5.4 OV5640 — 5MP Auto-Focus Camera

**Manufacturer:** OmniVision  
**Module:** OV5640 AF module, MIPI CSI-2, 36×36mm  

| Parameter | Value |
|-----------|-------|
| Resolution | 5MP (2592×1944) |
| Frame rate | 30fps @ 1080p, 60fps @ 720p |
| Lens | f/2.4, EFL 3.3mm, FOV 54° |
| AF | MIPI-controlled VCM |
| Interface | MIPI CSI-2 (2-lane) |

**LOT integration:** Camera captures on Copy button hold (2s). Image compressed to JPEG (256KB max) and uploaded to LOT API as `hardware_capture` signal. Stored in user's secure storage on lot-systems.com.

---

## 6. FIRMWARE ARCHITECTURE

### 6.1 Stack

```
RTOS:           FreeRTOS (via ESP-IDF v5.2)
SDK:            ESP-IDF 5.2 + Arduino-ESP32 HAL layer
Build:          CMake / idf.py
Language:       C (core) + C++ (application layer)
OTA:            ESP-IDF OTA over HTTPS (firmware.lot-systems.com)
Crypto:         mbedTLS (AES-256, TLS 1.3)
```

### 6.2 Task Architecture

```
FreeRTOS Tasks (all on core 0 unless noted):

SYSTEM_TASK     — boot, watchdog, power management          [Core 0, P:10]
WIFI_TASK       — connection management, reconnect loop     [Core 0, P:8]
API_TASK        — LOT API polling, SSE stream, signal POST  [Core 0, P:7]
SENSOR_TASK     — BME688 + APDS + ICM sampling loop        [Core 0, P:6]
DISPLAY_TASK    — OLED render queue (Core 1 dedicated)      [Core 1, P:9]
CAMERA_TASK     — OV5640 capture + JPEG encode + upload     [Core 1, P:5]
BUTTON_TASK     — debounce + short/long press detection     [Core 0, P:9]
OTA_TASK        — spawned on update available signal        [Core 0, P:4]

Queues:
  api_rx_queue    — incoming notifications from LOT API → DISPLAY_TASK
  signal_tx_queue — outgoing signals (Copy button) → API_TASK
  sensor_queue    — sensor readings → API_TASK (60s flush)
```

### 6.3 Power State Machine

```
ACTIVE:     Wi-Fi on, OLED on, sensors sampling, camera ready
            Current draw: ~85mA average
            Battery life: ~4.5 hours continuous

IDLE:       Wi-Fi on (DTIM 3), OLED off, sensors 10s interval
            Current draw: ~22mA average
            Battery life: ~17 hours

LIGHT SLEEP: Wi-Fi beacon listen, OLED off, IMU wake-only
            Current draw: ~4mA average
            Battery life: ~4 days

DEEP SLEEP: Wi-Fi off, RTC timer only, wake on button/motion
            Current draw: ~180μA
            Battery life: ~88 days

Transitions:
  ACTIVE → IDLE:        60s no interaction + no pending notifications
  IDLE → LIGHT SLEEP:   5 min in IDLE
  LIGHT SLEEP → DEEP:   30 min in LIGHT SLEEP
  Any → ACTIVE:         Button press, proximity (<100mm), notification received
```

### 6.4 Firmware Files Structure

```
firmware/
├── CMakeLists.txt
├── sdkconfig.defaults
├── main/
│   ├── main.c                  — entry point, task launch
│   ├── system_task.c/.h        — boot, WDT, power management
│   ├── wifi_task.c/.h          — Wi-Fi connection + NTP
│   ├── api_task.c/.h           — LOT API REST + SSE client
│   ├── sensor_task.c/.h        — BME688 + APDS-9960 + ICM-42688
│   ├── display_task.c/.h       — OLED render engine
│   ├── camera_task.c/.h        — OV5640 capture + JPEG
│   ├── button_task.c/.h        — debounce + gesture
│   ├── ota_task.c/.h           — OTA update flow
│   └── config.h                — device config + API keys
├── components/
│   ├── ssd1306/                — SH1106/SSD1306 OLED driver
│   ├── bme68x/                 — Bosch BME68x-Sensor-API
│   ├── apds9960/               — APDS-9960 driver
│   ├── icm42688/               — TDK ICM-42688 driver
│   └── esp_camera/             — ESP-IDF camera component
└── partitions.csv              — flash partition table
```

### 6.5 Copy Button — Signal Flow

```
Operator presses [COPY] button
    ↓
button_task detects rising edge + debounce (50ms)
    ↓
Enqueue signal_tx_queue: {type: "copy_button", ts: epoch_ms, device_id}
    ↓
api_task dequeues → POST /api/hardware/signal
    ↓
LOT backend creates log event {type: "hardware_signal", source: "copy_button"}
    ↓
Event appears in operator's Log tab on lot-systems.com
    ↓
OLED shows: "Signal sent ✓" for 2 seconds
```

### 6.6 Notification Flow

```
lot-systems.com AI → POST /api/hardware/push/{device_id}
    ↓
LOT backend → SSE event stream to device
    ↓
api_task receives SSE "notification" event
    ↓
Enqueue api_rx_queue: {text: "Coffee time!", icon: "☕", ts}
    ↓
display_task renders notification on OLED
    ↓
APDS-9960 proximity: OLED stays on while operator near
    ↓
IMU: no motion 30s → OLED off → IDLE state
```

---

## 7. LOT API CONNECTOR — BACKEND ENDPOINTS

New routes to add to the LOT Systems backend (Node.js/Express):

### 7.1 Device Registration

```
POST /api/hardware/register
Body: { device_id, firmware_version, operator_id }
Response: { api_key, notification_endpoint, sse_endpoint }
```

### 7.2 Signal Ingest (Copy Button)

```
POST /api/hardware/signal
Headers: Authorization: Bearer <device_api_key>
Body: { type: "copy_button", ts: epoch_ms, sensor_snapshot: {...} }
Response: { status: "logged", log_id }
Action: Creates log event type "hardware_signal" → appears in Log tab
         displayableEvents whitelist: add "hardware_signal"
```

### 7.3 Environment Data Ingest

```
POST /api/hardware/env
Headers: Authorization: Bearer <device_api_key>
Body: { temperature_c, humidity_rh, pressure_hpa, iaq_score, eco2_ppm, bvoc_ppb, ts }
Response: { status: "logged" }
Action: Creates log event type "hardware_env" → QIE signal source
```

### 7.4 Notification Push (Server → Device)

```
POST /api/hardware/push/:device_id
Headers: Authorization: Bearer <operator_api_key>
Body: { text: "Coffee time!", icon: "coffee", priority: "normal" }
Response: { status: "queued" }
Mechanism: SSE stream at /api/hardware/stream/:device_id
```

### 7.5 SSE Notification Stream (Device Connection)

```
GET /api/hardware/stream/:device_id
Headers: Authorization: Bearer <device_api_key>
Response: SSE text/event-stream
Events:
  event: notification
  data: {"text":"Coffee time!","icon":"coffee","ts":1750000000000}

  event: ping
  data: {"ts":1750000000000}
```

### 7.6 OTA Update Manifest

```
GET /api/hardware/ota/manifest
Headers: Authorization: Bearer <device_api_key>
Response: { latest_version: "1.2.0", url: "https://firmware.lot-systems.com/v1.2.0.bin", sha256 }
```

---

## 8. SOFTWARE CONNECTOR — ARCHITECTURE

### 8.1 Desktop Companion App (Optional)

A lightweight companion app allows operators to configure Wi-Fi credentials and device settings without direct serial access.

```
Platform:   Electron (cross-platform: macOS, Windows, Linux)
Protocol:   BLE GATT (pre-Wi-Fi setup) → HTTP/WebSocket (post-Wi-Fi)
Functions:
  - Provision Wi-Fi SSID + password via BLE
  - Link device to LOT operator account
  - View notification history
  - Configure notification types and timing
  - Trigger OTA update
  - View sensor readings in real time
```

### 8.2 BLE Provisioning Protocol

```
Service UUID:  {lot-cosmo-prov-uuid}
Characteristics:
  WIFI_SSID     — write SSID (UTF-8, max 32 bytes)
  WIFI_PASS     — write password (UTF-8, max 64 bytes, encrypted)
  OPERATOR_KEY  — write LOT API operator key (base64)
  DEVICE_STATUS — read/notify: {wifi, api, battery, firmware}
  PROVISION_CMD — write: "commit" → saves config + connects
```

### 8.3 Firmware Update Process

```
1. Device polls /api/hardware/ota/manifest every 4 hours
2. If firmware_version < latest_version:
   a. Download .bin over HTTPS → OTA partition
   b. Verify SHA-256 checksum
   c. Mark OTA partition valid
   d. Schedule reboot in 60 seconds
   e. OLED shows: "Update ready. Rebooting in 60s..."
3. On reboot: ESP-IDF OTA boot selects new partition
4. New firmware reports version to LOT API
```

---

## 9. WIRELESS CHARGING

### 9.1 Qi Standard

- **Standard:** WPC Qi 1.3 (5W Extended Power Profile)
- **Receiver IC:** IP5306 (integrated charger + Qi RX + boost)
- **Receiver coil:** Würth WR-WCR-2616M (26×16mm, Q>40)
- **Transmitter:** Custom branded pad (included with device)
- **Charging time:** 0→100% in ~1.5 hours at 5W
- **Input protection:** OVP + thermal shutdown in IP5306
- **Coil placement:** Part A (back plate) interior, 0.5mm pocket

### 9.2 Charging Pad Spec

```
Model:      LOT-CP-01
Input:      USB-C, 5V/2A (10W max)
Output:     Qi 5W
Diameter:   100mm round
Height:     6mm
Finish:     Matte black aluminum
LED:        1× status LED (charging / full)
Cable:      0.5m attached USB-C
```

---

## 10. PRODUCTION ROADMAP — 100-UNIT RUN

### Phase 1: NRE and Prototype (Weeks 1–6)

```
Week 1:  Finalize PCB schematic + layout in KiCad
         Place order: PCBWay PCB prototype (5 boards, no PCBA)
         Place order: SS body prototype (2 sets) via PCBWay CNC

Week 2:  Receive PCB prototype boards
         Hand-solder prototype components (3 boards)
         Flash firmware — bringup test

Week 3:  Firmware integration testing
         BME688 calibration (BSEC library)
         LOT API endpoint testing

Week 4:  Mechanical fit test (PCB in SS body)
         Wireless charging validation
         Button feel + gasket seal test

Week 5:  LOT API backend endpoints code + deploy
         Companion app BLE provisioning prototype
         Copy button → Log tab end-to-end test

Week 6:  Prototype sign-off by S-2
         Final BOM lock
         FCC/CE pre-compliance testing (EMC scan)
```

### Phase 2: Production Run (Weeks 7–14)

```
Week 7:  Place production orders:
           PCBWay PCBA: 110 boards
           PCBWay CNC: 110 sets SS bodies
           Battery: 110 × LP401740
           Qi pads: 110 units

Week 8-10: Manufacturing lead time
           Firmware v1.0 freeze + code sign
           OTA infrastructure live on firmware.lot-systems.com
           Companion app v1.0 build + release

Week 11: Receive PCBA + SS bodies
          QC inspection: 100% visual + 10% electrical
          Assembly: PCB → gasket → SS body → fasteners

Week 12: Final firmware flash (all 110 units)
          QA testing: Wi-Fi connect, LOT API, Copy button, notifications
          Wireless charging validation (all units)
          Environmental sensor calibration

Week 13: Packaging + documentation insert
          PDF manual print run
          Shipping preparation

Week 14: Delivery of 100 units to S-2
```

### Phase 3: Phase 2 — 5mm Body (Month 6+)

```
Objective:   Reduce thickness from 7mm → 5mm
Method:      
  - Replace OV5640 module with chip-down OV5640 (bare die + wafer-level lens)
  - Replace OLED module with COG (chip-on-glass) bonded OLED
  - Reduce PCB to 0.6mm via Rogers 4350B substrate
  - Integrate LiPo to 0.5mm thicker Li-polymer pouch
  - Target: 4.8mm mechanical clearance
Status:      DEFERRED — requires custom supply chain sourcing
```

---

## 11. DOCUMENT SYSTEM

### 11.1 Document Structure

```
docs/hardware/
├── LOT-COSMO-HARDWARE-v1.0.md        ← this file (master spec)
├── firmware/
│   ├── LOT-FW-SPEC-v1.0.md           ← firmware specification
│   ├── LOT-FW-API-v1.0.md            ← firmware API reference
│   └── LOT-FW-OTA-PROTOCOL-v1.0.md  ← OTA update protocol
├── mechanical/
│   ├── LOT-MECH-BODY-A-v1.0.md       ← Part A drawing spec
│   ├── LOT-MECH-BODY-B-v1.0.md       ← Part B drawing spec
│   └── LOT-MECH-ASSEMBLY-v1.0.md     ← assembly sequence
├── electrical/
│   ├── LOT-PCB-SCHEMATIC-v1.0.md     ← schematic notes
│   ├── LOT-PCB-BOM-v1.0.csv          ← component BOM (LCSC refs)
│   └── LOT-PCB-CPL-v1.0.csv          ← component placement list
├── software/
│   ├── LOT-SW-COMPANION-v1.0.md      ← companion app spec
│   ├── LOT-SW-API-v1.0.md            ← LOT API connector spec
│   └── LOT-SW-BLE-PROV-v1.0.md      ← BLE provisioning spec
└── manuals/
    ├── LOT-COSMO-QUICKSTART-v1.0.md  ← quick start (2-page)
    ├── LOT-COSMO-USER-MANUAL-v1.0.md ← full user manual
    └── LOT-COSMO-FIELD-MANUAL-v1.0.md← operator field manual
```

### 11.2 PDF Manual Outline — User Manual

```
LOT COSMO CIA — User Manual v1.0

1. OVERVIEW
   1.1 What is COSMO CIA
   1.2 In the box
   1.3 Physical description (diagram)

2. SETUP
   2.1 Charging for the first time
   2.2 LOT account prerequisites
   2.3 BLE pairing via companion app
   2.4 Wi-Fi configuration
   2.5 Linking device to your LOT account

3. DAILY OPERATION
   3.1 Notifications from lot-systems.com
   3.2 The Copy button — sending signals to the Log
   3.3 Reading environmental data
   3.4 Screen navigation (gesture swipe)
   3.5 Battery and charging

4. SETTINGS (via companion app)
   4.1 Notification preferences
   4.2 Sensor data reporting
   4.3 Sleep/wake configuration

5. FIRMWARE UPDATE
   5.1 Automatic OTA updates
   5.2 Manual update trigger

6. SPECIFICATIONS
   6.1 Technical specifications table
   6.2 Sensor accuracy table
   6.3 Regulatory compliance (FCC/CE)

7. SAFETY AND CARE
   7.1 Wireless charging safety
   7.2 IP rating and water resistance
   7.3 Operating temperature range

8. TROUBLESHOOTING
   8.1 Device not connecting to Wi-Fi
   8.2 Notifications not appearing
   8.3 Copy button not registering in Log
   8.4 Factory reset procedure

APPENDIX A: FCC Declaration of Conformity
APPENDIX B: CE Declaration of Conformity
APPENDIX C: API reference for LOT developers
```

### 11.3 PDF Manual Outline — Firmware Document

```
LOT COSMO CIA — Firmware Reference v1.0

1. ARCHITECTURE OVERVIEW
   1.1 FreeRTOS task map
   1.2 Power state machine
   1.3 Memory map (flash partitions)
   1.4 I²C / SPI peripheral map

2. BUILD ENVIRONMENT
   2.1 ESP-IDF v5.2 setup
   2.2 Clone + configure
   2.3 Flash + monitor

3. CONFIGURATION (config.h)
   3.1 Device ID format
   3.2 API endpoints
   3.3 Power thresholds
   3.4 Sensor sample rates

4. LOT API INTEGRATION
   4.1 Authentication (device API key)
   4.2 REST endpoints reference
   4.3 SSE notification stream
   4.4 Signal POST format

5. SENSOR CALIBRATION
   5.1 BME688 BSEC calibration procedure
   5.2 APDS-9960 proximity threshold tuning
   5.3 ICM-42688 offset calibration

6. OTA UPDATE
   6.1 Partition table
   6.2 Code signing (RSA-2048)
   6.3 Rollback on failure

7. DEBUG AND LOGGING
   7.1 UART log levels
   7.2 LED status codes
   7.3 OLED diagnostic screen

APPENDIX A: Register map — BME688
APPENDIX B: Register map — APDS-9960
APPENDIX C: Register map — ICM-42688-P
APPENDIX D: Partition table listing
```

---

## 12. SESSION COMPRESSION PROTOCOL

Each COSMO CIA device maintains a compressed session state transmitted to LOT API every 60 minutes:

```json
{
  "device_id": "COSMO-001",
  "session": {
    "ts_start": 1750000000,
    "ts_end":   1750003600,
    "notifications_received": 4,
    "signals_sent": 2,
    "env": {
      "temp_avg": 22.4,
      "humidity_avg": 48.2,
      "iaq_avg": 87,
      "iaq_min": 61,
      "iaq_max": 103
    },
    "motion": {
      "active_minutes": 34,
      "peak_accel_g": 1.8
    },
    "battery": {
      "start_pct": 92,
      "end_pct": 87
    },
    "firmware": "1.0.0"
  }
}
```

This session snapshot is stored as `hardware_session` event in the LOT Log, feeding the QIE signal record. It does not transmit raw sensor streams — only compressed statistical summaries.

---

## 13. REGULATORY COMPLIANCE

| Certification | Standard | Est. Cost | Timeline |
|---------------|----------|-----------|----------|
| FCC Part 15B | Unintentional radiator | $2,000 | 4-6 weeks |
| FCC Part 15C (Wi-Fi) | 802.11 b/g/n | $2,500 | 4-6 weeks |
| CE RED (EU) | Radio Equipment Directive | $3,000 | 6-8 weeks |
| CE EMC | EN 55032 / EN 55035 | included in CE | — |
| RoHS | Restriction of Hazardous Substances | $0 (PCBWay cert) | — |
| REACH | Chemical compliance | $0 (material certs) | — |

**Note:** ESP32-S3-WROOM-1 module carries FCC ID 2AC7Z-WROOM1U and CE mark, which simplifies the radio certification path (module exemption may apply under FCC Part 15.204).

---

## 14. SUPPLY CHAIN LINKS

| Component | Source | URL |
|-----------|--------|-----|
| ESP32-S3-WROOM-1 | LCSC | https://www.lcsc.com/product-detail/C3019571 |
| BME688 | Mouser | https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688 |
| APDS-9960 | DigiKey | https://www.digikey.com/en/products/detail/broadcom-limited/APDS-9960 |
| ICM-42688-P | Mouser | https://www.mouser.com/ProductDetail/TDK-InvenSense/ICM-42688-P |
| IP5306 Qi IC | LCSC | https://www.lcsc.com/product-detail/C181692 |
| Würth Qi Coil | Mouser | https://www.mouser.com/ProductDetail/Wurth-Elektronik/760308101210 |
| PCBWay PCB | PCBWay | https://www.pcbway.com/orderonline.aspx |
| PCBWay PCBA | PCBWay | https://www.pcbway.com/pcba-service/ |
| PCBWay CNC SS | PCBWay | https://www.pcbway.com/rapid-prototyping/manufacture/ |
| OV5640 module | AliExpress | (search: "OV5640 AF camera module MIPI") |
| Thin LiPo 380mAh | GREPOW | https://www.grepow.com |

---

## 15. PHASE 1 DESIGN CONSTRAINTS AND DECISIONS

| Constraint | Decision | Rationale |
|------------|----------|-----------|
| 5mm height spec | Phase 1: 7mm / Phase 2: 5mm | OV5640 module is 5.5mm alone; chip-down required for 5mm |
| 4×4cm footprint | 40×40mm confirmed feasible | Fits ESP32-S3 + sensors + OLED + camera in standard PCB area |
| Wireless charging | Qi 5W (IP5306) | Standard interoperability; no proprietary cables |
| Camera resolution | 5MP (OV5640) | Sufficient for LOT capture use case; MIPI on ESP32-S3 |
| Screen size | 1.3" OLED | Largest fitting within 40mm frame with camera + button |
| Battery | 380mAh | Maximum capacity for 7mm height; ~17h in IDLE mode |
| SS grade | 316L | Superior corrosion resistance; machineability; mirror-polish capable |
| Certification path | FCC/CE (ESP32 module exemption) | Reduces timeline and cost for 100-unit run |

---

*Document: LOT-HW-SPEC-20260625-v1.0 | S-2: VADIK MARMELADOV | COSMO® CIA*  
*AUTHORIZED BY: S-2 // VADIK MARMELADOV*
