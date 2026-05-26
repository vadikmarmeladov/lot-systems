# COSMO LOT Computer — PCB Design Guide
## PCBWay Order Checklist & KiCad Design Rules

**Project:** COSMO® CIA LOT Computer  
**PCB Revision:** r1  
**Date:** 2026-05-26  
**Fabrication partner:** PCBWay

---

## 1. PCBWay Order Summary

**Order URL:** [pcbway.com/QuotePCBA.aspx](https://www.pcbway.com/QuotePCBA.aspx)

| Parameter | Value |
|---|---|
| Board type | Multi-layer PCB + PCBA (turn-key assembly) |
| Layers | 4 |
| Board size | 37 mm × 37 mm |
| Thickness | 0.8 mm |
| Quantity | 100 boards |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Black (both sides) |
| Silkscreen | White (top side only) |
| Copper weight | 1 oz (35µm) outer layers, 0.5 oz inner |
| Min trace width | 0.1 mm (4 mil) |
| Min trace spacing | 0.1 mm (4 mil) |
| Min drill | 0.2 mm |
| Via finish | Resin-filled, copper-capped (IPC-4761 Type VII) |
| Controlled impedance | Yes — 50 Ω on camera DVP lines |
| X-ray inspection | Yes (for BGA/LGA components) |
| AOI | Yes (both sides) |
| Flying probe test | Yes |
| IPC class | IPC Class 2 |

---

## 2. Stackup (4-Layer)

```
─────────────────────────────────────
  Layer 1 (Top)    1 oz Cu — Signal + RF + SMD components
─────────────────────────────────────
  Prepreg (FR4)    0.1 mm
─────────────────────────────────────
  Layer 2          0.5 oz Cu — Ground plane (solid pour)
─────────────────────────────────────
  Core (FR4)       0.5 mm
─────────────────────────────────────
  Layer 3          0.5 oz Cu — 3.3V power plane
─────────────────────────────────────
  Prepreg (FR4)    0.1 mm
─────────────────────────────────────
  Layer 4 (Bot)    1 oz Cu — Signal + battery connectors + Qi coil area
─────────────────────────────────────
Total: 0.8 mm
```

**Layer assignments:**
- **L1 (Top):** Signal traces, RF module, display SPI, camera DVP, sensor I2C, button, LED
- **L2:** Full copper ground pour (GND reference for RF + signal integrity)
- **L3:** 3.3V power pour + 1.8V isolated island (camera)
- **L4 (Bot):** Battery connector, USB-C, remaining signals; Qi coil traces (no power pour in coil area)

---

## 3. Component Placement Map

```
  37mm × 37mm PCB (top view)
  
  ┌─────────────────────────────────────────┐
  │  [Camera OV2640]                        │ ← top-right, 8×8mm
  │                                         │
  │          [ESP32-S3-MINI-1U]             │ ← center
  │           15.4×11.4mm                  │
  │                                         │
  │  [OLED display FPC ZIF]                 │ ← center-left
  │                                         │
  │  [BME688] [VEML7700] [BMI270] [MIC]     │ ← bottom row, spread
  │                                         │
  │  [BQ25185]   [TPS62840]  [TPS62740]     │ ← power row
  │                                         │
  │  [Button]   [DRV2605L]  [RGB LED]       │ ← front-panel row
  │                            [USB-C]   ─── │ ← bottom edge
  └─────────────────────────────────────────┘
  
  Bottom side:
  ┌─────────────────────────────────────────┐
  │                                         │
  │      [Qi coil connection pads]          │ ← 20×20mm center-bottom
  │      [JST PH-2 battery connector]       │ ← left
  │      [NU1619 Qi RX IC]                  │ ← adjacent to coil pads
  │                                         │
  └─────────────────────────────────────────┘
```

---

## 4. Critical Design Rules

### RF Keep-Out (ESP32-S3 Antenna)

```
Keep-out zone around ESP32-S3-MINI-1U antenna area:
- 15 mm clearance from module edge (top of board)
- NO copper pour, no traces, no vias in keep-out
- ESP32 module placed ≥ 3 mm from board edge
- U.FL connector for external chip antenna on PCB edge
```

### Camera DVP Lines (Controlled Impedance)

```
Camera data lines D0–D7 + PCLK:
- Target impedance: 50 Ω single-ended
- Trace width: ~0.18 mm on L1 with L2 GND reference
- Match all D0–D7 lengths to within ±5 mm
- No right-angle bends; use 45° chamfers
- Series termination resistors: 33 Ω on each line, placed near ESP32
```

### Power Planes

```
3.3V plane (L3):
- Solid pour from TPS62840 output
- Split island for 1.8V camera rail (TPS62740)
- Keep 1.8V island isolated from 3.3V plane with 0.5 mm gap
- Decoupling: 100nF + 10µF X5R at each IC power pin

Qi coil area (L4):
- No copper pour in 22×22mm coil footprint area
- Coil pads on L4 only; use blind vias if connecting to top
```

### BME688 Sensor Placement

```
- Place near edge of PCB adjacent to ventilation slot in stainless shell
- Solder mask opening below sensor (allows air flow to sensor port)
- No heat-generating components within 5 mm (avoid false temp readings)
- Decoupling: 100nF directly at VDD pin
```

### USB-C (Edge-Mount)

```
- Mid-mount connector (GCT USB4105): PCB edge slot 6.6mm wide
- USB 2.0 signals: 90 Ω differential pair
- Place 5.1 kΩ CC resistors to GND (sets device as Sink, 5V/1A)
- ESD protection: PRTR5V0U2X dual rail clamp at connector
```

---

## 5. KiCad Design Checklist

### Schematic

- [ ] ESP32-S3-MINI-1U symbol with all 56 pins mapped
- [ ] All decoupling capacitors placed on schematic (not added ad hoc in layout)
- [ ] Power flags on all power nets (suppress ERC warnings correctly)
- [ ] I2C pull-ups: 4.7 kΩ to 3.3V on SDA/SCL (one set for sensor bus)
- [ ] BMI270 INT1 → GPIO37 with 10 kΩ pull-down (active high interrupt)
- [ ] Button: GPIO38 with 10 kΩ pull-up, 100nF RC debounce filter
- [ ] USB-C: CC1/CC2 resistors to GND (5.1 kΩ each)
- [ ] Battery connector: polarity protection diode + reverse-polarity clamp
- [ ] BQ25185: PROG resistor for charge current (1A = 3.3 kΩ)
- [ ] LED current limiting resistors (33 Ω each R/G/B for 3.3V)

### Layout

- [ ] DRC passes with no errors
- [ ] All courtyard clearances respected
- [ ] No acid traps (90° angle traces)
- [ ] Via stitching on GND pour (every ~3 mm in RF area)
- [ ] Thermal relief on power pads (ENIG pads need good solder reflow)
- [ ] Fiducial marks: 3× on top side (for pick-and-place machine)
- [ ] Tooling holes: 4× M1.6 (1.8 mm drill) at corners
- [ ] Board edge: rounded corners 1mm radius

### Files to Generate

- [ ] Gerber files (RS-274X): GTL, GBL, GTS, GBS, GTO, GBO, GKO (edge cuts)
- [ ] Drill file (Excellon format, separate for PTH and NPTH)
- [ ] BOM (CSV with LCSC part numbers)
- [ ] CPL (centroid/pick-and-place file: refdes, x, y, rotation, side)
- [ ] Assembly drawing PDF (component IDs on top view)
- [ ] Board outline DXF (for PCBWay CNC alignment)

---

## 6. Gerber Layer Reference

| Layer | KiCad filename | Gerber name | PCBWay label |
|---|---|---|---|
| Top copper | F.Cu | .GTL | Top Layer |
| Bottom copper | B.Cu | .GBL | Bottom Layer |
| Inner 1 (GND) | In1.Cu | .G2 | Inner Layer 1 |
| Inner 2 (PWR) | In2.Cu | .G3 | Inner Layer 2 |
| Top solder mask | F.Mask | .GTS | Top Solder Mask |
| Bottom solder mask | B.Mask | .GBS | Bottom Solder Mask |
| Top silkscreen | F.Silkscreen | .GTO | Top Silk Screen |
| Board edge | Edge.Cuts | .GKO | Board Outline |
| Drill (PTH) | — | .DRL | Drill File (PTH) |
| Drill (NPTH) | — | -NPTH.DRL | Drill File (NPTH) |

---

## 7. PCBA BOM Format for PCBWay

Upload BOM as Excel/CSV with these columns:

```
Column A: Reference Designator (e.g. "U1, U2")
Column B: Quantity
Column C: Part Name/Description
Column D: Package/Footprint
Column E: LCSC Part Number  ← PCBWay prefers LCSC for sourcing
Column F: Manufacturer
Column G: Manufacturer Part Number
Column H: Notes (e.g. "Do Not Populate" for hand-install parts)
```

**Mark as DNP (Do Not Populate) in PCBA BOM:**
- OLED display (FPC hand-connect after PCB assembly)
- Camera module (hand-placed)
- Battery JST connector (hand-solder)
- Qi coil (hand-solder)

---

## 8. PCBWay PCBA Upload Checklist

1. [ ] Create account at pcbway.com
2. [ ] Start PCBA quote: PCB + assembly
3. [ ] Upload Gerber ZIP (all layers + drill)
4. [ ] Upload BOM (Excel with LCSC part numbers)
5. [ ] Upload CPL (centroid file)
6. [ ] Specify: Quantity = 100, Lead-free (HASL/ENIG), 4-layer
7. [ ] Request: X-ray inspection + AOI
8. [ ] Add note: "Ventilation slot 1×2mm on right edge — see assembly drawing"
9. [ ] Confirm DFM review before production
10. [ ] Lead time: ~15 business days for PCBA

---

## 9. Test Points

Include testpoint pads for production QC:

| TestPoint | Net | Location |
|---|---|---|
| TP1 | VCC 3.3V | Top-left corner |
| TP2 | GND | Adjacent to TP1 |
| TP3 | VBAT | Near JST connector |
| TP4 | ESP32 TX0 | Near ESP32 module |
| TP5 | ESP32 RX0 | Near ESP32 module |
| TP6 | I2C SDA | Sensor bus |
| TP7 | I2C SCL | Sensor bus |

Test point pad: 1.0 mm diameter, bare copper (no solder mask)

---

*COSMO® CIA — LOT Systems — PCB Design Guide v1.0 — 2026-05-26*
