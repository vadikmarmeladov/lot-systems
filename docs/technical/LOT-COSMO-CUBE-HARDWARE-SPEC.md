<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
COSMO® CUBE — MODEL S1 "SIGNAL TILE"
HARDWARE SPECIFICATION v1.0
================================================================================

DOCUMENT    LOT-COSMO-CUBE-HARDWARE-SPEC
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
DATE        2026-07-05
STYLE       TERMINAL GRID
STATUS      DESIGN FREEZE CANDIDATE — v1.0 (pre-prototype)
RELATED     LOT-COSMO-CUBE-BOM.md · LOT-COSMO-CUBE-FIRMWARE.md ·
            LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md · LOT-COSMO-CUBE-ROADMAP.md ·
            docs/corporate/LOT_ROBOTICS_COSMO.md (business thesis) ·
            docs/corporate/LOT-CUBIQ-OPERATOR.md §04 (physical extension arc)

================================================================================
00 // WHAT THIS IS
================================================================================

The first physical SKU in the COSMO® hardware line. Not the robot described
in LOT_ROBOTICS_COSMO.md — this is the smaller, nearer-term object: a
desk-resident companion tile that receives ambient, AI-authored signals from
the operator's lot-systems.com Index of Systems and writes one signal back —
a single "Copy" press that pushes the moment into the operator's LOG tab.

It is the physical face of the CUBIQ™ (docs/corporate/LOT-CUBIQ-OPERATOR.md
§04 "AI-Driven Physical Product Delivery"), arriving earlier and smaller than
that document's subscription-box model: instead of a periodic care package,
it is a standing, always-present object on the operator's desk.

    ONE OBJECT. ONE SCREEN LINE. ONE BUTTON. ONE SIGNAL BACK TO THE LOG.

This is a companion device, not a computer replacement — it has no keyboard,
no general app runtime, and no ambition to be one. It does three things:
displays a short AI-authored line, takes a photo on request, and copies the
current moment into the operator's permanent record.

================================================================================
01 // WHY "CUBE" ON A FLAT TILE
================================================================================

The brief calls for a flat square, not a cube. "Cube" is retained as the
LOT/COSMO product-line name — the existing self-assembly log already uses
"Quantum Cube" for a non-cubic state widget (LOT-MANIFEST.md §02, entries
2026-05-03 / 2026-05-04), and CUBIQ™ itself is a session shape, not a
literal geometry. COSMO® Cube is the hardware line name; Model S1 "Signal
Tile" is this SKU's physical description. Future SKUs in the line (a desk
dock, a larger COSMO® robot per LOT_ROBOTICS_COSMO.md) may take other
shapes under the same product line.

================================================================================
02 // FORM FACTOR
================================================================================

    FOOTPRINT        40mm x 40mm (4cm x 4cm), flat square
    TARGET HEIGHT    5mm overall, two-piece stainless steel body
    WEIGHT           ~35-45g (stainless-dominant mass)
    FINISH           Face A: mirror-polished 316L stainless steel
                     Face B: bead-blasted stainless steel (matte, fingerprint-
                              resistant, matches camera bezel)
    MOUNT            Passive — sits flat on a desk on 3 sub-1mm silicone feet
                     bonded to Face A's underside rim (feet sit outside the
                     charging window, see §04)

    ┌────────────────────────────────────┐   ┌────────────────────────────────────┐
    │  FACE A — POLISHED STAINLESS       │   │  FACE B — INTERACTION              │
    │  (point 17)                        │   │  (point 18)                        │
    │                                     │   │                                     │
    │        ·  laser-etched             │   │   ┌──────┐                          │
    │           COSMO® mark, center       │   │   │camera│  top-center, 3mm bezel   │
    │        ·  ceramic charging window   │   │   └──────┘                          │
    │           (see §04)                │   │                                     │
    │        ·  no seams, no ports        │   │   ┌────────────────┐               │
    │                                     │   │   │   screen        │  center       │
    │                                     │   │   │   (see §05)     │               │
    │                                     │   │   └────────────────┘               │
    │                                     │   │                                     │
    │                                     │   │        ( ● )  COPY button, bottom   │
    │                                     │   │               center (see §07)     │
    └────────────────────────────────────┘   └────────────────────────────────────┘

Two-piece construction (point 3): Face A and Face B are separate CNC-machined
316L stainless steel shells that clamshell around the internal stack
(PCB, battery, coil, camera, display) and are joined by an internal snap-rib
plus 4 M1.2 stainless screws recessed into Face B (accessible only with the
unit opened — no visible fasteners from either exterior face). A single
silicone gasket at the seam gives light splash resistance (not submersible).

================================================================================
03 // THE 5mm QUESTION — STATED AS AN OPEN ENGINEERING RISK
================================================================================

5mm total height, in two stainless shells, containing a camera, a screen, a
battery, a wireless-charging coil, an MCU, and a button, is thinner than an
Apple AirTag (8mm) and close to two stacked credit cards (1.5mm). This spec
does not paper over that. Two configurations are defined; the roadmap
(LOT-COSMO-CUBE-ROADMAP.md §03) tracks which one the first prototype run
validates.

    CONFIG          HEIGHT   CAMERA                  BATTERY          RISK
    ──────          ──────   ──────                  ───────          ────
    A — SPEC-EXACT   5.0mm   3.5x3.5mm CMOS module,  Printed/solid-   HIGH — long lead
        (as briefed)         pinhole lens (~2.5mm    state cell,      time on printed
                              z-height, endoscope-    ~15mAh, thin-    battery cells;
                              class part)             film Qi rx      camera image
                                                                        quality is low
                                                                        at this size

    B — PRODUCTION   8.0mm   OV2640 2MP module        150mAh thin      LOW — every part
        FALLBACK              w/ fixed-focus lens      LiPo pouch,     is proven, in
                              (~5-6mm z-height,         standard Qi    volume, cheap
                              ESP32-CAM-class part)     rx coil

RECOMMENDATION: prototype Config A first in a 5-10 unit hand-built batch
(LOT-COSMO-CUBE-ROADMAP.md Phase 1). If camera yield or battery lead time
kills the timeline, Config B ships the 100-unit run at 8mm — still thinner
than any competing desk object in this category, and every part is stock.
The exterior stainless shells are designed with a shared seam profile so
either internal stack fits the same Face A / Face B tooling with only the
Face B camera bezel depth changing between configs.

================================================================================
04 // WIRELESS CHARGING THROUGH A METAL BODY
================================================================================

Qi inductive charging does not couple through solid stainless steel — eddy
currents in the metal absorb the field as heat instead of passing it to the
receiver coil. Every metal-backed wearable that charges wirelessly (steel
smartwatches, some metal-back phones) solves this the same way: a
non-metal window over the coil.

    SOLUTION: a 14mm diameter zirconia-ceramic (or Gorilla Glass, cheaper
    alternative) window is inset and bonded into the center of Face A,
    directly over the Qi receiver coil in the internal stack. The window
    sits flush with the polished stainless surface — from 30cm it reads
    as an uninterrupted mirror-polished plate; up close it is a small
    disc, the same visual language as the ceramic sensor window on a
    metal smartwatch back.

    The charging window and the laser-etched COSMO® mark (§02) do not
    overlap — the mark is offset toward one edge of Face A, not centered,
    so the ceramic disc reads as a deliberate second material rather than
    a manufacturing flaw.

Charging is Qi 5W (BPP), sufficient given the small battery capacities in
both configs (§03) — full charge in well under an hour either way.

================================================================================
05 // SCREEN
================================================================================

Point: "simple screen to show autonomous notifications... e.g. 'Coffee
time!'". This is not a dashboard. One or two lines of text, updated a
handful of times a day. The display choice follows from that, not from
smartphone habit:

    PRIMARY CHOICE   1.02" round or 1" square monochrome e-paper
                      (e.g. GDEW0102T4-class panel). Zero power draw while
                      the image is static — the line stays legible with the
                      MCU asleep between refreshes. Matches LOT's own
                      "Context Over Notification" doctrine (About.tsx: "No
                      push. No alert. No interruption.") — the tile does not
                      light up or buzz, it simply holds a fact until the
                      operator looks at it.

    ALTERNATE        0.96"-1" monochrome OLED (SSD1306-class). Higher
                      contrast, instant refresh (no e-paper ghosting), but
                      draws power continuously while lit — acceptable only
                      if paired with an aggressive sleep-after-N-seconds
                      timeout in firmware (see LOT-COSMO-CUBE-FIRMWARE.md
                      §04).

    DEFAULT FOR V1: e-paper. The message is a fact to glance at, not a
    feed to watch — e-paper's persistence-without-power fits that better
    than OLED's brightness.

================================================================================
06 // CAMERA
================================================================================

Fixed-focus module, top-center of Face B, small round bezel matching the
button's finish. No flash, no zoom, no video mode in v1 — single-frame
stills only, triggered by a firmware-defined gesture (double-press of the
Copy button, see LOT-COSMO-CUBE-FIRMWARE.md §05), attached to the LOG entry
the Copy press creates. Purpose is context capture ("what was on the desk
when I copied this moment"), not photography.

================================================================================
07 // BUTTON — "COPY"
================================================================================

Single tactile switch, bottom-center of Face B, beneath a stainless cap
flush with the housing (no visible plastic). Three interaction tiers,
defined fully in firmware (LOT-COSMO-CUBE-FIRMWARE.md §05) and the API
contract (LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md §03):

    SHORT PRESS      Copy the current screen line into the operator's LOG
                     tab on lot-systems.com as a new entry.
    LONG PRESS (1s+) Force an immediate pull of a fresh line from the site
                     (see §08), bypassing the normal poll interval.
    DOUBLE PRESS     Capture a photo (§06), attach to the same LOG entry.

Every press is a signal back into the same QIE signal-recording pipeline
that already ingests the other 16 sources (LOT-SYSTEM-OUTLINE.md §04) — the
device is signal source #17: "device."

================================================================================
08 // SENSORS
================================================================================

"AI-grade off-the-shelf sensors" (point 15) means: no custom silicon, no
bespoke ASIC — calibrated, well-characterized commodity parts chosen so
their output is clean enough to feed the Quantum Intent Engine without new
noise-filtering work. Full part numbers and sourcing in LOT-COSMO-CUBE-BOM.md.

    WEATHER (point 14)   Combined temperature / humidity / pressure sensor.
                         Local ambient reading joins the same context object
                         the server already builds per-log-entry (getLogContext(),
                         which currently pulls city-level weather via the
                         WeatherResponse model) — the device supplies a
                         desk-level reading instead of a city-level API call.

    MOTION               Low-power accelerometer, wake-on-tap and orientation
                         sensing (face-down = do-not-disturb, handled entirely
                         in firmware, no server round-trip needed).

    AMBIENT LIGHT        Drives e-paper refresh timing and, in the OLED
                         alternate (§05), brightness — no point refreshing a
                         display no one can see or waking one in daylight
                         glare.

None of these sensors talk to the server directly per-reading. They feed
the on-device session-compression buffer (LOT-COSMO-CUBE-FIRMWARE.md §03)
and only surface in a synced payload if they change the copied moment's
context (e.g. a temperature swing, an orientation flip) — mirroring the
Async Signal Recording doctrine already governing the web client
(LOT-DOCTRINE.md "Async Signal Recording").

================================================================================
09 // CONNECTIVITY
================================================================================

    RADIO       WiFi 2.4GHz (802.11 b/g/n) for direct internet connectivity —
                no phone-relay dependency, unlike a BLE-only accessory.
                BLE 5.0 co-resident on the same SoC for first-time pairing
                and local configuration only (see LOT-COSMO-CUBE-SOFTWARE-
                BRIDGE.md §01).
    PATTERN     Poll, not push-socket. The device wakes on a timer, makes one
                short authenticated HTTPS request, sleeps again. No
                persistent SSE/WebSocket connection is held from a
                battery-powered device — that pattern belongs to the browser
                client (LOT-SYSTEM-OUTLINE.md §05 SSE EVENTS), not this one.

================================================================================
10 // ELECTRICAL SUMMARY
================================================================================

    MCU         WiFi+BLE SoC with camera-capable parallel interface (see
                BOM for the specific module — chosen to be the same family
                that powers the widely available "ESP32-CAM" boards, so
                camera + WiFi + small size is a proven combination rather
                than a first-of-its-kind integration).
    POWER       Qi 5W receiver + linear charge management IC → single-cell
                Li-based battery (chemistry depends on §03 config) →
                buck/LDO to 3.3V rail.
    I/O         1x tactile switch, 1x camera (parallel/DVP or SPI depending
                on module), 1x display (SPI, both e-paper and OLED
                candidates use SPI), 1x combined environmental sensor (I2C),
                1x accelerometer (I2C).

================================================================================
11 // PRODUCTION SCOPE (v1)
================================================================================

First run: 100 units (LOT-COSMO-CUBE-ROADMAP.md §04 has the full plan).
This spec's job is to be stable enough that a 100-unit CNC + SMT run does
not require a mid-run tooling change — hence §03's explicit config decision
being called out as a pre-production gate rather than left implicit.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-HARDWARE-SPEC
================================================================================
