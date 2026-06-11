<!--
  LOT SYSTEMS CORPORATION
  LOT Computer — PCBWay Manufacturing Specification v1.0
  2026-06-11
-->

# LOT Computer — PCBWay Manufacturing Specification
## PCBWAY-MFG-SPEC-v1.0 | 2026-06-11

**Classification:** Internal — Manufacturing Engineering
**Supplier:** PCBWay | https://www.pcbway.com
**Project code:** LCM-001
**Run quantity:** 100 units

---

## 1. PCBWay Account & Project Setup

1. Create account at https://www.pcbway.com/member/login/
2. Start new project: "LOT Computer LCM-001"
3. Upload files per section below
4. Request engineering review before payment (PCBWay offers free DFM)

---

## 2. PCB Fabrication Order

### 2.1 Gerber Files Required

```
LCM-001-F_Cu.gtl        ← Top copper
LCM-001-In1_Cu.g2       ← Inner copper 1 (GND plane)
LCM-001-In2_Cu.g3       ← Inner copper 2 (Power plane)
LCM-001-B_Cu.gbl        ← Bottom copper
LCM-001-F_Mask.gts      ← Top solder mask
LCM-001-B_Mask.gbs      ← Bottom solder mask
LCM-001-F_Silkscreen.gto← Top silkscreen
LCM-001-B_Silkscreen.gbo← Bottom silkscreen
LCM-001-Edge_Cuts.gm1   ← Board outline
LCM-001.drl             ← Drill file (Excellon)
LCM-001-PTH.drl         ← Plated-through holes
LCM-001-NPTH.drl        ← Non-plated holes
```

### 2.2 PCB Specification

| Parameter | Value | Notes |
|-----------|-------|-------|
| PCB size | 38.0 × 38.0 mm | 1mm margin inside 40mm frame |
| Layers | 4 | L1 signal, L2 GND, L3 PWR, L4 signal |
| PCB thickness | 1.0 mm | Non-standard; confirm with PCBWay |
| Material | FR-4 TG155 | Standard |
| Surface finish | ENIG (Au 1–2μin, Ni 3–5μm) | Gold for reliable SMT |
| Solder mask | Both sides | Black (#1 preference) |
| Silkscreen | Both sides | White |
| Min trace width | 0.1 mm (4 mil) | RF trace: 0.13mm @50Ω |
| Min space | 0.1 mm (4 mil) | |
| Min drill | 0.2 mm (8 mil) | Laser drill for vias |
| Min via size | 0.2 mm drill / 0.4 mm pad | |
| Controlled impedance | YES | 50Ω for antenna trace on L1 |
| Impedance reference layer | L2 (GND) | Dielectric h=0.35mm L1-L2 |
| Copper weight | L1: 1 oz, L2-L3: 0.5 oz, L4: 1 oz | |
| Beveled edge | No | |
| Castellated holes | No | |
| Quantity | 110 | 100 production + 10 spare |
| Estimated cost | ~$380 | Per PCBWay online quote |

### 2.3 PCBWay Order URL

```
https://www.pcbway.com/orderonline.aspx
→ Select: "PCB prototype"
→ Fill dimensions: 38 × 38 mm
→ Layers: 4
→ Quantity: 110
→ Upload Gerber ZIP
→ Add note: "Controlled impedance 50Ω ±10% on J3 antenna trace L1. Board thickness 1.0mm confirmed."
```

---

## 3. SMT Assembly Order (Turnkey)

PCBWay's turnkey service sources all components, prints stencil, and assembles.

### 3.1 Files Required

```
LCM-001-BOM.xlsx        ← Bill of materials (see BOM-v1.0.md format)
LCM-001-CPL.csv         ← Component placement list (X,Y,rotation,side)
LCM-001-Gerbers.zip     ← Same Gerber package as PCB order
LCM-001-3D.step         ← 3D model for assembly verification
```

### 3.2 BOM Format for PCBWay SMT

PCBWay requires BOM in this exact column format:

```csv
Designator,Comment,Footprint,LCSC Part#,Mouser Part#,Qty,Description
U1,ESP32-S3-WROOM-1-N4R2,MOD-ESP32S3-WROOM,C2913204,,1,MCU WiFi BLE module
U2,SSD1306 OLED,OLED-1.3IN,C5148940,,1,OLED display module
U3,OV2640,,,,1,Camera module (provide separately)
U4,BME688,LGA-8L,,,1,Environmental sensor
U5,ISM330DHCX,LGA-14L,,,1,IMU AI sensor
U6,STWLC38JR,WLCSP-25,,,1,Qi wireless charge RX
U7,MCP73831T-2ACI/OT,SOT-23-5,,,1,Li-Po charger IC
U8,AP2112K-3.3TRG1,SOT-23-5,C6187,,1,3.3V LDO
U9,USBLC6-2SC6,SOT-23-6,C2827654,,1,USB ESD protection
J1,TYPE-C-31-M-12,USB-C-MID,C165948,,1,USB-C connector
SW1,KXT332LHS,SW-3.2x3.2,,,1,COPY button
LED1,APTD3216CGCK,0805-LED,C2290,,1,Charge indicator LED
ANT1,Molex 2048390100,ANT-CHIP-2G,,538-2048390100,1,2.4GHz antenna
(+ all passives per BOM F1/F2)
```

### 3.3 CPL Format for PCBWay SMT

```csv
Designator,Mid X,Mid Y,Layer,Rotation
U1,19.0,28.0,Top,0
U2,19.0,14.0,Top,0
U3,8.0,6.0,Top,0
U4,32.0,6.0,Top,0
U5,8.0,14.0,Top,0
U6,30.0,6.0,Bottom,0
J1,38.0,19.0,Top,90
SW1,32.0,6.0,Top,0
LED1,19.0,3.0,Top,0
(+ all passives)
```
*Exact coordinates TBD from KiCad layout.*

### 3.4 Assembly Specification

| Parameter | Value |
|-----------|-------|
| Assembly sides | Top side (component side) + bottom (Qi IC) |
| Stencil | Laser-cut stainless, 0.12mm thick |
| Solder paste | SAC305 (lead-free) |
| Reflow profile | Per IPC-J-STD-020E |
| WLCSP rework | Confirm PCBWay capability for STWLC38JR WLCSP-25 |
| IPC class | Class 2 |
| AOI | 100% automated optical inspection |
| X-ray | 10% sample for BGA/WLCSP |
| Functional test | No (firmware not loaded at PCBWay) |
| Quantity | 105 (100 production + 5 test) |
| Estimated cost | ~$1,800 for 105 units |

### 3.5 PCBWay SMT Order URL

```
https://www.pcbway.com/pcb-assembly.html
→ "Turnkey PCB Assembly"
→ Upload: BOM.xlsx + CPL.csv + Gerbers.zip
→ Confirm component sourcing per BOM
→ Note: "WLCSP-25 component U6 — confirm soldering capability"
```

---

## 4. CNC Machining Order — SS316L Body Frame

### 4.1 Files Required

```
LCM-FRAME-001.step      ← Full 3D body frame model
LCM-FRAME-001.pdf       ← 2D engineering drawing with GD&T
LCM-FRAME-001.dxf       ← 2D outline for reference
```

### 4.2 Frame Specification

| Parameter | Value |
|-----------|-------|
| Material | Stainless Steel 316L (UNS S31603) |
| Raw stock | 42×42×7mm billet |
| Outer dimensions | 40×40×5mm |
| Corner radius | R3mm external, R2.5mm internal |
| Wall thickness | 0.5mm sides |
| Surface finish | #400 bead blast (front face + sides) |
| Passivation | ASTM A967 citric acid |
| Cutout: Screen window | 31×16mm rectangular, ±0.05mm |
| Cutout: Camera | 8mm circular, center at (8,8) from bottom-left |
| Camera bump | 9.5mm dia, 1.5mm protrusion, M8×0.5 internal thread |
| Cutout: Button | 9mm circular, center at (32,8) from bottom-left |
| Cutout: USB-C | 10×4mm rectangular, right edge center |
| Cutout: LED | 2.2mm circular, center at (20,5) from bottom-left |
| PCB standoffs | 4× M1.0 threaded blind hole, 1.5mm depth |
| Plate screw holes | 4× M1.2 through-hole, countersunk on back |
| Quantity | 105 |
| Estimated cost | ~$1,680 ($16/pc) |

### 4.3 Frame Order URL

```
https://www.pcbway.com/rapid-prototyping/manufacture/
→ "CNC Machining"
→ Material: Stainless Steel 316L
→ Upload STEP + PDF
→ Finish: Bead blast + passivate
→ Qty: 105
→ Note: "Camera bump must have M8×0.5 internal thread accurate to ±0.05mm"
```

---

## 5. CNC Machining Order — SS316L Mirror Back Plate

### 5.1 Plate Specification

| Parameter | Value |
|-----------|-------|
| Material | Stainless Steel 316L |
| Dimensions | 40.0×40.0×0.5mm |
| Corner radius | R3mm |
| Fastener holes | 4× M1.2 countersunk, 90° CSK, flush |
| Inner surface | Laser engraved: "LOT® [SERIAL] | lot-systems.com" |
| Outer surface | Mirror polish (mechanical buff → electropolish → final buff) |
| Target roughness | Ra ≤ 0.05μm |
| Target reflectance | ≥92% specular |
| Gasket groove | 0.3mm × 0.5mm channel, 1mm from edge, 3 sides + partial 4th |
| Quantity | 105 |
| Estimated cost | ~$1,260 ($12/pc) |

### 5.2 Mirror Polish Process

PCBWay instruction note:
```
"Mirror polish required on OUTER surface only (Side A).
Process: 
  1. Machine to geometry
  2. Hand polish with 400 → 800 → 1200 → 2000 grit
  3. Electropolish (citric acid, 10 min)
  4. Final buff with polishing compound
  5. DO NOT TOUCH outer surface after final buff — bag immediately.
Measure Ra with profilometer, confirm ≤0.05μm. Include Ra report."
```

---

## 6. Flex PCB Order — Qi Charging Coil

### 6.1 Coil Specification

| Parameter | Value |
|-----------|-------|
| PCB type | Flexible (single layer) |
| Substrate | 0.1mm PET |
| Copper thickness | 35μm (1 oz) |
| Coil dimensions | 30×30mm |
| Turns | 12 |
| Trace width | 0.15mm |
| Trace gap | 0.15mm |
| Inductance target | L ≈ 6.5μH ±10% |
| DC resistance | ≤0.8Ω |
| Connection | 2× solder pads, 1.5mm dia, 2mm pitch at center |
| Quantity | 110 |
| Estimated cost | ~$380 |

### 6.2 Flex PCB URL

```
https://www.pcbway.com/pcb-service/flexible-pcb/
→ Layers: 1
→ Thickness: 0.1mm
→ Copper: 35μm
→ Size: 30×30mm
→ Quantity: 110
→ Note: "Spiral coil 12 turns. Include inductance test report (target 6.5μH ±10%)."
```

---

## 7. Stencil Order

PCBWay supplies stencil automatically as part of SMT order. If separate:

```
https://www.pcbway.com/stencil.aspx
→ Type: Laser cut stainless steel
→ Thickness: 0.12mm
→ Size: 250×250mm frame
→ Fiducials: Same as PCB top copper
→ Note: "Reduce paste apertures 5% for 0402 components. QFN/WLCSP: 80% infill."
```

---

## 8. Full Order Checklist

| Order | Files | Qty | Est. Cost | PCBWay URL |
|-------|-------|-----|-----------|------------|
| PCB fabrication | Gerbers.zip | 110 | $380 | pcbway.com/orderonline.aspx |
| SMT assembly (turnkey) | BOM + CPL + Gerbers | 105 | $1,800 | pcbway.com/pcb-assembly.html |
| CNC frame | STEP + PDF | 105 | $1,680 | pcbway.com/rapid-prototyping |
| CNC mirror plate | STEP + PDF | 105 | $1,260 | pcbway.com/rapid-prototyping |
| Flex PCB coil | Gerbers | 110 | $380 | pcbway.com/pcb-service/flexible-pcb |
| **Total** | | | **$5,500** | |

---

## 9. PCBWay Timeline

| Phase | Activity | Lead Time |
|-------|----------|-----------|
| 1 | File submission + DFM review | 1–3 days |
| 2 | PCBWay sources components (BOM) | 7–14 days |
| 3 | PCB fabrication | 5–7 days |
| 4 | SMT assembly | 3–5 days |
| 5 | CNC frame (runs parallel with PCB) | 10–14 days |
| 6 | CNC back plate (runs parallel) | 10–14 days |
| 7 | Flex PCB (runs parallel) | 5–7 days |
| 8 | QC + final inspection | 2–3 days |
| 9 | International shipping | 5–10 days |
| **Total (critical path)** | | **35–50 days** |

---

## 10. Quality Acceptance Criteria

### 10.1 PCB Acceptance

- [ ] IPC-A-600 Class 2 visual standard
- [ ] All 110 boards pass AOI
- [ ] Controlled impedance report: 50Ω ±10% on antenna trace
- [ ] Board thickness: 1.0 ±0.1mm

### 10.2 SMT Assembly Acceptance

- [ ] IPC-A-610 Class 2 visual standard
- [ ] AOI pass: 100% of 105 units
- [ ] X-ray sample (10%): No WLCSP bridging or voids >25%
- [ ] Continuity test per test fixture

### 10.3 CNC Acceptance

- [ ] Frame: All cutouts within ±0.1mm
- [ ] M8×0.5 camera thread: Go/no-go gauge pass
- [ ] Mirror plate: Ra ≤ 0.05μm (profilometer report)
- [ ] Mirror plate: No scratches visible to naked eye at 45° light
- [ ] All M1.2 countersinks flush ±0.05mm

---

*LOT COMPUTER PCBWAY MFG SPEC v1.0 — COMPLETE*
*© 2026 LOT Systems. All rights reserved.*
