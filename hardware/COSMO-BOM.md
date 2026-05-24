# COSMO NODE — Bill of Materials (BOM)
**Revision:** 1.0  
**Date:** 2026-05-24  
**Run Quantity:** 100 units (order qty includes 20% buffer = 120 PCBAs)  
**Currency:** USD  

All prices are approximate 2026 distributor pricing at stated quantities.  
PCBWay is the primary fabrication and assembly source.

---

## Section 1 — Core Electronics

### 1.1 Microcontroller

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 1 | ESP32-S3-MINI-1-N8R8 | ESP32-S3-MINI-1-N8R8 | Mouser / Espressif | 1 | 130 | $3.20 | $416 | https://www.mouser.com/ProductDetail/356-ESP32S3MINI1N8R8 |

### 1.2 Display

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 2 | 1.5" 128×128 Grayscale OLED (SSD1327) | ER-OLED015-2W | BuyDisplay | 1 | 130 | $8.50 | $1,105 | https://www.buydisplay.com/1-5-inch-oled-display-128x128-grey |
| — | Alt: 0.96" 128×64 OLED (SSD1306) | UG-2864HSWEG01 | Waveshare | 1 | 130 | $3.20 | $416 | https://www.waveshare.com/0.96inch-oled.htm |

### 1.3 Camera

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 3 | OV2640 2MP Camera Module | OV2640-M | AliExpress bulk | 1 | 130 | $2.80 | $364 | https://www.aliexpress.com/item/OV2640-camera-module-ESP32 |
| — | Alt: OV5640 5MP (higher quality) | OV5640-AF | Arducam | 1 | 130 | $7.90 | $1,027 | https://www.arducam.com/product/arducam-5mp-mini-camera-module |

### 1.4 Environmental Sensor (AI-grade)

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 4 | BME688 (Temp / Humidity / Pressure / Gas + AI) | BME688 | Mouser / Bosch | 1 | 130 | $4.10 | $533 | https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688 |

> BME688 includes Bosch BSEC2 AI library for onboard IAQ (Indoor Air Quality) classification — no cloud dependency for sensor inference.

### 1.5 Copy Button

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 5 | SMD Tactile Switch 5.2×5.2mm | PTS526 SK15 SMTR2 LFS | C&K / Mouser | 1 | 130 | $0.55 | $72 | https://www.mouser.com/ProductDetail/CK/PTS526SK15SMTR2LFS |
| 6 | Stainless steel button cap 8mm | Custom | PCBWay CNC | 1 | 130 | $1.20 | $156 | https://www.pcbway.com/rapid-prototyping/manufacture/ |

### 1.6 Status LED

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 7 | WS2812B-2020 RGB LED (2×2mm) | WS2812B-2020 | LCSC | 1 | 130 | $0.08 | $10 | https://www.lcsc.com/product-detail/WS2812B-2020_C965555.html |

---

## Section 2 — Power System

### 2.1 Battery

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 8 | LiPo 3.7V 150mAh — 4×18×26mm | LP401826 | Cellevia / AliExpress | 1 | 130 | $2.20 | $286 | https://www.aliexpress.com/item/150mah-401826-lipo-battery |

> Order UN38.3 certified cells only. Verify exact dimensions: 4.0 × 18.0 × 26.0 mm max.

### 2.2 Wireless Charging

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 9 | Qi 5W RX IC + coil module | IP5310 + coil | LCSC | 1 | 130 | $1.85 | $241 | https://www.lcsc.com/product-detail/IP5310_C128026.html |
| 10 | Qi receiver coil 30×30mm 0.8mm | WR483232-10M8-G | TDK / Mouser | 1 | 130 | $1.40 | $182 | https://www.mouser.com/ProductDetail/TDK/WR483232-10M8-G |

### 2.3 Battery Management

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 11 | LiPo Charge IC 500mA | TP4056 | LCSC | 1 | 130 | $0.12 | $16 | https://www.lcsc.com/product-detail/TP4056_C16581.html |
| 12 | LDO 3.3V 300mA | AP2112K-3.3TRG1 | Diodes Inc / Mouser | 2 | 260 | $0.28 | $73 | https://www.mouser.com/ProductDetail/Diodes-Incorporated/AP2112K-33TRG1 |

### 2.4 USB-C (Firmware + Emergency Charge)

| # | Part | MPN | Supplier | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 13 | USB-C 16-pin SMD connector | USB4135-GF-A | GCT / Mouser | 1 | 130 | $0.65 | $85 | https://www.mouser.com/ProductDetail/GCT/USB4135-GF-A |
| 14 | CH340C USB-UART bridge | CH340C | LCSC | 1 | 130 | $0.28 | $36 | https://www.lcsc.com/product-detail/CH340C_C84681.html |

---

## Section 3 — Support ICs & Passives

| # | Part | MPN | Qty/Unit | Qty/Run | Unit $ | Total $ | Notes |
|---|---|---|---|---|---|---|---|
| 15 | Level shifter 2-ch 3.3V↔1.8V | TXS0102DCUR | 1 | 130 | $0.35 | $46 | For OLED if 1.8V interface |
| 16 | External NOR flash 8MB | GD25Q64CSIG | 1 | 130 | $0.55 | $72 | Log cache |
| 17 | 10µF 0402 X5R cap | GRM155R61A106ME11D | 10 | 1,300 | $0.02 | $26 | Bulk bypass |
| 18 | 100nF 0402 bypass cap | CL05B104KO5NNNC | 20 | 2,600 | $0.01 | $26 | |
| 19 | 10kΩ 0402 resistor | RC0402FR-0710KL | 10 | 1,300 | $0.01 | $13 | Pull-ups |
| 20 | 330Ω 0402 resistor (LED current) | RC0402FR-07330RL | 3 | 390 | $0.01 | $4 | |
| 21 | Crystal 40MHz 4-pad | NX3225GB-40M | 1 | 130 | $0.45 | $59 | ESP32-S3 system clock |
| 22 | Silicone O-ring gasket 38×38mm | Custom | PCBWay | 1 set | 130 | $0.80 | $104 | IPX4 seal |

---

## Section 4 — PCB Fabrication & Assembly (PCBWay)

| # | Item | Qty | Unit $ | Total $ | Link |
|---|---|---|---|---|---|
| 23 | PCB bare — 38×38mm 4-layer ENIG (Rev A, 10 pcs) | 10 | $4.20 | $42 | https://www.pcbway.com/orderonline.aspx |
| 24 | PCB bare — 38×38mm 4-layer ENIG (Rev B, 120 pcs) | 120 | $1.80 | $216 | https://www.pcbway.com/orderonline.aspx |
| 25 | SMT Assembly turnkey Rev B (120 boards, all SMD components) | 120 boards | $18.00 | $2,160 | https://www.pcbway.com/smt-assembly.html |
| 26 | Laser stencil 38×38mm 0.12mm SS | 1 | $25 | $25 | https://www.pcbway.com/pcb-stencil.html |
| 27 | X-ray AOI inspection upgrade | 120 | $1.20 | $144 | PCBWay option at order |

**PCBWay SMT Assembly Process:**  
Upload: Gerber + BOM (this document) + CPL centroid file  
PCBWay sources: components from LCSC/partners, or customer-supplied  
Lead time: 5–7 business days after component confirmation  

---

## Section 5 — Mechanical Enclosure

| # | Item | Material | Finish | Qty/Unit | Qty/Run | Unit $ | Total $ | Link |
|---|---|---|---|---|---|---|---|---|
| 28 | Side A — Polished top shell | 316L SS | Mirror #8 polish | 1 | 130 | $12.50 | $1,625 | https://www.pcbway.com/rapid-prototyping/CNC-Machining/ |
| 29 | Side B — Functional bottom shell | 316L SS | Satin brush | 1 | 130 | $14.00 | $1,820 | https://www.pcbway.com/rapid-prototyping/CNC-Machining/ |
| 30 | M1.2 × 2mm screws (4 per unit) | SS | — | 4 | 520 | $0.04 | $21 | McMaster-Carr 92000A105 |
| 31 | Gorilla Glass lens 28×28×0.5mm | AGC Dragontrail | AR coat | 1 | 130 | $1.80 | $234 | https://www.aliexpress.com/item/custom-tempered-glass |
| 32 | Sapphire camera lens cover 6mm | Sapphire | Polished | 1 | 130 | $2.40 | $312 | https://www.aliexpress.com/item/sapphire-optical-window |
| 33 | Thermal pad 38×38×0.5mm | Bergquist GP1500 | — | 1 | 130 | $0.60 | $78 | Mouser 538-GP1500S0.020-0.125 |

**PCBWay CNC Notes:**  
- Material: 316L stainless steel billet  
- Tolerances: ±0.05 mm on all mating surfaces  
- Side A polish: manual buff to #8 mirror finish after CNC  
- Side B: Scotch-Brite #4 satin brush after machining  
- Passivation: citric acid per ASTM A967  
- Min order CNC: 5 pieces (order 10 for NPI, 130 for production)  

---

## Section 6 — Packaging & Documentation

| # | Item | Qty/Unit | Qty/Run | Unit $ | Total $ |
|---|---|---|---|---|---|
| 34 | Box — 60×60×20mm matte black | 1 | 100 | $1.20 | $120 |
| 35 | Foam insert — die cut | 1 | 100 | $0.80 | $80 |
| 36 | Quick Start Card — printed | 1 | 100 | $0.35 | $35 |
| 37 | USB-C cable 0.3m | 1 | 100 | $1.10 | $110 |
| 38 | PDF manuals (digital, QR link) | — | — | — | — |

---

## Section 7 — Development Tools

| # | Item | Qty | Unit $ | Total $ | Link |
|---|---|---|---|---|---|
| 39 | ESP32-S3-DevKitC-1 dev board (firmware dev) | 3 | $12 | $36 | https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-DevKitC-1 |
| 40 | USB logic analyzer 8-ch (Saleae clone) | 1 | $15 | $15 | |
| 41 | Qi wireless charger pad (test) | 2 | $18 | $36 | |
| 42 | Hot air rework station | 1 | $85 | $85 | |
| 43 | USB-C breakout board (power test) | 2 | $8 | $16 | |

---

## Cost Summary

| Category | Cost (100 units) |
|---|---|
| Electronics (BOM items 1–22) | ~$3,900 |
| PCB fabrication + assembly | ~$2,587 |
| Mechanical enclosure (SS + glass) | ~$4,090 |
| Packaging | ~$345 |
| Development tools (one-time) | ~$188 |
| **Subtotal** | **~$11,110** |
| Engineering / firmware dev (est.) | ~$4,000 |
| Certification (FCC/CE, deferred) | ~$3,500 |
| **Total 100-unit NPI run** | **~$15,110–$18,600** |
| **Unit cost (production)** | **~$110–$125** |
| **Target MSRP** | **$299–$349** |

---

## Ordering Sequence

1. **PCBWay PCB order** — upload Gerbers for Rev A bare boards (10 pcs)
2. **PCBWay CNC** — order 2 enclosure sample sets (Side A + Side B) concurrently
3. **Mouser cart** — ESP32-S3-MINI-1, BME688, TP4056, passives
4. **LCSC cart** — GD25Q64, CH340C, WS2812B-2020, bulk passives
5. **BuyDisplay** — 10 OLED samples
6. **AliExpress** — OV2640 camera modules, LiPo cells, lens glass
7. **Hand-assemble Rev A** — 5 prototype boards
8. **Rev A validation** → submit Rev B Gerbers for PCBWay turnkey PCBA
9. **Full 130-unit PCBA run** — PCBWay SMT, customer-supplied or PCBWay-sourced BOM
10. **Final assembly** — insert PCBA into SS enclosures, screw, seal
