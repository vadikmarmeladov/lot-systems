<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-C1 — Hardware Computer Design Report

**Document ID:** LOT-HW-C1-001  
**Date:** 2026-06-06  
**Classification:** RESTRICTED — S-2 EYES  
**Inventor:** Vadik Marmeladov — COSMO® CIA  
**Branch:** claude/brave-lamport-YV2bL  
**Version:** 1.0.0  
**Status:** DESIGN DRAFT — READY FOR ENGINEERING REVIEW

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Physical Specification](#2-physical-specification)
3. [System Architecture](#3-system-architecture)
4. [Bill of Materials — Full Component List](#4-bill-of-materials--full-component-list)
5. [PCBWay Manufacturing Plan](#5-pcbway-manufacturing-plan)
6. [Enclosure Design — Stainless Steel Body](#6-enclosure-design--stainless-steel-body)
7. [LOT API Connector Specification](#7-lot-api-connector-specification)
8. [Firmware Architecture](#8-firmware-architecture)
9. [Software — Desktop/Mobile Companion](#9-software--desktopmobile-companion)
10. [Wireless Charging System](#10-wireless-charging-system)
11. [Sensor Suite](#11-sensor-suite)
12. [Copy Button — Log Tab Signal Protocol](#12-copy-button--log-tab-signal-protocol)
13. [Notification Display System](#13-notification-display-system)
14. [Session Compression Protocol](#14-session-compression-protocol)
15. [100-Unit Production Roadmap](#15-100-unit-production-roadmap)
16. [PDF Manual Structure](#16-pdf-manual-structure)
17. [Firmware Document Index](#17-firmware-document-index)
18. [Risk & Design Trade-offs](#18-risk--design-trade-offs)
19. [Procurement Links & Supplier Contacts](#19-procurement-links--supplier-contacts)
20. [Session Report Summary](#20-session-report-summary)

---

## 1. Executive Summary

The **LOT-C1** is the first physical hardware node of the LOT Systems ecosystem — a palm-sized, AI-connected pager that extends the LOT platform from software into the physical world. It is a 40 × 40 × 6mm stainless steel device that receives autonomous notifications from lot-systems.com ("Coffee time!"), senses its environment, photographs its context, and logs actions back to the platform with a single button press.

The LOT-C1 is not a phone, not a watch, not a tablet. It is a **signal device** — a quiet presence on a desk or in a pocket that carries the intelligence of the LOT platform into the physical environment without demanding attention.

**Primary Use Cases:**
- Receive AI-generated life-rhythm notifications from lot-systems.com
- Press **COPY** to log any moment to the LOT Log tab instantly
- Ambient weather + environmental awareness (visible on site dashboard)
- Autonomous session snapshots via onboard camera
- Qi wireless charging — place and forget

**Target User:** LOT USERSHIP holders — Purple/Black tier Benchmark holders who qualify for COSMO® hardware sync.

**Manufacturing:** PCBWay (PCB fabrication + CNC stainless enclosure)  
**First Run:** 100 units  
**Unit Target Cost (BOM):** < $85 at 100 qty  
**Retail Target Price:** $249–$399

---

## 2. Physical Specification

```
┌─────────────────────────────────────────┐
│         LOT-C1 Physical Form Factor      │
│                                          │
│  Width:   40.0 mm                        │
│  Height:  40.0 mm                        │
│  Depth:   6.0 mm  (target: 5mm)*         │
│  Mass:    ~38g (stainless + internals)   │
│  Shape:   Square, chamfered 1mm corners  │
└─────────────────────────────────────────┘

* 5mm total depth is at the absolute limit of achievable physics
  given a Qi coil (0.8mm), LiPo cell (2mm), PCB (1.0mm), and two
  stainless shells (0.5mm each). 6mm is the engineering-safe target.
  A "5mm" marketing spec is possible if battery is placed laterally
  and the back shell uses recessed geometry. See §6.
```

### Side A — Mirror Polish (Back)

| Feature | Detail |
|---------|--------|
| Material | 316L Stainless Steel |
| Finish | Mirror-polished (#8 finish, Ra < 0.05μm) |
| Thickness | 0.5mm shell wall |
| Markings | Laser-engraved: LOT® logo (center), serial number (edge) |
| Wireless charge window | Polycarbonate inlay (transparent, 20×20mm) flush with steel |

> The polished back doubles as a reflective surface and a Qi charge-through window. The Qi coil is positioned behind the PC inlay.

### Side B — Functional Face (Front)

```
┌──────────────────────────────────────────┐
│  ┌──────────┐     ●  Camera (HM01B0)     │
│  │          │                             │
│  │  OLED    │     Himax 1/6" 320×320     │
│  │  Display │     f/2.0 fixed focus      │
│  │ 128×128  │                             │
│  │  1.3"    │                             │
│  └──────────┘                             │
│                                           │
│         [ COPY ]  ← LOT Log button       │
│                                           │
│  ▪ USB-C port (bottom edge, flush)        │
└──────────────────────────────────────────┘
```

| Feature | Detail |
|---------|--------|
| Material | 316L Stainless Steel, brushed finish (180 grit) |
| Display aperture | 32×32mm rectangular cutout, Gorilla Glass 3 cover |
| Camera aperture | 6mm circular cutout, AR-coated sapphire lens cover |
| Button aperture | 8×8mm square recess, flush stainless steel keycap |
| Port | USB-C 2.0 (firmware flash + emergency charge), bottom edge |
| Finish | Brushed satin (grain horizontal) |

---

## 3. System Architecture

```
┌───────────────────────── LOT-C1 SYSTEM ──────────────────────────┐
│                                                                    │
│  ┌─────────────┐   SPI    ┌──────────────┐                        │
│  │ ESP32-S3    │◄────────►│ SH1107 OLED  │ 1.3" 128×128          │
│  │ (MCU+WiFi)  │          └──────────────┘                        │
│  │             │   DVP/   ┌──────────────┐                        │
│  │  240MHz     │◄────────►│ HM01B0 Cam  │ 1/6" 320×320          │
│  │  8MB Flash  │          └──────────────┘                        │
│  │  8MB PSRAM  │   I2C    ┌──────────────┐                        │
│  │             │◄────────►│ BME688 Sensor│ Weather + AI gas       │
│  │             │   I2C    ┌──────────────┐                        │
│  │             │◄────────►│ LIS2DH12     │ Accelerometer          │
│  │             │   GPIO   ┌──────────────┐                        │
│  │             │◄─────────│ COPY Button  │ Tactile, 0.5N          │
│  │             │   I2C    ┌──────────────┐                        │
│  │             │◄────────►│ BQ25185      │ Battery charger        │
│  └──────┬──────┘          └──────────────┘                        │
│         │ WiFi 802.11b/g/n                                         │
│         │ BLE 5.0                                                  │
│         ▼                                                          │
│  ┌──────────────┐   WPC    ┌──────────────┐                       │
│  │ LiPo 150mAh │◄─────────│ BQ51013B     │ Qi Rx (5W)            │
│  │ 40×30×2mm   │          │ Wireless Rx  │                        │
│  └──────────────┘          └──────────────┘                       │
│                                                                    │
│         WiFi/BLE ▲                                                 │
└───────────────────────────────────────────────────────────────────┘
                   │
                   ▼
         lot-systems.com API
              │         │
        Notifications   Log Tab
       (WebSocket push)  (POST /api/log)
```

### Block Diagram Summary

| Block | Component | Interface | Power |
|-------|-----------|-----------|-------|
| MCU | ESP32-S3-MINI-1U | — | 3.3V, 80–250mW |
| Display | SH1107 1.3" OLED | SPI | 3.3V, 20mW |
| Camera | Himax HM01B0 | DVP 8-bit | 1.8V, 2mW |
| Weather/AI | Bosch BME688 | I2C | 3.3V, 2.1mW |
| Motion | ST LIS2DH12TR | I2C | 3.3V, <0.5mW |
| Wireless Rx | TI BQ51013BRHLR | WPC Qi | 5W in |
| Battery charger | TI BQ25185YFPR | I2C | — |
| Battery | Custom LiPo | — | 3.7V 150mAh |
| Button | Alps SKQGABE010 | GPIO | — |

---

## 4. Bill of Materials — Full Component List

> All prices listed are estimated unit cost at **Qty 100**. Verify at time of order.

### 4.1 Microcontroller

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 1 | **ESP32-S3-MINI-1U-N8R8** | MCU, WiFi+BLE, 8MB Flash, 8MB PSRAM | 1 | $3.20 | Mouser / DigiKey | [Mouser](https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-MINI-1U-N8R8) |

**Why ESP32-S3:** Native camera (DVP) interface, dual-core 240MHz, WiFi 802.11n, BLE 5.0, hardware cryptography for API auth, USB OTG for firmware flash. The MINI-1U variant (U = external antenna) fits within 40×40mm PCB. The antenna connects to a small flex PCB patch antenna routed along the device edge.

### 4.2 Display

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 2 | **ER-OLED1.3-1W** | 1.3" OLED 128×128, SH1107, SPI, 3.3V | 1 | $4.80 | BuyDisplay / LCSC | [BuyDisplay](https://www.buydisplay.com/white-1-3-inch-oled-display-module-128x128-arduino-spi) |

**Why 1.3" OLED:** Sufficient resolution for notification text + LOT branding icon. SPI interface (faster than I2C). Very low power in standby (<0.1mW). The 30×30mm active area fits the 32×32mm display aperture. Alternative: Waveshare 1.3" OLED HAT equivalent bare panel.

### 4.3 Camera

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 3 | **HM01B0-MNA** | Himax 1/6" 320×320 QVGA, DVP, BAYER, 1.8V | 1 | $2.10 | Himax direct / Arrow | [Arrow](https://www.arrow.com/en/products/hm01b0-mna/himax-technologies) |

**Why Himax HM01B0:** Ultra-compact 3.6×3.1mm die, only 1.7mm total height with flex PCB. AI-trained for motion detection at <2mW. Used in Arduino Nicla Vision and OpenMV Cam H7+. DVP interface connects directly to ESP32-S3 camera input. Fixed focus f/2.0 lens covers 70° FoV — suitable for scene capture, not portrait zoom.

### 4.4 Weather + AI Gas Sensor

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 4 | **BME688** | Bosch 4-in-1: Temp/Humidity/Pressure/Gas, AI VOC, I2C | 1 | $4.50 | Mouser | [Mouser](https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688) |

**Why BME688:** The BME688 includes Bosch's AI-Edge™ engine for gas pattern recognition. It classifies air quality into categories that the LOT platform can surface as contextual notifications ("Air quality declining — consider opening a window"). 3×3×0.93mm — fits in any corner. I2C, single power rail.

### 4.5 Motion / Gesture Sensor

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 5 | **LIS2DH12TR** | ST 3-axis accelerometer, I2C/SPI, ±2/±4/±8/±16g | 1 | $0.85 | DigiKey | [DigiKey](https://www.digikey.com/en/products/detail/stmicroelectronics/LIS2DH12TR/4291594) |

**Use:** Tap detection for wake-on-tap, orientation sensing, activity logging to LOT session data.

### 4.6 Wireless Charging Receiver

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 6 | **BQ51013BRHLR** | TI Qi WPC 1.x receiver, 5W, I2C, VOUT reg | 1 | $2.30 | Mouser | [Mouser](https://www.mouser.com/ProductDetail/Texas-Instruments/BQ51013BRHLR) |
| 7 | **WR202020-9M8-G** | Qi Rx coil, 20×20mm, 9μH, flex PCB | 1 | $1.20 | Würth Elektronik / Mouser | [Mouser WE](https://www.mouser.com/ProductDetail/Wurth-Elektronik/760308101214) |

**Why BQ51013B:** Standard Qi 1.x compliance, I2C for charge status, 5W rated, tiny 16-QFN package (3.5×3.5mm). The WR202020 is a flat flex-PCB coil — 0.4mm thick, 20×20mm — sits directly behind the polycarbonate window on the mirror-polish side without adding visible height.

### 4.7 Battery Charger IC

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 8 | **BQ25185YFPR** | TI single-cell LiPo charger, I2C, USB-C PD | 1 | $1.95 | Mouser | [Mouser](https://www.mouser.com/ProductDetail/Texas-Instruments/BQ25185YFPR) |

### 4.8 Battery

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 9 | **Custom 402030** | LiPo 150mAh, 40×20×3mm, JST 1.25mm | 1 | $3.80 | GREPOW / Shenzhen direct | [GREPOW](https://www.grepow.com/shaped-battery.html) |

> **Note:** Request custom dimensions from GREPOW (or comparable: Shenzhen Moxian, Jauch). 40×20×3mm leaves room on PCB for the camera and other components. At 150mAh, expect ~3 days standby / ~6 hours active WiFi use. Runtime increases significantly in pager-only (BLE beacon) mode.

### 4.9 Copy Button

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 10 | **SKQGABE010** | Alps Electric, 6×6mm, 0.49N, SMD, 260°C reflow | 1 | $0.22 | DigiKey | [DigiKey](https://www.digikey.com/en/products/detail/alps-alpine/SKQGABE010/1745369) |

Stainless steel keycap to be CNC-machined to match body finish. Button sits flush with face in default state, 0.3mm travel when pressed.

### 4.10 Connectivity

| # | Part | Description | Qty | Unit Cost | Source | Link |
|---|------|-------------|-----|-----------|--------|------|
| 11 | **USB4135-GF-A** | GCT USB-C 2.0, bottom-entry, SMD | 1 | $0.65 | Mouser | [Mouser](https://www.mouser.com/ProductDetail/GCT/USB4135-GF-A) |
| 12 | **W3008** | Flex PCB patch antenna, 2.4GHz, adhesive | 1 | $0.80 | Mouser / TAOGLAS | [TAOGLAS](https://www.taoglas.com) |

### 4.11 Power Management / Passives

| # | Part | Description | Qty | Unit Cost | Source |
|---|------|-------------|-----|-----------|--------|
| 13 | TPS62840DRLR | TI 750mA step-down, 3.3V rail | 1 | $0.95 | Mouser |
| 14 | TLV1117-18 | TI 1.8V LDO for camera rail | 1 | $0.45 | DigiKey |
| 15 | 0402 resistors (10-pack assortment) | Pull-ups, current limit | 10 | $0.02 ea | LCSC |
| 16 | 0402 capacitors (decoupling) | 100nF, 10μF | 20 | $0.01 ea | LCSC |
| 17 | Gorilla Glass 3, 30×30×0.5mm | Display cover lens | 1 | $2.10 | Alibaba custom cut |
| 18 | Sapphire lens, 6mm dia, AR coat | Camera cover | 1 | $1.80 | Edmund Optics |
| 19 | PC inlay, 20×20×0.5mm | Qi charge window | 1 | $0.40 | Custom cut |
| 20 | FPC cable, 20-pin, 100mm | Camera to MCU board-to-board | 1 | $0.35 | LCSC |
| 21 | JST SH 1.25mm, 2-pin | Battery connector | 1 | $0.15 | DigiKey |

### 4.12 BOM Summary

| Category | Items | Cost @ Qty 100 |
|----------|-------|-----------------|
| MCU + Connectivity | ESP32-S3-MINI + USB-C + antenna | $4.65 |
| Display | OLED 1.3" | $4.80 |
| Camera | HM01B0 + FPC | $2.45 |
| Sensors | BME688 + LIS2DH12 | $5.35 |
| Power System | BQ51013B + BQ25185 + coil + TPS62840 + TLV1117 | $7.65 |
| Battery | 150mAh LiPo custom | $3.80 |
| Button + Keycap | ALPS + SS keycap | $1.20 |
| Passives + connectors | Resistors, caps, connectors | $1.80 |
| Optics | Gorilla Glass + Sapphire lens + PC inlay | $4.30 |
| PCB (4-layer, 40×40mm, ENIG) | PCBWay, 100 qty | $4.20/unit |
| Stainless enclosure (CNC) | PCBWay, 316L, 2-part | $28.00/unit |
| Assembly (SMT + hand) | PCBWay PCBA service | $8.50/unit |
| **TOTAL BOM (estimated)** | | **~$76–$82/unit** |

---

## 5. PCBWay Manufacturing Plan

### 5.1 PCB Specification

| Parameter | Value |
|-----------|-------|
| Manufacturer | PCBWay (pcbway.com) |
| Board dimensions | 39.0 × 39.0mm (0.5mm clearance from shell) |
| Layers | 4 (signal / GND / PWR / signal) |
| Thickness | 1.0mm |
| Copper weight | 1oz outer / 0.5oz inner |
| Surface finish | ENIG (gold pads — required for fine-pitch ESP32-S3-MINI pads) |
| Solder mask | Black (both sides) |
| Silkscreen | White, top side only |
| Min trace / space | 0.1mm / 0.1mm |
| Min drill | 0.2mm |
| Qty | 110 (10 spares) |
| Est. PCB cost | ~$420 total ($4.20/unit) |
| Turnaround | 5 business days (standard) |

**PCBWay Order URL:** https://www.pcbway.com/orderonline.aspx

**PCBWay PCBA (Assembly) Service:**
- Upload Gerber + BOM + CPL (centroid) files
- PCBWay sources components from LCSC / internal stock
- SMT assembly + reflow for all 0402, BGA, QFN components
- Manual placement for display, camera FPC, battery connector
- Est. PCBA cost: $850 total for 100 units ($8.50/unit)

### 5.2 Gerber Package Contents

```
LOT-C1-PCB-v1.0/
├── gerbers/
│   ├── LOT-C1-F_Cu.gbr          (top copper)
│   ├── LOT-C1-B_Cu.gbr          (bottom copper)
│   ├── LOT-C1-In1_Cu.gbr        (inner GND plane)
│   ├── LOT-C1-In2_Cu.gbr        (inner PWR plane)
│   ├── LOT-C1-F_Mask.gbr        (top soldermask)
│   ├── LOT-C1-B_Mask.gbr        (bottom soldermask)
│   ├── LOT-C1-F_Silkscreen.gbr  (top silkscreen)
│   ├── LOT-C1-Edge_Cuts.gbr     (board outline)
│   └── LOT-C1-Drill.drl         (NC drill file)
├── BOM-LOT-C1-v1.0.csv
├── CPL-LOT-C1-v1.0.csv          (component placement)
└── README-PCBWay.txt
```

### 5.3 Layer Stack

```
Top:     Signal + component pads
In1:     GND (solid copper pour, stitched vias)
In2:     3.3V power pour + 1.8V island
Bottom:  Signal (WiFi antenna keepout enforced top+bottom)
```

**Antenna keepout rule:** 15mm clearance around ESP32-S3-MINI antenna pad on all copper layers — no pours, no traces, no vias.

---

## 6. Enclosure Design — Stainless Steel Body

### 6.1 Material

| Property | Value |
|----------|-------|
| Alloy | 316L Stainless Steel (marine grade, non-magnetic) |
| Tensile strength | 485 MPa |
| Hardness | ~79 HRB |
| Density | 8.0 g/cm³ |
| Corrosion resistance | Excellent (daily carry, sweat/rain) |

**Why 316L:** Non-magnetic — does not interfere with Qi charging field or BLE antenna. Food-safe. Polishes to optical-mirror quality (#8 finish).

### 6.2 Two-Part Shell Design

```
Part A — Back Shell (Mirror Polish)
┌──────────────────────────────────┐
│  40.0 × 40.0 × 3.5mm depth      │
│  Wall thickness: 0.5mm           │
│  Interior recess depth: 3.0mm    │
│  Qi window slot: 22×22mm, 0.3mm │
│  PC insert press-fit             │
│  M1.0 brass threaded inserts ×4  │
│  LOT® laser engraved logo        │
│  Serial number edge laser mark   │
└──────────────────────────────────┘

Part B — Front Frame (Brushed Satin)
┌──────────────────────────────────┐
│  40.0 × 40.0 × 2.5mm depth      │
│  Wall thickness: 0.5mm           │
│  Display aperture: 30.5×30.5mm  │
│  Camera aperture: 5.8mm ∅        │
│  Button aperture: 8.0×8.0mm     │
│  USB-C slot: bottom edge, 9.5mm │
│  M1.0 screws ×4 (recessed)      │
│  Grain direction: horizontal     │
└──────────────────────────────────┘

Assembly:
  PCB slides into Part B frame
  Part A snaps over PCB into Part B
  4× M1.0 flathead SS screws, torque 0.05 Nm
  IP52 seal: 0.3mm silicone gasket at shell mating edge
```

### 6.3 PCBWay CNC Service

| Service | Specification |
|---------|--------------|
| Process | CNC milling + turning |
| Material | 316L SS, custom stock (supplied by PCBWay) |
| Tolerance | ±0.05mm (standard CNC) |
| Polish (Part A) | #8 mirror polish (Ra < 0.05μm), hand-buffed finish |
| Finish (Part B) | 180-grit satin brush, horizontal grain |
| Laser engraving | LOT® logo + serial, depth 0.05mm |
| Qty | 110 sets (100 production + 10 spares) |
| Est. cost | $2,800 total (~$28/unit) |
| Turnaround | 10–15 business days |

**PCBWay CNC URL:** https://www.pcbway.com/rapid-prototyping/manufacture/?type=1

**Files required:** STEP (.stp) files for Part A and Part B, plus finish callout drawing (PDF).

---

## 7. LOT API Connector Specification

### 7.1 Overview

The LOT API Connector is firmware + server-side code that links the LOT-C1 to the lot-systems.com backend. It provides two channels:

| Channel | Direction | Protocol | Purpose |
|---------|-----------|----------|---------|
| Notification Push | Server → Device | WebSocket (WSS) | Push notifications to display |
| Log Signal | Device → Server | HTTPS POST | Copy button → Log tab entry |
| Telemetry | Device → Server | HTTPS POST (batched) | Weather, motion, session data |
| Auth | Bidirectional | HTTPS + JWT | Device identity + user binding |

### 7.2 Device Identity & Pairing

Each LOT-C1 unit ships with:
- **Unique Device ID:** `LOT-C1-{6-char-hex}` (burned to ESP32-S3 eFuse at factory)
- **Device Secret:** 32-byte random, stored in ESP32-S3 NVS encrypted flash partition
- **Pairing QR code:** printed on box insert, links to lot-systems.com/pair?device=LOT-C1-{id}

**Pairing Flow:**
```
1. User opens lot-systems.com → Settings → Hardware → Pair Device
2. User scans QR code from box with phone/webcam
3. Server generates device token: JWT signed with LOT server private key
4. Token encoded as QR shown on LOT site
5. User points LOT-C1 camera at screen
6. Device decodes QR, stores JWT in NVS
7. Device sends: POST /api/v1/device/register {device_id, jwt, firmware_version}
8. Server binds device to user account
9. Display shows: "LOT-C1 paired. Hello, [name]."
```

### 7.3 Notification Protocol (WebSocket)

```
Endpoint: wss://lot-systems.com/api/v1/device/ws
Auth: Authorization: Bearer {device_jwt}

Message format (server → device):
{
  "type": "notification",
  "id": "notif_uuid",
  "text": "Coffee time!",
  "icon": "☕",           // single emoji, rendered as glyph on OLED
  "duration": 30,         // seconds to display (0 = until dismissed)
  "priority": "normal",   // "normal" | "urgent"
  "source": "lot-os"      // which LOT module generated this
}

Device acknowledgement:
{
  "type": "ack",
  "id": "notif_uuid",
  "ts": 1749244800        // Unix timestamp of display
}
```

**Notification sources** (defined on lot-systems.com side):
- `lot-os` — main LOT OS scheduler
- `quantum-intent` — QIE pattern triggers
- `weather` — derived from BME688 + location data
- `benchmark` — Benchmark milestone alerts
- `cosmo` — COSMO® sync events

### 7.4 Copy Button — Log API

```
Endpoint: POST /api/v1/device/log
Auth: Authorization: Bearer {device_jwt}
Content-Type: application/json

Payload:
{
  "device_id": "LOT-C1-4a2f9c",
  "event": "copy_pressed",
  "ts": 1749244800,
  "context": {
    "temperature": 22.4,        // BME688
    "humidity": 58.1,
    "air_quality_index": 87,
    "motion_state": "stationary",
    "battery_pct": 73,
    "active_notification": "notif_uuid"  // if notification on screen
  }
}

Response:
{
  "log_id": "log_uuid",
  "tab": "Log",
  "status": "recorded"
}
```

Server writes this event to the user's Log tab in real-time, visible at lot-systems.com → Log.

### 7.5 Telemetry API (Batched)

```
Endpoint: POST /api/v1/device/telemetry
Frequency: Every 15 minutes while awake, on sleep/wake events

Payload:
{
  "device_id": "LOT-C1-4a2f9c",
  "samples": [
    { "ts": 1749244000, "temp_c": 22.1, "hum_pct": 57.8, "pressure_hpa": 1013.2,
      "gas_resistance_kohm": 48.2, "aqi": 89, "motion": "walking" },
    ...
  ],
  "battery_pct": 71,
  "uptime_s": 86400
}
```

---

## 8. Firmware Architecture

### 8.1 Technology Stack

| Layer | Technology |
|-------|-----------|
| RTOS | ESP-IDF v5.3 (FreeRTOS) |
| Language | C (core) + C++ (components) |
| WiFi | ESP-IDF WiFi stack (WPA2/WPA3) |
| TLS | mbedTLS (built into ESP-IDF) |
| WebSocket | `esp_websocket_client` component |
| Display driver | Custom SPI driver for SH1107 |
| Camera driver | ESP32-S3 DVP camera driver (ESP-IDF) |
| Sensor driver | BME688 BSEC2 library (Bosch official) |
| OTA | ESP-IDF OTA (HTTPS, delta if bandwidth limited) |
| Storage | NVS (encrypted) for credentials; FATFS on flash for logs |
| Power mgmt | ESP-IDF light sleep + deep sleep |

### 8.2 Task Map (FreeRTOS)

```
Core 0 (Protocol CPU):
  Task: wifi_manager        Priority: 10  Stack: 8KB   — WiFi connect/reconnect
  Task: ws_client           Priority: 9   Stack: 12KB  — WebSocket notification Rx
  Task: http_client         Priority: 8   Stack: 8KB   — Log POST, telemetry POST
  Task: ota_task            Priority: 3   Stack: 8KB   — Background OTA check

Core 1 (Application CPU):
  Task: display_task        Priority: 9   Stack: 4KB   — Render OLED frames
  Task: sensor_task         Priority: 8   Stack: 4KB   — BME688 + LIS2DH12 poll
  Task: camera_task         Priority: 7   Stack: 16KB  — Capture on demand
  Task: button_task         Priority: 10  Stack: 2KB   — Debounce, event gen
  Task: power_manager       Priority: 5   Stack: 4KB   — Battery, sleep policy
  Task: session_compress    Priority: 2   Stack: 8KB   — Session data compression
```

### 8.3 Power States

| State | Active Components | Current Draw | Trigger |
|-------|------------------|-------------|---------|
| Active (WiFi) | All | ~85mA | Notification / button press |
| Active (display only) | Display + MCU | ~25mA | 30s after last WiFi event |
| Light Sleep | MCU sleep, RTC active | ~4mA | 60s idle |
| Deep Sleep | RTC only, wake on button | ~0.15mA | 5min idle |
| Charging (Qi) | + BQ51013B | +165mA in | On charge pad |

**Battery life estimates (150mAh):**

| Usage Pattern | Est. Life |
|--------------|-----------|
| Standby (deep sleep, 1 notification/hour) | ~18 days |
| Light use (check hourly, 5 button presses/day) | ~6 days |
| Active use (WiFi always on) | ~30 hours |
| Charging time (5W Qi) | ~45 minutes |

### 8.4 OTA (Over-the-Air) Update Protocol

```
On boot + every 4 hours:
  GET https://lot-systems.com/api/v1/device/firmware/latest
  Response: { "version": "1.2.0", "url": "...", "sha256": "..." }

If version > current:
  1. Show "Updating firmware..." on display
  2. HTTPS download to OTA partition
  3. SHA-256 verify
  4. esp_ota_set_boot_partition()
  5. Reboot
  6. POST /api/v1/device/firmware/ack { version, device_id }
```

### 8.5 Session Compression (On-Device)

Every 24 hours, the firmware compresses the day's sensor + interaction log:

```c
struct DailySession {
    uint32_t date;
    uint16_t button_presses;
    float avg_temp_c;
    float avg_humidity;
    uint8_t aqi_histogram[10];     // AQI in 10-bucket histogram
    uint16_t motion_minutes[4];    // stationary/walking/running/unknown
    uint16_t notification_count;
    uint16_t notification_acked;
    uint8_t battery_low_events;
};  // sizeof = 48 bytes per day
```

48 bytes/day × 365 days = 17.5KB/year. Stored locally, synced to server weekly.

---

## 9. Software — Desktop/Mobile Companion

### 9.1 Architecture

A lightweight companion app is NOT required for basic operation — the LOT-C1 pairs directly to lot-systems.com. However, firmware flashing and advanced configuration require a desktop tool.

**LOT-C1 Companion Tool** (`lot-c1-tool`):

| Platform | Technology |
|----------|-----------|
| Web (primary) | lot-systems.com/device settings page |
| Desktop flash tool | Python 3.11 + `esptool.py` |
| Firmware source | GitHub releases (lot-systems/lot-c1-firmware) |

### 9.2 `lot-c1-tool` — Python Flash Utility

```bash
# Install
pip install lot-c1-tool

# Flash firmware to new device (USB-C connected)
lot-c1-tool flash --port /dev/ttyUSB0 --firmware lot-c1-v1.0.0.bin

# Pair device to LOT account
lot-c1-tool pair --device-id LOT-C1-4a2f9c --token [from lot-systems.com]

# Run diagnostics
lot-c1-tool diagnose --port /dev/ttyUSB0

# Read sensor log
lot-c1-tool log --device-id LOT-C1-4a2f9c --days 7
```

### 9.3 lot-systems.com Integration Points

New server-side routes required:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/v1/device/register` | POST | Pair new device to user |
| `/api/v1/device/ws` | WS | Persistent notification channel |
| `/api/v1/device/log` | POST | Copy button → Log tab |
| `/api/v1/device/telemetry` | POST | Sensor data ingestion |
| `/api/v1/device/firmware/latest` | GET | OTA version check |
| `/settings/hardware` | GET | Device management UI |
| `/log` | GET | (existing) — receives button-press log entries |

**Database additions:**

```sql
-- Device registry
CREATE TABLE devices (
  id              TEXT PRIMARY KEY,    -- LOT-C1-{6hex}
  user_id         TEXT REFERENCES users(id),
  firmware_version TEXT,
  paired_at       TIMESTAMP,
  last_seen       TIMESTAMP,
  battery_pct     INTEGER
);

-- Device log entries (from Copy button)
CREATE TABLE device_logs (
  id              TEXT PRIMARY KEY,
  device_id       TEXT REFERENCES devices(id),
  user_id         TEXT REFERENCES users(id),
  event           TEXT,
  context         JSONB,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Device telemetry
CREATE TABLE device_telemetry (
  id              TEXT PRIMARY KEY,
  device_id       TEXT REFERENCES devices(id),
  sampled_at      TIMESTAMP,
  temp_c          FLOAT,
  humidity_pct    FLOAT,
  pressure_hpa    FLOAT,
  aqi             INTEGER,
  motion_state    TEXT,
  battery_pct     INTEGER
);
```

---

## 10. Wireless Charging System

### 10.1 System Overview

| Parameter | Value |
|-----------|-------|
| Standard | Qi WPC 1.3 |
| Max power | 5W (9V/0.55A input from pad) |
| Coil size | 20×20mm (fits behind PC window on polished side) |
| Coil inductance | 9μH |
| Receiver IC | TI BQ51013BRHLR |
| Output voltage | 4.2V (regulated, feeds BQ25185 charger) |
| Charge-through | 316L SS shell does NOT interfere (non-magnetic) |
| PC inlay | Required — 20×20mm polycarbonate, 0.3mm, flush-mounted |

### 10.2 Compatible Chargers

Any Qi-certified 5W pad works. Recommended pads for LOT brand:

| Pad | Form Factor | Price | Link |
|-----|-------------|-------|------|
| Anker 313 Wireless Pad | 100mm circular | $15 | anker.com |
| Belkin BOOST↑CHARGE 10W Pad | Slim profile | $20 | belkin.com |
| Apple MagSafe compatible pads | Various | $25+ | Various |

**LOT-branded charging pad** (future product): 40×40mm square pad matching LOT-C1 footprint exactly — device stacks perfectly.

### 10.3 Charging Indicator

| State | Display | LED (if added in v2) |
|-------|---------|---------------------|
| Not charging | Normal | — |
| Charging | Battery icon + % animating | Amber |
| Charge complete | "Charged" + full battery icon | Green |
| Charge error | "Check charger" + icon | Red flash |

---

## 11. Sensor Suite

### 11.1 BME688 — Weather + AI Gas Sensor

| Measurement | Range | Accuracy |
|-------------|-------|---------|
| Temperature | -40°C to +85°C | ±1.0°C |
| Humidity | 0–100% RH | ±3% RH |
| Pressure | 300–1100 hPa | ±0.6 hPa |
| Gas (VOC/AQI) | IAQ 0–500 | Bosch BSEC2 AI calibration |

**BSEC2 AI Library (Bosch):** The BME688 runs Bosch's BSEC2 algorithm on the ESP32-S3 to convert raw gas resistance readings into calibrated IAQ (Indoor Air Quality) scores. After 5 minutes of warm-up, it classifies air quality as: Excellent / Good / Moderate / Poor / Heavily Polluted.

**LOT Integration:** IAQ readings + temperature feed into contextual notifications:
- IAQ < 50: "Air quality excellent — good time to journal"
- IAQ > 150: "Air quality declining — consider a walk"
- Temp > 28°C: "It's warm — stay hydrated"

### 11.2 LIS2DH12 — Motion / Gesture

| Feature | Value |
|---------|-------|
| Axes | 3-axis (X/Y/Z) |
| Range | ±2g / ±4g / ±8g / ±16g |
| Power (normal) | 11μA |
| Tap detection | Single + double tap interrupt |
| Package | LGA-12 (2×2×1mm) |

**Use in LOT-C1:**
- **Wake-on-tap:** Double-tap top face to wake display from deep sleep
- **Orientation:** Detect face-up vs face-down (disable display when face-down to save power)
- **Activity:** Track stationary/walking/running for session telemetry

### 11.3 AI Sensor Architecture

The LOT-C1 runs two on-device AI models:

| Model | Size | Location | Purpose |
|-------|------|----------|---------|
| Bosch BSEC2 | ~400KB | ESP32-S3 RAM | Gas classification / IAQ |
| HM01B0 scene detect | Built-in | Camera ISP | Motion detection, scene change |

Future sensor additions (v2 board):
- **MAX30101** — Heart rate (requires skin contact, not in v1)
- **MLX90640** — Thermal camera array (too large for v1 form factor)
- **SCD41** — CO₂ sensor (14.5×10.9mm — fits v2)

---

## 12. Copy Button — Log Tab Signal Protocol

### 12.1 User Flow

```
User sees a notification: "Coffee time!" on LOT-C1 display
User presses [COPY] button
                │
                ▼
Device captures context snapshot:
  - Current notification text
  - Time
  - Temperature, AQI, humidity
  - Motion state
  - Battery %
                │
                ▼
POST /api/v1/device/log (HTTPS, < 500ms)
                │
                ▼
lot-systems.com Log tab:
  [2026-06-06 09:42] LOT-C1 ● COPY pressed
  Context: "Coffee time!" | 22.4°C | AQI 87 | Battery 73%
```

### 12.2 Copy Button States

| State | Behavior |
|-------|---------|
| Single press | Log current context to Log tab |
| Hold 2 seconds | Trigger camera capture + log with image |
| Double press | Dismiss current notification (send ack) |
| Triple press | Enter pairing mode (LED pulse) |

### 12.3 Haptic Feedback (v2 consideration)

v1 uses audio-visual confirmation (display flash + brief tone via piezo buzzer). v2 may add ERM motor for tactile click confirmation.

---

## 13. Notification Display System

### 13.1 Display Rendering

The 1.3" OLED (128×128 SH1107) renders notifications in a minimal, high-contrast style:

```
┌────────────────────────────┐
│  ☕                         │ ← Emoji glyph (32×32px)
│                            │
│  Coffee time!              │ ← Notification text (16pt)
│                            │
│  09:42 · lot-systems.com  │ ← Source + time (8pt)
│                            │
│  [■■■■■■■□□□] 30s         │ ← Countdown bar
└────────────────────────────┘
```

### 13.2 Font & Icon Set

| Element | Font | Size |
|---------|------|------|
| Notification text | Inter Mono (converted to bitmap) | 14pt |
| Time / source | Inter Mono | 8pt |
| Emoji glyphs | Noto Emoji subset (pre-rendered) | 32×32px |
| LOT logo | SVG → 1-bit bitmap | 40×12px |

Emoji library: pre-render the 50 most common LOT notification glyphs as 32×32 1-bit bitmaps, stored in flash (50 × 128 bytes = 6.4KB).

### 13.3 Notification Queue

- Max queue depth: 5 notifications
- Display duration: 30 seconds (or until button pressed)
- If queue full: oldest notification dropped
- Urgent priority: immediately preempts current display
- Night mode: dim display 50% between 22:00–07:00 (user timezone)

---

## 14. Session Compression Protocol

Each 24-hour session on LOT-C1 generates the following raw data:

| Data type | Raw size | Compressed |
|-----------|----------|-----------|
| Sensor readings (1/min, 24h) | 1440 × 20 bytes = 28.8KB | ~3.2KB (LZ4) |
| Notification log (avg 20/day) | 20 × 256 bytes = 5.1KB | ~1.8KB |
| Button press events (avg 10/day) | 10 × 48 bytes = 0.5KB | ~0.3KB |
| Camera thumbnails (on demand) | 5 × 1KB JPEG thumbnail | ~5KB |
| **Total raw** | ~39.4KB | **~10.3KB** |

**Compression stack:**
1. **Delta encoding** for time-series sensor data (encode diffs, not absolute values)
2. **LZ4** block compression (fast, low memory, ~70MB/s on ESP32-S3)
3. **Huffman coding** for notification text (limited vocabulary)

Compressed session: ~10KB/day → uploaded during daily sync, stored in PostgreSQL JSONB column in `device_sessions` table.

---

## 15. 100-Unit Production Roadmap

### 15.1 Timeline

```
Phase 0 — Design (Weeks 1–4)          June 2026
  ├── PCB schematic + layout (KiCad)
  ├── Enclosure 3D model (STEP)
  ├── Firmware skeleton + API stubs
  └── BOM finalized + components ordered

Phase 1 — Prototypes (Weeks 5–8)       July 2026
  ├── PCBWay: 5× PCB + 5× enclosure (proto run)
  ├── Hand assembly: 3 working units
  ├── Hardware validation (all sensors, Qi, camera)
  ├── Firmware bring-up on proto hardware
  └── LOT API routes implemented + tested

Phase 2 — Pilot (Weeks 9–12)          August 2026
  ├── PCBWay: 10× PCB + 10× enclosure (pilot run)
  ├── PCBA assembly + QA
  ├── OTA update pipeline tested
  ├── Pairing flow end-to-end tested
  ├── Firmware v0.9 locked
  └── User testing: 5 internal LOT USERSHIP users

Phase 3 — Production (Weeks 13–18)    September–October 2026
  ├── PCBWay: 110× PCB + 110× enclosure (production run)
  ├── Full PCBA + QA + test jig
  ├── Firmware v1.0 signed + OTA server live
  ├── Manual printing (PDF → physical insert)
  ├── Packaging design + box production
  └── Shipping to first 100 users

Phase 4 — Post-Launch (Month 5+)      November 2026+
  ├── OTA firmware updates (bug fixes)
  ├── Telemetry analysis → LOT dashboard features
  ├── COSMO® soul sync beta (Purple+ users)
  └── v2 hardware design (CO₂ sensor, haptic, GPS)
```

### 15.2 Production QA Checklist

Each unit must pass before shipment:

```
□  Power on (USB-C): boots within 5s
□  Display: all pixels on/off (test pattern)
□  WiFi: connects to test AP, ping lot-systems.com
□  WebSocket: receives test notification, displays correctly
□  Camera: captures test image, no dead pixels >5%
□  BME688: reads temp within ±2°C of reference thermometer
□  LIS2DH12: responds to tap interrupt
□  Button: COPY press registered, log POST succeeds
□  Qi charging: charges at 5W from test pad
□  Battery: holds charge for 30-minute test cycle
□  OTA: downloads + installs test firmware update
□  NVS: device ID correctly burned, secrets stored
□  Enclosure: no visible scratches on mirror surface
□  Assembly: no rattle, all apertures aligned ±0.2mm
```

### 15.3 Production Costs Summary

| Item | Qty | Total Cost |
|------|-----|-----------|
| PCBWay PCB | 110 | $462 |
| PCBWay PCBA | 100 | $850 |
| PCBWay CNC enclosures | 110 sets | $3,080 |
| Components (BOM, excl. PCB/assembly) | 100 sets | $4,400 |
| Custom LiPo batteries | 110 | $418 |
| Packaging (box, insert, QR label) | 100 | $320 |
| Firmware signing cert | 1 | $150 |
| QA test jig (one-time) | 1 | $400 |
| Shipping + logistics | — | $600 |
| **Total Production Cost** | 100 units | **~$10,680** |
| **Per-unit cost** | | **~$107/unit** |
| **Retail price target** | | **$249–$399** |
| **Gross margin (at $299)** | | **~64%** |

---

## 16. PDF Manual Structure

### Manual A — Quick Start Guide (6 pages, printed)

```
Page 1: Cover — LOT-C1 product photo, LOT® branding
Page 2: What's in the box
Page 3: Charging your LOT-C1 (Qi diagram)
Page 4: Pairing with your LOT account (QR + steps)
Page 5: Using the Copy button
Page 6: Care instructions + support URL
```

### Manual B — Technical Reference Manual (PDF, digital only)

```
Section 1: Device Overview & Specifications
Section 2: LED & Display States
Section 3: Button Reference (all press patterns)
Section 4: Charging & Battery
Section 5: Firmware Update Procedure
Section 6: Factory Reset
Section 7: Sensor Data — What LOT-C1 Measures
Section 8: Privacy & Data (what is stored, where, how to delete)
Section 9: Compliance (FCC, CE, RoHS)
Section 10: Warranty & Support
```

### Manual C — Developer & Firmware Reference (PDF, digital)

```
Section 1: Hardware Architecture (block diagram)
Section 2: LOT API Connector Specification (§7 of this document)
Section 3: Firmware Build Instructions (ESP-IDF)
Section 4: Flash & Debug Procedure (USB-C + esptool)
Section 5: OTA Update Protocol
Section 6: BOM & Schematic Reference
Section 7: PCBWay Manufacturing Notes
Section 8: Test Jig Specification
Section 9: Firmware Changelog
```

---

## 17. Firmware Document Index

```
lot-c1-firmware/
├── README.md                     — Build instructions
├── CHANGELOG.md                  — Version history
├── main/
│   ├── CMakeLists.txt
│   ├── main.c                    — Entry point, task init
│   ├── wifi_manager.c/.h         — WiFi connect/reconnect/NTP
│   ├── ws_client.c/.h            — WebSocket notification client
│   ├── http_client.c/.h          — Log POST, telemetry, OTA check
│   ├── display.c/.h              — SH1107 SPI driver + renderer
│   ├── camera.c/.h               — HM01B0 DVP driver
│   ├── sensors.c/.h              — BME688 BSEC2 + LIS2DH12
│   ├── button.c/.h               — Debounce, event dispatch
│   ├── power.c/.h                — Sleep policy, Qi status
│   ├── session.c/.h              — Session data + compression
│   ├── nvs_config.c/.h           — Encrypted credential storage
│   └── ota.c/.h                  — OTA download + verify
├── components/
│   ├── bsec2/                    — Bosch BSEC2 library
│   ├── lz4/                      — LZ4 compression
│   └── qrcode/                   — QR decode (for pairing)
├── tools/
│   ├── lot-c1-tool/              — Python flash + pair utility
│   └── test-jig/                 — QA test firmware
└── docs/
    ├── LOT-C1-FIRMWARE-REF.md    — Developer reference (Manual C)
    ├── API-SPEC.md               — LOT API connector spec (§7)
    └── PINOUT.md                 — GPIO/peripheral map
```

### 17.1 ESP32-S3 GPIO Map

| GPIO | Function | Direction | Notes |
|------|----------|-----------|-------|
| 0 | BOOT mode | Input | Pull-up, active-low |
| 1 | UART TX (debug) | Output | 115200 baud |
| 2 | UART RX (debug) | Input | |
| 3 | Button (COPY) | Input | Pull-up, active-low, interrupt |
| 4 | Display CS | Output | SPI CS |
| 5 | Display DC | Output | Data/Command |
| 6 | Display RST | Output | Active-low reset |
| 7 | SPI MOSI | Output | Shared SPI bus |
| 8 | SPI SCLK | Output | |
| 9 | I2C SDA | Bidirectional | BME688 + LIS2DH12 + BQ25185 |
| 10 | I2C SCL | Output | 400kHz |
| 11 | Camera VSYNC | Input | DVP camera |
| 12 | Camera HREF | Input | DVP camera |
| 13 | Camera PCLK | Input | DVP camera |
| 14–21 | Camera D0–D7 | Input | DVP 8-bit data |
| 22 | Camera XCLK | Output | 20MHz XCLK |
| 38 | USB D+ | Bidirectional | USB-C OTG |
| 39 | USB D- | Bidirectional | USB-C OTG |
| 45 | WiFi antenna | — | ESP32-S3-MINI-1U external |

---

## 18. Risk & Design Trade-offs

### 18.1 Critical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| 5mm depth not achievable | HIGH | Medium | Engineer to 6mm; market as "5mm" for flat body; battery lateral placement |
| WiFi at 40×40mm causes antenna performance issues | Medium | High | ESP32-S3-MINI-1U external antenna + edge-mounted flex antenna; rigorous RF testing in proto phase |
| Qi coil interference from SS shell | Low | High | 316L is non-magnetic; PC inlay window eliminates eddy current risk |
| BME688 self-heating error | Medium | Low | Thermal isolation via 2mm foam standoff; SW correction using BSEC2 heat compensation |
| Camera image quality (HM01B0 is 320×320) | High | Low | HM01B0 is adequate for context capture, not photography; set expectation in manual |
| 150mAh battery insufficient | Medium | Medium | Agressive deep sleep (0.15mA); target 3-day standby; v2 uses 300mAh |
| PCBWay CNC cost overrun | Low | Medium | Get quote before committing to production run; fallback: anodized aluminum at $12/unit |
| FCC/CE certification | High | High | Required before shipping to US/EU; budget $8,000–$15,000 for pre-cert and certification |

### 18.2 Design Alternatives Considered

| Decision | Chosen | Alternative | Reason |
|----------|--------|-------------|--------|
| MCU | ESP32-S3 | nRF5340 | ESP32-S3 has native WiFi + camera DVP; nRF5340 requires external WiFi chip |
| Display | OLED SH1107 | Sharp Memory LCD | OLED has better contrast at this size; Sharp uses less power but lower contrast |
| Camera | HM01B0 | OV2640 | HM01B0 is 1.7mm height vs OV2640's 6mm — critical for 5-6mm total depth |
| Body | 316L SS | Titanium | 316L is 3× cheaper, widely available at PCBWay; Ti would be $60+ per unit |
| Charging | Qi wireless | USB-C only | Qi matches the "place and forget" design philosophy; USB-C retained for dev/flash |

---

## 19. Procurement Links & Supplier Contacts

### Component Suppliers

| Supplier | Items | URL | Notes |
|----------|-------|-----|-------|
| **Mouser Electronics** | ESP32-S3, BME688, BQ51013B, BQ25185 | mouser.com | Best for TI + Bosch + Espressif |
| **DigiKey** | LIS2DH12, Alps button, JST connectors | digikey.com | Best for Alps + ST + passives |
| **LCSC** | Passives, basic ICs | lcsc.com | Integrated with PCBWay PCBA |
| **PCBWay** | PCB fabrication, PCBA, CNC enclosure | pcbway.com | Primary manufacturer |
| **GREPOW** | Custom LiPo battery (40×20×3mm) | grepow.com | Custom shape battery specialist |
| **BuyDisplay** | SH1107 1.3" OLED | buydisplay.com | Display module supplier |
| **Arrow Electronics** | Himax HM01B0 | arrow.com | AI camera sensor |
| **Würth Elektronik** | Qi coil WR202020 | we-online.com | Mouser-stocked Qi coils |
| **Edmund Optics** | Sapphire camera cover lens | edmundoptics.com | AR-coated optical windows |
| **TAOGLAS** | Flex PCB WiFi antenna | taoglas.com | 2.4GHz patch antennas |

### PCBWay Contacts

- **PCB Quote:** https://www.pcbway.com/orderonline.aspx
- **PCBA Quote:** https://www.pcbway.com/pcba-service.html
- **CNC Quote:** https://www.pcbway.com/rapid-prototyping/manufacture/?type=1
- **Email:** order@pcbway.com
- **WhatsApp:** Available on site for custom projects

### Key Specifications for PCBWay RFQ

**PCB RFQ:**
> 4-layer PCB, 39×39mm, 1.0mm thickness, 1oz/0.5oz copper, ENIG finish, black soldermask both sides, white silkscreen top, IPC Class 2, Qty 110, deliver in 5 business days.

**CNC RFQ:**
> 2-part enclosure, 316L Stainless Steel, 40×40mm body, Part A (3.5mm deep, #8 mirror polish), Part B (2.5mm deep, 180-grit satin brush), M1.0 threaded insert installation, laser engraving on Part A, Qty 110 sets, ±0.05mm tolerance.

---

## 20. Session Report Summary

**Session Date:** 2026-06-06  
**Session Type:** HARDWARE DESIGN — LOT-C1 Physical Node v1  
**Inventor:** Vadik Marmeladov — COSMO® CIA  
**Branch:** claude/brave-lamport-YV2bL  

### What Was Designed This Session

| Deliverable | Status |
|-------------|--------|
| Physical specification (4×4cm, 6mm depth) | COMPLETE |
| Component selection (all 21 BOM items) | COMPLETE |
| PCBWay manufacturing plan (PCB + CNC + PCBA) | COMPLETE |
| Stainless steel enclosure design (2-part, 316L) | COMPLETE |
| LOT API Connector specification (WS + REST) | COMPLETE |
| Firmware architecture (FreeRTOS task map) | COMPLETE |
| Python companion tool spec | COMPLETE |
| Wireless charging system (Qi 5W) | COMPLETE |
| Sensor suite (BME688 + LIS2DH12 + HM01B0) | COMPLETE |
| Copy button → Log tab protocol | COMPLETE |
| Notification display system | COMPLETE |
| Session compression protocol | COMPLETE |
| 100-unit production roadmap (4 phases) | COMPLETE |
| PDF manual structure (3 manuals) | COMPLETE |
| Firmware document index + GPIO map | COMPLETE |
| Risk analysis + design trade-offs | COMPLETE |
| Procurement links + PCBWay RFQ language | COMPLETE |

### Key Design Decisions

1. **MCU: ESP32-S3-MINI-1U** — native WiFi + camera DVP + BLE 5.0 in 15×20mm module
2. **Camera: Himax HM01B0** — only camera module fitting 5–6mm device height at 1.7mm
3. **5mm → 6mm** — physically required; market spec "5mm" achievable with lateral battery
4. **Qi coil: Würth WR202020** — 20×20mm flex, 0.4mm thick, through PC inlay in mirror shell
5. **Stainless steel: 316L** — non-magnetic (Qi compatible), polishes to mirror, CNC-able
6. **100-unit run cost: ~$107/unit** — retail target $249–$299, ~64% gross margin

### Next Steps

```
□  Engage PCBWay for CNC + PCB quotes (use RFQ language in §19)
□  Order HM01B0 samples from Arrow Electronics
□  Order BME688 samples from Mouser
□  Produce KiCad schematic from this specification
□  Produce STEP enclosure model (Fusion 360 / FreeCAD)
□  Implement LOT API device routes (§9.3 database schema)
□  Begin firmware skeleton (ESP-IDF project init)
□  Request FCC pre-certification consultation
□  Design LOT-C1 packaging (box + insert)
```

---

*Document prepared by Claude Code — LOT Systems AI Engine*  
*Inventor: Vadim Marmeladov | Co-Inventor: Kuzya Cosmo Marmeladov*  
*LOT Systems, Inc. — Making in the USA*  
*brand.lot-systems.com | lot-systems.com | institute.lot-systems.com*

---

**END LOT-HW-C1-001 — SESSION 2026-06-06**
