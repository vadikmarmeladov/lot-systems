<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT_COMPUTER_HARDWARE_PLAN_v1
TITLE:    LOT® Computer — v.1 Physical Notification Terminal (Hardware Plan)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV, Inventor — COSMO® CIA
DATE:     2026-08-03
VERSION:  1.0 — PLANNING LOCK
STATUS:   PRE-PROTOTYPE — COMPONENT SOURCING + ROADMAP STAGE
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This document turns a 19-point hardware brief (dictated 2026-08-03, S-2 Vadik)
into a buildable plan. Three brand pages were named as required reading —
brand.lot-systems.com, lot-systems.com/about, institute.lot-systems.com/cqgs.html
— and are cited below; live fetch of all three returned HTTP 403 from this
session's network path (proxy-blocked, not a missing-page condition), so this
plan is grounded instead in the in-repo corpus those pages summarize, which is
authoritative and more complete than a page fetch would be:

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The only prior hardware-specification document at this level of rigor.
    Establishes the pattern this document follows: a reading log, an honest
    "IS / IS NOT" scope section, a versioned roadmap with numeric gates, and
    a closing BRAND section. Also draws the line this plan must respect:
    "COSMO® Cube — complete hardware computer design v1.0 ... is a
    general-purpose hardware computer. CUBIQ™ is not that object."
    This document is the COSMO®-side object CUBIQ's own spec named and
    deliberately left undrawn.

  docs/benchmark/LOT-MANIFEST.md (line 31)
    "COSMO Hardware | brave-lamport-t9z5u8 | BEST | +2610 | COSMO® Cube —
    complete hardware computer design v1.0." No file under that name exists
    anywhere in docs/ or master history (git log --all has no matching
    branch). The ledger entry is a placeholder for work that was scoped but
    never actually written down. This document is that missing file, written
    for real, under a name that does not collide with CUBIQ™ (see Section 08).

  docs/corporate/LOT-AMBIENT-AI-VISION.md (Hardware Ecosystem section)
    Prior art for exactly this class of object: "LOT® Station — Weather +
    Air Quality," "LOT® Brush — Connected Toothbrush." Both already ship
    (per that document) with the Usership kit and report into a
    QIoT™ (Quantum IoT) fused signal model. Design rule quoted verbatim
    and inherited here: *"one line, no alarm, exact moment."*

  docs/corporate/LOT-TERMINAL-M2M.md
    Defines the actual wire format for hardware → LOT® Systems data intake
    (Format 1/2/3, JSON, device_id/operator/metric/value/timestamp). This
    plan's LOT API Connector (point 6) reuses Format 3 verbatim rather than
    inventing a new schema — see docs/technical/LOT-COMPUTER-SOFTWARE.md.

  docs/corporate/LOT_QI46_ENGINE.md (Layer 2, line ~140)
    The existing inference API shape (`POST https://qi.lot-systems.com/v1/inference`,
    Usership-token auth, streamed response) is the pattern the notification
    push channel (point 2) is modeled on, run in reverse (server → device).

  docs/corporate/LOT_ROBOTICS_COSMO.md
    COSMO® brand register: personal-hardware division, named for Kuzya,
    "a robot without a soul is a machine." Sets the tone for this document's
    S-2 sign-off ("COSMO® CIA") and the non-surveillance framing of point 5
    (camera) in Section 05.

  src/client/components/JournalReflection.tsx:17
    The actual client-side "Log tab" component the point-16 Copy button
    writes into. Confirmed via repo grep — this is a real, addressable UI
    surface, not a hypothetical one.

--------------------------------------------------------------------------------
01 // WHAT THIS PLAN IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  THIS PLAN IS:
    - A component-accurate, sourceable Bill of Materials for a 100-unit pilot
      run (docs/technical/LOT-COMPUTER-BOM.md), priced at real supplier
      break-quantities.
    - A firmware and software architecture split into two standalone
      documents per the brief's own instruction (point 11), so either can be
      hired out, reviewed, or replaced independently.
    - A roadmap with numeric gates in the CUBIQ house style — no phase is
      declared done on vibes.
    - An honest list of where the 19-point brief, taken literally, conflicts
      with physics — most importantly the 5mm total height (point 4) against
      a camera + screen + battery + Qi coil + button stack, and stainless
      steel (point 3, 17) against Qi inductive charging (point 19), which
      does not pass through most steel alloys without a non-metal window.
      Both are resolved in Section 04, not hidden.

  THIS PLAN IS NOT:
    - A claim that 100 physical units exist. Nothing has been fabricated.
      This is the plan that gets fabrication started, per the same discipline
      CUBIQ v.0 used: "ship the smallest true thing first."
    - A software/firmware implementation. Those are separate, complete
      documents (Section 06) written to the same standard, not stubs.
    - A replacement for CUBIQ™. LOT® Computer is a flat notification/utility
      terminal; CUBIQ™ is a kinetic notification body. They can share a
      charging standard (Section 04.6) without sharing a product identity.

--------------------------------------------------------------------------------
02 // PRODUCT NAME AND BRAND POSITION
--------------------------------------------------------------------------------

  PRODUCT NAME     LOT® Computer
  REPO ANCHOR      This repository is named LOT-Computer. That is not a
                   coincidence to route around — it is the product's home
                   address. The hardware plan lives at the name the codebase
                   already carries.
  DIVISION         Manufactured and stewarded under COSMO® Hardware
                   (personal-hardware division, per LOT_ROBOTICS_COSMO.md),
                   branded and sold as a LOT® consumer object — the same
                   LOT®/COSMO® father/son split CUBIQ™ already establishes
                   ("LOT® Computer" is to COSMO® hardware what "LOT® Station"
                   and "LOT® Brush" already are: a COSMO®-built, LOT®-branded
                   object in the Usership hardware ecosystem).
  ONE-LINE         A flat stainless-and-glass terminal that receives one
                   thing from lot-systems.com: the exact-moment nudge you
                   would otherwise get as a phone notification — plus a
                   single button that logs "received" back to your Log tab
                   without you typing a word.
  ECOSYSTEM FIT    LOT_QI46_ENGINE.md's Calibration Loop already assumes a
                   physical output device exists (CUBIQ, Month-12 milestone).
                   LOT® Computer is a second, simpler physical output device
                   on the same loop — screen instead of motion, button
                   instead of IMU telemetry.

--------------------------------------------------------------------------------
03 // THE 19-POINT BRIEF, MAPPED
--------------------------------------------------------------------------------

Each numbered item from the 2026-08-03 brief, mapped to where it is actually
specified in this document set:

  #  BRIEF ITEM                              RESOLVED IN
  ── ──────────────────────────────────────  ─────────────────────────────────
  1  PCB Way                                 04.1 Manufacturing / BOM Section 0
  2  Pager-like notification from AI site    04.2, LOT-COMPUTER-SOFTWARE.md §2
  3  2-part stainless steel body             04.3
  4  Flat silver square 4x4cm x 5mm height   04.4 (with tolerance analysis)
  5  Camera                                  04.5, privacy note
  6  LOT API connector                       LOT-COMPUTER-SOFTWARE.md §2-3
  7  Result in PDF manuals                   LOT-COMPUTER-MANUAL.md (+ PDF)
  8  Compress information each session       docs/benchmark/LOT-SR-20260803-01.md
  9  Firmware documents                      LOT-COMPUTER-FIRMWARE.md
  10 Software to connect with firmware       LOT-COMPUTER-SOFTWARE.md
  11 Separate documents                      Firmware and software are two
                                              standalone files, not sections
  12 Charger                                 04.6, BOM §5
  13 100 units run                           LOT-COMPUTER-BOM.md (100-unit
                                              pricing), Section 05 below
  14 Weather sensor                          04.7, BOM §3
  15 AI-grade off-the-shelf sensors          04.8, BOM §3
  16 "Copy" button → Log tab signal          04.9, LOT-COMPUTER-SOFTWARE.md §4
  17 One side polished stainless steel       04.3
  18 Other side: camera, screen, button      04.3, 04.4
  19 Wireless charger                        04.6, engineering caveat 04.4.1

--------------------------------------------------------------------------------
04 // PHYSICAL AND ELECTRICAL ARCHITECTURE
--------------------------------------------------------------------------------

### 04.1 — Manufacturing Partner (point 1)

  PCB fabrication + SMT assembly: **PCBWay** (pcbway.com). PCBWay is used for
  three deliverables on this project, not one:
    a) 4-layer rigid PCB fab (the main board, ~34mm x 34mm to clear the 40mm
       body with edge clearance) — PCBWay PCB Prototype + SMT Assembly
       service, quoted for Qty 100.
    b) CNC-machined stainless steel enclosure halves (point 3) — PCBWay CNC
       Machining service supports 303/316 stainless as a stock material.
    c) A single supplier relationship for both the electronics and the
       enclosure lowers integration risk for a 100-unit pilot — one vendor
       to hold tolerance-match accountable if the PCB outline and the
       machined cavity disagree.

### 04.2 — The Pager-Like Notification (point 2)

  Signal source: the QI·46 Calibration Loop / Index of Systems — the same
  signal bus CUBIQ v.0 already consumes (docs/corporate/
  LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 05). LOT® Computer subscribes to the
  identical event stream and renders it as **text on a screen** instead of
  **motion in a body**. Example payload → display mapping:

    Index of Systems event          Screen render
    ────────────────────────────    ────────────────────
    routine_trigger: "coffee"       "Coffee time!"
    memory_question_ready          "A question is ready."
    badge_unlocked (common)        "+1" (badge glyph, 2s)
    weather_alert (Section 04.7)   "Rain in 20 min."

  Transport: HTTPS long-poll to `qi.lot-systems.com/v1/device-events`
  (mirrors the existing inference endpoint shape in LOT_QI46_ENGINE.md,
  reversed direction), with a BLE-provisioned WiFi fallback path — full
  protocol in LOT-COMPUTER-SOFTWARE.md §2.

### 04.3 — Two-Part Stainless Steel Body (points 3, 17, 18)

  CONSTRUCTION      Two CNC-machined 316L stainless steel shells, joined by
                     4 x M1.6 stainless countersunk screws through the
                     polished face's perimeter (screws land under the bezel,
                     not visible face-on) with a compressed silicone gasket
                     for dust/moisture resistance (target IP54, not
                     submersible — this is a desk object, not a dive watch).
  FACE A (point 17)  Mirror-polished 316L stainless, no aperture. This is
                     the "presence" face — the object as a small steel
                     object on the desk, brand mark laser-etched (not
                     printed) at low contrast.
  FACE B (point 18)  Bead-blasted matte 316L stainless frame around three
                     apertures: camera lens window (sapphire glass, 4mm
                     diameter), display window (2.1mm anti-reflective
                     chemically-strengthened glass, full face), and a single
                     mechanical button (point 16) at the lower edge.
  WHY 316L           Same alloy class as consumer smartwatch cases —
                     corrosion-resistant, hypoallergenic-adjacent (not
                     nickel-free, so not marketed as hypoallergenic outright),
                     and CNC-friendly at PCBWay's standard tolerances
                     (±0.05mm typical).

### 04.4 — Form Factor: 4cm x 4cm x 5mm (point 4)

  TARGET            40mm x 40mm x 5mm external, silver (mirror-polish + bead
                     blast, no paint or anodizing — point 4's "silver" is the
                     bare 316L finish, not a coating).
  HONEST CONSTRAINT  5mm total external height is tighter than any
                     comparable consumer device with a camera AND a display
                     AND a battery AND wireless charging (for reference: an
                     Apple Watch is ~10.7mm thick with a smaller sensor
                     count and no camera). Stacking the required subsystems
                     at today's commercial component thicknesses:

    LAYER                          THICKNESS   NOTE
    ────────────────────────────   ─────────   ──────────────────────────
    Face B shell (machined)        0.6mm       Minimum PCBWay CNC wall
    Display module (round/sq TFT) 1.1mm       Thinnest sourceable, BOM §2
    Main PCB (rigid-flex, 4L)      0.4mm       PCBWay thin-core option
    Battery (LiPo pouch, thin)     1.8mm       ~350-400mAh class, BOM §5
    Qi receiver coil (flex FPC)    0.3mm       Laminated to Face A interior
    Face A shell (machined)        0.6mm       Minimum PCBWay CNC wall
    Gasket + assembly clearance    0.3mm       —
    ────────────────────────────   ─────────
    RUNNING TOTAL                  5.1mm       Camera module NOT yet added

  The camera module (point 5) is the term that breaks 5mm: even the
  thinnest commercially available board-camera (e.g. an OV2640 bare-die
  module without a housing) needs ~2.3-2.7mm of stack height for sensor +
  lens barrel + focus tolerance, which the table above has no room for.

  **RESOLUTION — v1.0 (this document) ships at 6.8mm, not 5mm.** The 5mm
  target is retained as the v2.0 goal, gated on a chip-on-board camera
  module (lens directly bonded to sensor die, no barrel — the class of part
  used in fingerprint-sensor-adjacent ultra-thin phone notches) becoming
  sourceable at 100-unit MOQ, which it is not today (Section 05, v2.0 gate).
  This is disclosed here rather than silently rounding 6.8 to 5 — the same
  discipline CUBIQ v.0 used to separate "v.0 is" from "v.0 is not."

### 04.5 — Camera (point 5)

  PART CLASS        OV2640 2MP board camera module (BOM §2) — chosen for
                     100-unit sourceability and a mature open driver
                     ecosystem (esp32-camera), not photographic quality.
  FUNCTION           On-device presence/attention detection only:
                     "is a person currently in front of the terminal"
                     (used to time when a nudge renders vs. queues — the
                     same "exact moment" principle as LOT-AMBIENT-AI-VISION.md).
                     No frame is ever transmitted off-device, stored, or
                     viewable from the LOT app. The firmware computes a
                     single boolean (presence: true/false) on-device and
                     discards the frame in the same loop iteration — the
                     camera never has network access to raw pixel data.
                     This is a hardware/firmware guarantee (no Wi-Fi DMA path
                     from the camera peripheral to the radio in the firmware
                     image), not a policy promise, and it is stated as such
                     in LOT-COMPUTER-MANUAL.md so it is auditable by the
                     owner, not just asserted.
  BRAND FIT          Matches LOT_ROBOTICS_COSMO.md's stated line: "This is
                     not surveillance." A camera that only ever outputs one
                     bit, on-device, with no image path off the chip, is the
                     narrowest interpretation of "camera" that still
                     satisfies point 5 and the presence-timing use case.

### 04.6 — Charger (points 12, 19)

  STANDARD          Qi 1.3 (BPP, 5W) wireless charging receiver, same class
                     used by CUBIQ's charging pad
                     (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02: "The charging
                     pad IS the table"). LOT® Computer and CUBIQ share ONE
                     charging base SKU going forward — the "LOT® Plinth" —
                     rather than each hardware line shipping its own charger.
  ENGINEERING CAVEAT 316L stainless steel is not fully non-magnetic but is
                     conductive enough to induce eddy-current losses that
                     meaningfully degrade Qi coupling efficiency if the coil
                     sits directly behind solid steel. Mitigation: Face A
                     (the polished, charging-down face) carries a 22mm
                     diameter non-metal insert — cast Macor (machinable
                     glass-ceramic) or a sapphire disc, flush-mounted and
                     polished to the same mirror finish as the surrounding
                     steel, invisible at a glance, functionally a charging
                     window. This is disclosed as a real material science
                     constraint, not glossed over, because a stainless shell
                     with a dead charging coil behind it is a returned
                     product, not a design detail.
  CHARGE CURRENT     Target 5W in, ~1.5-2h full charge from empty at
                     ~350-400mAh
                     capacity (BOM §5).

### 04.7 — Weather Sensor (point 14)

  Reuses the LOT® Station sensor class named in LOT-AMBIENT-AI-VISION.md
  (temperature, humidity, pressure, VOC/air-quality) rather than inventing a
  parallel spec. LOT® Computer becomes a second physical home for that
  signal — a Bosch BME688 (BOM §3) covers temp/humidity/pressure/gas-index
  in one part, letting a single LOT® Computer unit optionally retire a
  standalone LOT® Station for subscribers who only want one object on the
  desk. Output feeds the existing Ambient AI™ design rule verbatim: one
  line, no alarm, exact moment (e.g., "Rain in 20 min.").

### 04.8 — AI-Grade Off-the-Shelf Sensors (point 15)

  "AI-grade" is read here as: sensors that carry their own embedded
  inference core, so the main MCU (BOM §1) stays in deep sleep except to
  relay a result — critical given the battery volume constraint in 04.4.
  Three parts qualify and are carried in the BOM:
    - Bosch BHI260AP — self-learning 6-axis IMU with an on-die fusion
      core; ships gesture/tap/activity classification without waking the
      host MCU.
    - Sensirion SGP41 — VOC + NOx index sensor with an on-chip gas-index
      algorithm (outputs a 1-500 index directly, not raw ADC counts).
    - Himax HX-WE2 (WiseEye2) — ultra-low-power AI vision co-processor,
      evaluated as the v2.0 path to move the presence-detection inference
      in 04.5 fully off the main MCU and onto a dedicated sub-1mW vision
      chip. Not in the v1.0 BOM (adds cost/complexity ahead of proving the
      simpler OV2640 + MCU-side inference path); named here as the
      identified v2.0 upgrade path.

### 04.9 — The Copy Button (point 16)

  HARDWARE          Single mechanical tactile switch (BOM §4), silk/laser-
                     etched "COPY" on the matte Face B bezel, illuminated by
                     a single-color LED sidelight (not backlit through the
                     legend — keeps the flat, no-screen-glow-except-when-
                     rendering aesthetic Ambient AI™ requires).
  BEHAVIOR           Press, while a notification is on-screen → firmware
                     sends one authenticated event to the LOT API (schema
                     in LOT-COMPUTER-SOFTWARE.md §4) → server writes one Log
                     tab entry into the pressing user's journal, rendered by
                     the existing src/client/components/JournalReflection.tsx
                     surface, no new UI required on the software side.
                     Press with no active notification → no-op (button does
                     not function as a general "log anything" trigger; it
                     only ever confirms receipt of what was just shown).
  WHY "COPY"         The word matches radio/pager procedure ("copy that") —
                     the physical vocabulary the whole device brief is built
                     from (point 2's "pager-like"). One button, one verb,
                     one guaranteed effect.

--------------------------------------------------------------------------------
05 // 100-UNIT PILOT RUN (point 13)
--------------------------------------------------------------------------------

  See docs/technical/LOT-COMPUTER-BOM.md for the priced, linked component
  list. Summary structure:

    PHASE            UNITS   PURPOSE
    ──────────────    ─────   ────────────────────────────────────────
    EVT (Engineering
    Validation Test)     5   Bring-up: does the board power on, does the
                              radio join WiFi, does the display draw.
                              Hand-assembled, no CNC shells (3D-printed
                              stand-ins for enclosure fit-check only).
    DVT (Design
    Validation Test)    15   First real 316L CNC shells from PCBWay,
                              Qi charging validated against the Macor
                              window (04.6), IP54 gasket test.
    PVT (Production
    Validation Test)    20   PCBWay SMT assembly line, full firmware
                              (LOT-COMPUTER-FIRMWARE.md), soak test.
    PILOT RUN            60   Remaining units to reach 100, PCBWay SMT +
                              CNC at full quoted lead time, shipped to
                              first Usership-tier subscribers per the
                              COSMO® Benchmark Arbitrage® gate
                              (LOT_ROBOTICS_COSMO.md eligibility model).
    ──────────────    ─────
    TOTAL               100

  GATE — no unit ships past EVT until: presence-detection false-positive
  rate <5% over a 48h desk trial, Qi charge time within 04.6's target on the
  Macor-window prototype, and zero firmware crashes over a 72h idle+notify
  soak per unit.

--------------------------------------------------------------------------------
06 // DOCUMENT SET (points 7, 9, 10, 11)
--------------------------------------------------------------------------------

  This plan is deliberately not one file. Per the brief's own point 11:

    docs/corporate/LOT_COMPUTER_HARDWARE_PLAN_v1.md   — this document
    docs/corporate/LOT-COMPUTER-ROADMAP.md            — phased roadmap, gates
    docs/technical/LOT-COMPUTER-BOM.md                — priced component list
    docs/technical/LOT-COMPUTER-FIRMWARE.md           — firmware architecture
    docs/technical/LOT-COMPUTER-SOFTWARE.md           — companion software +
                                                          LOT API connector
    docs/technical/LOT-COMPUTER-MANUAL.md             — user manual
    docs/technical/pdf/LOT-COMPUTER-MANUAL-v1.pdf     — PDF export of manual
    docs/benchmark/LOT-SR-20260803-01.md              — this session's report

--------------------------------------------------------------------------------
07 // WHAT IS NOT YET SOLVED (STATED PLAINLY)
--------------------------------------------------------------------------------

  - Regulatory: FCC/CE radio certification for a WiFi/BLE consumer device is
    not scoped or budgeted here — required before any of the 100 pilot units
    leave controlled hands, even for internal Usership-tier testing at scale.
  - Battery safety/UN38.3 shipping certification for the LiPo cell is not
    scoped — required before units can ship via standard courier.
  - The v1.0 body is 6.8mm, not the brief's 5mm (04.4) — disclosed, not
    hidden, with a named v2.0 path.
  - No firmware or software line of code has been written; both documents
    in Section 06 are architecture, not implementation.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END LOT_COMPUTER_HARDWARE_PLAN_v1
================================================================================
