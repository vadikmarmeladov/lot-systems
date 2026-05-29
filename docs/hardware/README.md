<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Hardware Documentation Index

**Product:** COSMO® CIA (Connected Intelligence Agent)
**Status:** Phase 1 — Specification complete
**Target ship:** November 2026 (100 units)

---

## Documents

| Document | Description | Status |
|----------|-------------|--------|
| [COSMO-CIA-HARDWARE-SPEC.md](./COSMO-CIA-HARDWARE-SPEC.md) | Full hardware specification: dimensions, components, block diagram, PCB spec | ✅ v1.0 |
| [COSMO-CIA-COMPONENTS-LIST.md](./COSMO-CIA-COMPONENTS-LIST.md) | Bill of Materials with part numbers, prices, and supplier links | ✅ v1.0 |
| [COSMO-CIA-ROADMAP.md](./COSMO-CIA-ROADMAP.md) | Development roadmap: Phase 1–7, milestones, risk register | ✅ v1.0 |
| [COSMO-CIA-PCB-GUIDE.md](./COSMO-CIA-PCB-GUIDE.md) | PCBWay manufacturing guide: layer stack, design rules, Gerber export | ✅ v1.0 |
| [COSMO-CIA-FIRMWARE.md](./COSMO-CIA-FIRMWARE.md) | Firmware architecture, task table, pin assignments, protocols | ✅ v1.0 |
| [COSMO-CIA-SOFTWARE-CONNECTOR.md](./COSMO-CIA-SOFTWARE-CONNECTOR.md) | LOT API connector: all endpoints, WebSocket protocol, DB schema | ✅ v1.0 |
| [COSMO-CIA-MANUAL.md](./COSMO-CIA-MANUAL.md) | User manual (for PDF export): setup, daily use, troubleshooting | ✅ v1.0 |
| [COSMO-CIA-WIRELESS-CHARGER.md](./COSMO-CIA-WIRELESS-CHARGER.md) | Qi 5W charging system: RX coil, TX dock, magnets, BOM | ✅ v1.0 |

---

## Quick Summary

**What it is:** A 40 × 40 × 6 mm stainless steel ambient notification device connected to lot-systems.com.

**What it does:**
- Displays AI-generated notifications from the LOT Memory Engine on a 1.5" OLED
- COPY button acknowledges the notification and logs it to the user's LOT Log tab
- BME280 sensor measures temperature, humidity, and pressure in real time
- Charges wirelessly on a matching magnetic stainless dock (Qi 5W)
- Camera scans QR code for initial pairing — no app required

**Who makes it:** PCBWay (PCB + CNC body). Firmware: ESP-IDF on ESP32-S3.

**Cost:** ~$142/unit at 100-unit run. Suggested retail: $299–$349.

**Ship date:** November 2026 (100-unit pilot run).

---

*© 2026 LOT Systems, Inc. All rights reserved.*
