================================================================================
LOT SYSTEMS CORPORATION
LOT PAGER — BILL OF MATERIALS & BUYING LIST
DOCUMENT: LOT-PAGER-BOM / v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-01
COMPANION: LOT-PAGER-SPEC.md (section 03, 04, 06)
================================================================================

--------------------------------------------------------------------------------
00 // HOW TO READ THIS
--------------------------------------------------------------------------------
Two price columns per line:

    PROTO   — single-unit price from a hobbyist-friendly distributor
              (Adafruit / DigiKey / Mouser / Arducam), for the Phase 0–1
              breadboard and 5-piece prototype runs in LOT-PAGER-SPEC.md #09.
    x100 EST — rough order-of-magnitude per-unit price at 100-piece volume.
              Marked "QUOTE" where the real number can only come from
              uploading actual gerbers/CAD to the vendor — do not lock the
              pilot-run budget on these until that quote is in hand.

All links verified live as of 2026-07-01.

--------------------------------------------------------------------------------
01 // ELECTRONICS — CORE
--------------------------------------------------------------------------------

MCU MODULE — ESP32-S3-WROOM-1-N8 (WiFi + BLE, 8MB flash, camera DVP bus)
    Mouser:   https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-WROOM-1-N8
    DigiKey:  https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N4/16162639
    PROTO ≈ $5.00        x100 EST ≈ $3.50–4.00

DISPLAY — 0.96" monochrome OLED, SPI, 128x64 (Adafruit #326 as prototype ref;
production wants the bare COG/COF module behind this breakout — confirm
z-height against datasheet before layout lock, per SPEC section 02)
    Adafruit: https://www.adafruit.com/product/326
    DigiKey:  https://www.digikey.com/en/products/detail/adafruit-industries-llc/326/5353680
    PROTO ≈ $19.95 (assembled breakout)   x100 EST (bare module) ≈ $3–5 — QUOTE

CAMERA — Arducam OV2640 Mini, 2MP, DVP 24-pin
    Arducam:  https://www.arducam.com/arducam-ov2640-camera-module-2mp-mini-ccm-compact-camera-modules-compatible-with-arduino_m0031esp32-esp8266-development-board-with-dvp-24-pin-interface_.html
    PROTO ≈ $15–20        x100 EST ≈ $8–12 — QUOTE (Arducam OEM/bulk channel)

WEATHER SENSOR — Bosch BME280 (temp / humidity / pressure), I2C or SPI
    Adafruit breakout (proto): https://www.adafruit.com/product/2652
    Bare IC (production):      https://www.digikey.com/en/pdf/a/adafruit/bme280-sensor-breakout
    PROTO ≈ $9.95 (breakout)   x100 EST (bare IC) ≈ $1.50–2.50

WIRELESS CHARGING RECEIVER — Qi-compliant, TI BQ51013B-class IC
    Adafruit module (proto): https://www.adafruit.com/product/1901
    TI part family:          https://www.digikey.com/en/product-highlight/t/texas-instruments/bq51050b-wireless-power-receivers
    PROTO ≈ $7.95 (module)    x100 EST (bare IC + coil) ≈ $2.50–4.00

BUTTON — ultra-low-profile SMD tactile switch (E-Switch TL3780-class, <1mm)
    DigiKey category: https://www.digikey.com/en/products/filter/tactile-switches/surface-mount/197
    PROTO ≈ $0.60          x100 EST ≈ $0.30–0.40

BATTERY — LiPo pouch cell, 3.7V 150mAh, 3.8mm thick
    Adafruit: https://www.adafruit.com/product/1317
    PROTO ≈ $5.95          x100 EST ≈ $2.00–3.00 (cell manufacturer direct)

--------------------------------------------------------------------------------
02 // PCB — PCBWAY (Requirement #1)
--------------------------------------------------------------------------------
    Fab (flex-rigid, 2–4 layer):
        https://www.pcbway.com/
    SMT / PCBA assembly quote:
        https://www.pcbway.com/quotesmt.aspx
        https://www.pcbway.com/pcb-assembly.html
    x100 EST — QUOTE (flex-rigid at 100pcs typically runs materially higher
    per-board than a rigid FR4 board of the same size; get the real number
    from the assembly quote form with the actual gerbers/BOM/CPL files
    before budgeting Phase 5)

--------------------------------------------------------------------------------
03 // ENCLOSURE — PCBWAY CNC, STAINLESS STEEL (Requirements #3, #17, #18)
--------------------------------------------------------------------------------
    CNC machining service:
        https://www.pcbway.com/rapid-prototyping/cnc-machining/
    Stainless steel 304 material page:
        https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/
    Mechanical/enclosure design quote:
        https://www.pcbway.com/pcbdesign/quoteenclosure

    Two shells per unit (front brushed, back polished) — 200 machined parts
    for a 100-unit run. QUOTE required; CNC stainless at this size/finish
    typically prices per-part rather than per-gram, and polishing is a
    separate line item from milling — do not assume linear scaling from a
    5-piece prototype quote to the 100-unit number.

--------------------------------------------------------------------------------
04 // PER-UNIT COST ROLL-UP (100-UNIT RUN, ROUGH ORDER OF MAGNITUDE)
--------------------------------------------------------------------------------
```
LINE                          x100 EST/UNIT   NOTE
----                          -------------   ----
MCU (ESP32-S3-WROOM-1)             $3.75      firm-ish (Mouser/DigiKey list)
Display module                     $4.00      QUOTE — bare COG/COF
Camera module                      $10.00     QUOTE — Arducam OEM channel
Weather sensor (bare IC)           $2.00      firm-ish (DigiKey list)
Qi receiver (IC + coil)            $3.25      QUOTE
Button                              $0.35     firm-ish (DigiKey list)
Battery                             $2.50      QUOTE — cell mfr direct
PCB fab + SMT assembly              —         QUOTE (section 02)
CNC stainless shells (x2)           —         QUOTE (section 03)
Passives, connector, misc           $1.50      allowance, unquoted
-------------------------------------------------------------------
ELECTRONICS SUBTOTAL (excl. PCB    ≈ $27.35   before PCB + enclosure quotes
  fab/assembly + enclosure)
```
The PCB and enclosure lines are the two biggest unknowns and, on a device
this size, likely the two biggest cost drivers — both require uploading
real files to PCBWay's quote tools before this rolls up into a true
per-unit and 100-unit total. Do not commit the Phase 5 budget without them.

--------------------------------------------------------------------------------
05 // AI-GRADE SENSOR SELECTION — SGI SCORING (SPEC section 06)
--------------------------------------------------------------------------------
Sensor Grade Index (SGI), 0–100, four axes at 25 points each — accuracy,
power, footprint, availability. Scored for the parts selected above:

```
PART                          ACCURACY  POWER  FOOTPRINT  AVAIL.  SGI
----                          --------  -----  ---------  ------  ---
BME280 (weather)                  22      23        20       24    89
BQ51013B-class Qi receiver        20      18        19       22    79
Arducam OV2640 Mini (camera)      18      16        14       21    69
0.96" mono OLED (display)         21      22        17       23    83
```
OV2640's footprint score is the weak point — it is the largest single
component after the battery and the one most likely to force the 6–8mm
enclosure fallback (LOT-PAGER-SPEC.md section 02). If a thinner camera
board surfaces during Phase 0 sourcing, re-score it here before swapping.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-PAGER-BOM
================================================================================
