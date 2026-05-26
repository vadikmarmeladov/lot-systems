# COSMO® CIA — Development Roadmap

**Version:** 1.0
**Start date:** 2026-05-26
**Pilot delivery target:** 2026-11-30 (100 units)
**Owner:** Vadik Marmeladov, LOT Systems / COSMO® CIA

---

## Roadmap Overview

```
May 2026       Jun 2026       Jul 2026       Aug 2026       Sep 2026       Oct 2026       Nov 2026
   │               │               │               │               │               │               │
   ▼               ▼               ▼               ▼               ▼               ▼               ▼
   ┌───────────────┐
   │  Phase 0      │
   │  Spec &       │
   │  Design       │
   └───────┬───────┘
           ├─────────────────────────────────────────────────────────────────────────────────────┐
           │                                                                                     │
   ┌───────▼───────┐               ┌───────────────┐               ┌───────────────┐            │
   │  Phase 1      │               │  Phase 3      │               │  Phase 5      │            │
   │  PCB Proto    ├───────────────▶  Firmware Dev ├───────────────▶  Integration  │            │
   │  (PCBWay)     │               │               │               │  & Testing    │            │
   └───────┬───────┘               └───────────────┘               └───────┬───────┘            │
           │                                                               │                    │
   ┌───────▼───────┐               ┌───────────────┐               ┌───────▼───────┐            │
   │  Phase 2      │               │  Phase 4      │               │  Phase 6      │            │
   │  Mechanical   ├───────────────▶  Software     ├───────────────▶  100-Unit     │            │
   │  Prototype    │               │  API Bridge   │               │  Pilot Run    │            │
   └───────────────┘               └───────────────┘               └───────┬───────┘            │
                                                                           │                    │
                                                                   ┌───────▼───────┐            │
                                                                   │  Phase 7      ◀────────────┘
                                                                   │  Docs & PDF   │
                                                                   │  Manuals      │
                                                                   └───────────────┘
```

---

## Phase 0 — Specification & Design
**Duration:** 2026-05-26 → 2026-06-13 (3 weeks)
**Status:** IN PROGRESS

### Deliverables
- [x] COSMO-CIA-SPEC.md — hardware specification
- [x] COSMO-CIA-BOM.md — bill of materials with supplier links
- [x] COSMO-CIA-ROADMAP.md — this document
- [ ] KiCad schematic — complete ESP32-S3 + peripherals
- [ ] KiCad PCB layout — 4-layer, 40×38mm
- [ ] Mechanical CAD (STEP) — 2-part SS enclosure, imported into KiCad for fit-check
- [ ] DFM review with PCBWay (upload Gerbers for preliminary DFM check)
- [ ] Regulatory pre-assessment (FCC/CE scope — ESP32-S3 module pre-certified)
- [ ] LOT API endpoint spec — `/api/device/*` routes defined (coordinate with backend dev)

### Key decisions in this phase
| Decision | Options | Selected |
|---|---|---|
| MCU | ESP32-S3 vs nRF9160 (LTE) | ESP32-S3 (WiFi only, simpler, cheaper) |
| Display | OLED vs e-ink | e-ink (bistable, low power, sunlight readable) |
| Camera | OV2640 vs OV7675 | OV7675 (lower height, DVP native) |
| Charging | Qi vs USB-C only | Qi primary + USB-C debug port |
| Body | Aluminium vs SS 316L | SS 316L (premium, COSMO brand) |

### Risk: 5mm thickness
- **Risk:** Stack-up tighter than expected after PCB layout with real component footprints
- **Mitigation:** Pre-check Z-height of all components in 3D STEP. If stack exceeds 5mm, revision to 5.5mm with thinner LiPo (Grepow UFX 0.7mm series)

---

## Phase 1 — PCB Prototype
**Duration:** 2026-06-09 → 2026-07-04 (4 weeks incl. PCBWay lead time)
**Depends on:** Phase 0 KiCad schematic + layout complete

### Steps
1. **Schematic review** (internal) — 2 days
2. **PCB layout DRC pass** — 1 day
3. **Gerber export** — KiCad → Gerber ZIP + drill file + BOM CSV + CPL file
4. **PCBWay order** — Upload at https://www.pcbway.com/orderonline.aspx
   - Qty: 10 prototype PCBs (4-layer, 0.6mm, ENIG, black mask)
   - Lead time: ~7 business days
5. **PCBA order** — PCBWay PCBA service for 5 assembled boards
   - Lead time: ~10 business days from PCB completion
6. **Component pre-order** — DigiKey/Mouser orders placed same day as PCB order
7. **Receive boards + components** — Validate BOM, check all parts received
8. **Manual assembly** — Qi coil, battery, button keycap (not in PCBA scope)
9. **Bring-up testing:**
   - Power rail check (3.3V, 1.8V)
   - ESP32-S3 boot (USB-C serial monitor)
   - e-ink display hello world
   - BME688 I2C scan + first sensor read
   - Camera frame capture
   - WiFi connect + HTTPS request to lot-systems.com

### Deliverables
- 5 assembled prototype PCBs (functional, bare — no enclosure)
- Bring-up test report
- Updated schematic/layout with any prototype corrections (PCB Rev B if needed)

---

## Phase 2 — Mechanical Prototype
**Duration:** 2026-06-09 → 2026-07-18 (6 weeks, parallel with Phase 1)
**Depends on:** Phase 0 mechanical CAD complete

### Steps
1. **CAD design** — 2-part SS enclosure in Fusion 360 or SolidWorks
   - Import PCB STEP from KiCad for fit-check
   - Model Part A (rear, mirror), Part B (front frame), glass panel, gasket
   - Qi window cutout + PEEK insert design
   - Verify camera lens clearance, e-ink viewport, button aperture
2. **PCBWay CNC quote** — Upload STEP/IGES files at https://www.pcbway.com/rapid-prototyping/manufacture/
   - Request 3 prototype sets (316L SS, 5-axis, standard finish only — no polish on prototype)
   - Lead time: ~15 business days
3. **Receive prototype enclosures** — dry-fit with prototype PCB
4. **Dimensional check** — measure all critical dims vs. spec
5. **Button keycap fit-check** — travel, alignment, flush surface
6. **Iterate if required** — CAD revision + re-order (1 week)
7. **Polished sample order** — 1 mirror-polished Part A for visual approval

### Deliverables
- 3 prototype enclosure sets (bare, unpolished)
- 1 mirror-polished Part A sample for Vadik approval
- Updated STEP files (v1.1) after prototype corrections
- Fit verification report

### Risk: Mirror polish timeline
- Polish is hand-buffed — requires 5–7 days additional at polishing vendor (PCBWay subcontracts)
- **Mitigation:** Order polished sample in parallel with unpolished prototype set

---

## Phase 3 — Firmware Development
**Duration:** 2026-07-07 → 2026-09-12 (10 weeks)
**Depends on:** Phase 1 bring-up complete (working PCB)

### Milestone breakdown

#### M3.1 — Core OS (weeks 1–2, by 2026-07-21)
- ESP-IDF project setup (v5.2+)
- Partition table: OTA A/B + NVS + factory
- Flash encryption + Secure Boot v2 enabled
- Deep sleep / wake configuration
- RTC XTAL enabled, drift < 2 ppm
- Power management: modem sleep + light sleep + deep sleep states

#### M3.2 — Peripherals (weeks 2–4, by 2026-08-04)
- e-ink driver (SSD1681): full refresh + partial refresh
- Notification display layout rendering (1-bit framebuffer, custom font)
- BME688 driver: continuous measurement mode + BSEC2 integration
- OV7675 camera: DVP init, JPEG capture, 80KB max output
- Copy button: GPIO interrupt, debounce, single/long-press/double-press detection
- DRV2605L haptic: I2C init, LRA waveform for press confirm
- SK6812 RGB LED: charging / notification / error states
- USB-C UART: ESP-IDF console (debug only)

#### M3.3 — Connectivity (weeks 3–5, by 2026-08-18)
- WiFi STA mode: connect, reconnect, RSSI monitor
- BLE provisioning (NimBLE stack): GATT server, LOT companion pairing
- NVS encrypted store: WiFi SSID/PSK + device API token + device UUID
- HTTPS client (mbedTLS + cert bundle): GET + POST to lot-systems.com
- TLS certificate pinning (lot-systems.com leaf cert)
- Retry + exponential backoff for failed API calls

#### M3.4 — LOT Integration (weeks 5–7, by 2026-09-01)
- GET /api/device/notifications — poll on wake
- Display notification, update only if changed (compare hash)
- POST /api/device/log — Copy button event with sensor payload
- POST /api/device/log/photo — camera JPEG attach on long-press
- OTA endpoint: GET /api/device/firmware/check + download

#### M3.5 — Session Compression (weeks 7–8, by 2026-09-08)
- Local session log: ring buffer in NVS (last 50 events)
- Session compression: LZ4 compress sensor history + notification IDs
- Sync on wake: flush compressed session to /api/device/session-sync
- On-device: dedup notification IDs to avoid re-displaying seen items

#### M3.6 — OTA Updates (weeks 8–9, by 2026-09-12)
- Check firmware version on every 24th poll cycle (~every 2 hours)
- Download via HTTPS to OTA partition
- Verify RSA-2048 signature before boot swap
- Rollback on 3 failed boots (ESP-IDF OTA rollback)

### Deliverables
- Compiled firmware binary v1.0.0 (`cosmo-cia-v1.0.0.bin`)
- COSMO-CIA-FIRMWARE.md (detailed firmware documentation)
- Unit tests (Unity framework) for all driver modules
- Firmware flashing script (`flash.sh`) via esptool.py

---

## Phase 4 — Software API Bridge
**Duration:** 2026-07-14 → 2026-09-05 (8 weeks, partially parallel with Phase 3)
**Depends on:** LOT API endpoint spec (Phase 0), firmware LOT integration spec (Phase 3 M3.4)

### Backend additions to lot-systems.com

#### Week 1–2: Device registration
- `POST /api/device/register` — create device record, return API token
- `GET /api/device/me` — validate token, return device info
- Prisma schema: `Device` table (uuid, userId, name, token, registeredAt, lastSeenAt)

#### Week 3–4: Notification delivery
- `GET /api/device/notifications` — return latest N notifications for authenticated device
- Admin UI: LOT admin can push custom notifications to device pool
- Auto-notifications: Memory Engine prompts, QOS mode changes, weather alerts

#### Week 5–6: Log tab integration
- `POST /api/device/log` — write log entry tied to user's Log tab
- Log entry appears in `/logs` UI with device icon + sensor data panel
- `POST /api/device/log/photo` — attach JPEG to log entry (store in S3/DigitalOcean Spaces)

#### Week 7: OTA endpoint
- `GET /api/device/firmware/check` — return latest version number
- `GET /api/device/firmware/download` — serve signed firmware binary

#### Week 8: Companion provisioning
- `POST /api/device/provision` — generate provisioning QR code (WiFi + token bundle)
- BLE pairing flow in LOT web app (uses Web Bluetooth API)

### Deliverables
- COSMO-CIA-SOFTWARE.md (software/API bridge documentation)
- Prisma migrations for Device table
- Full API route implementation in `/src/server/routes/device-api.ts`
- LOT web app: device management UI in Settings tab
- Integration test suite (device API)

---

## Phase 5 — Integration & Testing
**Duration:** 2026-09-15 → 2026-10-10 (4 weeks)
**Depends on:** Phase 3 firmware + Phase 4 software + Phase 2 enclosure (fit-checked)

### Testing matrix

| Test | Description | Pass criteria |
|---|---|---|
| End-to-end notification | Push from LOT admin → display on device | < 10 min latency (5-min poll) |
| Copy button → Log tab | Press → entry appears in lot-systems.com Logs | < 30s, sensor data present |
| Camera log | Long-press → photo in Log entry | < 60s, JPEG visible |
| Session compression | 50-event NVS log → LZ4 sync to server | Size < 4KB, lossless |
| OTA update | Admin pushes v1.0.1 → device auto-updates | < 5 min, rollback works |
| Battery life | Standby (1 notification/hour) | ≥ 7 days |
| Wireless charging | 0% → 100% | ≤ 30 min at 5W |
| Weather sensor | Read on wake, compare to known standard | Temp ±1°C, RH ±5% |
| BLE provisioning | Pair new device from phone | < 2 min first-time setup |
| Drop test | 1m drop onto concrete | Enclosure intact, functional |
| Temperature soak | −10°C to +50°C, 1hr each | Functional throughout |
| RF coexistence | WiFi active during BLE scan | No significant WiFi degradation |
| TLS cert pinning | MitM proxy between device and server | Connection refused |

### Deliverables
- Test report (all 13 test cases)
- Bug list with severity ratings
- Firmware v1.0.1 with any integration fixes
- Go/No-go recommendation for pilot run

---

## Phase 6 — 100-Unit Pilot Run
**Duration:** 2026-10-13 → 2026-11-21 (6 weeks)
**Depends on:** Phase 5 go/no-go approval

### Manufacturing sequence

| Week | Activity |
|---|---|
| W1 | Place all PCBWay orders: PCB (100 pcs), PCBA (100 units), CNC enclosures (100 sets) |
| W2 | Order long-lead items: Grepow batteries, Qi coils (these may need 4–6 week lead time — **order in Phase 5**) |
| W3-4 | PCBWay production (PCB + PCBA in parallel with CNC) |
| W4 | Receive PCBs + PCBA boards. Incoming QC: power-on test, WiFi connect, e-ink display |
| W5 | Receive CNC enclosures. Fit-check sample (5 units). Polish QC |
| W5 | Final assembly: insert PCB + battery + coil into enclosure, seal, screw |
| W5 | Final firmware flash (batch programming jig) |
| W5-6 | 100% functional test: notification receive + Copy button + charging |
| W6 | Package + label all 100 units |
| W6 | Ship to Vadik / LOT Systems warehouse |

### Programming jig
- 5-unit batch programming board using ESP-Prog headers
- Python script: erase → flash firmware → provision unique device UUID → QC test sequence
- QR code label printer integration (device UUID → qr → label)

### Deliverables
- 100 assembled, tested, packaged COSMO® CIA units
- Serial number register (CSV: S/N, device UUID, batch, test date, tester)
- 3 units held as golden reference samples

---

## Phase 7 — Documentation & PDF Manuals
**Duration:** 2026-10-13 → 2026-11-28 (parallel with Phase 6)

### Documents produced
| Document | Format | Audience |
|---|---|---|
| COSMO® CIA User Manual | PDF, 12 pages, designed | End user |
| Quick Start Card | PDF, 2-sided A6 | In-box |
| Firmware Reference Guide | PDF + MD | Developers |
| API Integration Guide | PDF + MD | LOT backend devs |
| Manufacturing & Assembly Guide | PDF | Production team |
| Regulatory Compliance File | PDF | FCC/CE submission |

### PDF toolchain
- Source: Markdown → Pandoc → LaTeX → PDF
- Design: Figma for layout/cover pages, exported as PDF pages, merged with Pandoc output
- Typography: Helvetica Neue (COSMO brand) + IBM Plex Mono (code)

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| 5mm thickness not achievable with spec components | Medium | High | Pre-check STEP Z-heights in Phase 0; fallback to 5.5mm |
| Grepow ultra-thin battery MOQ / lead time | Medium | High | Order batteries in Phase 5 (week 1) — 6-week lead |
| PCBWay CNC 316L SS surface defects | Low | Medium | Order 10% excess (110 enclosure sets); QC gate before assembly |
| ESP32-S3 FCC/CE host device testing | Low | Medium | Book test lab in Phase 5; module pre-certification reduces scope |
| LOT API device endpoints not ready by Phase 4 | Medium | High | Firmware uses mock server (stub) during dev; API must be ready by Phase 5 |
| e-ink display supply (GDEM0154D67) | Low | Medium | Moq 150 pcs from Good Display direct; identify alternative (Waveshare 1.54" RAWR) |
| Mirror polish quality rejection | Medium | Low | Approve polish spec with PCBWay via signed reference sample in Phase 2 |
| Qi efficiency through SS lower than spec | Low | Medium | Bench-test coil efficiency in Phase 1 with actual SS sample; resize coil if needed |

---

## Milestone Summary

| Milestone | Target date | Description |
|---|---|---|
| M0 — Spec complete | 2026-06-13 | All design docs approved |
| M1 — PCB prototype assembled | 2026-07-04 | 5 boards, all peripherals boot |
| M2 — Mechanical prototype fit-check | 2026-07-18 | PCB fits in SS enclosure |
| M3 — Polished sample approved | 2026-07-25 | Vadik approves mirror finish |
| M4 — Firmware v0.9.0 (feature complete) | 2026-09-12 | All firmware features working |
| M5 — API bridge live on lot-systems.com | 2026-09-05 | Device endpoints in production |
| M6 — Integration test pass | 2026-10-10 | All 13 tests pass |
| **M7 — Pilot run complete (100 units)** | **2026-11-21** | **100 units tested + packaged** |
| M8 — All manuals as PDF | 2026-11-28 | Full document suite delivered |

---

*COSMO® CIA — LOT Systems. © 2026 All rights reserved.*
