<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Roadmap

**Document:** LOT-COMPUTER-ROADMAP.md
**Companion to:** [`docs/corporate/LOT-COMPUTER-PLAN-v1.md`](../corporate/LOT-COMPUTER-PLAN-v1.md), [`LOT-COMPUTER-BOM.md`](./LOT-COMPUTER-BOM.md)

Each stage below has a gate. A stage does not open until the previous
stage's gate is cleared, in the spirit already set by
`docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md` §06 — ship the smallest
true thing first, extend rather than restart.

---

## v0.1 — BENCH PROTOTYPE (electronics-only, no enclosure)

**Goal:** prove the signal loop end to end before spending on metal.

- Off-the-shelf ESP32-S3 dev board + breakout camera + breakout e-paper
  + BME280 breakout, wired on a breadboard.
- Firmware v0.1: connects to lot-systems.com, receives one notification
  class, renders it on the e-paper.
- Software bridge v0.1: a single new `/api/device/notify` test route
  (Section per `LOT-COMPUTER-SOFTWARE-BRIDGE.md`) manually triggerable
  from an admin script — no production trigger wiring yet.
- Button wired to a GPIO, fires a `POST /api/logs` call reusing the
  existing Log model — the "Copy" behavior proven on the real endpoint
  from day one, not mocked.

**GATE:** a notification typed into an internal test tool appears on the
breadboard's e-paper within 5 seconds, and a physical button press
creates a real, visible entry in a real test account's Log tab.

---

## v0.2 — FIRST ENCLOSURE + PCB REV A

**Goal:** prove the mechanical/RF/thermal stack, not yet in stainless.

- 3D-printed shell at the true 40x40x5mm envelope (non-metal, so RF
  performance is not yet under test) to validate component stack-up,
  button feel, and camera aperture alignment.
- PCB Rev A ordered from PCBWay per the BOM — first real PCBA run, small
  quantity (5–10 boards) for bring-up and rework tolerance.
- Wireless charging validated through the 5mm printed shell.
- Session-compression logic (Firmware doc) implemented and tested with
  simulated connectivity gaps.

**GATE:** 10/10 bench units charge fully via Qi, hold a WiFi connection
through a full charge cycle, and correctly compress + sync a 24-hour
simulated offline session on reconnect.

---

## v0.5 — STAINLESS DVT (Design Validation Test)

**Goal:** the highest-risk step — prove RF works through the real
material.

- First CNC stainless shell halves from PCBWay, both faces (mirror
  Face A, matte Face B with cutouts), 10 units.
- RF-transparent antenna window installed and measured — this is the
  gate that determines whether the Plan §02 "RF WINDOW" mitigation is
  sufficient or needs a design revision (larger window, different
  antenna placement, or a non-metal insert band around the full
  perimeter).
- Polishing/finishing process locked (mirror Face A must survive repeat
  handling without the finishing house's process changing unit to
  unit).

**GATE:** 10/10 stainless DVT units hold WiFi signal strength within 6dB
of the v0.2 non-metal enclosure's baseline, and 10/10 pass a 500-cycle
button-press durability test with no COPY-signal failures.

---

## v1.0 — PILOT PRODUCTION (100 units)

**Goal:** the run named in the brief.

- Full BOM locked (`LOT-COMPUTER-BOM.md`), PO placed with PCBWay for
  100 main boards, 100 stainless shell pairs (Face A + Face B), and 100
  charging pucks.
- Firmware v1.0 frozen, OTA update path tested against at least one
  post-ship revision before pilot units leave the building.
- Software bridge v1.0 deployed to production: real `/api/device/*`
  routes, real pairing flow, real notification trigger wiring into the
  existing Memory Engine / QOS / CalendarWidget event sources.
- User manual generated to PDF (`LOT-COMPUTER-MANUAL.md` → `.pdf`) and
  included with every unit.

**GATE:** 100/100 units pass factory function test (charge, pair, one
notification round-trip, one COPY round-trip visible in a real Log tab)
before any unit ships to an operator.

---

## v1.1+ — FIELD ITERATION

Not scheduled against fixed dates. Opens once pilot units are in
operators' hands and real usage telemetry (session-compression payloads,
COPY-press frequency, notification dismiss/engagement patterns) starts
arriving. Candidate directions, unscoped:

- 316 stainless option for humidity-heavy environments (Plan §02).
- Second button gesture — explicitly deferred in v1.0 to keep the
  gesture vocabulary at exactly one meaning; only revisited if pilot
  operators request it, not speculatively added.
- Larger e-paper for two-line notifications, if "Coffee time!"-length
  single-line text proves too short for common notification classes in
  practice.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END LOT-COMPUTER-ROADMAP
================================================================================
