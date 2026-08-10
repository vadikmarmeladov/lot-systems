================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: COSMO-SLATE-v1
TITLE:    COSMO® SLATE — Physical Pager for the LOT Index of Systems
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-10
VERSION:  1.0 — PLAN, BOM, MANUFACTURING, ROADMAP (PRE-HARDWARE, DESIGN LOCK PENDING)
STATUS:   PLANNING — 100-UNIT PILOT RUN SCOPED, NO PARTS ORDERED
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is a plan document, not an invention from nothing. Before writing a line
of spec, the following were read in full because the brief ("build a hardware
computer connected to the LOT site") lands directly on top of existing,
on-record work:

  docs/benchmark/LOT-MANIFEST.md
    Row "COSMO Hardware | brave-lamport-t9z5u8 | 14/14 | BEST | 7 files |
    +2610 | COSMO® Cube — complete hardware computer design v1.0" — the prior
    hardware-computer track under the COSMO® brand. The manifest's 2026-06-27
    note states the branch "no longer exist[s] on the remote... incorporated
    into master." A full-repository search (git log --all, file grep across
    docs/corporate and docs/technical) does not turn up a surviving v1.0
    hardware-computer document under that name — LOT_ROBOTICS_COSMO.md exists
    and is a companion-robot ethics/vision paper, not a component-level
    hardware spec. Working assumption for this document: the prior
    brave-lamport-t9z5u8 artifact is lost or was never actually merged, and
    this document is a fresh v1 in the same COSMO Hardware lineage, not an
    edit of a file that could be located. If that artifact resurfaces in a
    future session, reconcile against it before continuing past v1.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    CUBIQ™ is LOT®'s existing hardware notification object — a 45mm cube
    that hops. It is explicitly scoped as "a notification body, not a
    computer" (Section 00). COSMO SLATE does not reuse the CUBIQ name or
    its cube form factor. Reused where it correctly applies: the anti-feed
    notification philosophy (Section 04 of that document), the Qi-charging
    surface pattern, and the discipline of shipping the smallest true thing
    first (v0 → v1 → v2, gated, nothing thrown away).

  docs/corporate/LOT-CUBIQ-VISION.md
    Section 05, "Physical Products — The Inevitable Step," names the arc
    this device continues: digital cubic → physical cubic → business
    emergence. COSMO SLATE is the second physical object on that arc.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Row "Quantum Cube Hardware | Hardware feedback integration (Month 12+) |
    PLANNED" and the Quantum Certified Factory philosophy (Section II) —
    the object should sense the field it sits in (weather sensor, camera),
    not just broadcast into it.

  docs/corporate/LOT-TERMINAL-VISION.md, LOT-TERMINAL-M2M.md,
  LOT-TERMINAL-SYNC.md
    The existing open-source hardware-intake stack for lot-systems.com.
    LOT-TERMINAL-M2M.md already specifies a standardized JSON intake format
    and a documented (if not yet implemented) endpoint —
    `POST https://api.lot-systems.com/v1/m2m/intake` — and a "Psychotronic
    Weather Station" worked example with exactly the sensor set item 14 of
    the brief calls for (air quality, temperature, humidity, pressure).
    COSMO SLATE's LOT API connector (Section 05) is a hardware
    implementation of this already-documented protocol, not a new one.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    House style reference for a hardware spec document (TERMINAL GRID,
    cost breakdown table, sequenced build order, honest price ranges
    over invented ones). COSMO SLATE follows the same discipline at
    consumer-device scale instead of server scale.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Confirms COSMO® as Kuzya Cosmo Marmeladov's namesake hardware brand,
    father-son origin, and the Benchmark Arbitrage® eligibility gate model
    used elsewhere in the COSMO® product line. COSMO SLATE does not require
    Benchmark eligibility to purchase (it is a notification peripheral, not
    a soul-transfer robot) but inherits the brand and the "verify through
    behavior, not declaration" ethic in its pairing flow (Section 06).

  docs/client/components/Logs.tsx, src/client/utils/logTriggers.ts
    The existing Log tab on lot-systems.com that COSMO SLATE's Copy button
    (item 16) writes into. No new UI is invented — the device posts a
    standard log event; Logs.tsx already renders the user's log stream.

  NOTE ON EXTERNAL SOURCES: brand.lot-systems.com, lot-systems.com/about,
  and institute.lot-systems.com/cqgs.html were named in the brief as further
  reading. This session's network egress is restricted to the GitHub-scoped
  proxy and cannot reach those live domains (confirmed: EGRESS_BLOCKED on all
  three). Everything above was sourced from the CQGS and CUBIQ documents
  already checked into this repository, which are themselves snapshots of
  those same institute/brand sources. A future session with live web access
  should diff this document against the live pages and correct anything
  that drifted.

--------------------------------------------------------------------------------
01 // WHAT COSMO SLATE IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  COSMO® SLATE is a small, flat, two-piece stainless steel object that sits
  on a desk, wirelessly charges, watches the room with one low-power camera
  and one weather sensor, and shows exactly one line of text at a time —
  a message composed by the LOT Memory Engine / QI-46 Calibration Loop and
  pushed down from lot-systems.com. A single button on the front lets the
  operator send one signal back: COPY. Nothing more.

  IT IS:
    - A physical pager. One incoming channel (the screen), one outgoing
      channel (the button). Everything else in this document exists to
      keep that pair honest and cheap to build 100 times.
    - The hardware half of the LOT API connector already documented in
      LOT-TERMINAL-M2M.md — this device is a reference implementation of
      that protocol, built by the same company that wrote the protocol.
    - Built for a 100-unit pilot run: founder unit, family, first-cohort
      Usership/Legacy-tier operators, and spares for field failure.

  IT IS NOT:
    - A general-purpose computer the operator programs. It has a firmware
      update path (Section 07) but no user-facing app store, shell, or
      browser. "Hardware computer" in the brief means the physical compute
      module inside the object (an MCU running firmware, per Section 03),
      not a machine the operator interacts with as a computer.
    - CUBIQ™. It does not hop, jump, or actuate. It does not move at all.
      Where CUBIQ's language is motion, SLATE's language is one still line
      of text plus one still image of your desk. Different senses,
      same anti-feed thesis (Section 04).
    - A camera-first surveillance product. The camera's only job is
      described in Section 03 and its data leaves the device only as a
      derived signal (presence/absence, ambient light, optional
      operator-confirmed capture) — never as a raw always-on video stream
      to a server. This is stated as a hard constraint, not a feature to
      revisit for growth.

  THE PRINCIPLE
    Ship the smallest true pager first. A flat steel object that shows one
    trustworthy line of text and sends one trustworthy button press is a
    complete v1. A device that also tries to be a camera-security product,
    a weather station brand, and a general computer before the single
    message-in/message-out primitive is proven on 100 desks is not a v1 —
    it is a wishlist.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  BODY            Two-piece stainless steel shell, CNC-machined, bonded/
                   screwed at a hidden seam along the long edge (Section 08
                   details fastening vs. adhesive bonding trade-off)

  DIMENSIONS       40mm × 40mm × 5mm (flat square, per brief item 4) —
                   this is the SLATE's steel plate footprint. See the
                   ENGINEERING NOTE below: the display + camera + button
                   face (item 18) cannot fit inside 5mm total height with
                   currently sourceable components. v1 resolves this
                   honestly rather than pretend the geometry works.

  FACE A           Polished mirror-finish stainless steel, no seams,
                   no printing. This is the face that sits toward the
                   operator when idle — a small steel mirror on the desk,
                   consistent with LOT's "anti-feed" restraint (nothing to
                   read until there is something to say).

  FACE B           Camera (Section 03), round display (Section 03), single
                   button (Section 03). This is the working face.

  CHARGE INTERFACE Wireless (Qi-class inductive), base edge — reuses the
                   "the charging pad IS the table" pattern already
                   specified for CUBIQ (LOT-CUBIQ-QUANTUM-CUBE-v0.md,
                   Section 02). One LOT® charging puck design serves both
                   product lines going forward; do not fork a second
                   charger SKU for SLATE.

  MASS TARGET       <60g fully assembled.

  ENGINEERING NOTE — THE 5mm CONSTRAINT (read before ordering parts)
    The brief specifies a 4x4cm × 5mm plate AND a face with a camera,
    a screen, and a button. No currently-sourceable camera module + round
    LCD + battery stack assembles inside 5mm total device height — see
    Section 03 for the actual part thicknesses. Two honest resolutions,
    not mutually exclusive:

      (a) THE PLATE IS THE STEEL, NOT THE WHOLE DEVICE. The 40x40x5mm
          spec describes Face A — the polished plate — as its own
          stainless steel component. Face B (camera/screen/button) is a
          second housing section bonded to the back of that plate,
          bringing total device depth to ~14-16mm at the thickest point
          (display module + PCB + battery), while the plate edge the
          operator sees and touches stays a true 5mm reveal. This is the
          v1 default — it satisfies "a flat silver square 4x4cm x 5mm"
          as a real, literal component (Face A) rather than a rounded-off
          approximation of the whole enclosure.

      (b) THINNER v2 PATH. A flexible/curved micro-OLED and a
          solid-state supercapacitor + wireless-only power (no onboard
          battery) could approach the full 5mm envelope, but both are
          non-standard sourcing for a 100-unit run at this budget. Recorded
          as the named v2 research direction (Section 09), not committed
          to for v1 — same discipline CUBIQ's document used for its own
          "v3 — Levitation (research track, not a build milestone)."

    Shipping (a) with this note attached is more honest than silently
    rounding the brief's number down. Any future session revising this
    document should not delete this note — it is the reason v1's actual
    enclosure drawing will not read as literally 5mm thick end to end.

--------------------------------------------------------------------------------
03 // ELECTRONICS — THE HARDWARE COMPUTER
--------------------------------------------------------------------------------

  COMPUTE MODULE (the "hardware computer" the brief asks for)
    ESP32-S3 (dual-core Xtensa LX7, Wi-Fi + BLE, hardware JPEG support for
    the camera pipeline). Chosen over a Raspberry Pi-class SBC because the
    whole device must run for days on a small battery between wireless
    charges and boot in under two seconds to show a message — an MCU with
    a real-time OS beats a Linux SBC on both counts at this size and power
    budget. This is the same class of "own the compute, no cloud-only
    dependency" reasoning as the RTX rig in LOT-NODE-0-RIG-SPEC.md, scaled
    down four orders of magnitude.

  CAMERA
    OV2640 (2MP) module, fixed-focus, ~1.5mm module thickness. Chosen
    over higher-resolution alternatives because item 6's job (LOT API
    connector context signal — is anyone at the desk, what's the ambient
    light, optional operator-confirmed still capture) does not need more
    than 2MP, and the smaller sensor keeps Face B's stack-up thinner.

  DISPLAY
    1.28" round GC9A01 IPS LCD, 240×240, ~3.2mm module thickness. Round
    display chosen to match the flat-square-with-round-window aesthetic
    already established by CUBIQ's single-LED "ring" indicator language
    (LOT-CUBIQ-QUANTUM-CUBE-v0.md, Section 02) — a circle set into a
    square face, brand-consistent across both hardware lines. Shows ONE
    line of text at a time, large, high-contrast, e.g. "Coffee time!" —
    no icon tray, no scroll, no second app.

  WEATHER SENSOR
    BME280 (temperature, humidity, barometric pressure) — the same three
    metrics already named in LOT-TERMINAL-M2M.md's "Psychotronic Weather
    Station" worked example (item 14, item 15 "AI-grade off-the-shelf
    sensors"). BME280 is chosen specifically because it is the sensor the
    Terminal M2M spec already demonstrates a JSON payload for — reusing it
    means SLATE's telemetry needs zero new schema design.

  BUTTON
    Single mechanical tactile switch under Face B, silicone-sealed for
    dust/moisture resistance. One gesture: press = COPY (Section 06). No
    long-press, no double-click, no second function in v1 — the same
    "one actuator, one moving mass" discipline CUBIQ v0 applied to its
    hop mechanism (Section 03 of that document) applies here to the input
    side: one button, one signal, mechanically boring on purpose.

  BATTERY + CHARGING
    250mAh LiPo pouch cell + Qi receiver coil/IC, sized to the Face B
    housing (Section 02). Target: 4-5 day runtime between wireless
    charges at typical 6-10 messages/day usage.

  CONNECTIVITY
    Wi-Fi (2.4GHz, provisioning via BLE at first boot — no keyboard input
    required, consistent with LOT Terminal's "9-year-old can set it up"
    design bar in LOT-TERMINAL-VISION.md).

--------------------------------------------------------------------------------
04 // THE NOTIFICATION LANGUAGE
--------------------------------------------------------------------------------

  SLATE ships one visible gesture: a single line of plain text appears on
  the round display, sourced from the operator's Index of Systems (Memory
  Engine question ready, badge unlocked, QOS mode change, weather/context
  observation, cohort ping). No push-notification badge count, no icon
  grid, no color-coded urgency system.

  EXAMPLE MESSAGES (composed server-side, not on-device)
    "Coffee time!"
    "Memory question ready."
    "You're in recovery mode. No new tasks."
    "Rain in 20 minutes — window's open."
    "Badge unlocked: Odyssey Log."

  THE PRINCIPLE (same anti-feed thesis as CUBIQ, different sense)
    LOT-CUBIQ-VISION.md, Section 01: "LOT® invests attention and returns
    structure." CUBIQ says this through motion felt at the edge of
    awareness. SLATE says it through a single still sentence that changes
    only when there is something worth saying, on a screen that is
    otherwise a blank steel mirror. Both refuse to compete for foreground
    attention the way a phone notification does.

--------------------------------------------------------------------------------
05 // LOT API CONNECTOR
--------------------------------------------------------------------------------

  SLATE implements the existing, documented LOT Terminal M2M protocol
  (docs/corporate/LOT-TERMINAL-M2M.md) rather than inventing a parallel
  one. Two directions:

  INBOUND (lot-systems.com → SLATE) — MESSAGE PUSH
    WebSocket, `wss://sync.lot-systems.com/m2m/intake` (per
    LOT-TERMINAL-SYNC.md's already-documented real-time mode), falling
    back to a 5-minute HTTPS poll if the socket drops — the same hybrid
    mode the Sync Protocol document already specifies for other Terminal
    hardware.
    Payload the server pushes to the device is the "Enhanced Intelligence"
    shape already defined in LOT-TERMINAL-M2M.md Format 2, trimmed to what
    a 240x240 round screen can show: `{ "device_id", "message", "ttl_s" }`.

  OUTBOUND (SLATE → lot-systems.com) — WEATHER + PRESENCE TELEMETRY
    BME280 readings batched every 5 minutes as LOT-TERMINAL-M2M.md's
    Format 3 "Multi-Sensor Array" JSON, posted to the already-documented
    `POST https://api.lot-systems.com/v1/m2m/intake` endpoint. Camera
    contributes a derived `presence: boolean` and `ambient_lux` field to
    the same payload — never a raw frame, per the hard constraint in
    Section 01.

  OUTBOUND (SLATE → lot-systems.com) — THE COPY SIGNAL (item 16)
    Button press posts a minimal log event to the same intake endpoint:
    `{ "device_id", "operator", "event": "copy", "timestamp" }`. The
    server-side handler writes this as a standard log entry into the
    operator's log stream — the same stream src/client/components/Logs.tsx
    already renders under the Log tab on lot-systems.com. No new client UI
    is required; SLATE's button is a physical input device for a channel
    that already exists.

  PAIRING (device → operator account)
    BLE provisioning writes a short-lived pairing code to the device at
    first boot; operator enters that code once on lot-systems.com under
    Settings → Hardware to bind `device_id` to their account — same
    pattern LOT-TERMINAL-SYNC.md already specifies for S-2 operator
    registration (`lot sync init`), reused rather than reinvented for a
    consumer device.

--------------------------------------------------------------------------------
06 // SESSION COMPRESSION
--------------------------------------------------------------------------------

  Item 8 of the brief ("compress the information in each session") is
  handled server-side, not on-device — the ESP32-S3 has no business
  storing a session history. Each time the Memory Engine / QI-46
  Calibration Loop has new context for an operator, it compresses that
  context into exactly one candidate line (<=32 characters, to fit the
  round display's single-line layout) before it is ever sent over the
  M2M channel. The device never receives more than the one line it is
  about to show. This keeps SLATE's firmware trivial (render a string,
  nothing else) and keeps the compression logic where the rest of LOT's
  compression logic already lives — the Memory Arc layer described in
  CQGS-WHITE-PAPER-SNAPSHOT.md, Section III, Layer 4.

--------------------------------------------------------------------------------
07 // DOCUMENT SET (items 7, 9, 10, 11 of the brief)
--------------------------------------------------------------------------------

  This plan is deliberately split into separate documents, per item 11 —
  each has a different audience and a different update cadence:

    docs/corporate/COSMO-SLATE-v1.md            THIS DOCUMENT — plan, form,
                                                  roadmap (S-2 / leadership)
    docs/hardware/cosmo-slate/BOM.md             Bill of materials, per-unit
                                                  and 100-unit run cost,
                                                  sourcing links (buyers)
    docs/hardware/cosmo-slate/MANUFACTURING.md   PCBWay process, stainless
                                                  enclosure CNC run, 100-unit
                                                  production plan (ops)
    docs/hardware/cosmo-slate/FIRMWARE.md        ESP32-S3 firmware
                                                  architecture and update
                                                  path (firmware engineers)
    docs/hardware/cosmo-slate/SOFTWARE.md        Server-side LOT API
                                                  connector, pairing flow,
                                                  Log tab integration (backend
                                                  engineers)
    docs/hardware/cosmo-slate/MANUAL.md          Source for the PDF end-user
                                                  manual (operators) — item 7
    docs/hardware/cosmo-slate/COSMO-SLATE-MANUAL-v1.pdf
                                                  Generated PDF manual —
                                                  item 7, "result in PDF
                                                  manuals"

--------------------------------------------------------------------------------
08 // MANUFACTURING SUMMARY (full detail in MANUFACTURING.md)
--------------------------------------------------------------------------------

  FAB PARTNER      PCBWay — PCB fabrication + assembly (PCBA) for the main
                    board, AND their CNC machining service for the two
                    stainless steel shell halves. Using one vendor for both
                    the board and the metal (item 1 + item 3) simplifies a
                    100-unit pilot to a single shipping consolidation point
                    rather than two.

  RUN SIZE         100 units (item 13) — small enough to hand-inspect every
                    unit before it ships to an operator, large enough to
                    hit PCBWay's small-batch PCBA pricing tier and the CNC
                    shop's minimum-order economics for the steel shells.

  BODY             Two-piece construction (item 3): Face A (polished plate)
                    and Face B (working face) CNC-machined separately from
                    304 stainless steel bar stock, then joined. See
                    MANUFACTURING.md Section 03 for the fastened-vs-bonded
                    seam decision and its effect on IP54 dust/moisture
                    resistance.

--------------------------------------------------------------------------------
09 // ROADMAP — v1 → v1.1 → v2
--------------------------------------------------------------------------------

  v1 — THE PAGER (THIS DOCUMENT)
    One-line message display, one-button COPY signal, weather + presence
    telemetry, Qi charging, BLE pairing. 100-unit pilot run.
    GATE: 100/100 units pass incoming inspection (display, camera, button,
    charge, Wi-Fi join) before any unit ships to an operator. Zero units
    shipped with a known Face A/B seam gap that fails a basic water-splash
    test (item 15's "AI-grade off-the-shelf sensors" implies outdoor/desk
    dual use — the seam has to survive a spilled coffee, not just dust).

  v1.1 — FIELD DATA PASS
    No new hardware. Firmware-only revision after the 100-unit pilot
    reports back: message legibility at typical desk viewing distance,
    battery life against the 4-5 day target, false-positive rate on the
    presence signal. This is a data-collection gate, not a feature
    milestone — same discipline as CUBIQ v0's "500/500 hop-and-recover
    cycles" gate before declaring a version closed.

  v2 — THINNER FACE B (RESEARCH TRACK, NOT A BUILD MILESTONE)
    Opens the flexible-display / solid-state-power research question
    named in Section 02's engineering note. No gate criteria yet. Not
    scheduled. Recorded so v1's board layout and enclosure tolerances are
    chosen with a thinner future in mind rather than foreclosing it —
    the same posture CUBIQ v0 took toward levitation in its own Section 06.

--------------------------------------------------------------------------------
10 // CONSUMER USE CASE
--------------------------------------------------------------------------------

  USE CASE 01 — THE DESK GLANCE                              2026-08-10
  ─────────────────────────────────────────────────────────────────────
  Operator profile: Usership tier, works from a home desk, SLATE sits on
  its charging puck at the edge of the keyboard, polished Face A toward
  the room when idle.

  The QI-46 Calibration Loop has a compressed line ready: "Coffee time!"
  — derived from a circadian pattern already tracked in QOS (README.md,
  "Quantum Operating System"). The display wakes, shows the line, and
  holds it. The operator glances over — not summoned, not buzzed — reads
  five words, and either gets up or doesn't. If they act on it, one press
  of the button sends COPY back through the LOT API connector; the event
  lands in their Log tab on lot-systems.com exactly the way a manually
  typed log entry would, except it took one press instead of opening a
  laptop. The weather sensor keeps a quiet background thread going: five
  minutes later, a second line — "Rain in 20 minutes — window's open" —
  replaces the first. No screen lit up on their phone. No app opened.
  The steel plate on the desk was simply, briefly, worth a glance.

--------------------------------------------------------------------------------
11 // BRAND
--------------------------------------------------------------------------------

  COSMO® SLATE                  The object — hardware computer, physical
                                  pager, LOT API connector reference device
  LOT® Index of Systems          The signal source
  COSMO®† LOT®                  The combined mark (hardware brand first,
                                  signal source second — SLATE is a COSMO®
                                  product that speaks LOT®'s language, the
                                  inverse pairing from CUBIQ's LOT®†CUBIQ®)

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END COSMO-SLATE-v1
================================================================================
