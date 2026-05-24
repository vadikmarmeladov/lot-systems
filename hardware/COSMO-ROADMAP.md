# COSMO NODE — Development Roadmap
**Project:** LOT Systems Physical Companion  
**Total Timeline:** 10 Weeks to 100-Unit Run  
**Date:** 2026-05-24  

---

## Roadmap Overview

```
Week  1  2  3  4  5  6  7  8  9 10
      │  │  │  │  │  │  │  │  │  │
PCB   ██ ██ ░░ ░░ ██ ██ ░░ ░░ ░░ ░░   Rev A → Rev B → PCBA
ENC   ░░ ░░ ██ ██ ░░ ░░ ██ ██ ░░ ░░   CNC samples → production
FW    ░░ ██ ██ ██ ██ ░░ ░░ ░░ ░░ ░░   Dev → validate → freeze
API   ░░ ░░ ██ ██ ░░ ░░ ░░ ░░ ░░ ░░   LOT connector endpoint
ASM   ░░ ░░ ░░ ░░ ░░ ██ ██ ██ ░░ ░░   Build 100 units
QA    ░░ ░░ ░░ ░░ ░░ ░░ ░░ ██ ██ ░░   Burn-in + test
SHIP  ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ██ ██   Box + send
```

---

## Phase 1 — Design & NPI (Weeks 1–4)

### Week 1: PCB Rev A Design + Order

**Deliverables:**
- [ ] Schematic completed in KiCad 8.0
  - ESP32-S3-MINI-1 footprint + decoupling
  - SSD1327 OLED I2C wiring
  - OV2640 DVP bus (8-bit + PCLK + VSYNC + HREF)
  - BME688 I2C bus (shared with OLED)
  - IP5310 Qi receiver + TP4056 charge IC
  - WS2812B status LED (GPIO data line + 5V boost from IP5310)
  - PTS526 button with 10kΩ pull-up
  - USB-C + CH340C UART bridge
  - GD25Q64 SPI flash (separate SPI bus from camera)
- [ ] 4-layer layout in KiCad
  - Layer 1 (top): components + signal routing
  - Layer 2: GND plane (solid copper pour)
  - Layer 3: 3.3V power plane
  - Layer 4 (bottom): Qi coil keepout + secondary signals
  - Camera module positioned top-center with lens centered on 6mm SS aperture
  - OLED connector on left edge, flat flex to display
  - Battery connector on right edge
- [ ] Design Rule Check (DRC) pass
- [ ] Generate Gerbers (RS-274X) + drill files + BOM + CPL centroid
- [ ] Submit to PCBWay: 10 bare boards, 4-layer ENIG matte black
- **PCBWay order:** https://www.pcbway.com/orderonline.aspx

**Milestones:**  
`M1.1` — Schematic review complete  
`M1.2` — PCBWay order confirmed  

---

### Week 2: Firmware Foundation

**Deliverables:**
- [ ] Set up ESP-IDF v5.x dev environment
- [ ] Partition table: NVS (device config), OTA (firmware update), SPIFFS (log cache)
- [ ] WiFi provisioning via BLE (ESP-BLE-MESH or custom GATT service)
- [ ] NVS key-value store for: WiFi SSID/pass, device token, notification config
- [ ] OLED driver: SSD1327 via I2C, frame buffer, text rendering (6×8 bitmap font)
- [ ] BME688 driver: BSEC2 library integration, 3-second read cycle
- [ ] OV2640 driver: DVP init, JPEG capture on demand
- [ ] WS2812B RMT driver: green/red/blue pulse patterns
- [ ] Button interrupt: debounce 50ms, short press vs long press detection

**Dev hardware:** ESP32-S3-DevKitC-1 + breakout modules  

**Milestones:**  
`M2.1` — All peripheral drivers reading live data  
`M2.2` — OLED rendering "Hello LOT." confirmation  

---

### Week 3: CNC Enclosure Sample + API Connector

**Deliverables:**

**Enclosure:**
- [ ] STEP file for Side A (polished top, 40×40×2mm with 0.5mm lip for seal)
- [ ] STEP file for Side B (functional bottom with display window, camera aperture, button recess, USB-C slot, screw bosses)
- [ ] Submit to PCBWay CNC: 2 pairs in 316L SS, Side A mirror polish, Side B satin
- **PCBWay CNC:** https://www.pcbway.com/rapid-prototyping/CNC-Machining/

**LOT API Connector (server-side):**
- [ ] Add device endpoints to lot-systems.com API:
  - `POST /api/device/register` — pairing + token issuance
  - `POST /api/log` — inbound Copy button event (adds to user's Log tab)
  - `GET /api/notifications/device` — poll for pending notifications
  - `POST /api/device/session` — compressed session data upload
  - `WebSocket /ws/device/:device_id` — persistent push channel
- [ ] Device token middleware: JWT validation, device_id binding
- [ ] Log tab integration: device log entries tagged with `source: cosmo_node`
- [ ] Notification composer: admin UI to send custom messages to devices

**Milestones:**  
`M3.1` — CNC order confirmed  
`M3.2` — `/api/log` endpoint live on staging  

---

### Week 4: Rev A Board Arrival + Bring-Up

**Deliverables:**
- [ ] Rev A boards arrive from PCBWay
- [ ] Hand-solder 5 prototype boards (hot air + solder paste)
- [ ] Bring-up checklist:
  - [ ] 3.3V rail stable
  - [ ] ESP32-S3 boots (USB-C flash via esptool.py)
  - [ ] OLED lights up
  - [ ] BME688 reads temperature
  - [ ] OV2640 captures JPEG
  - [ ] WiFi connects to test AP
  - [ ] API POST succeeds
  - [ ] Qi charging works
  - [ ] Button press fires interrupt
- [ ] Capture Rev A issues → Rev B errata list

**Milestones:**  
`M4.1` — At least 3 of 5 boards boot and connect to WiFi  
`M4.2` — Rev B errata documented  

---

## Phase 2 — Production (Weeks 5–8)

### Week 5–6: Rev B PCB + Firmware v1.0

**Rev B PCB:**
- [ ] Apply Rev A errata fixes
- [ ] Submit turnkey PCBA to PCBWay: 120 boards, full SMT assembly
- [ ] Upload BOM, Gerbers, CPL centroid — PCBWay sources components
- [ ] Select X-ray AOI inspection option
- **PCBWay PCBA:** https://www.pcbway.com/smt-assembly.html

**Firmware v1.0:**
- [ ] Notification polling loop (60s interval, configurable via NVS)
- [ ] WebSocket client (persistent push, auto-reconnect with exponential backoff)
- [ ] OLED notification renderer: typewriter animation 80ms/char
- [ ] Copy button handler: POST to `/api/log` with weather snapshot
- [ ] Session log compression: zlib → GD25Q64 SPI flash storage
- [ ] OTA firmware update: ESP-IDF OTA over HTTPS from lot-systems.com/firmware/
- [ ] Deep sleep: 10-minute idle timeout, wake on button or WiFi notification
- [ ] Battery indicator: 4 OLED pixels bottom-right show charge level
- [ ] BLE pairing mode: long press (3s) button → BLE advertise for 30s → timeout back to WiFi

**Milestones:**  
`M5.1` — Rev B boards ordered  
`M6.1` — Firmware v1.0 tagged in git  

---

### Week 7: CNC Production Enclosures + Final Assembly

**Deliverables:**
- [ ] 130 enclosure pairs arrive from PCBWay CNC
- [ ] Visual QA: check polish finish, aperture dimensions, screw boss fit
- [ ] PCBAs arrive from PCBWay SMT (120 boards)
- [ ] SMT board inspection: check all component placements, test 10 boards
- [ ] Final assembly procedure:
  1. Flash firmware v1.0 via USB-C jig (batch flash 10 boards simultaneously)
  2. Pair device token via BLE provisioning app
  3. Place PCBA + battery into Side B shell
  4. Apply O-ring gasket
  5. Lower Side A on top
  6. Insert 4× M1.2 screws
  7. Stick Gorilla Glass lens (UV-cure adhesive)
  8. Final Qi charge test: place on pad → status LED blue → green on full

**Milestones:**  
`M7.1` — First 20 units fully assembled  

---

### Week 8–9: QA / Burn-In

**Burn-In Protocol (per unit):**
- 48-hour power cycle test: alternate Qi charge + discharge every 6 hours
- 500 simulated Copy button presses (automated jig via relay board)
- WiFi reconnect stress: toggle AP 100 times, verify reconnect < 5s each
- Notification display: send 50 test notifications from lot-systems.com test account
- Environmental: BME688 accuracy cross-check vs. reference thermometer
- OTA update: push firmware v1.0.1 (dummy patch) to all 100 units

**Pass criteria:**
- [ ] WiFi connects reliably in < 3s
- [ ] Copy POST succeeds 100% in normal conditions
- [ ] OLED no dead pixels
- [ ] Battery charges to 100% in < 2h on 5W Qi pad
- [ ] Deep sleep current < 20 µA

**Milestones:**  
`M9.1` — 100 units pass burn-in  

---

### Week 10: Packaging + Shipping

**Deliverables:**
- [ ] Box each unit: foam insert, USB-C cable, Quick Start Card
- [ ] QR code on Quick Start Card → lot-systems.com/cosmo-setup
- [ ] Serial number label inside box lid (COSMO-0001 through COSMO-0100)
- [ ] Shipping labels + tracking
- [ ] Unit registry: import all serial numbers + device IDs into lot-systems.com admin

**Milestones:**  
`M10.1` — All 100 units shipped  

---

## Phase 3 — Post-Launch (Weeks 11+)

| Item | Priority | Target |
|---|---|---|
| FCC/CE certification (for retail) | P1 | +8 weeks post-ship |
| OTA firmware v1.1 | P1 | +2 weeks post-ship |
| Mobile companion app (BLE setup + notification composer) | P2 | +6 weeks |
| LOT site notification composer UI | P2 | +3 weeks |
| Second hardware revision (thinner body, 5mm) | P3 | +6 months |
| COSMO NODE 2 (e-ink display option) | P3 | +12 months |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 5mm thickness infeasible in Rev A | High | Medium | Rev A targets 7.5mm; 5mm is Rev C goal |
| OV2640 fit inside 40×40mm body | Medium | Low | Use ribbon cable, offset camera to sub-PCB |
| Qi charging coil conflicts with camera ground plane | Medium | High | Separate coil on bottom copper layer, keep-out on top |
| BME688 heating from MCU | Low | Medium | BME688 placed at board edge, away from ESP32-S3 |
| PCBWay CNC lead time > 2 weeks | Medium | Medium | Order enclosures in Week 1 concurrently with PCB |
| Battery swelling if TP4056 misconfigured | Low | High | Set PROG resistor for 100mA max charge current |
| WiFi connection failure in dense RF environments | Low | Medium | WPA3 support in ESP-IDF v5, 2.4GHz fallback |

---

## Key Contacts & Links

| Resource | URL |
|---|---|
| PCBWay PCB ordering | https://www.pcbway.com/orderonline.aspx |
| PCBWay CNC machining | https://www.pcbway.com/rapid-prototyping/CNC-Machining/ |
| PCBWay SMT assembly | https://www.pcbway.com/smt-assembly.html |
| Espressif ESP-IDF docs | https://docs.espressif.com/projects/esp-idf/en/latest/ |
| Bosch BSEC2 library | https://www.bosch-sensortec.com/software-tools/software/bsec/ |
| LOT Systems site | https://lot-systems.com |
| LOT Systems API (staging) | https://lot-systems.com/api |
| PCBWay Gerber guidelines | https://www.pcbway.com/blog/help_center/Generate_Gerber_file_from_Altium_Designer.html |
