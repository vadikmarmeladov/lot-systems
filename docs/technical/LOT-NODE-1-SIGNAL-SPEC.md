<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
NODE-1 / THE SIGNAL
CONSUMER HARDWARE + BOM + PRODUCTION ROADMAP
================================================================================

DOCUMENT    NODE-1-SIGNAL-SPEC
ISSUE DATE  2026.07.22
CLASS       INTERNAL / BUILD
STYLE       TERMINAL GRID
S-2         VADIK MARMELADOV — INVENTOR, COSMO® CIA
COMPANION   docs/technical/LOT-NODE-0-RIG-SPEC.md (the brain) · this doc (the pager)

================================================================================

## 00  PRINCIPLE — WHAT NODE-1 ACTUALLY IS

NODE-0 is the metal that thinks — a self-hosted inference server, owned,
racked, and gated by a human. NODE-1 is the metal the operator carries — a
single physical object whose only job is to move one signal from the LOT
system into the physical world, and one signal back.

    lot-systems.com decides "coffee time"  →  NODE-1 shows it on a screen
    operator presses COPY                  →  NODE-1 writes it to the Log tab

Everything below — the stainless steel, the camera, the sensor, the charger —
exists in service of that one round trip. NODE-1 is not a smartwatch, not a
phone, not a display. It is a pager for an operating system that already
knows the operator's patterns; the hardware's only new job is to be present
in a room the software cannot reach.

Reference material folded into this spec: brand.lot-systems.com,
lot-systems.com/about, institute.lot-systems.com/cqgs.html — the CQGS
thesis (docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md) already commits LOT to
a physical products arc ("sci-fi hygiene, cleanse, real-world cubic");
NODE-1 is the first object on that arc that is a computer, not a consumable.

================================================================================

## 01  BRIEF → SPEC — MAPPING THE 19-POINT LOGIC

The founder's brief (19 numbered points) is translated below into one
coherent object. Nothing added, nothing dropped.

```
#    BRIEF ITEM                              SPEC DECISION
──   ─────────────────────────────────────    ─────────────────────────────────
1    PCBWay                                   PCBA fab + CNC steel body, one vendor, one PO
2    Pager-like notification from AI site     Persistent socket to lot-systems.com; push-only UX
3    2-part stainless steel body               Face shell (front) + back shell, screw-free snap-fit
4    Flat silver square 4x4cm x 5mm            Outer envelope; PCB stack budget = 3.2mm usable
5    Camera                                    OV2640 2MP, DVP interface, front face bezel
6    LOT API connector                         Device-scoped bearer token; M2M schema (already spec'd)
7    Result in PDF manuals                     6 separate PDFs, see Section 05
8    Compress info in each session             On-device session buffer -> one compressed POST
9    Firmware documents                        LOT SIGNAL Firmware Reference PDF
10   Software to connect with firmware         LOT SIGNAL Pairing + Bridge service
11   Separate documents                        Manuals are not merged; one file per audience
12   Charger                                   Qi wireless charging dock, sold with unit 1
13   100 units run                             Section 06 — production ramp
14   Weather sensor                            Bosch BME680 (temp/humidity/pressure/gas)
15   AI-grade off-the-shelf sensors             BME680 BSEC library = on-chip AI air-quality index
16   "Copy" button -> Log tab signal           Single tactile button, POST /api/hardware/log
17   One side polished stainless steel         Back shell — mirror-polish, no ports, no seams
18   Camera + screen + button on other side    Front shell — GC9A01 round display, OV2640, 1 button
19   Wireless charger                          Same Qi dock as #12 (one line item, not two)
```

================================================================================

## 02  PHYSICAL — THE OBJECT

```
FORM        Flat silver square, 40mm x 40mm x 5mm (envelope)
BODY        2-part stainless steel (SUS304), CNC-machined, snap-fit, no visible screws
FRONT FACE  1.28" round color LCD (GC9A01, 240x240) centered in the square
            OV2640 camera, top bezel, 2MP
            1 tactile button below the display, "COPY" engraved
BACK FACE   Mirror-polished SUS304, no cutouts — the object at rest, worn or shelved
CHARGING    Qi wireless coil beneath the back shell; no charging port, no seam
WEIGHT      Target <= 42g (steel shell dominates the budget, not electronics)
```

The two faces are a deliberate split, not a manufacturing shortcut: the
polished face is what the object *is* when idle — clean, silent, a small
mirror. The active face is what it *does* when a signal arrives. The
operator flips or glances at whichever face matches the moment.

================================================================================

## 03  ELECTRONICS — BILL OF MATERIALS

Real, sourceable parts. Prices are 2026 street/distributor unit price at
qty 1; the 100-unit column is the blended landed cost used for Section 06.

```
PART                    SPEC                              QTY 1     QTY 100
────                    ────                              ─────     ───────
MCU                     Espressif ESP32-S3 (WROOM-1, N8R2) $3.80     $2.60
CAMERA                  OV2640, 2MP, DVP/8-bit parallel     $4.50     $3.10
DISPLAY                 GC9A01, 1.28" round IPS, 240x240    $4.20     $2.90
ENV SENSOR              Bosch BME680 (temp/RH/press/gas)    $8.90     $4.20
CHARGE RECEIVER         Qi receiver IC + coil (5W)          $3.00     $1.90
BATTERY                 LiPo, ultra-thin pouch, 3.7V 180mAh $3.50     $2.80
BUTTON                  Tactile SMD switch + steel cap       $0.60     $0.35
ANTENNA                 2.4GHz PCB/ceramic chip antenna      $0.80     $0.40
PASSIVES + PCB (bare)   4-layer, ENIG, 2.5x2.5cm             $2.20     $0.90
ASSEMBLY (PCBA)         PCBWay turnkey SMT, per unit         $6.00     $3.50
STEEL BODY (2-part)     CNC SUS304, mirror + bead-blast       $22.00    $14.50
QI CHARGING DOCK        5W transmitter puck, off-shelf base   $9.00     $6.80
                        (bundled 1:1 with unit)
────                    ────                              ─────     ───────
TOTAL BOM / UNIT                                            $68.50    $44.05
```

Adding NRE (CNC fixtures, PCBA stencil + programming jig, one-time,
amortized) and QC/packaging labor brings the landed unit cost to
**≈ $58–$72 at 100 units** — see Section 06 for the full run math.

### Sourcing

```
COMPONENT               VENDOR                                LINK
─────────               ──────                                ────
PCBA (fab + assembly)   PCBWay                                https://www.pcbway.com
CNC steel body           PCBWay CNC machining service           https://www.pcbway.com
MCU module               Espressif / distributor stock          https://www.espressif.com
                          Mouser / DigiKey                       https://www.mouser.com
                                                                  https://www.digikey.com
Env sensor (BME680)      Bosch Sensortec (part datasheet)        https://www.bosch-sensortec.com/products/environmental-sensors/bme680/
Prototyping breakouts    Adafruit                                https://www.adafruit.com
```

Why PCBWay carries both line items: it is one of the few vendors offering
turnkey PCBA *and* CNC metal machining under one account, which matches
brief item #1 — one fab relationship, one BOM upload, one shipment,
instead of splitting electronics and steel across two vendors and two
shipping/QC cycles.

================================================================================

## 04  LOT API CONNECTOR — THE ROUND TRIP

NODE-1 reuses the M2M data-intake schema already specified in
docs/corporate/LOT-TERMINAL-M2M.md. No new protocol — two new endpoints
that speak the existing format.

```
DIRECTION           ENDPOINT                          PAYLOAD
─────────           ────────                          ───────
site -> device       persistent socket, LOT-issued      { "title": "Coffee time!",
                      device token, one channel per        "ttl_s": 45 }
                      paired device
device -> site        POST /api/hardware/log             M2M "Enhanced Intelligence" format:
                      (fires on COPY button press)         device_id, operator, metric="copy",
                                                            value=1, recommendation=<shown text>,
                                                            timestamp
```

A COPY press does not create new content — it timestamps the notification
the operator already saw, and writes that timestamp into the operator's
Log tab exactly the way the M2M protocol already writes hardware
intelligence into a LOT consumer profile. NODE-1 is a new *sender*, not a
new pipe.

### Session compression (brief #8)

The device does not stream every sensor tick. It buffers locally —
notifications shown, button presses, BME680 readings — for the session
window, then emits **one** compressed POST when the session closes (screen
sleeps, or every 15 minutes on a held session), using M2M "Multi-Sensor
Array" format. This is the same compression discipline this repository's
own session reports follow: raw signal in, one dense summary out.

================================================================================

## 05  DOCUMENTATION SET — SIX SEPARATE PDFS

Per brief #7 and #11 — one manual per audience, never merged:

```
01  LOT SIGNAL — Quick Start                 Unboxing, pairing, first notification
02  LOT SIGNAL — Hardware & Assembly          2-part shell, battery access, torque spec
03  LOT SIGNAL — Firmware Reference           ESP-IDF build, pinout, OTA channel, BSEC integration
04  LOT SIGNAL — Software Integration         Pairing flow, LOT API connector, M2M payload schema
05  LOT SIGNAL — Compliance & Safety          FCC/CE pre-scan, UN38.3 battery, Qi certification
06  LOT SIGNAL — Warranty & Care              Polished-steel care, charging cadence, RMA path
```

Each ships as a standalone PDF in the unit's packaging and is mirrored at
docs/technical/ in this repository once drafted.

================================================================================

## 06  PRODUCTION ROADMAP — 100 UNITS

```
PHASE                        WEEKS   OUTPUT
─────                        ─────   ──────
0  Design lock                1–3     Mechanical CAD, schematic, BOM frozen
1  PCBWay proto run (x5)      4–7     PCBA bring-up, 3D-printed shell proxy
2  Firmware + API connector   4–9     ESP-IDF firmware, pairing flow, M2M payloads (parallel to Phase 1)
3  CNC steel pilot (x10)      8–11    First real stainless shells, fit + charging check
4  Compliance pre-scan        10–12   Informal FCC/CE + UN38.3 battery check before committing to 100
5  100-unit production        13–18   PCBWay PCBA + CNC run, full BOM at qty 100
6  Assembly, QC, packaging     19–20   Final snap-fit assembly, burn-in test, box + 6 PDFs
7  Fulfillment                 21      Ship to first Usership cohort
```

**Total: ~21 weeks (≈ 5 months), design lock to shipment.**

### Run cost, 100 units

```
BOM (100 units @ $44.05/unit)                       $4,405
NRE — CNC fixtures + PCBA stencil + jig (one-time)   $2,200
Assembly labor + burn-in QC (100 units)              $1,100
Packaging + 6-PDF print/insert set                     $600
─────────────────────────────────────────            ──────
TOTAL PRODUCTION BUDGET, 100 UNITS                   $8,305
LANDED COST / UNIT                                   ≈ $83
```

At a target retail of $199–$249 (Usership hardware tier, bundled Qi dock),
the 100-unit run clears cost at roughly 35–40 units sold — the remaining
60–65 units are margin that funds Phase 2 tooling for the next run.

================================================================================

## 07  WHY 100, NOT 10 OR 1,000

Ten units cannot amortize CNC fixture NRE ($2,200 spread over 10 units
adds $220/unit — worse than the electronics). One thousand units locks in
a shell design before the paired-device UX (notification cadence, COPY
semantics, charging habits) has been observed in the field. One hundred
is the smallest run where steel tooling pays for itself and large enough
to seed a real first Usership cohort with real session data feeding back
into Phase 2 firmware revisions.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION                                                2026.07.22
================================================================================
