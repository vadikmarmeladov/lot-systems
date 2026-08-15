================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-NODE-v1
TITLE:    COSMO® Node — v1.0 Personal Hardware Computer
          (formal spec for the MANIFEST line item "COSMO® Cube — complete
          hardware computer design v1.0")
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-15
VERSION:  1.0 — PLANNING LOCK (PRE-HARDWARE, PROTOTYPE NOT YET ORDERED)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is not a new invention. Before writing a line of spec, the following
were read in full:

  docs/benchmark/LOT-MANIFEST.md
    Section 01 lists "COSMO Hardware | brave-lamport-t9z5u8 | 14/14 | BEST |
    7 files | +2610 | COSMO® Cube — complete hardware computer design v1.0",
    and a later note says that branch "no longer exist[s] on the remote —
    they were incorporated into master in prior sessions." No such content
    exists anywhere in docs/ today. FINDING: the v1.0 hardware-computer spec
    was catalogued as shipped but the actual document was lost to a merge —
    this is the recovery and formal re-specification of that line item, not
    a duplicate of it. It is filed under a new name (COSMO® Node, not
    COSMO® Cube) because the physical brief this session received (flat
    40x40x5mm plate, not a cube) does not match the old codename — see
    Section 01 for the disambiguation.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    LOT®'s notification cube (CUBIQ™) — a 45mm actuated hopping cube with
    no camera, no screen, no button. Its own Section 00 already flags a
    "sibling hardware track... under Kuzya's COSMO® brand... a general-
    purpose hardware computer" and warns the two "should share no naming
    collision going forward." This document is that sibling track, made
    concrete. COSMO® Node does not move, hop, or actuate. CUBIQ moves and
    has no screen or camera. The two are not competing designs.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    COSMO® is Kuzya Cosmo Marmeladov's hardware brand (founded 1 July
    2024, father/son to LOT®, founded 7 April 2016). Phase 3, "COSMO®
    Hardware," is dated 2028-2029 and describes a much larger humanoid-
    robotics "Soul Sync Protocol" product at $2,500-5,000/unit. COSMO®
    Node is explicitly NOT that product — it is a small, near-term,
    stationary desk companion. It carries the COSMO® hardware mark early
    because the brand's charter is "hardware," full stop; it does not
    presume or consume the 2028-2029 robotics roadmap.

  docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
    The "Virtuous Compression Cycle" — activity captured, compressed into
    a profile, a sharper question produced, repeat. Answers are already
    stored with weather, humidity, city, timezone context (Section 2).
    COSMO® Node's on-device sensor (Section 09) becomes a first-party
    source for exactly those fields, and its session buffer (Section 08)
    reuses this cycle rather than inventing a second one.

  docs/corporate/LOT_DESIGN_LAB_SUMMER_2026.md
    Phase 4 of the Design Lab commission already prices "functional
    prototype and executive product run (100 units)" as the standard
    first hardware batch size. Section 10 of this document reuses that
    exact quantity rather than picking a new one.

  src/client/components/Logs.tsx, src/client/stores/router.ts
    The "Log tab" is real: route `/log` (router.ts:31), component
    `Logs.tsx`. Entries are created via `useUpdateLog`/log-signal write
    paths already wired to the intention engine and badge triggers.
    COSMO® Node's Copy button (Section 07) writes to this exact surface —
    no new tab, no new UI, is proposed.

  src/client/components/ApiPage.tsx
    The only existing "LOT API" surface today: authenticated GET export
    endpoints (`/api/export/training-data`, `/api/export/emotional-
    checkins`, `/api/export/self-care`, `/api/export/all-logs`) for
    pulling an operator's own data out. It has no inbound (site→device)
    push path and no device-authenticated write path. Section 06 proposes
    the two new endpoints this device needs; it does not touch or break
    the four that exist.

--------------------------------------------------------------------------------
01 // WHAT v1.0 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  v1.0 IS:
    - A stationary desk object — two stainless steel parts, one polished
      flat plate and one instrument face — that receives short text
      notifications pushed by the Memory Engine and displays them on a
      small screen, the way a pager displays a page.
    - A physical extension of the Log tab: one button, held down, that
      writes a Log entry back to lot-systems.com the instant it's pressed.
    - A local environmental sensor that reports real weather/temperature/
      humidity from the operator's actual desk into the same context
      fields the software already asks for city weather.
    - Wirelessly charged, camera-equipped, built for a 100-unit pilot run
      through PCBWay.

  v1.0 IS NOT:
    - A robot. It does not move, walk, or actuate (that is CUBIQ's job,
      and the 2028-2029 COSMO® humanoid track's job — neither is this).
    - A general-purpose computer the operator programs. It is a fixed-
      function appliance: notification in, one signal out.
    - A phone replacement. No apps, no browser, no keyboard. The anti-feed
      thesis that governs CUBIQ (LOT-CUBIQ-VISION.md §01) governs this
      too — a screen that shows one line of text and goes dark is not a
      feed.

  THE PRINCIPLE
    Ship the smallest true loop first: AI decides something worth saying
    → device says it → operator presses one button → the site knows they
    saw it. Everything else (camera use, weather sensing, firmware OTA)
    is built to support that loop, not to compete with it for the v1.0
    milestone.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM — TWO-PART STAINLESS STEEL BODY
--------------------------------------------------------------------------------

  PART 1 — THE BASE PLATE (polished)
    DIMENSIONS     40mm x 40mm x 5mm, flat silver square
    FINISH          Mirror-polished 316L stainless steel (marine grade,
                     tarnish-resistant, the finish CUBIQ's base face uses
                     for its charging pad)
    FUNCTION        (a) the visible "resting" face when the unit sits on
                     a desk button-down between notifications — a plain
                     polished square, no branding, no light
                     (b) the wireless-charging receiving face — this
                     plate sits directly over the Qi coil; polishing is
                     cosmetic only, charging passes straight through
                     316L stainless (non-ferromagnetic, does not block
                     the induction field)
    FIT             Precision-seats into Part 2's underside via a
                     recessed lip + 4-point laser-tack weld, no visible
                     fasteners on the polished face

  PART 2 — THE INSTRUMENT FACE (matte)
    DIMENSIONS     40mm x 40mm footprint, ~9mm additional height —
                     houses the screen, camera, button, PCB stack,
                     battery, and Qi receiver coil (see Section 03);
                     TOTAL ASSEMBLED HEIGHT ~14mm (5mm polished base +
                     ~9mm instrument face)
    FINISH          Bead-blasted matte 316L stainless steel — deliberately
                     the opposite finish from Part 1, so the two parts
                     read as one object with two different jobs, not one
                     uniform shell
    LAYOUT (face-on)
                     ┌──────────────────────┐
                     │   ● camera (top)      │
                     │                       │
                     │   [   screen   ]      │
                     │                       │
                     │      ( button )       │
                     └──────────────────────┘
    CAMERA           Small module, top-center, forward-facing — see
                     Section 05 for its actual job (it is not a
                     always-on webcam; see the privacy note there)
    SCREEN           Center — see Section 04
    BUTTON           Bottom-center, single mechanical tactile switch,
                     labeled COPY (Section 07) — the only control on
                     the device

  MASS TARGET      <95g fully assembled (steel is heavy; kept as light
                     as a 2-part 316L shell of this footprint allows)
  ENVELOPE NOTE     40x40x5mm (Part 1 alone) is the brief's literal
                     spec and is honored exactly for the base plate. The
                     assembled device is taller than 5mm because a
                     camera, screen, button, battery, and charge coil
                     do not fit in a 5mm stack at any current component
                     grade — Section 03 names the actual off-the-shelf
                     parts and their thickness budget so this isn't an
                     unverified promise.

--------------------------------------------------------------------------------
03 // ELECTRONICS — BILL OF MATERIALS (v1.0, off-the-shelf grade)
--------------------------------------------------------------------------------

Every part below is a real, currently-shipping commercial or industrial
component class — no custom silicon, per the brief's "AI-grade off-the-
shelf sensors" instruction (item 15). Exact SKUs are chosen at prototype
order time against PCBWay's assembly stock; the classes and reference
suppliers below are what to source against.

  QTY  PART CLASS                  REFERENCE / SUPPLIER
  ───  ─────────────────────────    ──────────────────────────────────────
  1    MCU + radio (BLE + Wi-Fi)    Espressif ESP32-S3 module class
                                    https://www.espressif.com
  1    Display, low-power           1.3-1.5" round or square mono/gray
                                    e-paper OR transflective memory-LCD
                                    (Sharp Memory LCD class) — "simple
                                    screen," always-legible, near-zero
                                    idle draw between pushes
                                    https://www.waveshare.com
                                    https://www.sharpsde.com
  1    Camera module                Small fixed-focus module (OV2640/
                                    OV5640 class), used for pairing/QR
                                    handshake and optional presence
                                    capture — not a continuous webcam
                                    https://www.digikey.com
  1    Environmental sensor         Bosch BME280/BME680 class — temp,
                                    humidity, barometric pressure (VOC/
                                    air-quality on BME680) — see Sec 09
                                    https://www.bosch-sensortec.com
  1    Wireless charge receiver     Qi-class receiver coil + PMIC
                                    (TI BQ5xxxx class or equivalent)
                                    https://www.ti.com
  1    Battery                      Slim LiPo pouch cell, 300-500mAh,
                                    sized to the Part-2 cavity
                                    https://www.digikey.com
  1    Tactile switch (COPY button) Sealed mechanical tactile switch,
                                    IP-rated gasket under the stainless
                                    button cap
                                    https://www.mouser.com
  1    PCB (fab + SMT assembly)     PCBWay — see Section 10
                                    https://www.pcbway.com
  2    Stainless steel shells       CNC + polish (Part 1) / CNC + bead-
                                    blast (Part 2) — PCBWay also runs a
                                    CNC/sheet-metal service and is the
                                    single vendor for prototype units
                                    https://www.pcbway.com/rapid-prototyping/CNC_Machining.html

  SOURCING PRINCIPLE (item 15 of the brief)
    Every part above is graded for existing AI-adjacent embedded use —
    ESP32-S3 ships with vector instructions for on-device inference,
    Bosch environmental sensors are the same class already assumed
    elsewhere in the LOT stack (weather/humidity context, Section 09),
    and the camera module class is the same one used across the hobbyist/
    industrial IoT market, meaning parts, firmware examples, and second-
    source suppliers all exist today. No part on this list requires a
    custom ASIC or a design partner beyond PCBWay.

--------------------------------------------------------------------------------
04 // THE SCREEN — PAGER-STYLE NOTIFICATIONS
--------------------------------------------------------------------------------

  WHAT IT SHOWS   One short line of text, pushed by the Memory Engine,
                   e.g. "Coffee time!" — the exact example given in the
                   brief. Nothing else renders by default: no clock, no
                   icons, no battery gauge (that lives in the pairing
                   app, not on the device face).
  SOURCE           The Memory Engine already generates short, personal,
                   context-aware prompts (docs/technical/MEMORY-ENGINE-
                   COMPRESSION-ARCHITECTURE.md). v1.0 does not add a new
                   generation path — it adds a delivery path: a subset of
                   already-generated Memory Engine output, filtered to
                   fit a single short line, is queued for push instead of
                   (or in addition to) the in-app card.
  DELIVERY         Site → COSMO® Node push endpoint (Section 06) → BLE/
                   Wi-Fi → firmware renders the line, wakes the screen,
                   holds it until the operator presses COPY or a timeout
                   clears it.
  WHY NOT A FULL DISPLAY  The anti-feed thesis (Section 01) — a device
                   that can only show one line at a time cannot become a
                   feed no matter what firmware runs on it later.

--------------------------------------------------------------------------------
05 // THE CAMERA
--------------------------------------------------------------------------------

  JOB 1 — PAIRING   First-boot QR handshake: the operator shows the
                     device a QR code rendered on lot-systems.com to
                     bind it to their account. This is the camera's
                     primary, everyday-necessary job.
  JOB 2 — OPTIONAL CAPTURE   On a COPY press (Section 07), the operator
                     may opt in (per-account setting, off by default) to
                     attach a single still frame to the Log entry — e.g.,
                     "what I was looking at when I copied this." No
                     video, no streaming, no background capture.
  PRIVACY GATE       The camera is not powered between a pairing/capture
                     event and the next one — no standby capture state
                     exists in v1.0 firmware. This is a hard requirement,
                     not a firmware nice-to-have, matching the same
                     register CUBIQ's edge-detection safety gate uses
                     (LOT-CUBIQ-QUANTUM-CUBE-v0.md §03): a device that
                     can see MUST default to not looking.

--------------------------------------------------------------------------------
06 // LOT API CONNECTOR — WHAT'S NEW, WHAT'S REUSED
--------------------------------------------------------------------------------

Today's ApiPage.tsx (src/client/components/ApiPage.tsx) exposes four
authenticated GET export endpoints for an operator to pull their own
data out. COSMO® Node needs the opposite direction plus one write path.
Two new endpoints, additive only — the four existing exports are
untouched:

  POST /api/device/notify
    Site → device. Called by the Memory Engine's existing question/
    insight pipeline when a generated message is short enough (and
    marked push-eligible) to fit the one-line screen. Payload: device
    id, text (<=40 chars), signal class (matches the same signal classes
    CUBIQ's gesture table already uses — badge unlock, memory question
    ready, cohort ping, weather-triggered).

  POST /api/device/log
    Device → site. Fired on a COPY press. Writes one entry to the
    existing Log tab (Logs.tsx / `/log`) — same table, same UI, no new
    surface. Per the house COCKPIT-RULE already governing Log entries
    (docs/benchmark/LOT-LEXICON.md: "Log body = instrument readings
    only; label names the event; no narration"), the device's log body
    is exactly: timestamp, the notification text that was on-screen when
    COPY was pressed, and the local sensor reading (Section 09) at that
    moment. No device-generated prose.

  AUTH             Device-scoped API key, issued at pairing (Section
                     05, Job 1), revocable from the operator's existing
                     Settings surface. Not a new auth system — reuses
                     the same account-scoped API key pattern ApiPage.tsx
                     already implies for its export endpoints.

--------------------------------------------------------------------------------
07 // THE COPY BUTTON
--------------------------------------------------------------------------------

  SHORT PRESS      Fires POST /api/device/log immediately with whatever
                     text is currently on screen (or "no active
                     notification" if the screen is blank) — a single
                     unambiguous action, no menus, no modes.
  LONG PRESS (2s)   Re-triggers the pairing camera flow (Section 05, Job
                     1) — the same button both copies and re-pairs, no
                     second control needed on a 40x40mm face.
  WHY "COPY"        The name is literal: the operator is copying what
                     the device is showing them into their own Log, the
                     same verb a clipboard copy uses — matching the
                     brief's own label (item 16) exactly rather than
                     renaming it "send" or "confirm."
  LOOP CLOSED       AI decides → device shows → operator copies → site
                     logs it. This is the same closed-loop shape QI·46's
                     Calibration Loop already uses for CUBIQ (LOT-CUBIQ-
                     QUANTUM-CUBE-v0.md §05) — signal out, telemetry
                     back — with a button standing where CUBIQ's IMU
                     stands.

--------------------------------------------------------------------------------
08 // SESSION COMPRESSION
--------------------------------------------------------------------------------

Between one BLE/Wi-Fi sync and the next, the device buffers: every
notification shown, every COPY press (with timestamp), and a rolling
window of Section 09 sensor readings. On sync, this buffer is sent as
one batch — not streamed continuously — and folded into the exact same
"Virtuous Compression Cycle" the Memory Engine already runs for every
other signal source (docs/technical/MEMORY-ENGINE-COMPRESSION-
ARCHITECTURE.md §2): activity captured → context built → profile
compressed → next question sharper. COSMO® Node does not get its own
compression pipeline; it feeds the one that exists, the same way
journal entries, mood check-ins, and radio listening already do.

--------------------------------------------------------------------------------
09 // WEATHER SENSOR + LOCAL CONTEXT
--------------------------------------------------------------------------------

The Memory Engine already stores weather, humidity, city, and timezone
context with every stored answer (MEMORY-ENGINE-COMPRESSION-
ARCHITECTURE.md §2) — today that weather figure is fetched from a city-
level API, not measured. COSMO® Node's onboard Bosch BME280/BME680-class
sensor (Section 03) becomes a first-party, on-desk replacement for that
one field: real local temperature, humidity, and pressure at the
operator's actual desk, timestamped with every notification and every
COPY press. This is additive precision, not a new data category — it
sharpens a field the compression cycle already consumes.

--------------------------------------------------------------------------------
10 // MANUFACTURING ROADMAP
--------------------------------------------------------------------------------

  PHASE 1 — PROTOTYPE (PCBWay)
    PCB fab + SMT assembly of the Section 03 electronics stack, plus
    CNC-machined Part 1 (polish) and Part 2 (bead-blast) stainless steel
    shells, single vendor, single order.
    https://www.pcbway.com
    GATE: one fully assembled unit, boots, pairs via camera QR, receives
    a pushed notification, COPY press writes a Log entry end-to-end.

  PHASE 2 — BENCH VALIDATION
    Wireless charging through the polished Part 1 plate verified (no
    induction blocking from 316L stainless, per Section 02); BME280/
    BME680 readings cross-checked against a reference weather station;
    battery life measured across a realistic notification cadence.
    GATE: 7 consecutive days of operation on one charge cycle at
    expected notification volume, zero missed pushes, zero dropped
    COPY events.

  PHASE 3 — 100-UNIT PILOT RUN
    Reuses the exact production quantity already priced in the LOT®
    Design Lab commission structure (docs/corporate/
    LOT_DESIGN_LAB_SUMMER_2026.md: "functional prototype and executive
    product run (100 units)") rather than picking a new number. PCBWay
    scales the same PCB + CNC order; no new vendor introduced between
    Phase 1 and Phase 3.
    GATE: 100/100 units pass the Phase 1 boot-pair-notify-copy gate
    before any unit is distributed.

  PHASE 4 — FIELD PILOT
    Units placed with a small operator cohort (Usership tier, per
    existing subscriber classification). Section 08's compression data
    is the acceptance signal — did COSMO® Node change engagement
    patterns the software-only Memory Engine could already see.

--------------------------------------------------------------------------------
11 // DOCUMENTATION SET — SEPARATE DOCUMENTS, ONE PER DELIVERABLE
--------------------------------------------------------------------------------

Per the brief's explicit instruction to keep firmware, software, and
manual documentation separate rather than folded into one file, this
hardware spec is deliverable 1 of 5. The remaining four are scoped here
and written in dedicated follow-up sessions — each gets its own file
under docs/corporate/, never appended to this one:

  1. LOT-COSMO-NODE-v1.md            THIS DOCUMENT — hardware/BOM/roadmap
  2. LOT-COSMO-NODE-FIRMWARE-v1.md   Boot sequence, BLE/Wi-Fi provisioning,
                                     screen render loop, button state
                                     machine (short/long press), camera
                                     capture pipeline, offline queue, OTA
                                     update mechanism. NOT YET WRITTEN.
  3. LOT-COSMO-NODE-SOFTWARE-v1.md   The pairing app / bridge service that
                                     talks to the two endpoints in
                                     Section 06 — device provisioning UI,
                                     API key issuance, push-eligibility
                                     filter for Memory Engine output.
                                     NOT YET WRITTEN.
  4. LOT-COSMO-NODE-MANUAL-v1.pdf    Operator-facing PDF: unboxing, first
                                     pairing (camera QR flow), charging,
                                     what COPY does, privacy note for the
                                     camera (Section 05). NOT YET WRITTEN
                                     — produced once Phase 1 (Section 10)
                                     yields a real unit to photograph.
  5. LOT-COSMO-NODE-ASSEMBLY-v1.md  PCBWay-facing manufacturing handoff:
                                     Gerbers, BOM with exact SKUs (this
                                     document's Section 03 names classes,
                                     not final SKUs), CNC drawings for
                                     the two shells. NOT YET WRITTEN —
                                     depends on Phase 1 SKU selection.

This document intentionally stops short of firmware code, an API
implementation, or a manual, so that each of the four remaining
documents can be authored, reviewed, and versioned independently — a
firmware revision should never require re-reviewing the hardware BOM,
and vice versa.

--------------------------------------------------------------------------------
12 // ROADMAP — v1.0 -> v1.1 -> v2.0
--------------------------------------------------------------------------------

  v1.0 — THIS DOCUMENT
    Stationary desk unit. One-line push notifications, one COPY button,
    camera used only for pairing/optional capture, onboard weather
    sensor, Qi charging through the polished base plate. 100-unit pilot.

  v1.1 — MULTI-LINE / RICH PUSH
    Same hardware, firmware-only revision: screen supports 2-3 lines
    instead of 1, notification queue (show the next one after a COPY or
    timeout) instead of single-slot. No new BOM.

  v2.0 — BATTERY-ONLY / PORTABLE
    Removes the desk-charging-pad assumption implicit in Section 02's
    "resting face" — larger battery, faster charge, designed to leave
    the desk. Requires revisiting the mass and thickness budget in
    Section 02; explicitly out of scope for v1.0's 40x40x5mm base-plate
    target.

--------------------------------------------------------------------------------
13 // BRAND
--------------------------------------------------------------------------------

COSMO® Node                   The object — COSMO® hardware mark
LOT® Memory Engine            The intelligence that decides what it says
LOT®† COSMO® Node             The combined mark, matching the LOT®†CUBIQ®
                               convention already set in LOT-CUBIQ-
                               QUANTUM-CUBE-v0.md §08

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-NODE-v1
================================================================================
