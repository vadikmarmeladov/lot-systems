================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: COSMO-PAGER-HARDWARE-COMPUTER
TITLE:    COSMO® PAGER — Hardware Computer, Model P-1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV, INVENTOR — COSMO® CIA
DATE:     2026-09-02
VERSION:  1.0 — PLAN, BOM, AND ROADMAP LOCK
STATUS:   PRE-HARDWARE — SPEC LOCK, SOURCING OPEN
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This is a physical-product plan, not a new invention out of nothing. Before
writing a line of BOM, the following were read in full so this device does
not collide with, or duplicate, work already on record:

  docs/benchmark/LOT-MANIFEST.md (line 31, line 88-89)
    Names a prior branch, "COSMO Hardware | brave-lamport-t9z5u8 | ...
    COSMO® Cube — complete hardware computer design v1.0," recorded as
    incorporated into master on 2026-06-27. The content of that design is
    NOT present anywhere in the current docs tree — grep across docs/ for
    stainless, PCBWay, enclosure, BOM, and wireless-charging turns up
    nothing from that branch. This document does not assume it can
    reconstruct that lost spec. It is a fresh, authoritative build against
    the 19-point brief on file for 2026-09-02, and it deliberately does
    NOT reuse the name "COSMO® Cube" — see NAMING below.

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    Already claims the word "Cube" for LOT®'s haptic notification object —
    a 45mm cube that hops. That object is LOT®'s (father brand). This
    document's object is COSMO®'s (son brand, Kuzya Cosmo Marmeladov,
    founded 2024-07-01). Reusing "Cube" for a flat square tile would
    collide with a shipping name. See NAMING below for the resolution.

  docs/corporate/LOT-TERMINAL-M2M.md
    The existing device -> platform data-intake protocol (Format 1/2/3,
    POST /v1/m2m/intake, weather-station example data already shaped
    exactly like this device's onboard sensor). This document's "LOT API
    connector" (Section 05) is built as an EXTENSION of M2M, not a
    replacement — it adds the missing platform -> device half (the pager
    push) that M2M never specified.

  docs/technical/LOT-NODE-0-RIG-SPEC.md
    House style for a hardware spec in this repo (TERMINAL GRID, cost
    tables with ENTRY/SERIOUS columns, a numbered build SEQUENCE). This
    document follows that convention.

  docs/technical/OS_API.md, src/server/routes/api.ts (grep "journal")
    Confirms "Log tab" (referenced in JournalReflection.tsx line 17) is
    real shipped UI, backed by a generic `logs` table with an `event`
    field (values already include `note`, `log_entry`, `journal`). The
    brief's item 16 ("Copy" button -> Log tab) is specified in Section 05
    against this real table, not an imagined one.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md (row: "Quantum Cube Hardware
  | Hardware feedback integration (Month 12+) | PLANNED")
    Confirms hardware is an open, named line item on the corporate
    roadmap — this document is that line item's second entry (CUBIQ was
    the first), filed under COSMO® rather than LOT®.

--------------------------------------------------------------------------------
01 // NAMING
--------------------------------------------------------------------------------

  PRODUCT           COSMO® PAGER
  MODEL              P-1
  FULL MARK          COSMO®† PAGER  (dagger mark = COSMO® son-brand,
                      matching the LOT®†CUBIQ® combined-mark convention
                      already set in LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 08)
  WHY "PAGER"         The brief's own governing verb (item 2: "Send a
                      pager-like notification"). It is exact, it is not
                      already claimed by CUBIQ, and it correctly sets
                      expectation: this device receives short text, once,
                      on demand — not a screen to check.
  WHY NOT "CUBE"      Already spoken for by LOT®'s CUBIQ line. A flat
                      40mm square tile is not a cube in any case — the
                      old branch's naming choice does not survive contact
                      with a shipping sibling product.

--------------------------------------------------------------------------------
02 // WHAT P-1 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  P-1 IS:
    - A palm-sized hardware object that sits on a desk or charging pad
      and shows ONE short line of AI-authored text when the LOT platform
      decides the operator should see it — "Coffee time!" is the
      reference example from the brief, and the canonical test of the
      whole compression pipeline (Section 06): if the line needs a
      second sentence, the pipeline has failed.
    - A one-button input device. The button is labeled COPY. One press
      writes one entry to the operator's Log tab on lot-systems.com
      (Section 05). It does not type, does not scroll, does not have a
      second button — LOT-TERMINAL-VISION.md's "Complexity -> Simplicity"
      philosophy applied to physical input, not just sensor output.
    - A standing environmental sensor node on the existing M2M protocol
      (weather / air quality, LOT-TERMINAL-M2M.md Format 3) — the device
      earns its place on the desk between notifications by being useful
      on its own, independent of the platform's AI loop.
    - Wirelessly charged, stainless-bodied, two machined halves, one
      polished blank face and one instrumented face (camera, screen,
      button) — brief items 3, 4, 17, 18, 19, specified in full in
      Section 03.

  P-1 IS NOT:
    - A screen to check. No app, no scroll, no unread badge. If an
      operator starts glancing at it out of habit rather than because it
      moved/lit/paged, the product has drifted into "another phone" and
      that is a field failure, not a feature request.
    - A camera product. The camera (Section 03) exists for two narrow,
      named jobs — ambient light sensing for display calibration, and
      operator-initiated pairing/QR capture. It is not a surveillance
      device, it does not stream, and it ships with the lens physically
      shuttered when not actively performing one of those two jobs
      (Section 08, safety gate).
    - CUBIQ. It does not move. It has no actuator. It is the platform's
      OTHER hardware object — see NAMING.

--------------------------------------------------------------------------------
03 // PHYSICAL FORM  (brief items 3, 4, 17, 18, 19)
--------------------------------------------------------------------------------

  OVERALL FOOTPRINT   40mm x 40mm x 5mm target — flat silver square,
                       brief item 4, verbatim.
  BODY                Two-piece stainless steel shell, brief item 3:

    FACE A (TOP)       Polished stainless steel, mirror finish, blank
                        except for a laser-etched COSMO® mark. No
                        components live behind this face other than the
                        display, which shows through a sapphire or
                        Gorilla Glass window let into the polish.
                        Brief item 17.

    FACE B (BOTTOM)     Bead-blasted stainless steel bezel, three
                        cutouts: a 4mm camera lens aperture (top-left
                        corner), the button (COPY, center-bottom, brief
                        item 16), and the Qi charge coil sits behind this
                        face flush with the metal (no visible port —
                        charging is fully wireless, brief item 19).
                        Brief item 18.

  HONEST ENGINEERING NOTE ON THE 5mm TARGET
    5mm total height is an aggressive constraint once a camera module,
    an environmental sensor with its required air gap, a Qi receiver
    coil, a battery, and an MCU are stacked. This plan does not pretend
    otherwise:
      v0.1 (Section 07) ships in an off-the-shelf enclosure at whatever
        height the dev-kit parts dictate (12-18mm) — the goal is to
        prove the electronics and the software loop, not the shell.
      v0.5 moves to a custom PCB and a 3D-printed shell at a REVISED
        target of 9-11mm, using a flex-PCB camera ribbon and a
        thin-format (2mm) LiPo cell to compress the stack.
      v1.0 is the first hardware to attempt the true 5mm stainless
        shell, and only after v0.5's stack has been measured and the
        thinnest viable BOM locked (Section 04, THIN-STACK column).
        If 5mm proves physically impossible with a real camera + Qi
        coil + battery inside stainless (not aluminum, which conducts
        Qi fields far worse), the gate in Section 07 requires this
        document to be amended with the measured floor BEFORE tooling
        is cut — not silently shipped over spec.

  MASS TARGET          <60g fully assembled (stainless is heavy; this
                        is the desk-presence weight that keeps the
                        object from being knocked around, working WITH
                        the material rather than fighting it).

  DISPLAY               Section 03 face A window. Spec in Section 04.

  CAMERA                Section 03 face B aperture. Spec in Section 04,
                          purpose and safety gate in Section 08.

  WEATHER / AIR SENSOR   Internal, no external port — samples through a
                          Gore-style vent membrane in the Face B bezel
                          seam. Spec in Section 04. Brief items 14, 15.

  CHARGER (ACCESSORY)    A separate Qi-class charging puck ships with
                          each unit — brief item 12 as a distinct object
                          from the device itself, matching CUBIQ's
                          existing precedent (LOT-CUBIQ-QUANTUM-CUBE-v0.md
                          Section 02: "the charging pad IS the table").
                          P-1 reuses that same charging-pad-as-surface
                          idea rather than inventing a second one.

--------------------------------------------------------------------------------
04 // BILL OF MATERIALS — COMPONENT BUYING LIST
--------------------------------------------------------------------------------

Prices are per-unit at 100-piece quantity (brief item 13), current
general market ranges as of 2026-09, and will move with the market —
re-quote before committing tooling spend. Links go to the supplier's
main storefront/service page rather than a guessed deep product URL;
search the listed part number once there.

```
COMPONENT            SPEC / PART                         QTY100    SUPPLIER
─────────            ───────────                         ──────    ────────
MCU                   ESP32-S3-WROOM-1 (WiFi+BLE,          $3.20    Digikey
                       camera-capable DVP interface,                 digikey.com
                       AI-vector extensions for on-                  (search
                       device sensor fusion)                          "ESP32-S3-WROOM-1")

CAMERA                OV2640 2MP module, flex-ribbon        $2.80    LCSC
                       pigtail (thin-stack variant for               lcsc.com
                       v0.5+, DVP interface to ESP32-S3)

DISPLAY                1.3" round monochrome sharp           $4.50    Adafruit /
                        memory-LCD or low-power OLED,                 Mouser
                        SPI, <1mA idle — single line of               adafruit.com
                        large text is the only render target          mouser.com

ENVIRONMENTAL SENSOR   Bosch BME688 — "AI-grade off-the-      $6.10    Digikey /
                        shelf sensor" per brief item 15:              Mouser
                        temp / humidity / pressure / gas               (search
                        with on-chip BSEC2 AI library for              "BME688")
                        air-quality inference, not a raw
                        analog gas sensor

WIRELESS CHARGE RX      STWLC38 Qi receiver IC + coil          $2.90    ST Direct /
                         (5W, thin-profile antenna for                 Mouser
                         stainless-compatible field coupling —
                         NOT aluminum, which detunes the coil)

BATTERY                 250mAh thin-format LiPo (2mm),         $1.60    LCSC
                         buffer only — device is desk-
                         resident and Qi-charged, not a
                         daily-carry battery product

BUTTON                  IP54 sealed tactile switch, laser-     $0.90    Digikey
                         etched "COPY" cap, gasket-mounted
                         through the Face B stainless bezel

PCB                     4-layer, 30mm x 30mm, ENIG finish      $1.40    PCBWay
                         (fits inside the 40x40mm shell with           pcbway.com
                         clearance for the coil and battery)

PCB ASSEMBLY (PCBA)     SMT placement, 100-unit run             $8.50    PCBWay
                         (brief item 1 + item 13 combined —            pcbway.com
                         PCBWay quoted as a single fab+assembly
                         line item, not fab and assembly
                         separately sourced)

STAINLESS BODY, 2pc     CNC-machined 316L stainless, two        $14.00   PCBWay
                         halves (polished + bead-blast),                (PCBWay CNC
                         100-unit run — see Section 09 for              service) /
                         the case for keeping this on PCBWay             local CNC
                         rather than splitting to a metal shop           job shop
                         (single vendor, single PO, single ship
                         date for a 100-unit pilot)

DISPLAY WINDOW           Sapphire or Gorilla Glass disc,        $1.20    PCBWay /
                          20mm diameter, adhesive-bonded to               glass
                          Face A                                          supplier

VENT MEMBRANE             Gore-style waterproof/breathable       $0.35    Digikey
                            vent patch, 6mm

CHARGING PUCK (ACC.)      Off-the-shelf Qi 5W puck, private      $4.00    AliExpress /
                            -labeled COSMO®, brief item 12                private-label
                                                                            sourcing

PACKAGING + MANUAL         Box, foam insert, printed quick-       $2.50    local
                             start card (PDF manual is the                 packaging
                             primary manual — Section 10)                   vendor
─────────                 ───────────                          ──────    ────────
TOTAL BOM / UNIT                                                 ≈ $54.00
```

```
100-UNIT PILOT RUN — ALL-IN COST
─────────────────────────────────
BOM (100 x $54.00)                         $5,400
PCBWay tooling / NRE (stencil, CNC          $1,200
  fixture, one-time)
Firmware flash + functional test jig         $600  (one-time)
Freight (China -> US, air, 100 units)        $450
─────────────────────────────────
TOTAL, 100-UNIT PILOT                      ≈ $7,650
COST PER UNIT (amortized)                  ≈ $76.50
```

--------------------------------------------------------------------------------
05 // LOT API CONNECTOR  (brief items 6, 16)
--------------------------------------------------------------------------------

Two channels, built as a named extension of the existing M2M protocol
(docs/corporate/LOT-TERMINAL-M2M.md) rather than a parallel system:

  CHANNEL 1 — DEVICE -> PLATFORM (existing M2M, reused as-is)
    POST /v1/m2m/intake
    Body: LOT-TERMINAL-M2M.md Format 3 (Multi-Sensor Array), unchanged.
    P-1's BME688 readings ship on this exact schema — device_type:
    "environmental_monitoring", sensors: [temperature, humidity,
    pressure, gas/air_quality]. No new endpoint needed; P-1 is simply
    the first hardware device to actually populate M2M in production.

  CHANNEL 2 — PLATFORM -> DEVICE (new — the pager half, brief item 2)
    This does not exist anywhere in the current docs tree and is the
    one genuinely new API surface this device requires:

    GET  /v1/pager/subscribe?device_id=...   (long-poll or SSE)
    Body (platform -> device):
      { "device_id": "...", "line": "Coffee time!",
        "gesture": "nudge" | "flash" | "hold",
        "issued_at": "2026-09-02T14:32:00Z" }
    Constraint: `line` is hard-capped at 24 characters server-side
    BEFORE it is queued — the device firmware does not truncate,
    the platform does not send what will not fit. This is the
    session-compression discipline from Section 06 enforced at the
    API boundary, not left to the display driver.

  CHANNEL 3 — THE COPY BUTTON -> LOG TAB  (brief item 16)
    POST /v1/m2m/log
    Auth: same operator_token as Channel 1.
    Body:
      { "device_id": "...", "event": "device_copy",
        "text": "<the pager line on screen at press time, or empty>",
        "timestamp": "..." }
    Server-side: appended to the existing `logs` table (the same table
    backing the Log tab per src/server/routes/api.ts, event values
    already including "note" / "log_entry" / "journal" — "device_copy"
    is a new event value on that existing table, not a new table).
    The operator opens lot-systems.com, goes to the Log tab, and the
    press is there — a physical button that writes one line to a real
    tab, verbatim brief item 16.

--------------------------------------------------------------------------------
06 // SESSION COMPRESSION  (brief item 8)
--------------------------------------------------------------------------------

"Compress the information in each session" is the same discipline
already named and built for the software product — see
docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md. P-1 is the
hardware expression of it, at two points:

  ON THE WAY IN (device -> platform)
    A "session" for P-1 is one charge-to-charge interval. Rather than
    streaming every BME688 sample, firmware buffers locally and ships
    ONE compressed summary per session on M2M (Channel 1) — min/max/
    mean per sensor, not a raw time series. This mirrors
    LOT-TERMINAL-VISION.md's own worked example verbatim:
      RAW:  "Weather station with 12 sensors, ARM processor, WiFi module"
      SHIP: "Air quality: 67/100"
    P-1 ships the compressed line, never the raw stream.

  ON THE WAY OUT (platform -> device)
    Whatever multi-paragraph reasoning the Memory Engine / QI-46
    Calibration Loop used to decide "the operator should be told about
    coffee" is thrown away before Channel 2 fires. The device receives
    only the 24-character output. The compression is not a display
    limitation worked around by the firmware — it is a platform-side
    editorial discipline, enforced at the API boundary (Section 05,
    Channel 2), because a pager that receives paragraphs and truncates
    them is not a pager, it is a broken phone.

--------------------------------------------------------------------------------
07 // ROADMAP — v0.1 -> v0.5 -> v1.0 -> PILOT
--------------------------------------------------------------------------------

  v0.1 — BREADBOARD PROOF OF LOOP
    Off-the-shelf ESP32-S3 dev board, BME688 breakout, small SPI OLED,
    one tactile button, USB power (no wireless charging yet). Off-the-
    shelf enclosure, any height. Deliverable: Channel 1 + Channel 2 +
    Channel 3 (Section 05) all live end-to-end against a real
    lot-systems.com account — a real "Coffee time!" line arrives and
    a real button press lands in a real Log tab.
    GATE: 20/20 pager lines delivered and rendered correctly, 20/20
    Copy presses landing in the Log tab within 3 seconds, zero
    dropped M2M sessions across a 48-hour soak.

  v0.5 — CUSTOM PCB, PRINTED SHELL
    PCBWay-fabricated PCB (Section 04), 3D-printed enclosure at the
    revised 9-11mm height target (Section 03), Qi charging live
    (STWLC38), camera wired for the two named jobs only (Section 08).
    GATE: measured Z-height stack recorded in this document (Section
    03 amendment if 5mm is not achievable), 500-cycle Qi charge/
    discharge test with zero coil detuning against the stainless
    mockup, camera shutter mechanism 100/100 correct open/close cycles.

  v1.0 — STAINLESS PILOT UNIT
    Machined 2-part 316L stainless shell (Section 03), production
    PCBA via PCBWay (Section 04), final firmware (separate document,
    Section 11) and software bridge (separate document, Section 11)
    both frozen and versioned.
    GATE: 10 hand-built v1.0 units pass the v0.5 test suite plus a
    drop test (1m onto hardwood, 10/10 survive) and an IP54 spray
    test on the Face B seam (button + vent membrane).

  PILOT — 100-UNIT RUN  (brief item 13)
    Full BOM (Section 04) ordered at 100-unit quantity through PCBWay
    for PCB, PCBA, and CNC stainless (single vendor, Section 09),
    charging pucks private-labeled separately. PDF manuals (Section
    10) finalized and shipped in-box with every unit.
    GATE: 95/100 units pass functional test-jig (flash + Qi charge +
    button + display + camera shutter) before ship; failures root-
    caused and logged, not silently reworked.

--------------------------------------------------------------------------------
08 // CAMERA — SCOPE AND SAFETY GATE  (brief item 5)
--------------------------------------------------------------------------------

  JOB 1 — AMBIENT LIGHT / DISPLAY CALIBRATION
    A single low-resolution frame, averaged to a brightness value, used
    to set display contrast for the room. Frame is discarded on-device,
    never transmitted. Runs on a timer (once per 10 minutes), not
    continuously.

  JOB 2 — PAIRING / QR CAPTURE
    Operator-initiated only (holds the COPY button 3s to enter pairing
    mode). Captures one frame to read a QR code shown on
    lot-systems.com for device linking. Frame is discarded after the
    QR payload is decoded on-device.

  HARD GATE
    No streaming mode exists in firmware (Section 11 confirms this is
    enforced in code, not policy). A physical shutter (a small stepper-
    driven flag, sourced with the camera module) closes over the lens
    aperture any time neither Job 1 nor Job 2 is actively running — a
    P-1 unit sitting idle on a desk has its lens mechanically covered,
    verifiable by looking at it. No v1.0 unit ships without 100/100
    shutter-closed verification on the test jig.

--------------------------------------------------------------------------------
09 // MANUFACTURING PARTNER — WHY PCBWAY  (brief item 1)
--------------------------------------------------------------------------------

PCBWay is used for THREE line items in Section 04 — PCB fab, PCBA, and
CNC stainless body — deliberately kept on one vendor for the 100-unit
pilot: one PO, one QC pass, one ship date, one point of accountability
for a run this size. Splitting the stainless body to a dedicated metal
shop is the likely v1.1+ move once volume justifies a specialized
partner with tighter tolerances on the polished Face A finish — that
decision is deferred to after pilot feedback, not made now.

--------------------------------------------------------------------------------
10 // PDF MANUALS  (brief item 7)
--------------------------------------------------------------------------------

Three PDFs ship, generated from source markdown the same way this repo
already generates docs/badges/pdf/*.pdf from markdown source — reusing
existing tooling rather than adding a new PDF pipeline:

  1. QUICK START (1 page)      Unbox, pair (hold COPY 3s + scan QR),
                                  first pager line, first Copy press.
  2. USER MANUAL (4-6 pages)    Full Section 02/08 behavior, charging,
                                  cleaning the stainless faces, what the
                                  camera does and does not do (Section
                                  08, printed in full — no surveillance
                                  ambiguity in-box).
  3. WARRANTY / SAFETY (2 pages) IP54 rating, battery safety, Qi
                                  charger compatibility notes.

Each PDF is generated fresh per firmware/software version tag (Section
11) so a manual never describes a behavior the shipped firmware does
not have.

--------------------------------------------------------------------------------
11 // SEPARATE DOCUMENTS  (brief item 11)
--------------------------------------------------------------------------------

Per the brief, firmware and software are kept as their own documents,
not folded into this plan:

  FIRMWARE     docs/technical/COSMO-PAGER-FIRMWARE-SPEC.md
                (brief item 9)
  SOFTWARE     docs/technical/COSMO-PAGER-SOFTWARE-BRIDGE.md
                (brief item 10 — the bridge connecting firmware to the
                LOT API connector defined in Section 05 above)

This document (COSMO-PAGER-HARDWARE-COMPUTER.md) stays the plan/BOM/
roadmap layer; the two linked documents own implementation detail for
their respective layers and are versioned independently.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END COSMO-PAGER-HARDWARE-COMPUTER
================================================================================
