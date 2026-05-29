<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Components Buying List (BOM)

**Document:** COSMO-CIA-COMPONENTS-LIST.md
**Version:** 1.0.0
**Prepared:** May 29, 2026
**Run:** 100 production units + 50 engineering samples

Prices are per-unit at 100–150 qty unless noted. Always request updated quotes; prices fluctuate.

---

## 1. Core Electronics

| # | Part                      | Part Number              | Qty/Unit | Unit Price | Total (150) | Source / Link                                           |
|---|--------------------------|--------------------------|----------|-----------|-------------|--------------------------------------------------------|
| 1 | ESP32-S3-MINI-1-N8       | ESP32-S3-MINI-1-N8       | 1        | $2.80      | $420        | [Mouser](https://www.mouser.com) / [Digi-Key](https://www.digikey.com) |
| 2 | SSD1351 OLED 1.5" 128×128| SSD1351-based module     | 1        | $6.50      | $975        | [Adafruit #1431](https://www.adafruit.com/product/1431) or AliExpress |
| 3 | OV2640 Camera Module     | OV2640 DVP 21×21mm       | 1        | $3.20      | $480        | [AliExpress](https://www.aliexpress.com) / LCSC        |
| 4 | Bosch BME280             | BME280                   | 1        | $1.10      | $165        | [Digi-Key](https://www.digikey.com/en/products/detail/bosch-sensortec/BME280/6136306) |
| 5 | TI BQ25895RTWT           | BQ25895RTWT              | 1        | $2.20      | $330        | [Mouser](https://www.mouser.com) / [Digi-Key](https://www.digikey.com) |
| 6 | Qi RX coil WR202020      | WR202020-4MS5-G          | 1        | $1.80      | $270        | [LCSC](https://www.lcsc.com)                           |
| 7 | LiPo 150mAh 401428       | 401428 3.7V 150mAh       | 1        | $2.50      | $375        | [Adafruit #1317](https://www.adafruit.com/product/1317) or BatterySpace |
| 8 | Omron COPY Button        | B3FS-1000P               | 1        | $0.35      | $52.50      | [Digi-Key](https://www.digikey.com)                    |
| 9 | Passive buzzer           | CMT-1603-SMT-TR          | 1        | $0.15      | $22.50      | [Mouser](https://www.mouser.com) / LCSC                |
|10 | USB-C Connector (SMT)    | USB4135-GF-A             | 1        | $0.45      | $67.50      | [Mouser](https://www.mouser.com)                       |
|11 | 3.3V LDO (AP2112K-3.3)   | AP2112K-3.3TRG1          | 1        | $0.22      | $33         | [Digi-Key](https://www.digikey.com)                    |
|12 | Gorilla Glass lens 34×34 | Custom (0.5 mm, cut)     | 1        | $1.20      | $180        | Shenzhen Laibao / custom order                         |
|13 | Sapphire camera lens cap | 2 mm dia sapphire disk   | 1        | $0.50      | $75         | AliExpress / sapphire blanks                           |
|14 | Decoupling capacitors    | 100nF / 10µF / 47µF      | ~20      | $0.02      | $60         | LCSC / Digi-Key                                        |
|15 | Resistors assorted       | 0402 SMD kit             | ~15      | $0.01      | $22.50      | LCSC                                                   |
|16 | ESD protection (PRTR5V0U2X)| PRTR5V0U2X              | 2        | $0.25      | $75         | [Mouser](https://www.mouser.com)                       |

**Electronics subtotal (150 units):** ~$3,603.50

---

## 2. PCB Manufacturing

| # | Item                      | Spec                              | Qty  | Unit Price | Total   | Source / Link                                           |
|---|--------------------------|-----------------------------------|------|-----------|---------|--------------------------------------------------------|
| 1 | 4-layer PCB (36×36 mm)   | ENIG, 0.8 mm, HASL backup        | 150  | $4.20     | $630    | [PCBWay](https://www.pcbway.com)                       |
| 2 | SMT Assembly (PCBA)      | Pick & place all components       | 150  | $12.00    | $1,800  | [PCBWay SMT Service](https://www.pcbway.com/smt-assembly.html) |
| 3 | Stencil (0.12 mm SS)     | Single stencil for reflow         | 2    | $35.00    | $70     | PCBWay (included in PCBA)                              |
| 4 | PCB functional test      | ICT / boundary scan               | 150  | $2.50     | $375    | PCBWay / in-house                                      |

**PCB subtotal:** ~$2,875

---

## 3. Mechanical Body (CNC Stainless Steel)

| # | Item                             | Spec                              | Qty  | Unit Price | Total   | Source / Link                                           |
|---|----------------------------------|-----------------------------------|------|-----------|---------|--------------------------------------------------------|
| 1 | Front shell (SS316, satin)       | 40×40×3 mm, CNC machined         | 120  | $18.00    | $2,160  | [PCBWay CNC](https://www.pcbway.com/cnc-machining.html) |
| 2 | Back shell (SS304, mirror #8)    | 40×40×2 mm, CNC + polish         | 120  | $16.00    | $1,920  | [PCBWay CNC](https://www.pcbway.com/cnc-machining.html) |
| 3 | Silicone gasket (O-ring)         | 38×38 mm, 0.8 mm section         | 150  | $0.40     | $60     | Custom rubber mold, AliExpress                         |
| 4 | M1.2 Torx screw set (×4/unit)    | Stainless, countersunk           | 600  | $0.05     | $30     | AliExpress / McMaster-Carr                             |
| 5 | Laser engraving (LOT logo, SN)   | Fiber laser, per unit            | 120  | $1.00     | $120    | PCBWay laser service                                   |

**Mechanical subtotal:** ~$4,290

---

## 4. Wireless Charging Dock

| # | Item                             | Spec                              | Qty  | Unit Price | Total   | Source / Link                                           |
|---|----------------------------------|-----------------------------------|------|-----------|---------|--------------------------------------------------------|
| 1 | Charging dock PCB (36×36 mm)     | 2-layer, ENIG                    | 120  | $1.50     | $180    | PCBWay                                                 |
| 2 | STWBC-EP wireless TX IC          | STWBC-EP (STMicro)               | 120  | $1.80     | $216    | [Mouser](https://www.mouser.com)                       |
| 3 | TX Qi coil 36×36 mm              | 36×36 mm, 5W rated               | 120  | $1.20     | $144    | LCSC / AliExpress                                      |
| 4 | N52 alignment magnets (4/dock)   | 1.5 mm dia × 1 mm                | 480  | $0.08     | $38.40  | AliExpress                                             |
| 5 | Dock body (SS316, machined)      | 40×40×8 mm, CNC                  | 110  | $14.00    | $1,540  | PCBWay CNC                                             |
| 6 | USB-C PD input port              | USB4135-GF-A                     | 120  | $0.45     | $54     | Mouser                                                 |
| 7 | Status LED (green, 0402)         | Green LED, SMD 0402              | 120  | $0.05     | $6      | LCSC                                                   |
| 8 | USB-C cable (1 m, white)         | USB-C to USB-C, 5V/2A            | 110  | $1.20     | $132    | AliExpress / Anker bulk                                |

**Charger dock subtotal:** ~$2,310.40

---

## 5. Packaging

| # | Item                             | Spec                              | Qty  | Unit Price | Total   | Source / Link                                           |
|---|----------------------------------|-----------------------------------|------|-----------|---------|--------------------------------------------------------|
| 1 | Custom black box (LOT®)          | 60×60×30 mm, rigid, matte black  | 110  | $2.50     | $275    | Alibaba packaging supplier                             |
| 2 | Foam insert (die-cut)            | 2-layer EVA foam                 | 110  | $0.80     | $88     | Same supplier                                          |
| 3 | Quick-start card (printed)       | 85×54 mm, 400gsm, spot UV        | 110  | $0.30     | $33     | Local or Moo.com                                       |
| 4 | Warranty & safety leaflet        | Folded, 4-panel                  | 110  | $0.20     | $22     | Local print                                            |
| 5 | LOT® sticker seal                | Round, 20mm, gold foil           | 110  | $0.10     | $11     | Local print                                            |

**Packaging subtotal:** ~$429

---

## 6. Firmware & Test Tools

| # | Item                             | Spec                              | Qty | Unit Price | Total   | Source / Link                                           |
|---|----------------------------------|-----------------------------------|-----|-----------|---------|--------------------------------------------------------|
| 1 | ESP32-S3 programming jig         | Custom PCB, pogo pins             | 2   | $120.00   | $240    | Custom build / PCBWay                                  |
| 2 | USB-C programming cable          | USB-A to USB-C, 1 m               | 5   | $5.00     | $25     | Amazon                                                 |
| 3 | Multimeter (Fluke 101)           | QC verification                   | 1   | $40.00    | $40     | Amazon / Fluke                                         |
| 4 | Thermal camera (FLIR C2)         | Thermal imaging for QC            | 1   | $349.00   | $349    | Fluke/FLIR                                             |
| 5 | Dev units for firmware testing   | Pre-production boards             | 10  | (included) | —      | Engineering samples from PCBWay                        |

**Tools subtotal:** ~$654

---

## 7. Cost Summary

| Category              | Subtotal     |
|-----------------------|-------------|
| Electronics (150u)    | $3,603.50   |
| PCB + Assembly (150u) | $2,875.00   |
| CNC Body (120u)       | $4,290.00   |
| Wireless Charger (110u)| $2,310.40  |
| Packaging (110u)      | $429.00     |
| Tools & Test          | $654.00     |
| **TOTAL**             | **$14,161.90** |
| Per unit (100 units)  | **~$141.62** |
| Suggested retail      | **$299–$349** |

> Note: Does not include engineering labor, firmware development, or shipping.  
> Shipping (EMS/DHL from PCBWay/China to USA): estimate $400–$800.

---

## 8. Key Vendor Contacts

| Vendor     | Use                          | URL                              |
|-----------|------------------------------|----------------------------------|
| PCBWay    | PCB, PCBA, CNC, Laser        | https://www.pcbway.com           |
| Mouser    | ICs, connectors, passives    | https://www.mouser.com           |
| Digi-Key  | ICs, sensors, battery mgmt   | https://www.digikey.com          |
| LCSC      | Passives, commodity ICs      | https://www.lcsc.com             |
| Adafruit  | Modules for prototyping      | https://www.adafruit.com         |
| AliExpress| Magnets, gaskets, cables     | https://www.aliexpress.com       |
| BatterySpace| LiPo cells                 | https://www.batteryspace.com     |

---

## 9. PCBWay Ordering Instructions

1. **PCB Order:** Upload Gerber files (see `firmware/pcb/gerbers/`), select 4-layer, 0.8 mm, ENIG, 150 qty.
2. **PCBA Order:** Upload BOM CSV + centroid XY file. Select SMT both sides. Choose "turnkey" for full component procurement.
3. **CNC Body:** Upload STEP files (`hardware/cad/front-shell.step`, `back-shell.step`). Material: SS316 (front), SS304 (back). Finish: brushed satin (front), mirror #8 (back).
4. **Laser Engraving:** Upload DXF logo file. Specify depth 0.05 mm, fiber laser.
5. **Lead time:** PCB/PCBA ~14 days. CNC body ~21 days. Order simultaneously for parallel production.

---

*© 2026 LOT Systems, Inc. All rights reserved.*
