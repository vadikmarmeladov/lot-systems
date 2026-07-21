<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com | institute.lot-systems.com
-->

# CUBIQ™ — LOT® Quantum Cube, Hardware v0
## The Actuated Haptic Notification Device — Development Report
### LOT® Institute, Inc. · Malibu, CA · LOT Systems Corporation · Los Angeles, CA

**Classification:** RESTRICTED // S-2 EYES
**Document:** LOT-CUBIQ-HARDWARE-v0
**Version:** v0.1 — First Development Pass
**Date:** 2026-07-21
**Author:** Vadik Marmeladov — CEO, Designer, Inventor, LOT® Institute, Inc.

---

> *"Touch activates it, but cosmic energy sustains it."*
> — LOT Quantum Cube White Paper, November 1, 2025

---

## 0. PRIOR WORK REVIEWED

Before scoping v0, the full existing CUBIQ/Quantum Cube record was read:

| Source | Type | Date | Relevance |
|--------|------|------|-----------|
| `LOT_Quantum_Cube.pdf` (LOT® Institute) | White paper | 2025-11-01 | Full electronic-crystal / acoustic-levitation design — the long-range spec this v0 descends from |
| `CQGS.pdf` / `docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md` | White paper + snapshot | 2025-07-30 | Names "Quantum Cube" as a CQGS product layer: bioelectric hardware, haptic feedback, nano-ceramic, piezoelectric |
| `QI46.pdf` / `docs/corporate/LOT_QI46_ENGINE.md` | Engine spec | 2026-05-27 | Defines the Month-12+ "Quantum Cube sync" signal contract the software side already expects (haptic preference, usage frequency, biofield response) |
| `LOT_Institute.pdf` | Institute index | — | Confirms the three founding white papers and their canonical dates; LOT® Robot Person™ / PDS drive-system context |
| `Usership.pdf` | Subscription page | — | Confirms $399/mo priority tier ships with "Quantum Cube sync"; physical products are Phase 4 of the CUBIQ™ arc |
| `docs/corporate/LOT-CUBIQ-VISION.md` | Vision | 2026-06-23 | CUBIQ® as the "quantum cubic operating experience" — digital-first, physical as "the inevitable step" |
| `docs/corporate/LOT-CUBIQ-OPERATOR.md` | Operator manual | 2026-06-23 | Phase 4 (Days 90+) — AI-triggered physical delivery; "wellness devices... feed back into LOT®" |
| `docs/corporate/LOT_ROBOTICS_COSMO.md` | Robotics vision | 2026-05-25 | Sibling hardware line (COSMO®); establishes the ethics/consent gate pattern this device inherits |
| `docs/assembly/2026-04-21_LOT-assembly_v5-accuracy-narrative.md` | Assembly log | 2026-04-21 | "The levitating Quantum Cube computer progress and folklore is always present as a system heartbeat" — the Cube already lives in the software's narrative voice, pre-hardware |
| `docs/technical/WIDGETS.md` | Technical | — | Confirms the Cube-as-heartbeat narrative is wired into `selfAssembly.ts` today |

**Finding:** No prior hardware build log exists yet (`docs/benchmark/`, `docs/assembly/` show narrative/software-only Cube references). This document is the first physical-hardware development pass — **v0** — and the first entry in what should become an append-only CUBIQ hardware log, one new consumer use case per pass, following the same additive convention as `docs/assembly/`.

---

## I. WHAT v0 IS — AND ISN'T

The LOT® Institute white paper (2025-11-01) specifies the **full CUBIQ vision**: a 15mm monolithic electronic crystal — nano-ceramic, piezoelectric through its entire volume, self-powered from 20-100mV bioelectric harvesting, capable of acoustic levitation at 25-40kHz. That is the **long-term target** (Section 13.3 of the white paper: "Long-Term Vision (2030+)").

**v0 does not attempt that.** v0 is scoped to what the white paper itself calls the pragmatic first step (Section 14.1): *"a biofeedback device integrating a natural body EMF capacitor, built using an existing and commercially available tech-stack."* v0 trades the electronic-crystal monolith for COTS actuation, and trades true acoustic levitation for the two capabilities the task requires first:

1. **Long jumps** — a discrete vertical hop, driven by a stored-energy release, tall enough to read as a deliberate gesture rather than a buzz.
2. **Horizontal surface swings/jumps** — directional hops/skips across a tabletop, using asymmetric friction or a shifting internal mass, so the cube can "walk" toward or away from the operator.
3. **Levitation** — explicitly deferred to v2+ (Section III below), staged behind the white paper's own roadmap (acoustic levitation of a 1g object is a solved sub-problem at 40kHz; sustaining *itself* airborne is not, at 8-12g).

CUBIQ™ v0's job is to be the first CUBIQ hardware object that a LOT® operator can hold, that responds to a real QI·46 signal, and that fails safe. Everything else compounds from there.

---

## II. v0 MECHANICAL ARCHITECTURE

### II.1 Chassis

- 40mm cube (up-sized from the white paper's 15mm target — v0 needs room for COTS parts; shrinks toward 15mm as the custom nano-ceramic body comes online in v2+)
- Body: CNC-milled ABS/polycarbonate shell, `LOT-CUBIQ-VISION.md` "clean, functional" brand language — no gradients, no ornament, Terminal Grid proportions
- Weight target: 45-60g fully assembled (COTS actuators and a real LiPo cell are heavier than the white paper's 8-12g nano-ceramic target; weight comes down as components miniaturize)
- IP54-rated seam (splash-resistant, matches the white paper's IP65 aspiration for the eventual monolithic body)

### II.2 Long-Jump Mechanism

Internal reciprocating mass on a compression spring, held by a solenoid latch:

```
IDLE:     [ spring compressed, latch engaged, mass at base ]
TRIGGER:  solenoid releases latch (< 5ms)
RELEASE:  spring drives mass downward against chassis floor
REACTION: chassis (and cube) launched upward — 15-40mm hop height
RECOVERY: mass re-compresses via small DC motor + cam, ~600ms
```

This is the same reaction-mass principle the white paper names for acoustic levitation ("radiation force > gravitational force") applied mechanically instead of acoustically — a deliberate bridge concept, so the v0 firmware's force/timing model carries forward unchanged when the actuator is later replaced with a piezo array.

### II.3 Horizontal Swing/Jump Mechanism

Off-center eccentric rotating mass (ERM) plus two asymmetric-friction pads on the underside (steep-angle grip forward, shallow-angle slip backward — the same principle "vibrobot" hexbugs and bristlebots use). Driving the ERM at resonance walks the cube in a chosen direction; a short high-torque burst produces a directional hop/skip rather than a crawl, which is what "swing" in the task brief is describing — the cube skitters sideways across the table rather than only hopping in place.

### II.4 Haptic Notification Layer

A linear resonant actuator (LRA), independent of the jump/swing actuators, handles the sub-millimeter "notification buzz" register — this is the layer that maps 1:1 to the white paper's Band 2 (20-1000 Hz haptic range, Pacinian-corpuscle-targeted 200-300 Hz) without invoking the whole-cube kinetics. Not every notification should make the cube jump; most should just hum.

### II.5 Electronics (v0 bill-of-materials, COTS)

| Component | Role | White-paper analog |
|-----------|------|---------------------|
| ESP32-C3 (BLE + Wi-Fi) | MCU, QI·46 sync over LOT® network | "Digital Control" layer (§6.1, Layer 4) |
| 6-axis IMU (accel + gyro) | Landing detection, orientation, table-edge fall sensing | — (new, safety-driven) |
| LRA + haptic driver IC | Notification buzz | Band 2 haptic (§9.1) |
| Micro solenoid + compression spring | Long-jump actuator | Mechanical stand-in for §7 acoustic radiation force |
| Coin vibration motor (ERM), offset-weighted | Horizontal swing/jump | Mechanical stand-in for §7.5 "lateral motion / tilt standing wave" |
| 500mAh LiPo + Qi wireless charging coil | Power | Stand-in for bioelectric + cosmic harvesting (§14, deferred to v2) |
| Capacitive touch electrodes (2 faces) | Presence/touch detection, not yet full bioelectric GSR sensing | §4 Bioelectric Interface Design (partial — capacitive only in v0) |

v0 deliberately does **not** implement bioelectric energy harvesting or GSR-based emotion sensing (white paper §4.2-4.3) — those require the custom nano-ceramic electrode array and are staged for v2 (Section III). v0 runs on battery + wireless charging so the jump/swing/haptic behaviors can be validated on a compressed timeline without waiting on materials science.

---

## III. ROADMAP — v0 → THE WHITE PAPER

Staged directly against the white paper's own timeline (§13):

| Version | Target | Capability | White-paper stage |
|---------|--------|------------|--------------------|
| **v0** (this doc) | Q3 2026 | Battery-powered, COTS actuators. Long jump. Horizontal swing/jump. LRA notification buzz. QI·46 signal sync (one-way: software → cube). | Pre-roadmap (bridge build) |
| v0.5 | Q4 2026 | Two-way sync — cube motion feeds back into the Calibration Loop as a real signal (`docs/corporate/LOT_QI46_ENGINE.md` §"Quantum Cube Signal Integration"). Capacitive touch → coarse GSR proxy. | §13.1 Near-Term (2026-2027), "Manufacturing Scale-Up" track |
| v1 | 2027 | Custom nano-ceramic shell begins replacing injection-molded body. Piezo array added alongside (not replacing) the mechanical jump actuator — tethered near-field acoustic levitation demo of a *separate* 1g object, proving the physics before attempting self-levitation. | §7 Acoustic Levitation Mechanisms; §13.1 |
| v2 | 2028-2029 | Bioelectric harvesting (§4.2 Dickson multiplier) supplements battery. True GSR emotional sensing. Multi-frequency operation (§9). | §13.2 Mid-Term Innovations |
| v3 | 2029-2030 | Piezoelectric array sized and driven sufficiently to attempt **self**-levitation at the cube's actual 45-60g v0 mass, or the monolithic body has shrunk enough (toward the 8-12g / 15mm target) that the existing 1g-object levitation math (§7.4) closes on the cube itself. | §13.3 Long-Term Vision (2030+) |

The white paper is explicit that self-levitation and 1-gram-object levitation are different problems — v0 through v2 practice the mechanical, electronic, and signal-integration groundwork; v3 is where the acoustic levitation math is actually asked to lift the device itself.

---

## IV. SOFTWARE INTEGRATION — QI·46 / CALIBRATION LOOP

`LOT_QI46_ENGINE.md` already specifies the signal contract this hardware must satisfy at delivery:

```
QUANTUM CUBE SIGNAL INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signal type: Haptic preference (pressure, duration, cadence)
Signal type: Usage frequency (daily, weekly, session length)
Signal type: Biofield response (pre/post session self-report)
Integration point: Calibration Loop → context vector
Effect: Arc position advances to 'hardware' state
```

v0 satisfies the first leg of this contract one-way: QI·46 pattern events (badge unlock, memory question ready, streak-at-risk, self-care nudge) map to a **CUBIQ Notification Grammar**:

| QIE Event | CUBIQ v0 Behavior |
|-----------|--------------------|
| Memory question ready | Single LRA pulse (200ms, 250Hz) — matches white paper's "haptic confirmation pulse" |
| Badge unlocked (common-epic) | Single vertical hop |
| Badge unlocked (legendary/mythic/cosmic) | Hop + 2 horizontal swing-steps toward the operator |
| Streak at risk (evening, no check-in yet) | Slow horizontal walk-in-place (ERM resonance, low duty cycle) — a nudge, not an alarm |
| Self-care moment suggested | Sustained low-frequency haptic hum (Band 1 analog, 5-10Hz feel) |
| Purple/Black-tier Benchmark reached | Full sequence: hop → swing → hop (celebratory "dance"), the first behavior pattern that reads as more than a notification |

This is deliberately conservative: v0 never uses jump/swing for anything the operator hasn't opted into, and every kinetic behavior is preceded by the gentler LRA buzz first, per the white paper's own Phase 1-2 touch-activation sequence (§10.1) — presence detected, then a small confirmation, then full response.

---

## V. SAFETY & CONSENT (inherits the COSMO® ethical gate)

`LOT_ROBOTICS_COSMO.md` establishes that any LOT® hardware carrying a behavioral signal must ship with hard ethical limits. CUBIQ™ v0 inherits the same posture at a much smaller scale:

1. **Table-edge cutoff.** The IMU + a simple edge-detection heuristic (orientation + drop in accelerometer-implied surface distance) disables horizontal swing/jump within 20mm of a detected table edge. A notification device must not throw itself onto the floor.
2. **Consent-gated kinetics.** Jump and swing behaviors are opt-in per notification class in the operator's LOT® settings — off by default at first boot. The LRA hum is the only always-on channel.
3. **Thermal/impact ceiling.** Solenoid duty-cycle capped in firmware well under the white paper's skin-safe 45°C surface limit (§6.3) even though v0 has no continuous skin contact requirement.
4. **No dark patterns.** Per `LOT-CUBIQ-OPERATOR.md` §04 ("this is not e-commerce, this is care delivery") — CUBIQ never escalates kinetic intensity to compel engagement. Streak-at-risk nudges are capped at one low-intensity walk per day, never repeated or intensified.

---

## VI. CONSUMER USE CASES

*Append-only. One new use case per development pass, in the tradition of `docs/assembly/`. This is Use Case 01, the first.*

### USE CASE 01 — "The Sunrise Walk" (Circadian Wake Nudge)

**Operator profile:** Usership-tier operator, consistent LOT® circadian tracking (`ChakraErgonomicsWidget`, sleep-adjacent signals), history of phone-alarm snoozing.

**Scenario:** CUBIQ v0 sits on the nightstand, wirelessly charging overnight. The operator's LOT® profile has learned their real wake window from 90+ days of check-in timestamps (the same longitudinal arc `LOT_ROBOTICS_COSMO.md` uses for behavioral verification). At the learned wake time, instead of a phone alarm:

1. **T+0:00** — LRA hum only. Gentle, sub-audible. If the operator's phone shows a check-in within 90 seconds, sequence ends here. No further escalation on a normal morning.
2. **T+1:30** (no check-in yet) — single vertical hop. A small, visible, silent "attention" gesture on the nightstand — no sound, no light, nothing that disturbs a partner still asleep.
3. **T+3:00** (still no check-in) — horizontal walk sequence: the cube skitters 2-3cm across the nightstand surface toward the edge nearest the operator, then stops (table-edge cutoff engages before it reaches the actual edge). The motion is the entire message — an object that is visibly, physically *waiting* for you.
4. **Cap.** The sequence never repeats more than once per morning and never increases past the walk-in-place stage — consistent with the "no dark patterns" rule in Section V. If the operator doesn't respond, CUBIQ goes quiet and lets the day happen; it does not nag.

**Why this fits LOT®, not a generic smart-alarm:** the trigger is derived from the operator's own longitudinal signal record (not a fixed clock time), the response is the same jump/swing vocabulary used for badge and streak notifications elsewhere in the Notification Grammar (Section IV) — so operators learn one physical language for the whole system — and the escalation is capped by the same consent/no-dark-patterns doctrine that governs every other LOT® touchpoint. It is the first use case where a physical, kinetic behavior (not a screen, not a sound) is the entire interface, which is the point of building CUBIQ hardware at all: some notifications are better felt on a nightstand than read on a lock screen.

---

## VII. OPEN QUESTIONS FOR v0.5

- Which QI·46 pattern classes (of the 80 named patterns) get a dedicated notification-grammar entry vs. fall back to plain LRA hum — needs an explicit allowlist before more use cases are layered on, or the grammar sprawls.
- Table-edge cutoff heuristic (IMU + accelerometer proxy) needs bench validation against a real table before any horizontal-swing behavior ships to an operator's home.
- v0.5's two-way sync (cube motion as a QIE signal source) needs a spec addition to `LOT_QI46_ENGINE.md`'s 15-source signal list — CUBIQ isn't listed there yet.

---

## VIII. TRADEMARKS & IP

| Mark | Status | Owner |
|------|--------|-------|
| LOT® | Pending | LOT Systems, Inc. |
| CUBIQ™ | Pending | LOT Systems, Inc. |
| LOT® Quantum Cube™ | Pending (Institute white paper, 2025-11-01) | LOT® Institute, Inc. |
| Quantum Intent Engine™ / QI·46 | Pending | LOT Systems, Inc. |

---

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-CUBIQ-HARDWARE-v0
================================================================================
