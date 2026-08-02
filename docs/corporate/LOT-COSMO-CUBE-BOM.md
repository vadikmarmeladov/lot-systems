<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-BOM
TITLE:    COSMO® Cube — Bill of Materials & Buying List, 100-Unit Pilot Run
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-02
VERSION:  1.0
COMPANION: docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md (physical/industrial spec)
================================================================================

--------------------------------------------------------------------------------
00 // HOW TO READ THIS TABLE
--------------------------------------------------------------------------------

Every line names a real, sourceable part or service and a link to buy or quote
it. Unit costs are current street estimates for small-quantity (100-unit)
orders as of 2026-08; PCB/PCBA/CNC lines are QUOTE-REQUIRED — PCBWay and
similar vendors price CNC stainless and turnkey assembly per exact geometry
and finish, not from a catalog price. Where a vendor link is a search/catalog
page rather than one exact SKU, that is intentional — it stays valid as parts
get revised between BOM passes, which a single frozen product-page link does
not.

--------------------------------------------------------------------------------
01 // MANUFACTURING & FABRICATION  (brief item 1, 3, 13)
--------------------------------------------------------------------------------

COMPONENT                  SPEC                              QTY/UNIT   EST. COST (100 units)   SOURCE
─────────                  ────                              ────────   ─────────────────────   ──────
PCB fabrication            4-layer, 40x40mm outline           1         $3-6 / board             https://www.pcbway.com/
                                                                          ($300-600 lot)
PCBA (turnkey assembly)    SMT placement + reflow +           1         $8-15 / unit              https://www.pcbway.com/orderonline.aspx
                            hand-solder of Qi coil, camera                ($800-1,500 lot)
                            FPC, display FPC
CNC stainless shell,       Side A — mirror-polished           1         $12-22 / unit             https://www.pcbway.com/rapid-prototype/CNC_Machining.html
 Side A                     finish, 40x40x2.5mm, 4x                     ($1,200-2,200 lot)
                            M1.4 countersink taps
CNC stainless shell,       Side B — brushed finish,           1         $14-25 / unit             https://www.pcbway.com/rapid-prototype/CNC_Machining.html
 Side B                     40x40x2.5mm, camera window,                 ($1,400-2,500 lot)
                            micro-perf weather vent, laser-
                            cut button/screen cutouts
Fasteners                  M1.4 x 3mm stainless               4         <$0.10 / unit             https://www.mcmaster.com/products/screws/
                            countersunk machine screws                   ($10-20 lot)                (search: "M1.4 stainless
                                                                                                        countersunk screw")

  NOTE — SINGLE-VENDOR PILOT (brief item 1): both PCB fab/assembly and CNC
  shell machining are sourced from PCBWay for the 100-unit pilot. PCBWay
  runs both services under one account/shipment, which is the point for a
  one-inventor pilot — one vendor relationship, one consolidated shipment,
  one quote thread to manage instead of three.

--------------------------------------------------------------------------------
02 // ELECTRONICS  (brief items 5, 6, 14, 15, 19)
--------------------------------------------------------------------------------

COMPONENT                  SPEC                              QTY/UNIT   EST. COST (100 units)   SOURCE
─────────                  ────                              ────────   ─────────────────────   ──────
MCU / Wi-Fi module         ESP32-S3 (Wi-Fi + BLE, camera      1         $3.50-5.50 / unit         https://www.digikey.com/en/products/result?keywords=ESP32-S3-WROOM-1
                            DVP interface, hardware crypto              ($350-550 lot)             https://www.mouser.com/c/?q=ESP32-S3-WROOM-1
                            for token storage)
Camera module              OV2640, 2MP, small-form FPC        1         $4-7 / unit               https://www.arducam.com/
                            camera (ESP32-camera reference               ($400-700 lot)             https://www.digikey.com/en/products/result?keywords=OV2640
                            design; well-documented driver
                            stack)
Display                    1.3-1.5" square/round thin         1         $6-10 / unit              https://www.waveshare.com/product/displays.htm
                            IPS/LCD module, no touch layer               ($600-1,000 lot)          https://www.digikey.com/en/products/result?keywords=1.3in%20TFT%20display%20module
                            (SPI interface, fits 0.6mm
                            thickness budget)
Weather sensor             Bosch BME280 — temperature /       1         $3-6 / unit               https://www.digikey.com/en/products/result?keywords=BME280
                            humidity / pressure combined,               ($300-600 lot)             https://www.mouser.com/c/sensors/humidity-moisture-sensors/?q=BME280
                            I2C, factory-calibrated ("AI                                            https://www.adafruit.com/product/2652
                            grade off-the-shelf," brief 15)
Wireless charge receiver   Qi-class receiver IC + coil,       1         $3-5 / unit               https://www.digikey.com/en/products/result?keywords=BQ51013B
                            thin-profile (fits 40x40mm                  ($300-500 lot)             https://www.adafruit.com/product/1901
                            footprint, brief items 12/19)
Battery                    Thin-format LiPo pouch cell,       1         $2-4 / unit               https://www.digikey.com/en/products/result?keywords=lipo%20pouch%20cell%20thin
                            ~150-250mAh, sized to internal              ($200-400 lot)
                            keep-out (Section 03 of
                            hardware spec)
Tactile button (COPY)      Low-profile SMD tactile switch,    1         $0.10-0.30 / unit         https://www.digikey.com/en/products/result?keywords=low%20profile%20smd%20tactile%20switch
                            side-actuated, rated >1M cycles             ($10-30 lot)
Passives / misc            Decoupling caps, LED indicator,    —         $1-2 / unit               https://www.lcsc.com/
                            pull-ups, ESD protection                    ($100-200 lot)

  AI-GRADE SENSOR NOTE: BME280 is selected because it is a commodity part
  with a public, stable register map and factory calibration coefficients
  baked in — exactly the "clean, well-characterized output a model can
  consume directly" definition used in the hardware spec (Section 03).
  It is not a novel or proprietary sensor; it is the same class already
  referenced as a weather sensor in docs/corporate/LOT-TERMINAL-M2M.md's
  multi-sensor array example.

--------------------------------------------------------------------------------
03 // PER-UNIT COST ROLLUP  (100-unit pilot)
--------------------------------------------------------------------------------

CATEGORY                              LOW EST.        HIGH EST.
────────                              ────────        ─────────
Manufacturing/fab (Section 01)        $29.10          $52.10
Electronics (Section 02)              $22.60          $37.80
                                       ──────          ──────
UNIT SUBTOTAL                         $51.70          $89.90
NRE (tooling, first-article, setup —  amortized across 100 units, not
 CNC fixtures, PCBA stencil, etc.)     per PCBWay quote; typically
                                       $500-1,500 one-time for a run
                                       this size, i.e. +$5-15/unit
                                       ──────          ──────
ESTIMATED LANDED UNIT COST            ~$57-105        depending on finish
                                                       tolerance and quote
────────────────────────────────────────────────────────────────────────
100-UNIT PILOT TOTAL (materials only, ex-NRE):     ≈ $5,170 - $8,990
100-UNIT PILOT TOTAL (incl. one-time NRE):         ≈ $5,670 - $10,490

  These are planning-stage estimates from public street pricing and vendor
  catalog ranges, not binding quotes. The next real step (see
  LOT-COSMO-CUBE-ROADMAP.md, Phase 1) is a PCBWay CNC + PCBA combined quote
  against the exact CAD file, which will tighten this range to a firm
  number before the 100-unit commitment is placed.

--------------------------------------------------------------------------------
04 // WHAT THIS BOM DELIBERATELY EXCLUDES
--------------------------------------------------------------------------------

  - Retail packaging, printed manual (the PDF manual, brief item 7, is a
    documentation deliverable, not a per-unit manufacturing cost).
  - Certification (FCC/CE) — required before any commercial sale of a
    Wi-Fi + camera device, not required for a 100-unit internal/pilot
    build. Flagged as a hard gate in the roadmap, not priced here.
  - Wireless charging PAD (the transmitter side) — brief item 19 and the
    hardware spec's charge interface (Section 02) both describe COSMO®
    Cube as the RECEIVER. Any Qi-compliant charging pad works; none is
    bundled or priced as part of the unit BOM.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-BOM
================================================================================
