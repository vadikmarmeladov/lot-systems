<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Bill of Materials (BOM)

**Document:** COMPONENTS-BOM.md
**Revision:** 1.0
**Date:** May 28, 2026
**Project:** COSMO® Computer CC-1
**Run Qty:** 100 units
**Currency:** USD

All prices are estimated street prices for 100-unit quantities. Exact quotes must be obtained from suppliers before ordering.

---

## 1. Core Electronics

### 1.1 Microcontroller

| # | Part | Part Number | Supplier | Unit Price (100×) | Link / Notes |
|---|------|------------|----------|-------------------|------|
| 1 | ESP32-S3FN8 (QFN56, 8MB flash, dual-core 240MHz, WiFi+BLE) | ESP32-S3FN8 | Mouser / LCSC | $3.20 | mouser.com → search `ESP32-S3FN8`; LCSC: C2913202 |
| 2 | 40 MHz crystal oscillator (3225 package) | ABM8G-40.000MHZ | Abracon / Mouser | $0.35 | Required for ESP32-S3 USB PHY |
| 3 | 100 nF decoupling caps, 0402 (×20 per board) | GRM155R71C104KA88D | Murata / Mouser | $0.02 ea | Standard; buy tape reel |
| 4 | 10 µF bulk caps, 0603 (×4 per board) | GRM188R60J106ME47D | Murata | $0.08 ea | Power rail stability |

**Notes:** The ESP32-S3FN8 includes 8MB flash on-chip, eliminating the need for an external flash chip. Source from LCSC for best 100-unit pricing (~$2.80/unit).

---

### 1.2 Display

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 5 | 1.5" OLED 128×128 SSD1327 grayscale module | ER-OLED015-3 | BuyDisplay / AliExpress | $6.50 | 30×30mm visible area; SPI interface; 3.3V |
| 6 | 0.5mm pitch 10-pin FPC cable, 30mm | Generic FPC-10-30 | LCSC / Mouser | $0.20 | Connects display to PCB |
| 7 | Gorilla Glass window, 32×32mm, 0.7mm thick | Custom | PCBWay / local fab | $2.00 | Laser-cut, anti-reflection coat |

**Display alternative:** Waveshare 1.28" 240×240 round GC9A01 TFT ($5.80) if color is preferred over grayscale. Same SPI footprint.

---

### 1.3 Camera

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 8 | OV2640 2MP camera module, low-profile, DVP | OV2640-24×24 | Arducam / AliExpress | $4.50 | 24×24mm footprint, 5mm total height with lens |
| 9 | Sapphire glass lens cover, 5mm Ø, 0.5mm | Custom | Edmund Optics / Alibaba | $1.20 | Protects lens aperture |
| 10 | Camera FPC flex connector, 24-pin, 0.5mm pitch | 502250-2410 | Molex / Mouser | $0.45 | PCB-side ZIF socket |

**Camera note:** The OV2640 with a low-profile M7-mount lens sits at exactly 5mm height. The camera window in Side B aligns flush with the PCB plane. The sapphire cover glass is recessed 0.3mm and surrounded by a stainless steel raised ring (aesthetic camera bump effect, +1.2mm max protrusion).

---

### 1.4 Environmental Sensors (AI-Grade)

| # | Part | Part Number | Supplier | Unit Price (100×) | Measures |
|---|------|------------|----------|-------------------|---------|
| 11 | Bosch BME688 (4-in-1 AI sensor) | BME688 | Mouser C3719481 | $4.80 | Temp (±1°C), humidity (±3%), pressure (±1 hPa), IAQ VOC |
| 12 | VEML7700 ambient light sensor | VEML7700-TT | Vishay / Mouser | $0.85 | Lux 0.0036–120,000, I2C |
| 13 | VEML6075 UVA+UVB sensor | VEML6075 | Vishay / Mouser | $1.10 | UV index, I2C |

**BME688 notes:** The BME688 includes Bosch's BSEC (BME Sensor Context Estimation) SDK for on-device AI classification of air quality. This is classified as "AI grade" per the product spec. The IAQ score (0–500) maps directly to the LOT System's `weather-mood` insight type.

**Sensor cable to LOT:** All sensor readings are POSTed to `/api/logs` on each Copy button press and on the hourly sync cycle.

---

## 2. Power System

### 2.1 Battery

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 14 | LiPo 250mAh 402035 (4.0×20×35mm, 3.7V) | LP402035 | EEMB / Amazon / Alibaba | $3.80 | UN38.3 certified; PCM protected |
| 15 | 1.25mm JST-PH 2-pin battery connector | B2B-PH-K-S(LF)(SN) | JST / Mouser | $0.15 | Standard LiPo connector |

---

### 2.2 Battery Management

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 16 | TP4056 LiPo charger IC (1A linear, SOT-23-6) | TP4056 | LCSC C16581 | $0.18 | Charge rate set by Rprog (2K = 500mA) |
| 17 | DW01A battery protection IC | DW01A | LCSC C351561 | $0.10 | Over-charge, over-discharge, short-circuit |
| 18 | FS8205A dual MOSFET (protection FET) | FS8205A | LCSC C32254 | $0.08 | Pairs with DW01A |

---

### 2.3 Wireless Charging

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 19 | BQ51013BRHLR Qi receiver IC | BQ51013BRHLR | TI / Mouser 595-BQ51013BRHLR | $2.40 | 5W Qi, 3.3V–4.5V regulated output |
| 20 | Qi receiver coil, 40mm, 10µH, 0.2mm thick | WR40X10 | Würth Elektronik 760308102206 | $1.80 | Fits inside enclosure below PCB |
| 21 | 10 µF X5R cap 0805 (Qi filter) | CGA4J3X5R1A106M125AB | TDK / Mouser | $0.12 | Qi circuit filtering |
| 22 | PTFE gasket, 38×38mm, 0.3mm thick | Custom cut | McMaster-Carr / local | $0.30 | Isolates Qi coil from steel frame |

---

### 2.4 Power Regulation

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 23 | TPS63020 buck-boost 3.3V regulator | TPS63020DSJR | TI / Mouser | $1.90 | 3.3V from LiPo 2.5V–5.5V, 2A |
| 24 | 10 µH inductor 2520 (TPS63020) | SRR6028-100Y | Bourns / Mouser | $0.45 | Required for buck-boost |
| 25 | RT9080-33GJ5 1.8V LDO (for OV2640 DVDD) | RT9080-33GJ5 | Richtek / LCSC | $0.22 | OV2640 requires separate 1.8V |

---

## 3. Interface & Connectivity

| # | Part | Part Number | Supplier | Unit Price (100×) | Notes |
|---|------|------------|----------|-------------------|-------|
| 26 | USB-C receptacle, SMD, 2.0 HS | USB4085-GF-A | GCT / Mouser | $0.55 | Flush-mount, bottom edge of PCB |
| 27 | ESD protection USB (TVS array) | PRTR5V0U2X | NXP / Mouser | $0.18 | USB-C ESD, SOT-363 |
| 28 | Tactile switch 4×4×1.5mm SMD | TS-1109S-AR02016 | CUI Devices / Mouser | $0.28 | Copy button, 160gf actuation |
| 29 | PCB antenna (inverted-F, 2.4GHz) | ANT016008LCD2442MA1 | Molex / Mouser | $0.65 | ESP32-S3 2.4GHz, flex PCB type |
| 30 | SMA to u.FL cable (debug use only) | 73251-2120 | Molex | $1.20 | Engineering samples only |

---

## 4. Passive Components (Tape Reel, per board quantities)

| # | Part | Value | Package | LCSC | Qty/board | Notes |
|---|------|-------|---------|------|-----------|-------|
| 31 | Resistor | 10K | 0402 | C25804 | 12 | Pull-ups, dividers |
| 32 | Resistor | 1K | 0402 | C21190 | 8 | LED, misc |
| 33 | Resistor | 2K | 0402 | — | 2 | TP4056 Rprog (500mA) |
| 34 | Resistor | 100K | 0402 | — | 4 | ADC dividers |
| 35 | Capacitor | 100nF | 0402 | C14663 | 20 | Decoupling |
| 36 | Capacitor | 10µF | 0603 | C19702 | 8 | Bulk |
| 37 | Capacitor | 1µF | 0402 | C52923 | 6 | Filter |
| 38 | Ferrite bead | 600Ω@100MHz | 0402 | C1017 | 4 | Power filter |
| 39 | LED status | Green, 0402 | 0402 | C72044 | 1 | Charge indicator (internal, not visible) |

---

## 5. Mechanical Components

### 5.1 Enclosure

| # | Part | Spec | Supplier | Unit Price (100×) | Notes |
|---|------|------|----------|-------------------|-------|
| 40 | Part 1: Back shell, 316L SS | 40×40mm, polished | PCBWay CNC / Xometry | $22.00 | Mirror polish Ra<0.05µm, 2mm deep cavity |
| 41 | Part 2: Front frame, 316L SS | 40×40mm, brushed | PCBWay CNC / Xometry | $18.00 | Satin brush finish, window/button cutouts |
| 42 | PCB standoff bracket, 316L SS | Custom 2mm | Supplier above | $1.50 | Holds PCB 1.5mm from Side A inner |
| 43 | Silicone gasket, 39×39mm | IP52 seal | Custom die-cut | $0.40 | Between Part 1 and Part 2 |

### 5.2 Hardware

| # | Part | Spec | Supplier | Unit Price (100×) | Notes |
|---|------|------|----------|-------------------|-------|
| 44 | M1.4 × 3mm Phillips screws, 316L | PVD black | McMaster-Carr / Bolt Depot | $0.08 ea | 4 per unit |
| 45 | M1.4 nylon lock washers | Standard | McMaster-Carr | $0.04 ea | 4 per unit |
| 46 | N42 neodymium alignment magnets, 3mm Ø × 1mm | Supermagnete / K&J | $0.25 ea | 3 per unit (dock alignment) |

---

## 6. Wireless Charger Dock (Accessory)

| # | Part | Spec | Supplier | Unit Price (100×) | Notes |
|---|------|------|----------|-------------------|-------|
| 47 | Qi transmitter IC IDT P9025AC | WLCSP | Renesas/IDT via Mouser | $3.20 | 5W Qi transmitter |
| 48 | Qi transmit coil, 40mm | Würth 760308113706 | Mouser | $2.10 | Matched to receiver coil |
| 49 | Dock enclosure, 316L SS, 50×50×8mm | CNC machined | PCBWay CNC | $8.00 | Matched finish to device |
| 50 | USB-C port (dock) | 2.0, 5V/2A | Same as #26 | $0.55 | Power input |
| 51 | USB-C cable, 1.2m braided | 5V/2A | Anker OEM / Alibaba | $1.80 | Included in box |
| 52 | 5V/2A USB-C PD power adapter | GaN | Anker OEM | $4.50 | Included in box |

---

## 7. Packaging

| # | Item | Spec | Supplier | Unit Price (100×) | Notes |
|---|------|------|----------|-------------------|-------|
| 53 | Outer box | 80×80×40mm, rigid matte black | Packlane / ULINE | $1.20 | LOT logo debossed |
| 54 | Inner tray | EVA foam, die-cut | Alibaba | $0.80 | Device + dock cutouts |
| 55 | Quick start card | 100×100mm, 350gsm | Moo / local print | $0.25 | LOT / COSMO® branding |
| 56 | Warranty card | 85×54mm, 350gsm | Moo / local print | $0.15 | lot-systems.com URL |
| 57 | Microfiber cloth | 100×100mm | Alibaba | $0.30 | For polished face |

---

## 8. PCB Manufacturing (PCBWay)

| # | Item | Spec | Price (100 boards) | Notes |
|---|------|------|--------------------|-------|
| 58 | PCB fabrication | 4L, ENIG, 36×36mm | ~$180 | PCBWay standard 4-layer |
| 59 | SMT assembly | 50 unique parts, 200 placements | ~$1,200 | PCBWay turnkey assembly |
| 60 | BOM sourcing fee | PCBWay component procurement | ~$400 | PCBWay sources from LCSC |
| 61 | Stencil | Laser-cut steel, 36×36mm | ~$25 | One-time, reusable |
| — | **Total PCBWay** | | **~$1,805** | For 100 assembled boards |

**PCBWay URL:** pcbway.com → Instant Quote → PCB Assembly → upload Gerber + BOM + Pick-and-Place files.

---

## 9. Total BOM Summary (100 Units)

| Category | 100× Total |
|----------|------------|
| Core electronics (MCU, display, camera, sensors) | $2,240 |
| Power system (battery, charger ICs, Qi) | $1,180 |
| Interface & connectivity | $180 |
| Passive components (full tape reels) | $420 |
| Mechanical (enclosure, hardware) | $4,200 |
| Wireless charger dock | $1,215 |
| Packaging | $270 |
| PCBWay (PCB + assembly) | $1,805 |
| **Grand Total (components only)** | **$11,510** |
| Engineering/tooling (CNC fixturing, NRE) | $8,000 |
| **Total 100-unit program cost** | **~$19,510** |

**Per-unit cost at 100:** ~$195 (including amortized tooling)
**Per-unit cost at 500:** ~$130 (tooling fully amortized)

---

## 10. Key Supplier Contacts

| Supplier | URL | Use |
|----------|-----|-----|
| PCBWay | pcbway.com | PCB, CNC enclosure, SMT assembly |
| Mouser Electronics | mouser.com | ICs, passives, connectors |
| LCSC Electronics | lcsc.com | Budget ICs, Chinese components |
| Arducam | arducam.com | Camera modules |
| Würth Elektronik | we-online.com | Qi coils, inductors |
| McMaster-Carr | mcmaster.com | Hardware (screws, magnets) |
| Xometry | xometry.com | CNC machining (backup to PCBWay) |
| EEMB Battery | eemb.com | LiPo cells, UN38.3 certified |
| Packlane | packlane.com | Custom packaging |

---

*© 2026 LOT Systems, Inc. — Proprietary and Confidential*
*COSMO® Computer CC-1 — BOM v1.0*
