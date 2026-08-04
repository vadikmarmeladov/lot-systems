<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-ROADMAP
TITLE:    COSMO® Cube — Build Roadmap & Risk Register, v1 Pilot -> v3
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-02, LANDED 2026-08-04
VERSION:  1.0 -- carried forward from claude/brave-lamport-7d1fy9 (d90febd4)
          unchanged; see LOT-COSMO-CUBE-HARDWARE-v1.md Section 00 landing note
COMPANIONS: LOT-COSMO-CUBE-HARDWARE-v1.md, LOT-COSMO-CUBE-BOM.md,
            docs/technical/LOT-COSMO-CUBE-FIRMWARE.md,
            docs/technical/LOT-COSMO-CUBE-SOFTWARE.md
================================================================================

--------------------------------------------------------------------------------
01 // PHASE 0 — DESIGN LOCK (WEEKS 1-2)
--------------------------------------------------------------------------------

  DELIVERABLE   CAD for both stainless shells (Side A mirror, Side B
                brushed + camera window + weather vent + button/screen
                cutouts), PCB layout for the 40x40mm 4-layer board.
  GATE          CNC + PCBA combined quote received from PCBWay against
                final CAD/Gerbers, tightening LOT-COSMO-CUBE-BOM.md
                Section 03's estimate range to a firm number.
  OWNER         S-2 (design) + PCBWay (DFM review)
  RISK          5mm total stack height (hardware spec Section 03) is a
                zero-slack budget. If the display or camera module
                actually sourced is thicker than spec, the shell height
                grows past 5mm or a component gets cut. MITIGATION:
                order display + camera samples before CAD lock, measure
                physically, do not trust datasheet nominal thickness.

--------------------------------------------------------------------------------
02 // PHASE 1 — FIRST ARTICLE (WEEKS 3-6)
--------------------------------------------------------------------------------

  DELIVERABLE   5-10 hand-assembled units: PCBWay CNC shells + PCBA
                boards, hand-paired and flashed with firmware v0.1
                (docs/technical/LOT-COSMO-CUBE-FIRMWARE.md Section 01).
  GATE          Each first-article unit passes:
                  - Wireless charge cycle (full charge, full discharge,
                    x10) with no thermal event
                  - Camera capture + screen render round-trip under 2s
                  - COPY button -> Log tab signal received end-to-end
                    (docs/technical/LOT-COSMO-CUBE-SOFTWARE.md Section 02)
                  - Weather sensor reading within +/-1C, +/-3%RH of a
                    reference instrument, vent baffle confirmed (no
                    self-heating drift from PCB proximity)
                GATE THRESHOLD: 8/10 units passing all four before Phase
                2 authorization. This mirrors the LOT-CUBIQ-QUANTUM-CUBE-v0.md
                pattern of a numeric pass gate before scaling (there:
                500/500 hop cycles; here: a smaller number because this
                is a first-article check, not a durability run).
  RISK          Qi receiver + camera + MCU antenna all compete for space
                and RF quiet in a 40x40mm board. MITIGATION: first
                article explicitly tests Wi-Fi throughput WHILE wireless
                charging is active — a known failure mode for compact
                Qi + Wi-Fi designs (charging coil EMI desensitizing the
                2.4GHz antenna).

--------------------------------------------------------------------------------
03 // PHASE 2 — 100-UNIT PILOT RUN  (brief item 13)
--------------------------------------------------------------------------------

  DELIVERABLE   100 units through PCBWay's turnkey CNC + PCBA pipeline
                (LOT-COSMO-CUBE-BOM.md Section 01), firmware v1.0
                flashed at assembly or via first-boot OTA.
  GATE          Same four checks as Phase 1, sampled across 10% of the
                100-unit lot (10 units) chosen at random from the
                production batch, not hand-picked. 9/10 sampled units
                passing all four checks before the lot ships to any
                operator.
  TIMELINE      PCBWay standard CNC + PCBA lead time for this order size
                is typically 3-5 weeks from confirmed CAD/BOM to
                delivered lot; treat as the pacing constraint for any
                downstream commitment date.
  RISK          Certification (FCC/CE) is NOT required to build and use
                100 units internally/by invitation, but IS required
                before any commercial sale or public distribution of a
                Wi-Fi + camera consumer device. This roadmap treats
                Phase 2 as a closed pilot; Section 05 names
                certification as the explicit gate before any Phase 3
                that involves sale to third parties.

--------------------------------------------------------------------------------
04 // PHASE 3 — SOFTWARE/FIRMWARE MATURITY  (parallel to Phase 1-2)
--------------------------------------------------------------------------------

  Firmware and software (separate documents per brief item 11) iterate
  on their own cadence, not gated to the 100-unit count:

  FIRMWARE v0.1 -> v1.0   Notification render loop, camera capture,
                          button->API call, OTA update path, weather
                          poll loop. Full spec:
                          docs/technical/LOT-COSMO-CUBE-FIRMWARE.md
  SOFTWARE v0.1 -> v1.0   LOT API connector (pairing, notification push,
                          Copy-button webhook into the Log tab). Full
                          spec: docs/technical/LOT-COSMO-CUBE-SOFTWARE.md
  GATE                    Both reach v1.0 (feature-complete against
                          their own spec documents) before Phase 1's
                          first-article units are flashed with anything
                          other than a v0.x bring-up image.

--------------------------------------------------------------------------------
05 // ROADMAP — v1 -> v2 -> v3
--------------------------------------------------------------------------------

  v1 — THIS ROADMAP (Phases 0-3)
    Single fixed notification screen, one button, one weather sensor,
    camera for on-demand snapshot capture only (no continuous video,
    no local vision processing — frames go to lot-systems.com, which is
    the "AI-powered site" per the hardware spec Section 05). Closed
    100-unit pilot, no commercial sale.
    GATE TO CLOSE v1: Phase 2's 9/10 sampled-unit pass rate achieved,
    and 100 units delivered with zero units failing the wireless-charge
    thermal check (a hard safety gate, not a quality-of-life one).

  v2 — CERTIFICATION + COMMERCIAL READINESS
    Same physical/electronic architecture as v1 (no shell or stack-up
    changes assumed). Adds: FCC/CE certification testing, retail
    packaging, the printed manual as a physical insert (the PDF manual
    from v1 becomes the certified, print-ready source). Deliverable:
    a unit legally sellable to a third party, not just distributable
    to a closed pilot cohort.
    GATE: certification report received with no open non-conformances.

  v3 — SECOND SENSOR / SECOND SIGNAL (RESEARCH TRACK, NOT SCOPED)
    Named here so v1/v2 stack-up and firmware architecture are built
    with room for it, not so it forecloses it — same discipline
    LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 06 uses for its own v3
    (levitation) entry. Candidate directions, none committed:
      (a) A second physical input beyond COPY — e.g. a long-press
          gesture on the same button mapped to a second Log tab
          signal, requiring no new hardware.
      (b) An ambient light or motion sensor alongside the weather
          sensor, if pilot feedback shows operators want presence-aware
          notification timing (screen wakes only when someone is near).
    v3 has no gate criteria yet. It is not scheduled.

--------------------------------------------------------------------------------
06 // RISK REGISTER SUMMARY
--------------------------------------------------------------------------------

  RISK                              PHASE   MITIGATION
  ────                              ─────   ──────────
  5mm stack-up zero-slack           0       Physical sample measurement
                                             before CAD lock (Section 01)
  Qi charging EMI vs. Wi-Fi/BLE     1       Explicit combined-load test
                                             in first-article gate
  Weather sensor self-heating       1       Vent baffle + gate threshold
   from adjacent PCB                        on reading accuracy
  Certification required before     2->3    Roadmap treats v1/v2 as
   any commercial sale                      closed-pilot only until v2
                                             certification gate clears
  Single-vendor supply chain        2       Explicit tradeoff (BOM
   (PCBWay for fab+CNC+assembly)            Section 01) accepted for
                                             pilot scale; revisit at
                                             v2 commercial volume

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-ROADMAP
================================================================================
