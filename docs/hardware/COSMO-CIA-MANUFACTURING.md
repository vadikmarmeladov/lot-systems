# COSMO® CIA — Manufacturing Guide
## PCBWay PCB + PCBA + CNC Enclosure · 100-Unit Run
**Version:** 1.0  
**Date:** 2026-05-26

---

## 1. Manufacturing Partner: PCBWay

All manufacturing (PCB, PCBA, and CNC stainless steel enclosure) is consolidated at PCBWay.

| Portal | URL |
|--------|-----|
| PCB + PCBA orders | https://www.pcbway.com/orderonline.aspx |
| CNC machining | https://www.pcbway.com/rapid-prototyping/manufacture/ |
| Quote upload | https://www.pcbway.com/quotespcbassembly.aspx |
| Account manager | Request dedicated account manager for 100-unit run |

---

## 2. PCB Fabrication Specification

Submit Gerber files to PCBWay with the following spec:

| Parameter | Value |
|-----------|-------|
| Board dimensions | 38.0 × 38.0 mm |
| Layer count | 4 |
| Stackup | Top Cu / Core / Prepreg / Bottom Cu |
| Board thickness | 0.8 mm |
| Copper weight (outer) | 1 oz (35µm) |
| Copper weight (inner) | 0.5 oz (17.5µm) |
| Min trace width | 4 mil (0.1016 mm) |
| Min trace spacing | 4 mil (0.1016 mm) |
| Min via drill | 0.2 mm |
| Min via annular ring | 0.15 mm |
| Surface finish | HASL Lead-Free (HASL-LF) |
| Soldermask color | **Black** |
| Silkscreen color | **White** |
| Edge connector | No |
| Impedance control | Yes — 50Ω differential for camera DVP lines (inner layers) |
| Quantity | 110 boards (100 production + 10 spare) |
| IPC Class | Class 2 |

### Gerber File Package
Upload as ZIP to PCBWay:
```
gerbers/
├── cosmo_cia_F_Cu.gbr       ← Front copper
├── cosmo_cia_B_Cu.gbr       ← Back copper
├── cosmo_cia_In1_Cu.gbr     ← Inner layer 1 (GND plane)
├── cosmo_cia_In2_Cu.gbr     ← Inner layer 2 (PWR plane)
├── cosmo_cia_F_Mask.gbr     ← Front soldermask
├── cosmo_cia_B_Mask.gbr     ← Back soldermask
├── cosmo_cia_F_SilkS.gbr    ← Front silkscreen
├── cosmo_cia_B_SilkS.gbr    ← Back silkscreen
├── cosmo_cia_Edge_Cuts.gbr  ← Board outline
├── cosmo_cia.drl            ← Drill file (Excellon format)
└── cosmo_cia_NPTH.drl       ← Non-plated holes
```

---

## 3. PCB Assembly (PCBA) Specification

PCBWay SMT assembly service. Upload BOM + CPL (Component Placement List).

### Assembly Spec

| Parameter | Value |
|-----------|-------|
| Assembly type | SMT both sides (double-sided) |
| THT components | None |
| Solder paste | SAC305 lead-free |
| Reflow profile | Per component requirements (see below) |
| X-ray inspection | Yes — BGA/LGA components |
| AOI (Automated Optical Inspection) | Yes — both sides |
| IPC Class | Class 2 |
| Conformal coat | No (device is not waterproof in v1) |

### Reflow Profile (SAC305)
```
Preheat:    150°C → 200°C over 60–90s
Soak:       200°C for 60–90s
Reflow:     Peak 250°C (30s above 235°C liquidus)
Cooling:    Natural convection ≥ 3°C/s
```

### BOM Format for PCBWay
Export from KiCad as CSV:
```
Reference,Qty,Value,Manufacturer,MPN,Package,Description
U1,1,ESP32-S3-WROOM-1-N8,Espressif,ESP32-S3-WROOM-1-N8,Module,WiFi+BLE SoM
U2,1,BME688,Bosch,BME688,LGA-8-3x3,Environmental sensor AI
U3,1,ICM-42688-P,TDK,ICM-42688-P,LGA-14-3x3,6-axis IMU
U4,1,BQ51050B,TI,BQ51050BRHLR,VQFN-16,Qi receiver
U5,1,BQ24079RGTT,TI,BQ24079RGTT,VQFN-16,LiPo charger
...
```

### CPL Format for PCBWay
Export from KiCad as CSV:
```
Reference,PosX,PosY,Rotation,Side
U1,19.00,19.00,0,Top
U2,5.50,32.00,0,Top
...
```

### Components NOT in PCBA BOM (hand-assembled after):
- OV2640 camera module (FPC connector — attach after PCBA)
- TFT display module (FPC connector — attach after PCBA)
- LiPo battery (JST-PH 2mm connector — attach after PCBA)
- Qi coil (soldered wires — attach after PCBA)

---

## 4. CNC Stainless Steel Enclosure

### 4.1 Material

| Spec | Value |
|------|-------|
| Alloy | 316L stainless steel (low carbon, non-magnetic) |
| Hardness | Annealed (soft) for machining |
| Density | 8.0 g/cm³ |
| Reason for 316L | Corrosion resistance, premium tactile feel, no magnetic interference with Qi coil |

### 4.2 Part 1: Polished Front Cover

| Feature | Spec |
|---------|------|
| Outer dimensions | 40.0 × 40.0 mm |
| Thickness | 0.8 mm |
| Corner radius (outer) | R3.0 mm |
| Inner pocket | 38.0 × 38.0 × 0.3 mm (for PCB seating lip) |
| Logo laser etch | "COSMO®" centered, 2mm height, 0.05mm depth |
| Surface finish | Mirror polished (Ra ≤ 0.1µm) — all visible faces |
| Edge finish | Chamfer 0.3 × 45° |
| Qty | 100 pcs |

### 4.3 Part 2: Brushed Back Panel

| Feature | Spec |
|---------|------|
| Outer dimensions | 40.0 × 40.0 mm |
| Thickness | 0.8 mm |
| Corner radius (outer) | R3.0 mm |
| Surface finish | Brushed satin (Ra 0.4–0.8µm) — horizontal grain |
| Aperture — Camera | Ø8.0 mm circular, centered at X=8, Y=20 from left |
| Window — Screen | 26.0 × 16.0 mm rectangular, centered at X=27, Y=20, R1.0mm corners |
| Aperture — Button | Ø4.0 mm circular, X=32, Y=32 |
| Slot — LED indicator | 2.0 × 1.0 mm, X=6, Y=34 |
| Retention tabs | 4× snap-fit tabs, 1.0mm wide × 0.5mm deep, one per side |
| Antenna window | 6.0 × 3.0 mm slot, X=19, Y=2 (for ESP32-S3 PCB antenna clearance) |
| Qty | 100 pcs |

### 4.4 PCBWay CNC Upload

Upload STEP files:
```
enclosure/
├── cosmo_cia_front_cover_v1.step    ← Mirror polished
├── cosmo_cia_back_panel_v1.step     ← Brushed + all cutouts
├── cosmo_cia_assembly_v1.step       ← Full assembly reference
└── cosmo_cia_drawing_v1.pdf         ← 2D engineering drawing with tolerances
```

### 4.5 Tolerances

| Feature | Tolerance |
|---------|-----------|
| Overall dimensions | ±0.1 mm |
| Aperture positions | ±0.05 mm |
| Snap-fit tabs | ±0.03 mm |
| Panel thickness | ±0.05 mm |
| Surface finish Ra | ±20% |

---

## 5. Assembly Process (Post-PCBA)

Manual assembly steps performed after receiving PCBA boards and enclosure parts:

```
Step 1: Inspect PCB
  - Visual check: all SMT components placed
  - X-ray check results reviewed
  - Power-on test: 3.3V rail present

Step 2: Attach FPC modules
  - Insert OV2640 FPC into camera connector
  - Insert TFT display FPC into display connector
  - Verify connections (no bent pins)

Step 3: Attach coil + battery
  - Solder Qi coil wires (red=+, black=−) to designated pads
  - Connect LiPo battery JST-PH connector
  - Verify polarity before connecting

Step 4: Flash firmware
  - Connect USB-C jig to board
  - Run: idf.py -p /dev/ttyUSBx flash
  - Verify boot screen displays firmware version
  - Verify WiFi connects (test AP)
  - Run QC test script (automated): python cosmo_qc.py

Step 5: Provisioning
  - Burn serial number to eFuse: esptool.py burn_efuse ...
  - Register device in LOT Systems DB: python provision_device.py COSMO_XXX

Step 6: Enclosure assembly
  - Place PCB into back panel (camera aligns to aperture)
  - Route display FPC through screen window
  - Press-fit front cover (4 snap-tabs click)
  - Verify no rattle

Step 7: Final QC inspection
  - Polish front cover (microfiber cloth)
  - Check all apertures aligned
  - Verify button tactile response
  - Wireless charge test (place on Qi pad, LED lights)

Step 8: Package
  - Place in foam insert
  - Add charger + USB-C cable + quick-start card
  - Seal card sleeve
```

---

## 6. QC Test Script

Automated QC via USB serial connection before enclosure assembly:

```python
# cosmo_qc.py
# Connects to COSMO device via serial, runs all subsystem checks

tests = [
    ("WiFi connect", "wifi_test"),
    ("BME688 reading", "bme688_test"),
    ("OV2640 capture", "camera_test"),
    ("Display draw", "display_test"),
    ("IMU reading", "imu_test"),
    ("Button interrupt", "button_test"),
    ("Haptic pulse", "haptic_test"),
    ("Battery voltage", "battery_test"),
    ("Qi charging detect", "charge_test"),
    ("LOT API POST", "api_test"),
]

for name, cmd in tests:
    result = serial_command(cmd, timeout=10)
    status = "PASS" if result.startswith("OK") else "FAIL"
    print(f"  {name:<25} [{status}]  {result}")
```

Expected output (all pass):
```
  WiFi connect              [PASS]  OK -42dBm
  BME688 reading            [PASS]  OK 21.4C 58% 1013hPa IAQ42
  OV2640 capture            [PASS]  OK 1600x1200 JPEG 45KB
  Display draw              [PASS]  OK
  IMU reading               [PASS]  OK ax=0.01 ay=0.00 az=1.00
  Button interrupt          [PASS]  OK debounce=18ms
  Haptic pulse              [PASS]  OK
  Battery voltage           [PASS]  OK 3.82V 94%
  Qi charging detect        [PASS]  OK 4.98V 450mA
  LOT API POST              [PASS]  OK 200 12ms
```

---

## 7. Regulatory Notes

| Certification | Status | Notes |
|--------------|--------|-------|
| FCC (USA) | Required for WiFi | ESP32-S3-WROOM-1 is FCC pre-certified (FCC ID: 2AC7Z-ESPWROOM32) |
| CE (EU) | Required for EU sales | ESP32 module CE certified. Full system CE requires additional testing |
| RoHS | Compliant | All components must be RoHS-compliant (HASL-LF solder, lead-free) |
| WEEE | Required (EU) | Apply WEEE symbol to packaging |
| Battery (UN 38.3) | Required for shipping LiPo | Use certified LiPo supplier with UN 38.3 test report |

> For 100-unit pilot, FCC/CE certification of the complete system may be deferred. Mark units "Not for commercial sale — engineering sample" until certifications are complete.

---

## 8. Timeline with PCBWay

| Order | Lead Time | Notes |
|-------|-----------|-------|
| PCB fabrication (4-layer, 110 pcs) | 5–7 business days | Express available |
| PCB assembly (100 units, double-sided) | 10–15 business days | After component procurement |
| CNC stainless steel (100 sets) | 10–15 business days | Rush available +50% cost |
| **Total PCBWay window** | **~20–25 business days** | Parallel ordering recommended |

Order PCB + CNC simultaneously. PCBA starts after PCB is complete.

---

*Manufacturing guide v1.0 — file with PCBWay account manager before placing orders.*
