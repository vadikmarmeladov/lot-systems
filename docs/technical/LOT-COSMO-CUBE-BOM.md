<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
COSMO® CUBE — MODEL S1
BILL OF MATERIALS + BUYING LIST v1.0
================================================================================

DOCUMENT    LOT-COSMO-CUBE-BOM
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
DATE        2026-07-05
RELATED     LOT-COSMO-CUBE-HARDWARE-SPEC.md (§03 defines CONFIG A / CONFIG B)

A note on links: this list points to distributor catalog/search pages and
manufacturer part numbers (MPN), not to individual product-detail URLs.
Distributor stock, pricing, and exact SKU pages change week to week — search
the MPN on the linked distributor to land on the live listing rather than
following a hard-coded product URL that may have rotated.

================================================================================
01 // MANUFACTURING PARTNER
================================================================================

    SERVICE                  VENDOR       LINK
    ───────                  ──────       ────
    PCB fabrication          PCBWay       https://www.pcbway.com
    SMT assembly (PCBA)      PCBWay       https://www.pcbway.com/orderonline.aspx
    CNC stainless enclosure  PCBWay       https://www.pcbway.com/rapid-prototyping/
                                          (CNC machining service — supports
                                           316L stainless, accepts STEP files)

Consolidating PCB fab, SMT assembly, and the CNC stainless shells on one
vendor (point 1 of the brief) removes a shipping/customs hop between
"board" and "body" for the 100-unit run — PCBWay can box a finished PCBA
directly into the CNC'd shell before a single combined outbound shipment,
which matters more at 100 units than it would at 5.

================================================================================
02 // ELECTRONICS — CONFIG A (5mm spec-exact) AND CONFIG B (8mm fallback)
================================================================================

    PART                MPN / CLASS                  QTY   DISTRIBUTOR    LINK
    ────                ───────────                  ───   ───────────    ────
    MCU (WiFi+BLE+cam)  ESP32-S3 module, camera-      1     Mouser         https://www.mouser.com
                        capable (DVP/parallel IF,                          https://www.digikey.com
                        e.g. ESP32-S3-WROOM-1 class)                       https://www.lcsc.com

    Camera — CONFIG A   3.5x3.5mm CMOS, pinhole        1     LCSC           https://www.lcsc.com
                        lens, endoscope-class part
                        (~2.5mm module z-height)

    Camera — CONFIG B   OV2640 2MP, fixed-focus,       1     Mouser         https://www.mouser.com
                        ESP32-CAM-class module                             https://www.digikey.com
                        (~5-6mm z-height)

    Display — primary   1.02"/1" monochrome e-paper,   1     Mouser         https://www.mouser.com
                        e.g. GDEW0102T4-class panel                        (search "e-paper 1 inch")

    Display — alt       0.96"-1" monochrome OLED,       1     Adafruit      https://www.adafruit.com
                        SSD1306-class, SPI                                 https://www.mouser.com

    Env. sensor         BME280 (temp/humidity/         1     Mouser         https://www.mouser.com
                        pressure), LGA package                            https://www.digikey.com

    Accelerometer       LSM6DSOX-class low-power IMU   1     Mouser         https://www.mouser.com
                                                                            https://www.digikey.com

    Ambient light       VEML7700-class ALS             1     Mouser         https://www.mouser.com
                                                                            https://www.digikey.com

    Qi receiver coil    Standard Qi 5W BPP rx coil +    1     Digi-Key      https://www.digikey.com
                        PMIC (e.g. IDT/Renesas P9221-                      https://www.lcsc.com
                        class receiver IC)

    Battery — CONFIG A  Printed/solid-state thin-film  1     Specialty     (Molex/Cymbet/Ultralife
                        cell, ~15mAh                          cell maker    class supplier — quote
                                                                            direct, no standard
                                                                            distributor SKU at this
                                                                            capacity/thinness)

    Battery — CONFIG B  Thin LiPo pouch, ~150mAh        1     Adafruit      https://www.adafruit.com
                                                                            https://www.digikey.com

    Tactile switch       Low-profile SMD tactile,       1     LCSC           https://www.lcsc.com
                        <1mm actuation height                              https://www.mouser.com

    Passives/PCB         Standard 0402/0201 passives,   —     LCSC           https://www.lcsc.com
                        per schematic                                     https://www.mouser.com

    Ceramic charging     Zirconia ceramic disc,          1     Custom        (source via PCBWay's
    window               14mm dia., or Gorilla Glass          machining     ceramics/glass partner
                        as lower-cost alternative             partner       network, or a watch-
                                                                            back ceramic supplier —
                                                                            quote alongside CNC order)

================================================================================
03 // ENCLOSURE
================================================================================

    PART                 SPEC                          QTY   SOURCE
    ────                 ────                          ───   ──────
    Face A shell         316L stainless, CNC + mirror   1     PCBWay CNC
                        polish, laser-etch COSMO® mark
                        + ceramic window pocket
    Face B shell         316L stainless, CNC + bead     1     PCBWay CNC
                        blast, camera/screen/button
                        cutouts
    Gasket               Silicone, seam profile-cut     1     PCBWay or local gasket house
    Fasteners            M1.2 stainless screws, recessed 4    McMaster-Carr  https://www.mcmaster.com
    Silicone feet        Sub-1mm self-adhesive           3    McMaster-Carr  https://www.mcmaster.com

================================================================================
04 // ACCESSORY — CHARGING DOCK (point 12)
================================================================================

The "charger" is a small separate accessory that ships with each unit: a
USB-C powered Qi 5W transmitter puck the tile rests on. This is a standard,
fully off-the-shelf subsystem — no custom design needed.

    PART                 SPEC                          QTY   DISTRIBUTOR   LINK
    ────                 ────                          ───   ───────────   ────
    Qi transmitter puck  Off-the-shelf Qi 5-10W tx      1     Amazon Basics-
                        module (buy pre-built, do not          class OEM     https://www.digikey.com
                        design a new tx circuit)                             (search "Qi transmitter
                                                                              module")
    USB-C cable          1m, USB-C to USB-C or USB-A     1     Anker/generic https://www.digikey.com

================================================================================
05 // COST ROLLUP
================================================================================

Prices are current street-range estimates (component cost trends move
weekly at these categories) — treat as planning-grade, re-quote before
committing the 100-unit PO.

    CATEGORY              CONFIG A (per unit)   CONFIG B (per unit)
    ────────              ───────────────────   ───────────────────
    MCU module             $4 – $7                $4 – $7
    Camera                 $8 – $15 (specialty)   $2 – $4 (ESP32-CAM class)
    Display                $6 – $10               $4 – $8
    Sensors (3x)            $3 – $5                $3 – $5
    Qi coil + PMIC          $2 – $4                $2 – $4
    Battery                 $10 – $20 (specialty)  $1.50 – $3
    Switch + passives       $1 – $2                $1 – $2
    PCB fab + SMT (PCBWay)  $8 – $14               $6 – $10
    Stainless shells (CNC)  $18 – $28              $15 – $22
    Ceramic window          $3 – $6                $3 – $6
    Gasket + fasteners      $1 – $2                $1 – $2
    ──────────────────────  ─────────────────────  ─────────────────────
    UNIT SUBTOTAL            $64 – $113              $42.50 – $73

    100-UNIT RUN             $6,400 – $11,300        $4,250 – $7,300
    (electronics + shells,
    excludes NRE tooling,
    firmware dev time,
    and the charging dock
    accessory below)

    Charging dock (each)     $8 – $15               $8 – $15
    100-UNIT DOCK RUN        $800 – $1,500          $800 – $1,500

    ESTIMATED ALL-IN,        $7,200 – $12,800        $5,050 – $8,800
    100 UNITS

NRE (non-recurring engineering) not included above: CNC tooling setup,
PCBWay assembly stencil + fixture setup, and the ceramic window supplier's
tooling — typically $1,500-$4,000 one-time regardless of config, amortized
across the 100-unit run (~$15-$40/unit).

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-BOM
================================================================================
