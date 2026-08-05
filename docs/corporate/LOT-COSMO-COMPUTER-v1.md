================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-v1
TITLE:    COSMO® Computer — A Physical Companion for the LOT® Operator
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-05
VERSION:  1.0 — DEVELOPMENT START (PLAN + BOM + ROADMAP, PRE-MANUFACTURE)
STATUS:   PLANNING — no PCB spun, no PCBWay order placed
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is not the first hardware document at LOT. It is the second physical
product spec, and it exists specifically to NOT collide with the first. Before
writing a line of this plan, the following were read in full:

  docs/benchmark/LOT-MANIFEST.md
    Section 01 records a prior entry — "COSMO Hardware | brave-lamport-t9z5u8 |
    BEST | +2610 lines | COSMO® Cube — complete hardware computer design v1.0."
    That branch no longer exists on the remote (Section 04 note, 2026-06-27:
    "incorporated into master in prior sessions"), and no surviving file under
    that description was found on master. The name is real, the content is
    lost. This document is the reconstruction — written fresh, from S-2's
    2026-08-05 brief, not a recovery of the old branch's bytes.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The sibling hardware track. CUBIQ™ is a 45mm nano-ceramic cube that HOPS —
    a notification body with no screen, no camera, motion as its only
    language. Its own Section 00 already drew the line this document must
    hold: "CUBIQ™ is LOT®'s object: a notification body, not a computer... The
    two are related by lineage (father/son, LOT®/COSMO®) and should share no
    naming collision going forward." This document is the COSMO® side of that
    lineage — the object CUBIQ's authors were naming in advance.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Establishes the COSMO® brand itself: "COSMO® is the robotics product line
    of LOT Systems, named after Kuzya Cosmo Marmeladov." Names the Benchmark
    Arbitrage® gate, the Soul Sync Protocol™, and the Phase 3 revenue line
    ("COSMO® Hardware | 2028-2029 | $2,500-$5,000 per unit"). This document
    does not repeat that ethical/IP framing — it assumes it and builds the
    first physical SKU underneath it.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Section III, Layer 4 — Memory Arc: "12mo+ hardware" is the named milestone
    at which a subscriber's engagement graduates into a physical object. The
    Products row already names "Quantum Cube | Bioelectric hardware, haptic
    feedback, nano-ceramic, piezoelectric" — that line became CUBIQ. No line
    in CQGS yet named a device with a screen, a camera, and a button. This
    document opens that line.

  docs/corporate/LOT-CUBIQ-OPERATOR.md
    Section 04, "AI-Driven Physical Product Delivery," and Section 07 Phase 4
    ("Physical Extension, Days 90+") both describe the AI choosing WHAT/WHEN/
    HOW to reach the operator physically. CUBIQ answers that with motion. This
    document answers it with a message the operator can read.

  S-2 brief, 2026-08-05 (verbatim, 19-point logic list + free text)
    The controlling input for this document. Every section below traces back
    to a numbered point in that brief; Section 09 is the point-by-point
    traceability table.

No prior surviving document specifies a screen-bearing, camera-bearing,
LOT-API-connected device, a PCBWay manufacturing plan, or a components buying
list. This document is that specification, v1.0.

--------------------------------------------------------------------------------
01 // WHAT THE COSMO® COMPUTER IS AND IS NOT
--------------------------------------------------------------------------------

  NAME (WORKING)     COSMO® Computer — "the Puck." Formal SKU TBD at v1.0
                      close (Section 08 opens the naming decision; this
                      document does not lock a final consumer name).

  IT IS
    - A flat, silver, two-part stainless-steel object that sits on a desk,
      wirelessly charges, and shows the operator ONE short line of text when
      the LOT® Quantum Intent Engine (QI·46) decides they need to see it —
      "Coffee time!" being the brief's own example.
    - A small always-on edge computer, not a peripheral. It runs its own
      firmware, holds its own LOT API session, and can operate for a bounded
      window fully offline (Section 05) — it does not require the operator's
      phone or laptop to be open to receive a notification.
    - A physical extension of the Log tab already live at lot-systems.com —
      the single hardware BUTTON (Section 04) writes an event back into the
      same Logs.tsx military-handler pipeline that already renders
      journal_entry, badge_unlock, and cohort_signal events (verified in
      src/client/components/SystemProgressWidget.tsx and
      src/server/routes/api.ts /logs endpoint family). This is the one place
      in this document where "connected to the LOT site" is not aspirational
      — the target pipe already exists in the running application.
    - A camera-and-sensor node that feeds the same Calibration Loop CQGS
      already describes (Layer 1) — weather, presence, and an operator-
      initiated photo capture become deliberate + passive inputs, exactly
      the two input classes the Loop already expects.

  IT IS NOT
    - CUBIQ™. CUBIQ moves; COSMO® Computer does not actuate. No motor, no
      actuator, no jump. If a future unit needs to move, that capability
      belongs to the CUBIQ roadmap (v1-v3, already scoped), not this one.
    - A general-purpose consumer computer. It runs one application: the LOT®
      client. It is not a development board, not a tablet, not a phone
      replacement. Sideloading is out of scope for v1.
    - A phase-1 mass-market SKU. Per LOT_ROBOTICS_COSMO.md's own revenue
      table, COSMO® Hardware is a 2028-2029 line. This document plans the
      100-unit v1.0 pilot run (Section 06) that makes that later phase
      possible — not a consumer launch.

  THE PRINCIPLE
    Ship the smallest true object first. A silver square that charges
    wirelessly, shows one line of AI-chosen text, takes one photo on demand,
    and writes one button-press back to the Log tab is a complete v1.0. A
    device that also tries to be a general computer, a security camera, and
    a weather station with full historical charting before the single
    notification loop is proven end-to-end is not a v1.0 — it is a
    fundraising deck.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM (BRIEF POINTS 3, 4, 17, 18)
--------------------------------------------------------------------------------

  FOOTPRINT          40mm x 40mm x 5mm — "a flat silver square 4x4cm x 5mm
                      height" (brief point 4), read literally as the closed,
                      assembled dimension. 5mm is tight for the stack in
                      Section 03; Section 07 (roadmap) records where the
                      margin comes from.

  BODY                Two-part stainless-steel shell (brief point 3):
                        TOP SHELL   — polished stainless steel (brief point
                                      17). Mirror-finish face, no printing,
                                      no visible fasteners. This is the face
                                      that sits toward the room — an object,
                                      not a gadget.
                        BASE SHELL  — the working face (brief point 18):
                                      camera, screen, and button live here,
                                      bead-blasted matte stainless around the
                                      screen window to cut glare. The base
                                      also carries the wireless-charge coil
                                      window (Section 03) and rests against
                                      the charging pad.
                      Two-part construction is a manufacturing decision, not
                      a cosmetic one — it is the only way to seal a wireless-
                      charge-compatible metal(*) enclosure, route a camera and
                      display through 5mm of stack, and still hand-assemble
                      100 units without a laser-welder in the pilot run. See
                      Section 06 note on stainless-steel Qi charging.

  DISPLAY             Screen, base face (brief point 18, and the brief's own
                      close: "Simple screen to show autonomous notifications
                      ... e.g., 'Coffee time!'"). v1.0 target: monochrome or
                      3-color e-paper, ~1.5-2", inside the polished-stainless
                      window on the base shell. E-paper is chosen over an
                      LCD/OLED for three reasons that all trace to existing
                      LOT doctrine, not just battery life:
                        1. It holds an image with zero draw current between
                           refreshes — matching the CUBIQ anti-feed thesis
                           (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04): "a
                           blinking light is a screen substitute... this
                           preserves the anti-feed thesis." A screen that is
                           usually blank and occasionally states one fact,
                           once, is the OPPOSITE of a live feed.
                        2. It fits the 5mm stack — e-paper modules run
                           thinner than backlit LCD at this size class.
                        3. It reads in direct light on a desk near a window,
                           where a phone screen washes out.

  CAMERA              Base face, opposite the screen window (brief point 5,
                      18). Fixed-focus module, no gimbal, no zoom — one
                      forward-facing lens for operator-initiated capture
                      only (Section 05). No always-on recording; the camera
                      wakes on the BUTTON action or an explicit LOT API
                      command, never on a timer or a motion trigger. This is
                      a deliberate restriction, not a v1.0 hardware
                      limitation to be lifted later — see Section 08 gate.

  BUTTON              Base face, single mechanical button, labeled "Copy"
                      (brief point 16). Section 04 specifies its full signal
                      path.

  FINISH NOTE (*)     True 316-grade stainless is not RF-transparent — a
                      solid stainless base shell will attenuate the Qi
                      inductive charge field and any wireless radio inside
                      it (Section 03 BOM). v1.0 resolves this with a
                      machined non-metal (ABS/PC composite, stainless-
                      finish PVD coating) insert ring at the coil and
                      antenna window on the base shell, so the object reads
                      as "stainless steel body" (brief point 3) to the hand
                      and the eye while the charge and radio path stays
                      physically unobstructed. This compromise is recorded
                      here in the open — it is the single physical-form
                      constraint most likely to move in v1.1 (Section 07).

--------------------------------------------------------------------------------
03 // ELECTRONICS ARCHITECTURE
--------------------------------------------------------------------------------

  COMPUTE     Espressif ESP32-S3 (dual-core, Wi-Fi + BLE, hardware JPEG/
              camera interface, 8-16MB flash + 8MB PSRAM variant). Chosen
              over a heavier SBC (Raspberry Pi Zero class) because the whole
              job — hold a Wi-Fi session, poll/receive one LOT API channel,
              drive one e-paper panel, decode one still image, debounce one
              button — fits a microcontroller-class part inside a 5mm-thick,
              wirelessly-charged, battery-buffered enclosure. This is the
              central engineering bet of v1.0; Section 09 traceability
              table logs it against brief point 6.

  CAMERA      OV2640 or OV5640 module (2MP/5MP), SPI/DVP interface direct to
              the ESP32-S3's camera peripheral — the standard, off-the-shelf
              pairing (brief point 15: "AI grade off-the-shelf sensors" —
              read as "commodity-qualified parts, not custom silicon").

  DISPLAY     GDEY0154D67 class 1.54" tri-color or monochrome e-paper panel,
              SPI. Driven by the ESP32-S3 directly; no separate display MCU.

  WEATHER
  SENSOR      BME280 (temperature / humidity / barometric pressure),
              I2C — the same three-axis reading LOT-CUBIQ-OPERATOR.md
              Section 01 already lists under "PRESENCE: Weather and
              location context per session," now sourced locally on-device
              instead of purely from a remote weather API call. Satisfies
              brief point 14.

  CHARGING    Qi-class wireless receiver coil + PMIC (e.g. BQ51013B-class
              receiver into a single-cell LiPo charge controller), matched
              to the base-shell insert ring (Section 02). Satisfies brief
              points 12 and 19 as ONE system, not two — "Charger" and
              "Wireless charger" in the brief are the same physical
              subsystem (receiver in the Puck, transmitter pad sold as the
              companion charging base, itself the flat surface the Puck
              rests on — directly mirroring the CUBIQ "the charging pad IS
              the table" pattern already on record).

  BATTERY     Single-cell LiPo pouch, ~250-350mAh, the largest cell that
              clears the 5mm z-height stack alongside the coil and PCB.
              Buffers the unit through charge-pad gaps; not sized for
              all-day cordless operation — this is a desk object, expected
              to sit on its charging pad most of the time.

  BUTTON      Single mechanical tactile switch under the "Copy" cap
              (Section 04), wired to a dedicated GPIO with hardware
              debounce.

  CONNECTIVITY Wi-Fi (2.4GHz) for the LOT API connector (Section 05); BLE
              reserved for v1.0 provisioning only (pairing the unit to an
              operator's account via the existing lot-systems.com session,
              not a runtime data path).

  PCB         Single 4-layer rigid board, sized to the 40x40mm footprint
              minus shell wall thickness — realistically ~34x34mm usable —
              manufactured via PCBWay (brief point 1; full spec in Section
              06).

--------------------------------------------------------------------------------
04 // THE BUTTON — "COPY" SIGNAL PATH (BRIEF POINT 16)
--------------------------------------------------------------------------------

The brief specifies the button's label and its destination precisely: "Button
as 'Copy' with a signal back to the site's Log tab on lot-systems.com." This
is the one requirement in the brief that maps directly onto a pipeline already
running in the codebase — not a new concept, a new event source into an
existing one.

  WHAT "COPY" MEANS
    A single press captures the operator's current on-screen notification
    text (whatever is currently rendered on the e-paper, e.g. "Coffee time!")
    and pushes it — copies it — into the operator's LOT session as a logged
    acknowledgment. It is the physical equivalent of clicking a toast
    notification to dismiss-and-record it, except the object is not a
    screen the operator was already looking at.

  SIGNAL PATH
    BUTTON (GPIO interrupt)
        |
        v
    FIRMWARE debounces, reads currently-displayed notification ID
        |
        v
    LOT API CONNECTOR (Section 05) — POST device event, authenticated
    to the operator's session
        |
        v
    SERVER — new event type on the existing log-event pipeline
    (src/server/routes/api.ts /logs family; event shape follows the
    same pattern already handled by src/client/components/SystemProgressWidget.tsx's
    military-handler dispatch — journal_entry, badge_unlock, cohort_signal,
    etc. all resolve to one dispatch table keyed on event name)
        |
        v
    LOGS.TSX — new military handler, working name COPY:
    (device_notification_copy) — renders alongside the existing REC:,
    BADGE:, COHORT:, VITALS: handlers already listed in
    SystemProgressWidget.tsx's own build history
        |
        v
    Operator's Log tab at lot-systems.com shows: COPY: "Coffee time!"
    — device <id> — <timestamp>

  WHY THIS IS THE RIGHT SCOPE FOR v1.0
    One button, one event type, one new handler in an already-existing
    dispatch table. This is deliberately the smallest possible wiring of
    "hardware button -> site Log tab" — no new database table, no new
    subsystem, one row in a dispatch table that already has a dozen entries
    of exactly this shape. It is real engineering scope (Section 09 marks it
    ENGINEERING, not just CORPORATE), sized to be shippable inside a normal
    Benchmark cycle once firmware exists to call it.

--------------------------------------------------------------------------------
05 // THE LOT API CONNECTOR (BRIEF POINTS 2, 6)
--------------------------------------------------------------------------------

Brief point 6 says "Use LOT API connector"; brief point 2 says "Send a
pager-like notification from an AI-powered site." These are the same
subsystem read from two ends — the site pushes, the device receives, and the
same channel carries the button's event back up (Section 04). v1.0 defines
the connector as a single bidirectional channel, not two:

  DOWN-CHANNEL (site -> device) — THE PAGER
    QI·46 decides a notification should reach the operator (the same
    decision point LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 05 already diagrams
    for CUBIQ: "QI·46 CALIBRATION LOOP -> Index of Systems (signal fires)").
    Instead of driving an actuator, the signal is rendered to a short text
    string (<= ~20 characters at v1.0 e-paper size) and delivered to the
    device's provisioned session. Delivery is intentionally PAGER-CLASS —
    one short line, no rich payload, no images, no threading — because the
    brief's own language ("pager-like") is doing real design work here: a
    pager cannot become a feed. That constraint is a feature, not a v1.0
    limitation.

  UP-CHANNEL (device -> site) — TELEMETRY + THE COPY EVENT
    Weather-sensor readings (Section 03), the operator-initiated camera
    capture, and the Section 04 button event all travel the same up-channel
    into the existing log-event pipeline. This mirrors the CQGS Calibration
    Loop's own two-class input model (deliberate + passive) — the button
    press and the camera trigger are DELIBERATE inputs; the weather reading
    is PASSIVE, ambient, continuous-ish (polled, not streamed, to protect
    battery).

  TRANSPORT (v1.0)
    HTTPS long-poll or short-interval poll over Wi-Fi, authenticated with a
    per-device token issued at BLE provisioning time (Section 03). A
    persistent WebSocket / push channel is the named v1.1 upgrade
    (Section 07) once the poll-based loop is proven reliable in the field —
    same "prove the primitive before extending it" discipline the CUBIQ
    document already applies to its own roadmap.

  WHAT THIS DOCUMENT DOES NOT DO
    It does not specify the exact REST/WS route names, payload schema, or
    auth token format — that is server-side engineering work for the
    companion document, Section 10 below, and belongs to a normal Benchmark
    ENGINEERING session against the live src/server/routes tree, not to a
    corporate plan document. What is fixed here is the SHAPE of the
    connector: one pager-class down-channel, one telemetry-class
    up-channel, both authenticated to one operator session.

--------------------------------------------------------------------------------
06 // MANUFACTURING PLAN — PCBWAY, 100-UNIT PILOT RUN (BRIEF POINTS 1, 13)
--------------------------------------------------------------------------------

  FABRICATOR          PCBWay (brief point 1) — chosen at the brief level, not
                       re-litigated here. PCBWay's standard offering covers
                       everything this run needs from one vendor:
                         - PCB fabrication (4-layer, Section 03 spec)
                         - SMT assembly (PCBA) — populate the ESP32-S3,
                           camera module, PMIC, and passives
                         - CNC machining quote path for the two stainless-
                           steel shell halves (Section 02) — PCBWay's CNC
                           service handles small-run stainless machining,
                           which keeps the whole pilot run (board + shells)
                           inside one supplier relationship for v1.0, even
                           though CNC and PCBA are ordered as separate line
                           items in PCBWay's own ordering flow.
                       PCBWay instant-quote entry point:
                         https://www.pcbway.com/orderonline.aspx
                       PCBWay CNC machining entry point:
                         https://www.pcbway.com/rapid_prototyping.html

  RUN SIZE             100 units (brief point 13) — sized as a pilot: enough
                       to (a) qualify the SMT line and CNC tolerance stack
                       at real volume, (b) put units in front of Purple/
                       Black-tier operators per the Benchmark Arbitrage®
                       gate already defined in LOT_ROBOTICS_COSMO.md, and
                       (c) generate the first real BOM cost data before any
                       Phase-3 ($2,500-$5,000/unit, per LOT_ROBOTICS_COSMO.md)
                       pricing commitment is made. 100 is below PCBWay's
                       usual small-batch PCBA break-even efficiency curve —
                       expect the per-unit assembly cost to drop materially
                       at the next run (500-1,000 units), which is exactly
                       the kind of data point v1.0's pilot exists to produce.

  ASSEMBLY SEQUENCE    1. PCBWay fabricates + assembles (PCBA) the 34x34mm
                          4-layer board, 100 units.
                       2. PCBWay CNC-machines 100 top shells (polished) +
                          100 base shells (matte + insert ring, Section 02)
                          in 316 stainless steel.
                       3. E-paper module, camera module, battery, and Qi
                          receiver coil hand-fit into the base shell at LOT
                          (not PCBWay) for the pilot run — 100 units is
                          within hand-assembly range and keeps the delicate
                          fit-up (Section 02's 5mm stack) under direct LOT
                          QA rather than a remote line's tolerance.
                       4. Final shell-to-shell seal (screws or press-fit,
                          decided at first physical prototype, not in this
                          document) and firmware flash (Section 10) at LOT
                          before shipment.

  QA GATE              Every unit must pass, before shipment: (a) Qi charge
                       acceptance on the reference charging pad, (b) one
                       successful pager-class notification round-trip
                       against a LOT staging account, (c) one Copy-button
                       event observed landing in that staging account's Log
                       tab, (d) e-paper refresh with no visible ghosting.
                       This is the hardware analogue of the software
                       Benchmark green gate (docs/benchmark/ protocol) — no
                       unit ships red.

--------------------------------------------------------------------------------
07 // ROADMAP — v1.0 -> v1.1 -> v1.2 -> v2.0
--------------------------------------------------------------------------------

  v1.0 — THE PUCK (THIS DOCUMENT)
    Single ESP32-S3, e-paper pager display, fixed-focus camera, BME280
    weather sensor, one Copy button wired to the Log tab, Qi charging
    through a non-metal insert ring, PCBWay 100-unit pilot run.
    GATE: 100/100 units pass the Section 06 QA gate; 30 consecutive days
    of pager-notification delivery to at least 10 real Purple+ operator
    desks with zero unrecoverable firmware lockups.

  v1.1 — PERSISTENT CHANNEL + TRUE STAINLESS RF PATH
    Replaces the poll-based up/down channel (Section 05) with a persistent
    push connection. Opens material research into a genuinely RF-
    transparent stainless alloy or a thinner true-metal shell that doesn't
    need the Section 02 insert-ring compromise.
    GATE: notification latency under 2s at the 95th percentile across a
    50-unit fleet; insert-ring elimination prototyped in at least one
    material candidate.

  v1.2 — MULTI-GESTURE PAGER VOCABULARY
    CUBIQ ships four gestures from one hop primitive (NUDGE/HOP/LEAP/
    SETTLE). COSMO® Computer v1.2 does the display-side equivalent: beyond
    a single line of text, a small fixed icon set (weather glyph, badge-
    unlock glyph, memory-question glyph) so the pager channel can
    communicate signal CLASS at a glance, not just content — without
    crossing into the "screen substitute" territory the anti-feed thesis
    warns against (Section 02).
    GATE: icon set held to <= 6 total glyphs; user-tested for correct
    recognition at 90%+ without a legend.

  v2.0 — COSMO® / CUBIQ CONVERGENCE (RESEARCH TRACK, NOT SCHEDULED)
    Named here so v1.0-v1.2 electronics and enclosure choices are made with
    it in mind, not foreclosed: a future object that carries the Puck's
    screen/camera/API stack (this document) inside a body that can also
    perform CUBIQ's controlled hop (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section
    03). No mass, power, or mechanical-compatibility claim is made here —
    this is a horizon note, exactly as CUBIQ's own Section 06 treats
    levitation as a v.3 horizon rather than a build milestone.

--------------------------------------------------------------------------------
08 // NAMING, GATE, AND OPEN DECISIONS AT v1.0 CLOSE
--------------------------------------------------------------------------------

  NAMING OPEN          "COSMO® Computer" is a working name throughout this
                       document. It correctly carries the COSMO® mark
                       (LOT_ROBOTICS_COSMO.md) and correctly avoids the
                       CUBIQ™ collision (Section 00). A final consumer-
                       facing name is not locked in this document — record
                       candidates in a future session, do not invent one
                       here to avoid a false sense of finality.

  CAMERA GATE          No always-on capture, no motion trigger, no remote-
                       initiated capture without an explicit operator
                       action in v1.0. Loosening this gate is an explicit,
                       separate decision for a future document — it is
                       recorded here as a boundary specifically so no
                       future session drifts past it silently.

  STAINLESS/RF
  COMPROMISE           Section 02's insert-ring approach is the current
                       answer, flagged as the most likely thing to change
                       in v1.1 (Section 07). Not treated as settled.

  BOM AND ROADMAP
  ANALYSIS             Full component-by-component buying list, unit-cost
                       roll-up for the 100-unit run, and supplier links live
                       in the companion document (Section 10, item 2) —
                       kept separate per brief point 11 ("Separate
                       documents") rather than inlined here.

--------------------------------------------------------------------------------
09 // TRACEABILITY — BRIEF POINT TO DOCUMENT SECTION
--------------------------------------------------------------------------------

  #   BRIEF POINT                                    SECTION
  --  ----------------------------------------------  --------------------
  1   PCB Way                                          06
  2   Pager-like notification from AI-powered site      05 (down-channel)
  3   2 parts stainless steel body                      02
  4   Flat silver square 4x4cm x 5mm height              02
  5   Camera                                             02, 03
  6   Use LOT API connector                              05
  7   Result in PDF manuals                              10 (item 3)
  8   Compress the information in each session           this doc's own
                                                          Section 00/09
                                                          traceability
                                                          discipline; see
                                                          also LOT-SR
                                                          report, block 06
  9   Firmware documents                                 10 (item 1)
  10  Software to connect with firmware                  10 (item 1, LOT
                                                          API connector
                                                          client half)
  11  Separate documents                                 10 (doc split)
  12  Charger                                             03
  13  100 units run                                       06
  14  Weather sensor                                       03
  15  AI grade off-the-shelf sensors                      03
  16  "Copy" button -> Log tab signal                     04
  17  One side polished stainless steel                    02
  18  Other side: camera, screen, button                   02, 03, 04
  19  Wireless charger                                     03

  Free-text close (screen shows notifications, e.g. "Coffee time!")   02, 05

--------------------------------------------------------------------------------
10 // COMPANION DOCUMENTS (BRIEF POINT 11 — SEPARATE DOCUMENTS)
--------------------------------------------------------------------------------

Per the brief's own instruction to keep documents separate, this plan does
not inline firmware, software, or the BOM. Companion set, v1.0:

  1. docs/technical/LOT-COSMO-COMPUTER-FIRMWARE-v1.md
     On-device firmware architecture: boot, provisioning, e-paper driver,
     camera capture path, button debounce + Copy event, weather-sensor
     poll loop, LOT API connector client (device side).

  2. docs/corporate/LOT-COSMO-COMPUTER-BOM-v1.md
     Full components buying list — part numbers, quantities for the
     100-unit run, supplier links, and a unit-cost roll-up.

  3. docs/technical/LOT-COSMO-COMPUTER-SOFTWARE-v1.md
     Server + client (lot-systems.com) side of the LOT API connector: the
     down-channel notification dispatcher, the up-channel log-event
     ingestion (Section 04's Copy path), and the Log tab handler addition.

  4. PDF manuals (brief point 7) — generated from documents 1-3 and this
     plan, filed alongside their source .md in the same folders.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-v1
================================================================================
