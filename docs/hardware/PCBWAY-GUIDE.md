<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — PCBWay Manufacturing Guide

**Document:** PCBWAY-GUIDE.md
**Revision:** 1.0
**Date:** May 28, 2026
**Project:** COSMO® Computer CC-1
**Manufacturer:** PCBWay (pcbway.com)

---

## 1. PCBWay Service Selection

Go to **pcbway.com → PCB Assembly (PCBA)** — the turnkey service where PCBWay sources components, fabricates the board, and assembles.

Select:
- **Service:** PCB Assembly (Turnkey)
- **Board type:** Single-sided SMD (both sides used; specify in notes)
- **Quantity:** 110 (order 10% extra for QC failures)
- **Layers:** 4
- **Dimensions:** 36 mm × 36 mm
- **PCB color:** Black soldermask
- **Surface finish:** ENIG (Electroless Nickel Immersion Gold)
- **Min track/gap:** 4/4 mil
- **Min drill:** 0.2 mm

---

## 2. Required Files for PCBWay Order

Upload a ZIP containing:

```
cosmo_computer_cc1_pcbway.zip
├── gerbers/
│   ├── cc1_top_copper.gbr         # Layer 1 (Top)
│   ├── cc1_inner1_gnd.gbr         # Layer 2 (Ground plane)
│   ├── cc1_inner2_pwr.gbr         # Layer 3 (Power plane)
│   ├── cc1_bottom_copper.gbr      # Layer 4 (Bottom)
│   ├── cc1_top_soldermask.gbr
│   ├── cc1_bottom_soldermask.gbr
│   ├── cc1_top_silkscreen.gbr
│   ├── cc1_bottom_silkscreen.gbr
│   ├── cc1_edge_cuts.gbr          # Board outline (36×36mm)
│   └── cc1_drill.drl              # Drill file (Excellon format)
├── bom/
│   └── cc1_bom.xlsx               # BOM in PCBWay format (see Section 3)
├── cpl/
│   └── cc1_pick_place.csv         # Pick-and-place / centroid file
└── notes/
    └── assembly_notes.txt         # Special instructions
```

---

## 3. BOM File Format (PCBWay)

PCBWay requires a BOM in Excel format with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Designator | Reference designator(s) | U1, U2 |
| Value | Component value | ESP32-S3FN8 |
| Footprint | PCB footprint | QFN56_7x7 |
| Quantity | Per board | 1 |
| MPN | Manufacturer part number | ESP32-S3FN8 |
| Manufacturer | Brand | Espressif |
| Description | Brief description | Dual-core WiFi+BT MCU |
| Package | Physical package | QFN-56 |
| LCSC Part # | LCSC part number | C2913202 |
| Notes | Special handling | Do not substitute |

**Key components to mark "Do Not Substitute":**
- ESP32-S3FN8 (U1)
- BME688 (U3)
- BQ51013BRHLR (U6)
- OV2640 camera connector (J4)
- SSD1327 OLED connector (J2)

---

## 4. Pick-and-Place File Format

```csv
Designator,Mid X,Mid Y,Layer,Rotation
U1,18.00,18.00,Top,0
U3,4.00,30.00,Top,0
U4,8.00,30.00,Top,0
U5,12.00,30.00,Top,0
U6,4.00,8.00,Top,0
U7,12.00,6.00,Top,0
U8,18.00,6.00,Top,0
U9,24.00,6.00,Top,0
J1,18.00,3.00,Bottom,0
J2,28.00,18.00,Top,90
J3,32.00,18.00,Top,90
J4,28.00,10.00,Top,0
SW1,30.00,8.00,Top,0
...
```

All coordinates in mm from bottom-left corner of the board.

---

## 5. Assembly Notes

Include `assembly_notes.txt` with:

```
COSMO® Computer CC-1 — PCBWay Assembly Notes
Project: LOT Systems, Inc.
Order Qty: 110 boards

SPECIAL INSTRUCTIONS:
1. Panelization: Not required. Single boards acceptable.
2. ESP32-S3FN8 (U1): Handle with ESD precautions. QFN56 requires
   controlled reflow profile (see below).
3. BQ51013BRHLR (U6): QFN-16 0.5mm pitch. Inspect solder joints
   under X-ray if possible.
4. Qi coil (L2): Placed AFTER main SMT on a separate step.
   Coil is hand-placed and adhesive-bonded to bottom of PCB.
5. FPC connectors (J2, J3, J4): Verify correct polarity before assembly.
6. Camera (OV2640): NOT placed by PCBWay. Installed at final assembly.
7. Display module: NOT placed by PCBWay. Installed at final assembly.
8. Battery: NOT placed by PCBWay. Installed at final assembly.
9. USB-C (J1): Bottom-side component. Ensure clearance for edge cutout.

REFLOW PROFILE (Lead-Free HASL):
- Preheat: 150°C, ramp 1–3°C/s
- Soak: 180°C for 60s
- Reflow: 245°C peak, 30s above 217°C
- Cooldown: Natural, ≤ 3°C/s

AOI: Request full AOI (Automated Optical Inspection) on all boards.
X-Ray: Request X-ray on U1 (QFN) and U6 (QFN) BGA joints.

CONTACT: hardware@lot-systems.com
```

---

## 6. CNC Enclosure (via PCBWay CNC Service)

PCBWay also offers CNC machining services. Submit the enclosure order separately at:
**pcbway.com → CNC Machining**

### Part 1: Back Shell (Side A — Polished)

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Quantity | 110 |
| Dimensions | 40 × 40 × 3.0 mm |
| Finish | Mirror polish (Ra < 0.05 µm) — request electropolish + manual buff |
| Tolerances | ±0.05 mm on critical fits |
| Features | 4× M1.4 threaded inserts, 2 mm deep cavity |
| File format | STEP (.stp) + PDF drawing |
| Notes | Mirror finish on exterior (Side A only). Interior: bead blast. |

### Part 2: Front Frame (Side B — Brushed)

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Quantity | 110 |
| Dimensions | 40 × 40 × 2.5 mm |
| Finish | Satin brush, 320 grit (Ra 0.4–0.8 µm) |
| Tolerances | ±0.05 mm on window and button cutouts |
| Features | 30×30 mm window cutout, 5 mm camera aperture, 4 mm button aperture, 2.5 mm USB-C notch |
| Notes | Laser-engrave LOT logo on Side B interior (subtle, not visible externally). |

### Wireless Charger Dock

| Parameter | Value |
|-----------|-------|
| Material | 316L Stainless Steel |
| Quantity | 110 |
| Dimensions | 50 × 50 × 8 mm |
| Finish | Satin brush (matching device Side B) |
| Features | Centered recess (40.2 × 40.2 × 1 mm) for device to sit in, USB-C port slot |

---

## 7. PCBWay Order Checklist

Before submitting:

- [ ] Gerber files verified in Gerber viewer (gerbv or KiCad)
- [ ] Board outline confirmed as 36 × 36 mm closed polygon
- [ ] All drill holes present in .drl file
- [ ] BOM columns match PCBWay template
- [ ] All LCSC part numbers verified as in-stock
- [ ] Pick-and-place file coordinates verified against schematic
- [ ] Camera, display, battery marked "Not Placed" in BOM
- [ ] Assembly notes attached as PDF
- [ ] Engineering pilot (5 units) ordered first before full 100-unit run

---

## 8. Estimated Pricing (PCBWay Quote)

Request formal quote from PCBWay for exact pricing. Estimates based on March 2026 pricing:

| Item | Qty | Estimate |
|------|-----|---------|
| PCB fabrication (4L, ENIG, 36×36mm) | 110 | $220 |
| SMT assembly + AOI | 110 | $1,400 |
| Component procurement (PCBWay sources) | 110 sets | $520 |
| CNC back shell (316L, polished) | 110 | $2,420 |
| CNC front frame (316L, brushed) | 110 | $1,980 |
| CNC charger dock (316L, brushed) | 110 | $880 |
| DHL shipping (to USA) | 1 shipment | $280 |
| **Subtotal** | | **$7,700** |

*Note: This is PCBWay's portion only. Does not include camera, display, battery (installed locally), packaging, or tooling.*

---

## 9. Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Gerber verification + quote approval | 3 days | PCBWay reviews files |
| PCB fabrication | 5 days | 4-layer board production |
| Component procurement | 5–7 days | PCBWay sources from LCSC |
| SMT assembly | 3 days | Placement + reflow + AOI |
| CNC machining (enclosures) | 10–14 days | Parallel with PCB |
| QC + shipping | 5 days | DHL to USA |
| **Total from order to receipt** | **~30–35 days** | |

Recommended: Place PCBWay order at the start of Week 1. Receive boards end of Week 5. Local assembly (camera, display, battery, enclosure) in Week 6.

---

*© 2026 LOT Systems, Inc. — Proprietary and Confidential*
*COSMO® Computer CC-1 — PCBWay Guide v1.0*
