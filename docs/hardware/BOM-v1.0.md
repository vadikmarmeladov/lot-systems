<!--
  LOT SYSTEMS CORPORATION
  LOT Computer — Bill of Materials v1.0
  2026-06-11
-->

# LOT Computer — Bill of Materials
## BOM-v1.0 | 2026-06-11 | Qty: 100 units

**Classification:** Internal — Hardware Engineering
**Managed by:** Vadik Marmeladov / LOT Systems Hardware Team
**PCBWay Project:** LCM-001
**Currency:** USD

---

## Sourcing Strategy

| Supplier | Use Case | URL |
|----------|----------|-----|
| LCSC | Primary SMD components | https://www.lcsc.com |
| Mouser | Premium ICs, sensors | https://www.mouser.com |
| DigiKey | Alternate source, fast ship | https://www.digikey.com |
| PCBWay | PCB fab + SMT turnkey | https://www.pcbway.com |
| AliExpress | Camera modules, OLED | https://www.aliexpress.com |
| Adafruit | Development/test parts | https://www.adafruit.com |

---

## Section A — Core Electronics

### A1. Microcontroller

| Field | Value |
|-------|-------|
| **Part** | ESP32-S3-WROOM-1-N4R2 |
| **Description** | Dual-core Xtensa LX7 @ 240MHz, Wi-Fi 4 + BLE 5.0, 4MB Flash, 2MB PSRAM, DVP camera interface |
| **Manufacturer** | Espressif Systems |
| **Package** | SMD module 18.0×25.5×3.1mm, 2.54mm pitch castellated |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $3.80 |
| **Total (100)** | $380 |
| **LCSC PN** | C2913204 |
| **Mouser PN** | 356-ESP32-S3WROOM1N4R2 |
| **LCSC URL** | https://www.lcsc.com/product-detail/C2913204.html |
| **Mouser URL** | https://www.mouser.com/ProductDetail/356-ESP32-S3WROOM1N4R2 |
| **Datasheet** | https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf |
| **Notes** | Module includes PCB antenna. PSRAM required for JPEG camera buffer. |

---

### A2. OLED Display Module

| Field | Value |
|-------|-------|
| **Part** | WEA012864DWPP3N00000 |
| **Description** | 1.3″ OLED, 128×64 px, SSD1306 controller, I2C, white pixels on black, 3.3V |
| **Manufacturer** | Winstar Display |
| **Package** | 35.0×33.0×1.45mm, FPC connector |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $2.50 |
| **Total (100)** | $250 |
| **LCSC PN** | C5148940 |
| **AliExpress** | Search "1.3 inch OLED I2C SSD1306 128x64" |
| **LCSC URL** | https://www.lcsc.com/product-detail/C5148940.html |
| **Datasheet** | https://www.winstar.com.tw/products/oled-module/graphic-oled-display/wea012864d.html |
| **Notes** | Active area 29.42×14.7mm. Fits within 40×40mm body with margins. I2C address 0x3C or 0x3D. |

---

### A3. Camera Module

| Field | Value |
|-------|-------|
| **Part** | OV2640 + M8 lens, bare module |
| **Description** | OmniVision OV2640, 2MP UXGA, DVP parallel interface, built-in JPEG encoder, 15fps @ full res |
| **Manufacturer** | OmniVision / AiThinker |
| **Package** | 20×20×10mm including lens holder |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $4.20 |
| **Total (100)** | $420 |
| **LCSC PN** | C10088 (bare sensor die) |
| **AliExpress** | Search "OV2640 DVP camera module 24-pin FPC" |
| **AliExpress URL** | https://www.aliexpress.com/wholesale?SearchText=OV2640+DVP+24pin+FPC+module |
| **Datasheet** | https://www.uctronics.com/download/cam_module/OV2640DS.pdf |
| **Notes** | DVP (parallel) interface. Requires FIFO buffer in PSRAM. Lens protrudes 1.5mm above PCB — accommodated by body bump. Select wide-angle (120°) M8 lens. |

---

### A4. Environmental Sensor (AI-Grade)

| Field | Value |
|-------|-------|
| **Part** | BME688 |
| **Description** | 4-in-1 environmental sensor: temperature (±0.5°C), relative humidity (±3%), barometric pressure (±0.6 hPa), gas/VOC index. Integrated AI pattern recognition via Bosch BSEC library. |
| **Manufacturer** | Bosch Sensortec |
| **Package** | LGA-8L 3.0×3.0×0.93mm |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $7.50 |
| **Total (100)** | $750 |
| **Mouser PN** | 828-BME688 |
| **DigiKey PN** | 828-BME688-ND |
| **Mouser URL** | https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688 |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/bosch-sensortec/BME688 |
| **Datasheet** | https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme688-ds000.pdf |
| **BSEC Library** | https://www.bosch-sensortec.com/software-tools/software/bme688-software/ |
| **Notes** | I2C address 0x76. Bosch BSEC library provides AI-trained gas classification. Must not be exposed to silicone or adhesives — contamination degrades gas sensor. |

---

### A5. IMU — AI-Grade Inertial Sensor

| Field | Value |
|-------|-------|
| **Part** | ISM330DHCX |
| **Description** | 6-axis IMU (3-axis accel + 3-axis gyro), embedded machine learning core (MLC), finite state machine (FSM), 0.4mg sensitivity accelerometer. Tap detection for screen wake. |
| **Manufacturer** | STMicroelectronics |
| **Package** | LGA-14L 2.5×3.0×0.83mm |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $2.10 |
| **Total (100)** | $210 |
| **Mouser PN** | 511-ISM330DHCX |
| **DigiKey PN** | 497-ISM330DHCXTR-ND |
| **Mouser URL** | https://www.mouser.com/ProductDetail/STMicroelectronics/ISM330DHCX |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/stmicroelectronics/ISM330DHCXTR |
| **Datasheet** | https://www.st.com/resource/en/datasheet/ism330dhcx.pdf |
| **Notes** | I2C address 0x6A. Configure tap detection on Z-axis to wake display. MLC can run custom AI models for gesture recognition. INT1 pin → GPIO for wake interrupt. |

---

## Section B — Power System

### B1. Wireless Charging Receiver IC

| Field | Value |
|-------|-------|
| **Part** | STWLC38JR |
| **Description** | Qi 5W wireless power receiver IC with integrated LDO and Li-Po charging. Single-chip solution. WPC 1.3 compliant. |
| **Manufacturer** | STMicroelectronics |
| **Package** | WLCSP-25 3.2×3.2×0.8mm |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $3.50 |
| **Total (100)** | $350 |
| **Mouser PN** | 511-STWLC38JR |
| **Mouser URL** | https://www.mouser.com/ProductDetail/STMicroelectronics/STWLC38JR |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/stmicroelectronics/STWLC38JR |
| **Datasheet** | https://www.st.com/en/power-management/stwlc38.html |
| **Notes** | Handles Qi negotiation + battery charge management. I2C status reporting to MCU. VOUT max 5V/1A. Coil: 30×30mm flex PCB, 12 turns, 0.15mm trace, L ≈ 6.5μH. |

### B2. Wireless Charging Coil

| Field | Value |
|-------|-------|
| **Part** | Custom flex PCB coil |
| **Description** | Single-layer copper flex PCB, spiral coil 30×30mm, 12 turns, 0.15mm trace, 0.15mm gap, L ≈ 6.5μH. Laser-cut PET substrate 0.1mm. |
| **Manufacturer** | PCBWay (flex PCB service) |
| **Thickness** | 0.1mm flex + 35μm copper = ~0.2mm total |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $1.80 |
| **Total (100)** | $180 |
| **PCBWay Flex URL** | https://www.pcbway.com/pcb-service/flexible-pcb/ |
| **Notes** | Placed between battery and bottom plate. Ferrite sheet (0.1mm) between coil and battery to prevent eddy current losses. |

### B3. Ferrite Sheet

| Field | Value |
|-------|-------|
| **Part** | Laird Eccosorb MCS-05 or equivalent |
| **Description** | Flexible ferrite sheet 30×30mm, 0.1mm thick, μ=130, for Qi shielding |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.80 |
| **Total (100)** | $80 |
| **Mouser** | Search "flexible ferrite sheet 30x30mm Laird" |
| **AliExpress** | Search "Qi ferrite sheet 30x30 0.1mm" |

### B4. Li-Po Battery

| Field | Value |
|-------|-------|
| **Part** | LP320340 (or equivalent 3mm×23mm×40mm) |
| **Description** | 3.7V, 320mAh Li-Po, with PCM protection circuit, JST-PH 2.0 connector |
| **Manufacturer** | GREPOW / LiShen / Amperex |
| **Dimensions** | 3.2×23×40mm (fits within 39×39mm internal width, 4mm depth after stacking) |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $3.20 |
| **Total (100)** | $320 |
| **LCSC** | Search "LP320340 lipo 320mah 3.7V" |
| **AliExpress URL** | https://www.aliexpress.com/wholesale?SearchText=LP320340+lipo+battery |
| **Notes** | Must include PCM (protection circuit module). UN38.3 certification required for shipping. |

### B5. USB-C Battery Charger IC (Fallback Path)

| Field | Value |
|-------|-------|
| **Part** | MCP73831T-2ACI/OT |
| **Description** | Single-cell Li-Ion/Li-Po linear charger, 500mA max, SOT-23-5, VOUT=4.2V |
| **Manufacturer** | Microchip Technology |
| **Package** | SOT-23-5 |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.40 |
| **Total (100)** | $40 |
| **Mouser PN** | 579-MCP73831T2ACIOTS |
| **DigiKey PN** | MCP73831T-2ACI/OTCT-ND |
| **Mouser URL** | https://www.mouser.com/ProductDetail/Microchip-Technology/MCP73831T-2ACI-OT |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/microchip-technology/MCP73831T-2ACI-OT |
| **Datasheet** | https://ww1.microchip.com/downloads/en/DeviceDoc/MCP73831-Family-Data-Sheet-DS20001984H.pdf |
| **Notes** | Used for USB-C charging path. RPROG = 2kΩ sets Icharge = 500mA. STAT pin → LED indicator. |

---

## Section C — Power Management

### C1. 3.3V LDO Regulator

| Field | Value |
|-------|-------|
| **Part** | AP2112K-3.3TRG1 |
| **Description** | 600mA LDO, 3.3V output, ultra-low noise, EN pin, SOT-23-5 |
| **Manufacturer** | Diodes Inc. |
| **Package** | SOT-23-5 |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.25 |
| **Total (100)** | $25 |
| **LCSC PN** | C6187 |
| **LCSC URL** | https://www.lcsc.com/product-detail/C6187.html |
| **Notes** | Powers ESP32-S3, sensors, OLED. Input from battery via STWLC38 VOUT or USB-C path. Add 10μF + 100nF caps on each rail. |

### C2. USB-C ESD Protection

| Field | Value |
|-------|-------|
| **Part** | USBLC6-2SC6 |
| **Description** | TVS diode array for USB-C ESD protection, SOT-23-6 |
| **Manufacturer** | STMicroelectronics |
| **Package** | SOT-23-6 |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.30 |
| **Total (100)** | $30 |
| **LCSC PN** | C2827654 |
| **LCSC URL** | https://www.lcsc.com/product-detail/C2827654.html |

---

## Section D — Connectivity

### D1. USB-C Connector

| Field | Value |
|-------|-------|
| **Part** | TYPE-C-31-M-12 |
| **Description** | USB 2.0 Type-C receptacle, mid-mount, SMD, 9×3.26mm above PCB |
| **Manufacturer** | Korean Hroparts / Jing Connectors |
| **Package** | SMD mid-mount |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.80 |
| **Total (100)** | $80 |
| **LCSC PN** | C165948 |
| **LCSC URL** | https://www.lcsc.com/product-detail/C165948.html |
| **Notes** | Used for factory firmware flashing and emergency charge. Not exposed to user during normal use (flush with edge of body). |

### D2. 2.4GHz Chip Antenna

| Field | Value |
|-------|-------|
| **Part** | Molex 2048390100 |
| **Description** | 2.4GHz chip antenna, 2.0×1.25×0.3mm, 50Ω, for ESP32 |
| **Manufacturer** | Molex |
| **Package** | SMD 2.0×1.25mm |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.45 |
| **Total (100)** | $45 |
| **Mouser PN** | 538-2048390100 |
| **Mouser URL** | https://www.mouser.com/ProductDetail/Molex/2048390100 |
| **Notes** | Use when ESP32-S3 module PCB antenna clearance is insufficient. Keep 3mm clearance from metal frame. |

---

## Section E — User Interface

### E1. COPY Button

| Field | Value |
|-------|-------|
| **Part** | C&K KXT332LHS |
| **Description** | Low-profile tactile switch, 3.2×3.2×1.5mm, 180gf actuation, SPST-NO |
| **Manufacturer** | C&K Components |
| **Package** | SMD 3.2×3.2mm, 1.5mm height |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.60 |
| **Total (100)** | $60 |
| **Mouser PN** | 611-KXT332LHS |
| **Mouser URL** | https://www.mouser.com/ProductDetail/CK/KXT332LHS |
| **Notes** | 1.5mm height allows for 0.3mm steel actuator cap plus 1.2mm internal. Button positioned bottom-right on front face. Stainless steel cap CNC machined to match body finish. |

### E2. Charge Indicator LED

| Field | Value |
|-------|-------|
| **Part** | APTD3216CGCK |
| **Description** | Green 0805 SMD LED, 2.2V Vf, 20mA, 572nm |
| **Manufacturer** | Kingbright |
| **Package** | 0805 |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $0.10 |
| **Total (100)** | $10 |
| **LCSC PN** | C2290 |
| **LCSC URL** | https://www.lcsc.com/product-detail/C2290.html |
| **Notes** | Positioned bottom-center front face. Visible through 2mm sapphire lens port in steel body. Breathing animation during charge; solid when full; off when running. |

---

## Section F — Passives & Support

### F1. Decoupling Capacitors

| Part | Value | Qty/unit | LCSC PN | Unit Price |
|------|-------|----------|---------|-----------|
| 0402 Cap | 100nF 10V X5R | 20 | C1525 | $0.01 |
| 0402 Cap | 10μF 10V X5R | 8 | C19702 | $0.05 |
| 0402 Cap | 4.7μF 10V X5R | 4 | C23733 | $0.03 |
| 0402 Cap | 1μF 10V X7R | 4 | C52923 | $0.02 |

### F2. Resistors

| Part | Value | Qty/unit | LCSC PN | Unit Price |
|------|-------|----------|---------|-----------|
| 0402 Res | 2kΩ 1% | 2 | C25879 | $0.01 |
| 0402 Res | 10kΩ 1% | 6 | C25804 | $0.01 |
| 0402 Res | 4.7kΩ 1% | 4 | C25905 | $0.01 |
| 0402 Res | 100Ω 1% | 2 | C22775 | $0.01 |
| 0402 Res | 33Ω 1% | 4 | C25022 | $0.01 |

### F3. Total Passives (per unit)

Passives bundle cost: ~$0.80/unit → $80 total for 100 units.

---

## Section G — Mechanical

### G1. SS316L Body Frame (CNC)

| Field | Value |
|-------|-------|
| **Part** | LCM-FRAME-001 |
| **Description** | CNC-machined SS316L body frame, 40×40×5mm outer, 39×39×4mm inner, #400 bead blast finish, front face with cutouts for screen, camera, button, USB-C, LED |
| **Manufacturer** | PCBWay CNC |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $16.00 |
| **Total (100)** | $1,600 |
| **PCBWay CNC URL** | https://www.pcbway.com/rapid-prototyping/manufacture/ |
| **Notes** | STEP file to be provided. Camera bump: 8mm dia, 1.5mm raised. 4× M1.2 threaded inserts for plate screws. Screen window: 31×16mm rectangular cutout. Button hole: 8.5mm dia. USB-C slot: 10×3.8mm. |

### G2. SS316L Mirror Back Plate (CNC + Polish)

| Field | Value |
|-------|-------|
| **Part** | LCM-BACKPLATE-001 |
| **Description** | CNC-machined SS316L plate, 40×40×0.5mm, mirror polished to Ra≤0.05μm, 4× M1.2 countersunk holes |
| **Manufacturer** | PCBWay CNC |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $12.00 |
| **Total (100)** | $1,200 |
| **Notes** | Mirror polish (electropolish + mechanical buff). Laser engrave LOT® logo + serial on inner surface. Countersunk holes flush with outer surface. |

### G3. Screen Window Glass

| Field | Value |
|-------|-------|
| **Part** | Sapphire glass lens, 31×16×0.5mm |
| **Description** | Optical-grade sapphire window, AR coated, protects OLED from scratches |
| **Manufacturer** | Precision Sapphire Technologies / Edmund Optics |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $3.50 |
| **Total (100)** | $350 |
| **Notes** | Bonded with UV-cure optical adhesive (Dymax OP-4-20637 or equivalent). Sapphire hardness 9 Mohs vs SS 6 Mohs — prevents scratching. |

### G4. Camera Lens Assembly

| Field | Value |
|-------|-------|
| **Part** | M8 wide-angle lens, f=2.8mm, 120° FOV |
| **Description** | M8 mount, plastic/glass, 7.7mm diameter, fits in 8mm body bump |
| **Qty/unit** | 1 |
| **Unit price (qty 100)** | $1.50 |
| **Total (100)** | $150 |
| **AliExpress URL** | https://www.aliexpress.com/wholesale?SearchText=M8+lens+2.8mm+120+degree |

### G5. Fasteners

| Part | Spec | Qty/unit | Unit Price |
|------|------|----------|-----------|
| Countersunk screws | M1.2×3mm SS316 | 4 | $0.05 |
| IP52 gasket | 38×38mm silicone, 0.3mm | 1 | $0.25 |

### G6. Packaging

| Field | Value |
|-------|-------|
| **Contents** | Device + magnetic charging pad + USB-A→C cable + QR activation card + Quick Start card |
| **Box** | 60×60×30mm rigid cardboard, matte black, LOT® embossed |
| **Unit price** | $3.00 |
| **Total (100)** | $300 |

---

## BOM Summary Table

| Section | Description | Total (100 units) |
|---------|-------------|------------------|
| A — Core Electronics | MCU, Display, Camera, Sensors | $2,010 |
| B — Power System | Qi IC, coil, battery, charger | $970 |
| C — Power Mgmt | LDO, ESD | $55 |
| D — Connectivity | USB-C, antenna | $125 |
| E — UI | Button, LED | $70 |
| F — Passives | Caps, resistors | $80 |
| G — Mechanical | Steel body, glass, lens, packaging | $3,980 |
| **GRAND TOTAL** | | **$7,290** |
| **Per-unit hardware cost** | | **$72.90** |
| **PCBWay PCB+SMT** | Separate PCBWay order | $2,220 |
| **Total per unit (all-in)** | | **~$94.50** |

---

## Approved Alternates

| Primary Part | Alternate | Condition |
|-------------|-----------|-----------|
| ESP32-S3-WROOM-1-N4R2 | ESP32-S3-WROOM-1U-N4R2 (U.FL ant) | If PCB antenna clearance fails |
| BME688 | BME680 | Gas AI features reduced; acceptable for v1 |
| ISM330DHCX | LSM6DSO32 | Slightly lower noise; no MLC |
| STWLC38JR | BQ51013B | Different package, requires external FETs |
| SSD1306 OLED | SH1107 1.3″ (128×128) | Square display option for v2 |
| OV2640 | OV7670 (VGA only) | Lower resolution, simpler interface |

---

*LOT COMPUTER BOM v1.0 — COMPLETE*
*© 2026 LOT Systems. All rights reserved.*
