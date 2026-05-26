# COSMO® CIA — Development Roadmap
## From Concept to 100-Unit Production
**Version:** 1.0  
**Date:** 2026-05-26  
**Author:** Vadik, Inventor · COSMO® CIA

---

## Overview

| Phase | Name | Duration | Deliverable |
|-------|------|----------|-------------|
| 0 | Foundations | 2 weeks | Docs, BOM finalized, PCBWay accounts |
| 1 | Prototype Alpha | 6 weeks | Hand-assembled breadboard prototype |
| 2 | Prototype Beta (PCB) | 5 weeks | First real PCB, enclosure prototype |
| 3 | Firmware + Software | 4 weeks | Full firmware + LOT API connector live |
| 4 | Pilot Run | 6 weeks | 10-unit pilot through PCBWay |
| 5 | Production Run | 8 weeks | 100-unit production delivery |
| 6 | Documentation + Ship | 3 weeks | PDF manuals, packaging, dispatch |

**Total estimated time:** ~34 weeks (~8 months)  
**Start date:** June 2026  
**Target delivery:** February 2027

---

## Phase 0 — Foundations (Weeks 1–2)

### Goals
- Finalize all design documents
- Open PCBWay account and verify supplier capabilities
- Order all prototype components
- Set up firmware development environment

### Tasks

| Task | Owner | Due |
|------|-------|-----|
| Finalize BOM (this doc) | Vadik | Week 1 |
| Open PCBWay account, configure CNC order template | Engineering | Week 1 |
| Order prototype components from LCSC/Mouser | Procurement | Week 1 |
| Install ESP-IDF + VS Code ESP32 toolchain | Firmware Dev | Week 1 |
| Create GitHub repo for COSMO-CIA firmware | Dev | Week 2 |
| Create Figma screen UI mockups (notification views) | Design | Week 2 |
| Design Qi charger PCB layout (separate board) | EE | Week 2 |
| Set up LOT API /device endpoints (server side) | Backend Dev | Week 2 |

### Exit Criteria
- All docs signed off by Vadik
- Prototype components ordered
- Firmware repo initialized

---

## Phase 1 — Alpha Prototype (Weeks 3–8)

### Goals
Build a working, hand-wired prototype on a development board to validate:
1. ESP32-S3 ↔ BME688 (I2C weather readings)
2. ESP32-S3 ↔ OV2640 (camera capture)
3. ESP32-S3 ↔ ST7735 (screen rendering)
4. ESP32-S3 WiFi → lot-systems.com (WebSocket notification receive)
5. Copy button → LOT API POST

### Development Board Stack

```
Seeed XIAO ESP32-S3 Sense (has camera + WiFi built in)
  + BME688 breakout (Pimoroni or custom)
  + 1.0" TFT breakout
  + LiPo battery (generic 500mAh for testing)
  + Qi receive module (off-shelf)
```

Use Seeed XIAO ESP32-S3 Sense for alpha — it includes OV2640 camera, WiFi, and fits a 21×17.5mm footprint. This accelerates alpha by 3 weeks.

### Firmware Milestones (Alpha)

| Milestone | Target Week |
|-----------|-------------|
| WiFi connects, receives WebSocket notification, displays on screen | Week 4 |
| BME688 readings shown on screen alongside notification | Week 5 |
| OV2640 captures image on button press | Week 6 |
| Copy button triggers HTTPS POST to LOT /api/device/log | Week 6 |
| Battery + Qi charging functional on bench | Week 7 |
| Session compression (gzip, 30-min windows) | Week 8 |

### Exit Criteria
- All 6 milestones green
- Notification appears on screen within 3 seconds of sending from lot-systems.com
- Copy button log appears in LOT Log tab within 2 seconds
- No ESP32 panics during 24-hour soak test

---

## Phase 2 — Beta PCB + Enclosure (Weeks 9–13)

### Goals
- Design production PCB (38×38mm, 4-layer)
- Order prototype enclosure from PCBWay CNC
- Validate all components fit within 5mm height budget

### Height Budget (5mm total)

| Layer | Component | Height |
|-------|-----------|--------|
| Back steel panel | 316L | 0.80 mm |
| Silicone gasket | | 0.20 mm |
| PCB | 4-layer | 0.80 mm |
| Tallest component | ESP32-S3 module | 3.10 mm |
| Front steel panel | 316L | 0.80 mm |
| **Total** | | **5.70 mm** |

> Note: 5.7mm is tighter than target 5mm. Revised target: **5.5mm** with 0.6mm steel panels. If further compression needed, evaluate chip-down mounting for ESP32-S3 or custom mini-module.

### PCB Design Tasks

| Task | Tool | Notes |
|------|------|-------|
| Schematic capture | KiCad 8 | All components from BOM |
| PCB layout (38×38mm) | KiCad 8 | 4-layer stackup |
| DRC (design rule check) | KiCad 8 | PCBWay 4/4mil rules |
| Gerber export | KiCad 8 | PCBWay-compatible format |
| BOM + CPL export | KiCad 8 | For PCBA service |
| 3D model review | KiCad 8 / FreeCAD | Check height clearances |

### Enclosure Design Tasks

| Task | Tool |
|------|------|
| 3D model (back + front panels) | FreeCAD / Fusion 360 |
| CNC tolerances annotation | CAD drawing |
| Camera aperture + screen window cutout sizing | CAD |
| STEP export for PCBWay CNC | Fusion 360 |
| First article inspection (FAI) at PCBWay | PCBWay inspection service |

### Exit Criteria
- PCB manufactured and hand-assembled (5 boards)
- Enclosure first article received and fits PCB
- All Phase 1 firmware functions on new PCB
- Height within 5.5mm

---

## Phase 3 — Firmware & Software Completion (Weeks 14–17)

### Goals
Complete all firmware and software layers. This phase runs concurrently with Phase 2 enclosure iteration.

### Firmware Completion

| Feature | Status at Phase 2 | Target |
|---------|------------------|--------|
| WiFi connect + reconnect | Done | Hardened |
| WebSocket persistent connection | Done | Heartbeat + auto-reconnect |
| Notification display engine | Done | Animation + sleep modes |
| BME688 + BSEC2 AI IAQ | Done | BSEC2 state save/restore |
| OV2640 capture + JPEG | Done | HTTPS upload to LOT API |
| Copy button + haptic | Done | Debounce hardened |
| Session compression | Done | Flash wear leveling |
| Firmware OTA update | Not started | Full OTA via lot-systems.com |
| Deep sleep / wake | Not started | <50µA deep sleep |
| Provisioning mode | Not started | BLE provisioning (no buttons) |

### Software Completion

| Feature | Component | Notes |
|---------|-----------|-------|
| LOT API /api/device endpoints | Node.js server | See `COSMO-CIA-SOFTWARE.md` |
| Device log → Log tab rendering | Frontend | React component |
| Notification push from site → device | WebSocket server | Broadcast by device ID |
| OTA firmware server | Node.js | Signed binary delivery |
| Camera image receive + store | Node.js | S3 / DigitalOcean Spaces |

### Exit Criteria
- OTA firmware update works end-to-end
- Deep sleep verified: <50µA at idle
- All LOT API endpoints live on lot-systems.com staging
- Firmware version string displayed on boot screen

---

## Phase 4 — Pilot Run: 10 Units (Weeks 18–23)

### Goals
Order 10 fully assembled units through PCBWay PCBA. Validate production process.

### Steps

| Step | Week |
|------|------|
| Upload final Gerbers + BOM + CPL to PCBWay PCBA | 18 |
| Upload STEP files to PCBWay CNC for 10 enclosures | 18 |
| PCBWay manufacturing window | 19–21 |
| Receive pilot units, initial power-on test | 22 |
| Flash firmware via USB-C jig (all 10 units) | 22 |
| Soak test: 72 hours continuous operation | 22–23 |
| Defect log, engineering changes (EC) | 23 |

### Acceptance Criteria (Pilot)
- ≥ 9/10 units pass power-on test
- ≤ 2% functional defect rate
- Notification end-to-end latency < 3 seconds (WiFi connected)
- Copy button log appears in LOT Log tab in < 2 seconds
- Battery life: ≥ 6 hours active use
- Wireless charging: device charges from 0–100% in ≤ 90 min

---

## Phase 5 — Production Run: 100 Units (Weeks 24–31)

### Goals
Full 100-unit production through PCBWay.

### Steps

| Step | Week |
|------|------|
| Incorporate EC from pilot, final PCB revision | 24 |
| Place full production order (PCB + PCBA + CNC) | 24 |
| PCBWay manufacturing window | 25–29 |
| Receive production units | 30 |
| QC inspection (sampling: 20% AQL) | 30 |
| Firmware flash (batch via USB-C jig or OTA pre-flash) | 30–31 |
| Final packaging assembly | 31 |

### Quality Control Checklist (per unit)

- [ ] Power-on: boot screen displays firmware version
- [ ] WiFi provisioned and connects within 60 seconds
- [ ] Notification received from lot-systems.com (test ping)
- [ ] Copy button sends signal, appears in Log tab
- [ ] BME688 reading: temp/humidity/AQI displayed
- [ ] OV2640: camera preview captured (no corruption)
- [ ] Wireless charging: LED indicates charge state
- [ ] Enclosure: no scratches on polished face
- [ ] Enclosure: snap-fit secure (no rattle)
- [ ] Serial number programmed to eFuse

---

## Phase 6 — Documentation & Shipping (Weeks 32–34)

### Goals
- Generate PDF manuals (from this repo's Markdown)
- Package units with charger + sleeve
- Ship to first users

### Documentation

| Document | Format | Delivery |
|----------|--------|---------|
| User Manual | PDF (A5) | In box + lot-systems.com download |
| Firmware Reference | PDF + Markdown | developers.lot-systems.com |
| API Connector Reference | PDF + Markdown | developers.lot-systems.com |
| Quick Start Card | A6 card, print | In box |

### Packaging

| Item | Notes |
|------|-------|
| Matte black card sleeve (outer) | Silver foil COSMO® stamp |
| Foam insert (inner) | Die-cut for device + charger + card |
| USB-C cable (0.5m) | For charger |
| Quick Start Card | A6, doublesided |
| Warranty card | 1-year hardware warranty |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| 5mm height budget exceeded | Medium | High | Revised to 5.5mm; use 0.6mm panels |
| ESP32-S3 WiFi interference from steel enclosure | Medium | High | Aperture in back panel for antenna; test in Alpha |
| OV2640 focus fixed at wrong distance | Low | Medium | Order autofocus variant as backup |
| BME688 BSEC2 license restrictions | Low | Medium | Bosch provides BSEC2 binary; review terms before shipping |
| PCBWay CNC delivery delay | Medium | Medium | Order enclosure 2 weeks ahead of PCB delivery |
| LiPo battery custom size availability | Medium | High | Pre-qualify 2 suppliers in Phase 0 |
| LOT API server capacity under 100 devices | Low | Medium | Load test at Phase 3 |

---

*Roadmap v1.0 — subject to revision after Phase 1 exit review.*
