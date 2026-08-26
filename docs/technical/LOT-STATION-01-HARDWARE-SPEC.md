<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT® STATION — QIoT™ SIGNAL TERMINAL
HARDWARE + FIRMWARE + MANUFACTURING SPECIFICATION
================================================================================

DOCUMENT    STATION-01 / HARDWARE-SPEC
ISSUE DATE  2026.08.26
CLASS       INTERNAL / BUILD / PRE-RFQ
STYLE       TERMINAL GRID
STATUS      PLANNING — no unit fabricated yet
COMPANION   docs/technical/LOT-NODE-0-RIG-SPEC.md (same house style, the compute
            counterpart to this signal counterpart)
S-2         VADIK MARMELADOV

================================================================================

## 00  PRINCIPLE — WHAT LOT® STATION ACTUALLY IS

LOT® Station is not a general-purpose computer and it is not a smartphone
accessory. It is a **single-purpose signal terminal**: the physical output of
the Memory Engine's contextual-prompt layer (`ContextualPromptsWidget`,
`intentionEngine`) and the physical input of one deliberate action — Copy.
It receives short pager-style lines ("Coffee time!"), shows one at a time on
a small round display, holds one button, and closes a loop back to the
account's Log tab. Everything else — the camera, the weather sensor, the
IMU — exists to feed the Memory Engine better signal, not to turn the device
into a screen you get lost in. If a feature would make Station more
absorbing rather than more honest, it does not belong on Station.

This spec was requested against 19 numbered logic points plus four reference
URLs (`brand.lot-systems.com`, `lot-systems.com/about`,
`institute.lot-systems.com/cqgs.html` ×2). **All three domains returned
`EGRESS_BLOCKED` from this session's network proxy** — this document was
written from the LOT-Computer repository itself (README, wiki v83–v87,
`docs/corporate/LOT-FEATURE-INVENTORY-2026.md`, the Log model, the
Quantum-Intent sync pipeline, and the existing NODE-0 spec) plus open-web
component/manufacturer research. Brand system (typefaces, exact Pantone/
finish call-outs) and the CQGS framework referenced in the brief could not be
read this session — §11 lists this as the first open item before any
metal is cut.

    ONE SIGNAL OUT    ONE ACTION IN    NO SILENT CAPTURE    METAL YOU CAN SEE

================================================================================

## 01  WHERE STATION SITS IN THE ECOSYSTEM

```
Ecosystem Map (QOS View 1) currently ships 6 active nodes. Wearable Ecosystem
(docs/corporate/LOT-FEATURE-INVENTORY-2026.md #15) lists 5 planned hardware
nodes — Car, Home, CPU, Phone, Watch — status PARTIAL, "client tracking live,
hardware planned." LOT-WIKI-v83 §QIoT™ names "LOT® Station" directly as one
of three planned physical devices, alongside LOT® Brush and COSMO® node.

STATION-01 fills the HOME node. It is the first of the five to leave the
software-only stage — chosen because it needs no actuators, no motors, no
COSMO robotics dependency (that division targets 2028-2029 per the feature
inventory), and it reuses infrastructure (Log model, Memory Engine
compression loop, Weather Station feature) that already ships today.
```

================================================================================

## 02  INDUSTRIAL DESIGN — THE TWO-PIECE STAINLESS BODY

```
FORM        40mm × 40mm square plate, two-piece stainless steel shell,
            wall-mount or desk-stand. Corners eased, not sharp — this sits
            on a nightstand or a wall, not a workbench.

FACE A      Polished (mirror) 304 stainless. No screen, no seam, no visible
            fastener. This is the "off" face — brand mark only, laser-etched
            LOT wordmark, filled black or left raw depending on brand review.

FACE B      Bead-blasted or brushed 304 stainless, machined for three
            cutouts: round display window, camera aperture, and the single
            Copy button. This is the "on" face — the one the user interacts
            with.

MOUNT       Two halves join with 4× M1.4 flat-head screws (or a press-fit
            + adhesive gasket for a screwless version, TBD after first
            prototype). Silicone gasket between halves for splash tolerance
            — this is a nightstand/kitchen device, not a submersible one.
```

### THE 5mm QUESTION — READ BEFORE QUOTING TOOLING

The brief specifies a **4×4cm × 5mm** flat plate. At 5mm total stack height,
there is no room for a battery, a Qi coil, a camera module, and a display
simultaneously — even the thinnest commercial round-LCD module (GC9A01,
~1.28") plus its FPC connector alone runs 3–4mm, and a usable LiPo pouch
adds 2–5mm on its own. Stacked, a camera + display + battery + Qi coil +
custom PCB realistically lands at **11–16mm**, not 5mm, with today's
off-the-shelf modules.

Two honest paths forward, not one silently-broken promise:

```
PATH A — BUILDABLE NOW (v1 prototype + 100-unit pilot)
  Total height  11–16mm (the "flat silver square" becomes a flat silver
                puck — thin for a consumer electronics device, not a
                literal 5mm wafer).
  Uses          COTS display module, COTS camera module, custom carrier PCB,
                slim 300–400mAh LiPo pouch.
  Risk          Low. Every part below is sourced and priced today.

PATH B — 5mm ASPIRATIONAL (v2 industrial-design target)
  Total height  5–7mm.
  Requires      Chip-on-board (bare-die) camera sensor instead of a modular
                camera (removes ~2mm), a flexible/rigid-flex PCB wrapped
                around the coil instead of a stacked board, a thin-film or
                solid-state battery (low mAh, short runtime — acceptable
                only if Station sleeps between pushes and charges nightly),
                and a custom-tooled micro round display rather than a
                hobbyist breakout.
  Cost impact   A second, much more expensive NRE pass — likely $15–40K in
                new tooling and a display-vendor NRE, not a PCBWay quote.
  Recommendation: build Path A first, sell/validate the 100-unit run, THEN
  commission Path B once the product is proven and the budget for
  custom-tooled thin electronics exists. Do not spend v2 money before v1
  ships.
```

### THE STAINLESS-STEEL / WIRELESS-CHARGING CONFLICT — FIX THIS BEFORE TOOLING

Item 3 (2-piece stainless body) and item 19 (wireless/Qi charger) conflict
directly: **Qi charging cannot pass through solid metal.** A closed
stainless enclosure either blocks the coil's field entirely or, worse,
induces eddy currents in the steel that convert charging power into heat
right next to a LiPo pouch — a real safety issue, not a cosmetic one.

Fix (pick one, both are standard practice on metal-body wireless devices):

```
OPTION 1  Non-metal charging window. Machine a ~30mm circular pocket in
          Face A (or the base edge) and insert a ceramic, glass, or
          engineering-polymer disc flush with the polished steel, aligned
          to the Qi coil behind it. Keeps the "polished stainless" face
          intent, adds one insert part and one bonding step.

OPTION 2  Drop Qi, use pogo-pin contact charging. The charging dock (item
          12) carries spring-loaded pogo pins that meet exposed contacts
          machined into the base edge of the steel shell. Simpler
          electrically, fully solves the metal problem, costs the "wireless"
          framing — this becomes a magnetic contact charger, not Qi.
```

Recommendation: **Option 1.** It is the only path that keeps every one of
items 3, 17, 19 literally true at once.

================================================================================

## 03  BILL OF MATERIALS — PATH A (100-UNIT PILOT)

Prices below are open-web reference points gathered this session (sources at
the bottom of §10), not vendor quotes. Every line needs a real RFQ before the
100-unit PO is placed — treat this table as a budgeting instrument, not an
invoice.

```
COMPONENT               SPEC / ROLE                          UNIT @ 1-10   UNIT @ 100
────────────            ────────────                          ───────────   ──────────
MCU + display core       ESP32-S3 dual-core, WiFi/BT, drives   $16–23        ~$10–14
                          the round LCD. Prototype on a
                          Waveshare ESP32-S3-Touch-LCD-1.28
                          dev module; production repl. with
                          bare ESP32-S3-WROOM chip + GC9A01
                          driver on the custom PCB below.
Round display             1.28" IPS, 240×240, GC9A01 driver.   included above included above
                          (ships on the dev module in proto;
                          separately sourced panel in prod.)
Camera                    OV2640 2MP DVP module (ESP32-        $8–15         ~$4–7
                          native driver support, small
                          footprint vs. OV5640).
Env / weather sensor      Bosch BME280 — temp / humidity /     $5–15         ~$2–4
                          pressure, I2C. Feeds the existing
                          "Weather Station" public-profile
                          feature with a real local reading
                          instead of an API pull.
Motion sensor             6-axis IMU — free if using the       $0 (bundled)  $0 (bundled)
                          Waveshare module's onboard QMI8658;
                          otherwise a $1–2 discrete part.
Wireless charge receiver  Qi 5V/1A receiver coil + PCB.         $4–8          ~$2–3
Battery                   3.7V LiPo pouch, 300–400mAh, slim     $3–6          ~$2–3
                          profile for the 11–16mm stack.
Charge/protection IC      TP4056-class Li-ion charge + UVLO/    $0.50–1       ~$0.30
                          OVP protection (or integrated on
                          the Qi receiver board).
Copy button                Single SMD tactile switch behind a  $0.30–0.80    ~$0.15
                          machined steel cap.
Status LED                RGB SMD — charge state, notification $0.20–0.40    ~$0.10
                          pulse, and (mandatory, see §11)
                          camera-active indicator.
Custom carrier PCB         2–4 layer board integrating the     n/a (proto    ~$6–12
                          above once past the dev-board         uses dev
                          prototype stage — PCBWay PCB fab +    boards)
                          SMT assembly.
Stainless shell (2pc)      304 stainless, one polished, one    $15–30 (low   ~$8–20
                          machined face, CNC + sheet metal      qty CNC is
                          via PCBWay. Includes the Option-1     expensive)
                          charging-window insert.
Gasket + fasteners          Silicone gasket, M1.4 screws.       $1–2          ~$0.50
────────────               ────────────                          ───────────   ──────────
UNIT HARDWARE TOTAL         (excludes NRE, cert, packaging)     ≈ $55–100     ≈ $35–65
```

### CHARGING DOCK (item 12 + 19, sold/bundled separately)

```
Qi transmitter coil + PCB          $3–6 low qty / ~$2 at 100
Machined or cast metal base        $8–15 low qty / ~$5–10 at 100
DOCK UNIT TOTAL                    ≈ $12–20 low qty / ≈ $7–12 at 100
```

### ONE-TIME NRE — DO NOT SKIP WHEN BUDGETING THE 100-UNIT RUN

```
Custom PCB design + 2 spin rounds        $500–1,500
CNC/sheet-metal tooling + fixtures       $1,000–3,000
SMT stencil + PCBA line setup            $200–500
FCC (Part 15) + battery safety pre-scan  $3,000–8,000  ← mandatory, not optional.
                                          A WiFi radio + camera + rechargeable
                                          Li-ion cell sold to end users in the
                                          US requires FCC certification and
                                          UN38.3 battery transport testing
                                          before it can ship or fly. Budget
                                          and schedule this BEFORE committing
                                          to the 100-unit PO — a failed scan
                                          after tooling is cut costs far more
                                          than one before.
```

================================================================================

## 04  THE COPY BUTTON — SIGNAL SPEC

```
PRESS      One button, one label: "Copy." No long-press, no double-tap
           gesture in v1 — one clean action per the brief's intent.

LOCAL      Firmware debounces (~40ms), lights the status LED once, buffers
           a { event: "device.copy", ts, deviceId } record in flash.

REMOTE     On next sync window (see §05), the buffered record is POSTed to
           the LOT API and lands as a Log row — the same table every other
           LOT surface already writes to (src/server/models/log.ts: id,
           userId, text, event, metadata, context). It appears in the
           account's Log tab (route 'logs', src/client/components/ui/
           Layout.tsx:72) exactly like a Planner or Mood Check-In entry
           does today.

WHY THIS MATTERS  Every other Log-writing surface in the product is a
           software widget calling recordSignal() from inside an
           authenticated browser session (see docs/assembly/2026-06-30_
           LOT-assembly_widget-memory-engine-compression-loop.md). Station
           is the first Log writer that is not a browser session — it is a
           physical object with no login screen. §05 covers what that
           requires on the backend that does not exist yet.
```

================================================================================

## 05  LOT API CONNECTOR — WHAT EXISTS, WHAT MUST BE BUILT

```
EXISTS TODAY
  POST /api/quantum-intent/sync   Bulk-inserts signals into Logs via
                                   Log.bulkCreate. Auth: req.user — i.e. an
                                   authenticated cookie session. Cannot be
                                   called by a headless device.
  GET  /api/os/status,/os/config  Read-only OS surface (src/server/routes/
                                   os-api.ts) — good reference for response
                                   shape, no auth pattern to reuse for writes.
  Log model                       userId, text, event, metadata, context —
                                   exactly the shape Station needs to write.

MUST BE BUILT (new backend work, not yet present in this repo)
  Device pairing flow      A logged-in user visits a new "Devices" panel,
                            scans a QR code shown on Station's own screen
                            during first boot, and the phone/browser POSTs
                            a pairing request. Server mints a long-lived
                            device API key scoped to that one userId and
                            pushes it to Station over BLE or a temporary
                            captive WiFi AP — never typed in by hand.
  POST /api/public/device/log
                            Device-key-authenticated (not cookie-authenticated)
                            endpoint. Verifies the key, resolves userId,
                            writes Log.create({ event: 'device.copy', ... })
                            or Log.bulkCreate for a batch. Rate-limited per
                            device key.
  GET  /api/public/device/notify (long-poll or SSE)
                            Delivers the next queued pager-style line
                            ("Coffee time!") to a specific device key.
                            Reuses the same contextual-prompt generation
                            already live in ContextualPromptsWidget.tsx —
                            Station is a new *rendering surface* for prompts
                            that already exist server-side, not a new
                            prompt engine.
  Device key revocation      A user must be able to unpair/kill a Station
                            from their account settings — mirrors the
                            "kill switch" principle already written into
                            docs/technical/LOT-NODE-0-RIG-SPEC.md §04.
```

### COMPRESS PER SESSION (item 8)

Station should not stream every sensor tick to the server. Firmware buffers
locally and flushes once per "session" — defined as one wake-to-sleep cycle
or once per charge dock docking, whichever comes first — collapsing repeated
weather/IMU readings into a single summarized record before syncing. This
mirrors the Memory Engine's own compression philosophy (`intentionEngine`
buffering client-side before a periodic `sync`, per the assembly doc in §04)
rather than inventing a new pattern.

================================================================================

## 06  FIRMWARE — DOCUMENT SET (item 9, kept separate per item 11)

```
STACK        ESP-IDF (preferred over Arduino core for OTA + power-management
             maturity on ESP32-S3) or Arduino-ESP32 for the v1 prototype if
             it ships faster — decide after the first breadboard, not before.
OTA          Signed firmware updates pulled over the same device-key channel
             as §05. No update accepted without signature verification.
POWER        Deep-sleep between notification pushes and sensor polls;
             wake on button press, wake on scheduled poll, wake on Qi dock
             contact. Target: multi-day battery life on a 300–400mAh cell
             given the display is normally blank/idle.
DELIVERABLE  docs/hardware/station-01/FIRMWARE-MANUAL.pdf — flash
             instructions, pin map, sensor driver list, OTA process,
             factory-reset procedure. Written FOR a technician re-flashing
             a unit, not for the end customer.
```

## 07  SOFTWARE (companion) — DOCUMENT SET (item 10, kept separate per item 11)

```
SURFACE      A "Devices" panel inside the existing LOT-Computer web app
             (new client route, not a separate mobile app for v1) —
             pairing QR flow, device nickname, battery/signal status,
             unpair/kill switch.
DELIVERABLE  docs/hardware/station-01/SOFTWARE-MANUAL.pdf — how the web app
             talks to a Station, API reference for §05's new endpoints,
             troubleshooting a stuck pairing.
```

## 08  END-USER MANUAL (item 7)

```
DELIVERABLE  docs/hardware/station-01/USER-MANUAL.pdf — unbox, charge,
             pair, "what Copy does," what the camera is and is not used
             for, how to unpair/factory-reset. Plain language, no firmware
             internals — the audience is the person on the nightstand, not
             the technician from §06.
```

Per item 11, these three PDFs (firmware / software / user) stay as three
separate documents rather than one combined manual — different audiences,
different revision cadences (firmware ships updates far more often than the
user manual should need to change).

================================================================================

## 09  MANUFACTURING PLAN — PCBWAY AS THE ONE-STOP VENDOR

```
PCBWay was named directly in the brief (item 1) and, usefully, actually
covers every physical piece Station needs under one account: PCB
fabrication, PCBA/SMT assembly, CNC machining, and sheet-metal fabrication
in stainless steel — sources confirmed in §10. Using one vendor for board +
enclosure simplifies the 100-unit run to two coordinated POs instead of
three separate vendor relationships (board house, contract assembler,
metal shop).

PHASE 0   Breadboard proof — Waveshare ESP32-S3-Touch-LCD-1.28 dev kit +
          OV2640 breakout + BME280 breakout + a bare Qi receiver, wired on
          a bench. Prove the software loop (screen shows a pushed message,
          button press appears in the Log tab) before spending on tooling.
PHASE 1   Functional prototype in a 3D-printed shell (NOT stainless — save
          the CNC spend until the electronics stack is proven). 3–5 units.
PHASE 2   Custom carrier PCB, rev A, PCBWay PCB fab + PCBA. 10-unit pilot
          board run. First real stainless CNC shell — 5–10 units — to
          validate the Option-1 charging window and the two-piece fit.
PHASE 3   FCC/battery pre-compliance scan (see NRE table, §03). Fix
          whatever it flags. This gates Phase 4 — do not tool the 100-unit
          run before this passes.
PHASE 4   100-unit pilot run — PCBWay PCBA + CNC/sheet-metal stainless,
          coordinated delivery. This is the run item 13 refers to.
PHASE 5   LOT API connector endpoints (§05) built and load-tested against
          100 real devices syncing concurrently, before any unit ships to
          an actual user.
PHASE 6   Docs (§06–§08) finalized against the as-shipped firmware/software,
          not the Phase-0 prototype. Documentation written early goes stale
          fast in hardware — write it last, against the real unit.
```

================================================================================

## 10  SOURCES CONSULTED THIS SESSION

```
Internal (read directly):
  README.md, tailwind.config.js (brand color tokens)
  docs/wiki/LOT-WIKI-v83.md, v87.md (QIoT™, LOT® Station reference,
    Ecosystem Map)
  docs/corporate/LOT-FEATURE-INVENTORY-2026.md (Wearable Ecosystem, COSMO
    Hardware, Weather Station status)
  docs/technical/LOT-NODE-0-RIG-SPEC.md (house style + transparency
    principles this doc extends)
  docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-
    loop.md (recordSignal → sync → Log.bulkCreate pipeline)
  src/server/models/log.ts, src/server/routes/api.ts (:1082, :3661),
    src/server/routes/os-api.ts, src/client/components/ui/Layout.tsx:72,
    src/client/components/ContextualPromptsWidget.tsx

External (WebSearch, this session — verify all before RFQ):
  PCBWay SMT/PCBA quote page — pcbway.com/quotesmt.aspx
  PCBWay CNC machining (stainless steel) — pcbway.com/rapid-prototyping/
    cnc-machining/metal/stainless-steel/
  PCBWay sheet metal (stainless steel 304) — pcbway.com/rapid-prototyping/
    sheet-metal/metal/stainless-steel/Stainless-steel-304/
  Waveshare ESP32-S3-Touch-LCD-1.28 — waveshare.com/esp32-s3-touch-lcd-1.28.htm
  Arducam OV2640 module — arducam.com (OV2640 2MP DVP listing)
  Bosch BME280 / Adafruit breakout — digikey.com (BME280), adafruit.com/
    product/2652
  Generic Qi receiver + TP4056 modules — Amazon/Alibaba listings, this
    session's search results (indicative pricing only, not a quote)

NOT accessed — blocked by this session's egress proxy (EGRESS_BLOCKED on
  all three domains), must be read before finalizing brand/QA language:
  brand.lot-systems.com
  lot-systems.com/about
  institute.lot-systems.com/cqgs.html
```

================================================================================

## 11  OPEN ITEMS BEFORE ANY METAL IS CUT

```
1. Read brand.lot-systems.com, lot-systems.com/about, and the CQGS page —
   this session could not reach any of the three. Confirm exact finish
   names, wordmark placement rules, and whatever CQGS specifies (quality/
   certification framework, name unconfirmed from title alone) before
   Face A engraving and packaging copy are finalized.
2. Resolve §02's stainless/Qi conflict with Option 1 (charging window
   insert) or Option 2 (pogo-pin dock) — pick one before the CNC quote.
3. Camera trust: the brief specifies an outward-facing camera on a device
   that lives on a nightstand. Ship with a hardware (not firmware-only)
   shutter or a status LED wired directly to the camera's power rail —
   not to the MCU — so "the light is on" is a physical fact, not a
   software promise. This is the same transparency principle already
   written into the NODE-0 spec (§04 there): an action that cannot be
   seen did not happen.
4. Decide Path A vs. Path B (§02) explicitly with S-2 before quoting
   tooling — Path A ships in weeks on proven parts, Path B is a second,
   much more expensive program.
5. FCC/UN38.3 pre-compliance (§03 NRE table) must be scheduled, not
   assumed — this is the step most likely to blow the 100-unit timeline
   if left until after tooling.
6. Confirm device-pairing security model in §05 (BLE/captive-AP key
   provisioning) with whoever owns LOT auth before the first pairing
   endpoint is coded — this is the one new attack surface Station adds
   to the account system.
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION — STATUS: PLANNING, PRE-RFQ                   2026.08.26
================================================================================
