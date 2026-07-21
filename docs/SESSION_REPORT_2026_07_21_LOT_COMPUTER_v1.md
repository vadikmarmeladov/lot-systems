# SESSION REPORT — 2026-07-21
## LOT Computer — Hardware Plan v1 (Phase 0: Concept Freeze)

```
CLASSIFICATION : INTERNAL
SESSION DATE   : 2026-07-21
BRANCH         : claude/brave-lamport-exdekx
OPERATOR       : Scheduled hardware-planning routine
AUTHORIZED BY  : S-2 (Vadik Marmeladov), Inventor — COSMO®
DOC SET        : docs/hardware/lot-computer/ (new)
RESULT         : PLAN COMPLETE — no hardware ordered, no server code changed
```

---

## MISSION BRIEF

Vadik's 19-point brief: build a hardware computer connected to the LOT site —
a pager-like physical object that surfaces AI notifications from the Memory
Engine and lets a person "Copy" a moment straight into their Log tab. Task:
produce the plan, a components buying list with links, a manufacturing
roadmap, firmware/software documentation, and PDF manuals — as separate
documents, following LOT's existing documentation and session-report
conventions.

---

## WHAT WAS BUILT THIS SESSION

New directory: `docs/hardware/lot-computer/`

| File | Purpose |
|------|---------|
| `README.md` | Index + full 19-point brief → decision mapping |
| `01-PRODUCT-PLAN.md` | Concept, industrial design (2-piece stainless puck, 40×40mm), interaction model, non-goals |
| `02-ROADMAP.md` | Phases 0–5, timeline, dependencies, risk register |
| `03-BOM.md` | Components buying list with real supplier links (DigiKey, Mouser, Adafruit, Waveshare, PCBWay), unit + 100-unit cost estimates |
| `04-FIRMWARE.md` | ESP32-S3 firmware architecture, state machine, power budget, OTA, pairing flow |
| `05-SOFTWARE-API-CONNECTOR.md` | LOT API connector spec, grounded in the live codebase |
| `06-MANUFACTURING.md` | PCBWay PCB+CNC route, DFM notes, 100-unit run plan, QA checklist, compliance |
| `manuals/quick-start-guide.md` + `.pdf` | Consumer quick-start |
| `manuals/user-manual.md` + `.pdf` | Full user manual |
| `manuals/assembly-manual.md` + `.pdf` | Internal/manufacturing-partner assembly reference |

---

## KEY ENGINEERING DECISIONS

1. **Industrial design:** two-piece 304 stainless steel body, 40×40mm
   footprint. Flagged explicitly that the brief's 5mm height target is
   aggressive against camera+battery+e-ink+Qi-coil stacking (realistic EVT
   thickness ~9mm) — carried as an open Phase 1→2 R&D item rather than
   silently dropped or silently accepted.
2. **Screen choice:** 1.54" round e-ink (200×200), chosen specifically
   because it holds an image at near-zero power — the entire firmware power
   strategy (deep sleep between polls) depends on this property.
3. **The "Copy" button needs no new server work.** Read `src/server/routes/api.ts`
   directly: `POST /api/logs` (line 1519) already accepts an arbitrary `event`
   string and free-form `metadata`. The device can use it as-is with
   `event: "device_copy"` — this was verified against the real route, not
   assumed.
4. **Weather sensor is complementary, not redundant.** `GET /api/weather`
   (line 1038) already serves city-level weather per account. The on-device
   BME280 is for hyper-local room context, documented as such so it isn't
   built as a pointless duplicate.
5. **Auth gap identified and designed around.** The existing session-cookie
   hook (`src/server/index.ts:274`) has no path for a headless device. Spec'd
   an additive `DeviceToken` model + a second auth check, scoped to
   `logs:write` (restricted event types only), `weather:read`,
   `contextual-prompts:read` — does not touch the existing browser auth path.
6. **Manufacturing:** PCBWay for both PCB fab/assembly and CNC stainless
   steel machining (304, one polished face, one brushed). Real PCBWay quote
   pages linked; explicit note that polish finishing may fall outside instant
   online quoting and needs engineer review.

---

## SOURCES CONSULTED

| Source | Result |
|--------|--------|
| `README.md` (repo root) | Memory Engine / QOS / Log tab context |
| `src/server/routes/api.ts` | Confirmed live endpoints: `/api/logs` (GET/POST/PUT), `/api/weather`, `/api/contextual-prompts` |
| `src/server/index.ts` | Confirmed session-cookie auth hook, basis for the new device-token design |
| `src/client/components/Logs.tsx` | Confirmed client-side Log tab shape |
| `brand.lot-systems.com` | **403 Forbidden** — could not fetch |
| `https://lot-systems.com/about` | **403 Forbidden** — could not fetch |
| `https://institute.lot-systems.com/cqgs.html` | **403 Forbidden** — could not fetch |
| PCBWay, DigiKey, Mouser, Adafruit, Waveshare (web search) | Real product/service links captured in `03-BOM.md` / `06-MANUFACTURING.md` |

**Flag for a future session:** all three `lot-systems.com`-family brand/about/
institute URLs returned 403 to this session's fetch tool, consistent with
what the existing wiki-maintenance routine also reports
(`docs/SESSION_REPORT_2026_07_19_WIKI_v78.md` line 35). Brand voice and CQGS
methodology could not be pulled live and are not reflected in this plan
beyond what the repo's own README already documents. If a session has
authenticated/allowed access to those properties, re-run the brand pass and
fold findings into `01-PRODUCT-PLAN.md`.

---

## SESSION COMPRESSION (brief item 8)

Per the brief's own instruction to compress information each session: this
report is the compressed record for Phase 0. Future firmware/software
sessions should update `05-SOFTWARE-API-CONNECTOR.md §5` (running log) in
place rather than each writing a new full document, mirroring the compression
discipline already used for the software product in `docs/wiki/`.

---

## NEXT ACTIONS (not done this session — require Vadik sign-off / spend)

1. Decide on the 5mm-vs-9mm height tension (`01-PRODUCT-PLAN.md §1`).
2. Phase 1 (EVT): order off-the-shelf dev boards (ESP32-S3-CAM, e-ink
   breakout, BME280 breakout, Qi receiver breakout) — first real spend, still
   small.
3. Do **not** submit a PCBWay CNC or PCB order yet — that's Phase 2, gated on
   Phase 1 proving the electronics stack on the bench.

---

## PUSH

```
COMMIT   : docs: LOT Computer hardware plan v1 — plan, roadmap, BOM,
           firmware/software connector spec, manufacturing route, PDF manuals
BRANCH   : claude/brave-lamport-exdekx
PUSH     : origin/claude/brave-lamport-exdekx
```

---

```
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END SESSION REPORT — 2026-07-21
```
