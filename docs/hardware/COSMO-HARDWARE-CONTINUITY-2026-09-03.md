<!--
  LOT SYSTEMS CORPORATION
  Vadik Marmeladov — Inventor, COSMO® CIA
  COSMO® CIA Hardware Division
  Document: COSMO-HARDWARE-CONTINUITY-2026-09-03.md
  Date: 2026-09-03
-->

# COSMO® Cube — Continuity Session, 2026-09-03

**Document:** COSMO-HARDWARE-CONTINUITY-2026-09-03.md
**Status:** Recovery + brief cross-check, not a re-design
**Author session:** Scheduled autonomous run, LOT Systems benchmark protocol
**Prior work:** `docs/hardware/COSMO-*-v1.md` (authored 2026-06-12, branch
`claude/brave-lamport-t9z5u8`, hash `c7d353ef`)

---

## 1. What happened today

S-2's brief ("build a hardware computer connected to the LOT site," 19-point
logic list) was read cold, without first assuming no prior work existed.
Per the benchmark protocol's PREFLIGHT/discovery step, the live repo was
searched before writing anything new — `docs/benchmark/LOT-MANIFEST.md` line
31 recorded a `BEST`, `14/14`, `+2610` line entry: **"COSMO Hardware |
brave-lamport-t9z5u8 | COSMO® Cube — complete hardware computer design
v1.0."** The branch still existed on `origin` (it was never pruned) and its
single hardware commit (`c7d353ef`, 2026-06-12) added exactly seven
documents to `docs/hardware/` — a device spec, BOM, firmware architecture,
software/API integration, manufacturing guide, charger spec, and session
report — and touched no other files.

That commit was never carried through the manifest's Sunday ship protocol
(no `docs/hardware/` folder existed anywhere in the live tree, and no
`COSMO` line appears in `docs/benchmark/LOT-LEDGER.md`). The manifest's own
note ("as of 2026-06-27 ... incorporated into master") was true for the
other five branches listed alongside it that day but not for this one — a
stale claim, now corrected in Section 3.

Today's action was recovery, not re-invention: the seven documents are
reproduced verbatim (each carries a dated recovery note at the top) and
shipped through the full 00–08 pipeline for the first time.

## 2. Brief cross-check — the 19-point logic list

Every line of S-2's brief maps to an existing decision already on record.
Nothing below required new engineering; this table exists so a future
session (or S-2, skimming) does not have to re-derive it.

| # | Brief line | Where it is already specified |
|---|------------|-------------------------------|
| 1 | PCBWay | `COSMO-MANUFACTURING-v1.md` §2 — PCB, SMT, and CNC all ordered through PCBWay |
| 2 | Pager-like notification from an AI-powered site | `COSMO-DEVICE-SPEC-v1.md` §7.2 — 60s poll of `GET /api/hardware/notifications`, renders to OLED, 30s display then reverts |
| 3 | 2-part stainless steel body | `COSMO-DEVICE-SPEC-v1.md` §2 — base plate + front bezel, 316L, CNC |
| 4 | Flat silver square, 4×4cm × 5mm | `COSMO-DEVICE-SPEC-v1.md` §2 — 40×40×5mm, natural silver stainless |
| 5 | Camera | `COSMO-DEVICE-SPEC-v1.md` §5.3 — Himax HM01B0, 320×320, 1.1mW |
| 6 | LOT API connector | `COSMO-SOFTWARE-API-v1.md` — full endpoint contract, auth, log tab wiring |
| 7 | Result in PDF manuals | `COSMO-HARDWARE-REPORT-v1.md`, "PDF Manual Plan" — 6 manuals scoped; §5 below ships the first one |
| 8 | Compress the information in each session | Process, not device feature — the benchmark DISTILL step (ledger/lexicon/doctrine) this session runs under |
| 9 | Firmware documents | `COSMO-FIRMWARE-v1.md` — ESP-IDF 5.2, pin map, task architecture, drivers |
| 10 | Software to connect with firmware | `COSMO-SOFTWARE-API-v1.md` §4 — LOT web app hardware routes + Log tab display |
| 11 | Separate documents | Seven files, one concern each — device, BOM, firmware, API, manufacturing, charger, report |
| 12 | Charger | `COSMO-CHARGER-SPEC-v1.md` — Qi Rx in-device + Tx desktop pad |
| 13 | 100-unit run | `COSMO-BOM-v1.md` — 100 units + 10% overage, ~$12,363 all-in |
| 14 | Weather sensor | `COSMO-DEVICE-SPEC-v1.md` §5.4 — Bosch BME280 |
| 15 | AI-grade off-the-shelf sensors | Same §5.4 — TDK ICM-42688-P (IMU) + Broadcom APDS-9960 (gesture/light), both with on-chip signal processing |
| 16 | "Copy" button, signal to the site's Log tab | `COSMO-DEVICE-SPEC-v1.md` §7.1 + `COSMO-FIRMWARE-v1.md` §4.2 — press → JSON snapshot → `POST /api/hardware/log` → Log tab entry tagged `[COSMO® Cube]` |
| 17 | One side polished stainless steel | `COSMO-DEVICE-SPEC-v1.md` §4 — Side A, mirror #8 finish, LOT® engraved |
| 18 | Other side: camera, screen, button | `COSMO-DEVICE-SPEC-v1.md` §3 — Side B, satin finish, OLED + camera + Copy button |
| 19 | Wireless charger | `COSMO-CHARGER-SPEC-v1.md` — Qi WPC 1.3, 5W, in-box pad |

No line in the brief describes something the 2026-06-12 session did not
already close. The one addition this session makes is the notification copy
example S-2 gave directly — "Coffee time!" — which the original report
already used verbatim in its closing note (`COSMO-HARDWARE-REPORT-v1.md`,
"'Coffee time!' is the interface"). That is confirmation, not coincidence:
the same product brief, given twice three months apart, converged on the
same device.

## 3. Manifest correction

`docs/benchmark/LOT-MANIFEST.md` is updated by this session (Section 06,
manifest maintenance is in-scope for any run that ships a listed BEST
candidate):

- Row 31 (`COSMO Hardware`) status changes from stale `BEST` to `SHIPPED`,
  with today's merge commit recorded once pushed.
- The Section 06 "CURRENT SHIP QUEUE" note claiming all six listed branches
  "no longer exist on the remote ... incorporated into master" is corrected
  for the `COSMO Hardware` line only — it was inaccurate for this branch.
  The other five were spot-checked against `docs/benchmark/LOT-LEDGER.md`
  entries dated 2026-06 and are not touched here.

## 4. Backend status — unchanged, correctly so

`src/server/routes/` was searched for `hardware`, `/api/hardware/*` — no
matches. The Phase 1 backend endpoints (`COSMO-SOFTWARE-API-v1.md` §3) are
still unbuilt. This is expected: the 2026-06-12 session scoped Phase 0
(design) as complete and Phase 1 (engineering — PCB schematic, enclosure
CAD, backend endpoints) as not started. Nothing in today's brief asked for
Phase 1 code; this session does not write it speculatively.

## 5. PDF manual — first of six

`COSMO-HARDWARE-REPORT-v1.md`'s "PDF Manual Plan" scoped six manuals across
Phase 0–3. This session produces the first: **COSMO® Cube — Overview &
Buying List**, a condensed single-document PDF (device identity, physical
spec, components buying list with suppliers/links, roadmap) suitable as the
artifact S-2 asked for directly ("components buying list, link, and analyze
the roadmap"). File: `docs/hardware/COSMO-Cube-Overview-v1.pdf`. The
remaining five (Quick Start, Full User Manual, Firmware Developer Guide,
Hardware Reference Manual, Manufacturing & QA Manual) stay Phase 1/2
deliverables per the original plan — they depend on finished PCB layout and
enclosure CAD that do not exist yet, so producing them now would be
front-running artifacts that don't exist.

## 6. Roadmap — status as of this session

```
Phase 0 — Design                        COMPLETE  (2026-06-12, shipped 2026-09-03)
Phase 1 — Engineering                   NOT STARTED  (PCB schematic, enclosure CAD, backend endpoints)
Phase 2 — Prototype (10 units)          NOT STARTED
Phase 3 — Production (100 units)        NOT STARTED
Phase 4 — Launch                        NOT STARTED
```

No phase advanced today. Today's work moved Phase 0 from *designed but
stranded* to *designed and on record* — a precondition for Phase 1, not
Phase 1 itself. The next real step remains what `COSMO-HARDWARE-REPORT-v1.md`
already named: PCB schematic capture in KiCad 8.0, enclosure CAD, and the
`/api/hardware/*` backend routes.

---

*COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadik Marmeladov*
