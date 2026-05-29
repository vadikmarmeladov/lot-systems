<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Development Roadmap

**Document:** COSMO-CIA-ROADMAP.md
**Version:** 1.0.0
**Prepared:** May 29, 2026
**Target Ship:** Q4 2026 (100 units)

---

## Overview

```
May 2026        Jun 2026        Jul 2026        Aug 2026        Sep 2026        Oct 2026        Nov 2026
   │                │               │               │               │               │               │
   ▼                ▼               ▼               ▼               ▼               ▼               ▼
[Phase 1]       [Phase 2]       [Phase 3]       [Phase 4]       [Phase 5]       [Phase 6]       [Phase 7]
Spec &          PCB &           Firmware        Integration     Pre-prod        Production      Ship
Design          Prototype       v1.0            Testing         (Pilot 10u)     (100u)          & Docs
```

---

## Phase 1 — Specification & Design (May 2026)

**Status:** ✅ Complete

**Deliverables:**
- [x] Hardware spec (`COSMO-CIA-HARDWARE-SPEC.md`)
- [x] Components BOM (`COSMO-CIA-COMPONENTS-LIST.md`)
- [x] Initial PCB schematic (KiCad)
- [x] CAD body design (Fusion 360 STEP files)
- [x] LOT API connector spec (`COSMO-CIA-SOFTWARE-CONNECTOR.md`)
- [x] Firmware architecture doc (`COSMO-CIA-FIRMWARE.md`)

**Decisions locked:**
- Form factor: 40 × 40 × 5 mm, 2-part stainless steel
- MCU: ESP32-S3-MINI-1-N8
- Display: SSD1351 OLED 128×128
- Wireless charging: Qi 5W
- API transport: HTTPS + WebSocket to lot-systems.com

---

## Phase 2 — PCB Prototype & CNC Samples (June 2026)

**Status:** 🔄 In Progress

### Week 1–2 (Jun 1–14)
- [ ] Finalize PCB layout in KiCad (4-layer, 36 × 36 mm)
- [ ] Design review: trace widths, decoupling, antenna keepout
- [ ] Export Gerber files
- [ ] **Place PCBWay order:** 10 PCBs (prototype qty, ENIG)
- [ ] **Place PCBWay CNC order:** 5 front shells + 5 back shells (SS316/SS304)
- [ ] Order breakout dev modules for parallel firmware dev
  - ESP32-S3-DevKitC-1
  - Adafruit SSD1351 breakout
  - BME280 breakout
  - OV2640 camera module

### Week 3–4 (Jun 15–30)
- [ ] Receive prototype PCBs from PCBWay (~14 day lead time)
- [ ] Hand-solder first 3 prototype units
- [ ] Basic bring-up: power rails, USB-C, ESP32 boot
- [ ] Display test: draw LOT® logo
- [ ] Camera test: capture single JPEG
- [ ] BME280 I²C read test
- [ ] Qi charging test with reference dock
- [ ] Receive CNC body samples, fit-check PCB

**Exit criteria:** All components boot and communicate on ≥2 of 3 prototypes.

---

## Phase 3 — Firmware v1.0 (July 2026)

**Status:** 📋 Planned

### Week 1–2 (Jul 1–14) — Core Firmware
- [ ] ESP-IDF project scaffold with FreeRTOS tasks
- [ ] Wi-Fi provisioning via BLE (Bluedroid + SmartConfig)
- [ ] HTTPS connection to lot-systems.com with JWT auth
- [ ] WebSocket client (persistent connection to `/api/device/notifications`)
- [ ] Notification render on SSD1351 (font rendering, layout)
- [ ] BME280 polling task (1-min interval)
- [ ] COPY button ISR → POST to `/api/device/log`
- [ ] Deep sleep manager (60-second wake interval)
- [ ] OTA update support (ESP-IDF `esp_https_ota`)

### Week 3–4 (Jul 15–31) — Refinement
- [ ] Session compression: LZ4 compress notification history to SPIFFS
- [ ] Wi-Fi reconnect logic with exponential backoff
- [ ] Battery level reading (ADC on VBAT/2 divider)
- [ ] Low-battery notification on display
- [ ] Passive buzzer chime sequences (3 chimes = new notification)
- [ ] Firmware signing (SHA-256 + RSA-2048)
- [ ] Unit tests (Unity framework) for critical paths

**Exit criteria:** Full notification → display → COPY → Log flow working on prototype hardware. OTA update proven.

---

## Phase 4 — LOT API Integration & Site Work (July–August 2026)

**Status:** 📋 Planned

### Backend (lot-systems.com)
- [ ] Add `DeviceToken` model to Prisma schema
- [ ] `POST /api/device/register` — register CIA device to user account
- [ ] `GET /api/device/notifications` (WebSocket upgrade) — stream notifications
- [ ] `POST /api/device/log` — write button press to user's Log tab
- [ ] `GET /api/device/weather-override` — push BME280 reading to user profile
- [ ] Admin panel: list registered devices per user
- [ ] Device pairing UI in LOT Settings tab

### Frontend (lot-systems.com)
- [ ] Log tab entry type: `device_ack` (COSMO CIA acknowledgement)
- [ ] Settings → Devices section (QR code pairing)
- [ ] Notification composer: send custom message to device
- [ ] Device status badge: "CIA Online" / "CIA Offline"

**Exit criteria:** End-to-end demo: send notification from site → device displays → press COPY → Log tab updates.

---

## Phase 5 — Pre-Production Pilot (August 2026)

**Status:** 📋 Planned

**Scope:** 10 pilot units for internal testing

### Manufacturing
- [ ] **PCBWay PCBA order:** 15 fully-assembled PCBs (turnkey SMT)
- [ ] **PCBWay CNC order:** 12 front + 12 back shells with laser engraving
- [ ] Assemble 10 pilot units (PCB + gasket + body + screws)
- [ ] Flash production firmware v1.0 via programming jig
- [ ] QC checklist per unit (see Phase 6)

### Testing
- [ ] 10 pilot units distributed to internal team
- [ ] 2-week soak test (continuous operation, real notifications)
- [ ] Track issues: battery life, Wi-Fi stability, display, button feel
- [ ] Thermal imaging QC on all units (FLIR C2)
- [ ] Document issues → firmware v1.1 patch

**Exit criteria:** ≥8/10 pilot units pass 2-week soak test with zero critical failures.

---

## Phase 6 — Production Run (September–October 2026)

**Status:** 📋 Planned

### Manufacturing Orders
- [ ] **PCBWay PCBA:** 150 units (100 production + 50 spare)
- [ ] **PCBWay CNC:** 120 front shells + 120 back shells
- [ ] **Charger dock PCBA:** 120 units
- [ ] **Packaging:** 110 custom boxes + inserts

### Assembly Line (in-house or Shenzhen partner)
- [ ] Receive all parts from PCBWay
- [ ] Firmware flash: programming jig, batch flash all boards
- [ ] Body assembly: silicone gasket → PCB → front shell → back shell → screws
- [ ] Qi coil adhesive attachment
- [ ] Final test: power on, Wi-Fi connect, display test pattern, COPY button POST

### QC Checklist (per unit)
- [ ] Visual inspection: no scratches on polished back, clean engraving
- [ ] Power on boot: LOT® logo appears within 3 seconds
- [ ] Wi-Fi connect: joins provisioned AP, establishes WebSocket
- [ ] Notification display: test notification renders correctly
- [ ] COPY button: button press logs to test account
- [ ] BME280: temperature within ±2 °C of reference thermometer
- [ ] Qi charging: device charges to 100% on dock within 2 hours
- [ ] Camera: test JPEG captured without artifacts
- [ ] Battery life: ≥12 h standby at 50% battery

**Target yield:** ≥95% (≤5 units rejected / reworked)

---

## Phase 7 — Documentation, Ship & Post-Launch (November 2026)

**Status:** 📋 Planned

### Documentation (PDFs)
- [ ] User Manual PDF (see `COSMO-CIA-MANUAL.md`)
- [ ] Firmware Technical Reference PDF
- [ ] API Connector Reference PDF
- [ ] Quick-Start Card (print-ready PDF, 85×54 mm)
- [ ] Regulatory compliance docs (FCC, CE declarations)

### Shipping
- [ ] Assemble final 100 boxes (device + dock + cable + quick-start card)
- [ ] Serial number register in LOT admin database
- [ ] Ship to Vadik Marmeladov / LOT team (first 10)
- [ ] Ship to early access subscribers (remaining 90)

### Post-Launch
- [ ] Monitor device telemetry in LOT admin panel
- [ ] OTA firmware update v1.1 (patch any field issues)
- [ ] Collect user feedback via Memory Engine
- [ ] Plan v2.0 hardware (cellular, longer battery, improved camera)

---

## Risk Register

| Risk                            | Probability | Impact  | Mitigation                                         |
|--------------------------------|-------------|---------|---------------------------------------------------|
| PCBWay lead time overrun        | Medium      | High    | Order PCB + CNC simultaneously; 4-week buffer     |
| Camera too thick for 5 mm body  | High        | Medium  | Use OV2640 flex cable routing; test in Phase 2    |
| Qi coil interference with MCU   | Medium      | Medium  | EMI shielding copper pour; test in Phase 2        |
| ESP32-S3 Wi-Fi antenna blocked  | Low         | High    | PCB antenna cutout in stainless front shell       |
| Battery capacity insufficient   | Low         | Medium  | Adjust sleep duty cycle; 150 mAh minimum          |
| FCC certification delay         | Medium      | High    | Use pre-certified ESP32-S3-MINI-1 module (FCC ID: 2AC7Z-ESP32S3MINI1)|
| 5 mm height constraint          | High        | High    | Layer stack: shell(1mm)+PCB(0.8mm)+battery(4mm)+shell(1mm)=6.8mm → revise to 6 mm if needed |

> **Note on height:** The 5 mm target is aggressive. Realistic minimum with 150 mAh LiPo + PCB + shells is ~6–7 mm. The final spec may be revised to 6 mm in Phase 2 after prototype fit-check.

---

## Milestones Summary

| Milestone                         | Target Date   | Owner         |
|----------------------------------|---------------|---------------|
| Spec & BOM complete               | May 29, 2026  | Vadik         |
| PCBWay orders placed              | Jun 7, 2026   | Vadik         |
| First prototype boots             | Jun 25, 2026  | Engineering   |
| Firmware v1.0 complete            | Jul 31, 2026  | Engineering   |
| LOT API integration complete      | Aug 15, 2026  | Engineering   |
| 10 pilot units assembled & tested | Aug 31, 2026  | Engineering   |
| 100-unit production order placed  | Sep 5, 2026   | Vadik         |
| 100 units assembled & QC passed   | Oct 20, 2026  | Manufacturing |
| All PDF documentation complete    | Nov 1, 2026   | Engineering   |
| **First 100 units shipped**       | **Nov 15, 2026** | **LOT Systems** |

---

*COSMO® CIA — From specification to shipment in 6 months.*
*© 2026 LOT Systems, Inc. All rights reserved.*
