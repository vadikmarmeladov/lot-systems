<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Quantum Cube (CUBIQ™) — v.0
## Actuated Haptic Notification Device — Product & Engineering Report

**Document:** LOT-CUBIQ-HARDWARE-v0.md
**Classification:** Restricted — S-2 / R&D Product Vision
**Prepared:** 2026-07-27
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems
**Status:** v.0 — first hardware spec pass. Not yet built. Not yet benchmarked.

---

## 0 // PRIOR WORK CONSULTED

Before drafting this spec, the following LOT® documents were read in full:

| Document | Relevant to CUBIQ™ because |
|---|---|
| `docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md` | First institute reference to "Quantum Cube — bioelectric hardware, haptic feedback, nano-ceramic, piezoelectric" as a Consumable Ecosystem product |
| `docs/corporate/LOT_QI46_ENGINE.md` | Establishes the Month-12 "Quantum Cube sync" milestone, the three hardware signal types (haptic preference, usage frequency, biofield response), the Fastify/Droplet/Cloudflare Tunnel delivery infrastructure CUBIQ™ must sync through, and the LOT® voice constraints (§III) that govern how the device is described to a subscriber |
| `docs/corporate/LOT-CUBIQ-VISION.md` / `LOT-CUBIQ-OPERATOR.md` | Define **CUBIQ®** as the existing *digital* quantum-cubic session (the 5–11 minute browsing experience) and §05/§04 "Physical Products — The Inevitable Step" / "AI-Driven Physical Product Delivery," which already names "wellness devices — wearable or ambient tech that feeds back into LOT®" as the terminal phase of the arc |
| `docs/corporate/LOT_ROBOTICS_COSMO.md` | House format for a hardware product-vision doc, the Benchmark Arbitrage® eligibility-gate pattern, and the father-son origin framing this report reuses in §VIII |
| `docs/benchmark/LOT-MANIFEST.md` | Confirms no prior CUBIQ™ *hardware* spec exists on any branch (a "COSMO® Cube — hardware computer design v1.0" entry exists but is a separate, pruned lineage — a compute device, not a haptic notifier) |

**Naming note:** CUBIQ® (registered/pending, digital) already denotes the *software* session. This document introduces **CUBIQ™** (pending) as the *hardware* companion — the physical object CQGS calls "Quantum Cube." The two are deliberately paired, not confused: CUBIQ® is the mind passing through the cubic; CUBIQ™ is the cubic that can now tap the table back. §IX covers the trademark distinction formally.

No prior hardware v.0 document exists to build on — this is the first. Each future iteration of this report is expected to append one additional consumer use case to §VIII rather than replace it, per S-2 instruction.

---

## I // CORE THESIS

Every notification LOT® has ever sent has arrived through a screen. A screen is the same surface that delivers the feed, the ad, the doomscroll. Even a beautifully designed notification inherits the anxiety of the medium it arrives on.

CUBIQ™ is LOT®'s answer: **a notification that arrives in the room instead of on the glass.**

The Quantum Cube sits on the operator's desk — inert, still, present — until the Quantum Intent Engine has something worth saying with a body instead of a banner. Then it moves. A badge unlocks and the Cube hops in place. A chakra reading swings from strained to open and the Cube performs a slow horizontal glide across the table, like it's stretching. A memory arc reaches its Month-12 milestone and the Cube travels the full length of the desk in a single long jump — the physical equivalent of the platform saying *this is a big one.*

The gesture vocabulary is the message. No screen required to read it.

---

## II // WHAT CUBIQ™ v.0 IS — AND IS NOT

**v.0 is:**
- A single physical unit, roughly 40mm cubic, that can execute three motion classes: **in-place hop**, **horizontal surface jump** (a directed hop that translates the cube 5–15cm across a table), and **long jump** (a directed hop that translates the cube 20–60cm, LOT®'s highest-intensity notification gesture).
- Wireless (Bluetooth LE + Wi-Fi provisioning), battery-powered, charges by resting on its base pad.
- Synced to a single operator's LOT® profile via the existing Fastify/Droplet/Cloudflare Tunnel infrastructure described in `LOT_QI46_ENGINE.md` §III — no new backend architecture required, only a new signal channel.
- A **feedback source**, not just an output device — every motion the Cube performs, and every time an operator manually taps or turns it, is logged back into the Calibration Loop as the "haptic preference" and "usage frequency" signals the QI·46 spec already reserves for it (`LOT_QI46_ENGINE.md` line 757–759).

**v.0 is explicitly not:**
- Levitating. Levitation is §VII's v.3 milestone — a separate paired base unit, not a v.0 claim.
- Autonomous or free-roaming. The Cube only moves in response to a notification event or a direct operator command. It does not patrol, wander, or self-relocate.
- A speaker, a screen, or a general IoT hub. One job: turn a digital signal into a felt, physical gesture.
- A replacement for the CUBIQ® digital session. It is the session's downstream echo, not a new interface to browse.

---

## III // PHYSICAL ACTUATION ARCHITECTURE

The three required motion classes — in-place hop, horizontal surface jump, long jump, and the eventual levitation stretch goal — map to a known lineage of small-cube robotics rather than an unproven mechanism. v.0's actuation stack:

### III.1 — Internal reaction-mass core (the jump engine)

A 3-axis orthogonal reaction-wheel cluster, one wheel per face-pair, each spun by a small brushless motor and stopped by an electromagnetic brake. This is the same working principle as ETH Zurich's **Cubli** (a cube that self-erects and balances on a single edge using reaction-wheel torque) and MIT CSAIL's **M-Blocks** (cubes that jump, spin, and roll using a single high-speed flywheel braked against a solenoid-actuated brake pad).

- **In-place hop:** all three wheels spun up, then braked simultaneously — the angular momentum transfer produces a vertical impulse against the shell, lifting the cube a few millimeters and letting it drop back roughly on-axis. This is the low-intensity notification gesture (e.g. a mood check-in reminder).
- **Horizontal surface jump / long jump:** wheels are spun asymmetrically before the brake fires, biasing the impulse vector so the cube's corner strikes the table at an angle and translates rather than just lifting. Jump distance is a function of pre-brake RPM and brake timing — v.0 targets two discrete presets (short/long) rather than continuous distance control, to keep the v.0 firmware simple and the motion legible as a *language* (short jump means one thing, long jump means another) rather than arbitrary.

### III.2 — Piezoelectric skin (the haptic layer)

The shell itself is nano-ceramic composite with an embedded piezoelectric layer, matching the material spec CQGS already names for the Quantum Cube (`CQGS-WHITE-PAPER-SNAPSHOT.md`, Products row). Piezo elements serve two roles:
1. **Fine haptic texture** — pulses, purrs, and taps too small to move the cube, used for ambient signals (a new memory question waiting, a streak about to lapse) that shouldn't demand the operator look up.
2. **Stick-slip micro-creep** — rapid, small-amplitude piezo deflection against the table surface produces slow directional creep (millimeters per second), used when the Cube wants to "lean toward" the operator without a full jump — a lower-drama alternative gesture the pattern library can assign separately from hops.

### III.3 — Sensing (so the Cube knows where it lands)

A 6-axis IMU (accelerometer + gyroscope) for orientation and impact detection, plus a downward-facing short-range IR proximity sensor on each face as a table-edge / cliff sensor. **No jump fires if the edge sensor reports open space within the jump's projected landing envelope** — this is a hard-coded safety interlock, not a configurable setting (see §VI).

### III.4 — v.3 stretch goal: levitation

Levitation is deferred to a paired accessory, not solved inside the v.0 cube: a **Quantum Base** desk mat containing a Hall-effect-servoed electromagnet array (the same working principle commercial levitating-object devices such as Flyte's levitating lamp use), and a passive magnet ring embedded in a future Cube revision. The Cube does not levitate on its own — it levitates *in relationship to its Base*, which is thematically consistent with the rest of the LOT® hardware philosophy (nothing in the CUBIQ™ line operates without its paired context). This is scoped for v.3 (§IX) and is not a v.0 engineering commitment.

---

## IV // v.0 COMPONENT STACK

| Subsystem | Component | Note |
|---|---|---|
| MCU | ESP32-S3 (Wi-Fi + BLE) | Matches LOT®'s existing self-hosted-infra bias — no proprietary cloud dependency |
| Reaction core | 3× coreless DC micro-motor + flywheel + solenoid brake | Cubli/M-Blocks pattern, §III.1 |
| Shell | Nano-ceramic composite, piezoelectric-embedded | Per CQGS material spec |
| Sensing | 6-axis IMU + 6× IR edge sensors (one per face) | Safety interlock, §III.3, §VI |
| Power | 700mAh Li-Po, inductive charge pad (base) | Charges at rest, no exposed contacts |
| Comms | BLE (pairing/provisioning) + Wi-Fi (sync to LOT® Droplet) | Reuses `qi.lot-systems.com` auth model |
| Enclosure size | ~40mm cube, ~65g | Small enough that a full jump is startling, not dangerous |

---

## V // NOTIFICATION SEMANTICS — SIGNAL → GESTURE MAPPING

The gesture vocabulary must stay small and legible — CQGS's "density over sprawl" voice constraint applies to motion the same way it applies to text (`LOT_QI46_ENGINE.md` §III). v.0 ships four gestures, each bound to a class of existing QIE signal, not a bespoke new signal type:

| Gesture | Intensity | Bound to |
|---|---|---|
| Piezo pulse (no movement) | Ambient | New memory question ready, streak-lapse warning |
| In-place hop | Low | Emotional check-in due, self-care moment suggested |
| Horizontal surface jump | Medium | Badge unlocked, chakra state shift, intention completed |
| Long jump | High | Archetype trajectory shift, Month-12 milestone, Benchmark tier change |

This keeps CUBIQ™ downstream of signals the platform already computes — no new pattern-recognition work is required for v.0. The Cube is a **renderer for existing QIE output**, in the same sense a widget is, except its render surface is the physical world.

---

## VI // SOFTWARE & SYNC ARCHITECTURE

CUBIQ™ does not introduce new backend infrastructure. It adds one signal channel to the Calibration Loop already specified in `LOT_QI46_ENGINE.md`:

```
LOT® Droplet (Fastify) ── Cloudflare Tunnel ── BLE/Wi-Fi bridge ── CUBIQ™ unit
        │
        ├── Outbound: gesture events (§V table) pushed on QIE signal fire
        └── Inbound: haptic preference + usage frequency + biofield
            self-report (post-gesture "did that land?" micro-survey,
            answered by a single tap on the Cube itself)
```

The inbound direction matters as much as the outbound one. Every gesture the Cube performs is followed by a short window in which a single tap on the cube (detected by the IMU as an impulse distinct from a jump landing) logs a binary "noticed" signal back into the Calibration Loop — the same "haptic preference" signal type QI·46 already reserves a slot for. This is the mechanism by which the platform learns, per operator, which gestures are worth the physical drama and which should quietly downgrade to a piezo pulse.

**Firmware safety layer runs on-device, not server-side.** Jump commands arrive from the Droplet as gesture-class events (`hop | jump_short | jump_long`), not raw actuator instructions — the Cube's own firmware owns the edge-sensor interlock (§III.3) and the cooldown timer (§VII) regardless of what the server sends. A compromised or buggy backend cannot command an unsafe motion; it can only request a gesture class, and the device decides whether it is safe to perform.

---

## VII // SAFETY, ETHICS & CHILD-SAFETY BOUNDS

Following the same posture `LOT_ROBOTICS_COSMO.md` establishes for COSMO® — hardware that touches the physical world inherits a stricter ethical bar than software does.

**What CUBIQ™ v.0 will never do:**
1. **Jump blind.** The edge-sensor interlock (§III.3) is unconditional. No firmware setting, remote command, or debug mode may disable it.
2. **Jump toward a person.** Directional bias is computed to jump *along* the cube's current heading only, never re-aimed toward a detected face/hand via camera or proximity — v.0 carries no camera, intentionally.
3. **Exceed a hard cooldown.** Minimum 8 seconds between any two jump-class gestures, enforced on-device, to prevent a runaway signal loop (e.g. a badge-unlock storm) from turning the notification device into something closer to a toy hazard.
4. **Operate without a paired, consented LOT® profile.** Mirrors the COSMO® rule that "a unit without a verified LOT profile does not activate" — a CUBIQ™ cube is inert hardware until paired.
5. **Ship a levitation claim before it's real.** §III.4 is documented as a roadmap item, not a v.0 spec, precisely so this document cannot be read as overpromising.

**Physical bounds:** 65g and a 40mm frame keep worst-case kinetic energy from even a long jump low — this is a design constraint, not an afterthought. Table-edge cliff sensing exists specifically because the device is meant to live in homes with children and pets.

---

## VIII // NEW CONSUMER USE CASE — THE LONG-DISTANCE PARENT PING

*(Each iteration of this report adds one new consumer use case here. This is the first.)*

**The scenario:** An operator's parent lives in another city — or another country. They are both LOT® subscribers, both running the CUBIQ® digital session, and both have a CUBIQ™ cube on their desk. Neither is a heavy texter. The distance isn't emotional, it's just... distance.

**The feature:** A new LOT® platform action — *"Ping [name]'s Cube"* — available from a subscriber's contact list, gated to mutually-consented pairs (both parties must have explicitly linked their CUBIQ™ units to each other; this is never default-on). Sending a ping does not send a message. It sends a **long jump** — the highest-intensity gesture in the vocabulary (§V) — to the other person's physical desk, at the exact moment it's sent.

**Why this and not a text:** A text competes with every other notification on a phone that already has forty unread messages. A cube visibly moving on a parent's actual desk, in their actual home, cannot be buried in a notification tray. It also carries no content to misinterpret — there is no message to reply to, no expectation of a written response. It is pure presence: *I thought of you, right now, and I wanted you to feel it in the room you're sitting in.*

**The father-son thread:** This use case is the direct hardware expression of the origin story `LOT_ROBOTICS_COSMO.md` already tells — LOT® exists because Vadim wanted to be a better father to Kuzya. A parent working late, or a grown child living far from an aging parent, is exactly the relationship a screen notification serves worst and a felt, physical gesture serves best. The Long-Distance Parent Ping is not a feature bolted onto CUBIQ™; it is the reason CUBIQ™ jumps instead of just buzzing.

**Guardrails carried over from §VII:** rate-limited (one ping per pair per hour, to prevent it becoming a new form of pestering), mutual-consent gated, and — per §VII.2 — the jump is never aimed; it's a notification, not a beckoning gesture.

---

## IX // ROADMAP

| Version | Motion capability | Milestone gate |
|---|---|---|
| v.0 (this doc) | In-place hop, horizontal surface jump, long jump | Spec complete — not yet built |
| v.1 | Continuous jump-distance control (replacing the two-preset system), stick-slip creep as a first-class gesture | Physical prototype + firmware bring-up |
| v.2 | Multi-cube choreography — two or more paired cubes performing coordinated gesture sequences (e.g. a "call and response" jump pattern between the Long-Distance Parent Ping sender and receiver's cubes) | v.1 shipped to a pilot cohort |
| v.3 | Levitation via paired Quantum Base (§III.4) | v.2 shipped; Quantum Base engineering spec written separately |

This roadmap intentionally sequences levitation last. Every version before it must work as a grounded, safe, legible notification object first — levitation is a delight layer on a foundation that already has to earn trust sitting still on a table.

---

## X // TRADEMARK / IP NOTE

| Mark | Denotes | Status |
|---|---|---|
| CUBIQ® | The digital quantum-cubic session (existing, `LOT-CUBIQ-VISION.md`) | Pending, prior art within LOT® corpus |
| CUBIQ™ | The physical Quantum Cube hardware (this document) | New — to be filed as a distinct mark, paired but not merged with CUBIQ® |
| Quantum Base™ | The v.3 levitation accessory (§III.4, §IX) | Reserved, not yet filed — no product exists to attach it to |

---

## XI // CLOSING STATEMENT

Every notification LOT® has sent until now asked the operator to look at a screen. CUBIQ™ asks the desk to move instead.

The digital cubic — CUBIQ® — already produces a complete story in 5–11 minutes. CUBIQ™ is what happens when that story needs to reach someone who isn't looking at a screen at all: a badge unlocked while they were away from their desk, a milestone reached while they were making dinner, a parent they haven't called in a week. The cube jumps. They notice. Nothing was scrolled.

This is v.0. Nothing here has been built yet. What has been established is the vocabulary — three motions, four gestures, one new consumer use case, and a firmware-level promise that the thing sitting on your desk will never jump somewhere it can't see.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-CUBIQ-HARDWARE-v0
================================================================================
