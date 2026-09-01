<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-PLAN-v1
TITLE:    LOT® Computer — Physical Notification & Capture Device, Master Plan
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV, INVENTOR — COSMO® CIA
DATE:     2026-09-01
VERSION:  1.0 — PLANNING LOCK
STATUS:   PRE-HARDWARE / SPECIFICATION COMPLETE / SOURCING NOT YET COMMITTED
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is not the first physical object LOT has specified. Before writing a
line of this plan, the following were read in full so LOT® Computer does not
collide with, or duplicate, work already on record:

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    CUBIQ™ is a haptic OUTPUT object — it moves (hops, nudges, leaps) to
    signal the operator. It carries no screen and no camera by design
    (Section 02: "light is secondary and utilitarian"). LOT® Computer is
    the opposite design choice: a flat object that DISPLAYS text and
    CAPTURES a moment on demand. The two are siblings, not competitors —
    a desk could reasonably hold both.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    Node-0 is the back-end — the self-hosted inference server. LOT®
    Computer is a front-end peripheral. It does not run inference. It
    is a thin, connected client of lot-systems.com (optionally routed
    through a self-hosted Node-0 in the self-hosted deployment path).

  docs/technical/LOT-TERMINAL-VISION.md
    LOT Terminal is the open-source hobbyist track ("S-2 recruits,"
    9-year-old-safe tinkering). LOT® Computer is the commercial
    Track-2 object referenced there directly: "When LOT® Systems CEO
    Vadim builds his prototype... Plugs hardware into LOT® Systems
    seamlessly." This document is that prototype's plan.

  docs/benchmark/LOT-MANIFEST.md
    Row 31 records a prior, textually distinct effort — "COSMO Hardware
    | brave-lamport-t9z5u8 | COSMO® Cube — complete hardware computer
    design v1.0" — under Kuzya's COSMO® robotics brand. No corresponding
    spec document survives in this checkout, and per
    docs/corporate/LOT_ROBOTICS_COSMO.md, COSMO® names the robotics
    /soul-transfer product line, not a desk notification object. LOT®
    Computer claims its own name and its own document set, starting
    here, to avoid the naming collision CUBIQ's spec already flagged as
    a risk between the two hardware tracks.

  src/client/components/Logs.tsx, src/client/queries.ts,
  src/server/routes/api.ts (GET/POST /api/logs)
    The Log tab already exists, is already wired to a Fastify + Postgres
    Log model, and already renders on lot-systems.com. LOT® Computer's
    physical "Copy" button (Section 03) is specified to write into this
    exact system — not a new one.

  docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
    The Memory Engine's approach to compressing accumulated context is
    the direct model for how the device compresses a session's captured
    events before it syncs (Section 03, "session compression").

--------------------------------------------------------------------------------
01 // WHAT LOT® COMPUTER IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

LOT® Computer is a small stainless-steel object that sits on a desk,
receives short AI-generated notifications from lot-systems.com ("Coffee
time!"), and lets its owner capture a moment back into their own Log with
one press of a single button.

  IT IS:
    - A flat, two-sided, two-part stainless-steel slab, 40mm x 40mm x
      5mm, one face mirror-polished, one face carrying a low-power
      screen, a small camera, and one button.
    - A thin client of lot-systems.com. It has no local intelligence of
      its own — no model runs on it. It authenticates, receives, and
      sends. All reasoning happens where it already happens today: the
      Memory Engine, the Quantum Intent Engine, QOS.
    - A single-gesture input device. The button does exactly one thing —
      "Copy" — and that one thing is well-defined (Section 03).
    - A pilot manufacturing run: 100 units, sourced and built through a
      single vendor (PCBWay) for both PCB fabrication/assembly and the
      CNC-machined stainless enclosure, to keep the pilot's supply chain
      to one relationship.

  IT IS NOT:
    - A general-purpose computer. "Computer" is the product name LOT
      gave it, not a claim about compute capability — it has a
      microcontroller, not a CPU running an OS a user would recognize.
    - A replacement for CUBIQ. CUBIQ communicates through motion with no
      screen. LOT® Computer communicates through a screen with no
      motion. Where CUBIQ says "something needs you" by moving, LOT®
      Computer says what, in words, and lets the owner push a moment
      back.
    - A smartphone competitor. No apps, no browser, no notifications
      beyond the one class lot-systems.com sends it. This restraint is
      the point (Section 02).

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  DIMENSIONS         40mm x 40mm x 5mm — "a flat silver square." Thinner
                      than a stack of five credit cards. Small enough to
                      sit under a monitor or beside a keyboard without
                      claiming desk real estate the way a phone does.

  BODY                Two-part CNC-machined stainless steel shell,
                      304-grade for the pilot run (316 marine-grade as a
                      post-pilot option for humidity-exposed environments
                      — see Section 05, weather sensor).
                        FACE A (front)  — mirror-polished stainless,
                          no seams, no printing. The LOT® mark is
                          laser-etched, not painted, so it never wears.
                        FACE B (back)   — matte bead-blasted stainless
                          with three cutouts: screen window, camera
                          aperture, button bore.

  DISPLAY              Monochrome e-paper, ~1.54" square. E-paper holds
                      its image with zero standing power — the screen
                      shows the last notification even fully
                      unpowered, which is the correct behavior for a
                      "pager-like" device: the message persists, it
                      does not need to be re-glanced at before it fades.

  CAMERA                Small fixed-focus module (Section 05), flush to
                      Face B. Not a viewfinder — the device has no
                      preview screen for it. It captures on the same
                      button press that fires "Copy" (Section 03), so a
                      captured moment can carry an image, not only text.

  BUTTON                One tactile switch, laser-etched "COPY." No
                      second button, no long-press mode, no gesture
                      language to learn. One press, one meaning.

  RF WINDOW             Design risk flagged here deliberately: a sealed
                      stainless shell attenuates WiFi/BLE. Face B's
                      camera/screen cutouts are not large enough to
                      serve as an RF window on their own. The firmware
                      spec (Section 06) and BOM both carry a dedicated
                      RF-transparent insert (glass-filled polymer ring
                      around the antenna keep-out) as a resolved
                      requirement, not an open question — this is the
                      single highest-risk mechanical/RF interaction in
                      the whole build and it is called out here so no
                      later document can quietly drop it.

  CHARGING               Wireless (Qi-class inductive) through Face A —
                      the polished face IS the charging face, resting
                      face-down on a matching LOT® charging puck
                      (Section 04). No port, no seam, no ingress point.
                      This is also why flashing/debug uses pogo-pin test
                      points rather than a USB port (Section 06).

--------------------------------------------------------------------------------
03 // WHAT IT DOES
--------------------------------------------------------------------------------

  RECEIVE — THE NOTIFICATION
    lot-systems.com already generates short, contextual, single-line
    prompts today — the Memory Engine's proactive questions, QOS mode
    changes, ContextualPromptsWidget and CalendarWidget triggers already
    live in src/client/components/. LOT® Computer subscribes to that
    same signal class over an authenticated, persistent connection and
    renders the plainest possible form of it on the e-paper screen —
    e.g. "Coffee time!" This is the pager-like behavior the brief names
    directly: a short, addressed, ephemeral text, not a feed.

  SEND — THE COPY BUTTON
    One press of COPY does three things, in order:
      1. The camera captures a single still (optional — silent, no
         shutter simulation, no preview).
      2. The device timestamps the moment and, if the still capture
         succeeded, attaches it.
      3. The payload is sent to the LOT API connector (Section 06) as a
         new entry in the SAME Log system that already powers the Log
         tab at lot-systems.com — src/client/components/Logs.tsx, the
         Log model behind GET/POST /api/logs. The owner opens their Log
         tab later and the captured moment is simply there, tagged
         `source: "lot-computer"`, exactly where every other Log entry
         lives. No parallel inbox, no new tab, no new mental model.

  COMPRESS — THE SESSION
    Between charges, the device accumulates a small local queue of
    events (notifications shown, COPY presses, connectivity gaps). On
    each sync, that queue is compressed to a compact record before
    transmission — timestamps, event types, and a hash rather than a
    raw log, following the same discipline the Memory Engine already
    applies to session compression
    (docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md). The
    device is deliberately amnesiac about anything older than its
    current session; the Memory Story lives server-side, as it does for
    every other LOT surface.

--------------------------------------------------------------------------------
04 // MANUFACTURING
--------------------------------------------------------------------------------

  VENDOR                PCBWay, single relationship for the pilot:
                          - PCB fabrication + SMT assembly (PCBA) for the
                            main board
                          - CNC machining + polishing for both stainless
                            shell halves
                          - Wireless-charging puck enclosure (small ABS
                            or aluminum CNC part)
                      One vendor for board + metal removes a coordination
                      failure mode a two-vendor pilot would carry —
                      fit-and-finish issues get resolved with one point
                      of contact, not reconciled between two.

  RUN SIZE               100 units. Sized to validate yield, RF
                      performance through the stainless shell, and
                      real-world Qi charging fit-and-finish before any
                      larger commitment. See
                      docs/hardware/LOT-COMPUTER-ROADMAP.md for the
                      gate criteria the pilot must clear.

  BOM                   Full parts list with vendor links:
                      docs/hardware/LOT-COMPUTER-BOM.md

--------------------------------------------------------------------------------
05 // SENSORS
--------------------------------------------------------------------------------

  CAMERA                 Small fixed-focus module wired to the MCU's
                      camera interface (Section 06). Off-the-shelf,
                      AI-grade only in the sense the brief specifies —
                      a commodity sensor good enough for a still capture
                      that a vision model can later describe, not a
                      photography-grade sensor. No local ML runs on the
                      device; classification, if any, happens
                      server-side against the same AI engine abstraction
                      already documented in AI-ENGINE-GUIDE.md.

  WEATHER SENSOR          One off-the-shelf environmental sensor
                      (temperature / humidity / pressure) inside the
                      shell, feeding the same weather-aware context the
                      Public Profile system already surfaces (README.md,
                      "Weather" row). The device becomes a second,
                      hyper-local weather signal alongside the
                      geocoded API weather already in use — useful
                      specifically because it is desk-local, not
                      city-level.

  SELECTION PRINCIPLE      "AI-grade off-the-shelf sensors" — every
                      sensor in this device is a widely available,
                      well-documented commodity part with public
                      datasheets and existing open-source driver
                      libraries. No custom silicon, no bespoke sensor
                      development for the pilot. Speed and yield over
                      novelty at 100-unit scale.

--------------------------------------------------------------------------------
06 // DOCUMENTATION SET
--------------------------------------------------------------------------------

Per the brief's explicit instruction, firmware, software, and the user
manual are kept as separate documents, not folded into this plan:

    docs/hardware/LOT-COMPUTER-BOM.md
      Full components list with vendor links, for the 100-unit run.

    docs/hardware/LOT-COMPUTER-ROADMAP.md
      v0.1 bench prototype -> v1.0 pilot production, with gate criteria.

    docs/hardware/LOT-COMPUTER-FIRMWARE.md
      MCU choice, state machine, LOT API connector implementation,
      OTA, RF window handling, session-compression implementation.

    docs/hardware/LOT-COMPUTER-SOFTWARE-BRIDGE.md
      Server-side: new /api/device/* endpoints, how COPY reuses
      /api/logs, notification delivery, pairing/auth, data model.

    docs/hardware/LOT-COMPUTER-MANUAL.md / .pdf
      User-facing quick-start manual, generated to PDF each session per
      the brief's instruction ("Result in PDF manuals").

--------------------------------------------------------------------------------
07 // BRAND
--------------------------------------------------------------------------------

LOT® Computer               The object — this document
CUBIQ™                       Sibling object — haptic, motion-only, no screen
Node-0                        Back-end — self-hosted inference the object
                               may route through, never a peer of the object
LOT® Terminal                 Open-source track this object's firmware and
                               software-bridge code should be publishable
                               against, per docs/technical/LOT-TERMINAL-VISION.md

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END LOT-COMPUTER-PLAN-v1
================================================================================
