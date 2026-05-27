# COSMO Computer — Project Roadmap
**Document:** 09-ROADMAP  
**Revision:** A  
**Date:** 2026-05-27  
**Target: 100-unit pilot by Q3 2026**

---

## 1. Overview Timeline

```
2026
May    Jun    Jul    Aug    Sep    Oct    Nov    Dec
 │      │      │      │      │      │      │      │
 ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
[Phase 1: Design & Spec]
 ├─────────────────┤
        [Phase 2: Prototype]
         ├──────────────────┤
                  [Phase 3: Pilot Run 100 units]
                   ├────────────────────────────────┤
                             [Phase 4: LOT API Integration]
                              ├──────────────────────────┤
                                       [Phase 5: Ship + Support]
                                        ├──────────────────────►
```

---

## 2. Phase 1 — Design & Specification
**Duration:** May 27 – June 7, 2026 (2 weeks)  
**Status:** ✅ IN PROGRESS

### Milestones

| # | Deliverable | Owner | Due | Status |
|---|-------------|-------|-----|--------|
| 1.1 | Hardware specification (this document set) | Engineering | May 27 | ✅ Complete |
| 1.2 | Bill of Materials with links + pricing | Engineering | May 27 | ✅ Complete |
| 1.3 | PCBWay manufacturing order guide | Engineering | May 27 | ✅ Complete |
| 1.4 | Firmware architecture document | Firmware | May 27 | ✅ Complete |
| 1.5 | LOT API connector spec | Backend | May 27 | ✅ Complete |
| 1.6 | User manual (draft) | Product | May 27 | ✅ Complete |
| 1.7 | CAD files: Main PCB (Gerbers) | EE | June 3 | 🔲 Pending |
| 1.8 | CAD files: Power PCB (Gerbers) | EE | June 3 | 🔲 Pending |
| 1.9 | CAD files: Stainless shell (STEP/DXF) | ME | June 5 | 🔲 Pending |
| 1.10 | Schematic review sign-off | Lead EE | June 6 | 🔲 Pending |
| 1.11 | PCBWay quotes confirmed | Procurement | June 7 | 🔲 Pending |

### Gate 1: ✅ Go/No-Go — PCBWay order placement
- All CAD files reviewed and approved
- BOM confirmed with supplier lead times
- Budget approved for 100-unit run

---

## 3. Phase 2 — Prototype (3 units)
**Duration:** June 8 – July 14, 2026 (5 weeks)  
**Status:** 🔲 Pending Gate 1

### Milestones

| # | Deliverable | Owner | Due | Status |
|---|-------------|-------|-----|--------|
| 2.1 | Place PCBWay PCB + PCBA orders (3 proto boards) | Procurement | June 8 | 🔲 |
| 2.2 | Place PCBWay CNC order (3 shells) | Procurement | June 8 | 🔲 |
| 2.3 | Order long-lead components (BME688, battery, camera) | Procurement | June 8 | 🔲 |
| 2.4 | Prototype PCBs received from PCBWay | — | June 20 | 🔲 |
| 2.5 | Prototype shells received from PCBWay | — | July 5 | 🔲 |
| 2.6 | Assemble 3 prototype units | Assembly | July 7 | 🔲 |
| 2.7 | Flash initial firmware (v0.9.0) | Firmware | July 7 | 🔲 |
| 2.8 | Hardware functional testing (all I2C, display, button) | QA | July 8 | 🔲 |
| 2.9 | Wi-Fi connectivity test | Firmware | July 9 | 🔲 |
| 2.10 | LOT API integration test (polling, COPY button log) | Backend | July 10 | 🔲 |
| 2.11 | Qi wireless charging test (through stainless shell) | Hardware | July 10 | 🔲 |
| 2.12 | Battery life measurement | Hardware | July 11 | 🔲 |
| 2.13 | Antenna range test (Wi-Fi at 5/10/20 m) | Firmware | July 11 | 🔲 |
| 2.14 | Prototype issues documented → PCB Rev A2 ECOs | EE | July 12 | 🔲 |
| 2.15 | Prototype sign-off meeting | All | July 14 | 🔲 |

### Gate 2: ✅ Go/No-Go — 100-unit production order
- All critical functions pass (display, sensors, Wi-Fi, COPY, charging)
- No blocking hardware issues requiring redesign
- Battery life meets spec (> 18 hours)
- Qi charging works through shell

---

## 4. Phase 3 — Pilot Production Run (100 Units)
**Duration:** July 15 – September 15, 2026 (8 weeks)  
**Status:** 🔲 Pending Gate 2

### Milestones

| # | Deliverable | Owner | Due | Status |
|---|-------------|-------|-----|--------|
| 3.1 | Apply prototype ECOs to Gerbers | EE | July 15 | 🔲 |
| 3.2 | Apply ECOs to CNC files | ME | July 15 | 🔲 |
| 3.3 | Place 100-unit PCBWay orders (PCB + PCBA + CNC) | Procurement | July 16 | 🔲 |
| 3.4 | Ship customer-supplied components to PCBWay | Procurement | July 17 | 🔲 |
| 3.5 | PCBWay PCBA production (concurrent) | PCBWay | ~Aug 5 | 🔲 |
| 3.6 | PCBWay CNC production (concurrent) | PCBWay | ~Aug 20 | 🔲 |
| 3.7 | All items received, inventory check | Assembly | Aug 25 | 🔲 |
| 3.8 | Factory provisioning (flash + NVS credentials) 100 units | Firmware | Aug 26–28 | 🔲 |
| 3.9 | Factory functional test (all 100 units) | QA | Aug 29–Sep 2 | 🔲 |
| 3.10 | Final assembly (PCB + shell + gasket + glass) 100 units | Assembly | Sep 3–9 | 🔲 |
| 3.11 | Quality inspection (AQL sampling) | QA | Sep 10 | 🔲 |
| 3.12 | Packaging + label printing | Assembly | Sep 11–14 | 🔲 |
| 3.13 | 100 units packaged and ready to ship | — | Sep 15 | 🔲 |

### Gate 3: ✅ Go/No-Go — Shipment to users
- Factory test pass rate ≥ 96/100 units
- Final assembly cosmetic inspection: no scratches on mirror shell
- Firmware v1.0.0 flashed and verified on all units
- Claim codes registered in LOT database

---

## 5. Phase 4 — LOT API Integration
**Duration:** June 8 – August 31, 2026 (parallel with Phase 2/3)  
**Status:** 🔲 Pending

### Milestones

| # | Deliverable | Owner | Due | Status |
|---|-------------|-------|-----|--------|
| 4.1 | Database migration: devices table | Backend | June 10 | 🔲 |
| 4.2 | Database migration: device_logs table | Backend | June 10 | 🔲 |
| 4.3 | Database migration: device_sensor_data table | Backend | June 10 | 🔲 |
| 4.4 | POST /api/device/register endpoint | Backend | June 12 | 🔲 |
| 4.5 | POST /api/device/auth + refresh endpoints | Backend | June 12 | 🔲 |
| 4.6 | GET /api/device/notifications endpoint | Backend | June 15 | 🔲 |
| 4.7 | POST /api/device/log endpoint + Log tab display | Backend | June 17 | 🔲 |
| 4.8 | POST /api/device/sensor-data endpoint | Backend | June 18 | 🔲 |
| 4.9 | GET /api/device/config endpoint | Backend | June 19 | 🔲 |
| 4.10 | OTA firmware CDN setup (firmware.lot-systems.com) | DevOps | June 20 | 🔲 |
| 4.11 | GET /api/device/firmware/latest endpoint | Backend | June 21 | 🔲 |
| 4.12 | WebSocket /ws/device endpoint | Backend | June 25 | 🔲 |
| 4.13 | Device claim UI (lot-systems.com/devices) | Frontend | June 30 | 🔲 |
| 4.14 | Notification generation via Memory Engine AI | Backend | July 10 | 🔲 |
| 4.15 | COPY events in Log tab display | Frontend | July 15 | 🔲 |
| 4.16 | Sensor data in System tab (environment widget) | Frontend | July 20 | 🔲 |
| 4.17 | LOT Companion app v1.0 (flash + config + monitor) | Software | Aug 15 | 🔲 |
| 4.18 | End-to-end integration test (device → site → log) | QA | Aug 31 | 🔲 |

---

## 6. Phase 5 — Ship & Support
**Duration:** September 16 – December 31, 2026  
**Status:** 🔲 Pending Gate 3

### Milestones

| # | Deliverable | Owner | Due | Status |
|---|-------------|-------|-----|--------|
| 5.1 | Pilot user selection (100 LOT users) | Product | Sep 10 | 🔲 |
| 5.2 | Ship devices to pilot users | Logistics | Sep 16 | 🔲 |
| 5.3 | User onboarding email with claim code | Backend | Sep 16 | 🔲 |
| 5.4 | Monitor device telemetry (crash reports, battery life) | DevOps | Ongoing | 🔲 |
| 5.5 | Firmware OTA update v1.0.1 (bug fixes) | Firmware | Oct 15 | 🔲 |
| 5.6 | Pilot feedback survey | Product | Oct 31 | 🔲 |
| 5.7 | Rev B design decisions (based on pilot feedback) | Engineering | Nov 30 | 🔲 |
| 5.8 | Rev B roadmap document | Product | Dec 15 | 🔲 |

---

## 7. Budget Roadmap

| Phase | Estimated Cost | Notes |
|-------|---------------|-------|
| Phase 1 (Design) | $0–$2,500 | Engineering time + tools |
| Phase 2 (Prototype 3 units) | ~$800 | 3 boards + 3 shells + components |
| Phase 3 (100-unit production) | ~$16,431 | See BOM document |
| Phase 4 (API dev) | ~$0 | Internal LOT engineering |
| Phase 5 (Shipping) | ~$1,500 | 100 units DHL International |
| **Total Rev A** | **~$21,231** | |

**Revenue (if sold at $349 each):**  
100 × $349 = $34,900 gross  
Margin after COGS: $34,900 − $11,461 = $23,439 (67%)

---

## 8. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| BME688 component shortage | Medium | High | Order immediately, 20% excess |
| Qi charging blocked by stainless | Medium | High | Prototype test validates; 0.3mm wall per spec |
| Wi-Fi antenna range insufficient | Low | High | External patch antenna design proven |
| PCBWay CNC lead time overrun | Medium | Medium | +2 week buffer in schedule |
| Battery life below spec | Low | Medium | Power budget modelled; light-sleep mode |
| OV2640 camera module size | Low | Medium | Confirmed compact module available |
| Mirror polish scratch during assembly | Medium | Low | White glove assembly protocol |
| FCC/CE needed for retail | N/A | High | Rev A is pilot only; Rev B targets certifications |

---

## 9. Revision History

| Rev | Date | Changes |
|-----|------|---------|
| A | 2026-05-27 | Initial roadmap for 100-unit pilot |

---

*Document: 09-ROADMAP.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
