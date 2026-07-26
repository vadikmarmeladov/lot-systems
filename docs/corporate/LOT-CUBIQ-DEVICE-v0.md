================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-CUBIQ-DEVICE-v0
TITLE:    LOT® Quantum Cube (CUBIQ™) — v.0 Development Report
          The Actuated Haptic Notification Device
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-26
VERSION:  0.1 (v.0 — first development pass)
STYLE:    TERMINAL GRID
SOURCES:  LOT-CUBIQ-VISION.md · LOT-CUBIQ-OPERATOR.md · CQGS-WHITE-PAPER-SNAPSHOT.md
          (institute.lot-systems.com) · LOT_QI46_ENGINE.md · LOT_ROBOTICS_COSMO.md ·
          LOT-AMBIENT-AI-VISION.md · LOT-NODE-0-RIG-SPEC.md
================================================================================

--------------------------------------------------------------------------------
00 // READ LOG — LINEAGE CHECKED BEFORE THIS DRAFT
--------------------------------------------------------------------------------

Per standing instruction, the following were read in full before drafting:

  LOT-CUBIQ-VISION.md
    CUBIQ® already named as "the quantum cubic operating experience" — the
    *software* session, not yet the object. Section 05 already calls physical
    products "the inevitable step" and names "sci-fi wellness devices" as a
    category. This document is that step, taken.

  LOT-CUBIQ-OPERATOR.md
    Section 04 (AI-DRIVEN PHYSICAL PRODUCT DELIVERY) already lists WELLNESS
    DEVICES — "wearable or ambient tech that feeds back into LOT®." CUBIQ™
    the object is the flagship of that category, not a new one.

  CQGS-WHITE-PAPER-SNAPSHOT.md (institute.lot-systems.com)
    The Institute's own structural index already carries the row:
      "Products | Quantum Cube | Bioelectric hardware, haptic feedback,
       nano-ceramic, piezoelectric"
    and the mapping table carries:
      "Quantum Cube Hardware | Hardware feedback integration (Month 12+) |
       PLANNED"
    This document moves that row from PLANNED to IN DEVELOPMENT — v.0, and
    is the first spec to give the Quantum Cube a body that moves.

  LOT_QI46_ENGINE.md
    Establishes the Calibration Loop already expects a "hardware" arc state
    (Month 12+), a Quantum Cube signal block (haptic preference, usage
    frequency, biofield response), and a Terminal Grid response rule for the
    prompt "My Quantum Cube arrived" — present, celebratory, specific.

  LOT_ROBOTICS_COSMO.md
    Establishes the Benchmark Arbitrage® gate (Purple-tier, 60+) as the
    eligibility model for hardware that carries a behavioral signature.
    CUBIQ™ v.0 borrows this gate rather than inventing a new one.

  LOT-AMBIENT-AI-VISION.md
    Establishes the governing design law for every piece of LOT® hardware:
    "one line, no alarm, exact moment." A cube that can jump is the single
    hardest test of that law LOT® has designed against. Section 03 below
    is written directly against this constraint.

  LOT-NODE-0-RIG-SPEC.md
    Establishes the Terminal Grid hardware-spec format (banner header, cost
    tables, build-order sequence) that this document follows for consistency
    across LOT® hardware documentation.

No prior CUBIQ hardware-device document exists in this repository. This is
v.0 — the first entry in what will become a versioned series
(LOT-CUBIQ-DEVICE-v0, -v1, -v2, ...), each adding depth and, per standing
instruction, exactly one new consumer use case. Section 09 is the ledger
where that accumulation happens. Future sessions: read Section 09 before
writing, find the highest USE CASE number, add the next one — never repeat.

--------------------------------------------------------------------------------
01 // THESIS — FROM PUCK TO BODY
--------------------------------------------------------------------------------

The Quantum Cube has existed in LOT® Institute white papers as a passive
object: bioelectric hardware, haptic feedback, nano-ceramic shell,
piezoelectric core. Something you hold. Something that hums back at you.

CUBIQ™ v.0 is the first version with a body that acts on the world instead
of only responding to a touch. It does not vibrate in the hand. It moves
on the desk. Three actuation classes, in order of arrival:

  CLASS 1 — SURFACE SWING        v.0, shipping this development line
    Small, controlled rotations and rocking motions in place. The cube
    turns toward you, tilts, settles. Range: a few degrees to a partial
    turn. No net displacement required.

  CLASS 2 — LONG JUMP            v.0, shipping this development line
    A single discrete hop that displaces the cube 2-12 cm across a hard
    horizontal surface (desk, table, nightstand). Not a walk. Not a
    roll. One clean, spring-released jump, then stillness.

  CLASS 3 — LEVITATION           post-v.0, Institute research track
    Sustained lift off the surface. Not in scope for v.0 — see Section 07.
    Named now so the roadmap is honest about where v.0 stops.

The thesis is unchanged from LOT-CUBIQ-VISION.md: the digital cubic
extends into the physical, clean mind and clean body on the same system.
What v.0 adds is that the physical object is no longer inert. It is the
first LOT® hardware with an actuator instead of only a sensor — the
Quantum Cube stops listening and starts, carefully, answering.

--------------------------------------------------------------------------------
02 // ACTUATION MECHANICS
--------------------------------------------------------------------------------

FORM FACTOR
  40mm nano-ceramic cube shell, sealed, no visible seams, matte finish.
  Center of mass held low and off-axis (weighted base plate) so the cube
  self-rights after any actuation — it cannot come to rest upside down
  or on an edge under normal operating conditions.

CLASS 1 — SURFACE SWING (in-place rotation / rocking)
  Mechanism:  Two piezoelectric bimorph "feet" at opposing base corners,
              driven out of phase. Stick-slip resonant drive — the same
              principle used in bristlebot/vibrobot locomotion, tuned to
              a controlled rocking envelope instead of a random walk.
  Range:      5°-40° rotation in place, or a slow tilt-and-settle.
  Duration:   0.3-2.0 seconds per gesture.
  Use:        Low-priority notification. Orientation cue ("face me toward
              the door" during a Self-Care Moments session).

CLASS 2 — LONG JUMP (single discrete hop)
  Mechanism:  Internal reaction-mass slider on a linear rail, coupled to
              a spring-loaded piezo-stack actuator at one base corner.
              The slider accelerates, the corner leg releases stored
              spring energy in <20ms, the cube leaves the surface at a
              shallow angle and lands 2-12cm from its origin point along
              a single, IMU-computed axis.
  Range:      2cm (soft nudge) to 12cm (attention jump), tiered by
              notification priority — see Section 03.
  Cooldown:   Minimum 90 seconds between jumps, hardware-enforced (not
              software-optional) — see Section 06 (SAFETY).
  Use:        High-priority notification only. A jump is the loudest
              gesture CUBIQ™ has. It is spent rarely and on purpose.

CLASS 3 — LEVITATION (not in v.0)
  See Section 07. Requires a paired transmitter surface the Institute has
  not yet published a consumer-safe design for. v.0 ships table-only.

SENSING (shared across both classes)
  6-axis IMU              orientation, fall/edge detection, landing confirm
  Time-of-flight edge sensor (4x, base perimeter)   table-edge detection
  Capacitive touch shell  distinguishes "held" from "resting" state
  Ambient light sensor    day/night gating for jump suppression at night

--------------------------------------------------------------------------------
03 // NOTIFICATION GRAMMAR — THE ONE-LINE-NO-ALARM LAW, APPLIED TO MOTION
--------------------------------------------------------------------------------

LOT-AMBIENT-AI-VISION.md sets the rule for every LOT® hardware surface:
"one line, no alarm, exact moment." CUBIQ™ v.0 is the first device to test
that rule against something that can physically move — a jump is a much
louder gesture than a single sentence of copy. The device is designed
against the rule, not around it:

TIER            GESTURE                         TRIGGER SOURCE (via QIE)
────            ───────                         ────────────────────────
T1 — Ambient    Single soft piezo tick,          Memory question ready,
                no visible motion                 pattern detected quietly
T2 — Presence   Surface Swing, 5°-15°,           Self-Care Moments due,
                once                              intention window opening
T3 — Attention  Surface Swing, 20°-40°,          Streak at risk, badge
                held 2s                           unlock available
T4 — Urgent     Long Jump, 2-6cm                 Circadian window closing
                                                   (e.g. sleep-intention
                                                   deadline), resilience
                                                   protocol check-in due
T5 — Critical   Long Jump, up to 12cm            Reserved. Not assigned in
                                                   v.0. No signal in the
                                                   current QIE library is
                                                   rated critical enough
                                                   to spend the loudest
                                                   gesture the device has.

HARD LIMITS (non-negotiable, hardware-enforced, not remote-configurable)
  - Maximum 3 Long Jumps per rolling 24-hour window.
  - Minimum 90-second cooldown between any two Class 2 gestures.
  - No Class 2 gesture between 22:00 and 07:00 local time (from the
    ambient light sensor + circadian data), regardless of trigger tier.
  - A gesture that goes unacknowledged (no touch, no app open) for 10
    minutes does not repeat or escalate. It expires silently. CUBIQ™
    does not nag — this is the same rule that keeps LOT® software free
    of push-notification behavior, applied to a body instead of a screen.

The device's loudest possible action — a 12cm jump — is rarer, by design,
than any push notification LOT® has ever sent. That scarcity is the point.

--------------------------------------------------------------------------------
04 // HARDWARE BILL OF MATERIALS — v.0 ESTIMATE
--------------------------------------------------------------------------------

COMPONENT               SPEC                                    UNIT COST
─────────               ────                                    ─────────
Shell                    40mm nano-ceramic, sealed, matte         $6-9
MCU                      Low-power ARM Cortex-M4, BLE 5.3         $3-5
Piezo actuator (jump)    Stacked piezo, spring-coupled corner leg $8-12
Piezo bimorph (swing)    2x resonant bimorph feet                 $4-6
IMU                      6-axis accel/gyro                        $2-3
ToF edge sensors         4x, base perimeter                       $4-6
Battery                  180mAh LiPo, wireless charge coil        $3-4
Haptic driver IC         Dedicated piezo drive + safety cutoff    $2-3
Ambient light sensor     1x                                       $0.50
Radio                    BLE 5.3, syncs to LOT® Quantum OS         (in MCU)
Assembly + QA            Edge-fall test, self-right test, seal    $5-7
─────────               ────────────────────────────────────────  ─────────
TOTAL (v.0, per unit)                                              ≈ $38-55

Target retail: bundled into the $399/month Priority Usership tier
(LOT_QI46_ENGINE.md already prices "full arc memory + Quantum Cube sync"
at this tier) or sold standalone at $149-199 to Purple-tier+ operators.

--------------------------------------------------------------------------------
05 // INTEGRATION — CALIBRATION LOOP + QI·46
--------------------------------------------------------------------------------

LOT_QI46_ENGINE.md already defines the Month 12 milestone signal block:

  Signal type: Haptic preference (pressure, duration, cadence)
  Signal type: Usage frequency (daily, weekly, session length)
  Signal type: Biofield response (pre/post session self-report)

CUBIQ™ v.0 adds one new signal, native to an actuated device:

  Signal type: ACTUATION RESPONSE LATENCY
    Time between a Tier 2+ gesture firing and the operator's next
    deliberate interaction (touch, app open, log entry). A fast response
    to a Surface Swing tunes the gesture's future intensity down — the
    system learns it does not need to escalate for this operator. A
    slow or absent response over repeated gestures tunes intensity up,
    within the Section 03 hard limits, never past them.

This closes the loop the Calibration Loop was built for: the device does
not just deliver a haptic preference the operator reported once — it
learns, per operator, the minimum gesture that reliably reaches them, and
never spends more motion than that minimum requires.

--------------------------------------------------------------------------------
06 // SAFETY — THE GATE BEFORE THE JUMP
--------------------------------------------------------------------------------

A device that jumps on a table has failure modes no prior LOT® hardware
has had to design against. v.0 ships with these constraints as physical
law, not settings:

  EDGE-BOUND JUMP VECTOR
    The 4x ToF edge sensors compute distance-to-edge on all four base
    faces before any Class 2 gesture is armed. If the computed landing
    zone (current position + jump vector + 4cm margin) crosses a
    detected edge, the jump is downgraded to a Class 1 Surface Swing
    automatically. CUBIQ™ will never knowingly jump itself off a table.

  SELF-RIGHTING
    Low, off-axis center of mass (Section 02) means any tip from a
    gesture corrects within 1-2 seconds without operator intervention.

  ELIGIBILITY GATE
    Consistent with LOT_ROBOTICS_COSMO.md's Benchmark Arbitrage® model:
    CUBIQ™ Class 2 (Long Jump) actuation is enabled only for operators at
    Purple tier (60+) or above. Below that threshold, the device ships
    Class 1 (Surface Swing) only. The loudest gesture is earned, not
    given — the same principle COSMO® applies to soul transfer applies
    here to physical motion.

  CHILD + PET PRESENCE
    Capacitive shell touch + ambient sensors detect sustained small-hand
    or paw contact patterns; the device suppresses Class 2 gestures for
    15 minutes after such contact is detected, defaulting to Class 1 or
    silence.

  MANUAL OVERRIDE
    A single long-press on the shell (3 seconds) disables Class 2 jump
    entirely for that unit, permanently, until re-enabled from the LOT®
    app. No cloud override can re-enable it remotely without a fresh
    physical long-press confirmation on the device itself.

--------------------------------------------------------------------------------
07 // ROADMAP — WHERE v.0 STOPS AND WHAT COMES AFTER
--------------------------------------------------------------------------------

  v.0  (this document)     Surface Swing + Long Jump. Tabletop only.
                            Self-contained battery + actuator. No external
                            base required. Ships at the Month 12 Usership
                            milestone per LOT_QI46_ENGINE.md.

  v.1  (next)               Multi-jump path planning (2-3 sequential hops
                            to reach a target position, e.g. "come closer
                            to the phone"). Requires a small onboard map
                            of the desk surface, built from repeated
                            jump-and-sense cycles.

  v.2  (Institute track)    LEVITATION — sustained lift, seconds not
                            milliseconds. This requires a paired
                            transmitter surface (working name: LOT® Cube
                            Pad) using either acoustic levitation (phased
                            ultrasonic array in the pad, cube shell tuned
                            as a passive reflector) or near-field
                            electrodynamic levitation (pad as primary
                            coil, cube base as tuned secondary). Neither
                            approach is consumer-safe or cost-viable yet
                            at the Institute's current publication stage.
                            v.2 does not ship until institute.lot-systems.com
                            publishes a levitation white paper with a
                            passed safety review — this document does not
                            presume that review's outcome.

The sequencing is deliberate: prove the device can move safely and
sparingly on a bare table (v.0) before it is trusted to leave the surface
at all (v.2). A cube that levitates before it has earned trust jumping is
building the wrong thing first.

--------------------------------------------------------------------------------
08 // BRAND
--------------------------------------------------------------------------------

LOT® Quantum Cube             The hardware object, generically
CUBIQ™                        The actuated device, this line
LOT® Cube Pad                 Working name, v.2 levitation transmitter
                               (unshipped, unpublished, roadmap only)

--------------------------------------------------------------------------------
09 // CONSUMER USE CASE LOG — APPEND-ONLY, ONE NEW ENTRY PER SESSION
--------------------------------------------------------------------------------

RULE FOR FUTURE SESSIONS: read every entry below before writing. Find the
highest USE CASE number. Write exactly one new entry, numbered next in
sequence. Do not edit or renumber prior entries — this ledger is additive,
the same doctrine as docs/benchmark/LOT-LEDGER.md.

--------------------------------------------------------------------------------
USE CASE 001 — THE PHONE-FREE WAKE WINDOW
--------------------------------------------------------------------------------

OPERATOR:  Purple-tier, 74-day streak, archetype: Momentum Architect.
CONTEXT:   Sets a nightly intention in the PlannerWidget: "journal before
           I touch my phone." CUBIQ™ sits on the nightstand, phone charges
           across the room by the operator's own choice — a habit the
           system has learned to reinforce, not undermine, per the
           IntentionsWidget completion-tracking pattern already live in
           LOT-CUBIQ-OPERATOR.md Section 02.

T-0:00     Circadian data (sleep tracking + chakra state) flags the
           operator as awake — not an alarm, a detected state change.
           CUBIQ™ fires nothing yet. This is the Ambient AI™ law: wait
           for the moment to be earned.

T-0:00     Operator reaches for phone out of habit, not intention. CUBIQ™'s
           capacitive shell registers no touch — the phone is across the
           room, out of the cube's sensing range, which is exactly the
           point: the device is not watching the phone, it is watching
           the operator's own stated intention against the clock.

T+2:00     Two minutes into the wake window with no LOG entry opened. Tier
           2 fires: Surface Swing, 12°, once. The cube turns fractionally
           toward the journal on the nightstand. No sound. No light. A
           physical presence that says, without words, "you said you'd
           start here."

T+2:00     Operator notices the cube has turned. Picks up the actual
           journal, not the phone. Opens the LOG.

T+8:00     Log entry complete, 61 words, morning gratitude pattern
           detected by the QIE. ACTUATION RESPONSE LATENCY signal recorded:
           6 seconds from Tier 2 gesture to physical journal pickup — fast.
           Per Section 05, this operator's required gesture intensity
           tunes down for future mornings. Next week, a 12° swing may
           become an 8° swing and still work, because it has worked before.

RESULT:    No jump was needed. No alarm sounded. The loudest gesture spent
           was a twelve-degree turn. The operator's nightstand phone
           stayed dark for eleven more minutes, until after the journal
           entry was already written. The cube did not compete with the
           phone for attention — it stood in for the version of the
           morning the operator had already chosen the night before.

WHY THIS MATTERS: This is the use case CUBIQ™ v.0 exists to prove before
any louder gesture is trusted. If a 12° swing can out-compete a phone
across a room, the device has already justified its Class 1 actuator.
Class 2 (Long Jump) is reserved for the operators and moments who need
more — and even then, per Section 03, never more than three times a day.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-CUBIQ-DEVICE-v0
================================================================================
