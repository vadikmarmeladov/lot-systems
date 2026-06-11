<!--
  LOT SYSTEMS CORPORATION
  LOT Computer — Physical Design Specification v1.0
  2026-06-11
-->

# LOT Computer — Physical Design Specification
## PHYSICAL-DESIGN-v1.0 | 2026-06-11

**Classification:** Internal — Mechanical Engineering
**Status:** Design Phase / Ready for CAD

---

## 1. Form Factor Overview

```
TOP VIEW (Front face — Side B)
┌─────────────────────────────────────────┐
│  R3                                  R3  │
│                                          │
│     ┌──────────────────────────┐         │
│     │                          │         │
│     │      OLED SCREEN         │         │  ← 31×16mm window
│     │      128×64 pixels       │         │
│     │                          │         │
│     └──────────────────────────┘         │
│                                          │
│   ◉                           [■]        │
│  cam                        button       │  ← camera (left) + button (right)
│                                          │
│              [·]                         │  ← LED indicator (center)
│                      ══════              │  ← USB-C (right edge)
│  R3                                  R3  │
└─────────────────────────────────────────┘
        40.0mm × 40.0mm

SIDE VIEW
┌─────────────────────────────────────────┐  ← Back plate (mirror)  0.5mm
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Qi coil + ferrite    0.5mm
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Battery LP320340     3.2mm
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← PCB (4-layer, 1mm)   1.0mm
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Components (SMD max) 1.0mm
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Frame walls          ─────
└─────────────────────────────────────────┘  ← Front glass/body     ─────
                ←  5.2mm total →
```

---

## 2. Dimensional Specification

### 2.1 Outer Body

| Dimension | Value | Tolerance |
|-----------|-------|-----------|
| Width | 40.0 mm | ±0.1 mm |
| Height | 40.0 mm | ±0.1 mm |
| Depth | 5.2 mm | ±0.2 mm |
| Corner radius (external) | R3.0 mm | ±0.2 mm |
| Corner radius (internal) | R2.5 mm | ±0.2 mm |
| Weight (estimated) | ~35 g | — |

### 2.2 Internal Cavity

| Dimension | Value |
|-----------|-------|
| Internal width × height | 39.0 × 39.0 mm |
| Internal depth | 4.0 mm (between plate inner surfaces) |
| Camera bump inner depth | +1.5 mm (bump extends back face outward) |
| PCB mounting standoffs | 4× M1.0, 1.0mm height, at corners minus 3mm |

### 2.3 Wall & Plate Thickness

| Element | Thickness |
|---------|-----------|
| Side walls (frame) | 0.5 mm |
| Front lip (bezel) | 0.8 mm |
| Back plate (mirror) | 0.5 mm |
| Screen window (sapphire) | 0.5 mm |

---

## 3. Material Specification

### 3.1 Body Frame

| Property | Value |
|----------|-------|
| Material | Stainless Steel 316L |
| Hardness | HRB 80–90 |
| Yield strength | 170–310 MPa |
| Tensile strength | 485–690 MPa |
| Corrosion resistance | Excellent (marine grade) |
| Surface finish | #400 bead blast (front face); all other faces degreased + passivated |
| Magnetic | Non-magnetic (austenitic) |

316L selected over 304 for:
- Superior corrosion resistance (sweat, skin contact)
- Better polishability for mirror back plate
- Medical-grade (skin-safe, no nickel sensitization risk at surface)

### 3.2 Back Plate (Mirror)

| Property | Value |
|----------|-------|
| Material | Stainless Steel 316L |
| Post-process | Mechanical polish (#2000 grit) → electropolish → buff |
| Reflectance | ≥92% specular @ 550nm |
| Surface roughness | Ra ≤ 0.05 μm |
| Fingerprint resistance | None (bare metal) — add note in Quick Start |

### 3.3 Screen Window

| Property | Value |
|----------|-------|
| Material | Synthetic sapphire (Al₂O₃) |
| Hardness | Mohs 9 |
| Transmission | ≥95% @ 400–700nm |
| AR coating | Single-side, broadband visible |
| Size | 31.0 × 16.0 × 0.5 mm |
| Edge finish | Polished |

---

## 4. Feature Details

### 4.1 OLED Screen Window

```
Position: Centered horizontally, y=8mm from top edge
Window size: 31.0 × 16.0 mm (rectangular cutout)
Sapphire glass: 31.0 × 16.0 × 0.5 mm, UV-bonded
Recess depth: 0.2 mm (glass sits 0.2mm below bezel surface)
OLED active area: 29.4 × 14.7 mm
Gap (OLED → glass): 0.3 mm air gap
```

### 4.2 Camera Lens Port

```
Position: x=8mm from left, y=8mm from bottom (front face)
Lens port inner diameter: 7.7 mm
Bump height above face: 1.5 mm
Bump outer diameter: 9.5 mm
Lens thread: M8×0.5 (internal)
Camera sits on PCB at center of bump
Focus distance: 20cm → infinity (fixed focus wide-angle)
```

### 4.3 COPY Button

```
Position: x=8mm from right, y=8mm from bottom (front face)
Button port diameter: 9.0 mm
Actuator cap: SS316L disc, 8.0mm dia, 0.3mm travel
Cap finish: Match front face bead blast
Tactile switch: C&K KXT332LHS under cap
Spring force: 180gf
Long press (>2s): Enter pairing mode
Single press: COPY current notification → LOT Log
Double press: Next notification
```

### 4.4 LED Indicator Port

```
Position: Center x, y=5mm from bottom
Lens: Sapphire disc 2.2mm dia, 1.0mm thick, press-fit
LED: 0805 green SMD, fiber-guided
Meanings:
  Breathing green (1s period): Charging
  Solid green: Charge complete
  Single flash: Action confirmed (COPY sent)
  Triple flash: New notification arrived
  Red flash: Error / no network
  Off: Normal operation
```

### 4.5 USB-C Port

```
Position: Right edge center, flush-mount
Slot dimensions: 10.0 × 4.0 mm cutout in frame
Connector: TYPE-C-31-M-12 mid-mount
Use: Factory flashing, emergency charge only
Normal-use: Covered by silicone dust plug (included in box)
```

### 4.6 Fasteners

```
4× M1.2×3mm countersunk flat-head screws, SS316
Position: 4 corners, 3mm from each edge
Back plate countersink: 90°, flush with plate outer surface
Frame threaded inserts: M1.2 tapped directly in SS316L
Torque: 0.05 N·m (0.44 in·lbf)
```

---

## 5. PCB Mounting

```
PCB size: 38.0 × 38.0 mm (1mm clearance each side)
PCB thickness: 1.0 mm
Standoffs: 4× M1.0×1.0mm brass (PCB corner holes: 1.1mm dia)
Standoff positions: 3mm from PCB corners
Component side: Faces front (toward screen/camera/button)
Solder side: Faces back (toward battery/coil)
```

### PCB Layer Stack (4-layer, 1.0mm)

| Layer | Name | Use |
|-------|------|-----|
| L1 (top) | Signal + components | ESP32, sensors, OLED, power |
| L2 | GND plane | Solid ground |
| L3 | Power plane | 3.3V, VBAT |
| L4 (bottom) | Signal + RF | Antenna trace, I2C, DVP |

---

## 6. Internal Component Stack

Reading from back (mirror side) to front:

```
Back plate (SS316L mirror, 0.5mm)
  ↓ IP52 gasket (silicone, 0.3mm)
Qi coil (flex PCB, 0.2mm) + ferrite sheet (0.1mm)  = 0.3mm
Battery LP320340 (3.2mm) secured with adhesive foam
PCB (1.0mm, component side down)
  Components max height: 3.1mm from PCB (ESP32 module height from solder)
  Typical component heights: 1.0–1.5mm for ICs
Front face of frame (flush with component top)
  ↓
Screen glass (sapphire, 0.5mm)
Front lip of frame (0.8mm bezel)
```

Total internal stack: 0.5 (coil) + 3.2 (batt) + 1.0 (PCB) + ~0.5 (comp avg) = 5.2mm
Allows 3mm of margin for adhesive, foam, and wiring.

---

## 7. Antenna Clearance

The ESP32-S3-WROOM-1 has a built-in PCB antenna at the front edge of the module.

**Critical:** Antenna end of module must be:
- ≥3mm clearance from any metal (frame, battery, coil)
- Oriented toward front of device (away from mirror back)
- Module placed at center-top of PCB so antenna extends toward screen window

If antenna clearance cannot be maintained, use ESP32-S3-WROOM-1U variant with U.FL connector and route to external Molex chip antenna (see BOM D2) positioned at top center of PCB.

---

## 8. Thermal Considerations

- ESP32-S3 active: ~0.85W typical
- BME688: Temperature sensor — must be isolated from ESP32 heat
  - Place BME688 minimum 5mm from ESP32
  - Thermal via fence if needed
- Battery: Keep below 45°C during charge
- Wireless charging: STWLC38 max case temp 85°C — thermal pad to frame
- Overall case temperature: max 38°C on external surface during Qi charge

---

## 9. IP Rating — IP52

| Code | Meaning |
|------|---------|
| IP5x | Dust protected (limited ingress, no harmful deposit) |
| IPx2 | Protected against dripping water (15° tilt, 10 min) |

Sealing method:
- SS316L frame + back plate: silicone gasket (0.3mm × 1mm cross-section)
- Screen window: UV-cure optical adhesive (waterproof bond)
- Camera lens: Thread sealant (Loctite 222)
- Button: Silicone actuator boot (custom molded, 0.3mm wall)
- USB-C: Silicone dust plug included (not sealed for use)
- LED port: Sapphire disc + UV adhesive

---

## 10. Manufacturing Notes for PCBWay CNC

```
Drawing format: STEP (AP214) + PDF 2D drawing
Material callout: SS316L (UNS S31603)
Tolerances (unless noted): ±0.1mm
Threads: M1.2×0.25 per ISO 68-1
Surface finish (frame): 400 grit bead blast (#4 finish equivalent)
Surface finish (back plate): Mirror polish Ra≤0.05μm
Passivation: Per ASTM A967 (citric acid passivation)
Marking: Laser engrave on back plate inner surface:
  "LOT® LCM-[SERIAL] | lot-systems.com | Made in USA"
Qty: 100 frames + 100 back plates (order separately)
```

---

*LOT COMPUTER PHYSICAL DESIGN v1.0 — COMPLETE*
*© 2026 LOT Systems. All rights reserved.*
