<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Bill of Materials

**Document:** COSMO-CUBE-BOM.md
**Classification:** Public — Procurement Reference
**Prepared:** 2026-07-17
**Status:** PLAN — links and prices researched 2026-07-17; verify current
price/stock before ordering, especially for a 100-unit commitment.

---

## How to read this

Prices below are single-unit retail (hobbyist-channel) prices, useful for
Phase 1 prototyping. The 100-unit column is a planning estimate assuming
distributor/OEM pricing at that volume, which is meaningfully lower than
retail — get an actual quote from PCBWay and the component distributor
before committing.

---

## Core electronics

| Part | Role | Vendor / link | Unit price (retail) | Est. 100-unit price |
|---|---|---|---|---|
| Seeed XIAO ESP32S3 Sense | MCU + Wi-Fi/BLE + OV2640 camera + mic + 8MB PSRAM, pre-soldered | [Seeed Studio](https://www.seeedstudio.com/Seeed-Studio-XIAO-ESP32S3-Sense-Pre-Soldered-p-6335.html) | $14.99 | ~$9–11 (Seeed OEM/volume pricing tier) |
| GC9A01 1.28" round TFT, 240x240, SPI | Notification screen | [Adafruit #6178](https://www.adafruit.com/product/6178) or generic module ([Makerfabs](https://www.makerfabs.com/gc9a01-1-28-inch-round-lcd-module.html), [Elecrow](https://www.elecrow.com/1-28-inch-round-lcd-module-gc9a01-240x240-lcd-display.html)) | $8–15 | ~$4–6 (generic GC9A01 module at volume, e.g. via AliExpress/Elecrow OEM) |
| BME680 environmental sensor | Temp / humidity / pressure / VOC air quality ("weather sensor") | [Adafruit #3660](https://www.adafruit.com/product/3660) | $18.50 | ~$9–12 (Bosch BME680 bare IC at volume via distributor, breakout cost drops) |
| Qi wireless charging receiver module | Wireless charging | [Adafruit #1901](https://www.adafruit.com/product/1901) | $9.95 | ~$3–5 (generic 5W Qi receiver PCBA+coil at volume) |
| Tactile momentary pushbutton (SMD, IP-rated cap) | "Copy" button | Generic — Digi-Key/Mouser SMD tactile switch | $0.20–0.50 | ~$0.10–0.20 |
| LiPo pouch cell, 300–500mAh, JST-PH | Battery | Generic — Adafruit/SparkFun LiPo cells | $6–9 | ~$2–4 |
| USB-C connector (debug/fallback charge + flashing) | Wired fallback + firmware flash | Generic SMD USB-C | $0.30–0.60 | ~$0.15–0.25 |
| Custom PCB (carrier board for the above) | Integrates MCU module, display connector, sensor, Qi module, button, battery charge circuit | PCBWay prototype PCB service | ~$5–20/unit at 1–10 pcs (see MANUFACTURING doc) | ~$1–3/board bare PCB at 100 pcs; assembly (SMT) additional — see MANUFACTURING doc |

**Single-unit prototype electronics subtotal (Phase 1, retail prices):** ≈ $60–70
**Est. 100-unit electronics subtotal (excl. enclosure, excl. assembly labor):** ≈ $25–35 per unit

---

## Enclosure (two-part stainless steel body)

| Part | Role | Vendor / link | Notes |
|---|---|---|---|
| Top shell — 40mm x 40mm x 5mm plate | Polished face, requirement #4 + #17 | [PCBWay CNC machining — stainless steel 304](https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/) | #8 mirror polish finish option; 304 is the standard grade — step up to [316](https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/) if the unit will see moisture/skin contact often |
| Bottom shell — instrument face | Houses display, camera aperture, button, requirement #18 | Same PCBWay CNC machining service, matched pair | CAD must be finalized (Phase 3) before quoting; get an instant quote via [PCBWay CNC quote](https://www.pcbway.com/rapid-prototyping/manufacture/?type=2) once the STEP file exists |
| Fasteners (4x M1.6 hex standoff + screws) | Joins the two shells | Generic McMaster-Carr / Digi-Key hardware | Sub-$1/unit at any volume |
| Gasket (thin silicone or foam ring) | Dust/moisture seal at shell seam | Generic die-cut gasket supplier | Quote alongside enclosure order |

**Enclosure cost is CAD-dependent — no reliable number until the Phase 3 CAD
model exists.** As an order-of-magnitude anchor: small CNC stainless steel
parts of this size typically run $8–25/unit in low volumes (1–20 pcs) and
drop meaningfully in a 100-unit batch quote, but PCBWay's actual instant-quote
tool (upload STEP file) is the only reliable source once the design is final.

---

## Charging

| Part | Role | Vendor / link | Notes |
|---|---|---|---|
| Qi wireless charging **transmitter** (desk puck) | Charging base the Cube sits on | [Adafruit #2162](https://www.adafruit.com/product/2162) or any Qi-certified retail charging pad | Not part of the per-unit device BOM — one per user, could be sourced off-the-shelf rather than custom-built |
| Qi receiver (in-device) | Already listed above | — | — |

---

## Bill of materials summary (Phase 4 pilot run, 100 units)

| Category | Est. per-unit cost @ 100 units |
|---|---|
| Core electronics (MCU/camera, screen, sensor, Qi rx, button, battery, connector) | $25–35 |
| Custom PCB (bare + SMT assembly, PCBWay) | $8–15 (see MANUFACTURING doc for assembly pricing detail) |
| Enclosure (2x CNC stainless steel shells + hardware + gasket) | $16–50 (CAD-dependent, needs real quote) |
| **Total est. per-unit cost @ 100 units** | **$49–100** |
| **Total est. cost for 100-unit pilot run** | **$4,900–$10,000** |

This is a planning range, not a quote. Before Phase 4 commitment: get real
PCBWay quotes for (a) SMT assembly at 100 units with the final BOM loaded,
and (b) CNC stainless steel shells from the final STEP file. Both are free,
non-binding, instant-quote tools on PCBWay's site.

---

*Prices as researched 2026-07-17. Re-verify before any purchase order —
component and metal pricing both drift week to week.*
