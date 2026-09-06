# LOT Node — Hardware Program

**Codename:** LOT Node
**One-liner:** A palm-sized stainless-steel companion computer that turns Memory
Engine / QOS signals from [lot-systems.com](https://lot-systems.com) into a
pager-like notification on your desk ("Coffee time!"), and pushes a physical
button-press ("Copy") back into your Log tab.

This directory is the single source of truth for the hardware program. It is
organized as separate documents on purpose (per the build brief, item 11 —
"Separate documents") so firmware, software, mechanical, and manufacturing
concerns can move independently without merge conflicts.

| Doc | Covers |
|---|---|
| [`LOT-COMPUTER-PLAN.md`](./LOT-COMPUTER-PLAN.md) | Product plan, requirements traceability, roadmap/phases |
| [`HARDWARE-SPEC.md`](./HARDWARE-SPEC.md) | Mechanical/industrial design, enclosure, sensors, camera, charging |
| [`BOM-COMPONENTS.md`](./BOM-COMPONENTS.md) | Bill of materials, supplier links, per-unit and 100-unit costs |
| [`MANUFACTURING-ROADMAP.md`](./MANUFACTURING-ROADMAP.md) | PCBWay process, DFM, 100-unit production run, timeline |
| [`FIRMWARE.md`](./FIRMWARE.md) | On-device firmware architecture, boot flow, OTA |
| [`SOFTWARE-CONNECTOR.md`](./SOFTWARE-CONNECTOR.md) | LOT API connector, auth, pager notifications, Copy→Log signal |
| [`USER-MANUAL-OUTLINE.md`](./USER-MANUAL-OUTLINE.md) | Structure for the printed/PDF manuals |
| [`manuals/`](./manuals/) | Generated PDF manuals (Quick Start + Full Manual) |

## Status

This is **Session 1** of the hardware program — plan, BOM, and roadmap only.
No physical prototype exists yet. See `LOT-COMPUTER-PLAN.md` §7 for open risks
that must be resolved before ordering the first PCBWay proto run.

Session reports for this program are pushed to `docs/` at the repo root
following the existing `SESSION_REPORT_YYYY_MM_DD_<slug>.md` convention
(see item 8/20 — "compress the information in each session").
