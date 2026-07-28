================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: COSMO-CUBE-HARDWARE-COMPUTER-v1
TITLE:    COSMO® Cube — Hardware Computer Build Plan, BOM, and Roadmap
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-28
VERSION:  1.0 — PLAN LOCK (PRE-PROTOTYPE)
STATUS:   PLAN — components sourced and priced, no metal cut yet
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is the first hardware BUILD PLAN for the general-purpose LOT hardware
computer already named in the record. It is not a new invention — it closes
a line item that has existed in the manifest since June 2026. Before writing
a line of spec, the following were read in full:

  docs/benchmark/LOT-MANIFEST.md, line 31
    "COSMO Hardware | brave-lamport-t9z5u8 | 14/14 | BEST | ... | COSMO® Cube
    — complete hardware computer design v1.0." The manifest's closing note
    (line 190-193) claims this was "incorporated into master in prior
    sessions" — but no file matching that description exists anywhere in
    this repository's current tree or reachable git history. This document
    is written to actually close that gap: the plan the manifest referenced
    did not survive, or never existed as a committed artifact. This is the
    first COMMITTED version. This session's own branch, claude/brave-lamport-
    v9zxq1, continues the exact "brave-lamport" codename lineage the manifest
    already assigned to "COSMO hardware iterations" — this is that series,
    picked back up.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 00
    Already drew the line this document must not cross: "CUBIQ™ is LOT®'s
    object: a notification body, not a computer." CUBIQ hops. It has no
    screen, no camera, no general compute — motion is its entire notification
    language, by design (anti-feed thesis). Everything in this document is
    the OTHER object the CUBIQ reading log flagged as a sibling: a
    general-purpose hardware computer, under COSMO® branding, WITH a screen
    and a camera. The two ship lines must never collide in naming.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Defines COSMO® as "the robotics product line of LOT Systems, named after
    Kuzya Cosmo Marmeladov," and lays out a four-phase revenue path where
    "Phase 3: COSMO® Hardware (2028-2029)" is a $2,500-5,000 companion-robot
    product gated behind a Purple-tier Benchmark score. THIS document is
    smaller and sooner than that: a $60-110 BOM desk appliance, not a soul-
    bearing companion robot. It is a legitimate step on the COSMO® hardware
    path (Phase 2->3 groundwork: it is the first COSMO-branded object with a
    screen, a camera, and a LOT API connection actually specified to the
    component level) but it does not claim Phase 3's soul-transfer framing.
    That gate stays where LOT_ROBOTICS_COSMO.md put it.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    Style and rigor precedent for a hardware BOM document in this repo:
    dollar-ranged component tables, a numbered build sequence, named
    "floor / serious / max" tiers. This document borrows that structure for
    a very different class of hardware (a $100-class desk appliance instead
    of a $5,600 inference server).

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Row "Quantum Cube Hardware | Hardware feedback integration (Month 12+) |
    PLANNED" (line 180) is the same open line item CUBIQ's v0 document
    opened for the LOT-branded jumping cube. This document opens the
    equivalent line for the COSMO-branded general-purpose unit. Section III
    also names the "COSMO Node" ethics-enforcement layer this device must
    report through, not around.

  docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
    The "Virtuous Compression Cycle" (Section 2): USER ACTIVITY -> CONTEXT
    CAPTURE -> PROMPT BUILD -> inference -> QUESTION -> answer compresses
    the profile. Point 8 of the build brief ("compress the information in
    each session") is not a new mechanism to invent — it is this existing
    cycle, extended to accept hardware telemetry as an additional context-
    capture channel (Section 08 below).

  docs/technical/LOT-TERMINAL-VISION.md
    S-2 designation, "ROBOT, ETS." milestone language, the open-source /
    commercial dual-track model. This device is a Track 2 object: built to
    a LOT® Systems commercial spec from day one, not a Terminal community
    kit — but the assembly-manual tone (Section 10) borrows Terminal's
    "safe enough for a 9-year-old" clarity standard.

  src/client/components/ContextualPromptsWidget.tsx, line 232;
  src/client/queries.ts, line 134
    The actual, already-shipped API this hardware must call. `POST
    /api/logs { text: string }` writes a row the Log tab already renders
    (`useLogs`, `/api/logs`, GET with query params in
    SystemProgressWidget.tsx line 1487). Point 6 and Point 16 of the brief
    are not speculative — they name a real, existing endpoint. Section 07
    below specifies exactly what the hardware needs to add to call it
    safely from an unattended device.

  EXTERNAL — brand.lot-systems.com, lot-systems.com/about,
  institute.lot-systems.com/cqgs.html
    All three returned HTTP 403 to this session's fetch (proxy-blocked or
    auth-gated at time of writing — 2026-07-28). Their content is not lost:
    CQGS-WHITE-PAPER-SNAPSHOT.md above is filed explicitly as the
    institute.lot-systems.com/cqgs.html mirror, and LOT-STYLE-GUIDE.md
    (docs/technical/) is this repository's local mirror of brand.lot-
    systems.com's visual language (Terminal Grid cadence, no emojis,
    opacity hierarchy, "periods over symbols"). Both were read in full and
    inform the tone and structure of this document. A future session with
    live access to those three URLs should diff this document against them
    and append corrections to Section 17 rather than editing history above.

--------------------------------------------------------------------------------
01 // WHAT THIS IS AND WHAT THIS IS NOT
--------------------------------------------------------------------------------

  THIS DOCUMENT IS:
    - A component-level BOM, a manufacturing plan, and a four-stage roadmap
      for a small COSMO®-branded desk appliance: a two-piece stainless
      steel body, a 4x4cm wireless charging base, a camera, a round screen,
      and one physical button, connected to lot-systems.com over WiFi.
    - The plan that turns the manifest's dangling "COSMO® Cube — complete
      hardware computer design v1.0" line item into an actual, sourced,
      priced, buildable object.

  THIS DOCUMENT IS NOT:
    - CUBIQ™. CUBIQ hops; it has no screen and no camera. This device
      never hops, never moves, and its whole notification language is a
      few lines of text on a small round display. See Section 00.
    - The COSMO® companion robot named in LOT_ROBOTICS_COSMO.md Phase 3.
      That is a $2,500-5,000 soul-carrying robot gated behind a Purple-tier
      Benchmark score, targeted 2028-2029. This is a $60-110 desk appliance
      with no behavioral-signature transfer, buildable in 2026.
    - A finished, cut, or assembled unit. Zero units exist. This is the
      plan a prototype build session executes next.

  THE NAME
    Working name for this document and the object: COSMO® Cube (hardware
    computer). If a v0.1 prototype session finds the cube geometry wrong
    for the screen/camera/button face layout (Section 02), the object may
    be renamed before tooling is cut — nothing below is a trademark filing,
    it is a build plan.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM — TWO-PART STAINLESS BODY + CHARGING BASE
--------------------------------------------------------------------------------

  OVERALL         55mm x 55mm x 22mm shell (two halves, split on the long
                  axis — see below), sitting on a separate charging base.

  FACE A          POLISHED STAINLESS STEEL (brief point 3, 17)
    One half of the shell is a mirror-polished 304 stainless steel cap —
    no ports, no seams visible from outside, no branding beyond a laser-
    etched LOT® mark. This is the face shown when the device sits idle,
    screen-down or screen-away from the operator. Pure material honesty:
    weight and cold-to-the-touch metal are the "presence" cue on this face,
    the same register CUBIQ's shell material line already established
    (nano-ceramic there, polished 304 here — a deliberate material
    difference between the two product lines, not a shared shell spec).

  FACE B          THE INSTRUMENT FACE (brief point 3, 18)
    The other half of the shell is machined 304 stainless with three
    cutouts: a round display window, a camera aperture, and a single
    button bore. This is the operating face — the one the operator looks
    at and touches.

    - SCREEN    1.28" round IPS, GC9A01 driver, 240x240, SPI. Text-only
                rendering discipline (Section 08) — never a feed, never a
                scroll.
    - CAMERA    OV2640 or OV5640, DVP interface, facing out through a
                sapphire or hardened-glass window set flush in the
                stainless.
    - BUTTON    Single 12mm waterproof stainless momentary switch (brief
                point 16), labeled "COPY" — see Section 07 for what it
                does.

  CHARGING BASE   FLAT SILVER SQUARE (brief point 4, 12, 19)
    40mm x 40mm x 5mm, brushed stainless or anodized aluminum, silver
    finish. Houses the Qi transmitter coil + driver only — it is a passive
    charging pad, not a second compute node (unlike CUBIQ's charging pad,
    which doubles as the object's future locomotion surface — this base
    has no such requirement, since this device never moves). The cube
    sits on the base to charge; no cable is ever connected to the cube
    itself.

  MASS TARGET     <180g fully assembled (heavier than CUBIQ's <120g target
                  deliberately — this object is meant to sit still, not
                  leap, so mass is not fought as an engineering constraint
                  here the way it is in the CUBIQ document).

--------------------------------------------------------------------------------
03 // ELECTRONICS ARCHITECTURE
--------------------------------------------------------------------------------

```
                    ┌─────────────────────────────┐
                    │   FACE B (instrument face)   │
                    │                              │
   Camera ──────────┤  OV2640/OV5640 (DVP)         │
                    │        │                     │
   Screen ──────────┤  GC9A01 240x240 (SPI)         │
                    │        │                     │
   Button ──────────┤  GPIO, debounced (Sec. 07)    │
                    │        │                     │
                    │  ┌─────▼──────────────┐       │
                    │  │  ESP32-S3-WROOM-1  │       │
                    │  │  (dual-core, WiFi, │       │
                    │  │   AI vector ext.)  │       │
                    │  └─────┬──────────────┘       │
                    │        │ I2C                  │
   Weather sensor ──┤  BME680 (temp/hum/press/VOC)  │
                    │        │                      │
                    │  BQ51013B Qi receiver ◄────────┼── coupled to base coil
                    │        │                      │
                    │  LiPo 400mAh + charge mgmt     │
                    └─────────────────────────────┘
                              │ WiFi
                              ▼
                    lot-systems.com  /api/logs, /api/device/* (Sec. 07)
```

  WHY ESP32-S3
    Single chip covers camera (DVP), display (SPI), WiFi client, and has
    INT8 vector instructions for on-device inference (ESP-DL / Edge
    Impulse) — the "AI grade" qualifier in brief point 15 is satisfiable
    on-chip for simple models (presence detection, wake-on-camera) without
    a second AI accelerator. This mirrors the RIG-SPEC document's own
    principle (docs/technical/LOT-NODE-0-RIG-SPEC.md, Section 00): keep
    the thinking close to the metal you own, at whatever scale the object
    calls for.

--------------------------------------------------------------------------------
04 // BILL OF MATERIALS — PROTOTYPE (BENCH, QTY 1)
--------------------------------------------------------------------------------

Bench-testable off-the-shelf modules, before any custom PCB is designed.
Used to validate the electronics architecture (Section 03) before
committing to CNC'd stainless and a custom board.

```
PART                          SOURCE / LINK                                    EST. PRICE
────                           ─────────────                                    ──────────
ESP32-S3 cam+display board     Waveshare ESP32-S3-CAM-OV5640                    $20-28
  (bench substitute for the    https://www.waveshare.com/esp32-s3-cam-ov5640.htm
  custom-PCB MCU+camera pair)
ESP32-S3 round display board   Waveshare ESP32-S3-Touch-LCD-2 (camera-ready     $18-25
  (alt., has onboard screen)   header)
                                https://www.waveshare.com/esp32-s3-touch-lcd-2.htm
1.28" round LCD (standalone)   GC9A01 240x240 SPI module (RAKSTORE/DIYables)    $6-9
                                https://www.amazon.com/dp/B0BNXD2LJW
BME680 breakout                Adafruit BME680 STEMMA QT                       $20-25
  (weather + AI-grade sensor)  https://www.adafruit.com/product/3660
                                (also: Grove BME680, cheaper in bulk,
                                https://wiki.seeedstudio.com/Grove-Temperature_Humidity_Pressure_Gas_Sensor_BME680/)
Qi wireless receiver module    Adafruit Universal Qi Receiver (BQ51013B-class)  $8-10
                                https://www.adafruit.com/product/1901
                                (also: Seeed Grove Qi receiver, 5V/0.5A alt.,   $6-8
                                https://www.seeedstudio.com/Qi-General-Wireless-Charger-Receiver-5V-0-5A.html)
12mm stainless momentary btn   Geekworm PSW12 waterproof metal switch           $3-5
                                https://geekworm.com/products/psw12
LiPo 400mAh + charge circuit   Generic 402530 cell + TP4056-class charger       $4-6
                                (Digi-Key/Mouser/Adafruit, part-number TBD
                                at detailed design)
────────────────────────────────────────────────────────────────────────────
BENCH PROTOTYPE TOTAL (electronics only, no shell)         ≈ $60-90
```

--------------------------------------------------------------------------------
05 // MANUFACTURING — THE STAINLESS BODY (PCB WAY, BRIEF POINT 1)
--------------------------------------------------------------------------------

PCBWay is used for BOTH halves of the build, deliberately — one vendor,
two of its service lines:

  1. CUSTOM PCB + ASSEMBLY (SMT turn-key)
     Once the bench prototype (Section 04) validates the electronics
     architecture, the ESP32-S3-WROOM-1 module, OV2640, GC9A01, BME680,
     and BQ51013B move from dev-board form onto one custom PCB, fabbed
     and assembled by PCBWay's turn-key SMT service.
       Quote entry:     https://www.pcbway.com/pcb-assembly.html
       Order flow docs:  https://www.pcbway.com/helpcenter/Findproducts/How_do_I_place_a_pcb_assembly_order_.html
       Required files:  Gerbers, BOM, centroid/pick-place file.

  2. CNC MACHINING — STAINLESS STEEL SHELL (Face A, Face B, charging base)
     PCBWay's CNC service machines all three stainless parts (polished
     Face A, cutout Face B, brushed charging base) from the same vendor
     relationship, grade 304:
       Service page:  https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/
       304 grade:     https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/
       Quote entry:    https://www.pcbway.com/rapid-prototyping/manufacture/?type=1
     Finish options confirmed available: as-milled, spray paint, anodize,
     brushed — Face A is ordered "mirror/polished," Face B and the base
     "brushed," per Section 02.

  ONE VENDOR, TWO LINES — WHY
    Single point of quality accountability across board and shell,
    consolidated shipping for a 100-unit run (Section 06), and a single
    relationship to manage revisions against as the prototype iterates.

--------------------------------------------------------------------------------
06 // 100-UNIT PILOT RUN — COST TABLE
--------------------------------------------------------------------------------

Rough order-of-magnitude only — actual figures require a PCBWay RFQ
against a finished Gerber/BOM/CAD set, which does not exist yet (Status
line, header). Figures below are for planning the pilot budget, not a
purchase order.

```
LINE ITEM                              UNIT COST (100pcs, EST.)   RUN TOTAL (EST.)
─────────                              ────────────────────────   ────────────────
Custom PCB, bare (2-layer, small)       $2-4                        $200-400
SMT assembly (turn-key, ~8 parts)       $8-15                       $800-1,500
ESP32-S3-WROOM-1 module (bulk)          $3.50-5                     $350-500
OV2640 camera module (bulk)             $3-5                        $300-500
GC9A01 1.28" round LCD (bulk)           $4-6                        $400-600
BME680 (bulk, direct from distributor)  $6-9                        $600-900
BQ51013B Qi receiver circuit (on-PCB)   $2-3                        $200-300
LiPo 400mAh cell + charge mgmt          $2-3                        $200-300
12mm stainless button (bulk)            $1.50-2.50                  $150-250
CNC stainless shell, 3 parts/unit       $10-18                      $1,000-1,800
Charging base assembly                  $4-6                        $400-600
Final assembly + test + packaging       $5-8                        $500-800
─────────                              ────────────────────────   ────────────────
ESTIMATED UNIT COST                     $52-84                      —
ESTIMATED 100-UNIT RUN TOTAL             —                           $5,100-8,450
```

  READING THIS TABLE
    Per-unit cost lands near the RIG-SPEC document's own "floor" framing —
    a real number, not a marketing number, and one that should get
    replaced with an actual PCBWay quote the moment Gerbers exist. Nothing
    above accounts for tooling/NRE (CNC fixtures, stencils) — PCBWay's
    online RFQ tools (Section 05 links) fold that into the per-unit price
    at quote time; it is not broken out here because it depends on final
    part geometry, which is not locked yet.

--------------------------------------------------------------------------------
07 // THE BUTTON — "COPY" — AND THE LOT API CONNECTOR
--------------------------------------------------------------------------------

Brief points 6 and 16 name a real, already-shipped endpoint (Section 00):

    POST /api/logs { text: "..." }

which the Log tab already reads via `useLogs` (`src/client/queries.ts` line
134). A press of the physical COPY button must produce exactly this call.

  WHAT "COPY" DOES
    On press, the firmware sends `POST /api/logs { text: "COSMO Cube: <last
    displayed message>" }` — the button literally copies whatever the
    screen is currently showing into the operator's Log tab. This is the
    entire feature. No new server-side concept is required for point 16
    to work.

  WHAT IS MISSING AND MUST BE BUILT (not yet in this repo)
    `/api/logs` is currently called from an authenticated browser session
    (cookie auth) — a search of `src/server/routes/api.ts` and
    `src/server/routes/public-api.ts` found no device-pairing or long-
    lived API-token mechanism for an unattended hardware client. A
    lightweight device-auth layer is new engineering work, not yet
    designed here in detail, and is the single largest open item before
    Section 05's custom PCB order:
      - A pairing flow (QR code shown on lot-systems.com, scanned by the
        device's camera at first boot, brief point 5 doing double duty
        as the pairing mechanism) that exchanges a short-lived pairing
        code for a long-lived device token.
      - A `/api/device/*` route family, scoped to that token, permitted
        to POST /api/logs and GET a small notification queue (Section 08)
        — nothing more. No access to journal content, mood history, or
        any other authenticated surface.
    This is flagged as an open engineering task for the next session in
    this series, not solved here.

--------------------------------------------------------------------------------
08 // THE PAGER — NOTIFICATIONS FROM THE AI SITE (BRIEF POINT 2)
--------------------------------------------------------------------------------

  THE METAPHOR THE BRIEF NAMED: A PAGER
    Not a phone. A pager receives short, one-way, text-only messages and
    nothing else — no reply, no thread, no feed. That constraint is the
    entire design of Face B's screen (Section 02): it renders exactly one
    short line of text at a time ("Coffee time!"), sourced by the same
    server-side decision layer that already drives ContextualPromptsWidget
    and the Memory Engine's question timing (docs/technical/MEMORY-ENGINE-
    COMPRESSION-ARCHITECTURE.md, Section 2's "PROMPT BUILD" stage) — the
    AI, not the operator, decides WHEN and WHAT.

  FLOW
    lot-systems.com decision layer -> queues a short text notification on
    the operator's `/api/device/*` scope (Section 07) -> device polls (or,
    v1.1+, holds a lightweight persistent connection) -> renders the text
    on the round screen -> operator may press COPY to log the moment it
    landed (Section 07).

  WHY THIS IS NOT CUBIQ
    CUBIQ's whole thesis is that motion is felt, not read, and a lit
    screen would be "a screen substitute" (LOT-CUBIQ-QUANTUM-CUBE-v0.md,
    Section 04) — the opposite design decision. This device is explicitly
    the object that DOES carry a screen, and its anti-feed discipline is
    enforced differently: one line, no scroll, no history view on-device,
    the message clears itself after a fixed dwell time. The screen is
    pager-grade, not phone-grade, on purpose.

--------------------------------------------------------------------------------
09 // SESSION COMPRESSION (BRIEF POINT 8)
--------------------------------------------------------------------------------

Point 8 asked that "the information in each session" be compressed. This
is not a new subsystem — it is the Memory Engine's existing Virtuous
Compression Cycle (docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md,
Section 2), extended with one new context-capture channel:

    EXISTING CHANNELS (8, per that document)         NEW CHANNEL (this device)
    login streaks, tab switches, radio, journal, ---> hardware telemetry:
    mood check-ins, widget interactions                COPY-button presses,
                                                         notification dwell time
                                                         before COPY/clear,
                                                         weather-sensor readings
                                                         at time of interaction

Each COPY press is already, by construction (Section 07), a `/api/logs`
row — it enters the same pipeline every other log entry does. No new
compression code is required for v1.0; the device is simply a new SOURCE
into a cycle that already exists. A future session may propose a ninth
named signal source once real usage data exists to justify one.

--------------------------------------------------------------------------------
10 // DOCUMENT SET — SEPARATE, NOT ONE MEGA-FILE (BRIEF POINT 11)
--------------------------------------------------------------------------------

This document is the PLAN. It deliberately does not attempt to also be
the firmware spec, the companion-software spec, or the end-user manual.
Per brief point 11 ("separate documents"), those are distinct files,
planned here and authored in follow-up sessions:

```
THIS DOCUMENT   docs/corporate/COSMO-CUBE-HARDWARE-COMPUTER-v1.md   PLAN / BOM / roadmap (this file)
FIRMWARE        docs/technical/COSMO-CUBE-FIRMWARE-SPEC.md          NOT YET WRITTEN (brief pt. 9)
SOFTWARE        docs/technical/COSMO-CUBE-COMPANION-SOFTWARE.md     NOT YET WRITTEN (brief pt. 10)
USER MANUAL     (generated to PDF, Section 11)                      NOT YET WRITTEN (brief pt. 7)
ASSEMBLY MANUAL (generated to PDF, Section 11)                      NOT YET WRITTEN (brief pt. 7)
```

  WHY NOT WRITE THEM NOW
    Firmware and companion-software specs are meaningfully wrong to write
    before Section 04's bench prototype proves the electronics
    architecture. Writing them now would be documenting an untested
    design as though it were validated — exactly the failure mode
    LOT-CUBIQ-QUANTUM-CUBE-v0.md's Section 01 warns against ("a demo
    video," not a v0). This document plans their existence and their
    filenames; it does not pre-author their content.

--------------------------------------------------------------------------------
11 // PDF MANUALS (BRIEF POINT 7)
--------------------------------------------------------------------------------

Once Sections 09-10's documents exist as markdown, they are compiled to
PDF using the pdf skill already available in this environment (source-
controlled markdown remains the editable source of truth; PDF is a build
artifact, not hand-maintained). Two PDFs are planned:

  1. USER MANUAL       — pairing flow, button behavior, charging, what the
                          screen does and does not show. Terminal-vision
                          "safe enough for a 9-year-old" clarity standard
                          (docs/technical/LOT-TERMINAL-VISION.md).
  2. ASSEMBLY MANUAL    — for the 100-unit pilot run's final-assembly step
                          (Section 06 line item "final assembly + test +
                          packaging"): shell mating, board seating, button
                          torque spec, charging-base pairing test.

Neither PDF is generated yet — no firmware or software spec exists to
summarize (Section 10).

--------------------------------------------------------------------------------
12 // ROADMAP — v0.1 -> v0.2 -> v1.0 -> v1.1
--------------------------------------------------------------------------------

```
v0.1 — BENCH PROTOTYPE (NEXT SESSION)
  Assemble Section 04's BOM on a breadboard/dev-board stack. No shell.
  Prove: camera capture, round-screen text render, BME680 read, Qi
  charge cycle, and one real POST /api/logs call from firmware (using a
  hand-issued test token, since Section 07's pairing flow doesn't exist
  yet). GATE: all five prove out on the bench, once, observed.

v0.2 — SHELL FIT
  First CNC'd stainless shell (Section 05) around the v0.1 electronics,
  still hand-wired, not yet on a custom PCB. Proves the 55x55x22mm
  envelope actually fits the module stack and the button/camera/screen
  cutouts land correctly. GATE: full mechanical fit, camera and screen
  unobstructed, button travel correct, charging pad alignment tolerant
  of +/-5mm placement error.

v1.0 — PILOT RUN (100 UNITS, BRIEF POINT 13)
  Custom PCB (Section 05.1) + CNC shell run (Section 05.2) at 100-unit
  quantity, per Section 06's cost table. Requires: Section 07's
  device-auth/pairing system built and live, firmware spec and companion
  software spec (Section 10) written and implemented, both manuals
  (Section 11) generated. GATE: 100/100 units pair successfully, receive
  one live notification, and log one COPY press to a real operator's Log
  tab before the run is declared shipped.

v1.1+ — OPEN
  Not scoped here. Candidates for a future session to open, not to
  answer in this document: on-device inference (presence-aware
  notification suppression using the camera), a second sensor tier
  beyond BME680, a persistent-connection notification channel to replace
  polling.
```

--------------------------------------------------------------------------------
13 // OPEN RISKS
--------------------------------------------------------------------------------

  1. DEVICE AUTH DOES NOT EXIST YET (Section 07) — the single hardest
     blocker to v1.0. Nothing else in this plan is exotic; this is.
  2. CAMERA AS PAIRING SCANNER (Section 07) is proposed, not proven — a
     v0.1 bench session should test QR-scan reliability through the
     stainless aperture glass before v0.2 locks the cutout geometry.
  3. COST TABLE (Section 06) IS PRE-QUOTE — treat as a planning budget,
     not a purchase commitment, until a real PCBWay RFQ exists.
  4. NAME COLLISION RISK WITH CUBIQ — both are cube-shaped LOT-family
     hardware. Section 00/01's differentiation must be repeated in every
     future document in this series, the same discipline the CUBIQ
     document already asked of anything written after it.

--------------------------------------------------------------------------------
14 // SESSION LOG — ONE ENTRY PER SESSION, APPEND ONLY (BRIEF: "PUSH A
     FULL .MD REPORT AFTER EACH SESSION")
--------------------------------------------------------------------------------

Future sessions in this series append the next dated entry below. Never
edit or remove a prior entry (same convention as LOT-CUBIQ-QUANTUM-CUBE-
v0.md, Section 07).

  SESSION 01 — PLAN LOCK                                     2026-07-28
  ─────────────────────────────────────────────────────────────────
  Scheduled routine, no live operator in the loop. Read the five internal
  sources and the two live-API call sites in Section 00; attempted three
  external fetches (brand.lot-systems.com, lot-systems.com/about,
  institute.lot-systems.com/cqgs.html), all three returned HTTP 403 and
  were substituted with their local mirrors (CQGS-WHITE-PAPER-SNAPSHOT.md,
  LOT-STYLE-GUIDE.md). Sourced real component links for a bench BOM
  (Section 04) and a 100-unit pilot cost table (Section 06) via live web
  search — PCBWay assembly and CNC-stainless service pages, ESP32-S3
  camera/display boards, BME680 breakouts, Qi receiver modules, and a
  12mm stainless momentary switch. Identified that the LOT API side of
  brief points 6/16 already exists in production (`POST /api/logs`) and
  that the only new server-side work required is a device-pairing/token
  layer, which this session scoped but did not build. No hardware
  ordered, no firmware written, no PDF generated — this session is the
  plan lock the brief asked to start "from." Companion session report:
  docs/benchmark/LOT-SR-20260728-01.md.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR
END COSMO-CUBE-HARDWARE-COMPUTER-v1
================================================================================
