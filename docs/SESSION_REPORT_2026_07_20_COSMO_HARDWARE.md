# SESSION REPORT — 2026-07-20
## COSMO® Cube — Hardware Design Continuation, Corrections, PDF Manuals

```
CLASSIFICATION : INTERNAL — ENGINEERING
SESSION DATE   : 2026-07-20
BRANCH         : claude/brave-lamport-xwycvi
OPERATOR       : Automated Hardware Design Routine
AUTHORIZED BY  : S-2 (Vadim Marmeladov), Inventor, COSMO® CIA
PRIOR SESSION  : claude/brave-lamport-t9z5u8 (2026-06-12, never merged)
```

---

## MISSION BRIEF

Build a hardware computer connected to the LOT site: plan, components buying
list with supplier links, roadmap, PDF manuals, firmware documents, software
integration documents (as separate files), and a full session report. Product
requirements given this session: PCBWay manufacturing, pager-like
notifications from an AI-powered site, a 2-part stainless steel body, a flat
silver square 4×4cm × 5mm, a camera, LOT API connector, weather sensor,
AI-grade off-the-shelf sensors, a "Copy" button signaling back to the site's
Log tab, one polished stainless side, one side with camera + screen + button,
and wireless charging with a simple screen for autonomous notifications
(e.g. "Coffee time!").

---

## KEY FINDING

This exact device — down to matching physical dimensions, component choices,
and even the "Coffee time!" example notification — was already fully designed
in a prior session on `claude/brave-lamport-t9z5u8` (2026-06-12), named
**COSMO® Cube**. That branch was never merged: `docs/hardware/` did not exist
anywhere reachable from `master`, and the branch itself is stale (missing
~103,000 lines of subsequent `master` history). `docs/benchmark/LOT-MANIFEST.md`
listed it as `BEST` (ship-ready) but not `SHIPPED`.

Rather than re-deriving a new design from scratch, this session ported the
existing 7-document design forward, corrected two inconsistencies found on
review, and produced the PDF manuals the original session had only planned.

---

## SOURCES SCANNED

| Source | Path / URL | Status |
|--------|-----------|--------|
| LOT-MANIFEST.md | docs/benchmark/LOT-MANIFEST.md | READ — found existing COSMO Hardware entry |
| COSMO® Cube v1.0 (7 docs) | `claude/brave-lamport-t9z5u8:docs/hardware/*.md` | READ — fetched via git, ported |
| README.md | README.md | READ — brand voice, trademark rules |
| LOT_ROBOTICS_COSMO.md | docs/corporate/LOT_ROBOTICS_COSMO.md | READ — COSMO® naming, ethics framework |
| Log model | src/server/models/log.ts | READ — verified real schema (UUID, Sequelize) |
| Logs migration | migrations/20240525154723_add-logs.cjs | READ — verified `logs` table shape |
| Server framework | src/server/index.ts | READ — confirmed Fastify (matches v1.0 docs) |
| Prisma schema | prisma/schema.prisma | READ — effectively unused; real models are Sequelize |
| brand.lot-systems.com | https://brand.lot-systems.com | 403 FORBIDDEN — skipped |
| lot-systems.com/about | https://lot-systems.com/about | 403 FORBIDDEN — skipped |
| institute.lot-systems.com/cqgs.html | https://institute.lot-systems.com/cqgs.html | 403 FORBIDDEN — skipped |

The three external URLs the user pointed to were unreachable this session
(same 403 behavior noted in `docs/SESSION_REPORT_2026_07_19_WIKI_v78.md` for
`lot-systems.com/about` — a recurring condition, not a one-off). Brand voice
and trademark conventions were sourced from the in-repo documents instead,
which already carry the LOT®/COSMO® language and doctrine.

---

## WORK DONE

### 1. Ported the COSMO® Cube design (`docs/hardware/`)

| File | Content |
|------|---------|
| COSMO-HARDWARE-REPORT-v1.md | Session report, design decisions, BOM summary, roadmap |
| COSMO-DEVICE-SPEC-v1.md | Physical spec, electronics architecture, power budget |
| COSMO-BOM-v1.md | Full bill of materials, 100-unit run, supplier links |
| COSMO-FIRMWARE-v1.md | ESP32-S3 / ESP-IDF firmware architecture + code |
| COSMO-SOFTWARE-API-v1.md | LOT API connector, backend integration, Log tab wiring |
| COSMO-MANUFACTURING-v1.md | PCBWay PCB/SMT/CNC order guide, QA checklist, timeline |
| COSMO-CHARGER-SPEC-v1.md | Qi receiver + desktop transmitter pad spec |

### 2. Corrected two inconsistencies

- **Charging orientation** (`COSMO-CHARGER-SPEC-v1.md` §5): v1.0 instructed
  placing the device with the mirror-polished (coil) side facing *up* —
  that would put the Qi coil away from the charging pad and prevent
  induction. Fixed to mirror-side-down / display-up.
- **Backend schema** (`COSMO-SOFTWARE-API-v1.md` §2.2–4.2): v1.0 modeled
  three new `SERIAL`-keyed raw-SQL tables disconnected from how this app
  actually persists data. Rewrote to match the real Sequelize + umzug
  migration convention (UUID keys, camelCase attributes) and dropped the
  redundant `hardware_logs` table — a Copy button press is just a normal
  row in the existing `logs` table (`event: 'cosmo_cube_copy'`), so the Log
  tab needs no new query path.

Both are documentation-only fixes. No device exists yet to have been
affected; nothing in `src/` was touched.

### 3. Generated PDF manuals

New script: `scripts/generate_cosmo_hardware_pdfs.cjs` (pdfkit — already a
project devDependency, same tool family as `scripts/generate-badge-codex-pdf.cjs`).
Renders each of the 7 markdown documents (headers, tables, code blocks,
lists) into a print-ready PDF under `docs/hardware/pdf/`.

| PDF | Pages |
|-----|-------|
| COSMO-HARDWARE-REPORT-v1.pdf | 24 |
| COSMO-DEVICE-SPEC-v1.pdf | 24 |
| COSMO-BOM-v1.pdf | 33 |
| COSMO-FIRMWARE-v1.pdf | 27 |
| COSMO-SOFTWARE-API-v1.pdf | 18 |
| COSMO-MANUFACTURING-v1.pdf | 18 |
| COSMO-CHARGER-SPEC-v1.pdf | 9 |
| **Total** | **153** |

### 4. Updated LOT-MANIFEST.md

Moved the COSMO Hardware entry from the stale, never-fetched
`brave-lamport-t9z5u8` branch reference to this branch, and updated the
ship-queue line accordingly.

---

## COMPONENTS BUYING LIST — TOP LINE (see COSMO-BOM-v1.md for full detail)

| Category | Part | Supplier | Est. cost (100-unit run) |
|----------|------|----------|---------------------------|
| MCU | ESP32-S3-MINI-1U | Mouser | $420 |
| Display | SSD1327 1.0" OLED 128×128 | BuyDisplay | $550 |
| Camera | Himax HM01B0 | ArduCam | $480 |
| Weather | Bosch BME280 | Mouser | $310 |
| IMU (AI-grade) | TDK ICM-42688-P | Mouser | $380 |
| Gesture/light | Broadcom APDS-9960 | Mouser | $240 |
| Wireless charge Rx | TI BQ51013B + coil | Mouser / Alibaba | $590 |
| Battery | Custom 280mAh LiPo | Grepow | $650 |
| PCB + SMT | 4-layer, turnkey | PCBWay | $1,550 |
| Enclosure | 316L SS, 2-part, CNC | PCBWay CNC | $3,800–4,400 |
| Charging pad | Qi 5W desktop pad | Alibaba OEM | $900 |
| Packaging | Rigid box + insert | Alibaba | $400 |
| **Total (100 units, incl. 15% contingency)** | | | **~$12,340** |

Full supplier links: PCBWay (pcbway.com), Mouser (mouser.com), DigiKey
(digikey.com), ArduCam (arducam.com), Grepow (grepow.com), BuyDisplay
(buydisplay.com) — see `COSMO-BOM-v1.md` §12 for the complete list.

---

## ROADMAP — ANALYSIS

| Phase | Status | Gate to advance |
|-------|--------|-------------------|
| 0 — Design | **Done** (v1.0, this session's continuation) | None — ready to advance |
| 1 — Engineering (schematic, PCB layout, enclosure CAD) | Not started | Needs a person or agent with KiCad/CAD tooling — not achievable from a docs-only session |
| 2 — Prototype (10 units) | Blocked on Phase 1 | Gerbers + firmware v0.1–0.3 |
| 3 — Production (100 units) | Blocked on Phase 2 | Prototype QA pass |
| 4 — Launch (web app, OTA, certification, retail) | Blocked on Phase 3 | FCC/CE budget (~$20K) allocated |

**Critical path bottleneck:** Phase 1 requires actual PCB schematic capture
(KiCad) and mechanical CAD (Fusion 360/FreeCAD) — tooling and skills outside
what a documentation session can produce. This is the single blocking step
between "fully specified" (where this design now sits) and "physically
buildable." Recommend treating Phase 1 as the next concrete milestone rather
than adding further planning documents.

---

## NOT DONE / OUT OF SCOPE THIS SESSION

- No PCB schematic, Gerbers, or CAD files were produced (Phase 1 work,
  requires EDA/CAD tooling this session does not have).
- No code was added to `src/server` — the API route and migration snippets
  in `COSMO-SOFTWARE-API-v1.md` are reference designs for Phase 1, not live
  endpoints. `lot-systems.com/api/hardware/*` does not exist today.
- No physical units, prototypes, or purchase orders exist. All costs are
  estimates from public component pricing, not quotes.
- The three brand/institute URLs the user cited were unreachable (403);
  their content could not be incorporated directly.

---

## FILES CHANGED

| Path | Status |
|------|--------|
| docs/hardware/COSMO-HARDWARE-REPORT-v1.md | ADDED |
| docs/hardware/COSMO-DEVICE-SPEC-v1.md | ADDED |
| docs/hardware/COSMO-BOM-v1.md | ADDED |
| docs/hardware/COSMO-FIRMWARE-v1.md | ADDED |
| docs/hardware/COSMO-SOFTWARE-API-v1.md | ADDED |
| docs/hardware/COSMO-MANUFACTURING-v1.md | ADDED |
| docs/hardware/COSMO-CHARGER-SPEC-v1.md | ADDED |
| docs/hardware/pdf/*.pdf (7 files) | ADDED |
| scripts/generate_cosmo_hardware_pdfs.cjs | ADDED |
| docs/benchmark/LOT-MANIFEST.md | MODIFIED |
| docs/SESSION_REPORT_2026_07_20_COSMO_HARDWARE.md | ADDED (this file) |

---

*COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadim Marmeladov*
*Made in the USA.*
