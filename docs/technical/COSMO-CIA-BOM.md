<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO·01 — Bill of Materials
## 100-Unit Production Run

**Document:** COSMO-CIA-BOM.md  
**Revision:** v1.0  
**Date:** 2026-06-10  
**Basis:** 100 units complete (PCB + enclosure + packaging)

---

## Cost Summary

| Category | Unit Cost | 100× Total |
|----------|-----------|-----------|
| Main PCB + SMT | $28.00 | $2,800 |
| Stainless steel enclosure | $45.00 | $4,500 |
| COSMO Pad (Qi charger) | $8.00 | $800 |
| Packaging | $4.50 | $450 |
| **COGS per unit** | **$85.50** | **$8,550** |
| Engineering NRE (one-time) | — | $3,200 |
| FCC/CE testing (est.) | — | $0 (internal 100 units, exempt) |
| **Total program** | — | **$11,750** |

Retail price target: **$149/unit**  
Gross margin at retail: **42.6%**

---

## Section 1 — Main PCB Components

### 1.1 Microcontroller

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| U1 | ESP32-S3-WROOM-1-N8R2 (WiFi+BLE, 8MB Flash, 2MB PSRAM) | ESP32-S3-WROOM-1-N8R2 | Mouser / DigiKey | $4.50 | 100 | $450 |

**Mouser:** https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-WROOM-1-N8R2  
**DigiKey:** https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N8R2/16162655

### 1.2 Display

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| D1 | 1.0" 128×128 Color OLED SPI (SSD1351) | WEO012864D | Wisechip / Waveshare | $7.80 | 100 | $780 |

**Waveshare (AliExpress):** https://www.aliexpress.com/item/1005003533770649.html  
**Waveshare direct:** https://www.waveshare.com/1.5inch-rgb-oled-module.htm  
Note: 1.0" variant from Waveshare catalog. Verify dimensions before ordering.

### 1.3 Camera

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| CAM1 | OV2640 Camera Module, 25×24mm, 24-pin FFC | OV2640-25×24 | UCTRONICS / AliExpress | $3.50 | 110 | $385 |

**UCTRONICS:** https://www.uctronics.com/ov2640-camera-module.html  
**AliExpress:** https://www.aliexpress.com/item/32957416356.html  
Note: Order 110 (10% overage for rejects).

### 1.4 Weather Sensor

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| U4 | Bosch BME280 (Temp / Humidity / Pressure) | BME280 | Mouser | $3.15 | 110 | $347 |

**Mouser:** https://www.mouser.com/ProductDetail/Bosch-Sensortec/BME280  
**DigiKey:** https://www.digikey.com/en/products/detail/bosch-sensortec/BME280/6136306

### 1.5 Power Management

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| U5 | Qi Receiver IC STWBC-EP (STMicro, 5W) | STWBC-EP | Mouser | $2.30 | 110 | $253 |
| U6 | LiPo Charger MCP73831T-2ATI/OT | MCP73831T-2ATI/OT | DigiKey | $0.75 | 110 | $82.50 |
| U7 | Fuel Gauge MAX17048G+T (I2C SOC) | MAX17048G+T | Mouser | $2.10 | 110 | $231 |
| U8 | Buck-Boost PMIC TPS63020DSJR | TPS63020DSJR | Mouser | $3.40 | 110 | $374 |

**STWBC-EP Mouser:** https://www.mouser.com/ProductDetail/STMicroelectronics/STWBC-EP  
**MCP73831 DigiKey:** https://www.digikey.com/en/products/detail/microchip-technology/MCP73831T-2ATI-OT/1232525  
**MAX17048 Mouser:** https://www.mouser.com/ProductDetail/Maxim-Integrated/MAX17048G-T  
**TPS63020 Mouser:** https://www.mouser.com/ProductDetail/Texas-Instruments/TPS63020DSJR

### 1.6 Wireless Charging Coil

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| L1 | Qi Flexible Receive Coil 35×35mm, 5W | WR202020-15M8-G | Würth Elektronik / AliExpress | $1.50 | 110 | $165 |

**Würth Elektronik:** https://www.we-online.com/en/components/products/WR202020-15M8-G  
**AliExpress (verified seller):** https://www.aliexpress.com/item/4000234890123.html

### 1.7 Battery

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| BAT1 | LiPo 400mAh 3.7V 35×28×2.5mm JST-SH 1.0mm | LP402535 | LiPol Battery / Grepow | $3.50 | 110 | $385 |

**Grepow custom:** https://www.grepow.com/custom-lipo-battery.html  
Note: Order custom batch with 35×28mm footprint. Minimum order 100 units matches.

### 1.8 Button

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| SW1 | Alps SKQUCAA010 SMD Tactile 6×6×3.1mm | SKQUCAA010 | Mouser | $0.28 | 110 | $30.80 |

**Mouser:** https://www.mouser.com/ProductDetail/Alps-Alpine/SKQUCAA010

### 1.9 USB Connector

| # | Part | MPN | Supplier | Unit Price | Qty | Ext. |
|---|------|-----|----------|------------|-----|------|
| J1 | USB-C 2.0 Receptacle Mid-mount 0.8mm | USB4135-GF-A | GCT | $0.45 | 110 | $49.50 |

**DigiKey:** https://www.digikey.com/en/products/detail/gct/USB4135-GF-A/9859733

### 1.10 Passive Components (estimating, includes resistors, caps, inductors)

| # | Part | Description | Unit Price | Qty | Ext. |
|---|------|-------------|------------|-----|------|
| R*, C*, L* | Passives assortment | 0402 resistors, capacitors, 0603 inductors | — | 500 pcs total | $18.00 |

---

## Section 2 — Enclosure

### 2.1 CNC Stainless Steel Parts (via PCBWay CNC)

| # | Part | Description | Unit Price | Qty | Ext. |
|---|------|-------------|------------|-----|------|
| ENC-A | Side A shell | 316L SS, mirror-polished, 40×40×4.5mm | $22.00 | 100 | $2,200 |
| ENC-B | Side B shell | 316L SS, #4 brushed, 40×40×4.5mm, apertures machined | $18.00 | 100 | $1,800 |
| SCREWS | M1.2×3mm SS pan head | Assembly screws (4× per unit) | $0.05 | 500 | $25 |
| GASKET | IP53 button gasket | Custom silicone, 8×8mm | $0.30 | 110 | $33 |
| SAPPHIRE | 31×31mm sapphire glass 0.7mm | Display lens | $4.50 | 110 | $495 |

**PCBWay CNC:** https://www.pcbway.com/rapid-prototyping/manufacture/  
Note: Upload STEP files for immediate quote. Mirror polish is premium service.

### 2.2 Magnets (Qi alignment)

| # | Part | Description | Unit Price | Qty | Ext. |
|---|------|-------------|------------|-----|------|
| MAG | N35 disc magnet 3×1mm | Qi pad alignment (4× device + 4× pad) | $0.08 | 900 | $72 |

---

## Section 3 — COSMO Pad (Wireless Charger)

| # | Part | Description | Unit Price | Qty | Ext. |
|---|------|-------------|------------|-----|------|
| PAD-PCB | Qi transmitter PCB | Custom PCB with STWLC33 TX IC, 80mm coil | $4.50 | 100 | $450 |
| PAD-BODY | SS + PC base | 304 SS ring + black PC base, injection molded | $2.50 | 100 | $250 |
| PAD-CABLE | USB-C cable 1.2m | Braided, 9V/1A certified | $0.80 | 100 | $80 |

---

## Section 4 — Packaging

| # | Part | Description | Unit Price | Qty | Ext. |
|---|------|-------------|------------|-----|------|
| BOX | Outer box | 100×100×60mm matte black rigid box, COSMO® embossed | $1.80 | 100 | $180 |
| INSERT | Foam insert | Custom-cut EVA foam, device + pad cutouts | $0.90 | 100 | $90 |
| CARD | Quick-start card | 90×55mm folded, 350gsm coated, 4C print | $0.35 | 100 | $35 |
| SEAL | Tamper seal | COSMO® holographic sticker, 25mm | $0.15 | 100 | $15 |
| TISSUE | Tissue paper | Black, 2 sheets | $0.10 | 100 | $10 |

---

## Section 5 — PCBWay Assembly Order Summary

For the PCBWay SMT assembly order, submit:
1. Gerber files (PCB layers)
2. Drill file (Excellon)
3. BOM.csv (this document → CSV export)
4. CPL.csv (pick-and-place centroid)
5. Assembly notes PDF

**PCBWay SMT Assembly URL:** https://www.pcbway.com/smt-assembly.html

PCBWay will:
- Source 80% of components from their library (reduces cost)
- Request buyer to ship: OV2640 modules, Qi coils, LiPo batteries
- Perform AOI (Automated Optical Inspection) on every board
- Perform functional test if test fixture is provided

---

## Section 6 — BOM CSV Export

```csv
Ref,Value,Package,MPN,Qty,Supplier,Unit Price USD
U1,ESP32-S3-WROOM-1-N8R2,WROOM-1,ESP32-S3-WROOM-1-N8R2,1,Mouser,4.50
U2,SSD1351 OLED 1.0",MODULE,WEO012864D,1,Waveshare,7.80
CAM1,OV2640 Camera,MODULE,OV2640-25x24,1,UCTRONICS,3.50
U4,BME280,LGA-8,BME280,1,Mouser,3.15
U5,STWBC-EP,QFN-28,STWBC-EP,1,Mouser,2.30
U6,MCP73831T,SOT-23-5,MCP73831T-2ATI/OT,1,DigiKey,0.75
U7,MAX17048G+T,SOT-23-5,MAX17048G+T,1,Mouser,2.10
U8,TPS63020,SON-10,TPS63020DSJR,1,Mouser,3.40
L1,Qi Coil 35x35mm,COIL,WR202020-15M8-G,1,Würth,1.50
BAT1,LiPo 400mAh,BATT,LP402535,1,Grepow,3.50
SW1,SKQUCAA010,SMD-6x6,SKQUCAA010,1,Mouser,0.28
J1,USB-C 2.0,MID-MOUNT,USB4135-GF-A,1,DigiKey,0.45
```

---

## Section 7 — Procurement Timeline

| Week | Action | Supplier |
|------|--------|----------|
| W1 | Upload Gerbers to PCBWay, request quote | PCBWay |
| W1 | Order ESP32-S3, BME280, power ICs | Mouser |
| W1 | Order OV2640 modules | UCTRONICS |
| W1 | Order Qi coils | Würth |
| W2 | Upload STEP files for CNC enclosure quote | PCBWay CNC |
| W2 | Order custom LiPo batteries | Grepow (4-week lead) |
| W2 | Confirm sapphire glass supplier | Custom optics supplier |
| W3 | Approve PCBWay PCB quote, release to fab | PCBWay |
| W3 | Release CNC enclosure order | PCBWay CNC |
| W6 | Receive PCBs + SMT assembly | PCBWay → ship to assembly |
| W8 | Receive CNC enclosures | PCBWay CNC → ship |
| W8 | Receive LiPo batteries | Grepow → ship |
| W9 | Final assembly + QC | Internal |

---

*All prices in USD, approximate as of June 2026. Request fresh quotes before
ordering. Prices may vary ±15% based on commodity pricing.*
