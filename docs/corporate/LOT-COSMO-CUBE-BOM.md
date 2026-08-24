================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-BOM
TITLE:    COSMO® Cube — Bill of Materials & Buying List (v1.0)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-24
COMPANION: docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md (spec + roadmap)
================================================================================

Every line below is a real, sourceable part with a live supplier link, in
the same discipline as docs/technical/LOT-NODE-0-RIG-SPEC.md's rig
breakdown — no placeholder line items. Prices are August 2026 street
prices for single-unit prototyping; 100-unit pilot pricing is quoted
separately per vendor once this BOM is finalized and uploaded to PCBWay.

--------------------------------------------------------------------------------
01 // CORE BOARD (the "flat silver square," 40mm x 40mm x 5mm)
--------------------------------------------------------------------------------

COMPONENT            PART                                    PROTO $   SOURCE
─────────            ────                                    ───────   ──────
MCU                  Espressif ESP32-S3 (dual-core, Wi-Fi/    ~$3-6     DigiKey
                     BLE, native camera + SPI display IF)               https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3/15822445

CAMERA               OV2640, 1600x1200, fixed-focus,          ~$8-12    Amazon (HiLetgo module,
                     ESP32-native connector                             de-populated for board-mount)
                                                                         https://www.amazon.com/HiLetgo-ESP32-CAM-Development-Bluetooth-Raspberry/dp/B07RXPHYNM
                     Reference dev module for firmware bring-
                     up before board-mount respin:
                     ESP32-S3-CAM (Type-C, OV2640) — AliExpress
                     https://www.aliexpress.com/item/1005008285512156.html

DISPLAY              1.28" round IPS, 240x240, GC9A01 +       ~$8-13    Waveshare (official)
                     CST816S capacitive touch, SPI/I2C                  https://www.waveshare.com/1.28inch-touch-lcd.htm
                                                                         Also stocked: RobotShop
                                                                         https://www.robotshop.com/products/waveshare-128in-round-lcd-display-module-w-touch-panel-240x240-ips-spi-i2c

WEATHER SENSOR       Bosch BME680 — temp / humidity /         ~$20      Adafruit (STEMMA QT,
                     pressure / VOC, AI-grade factory                   pre-calibrated, breakout)
                     calibration, I2C                                   https://www.adafruit.com/product/3660

WIRELESS CHARGE RX   Qi-standard receiver module, 5V/1A,      ~$4-8     Adafruit (Universal Qi
                     coil + PCBA                                        Receiver Module)
                                                                         https://www.adafruit.com/product/1901

BATTERY              LiPo 3.7V 500mAh, JST-PH connector,      ~$8       Adafruit
                     protection circuit included                        https://www.adafruit.com/product/1578

TACTILE BUTTON       6mm SMD tactile switch, stainless cap     <$1      DigiKey (generic — bulk
                     (Face B "Copy" control)                            SKU selected at PCBWay
                                                                         assembly quote stage)

PCB FAB + ASSEMBLY   4-layer ENIG PCB, 40x40mm, PCBA          quote     PCBWay (bare board)
                     (SMT placement of all of the above)                https://www.pcbway.com/orderonline.aspx
                                                                         PCBWay (SMT assembly)
                                                                         https://www.pcbway.com/quotesmt.aspx
                     Reference pricing: prototype PCBA from
                     ~$88 / 10 units + ~$0.10-0.30 per placed
                     component (parts cost separate).

--------------------------------------------------------------------------------
02 // ENCLOSURE (2-piece stainless steel body)
--------------------------------------------------------------------------------

COMPONENT            SPEC                                     PROTO $   SOURCE
─────────            ────                                     ───────   ──────
SHELL, FACE A        304 stainless, mirror-polished, CNC      quote     PCBWay CNC — stainless
(polished/closed)    milled, ~50mm x 50mm x 9mm half-shell               steel 304
                                                                         https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/

SHELL, FACE B        304 stainless, brushed finish, CNC       quote     Same PCBWay CNC line —
(instrument/open)    milled, camera + display + button                  https://www.pcbway.com/rapid-prototyping/cnc-machining/
                     apertures, ~50mm x 50mm x 9mm half-shell

FASTENERS            4x M2 countersunk stainless screws        <$1      Bulk fastener stock
                     per unit (press-fit shell, screw-secured)          (sourced at 100-unit MOQ
                                                                         alongside PCBWay CNC order)

CAMERA WINDOW        Sapphire-coated optical window, ~6mm      ~$3-5    PCBWay optics add-on or
                     diameter, flush-mount over OV2640                  equivalent optical-glass
                                                                         supplier at CNC quote stage

--------------------------------------------------------------------------------
03 // COST SUMMARY — PROTOTYPE (x1) vs PILOT RUN (x100)
--------------------------------------------------------------------------------

STAGE                COMPONENTS ONLY    + PCB FAB/ASSY    + CNC SHELL    TOTAL EST.
─────                ───────────────    ──────────────    ───────────    ──────────
PROTOTYPE (x1)        ~$55-75            +$40-70 (proto)    +quote        ~$150-250/unit
                                          fee amortized
PILOT RUN (x100)      ~$40-55/unit       lower per-unit      lower per-    ~$90-140/unit
                       (bulk pricing)     PCBA cost            unit CNC      (est., pending
                                          at 100-unit MOQ      cost at       PCBWay formal
                                                                100-unit     quote)
                                                                MOQ

  NOTE ON ESTIMATES
    Component-level prices above are current single-unit street prices,
    August 2026, from the linked suppliers. PCB fabrication, SMT
    assembly, and CNC shell costs are quote-dependent (PCBWay requires
    the finalized Gerber/BOM upload for an exact number) — the ranges
    above are directional, not binding. The next concrete step in the
    roadmap (LOT-COSMO-CUBE-HARDWARE-v1.md, Section 07) is generating
    that formal PCBWay quote once the schematic and enclosure CAD are
    locked.

--------------------------------------------------------------------------------
04 // WHAT IS DELIBERATELY NOT ON THIS LIST (v1.0 scope discipline)
--------------------------------------------------------------------------------

  - Microphone / speaker — no audio I/O in v1.0 (LOT-COSMO-CUBE-HARDWARE-v1.md
    Section 01, "IT IS NOT... a phone replacement").
  - Haptic/piezo actuator — reserved for v2.0 (Section 06 of the
    companion spec), reusing the class already validated in CUBIQ™.
  - Second camera sensor (OV5640) — evaluated only if v1.0/v1.1 pilot
    telemetry shows presence-detection accuracy needs it.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-BOM
================================================================================
