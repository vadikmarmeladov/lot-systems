# LOT Node — Product Plan & Roadmap

**Owner:** Vadik Marmeladov (Inventor, COSMO®)
**Program:** LOT Systems hardware companion device
**Session:** 1 (plan → BOM → roadmap)
**Date:** 2026-09-06

---

## 1. What this is

LOT Node is a small, flat, stainless-steel desk object that is the physical
counterpart of the Memory Engine / Quantum Operating System (QOS) running on
[lot-systems.com](https://lot-systems.com). It does two things:

1. **Receives** — a screen shows short, autonomous, AI-generated notifications
   pushed from the site (e.g. *"Coffee time!"*, *"Recovery mode — pause."*),
   the way a pager receives a page.
2. **Sends** — a single physical button ("Copy") writes one signal straight
   back into the user's **Log tab** on lot-systems.com, the same log stream
   that already records `note`, `answer`, `weather_update`, etc.
   (`src/server/routes/api.ts:1563`, `POST /api/logs`).

It is not a general-purpose computer. It is a single-purpose "signal object":
notifications in, one button-press out, plus ambient weather sensing.

## 2. Requirements traceability (build brief → spec)

The build brief was given as a flat numbered list. Mapping each line to where
it is actually specified keeps nothing lost:

| # | Brief line | Resolved in |
|---|---|---|
| 1 | PCBWay | `MANUFACTURING-ROADMAP.md` §1 |
| 2 | Pager-like notification from AI-powered site | `SOFTWARE-CONNECTOR.md` §3 |
| 3 | 2-part stainless steel body | `HARDWARE-SPEC.md` §1 |
| 4 | Flat silver square, 4×4cm × 5mm | `HARDWARE-SPEC.md` §1.1 (+ risk, §7 below) |
| 5 | Camera | `HARDWARE-SPEC.md` §2.3, `BOM-COMPONENTS.md` |
| 6 | LOT API connector | `SOFTWARE-CONNECTOR.md` §2 |
| 7 | Result in PDF manuals | `USER-MANUAL-OUTLINE.md`, `manuals/` |
| 8 | Compress information each session | this plan + root `docs/SESSION_REPORT_*` |
| 9 | Firmware documents | `FIRMWARE.md` |
| 10 | Software to connect with firmware | `SOFTWARE-CONNECTOR.md` §1 |
| 11 | Separate documents | this directory's file layout |
| 12 | Charger | `HARDWARE-SPEC.md` §2.6, `BOM-COMPONENTS.md` |
| 13 | 100-unit run | `MANUFACTURING-ROADMAP.md` §3 |
| 14 | Weather sensor | `HARDWARE-SPEC.md` §2.4 |
| 15 | AI-grade off-the-shelf sensors | `BOM-COMPONENTS.md` (sensor rows) |
| 16 | "Copy" button → Log tab signal | `SOFTWARE-CONNECTOR.md` §4 |
| 17 | One side polished stainless steel | `HARDWARE-SPEC.md` §1.2 (rear) |
| 18 | Other side: camera + screen + button | `HARDWARE-SPEC.md` §1.2 (front) |
| 19 | Wireless charging | `HARDWARE-SPEC.md` §2.6 |
| — | Screen shows autonomous notifications | `SOFTWARE-CONNECTOR.md` §3, `FIRMWARE.md` §4 |

Brand/voice references (`brand.lot-systems.com`, `/about`, institute CQGS
pages) are treated as tone and philosophy inputs for the manual's framing
language, not as technical specs — see `USER-MANUAL-OUTLINE.md` §0.

## 3. Product identity

- **Name:** LOT Node
- **Form:** flat stainless-steel square puck, sits on a desk like a coaster
- **Front face:** camera + round display + one physical button
- **Back face:** mirror-polished stainless steel, brand mark only
- **Connection:** Wi-Fi to the internet, HTTPS to `lot-systems.com`
- **Power:** rechargeable battery + Qi wireless charging puck (included)

## 4. Roadmap — phases

```
Phase 0  Plan & BOM ................ THIS SESSION (2026-09-06)
Phase 1  Proto PCB (PCBWay) ........ 2-3 weeks after part sourcing confirmed
Phase 2  Firmware bring-up ......... parallel with Phase 1, 3-4 weeks
Phase 3  Enclosure CNC sample ...... 3-4 weeks (stainless steel lead time)
Phase 4  Integration + LOT API ..... 2 weeks after Phase 2 + 3 converge
Phase 5  Pilot batch (10 units) .... validate assembly + firmware OTA
Phase 6  100-unit production run ... PCBWay assembly + CNC house, 4-6 weeks
Phase 7  Manuals + fulfillment ..... PDF manuals, packaging, ship
```

Phase durations assume one hardware engineer or a small contract EMS
(electronics manufacturing service) partner; PCBWay itself is used for
Phase 1 (PCB fab + SMT assembly) and can also quote Phase 6 (see
`MANUFACTURING-ROADMAP.md`).

## 5. What "done" looks like for Session 1

- [x] Plan document (this file) with requirements traceability
- [x] Bill of materials with real supplier links and 100-unit pricing
- [x] Mechanical + electrical spec
- [x] Firmware architecture doc
- [x] Software connector doc grounded in the actual LOT API (`/api/logs`)
- [x] Manufacturing roadmap incl. PCBWay process and 100-unit run economics
- [x] Manual outline + generated PDF quick-start
- [x] Session report pushed to `docs/`

Not in scope for Session 1: ordering parts, cutting a PO, or writing firmware
code. This session is plan → BOM → roadmap only, as requested.

## 6. Cost summary (see `BOM-COMPONENTS.md` and `MANUFACTURING-ROADMAP.md` for detail)

| | Per unit (100-unit run) | 100 units |
|---|---|---|
| Electronics (BOM + PCBA) | ~$34 | ~$3,400 |
| Stainless steel enclosure (CNC, 2-part) | ~$18 | ~$1,800 |
| Wireless charging puck (accessory) | ~$6 | ~$600 |
| Packaging + manual (printed) | ~$3 | ~$300 |
| **Landed cost / unit (excl. tooling & freight)** | **~$61** | **~$6,100** |
| One-time tooling (CNC fixtures, stencils) | — | ~$1,500–2,500 |

These are budgetary estimates from public supplier pricing tiers as of this
session; treat as planning numbers, not quotes — get PCBWay and a CNC shop to
quote against the final BOM/CAD before committing funds.

## 7. Open risks / decisions before ordering hardware

1. **5mm height is not physically achievable** with a battery, camera,
   round display, Qi coil, and MCU stacked inside stainless steel walls.
   Realistic minimum is **~10–12mm**. Recommendation: keep the 4×4cm footprint,
   revise height to 11mm, call it out explicitly to the inventor before Phase 1.
2. **Camera's purpose is undefined** in the brief beyond "Camera" — plan
   assumes presence/gesture sensing and QR-code Wi-Fi pairing (no cloud photo
   upload, for privacy, consistent with LOT's "your data stays yours" stance
   in the main README). Confirm before firmware bring-up.
3. **Notification transport** (push vs. poll) needs a decision — see
   `SOFTWARE-CONNECTOR.md` §3 for the two candidate designs and recommendation.
4. **Regulatory:** any Wi-Fi + wireless-charging consumer device sold in the
   US needs FCC ID (and CE if sold in EU). Not costed above — add to
   `MANUFACTURING-ROADMAP.md` before a 100-unit *sale* (a 100-unit run for
   internal/beta use does not require certification, but retail sale does).
