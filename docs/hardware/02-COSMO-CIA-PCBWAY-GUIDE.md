# COSMO® CIA — PCBWay Manufacturing Guide
## PCB + PCBA + CNC Enclosure Submission

```
DOCUMENT:  02-COSMO-CIA-PCBWAY-GUIDE
REVISION:  v1.0
DATE:      2026-05-26
SUPPLIER:  PCBWay (pcbway.com)
```

---

## Overview

All three manufactured components of the COSMO CIA are ordered through PCBWay:
1. **PCB** — bare board fabrication
2. **PCBA** — SMT assembly service (components + soldering)
3. **CNC Enclosure** — two stainless steel shells per unit

---

## Part 1 — PCB Fabrication

### Board Specification

| Parameter | Value |
|-----------|-------|
| Board size | 36 × 36 mm |
| Layer count | 4 |
| Board thickness | 1.0 mm |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Copper weight | 1 oz outer, 0.5 oz inner |
| Min trace/space | 0.1mm / 0.1mm |
| Min hole size | 0.2mm (laser via) |
| Solder mask | Black (both sides) |
| Silkscreen | White (Side B / component side only) |
| Via treatment | Tented vias |
| Quantity | 110 boards |
| Lead time | 3–5 business days (standard) |

### Gerber File Package

Upload as a single ZIP to PCBWay. Required files:

```
cosmo-cia-pcb-gerbers.zip
├── cosmo_cia.GTL    (Top copper)
├── cosmo_cia.GBL    (Bottom copper)
├── cosmo_cia.G2L    (Inner layer 2)
├── cosmo_cia.G3L    (Inner layer 3)
├── cosmo_cia.GTO    (Top overlay / silkscreen)
├── cosmo_cia.GBO    (Bottom overlay)
├── cosmo_cia.GTS    (Top solder mask)
├── cosmo_cia.GBS    (Bottom solder mask)
├── cosmo_cia.GML    (Board outline / mechanical)
├── cosmo_cia.XLN    (Drill file — Excellon format)
└── cosmo_cia.DRL    (Drill report)
```

### PCBWay Order Steps (bare board)

1. Go to `pcbway.com` → **Online PCB Quote**
2. Enter board dimensions: **36mm × 36mm**
3. Select: **4 layers**, Quantity: **110**
4. Surface finish: **ENIG**
5. Board thickness: **1.0mm**
6. Solder mask: **Black**
7. Upload Gerber ZIP
8. Review 2D/3D preview, confirm drill holes, confirm silkscreen
9. Add to cart → proceed to PCBA

---

## Part 2 — PCBA (Assembly Service)

### What PCBWay Assembles

PCBWay's PCBA service (turnkey or partial) handles:
- Solder paste application via stencil
- Pick-and-place for all SMD components
- Reflow oven soldering (lead-free, RoHS)
- Automated optical inspection (AOI)
- Optional X-ray inspection for BGA/QFN packages

### BOM File Format for PCBWay PCBA

Upload `cosmo-cia-bom.xlsx` with columns:

| Column | Example |
|--------|---------|
| Ref | U1 |
| Description | ESP32-S3-MINI-1-N8 |
| Manufacturer | Espressif |
| MPN | ESP32-S3-MINI-1-N8 |
| LCSC Part # | C2913202 |
| Qty | 1 |
| Package | LCC-61 |
| Notes | Do not substitute |

### CPL (Component Placement List) Format

Upload `cosmo-cia-cpl.csv`:

```
Ref,Val,Package,PosX,PosY,Rotation,Side
U1,ESP32-S3-MINI-1-N8,LCC-61,18.00,18.00,0,top
U3,BME688,LGA-8,8.00,8.00,0,top
U4,STWLC68,QFN-28,28.00,8.00,270,bottom
...
```

### PCBA Order Steps

1. On the same PCBWay order (after bare board): click **+ SMT Assembly**
2. Select **Single Side** or **Double Side** assembly (COSMO CIA: double-sided)
3. Upload BOM file (XLSX)
4. Upload CPL file (CSV)
5. Select **Turnkey** (PCBWay sources components) or **Consigned** (you ship components)
6. **Recommended: Turnkey** — PCBWay sources from LCSC, faster and simpler
7. Confirm component substitution policy: select **No substitution** for U1, U3, U4
8. Request AOI inspection for all boards
9. Request X-ray for STWLC68 (QFN-28)

### Components to Flag as Critical (No Substitute)

- U1: ESP32-S3-MINI-1-N8 (firmware specifically compiled for this module)
- U3: BME688 (BSEC2 firmware library is part-specific)
- U4: STWLC68 (Qi protocol implementation is IC-specific)
- U6: MAX17048 (fuel gauge register map in firmware is part-specific)

### What to Hand-Solder After PCBA

| Component | Reason |
|-----------|--------|
| DISP1 — FPC connector | FPC connector is delicate; assemble after PCB test |
| CAM1 — OV2640 module | Module has its own sub-PCB; connects via FFC after housing |
| BAT1 — LiPo battery | Safety — connect battery after full assembly and test |
| SW1 — Copy button | Confirm fit in enclosure before soldering |

---

## Part 3 — CNC Machined Enclosure

### Side A — Polished Shell

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Dimensions (outer) | 40.0 × 40.0 × 2.8 mm |
| Wall thickness | 0.8 mm |
| Inner cavity | 36.0 × 36.0 × 2.0 mm deep |
| Finish | Mirror polish, Ra ≤ 0.1 µm |
| Post-processing | Passivation (ASTM A967) |
| Features | 4× M1.6 threaded inserts, corners |
| File format | STEP (.stp) |

### Side B — Active Shell

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Dimensions (outer) | 40.0 × 40.0 × 2.5 mm |
| Wall thickness | 0.8 mm |
| Inner cavity | 36.0 × 36.0 × 1.7 mm deep |
| Finish | Satin brushed, Ra 0.8 µm |
| Post-processing | Passivation (ASTM A967) |
| Cutouts | See table below |
| File format | STEP (.stp) |

### Side B Cutouts

| Feature | Dimensions | Position (from top-left) |
|---------|-----------|--------------------------|
| Display window | 28.0 × 38.0 mm | Center, 6mm from top edge |
| Camera aperture | ø3.5 mm through-hole | 35mm from left, 3.5mm from top |
| Button recess | ø7.0 mm × 0.5 mm deep + ø2.5 mm through | Center, 37mm from top |
| LED light pipe | ø1.2 mm | 3mm from left, 37mm from top |
| USB-C slot | 9.5 × 4.0 mm | Center of bottom edge |
| Screw holes | 4× ø1.8 mm | 3mm from each corner |

### PCBWay CNC Order Steps

1. Go to `pcbway.com` → **CNC Machining**
2. Upload STEP files (separate for Side A and Side B)
3. Material: **316L Stainless Steel**
4. Surface finish:
   - Side A: **Mirror Polishing**
   - Side B: **Brushed (satin)**
5. Tolerance: **±0.05 mm** for cavity, **±0.1 mm** for outer dimensions
6. Threads: **M1.6** (confirm thread depth 3mm)
7. Quantity: **110 sets** (100 production + 10 spare)
8. Add engineering notes: "Passivation required per ASTM A967 after machining"

### Lead Time

| Service | Typical lead time |
|---------|------------------|
| PCB (bare, 110 pcs) | 3–5 business days |
| PCBA (assembled, 110 pcs) | 7–10 business days |
| CNC enclosure (110 sets) | 7–12 business days |
| **All-in (parallel order)** | **~12–15 business days** |

---

## Part 4 — Design for Manufacture Checklist

Before submitting to PCBWay:

- [ ] All Gerber layers exported and verified in Gerber viewer
- [ ] Drill file matches vias in Gerber layers
- [ ] Board outline on dedicated mechanical layer (GML)
- [ ] BOM cross-checked against CPL (no missing components)
- [ ] QFN and LGA footprints have exposed thermal pad
- [ ] Battery connector polarity clearly marked on silkscreen
- [ ] USB-C connector has ESD protection (PRTR5V0U2X)
- [ ] Antenna keep-out zone respected (15mm clearance under ESP32-S3 antenna)
- [ ] FPC connectors oriented for correct flex cable routing
- [ ] STEP files for both enclosure halves open cleanly in CAD
- [ ] Screw hole positions in STEP match PCB mounting holes

---

## Part 5 — Post-Assembly Test Procedure

Perform on each board before housing:

```
1. Visual inspection — no solder bridges, all components present
2. Power-on test — apply 3.7V, measure 3.3V rail (should be 3.28–3.32V)
3. USB-C enumeration — connect to PC, device should appear as USB CDC
4. WiFi scan test — run firmware test mode, verify WiFi adapter initializes
5. BME688 I2C ping — firmware should print temperature reading on UART
6. Display test — firmware should render test pattern on e-paper
7. Button test — press Copy button, firmware should print GPIO event
8. Qi charge test — place on Qi pad, LED should illuminate
9. Camera test — firmware should capture 160×120 frame, no all-black output
10. Battery fuel gauge — read SOC via I2C, should return 0–100%
```

Pass rate target: >96% first-pass yield.

---

```
COSMO® CIA — PCBWay Manufacturing Guide
LOT Systems Corporation | lot-systems.com
Document: 02-COSMO-CIA-PCBWAY-GUIDE v1.0
```
