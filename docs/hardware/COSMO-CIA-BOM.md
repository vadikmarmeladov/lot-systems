# COSMO® CIA — Bill of Materials (BOM)

**Version:** 1.0
**Date:** 2026-05-26
**Run quantity:** 100 production units
**Currency:** USD (prices as of Q2 2026, excl. shipping)

---

## Quick Cost Summary

| Category | Unit cost | 100-unit total |
|---|---|---|
| Electronic components (BOM) | $28.55 | $2,855 |
| PCB fabrication (PCBWay) | $1.20 | $120 |
| PCB assembly / PCBA (PCBWay) | $5.50 | $550 |
| Stainless steel CNC enclosure (PCBWay) | $22.00 | $2,200 |
| Mirror polish + finishing | $5.00 | $500 |
| Glass panel (borosilicate, 0.4mm) | $1.80 | $180 |
| Silicone gasket | $0.60 | $60 |
| Titanium screws M1.0 (4×) | $0.40 | $40 |
| Packaging (retail box + insert) | $2.20 | $220 |
| **Total per unit** | **$67.25** | — |
| **Total 100-unit run** | — | **$6,725** |

> Engineering prototype run (5 units, pre-production validation): est. $1,200 additional (CNC prototype premium).

---

## 1. Microcontroller & RF

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| U1 | ESP32-S3-WROOM-1-N8R8 MCU module | Espressif | ESP32-S3-WROOM-1-N8R8 | 1 | $3.20 | DigiKey | https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N8R8/15198288 |

**Notes:** Pre-certified FCC ID: 2AC7Z-ESP32S3WROOM1. Includes 8MB Flash + 8MB PSRAM. Antenna onboard (PCB trace). No additional RF components required.

---

## 2. Display

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| DSP1 | 1.54" e-Paper Display B/W 200×200 | Good Display | GDEM0154D67 | 1 | $5.80 | Good Display direct | https://www.good-display.com/product/388.html |
| C_DSP | 0.1µF 0402 decoupling cap (×3) | Yageo | CC0402KRX5R8BB104 | 3 | $0.02 | DigiKey | https://www.digikey.com/en/products/detail/yageo/CC0402KRX5R8BB104/2103145 |

**Notes:** GDEM0154D67 supports partial refresh (300ms). SPI 4-wire interface. Operating range −15 to +60°C. Panel includes integrated driver (SSD1681). FFC cable included.

---

## 3. Camera

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| CAM1 | OV7675 VGA CMOS Image Sensor | OmniVision | OV7675-A82A | 1 | $2.90 | Mouser | https://www.mouser.com/ProductDetail/OmniVision/OV7675-A82A |
| LNS1 | M7 flat optic lens assembly, f2.1mm, 110° FOV | Various | — | 1 | $1.20 | Aliexpress/Seeed | https://www.seeedstudio.com/OV7670-Camera-Module-p-1634.html |
| FPC1 | 24-pin FFC cable 0.5mm pitch, 30mm length | Amphenol | G10AW2-B020W2ER | 1 | $0.30 | DigiKey | https://www.digikey.com/en/products/detail/amphenol-cs-fci/G10AW-B020W2ER/4293988 |

**Notes:** OV7675 is the DVP (parallel) variant, directly compatible with ESP32-S3 camera peripheral. Lens profile <2.5mm height from PCB. Camera module soldered flat to PCB with FPC to sensor board.

**Alternative:** Himax HM01B0 (QVGA 320×240, ultra-low power 1.1mW, ULP mode) for longer battery life if camera usage is minimal.

---

## 4. Environmental Sensor (Weather + Air Quality)

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| U2 | BME688 4-in-1 Environmental Sensor | Bosch Sensortec | BME688 | 1 | $4.50 | DigiKey | https://www.digikey.com/en/products/detail/bosch-sensortec/BME688/13681289 |

**Notes:** LGA-8 package, 3.0×3.0×0.93mm. I2C (0x76 default). Includes Bosch BSEC2 AI library for onboard IAQ classification, CO₂ equivalent, breath VOC estimation. Must vent to atmosphere — PCB placement near small case vent hole (0.5mm ⌀ on side edge).

**Sensor outputs:**
- Temperature: ±0.5°C (−40 to +85°C)
- Humidity: ±3% RH (0–100%)
- Pressure: ±1 hPa (300–1100 hPa)
- IAQ index: 0–500 (0=clean, 500=heavily polluted)
- CO₂ equivalent: 400–8192 ppm
- Breath VOC: 0.01–1000 ppm

---

## 5. Wireless Charging

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| U3 | BQ51013BRHLR Qi Receiver IC | Texas Instruments | BQ51013BRHLR | 1 | $2.80 | DigiKey | https://www.digikey.com/en/products/detail/texas-instruments/BQ51013BRHLR/3459517 |
| L_QI | Qi Flex Coil 30×30mm 6.3µH | Würth Elektronik | 760308102214 | 1 | $1.50 | Mouser | https://www.mouser.com/ProductDetail/Wurth-Elektronik/760308102214 |
| C_QI1 | 4.7µF 0402 ceramic cap | Murata | GRM155R60J475ME47D | 2 | $0.08 | DigiKey | https://www.digikey.com/en/products/detail/murata-electronics/GRM155R60J475ME47D/5797545 |
| C_QI2 | 100nF 0402 ceramic cap | Yageo | CC0402KRX5R8BB104 | 2 | $0.02 | DigiKey | https://www.digikey.com/en/products/detail/yageo/CC0402KRX5R8BB104/2103145 |

**Notes:** BQ51013B supports Qi v1.1, up to 5W. OVP, OCP, thermal protection included. Flex coil bonds to rear PEEK window (see spec §3.2). Coil thickness 0.4mm. Ferrite sheet (TDK IFL12, 0.1mm) between coil and PCB to prevent eddy current losses.

---

## 6. Charge Management (LiPo)

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| U4 | MCP73831T-2ACI/OT LiPo Charge IC | Microchip | MCP73831T-2ACI/OT | 1 | $0.72 | DigiKey | https://www.digikey.com/en/products/detail/microchip-technology/MCP73831T-2ACI-OT/1212465 |
| R_PROG | 10kΩ 0402 resistor (sets 100mA charge current) | Yageo | RC0402FR-0710KL | 1 | $0.02 | DigiKey | https://www.digikey.com/en/products/detail/yageo/RC0402FR-0710KL/726832 |

**Notes:** MCP73831 in SOT-23-5. PROG pin resistor: R = 1000/I_charge → 10kΩ = 100mA. Charge termination: 4.2V. LED indicator via STAT pin routed to RGB LED.

---

## 7. Battery

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| BAT1 | LiPo 3.7V 120mAh Ultra-Thin, ~40×30×1mm | Grepow | GRP3030012 (custom spec) | 1 | $2.80 | Grepow direct | https://www.grepow.com/page/shaped-battery.html |

**Notes:** Order requires direct quote from Grepow (Dongguan, China). MOQ for custom thin cells: 200 pcs. Specify: 40×30×1.0mm max dimensions, 120mAh, UL certified, 2-wire + NTC thermistor, JST-PH 1.25mm connector. Lead time: 4–6 weeks. Unit price drops to ~$2.20 at 500 pcs.

**Alternative (off-shelf, slightly thicker):** Adafruit 1570 (500mAh, 30×38×3.5mm) — fits in a 3.5mm thickness variant of the device.

---

## 8. Voltage Regulation

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| U5 | TPS62740DSSR 3.3V 300mA LDO | Texas Instruments | TPS62740DSSR | 1 | $1.10 | DigiKey | https://www.digikey.com/en/products/detail/texas-instruments/TPS62740DSSR/4555370 |
| C_REG | 10µF 0402 input cap | Murata | GRM155R60J106ME11D | 2 | $0.10 | DigiKey | https://www.digikey.com/en/products/detail/murata-electronics/GRM155R60J106ME11D/4905706 |

---

## 9. Copy Button + Haptic

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| SW1 | Tactile switch, ultra-thin 0.8mm height | Panasonic | EVQPUJ02K | 1 | $0.48 | DigiKey | https://www.digikey.com/en/products/detail/panasonic-electronic-components/EVQPUJ02K/382946 |
| U6 | DRV2605LYZFT Haptic Driver | Texas Instruments | DRV2605LYZFT | 1 | $1.35 | DigiKey | https://www.digikey.com/en/products/detail/texas-instruments/DRV2605LYZFT/4555345 |
| M1 | 10mm LRA Haptic Motor, 1.0mm thick | Jinlong Machinery | Z10FL2B1210009 | 1 | $0.90 | Mouser | https://www.mouser.com/ProductDetail/Jinlong-Machinery-Electronics/Z10FL2B1210009 |

**Button keycap:** Custom anodised aluminium, 8×8×1.2mm, black. CNC-machined via PCBWay (batch with enclosure). ~$0.60/ea at 100 pcs.

---

## 10. USB-C (Programming)

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| J1 | USB-C receptacle, SMD, bottom-mount, 0.9mm height | GCT | USB4135-GF-A | 1 | $0.55 | DigiKey | https://www.digikey.com/en/products/detail/gct/USB4135-GF-A/10180584 |
| F1 | 500mA PTC resettable fuse 0402 | Bel Fuse | 0ZCF005AF2A | 1 | $0.18 | DigiKey | https://www.digikey.com/en/products/detail/bel-fuse-inc/0ZCF005AF2A/7800185 |

---

## 11. Status LED

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| LED1 | SK6812MINI-E RGB LED 3.5×3.5mm | OPSCO | SK6812MINI-E | 1 | $0.22 | DigiKey | https://www.digikey.com/en/products/detail/adafruit-industries-llc/2686/7056753 |

**Notes:** Single-wire protocol, driven direct from ESP32-S3 GPIO. Indicates charging state, notification received, Copy sent, provisioning mode.

---

## 12. Passive Components (Summary)

All 0402 package. Total est. $1.05/unit at quantity.

| Function | Values | Qty |
|---|---|---|
| Bypass caps (100nF) | Yageo CC0402 | 12 |
| Bulk caps (10µF) | Murata GRM155 | 6 |
| Pull-up resistors (10kΩ) | Yageo RC0402 | 8 |
| Boot/strapping resistors | Yageo RC0402 | 4 |
| e-ink current limit resistors | Yageo RC0402 | 3 |
| SPI series resistors (33Ω) | Yageo RC0402 | 4 |

---

## 13. Crystal Oscillator

| # | Part | Manufacturer | MPN | Qty/unit | Unit price (×100) | Supplier | Link |
|---|---|---|---|---|---|---|---|
| X1 | 32.768 kHz XTAL, 3.2×1.5mm | Abracon | ABS07-32.768KHZ-T | 1 | $0.45 | DigiKey | https://www.digikey.com/en/products/detail/abracon-llc/ABS07-32768KHZ-T/1987177 |

**Notes:** RTC crystal for accurate timekeeping in deep sleep. The ESP32-S3's internal RC oscillator drifts ±5% — external XTAL maintains 1-minute accuracy per day.

---

## 14. PCB (PCBWay)

| Spec | Value |
|---|---|
| Dimensions | 40 × 38 mm |
| Layer count | 4 (signal / GND / power / signal) |
| Thickness | 0.6 mm |
| Copper weight | 1 oz (outer), 0.5 oz (inner) |
| Surface finish | ENIG (gold) |
| Solder mask | Black (both sides) |
| Silkscreen | White |
| Min trace/space | 4/4 mil |
| Min via | 0.2mm drill / 0.4mm pad |
| Qty | 100 pcs |
| **Unit price** | **~$1.20** |
| **Total** | **~$120** |

**Order link:** https://www.pcbway.com/orderonline.aspx

**Notes:** Upload Gerber ZIP + drill files. Select "0.6mm board thickness" (non-standard, confirm availability with PCBWay before ordering). 4-layer stackup: L1=signal, L2=GND plane, L3=3.3V plane, L4=signal.

---

## 15. PCB Assembly — PCBA (PCBWay)

| Service | Value |
|---|---|
| Type | SMT (both sides, top-heavy) |
| Components | 42 unique, 68 total placements |
| Stencil | Laser-cut steel stencil, 0.1mm thickness |
| Solder paste | SAC305 (lead-free) |
| Reflow profile | Standard lead-free |
| IPC class | IPC-A-610 Class 2 |
| Testing | AOI + visual inspection |
| Qty | 100 units |
| **Unit price** | **~$5.50** |
| **Total** | **~$550** |

**Order link:** https://www.pcbway.com/pcb-assembly/

**Notes:** Provide BOM in PCBWay format (CSV with MPN, supplier, qty) + CPL (centroid) file from KiCad/Altium. Qi coil and battery connected via hand-soldered JST connectors (not PCBA scope).

---

## 16. Stainless Steel Enclosure (PCBWay CNC)

| Part | Spec | Qty/unit | Unit price (×100) | Total |
|---|---|---|---|---|
| Part A — Rear Shell (mirror polished) | 316L SS, CNC 5-axis, Ra ≤ 0.05µm | 1 | $12.00 | $1,200 |
| Part B — Front Frame | 316L SS, CNC 5-axis, bead-blast satin | 1 | $10.00 | $1,000 |
| Mirror polish labour | Electro-polish + hand buff (Part A only) | 1 | $5.00 | $500 |
| PEEK Qi window (Part A) | Injection-moulded or CNC PEEK, 28×28mm | 1 | $1.50 | $150 |
| Silicone gasket | Custom-cut silicone strip, 0.5mm | 1 | $0.60 | $60 |
| Titanium screws M1.0×3mm | Phillips flathead, countersunk | 4 | $0.10 ea | $40 |
| Glass panel (borosilicate 0.4mm, 31×31mm) | Optical clear, UV-bonded | 1 | $1.80 | $180 |

**CNC order link:** https://www.pcbway.com/rapid-prototyping/manufacture/

**Notes:** 316L (marine grade) chosen for corrosion resistance and biocompatibility (skin contact). CNC 5-axis required for side-wall features (vent hole, USB-C slot, charging port edge). 100-unit CNC pricing at PCBWay — request formal quote via their online system.

---

## 17. Recommended Wireless Charger (Accessory — not in BOM)

| Item | Brand/Model | Price | Link |
|---|---|---|---|
| 5W Qi Wireless Pad | Belkin BOOST↑CHARGE WIA001 | $19.99 | https://www.belkin.com/wireless-charging-pad/P-WIA001.html |
| Slim 5W Qi Pad (ultra-flat) | Anker 313 Wireless Charger A2503 | $12.99 | https://www.anker.com/products/a2503 |

---

## 18. Packaging

| Item | Spec | Unit cost |
|---|---|---|
| Retail box | 50×50×15mm rigid kraft, silver foil logo | $0.80 |
| Inner foam tray | Die-cut EVA foam, custom fit | $0.60 |
| Quick-start card | 85×55mm, both sides, 350gsm | $0.35 |
| USB-A to USB-C cable (0.3m) | For initial firmware flash | $0.45 |

---

## Total BOM Cost — Per-Unit Breakdown

| Line | Cost |
|---|---|
| Electronic components | $28.55 |
| PCB | $1.20 |
| PCBA | $5.50 |
| SS enclosure (2 parts + polish) | $22.00 |
| Glass + gasket + screws | $2.90 |
| Packaging | $2.20 |
| Contingency (5%) | $3.12 |
| **Unit total (100-unit run)** | **$65.47** |

**Suggested retail price:** $289–$349 (hardware + 1-year LOT subscription included)
**Margin at $299:** ~$234 (80%)

---

*All prices are estimates for Q2/Q3 2026 at 100-unit quantities. Request formal quotes from each supplier. DigiKey/Mouser pricing requires account login. PCBWay CNC pricing requires RFQ upload.*
