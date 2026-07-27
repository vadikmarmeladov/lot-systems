<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — PHYSICAL PRODUCT SPECIFICATION
FIRST HARDWARE REALIZATION OF THE QIoT™ / LOT TERMINAL VISION
================================================================================

DOCUMENT    PRODUCT-SPEC / LOT-COMPUTER v0.1 (DRAFT)
ISSUE DATE  2026.07.27
AUTHOR      Vadik Marmeladov (S-2), COSMO® CIA, LOT Systems
CLASS       INTERNAL / PLANNING
STYLE       TERMINAL GRID
STATUS      PRE-PROTOTYPE — PLANNING PHASE

================================================================================

## 00  WHAT THIS IS

LOT Computer is the first commercial physical device in the QIoT™
(Quantum Internet of Things) line referenced in the LOT Wiki as "LOT® Station /
COSMO® node" and specified architecturally in `docs/corporate/LOT-TERMINAL-*`
as the S-2 operator hardware track. This document turns that vision into a
buildable object: a coin-sized stainless steel terminal that sits on a desk,
watches one weather metric, and speaks to its owner in one short line —
"Coffee time!" — pushed live from lot-systems.com.

This spec does not replace `LOT-TERMINAL-VISION.md`, `LOT-TERMINAL-M2M.md`, or
`LOT-TERMINAL-SYNC.md` — it is the first concrete SKU built on top of them.
Where those documents describe the open-source S-2 operator platform and the
M2M data-intake protocol in the abstract, this document specifies one exact,
orderable, manufacturable object: **LOT Computer — Node Zero**.

    ONE OBJECT. ONE SCREEN LINE. ONE BUTTON. ONE SENSOR. ZERO CONFIGURATION.

Companion documents (this session):
- `LOT-COMPUTER-BOM.md`        — components buying list, links, unit + 100-run cost
- `LOT-COMPUTER-ROADMAP.md`    — phased plan from spec to 100-unit run
- `LOT-COMPUTER-FIRMWARE-SPEC.md` — on-device firmware document (separate, per brief pt.9/11)
- `LOT-COMPUTER-SOFTWARE-SPEC.md` — lot-systems.com-side software document (separate, pt.10/11)
- `manuals/LOT-Computer-Build-and-Buying-Manual.pdf` — PDF manual export (pt.7)

================================================================================

## 01  THE 19-POINT BRIEF, MAPPED

The originating brief (Vadik, 2026-07-27) is reproduced below as 19 numbered
logic items, each mapped to where it is specified in this document set. This
mapping exists so no line item silently drops between planning and build.

```
#   BRIEF ITEM                                   SPECIFIED IN
──  ────────────────────────────────────────────  ─────────────────────────────
1   PCB Way                                        §04 MANUFACTURING · BOM §02
2   Pager-like notification from AI-powered site   §03 NOTIFICATION PROTOCOL
3   2-part stainless steel body                    §02 INDUSTRIAL DESIGN
4   Flat silver square 4x4cm x 5mm height           §02 INDUSTRIAL DESIGN
5   Camera                                          §02 · FIRMWARE-SPEC §02
6   Use LOT API connector                           §03 · SOFTWARE-SPEC §02
7   Result in PDF manuals                           manuals/ · ROADMAP §05
8   Compress the information in each session         sessions/ (this practice)
9   Firmware documents                               FIRMWARE-SPEC.md (separate doc)
10  Software to connect with firmware                SOFTWARE-SPEC.md (separate doc)
11  Separate documents                                6-document set, this session
12  Charger                                           §02 · BOM §02.6 (Qi wireless)
13  100 units run                                     ROADMAP §04 · BOM §04
14  Weather sensor                                    §02 · BOM §02.5 (BME280-class)
15  AI-grade off-the-shelf sensors                     BOM §02.5 (rationale)
16  "Copy" button → signal to site Log tab             §03 NOTIFICATION PROTOCOL
17  One side polished stainless steel                  §02 INDUSTRIAL DESIGN
18  Other side: camera, screen, button                 §02 INDUSTRIAL DESIGN
19  Wireless charger                                   §02 · BOM §02.6
```

================================================================================

## 02  INDUSTRIAL DESIGN — THE OBJECT

### FORM

A flat square tile, 40mm x 40mm x 5mm, machined in two stainless steel
halves that clamshell around an internal PCB stack.

```
                    ┌────────────────────┐
    SIDE A          │                    │   Mirror-polished 316 stainless.
    (FACE UP)       │        LOT         │   Engraved or laser-etched
    "the coin"      │                    │   wordmark only. No screen,
                     │                    │   no seams visible from top.
                     └────────────────────┘

                    ┌────────────────────┐
    SIDE B          │  ○         [====]  │   Camera aperture (top-left) ·
    (FACE DOWN /    │            [SCRN]  │   round/square micro-display
     desk-facing     │                    │   (center-right) · single
     or wall-facing) │  ( ● )             │   mechanical/capacitive
                     └────────────────────┘   "Copy" button (bottom-left)
```

- **Side A — polished stainless steel** (brief pt.17): the object at rest.
  Sits on a desk like a coin or a paperweight. No visible electronics. This
  is the face shown when the device is idle / no active notification.
- **Side B — camera, screen, button** (brief pt.18): the working face.
  Flipped up or wall-mounted at an angle so the screen is readable. Houses
  the camera aperture, the notification micro-display, and the Copy button.
- Two halves join with 4 countersunk M1.6 screws (or laser-welded seam
  for the production run once tolerances are proven) around a compressed
  silicone gasket — light dust/splash resistance, not a full IP rating.

### THE 5MM CONSTRAINT — STATED HONESTLY

5mm total height is the aspirational industrial-design target stated in the
brief. It is aggressive. Logged here so it is never silently dropped or
silently "solved" by pretending it was easy:

```
STACK BUDGET AT 5MM (top shell + bottom shell + internal stack)
─────────────────────────────────────────────────────────────
Stainless shell (top)          0.6mm       machined, not sheet
Stainless shell (bottom)       0.6mm       machined, not sheet
Gasket + clearance             0.3mm
PCB (flex or rigid-flex)       0.4mm
Camera module (bare, no lens
  stack barrel)                1.0–1.3mm   ultra-thin modules only
Display module                 0.8–1.2mm   flexible OLED, not glass LCD
Battery OR supercap             1.0–1.5mm   thin-film LiPo, small capacity
Qi receiver coil (printed)      0.3mm       printed/flex coil, not off-shelf puck
─────────────────────────────────────────────────────────────
TOTAL                           ≈5.0–5.8mm  TIGHT — near zero margin
```

    CAUTION: this stack is achievable only with (a) a bare-die or
    chip-scale-package MCU, (b) a flexible-OLED or micro-LED display, not a
    glass-backed LCD, (c) a thin-film battery under 60mAh or a supercap
    bridging to the Qi coil, and (d) a lensless or pinhole camera rather
    than a standard M12 lens barrel. This is a valid V2/V3 miniaturization
    target. It is NOT the safe path for the first 100-unit run.

    RECOMMENDATION: build the 100-unit pilot run at 40mm x 40mm x 9mm
    (still a flat coin, still two-part stainless, same face layout) to use
    off-the-shelf camera/display/battery modules with normal tolerances,
    then miniaturize to the true 5mm target for a v2 run once firmware and
    the notification/M2M protocol are proven on real desks. See ROADMAP §02.

### SIDE B COMPONENT LAYOUT

| Component        | Role                                              | See |
|-------------------|---------------------------------------------------|-----|
| Camera            | Ambient capture, future gesture/presence sensing   | §02.5, BOM §02.3 |
| Micro-display      | Renders one pager-style line pushed from the site  | §03, BOM §02.4 |
| "Copy" button      | Press → writes an entry to the user's Log tab       | §03, BOM §02.7 |
| Weather sensor      | Ambient temp / humidity / pressure, feeds AI grade | §02.5, BOM §02.5 |
| Wireless charge coil | Qi inductive charging, no port, no cable to break | §02.6, BOM §02.6 |

### 02.5  SENSORS — "AI-GRADE OFF-THE-SHELF"

Brief pt.14/15 calls for a weather sensor built from off-the-shelf parts
rated for continuous, unattended, AI-consumed telemetry — not hobbyist-grade
parts that drift. This maps directly onto the existing M2M "Multi-Sensor
Array" format already specified in `docs/corporate/LOT-TERMINAL-M2M.md`
(the "Psychotronic Weather Station" example): temperature, humidity,
pressure, air quality. LOT Computer ships one combined environmental sensor
(BME280-class: temp + humidity + pressure) as the v1 payload, with the M2M
JSON shape already defined and unchanged — LOT Computer is simply the first
*factory-built, single-SKU* S-2 device, where the existing docs describe
hand-built maker devices.

### 02.6  CHARGER

Qi-standard wireless charging (brief pt.12/19) — no port on the shell,
nothing to wear out, consistent with "no visible electronics on Side A."
Device ships with a small stainless charging puck styled to match. See
BOM §02.6 for the receiver IC and coil.

================================================================================

## 03  NOTIFICATION PROTOCOL — THE PAGER LINE + THE COPY BUTTON

Brief pt.2 and pt.16 are one feature, split across two directions:

### INBOUND — SITE → DEVICE ("Coffee time!")

```
lot-systems.com AI layer (Memory Engine / QIE, existing)
        │  generates a short recommendation string
        │  (same shape as the M2M "recommendation" field
        │   already defined in LOT-TERMINAL-M2M.md, e.g.
        │   "Open your windows for 3 minutes")
        ▼
Notification queue (NEW — see SOFTWARE-SPEC §02)
        │  one line, <=24 characters, plain text
        │  e.g. "Coffee time!"
        ▼
Device pairing channel (NEW — device_id + operator token,
        same auth shape as LOT-TERMINAL-SYNC.md Layer 1)
        ▼
LOT Computer micro-display
        renders the line, wakes briefly, returns to idle
```

No existing push/webhook/SSE-to-device channel exists in the codebase today
(confirmed by repository research this session — see SOFTWARE-SPEC §01).
This is net-new server-side surface, deliberately built as a thin extension
of the M2M protocol already on paper rather than a new one.

### OUTBOUND — BUTTON → SITE LOG TAB

```
User presses the Copy button on Side B
        ▼
Firmware timestamps the press, attaches last-shown notification text
        ▼
POST to LOT API (device-authenticated, same channel as sensor telemetry)
        ▼
Server writes one Log entry for that user
        (existing model: src/server/models/log.ts,
         existing endpoint family: GET/POST /api/logs,
         src/server/routes/api.ts:1082)
        ▼
Entry appears in the user's Log tab exactly like a manual journal entry,
tagged with event metadata so the UI can render a device glyph
```

"Copy" names the action precisely: the button copies whatever the device is
currently showing into the permanent record on the site, the same way a
person would copy a line from a notepad into their journal.

================================================================================

## 04  MANUFACTURING — PCBWAY

Brief pt.1. PCBWay is the specified fabricator for both the PCB and (via
their CNC/sheet-metal service line) the two stainless steel shells, so a
single vendor relationship covers electronics + enclosure for the pilot run.

```
STAGE                    PCBWAY SERVICE            QUANTITY (pilot)
──────                    ───────────────            ────────────────
PCB fab + assembly         PCB Prototype + PCBA        10 (bring-up) → 100 (run)
Stainless shells (x2)      CNC Machining service       10 (bring-up) → 200 (run, 2/unit)
Stencil (if hand-assembled) SMT stencil                 1
```

Order sequence: 10-unit bring-up batch first (proves the stack in §02 and
the firmware in FIRMWARE-SPEC.md), THEN the 100-unit run (brief pt.13).
Never place the 100-unit order against an unverified board revision — see
ROADMAP §03 for the explicit gate between bring-up and run.

================================================================================

## 05  ONE-LINE POSITIONING

LOT Computer is the desk-sized, silent half of the LOT loop: the software
already listens, predicts, and remembers everything a user does — LOT
Computer is the object that occasionally interrupts, in one line, with the
one thing worth saying out loud, and the one button that lets the user talk
back without opening a laptop.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION — DRAFT v0.1                                   2026.07.27
================================================================================
