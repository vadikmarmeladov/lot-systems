# COSMO® CIA — Project Roadmap
## 100-Unit Production Run Plan

```
DOCUMENT:  05-COSMO-CIA-ROADMAP
REVISION:  v1.0
DATE:      2026-05-26
RUN:       100 units
INVENTOR:  Vadik Marmeladov — COSMO® CIA
```

---

## Executive Summary

The COSMO CIA is a 100-unit production run of a premium IoT notification device. Timeline from today to delivery: approximately **14 weeks**. This roadmap covers hardware design finalization, PCBWay manufacturing, firmware, software integration, and distribution.

---

## Phase Overview

```
Phase 0 — Design Lock          Weeks 1–2
Phase 1 — PCB Prototyping       Weeks 3–5
Phase 2 — Firmware Alpha        Weeks 3–6
Phase 3 — Prototype Validation  Weeks 5–7
Phase 4 — Production Order      Weeks 7–10
Phase 5 — Assembly & QA         Weeks 10–12
Phase 6 — Software Integration  Weeks 8–12
Phase 7 — Distribution          Weeks 12–14
```

---

## Phase 0 — Design Lock (Weeks 1–2)

**Goal:** Finalize all hardware design files before any manufacturing orders are placed.

| Task | Owner | Status |
|------|-------|--------|
| PCB schematic complete | Hardware | ○ |
| PCB layout (4-layer, 36×36mm) | Hardware | ○ |
| STEP file for Side A shell | Mechanical | ○ |
| STEP file for Side B shell | Mechanical | ○ |
| BOM finalized and costed | Hardware | ✓ (this doc) |
| PCBWay PCBA BOM/CPL files | Hardware | ○ |
| Firmware config.h pin map | Firmware | ✓ |
| LOT API device routes | Software | ✓ |

**Exit criteria:** All design files reviewed and signed off. PCBWay quote confirmed.

---

## Phase 1 — PCB Prototyping (Weeks 3–5)

**Goal:** Receive and validate 10 prototype PCBs before full production run.

| Task | Lead time | Notes |
|------|-----------|-------|
| Submit Gerbers + BOM to PCBWay (prototype run: 10 boards) | Day 1 | PCBA service, express option |
| PCBWay manufacturing | 5–7 days | ENIG, black solder mask |
| Receive boards | Day 8–9 | |
| Component population check (visual) | Day 9 | |
| Electrical test: power rails, USB enum | Day 10 | |
| Firmware flash + boot test | Day 10 | |
| Peripheral test: BME688, display, button, Qi | Day 11 | |
| Camera calibration | Day 11 | |
| Thermal test: charge + operation | Day 12 | |
| Design revision (if needed) | Day 13–14 | Max 1 spin |

**Exit criteria:** ≥8/10 boards pass all functional tests. No blocking issues.

---

## Phase 2 — Firmware Alpha (Weeks 3–6, parallel with Phase 1)

**Goal:** Deliver firmware that passes all Phase 1 hardware tests and connects to LOT API.

| Milestone | Target week |
|-----------|-------------|
| Boot, WiFi, NVS storage | Week 3 |
| E-paper display driver + LOT logo | Week 3 |
| BME688 + BSEC2 IAQ integration | Week 4 |
| LOT API: ping, notifications, events | Week 4 |
| Copy button: single/hold gestures | Week 4 |
| Camera capture + upload | Week 5 |
| Qi charging status detection | Week 5 |
| OTA update infrastructure | Week 5 |
| Power management (light sleep) | Week 6 |
| Factory reset | Week 6 |
| Firmware v1.0 release build | End of Week 6 |

**OTA server endpoint** `GET /api/device/ota/check` to be added in a subsequent software sprint.

---

## Phase 3 — Prototype Validation (Weeks 5–7)

**Goal:** 10 prototype units distributed to internal testers. Collect field feedback.

| Activity | Duration |
|----------|----------|
| Internal team distribution (5 units) | Week 5 |
| Daily use field test | 2 weeks |
| Feedback collection (LOT Log tab events) | Ongoing |
| Battery life measurement (real-world) | Week 5–7 |
| WiFi reconnection resilience test | Week 6 |
| BME688 IAQ accuracy calibration (5-day run) | Week 5–6 |
| Display readability in various lighting | Week 6 |
| Enclosure prototype evaluation | Week 7 |

**Key metrics to validate:**
- Battery life ≥ 7 days (target: 10 days)
- Notification delivery latency ≤ 35 seconds (poll interval + server response)
- WiFi reconnection time ≤ 15 seconds
- BME688 IAQ accuracy ≥ 2 after 5-day calibration burn-in

---

## Phase 4 — Production Order (Weeks 7–10)

**Goal:** Place and receive 110-unit production order (100 + 10 spare).

| Task | Timeline |
|------|----------|
| Final BOM / CPL update (incorporate prototype learnings) | Week 7 |
| PCBWay PCBA order: 110 boards | Week 7, day 1 |
| PCBWay CNC order: 110 enclosure sets | Week 7, day 1 |
| PCBWay manufacturing: PCBs | 7–10 days |
| PCBWay manufacturing: CNC enclosures | 10–12 days |
| Receive PCBs | Week 8–9 |
| Receive enclosures | Week 9–10 |
| Packaging materials order | Week 7 |

**PCBWay orders:**
1. PCBA order (110 boards, turnkey) — upload BOM + CPL + Gerbers
2. CNC order (110 sets) — upload Side A STEP, Side B STEP

---

## Phase 5 — Assembly & Quality Assurance (Weeks 10–12)

**Goal:** Fully assembled, tested, and packaged 100 units.

| Task | Target |
|------|--------|
| PCB incoming inspection (visual + functional) | 100% boards |
| Flash firmware v1.0 to all boards | 110 boards |
| Board functional test (per test procedure doc) | 100% pass required |
| Hand-solder display FPC connector | Per unit |
| Hand-solder camera module | Per unit |
| Connect LiPo battery | Per unit |
| Enclosure fit test | 10% sample |
| Final assembly: PCB into Side B shell | Per unit |
| Wireless charge test in full assembly | 100% |
| Side A shell close + screw torque | Per unit |
| Serial number label (inside, Side B) | Per unit |
| Package in box with foam insert + cable | Per unit |
| Final QA: functional test in box | 10% sample |

**Target yield:** ≥96% first-pass (≥96 of 100 shippable units from 110 boards).

---

## Phase 6 — Software Integration (Weeks 8–12, parallel)

**Goal:** LOT platform fully supports COSMO CIA with production-ready endpoints.

| Task | Target week |
|------|-------------|
| Device API routes deployed to production | Week 8 |
| Settings page: "My Devices" tab | Week 9 |
| Registration code UI (Settings → Devices) | Week 9 |
| Log tab: device events display | Week 9 |
| Memory Engine → device notification triggers | Week 10 |
| QOS mode change → device notification | Week 10 |
| OTA endpoint: `/api/device/ota/check` | Week 10 |
| Device sensor display on public profile | Week 11 |
| Admin panel: push notification to any device | Week 11 |
| Smoke test: end-to-end device workflow | Week 12 |

---

## Phase 7 — Distribution (Weeks 12–14)

**Goal:** 100 units shipped to recipients.

| Activity | Notes |
|----------|-------|
| Usership recipient list compiled | Usership tag holders get priority |
| Personalized activation codes pre-generated | One per unit |
| Shipping: domestic (standard) | 2–5 business days |
| Shipping: international | 7–14 business days |
| Post-ship support window | 30 days |
| Firmware OTA update pushed (if any pending fixes) | Day 1 of distribution |

---

## Milestones Summary

| Milestone | Target date (relative) |
|-----------|----------------------|
| Design lock | +2 weeks |
| Prototype PCBs received | +5 weeks |
| Firmware v1.0 | +6 weeks |
| Prototype validation complete | +7 weeks |
| Production order placed | +7 weeks |
| Production boards received | +9 weeks |
| Assembly complete | +12 weeks |
| Software integration complete | +12 weeks |
| **Distribution begins** | **+12 weeks** |
| All 100 units shipped | +14 weeks |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| BME688 stock shortage | Medium | High | Order +20 units, alternative: BME280+SGP40 |
| PCBWay CNC enclosure quality | Low | High | Order prototype enclosures in Phase 1 |
| E-paper display availability | Low | Medium | Pre-order from Waveshare in Phase 0 |
| Firmware OTA infrastructure delay | Medium | Low | OTA is non-blocking for v1.0 ship |
| BSEC2 library licensing | Low | High | Review Bosch T&C; firmware stays on-device |
| WiFi reconnection reliability | Medium | Medium | Validated in Phase 3; WatchDog timer backup |
| Assembly yield < 96% | Low | Medium | 10 spare boards ordered as buffer |

---

## Budget Summary

| Line item | Estimated cost |
|-----------|----------------|
| PCBWay PCBA (110 boards) | $2,475 |
| PCBWay CNC enclosures (110 sets) | $2,486 |
| Components (if consigned) | $2,695 |
| Packaging | $286 |
| Prototype run (Phase 1) | $350 |
| Misc (shipping, tools, contingency 15%) | $1,234 |
| **Total estimated** | **~$9,526** |
| **Per unit (100 shipped)** | **~$95** |

---

## Version 2 Horizon (Post v1.0)

Future iterations being considered:
- COSMO CIA v2: cellular connectivity (LTE-M) — no WiFi requirement
- COSMO CIA v2: color e-paper display (7-color, 1.64")
- COSMO CIA v2: haptic feedback (ERM motor)
- COSMO CIA v2: NFC tag for device discovery
- COSMO CIA v2: GPS for location-aware notifications
- LOT Qi Pad: custom wireless charger designed for 40×40mm footprint

---

```
COSMO® CIA — Project Roadmap
LOT Systems Corporation | lot-systems.com
Document: 05-COSMO-CIA-ROADMAP v1.0
```
