<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Roadmap

Phases are gated: each ends with a go/no-go decision before spending on the
next. Nothing in Phase 2+ (real tooling, real metal) should be ordered until
Phase 1 proves the electronics stack on the bench.

## Phase 0 — Concept freeze (2026-07-21, re-verified 2026-07-26)

- [x] Industrial design direction locked: 2-piece stainless puck, one screen,
      one button, one camera (`01-PRODUCT-PLAN.md`)
- [x] Component shortlist researched (`03-BOM.md`)
- [x] API integration surface identified against the live codebase
      (`05-SOFTWARE-API-CONNECTOR.md`) — re-checked against `src/server/routes/api.ts`
      on 2026-07-26, no drift: `POST /logs` (L1519), `PUT /logs/:id` (L1545),
      `GET /weather` (L1038), `GET /contextual-prompts` (L3290) are unchanged.
- [x] **Default adopted, pending override:** on the 5mm-vs-9mm height tension
      (§1 of the product plan), no live sign-off from Vadik is obtainable from
      an unattended scheduled session, so the plan proceeds on the
      already-documented default — EVT/DVT built at true thickness (~9mm),
      5mm held as the v1.0 production target, not silently dropped. This is a
      **working default**, not a substitute for an actual go-ahead; nothing in
      Phase 1 that costs money should be ordered without that.
- **Exit criterion:** written plan stable across repeated review — met. The
  gating decision left for a human is no longer "approve the plan," it's
  **"approve spending money to start Phase 1"** (see Phase 1 below and the
  process note in the risk register).

## Phase 1 — EVT (Engineering Validation) — bench prototype

- Build with off-the-shelf dev boards, not custom PCB: an ESP32-S3-CAM dev
  board, a breakout e-ink display, a breakout BME280, a breadboard Qi receiver
  module, in a 3D-printed (not stainless) shell at true thickness (~9mm).
- Goals: prove camera capture → Log entry round trip; prove push-notification
  wake-from-deep-sleep timing; measure real power draw to size the battery.
- Deliverable: working firmware v0.1 talking to a **staging** copy of the LOT
  API (never point an unfinished device at production user data).
- **Estimated duration:** 3–4 weeks, 1 engineer.
- **Exit criterion:** a single unit runs for 72 hours on battery, receives at
  least one real pushed notification, and a Copy-button press produces a
  visible Log entry.

## Phase 2 — DVT (Design Validation) — custom PCB + real body

- Route a custom 2-layer (or rigid-flex) PCB sized to the 40×40mm footprint;
  submit to PCBWay for fab + SMT assembly (5–10 boards).
- Submit first stainless-steel CNC quote for the 2-part body (5 units) —
  see `06-MANUFACTURING.md` for the exact PCBWay pages and what to upload.
- Firmware v0.2: OTA update path, device pairing/provisioning flow, real (not
  staging) API token scoping.
- **Estimated duration:** 5–7 weeks (PCB fab/assembly lead time ~2 weeks;
  CNC stainless prototype lead time ~2–3 weeks; these can run in parallel).
- **Exit criterion:** 5 hand-assembled units, each in a real stainless shell,
  pass a 1-week desk trial.
- **Risk:** DVT is the first point real money is spent on tooling-adjacent
  work (CNC setup, even at prototype quantities). Do not enter Phase 2 without
  the Phase 0 sign-off above.

## Phase 3 — Pilot / PVT — 100-unit run

- Finalize BOM against DVT learnings (`03-BOM.md` is a living document —
  expect part substitutions here).
- Place the 100-unit PCBWay order: PCB+SMT turnkey run, plus the matching
  100-unit stainless CNC order for both body halves.
- QA pass on every unit before it ships (continuity, battery burn-in,
  wireless charge test, camera focus, gasket seal) — checklist in
  `06-MANUFACTURING.md §QA`.
- **Estimated duration:** 6–10 weeks (100-unit CNC + SMT lead time is the long
  pole; get quotes early in Phase 2 so Phase 3 isn't blocked on discovery).
- **Exit criterion:** 100 QA-passed units in hand.

## Phase 4 — Launch

- Manuals finalized and printed/PDF-distributed (`manuals/`).
- Packaging + Qi charging dock accessory bundled.
- Pairing flow live on lot-systems.com Settings page.
- Distribute to first 100 recipients (subscription bundle, waitlist, or
  internal/beta cohort — business decision, not an engineering one; flagged
  here as open).

## Phase 5 — Field feedback loop

- Firmware OTA channel stays open post-launch.
- Session-report convention (point 8 of the brief) continues: every
  firmware/software work session compresses its decisions into
  `05-SOFTWARE-API-CONNECTOR.md`'s running log, same discipline as the
  existing `docs/wiki` compression pattern for the software product.

## Risk register

| Risk | Phase | Mitigation |
|------|-------|------------|
| 5mm height not achievable with chosen parts | 1–2 | Ship EVT/DVT thicker; treat 5mm as v1.0 production target, not EVT requirement (see product plan §1) |
| Camera/e-ink/Qi-coil part lead times stack up | 2–3 | Get PCBWay + component lead-time quotes in parallel during Phase 1, not sequentially |
| Wireless radio (2.4GHz) + Qi charging need FCC/CE certification before sale | 3–4 | Budget cert time/cost into Phase 3 exit; use pre-certified modules (e.g. a certified ESP32-S3 module) to inherit modular approval where possible |
| LiPo battery shipping requires UN38.3 test report | 3–4 | Source cells from a supplier that provides UN38.3 documentation; factor into `03-BOM.md` |
| No device-auth surface exists yet on the LOT API | 2 | New scoped device-token surface is additive, doesn't touch existing session-cookie auth (`05-SOFTWARE-API-CONNECTOR.md §4`) |
| Stainless CNC finish (polished side) is easy to scratch during assembly | 2–3 | Add a peel-off protective film step to the assembly manual |
| **Process: this plan has been independently re-derived on ~24 unmerged branches since 2026-06-06 (see `LOT-MANIFEST.md` "brave-lamport" cluster), none reaching Phase 1** | 0→1 | Phase 0 content has been stable since 2026-07-21 (this session found zero substantive drift, only re-verification). Recurring re-planning past this point produces diminishing returns — the next session on this line should either (a) receive an explicit Phase 1 go-ahead and start EVT bring-up, or (b) merge this document set to master via a real PR so future sessions branch from a shared baseline instead of re-deriving it. Flagged for Vadik, not resolved unilaterally here. |
