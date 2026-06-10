<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO·01 — Hardware Computer
## Full Hardware Specification

**Document:** COSMO-CIA-HARDWARE-SPEC.md  
**Revision:** v1.0  
**Date:** 2026-06-10  
**Inventor:** Vadim Marmeladov, COSMO® CIA  
**Status:** DESIGN COMPLETE — Ready for PCBWay submission

---

## 1. Product Overview

COSMO·01 is the first physical LOT hardware computer. It is a compact, premium
notification and sensing device that bridges the digital LOT platform
(lot-systems.com) with the physical world.

The device receives AI-generated personal notifications from the LOT Memory
Engine ("Coffee time!", "Movement reminder", "Your morning ritual starts in
10 minutes"), captures ambient weather data, and enables a one-touch Copy
action that logs the current moment to the user's LOT Log tab.

### 1.1 Design Principles

- **Silent intelligence** — the device does not demand attention. It waits.
- **Material truth** — stainless steel, no plastic shell, no pretense.
- **One gesture** — a single button maps to a single powerful action.
- **Connected always** — persistent tie to the LOT platform.

---

## 2. Physical Specifications

### 2.1 Enclosure

| Parameter | v1 Production | v2 Target |
|-----------|--------------|-----------|
| Footprint | 40mm × 40mm | 40mm × 40mm |
| Height | 8.0mm | 5.0mm |
| Corner radius | 4mm | 4mm |
| Material | 316L Stainless Steel | 316L Stainless Steel |
| Weight | ~62g | ~45g |

**316L stainless steel** is chosen for:
- Corrosion resistance (sweat, water, humidity)
- Premium tactile feel
- EMI shielding properties
- Compatibility with wireless charging (non-ferromagnetic)

### 2.2 Side A — Mirror Polished Face (Back)

- Full-surface mirror polish (Ra < 0.1μm)
- Laser-engraved COSMO® wordmark and serial number (bottom edge, 0.3mm depth)
- Wireless charging receive coil hidden beneath (no visible elements)
- Flush, seamless surface

### 2.3 Side B — Functional Face (Front)

Layout (top-to-bottom, centered on 40×40mm face):

```
┌─────────────────────────┐
│                         │  ← 2mm margin
│   ┌─────────────────┐   │
│   │                 │   │
│   │   1.0" OLED     │   │  ← 30×30mm display window
│   │   Display       │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │  ← 3mm gap
│      [●] Camera         │  ← 4mm camera lens aperture
│                         │  ← 2mm gap
│      [▣] COPY Button    │  ← 8×8mm button recess
│                         │  ← 2mm margin
└─────────────────────────┘
```

- Display window: sapphire glass lens, 31mm × 31mm, 0.7mm thick
- Camera aperture: 4mm circular, chemically polished
- Button: flush-mount tactile, 1mm proud when pressed
- Side B surface: #4 brushed finish (directional satin, Ra 0.8–1.5μm)

### 2.4 Enclosure Construction

Two-part snap-fit with M1.2 stainless screws (4×) at corners:

```
Side B Shell (functional)
  ├── PCB mounting bosses (×4, M1.6 thread, 2mm height)
  ├── Display aperture with sapphire glass bonded
  ├── Camera aperture with lens seat
  ├── Button recess with IP53 rubber gasket
  └── Internal cable management channel

Side A Shell (polished)
  ├── Wireless charging coil recess (0.5mm depth, 35×35mm)
  ├── Battery cradle (35×28×2.5mm)
  └── Pogo pin charging contacts (×2, recessed, spring-loaded)
```

---

## 3. Electronics

### 3.1 Main Controller — ESP32-S3-WROOM-1-N8R2

| Parameter | Value |
|-----------|-------|
| CPU | Xtensa dual-core LX7, 240MHz |
| Flash | 8MB |
| PSRAM | 2MB |
| WiFi | 802.11 b/g/n 2.4GHz |
| Bluetooth | BLE 5.0 |
| Camera interface | DVP / I2S |
| USB | USB OTG (programming + DFU) |
| Deep sleep current | 7μA |
| Operating voltage | 3.0–3.6V |

The ESP32-S3 is the optimal choice because:
- Integrated camera interface for OV2640
- Native WiFi for LOT API WebSocket
- Deep sleep wake via GPIO (button interrupt)
- Arduino + ESP-IDF dual ecosystem
- USB OTG for firmware flashing via USB-C port

### 3.2 Display — 1.0" Color OLED (SSD1351)

| Parameter | Value |
|-----------|-------|
| Driver IC | SSD1351 |
| Resolution | 128 × 128 pixels |
| Colors | 65,536 (RGB565) |
| Interface | SPI (4-wire) |
| Dimensions | 30mm × 30mm × 1.8mm |
| Viewing angle | 160° |
| Power (active) | 15–35mA (varies by content) |
| Power (off) | <1mA |

Notification display format:
```
┌────────────────────────┐
│  09:42 AM              │  ← time (small, top-left)
│                        │
│  ☕  Coffee time!       │  ← icon + message (large)
│                        │
│  — LOT                 │  ← attribution (small, bottom)
└────────────────────────┘
```

### 3.3 Camera — OV2640

| Parameter | Value |
|-----------|-------|
| Sensor | OV2640 |
| Resolution | 2MP (1600×1200) |
| Interface | DVP (8-bit parallel) |
| Module dimensions | 25mm × 24mm × 2.6mm |
| Aperture | f/2.0 |
| FOV | 60° |
| Focus | Fixed (0.3m–∞) |
| Power | 140mA (active), 20μA (standby) |

Camera use cases:
- QR code scan for device enrollment
- On-demand photo capture (LOT journal integration, future)
- User presence detection (wake-on-proximity, future)

### 3.4 Weather Sensor — Bosch BME280

| Parameter | Value |
|-----------|-------|
| Measurements | Temperature, humidity, barometric pressure |
| Temperature range | -40°C to +85°C (±0.5°C accuracy) |
| Humidity range | 0–100% RH (±3% accuracy) |
| Pressure range | 300–1100 hPa (±1 hPa) |
| Interface | I2C |
| Dimensions | 2.5mm × 2.5mm × 0.93mm |
| Current (normal mode) | 3.6μA |

The BME280 feeds directly into the LOT user profile:
- Overrides GeoNames weather API when device is present
- More accurate (hyperlocal, not city-level)
- Contributes to `showWeather` public profile field

### 3.5 Power System

**Battery:**
| Parameter | Value |
|-----------|-------|
| Capacity | 400mAh |
| Chemistry | Li-Po (LiPo) |
| Voltage | 3.7V nominal |
| Dimensions | 35mm × 28mm × 2.5mm |
| Cycle life | 500+ cycles |

**Wireless Charging (Qi):**
| Parameter | Value |
|-----------|-------|
| Standard | Qi 1.2.3 |
| Power | 5W |
| Receive IC | STWBC-EP (STMicroelectronics) |
| Coil | 35mm × 35mm flexible litz wire, 0.4mm thick |
| Efficiency | ~80% |
| Charge time (0→100%) | ~90 minutes |

**Battery Management IC: MCP73831 (Microchip)**
- Linear LiPo charger
- 4.2V charge voltage
- 400mA charge current
- Charge status LED (1× red/green bicolor, 0.8mm, edge-visible)

**Fuel Gauge: MAX17048 (Maxim)**
- I2C battery state-of-charge
- 1% accuracy
- Wake-on-low alert (GPIO interrupt)

**PMIC: TPS63020 (TI)**
- Buck-boost converter
- 3.3V regulated output from 3.0–5.5V input
- 2A output
- 94% efficiency at 100mA load

**Estimated battery life:**
| Mode | Current | Duration |
|------|---------|----------|
| Active (WiFi + display) | 180mA | ~2.2 hours |
| Notification standby (WiFi keep-alive) | 45mA | ~8.9 hours |
| Deep sleep (button wake only) | 8μA | ~5,000 hours |
| Typical daily use (2h active, 14h standby) | avg 62mA | ~6.5 hours |

Recommendation: charge nightly on the Qi pad.

### 3.6 Button — Copy Action

- Alps SKQUCAA010 tactile SMD switch
- 6mm × 6mm, 3.1mm height, 1.5N actuation force
- IP53 sealing via over-molded rubber boot
- Hardware debounce: 100nF capacitor + 10kΩ pull-up
- Firmware debounce: 50ms software window
- Short press (< 2s): Copy action → POST to `/api/device/log`
- Long press (> 5s): WiFi setup mode (captive portal)

### 3.7 Connectivity

- **USB-C port**: USB 2.0 OTG, firmware flashing, fallback wired charging
- **WiFi**: 802.11n 2.4GHz, WPA2/WPA3, integrated antenna in ESP32-S3 module
- **BLE 5.0**: future peer-to-peer sync, proximity wakeup

---

## 4. PCB Design

### 4.1 Board Specifications

| Parameter | Value |
|-----------|-------|
| Dimensions | 35mm × 35mm |
| Layers | 4 (signal / ground / power / signal) |
| Thickness | 0.8mm |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Min trace/space | 4/4 mil |
| Min drill | 0.2mm |
| Soldermask | Black |
| Silkscreen | White (Side B only) |

### 4.2 Layer Stack

| Layer | Purpose |
|-------|---------|
| L1 | Component + high-frequency signals |
| L2 | Ground plane (solid) |
| L3 | Power plane (3.3V + battery) |
| L4 | Low-frequency signals + USB |

### 4.3 Key Layout Decisions

- ESP32-S3 module: center of board
- OV2640 flex connector: top-right
- Display SPI connector: top-center (flex cable to Side B)
- BME280: near board edge (vented pocket in enclosure for airflow)
- Qi coil connector: bottom edge (routes to Side A coil)
- USB-C: bottom-center (mates with cutout in enclosure base)
- Battery connector: bottom-left (JST-SH 2-pin, 1.0mm pitch)

---

## 5. PCBWay Manufacturing Notes

### 5.1 PCB Fabrication Order

File package for PCBWay:
- `gerbers/` — all Gerber files (RS-274X format)
- `drill/` — Excellon drill file
- `bom.csv` — component BOM (PCBWay format)
- `cpl.csv` — centroid pick-and-place file
- `assembly-notes.pdf` — special instructions

PCBWay service: **PCB + SMT Assembly**
- 100 boards
- Components from PCBWay parts library where possible (reduces cost)
- Custom components supplied by buyer: OV2640 module, Qi coil

### 5.2 CNC Enclosure Order

File package for PCBWay CNC service:
- `enclosure-side-a.step` — STEP file for polished back
- `enclosure-side-b.step` — STEP file for functional front
- `enclosure-drawing.pdf` — GD&T engineering drawing

PCBWay CNC order:
- Material: 316L stainless steel
- Quantity: 100 pairs (200 pieces total)
- Surface finish Side A: Mirror polish (PCBWay code: MP)
- Surface finish Side B: #4 brushed (PCBWay code: SB4)
- Tolerance: ±0.05mm on display aperture, ±0.1mm general

PCBWay URL for CNC quote: https://www.pcbway.com/rapid-prototyping/manufacture/

### 5.3 Design for Manufacturing (DFM) Checklist

- [ ] All SMD components ≥ 0402 (0.4mm × 0.2mm)
- [ ] No components within 2mm of board edge (except connectors)
- [ ] Fiducial marks: 3× on top layer
- [ ] Test points: power rails + key signals
- [ ] Panelization: 3×3 per panel (9 boards) for cost efficiency
- [ ] Via-in-pad avoided (not supported by PCBWay standard service)
- [ ] Stencil included in Gerber package for solder paste

---

## 6. Wireless Charger — COSMO Pad

The COSMO Pad is the dedicated charging base for COSMO·01.

| Parameter | Value |
|-----------|-------|
| Dimensions | 80mm × 80mm × 8mm |
| Material | Brushed 304 stainless steel ring, matte black polycarbonate base |
| Standard | Qi 1.2.3 |
| Output | 5W (9V @ 555mA input) |
| Coil | 80mm transmit coil, ferrite backing |
| Input | USB-C, 9V/1A |
| Cable | 1.2m USB-C to USB-C, braided |
| LED indicator | Single white LED ring, dims after 30s |

The COSMO·01 sits polished-side-down on the pad. Automatic alignment via
magnetic guidance ring (4× N35 disc magnets, 3mm diameter, flush in pad surface
and device back).

---

## 7. IP Rating and Environmental

- IP53 (dust-protected, spray-resistant)
- Operating temperature: -10°C to +50°C
- Storage temperature: -20°C to +60°C
- Drop rating: 1.2m onto concrete (with rubber edge bumper in v2)
- Wireless charging works through up to 8mm of material

---

## 8. Notification Display System

### 8.1 Notification Types

| Code | Example | Icon |
|------|---------|------|
| `routine` | "Coffee time!" | ☕ |
| `movement` | "5-minute walk" | 🚶 |
| `hydration` | "Drink water" | 💧 |
| `breath` | "Breathe in for 4" | 🌬 |
| `memory` | "Journal check-in" | 📖 |
| `weather` | "Rain in 30min" | 🌧 |
| `custom` | User-defined | ✦ |

### 8.2 Display States

**Idle:** COSMO® logo mark, subtle pulse animation, battery indicator  
**Notification arrived:** Fade in message, hold 8 seconds, fade out  
**Copy press:** White flash, "Logged ✓" confirmation, return to idle  
**Charging:** Battery fill animation (ambient, low brightness)  
**Setup mode:** QR code for WiFi provisioning  
**Low battery (<10%):** Red border, "Charge me" message  

### 8.3 Screen Compression

In session-compressed mode (Vadik's specification), each display frame
encodes maximum information at minimum visual noise:
- No decorative borders
- Single notification per screen
- Time: top-left, 10pt
- Icon: 24×24px, centered-left
- Message: 14pt bold, centered
- Source attribution: "— LOT" bottom-right, 8pt

---

## 9. PDF Manual Structure

The COSMO·01 ships with a 2-page physical quick-start card (inside box) and
a digital PDF manual. See `COSMO-CIA-FIRMWARE.md` for firmware quick-start.

**PDF Manual: COSMO_01_Manual_EN.pdf**

| Section | Pages | Content |
|---------|-------|---------|
| Welcome | 1–2 | What is COSMO·01, brand story |
| In the Box | 3 | Contents checklist |
| Setup | 4–6 | Power on, WiFi setup, LOT account link |
| Notifications | 7–8 | Reading notifications, display guide |
| Copy Button | 9 | How Copy works, LOT Log tab |
| Weather | 10 | Sensor accuracy, profile integration |
| Charging | 11 | Qi pad use, charge times, battery care |
| Firmware Updates | 12 | OTA update process |
| Troubleshooting | 13–14 | Common issues, reset procedure |
| Technical Specs | 15 | Full spec table |
| Legal | 16 | FCC, CE, warranty, COSMO® / LOT® trademarks |

---

## 10. Regulatory Notes

For the 100-unit pilot run (non-commercial internal distribution):
- FCC Part 15 Class B intentional radiator (required for WiFi device)
- Submit FCC Form 731 via Telecommunication Certification Body (TCB)
- CE marking (EU): RED Directive 2014/53/EU
- Estimated certification cost: $4,000–$8,000 (FCC + CE combined)
- Timeline: 8–12 weeks (can run parallel to PCBWay production)

For v1 internal 100-unit run: use FCC Part 15 §15.103 exemption
(development/test units for internal use only, marked "NOT FOR SALE").

---

## 11. Version Roadmap

| Version | Target | Key Change |
|---------|--------|-----------|
| v1.0 | 2026-Q3 | 100-unit pilot, 8mm height, WiFi only |
| v1.5 | 2026-Q4 | OTA camera firmware, BLE pairing mode |
| v2.0 | 2027-Q1 | 5mm height, e-ink variant, cellular LTE-M option |
| v3.0 | 2027-Q3 | COSMO robotics node integration |

---

*COSMO® is a registered trademark of Kuzya Cosmo Marmeladov. LOT® is a
registered trademark of Vadim Marmeladov. All rights reserved.*
