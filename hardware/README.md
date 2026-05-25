# COSMO® CIA — Hardware Project Index
**LOT-Computer · Hardware Division**
**Date:** 2026-05-25

---

## Document Map

| # | Document | File | Purpose |
|---|---|---|---|
| 1 | **Device Specification** | [COSMO-DEVICE-SPEC.md](./COSMO-DEVICE-SPEC.md) | Full hardware spec: dimensions, MCU, display, camera, sensors, power |
| 2 | **Bill of Materials** | [COMPONENTS-BOM.md](./COMPONENTS-BOM.md) | Every component with part numbers, suppliers, links, and 100-unit cost |
| 3 | **Manufacturing Roadmap** | [MANUFACTURING-ROADMAP.md](./MANUFACTURING-ROADMAP.md) | PCBWay order plan, CNC shells, PCBA, QA, 16-week Gantt |
| 4 | **Firmware Document** | [FIRMWARE-DOCUMENT.md](./FIRMWARE-DOCUMENT.md) | ESP32-S3 firmware architecture, RTOS tasks, OTA, power management |
| 5 | **Software Connector** | [SOFTWARE-CONNECTOR.md](./SOFTWARE-CONNECTOR.md) | LOT API integration: all endpoints, data schema, ESP32 HTTP client code |
| 6 | **Charger Specification** | [CHARGER-SPEC.md](./CHARGER-SPEC.md) | Qi wireless charging — receiver IC, transmitter pad, safety, timeline |
| 7 | **User Manual** | [USER-MANUAL.md](./USER-MANUAL.md) | PDF-ready end-user guide: setup, COPY button, notifications, charging |

---

## Quick Summary

**COSMO® CIA** is a 40×40×5mm stainless steel AI notification pager.

- Receives push notifications from `lot-systems.com` on a 1.3" OLED screen
- Presses of the **COPY button** create Log entries in the user's LOT Log tab
- Reads ambient environment with the **Bosch BME688** AI-grade sensor (temp, humidity, pressure, IAQ)
- Wireless Qi charging — polished side down on the pad
- Manufactured via **PCBWay** (PCB + CNC stainless shells + PCBA turnkey)
- 100-unit pilot run · ~$87/unit BOM · 16-week timeline

---

## LOT API Device Connector

Server-side code: [`src/server/routes/device-api.ts`](../src/server/routes/device-api.ts)
Registered at: `/api/device/*`

Key endpoints:
- `POST /api/device/register` — first-boot device pairing
- `GET /api/device/notifications` — poll for pending notifications
- `POST /api/device/copy-signal` — Copy button → LOT Log tab
- `POST /api/device/sensor-data` — BME688 readings
- `GET /api/device/ota/latest` — firmware update check
- `POST /api/device/send-notification` — push from site to device
- `GET /api/device/devices` — list user's registered devices

---

## Manufacturing Contact

- **PCBWay**: https://www.pcbway.com (PCB · CNC · PCBA)
- Email your PCBWay sales rep with the `COMPONENTS-BOM.md` BOM export
- CNC files: upload STEP + PDF drawing to https://www.pcbway.com/rapid-prototyping/manufacture/?type=4

---

*COSMO® CIA · LOT Systems · lot-systems.com*
