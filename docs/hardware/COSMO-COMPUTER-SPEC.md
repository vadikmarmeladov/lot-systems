<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Hardware Product Specification

**Document:** COSMO-COMPUTER-SPEC.md
**Classification:** Confidential — Hardware R&D
**Revision:** 1.0
**Date:** May 28, 2026
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems / COSMO® CIA
**Status:** Pre-Production Design

---

## Product Identity

**Product Name:** COSMO® Computer
**Codename:** CC-1
**Form Factor:** Flat square wearable / desk companion
**Mission:** A physical extension of the LOT operating system — carrying autonomous AI notifications, behavioral signals, and environmental awareness in a pocket-sized stainless steel device.

The COSMO® Computer is not a phone. It is not a smartwatch. It is a **signal device** — a physical manifestation of the LOT System that receives intelligence from lot-systems.com and delivers it to the user through a minimal, distraction-free surface.

---

## Physical Specifications

| Parameter | Value |
|-----------|-------|
| Dimensions | 40 × 40 × 5.5 mm |
| Weight (target) | ≤ 28 g |
| Body material | 316L Stainless Steel |
| Body finish (Side A) | Mirror-polished (Ra < 0.05 µm) |
| Body finish (Side B) | Brushed satin |
| Body construction | 2-part CNC-machined shell with snap/screw fit |
| Color | Silver (natural 316L) |
| Camera protrusion | +1.2 mm at camera window (flush ring surround) |

### Physical Layout

```
Side A — Polished Face (User faces this side)
┌────────────────────────────────────────┐
│                                        │
│          Mirror Polished               │
│          316L Stainless               │
│                                        │
│     [LOT logo etched, center]          │
│                                        │
└────────────────────────────────────────┘

Side B — Active Face (camera, screen, button)
┌────────────────────────────────────────┐
│  ┌──────────────────┐  ○ [Camera]      │
│  │                  │                  │
│  │   OLED Screen    │  ─ Weather slot  │
│  │   30 × 30 mm     │                  │
│  │                  │  [●] Copy btn    │
│  └──────────────────┘                  │
└────────────────────────────────────────┘

Edge Profile (5.5 mm total)
┌──────────────────────────────────────┐
│ [Side A steel 0.5mm][PCB+bat 4mm]   │
│ [Side B steel 0.5mm][Qi coil 0.5mm] │
└──────────────────────────────────────┘
```

---

## Electronic Architecture

### Core Microcontroller

| Parameter | Value |
|-----------|-------|
| MCU | Espressif ESP32-S3FN8 |
| Architecture | Xtensa LX7 dual-core 240 MHz |
| RAM | 512 KB SRAM + 8 MB PSRAM |
| Flash | 8 MB embedded |
| WiFi | 802.11 b/g/n 2.4 GHz |
| Bluetooth | BLE 5.0 |
| Camera interface | DVP / MIPI CSI |
| GPIO | 45 pins |
| Package | QFN56 7×7 mm |

**Rationale:** The ESP32-S3 provides native camera interface, WiFi for LOT API connection, and on-chip AI acceleration (vector instructions) for local inference. The 8MB PSRAM enables image buffering and session compression.

### Display

| Parameter | Value |
|-----------|-------|
| Type | OLED, SPI |
| Driver IC | SSD1327 (grayscale) |
| Resolution | 128 × 128 pixels |
| Visible area | 30 × 30 mm |
| Colors | 16-level grayscale |
| Refresh rate | 60 Hz |
| Power (active) | 15 mA @ 3.3 V |
| Power (idle) | < 1 mA |
| Interface | SPI (4-wire) |

**Display content:** Notifications from lot-systems.com rendered in a clean, LOT-style monospace font. Example: `Coffee time.` displayed in white-on-black center-aligned text. No emojis, no decorations — consistent with LOT design language.

### Camera

| Parameter | Value |
|-----------|-------|
| Module | OV2640 with low-profile M7 lens |
| Resolution | 2 MP (1600 × 1200) |
| Output format | JPEG, RGB565, YUV422 |
| Frame rate | 15 fps @ 2 MP |
| Module dimensions | 24 × 24 × 6 mm (lens included) |
| Field of view | 60° horizontal |
| Interface | DVP parallel, I2C control |
| Low-light | f/2.0 aperture |

The camera window is a laser-cut aperture in Side B with a sapphire glass cover (scratch-resistant, optically clear).

### Weather / Environmental Sensors

| Sensor | IC | Measures | Interface |
|--------|-----|----------|-----------|
| Primary weather | Bosch BME688 | Temp, humidity, pressure, air quality (VOC) | I2C |
| Ambient light | VEML7700 | Lux level (0.0036–120,000 lux) | I2C |
| UV index | VEML6075 | UVA + UVB | I2C |

The BME688 is an AI-grade sensor with an on-chip pattern recognition engine (BSEC library) that classifies air quality into an IAQ score. This enables the LOT System to correlate mood data with environmental conditions — matching existing `weather-mood` insight patterns.

### Copy Button

| Parameter | Value |
|-----------|-------|
| Type | SMD tactile switch |
| Size | 4 × 4 × 1.5 mm |
| Actuation force | 160 gf |
| Travel | 0.15 mm |
| Rated life | 200,000 cycles |
| Function | Single press → POST to `/api/logs` on lot-systems.com (event: `hardware_copy`) |

On press, the device sends a log entry to the LOT site's Log tab with:
```json
{
  "text": "COSMO® Computer: Copy signal sent",
  "event": "hardware_copy",
  "metadata": {
    "deviceId": "<device_serial>",
    "timestamp": "<ISO8601>",
    "sensors": {
      "temperature": 22.1,
      "humidity": 48.2,
      "pressure": 1013.25,
      "iaq": 75,
      "lux": 340
    }
  }
}
```

### Power System

| Parameter | Value |
|-----------|-------|
| Battery | LiPo 402035 (40×20×3.5 mm) |
| Capacity | 250 mAh @ 3.7 V |
| Wireless charging | Qi (WPC 1.3), 5 W |
| Charging IC | Texas Instruments BQ51013B |
| Battery management | TP4056 with DW01A protection |
| Charging time | ~90 min (0→100%) |
| Battery life (active WiFi + screen) | 6–8 hours |
| Battery life (notification standby) | 3–5 days |
| Deep sleep current | < 20 µA |

### Wireless Charging

Qi-standard receiver coil is embedded in Side A (the polished face) beneath a thin 0.3 mm stainless steel inlay. The stainless steel does not block Qi — the coil is positioned in a recessed area isolated from the steel frame by a 0.5 mm polymer gasket.

---

## Connectivity

| Protocol | Standard | Use |
|----------|----------|-----|
| WiFi | 802.11 b/g/n 2.4 GHz | LOT API communication |
| BLE | BLE 5.0 | Phone pairing, config via COSMO® app |
| USB | USB-C (hidden edge port) | Firmware flashing, debug, fallback charge |

The device maintains a persistent HTTPS connection to `lot-systems.com` when on WiFi. Notifications are delivered via server-sent events (SSE) or WebSocket, mirroring the existing LOT infrastructure.

---

## LOT API Integration

The device is a first-class LOT API client. It authenticates using a device-bound API key stored in the ESP32-S3's eFuse secure storage (one-time write, non-extractable).

### Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/os/status` | GET | Poll user health, state, streak |
| `/api/logs` | POST | Submit Copy button event, sensor data |
| `/api/os/insights` | GET | Fetch insights for display |
| `/api/notifications/stream` | SSE | Receive real-time notifications |
| `/api/device/register` | POST | Initial device registration |
| `/api/device/sync` | POST | Session data compression upload |

### Notification Display Logic

```
SSE Event arrives → Parse JSON → Render on OLED
     │
     ├── type: "reminder"    → Show text centered, hold 10s
     ├── type: "insight"     → Show title + 3 lines, hold 15s
     ├── type: "badge"       → Show badge name, hold 5s, fade
     └── type: "weather"     → Show temp + conditions, cycle 5s
```

Notifications display in order received, with a 3-second gap between items. The device does not store notification history — it is a delivery surface only. Full history remains on lot-systems.com.

---

## Session Compression

Per requirement 8, each session's behavioral data is compressed before transmission:

1. **Local buffer:** ESP32-S3 PSRAM stores up to 512 sensor readings per session.
2. **Compression:** zlib deflate (hardware-accelerated on ESP32-S3) reduces typical session data by 70–80%.
3. **Upload:** Compressed payload POSTed to `/api/device/sync` at session end (defined as: 5 minutes of inactivity, or battery < 10%, or user holds button 3 seconds).
4. **Server-side:** Decompressed and appended to user's log stream, tagged `source: hardware`.

---

## Enclosure Design

### Material
316L Stainless Steel — chosen for:
- Biocompatibility (ISO 10993)
- Corrosion resistance (saltwater, sweat)
- Mirror-polish capability (Ra < 0.05 µm achievable)
- Electromagnetic compatibility (non-magnetic grade)

### Two-Part Construction

```
Part 1: Back Shell (Side A — polished)
  - 0.5 mm polished face plate
  - 2.0 mm deep cavity for PCB + battery
  - M1.4 screw bosses × 4 corners
  - Qi coil recess in center, isolated with PTFE gasket

Part 2: Front Frame (Side B — brushed)
  - 0.5 mm satin brushed face
  - 30×30 mm OLED window cutout (Gorilla Glass inset)
  - 5 mm camera aperture with sapphire lens cover
  - 4 mm button aperture, flush
  - USB-C edge notch (2.5 mm, bottom edge)
  - Weather sensor micro-slot (0.5×3 mm, left edge, mesh covered)
```

Assembly: Parts mate with a 0.1 mm tolerance press-fit along perimeter edge, secured by 4× M1.4 stainless Phillips screws recessed 0.3 mm into the brushed face corners. IP52 rated (silicone gasket between parts).

### Surface Finishes

| Surface | Process | Spec |
|---------|---------|------|
| Side A face | Electropolish + hand buffing | Ra < 0.05 µm, mirror |
| Side A edge | Brushed | Ra 0.4–0.8 µm |
| Side B face | Mechanical brush, 320 grit | Ra 0.4–0.8 µm |
| Interior | Bead blasted | Adhesion surface for PCB bracket |
| Screws | 316L, PVD black | Match brushed aesthetic |

---

## PCB Design

### PCB Specifications

| Parameter | Value |
|-----------|-------|
| Manufacturer | PCBWay |
| Dimensions | 36 × 36 mm |
| Layers | 4 (signal / ground / power / signal) |
| Material | FR4 + Rogers 4350B hybrid (RF area) |
| Copper weight | 1 oz outer, 0.5 oz inner |
| Min trace | 4 mil |
| Min via | 0.2 mm drill |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Soldermask | Black |
| Silkscreen | White |
| Qty per order | 100 panels |

### PCB Layer Stack

```
Layer 1: Signal (components + routing)
Layer 2: Ground plane (continuous, solid)
Layer 3: Power plane (3.3V + 1.8V + VBAT)
Layer 4: Signal (RF + camera + SPI display)
```

Layer 2 ground plane maintains RF integrity for the ESP32-S3 2.4 GHz antenna (inverted-F, edge of board).

### Component Placement

```
36×36 mm PCB top view:

┌─────────────────────────────────────────┐
│ [BME688]  [VEML7700]  [VEML6075]       │
│                                         │
│ [ESP32-S3FN8 QFN56]    [SSD1327 OLED] │
│                         connector →    │
│ [TP4056] [DW01A]                       │
│                                         │
│ [BQ51013B]  [OV2640 connector]         │
│                                         │
│ [USB-C]  [Tactile SW]  [LiPo conn]    │
└─────────────────────────────────────────┘
```

---

## Wireless Charger (Accessory)

A dedicated wireless charging dock ships with each COSMO® Computer unit.

| Parameter | Value |
|-----------|-------|
| Standard | Qi WPC 1.3 |
| Output power | 5 W |
| Transmitter IC | IDT P9025AC |
| Input | USB-C, 5V/2A |
| Dock material | 316L stainless steel (matched to device) |
| Dock dimensions | 50 × 50 × 8 mm |
| Alignment | Magnetic alignment ring (3 × N42 neodymium) |
| Cable | 1.2 m braided USB-C |

The device rests polished-side down on the dock — the polished face becomes the charging surface, and the brushed active face points up.

---

## Production Run — 100 Units

### Run Strategy

| Phase | Units | Purpose |
|-------|-------|---------|
| Engineering Pilot | 5 | Design validation, fit check |
| EVT (Engineering Validation) | 10 | Electrical, RF, drop test |
| DVT (Design Validation) | 20 | User testing, Usership tier |
| PVT (Production Validation) | 30 | Line qualification at PCBWay |
| MP Run 1 | 35 | Shipping units (Usership + R&D tier) |
| **Total** | **100** | |

### Cost Estimate (100 units)

| Item | Unit Cost | 100× Total |
|------|-----------|-----------|
| PCB (PCBWay, assembled) | $38 | $3,800 |
| Stainless enclosure (CNC) | $45 | $4,500 |
| Wireless charger dock | $12 | $1,200 |
| Battery | $4 | $400 |
| Packaging (box, insert) | $6 | $600 |
| Firmware flashing + QC | $5 | $500 |
| Misc (screws, gaskets, glass) | $3 | $300 |
| **Total BOM + Mfg** | **$113** | **$11,300** |
| Engineering / tooling (one-time) | — | $8,000 |
| **Total 100-unit run** | — | **~$19,300** |

---

## Compliance Targets

| Standard | Scope |
|----------|-------|
| FCC Part 15 (USA) | WiFi / BLE emissions |
| CE RE Directive (EU) | Radio equipment |
| RoHS 3 | Hazardous substances |
| REACH | Chemical compliance |
| Qi WPC 1.3 | Wireless charging |
| IP52 | Dust + water resistance |
| UN38.3 | LiPo battery transport |

---

## Document References

| Document | File |
|----------|------|
| Bill of Materials | `COMPONENTS-BOM.md` |
| PCBWay Manufacturing Guide | `PCBWAY-GUIDE.md` |
| Firmware Architecture | `FIRMWARE-GUIDE.md` |
| Software / API Bridge | `SOFTWARE-API-BRIDGE.md` |
| Assembly Guide | `ASSEMBLY-GUIDE.md` |
| Production Roadmap | `PRODUCTION-ROADMAP.md` |

---

*COSMO® Computer — Invented by Vadim Marmeladov. Built for the LOT operating system. Made in the USA.*

*© 2026 LOT Systems, Inc. All rights reserved. Proprietary and Confidential.*
