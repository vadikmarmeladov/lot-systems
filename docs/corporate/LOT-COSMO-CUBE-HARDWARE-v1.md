================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-HARDWARE-v1
TITLE:    COSMO® Cube — Hardware Computer, v1.0 Design & Roadmap
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-24
VERSION:  1.0 — DESIGN LOCK, PRE-MANUFACTURE
STATUS:   PLANNING — COMPONENTS SOURCED, PCBWAY QUOTE PENDING, 0/100 UNITS BUILT
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is not a new invention. It is the next layer on a design lineage already
on record. Before writing a line of spec, the following were read in full:

  docs/benchmark/LOT-MANIFEST.md, line 31
    "COSMO Hardware | brave-lamport-t9z5u8 | ... | COSMO® Cube — complete
    hardware computer design v1.0" — this line item is the one this
    document formally reopens and carries forward on the current branch.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md, line 49-56
    Explicitly disambiguates the two objects so they never collide:
    "COSMO® Cube — complete hardware computer design v1.0 ... under
    Kuzya's COSMO® brand. That is a general-purpose hardware computer.
    CUBIQ™ is not that object. CUBIQ™ is LOT®'s object: a notification
    body, not a computer." CUBIQ™ has no camera, no screen, no compute —
    it is a single-actuator haptic notifier. This document is the
    general-purpose computer CUBIQ™ was written to be distinct from.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Establishes the COSMO® brand register (named for Kuzya Cosmo
    Marmeladov), the "no activation without a verified LOT profile"
    principle, and the father-son origin story. The Cube inherits the
    brand but not the robotics/soul-transfer scope of that document —
    the Cube is an appliance, not a companion robot.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md, Section I "Products" row
    "Quantum Cube | Bioelectric hardware, haptic feedback, nano-ceramic,
    piezoelectric" — sourced from institute.lot-systems.com/cqgs.html.
    The Cube's screen-and-camera notification language (Section 04 below)
    is the CQGS "psychotronic sensor" register applied to a desk object:
    it should read the room it sits in, not just broadcast into it.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    Prior art for a LOT hardware-spec document with a real bill of
    materials, real supplier prices, and a build-order sequence. This
    document and its companion BOM (LOT-COSMO-CUBE-BOM.md) follow that
    same TERMINAL GRID discipline: no line item without a real part.

  brand.lot-systems.com, lot-systems.com/about,
  institute.lot-systems.com/cqgs.html
    Read for brand register and the Institute's CQGS framing (see above).
    No content from these pages is reproduced verbatim here; they set
    tone, not spec.

--------------------------------------------------------------------------------
01 // WHAT THE COSMO® CUBE IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  IT IS:
    - A small, standalone, network-connected computer — camera, screen,
      button, weather sensor, wireless charging — that receives
      autonomous notifications pushed from lot-systems.com and displays
      them as short text ("Coffee time!") on a physical object off the
      phone.
    - A one-button interface. The single control ("Copy") sends one
      signal back to the operator's Log tab on lot-systems.com. It does
      not attempt keyboard input, scrolling, or app navigation.
    - A pilot production run: 100 units, PCBWay-fabricated board,
      2-piece stainless steel body, sold or gifted to Usership-tier
      operators as physical proof that the Memory Engine can reach
      outside the browser tab.

  IT IS NOT:
    - CUBIQ™ (LOT-CUBIQ-QUANTUM-CUBE-v0.md) — that object moves; this
      object does not. No actuator, no jump, no levitation roadmap.
    - A COSMO® robot (LOT_ROBOTICS_COSMO.md) — no soul-transfer, no
      Benchmark eligibility gate, no autonomous behavior beyond
      display-a-message / send-a-signal.
    - A phone replacement. It has no speaker, no microphone, no app
      store, no general input. It does exactly two things: it shows the
      operator what LOT wants them to see, and it lets them log one
      action back. Everything else is out of scope for v1.0.

  THE PRINCIPLE
    Ship the smallest true appliance first. A device that reliably
    displays a pushed notification and reliably logs one button press is
    a complete v1.0. Voice, multi-button gestures, and on-device AI
    inference are named in the roadmap (Section 06) and explicitly not
    v1.0 scope.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  BODY               2-piece stainless steel shell, press-fit + 4x M2
                      countersunk screws, split on the display axis.
                        FACE A (polished): mirror-polished 304 stainless,
                          no aperture, no seam visible from outside — the
                          "closed" face, worn toward the room.
                        FACE B (matte, instrument): brushed 304 stainless,
                          houses the camera aperture, the round display,
                          and the single "Copy" button — the "open" face,
                          worn toward the operator.

  CORE BOARD         Flat silver square, 40mm x 40mm x 5mm (PCBWay
                      ENIG-finish 4-layer PCB, silver/gold contacts
                      visible at the edge — the "flat silver square" is
                      this board, not a separate part). Populated with
                      the MCU, camera connector, display connector,
                      sensor cluster, and Qi receiver — see BOM
                      (LOT-COSMO-CUBE-BOM.md) for every part on it.

  OVERALL ENVELOPE   ~50mm x 50mm x 18mm assembled (board + display +
                      camera stack + battery + shell clearance). A
                      coaster-sized object, not a phone-sized one.

  DISPLAY            1.28" round IPS, 240x240, GC9A01 driver, capacitive
                      touch (CST816S) — round glass reads as an
                      instrument face, not a phone screen. Text-only
                      notification rendering for v1.0 (Section 04);
                      touch capacitance wired but unused in v1.0 firmware,
                      reserved for v1.1 (Section 06).

  CAMERA             OV2640, 1600x1200, fixed-focus, mounted flush behind
                      a sapphire-coated aperture on Face B. v1.0 use is
                      presence-detection only (Section 04) — no image is
                      ever transmitted off-device in v1.0. This is a hard
                      privacy line, not a bandwidth optimization.

  BUTTON             Single tactile switch beneath a stainless steel cap
                      on Face B, silkscreened "COPY." One press, one
                      signal (Section 05). No long-press, no double-tap
                      in v1.0 — one gesture, one meaning.

  WEATHER SENSOR      BME680 (temperature / humidity / pressure / VOC —
                      AI-grade, factory-calibrated, off-the-shelf; see
                      BOM). Ambient context for the notification engine
                      (e.g. a hydration nudge reads differently at 38%
                      humidity than at 70%), not a standalone weather
                      station — the Cube does not forecast; it reports
                      what LOT's engine already knows plus what's in the
                      room.

  CHARGING            Wireless, Qi-class inductive receiver through Face
                      A (the polished face rests on the charging puck —
                      symmetric with the CUBIQ™ table-as-power-surface
                      idea in LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02,
                      reused here rather than reinvented). No exposed
                      port on the shell — the seam between the two
                      stainless halves is the only visible parting line.

  BATTERY             3.7V 500mAh LiPo, ~6-8 hours active display / weeks
                      standby between charges at typical 2-4
                      notifications/day. Sized to the envelope, not the
                      other way around — see BOM for the exact part and
                      why it fits the 18mm stack height.

--------------------------------------------------------------------------------
03 // COMPUTE + CONNECTIVITY
--------------------------------------------------------------------------------

  MCU                 ESP32-S3 (dual-core, Wi-Fi + BLE, native camera
                       interface, hardware JPEG/crypto acceleration).
                       Chosen because it is the one part on this board
                       that does three jobs at once: drives the round
                       display over SPI, reads the OV2640 over its native
                       camera interface, and holds the Wi-Fi session to
                       lot-systems.com — no second radio chip needed.

  NETWORK              2.4GHz Wi-Fi, WPA2/3, on-device credential entry
                       via a one-time BLE provisioning flow at first
                       power-on (phone app or lot-systems.com pairing
                       page — see LOT-COSMO-CUBE-API-CONNECTOR.md).

  DEVICE IDENTITY      Each unit is provisioned with a unique device
                       certificate at flash time and bound to exactly one
                       operator's LOT account during pairing — mirrors
                       LOT_ROBOTICS_COSMO.md's "a unit without a verified
                       profile does not activate" principle, scoped down
                       to account-pairing rather than Benchmark-gated
                       soul transfer (the Cube is an appliance, not a
                       COSMO® robot — Section 01).

--------------------------------------------------------------------------------
04 // NOTIFICATION LANGUAGE — WHAT THE SCREEN SHOWS
--------------------------------------------------------------------------------

v1.0 ships a single notification class: SHORT TEXT, pushed from
lot-systems.com's engine, rendered center-screen in the LOT type style
(docs/technical/LOT-STYLE-GUIDE.md governs typography choices on the
device). Examples the engine already reasons about elsewhere in the
platform (self-care nudges, ritual reminders — see README.md "Memory
Engine" section) map directly onto this display:

  "Coffee time!"          "Hydrate."          "Journal ready."
  "Streak day 12."        "Badge unlocked."   "Breathe."

  PRESENCE GATE
    The OV2640 camera (Section 02) runs a low-power presence check
    on-device before the display wakes for a low-priority notification —
    if no one is in frame, the message queues instead of lighting the
    screen to an empty room. High-priority pushes (explicit user-facing
    alerts) always display regardless of presence. No frame is ever
    stored or transmitted; presence is a boolean computed and discarded
    on-device, every cycle.

  THE PRINCIPLE
    This is the same anti-feed thesis CUBIQ™ was built on
    (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04): a notification that
    exists at the edge of awareness, not a feed that competes for
    foreground attention. The Cube shows one line of text and stops.
    There is no scroll, no history view, no unread badge count on v1.0.

--------------------------------------------------------------------------------
05 // THE "COPY" BUTTON — SIGNAL BACK TO THE LOG TAB
--------------------------------------------------------------------------------

One press of the Face B button fires a single authenticated event from
the device to lot-systems.com, written into the operator's Log tab —
the same Log tab already wired into the platform (referenced across
docs/backup/LOT-BACKUP-PROTOCOL.md, docs/corporate/LOT_PRODUCT_BENCHMARK.md,
and the JournalReflection surface in src/client/components/JournalReflection.tsx).

  BUTTON PRESS
       │
       ▼
  ESP32-S3 debounces (50ms) + timestamps
       │
       ▼
  Signed event: { deviceId, event: "copy", ts, lastNotificationId? }
       │
       ▼
  POST over TLS to LOT API (see LOT-COSMO-CUBE-API-CONNECTOR.md)
       │
       ▼
  Written as a Log entry on the operator's lot-systems.com account
       │
       ▼
  Display confirms with a single checkmark glyph, 800ms, then clears

"Copy" is deliberately the only verb v1.0 ships. It means "I saw this,
log it" — a physical acknowledgment gesture, not a data-entry keyboard.
The exact semantics (does "Copy" mean "acknowledged," "done," or
"repeat this ritual tomorrow") are left to the Log tab's existing entry
model on the server side; the device only ever emits one signal shape.

--------------------------------------------------------------------------------
06 // ROADMAP — v1.0 -> v1.1 -> v2.0
--------------------------------------------------------------------------------

  v1.0 — THIS DOCUMENT (PILOT: 100 UNITS)
    Fixed text notification, presence-gated display, single Copy-to-Log
    signal, weather-sensor context, Qi charging, PCBWay board + CNC
    stainless shell. See LOT-COSMO-CUBE-BOM.md for the full parts list
    and LOT-COSMO-CUBE-FIRMWARE.md / LOT-COSMO-CUBE-API-CONNECTOR.md for
    the two software halves.
    GATE: 100/100 units pass a 3-day burn-in (charge cycle, Wi-Fi
    reconnect after router drop, 50 button-press round trips to the Log
    tab with zero dropped events) before the pilot batch ships to
    operators.

  v1.1 — TOUCH + MULTI-MESSAGE QUEUE
    Activates the CST816S touch layer already on the v1.0 display
    (Section 02, wired but unused). Adds a swipe-to-dismiss gesture and
    a short queue (last 3 notifications) instead of single-message
    display. No new hardware revision — v1.1 is a firmware-only release
    against v1.0 units.
    GATE: firmware OTA update (Section 06 of
    LOT-COSMO-CUBE-FIRMWARE.md) validated on 10 pilot units before
    fleet-wide push.

  v2.0 — SECOND BOARD REVISION
    Re-tuned board: adds a haptic driver (borrowing the piezoelectric
    element class already validated in CUBIQ™ — cross-reference
    LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 03) so the Cube can pair a
    silent screen-wake with a felt pulse, and evaluates a second camera
    revision (OV5640) if presence-detection accuracy from pilot
    telemetry demands it. Production run size TBD, gated on v1.0/v1.1
    pilot data (return rate, battery life in the field, Copy-to-Log
    round-trip reliability).
    GATE: not yet scoped. Opens only after 100-unit pilot telemetry is
    reviewed.

--------------------------------------------------------------------------------
07 // MANUFACTURING — PCBWAY + 100-UNIT PILOT RUN
--------------------------------------------------------------------------------

  BOARD FAB + ASSEMBLY    PCBWay (pcbway.com) — 4-layer ENIG PCB
                            fabrication + SMT assembly (PCBA) quote,
                            https://www.pcbway.com/orderonline.aspx for
                            the bare board and
                            https://www.pcbway.com/quotesmt.aspx for
                            assembly. Prototype PCBA runs start around
                            $88 for a 10-unit batch plus per-component
                            placement cost; 100-unit pricing quoted
                            separately once BOM (LOT-COSMO-CUBE-BOM.md)
                            is finalized and uploaded.

  ENCLOSURE               PCBWay CNC machining, stainless steel 304,
                            https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/ —
                            same vendor for board and body keeps
                            tolerances (board-to-shell fit) in one
                            supplier's hands rather than reconciling two
                            shops' tolerances by mail.

  RUN SIZE                 100 units, pilot batch. Distributed to
                            Usership-tier operators per the existing
                            eligibility/tier logic already governing
                            physical-product delivery elsewhere on the
                            platform (README.md, "LOT is a subscription
                            service that distributes digital and
                            physical necessities").

  DOCUMENTATION SHIPPED PER UNIT
    - Printed/PDF assembly + quick-start manual (Section 08)
    - Firmware architecture document (LOT-COSMO-CUBE-FIRMWARE.md)
    - Software/API connector document (LOT-COSMO-CUBE-API-CONNECTOR.md)
    Each kept as a separate document per S-2 instruction — not merged
    into one file — so a firmware engineer, a manufacturing partner, and
    an end operator each get exactly the document their job needs.

--------------------------------------------------------------------------------
08 // MANUALS + SESSION COMPRESSION
--------------------------------------------------------------------------------

  PDF MANUAL          Generated per pilot-run milestone from this
                       document's Sections 02-05, filed under
                       docs/corporate/ alongside this source. First
                       cut: LOT-COSMO-CUBE-QUICKSTART.pdf (this session).

  SESSION COMPRESSION  Each working session on the Cube is compressed
                       into one dated report under docs/benchmark/
                       (LOT-SR-YYYYMMDD-NN.md), following the same
                       convention already governing every other feature
                       track in this repository (docs/benchmark/LOT-MANIFEST.md).
                       This session's report: docs/benchmark/LOT-SR-20260824-01.md.

--------------------------------------------------------------------------------
09 // BRAND
--------------------------------------------------------------------------------

LOT® / COSMO® Cube          The object — hardware computer, v1.0
COSMO®                      The division (docs/corporate/LOT_ROBOTICS_COSMO.md)
LOT® Quantum Cube (CUBIQ™)  The sibling notification-only object — distinct,
                             no naming or scope overlap (Section 00, 01)

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-HARDWARE-v1
================================================================================
