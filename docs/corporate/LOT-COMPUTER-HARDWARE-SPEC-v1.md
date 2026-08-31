<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-HARDWARE-SPEC-v1
TITLE:    COSMO® Cube v1.0 — The LOT Computer
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-31
VERSION:  1.0 — PLAN, BOM POINTER, ROADMAP (PRE-HARDWARE, DESIGN LOCK PENDING)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This document was commissioned directly by S-2 (Vadik Marmeladov) as a
19-point build brief: plan → BOM → roadmap for a physical hardware computer
connected to lot-systems.com. Before writing a line of spec, the following
were read in full:

  docs/benchmark/LOT-MANIFEST.md
    Line 31: "COSMO Hardware | brave-lamport-t9z5u8 | c7d353ef | 14/14 |
    BEST | 7 | +2610 | COSMO® Cube — complete hardware computer design
    v1.0." This is the FIRST reference to a COSMO® Cube hardware computer
    in the corpus — 2,610 lines across 7 files, marked BEST (ship
    candidate), never marked SHIPPED. The branch `brave-lamport-t9z5u8`
    does not exist in this repository (`LOT-Computer`) — it was cut in a
    different repo checkout and was never migrated here. Its content is
    UNRECOVERABLE from this working tree. This document does not
    reconstruct that lost branch; it re-opens the COSMO® Cube v1.0 line
    item from the task brief forward, in this repository, which is now
    the dedicated home for the hardware computer track (repo name:
    LOT-Computer).

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    Line 49-56, its own reading log entry on LOT-MANIFEST.md: "CUBIQ™ is
    LOT®'s object: a notification body, not a computer... related by
    lineage (father/son, LOT®/COSMO®) and should share no naming
    collision going forward." CUBIQ (motion-only, no screen, no camera,
    LOT® brand) and COSMO® Cube (screen + camera + button, general-
    purpose computer, COSMO® brand) are DELIBERATELY DISTINCT hardware
    lines. This document is the COSMO® Cube line. It borrows CUBIQ's
    proven doctrine pieces where they generalize cleanly (table-as-
    power-surface, motion/light restraint, nano-ceramic/stainless
    material register) but does not merge the two products.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    The COSMO® brand's founding document: named for Kuzya Cosmo
    Marmeladov, "a robot that carries the behavioral fingerprint of its
    owner." COSMO® Cube v1.0 is Phase 0 of that roadmap — a stationary,
    non-actuated computer, not yet the Phase 3 robot (2028-2029,
    $2,500-$5,000/unit) named in that document's revenue table. Building
    the Cube first de-risks the sensor stack, the LOT API connector, and
    the manufacturing partner relationship before COSMO® attempts
    anything that moves under its own power.

  docs/technical/OS_API.md
    The existing `/api/os/*` surface (status, version, insights,
    performance, diagnostics, config) is the CONSUMER-facing read side of
    a LOT profile. Section 05 of this document defines the WRITE side the
    Cube needs — a hardware-originated event reaching a user's Log — and
    proposes it as a new, clearly-marked extension rather than assuming
    it already exists.

  docs/corporate/LOT-TERMINAL-M2M.md and docs/corporate/LOT-TERMINAL-SYNC.md
    The existing machine-to-machine intake protocol (device_id, operator,
    sensors[], timestamp; WebSocket real-time / HTTPS batch fallback) is
    the correct shape for the Cube's own telemetry. Section 05 of this
    document reuses this protocol rather than inventing a new one.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    Precedent for how this corpus writes a from-scratch hardware BOM:
    named components, street-price ranges, a build-order sequence, and an
    explicit floor/serious/max cost table. LOT-COMPUTER-BOM-v1.md (this
    document's companion) follows that format.

  docs/corporate/LOT-TERMINAL-VISION.md
    "Complexity → Simplicity" and the S-2 operator progression. The Cube
    is the first LOT® object an S-2 operator can build from a kit and
    then plug into a full commercial profile — the hardware embodiment of
    `lot hardware init` → `lot systems connect`.

  README.md (this repo)
    LOT is self-care through proactive, context-aware AI; the Memory
    Engine "asks the right question at the right moment." The Cube is the
    physical channel for that same proactivity, off the phone screen.

No prior document in this repository specifies a two-piece stainless
enclosure, a camera, a screen, a dedicated wireless-charging plate, or a
100-unit pilot run for the COSMO® Cube. This document is that
specification, v1.0.

--------------------------------------------------------------------------------
01 // WHAT v1.0 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  v1.0 IS:
    - A pager-class hardware computer: it receives one-way, AI-composed
      notifications from lot-systems.com ("Coffee time!") and displays
      them on a small screen. It is not a two-way chat device and does
      not run a general app store.
    - A single physical object built from two CNC-machined stainless
      steel shells, one polished, one carrying the active face (camera,
      screen, button).
    - Paired at all times with a companion object: a flat silver charging
      plate, 40mm x 40mm x 5mm, that is both the Cube's Qi-class wireless
      charger and its resting anchor — the same "table is the power
      surface" doctrine CUBIQ already established (LOT-CUBIQ-QUANTUM-
      CUBE-v0.md, Section 02).
    - A LOT API client: every notification it shows, every button press
      it registers, and every sensor reading it takes either originates
      from, or is reported back to, a specific LOT user's profile.
    - A 100-unit pilot manufacturing run, PCB and enclosure sourced
      through PCBWay, sized to prove the design before any larger
      commitment.

  v1.0 IS NOT:
    - COSMO® the robot (docs/corporate/LOT_ROBOTICS_COSMO.md). The Cube
      does not move, does not carry a "soul transfer," and requires no
      Benchmark Arbitrage® gate. It is Phase 0 infrastructure for that
      later product, not the product itself.
    - CUBIQ (docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md). The Cube has a
      screen and a camera; CUBIQ deliberately has neither. Do not merge
      the two specs or the two SKUs.
    - A general-purpose smart-home camera or a security appliance. The
      camera's job (Section 03) is on-device presence/gesture sensing for
      the notification and pairing flow, not continuous recording or
      cloud video streaming.

  THE PRINCIPLE
    Ship the smallest true pager first. A Cube that reliably shows one AI
    notification, logs one button press back to lot-systems.com, and
    survives a 100-unit build without a hardware revision is a complete
    v1.0. A Cube that also tries to stream video, run local inference
    models, or double as a COSMO® robot brain before the pager primitive
    is proven is not v1.0 — it is a mood board.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  BODY               Two-part stainless steel (SUS304, brushed base /
                      polished option) shell, CNC-machined, precision-fit
                      with four M2 stainless screws through the base
                      shell into PEM inserts in the top shell — no
                      adhesive, so a unit is field-serviceable.
  FOOTPRINT           45mm x 45mm x 18mm assembled (fits inside the
                      40mm x 40mm charging-plate footprint with a 2.5mm
                      reveal on each side, so the plate is visually the
                      Cube's base, not a separate object on the desk).
  FACE A — POLISHED   Mirror-polished stainless, no seams, no printing.
                      This is the "resting" face — when the Cube is not
                      actively notifying, this is the face left showing.
                      Reprises CUBIQ's anti-feed thesis in metal: a
                      polished surface asks nothing of the operator.
  FACE B — ACTIVE     Camera (Section 03), round display (Section 03),
                      and the "Copy" button (Section 05), arranged on a
                      matte-finish inset panel so the mirror face and the
                      display face are never the same surface — a user
                      physically rotates the Cube between "quiet" and
                      "readable" states, a deliberate, tactile mode
                      switch with no software toggle.
  CHARGING PLATE      40mm x 40mm x 5mm flat silver plate (anodized
                      aluminum, not stainless — aluminum is the correct
                      material for an embedded Qi coil; stainless
                      attenuates the induction field). Houses the Qi
                      transmitter coil, a USB-C input, and a single
                      status LED at the plate's edge (pairing/charge
                      state only — same restraint rule as CUBIQ Section
                      02: light is secondary and utilitarian).
  WEIGHT TARGET       <95g Cube assembled, <60g plate.
  INGRESS             IP42 (splash-resistant, not submersible) — a desk
                      object, not an outdoor sensor node; Section 03's
                      weather sensor reads ambient room/near-window
                      conditions, it does not require outdoor placement.

--------------------------------------------------------------------------------
03 // ELECTRONICS AND SENSOR STACK
--------------------------------------------------------------------------------

Every component below is an off-the-shelf, qualified part — no custom
silicon, no bespoke sensor fab. This is a deliberate constraint: v1.0's
job is to prove the LOT API connector and the pager notification loop,
not to prove a new sensor. See LOT-COMPUTER-BOM-v1.md for exact part
numbers, suppliers, and 100-unit pricing.

  COMPUTE            ESP32-S3 (dual-core, Wi-Fi + BLE 5, hardware JPEG/
                      camera interface, AI-instruction extensions for
                      on-device wake-word / gesture inference). Single
                      SoC — no separate applications processor. Keeps
                      BOM cost and firmware surface area small for v1.0.
  DISPLAY            1.28" round IPS/AMOLED, 240x240, SPI — round to
                      match the Cube's mirror-face geometry visually
                      when both faces are viewed edge-on. Renders short
                      AI-composed text only (e.g. "Coffee time!"), never
                      a scrolling feed — this is a pager, not a phone.
  CAMERA             OV2640 (2MP, JPEG-capable) — used for on-device
                      presence detection (is anyone at the desk) and a
                      one-time QR pairing scan during setup. No
                      continuous video is stored or streamed off-device
                      in v1.0; presence is a boolean signal, not a frame.
  WEATHER SENSOR      BME280 (temperature, humidity, barometric
                      pressure) — feeds the same weather block already
                      shown on LOT public profiles (README.md, Public
                      Profile System) with a physically local reading
                      instead of a geocoded API call, and doubles as an
                      M2M-eligible intelligence source (docs/corporate/
                      LOT-TERMINAL-M2M.md Format 3, "environmental
                      monitoring").
  AI-GRADE SENSORS    Off-the-shelf, chosen for edge-AI compatibility,
                      not for novelty:
                        - LD2410 mmWave presence/micro-motion sensor
                          (through-desk-safe, no camera required for
                          basic "someone is here" detection — the
                          camera stays off unless presence is already
                          confirmed by mmWave, a privacy-first sensor
                          order)
                        - ICS-43434 MEMS microphone, single, local
                          wake-word only (no continuous audio capture or
                          upload — matches LOT-TERMINAL-M2M.md's "no
                          personal health data in M2M protocol" rule,
                          extended here to "no raw audio leaves the
                          device")
                        - LIS2DH12 3-axis accelerometer (desk-bump /
                          pickup detection, orientation-aware display
                          wake)
  WIRELESS CHARGING   Qi receiver IC (BQ51013B-class) + coil in the
                      Cube base shell; Qi transmitter IC (BQ500410A-
                      class) + coil in the charging plate. USB-C PD input
                      on the plate only — the Cube itself has no exposed
                      charge port, consistent with the sealed, seamless
                      two-shell design in Section 02.
  BATTERY             400mAh Li-Po pouch cell, UL1642-certified,
                      protection-circuit included — enough for
                      multi-day standby between plate visits given the
                      pager's low duty cycle (screen wakes only to show
                      a notification or a button-press confirmation).
  BUTTON              Single tactile switch under the Face B inset,
                      IP-rated membrane cap, silk-printed "COPY"
                      (Section 05).

--------------------------------------------------------------------------------
04 // FIRMWARE / SOFTWARE SPLIT (SEPARATE DOCUMENTS)
--------------------------------------------------------------------------------

Per the brief's explicit instruction ("Firmware documents," "Software to
connect with firmware," "Separate documents"), the Cube's stack is
documented as two independent manuals, not one combined technical doc:

  docs/technical/LOT-COMPUTER-FIRMWARE-MANUAL-v1.md
    What runs ON the ESP32-S3: drivers, power management, the
    notification-render loop, the button IRQ handler, OTA update
    mechanism, and the on-device session-compression buffer (Section 06).

  docs/technical/LOT-COMPUTER-SOFTWARE-MANUAL-v1.md
    What runs OFF the Cube: the phone/web pairing flow, the LOT API
    connector service, the notification composition path (which piece of
    lot-systems.com decides WHAT/WHEN to send — reusing the AI-driven
    physical product delivery model in docs/corporate/LOT-CUBIQ-
    OPERATOR.md Section 04), and the Log-tab write endpoint (Section 05).

This document (LOT-COMPUTER-HARDWARE-SPEC-v1.md) stays mechanical/
electrical/manufacturing only and does not duplicate either manual.

--------------------------------------------------------------------------------
05 // LOT API CONNECTOR — THE PAGER LOOP AND THE "COPY" BUTTON
--------------------------------------------------------------------------------

  INBOUND (lot-systems.com → Cube) — THE PAGER NOTIFICATION
    An AI-composed short message (the Memory Engine, QOS mode changes, or
    a scheduled Job — see README.md's Memory Engine and QOS sections) is
    queued server-side against a specific device_id, exactly as
    docs/corporate/LOT-TERMINAL-SYNC.md already queues procurement
    notifications to an S-2 operator. Delivery path: WebSocket
    (wss://sync.lot-systems.com/hardware/notify, real-time) with HTTPS
    long-poll fallback — the same real-time/batch hybrid mode already
    specified in LOT-TERMINAL-SYNC.md Section "Sync Modes." Example
    payload:

    {
      "device_id": "cosmo-cube-000042",
      "type": "pager_notification",
      "text": "Coffee time!",
      "source": "memory_engine",
      "ttl_seconds": 600
    }

  OUTBOUND (Cube → lot-systems.com) — THE "COPY" BUTTON
    Pressing COPY does exactly one thing: it appends the Cube's current
    notification (if the screen is showing one) or a bare presence event
    (if not) as a new entry in the operator's LOT Log — the same Log
    surface `src/client/utils/logTriggers.ts` already parses for slash-
    command triggers. This is a NEW endpoint, proposed here as an
    extension of the existing OS API surface (docs/technical/OS_API.md),
    not something already implemented in this repo:

    POST /api/log/hardware-append          [NEW — proposed]
    Authorization: Bearer <device_token>
    {
      "device_id": "cosmo-cube-000042",
      "event": "copy_button",
      "payload_text": "Coffee time!",
      "timestamp": "2026-08-31T14:02:11Z"
    }

    Response mirrors the M2M intake pattern already specified in
    LOT-TERMINAL-M2M.md:
    { "status": "accepted", "log_entry_id": "log_9f21ac" }

    A pressed COPY button is a single physical action that becomes a
    single Log entry — no batching, no editing after the fact. This
    keeps the hardware's write surface as small and auditable as the
    LOT-NODE-0-RIG-SPEC.md transparency layer requires of any system
    acting on a user's behalf ("no silent writes").

  DEVICE IDENTITY
    Each Cube is provisioned once, at first plate-charge, with a
    device_token scoped to exactly one LOT user profile — mirroring the
    S-2 operator registration flow in LOT-TERMINAL-SYNC.md. A Cube with
    no bound profile shows only a single idle message ("Not yet paired —
    open lot-systems.com/hardware") and accepts no button input beyond
    re-pairing.

--------------------------------------------------------------------------------
06 // SESSION COMPRESSION DOCTRINE
--------------------------------------------------------------------------------

"Compress the information in each session" (brief, item 8) is implemented
at two layers, both required for v1.0:

  ON-DEVICE (firmware layer — see firmware manual Section 04)
    A "session" is one wake cycle: presence detected → notification shown
    or button pressed → screen sleeps. Rather than streaming every raw
    sensor sample, the firmware buffers one session into a single
    compact record (delta-encoded BME280/LD2410/LIS2DH12 readings,
    notification id, button state, timestamp) and flushes ONE record per
    session over the LOT API connector — not a continuous telemetry
    firehose. This is the same discipline named in docs/technical/
    MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md for the software Memory
    Engine, applied to hardware: densify before you transmit.

  SERVER-SIDE (software layer — see software manual Section 03)
    Each compressed session record is itself folded into the user's
    Memory Story rather than stored as raw device telemetry — the Cube
    contributes to "what patterns emerge in your self-care" (README.md)
    the same way a journal entry or mood check-in does, not as a separate
    unreadable data lake.

--------------------------------------------------------------------------------
07 // MANUFACTURING — PCBWAY, 100-UNIT PILOT RUN
--------------------------------------------------------------------------------

  PCB FABRICATION      2-layer, 0.8mm FR-4, ENIG finish, via PCBWay
                      (pcbway.com) — chosen per brief item 1. PCBWay
                      quotes and assembles both the PCB and SMT
                      population (turnkey) from a single BOM/Gerber
                      upload, which keeps a 100-unit pilot to one vendor
                      relationship instead of splitting fab and assembly.
  ENCLOSURE            Stainless shells CNC-machined by a metal-parts
                      vendor (PCBWay also offers CNC machining as a
                      service alongside PCB fab — evaluate as a single-
                      vendor option before splitting to a dedicated
                      metal shop). Polishing (Face A) and bead-blasting
                      (Face B inset) are separate finishing passes after
                      machining.
  PILOT SIZE           100 units (brief item 13) — large enough to
                      amortize the one-time tooling costs (stencil,
                      fixture, CNC program) across a meaningful sample,
                      small enough that a design flaw found in unit #40
                      does not sink a warehouse of stock.
  DFM GATE             No unit ships in the 100-run until: (a) five hand-
                      built prototypes pass a 500-cycle button-press +
                      wireless-charge-cycle test, (b) the two-shell
                      tolerance stack is confirmed to close with a
                      consistent, rattle-free fit across a 10-unit
                      sample, (c) the LOT API connector round-trip
                      (notification in, COPY event out, Log entry
                      created) is verified end-to-end on real
                      lot-systems.com infrastructure, not a mock server.
  COST POINTER         Full component-level and 100-unit-run costing is
                      in LOT-COMPUTER-BOM-v1.md — this document does not
                      duplicate the BOM table.

--------------------------------------------------------------------------------
08 // ROADMAP — v1.0 → PILOT → SCALE
--------------------------------------------------------------------------------

  v1.0 — THE PAGER (THIS DOCUMENT)
    Two-shell stainless enclosure, ESP32-S3 + round display + camera +
    weather/presence/motion sensors, Qi charging plate, LOT API
    connector (inbound notification, outbound COPY-to-Log), on-device
    session compression. Firmware and software manuals shipped as
    separate documents. 100-unit pilot run through PCBWay.
    GATE: 100/100 units pass the Section 07 DFM gate; 30-day field test
    across a subset of Usership-tier LOT accounts with zero un-paired
    bricking incidents and zero lost COPY events.

  v1.1 — MULTI-GESTURE NOTIFICATION LANGUAGE
    Reuse CUBIQ's four-gesture vocabulary concept (LOT-CUBIQ-QUANTUM-
    CUBE-v0.md Section 04) as a LIGHT/DISPLAY vocabulary instead of a
    motion vocabulary — the Cube does not move, but the display can
    differentiate "urgent" vs "ambient" notifications the way CUBIQ
    differentiates NUDGE vs LEAP. Requires no new hardware.

  v1.2 — LOCAL WAKE-WORD + ON-DEVICE GESTURE INFERENCE
    Exercises the ESP32-S3's AI instruction extensions properly (v1.0
    only uses the mmWave sensor for boolean presence). Still no cloud
    audio/video — inference stays on-device, only the resulting label
    (e.g. "wave detected") crosses the LOT API connector.

  v2.0 — SCALE MANUFACTURING (RESEARCH TRACK, NOT A BUILD MILESTONE)
    Named as the horizon, not committed here. Candidate directions:
    injection-molded polymer variant (cost-reduced SKU alongside the
    stainless flagship) and a second PCBWay run sized from actual v1.0
    field-test defect data rather than an estimate. No gate criteria yet.

--------------------------------------------------------------------------------
09 // DOCUMENTATION SET (THIS BUILD CYCLE)
--------------------------------------------------------------------------------

  docs/corporate/LOT-COMPUTER-HARDWARE-SPEC-v1.md   this document
  docs/corporate/LOT-COMPUTER-BOM-v1.md              components, links, 100-unit costing
  docs/technical/LOT-COMPUTER-FIRMWARE-MANUAL-v1.md  firmware (on-device)
  docs/technical/LOT-COMPUTER-SOFTWARE-MANUAL-v1.md  software (LOT API connector)
  docs/corporate/LOT-COMPUTER-USER-MANUAL-v1.md      end-user manual
  docs/corporate/pdf/LOT-COMPUTER-USER-MANUAL-v1.pdf rendered PDF (brief item 7)
  docs/corporate/pdf/LOT-COMPUTER-HARDWARE-SPEC-v1.pdf rendered PDF (brief item 7)
  docs/LOT-SR-20260831-01.md                         this session's report

--------------------------------------------------------------------------------
10 // BRAND
--------------------------------------------------------------------------------

COSMO® Cube v1.0             The object (this document's subject)
LOT Computer                 This repository's working name for the product line
COSMO®† LOT®                 The combined mark — hardware carries the COSMO®
                              brand (per LOT_ROBOTICS_COSMO.md), the connector
                              and account are LOT®

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COMPUTER-HARDWARE-SPEC-v1
================================================================================
