<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
COSMO® CUBE — MODEL S1
ROADMAP + PRODUCTION PLAN v1.0
================================================================================

DOCUMENT    LOT-COSMO-CUBE-ROADMAP
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
DATE        2026-07-05
RELATED     LOT-COSMO-CUBE-HARDWARE-SPEC.md · LOT-COSMO-CUBE-BOM.md ·
            LOT-COSMO-CUBE-FIRMWARE.md · LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md ·
            docs/corporate/LOT_ROBOTICS_COSMO.md §"Revenue Path" (positions
            this SKU ahead of that document's Phase 3 COSMO® Hardware date)

================================================================================
00 // POSITION RELATIVE TO THE EXISTING COSMO ROADMAP
================================================================================

docs/corporate/LOT_ROBOTICS_COSMO.md lays out a four-phase revenue path with
"Phase 3: COSMO® Hardware" landing 2028-2029 at $2,500-$5,000/unit — that
document describes the full soul-transfer robot. The Cube in this roadmap
is smaller, cheaper, and earlier: a $65-$115 desk object (CONFIG A) or
$45-$75 (CONFIG B) that can ship a 100-unit pilot within a single quarter,
well ahead of that robotics timeline. It de-risks the physical-product arc
described in docs/corporate/LOT-CUBIQ-OPERATOR.md §04/§07 (Phase 4
"Physical Extension") in hardware, firmware, and operations before the
company commits to a robot-scale program.

================================================================================
01 // PHASES
================================================================================

    PHASE 0 — DESIGN FREEZE                              (this session)
      Hardware spec, BOM, firmware spec, API contract, user manual source.
      Deliverable: the five LOT-COSMO-CUBE-*.md documents plus this roadmap.
      Gate to Phase 1: S-2 sign-off on CONFIG A vs. CONFIG B priority
      (LOT-COSMO-CUBE-HARDWARE-SPEC.md §03).

    PHASE 1 — PROTOTYPE (5-10 units)                      ~4-6 weeks
      Order PCBWay PCB + SMT assembly for a small board run (electronics
      only — hand-fit into 3D-printed shells, NOT the final CNC stainless,
      to validate the board and firmware before committing to metal
      tooling). Bring up firmware boot loop, WiFi pull, display driver,
      button handler. Validate CONFIG A camera/battery lead times in
      parallel — if either misses this window, fall back to CONFIG B for
      Phase 2 without re-spinning the board (LOT-COSMO-CUBE-HARDWARE-
      SPEC.md §03 is written so both configs share a board footprint
      family).
      GATE: firmware boots, pulls a line, Copy press reaches the LOG tab
      end-to-end on at least 3 of the 5-10 prototype units.

    PHASE 2 — API + PILOT INTEGRATION                     ~3-4 weeks
      Build src/server/models/device.ts, device-code.ts, src/server/routes/
      device-api.ts (LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md §02-§03). Add
      'device_copy' to the displayableEvents whitelist
      (src/server/routes/api.ts). Build the /pair Web Bluetooth page.
      Pilot with a small internal operator group (S-2 + a handful of
      Usership-tier operators) running Phase 1 prototype units against
      the real API for 1-2 weeks.
      GATE: LOG tab entries from real devices, stable for the full pilot
      window, no missing-whitelist regressions, battery life matches or
      beats the LOT-COSMO-CUBE-FIRMWARE.md §06 planning estimate.

    PHASE 3 — CNC TOOLING + FINAL ENCLOSURE                ~4-6 weeks
      Commit to CONFIG A or CONFIG B based on Phase 1 results. Order
      PCBWay CNC stainless shells (Face A + Face B,
      LOT-COSMO-CUBE-BOM.md §03) with the ceramic charging window
      (LOT-COSMO-CUBE-HARDWARE-SPEC.md §04) sourced in parallel — this is
      the longest lead-time item and should be quoted the same week CNC
      tooling starts, not after.
      GATE: 5-10 final-enclosure units assembled, seam fit and charging-
      through-ceramic-window validated.

    PHASE 4 — 100-UNIT PRODUCTION RUN                      ~6-8 weeks
      Full PCBA + CNC + assembly run at PCBWay per LOT-COSMO-CUBE-BOM.md
      §05 cost rollup. Charging dock accessory (§04 of the BOM) ordered
      in the same window — off-the-shelf, no lead-time risk.
      GATE: 100 units received, spot-QA sample (10 units) passes full
      firmware + pairing + Copy-to-LOG-tab check.

    PHASE 5 — FULFILLMENT + MANUALS                        parallel w/ Ph. 4
      Finalize and print/host the PDF manuals (docs/manuals/
      LOT-COSMO-CUBE-USER-MANUAL.pdf and companion quick-start), package
      insert design, pairing instructions.
      GATE: manual matches shipped firmware version exactly (version
      string cross-check before first unit ships).

================================================================================
02 // TIMELINE ROLLUP
================================================================================

    PHASE                          DURATION      CUMULATIVE
    ─────                          ────────      ──────────
    0  Design Freeze                (this session)     Week 0
    1  Prototype (5-10 units)        4-6 weeks          Week 4-6
    2  API + Pilot                   3-4 weeks          Week 7-10
    3  CNC Tooling + Enclosure       4-6 weeks          Week 11-16
    4  100-Unit Production           6-8 weeks          Week 17-24
    5  Fulfillment + Manuals         (parallel w/ Ph.4) Week 20-24
    ────────────────────────────────────────────────────────────
    TOTAL, design freeze → 100 units in hand:  ~5-6 months

Phases 1 and 2 can overlap partially (API work does not require finished
prototype hardware — it can be built and tested against a bench-wired
ESP32-S3 dev board while the board layout finalizes), which is where the
6-month estimate could compress toward 4-4.5 months with two workstreams
running in parallel rather than strictly sequential.

================================================================================
03 // CONFIG DECISION GATE
================================================================================

LOT-COSMO-CUBE-HARDWARE-SPEC.md §03 defines CONFIG A (5mm, spec-exact,
specialty parts, higher risk) and CONFIG B (8mm, all-stock parts, low
risk). This roadmap does not pre-decide between them — Phase 1 is
explicitly the gate. Recommendation: order both camera options and the
specialty battery quote in Phase 1 simultaneously (small quantities, low
cost to hedge) rather than serially, so the CONFIG decision at the Phase 3
gate is based on real lead-time and yield data instead of a guess.

================================================================================
04 // 100-UNIT PRODUCTION PLAN SUMMARY
================================================================================

See LOT-COSMO-CUBE-BOM.md §05 for full cost detail. Rollup:

    ALL-IN, 100 UNITS         CONFIG A: ~$7,200 - $12,800
                              CONFIG B: ~$5,050 - $8,800
    NRE (tooling, one-time)   ~$1,500 - $4,000
    TOTAL PROGRAM COST        CONFIG A: ~$8,700 - $16,800
                              CONFIG B: ~$6,550 - $12,800

Against a plausible direct-to-Usership-operator price of $99-$149/unit
(consistent with the existing Usership pricing tier in docs/corporate/
LOT-CUBIQ-VISION.md §02, not the robot-line pricing in LOT_ROBOTICS_COSMO.md),
100 units at the low end of program cost clears break-even within the
pilot batch itself; this is a pilot-scale hardware program, not yet a
margin-optimized SKU — Phase 4+ (a second, larger run) is where unit
economics would be revisited with real PCBWay volume pricing.

================================================================================
05 // RISK REGISTER
================================================================================

    RISK                          SEVERITY   MITIGATION
    ────                          ────────   ──────────
    5mm height (CONFIG A) misses  HIGH       CONFIG B fallback defined at
    camera/battery lead times                the board-footprint level
                                              (§03 gate), not a redesign

    Qi charging through metal      MEDIUM     Ceramic window solved in spec
    body                                      (LOT-COSMO-CUBE-HARDWARE-
                                              SPEC.md §04); residual risk is
                                              bonding durability over
                                              repeated charge cycles —
                                              validate in Phase 1/3
                                              prototype wear-testing

    Radio device sold to end       MEDIUM     100-unit pilot run should be
    users without FCC/CE                      framed as a beta/kit
    certification                             distribution to existing
                                              Usership operators (opt-in,
                                              disclosed pilot status) rather
                                              than general retail sale until
                                              a certification pass is
                                              budgeted — standard early-
                                              hardware-startup practice, not
                                              unique to this program

    Battery life below firmware    MEDIUM     WiFi reconnect time is the
    estimate                                  single largest lever
                                              (LOT-COSMO-CUBE-FIRMWARE.md
                                              §06) — validate in Phase 1
                                              before committing to Phase 4
                                              battery capacity choice

    AI-generated pager line        LOW        Same Claude Haiku tier and
    quality/cost at 100-unit                  content-safety posture
    polling scale                             already governing Memory
                                              Engine questions
                                              (LOT-SYSTEM-OUTLINE.md §05);
                                              90s-cache-per-operator
                                              (LOT-COSMO-CUBE-SOFTWARE-
                                              BRIDGE.md §04) keeps call
                                              volume bounded regardless of
                                              poll interval

    displayableEvents whitelist    LOW        Explicitly called out as a
    omission silently hides                   required change in
    device_copy entries                       LOT-COSMO-CUBE-SOFTWARE-
                                              BRIDGE.md §03, citing the
                                              exact prior incident this
                                              doctrine clause exists for
                                              (SR-20260604-01)

================================================================================
06 // PCBWAY WORKFLOW (point 1)
================================================================================

    1. Phase 1: PCBWay standard PCB fab + PCBA (small qty, electronics
       only) — https://www.pcbway.com/orderonline.aspx
    2. Phase 3: PCBWay CNC machining quote for Face A / Face B stainless
       shells, STEP files from the mechanical design —
       https://www.pcbway.com/rapid-prototyping/
    3. Phase 4: single combined PO — PCBWay assembles PCBA into the CNC
       shell in-house before one outbound shipment for all 100 units,
       rather than three separate shipments (boards / shells / final
       assembly) converging externally.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-ROADMAP
================================================================================
