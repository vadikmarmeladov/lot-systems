================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-TERMINAL-v1
TITLE:    COSMO® Terminal — v1.0 AI-Connected Hardware Computer
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-17
VERSION:  1.0 — DEVELOPMENT START
STATUS:   v1.0 — SPEC LOCK, PRE-PRODUCTION (100-UNIT PILOT RUN QUEUED)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

The intake for this document was a 19-point hardware brief from S-2 (task
title: "build a hardware computer connected to the LOT site"), signed
"Vadik, Inventor, COSMO® CIA," with three external reading pointers:
brand.lot-systems.com, lot-systems.com/about, and
institute.lot-systems.com/cqgs.html. All three domains were attempted via
live fetch this session and returned EGRESS_BLOCKED from the sandbox network
policy — they are not reachable from this environment. In their place, this
document is built on the LOCAL, checked-in snapshots of the same material,
which is the closer-to-source copy anyway (the live pages are rendered from
this repository's content):

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Local snapshot of institute.lot-systems.com/cqgs.html. Row "Quantum Cube
    Hardware | Hardware feedback integration (Month 12+) | PLANNED" and the
    "Quantum Certified Factory" register (psychotronic sensors, biofield-
    aware production) set the design register this document inherits:
    build with commodity, Institute-named technology; do not invent new
    material science for its own sake.

  docs/technical/LOT-STYLE-GUIDE.md
    Stands in for brand.lot-systems.com — minimalist, no decorative color,
    no emoji unless requested, periods over symbols. Carried into the
    device's on-screen notification language (Section 05).

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Stands in for lot-systems.com/about's COSMO® framing. COSMO® is the
    hardware/robotics division, named for Kuzya Cosmo Marmeladov. A COSMO®
    unit without a verified LOT profile does not activate — this document
    inherits that gate (Section 07).

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The one prior hardware-spec document in this repository. Its Section 00
    already drew the line this document must respect: "CUBIQ™ is not [the
    COSMO® computer]. CUBIQ™ is LOT®'s object: a notification body, not a
    computer." CUBIQ™ is a 45mm cube with no screen, no camera, that moves.
    COSMO® Terminal is a flat two-part instrument with a screen and a
    camera, that does not move. The two share a charging-pad philosophy
    (Section 04) and nothing else. No naming or form collision.

  docs/corporate/LOT-TERMINAL-VISION.md, LOT-TERMINAL-SYNC.md
    "LOT Terminal — an open-source platform for self-care hardware,"
    already ships the exact worked example this brief describes: "lot
    hardware init weather-station" → "lot systems connect" → "Air quality:
    Good (67/100) — open your windows for 3 minutes." COSMO® Terminal is
    the commercial, single-SKU, closed-enclosure hardware embodiment of
    that open-source pattern — the "S-2 Operator" journey's Day 90
    milestone ("Hardware available for procurement") made into an actual
    product with a bill of materials and a pilot run.

  docs/benchmark/LOT-MANIFEST.md
    Line 31: "COSMO Hardware | brave-lamport-t9z5u8 | 14/14 | BEST | 7
    files | +2610 | COSMO® Cube — complete hardware computer design v1.0."
    That branch no longer exists on the remote (git fetch confirms —
    2026-08-17) and no corresponding files exist on master. The manifest's
    own note at line 187 says these ship-queue branches "were incorporated
    into master in prior sessions" — for COSMO Hardware, they were not.
    This document, and its four companion documents (Section 09), is the
    real artifact that line has been promising since 2026-06-27. This
    session closes that gap.

  docs/technical/OS_API.md, docs/technical/MEMORY-ENGINE-COMPRESSION-
  ARCHITECTURE.md, src/server/utils/weather.ts, src/client/stores/
  router.ts
    Read to ground every hardware↔software connection point in Sections
    05-08 in code and endpoints that actually exist in this repository,
    not invented ones.

--------------------------------------------------------------------------------
01 // WHAT v1.0 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

COSMO® Terminal is a small stainless-steel instrument that sits on a desk,
charges wirelessly, and does three things: it shows short AI-authored
notifications from lot-systems.com on a low-power screen, it senses the
room it's in (camera, weather-class sensors), and it gives the operator one
physical action — a button that copies whatever the screen is showing into
their Log on lot-systems.com. It is a computer in the literal sense: an
MCU, sensors, a radio, a display, running firmware, connected to an API.
It is not a phone, not a smart-speaker, not a general-purpose assistant.

  v1.0 IS:
    - A locked mechanical, electronic, and firmware architecture for a
      single closed-enclosure device: 2-part stainless steel body,
      wireless-charged, camera + screen + weather sensor + one button.
    - A device whose only inputs to the operator are things already
      running in this codebase: the QI·46 signal layer, the Memory Engine,
      the weather utility (src/server/utils/weather.ts), and the Log tab
      (/log route) — COSMO® Terminal is a new face on existing systems,
      not a new intelligence.
    - Fully specified for a 100-unit pilot run (Section 10): every part
      has a named supplier and a price (docs/corporate/
      LOT-COSMO-TERMINAL-BOM.md).

  v1.0 IS NOT:
    - A camera that streams or stores video. Section 03 specifies a
      single-frame, on-device, non-persisted capture model. No always-on
      video, no cloud video storage. This is a hardware boundary, not a
      policy promise — the BOM (Section 09) does not include a video
      codec or streaming radio class capable of it.
    - A general marketplace product yet. Section 10's 100 units are a
      pilot run for LOT Usership subscribers who are COSMO®-eligible
      (Purple-tier Benchmark+, per LOT_ROBOTICS_COSMO.md's Benchmark
      Arbitrage® gate) — not a public SKU. Retail is a later gate, not
      named here.
    - Levitating, jumping, or otherwise mobile. That vocabulary belongs to
      CUBIQ™ (see Section 00). COSMO® Terminal does not move.

  THE PRINCIPLE
    Ship the smallest true computer first. A device that reliably shows
    one line of text the AI chose, senses the room correctly, and reports
    one button press back to the Log — built from off-the-shelf,
    AI-grade parts a 100-unit run can actually source — is a complete
    v1.0. A device that also streams video, drives a marketplace, and
    walks is not a v1.0. It is a pitch deck.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM — THE TWO-PART BODY
--------------------------------------------------------------------------------

The brief specifies both "a flat silver square 4x4cm x 5mm height" AND a
face carrying a camera, screen, and button. A single 5mm-thick shell cannot
hold a screen, camera, wireless-charge coil, battery, and weather sensor —
so the two "2 parts stainless steel body" line items (#3, #17, #18) resolve
into one mechanical answer, not two separate ambiguous ones:

  PART A — FACE PLATE (the "flat silver square")
    Material         316L stainless steel, mirror-polished (mechanical
                      buff, no coating) — the "one side is polished
                      stainless steel" (#17)
    Dimensions        40mm x 40mm x 5mm, exactly as specified (#4)
    Function          The idle face. No electronics. Flush-mounted over
                      Part B with 4 countersunk M2 screws from the
                      underside — no visible fasteners. This is the side
                      that faces up when the operator is not looking for
                      a notification: a quiet, reflective steel square
                      that looks like a paperweight, not a gadget.

  PART B — INSTRUMENT BODY (the "other side")
    Material         316L stainless steel, CNC-machined, bead-blasted
                      matte finish (contrast to Part A's polish — the two
                      textures are how the operator tells the faces apart
                      by touch, screen-down on a desk)
    Dimensions        40mm x 40mm x 15mm (houses the stack Part A cannot)
    Carries           Camera (Section 03), screen (Section 03), weather
                      sensor vent (Section 03), the Copy button
                      (Section 06), PCB, battery, wireless-charge coil
    Assembled height   20mm total (5mm Part A + 15mm Part B) — this is
                      the honest number; it is recorded here rather than
                      silently rounding the brief's "5mm" down to fit,
                      per the same disclosure standard CUBIQ™ v.0 used
                      when it separated "hop" from "jump" (docs/corporate/
                      LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 01)

  MASS TARGET        <95g fully assembled (stainless steel is dense;
                      this is a paperweight-class object by design — it
                      should not slide when the Copy button is pressed)
  CHARGE INTERFACE    Wireless (Qi-class inductive) through the Part B
                      base face — see Section 04
  FASTENERS           4x M2 stainless countersunk, underside only —
                      no visible screws on either face

  WHY THIS ARCHITECTURE
    Two parts, two finishes, two jobs. The polished face is the object at
    rest — decorative, silent, a steel square on a desk. The matte face
    is the instrument — camera, screen, sensor, button. An operator who
    picks the device up already knows which way is "up" by touch alone,
    before they look. This is the same anti-feed design register CUBIQ™
    uses for its light-vs-motion notification language (Section 05):
    information carried in a channel other than a screen, wherever
    possible.

--------------------------------------------------------------------------------
03 // CAMERA, SCREEN, WEATHER SENSOR — "AI-GRADE OFF-THE-SHELF"
--------------------------------------------------------------------------------

Requirement #15 — "AI grade off-the-shelf sensors" — is a sourcing
principle, not a single part: every sensor in COSMO® Terminal is a
commodity module already validated for edge-AI inference workloads, sourced
from an existing supplier, not custom silicon. This mirrors CQGS-WHITE-
PAPER-SNAPSHOT.md's "Quantum Certified Factory" philosophy (Section 00) —
build with technology that already exists and is already trusted, don't
invent new material science to look impressive.

  CAMERA (#5)
    Part class      OV2640 or OV5640 (2-5MP), single-frame capture only
    Behavior        No video stream, no continuous recording, no on-
                    device or cloud video storage. Captures one frame on
                    a triggered event (Copy button press, or an explicit
                    AI-requested "look" signal), runs a local
                    lightweight vision pass (presence / ambient light /
                    scene class), discards the raw frame after inference.
                    Only the DERIVED signal (e.g. "desk, dim, alone")
                    leaves the device — never the image. This is a
                    hardware-enforced privacy boundary, not a toggle.

  SCREEN (item: "simple screen to show autonomous notifications")
    Part class      1.28" or 1.3" round or square low-power IPS/OLED,
                    SPI interface, 240x240, always-off between messages
    Behavior        Displays one short AI-authored line at a time —
                    exactly the register the brief's own example gives:
                    "Coffee time!" No icons, no unread-count badge, no
                    scrolling feed. When idle, the screen is BLANK, not
                    a clock or a logo — an idle screen is a lit rectangle
                    competing for attention, which is the anti-feed
                    thesis CUBIQ™ Section 04 already states for LOT®:
                    "LOT® invests attention and returns structure."

  WEATHER SENSOR (#14)
    Part class      BME280-class (temperature, humidity, barometric
                    pressure) — the same sensor class the industry
                    standardizes on for edge weather sensing
    Integration     Reports directly into the existing
                    src/server/utils/weather.ts pipeline (getWeather()) —
                    the device does not run its own weather logic, it
                    supplies a local ground-truth reading the server-side
                    weather utility already knows how to consume and
                    blend with API-sourced forecast data.

  SENSOR-GRADE PRINCIPLE
    None of the above is bespoke. Every part above ships today from at
    least two of the three suppliers named in the BOM
    (docs/corporate/LOT-COSMO-TERMINAL-BOM.md). "AI-grade" here means:
    documented I2C/SPI interface, an existing open-source driver, and a
    track record in other edge-AI hardware — not a marketing tier.

--------------------------------------------------------------------------------
04 // POWER — WIRELESS CHARGER
--------------------------------------------------------------------------------

  CHARGE INTERFACE    Qi-class inductive receiver coil inside Part B,
                      15mm from the base face
  CHARGING PAD        Same charging-pad product family as CUBIQ™
                      (docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md,
                      Section 02: "The charging pad IS the 'table'") —
                      one LOT® charging accessory, shared across the
                      hardware line, is cheaper to source at 100-unit
                      scale and gives both devices a single physical home
                      on the operator's desk.
  BATTERY             320mAh Li-Po, single-cell, protected — sized for
                      screen-on time (a handful of seconds per
                      notification) plus periodic weather/camera
                      sampling, not continuous operation
  RUNTIME TARGET      72+ hours off-charger under typical notification
                      load (10-20 messages/day); device is expected to
                      live on its charging pad, not be carried

--------------------------------------------------------------------------------
05 // THE PAGER SIGNAL — NOTIFICATION LANGUAGE
--------------------------------------------------------------------------------

Requirement #2 — "send a pager-like notification from an AI-powered site" —
is the device's core function. The AI-powered site is lot-systems.com; the
signal source is the same Memory Engine / QI·46 layer that already decides
what to say to the operator inside the web app
(docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md: "The AI never
initiates conversation... the machine remembers" — the device is the one
new place the AI DOES initiate, deliberately, sparingly).

  MESSAGE CLASS         SOURCE                              EXAMPLE
  ─────────────         ──────                              ───────
  Care nudge             Memory Engine, self-care pattern     "Coffee
                          threshold crossed                    time!"
  Weather-linked nudge    src/server/utils/weather.ts +        "Rain in
                          Memory Engine pattern overlay          20 min."
  Badge / milestone       Badge engine (docs/badges)            "Day 90.
                                                                  Purple
                                                                  tier."
  Log prompt              Memory Engine question ready          "New
                                                                  question
                                                                  waiting."

  PIPELINE
    Signal fires (Index of Systems) → server selects a message
    (<=24 chars, one line, no emoji, period not exclamation-mark by
    default per LOT-STYLE-GUIDE.md — "Coffee time!" in the brief is the
    one deliberate exception, used verbatim as the reference example) →
    pushed to device (docs/corporate/LOT-COSMO-TERMINAL-SOFTWARE.md,
    Section 02) → screen lights for a fixed 8-second window → returns to
    blank.

  RATE LIMIT
    Hard cap, firmware-enforced: no more than 1 message per 15 minutes,
    no more than 12 per day. A pager that pages constantly is a phone.
    This is a gate, not a setting a v1.0 unit can override.

--------------------------------------------------------------------------------
06 // THE "COPY" BUTTON — LOG TAB SIGNAL
--------------------------------------------------------------------------------

Requirement #16. A single physical button on Part B's face, labeled COPY.

  BEHAVIOR
    Press while a notification is on screen  → the exact message text is
      written as a new entry in the operator's Log tab on
      lot-systems.com (client route /log — src/client/stores/router.ts
      line 31) via the software layer's log-write endpoint
      (docs/corporate/LOT-COSMO-TERMINAL-SOFTWARE.md, Section 03).
    Press while the screen is blank            → captures a "check-in"
      log entry with the current local sensor snapshot (temperature,
      light, camera-derived scene class from Section 03) — a way to
      manually log a moment even when the AI hasn't sent anything.

  WHY "COPY" AND NOT "OK" / "DISMISS"
    Every other pager/notification device treats the button as
    dismissal — acknowledge and forget. COSMO® Terminal's button is the
    opposite: it PRESERVES. Pressing Copy is how an ambient, ephemeral
    AI notification becomes a durable, timestamped entry the operator
    can find again in their Log. This is the same "self-care through
    proactive context-aware AI" thesis (README.md) expressed as a single
    physical gesture — the device's one interaction is an act of keeping,
    not clearing.

  FEEDBACK
    A single sub-100ms screen flash confirms the write. No sound, no LED
    — consistent with CUBIQ™'s stated preference for motion/touch
    confirmation over light wherever the primary channel already is a
    screen (Section 03).

--------------------------------------------------------------------------------
07 // LOT API CONNECTOR
--------------------------------------------------------------------------------

Requirement #6. COSMO® Terminal is a client of the existing OS API
(docs/technical/OS_API.md), extended with four device-facing endpoints
specified in full in docs/corporate/LOT-COSMO-TERMINAL-SOFTWARE.md:

    POST /api/device/pair          — one-time pairing (QR code on first
                                      boot, scanned from lot-systems.com
                                      Settings page)
    GET  /api/device/notify/stream — long-lived SSE connection, server
                                      pushes Section 05 messages
    POST /api/device/log           — writes a Copy-button entry to /log
    POST /api/device/sensor        — uploads weather-sensor readings

  GATE — per LOT_ROBOTICS_COSMO.md's existing rule for the COSMO® line:
  "A COSMO® unit without a verified LOT profile does not activate."
  /api/device/pair fails closed for any account below Yellow-tier
  Benchmark. COSMO® Terminal inherits the eligibility gate already
  written for COSMO® hardware — it does not define a new one.

--------------------------------------------------------------------------------
08 // SESSION COMPRESSION
--------------------------------------------------------------------------------

Requirement #8 — "compress the information in each session." COSMO®
Terminal does not keep a running log on-device. Each notification-to-
Copy(or timeout) cycle is one session; at session close, the firmware
sends a single compressed record (message id, shown-at timestamp, Copy
pressed true/false, one sensor snapshot) rather than a stream of raw
events. This mirrors the Memory Engine's own "Virtuous Compression Cycle"
(docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md, Section 2) —
compress on the edge, the same discipline the server already applies to
the operator's answers.

--------------------------------------------------------------------------------
09 // DOCUMENTATION SET — SEPARATE DOCUMENTS
--------------------------------------------------------------------------------

Requirements #7, #9, #10, #11. This plan is deliberately not one giant
file. Five documents, one job each, cross-referencing this one:

  docs/corporate/LOT-COSMO-TERMINAL-v1.md            this document — plan
  docs/corporate/LOT-COSMO-TERMINAL-BOM.md            components + supplier
                                                       links + pilot-run cost
  docs/corporate/LOT-COSMO-TERMINAL-FIRMWARE.md       on-device firmware spec
  docs/corporate/LOT-COSMO-TERMINAL-SOFTWARE.md       server + API connector
  docs/corporate/LOT-COSMO-TERMINAL-MANUAL.md (+ pdf) operator manual

--------------------------------------------------------------------------------
10 // MANUFACTURING — PCBWAY + 100-UNIT PILOT RUN
--------------------------------------------------------------------------------

Requirements #1, #13. Full detail and pricing in
docs/corporate/LOT-COSMO-TERMINAL-BOM.md; summary here:

  PCB FABRICATION      PCBWay (pcbway.com) — 4-layer, ENIG finish,
                        40mm x 36mm board (fits Part B envelope)
  PCB ASSEMBLY          PCBWay PCBA service — same vendor, SMT + hand-
                        placed connectors, reduces vendor count to one
                        for the electronics stack
  ENCLOSURE              CNC stainless steel job shop (BOM Section 3) —
                        separate from PCBWay; PCBWay does not do
                        production-grade stainless CNC at this tolerance
  RUN SIZE                100 units — a pilot run, sized to LOT
                        Usership's Purple-tier+ population, not a mass
                        production quantity. Pricing in the BOM is
                        quoted at 100-unit tier specifically (per-unit
                        cost is meaningfully higher than a 1,000+ run —
                        this is stated, not hidden).
  LEAD TIME (ESTIMATE)   PCB fab+assembly: 10-15 business days.
                        Stainless enclosure (2-part, CNC + polish):
                        15-20 business days, can run in parallel.
                        Final assembly + firmware flash + QC: 5 days.
                        Total: ~4-5 weeks from PO to first shippable unit.

--------------------------------------------------------------------------------
11 // ROADMAP — v0.1 → v1.0 → PILOT → RETAIL
--------------------------------------------------------------------------------

  v0.1 — BENCH PROTOTYPE (NEXT SESSION)
    Single hand-built unit: dev board (not the final MCU footprint) +
    breadboarded sensors + 3D-printed stand-in enclosure (not stainless).
    Goal: prove the pairing flow (Section 07) and the notification round
    trip (Section 05) end to end against a real lot-systems.com account.
    GATE: one message sent from the Memory Engine reaches the bench unit
    screen and a Copy-button press is visible in that account's Log tab.

  v0.5 — FIRST STAINLESS UNIT
    Single unit in the real Part A/Part B enclosure (Section 02), final
    MCU, camera, and screen. Hand-assembled, not the PCBWay production
    run. Goal: validate the two-part mechanical fit, wireless charging
    alignment, and 72-hour runtime target (Section 04).
    GATE: 72-hour runtime target met; Part A/Part B fit within 0.1mm
    tolerance with zero visible gap.

  v1.0 — 100-UNIT PILOT RUN (THIS DOCUMENT)
    Full PCBWay PCB fab + assembly, CNC stainless enclosures, 100 units,
    distributed to Purple-tier+ Usership subscribers (Section 07 gate).
    GATE: 100/100 units pass pairing + notification-round-trip QC before
    shipment; zero units shipped without the camera privacy boundary
    (Section 03) verified in firmware.

  v2.0 — RETAIL (NOT SCHEDULED)
    Named as the horizon, not committed here. Retail would require a
    production run beyond 100 units, a lower per-unit BOM cost (volume
    pricing), and a decision this document does not make about whether
    the Benchmark Arbitrage® eligibility gate (Section 07) applies to a
    public SKU or only to the Usership pilot population. Recorded so v1.0
    part choices (Section 02-04) are made with a retail future in mind,
    not foreclosing it — the same posture CUBIQ™ takes toward levitation
    (docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 06).

--------------------------------------------------------------------------------
12 // CONSUMER USE CASE
--------------------------------------------------------------------------------

  USE CASE 01 — THE COFFEE NUDGE                             2026-08-17
  ─────────────────────────────────────────────────────────────────
  Operator profile: Usership tier, Purple Benchmark, COSMO®-eligible,
  COSMO® Terminal paired and sitting on the kitchen counter, polished
  face up, next to the coffee machine.

  9:14am. The operator's Memory Engine pattern (streak of late starts,
  mood check-ins trending low-energy before 10am) crosses the care-nudge
  threshold. The server selects the message and pushes it over the SSE
  connection (Section 07). The device's screen — blank until this
  instant — lights: "Coffee time."

  The operator, walking past, sees it, makes coffee. No decision was
  required — the device didn't ask a question, it stated the smallest
  useful fact at the smallest useful moment. Before leaving the kitchen,
  they press Copy. The exact line — "Coffee time." — appears as a new
  entry in their Log tab, timestamped 9:14am, the next time they open
  lot-systems.com. Three weeks later, reviewing their Log, they can see
  the pattern the AI saw: eleven "Coffee time" entries, all between
  9:05 and 9:20am, all on days their prior mood check-in ran low.

  This is the loop Section 06 was built to close: an ambient notification
  that would otherwise evaporate becomes, with one press, a data point
  the operator can actually learn from.

--------------------------------------------------------------------------------
13 // BRAND
--------------------------------------------------------------------------------

COSMO® Terminal              The object — hardware, this document
LOT Terminal                 The open-source platform it is built on
                              (docs/corporate/LOT-TERMINAL-VISION.md)
COSMO®                       The robotics/hardware division
LOT®                         The software platform and signal source
LOT®† COSMO®                 The combined mark, per LOT-CUBIQ-QUANTUM-
                              CUBE-v0.md Section 08 precedent

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-TERMINAL-v1
================================================================================
