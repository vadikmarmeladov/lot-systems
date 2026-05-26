# COSMO® CIA — Hardware Documentation Index
**LOT Systems Hardware Division**  
**Invented by Vadik · COSMO® CIA**

---

## Document Set

| # | Document | Description |
|---|----------|-------------|
| 1 | [COSMO-CIA-PRODUCT-PLAN.md](./COSMO-CIA-PRODUCT-PLAN.md) | Master product plan — identity, design, logic, feature summary |
| 2 | [COSMO-CIA-COMPONENTS-BOM.md](./COSMO-CIA-COMPONENTS-BOM.md) | Full Bill of Materials — every component, part number, supplier link, pricing, 100-unit cost |
| 3 | [COSMO-CIA-ROADMAP.md](./COSMO-CIA-ROADMAP.md) | Development roadmap — 6 phases, 34 weeks, milestones, risk register |
| 4 | [COSMO-CIA-FIRMWARE.md](./COSMO-CIA-FIRMWARE.md) | Firmware specification — ESP32-S3, FreeRTOS tasks, all subsystems |
| 5 | [COSMO-CIA-SOFTWARE.md](./COSMO-CIA-SOFTWARE.md) | Software & API connector — server endpoints, WebSocket, Log tab integration |
| 6 | [COSMO-CIA-MANUFACTURING.md](./COSMO-CIA-MANUFACTURING.md) | Manufacturing guide — PCBWay PCB + PCBA + CNC enclosure, QC |
| 7 | [COSMO-CIA-USER-MANUAL.md](./COSMO-CIA-USER-MANUAL.md) | End-user manual — PDF-ready, A5 format |

---

## Device Summary

**COSMO® CIA** (Compact Intelligence Apparatus) is a 40×40×5.5mm stainless steel pager-class device that:

- Receives AI-powered notifications from **lot-systems.com** via WebSocket
- Displays them on a 1-inch TFT screen
- Logs user acknowledgments to the **LOT Log tab** via the Copy button
- Captures environment data (temperature, humidity, AQI) with a Bosch BME688 AI sensor
- Shoots images with a 2MP camera
- Charges wirelessly via Qi
- Ships in a 100-unit run manufactured entirely by **PCBWay**

**Total 100-unit cost estimate:** ~$10,651 (~$107/unit)  
**Target delivery:** February 2027

---

*All documents in this folder are living specifications — update as design evolves.*
