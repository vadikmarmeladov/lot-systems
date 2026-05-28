<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Assembly Guide

**Document:** ASSEMBLY-GUIDE.md
**Revision:** 1.0
**Date:** May 28, 2026
**Project:** COSMO® Computer CC-1
**Scope:** Final assembly after PCBWay delivery

---

## 1. Required Tools

| Tool | Purpose |
|------|---------|
| JIS #000 screwdriver | M1.4 screws |
| Tweezers (ESD-safe) | Small components |
| ESD wrist strap | ESP32-S3 protection |
| Isopropyl alcohol 99% + swabs | PCB cleaning |
| Kapton tape | Insulation |
| Hot glue gun (low temp) | Camera, battery retention |
| FPC insertion tool | ZIF connector handling |
| Torque driver 2 N·cm | M1.4 screw torque |
| Loctite 243 (medium) | Thread lock on screws |
| Multimeter | Voltage check before battery connect |
| USB-C cable + laptop | Firmware flash + QC test |

---

## 2. Incoming Inspection

Before starting assembly, inspect all parts:

**PCBWay PCBs:**
- [ ] ENIG finish gold-colored, no oxidation
- [ ] No missing or misaligned SMT components (visible under 10× loupe)
- [ ] No solder bridges (especially U1 ESP32, U6 BQ51013)
- [ ] USB-C connector flush with board edge
- [ ] All FPC connectors (J2, J3, J4) present and undamaged

**CNC Enclosures:**
- [ ] Side A mirror finish — no scratches, inspect in raking light
- [ ] Side B brush finish uniform, no deep marks
- [ ] All cutouts within tolerance (verify with digital calipers)
- [ ] M1.4 threaded inserts present and thread-tested
- [ ] Camera aperture 5.0 mm ± 0.1 mm
- [ ] OLED window 30.0 × 30.0 mm ± 0.1 mm

**Batteries:**
- [ ] LP402035, 250 mAh, PCM protected
- [ ] Voltage 3.6–3.7 V at delivery (healthy storage charge)
- [ ] No swelling or physical damage

---

## 3. Assembly Sequence

### Step 1: PCB Preparation

1. Clean PCB with IPA 99% + lint-free swab.
2. Allow to dry completely (2 min).
3. Attach ESD wrist strap.

### Step 2: Camera Module Installation

1. Remove ZIF latch on J4 (camera connector) by lifting gently with tweezers.
2. Insert OV2640 FPC cable (shiny contacts facing down toward PCB) fully into J4.
3. Press ZIF latch closed — you will feel a click.
4. Verify: gently tug cable — it should not pull free.
5. Fold camera module flat against PCB surface, lens facing up (Side B direction).
6. Apply small dot of low-temp hot glue to back of camera module to retain position.

### Step 3: Display Installation

1. Open ZIF latch on J2 (display connector).
2. Insert SSD1327 OLED FPC cable (shiny contacts facing down).
3. Lock ZIF latch.
4. Route FPC cable along left edge of PCB.
5. Place Gorilla Glass window into Side B OLED cutout from inside:
   - Apply thin bead of UV adhesive (Loctite AA 3926) around inside perimeter.
   - Press glass — it should be flush with outside face of Side B.
   - Cure with UV lamp (365 nm, 60 seconds).
6. Carefully position OLED display module against glass from inside Side B.
7. The OLED should press gently against glass — use a 1mm foam pad between OLED and PCB bracket to maintain pressure.

### Step 4: Battery Installation

1. Verify battery voltage with multimeter: 3.6–3.7 V. If below 3.0 V, do not use.
2. Apply double-sided foam tape (1 mm) to flat side of battery.
3. Position battery in center of PCB cavity. PCB is on top, battery below.
4. Battery should sit flat against inner surface of Side A (polished back shell).
5. Connect JST-PH 2-pin battery connector to PCB J1 — **red wire to positive terminal**.
6. Apply strip of Kapton tape over connector to prevent accidental disconnect.

### Step 5: Power-On Test (Before Closing)

**Do this before enclosing the PCB — it is much easier to debug now.**

1. Connect USB-C cable to PCB J3 (edge).
2. Observe:
   - Internal green LED (charge indicator) lights amber during charging.
   - OLED displays "LOT." boot screen within 3 seconds.
   - BME688 warm-up period: "Calibrating." shown for ~5 minutes.
3. Run QC test via laptop:
   ```bash
   python3 tools/qc_test.py --port /dev/ttyUSB0
   ```
4. All tests must pass before proceeding to enclosure.

### Step 6: Qi Coil Installation

1. Peel backing from Würth Qi receiver coil.
2. Center coil on inner face of Side A back shell.
3. Place PTFE gasket (38×38mm, 0.3mm) around coil perimeter to isolate from steel frame.
4. The coil wire leads pass through a small notch in the PCB bracket and connect to TP4056 coil pads.
5. Solder coil leads to designated pads (marked QI+ and QI-) using fine-tip iron at 280°C.
6. Test Qi charging: place on dock, confirm LED turns amber.

### Step 7: PCB to Enclosure

1. Insert PCB assembly (PCB + camera + display + battery + Qi coil) into Side A back shell.
2. PCB sits on 4 stainless standoffs (1.5mm height) inside Side A cavity.
3. Secure PCB with M1.4 × 3mm screws into PCB mounting holes — apply 1 drop Loctite 243 to each screw, torque to 2 N·cm.

### Step 8: Silicone Gasket

1. Place silicone gasket (39×39mm) onto perimeter ledge of Side A.
2. Gasket should sit flat and compress ~0.2mm when closed.

### Step 9: Button Cap

1. Insert tactile switch cap (plastic cap, 3.5mm Ø) through button hole in Side B.
2. The cap should sit 0.3mm proud of the surface and depress when pushed.

### Step 10: Close Enclosure

1. Align Side B (front frame) over Side A (back shell).
2. Camera aperture must align with OV2640 lens.
3. OLED must align with Gorilla Glass window.
4. Button cap must align through button hole.
5. USB-C edge notch must align with USB-C port.
6. Press Side B down onto gasket with even pressure.
7. Insert 4× M1.4 × 3mm PVD black screws through Side B corners into Side A threaded inserts.
8. Torque to 2 N·cm (snug — do not overtighten).
9. Gasket should be slightly compressed but not extruding.

### Step 11: Final QC

With enclosure closed:
1. Place on wireless charger dock — confirm charging indicator visible through side gap.
2. Press Copy button — confirm "Sent." appears on OLED.
3. Connect device to test WiFi AP — confirm LOT API connection ("Connected.").
4. Check all 4 screw heads are seated flush.
5. Inspect all surfaces for fingerprints — clean with microfiber cloth.

---

## 4. Firmware Provisioning

**Each unit requires firmware flashing and API key provisioning before final assembly (Step 5).**

```bash
# 1. Flash firmware
cd firmware/
idf.py -p /dev/ttyUSB0 -b 921600 flash

# 2. Provision device (writes API key to eFuse — irreversible)
python3 tools/provision.py \
  --port /dev/ttyUSB0 \
  --device-id CC1-$(openssl rand -hex 4 | tr a-z A-Z) \
  --register-with-lot

# The script will:
# a. Generate a unique device serial (CC1-XXXXXXXX)
# b. Generate a random 32-byte API key
# c. Burn device serial + API key hash to eFuse BLOCK1 + BLOCK3
# d. Register the device on lot-systems.com (/api/device/register)
# e. Print a label QR code for the box

# 3. Verify eFuse
python3 tools/verify_efuse.py --port /dev/ttyUSB0
```

**Record keeping:** The `provision.py` script logs each device serial and its associated LOT user ID to `docs/hardware/production-log.csv`. This is required for warranty and firmware update tracking.

---

## 5. Packaging

1. Place wireless charger dock in foam tray recess.
2. Coil USB-C cable and place in tray.
3. Place USB-C power adapter in tray.
4. Place COSMO® Computer device in tray (polished Side A facing up).
5. Place microfiber cloth over device.
6. Place quick start card on top.
7. Close outer box.
8. Apply warranty card to outside of box with sticker.
9. Scan box QR code to associate serial with order in shipping system.

---

## 6. Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| OLED does not light | FPC cable not seated | Open unit, reseat J2 |
| "No WiFi" on display | Provisioning not done | Re-run provision.py |
| Camera image all black | Camera FPC reversed | Reinstall with contacts facing down |
| Qi charging not working | Coil leads reversed | Check QI+ and QI- solder joints |
| Button press no response | Button cap misaligned | Open, realign cap |
| Unit hot to touch | Battery short | Open immediately, check Kapton insulation |
| Display cracked | Excessive screw torque | Discard unit; reduce torque on next |

---

## 7. Production Log

Maintain `docs/hardware/production-log.csv` for each unit:

```csv
unit_num,device_id,build_date,assembler,qc_pass,firmware_version,lot_user_id,shipped_to
001,CC1-A1B2C3D4,2026-07-01,VM,true,1.0.0,123,
002,CC1-B2C3D4E5,2026-07-01,VM,true,1.0.0,124,
003,CC1-C3D4E5F6,2026-07-01,VM,false,1.0.0,,Camera FPC failure
...
```

---

*© 2026 LOT Systems, Inc. — Proprietary and Confidential*
*COSMO® Computer CC-1 — Assembly Guide v1.0*
