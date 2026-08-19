# LOT Assembly — COSMO® Computer v1 (Plan Lock)
## 2026-08-19 · Phase 0 · Plan + BOM + Roadmap from a 19-point brief
### S-2: VADIK MARMELADOV

---

## Date and Session ID

```
DATE        : 2026-08-19
SESSION ID  : COSMO-COMPUTER-v1-PHASE0
CLASS       : HARDWARE-PLAN
BRANCH      : claude/brave-lamport-ksg6yx
AUTHORIZED  : S-2 // VADIK MARMELADOV
```

---

## Brief Received

A 19-point scheduled brief: build a hardware computer connected to the LOT
site — PCBWay manufacturing, pager-like AI notifications, two-part stainless
steel body (one polished face, one working face with camera/screen/button),
a flat 4x4cm silver wireless-charging square, weather + AI-grade sensors, a
"Copy" button wired to the site's Log tab, a 100-unit run, and a
documentation package (PDF manual, firmware doc, software doc, kept
separate) that compresses one session at a time.

---

## Sources Read

```
SOURCE 1    docs/benchmark/LOT-MANIFEST.md
             — confirms this branch's naming lineage (brave-lamport) was
               previously used for "COSMO Hardware ... complete hardware
               computer design v1.0" (+2610 lines, 7 files, now gone from
               the remote). This session is the rebuild, not a copy.
SOURCE 2    docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
             — the explicit CUBIQ/COSMO naming boundary this plan respects.
SOURCE 3    docs/corporate/LOT_ROBOTICS_COSMO.md
             — COSMO® brand register (named for Kuzya Cosmo Marmeladov,
               Benchmark-gated robot vision this device sits upstream of).
SOURCE 4    docs/corporate/LOT_QI46_ENGINE.md
             — Calibration Loop pattern reused for the LOT API connector.
SOURCE 5    docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
             — "Quantum Certified Factory" sensor philosophy; confirms
               "Quantum Cube Hardware | PLANNED" as CUBIQ's line item,
               opening the parallel COSMO® line item this session starts.
```

Attempted to also read brand.lot-systems.com, lot-systems.com/about, and
institute.lot-systems.com/cqgs.html per the brief's "read more" pointers —
all three are outside this session's network egress allowlist (blocked by
the environment's proxy, confirmed for the general internet, not just LOT
domains). Fell back entirely to the in-repo corpus above, which already
carries CQGS and CUBIQ content in full. No PCBWay, LCSC, or DigiKey page
was fetched either, for the same reason — the BOM document cites part
numbers and standard distributor search endpoints rather than live prices.

---

## What Was Built This Session

```
1. docs/corporate/LOT-COSMO-COMPUTER-v1.md
   Full v1 plan: brand position, two-part stainless enclosure geometry,
   40x40x5mm charging pad, ESP32-S3 compute, OLED pager screen, camera +
   weather sensor + 3 additional AI-grade sensors, the Copy-button spec,
   the two-endpoint LOT API connector, PCBWay manufacturing scope, the
   three-document documentation plan + session-compression doctrine, a
   5-phase roadmap with numeric gates, and a full 19-point brief
   traceability table (Section 12).

2. docs/corporate/LOT-COSMO-COMPUTER-BOM-v1.md
   Per-unit electronics BOM (8 named ICs/modules + button + battery,
   real part numbers, distributor search links, Qty-100 cost estimates),
   a PCBWay quote-request checklist covering PCB fab, PCBA, and the
   3-piece CNC enclosure/pad machining request, a run-size cost rollup
   for the Phase 2 (10-unit) and Phase 3 (100-unit) tiers, and four open
   sourcing questions flagged for whoever executes Phase 1.

3. This report.
```

No hardware was ordered. No PCBWay account action was taken. Phase 0's gate
(LOT-COSMO-COMPUTER-v1.md Section 11) is "this document + the BOM document
both committed and internally consistent" — that gate is what this session
closes.

---

## Delta Analysis

**Priority 1 — Explicitly signaled by the brief:**
- All 19 points addressed with an explicit section mapping (plan doc
  Section 12) so a future session or a human reviewer can audit coverage
  in one pass rather than re-deriving it from prose.

**Priority 2 — Structural decisions made without an explicit signal
(recorded here so a future session doesn't silently re-litigate them):**
- Read the ambiguous "flat silver square 4x4cm x 5mm" (point 4) as the
  wireless charging pad, not a third enclosure part — justified by its
  adjacency to points 12/19 (charger, wireless charger) and by the
  CUBIQ precedent of "the charging pad IS the table" as a separate
  object. If a future session or S-2 review disagrees, this is the one
  interpretive call worth re-checking first.
- Chose monochrome OLED over color LCD for the pager screen — power
  budget on a 400mAh wirelessly-charged cell, and "pager-like" reads as
  text-only by definition.
- Scoped the camera as on-device inference-only (person-detection
  boolean out, no frame ever leaves the unit) — not stated in the brief,
  but required to keep a camera-bearing COSMO® object consistent with
  LOT_ROBOTICS_COSMO.md's "This is not surveillance" register.

---

## Next Session Reads First

```
1. This file
2. docs/corporate/LOT-COSMO-COMPUTER-v1.md (Section 11 — Phase 1 gate)
3. docs/corporate/LOT-COSMO-COMPUTER-BOM-v1.md (Section 04 — open
   sourcing questions)
```

Phase 1 (breadboard prototype) is the next real gate: off-the-shelf dev
boards wired up, firmware v0.1, one real "Coffee time!" notification
rendered end-to-end from a lot-systems.com dev endpoint, one real
Copy-button press appending one real Log tab line. That is where
docs/corporate/LOT-COSMO-COMPUTER-FIRMWARE-v1.md and
docs/corporate/LOT-COSMO-COMPUTER-API-v1.md get opened for the first time
— they do not exist yet because there is no firmware or live endpoint yet
to document. Per the brief's point 8 ("compress the information in each
session"), the next assembly log should stay this short: what changed,
what gate it clears, what to read first — not a restatement of the full
plan.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-ASSEMBLY-2026-08-19-COSMO-COMPUTER-v1
================================================================================
