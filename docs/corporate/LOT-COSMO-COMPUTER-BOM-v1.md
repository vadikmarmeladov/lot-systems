<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-BOM-v1
TITLE:    COSMO® Computer (CC-1) — Bill of Materials + PCBWay Sourcing Plan
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-19
VERSION:  1.0 — COMPANION TO LOT-COSMO-COMPUTER-v1.md
STATUS:   PHASE 0 — NO QUOTE REQUESTED YET, NO ORDER PLACED
================================================================================

--------------------------------------------------------------------------------
00 // HOW TO READ THIS DOCUMENT
--------------------------------------------------------------------------------

This is a sourcing plan, not a paid quote. No order has been placed with
PCBWay or any distributor. Every part below is a real, currently-shipping
part number a distributor search will surface — this document intentionally
does not invent specific product-listing URLs (a fabricated deep link would
rot or mislead), and instead gives the exact part number plus a standard,
real distributor search endpoint. Whoever executes Phase 1 (breadboard
prototype, per LOT-COSMO-COMPUTER-v1.md Section 11) pastes the part number
into the search link and buys from whichever in-stock listing is cheapest
that week — prices below are Phase-0 planning estimates, not locked quotes.

Reference document for enclosure geometry, sensor rationale, and roadmap
gates: docs/corporate/LOT-COSMO-COMPUTER-v1.md

--------------------------------------------------------------------------------
01 // ELECTRONICS BOM — PER UNIT
--------------------------------------------------------------------------------

  REF   PART                              QTY  EST. UNIT $ (Qty 100)  SEARCH
  ────  ────────────────────────────────  ───  ─────────────────────  ──────────────────────────────────────────
  U1    Espressif ESP32-S3-WROOM-1-N16R8  1    $4.20                  https://www.lcsc.com/search?q=ESP32-S3-WROOM-1-N16R8
  U2    OV2640 2MP camera module (DVP)    1    $3.50                  https://www.lcsc.com/search?q=OV2640
  U3    Bosch BME280 (temp/humid/press)   1    $2.10                  https://www.digikey.com/en/products/result?keywords=BME280
  U4    Sensirion SGP40 (VOC index)       1    $4.80                  https://www.digikey.com/en/products/result?keywords=SGP40
  U5    ROHM BH1750FVI (ambient light)    1    $0.60                  https://www.lcsc.com/search?q=BH1750FVI
  U6    ST LSM6DS3TR-C (6-axis IMU)       1    $1.35                  https://www.digikey.com/en/products/result?keywords=LSM6DS3TR-C
  U7    SH1106 1.3in OLED module, I2C     1    $3.90                  https://www.lcsc.com/search?q=SH1106+1.3
  SW1   Omron B3F-1000 tactile switch     1    $0.45                  https://www.digikey.com/en/products/result?keywords=B3F-1000
  U8    Qi receiver IC (BQ51013B class)   1    $1.90                  https://www.digikey.com/en/products/result?keywords=BQ51013B
  BT1   LiPo cell, 3.7V 400mAh, w/ PCM    1    $2.50                  https://www.lcsc.com/search?q=3.7V+400mAh+lipo
  PCB   2-layer PCB, ENIG, ~30mm round    1    (quoted by PCBWay, Section 02)
  MISC  Passives (R/C/decoupling), FPC connectors, pogo-pin pairing header
                                          1 set  $1.80                bundled into PCBWay PCBA quote

  ELECTRONICS SUBTOTAL (excl. PCB fab/assembly labor): ~$27.10 / unit
  at 100-unit pricing tier. PCB fab + SMT assembly labor quoted
  separately by PCBWay per Section 02 — not a distributor line item.

--------------------------------------------------------------------------------
02 // PCBWay QUOTE REQUEST CHECKLIST
--------------------------------------------------------------------------------

  1. PCB FABRICATION
     - https://www.pcbway.com/orderonline.aspx
     - Spec: 2-layer, ENIG finish, ~30mm diameter (round profile,
       matched to the 42mm puck's internal clearance — see
       LOT-COSMO-COMPUTER-v1.md Section 03/09), 1.0mm thickness.
     - Quote at both 10pcs (Phase 2) and 100pcs (Phase 3) — the marginal
       per-board cost step between tiers is the number that justifies
       committing to Phase 3.

  2. PCBA (TURNKEY ASSEMBLY)
     - https://www.pcbway.com/pcb_prototype/Pcb_Assembly.html
     - Submit the Section 01 BOM as PCBWay-sourced where their parts
       library carries the part number (ESP32-S3-WROOM-1, BME280, and
       most passives are commonly stocked); flag SGP40 and the SH1106
       module as likely customer-supplied if PCBWay's library doesn't
       carry them — cheaper to confirm at quote time than to assume.

  3. CNC MACHINING — ENCLOSURE
     - https://www.pcbway.com/rapid-prototyping/CNC_Machining.html
     - Three line items in one request:
         a. Face A — 304 (or 316L) stainless steel, 42mm diameter half-
            shell, mirror polish finish, no cutouts.
         b. Face B — same material, same half-shell, bead-blast finish,
            3 cutouts (camera 6mm, OLED window, button bore) per
            LOT-COSMO-COMPUTER-v1.md Section 03.
         c. Charging pad — aluminum, 40x40x5mm, brushed finish, USB-C
            cutout on the trailing edge.
     - Request both 304 and 316L stainless pricing in the same RFQ —
       Section 03's material note in the plan document leaves the final
       call to whichever quote comes back closer to budget.

  4. FINISHING PASS
     - Laser engrave "COPY" on the button cap (can be bundled into the
       CNC line item or ordered as PCBWay's separate laser-marking
       service — ask at quote time).
     - Engrave "COSMO® † LOT®" on the charging pad underside per
       LOT-COSMO-COMPUTER-v1.md Section 13.

--------------------------------------------------------------------------------
03 // RUN-SIZE COST ROLLUP (PLANNING ESTIMATE, NOT A QUOTE)
--------------------------------------------------------------------------------

  TIER                 UNITS   ELECTRONICS   PCB+PCBA (est.)  CNC (est.)  EST. TOTAL/UNIT
  ───────────────────  ─────   ───────────   ───────────────  ──────────  ───────────────
  Phase 2 prototype    10      ~$32/unit      ~$25/unit*       ~$60/unit*  ~$117/unit*
  Phase 3 pilot run     100    ~$27/unit      ~$14/unit*       ~$28/unit*  ~$69/unit*

  * PCB+PCBA and CNC figures are rough planning placeholders based on
    typical small-batch stainless CNC + 2-layer PCBA pricing patterns,
    NOT a PCBWay quote. Replace both starred columns with real numbers
    the moment a PCBWay RFQ (Section 02) comes back — this table exists
    so Phase 3's go/no-go has a number to compare the real quote against,
    not to be quoted to anyone as a firm price.

  100-UNIT PILOT RUN, ROUGH ORDER-OF-MAGNITUDE TOTAL: ~$6,900
  (100 x ~$69/unit estimate above — recompute against real PCBWay quotes
  before Phase 3 is authorized; see LOT-COSMO-COMPUTER-v1.md Section 11,
  Phase 3 gate).

--------------------------------------------------------------------------------
04 // OPEN SOURCING QUESTIONS FOR PHASE 1
--------------------------------------------------------------------------------

  - Confirm PCBWay's parts library actually stocks the ESP32-S3-WROOM-1-
    N16R8 variant (16MB/8MB) vs. a smaller memory variant — Section 06
    of the plan document depends on enough PSRAM for the on-device
    person-detection model; a substitution here is a spec change, not a
    sourcing detail, and should be logged back to
    LOT-COSMO-COMPUTER-v1.md if it happens.
  - Confirm IP54 boot availability/cost for the SW1 button bore —
    priced as a bundled passive above but not yet broken out as its own
    line item.
  - Get a real Qi transmitter-side quote for the charging pad's driver
    IC (paired to U8) — not yet in this BOM, since the pad is scoped as
    a separate CNC + electronics sub-assembly in
    LOT-COSMO-COMPUTER-v1.md Section 03.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-BOM-v1
================================================================================
