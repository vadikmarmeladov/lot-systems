================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-v1
TITLE:    COSMO® Cube — Complete Hardware Computer Design v1.0
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-08
VERSION:  1.0 — PLAN, BOM, ROADMAP LOCK
STATUS:   v1.0 — DESIGN COMPLETE (PRE-PRODUCTION, PCB FAB NOT YET ORDERED)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is the document docs/benchmark/LOT-MANIFEST.md has been pointing to since
2026-06-12: "COSMO Hardware | brave-lamport-t9z5u8 | ... | COSMO® Cube —
complete hardware computer design v1.0." That line has carried a title and no
content for eight weeks. This document is the content. Before writing a line
of spec, the following were read in full:

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The sibling document. Its own reading log (Section 00) already drew the
    line this document confirms: CUBIQ™ is a 45mm actuated notification cube
    that jumps. COSMO® Cube is "a general-purpose hardware computer" — a
    different object, related by lineage (LOT®/COSMO®), sharing no naming
    collision. This document is that general-purpose computer, specified.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Section I confirms "Quantum Cube: Bioelectric hardware, haptic feedback,
    nano-ceramic, piezoelectric" belongs to the CUBIQ product line, not this
    one. Section on Usership Tiers ($99/mo standard, $399/mo priority with
    Quantum Cube sync) is the subscription surface this device also rides.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Establishes the COSMO® brand: named for Kuzya Cosmo Marmeladov, governed
    by the Benchmark Arbitrage® gate, carrying a verified LOT profile rather
    than shipping as an anonymous appliance. This document's "LOT API
    connector" (Section 05) is the same profile-verification channel.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    House style for a hardware-plus-stack specification (TERMINAL GRID,
    numbered sections, cost tables with entry/serious tiers, build-order
    sequence). This document follows the same register for a much smaller,
    much cheaper object.

  docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
    The "Virtuous Compression Cycle" (Section 2) — activity captured, then
    compressed into a sharper profile — is the software-side pattern this
    device's on-device session compression (Section 06) mirrors in firmware.

  src/server/models/log.ts, src/server/routes/api.ts (GET/POST /api/logs),
  docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md
    The actual Log table (event, text, metadata, context, userId, createdAt)
    and the SSE stream at /api/... (text/event-stream, api.ts line 329) are
    the real, already-shipped endpoints this hardware talks to. Nothing in
    Section 05 or Section 07 invents a new backend — it wires the device to
    what already runs in production.

No prior document specified an enclosure, a bill of materials, a firmware/
software split, or a production run for this object. This document is that
specification, v1.0.

--------------------------------------------------------------------------------
01 // WHAT v1.0 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  v1.0 IS:
    - A locked physical, electronic, and firmware architecture for a single
      desk object: a flat, two-piece stainless steel computer that receives
      pager-style notifications from lot-systems.com and shows them on a
      small screen, with a camera and a single physical button as its only
      inputs.
    - A pilot production run of 100 units, manufactured through PCBWay,
      sized to prove the design under real assembly and real shipping
      before any larger commitment.
    - The full document set a contract manufacturer needs to quote and
      build: this plan, a bill of materials with suppliers, a firmware
      spec, a software/API integration spec, and a PDF user manual.

  v1.0 IS NOT:
    - A general-purpose phone, tablet, or laptop replacement. It has one
      screen, one camera, one button. It does the smallest true thing a
      "LOT Computer" can do: receive a notification, show it, and let the
      operator send exactly one signal back.
    - A cube. This is the naming clarification the reading log opens with:
      "COSMO® Cube" is a brand name inherited from the manifest ledger, not
      a shape claim. The v1.0 physical form (Section 02) is a flat square,
      not a cube.
    - CUBIQ hardware. CUBIQ (docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md)
      moves. This device does not move. CUBIQ's notification language is
      motion; this device's notification language is a lit screen and,
      optionally, the haptic buzz of a pager-class vibration motor.

  THE PRINCIPLE
    Ship the smallest true computer first. A flat object that receives one
    real signal class from a real backend, shows it legibly, and reports
    exactly one signal back through a real button, manufactured 100 units
    deep, is a complete v1.0. A device with app stores, multi-app UI, and a
    thousand-unit run before the single notification loop is proven is not
    a v1.0 — it is a fundraising deck.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  DIMENSIONS        40mm x 40mm x 5mm (flat square, v1.0 reference size)
  ENCLOSURE          Two-piece stainless steel body, cold-formed and CNC-
                      finished, joined by 4 recessed M1.4 screws through the
                      rear shell into threaded standoffs on the front shell.
                      No adhesive-only seams — the unit must be openable for
                      battery service.
  FRONT FACE         Polished (mirror-finish) 316 stainless steel, brushed
                      bezel around the display cutout. This is the face the
                      operator sees at rest on a desk — reflective, cold to
                      the touch, deliberately not a "device" surface.
  REAR FACE          Matte bead-blasted 316 stainless steel. Camera aperture
                      (top), display window (center), single button
                      (bottom edge, tactile, index-finger reach).
  MASS TARGET        <35g fully assembled. At 40x40x5mm the internal volume
                      is ~8cm3 — the mass budget is set by the battery and
                      stainless shell, not by the electronics.
  CHARGE INTERFACE    Wireless (Qi-class inductive) through the rear face,
                      same charging-pad architecture named in
                      docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02
                      — the LOT charging pad is a shared accessory across
                      both hardware lines, not a per-device reinvention.
  INDICATOR           No dedicated status LED. The screen itself (Section
                      03) is the only light source, kept off between
                      notifications to preserve the anti-feed thesis:
                      an object that lights up only when it has something
                      to say, not an ambient screen.

  ENGINEERING NOTE — THE 5mm CONSTRAINT
    5mm is an aggressive stack height. It is achievable only because the
    display, camera, and battery in Section 03/04 are chosen specifically
    for their z-height, not their spec-sheet performance. This is flagged
    here rather than hidden: v1.0's BOM (LOT-COSMO-COMPUTER-BOM.md) marks
    every part where 5mm forced a tradeoff against a thicker, cheaper, or
    higher-spec alternative. If the pilot run's battery-life or thermal
    data says 5mm does not hold up in the field, v1.1 is a 7-8mm shell
    with the same footprint before any other change is considered.

--------------------------------------------------------------------------------
03 // ELECTRONICS — WHAT'S INSIDE
--------------------------------------------------------------------------------

  MCU / RADIO         ESP32-S3 (dual-core, Wi-Fi + BLE), QFN package,
                      chosen for onboard Wi-Fi (talks to lot-systems.com
                      directly, no phone relay required) and enough RAM to
                      hold a JPEG frame buffer for the camera.
  DISPLAY            Round or square 1.28"-class LCD/OLED module (GC9A01
                      or ST7789-class driver), monochrome-or-limited-
                      palette to keep draw current low — this screen shows
                      short strings ("Coffee time!"), not photographs.
  CAMERA             OV2640-class module, fixed-focus, 2MP — sized for
                      the LOT API's "AI grade off-the-shelf sensor"
                      requirement (Section 04): good enough for a vision
                      model on the server side to classify a scene, not
                      good enough (or intended) for photography.
  WEATHER SENSOR      BME280-class combined temperature / humidity /
                      pressure sensor. Feeds the same `context` JSONB
                      field the software stack already writes on every
                      log row (temperature, humidity, weatherDescription
                      — see src/server/utils/weather.ts) so a hardware
                      unit's readings and the software's existing weather
                      lookups land in one consistent schema.
  BUTTON              Single tactile switch, rear face, labeled COPY.
                      Section 05 defines its one job.
  HAPTIC (OPTIONAL)   Small pager-class ERM vibration motor — the physical
                      half of "pager-like notification" (Section 05). Cut
                      from cost in the 100-unit pilot if z-height or BOM
                      cost forces a choice; screen-only notification is an
                      acceptable v1.0 fallback, logged as a deferred line
                      item, not silently dropped.
  BATTERY             150mAh LiPo, sized to the 40x40x5mm cavity after the
                      display/camera/PCB stack. Charges only via the
                      wireless coil (Section 02) — no exposed charging
                      port, consistent with a two-piece sealed-except-for-
                      screws enclosure.
  PCB                 2-layer, ENIG finish, manufactured by PCBWay
                      (Section 07 — the named fabricator, per brief item 1).
                      2-layer is the correct choice at this component
                      count and this unit volume; 4-layer is a v2
                      consideration only if EMI from the Wi-Fi radio proves
                      out to be a field problem.

--------------------------------------------------------------------------------
04 // SENSOR PHILOSOPHY — "AI-GRADE OFF-THE-SHELF"
--------------------------------------------------------------------------------

Every sensor in Section 03 is a commodity part with an existing distributor
listing (LOT-COSMO-COMPUTER-BOM.md), not a custom or research-grade
component. This is a deliberate constraint, not a cost shortcut:

  - A 100-unit pilot run cannot absorb the lead time or MOQ of a custom
    sensor. Off-the-shelf parts ship from stock.
  - "AI-grade" here means: the sensor's raw output is already good enough
    for a downstream model (the OV2640 frame for a vision classifier, the
    BME280 reading for the same weather-context pipeline the software
    already runs) without requiring analog front-end tuning on the LOT
    Computer's tiny 2-layer board. The intelligence lives in the AI-powered
    site (docs/corporate/LOT-AMBIENT-AI-VISION.md), not in the sensor.
  - This mirrors the CQGS doctrine (docs/corporate/CQGS-WHITE-PAPER-
    SNAPSHOT.md): the device senses honestly and cheaply; the coherence is
    computed centrally, not locally.

--------------------------------------------------------------------------------
05 // THE LOT API CONNECTOR
--------------------------------------------------------------------------------

The device carries no local intelligence beyond buffering and compression
(Section 06). Every meaningful decision — what notification to send, what
to do with a camera frame, what the weather reading means — happens on
lot-systems.com. Two channels, both already live in production:

  INBOUND  (pager-style notification, brief item 2)
    The device holds a persistent connection to the existing SSE stream
    (src/server/routes/api.ts, `Content-Type: text/event-stream`, line
    329). A qualifying server-side event (Memory Engine question ready,
    badge unlock, weather threshold, cohort ping — the same signal classes
    named in LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04) is pushed to the
    device as a short string. The device wakes its display, renders the
    string ("Coffee time!"), holds it for a configurable dwell time, then
    sleeps the screen. No polling — SSE push keeps standby current low.

  OUTBOUND  (Section 06/07 detail the payload; this section names the
             endpoint)
    The device authenticates as a paired hardware unit against the same
    profile-verification channel LOT_ROBOTICS_COSMO.md defines for
    COSMO® ("a robot without a verified LOT profile does not activate" —
    the same clause applies here: a LOT Computer without a paired,
    verified operator profile does not transmit). Once paired, camera,
    weather, and button events are written through the existing Log model
    (src/server/models/log.ts) — `event`, `text`, `metadata`, `context`,
    `userId` — the same table every software widget already writes to.

The LOT API connector is not a new backend. It is a hardware client for
the backend that already exists.

--------------------------------------------------------------------------------
06 // ON-DEVICE SESSION COMPRESSION
--------------------------------------------------------------------------------

Brief item 8 — "compress the information in each session" — is implemented
as the firmware-side mirror of the software Memory Engine's "Virtuous
Compression Cycle" (docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
Section 2):

    DEVICE SESSION = wake (button press or scheduled sensor read)
                     → sleep (screen timeout or explicit sleep)

    Within a session, the firmware does NOT stream every sensor tick to
    the server. It accumulates:
        - weather sensor: min/max/mean over the session, not every sample
        - camera: at most one frame per session, captured on COPY press
          or on a server-requested capture signal, never continuously
        - button: single event, timestamp, session duration

    At session close, the firmware serializes ONE compact JSON payload —
    the compressed session — and POSTs it once. This is the same shape
    the Log table already expects (`metadata` + `context` JSONB), so no
    server-side schema change is required to receive it.

This keeps the ESP32-S3's Wi-Fi radio — the single largest power draw on
a 150mAh battery — active for seconds per session rather than continuously,
which is the actual reason a 40x40x5mm, 150mAh device can hold multi-day
battery life at all.

--------------------------------------------------------------------------------
07 // THE COPY BUTTON — SIGNAL TO THE LOG TAB
--------------------------------------------------------------------------------

Brief item 16, specified exactly: the single rear-face button is labeled
COPY. One press does one thing:

    COPY PRESSED
      → firmware closes the current session (Section 06)
      → POST /api/logs  { event: 'hardware_copy',
                           text: '<active notification string, if any>',
                           metadata: { device: 'lot-computer-v1',
                                       sessionId, batteryPct },
                           context: { temperature, humidity,
                                      weatherDescription } }
      → server writes the row through the existing Log model — identical
        code path to every other widget-originated log entry
      → the row appears in the operator's Log tab on lot-systems.com
        (src/client/components/Logs.tsx) within one sync cycle, tagged
        with the hardware device as its source

`hardware_copy` is a new entry in the `displayableEvents` allowlist
(src/server/routes/api.ts, the `/logs` GET handler) — the one server-side
change this hardware requires, and it is additive: one string appended to
an existing array, not a new endpoint.

The verb is deliberate. COPY does not mean "duplicate the notification" —
it means what a two-way radio operator means by "copy": *received,
acknowledged.* The operator is closing the loop the notification opened.
This is the physical action LOT-CUBIQ-QUANTUM-CUBE-v0.md's telemetry loop
(Section 05) already names as the missing half — CUBIQ senses and moves;
this device receives and acknowledges.

--------------------------------------------------------------------------------
08 // FIRMWARE AND SOFTWARE — WHY THEY ARE SEPARATE DOCUMENTS
--------------------------------------------------------------------------------

Per brief items 9, 10, and 11, firmware and software are specified in two
standalone files rather than as sections of this plan:

    docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md
      What runs on the ESP32-S3 itself: boot sequence, sleep states,
      sensor drivers, the compression buffer (Section 06), OTA update
      path, and the exact wire format sent to the LOT API connector.

    docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md
      What runs on lot-systems.com to receive it: the SSE push path
      (Section 05 inbound), the `/api/logs` write path (Section 07), the
      pairing/profile-verification flow, and the admin-side view of a
      fleet of 100 paired units.

The split exists because the two documents have different audiences and
different revision cadence: firmware changes when the PCB or MCU changes;
software changes when the LOT platform changes. Coupling them into one
file would force every ESP32 register tweak through the same document as
every backend route change. LOT-COSMO-COMPUTER-BOM.md is a third
standalone document for the same reason — a components buying list is a
procurement artifact, revised on supplier/price changes, not on design
changes.

--------------------------------------------------------------------------------
09 // PRODUCTION — THE 100-UNIT PILOT RUN
--------------------------------------------------------------------------------

  FABRICATION       PCBWay (brief item 1) — PCB fabrication + SMT
                      assembly, 2-layer ENIG, quoted at 100-unit MOQ.
                      PCBWay was chosen over JLCPCB/Seeed for this pilot
                      specifically because its assembly service quotes
                      small stainless-steel-enclosure mechanical add-ons
                      (heat-stake standoffs, laser-marked serials) in the
                      same order, reducing the number of vendors in the
                      production chain from three to one for v1.0.
  ENCLOSURE          CNC + cold-forming shop, quoted separately (BOM doc)
                      — stainless steel is outside PCBWay's core service.
  RUN SIZE           100 units. Sized to: (a) prove SMT yield on a 5mm-
                      constrained 2-layer board, (b) produce enough units
                      for an internal Usership priority-tier pilot
                      cohort without committing to injection-tooled
                      enclosures, and (c) stay inside a bill of materials
                      the company can absorb without external funding —
                      see LOT-COSMO-COMPUTER-BOM.md for the full per-unit
                      and 100-unit cost breakdown.
  SERIALIZATION      Each unit laser-marked with a unique device ID on
                      the rear shell, matched to its pairing record in
                      the LOT API connector (Section 05) — no two units
                      share a profile-verification identity.
  DOCUMENTATION      Every unit ships with the PDF user manual (Section
                      10) — physical or emailed copy, operator's choice
                      at fulfillment.

--------------------------------------------------------------------------------
10 // PDF MANUALS
--------------------------------------------------------------------------------

Brief item 7. Two manuals, not one, mirroring the firmware/software split
in Section 08:

    LOT-COSMO-COMPUTER-USER-MANUAL-v1.pdf   (operator-facing)
      Unboxing, pairing (Section 05), what the COPY button does (Section
      07), charging, and a one-page troubleshooting table. Written at the
      reading level LOT-TERMINAL-VISION.md sets for its S-2 recruits — a
      9-year-old should be able to pair and use the device from this
      manual alone.

    LOT-COSMO-COMPUTER-ASSEMBLY-MANUAL-v1.pdf   (production-facing)
      SMT placement notes, enclosure torque spec for the 4 M1.4 screws,
      wireless-coil alignment tolerance, and the 100-unit QC checklist
      (battery voltage, SSE handshake, camera capture, button continuity)
      every unit must pass before serialization.

Both are generated from this document set and filed under docs/corporate/.

--------------------------------------------------------------------------------
11 // ROADMAP — v1.0 -> v1.1 -> v2.0
--------------------------------------------------------------------------------

  v1.0 — THIS DOCUMENT (PILOT)
    Flat two-piece stainless enclosure, screen + camera + weather sensor +
    COPY button, wireless charge, SSE-driven pager notification, 100-unit
    PCBWay run.
    GATE: 100/100 units pass the QC checklist (Section 10), 30-day field
    battery life >=3 days average session pattern, zero enclosure-seam
    failures, zero missed-pairing units.

  v1.1 — THE THICKER SHELL (CONTINGENT)
    Only triggered if the Section 02 engineering note's 5mm constraint
    fails field validation. Same footprint, 7-8mm height, larger battery,
    optional haptic motor (Section 03) promoted from deferred to standard.
    GATE: not scheduled unless v1.0 field data calls for it.

  v1.2 — HAPTIC STANDARD + 4-LAYER PCB
    If v1.0 deferred the haptic motor for BOM cost or z-height reasons,
    this is where it ships standard. 4-layer PCB evaluated if Wi-Fi EMI
    data from the 100-unit field run shows measurable interference with
    the camera or display driver lines.

  v2.0 — FLEET (RESEARCH TRACK, NOT A BUILD MILESTONE)
    Named here so v1.0-v1.2 choices (enclosure joining method, PCB
    connector footprint, pairing protocol) are made with a multi-unit
    household/office deployment in mind — one operator profile, several
    paired LOT Computers in different rooms — without foreclosing it.
    No claim is made here about a working fleet-pairing protocol. v2.0 has
    no gate criteria yet.

--------------------------------------------------------------------------------
12 // BRAND
--------------------------------------------------------------------------------

COSMO® Cube                   The brand name (inherited from the manifest
                               ledger — a name, not a shape claim; see
                               Section 01)
LOT® Computer                 The functional name used on packaging and in
                               the user manual — what the object is
COSMO®† LOT®                  The combined mark, mirroring LOT-CUBIQ-
                               QUANTUM-CUBE-v0.md Section 08's LOT®†CUBIQ®
                               convention

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-v1
================================================================================
