<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Hardware Computer Plan v1.0

**Document:** COSMO-CUBE-PLAN.md
**Classification:** Public — Product Vision & Build Plan
**Prepared:** 2026-07-17
**Inventor:** Vadik Marmeladov, Founder & CEO, LOT Systems
**Status:** PLAN — pre-procurement. No parts ordered, no PCB fabricated, no funds committed.

---

## What this document is (and isn't)

This is a buildable plan: a real bill of materials with real vendor links, a
real manufacturing path (PCBWay), and a real firmware/software architecture —
written so any of it can be ordered and assembled without further research.

It is **not** a confirmation that a device has been built, ordered, or paid
for. Placing a PCBWay order, machining stainless steel, or committing to a
100-unit run are irreversible, money-spending actions. Per the doctrine
already established in this repo (`docs/technical/LOT-NODE-0-RIG-SPEC.md`,
`docs/corporate/LOT_ROBOTICS_COSMO.md`), irreversible commercial actions
require an explicit human gate. **S-2 (Vadik) sign-off is required before any
purchase order is placed.** This document exists so that sign-off can happen
in minutes, not weeks — every part number, price, and link is pre-researched.

---

## The concept

**COSMO® Cube** is a small physical companion object for LOT — a "pager" for
proactive AI notifications from lot-systems.com. It sits on a desk. Most of
the time its screen is dark. When the LOT Quantum Intent Engine decides a
user needs a nudge — "Coffee time!", "Breathe.", "You've been at this 90
minutes." — the Cube's screen lights up with that one line. A single button
sends one signal back: **Copy** — "seen, acknowledged" — which lands as a Log
entry the user can see in their own Log tab on lot-systems.com.

It is deliberately not a general-purpose IoT gadget. One notification
channel in, one button out, a camera and a weather sensor for local context,
and nothing else. The restraint is the design.

---

## Physical form (maps directly to the 19-point brief)

```
                    TOP — POLISHED FACE                  BOTTOM — INSTRUMENT FACE
              ┌───────────────────────┐            ┌───────────────────────┐
              │                       │            │   ┌───────────────┐   │
              │                       │            │   │   1.28" round │   │
              │   mirror-polished     │            │   │   TFT screen  │   │
              │   stainless steel     │            │   │   "Coffee     │   │
              │   (304/316, #8 mirror)│            │   │    time!"     │   │
              │                       │            │   └───────────────┘   │
              │   4cm x 4cm x 5mm     │            │      ○ camera         │
              │   flat silver plate,  │            │                       │
              │   sits face-up on the │            │      [ COPY ]  <- btn │
              │   desk as a mirror /  │            │                       │
              └───────────────────────┘            └───────────────────────┘
                 body shell, half 1                    body shell, half 2
```

| # | Brief item | Design decision |
|---|-----------|------------------|
| 1 | PCB Way | Single vendor for PCB fab + assembly + CNC stainless steel enclosure (see MANUFACTURING doc) |
| 2 | Pager-like AI notification | LOT server pushes a short string to the device over Wi-Fi (SSE/poll); device wakes screen, shows text, dims after N seconds |
| 3 | Two-part stainless steel body | Top shell (polished plate) + bottom shell (instrument face) join with 4x M1.6 hex standoffs, gasket seal |
| 4 | Flat silver square 4x4cm x 5mm | The top shell **is** this plate — 40mm x 40mm x 5mm, #8 mirror polish, doubles as a passive desk mirror when dark |
| 5 | Camera | OV2640 (bundled on the XIAO ESP32S3 Sense) — ambient presence/context signal, not a security camera; off by default |
| 6 | LOT API connector | Firmware talks to a new `/api/device/*` surface on lot-systems.com — spec'd in SOFTWARE-INTEGRATION doc |
| 7 | Result in PDF manuals | Assembly + user manuals generated as PDFs from the doc set (see MANUAL doc) |
| 8 | Compress info per session | Handled by the repo's existing Self-Assembly protocol — ledger/lexicon/doctrine in `docs/assembly/` (see SESSION REPORT for this run) |
| 9 | Firmware documents | `COSMO-CUBE-FIRMWARE-SPEC.md` — separate file |
| 10 | Software to connect with firmware | `COSMO-CUBE-SOFTWARE-INTEGRATION.md` — separate file |
| 11 | Separate documents | Plan / BOM / firmware / software / manufacturing / manual kept as six distinct files, per existing `docs/` convention |
| 12 | Charger | Qi wireless charging coil + USB-C wired fallback for firmware flashing/debug |
| 13 | 100-unit run | Costed in BOM + MANUFACTURING doc as a distinct pilot-run tier |
| 14 | Weather sensor | BME680 (temp / humidity / pressure / VOC air quality) |
| 15 | AI-grade off-the-shelf sensors | BME680 + OV2640 — both are standard, well-documented, widely-stocked parts; no custom silicon |
| 16 | "Copy" button → Log tab signal | Physical button → `POST /api/device/copy` → `Log.create({ event: 'cosmo_cube_copy' })` → same row appears in the existing `/api/logs` feed the Log tab already reads |
| 17 | One side polished stainless steel | Top shell, #8 mirror finish |
| 18 | Other side: camera, screen, button | Bottom shell — the "instrument face" |
| 19 | Wireless charging | Qi receiver module + LiPo pouch cell |

---

## Roadmap

### Phase 0 — Plan (this session)
- [x] Concept + physical form spec
- [x] Bill of materials with real vendor links (per-unit + 100-unit pricing)
- [x] Firmware architecture spec
- [x] Software/LOT API integration spec
- [x] Manufacturing plan (PCBWay PCB + CNC stainless steel)
- [x] Manual outline → PDF
- [ ] **S-2 sign-off to proceed to Phase 1** (human gate — not automatic)

### Phase 1 — Proof of unit (1 unit, ~2–3 weeks after sign-off)
- Order BOM parts for 1 prototype (dev-board stage — no custom PCB yet, no
  custom enclosure yet). Breadboard/perfboard build using the XIAO ESP32S3
  Sense, GC9A01 display, BME680, Qi receiver, tactile button.
- Flash firmware v0.1: connect to Wi-Fi, poll `/api/device/notify`, render
  text on screen, POST on button press.
- Validate the LOT API surface end-to-end against a real (or staging) LOT
  account.

### Phase 2 — First custom PCB (1–5 units, ~3–4 weeks)
- Design a single custom PCB that integrates the MCU/camera module, display
  connector, BME680, Qi receiver, and button — replacing the breadboard.
- Order via PCBWay prototype PCB + SMT assembly (turnkey or kitted).
- 3D-print a temporary enclosure (not the final stainless steel) to validate
  fit before committing to metal.

### Phase 3 — Enclosure + finish (1–5 units, ~2 weeks, can run parallel to Phase 2)
- Finalize the two-shell stainless steel design (CAD) sized to the PCB from
  Phase 2.
- Order CNC-machined stainless steel 304 (or 316 for better corrosion
  resistance) shells from PCBWay, one unpolished test set first.
- Confirm the #8 mirror polish process and tolerance on the assembled shell
  pair before ordering the run.

### Phase 4 — Pilot run (100 units)
- Lock BOM, PCB revision, and enclosure CAD (no further design changes).
- Place a single PCBWay order covering: 100x PCB assembly + 100x CNC
  stainless steel shell pairs (2 halves each = 200 machined parts).
- Hand-assembly (PCB into shell, battery, screen ribbon, adhesive/standoffs)
  — not offered by PCBWay for this bespoke a design; planned as manual
  assembly batches of ~10 units.
- Flash firmware in batch via USB-C jig.
- QC: Wi-Fi pairing test + screen test + button test + camera test per unit.

### Phase 5 — Field
- Ship to first 100 users/testers.
- Firmware OTA update path (see FIRMWARE doc) for post-ship fixes.
- Session-report each firmware/software revision through the existing
  Self-Assembly protocol (`docs/assembly/`), same as every other LOT feature.

---

## Companion documents

| Document | Contents |
|---|---|
| `COSMO-CUBE-BOM.md` | Full parts list, vendor links, per-unit and 100-unit costs |
| `COSMO-CUBE-FIRMWARE-SPEC.md` | Firmware architecture, state machine, OTA plan |
| `COSMO-CUBE-SOFTWARE-INTEGRATION.md` | New LOT API endpoints, auth/pairing, Log tab wiring |
| `COSMO-CUBE-MANUFACTURING.md` | PCBWay PCB + CNC process, stainless steel spec, 100-unit run plan |
| `COSMO-CUBE-MANUAL-OUTLINE.md` | Structure for the generated PDF assembly + user manuals |

---

*Invented by Vadim Marmeladov. Prepared for S-2 review before any purchase order is placed.*
