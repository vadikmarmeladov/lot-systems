<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Session Report
**2026-07-27 · Hardware Kickoff (Planning Phase 0)**

## Compressed summary

Vadik's 19-point brief for a physical "LOT Computer" desk device was turned
into a buildable, documented plan. No components ordered, no PCB fabricated,
no server code written — this session is planning-only, per scope.

## What was built

| Deliverable | Path |
|---|---|
| Product spec (19-point brief mapped 1:1) | `docs/hardware/LOT-COMPUTER-PRODUCT-SPEC.md` |
| Bill of materials + supplier links + costing | `docs/hardware/LOT-COMPUTER-BOM.md` |
| Phased roadmap to 100-unit run | `docs/hardware/LOT-COMPUTER-ROADMAP.md` |
| Firmware spec (separate doc, on-device) | `docs/hardware/LOT-COMPUTER-FIRMWARE-SPEC.md` |
| Software spec (separate doc, server-side `/api/device/*`) | `docs/hardware/LOT-COMPUTER-SOFTWARE-SPEC.md` |
| Index | `docs/hardware/README.md` |
| PDF manual (spec + BOM + roadmap, monospace-rendered) | `docs/hardware/manuals/LOT-Computer-Build-and-Buying-Manual.pdf` |

## Key decisions

- **Object:** 40x40mm stainless steel coin, two-part shell. Side A polished
  (idle face). Side B carries camera, micro-display, and the "Copy" button.
- **5mm height is the stated aspiration, not the v1 build target.** Stacking
  a camera, display, battery, and Qi coil into 5mm total is a real
  constraint with near-zero margin — logged explicitly in PRODUCT-SPEC §02
  rather than hand-waved. V1 pilot ships at 9mm using off-the-shelf modules;
  true 5mm becomes a V2 miniaturization track once firmware and protocol
  are field-proven.
- **Not a new protocol.** LOT Computer's sensor telemetry reuses the
  "Multi-Sensor Array" JSON shape already specified in the repo's existing
  `docs/corporate/LOT-TERMINAL-M2M.md`, and its pairing/auth pattern follows
  the existing `LOT-TERMINAL-SYNC.md` design. This device is positioned as
  the first *factory-built* S-2 unit on a protocol that previously only
  existed for hand-built maker hardware.
- **Notification path confirmed net-new.** Repository search this session
  found no existing push/webhook/SSE-to-client channel and no device-auth
  endpoint anywhere in `src/` — SOFTWARE-SPEC.md specifies the new
  `/api/device/*` namespace (pairing, notification queue, Copy write-back,
  telemetry intake, OTA) as the first phase of actual implementation work.
- **"Copy" button reuses the existing Log tab**, not a new device-log view —
  it POSTs to a new endpoint that writes through the existing
  `src/server/models/log.ts` model, so a device press looks like any other
  journal entry to the rest of the app.
- **Manufacturing vendor: PCBWay** for PCB fab/assembly and CNC stainless
  shells, single vendor for the pilot run per the brief.
- **Costing:** proto-quantity unit cost ≈$65–115; 100-unit run fully loaded
  ≈$49–85/unit (≈$4.9k–8.5k total), full breakdown in BOM §03/§04.

## Gate discipline carried into the roadmap

Bring-up batch (10 units) must clear seven explicit checks — Qi cycle
durability, notification round-trip latency, Copy write-back reliability,
sensor accuracy, battery life, gasket seal, OTA safety — before the
100-unit PCBWay order is placed. Never place the run order against an
unverified board revision.

## Open questions for Vadik

1. Confirm product name — this doc set used "LOT Computer" (matching the
   repo name) with internal model designation "Node Zero"; confirm or
   rename before it propagates further.
2. Confirm V1 pilot shell height (9mm proposed) is an acceptable interim
   step toward the 5mm target, or whether 5mm should be held as a hard v1
   requirement regardless of module availability.
3. `brand.lot-systems.com`, `lot-systems.com/about`, and
   `institute.lot-systems.com/cqgs.html` all returned HTTP 403 to this
   session's fetcher — could not pull brand/CQGS context directly from
   those pages this round. Existing in-repo docs (`LOT_SYSTEMS_BRIEF.md`,
   `LOT-TERMINAL-*`) were used as the grounding source instead.

## Next session

Phase 1 per `LOT-COMPUTER-ROADMAP.md` §02: implement the `/api/device/*`
server scaffolding (pairing, notification queue, Copy write-back, M2M
telemetry intake) against the existing Fastify/Postgres stack, with a curl
test harness proving the full loop before any physical unit is ordered.
