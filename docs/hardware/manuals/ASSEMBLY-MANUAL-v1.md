# COSMO® CIA Device — Assembly Manual v1.0

**Document:** Assembly Manual  
**Device:** COSMO® CIA v1  
**Classification:** Manufacturing / Internal  
**Date:** 2026-06-16  
*PDF-Ready Document — For Assembly Line Use*  

---

## Safety

- ESD wrist strap required for all PCB handling
- Stainless steel parts have sharp edges — wear cut-resistant gloves
- Battery handling: no puncture, no short circuit, no high heat near cell
- Work in a clean, dust-free environment (Class 10,000 minimum)

---

## Required Tools

| Tool | Specification |
|------|--------------|
| Torque driver | 0–0.1 N·m range, M1.2 bit |
| Tweezers | ESD-safe, stainless, curved |
| UV curing wand | 365nm, 3W |
| UV adhesive dispenser | Nordson EFD 10cc |
| Magnification | 5× loupe or stereo microscope |
| Multimeter | 4½ digit, continuity + voltage |
| USB-C programming jig | Custom fixture (see Jig Drawing CIA-JIG-001) |
| Qi test pad | 5W Qi transmitter pad for charge test |
| Calipers | 0.01mm digital |

---

## Assembly Sequence

### Step 1 — Incoming Inspection

**PCB + PCBA (received from PCBWay):**
- [ ] Visual inspection under 5× magnification — no bridges, lifted pads, missing parts
- [ ] Verify part count against BOM
- [ ] QR code readable (laser-marked traceability)

**Enclosure parts:**
- [ ] Part A (back cover) — mirror finish, no scratches, PEEK window flush
- [ ] Part B (front housing) — apertures clear, screw bosses intact
- [ ] Measure total height with calipers: 5.00 ± 0.05 mm when assembled

**Battery:**
- [ ] Voltage: 3.7V ± 0.1V (fully discharged storage state acceptable)
- [ ] No swelling, no damage to flex leads

---

### Step 2 — PCB Preparation

1. Remove PCB from ESD bag
2. Inspect all connections under magnification
3. Verify ESP32-S3-MINI-1 module is fully soldered (no lifted pins)
4. Verify BME680, LSM6DSOX, BQ25120A, STWLC33 are present and soldered
5. Check OV2640 camera module connector is fully seated

---

### Step 3 — Battery Connection

1. Place battery (LiPo 240mAh) on PCB — flat side down
2. Route flex lead through PCB slot
3. Connect JST connector to P1 (battery header) — listen for click
4. Apply 3M 4932 foam pad (10×15mm) between battery and PCB to prevent vibration
5. Multimeter check: Battery+ to GND = 3.7V ± 0.1V (confirms connection)

---

### Step 4 — Display Module

1. Apply UV adhesive (3M DP105) to screen aperture rim in Part B — thin bead (0.3mm)
2. Insert 1.1" TFT IPS display module from inside Part B (screen faces out)
3. Align: screen must be flush with aperture edges ± 0.2mm
4. Cure UV adhesive: 365nm wand, 30 seconds, 5cm distance
5. Connect FPC ribbon cable from display to PCB connector J2 — fold carefully (min radius 3mm)

---

### Step 5 — Sapphire Glass (Screen Window)

1. Clean screen surface with IPA wipe, lint-free cloth
2. Clean 24×24mm sapphire glass piece with IPA
3. Apply LOCA (Liquid Optical Clear Adhesive) to back of sapphire glass — thin uniform coat
4. Align sapphire glass over screen aperture from outside of Part B
5. Press flush — 0.5mm glass should sit flush or 0.1mm below rim
6. UV cure: 365nm, 60 seconds, full coverage
7. Wipe any adhesive squeeze-out with IPA

---

### Step 6 — Camera Lens

1. Apply UV adhesive (small dot) around 4mm camera hole in Part B (inside)
2. Thread OV2640 camera module lens through hole from inside
3. Align lens flush with outer surface
4. Cure UV, 30 seconds
5. Apply optical glass window (4mm circle) over hole from outside
6. UV cure, 60 seconds
7. Verify camera field of view is unobstructed (check with phone/mirror)

---

### Step 7 — Qi Coil Installation (Part A — Back Cover)

1. Clean inside of PEEK window with IPA
2. Apply 3M VHB 4932 tape to Qi coil (30mm) flex side
3. Center Qi coil on PEEK window — peel VHB backing, press firmly
4. Connect Qi coil flex lead to PCB connector J5 (STWLC33 coil input)
5. Verify coil is flat — no wrinkles, no air bubbles under VHB

---

### Step 8 — PCB Sub-Assembly into Part B

1. Place PCB (with battery, display FPC connected) into Part B front housing
2. Align PCB mounting holes to 4× M1.2 screw bosses
3. Insert 4× M1.2 × 2mm countersunk stainless screws
4. Torque to 0.05 N·m — do not overtighten (brass inserts in PEEK bosses)
5. Verify PCB is seated flat — no flex or bowing

---

### Step 9 — Silicone Gasket

1. Place die-cut silicone gasket (0.3mm, IP54) on the mating face of Part B
2. Verify gasket is seated in channel groove around perimeter
3. No twists, no gaps in gasket

---

### Step 10 — Close Enclosure (Part A onto Part B)

1. Position Part B (front) face-down on ESD mat
2. Lower Part A (back cover) onto Part B — PEEK window faces up (away from PCB)
3. Verify 4× screw hole alignment
4. Insert 4× M1.2 × 2mm screws through Part A holes into Part B threaded bosses
5. Torque all 4 screws to 0.05 N·m in cross pattern (front-left → back-right → front-right → back-left)
6. Verify flush mating: gap < 0.1mm on all 4 sides (use feeler gauge or calipers)

---

### Step 11 — Button Installation

1. Stainless steel button cap is pre-assembled on TS1109F during PCBA
2. Verify button sits flush with or 0.1mm below Part B surface
3. Press test: button should click with 160gf actuation, 0.3mm travel
4. Button must not stick or bind in housing

---

### Step 12 — Firmware Flash

1. Place assembled unit on programming jig (CIA-JIG-001) — USB-C pogo pins contact USB-D+/D- pads
2. Run flash script:
   ```bash
   ./flash_unit.sh CIA-SERIALNUMBER
   ```
3. Script flashes firmware v1.0.0, writes serial number to NVS, verifies boot
4. Unit displays boot logo, then "CIA Ready"
5. Mark unit as "Flashed" in production tracking spreadsheet

---

### Step 13 — QA Test (100% of units)

Run the full QA test protocol (see `docs/hardware/QA-TEST-PROTOCOL-v1.md`):

- [ ] Power on — boot in < 5 seconds
- [ ] WiFi — connect to QA test AP, RSSI > -70 dBm
- [ ] Display — full RGB pattern test
- [ ] Copy button — 5× press, 5× events logged to QA endpoint
- [ ] BME680 — temp in range 20 ± 8°C, RH 20–80%
- [ ] LSM6DSOX — double-tap gesture detected
- [ ] OV2640 — 320×240 JPEG frame captured, non-black
- [ ] Qi charging — place on QA dock, SoC increase confirmed
- [ ] Battery life estimate — 2-hour accelerated drain test (optional, 10% sample)

---

### Step 14 — Final Inspection

1. Visual: no scratches on mirror back, no smudges on screen
2. Verify all 4 screws flush
3. Clean mirror back with microfiber cloth
4. Apply protective film (peel-off) to mirror back for shipping
5. Apply label with serial number to protective film

---

### Step 15 — Packaging

1. Place CIA Device in foam insert (mirror side into cavity)
2. Place charging dock in opposite cavity
3. Place USB-C cable in bottom compartment
4. Place quick start card on top
5. Close box — apply LOT Systems seal sticker
6. Add serial number label to outside of box

---

## Torque Reference

| Fastener | Location | Torque |
|----------|----------|--------|
| M1.2 × 2mm (PCB to Part B) | 4× PCB mounting | 0.05 N·m |
| M1.2 × 2mm (Part A to Part B) | 4× enclosure close | 0.05 N·m |

---

## Adhesive Reference

| Adhesive | Location | Cure |
|----------|----------|------|
| UV adhesive DP105 | Display rim | UV 365nm 30s |
| LOCA | Sapphire glass | UV 365nm 60s |
| 3M VHB 4932 | Qi coil to PEEK | Pressure bond |
| UV adhesive DP105 | Camera lens | UV 365nm 60s |

---

*Document: ASSEMBLY-MANUAL-v1.md*  
*Generated: 2026-06-16*  
*© 2026 LOT Systems Corporation / COSMO® CIA*
