<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-BOM
TITLE:    LOT® Computer — Bill of Materials & Component Sourcing
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-03
================================================================================

Companion to docs/corporate/LOT_COMPUTER_HARDWARE_PLAN_v1.md — read that first
for the architecture each line item below implements. All links below were
verified live via web search on 2026-08-03; part numbers marked "NRND" or
"confirm at order time" are flagged because distributor stock/lifecycle
status changes independently of this document and must be re-checked before
a purchase order is cut. Prices are per-unit distributor list price at the
cited break quantity, not a negotiated PCBWay/factory quote — the 100-unit
"ROUGH TOTAL" at the bottom is an estimation baseline for planning, not a
purchase-ready quote.

--------------------------------------------------------------------------------
0 // MANUFACTURING / ASSEMBLY PARTNER (brief point 1)
--------------------------------------------------------------------------------

  SERVICE                    SUPPLIER   LINK
  ─────────────────────────  ────────   ──────────────────────────────────
  PCB fab + SMT assembly     PCBWay     https://www.pcbway.com/
  CNC machining, 316/316L    PCBWay     https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-316-316L/
  General CNC milling info   PCBWay     https://www.pcbway.com/rapid-prototyping/CNC-machining/CNC-Milling.html

  Single-vendor rationale: hardware plan Section 04.1 — one supplier holds
  accountability if the PCB outline and the machined enclosure cavity
  disagree on tolerance.

--------------------------------------------------------------------------------
1 // MAIN BOARD (compute + radio)
--------------------------------------------------------------------------------

  PART                          MFR          SUPPLIER LINK                                                                              EST. UNIT PRICE (qty 100)
  ─────────────────────────     ──────────   ─────────────────────────────────────────────────────────────────────────────────────────  ─────────────────────────
  ESP32-S3-WROOM-1-N8R8         Espressif    https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N8R8/15295891  ~$6.30
  (WiFi 802.11 b/g/n + BLE 5, 8MB flash, 8MB PSRAM — PSRAM headroom carries
  the camera frame buffer for the on-device presence-detection pass in
  hardware plan Section 04.5, even though no frame ever leaves the chip)

  4-layer rigid PCB, ~34mm x   PCBWay       https://www.pcbway.com/                                                                        ~$4.50 (bare board,
  34mm, ENIG finish                                                                                                                          qty 100, PCBWay quote)
  SMT assembly (both sides)   PCBWay       https://www.pcbway.com/                                                                        ~$9-14 (labor + qty 100
                                                                                                                                             assembly fee, PCBWay quote)

--------------------------------------------------------------------------------
2 // DISPLAY (renders the pager text, hardware plan 04.2)
--------------------------------------------------------------------------------

  PART                                MFR/SELLER   LINK                                                              EST. UNIT PRICE
  ─────────────────────────────       ──────────   ───────────────────────────────────────────────────────────────  ───────────────
  1.28" 240x240 round TFT, GC9A01A    Adafruit     https://www.adafruit.com/product/6178                              $16.50 (EVT/breakout
  (EYESPI breakout — EVT/DVT stage                                                                                      qty, not production)
  only, Section 04 v0.1-v0.2)
  Bare GC9A01 240x240 round LCD       Makerfabs    https://www.makerfabs.com/gc9a01-1-28-inch-round-lcd-module.html   ~$7-9 (bare panel,
  panel (production, PVT+)                                                                                              volume quote pending)

  Display window inset: 32.4mm active circle centered in the 40mm square
  Face B, ~3.8mm bezel margin per side (hardware plan Section 04.3/04.4).

--------------------------------------------------------------------------------
3 // SENSORS (weather + AI-grade, brief points 14-15)
--------------------------------------------------------------------------------

  PART                       MFR         SUPPLIER LINK                                                                            EST. UNIT PRICE (qty 100)
  ────────────────────────   ─────────   ───────────────────────────────────────────────────────────────────────────────────────  ─────────────────────────
  BME688                    Bosch        https://www.digikey.com/en/products/detail/bosch-sensortec/BME688/13681287               ~$6.00
  (temp/humidity/pressure/gas-index, single part covers hardware plan 04.7
  weather sensor requirement — 3.0 x 3.0 x 0.9mm package, fits the 5.1mm
  z-stack budget with margin)

  BHI260AP                  Bosch        https://www.digikey.com/en/products/detail/bosch-sensortec/BHI260AP/13681260             ~$4.00
  (self-learning 6-axis IMU w/ on-die fusion core — "AI-grade," hardware
  plan 04.8; offloads gesture/tap classification from the main MCU)

  SGP41                     Sensirion    https://sensirion.com/products/catalog/SGP41                                             ~$5.50 (confirm
  (VOC + NOx index sensor, on-chip Gas Index Algorithm — "AI-grade,"                                                                distributor stock
  hardware plan 04.8; DFN 2.44 x 2.44 x 0.85mm)                                                                                     at order time)

  OV2640 2MP DVP camera     OmniVision   https://www.mouser.com/c/optoelectronics/cameras-accessories/cameras-camera-modules/?q=OV2640   ~$4-6 (bare DVP
  module (bare, no USB                  (search category — bare embedded modules commonly sourced from Arducam                     module, volume quote
  bridge)                               at this volume; USB-bridge variant for bench reference only, e.g.                          pending)
                                          https://www.digikey.com/en/products/detail/leopard-imaging-inc/LI-OV2640-USB-M7/21324041)

  Himax HX-WE2 (WiseEye2)   Himax        NOT IN v1.0 BOM — named in hardware plan 04.8 as the v2.0 upgrade path only.
  AI vision co-processor                Do not source for the 100-unit pilot run.

--------------------------------------------------------------------------------
4 // BUTTON (brief point 16)
--------------------------------------------------------------------------------

  PART              MFR     SUPPLIER LINK                                                                          EST. UNIT PRICE (qty 100)
  ───────────────   ─────   ───────────────────────────────────────────────────────────────────────────────────    ─────────────────────────
  B3S-1000          Omron   https://www.digikey.com/en/products/detail/omron-electronics-inc-emc-div/B3S-1000/20686  ~$1.40
  (SPST-NO SMT tactile switch, IP67-sealed per IEC-60529 — sits behind the
  stainless "COPY" bezel, hardware plan 04.9)

  Side-lit LED (single color, low-current) — generic 0603 SMT LED, sourced
  as part of the PCBWay SMT assembly BOM line, not itemized separately.

--------------------------------------------------------------------------------
5 // POWER: BATTERY + WIRELESS CHARGING (brief points 12, 19)
--------------------------------------------------------------------------------

  PART                         MFR/SELLER      SUPPLIER LINK                                        EST. UNIT PRICE
  ──────────────────────────   ─────────────   ──────────────────────────────────────────────────    ───────────────
  LiPo pouch cell, ~350-400    Adafruit         https://www.adafruit.com/category/138 (category —      ~$6-8 at Adafruit
  mAh, ultra-thin (~1.8mm)                      exact 40x35x1.8mm profile not stocked off-the-shelf;     retail; custom-thin
                                                 at 100-unit MOQ, source directly from a pouch-cell       cell likely cheaper
                                                 manufacturer to the exact thickness/footprint —          per-unit at volume
                                                 confirm supplier and MOQ pricing at detailed design,
                                                 do not assume Adafruit retail pricing scales to 100u)

  STWLC03 wireless power       STMicro-         https://www.st.com/en/power-management/stwlc03.html   ~$1.80 (confirm
  receiver IC                  electronics                                                             distributor stock;
  (Qi-class inductive receiver, current ST wearable-optimized part;                                     predecessor STWLC33JR
  predecessor STWLC33JR confirmed NRND during 2026-08-03 sourcing pass —                                is NRND per 2026-08-03
  do not design in STWLC33JR)                                                                           search)

  Macor machinable glass-      Corning /       https://www.mcmaster.com/products/macor-ceramic/       ~$3-5 per 22mm disc
  ceramic disc, 22mm dia.,     McMaster-Carr                                                            (cut to size)
  ~1mm thick — non-metal
  charging window insert,
  Face A (hardware plan 04.6)

  Silicone gasket (IP54        McMaster-Carr   https://www.mcmaster.com                                ~$0.50
  seal), custom-cut ring
  matching the two-shell
  perimeter (hardware plan 04.3)

--------------------------------------------------------------------------------
6 // ENCLOSURE (brief points 3, 4, 17, 18)
--------------------------------------------------------------------------------

  ITEM                                    SUPPLIER   LINK                                                                            EST. UNIT PRICE (qty 100, pair)
  ──────────────────────────────────────  ────────   ─────────────────────────────────────────────────────────────────────────────    ─────────────────────────────
  Face A — 316L, mirror-polished,         PCBWay     https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/    ~$14-20 (pair, CNC
  Macor charging-window cutout                       Stainless-steel-316-316L/                                                          machining + polish
  Face B — 316L, bead-blasted matte,                                                                                                     finish, PCBWay
  camera/display/button apertures                                                                                                        quote pending)

  4x M1.6 stainless countersunk screws — generic hardware-store/McMaster
  fastener stock, ~$0.20/unit set.

--------------------------------------------------------------------------------
7 // ROUGH PER-UNIT AND 100-UNIT TOTALS
--------------------------------------------------------------------------------

  CATEGORY                          EST. UNIT COST
  ───────────────────────────────   ──────────────
  Main board (MCU + PCB + SMT)      $20.30
  Display                           $8.00 (production bare panel)
  Sensors (BME688+BHI260AP+SGP41+
  camera)                           $18.00
  Button + misc SMT                 $1.90
  Battery + Qi receiver + Macor +
  gasket                            $12.30
  Enclosure (CNC pair + screws)     $17.20
  ───────────────────────────────   ──────────────
  ESTIMATED UNIT COST (BOM only)    ~$77.70
  ESTIMATED 100-UNIT BOM TOTAL      ~$7,770

  NOT INCLUDED IN THE ABOVE (call out per hardware plan Section 07):
    - PCBWay tooling/setup NRE for CNC fixtures (one-time, not per-unit)
    - EVT/DVT hand-assembly labor (Sections 05 hardware plan, weeks 1-16)
    - FCC/CE radio certification and UN38.3 battery certification fees
    - Firmware/software development labor (separate from BOM by definition)
    - Shipping, duties, and PCBWay expedite fees

  This total is a planning-grade estimate assembled from distributor list
  pricing at small-to-mid quantities, not a PCBWay factory quote. The next
  concrete step per docs/corporate/LOT-COMPUTER-ROADMAP.md v0.2 is to submit
  this BOM to PCBWay for an actual Qty-100 SMT + CNC quote and replace every
  "EST." line above with a quoted number.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COMPUTER-BOM
================================================================================
