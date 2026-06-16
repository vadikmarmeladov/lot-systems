# COSMO® CIA Device — PCB Specification v1.0

**Document:** PCB Fabrication & Layout Specification  
**Device:** COSMO® CIA v1  
**Date:** 2026-06-16  
**Revision:** 1.0  

---

## 1. Board Overview

| Parameter | Value |
|-----------|-------|
| Board dimensions | 39.0 × 39.0 mm (1mm smaller than enclosure for clearance) |
| Shape | Square, R1.0mm corner radius |
| Layers | 4 |
| Board thickness | 1.0 mm |
| Material | FR4 TG150 (high Tg for lead-free reflow) |
| Copper weight | 1 oz (35µm) outer layers / 0.5 oz (17µm) inner layers |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) — RoHS |
| Solder mask | Black, both sides |
| Silkscreen | White, top layer only |
| Min trace width | 4 mil (0.1mm) |
| Min clearance | 4 mil (0.1mm) |
| Min drill size | 0.2mm (laser) / 0.3mm (mechanical) |
| Min annular ring | 0.1mm |
| IPC class | Class 2 |
| Controlled impedance | Yes — 50Ω ± 10% for WiFi/BLE RF traces |
| Via type | Through-hole and blind (1-2 layer) |

---

## 2. Layer Stack-Up

```
Layer 1 (TOP)      — Signal + components
Layer 2 (INNER 1)  — Ground plane (GND, unbroken)
Layer 3 (INNER 2)  — Power plane (3.3V, 1.8V, VBAT islands)
Layer 4 (BOTTOM)   — Signal + components (minimal, mainly passives)
```

### 2.1 Impedance Control

| Net | Target Z | Trace width | Layer |
|-----|----------|-------------|-------|
| RF antenna (ESP32) | 50Ω | 0.2mm over GND | L1 |
| SPI (display) | 50Ω | 0.2mm over GND | L1 |
| I2C (sensors) | No control needed | 0.15mm min | L1 |

---

## 3. Component Placement

```
PCB Top View (39×39mm):

┌─────────────────────────────────────────┐
│                                         │
│    [ESP32-S3-MINI-1]    [OV2640 CAM]   │  ← Top third
│         (center)         (right)        │
│                                         │
│    [ST7789 Display]    [BME680]         │  ← Middle
│    (FPC connector,      (top-left)      │
│     bottom edge)                        │
│                          [LSM6DSOX]    │
│                                         │
│    [BQ25120A]  [STWLC33]  [BAT JST]   │  ← Bottom third
│    (left)       (center)   (right)      │
│                                         │
│    [Button]                             │  ← Bottom-right
│    (SW1, thru-hole)                     │
└─────────────────────────────────────────┘
         PCB BOTTOM:
         [Qi coil connector J5]
         [Misc decoupling]
```

---

## 4. Critical Routing Rules

### 4.1 ESP32-S3 RF

- Antenna area (2.4GHz ceramic chip antenna on module) must be **keep-out** below — no copper, no traces on L1/L2 in antenna projection area
- Module datasheet recommends 3mm clearance from module edge on antenna side

### 4.2 OV2640 Camera

- XCLK (20MHz) trace: keep short (< 15mm), route on L1, adjacent GND via stitching
- DVP data bus (D0–D7): matched length ± 2mm
- Avoid routing under ESP32 module

### 4.3 I2C Bus (BME680 + LSM6DSOX + BQ25120A)

- Pull-ups to 3.3V: 4.7kΩ on SDA and SCL
- Series termination: 22Ω on each line near MCU
- Max trace length: 50mm (bus shared, 400kHz)

### 4.4 Qi Coil

- STWLC33 coil input pins: short traces, wide (0.5mm min), copper pour around
- No signal traces under Qi coil area on any layer
- Ferrite sheet (external, applied during assembly) on top of coil

### 4.5 Power Rails

| Rail | Source | Consumers | Note |
|------|--------|-----------|------|
| VBAT (3.7V nom) | LiPo | BQ25120A, STWLC33 | Wide traces 0.5mm |
| 3.3V | BQ25120A LDO | ESP32, sensors, display | 0.3mm traces |
| 1.8V | BQ25120A LDO | OV2640, LSM6DSOX | 0.2mm traces |
| VLED | 3.3V + GPIO | RGB LED | 100Ω series |

---

## 5. Mounting

- 4× M1.2 mounting holes (Ø1.4mm clearance), 3mm from each corner
- Mounting holes: no copper pad (isolated from all nets)
- 0.5mm PCB-to-enclosure clearance on all sides (39mm PCB in 40mm pocket)

---

## 6. PCBWay Fabrication Checklist

- [ ] Gerber files: all layers + drill (Excellon 2 format)
- [ ] BOM: LCSC part numbers where possible (for PCBA)
- [ ] Pick-and-place file (centroid / CPL)
- [ ] Fab notes: specify ENIG, IPC Class 2, TG150, black SM
- [ ] Impedance note: 50Ω controlled on specified nets, stackup confirmed
- [ ] Laser drill for vias < 0.3mm
- [ ] V-score or no (square board, 39×39mm, no panel needed for 100 units — PCBWay will panel internally)
- [ ] 120 pieces ordered (20 extra spares)

**PCBWay PCB Order URL:** https://www.pcbway.com/orderonline.aspx  
**PCBWay Impedance Calculator:** https://www.pcbway.com/pcb_impedance_calculator.html  

---

## 7. Design Software

| Tool | Purpose |
|------|---------|
| KiCad 7.x | Schematic + PCB layout |
| FreeCAD (KiCad STEP export) | 3D model for enclosure fit check |
| KiCad DRC | Design rule check before Gerber export |
| PCBWay DFM check | Online DFM check before order |

---

*Document: PCB-SPEC-v1.md*  
*Generated: 2026-06-16*  
*© 2026 LOT Systems Corporation / COSMO® CIA*
