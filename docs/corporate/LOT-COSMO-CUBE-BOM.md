<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube v1.0 — Bill of Materials

**Document:** LOT-COSMO-CUBE-BOM
**Classification:** RESTRICTED // S-2 EYES
**Companion to:** [LOT-COSMO-CUBE-HARDWARE-v1.md](./LOT-COSMO-CUBE-HARDWARE-v1.md)
**Date:** 2026-09-04
**Scope:** Single-unit cost + 100-unit pilot-run roll-up

> Prices are indicative street/tray pricing at small-batch (100-unit)
> volume as of this document's date. They are planning estimates, not
> quotes — get a real PCBWay PCBA quote and a metal-fab quote before
> committing production capital. Vendor entries link to the supplier's
> main storefront, not a specific SKU page, so links stay valid as parts
> and prices move.

---

## 1. Electronics (per unit)

| # | Component | Spec | Supplier | Qty | Unit cost | 100-unit cost |
|---|-----------|------|----------|-----|-----------|---------------|
| 1 | MCU/SoC module | ESP32-S3-WROOM-1 (N8R8, 8MB flash / 8MB PSRAM) | LCSC / Mouser | 1 | $3.20 | $320 |
| 2 | Display | 1.54" e-paper, 200x200, SPI (GDEW0154 class) | Good Display / DigiKey | 1 | $9.50 | $950 |
| 3 | Camera module | OV2640 2MP, DVP/SCCB, fixed-focus | LCSC / DigiKey | 1 | $4.80 | $480 |
| 4 | Environmental sensor | Bosch BME280 (temp/humidity/pressure, I2C) | Mouser / DigiKey | 1 | $3.10 | $310 |
| 5 | Battery | 300mAh LiPo, single-cell, UL1642, w/ protection PCB | DigiKey / Adafruit | 1 | $4.50 | $450 |
| 6 | Wireless charge receiver | Qi coil + charge-management IC (e.g. BQ51013B class) | Mouser | 1 | $2.90 | $290 |
| 7 | Button | Tactile switch, silicone cap, IP54, 300k+ cycles | DigiKey | 1 | $0.60 | $60 |
| 8 | Status LED | 0402 single-color LED | LCSC | 1 | $0.03 | $3 |
| 9 | Passives (R/C/L, decoupling, antenna match) | Assorted 0402/0603 | LCSC | ~60 | $0.02 avg | $120 |
| 10 | Wi-Fi/BLE antenna | PCB trace or chip antenna, 2.4GHz | LCSC | 1 | $0.30 | $30 |
| 11 | PCB (bare, 4-layer, ENIG) | 40x40mm, 4-layer rigid | PCBWay | 1 | $2.50 | $250 |
| 12 | SMT assembly (turnkey PCBA) | Placement + reflow + AOI, 100-unit run | PCBWay | 1 | $6.00 | $600 |
| | **Electronics subtotal** | | | | **≈ $37.45** | **≈ $3,863** |

Vendors: [pcbway.com](https://www.pcbway.com), [lcsc.com](https://www.lcsc.com), [mouser.com](https://www.mouser.com), [digikey.com](https://www.digikey.com), [adafruit.com](https://www.adafruit.com)

---

## 2. Enclosure (per unit)

| # | Component | Spec | Supplier | Qty | Unit cost | 100-unit cost |
|---|-----------|------|----------|-----|-----------|---------------|
| 13 | Front plate | 316L stainless steel, 40x40x2mm, bead-blasted satin, CNC-cut apertures (camera/display/button) | Xometry / PCBWay CNC service | 1 | $8.00 | $800 |
| 14 | Back plate | 316L stainless steel, 40x40x2mm, mirror-polished | Xometry / PCBWay CNC service | 1 | $7.50 | $750 |
| 15 | Gasket seal | Silicone gasket, laser-cut, recessed-lip profile | local converter | 1 | $0.80 | $80 |
| 16 | Fasteners | M1.6 stainless screws, 4x | McMaster-Carr | 4 | $0.10 | $40 |
| | **Enclosure subtotal** | | | | **≈ $16.90** | **≈ $1,670** |

Vendors: [xometry.com](https://www.xometry.com), [pcbway.com](https://www.pcbway.com) (CNC/metal service), [mcmaster.com](https://www.mcmaster.com)

---

## 3. Charging accessory (per unit, shipped with each Cube)

| # | Component | Spec | Supplier | Qty | Unit cost | 100-unit cost |
|---|-----------|------|----------|-----|-----------|---------------|
| 17 | Wireless charging puck | Qi transmitter, 5W, USB-C input | PCBWay PCBA or off-the-shelf OEM puck | 1 | $6.00 | $600 |
| 18 | USB-C cable | 1m, 5V/1A rated | generic OEM | 1 | $1.20 | $120 |
| | **Charging subtotal** | | | | **≈ $7.20** | **≈ $720** |

---

## 4. Packaging & documentation (per unit)

| # | Component | Spec | Supplier | Qty | Unit cost | 100-unit cost |
|---|-----------|------|----------|-----|-----------|---------------|
| 19 | Retail box | Custom-printed rigid box, foam insert | local packaging house | 1 | $3.50 | $350 |
| 20 | Quick-start card | Printed card, front/back, QR to PDF manual | local print shop | 1 | $0.20 | $20 |
| 21 | PDF manual | docs/corporate/COSMO-CUBE-USER-MANUAL.pdf | in-house (this document set) | 1 | $0.00 | $0 |
| | **Packaging subtotal** | | | | **≈ $3.70** | **≈ $370** |

---

## 5. 100-unit pilot run — total roll-up

| Category | 100-unit cost |
|----------|---------------|
| Electronics | ≈ $3,863 |
| Enclosure | ≈ $1,670 |
| Charging accessory | ≈ $720 |
| Packaging & documentation | ≈ $370 |
| **Materials + assembly, 100 units** | **≈ $6,623** |
| **Per-unit landed cost (materials only)** | **≈ $66.23** |

Not included above (get real quotes before finalizing): freight/customs on
a PCBWay + metal-fab order, NRE tooling for MIM enclosure dies if MIM
replaces CNC at volume, firmware flashing/test-jig labor, and any
compliance testing (FCC/CE for the 2.4GHz radio) required before retail
sale. Budget a contingency of at least 30% over the materials total above
for a first 100-unit pilot run.

---

**Companion documents:** [LOT-COSMO-CUBE-HARDWARE-v1.md](./LOT-COSMO-CUBE-HARDWARE-v1.md) · [../technical/COSMO-CUBE-FIRMWARE.md](../technical/COSMO-CUBE-FIRMWARE.md) · [../technical/COSMO-CUBE-SOFTWARE.md](../technical/COSMO-CUBE-SOFTWARE.md)

**Authorized by:** S-2 // Vadik Marmeladov
