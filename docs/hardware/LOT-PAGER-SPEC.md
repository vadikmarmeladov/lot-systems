================================================================================
LOT SYSTEMS CORPORATION
LOT PAGER — HARDWARE MASTER SPECIFICATION
DOCUMENT: LOT-PAGER-SPEC / v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-01
SOURCE:   S-2 19-point hardware build logic, brand.lot-systems.com,
          institute.lot-systems.com/cqgs.html, LOT-CUBIQ-VISION.md
================================================================================

--------------------------------------------------------------------------------
00 // WHAT THIS DOCUMENT IS
--------------------------------------------------------------------------------
This is 1 of 6 documents. Per requirement #11 (separate documents), the plan
is split so firmware, software, and BOM each stand alone:

    LOT-PAGER-SPEC.md              this file — concept, industrial design, roadmap
    LOT-PAGER-BOM.md               components buying list, links, 100-unit costing
    LOT-PAGER-FIRMWARE.md          on-device firmware architecture
    LOT-PAGER-API-CONNECTOR.md     backend + LOT API integration (new work required)
    pdf/LOT-PAGER-MANUAL.pdf       generated user + assembly manual
    docs/benchmark/LOT-SR-20260701-01.md   this session's report

--------------------------------------------------------------------------------
01 // WHAT THE PAGER IS
--------------------------------------------------------------------------------
LOT Pager is a physical, silent, one-line notification object. It receives
ambient text from the LOT Memory Engine ("Coffee time.") and shows it on a
small screen — nothing to open, nothing to scroll, no app. It is the physical
form of the CUBIQ® "anti-feed" thesis (LOT-CUBIQ-VISION.md #01) and the first
build against the CQGS "Quantum Cube Hardware" line item, which the CQGS
white paper snapshot lists as PLANNED for Month 12+
(docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md, section VI).

One button. One line of text. One gesture to record it. That is the entire
interaction surface — deliberately smaller than a phone, smaller than a
smartwatch, closer to a 1990s pager than to a screen you'd doomscroll.

    IMPORTANT — BRAND TENSION TO RESOLVE:
    The live product copy at src/client/components/About.tsx:4081 states the
    house philosophy explicitly: "Context Over Notification — No push. No
    alert. No interruption." A pager that pushes text conflicts with this on
    its face. Resolution adopted for this spec: the Pager does not buzz,
    beep, or vibrate — it has no alert transducer at all. The screen updates
    silently and only shows the newest line when glanced at (e-paper-like
    persistence, or an OLED that dims after N seconds). It surfaces; it does
    not interrupt. This preserves the doctrine while still being "pager-like"
    in form factor and one-line brevity.

--------------------------------------------------------------------------------
02 // INDUSTRIAL DESIGN — TWO-PART STAINLESS STEEL BODY
--------------------------------------------------------------------------------
Requirements #3, #4, #17, #18.

    FORM:   40mm x 40mm x 5mm flat silver square puck. Two shells.

    BACK SHELL   — polished stainless steel, mirror finish, no seams, no
                   ports visible. A clean reflective face — sits on a desk
                   like a coaster, doubles as a quick mirror check.

    FRONT SHELL  — same stainless steel, brushed (not polished, to cut
                   glare on the display), with three cutouts:
                     - camera aperture (small round window, ~3mm)
                     - display window (the message surface)
                     - one button, labeled COPY

    Shells meet at a friction-fit or magnetic seam around the perimeter —
    no visible screws on either face. Assembly is from the inside during
    manufacturing (see LOT-PAGER-BOM.md for enclosure sourcing).

    ENGINEERING FLAG — 5mm HEIGHT IS THE HARDEST CONSTRAINT IN THIS SPEC:
    Two 0.3–0.4mm stainless shells leave ~4.2–4.4mm of internal Z-height for
    everything: PCB, MCU, display stack, camera module, battery, and a Qi
    receiver coil, stacked. This is tighter than most smartwatches (typically
    8–11mm). It is achievable only if every part is selected for thinness
    first, function second:
      - flex or rigid-flex PCB, not rigid FR4 (saves ~0.6mm and allows the
        board to wrap around the button boss)
      - a bare COG/COF OLED module (glass-on-flex, no plastic bezel) —
        candidates in LOT-PAGER-BOM.md run 1.0–1.5mm thick
      - the thinnest camera module available (Arducam OV2640 Mini board
        specified in BOM is ~2.3mm at the sensor board, before lens height —
        lens stack adds height that must be checked against datasheet before
        layout lock)
      - a sub-4mm LiPo pouch cell (Adafruit 150mAh cell is 3.8mm — see BOM)
      - a thin Qi receiver coil (~0.5mm) — but see the charging note below
    REALISTIC FALLBACK: if Phase 0 prototyping (roadmap below) shows 5mm is
    not achievable with acceptable battery life and camera image quality,
    the fallback is 6–8mm — still a flat puck, still "silver square," a
    tolerance the roadmap explicitly budgets time to test rather than
    discover late.

    WIRELESS CHARGING THROUGH STEEL — SECOND HARDEST CONSTRAINT:
    Stainless steel attenuates and eddy-current-heats under an inductive
    (Qi) field — a solid steel enclosure on both faces will not charge
    reliably or safely. This must be designed around, not discovered at
    assembly: either (a) a non-metal window (glass, ceramic, or engineering
    plastic insert) is machined into the BACK shell directly behind the coil,
    or (b) the coil sits behind the FRONT shell's brushed face instead, with
    the display/camera cutouts routed around it. Option (a) preserves "one
    side fully polished steel" (#17) only if the window is small and centered
    — flagged as a design decision for Phase 0, not assumed solved.

--------------------------------------------------------------------------------
03 // ELECTRONICS — WHAT'S INSIDE
--------------------------------------------------------------------------------
Full parts + links + costing in LOT-PAGER-BOM.md. Summary:

    MCU        ESP32-S3-WROOM-1     WiFi 2.4GHz + BLE 5, camera DVP interface,
                                    deep-sleep modes for battery life
    DISPLAY    0.96" mono OLED, SPI  one line of text, low power, thin glass
    CAMERA     OV2640 (Arducam Mini) 2MP, QR/pairing scan + presence capture —
                                    not a photography-grade sensor
    WEATHER    Bosch BME280          temp / humidity / pressure — feeds the
                                    weather-mood correlation OS_API.md already
                                    surfaces in Insights (weather-mood type)
    BUTTON     E-Switch TL3780-class  ultra-low-profile SMD tactile, <1mm
    CHARGING   Qi receiver (BQ51013B-class) + thin coil, external Qi puck
                                    dock as the charging accessory (#12, #19)
    BATTERY    LiPo pouch, ~150mAh, 3.8mm thick
    PCB        Flex-rigid, fabricated + assembled by PCBWay (#01, #04 below)

--------------------------------------------------------------------------------
04 // MANUFACTURING — PCBWAY, 100-UNIT PILOT RUN
--------------------------------------------------------------------------------
Requirements #1, #13.

PCBWay is used for both the PCB and the metal, so one vendor carries DFM
across board and enclosure:

    1. Bare PCB fab            flex-rigid, 2–4 layer         pcbway.com
    2. SMT assembly (PCBA)     turnkey or kitted             pcbway.com/quotesmt.aspx
    3. CNC stainless shells    SS304 or SS201, brushed +      pcbway.com CNC machining,
                               polished finish per shell      stainless steel service

Order of operations for the pilot batch of 100:
    gerbers + BOM + pick-and-place file → PCBWay DFM review → stencil → SMT
    reflow → AOI (automated optical inspection) → functional test on a jig
    → hand-mate PCB into front shell → battery + Qi coil → seal against back
    shell → final functional + charge test → box.

100 units is sized as a pilot: enough to dogfood internally, seed a small
S-2 cohort, and validate the assembly jig — not a retail launch quantity.
Full costing (PCB, PCBA, steel, and per-unit blended cost at 100) is in
LOT-PAGER-BOM.md section 04.

--------------------------------------------------------------------------------
05 // THE NOTIFICATION LOOP — HOW "COFFEE TIME." GETS TO THE SCREEN
--------------------------------------------------------------------------------
Requirement #2.

    LOT Memory Engine / compression loop (existing, see
    docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md and the
    2026-06-30 widget→memory session) already reduces a day of signals to
    short text. The Pager adds one more compression step: from a paragraph
    of insight down to a single imperative line under ~24 characters.

    TRANSPORT — none of this exists server-side today (confirmed by direct
    grep of src/server: no APNs/FCM/web-push/WebSocket dependency anywhere;
    the only real-time channel is an authenticated SSE stream at
    GET /api/sync for browser tabs, not for a headless device). This is
    greenfield backend work, detailed in LOT-PAGER-API-CONNECTOR.md:
      - primary: WebSocket (wss://) — device holds one open connection,
        server pushes a line the moment the nudge generator produces one
      - fallback: HTTPS long-poll every 60s if the socket drops (matches the
        "Hybrid Mode" pattern already sketched, aspirationally, in
        docs/corporate/LOT-TERMINAL-SYNC.md)

    DISPLAY BEHAVIOR — newest line replaces the old one; the screen dims to
    off after ~30s idle (OLED burn-in + battery); pressing COPY both records
    and clears.

--------------------------------------------------------------------------------
06 // AI-GRADE SENSOR SELECTION
--------------------------------------------------------------------------------
Requirement #15 ("AI grade off-the-shelf sensors").

Interpreted literally: use commercially available parts (no custom silicon —
there is no volume to justify it at 100 units), but do not lock a part number
from a datasheet skim alone. Every sensor/camera/charging-IC candidate in the
BOM is scored before commit, in the spirit of CQGS's Bioethics Index (a
graded signal, not a checkbox — CQGS-WHITE-PAPER-SNAPSHOT.md section II):

    SENSOR GRADE INDEX (SGI) — 0 to 100, four axes, 25 points each:
      ACCURACY      datasheet-stated error vs. our use case's tolerance
      POWER         idle + active draw vs. the ~150mAh budget
      FOOTPRINT     mm² + z-height vs. the 5mm stack budget (section 02)
      AVAILABILITY  lead time + stock depth at 100-unit + reorder quantities

Candidate scoring for the parts chosen in this spec is carried in
LOT-PAGER-BOM.md section 05 — this keeps the grading auditable and separate
from the buying list itself.

--------------------------------------------------------------------------------
07 // THE COPY BUTTON → LOG TAB
--------------------------------------------------------------------------------
Requirement #16.

A real, working endpoint already exists for this: `POST /api/logs`
(src/server/routes/api.ts:1414–1438), body `{ text, event?, metadata? }`,
read back by the Log tab via `GET /api/logs` (api.ts:1020–1103). Pressing
COPY should POST the currently displayed line with `event: "device_copy"`
and the device's ID in `metadata`. It shows up in the Log tab immediately,
the same as any other log entry — no new read path needed.

    BLOCKER: `/api/logs` currently requires a full authenticated session
    (JWT cookie, verified in src/server/server.ts:206–241) — there is no
    device-token or API-key path in the codebase today. A hardware device
    cannot hold a browser session cookie. The device-pairing + token scheme
    needed to close this gap is specified in LOT-PAGER-API-CONNECTOR.md —
    it is the single largest piece of new backend work this project requires.

--------------------------------------------------------------------------------
08 // SEPARATE DOCUMENTS (Requirement #11)
--------------------------------------------------------------------------------
    LOT-PAGER-SPEC.md              — this document
    LOT-PAGER-BOM.md               — components, links, 100-unit costing
    LOT-PAGER-FIRMWARE.md          — on-device firmware
    LOT-PAGER-API-CONNECTOR.md     — backend + LOT API integration
    pdf/LOT-PAGER-MANUAL.pdf       — generated PDF manual (assembly + user)

--------------------------------------------------------------------------------
09 // ROADMAP
--------------------------------------------------------------------------------
```
PHASE 0   De-risk              Weeks 1–2
          Order 3 candidate sets (display / camera / Qi coil). Hand-wire an
          oversized 60x60x10mm "breadboard puck" to prove the firmware loop
          before committing to the 5mm target. Resolve the charging-through-
          steel window decision (section 02).

PHASE 1   Board bring-up       Weeks 3–6
          KiCad layout (flex-rigid). Submit 5-piece prototype PCBA order to
          PCBWay. Bring up firmware: display render, button IRQ, WiFi join,
          BME280 read, camera capture.

PHASE 2   Backend (greenfield) Weeks 7–8
          Device pairing endpoint + device-token auth branch alongside the
          existing session-cookie hook. /api/device/notifications (WS +
          long-poll fallback). Nudge generator reusing Memory Engine
          compression output. Full detail in LOT-PAGER-API-CONNECTOR.md.

PHASE 3   Enclosure            Weeks 9–10
          CNC stainless prototype x5 from PCBWay's metal service. Fit-check
          against the PCB. Tune Qi coil placement against the charging
          window from Phase 0.

PHASE 4   Integration          Weeks 11–12
          5 hand-built units. Dogfood with S-2. Fix loop on whatever the
          5mm/charging tradeoffs actually cost in practice.

PHASE 5   Pilot run            Weeks 13–16
          100-unit PCBA order + CNC shells + final assembly + functional
          test jig. PDF manuals finalized (pdf/LOT-PAGER-MANUAL.pdf). Ship
          to the pilot cohort.
```

--------------------------------------------------------------------------------
10 // OPEN RISKS
--------------------------------------------------------------------------------
    - 5mm total height: the single biggest physical risk (section 02).
    - Qi charging through stainless steel: requires a non-metal window or
      coil relocation (section 02) — not solvable by part choice alone.
    - Battery life vs. an always-listening WiFi radio: deep-sleep + WS
      reconnect strategy needs real-world measurement in Phase 1.
    - Regulatory: a pre-certified ESP32-S3 module (as specified) carries
      through most of the FCC/CE module certification; the finished
      enclosure and antenna placement inside a metal shell still needs its
      own RF pattern check — steel bodies attenuate WiFi/BLE range and the
      antenna cutout/window must be sized for it, not assumed free.
    - No push infrastructure exists server-side (section 05) — this is new
      infrastructure, not a config flip.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-PAGER-SPEC
================================================================================
