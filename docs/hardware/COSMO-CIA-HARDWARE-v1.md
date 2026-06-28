<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — LOT Computer Hardware Specification

**Document:** COSMO-CIA-HARDWARE-v1.md
**Classification:** Public — Product Engineering
**Prepared:** June 28, 2026
**Version:** 1.0
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems
**Division:** COSMO® CIA (Connected Intelligence Artifact)
**Status:** Pre-Production Design — 100-Unit Pilot Run

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Industrial Design](#2-industrial-design)
3. [Hardware Architecture](#3-hardware-architecture)
4. [Bill of Materials](#4-bill-of-materials)
5. [PCBWay Manufacturing Specification](#5-pcbway-manufacturing-specification)
6. [Firmware Architecture](#6-firmware-architecture)
7. [LOT API Integration](#7-lot-api-integration)
8. [Software Stack](#8-software-stack)
9. [Production Plan — 100 Units](#9-production-plan--100-units)
10. [Roadmap](#10-roadmap)
11. [Document & Manual Structure](#11-document--manual-structure)
12. [Wireless Charger Specification](#12-wireless-charger-specification)
13. [Appendix A — Component Datasheets](#appendix-a--component-datasheets)
14. [Appendix B — API Endpoint Reference](#appendix-b--api-endpoint-reference)

---

## 1. Executive Summary

The **COSMO® CIA** (Connected Intelligence Artifact) is the first physical hardware node in the LOT Systems product ecosystem. It is a compact, precision-machined stainless steel device that acts as a personal ambient terminal — receiving autonomous AI-generated notifications from lot-systems.com and logging user interactions back to the LOT platform in real time.

### Mission

Put the LOT behavioral signal into the user's hand as a physical object. The COSMO® CIA is not a phone. It is not a watch. It is a **dedicated companion artifact** — a single-purpose device that surfaces what the LOT AI wants the user to know, and records when the user responds.

### Physical Identity

| Dimension | Value |
|-----------|-------|
| Form factor | Flat square |
| Size | 40 mm × 40 mm × 7 mm |
| Target weight | ≤ 28 g |
| Material | 316L stainless steel (CNC machined) |
| Side A | Mirror-polished stainless steel |
| Side B | Matte brushed + display + camera + button |
| Color | Silver |

> **Design Note:** The original specification calls for 5 mm total depth. Engineering analysis of the camera module stack (3.2 mm) + LiPo cell (2.5 mm) + PCB (0.8 mm) + enclosure plates (1.2 mm) yields a minimum practical depth of **7 mm** for v1.0. A 5 mm v2.0 design is planned using a periscope flat-optic camera and solid-state battery. All dimensional tolerances are held to ±0.1 mm via CNC.

---

## 2. Industrial Design

### 2.1 Two-Part Stainless Steel Body

The enclosure consists of exactly **two machined 316L stainless steel halves** joined by M1.2 recessed Torx screws (4× corners) with a 0.4 mm EPDM gasket for IP52 dust/splash resistance.

```
┌─────────────────────────────────────┐
│          SIDE A — TOP SHELL         │
│      Mirror-polished stainless      │
│      LOT® laser-etched logo (rear)  │
│      40mm × 40mm × 1.5mm plate      │
└─────────────────────────────────────┘
           ↕ EPDM gasket + screws
┌─────────────────────────────────────┐
│          SIDE B — BOTTOM SHELL      │
│      Matte brushed stainless        │
│                                     │
│   [CAM]   [SCREEN 1.3" OLED]  [BTN] │
│   6mm∅    30mm × 22mm         10mm∅ │
│                                     │
│   Wireless charge coil embedded     │
│   USB-C port (edge, flush)          │
└─────────────────────────────────────┘
```

### 2.2 Side A — Mirror Polish

- 316L stainless, Ra ≤ 0.05 µm (mirror grade)
- LOT® wordmark laser-etched on inner face (visible through edge gap)
- "COSMO® CIA" micro-engraved on chamfered bottom edge (0.3 mm depth, 1 pt font equivalent)
- No holes, no ports — clean unbroken surface

### 2.3 Side B — Feature Face

| Feature | Position | Aperture/Size |
|---------|----------|---------------|
| Camera lens | Top-left quadrant | 6 mm diameter opening, recessed 0.5 mm |
| OLED screen | Center-right | 30.5 mm × 22.5 mm cutout, flush glass cover |
| Copy button | Bottom-right | 10 mm diameter, stainless tactile dome, 0.2 mm travel |
| USB-C port | Right edge | Flush, IP52-rated connector |
| Wireless charge window | Full internal face | No external mark |

### 2.4 Screen Detail

A 1.3-inch monochrome OLED (128×64 px, white on black) sits behind a 0.7 mm anti-fingerprint sapphire glass cover flush with the Side B face. The display renders:

- Notification text (up to 24 characters per line, 3 lines)
- LOT® logo on idle/standby
- Battery indicator (top-right corner, 5-segment bar)
- WiFi signal indicator (top-left corner)
- Timestamp (bottom edge, 8 px font)

**Example display states:**

```
 ≋  ████  10:42
─────────────────
  ☕ Coffee time!
─────────────────
  from LOT AI
```

```
 ≋  ███░  14:15
─────────────────
  📊 Daily check
  in is ready.
─────────────────
  [COPIED ✓]
```

---

## 3. Hardware Architecture

### 3.1 System Block Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    COSMO® CIA HARDWARE                      │
│                                                            │
│  ┌──────────┐    SPI     ┌──────────────┐                 │
│  │ ESP32-S3 │◄──────────►│ 1.3" OLED   │                 │
│  │ MINI-1U  │            │ SH1106       │                 │
│  │          │    I2C     └──────────────┘                 │
│  │ 240MHz   │◄──────────►┌──────────────┐                 │
│  │ 512KB RAM│            │ BME688        │                 │
│  │ 8MB Flash│            │ Temp/Hum/Gas │                 │
│  │ WiFi+BLE │    DVP     └──────────────┘                 │
│  │          │◄──────────►┌──────────────┐                 │
│  │          │            │ OV2640        │                 │
│  │          │            │ 2MP Camera   │                 │
│  │  GPIO    │            └──────────────┘                 │
│  │    ↓     │    I2C     ┌──────────────┐                 │
│  │ BUTTON   │◄──────────►│ MAX17048      │                 │
│  │  INPUT   │            │ Fuel Gauge   │                 │
│  └──────────┘            └──────────────┘                 │
│       │                                                    │
│       │ I2C                                               │
│  ┌────▼──────────────────────────────────┐               │
│  │        BQ51013B Qi Receiver            │               │
│  │        + MCP73831 LiPo Charger         │               │
│  │        + TPS63020 Buck-Boost 3.3V      │               │
│  └────────────────────┬──────────────────┘               │
│                        │                                   │
│                   LiPo 300mAh                             │
│                   3.7V / 1.11Wh                           │
│                        │                                   │
│                   USB-C Port                               │
│                   (charge + firmware flash)                │
└────────────────────────────────────────────────────────────┘
```

### 3.2 Microcontroller — ESP32-S3-MINI-1U

| Parameter | Value |
|-----------|-------|
| CPU | Xtensa LX7 dual-core, 240 MHz |
| RAM | 512 KB SRAM + 8 MB PSRAM (package) |
| Flash | 8 MB embedded |
| WiFi | 802.11 b/g/n (2.4 GHz) |
| Bluetooth | BLE 5.0 |
| GPIO | 45 pins |
| ADC | 2× 12-bit, 20 channels |
| I2C | 2× |
| SPI | 4× |
| Camera interface | DVP (parallel) |
| Operating voltage | 3.0–3.6 V |
| Package | LCC 15.4 × 20.5 mm |
| Deep sleep current | 7 µA |

**Selection rationale:** The ESP32-S3-MINI-1U provides WiFi, BLE, and camera DVP interface in a single compact module. Deep sleep current of 7 µA allows the 300 mAh battery to sustain 2–3 days of standby with hourly notification checks.

### 3.3 Display — SH1106 1.3" OLED

| Parameter | Value |
|-----------|-------|
| Diagonal | 1.3 inch |
| Resolution | 128 × 64 px |
| Controller | SH1106G |
| Interface | SPI (4-wire) |
| Color | White on black (monochrome) |
| Brightness | 100 cd/m² typical |
| Operating voltage | 3.3 V |
| Operating current | 15 mA @ full brightness |
| Viewing angle | 160° |
| Module dimensions | 34 × 24 × 1.8 mm |

### 3.4 Camera — OV2640 M12

| Parameter | Value |
|-----------|-------|
| Sensor | OmniFision OV2640 |
| Resolution | 2 MP (1600×1200 UXGA) |
| Interface | DVP / SCCB |
| Lens | M12, f/2.0, 60° FOV |
| Module size | 28 × 28 × 12.3 mm |
| Operating voltage | 3.3 V |
| Current | 56 mA active |

> **Engineering Note:** The OV2640 module stack height (12.3 mm) exceeds the available internal clearance (4.6 mm) when mounted vertically. **Solution for v1.0:** Mount the OV2640 PCB **parallel** (flat) to the main PCB using a right-angle FFC connector and route the lens through the Side B aperture with a 45° total-internal-reflection prism block. This "periscope" arrangement adds 1.2 mm total depth vs. front-mount but allows the lens opening to face forward flush with Side B at 7 mm total device depth.

### 3.5 Environmental Sensor — BME688

| Parameter | Value |
|-----------|-------|
| Sensor | Bosch BME688 |
| Measurements | Temperature, Humidity, Barometric Pressure, VOC Gas |
| Interface | I2C / SPI |
| Accuracy (temp) | ±1.0°C |
| Accuracy (humidity) | ±3% RH |
| Pressure range | 300–1100 hPa |
| AI gas sensing | Bosch BSEC2 software library |
| Package | LGA 3.0 × 3.0 × 0.93 mm |
| Current | 2.1 µA sleep / 3.7 mA active |

The BME688 includes on-chip AI gas pattern recognition (Bosch BSEC2), enabling air quality index (AQI) computation, CO₂ equivalent estimation, and breath VOC detection — all running on-device without cloud.

### 3.6 Power System

#### Battery
- **Cell:** LiPo 300 mAh, 3.7 V nominal, 1.11 Wh
- **Dimensions:** 30 × 25 × 2.5 mm (custom pouch cell)
- **Protection:** integrated PCM (over-charge, over-discharge, short circuit)
- **Connector:** JST PH 2.0 mm 2-pin

#### Qi Wireless Charging Receiver
- **IC:** Texas Instruments BQ51013B
- **Standard:** Qi 1.2, 5 W max
- **Input:** 5 V @ 1 A from wireless coil
- **Coil:** 38 mm × 38 mm, 12 µH, 7-turn, Würth Elektronik 760308103216

#### LiPo Charger
- **IC:** Microchip MCP73831
- **Charge current:** 150 mA (programmable via R_prog)
- **Full-charge voltage:** 4.2 V
- **Input:** USB-C 5 V or Qi 5 V (diode OR'd)

#### Buck-Boost Regulator
- **IC:** TI TPS63020
- **Input range:** 1.8–5.5 V (covers LiPo discharge curve)
- **Output:** 3.3 V ±2%, 1 A
- **Efficiency:** 95% typical

#### Fuel Gauge
- **IC:** Maxim MAX17048
- **Interface:** I2C
- **Accuracy:** ±1% state-of-charge
- **Current:** 23 µA active

#### USB-C Port
- **Connector:** GCT USB4105-GF-A (USB-C 2.0, flush mount)
- **Functions:** 5 V charge input, USB serial (firmware flash via CP2102N bridge)

#### Power Budget

| State | Current Draw | Battery Life |
|-------|-------------|--------------|
| Deep sleep (WiFi off) | 7 µA | ~4,285 hours |
| Sleep + RTC wakeup every 30 min | ~120 µA avg | ~104 hours |
| Notification check (WiFi on, 8s) | ~75 mA × 8s / 1800s | ~55 hours average |
| Display on, no WiFi | 22 mA | ~13.6 hours |
| Camera capture (JPEG, 2s) | 60 mA × 2s | — |
| **Typical daily use** | **~3.5 mAh/day** (30 min check-in) | **~85 days** |

---

## 4. Bill of Materials

### 4.1 Electronics BOM — 100-Unit Production Run

> All prices are USD, EXW, estimated Q3 2026. Quantities shown are for 100 units + 10% spare.

| # | Component | Part Number | Supplier | Qty | Unit Price | Extended | Link |
|---|-----------|-------------|----------|-----|-----------|----------|------|
| 1 | MCU Module | ESP32-S3-MINI-1U (8MB) | LCSC | 110 | $3.20 | $352.00 | [LCSC C2909706](https://www.lcsc.com/product-detail/WiFi-Modules_Espressif-Systems-ESP32-S3-MINI-1U_C2909706.html) |
| 2 | OLED Display | SH1106 1.3" 128×64 SPI | LCSC | 110 | $2.80 | $308.00 | LCSC C5168462 |
| 3 | Camera Module | OV2640 M12 DVP | AliExpress / Arducam | 110 | $4.50 | $495.00 | Arducam B0271 |
| 4 | Environmental Sensor | BME688 | Mouser | 110 | $4.90 | $539.00 | [Mouser 828-BME688](https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688) |
| 5 | Qi Receiver IC | BQ51013BRHLR | Mouser | 110 | $2.15 | $236.50 | [Mouser 595-BQ51013BRHLR](https://www.mouser.com/ProductDetail/Texas-Instruments/BQ51013BRHLR) |
| 6 | LiPo Charger | MCP73831T-2ATI/OT | Mouser | 110 | $0.55 | $60.50 | [Mouser 579-MCP73831T-2ATI](https://www.mouser.com/ProductDetail/Microchip-Technology/MCP73831T-2ATI-OT) |
| 7 | Buck-Boost Reg | TPS63020DSJR | Mouser | 110 | $2.90 | $319.00 | [Mouser 595-TPS63020DSJR](https://www.mouser.com/ProductDetail/Texas-Instruments/TPS63020DSJR) |
| 8 | Fuel Gauge | MAX17048G+T10 | Mouser | 110 | $1.75 | $192.50 | [Mouser 700-MAX17048GT10](https://www.mouser.com/ProductDetail/Analog-Devices-Maxim-Integrated/MAX17048GT10) |
| 9 | USB-C Connector | USB4105-GF-A | Mouser | 110 | $0.68 | $74.80 | [Mouser 640-USB4105-GF-A](https://www.mouser.com/ProductDetail/GCT/USB4105-GF-A) |
| 10 | USB-Serial Bridge | CP2102N-A02-GQFN28R | Mouser | 110 | $1.85 | $203.50 | [Mouser 634-CP2102N-A02-GQF](https://www.mouser.com/ProductDetail/Silicon-Labs/CP2102N-A02-GQFN28R) |
| 11 | Qi Charging Coil | 760308103216 | Mouser | 110 | $1.20 | $132.00 | [Mouser 710-760308103216](https://www.mouser.com/ProductDetail/Wurth-Elektronik/760308103216) |
| 12 | LiPo Battery | 300mAh 3.7V 30×25×2.5mm | Alibaba custom | 110 | $4.20 | $462.00 | Custom cell, PCM included |
| 13 | Tactile Button | PTS636SP43SMTR2LFS | Mouser | 110 | $0.42 | $46.20 | [Mouser 611-PTS636SP43SMTR2](https://www.mouser.com/ProductDetail/C-K/PTS636SP43SMTR2LFS) |
| 14 | Sapphire Glass Cover | Custom 30.5×22.5×0.7mm AR | Alibaba | 110 | $2.80 | $308.00 | Custom optical glass |
| 15 | TIR Prism Block | 45° glass prism 6×6×6mm | Edmund Optics | 110 | $3.50 | $385.00 | [Edmund 47-260](https://www.edmundoptics.com/p/47260) |
| 16 | Passive Components | R, C, L assortment | LCSC | 1 lot | $45.00 | $45.00 | Standard 0402/0603 |
| 17 | Connectors & Headers | FFC, JST, test pads | Mouser | 1 lot | $38.00 | $38.00 | — |
| 18 | ESD Protection | TPD4S214RSER | Mouser | 110 | $0.45 | $49.50 | [Mouser 595-TPD4S214RSER](https://www.mouser.com/ProductDetail/Texas-Instruments/TPD4S214RSER) |
| | | | | | **Electronics Sub-total** | **$3,447.50** | |

### 4.2 Mechanical BOM — 100 Units

| # | Component | Spec | Supplier | Qty | Unit Price | Extended |
|---|-----------|------|----------|-----|-----------|----------|
| 1 | Top Shell (Side A) | 316L SS, 40×40×1.5mm, mirror-polished | PCBWay CNC | 110 | $18.00 | $1,980.00 |
| 2 | Bottom Shell (Side B) | 316L SS, 40×40×5.5mm, matte brushed, machined | PCBWay CNC | 110 | $22.00 | $2,420.00 |
| 3 | Main PCB | 4-layer FR4, 36×36mm, HASL-LF | PCBWay | 110 | $1.80 | $198.00 |
| 4 | Camera Sub-PCB | 2-layer FR4, 26×26mm | PCBWay | 110 | $0.90 | $99.00 |
| 5 | EPDM Gasket | 40×40mm frame, 0.4mm, custom die-cut | Alibaba | 110 | $0.35 | $38.50 |
| 6 | M1.2 Torx Screws | M1.2×3mm A2 stainless, T4H | McMaster | 440+spare | $0.08 | $38.40 |
| 7 | Thermal Pad | 1mm silicone, 30×30mm | Laird | 110 | $0.25 | $27.50 |
| 8 | FFC Cable | 0.5mm pitch, 20-pin, 3cm | LCSC | 110 | $0.18 | $19.80 |
| 9 | Laser Engraving | "COSMO® CIA" + serial number | PCBWay | 110 | $2.50 | $275.00 |
| | | | | | **Mechanical Sub-total** | **$5,096.20** |

### 4.3 Wireless Charger BOM — 100 Units

| # | Component | Spec | Supplier | Qty | Unit Price | Extended |
|---|-----------|------|----------|-----|-----------|----------|
| 1 | Charging Pad PCB | 2-layer FR4, 80×80mm | PCBWay | 110 | $1.20 | $132.00 |
| 2 | Qi Transmitter IC | BQ500211AYFFR | Mouser | 110 | $3.20 | $352.00 |
| 3 | Transmitter Coil | 80mm, 10 µH | Würth 760308103210 | 110 | $2.10 | $231.00 |
| 4 | MOSFET Half-Bridge | CSD17313Q2 | Mouser | 220 | $0.55 | $121.00 |
| 5 | USB-C Input Port | USB4105-GF-A | Mouser | 110 | $0.68 | $74.80 |
| 6 | 5V/2A PSU | Mean Well IRM-10-5 | Mouser | 110 | $7.80 | $858.00 |
| 7 | Pad Housing | ABS injection mold, 85×85×8mm | Alibaba | 110 | $4.50 | $495.00 |
| 8 | Rubber feet | 4× self-adhesive | Alibaba | 110 | $0.10 | $11.00 |
| 9 | LED Indicator | Blue 0603 SMD | LCSC | 110 | $0.05 | $5.50 |
| 10 | Passive Components | R, C for Qi circuit | LCSC | 1 lot | $12.00 | $12.00 |
| | | | | | **Charger Sub-total** | **$2,292.30** |

### 4.4 Packaging & Documentation — 100 Units

| # | Item | Spec | Qty | Unit Price | Extended |
|---|------|------|-----|-----------|----------|
| 1 | Retail Box | 60×60×20mm, matte black, spot-UV LOT® logo | 100 | $1.80 | $180.00 |
| 2 | Quick Start Guide | 4-panel fold, 90×90mm, 2 sides | 100 | $0.35 | $35.00 |
| 3 | Full PDF Manual | USB drive preloaded | 100 | $1.20 | $120.00 |
| 4 | Anti-static bag | 60×80mm | 100 | $0.12 | $12.00 |
| 5 | Foam insert | Custom die-cut EVA | 100 | $0.90 | $90.00 |
| 6 | Serial number label | Tamper-evident, QR code | 100 | $0.15 | $15.00 |
| | | | | **Packaging Sub-total** | **$452.00** |

### 4.5 Cost Summary — 100 Units

| Category | Cost |
|----------|------|
| Electronics | $3,447.50 |
| Mechanical / Enclosure | $5,096.20 |
| Wireless Charger | $2,292.30 |
| Packaging & Docs | $452.00 |
| PCB Assembly (PCBA, PCBWay turnkey) | $2,400.00 |
| NRE — PCB tooling, stencils | $350.00 |
| NRE — CNC setup / fixturing | $800.00 |
| NRE — Mold (Qi pad housing) | $1,200.00 |
| Freight & import duties (est.) | $650.00 |
| QA / test labor (100 units × $8) | $800.00 |
| **TOTAL (100 units)** | **$17,488.00** |
| **Cost per unit** | **$174.88** |

---

## 5. PCBWay Manufacturing Specification

### 5.1 Main PCB — Order Specification

**PCBWay Quote Page:** https://www.pcbway.com/pcb-quote.aspx

| Parameter | Value |
|-----------|-------|
| Board size | 36 × 36 mm |
| Layers | 4 (signal / GND / PWR / signal) |
| Thickness | 0.8 mm |
| Material | FR4, Tg 150 |
| Surface finish | HASL Lead-free |
| Solder mask | Black (both sides) |
| Silkscreen | White (top side only) |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Min trace/space | 3/3 mil |
| Min hole size | 0.2 mm (laser via) |
| Via type | Tented (all vias) |
| IPC class | Class II |
| Quantity | 110 pcs |
| Estimated price | ~$198 / 110 pcs |
| Lead time | 5 business days |

### 5.2 Turnkey PCBA

**PCBWay Turnkey Assembly:** https://www.pcbway.com/turnkey-pcb-assembly-quote.aspx

- **Service:** Full turnkey (PCBWay sources all components from BOM)
- **Solder paste:** SAC305 lead-free
- **Reflow profile:** Per IPC-7530, J-STD-020E
- **AOI:** Yes (all SMD placements)
- **X-ray:** BGA/QFN joints spot-checked
- **Conformal coat:** No (for v1.0; v1.1 will add moisture protection)
- **Functional test:** Pre-programmed test firmware, power-on verify, display check

### 5.3 CNC Machining — Stainless Steel Shells

**PCBWay CNC Service:** https://www.pcbway.com/rapid-prototyping/manufacture/CNC_Machining_Service.html

| Parameter | Side A (Top) | Side B (Bottom) |
|-----------|-------------|-----------------|
| Material | 316L Stainless | 316L Stainless |
| Blank size | 44 × 44 × 3 mm | 44 × 44 × 7 mm |
| Finish | Mirror polish Ra ≤ 0.05 µm | Brushed #4 Ra 0.4–0.8 µm |
| Tolerances | ±0.05 mm machined | ±0.05 mm machined |
| Tapped holes | 4× M1.2 blind | 4× M1.2 through |
| Camera aperture | — | 6 mm ∅ ±0.02 mm |
| Screen aperture | — | 30.5 × 22.5 mm ±0.05 mm |
| Button aperture | — | 10 mm ∅ ±0.05 mm |
| USB-C slot | — | 9 × 3.2 mm slot ±0.05 mm |
| Laser engrave | Inner face: LOT® logo | Chamfer edge: COSMO® CIA + serial |

### 5.4 Design Files Package (Gerbers + Mechanicals)

The following files are required for PCBWay submission:

```
cosmo-cia-pcbway-package/
├── gerbers/
│   ├── cosmo-cia-main-pcb.GTL      (top copper)
│   ├── cosmo-cia-main-pcb.GBL      (bottom copper)
│   ├── cosmo-cia-main-pcb.GIN1     (inner 1 - GND)
│   ├── cosmo-cia-main-pcb.GIN2     (inner 2 - PWR)
│   ├── cosmo-cia-main-pcb.GTS      (top solder mask)
│   ├── cosmo-cia-main-pcb.GBS      (bottom solder mask)
│   ├── cosmo-cia-main-pcb.GTO      (top silkscreen)
│   ├── cosmo-cia-main-pcb.GBO      (bottom silkscreen)
│   ├── cosmo-cia-main-pcb.TXT      (drill file)
│   └── cosmo-cia-main-pcb.GML      (board outline)
├── assembly/
│   ├── cosmo-cia-bom.xlsx          (BOM with MPN, manufacturer, value)
│   ├── cosmo-cia-cpl.csv           (component placement list, X/Y/R)
│   └── cosmo-cia-assembly-notes.pdf
├── mechanical/
│   ├── shell-side-a.step           (STEP 3D model)
│   ├── shell-side-b.step
│   ├── shell-side-a.dxf            (2D drawing with tolerances)
│   ├── shell-side-b.dxf
│   └── cosmo-cia-assembly.step     (full assembly)
└── README.txt
```

---

## 6. Firmware Architecture

### 6.1 Stack Overview

```
┌────────────────────────────────────────┐
│          COSMO® CIA Firmware           │
│          v1.0 — ESP-IDF 5.x           │
├────────────────────────────────────────┤
│  Application Layer                     │
│  ├── notification_manager.c            │
│  ├── copy_button_handler.c             │
│  ├── camera_capture.c                  │
│  ├── weather_reporter.c                │
│  └── display_renderer.c               │
├────────────────────────────────────────┤
│  LOT API Client Layer                  │
│  ├── lot_api.c    (HTTPS REST)         │
│  ├── lot_auth.c   (JWT + device token) │
│  ├── lot_log.c    (POST /api/log)      │
│  └── lot_notify.c (GET /api/notify)   │
├────────────────────────────────────────┤
│  Connectivity Layer                    │
│  ├── wifi_manager.c                    │
│  └── ota_updater.c                     │
├────────────────────────────────────────┤
│  Driver Layer                          │
│  ├── sh1106_oled.c                     │
│  ├── ov2640_camera.c                   │
│  ├── bme688_sensor.c                   │
│  └── max17048_fuel.c                   │
├────────────────────────────────────────┤
│  ESP-IDF RTOS (FreeRTOS)              │
│  └── esp-idf v5.1.x                   │
└────────────────────────────────────────┘
```

### 6.2 Power State Machine

```
[DEEP SLEEP]
     │ RTC timer (30 min)
     ▼
[WAKE — SENSOR READ]
  - Read BME688 (temp, humidity, pressure, AQI)
  - Read MAX17048 (battery %)
  - Duration: ~50 ms
     │
     ▼
[WiFi CONNECT]
  - Connect to saved AP (stored in NVS)
  - Timeout: 10 s
     │
     ▼
[LOT API POLL]
  - GET https://lot-systems.com/api/device/notify
  - Auth: Bearer {device_token}
  - Parse JSON: { message, timestamp, type }
     │
     ▼ [notification exists?]
     │ YES → UPDATE DISPLAY → 60s display on → DEEP SLEEP
     │ NO  → DEEP SLEEP immediately
     │
[BUTTON EVENT] (interrupt, any state)
  - Wake from any sleep state
  - Capture camera JPEG (320×240, 70% quality)
  - POST to /api/device/log (button press + image + sensor data)
  - Display: "COPIED ✓" for 2s
  - Return to prior state
```

### 6.3 Display Rendering

The OLED renderer operates on a 128×64 framebuffer in SH1106G native format.

```c
// Font sizes available:
//   FONT_6x8  — body text, 21 chars/line, 8 lines
//   FONT_8x16 — notification text, 16 chars/line, 4 lines
//   FONT_5x7  — status bar, 25 chars/line

typedef struct {
    char message[72];       // up to 3 lines × 24 chars
    uint8_t battery_pct;
    bool wifi_connected;
    uint32_t timestamp_unix;
    bool copy_confirmed;
} DisplayState;

void display_render(const DisplayState *state);
```

### 6.4 Notification Types

| Type | Icon | Behavior |
|------|------|----------|
| `reminder` | ☕ | Show message, flash display 2× |
| `alert` | ⚠️ | Show message, rapid flash 5× |
| `report` | 📊 | Show message, static |
| `weather` | 🌤 | Show LOT + local BME688 data |
| `achievement` | ⭐ | Show badge name, display 120s |
| `system` | ⚙️ | OTA update available or config change |

### 6.5 OTA Firmware Update

Updates are delivered via the LOT API:

1. Device polls `/api/device/ota-check` with current firmware version
2. If new version available, server returns signed firmware URL
3. Device downloads firmware binary via HTTPS to OTA partition
4. Signature verified (ECDSA P-256)
5. Device reboots into new firmware
6. If boot fails after 3 attempts, rolls back to previous partition

### 6.6 Device Provisioning

New units are provisioned via **BLE provisioning** using ESP-IDF's `wifi_provisioning` component:

1. User installs LOT mobile app or visits lot-systems.com/connect
2. Device advertises BLE service: `COSMO-CIA-XXXX` (last 4 of serial)
3. User scans QR code on device packaging → auto-connects BLE
4. App sends WiFi credentials + LOT user token to device
5. Device stores credentials in NVS (encrypted partition)
6. Device registers serial number with LOT API
7. Confirmation: display shows "Linked to LOT ✓"

### 6.7 Security

| Threat | Mitigation |
|--------|-----------|
| Eavesdropping | All LOT API calls via TLS 1.3 (mbedTLS, pinned cert) |
| Device spoofing | Per-device ECDSA keypair burned at provisioning; server verifies signature |
| Firmware tampering | Secure boot v2 (ESP32-S3 eFuse), signed OTA images |
| Physical access | NVS partition encrypted (AES-256-XTS), flash encryption enabled |
| Lost device | Remote wipe via LOT API — device token revoked, NVS wiped on next connect |

---

## 7. LOT API Integration

### 7.1 Device Endpoints

The COSMO® CIA device communicates exclusively with `https://lot-systems.com`.

#### 7.1.1 Authenticate Device

```http
POST /api/device/auth
Content-Type: application/json

{
  "serial": "CIA-001-00042",
  "device_pub_key": "base64_ecdsa_p256_pubkey",
  "signature": "base64_ecdsa_sig_of_serial"
}

Response 200:
{
  "device_token": "eyJ...",
  "expires_at": "2026-12-28T00:00:00Z",
  "user_id": "usr_abc123",
  "user_display": "Vadik"
}
```

#### 7.1.2 Poll for Notifications

```http
GET /api/device/notify
Authorization: Bearer {device_token}

Response 200:
{
  "has_notification": true,
  "notification": {
    "id": "notif_xyz789",
    "message": "Coffee time!",
    "type": "reminder",
    "created_at": "2026-06-28T10:42:00Z"
  }
}

Response 200 (no notification):
{
  "has_notification": false
}
```

#### 7.1.3 Log Copy Button Event

This is the **Copy Signal** — sent to the Log tab on lot-systems.com when the user presses the button.

```http
POST /api/device/log
Authorization: Bearer {device_token}
Content-Type: application/json

{
  "event": "copy_button_pressed",
  "serial": "CIA-001-00042",
  "timestamp": "2026-06-28T10:43:12Z",
  "notification_id": "notif_xyz789",
  "sensor_data": {
    "temperature_c": 22.4,
    "humidity_pct": 48.2,
    "pressure_hpa": 1013.1,
    "aqi": 47,
    "battery_pct": 78
  },
  "camera_jpeg": "base64_jpeg_320x240_optional"
}

Response 200:
{
  "logged": true,
  "log_id": "log_abc456",
  "visible_in": "https://lot-systems.com/log"
}
```

#### 7.1.4 Report Weather Data

```http
POST /api/device/weather
Authorization: Bearer {device_token}
Content-Type: application/json

{
  "serial": "CIA-001-00042",
  "timestamp": "2026-06-28T10:44:00Z",
  "temperature_c": 22.4,
  "humidity_pct": 48.2,
  "pressure_hpa": 1013.1,
  "aqi": 47,
  "co2_equivalent_ppm": 782,
  "voc_index": 134
}
```

#### 7.1.5 OTA Check

```http
GET /api/device/ota-check?serial=CIA-001-00042&fw_version=1.0.3
Authorization: Bearer {device_token}

Response 200 (update available):
{
  "update_available": true,
  "new_version": "1.0.4",
  "firmware_url": "https://lot-systems.com/firmware/cosmo-cia-1.0.4.bin",
  "sha256": "abc123...",
  "signature": "base64_ecdsa_sig"
}
```

### 7.2 Server-Side Implementation (lot-systems.com)

The following server routes need to be implemented in the LOT Systems Fastify backend (`src/server/`):

```
src/server/routes/
└── device/
    ├── auth.ts          ← POST /api/device/auth
    ├── notify.ts        ← GET  /api/device/notify
    ├── log.ts           ← POST /api/device/log
    ├── weather.ts       ← POST /api/device/weather
    └── ota-check.ts     ← GET  /api/device/ota-check
```

```
src/server/models/
├── DeviceRegistration.ts   ← serial, pubkey, user_id, activated_at
├── DeviceLog.ts            ← event logs, visible in /log tab
└── DeviceNotification.ts   ← queue of messages to push to device
```

The **Log tab** on lot-systems.com queries `DeviceLog` and renders each Copy button press as a timeline entry — showing the notification that was copied, timestamp, sensor readings at time of press, and optionally the camera thumbnail.

---

## 8. Software Stack

### 8.1 Firmware Development Environment

| Tool | Version | Purpose |
|------|---------|---------|
| ESP-IDF | 5.1.x | RTOS + driver framework |
| GCC Xtensa toolchain | 12.x | Cross-compilation |
| CMake | 3.24+ | Build system |
| esptool.py | 4.7+ | Flashing |
| idf.py monitor | — | Serial debug console |
| Clang-format | 16 | Code formatting |
| Unity | 2.5 | Unit testing framework |

**Repository structure for firmware:**
```
firmware/
├── main/
│   ├── main.c
│   ├── app_state.c / .h
│   ├── notification_manager.c / .h
│   ├── copy_button_handler.c / .h
│   ├── camera_capture.c / .h
│   ├── weather_reporter.c / .h
│   └── display_renderer.c / .h
├── components/
│   ├── lot_api_client/
│   ├── sh1106_driver/
│   ├── ov2640_driver/
│   ├── bme688_driver/
│   └── max17048_driver/
├── test/
├── CMakeLists.txt
├── sdkconfig.defaults
└── partitions.csv
```

### 8.2 Desktop Companion App (Optional — v1.1)

A lightweight cross-platform desktop app (Electron or Tauri) provides:
- Device provisioning GUI
- Firmware update (USB-C fallback when OTA fails)
- Local log viewer
- Notification composer (send custom message to device)

### 8.3 LOT Platform Web Interface

Existing lot-systems.com additions required:

| Page/Tab | Change Required |
|----------|----------------|
| `/log` | Add `DeviceLog` section — timeline of Copy button presses |
| `/settings` | Add "My COSMO® CIA" card — device status, battery, last seen |
| `/notifications` | Add "Send to Device" button on each notification |
| `/firmware` | Admin page — upload new firmware .bin, manage OTA rollout |

---

## 9. Production Plan — 100 Units

### 9.1 Timeline

| Phase | Duration | Activities | Owner |
|-------|----------|-----------|-------|
| **P0 — Design Lock** | Weeks 1–2 | Finalize schematics, PCB layout, mechanical CAD, BOM | Engineering |
| **P1 — Prototypes** | Weeks 3–6 | Order 5× prototype units from PCBWay (PCBA + CNC) | Engineering |
| **P2 — Proto Test** | Weeks 7–8 | Hardware validation, firmware bring-up, LOT API integration | Engineering |
| **P3 — Design Rev** | Weeks 9–10 | Fix proto issues, update Gerbers + STEP files | Engineering |
| **P4 — Pilot Build** | Weeks 11–14 | Order 110 units PCBA (PCBWay), CNC shells (PCBWay), charger pads | Production |
| **P5 — Assembly** | Weeks 15–16 | Receive parts, hand-assemble (screw shells, install battery, QA each unit) | Production |
| **P6 — Provisioning** | Week 17 | Flash firmware, burn device keys, register serial numbers in LOT DB | Engineering |
| **P7 — QA** | Week 18 | 100% functional test (display, button, WiFi, Qi charge, camera, sensors) | QA |
| **P8 — Packaging** | Week 19 | Box, insert, manual, ship | Logistics |
| **P9 — Ship** | Week 20 | Deliver to first 100 users | Logistics |

**Total calendar time:** ~20 weeks (~5 months) from design lock to delivery.

### 9.2 Quality Test Checklist (per unit)

- [ ] Power-on self-test passes (firmware boot message on OLED)
- [ ] WiFi provisioning via BLE completes in < 60 s
- [ ] Connects to lot-systems.com API — auth token received
- [ ] Notification poll works — test notification displayed correctly
- [ ] Copy button press — log entry appears in LOT Log tab within 5 s
- [ ] Camera capture — JPEG decoded successfully, not corrupted
- [ ] BME688 sensor — temperature within ±2°C of reference, humidity ±5% RH
- [ ] Battery level displayed correctly (compare MAX17048 vs DMM voltage)
- [ ] Qi wireless charging — charges from 10% to 20% in < 10 min
- [ ] USB-C charge — device charges at 5V 150 mA (per MCP73831 R_prog)
- [ ] OTA check — returns "up to date" for latest firmware
- [ ] Display uniformity — no dead pixels, no ghost lines
- [ ] Enclosure — no gaps, screws flush, gasket seated, no rattle
- [ ] Mirror polish — no scratches, fingerprint-clean
- [ ] Serial number engraving — readable, correct unit number
- [ ] Firmware version logged to LOT DB

### 9.3 Serial Numbering Format

`CIA-001-NNNNN`

- `CIA` — COSMO® CIA product line
- `001` — hardware version 1.0
- `NNNNN` — sequential 5-digit unit number (00001–00100 for pilot)

### 9.4 Build Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Camera periscope prism alignment tolerance | Medium | High | Fixturing jig for prism placement; optical test station |
| 300mAh LiPo cell availability at 2.5mm | Medium | High | Pre-qualify 2 alternative cell vendors (Alibaba, Shenzhen direct) |
| PCBWay CNC tolerance on M1.2 tapped holes | Low | Medium | Over-specify ±0.02 mm; request first-article inspection |
| BQ51013B Qi receiver efficiency (Qi coil alignment) | Low | Medium | Test 3 coil orientations; add fiducial marks to charging pad |
| ESP32-S3 PSRAM availability | Low | Low | Buffer 150 units' worth in BOM |
| Firmware API endpoint not ready | Medium | High | Mock API server for firmware testing during P2 |

---

## 10. Roadmap

### Hardware Versions

| Version | Target Date | Key Changes |
|---------|------------|-------------|
| **v1.0 — CIA Pilot** | Q4 2026 | 100-unit pilot, 7mm depth, OV2640 periscope, BME688 |
| **v1.1 — CIA Production** | Q2 2027 | Fix proto issues, conformal coat, improved Qi alignment, FCC/CE cert |
| **v2.0 — CIA Ultra** | Q4 2027 | 5mm depth, solid-state battery, flat-optic camera, e-ink display variant |
| **v3.0 — CIA Pro** | 2028 | COSMO® Soul Sync integration, Benchmark score display, haptic feedback |

### Software Milestones

| Milestone | Target | Deliverable |
|-----------|--------|------------|
| Firmware v1.0 | P2 (Week 7) | Boot, display, WiFi, LOT API client |
| Firmware v1.1 | P4 (Week 11) | Camera, OTA, BLE provisioning |
| Firmware v1.2 | P6 (Week 17) | Production provisioning, secure boot, flash encryption |
| LOT API device routes | P2 (Week 7) | 5 endpoints live on lot-systems.com |
| Log tab device section | P6 (Week 17) | Copy button events visible on site |
| Admin firmware portal | P6 (Week 17) | OTA management for 100 devices |
| Companion app v1.0 | Q1 2027 | USB provisioning fallback, local log |

### COSMO® CIA → COSMO® Robot Integration Path

```
COSMO® CIA (2026)
  │  Behavioral data collected via Copy button patterns
  │  Weather + sensor data enriches LOT user profile
  │  Camera captures add environmental context
  │
  ▼
LOT Benchmark Score (ongoing)
  │  Purple+ tier unlocks COSMO® Robot eligibility
  │
  ▼
COSMO® Robot v1 (2028–2029)
  │  Soul Sync Protocol™ loads verified behavioral profile
  │  CIA device becomes robot's ambient notification relay
  │
  ▼
COSMO® Enterprise (2029+)
  │  School / hospital / elder care deployments
  │  CIA devices distributed to caregivers
```

---

## 11. Document & Manual Structure

### 11.1 PDF Manual Set (per unit, on USB drive)

```
COSMO-CIA-Manual-v1.0/
├── 01_Quick_Start_Guide.pdf         (4 pages — unbox, charge, provision)
├── 02_User_Manual.pdf               (20 pages — full feature guide)
├── 03_Firmware_Reference.pdf        (30 pages — API, OTA, security)
├── 04_Hardware_Reference.pdf        (25 pages — schematics, BOM, assembly)
├── 05_LOT_API_Reference.pdf         (15 pages — all device endpoints)
├── 06_Provisioning_Guide.pdf        (8 pages — BLE setup, WiFi, LOT link)
├── 07_Safety_and_Compliance.pdf     (4 pages — battery, RF, CE/FCC)
└── 08_Service_Manual.pdf            (10 pages — disassembly, repair, RMA)
```

### 11.2 Quick Start Guide Content

1. What's in the box
2. Charging: place on Qi pad, wait for LED indicator
3. Download LOT app or visit lot-systems.com/connect
4. Press button to enter pairing mode (BLE)
5. Follow on-screen instructions to link LOT account
6. First notification will appear within 30 minutes

### 11.3 User Manual Chapters

1. Overview & Safety
2. Industrial Design — how to handle polished surfaces
3. Side A & Side B explained
4. Display: reading notifications
5. Copy Button: what it does, what gets logged
6. Weather data: how BME688 enriches your LOT profile
7. Camera: privacy, when it activates, how to disable
8. Battery & Charging: Qi and USB-C
9. WiFi & Connectivity
10. Notifications from lot-systems.com (types, schedule)
11. Firmware updates (automatic via OTA)
12. Troubleshooting
13. Specs & Compliance
14. Warranty & RMA

### 11.4 Firmware Reference Manual Chapters

1. Architecture overview
2. Power state machine
3. Display framebuffer API
4. LOT API client library
5. Sensor driver interfaces
6. BLE provisioning protocol
7. OTA update mechanism
8. Secure boot & flash encryption
9. NVS key-value store layout
10. Serial debug console commands
11. Test firmware protocol
12. Build & flash instructions (ESP-IDF)

---

## 12. Wireless Charger Specification

### 12.1 Overview

Each COSMO® CIA ships with a **dedicated Qi wireless charging pad** designed to hold the device at a precise alignment — mirror side up, feature side down — for optimal charging coil coupling.

### 12.2 Design

```
┌─────────────────────────────┐
│    COSMO® CIA Qi PAD        │
│    85 × 85 × 8 mm           │
│    Matte black ABS           │
│                             │
│   ┌──────────────────┐      │
│   │  40×40 recess    │      │  ← Device sits mirror-down here
│   │  2mm deep        │      │
│   │  80mm Qi coil    │      │
│   │  below           │      │
│   └──────────────────┘      │
│                             │
│  [LED] ← blue when charging │
│                             │
│  [USB-C in] ← right edge   │
└─────────────────────────────┘
```

### 12.3 Charger Electrical Specification

| Parameter | Value |
|-----------|-------|
| Standard | Qi 1.2, 5 W |
| Input | USB-C 5 V / 2 A |
| Transmitter IC | TI BQ500211AYFFR |
| Coil | 80 mm, 10 µH, 7-turn |
| Coupling efficiency | ~70% at 2 mm separation |
| Charge time (300 mAh, 0→100%) | ~3.5 hours |
| LED indicator | Blue solid = charging, off = charged |
| Idle power | < 300 mW (Qi baseline mode) |

### 12.4 Recess Alignment Feature

The 2 mm deep 40×40 mm recess in the pad surface:
- Automatically centers the device over the Qi coil
- Protects the mirror-polished Side A from surface scratches
- Provides stable desk footprint while charging
- Soft rubber lining (0.3 mm silicone) protects polish

---

## Appendix A — Component Datasheets

| Component | Datasheet URL |
|-----------|--------------|
| ESP32-S3-MINI-1U | https://www.espressif.com/sites/default/files/documentation/esp32-s3-mini-1_mini-1u_datasheet_en.pdf |
| SH1106G (OLED controller) | https://www.displayfuture.com/Display/datasheet/controller/SH1106.pdf |
| OV2640 | https://www.uctronics.com/download/cam_module/OV2640DS.pdf |
| BME688 | https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme688-ds000.pdf |
| BQ51013B (Qi RX) | https://www.ti.com/lit/ds/symlink/bq51013b.pdf |
| MCP73831 (charger) | https://ww1.microchip.com/downloads/en/DeviceDoc/MCP73831-Family-Data-Sheet-DS20001984H.pdf |
| TPS63020 (buck-boost) | https://www.ti.com/lit/ds/symlink/tps63020.pdf |
| MAX17048 (fuel gauge) | https://www.analog.com/media/en/technical-documentation/data-sheets/MAX17048-MAX17049.pdf |
| BQ500211A (Qi TX) | https://www.ti.com/lit/ds/symlink/bq500211a.pdf |
| CP2102N (USB-serial) | https://www.silabs.com/documents/public/data-sheets/cp2102n-datasheet.pdf |
| Würth Qi TX coil 760308103216 | https://www.we-online.com/catalog/datasheet/760308103216.pdf |

---

## Appendix B — API Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/device/auth` | None (signature) | Register device, get token |
| GET | `/api/device/notify` | Bearer token | Poll latest notification |
| POST | `/api/device/log` | Bearer token | Log Copy button press |
| POST | `/api/device/weather` | Bearer token | Upload sensor data |
| GET | `/api/device/ota-check` | Bearer token | Check for firmware update |
| POST | `/api/device/provision` | Admin | Factory provision new serial |
| DELETE | `/api/device/revoke` | Bearer token | Remote wipe device |

---

## Appendix C — Regulatory & Compliance Notes

| Certification | Requirement | Status for v1.0 |
|--------------|-------------|----------------|
| FCC Part 15 (WiFi/BLE) | Required for US market | Pre-compliance testing in P2; formal cert in v1.1 |
| CE RED (EU radio) | Required for EU market | v1.1 target |
| Qi certification | Required to use "Qi" mark | v1.1 target |
| UL/IEC 62368-1 (audio/video safety) | Recommended | v1.1 target |
| RoHS / WEEE | Required for EU | All BOM components RoHS-compliant |
| UN 38.3 (LiPo transport) | Required for air freight | Battery vendor must supply test report |

---

## Appendix D — File Manifest (This Session)

| File | Location | Description |
|------|----------|-------------|
| `COSMO-CIA-HARDWARE-v1.md` | `docs/hardware/` | This document |
| *(Gerber package)* | `hardware/gerbers/` | To be created in firmware phase |
| *(Firmware repo)* | `firmware/` | To be created in P0 |
| *(CAD models)* | `hardware/mechanical/` | To be created in P0 |

---

*Invented by Vadim Marmeladov. Named for Kuzya Cosmo Marmeladov.*
*LOT Systems, Inc. — brand.lot-systems.com — lot-systems.com*
*COSMO® CIA — the soul of LOT, held in your hand.*
