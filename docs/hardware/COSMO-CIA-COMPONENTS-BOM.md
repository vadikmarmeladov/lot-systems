# COSMO® CIA — Bill of Materials
## Component Buying List · 100-Unit Production Run
**Version:** 1.0  
**Date:** 2026-05-26  
**Currency:** USD  
**Quantity basis:** 100 units + 10% buffer (110 pcs)

---

## 1. Main Processing & Connectivity

### 1.1 Microcontroller Module

| Part | Espressif ESP32-S3-WROOM-1-N8 |
|------|-------------------------------|
| Description | WiFi 2.4GHz + BLE 5.0, Xtensa LX7 dual-core 240MHz, 8MB flash, FCC/CE certified |
| Size | 18.0 × 20.0 × 3.1 mm |
| Package | SMD castellated module |
| Qty per unit | 1 |
| Unit price (100+) | ~$3.20 |
| Supplier | LCSC / Mouser / DigiKey |
| LCSC Part # | C2913202 |
| Mouser link | https://www.mouser.com/ProductDetail/356-ESP32-S3-WROOM-1N8 |
| Notes | Includes PCB antenna. Camera interface (DVP) on GPIO. 45 GPIOs. |

---

## 2. Display

### 2.1 Color TFT Screen

| Part | Waveshare 1.0" TFT LCD — ST7735S |
|------|----------------------------------|
| Description | 1.0 inch color TFT, 80×160 px, SPI interface, 3.3V |
| Size | 26.0 × 26.0 mm module |
| Qty per unit | 1 |
| Unit price (100+) | ~$3.50 |
| Supplier | Waveshare / AliExpress bulk |
| Waveshare link | https://www.waveshare.com/1inch-lcd-module.htm |
| AliExpress bulk | Search: "1.0 inch TFT ST7735 SPI 80x160" |
| Notes | 4-wire SPI. Fits 26×26mm screen window in enclosure. Replaceable with SSD1327 OLED for deeper blacks. |

---

## 3. Camera

### 3.1 Image Sensor Module

| Part | OV2640 FPC Camera Module — 22×22mm |
|------|-------------------------------------|
| Description | 2MP CMOS, DVP interface, 24-pin FPC, fixed focus or autofocus variant |
| Size | 22.0 × 22.0 mm |
| Qty per unit | 1 |
| Unit price (100+) | ~$4.20 |
| Supplier | Arducam / LCSC / AliExpress |
| Arducam link | https://www.arducam.com/product/arducam-2mp-spi-camera-b0067/ |
| LCSC Part # | Search "OV2640 FPC" on lcsc.com |
| Notes | FPC connects directly to ESP32-S3 camera connector. Use fixed-focus version for fixed aperture in enclosure. |

---

## 4. Environmental Sensors

### 4.1 AI-Grade Environmental Sensor (Primary)

| Part | Bosch BME688 |
|------|--------------|
| Description | Temperature · Relative Humidity · Barometric Pressure · Gas (VOC/AQI) · AI on-chip pattern recognition |
| Size | 3.0 × 3.0 × 0.93 mm LGA |
| Interface | I2C or SPI |
| Qty per unit | 1 |
| Unit price (100+) | ~$6.50 |
| Supplier | Mouser / DigiKey / LCSC |
| Mouser Part # | 828-BME688 |
| Mouser link | https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688 |
| LCSC Part # | C2682329 |
| Notes | Bosch BSEC2 library provides AI-derived IAQ index. "AI-grade" — runs onboard trained gas classification models. |

### 4.2 Ambient Light Sensor

| Part | VEML7700 |
|------|----------|
| Description | High accuracy ambient light sensor, I2C, auto-gain |
| Size | 2.0 × 2.0 mm |
| Qty per unit | 1 |
| Unit price (100+) | ~$0.90 |
| Supplier | LCSC / DigiKey |
| LCSC Part # | C167444 |
| Notes | Used to auto-dim screen. Pairs with weather context. |

---

## 5. Motion / Orientation

### 5.1 6-Axis IMU

| Part | TDK InvenSense ICM-42688-P |
|------|---------------------------|
| Description | 6-axis (accel + gyro), SPI/I2C, 3.0×3.0mm, ultra-low noise |
| Size | 3.0 × 3.0 × 0.91 mm LGA |
| Qty per unit | 1 |
| Unit price (100+) | ~$2.80 |
| Supplier | Mouser / DigiKey |
| Mouser Part # | 602-ICM42688P |
| DigiKey Part # | 1428-ICM-42688-P-ND |
| Notes | Wake-on-motion for low-power standby. Tap detection for "shake to wake." |

---

## 6. Power System

### 6.1 Wireless Charging Receiver IC

| Part | Texas Instruments BQ51050B |
|------|---------------------------|
| Description | Qi v1.2 wireless power receiver, 5W, I2C status output |
| Package | VQFN-16 |
| Qty per unit | 1 |
| Unit price (100+) | ~$2.10 |
| Supplier | Mouser / DigiKey |
| Mouser Part # | 595-BQ51050BRHLR |
| Notes | Pairs with custom 38mm Qi receive coil. Outputs regulated 5V to battery charger. |

### 6.2 Qi Wireless Receive Coil

| Part | WR202020-20M8-G-ND (custom spec: 38×38mm) |
|------|-------------------------------------------|
| Description | Flat Qi receiver coil with ferrite shield, 38×38mm, 20µH |
| Size | 38 × 38 × 0.5 mm (fits within enclosure) |
| Qty per unit | 1 |
| Unit price (100+) | ~$1.80 |
| Supplier | Wurth Elektronik / AliExpress bulk |
| Wurth Part # | 760308103214 |
| Notes | Ferrite layer critical — shields PCB from coil field. Must fit within 5mm enclosure height. |

### 6.3 Battery Charger IC

| Part | Texas Instruments BQ24079RGTT |
|------|------------------------------|
| Description | Single-cell Li-Ion/LiPo charger with power path, 800mA max, VQFN-16 |
| Qty per unit | 1 |
| Unit price (100+) | ~$1.20 |
| Supplier | Mouser / DigiKey |
| Mouser Part # | 595-BQ24079RGTT |
| Notes | Power path allows simultaneous charging + device operation. |

### 6.4 LiPo Battery

| Part | Custom 3.7V 280mAh LiPo — 38×30×3mm |
|------|--------------------------------------|
| Description | Single-cell 3.7V Li-Polymer, ~280mAh, ultra-flat 3mm profile |
| Size | 38 × 30 × 3.0 mm |
| Qty per unit | 1 |
| Unit price (100+) | ~$4.50 |
| Supplier | Renata / EEMB / AliExpress (custom dimension) |
| AliExpress search | "3.7V 280mAh lipo 383030" or "383028 lipo flat" |
| Notes | 280mAh provides ~8hrs standby / ~4hrs active with screen on. Verify exact dimensions against PCB layout before ordering. |

### 6.5 3.3V LDO Regulator

| Part | AP2112K-3.3TRG1 |
|------|-----------------|
| Description | 600mA LDO, SOT-23-5, 3.3V output, very low dropout |
| Qty per unit | 1 |
| Unit price (100+) | ~$0.18 |
| Supplier | LCSC / DigiKey |
| LCSC Part # | C51118 |

---

## 7. User Interface

### 7.1 Copy Button

| Part | SKRPACE010 (Alps Alpine) |
|------|--------------------------|
| Description | SMD tactile switch, 3.9×2.9mm, 1.6mm height, 100mA, silver contact |
| Size | 3.9 × 2.9 × 1.6 mm |
| Qty per unit | 1 |
| Unit price (100+) | ~$0.35 |
| Supplier | Mouser / DigiKey |
| Mouser Part # | 688-SKRPACE010 |
| Notes | Low profile for 5mm enclosure. Silver contact matches polished steel aesthetic. |

### 7.2 Haptic Feedback Motor

| Part | Jinlong Machinery Z4SL2B1370851 (LRA) |
|------|---------------------------------------|
| Description | Linear resonant actuator (LRA), 10×10mm, 3.3V, 150Hz |
| Size | 10 × 10 × 2.0 mm |
| Qty per unit | 1 |
| Unit price (100+) | ~$1.20 |
| Supplier | Digikey / Mouser |
| Notes | Used to confirm Copy button press with tactile pulse. |

### 7.3 Haptic Driver IC

| Part | DRV2605LYZFR (TI) |
|------|-------------------|
| Description | Haptic driver for LRA/ERM motors, I2C, 8 preset effects |
| Package | DSBGA-10 |
| Qty per unit | 1 |
| Unit price (100+) | ~$1.10 |
| Supplier | Mouser / DigiKey |
| Mouser Part # | 595-DRV2605LYZFR |

### 7.4 Notification LED

| Part | KPHHS-1005CGCK (Kingbright) |
|------|------------------------------|
| Description | SMD LED 0402, green, for charge indicator |
| Qty per unit | 2 (charge status + notification pulse) |
| Unit price (100+) | ~$0.05 each |
| Supplier | LCSC / DigiKey |

---

## 8. PCB & Passive Components

### 8.1 PCB Fabrication

| Spec | Value |
|------|-------|
| Board size | 38 × 38 mm |
| Layers | 4 (signal / ground / power / signal) |
| Thickness | 0.8 mm (critical for 5mm enclosure) |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Surface finish | HASL lead-free |
| Soldermask | Black |
| Silkscreen | White |
| Min trace/space | 4/4 mil |
| Min via drill | 0.2 mm |
| Quantity | 110 boards |
| Manufacturer | **PCBWay** |
| PCBWay link | https://www.pcbway.com/orderonline.aspx |
| Estimated cost | ~$320 for 110 boards (~$2.90/board) |

### 8.2 PCB Assembly (PCBA)

| Service | PCBWay SMT Assembly |
|---------|---------------------|
| Side | Double-sided SMT |
| Stencil | Included |
| Programming | Not included (flash via USB-C jig) |
| Estimated cost | ~$1,800 for 100 units (~$18/board labor) |
| PCBWay PCBA link | https://www.pcbway.com/pcb-assembly.html |

### 8.3 Passive Components Summary

| Component | Qty (100 units) | Estimated Cost |
|-----------|-----------------|----------------|
| 0402 resistors (various values) | 800 | ~$8.00 |
| 0402 capacitors (various values) | 1,200 | ~$15.00 |
| 0402 inductors (power filter) | 200 | ~$12.00 |
| ESD protection arrays | 150 | ~$18.00 |
| Ferrite beads 0402 | 200 | ~$8.00 |
| **Subtotal passives** | | **~$61.00 total** |

---

## 9. Enclosure

### 9.1 Stainless Steel CNC Body

| Spec | Value |
|------|-------|
| Material | 316L stainless steel |
| Parts | 2 (polished front cover + back panel) |
| Overall size | 40 × 40 × 5 mm |
| Front finish | Mirror-polished (Ra ≤ 0.1µm) |
| Back finish | Brushed satin (Ra 0.4–0.8µm) |
| Tolerance | ±0.1 mm general / ±0.05 mm mating features |
| Assembly method | Snap-fit + silicone gasket |
| Manufacturer | PCBWay CNC machining |
| PCBWay CNC link | https://www.pcbway.com/rapid-prototyping/manufacture/ |
| Qty | 100 sets (200 pcs) |
| Estimated cost | ~$22–28/unit = **~$2,500 total** |

### 9.2 Internal Gasket / Seal

| Part | Custom die-cut silicone gasket, 0.5mm, IP52 |
|------|---------------------------------------------|
| Qty | 100 |
| Unit price | ~$0.40 |
| Supplier | PCBWay / Alibaba custom die-cut |

---

## 10. Wireless Charger (Accessory)

### 10.1 Qi Wireless Charger Pad

| Part | Custom Qi transmitter pad — 40×40mm |
|------|-------------------------------------|
| Description | Qi v1.2 transmit pad, USB-C powered, 5W, matching 40×40mm footprint |
| Design | Square matte black puck with LOT Systems mark |
| Input | USB-C 5V/2A |
| Manufacturer | PCBWay (custom) or white-label Alibaba |
| Unit price (100+) | ~$8–12 |
| Notes | Ships as accessory in box. Designed to align with COSMO® CIA magnetically. |

---

## 11. Cost Summary

| Category | Total (100 units) |
|----------|------------------|
| ESP32-S3 modules | $352 |
| Displays (TFT) | $385 |
| OV2640 cameras | $462 |
| BME688 sensors | $715 |
| ICM-42688-P IMU | $308 |
| Power ICs + coils | $550 |
| LiPo batteries | $495 |
| UI components (button, haptic, LED) | $270 |
| Passive components | $61 |
| **PCB fabrication** | $320 |
| **PCB assembly (labor)** | $1,800 |
| **Stainless steel enclosure** | $2,500 |
| Silicone gaskets | $44 |
| Qi charger accessories | $1,000 |
| **Subtotal** | **~$9,262** |
| Buffer + shipping (15%) | ~$1,389 |
| **Grand Total (100 units)** | **~$10,651** |
| **Per-unit cost** | **~$107** |

---

## 12. Supplier Quick Reference

| Supplier | Use | URL |
|----------|-----|-----|
| PCBWay | PCB, PCBA, CNC enclosure | https://www.pcbway.com |
| LCSC | Electronic components (bulk) | https://www.lcsc.com |
| Mouser | ICs, sensors (quality assured) | https://www.mouser.com |
| DigiKey | ICs, connectors | https://www.digikey.com |
| Arducam | Camera modules | https://www.arducam.com |
| Waveshare | Display modules | https://www.waveshare.com |
| Bosch Sensortec | BME688 datasheet + BSEC2 SDK | https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688/ |
| Alibaba | Bulk LiPo, gaskets | https://www.alibaba.com |

---

*BOM version 1.0 — prices are estimates based on 2025–2026 market rates. Confirm pricing with suppliers before placing orders. All links are reference; verify availability before procurement.*
