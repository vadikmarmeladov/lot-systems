# SESSION REPORT — 2026-07-19
## LOT SIGNAL — Hardware Companion Device: Plan, BOM, Firmware & Software Connector Docs, v1

```
CLASSIFICATION : INTERNAL
SESSION DATE   : 2026-07-19
BRANCH         : claude/brave-lamport-xbpw91
OPERATOR       : Automated Build Session (GitHub task intake)
AUTHORIZED BY  : S-2 (Vadik Marmeladov), COSMO® CIA
MISSION        : Build a hardware computer connected to the LOT site —
                 plan, components buying list, roadmap, PDF manual
```

---

## MISSION BRIEF

Vadik's 19-item brief called for a two-piece stainless-steel hardware
device — one polished face, one face with camera/screen/button — that
receives pager-like AI notifications from lot-systems.com, senses weather,
and writes a Log-tab entry on button press. Requested: a plan, a BOM with
supplier links, a roadmap, firmware and software documents kept separate,
PDF manuals, and a full session report pushed at the end.

---

## SOURCES SCANNED

| Source | Path | Status |
|--------|------|--------|
| LOT-NODE-0-RIG-SPEC.md | docs/technical/LOT-NODE-0-RIG-SPEC.md | READ — style + cost-table precedent |
| LOT_ROBOTICS_COSMO.md | docs/corporate/LOT_ROBOTICS_COSMO.md | READ — ethics framework, doc format |
| CQGS-WHITE-PAPER-SNAPSHOT.md | docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md | READ — institute.lot-systems.com grounding |
| LOT-TERMINAL-VISION.md | docs/corporate/LOT-TERMINAL-VISION.md | READ — S-2 operator model, hardware philosophy |
| LOT-TERMINAL-M2M.md | docs/corporate/LOT-TERMINAL-M2M.md | READ — device→server data intake protocol |
| LOT-TERMINAL-SYNC.md | docs/corporate/LOT-TERMINAL-SYNC.md | READ — WebSocket/batch sync modes |
| OS_API.md | docs/technical/OS_API.md | READ — existing API surface |
| LOT-STYLE-GUIDE.md | docs/technical/LOT-STYLE-GUIDE.md | READ — visual/tone conventions |
| src/server/routes/api.ts:1515 | POST /logs route | READ — real endpoint the button targets |
| src/client/components/ContextualPromptsWidget.tsx:230 | existing /api/logs client call | READ — confirmed payload shape |
| src/client/queries.ts:134 | useLogs hook | READ — confirms Log tab data source |
| lot-systems.com/about | https://lot-systems.com/about | 403 FORBIDDEN — skipped (consistent with prior sessions) |
| brand.lot-systems.com | https://brand.lot-systems.com | 403 FORBIDDEN — skipped |
| institute.lot-systems.com/cqgs.html | https://institute.lot-systems.com/cqgs.html | 403 FORBIDDEN — skipped, substituted internal CQGS snapshot doc |

All three brief-referenced URLs block automated fetches, same as noted in
prior wiki session reports. Grounded the plan in the repo's own internal
documentation of those pages instead — CQGS-WHITE-PAPER-SNAPSHOT.md is a
faithful structural snapshot of the institute site, and the corporate/
technical docs already carry the brand voice these pages would otherwise
supply.

---

## WHAT WAS BUILT

A named product — **LOT SIGNAL** — distinct from Node-0 (self-hosted AI
server rig) and COSMO® (personal robotics). Positioned correctly as the
smallest physical extension of the LOT platform: a pager with a camera and
a weather sensor, not a general computer.

| File | Purpose |
|------|---------|
| `docs/corporate/LOT_SIGNAL_PRODUCT_PLAN.md` | Master plan — all 19 brief items traced to a disposition, core notification/log loop, roadmap (6 phases), cost summary, guardrails |
| `docs/technical/LOT-SIGNAL-RIG-SPEC.md` | Enclosure dims, electronics BOM with real supplier links (PCBWay, DigiKey, LCSC, Mouser, Adafruit, Espressif, Bosch), prototype vs. 100-unit costing |
| `docs/technical/LOT-SIGNAL-FIRMWARE.md` | ESP32-S3 firmware state machine, wake sources, session compression logic, power budget, OTA path |
| `docs/technical/LOT-SIGNAL-SOFTWARE-CONNECTOR.md` | LOT API connector — pairing/auth, M2M push/pull, exact `/api/logs` integration referencing real route + line numbers, weather M2M payload format |
| `docs/manuals/LOT-SIGNAL-Quick-Start-Manual.pdf` | End-user PDF manual — unboxing, first charge, pairing, button use, privacy |
| `docs/SESSION_REPORT_2026_07_19_HARDWARE_SIGNAL_v1.md` | This report |

---

## KEY DESIGN DECISION — RECONCILING ITEM 4 WITH ITEMS 17–18

The brief specified a "flat silver square 4x4cm x 5mm height" (item 4) as
well as "one side polished stainless steel" / "other side camera, screen,
button" (items 17–18). Read literally as one enclosure, 5mm cannot hold a
battery, Qi coil, camera, and screen. Resolved by reading item 4 as the
**front plate only** (polished, no electronics — genuinely 5mm) and
specifying a separate ~9mm rear shell for the electronics, for a combined
~14mm device. Flagged explicitly in the plan document (§3) rather than
silently padding the spec, so the BOM and CAD brief that follow from this
document are buildable, not aspirational.

---

## BACKEND DELTA IDENTIFIED (NOT YET IMPLEMENTED)

The software connector doc identifies exactly one code change required to
make LOT SIGNAL real against the existing backend: `POST /api/logs`
(`src/server/routes/api.ts:1515`) currently resolves `req.user` from
session cookie only. A device-token (JWT) auth path would need to resolve
to the same `req.user` shape. Plus a new `POST /v1/m2m/pair` endpoint and
standing up the WebSocket relay at `wss://sync.lot-systems.com/m2m/intake`
— already documented as "Awaiting deployment" in `LOT-TERMINAL-SYNC.md`.
No other Log tab, Memory Engine, or OS API changes needed. This session
did not implement these — it is a hardware/documentation planning pass,
scoped as requested.

---

## VENDOR & COST HEADLINE

PCBWay carries PCB fab, PCBA assembly, and stainless-steel CNC from one
account — used as the anchor vendor per item 1, rather than splitting
across three suppliers. Estimated per-unit cost: ≈$144 fully-loaded at
prototype quantity (5 units, dominated by fixed setup fees), dropping to
≈$24–$32/unit at the 100-unit pilot run — total pilot run ≈$2,400–$3,200.
Full line-item BOM in `LOT-SIGNAL-RIG-SPEC.md` §5–6.

---

## NEXT SESSION

1. Backend: implement device-token auth path on `POST /api/logs` +
   `POST /v1/m2m/pair`.
2. Stand up the `wss://sync.lot-systems.com/m2m/intake` relay (currently
   spec'd, not deployed).
3. CAD: front-plate + rear-shell STEP files, ready for PCBWay CNC quote.
4. PCB schematic + layout for the rear-shell board (ESP32-S3, OV2640,
   GC9A01, BME280, Qi RX, battery charge circuit).
5. Order Phase 1 prototype run (x5) once schematic + CAD are quote-ready.

---

**Pushed to branch:** `claude/brave-lamport-xbpw91`
**Files changed:** 6 new files (4 markdown docs, 1 PDF manual, this report)
**Classification:** Internal / Build
**Filed by:** Vadik. LOT SIGNAL — the smallest node in the network.

---
*LOT Systems Corporation — Los Angeles, CA — 2026-07-19*
