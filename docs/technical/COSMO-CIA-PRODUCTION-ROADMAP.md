<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO·01 — Production Roadmap
## 100-Unit Run via PCBWay

**Document:** COSMO-CIA-PRODUCTION-ROADMAP.md  
**Revision:** v1.0  
**Date:** 2026-06-10  
**Target:** 100 units delivered, firmware live, LOT API endpoints deployed

---

## 1. Program Overview

| Metric | Value |
|--------|-------|
| Target units | 100 |
| Primary manufacturer | PCBWay (Shenzhen) |
| Engineering start | 2026-06-10 |
| Target ship date | 2026-10-01 |
| Total program cost | ~$11,750 |
| Unit COGS | $85.50 |
| Retail price | $149 |

---

## 2. Master Timeline

### Phase 0 — Pre-Engineering (Weeks 1–2)

| Task | Owner | Due |
|------|-------|-----|
| Schematic capture (KiCad or Altium) | EE | W2 |
| PCB layout (4-layer, 35×35mm) | EE | W2 |
| Enclosure STEP files (Side A + B) | ME | W2 |
| Firmware skeleton (Arduino + libraries installed) | FW | W1 |
| LOT API device endpoints scaffolded | BE | W1 |
| Database migration written | BE | W1 |
| DFM review (PCBWay design rules) | EE | W2 |

### Phase 1 — Fabrication Kickoff (Week 3)

| Task | Action | Supplier |
|------|--------|----------|
| Upload Gerbers + BOM + CPL | Submit SMT order (5 prototypes) | PCBWay |
| Upload STEP files | Submit CNC quote (5 enclosure sets) | PCBWay CNC |
| Order long-lead components | LiPo batteries, OV2640 modules | Grepow, UCTRONICS |
| Order passives + ICs | Standard BOM components | Mouser / DigiKey |

**PCBWay links:**
- PCB + SMT: https://www.pcbway.com/smt-assembly.html
- CNC Machining: https://www.pcbway.com/rapid-prototyping/manufacture/
- PCBWay material guide: 316L SS available, mirror polish confirmed as service

### Phase 2 — Prototype Build (Weeks 5–8)

| Task | Owner | Target |
|------|-------|--------|
| Receive PCBWay PCBs (5 units) | PM | W6 |
| Receive CNC enclosures (5 sets) | PM | W7 |
| Assemble 5 prototype units | HW | W7 |
| Flash firmware v0.1 | FW | W8 |
| Bring-up: power, display, WiFi | FW | W8 |
| Bring-up: BME280, OV2640, button | FW | W8 |
| First LOT API connection test | BE + FW | W8 |

### Phase 3 — Prototype Validation (Weeks 8–10)

| Test | Pass Criteria |
|------|--------------|
| Power on / boot | Device boots in < 3s, enters IDLE |
| WiFi enrollment (captive portal) | Connects to WiFi, stores credentials |
| QR enrollment | Camera reads QR, token stored |
| LOT API WebSocket | Device connects, ping/pong working |
| Notification display | Message shows with correct icon, clears after 8s |
| Copy button short press | POST to /api/device/log returns 200, Log tab shows entry |
| Copy button long press (5s) | Enters SETUP_MODE, captive portal opens |
| Weather sensor | BME280 readings within ±1°C, ±3% RH of reference |
| Deep sleep | Device sleeps after 5 min idle, wakes on button |
| OTA update | v0.1 → v0.2 OTA update completes, device reboots |
| Wireless charging | Device charges from 0–100% in < 100 min |
| USB-C fallback charge | Charges at 400mA via USB-C |
| Enclosure fit | PCB mounts securely, no rattle, sapphire glass flush |
| IP53 seal | Button gasket seals, no water ingress at 30s spray test |
| Display brightness | All 5 brightness levels render correctly |
| Battery life | ≥ 6 hours typical use (2h active, 4h standby) |
| Serial debug log | All log messages output correctly at 115200 baud |
| Memory/crash | 24h soak test with no crashes or memory leaks |
| Signal strength | WiFi RSSI > -70dBm at 10m distance |

**All 19 tests must pass before production release.**

### Phase 4 — Software Release (Weeks 9–11)

| Task | Owner | Target |
|------|-------|--------|
| Device API routes complete | BE | W9 |
| WebSocket notification server | BE | W9 |
| Prisma migration deployed to production | BE | W9 |
| LOT Log tab device entry rendering | FE | W10 |
| Public profile weather device source | BE | W10 |
| Memory Engine → device notification hookup | BE | W10 |
| Device admin panel (list enrolled devices) | FE | W11 |

### Phase 5 — Production Run (Weeks 11–14)

| Task | Action | Supplier |
|------|--------|----------|
| Release 100-unit PCB order | Submit to PCBWay SMT (100 pcs) | PCBWay |
| Release 100-unit CNC order | 100 enclosure pairs, SS 316L | PCBWay CNC |
| Packaging order | 100× boxes, inserts, cards | Local print / Alibaba |
| Qi pad PCB order | 100× COSMO Pad PCBs | PCBWay |

**PCBWay estimated lead times:**
- PCB + SMT (100 units): 10–15 business days
- CNC stainless steel (100 units): 15–20 business days
- Both can run in parallel → receive same week

### Phase 6 — Final Assembly + QC (Weeks 14–15)

| Task | Notes |
|------|-------|
| Receive all parts | Verify quantities, visual inspection |
| Assembly line: 100 units | PCB → enclosure → battery → seal |
| Per-unit QA flash + test | Automated test jig (serial pass/fail) |
| Device enrollment per unit | Pre-enroll serial + assign tokens |
| Package + label | Box, insert, quick-start card, seal |
| Firmware v1.0 final flash | Via USB-C before boxing |

**QA test jig:**
A simple custom PCB with pogo pins that contacts the 8 test pads on the
COSMO·01 PCB. Runs a 90-second automated test script over UART:
- Power on
- WiFi connect (test AP)
- Sensor read
- Display test pattern
- Button press detect
- Charge enable test
- Pass / Fail displayed on jig LED

### Phase 7 — Ship (Week 16)

| Task | Notes |
|------|-------|
| Final 100-unit inventory | All units QA-passed, boxed |
| PDF manual finalized | Uploaded to lot-systems.com/manual/cosmo01 |
| LOT platform device support live | API + WS server deployed to production |
| Ship to first 100 users | Priority: LOT subscribers Purple+ tier |

---

## 3. PCBWay Submission Checklist

### PCB + SMT Order:
- [ ] Gerber files (RS-274X, all layers including drill)
- [ ] BOM.csv (MPN, quantity, reference designator, package)
- [ ] CPL.csv (centroid X/Y, rotation, layer, reference)
- [ ] Assembly notes PDF (special instructions, orientation notes)
- [ ] Stencil included (Gerber format, top side only)
- [ ] Confirm: ENIG surface, 0.8mm board, 4-layer, black soldermask
- [ ] Request: 100% AOI, 5× functional test boards

### CNC Machining Order:
- [ ] Side A STEP file (mirror polish, no apertures)
- [ ] Side B STEP file (brushed, display + camera + button cutouts)
- [ ] Engineering drawing PDF with GD&T tolerances
- [ ] Surface finish callouts on drawing: MP (mirror) / SB4 (brushed)
- [ ] Thread callouts: M1.6×0.35 for PCB mounting bosses
- [ ] Note sapphire glass seat tolerance: ±0.02mm

---

## 4. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| PCBWay lead time overrun | Medium | Medium | Order prototypes in W3, buffer in timeline |
| LiPo battery custom min. order > 100 | Medium | Low | Source standard size or negotiate MOQ |
| Mirror polish quality inconsistent | Low | Medium | Request samples before 100-unit order |
| BME280 altitude compensation error | Low | Low | Calibrate in firmware; user can set elevation |
| WiFi WPA3 not supported on some APs | Low | Low | Fall back to WPA2 |
| PCB 5mm height target not met in v1 | High | Low | v1 target is 8mm; 5mm is v2 goal — documented |
| FCC testing required for commercial sale | High | Medium | 100-unit internal run exempt; get FCC before retail |

---

## 5. Budget Detail

### Engineering NRE (one-time)

| Item | Cost |
|------|------|
| Schematic + PCB layout (EE, 40h) | $2,000 |
| Mechanical STEP files (ME, 20h) | $1,000 |
| Firmware v1.0 (FW, 16h internal) | $0 |
| LOT API + WS server (BE, 20h internal) | $0 |
| Test jig design | $200 |
| **NRE Total** | **$3,200** |

### Materials (100 units)

| Category | Cost |
|----------|------|
| PCB + SMT (100 units) | $2,800 |
| CNC enclosures (100 pairs) | $4,500 |
| COSMO Pad (100 units) | $800 |
| Packaging (100 sets) | $450 |
| **Materials Total** | **$8,550** |

### **Grand Total: $11,750**

---

## 6. Certification Path (post-pilot)

For commercial sale (after 100-unit pilot):

| Cert | Requirement | Cost | Timeline |
|------|-------------|------|----------|
| FCC Part 15 Class B | WiFi device, US market | $4,000–6,000 | 8–12 weeks |
| CE (RED Directive) | EU market | $2,000–4,000 | 6–10 weeks |
| RoHS | EU + global retailers | included in CE | — |
| WEEE | EU take-back program | ~$500 registration | 2 weeks |
| Qi certification | Wireless charging logo | $1,500 | 4 weeks |

**Certification parallel with production → certify at 500-unit scale.**

---

## 7. Version Roadmap

| Release | COGS | Retail | Key Difference |
|---------|------|--------|----------------|
| v1.0 (100 units) | $85.50 | $149 | 8mm, WiFi, camera, prototype run |
| v1.5 (500 units) | $71.00 | $149 | Cost reduction, certified, BLE pairing |
| v2.0 (2,000 units) | $52.00 | $149 | 5mm height, e-ink option, cellular LTE-M |
| v3.0 | TBD | TBD | COSMO robotics node integration |

---

*All production files to be archived in `hardware/` directory of this
repository after engineering phase completes.*
