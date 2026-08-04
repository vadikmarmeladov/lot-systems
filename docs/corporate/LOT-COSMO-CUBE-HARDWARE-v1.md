<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-HARDWARE-v1
TITLE:    COSMO® Cube — Hardware Computer, Physical & Industrial Design Spec v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
INVENTOR: VADIK MARMELADOV — COSMO® CIA
DATE:     2026-08-02, LANDED 2026-08-04
VERSION:  1.0 — CARRIED FORWARD FROM claude/brave-lamport-7d1fy9 (d90febd4),
          LANDED on claude/brave-lamport-jrp0e5 without content changes.
          Substance verified against live repo before landing — see LOT-SR-
          20260804-01.md Section 01 for what was re-checked and why nothing
          here needed rewriting.
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

  docs/benchmark/LOT-MANIFEST.md, line 31
    "COSMO Hardware | brave-lamport-t9z5u8 | c7d353ef | 14/14 | BEST | 7 |
    +2610 | COSMO® Cube — complete hardware computer design v1.0" — the
    name COSMO® Cube and the "hardware computer" designation are already
    on record, tagged BEST and marked incorporated into master as of
    2026-06-27 (line 190-192). No standalone spec document survived that
    round — the design lived only as a manifest line item. This document
    is the first persisted spec for that name, written from a much more
    detailed brief. It does not invent the name; it fills a gap.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md, line 49-56
    Names COSMO® Cube explicitly as "a general-purpose hardware computer"
    and draws the line this document must respect: "CUBIQ™ is LOT®'s
    object: a notification body, not a computer... The two are related
    by lineage (father/son, LOT®/COSMO®) and should share no naming
    collision going forward." CUBIQ™ v.0 is a 45mm cube that performs a
    physical hop gesture. COSMO® Cube (this document) is a flat 40mm
    slab that runs firmware, holds a camera and screen, and connects to
    the LOT API. Same lineage, different object, no collision.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    Prior hardware spec in this repo (the NODE-0 inference server). Not
    the same object — that is a desk-side GPU rig; this is a pocket
    device — but its Terminal Grid table format (component / spec /
    cost / rationale) is the format this document and its sibling BOM
    reuse for consistency across LOT's hardware line.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    The COSMO® brand's other hardware track — personal robotics, Soul
    Sync Protocol, target 2028-2029. That is a distinct, much later
    product. COSMO® Cube is COSMO®'s near-term hardware computer, not a
    robot; it shares the brand, not the product.

  Brief, as given by S-2 (2026-08-02), 19 numbered requirements. Every
  section below traces back to a specific line of that brief; the
  mapping is recorded inline so a future session can audit fidelity.

  LANDING NOTE (2026-08-04) — a near-identical 19-point brief fired again
  as a scheduled session two days after this document was first written,
  on a different disposable branch (claude/brave-lamport-jrp0e5). Per
  brief item 8 ("compress the information in each session"), that session
  did not re-derive this spec from zero. It re-verified every code
  citation in the companion software document
  (docs/technical/LOT-COSMO-CUBE-SOFTWARE.md, Section 00) against the
  live tree, found all of them still accurate, and landed this file
  set here unchanged rather than writing a sixth near-duplicate version.
  git history shows this exact brief (or a close variant of it) has now
  produced spec documents on at least 20 prior branches since 2026-05-26,
  none previously reaching a branch pushed with intent to reach master —
  see LOT-SR-20260804-01.md Section 01 and docs/assembly/LOT-DOCTRINE.md
  for the doctrine clause this finding produced.

--------------------------------------------------------------------------------
01 // WHAT v1 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  v1 IS:
    - A pocket/desk hardware computer: MCU + camera + screen + button +
      weather sensor + wireless charging, in a two-piece stainless steel
      shell, that receives AI-authored notifications from lot-systems.com
      and reports one signal (the Copy button) back to the site's Log
      tab. (Brief items 2, 4-6, 12, 14-19.)
    - A 100-unit pilot production run through PCBWay — PCB fab, CNC
      stainless steel machining, and turnkey assembly all sourced from
      one vendor to keep the pilot's supply chain small enough for one
      inventor to manage. (Brief items 1, 13.)
    - Documented as four SEPARATE artifacts — hardware (this document),
      firmware, software, and BOM/roadmap — because the brief explicitly
      calls for separate documents (item 11) and because firmware,
      software, and hardware iterate on independent timelines even when
      the physical unit count (100) does not change.

  v1 IS NOT:
    - A general-purpose "computer" in the desktop sense. It runs one
      firmware image with one job: render notifications, capture
      snapshots on demand, read ambient weather, and report the Copy
      signal. "Hardware computer" (manifest's own phrase) means
      general-purpose SILICON — an MCU capable of running arbitrary
      logic — not a general-purpose USE. This keeps v1 buildable by one
      inventor in one pilot run.
    - A CUBIQ™ replacement. It does not move, hop, or actuate. Its
      notification language is a screen and (optionally) sound/haptic
      buzz, not motion. See Section 00 for the line CUBIQ™ vs. COSMO®
      Cube must not cross.
    - Voice-controlled, speaker-equipped, or network-hosting. v1 is a
      client of lot-systems.com over Wi-Fi; it holds no user data beyond
      a pairing token and does not run a local server.

  THE PRINCIPLE
    Ship the smallest true object first: a slab that shows you what LOT
    knows, watches the room enough to answer "what does it look like
    here," and gives you exactly one button that talks back. Everything
    else — second sensors, second buttons, actuation — is a v2+ line
    item, not a v1 requirement smuggled in early.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM  (brief items 3, 4, 17, 18)
--------------------------------------------------------------------------------

  OVERALL FORM     Flat silver square slab, 40mm x 40mm x 5mm
                    (brief item 4, verbatim: "flat silver square 4x4cm
                    x 5mm height"). Two-piece stainless steel body
                    (brief item 3) — a top shell and a bottom shell,
                    split at the parting line described below.

  SIDE A (FRONT)    Polished mirror-finish stainless steel (brief item
                    17). No visible components. This is the face that
                    sits on a desk or is held up like a coin — a plain
                    reflective surface until it needs to speak.

  SIDE B (BACK)     Camera, screen, and button (brief item 18), housed
                    in a brushed (non-mirror) stainless finish so the
                    active face reads visually distinct from the
                    passive one:
                      - Camera: center-top, small lens bezel, brief
                        item 5.
                      - Screen: center, the "simple screen" that shows
                        autonomous notifications (brief item 5 of the
                        closing paragraph — "Coffee time!" example).
                      - Button: bottom edge, labeled COPY (brief item
                        16) — a single physical control on the whole
                        device.

  PARTING LINE      The two stainless shells split along the 40x40mm
                    perimeter, mid-height (~2.5mm from each face), with
                    a machined step-lap joint (not a flat butt joint) —
                    a step-lap keeps dust and moisture from tracking
                    straight through the seam and gives the two halves
                    a mechanical register so they can't be reassembled
                    misaligned. Held closed with 4x M1.4 stainless
                    countersunk screws, one per corner, driven from the
                    Side-A (mirror) face — the only fasteners visible,
                    and only when you already know to look.

  WEIGHT TARGET     <45g fully assembled. At 5mm height and stainless
                    walls thin enough to leave room for the PCB stack
                    (Section 03), mass comes almost entirely from the
                    two shells — every gram argued for, same discipline
                    LOT-CUBIQ-QUANTUM-CUBE-v0.md applies to its shell.

  CHARGE INTERFACE  Wireless (Qi-class inductive) through the Side-B
                    base (brief item 19/12 — "wireless charger" listed
                    twice in the brief, once as a component and once as
                    the closing requirement; both are satisfied by one
                    receiver coil). No physical charge port — a sealed
                    stainless shell with no port opening is also the
                    simplest path to an IP-rated seam.

  WEATHER SENSOR    A single combined temperature / humidity / pressure
                    sensor (brief item 14), vented through a
                    micro-perforation pattern laser-cut into the Side-B
                    brushed face, positioned away from the camera and
                    screen so body heat from the electronics underneath
                    is baffled from the sensor's air path.

--------------------------------------------------------------------------------
03 // INTERNAL STACK  (brief items 5, 6, 14, 15, 19)
--------------------------------------------------------------------------------

  Reading bottom (Side B) to top (Side A) inside the 5mm envelope:

    LAYER                          THICKNESS   NOTES
    ─────                          ─────────   ─────
    Stainless shell (Side B)       0.4mm       Brushed finish, vents
    Camera module (raw, no lens
      housing bump)                1.2mm       Faces outward through a
                                                small optical window
    Main PCB (MCU + sensor + Qi
      receiver + battery mgmt)     0.8mm       4-layer, JLC/PCBWay
                                                standard stackup
    Battery (thin-format LiPo)     1.6mm       Flat pouch cell, sized
                                                to the 40x40mm envelope
                                                minus keep-out zones
    Screen module (thin LCD/
      e-paper + digitizer-free)    0.6mm       No touch layer — the
                                                COPY button is the only
                                                input, by design
    Stainless shell (Side A)       0.4mm       Mirror-polished, plain
    ─────                          ─────────
    TOTAL                          5.0mm       Matches brief item 4
                                                exactly; no slack budget

  This is a tight stack-up, and it is meant to be — the 5mm dimension in
  the brief is a design constraint, not a suggestion, and the BOM
  (LOT-COSMO-CUBE-BOM.md) selects every component against this envelope
  first and against cost second.

  AI-GRADE SENSOR NOTE (brief item 15 — "AI grade off-the-shelf
  sensors"): v1 uses commodity, well-documented sensor silicon (the
  same class already named for weather in docs/corporate/LOT-TERMINAL-M2M.md's
  "Multi-Sensor Array" example — temperature, humidity, pressure) rather
  than bespoke sensor ASICs. "AI grade" here means selected for clean,
  well-characterized output a model can consume directly (documented
  noise floor, factory calibration, standard register interface) — not
  a marketing tier. See BOM Section 02 for the specific part.

--------------------------------------------------------------------------------
04 // THE NOTIFICATION LANGUAGE  (brief items 2, 16, and closing paragraph)
--------------------------------------------------------------------------------

  COSMO® Cube's screen is a pager, not a feed. It shows exactly one
  thing at a time: the latest autonomous notification pushed from
  lot-systems.com, in the voice already established across the LOT
  corpus (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04's anti-feed thesis
  applies here too, expressed visually instead of haptically):

    EXAMPLE NOTIFICATION      TRIGGER (server-side)
    ────────────────────      ─────────────────────
    "Coffee time!"            Circadian/behavioral pattern match
                               (brief's own example)
    "Weather turning — bring
     a layer"                 Local weather sensor reading crossed a
                               threshold, correlated with calendar
    "Memory question ready"   Same Memory Engine trigger CUBIQ™ uses,
                               shown as text instead of felt as a nudge

  THE COPY BUTTON (brief item 16)
    A single physical button on Side B. Pressing it does not copy
    device data anywhere — it sends one signal back to
    lot-systems.com, which appends one line to the operator's Log tab
    (the same Log tab a human types into on lot-systems.com today).
    The gesture is: "I saw this, note that I saw it." A physical
    acknowledgment gesture with no screen-side confirmation UI needed —
    the confirmation is that the entry now exists in the Log tab,
    checkable from any device. Full protocol in
    docs/technical/LOT-COSMO-CUBE-SOFTWARE.md Section 02.

--------------------------------------------------------------------------------
05 // LOT API CONNECTION  (brief item 6)
--------------------------------------------------------------------------------

  COSMO® Cube is a thin client of the existing lot-systems.com backend.
  It does not run a local model, hold a user profile, or make
  autonomous decisions about what to show — the "AI-powered site"
  (brief item 2) is lot-systems.com itself; the device renders what it
  is told. Full request/response shapes, auth, and the Copy-button
  webhook are specified in docs/technical/LOT-COSMO-CUBE-SOFTWARE.md,
  which is the connector document brief item 6 calls for and item 11
  requires to be separate from this one.

--------------------------------------------------------------------------------
06 // DOCUMENT SET  (brief items 7, 8, 9, 10, 11)
--------------------------------------------------------------------------------

  This hardware spec is one of five artifacts produced this session,
  each separate per brief item 11:

    THIS DOCUMENT                  docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md
    BOM / buying list              docs/corporate/LOT-COSMO-CUBE-BOM.md
    Roadmap                        docs/corporate/LOT-COSMO-CUBE-ROADMAP.md
    Firmware doc (item 9)          docs/technical/LOT-COSMO-CUBE-FIRMWARE.md
    Software/connector doc (item 10) docs/technical/LOT-COSMO-CUBE-SOFTWARE.md
    PDF manual (item 7)            docs/corporate/LOT-COSMO-CUBE-MANUAL.pdf

  Brief item 8 — "compress the information in each session" — is
  handled at the protocol level, not per-document: this session follows
  the LOT Benchmark self-assembly pipeline (docs/assembly/LOT-LEDGER.md,
  LOT-LEXICON.md, LOT-DOCTRINE.md), which is the repo's existing
  mechanism for compressing recurring findings into shorter notation
  over time. See the session report, LOT-SR-20260802-01.md, Section 06.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-HARDWARE-v1
================================================================================
