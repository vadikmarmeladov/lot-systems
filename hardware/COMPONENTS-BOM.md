# COSMO® CIA — Bill of Materials (BOM)
**Document:** COSMO-BOM-001 · Rev 1.0
**Date:** 2026-05-25
**Quantity:** 100 units (+ 10% overage = 110 sets)

---

## Purchasing Strategy

- **PCBWay** — PCB fabrication, stainless steel CNC, PCBA (turnkey)
- **Mouser / DigiKey** — Certified ICs, passives, connectors
- **Alibaba / LCSC** — High-volume commodity parts (camera, battery)
- **Würth / TDK** — Magnetics, ferrites, inductors

---

## Section 1 — Main MCU Module

| # | Component | MPN | Supplier | Unit Cost (USD) | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 1 | ESP32-S3-WROOM-1-N8 (8MB Flash) | ESP32-S3-WROOM-1-N8 | Mouser | $3.10 | $341 | https://www.mouser.com/ProductDetail/356-ESP32-S3WROOM1N8 |
| 2 | 10k pull-up resistor array 0402 (×4) | RC0402JR-0710KL | DigiKey | $0.02 | $8.80 | https://www.digikey.com/en/products/detail/yageo/RC0402JR-0710KL |
| 3 | 100 nF decoupling cap 0402 (×8 per unit) | GRM155R71C104KA88D | Mouser | $0.01 | $8.80 | https://www.mouser.com/ProductDetail/81-GRM155R71C104KA88D |
| 4 | 10 µF MLCC 0805 (×4 per unit) | GRM21BR61C106KE15L | Mouser | $0.06 | $26.40 | https://www.mouser.com/ProductDetail/81-GRM21BR61C106KE15L |

**Section 1 Subtotal: ~$385**

---

## Section 2 — Display

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 5 | 1.3" 128×128 OLED module (SSD1315, I²C, white) | ER-OLED1.3-1W | BuyDisplay / Alibaba | $4.20 | $462 | https://www.buydisplay.com/serial-spi-i2c-1-3-inch-white-oled-display-module-128x128 |
| 6 | 0.5mm FPC connector 5-pin | 52746-0545 | Mouser | $0.38 | $41.80 | https://www.mouser.com/ProductDetail/538-52746-0545 |
| 7 | Anti-glare mineral glass 22×22×0.5mm | Custom cut | Alibaba (Dongguan) | $0.80 | $88 | https://www.alibaba.com/product-detail/Custom-cut-optical-glass-cover |

**Section 2 Subtotal: ~$592**

---

## Section 3 — Camera

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 8 | OV2640 2MP Camera Module, DVP, 30fps | OV2640-160D | LCSC / Alibaba | $2.10 | $231 | https://www.lcsc.com/product-detail/Camera_OV2640-160D_C80 |
| 9 | Sapphire crystal lens cover, 8×8×0.5mm | Custom | Alibaba (Shenzhen) | $1.20 | $132 | https://www.alibaba.com/product-detail/sapphire-crystal-camera-lens-cover |
| 10 | Camera FPC cable 0.5mm 24-pin, 35mm | Generic | LCSC | $0.15 | $16.50 | https://www.lcsc.com/product-detail/FFC-FPC-Connectors |

**Section 3 Subtotal: ~$380**

---

## Section 4 — Environmental Sensor (AI-Grade)

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 11 | Bosch BME688 gas+temp+humidity+pressure | BME688 | Mouser | $4.85 | $533.50 | https://www.mouser.com/ProductDetail/828-BME688 |
| 12 | BME688 breakout resistors (0 Ω 0402, ×4) | RC0402FR-070RL | DigiKey | $0.01 | $4.40 | https://www.digikey.com/en/products/detail/yageo/RC0402FR-070RL |

**Section 4 Subtotal: ~$538**

---

## Section 5 — Power Management

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 13 | LiPo battery 200 mAh, 3.7V, 38×35×1.8mm | ICR18650 / custom | Alibaba (Shenzhen battery) | $2.80 | $308 | https://www.alibaba.com/product-detail/thin-lipo-battery-200mah-38x35mm |
| 14 | BQ51013BRHLT Qi receiver IC | BQ51013BRHLT | Mouser | $2.95 | $324.50 | https://www.mouser.com/ProductDetail/595-BQ51013BRHLT |
| 15 | MCP73831T-2ATI/OT LiPo charger IC | MCP73831T-2ATI/OT | Mouser | $0.54 | $59.40 | https://www.mouser.com/ProductDetail/579-MCP73831T2ATIOOT |
| 16 | MAX17048G+T10 fuel gauge IC | MAX17048G+T10 | Mouser | $1.95 | $214.50 | https://www.mouser.com/ProductDetail/700-MAX17048GT10 |
| 17 | Qi receive coil, 40×40mm flex, 200mW | WR450060-20M8-G | Würth Elektronik | $1.85 | $203.50 | https://www.mouser.com/ProductDetail/710-WR450060-20M8-G |
| 18 | 4.7 µH shielded inductor 0805 (Qi filter) | 744024004 | Würth | $0.35 | $38.50 | https://www.mouser.com/ProductDetail/710-744024004 |
| 19 | TVS diode array USB protection | PRTR5V0U2X | Mouser | $0.28 | $30.80 | https://www.mouser.com/ProductDetail/771-PRTR5V0U2X |
| 20 | USB-C receptacle, SMD, 16-pin | GCT-USB4105-GF-A | Mouser | $0.65 | $71.50 | https://www.mouser.com/ProductDetail/640-USB4105-GF-A |
| 21 | 3.3V LDO regulator, 500mA | XC6210B332MR | Mouser | $0.28 | $30.80 | https://www.mouser.com/ProductDetail/865-XC6210B332MR |

**Section 5 Subtotal: ~$1,281**

---

## Section 6 — User Interface

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 22 | Tactile SMD switch 3.2×4.2mm, 160gf | PTS526 SK15 SMTR2 LFS | Mouser | $0.42 | $46.20 | https://www.mouser.com/ProductDetail/611-PTS526SK15SMTR2L |
| 23 | RGB LED, 0603 | APTD3216CGKC | Mouser | $0.08 | $8.80 | https://www.mouser.com/ProductDetail/APTD3216CGKC |
| 24 | DRV2605LYZFT haptic driver | DRV2605LYZFT | Mouser | $1.85 | $203.50 | https://www.mouser.com/ProductDetail/595-DRV2605LYZFT |
| 25 | Coin vibration motor, 8mm, 3V | 1662 (Adafruit) / generic | Alibaba | $0.55 | $60.50 | https://www.alibaba.com/product-detail/8mm-coin-vibration-motor-3v |
| 26 | Silicone button cap (COPY label, matte black) | Custom molded | Alibaba (silicone mold) | $0.40 | $44 | https://www.alibaba.com/product-detail/custom-silicone-button-cap |

**Section 6 Subtotal: ~$363**

---

## Section 7 — PCB & Passive Components

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Notes |
|---|---|---|---|---|---|---|
| 27 | PCB, 4-layer, 38×38mm, ENIG | PCBWay | PCBWay | $1.80 | $198 | 1.0 mm FR4, 4-layer, ENIG, impedance controlled |
| 28 | Ferrite bead 600Ω@100MHz 0402 (×6) | MMZ1005R601AT000 | Mouser | $0.03 | $19.80 | EMI suppression on RF traces |
| 29 | 22 pF cap 0402 (×4, crystal load) | CC0402JRNPO9BN220 | Mouser | $0.01 | $4.40 | |
| 30 | 1 µF cap 0402 (×6, decoupling) | GRM155R61A105KE15D | Mouser | $0.02 | $13.20 | |
| 31 | 10 kΩ resistor 0402 (×8) | RC0402FR-0710KL | Mouser | $0.005 | $4.40 | |
| 32 | 1 kΩ resistor 0402 (×4, LED) | RC0402FR-071KL | Mouser | $0.005 | $2.20 | |
| 33 | PCB connector, 2-pin battery JST 1.25mm | SM02B-GHS-TB | Mouser | $0.18 | $19.80 | |

**Section 7 Subtotal: ~$262**

---

## Section 8 — Enclosure & Mechanical

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 34 | Stainless 316L CNC shell — Top (Side B) | Custom | PCBWay CNC | $6.80 | $748 | https://www.pcbway.com/rapid-prototyping/manufacture/?type=4 |
| 35 | Stainless 316L CNC shell — Bottom (Side A, polished) | Custom | PCBWay CNC | $7.20 | $792 | https://www.pcbway.com/rapid-prototyping/manufacture/?type=4 |
| 36 | M1.6×4mm stainless Phillips screw (×2) | M1.6×4-SS | Alibaba / hardware | $0.02 | $4.40 | |
| 37 | Silicone O-ring, 36×1mm, IP52 gasket | Generic | Alibaba | $0.08 | $8.80 | |
| 38 | Thermal pad 0.5mm (between PCB and bottom shell) | Bergquist GP1500 | Mouser | $0.12 | $13.20 | Heat dissipation |

**Section 8 Subtotal: ~$1,566**

---

## Section 9 — Wireless Charger (Accessory)

| # | Component | MPN | Supplier | Unit Cost | 110× Cost | Link |
|---|---|---|---|---|---|---|
| 39 | Qi transmitter coil 40mm | WE-WPCC coil 760308103 | Würth | $1.90 | $209 | https://www.mouser.com/ProductDetail/710-760308103 |
| 40 | BQ500210AYRGZT Qi transmitter IC | BQ500210AYRGZT | Mouser | $3.20 | $352 | https://www.mouser.com/ProductDetail/595-BQ500210AYRGZT |
| 41 | Charger PCB, 40×40mm, 2-layer | PCBWay | PCBWay | $0.80 | $88 | |
| 42 | Charger enclosure, ABS, 45×45×8mm | Custom | Alibaba | $0.90 | $99 | |
| 43 | USB-C power input (5V/1A) | GCT-USB4105 | Mouser | $0.65 | $71.50 | |
| 44 | Charger passives kit (caps, resistors, LED) | — | Mouser | $0.50 | $55 | |

**Section 9 Subtotal: ~$875 (charger accessory)**

---

## Section 10 — Firmware & Software Tools

| # | Item | Cost | Notes |
|---|---|---|---|
| 45 | ESP-IDF license | Free | Open-source, Espressif |
| 46 | PlatformIO IDE | Free | VS Code extension |
| 47 | Bosch BME AI Studio | Free | Download from Bosch Sensortec |
| 48 | PCBWay PCBA setup fee (one-time) | $50 | Stencil + engineering setup |
| 49 | FCC pre-certification testing (est.) | $1,200 | Third-party lab, 100-unit pilot |

---

## Cost Summary — 100-Unit Pilot Production

| Category | 110-unit cost | Per-unit cost |
|---|---|---|
| MCU + passives | $385 | $3.85 |
| Display | $592 | $5.92 |
| Camera | $380 | $3.80 |
| Environmental sensor | $538 | $5.38 |
| Power management | $1,281 | $12.81 |
| User interface | $363 | $3.63 |
| PCB + passives | $262 | $2.62 |
| Enclosure (CNC SS) | $1,566 | $15.66 |
| PCBWay assembly fee | $800 | $8.00 |
| Charger accessory | $875 | $8.75 |
| FCC pre-cert | $1,200 | $12.00 |
| Packaging + shipping | $500 | $5.00 |
| **TOTAL** | **~$8,742** | **~$87.42** |

> Suggested retail price: $149–$199 for the device + charger bundle.
> Target BOM cost at 1,000 units: ~$38–42/unit (stainless CNC drives >50% of cost).

---

## Preferred Supplier Contacts

| Supplier | For | URL |
|---|---|---|
| PCBWay | PCB + CNC + PCBA | https://www.pcbway.com |
| Mouser Electronics | Certified ICs | https://www.mouser.com |
| DigiKey | Certified ICs | https://www.digikey.com |
| LCSC | Commodity components | https://www.lcsc.com |
| Würth Elektronik | Coils, magnetics | https://www.we-online.com |
| BuyDisplay | OLED modules | https://www.buydisplay.com |

---

*Document COSMO-BOM-001 · lot-systems.com · Rev 1.0 · 2026-05-25*
