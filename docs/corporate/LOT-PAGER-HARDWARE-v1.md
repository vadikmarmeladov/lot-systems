================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-PAGER-HARDWARE-v1
TITLE:    LOT® Pager — Physical Notification Companion, v.1 Hardware Plan
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV — INVENTOR, COSMO® CIA
DATE:     2026-08-20
VERSION:  1.0 — PLAN, BOM, ROADMAP (PRE-HARDWARE, DESIGN LOCK PENDING)
STATUS:   PLANNING — no board spun, no shell tooled. This document is the
          plan that precedes both.
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS PLAN IS BUILT ON
--------------------------------------------------------------------------------

This is not the first LOT® hardware document. Before writing a line of BOM,
the following were read in full so this plan extends the record instead of
colliding with it:

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    CUBIQ™ — a 45mm cube whose entire notification language is MOTION, not
    a screen. Its Section 00 explicitly names a sibling, textually distinct
    hardware track: "COSMO® Cube — complete hardware computer design v1.0"
    (brave-lamport-t9z5u8 series, +2610 lines) and draws the line: "CUBIQ™
    is not that object. CUBIQ™ is LOT®'s object: a notification body, not a
    computer." LOT® Pager (this document) sits at the intersection those two
    objects deliberately avoided — it has a screen, a camera, and a button,
    which CUBIQ v.0 explicitly does not. It is a third, distinct object.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    NODE-0 — the always-on inference server ("own the metal"). LOT® Pager is
    NODE-0's opposite number: the smallest possible physical surface of the
    same system, not the machine that thinks but the object that tells you
    it thought of something.

  docs/corporate/LOT-TERMINAL-M2M.md
    The Machine-to-Machine data intake protocol — device_id, operator,
    standardized JSON, POST to the LOT® Systems network. LOT® Pager's LOT
    API connector (Section 06) is a client of exactly this protocol, not a
    new one.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Row "Quantum Cube Hardware | Hardware feedback integration (Month 12+) |
    PLANNED." LOT® Pager is a second, screen-bearing branch of that same
    planned line item — proven notification-grade actuation (CUBIQ) plus a
    minimal display, camera, and physical action button.

  docs/benchmark/LOT-MANIFEST.md
    Confirms COSMO® Hardware (brave-lamport-t9z5u8, 14/14 iterations, BEST,
    +2610 lines, "COSMO® Cube — complete hardware computer design v1.0")
    and its predecessor cluster (dazzling-shannon, 9 iterations). Both
    branches no longer exist on the remote as of the 2026-06-27 manifest
    update. No standalone spec file carrying that content was found in the
    current docs/ tree at the time of writing (2026-08-20) — this plan does
    not assume access to that prior content and is written fresh from the
    brief below, cross-checked against everything still on record.

  src/client/queries.ts, src/client/components/JournalReflection.tsx
    Confirms `/api/logs` (GET + POST) is a real, live endpoint today, and
    that "clicking through to the Log tab" is an existing product pattern
    (JournalReflection.tsx comment: "Clicking the label navigates to the
    Log tab for writing"). Section 08 of this document specifies the
    physical Copy button against this real endpoint, not a hypothetical
    one.

  THE BRIEF (2026-08-20, Vadik, Inventor, COSMO® CIA)
    19 numbered requirements — PCBWay fabrication, pager-style AI
    notification, two-part stainless steel body, a flat silver charging
    plate, camera, LOT API connector, PDF manuals, per-session information
    compression, separate firmware/software documents, wireless charger,
    100-unit production run, a weather sensor, AI-grade off-the-shelf
    sensors, a "Copy" button wired to the site's Log tab, one polished
    stainless face, and a second face carrying camera + screen + button.
    Every numbered item below traces back to one of those 19 lines.

--------------------------------------------------------------------------------
01 // WHAT LOT® PAGER IS AND IS NOT
--------------------------------------------------------------------------------

  IT IS
    A palm-sized, two-piece stainless steel object that sits on a desk,
    charges wirelessly on its own silver plate, and receives short
    AI-composed pager messages from lot-systems.com ("Coffee time!"). One
    face is a mirror-polished steel disc with no visible electronics — the
    presence object. The other face carries a small round display, a
    low-profile camera, and one laser-etched "Copy" button that writes a
    log entry straight back into the operator's Log tab.

  IT IS NOT
    - CUBIQ™. CUBIQ notifies through motion alone and explicitly carries no
      screen (LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 02: "primary
      notification language is MOTION, not light"). LOT® Pager is the
      opposite design bet: text-first, motionless, screen-and-camera
      equipped. The two are not competing prototypes of the same object —
      they are permanently different objects, per the naming-collision
      warning already on record.
    - A general-purpose computer. NODE-0 (docs/technical/LOT-NODE-0-RIG-SPEC.md)
      and the historical "COSMO® Cube — complete hardware computer design"
      line are the compute-class object. LOT® Pager has no ambition to run
      inference locally — it is a thin client. All intelligence lives at
      lot-systems.com; the device receives, displays, and reports back.
    - A phone replacement. No apps, no touchscreen keyboard, no general
      notifications from anything but the LOT® Memory Engine / Index of
      Systems. One input (the Copy button), one output channel (the
      screen), one sensor package (camera + weather). Single-purpose by
      design — the anti-feed thesis CUBIQ already established applies here
      too, just expressed through restraint of function rather than
      absence of a screen.

  PRODUCT CODE     LOT-PAGER-01
  DIVISION         COSMO® Hardware (CIA) — the physical-goods arm that
                    already owns the COSMO® Cube lineage
  BRAND MARK       LOT® Pager — "LOT®·PAGER" combined lockup, same pattern
                    LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 08 used for CUBIQ

--------------------------------------------------------------------------------
02 // PHYSICAL FORM — BRIEF ITEMS 3, 4, 17, 18
--------------------------------------------------------------------------------

  OVERALL              Two-part puck, 58mm diameter x 14mm thick assembled.
                        Sized to sit comfortably under a palm, larger than
                        CUBIQ's 45mm cube because it must seat a display and
                        camera window without cramping either.

  PART A — FRONT FACE   Mirror-polished 316L stainless steel disc, 58mm
  (brief #17)           diameter, 4mm deep-drawn shell. No visible seams,
                        no visible fasteners, no printed markings except a
                        laser-etched LOT® wordmark near the rim. This is the
                        object's "presence" face — what sits toward the room
                        when the Pager is idle. 316L over 304 for the marine-
                        grade corrosion resistance a desk humidifier or a
                        coffee ring will eventually test.

  PART B — DEVICE FACE  Bead-blasted (matte) 316L stainless steel shell,
  (brief #18)           58mm diameter x 10mm deep, carrying three cutouts:
                        - Center: 32mm circular window for the display,
                          sealed with a chemically-strengthened glass lens
                          (Gorilla Glass-class, not acrylic — this face
                          takes desk contact).
                        - 8mm off-center: camera aperture, recessed 0.5mm
                          behind an IR-cut glass window.
                        - Rim: single 6mm tactile button, laser-etched
                          "COPY" (brief #16), sealed with a silicone boot
                          rated IP54 against desk spills.
                        Matte, not polished, on this face specifically — a
                        mirror finish behind a screen produces glare that
                        defeats the point of a glanceable pager display.

  JOIN                 Parts A and B are two halves of one shell (brief #3:
                        "2 parts stainless steel body"), joined at the
                        equator by a laser-welded seam, ground and polished
                        flush on Part A's side, left as a visible fine seam
                        on Part B's matte side. No screws are visible from
                        outside; the two halves are a permanent assembly
                        once welded, serviced only by re-opening the weld
                        (a deliberate right-to-repair trade-off documented
                        and accepted at this v.1 stage — a future v.2 may
                        move to a gasket + fastener join if field repair
                        rate justifies the finish cost).

  CHARGING PLATE        A separate object, not part of the puck: a flat
  (brief #4, #12, #19)  silver-anodized aluminum square, 40mm x 40mm x 5mm,
                        the Pager's Qi-class wireless charging pad. This is
                        the same "object is both power source and surface"
                        pattern CUBIQ already established for its own
                        charging pad (LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section
                        02) — reused deliberately, not reinvented. Aluminum
                        rather than steel for the plate specifically: it
                        must not attenuate the Qi coil's field the way a
                        thick ferrous shell would.

  ANTENNA CONSTRAINT    Stainless steel is RF-opaque. A fully metal shell
  (engineering note)    would kill the Pager's WiFi link outright. Part B
                        (matte face) carries a 9mm x 22mm resin-filled slot
                        behind the display bezel, invisible from outside,
                        that is the only non-metal path through the shell —
                        the 2.4GHz PCB antenna sits directly behind it. This
                        is a DFM-critical detail: PCBWay's CNC/deep-draw
                        quote (Section 05) must price this slot as a
                        distinct machining step, not an afterthought.

--------------------------------------------------------------------------------
03 // ELECTRONICS ARCHITECTURE — BRIEF ITEMS 5, 6, 14, 15
--------------------------------------------------------------------------------

  MCU                   ESP32-S3-WROOM-1 (dual-core Xtensa LX7, WiFi 4 +
                        BLE 5, native USB, 8MB PSRAM variant). Chosen over a
                        general Cortex-M part specifically because it has a
                        mainline camera driver (esp32-camera) and enough
                        PSRAM to hold a JPEG frame buffer — the same
                        practical reason ESP32-S3 dominates the maker
                        camera-module market this design deliberately rides
                        on rather than fighting.

  CAMERA (brief #5)     OV2640, 2MP, fixed-focus, FF (no motorized focus —
                        one less moving part inside a sealed shell). Not a
                        surveillance-grade sensor; used for two functions
                        only: (a) an operator-triggered "capture and attach
                        to log entry" action alongside the Copy button, and
                        (b) ambient light / presence sensing (is someone at
                        the desk) to gate whether the screen should light up
                        for a notification versus stay dark. No continuous
                        recording, no local storage beyond one frame buffer
                        — captured frames are pushed to lot-systems.com or
                        discarded, never retained on-device.

  DISPLAY               1.28" round GC9A01 TFT, 240x240, SPI. Round to match
                        the 32mm glass window in Part B without wasted
                        corner area — a square panel would need a larger cut
                        or leave dead pixels under the bezel. Sixteen-bit
                        color is more than the pager use case requires, but
                        this exact panel is the cheapest round SPI display
                        at volume; a monochrome round panel does not exist
                        at comparable cost or lead time, so color capability
                        is bought as a side effect of picking the sane part,
                        not a stated requirement.

  WEATHER SENSOR         Bosch BME280 — temperature, humidity, barometric
  (brief #14)            pressure, single I2C part, 2.5mm x 2.5mm package.
                        Feeds the same "Air quality: Good — open your
                        windows for 3 minutes" recommendation pattern
                        already specified in LOT-TERMINAL-M2M.md Format 3
                        (Multi-Sensor Array), reusing that JSON shape rather
                        than inventing a new one.

  "AI-GRADE OFF-THE-      Brief item 15 reads as a design principle, not a
  SHELF SENSORS"          part number: do not custom-fabricate sensor
  (brief #15)             silicon for v.1. Every sensor on this BOM (BME280,
                        OV2640, the IMU below) is an industrial/consumer
                        off-the-shelf part with a public datasheet and a
                        mature driver — "AI-grade" here means calibrated
                        and fused in software (on lot-systems.com, per the
                        Calibration Loop already defined in
                        LOT_QI46_ENGINE.md) rather than in bespoke hardware.
                        Custom sensor silicon is out of scope for a 100-unit
                        run at any sane NRE.

  IMU (secondary)        LSM6DS3TR-C, 6-axis accel + gyro. Not in the brief
                        by name, but required to detect "Pager was picked
                        up / set down" as a presence signal gating screen
                        wake — reused component class from CUBIQ's landing-
                        recovery IMU (LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section
                        03), same rationale: don't invent a new sensing
                        primitive when one is already proven in the same
                        product family.

  WIRELESS CHARGE RX     Renesas/IDT P9221-R Qi receiver IC + a 15mm ID /
  (brief #12, #19)       28mm OD Litz-wire charging coil, feeding a MCP73831
                        linear charge controller into a 400mAh LiPo pouch
                        cell. 400mAh is sized for the actual duty cycle —
                        a display waking for a few seconds per notification
                        and a camera firing rarely — not for continuous use;
                        oversizing the cell only adds shell thickness for
                        no benefit here.

  PMIC / SLEEP           TPS62840 buck converter for the 3.3V rail, plus
                        ESP32-S3 deep-sleep between notifications (~7uA
                        class). The device is asleep by default and wakes
                        on: (a) a push from lot-systems.com over WiFi, (b)
                        the Copy button, or (c) IMU motion (pickup). Battery
                        life target: >5 days between wireless charges at a
                        realistic 20-40 notifications/day.

--------------------------------------------------------------------------------
04 // LOT API CONNECTOR — BRIEF ITEM 6
--------------------------------------------------------------------------------

  The Pager is a thin client of the existing LOT® Systems API. It does not
  introduce a new protocol — it is a hardware caller of two endpoints that
  already exist or are already specified:

  INBOUND (notification push)
    The device holds a long-lived HTTPS connection (or, v.1 fallback: 15s
    poll — see Section 07 firmware doc for the tradeoff) to
    api.lot-systems.com, authenticated with a per-device operator token
    issued at pairing. Payload shape matches LOT-TERMINAL-M2M.md's existing
    JSON conventions:

    {
      "device_id": "lot-pager-000042",
      "operator": "S-2-vadik",
      "message": "Coffee time!",
      "ttl_seconds": 90,
      "priority": "normal"
    }

  OUTBOUND (Copy button + weather telemetry)
    POST https://api.lot-systems.com/v1/m2m/intake (per
    LOT-TERMINAL-M2M.md's existing "Data Intake Endpoint" section), plus a
    direct write to the existing, live `/api/logs` endpoint
    (src/client/queries.ts line 134-146) so a Copy button press appears in
    the operator's Log tab exactly the way a typed journal entry would.
    Full request/response detail is Section 08 below and the companion
    document LOT-PAGER-SOFTWARE.md.

--------------------------------------------------------------------------------
05 // PCB FABRICATION — PCBWay — BRIEF ITEM 1
--------------------------------------------------------------------------------

  Board class: 4-layer, 45mm x 32mm rigid PCB (fits inside the 58mm shell
  with clearance for the coil, battery, and camera flex cable), ENIG finish
  (solder-joint reliability over HASL for a part this dense), 1.0mm
  thickness to keep the shell as thin as the 14mm target allows.

  WHY PCBWAY (brief #1)
    Named directly in the brief. PCBWay additionally offers SMT assembly
    (PCBA) in the same pipeline as fabrication, which matters for a
    100-unit run — one vendor, one shipment, one set of DFM feedback,
    instead of coordinating a separate contract assembler.

  PROCUREMENT PATH (three-stage, standard PCBWay workflow)
    STAGE 1 — PROTOTYPE (5-10 boards, bare PCB only)
      Hand/hot-air assemble in-house first. Validates schematic and
      footprint before committing to PCBWay's assembly line.
      pcbway.com/orderonline.aspx — 4-layer, 45x32mm, qty 10, ENIG
      Est. cost: $30-60 total (board cost is near-zero at this size; the
      quote is dominated by PCBWay's flat engineering/tooling minimum).
      Lead time: 3-5 days fab + shipping.

    STAGE 2 — SMT-ASSEMBLED PROTOTYPE (10-20 units, PCBA)
      Same board, PCBWay's Assembly service, using their standard parts
      library for the stocked passives and sourcing the ESP32-S3-WROOM-1,
      OV2640, GC9A01, BME280, LSM6DS3TR-C, and P9221-R as customer-supplied
      or PCBWay-sourced parts (BOM upload against PCBWay's Component
      Mall). Validates the reflow profile and camera/display flex
      connections before the full run.
      pcbway.com/smt-online-quote/ — qty 20, leaded/lead-free per
      component compatibility
      Est. cost: $8-15/board assembly fee + component cost (Section 06)

    STAGE 3 — 100-UNIT PRODUCTION RUN (brief #13)
      Same PCBA pipeline at qty 100-120 (build ~15-20% over target to
      cover DOA/rework attrition without a second fab run). PCBWay volume
      pricing drops the per-unit assembly fee meaningfully past the ~50
      unit line; full costing in Section 06.

  DFM NOTES PCBWAY WILL FLAG (get ahead of these before quoting)
    - Camera flex-cable connector needs a keep-out zone clear of the coil's
      magnetic field — route the flex away from the Qi coil, not over it.
    - The antenna slot (Section 02) must be specified to the shell
      fabricator, not PCBWay — PCBWay quotes the board only; the stainless
      shell is a separate CNC/deep-draw vendor (Section 06).
    - Stack the battery connector on the opposite face from the display FPC
      to keep the 14mm shell height achievable.

--------------------------------------------------------------------------------
06 // BILL OF MATERIALS — 100-UNIT RUN — BRIEF ITEM 13
--------------------------------------------------------------------------------

  Prices below are current street/distributor unit pricing at 100-unit
  order quantities, sourced from public distributor pricing pages
  (DigiKey, Mouser) as of the reading-log date. Treat every figure as an
  estimate to validate against a live quote before committing spend —
  component pricing moves week to week, same caveat the NODE-0 rig spec
  already applies to its own BOM.

  ELECTRONICS (per unit, qty 100)
  ─────────────────────────────────────────────────────────────────────
  PART                          SUPPLIER          QTY   UNIT $   EXT $
  ESP32-S3-WROOM-1-N8R8         Digi-Key/Mouser    1     $2.80    $2.80
  OV2640 camera module (FPC)    LCSC/AliExpress    1     $2.20    $2.20
  GC9A01 1.28" round TFT        LCSC/AliExpress    1     $3.10    $3.10
  BME280 (weather sensor)       Digi-Key/Mouser    1     $4.35    $4.35
  LSM6DS3TR-C (IMU)             Digi-Key/Mouser    1     $1.95    $1.95
  P9221-R (Qi receiver IC)      Digi-Key/Mouser    1     $1.60    $1.60
  Qi charging coil, 15/28mm     LCSC/AliExpress    1     $0.90    $0.90
  MCP73831 charge controller    Digi-Key/Mouser    1     $0.45    $0.45
  TPS62840 buck converter       Digi-Key/Mouser    1     $0.70    $0.70
  400mAh LiPo pouch cell        Custom cell shop   1     $2.50    $2.50
  Tactile button + silicone boot Generic/LCSC       1     $0.35    $0.35
  Passives (R/C/L), connectors  LCSC bulk reel      ~40   —        $2.10
  Chemically-strengthened glass Custom optical shop 1     $1.80    $1.80
  IR-cut window (camera)        Custom optical shop 1     $0.60    $0.60
  4-layer PCB (bare, per unit)  PCBWay              1     $1.40    $1.40
  ─────────────────────────────────────────────────────────────────────
  ELECTRONICS SUBTOTAL / UNIT                                     $26.80

  MECHANICAL (per unit, qty 100)
  ─────────────────────────────────────────────────────────────────────
  316L stainless, Part A (polished, deep-drawn)         $8.50
  316L stainless, Part B (matte, CNC + antenna slot)     $9.75
  Laser weld (2 parts → 1 shell)                        $3.00
  Charging plate, silver-anodized aluminum, 40x40x5mm    $2.90
  IP54 button seal + assembly hardware                   $0.85
  ─────────────────────────────────────────────────────────────────────
  MECHANICAL SUBTOTAL / UNIT                                     $25.00

  ASSEMBLY, TEST, PACKAGING (per unit, qty 100)
  ─────────────────────────────────────────────────────────────────────
  PCBWay SMT assembly fee (100 qty tier)                 $6.50
  Final assembly (shell + board + battery + weld QC)     $4.00
  Functional test (WiFi pair, screen, camera, button)    $2.50
  Retail packaging + printed quick-start card             $1.75
  ─────────────────────────────────────────────────────────────────────
  ASSEMBLY SUBTOTAL / UNIT                                        $14.75

  NRE / ONE-TIME (amortized across the 100-unit run)
  ─────────────────────────────────────────────────────────────────────
  PCBWay engineering + stencil + first-article            $350
  Stainless shell tooling (deep-draw die, Part A)        $2,200
  Stainless shell tooling (CNC fixture, Part B)          $1,100
  Optical window die-cutting setup                         $300
  Firmware bring-up + QC jig (bench, not per-unit)          $600
  ─────────────────────────────────────────────────────────────────────
  NRE TOTAL                                                     $4,550
  NRE AMORTIZED / UNIT (÷100)                                     $45.50

  ─────────────────────────────────────────────────────────────────────
  TOTAL LANDED COST / UNIT (100-unit run, NRE amortized)         $112.05
  TOTAL LANDED COST / UNIT (BOM only, excl. NRE)                  $66.55
  TOTAL PROGRAM COST, 100 UNITS (incl. NRE)                    ≈ $11,205
  ─────────────────────────────────────────────────────────────────────

  Suggested unit retail (assuming DTC subscription bundle pricing similar
  to CQGS-WHITE-PAPER-SNAPSHOT.md's $99/$399 tiers): $249 one-time or
  included at the $399/mo Priority tier as a hardware perk, mirroring
  Quantum Cube's positioning in that same document.

--------------------------------------------------------------------------------
07 // MANUALS AND DOCUMENT SEPARATION — BRIEF ITEMS 7, 9, 10, 11
--------------------------------------------------------------------------------

  Brief items 9, 10, and 11 ask, in effect, for one thing: don't let this
  plan become one file that mixes plan, firmware, and software. Three
  separate documents exist as of this session, each independently
  versioned and independently updatable without touching the others:

    THIS DOCUMENT               docs/corporate/LOT-PAGER-HARDWARE-v1.md
                                Plan, BOM, PCBWay path, roadmap.

    FIRMWARE                    docs/corporate/LOT-PAGER-FIRMWARE.md
                                On-device firmware architecture: boot,
                                sleep/wake, display driver, camera capture
                                pipeline, button debounce, Qi charge state
                                machine, OTA update path.

    SOFTWARE / API CONNECTOR    docs/corporate/LOT-PAGER-SOFTWARE.md
                                The lot-systems.com side: pairing flow,
                                push-notification composition (how "Coffee
                                time!" gets generated by the Memory Engine
                                and routed to a specific device_id), the
                                Copy-button-to-Log-tab write path, and the
                                companion pairing UI.

    USER MANUAL (PDF, brief #7)  docs/manuals/LOT-PAGER-USER-MANUAL-v1.md
                                + docs/manuals/LOT-PAGER-USER-MANUAL-v1.pdf
                                Consumer-facing: unboxing, pairing, button
                                use, charging, care instructions for the
                                polished face. Generated from the .md via
                                the same reportlab pipeline already used for
                                docs/badges/*.pdf (scripts/generate_badge_pdf*.py
                                pattern) so PDF generation stays inside the
                                repo's existing toolchain rather than adding
                                a new dependency class.

--------------------------------------------------------------------------------
08 // THE COPY BUTTON — SIGNAL TO THE LOG TAB — BRIEF ITEM 16
--------------------------------------------------------------------------------

  A single press of the "COPY" button on Part B is a physical shortcut for
  "log whatever just happened." It does not open an app or require a phone
  nearby — the Pager itself calls the API directly over its own WiFi
  connection.

  ON PRESS
    1. Debounce (40ms) confirms a genuine press, not board vibration.
    2. Device wakes fully (if asleep), grabs the most recent camera frame
       from its ring buffer (no new capture needed for the common case —
       reuses the presence-detection frame from Section 03) and current
       BME280 + IMU readings.
    3. Device issues:

       POST https://api.lot-systems.com/api/logs
       Authorization: Bearer <device_operator_token>
       Content-Type: application/json

       {
         "event": "hardware_copy_press",
         "source": "lot-pager-000042",
         "timestamp": "2026-08-20T14:32:07Z",
         "context": {
           "temperature_c": 22.4,
           "humidity_pct": 41,
           "pressure_hpa": 1015.8
         }
       }

    4. On 200, the display shows a single check glyph for 1.5s, then
       returns to idle/dark. On failure (no WiFi, token expired), the
       display shows a single dash and the event queues on-device (up to
       20 entries, flash-backed) for retry on next successful connection —
       never silently dropped, never blocking.
    5. The entry appears in the operator's Log tab at lot-systems.com the
       same way a typed journal entry does today (JournalReflection.tsx's
       existing Log-tab navigation pattern), tagged with a hardware source
       icon so it reads distinctly from a typed entry without requiring a
       new UI surface.

  This is deliberately the same `/api/logs` endpoint the web client already
  calls (src/client/queries.ts, `useLogs` / log-create mutation) — the
  Pager is a second client of an existing, proven API, not a reason to
  build a parallel logging path.

--------------------------------------------------------------------------------
09 // NOTIFICATION LANGUAGE — THE SCREEN — BRIEF PREAMBLE ("Coffee time!")
--------------------------------------------------------------------------------

  Where CUBIQ speaks through four motion gestures (LOT-CUBIQ-QUANTUM-CUBE-v0.md,
  Section 04), LOT® Pager speaks through short text, composed by the same
  Memory Engine / Index of Systems signal source, rendered on the round
  display:

    SIGNAL SOURCE                         EXAMPLE MESSAGE
    ──────────────                        ────────────────
    Circadian / routine pattern match     "Coffee time!"
    Memory question ready                 "New question waiting"
    Badge unlocked                        "Badge earned — Specialist"
    Weather-driven recommendation         "Air's good. Crack a window."
    Assembly phase advanced               "System evolved — check in"

  Design constraint carried over from CUBIQ's anti-feed thesis: one line,
  under 24 characters at the display's default type size, no scrolling, no
  queue indicator, no unread badge. A message that has not been glanced at
  simply expires (Section 04's `ttl_seconds`) and the screen goes dark
  again — the Pager does not accumulate demands for attention the way a
  phone notification tray does.

--------------------------------------------------------------------------------
10 // PER-SESSION INFORMATION COMPRESSION — BRIEF ITEM 8
--------------------------------------------------------------------------------

  Brief item 8 is a documentation discipline, not a hardware spec: each
  working session on this device compresses what it learned into the
  smallest durable record before ending, the same practice already running
  across docs/benchmark/ (session reports → LOT-LEXICON.md → LOT-DOCTRINE.md)
  and docs/wiki/ (daily wiki scans). For LOT® Pager specifically:

    EVERY SESSION           Append one dated entry to Section 11 (below) —
                            what changed, what was decided, what is now
                            blocked or open. Never edit a prior entry.

    EVERY MAJOR MILESTONE    Fold accepted decisions into Sections 02-09
                            above (the living spec), and retire the
                            superseded language rather than stacking
                            contradictory versions.

    EVERY SHIP CYCLE          Push one session report to docs/ following
                            the LOT-SR-YYYYMMDD-NN.md convention already in
                            use repo-wide (brief: "push a full .MD report
                            after each session").

--------------------------------------------------------------------------------
11 // ROADMAP — BRIEF ITEM 13 AND SESSION LOG
--------------------------------------------------------------------------------

  PHASE 0 — PLAN (THIS DOCUMENT)                          2026-08-20
    Spec locked at plan level: physical form, electronics architecture,
    PCBWay path, 100-unit BOM/costing, API connector, firmware/software
    document split, user manual PDF. No board spun yet.
    GATE: this document + LOT-PAGER-FIRMWARE.md + LOT-PAGER-SOFTWARE.md +
    user manual PDF all exist and cross-reference cleanly.

  PHASE 1 — BREADBOARD PROOF
    ESP32-S3 dev board + OV2640 + GC9A01 + BME280 on a breadboard, no
    shell, no PCB. Prove the firmware camera/display/API loop works before
    committing to a board layout.
    GATE: device receives a live push from lot-systems.com and renders it;
    Copy-button press produces a visible Log tab entry.

  PHASE 2 — PCB PROTOTYPE (PCBWay Stage 1-2, Section 05)
    Custom 45x32mm 4-layer board, hand-assembled first, then 10-20 unit
    PCBWay PCBA run. No shell yet — bench-tested in a 3D-printed stand-in
    enclosure.
    GATE: 10/10 prototype boards pass WiFi pair, display, camera capture,
    Qi charge, and Copy-button-to-Log-tab round trip.

  PHASE 3 — SHELL TOOLING
    Deep-draw die for Part A, CNC fixture for Part B (including the
    antenna slot), optical window die-cutting, laser-weld process
    qualification on 5 sample shells.
    GATE: assembled shell passes IP54 spray test on the button seal and
    RF throughput test confirms the antenna slot does not meaningfully
    attenuate WiFi signal versus the open-air prototype.

  PHASE 4 — 100-UNIT PRODUCTION RUN (Section 06)
    PCBWay PCBA at qty 100-120, shells from the qualified tooling,
    final assembly, functional test, packaging.
    GATE: 100 units functional-tested, ≤5% attrition to rework/scrap
    consistent with the 15-20% build-over-target buffer.

  PHASE 5 — FULFILLMENT
    Ship to the first 100 operators (founding cohort framing, echoing
    CQGS-WHITE-PAPER-SNAPSHOT.md's "1,000 Soul Disk" founding-cohort
    language at 1/10th scale for a hardware-specific first run).

  SESSION LOG (append-only — see Section 10)
  ─────────────────────────────────────────────────────────────────────
  2026-08-20  Plan authored from Vadik's 19-item brief. Positioned against
              CUBIQ and NODE-0/COSMO Cube to avoid naming collision. Full
              BOM, PCBWay path, roadmap, and companion firmware/software/
              manual documents created in the same session. No hardware
              built yet — Phase 0 complete, Phase 1 not started.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR, COSMO® CIA
END LOT-PAGER-HARDWARE-v1
================================================================================
