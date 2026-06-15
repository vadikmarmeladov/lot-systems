<!--
  LOT SYSTEMS CORPORATION — COSMO® CIA
  Manufacturing Specification v1.0
  Prepared: 2026-06-15
-->

# COSMO® CIA — Manufacturing Specification v1.0

**Classification:** Internal — Manufacturing
**Run:** 100 units (pilot)
**Manufacturer:** PCBWay (PCB + SMT + CNC)

---

## 1. Bill of Materials (Full)

See `docs/corporate/LOT_COSMO_COMPUTER_HARDWARE_v1.md` Section 3 for the complete BOM with supplier links and pricing.

---

## 2. PCBWay Order — PCB Fabrication

Submit Gerber files + drill files (KiCad 7 or Eagle export):

```
Gerber layers required:
  F_Cu.gbr         (Top copper)
  In1_Cu.gbr       (GND plane)
  In2_Cu.gbr       (PWR plane)
  B_Cu.gbr         (Bottom copper)
  F_Mask.gbr       (Top solder mask)
  B_Mask.gbr       (Bottom solder mask)
  F_Silkscreen.gbr (Top silkscreen)
  Edge_Cuts.gbr    (Board outline)
  drill.drl        (Through-hole + via drill)
```

PCBWay order parameters (https://www.pcbway.com/orderonline.aspx):
- Layers: 4
- Dimensions: 38.5mm × 38.5mm
- Quantity: 110 (100 production + 10 spare)
- PCB thickness: 0.8mm
- Surface finish: ENIG
- Solder mask: Black
- Min track/spacing: 4/4 mil
- Min drill: 0.2mm (laser via)
- Via process: Tented
- IPC standard: IPC Class 2

Estimated cost (110 pcs): ~$350 USD
Lead time: ~7–10 working days

---

## 3. PCBWay Order — SMT Assembly

Submit:
- Assembled Gerbers (from step above)
- Pick-and-place CSV (centroid file)
- BOM CSV (PN, manufacturer PN, value, package, quantity)

Parameters:
- Assembly type: Full turnkey (PCBWay sources all components)
- Assembly side: Top only
- Solder paste: SAC305 lead-free
- Reflow profile: Per IPC-7711/7721 for mixed package sizes
- X-ray inspection: Required for BQ51013B (VQFN-20)
- AOI: Yes (all boards)
- Flying probe electrical test: Yes
- Programming: Not included (done post-assembly by LOT team)

Estimated cost (100 assembled boards): ~$600 USD
Lead time: ~14–18 working days (combined with PCB lead time)

---

## 4. PCBWay CNC — Stainless Enclosure

Submit STEP files (2 files: top shell, bottom shell).

Order parameters for each shell:
- Material: 316L stainless steel
- Finish — front shell exterior: Bead blast (Ra 0.8µm)
- Finish — back shell exterior: Mirror polish (Ra < 0.05µm)
- Finish — all interior surfaces: As-machined (Ra 3.2µm)
- Tolerance: ±0.05mm on critical fits (PCB pocket, glass recess)
- Quantity: 110 sets (220 parts total)

Key dimensions to verify in samples:
- Overall assembled: 40.00mm × 40.00mm × 5.00mm ±0.1mm
- PCB pocket depth: 3.6mm ±0.05mm
- Battery pocket depth: 4.0mm ±0.05mm
- Glass recess: 35.0mm × 35.0mm × 0.55mm deep ±0.02mm
- Camera aperture: Ø3.5mm ±0.05mm, countersunk 120° × 0.3mm
- Button cutout: 4.0mm × 4.0mm ±0.1mm

Estimated cost (110 sets): ~$1,980 USD
Lead time: ~15–20 working days

---

## 5. Assembly Sequence

Performed at LOT Systems facility after receipt from PCBWay:

```
STEP 1 — Incoming inspection
  □ PCBs: visual + AOI report review, dimensional spot-check (10%)
  □ Enclosures: 100% dimensional check on critical fits
  □ Reject: any PCB with lifted pads, shorts on X-ray
  □ Reject: any shell with surface defects on mirror face

STEP 2 — Pre-flash PCBs (firmware v1.0)
  □ Connect UART test jig to each PCB (via test pads)
  □ Run esptool.py flash script (batch mode)
  □ Verify: device boots, shows LOT logo, responds to UART `status`
  □ Mark pass with label on PCB edge

STEP 3 — Bond camera FPC
  □ Align OV2640 FPC to J2 connector on PCB
  □ Lock ZIF lever
  □ Verify: UART `camera` command shows capture response

STEP 4 — Bond display FPC
  □ Align SSD1306 FPC to J1 connector on PCB
  □ Lock ZIF lever
  □ Verify: display shows test pattern (vertical stripes)

STEP 5 — Bond Qi coil to back shell
  □ Clean inner surface of back shell with IPA
  □ Peel 3M 9472LE liner from coil
  □ Centre coil on inner back shell, press firm for 30s
  □ Coil wires route to battery pocket edge

STEP 6 — Install battery
  □ Connect battery JST connector to J3 on PCB
  □ Secure battery in machined pocket with 3M VHB tape strip
  □ Verify: battery connector seated, not under strain

STEP 7 — Fit PCB into back shell
  □ Lower PCB assembly into back shell pocket
  □ Align: camera hole aligns to aperture, button aligns to cutout
  □ PCB rests on 4× nylon standoffs (0.3mm height) in shell pocket

STEP 8 — Install glass window into front shell
  □ Clean glass and front shell recess with IPA
  □ Apply UV adhesive (Loctite 3494) to recess perimeter
  □ Place glass into recess, apply 30s UV lamp cure
  □ Inspect: no bubbles, glass flush with front face

STEP 9 — Join shells
  □ Align front shell over back shell
  □ Engage snap-fit tabs (4 corners)
  □ Drive 2× M1.2 countersunk screws (Torx T2, 0.5 N·m)
  □ Inspect seam: hairline gap ≤ 0.1mm uniform

STEP 10 — Laser serial number
  □ Fibre laser mark on back edge (0.5mm text, 1 line):
    `CIA-{4-digit year}-{5-digit serial}` e.g. `CIA-2026-00001`
  □ Mark is 0.1mm deep, does not penetrate shell wall

STEP 11 — Functional test
  □ See Section 6 (Functional Test Checklist)

STEP 12 — Burn-in
  □ 24h continuous operation on Wi-Fi, polling notifications
  □ Monitor for reboots (zero expected)
  □ Monitor for thermal — back shell must stay < 40°C

STEP 13 — Final inspection + packaging
  □ Clean both surfaces with lint-free microfibre
  □ Inspect mirror back: zero fingerprints, zero scratches
  □ Place in foam insert (polished face protected by foam contact sheet)
  □ Pack box, seal
```

---

## 6. Functional Test Checklist

Run after Step 9 (assembled unit) and after Step 12 (burn-in):

| # | Test | Pass Criteria |
|---|------|--------------|
| 1 | Power on | Boots in < 3s, shows LOT logo |
| 2 | Display | Shows test pattern cleanly, no dead pixels |
| 3 | Wi-Fi connect | Connects to test AP in < 30s |
| 4 | API ping | `device-ping` returns 200 |
| 5 | Notification fetch | At least 1 test notification displayed |
| 6 | Copy button single press | Log entry created on test account |
| 7 | Button LED | Flashes on notification, steady during charging |
| 8 | Camera capture | JPEG captured, uploads to LOT account |
| 9 | BME688 sensor | Temp reading ±2°C of reference thermometer |
| 10 | BME688 IAQ | IAQ accuracy reaches ≥ 2 within 10 minutes |
| 11 | Qi charging | Charges at 5W when placed on pad (STAT pin low) |
| 12 | Battery ADC | Reads within ±5% of bench measurement |
| 13 | Long press 3s | Enters provisioning mode (BLE advertising detected) |
| 14 | QSPI flash | Session log write/read round-trip via UART command |
| 15 | OTA check | Firmware check endpoint returns 200 |
| 16 | Seam inspection | Hairline seam ≤ 0.1mm, uniform |
| 17 | Mirror face | Zero scratches, zero fingerprints under 10× loupe |
| 18 | Weight | 20–24g (nominal 22g) |
| 19 | Dimensions | 40.0 × 40.0 × 5.0mm ±0.2mm |

**Fail → Rework → Retest. Three failures on same unit → Reject.**

---

## 7. Factory Flash Procedure

### Equipment
- UART test jig: 6-pin pogo pin fixture aligned to PCB test pads
- PC running esptool.py v4.7+
- Batch flash script: `scripts/factory_flash.sh`

### Procedure
```bash
# For each unit:
python -m esptool \
  --chip esp32s3 \
  --port /dev/ttyUSB0 \
  --baud 921600 \
  write_flash \
  --flash_mode qio \
  --flash_size 8MB \
  0x0000  bootloader.bin \
  0x8000  partition-table.bin \
  0xe000  ota_data_initial.bin \
  0x20000 cosmo-cia-v1.0.bin
```

After flash, verify boot via UART monitor:
```
I (328) boot: Loaded app from partition at offset 0x20000
I (334) app_start: Starting app cpu
I (XXX) COSMO-CIA: Firmware v1.0.0 — Booting
I (XXX) COSMO-CIA: Device ID: {uuid}
I (XXX) COSMO-CIA: NVS: no config — entering provisioning mode
```

Burn device UUID into NVS at factory:
```bash
python scripts/burn_device_id.py --port /dev/ttyUSB0 --id $(uuidgen)
```

---

## 8. Quality Gates (summary)

| Gate | Metric | Target |
|------|--------|--------|
| PCB incoming | AOI pass rate | ≥ 98% |
| Enclosure incoming | Dimensional check | 100% pass |
| Factory flash | Boot success rate | 100% |
| Functional test | All 19 checks pass | 100% |
| Burn-in 24h | Zero reboots | 100% |
| Final inspection | Mirror face clean | 100% |
| Yield target | Ship 100 of 110 | ≥ 91% |

---

## 9. Packaging Specification

| Item | Specification |
|------|--------------|
| Box | 55mm × 55mm × 20mm matte black rigid box |
| Foam insert | 10mm EVA foam, die-cut pocket for device |
| Foam contact sheet | Anti-static polyethylene film on mirror face |
| Quick start card | A7, 157gsm coated, full colour, spot UV |
| USB-C cable | 0.5m braided, LOT silver |
| Charger pad | In separate foam tray below device tray |
| Serial number label | Affixed inside box lid: `CIA-2026-XXXXX` |
| Outer sleeve | Matte black paper sleeve, COSMO® CIA logotype, silver foil stamp |

---

## 10. Shipping Specification

- Carrier: DHL Express International
- Packaging: Individual retail box inside master carton (25 units per master carton)
- Master carton: 350mm × 300mm × 200mm, double-wall corrugated
- Weight per unit (retail): ~150g with packaging
- Total 100-unit shipment: ~15kg, 4 master cartons
- Insurance: Declared value $7,500 (cost of goods)
- Customs code (HS): 8543.70 (electrical machines and apparatus)

---

*COSMO® CIA Manufacturing Specification v1.0 — LOT Systems, Inc.*
*© 2026 LOT Systems, Inc. All rights reserved.*
