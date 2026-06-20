# LOT COMPUTER — HARDWARE SPECIFICATION v1.0
### COSMO® CIA · Physical Node · 100-Unit Production Run

```
Classification : PRODUCT SPECIFICATION
Author         : Vadik Marmeladov — Inventor, COSMO® CIA
Date           : 2026-06-20
Branch         : claude/brave-lamport-osllvg
Status         : DRAFT → REVIEW → APPROVED → PRODUCTION
Repository     : lot-systems/lot-computer
```

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Device Overview](#2-device-overview)
3. [Physical Design Specifications](#3-physical-design-specifications)
4. [Component Architecture & BOM](#4-component-architecture--bom)
5. [PCB Design — PCBWay Production](#5-pcb-design--pcbway-production)
6. [Firmware Architecture](#6-firmware-architecture)
7. [Software & LOT API Integration](#7-software--lot-api-integration)
8. [AI Sensor Suite](#8-ai-sensor-suite)
9. [Wireless Charging System](#9-wireless-charging-system)
10. [Manufacturing Roadmap — 100 Units](#10-manufacturing-roadmap--100-units)
11. [Cost Analysis](#11-cost-analysis)
12. [PDF Manual Structure](#12-pdf-manual-structure)
13. [Document Index](#13-document-index)
14. [Regulatory & Compliance](#14-regulatory--compliance)
15. [Roadmap & Next Iterations](#15-roadmap--next-iterations)

---

## 1. EXECUTIVE SUMMARY

The **LOT Computer** is a palm-scale autonomous notification device that bridges the LOT Systems AI platform with the physical world. It is a **4 × 4 cm, 5 mm-thick** stainless steel hardware node that receives proactive AI-generated messages from [lot-systems.com](https://lot-systems.com), displays them on a compact screen, and logs physical interactions back to the user's LOT account in real time.

This document covers the complete specification: enclosure, PCB, components, firmware, API wiring, manufacturing via PCBWay, and the 100-unit pilot run.

**Core value proposition:**
> The LOT Computer is the physical manifestation of the LOT Memory Engine — a silent companion that tells you when it's coffee time, not because you asked, but because it knows you.

---

## 2. DEVICE OVERVIEW

| Attribute           | Value                                              |
|---------------------|----------------------------------------------------|
| Product name        | LOT Computer                                       |
| Brand               | COSMO® CIA                                         |
| Platform            | lot-systems.com                                    |
| Form factor         | 4 × 4 cm × 5 mm flat square                       |
| Primary function    | Autonomous AI notification pager                   |
| Connectivity        | Wi-Fi 802.11 b/g/n + Bluetooth 5.0 LE             |
| Power               | Wireless Qi charging (5 W), 200 mAh LiPo          |
| Display             | 1.0" OLED 128 × 128 px, 16-bit color              |
| Camera              | 2 MP OV2640, fixed-focus                           |
| Input               | 1 × tactile button (COPY / LOG)                   |
| Sensors             | BME688 (temp, humidity, pressure, VOC, AI)         |
| Enclosure           | 316L stainless steel, 2-part CNC machined          |
| Production volume   | 100 units (pilot run)                              |
| PCB manufacturer    | PCBWay                                             |

---

## 3. PHYSICAL DESIGN SPECIFICATIONS

### 3.1 Enclosure — 2-Part Stainless Steel Body

The body consists of exactly **two CNC-machined 316L stainless steel halves** that snap together via an internal clip rail and four M1.2 screws recessed at the corners (invisible from outside).

```
┌──────────────────────────────┐
│   FRONT HALF (polished)      │  ← mirror-finish 316L SS, 2.0 mm wall
│   40 mm × 40 mm × 2.5 mm    │    no openings, no markings
│                              │    subtle COSMO® laser-etched on edge
└──────────────────────────────┘

┌──────────────────────────────┐
│   REAR HALF (functional)     │  ← brushed 316L SS, 2.5 mm wall
│   40 mm × 40 mm × 2.5 mm    │
│                              │
│  [■ screen 18×18 mm]         │  ← OLED window, sapphire glass lens
│  [● camera 6 mm]             │  ← OV2640, flush-mounted
│  [○ button 4 mm]             │  ← tactile dome, etched COPY label
│  [≋ charging coil area]      │  ← Qi receiver embedded in rear half
└──────────────────────────────┘
```

### 3.2 Dimensional Cross-Section

```
Side view (5 mm total):
  ──────────────────────────
  ▓▓▓  Front SS half  ▓▓▓    2.0 mm
  ════════ PCB stack ════    1.0 mm (PCB) + 0.5 mm clearance
  ▓▓▓▓  Rear SS half  ▓▓▓▓  1.5 mm (includes Qi coil groove)
  ──────────────────────────
  Total: 5.0 mm
```

### 3.3 Surface Treatments

| Face          | Finish                        | Process              |
|---------------|-------------------------------|----------------------|
| Front (top)   | Mirror polished               | Electro-polish + buff |
| Rear (bottom) | Brushed satin                 | #4 brush finish      |
| Edges         | Chamfered 0.3 mm, brushed     | CNC chamfer          |
| Interior      | Bead-blasted (rough for EMI)  | Bead-blast, no coat  |

### 3.4 Logo & Branding

- COSMO® laser-etched on the **right edge**, depth 0.05 mm, 4 pt sans-serif
- LOT Systems wordmark laser-etched on **left edge**, same depth
- No branding on the polished front face — clean

---

## 4. COMPONENT ARCHITECTURE & BOM

### 4.1 System Block Diagram

```
                    ┌─────────────────────────────────────────┐
                    │              LOT Computer PCB            │
                    │                                         │
  Qi Coil ─────────┤ BQ51050B ──► PMIC ──► LiPo 200mAh      │
  (rear shell)     │  (Qi RX)     │                          │
                   │              │                          │
                   │         ESP32-S3-MINI-1                 │
                   │         ┌───────────────┐               │
    BME688 ────I2C─┤         │  CPU 240 MHz  │               │
    OV2640 ──DVP───┤         │  WiFi 802.11  │               │
    OLED ────SPI───┤         │  BLE 5.0      │               │
    Button ──GPIO──┤         │  8 MB Flash   │               │
                   │         │  8 MB PSRAM   │               │
                   │         └───────────────┘               │
                   │              │ WiFi                      │
                   └──────────────┼──────────────────────────┘
                                  │
                           lot-systems.com
                           LOT API Connector
```

### 4.2 Full Bill of Materials

| # | Component                    | Part Number           | Qty | Unit $  | Notes                                |
|---|------------------------------|-----------------------|-----|---------|--------------------------------------|
| 1 | SoC Module                   | ESP32-S3-MINI-1-N8R8  | 1   | $3.20   | WiFi+BLE, 8MB Flash, 8MB PSRAM       |
| 2 | OLED Display                 | SSD1351 1.0" 128×128  | 1   | $3.50   | 16-bit color, SPI, 30×30 mm          |
| 3 | Sapphire Display Lens        | Custom 20×20 mm       | 1   | $2.00   | 0.5 mm thick, AR-coated              |
| 4 | Camera Module                | OV2640 (bare die)     | 1   | $2.80   | 2MP, DVP interface, 7×7 mm           |
| 5 | Camera Lens                  | M12 fixed-focus f/2.0 | 1   | $1.20   | Flush-mount, 5.5 mm diameter         |
| 6 | AI Multi-Sensor              | Bosch BME688          | 1   | $5.50   | Temp/Humidity/Pressure/VOC/AI        |
| 7 | Qi Wireless Charging RX      | TI BQ51050B           | 1   | $2.10   | 5W Qi receiver, WPC 1.2              |
| 8 | Qi Receiver Coil             | WCT-15K6050-S1F       | 1   | $1.80   | Flat, 40×40 mm, fits in SS groove    |
| 9 | Battery Management IC        | MCP73831T-2ACI/OT     | 1   | $0.60   | 4.2V, 500mA charge limit             |
|10 | LiPo Battery                 | 3.7V 200mAh thin cell | 1   | $3.20   | 38×38×2 mm (fits in 2mm gap)         |
|11 | LDO Regulator 3.3V           | AP2112K-3.3TRG1       | 1   | $0.25   | 600mA, low dropout                   |
|12 | Power Supervisor              | TPS3813K33DBVR        | 1   | $0.40   | Brown-out, reset generator           |
|13 | Tactile Button               | TS-1185A-C1T2         | 1   | $0.15   | SMD, 4×4 mm, 1.5N actuation         |
|14 | ESD Protection (USB-C debug) | PRTR5V0U2X            | 1   | $0.20   | 5V tolerant, SOT-363                 |
|15 | USB-C Connector (debug only) | USB4135-GF-A          | 1   | $0.55   | Hidden under label, flashing/debug   |
|16 | Crystal 40 MHz               | NX5032GA-40.000M      | 1   | $0.30   | ESP32 external clock                 |
|17 | Decoupling Caps (MLCCs)      | 100nF / 10µF 0402     | 24  | $0.02ea | Power rail filtering                 |
|18 | Pull-up Resistors            | 4.7kΩ 0402            | 6   | $0.01ea | I2C, button lines                    |
|19 | LED Status (edge)            | 0402 RGB SMD          | 1   | $0.08   | Charging / paired / notification     |
|20 | Stainless Enclosure (front)  | CNC 316L SS           | 1   | $12.00  | Mirror polished, no openings         |
|21 | Stainless Enclosure (rear)   | CNC 316L SS           | 1   | $14.00  | Brushed, camera/screen/button cutout |
|22 | PCB (4-layer, PCBWay)        | 4L, 40×40 mm, 1 oz    | 1   | $1.20   | Min via 0.2mm, ENIG finish           |
|23 | SMT Assembly (PCBA)          | PCBWay turnkey        | 1   | $8.50   | Full BOM supply + assembly           |
|24 | Internal Screws M1.2×2mm     | A2 stainless          | 4   | $0.05ea | Corner retention                     |
|25 | Foam gasket / light seal     | 0.3mm EVA foam        | 1   | $0.30   | OLED light isolation                 |
|   |                              |                       |     |         |                                      |
|   | **UNIT TOTAL (components)**  |                       |     | **~$68**|                                      |

> Prices are estimates at 100-unit volume (Q4 2026 market). PCBWay PCBA turnkey service includes BOM procurement, SMT, and basic functional test.

---

## 5. PCB DESIGN — PCBWAY PRODUCTION

### 5.1 PCB Specifications

| Parameter             | Spec                                  |
|-----------------------|---------------------------------------|
| Dimensions            | 38.0 × 38.0 mm (fits inside 40×40 shell) |
| Layer count           | 4 (signal / GND / PWR / signal)       |
| Thickness             | 0.8 mm (slim for 5 mm form factor)    |
| Copper weight         | 1 oz outer / 0.5 oz inner             |
| Min trace / space     | 4 mil / 4 mil                         |
| Min via drill         | 0.2 mm (laser via)                    |
| Surface finish        | ENIG (gold pads, corrosion-resistant) |
| Soldermask color      | Black                                 |
| Silkscreen            | White, top only                       |
| Board material        | FR4, Tg 150°C                         |
| Impedance control     | 50Ω single-ended (RF antenna trace)   |
| Quantity (pilot)      | 100 boards + 10% over-run             |

### 5.2 Layer Stack

```
Layer 1 (Top)    : Signal — ESP32 routes, SPI display, camera DVP
Layer 2          : Ground plane — solid copper, RF shield reference
Layer 3          : Power plane — 3.3V, LiPo rails, Qi rectified
Layer 4 (Bottom) : Signal — battery connections, I2C sensors
```

### 5.3 PCBWay Order Configuration

- **Service**: PCBA (PCB + Components + Assembly)
- **Stencil**: Included (laser-cut stainless, 0.12 mm)
- **File formats**: Gerber RS-274X, BOM CSV, CPL (centroid file)
- **Lead time**: 10–15 business days (prototype); 20–25 days (production 100 units)
- **PCBWay URL**: [pcbway.com](https://www.pcbway.com) → PCB Assembly → Turnkey
- **Design Rule Check**: PCBWay DRC run before submission

### 5.4 Key Routing Constraints

- ESP32 2.4 GHz antenna: keep-out zone 3 mm around antenna trace, no copper pours
- Camera DVP bus: matched-length differential pairs ±0.1 mm
- I2C (BME688): 4.7 kΩ pull-ups to 3.3 V, max 400 kHz
- Qi coil connection: short low-resistance trace to BQ51050B (< 5 mΩ)
- Battery: dedicated 2A-rated trace width (≥ 3 mm)

---

## 6. FIRMWARE ARCHITECTURE

### 6.1 Platform

- **SDK**: ESP-IDF v5.2 (Espressif IoT Development Framework)
- **RTOS**: FreeRTOS (built-in to ESP-IDF)
- **Language**: C / C++17
- **OTA Updates**: ESP HTTP Client + ESP OTA API over TLS to lot-systems.com/firmware
- **Crypto**: mbedTLS (ESP-IDF native), AES-256 device key storage in eFuses

### 6.2 Task Architecture (FreeRTOS)

```
┌─────────────────────────────────────────────────────────────────┐
│                     ESP32-S3 FreeRTOS Tasks                      │
│                                                                  │
│  Task Name          Priority  Stack   Function                   │
│  ─────────────────  ────────  ──────  ─────────────────────────  │
│  wifi_manager_task     5      8192    Connect, reconnect, WPA2   │
│  api_poller_task       4      8192    Poll LOT API every 30s     │
│  display_task          3      4096    Render notifications        │
│  camera_task           3      8192    Capture on demand           │
│  sensor_task           2      4096    BME688 read every 60s       │
│  button_task           6      2048    ISR + debounce + log POST  │
│  charging_task         1      2048    Monitor Qi / battery %     │
│  ota_task              1      8192    Background OTA check       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Notification Display Flow

```
lot-systems.com
      │  POST /api/device/notify
      │  { "message": "Coffee time!", "type": "reminder", "ttl": 300 }
      ▼
api_poller_task (polls GET /api/device/messages every 30s)
      │
      ▼
notification_queue (FreeRTOS queue, depth 8)
      │
      ▼
display_task → render on SSD1351 OLED
  ┌──────────────────────────────────┐
  │  ╔══════════════╗               │
  │  ║  LOT         ║               │
  │  ║              ║               │
  │  ║ ☕ Coffee    ║               │
  │  ║    time!     ║               │
  │  ║              ║               │
  │  ║  09:47 AM    ║               │
  │  ╚══════════════╝               │
  └──────────────────────────────────┘
      │
      ▼ (after 5s or button press)
Notification ACK → POST /api/device/ack
```

### 6.4 Button (COPY) Flow

```
Physical button press
      │
      ▼
button_task (ISR, 20ms debounce)
      │
      ├─► Haptic feedback: LED pulse (500ms white)
      │
      └─► POST https://lot-systems.com/api/device/log
              {
                "device_id": "<unique_hardware_id>",
                "event": "copy",
                "context": {
                  "last_notification_id": "...",
                  "timestamp": "2026-06-20T09:47:00Z",
                  "sensor_snapshot": {
                    "temp_c": 21.4,
                    "humidity_pct": 58.2,
                    "pressure_hpa": 1012.3,
                    "voc_iaq": 87
                  }
                }
              }
```

The receiving endpoint writes a structured entry to the user's **Log tab** on lot-systems.com, visible under Activity → Device Log.

### 6.5 Firmware File Structure

```
lot-computer-firmware/
├── main/
│   ├── main.c                  ← App entry, task spawning
│   ├── wifi_manager.c/h        ← WiFi connection management
│   ├── api_client.c/h          ← LOT API HTTP/TLS client
│   ├── display.c/h             ← SSD1351 SPI driver + renderer
│   ├── camera.c/h              ← OV2640 DVP driver
│   ├── sensor_bme688.c/h       ← BME688 I2C driver + BSEC2 lib
│   ├── button.c/h              ← GPIO ISR, debounce, event queue
│   ├── charging.c/h            ← BQ51050B + PMIC monitoring
│   ├── ota_update.c/h          ← OTA firmware update
│   ├── device_identity.c/h     ← eFuse unique ID + provisioning
│   └── notifications.c/h       ← Notification queue + display logic
├── components/
│   ├── bsec2/                  ← Bosch BSEC2 AI library (binary)
│   └── esp_tls_client/         ← TLS wrapper
├── partitions.csv              ← Flash partition layout
├── sdkconfig                   ← ESP-IDF menuconfig output
├── CMakeLists.txt
└── Kconfig.projbuild           ← Project-level config options
```

### 6.6 Device Provisioning (First Boot)

1. Device boots into **AP mode** (SSID: `LOT-DEVICE-XXXXXX`)
2. User connects phone to AP, opens `192.168.4.1`
3. Simple captive portal: enter Wi-Fi SSID/password + LOT account token
4. Device stores credentials in NVS (ESP32 Non-Volatile Storage), AES-256 encrypted
5. Device reboots into normal operation mode, registers with LOT API
6. LOT API assigns `device_id` and links to user account

---

## 7. SOFTWARE & LOT API INTEGRATION

### 7.1 LOT API Connector (New Endpoints Required)

The following new API routes must be added to `/src/server/routes/api.ts` on lot-systems.com:

```typescript
// Device Registration
POST   /api/device/register
       Body: { device_token: string, device_model: string, firmware_version: string }
       Returns: { device_id: string, linked_user_id: string }

// Notification Push (server → device)
POST   /api/device/notify
       Body: { device_id: string, message: string, type: NotificationType, ttl_sec: number }
       Auth: server-side only (admin key)

// Device Poll (device → server, returns pending messages)
GET    /api/device/messages?device_id=xxx&since=<timestamp>
       Returns: { messages: Notification[], firmware_update?: FirmwareUpdate }
       Auth: device_token header

// Notification Acknowledge
POST   /api/device/ack
       Body: { device_id: string, notification_id: string, delivered_at: string }

// COPY Button Log (device → Log tab)
POST   /api/device/log
       Body: { device_id: string, event: "copy", context: DeviceContext }
       Effect: writes to user's Log tab with tag "device:copy"

// OTA Firmware Check
GET    /api/device/firmware/latest?model=lot-computer-v1
       Returns: { version: string, url: string, sha256: string }

// Sensor Data Upload
POST   /api/device/telemetry
       Body: { device_id: string, sensor: SensorSnapshot }
```

### 7.2 Authentication Model

```
Device identity:
  - device_id: UUID assigned at registration (stored server-side)
  - device_token: 256-bit random, generated at provisioning, stored in ESP32 eFuse
  - All API calls: Authorization: Bearer <device_token>
  - TLS 1.3 pinned to lot-systems.com cert (SHA-256 pin stored in firmware)
```

### 7.3 Notification Types

```typescript
type NotificationType =
  | "reminder"      // "Coffee time!"
  | "insight"       // "You've been focused for 90 min."
  | "weather"       // "Rain in 30 min — wrap up outside."
  | "memory"        // "A year ago you wrote: ..."
  | "cohort"        // "3 people in your cohort are on a walk."
  | "system"        // "Firmware update available."
  | "custom";       // User-defined from LOT dashboard
```

### 7.4 Log Tab Integration

When the COPY button is pressed, the event is written to the user's LOT Log tab with:
- **Tag**: `device:copy`
- **Source**: `LOT Computer`
- **Body**: Formatted string with timestamp, ambient sensor data, last notification context
- **Visibility**: User's private log only (same privacy model as existing Log entries)

---

## 8. AI SENSOR SUITE

### 8.1 Bosch BME688 — AI-Grade Environmental Sensor

The BME688 is not a basic sensor — it includes an **onboard AI pattern recognition library (BSEC2)** that runs on the ESP32 and classifies air quality in real time.

| Measurement         | Range              | Accuracy        | Resolution |
|---------------------|--------------------|-----------------|------------|
| Temperature         | -40 to +85°C       | ±0.5°C          | 0.01°C     |
| Relative Humidity   | 0–100% RH          | ±3% RH          | 0.008% RH  |
| Barometric Pressure | 300–1100 hPa       | ±0.6 hPa        | 0.18 Pa    |
| VOC / Gas Index     | IAQ 0–500          | Trained model   | —          |
| CO2 equivalent      | 400–25000 ppm      | BSEC2 inferred  | —          |

**BSEC2 AI Library**: Bosch's closed-source AI library runs a trained neural network directly on ESP32, classifying VOC signatures into Indoor Air Quality (IAQ) index without cloud dependency. The device is fully air-quality autonomous.

### 8.2 Sensor Data Flow to LOT Platform

```
BME688 (every 60s)
    │
    ▼
sensor_task → sensor snapshot in RAM
    │
    ├─► On COPY button: attached to log entry
    │
    ├─► On notification receive: ambient context stored with message
    │
    └─► Every 10 min: POST /api/device/telemetry
                       → lot-systems.com stores as contextual data
                       → Memory Engine can reference ("you tend to
                          check in when CO2 is rising — open a window?")
```

### 8.3 Camera — OV2640

The camera is available for optional future features and firmware-activated capabilities:

| Feature               | Implementation                           |
|-----------------------|------------------------------------------|
| Capture on demand     | Via LOT app "take a photo" push command  |
| Privacy shutter       | Software-controlled: camera off by default |
| Resolution            | 1600×1200 (UXGA), 2MP                    |
| Interface             | DVP 8-bit parallel, 20 MHz              |
| Night performance     | Fixed f/2.0 lens, software gain adjust   |
| Upload path           | JPEG to /api/device/photo, user-owned    |

Camera is **never active at idle** — only when user or device-triggered. No cloud streaming; images are user-controlled.

---

## 9. WIRELESS CHARGING SYSTEM

### 9.1 Specification

| Parameter              | Value                                     |
|------------------------|-------------------------------------------|
| Standard               | Wireless Power Consortium (WPC) Qi 1.2   |
| Received power         | 5 W max                                   |
| Coil type              | Flat spiral, 15 µH, 40×40 mm             |
| Coil material          | Copper foil on ferrite sheet              |
| Receiver IC            | Texas Instruments BQ51050B                |
| Charge voltage output  | 5 V regulated → MCP73831 → LiPo          |
| Charge current         | 300 mA (slow-charge for battery longevity)|
| Full charge time       | ~50 min (200 mAh at 300 mA)              |
| Thermal cutoff         | 45°C (PMIC hardware limit)               |

### 9.2 Physical Integration

The Qi coil is embedded in a **0.5 mm machined groove** on the inside face of the rear stainless steel shell, bonded with thermally conductive epoxy. Stainless steel is non-magnetic, so the Qi coil has its own 0.2 mm ferrite sheet backing to prevent eddy current loss in the steel.

```
Rear SS shell (inside view):
┌────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────┐    │
│  │   Ferrite sheet 36×36 mm, 0.1 mm      │    │
│  │   ┌──────────────────────────────┐    │    │
│  │   │  Qi coil copper spiral       │    │    │
│  │   │  WCT-15K6050-S1F 40×40 mm   │    │    │
│  │   │  bonded with EP30 epoxy      │    │    │
│  │   └──────────────────────────────┘    │    │
│  └────────────────────────────────────────┘    │
│                                                │
│  [camera cutout] [screen cutout] [button]      │
└────────────────────────────────────────────────┘
```

### 9.3 Included Charger

Each unit ships with:
- **Qi charging pad**: 5W, USB-C input, white matte finish, LOT Systems wordmark
- **USB-C cable**: 0.5 m, braided, USB-IF certified
- Pad dimensions: 80 × 80 mm × 6 mm (2× the device footprint)

---

## 10. MANUFACTURING ROADMAP — 100 UNITS

### 10.1 Phase Gate Overview

```
Phase 0  DESIGN LOCK        ─── Week 1–2
Phase 1  PROTOTYPING        ─── Week 3–6
Phase 2  EVT (Engineering)  ─── Week 7–10
Phase 3  DVT (Design)       ─── Week 11–14
Phase 4  PVT (Production)   ─── Week 15–18
Phase 5  SHIP 100 UNITS     ─── Week 19–20
```

### 10.2 Detailed Timeline

| Week  | Phase      | Activity                                                              | Deliverable                           |
|-------|------------|-----------------------------------------------------------------------|---------------------------------------|
| 1–2   | Design Lock| Finalize schematics, PCB layout, BOM, enclosure CAD                  | Locked Gerbers + STEP files           |
| 3     | Proto       | Order PCBWay prototype (5 boards), order CNC enclosure samples (3x)  | Components arrive                     |
| 4     | Proto       | Hand-assemble 3 prototype units                                       | 3× functional prototypes              |
| 5–6   | Proto       | Firmware flashing, initial API integration, provisioning test         | Functional prototype report           |
| 7–8   | EVT         | Structured testing: RF, charging, thermal, drop (1m onto concrete)   | EVT report, bug list                  |
| 9–10  | EVT         | Firmware iteration based on EVT findings, API endpoint finalization   | EVT pass/fail gate                    |
| 11–12 | DVT         | Order DVT batch (10 units) from PCBWay, revised enclosure tooling     | 10× DVT units                         |
| 13–14 | DVT         | User testing (5 users × 2 devices), UX feedback, OTA update test     | DVT sign-off report                   |
| 15–16 | PVT         | Order full 100-unit PCBWay PCBA run, enclosure CNC order (110 units) | PCBs + components in-house            |
| 17–18 | PVT         | Final assembly, firmware flash, QA (100% visual + functional test)    | 100 units tested                      |
| 19    | Ship        | Packaging, LOT device accounts created, firmware provisioned          | 100 units ready to ship               |
| 20    | Ship        | Ship to recipients, activate on lot-systems.com, monitor telemetry    | Post-ship monitoring report           |

### 10.3 Quality Gates

**EVT pass criteria:**
- [ ] Wi-Fi connects reliably in < 10s
- [ ] Notification received and displayed in < 5s from API trigger
- [ ] COPY button logs event to LOT Log tab within 3s
- [ ] Qi charging achieves full charge in < 60 min
- [ ] Battery life ≥ 48h standby, ≥ 8h active notification mode
- [ ] BME688 readings within spec (vs calibrated reference sensor)
- [ ] No thermal issues (surface temp < 38°C under all conditions)
- [ ] 1m concrete drop test: 3 units, 6 faces — no functional failure

**DVT pass criteria:**
- [ ] All EVT criteria maintained after enclosure revision
- [ ] OTA firmware update completes reliably (10 OTA cycles)
- [ ] 5-user UX study: ≥ 4/5 rate provisioning as "easy"
- [ ] RF range: full function at 30m open-air from Wi-Fi AP
- [ ] RoHS compliance confirmed

---

## 11. COST ANALYSIS

### 11.1 Per-Unit Cost Breakdown (100 units)

| Category                  | Cost per unit |
|---------------------------|---------------|
| Components (BOM)          | $47.00        |
| PCBWay PCBA (PCB+asm)    | $9.70         |
| Stainless enclosure (2×)  | $26.00        |
| Qi charging pad + cable   | $8.00         |
| Packaging (box, foam)     | $3.50         |
| QA / rework allowance     | $4.00         |
| **COGS total**            | **$98.20**    |

### 11.2 One-Time Costs (amortized)

| Item                          | Cost     | Notes                              |
|-------------------------------|----------|------------------------------------|
| PCB prototype (5 boards)      | $180     | PCBWay prototype service           |
| Enclosure CNC samples (3 sets)| $600     | First-article machining            |
| DVT batch (10 units PCBA)     | $400     | Engineering validation             |
| Enclosure DVT revision (10)   | $800     | Tooling adjustment + 10 new units  |
| Firmware development          | Internal | Covered by LOT engineering         |
| API endpoint development      | Internal | Covered by LOT engineering         |
| Regulatory testing (CE/FCC)   | $4,000   | EMC + RF certification             |
| **NRE Total**                 | **~$6,000** |                                 |

### 11.3 100-Unit Run Total Investment

```
COGS (100 × $98.20)   =  $9,820
NRE (one-time)         =  $6,000
Contingency (10%)      =  $1,582
─────────────────────────────────
TOTAL                  = $17,402

Per-unit all-in        =   $174
```

---

## 12. PDF MANUAL STRUCTURE

Seven PDF documents are produced from this project. Each is a standalone deliverable.

### Manual Set

| # | Document                                    | Audience          | Pages | Status  |
|---|---------------------------------------------|-------------------|-------|---------|
| 1 | **User Guide** — LOT Computer               | End user          | 12    | DRAFT   |
| 2 | **Quick Start Card**                        | End user          | 2     | DRAFT   |
| 3 | **Firmware Developer Manual**               | Firmware engineer | 40    | DRAFT   |
| 4 | **LOT API Connector Reference**             | Backend engineer  | 20    | DRAFT   |
| 5 | **PCB Design File Package** (Gerbers + BOM) | PCBWay / EE       | —     | FILES   |
| 6 | **Mechanical / Enclosure Drawing Set**      | CNC supplier      | 8     | DRAFT   |
| 7 | **Regulatory & Compliance Dossier**         | Certification lab | 30    | PLANNED |

### Manual 1 — User Guide Outline

```
1. In the box
2. Charging your LOT Computer
3. Setting up with the LOT app (provisioning)
4. Understanding the screen
5. Receiving notifications
6. The COPY button — what it does
7. Privacy: camera, sensors, data
8. LED indicator guide
9. Troubleshooting
10. Specifications
11. Warranty
12. Support: lot-systems.com/support
```

### Manual 3 — Firmware Developer Manual Outline

```
1. Development environment setup (ESP-IDF v5.2)
2. Building the firmware
3. Flashing a new device (USB-C debug port)
4. Configuration (sdkconfig + Kconfig)
5. Task architecture (FreeRTOS)
6. API client: authentication, polling, logging
7. Display driver: SSD1351 SPI, rendering primitives
8. Camera driver: OV2640 DVP, JPEG capture
9. Sensor driver: BME688 I2C + BSEC2 setup
10. OTA update: signing, delivery, verification
11. Power management: sleep modes, charging states
12. Provisioning protocol
13. Factory test procedure
14. Debug console: UART commands
15. Changelog
Appendix A — Pin assignment table (ESP32-S3 ↔ peripherals)
Appendix B — Flash partition map
Appendix C — Bosch BSEC2 integration notes
Appendix D — TLS certificate pinning procedure
```

---

## 13. DOCUMENT INDEX

All documents live in `docs/hardware/` within this repository:

```
docs/hardware/
├── LOT-COMPUTER-HARDWARE-SPEC-v1.md       ← THIS FILE (master spec)
├── firmware/
│   ├── FIRMWARE-DEVELOPER-MANUAL-v1.md
│   ├── FIRMWARE-CHANGELOG.md
│   └── PARTITION-TABLE.md
├── api/
│   ├── LOT-API-CONNECTOR-REFERENCE-v1.md
│   └── DEVICE-EVENT-SCHEMA.md
├── pcb/
│   ├── PCB-DESIGN-NOTES.md
│   ├── BOM-v1.csv
│   └── PCBWAY-ORDER-CHECKLIST.md
├── mechanical/
│   ├── ENCLOSURE-DRAWING-NOTES.md
│   └── ASSEMBLY-PROCEDURE.md
├── manuals/
│   ├── USER-GUIDE-v1.md
│   └── QUICK-START-CARD-v1.md
├── regulatory/
│   └── COMPLIANCE-ROADMAP.md
└── sessions/
    └── 2026-06-20_hardware-spec-session-v1.md  ← session log
```

---

## 14. REGULATORY & COMPLIANCE

### 14.1 Target Markets — Pilot Run

The 100-unit pilot is **not for retail sale** — it is a controlled distribution to LOT Systems users and internal team. Full regulatory certification is planned for the commercial release (v2 hardware).

Pilot units carry:
- **No FCC ID** (covered by "intentional radiator" exemption for R&D/evaluation < 2000 units, 47 CFR §15.23)
- **No CE mark** (pilot exempt under EU R&D provisions)
- Label: "FOR DEVELOPMENT AND EVALUATION ONLY — NOT FOR SALE"

### 14.2 Commercial Compliance Roadmap (post-pilot)

| Certification | Region        | Scope                           | Est. Cost | Est. Time  |
|---------------|---------------|---------------------------------|-----------|------------|
| FCC Part 15 B | USA           | Unintentional radiator (MCU)    | $800      | 4–6 weeks  |
| FCC Part 15 C | USA           | Intentional radiator (WiFi/BT)  | $2,500    | 6–8 weeks  |
| CE (RED)      | EU            | Radio Equipment Directive        | $3,500    | 8–12 weeks |
| CE (EMC)      | EU            | Electromagnetic Compatibility   | Bundled   | Bundled    |
| IC RSS-247    | Canada        | WiFi + BT                       | $1,200    | 4–6 weeks  |
| RoHS          | EU/Global     | Hazardous substances            | Supplier docs | Ongoing |
| UN38.3        | Global        | Lithium battery transport       | $800      | 3–4 weeks  |
| Qi WPC        | Global        | Wireless charging interop       | $2,000    | 4–6 weeks  |

**Note**: The ESP32-S3-MINI-1 module already holds FCC ID (2AC7Z-ESPRESSIFS3) and CE mark. Modular certification reduces the full-device scope significantly.

---

## 15. ROADMAP & NEXT ITERATIONS

### Hardware v1 (this document) — 100-unit pilot

Baseline device as specified above.

### Hardware v1.1 — Post-pilot refinements

- Adjust display brightness levels based on user feedback
- Refine notification font size and layout
- Battery capacity upgrade to 300 mAh if thickness allows (target 5.5 mm)
- Add second color option: gold PVD coating on polished face

### Hardware v2 — Commercial release

- FCC / CE / IC certified
- Retail-ready packaging
- Haptic motor (LRA) for tactile notification pulse
- NFC tag (passive, 13.56 MHz) for one-tap provisioning
- Color e-ink display option (for outdoor / always-on readability)
- eSIM or LTE-M option for cellular connectivity (no Wi-Fi required)
- Production volume: 1,000–10,000 units

### Platform Integration Upgrades

- Live WebSocket push (replace 30s polling with instant delivery)
- Multi-device support per LOT account (up to 5 LOT Computers)
- Device-to-device cohort sync (nearby devices see shared cohort nudges)
- Advanced sensor fusion with Memory Engine (weather + VOC → contextual AI prompts)

---

## APPENDIX A — ESP32-S3 PIN ASSIGNMENT

| GPIO  | Function         | Direction | Notes                          |
|-------|------------------|-----------|--------------------------------|
| GPIO0 | Boot mode        | IN        | Pull-up, low = flash mode      |
| GPIO1 | UART TX (debug)  | OUT       | USB-C debug connector          |
| GPIO2 | UART RX (debug)  | IN        | USB-C debug connector          |
| GPIO3 | SPI SCLK (OLED)  | OUT       | 40 MHz, SSD1351                |
| GPIO4 | SPI MOSI (OLED)  | OUT       | SSD1351 data                   |
| GPIO5 | OLED CS          | OUT       | Active low                     |
| GPIO6 | OLED DC          | OUT       | Data/Command select            |
| GPIO7 | OLED RST         | OUT       | Active low reset               |
| GPIO8 | I2C SDA (BME688) | I/O       | 4.7kΩ pull-up to 3.3V         |
| GPIO9 | I2C SCL (BME688) | OUT       | 4.7kΩ pull-up to 3.3V         |
| GPIO10| Button (COPY)    | IN        | 10kΩ pull-up, active low      |
| GPIO11| LED R            | OUT       | PWM, active high               |
| GPIO12| LED G            | OUT       | PWM, active high               |
| GPIO13| LED B            | OUT       | PWM, active high               |
| GPIO14| Charging STAT    | IN        | BQ51050B / MCP73831 status     |
| GPIO15| Camera PCLK      | IN        | OV2640 pixel clock             |
| GPIO16| Camera VSYNC     | IN        | OV2640 frame sync              |
| GPIO17| Camera HREF      | IN        | OV2640 line valid              |
| GPIO18| Camera XCLK      | OUT       | 20 MHz master clock to OV2640  |
| GPIO19| Camera D0–D7     | IN        | 8-bit DVP data bus             |
| GPIO35| Camera SDA (SCCB)| I/O       | OV2640 config via SCCB/I2C    |
| GPIO36| Camera SCL (SCCB)| OUT       | OV2640 config clock            |
| GPIO38| ADC (battery V)  | IN        | Voltage divider, battery level |

---

## APPENDIX B — COMPONENT DATASHEET LINKS

| Component     | Datasheet / Source                                              |
|---------------|-----------------------------------------------------------------|
| ESP32-S3-MINI | espressif.com/products/socs/esp32-s3                            |
| BME688        | bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688 |
| BQ51050B      | ti.com/product/BQ51050B                                         |
| MCP73831      | microchip.com/product/MCP73831                                  |
| SSD1351 OLED  | solomon-systech.com/product/ssd1351                             |
| OV2640        | ovt.com/sensors/OV2640                                          |
| PCBWay PCBA   | pcbway.com/pcb-assembly                                         |

---

## SESSION LOG — 2026-06-20

```
Session Type    : Hardware specification — LOT Computer pilot
Initiated by    : Vadik Marmeladov (Inventor, COSMO® CIA)
Completed by    : Claude Code (claude-sonnet-4-6)
Date            : 2026-06-20
Branch          : claude/brave-lamport-osllvg
Documents created:
  - docs/hardware/LOT-COMPUTER-HARDWARE-SPEC-v1.md  (this file)
Next action:
  - PCB schematic capture (KiCad or Altium)
  - Enclosure CAD (STEP files for CNC)
  - Firmware repo bootstrap (lot-computer-firmware)
  - API endpoints added to /src/server/routes/api.ts
  - PCBWay prototype order placed
```

---

*LOT Systems · lot-systems.com · COSMO® CIA · 2026*
