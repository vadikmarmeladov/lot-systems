<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-BOM
TITLE:    COSMO® Terminal (T-1) — Components Buying List + 100-Unit Costing
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
COMPANION TO: docs/corporate/LOT-COSMO-COMPUTER-v1.md
DATE:     2026-08-29
================================================================================

NOTE ON PRICING: unit prices below are single-quantity list prices from the
cited vendor pages, current as of this session. They are reference points for
budgeting a 100-unit pilot, not a locked quote — PCBWay and any distributor
should be asked for an actual volume quote before ordering. Every link below
was checked live this session (web search), not recalled from memory.

--------------------------------------------------------------------------------
01 // ELECTRONICS — PER-UNIT (TERMINAL + DOCK)
--------------------------------------------------------------------------------

COMPONENT                      PART / MODULE                 UNIT $   LINK
──────────────────────────    ────────────────────────────   ──────   ────────────────────────────────────────────
Compute + display (combo)     Waveshare ESP32-S3-LCD-1.28    ~$14     https://www.waveshare.com/esp32-s3-lcd-1.28.htm
  (dual-core, 1.28" round GC9A01 LCD 240x240, 6-axis IMU, Li-ion charge mgmt — reference board de-risks compute/display pairing before the custom carrier board is cut)

Camera module                 Arducam OV2640 2MP, DVP 24-pin  ~$10     https://www.arducam.com/arducam-ov2640-camera-module-2mp-mini-ccm-compact-camera-modules-compatible-with-arduino_m0031esp32-esp8266-development-board-with-dvp-24-pin-interface_.html
  (alt reference: Espressif ESP32-S3-EYE, integrated cam+LCD+mic —  https://www.adafruit.com/product/5955 / https://www.digikey.ca/en/products/detail/espressif-systems/ESP32-S3-EYE/17887518 — used for firmware bring-up, not the shipping BOM)

Weather sensor                 Adafruit BME280 (STEMMA QT)     $14.95   https://www.adafruit.com/product/2652
  (temp / humidity / barometric pressure, I2C)

Qi wireless receiver           Adafruit Universal Qi Receiver  $7.95    https://www.adafruit.com/product/1901
  (BQ51013B, 5V/500mA out — goes inside the Terminal shell)

Qi wireless transmitter        Adafruit Universal Qi Transmitter $14.95 https://www.adafruit.com/product/2162
  (goes inside the Dock; 5W max, 2-8mm charge distance)

Tactile button (COPY)          Generic sealed tactile switch    ~$0.50   sourced with the PCBWay SMT assembly order (below)

LiPo cell (3.7V, small-format) ~$3.50   sourced with PCBWay assembly order; exact mAh set at prototype per 22mm height budget

USB-C charge/power circuit     Discrete on Dock PCB (BOM'd into PCB fab, not a separate module)

──────────────────────────────────────────────────────────────────────────────
ELECTRONICS SUBTOTAL, PER UNIT (list price, single-qty):        ≈ $65

--------------------------------------------------------------------------------
02 // MECHANICAL — PCBWAY MANUFACTURING
--------------------------------------------------------------------------------

SERVICE                         PCBWAY PAGE                                              NOTE
──────────────────────────      ─────────────────────────────────────────────────────    ────────────────────────────
PCB fab + SMT assembly          https://www.pcbway.com/rapid-prototyping/manufacture/?type=2   Carrier board(s): Terminal board + Dock board
CNC machining, stainless        https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/   316 stainless, both shell halves + Dock plate
CNC quote form                  https://www.pcbway.com/pcbdesign/quoteenclosure                Submit CAD once mechanical design is locked (Section 08 gate)
CNC machining overview          https://www.pcbway.com/rapid-prototyping/cnc-machining/         General capability reference

Per-unit mechanical cost (stainless CNC shell x2 halves + Dock plate, bead-
blast + one mirror-polish pass) is CAD-dependent and must come from an actual
PCBWay quote once the Section 02 dimensions in the main plan are locked into a
model. Placeholder used for this pilot budget, pending real quote: **$35/unit**
(consistent with small-part precision-CNC stainless pricing at 100-pc volume;
to be replaced with PCBWay's real number before ordering — do not order
against this placeholder).

--------------------------------------------------------------------------------
03 // 100-UNIT PILOT RUN — COST MODEL
--------------------------------------------------------------------------------

LINE ITEM                                  PER UNIT      x100 UNITS
─────────────────────────────────────      ─────────     ───────────
Electronics (Section 01)                    ≈ $65          ≈ $6,500
Mechanical / CNC stainless (Section 02)     ≈ $35 (placeholder, quote pending)  ≈ $3,500
PCB fab + SMT assembly (Section 02)         ≈ $12 (typical small-batch SMT)     ≈ $1,200
Gasket, screws, misc hardware                ≈ $2           ≈ $200
─────────────────────────────────────      ─────────     ───────────
SUBTOTAL                                    ≈ $114/unit    ≈ $11,400
Contingency (15% — first hardware run)                      ≈ $1,710
─────────────────────────────────────      ─────────     ───────────
PILOT RUN TOTAL (ESTIMATE)                                 ≈ $13,100

This lands the 100-unit pilot in the same order of magnitude as LOT's own
NODE-0 "serious" server build (docs/corporate/LOT_Autonomous_AI_Server.md,
Section 01: ≈$10,550) — i.e., a company-scale hardware commitment, not a
hobby order, and should be reviewed as such before the PO is cut.

Every number above marked "placeholder" or "typical" must be replaced with an
actual PCBWay quote (CNC + SMT) before committing the pilot budget. This BOM
is the shopping list and cost model to quote against — not a purchase order.

--------------------------------------------------------------------------------
04 // WHAT IS NOT YET SOURCED
--------------------------------------------------------------------------------

- Exact LiPo cell capacity/footprint (depends on final 22mm height stack-up
  from the mechanical CAD — order after Section 02's dimensions are locked).
- Gasket material/spec for the IP54 seam target.
- Retail packaging (out of scope for the pilot; pilot units ship bare).

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-BOM
================================================================================
