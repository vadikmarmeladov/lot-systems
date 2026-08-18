<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Inventor
  COSMO® CIA Hardware Division
  Document: COSMO-CUBE-LANDING-NOTE-2026-08-18.md
  Classification: Internal Engineering — Confidential
-->

# COSMO® Cube — Landing & Naming Reconciliation Note

**Document:** COSMO-CUBE-LANDING-NOTE-2026-08-18.md
**Date:** 2026-08-18
**S-2:** Vadik Marmeladov, Inventor, COSMO® CIA
**Status:** Recovery + reconciliation of existing v1.0 design; no re-design performed

---

## 1. What this session did

This session's task ("build a hardware computer connected to the LOT site," 19-point spec:
PCBWay, pager-like notification, 2-part stainless steel body, 40×40×5mm flat silver square,
camera, LOT API connector, PDF manuals, session compression, firmware docs, connecting
software, separate documents, charger, 100-unit run, weather sensor, AI-grade sensors, a
Copy button wired to the site's Log tab, one polished stainless side, one working side with
camera/screen/button, wireless charging) matches — point for point — a design that was
**already completed on 2026-06-12** and never merged to `master`.

That design lives in 7 documents, ~25,000 words, produced on branch
`claude/brave-lamport-t9z5u8` (per `docs/benchmark/LOT-MANIFEST.md`, "COSMO Hardware |
brave-lamport-t9z5u8 | BEST | 14/14 | +2610 | COSMO® Cube — complete hardware computer
design v1.0"). The branch still existed on the remote; `docs/hardware/` did not exist on
`master`. This session:

1. Read all 7 documents in full against the current codebase (API surface, Logs tab,
   brand/style guide, and the sibling CUBIQ hardware doc) to confirm nothing had drifted.
2. Restored the 7 documents to `docs/hardware/` on this branch, unmodified, so the design
   record is intact and citable.
3. Generated an actual PDF — `COSMO-Cube-Quick-Start-Guide-v1.pdf` — fulfilling the "Result
   in PDF manuals" requirement concretely rather than leaving it as a planning table.
4. Wrote this reconciliation note and a session report (`docs/LOT-SR-20260818-01.md`).

No component choice, dimension, sensor, or API contract was changed. The v1.0 design already
satisfies all 19 points in the brief — see §3.

---

## 2. Naming: COSMO® Cube vs. CUBIQ™ — no collision

`docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md` (2026-07-28, six weeks after this design) was
written with explicit awareness of this branch and drew the line between the two products:

> "Confirms a sibling, textually distinct hardware track — 'COSMO® Cube — complete hardware
> computer design v1.0' ... under Kuzya's COSMO® brand. That is a general-purpose hardware
> computer. CUBIQ™ is not that object. CUBIQ™ is LOT®'s object: a notification body, not a
> computer."

This session's brief asked for "a hardware computer" — that is the COSMO® Cube, not CUBIQ™.
The two remain distinct:

| | **COSMO® Cube** (this document) | **CUBIQ™** (LOT-CUBIQ-QUANTUM-CUBE-v0.md) |
|---|---|---|
| Brand | COSMO® (Kuzya Cosmo Marmeladov) | LOT® |
| What it is | A hardware computer: MCU, WiFi, display, camera, sensors, API client | A notification body: one actuator, one motion class |
| Form | Flat 40×40×5mm SS square, static | 45×45×45mm cube, moves (hop/leap/settle) |
| Output | OLED text notifications, Log tab entries | Physical motion gestures |
| Status | v1.0 design complete; not yet built | v.0 design-lock pending; not yet built |

Both are unbuilt as of this note. Neither supersedes the other.

---

## 3. Coverage check — session brief vs. existing v1.0 design

| # | Brief point | Where it's already specified |
|---|---|---|
| 1 | PCB Way | `COSMO-MANUFACTURING-v1.md` §2 (PCB, SMT, CNC order steps + URLs) |
| 2 | Pager-like notification from an AI-powered site | `COSMO-SOFTWARE-API-v1.md` §3.1 `GET /api/hardware/notifications`; example: "Coffee time!" |
| 3 | 2-part stainless steel body | `COSMO-DEVICE-SPEC-v1.md` §2, §4 — back plate + front bezel, 316L |
| 4 | Flat silver square, 4×4cm × 5mm | `COSMO-DEVICE-SPEC-v1.md` §2 — 40×40×5mm, natural silver stainless |
| 5 | Camera | `COSMO-DEVICE-SPEC-v1.md` §5.3 — Himax HM01B0 |
| 6 | LOT API connector | `COSMO-SOFTWARE-API-v1.md` (full endpoint + schema spec) |
| 7 | PDF manuals | `COSMO-HARDWARE-REPORT-v1.md` "PDF Manual Plan"; **first manual now generated**: `COSMO-Cube-Quick-Start-Guide-v1.pdf` |
| 8 | Compress information each session | `COSMO-SOFTWARE-API-v1.md` §6 — `HardwareDaySummary`, 7-day raw retention then daily compression |
| 9 | Firmware documents | `COSMO-FIRMWARE-v1.md` |
| 10 | Software to connect with firmware | `COSMO-SOFTWARE-API-v1.md` §4 (web app routes, Log tab render, notification push) |
| 11 | Separate documents | 7 files in `docs/hardware/`, one per concern |
| 12 | Charger | `COSMO-CHARGER-SPEC-v1.md` |
| 13 | 100-unit run | `COSMO-BOM-v1.md`, `COSMO-MANUFACTURING-v1.md` — 100 units (110 ordered w/ overage) |
| 14 | Weather sensor | `COSMO-DEVICE-SPEC-v1.md` §5.4 — Bosch BME280 |
| 15 | AI-grade off-the-shelf sensors | ICM-42688-P (IMU), APDS-9960 (gesture/light) |
| 16 | Copy button → site Log tab | `COSMO-SOFTWARE-API-v1.md` §3.2 `POST /api/hardware/log`; `Logs.tsx` render note in §4.2 |
| 17 | One side polished stainless | `COSMO-DEVICE-SPEC-v1.md` §4 — Side A, mirror #8 finish |
| 18 | Other side: camera, screen, button | `COSMO-DEVICE-SPEC-v1.md` §3 — Side B front face layout |
| 19 | Wireless charger | `COSMO-CHARGER-SPEC-v1.md` — Qi 5W, receiver + desktop pad |

All 19 points: **already specified**. Nothing in this session's brief required a new design
decision.

---

## 4. What is still open (unchanged from Phase 1–4 in `COSMO-HARDWARE-REPORT-v1.md`)

The design is complete; the device is not built. Nothing below was in scope for this
documentation-recovery session:

- PCB schematic capture and layout (KiCad) — not started.
- Enclosure CAD (STEP/DXF for PCBWay CNC) — not started.
- The four `/api/hardware/*` endpoints and `hardware_devices` / `hardware_logs` /
  `hardware_notifications` tables described in `COSMO-SOFTWARE-API-v1.md` do not exist in
  `src/server/routes/` yet — confirmed by direct search of the current codebase. The site's
  real, live hardware-facing surface today is `POST /api/logs` (generic), not a dedicated
  device endpoint.
- No physical units have been ordered or built.
- FCC/CE/Qi certification not started (budgeted, not spent).

This note does not change that status. It only makes the completed design visible on
`master` instead of stranded on an orphaned branch, and turns one planned manual into an
actual PDF.

---

*COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadim Marmeladov*
*Recovered and reconciled: 2026-08-18*
