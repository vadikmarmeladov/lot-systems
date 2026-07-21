<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Hardware Companion Device

**Codename:** LOT One
**Classification:** INTERNAL — Product Development
**Status:** Concept → Plan (Phase 0), no hardware ordered yet
**Owner:** Vadik Marmeladov, Inventor — COSMO®
**Session origin:** Scheduled hardware-planning routine, 2026-07-21

---

## What this is

A physical, pocket-sized companion object for LOT Systems' Memory Engine / QOS —
a **pager for the self**. It sits on a desk or nightstand, receives short
AI-generated nudges from lot-systems.com ("Coffee time!", "You mentioned
loose-leaf tea — window's open now"), shows them on a small glanceable screen,
and gives the person exactly one physical action: press **Copy** to write the
moment into their Log tab. Nothing else competes for attention.

This directory is the working plan: industrial design, bill of materials,
manufacturing route, firmware, and the software connector back to the live
LOT API. It is **not** a build log — no PCB has been ordered, no CNC job has
been submitted. Every cost and lead time below is a planning-stage estimate
pending real quotes (see `06-MANUFACTURING.md` for the actual quote requests
to run next).

## Document set

| # | Document | Contents |
|---|----------|----------|
| 1 | [`01-PRODUCT-PLAN.md`](./01-PRODUCT-PLAN.md) | Concept, industrial design, the 19-point brief mapped to decisions, non-goals |
| 2 | [`02-ROADMAP.md`](./02-ROADMAP.md) | Phases 0–5, timeline, dependencies, risk register |
| 3 | [`03-BOM.md`](./03-BOM.md) | Components buying list, supplier links, unit + 100-unit costs |
| 4 | [`04-FIRMWARE.md`](./04-FIRMWARE.md) | Firmware architecture, states, power budget, OTA, security |
| 5 | [`05-SOFTWARE-API-CONNECTOR.md`](./05-SOFTWARE-API-CONNECTOR.md) | LOT API connector — existing endpoints reused, new endpoints needed |
| 6 | [`06-MANUFACTURING.md`](./06-MANUFACTURING.md) | PCBWay PCB + CNC route, DFM, 100-unit run plan, QA, compliance |
| — | [`manuals/`](./manuals/) | Quick-start guide, user manual, assembly manual (source + PDF) |

## The brief, in one table

The product brief (Vadik, 2026-07-21) listed 19 requirements. Each is addressed
in the documents above; the full mapping lives in `01-PRODUCT-PLAN.md §2`.

| # | Requirement | Where it's handled |
|---|-------------|---------------------|
| 1 | PCB Way | `06-MANUFACTURING.md` |
| 2 | Pager-like AI notification | `01-PRODUCT-PLAN.md §3`, `05-SOFTWARE-API-CONNECTOR.md` |
| 3 | 2-part stainless steel body | `01-PRODUCT-PLAN.md §1`, `06-MANUFACTURING.md` |
| 4 | Flat silver square, 4×4cm × 5mm | `01-PRODUCT-PLAN.md §1` (incl. height-budget reality check) |
| 5 | Camera | `03-BOM.md`, `04-FIRMWARE.md` |
| 6 | LOT API connector | `05-SOFTWARE-API-CONNECTOR.md` |
| 7 | PDF manuals | `manuals/` |
| 8 | Compress info each session | `05-SOFTWARE-API-CONNECTOR.md §5`, session reports in `docs/` |
| 9 | Firmware documents | `04-FIRMWARE.md` |
| 10 | Software to connect with firmware | `05-SOFTWARE-API-CONNECTOR.md` |
| 11 | Separate documents | this directory's structure |
| 12 | Charger | `03-BOM.md` (Qi transmitter dock accessory) |
| 13 | 100-unit run | `02-ROADMAP.md`, `06-MANUFACTURING.md` |
| 14 | Weather sensor | `03-BOM.md` (BME280), reuses live `/api/weather` |
| 15 | AI-grade off-the-shelf sensors | `03-BOM.md §Sensor grade notes` |
| 16 | "Copy" button → Log tab signal | `05-SOFTWARE-API-CONNECTOR.md §3` |
| 17 | One side polished stainless steel | `01-PRODUCT-PLAN.md §1` |
| 18 | Other side: camera, screen, button | `01-PRODUCT-PLAN.md §1` |
| 19 | Wireless charging | `03-BOM.md`, `04-FIRMWARE.md §Power` |

## Sources consulted this session

- `README.md` (repo root) — Memory Engine, QOS, Log tab semantics
- `src/server/routes/api.ts` — confirmed live endpoints: `GET/POST /api/logs`,
  `PUT /api/logs/:id`, `GET /api/weather`, `GET /api/contextual-prompts`
- `src/client/components/Logs.tsx` — client-side Log tab behavior
- `brand.lot-systems.com`, `lot-systems.com/about`, `institute.lot-systems.com/cqgs.html`
  — all returned **HTTP 403** to the fetch tool this session (consistent with
  other automated LOT routines hitting the same wall — see
  `docs/SESSION_REPORT_2026_07_19_WIKI_v78.md` line 35). Brand/CQGS context
  could not be pulled live; this plan uses the repo's own README and existing
  product language instead. Re-fetch when a session has authenticated access.
- Public component/manufacturer research (PCBWay, DigiKey, Mouser, Adafruit,
  Waveshare) — links cited inline in `03-BOM.md` and `06-MANUFACTURING.md`.
