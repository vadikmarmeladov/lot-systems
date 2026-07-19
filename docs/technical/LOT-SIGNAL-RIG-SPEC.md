================================================================================
LOT SYSTEMS CORPORATION
LOT SIGNAL
HARDWARE SPECIFICATION — ENCLOSURE + ELECTRONICS + BOM
================================================================================

DOCUMENT    SIGNAL-SPEC / NODE-S1
ISSUE DATE  2026.07.19
CLASS       INTERNAL / BUILD
STYLE       TERMINAL GRID
COMPANION   LOT_SIGNAL_PRODUCT_PLAN.md · LOT-SIGNAL-FIRMWARE.md

================================================================================

## 00  WHAT THIS DEVICE IS

A two-piece stainless-steel puck, ~40mm x 40mm footprint, that receives
short AI-generated notifications from lot-systems.com, senses ambient
conditions, and writes one log entry per button press. Not a computer in
the CPU sense — a pager with a camera and a weather station built in.
Full product framing is in LOT_SIGNAL_PRODUCT_PLAN.md; this document is
the buildable part: dimensions, parts, suppliers, cost.

    ONE BUTTON    ONE SCREEN    ONE CAMERA    ONE SENSOR CLUSTER    NO SPEAKER

================================================================================

## 01  VENDOR OF RECORD

PCBWay covers PCB fab, PCBA (assembly), and CNC machining from one account.
Use it for all three; do not split fab across vendors for a 5- or 100-unit
run — the setup-fee amortization only works if volume stays on one line.

    https://www.pcbway.com/     PCB fab, SMT assembly, CNC stainless parts

Alternate PCB-only quote for cross-check (not required, sanity-check only):

    https://www.jlcpcb.com/

================================================================================

## 02  ENCLOSURE — TWO PARTS

```
PART            MATERIAL           DIMENSIONS          FINISH
────            ────────           ──────────           ──────
Front plate     Stainless 316L     40mm x 40mm x 5mm    Mirror-polished,
                                                          laser-etched LOT
                                                          mark, no electronics

Rear shell      Stainless 316L     40mm x 40mm x 9mm    Bead-blasted matte,
                                                          machined cutouts:
                                                          camera lens, screen
                                                          window, button bore,
                                                          USB-C service port

TOTAL DEVICE THICKNESS (assembled): ~14mm
ASSEMBLY: front plate bonded + 4x M1.6 stainless screws into rear shell
          (screws allow field service; adhesive-only voids repairability)
```

316L over 304 for the sweat/skin-contact tolerance if worn clipped to a
strap — costs marginally more in CNC time, not in material at this size.

CNC quote at https://www.pcbway.com/ under "CNC Machining" — upload the
enclosure STEP files, spec stainless 316L, mirror finish on the front
plate only (matte on the rear shell keeps fingerprints and camera glare
down).

================================================================================

## 03  ELECTRONICS — REAR SHELL

```
PART                      SPEC                              WHY
────                      ────                               ───
MCU                       ESP32-S3-WROOM-1 (N8R2)            WiFi + BLE, camera
                                                              interface (DVP),
                                                              deep-sleep <20uA,
                                                              8MB flash / 2MB PSRAM

CAMERA                    OV2640, 2MP, DVP interface         Cheap, well-
                                                              supported on
                                                              ESP32-S3, small
                                                              enough for the
                                                              rear-shell cutout

SCREEN                    GC9A01 round IPS, 1.28in, 240x240  Fits the 40mm
                           SPI                                footprint with
                                                              room for camera +
                                                              button alongside

WEATHER SENSOR            Bosch BME280                       Temp / humidity /
                           (I2C, industrial-grade)            pressure — same
                                                              telemetry shape
                                                              as weather.ts and
                                                              M2M Format 3

WIRELESS CHARGE RX        Qi receiver coil + charge IC        Slots in the rear
                           (e.g. IP2366 or BQ51013B class)     shell behind the
                                                                battery

BATTERY                   LiPo 300mAh, 20mm x 30mm x 4mm      Fits rear-shell
                                                              depth budget;
                                                              ~2-3 day life at
                                                              typical wake rate

BUTTON                    Tactile SMD, 6x6mm, sealed          Single button.
                           IP-rated cap                        "Copy" only.

SERVICE PORT               USB-C (data + charge, recessed)     Firmware flash,
                                                                fallback charge
```

Wiring: ESP32-S3 drives the SPI screen, DVP camera, I2C sensor, and one GPIO
button interrupt. Qi charge IC feeds the battery independently and reports
charge state to the MCU over a status pin — no I2C bus contention with the
sensor.

================================================================================

## 04  CHARGER

Wireless charging puck, separate accessory, ships with each unit:

```
Qi transmitter coil + Qi Tx IC, USB-C input, desk-stand puck housing
(3D-printed or injection-molded — not stainless, cost-optimized)
```

The device's Qi RX coil sits behind the rear shell's matte face; align mark
etched into the shell shows correct charging placement. No pogo-pin dock —
wireless-only, per item 19 in the brief, keeps the enclosure fully sealed
(no exposed charging contacts to corrode).

================================================================================

## 05  BOM + SUPPLIER LINKS (PER-UNIT, PROTOTYPE QTY)

```
PART                          QTY   UNIT COST   SUPPLIER
────                          ───   ─────────   ────────
ESP32-S3-WROOM-1 (N8R2)        1    $2.20       digikey.com / lcsc.com
                                                 (search "ESP32-S3-WROOM-1-N8R2")
OV2640 camera module            1    $3.50       lcsc.com / adafruit.com
GC9A01 1.28in round LCD         1    $4.80       lcsc.com / adafruit.com
Bosch BME280 sensor              1    $3.20       digikey.com / mouser.com
                                                 (bosch-sensortec.com for datasheet)
Qi RX coil + charge IC           1    $2.50       lcsc.com
LiPo 300mAh battery              1    $2.80       adafruit.com / digikey.com
Tactile button, sealed           1    $0.35       lcsc.com
USB-C receptacle                 1    $0.40       lcsc.com
PCB (2-layer, rear shell)        1    $1.50       pcbway.com
PCBA (SMT assembly labor)        1    $8.00       pcbway.com (setup fee
                                                 amortized differently
                                                 at prototype vs. 100u —
                                                 see §06)
Passives (R/C/connectors)        ~15   $1.20       pcbway.com BOM upload
                                                 (sourced + placed together)
Front plate (316L, CNC, polish)  1    $9.50       pcbway.com (CNC)
Rear shell (316L, CNC, matte)    1    $11.00      pcbway.com (CNC)
M1.6 stainless screws            4    $0.20       pcbway.com (CNC hardware add-on)
Wireless charging puck (accessory, sold separately from per-unit device cost)
  Qi Tx coil + IC + housing      1    $6.50       lcsc.com + injection-mold
                                                 quote via pcbway.com
────                          ───   ─────────
DEVICE SUBTOTAL (parts + fab, excl. charger)          ≈ $51.15 / unit @ qty 5
CHARGER (accessory)                                    ≈ $6.50 / unit @ qty 5
```

Links are vendor category/search entry points, not fixed SKUs — part
numbers above are what to search for. Confirm exact MOQ and lead time at
quote time; ESP32-S3 and BME280 are both in continuous production as of
this writing, low supply-chain risk.

    https://www.digikey.com/
    https://www.lcsc.com/
    https://www.mouser.com/
    https://www.adafruit.com/
    https://www.espressif.com/en/products/socs/esp32-s3
    https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/

================================================================================

## 06  COST AT SCALE — PROTOTYPE (5) VS. PILOT (100)

```
                          QTY 5           QTY 100
                          ─────           ───────
PCBA setup fee (fixed)    $150 total      $150 total
  → amortized/unit         $30.00          $1.50
Per-unit parts (from §05)  $51.15          $51.15 → drops to ≈$34
                                            at 100u component pricing
CNC setup (front+rear)     $180 total      $180 total
  → amortized/unit         $36.00          $1.80
Per-unit CNC machining     $20.50          $20.50 → drops to ≈$13
                                            at 100u batch pricing
Charger accessory          $6.50           $6.50 → ≈$4.20 at 100u

────                       ─────           ───────
EST. TOTAL / UNIT          ≈ $144         ≈ $24–$32
(fully loaded, incl.
 amortized setup)

TOTAL RUN COST                             ≈ $2,400–$3,200
                                            (100 units)
```

The prototype-quantity per-unit number is dominated by fixed setup fees —
expected, and not the number to plan a business around. The 100-unit
column is the meaningful one for the pilot run in item 13.

================================================================================

## 07  WHAT TO UPLOAD TO PCBWAY, PER PHASE

```
PHASE 1 (prototype x5)
  - Gerber files (PCB) + BOM + pick-and-place file → PCBA quote, qty 5
  - Enclosure STEP files x2 (front plate, rear shell) → CNC quote, qty 5,
    stainless 316L, specify mirror finish on front / matte on rear

PHASE 5 (pilot x100)
  - Same files, qty 100. Re-quote — do not reuse the prototype quote,
    PCBWay's per-unit pricing steps down at volume tiers.
  - Request DFM (design-for-manufacture) review before committing to 100 —
    catches drill-hit and tolerance issues cheaply, before 100 shells are
    cut.
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION                                                2026.07.19
================================================================================
