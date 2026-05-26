# COSMO® LOT Computer — Hardware Documentation Index

**Inventor:** Vadik Marmeladov — COSMO® CIA / LOT Systems  
**Status:** Pre-Production Design  
**Date:** 2026-05-26

---

## What is the COSMO LOT Computer?

A flat silver square (40×40×5mm) in 316L stainless steel that connects to lot-systems.com and:
- Displays AI-powered notifications on a 1.3" OLED screen ("Coffee time!", Memory prompts, insights)
- Sends one-tap Copy signals back to the LOT Log tab
- Reads temperature, humidity, air quality, and ambient light
- Charges wirelessly (Qi 5W)
- Built on ESP32-S3 with Wi-Fi + BLE
- Fabricated via PCBWay (PCB + PCBA + CNC)
- First run: 100 units

---

## Document Index

| Document | File | Description |
|---|---|---|
| **Master Specification** | `COSMO-LOT-COMPUTER-SPEC.md` | Complete hardware spec: form factor, components, architecture |
| **Components Buying List** | `COMPONENTS-BUYING-LIST.md` | Full BOM with supplier links, part numbers, prices, ~$78/unit |
| **Project Roadmap** | `ROADMAP.md` | 9-phase plan Jun–Dec 2026, milestones, budget ~$8,150 |
| **Firmware Guide** | `FIRMWARE-GUIDE.md` | ESP-IDF v5.2 modules, GPIO map, OTA, power management |
| **LOT API Connector** | `LOT-API-CONNECTOR.md` | New API endpoints for hardware + DB schema + Log tab integration |
| **Software Connector** | `SOFTWARE-CONNECTOR.md` | TypeScript SDK for firmware bridge, notification manager |
| **PCB Design Guide** | `PCB-DESIGN-GUIDE.md` | PCBWay order checklist, 4-layer stackup, KiCad rules, Gerbers |
| **Manufacturing Guide** | `MANUFACTURING-100-UNITS.md` | 100-unit assembly protocol, QC, firmware jig, packaging |
| **User Manual** | `USER-MANUAL.md` | End-user instructions (source for printed PDF manual) |

---

## Key Numbers

| Item | Value |
|---|---|
| Device dimensions | 40 × 40 × 5 mm |
| Weight | ~28 g |
| Battery life | ~48 h standby |
| Charge time (Qi 5W) | ~2.5 h |
| Per-unit cost | ~$78 |
| 100-unit total budget | ~$8,150 |
| PCB fabrication | PCBWay — 4-layer ENIG, 37×37mm |
| MCU | ESP32-S3-MINI-1U |
| AI sensor | Bosch BME688 (Bosch AI Studio) |
| Display | 1.3" SSD1327 OLED 128×128 |
| Firmware | ESP-IDF v5.2 |
| Timeline | Jun–Dec 2026 |

---

## Quick Links

- PCBWay PCBA order: [pcbway.com/QuotePCBA.aspx](https://www.pcbway.com/QuotePCBA.aspx)
- PCBWay CNC machining: [pcbway.com/rapid-prototyping](https://www.pcbway.com/rapid-prototyping/manufacture/?type=4)
- Grepow custom LiPo: [grepow.com/shaped-battery.html](https://www.grepow.com/shaped-battery.html)
- ESP32-S3 at Digi-Key: search `ESP32-S3-MINI-1U`
- BME688 at Digi-Key: search `BME688`
- LOT Hardware Settings: lot-systems.com → Settings → Hardware *(coming soon)*

---

*COSMO® CIA — LOT Systems — © 2026 Vadik Marmeladov*
