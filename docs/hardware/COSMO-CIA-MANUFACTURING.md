# COSMO® CIA — Manufacturing & Assembly Guide

**Version:** 1.0
**Date:** 2026-05-26
**Manufacturer:** PCBWay (primary), Grepow (battery)
**Run:** 100 production units

---

## 1. Manufacturing Partners

| Component | Supplier | Contact / URL |
|---|---|---|
| PCB fabrication | PCBWay | https://www.pcbway.com/orderonline.aspx |
| PCB assembly (PCBA) | PCBWay | https://www.pcbway.com/pcb-assembly/ |
| CNC stainless steel enclosure | PCBWay CNC | https://www.pcbway.com/rapid-prototyping/manufacture/ |
| Ultra-thin LiPo battery | Grepow | https://www.grepow.com/page/shaped-battery.html |
| Qi flex coil | Würth Elektronik (via Mouser) | https://www.mouser.com |
| Components (passives, ICs) | DigiKey + Mouser | https://www.digikey.com |
| Glass panels (borosilicate) | Schott / local glazing | Custom cut, 31×31mm, 0.4mm |

---

## 2. PCB Fabrication (PCBWay)

### Files to upload (Gerber package)

```
gerbers/
├── cosmo-cia-F_Cu.gbr          Layer 1 — front copper (signal)
├── cosmo-cia-In1_Cu.gbr        Layer 2 — GND plane
├── cosmo-cia-In2_Cu.gbr        Layer 3 — 3.3V power plane
├── cosmo-cia-B_Cu.gbr          Layer 4 — back copper (signal)
├── cosmo-cia-F_Mask.gbr        Front solder mask
├── cosmo-cia-B_Mask.gbr        Back solder mask
├── cosmo-cia-F_Silkscreen.gbr  Front silkscreen
├── cosmo-cia-B_Silkscreen.gbr  Back silkscreen (minimal)
├── cosmo-cia-Edge_Cuts.gbr     Board outline (40×38mm)
├── cosmo-cia.drl               Excellon drill file
└── cosmo-cia-job.gbrjob        Job file (PCBWay accepts this)
```

### PCBWay order parameters

| Parameter | Value |
|---|---|
| Board size | 40 × 38 mm |
| Quantity | 100 pcs |
| Layer count | 4 |
| Base material | FR4 |
| PCB thickness | **0.6 mm** (confirm availability with PCBWay before ordering) |
| Copper thickness | 1 oz (35µm) outer, 0.5 oz (17µm) inner |
| Min hole size | 0.2 mm drill |
| Min trace/space | 4/4 mil (0.1/0.1 mm) |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | **Black**, both sides |
| Silkscreen | White, top side only |
| Impedance control | Yes — 50Ω single-ended, 90Ω diff pair (USB-C) |
| Via tenting | Tented, both sides |
| Board edge | No castellated holes |
| Panel | Single board (no panelisation required at 100 pcs) |

**PCBWay quote link:** https://www.pcbway.com/orderonline.aspx — upload Gerber ZIP, select parameters above. Expected unit price ~$1.00–1.50 at 100 pcs.

### Critical design notes for PCBWay DFM check
- Confirm 0.6mm board thickness is available (non-standard; standard minimum is 0.8mm — if 0.6mm unavailable, revise device thickness budget by +0.2mm)
- 0402 component clearance from board edge: ≥ 0.3mm
- ESP32-S3-WROOM-1 module has pad pitch 1.27mm — request manual inspection
- BME688 vent hole must align with PCB cutout or nearby board edge

---

## 3. PCB Assembly — PCBA (PCBWay)

### Files to upload

```
assembly/
├── cosmo-cia-BOM.csv       Bill of materials (PCBWay format)
├── cosmo-cia-CPL.csv       Component placement list (centroid, from KiCad)
└── gerbers/                (same Gerber package as above)
```

### BOM CSV format (PCBWay standard)
```
Comment,Designator,Footprint,LCSC Part#,MPN,Qty
ESP32-S3-WROOM-1-N8R8,U1,Module_ESP32-S3-WROOM-1,—,ESP32-S3-WROOM-1-N8R8,1
BME688,U2,BME688-LGA-8,—,BME688,1
GDEM0154D67,DSP1,Custom-FPC-24,—,GDEM0154D67,1
...
```

### CPL CSV format (centroid)
```
Designator,Mid X,Mid Y,Layer,Rotation
U1,20.00,19.00,Top,0
U2,5.00,5.00,Top,0
...
```

### Assembly notes for PCBWay
- **Top side assembly only** (all components on top side)
- **Do NOT place:** Qi coil (L_QI), battery (BAT1), button keycap — these are hand-assembled
- **Camera FPC connector** (FPC1): requires precise placement — specify "precision placement" in notes
- **Stencil:** 0.12mm laser-cut steel stencil, 0.3mm aperture reduction for QFN pads
- **Solder paste:** SAC305 lead-free
- **IPC class:** IPC-A-610 Class 2
- **Post-reflow:** AOI inspection + X-ray on ESP32-S3 module pads (hidden pads)

**PCBWay PCBA quote link:** https://www.pcbway.com/pcb-assembly/ — upload BOM + CPL + Gerbers. Expected ~$5–7/unit at 100 units.

---

## 4. CNC Stainless Steel Enclosure (PCBWay CNC)

### Files to upload

```
cad/
├── cosmo-cia-part-a-rear.step       Part A — rear shell
├── cosmo-cia-part-a-rear.stp        (duplicate in STP format if required)
├── cosmo-cia-part-b-front.step      Part B — front frame
├── cosmo-cia-button-keycap.step     Button keycap (aluminium)
└── cosmo-cia-assembly.step          Full assembly for reference
```

### Part A — Rear Shell (CNC order)

| Parameter | Value |
|---|---|
| Material | 316L Stainless Steel |
| Finish | Mirror polish (electro-polish + hand buff, Ra ≤ 0.05 µm) |
| Quantity | 110 pcs (10% overage for QC rejects) |
| Critical dimensions | 40.0 ±0.05 mm × 40.0 ±0.05 mm × 0.5 mm wall |
| Qi window aperture | 28.0 ×28.0 mm cutout, PEEK inset press-fit |
| Corner radius | R 2.0 mm |
| Screw holes | 4× M1.0 blind threaded inserts, 2.0mm depth, at corners |
| Serial number | Laser-micro-etch on rear face, 6pt font |
| Tolerance | ±0.05 mm general |

**Mirror polish note:** Specify "mirror polish, Ra ≤ 0.05 µm, electro-polished finish" explicitly in the order. PCBWay subcontracts polishing — this adds ~5 business days. Order 1 polished sample first for approval before full run.

### Part B — Front Frame (CNC order)

| Parameter | Value |
|---|---|
| Material | 316L Stainless Steel |
| Finish | Bead-blast satin (Ra ≈ 0.4 µm) |
| Quantity | 110 pcs |
| Critical dimensions | 40.0 ×40.0 mm outer; 38.0 ×38.0 mm inner step for PCB rest |
| Camera aperture | 3.0 mm ⌀ circular, centered at [6,6] mm from corner |
| Display window | 31.0 × 31.0 mm rectangular cutout, 0.2mm chamfer |
| Button aperture | 8.0 × 8.0 mm square, centered at bottom-center |
| Screw holes | 4× M1.0 countersunk, flush with front face |
| Tolerance | ±0.05 mm (critical apertures), ±0.1 mm general |

### Button Keycap (CNC order — batch with enclosure)

| Parameter | Value |
|---|---|
| Material | 6061 Aluminium |
| Finish | Black anodise (Type II) |
| Quantity | 110 pcs |
| Dimensions | 8.0 × 8.0 × 1.2 mm |
| Feature | Micro-chamfer on all top edges (0.1mm × 45°) |
| Bottom | 2× snap pins for button alignment |

**PCBWay CNC quote link:** https://www.pcbway.com/rapid-prototyping/manufacture/ — upload STEP files, select 316L SS, specify finish, request formal quotation. Expected: ~$22/unit enclosure set at 100 qty.

---

## 5. PEEK Qi Window Insert

Part A rear shell has a 28×28mm cutout for the Qi charging window. This is filled with a PEEK (polyether ether ketone) insert:

| Parameter | Value |
|---|---|
| Material | PEEK (natural/ivory) |
| Dimensions | 28.0 × 28.0 × 0.5 mm (flush with SS surface) |
| Process | CNC machined (batch with SS at PCBWay, or injection-moulded at MOQ 500) |
| Fit | Press-fit + structural adhesive (Loctite 326) |
| Surface | Polished to match mirror SS appearance (as close as possible) |

At 100 units: CNC PEEK is most economical. At 500+ units: injection moulding reduces cost to ~$0.30/unit.

---

## 6. Glass Panel

| Parameter | Value |
|---|---|
| Material | Borosilicate glass (Schott D263 or equivalent) |
| Dimensions | 31.0 × 31.0 mm, 0.40 mm thick |
| Edge | Polished (flat), 0.1mm chamfer |
| Coating | AR (anti-reflective) on outer face (optional — adds ~$0.80/unit) |
| Bonding | UV-cured optical adhesive (Norland NOA61) to front e-ink panel |
| Supplier | Schott or local precision glass vendor |
| Qty | 120 pcs (spare for breakage during assembly) |

---

## 7. Hand-Assembly Procedure (per unit)

The following steps are performed after PCBA boards and CNC enclosures are received. Requires a clean, ESD-protected workstation.

### Tools required
- ESD mat + wrist strap
- Precision torque screwdriver (M1.0, 0.02 N·m)
- UV lamp (365nm, for glass bonding)
- Soft-tip tweezers
- Isopropyl alcohol (99% IPA) + lint-free swabs
- Double-sided thermal tape (3M 8810, 0.1mm, for coil)
- Structural adhesive (Loctite 326, for PEEK insert)
- Battery connector crimp tool (JST-PH 1.25mm)

### Assembly sequence

**Step 1 — PCB inspection**
- Visual inspect PCBA board (check for bridging, missing components)
- Power-on test: connect USB-C, verify 3.3V rail, ESP32-S3 boot log on serial

**Step 2 — Camera module attach**
- Insert OV7675 FPC cable into FPC connector on PCB (fold-over type — lift tab, insert cable, press tab)
- Route FPC to camera module position on PCB (camera faces forward, lens toward front frame aperture)

**Step 3 — e-ink display attach**
- Connect GDEM0154D67 FFC cable to PCB FFC connector
- Place display face-down in front frame display window
- Apply 3M 467MP adhesive tape to display bezel to hold in position

**Step 4 — Glass panel bond**
- Clean front face of e-ink display with IPA swab
- Apply 2 drops Norland NOA61 optical adhesive to display face
- Place borosilicate glass panel over display
- Cure under 365nm UV lamp for 60 seconds

**Step 5 — Qi coil attach (Part A)**
- Press-fit PEEK window insert into Part A cutout. Apply 1 drop Loctite 326 to perimeter
- Place TDK IFL12 ferrite sheet (25×25mm, 0.1mm) over PEEK window (inside, PCB-facing side)
- Apply 3M 8810 thermal tape to ferrite sheet
- Place Würth Qi flex coil (760308102214) on ferrite sheet, centered
- Route Qi coil leads to PCB Qi connector pads (hand-solder or JST micro connector)

**Step 6 — Battery**
- Place Grepow thin LiPo cell over Qi coil (between coil and PCB)
- Secure with 3M double-sided tape
- Connect JST-PH 1.25mm battery connector to PCB

**Step 7 — Haptic motor**
- Attach 10mm LRA motor to PCB with 3M VHB tape (near button area)
- Connect LRA leads to DRV2605L motor pads

**Step 8 — Close enclosure**
- Place PCB+display sub-assembly into Part B front frame (PCB rests on inner step)
- Lay Part A rear shell onto Part B (gasket between shells)
- Ensure Qi coil leads are not pinched
- Insert 4× M1.0 titanium screws, torque to 0.02 N·m
- Verify button keycap moves freely and actuates switch

**Step 9 — Final QC**
- Connect to Qi charger pad — verify orange charging LED
- Press button — verify white LED flash + haptic click
- USB-C serial: verify ESP32-S3 boot, BME688 reading, e-ink hello-world
- Run production test script:
  ```bash
  python scripts/production_test.py --port /dev/ttyUSB0
  # Tests: power, WiFi, display, sensor, button, haptic, camera, charging detect
  ```

---

## 8. Batch Firmware Programming

### Programming jig
- 5-port USB hub with 5 USB-C cables
- 5 DUT (device under test) slots with spring-loaded USB-C contacts
- Raspberry Pi 4 running `batch_flash.py`

### Flash sequence
```bash
# 1. Load devices onto jig
# 2. Run batch flash:
python scripts/batch_flash.py \
  --firmware build/cosmo_cia_v1.0.0.bin \
  --devices-csv devices.csv \
  --tokens-csv tokens.csv

# Output per device:
# [OK] S/N 001: Flashed v1.0.0, UUID=abc-..., WiFi-test=SKIP, API-token=provisioned
# [OK] S/N 002: ...
```

### QR label printing
After flash, each device receives a label:
- QR code: provisioning payload (deviceId + token, no WiFi — user fills WiFi via app)
- Human-readable: serial number + device UUID (first 8 chars)
- Label size: 30×15mm, applied to box insert card

---

## 9. Quality Control Gates

| Gate | Timing | Test | Accept criteria |
|---|---|---|---|
| PCB incoming | On receipt | Visual AOI + power-on | 0 shorts, 3.3V rail present |
| Enclosure incoming | On receipt | Dimensional check (5 sample) | All dims within ±0.1mm |
| Polish approval | Before full run | Visual + Ra measurement | Ra ≤ 0.1 µm, no scratches |
| Final assembly | 100% | Production test script | All 8 sub-tests pass |
| Packaging | Sample (10%) | Unbox simulation | All items present, no damage |

**Reject rate target:** ≤ 3% at final assembly. 10% enclosure overorder covers rework/rejects.

---

## 10. Logistics & Timeline

| Week | Activity | Supplier |
|---|---|---|
| W1 (Oct 13) | Place PCB order (100 pcs) | PCBWay |
| W1 (Oct 13) | Place PCBA order (100 units) | PCBWay |
| W1 (Oct 13) | Place CNC enclosure order (110 sets) | PCBWay |
| W1 (Oct 13) | Place glass panel order (120 pcs) | Glass vendor |
| W2 (Oct 20) | Batteries arrive (pre-ordered in Phase 5) | Grepow |
| W2 (Oct 20) | Components arrive (DigiKey/Mouser) | DigiKey/Mouser |
| W3 (Oct 27) | PCBs arrive (7 biz days from PCBWay) | — |
| W3 (Oct 27) | PCBA boards arrive (10 biz days) | — |
| W4 (Nov 3) | CNC enclosures arrive (15 biz days) | — |
| W4 (Nov 3) | Incoming QC — PCBs + enclosures | — |
| W5 (Nov 10) | Hand assembly (all 100 units) | Internal |
| W5 (Nov 10) | Batch firmware flash | Internal |
| W5 (Nov 10) | Final QC test (100%) | Internal |
| W6 (Nov 17) | Packaging + labelling | Internal |
| W6 (Nov 21) | Ship to LOT Systems warehouse | — |

---

## 11. Packing List (per retail unit)

| Item | Qty |
|---|---|
| COSMO® CIA device | 1 |
| USB-A to USB-C cable (0.3m, for initial flash) | 1 |
| Quick Start Card (double-sided, A6) | 1 |
| Warranty card | 1 |
| Retail box (kraft, silver foil, 50×50×15mm) | 1 |

---

*COSMO® CIA Manufacturing Guide — LOT Systems. © 2026 All rights reserved.*
