<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-ROADMAP
TITLE:    LOT® Computer — Roadmap & Version Gates
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-03
================================================================================

Companion to LOT_COMPUTER_HARDWARE_PLAN_v1.md. Read that document first — this
one is the timeline and gate criteria only. Format follows the CUBIQ house
style (docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 06): no version is
declared closed without a numeric gate.

--------------------------------------------------------------------------------
v0.1 — BREADBOARD (WEEKS 1-3)
--------------------------------------------------------------------------------
  GOAL       Prove the electronics on a dev board, no enclosure.
  BUILD      ESP32-S3-EYE or equivalent dev kit + BME688 breakout + OV2640 +
             round TFT breakout, wired on a breadboard/protoboard.
  DELIVERS   - Firmware skeleton boots, joins WiFi, renders static text to
               the display.
             - One successful round-trip: server sends a test event over
               the LOT-COMPUTER-SOFTWARE.md §2 channel, device renders it.
             - Presence-detection boolean logged over serial (no LOT API
               wiring yet).
  GATE       10/10 consecutive server-push → screen-render cycles succeed
             with <2s latency. No enclosure work starts before this passes.

--------------------------------------------------------------------------------
v0.2 — CUSTOM PCB, EVT (WEEKS 4-8)
--------------------------------------------------------------------------------
  GOAL       Move from dev-kit to the actual 4-layer PCB (BOM §0/§1),
             3D-printed enclosure stand-in only (no CNC steel yet).
  BUILD      5 EVT units (Section 05 of the hardware plan). PCBWay PCB
             fab + hand assembly (low volume, not SMT-line yet).
  DELIVERS   - Qi charging circuit validated on open bench (no steel
               shielding to fight yet — isolates the charging IC from the
               enclosure-material problem).
             - Copy button → LOT API → Log tab round trip working against
               a real (non-prod) LOT API endpoint.
             - AI-grade sensor parts (BHI260AP, SGP41) integrated and
               reporting through firmware.
  GATE       5/5 EVT units power on, join WiFi, complete a full
             notify → render → Copy-press → Log-tab-entry cycle with zero
             manual intervention. Any unit that needs a firmware reflash
             mid-test to pass does not count toward the 5/5.

--------------------------------------------------------------------------------
v0.3 — STAINLESS SHELL, DVT (WEEKS 9-16)
--------------------------------------------------------------------------------
  GOAL       First real 316L CNC enclosures from PCBWay. This is where the
             hardware plan's honest constraints (04.4 height, 04.6 Qi vs.
             steel) get tested against physical parts, not estimates.
  BUILD      15 DVT units, full two-part stainless shell (polished Face A +
             matte Face B), Macor charging-window insert bonded and
             polished flush.
  DELIVERS   - Actual measured Z-height (target: confirm 6.8mm from 04.4,
               not 5mm — this is the version that proves or disproves that
               number against real machined parts).
             - Qi charge-time measurement through the Macor window vs. the
               open-bench baseline from v0.2 — quantifies the real
               eddy-current penalty, if any.
             - IP54 gasket test (dust chamber + light water spray, not
               submersion).
  GATE       Z-height within 04.4's disclosed 6.8mm ±0.3mm across all 15
             units. Qi charge time within 25% of the v0.2 open-bench
             baseline. Zero gasket failures in dust-chamber test.
             **If the Qi charge-time penalty exceeds 25%, the Macor window
             diameter is the variable to revisit before v0.4 — not a reason
             to silently ship a slow-charging unit.**

--------------------------------------------------------------------------------
v0.4 — PRODUCTION FIRMWARE + PVT (WEEKS 17-22)
--------------------------------------------------------------------------------
  GOAL       Real SMT assembly line at PCBWay, production-candidate
             firmware (OTA update path, crash recovery, provisioning flow
             — full spec in LOT-COMPUTER-FIRMWARE.md).
  BUILD      20 PVT units.
  DELIVERS   - OTA update tested: push a firmware delta, confirm all 20
               units update without brick.
             - 72h idle+notify soak test per unit (per hardware plan
               Section 05 gate).
             - Regulatory pre-scan: informal EMC/radio self-test ahead of
               formal FCC/CE submission (not certification itself — see
               hardware plan Section 07).
  GATE       Zero firmware crashes across all 20 units over the 72h soak.
             20/20 OTA updates succeed. Presence-detection false-positive
             rate <5% over the soak window (hardware plan Section 05 gate,
             re-verified at PVT scale, not just EVT scale).

--------------------------------------------------------------------------------
v1.0 — PILOT RUN COMPLETE (WEEKS 23-30)
--------------------------------------------------------------------------------
  GOAL       Remaining 60 units built to reach the 100-unit pilot
             (hardware plan Section 05), shipped to first Usership-tier
             subscribers.
  BLOCKS     Radio certification (FCC/CE) and battery shipping
             certification (UN38.3) MUST close before this phase ships to
             anyone outside controlled internal hands — these are named,
             unscoped blockers in the hardware plan (Section 07) and are
             not waived by hitting the engineering gates above.
  GATE       100/100 units pass the EVT-stage functional gate (Section 05
             of the hardware plan) individually before leaving the bench.
             Regulatory certifications on file. First 10 subscriber units
             report >90% "notification felt at the right moment" self-
             report (LOT_QI46_ENGINE.md telemetry loop) after 14 days.

--------------------------------------------------------------------------------
v2.0 — 5mm TARGET (RESEARCH TRACK, NOT SCHEDULED)
--------------------------------------------------------------------------------
  GOAL       Close the gap between the v1.0 shipped 6.8mm and the original
             5mm brief (hardware plan 04.4), via a chip-on-board camera
             module (no lens barrel) once sourceable at 100-unit MOQ, and
             a thinner solid-state or supercap power element in place of
             the LiPo pouch.
  ALSO OPENS   Himax HX-WE2 vision co-processor path (hardware plan 04.8)
             to move presence-detection fully off the main MCU.
  STATUS     No gate criteria yet — recorded so v1.0 component choices
             (Section 04 of the hardware plan) are made with the 5mm
             target in mind rather than foreclosing it, the same discipline
             CUBIQ v.0 applied to its own v.3 levitation research track.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COMPUTER-ROADMAP
================================================================================
