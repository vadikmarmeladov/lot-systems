================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-HARDWARE-v1
TITLE:    COSMO® Cube — LOT Computer, Hardware Computer Design v1.0
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-30
VERSION:  1.0 — DESIGN LOCK, PRE-MANUFACTURE
STATUS:   PLANNING COMPLETE — BOM SOURCED — MANUFACTURING ROADMAP OPEN
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

Nothing here is a new invention — it is the resumption of a lineage this repo
already opened and lost. Before writing a line of spec, the following record
was read in full:

  docs/benchmark/LOT-MANIFEST.md (line 31, line 65, line 89)
    "COSMO Hardware | brave-lamport-t9z5u8 | 14/14 | BEST | 7 | +2610 |
    COSMO® Cube — complete hardware computer design v1.0." The manifest
    records this as a BEST-designated, 14-iteration feature branch,
    superseding an earlier dazzling-shannon series (9 iterations). A note
    at line 190 states these branches "no longer exist on the remote —
    they were incorporated into master in prior sessions" as of
    2026-06-27. A full-repository search for the actual design content
    (stainless steel, PCBWay, camera, weather sensor, wireless charging —
    the exact vocabulary of this task's brief) turns up nothing beyond
    the manifest line item and one session report
    (docs/benchmark/LOT-SR-20260612-06.md, line 65) that names the
    branch but carries no design detail. The +2610 lines did not survive
    into a standalone document. This document is the rebuild — same
    product, same name, same brand slot, first document to actually
    carry the spec.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md (line 49-56)
    Names the sibling relationship explicitly: "a sibling, textually
    distinct hardware track — 'COSMO® Cube — complete hardware computer
    design v1.0' ... under Kuzya's COSMO® brand. That is a
    general-purpose hardware computer. CUBIQ™ is not that object. CUBIQ™
    is LOT®'s object: a notification body, not a computer. The two are
    related by lineage (father/son, LOT®/COSMO®) and should share no
    naming collision going forward." This document is the object that
    line was written about. It commits to keeping the boundary CUBIQ-v0
    already drew: CUBIQ™ hops and nudges; COSMO® Cube computes, watches
    the weather, and remembers the session.

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Establishes the COSMO® brand: named for Kuzya Cosmo Marmeladov,
    "the extension of that instinct into hardware." COSMO® Cube is the
    first, smallest object in that division — not a robot, not a soul
    carrier, not gated by the Benchmark. It is the computer the soul
    carrier will eventually run on top of. Phase 3 of that document's
    revenue table ("COSMO® Hardware," 2028-2029, $2,500-$5,000/unit)
    assumes exactly this kind of object exists first.

  docs/corporate/LOT-CUBIQ-OPERATOR.md
    Section 07, Phase 4, "Physical Extension" — names the arc every LOT®
    hardware document since has executed against. COSMO® Cube is a
    second, distinct branch of that same arc: not a notification body,
    a small ambient computer that sits on a desk, watches the room, and
    reports back into the operator's Log.

  src/client/queries.ts (line 134-147) and src/server/utils/ledger.ts
    The existing `/api/logs` surface — `useLogs`, `useCreateLog`,
    `useUpdateLog` — is the live endpoint this device's "Copy" button
    (Section 05) and session-compression payloads (Section 07) write
    into. No new Log-tab schema is invented; the device is a second
    client of the schema that already exists.

  README.md (Public Profile System, line 289-419)
    The live weather block on a user's public profile — sky, humidity,
    temperature, sunrise/sunset — is the exact data class the device's
    onboard weather sensor (Section 04) is built to source locally and
    reconcile against, not duplicate.

--------------------------------------------------------------------------------
01 // WHAT COSMO® CUBE v1.0 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  COSMO® CUBE v1.0 IS:
    - A small, physical, ambient LOT® terminal: a flat stainless-steel
      object that sits on a desk, receives short AI-composed notices
      from lot-systems.com ("Coffee time!"), reads the room (weather,
      light, presence via camera), and writes one signal — "Copy" —
      straight back into the operator's Log tab.
    - A COMPUTER, not a notification actuator. It has a general-purpose
      MCU, a camera, a screen, local storage, and an API connector. This
      is the distinction CUBIQ-v0 drew and this document preserves.
    - A 100-unit pilot run: real PCB, real stainless-steel enclosure,
      real firmware, real BOM cost — scoped to be built, not simulated.

  COSMO® CUBE v1.0 IS NOT:
    - CUBIQ™. It does not hop, jump, or move. It has no actuator. Motion
      is CUBIQ™'s language; this device's language is a still screen and
      one button.
    - A COSMO® robot under LOT_ROBOTICS_COSMO.md. It carries no
      Benchmark-gated behavioral soul transfer. Any LOT® operator can
      own one; no Purple-tier score is required. It is the computer a
      future soul-transfer robot could one day run on — not that robot.
    - A phone-notification replacement in the aggressive sense. Per the
      brand's anti-feed thesis (already stated for CUBIQ, and equally
      true here): one short line, at most, per notice. No feed, no
      unread badge count, no infinite scroll on a 40mm screen.

  THE PRINCIPLE
    Ship the smallest true computer first. A flat steel object that
    boots, shows one AI-composed line when the site sends one, watches
    local weather, and copies a moment back to the Log with one press —
    that is a complete v1.0. Anything requiring a second device
    revision (a bigger screen, on-device inference, a companion app
    store) is v2 and is named as such in Section 08, not folded in here.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  FORM FACTOR       Flat square slate, NOT a geometric cube. The COSMO®
                     brand name is retained for lineage continuity
                     (Section 00) — the object is a "Cube" in product
                     family, not in silhouette. Future LOT-MANIFEST
                     entries should read this note before flagging the
                     name/shape mismatch as an error; it is intentional.

  DIMENSIONS         40mm x 40mm x 5mm — a flat silver square, pocket-
                     thin, sits flush on a desk or a charging dock.

  BODY               Two-part stainless-steel shell (brushed 316L or
                     mirror-polished 304, TBD at prototype review —
                     Section 06 BOM lists both grades):
                       PART A (rear/base) — one continuous mirror-
                         polished stainless-steel face. No seams, no
                         visible fasteners, no electronics penetrate
                         this face. This is the side that rests against
                         the desk or the charging pad.
                       PART B (front/active) — a second stainless-steel
                         shell, machined with three cutouts: the camera
                         aperture, the screen window, and the button
                         bore. The two halves are joined by an internal
                         lip-and-screw assembly (four M1.6 screws,
                         captured, non-visible from either face) with a
                         compressed silicone gasket for dust/splash
                         resistance (IP54 target).

  FRONT FACE (Part B) LAYOUT
                       - Camera module, top-left, 3mm aperture,
                         sapphire-glass cover lens flush with the shell
                       - Display window, center, round or square
                         (Section 04 BOM), edge-to-edge glass, flush
                         with the polished chamfer
                       - Button, bottom-center, a single recessed
                         stainless disc, labeled "Copy" by laser-etch,
                         not print — the etch will not wear off

  REAR FACE (Part A)  Continuous polished stainless steel. This is the
                       branding face — a small laser-etched LOT® wordmark
                       and serial number, nothing else. This is also the
                       charging face (Section 04, Wireless Charging).

  MASS TARGET         <45g fully assembled (steel shell dominates the
                       budget; electronics stack is <8g)

  COLOR               "Silver" — natural stainless finish, no paint, no
                       anodizing. This is a deliberate material choice,
                       not a placeholder: it ages by patina, not by
                       peeling.

--------------------------------------------------------------------------------
03 // THE NOTIFICATION LANGUAGE — "PAGER, NOT PHONE"
--------------------------------------------------------------------------------

The operating metaphor is a 1990s pager, not a smartphone. One line of
text, composed server-side by the same AI engine abstraction that already
runs the Memory Engine (README.md, "AI Vendor Independence," line 143-158),
pushed to the device, displayed until the next notice arrives or the
operator clears it with the button.

  EXAMPLES (server-composed, device-rendered verbatim)
    "Coffee time!"
    "Badge unlocked — check your Log"
    "Weather turning — bring a layer"
    "Memory question ready"
    "3 days quiet. Still here."

  TRANSPORT
    Device holds a persistent HTTPS long-poll / short-interval fetch
    against a new endpoint (Section 05, `GET /api/hardware/notify`),
    falling back to a 60s poll if the long-poll drops. No third-party
    push service, no APNs/FCM dependency — the device talks directly to
    lot-systems.com, consistent with the platform's existing
    vendor-independence posture (README.md line 143).

  DISPLAY RULE
    One line, max ~24 characters at the reference font size. The AI
    engine is responsible for fitting the message to the device, the
    same discipline LOT Terminal already names for hardware output
    (docs/corporate/LOT-TERMINAL-VISION.md, line 26-29: "Complexity to
    Simplicity" — the weather-station example applies verbatim to this
    screen).

  CLEAR / ACKNOWLEDGE
    Pressing "Copy" (Section 05) both copies the current notice into the
    Log tab AND clears the screen — a single gesture serves both
    purposes, keeping the physical interaction vocabulary to one button.

--------------------------------------------------------------------------------
04 // ONBOARD SENSORS AND ELECTRONICS
--------------------------------------------------------------------------------

  CAMERA
    Low-power module, presence/context sensing — NOT continuous video
    capture, NOT stored or streamed by default. Two supported modes:
      - PRESENCE: periodic low-res frame diff to detect "someone is at
        the desk" (feeds the QOS "Cognitive Load" / "System Pressure"
        signal set, README.md line 124-129), never leaves the device as
        an image.
      - SNAPSHOT: operator-triggered only (long-press "Copy," 2s) —
        captures one still, uploads it attached to the Log entry the
        same press creates. Default OFF; opt-in per device in Settings.
    Privacy posture inherits the platform's existing default (README.md
    line 101-108: "Your Story, Your Data") — raw frames never leave the
    device unless the operator explicitly triggers a snapshot.

  DISPLAY
    Low-power reflective or transflective panel (Section 06 BOM) —
    always-on capable without meaningfully depleting the battery,
    matching the "presence without spectacle" register CUBIQ-v0 set for
    its own indicator LED (LOT-CUBIQ-QUANTUM-CUBE-v0.md, line 122-127).

  WEATHER SENSOR
    Onboard temperature / humidity / pressure sensor. Purpose is NOT to
    replace the API-sourced weather already shown on public profiles
    (README.md line 309-313) — it is to give the AI a hyperlocal reading
    (the operator's actual desk, not their city) to reconcile against
    the API forecast, and to source the "System Report" weather block
    even if the device is briefly offline.

  MCU / CONNECTIVITY
    Single Wi-Fi capable microcontroller with an integrated camera
    interface (Section 06 names the specific part). On-device flash
    holds firmware (Section 07), a small ring buffer of recent Log
    entries (for offline queuing), and TLS credentials for the LOT API
    connector (Section 05).

  BUTTON
    Single physical button. Short press = "Copy" (Section 03/05).
    Long press (2s) = attach camera snapshot to the same Log entry
    (Section 04, Camera). No other physical controls — power and
    charge state are read from the screen, not a separate LED, to keep
    the front face to exactly three elements (camera, screen, button)
    as specified.

  AI-GRADE OFF-THE-SHELF SENSOR POLICY
    Every sensor in this design is a commodity part with a public
    datasheet, an existing driver in the target firmware framework, and
    a documented accuracy spec — no custom silicon, no unverified
    "AI-branded" sensor claims. "AI-grade" here means: good enough
    signal-to-noise that the server-side AI engine can trust the reading
    without on-device correction. Section 06 lists exact parts.

--------------------------------------------------------------------------------
05 // LOT API CONNECTOR
--------------------------------------------------------------------------------

The device is a second client of the API surface that already exists
(src/client/queries.ts, line 134-147). No new data model is invented
for the Log; the device authenticates as the operator's own hardware
and writes to their existing Log.

  PROVISIONING
    Each unit ships with a unique device ID (laser-etched serial,
    Section 02) and a one-time pairing code shown on first boot. The
    operator enters the code at lot-systems.com/hardware/pair (new
    route) once, which issues the device a long-lived API token scoped
    to their account only. No cloud account beyond the operator's
    existing lot-systems.com login is created.

  ENDPOINTS (new, additive — no existing route is changed)

    GET  /api/hardware/notify
      Long-poll / 60s-fallback. Returns the next queued AI-composed
      notice for this device (Section 03), or 204 if none. Server-side,
      this reuses the same AI engine abstraction (README.md line
      143-158) that already generates Memory Engine questions — a
      notice is simply a very short, device-formatted output of the
      same pipeline.

    POST /api/hardware/copy
      Body: { deviceId, noticeId?, snapshot?: base64 }
      This is the "Copy" button's signal. Server-side it is a thin
      wrapper over the existing `useCreateLog` mutation
      (src/client/queries.ts line 139-142) — it creates a Log entry
      with `event: "hardware_copy"` and `metadata: { deviceId, source:
      "cosmo-cube" }`, so it appears in the operator's Log tab exactly
      like a log entry created from the web app, with no schema
      branching required downstream.

    POST /api/hardware/telemetry
      Body: { deviceId, tempC, humidityPct, pressureHpa, presence: bool,
      batteryPct, ts }
      Periodic (15 min) weather + presence + health beacon. Feeds the
      hyperlocal weather reconciliation named in Section 04 and the QOS
      System Pressure signal set (README.md line 124-129).

  AUTH
    Bearer token (device-scoped, revocable from Settings > Hardware in
    the web app — a new settings panel, out of scope for this document,
    named as a software-bridge task in docs/hardware/03-SOFTWARE-BRIDGE.md).
    Token never grants access beyond the four endpoints above.

  OFFLINE BEHAVIOR
    "Copy" presses queue locally (on-device flash ring buffer, Section
    04) if the network is down and flush to `/api/hardware/copy` in
    order once connectivity returns — no Log entry is lost to a dropped
    Wi-Fi connection.

--------------------------------------------------------------------------------
06 // BILL OF MATERIALS — see docs/hardware/01-BOM.md
--------------------------------------------------------------------------------

The full parts list, supplier candidates, and per-unit / 100-unit cost
roll-up live in a separate document (per this task's own instruction to
keep documents separate) — docs/hardware/01-BOM.md. Summary only, here:

  CATEGORY              CHOICE (v1.0 REFERENCE)                 QTY/UNIT
  --------               ------------------------                --------
  MCU + Wi-Fi + Camera   ESP32-S3 module w/ camera header          1
  Camera sensor          OV2640 (2MP, low-power)                   1
  Display                Reflective/transflective LCD, round        1
                         or square, ~1" class
  Weather sensor         Bosch BME280 (temp/humidity/pressure)      1
  Button                 Sealed stainless tactile switch            1
  Wireless charge        Qi-class receiver coil + PMIC              1
  Battery                LiPo, 150-250mAh, ultra-thin cell          1
  Enclosure              2x stainless-steel shells, CNC + polish    1 set
  PCB                    4-layer, PCBWay fab + assembly             1
  Fasteners/gasket       M1.6 captured screws, silicone gasket      1 set

--------------------------------------------------------------------------------
07 // FIRMWARE & SOFTWARE — SEPARATE DOCUMENTS
--------------------------------------------------------------------------------

Per this task's explicit instruction (separate documents for firmware and
for the software that connects to firmware), the detailed specs are NOT
inlined here:

  docs/hardware/02-FIRMWARE.md          On-device firmware architecture,
                                          boot flow, OTA update path,
                                          the local session-compression
                                          routine (item 8 of the brief —
                                          see below).
  docs/hardware/03-SOFTWARE-BRIDGE.md   The server-side bridge: the four
                                          endpoints in Section 05, the
                                          pairing route, the Settings >
                                          Hardware panel, and how it
                                          composes with the existing
                                          AI engine abstraction.

  SESSION COMPRESSION (brief item 8)
    Each on-device "session" (power-on to idle-timeout, or one
    notice-to-Copy cycle) is compressed on-device into a single
    telemetry record before it is ever transmitted — raw sensor ticks
    are never queued individually. This mirrors the platform's existing
    Memory Engine compression discipline
    (docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md) applied
    at the hardware edge instead of the database tier. Full routine
    specified in docs/hardware/02-FIRMWARE.md, Section 3.

--------------------------------------------------------------------------------
08 // ROADMAP — v1.0 -> v1.1 -> v2
--------------------------------------------------------------------------------

  v1.0 — THIS DOCUMENT (DESIGN LOCK)
    Full BOM sourced, manufacturing plan drafted (PCBWay + CNC steel
    enclosure), firmware and software specs written, user/assembly PDF
    manuals produced. GATE: 100-unit pilot run quoted and a single
    hand-built prototype passes power-on, notify round-trip, and Copy
    round-trip against a live lot-systems.com account.

  v1.1 — PILOT RUN
    100 units fabricated per docs/hardware/04-MANUFACTURING-PCBWAY.md.
    GATE: 100/100 units pass a five-point factory test (boot, screen,
    camera, weather sensor, wireless charge detect) before shipment;
    zero DOA units in first 30 days of field use, or root-caused and
    patched via OTA (docs/hardware/02-FIRMWARE.md).

  v2 — RESEARCH TRACK, NOT SCHEDULED
    Candidate directions recorded here so v1.0 material and mechanical
    choices don't foreclose them: on-device presence inference (no
    server round-trip for the QOS signal), a second screen size tier,
    and an optional CUBIQ-style micro-actuator variant that would sit
    at the exact boundary CUBIQ-v0's Section 00 asked future documents
    to keep clear of. No claim is made here that v2 will cross that
    boundary — it is recorded as a question, not a plan.

--------------------------------------------------------------------------------
09 // BRAND
--------------------------------------------------------------------------------

COSMO® Cube              The object — this document
LOT Computer              The working/informal name used in the intake
                           brief this document answers
LOT® API Connector        The software bridge (Section 05)
COSMO®                    The parent hardware division
                           (docs/corporate/LOT_ROBOTICS_COSMO.md)
LOT®† COSMO® Cube         The combined mark

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-HARDWARE-v1
================================================================================
