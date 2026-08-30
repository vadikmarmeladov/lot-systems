<!--
  LOT SYSTEMS CORPORATION
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Hardware Documentation

Planning, bill of materials, firmware, software bridge, and manufacturing
roadmap for **COSMO® Cube** — the LOT Computer: a physical, stainless-steel
LOT® terminal connected to lot-systems.com.

**Start here:** [`docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md`](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
is the master design document — physical form, notification language,
sensors, API connector overview, and the v1.0 → v1.1 → v2 roadmap.

## Documents in this directory

| Document | Covers |
|---|---|
| [`01-BOM.md`](./01-BOM.md) | Full components buying list, part numbers, distributor search terms, cost roll-up |
| [`02-FIRMWARE.md`](./02-FIRMWARE.md) | On-device firmware: boot flow, pairing, operating loop, session compression, OTA |
| [`03-SOFTWARE-BRIDGE.md`](./03-SOFTWARE-BRIDGE.md) | Server-side LOT API connector: new routes, data model, Settings panel |
| [`04-MANUFACTURING-PCBWAY.md`](./04-MANUFACTURING-PCBWAY.md) | PCBWay fabrication plan, phased rollout to a 100-unit pilot run, cost/timeline |
| [`06-USER-MANUAL.md`](./06-USER-MANUAL.md) | Operator-facing setup and use guide (source for the PDF manual) |
| [`pdf/`](./pdf/) | Generated PDF manuals |

Firmware and software-bridge documents are kept separate by design (they
can be handed to different engineers independently) — see the note at the
top of each.

## Status (v1.0)

Planning complete: physical spec, BOM, firmware architecture, software
bridge, and manufacturing roadmap are written. **Not yet done:** PCB
layout and mechanical CAD files (the actual prerequisites for a PCBWay
quote), and the first hand-built prototype. See
`04-MANUFACTURING-PCBWAY.md` Section 6 for the open items list.
