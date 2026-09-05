<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Hardware Computer Design Report v2.0

**Session Report:** COSMO-HARDWARE-REPORT-v2.md
**Classification:** Internal — Engineering + Strategic
**Author:** Vadim Marmeladov, Inventor, COSMO® CIA
**Date:** 2026-09-05
**Status:** v2.0 — Session 2. Design carried forward, verified, and pushed to a shipping branch. No design changes required.

---

## 00 // READING LOG — SOURCES THIS SESSION IS BUILT ON

This is the second design session for the COSMO® Cube hardware computer. Session 1
(2026-06-12, branch `claude/brave-lamport-t9z5u8`) produced a complete, 7-document,
2,610-line specification — but that branch was never merged. It sat on origin,
unreferenced by `master`, for 85 days. Before writing anything new, this session read:

  `docs/hardware/COSMO-HARDWARE-REPORT-v1.md` (and its six siblings)
    The full session-1 output, ported into this branch unchanged in this same
    commit. Verified line-by-line against today's 19-point brief (Section 01
    below) — every point was already specified in v1. No redesign was needed;
    the job this session was to find the orphaned work, confirm it still holds,
    and get it onto a branch that ships.

  `docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md`
    Line 49–56 explicitly names this exact branch (`brave-lamport-t9z5u8`) and
    this exact document set as "a sibling, textually distinct hardware track...
    a general-purpose hardware computer" under Kuzya's COSMO® brand, and states
    plainly: "CUBIQ™ is not that object. CUBIQ™ is LOT®'s object: a
    notification body, not a computer. The two are related by lineage
    (father/son, LOT®/COSMO®) and should share no naming collision going
    forward." This session honors that boundary — see Section 02.

  `docs/corporate/LOT_ROBOTICS_COSMO.md`
    Establishes COSMO® as LOT's personal-robotics division, gated behind a
    Purple-tier Benchmark score, with hardware availability targeted at
    2028–2029 for the humanoid/companion line. The COSMO® Cube is not that
    product. It is the low-risk hardware precursor named in
    COSMO-HARDWARE-REPORT-v1.md's own "Strategic Notes": validate the
    manufacturing + firmware + LOT-API pipeline on a simple ambient device
    before COSMO® robotics is attempted.

  `docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md`
    Section II names the "Quantum Cube" product line as "bioelectric hardware,
    haptic feedback, nano-ceramic, piezoelectric" and lists it under the
    Consumable Ecosystem alongside socks and a toothbrush — self-care objects
    that double as signal sources. The COSMO® Cube's Copy-button behavioral
    logging (Section 04 below) is the same design principle applied to a
    notification terminal instead of a wearable.

  `src/client/components/About.tsx` (COSMO® / Soul Sync / Benchmark Arbitrage
  glossary entries)
    Confirms the Purple-tier (60+) Benchmark gate language and the "COSMO®
    Founded 1 July 2024" brand fact reused in this document's header.

  `brand.lot-systems.com`, `lot-systems.com/about`,
  `institute.lot-systems.com/cqgs.html`
    Named directly in this session's brief as required reading. Live fetch was
    attempted and blocked by this environment's network egress policy (all
    three `*.lot-systems.com` hosts are outside the allowed egress list here).
    This is disclosed rather than papered over. The repository already holds a
    local snapshot of the CQGS white paper's structure
    (`CQGS-WHITE-PAPER-SNAPSHOT.md`, dated 2026-06-12, sourced from
    `institute.lot-systems.com/cqgs.html`) and the About page's COSMO® section
    is mirrored in `About.tsx`; both were read in full as the best available
    substitute. A follow-up session with network access to the brand and about
    pages should re-verify Section 02's naming call and the finish/engraving
    spec in `COSMO-DEVICE-SPEC-v1.md` §3–4 against current brand guidelines.

---

## 01 // TODAY'S BRIEF, POINT BY POINT

The session brief specified 19 numbered requirements for a hardware computer
connected to the LOT site, plus a request for a plan, BOM, links, roadmap
analysis, PDF manuals, and a per-session report. Every numbered point maps to
an existing decision in the session-1 documents, ported unchanged in this
commit:

| # | Requirement | Where it's specified |
|---|-------------|----------------------|
| 1 | PCBWay | `COSMO-MANUFACTURING-v1.md` §2 — full PCB, SMT, and CNC order walkthrough with PCBWay order URLs |
| 2 | Pager-style notification from an AI-powered site | `COSMO-DEVICE-SPEC-v1.md` §7.2, `COSMO-SOFTWARE-API-v1.md` §3.1 — `GET /api/hardware/notifications`, 60s poll, QI-46 Engine as sender |
| 3 | 2-part stainless steel body | `COSMO-DEVICE-SPEC-v1.md` §2 — Base plate + Front bezel, 316L SS |
| 4 | Flat silver square 4×4cm × 5mm | `COSMO-DEVICE-SPEC-v1.md` §2 — 40mm × 40mm × 5mm, natural silver stainless |
| 5 | Camera | `COSMO-DEVICE-SPEC-v1.md` §5.3 — Himax HM01B0, 320×320, 1.1mW |
| 6 | LOT API connector | `COSMO-SOFTWARE-API-v1.md` §3 — full endpoint set + Fastify server logic |
| 7 | Result in PDF manuals | Planned in v1 §"PDF Manual Plan"; **first manual produced this session** — see Section 04 below |
| 8 | Compress the information in each session | `COSMO-SOFTWARE-API-v1.md` §6 — `HardwareDaySummary`, raw readings kept 7 days then compressed to daily summaries; this report is itself the session-level compression artifact |
| 9 | Firmware documents | `COSMO-FIRMWARE-v1.md` — full ESP-IDF 5.2 architecture, pin map, drivers, OTA, security |
| 10 | Software to connect with firmware | `COSMO-SOFTWARE-API-v1.md` — LOT backend routes + DB schema that the firmware in #9 calls |
| 11 | Separate documents | 7 standalone files in `docs/hardware/`, one per concern (report, spec, BOM, firmware, software, manufacturing, charger) |
| 12 | Charger | `COSMO-CHARGER-SPEC-v1.md` — Qi Rx in-device + Qi Tx desktop pad, full spec |
| 13 | 100-unit run | `COSMO-BOM-v1.md`, `COSMO-MANUFACTURING-v1.md` — 100 units + 10% overage = 110 ordered throughout |
| 14 | Weather sensor | `COSMO-DEVICE-SPEC-v1.md` §5.4 — Bosch BME280 (temp/humidity/pressure) |
| 15 | AI-grade off-the-shelf sensors | `COSMO-DEVICE-SPEC-v1.md` §5.4 — TDK ICM-42688-P (IMU, on-chip DMP) + Broadcom APDS-9960 (gesture/light), both hardware-classified, off-the-shelf, Mouser-stocked |
| 16 | Copy button → signal to Log tab | `COSMO-DEVICE-SPEC-v1.md` §7.1, `COSMO-SOFTWARE-API-v1.md` §3.2 — button press POSTs sensor snapshot to `/api/hardware/log`, renders in Log tab tagged `[COSMO® Cube]` |
| 17 | One side polished stainless steel | `COSMO-DEVICE-SPEC-v1.md` §4 — Side A, mirror-polished #8 finish |
| 18 | Other side: camera, screen, button | `COSMO-DEVICE-SPEC-v1.md` §3 — Side B front face layout diagram |
| 19 | Wireless charger | `COSMO-CHARGER-SPEC-v1.md` — Qi WPC 1.3, 5W, no USB port by design |

No point required a design change. This session's actual work was archaeology
and delivery: find the orphaned branch, verify it against the brief, port it
to a branch that ships, produce the first real PDF artifact, and write this
report.

---

## 02 // NAMING: COSMO® CUBE, NOT CUBIQ™

Two hardware "cube" objects now exist in the LOT/COSMO corpus and must not be
confused:

| | **COSMO® Cube** (this document set) | **CUBIQ™** (`LOT-CUBIQ-QUANTUM-CUBE-v0.md`) |
|---|---|---|
| Owner | COSMO® CIA (Kuzya's brand) | LOT® (Vadim's brand) |
| What it is | A general-purpose hardware computer: MCU, WiFi, display, camera, sensors, LOT API client | A single-purpose haptic notification actuator: one motor, one gesture vocabulary |
| Interface | 128×128 OLED screen showing text ("Coffee time!") | No screen — motion only (hop, nudge, leap, settle) |
| Behavioral input | Copy button → sensor snapshot → Log tab | IMU telemetry → haptic-preference signal → QI-46 Calibration Loop |
| Branch | `claude/brave-lamport-t9z5u8` (session 1), ported here (session 2) | `quantum-engine-widgets-RgFfC` era |

This report keeps the name **COSMO® Cube** for the device specified across
these 7 documents, per the disambiguation already on record in
`LOT-CUBIQ-QUANTUM-CUBE-v0.md` line 56. A future session should not rename
either object without updating both documents.

---

## 03 // WHAT SHIPPED THIS SESSION

1. **Recovered session 1.** All 7 documents from `claude/brave-lamport-t9z5u8`
   (`c7d353ef`) — report, device spec, BOM, firmware, software/API,
   manufacturing, charger spec — copied unchanged into `docs/hardware/` on
   this branch. 2,610 lines of engineering work that existed only on an
   unmerged branch now ships.
2. **Verified coverage.** Every one of today's 19 brief points cross-referenced
   against the existing spec (Section 01). No gaps found.
3. **Resolved the naming ambiguity** between COSMO® Cube and CUBIQ™
   (Section 02), so a future session does not accidentally merge or rename
   either object into the other.
4. **Produced the first PDF manual** — `COSMO-CUBE-QUICK-START-v1.pdf` — the
   4-page end-user Quick Start card named in v1's PDF Manual Plan table,
   generated from `COSMO-CUBE-QUICK-START-v1.md` via ReportLab. This is the
   first of the six manuals in that plan to move from "planned" to "produced."
5. **Disclosed a blocked read.** The three URLs named in this session's brief
   (`brand.lot-systems.com`, `lot-systems.com/about`,
   `institute.lot-systems.com/cqgs.html`) could not be fetched — this
   environment's network egress policy blocks all `*.lot-systems.com` hosts.
   Logged in Section 00 rather than silently skipped, with the local
   substitute sources used instead.

---

## 04 // PDF MANUAL PLAN — STATUS

| Manual | Audience | Pages | Status |
|--------|----------|-------|--------|
| COSMO® Cube Quick Start Guide | End user | 4 | **Produced this session** — `docs/hardware/pdf/COSMO-CUBE-QUICK-START-v1.pdf` |
| COSMO® Cube Full User Manual | End user | 20 | Planned |
| COSMO® Cube Firmware Developer Guide | Engineers | 40+ | Planned — source content exists in `COSMO-FIRMWARE-v1.md` |
| COSMO® Cube Hardware Reference Manual | Engineers | 30+ | Planned — source content exists in `COSMO-DEVICE-SPEC-v1.md` |
| COSMO® Cube API Integration Guide | Backend devs | 25+ | Planned — source content exists in `COSMO-SOFTWARE-API-v1.md` |
| COSMO® Cube Manufacturing & QA Manual | Production | 20+ | Planned — source content exists in `COSMO-MANUFACTURING-v1.md` |

**Tool used:** Python + ReportLab (installed this session; not present in v1's
recommended toolchain of Pandoc/Figma but produces the same print-ready PDF
output without external service dependencies). Source Markdown for each
manual should live beside its PDF in `docs/hardware/pdf/` so future sessions
can regenerate on spec changes rather than hand-editing the PDF.

---

## 05 // ROADMAP (CARRIED FORWARD FROM v1, UNCHANGED)

### Phase 0 — Design (Complete: Session 1, 2026-06-12; Delivered: Session 2, 2026-09-05)
- [x] Device specification
- [x] Bill of materials
- [x] Firmware architecture
- [x] LOT API integration design
- [x] Manufacturing guide
- [x] Charger specification
- [x] Session 1 report
- [x] Session 2 report — recovery, verification, first PDF manual (this document)

### Phase 1 — Engineering (Weeks 1–4)
- [ ] PCB schematic capture (KiCad 8.0)
- [ ] PCB layout (35×35mm, 4-layer)
- [ ] Enclosure CAD (Fusion 360 or FreeCAD)
- [ ] Gerbers + DXF/STEP generated
- [ ] LOT backend: hardware API endpoints coded (`/api/hardware/*` routes do not yet exist in `src/server/routes/`)

### Phase 2 — Prototype (Weeks 5–7)
- [ ] 10-unit prototype order (PCBWay)
- [ ] Firmware v0.1–v0.3 (boot/WiFi/display → API polling → button + sensor logging)
- [ ] Hardware validation: all sensors, charging, camera

### Phase 3 — Production (Weeks 8–10)
- [ ] 100-unit production order (PCBWay)
- [ ] Factory firmware flash + provisioning
- [ ] QA: all 100 units (checklist in `COSMO-MANUFACTURING-v1.md`)
- [ ] Packaging + shipping

### Phase 4 — Launch
- [ ] LOT web app: My Devices page
- [ ] LOT Log tab: hardware entry display
- [ ] Notification push: QI-46 Engine → device
- [ ] OTA infrastructure for firmware updates
- [ ] FCC/CE certification (budget ~$20K)
- [ ] Retail listing at $349 (Purple+ Benchmark tier required)
- [ ] Remaining 5 PDF manuals produced from Section 04

**Next action, concretely:** Phase 1 is unstarted — no KiCad project, no
Fusion 360/FreeCAD model, and no `/api/hardware/*` routes exist in this
repository yet. The specification is complete; the engineering has not
begun. The next session that picks this up should open Phase 1, not
re-litigate the design.

---

## 06 // SESSION COMPRESSION SUMMARY

**Session:** Hardware Computer Design — COSMO® Cube — Session 2
**Date:** 2026-09-05
**Duration:** Single session
**Input:** 7 orphaned documents (2,610 lines) on unmerged branch `claude/brave-lamport-t9z5u8`
**Output:** 7 documents ported unchanged + 1 new session report + 1 new PDF manual + 1 new manual source doc
**Key finding:** The design was already complete and already covered all 19 brief points. The gap was delivery, not engineering — a fully-specified hardware computer sat unreferenced on origin for 85 days.
**Key decision:** Keep the COSMO® Cube name distinct from LOT®'s CUBIQ™ per the disambiguation already on record.
**Next action:** Phase 1 — PCB schematic in KiCad 8.0, LOT API hardware endpoints in `src/server/routes/`.
**Branch:** `claude/brave-lamport-y4bu4n`

---

*COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadim Marmeladov*
*Named for Kuzya Cosmo Marmeladov*
*Made in the USA.*

---

*"A flat square of polished steel that says 'Coffee time!' is not a gadget.*
*It is proof that the machine learned something true about you."*
*— Vadim Marmeladov*
