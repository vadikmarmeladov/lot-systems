<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT_COMPUTER_HARDWARE_PLAN
TITLE:    LOT® Computer — Desk Terminal Hardware — Plan, BOM, Roadmap
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-01
VERSION:  0.1 — DEVELOPMENT START
STATUS:   PRE-HARDWARE — PLAN + BOM + ROADMAP (DESIGN LOCK PENDING)
BRANCH:   claude/brave-lamport-qksqde
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES AND CONSTRAINTS
--------------------------------------------------------------------------------

This document was built by reading the existing hardware and brand corpus in
this repository before writing a line of spec, per house doctrine (no new
invention without checking what is already on record):

  docs/benchmark/LOT-MANIFEST.md
    Confirms a prior "COSMO Hardware" feature line — brave-lamport-t9z5u8,
    14 iterations, +2610 lines, tagged BEST — "COSMO® Cube — complete
    hardware computer design v1.0." That branch no longer exists on the
    remote (pruned or superseded before merge; no COSMO Cube spec file
    survives in docs/ today). This session's branch, claude/brave-lamport-
    qksqde, continues the same naming cluster. This document treats that
    prior work as lost-but-referenced, not as something to silently
    reinvent under a different name — see Section 01 for how LOT Computer
    is scoped against both COSMO® and CUBIQ™.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The v.0 haptic notification cube (CUBIQ™) — a hopping, actuated object,
    explicitly NOT a general-purpose computer. Its own reading log draws
    the same line this document draws: COSMO® Hardware is a general-purpose
    hardware computer; CUBIQ™ is a notification body. LOT Computer (this
    document) is the object the brief actually describes — a stationary
    two-piece desk terminal with a screen, camera, and button — and is
    kept textually distinct from both.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    COSMO® brand register, Benchmark Arbitrage® gate, and the ethical
    framework ("What LOT Will Never Do" / "What LOT Will Always Do").
    LOT Computer inherits this ethics register directly — no surveillance,
    no data resale, instant disconnect, human gate on anything irreversible.

  docs/technical/LOT-NODE-0-RIG-SPEC.md / docs/corporate/LOT_Autonomous_AI_Server.md
    House convention for a hardware BOM document: component table with
    ENTRY/SERIOUS price tiers, a build-order sequence, and an explicit
    "what already exists vs. what is added" split. This document follows
    the same shape, scaled from a server rig to a 100-unit consumer run.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Section III lists "Quantum Cube Hardware | Hardware feedback
    integration (Month 12+) | PLANNED" as a roadmap line item already on
    record. LOT Computer is a second, parallel hardware line — a terminal,
    not the Cube — and does not claim that line item for itself.

  src/server/routes/api.ts (POST /logs, PUT /logs/:id)
  docs/technical/OS_API.md
  docs/benchmark/LOT-DOCTRINE.md ("Widget→Memory Compression Loop")
    The live API surface this hardware plugs into. Referenced throughout
    Sections 07-09 and specified in full in the companion software document
    (Section 10).

CONSTRAINT — NETWORK ACCESS THIS SESSION: this session's outbound network
policy blocks brand.lot-systems.com, lot-systems.com, institute.lot-systems.com,
and every general commerce/component vendor host tested (PCBWay, Digi-Key,
Mouser, Adafruit, SparkFun, LCSC) — confirmed via the proxy's own status
endpoint (`connect_rejected`, "policy denial," all three LOT domains and all
six vendor domains, 2026-08-01). This is disclosed here rather than worked
around. Two consequences for this document:

  1. Brand grounding is drawn from the internal corpus above, which is the
     authoritative source material those public pages are generated from
     in the first place — not a substitute, the origin.
  2. The Bill of Materials in Section 04 names real component families and
     real vendor homepages (stable top-level domains, not fabricated deep
     links to specific SKUs, quotes, or prices), and prices are marked as
     unverified estimates. Exact part numbers, live pricing, and PCBWay/CNC
     quotes are a procurement step for a session with commerce network
     access — this document plans the shopping list; it does not complete
     the purchase.

--------------------------------------------------------------------------------
01 // WHAT LOT COMPUTER IS AND IS NOT
--------------------------------------------------------------------------------

LOT® Computer is a stationary, two-piece desk terminal: a small hardware
object that sits on a desk, receives pager-style notifications from the
operator's LOT Index of Systems, displays them on a low-power screen, and
lets the operator send one signal back — a single "Copy" button press that
appears in their Log tab on lot-systems.com within seconds.

  LOT COMPUTER IS:
    - A receive-and-acknowledge terminal. The Index of Systems (QI·46,
      badges, weather, calendar) pushes short text notifications — "Coffee
      time!", a badge unlock, a weather-mood cue. The operator reads it on
      a small screen and, optionally, presses Copy to log that they saw it.
    - A two-part stainless steel object: a puck-shaped "face" (camera,
      screen, button, one polished stainless side) sitting on a flat
      silver base plate (wireless charger + weather sensor + the physical
      anchor for the object).
    - A closed loop into the existing LOT stack — no new backend
      philosophy, the same POST /logs endpoint and the same Log tab every
      other LOT surface already writes to (Section 08).

  LOT COMPUTER IS NOT:
    - COSMO® (docs/corporate/LOT_ROBOTICS_COSMO.md) — COSMO® is a personal
      robotics line carrying an owner's behavioral "soul" signature,
      gated by Benchmark Arbitrage®, autonomous and mobile. LOT Computer
      has no autonomy and does not move. It is a fixed appliance.
    - CUBIQ™ (docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md) — CUBIQ™
      notifies through motion (a hop, a nudge) and deliberately carries no
      screen, on the theory that a moving object is not a screen
      substitute. LOT Computer is the opposite design bet: a small,
      deliberately low-power, low-stimulation screen is the whole point —
      a pager, not a feed. Both objects can exist on the same desk without
      brand collision; neither supersedes the other.
    - A camera-first or always-listening device. The camera exists for a
      narrow, operator-triggered purpose (Section 03); it does not stream,
      does not run continuous capture, and is bound by the same ethics
      register as every other LOT surface (Section 09, Section 11).

  THE PRINCIPLE
    A pager is the correct reference object, not a smart display and not a
    robot. A pager receives, shows one thing, and gets acknowledged. LOT
    Computer's entire hardware and firmware budget (Sections 02-06) is
    spent making that one loop — notification in, Copy out — small,
    reliable, and cheap enough to build 100 of.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM — TWO-PART STAINLESS STEEL BODY
--------------------------------------------------------------------------------

  OVERALL FOOTPRINT   Face: ~48mm diameter puck, ~18mm max thickness at the
                       camera boss, tapering to ~9mm at the polished edge.
                       Base: 40mm × 40mm × 5mm flat square plate (per brief,
                       item 4) — the base is deliberately smaller in
                       footprint than the face so the face reads as the
                       object and the base reads as the surface, echoing
                       CUBIQ™'s "the charging pad is the table" design
                       language (LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 02).

  MASS TARGET          Face <90g fully assembled (stainless is heavy; every
                       gram is machining time and material cost at 100
                       units — see Section 05). Base ~60-70g, mass is not
                       a constraint on the base since it never moves.

  PART A — THE FACE (two-sided stainless puck)
    Side 1 — POLISHED    Mirror-polished 316L stainless steel. No
                          components, no seams visible from this face when
                          the unit is set down "reversed" (brief item 17) —
                          the object can sit on a desk as a plain, quiet
                          object when the operator wants zero surface area
                          for notification, consistent with the anti-feed
                          thesis carried over from CUBIQ™.
    Side 2 — INSTRUMENT   Bead-blasted stainless steel bezel, carrying
                          (brief item 18):
                            - Screen: round, center-mounted, low-power
                              display (Section 06 / firmware document
                              Section 02 specifies panel candidates)
                            - Camera: single small lens, top bezel,
                              operator-triggered only (Section 03)
                            - Button: "Copy" — single mechanical tactile
                              button, bottom bezel (Section 08)

  PART B — THE BASE (flat silver square, brief item 4)
    40mm × 40mm × 5mm, brushed stainless or anodized aluminum (brushed
    finish, not mirror — the base is a surface to be touched and set
    objects on, not a display face). Houses:
      - Qi-class wireless charging coil + receiver electronics
        (brief item 19)
      - Weather sensor module (brief item 14/15 — off-the-shelf,
        AI-inference-grade environmental sensor, Section 04)
      - Alignment magnets (4, corner-mounted) so the Face seats in a
        repeatable position over the charging coil every time it is set
        down — no cable, no plug, drop-and-charge.

  SURFACE CONTACT   Face rests directly on the Base's brushed top face.
                     No feet, no gap — the Face is meant to be lifted,
                     read, set back down, unlike CUBIQ™ which stays on the
                     base continuously and only leaves it to hop.

  FINISH DUALITY AS BRAND LANGUAGE
    Polished vs. bead-blasted, reflective vs. functional — the same "clean
    mind, clean body" duality already named as LOT's physical-product
    thesis (docs/corporate/LOT-CUBIQ-VISION.md, Section 05: "physical
    products for sci-fi hygiene, cleanness and cleanse"). One face is
    ornamental and honest about being an object; the other is instrument
    and honest about being a tool. The operator chooses which face is up.

--------------------------------------------------------------------------------
03 // CAMERA — SCOPE AND LIMITS
--------------------------------------------------------------------------------

  PURPOSE     Operator-triggered still capture only — e.g. "attach a photo
              to this Log entry" as a second action alongside Copy (long-
              press Copy = capture + attach, short-press = text-only Copy;
              full gesture table in the firmware document, Section 04).
  WHAT IT IS NOT   Not a security camera, not continuous capture, not a
              always-on presence sensor. No frame leaves the device except
              the single JPEG the operator explicitly triggered, and it is
              purged from device flash immediately after upload succeeds
              (firmware document, Section 07 — Security).
  MODULE      Small fixed-focus camera module in the ~2-5MP class (module
              candidates in Section 04). Resolution target is deliberately
              low — this is a Log-tab thumbnail, not a photography product.

--------------------------------------------------------------------------------
04 // BILL OF MATERIALS
--------------------------------------------------------------------------------

Component families named below are real, commercially available parts
used here as representative choices for cost and feasibility planning.
Exact SKU, current price, and lead time need live vendor verification —
this session's network policy blocked every vendor host tested (Section
00). ENTRY = lowest-cost workable part; SERIOUS = higher-spec alternative
for the pilot/100-unit run if the entry part underperforms in prototype
testing. All unit prices are single-unit hobbyist-channel estimates, not
100-unit bulk pricing (bulk economics in Section 05).

```
COMPONENT            ENTRY CANDIDATE                SERIOUS CANDIDATE              EST. UNIT $
──────────────────   ────────────────────────────   ─────────────────────────────  ───────────
MCU / SoC             ESP32-S3 (WROOM-1 module)      ESP32-S3 (WROOM-2, 8MB PSRAM)   $3 – $6
                       WiFi + BLE, camera (DVP) I/F,   more PSRAM headroom for
                       dual-core, well-documented      camera + display buffers

CAMERA MODULE         OV2640 (2MP, fixed focus)      OV5640 (5MP, autofocus)         $3 – $9
                       cheapest DVP module with         better low-light + AF
                       ESP32-S3 driver support

DISPLAY               1.28" round LCD (GC9A01)       1.54" round e-paper (GDEY-     $4 – $12
                       cheap, fast refresh, always-     class) — near-zero standby
                       backlit (higher idle power)      power, ghosting on refresh

WEATHER SENSOR         BME280 (temp/humidity/         BME680 (adds gas/VOC —         $2 – $8
                       pressure)                        "AI-grade" air-quality
                                                         signal, brief item 15)

WIRELESS CHARGE (RX)   Qi receiver IC (BQ51013B-      Qi receiver IC + FOD-tuned     $2 – $6
                       class) + receiver coil           coil, higher-efficiency
                                                         (less base-plate heat)

WIRELESS CHARGE (TX)   Qi transmitter IC + TX coil,    Qi transmitter IC with        $2 – $7
                       base plate side                  foreign-object-detection

BUTTON                Tactile SMD switch, IP-rated    Sealed metal-dome switch,      $0.50 – $3
                       cap, laser-etched "Copy"          panel-mount, backlit ring

BATTERY               LiPo 300-500mAh (Face only —   LiPo 500-700mAh                $2 – $5
                       base is line/charge-powered)

PCB (Face + Base)      2-layer, ENIG finish,          4-layer, ENIG, controlled      $2 – $8 / unit
                       PCBWay prototype run             impedance, PCBWay production   at 100 qty
                                                         run pricing (Section 05)

ENCLOSURE (Face)       316L stainless, 2-piece CNC    316L stainless, 2-piece CNC     $15 – $40
                       shell, bead-blast + polish       + PVD coating option

ENCLOSURE (Base)       Brushed 5052 aluminum plate,    Brushed 316L stainless          $8 – $20
                       CNC, 40×40×5mm

ANTENNA                PCB trace / chip antenna         External stub antenna         $0.20 – $2

FASTENERS / GASKET      M1.6-M2 stainless screws,       Custom silicone gasket set     $1 – $3
                       silicone O-ring, IP-rated
──────────────────   ────────────────────────────   ─────────────────────────────  ───────────
UNIT SUBTOTAL (parts, single-unit pricing, entry tier)                              ≈ $45 – $60
UNIT SUBTOTAL (parts, single-unit pricing, serious tier)                            ≈ $75 – $110
```

  VENDOR STARTING POINTS (top-level, stable domains — not deep links)

```
CATEGORY               VENDOR                          HOMEPAGE
────────────────────   ─────────────────────────────   ────────────────────────
PCB fab + assembly     PCBWay (brief item 1)            https://www.pcbway.com
CNC stainless shells   PCBWay CNC service, or a local    https://www.pcbway.com
                        precision-machining shop
Electronic components  Digi-Key                          https://www.digikey.com
                       Mouser                            https://www.mouser.com
                       LCSC (China-side BOM sourcing,     https://www.lcsc.com
                        pairs naturally with a PCBWay
                        assembly run)
Modules / dev kits     Adafruit                          https://www.adafruit.com
                       SparkFun                          https://www.sparkfun.com
```

  PROCUREMENT NEXT STEP — a session with commerce-network access should:
  (1) get current PCBWay quotes for the Face + Base PCBs at 10 / 25 / 100
  unit tiers, (2) get a CNC quote for the two stainless shells at the same
  tiers, (3) confirm OV2640/GC9A01/BME280/BQ51013B (or serious-tier
  equivalents) current stock and pricing on Digi-Key/Mouser/LCSC, and
  (4) fold verified numbers back into Section 05's cost rollup.

--------------------------------------------------------------------------------
05 // COST ROLLUP — PROTOTYPE → PILOT → 100-UNIT RUN
--------------------------------------------------------------------------------

```
STAGE            QTY     PARTS (entry tier)   PCB + ASSEMBLY   CNC SHELLS   EST. TOTAL / UNIT
──────────────   ─────   ──────────────────   ──────────────   ──────────   ─────────────────
PROTOTYPE         5       $60                  $15 (proto fab)  $60 (1-off)  ≈ $135
PILOT             25      $52                  $8               $30          ≈ $90
PRODUCTION        100     $45                  $5               $18          ≈ $68
```

Unit cost falls with quantity mainly on the two machined-part lines (PCB
panelization and CNC batching), which is why Section 06's roadmap gates a
100-unit commitment behind a pilot run, not the other way around — the
pilot exists to validate the design before the batching discount is worth
locking in on tooling.

```
TOTAL PROGRAM COST (rough order of magnitude, entry tier, excludes NRE
tooling, certification, and firmware/software labor):

  Prototype (5 units):     ≈ $675
  Pilot (25 units):        ≈ $2,250
  Production (100 units):  ≈ $6,800
  ─────────────────────────────────
  Program total:           ≈ $9,725
```

--------------------------------------------------------------------------------
06 // ROADMAP — v0 → v1 → v2 → 100-UNIT RUN (brief item 13)
--------------------------------------------------------------------------------

  v0 — BREADBOARD PROOF (WEEKS 1-3)
    ESP32-S3 dev kit + off-the-shelf camera/display/weather breakout
    boards, no custom PCB, no enclosure. Prove: camera capture → LOT API
    upload, screen renders a pushed notification, button POSTs to /logs
    and appears in the Log tab (Section 08) on a real account.
    GATE: one end-to-end notification-in / Copy-out cycle observed live
    on lot-systems.com, latency and reliability logged.

  v1 — CUSTOM PCB, NO ENCLOSURE (WEEKS 4-8)
    First PCBWay board spin (Face + Base as two boards), Qi charge tested
    base-to-face, weather sensor validated against server-side weather API
    (`#server/utils/weather`) for drift. Firmware v0.1 per the companion
    firmware document.
    GATE: 3 prototype units running for 7 consecutive days with zero
    firmware crashes and correct Qi charge hand-off.

  v2 — STAINLESS ENCLOSURE, PILOT RUN (WEEKS 9-16)
    CNC shells (polished + bead-blast Face, brushed Base), IP-rated
    gasket/button, 25-unit pilot batch. First PDF manual draft (Section
    10.3) written against a real, physical unit.
    GATE: 25/25 units pass the QC test jig (firmware document, Section
    06) and a 14-day burn-in with zero DOA.

  100-UNIT PRODUCTION RUN (WEEKS 17-24, brief item 13)
    PCBWay production-tier PCB order, batched CNC shell order, per-unit
    provisioning (firmware document, Section 05 — factory pairing keys),
    fleet registered in the device management panel (software document,
    Section 05).
    GATE: 100/100 units provisioned, QC-passed, and paired to a live LOT
    account before any unit ships to an operator.

  RULE (matching Manifest §06 doctrine): one hardware gate per stage, never
  skip a gate to compress the timeline, and never commit to the 100-unit
  batch discount (Section 05) before the pilot gate is GREEN.

--------------------------------------------------------------------------------
07 // NOTIFICATION LANGUAGE — THE PAGER SURFACE
--------------------------------------------------------------------------------

The screen (Section 02, Part A / Section 06 firmware panel choice) renders
short, single-message text pushed from the Index of Systems — the same
signal source CUBIQ™ maps to motion gestures (LOT-CUBIQ-QUANTUM-CUBE-v0.md,
Section 04). LOT Computer maps signals to short text instead of motion:

```
SIGNAL SOURCE                          EXAMPLE PAGER TEXT
─────────────────────────────────────  ─────────────────────────────
Weather-mood pattern (OS_API insight)  "Coffee time!" / "Clear skies — good
                                        energy window"
Badge unlock (common/uncommon)         "Badge: [name]"
Memory question ready                  "A question is waiting"
Assembly phase advanced                "System: [phase] unlocked"
Streak / consistency milestone         "Day [N] — streak intact"
```

Full trigger-to-text mapping, message queue behavior, and display refresh
policy are specified in the firmware document (Section 03) and the
software connector document (Section 03).

--------------------------------------------------------------------------------
08 // THE COPY BUTTON — DEVICE TO LOG TAB (brief item 16)
--------------------------------------------------------------------------------

A single mechanical button, labeled Copy, is the device's only outbound
signal besides the optional camera capture (Section 03). Pressing it
takes whatever pager text is currently on screen and POSTs it to the
existing `/logs` endpoint (`src/server/routes/api.ts:1547`) already used
by every other LOT surface:

```
POST /logs
{
  "text": "<currently displayed pager text>",
  "event": "device_copy",
  "metadata": { "deviceId": "<paired device id>", "source": "lot-computer" }
}
```

The entry appears in the operator's Log tab on lot-systems.com within the
same request-response cycle — no polling, no delay budget beyond normal
API latency. Full endpoint contract, auth/pairing model, and the required
`formatLog()` case for the new `device_copy` event type (per
docs/benchmark/LOT-DOCTRINE.md's Widget→Memory Compression Loop rule — an
event type with no formatLog case is silently invisible to the Memory
Engine) are specified in the software connector document, Section 02-03.

--------------------------------------------------------------------------------
09 // SESSION COMPRESSION (brief item 8)
--------------------------------------------------------------------------------

The device does not stream every sensor tick or button bounce to the
server. Firmware buffers a session locally (weather readings, charge
events, Copy presses, capture events) and uploads one compressed summary
per session — mirroring the existing Widget→Memory Compression Loop
pattern already governing the software stack (weekly story aggregation,
Job 24; PLANNER-CONTEXT extraction) rather than inventing a new ingestion
philosophy. Compression contract specified in the software connector
document, Section 04.

--------------------------------------------------------------------------------
10 // DOCUMENT MAP
--------------------------------------------------------------------------------

This plan is deliberately kept separate from firmware and software specs
(brief item 11 — "separate documents"):

```
docs/corporate/LOT_COMPUTER_HARDWARE_PLAN.md          THIS DOCUMENT
  Plan, physical design, BOM, manufacturing roadmap, cost.

docs/technical/LOT_COMPUTER_FIRMWARE_SPEC.md
  On-device firmware: MCU/RTOS, drivers, power management, pairing,
  OTA, security, QC test jig, per-unit provisioning for the 100-unit run.

docs/technical/LOT_COMPUTER_SOFTWARE_CONNECTOR.md
  Server-side LOT API connector: device pairing endpoints, notification
  push channel, Copy → /logs mapping, session-compression ingestion,
  fleet/device management panel, PDF manual generation pipeline
  (brief item 7 — reuses the existing scripts/generate_badge_pdf*
  pattern already in this repository).
```

--------------------------------------------------------------------------------
11 // ETHICS — INHERITED FROM COSMO® / LOT® REGISTER
--------------------------------------------------------------------------------

LOT Computer inherits, unmodified, the ethical register already on record
in docs/corporate/LOT_ROBOTICS_COSMO.md:

  - No behavioral data resale. Copy-press and capture data belongs to the
    operator's LOT profile, same as every other Log entry.
  - No surveillance posture. The camera is operator-triggered only
    (Section 03); there is no standing-capture mode in this spec, ever.
  - Instant disconnect. Un-pairing a device (software document, Section 02)
    is immediate and permanent — the device goes dark, no notification
    surface remains.
  - Human gate on anything irreversible. Firmware OTA updates and factory
    re-provisioning both require an explicit human-approved action in the
    fleet management panel (software document, Section 05) — no silent
    remote firmware push to a device already in an operator's hands.

--------------------------------------------------------------------------------
12 // BRAND
--------------------------------------------------------------------------------

LOT® Computer              The object — this document
CUBIQ™                     Sibling notification object — motion, not screen
COSMO®                     Sibling robotics line — mobile, soul-carrying
LOT®† Computer             The combined mark, pending trademark filing
                            alongside the marks already listed as Pending
                            in docs/corporate/LOT_ROBOTICS_COSMO.md

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT_COMPUTER_HARDWARE_PLAN
================================================================================
