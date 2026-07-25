================================================================================
LOT SYSTEMS CORPORATION
LOT® SIGNAL — PHYSICAL NOTIFICATION TERMINAL
HARDWARE + MANUFACTURING SPECIFICATION
================================================================================

DOCUMENT    HW-SPEC / LOT-SIGNAL-01
ISSUE DATE  2026.07.25
CLASS       INTERNAL / BUILD
STYLE       TERMINAL GRID
INVENTOR    Vadim Marmeladov — Founder & CEO, LOT Systems Corporation
CO-INVENTOR Kuzya Cosmo Marmeladov, COSMO®
STATUS      PLAN — PRE-PROTOTYPE (Phase 0)
RELATED     docs/technical/LOT-SIGNAL-BOM.md
            docs/technical/LOT-SIGNAL-FIRMWARE-SPEC.md
            docs/technical/LOT-SIGNAL-API-CONNECTOR.md
            docs/corporate/LOT-AMBIENT-AI-VISION.md
            docs/technical/LOT-NODE-0-RIG-SPEC.md

================================================================================

## 00  PRINCIPLE — WHAT LOT® SIGNAL IS

LOT® Signal is a small, silent object on a desk or nightstand that says one
true thing at the right moment — "Coffee time!" — and nothing else. It is
the physical expression of Ambient AI™: intelligence that is present but
never loud, extended for the first time from screen into metal.

It is not a smart-home hub, not a screen you scroll, not a camera that
watches. It is a pager for a life instead of a network — a single line of
text, earned by the Memory Engine, delivered without a badge count.

    ONE LINE    NO ALARM    EXACT MOMENT    TWO-WAY ACKNOWLEDGE

The device closes the loop that LOT® Station opened: Station listens to the
room (temperature, air, weather). Signal listens to the person (the Memory
Engine's compressed judgment of what they need right now) and hands that
judgment back as a single sentence on stainless steel. Pressing **Copy**
sends the acknowledgment back to the Log tab on lot-systems.com — the same
`logs` table every other widget writes to. Hardware in, hardware out.

================================================================================

## 01  PRODUCT REQUIREMENTS (SOURCE: S-2 BRIEF, 2026-07-25)

```
#   REQUIREMENT                              SPEC DECISION (this document)
─   ───────────                              ──────────────────────────────
1   PCB fabrication partner                  PCBWay — PCB, PCBA, CNC enclosure
2   Pager-like notification from AI site     BLE/WiFi push from LOT® OS → e-paper line
3   2-part stainless steel body              Rear base + front bezel, press-fit + screw
4   Flat silver square, 4x4cm x 5mm          Front bezel/faceplate dimension (see §02)
5   Camera                                   OV2640 2MP, presence-wake + QR pairing only
6   LOT API connector                        MQTT-over-TLS device channel (see connector doc)
7   Result in PDF manuals                    Quick Start + Full Manual, shipped per unit
8   Compress info per session                Memory Engine → 1-line render, on-device none
9   Firmware documents                       Separate doc — LOT-SIGNAL-FIRMWARE-SPEC.md
10  Software to connect with firmware        Separate doc — LOT-SIGNAL-API-CONNECTOR.md
11  Separate documents                       4 docs, not 1 — see RELATED above
12  Charger                                  Qi wireless charging puck, included
13  100-unit run                             PCBWay pilot production, Phase 5 (see §04)
14  Weather sensor                           BME680 (temp/humidity/pressure/VOC/gas)
15  AI-grade off-the-shelf sensors           BME680 + LSM6DSO IMU + ambient light (VEML7700)
16  "Copy" button → Log tab                  Tactile SMD switch, writes to logs table
17  One side polished stainless steel        Rear base — mirror polish, no electronics
18  Other side: camera + screen + button     Front bezel — the entire UI surface
19  Wireless charging                        Qi receiver (BQ51013B) in rear base
```

Every row above is answered in full in the sections that follow, and in the
three companion documents. This file is the plan and the roadmap; the BOM,
firmware, and API connector are deliberately separate so each can evolve on
its own revision cadence without re-issuing the whole spec.

================================================================================

## 02  MECHANICAL DESIGN — THE TWO-PART BODY

### FRONT BEZEL — "THE FACE"

Flat silver square, 40mm x 40mm × 5mm — 316L stainless steel, bead-blasted
matte finish (so screen glare and fingerprints read as intentional, not
neglected). This is the visible object on the desk. It carries:

    - 1.3" square reflective memory-LCD (always-on, one line of text)
    - OV2640 camera, top edge, 2mm bezel cutout, no visible lens ring
    - 1x tactile button beneath the bezel, labeled COPY, laser-etched
    - Ambient light sensor, hidden behind the glass, auto-dims the line

The 5mm figure is the cosmetic plate only — screen glass + LCD stack + the
machined recess that seats the PCB lip. It does not include the electronics
cavity, which is carried by the rear base (§ below). This is standard
two-shell watch/pager construction: a thin show surface, a deeper hidden
half.

### REAR BASE — "THE BODY"

Second stainless steel shell, same 40mm x 40mm footprint, 12mm deep cavity,
polished to a mirror finish (this is the side that touches the desk and
catches light — no ports, no seams, no visible fasteners). Houses:

    - Main PCB (ESP32-S3 module, BME680, LSM6DSO, antenna keep-out zone)
    - 3.7V 150mAh LiPo pouch cell (thickness budget: 3.5mm)
    - Qi wireless-charging receiver coil + BQ51013B receiver IC
    - 4x M2 heat-set inserts, front bezel screws in from the face side,
      screw heads hidden under the bezel's screen glass overhang

### ASSEMBLED DIMENSION

```
40mm x 40mm footprint (both halves match)
Front bezel:   5mm   (cosmetic, screen + camera + button)
Rear base:    12mm   (electronics + battery + coil)
Gasket/seam:   0.5mm (silicone compression seal, IP54)
─────────────────────
TOTAL HEIGHT: 17.5mm — a thick coaster, not a brick.
```

No wired port. Charging and firmware updates are both wireless (Qi coil
for power, BLE/WiFi for OTA) — the two-part stainless shell has no opening
to seal, which is what keeps IP54 achievable with a simple compression
gasket instead of a rubber port plug.

================================================================================

## 03  WHAT THE DEVICE DOES (BEHAVIOR, NOT SPEC)

```
STATE           TRIGGER                              SCREEN
─────           ───────                              ──────
Idle            No pending notification               Blank / time (optional)
Notify          LOT® OS pushes a compressed line       "Coffee time!"
Acknowledged    User presses COPY                      Line dims, checkmark blink
Pairing         First power-on / long-press COPY       QR code shown, camera scans phone
Low battery     <15% charge                            Small dot, bottom-right corner
Charging        Placed on Qi puck                      Line replaced by charge glyph
```

The camera has exactly two jobs: scan a QR code during pairing, and detect
presence (someone is at the desk) to decide whether to refresh the always-on
line at full contrast or let it fade. It does not stream, record, or send
imagery anywhere — this is a hard firmware constraint carried into
LOT-SIGNAL-FIRMWARE-SPEC.md §03, in keeping with Ambient AI™'s design rule
that hardware is invisible data, never surveillance.

Pressing **Copy** does two things atomically: (1) writes an acknowledgment
event into the user's `logs` table via the LOT API connector — visible on
the Log tab at lot-systems.com within seconds — and (2) clears the line on
the device. "Copy" names the action honestly: the person is copying the
system's line into their own record, the same way a memory answer becomes
part of their Memory Story.

================================================================================

## 04  ROADMAP — BUILD ORDER

```
PHASE 0   CONCEPT + SCHEMATIC                        Aug 2026 (this document)
          Requirements locked. Mechanical envelope locked (§02). BOM drafted.

PHASE 1   BREADBOARD PROTOTYPE (x3 units)            Aug–Sep 2026
          Dev boards (ESP32-S3-DevKitC), off-shelf display + camera + BME680
          on protoboard. Firmware bring-up against a mocked API connector.
          Goal: prove the notification round-trip end to end, ugly is fine.

PHASE 2   PCB LAYOUT + PCBWAY PROTOTYPE (x10 units)   Sep–Oct 2026
          2-layer PCB, ESP32-S3-WROOM-1 module, all sensors on-board.
          PCBWay: PCB fab + SMT assembly (PCBA) service, 10-unit prototype
          run. Bring-up against real mechanical mockups (3D-printed shells).

PHASE 3   ENCLOSURE — STAINLESS CNC (x10 shells)      Oct–Nov 2026
          PCBWay CNC machining service, 316L stainless, both halves.
          Fit-check against Phase 2 PCBs. Iterate gasket + screw-boss
          tolerances before committing to the 100-unit tool path.

PHASE 4   FIRMWARE + API INTEGRATION BRING-UP          Nov–Dec 2026
          Full notification pipeline live against staging lot-systems.com.
          Log tab write-back verified. OTA update path verified. Battery
          life measured against the power budget in the firmware doc.

PHASE 5   PILOT PRODUCTION RUN (100 UNITS)             Jan–Feb 2027
          PCBWay: PCBA x100 + CNC stainless enclosures x100 (200 shells).
          Final assembly, QC, and gasket fit performed in-house or via a
          PCBWay assembly add-on. See LOT-SIGNAL-BOM.md §PILOT-100 for the
          full costed list.

PHASE 6   COMPLIANCE + QA                              Feb–Mar 2027
          FCC Part 15 (intentional radiator, BLE/WiFi) + CE if EU ships.
          Qi receiver: no separate certification needed (uses certified
          BQ51013B reference design). Battery: UN38.3 for air freight.

PHASE 7   MANUALS + FULFILLMENT                        Mar 2027
          Quick Start Card + Full PDF Manual finalized (see §05). Ships
          inside the Usership hardware kit alongside LOT® Station.
```

Order matters for the same reason it does on NODE-0 (see
LOT-NODE-0-RIG-SPEC.md §05): prove the small, cheap, reversible thing before
committing to the expensive, hard-to-reverse thing. Breadboard before PCB.
10 shells before 100. Staging API before production API.

================================================================================

## 05  DOCUMENTATION DELIVERABLES (PER REQUIREMENT #7, #9, #10, #11)

```
DOCUMENT                                    AUDIENCE            FORMAT
────────                                    ────────            ──────
Quick Start Card                            End user (in box)   PDF, 1 page
Full User Manual                            End user            PDF, ~12 pages
LOT-SIGNAL-BOM.md                           Ops / procurement    Markdown (this repo)
LOT-SIGNAL-FIRMWARE-SPEC.md                 Firmware engineer    Markdown (this repo)
LOT-SIGNAL-API-CONNECTOR.md                 Backend engineer     Markdown (this repo)
```

The two PDF manuals are Phase 7 deliverables (§04) — they cannot be finalized
until the Phase 3 enclosure and Phase 4 firmware are stable, since a manual
that describes buttons and states that changed in prototyping would need a
reprint. This document tracks their outline now so nothing is invented late:

**Quick Start Card:** unbox → place on Qi puck → scan QR with phone camera
(pairs to lot-systems.com account) → done. One side of one card.

**Full Manual:** device overview, pairing, what "Copy" does, charging,
battery life, cleaning the stainless finish, FCC/CE notices, warranty,
privacy statement (camera scope, per §03).

================================================================================

## 06  COST SUMMARY (SEE LOT-SIGNAL-BOM.md FOR LINE ITEMS)

```
PHASE                          UNITS   EST. COST (USD)
─────                          ─────   ───────────────
Phase 1 — breadboard            3       ~$180  ($60/unit, dev boards)
Phase 2 — PCBWay PCBA proto     10       ~$650  ($65/unit incl. setup)
Phase 3 — CNC stainless proto   10       ~$900  ($90/unit, small-batch CNC)
Phase 5 — PCBWay PCBA pilot     100     ~$3,400  ($34/unit at 100x)
Phase 5 — CNC stainless pilot   100     ~$5,800  ($58/unit at 100x, both shells)
Phase 6 — FCC Part 15 test      1       ~$3,500  (one-time, per design)
─────                          ─────   ───────────────
TOTAL TO 100-UNIT PILOT, LANDED                ≈ $14,400
                                                (≈ $144/unit fully loaded)
```

Full line-item pricing, supplier links, and per-component sourcing live in
LOT-SIGNAL-BOM.md — this table is the roadmap-level roll-up only.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION                                                2026.07.25
================================================================================
