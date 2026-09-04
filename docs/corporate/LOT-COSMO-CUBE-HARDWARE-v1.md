<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-HARDWARE-v1
TITLE:    LOT®† COSMO® Cube — v1.0 Hardware Computer, Plan & Roadmap
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-09-04
VERSION:  1.0 — RECONSTRUCTION (design lock pending PCBWay DFM review)
STATUS:   PRE-PRODUCTION — SPEC LOCKED FOR PROTOTYPE, 100-UNIT PILOT PLANNED
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This document is a reconstruction, not a new invention. Before writing a line
of spec, the following were read in full:

  docs/benchmark/LOT-MANIFEST.md, line 31
    "COSMO Hardware | brave-lamport-t9z5u8 | c7d353ef | 14/14 | BEST | 7 |
    +2610 | COSMO® Cube — complete hardware computer design v1.0." This is
    the only prior record of a v1.0 hardware computer design. The branch
    (brave-lamport-t9z5u8) and its commit (c7d353ef) are no longer reachable
    in this repository — pruned before this session. The +2610 lines of
    original spec are lost. This document is a from-record reconstruction,
    built to the same product name and version number, authored on the
    direct successor branch in the same series (brave-lamport-xtfzf4).
    Nothing here should be read as recovered text — it is a fresh v1.0
    written to fill a confirmed gap.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The sibling hardware document. Its own reading log (line 49-56) already
    drew the line between the two objects: "CUBIQ™ is LOT®'s object: a
    notification body, not a computer... COSMO® Cube... is a general-purpose
    hardware computer. The two are related by lineage (father/son,
    LOT®/COSMO®) and should share no naming collision going forward." This
    document is the COSMO® Cube side of that split, honoring the boundary
    CUBIQ already drew: CUBIQ moves (haptic, no screen); COSMO® Cube shows,
    watches, and listens (screen, camera, sensors) but does not move.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Defines COSMO® as the personal-robotics brand named for Kuzya Cosmo
    Marmeladov, and lays out a four-phase revenue path (Section "Revenue
    Path"): Phase 3, "COSMO® Hardware," 2028-2029, "$2,500-$5,000 per unit
    + $100/month soul sync subscription." COSMO® Cube v1.0 is not that
    phase-3 soul-transfer robot — it is brought forward as the first
    physical COSMO® object: a notification appliance an operator can hold,
    years before a companion robot is buildable. It shares the brand and
    the eventual sync channel (Section "Technical Integration: LOT ->
    COSMO®" — "Continuous sync via LOT Quantum OS") but not the Benchmark
    Arbitrage® eligibility gate, which stays reserved for the full
    soul-transfer product line.

  docs/corporate/LOT-TERMINAL-M2M.md
    The M2M Data Intake Protocol — device_id / operator / metric JSON
    formats, the POST https://api.lot-systems.com/v1/m2m/intake endpoint
    shape, and the S-2 operator progression (Recruit -> Private ->
    Specialist -> S-2). Section 06 below reuses this exact protocol shape
    for the LOT API connector rather than inventing a new one.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    Format precedent for a hardware document that mixes principle,
    component cost tables, and a numbered build sequence in TERMINAL GRID
    style. Section 07 (manufacturing) and Section 09 (BOM pointer) follow
    its cost-table convention.

  docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
    The Virtuous Compression Cycle doctrine — "Each answer compresses the
    profile. Each compressed profile produces a sharper question." Section
    05 below applies the same doctrine to on-device session data: every
    interaction window compresses to one log line, not a raw feed.

  docs/assembly/LOT-GENESIS-v1.md, Node 19
    LOT Terminal / hardware dual-track model (open build track vs.
    commercial M2M track) and the invariant "S-2 attribution — every file
    credits Vadim and Cosmo," carried into the file header above.

--------------------------------------------------------------------------------
01 // WHAT v1.0 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  v1.0 IS:
    - A small, flat, dual-material hardware computer that sits on a desk,
      pairs to one lot-systems.com account, and does three things: shows a
      short autonomous text notification, watches a Log-tab signal fire
      when its one physical button is pressed, and reports ambient weather
      to the operator's profile.
    - A closed loop with the Memory Engine and the Log tab that already
      exist in production (docs/assembly/LOT-GENESIS-v1.md, Node 4 —
      GET /api/live-message, POST /api/logs) — no new backend concept, a
      new physical front end for concepts already shipped.
    - A 100-unit pilot manufacturing run: PCBWay for the PCB and SMT
      assembly, a two-piece stainless-steel body from a CNC/metal-fab
      partner, wireless (Qi) charging, and a printed + PDF manual in the
      box.

  v1.0 IS NOT:
    - The COSMO® soul-transfer robot of LOT_ROBOTICS_COSMO.md Phase 3. No
      Benchmark Arbitrage® gate, no behavioral-signature sync, no
      humanoid form factor. COSMO® Cube v1.0 is furniture with a screen,
      not a companion.
    - A CUBIQ (LOT-CUBIQ-QUANTUM-CUBE-v0.md). It has no actuator and does
      not move. Its notification language is a screen line, not motion.
    - Internet-of-things in the generic sense. It speaks to exactly one
      backend (lot-systems.com) through one connector (Section 06), the
      same way every other LOT client (web, PWA) does.

  THE PRINCIPLE
    Ship the smallest true computer first. A flat stainless-steel square
    that shows one line of text when the Memory Engine has something to
    say, and writes one line back to the Log tab when its button is
    pressed, is a complete v1.0. Cameras that recognize faces, screens
    that render dashboards, and voice input are v2+ — this document keeps
    that line explicit in Section 08.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  DIMENSIONS       40mm x 40mm x 5mm — a flat silver square, reference size.
  BODY              Two-part 316L stainless-steel shell (Section 03 on the
                     PCB, which the two halves clamp around):
                       FRONT PLATE — bead-blasted satin finish, cut for the
                       camera aperture, the display window, and the single
                       button.
                       BACK PLATE — mirror-polished, no cutouts except the
                       wireless-charge alignment ring. This is the "flat
                       silver square" face the operator sees when the unit
                       sits idle on a desk — polished stainless, no
                       branding etched into the metal (brand lives in
                       firmware, on the screen, per Section 04).
  MASS TARGET       <60g fully assembled. A flat object earns its calm
                     presence by being light enough to not need to be
                     moved once placed — the opposite design goal from
                     CUBIQ (which must be light enough to jump).
  SEAM              Front and back plates join on a recessed lip, four
                     M1.6 stainless screws, gasketed — dust-resistant, not
                     submersible (IP54 target, not IP67).
  FRONT FACE LAYOUT (Section 18 of the intake brief, verbatim mapping):
    - Camera aperture, top-left, 4mm diameter, sits over the module in
      Section 03.
    - Display window, center, sits over the e-paper/OLED panel.
    - Button, bottom edge, single mechanical tactile switch, labeled
      COPY (Section 05).
  CHARGE INTERFACE   Wireless (Qi-class inductive) through the back
                     plate. The charging puck is a separate accessory —
                     the operator sets the Cube face-down on the puck to
                     charge, which also means the polished face is the
                     one resting against the charger, screen-up and
                     legible while charging.
  INDICATOR          No always-on light. A single-pixel status LED behind
                     the display bezel blinks only during pairing and
                     firmware update — otherwise the screen is the only
                     light source, and it is blank (not black-lit) between
                     notifications. This follows the CUBIQ anti-feed
                     thesis (LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 04): an
                     object that is not a screen competing for attention
                     the rest of the time.

--------------------------------------------------------------------------------
03 // ELECTRONICS ARCHITECTURE
--------------------------------------------------------------------------------

  MCU / SoC          ESP32-S3 (dual-core Xtensa LX7, Wi-Fi + BLE 5,
                     8MB PSRAM variant). Reasoning: the one chip on this
                     BOM that natively drives a camera (DVP interface),
                     a display, Wi-Fi to lot-systems.com, and BLE for
                     phone-assisted pairing — no second radio module
                     needed. This is the same class of "AI-grade
                     off-the-shelf" component philosophy the intake brief
                     calls for (Section "AI grade off-the-shelf sensors,"
                     Section 15 below) applied to the compute node itself:
                     production-proven silicon, not a custom ASIC.

  DISPLAY            1.54" monochrome e-paper (SPI, ~200x200px). Chosen
                     over an OLED for the "simple screen, autonomous
                     notification" brief — e-paper holds the last message
                     ("Coffee time!") with zero power draw between pushes,
                     which is the correct physical expression of a pager:
                     a pager does not relight its own screen to stay lit,
                     it lights briefly, then holds the message readable
                     until the next one arrives.

  CAMERA             OV2640 (2MP, DVP/SCCB, ESP32-camera-driver supported
                     out of the box). v1.0 use: presence detection (is
                     anyone at the desk before a notification fires) and
                     an operator-triggered snapshot attached to a Log
                     entry, exactly as one more Log context field
                     (src/server/utils/logs.ts — getLogContext already
                     attaches context to every Log row; a camera-derived
                     field is additive, not a new pipeline).

  WEATHER SENSOR     BME280 (temperature, humidity, barometric pressure,
                     I2C). This is the same metric set the WeatherResponse
                     model already stores server-side
                     (docs/assembly/LOT-GENESIS-v1.md, Node 3) — the Cube
                     becomes a first-party local sensor for a field the
                     server currently only fills from a geocoded API call.
                     Reported using LOT-TERMINAL-M2M.md's "Multi-Sensor
                     Array" format (Format 3), not a new schema.

  BUTTON             Single mechanical tactile switch, silicone-capped,
                     rated 300k+ actuations, IP54-sealed under the front
                     plate. One button, one function (Section 05) — no
                     multi-press gestures in v1.0.

  WIRELESS CHARGE    Qi receiver coil + charge-management IC, back plate,
                     5V/1A input via the external puck. Battery: 300mAh
                     LiPo, single-cell, UL1642-rated — enough for
                     multi-day standby on an e-paper display that is dark
                     between pushes.

  PCB                Single 4-layer rigid PCB, ENIG finish, sized to the
                     40x40mm shell interior. Fabrication + SMT assembly:
                     PCBWay (Section 07 — the vendor named in the intake
                     brief, item 1). PCBWay's prototype tier (5-10 boards,
                     ~1 week turn) validates the layout before committing
                     to the 100-unit SMT assembly order.

  CONNECTIVITY       Wi-Fi 802.11 b/g/n (2.4GHz only — smaller antenna,
                     lower power, sufficient for a text-and-JSON payload
                     device). BLE 5 reserved for phone-app pairing only
                     (Section 06).

--------------------------------------------------------------------------------
04 // NOTIFICATION PIPELINE — THE PAGER
--------------------------------------------------------------------------------

The Cube's core behavior is a pager: a short, autonomous, text notification
pushed from the AI-powered site, with no operator action required to
receive it.

    Memory Engine / Index of Systems     (existing, lot-systems.com)
                │  question ready, badge unlocked, weather shift,
                │  or an operator-authored LiveMessage
                ▼
    GET /api/live-message  +  new  GET /api/device/notify   (Section 06)
                │  polled by the Cube's firmware every 60s over Wi-Fi,
                │  OR pushed immediately over an authenticated WebSocket
                │  upgrade of the existing SSE channel (/api/sync already
                │  carries a users_online / settings_updated pattern —
                │  the device adds itself as one more subscriber class)
                ▼
    COSMO CUBE DISPLAY DRIVER (firmware — docs/technical/COSMO-CUBE-FIRMWARE.md)
                │  renders up to 3 lines, e.g. "Coffee time!"
                ▼
    e-paper refresh, screen holds the message until the next push

  WHY POLL + PUSH, NOT PUSH-ONLY
    An e-paper device sleeps most of the time to protect the 300mAh cell.
    A 60-second poll is the power-safe floor; the SSE/WebSocket path is an
    optional low-latency upgrade for units that stay Wi-Fi-associated
    (not deep-sleeping) because they are on charge. Both paths terminate
    in the same firmware display driver — one message format in, one
    render function.

  MESSAGE CLASS EXAMPLES (mirrors CUBIQ's four-gesture vocabulary, adapted
  to text instead of motion — LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 04):
    "Coffee time!"            — circadian / self-care nudge
    "Badge unlocked."         — badge_unlock Log event, compressed to 3 words
    "Weekly summary ready."   — weekly_summary_response
    "—" (blank hold)          — no active signal; screen holds prior message

--------------------------------------------------------------------------------
05 // THE COPY BUTTON — SIGNAL BACK TO THE LOG TAB
--------------------------------------------------------------------------------

One button, one action: COPY. Pressed, it fires a single authenticated
POST to the existing Log endpoint, using the exact schema the endpoint
already accepts (src/server/routes/api.ts, POST /logs — Body: { text,
event, metadata }):

    POST https://lot-systems.com/api/logs
    Authorization: Bearer <device-scoped session token, Section 06>
    Content-Type: application/json

    {
      "text": "COSMO Cube — Copy pressed",
      "event": "device_copy",
      "metadata": {
        "device_id": "cosmo-cube-000041",
        "battery_pct": 82,
        "last_notification": "Coffee time!"
      }
    }

  This appears in the operator's Log tab the same way any other Log row
  does — no special-cased UI. The one whitelist change this requires on
  the server is adding 'device_copy' to the displayableEvents array
  (src/server/routes/api.ts, ~line 1084) per Doctrine clause 4, "Backend
  Whitelist Hygiene" (docs/assembly/LOT-GENESIS-v1.md, Node 13) — an event
  type not on that list is silently dropped from GET /api/logs even
  though it was written, which is exactly the failure class that clause
  exists to prevent.

--------------------------------------------------------------------------------
06 // LOT API CONNECTOR
--------------------------------------------------------------------------------

The Cube speaks to exactly one backend, through one connector, reusing
the M2M protocol already specified in LOT-TERMINAL-M2M.md rather than a
bespoke device API:

  PAIRING (one-time, via BLE + phone browser — no keyboard on-device):
    1. Operator scans a QR code shown on lot-systems.com/settings.
    2. Cube advertises over BLE; phone browser (Web Bluetooth) sends the
       operator's session-derived device token.
    3. Cube stores the token in flash (encrypted, ESP32-S3 secure boot +
       flash encryption enabled — Section 06 continues in
       docs/technical/COSMO-CUBE-SOFTWARE.md).

  RUNTIME:
    - GET  /api/device/notify         poll for a pending pager message
    - GET  /api/live-message           fallback / operator broadcast
    - POST /api/logs                   Copy button (Section 05), weather
                                        readings (Section 03, Format 3)
    - POST /api/weather (device-scoped)  BME280 sample, replaces or
                                        supplements the geocoded fetch

  Full connector spec, auth lifecycle, and firmware-to-software split
  live in the two documents this one intentionally does not duplicate
  (Section 09).

--------------------------------------------------------------------------------
07 // MANUFACTURING — 100-UNIT PILOT RUN
--------------------------------------------------------------------------------

  STEP 1 — PCB PROTOTYPE (PCBWay)
    5-10 bare boards, 4-layer, ENIG. Bring-up on 2-3 hand-assembled units
    before committing to SMT.

  STEP 2 — SMT ASSEMBLY (PCBWay, 100-unit order)
    PCBWay's turnkey PCBA service: board fab + component sourcing + SMT
    placement + reflow + AOI inspection, 100 units.

  STEP 3 — ENCLOSURE (metal-fab partner, parallel to Step 2)
    Two-piece 316L stainless shell, CNC-milled or MIM (metal injection
    molding, cheaper at 100-unit volume) — front bead-blasted, back
    mirror-polished (Section 02). Sourced independently of PCBWay; PCBWay
    is a PCB/PCBA house, not a metal-fab shop.

  STEP 4 — FINAL ASSEMBLY + BURN-IN
    PCB into shell, battery + Qi coil seated, 4-screw close, 24h burn-in
    per unit (pair to a test account, confirm one notification round-trip
    and one Copy-button round-trip before boxing).

  STEP 5 — PACKAGING
    Unit + charging puck + printed quick-start card + link/QR to the full
    PDF manual (Section 09, docs/corporate/COSMO-CUBE-USER-MANUAL.pdf).

  Full itemized component list, supplier links, and 100-unit cost roll-up:
  docs/corporate/LOT-COSMO-CUBE-BOM.md (Section 09).

--------------------------------------------------------------------------------
08 // ROADMAP — v0.1 -> v0.5 -> v1.0 -> 100-UNIT PILOT
--------------------------------------------------------------------------------

  v0.1 — BREADBOARD PROOF
    ESP32-S3 dev board + e-paper breakout + BME280 breakout, no shell.
    GATE: one round-trip notification ("Coffee time!" rendered from a
    real GET /api/live-message response) and one round-trip Copy press
    (row visible in the operator's live Log tab) on unpackaged hardware.

  v0.2 — CUSTOM PCB, NO SHELL
    PCBWay prototype board (Section 07, Step 1) replaces the breadboard.
    Camera added. GATE: same round-trips as v0.1, now on the target PCB,
    plus one successful presence-detection snapshot attached to a Log row.

  v0.5 — SHELL FIT
    First stainless-steel prototype shells (low-volume CNC, not the
    100-unit MIM run). Fit check: PCB, battery, Qi coil, camera aperture,
    display window, button travel. GATE: shell closes flush, IP54 seal
    holds, button actuates cleanly through the front plate.

  v1.0 — THIS DOCUMENT, DESIGN LOCK
    All of Sections 02-06 frozen. No further mechanical or pinout changes
    without a new version number. GATE: 3 hand-built v1.0 units pass a
    72-hour multi-day standby test (screen legible, battery >20% at 72h)
    plus the v0.2 round-trip gates repeated on final hardware.

  100-UNIT PILOT RUN
    Section 07 executed at scale. GATE: 100/100 units pass Step 4 burn-in;
    defect rate on first-boot pairing <5%; every unit's first Copy press
    lands in the correct operator's Log tab (identity/pairing correctness
    is the one failure class this run cannot ship with any tolerance).

  BEYOND v1.0 (not scoped, named so later sessions do not silently
  re-litigate what v1.0 deliberately left out):
    - Multi-line / graphical e-paper layouts
    - On-device camera-based badge unlock (visual check-in)
    - Second SKU sharing this PCB in the CUBIQ actuated shell

--------------------------------------------------------------------------------
09 // DOCUMENT SET — SEPARATE DOCUMENTS, ONE SYSTEM
--------------------------------------------------------------------------------

Per the intake brief's explicit instruction to keep firmware, software,
and manual documentation separate, this plan is the index, not the whole
set:

  THIS DOCUMENT           docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md
                           Plan, physical + electronics design, roadmap.

  COMPONENTS BUYING LIST   docs/corporate/LOT-COSMO-CUBE-BOM.md
                           Full BOM: category, part, supplier, link,
                           qty/unit, unit cost, 100-unit roll-up cost.

  FIRMWARE                 docs/technical/COSMO-CUBE-FIRMWARE.md
                           On-device code: drivers, display renderer,
                           button handler, OTA, power management.

  SOFTWARE / CONNECTOR      docs/technical/COSMO-CUBE-SOFTWARE.md
                           Server + companion-app side: pairing flow,
                           LOT API connector, auth lifecycle, session
                           compression pipeline (Section "08" of that
                           document — the compression doctrine named in
                           this document's reading log, Section 00).

  USER MANUAL (PDF)         docs/corporate/COSMO-CUBE-USER-MANUAL.pdf
                           Consumer-facing manual, generated from
                           docs/corporate/COSMO-CUBE-USER-MANUAL.md,
                           shipped in the box (Section 07, Step 5).

  SESSION REPORT             docs/benchmark/LOT-SR-20260904-01.md
                           This intake session, recorded per standing
                           instruction to push a full report after each
                           session.

--------------------------------------------------------------------------------
10 // BRAND
--------------------------------------------------------------------------------

LOT®† COSMO® Cube          The object — LOT® network, COSMO® hardware line
COSMO® Cube                Short form, on-box and in-manual
LOT®† CUBIQ®               Sibling object (does not move vs. does move) —
                           see LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 08

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-HARDWARE-v1
================================================================================
