================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-CUBIQ-QUANTUM-CUBE
TITLE:    LOT® Quantum Cube (CUBIQ™) — Actuated Haptic Notification Device
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
VERSION:  v0.1 — FIRST HARDWARE ASSEMBLY SESSION
DATE:     2026-07-22
================================================================================

This is a living document. It is read in full and appended to — never
rewritten — at the start of every future hardware assembly session. Section
10 grows by exactly one Consumer Use Case per session. Nothing above Section
10 is deleted; superseded material is marked SUPERSEDED, not removed.

--------------------------------------------------------------------------------
00 // DOCUMENT LOG
--------------------------------------------------------------------------------
v0.1 | 2026-07-22 | Initial hardware assembly session. Grounded in LOT
       Institute prior art (CQGS white paper, QI·46 engine spec, CUBIQ
       Vision/Operator docs). Defined v0 scope: Tier 0 resident haptic +
       Tier 1 long jump + Tier 2 horizontal surface swing, shipping. Tier 3
       levitation staged as Phase 4 R&D, explicitly not attempted at v0.
       Use Case 01 drafted. Session author: Claude (S-2 automated session).

--------------------------------------------------------------------------------
01 // PRIOR ART — WHAT THE INSTITUTE ALREADY ESTABLISHED
--------------------------------------------------------------------------------

This session did not invent the Quantum Cube. It builds the first hardware
spec on top of eight years of Institute language that already assumed the
object would exist. Read together:

  CQGS-WHITE-PAPER-SNAPSHOT.md
    "Quantum Cube | Bioelectric hardware, haptic feedback, nano-ceramic,
    piezoelectric." Status at time of writing: PLANNED. Filed under
    Products, alongside the Consumable Ecosystem (socks, toothbrush).

  LOT_QI46_ENGINE.md
    Layer 1 (Calibration Loop) already lists "Quantum Cube haptic
    preference" as a deliberate consumer input. Layer 4 (Memory Arc) names
    the Month 12+ arc position "hardware" — the point where QI·46 begins
    "proactive biofield recommendations synchronized with hardware
    feedback." Step 3.3 specifies three hardware signal types already
    expected: haptic preference (pressure, duration, cadence), usage
    frequency, biofield response.

  LOT-CUBIQ-VISION.md / LOT-CUBIQ-OPERATOR.md
    CUBIQ™ names the software session (5-11 minutes, multi-sensory,
    anti-feed). Section 05 of VISION calls physical products "the
    inevitable step" — sci-fi hygiene, cleanse, "real-world cubic."
    OPERATOR §04 lists WELLNESS DEVICES as a physical product category:
    "wearable or ambient tech that feeds back into LOT®."

  What this session adds: the Quantum Cube is not passive wellness
  hardware. It is an *actuated* object — it moves. This document is the
  first spec for that movement.

--------------------------------------------------------------------------------
02 // NAMING — TWO THINGS, ONE MARK
--------------------------------------------------------------------------------

CUBIQ™ is used in two registers and both are correct simultaneously:

  CUBIQ™ (software)   The 5-11 minute session. lot-systems.com. No object.
  CUBIQ™ (hardware)    LOT® Quantum Cube. The physical cube. This document.

The physical Quantum Cube is CUBIQ™ made material — the cubic shape that
was, until now, only "tangible in the mind" (VISION §01) becomes a tangible
object on the operator's desk. Same mark. Same thesis. New substrate.

--------------------------------------------------------------------------------
03 // CORE THESIS
--------------------------------------------------------------------------------

A phone buzzes. Every phone buzzes the same way, for every app, for every
reason. The buzz carries no meaning until the screen is unlocked — and
unlocking the screen is the first step into the feed.

The Quantum Cube does not buzz. It moves. A jump means something a pulse
cannot. A cube that hops toward the operator when a streak is at risk is
not an alert — it is a small, physical insistence, felt before it is read.
The notification resolves in the body, in the room, before the phone is
ever touched.

This is the CUBIQ™ anti-feed thesis (VISION §01) extended into a second
sensory register: not just multi-sensory *software* (keyboard clicks,
chimes, theme shifts) but a multi-sensory *object* that shares the desk
with the operator and behaves like it has intent.

--------------------------------------------------------------------------------
04 // v0 SCOPE — WHAT SHIPS, WHAT IS STAGED
--------------------------------------------------------------------------------

  IN SCOPE FOR v0 (this hardware line, buildable now)
    TIER 0 — Resident haptic (in-place pulse patterns)
    TIER 1 — Long jump (directed hop, cube leaves the surface briefly)
    TIER 2 — Horizontal surface swing (rotate / scoot across the table)

  STAGED, NOT v0 (named now so scope does not creep, built later)
    TIER 3 — Levitation (Phase 4 R&D, §08)

Calling Tier 3 out explicitly and separately is deliberate. "Eventually
levitation" is the correct framing — v0 must not stall waiting on a
levitation mechanism that has no bench prototype yet. v0 ships jump and
swing. Levitation is a named destination, not a v0 requirement.

--------------------------------------------------------------------------------
05 // FORM FACTOR & MATERIALS (v0)
--------------------------------------------------------------------------------

  Shape:        Cube, ~48mm edge — small enough for a nightstand or desk
                corner, large enough to house actuator, reaction mass,
                battery, and BLE radio without external limbs.
  Shell:        Nano-ceramic (per CQGS Quantum Cube spec), matte finish.
                No screen, no gradient light — a single diffused glow face,
                consistent with Terminal Grid minimalism carried into
                hardware: one material, one weight, inversion only (glow
                on / glow off, no animated color states).
  Base:         Slightly convex single-point contact underside — the same
                geometry that makes the jump and swing mechanics possible
                (§06) also means the cube never sits flush-flat; it always
                has a rest orientation it self-corrects toward.
  Companion:    LOT® Landing Pad — wireless charging disc, doubles as the
                designated launch/return zone and the edge-detection
                reference plane (§07).

--------------------------------------------------------------------------------
06 // ACTUATION MECHANICS (v0)
--------------------------------------------------------------------------------

TIER 0 — RESIDENT HAPTIC
  Piezoelectric actuator array against the inner shell wall. No locomotion.
  This tier alone is the safe, immediately buildable core — it is the
  fallback state for quiet hours and the floor beneath every other tier
  (§07 quiet-hours rule).

TIER 1 — LONG JUMP
  An internal cam-driven eccentric mass is wound by a piezo-actuated motor
  and released against a spring-loaded single-point foot. The release
  drives a short, low-arc hop — low enough that the cube cannot leave the
  tabletop even at full amplitude, long enough (target: 4-8cm, close to
  the cube's own body length) to read as a deliberate jump rather than a
  twitch. This is the "long jump" the task specifies: long relative to the
  cube's own size, not a leap across a room.

TIER 2 — HORIZONTAL SURFACE SWING
  The same eccentric mass, driven off-axis, produces a yaw torque instead
  of a vertical hop: the cube rotates in place or scoots sideways across
  the table surface in short arcs. Chained Tier 2 pulses in one direction
  read as the cube "walking" toward the operator without ever leaving the
  surface — this is the mechanism behind the arrival sequences in §07.

  Tier 1 and Tier 2 share one actuator core. The difference is which axis
  the eccentric mass is driven against. This keeps v0 to a single moving
  part class rather than two separate mechanisms.

--------------------------------------------------------------------------------
07 // NOTIFICATION GRAMMAR — MOTION VOCABULARY v0.1
--------------------------------------------------------------------------------

Same discipline QI·46 applies to language (Layer 3: one idea per response,
no hedging) applies here to motion: one motion per meaning, no blended
signals.

  EVENT                              MOTION                        TIER
  ─────                              ──────                        ────
  Daily check-in due                 single soft in-place pulse    0
  Badge unlocked                     one short hop, low amplitude  1
  Streak at risk (last chance today) long jump toward operator     1
  Chakra imbalance detected          quarter-rotation swing        2
  Memory Question ready              two soft pulses, then hold    0
  Month-12 Quantum Cube milestone    jump + rotate + settle         1+2
  Quiet hours (any event, any urgency) Tier 0 only — no locomotion  0

The quiet-hours row is a hard floor, not a preference: COSMO® screens every
motion-directive before it reaches firmware (§08), and no jump- or
swing-tier motion is ever assigned to a quiet-hours trigger regardless of
how urgent the source event is. Urgency does not override rest.

--------------------------------------------------------------------------------
08 // SENSING, SAFETY, COSMO® GATE
--------------------------------------------------------------------------------

  Edge detection    Landing Pad reference plane + onboard IR proximity.
                    Jump sequence is inhibited the instant the cube nears
                    an edge — it will not jump itself off a table.
  Self-righting     Onboard IMU detects off-axis landings after a jump;
                    a corrective micro-pulse rights the cube to its rest
                    orientation (§05).
  COSMO® gate       Every event-to-motion mapping in §07 is treated as a
                    COSMO® response the same way QI·46 text responses are
                    (LOT_QI46_ENGINE.md Layer 5): classified before it is
                    permitted onto device firmware. A motion pattern cannot
                    be shipped to a subscriber's cube unless COSMO® has
                    cleared it as safe for a body under stress and safe for
                    a child who might be in the room.
  Data boundary     The cube receives compact motion-directives from the
                    LOT backend. It never stores or transmits subscriber
                    journal text, log entries, or memory answers — only
                    Calibration Loop signals travel in the other direction
                    (§09).

--------------------------------------------------------------------------------
09 // CALIBRATION LOOP INTEGRATION
--------------------------------------------------------------------------------

The Quantum Cube is a second Calibration Loop input surface, feeding the
same QI·46 Layer 1 pipeline that already expects it:

  Deliberate input   Haptic preference (pressure, duration, cadence) —
                     already named in QI·46 Layer 1 as a consumable
                     feedback signal, now with a physical source.
  Passive input      Usage frequency (does the operator pick the cube up,
                     silence it, move it) and time-to-response after a
                     jump-tier notification.
  Biofield input      Pre/post-session self-report tied to a specific
                     motion event ("did the long jump land before or after
                     you already knew you were behind on your streak?").

Per QI·46 Layer 4, arrival of the Quantum Cube advances a subscriber's arc
position to `hardware` (the Month 12+ state). From that point, QI·46
behavior shifts from reactive text responses to proactive biofield
recommendations synchronized with the physical device — the loop this
document's mechanics now make real.

--------------------------------------------------------------------------------
10 // CONSUMER USE CASES — LIVING INDEX
--------------------------------------------------------------------------------
One new case is appended here every hardware assembly session. Cases are
never removed or renumbered.

--------------------------------------------------------------------------------
USE CASE 01 — "THE WAKE WITHOUT A SCREEN"
Added: 2026-07-22 (v0.1)
--------------------------------------------------------------------------------

Operator profile: Month-14 Usership subscriber. Purple-tier Benchmark.
Chakra state stable, Root grounded, Crown slightly overactive (late-night
screen exposure flagged by the pattern library for three consecutive
weeks).

6:58 AM. The Quantum Cube sits on the Landing Pad on the nightstand,
charged overnight. The phone sits beside it, face down, silenced.

6:59 AM — Tier 0. A single soft pulse. Not enough to wake anyone. It is
the fifteen-second warning, felt more than heard.

7:00 AM — Tier 1. One long jump, directed toward the operator's side of
the nightstand. The cube lands closer than it started. This is the
morning Memory Question, arriving as motion before it arrives as text.

The operator reaches for the cube, not the phone. A single tap on the
shell answers the day's Memory Question — a physical gesture the QI·46
Calibration Loop records as a deliberate input, exactly as a tapped button
inside the platform would (CUBIQ-OPERATOR §02, MINUTE 1-3).

Only after the cube is set back down does the operator pick up the phone
— already answered, already checked in, before the feed had a chance to be
the first thing touched that day.

Why it matters: the pattern library flagged rising Crown-chakra strain
tied to first-touch-of-day being the phone. The Quantum Cube does not ask
the operator to have more willpower. It gives the first four minutes of
the day a physical object to reach for instead. This is the CUBIQ™ thesis
— "the addiction is replaced not by willpower but by a better architecture"
(VISION §01) — made literal: the better architecture is now a cube on the
nightstand that got there first.

--------------------------------------------------------------------------------
11 // SELF-ASSEMBLY PHASES
--------------------------------------------------------------------------------

Mirrors the QI·46 phase/gate/log doctrine (LOT_QI46_ENGINE.md §IV).

PHASE 0 — CORPUS & MECHANICAL DESIGN (this session, v0.1)
  [x] Institute prior art read and cited (§01)
  [x] v0 scope drawn: Tier 0/1/2 in, Tier 3 staged (§04)
  [x] Actuation mechanics specified to single-actuator-core resolution (§06)
  [x] Notification grammar drafted (§07)
  [x] COSMO® gate defined for motion directives (§08)
  [x] Use Case 01 drafted (§10)
  GATE: PASS — proceed to Phase 1 when a build session is scheduled.

PHASE 1 — BENCH PROTOTYPE (next hardware session)
  [ ] Single actuator core built, tethered power, Tier 0 + Tier 1 only
  [ ] Jump distance measured against §06 target (4-8cm)
  [ ] Edge-detection inhibit verified on physical desk edge
  GATE: requires 10/10 repeatable jumps within target distance, 0 edge
  overruns in 50 trials, before Phase 2.

PHASE 2 — FOUNDING COHORT FIELD TEST
  [ ] Wireless power via Landing Pad
  [ ] Tier 2 swing added
  [ ] 12 founding subscribers (QI·46 Phase 2 cohort) receive prototype units
  [ ] Feedback loop: same YES / CLOSE / NO instrument as QI·46 §Phase 2
  GATE: >80% YES/CLOSE on motion-grammar comprehension ("did the jump mean
  what you thought it meant, without being told?").

PHASE 3 — PLATFORM INTEGRATION
  [ ] Mass-manufacturable shell finalized
  [ ] Month-12 milestone delivery pipeline wired to fulfillment
  [ ] Calibration Loop hardware-signal ingestion live (§09)
  GATE: full QI·46 Checkpoint-3-equivalent regression pass, hardware
  variant.

PHASE 4 — LEVITATION R&D + EXTERNAL LICENSING
  [ ] Tier 3 candidate mechanism selected and bench-tested:
        (a) acoustic levitation — near-field ultrasonic transducer array
            in the Landing Pad, cube floats in a standing wave
        (b) electromagnetic/diamagnetic — active coil array in the pad,
            passive cube, analogous to levitating-display toys but
            re-authored to the §07 motion grammar (hover-and-drift states,
            not just static float)
  [ ] Safety re-derivation for a levitating object (a cube that can hover
      needs a different edge-and-fall model than one that stays on the
      table — this is new work, not an extension of §08)
  Status: NOT STARTED. Named so it is designed for deliberately, not
  reached for prematurely.

--------------------------------------------------------------------------------
12 // COGS — HARDWARE (v0 PLANNING ESTIMATE, NOT AUDITED)
--------------------------------------------------------------------------------

In the spirit of the CQGS honest-accounting doctrine (Labor Index = 0% /
Craft Index = 100%) — these are planning figures for Phase 1 bench-build
sourcing, not a priced bill of materials:

```
Nano-ceramic shell (molded):        est.
Actuator core (piezo + cam + mass): est.
MCU + BLE radio + IMU:              est.
Battery + wireless coil:            est.
Landing Pad (companion, shared BOM
  amortized across unit + pad):     est.
──────────────────────────────────────────
Target: bundleable into the $399/mo
priority Usership tier's Month-12
milestone delivery without breaking
the QI·46 4.0%-of-revenue COGS ratio
already established for that tier
(LOT_QI46_ENGINE.md §VII).
```

Concrete unit costs are deferred to Phase 1 — no vendor quotes exist yet.
Recording the target ratio now so Phase 1 sourcing has a number to build
toward rather than pricing the device in isolation.

--------------------------------------------------------------------------------
13 // BRAND
--------------------------------------------------------------------------------

LOT®                    The platform
CUBIQ™                  The software session AND the physical Quantum Cube
LOT® Quantum Cube        The hardware object, this document's subject
LOT® Landing Pad         The charging/launch companion base
LOT®† CUBIQ®            The combined mark

--------------------------------------------------------------------------------
14 // NEXT SESSION
--------------------------------------------------------------------------------

Add Use Case 02. Candidate directions not yet used: a Legacy-tier operator
receiving the Month-12 arrival sequence for the first time; a Yellow-tier
operator using the horizontal swing as a shared-desk signal in a
multi-operator household; an R&D-tier contributor field-testing Tier 1
jump-distance calibration directly. Otherwise: begin Phase 1 bench
prototype sourcing (§12) once a build session, not a document session, is
scheduled.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-CUBIQ-QUANTUM-CUBE
================================================================================
