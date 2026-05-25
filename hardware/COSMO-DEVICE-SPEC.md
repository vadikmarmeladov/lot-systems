# COSMO® CIA — Hardware Device Specification
**LOT-Computer Hardware Division**
**Document:** COSMO-SPEC-001 · Rev 1.0
**Date:** 2026-05-25
**Author:** Vadik · Inventor · COSMO® CIA

---

## 1. Product Overview

The **COSMO® CIA** is a compact, AI-connected notification pager designed for the LOT Systems ecosystem. It receives autonomous push notifications from `lot-systems.com`, logs physical button presses back to the user's Log tab, and captures ambient environmental data through AI-grade sensors — all in a polished stainless steel form factor the size of a matchbox.

### 1.1 Device Identity

| Field | Value |
|---|---|
| Product Name | COSMO® CIA |
| Form Factor | Flat square slab |
| Dimensions | 40 × 40 × 5 mm |
| Weight (target) | ≤ 28 g |
| Body Material | 316L Stainless Steel, 2-part CNC shell |
| Side A | Mirror-polished stainless steel (back) |
| Side B | Camera port · OLED screen · Copy button (front) |
| Connectivity | Wi-Fi 802.11 b/g/n · BLE 5.0 |
| Charging | Qi wireless inductive charging |
| Production Run | 100 units (Pilot) |

---

## 2. Physical Design

### 2.1 Enclosure

```
TOP VIEW — Side B (Front Face)
┌────────────────────────────────────────┐
│  ┌──┐          ┌──────────────────┐    │
│  │CAM│          │   OLED SCREEN    │    │
│  │2MP│          │   128 × 128 px   │    │
│  └──┘          │   1.3" diagonal  │    │
│                └──────────────────┘    │
│                                        │
│              ┌──────┐                  │
│              │COPY ●│  ← tactile btn  │
│              └──────┘                  │
└────────────────────────────────────────┘
  40 mm wide

BOTTOM VIEW — Side A (Back Face)
┌────────────────────────────────────────┐
│                                        │
│       Mirror-Polished 316L SS          │
│              (blank)                   │
│                                        │
│         COSMO® CIA  ·  LOT             │  ← laser-engraved
│                                        │
└────────────────────────────────────────┘

SIDE PROFILE — 5 mm total height
  ┌──────────────────────────────────────┐  ← Side B (matte bead-blast)
  │  PCB stack + battery + sensors       │  ← 3.0 mm interior
  └──────────────────────────────────────┘  ← Side A (mirror polish)
```

### 2.2 Shell Fabrication

| Parameter | Spec |
|---|---|
| Material | 316L Stainless Steel |
| Shell Parts | 2 (top shell + bottom shell) |
| Top shell finish | Bead-blasted matte (Side B) |
| Bottom shell finish | Mirror-polished (Side A) |
| Joining method | Snap-fit + 2× M1.6 recessed screws |
| Gasket | Silicone O-ring, IP52 rating |
| Manufacturer | PCBWay CNC Service |
| Engraving | Laser engraved "COSMO® CIA · LOT" on Side A |
| Camera window | Sapphire crystal lens cover, press-fit |
| Screen window | Anti-glare mineral glass, 22 × 22 mm |

### 2.3 Internal Stack (Z-axis, 5 mm budget)

```
Side B (front)
┌─────────────────────────────────────────┐  0.0 mm  Top shell
│ Camera module (OV2640, 5 mm lens)       │  0.5 mm
│ OLED screen (1.3", 5-pin FPC)           │  0.8 mm
│ PCB — main (38 × 38 mm, 4-layer)        │  1.6 mm
│ LiPo battery (38 × 35 × 1.8 mm, 200mAh)│  3.4 mm
│ Qi receiver coil (flex, self-adhesive)  │  4.0 mm
│ Thermal pad + bottom shell              │  5.0 mm
└─────────────────────────────────────────┘  5.0 mm  Bottom shell (Side A)
```

---

## 3. Electronics Architecture

### 3.1 Block Diagram

```
                         ┌─────────────────────────┐
                         │    ESP32-S3 (MCU/AI)     │
   Wi-Fi ─────────────── │  Xtensa LX7, 240 MHz     │
   BLE  ─────────────── │  8 MB Flash · 2 MB PSRAM  │
                         │  AI Inference Engine      │
                         └──┬─────┬────┬──────┬─────┘
                            │     │    │      │
              ┌─────────────┘     │    │      └──────────────┐
              ▼                   ▼    ▼                      ▼
      ┌──────────────┐   ┌──────────┐  ┌────────────┐  ┌──────────────┐
      │ OV2640 2MP   │   │ SSD1306  │  │  BME688    │  │  MAX17048    │
      │ Camera       │   │ OLED 128²│  │ AI Sensor  │  │  Fuel Gauge  │
      └──────────────┘   └──────────┘  └────────────┘  └──────┬───────┘
                                                               │
              ┌────────────────────────────────────────────────┘
              ▼
      ┌──────────────────────────────────────────────────────────────┐
      │  BQ51013B Qi Receiver  →  MCP73831 Charger  →  200mAh LiPo  │
      └──────────────────────────────────────────────────────────────┘
              ▼
      USB-C (debug/flash only, not primary charge)
```

### 3.2 Main MCU

| Parameter | Value |
|---|---|
| IC | Espressif ESP32-S3-WROOM-1 module |
| CPU | Dual-core Xtensa LX7, up to 240 MHz |
| Flash | 8 MB integrated |
| PSRAM | 2 MB (octal SPI) |
| Wi-Fi | 802.11 b/g/n (2.4 GHz) |
| BLE | 5.0 LE |
| AI accelerator | Vector instructions (SIMD), 8-bit quantized inference |
| GPIO | 36 programmable |
| Camera interface | DVP / CSI |
| Package | Castellation module, 25.5 × 18 mm |
| Reason chosen | Camera interface + AI vector engine + Wi-Fi in single module; proven PCBWay-friendly footprint |

### 3.3 Display

| Parameter | Value |
|---|---|
| IC | SSD1306 / SSD1315 |
| Size | 1.3" diagonal, 128 × 128 pixels |
| Panel | OLED monochrome (white on black) |
| Interface | I²C (400 kHz) |
| Connector | 5-pin 0.5 mm FPC |
| Viewing angle | 160° |
| Power | 3.3 V, ~15 mA active |
| Purpose | Shows AI-driven notifications from lot-systems.com |

### 3.4 Camera

| Parameter | Value |
|---|---|
| IC | OV2640 |
| Resolution | 2 MP (1600 × 1200), JPEG output |
| Interface | DVP 8-bit parallel |
| Lens | Fixed-focus, f/2.0, 66° FOV |
| IR filter | Built-in |
| Package | COB (chip-on-board) module, 10 × 10 × 5 mm |
| Power | 3.3 V, ~100 mA active |

### 3.5 Environmental Sensor (AI-Grade)

| Parameter | Value |
|---|---|
| IC | Bosch BME688 |
| Measures | Temperature · Humidity · Barometric pressure · Gas (VOC/AQI) |
| AI feature | BME AI Studio – neural network gas pattern recognition |
| Interface | I²C (shares bus with OLED) or SPI |
| Accuracy | ±0.5 °C temp · ±3% RH · ±0.6 hPa pressure |
| AQI range | 0–500 (IAQ index) |
| Package | LGA-8, 3 × 3 × 0.9 mm |
| Power | 3.3 V, 2.1 µA sleep |

### 3.6 Power System

| Component | Value |
|---|---|
| Battery | LiPo 200 mAh, 38 × 35 × 1.8 mm |
| Run time (Wi-Fi active) | ~4 hours |
| Run time (deep sleep) | ~30 days |
| Qi charging IC | Texas Instruments BQ51013B |
| Charge management IC | Microchip MCP73831 |
| Fuel gauge IC | Maxim MAX17048 |
| Charge indicator | RGB LED (hidden behind matte shell edge) |
| Qi receive coil | 40 × 40 mm flex coil, 200 mW |
| Charge speed | 5W max (Qi baseline) |
| USB-C | Debug / firmware flash only |

### 3.7 User Input

| Component | Spec |
|---|---|
| Button type | Tactile SMD switch, 3.2 × 4.2 mm |
| Travel | 0.1 mm |
| Force | 160 gf |
| Function | "COPY" — sends signal to LOT Log tab |
| Feedback | LED flash + haptic (coin vibration motor, 8mm) |
| Haptic driver | DRV2605L |

---

## 4. Software Architecture Overview

### 4.1 Connectivity Flow

```
lot-systems.com ──HTTPS──► LOT Device API ──JSON──► ESP32-S3
                                                      │
                     ◄──HTTPS── /api/device/notify    ▼
                                                  OLED display
                     ◄──HTTPS── /api/device/copy ◄── Copy button
```

### 4.2 Notification Delivery

1. Site sends notification via LOT API → stored in `device_notifications` table
2. Device polls every 60 s (or SSE push when Wi-Fi active)
3. ESP32-S3 renders text on OLED
4. Notification is dismissed on button press

### 4.3 Copy Button Signal

1. User presses COPY button
2. Device POSTs `{ event: "device_copy", deviceId, timestamp, sensorData }` to LOT API
3. API creates a `Log` entry for the user's Log tab on lot-systems.com
4. Device flashes LED + vibrates (confirmation)

---

## 5. Environmental & Safety

| Parameter | Value |
|---|---|
| Operating temperature | 0 – 45 °C |
| Storage temperature | -10 – 60 °C |
| IP rating | IP52 (dust protected, splash resistant) |
| Certifications (target) | FCC Part 15 · CE Mark · RoHS |
| Battery safety | UL 2054 cell, protection circuit |
| EMI | On-board ferrite beads on RF traces |

---

## 6. Key Dimensions Summary

| Attribute | Value |
|---|---|
| Overall | 40 × 40 × 5.0 mm |
| PCB | 38 × 38 mm (4-layer, 1.0 mm thick) |
| Screen aperture | 24 × 24 mm |
| Camera aperture | 8 × 8 mm |
| Button cutout | 8 × 8 mm |
| USB-C port | Edge, hidden under top bevel |
| Wireless charge pad | Centred on Side A |

---

## 7. Revision History

| Rev | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-05-25 | Vadik · COSMO® CIA | Initial release — 100-unit pilot spec |

---

*COSMO® CIA is a trademark of LOT Systems. All rights reserved.*
*Document COSMO-SPEC-001 · lot-systems.com*
