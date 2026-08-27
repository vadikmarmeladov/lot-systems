<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-v1
TITLE:    COSMO® Computer — Physical Hardware Computer, Plan + BOM + Roadmap
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-27
VERSION:  1.0 — DESIGN LOCK PENDING (PRE-PROTOTYPE)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is a fresh v1, not a diff. `docs/benchmark/LOT-MANIFEST.md` records a
prior "COSMO® Cube — complete hardware computer design v1.0" on branch
`brave-lamport-t9z5u8` (14/14 iterations, BEST, +2610 lines) — that remote
branch no longer exists and its content is not recoverable from this clone.
This document restarts the COSMO® hardware-computer line from S-2's current
brief rather than guessing at lost content, and claims the `brave-lamport`
naming lineage forward from here.

Read in full before writing a line of spec:

  docs/corporate/LOT_ROBOTICS_COSMO.md
    COSMO® is the robotics/hardware product line named for Kuzya Cosmo
    Marmeladov. Section "Revenue Path" already prices Phase 3 (COSMO®
    Hardware, 2028-2029) at $2,500-$5,000/unit + $100/mo soul-sync. This
    document is a smaller, nearer-term object than that phase's full
    robot — a pager-class desk computer, not a companion robot — but it
    inherits the same brand, the same "no activation without a verified
    LOT profile" posture, and the same father-son origin.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    LOT®'s CUBIQ™ is a haptic notification body — motion is its language,
    it has no screen, no camera, no general compute. Its own Section 00
    already drew the line this document confirms: "CUBIQ™ is not that
    object... The two are related by lineage (father/son, LOT®/COSMO®)
    and should share no naming collision going forward." The COSMO®
    Computer specified here is that other object — a general-purpose
    hardware computer with a screen, a camera, and an API connector.

  docs/corporate/LOT-CUBIQ-OPERATOR.md
    Section 04, "AI-Driven Physical Product Delivery" and Section 07
    Phase 4, "Physical Extension (Days 90+)" — the same operator-tier
    gating logic (behavioral verification before hardware) applies here.

  docs/corporate/LOT-TERMINAL-M2M.md
    The M2M data-intake protocol (device_id, operator, standardized JSON,
    `POST /v1/m2m/intake`) is the wire format the LOT API Connector
    (Section 06 below) reuses rather than reinventing.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Confirms the Quantum Cube product line already named "bioelectric
    hardware, haptic feedback, nano-ceramic, piezoelectric" as CUBIQ's
    material register (Section II). The COSMO® Computer deliberately
    uses a different material register — stainless steel, not
    nano-ceramic — to keep the two product lines visually and physically
    distinct on a shelf, not just distinct in prose.

  docs/corporate/LOT_QI46_ENGINE.md
    Confirms the Quantum Cube as a Month-12 milestone device reporting
    haptic telemetry back into the Calibration Loop. The COSMO® Computer
    (Section 08 below) closes an analogous loop for text notifications
    and the "Copy" button signal, using the Logs surface already live in
    the product (`src/client/components/Logs.tsx`) rather than a new one.

NOTE ON SOURCES REQUESTED BUT UNREACHABLE: S-2's brief named
brand.lot-systems.com, lot-systems.com/about, and
institute.lot-systems.com/cqgs.html as further reading. All three are
blocked by this session's network egress proxy (external fetch denied at
the domain level). This document is grounded in the local corpus instead
(the six documents above, all mirrors or supersets of that same brand and
CQGS material already checked into this repo). Re-reading the live pages
once egress is available is listed as an open item in Section 11.

--------------------------------------------------------------------------------
01 // WHAT THIS IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  COSMO® COMPUTER IS:
    - A pocket-sized, general-purpose hardware computer: camera, screen,
      one button, wireless connectivity, environmental sensing, running
      real firmware — not a single-purpose notification toy.
    - A pager for the AI age. Its primary job is to receive one short,
      AI-composed line of text from lot-systems.com and show it — "Coffee
      time!", "You haven't journaled today," "Cohort ping: 3 new" — the
      way a 1990s pager showed a callback number, at the speed of a
      glance, not a feed.
    - A physical extension of an operator's existing LOT profile,
      gated the same way COSMO® hardware is gated everywhere else in this
      corpus (LOT_ROBOTICS_COSMO.md): it authenticates to one account and
      does nothing useful disconnected from it.

  COSMO® COMPUTER IS NOT:
    - CUBIQ™. No motion, no jumping, no levitation roadmap. This device
      sits still. Its output is text on a screen, not a body in motion.
    - A phone. No app store, no general web browser, no third-party apps.
      One function class: receive, display, log, and — via the camera —
      optionally capture and relay a still frame on operator request.
    - A subscription-free device. Like every COSMO® object in this
      corpus, it requires an active LOT profile to activate and stays
      useless without one.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  DIMENSIONS        40mm x 40mm x 5mm — a flat silver square, "coin on a
                     desk," not "gadget on a desk." The 5mm height is the
                     hard design constraint everything else in this
                     document is fought against: the camera module,
                     battery, wireless-charge coil, MCU, and display all
                     have to fit inside a stack thinner than a stack of
                     four credit cards.
  BODY               Two-piece stainless steel shell (SUS304, brushed on
                     the internal chassis face, see finish split below),
                     CNC-milled or precision-stamped depending on the
                     100-unit run's tooling economics (Section 09).
                     Two pieces = a front face plate and a rear face
                     plate, sandwiching the PCB stack and battery,
                     fastened with 4x M1.4 stainless screws at the
                     corners, gasket-sealed for light dust/splash
                     resistance (no IP rating claimed at v1 — untested).
  FACE A (FRONT)     Polished stainless steel, mirror finish. No
                     features, no seams beyond the perimeter parting
                     line. This face is inert by design — the device's
                     "off" face, meant to sit face-down or face-up as a
                     quiet object, reflecting the desk rather than
                     competing with it.
  FACE B (BACK)      Camera, screen, button — the "on" face:
                       - CAMERA: center-top, small aperture, module
                         detailed in Section 03.
                       - SCREEN: center, the notification surface,
                         detailed in Section 04.
                       - BUTTON: bottom edge, labeled COPY, detailed in
                         Section 05.
  CHARGING           Wireless, Qi-BPP class, through Face A (the
                     polished face doubles as the charge-contact face,
                     the same "the charging pad IS the table" logic
                     LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02 already
                     established for CUBIQ — the object rests face-down
                     to charge, face-up to be read).
  MASS TARGET        <45g fully assembled. Stainless is heavy relative
                     to plastic or nano-ceramic; the 5mm height budget
                     forces a small-diameter coil and a thin cell, which
                     keeps mass down despite the metal shell.

--------------------------------------------------------------------------------
03 // CAMERA
--------------------------------------------------------------------------------

Fixed-focus module, AI-grade off-the-shelf (Section 09 — not a hobbyist
board-camera part; automotive/industrial-qualified sensor lines are
specified for temperature tolerance and long-run consistency across a
100-unit batch, where part-to-part variance in a hobbyist part would
show up as visible quality drift between early and late units).

  RESOLUTION         2MP class (1920x1080 sufficient for its one job —
                     an operator-triggered still capture relayed to the
                     LOT dashboard, not video, not always-on capture).
  CAPTURE MODEL      Operator-initiated only, no background/always-on
                     capture. A short button-hold (Section 05) triggers
                     one still frame, uploaded via the LOT API Connector
                     (Section 06) and attached to the corresponding Log
                     entry. This mirrors the M2M protocol's existing
                     device_id + operator + timestamp envelope
                     (LOT-TERMINAL-M2M.md Format 1/2) with an image
                     payload added rather than a new schema invented.
  PRIVACY POSTURE    No lens cover shipped at v1 is a known gap — see
                     Section 11 open items. A physical shutter or status
                     LED indicating "camera armed" is the leading
                     candidate fix before design lock.

--------------------------------------------------------------------------------
04 // SCREEN — THE PAGER SURFACE
--------------------------------------------------------------------------------

  CLASS              Low-power reflective/transflective LCD or e-paper
                     class display, round or square to match the 40mm
                     body, ~30-32mm active area. E-paper is the leading
                     candidate: near-zero power at rest (the message
                     persists on-screen between refreshes with no
                     current draw), which matters directly for the
                     battery budget inside a 5mm-thick shell.
  CONTENT MODEL      One short line, AI-composed on lot-systems.com,
                     pushed down and displayed verbatim. "Coffee time!"
                     is the brief's own example — the design target is a
                     single glanceable phrase, not a scrolling feed, not
                     a dashboard. This is the same "complexity into
                     simplicity" philosophy LOT-TERMINAL-VISION.md
                     states directly: "Weather station with 12 sensors...
                     OUTPUT: Air quality: 67/100... BETTER: Air quality:
                     Good (67/100) - open your windows for 3 minutes."
                     The COSMO® Computer screen is that BETTER line,
                     worn on a wrist-sized object instead of read on a
                     dashboard.
  REFRESH TRIGGER    Server-pushed only. lot-systems.com decides WHEN a
                     notification is worth a physical glance (the same
                     AI-driven delivery-timing logic named in
                     LOT-CUBIQ-OPERATOR.md Section 04) — the device does
                     not poll on a fixed interval, it wakes on push.

--------------------------------------------------------------------------------
05 // THE COPY BUTTON — SIGNAL BACK TO THE LOG TAB
--------------------------------------------------------------------------------

One physical button, Face B, labeled COPY. Two press classes:

  SHORT PRESS        Sends a signal back to the operator's Log tab on
                     lot-systems.com — the currently displayed
                     notification is written into the account's activity
                     log, the same log surface already live in the
                     product (`src/client/components/Logs.tsx`). This is
                     the hardware equivalent of hitting "save" on a
                     passing thought: the AI said "Coffee time!", the
                     operator glanced at it, pressed COPY, and now it
                     exists as a timestamped Log entry rather than
                     evaporating off the screen.
  LONG PRESS (HOLD)  Triggers the camera capture path (Section 03) and
                     attaches the resulting frame to the same Log entry.
  LOG BODY FORMAT     Per the repo's own COCKPIT-RULE convention
                     (docs/benchmark/LOT-LEXICON.md: "Log body =
                     instrument readings only; label names the event; no
                     narration"), the Log entry this button writes is
                     data, not prose:
                       label: "COSMO-COMPUTER: COPY"
                       body:  device_id, operator, displayed_text,
                              timestamp, (optional) image_ref
                     No narration is generated by the device. The AI
                     narrative, if any, is composed server-side from
                     this raw entry the same way every other Log entry
                     in the product already is.

--------------------------------------------------------------------------------
06 // LOT API CONNECTOR
--------------------------------------------------------------------------------

The device speaks the existing M2M data-intake protocol
(docs/corporate/LOT-TERMINAL-M2M.md) rather than a new one:

    lot-systems.com                          COSMO® Computer
         │                                          │
         │  AI composes short-text notification     │
         │  (Memory Engine / QIE signal fires)       │
         │                                          │
         ├──── PUSH: display_text ────────────────▶ │  screen updates
         │                                          │
         │                                    operator presses COPY
         │                                          │
         │ ◀──── POST /v1/m2m/intake ───────────────┤  Log entry written
         │        { device_id, operator,            │  (Section 05 format)
         │          metric: "copy_event",            │
         │          displayed_text, timestamp,       │
         │          image_ref? }                     │
         │                                          │

  TRANSPORT          TLS 1.3+, matching LOT-TERMINAL-M2M.md's existing
                     "Data Standards" clause. Device-side, a low-power
                     WiFi or BLE-to-hub radio (Section 09 BOM) carries
                     the connection; the exact radio choice is a
                     prototype-stage decision, not locked at v1.
  AUTHENTICATION     Operator token, provisioned once during setup
                     (paired via the companion software, see
                     docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md),
                     matching the existing `Authorization: Bearer
                     <operator_token>` scheme already documented for the
                     M2M intake endpoint.
  SESSION COMPRESSION Per S-2's brief ("compress the information in each
                     session"): the device does not stream continuously.
                     Each wake-push-log cycle is treated as one bounded
                     session — connect, receive or send one payload,
                     disconnect. Firmware buffers any queued Log events
                     (e.g. COPY presses while offline) and flushes them
                     as a single batched payload on next connect, rather
                     than holding a live connection open. This is
                     conceptually the same instinct behind the product's
                     existing Memory Engine compression work
                     (docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md)
                     applied to a battery-constrained device: say the
                     necessary thing once, then go quiet.

--------------------------------------------------------------------------------
07 // WEATHER SENSOR
--------------------------------------------------------------------------------

One onboard environmental sensor package — temperature, relative
humidity, barometric pressure — AI-grade off-the-shelf (Section 09), the
same class of part already named in the product's own hardware precedent
(docs/technical/LOT-NODE-0-RIG-SPEC.md's "AI-grade" sourcing standard
applied at rig scale; here at sensor scale). Readings ride the same LOT
API Connector session model as Section 06, folded into the periodic
device-status payload rather than a separate always-on stream — this
device is a pager first, a weather station second. Sensor fusion with
the wider LOT-TERMINAL-M2M.md "Multi-Sensor Array" format (Format 3) is
the natural home for this data once the device ships.

--------------------------------------------------------------------------------
08 // DATA MODEL — HOW A SESSION BECOMES A LOG
--------------------------------------------------------------------------------

    DEVICE WAKE (push received or button pressed)
         │
         ▼
    SESSION OPENS (Section 06 — bounded, not continuous)
         │
         ├── inbound: display_text  →  Screen (Section 04)
         ├── outbound: copy_event   →  Log tab (Section 05)
         ├── outbound: capture_ref  →  Log tab, if long-press (Section 03)
         └── outbound: env_reading  →  device-status payload (Section 07)
         │
         ▼
    SESSION CLOSES — radio powers down, screen holds last state
    (e-paper: zero-power hold; LCD class: sleeps until next wake)

This is the "session compression" S-2's brief names directly: nothing
about this device holds a persistent connection or streams continuously.
Every session is intake → classify → action → record, at device scale —
the identical four-step discipline already governing the LOT server side
in docs/technical/LOT-NODE-0-RIG-SPEC.md Section 04 ("INPUT → CLASSIFY →
ACTION → RECORD").

--------------------------------------------------------------------------------
09 // BILL OF MATERIALS — PER-UNIT, 100-UNIT RUN
--------------------------------------------------------------------------------

Prices are current street-range ESTIMATES for a 100-unit prototype/pilot
run, not confirmed quotes — the same disclosure standard
docs/technical/LOT-NODE-0-RIG-SPEC.md uses for its own BOM ("current
street ranges... both move week to week"). Real quotes are a Section 10
action item before any PO is cut. Vendor names are real, well-known
component/manufacturing suppliers; no specific SKU or deep product-page
link is asserted here, since none has been verified against current
availability.

```
COMPONENT             SPEC / CLASS                          VENDOR CLASS            EST. UNIT COST
─────────             ────────────                          ────────────            ──────────────
PCB fab + assembly    4-layer rigid, <=40mm x 40mm outline   PCBWay                  $8 – $18
                       (pcbway.com) — SMT assembly + fab
                       in one order, matched to a 100-unit
                       pilot MOQ

MCU / SoC             Low-power ARM Cortex-M/M-class SoC     Digi-Key / Mouser       $3 – $8
                       with integrated BLE or WiFi radio      (digikey.com,
                       (final part TBD at prototype stage)    mouser.com)

Camera module          2MP class, fixed-focus, automotive/   Digi-Key / Mouser /     $4 – $9
                       industrial-qualified sensor line        specialty camera-
                       (AI-grade — Section 09a)                module distributors

Display                E-paper or transflective LCD,          Digi-Key / Mouser /     $6 – $14
                       ~30-32mm active area, ultra-low         Good Display / Adafruit
                       standby power                            (adafruit.com)

Weather sensor         Combined temp/humidity/pressure,       Digi-Key / Mouser       $2 – $5
                       industrial-grade package (Section 09a)

Wireless charge coil   Qi-BPP receiver coil, low-profile      Digi-Key / Mouser /     $2 – $4
                       (<=1mm), matched to 5mm body height     Würth Elektronik

Battery                Thin-profile LiPo, capacity sized to   Digi-Key / cell         $2 – $5
                       fit remaining Z-height after coil        supplier direct
                       + PCB stack (exact mAh: prototype-
                       stage decision, Section 10)

Button (COPY)          Low-profile tactile switch, IP-rated   Digi-Key / Mouser       $0.50 – $1.50
                       cap, panel-mount through Face B

Stainless shell         2-piece SUS304, one CNC or stamped     PCBWay (metal          $10 – $25
(2 pieces)              per piece, one face mirror-polished,   fabrication service,
                        one face machined for camera/screen/    same vendor as PCB
                        button cutouts + gasket channel          fab) or a dedicated
                                                                  metal-shop partner
Fasteners + gasket      4x M1.4 stainless screws, silicone     McMaster-Carr /        $0.50 – $1.50
                        gasket ring                             PCBWay hardware add-on
──────────────────────────────────────────────────────────────────────────────
EST. TOTAL PER UNIT (components + shell, excl. NRE)            ≈ $38 – $91
100-UNIT RUN, COMPONENTS + SHELL ONLY                           ≈ $3,800 – $9,100
```

  09a — "AI-GRADE OFF-THE-SHELF" MEANS
    Per S-2's brief item 15: industrial- or automotive-qualified part
    grades (extended temperature range, tighter manufacturing tolerance,
    longer datasheet-guaranteed lifetime) rather than consumer/hobbyist
    grades, for the camera and weather sensor specifically. This is a
    sourcing standard, not a claim that any part itself runs AI — it
    means "graded for unattended, long-run reliability," the same
    standard docs/technical/LOT-NODE-0-RIG-SPEC.md applies to ECC memory
    on an always-on server, applied here to sensors on an always-carried
    device.

  NOT INCLUDED ABOVE (separate NRE / one-time costs)
    - PCBWay tooling / stamping die setup for the stainless shell
      (one-time, amortized across the 100-unit run — real figure
      requires a PCBWay/metal-shop quote, Section 10).
    - Firmware development, companion-software development (labor, not
      BOM — see the two companion documents, Section 12).
    - Certification (FCC/CE for the radio; not scoped at v1 — Section 11).
    - Packaging + the PDF manual print run, if physical copies are
      produced (Section 12 ships a digital PDF regardless).

--------------------------------------------------------------------------------
10 // ROADMAP — v0.1 → v1.0 → PILOT RUN
--------------------------------------------------------------------------------

  v0.1 — PAPER DESIGN (THIS DOCUMENT)
    Plan, BOM estimate, physical form, data model. No hardware exists
    yet. GATE: S-2 review + design lock on dimensions, face layout, and
    the two-document firmware/software split (Section 12).

  v0.2 — BREADBOARD PROTOTYPE
    Off-the-shelf dev boards (not the final 40x40x5mm shell) proving the
    four hard subsystems independently: (a) e-paper or LCD refresh from
    a server push, (b) camera capture + upload on button hold, (c) Qi
    charge-coil power budget inside the target battery capacity, (d) the
    bounded session model (Section 08) against the live M2M intake
    endpoint. GATE: all four subsystems independently working against
    real lot-systems.com infrastructure, even if not yet in one shell.

  v0.3 — FIRST FITTED PROTOTYPE
    Custom PCB (PCBWay fab, Section 09) fitted inside a 3D-printed or
    machined mockup shell at the true 40x40x5mm dimension — proves the
    Z-height budget actually closes with real components, not
    dev-board approximations. GATE: full assembly fits, powers on,
    completes one real end-to-end session (push → screen → COPY →
    Log tab entry) inside the target shell dimension.

  v1.0 — STAINLESS PILOT UNIT
    Final two-piece stainless shell (Section 02), both finishes
    (polished Face A, machined Face B), first units off PCBWay's metal
    fabrication line. GATE: 10 units built, 10/10 pass a basic
    reliability pass (charge cycle, camera capture, screen refresh,
    COPY-to-Log round trip) before committing to the full run.

  PILOT — 100-UNIT RUN
    Full BOM (Section 09) ordered at 100-unit MOQ once v1.0's 10-unit
    gate is clean. GATE: PCBWay quote confirmed in writing, firmware
    frozen (docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md marked
    RELEASE, not DRAFT), companion software's provisioning flow tested
    against at least one real operator account end-to-end.

--------------------------------------------------------------------------------
11 // OPEN ITEMS (do not silently resolve — decide, then update this doc)
--------------------------------------------------------------------------------

  - Camera privacy: no physical shutter or "armed" indicator specified
    yet (Section 03). Needs a decision before v0.3.
  - Radio choice (BLE-to-hub vs. onboard WiFi) not locked (Section 06)
    — directly affects battery budget and therefore the Z-height stack.
  - No IP/water/dust rating targeted at v1 (Section 02) — decide whether
    the pilot run needs one before committing to a gasket spec.
  - Regulatory certification (FCC/CE for the radio) not scoped anywhere
    in this document — required before any unit ships to an operator
    outside a controlled pilot.
  - brand.lot-systems.com, lot-systems.com/about, and
    institute.lot-systems.com/cqgs.html were requested reading sources
    that this session's network egress blocked (Section 00). Re-check
    against the live pages once reachable, in case brand or CQGS
    material has moved since the local snapshots this document relied on.
  - Real PCBWay quotes (PCB + stainless shell) not yet obtained — Section
    09's BOM is estimate-only.

--------------------------------------------------------------------------------
12 // COMPANION DOCUMENTS
--------------------------------------------------------------------------------

Per S-2's brief (items 9-11: firmware documents, software to connect
with firmware, kept as separate documents):

  docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md
    On-device firmware: MCU architecture, driver stack (display, camera,
    weather sensor, wireless charge management, COPY button), the
    session state machine (Section 08), OTA update path, and the LOT API
    Connector wire implementation (Section 06).

  docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md
    Server + companion-app side: the lot-systems.com endpoint that
    composes and pushes the pager text, the provisioning flow that pairs
    a physical unit to one operator token, and the Logs-tab write path
    the COPY button drives.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-v1
================================================================================
