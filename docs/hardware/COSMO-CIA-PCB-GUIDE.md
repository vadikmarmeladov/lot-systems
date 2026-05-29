<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — PCB Design Guide (PCBWay)

**Document:** COSMO-CIA-PCB-GUIDE.md
**Version:** 1.0.0
**Prepared:** May 29, 2026
**EDA Tool:** KiCad 8.x
**Manufacturer:** PCBWay

---

## 1. PCB Overview

| Attribute         | Value                            |
|------------------|----------------------------------|
| Board dimensions  | 36.0 × 36.0 mm                  |
| Layer count       | 4                                |
| Board thickness   | 0.8 mm                           |
| Material          | FR4, Tg 150                      |
| Surface finish    | ENIG (Electroless Nickel/Gold)   |
| Copper weight     | Outer: 1 oz (35 µm), Inner: 0.5 oz |
| Min trace width   | 4 mil (0.1 mm)                   |
| Min spacing       | 4 mil (0.1 mm)                   |
| Min drill size    | 0.2 mm (laser via)               |
| Min annular ring  | 4 mil                            |
| Solder mask       | LPI, both sides, green or black  |
| Silkscreen        | White, both sides                |
| Via tenting       | Yes (IPC-4761 Type VII)          |

---

## 2. Layer Stack

```
Top copper     (signal + components)     1 oz
Prepreg        0.2 mm
Inner L2       (GND plane)              0.5 oz
Core           0.4 mm
Inner L3       (3.3V power plane)       0.5 oz
Prepreg        0.2 mm
Bottom copper  (signal + Qi coil)        1 oz
───────────────────────────────────────
Total:                                  ~0.8 mm
```

**Layer assignments:**

| Layer | Use                                                              |
|-------|------------------------------------------------------------------|
| TOP   | Components, SPI traces (display), USB-C, button, buzzer         |
| L2    | Solid GND pour — uninterrupted under ESP32-S3 antenna keepout   |
| L3    | 3.3V power plane (poured copper, star topology from LDO output) |
| BOT   | Camera FPC connector, Qi RX coil traces, battery connector      |

---

## 3. Component Placement

### Top Side

```
36mm
┌────────────────────────────────────┐
│  [USB-C]          [ESP32-S3]       │  ← right side: ESP32 antenna near edge
│                                    │
│  [BUTTON]  [BUZZER]                │
│                                    │
│  [SSD1351   [BME280]  [BQ25895]    │
│   FPC CON]                         │
│                                    │
│  [LiPo Connector] [3.3V LDO]       │
└────────────────────────────────────┘
```

### Bottom Side

```
┌────────────────────────────────────┐
│  [OV2640 FPC CON]                  │
│                                    │
│  [Qi RX coil pad area 20×20mm]     │
│  (coil attached with adhesive,     │
│   not soldered)                    │
│                                    │
│  [ESD protection array]            │
└────────────────────────────────────┘
```

---

## 4. Critical Design Rules

### 4.1 ESP32-S3 Antenna Keepout

The ESP32-S3-MINI-1 has an onboard PCB trace antenna. Do NOT place copper (any layer) within the antenna keepout zone defined in the Espressif module footprint (approximately 3.6 × 11.5 mm at the module corner facing the PCB edge).

**Rule:** Antenna keepout in KiCad → Board Setup → Design Rules → add keepout zone from Espressif reference schematic.

The stainless steel body front shell must have a 2 mm window or slot on the edge closest to the ESP32 antenna to prevent RF shielding. This slot is hidden in the brushed side finish and is not visible from front.

### 4.2 SPI Display Traces

The SSD1351 SPI runs at up to 20 MHz. Trace requirements:
- Route as matched-length 50 Ω controlled impedance on TOP layer
- Keep MOSI, CLK, CS, DC traces parallel, same length (±2 mm)
- No 90° bends — use 45° chamfers
- Route away from switching power lines (BQ25895 PWM output)

### 4.3 Camera DVP Bus

The OV2640 DVP bus (D0–D7, PCLK, VSYNC, HREF) runs up to 24 MHz:
- Route on BOTTOM layer (short FPC stub to connector, then bottom traces to ESP32 vias)
- Keep all DVP traces same length (±5 mm tolerance for 24 MHz)
- No vias in the middle of DVP traces — go bottom to vias at ESP32 pads
- Route XCLK (20 MHz clock output from ESP32) away from PCLK input

### 4.4 I²C Bus (BME280 + BQ25895)

- 10 kΩ pull-ups to 3.3V (use 4.7 kΩ if running 400 kHz fast mode)
- Keep traces short and together (SDA + SCL in parallel, <50 mm total)
- No other signals routed between SDA/SCL traces

### 4.5 Power Planes

- 3.3V LDO (AP2112K): place 10 µF + 100 nF decoupling at both input and output, <2 mm from LDO pads
- BQ25895 PWM switching node: place 4.7 µH inductor and 10 µF output cap in tight loop, minimize area
- Battery positive and negative traces: 40 mil (1 mm) width minimum for up to 500 mA charge current

### 4.6 ADC Battery Sense

- Route VBAT_ADC trace (GPIO14) with 100 nF bypass cap to GND at GPIO pad
- Resistor divider (2 × 100 kΩ, ±1%) placed near ESP32 ADC pin
- Shield trace from switching noise — route on inner GND layer side

### 4.7 Ground Plane

- L2 GND must be solid copper pour with no islands
- All component GND pads connect to L2 via multiple vias (stitching)
- Chassis ground (USB-C shield) connected to GND plane via 1 nF + 1 MΩ parallel combination (EMI filter)
- Qi coil GND return path: direct to L2 GND via low-impedance pour, not through signal layers

---

## 5. Thermal Management

The BQ25895 PMIC generates ~0.3 W during charging. Thermal measures:
- Exposed pad (EP) soldered to 4-layer thermal via array (2 × 2 grid, 0.3 mm vias)
- Bottom copper pour under PMIC for heat spreading
- No other heat-sensitive components (LiPo connector) within 5 mm of PMIC

---

## 6. DFM (Design for Manufacture) Rules

| Rule                                     | Spec                         |
|------------------------------------------|------------------------------|
| Pad to board edge                        | ≥0.3 mm                      |
| Via to pad clearance                     | ≥0.1 mm                      |
| Via to via clearance                     | ≥0.3 mm (center to center)   |
| Fiducial marks                           | 3 × 1 mm circle, TOP + BOT   |
| Test points                              | 1 mm pad per power rail, UART|
| Component to edge clearance (top)        | ≥1.5 mm                      |
| SMD pad to courtyard                     | ≥0.1 mm                      |
| Solder paste area                        | Stencil aperture = 90% of pad|

---

## 7. Gerber Export (KiCad → PCBWay)

Generate the following files from KiCad 8 (File → Fabrication Outputs → Gerbers):

| File               | Layer                  | Extension |
|-------------------|------------------------|-----------|
| TOP copper        | F.Cu                   | .GTL      |
| L2 GND            | In1.Cu                 | .G2       |
| L3 Power          | In2.Cu                 | .G3       |
| BOT copper        | B.Cu                   | .GBL      |
| TOP soldermask    | F.Mask                 | .GTS      |
| BOT soldermask    | B.Mask                 | .GBS      |
| TOP silkscreen    | F.Silkscreen           | .GTO      |
| BOT silkscreen    | B.Silkscreen           | .GBO      |
| Board outline     | Edge.Cuts              | .GKO      |
| Drill file        | Excellon               | .DRL      |

Compress all files to `CIA_PCB_v1.0_Gerbers.zip` before uploading to PCBWay.

**PCBWay upload steps:**
1. Go to https://www.pcbway.com → PCB Instant Quote
2. Upload `CIA_PCB_v1.0_Gerbers.zip`
3. Set: 4 layers, 36×36mm, 0.8mm, ENIG, LPI solder mask (black), 150 qty
4. Check: "Impedance Control" → 50Ω target → upload layer stack
5. Notes field: "FPC ZIF connector on bottom side — ensure adequate clearance on bottom paste stencil. No IPC Class 3 required."

---

## 8. PCBA (SMT Assembly) via PCBWay

Upload alongside Gerbers:
- **BOM CSV** — part number, description, qty, footprint, value, supplier P/N
- **CPL (centroid) CSV** — reference, X, Y, rotation, layer (TOP/BOT)

PCBWay will source components from their inventory or from Digi-Key/Mouser using the P/Ns in the BOM. Confirm all parts are in-stock before approving assembly.

**Assembly notes for PCBWay:**
- LiPo battery and Qi coil are NOT included in PCBA — installed in final assembly
- Camera module OV2640: confirm FPC connector orientation matches CPL rotation
- BQ25895: apply solder paste to EP pad — verify bridging with X-ray (IPC Class 2)
- BME280: humidity/pressure ports must not be masked — instruct to leave ports open

---

## 9. Board Revisions

| Rev | Date       | Changes                                   |
|-----|-----------|-------------------------------------------|
| A   | Jun 2026  | Initial prototype (10 units)             |
| B   | Aug 2026  | DVP trace length match fix, PMIC thermal improve |
| C   | Sep 2026  | Production release (150 units)           |

---

## 10. Files Checklist

Before sending to PCBWay, confirm:
- [ ] KiCad DRC passes with 0 errors, 0 unconnected nets
- [ ] Antenna keepout zone in place and verified
- [ ] All component courtyard clearances pass
- [ ] Fiducials placed (×3 on TOP, ×3 on BOT)
- [ ] Test points placed for: 3.3V, GND, UART TX/RX, battery+
- [ ] Board outline is a single closed polygon on Edge.Cuts
- [ ] Gerbers visually reviewed in KiCad Gerber Viewer
- [ ] BOM CSV exported from KiCad BOM plugin
- [ ] CPL CSV exported, rotations verified vs. manufacturer datasheets

---

*PCBWay: https://www.pcbway.com*  
*KiCad: https://www.kicad.org*  
*© 2026 LOT Systems, Inc. All rights reserved.*
