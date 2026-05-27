# COSMO Computer — Bill of Materials
**Document:** 02-BILL-OF-MATERIALS  
**Revision:** A  
**Run:** 100 units  
**Date:** 2026-05-27  
**Currency:** USD  

> All prices are estimates as of Q2 2026. Request actual quotes from suppliers before ordering.  
> Links point to product pages; final pricing may vary with quantity and market conditions.

---

## 1. Electronic Components (Per PCB / Per Unit)

### 1.1 Microcontroller & Connectivity

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| U1 | ESP32-S3-MINI-1U (8MB Flash, 8MB PSRAM) | ESP32-S3-MINI-1U-N8R8 | Mouser | [ESP32-S3-MINI-1U @ Mouser](https://www.mouser.com/ProductDetail/ESP32-S3-MINI-1U) | $4.20 | $420 |
| U2 | USB-UART Bridge (for flashing) | CP2102N-A02-GQFN24 | Mouser | [CP2102N @ Mouser](https://www.mouser.com/ProductDetail/Silicon-Labs/CP2102N-A02-GQFN24) | $1.45 | $145 |
| ANT1 | 2.4 GHz Flexible Patch Antenna | 2140680100 | Mouser | [Molex 2140680100 @ Mouser](https://www.mouser.com/ProductDetail/Molex/2140680100) | $0.85 | $85 |
| J3 | U.FL SMD Connector | U.FL-R-SMT(10) | Mouser | [U.FL Connector @ Mouser](https://www.mouser.com/ProductDetail/Hirose-Connector/U.FL-R-SMT) | $0.55 | $55 |
| CBL1 | RG178 Coax 100 mm U.FL to U.FL | Various | LCSC/AliExpress | Search: "RG178 U.FL 10cm" | $0.60 | $60 |

**Subtotal:** $7.65 / unit · $765 / 100 units

---

### 1.2 Display

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| DSP1 | 1.3" TFT LCD 240×240 ST7789V Module | Waveshare 1.3inch LCD Module | Waveshare | [1.3" IPS @ Waveshare](https://www.waveshare.com/1.3inch-lcd-module.htm) | $4.99 | $499 |
| — | Display cover glass (borosilicate 0.3mm, 30×30mm) | Custom cut | SCHOTT / local glass shop | Custom order | $1.50 | $150 |

**Subtotal:** $6.49 / unit · $649 / 100 units

---

### 1.3 Camera

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| CAM1 | OV2640 2MP Camera Module (FPC, compact) | OV2640 Mini Module | LCSC / Arducam | [OV2640 @ LCSC](https://www.lcsc.com) | $5.20 | $520 |
| — | Sapphire camera lens window (Ø6mm, 0.5mm) | Custom | Edmund Optics / AliExpress | Search: "sapphire glass 6mm disc" | $1.80 | $180 |

**Subtotal:** $7.00 / unit · $700 / 100 units

---

### 1.4 Sensors (AI-Grade)

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| U3 | BME688 Environmental + AI Gas Sensor | BME688 | Mouser | [BME688 @ Mouser](https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME688) | $9.20 | $920 |
| U4 | LSM6DSO32 IMU with ML Core | LSM6DSO32TR | Mouser | [LSM6DSO32 @ Mouser](https://www.mouser.com/ProductDetail/STMicroelectronics/LSM6DSO32TR) | $3.40 | $340 |
| U5 | VEML7700 Ambient Light Sensor | VEML7700-TT | Mouser | [VEML7700 @ Mouser](https://www.mouser.com/ProductDetail/Vishay/VEML7700-TT) | $1.20 | $120 |

**Subtotal:** $13.80 / unit · $1,380 / 100 units

---

### 1.5 Power Management

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| U6 | Qi Wireless Charging Receiver IC | BQ51013BRHLR | Mouser | [BQ51013B @ Mouser](https://www.mouser.com/ProductDetail/Texas-Instruments/BQ51013BRHLR) | $4.50 | $450 |
| U7 | LiPo Battery Charger IC (300mA) | TP4056 | LCSC | [TP4056 @ LCSC](https://www.lcsc.com/product-detail/Battery-Management_TP4056_C16581.html) | $0.32 | $32 |
| U8 | 3.3V LDO Regulator 500mA | HT7833-1 | LCSC | [HT7833 @ LCSC](https://www.lcsc.com/product-detail/HT7833_C14289.html) | $0.28 | $28 |
| U9 | Buck-Boost 3.3V (stable rail) | TPS63036YFFR | Mouser | [TPS63036 @ Mouser](https://www.mouser.com/ProductDetail/Texas-Instruments/TPS63036YFFR) | $2.80 | $280 |
| L1 | Qi Charging Coil 30×30mm 6T | WR483250 | Mouser | [Qi Coil @ Mouser](https://www.mouser.com/ProductDetail/Wurth-Electronics/760308102) | $2.80 | $280 |
| BAT1 | LiPo 300mAh 3.7V (30×28×3.5mm) | LP302833 | LCSC / GREPOW | [300mAh LiPo @ LCSC](https://www.lcsc.com) | $3.20 | $320 |
| J2 | JST 1.25mm 2-pin Battery Connector | SM02B-SRSS-TB(LF)(SN) | Mouser | [JST 1.25mm @ Mouser](https://www.mouser.com/ProductDetail/JST/SM02B-SRSS-TB) | $0.28 | $28 |

**Subtotal:** $14.18 / unit · $1,418 / 100 units

---

### 1.6 User Interface

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| SW1 | COPY Tactile Button SMD 4.2×3.2mm | PTS526SK15SMTR2LFS | Mouser | [PTS526 @ Mouser](https://www.mouser.com/ProductDetail/CK/PTS526SK15SMTR2LFS) | $0.45 | $45 |
| LED1 | WS2812B-Mini RGB LED 3.5×3.5mm | WS2812B-Mini | LCSC | [WS2812B-Mini @ LCSC](https://www.lcsc.com/product-detail/WS2812B-Mini_C2976072.html) | $0.18 | $18 |

**Subtotal:** $0.63 / unit · $63 / 100 units

---

### 1.7 Connectors & Interfaces

| Ref | Component | Part Number | Supplier | Supplier Link | Unit Cost | 100× Cost |
|-----|-----------|-------------|----------|---------------|-----------|-----------|
| J1 | USB-C 2.0 Receptacle Mid-Mount | GCT USB4135-GF-A | Mouser | [USB4135 @ Mouser](https://www.mouser.com/ProductDetail/GCT/USB4135-GF-A) | $0.65 | $65 |
| J4 | FPC Connector 10-pin 0.5mm | 503480-1000 | Mouser | [FPC 10pin @ Mouser](https://www.mouser.com/ProductDetail/Molex/503480-1000) | $0.42 | $42 |
| J5 | FPC Connector 10-pin 0.5mm (Power PCB) | 503480-1000 | Mouser | [FPC 10pin @ Mouser](https://www.mouser.com/ProductDetail/Molex/503480-1000) | $0.42 | $42 |

**Subtotal:** $1.49 / unit · $149 / 100 units

---

### 1.8 Passive Components (Capacitors, Resistors, Inductors)

| Ref | Component | Value / Package | Supplier | Unit Cost | 100× Cost |
|-----|-----------|----------------|----------|-----------|-----------|
| C1–C20 | MLCC Capacitor (assorted 100nF–100µF) | 0402/0603 | LCSC | $0.02 ea | $40 |
| R1–R20 | Thick Film Resistor (assorted 100Ω–100kΩ) | 0402 | LCSC | $0.01 ea | $20 |
| L2–L4 | Power inductor 2.2µH (for TPS63036) | CDRH2D18 | Mouser | $0.35 ea | $105 |
| D1–D4 | Schottky Diode 40V 200mA | SOD-123 | LCSC | $0.05 ea | $20 |
| TVS1 | TVS Diode (USB protection) | PRTR5V0U2X | Mouser | $0.35 | $35 |

**Subtotal (passives):** $2.20 / unit · $220 / 100 units

---

### 1.9 FPC Interconnect Cable

| Ref | Component | Spec | Supplier | Unit Cost | 100× Cost |
|-----|-----------|------|----------|-----------|-----------|
| CBL2 | FPC Ribbon 10-pin 0.5mm, 25mm long | 10P 0.5mm FFC/FPC | LCSC / AliExpress | $0.38 | $38 |

---

## 2. PCB Manufacturing (PCBWay)

| Item | Spec | Supplier | Unit Cost | 100× Cost |
|------|------|----------|-----------|-----------|
| Main PCB (38×38mm, 4-layer, ENIG, black mask) | 100 pcs, 1.0mm | PCBWay | $3.80 | $380 |
| Power PCB (38×38mm, 2-layer, ENIG, black mask) | 100 pcs, 0.8mm | PCBWay | $2.20 | $220 |
| PCB Assembly — Main PCB (SMT) | 100 boards, ~65 components | PCBWay PCBA | $15.00 | $1,500 |
| PCB Assembly — Power PCB (SMT) | 100 boards, ~20 components | PCBWay PCBA | $6.00 | $600 |

**PCBWay PCB Order link:** [https://www.pcbway.com/orderonline.aspx](https://www.pcbway.com/orderonline.aspx)  
**PCBWay PCBA link:** [https://www.pcbway.com/pcb-assembly.html](https://www.pcbway.com/pcb-assembly.html)

**Subtotal:** $27.00 / unit · $2,700 / 100 units

---

## 3. Mechanical / Body (PCBWay CNC)

| Item | Material | Finish | Supplier | Unit Cost | 100× Cost |
|------|----------|--------|----------|-----------|-----------|
| Front Shell (Side B) — CNC stainless | 316L SS | Brushed #4 satin | PCBWay CNC | $12.00 | $1,200 |
| Back Shell (Side A) — CNC stainless | 316L SS | Mirror-polished, electro-polished | PCBWay CNC | $14.00 | $1,400 |
| 4× M1×4 SS Countersunk Screws (per unit) | 316L SS | Passivated | McMaster-Carr | $0.20 | $20 |
| 4× M1.4 Brass Standoffs 3.0mm (per unit) | Brass | Tin-plated | LCSC / McMaster | $0.25 | $25 |
| Buna-N Gasket (custom 38×38mm, 0.5mm) | NBR rubber | N/A | Custom laser cut | $0.60 | $60 |
| Display glass (borosilicate, 30×30×0.3mm) | Borosilicate | Optical clear | Custom | $1.50 | $150 |
| Camera sapphire window (Ø6×0.5mm) | Sapphire | AR-coated | Custom | $1.80 | $180 |
| LED diffuser dot (borosilicate frosted, Ø2mm) | Borosilicate | Frosted | Custom | $0.30 | $30 |
| Thermal gap pad (38×38×0.5mm) | Silicone | N/A | LCSC | $0.40 | $40 |

**PCBWay CNC link:** [https://www.pcbway.com/rapid-prototyping/manufacture/](https://www.pcbway.com/rapid-prototyping/manufacture/)

**Subtotal (mechanical):** $31.05 / unit · $3,105 / 100 units

---

## 4. Wireless Charger (Sold Separately)

| Item | Part | Supplier | Unit Cost | 100× Cost |
|------|------|----------|-----------|-----------|
| Qi Transmitter Module (5W, 10×10cm pad) | WPC1.3 TX | Various / Wurth | $4.20 | $420 |
| USB-C 5V/2A Power Board | PD Trigger + Reg | LCSC | $1.80 | $180 |
| Enclosure (LOT-branded, CNC aluminum) | 6061 Al | PCBWay CNC | $8.00 | $800 |
| USB-C Cable (1m braided) | USB 2.0 | Generic premium | $1.50 | $150 |
| Charger PCB (2-layer, 80×80mm) | FR4 ENIG | PCBWay | $1.20 | $120 |

**Subtotal (charger):** $16.70 / unit · $1,670 / 100 units

---

## 5. Packaging (Per Unit)

| Item | Spec | Supplier | Unit Cost | 100× Cost |
|------|------|----------|-----------|-----------|
| Rigid box (LOT-branded, kraft paper) | 60×60×20mm | Custom print | $1.80 | $180 |
| Foam insert (EVA, cut-to-fit) | 60×60×15mm | Custom | $0.60 | $60 |
| Quick start card (printed, 55×55mm) | 350gsm, matte | Local print | $0.20 | $20 |
| Holographic LOT sticker | 30×30mm | Custom | $0.15 | $15 |

**Subtotal (packaging):** $2.75 / unit · $275 / 100 units

---

## 6. Cost Summary

### 6.1 Per-Unit Cost Breakdown

| Category | Cost per Unit |
|----------|--------------|
| Electronic components | $53.81 |
| PCB manufacturing + assembly | $27.00 |
| Mechanical body (stainless) | $31.05 |
| Packaging | $2.75 |
| **COSMO Computer total** | **$114.61** |
| Wireless charger (optional) | $16.70 |

### 6.2 100-Unit Total

| Category | Total Cost |
|----------|-----------|
| Electronic components (100 units) | $5,381 |
| PCB + PCBA (100 units) | $2,700 |
| Stainless CNC body (100 units) | $3,105 |
| Packaging (100 units) | $275 |
| **COSMO Computer (100 units)** | **$11,461** |
| Wireless charger (100 units, optional) | $1,670 |
| Tooling & setup (one-time) | $800 |
| Engineering & NRE (one-time) | $2,500 |
| **GRAND TOTAL (100 units, full)** | **~$16,431** |

### 6.3 Suggested Retail Pricing

| Item | BOM Cost | Suggested Retail | Margin |
|------|----------|-----------------|--------|
| COSMO Computer | $114.61 | $349 | 67% |
| Wireless Charger | $16.70 | $49 | 66% |
| Bundle (Computer + Charger) | $131.31 | $379 | 65% |

---

## 7. Supplier Contact Details

| Supplier | Contact | Account Type |
|----------|---------|-------------|
| PCBWay | [pcbway.com/quote](https://www.pcbway.com/quote) | Standard (no account required for quote) |
| Mouser Electronics | [mouser.com](https://www.mouser.com) | Standard distribution |
| LCSC Electronics | [lcsc.com](https://www.lcsc.com) | Standard distribution (China) |
| Waveshare | [waveshare.com](https://www.waveshare.com) | Direct |
| Bosch Sensortec | [bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688/](https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688/) | Via Mouser/DigiKey |
| STMicroelectronics | Via Mouser or [st.com](https://www.st.com) | Via distribution |

---

## 8. Long-Lead Items (Order First)

> These items have the longest lead times and should be ordered immediately:

| Item | Lead Time | Action |
|------|-----------|--------|
| Stainless CNC body (PCBWay) | 15–25 days | Order with CAD files |
| BME688 (Bosch) | 8–14 weeks (component shortage risk) | Order immediately |
| LiPo Battery (custom size) | 4–8 weeks | Order immediately |
| OV2640 compact camera modules | 3–5 weeks | Order 120 (20% excess) |
| Custom gasket (laser cut) | 2–3 weeks | Order with DXF |

---

*Document: 02-BILL-OF-MATERIALS.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
