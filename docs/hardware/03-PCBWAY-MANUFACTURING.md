# COSMO Computer — PCBWay Manufacturing Guide
**Document:** 03-PCBWAY-MANUFACTURING  
**Revision:** A  
**Date:** 2026-05-27  

---

## Overview

PCBWay handles three manufacturing streams for COSMO Computer:
1. **PCB fabrication** — Main PCB (4-layer) + Power PCB (2-layer)
2. **PCBA (SMT Assembly)** — Full board assembly with all SMD components
3. **CNC Machining** — 316L stainless steel body (2 parts)

All three can be ordered via PCBWay's unified platform. This document provides exact order specifications for each.

---

## 1. PCB Fabrication Orders

### 1.1 Main PCB (Top Board)

**Order at:** https://www.pcbway.com/orderonline.aspx

| Parameter | Value |
|-----------|-------|
| Board type | Single piece |
| Dimensions | 38 mm × 38 mm |
| Layers | 4 |
| Quantity | 100 (order 120 for 20% test/spare margin) |
| Material | FR4, Tg 170 |
| Thickness | 1.0 mm |
| Min trace/space | 0.1/0.1 mm |
| Min hole size | 0.2 mm (laser via) / 0.3 mm (drill) |
| Surface finish | **ENIG** (1U" Au / 120U" Ni) |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Solder mask | **Black** (both sides) |
| Silkscreen | **White** (top side only) |
| Edge connector | No |
| Impedance control | **Yes** — see impedance note below |
| Via tenting | Tented (all vias) |
| Board outline | Square with R3mm corners |
| Castellated holes | No |
| Gold fingers | No |

**Gerber File Set Required:**
```
main_pcb/
├── top_copper.gbr        (GTL)
├── layer2_copper.gbr     (G2L)
├── layer3_copper.gbr     (G3L)
├── bottom_copper.gbr     (GBL)
├── top_soldermask.gbr    (GTS)
├── bottom_soldermask.gbr (GBS)
├── top_silkscreen.gbr    (GTO)
├── drill_pth.drl         (PTH)
├── drill_npth.drl        (NPTH)
├── board_outline.gbr     (GKO)
└── impedance_note.txt
```

**Impedance Note (include in order):**
```
Layer 1 (Top):    50Ω single-ended, 90Ω differential (USB D+/D-, camera data pairs)
Layer 2:          GND reference plane
Layer 3:          Power planes (3.3V, 5V)
Layer 4 (Bottom): 50Ω single-ended
Dielectric Tg 170 FR4, 1.0mm total. Please confirm stackup.
```

**Upload checklist:**
- [ ] ZIP containing all Gerber files
- [ ] BOM file (CSV format for PCBA)
- [ ] Pick-and-Place (CPL) file for PCBA
- [ ] Impedance requirements note

---

### 1.2 Power PCB (Bottom Board)

| Parameter | Value |
|-----------|-------|
| Dimensions | 38 mm × 38 mm |
| Layers | 2 |
| Quantity | 100 (order 120) |
| Material | FR4, Tg 150 |
| Thickness | 0.8 mm |
| Min trace/space | 0.15/0.15 mm |
| Min hole size | 0.4 mm |
| Surface finish | **ENIG** |
| Copper weight | 2 oz (heavier for power traces) |
| Solder mask | **Black** (both sides) |
| Silkscreen | **White** (top side only) |
| Impedance control | No |
| Via tenting | Tented |

---

## 2. PCB Assembly (PCBA) Orders

**Order at:** https://www.pcbway.com/pcb-assembly.html

### 2.1 Main PCB Assembly

| Parameter | Value |
|-----------|-------|
| Assembly type | One-side SMT + Hand solder (through-hole parts) |
| Boards | 100 pcs |
| Unique SMT components | ~65 distinct parts |
| Total SMT placements per board | ~95 placements |
| Through-hole parts | USB-C connector, FPC connector, JST connector |
| Lead-free solder | Yes (RoHS SAC305) |
| Conformal coating | No (Rev A) |
| X-ray inspection | Yes (BGA/QFN packages) |
| AOI | Yes |
| ICT | No (Rev A) |
| Functional test | Basic — PCBWay power-on test |
| Component procurement | Split: PCBWay sources passives; customer supplies ESP32-S3, BME688, camera |

**PCBA Files Required:**
1. Gerber files (same as PCB fabrication)
2. BOM file (CSV or Excel):

```csv
Reference,Value,Package,MPN,Manufacturer,Qty,Note
U1,ESP32-S3-MINI-1U-N8R8,ESP32-S3-MINI,ESP32-S3-MINI-1U-N8R8,Espressif,1,Customer supplied
U2,CP2102N,QFN-24,CP2102N-A02-GQFN24,Silicon Labs,1,PCBWay sources
U3,BME688,LGA-8,BME688,Bosch Sensortec,1,Customer supplied
U4,LSM6DSO32TR,LGA-14,LSM6DSO32TR,ST,1,PCBWay sources
U5,VEML7700-TT,ODFN-8,VEML7700-TT,Vishay,1,PCBWay sources
U6,BQ51013BRHLR,QFN-20,BQ51013BRHLR,Texas Instruments,1,Customer supplied
U7,TP4056,SOP-8,TP4056,LCSC,1,PCBWay sources
U8,HT7833-1,SOT-89-3,HT7833-1,Holtek,1,PCBWay sources
U9,TPS63036YFFR,WDFN-8,TPS63036YFFR,Texas Instruments,1,Customer supplied
LED1,WS2812B-Mini,3.5x3.5mm,WS2812B-Mini,WorldSemi,1,PCBWay sources
SW1,PTS526SK15SMTR2LFS,4.2x3.2mm,PTS526SK15SMTR2LFS,C&K,1,PCBWay sources
J1,USB4135-GF-A,USB-C,USB4135-GF-A,GCT,1,Customer supplied
J3,U.FL-R-SMT,U.FL,U.FL-R-SMT,Hirose,1,PCBWay sources
C1-C20,Various caps,0402/0603,Various,Various,20,PCBWay sources
R1-R20,Various resistors,0402,Various,Various,20,PCBWay sources
```

3. Pick-and-Place (CPL) file (Centroid file):

```csv
Designator,Mid X,Mid Y,Layer,Rotation
U1,19.00,19.00,Top,0
U2,5.00,5.00,Top,0
U3,33.00,10.00,Top,0
...
```

---

### 2.2 Power PCB Assembly

| Parameter | Value |
|-----------|-------|
| Assembly type | One-side SMT |
| Boards | 100 pcs |
| Unique SMT components | ~20 distinct parts |
| Total SMT placements | ~30 placements |
| Hand solder | Qi coil solder pads (2 pads), JST connector |
| Lead-free solder | Yes (SAC305) |
| AOI | Yes |
| Qi coil bonding | Customer installs (epoxy bond, 2-pad solder) |

---

## 3. CNC Machining Orders

**Order at:** https://www.pcbway.com/rapid-prototyping/manufacture/CNC-Machining-Stainless-Steel.html

### 3.1 Front Shell (Side B) — Brushed Stainless

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Quantity | 100 parts |
| Dimensions | 40.0 × 40.0 × 3.5 mm (machined from 4mm stock) |
| Corner radius | R3 mm outer |
| Finish | Brushed #4 satin (180 grit, unidirectional) |
| Tolerances | ±0.05 mm (critical openings), ±0.1 mm (general) |
| Surface roughness | Ra 0.4–0.8 µm on brushed faces |
| Cutouts (CNC milled) | Display aperture 28.0×28.0 R1mm, Camera Ø6.0mm, Button slot 14.0×5.0mm, USB-C slot 10.0×4.0mm, LED dot Ø2.2mm, 4× BME688 vents Ø0.8mm |
| Tapped holes | 4× M1 tapped blind holes (5mm deep) at 34×34mm pattern |
| Standoff bores | 4× Ø2.0mm through-holes at 32×32mm pattern (for PCB standoffs) |
| Gasket groove | 0.5×0.5mm channel on mating face, 36×36mm perimeter |
| Marking | None on outer face |

**Files required:** STEP file + DXF drawing with all dimensions and tolerances annotated

---

### 3.2 Back Shell (Side A) — Mirror Polished Stainless

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Quantity | 100 parts |
| Dimensions | 40.0 × 40.0 × 3.5 mm |
| Corner radius | R3 mm outer |
| Finish Step 1 | Machined to Ra 0.2 µm |
| Finish Step 2 | **Mirror polished** (Ra < 0.1 µm, electro-polished, then electropolishing passivation) |
| Qi window | Centre area 32×32mm thinned to **0.3 mm** wall thickness (critical for Qi field penetration) |
| Tapped holes | 4× M1 × 0.25 countersunk (90°) at 34×34mm pattern |
| Gasket groove | 0.5×0.5mm channel on mating face, 36×36mm perimeter |
| Inner face marking | `COSMO® CC-R1` laser engraved on inner face (not visible assembled) |

> ⚠️ **Critical Manufacturing Note:** The 0.3 mm thinned Qi window must be stress-relieved after milling. Request stress relief annealing (450°C, 1 hour) before polishing. Wall thickness tolerance: +0.05/-0.00 mm.

---

## 4. PCBWay Order Workflow

```
Step 1: Create PCBWay account
        → https://www.pcbway.com/member/

Step 2: Submit Main PCB fabrication quote
        → Upload Gerber ZIP + stackup requirements
        → Confirm impedance stackup with PCBWay engineering

Step 3: Submit Power PCB fabrication quote
        → Upload Gerber ZIP

Step 4: Submit PCBA quotes (Main + Power)
        → Upload BOM CSV + CPL CSV + Gerbers
        → Mark customer-supplied components
        → Request X-ray on U6 (BQ51013B QFN), U9 (TPS63036 WDFN)

Step 5: Submit CNC order (Front Shell)
        → Upload STEP + DXF
        → Select 316L SS, brushed #4 finish
        → Add tolerance note

Step 6: Submit CNC order (Back Shell)
        → Upload STEP + DXF
        → Select 316L SS, mirror polish + electropolish
        → Add Qi window thickness note

Step 7: Ship customer-supplied components to PCBWay
        → ESP32-S3-MINI-1U-N8R8 (100 pcs + 10% spare)
        → BME688 (100 pcs + 10% spare)
        → BQ51013BRHLR (100 pcs + 10% spare)
        → TPS63036YFFR (100 pcs + 10% spare)
        → USB4135-GF-A (100 pcs + 10% spare)
        → OV2640 camera modules (100 pcs + 20% spare)
        → Use PCBWay's "Customer Supply" shipping address

Step 8: PCBWay produces and ships all items

Step 9: Receive, inspect, and final-assemble at LOT Systems facility
```

---

## 5. Quality Inspection Checklist (on Arrival)

### PCBs
- [ ] All boards pass visual inspection (no bridging, lifted pads, missing components)
- [ ] 5 random boards receive full power-on test
- [ ] Verify ESP32-S3 flashes successfully via USB-C
- [ ] Verify I2C devices respond (BME688 at 0x76, LSM6DSO32 at 0x6A, VEML7700 at 0x10)
- [ ] Verify SPI display initialises (white screen test)
- [ ] Verify camera responds (OV2640 register read)
- [ ] Verify Qi charging activates (charge LED)
- [ ] Verify COPY button GPIO interrupt triggers

### Stainless Body
- [ ] Dimensions within tolerance (measure 5 random parts)
- [ ] Display aperture fits display without gap > 0.1mm
- [ ] Camera aperture centred within 0.1 mm
- [ ] Qi window wall thickness: 0.3 ± 0.05 mm (measure with micrometer)
- [ ] Mirror polish: no scratches visible under 10× lupe
- [ ] No burrs on any cutouts
- [ ] M1 threads accept screw cleanly without force

### Final Assembly Test (5 units)
- [ ] Boot to LOT notification screen
- [ ] COPY button logs to lot-systems.com/logs
- [ ] Qi wireless charging activates at 5mm distance
- [ ] BME688 temperature reads ± 1°C vs reference thermometer
- [ ] Wi-Fi connects to 2.4 GHz network
- [ ] OTA firmware update completes successfully

---

## 6. Estimated Lead Times

| Item | PCBWay Lead Time | Notes |
|------|-----------------|-------|
| Main PCB (4-layer) | 5–7 business days | Standard service |
| Power PCB (2-layer) | 3–5 business days | Standard service |
| Main PCB Assembly | 7–12 business days | After PCB completion |
| Power PCB Assembly | 5–8 business days | |
| CNC Front Shell | 12–18 business days | Brushed finish |
| CNC Back Shell | 15–25 business days | Mirror polish + electropolish |
| **Total (parallel orders)** | **25–35 business days** | |

**Recommended order placement:** Place all orders simultaneously. CNC parts are the critical path.

---

## 7. Cost Summary (PCBWay)

| Service | PCBWay Quote Basis | Est. Total |
|---------|-------------------|-----------|
| Main PCB fab (120 pcs, 4-layer ENIG) | $3.80 ea | $456 |
| Power PCB fab (120 pcs, 2-layer ENIG) | $2.20 ea | $264 |
| Main PCB assembly (100 boards) | $15.00 ea | $1,500 |
| Power PCB assembly (100 boards) | $6.00 ea | $600 |
| CNC Front Shell (100 pcs) | $12.00 ea | $1,200 |
| CNC Back Shell (100 pcs) | $14.00 ea | $1,400 |
| Shipping (DHL Express to destination) | Est. | $250 |
| **PCBWay Total** | | **~$5,670** |

---

*Document: 03-PCBWAY-MANUFACTURING.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
