<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Hardware Computer v1.0

**Document:** LOT_COSMO_COMPUTER_HARDWARE_v1.md
**Classification:** Internal — Engineering & Manufacturing
**Prepared:** 2026-06-15
**Inventor:** Vadim Marmeladov, CEO & Founder — LOT Systems
**Brand:** COSMO® CIA
**Series:** LOT Physical Computing Division
**Run:** 100 units — Pilot Production

---

## Executive Summary

COSMO® CIA is a flat, wearable pager-style hardware device that bridges the LOT digital system with the physical world. The device receives AI-generated notifications from lot-systems.com (e.g., "Coffee time!"), logs user actions via a single Copy button, streams weather telemetry, and captures ambient media via a built-in camera — all in a 40mm × 40mm × 5mm polished stainless steel body.

The pilot run is **100 units**, manufactured via PCBWay for PCB and SMT assembly, with a CNC-machined stainless steel two-part enclosure. Total hardware cost target: **< $60/unit landed**.

This document covers: hardware architecture, complete bill of materials with supplier links, PCBWay specifications, enclosure design, firmware architecture, LOT API connector specification, manufacturing roadmap, PDF manual structure, regulatory pathway, session compression protocol, and wireless charging integration.

---

## 1. Device Concept

### 1.1 Name & Brand

```
COSMO® CIA
CIA = Context-Informed Assistant
Brand: COSMO® — a LOT Systems product division
```

### 1.2 Product Description

A compact, autonomous notification device that:

- **Receives** AI-powered push notifications from lot-systems.com in real time
- **Displays** them on a small OLED screen (e.g., "Coffee time!", "Hydrate now", "QOS: recovery mode")
- **Logs** user acknowledgement via a single button — Copy — which signals the LOT Log tab
- **Senses** ambient environment: temperature, humidity, pressure, air quality (AI-grade sensor)
- **Captures** still images via an embedded camera module
- **Charges** wirelessly via Qi standard — no ports on the exterior
- **Reports** all session data back to lot-systems.com in compressed format

### 1.3 Physical Description

| Property | Value |
|----------|-------|
| Dimensions | 40mm × 40mm × 5mm |
| Weight (est.) | ~22g |
| Front face | Matte black bezel, OLED screen, camera aperture, Copy button |
| Back face | Mirror-polished stainless steel (316L grade) |
| Enclosure | 2-part CNC stainless steel (top + bottom shell) |
| Finish – front | Bead-blasted / satin stainless |
| Finish – back | Mirror polished stainless |
| Colour accent | None — raw silver steel, no paint |
| Seam | Hidden hairline join at equator |

---

## 2. Hardware Architecture

### 2.1 System Block Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   COSMO® CIA v1.0                       │
│                                                         │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │ OV2640   │   │  ESP32-S3    │   │  BME688        │  │
│  │ Camera   │──▶│  MINI-1      │◀──│  Weather+AI    │  │
│  │ 2MP DVP  │   │  (SoC)       │   │  Gas Sensor    │  │
│  └──────────┘   │              │   └────────────────┘  │
│                 │  Wi-Fi BLE   │                        │
│  ┌──────────┐   │  FreeRTOS    │   ┌────────────────┐  │
│  │ SSD1306  │◀──│  ESP-IDF     │──▶│  QSPI Flash    │  │
│  │ OLED     │   │  Firmware    │   │  W25Q32 4MB    │  │
│  │ 128×64   │   │              │   └────────────────┘  │
│  └──────────┘   └──────┬───────┘                       │
│                        │                               │
│  ┌──────────┐          │         ┌────────────────┐    │
│  │ Tactile  │──────────┘         │  BQ25185       │    │
│  │ Button   │ (Copy / IRQ)       │  Charge IC     │    │
│  └──────────┘                    │  (Wireless)    │    │
│                                  └───────┬────────┘    │
│  ┌──────────────────────────────┐        │             │
│  │  Qi Coil 38mm                │◀───────┘             │
│  │  + BQ51013B RX IC            │   5V / 1A            │
│  └──────────────────────────────┘                      │
│                                                         │
│  ┌──────────────────────────────┐                      │
│  │  LiPo 402540 — 250mAh        │ ◀── to BQ25185       │
│  └──────────────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
                        │
              Wi-Fi / TLS 1.3
                        │
              lot-systems.com
              ┌──────────────────────┐
              │ Notification Engine  │
              │ Log Tab API          │
              │ Weather Uplink       │
              │ Session Compression  │
              └──────────────────────┘
```

### 2.2 Main SoC — ESP32-S3-MINI-1

| Parameter | Value |
|-----------|-------|
| Module | Espressif ESP32-S3-MINI-1-N8 |
| CPU | Xtensa LX7 dual-core @ 240MHz |
| Flash | 8MB QPI |
| SRAM | 512KB + 8MB PSRAM option |
| Wi-Fi | 802.11 b/g/n 2.4GHz |
| BLE | Bluetooth 5.0 LE |
| Camera | DVP 8-bit camera interface |
| Dimensions | 15.4mm × 15.4mm × 2.4mm |
| Power | 3.3V, peak 500mA (TX) |
| Supplier | [Mouser — ESP32-S3-MINI-1-N8](https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-MINI-1-N8) |
| Unit cost (100x) | ~$3.80 |

**Why ESP32-S3**: Native camera DVP interface, Wi-Fi for direct lot-systems.com HTTPS calls, BLE for phone provisioning, and an active open-source ecosystem with ESP-IDF + FreeRTOS. Fits within the 5mm Z-height at 2.4mm module thickness.

### 2.3 Display — SSD1306 OLED

| Parameter | Value |
|-----------|-------|
| Part | 0.96" OLED 128×64, SSD1306 controller |
| Interface | I²C (SDA/SCL) |
| Board size | 27.3mm × 27.8mm |
| Display area | 21.7mm × 10.9mm |
| Thickness | 1.5mm (bare panel + FPC) |
| VCC | 3.3V |
| Current | 20mA typical |
| Supplier | [Adafruit 938 — SSD1306 OLED](https://www.adafruit.com/product/938) or PCBWay-sourced bare panel |
| Unit cost (100x) | ~$1.80 |

Display shows:
- Notification text (scrolling marquee for long strings)
- QOS mode indicator
- Battery level indicator (top bar)
- Wi-Fi signal strength
- Time + date

### 2.4 Camera — OV2640

| Parameter | Value |
|-----------|-------|
| Part | OV2640 2MP camera module |
| Resolution | 1600×1200 (UXGA), configurable to QVGA |
| Interface | DVP 8-bit + SCCB (I²C compatible) |
| Lens | f/2.0, FOV 66° |
| Module size | 20mm × 20mm × 3.3mm |
| VCC | 3.3V/2.8V (dual supply) |
| Supplier | [AliExpress OV2640 DVP module](https://www.aliexpress.com/item/1005003794399810.html) |
| Unit cost (100x) | ~$2.50 |

Camera use:
- User-triggered still capture (Copy button hold)
- QR code scanning for Wi-Fi provisioning
- Optional: AI face-presence detection for auto-wake

### 2.5 Environmental Sensor — BME688 (AI-Grade)

| Parameter | Value |
|-----------|-------|
| Part | Bosch BME688 |
| Measures | Temperature, Humidity, Barometric Pressure, VOC Gas (AI-trained) |
| AI Feature | BSEC2 library — classifies air quality, estimates CO₂, detects presence |
| Interface | I²C or SPI |
| Package | 3mm × 3mm × 0.93mm LGA |
| Accuracy | ±1°C temp, ±3% RH, ±0.6 hPa pressure |
| Supplier | [Mouser — Bosch BME688](https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688) |
| Unit cost (100x) | ~$4.20 |

The BME688's BSEC2 AI library runs on-chip and produces IAQ (Indoor Air Quality) scores and gas resistance classifications without cloud dependency — qualifying it as an **AI-grade off-the-shelf sensor**.

Weather data uploaded to lot-systems.com matches the existing weather block in the LOT public profile (temperature, humidity, pressure, air quality).

### 2.6 Wireless Charging

#### Receiver IC — BQ51013B

| Parameter | Value |
|-----------|-------|
| Part | Texas Instruments BQ51013BRHLR |
| Standard | Qi WPC 1.1 |
| Input power | 5W (1A @ 5V) |
| Efficiency | 89% typical |
| Package | VQFN-20, 4mm × 4mm |
| Supplier | [Mouser — BQ51013B](https://www.mouser.com/ProductDetail/Texas-Instruments/BQ51013BRHLR) |
| Unit cost (100x) | ~$1.60 |

#### Charge Management IC — BQ25185

| Parameter | Value |
|-----------|-------|
| Part | Texas Instruments BQ25185YFPR |
| Battery type | 1S LiPo |
| Charge current | Up to 1A configurable |
| Input | 4.2V–6V from BQ51013B |
| Package | DSBGA-9, 1.6mm × 1.5mm |
| Features | NTC protection, watchdog, I²C status |
| Supplier | [Mouser — BQ25185](https://www.mouser.com/ProductDetail/Texas-Instruments/BQ25185YFPR) |
| Unit cost (100x) | ~$1.20 |

#### Qi Coil

| Parameter | Value |
|-----------|-------|
| Part | 38mm Qi receiving coil, 5µH |
| Diameter | 38mm (fits within 40mm footprint) |
| Thickness | 0.5mm flat spiral |
| Supplier | [AliExpress 38mm Qi coil](https://www.aliexpress.com/item/1005004089745321.html) |
| Unit cost (100x) | ~$0.80 |

The Qi coil bonds directly to the inner face of the polished stainless back plate using non-conductive adhesive. The steel is non-magnetic 316L grade which does not interfere with Qi magnetic coupling at these power levels.

### 2.7 Battery

| Parameter | Value |
|-----------|-------|
| Part | LiPo pouch 402540 |
| Dimensions | 4mm × 25mm × 40mm |
| Capacity | 250mAh |
| Nominal voltage | 3.7V |
| Energy | 0.925 Wh |
| Estimated runtime | ~8–12 hours (notifications mode) |
| Supplier | [AliExpress 402540 LiPo](https://www.aliexpress.com/item/1005003290584219.html) |
| Unit cost (100x) | ~$2.20 |

Battery occupies a dedicated pocket in the lower shell beneath the PCB. A protection circuit module (PCM) with overcharge/overdischarge/short circuit protection is integrated. Additional protection provided by BQ25185.

### 2.8 Copy Button

| Parameter | Value |
|-----------|-------|
| Part | Omron B3U-3000P |
| Type | SMD tactile, 2-pin |
| Actuation force | 1.47N |
| Travel | 0.2mm |
| Dimensions | 3.0mm × 2.0mm × 1.2mm height |
| Life | 1,000,000 cycles |
| Supplier | [Mouser — Omron B3U-3000P](https://www.mouser.com/ProductDetail/Omron-Electronics/B3U-3000P) |
| Unit cost (100x) | ~$0.40 |

The button is the only user interface element. Function map:

| Action | Result |
|--------|--------|
| Single press | Copy — logs acknowledgement to LOT Log tab, dismisses notification |
| Double press | Camera capture — takes still image, uploads to LOT |
| Hold 3s | Wi-Fi pairing mode — BLE provisioning activates |
| Hold 10s | Factory reset |

### 2.9 External Flash (Session Storage)

| Parameter | Value |
|-----------|-------|
| Part | Winbond W25Q32JVSSIQ |
| Capacity | 32Mbit (4MB) |
| Interface | QSPI |
| Package | SOIC-8, 5.3mm × 5.3mm |
| Purpose | Offline session buffer, firmware updates, compressed log queue |
| Supplier | [Mouser — W25Q32](https://www.mouser.com/ProductDetail/Winbond/W25Q32JVSSIQ) |
| Unit cost (100x) | ~$0.55 |

---

## 3. Complete Bill of Materials

### 3.1 BOM Table

| # | Component | Part Number | Qty/Unit | Supplier | Unit Price | 100× Total |
|---|-----------|-------------|----------|----------|------------|------------|
| 1 | SoC Module | ESP32-S3-MINI-1-N8 | 1 | Mouser | $3.80 | $380 |
| 2 | OLED Display | SSD1306 0.96" 128×64 | 1 | Adafruit / PCBWay sourced | $1.80 | $180 |
| 3 | Camera Module | OV2640 DVP | 1 | AliExpress | $2.50 | $250 |
| 4 | Environmental Sensor | Bosch BME688 | 1 | Mouser | $4.20 | $420 |
| 5 | Qi RX IC | TI BQ51013BRHLR | 1 | Mouser | $1.60 | $160 |
| 6 | Charge IC | TI BQ25185YFPR | 1 | Mouser | $1.20 | $120 |
| 7 | Qi Coil 38mm | Generic 5µH 38mm | 1 | AliExpress | $0.80 | $80 |
| 8 | LiPo Battery | 402540 250mAh | 1 | AliExpress | $2.20 | $220 |
| 9 | Copy Button | Omron B3U-3000P | 1 | Mouser | $0.40 | $40 |
| 10 | External Flash | Winbond W25Q32JVSSIQ | 1 | Mouser | $0.55 | $55 |
| 11 | 3.3V LDO | TI TLV75733PDBVR | 1 | Mouser | $0.35 | $35 |
| 12 | Crystal 26MHz | Abracon ABM8-26.000MHZ-B2-T | 1 | Mouser | $0.45 | $45 |
| 13 | ESD Protection | PRTR5V0U2X | 2 | Mouser | $0.15 | $30 |
| 14 | Ferrite Bead | BLM18AG601SN1D | 4 | Mouser | $0.08 | $32 |
| 15 | Decoupling Caps 100nF 0402 | GRM155R71C104KA88D | 20 | Mouser | $0.02 | $40 |
| 16 | Bulk Caps 10µF 0402 | GRM155R60J106ME11D | 6 | Mouser | $0.05 | $30 |
| 17 | Resistors 0402 assorted | Various | 20 | Mouser | $0.02 | $40 |
| 18 | Inductor 4.7µH (Qi matching) | Bourns SRR4018-4R7Y | 2 | Mouser | $0.25 | $50 |
| 19 | LED status (under button) | Lite-On LTST-C190KGKT | 1 | Mouser | $0.12 | $12 |
| 20 | FPC connector 24-pin (display) | Molex 5034800800 | 1 | Mouser | $0.45 | $45 |
| 21 | FPC connector 24-pin (camera) | Molex 5034800800 | 1 | Mouser | $0.45 | $45 |
| 22 | NTC thermistor 10kΩ | Murata NCP15WB473F03RC | 1 | Mouser | $0.08 | $8 |
| 23 | Test pads / debug header | 0.5mm pitch, 6-pin unpopulated | 1 | — | $0.00 | $0 |
| | **PCB (PCBWay)** | 4-layer, 38.5mm × 38.5mm | 100 | PCBWay | $3.20 | $320 |
| | **SMT Assembly (PCBWay)** | Full top-side assembly | 100 | PCBWay | $6.00 | $600 |
| | **Stainless Enclosure** | 316L 2-part CNC, 40×40×5mm | 100 | PCBWay CNC | $18.00 | $1,800 |
| | **Optical glass window** | 35mm × 35mm × 0.5mm | 100 | Edmund Optics / AliExpress | $1.50 | $150 |
| | **Gasket / adhesive** | 3M 9472LE double-sided | 1 set | 3M / Mouser | $0.40 | $40 |
| | **Camera lens aperture ring** | CNC aluminium, anodised | 100 | PCBWay CNC | $1.50 | $150 |
| | **Packaging** | Matte black box + foam insert | 100 | Custom print | $2.50 | $250 |
| | | | | | | |
| | **Subtotal — BOM** | | | | | **$4,827** |
| | **PCBWay tooling / setup** | One-time | | PCBWay | | $400 |
| | **Stainless CNC tooling** | One-time | | PCBWay CNC | | $600 |
| | **Engineering samples (5 units)** | Pre-production validation | | — | | $500 |
| | **Shipping / customs** | DHL express | | DHL | | $300 |
| | **Buffer (10%)** | Yield / scrap margin | | — | | $483 |
| | | | | | | |
| | **TOTAL — 100 UNITS** | | | | | **~$7,110** |
| | **Cost per unit (landed)** | | | | | **~$71** |

> **Note:** Volume leverage at 500+ units drops per-unit cost to ~$45. At 1,000 units: ~$38.

### 3.2 Supplier Summary

| Supplier | Role | Link |
|----------|------|------|
| PCBWay | PCB fabrication, SMT assembly, CNC enclosure | https://www.pcbway.com |
| Mouser Electronics | Electronic components | https://www.mouser.com |
| AliExpress | Camera module, Qi coil, battery | https://www.aliexpress.com |
| Adafruit | OLED display reference design | https://www.adafruit.com |
| DigiKey | Alternate component sourcing | https://www.digikey.com |

---

## 4. PCBWay Specifications

### 4.1 PCB Fabrication

| Parameter | Specification |
|-----------|--------------|
| Layers | 4 (Signal / Ground / Power / Signal) |
| Dimensions | 38.5mm × 38.5mm |
| Board thickness | 0.8mm |
| Copper weight | 1 oz outer, 0.5 oz inner |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Green (or black for production aesthetic) |
| Silkscreen | White, top side only |
| Min trace/space | 4/4 mil |
| Min drill | 0.2mm laser via |
| Via type | Tented vias, buried/blind for camera flex region |
| Stackup | FR4, Tg 150 |
| IPC class | Class II |
| Quantity | 100 |
| Order link | https://www.pcbway.com/orderonline.aspx |

### 4.2 PCBWay SMT Assembly

| Parameter | Specification |
|-----------|--------------|
| Assembly type | Full turnkey (PCBWay sources components) |
| Side | Top side SMT only |
| Paste | SAC305 lead-free |
| Reflow profile | Standard Sn-Ag-Cu |
| Conformal coat | No (device is not waterproof v1) |
| X-ray | Required for BGA-equivalent parts (BQ51013B VQFN) |
| Flying probe test | Yes |
| AOI | Yes |
| Programming | JTAG / UART flashing post-assembly |

### 4.3 PCBWay CNC Enclosure

| Parameter | Specification |
|-----------|--------------|
| Material | 316L stainless steel |
| Parts | 2: top shell + bottom shell |
| Overall assembled size | 40.0mm × 40.0mm × 5.0mm |
| Wall thickness | 0.4mm minimum |
| Surface — back (outer) | Mirror polish Ra < 0.05µm |
| Surface — front (outer) | Bead blast, satin Ra ~0.8µm |
| Camera aperture | Ø3.5mm hole, countersink |
| Button cutout | Ø4.0mm slot for tactile button actuator |
| Glass recess | 35mm × 35mm × 0.5mm recess (front face) |
| Assembly method | Snap-fit with 2× M1.2 countersunk screws (hidden under label) |
| Finish inspection | 100% visual, no scratches on mirror face |
| Quantity | 100 sets (200 parts) |
| Lead time | ~15 working days |

### 4.4 Layer Stack (PCB)

```
Layer 1 (Top):    Components + signal routing
                  ESP32-S3, SSD1306 FPC, camera FPC
─────────────────────────────────────────────
Layer 2:          GND plane (copper pour, full)
─────────────────────────────────────────────
Layer 3:          PWR plane (3.3V island + battery island)
─────────────────────────────────────────────
Layer 4 (Bottom): Qi coil connection + signal return
                  BME688 (on bottom, exposed to atmosphere via vent hole)
```

**Critical routing rules:**
- Camera DVP lines: length-matched ±50mil, 50Ω differential where applicable
- Qi coil traces: 2oz copper, minimum 0.5mm trace width
- Wi-Fi antenna area: copper keepout zone 10mm around ESP32-S3 antenna
- BME688: route to bottom layer, place over a 3mm × 3mm hole in the stainless back for environmental access

---

## 5. Enclosure Design

### 5.1 Two-Part Stainless Steel Body

```
FRONT VIEW (User-facing side)
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   OLED Display            │  │
│  │   128×64 px               │  │
│  │   21.7mm × 10.9mm visible │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                    [●] Camera   │
│                    [■] Button   │
│  COSMO® CIA         ·           │
└─────────────────────────────────┘
 40mm

BACK VIEW (Mirror polished)
┌─────────────────────────────────┐
│                                 │
│     (Mirror polish 316L)        │
│                                 │
│                                 │
│         COSMO® CIA              │
│      lot-systems.com            │
│                                 │
└─────────────────────────────────┘
```

### 5.2 Cross-Section Stack (5mm total)

```
     ← 40mm →
     ┌───────┐  ▲
     │ glass │  │ 0.5mm  (optical window, 35×35mm)
─────┼───────┼──┤
     │ OLED  │  │ 1.2mm  (display panel + FPC)
─────┼───────┼──┤
     │  PCB  │  │ 0.8mm  (4-layer FR4)
─────┼───────┼──┤
     │  gap  │  │ 0.3mm  (component clearance, BME688)
─────┼───────┼──┤
     │ LiPo  │  │ 4.0mm  (402540 battery)
─────┼───────┼──┤  ← battery pocket machined into bottom shell
     │ coil  │  │ 0.5mm  (Qi coil laminated to back)
─────┴───────┴──┤
     [  back  ]  │ 0.4mm  (stainless back shell)
                ▼
         TOTAL: ~5.0mm nominal
```

> The front shell is 0.4mm thick stainless with a 0.5mm glass insert. The back shell forms the battery pocket (machined cavity 4mm deep). The Qi coil adheres to the inner surface of the back shell using 3M 9472LE.

### 5.3 Assembly Sequence

1. Populate PCB (SMT assembly via PCBWay)
2. Flash base firmware via UART test fixture
3. Bond camera FPC and display FPC to PCB connectors
4. Bond Qi coil to back shell interior with 3M 9472LE
5. Solder battery leads to PCB battery connector
6. Fit battery into machined pocket of back shell
7. Align PCB + battery assembly into back shell
8. Install glass window into front shell recess with UV adhesive
9. Join front + back shell — snap fit, secure 2× M1.2 screws
10. Final functional test (Wi-Fi, display, button, sensor, camera)
11. Apply serial number laser mark on back edge
12. Package in foam-lined matte box

---

## 6. Firmware Architecture

### 6.1 Overview

Firmware runs on ESP-IDF (v5.2+) with FreeRTOS task model. The application is structured into independent tasks communicating via queues and event groups.

```
FreeRTOS Tasks:
─────────────────────────────────────────────────────────
Task Name          Priority  Stack   Purpose
─────────────────────────────────────────────────────────
wifi_manager       5         4096    Maintain Wi-Fi, auto-reconnect
https_client       4         8192    Poll LOT API, POST events
display_renderer   3         2048    Update OLED every 100ms
sensor_sampler     3         2048    BME688 BSEC2 loop (1Hz)
camera_driver      2         4096    OV2640 capture on trigger
button_handler     6         1024    IRQ-driven, debounce, hold detect
ota_manager        1         4096    OTA update check (daily)
session_compress   1         4096    Compress + queue session logs
─────────────────────────────────────────────────────────
```

### 6.2 Boot Sequence

```
Power on
  │
  ▼
[1] Bootloader — verify firmware signature (RSA-2048)
  │
  ▼
[2] Hardware init — GPIO, I²C, SPI, DVP
  │
  ▼
[3] Load config from NVS (Wi-Fi SSID/key, API token, device ID)
  │
  ├─ NO CONFIG ──▶ [PROVISION MODE] BLE advertising "COSMO-CIA-XXXX"
  │                 Accept SSID + password + API token from phone app
  │
  ▼
[4] Wi-Fi connect — DHCP, NTP sync
  │
  ▼
[5] POST /api/hardware/device-ping → lot-systems.com
     { device_id, firmware_version, battery_pct, bsec_iaq }
  │
  ▼
[6] Enter main loop — poll notifications every 60s
```

### 6.3 Notification Loop

```
Every 60 seconds:
  GET /api/hardware/notifications?device_id={id}&last_seen={ts}
  
  Response: { notifications: [{ id, text, priority, ts }] }
  
  For each unread notification:
    - Render text on OLED (scrolling if > 16 chars)
    - Vibrate LED once (button LED flash)
    - Store in local flash queue
    - Wait for Copy button press
    
  On Copy press:
    POST /api/hardware/log
    {
      device_id,
      notification_id,
      action: "copy",
      ts: ISO8601,
      bsec_iaq,
      battery_pct
    }
    → LOT Log tab receives this event in real time
```

### 6.4 Session Compression Protocol

Each session = 24-hour window. At 03:00 local time:

```
Session record structure (binary, LZ4 compressed):
{
  date: uint32 (unix ts),
  notifications_received: uint16,
  notifications_acknowledged: uint16,
  avg_response_time_sec: float32,
  sensor_snapshots: [{ts, temp, humidity, pressure, iaq}] × 24,
  button_events: [{ts, action, notification_id}],
  battery_profile: [uint8 × 24],   // % per hour
  firmware_version: uint16,
  uptime_seconds: uint32
}

Compressed with LZ4HC, target ratio: 3:1
Stored in W25Q32 flash (ring buffer, 30-day capacity)
Uploaded to lot-systems.com POST /api/hardware/session on next Wi-Fi window
```

### 6.5 OTA Firmware Update

```
Daily check: GET /api/hardware/firmware/latest?device_id={id}
Response: { version, url, sha256 }

If version > current:
  - Download to OTA partition (ESP32 dual-partition scheme)
  - Verify SHA-256
  - Set boot flag → reboot → new firmware runs
  - Rollback if boot fails (ESP-IDF rollback mechanism)
```

### 6.6 GPIO Mapping (ESP32-S3-MINI-1)

| GPIO | Function |
|------|----------|
| GPIO0 | Boot mode (internal pull-up) |
| GPIO1 | UART TX (debug, test only) |
| GPIO2 | UART RX |
| GPIO3 | I²C SDA (display + BME688) |
| GPIO4 | I²C SCL |
| GPIO5 | Copy button (IRQ, internal pull-up) |
| GPIO6 | Button LED (active high) |
| GPIO7 | Camera PWDN |
| GPIO8 | Camera RESET |
| GPIO11 | Camera HREF |
| GPIO12 | Camera VSYNC |
| GPIO13 | Camera PCLK |
| GPIO14–GPIO21 | Camera D0–D7 (DVP data bus) |
| GPIO35 | BME688 interrupt |
| GPIO36 | Battery voltage ADC (via divider) |
| GPIO37 | Charge status (BQ25185 STAT pin) |
| GPIO38–GPIO41 | QSPI flash (W25Q32) |

---

## 7. LOT API Connector Specification

### 7.1 Base URL

```
Production: https://lot-systems.com/api/hardware
Staging:    https://staging.lot-systems.com/api/hardware
```

### 7.2 Authentication

```
All requests carry header:
  Authorization: Bearer {DEVICE_API_TOKEN}
  X-Device-ID: {device_id}        // UUID v4, burned at factory
  X-Firmware: {version}           // e.g. "1.0.4"
  Content-Type: application/json
```

Device tokens are provisioned via the LOT user dashboard under:
Settings → Hardware → Pair New Device → Generate Token

### 7.3 API Endpoints

#### GET /api/hardware/notifications

Fetch pending notifications for this device.

```
Request:
  GET /api/hardware/notifications
  ?device_id=uuid
  &last_seen=2026-06-15T08:00:00Z

Response 200:
{
  "notifications": [
    {
      "id": "notif_abc123",
      "text": "Coffee time!",
      "priority": "normal",
      "category": "wellness",
      "created_at": "2026-06-15T09:00:00Z"
    }
  ],
  "server_time": "2026-06-15T09:01:00Z"
}
```

#### POST /api/hardware/log

Signal Copy button press to LOT Log tab.

```
Request body:
{
  "device_id": "uuid",
  "notification_id": "notif_abc123",
  "action": "copy",
  "timestamp": "2026-06-15T09:01:45Z",
  "sensor": {
    "temperature": 22.1,
    "humidity": 48,
    "pressure": 1013.2,
    "iaq": 72,
    "iaq_accuracy": 3
  },
  "battery_pct": 84
}

Response 200:
{
  "logged": true,
  "log_id": "log_xyz789",
  "message": "Acknowledged"
}
```

This call drives the LOT Log tab in real time — the entry appears as:
```
[09:01:45]  COSMO® CIA  ·  Copy  ·  Coffee time!  ·  IAQ 72  ·  🔋84%
```

#### POST /api/hardware/session

Upload compressed 24h session.

```
Request body (JSON envelope around base64 LZ4 payload):
{
  "device_id": "uuid",
  "session_date": "2026-06-15",
  "payload_encoding": "lz4+base64",
  "payload": "BASE64_OF_LZ4_BINARY"
}

Response 200:
{
  "received": true,
  "session_id": "sess_20260615"
}
```

#### POST /api/hardware/device-ping

Heartbeat on boot + every 6h.

```
Request body:
{
  "device_id": "uuid",
  "firmware_version": "1.0.4",
  "battery_pct": 84,
  "wifi_rssi": -62,
  "uptime_seconds": 14400,
  "sensor": { "temperature": 22.1, "iaq": 72 }
}

Response 200:
{
  "status": "ok",
  "server_time": "2026-06-15T09:00:00Z",
  "ota_available": false
}
```

#### GET /api/hardware/firmware/latest

OTA update check.

```
Response 200:
{
  "version": "1.0.5",
  "url": "https://lot-systems.com/firmware/cosmo-cia-1.0.5.bin",
  "sha256": "a3f4...",
  "release_notes": "Improved notification polling cadence"
}
```

### 7.4 Server-Side Changes Required

The following new server routes must be added to the LOT codebase (`src/server/routes/`):

```
src/server/routes/hardware-api.ts     ← new file
src/server/models/HardwareDevice.ts   ← new model
src/server/models/HardwareLog.ts      ← new model
src/server/models/HardwareSession.ts  ← new model
```

New database tables:
```sql
hardware_devices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  api_token VARCHAR(64) UNIQUE,
  firmware_version VARCHAR(16),
  created_at TIMESTAMPTZ,
  last_ping TIMESTAMPTZ
)

hardware_logs (
  id UUID PRIMARY KEY,
  device_id UUID REFERENCES hardware_devices(id),
  notification_id VARCHAR(64),
  action VARCHAR(32),
  sensor_data JSONB,
  battery_pct INT,
  logged_at TIMESTAMPTZ
)

hardware_sessions (
  id UUID PRIMARY KEY,
  device_id UUID REFERENCES hardware_devices(id),
  session_date DATE,
  payload BYTEA,
  received_at TIMESTAMPTZ
)
```

Log tab integration: hardware_logs entries surface in the existing LOT Log tab feed alongside check-ins and journal entries, styled with a hardware badge.

---

## 8. Manufacturing Roadmap — 100 Units

### 8.1 Phase Overview

```
Phase 0: Engineering     Weeks 1–4
Phase 1: Prototypes      Weeks 5–8
Phase 2: Pilot Build     Weeks 9–14
Phase 3: QA & Flash      Weeks 15–16
Phase 4: Ship            Week 17
```

### 8.2 Detailed Timeline

| Week | Activity | Owner | Gate |
|------|----------|-------|------|
| 1 | PCB schematic complete | EE | Schematic review signed off |
| 2 | PCB layout complete | EE | DRC clean, antenna keepout verified |
| 2 | Enclosure CAD complete | ME | CNC tolerances reviewed |
| 3 | Submit PCB to PCBWay (5x engineering samples) | EE | PCBWay order confirmed |
| 3 | Submit enclosure to PCBWay CNC (5x) | ME | CNC order confirmed |
| 4 | Firmware v0.1 — boot + Wi-Fi + display | FW | Builds, boots, connects |
| 5 | Engineering samples arrive | EE/ME | Mechanical fit verified |
| 5 | Solder engineering samples by hand | EE | 5x boards populated |
| 6 | Bringup: SoC, display, button, flash | EE | All peripherals pass |
| 6 | BME688 BSEC2 integration | FW | IAQ readings valid |
| 6 | Camera bringup, JPEG capture | FW | Photo captured to flash |
| 7 | Wi-Fi + LOT API integration | FW | Notifications received, Log works |
| 7 | Qi charging test | EE | Charges at 5W, no thermals |
| 8 | End-to-end system test (5x units) | QA | All pass checklist |
| 8 | PCBWay full order: 110x PCB + SMT (10 spares) | EE | Order placed |
| 9 | Enclosure full order: 110x CNC (10 spares) | ME | CNC order placed |
| 10 | Firmware v1.0 feature-complete | FW | OTA, session compress, all APIs |
| 12 | PCBs arrive | EE | AOI pass rate target: >98% |
| 13 | Enclosures arrive | ME | Dimensional check: 100% |
| 14 | Assembly (PCBWay SMT-assembled boards + manual fit) | MFG | 100x units assembled |
| 15 | Factory flash (firmware v1.0) | FW | 100% flashed + boot-tested |
| 15 | Functional test — automated test fixture | QA | All 100 pass or rework |
| 16 | Final QA — burn-in 24h per unit | QA | Zero failures = ship |
| 16 | Package in matte boxes, laser serial numbers | OPS | 100x boxed |
| 17 | Ship | OPS | DHL tracking confirmed |

### 8.3 Quality Gates

| Gate | Criteria |
|------|----------|
| PCB DRC | Zero DRC errors, antenna keepout respected |
| SMT AOI | < 2% defect rate from PCBWay AOI |
| Bringup | 100% of boards boot within 3s |
| Wi-Fi | All connect to 2.4GHz AP within 30s |
| Display | All show test pattern: no dead pixels |
| Sensor | BME688 IAQ accuracy level ≥ 2 within 5 minutes |
| Camera | Capture 640×480 JPEG, < 5% artefact |
| Qi charging | 0% → 100% in ≤ 90 minutes on 5W pad |
| Button | 1M cycle actuator verified by Omron spec |
| Burn-in | 24h continuous: no thermal failure, no reboot |
| Final | 100% pass = ship; < 100% → rework/replace |

---

## 9. Document Suite

### 9.1 PDF Manual — User Guide

**File:** `COSMO-CIA-USER-GUIDE-v1.pdf`

```
Contents:
  1. What is COSMO® CIA              (1 page)
  2. In the box                      (1 page)
  3. First charge                    (1 page)
  4. Pairing with LOT account        (2 pages)
  5. Receiving notifications         (1 page)
  6. The Copy button                 (1 page)
  7. Understanding the screen        (2 pages)
  8. Weather data                    (1 page)
  9. Camera                          (1 page)
  10. Battery & charging             (1 page)
  11. Troubleshooting                (2 pages)
  12. Regulatory                     (1 page)
  13. Warranty & support             (1 page)
Total: ~16 pages, A6 format (pocket-sized), printed inside box lid
```

### 9.2 Firmware Document

**File:** `COSMO-CIA-FIRMWARE-v1.md` (in `/docs/hardware/firmware/`)

```
Contents:
  1. Architecture overview
  2. FreeRTOS task map
  3. GPIO assignments
  4. Peripheral drivers (I²C, SPI, DVP, QSPI)
  5. Boot sequence
  6. Wi-Fi manager + provisioning
  7. LOT API client module
  8. Notification renderer
  9. Button FSM (finite state machine)
  10. BME688 BSEC2 integration
  11. OV2640 camera driver
  12. Session compression (LZ4HC)
  13. OTA update flow
  14. NVS key-value layout
  15. Error codes
  16. Build instructions (ESP-IDF 5.2)
  17. Flashing procedure
  18. Debug / UART console commands
```

### 9.3 Hardware Document

**File:** `COSMO-CIA-HARDWARE-v1.md` (this document)

### 9.4 LOT API Integration Document

**File:** `COSMO-CIA-API-CONNECTOR-v1.md` (in `/docs/hardware/api/`)

```
Contents:
  1. Authentication model
  2. Device provisioning flow
  3. All endpoints (reference)
  4. Notification schema
  5. Log event schema
  6. Session compression schema
  7. OTA schema
  8. Error handling
  9. Rate limits
  10. Server-side implementation guide
  11. Database migrations
  12. Log tab display format
  13. Testing with curl / Postman
```

### 9.5 Manufacturing Document

**File:** `COSMO-CIA-MANUFACTURING-v1.md` (in `/docs/hardware/manufacturing/`)

```
Contents:
  1. BOM (full)
  2. PCBWay order specs
  3. CNC enclosure specs
  4. Assembly sequence
  5. Test fixture specification
  6. Factory flash procedure
  7. Quality gates
  8. Packaging spec
  9. Shipping spec
```

### 9.6 Regulatory Document

**File:** `COSMO-CIA-REGULATORY-v1.md` (in `/docs/hardware/regulatory/`)

```
Contents:
  1. FCC ID application (Part 15 — unlicensed radio)
  2. CE marking pathway (RED directive)
  3. RoHS compliance (components list)
  4. Battery safety (UL 2054 / IEC 62133)
  5. Qi WPC compliance (Wireless Power Consortium)
  6. REACH compliance
  7. WEEE registration
```

---

## 10. Wireless Charger — Accessory

### 10.1 Charger Pad Design

A matching accessory charger pad ships optionally with COSMO® CIA:

| Property | Value |
|----------|-------|
| Form factor | 60mm × 60mm × 8mm, same 316L stainless aesthetic |
| Output | Qi 5W (1A @ 5V) |
| Input | USB-C PD, 9V/2A |
| Transmitter IC | IDT P9038 or STWLC84 |
| Coil | 50mm transmit coil |
| Alignment aid | Passive magnetic centering ring (N52 neodymium rim) |
| LED indicator | Charging: white glow / Full: off |
| Surface | Mirror polish top, same as CIA back plate — they mirror each other when stacked |

The pad and device pair visually: polished steel on polished steel, edge-aligned. When charging, COSMO® CIA is placed face-down (polished back against polished pad).

### 10.2 Wireless Charging BOM Addition

| Component | Part | Qty | Supplier | Unit | 100× |
|-----------|------|-----|----------|------|------|
| Qi TX IC | IDT P9038-R-EVK | 1 | Mouser | $2.80 | $280 |
| TX coil 50mm | Generic 6µH 50mm | 1 | AliExpress | $1.20 | $120 |
| USB-C PD IC | FUSB307B | 1 | Mouser | $1.50 | $150 |
| Pad PCB (PCBWay) | 2-layer 58×58mm | 100 | PCBWay | $1.80 | $180 |
| Stainless pad shell | CNC 316L 60×60×8mm | 100 | PCBWay CNC | $12.00 | $1,200 |
| **Charger total 100×** | | | | | **~$1,930** |

---

## 11. Session Compression — Technical Specification

### 11.1 Philosophy

Each COSMO® CIA session (24h) generates approximately 2–8 KB of raw sensor + event data. This is compressed at end-of-session and uploaded as a single payload to `POST /api/hardware/session`.

Compression reduces transmission time and battery impact. The device must complete the upload in ≤ 3 seconds on a typical home Wi-Fi connection.

### 11.2 Compression Stack

```
Raw session struct (binary packed, C struct)
    ↓
LZ4HC compression (level 9, deterministic)
    ↓
Base64 encoding (for JSON transport)
    ↓
JSON envelope with metadata
    ↓
TLS 1.3 HTTPS POST to lot-systems.com
```

Typical sizes:
| Stage | Size |
|-------|------|
| Raw binary | 5,800 bytes |
| After LZ4HC | 1,900 bytes |
| After base64 | 2,534 bytes |
| JSON envelope | 2,650 bytes |
| TLS overhead | ~200 bytes |
| **Wire total** | **~2.85 KB** |

### 11.3 Server Decompression

Server receives the JSON envelope, base64-decodes, LZ4-decompresses, and stores the binary session in `hardware_sessions.payload` (BYTEA). A background job parses sessions hourly and populates the LOT user dashboard hardware tab.

---

## 12. AI Notification Engine — Server Side

### 12.1 How Notifications Are Generated

The LOT Memory Engine generates COSMO® CIA notifications by applying the same AI prompting used for Memory Story questions, but targeted at the hardware device format:

- Short (< 32 chars), action-oriented text
- Based on QOS mode, time of day, user patterns
- Examples: "Coffee time!", "Hydrate now.", "Time to move.", "QOS: recovery mode — rest."
- Wellness-oriented, never alarming
- Sent 2–8x per day depending on subscription tier

Notification generation runs on the same AI engine abstraction (Together AI / Gemini / Anthropic).

### 12.2 Delivery Model

```
LOT AI Engine generates notification
        ↓
Stored in hardware_notifications table
        ↓
Device polls every 60s:
  GET /api/hardware/notifications
        ↓
Device displays on OLED
        ↓
User presses Copy
        ↓
POST /api/hardware/log
        ↓
LOT Log tab shows entry in real time
        ↓
Memory Engine notes the acknowledgement time
  → adjusts future notification timing
```

---

## 13. Regulatory Pathway

### 13.1 FCC (USA)

COSMO® CIA uses ESP32-S3-MINI-1, which carries pre-certified FCC/CE/IC approvals from Espressif as a module. For the complete device:

- **Path**: Modular FCC ID (2BBQ2-ESP32S3MINI1) covers the radio — only unintentional radiation testing required for the full assembly
- **Testing**: Class B unintentional emissions (FCC Part 15 Subpart B)
- **Estimated cost**: $3,000–$5,000 at accredited lab
- **Timeline**: 6–10 weeks
- **Target**: FCC ID before commercial sale

### 13.2 CE (EU)

- **Radio**: RED Directive (2014/53/EU) — covered by ESP32-S3 module CE certificate
- **Safety**: LVD Directive (2014/35/EU) for battery device
- **RoHS**: All components compliant (ENIG PCB, SAC305 solder, 316L steel)
- **CE self-declaration** possible for pilot 100-unit run in EU

### 13.3 Qi Certification

BQ51013B is a Qi-certified receiver IC. For the Qi transmitter pad:
- Apply for WPC Qi certification if commercial sale
- Cost: ~$5,000 + testing
- Not required for internal / pilot use

---

## 14. Cost Summary & Pricing

### 14.1 Pilot Run (100 units)

| Category | Cost |
|----------|------|
| Electronic components | $2,057 |
| PCBWay PCB + SMT | $920 |
| CNC enclosure | $1,800 |
| Tooling / setup | $1,000 |
| Engineering samples | $500 |
| Shipping + customs | $300 |
| Buffer (10%) | $483 |
| **Total** | **~$7,110** |
| **Per unit landed** | **~$71** |

### 14.2 Target Retail Price

| Tier | Price | Margin |
|------|-------|--------|
| COSMO® CIA device | $199 | 65% (at 1,000 unit scale) |
| Wireless charger pad | $49 | 60% |
| Bundle | $229 | — |

### 14.3 Scale Economics

| Volume | Per-unit cost |
|--------|--------------|
| 100 units (pilot) | $71 |
| 500 units | $52 |
| 1,000 units | $43 |
| 5,000 units | $31 |

---

## 15. Open Technical Risks

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| 5mm Z-height too tight for selected components | Medium | Camera and OLED may require custom-thin variants; engineering samples will confirm |
| Qi charging through 316L steel back | Low | 316L is austenitic (non-magnetic) — Qi coupling confirmed in literature; test in Phase 1 |
| BME688 environmental access inside sealed housing | Medium | 0.5mm pinhole in back shell with hydrophobic mesh membrane (Gore-Tex) |
| ESP32-S3 antenna performance in stainless housing | High | Antenna area must be clear of metal — front shell has plastic/glass window area; antenna aligned with glass |
| Battery life < 8h in active notification mode | Low | Deep sleep between polls reduces current to ~10µA; poll interval tunable |
| PCBWay CNC tolerance on 5mm total stack | Medium | Request ±0.1mm on shell thickness; measure 5x prototypes before full order |
| LOT API hardware endpoints not yet implemented | Certain | Server-side implementation required before integration phase (Week 7) |

---

## 16. Next Actions

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Create PCB schematic (KiCad) | Hardware Engineer | Week 1 |
| 2 | Enclosure CAD (STEP file for PCBWay) | Mechanical Engineer | Week 2 |
| 3 | Add `hardware-api.ts` route to LOT codebase | Backend Dev | Week 3 |
| 4 | Add hardware DB migrations | Backend Dev | Week 3 |
| 5 | Add Log tab hardware entry styling | Frontend Dev | Week 4 |
| 6 | Order 5x engineering sample PCBs (PCBWay) | EE | Week 3 |
| 7 | Order 5x CNC enclosure samples | ME | Week 3 |
| 8 | Begin ESP-IDF firmware skeleton | FW Dev | Week 4 |
| 9 | Procure BME688 samples for BSEC2 testing | EE | Week 4 |
| 10 | Place full 100-unit PCBWay order | EE | Week 8 |

---

## Appendix A: Notification Screen Layouts

```
╔══════════════════╗     ╔══════════════════╗
║ ● 09:14    🔋84% ║     ║ ● 09:14    🔋84% ║
║                  ║     ║ ────────────────  ║
║  Coffee time!    ║     ║  QOS: recovery   ║
║                  ║     ║  mode — rest.    ║
║  [■ Copy]        ║     ║  [■ Copy]        ║
╚══════════════════╝     ╚══════════════════╝
   Standard notif            QOS mode alert
```

```
╔══════════════════╗
║ ● 09:14    🔋84% ║
║ 22°C  IAQ 72     ║
║  ∿∿∿∿∿∿∿∿∿∿∿∿    ║
║  Charging...     ║
╚══════════════════╝
   Idle / charging screen
```

---

## Appendix B: Hardware Folder Structure (to be created in repo)

```
docs/hardware/
  ├── hardware-overview.md          ← this document
  ├── firmware/
  │   ├── COSMO-CIA-FIRMWARE-v1.md
  │   └── CHANGELOG.md
  ├── api/
  │   └── COSMO-CIA-API-CONNECTOR-v1.md
  ├── manufacturing/
  │   └── COSMO-CIA-MANUFACTURING-v1.md
  ├── regulatory/
  │   └── COSMO-CIA-REGULATORY-v1.md
  └── manuals/
      └── COSMO-CIA-USER-GUIDE-v1.md   ← source for PDF export

firmware/ (new top-level directory)
  ├── main/
  │   ├── main.c
  │   ├── wifi_manager.c / .h
  │   ├── https_client.c / .h
  │   ├── display.c / .h
  │   ├── sensor_bme688.c / .h
  │   ├── camera_ov2640.c / .h
  │   ├── button.c / .h
  │   ├── session_compress.c / .h
  │   └── ota.c / .h
  ├── components/
  │   ├── lz4/             ← LZ4 library
  │   └── bsec2/           ← Bosch BSEC2 pre-compiled lib
  ├── CMakeLists.txt
  ├── sdkconfig.defaults
  └── partitions.csv
```

---

## Document Control

| Version | Date | Author | Change |
|---------|------|--------|--------|
| v1.0 | 2026-06-15 | Vadim Marmeladov / Claude Code | Initial release |

---

*COSMO® CIA — A LOT Systems physical computing product.*
*Invented by Vadim Marmeladov. Named for Kuzya Cosmo Marmeladov.*
*brand.lot-systems.com · lot-systems.com · institute.lot-systems.com*

*© 2026 LOT Systems, Inc. All rights reserved.*
