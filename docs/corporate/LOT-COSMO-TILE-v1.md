<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-TILE-v1
TITLE:    COSMO® TILE (CT-1) — Physical LOT Computer, Full Build Plan
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-25
VERSION:  1.0 — PLAN, BOM, ROADMAP (PRE-HARDWARE, DESIGN LOCK PENDING)
================================================================================

--------------------------------------------------------------------------------
00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON
--------------------------------------------------------------------------------

This document answers a direct build brief from S-2 (19 numbered requirements,
2026-08-25 session): build a hardware computer connected to the LOT site,
from plan through components list through roadmap. Three external sources
were named in the brief — brand.lot-systems.com, lot-systems.com/about, and
institute.lot-systems.com/cqgs.html. This session's network egress policy
blocks direct fetches to all three domains (confirmed at request time, not
assumed). This document instead builds on the local snapshots and derivative
documents already on record that carry that same material, per the
established pattern in this repo (CQGS-WHITE-PAPER-SNAPSHOT.md is itself a
local snapshot standing in for institute.lot-systems.com/cqgs.html for
exactly this reason). A future session with open egress to those three
domains should re-diff this document against the live pages before design
lock.

Read in full before writing a line of spec:

  docs/corporate/LOT_ROBOTICS_COSMO.md
    Defines COSMO® as "the robotics product line of LOT Systems, named
    after Kuzya Cosmo Marmeladov." Section "Revenue Path" already prices
    Phase 3, COSMO® Hardware, at $2,500-$5,000/unit + $100/month soul-sync
    subscription (2028-2029 timeline). This document's device is the
    notification-and-presence tier that sits in front of that roadmap —
    smaller, cheaper, buildable now, and the object that proves the
    hardware/software sync loop before the humanoid-adjacent COSMO® line
    is attempted.

  docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md
    Local snapshot of institute.lot-systems.com/cqgs.html. Row "Quantum
    Cube Hardware | Hardware feedback integration (Month 12+) | PLANNED"
    (Section VI) is the line item this device also answers. Section II
    names "bioelectric hardware, haptic feedback, nano-ceramic,
    piezoelectric" as the Quantum Cube's material line — CT-1 is a
    sibling object, not that object (see Section 01 below).

  docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md
    The prior hardware-spec precedent in this corpus, and the document
    whose format this one follows: reading log, numbered sections, a
    versioned roadmap with pass/fail gates, no claims beyond what a v0
    build can actually prove. Its own reading log (Section 00) already
    flagged the naming risk this document must respect: "COSMO® Cube —
    complete hardware computer design v1.0 (brave-lamport-t9z5u8 series)
    ... under Kuzya's COSMO® brand. That is a general-purpose hardware
    computer. CUBIQ™ is not that object." CT-1 is that general-purpose
    object's continuation — see Section 00a.

  docs/benchmark/LOT-MANIFEST.md
    Section 01 records a prior branch, brave-lamport-t9z5u8, BEST
    iteration, 14/14, 7 files, +2610 lines, summary "COSMO® Cube —
    complete hardware computer design v1.0." Section 05 notes that as of
    2026-06-27 the brave-lamport branch series no longer exists on the
    remote — the branch was pruned before its content reached master.
    No COSMO hardware spec document exists anywhere in this repository's
    current tree. That work was lost, not shipped. This session runs on
    branch claude/brave-lamport-tkbyla — the same cluster name,
    continued. See Section 00a.

  docs/corporate/LOT_Autonomous_AI_Server.md
    "LOT COMPUTER — AUTONOMOUS TRANSPARENT AI SERVER" already owns the
    name "LOT Computer" for the self-hosted inference rack (NODE-0).
    That is server-room hardware a person racks in a closet. This
    document's device is desk hardware a person looks at — the name
    COSMO® TILE (CT-1) is chosen specifically so the two are never
    confused in conversation or in the docs index (Section 01).

  This repository's README.md
    "LOT is a subscription service that distributes digital and physical
    necessities" — physical delivery is already core to the business
    model this device extends. "Memory Engine ... remembers every
    answer" and the QOS mode table are the software-side state this
    device surfaces physically (Section 04).

--------------------------------------------------------------------------------
00a // NAMING — CLOSING THE BRAVE-LAMPORT GAP
--------------------------------------------------------------------------------

Two prior hardware tracks exist in this corpus and must not collide:

  CUBIQ™ (LOT®)          A notification body. Cube, 45mm, single-axis
                          actuator, jumps. Documented, v0 locked
                          (LOT-CUBIQ-QUANTUM-CUBE-v0.md). Motion is its
                          notification language.

  COSMO® TILE (CT-1)     A notification + presence + capture computer.
                          Flat, two-piece stainless steel, screen +
                          camera + button. THIS document. Screen and
                          haptic-free stillness are its notification
                          language — the opposite design choice from
                          CUBIQ, deliberately: a desk needs one object
                          that moves and one that doesn't.

CT-1 is the general-purpose "hardware computer" the manifest already named
under brave-lamport (COSMO® Cube v1.0) before that branch was pruned
unmerged. This document does not reconstruct the lost cube geometry —
the brief that opened this session specifies a different physical form
(flat square, not a cube; Section 02) and a different feature set (camera,
screen, weather sensor, wireless charge; Section 03). CT-1 supersedes the
lost brave-lamport-t9z5u8 content by brief, not by diff — there is nothing
to diff against. The old manifest row should be marked SUPERSEDED by
LOT-COSMO-TILE-v1 the next time docs/benchmark/LOT-MANIFEST.md is
regenerated by the benchmark pipeline; this document does not hand-edit
that file, since its BEST/iteration/hash columns are pipeline-owned state
this session did not produce.

--------------------------------------------------------------------------------
01 // WHAT CT-1 IS AND WHAT IT IS NOT
--------------------------------------------------------------------------------

  CT-1 IS:
    - A flat, two-piece stainless steel object that sits on a desk,
      wirelessly charges, and does exactly two things: shows the
      operator one autonomous notification at a time from their LOT
      Index of Systems, and lets them acknowledge it with one button
      that writes back to their Log tab at lot-systems.com.
    - A physical extension of the QOS state already computed server-side
      (README.md Section "Quantum Operating System") — the device
      renders that state, it does not compute it.
    - A camera-equipped sensing node — the camera and the on-board
      weather/environment sensor are LOT-side signal INPUTS (ambient
      light, presence, local micro-climate), matching the existing
      Public Profile weather block (README.md, "Public Profile System")
      rather than inventing a new sensing category.
    - A 100-unit pilot run, PCB-first, contract-manufactured shell.

  CT-1 IS NOT:
    - A general-purpose computer the operator programs or installs apps
      on. It runs one firmware image with one job: poll, render, button,
      report. No app store, no third-party firmware.
    - A camera that streams or records continuously. See Section 03 —
      capture is event-triggered and local-first by default.
    - The COSMO® humanoid/robotics line described in
      LOT_ROBOTICS_COSMO.md (soul-sync, Benchmark-gated activation).
      CT-1 requires no Benchmark tier to operate. It is priced and scoped
      as an accessory to any LOT Usership tier, not a Purple+ reward.
    - A replacement for CUBIQ™. The two are designed to sit on the same
      desk (Section 00a).

  THE PRINCIPLE
    Ship the smallest true object first: one screen, one camera, one
    button, one wireless charge coil, talking to one API. Everything in
    this plan that is not that object is Section 12's roadmap, not v0's
    scope.

--------------------------------------------------------------------------------
02 // PHYSICAL FORM
--------------------------------------------------------------------------------

  FOOTPRINT          40mm × 40mm flat square ("the flat silver square")
  TARGET HEIGHT       5mm — see HEIGHT BUDGET below; this is the single
                      hardest constraint in the whole brief and is
                      treated honestly, not rounded away.
  BODY                Two-piece stainless steel shell, precision-formed
                      (deep-drawn or CNC-milled from 316L bar/sheet,
                      PCBWay metal-parts service — Section 09):
                        FACE A (top)     Polished mirror stainless
                                          steel, no seams, no ports —
                                          the "resting" face when the
                                          notification queue is empty.
                        FACE B (bottom)  Instrumented face — cutouts for
                                          camera lens, screen window,
                                          and the Copy button. This is
                                          the face the operator interacts
                                          with; Face A is the face shown
                                          to the room.
                      The two shells clamshell around the internal PCB
                      stack and are joined by four countersunk M1.4
                      screws into stainless steel standoffs, not
                      adhesive — the device must be openable for repair
                      and for the 100-unit pilot's inevitable rework.
  CHARGE INTERFACE    Wireless (Qi-class inductive) through Face A. The
                      charging puck is a second small object (not this
                      device) — CT-1's coil sits directly behind the
                      polished face, so the "resting" side is also the
                      charging side, matching the CUBIQ precedent
                      (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02: "The
                      charging pad IS the table").
  FINISH              Face A: mirror polish (#8). Face B: bead-blasted
                      matte, so screen glare and fingerprints on the
                      working face read as "instrument," not "jewelry."

  HEIGHT BUDGET (why 5mm is a target, not a v0 guarantee)
    A 4×4cm shell at 5mm total height must fit, stacked: two steel skins
    (≈0.3mm each formed sheet = 0.6mm), a rigid-flex PCB (≈0.8mm), an
    SoC + camera module + display module side-by-side rather than
    stacked (chip-on-board camera modules run 1.5-2.5mm thick alone), a
    wireless-charge receiver coil (≈0.5mm), and either a solid-state
    supercapacitor buffer or an ultra-thin solid-state/LiPo pouch cell
    if any off-charger runtime is required at all. That stack does not
    close at 5mm with a display AND a camera both present at today's
    commodity component thicknesses.
    RESOLUTION: v0 ships at a reference 9mm height (still described
    externally as "the flat silver tile," not "the flat silver cube")
    to prove the electronics stack and the notification loop end to end.
    v1 re-tools around thinner chip-on-board camera modules and a
    rigid-flex-only PCB (no connectors) to close the gap toward the
    original 5mm brief. This is the same discipline CUBIQ v0 applied to
    mass budget — state the target, ship the provable version first,
    name the gap instead of hiding it. See Section 12, v1 gate.

--------------------------------------------------------------------------------
03 // ELECTRONICS — SENSING & OUTPUT STACK
--------------------------------------------------------------------------------

  COMPUTE      ESP32-S3 module (WROOM-1 class) — WiFi + BLE, dual-core,
               enough headroom to run a TLS client against the LOT API,
               drive a display, and service a camera, all off one chip.
               Chosen because it is the same class of "AI-grade
               off-the-shelf sensor host" already implied by item 15 of
               the brief — no custom silicon, no NRE risk for a
               100-unit run.
  CAMERA       Small off-the-shelf CMOS module (OV2640/OV5640 class,
               fixed-focus, ≤2.5mm z-height). Event-triggered capture
               only — fires on: (a) a manual gesture near the device
               (proximity/light-change heuristic, no continuous stream),
               or (b) an explicit request from the LOT API ("send a
               presence frame"). No local storage beyond the current
               frame buffer; every captured frame is either transmitted
               to the operator's own LOT account over TLS or discarded,
               never persisted to a third party.
  SCREEN       Small square or round TFT/OLED (≈1.3", e.g. ST7789 240×240
               or GC9A01 round 240×240 class) behind the Face B window.
               Single job: render one line of autonomous-notification
               text at a time, LOT terminal-grid typography (matches the
               "no hedging, density over sprawl" response grammar named
               in CQGS-WHITE-PAPER-SNAPSHOT.md, Section III). Example
               payload the screen must render correctly on day one:
               "Coffee time!" — short, imperative, timestamped, no chrome.
  BUTTON       Single mechanical tactile button on Face B, labeled COPY.
               One function only (Section 05) — this is not a
               multi-function button and does not get a long-press menu
               in v0.
  WEATHER
   SENSOR      BME280-class combined temperature/humidity/pressure
               sensor — the same three fields the Public Profile weather
               block already displays (README.md), now sourced locally
               at the operator's desk instead of a geocoded API lookup.
               Local reading and remote (geocoded) reading are both sent
               to the LOT API; the platform decides which is authoritative.
  CHARGE       Qi-class wireless receiver coil + PMIC (e.g. BQ51013B
               class), charging a small solid-state or thin-format LiPo
               buffer sized only for graceful-shutdown runtime (seconds
               to low minutes) — CT-1 is designed to live on its
               charging puck continuously, not to run cordless for hours.
               This keeps the height budget (Section 02) and the 100-unit
               BOM (Section 10) both closer to sane than a full-day
               battery would allow.
  INDICATOR    None beyond the screen itself — no separate status LED.
               The screen going dark IS the "no notification pending"
               state; this avoids the CUBIQ anti-feed-thesis problem
               (a blinking light is a screen substitute) in the opposite
               direction — here the screen already exists, so a second
               light source would just be noise.

--------------------------------------------------------------------------------
04 // THE NOTIFICATION LANGUAGE — PAGER-LIKE, ONE LINE, AUTONOMOUS
--------------------------------------------------------------------------------

CT-1's screen is deliberately pager-grade, not smartwatch-grade: one
short autonomous message at a time, no scroll, no menu, no reply typed
on-device. The AI decides WHAT and WHEN (mirrors LOT-CUBIQ-OPERATOR.md
Section 04, "AI-Driven Physical Product Delivery" — the same operator
logic, applied to a message instead of a shipped object).

  EXAMPLE PAYLOADS (server → device, over the LOT API connector, Section 06)
    "Coffee time!"                — QOS `maintenance` mode, low signal
                                      density, a small nudge toward a
                                      known ritual (README.md Memory
                                      Engine example: "Loose leaf ritual")
    "Badge unlocked."             — mirrors CUBIQ's HOP/LEAP gesture
                                      class, rendered as text instead of
                                      motion — the two devices can fire
                                      on the same signal, differently
    "Weather turning — bring a layer."   — local BME280 + remote
                                      geocoded weather cross-check
                                      (Section 03) surfaced back out
    "Memory question ready."      — same trigger CUBIQ's THE NUDGE
                                      answers with a tremor; CT-1
                                      answers with one rendered line

  RENDER RULE
    One message on screen at a time. A new message replaces the old one
    only after the operator has acknowledged it (Section 05) or after a
    configurable timeout. The device never queues a scrolling list —
    that would turn a pager into a feed, which is the exact anti-pattern
    the platform's own philosophy names (README.md: "From surveillance
    → TO sovereignty ... From metrics → TO meaning").

--------------------------------------------------------------------------------
05 // THE COPY BUTTON — SIGNAL LOOP BACK TO THE LOG TAB
--------------------------------------------------------------------------------

Pressing COPY does two things in one action:

  1. LOCAL ACK      The currently displayed message is marked
                     acknowledged on-device; the screen clears (or
                     advances to the next queued message, if any).
  2. REMOTE SIGNAL   The device POSTs an acknowledgment event to the LOT
                     API connector (Section 06), which writes one entry
                     to the operator's Log tab at lot-systems.com —
                     the same Log tab already live in the product
                     (LOT_PRODUCT_BENCHMARK.md references a "Log tab
                     click area" fix, confirming the tab exists in the
                     current app). The entry records: which notification
                     was shown, the device's local timestamp, and that
                     it was acknowledged physically rather than in-app.

  WHY "COPY" AND NOT "OK" OR A CHECKMARK
    The label reflects the actual mechanism, not a generic dismiss: the
    operator is copying the notification's existence from the physical
    object into the permanent, browsable Log record at
    lot-systems.com — the desk object is ephemeral (one line, then
    gone), the Log tab is the durable copy. This is the same
    ephemeral-physical / durable-digital split CUBIQ documents for its
    own telemetry loop (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 05).

--------------------------------------------------------------------------------
06 // THE LOT API CONNECTOR
--------------------------------------------------------------------------------

CT-1 is a thin client. All intelligence — what to show, when, session
compression — lives server-side, reachable through one API surface:

    LOT PLATFORM (lot-systems.com)
         │
         ├── GET  /api/device/:deviceId/next     device polls (or holds
         │                                        a long-lived socket)
         │                                        for the next queued
         │                                        notification
         ├── POST /api/device/:deviceId/ack       COPY button fires this
         │                                        → writes the Log tab
         │                                        entry (Section 05)
         ├── POST /api/device/:deviceId/telemetry  local weather reading
         │                                        + optional presence
         │                                        frame (Section 03)
         └── POST /api/device/:deviceId/pair       one-time pairing —
                                                    device ↔ operator's
                                                    LOT account, matches
                                                    the existing
                                                    JWT/cookie session
                                                    model (README.md
                                                    "Session management")

  SESSION COMPRESSION (item 8 of the brief)
    Every polling cycle, the connector does not hand the device raw
    Index-of-Systems state — it hands down ONE compressed instruction:
    a single string payload (≤64 chars, pager-grade, Section 04) plus a
    priority flag. All the reasoning that produced that one line — QOS
    mode, badge state, memory-question readiness, weather delta — is
    computed and discarded server-side per cycle. The device holds no
    session history; each poll is stateless from the device's point of
    view, and the SERVER's session compression is what turns a rich,
    stateful Index of Systems into something a $6 microcontroller can
    render without ever needing to understand any of it. This is the
    same "compress every session" instinct visible in the platform's own
    Memory Engine design (README.md: builds a Memory Story over time,
    but the device only ever needs today's one line).
    THE PRINCIPLE: the intelligence stays in the cloud; the object stays
    dumb, cheap, and repairable.

  AUTH
    Device pairing issues a long-lived, device-scoped API token (not the
    operator's own session cookie) — revocable independently from the
    account itself, so a lost or stolen CT-1 unit can be cut off without
    forcing the operator to log out of lot-systems.com everywhere else.

--------------------------------------------------------------------------------
07 // FIRMWARE — SEE SEPARATE DOCUMENT
--------------------------------------------------------------------------------

Full firmware architecture, build toolchain, OTA update plan, and the
poll/render/button state machine are specified in a dedicated document,
per item 9 and item 11 of the brief (firmware and software must be
separate documents, not folded into this plan):

    docs/hardware/COSMO-TILE-FIRMWARE.md

--------------------------------------------------------------------------------
08 // SOFTWARE — SEE SEPARATE DOCUMENT
--------------------------------------------------------------------------------

The server-side connector (routes, auth, Log-tab write path, session
compression job) that the firmware talks to is specified separately,
per item 10 and item 11 of the brief:

    docs/hardware/COSMO-TILE-SOFTWARE.md

--------------------------------------------------------------------------------
09 // MANUFACTURING PLAN — PCBWay, 100-UNIT PILOT RUN
--------------------------------------------------------------------------------

  WHY PCBWAY (item 1 of the brief)
    One vendor covers three of this project's hardest lines in one
    account: PCB fabrication + SMT assembly (the compute/camera/display
    stack, Section 03), CNC/sheet-metal parts (the two stainless steel
    shells, Section 02), and low-volume rapid prototyping before
    committing to the 100-unit run. Consolidating vendor risk onto one
    shop for a first pilot run is the right trade for a 100-unit order —
    split-vendor coordination overhead is not worth it below ~500 units.

  PILOT RUN STRUCTURE
    STAGE 1   Bare PCB + stencil, 10 pcs         — bring-up, hand-solder
    STAGE 2   PCB + SMT assembly, 10 pcs         — first fully-populated
                                                    boards, firmware
                                                    bring-up (Section 07)
    STAGE 3   Stainless shells, 10 pairs         — CNC or deep-draw
                                                    sample, fit-check
                                                    against Stage 2 boards
    STAGE 4   Full pilot, 100 units              — PCB + SMT + shells +
                                                    final assembly, gated
                                                    on Stage 1-3 passing
                                                    (Section 12, v0 gate)

  SHELL PROCESS NOTE
    316L stainless, 40×40mm, two pieces per unit. Below ~500 units, CNC
    milling from bar stock is more economical per-unit than tooling a
    deep-draw die (die tooling amortizes past several thousand units) —
    the 100-unit pilot should be quoted CNC, with deep-draw evaluated
    only if a production run beyond the pilot is approved.

--------------------------------------------------------------------------------
10 // COMPONENTS BUYING LIST — SEE SEPARATE DOCUMENT
--------------------------------------------------------------------------------

Full bill of materials, supplier list, and 100-unit cost rollup:

    docs/hardware/COSMO-TILE-BOM.md

  HEADLINE NUMBER (detail in the BOM doc)
    Target landed BOM cost per unit at 100-unit pilot volume: roughly
    $18-$32 in electronics + $8-$18 in stainless shell machining,
    before assembly labor and NRE (tooling, stencils, fixtures) are
    amortized across the run. This is a pilot-run planning number, not a
    vendor quote — the BOM document flags it explicitly as such and
    names exactly which lines need a real PCBWay/Mouser/DigiKey quote
    before it becomes one.

--------------------------------------------------------------------------------
11 // DOCUMENTATION DELIVERABLES
--------------------------------------------------------------------------------

Per the brief's requirement that firmware, software, and manuals are
kept as separate documents, and that the manual specifically results in
a PDF:

    docs/corporate/LOT-COSMO-TILE-v1.md        This document — plan,
                                                 form factor, roadmap
    docs/hardware/COSMO-TILE-BOM.md             Components buying list
    docs/hardware/COSMO-TILE-FIRMWARE.md        Firmware architecture
    docs/hardware/COSMO-TILE-SOFTWARE.md        LOT API connector spec
    docs/hardware/COSMO-TILE-MANUAL.md          Operator manual (source)
    docs/hardware/pdf/COSMO-TILE-MANUAL.pdf     Operator manual (PDF)

--------------------------------------------------------------------------------
12 // ROADMAP — v0 → v1 → v2 → v3
--------------------------------------------------------------------------------

  v0 — THE FLAT TILE (THIS DOCUMENT)
    9mm reference height (Section 02), ESP32-S3 + camera + screen +
    button + weather sensor + Qi charge receiver, one-line pager
    notifications (Section 04), COPY → Log tab write-back (Section 05).
    10-unit Stage 1-3 bring-up, 100-unit Stage 4 pilot (Section 09).
    GATE: 100/100 pilot units power on, pair, and complete a real
    poll → render → COPY → Log-tab-write round trip against a live
    lot-systems.com account before v0 is declared closed.

  v1 — THE 5mm CLOSE
    Re-tools the internal stack (chip-on-board camera, rigid-flex-only
    PCB, thinner display module) to close the height gap named honestly
    in Section 02, from 9mm to the original 5mm brief.
    GATE: production sample hits ≤5.5mm total height with camera,
    screen, and Qi receiver all present and functional — 9/10 units
    across two build batches.

  v2 — MULTI-DEVICE PRESENCE MESH
    Multiple CT-1 units on one operator's account (desk + nightstand +
    kitchen) with the API connector (Section 06) routing each
    notification to whichever unit is physically nearest the operator,
    using the camera/proximity heuristic from Section 03 as a coarse
    presence signal across the mesh, not just a single-device trigger.
    GATE: correct-device routing in 9/10 trials across a 3-unit mesh.

  v3 — CUBIQ INTEROP (RESEARCH TRACK, NOT A BUILD MILESTONE)
    A shared signal bus so CUBIQ's motion vocabulary
    (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04) and CT-1's text vocabulary
    (Section 04, this document) can be composed per-notification instead
    of chosen once at setup — e.g. THE NUDGE (felt) paired with a
    one-line render (read) for the same signal. No mechanism is
    committed here; this is recorded so v0-v2 API design (Section 06)
    does not foreclose a future shared bus.

--------------------------------------------------------------------------------
13 // BRAND
--------------------------------------------------------------------------------

COSMO® TILE                   The object
CT-1                           The v0/v1 model designation
LOT®† COSMO® TILE              The combined mark, matching the
                               LOT®†CUBIQ® precedent
                               (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 08)

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-TILE-v1
================================================================================
