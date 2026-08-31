<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-BOM-v1
TITLE:    COSMO® Cube v1.0 — Bill of Materials, 100-Unit Pilot Run
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-31
SOURCE:   Companion document to LOT-COMPUTER-HARDWARE-SPEC-v1.md
================================================================================

--------------------------------------------------------------------------------
00 // HOW TO READ THIS TABLE
--------------------------------------------------------------------------------

Prices are street-range estimates for small-batch (100-unit) quantities,
in USD, as of this document's date — component and manufacturing pricing
moves; re-quote before committing production funds. Part numbers name a
representative, currently-produced component in each category, not a
sole-source requirement — the firmware manual's driver layer (Section 04
of LOT-COMPUTER-FIRMWARE-MANUAL-v1.md) should treat each as swappable
within its category. Supplier column names the vendor category, linked to
the vendor's own site rather than a specific product page, since exact
SKU URLs age out faster than this document does.

--------------------------------------------------------------------------------
01 // ELECTRONICS — PER UNIT
--------------------------------------------------------------------------------

```
COMPONENT              PART (REPRESENTATIVE)      UNIT $   SUPPLIER
─────────              ─────────────────────      ──────   ────────────────────
SoC                    ESP32-S3-WROOM-1 (N16R8)    $3.20   lcsc.com / digikey.com
Display                1.28" round IPS/AMOLED,     $4.50   aliexpress.com (module) /
                       GC9A01 driver, SPI, 240x240          buydisplay.com
Camera                 OV2640 2MP module, JPEG      $2.80   lcsc.com / seeedstudio.com
Weather sensor         BME280 (temp/humidity/       $2.10   digikey.com / mouser.com
                       pressure), I2C
Presence sensor        LD2410 mmWave, UART          $2.60   aliexpress.com / seeedstudio.com
Microphone             ICS-43434 MEMS, I2S          $1.10   digikey.com / mouser.com
Accelerometer          LIS2DH12, I2C/SPI            $0.65   digikey.com / mouser.com
Qi receiver IC + coil  BQ51013B-class + coil        $1.80   digikey.com / mouser.com
Battery                400mAh Li-Po, UL1642,        $2.40   aliexpress.com (cert'd
                       protection circuit                   cell vendor) / mouser.com
Tactile button         IP-rated membrane switch,    $0.35   digikey.com / mouser.com
                       "COPY" silk-print cap
Passives / misc        R/C/L, connectors, FPC       $1.50   lcsc.com
PCB (bare, 2L FR-4,    fabricated per unit          $0.90   pcbway.com
ENIG)
SMT assembly           per unit, turnkey            $3.50   pcbway.com
                       ─────────────────────────────────────
                       ELECTRONICS SUBTOTAL/UNIT    $27.40
```

--------------------------------------------------------------------------------
02 // CHARGING PLATE — PER UNIT (SHIPS ONE PER CUBE)
--------------------------------------------------------------------------------

```
COMPONENT              PART (REPRESENTATIVE)      UNIT $   SUPPLIER
─────────              ─────────────────────      ──────   ────────────────────
Qi transmitter IC+coil BQ500410A-class + coil       $2.20   digikey.com / mouser.com
USB-C PD input jack    16-pin SMD receptacle        $0.40   lcsc.com
Status LED             0603 RGB, edge-mount         $0.15   digikey.com
Plate PCB + assembly   1-layer, turnkey             $2.00   pcbway.com
Plate housing          40mm x 40mm x 5mm anodized   $3.80   pcbway.com (CNC service) /
                       aluminum, machined                    local CNC shop
                       ─────────────────────────────────────
                       PLATE SUBTOTAL/UNIT          $8.55
```

--------------------------------------------------------------------------------
03 // ENCLOSURE — PER UNIT
--------------------------------------------------------------------------------

```
COMPONENT              SPEC                        UNIT $   SUPPLIER
─────────              ────                        ──────   ────────────────────
Top shell (Face A)     SUS304, CNC + mirror         $9.50   pcbway.com (CNC service) /
                       polish, 45x45mm                       dedicated metal shop
Base shell (Face B)    SUS304, CNC + bead-blast     $8.80   pcbway.com (CNC service) /
                       inset, 45x45mm                        dedicated metal shop
Fasteners              4x M2 stainless screw +      $0.30   mcmaster.com
                       PEM insert
USB-C charge cable     1m, for the plate (in box)   $1.20   digikey.com
                       ─────────────────────────────────────
                       ENCLOSURE SUBTOTAL/UNIT      $19.80
```

--------------------------------------------------------------------------------
04 // PER-UNIT AND 100-UNIT TOTALS
--------------------------------------------------------------------------------

```
CATEGORY                          UNIT $        100-UNIT TOTAL
────────                          ──────        ───────────────
Electronics (Section 01)          $27.40        $2,740
Charging plate (Section 02)       $8.55         $855
Enclosure (Section 03)            $19.80        $1,980
                                   ──────        ───────────────
COMPONENT + ASSEMBLY SUBTOTAL     $55.75        $5,575

ONE-TIME TOOLING (not per-unit, paid once for the pilot)
  SMT stencil + assembly setup    —             $250
  CNC fixture / program (x2       —             $600
  shells)
  Polishing/blasting jig          —             $150
                                                 ───────────────
  TOOLING SUBTOTAL                               $1,000

FIRST-ARTICLE PROTOTYPES (5 units, hand-built, ahead of the 100-run,
per Section 07 DFM gate in LOT-COMPUTER-HARDWARE-SPEC-v1.md)
  5x full BOM, hand-assembly premium (~3x)        $836

                                                 ───────────────
PILOT RUN TOTAL (100 units + tooling + protos)   ≈ $7,411
BLENDED COST PER UNIT (100-unit run only,        ≈ $65.75
tooling amortized)
```

  READ: at ≈$66/unit blended cost, a 100-unit pilot is a
  ≈$7,400 commitment, not counting freight, import duty (if
  fabrication and CNC are both sourced through PCBWay's China
  facilities), or firmware/software engineering time (tracked
  separately — see the firmware and software manuals' own
  effort estimates, not repeated here).

--------------------------------------------------------------------------------
05 // WHAT IS DELIBERATELY NOT IN THIS BOM
--------------------------------------------------------------------------------

  - No secure element / TPM. Device identity (Section 05 of the hardware
    spec) is a provisioned token in flash for v1.0, not a hardware root
    of trust. Revisit for v2.0 if the Cube ever handles payment or
    identity-critical flows.
  - No cellular modem. Wi-Fi + BLE only — the Cube assumes it lives on
    the same network as the operator's phone during pairing.
  - No speaker. The pager notification is visual (display) only in
    v1.0, matching the anti-feed, no-chime restraint already established
    for CUBIQ (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 02, "light is
    secondary and utilitarian" — extended here to "sound is absent").

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COMPUTER-BOM-v1
================================================================================
