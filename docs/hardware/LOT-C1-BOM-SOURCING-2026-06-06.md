<!--
  LOT SYSTEMS CORPORATION — LOT-C1 Hardware
  Companion to: LOT-HW-C1-001
  Classification: RESTRICTED — S-2 EYES
-->

# LOT-C1 — Verified Component Sourcing Reference

**Document ID:** LOT-HW-C1-002  
**Date:** 2026-06-06  
**Parent Document:** LOT-HW-C1-001 (LOT-C1-HARDWARE-DESIGN-2026-06-06.md)  
**Purpose:** Verified supplier links + alternative part numbers from live web research

---

## Quick-Reference BOM with Verified Links

### MCU — ESP32-S3

| Option | Part | Dimensions | Price (100 qty) | Buy Link |
|--------|------|-----------|----------------|---------|
| **Primary** | ESP32-S3-MINI-1U-N8R8 | 15.4×20.5×3.1mm | ~$3.20 | [Mouser](https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-MINI-1U-N8R8) |
| Alternative | OMGS3 (Unexpected Maker) | 25×10×3mm | ~$17 | [Pimoroni](https://shop.pimoroni.com/en-us/products/omgs3-esp32-s3) |
| Alternative | Seeed XIAO ESP32-C3 | 21×17.5mm | ~$5 | [Seeed Studio](https://www.seeedstudio.com/Seeed-XIAO-ESP32C3-p-5431.html) |

> **Recommendation:** ESP32-S3-MINI-1U for production (native camera DVP, most capable). OMGS3 for breadboard prototyping.

---

### Display

| Option | Part | Size | Price (100 qty) | Buy Link |
|--------|------|------|----------------|---------|
| **Primary (OLED)** | SH1107 1.3" 128×128 | 30×30mm | ~$4.80 | [BuyDisplay](https://www.buydisplay.com/white-1-3-inch-oled-display-module-128x128-arduino-spi) |
| Alternative (OLED small) | ER-OLEDM1.09-1W 128×64 | 24×33×2.42mm | $9.99 | [DisplayModule](https://www.displaymodule.com/products/1-09-inch-oled-graphic-display-128x64-with-spi) |
| Alternative (E-Paper) | GDEH0154D67 1.54" 200×200 | 37×37×1.5mm | $3.41–$7.63 | [BuyDisplay E-Paper](https://www.buydisplay.com/e-paper-display/1-54-inch) |

> **Note:** E-paper uses significantly less power (near-zero static image draw) and is visible in bright sunlight. Recommended for pager-style notification use. OLED has higher contrast + faster refresh.

---

### Camera

| Option | Part | Dimensions | Price (100 qty) | Buy Link |
|--------|------|-----------|----------------|---------|
| **Primary** | Himax HM01B0-MNA | 3.6×3.1×1.7mm | ~$2.10 | [Arrow Electronics](https://www.arrow.com/en/products/hm01b0-mna/himax-technologies) |
| Alternative (higher res) | Arducam OV2640 Mini B0031 | 21×21×8–10mm | ~$32–$35 | [Arducam](https://www.arducam.com/product/arducam-ov2640-camera-module-2mp-mini-ccm-compact-camera-modules-compatible-with-arduino_m0031esp32-esp8266-development-board-with-dvp-24-pin-interface_/) |

> **Critical note:** The Arducam OV2640 module adds 8–10mm height due to the lens barrel. This disqualifies it from a 5–6mm enclosure without a recessed lens well. The **Himax HM01B0 is the only camera that fits the form factor** (1.7mm height with flex FPC). Accept the lower 320×320 resolution for v1.

---

### Weather + AI Sensor (BME688)

| Option | Part | Price (100 qty) | Buy Link |
|--------|------|----------------|---------|
| **Primary (bare IC)** | Bosch BME688 | ~$3.60–$4.50 | [DigiKey](https://www.digikey.com/en/products/detail/bosch-sensortec/BME688/13681261) |
| Dev/proto module | Adafruit #5046 STEMMA QT | $19.95 | [Adafruit](https://www.adafruit.com/product/5046) |

> Use bare IC for production BOM. Use Adafruit module for prototype/development only.

---

### Qi Wireless Charging

| Option | Part | Price (100 qty) | Buy Link |
|--------|------|----------------|---------|
| **Primary (IC)** | TI BQ51013BRHLR | $3.60–$4.24 | [DigiKey](https://www.digikey.com/en/product-highlight/t/texas-instruments/bq51013b-wireless-power-receiver-ic) |
| Dev module | Adafruit Universal Qi Rx #1901 | $14.95 | [Adafruit](https://www.adafruit.com/product/1901) |
| Qi coil | Würth WR202020-9M8-G | ~$1.20 | [Mouser Würth](https://www.mouser.com/ProductDetail/Wurth-Elektronik/760308101214) |

> Adafruit module (25×25×1.5–2mm) works for prototype assembly. Production uses bare BQ51013B + custom thin flex coil.

---

### Battery (LiPo)

| Option | Part | Dimensions | Capacity | Buy Link |
|--------|------|-----------|---------|---------|
| **Primary (custom)** | GREPOW custom 40×20×3mm | 40×20×3mm | 150mAh | [GREPOW](https://www.grepow.com/shaped-battery.html) |
| Standard thin alternative | Polybattery LP501965 | 5×19×65mm | 700mAh | [Polybattery](https://polybattery.com/5mm-thickness-lp501965-700mah-slim-lipo-battery-3-7-v) |
| Alternative supplier | DNK Power custom | Custom 40×35×3mm | 200–400mAh | [DNK Power](https://www.dnkpower.com/3-7v-600mah-700mah-lipo-battery/) |

> **For 40×40mm PCB:** use a 40×20mm battery in the bottom half of the board. The LP501965 (5×19×65mm) can be folded/trimmed per application if using a custom tab version. Best option: direct quote from Polybattery or GREPOW for 40×20×3mm custom cell.

---

### Copy Button

| Option | Part | Dimensions | Price (100 qty) | Buy Link |
|--------|------|-----------|----------------|---------|
| **Primary** | Littelfuse C&K NANOT100AS | 2.1×1.65×0.55mm | $0.355 | [Future Electronics](https://www.futureelectronics.com/p/electromechanical--switches--tactile/nanot100as-c&k-1134748) |
| Alternative | Littelfuse C&K NANOT100BP (side) | 2.2×1.7×1.7mm | ~$0.36 | [Littelfuse](https://www.littelfuse.com/products/switches/tactile-switches/nanot/) |
| Standard fallback | Alps SKQGABE010 | 6×6mm | $0.22 | [DigiKey](https://www.digikey.com/en/products/detail/alps-alpine/SKQGABE010/1745369) |

> **NanoT NANOT100AS is the winner** — 0.55mm total height vs Alps at 1.6mm. IP67-rated, extremely thin. Use NanoT for production.

---

## PCBWay Order Links

| Service | URL | Description |
|---------|-----|-------------|
| PCB Fabrication Quote | https://www.pcbway.com/orderonline.aspx | 4-layer, 40×40mm, 100 qty |
| PCB Advanced Quote | https://www.pcbway.com/advanced-pcb-quote.html | Upload Gerber files |
| PCBA Service | https://www.pcbway.com/pcba-service.html | SMT assembly + BOM sourcing |
| CNC Machining | https://www.pcbway.com/rapid-prototyping/cnc-machining/ | 316L SS enclosure |
| CNC Quote Direct | https://www.pcbway.com/rapid-prototyping/manufacture/?type=1 | Upload STEP file |

---

## Key Supplier Contacts for 100-Unit Order

| Supplier | Contact Method | Notes |
|----------|---------------|-------|
| PCBWay | order@pcbway.com / WhatsApp on site | Unified order: PCB + PCBA + CNC |
| GREPOW (battery) | sales@grepow.com | Request custom 40×20×3mm LiPo |
| Polybattery | Contact form at polybattery.com | LP501965 or custom variant |
| Arrow Electronics | arrow.com/contact | Himax HM01B0 — request samples first |
| Adafruit | adafruit.com | Dev/proto modules only |

---

## Prototype vs Production Parts

| Component | Prototype Part | Prototype Cost | Production Part | Production Cost |
|-----------|---------------|----------------|-----------------|----------------|
| MCU | OMGS3 dev board | $17 | ESP32-S3-MINI-1U | $3.20 |
| Display | Adafruit OLED module | $15 | Bare SH1107 panel | $4.80 |
| Camera | Arducam OV2640 board | $35 | Himax HM01B0 + FPC | $2.45 |
| Sensor | Adafruit BME688 module | $20 | Bare BME688 IC | $4.50 |
| Qi Charging | Adafruit Qi module | $15 | BQ51013B + coil | $3.50 |
| Battery | Standard 18650 in holder | $5 | Custom 40×20×3mm LiPo | $3.80 |
| Button | Breadboard tactile | $0.50 | NanoT NANOT100AS | $0.36 |
| Enclosure | 3D print (FDM) | $8 | PCBWay 316L SS CNC | $28 |
| **PROTO TOTAL** | | **~$116** | **PRODUCTION TOTAL** | **~$51 (excl. PCB/PCBA/CNC)** |

---

## Design Constraint Summary (from Research)

| Constraint | Issue | Resolution |
|------------|-------|-----------|
| 5mm total height | Camera OV2640 is 8–10mm tall | Use Himax HM01B0 (1.7mm) |
| 5mm total height | Standard LiPo 500mAh is 5mm | Custom 3mm thin cell (200mAh) OR recess battery area |
| 5mm total height | Qi coil varies 0.3–2.5mm | Specify thin flex coil (0.4mm) from Würth/custom |
| 5mm total height | OLED module with connector ~3mm | Bare panel + direct FPC = 1.5mm |
| WiFi antenna | Ground plane blocks signal | Use MINI-1U with external flex antenna routed to edge |
| Camera resolution | HM01B0 is 320×320, low light poor | Set user expectation: context capture, not photography |

---

*LOT Systems, Inc. — Inventor: Vadim Marmeladov | brand.lot-systems.com*  
*Companion to LOT-HW-C1-001 | 2026-06-06*
