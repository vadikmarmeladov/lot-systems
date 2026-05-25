# COSMO® CIA — Manufacturing Roadmap
**Document:** COSMO-MFG-001 · Rev 1.0
**Date:** 2026-05-25
**Scope:** 100-unit pilot production run

---

## Phase Overview

```
Month 1         Month 2         Month 3         Month 4
Jan 2027        Feb 2027        Mar 2027        Apr 2027
────────────────────────────────────────────────────────
[DESIGN]─────►[PROTO]──────►[PILOT MFG]──────►[SHIP]
  PCB design    2 prototypes    100 units        Delivery
  CNC design    validation      QA testing
  Firmware v0   FW v1           FW v1.0 final
```

---

## Phase 1 — Design Lock (Weeks 1–3)

### 1.1 PCB Design
- [ ] Schematic capture in KiCad 7 (see `firmware/kicad/`)
- [ ] 4-layer stackup: Signal / GND / Power / Signal
- [ ] Component placement review — thermal, RF clearance
- [ ] DRC (design rule check) — PCBWay 4-layer design rules
- [ ] Generate Gerber files + drill files + BOM + CPL (centroid)
- [ ] Submit to PCBWay Design Review service (free)

**PCBWay 4-Layer Specs to use:**
| Parameter | Value |
|---|---|
| Board thickness | 1.0 mm |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Min trace / space | 4 mil / 4 mil |
| Min drill | 0.2 mm |
| Impedance control | Yes — 50Ω for RF trace to antenna |
| Color | Black |
| Quantity | 110 (10 spare) |

### 1.2 CNC Enclosure Design
- [ ] 3D model in Fusion 360 or SolidWorks
- [ ] Top shell (Side B): camera bore, screen aperture, button cutout, USB-C slot, snap-fit tabs
- [ ] Bottom shell (Side A): mirror polish face, screw bosses, O-ring groove, Qi coil recess
- [ ] Material: 316L SS bar stock
- [ ] Toolpath review with PCBWay CNC team
- [ ] Surface treatment spec: Side A = mirror polish (Ra < 0.1 µm), Side B = bead blast (Ra 1.6–3.2 µm)
- [ ] Submit STEP + tolerance drawings to PCBWay CNC

**PCBWay CNC Submission:**
- URL: https://www.pcbway.com/rapid-prototyping/manufacture/?type=4
- Upload: `.STEP` file + PDF drawing with GD&T tolerances
- Material code: 316L SS
- Finish: specify per face in drawing notes
- Lead time 100 units: 15–18 business days

### 1.3 Firmware Skeleton
- [ ] ESP-IDF v5.x project initialized
- [ ] Wi-Fi provisioning (Bluetooth LE provisioning app)
- [ ] HTTP client (HTTPS with Let's Encrypt root CA bundle)
- [ ] LOT API connector stub
- [ ] OLED driver (SSD1306 I²C)
- [ ] BME688 driver + BSEC2 library integration

---

## Phase 2 — Prototyping (Weeks 4–7)

### 2.1 Prototype Build (2 units)
| Step | Action | Supplier | Timeline |
|---|---|---|---|
| PCB proto | Order 10 bare boards | PCBWay | Week 4 |
| Components | Order from Mouser/DigiKey | Mouser | Week 4 |
| Hand assembly | Solder PCB (BGA reflow or hand paste + hotplate) | In-house | Week 5 |
| Shell proto | Order 2 sets CNC shells, no polish | PCBWay CNC | Week 4 |
| Assembly | Fit PCB, battery, coil into shell | In-house | Week 6 |
| Bring-up | Flash firmware, test all peripherals | In-house | Week 6–7 |

### 2.2 Prototype Validation Checklist
- [ ] ESP32-S3 boots, serial console active
- [ ] Wi-Fi connects, HTTPS GET to lot-systems.com/api/device/health → 200
- [ ] OLED displays "COSMO® CIA · Connected"
- [ ] BME688 reads temp/humidity/pressure/gas → values in range
- [ ] OV2640 camera: captures JPEG, uploads to LOT API
- [ ] Copy button: press → POST to LOT API → Log entry appears in browser
- [ ] Qi charging: place on charger pad → battery charges → fuel gauge reads rising %
- [ ] DRV2605L haptic: haptic confirmation on button press
- [ ] USB-C: firmware flash via esptool.py
- [ ] Deep sleep: enters 60s sleep → wakes for notification poll
- [ ] Run time: 4+ hours continuous Wi-Fi, 20+ days deep-sleep standby

### 2.3 Issues Log (template)
| ID | Description | Status | Fix |
|---|---|---|---|
| P-001 | — | — | — |

---

## Phase 3 — PCBWay PCBA Turnkey (Weeks 8–12)

### 3.1 Turnkey Order Package

Submit to PCBWay PCBA:
- `gerbers.zip` — PCB fabrication files
- `bom.csv` — BOM with MPN, quantity, reference designator
- `cpl.csv` — Component placement (centroid) file
- `assembly_notes.pdf` — special instructions (no-fill zones, press-fit parts)

**PCBWay PCBA Service:**
- URL: https://www.pcbway.com/pcb-assembly.html
- Turnkey: PCBWay sources all components + assembles
- Quantity: 110 units
- Lead time: 20–25 business days

### 3.2 CNC Shell — Production Run

Submit to PCBWay CNC:
- Quantity: 110 × top shell + 110 × bottom shell = 220 pieces
- Material: 316L SS
- Finish: per drawing
- Include: laser engraving "COSMO® CIA · LOT" on Side A

### 3.3 QA Inspection Plan

**PCBWay AOI (Automated Optical Inspection):** included in PCBA service
**PCBWay X-Ray:** request for BGA inspection (ESP32-S3 module)
**In-house final test (each unit):**

| Test | Method | Pass Criteria |
|---|---|---|
| Power-on | Apply 3.7V via test pads | No smoke; current < 200mA |
| Firmware flash | esptool.py via USB-C | Flash succeeds, boot log clean |
| Wi-Fi | Connect to test AP | RSSI > -70 dBm |
| LOT API ping | HTTPS GET /health | HTTP 200, <500ms |
| OLED | Display test pattern | All pixels light |
| BME688 | Read sensor | Temp 20–30°C in lab |
| Camera | Capture JPEG | File > 10 kB, no corruption |
| Copy button | Press → API | Log entry appears in Log tab |
| Qi charge | Place on pad | LED turns green within 30s |
| Battery | Discharge 1h | > 30% remaining |
| Haptic | Trigger DRV2605L | Vibration felt |
| Assembly | Torque screws, gap check | No light leak, <0.1mm gap |

### 3.4 Packaging

| Item | Spec |
|---|---|
| Box | Black kraft, 60×60×30mm |
| Insert | Custom-cut EVA foam |
| Contents | Device + charger pad + USB-C cable (0.3m) + quick-start card |
| Quick-start card | 90×50mm, double-sided, QR to setup guide |
| Label | COSMO® CIA logo + serial number + FCC ID |

---

## Phase 4 — Certification & Compliance

### 4.1 FCC Part 15 (USA)
- Required for Wi-Fi / BLE devices
- Testing lab: GET Engineering (San Jose) or CEVA Labs
- Timeline: 4–6 weeks
- Est. cost: $1,200–2,000 for pilot
- Module FCC ID reuse: ESP32-S3-WROOM-1 already has FCC ID 2AC7Z-ESPS3WROOM1 → use module certification (reduces testing)

### 4.2 CE Mark (EU/UK)
- Required if selling in EU
- RED (Radio Equipment Directive) applies
- Use ESP32-S3 module's CE cert as base → additional EMC/safety testing
- Timeline: 6–8 weeks; est. $1,500

### 4.3 RoHS / REACH
- PCBWay PCBA confirms RoHS compliance on all sourced components
- Request RoHS declaration from PCBWay with order

---

## Phase 5 — Shipping (Week 16+)

| Item | Spec |
|---|---|
| Ship from | PCBWay (Shenzhen, China) |
| Ship to | Destination TBD |
| Method | DHL Express or FedEx International Priority |
| HS Code | 8543.70.9960 (electronic apparatus) |
| Import duties | Varies by country; budget ~5–8% of declared value |
| Lead time | 3–5 business days from Shenzhen |

---

## Gantt Chart Summary

```
Week:       1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
─────────────────────────────────────────────────────────────
PCB design  ████████████
CNC design  ████████████
FW skeleton ████████████
PCB proto         ████████████
CNC proto         ████████████
Validation              ████████
PCBWay PCBA                    ████████████████
PCBWay CNC                     ████████████████
FW v1.0                               ████████
QA testing                                   ████████
Packaging                                         ████
Shipping                                               ████
```

---

## Budget Summary

| Phase | Cost |
|---|---|
| Phase 1 — Design (external) | $0 (in-house) |
| Phase 2 — Prototypes (2 units) | ~$450 |
| Phase 3 — 110-unit PCBA + CNC | ~$6,600 |
| Phase 4 — Certification | ~$2,000 |
| Phase 5 — Packaging + shipping | ~$500 |
| Contingency (10%) | ~$960 |
| **Total** | **~$10,510** |

---

*Document COSMO-MFG-001 · lot-systems.com · Rev 1.0 · 2026-05-25*
