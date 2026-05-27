# COSMO Computer — Wireless Charger Specification
**Document:** 08-CHARGER-SPEC  
**Revision:** A  
**Date:** 2026-05-27  

---

## 1. Overview

The **COSMO Charger** is a LOT-branded Qi wireless charging pad designed to complement the COSMO Computer. It charges the device through the thinned mirror-polished stainless steel back shell.

---

## 2. Charger Specification

| Parameter | Value |
|-----------|-------|
| Standard | Qi v1.3 |
| Output power | 5W (5V / 1A to device) |
| Input | USB-C, 5V/2A (10W max input) |
| Coil frequency | 100–205 kHz |
| Charging distance | 0–5 mm (through stainless back shell) |
| Temperature protection | Cut-off at 45°C |
| Foreign object detection | Yes (Qi standard FOD) |
| Indicator | LED ring (ambient white glow) |
| Dimensions | 90 × 90 × 8 mm |
| Material | Anodised 6061 aluminium |
| Color | Silver (matches COSMO Computer) |
| Cable | USB-C, 1 m, braided |
| Weight | ~120 g |

---

## 3. Physical Design

```
Top view:
┌─────────────────────────────────┐
│                                 │
│         ┌──────────┐            │
│         │          │  ← 50mm   │
│         │  Qi pad  │  circle   │
│         │  area    │            │
│         └──────────┘            │
│       ·  ·  ·  ·  ·  ·         │  ← LED ring (ambient)
│                                 │
└─────────────────────────────────┘
         ↑
   USB-C on back edge

Side profile (8mm):
┌─────────────────────────────────┐
│ Anodised aluminium top          │ 1mm
│ Qi TX coil (30mm diameter)      │ 3mm
│ PCB + TX IC                     │ 2mm
│ Rubber base (anti-slip)         │ 2mm
└─────────────────────────────────┘
```

---

## 4. Charger PCB Schematic (Block Diagram)

```
USB-C ──► ESD TVS ──► PD Trigger (5V/2A) ──► Qi TX IC ──► Coil (100–205 kHz)
                                               (XKT-335)
                                                   │
                                               FOD Logic ──► LED Driver
                                                   │              │
                                               Temp Sensor     LED Ring
                                               (NTC 10kΩ)
```

### Key ICs

| IC | Part | Function |
|----|------|----------|
| U1 | XKT-335 | Qi Wireless Power Transmitter IC |
| U2 | HUSB311 | USB-C PD sink trigger (selects 5V/2A profile) |
| U3 | WS2812B-Mini | RGB LED controller for indicator ring |
| R1 | NTC 10kΩ | Temperature monitoring |

---

## 5. LED Indicator States

| LED State | Meaning |
|-----------|---------|
| Slow white pulse (1 Hz) | Idle, ready to charge |
| Solid white (bright) | Charging in progress |
| Solid white (dim) | Charging complete |
| Slow orange pulse | Foreign object detected |
| Red blink | Error / overtemperature |

---

## 6. Qi Compatibility Note

The COSMO Computer's back shell is thinned to **0.3 mm** in the Qi window area. At this thickness, 316L stainless steel has acceptable eddy current losses for 5W Qi charging. Verified reference: Qi specification allows metallic enclosures with wall thickness < 0.5 mm in the charging zone.

**Eddy current loss estimate:**
- 316L SS resistivity: ~74 µΩ·cm
- Wall thickness: 0.3 mm
- At 150 kHz: estimated 8–12% loss due to eddy currents
- Effective charging efficiency at device: ~68–74% (vs ~82% for no metal)
- Charge time impact: +15–20% longer than without metal (95 min vs 80 min)

---

## 7. Placement Guide

```
 COSMO Computer
 ┌────────────────┐
 │ ← Side A      │  ← Place this face DOWN on charger
 │ (polished back │
 │  with Qi       │
 │  window)       │
 └────────────────┘
         │
  Place centred on:
         │
 ┌───────▼────────┐
 │   COSMO Charger │
 │    (pad face)   │
 └────────────────┘

Alignment: The COSMO Computer's Qi coil is centred.
Place the device centred on the pad for best efficiency.
Offset tolerance: ±8 mm (Qi alignment factor > 0.7 within this range)
```

---

## 8. Charger BOM (Per Unit)

| Component | Part | Supplier | Unit Cost |
|-----------|------|----------|-----------|
| Qi TX IC | XKT-335 | LCSC | $1.20 |
| USB-C PD trigger | HUSB311 | LCSC | $0.85 |
| Qi TX coil (50mm dia) | MCOIL-50-6T | Wurth/LCSC | $2.40 |
| LED ring (6× WS2812B-Mini) | WS2812B-Mini ×6 | LCSC | $1.08 |
| NTC 10kΩ thermistor | NTCG103JF103 | Mouser | $0.25 |
| Charger PCB (2-layer, 80×80mm) | PCBWay | PCBWay | $1.20 |
| Anodised aluminium enclosure | CNC 6061 Al | PCBWay CNC | $8.00 |
| Anti-slip rubber base | Custom laser cut | Local | $0.35 |
| USB-C cable 1m braided | Generic | AliExpress | $1.50 |
| Misc passives | Various | LCSC | $0.60 |
| Packaging | Kraft box | Custom print | $0.80 |
| **Total per charger** | | | **$18.23** |

---

*Document: 08-CHARGER-SPEC.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
