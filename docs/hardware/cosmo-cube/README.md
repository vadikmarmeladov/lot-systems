<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Model C1

**LOT Systems' first hardware computer.** A palm-sized, two-part stainless
steel device that connects to lot-systems.com over Wi-Fi: it receives
ambient, pager-like notifications from the LOT AI ("Coffee time!"), carries
a camera and a weather/air sensor, and has one physical button — **Copy** —
that writes a log entry straight to a user's Log tab.

This directory is the complete build record: plan, parts list with
suppliers, mechanical spec, firmware spec, software/API connector spec,
manufacturing plan for a 100-unit run, and the PDF manual pipeline.

**Status:** DRAFT — Phase 0 (specification). No physical unit has been
built yet. Nothing here has been benchmark-verified in hardware.

---

## Document Set

Per the brief's instruction to keep documents separate:

| # | Document | Covers |
|---|----------|--------|
| 1 | [`01-PRODUCT-PLAN-AND-ROADMAP.md`](./01-PRODUCT-PLAN-AND-ROADMAP.md) | Concept, design pillars, phased roadmap, KPIs, risks |
| 2 | [`02-BILL-OF-MATERIALS.md`](./02-BILL-OF-MATERIALS.md) | Every component, representative part, supplier link, 100-unit cost |
| 3 | [`03-MECHANICAL-DESIGN.md`](./03-MECHANICAL-DESIGN.md) | 2-part stainless steel body, 40×40×5mm form factor, faces, finish |
| 4 | [`04-FIRMWARE-SPEC.md`](./04-FIRMWARE-SPEC.md) | ESP32-S3 firmware: notifications, session compression, Copy button, OTA |
| 5 | [`05-SOFTWARE-LOT-API-CONNECTOR.md`](./05-SOFTWARE-LOT-API-CONNECTOR.md) | How firmware talks to lot-systems.com; pairing, auth, endpoints |
| 6 | [`06-MANUFACTURING-AND-COMPLIANCE.md`](./06-MANUFACTURING-AND-COMPLIANCE.md) | PCBWay fab plan, 100-unit run economics, FCC/CE/Qi/privacy compliance |
| 7 | [`07-USER-MANUAL-PDF-PLAN.md`](./07-USER-MANUAL-PDF-PLAN.md) | PDF manual set + the `reportlab` generation pipeline (reused from Badge Codex) |

## The Brief, Mapped

The nineteen build instructions this document set answers:

| # | Instruction | Where it's answered |
|---|-------------|---------------------|
| 1 | PCB Way | Doc 06 §Fabrication |
| 2 | Pager-like notification from an AI-powered site | Doc 04 §Notification Channel |
| 3 | 2-part stainless steel body | Doc 03 §Enclosure |
| 4 | Flat silver square 4×4cm × 5mm height | Doc 03 §Form Factor |
| 5 | Camera | Doc 02 §Camera, Doc 03 §Top Face |
| 6 | Use LOT API connector | Doc 05 |
| 7 | Result in PDF manuals | Doc 07 |
| 8 | Compress the information in each session | Doc 04 §Session Compression |
| 9 | Firmware documents | Doc 04 (separate from software, per #11) |
| 10 | Software to connect with firmware | Doc 05 (separate from firmware, per #11) |
| 11 | Separate documents | This document set (7 files, not 1) |
| 12 | Charger | Doc 02 §Power/Charging, Doc 03 §Bottom Face |
| 13 | 100 units run | Doc 06 §Production Run |
| 14 | Weather sensor | Doc 02 §Sensors (reuses LOT® Station sensor choice) |
| 15 | AI-grade off-the-shelf sensors | Doc 02 §Camera, §Sensors |
| 16 | "Copy" button → signal to Log tab | Doc 04 §Copy Button, Doc 05 §`POST /api/logs` |
| 17 | One side polished stainless steel | Doc 03 §Bottom Face |
| 18 | Other side: camera, screen, button | Doc 03 §Top Face |
| 19 | Wireless charger | Doc 02 §Power/Charging, Doc 03 §Charging Window |

## One-Line Summary

A 40×40×5mm two-part 316L stainless steel puck — mirror-polished on the
bottom (its wireless-charging face), camera + micro-display + Copy button
on the top — running an ESP32-S3, that sits quietly on a charging pad and
occasionally says one thing, the same way the rest of LOT® does: **one
line, no alarm, exact moment.**

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
