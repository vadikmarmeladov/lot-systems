<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — COSMO® CIA Hardware Report
### LOT-C1 Physical Device: Design, Components, Roadmap & Manufacturing Plan

**Document:** LOT_COMPUTER_HARDWARE_REPORT.md
**Classification:** Confidential — Product Engineering
**Prepared:** 2026-06-21
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems
**Division:** COSMO® CIA (Connected Intelligence Architecture)
**Session:** Claude / brave-lamport
**Document Version:** v1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Device Overview](#2-device-overview)
3. [Physical Design & Enclosure](#3-physical-design--enclosure)
4. [Electronics Architecture](#4-electronics-architecture)
5. [Component Selection & Bill of Materials](#5-component-selection--bill-of-materials)
6. [PCB Design & PCBWay Specification](#6-pcb-design--pcbway-specification)
7. [Firmware Architecture](#7-firmware-architecture)
8. [Software & LOT API Integration](#8-software--lot-api-integration)
9. [Wireless Charging System](#9-wireless-charging-system)
10. [AI-Grade Sensor Suite](#10-ai-grade-sensor-suite)
11. [Manufacturing Run: 100 Units](#11-manufacturing-run-100-units)
12. [PDF Manual Structure](#12-pdf-manual-structure)
13. [Document Index](#13-document-index)
14. [Roadmap](#14-roadmap)
15. [Appendix: Supplier Links](#15-appendix-supplier-links)

---

## 1. Executive Summary

The **LOT Computer (LOT-C1)** is a purpose-built hardware device that extends the LOT Systems platform into the physical world. It is a flat, pocket-sized intelligence pager — connected to `lot-systems.com` via WiFi — that receives autonomous AI notifications, captures environmental data, and transmits user intent signals back to the LOT Log tab with a single button press.

**Codename:** LOT-C1
**Form factor:** 40 × 40 × 5 mm (polished stainless steel tile)
**Weight:** ~22g estimated
**Production run:** 100 units (Pilot Series)
**Manufacturing path:** PCBWay (PCB + PCBA) → CNC machined SS enclosure → final assembly
**Connection:** WiFi → lot-systems.com REST + WebSocket API
**Power:** 150 mAh LiPo + Qi wireless charging (5W)

The device is not a phone. It is not a computer. It is a **physical LOT node** — a portal between the owner's behavioral profile and the world they inhabit. When the site says "Coffee time," the LOT-C1 shows it. When the user copies a moment to their Log, one press does it.

---

## 2. Device Overview

### What the LOT-C1 Does

| Function | Description |
|---|---|
| **Receive notifications** | Displays autonomous messages from lot-systems.com (e.g., "Coffee time!", wellness reminders, QOS alerts) |
| **Copy to Log** | Single hardware button sends a timestamped event to the LOT site's Log tab |
| **Weather awareness** | Onboard BME688 sensor captures temperature, humidity, pressure, air quality |
| **Visual capture** | OV2640 camera module for QR code scanning, visual confirmation |
| **Session compression** | Batches and compresses interaction data per session; uploads on WiFi reconnect |
| **Wireless charging** | Qi-compatible receiver coil; no exposed connector required |

### Design Philosophy

LOT-C1 is the physical embodiment of the LOT brand: **minimal, precise, and intentional**. No distractions. One screen, one button, one purpose. The mirror-polished face is a COSMO® signature surface — clean enough to see yourself. The back holds the intelligence.

---

## 3. Physical Design & Enclosure

### 3.1 Form Factor

```
Top view (back — active side):
┌────────────────────────────┐
│  ┌──────────┐    [CAM]     │
│  │          │              │
│  │  SCREEN  │   [BTN]      │
│  │ 0.96"    │              │
│  │  OLED    │   [LOGO]     │
│  └──────────┘              │
└────────────────────────────┘
         40mm × 40mm

Side profile (5mm total):
[FRONT POLISHED SS 0.5mm] [PCB + COMPONENTS 3.5mm] [BATTERY 0.5mm] [REAR SS 0.5mm]
Note: Camera module sits in a machined recess, projecting 0.8mm from rear face (camera bump, standard practice)
```

### 3.2 Enclosure Specification

| Parameter | Value |
|---|---|
| Outer dimensions | 40.0 × 40.0 × 5.0 mm |
| Corner radius | R2.0 mm |
| Material | 316L stainless steel (marine grade) |
| Front face finish | Mirror polish (#8 / Ra < 0.1 µm) |
| Rear face finish | Satin brush (180 grit, horizontal) |
| Wall thickness | 0.5 mm (CNC precision required) |
| Joint method | Two-part snap-fit with silicone O-ring gasket |
| Ingress protection | IP52 (splash resistant) |
| Mass (estimated) | 22 g ± 2 g |

### 3.3 Two-Part Body

**Part A — Front Shell (Polished):**
- Flat mirror surface, no openings
- Machined pocket inside for PCB + battery stack
- 4× M1.2 boss posts for PCB retention
- COSMO® CIA mark laser engraved on inner face (hidden when assembled)
- Qi wireless charging window: 0.3mm SS thinning at charging zone (allows magnetic flux through)

**Part B — Rear Shell (Active):**
- Brushed finish
- Machined openings:
  - 1× Camera aperture: 8.0 × 6.0 mm with optical-grade glass insert
  - 1× Screen window: 26.0 × 15.0 mm polycarbonate lens, flush-mounted
  - 1× Button aperture: 4.0 mm diameter, with tactile dome
  - 1× LOT® wordmark laser etched at bottom (0.3 mm deep)
- Silicone overmolded button cap (matte black, 3.5 mm diameter dome)

### 3.4 CNC Machining Notes

- Material: 316L SS billet (corrosion-resistant, non-magnetic enough for Qi)
- Minimum wall: 0.5 mm (achievable with 0.3 mm end mill at PCBWay CNC)
- 5-axis CNC required for internal pocket geometry
- Post-process: electropolish front half → hand polish to #8 → rinse
- Post-process rear: belt sand to 180 grit → vibro finish → laser etch marks
- Ultrasonic cleaning after all machining

---

## 4. Electronics Architecture

### 4.1 System Block Diagram

```
                    ┌────────────────────────────────────┐
                    │            LOT-C1 HARDWARE          │
                    │                                    │
  [WiFi/BT]─────────┤  ESP32-S3-WROOM-1 (MCU/Radio)     │
                    │  ├── SPI → 0.96" OLED              │
                    │  ├── CSI → OV2640 Camera           │
                    │  ├── I²C → BME688 (Weather/Gas)    │
                    │  ├── SPI → ICM-42688-P (IMU)       │
                    │  ├── GPIO → Tactile Button          │
                    │  ├── GPIO → Charge LED              │
                    │  └── I²C → BQ51013B (Qi Rx)        │
                    │                                    │
                    │  Power Rail:                        │
                    │  ├── LiPo 150mAh 3.7V              │
                    │  ├── MCP73831 (Charger IC)         │
                    │  ├── TPS62840 (3.3V DC-DC)         │
                    │  └── Qi Coil (receive) → 5V        │
                    └────────────────────────────────────┘
                                    │ WiFi
                          ┌─────────▼──────────┐
                          │  lot-systems.com    │
                          │  ├── REST API       │
                          │  ├── WebSocket      │
                          │  └── Log Tab        │
                          └────────────────────┘
```

### 4.2 Power Budget (estimated, active mode)

| Component | Current Draw |
|---|---|
| ESP32-S3 (WiFi active) | ~240 mA |
| OLED display (full white) | ~25 mA |
| OV2640 camera (idle) | ~10 mA |
| BME688 (forced mode) | ~3.7 mA |
| ICM-42688-P (low-noise) | ~1.3 mA |
| **Total peak** | **~280 mA** |
| ESP32-S3 (deep sleep) | 14 µA |
| **Total deep sleep** | **~0.05 mA** |

**Battery life estimate:**
- Active (notification check + display) 5 min/hour: ~6 hours continuous equivalent
- Practical standby (deep sleep + wake hourly): 72+ hours between charges

---

## 5. Component Selection & Bill of Materials

### 5.1 Master BOM — 100 Unit Run

| # | Component | Part Number | Supplier | Unit Cost | 100× Cost | Notes |
|---|---|---|---|---|---|---|
| 1 | MCU Module | ESP32-S3-WROOM-1-N8R8 | LCSC / Mouser | $3.20 | $320 | 8MB Flash, 8MB PSRAM, WiFi+BT 5.0 |
| 2 | Camera Module | OV2640 (1/4" CMOS, 2MP) | AliExpress / LCSC | $2.50 | $250 | CSI FPC connector, 24-pin |
| 3 | OLED Display | SSD1306, 0.96" 128×64 | LCSC | $2.00 | $200 | I²C or SPI, 3.3V, ultra-thin |
| 4 | Weather/Gas Sensor | BME688 | Mouser (Bosch) | $4.50 | $450 | Temp/Humidity/Pressure/VOC/AI |
| 5 | IMU | ICM-42688-P | Mouser (TDK) | $3.00 | $300 | 6-axis, AI-grade, low noise |
| 6 | Qi RX IC | BQ51013BRHLT | Mouser (TI) | $2.80 | $280 | 5W Qi receiver, WPC 1.1 |
| 7 | Qi RX Coil | WR202020-6F8-G | Mouser (Würth) | $1.80 | $180 | 20×20mm, 6.8µH, ultra-thin |
| 8 | Battery | LiPo 150mAh 3.7V (403030) | eBay/Alibaba | $2.20 | $220 | 4.0×30×30mm, JST-PH 2-pin |
| 9 | Charger IC | MCP73831T-2ACI/OT | Mouser | $0.65 | $65 | 500mA Li-Ion charger |
| 10 | DC-DC Converter | TPS62840DGRR | Mouser (TI) | $1.20 | $120 | 3.3V / 750mA, 90% eff |
| 11 | Tactile Button | EVPBB2AAD000 | Mouser | $0.45 | $45 | SMD, 3.5×2.9mm, 2.0N, 2mm travel |
| 12 | Silicone Button Cap | Custom molded | Local tooling | $1.50 | $150 | Matte black, 3.5mm dome |
| 13 | Camera Glass | AR-coated optical glass 8×6mm | Edmund Optics | $3.00 | $300 | AR coating, 0.5mm thick |
| 14 | Screen Lens | Polycarbonate 26×15mm | Plastronics | $1.20 | $120 | Hardcoated, 0.5mm |
| 15 | Silicone O-Ring | 36×36×0.5mm | McMaster-Carr | $0.30 | $30 | IP52 gasket |
| 16 | Stainless Enclosure | 316L, 2-part, CNC | PCBWay CNC | $32.00 | $3,200 | Mirror front + brushed back |
| 17 | PCB (bare) | 4-layer 38×38mm | PCBWay | $3.50 | $350 | ENIG, black solder mask |
| 18 | PCBA (SMD assembly) | — | PCBWay PCBA | $7.50 | $750 | All SMD components placed |
| 19 | Passive components | Resistors, caps, ferrite | LCSC | $4.00 | $400 | 0402 package, 150+ pads |
| 20 | Wireless Charger Pad | Qi 5W transmitter pad | Anker/OEM | $8.00 | $800 | White, USB-C input, accessory |
| 21 | USB-C Port (programming) | USB4135-GF-A | Mouser | $0.75 | $75 | Programming/debug only, hidden |
| 22 | FPC Connector (camera) | 24-pin 0.5mm pitch | LCSC | $0.40 | $40 | ZIF, SMD |
| 23 | LED (charge status) | Amber 0402 SMD | LCSC | $0.05 | $5 | Diffused, visible through gasket |
| 24 | M1.2×2mm screws | Stainless | McMaster | $0.10 | $10 | 4× per unit |
| 25 | ESD protection | PRTR5V0U2X | LCSC | $0.25 | $25 | USB-C and camera protection |
| — | **Packaging** | LOT-branded box, foam insert | Local print | $4.00 | $400 | Matte black box, debossed LOT® |
| — | **Quality testing** | Functional test jig per unit | In-house | $3.00 | $300 | WiFi, sensor, button, display |
| — | **Shipping & Customs** | Sea freight (China → USA) | DHL/UPS | $150 flat | $150 | 100 units, insured |

### 5.2 Total Cost Summary

| Category | Cost (100 units) |
|---|---|
| Electronics (BOM) | $4,135 |
| PCB + PCBA | $1,100 |
| Enclosure (CNC SS) | $3,200 |
| Accessories (charger, packaging) | $1,200 |
| Testing + QA | $300 |
| Shipping | $150 |
| **Grand Total** | **$10,085** |
| **Cost per unit** | **~$101** |
| **Suggested retail** | **$249 – $299** |
| **Gross margin at $249** | ~59% |

> All pricing is Q2 2026 estimates. Final BOM should be locked by quoting PCBWay, Mouser, and LCSC directly before production commitment.

---

## 6. PCB Design & PCBWay Specification

### 6.1 PCB Specifications

| Parameter | Value |
|---|---|
| Board size | 38.0 × 38.0 mm |
| Layer count | 4 |
| Stackup | Signal / GND / PWR / Signal |
| Thickness | 0.6 mm (ultra-thin, special order) |
| Copper weight | 1oz outer / 0.5oz inner |
| Surface finish | ENIG (immersion gold) |
| Solder mask | Matte black, both sides |
| Silkscreen | White, component side only |
| Min trace width | 0.1 mm |
| Min via drill | 0.2 mm |
| Min via pad | 0.4 mm |
| IPC class | Class 2 |
| Via tenting | Tented vias on GND layer |

### 6.2 PCBWay Order Parameters

**URL to start order:** https://www.pcbway.com/orderonline.aspx

| Field | Value |
|---|---|
| Quantity | 100 |
| Size | 38mm × 38mm |
| Layers | 4 |
| Material | FR4-TG155 |
| Thickness | 0.6mm |
| Surface Finish | ENIG |
| Solder Mask Color | Black |
| Silkscreen | White |
| Copper | 1oz outer |
| Gold Fingers | No |
| Test | Flying probe (recommended) |

**Estimated PCBWay cost (100 pcs, 4-layer 38×38mm):** ~$350–$420 USD

### 6.3 PCBA (Assembly) via PCBWay

PCBWay offers turnkey PCBA service:
1. Upload Gerber files + BOM + Pick & Place (CPL) file
2. PCBWay sources components or uses customer-provided parts
3. SMT paste + reflow oven assembly
4. Optional AOI (automated optical inspection)
5. Ships completed boards to USA

**PCBA quote link:** https://www.pcbway.com/pcb-assembly.html

**Key PCBA notes:**
- BQ51013B and Qi coil require careful thermal via placement (coil gets warm under charging)
- ESP32-S3-WROOM-1 requires 3D clearance check on 0.6mm board (module is 18mm tall — this is the board thickness issue, the module height is 3.1mm)
- Camera FPC connector requires ZIF alignment fixture during PCBA
- All passive 0402; verify PCBWay can handle 0402 at this scale (yes, standard)

### 6.4 Design Files Required

- `LOT-C1.kicad_pro` — KiCad 7 project
- `LOT-C1.kicad_sch` — Schematic
- `LOT-C1.kicad_pcb` — PCB layout
- `gerbers/` — Gerber + drill files (RS-274X format)
- `BOM_LOT-C1.csv` — Bill of materials
- `CPL_LOT-C1.csv` — Component placement list

> KiCad 7 (free, open source) is recommended for this design. Alternatively Altium Designer if the production house requires it.

---

## 7. Firmware Architecture

### 7.1 Stack

| Layer | Technology |
|---|---|
| **Framework** | ESP-IDF v5.x (Espressif official SDK) |
| **Language** | C / C++ |
| **RTOS** | FreeRTOS (built into ESP-IDF) |
| **WiFi** | ESP-IDF WiFi driver (WPA2/WPA3) |
| **WebSocket** | `esp_websocket_client` component |
| **HTTP** | `esp_http_client` |
| **Display driver** | SSD1306 over SPI (lvgl or custom) |
| **Camera driver** | ESP32-S3 camera component (OV2640) |
| **Sensor drivers** | BME688 (Bosch BSEC2 library) + ICM-42688 SPI |
| **OTA updates** | `esp_https_ota` (over-the-air firmware updates) |
| **NVS (storage)** | ESP-IDF NVS (WiFi credentials, JWT token, user config) |
| **Compression** | zlib (session data compression before upload) |

### 7.2 Firmware State Machine

```
BOOT
  │
  ▼
INIT (hardware bring-up, NVS read, WiFi credentials check)
  │
  ├─── No WiFi config ──► BLE CONFIG MODE
  │                        (user configures via phone BLE)
  │                        (stores SSID, password, LOT JWT)
  │
  ▼
WIFI CONNECT
  │
  ├─── Failed ──► DEEP SLEEP 60s ──► retry
  │
  ▼
LOT API AUTHENTICATE
  │
  ├─── 401 ──► ERROR SCREEN ("Re-pair device in LOT app")
  │
  ▼
WEBSOCKET CONNECT (lot-systems.com/hardware/ws)
  │
  ▼
IDLE / STANDBY
  │
  ├─── Notification received ──► DISPLAY MODE (show text 10s) ──► IDLE
  │
  ├─── Button pressed ──► COPY EVENT
  │                        POST /api/hardware/log
  │                        DISPLAY "Logged ✓" 3s
  │                        IDLE
  │
  ├─── Timer (every 30min) ──► SENSOR READ
  │                             BME688 forced mode
  │                             Store to NVS session buffer
  │                             IDLE
  │
  ├─── Timer (every 6h) ──► SESSION COMPRESS & UPLOAD
  │                          zlib compress NVS session data
  │                          POST /api/hardware/session
  │                          Clear NVS buffer
  │                          IDLE
  │
  └─── No activity 60s ──► LIGHT SLEEP (display off, WiFi modem sleep)
```

### 7.3 Deep Sleep & Power Management

- **Deep sleep:** entered after 5 min of no WiFi activity (battery saver mode)
- **Wake sources:** GPIO button press, RTC timer (30 min for sensor reads)
- **Light sleep:** WiFi modem sleep, display off, ESP32-S3 at 80MHz (vs 240MHz active)
- **Charging detection:** BQ51013B signals VBUS_DET to ESP32 GPIO → prevents deep sleep while charging

### 7.4 OTA Firmware Update Flow

```
LOT site admin pushes new firmware → firmware.lot-systems.com/ota/lot-c1/latest.bin
Device wakes, checks SHA256 hash
If new version: download + verify + write partition → reboot into new firmware
Rollback protection: if new firmware fails boot 3×, reverts to previous
```

### 7.5 Firmware Document List (see Section 13)

- `FW-001` — Hardware Bring-Up Guide
- `FW-002` — Firmware Build Environment Setup
- `FW-003` — Flashing & Programming Guide
- `FW-004` — OTA Update System
- `FW-005` — WiFi & BLE Configuration Protocol
- `FW-006` — LOT API WebSocket Message Format
- `FW-007` — Sensor Driver Reference
- `FW-008` — Power Management & Sleep Modes
- `FW-009` — Session Compression Format
- `FW-010` — Firmware Changelog

---

## 8. Software & LOT API Integration

### 8.1 New API Endpoints Required (lot-systems.com)

The following endpoints must be added to the LOT Systems backend:

#### `POST /api/hardware/register`
Register a new LOT-C1 device to a user account.

```json
Request:
{
  "device_id": "LOT-C1-XXXXXXXX",  // unique hardware ID (ESP32 MAC)
  "firmware_version": "1.0.0",
  "user_jwt": "eyJ..."
}

Response:
{
  "device_token": "hw_tok_...",  // long-lived device token
  "websocket_url": "wss://lot-systems.com/hardware/ws"
}
```

#### `GET /api/hardware/ws` (WebSocket)
Real-time notification channel.

```json
Server → Device messages:
{
  "type": "notification",
  "text": "Coffee time!",
  "priority": "normal"  // normal | urgent | silent
}

{
  "type": "command",
  "action": "ota_check"  // or "display_clear", "sensor_request"
}

Device → Server messages:
{
  "type": "heartbeat",
  "battery_pct": 82,
  "wifi_rssi": -65,
  "firmware": "1.0.0"
}
```

#### `POST /api/hardware/log`
Button press → LOT Log tab entry.

```json
Request (device sends):
{
  "device_id": "LOT-C1-XXXXXXXX",
  "device_token": "hw_tok_...",
  "event": "copy_button_press",
  "timestamp": "2026-06-21T14:32:00Z",
  "context": {
    "last_notification": "Coffee time!",
    "battery_pct": 82,
    "sensor_snapshot": {
      "temp_c": 22.4,
      "humidity_pct": 48,
      "pressure_hpa": 1013.2,
      "iaq_score": 95
    }
  }
}

Response:
{
  "log_id": "log_abc123",
  "logged_at": "2026-06-21T14:32:01Z"
}
```

> **Log Tab UI:** The existing LOT Log tab should show hardware-sourced entries with a `[LOT-C1]` badge and the sensor snapshot collapsed below each entry.

#### `POST /api/hardware/session`
Compressed session data upload (every 6 hours).

```json
Request:
{
  "device_id": "...",
  "device_token": "...",
  "session_start": "2026-06-21T08:00:00Z",
  "session_end": "2026-06-21T14:00:00Z",
  "data_compressed": "<base64 zlib-compressed JSON>"
}
```

### 8.2 LOT Site Admin Panel — Hardware Tab

A new **Hardware** section in the LOT admin panel:

| Feature | Description |
|---|---|
| Device registry | List all registered LOT-C1 units, status, last seen |
| Notification push | Send custom notification to one or all devices |
| Firmware deploy | Push OTA update to all devices or specific unit |
| Log view | Filter Log tab by `[LOT-C1]` source |
| Sensor dashboard | Time-series view of temperature, humidity, IAQ from all devices |

### 8.3 Mobile Companion App (Pairing)

Initial device pairing is done via BLE using a lightweight web-based tool or native app:

1. Press button 3× to enter BLE pairing mode
2. Open `lot-systems.com/pair` on phone (browser BLE API)
3. Select "LOT-C1" in browser BLE scan
4. Enter WiFi SSID + password
5. App sends user's JWT to device via BLE GATT write
6. Device stores credentials in NVS
7. Device reboots, connects to WiFi, registers with API
8. Pairing complete — device shows "Connected ✓"

---

## 9. Wireless Charging System

### 9.1 Specification

| Parameter | Value |
|---|---|
| Standard | Qi (WPC 1.1) |
| Power input to pad | 5W (5V / 1A via USB-C) |
| Power delivered to device | 3–5W |
| Receiver IC | BQ51013BRHLT (Texas Instruments) |
| Receiver coil | Würth Elektronik WR202020-6F8-G (20×20mm, 6.8µH) |
| Charging voltage | 5V from Qi → MCP73831 → LiPo 4.2V |
| Charge time (empty to full) | ~30 minutes (150 mAh @ ~300mA effective) |
| Transmitter pad | Qi-certified 5W pad (accessory, included in box) |

### 9.2 Stainless Steel Qi Penetration

316L stainless steel is non-ferromagnetic but is still conductive, which can cause eddy current losses that reduce Qi efficiency. Two design mitigations:

1. **Thinned charging zone:** Front shell is thinned to 0.15mm in the 22×22mm charging window area (CNC machined pocket from inside face). This reduces eddy current interference while maintaining structural integrity.
2. **Ferrite sheet:** 0.1mm ferrite sheet (TDK IFL12-001ER) placed between the Qi coil and PCB inside the device. This shields PCB from magnetic field and improves coupling efficiency to ~75–80% (vs ~50% without ferrite).

### 9.3 Charging Accessory

The included wireless charger pad:
- White matte polycarbonate, 80×80×8mm
- USB-C input, 5V/2A
- Single-coil Qi transmitter
- Charge indicator LED (amber = charging, green = full)
- Custom printed with LOT® wordmark on base
- Cable: USB-C to USB-A, 1.2m braided, included

---

## 10. AI-Grade Sensor Suite

### 10.1 BME688 — Environmental Intelligence Sensor

**Manufacturer:** Bosch Sensortec
**Part:** BME688

This is the flagship environmental sensor for LOT-C1. The BME688 includes Bosch's **BSEC2** (Bosch Sensortec Environmental Cluster 2) AI library which runs **on-device** to compute:

| Output | Description |
|---|---|
| Temperature | ±0.5°C accuracy, 0–65°C range |
| Relative Humidity | ±3% RH, 10–90% range |
| Barometric Pressure | ±0.12 hPa, 300–1100 hPa |
| Gas Resistance | Raw MOX sensor value |
| **IAQ (Indoor Air Quality)** | 0–500 AI score computed by BSEC2 |
| **CO₂ equivalent** | Estimated CO₂ ppm via AI model |
| **VOC equivalent** | Estimated total VOC via AI model |
| **Breath VOC** | Exhaled VOC detection |

The BSEC2 library runs an on-device ML model that self-calibrates over 24–48 hours of use, producing increasingly accurate air quality scores without any cloud dependency.

**Why BME688 for LOT:**
The IAQ score directly maps to LOT's wellness data. "Coffee time!" notifications can be made smarter: the site sends the notification *and* the device's local air quality tells the LOT platform whether the user's environment is optimal.

### 10.2 ICM-42688-P — Motion Intelligence

**Manufacturer:** TDK InvenSense
**Part:** ICM-42688-P

| Feature | Spec |
|---|---|
| Gyroscope | ±2000 dps, noise 0.0028 dps/√Hz |
| Accelerometer | ±16g, noise 70 µg/√Hz |
| ODR | Up to 32kHz |
| Power (low-noise mode) | 1.35mA (gyro + accel) |
| On-device FIFO | 4KB |

**Use case for LOT-C1:**
- Detect device pick-up → wake screen
- Detect orientation → auto-rotate display
- Detect desk tap pattern → future gesture shortcuts
- Motion data compressed into session upload for LOT behavioral pattern analysis

### 10.3 Future Sensor Expansion Slot

The PCB includes one unpopulated 4-pad I²C header (2×2, 1mm pitch) accessible from inside the enclosure for R&D sensor attachment:
- MAX30102 (pulse oximetry) — future health version
- UV sensor (VEML6075) — outdoor version
- Haptic driver (DRV2605) — future tactile feedback

---

## 11. Manufacturing Run: 100 Units

### 11.1 Production Timeline

| Phase | Activity | Duration | Owner |
|---|---|---|---|
| W1–W2 | KiCad schematic + PCB layout complete | 2 weeks | Hardware engineer |
| W3 | DRC/ERC pass, design review | 3 days | Vadik review |
| W4 | Gerber + BOM + CPL export; PCBWay quote | 3 days | Hardware engineer |
| W5–W6 | PCBWay prototype run (5 pcs, unassembled) | 10 days | PCBWay |
| W7 | Prototype bring-up, firmware flash, basic function test | 3 days | Firmware engineer |
| W8 | PCBWay PCBA order placed (100 units) | 1 day | Vadik |
| W9–W11 | PCBWay PCBA production (soldering + AOI) | 3 weeks | PCBWay |
| W10 | CNC enclosure order placed (PCBWay CNC or 3rd party) | 1 day | Vadik |
| W10–W13 | Enclosure CNC machining + finishing | 4 weeks | CNC shop |
| W12–W13 | Firmware final build + OTA test | 2 weeks | Firmware engineer |
| W14 | LOT API endpoints developed and deployed | concurrent | Software engineer |
| W15 | Final assembly: PCBA into enclosure, adhesive, gasket | 3 days | In-house |
| W16 | QA functional testing (100% units) | 1 week | QA |
| W17 | Packaging, documentation insertion | 3 days | Operations |
| W18 | Pilot shipment to first 10 LOT users (beta) | — | LOT team |

**Total timeline: 18 weeks from design start to first delivery.**
**Target start date: 2026-07-01**
**Target delivery: 2026-11-01**

### 11.2 Quality Assurance Protocol

Each unit undergoes the following before packaging:

| Test | Method | Pass Criteria |
|---|---|---|
| Power-on | Apply 3.7V LiPo | No smoke, voltage rails stable |
| WiFi | Connect to test AP | RSSI < -80 dBm, API auth success |
| Display | Show test pattern | All pixels functional, no dead zones |
| Camera | Capture QR code | Decode "LOT-C1-TEST" QR successfully |
| BME688 | Read all outputs | Temp ±2°C of reference, humidity ±5% |
| ICM-42688 | Shake test | Accel magnitude 9.8 ± 0.5 m/s² at rest |
| Button | Press 5× | All presses register, Log API returns 200 |
| Wireless charging | Place on pad | BQ51013B VBUS_DET asserts within 2s |
| Charge LED | Visual | LED illuminates amber during charge |
| Battery | 10% discharge cycle | Capacity >130mAh |
| OTA | Flash test firmware | OTA completes, SHA256 verified |
| **Final: IP52** | Light mist spray | No function degradation |

### 11.3 Packaging Contents (per unit)

1. LOT-C1 device (fully assembled, charged)
2. Qi wireless charging pad (LOT-branded)
3. USB-C cable (1.2m braided, for pad)
4. Quick Start Card (credit card size, matte black, silver print)
5. PDF manual download card (QR code → lot-systems.com/hardware/manual)
6. LOT® sticker (small, 20mm, mirror silver)

---

## 12. PDF Manual Structure

The LOT-C1 ships with a professionally produced PDF manual. It is generated from Markdown source and exported via Pandoc + LaTeX. Content structure:

### Volume 1: User Manual (PDF-UM-001)

```
Cover: LOT-C1 User Manual — COSMO® CIA
       Silver embossed design, minimal

1. What is LOT-C1?
   - Device purpose
   - Connection to lot-systems.com
   - COSMO® CIA division context

2. In the Box
   - Parts diagram

3. First Setup
   3.1 Charge the device (30 min)
   3.2 Pair with your LOT account (BLE + lot-systems.com/pair)
   3.3 Verify connection (screen shows "Connected ✓")

4. Daily Use
   4.1 Receiving notifications
   4.2 The Copy button — what it does and when to press it
   4.3 Reading the status screen
   4.4 Battery indicator

5. Charging
   5.1 Place device face-up on pad
   5.2 Charge indicator colors
   5.3 Battery care

6. Sensor Data on LOT Site
   6.1 Where to see your weather sensor readings
   6.2 IAQ score interpretation
   6.3 Log tab hardware entries

7. Firmware Updates
   7.1 Automatic OTA
   7.2 Manual check

8. Troubleshooting
   - Device won't connect
   - Screen blank
   - Button not responding
   - No notifications

9. Specifications
   (full spec table)

10. Legal & Safety
    FCC ID, CE, RoHS
    Warranty (1 year)
    Support: hardware@lot-systems.com
```

### Volume 2: Firmware Developer Reference (PDF-FW-001)

```
1. Architecture Overview
2. Build Environment (ESP-IDF v5.x)
3. Flash & Debug (JTAG, USB-C)
4. API Message Reference
5. NVS Key Map
6. Power State Machine
7. OTA Server Protocol
8. Contributing Guidelines
```

### Volume 3: Hardware Engineering Reference (PDF-HW-001)

```
1. Schematic (full)
2. PCB Layer Stack (cross-section)
3. BOM (complete)
4. Mechanical Drawings (DXF)
5. Enclosure Tolerances
6. Test Procedures
7. Errata (known issues)
```

**PDF Generation Pipeline:**
```bash
# Using Pandoc + LaTeX (Eisvogel template)
pandoc user-manual.md -o PDF-UM-001_LOT-C1_User-Manual.pdf \
  --template eisvogel \
  --metadata title="LOT-C1 User Manual" \
  --metadata author="LOT Systems / COSMO® CIA" \
  --metadata date="2026-11-01" \
  --highlight-style tango
```

---

## 13. Document Index

All documents created as part of the LOT-C1 program are filed in `docs/hardware/`:

| Document ID | Filename | Status | Description |
|---|---|---|---|
| HW-001 | `LOT_COMPUTER_HARDWARE_REPORT.md` | ✅ Complete | This document — master overview |
| HW-002 | `LOT-C1_Schematic.pdf` | ⬜ Pending | KiCad schematic export |
| HW-003 | `LOT-C1_PCB_Layout.pdf` | ⬜ Pending | PCB fabrication drawing |
| HW-004 | `LOT-C1_BOM_v1.0.csv` | ⬜ Pending | Machine-readable BOM for PCBWay |
| HW-005 | `LOT-C1_Enclosure_Drawings.dxf` | ⬜ Pending | CNC mechanical drawings |
| HW-006 | `LOT-C1_QA_Protocol.md` | ⬜ Pending | Test procedures (expanded) |
| FW-001 | `LOT-C1_Firmware_Bringup.md` | ⬜ Pending | Hardware bring-up guide |
| FW-002 | `LOT-C1_Firmware_Build.md` | ⬜ Pending | ESP-IDF setup, compile, flash |
| FW-003 | `LOT-C1_OTA_System.md` | ⬜ Pending | OTA architecture |
| FW-004 | `LOT-C1_API_Protocol.md` | ⬜ Pending | WebSocket + REST message format |
| FW-005 | `LOT-C1_Session_Format.md` | ⬜ Pending | Session compression schema |
| SW-001 | `LOT-C1_API_Endpoints.md` | ⬜ Pending | New backend endpoints spec |
| SW-002 | `LOT-C1_Admin_Panel.md` | ⬜ Pending | Hardware admin UI spec |
| SW-003 | `LOT-C1_Pairing_Protocol.md` | ⬜ Pending | BLE pairing flow |
| PDF-UM-001 | `LOT-C1_User-Manual.pdf` | ⬜ Pending | End-user PDF manual |
| PDF-FW-001 | `LOT-C1_Firmware-Reference.pdf` | ⬜ Pending | Developer PDF reference |
| PDF-HW-001 | `LOT-C1_Hardware-Reference.pdf` | ⬜ Pending | Engineering PDF reference |

---

## 14. Roadmap

### Phase 1 — Design & Prototype (Q3 2026)
**Milestone:** 5 working prototypes in hand

- [ ] Complete KiCad schematic and PCB layout
- [ ] Order PCBWay prototype run (5× PCBs, unassembled)
- [ ] Source all BOM components for hand-assembly of 5 units
- [ ] Flash ESP-IDF firmware on prototype
- [ ] Test WiFi, WebSocket, button → Log API
- [ ] Test BME688 + BSEC2 AI library
- [ ] 3D-print provisional enclosure (SLA resin, form factor validation)
- [ ] Develop LOT API endpoints (`/hardware/register`, `/hardware/log`, `/hardware/ws`)
- [ ] Internal beta: 3 LOT team members carry prototype 2 weeks

### Phase 2 — Production Run (Q4 2026)
**Milestone:** 100 units assembled and quality-tested

- [ ] PCBWay PCBA order (100 units, full SMD assembly)
- [ ] CNC SS enclosure order (100× front + rear shells)
- [ ] Final assembly in-house (PCB into enclosure)
- [ ] QA testing 100% units (functional test jig)
- [ ] OTA firmware deployed to all 100 units
- [ ] PDF manuals finalized and printed (inserted in packaging)
- [ ] Wireless charger pads received and branded

### Phase 3 — Pilot Deployment (Q4 2026 – Q1 2027)
**Milestone:** 50 units in the hands of LOT users, data flowing

- [ ] Ship first 10 units to LOT Benchmark Purple+ users (beta cohort)
- [ ] Monitor Log tab for hardware events (validate button → log flow)
- [ ] Collect BME688 environmental data across user locations
- [ ] Notify via site push + device screen in tandem
- [ ] Gather feedback: notification value, Copy button usage, battery life
- [ ] OTA firmware v1.1 based on beta feedback
- [ ] Ship remaining 40 pilot units to Usership waitlist

### Phase 4 — COSMO® CIA Full Launch (Q2 2027, pre-IPO)
**Milestone:** LOT-C1 listed as purchasable product at $249

- [ ] FCC + CE certification (hardware must be certified before retail sale)
- [ ] UL listing for Qi charger accessory
- [ ] Production ramp: 500 units (second run, refined design)
- [ ] LOT site product page + checkout integration
- [ ] Hardware section in LOT subscription tiers (LOT-C1 included with Black-tier annual)
- [ ] COSMO® soul sync feature: device behavior personalized to Benchmark score
- [ ] Press kit: LOT-C1 as IPO hardware story ($4/share, Jan 25, 2027)

### Phase 5 — COSMO® Robot Integration (2028+)
**Milestone:** LOT-C1 becomes the remote display for COSMO® robot units

- [ ] LOT-C1 receives notifications from COSMO® robot status
- [ ] Copy button acknowledges robot action requests
- [ ] Camera used for COSMO® visual handshake (QR pairing)
- [ ] Hardware platform extended to COSMO® Companion wearable line

---

## 15. Appendix: Supplier Links

### PCB Manufacturing
- **PCBWay PCB:** https://www.pcbway.com/orderonline.aspx
- **PCBWay PCBA:** https://www.pcbway.com/pcb-assembly.html
- **PCBWay CNC:** https://www.pcbway.com/rapid-prototyping/manufacture/

### Component Sourcing
- **Mouser Electronics (USA):** https://www.mouser.com
- **LCSC Electronics (China):** https://www.lcsc.com
- **DigiKey (USA):** https://www.digikey.com

### Key Component Datasheets & Order Pages
| Component | Datasheet | Order |
|---|---|---|
| ESP32-S3-WROOM-1 | https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf | Mouser #356-ESP32-S3-WROOM-1N8 |
| BME688 | https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme688-ds000.pdf | Mouser #828-BME688 |
| ICM-42688-P | https://invensense.tdk.com/wp-content/uploads/2020/04/ds-000347_icm-42688-p-datasheet.pdf | Mouser #926-ICM42688PICM4I |
| BQ51013B | https://www.ti.com/lit/gpn/bq51013b | Mouser #595-BQ51013BRHLT |
| MCP73831 | https://ww1.microchip.com/downloads/en/DeviceDoc/MCP73831-Family-Data-Sheet-DS20001984H.pdf | Mouser #579-MCP73831T-2ACI/OT |
| TPS62840 | https://www.ti.com/lit/ds/symlink/tps62840.pdf | Mouser #595-TPS62840DGRR |
| WR202020-6F8-G | https://www.we-online.com/catalog/en/WR202020-6F8-G | Mouser #710-760308101209 |
| OV2640 module | https://www.uctronics.com/download/cam_module/OV2640DS.pdf | AliExpress / LCSC |

### Firmware & Tools
- **ESP-IDF:** https://github.com/espressif/esp-idf
- **BSEC2 Library (Bosch):** https://www.bosch-sensortec.com/software-tools/software/bme688-software/
- **KiCad (PCB design):** https://www.kicad.org
- **Pandoc (PDF generation):** https://pandoc.org
- **Eisvogel LaTeX template:** https://github.com/Wandmalfarbe/pandoc-latex-template

### LOT Systems Hardware
- **Device pairing:** https://lot-systems.com/pair *(to be built)*
- **Hardware admin:** https://lot-systems.com/admin/hardware *(to be built)*
- **OTA server:** https://firmware.lot-systems.com/ota/lot-c1/ *(to be built)*
- **Manual download:** https://lot-systems.com/hardware/manual *(to be built)*

---

## Closing Note

The LOT-C1 is not a gadget. It is a **physical proof** that the LOT platform is real — that the Quantum Intent Engine, the behavioral patterns, the Memory Engine, and the Benchmark are not just digital abstractions. They live in a polished steel tile in your pocket that tells you when to have coffee, remembers every moment you mark as worthy, and carries the LOT® signature: **minimal, intentional, yours.**

One hundred units. One inventor. One platform on the path to $4/share.

**Made in the USA. Built at PCBWay. Shipped to the world.**

---

*LOT Systems, Inc. — COSMO® CIA Division*
*Vadim Marmeladov, Inventor*
*2026-06-21*
*docs/hardware/LOT_COMPUTER_HARDWARE_REPORT.md*
