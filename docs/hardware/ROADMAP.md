# COSMO LOT Computer — Project Roadmap
## Phase Plan, Milestones & Risk Analysis

**Project:** COSMO® CIA LOT Computer  
**Inventor:** Vadik Marmeladov — COSMO® CIA / LOT Systems  
**Document Version:** 1.0  
**Date:** 2026-05-26  
**Production Target:** 100 units (Run 1)

---

## Timeline Overview

```
2026
Jun ──── Jul ──── Aug ──── Sep ──── Oct ──── Nov ──── Dec
 │        │        │        │        │        │        │
 ▼        ▼        ▼        ▼        ▼        ▼        ▼
[P1]    [P2]     [P3]     [P4]    [P5]     [P6]    [P7]
Design  Proto    FW/SW    PCBWay  Assembly  QC      Ship
```

---

## Phase 1 — Design & Architecture (Jun 2026)
**Duration:** 4 weeks  
**Status:** Active

### Deliverables

| # | Deliverable | Owner | Due |
|---|---|---|---|
| 1.1 | Master hardware spec (this document set) | Vadik | 2026-05-28 |
| 1.2 | PCB schematic v1 in KiCad | PCB engineer | 2026-06-07 |
| 1.3 | PCB layout v1 (4-layer, 37×37mm) | PCB engineer | 2026-06-14 |
| 1.4 | Mechanical CAD (STEP files for stainless shell) | Industrial designer | 2026-06-14 |
| 1.5 | Firmware architecture + module map | FW engineer | 2026-06-07 |
| 1.6 | LOT API hardware endpoints spec | Vadik | 2026-06-05 |
| 1.7 | Components ordered (long-lead items: battery, display) | Vadik | 2026-06-10 |

### Critical Path Items

- **ESP32-S3-MINI-1U availability** — check stock at Digi-Key; lead time can be 6–8 weeks if out of stock. Order immediately.
- **Custom LiPo battery** — 4–6 week lead time for custom dimensions. Place order first.
- **Stainless CNC quote** — get PCBWay CNC quote with STEP files within first 2 weeks.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Battery custom size not manufacturable at 2.5mm | Medium | High | Qualify alternate: LP603040 (3mm thick, 600mAh) which forces 5.5mm height |
| 5mm total height infeasible | Medium | Medium | Allow 6mm height in v1 — retain all specs |
| ESP32-S3 out of stock | Low | High | Pre-order 120 units in Phase 1 |

---

## Phase 2 — Prototyping (Jul 2026)
**Duration:** 4 weeks  
**Goal:** 3 functional hand-built prototypes (breadboard + dev PCB)

### Deliverables

| # | Deliverable |
|---|---|
| 2.1 | Breadboard prototype with ESP32-S3 DevKit + OLED + BME688 |
| 2.2 | LOT API hardware endpoints live on lot-systems.com (dev branch) |
| 2.3 | Firmware v0.1 — Wi-Fi connect, notification poll, display render |
| 2.4 | Copy button → LOT Log tab signal working end-to-end |
| 2.5 | Weather sensor data visible in LOT System tab |
| 2.6 | Wireless charging verified on prototype (Qi dev kit) |
| 2.7 | First prototype unit in 3D-printed shell (to validate form factor) |
| 2.8 | PCB Gerbers finalized and sent to PCBWay |
| 2.9 | CNC order placed with PCBWay CNC |

### Key Tests

- [ ] Notification latency < 5 seconds from site to screen
- [ ] Copy button signal appears in LOT Log tab within 2 seconds
- [ ] BME688 temperature accuracy ±0.5°C vs reference thermometer
- [ ] Qi charge from cold battery to full in < 3 hours
- [ ] OV2640 camera QR scan for device pairing

---

## Phase 3 — Firmware & Software (Aug 2026)
**Duration:** 4 weeks  
**Goal:** Production-ready firmware v1.0 + TypeScript connector SDK

### Firmware Milestones

| Milestone | Target |
|---|---|
| FW v0.2 | OTA update system working |
| FW v0.3 | Deep sleep < 50µA, wake-on-notification |
| FW v0.4 | Session compression + upload |
| FW v0.5 | BMI270 gesture (tap-to-wake, flip-to-silence) |
| FW v1.0 | All modules stable; signed binary build |

### Software Milestones

| Milestone | Target |
|---|---|
| SDK v0.1 | TypeScript LOT Hardware SDK (npm package) |
| SDK v0.2 | LOT site integration (hardware tab in settings) |
| SDK v1.0 | Full provisioning flow (QR → registered device) |

### LOT Site Changes Required

| Change | Description |
|---|---|
| New API routes | `/api/hardware/*` endpoints (5 routes) |
| Log tab | Display `copy_button_press` events with device icon |
| Settings | Hardware device management panel |
| Admin | Device registry view for Vadik |
| Notification push | Admin can send custom notification to specific device |

---

## Phase 4 — PCBWay Manufacturing (Sep 2026)
**Duration:** 5 weeks  
**Goal:** 100 PCBAs delivered and tested

### PCBWay Order Timeline

| Step | Action | Lead Time |
|---|---|---|
| PCB order placed | Upload Gerbers + order 100 PCBs | Day 0 |
| PCB fabrication | PCBWay produces boards | 5–7 business days |
| PCBA | PCBWay assembles SMD components | 10–15 business days |
| CNC machining | 316L stainless shells (parallel) | 15–20 business days |
| Shipping to LOT | DHL/FedEx from Shenzhen | 5–7 days |
| **Total Phase 4** | | **~5 weeks** |

### PCBA Checklist

- [ ] Upload Gerber ZIP to PCBWay
- [ ] Upload BOM with LCSC part numbers
- [ ] Upload CPL (pick-and-place) file
- [ ] Specify: black solder mask, ENIG, 4-layer, 0.8mm
- [ ] Request: X-ray inspection, AOI test
- [ ] Confirm: components excluded from PCBA (battery, display, camera — hand-assembled)
- [ ] Order 10 extra PCBAs for QC testing buffer

---

## Phase 5 — Device Assembly (Oct 2026)
**Duration:** 3 weeks  
**Goal:** 100 complete devices assembled and firmware-flashed

### Assembly Line (Manual)

```
Step 1: Inspect PCBA (visual + continuity)
Step 2: Solder display FPC cable to PCB
Step 3: Attach camera module (ZIF connector)
Step 4: Connect battery (JST PH-2)
Step 5: Connect Qi coil (wire + adhesive)
Step 6: Firmware flash via USB-C jig
Step 7: Power-on test (boot, Wi-Fi, display)
Step 8: Glue cover glass (UV cure)
Step 9: Insert PCB+display into front shell
Step 10: Clip polished back cap onto shell
Step 11: Insert 4× M1.0 screws
Step 12: Final visual inspection
Step 13: Box and label
```

**Assembly estimate:** ~20 minutes per unit × 100 units = ~33 hours (4 people × 1 day)

### Firmware Flash Jig

- Custom USB-C pogo-pin jig (3D printed)
- Flash using `esptool.py` batch script
- Each unit assigned unique `deviceId` (cosmo_001 → cosmo_100)
- Device ID burned into NVS (non-volatile storage)

---

## Phase 6 — QC & Testing (Nov 2026)
**Duration:** 2 weeks

### QC Test Protocol

| Test | Method | Pass Criteria |
|---|---|---|
| Power-on | Connect to Qi charger | LED turns on within 2s |
| Display | Boot screen shows | All 128×128 pixels active |
| Wi-Fi | Scan + connect to test SSID | RSSI > -80 dBm |
| LOT API | Poll notifications | Notification displayed within 30s |
| Copy button | Press button | Log entry visible in LOT Log tab |
| BME688 sensor | Read values | Temp 18–28°C, Humidity 30–70% |
| Battery | Charge from 10% to 100% via Qi | Completes in < 3h |
| Camera | Scan test QR code | Decode successful |
| OTA | Trigger OTA update | New firmware flashed successfully |
| Physical | Inspect shell, glass, screws | No scratches, gaps, loose parts |

**Acceptable failure rate:** < 3% (3 units from 100)  
**Failed units:** Rework or replace components

---

## Phase 7 — Shipping & Distribution (Dec 2026)
**Duration:** 2 weeks

### Distribution Plan (100 units)

| Allocation | Qty | Notes |
|---|---|---|
| COSMO® CIA / Vadik (personal) | 5 | Inventor reserve |
| LOT Systems R&D team | 10 | Internal testing + feedback |
| Usership beta program | 75 | Top LOT subscribers |
| Press / media samples | 5 | COSMO® CIA press kit |
| Spares / replacements | 5 | QC buffer |

### Shipping

- **Packaging:** Custom 55×55×20mm box, foam insert, quick-start card
- **Carrier:** DHL Express (international) / UPS Ground (USA)
- **Battery compliance:** UN 38.3 + IATA Section II (< 100Wh, ≤ 2 cells)
- **Include:** Device + charger + USB-C cable (0.3m) + quick-start card

---

## Feature Roadmap (Post-Run 1)

### Run 2 (2027 — planned)

| Feature | Priority | Notes |
|---|---|---|
| E-paper display (1.54") | High | Lower power, better daylight readability |
| Heart rate sensor (MAX30102) | Medium | Biometric data → LOT QOS |
| NFC tag | Medium | Tap to share LOT profile |
| GPS | Low | Context-aware notifications |
| Custom engraving | Medium | Personalized laser engraving on back |
| Color display | Low | 1.3" 240×240 IPS |
| 500-unit run | High | Scale after Run 1 validation |

### LOT Platform Enhancements (Parallel)

| Feature | Priority |
|---|---|
| Hardware tab in LOT Settings | High |
| Device-specific notification composer | High |
| Sensor data in QOS kernel | High |
| Multi-device support per user | Medium |
| Hardware API public SDK | Medium |

---

## Budget Summary

| Phase | Item | Est. Cost |
|---|---|---|
| P1 | PCB design (KiCad contractor) | $800 |
| P1 | Mechanical CAD (freelancer) | $600 |
| P1–2 | Prototype components + dev kits | $400 |
| P4 | PCBWay PCB + PCBA (100 units) | $1,480 |
| P4 | Stainless CNC (100 sets) | $1,200 |
| P4 | Components (battery, display, camera) | $1,500 |
| P5 | Assembly labor | $500 |
| P5 | Firmware flash jig (3D print) | $80 |
| P7 | Packaging (100 sets) | $250 |
| P7 | Shipping (samples + distribution) | $600 |
| Buffer (10%) | Contingency | $740 |
| **Total** | | **~$8,150** |

---

## Decision Gates

| Gate | Decision Point | Go/No-Go Criteria |
|---|---|---|
| G1 — End of Phase 2 | Proceed to PCBWay PCBA order | Prototype works end-to-end with LOT API |
| G2 — End of Phase 3 | Firmware v1.0 release | OTA, sleep modes, all sensors passing |
| G3 — End of Phase 4 | Begin device assembly | All 100 PCBAs pass ICT (in-circuit test) |
| G4 — End of Phase 6 | Begin distribution | ≥ 97 units pass full QC protocol |

---

*COSMO® CIA — LOT Systems — Roadmap v1.0 — 2026-05-26*
