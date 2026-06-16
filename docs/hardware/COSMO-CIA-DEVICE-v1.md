# COSMO® CIA Device — Hardware Design Report v1.0

**Classification:** Internal Product Design Document  
**Author:** Vadik Marmeladov, Inventor — COSMO® CIA  
**Organization:** LOT Systems Corporation / COSMO® CIA  
**Date:** 2026-06-16  
**Revision:** 1.0 — Initial Release  
**Status:** PLANNING → PROTOTYPE  

---

> *"A flat square of polished intelligence — the physical body of the Memory Engine."*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)  
2. [Product Concept](#2-product-concept)  
3. [Physical Design Specification](#3-physical-design-specification)  
4. [Hardware Architecture](#4-hardware-architecture)  
5. [Component Bill of Materials (BOM)](#5-component-bill-of-materials-bom)  
6. [PCBWay Manufacturing Specifications](#6-pcbway-manufacturing-specifications)  
7. [LOT API Integration](#7-lot-api-integration)  
8. [Firmware Architecture](#8-firmware-architecture)  
9. [Software Connector](#9-software-connector)  
10. [Wireless Charging System](#10-wireless-charging-system)  
11. [Sensor Suite](#11-sensor-suite)  
12. [Copy Button — Log Signal Protocol](#12-copy-button--log-signal-protocol)  
13. [Session Compression Protocol](#13-session-compression-protocol)  
14. [Production Run — 100 Units](#14-production-run--100-units)  
15. [Cost Estimate](#15-cost-estimate)  
16. [Manufacturing Roadmap](#16-manufacturing-roadmap)  
17. [Document Index](#17-document-index)  

---

## 1. Executive Summary

The **COSMO® CIA Device** (Connected Intelligence Apparatus) is the first physical hardware product in the LOT Systems ecosystem. It is a pager-scale, AI-connected notification device that acts as the physical body of the LOT Memory Engine — receiving proactive context-aware notifications from `lot-systems.com`, logging user actions back to the platform, and capturing environmental data through an on-board AI-grade sensor suite.

**Core Identity:**
- A flat **4 × 4 cm × 5 mm** stainless steel square
- Mirror-polished back / functional front with screen, camera, and button
- Connects wirelessly to the LOT platform
- Receives notifications such as *"Coffee time!"* driven by the Memory Engine AI
- A single **Copy** button sends a confirmation signal back to the LOT site Log tab
- Wireless Qi charging — no exposed ports

**Production target:** 100 units (Pilot A Run)  
**Fabrication:** PCBWay (PCB + PCBA + CNC enclosure machining)  

---

## 2. Product Concept

### 2.1 Role in the LOT Ecosystem

The LOT Memory Engine lives in the cloud at `lot-systems.com`. It knows your routines, preferences, and patterns. The CIA Device is its physical messenger — a silent, intelligent companion carried in a pocket or placed on a desk that surfaces the right signal at the right moment without requiring the user to open an app.

```
lot-systems.com Memory Engine
        │
        │  WebSocket / HTTPS Push
        ▼
  COSMO® CIA Device
        │
   [Notification]  →  Screen shows: "Coffee time!"
        │
   [User presses Copy]  →  HTTP POST to LOT Log tab
        │
   [Sensor data]  →  Environmental context sent upstream
```

### 2.2 Notification Philosophy

The device operates as a **pager** — passive, ambient, low-friction. It does not demand interaction. It whispers. The screen activates for a notification, displays a clean single-line message, and returns to sleep. The Copy button is the user's only response action: *"Yes, I received this. I acted on it."*

### 2.3 COSMO® CIA Branding

| Attribute | Value |
|-----------|-------|
| Brand | COSMO® CIA |
| Product Name | CIA Device |
| Form Factor | Flat square pager |
| Materials | 316L Stainless Steel, sapphire-coated glass |
| Finish | Mirror polish (back) / Satin machined (front) |
| Color | Silver |
| Country | Made in the USA (designed) / Manufactured via PCBWay |

---

## 3. Physical Design Specification

### 3.1 Dimensions

```
┌──────────────────────┐
│                      │  Height: 40 mm
│   COSMO® CIA         │  Width:  40 mm
│                      │  Depth:  5  mm
│   [Screen]           │
│   [●] [◉]            │  Tolerances: ±0.05 mm
│    Btn  Cam          │
└──────────────────────┘
```

| Dimension | Value |
|-----------|-------|
| Length | 40 mm |
| Width | 40 mm |
| Total height | 5.0 mm |
| PCB thickness | 1.0 mm |
| Battery space | 2.8 mm |
| Screen + glass | 1.2 mm (front panel) |
| Shell wall thickness | 0.6 mm (each half) |

### 3.2 Two-Part Stainless Steel Body

The enclosure is split horizontally into two halves:

**Part A — Back Cover (Mirror Polished)**
- Material: 316L Stainless Steel
- Finish: Electropolished + mechanical mirror polish (Ra ≤ 0.05 µm)
- Features: Flat plate, engraved COSMO® CIA logo (laser etched), Qi receiver window (non-metallic insert or window slot for coil field)
- Note: The Qi wireless charging coil field cannot penetrate solid steel. A 28 mm × 28 mm **PEEK polymer window** is inlaid at the center of the back cover to allow magnetic flux through. The surrounding stainless frame remains mirror polished.

**Part B — Front Housing (Satin Machined)**
- Material: 316L Stainless Steel  
- Finish: Satin brushed (Ra 0.4 µm)
- Features:
  - Screen aperture: 24 mm × 24 mm (with flush sapphire-coated glass cover)
  - Camera aperture: 4 mm diameter circular hole (flush glass lens window)
  - Button aperture: 6 mm diameter (flush tactile dome button, stainless cap)
  - Internal PCB standoffs × 4 (M1.2 screw bosses)
- Assembly: 4× M1.2 countersunk stainless screws (2 mm length), torqued to 0.05 N·m

### 3.3 Front Face Layout

```
┌────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← 4mm top margin
│  ░ ┌──────────────────────┐ ░ │
│  ░ │                      │ ░ │
│  ░ │    NOTIFICATION      │ ░ │  24×24mm screen
│  ░ │    SCREEN            │ ░ │  (centered, flush)
│  ░ │                      │ ░ │
│  ░ └──────────────────────┘ ░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← 3mm gap
│  ░░░  [◉ CAM]  [● COPY]  ░░  │  ← Camera + Button row
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← 4mm bottom margin
└────────────────────────────────┘
        40mm wide × 40mm tall
```

### 3.4 Back Face Layout

```
┌────────────────────────────────┐
│                                │
│        ╔═════════════╗         │
│        ║  PEEK Qi    ║         │  28×28mm PEEK window
│        ║  Window     ║         │  (flush, translucent white)
│        ╚═════════════╝         │
│                                │
│      COSMO® CIA  [laser]       │  Laser-etched branding
│      lot-systems.com           │  (bottom center)
└────────────────────────────────┘
     316L Mirror Polished
```

---

## 4. Hardware Architecture

### 4.1 Block Diagram

```
                    ┌─────────────────────────────┐
                    │      ESP32-S3-MINI-1        │
                    │   (MCU + WiFi + BLE + AI)   │
                    │                             │
   Camera ──────────┤ DVP Interface               │
   OV2640           │                             │
                    │ I2C ────────────────────────┼─── BME680 (Weather)
   Screen ──────────┤ SPI                         │
   1.1" TFT         │                             │
                    │ GPIO ──────────────────────┼─── Copy Button
                    │                             │
                    │ I2C ────────────────────────┼─── LSM6DSOX (IMU/AI)
                    │                             │
                    │ I2C ────────────────────────┼─── BQ25120A (PMIC)
                    └─────────────────────────────┘
                              │
                           Battery
                        LiPo 240mAh
                              │
                    ┌─────────▼─────────┐
                    │  Qi Coil + STWLC33│
                    │  (Wireless RX)    │
                    └───────────────────┘
```

### 4.2 Core Components Summary

| Block | Component | Notes |
|-------|-----------|-------|
| MCU / SoC | ESP32-S3-MINI-1 | WiFi b/g/n, BLE 5.0, vector AI |
| Display | 1.1" 240×240 TFT IPS | ST7789V driver, SPI |
| Camera | OV2640 (2MP) | DVP interface, 66° FOV |
| PMIC | BQ25120A | LiPo charger + LDO regulator |
| Qi RX | STWLC33 (STMicro) | 5W Qi receiver |
| Weather | BME680 | Temp, Humidity, Pressure, VOC |
| IMU/AI | LSM6DSOX | 6-axis IMU with ML core |
| Battery | 240mAh LiPo | 3.7V nominal, 30×25×3mm |
| Button | TS1109F | 6mm tactile, SMD |

---

## 5. Component Bill of Materials (BOM)

> All prices quoted at **Quantity 100**. Supplier links are reference points.

### 5.1 Core Electronics

| # | Component | Part Number | Qty/Unit | Unit Price (USD) | 100-Unit Total | Supplier |
|---|-----------|-------------|----------|------------------|----------------|----------|
| 1 | MCU — ESP32-S3-MINI-1-N4R2 | ESP32-S3-MINI-1-N4R2 | 1 | $2.80 | $280 | LCSC / Mouser |
| 2 | Display — 1.1" 240×240 TFT IPS (ST7789V) | Custom module | 1 | $6.50 | $650 | AliExpress / LCSC |
| 3 | Camera — OV2640 (UXGA, DVP) | OV2640 | 1 | $4.20 | $420 | LCSC |
| 4 | PMIC — BQ25120A | BQ25120AYFFR | 1 | $2.10 | $210 | Texas Instruments / Mouser |
| 5 | Qi RX IC — STWLC33 | STWLC33JR | 1 | $3.40 | $340 | STMicro / Mouser |
| 6 | Weather — BME680 | BME680 | 1 | $4.80 | $480 | Bosch / Mouser |
| 7 | IMU/AI — LSM6DSOX | LSM6DSOXTR | 1 | $2.90 | $290 | STMicro / Mouser |
| 8 | LiPo Battery 240mAh | Generic 30×25×3mm | 1 | $2.50 | $250 | Battery supplier |
| 9 | Qi RX Coil 30mm | WR202630-30F1-G | 1 | $1.80 | $180 | TDK / Mouser |
| 10 | Copy Button — TS1109F 6mm | TS1109F06026B45LF | 1 | $0.15 | $15 | LCSC |
| 11 | Stainless button cap 6mm | Custom SS dome | 1 | $0.80 | $80 | PCBWay CNC |
| 12 | Crystal 40MHz (TCXO) | TXC 7M-40.000MAAJ-T | 1 | $0.45 | $45 | LCSC |
| 13 | Decoupling caps 0402 | Various 100nF / 10µF | 20 | $0.02 | $40 | LCSC |
| 14 | Pull-up/pull-down resistors 0402 | Various 10kΩ | 10 | $0.01 | $10 | LCSC |
| 15 | Ferrite beads 0402 | BLM15AG601SN1D | 4 | $0.05 | $20 | Murata / LCSC |
| 16 | ESD protection arrays | PRTR5V0U2X | 3 | $0.12 | $36 | NXP / LCSC |
| 17 | LED RGB 0402 | LTST-C191KFKT | 1 | $0.25 | $25 | Lite-On / Mouser |
| 18 | NTC thermistor (battery temp) | NXRT15WF104FA1B | 1 | $0.20 | $20 | Murata |

**Electronics Subtotal: ~$3,391**

### 5.2 PCB

| # | Item | Specification | Unit Price | 100-Unit Total | Supplier |
|---|------|---------------|------------|----------------|----------|
| 19 | PCB — 4-layer, 40×40mm | FR4, 1.0mm, ENIG, IPC Class 2 | $0.95 | $95 | PCBWay |
| 20 | PCB Assembly (PCBA) | SMT both sides, wave solder | $8.00 | $800 | PCBWay PCBA |

**PCB Subtotal: ~$895**

### 5.3 Mechanical / Enclosure

| # | Item | Specification | Unit Price | 100-Unit Total | Supplier |
|---|------|---------------|------------|----------------|----------|
| 21 | Body Part A — Back Cover | 316L SS, mirror polish, 40×40×2mm | $18.00 | $1,800 | PCBWay CNC |
| 22 | Body Part B — Front Housing | 316L SS, satin, 40×40×3mm | $22.00 | $2,200 | PCBWay CNC |
| 23 | PEEK Qi window insert | PEEK polymer, 28×28×1mm | $3.50 | $350 | PCBWay CNC |
| 24 | Sapphire glass (screen) | 24×24×0.5mm, AR coated | $4.00 | $400 | Crystran / custom |
| 25 | Camera lens glass | 4mm diameter, flat optical glass | $0.80 | $80 | Custom optical |
| 26 | M1.2 screws × 4 | Stainless A4, countersunk, 2mm | $0.10 | $40 | McMaster / LCSC |
| 27 | Silicone gasket (sealing) | Die-cut, 0.3mm, IP54 | $0.60 | $60 | Custom |
| 28 | Internal foam pads (anti-vibration) | 3M 4932 VHB | $0.30 | $30 | 3M |

**Enclosure Subtotal: ~$4,960**

### 5.4 Wireless Charging Dock (Sold Separately / Included in Kit)

| # | Item | Specification | Unit Price | 100-Unit Total | Supplier |
|---|------|---------------|------------|----------------|----------|
| 29 | Qi transmitter coil | 40mm, 5W Qi A11 | $2.20 | $220 | TDK |
| 30 | Qi TX IC — IP6808 | 5W Qi transmitter controller | $1.80 | $180 | INJOINIC / LCSC |
| 31 | Dock PCB — 2-layer 45×45mm | FR4, 0.8mm, HASL | $0.40 | $40 | PCBWay |
| 32 | Dock body — Aluminum 6061 | 45×45×8mm, anodized silver | $6.00 | $600 | PCBWay CNC |
| 33 | USB-C port (dock input) | GCT USB4135-GF-A | 1 | $0.35 | $35 | GCT / Mouser |
| 34 | USB-C cable (1m) | USB-A to USB-C, braided | $1.50 | $150 | Generic |

**Charger Subtotal: ~$1,225**

### 5.5 Packaging (Pilot Run)

| # | Item | Unit Price | 100-Unit Total |
|---|------|------------|----------------|
| 35 | Rigid box — 80×80×30mm, black | $2.50 | $250 |
| 36 | Foam insert — custom die-cut | $1.20 | $120 |
| 37 | Quick start card (printed) | $0.40 | $40 |
| 38 | COSMO® CIA sticker sheet | $0.30 | $30 |

**Packaging Subtotal: ~$440**

### 5.6 Grand Total — 100 Units

| Category | Total |
|----------|-------|
| Electronics | $3,391 |
| PCB + PCBA | $895 |
| Enclosure (CNC + materials) | $4,960 |
| Wireless Charger | $1,225 |
| Packaging | $440 |
| **Engineering / NRE (one-time)** | **$2,500** |
| **Tooling / Fixtures (one-time)** | **$800** |
| **Shipping + Import (est.)** | **$600** |
| **QA / Testing labor** | **$500** |
| **TOTAL — 100 Units** | **~$15,311** |
| **Cost Per Unit** | **~$153** |

---

## 6. PCBWay Manufacturing Specifications

### 6.1 PCB Order

**URL:** https://www.pcbway.com/

| Parameter | Value |
|-----------|-------|
| Board size | 40 × 40 mm |
| Layers | 4 (Signal / GND / PWR / Signal) |
| Thickness | 1.0 mm |
| Material | FR4 TG150 |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Min trace/space | 4/4 mil |
| Min hole size | 0.2 mm |
| Solder mask | Black both sides |
| Silkscreen | White top only |
| Quantity | 120 (20 extra for QA/spares) |
| IPC Class | Class 2 |
| Impedance control | Yes (50Ω for RF traces) |

### 6.2 PCBA Order

**URL:** https://www.pcbway.com/pcba.html

| Parameter | Value |
|-----------|-------|
| Assembly type | SMT both sides + selective hand solder |
| BOM supply | Customer-supplied (LCSC-sourced) |
| Stencil | Laser-cut stainless 0.12mm |
| Reflow profile | Lead-free SAC305 |
| Test | AOI both sides + ICT bed-of-nails (programming fixture) |
| Traceability | QR code laser marked on PCB |

### 6.3 CNC Enclosure Order

**URL:** https://www.pcbway.com/rapid-prototyping/manufacture/

**Part A (Back Cover):**

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Process | CNC milling + grinding + electropolish + mechanical polish |
| Dimensions | 40.0 × 40.0 × 2.0 mm |
| Tolerance | ±0.05 mm |
| Surface | Mirror finish Ra ≤ 0.05 µm |
| Features | PEEK window pocket (28×28×1mm), logo laser etch |
| Qty | 110 |

**Part B (Front Housing):**

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Process | CNC milling + satin brushing |
| Dimensions | 40.0 × 40.0 × 3.0 mm |
| Tolerance | ±0.05 mm |
| Surface | Satin brush Ra 0.4 µm |
| Features | Screen aperture 24×24mm, camera hole 4mm, button hole 6mm, 4× M1.2 screw bosses |
| Qty | 110 |

---

## 7. LOT API Integration

### 7.1 Connection Protocol

The CIA Device connects to `lot-systems.com` over standard WiFi (IEEE 802.11 b/g/n, 2.4 GHz). Communication uses:

1. **HTTPS REST** — for configuration sync, session upload, and initial registration
2. **WebSocket (WSS)** — persistent connection for real-time notification push
3. **MQTT over TLS** (optional fallback) — for low-power intermittent polling

### 7.2 Device Registration

```json
POST https://lot-systems.com/api/v1/devices/register
{
  "device_type": "CIA-v1",
  "device_id": "CIA-{12-char-UUID}",
  "firmware_version": "1.0.0",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "capabilities": ["notifications", "copy_log", "weather", "camera", "imu"]
}
```

Response:
```json
{
  "device_token": "Bearer eyJ...",
  "ws_endpoint": "wss://lot-systems.com/ws/device",
  "poll_interval_ms": 30000
}
```

### 7.3 Notification Push (Server → Device)

WebSocket message format:
```json
{
  "type": "notification",
  "id": "notif-UUID",
  "message": "Coffee time!",
  "priority": "normal",
  "display_duration_ms": 8000,
  "source": "memory_engine",
  "qos_mode": "growth"
}
```

Device renders `message` on screen. Stays on for `display_duration_ms`. Then dims/sleeps.

### 7.4 Copy Button → LOT Log Tab

When user presses Copy:
```json
POST https://lot-systems.com/api/v1/log/event
Authorization: Bearer {device_token}
{
  "event_type": "copy_acknowledged",
  "notification_id": "notif-UUID",
  "device_id": "CIA-{UUID}",
  "timestamp": "2026-06-16T14:32:00Z",
  "sensor_context": {
    "temperature_c": 21.3,
    "humidity_pct": 48.2,
    "pressure_hpa": 1013.1,
    "voc_iaq": 52
  }
}
```

This event appears in the **Log tab** of `lot-systems.com` in real time.

### 7.5 Sensor Data Upload (Every 5 Minutes)

```json
POST https://lot-systems.com/api/v1/devices/{device_id}/telemetry
{
  "timestamp": "2026-06-16T14:35:00Z",
  "weather": {
    "temperature_c": 21.4,
    "humidity_pct": 47.9,
    "pressure_hpa": 1013.0,
    "voc_iaq": 55,
    "gas_resistance_ohm": 48200
  },
  "motion": {
    "steps": 142,
    "activity": "stationary",
    "gesture": "none"
  },
  "device": {
    "battery_pct": 82,
    "wifi_rssi_dbm": -54,
    "uptime_s": 18420
  }
}
```

### 7.6 Session Compression

At end of each active session (user interaction window), the device compresses and uploads:
```json
POST https://lot-systems.com/api/v1/devices/{device_id}/session
{
  "session_id": "sess-UUID",
  "started_at": "2026-06-16T14:00:00Z",
  "ended_at": "2026-06-16T14:35:00Z",
  "notifications_received": 3,
  "notifications_acknowledged": 2,
  "sensor_summary": {
    "avg_temperature_c": 21.3,
    "avg_humidity_pct": 48.1,
    "activity_profile": "sedentary"
  },
  "compressed": true,
  "payload_bytes": 312
}
```

Sessions are compressed with **zlib deflate** before upload. The device buffers up to 48 hours of sessions if offline, then bulk-uploads on reconnect.

---

## 8. Firmware Architecture

> See full specification: [`docs/hardware/firmware/FIRMWARE-SPEC-v1.md`](firmware/FIRMWARE-SPEC-v1.md)

### 8.1 Platform

| Component | Choice | Rationale |
|-----------|--------|-----------|
| RTOS | FreeRTOS (ESP-IDF v5.2) | Native ESP32-S3 support |
| SDK | Espressif ESP-IDF | Full hardware control |
| Language | C / C++ | Embedded standard |
| OTA Update | ESP-IDF OTA (HTTPS) | Delta OTA via lot-systems.com |
| Crypto | mbedTLS | TLS 1.3 for all connections |

### 8.2 Task Architecture

```
FreeRTOS Tasks:
├── wifi_manager_task       (Priority 5) — WiFi connection + reconnect
├── ws_client_task          (Priority 6) — WebSocket to lot-systems.com
├── notification_task       (Priority 4) — Decode + display notifications
├── display_task            (Priority 3) — Screen render + sleep control
├── sensor_task             (Priority 3) — BME680 + LSM6DSOX polling
├── camera_task             (Priority 2) — On-demand capture
├── button_task             (Priority 7) — ISR-driven Copy button
├── session_task            (Priority 2) — Session compress + upload
├── ota_task                (Priority 1) — Background OTA check
└── power_mgr_task          (Priority 8) — Battery + sleep states
```

### 8.3 Power States

| State | Current Draw | Trigger |
|-------|-------------|---------|
| Active (screen on) | ~85 mA | Notification received |
| Connected idle | ~18 mA | WiFi up, screen off |
| Light sleep | ~1.2 mA | No activity 60s |
| Deep sleep (WiFi off) | ~80 µA | No activity 10min |
| Charging (from Qi) | Qi provides 400 mA @ 5V | Placed on dock |

**Battery life estimate:**
- 240 mAh at average 5 mA draw (mostly light sleep, brief active)
- → ~48 hours between charges with 10 notifications/day

### 8.4 Display Driver

- **Controller:** ST7789V via SPI @ 40 MHz
- **Resolution:** 240 × 240 pixels
- **Color depth:** 16-bit RGB565
- **Font:** Monospace 18pt for notifications, 10pt for status
- **Notification template:**
  ```
  ┌──────────────────────┐
  │  ◉  LOT              │  ← brand tag, 10pt
  │                      │
  │  Coffee time!        │  ← message, 18pt bold
  │                      │
  │  14:32  ●●●○○       │  ← time + battery
  └──────────────────────┘
  ```

### 8.5 OTA Update Flow

1. Device checks `https://lot-systems.com/api/v1/firmware/latest` every 24h
2. Compares firmware hash with current
3. Downloads binary to OTA partition
4. Verifies SHA-256 signature
5. Reboots → new firmware active
6. Reports version to server

---

## 9. Software Connector

> See full specification: [`docs/hardware/software/SOFTWARE-CONNECTOR-v1.md`](software/SOFTWARE-CONNECTOR-v1.md)

### 9.1 Purpose

The Software Connector is the bridge between the CIA Device firmware and the LOT platform's backend. It runs as a Node.js service within the existing `lot-systems.com` server infrastructure.

### 9.2 Components

| Module | Description |
|--------|-------------|
| `DeviceRegistry` | Registers, authenticates, and manages device tokens |
| `NotificationRouter` | Receives Memory Engine triggers → routes to WebSocket |
| `LogIngester` | Receives Copy button events → writes to Log tab DB |
| `TelemetryStore` | Ingests sensor data → time-series DB |
| `SessionProcessor` | Decompresses + stores session summaries |
| `OTAServer` | Hosts firmware binaries + version manifest |
| `WebSocketHub` | Manages persistent WSS connections per device |

### 9.3 Integration with Memory Engine

The Memory Engine (existing LOT backend) emits `notification_trigger` events. The Software Connector subscribes to these and routes them to the correct CIA Device via WebSocket:

```
Memory Engine → notification_trigger → SoftwareConnector.NotificationRouter
                                              → WebSocketHub.send(device_id, notification)
                                                      → CIA Device screen
```

### 9.4 Log Tab Integration

Copy button events write to the existing LOT Log table with a new `source: 'CIA_device'` field, visible in the Log tab UI.

---

## 10. Wireless Charging System

### 10.1 Standard

**Wireless Power Consortium (WPC) Qi — Baseline Power Profile (BPP)**
- Frequency: 87–205 kHz
- Output power: 5W nominal
- Efficiency: ~80% coil-to-battery

### 10.2 Receiver (Device Side)

| Component | Part | Notes |
|-----------|------|-------|
| Qi RX IC | STWLC33 | ST Microelectronics, 5W, I2C control |
| Rx Coil | TDK WR202630-30F1-G | 30mm diameter, 3µH, 0.3mm flat |
| Integration | Inside PEEK window | Coil sits behind PEEK insert in back cover |

The PEEK window (28×28mm) in the back cover allows the magnetic field to pass through. The Qi coil is bonded to the inside of the PEEK window with 3M VHB tape.

### 10.3 Transmitter (Charging Dock)

| Component | Part | Notes |
|-----------|------|-------|
| Qi TX IC | IP6808 | INJOINIC, 5W Qi A11 transmitter |
| TX Coil | 40mm flat coil | Matches device footprint |
| Input | USB-C 5V/2A | Universal charger compatible |
| Dock body | Aluminum 6061 anodized | 45×45×8mm pad |
| Alignment | Magnetic centering (4× N35 magnets, 2mm dia.) | Snap-to-center alignment |

### 10.4 Charging Dock Design

```
      Top view (45×45mm):
      ┌──────────────────────┐
      │    ┌──────────┐      │
      │    │  Qi TX   │      │  ← TX coil embedded
      │    │  Coil    │      │
      │  ◦ └──────────┘ ◦   │  ← 4× alignment magnets
      │                      │
      │     [USB-C port]     │  ← bottom edge
      └──────────────────────┘
      Aluminum 6061, silver anodize
```

---

## 11. Sensor Suite

### 11.1 Weather Sensor — BME680

| Parameter | Specification |
|-----------|---------------|
| Sensor | Bosch BME680 |
| Temperature range | -40 to +85°C, ±1°C accuracy |
| Humidity range | 0–100% RH, ±3% accuracy |
| Pressure range | 300–1100 hPa, ±1 hPa accuracy |
| Gas resistance | 1–150 kΩ (VOC proxy / IAQ index) |
| Interface | I2C (400 kHz) |
| Package | LGA-8L (3×3mm) |
| Current | 3.7 mA active / 0.15 µA sleep |
| Update rate | Every 1 second |

**Use Cases:**
- Temperature/humidity for user comfort context
- IAQ (Indoor Air Quality) index fed to Memory Engine
- Pressure trend for weather prediction

### 11.2 AI-Grade Motion Sensor — LSM6DSOX

| Parameter | Specification |
|-----------|---------------|
| Sensor | STMicroelectronics LSM6DSOX |
| Accelerometer | ±2/4/8/16g, 16-bit |
| Gyroscope | ±125/250/500/1000/2000 dps, 16-bit |
| Machine learning | 2 programmable FSM + MLC (Machine Learning Core) |
| Interface | I2C or SPI |
| Package | VLGA-14 (2.5×3mm) |
| Current | 0.55 mA active / 1.8 µA sleep |

**AI On-Device Functions:**
- Activity detection: stationary / walking / running (on-device inference)
- Gesture recognition: tap, double-tap, shake
- Step counting (pedometer)
- Tilt detection (device placed on desk vs. held)

The LSM6DSOX MLC can run a small decision-tree model trained to recognize user behavior patterns (desk placement vs. pocket vs. held), adjusting notification display brightness and haptic response accordingly.

### 11.3 Camera — OV2640

| Parameter | Specification |
|-----------|---------------|
| Sensor | OmniVision OV2640 |
| Resolution | 2MP (1600×1200 UXGA) |
| Interface | DVP (Parallel) 8-bit |
| FOV | 66° |
| Frame rate | 15fps @ UXGA, 30fps @ VGA |
| Output format | JPEG / RGB565 / YUV |
| Lens | 2.8mm fixed, M7 mount |
| Package | CSP (bare die + flex board) |

**Use Cases:**
- QR/barcode scanning (scan products, log items)
- Photo capture for Memory Story entries
- Environmental snapshot attached to sensor upload

---

## 12. Copy Button — Log Signal Protocol

### 12.1 Hardware

- **Button type:** TS1109F tactile SMD, 6mm diameter, 0.3mm travel, 160gf actuation
- **Cap:** Custom 316L stainless steel domed cap, 5.8mm OD, press-fit over button stem
- **Debounce:** 50ms firmware debounce (GPIO interrupt → timer)
- **LED feedback:** RGB LED pulses white for 200ms on press

### 12.2 Signal Flow

```
User presses Copy button
        │
        ▼
button_task ISR fires
        │
        ▼
Debounce filter (50ms)
        │
        ▼
Post event to notification_queue
        │
        ▼
ws_client_task reads queue
        │
        ▼
HTTP POST /api/v1/log/event   (with current notification_id + sensor snapshot)
        │
        ▼
LOT Backend LogIngester
        │
        ▼
Log Tab on lot-systems.com (real-time update)
        │
        ▼
Device LED pulses green (confirmation)  ←── Server returns 200 OK
```

### 12.3 Offline Buffering

If WiFi is unavailable when Copy is pressed:
1. Event is stored in NVS (non-volatile storage) flash with timestamp
2. LED pulses amber (queued)
3. On WiFi reconnect, buffered events are replayed in order
4. LED pulses green for each successful upload

---

## 13. Session Compression Protocol

### 13.1 Session Definition

A **session** begins when the device first receives a notification or the user presses Copy. It ends after 30 minutes of no interaction (configurable via server).

### 13.2 Compression

| Step | Method |
|------|--------|
| Sensor aggregation | Min/max/avg per metric over session window |
| JSON serialization | Compact JSON (no whitespace) |
| Compression | zlib DEFLATE level 6 (ESP-IDF esp_zlib) |
| Encoding | Base64 for transport |
| Typical payload | Raw ~2KB → Compressed ~400 bytes |

### 13.3 Session Record Schema

```json
{
  "v": 1,
  "sid": "sess-UUID",
  "did": "CIA-UUID",
  "t0": 1750000000,
  "t1": 1750001800,
  "n_recv": 3,
  "n_ack": 2,
  "wx": {"tc_avg": 21.3, "rh_avg": 48, "pa_avg": 1013, "iaq_avg": 52},
  "mo": {"steps": 142, "act": 1},
  "batt": {"pct_start": 84, "pct_end": 82},
  "z": true
}
```

---

## 14. Production Run — 100 Units

### 14.1 Production Flow

```
Phase 1 — Engineering (Weeks 1–4)
├── Schematic capture (KiCad)
├── PCB layout (4-layer, 40×40mm)
├── 3D model (STEP file for enclosure)
├── Gerber + BOM export
└── PCBWay order placed

Phase 2 — Prototypes (Weeks 5–8)
├── 5× PCB prototypes (PCBWay)
├── 3× CNC enclosure prototypes (PCBWay CNC)
├── Manual assembly + bring-up
├── Firmware v0.9 flash + WiFi test
├── LOT API integration test
└── Design freeze / ECO

Phase 3 — Pilot Production (Weeks 9–14)
├── 120× PCB + PCBA order (PCBWay)
├── 110× CNC enclosure order (PCBWay CNC)
├── 100× battery order
├── 100× display module order
├── PCBA receipt + incoming inspection
└── Final assembly line (manual screw + glass bond)

Phase 4 — QA + Shipping (Weeks 15–16)
├── 100% power-on test
├── 100% WiFi association test
├── 100% Copy button test
├── 20% sample sensor calibration check
├── OTA firmware update test (all units)
├── Package + label
└── Ship to inventory / customers
```

### 14.2 PCBWay Order Links

| Order Type | URL |
|------------|-----|
| PCB Manufacturing | https://www.pcbway.com/orderonline.aspx |
| PCBA (Assembly) | https://www.pcbway.com/pcba.html |
| CNC Machining (SS) | https://www.pcbway.com/rapid-prototyping/manufacture/CNC-Machining-Services.html |
| Sheet Metal | https://www.pcbway.com/rapid-prototyping/manufacture/Sheet-Metal-Services.html |

### 14.3 QA Test Protocol (Per Unit)

| Test | Method | Pass Criteria |
|------|--------|---------------|
| Power on | Apply 3.7V LiPo | Boot in < 5s, no smoke |
| WiFi | Connect to test AP | RSSI > -70 dBm, IP assigned |
| Display | Show test pattern | Full 240×240 RGB correct |
| Copy button | Press 5× | 5/5 events logged to test endpoint |
| BME680 | Read sensor | Temp 20±5°C, RH 20–80% |
| LSM6DSOX | Tap test | 2× tap event detected |
| OV2640 | Capture JPEG | Non-black 320×240 frame |
| Qi charging | Place on dock | Battery SoC increases |
| OTA | Flash v_test | Reboots to test firmware |
| Full session | 10 min test run | Session uploaded, compressed |

---

## 15. Cost Estimate

### 15.1 Per Unit Cost Breakdown (at 100 units)

| Category | Cost |
|----------|------|
| Electronics BOM | $33.91 |
| PCB | $0.95 |
| PCBA labor | $8.00 |
| Enclosure (CNC SS) | $43.50 |
| Charging dock | $12.25 |
| Packaging | $4.40 |
| NRE amortized (÷100) | $25.00 |
| QA + labor | $5.00 |
| Shipping | $6.00 |
| **Total per unit** | **~$139** |

### 15.2 Suggested Retail Pricing

| Tier | Price | Margin |
|------|-------|--------|
| Founder pricing (25 units) | $299 | 115% |
| Standard retail | $349 | 151% |
| LOT subscriber bundle | $249 (with 1yr sub) | 79% |

---

## 16. Manufacturing Roadmap

```
2026 Q3                    2026 Q4                    2027 Q1
│                          │                          │
├─ Week 1-2: Schematic     ├─ Week 9: PCBA order      ├─ Week 15: QA pass
│  + PCB layout            │  + CNC enclosure order   │
│                          │                          ├─ Week 16: Packaging
├─ Week 3: PCBWay          ├─ Week 11: PCBA received  │
│  prototype order         │                          ├─ Week 17: Ship
│                          ├─ Week 12: Enclosure      │  (100 units)
├─ Week 5: Prototypes      │  received                │
│  received                │                          ├─ Week 18: LOT
│                          ├─ Week 13-14: Assembly    │  store listing
├─ Week 6-7: Bring-up      │  + integration           │
│  + firmware v0.9         │                          └─ Week 20: Pilot
│                          │                             feedback review
├─ Week 8: Design freeze   └─ Week 14: Full QA run
│
└─ Milestone: ECO signed
```

### 16.1 Key Milestones

| Milestone | Target Date |
|-----------|-------------|
| Schematic complete | 2026-07-07 |
| PCB layout complete | 2026-07-14 |
| PCBWay prototype order | 2026-07-16 |
| Prototype bring-up | 2026-08-11 |
| Design freeze | 2026-08-25 |
| Production order placed | 2026-09-01 |
| PCBA received | 2026-10-13 |
| Final assembly complete | 2026-11-03 |
| QA sign-off | 2026-11-10 |
| First ship date | 2026-11-17 |

---

## 17. Document Index

All documents live in `docs/hardware/` within this repository.

| Document | Path | Status |
|----------|------|--------|
| This report | `docs/hardware/COSMO-CIA-DEVICE-v1.md` | ✅ Complete |
| Component BOM (detailed) | `docs/hardware/BOM-v1.md` | ✅ Complete |
| Firmware Specification | `docs/hardware/firmware/FIRMWARE-SPEC-v1.md` | ✅ Complete |
| Software Connector Spec | `docs/hardware/software/SOFTWARE-CONNECTOR-v1.md` | ✅ Complete |
| Assembly Manual (PDF-ready) | `docs/hardware/manuals/ASSEMBLY-MANUAL-v1.md` | ✅ Complete |
| User Manual (PDF-ready) | `docs/hardware/manuals/USER-MANUAL-v1.md` | ✅ Complete |
| PCB Fabrication Spec | `docs/hardware/pcb/PCB-SPEC-v1.md` | ✅ Complete |
| Enclosure Drawing Spec | `docs/hardware/enclosure/ENCLOSURE-SPEC-v1.md` | ✅ Complete |

---

## Appendix A — Key Supplier Links

| Supplier | Purpose | URL |
|----------|---------|-----|
| PCBWay | PCB, PCBA, CNC machining | https://www.pcbway.com |
| LCSC Electronics | Components (cost-effective) | https://www.lcsc.com |
| Mouser Electronics | Components (US distributor) | https://www.mouser.com |
| DigiKey | Components (US distributor) | https://www.digikey.com |
| Espressif | ESP32-S3 datasheet + SDK | https://www.espressif.com |
| STMicroelectronics | BME680, LSM6DSOX, STWLC33 | https://www.st.com |
| Texas Instruments | BQ25120A PMIC | https://www.ti.com |
| Bosch Sensortec | BME680 | https://www.bosch-sensortec.com |
| TDK Product Center | Qi coils | https://product.tdk.com |

---

## Appendix B — Open Items (To Resolve Before ECO)

| # | Item | Owner | Due |
|---|------|-------|-----|
| 1 | LOT API endpoint spec — confirm `/api/v1/devices/*` routes with backend team | Backend Dev | 2026-07-01 |
| 2 | Qi coil flux penetration test through PEEK insert | HW Engineer | 2026-07-07 |
| 3 | Camera use-case confirmation — is OV2640 needed at launch, or defer? | Vadik | 2026-07-01 |
| 4 | Screen size final decision — 240×240 vs 128×128 for power budget | HW Engineer | 2026-07-07 |
| 5 | FCC / CE certification plan for 100-unit pilot (Part 15 Class B) | Regulatory | 2026-07-14 |
| 6 | PEEK window SS bonding method — adhesive vs. press-fit vs. laser weld | Mfg Engineer | 2026-07-14 |
| 7 | LOT Log tab UI update — display CIA Device events | Frontend Dev | 2026-07-21 |
| 8 | Wireless charger dock — same box as device or sold separately? | Vadik | 2026-07-01 |

---

*Report generated: 2026-06-16*  
*Branch: `claude/brave-lamport-rqoqbb`*  
*Author: Claude (COSMO® CIA — LOT Systems)*  
*Next review: 2026-07-01*
