================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-BOM
TITLE:    LOT® Computer (COSMO® Cube v1.0) — Components Buying List
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-08
VERSION:  1.0 — PILOT RUN (100 UNITS)
COMPANION: docs/corporate/LOT-COSMO-COMPUTER-v1.md (plan) — read that first.
================================================================================

--------------------------------------------------------------------------------
00 // HOW TO READ THIS LIST
--------------------------------------------------------------------------------

Part numbers below are real, commodity, off-the-shelf components (brief item
15 — "AI grade off-the-shelf sensors") chosen because they are stocked at
volume by major distributors, not because they are optimal on paper. Links
point to distributor and fabricator HOMEPAGES/SEARCH, not to specific SKU
pages — SKU availability and pricing move week to week, and a link pinned to
a specific listing goes stale faster than this document is revised. Procure
by searching the part number at the linked distributor at order time.

Prices are August 2026 street estimates for 100-unit quantity, USD.

--------------------------------------------------------------------------------
01 // ELECTRONICS (per unit x 100)
--------------------------------------------------------------------------------

COMPONENT            PART / CLASS              QTY   EST. UNIT   EST. x100   SOURCE
─────────            ────────────              ───   ─────────   ─────────   ──────
MCU + Radio          ESP32-S3-WROOM-1 (N8R2)    1     $2.50       $250        mouser.com , digikey.com
Display              GC9A01 1.28" round LCD     1     $3.20       $320        aliexpress.com , lcsc.com
  or                 ST7789 240x240 sq. LCD     1     $2.80       $280        aliexpress.com , lcsc.com
Camera               OV2640 2MP fixed-focus     1     $3.50       $350        aliexpress.com , digikey.com
Weather sensor       BME280 (temp/humid/press)  1     $2.10       $210        mouser.com , adafruit.com
Wireless charge RX   BQ51013B Qi receiver IC    1     $1.40       $140        mouser.com , digikey.com
Charge coil          Qi-class RX coil, 15x15mm  1     $0.90       $90         lcsc.com
Battery              150mAh LiPo, 20x25x3mm     1     $1.80       $180        adafruit.com , sparkfun.com
Haptic (deferred)    ERM pager vibration motor  1     $0.60       $60         adafruit.com , lcsc.com
Button               Tactile SMD switch, IP54   1     $0.15       $15         digikey.com , lcsc.com
Passives + misc      R/C/decoupling, connectors 1 set $1.50       $150        lcsc.com
Flex/rigid-flex link Display-to-MCU FPC         1     $0.80       $80         lcsc.com
─────────────────────────────────────────────────────────────────────────────────────
ELECTRONICS SUBTOTAL (per unit ≈ $18.35 excl. haptic / $18.95 incl.)  ≈ $1,835–$1,895 / 100 units

--------------------------------------------------------------------------------
02 // PCB FABRICATION + ASSEMBLY
--------------------------------------------------------------------------------

SERVICE               SPEC                                  EST. x100   SOURCE
───────                ────                                  ─────────   ──────
PCB fab + SMT assy    2-layer, ENIG, 40x40mm outline,        $950–$1,400 pcbway.com  (brief item 1)
                       full turnkey (PCBWay sources +
                       places all SMD parts above)
Stencil + tooling      One-time, amortized into the           $80         pcbway.com
                       PCBWay assembly quote
Laser serialization    Per-unit device ID, rear shell         $150        pcbway.com  (add-on service)

PCBWay is the named fabricator (brief item 1) and is used for both bare-PCB
fabrication and SMT assembly in the same order — see plan doc Section 09 for
why a single-vendor PCB+assembly path was chosen for the pilot run.

--------------------------------------------------------------------------------
03 // ENCLOSURE — TWO-PIECE STAINLESS STEEL BODY
--------------------------------------------------------------------------------

PART                  SPEC                                  EST. UNIT   EST. x100   SOURCE
────                  ────                                  ─────────   ─────────   ──────
Front shell            316 stainless, 40x40x2.2mm,           $6.50       $650        CNC/metal-stamping
                       mirror-polished face, brushed          
                       bezel, display + button cutouts        
Rear shell             316 stainless, 40x40x2.8mm,            $5.80       $580        CNC/metal-stamping
                       matte bead-blast, camera + charge       
                       coil pocket, 4x threaded standoff       
Fasteners              4x M1.4 recessed screws (per unit)     $0.20       $20         mcmaster.com

Enclosure fabrication is quoted separately from PCBWay's core PCB service
(plan doc Section 09) — recommended path is a CNC/stamping shop capable of
316 stainless at this tolerance; several PCBWay-adjacent sheet-metal partners
also quote small-lot stainless enclosures and should be RFQ'd against a
dedicated metal shop before the pilot order is placed.

--------------------------------------------------------------------------------
04 // ACCESSORY — WIRELESS CHARGING PAD
--------------------------------------------------------------------------------

Shared accessory across the LOT hardware line (plan doc Section 02) —
one pad design serves both this device and any future CUBIQ hardware
(docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md).

COMPONENT             PART / CLASS              EST. UNIT   EST. x100   SOURCE
─────────             ────────────              ─────────   ─────────   ──────
Qi TX coil + driver    Qi 5W transmitter module   $2.20       $220        mouser.com
Pad enclosure          Flat silver square,        $3.80       $380        CNC/injection, matches
                       4x4cm x 5mm, brushed                    plan doc brief item 4
                       aluminum
USB-C input jack       Standard USB-C receptacle  $0.35       $35         digikey.com

--------------------------------------------------------------------------------
05 // COST ROLLUP (100-UNIT PILOT)
--------------------------------------------------------------------------------

```
CATEGORY                        LOW EST.     HIGH EST.
────────                        ────────     ─────────
Electronics (Section 01)        $1,835       $1,895
PCB fab + assembly (Section 02) $1,180       $1,630
Enclosure (Section 03)          $1,250       $1,250
Charging pad (Section 04)       $635         $635
─────────────────────────────────────────────────────
TOTAL, 100 UNITS + PADS         ≈ $4,900     ≈ $5,410
PER-UNIT (device + pad)         ≈ $49        ≈ $54
```

This is a bill-of-materials + fabrication estimate only — it excludes
firmware/software engineering time, PDF manual production, QC labor, and
fulfillment/shipping. It is sized to compare directly against the NODE-0
rig-spec cost table (docs/technical/LOT-NODE-0-RIG-SPEC.md Section 02) in
the same TOTAL-cost-per-tier format used across LOT hardware documents.

--------------------------------------------------------------------------------
06 // SUPPLIER DIRECTORY
--------------------------------------------------------------------------------

  PCB fab + SMT assembly + enclosure add-ons ..... https://www.pcbway.com
  Passive components, ICs (bulk) .................. https://www.lcsc.com
  Electronic components (distributor) ............. https://www.mouser.com
  Electronic components (distributor) ............. https://www.digikey.com
  Maker-grade breakout modules for prototyping .... https://www.adafruit.com
  Maker-grade breakout modules for prototyping .... https://www.sparkfun.com
  Fasteners / hardware ............................ https://www.mcmaster.com
  Sourcing for cost-sensitive modules (verify each
  listing individually before ordering) ........... https://www.aliexpress.com

  CAUTION: AliExpress listings vary in quality and specification accuracy
  by seller. Every part sourced there for the pilot run must be sample-
  ordered and verified against its datasheet before the 100-unit order is
  placed — this applies especially to the display and camera modules.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-BOM
================================================================================
