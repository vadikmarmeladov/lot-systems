================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-BOM-v1
TITLE:    COSMO® Computer — Components Buying List & 100-Unit Cost Roll-Up
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-05
VERSION:  1.0 — companion to LOT-COSMO-COMPUTER-v1
PARENT:   docs/corporate/LOT-COSMO-COMPUTER-v1.md (Section 10, item 2)
================================================================================

--------------------------------------------------------------------------------
00 // HOW TO READ THIS LIST
--------------------------------------------------------------------------------

Every line item below is a real, currently-manufactured commodity part class
(brief point 15: "AI grade off-the-shelf sensors" — read as commodity-
qualified, not custom silicon), sourced from named real suppliers. Links
point to each supplier's stable SEARCH or ORDER entry point, not to a single
fabricated product page — part numbers and quantities are given in the table
so the actual SKU can be located and price-confirmed at order time, since
distributor pricing and stock shift week to week. Prices below are PLANNING
ESTIMATES for the 100-unit pilot run (Section 06 of the parent document),
not quotes. Nothing in this document authorizes a purchase order.

--------------------------------------------------------------------------------
01 // ELECTRONICS BOM (PER UNIT, x100 FOR THE PILOT RUN)
--------------------------------------------------------------------------------

  REF   PART CLASS              CANDIDATE PART            QTY/UNIT   EST. UNIT COST
  ----  -----------------------  -------------------------  --------   --------------
  U1    MCU / Wi-Fi+BLE SoC      Espressif ESP32-S3-WROOM-1  1          $2.50 - $4.00
                                  (8MB flash / 8MB PSRAM)
  U2    Camera module            OV2640 (2MP, DVP/SPI) or    1          $3.00 - $6.00
                                  OV5640 (5MP)
  U3    E-paper display          1.54" e-paper module,       1          $8.00 - $14.00
                                  monochrome or 3-color, SPI
                                  (GDEY0154-class)
  U4    Weather sensor           Bosch BME280                1          $1.50 - $3.00
                                  (temp/humidity/pressure), I2C
  U5    Wireless charge          Qi receiver coil +          1          $2.00 - $4.00
        receiver + PMIC          BQ51013B-class receiver IC
  U6    LiPo charge/protect IC   Single-cell Li-Po charger    1         $0.50 - $1.00
                                  + protection IC
  U7    Battery                  LiPo pouch cell, 250-350mAh  1         $2.00 - $3.50
  U8    Button                   SMD tactile switch,          1         $0.10 - $0.30
                                  "Copy" cap (custom-marked)
  U9    PCB (4-layer, ~34x34mm)  Custom, per parent doc       1         $1.50 - $3.00
                                  Section 03/06 spec              (at 100-unit qty,
                                                                    PCBWay fab only)
  U10   Passives + regulators    Resistors, caps, LDO,        1 set     $1.00 - $2.00
                                  ESD protection
  U11   FPC/connectors           Camera + display flex          2       $0.50 - $1.00
                                  connectors

  ELECTRONICS SUBTOTAL (per unit, parts only):        ~$22.60 - $41.80
  PCBWay SMT ASSEMBLY (per unit, 100-unit run):       ~$5.00 - $10.00 (labor + setup,
                                                        amortized — see Section 03)

--------------------------------------------------------------------------------
02 // ENCLOSURE BOM (PER UNIT, x100)
--------------------------------------------------------------------------------

  REF   PART CLASS              SPEC                        QTY/UNIT   EST. UNIT COST
  ----  -----------------------  -------------------------  --------   --------------
  E1    Top shell                316 stainless steel,        1         $6.00 - $12.00
                                  CNC-machined, polished
                                  mirror finish, ~40x40x2.5mm
  E2    Base shell               316 stainless steel,        1         $8.00 - $15.00
                                  CNC-machined, matte
                                  bead-blast around screen
                                  window, ~40x40x2.5mm
  E3    RF/charge insert ring    Non-metal composite          1         $1.00 - $2.50
                                  (ABS/PC, stainless-finish
                                  PVD coat), machined or
                                  injection-molded
  E4    Fasteners / seal         Shell-to-shell screws or     1 set     $0.30 - $0.80
                                  press-fit hardware, gasket
  E5    Elastomer feet           4x, non-marking, desk-safe   4         $0.20 - $0.40

  ENCLOSURE SUBTOTAL (per unit, 100-unit CNC run):    ~$15.50 - $30.70

--------------------------------------------------------------------------------
03 // CHARGING PAD (COMPANION ACCESSORY, PER UNIT, x100)
--------------------------------------------------------------------------------

  REF   PART CLASS              SPEC                        QTY/UNIT   EST. UNIT COST
  ----  -----------------------  -------------------------  --------   --------------
  P1    Qi wireless transmitter  15W-class Qi transmitter     1         $3.00 - $6.00
        coil + driver IC         module, off-the-shelf
  P2    Pad enclosure            Flat base, brand-neutral     1         $2.00 - $4.00
                                  material at v1.0 (not
                                  scoped to stainless — see
                                  parent doc Section 07 open
                                  items)
  P3    USB-C power input +      Cable + AC adapter,          1 set     $2.50 - $4.50
        adapter                  off-the-shelf

  CHARGING PAD SUBTOTAL (per unit companion, x100):   ~$7.50 - $14.50

--------------------------------------------------------------------------------
04 // SUPPLIER DIRECTORY (SEARCH / ORDER ENTRY POINTS)
--------------------------------------------------------------------------------

Distributor and fabrication links below go to each vendor's stable search or
quote entry point — confirm exact SKU, stock, and price at order time.

  PCB FABRICATION + SMT ASSEMBLY + CNC (brief point 1)
    PCBWay — PCB + PCBA instant quote:
      https://www.pcbway.com/orderonline.aspx
    PCBWay — CNC machining (stainless shells, Section 02 E1/E2/E3):
      https://www.pcbway.com/rapid_prototyping.html

  COMPONENT DISTRIBUTORS (electronics BOM, Section 01)
    DigiKey — part search:
      https://www.digikey.com/en/products
    Mouser Electronics — part search:
      https://www.mouser.com/c/
    LCSC (China-side sourcing, common PCBWay PCBA pairing):
      https://www.lcsc.com/

  MODULE / HOBBYIST-GRADE SOURCES (prototyping stage, pre-100-unit run)
    Adafruit — ESP32-S3, e-paper, BME280 breakout boards for bring-up:
      https://www.adafruit.com/
    SparkFun — sensor and display breakouts for bring-up:
      https://www.sparkfun.com/

  BATTERY
    LiPo pouch cells, UL-certified suppliers listed via Mouser/DigiKey
    search above — no dedicated third-party link needed at BOM stage.

--------------------------------------------------------------------------------
05 // 100-UNIT COST ROLL-UP (PLANNING ESTIMATE, NOT A QUOTE)
--------------------------------------------------------------------------------

  CATEGORY                          LOW EST.        HIGH EST.
  ---------------------------------  --------------  --------------
  Electronics BOM (Section 01)       $22.60          $41.80
  PCBWay SMT assembly (Section 01)   $5.00           $10.00
  Enclosure, CNC stainless           $15.50          $30.70
  (Section 02)
  Charging pad companion             $7.50           $14.50
  (Section 03)
  ---------------------------------  --------------  --------------
  PER-UNIT TOTAL                     $50.60          $97.00
  x 100 UNITS                        $5,060          $9,700

  This range excludes: firmware/software engineering time, tooling and
  fixture cost for hand-assembly (parent doc Section 06 step 3), shipping,
  import duties, and QA labor. It is a materials-and-fabrication planning
  number only, meant to be replaced by PCBWay's actual instant-quote output
  once a physical prototype BOM is finalized — this document is the input
  to that quote, not a substitute for it.

  CONTEXT AGAINST EXISTING LOT PRICING
    LOT_ROBOTICS_COSMO.md's own revenue table prices "COSMO® Hardware" at
    $2,500-$5,000 per unit at Phase 3 (2028-2029) — a fully different
    product tier (full robotics platform) from this document's desk-object
    pilot. The $50-$97/unit materials estimate here is not in tension with
    that figure; it confirms the pilot-scale Puck is a materials-cheap,
    engineering-expensive object at 100 units, which is exactly the profile
    a pilot run should have before any Phase-3 pricing commitment.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-BOM-v1
================================================================================
