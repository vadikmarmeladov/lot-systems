# COSMO® CIA — Bill of Materials
## Version 1.0 · 100-Unit Production Run

```
DOCUMENT:  01-COSMO-CIA-COMPONENTS-BOM
REVISION:  v1.0
DATE:      2026-05-26
RUN SIZE:  100 units (order 110 for 10% spare)
```

---

## Summary Cost Estimate

| Category | Unit cost (qty 100) | 100-unit subtotal |
|----------|--------------------:|------------------:|
| Main PCB (PCBA, assembled) | $12.50 | $1,375 |
| Stainless steel enclosure (2 shells) | $22.00 | $2,420 |
| Electronic components (see BOM below) | $24.50 | $2,695 |
| Qi wireless charger (optional, separate) | $8.00 | $880 |
| Assembly labour + QA | $6.00 | $660 |
| **Total per unit** | **~$65** | **~$7,150** |

> Prices are estimated based on PCBWay + LCSC bulk quotes, May 2026.
> Add 15% for logistics, import duties, and contingency → **~$8,225 landed cost for 100 units**.

---

## 1. Main Processing

| Ref | Part | Manufacturer | LCSC Part # | Mouser Part # | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|-------------|---------------|----------|-----------------|-------|
| U1 | ESP32-S3-MINI-1-N8 | Espressif | C2913202 | 495-ESP32-S3-MINI-1-N8 | 1 | $3.50 | 8MB flash, 8MB PSRAM, antenna onboard |
| U2 | AP2112K-3.3TRG1 | Diodes Inc. | C51118 | 621-AP2112K-3.3TRG1 | 1 | $0.15 | 3.3V 600mA LDO regulator |
| J1 | USB4085-GF-A | GCT | C2765186 | 640-USB4085-GF-A | 1 | $0.45 | USB-C 2.0 receptacle, programming + charge |

---

## 2. Display

| Ref | Part | Manufacturer | Source | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|--------|----------|-----------------|-------|
| DISP1 | GDEH0154D67 | Good Display | Waveshare / LCSC | 1 | $4.20 | 1.54" e-paper, 200×200 BW, SPI, 24-pin FPC |
| CN1 | FPC-24P-0.5mm | Generic | LCSC C2682567 | 1 | $0.12 | 24-pin 0.5mm pitch FPC connector |

> **Alternative:** 1.3" IPS TFT LCD 240×240 (ST7789V, LCSC C2877936, $2.80) for faster refresh, higher power.
> The e-paper is recommended for ambient/notification use — zero power between updates, premium readability.

---

## 3. Camera

| Ref | Part | Manufacturer | Source | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|--------|----------|-----------------|-------|
| CAM1 | OV2640 module | OmniVision | LCSC / AliExpress bulk | 1 | $2.80 | 2MP, DVP (SCCB), 24×24mm, with lens, 3.3V |
| CN2 | FFC-24P-0.5mm-50mm | Generic | LCSC C2684563 | 1 | $0.08 | 50mm flat flex cable for camera |

> Note: ESP32-S3 has native DVP camera peripheral. Use `esp32-camera` component.
> Camera aperture in Side B shell: ø3.5mm drilled through 316L at top-right corner.

---

## 4. Environmental Sensor (AI Grade)

| Ref | Part | Manufacturer | LCSC Part # | Mouser Part # | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|-------------|---------------|----------|-----------------|-------|
| U3 | BME688 | Bosch Sensortec | C2682739 | 828-BME688 | 1 | $7.55 | Temp/Humidity/Pressure/VOC gas; BSEC2 AI IAQ library |

> The BME688 includes Bosch's BSEC2 software library (free, closed-source) that computes an AI-derived Indoor Air Quality (IAQ) index 0–500. This qualifies as an "AI-grade off-the-shelf sensor."
>
> **Budget alternative:** BME280 (C92489, $2.20) — Temp/Humidity/Pressure only, no gas/IAQ.

---

## 5. Wireless Charging

| Ref | Part | Manufacturer | Source | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|--------|----------|-----------------|-------|
| L1 | WR135-30003 | Würth Elektronik | Mouser 710-760308103 | 1 | $2.80 | 30mm Qi receiver coil, 0.6mm thick, 500mA |
| U4 | STWLC68 | STMicroelectronics | Mouser 511-STWLC68JR | 1 | $2.20 | 5W Qi WPC 1.2.4 RX IC, I2C config, QFN-28 |

> The STWLC68 + WR135-30003 pair implements full WPC 1.2.4 Qi receiving.
> Tx: any standard Qi charger (5W minimum). Custom LOT Qi pad spec in `06-COSMO-CIA-CHARGER.md`.

---

## 6. Battery & Power Management

| Ref | Part | Manufacturer | Source | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|--------|----------|-----------------|-------|
| BAT1 | LP303030 | Generic | LCSC / AliExpress bulk | 1 | $3.20 | 200mAh LiPo, 30×30×3mm, 3.7V, JST-PH 2-pin |
| U5 | BQ21040DBVR | Texas Instruments | Mouser 595-BQ21040DBVR | 1 | $0.95 | 500mA LiPo charger IC, USB-C input, SOT-23-5 |
| U6 | MAX17048G+T | Maxim/Analog Devices | Mouser 700-MAX17048G+T | 1 | $1.60 | LiPo fuel gauge, I2C, 1% accuracy |

---

## 7. Copy Button & LED

| Ref | Part | Manufacturer | LCSC Part # | Qty/unit | Unit price (100) | Notes |
|-----|------|--------------|-------------|----------|-----------------|-------|
| SW1 | TS-1187A-B | XKB | C318937 | 1 | $0.08 | 6mm tactile switch, 160gf actuation, 0.5mm travel |
| LED1 | APL3015SGC | Kingbright | C2290 | 1 | $0.06 | 0402 green LED, charge indicator |
| R1 | 47Ω 0402 | Generic | C105857 | 1 | $0.01 | LED current limiting |

---

## 8. Passive Components (per unit)

| Description | Value | Package | LCSC | Qty | Total |
|-------------|-------|---------|------|-----|-------|
| Ceramic cap (bulk decoupling) | 100nF 10V | 0402 | C1525 | 12 | $0.05 |
| Ceramic cap (BME688 filter) | 100nF 10V | 0402 | C1525 | 2 | $0.01 |
| Electrolytic cap (main rail) | 100µF 10V | 1206 | C2932 | 2 | $0.06 |
| Pull-up resistor (I2C) | 4.7kΩ | 0402 | C25900 | 2 | $0.01 |
| Ferrite bead (power filter) | 600Ω @ 100MHz | 0402 | C1017 | 3 | $0.03 |
| ESD protection (USB) | PRTR5V0U2X | SOT-363 | C261335 | 1 | $0.12 |
| Crystal | 32.768kHz | SMD-3215 | C2992 | 1 | $0.18 |
| **Passives subtotal** | | | | | **~$0.50** |

---

## 9. PCB

| Item | Spec | Qty | Unit price (110 pcs) | Notes |
|------|------|-----|---------------------|-------|
| PCB bare | 4-layer, ENIG, 36×36mm, 1.0mm | 110 | $2.80 | PCBWay standard |
| SMT assembly (PCBWay PCBA) | Double-sided, all SMD components | 110 | $9.70 | Includes stencil + pick-and-place |

---

## 10. Enclosure (CNC Machined, PCBWay)

| Part | Material | Finish | Qty/unit | Unit price (100 sets) |
|------|----------|--------|----------|----------------------|
| Side A shell (polished face) | 316L SS | Mirror polish Ra ≤ 0.1µm | 1 | $11.00 |
| Side B shell (active face) | 316L SS | Satin Ra 0.8µm | 1 | $11.00 |
| M1.6 × 4 screws | 316L SS | Passivated | 4 | $0.15 |
| Silicone gasket (0.3mm) | Shore A 40 silicone | — | 1 | $0.45 |
| **Enclosure subtotal** | | | | **$22.60** |

> CNC quote via PCBWay online form: upload STEP files → select 316L SS → mirror polish option for Side A.
> Typical lead time: 7–12 business days for 100 sets.

---

## 11. Packaging (per unit)

| Item | Spec | Unit price (100) |
|------|------|-----------------|
| Box | Matte black rigid cardboard, 60×60×15mm | $0.80 |
| Foam insert | Custom die-cut EVA foam | $0.40 |
| Quick-start card | 85×54mm, double-sided, 350gsm | $0.20 |
| USB-C cable | 20cm, USB-A to C, black | $1.20 |
| **Packaging subtotal** | | **$2.60** |

---

## 12. Supplier Links

| Supplier | Use | URL |
|----------|-----|-----|
| PCBWay | PCB fabrication + PCBA + CNC enclosure | pcbway.com |
| LCSC Electronics | Most SMD components | lcsc.com |
| Mouser Electronics | TI/Bosch/ST specialty ICs | mouser.com |
| Waveshare | E-paper display modules | waveshare.com |
| AliExpress (bulk) | Camera modules, LiPo batteries | aliexpress.com |

---

## 13. Component Availability Notes

- **BME688**: Verify stock at time of order. Alternative: BME280 + SGP40 for separate gas sensing.
- **STWLC68**: Available direct from Mouser/DigiKey. Lead time ~2 weeks.
- **ESP32-S3-MINI-1-N8**: High availability from multiple distributors. Espressif has strong stock.
- **OV2640**: Abundant supply. Order 120 to allow for camera test rejects.

---

```
COSMO® CIA — Bill of Materials
LOT Systems Corporation | lot-systems.com
Document: 01-COSMO-CIA-COMPONENTS-BOM v1.0
```
