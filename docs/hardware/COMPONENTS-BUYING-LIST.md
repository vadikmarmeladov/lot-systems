# COSMO LOT Computer — Components Buying List
## Bill of Materials (BOM) — 100 Unit Production Run

**Project:** COSMO® CIA LOT Computer  
**BOM Revision:** 1.0  
**Date:** 2026-05-26  
**Currency:** USD  
**Quantities:** per device × 100 devices (with 10% excess on passives)

---

## Summary

| Category | Unit Cost (est.) | × 100 units | Subtotal |
|---|---|---|---|
| MCU Module | $4.20 | 110 | $462 |
| Display | $6.80 | 110 | $748 |
| Camera module | $4.50 | 110 | $495 |
| Sensors | $6.10 | 110 | $671 |
| Power ICs & PMIC | $4.30 | 110 | $473 |
| Battery (custom LiPo) | $3.80 | 110 | $418 |
| Wireless charging RX | $2.90 | 110 | $319 |
| Passives & connectors | $1.40 | 110+ | $154 |
| PCB fabrication (100 boards) | — | 100 | $380 |
| PCB assembly (PCBA) | — | 100 | $1,100 |
| Stainless steel CNC shell | $12.00 | 100 sets | $1,200 |
| Wireless charger unit | $8.50 | 100 | $850 |
| Cover glass (front) | $1.20 | 110 | $132 |
| USB-C connectors + cable | $0.60 | 110 | $66 |
| Tactile switch + haptic | $1.10 | 110 | $121 |
| LED (RGB status) | $0.30 | 110 | $33 |
| Packaging (box + foam) | $2.50 | 100 | $250 |
| **Total (estimated)** | | | **~$7,872** |
| **Per-unit cost** | | | **~$78.72** |

> Actual costs will vary by supplier negotiation and MOQ. PCBWay pricing used for PCB/PCBA estimates. CNC machining quotes from Xometry/PCBWay CNC.

---

## 1. Main MCU Module

### ESP32-S3-MINI-1U

| Field | Detail |
|---|---|
| **Part number** | ESP32-S3-MINI-1U |
| **Manufacturer** | Espressif Systems |
| **Description** | Dual-core LX7 240MHz, 8MB flash, 8MB PSRAM, Wi-Fi + BLE 5.0, U.FL antenna |
| **Package** | LCC-56 (15.4 × 11.4 × 1.7 mm) |
| **Unit price (100)** | ~$4.20 |
| **Supplier 1** | Digi-Key — [ESP32-S3-MINI-1U-N8R8-ND](https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-MINI-1U-N8R8/16488935) |
| **Supplier 2** | Mouser — search `ESP32-S3-MINI-1U` |
| **Supplier 3** | LCSC (C2913202) — cheapest for China-based PCBA |
| **FCC ID** | 2AC7Z-ESP32S3MINI1U (modular certified) |
| **Qty per device** | 1 |
| **Notes** | Select U.FL variant (external antenna) for metal enclosure RF performance |

### Chip Antenna (2.4 GHz)

| Field | Detail |
|---|---|
| **Part number** | ANT-2.4-CHP (Molex) or Johanson 0433AT62A0020E |
| **Freq** | 2400–2484 MHz |
| **Unit price** | ~$0.35 |
| **Supplier** | Digi-Key / Mouser |
| **Qty** | 1 |

---

## 2. Display

### 1.3" OLED — SSD1327 128×128

| Field | Detail |
|---|---|
| **Part number** | ER-OLED128128-1W (or Waveshare equivalent) |
| **Controller** | Solomon SSD1327 |
| **Resolution** | 128 × 128 px, 16-level grayscale |
| **Diagonal** | 1.3 inch |
| **Interface** | SPI (4-wire) |
| **Supply** | 3.3V |
| **Unit price (100)** | ~$6.80 |
| **Supplier 1** | BuyDisplay.com — [ER-OLED128128-1W](https://www.buydisplay.com/1-3-inch-128x128-oled-display-module-ssd1327-spi) |
| **Supplier 2** | AliExpress bulk — search `SSD1327 128x128 OLED 1.3` |
| **Supplier 3** | Waveshare `1.3inch OLED Module` |
| **Qty** | 1 |
| **Notes** | Request FPC connector variant for PCB integration; confirm ZIF pitch matches PCB footprint |

---

## 3. Camera Module

### OmniVision OV2640 — 2MP M12

| Field | Detail |
|---|---|
| **Sensor** | OV2640 |
| **Resolution** | 2 MP (1600×1200), JPEG output |
| **Module dims** | 8 × 8 × 5 mm (custom module) |
| **Interface** | 8-bit DVP + I2C |
| **Supply** | 2.8V (lens), 1.8V (I/O) |
| **Unit price (100)** | ~$4.50 |
| **Supplier 1** | ArduCAM — [OV2640 M12 Mini](https://www.arducam.com/product/arducam-2mp-spi-camera-b0067/) |
| **Supplier 2** | AliExpress bulk — `OV2640 8x8 module M12` |
| **Supplier 3** | LCSC C720930 (bare sensor) + custom PCB sub-module |
| **Qty** | 1 |
| **Notes** | Specify 65° M12 fixed-focus lens; verify 5mm Z-height fits within PCB stack |

---

## 4. Environmental & AI-Grade Sensors

### 4.1 Bosch BME688 — AI Weather Sensor

| Field | Detail |
|---|---|
| **Part number** | BME688 |
| **Manufacturer** | Bosch Sensortec |
| **Measures** | Temperature (±0.5°C), Humidity (±3% RH), Pressure (±0.6 hPa), Gas (VOC/IAQ) |
| **AI feature** | Bosch AI Studio pattern training on gas scan sequences |
| **Interface** | I2C / SPI |
| **Package** | LGA-8L (3.0 × 3.0 × 0.93 mm) |
| **Unit price (100)** | ~$3.20 |
| **Supplier 1** | Digi-Key — [828-1077-1-ND](https://www.digikey.com/en/products/detail/bosch-sensortec/BME688/13681875) |
| **Supplier 2** | Mouser — `BME688` |
| **Supplier 3** | LCSC C2680281 |
| **Qty** | 1 |
| **Notes** | Place near ventilation slot in stainless shell; avoid proximity to heat sources |

### 4.2 ams VEML7700 — Ambient Light Sensor

| Field | Detail |
|---|---|
| **Part number** | VEML7700-TT |
| **Measures** | Illuminance (lux), UV |
| **Interface** | I2C |
| **Package** | OPLGA-6L (2.0 × 2.0 × 0.5 mm) |
| **Unit price (100)** | ~$0.85 |
| **Supplier** | Digi-Key `VEML7700-TT` / LCSC C78988 |
| **Qty** | 1 |

### 4.3 Bosch BMI270 — 6-axis IMU

| Field | Detail |
|---|---|
| **Part number** | BMI270 |
| **Measures** | 3-axis gyro + 3-axis accelerometer, step counter, gesture |
| **Interface** | SPI / I2C |
| **Package** | LGA-14L (2.5 × 3.0 × 0.83 mm) |
| **Unit price (100)** | ~$1.60 |
| **Supplier** | Digi-Key `BMI270` / LCSC C2843415 |
| **Qty** | 1 |
| **Notes** | Wake-on-tap interrupt → wakes ESP32 from deep sleep |

### 4.4 ST IMP34DT05 — PDM MEMS Microphone

| Field | Detail |
|---|---|
| **Part number** | IMP34DT05TR |
| **Type** | Bottom-port MEMS PDM |
| **SNR** | 64 dB |
| **Package** | HLGA-6L (3.5 × 2.65 × 1.0 mm) |
| **Unit price (100)** | ~$0.45 |
| **Supplier** | Digi-Key / Mouser `IMP34DT05` |
| **Qty** | 1 |

---

## 5. Power Management ICs

### 5.1 TI BQ25185 — PMIC (Battery Charger + Load Switch)

| Field | Detail |
|---|---|
| **Part number** | BQ25185YFPR |
| **Function** | Single-cell Li-ion/LiPo charger, 1A max, USB-C + wireless charge input |
| **Package** | DSBGA-9 (1.57 × 1.57 mm) |
| **Unit price (100)** | ~$1.40 |
| **Supplier** | Digi-Key `BQ25185YFPR` / LCSC |

### 5.2 TI TPS62840 — 3.3V Step-Down Regulator

| Field | Detail |
|---|---|
| **Part number** | TPS62840DLCR |
| **Output** | 3.3V, 750 mA, 90% eff. |
| **Package** | WSON-6 (1.5 × 1.5 mm) |
| **Unit price (100)** | ~$0.65 |
| **Supplier** | Digi-Key / LCSC C84726 |

### 5.3 TI TPS62740 — 1.8V Step-Down (Camera Rail)

| Field | Detail |
|---|---|
| **Part number** | TPS62740DSSR |
| **Output** | 1.8V, 300 mA |
| **Package** | SOT-23-6 |
| **Unit price (100)** | ~$0.55 |
| **Supplier** | Digi-Key / LCSC |

### 5.4 TI DRV2605L — Haptic Motor Driver

| Field | Detail |
|---|---|
| **Part number** | DRV2605LYZFR |
| **Function** | ERM/LRA haptic driver, 123 built-in waveforms |
| **Interface** | I2C |
| **Package** | DSBGA-12 (1.77 × 1.49 mm) |
| **Unit price (100)** | ~$1.15 |
| **Supplier** | Digi-Key `DRV2605LYZFR` |

---

## 6. Battery

### Custom LiPo Pouch Cell

| Field | Detail |
|---|---|
| **Type** | Li-Polymer (LiPo) |
| **Capacity** | 380 mAh |
| **Voltage** | 3.7V nominal, 4.2V max, 3.0V cut-off |
| **Dimensions** | 38 × 30 × 2.5 mm |
| **Protection** | Integrated PCM (overcharge, over-discharge, short circuit) |
| **Connector** | JST PH-2 (1.5 mm pitch) |
| **Unit price (100)** | ~$3.80 |
| **Supplier 1** | Shenzhen LiPo — contact supplier: battery-factory.com (custom size) |
| **Supplier 2** | Grepow — [Custom thin LiPo](https://www.grepow.com/shaped-battery.html) |
| **Supplier 3** | Lipol (Poland) — alternative for EU sourcing |
| **Cert** | IEC 62133, UN 38.3 |
| **Qty** | 1 |

---

## 7. Wireless Charging

### NuVolta NU1619 — Qi Receiver IC

| Field | Detail |
|---|---|
| **Part number** | NU1619 |
| **Standard** | Qi v1.3, 5W EPP |
| **Output** | 5V / 1A |
| **Package** | QFN-24 (3.5 × 3.5 mm) |
| **Unit price (100)** | ~$1.20 |
| **Supplier** | LCSC C2977478 / AliExpress chip suppliers |

### Rx Coil — 15mm Wireless Charging Coil

| Field | Detail |
|---|---|
| **Part** | WR202020-14M8-G (TDK or equiv.) |
| **Inductance** | 14 µH |
| **Dimensions** | 20 × 20 mm, 0.35 mm thick |
| **Unit price (100)** | ~$0.85 |
| **Supplier** | Digi-Key `TDK wireless` / AliExpress |

### Companion Charger TX IC

| Field | Detail |
|---|---|
| **Part number** | P9242-RNDGI8 (IDT/Renesas) |
| **Standard** | Qi EPP Tx, 5W |
| **Package** | WLCSP-40 |
| **Unit price** | ~$2.40 |
| **Supplier** | Digi-Key P9242-RNDGI8 |

---

## 8. Mechanical / Connectors

### USB-C Connector (Firmware Flash + Charge)

| Field | Detail |
|---|---|
| **Part** | GCT USB4105-GF-A (SMD, mid-mount) |
| **Height** | 3.26 mm |
| **Unit price (100)** | ~$0.40 |
| **Supplier** | Digi-Key `USB4105-GF-A-0190` |

### Tactile Button — Alps SKRPACE010

| Field | Detail |
|---|---|
| **Part** | SKRPACE010 |
| **Travel** | 0.15 mm |
| **Force** | 100 gF |
| **Height** | 0.8 mm |
| **Unit price (100)** | ~$0.25 |
| **Supplier** | Digi-Key `SKRPACE010CT-ND` |

### ERM Haptic Motor

| Field | Detail |
|---|---|
| **Part** | Jinlong FF-M10K (10 mm coin, 2.5 mm thick) |
| **Voltage** | 3V, 70 mA |
| **Unit price (100)** | ~$0.80 |
| **Supplier** | Mouser / AliExpress ERM motor |

### RGB LED

| Field | Detail |
|---|---|
| **Part** | LTST-C19HE1WT (Lite-On 0402 RGB) |
| **Size** | 1.0 × 0.5 mm |
| **Unit price (100)** | ~$0.12 |
| **Supplier** | Digi-Key / LCSC |

### JST PH Connector (Battery)

| Field | Detail |
|---|---|
| **Part** | B2B-PH-K-S (JST) |
| **Pitch** | 2.0 mm, 2-pin |
| **Unit price (100)** | ~$0.18 |
| **Supplier** | Digi-Key `455-1704-ND` |

---

## 9. Stainless Steel Enclosure

### 316L Stainless Steel Shell — 2-Part

| Field | Detail |
|---|---|
| **Material** | 316L austenitic stainless steel |
| **Process** | CNC machining + surface finishing |
| **Part A (Back)** | 40 × 40 × 1.5 mm cap, mirror-polished Ra ≤ 0.05 µm |
| **Part B (Front)** | 40 × 40 × 3.5 mm frame with cutouts for screen/camera/button/USB-C |
| **Fasteners** | 4× M1.0 × 3 mm stainless pan-head screws |
| **Gasket** | 0.5 mm silicone O-ring (IP52 dust/splash) |
| **Surface finish A** | Mirror polish |
| **Surface finish B** | Bead-blast satin (Ra ≈ 0.8 µm) |
| **Unit cost (100 sets)** | ~$12.00 per set |
| **Supplier 1** | PCBWay CNC — [pcbway.com/rapid-prototyping](https://www.pcbway.com/rapid-prototyping/manufacture/?type=4) |
| **Supplier 2** | Xometry — [xometry.com](https://www.xometry.com) |
| **Supplier 3** | Shenzhen CNC Factory (direct quote via Alibaba) |
| **Lead time** | 15–20 business days |
| **DXF/STEP files** | See `/hardware/cad/` directory |

---

## 10. Cover Glass

| Field | Detail |
|---|---|
| **Type** | 0.5 mm optical borosilicate glass |
| **Size** | 30 × 30 mm (covers screen + bezel) |
| **Coating** | AR (anti-reflective, single-side) |
| **Adhesive** | UV-cure optical adhesive (Norland NOA61) |
| **Unit price (100)** | ~$1.20 |
| **Supplier** | Esco Optics / Dragon Trail glass suppliers |

---

## 11. PCB Fabrication & Assembly

### PCBWay PCB + PCBA Order Summary

| Service | Specification | Qty | Estimated Cost |
|---|---|---|---|
| PCB fabrication | 4-layer, 37×37mm, ENIG, black solder mask | 100 | ~$380 |
| SMD assembly (PCBA) | All SMD components except battery + display | 100 | ~$1,100 |
| Component sourcing | PCBWay sources from LCSC / Digi-Key | — | Included in PCBA |
| **PCBWay order link** | [pcbway.com/QuotePCBA.aspx](https://www.pcbway.com/QuotePCBA.aspx) | | |

**Files to upload to PCBWay:**
- Gerber files (RS-274X, zipped)
- BOM (Excel with LCSC part numbers preferred)
- Pick-and-place file (CSV)
- Assembly drawings (PDF)

---

## 12. Packaging

| Item | Description | Unit cost | Qty | Total |
|---|---|---|---|---|
| Box | 55 × 55 × 20 mm rigid cardboard, custom print | $1.80 | 100 | $180 |
| Foam insert | Die-cut EVA foam, 2-part | $0.50 | 100 | $50 |
| Quick start card | 85 × 55 mm (credit card size), 2-side print | $0.20 | 100 | $20 |

---

## 13. Supplier Quick Reference

| Supplier | Use | URL |
|---|---|---|
| PCBWay | PCB fab + PCBA + CNC | pcbway.com |
| Digi-Key | Electronic components (USA/EU) | digikey.com |
| Mouser | Electronic components (USA/EU) | mouser.com |
| LCSC | Electronic components (CN, cheapest) | lcsc.com |
| AliExpress | Camera, display, bulk small parts | aliexpress.com |
| Grepow | Custom LiPo batteries | grepow.com |
| Xometry | CNC machining (alternative) | xometry.com |
| BuyDisplay | OLED display modules | buydisplay.com |
| Bosch Sensortec | BME688, BMI270 (official distributor list) | bosch-sensortec.com |

---

*COSMO® CIA — LOT Systems — BOM v1.0 — 2026-05-26*
