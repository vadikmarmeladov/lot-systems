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
TITLE:    COSMO® Computer — Physical Companion Computer, v1.0 Plan
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-19
VERSION:  1.0 — PLAN LOCK (PRE-HARDWARE, PROTOTYPE NOT YET ORDERED)
STATUS:   PHASE 0 — SPEC + BOM + ROADMAP (this document + companion BOM)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is not a new invention. It is the next layer poured on top of work
already on record. Before writing a line of spec, the following were read:

  docs/benchmark/LOT-MANIFEST.md
    Section 01 lists "COSMO Hardware | brave-lamport-t9z5u8 | ... | COSMO®
    Cube — complete hardware computer design v1.0" as a BEST candidate
    (+2610 lines, 7 files). That branch no longer exists on the remote —
    superseded/pruned before this document. This session runs on the same
    branch-name lineage (claude/brave-lamport-ksg6yx) and treats itself as
    the direct continuation of that hardware track, rebuilt from the
    current state of the corpus rather than a lost diff.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    Line 49-56 draws the boundary this document depends on: "a sibling,
    textually distinct hardware track ... COSMO® Cube ... under Kuzya's
    COSMO® brand. That is a general-purpose hardware computer. CUBIQ™ is
    not that object. CUBIQ™ is LOT®'s object: a notification body, not a
    computer." This document is the general-purpose object CUBIQ-v0
    named and set aside. The two share a charging-pad-as-surface pattern
    (Section 03 below) by lineage, not by copy-paste.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Establishes the COSMO® brand register: named for Kuzya Cosmo
    Marmeladov, gated by the Benchmark, never a general-purpose assistant
    with no owner profile. COSMO® Computer v1 is upstream of the
    "COSMO® Robot" vision in that document — it is the first COSMO®
    object a LOT® account can actually own, not a Purple-tier-gated
    robot. It carries the brand's restraint (Section 01 below) without
    inheriting the robot's eligibility gate.

  docs/corporate/LOT_QI46_ENGINE.md (line 110, line 750-764)
    Names "bioelectric hardware, haptic feedback, nano-ceramic,
    piezoelectric" as the Institute's hardware material vocabulary, and
    defines the Month-12 milestone where a physical object reports back
    into the Calibration Loop. COSMO® Computer reuses this loop shape
    (Section 08) for its own, different payload: pager notifications out,
    button-press + sensor telemetry in.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md (line 28, 47-50, 180)
    "Quantum Certified Factory" — psychotronic sensors, a factory that
    can feel the raw material — sets the register for Section 06's sensor
    stack: instrumentation chosen because it senses the room the device
    sits in, not because it is decorative. Row "Quantum Cube Hardware |
    ... | PLANNED" is the CUBIQ line item; this document opens the
    parallel COSMO® line item explicitly.

  docs/corporate/LOT-CUBIQ-OPERATOR.md
    Confirms the existing LOG terminal command surface
    (/breathe /fast /silent /freeze /phys, per LOT-MANIFEST.md
    "LOG Terminals v56") that the Section 07 "Copy" button extends with
    one more physical-to-digital command.

No prior document in this corpus specifies enclosure geometry, a bill of
materials, a manufacturing partner, or a documentation package for a
general-purpose COSMO® hardware object. This document is that
specification, v1.0.

--------------------------------------------------------------------------------
01 // WHAT v1 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  v1 IS:
    - A locked mechanical + electronic architecture for a small desk
      object: two-part stainless steel body, camera, screen, one button,
      wireless charging, WiFi link to lot-systems.com.
    - A device whose only job is to receive a short AI-composed line of
      text from the Index of Systems and show it ("Coffee time!"), and to
      let the operator push exactly one thing back — a button press that
      writes one line to their own Log tab.
    - The sensor, compute, and enclosure stack every later COSMO®
      Computer capability (more sensors, richer notifications, the
      eventual COSMO® Robot soul-sync in LOT_ROBOTICS_COSMO.md) is built
      on top of.

  v1 IS NOT:
    - A general AI assistant with a microphone, speaker, or open-ended
      chat surface. It has one screen, one button, one direction of
      autonomous output (notification) and one direction of operator
      input (the Copy button). Anything else is out of scope for v1.
    - The COSMO® Robot from LOT_ROBOTICS_COSMO.md. That object requires
      a Purple-tier Benchmark soul-sync gate and does not exist yet as
      hardware. COSMO® Computer v1 has no eligibility gate — any LOT®
      account can pair one. It is the accessible, un-gated first object
      in the COSMO® hardware line.
    - A finished product. v1 is PLAN LOCK: this document + the BOM
      document (LOT-COSMO-COMPUTER-BOM-v1.md) + the roadmap (Section 11).
      No PCB has been ordered, no enclosure has been machined, no unit
      exists. Phase 1 (Section 11) is where a soldering iron first
      touches a component.

  THE PRINCIPLE
    Ship the smallest true thing first, same discipline as
    LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 01. A puck that shows one line
    of AI-composed text and logs one button press, reliably, on real
    stainless steel, charging wirelessly off a real pad, is a complete
    v1. A device that also listens, also talks, also streams video
    before that loop is proven is not v1 — it is a pitch deck.

--------------------------------------------------------------------------------
02 // NAME AND BRAND POSITION
--------------------------------------------------------------------------------

  PRODUCT NAME     COSMO® Computer
  MODEL CODE       CC-1 (COSMO Computer, generation 1)
  BRAND OWNER      COSMO® (Kuzya Cosmo Marmeladov, per LOT_ROBOTICS_COSMO.md)
  PLATFORM OWNER   LOT® (lot-systems.com — the AI-powered site that
                    composes and sends the notification)
  RELATION TO CUBIQ  Sibling, not the same object. CUBIQ™ is LOT®'s
                    notification body (motion-language, no screen, no
                    camera — LOT-CUBIQ-QUANTUM-CUBE-v0.md). COSMO®
                    Computer is COSMO®'s general-purpose companion
                    computer (screen, camera, sensors, one button). They
                    may sit on the same desk. They do not share a shell,
                    a firmware image, or a name.

--------------------------------------------------------------------------------
03 // PHYSICAL FORM — TWO-PART STAINLESS STEEL BODY
--------------------------------------------------------------------------------

  BODY             42mm diameter x 16mm height puck, two halves split at
                    the equator, joined by four M1.6 stainless screws
                    into internal PCB standoffs (serviceable — not
                    ultrasonic-welded, so a unit can be reopened for
                    firmware-era repair or battery replacement).
  MATERIAL          304 stainless steel, both halves. 316L held as an
                    upgrade option for the 100-unit run if PCBWay CNC
                    quoting favors it (Section 09) — better corrosion
                    resistance for a desk object that gets touched daily.
  MASS TARGET       <60g fully assembled (puck only, excludes the
                    charging pad) — light enough to reposition on a desk
                    one-handed without feeling like a paperweight.

  FACE A — "The Quiet Side" (point 17)
    Mirror-polished stainless steel, no cutouts, no seams beyond the
    equator joint. This is the side that faces up when the device is
    simply present and not signaling — reflective, calm, the physical
    expression of the anti-feed thesis (LOT-CUBIQ-VISION.md Section 01:
    "LOT® invests attention and returns structure"). A polished mirror
    is not a feature. It is the absence of one.

  FACE B — "The Working Side" (point 18)
    Bead-blasted (matte) stainless steel, three cutouts:
      - Camera window, top-center, 6mm aperture, IR-cut glass
      - Screen window, center, matched to the OLED module (Section 05)
      - Button bore, bottom-center, for the COPY button (Section 07)
    Matte finish on this face is functional, not stylistic: it hides
    fingerprints around the button the polished face would show.

  CHARGING PAD — "The Square" (point 4, unifies points 12 and 19)
    40mm x 40mm x 5mm flat square, brushed aluminum (silver, matches the
    puck's stainless tone without being the same alloy — aluminum
    machines faster and cheaper for a passive charging shell that never
    needs corrosion resistance beyond a desk surface). Houses a Qi
    transmitter coil + driver IC, USB-C input on the trailing edge.
    Same design pattern as LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02's
    charging interface ("the charging pad IS the table") — deliberately
    reused because two LOT/COSMO desk objects (CUBIQ cube, COSMO puck)
    should be able to share one physical charging language, even though
    they never share firmware.

--------------------------------------------------------------------------------
04 // COMPUTE
--------------------------------------------------------------------------------

  MCU              Espressif ESP32-S3-WROOM-1-N16R8 (16MB flash / 8MB
                    PSRAM). Dual-core, WiFi + BLE, native camera (DVP)
                    interface, enough PSRAM to run Espressif's own
                    person-detection TFLite-Micro reference model
                    on-device (Section 06).
  WHY THIS CHIP     Off-the-shelf, second-source available (multiple
                    module vendors on the same silicon), well-documented
                    OTA and camera pipeline, and — because PCBWay both
                    fabricates and assembles boards — a chip PCBWay's
                    SMT line stocks routinely, keeping the 100-unit run
                    (Section 09) inside PCBWay's standard parts library
                    rather than a custom sourcing request.
  STORAGE           Firmware + OTA slot on the module's own flash. No
                    external storage in v1 — no photo/video is retained
                    on-device (Section 06, camera is inference-only).

--------------------------------------------------------------------------------
05 // SCREEN — THE PAGER
--------------------------------------------------------------------------------

  DISPLAY          1.3" monochrome OLED, SH1106 driver, 128x64, I2C.
  WHY MONOCHROME    A pager shows one line, not a photo. Monochrome OLED
                    draws a fraction of the power a color LCD would,
                    which matters on a 400mAh cell charged wirelessly
                    off a 40mm pad — and it is legible at a glance from
                    across a desk, which a dim color panel is not.
  BEHAVIOR          Off (blank, zero draw) until a notification arrives
                    from lot-systems.com (Section 08). On arrival: wakes,
                    renders up to two lines of AI-composed text
                    (e.g. "Coffee time!"), holds for a configurable dwell
                    (default 15s), sleeps. No clock, no icons, no idle
                    UI — the screen's only job is the pager message.

--------------------------------------------------------------------------------
06 // SENSORS
--------------------------------------------------------------------------------

  CAMERA (point 5)
    OV2640, 2MP, DVP interface direct to the ESP32-S3. Inference-only in
    v1: runs Espressif's person-detection reference model on-device to
    produce a single boolean ("someone is at the desk") that feeds the
    notification-timing logic in Section 08. No frame is ever uploaded,
    stored, or streamed off-device in v1 — this is a hardware fact, not
    a policy toggle, matching LOT_ROBOTICS_COSMO.md's "This is not
    surveillance" register applied to a camera-bearing object for the
    first time in this corpus.

  WEATHER SENSOR (point 14)
    Bosch BME280 — temperature, humidity, barometric pressure. I2C,
    same bus as the OLED and the sensors below. Feeds ambient context
    into the notification loop (Section 08) — a "Coffee time!" message
    composed on a cold morning is a different signal than the same
    words on a warm afternoon, and the AI-powered site is the thing
    that gets to make that call, not the firmware.

  AI-GRADE OFF-THE-SHELF SENSORS (point 15)
    - Sensirion SGP40 — VOC index (air quality), onboard signal
      processing (Sensirion ships a calibrated "VOC Index" output, not
      raw resistance — the "AI-grade" qualifier in the brief maps
      cleanly onto instruments that already do on-chip inference rather
      than raw analog sensors the firmware would have to model itself).
    - ROHM BH1750 — ambient light (lux), digital I2C output.
    - ST LSM6DS3TR-C — 6-axis IMU (accelerometer + gyroscope) —
      detects a tap or pickup gesture on the puck, used to suppress a
      queued notification if the operator is visibly already holding
      the device (no double-signal).

  BUS               All sensors + the OLED share one I2C bus (SDA/SCL),
                    each at a distinct address — keeps the PCB to two
                    signal traces for the entire sensor stack and keeps
                    the 100-unit BOM (LOT-COSMO-COMPUTER-BOM-v1.md)
                    inside components PCBWay stocks or can source without
                    a customer-supplied-parts surcharge.

--------------------------------------------------------------------------------
07 // THE COPY BUTTON (point 16)
--------------------------------------------------------------------------------

  SWITCH            Omron B3F-1000 tactile switch, stainless steel cap
                    (custom-machined, engraved "COPY"), IP54-rated boot
                    beneath the cap to keep the bore in Face B dust- and
                    splash-resistant.

  WHAT ONE PRESS DOES
    A single press does exactly one thing: it takes whatever the device
    is currently showing (the live notification text, if the screen is
    lit; otherwise a timestamped "moment marker" if the screen is dark)
    and POSTs it, once, to the LOT API (Section 08). The API appends one
    line to the operator's own Log tab on lot-systems.com.

  WHY "COPY," NOT "LOG"
    The verb matters. This is not the device logging on the operator's
    behalf, continuously, the way a fitness tracker would. It is the
    operator choosing, with one deliberate physical press, to copy a
    moment out of ambient life and into their own record — the same
    "physical before it is digital" principle LOT-CUBIQ-QUANTUM-CUBE-v0.md
    Section 07 names for CUBIQ's THE LEAP gesture, applied here to an
    input instead of an output. No press, no log line. Ever.

  DEBOUNCE + RATE LIMIT
    250ms hardware debounce (RC + firmware). Rate-limited to one accepted
    press per 5s at the firmware layer — a device sitting in a bag
    against a hard object should not flood the Log tab.

--------------------------------------------------------------------------------
08 // LOT API CONNECTOR (point 6)
--------------------------------------------------------------------------------

Two endpoints, both authenticated by a per-device pairing token issued
at first setup (paired to exactly one LOT® account, revocable from the
account's device settings — no COSMO® Computer talks to two accounts,
and no account's data is visible to a device that isn't theirs).

  OUTBOUND — lot-systems.com -> device (pager notification, point 2)
    POST https://lot-systems.com/api/device/notify
    Payload: { deviceId, text (<=2 lines / ~40 chars), ttlSeconds,
               composedBy: "lot-ai" }
    The AI-powered site decides WHAT and WHEN, same authority pattern as
    LOT-CUBIQ-OPERATOR.md Section 04 ("AI-Driven Physical Product
    Delivery" — the AI decides what/when/how). The firmware is a dumb
    renderer: it never composes text, it only displays what it is sent.

  INBOUND — device -> lot-systems.com (Copy button, point 16)
    POST https://lot-systems.com/api/device/log-signal
    Payload: { deviceId, capturedText, source: "copy-button",
               deviceTelemetry: { tempC, humidityPct, luxLevel,
               vocIndex, presenceDetected } }
    Appends one line to the operator's Log tab and, per the QI-46
    Calibration Loop pattern (LOT_QI46_ENGINE.md line 750-764,
    LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 05), feeds ambient telemetry
    back into the Index of Systems as context for the next notification
    the AI composes — the loop closes the same shape CUBIQ's loop closes,
    with a different payload.

  TRANSPORT         WiFi (device-side), HTTPS/TLS to lot-systems.com,
                    same auth surface as the rest of the platform — no
                    new backend service, one new route pair on the
                    existing LOT API.

--------------------------------------------------------------------------------
09 // MANUFACTURING (points 1, 13)
--------------------------------------------------------------------------------

  PARTNER          PCBWay — PCB fabrication, PCBA (assembly), and CNC
                    machining for the stainless steel + aluminum
                    enclosure parts, all from one vendor. Full sourcing
                    plan, per-part costing, and quote-request checklist
                    live in the companion document:
                      docs/corporate/LOT-COSMO-COMPUTER-BOM-v1.md

  SCOPE OF WORK REQUESTED FROM PCBWay
    1. PCB fab — 2-layer, ENIG finish, ~30mm diameter round board to
       fit the 42mm puck with clearance for standoffs.
    2. PCBA — full turnkey assembly (PCBWay-sourced parts where
       possible; BOM document flags the handful of parts PCBWay may
       need to source as customer-supplied).
    3. CNC machining — Face A (polished), Face B (bead-blasted, 3
       cutouts), charging pad (aluminum, brushed) — three distinct CNC
       line items, one quote request.
    4. Finishing — mirror polish on Face A only; bead blast on Face B
       and the charging pad; laser engrave "COPY" on the button cap.

  RUN SIZE (point 13)
    100 units, single pilot batch. Not a DFM-validated pre-production
    run of 5-10 (that is Phase 2, Section 11) — 100 is the committed
    first production quantity once Phase 2's prototype passes its gate.
    PCBWay is quoted at both 10-unit (Phase 2) and 100-unit (Phase 3)
    tiers in the BOM document so the marginal cost step is visible
    before Phase 3 is committed.

--------------------------------------------------------------------------------
10 // DOCUMENTATION PACKAGE (points 7, 9, 10, 11)
--------------------------------------------------------------------------------

Three separate documents, deliberately not merged into one (point 11).
Each has a different reader and a different update cadence, so keeping
them apart means updating firmware behavior never requires touching the
customer-facing manual, and vice versa.

  1. USER MANUAL (PDF) — point 7
     Reader: the operator who receives a physical unit.
     Contents: unboxing, pad + puck placement, pairing flow (account
     token, Section 08), what each face means (Section 03), what one
     Copy-button press does (Section 07) and does not do, care/cleaning
     for the polished face, safety (button is not waterproof beyond the
     IP54 boot; do not submerge).
     Format: generated as a PDF from a maintained source doc, same
     pattern as scripts/generate_badge_pdf*.py already in this repo —
     Phase 3 (Section 11) adds scripts/generate_cosmo_computer_manual_pdf.py
     following that existing convention rather than a new one-off tool.

  2. FIRMWARE DOCUMENT — point 9
     Reader: whoever flashes, updates, or debugs a unit.
     Contents: boot sequence, OTA update flow and rollback, the I2C bus
     map (Section 06), sensor polling cadence, screen wake/sleep state
     machine (Section 05), Copy-button debounce/rate-limit (Section 07),
     pairing-token storage and revocation behavior.
     Lives at: docs/corporate/LOT-COSMO-COMPUTER-FIRMWARE-v1.md
     (opened in Phase 1, Section 11 — firmware does not exist yet to
     document in Phase 0).

  3. SOFTWARE DOCUMENT — point 10
     Reader: whoever maintains the lot-systems.com side of the LOT API
     connector (Section 08).
     Contents: the two endpoints in full (auth, payload schema, rate
     limits), how notification composition selects text from the Index
     of Systems, how log-signal telemetry feeds the Calibration Loop,
     device pairing/revocation admin flow.
     Lives at: docs/corporate/LOT-COSMO-COMPUTER-API-v1.md
     (opened in Phase 1, Section 11 — the route pair does not exist yet).

  SESSION COMPRESSION DOCTRINE — point 8
     Every working session on this hardware track appends one new,
     compressed report to docs/assembly/ (additive-only per
     LOT-MANIFEST.md's protected-files rule — never edits a prior
     session's file). Each report is short: what changed since the last
     one, what gate it clears, what the next session reads first. This
     document and the BOM document are the "base" a session report
     compresses against, the same relationship LOT-WIKI-v87
     (docs/assembly/2026-08-05_LOT-assembly_wiki-v87.md) has to
     docs/wiki/LOT-WIKI-v86.md. First entry in this lineage:
     docs/assembly/2026-08-19_LOT-assembly_cosmo-computer-v1.md

--------------------------------------------------------------------------------
11 // ROADMAP — PHASE 0 -> 1 -> 2 -> 3 -> 4
--------------------------------------------------------------------------------

  PHASE 0 — PLAN LOCK (THIS DOCUMENT)
    Spec, BOM, manufacturing partner, documentation plan, first assembly
    log. No hardware ordered.
    GATE: this document + LOT-COSMO-COMPUTER-BOM-v1.md both committed
    and internally consistent (every point in the original 19-point
    brief traceable to a section — see Section 12).

  PHASE 1 — BREADBOARD PROTOTYPE
    Off-the-shelf dev boards (ESP32-S3-DevKitC + OV2640 breakout + SH1106
    breakout + BME280/SGP40/BH1750/LSM6DS3 breakouts) wired on a
    breadboard, no enclosure. Firmware v0.1: notification render loop +
    Copy-button POST working end-to-end against a real lot-systems.com
    dev endpoint. Opens the firmware and software documents (Section 10).
    GATE: a real "Coffee time!" string sent from lot-systems.com renders
    on the OLED within 2s, and a real button press appends a real Log
    tab line, 20/20 trials.

  PHASE 2 — PCBWay PROTOTYPE RUN (5-10 UNITS)
    Custom 2-layer PCB (Section 04-06 integrated), PCBWay PCBA, first-
    article CNC enclosure halves (Section 03) — not yet finish-polished,
    DFM validation pass. Firmware v0.5.
    GATE: 5 assembled units, each passing the Phase 1 gate individually,
    plus a 48-hour wireless-charging soak test (pad + puck) with zero
    charge-interruption faults.

  PHASE 3 — 100-UNIT PILOT MANUFACTURING RUN (point 13)
    Full PCBWay production order per Section 09: 100 puck PCBAs, 100
    Face-A + Face-B enclosure pairs (mirror-polished + bead-blasted),
    100 charging pads. Firmware v1.0. Full documentation package
    (Section 10) finalized and shipped with every unit — user manual
    PDF included in the box, firmware + software documents published
    internally.
    GATE: 100/100 units pass the Phase 2 gate at incoming inspection;
    zero enclosure finish rejects beyond a 5% cosmetic-reject allowance
    (industry-standard for a first stainless CNC run).

  PHASE 4 — LOT API CONNECTOR GA
    The two Section 08 endpoints move from dev-only to the general LOT
    API surface — any paired COSMO® Computer in the field can receive
    AI-composed notifications and write Copy-button signals under
    normal platform load, monitored the same way the rest of the LOT
    API is monitored.
    GATE: 30 consecutive days in production with the existing platform
    SLA, zero pairing-token security incidents.

--------------------------------------------------------------------------------
12 // BRIEF TRACEABILITY (19-point brief -> section)
--------------------------------------------------------------------------------

   1  PCB Way                              -> Section 09
   2  Pager-like notification, AI site     -> Section 05, Section 08 (outbound)
   3  2 parts stainless steel body         -> Section 03
   4  Flat silver square 4x4cm x 5mm       -> Section 03 (Charging Pad)
   5  Camera                               -> Section 06
   6  LOT API connector                    -> Section 08
   7  Result in PDF manuals                -> Section 10.1
   8  Compress information each session    -> Section 10, Session Compression Doctrine
   9  Firmware documents                   -> Section 10.2
  10  Software to connect with firmware    -> Section 10.3
  11  Separate documents                   -> Section 10 (three distinct docs)
  12  Charger                              -> Section 03 (Charging Pad)
  13  100 units run                        -> Section 09, Phase 3
  14  Weather sensor                       -> Section 06
  15  AI grade off-the-shelf sensors       -> Section 06
  16  "Copy" button -> Log tab signal      -> Section 07, Section 08 (inbound)
  17  One side polished stainless steel    -> Section 03, Face A
  18  Other side: camera, screen, button   -> Section 03, Face B
  19  Wireless charger                     -> Section 03 (Charging Pad)

--------------------------------------------------------------------------------
13 // BRAND
--------------------------------------------------------------------------------

COSMO® Computer                The object — CC-1, generation 1
LOT® API Connector             The link — the only way a CC-1 talks to
                                anything, always back to its one paired
                                lot-systems.com account
COSMO®† LOT®                   The combined mark on the charging pad
                                underside (engraved, not printed)

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-v1
================================================================================
