<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-HARDWARE-v2
TITLE:    COSMO® Cube — Site-Connected Hardware Computer, v2.0 Build Spec
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
INVENTOR: VADIK MARMELADOV — INVENTOR, COSMO® CIA
DATE:     2026-08-11
VERSION:  2.0 — FULL BUILD SPECIFICATION (BOM LOCK PENDING PROTOTYPE)
STATUS:   PRE-PRODUCTION — 100-UNIT PILOT RUN PLANNED
BRANCH:   claude/brave-lamport-6vmmh7
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

Nothing here is invented from zero. Before writing a component list, the
following were read in full and are extended, not replaced:

  docs/benchmark/LOT-MANIFEST.md
    Section 01 already names the lineage this document continues:
    "COSMO Hardware | brave-lamport-t9z5u8 | c7d353ef | 14/14 | BEST | 7 |
    +2610 | COSMO® Cube — complete hardware computer design v1.0." That
    branch's working tree no longer exists on the remote (incorporated in
    a prior session pass); this document is v2.0 — the full, buildable
    specification for the same product line, written from S-2's direct
    build brief (19-point session order, 2026-08-11).

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    Line 50-56 draws the boundary this document must respect: "a sibling,
    textually distinct hardware track — COSMO® Cube — complete hardware
    computer design v1.0 — under Kuzya's COSMO® brand. That is a
    general-purpose hardware computer. CUBIQ™ is not that object."
    CUBIQ™ (45×45×45mm, actuated, jumps) and COSMO® Cube (this document,
    flat, camera+screen+button, does not move) share no naming collision
    and must not be confused in future sessions. Where CUBIQ™ speaks
    through motion, COSMO® Cube speaks through a screen and a camera.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    The COSMO® brand thesis: hardware that carries a verified LOT
    behavioral profile, gated by Benchmark tier, never active without
    consent. Revenue Path table (line 125-133), Phase 3: "COSMO® Hardware
    | 2028-2029 | $2,500-$5,000/unit + $100/month soul sync subscription."
    This document is the engineering path that phase depends on, moved up
    to a 2026 100-unit pilot ahead of that timeline.

  docs/corporate/LOT-CUBIQ-OPERATOR.md
    Section 04, "AI-Driven Physical Product Delivery" — the AI decides
    WHAT/WHEN/HOW to send. Section 03, "The Index of Systems" — the
    signal record this device reads from and writes back to. Section 07
    Phase 4, "Physical Extension (Days 90+)" — the lifecycle stage this
    unit is delivered at.

  docs/corporate/LOT-TERMINAL-M2M.md
    The Data Intake Protocol this device's sensor payload must conform
    to (Format 3: Multi-Sensor Array, line 73-89) and the S-2 operator
    progression / hardware marketplace model (line 15-32, 120-160) this
    unit's 100-unit pilot run feeds into.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    House style for a hardware BOM document: named part, one-line
    justification, street price range, alternate part. This document
    follows that convention for every component below.

  docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
  docs/benchmark/LOT-DOCTRINE.md ("Widget→Memory Compression Loop")
    The per-session compression discipline (Section 08 of this document)
    is the same PLANNER-CONTEXT-style compaction already running for
    software sessions — extended here to a physical device's on-box
    session log before it is synced to the Index of Systems.

No prior document specifies a stainless-steel two-piece enclosure, a
PCBWay-manufactured board, a wireless-charged camera+screen device, or a
100-unit pilot run. This document is that specification, v2.0.

--------------------------------------------------------------------------------
01 // WHAT COSMO® CUBE IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  COSMO® CUBE IS:
    - A flat, silver, two-piece stainless-steel object that sits on a
      desk, charges wirelessly, and does one job: carry pager-grade
      notifications and a one-button "Copy" action between an operator's
      physical desk and their LOT® Index of Systems.
    - A general-purpose hardware computer (per LOT-MANIFEST.md's original
      naming) in the narrow sense that it runs its own firmware, holds
      its own network stack, and can be extended with new sensors and
      new notification classes without a hardware respin.
    - The first COSMO® object built for the open pilot market — 100
      units, not one founder unit. It ships with a PDF user manual, a
      separate firmware document, and a separate software-connector
      document (Section 11).

  COSMO® CUBE IS NOT:
    - CUBIQ™. CUBIQ™ moves (hops, leaps, jumps). COSMO® Cube does not
      actuate — it is solid-state: one camera, one screen, one button,
      one charging coil, one sensor stack. See Section 00 for the
      disambiguation this repeats from LOT-CUBIQ-QUANTUM-CUBE-v0.md.
    - A general AI assistant device. It does not run local inference. It
      is a thin client: it displays what the LOT® AI engine decides to
      send, and it uploads what its sensors and button record. All
      intelligence stays server-side, per LOT_ROBOTICS_COSMO.md's "no
      COSMO® unit activates without a verified LOT profile" rule.
    - A smartphone competitor. No app grid, no general camera roll, no
      third-party notifications. One function, done cleanly: the
      physical face of the operator's Log tab.

  THE PRINCIPLE
    Ship the smallest true object first. A flat stainless plate that
    reliably shows one line of AI-authored text, takes one photo on
    request, and sends one signal back to lot-systems.com when its button
    is pressed, is a complete v2.0 product. A device that also tries to
    be a smart speaker, a health tracker, and a security camera before
    that one-line/one-photo/one-button loop is proven is not a v2.0 — it
    is a mood board.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  DIMENSIONS        40mm × 40mm × 5mm (flat square plate, v2.0 reference
                     size — the "silver square," per S-2 brief item 4)
  ENCLOSURE          Two-piece stainless steel (per S-2 brief items 3,
                     17, 18) — a machined top shell and a machined base
                     shell, joined by 4× M1.4 stainless screws through
                     hidden bosses, sealed with a thin silicone gasket
                     for dust/light moisture resistance (not submersible)
  FACE A — "THE MIRROR"   One side, polished stainless steel (brief item
                     17). Mirror-polish (Ra ≤ 0.05µm) or brushed #8
                     finish as the production option — mirror shows
                     fingerprints; brushed is the pragmatic 100-unit
                     choice, mirror is a premium SKU variant. This face
                     carries no components — it is the object's calm
                     side, meant to sit face-up on a desk when the
                     operator wants presence without a screen.
  FACE B — "THE INTERFACE"   Other side: camera, screen, button (brief
                     item 18). See Section 03 for placement and the
                     height-budget engineering note below.
  MASS TARGET        <45g fully assembled (steel is not light — this is
                     a desk object, not a wearable; mass is not fought
                     the way it is on CUBIQ™)
  CHARGE INTERFACE    Wireless (Qi-class inductive) through the base
                     shell (brief items 12, 19 — same requirement stated
                     twice in the brief, confirmed as one requirement
                     here). The charging puck is a separate LOT® object,
                     shared design language with the CUBIQ™ charging pad
                     named in LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02.
  BUTTON             Single mechanical tactile button, Face B, labeled
                     "COPY" (brief item 16). One function: fires a signal
                     to the operator's Log tab on lot-systems.com. No
                     long-press menu, no double-click gesture — one
                     button, one meaning, always.

  ENGINEERING CONSTRAINT — THE 5mm HEIGHT BUDGET
    5mm total height is tight for a camera + screen + battery + PCB
    stack inside a machined steel shell. This is flagged honestly rather
    than hidden:
      - PCB (rigid-flex, 2-layer):            ~0.6mm
      - Battery (ultra-thin LiPo pouch cell):  ~1.2mm
      - Display module (bare glass, no backlight housing): ~1.0mm
      - Camera module (bare sensor + lens, no housing):    ~1.6mm
      - Steel shell walls (top + base, machined thin):     ~0.6mm combined
      TOTAL:                                    ~5.0mm — zero margin
    Two production paths, both compatible with this document's BOM:
      (a) HOLD THE LINE — accept zero margin, use only bare/chip-on-board
          modules (no connector shrouds), verified against the exact
          part numbers in Section 03 before tooling is cut.
      (b) CAMERA BOSS — relax the camera to a 1.5mm raised boss on Face
          B (a small stainless bezel around the lens, like a phone camera
          bump) and hold the rest of the body at 5mm flat. This is the
          recommended path for the 100-unit run — it removes the single
          tightest constraint without changing the "flat silver square"
          silhouette from any angle but a raking side light.
    RULE: no tooling is cut until one working bench prototype (3D-printed
    shell, real PCB, real components) confirms which path holds.

--------------------------------------------------------------------------------
03 // ELECTRONICS — BILL OF MATERIALS
--------------------------------------------------------------------------------

Every part below is a real, currently-shipping off-the-shelf component
(brief item 15: "AI grade off-the-shelf sensors" — nothing here requires
custom silicon). Prices are per-unit street price at low volume (10-100
units); Section 10 revisits pricing at the 100-unit pilot volume.

  MCU / SoC — THE BRAIN
    Espressif ESP32-S3-WROOM-1 (N16R8)
    Dual-core Xtensa LX7, Wi-Fi 4 + BLE 5, native camera (DVP) interface,
    16MB flash / 8MB PSRAM, hardware JPEG support for camera capture, deep
    sleep <20µA. The only realistic single-chip choice that natively
    drives a camera AND holds a Wi-Fi radio AND fits a coin-sized board —
    this is the same chip family already proven in ESP32-CAM designs.
      STREET  ≈ $3.50–$5.50 (module, qty 100)
      ALT     Nordic nRF5340 + separate Wi-Fi companion — lower power,
              no native camera interface, more board complexity. Not
              recommended for v2.0; revisit only if camera moves off-MCU.

  CAMERA — FACE B
    OmniVision OV2640 (2MP, fixed-focus, DVP/parallel interface)
    Bare-module (no housing) variants exist at ~8×8mm footprint and
    ~1.5-2mm z-height with a small M6 lens barrel — matches the Section
    02 height budget. 2MP is enough for the intended use (a quick photo
    attached to a Log entry, not photography).
      STREET  ≈ $3.00–$4.50 (bare module, qty 100)
      ALT     OV5640 (5MP, autofocus) — better image quality, +1.5mm
              z-height for the AF coil. Use only if the "CAMERA BOSS"
              path (Section 02b) is adopted.

  DISPLAY — FACE B
    0.96" round or square OLED, SSD1306/SSD1309 driver, monochrome,
    bare-glass COG (chip-on-glass) module — no backlight required (OLED
    is self-emissive), ~1.0mm glass thickness.
      STREET  ≈ $2.50–$4.00 (qty 100)
      ALT     1.3" GC9A01 round color TFT — larger, brighter, on-brand
              with a "screen shows one line of text" use case, but +2mm
              z-height and a backlight draw that competes with the
              wireless-charge-only power budget. Reserve for a future
              "COSMO® Cube Color" SKU once the mono v2.0 unit is proven.

  WEATHER / ENVIRONMENTAL SENSOR — BRIEF ITEM 14
    Bosch Sensortec BME688
    4-in-1: temperature, humidity, barometric pressure, and a gas sensor
    with an on-chip AI-based gas index algorithm (BSEC AI library runs
    on-device or host-side) — this is the literal "AI grade off-the-shelf
    sensor" the brief asks for (item 15), not a marketing description.
    2.5×2.5×0.93mm LGA package — trivial to fit inside the height budget.
      STREET  ≈ $6.50–$8.50 (qty 100)
      ALT     BME680 (predecessor, same footprint, no on-chip AI index —
              gas index must run entirely host-side). BME688 preferred;
              price delta is small enough not to matter at this volume.

  WIRELESS CHARGING RECEIVER
    Texas Instruments BQ51013B (Qi 1.2-compliant receiver IC) + a flat
    wire-wound receiver coil, ~0.5mm thick, sized to the 40×40mm base.
      STREET  ≈ $2.50–$3.50 (IC) + $1.50–$2.50 (coil), qty 100

  BATTERY
    Ultra-thin LiPo pouch cell, 3.7V, ~40-60mAh, ≤1.2mm thickness (this
    exact class of cell is sold for smart-card and wearable-patch
    applications — it is the correct reference part, not a hypothetical
    one). Capacity is intentionally small: this device is wireless-charge-
    resident on its puck between uses, not a battery-life product.
      STREET  ≈ $2.00–$3.50 (qty 100)

  BUTTON
    Low-profile SMD tactile switch, 0.8mm actuation height, rated 100k+
    cycles, mounted under a laser-cut steel "COPY" glyph on Face B.
      STREET  ≈ $0.10–$0.20 (qty 100)

  PCB
    2-layer rigid-flex, ENIG finish, 40×40mm outline with cutouts for
    camera/display/button, manufactured and assembled by PCBWay (brief
    item 1 — see Section 10 for the fab + assembly quote path).
      STREET  ≈ $4.00–$7.00 per board (fab + SMT assembly, qty 100,
              PCBWay Prototype/Small-Batch Assembly service)

  PER-UNIT ELECTRONICS SUBTOTAL (qty 100, parts only, excl. enclosure)
      LOW   ≈ $24.60      HIGH  ≈ $39.20

--------------------------------------------------------------------------------
04 // ENCLOSURE — MANUFACTURING BOM
--------------------------------------------------------------------------------

  STAINLESS STEEL SHELLS (×2 per unit)
    304 or 316L stainless, CNC-milled from bar stock or 5-axis machined
    from sheet, ~0.6mm wall thickness combined per Section 02. 316L
    costs more and resists corrosion better — recommended for the
    "polished mirror" premium SKU; 304 is sufficient for the brushed
    standard SKU at 100-unit pilot volume.
      STREET  ≈ $8.00–$14.00 per shell-pair (qty 100, CNC + polish/brush
              finishing), sourced via a metal-fabrication partner —
              PCBWay itself offers CNC machining and sheet metal
              services alongside PCB fab, which keeps one vendor
              relationship across board + enclosure (see Section 10).

  FASTENERS / SEAL
    4× M1.4 × 3mm stainless screws + silicone gasket ring, per unit.
      STREET  ≈ $0.30–$0.60 (qty 100)

  LASER-CUT "COPY" BUTTON GLYPH
    Fiber-laser-etched steel cap over the tactile switch, Face B.
      STREET  ≈ $0.50–$1.00 (qty 100)

  PER-UNIT ENCLOSURE SUBTOTAL (qty 100)
      LOW   ≈ $8.80      HIGH  ≈ $15.60

  PER-UNIT TOTAL BOM (electronics + enclosure, qty 100)
      LOW   ≈ $33.40      HIGH  ≈ $54.80

This is parts cost only — it excludes NRE (tooling, PCBWay engineering
fees), assembly labor beyond SMT, QC, packaging, and certification
(Section 12). Section 10 gives the full 100-unit program cost.

--------------------------------------------------------------------------------
05 // LOT API CONNECTOR — BRIEF ITEM 6
--------------------------------------------------------------------------------

The device speaks to lot-systems.com through one authenticated channel,
matching the Data Intake Protocol already specified in
docs/corporate/LOT-TERMINAL-M2M.md (Format 3: Multi-Sensor Array). The
device does not invent a new API — it is a new producer/consumer of the
existing one.

    DEVICE  →  LOT API   (sensor payload, every 5 min or on button press)

    POST https://api.lot-systems.com/v1/m2m/intake
    Authorization: Bearer <operator_device_token>
    Content-Type: application/json

    {
      "device_id": "cosmo-cube-<serial>",
      "operator": "<S-2-username>",
      "device_type": "cosmo_cube_v2",
      "timestamp": "2026-08-11T14:30:00Z",
      "sensors": [
        { "type": "temperature", "value": 22.1, "unit": "celsius" },
        { "type": "humidity", "value": 41, "unit": "percent" },
        { "type": "pressure", "value": 1012.8, "unit": "hPa" },
        { "type": "gas_index", "value": 74, "scale": 100, "status": "Good" }
      ],
      "event": "button_copy_press" | "photo_capture" | "sensor_tick",
      "attachment": "<base64 or presigned-URL, photo events only>"
    }

    LOT API  →  DEVICE   (pager notification, push, per Section 06)

    GET/SSE https://api.lot-systems.com/v1/m2m/notify?device_id=...

    {
      "notify_id": "n-88213",
      "text": "Coffee time!",
      "priority": "normal",
      "ttl_seconds": 600
    }

  BUTTON → LOG TAB, THE EXACT LOOP (brief item 16)
    1. Operator presses "COPY" on Face B.
    2. Device fires `event: "button_copy_press"` with current sensor
       snapshot and (if a photo was just taken) the attachment reference.
    3. Server-side, the M2M intake route writes one Log entry to the
       operator's account — the same Log tab the software session
       already writes to (docs/corporate/LOT-CUBIQ-OPERATOR.md Section
       02, "MINUTE 5-8 — LOG ENTRY"). The device does not have its own
       feed; it writes into the operator's existing, single Log.
    4. The Quantum Intent Engine reads the new entry like any other log
       signal — device-originated entries are not a second-class
       source, they are tagged `source: "cosmo_cube"` and scanned by the
       same 80-pattern library named in LOT-CUBIQ-OPERATOR.md Section 03.

--------------------------------------------------------------------------------
06 // NOTIFICATION PIPELINE — THE PAGER — BRIEF ITEM 2
--------------------------------------------------------------------------------

"Send a pager-like notification from an AI-powered site" (brief item 2)
and "Simple screen to show autonomous notifications, such as 'Coffee
time!'" (brief closing note) are one requirement: a one-line, AI-
authored, low-priority text push, displayed on the Face B screen, with
no acknowledgment required and no app to open.

  PIPELINE
    LOT AI engine (server-side, same engine chain as the Memory Engine —
    docs/benchmark/LOT-DOCTRINE.md's AI_ENGINE_PREFERENCE fallback:
    ollama → together → gemini → mistral → claude → openai)
        │
        │  decides WHAT/WHEN, per LOT-CUBIQ-OPERATOR.md Section 04's
        │  existing "AI-Driven Physical Product Delivery" logic — this
        │  is the same decision engine, extended from shipping physical
        │  goods to pushing physical-screen text
        ▼
    /v1/m2m/notify (SSE or short-poll — device holds a live connection
    when charging, short-polls every 60s on battery to save power)
        │
        ▼
    ESP32-S3 firmware notification handler (Section 07)
        │
        ▼
    SSD1306 display, one line, plain text, no chrome — "Coffee time!"
    renders for `ttl_seconds`, then the screen returns to idle (device
    serial number + charge indicator only)

  WHY PAGER-CLASS, NOT PUSH-NOTIFICATION-CLASS
    A phone push notification demands acknowledgment and competes for
    foreground attention. A pager buzzes once and shows text until you
    glance at it, on your terms. This is the same anti-feed thesis
    already on record for CUBIQ™ (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section
    04: "The cube does not compete for foreground attention the way a
    phone notification does.") — COSMO® Cube applies the identical
    principle through a screen instead of motion.

--------------------------------------------------------------------------------
07 // FIRMWARE — SEPARATE DOCUMENT — BRIEF ITEMS 9, 11
--------------------------------------------------------------------------------

Per brief item 9 ("Firmware documents") and item 11 ("Separate
documents"), firmware is specified and versioned independently from this
hardware document and from the software connector (Section 08). This
section is the FIRMWARE DOCUMENT INDEX, not the firmware spec itself —
the actual firmware document ships as:

    docs/technical/LOT-COSMO-CUBE-FIRMWARE-v1.md   (to be authored,
    tracked as an open item in Section 13)

  FIRMWARE SCOPE (to be detailed in that document)
    - ESP32-S3 Arduino-core or ESP-IDF base image
    - Wi-Fi provisioning (BLE-assisted first-pair, per-device token)
    - Camera capture → JPEG → chunked upload on button press
    - Sensor polling loop (BME688, 5-minute default interval)
    - SSD1306 display driver + notification render queue
    - Deep-sleep power management (device sleeps between charge sessions
      and sensor ticks; wakes on button interrupt or scheduled tick)
    - OTA update channel, signed firmware images only

--------------------------------------------------------------------------------
08 // SOFTWARE CONNECTOR — SEPARATE DOCUMENT — BRIEF ITEMS 10, 11
--------------------------------------------------------------------------------

Per brief item 10 ("Software to connect with firmware") and item 11
again, the server-side connector that talks to the firmware over the
LOT API (Section 05) is its own document:

    docs/technical/LOT-COSMO-CUBE-CONNECTOR-v1.md   (to be authored,
    tracked as an open item in Section 13)

  CONNECTOR SCOPE (to be detailed in that document)
    - `/v1/m2m/intake` and `/v1/m2m/notify` route handlers (extends the
      existing M2M protocol in LOT-TERMINAL-M2M.md, does not fork it)
    - Device registration + per-device auth token issuance, tied to an
      operator's LOT account (no anonymous device pairing)
    - Log-tab write path for `button_copy_press` events (Section 05)
    - AI notification authoring — reuses the existing AI engine chain,
      new prompt class: "one-line desk notification," capped at 24
      characters to fit the SSD1306 display

--------------------------------------------------------------------------------
09 // PER-SESSION COMPRESSION — BRIEF ITEM 8
--------------------------------------------------------------------------------

"Compress the information in each session" (brief item 8) is the same
discipline already running for software sessions, applied to the
device's on-box activity between charge cycles:

    RAW ON-DEVICE LOG (per wake cycle)
      timestamp, sensor readings, button events, photo-capture events
        │
        ▼
    ON-DEVICE COMPACTION (firmware-side, before upload)
      Redundant sensor ticks within a stable band (±0.3°C, ±2% RH,
      ±1 hPa) are dropped — only deltas and button/photo events are
      guaranteed to upload individually. This mirrors the "signal, not
      noise" principle already governing the 15 software signal sources
      (LOT-CUBIQ-OPERATOR.md Section 03).
        │
        ▼
    SERVER-SIDE SESSION COMPRESSION (connector, Section 08)
      One charge-to-charge session becomes one compressed summary object
      — same shape as the PLANNER-CONTEXT compaction already documented
      in docs/benchmark/LOT-DOCTRINE.md's "Widget→Memory Compression
      Loop" — before it is handed to the AI engine as prompt context.
      A full day of sensor ticks must not out-compete a single button
      press for the AI's attention when it authors the next notification.

--------------------------------------------------------------------------------
10 // MANUFACTURING — PCBWAY, 100-UNIT PILOT RUN — BRIEF ITEMS 1, 13
--------------------------------------------------------------------------------

  VENDOR: PCBWay (brief item 1)
    PCBWay is used for three services under one account, keeping the
    supply chain to a single vendor relationship for the pilot:
      1. PCB FABRICATION — 2-layer rigid-flex board, Section 03
      2. PCBA / SMT ASSEMBLY — turnkey assembly (PCBWay sources or
         accepts consigned parts, places + reflows, qty 100)
      3. CNC / SHEET METAL — the two stainless shells, Section 04
         (PCBWay's mechanical manufacturing service line covers CNC
         machining in stainless; this is confirmed as an existing PCBWay
         service category, not a hardware document assumption — quote
         and DFM review is the first pilot-run action item)

  100-UNIT PROGRAM COST ESTIMATE

    LINE ITEM                              LOW        HIGH
    ────────────────────────────────────   ────────   ────────
    Parts BOM × 100 (Section 03+04)        $3,340      $5,480
    PCBWay NRE (stencil, tooling, DFM)       $300        $600
    CNC tooling / fixture setup (shells)     $400        $900
    SMT assembly labor (qty 100)             $250        $450
    QC + functional test (per-unit, 100)     $200        $400
    Packaging (box, PDF manual insert)       $150        $300
    Firmware flash + provisioning (100)      $100        $200
    ────────────────────────────────────   ────────   ────────
    TOTAL PROGRAM COST                     $4,740      $8,330
    PER-UNIT LOADED COST                   $47.40      $83.30

  This sits comfortably under the $2,500-$5,000 planned retail price
  named in LOT_ROBOTICS_COSMO.md's Revenue Path (Phase 3), leaving wide
  margin for the pilot to also cover certification (below) and R&D
  amortization without repricing the eventual production SKU.

  PILOT RUN SEQUENCE
    1. Bench prototype ×3 (hand-assembled or PCBWay quick-turn proto,
       qty 5 boards) — validates the height budget (Section 02) and the
       full firmware/connector loop end-to-end before any tooling spend.
    2. DFM review with PCBWay on both the PCBA and the CNC shell design.
    3. Pilot batch — 100 units, PCBWay PCBA + CNC, in-house final
       assembly (mate shells, screw, gasket) and QC.
    4. Certification (Section 12) run in parallel with pilot batch
       production — not gating it, since certification uses pilot units.
    5. First 100 units ship to R&D/Legacy tier operators (per
       LOT-CUBIQ-OPERATOR.md Section 08 pricing tiers) as the initial
       COSMO® Cube cohort, per the Benchmark-gated eligibility model
       already defined in LOT_ROBOTICS_COSMO.md.

--------------------------------------------------------------------------------
11 // DOCUMENTATION SET — PDF MANUALS — BRIEF ITEMS 7, 11
--------------------------------------------------------------------------------

Per brief item 7 ("Result in PDF manuals") and item 11 ("Separate
documents"), COSMO® Cube ships with independently-versioned documents,
each in Markdown source + PDF render, matching the house pattern already
used for the Badges Codex (docs/badges/) and the CQGS white paper
(docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md / .pdf):

    DOCUMENT                                              STATUS
    ─────────────────────────────────────────────────    ──────
    LOT-COSMO-CUBE-HARDWARE-v2.md  (this document)         DONE
    LOT-COSMO-CUBE-HARDWARE-v2.pdf (this document, PDF)     DONE — Section 13
    LOT-COSMO-CUBE-FIRMWARE-v1.md  (Section 07 scope)       OPEN
    LOT-COSMO-CUBE-FIRMWARE-v1.pdf                          OPEN
    LOT-COSMO-CUBE-CONNECTOR-v1.md (Section 08 scope)       OPEN
    LOT-COSMO-CUBE-CONNECTOR-v1.pdf                         OPEN
    LOT-COSMO-CUBE-USER-MANUAL-v1.md/.pdf                   OPEN — written
                                                             after bench
                                                             prototype #1
                                                             confirms real
                                                             button/screen
                                                             behavior

  RULE: the user manual is written last, from a working prototype, not
  from this spec — a manual written against a document instead of a
  device drifts the moment the real height-budget tradeoff (Section 02)
  resolves one way or the other.

--------------------------------------------------------------------------------
12 // CERTIFICATION & COMPLIANCE (100-UNIT PILOT SCOPE)
--------------------------------------------------------------------------------

  FCC Part 15 (Wi-Fi/BLE radio, unintentional + intentional radiator) —
    required for US sale of any unit beyond an internal pilot; ESP32-S3
    modules are typically pre-certified (modular approval) which reduces
    this to a host-device verification test, not a full radio cert.
  Qi wireless charging — receiver-side compliance is inherited from the
    BQ51013B reference design; no separate cert needed for the receiver.
  CE (if any EU pilot units ship) — same modular-approval logic as FCC.
  RoHS — stainless steel + standard SMT components, expected compliant
    by default; confirmed during PCBWay DFM review (Section 10).

  This section is scope, not completion — certification testing is a
  pilot-run line item (Section 10) and an open action item (Section 13).

--------------------------------------------------------------------------------
13 // ROADMAP — v2.0 → v2.1 → v3.0
--------------------------------------------------------------------------------

  v2.0 — THIS DOCUMENT (BUILD SPEC LOCK)
    Full BOM, enclosure spec, API connector, notification pipeline,
    manufacturing plan, and documentation set defined. Nothing built yet.
    GATE: 1 bench prototype (hand-built or PCBWay quick-turn) proves the
    height budget (Section 02) and the full sensor-tick → API →
    notification → screen loop before any tooling is cut.

  v2.1 — PILOT BATCH (100 UNITS)
    PCBWay PCBA + CNC shells, in-house final assembly, firmware +
    connector documents (Section 07, 08) written and versioned, user
    manual authored from the working prototype.
    GATE: 100/100 units pass functional QC (camera capture, screen
    render, button → Log-tab round-trip, wireless charge) before any
    unit ships to an operator.

  v3.0 — SOUL SYNC INTEGRATION (RESEARCH TRACK, NOT A BUILD MILESTONE)
    Named in LOT_ROBOTICS_COSMO.md as the long-term COSMO® thesis: a
    device that carries a verified behavioral profile, not just a
    notification pager. This document does not commit to that mechanism
    for COSMO® Cube specifically — it is recorded so v2.0/v2.1 choices
    (LOT API connector shape, per-device auth model, Section 05) are
    made with that future compatible, not foreclosed.

--------------------------------------------------------------------------------
14 // OPEN ACTION ITEMS
--------------------------------------------------------------------------------

  [ ] PCBWay account setup + first DFM quote request (PCBA + CNC shells)
  [ ] Bench prototype #1 (validate Section 02 height budget)
  [ ] Author docs/technical/LOT-COSMO-CUBE-FIRMWARE-v1.md
  [ ] Author docs/technical/LOT-COSMO-CUBE-CONNECTOR-v1.md
  [ ] Implement /v1/m2m/notify route (extends existing /v1/m2m/intake)
  [ ] Author LOT-COSMO-CUBE-USER-MANUAL-v1 (post-prototype)
  [ ] FCC modular-approval verification test scheduling

--------------------------------------------------------------------------------
15 // BRAND
--------------------------------------------------------------------------------

LOT®                    The platform
COSMO®                  The personal robotics / hardware division
COSMO® Cube              This object — a flat, silver, site-connected
                        hardware computer
CUBIQ™                  A distinct sibling object — see Section 00
LOT®† COSMO®            The combined mark

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR, COSMO® CIA
END LOT-COSMO-CUBE-HARDWARE-v2
================================================================================
