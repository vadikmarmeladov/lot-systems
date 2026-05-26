# COSMO LOT Computer — Manufacturing Guide
## 100-Unit Production Run Protocol

**Project:** COSMO® CIA LOT Computer  
**Run:** Production Run 1  
**Units:** 100 devices + 100 chargers  
**Date:** 2026-05-26

---

## 1. Production Schedule

| Week | Activity | Location |
|---|---|---|
| W1 | Place all component orders (long-lead first) | Remote |
| W2–3 | PCB design finalized, Gerbers to PCBWay | PCBWay CN |
| W3–5 | PCBWay PCBA production (15 days) | PCBWay CN |
| W3–5 | CNC machining (stainless shells, parallel) | PCBWay CNC / Xometry |
| W5–6 | PCBA boards arrive, inspection | LOT workshop |
| W6–7 | Device assembly (100 units) | LOT workshop |
| W7 | Firmware flash (all 100 units) | LOT workshop |
| W7–8 | QC testing (all 100 units) | LOT workshop |
| W8 | Packaging | LOT workshop |
| W9 | Distribution / shipping | — |

---

## 2. Component Order Priority

Order in this sequence to account for lead times:

### Day 1 (Immediate — long-lead items)

| Item | Supplier | Qty | Lead time |
|---|---|---|---|
| Custom LiPo 380mAh (38×30×2.5mm) | Grepow | 110 | 4–6 weeks |
| OLED display SSD1327 1.3" | BuyDisplay | 110 | 3–4 weeks |
| OV2640 camera module | ArduCAM | 110 | 2–3 weeks |
| ESP32-S3-MINI-1U | Digi-Key | 110 | check stock; order immediately |
| BME688 sensors | Digi-Key | 110 | 2–3 weeks |

### Day 3 (Within first week)

| Item | Supplier | Qty | Lead time |
|---|---|---|---|
| NuVolta NU1619 Qi RX IC | LCSC | 110 | 1–2 weeks |
| BQ25185 PMIC | Digi-Key | 110 | 1–2 weeks |
| DRV2605L haptic IC | Digi-Key | 110 | 1–2 weeks |
| BMI270 IMU | LCSC | 110 | 1–2 weeks |
| TPS62840 + TPS62740 | Digi-Key | 110 | 1 week |
| USB-C connectors | Digi-Key | 110 | 1 week |

### Day 7 (After PCB layout complete)

| Item | Supplier | Qty | Lead time |
|---|---|---|---|
| PCBWay PCBA order | PCBWay | 100 | 15 business days |
| CNC shell order | PCBWay CNC | 100 sets | 15–20 business days |
| Packaging (boxes, foam) | Local supplier | 100 sets | 1 week |

---

## 3. Device Assembly Procedure

**Required tools:**
- ESD wrist strap + anti-static mat
- Soldering iron (Hakko FX-951 or equivalent, 300°C)
- UV cure lamp (for cover glass adhesive)
- Phillips P0 / JIS P00 screwdrivers
- Tweezers (ESD-safe, curved tip)
- Hot-air rework station (for QC rework only)
- Digital multimeter
- USB-C to pogo-pin jig (custom, 3D-printed)
- Laptop with `flash_jig.py` ready

---

### Step-by-Step Assembly (per unit, ~20 min)

#### Stage 1: PCBA Inspection (2 min)

1. Visual inspect PCBA for solder bridges, missing components, lifted pads
2. Continuity check: TP1 (3.3V) to TP2 (GND) — should read open circuit
3. Verify no shorts on VBAT rail (TP3) with DVM

#### Stage 2: Off-PCB Component Install (8 min)

4. **OLED display:** Connect FPC ribbon cable to ZIF connector on PCB. Ensure cable is fully seated. Lock ZIF latch.
5. **Camera module:** Insert OV2640 FPC or direct connector. Apply drop of UV-cure adhesive to cable strain-relief point.
6. **Battery:** Connect JST PH-2 battery connector (observe polarity — red=positive). Route cable along PCB edge notch.
7. **Qi coil:** Stick coil to bottom of PCB with adhesive backing. Connect 2-wire leads to PCB pads (solder).

#### Stage 3: Initial Power-On Test (2 min)

8. Without shell, apply power via USB-C cable
9. Verify: 3.3V LED glows briefly (power-on self-test)
10. Verify: Display shows "COSMO" boot logo
11. If any failure → set aside for rework queue

#### Stage 4: Firmware Flash (3 min)

12. Place PCB in USB-C pogo-pin jig
13. Run: `python flash_jig.py --device-id cosmo_XXX` (auto-increments)
14. Wait for "Flash complete" confirmation (~45 seconds)
15. Device reboots, shows "COSMO r1 fw:1.0.0"
16. Apply unit label (cosmo_001 sticker on PCB edge)

#### Stage 5: Shell Assembly (3 min)

17. Place PCB assembly into front shell (Part B — satin finish with cutouts)
18. Align screen, camera, button through shell cutouts
19. Peel backing from silicone gasket; press onto shell perimeter
20. Apply optical adhesive (Norland NOA61) around screen cutout perimeter
21. Place cover glass — press firmly, ensure no bubbles
22. UV cure for 60 seconds (365nm lamp)
23. Clip polished mirror back cap (Part A) onto front shell
24. Insert 4× M1.0 × 3mm stainless screws (torque 0.05 Nm)

#### Stage 6: Final QC Check (2 min)

25. See Section 4 (QC Protocol) below

---

## 4. QC Protocol (Per Unit)

Complete all tests. Record pass/fail on QC sheet.

| Test # | Test | Method | Pass |
|---|---|---|---|
| QC-01 | Power on | Place on Qi charger | LED on within 2s |
| QC-02 | Display | Boot screen | All pixels visible, no dead rows |
| QC-03 | Wi-Fi | Connect to test SSID "COSMO-QC" | RSSI shown on display |
| QC-04 | LOT API poll | Device connects to dev.lot-systems.com | "Connected" on display |
| QC-05 | Test notification | Send notification via admin panel | Displays within 30s |
| QC-06 | Copy button | Press button | Haptic buzz + log entry in LOT |
| QC-07 | BME688 | Read sensor via diagnostic page | Temp 18–30°C, Humidity 20–80% |
| QC-08 | Battery charge | Charge from 10% to 80% via Qi | Completes in < 2.5h |
| QC-09 | OTA test | Trigger OTA update to fw:1.0.1 | Updates successfully |
| QC-10 | Physical | Inspect exterior | No scratches, gaps, loose screws |

**QC sheet columns:** Unit ID | Date | Tester | QC01–10 | Pass/Fail | Notes

**Fail thresholds:**
- Any of QC-01 through QC-06 = immediate rework
- QC-07: sensor out of range = likely placement issue, rework
- QC-10: cosmetic issues = minor (accept with note) or fail (rework shell)

---

## 5. Charger Assembly

The companion wireless charger is a separate assembly.

### Charger components per unit

| Component | Qty |
|---|---|
| P9242-R Qi TX IC + PCB sub-assembly | 1 |
| 50mm Tx coil | 1 |
| 316L stainless disk shell (60mm dia × 6mm) | 1 |
| USB-C cable (1m) | 1 |
| White LED ring PCB | 1 |

### Charger assembly (5 min/unit)

1. Inspect TX PCB (factory assembled)
2. Solder coil leads to TX PCB pads
3. Stick coil inside stainless disk with thermal adhesive
4. Snap shell halves together (press fit + 3× M1.0 screws from bottom)
5. Connect USB-C cable
6. Test: place COSMO device on charger → battery LED should turn orange (charging)

---

## 6. Firmware Flash Jig Design

### Jig schematic

```
[Laptop USB-C] → [CH340G USB-UART] → [Pogo pins: TX, RX, GND, 3.3V, EN, BOOT]
                                              ↓
                                    [PCB testpoint array]
```

### 3D-print jig housing

- Designed in FreeCAD
- Holds PCB assembly (without shell) in precise alignment
- 6 spring-loaded pogo pins contact TP4 (TX), TP5 (RX), TP1 (3.3V), TP2 (GND) + EN + BOOT pads
- File: `hardware/cad/flash_jig_v1.stl`

### Batch flash script

```bash
# flash_jig.py usage
python tools/flash_jig.py \
  --firmware build/lot_computer_v1.0.0.bin \
  --nvs-csv provisioning/devices.csv \
  --port /dev/ttyUSB0

# devices.csv format:
# device_id,device_name,user_id
# cosmo_001,Vadik's COSMO,1
# cosmo_002,LOT R&D Unit 1,1
# ...
```

Script actions per device:
1. Erase flash
2. Write partition table
3. Write firmware binary
4. Write NVS partition (device_id, device_name, api_url)
5. Verify checksum
6. Print: "cosmo_XXX: DONE"

---

## 7. Packaging & Labeling

### Box contents (per unit)

| Item | Qty |
|---|---|
| COSMO LOT Computer device | 1 |
| Wireless charger pad | 1 |
| USB-C cable (1m) | 1 |
| Quick-start card (credit card format) | 1 |

### Box label (printed on lid)

```
COSMO®
LOT Computer
Unit: cosmo_XXX
FW: 1.0.0
© 2026 LOT Systems
```

### Quick-start card

Front: "Welcome to COSMO" + 3-step setup diagram  
Back: QR code → lot-systems.com/hardware/setup

---

## 8. Distribution Tracker

Maintain `production/units.csv`:

```
device_id,status,assigned_to,shipped_at,tracking
cosmo_001,assembled,vadik,,
cosmo_002,qc_pass,r&d,,
cosmo_003,shipped,user_42,2026-12-01,DHL1234567
...
```

---

## 9. Post-Run 1 Retrospective

After all 100 units ship, document:
- Actual per-unit assembly time (vs. 20 min estimate)
- QC failure rate (target: < 3%)
- Most common assembly defect
- Battery life vs. 48h estimate (actual user reports)
- Design changes needed for Run 2

---

*COSMO® CIA — LOT Systems — Manufacturing Guide v1.0 — 2026-05-26*
