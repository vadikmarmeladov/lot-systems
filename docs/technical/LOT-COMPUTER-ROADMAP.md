<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Roadmap & Risk Register

**Document:** LOT-COMPUTER-ROADMAP.md
**Reads together with:** VISION, RIG-SPEC, FIRMWARE, SOFTWARE-BRIDGE (all in this folder / docs/corporate)
**Prepared:** 3 July 2026 · Vadik Marmeladov, Inventor · COSMO® CIA

---

## 00 — Phased Plan

```
PHASE 0 — Paper (this session)                          Complete 2026-07-03
  ├── Vision document                                    DONE
  ├── Hardware BOM + supplier links                      DONE
  ├── Firmware specification                             DONE
  ├── Software / API connector specification              DONE
  └── This roadmap                                        DONE

PHASE 1 — Fit-Check Prototype (breadboard + 3D-printed shell mockup)
  ├── Confirm ESP32-S3 + BME680 + piezo disc bring-up on a dev board
  ├── 3D-print a 40x40x5mm shell mockup to physically test the
  │   camera-boss decision (RIG-SPEC §03) before cutting real steel
  ├── Battery fit-check: does 150mAh fit, or does the tile need to drop
  │   to a 40-80mAh bridge cell (RIG-SPEC §07)
  ├── Order 1x PCBWay CNC stainless sample shell (not the full run) to
  │   verify tolerances against the fit-check
  └── GATE: no full order placed until fit-check resolves §03 and §07

PHASE 2 — Backend Enablement
  ├── Build the Device model + bearer-token middleware
  │   (SOFTWARE-BRIDGE §03) — single contained PR
  ├── Stand up GET /notifications/next + wire POST /logs event type
  │   "device.copy" / "device.session"
  └── GATE: device-token auth code-reviewed and merged before any unit
      ships with live credentials

PHASE 3 — First Article (1-5 units)
  ├── Full PCBWay order: PCB + SMT assembly + CNC stainless shell,
  │   qty 5, not 100 — validate the real supply chain end to end
  ├── Firmware bring-up against Phase 2's live backend, on real hardware
  ├── OTA rollback test (FIRMWARE §06) — deliberately push a broken image,
  │   confirm A/B rollback recovers without a bench connection
  └── GATE: 5 units running for 2+ weeks on a charging puck with zero
      unintended camera activation, zero cross-session data leakage

PHASE 4 — 100-Unit Pilot Run
  ├── Place full BOM order (RIG-SPEC §10) — ≈$8,525 unit cost + $2-4k NRE
  ├── PDF manuals finalized and included per unit (see §02 below)
  └── GATE: first 10 units held back as a burn-in batch before the
      remaining 90 ship

PHASE 5 — Field Data Review
  └── 30/60/90-day review of real Copy-tap rates, weather-sensor drift,
      and OTA success rate feeds back into whether v2 revisits the
      camera-boss decision (§03) or the PM2.5 dock decision (RIG-SPEC §04)
```

---

## 01 — Risk Register

| # | Risk | Where flagged | Mitigation / Decision Path |
|---|------|---------------|----------------------------|
| 1 | OV2640 lens assembly does not fit flush in 5mm body | RIG-SPEC §03 | Accept lens boss (Option A) for v1; re-evaluate bare-die/dock relocation (Option B) after Phase 1 fit-check |
| 2 | 150mAh cell alone may consume most of the height budget | RIG-SPEC §07 | Reframe as bridge cell for a dock-resident device, not daily-use battery; test smaller cell in Phase 1 |
| 3 | Good Display e-paper panel is quote-only, not retail-priced | RIG-SPEC §02 | Get formal 100-unit quote before Phase 4 order; do not lock BOM cost off hobbyist reseller prices |
| 4 | No device-auth backend exists today | SOFTWARE-BRIDGE §03 | Phase 2 is a hard gate — no device ships with live credentials until this PR is merged and reviewed |
| 5 | Camera privacy — any camera on a device sitting in someone's home is a trust risk regardless of intent | FIRMWARE §02, §03 | Hard firmware invariant: no frame ever serialized to the sync buffer, only derived scalars (ambient_lux, presence bool). Document this invariant publicly in the user-facing PDF manual, not just internally — trust requires disclosure, not just correct code |
| 6 | Single-vendor manufacturing (PCBWay for CNC + PCB + assembly) | RIG-SPEC §09 | Acceptable for a 100-unit pilot where auditability matters more than supply redundancy; revisit multi-vendor sourcing only if volume scales past pilot |
| 7 | OTA bricking in the field | FIRMWARE §06 | A/B partition rollback tested explicitly in Phase 3 before Phase 4 volume order |
| 8 | E-paper ghosting / display legibility degrading over many partial refreshes | FIRMWARE §04 | Automatic full-refresh cycle every 8h already specified; monitor in Phase 3 burn-in |

Risk 5 is the one worth stating plainly: a camera in a home product is a
trust liability first and an engineering problem second. The firmware
invariant (never serialize a frame) is necessary but not sufficient — the
PDF user manual (§02) must say this in plain language on page one, not bury
it in a firmware doc nobody but engineering reads.

---

## 02 — Documentation & PDF Manuals

Per the intake brief's requirement that firmware, software, and hardware
stay **separate documents**, and that the result includes **PDF manuals**:

| Manual | Source | Audience |
|---|---|---|
| Quick Start / User Manual | This vision doc + rig-spec highlights, condensed | End user, printed insert in the box |
| Firmware Manual | `LOT-COMPUTER-FIRMWARE.md`, as-is | Engineering / OTA release process |
| Software / API Manual | `LOT-COMPUTER-SOFTWARE-BRIDGE.md`, as-is | Backend engineering, companion-app developer |

PDF generation follows the existing repo pattern used for the Badges &
Achievements Codex (`scripts/generate_badge_pdf_v19.py`, reportlab-based,
Terminal Grid typography) rather than introducing a new toolchain. See
`docs/technical/pdf/` for the generated set produced alongside this roadmap.

---

## 03 — 100-Unit Run — Why 100, Not 10 or 1,000

- **10 units** would not produce enough field-hours to validate the
  camera-boss decision, the bridge-cell battery sizing, or OTA rollback
  under real (not bench) conditions.
- **1,000 units** commits to injection-molding-scale tooling and a BOM
  that has not yet cleared a single fit-check prototype (Phase 1) — an
  unjustifiable order of operations.
- **100 units** matches the precedent already set for LOT® Station and
  LOT® Brush hardware cohorts (`docs/corporate/LOT-AMBIENT-AI-VISION.md`)
  — enough to seed a real Usership hardware cohort, small enough that a
  Phase 1/3 mechanical surprise doesn't strand five figures of unusable
  stainless steel.

---

## 04 — Cost Rollup (from RIG-SPEC §10)

```
100-unit BOM subtotal            ≈ $8,525
NRE (tooling, fixtures, article) ≈ $2,000 – $4,000
─────────────────────────────────────────────────
Pilot run total                  ≈ $10,500 – $12,500
Per-unit landed cost              ≈ $105 – $125
```

No retail price is set in this document — that is a commercial decision
outside engineering scope. For reference only, the COSMO® robotics roadmap
(`docs/corporate/LOT_ROBOTICS_COSMO.md`) prices the Quantum Cube-class
hardware precedent in the $2,500-$5,000 range for a different product
tier; the LOT® Computer, as a simpler pager-class device, is not assumed
to share that price point.

---

## 05 — Immediate Next Action

Phase 1 (fit-check prototype) is the only phase that should start without
further sign-off — it is cheap (a dev board, a 3D print, one CNC sample
shell) and resolves the two open engineering risks (§01, items 1 and 2)
before any money is committed to a 100-unit order. Phases 2-4 each carry
an explicit gate above and should not be started out of sequence.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*Inventor: Vadik Marmeladov · COSMO® CIA*
