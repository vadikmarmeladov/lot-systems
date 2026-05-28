<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Production Roadmap

**Document:** PRODUCTION-ROADMAP.md
**Revision:** 1.0
**Date:** May 28, 2026
**Project:** COSMO® Computer CC-1 — 100-Unit Run
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems / COSMO® CIA

---

## Executive Summary

The COSMO® Computer is a physical extension of the LOT operating system — a 40×40×5.5mm stainless steel notification device that connects to lot-systems.com via WiFi, displays autonomous AI-generated notifications, captures environmental data, and sends behavioral signals back through the Copy button.

This roadmap covers the complete production journey from PCB design to 100 shipped units.

**Target launch:** Q3 2026 (August 1, 2026)
**Target recipients:** LOT Usership tier subscribers + R&D tier members

---

## Phase Overview

```
Phase 0: Design (complete)          ████████████ Week 0
Phase 1: Engineering Pilot (EVT)    ████░░░░░░░░ Week 1–4
Phase 2: Design Validation (DVT)    ░░░░████░░░░ Week 4–8
Phase 3: Production Validation (PVT)░░░░░░░░████ Week 8–10
Phase 4: Mass Production (100 units)░░░░░░░░░░░░ Week 10–14
Phase 5: Final Assembly + Ship      ░░░░░░░░░░░░ Week 14–16
```

Total duration: 16 weeks (May 28 → September 10, 2026)

---

## Phase 0 — Design Complete

**Status:** Complete
**Output:** All design documents in `docs/hardware/`

| Deliverable | Status |
|------------|--------|
| Product Specification | Complete |
| Bill of Materials | Complete |
| PCBWay Manufacturing Guide | Complete |
| Firmware Architecture | Complete |
| Software API Bridge | Complete |
| Assembly Guide | Complete |
| Production Roadmap | Complete (this document) |

**Next action:** Commission schematic capture and PCB layout (KiCad recommended).

---

## Phase 1 — Engineering Pilot (Weeks 1–4)

**Goal:** Validate electrical design, mechanical fit, and firmware boot.
**Quantity:** 5 units

### Week 1 — PCB Design

| Task | Owner | Duration |
|------|-------|----------|
| Schematic capture (KiCad) | HW Engineer | 3 days |
| PCB layout (36×36mm, 4L) | HW Engineer | 3 days |
| Design rule check (DRC) | HW Engineer | 1 day |
| Gerber + BOM + CPL export | HW Engineer | 0.5 day |

**Schematic priority:**
1. ESP32-S3FN8 core (decoupling, crystal, antenna)
2. Power tree (LiPo → TP4056 → TPS63020 3.3V)
3. Qi receiver (BQ51013B → VBAT)
4. OLED SPI (SSD1327, J2 FPC)
5. Camera DVP (OV2640, J4 FPC)
6. I2C bus (BME688, VEML7700, VEML6075)
7. Button GPIO
8. USB-C (ESD, programming)

### Week 2 — PCBWay Pilot Order

| Task | Owner | Duration |
|------|-------|----------|
| Submit Gerber to PCBWay (10 boards, unassembled) | VM | 0.5 day |
| Submit CNC order for pilot enclosures (5 sets) | VM | 0.5 day |
| PCBWay fabrication | PCBWay | 5 days |

**Note:** For the engineering pilot, order PCBs unassembled (or with only passives placed) and hand-solder the ICs in-house. This allows faster iteration on errors without waiting for full turnkey assembly.

### Week 3 — Bring-Up

| Task | Owner | Duration |
|------|-------|----------|
| Hand-solder ESP32-S3, power ICs | HW Engineer | 2 days |
| Power-on test (3.3V rail check) | HW Engineer | 1 day |
| ESP-IDF firmware flash (bare boot) | SW Engineer | 1 day |
| Peripheral bring-up (OLED, BME688, camera) | SW Engineer | 2 days |
| Button GPIO ISR test | SW Engineer | 0.5 day |
| WiFi connect + LOT API ping | SW Engineer | 1 day |

### Week 4 — Mechanical Fit Check

| Task | Owner | Duration |
|------|-------|----------|
| Receive CNC pilot enclosures | — | — |
| PCB fit check in Side A cavity | HW Engineer | 1 day |
| Gorilla Glass + OLED window alignment | HW Engineer | 1 day |
| Camera aperture alignment | HW Engineer | 1 day |
| USB-C edge notch alignment | HW Engineer | 0.5 day |
| Screw-close test (gasket compression) | HW Engineer | 1 day |
| IP52 splash test (3 units, 5 min under 12.5L/min spray) | QC | 1 day |
| Pilot EVT Report | HW Engineer | 1 day |

**EVT Exit Criteria:**
- All 5 units boot to LOT API connection
- OLED renders text correctly
- Copy button fires log event to lot-systems.com
- Enclosure fits with no interference
- IP52 test passed by 3/3 units
- No burning smell or abnormal heat

---

## Phase 2 — Design Validation (Weeks 5–8)

**Goal:** Validate user experience, notification system, and reliability.
**Quantity:** 10 units (PCBWay turnkey assembly)

### Week 5 — Full Turnkey PCBWay Order

| Task | Owner | Duration |
|------|-------|----------|
| Update BOM/CPL based on EVT learnings | HW Engineer | 1 day |
| Submit PCBWay turnkey order (20 boards, assembled) | VM | 0.5 day |
| Submit CNC order (15 enclosure sets) | VM | 0.5 day |
| PCBWay assembly lead time | PCBWay | 10–14 days |

### Week 6 — Firmware v1.0 Complete

| Task | Owner | Duration |
|------|-------|----------|
| Firmware: all tasks implemented | SW Engineer | 5 days |
| Firmware: OTA update flow | SW Engineer | 2 days |
| Firmware: session compression | SW Engineer | 2 days |
| QC test script (`qc_test.py`) | SW Engineer | 2 days |
| LOT backend: device endpoints | SW Engineer | 3 days |
| LOT backend: SSE notification stream | SW Engineer | 2 days |
| LOT backend: Log tab hardware event display | SW Engineer | 1 day |

### Week 7 — DVT Assembly + User Testing

| Task | Owner | Duration |
|------|-------|----------|
| Receive PCBWay + CNC parts | — | — |
| Assemble 10 units per Assembly Guide | HW Engineer | 2 days |
| Firmware provision all 10 units | SW Engineer | 1 day |
| QC test all 10 units | QC | 1 day |
| Ship 5 units to LOT Usership beta users | VM | 1 day |

### Week 8 — DVT Feedback + Fixes

| Task | Owner | Duration |
|------|-------|----------|
| Collect beta user feedback (5 users, 7 days) | VM | 7 days |
| Log all issues in GitHub issues | VM | ongoing |
| Fix P0/P1 firmware issues | SW Engineer | 3 days |
| Fix enclosure fit issues (if any) | HW Engineer | 2 days |
| DVT Report | HW Engineer | 1 day |

**DVT Exit Criteria:**
- Notification delivery latency < 3 seconds
- Copy button event appears in Log tab within 5 seconds
- Battery life ≥ 10 hours in normal use
- Wireless charging works on Qi-compliant chargers (not just dock)
- No firmware crashes in 7-day beta period
- 4/5 beta users rate device 4+/5 for core experience

---

## Phase 3 — Production Validation (Weeks 9–10)

**Goal:** Validate production line, packaging, and provisioning workflow.
**Quantity:** 30 units

### Week 9 — PVT Order

| Task | Owner | Duration |
|------|-------|----------|
| Finalize firmware v1.0 binary | SW Engineer | 1 day |
| Finalize PCB gerbers (any rev changes from DVT) | HW Engineer | 1 day |
| Submit PCBWay order: 30 assembled boards + 30 enclosure sets | VM | 1 day |
| Source batteries, Qi coils, Gorilla Glass locally | VM | ongoing |
| Finalize packaging design (Packlane order) | VM | 2 days |
| PCBWay lead time | PCBWay | 10–14 days |

### Week 10 — PVT Assembly

| Task | Owner | Duration |
|------|-------|----------|
| Receive all parts | — | — |
| Assemble 30 units (timed line study) | HW Engineer | 3 days |
| Provision 30 units (automated script) | SW Engineer | 1 day |
| Run QC test suite on all 30 units | QC | 1 day |
| Package 30 units with dock + charger | HW Engineer | 1 day |
| Measure per-unit assembly time target: ≤ 12 min | QC | — |
| PVT Report | HW Engineer | 1 day |

**PVT Exit Criteria:**
- 28/30 units pass full QC suite (≥93% yield)
- Assembly time ≤ 12 minutes per unit (worker learns process)
- Packaging verified: no damage in drop test (1m, 4 faces)
- Provisioning script: 0 errors in 30 runs
- OTA firmware update: works on all 30 units

---

## Phase 4 — Mass Production (Weeks 11–13)

**Goal:** Produce remaining 60 units for final 100-unit run.
**Quantity:** 60 units (completing 100 total with EVT + DVT + PVT)

| Task | Owner | Duration |
|------|-------|----------|
| Submit PCBWay order: 70 assembled boards (buffer for yield) | VM | 0.5 day |
| Submit CNC order: 70 enclosure sets | VM | 0.5 day |
| PCBWay lead time | PCBWay | 10–14 days |
| Receive all parts (Week 12) | — | — |
| Assemble 60 units | HW Engineer | 5 days |
| Provision + QC 60 units | SW+QC | 2 days |
| Package all 60 units | HW Engineer | 2 days |
| Total packaged units: ~100 (EVT+DVT+PVT+MP) | — | — |

---

## Phase 5 — Final Assembly + Ship (Weeks 14–16)

| Task | Owner | Duration |
|------|-------|----------|
| Final inventory count (target 100 ship-ready units) | QC | 1 day |
| Assign units to LOT user accounts in admin | SW Engineer | 1 day |
| Ship to Usership tier: ~40 units | VM | 1 day |
| Ship to R&D tier: ~20 units | VM | 1 day |
| Reserve for COSMO® CIA internal use: 5 units | VM | — |
| Reserve spares for warranty replacement: 10 units | VM | — |
| Reserve for press / demo: 5 units | VM | — |
| Press release on lot-systems.com | VM | 1 day |
| **Launch Day: August 1, 2026** | | |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| PCBWay lead time extends beyond estimate | Medium | High | Order 3 weeks before needed; parallel CNC order |
| OV2640 camera at 5mm exceeds depth budget | Low | Medium | 0.5mm shim option in cavity design; camera bump acceptable up to +2mm |
| BME688 BSEC library ESP32-S3 compat issue | Low | Medium | Test BSEC v2.4 in EVT Phase 1 |
| WiFi provisioning UX confusion | Medium | Low | Detailed Quick Start card; 30-second onboarding |
| Battery capacity insufficient (250mAh) | Low | Medium | Deep sleep optimization; Qi dock for overnight charge |
| Qi coil blocks SSE notification (power on) | Low | Low | Firmware: wake from sleep on Qi removal = charge complete notification |
| Mirror polish scratched during assembly | Medium | High | Handle Side A in microfiber bag until final close; quality inspection |
| LOT API rate limit on device bulk registration | Low | Low | Batch registration script with 500ms delay between requests |
| FCC/CE compliance testing delay | Medium | High | Pre-test at DVT stage; engage test lab in Week 6 |
| Beta user complaints about 5mm depth | Low | Low | 5mm is thinner than AirPods case; re-frame in marketing |

---

## Budget Summary

| Phase | Est. Spend | Cumulative |
|-------|-----------|-----------|
| Phase 0: Design + documentation | $0 (internal) | $0 |
| Phase 1: EVT (5 units, CNC pilots) | $1,800 | $1,800 |
| Phase 2: DVT (10 units, packaging design) | $3,400 | $5,200 |
| Phase 3: PVT (30 units, packaging) | $5,100 | $10,300 |
| Phase 4: MP (60 units) | $7,200 | $17,500 |
| Phase 5: Shipping, press, misc | $1,800 | $19,300 |
| **Total** | | **~$19,300** |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Units shipped | 100 |
| QC yield | ≥ 93% |
| Beta user rating | ≥ 4.0 / 5.0 |
| Notification delivery latency | < 3 seconds |
| Copy button → Log tab time | < 5 seconds |
| Battery life (normal use) | ≥ 10 hours |
| Wireless charge time (0→100%) | ≤ 90 minutes |
| Assembly time per unit | ≤ 12 minutes |
| Zero DOA (dead on arrival) units shipped | 100% |

---

## Document Revision History

| Rev | Date | Author | Change |
|-----|------|--------|--------|
| 1.0 | 2026-05-28 | Vadim Marmeladov | Initial release |

---

*COSMO® Computer — A physical extension of the LOT operating system.*
*Invented by Vadim Marmeladov. Named for Kuzya Cosmo Marmeladov.*

*© 2026 LOT Systems, Inc. — Proprietary and Confidential*
