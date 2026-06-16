# COSMO® CIA Device — Bill of Materials v1.0

**Document:** Bill of Materials (BOM)  
**Device:** COSMO® CIA v1  
**Date:** 2026-06-16  
**Revision:** 1.0  
**Currency:** USD  
**Quantity basis:** 100 units  

---

## BOM Summary

| Section | Total (100 units) | Per Unit |
|---------|-------------------|----------|
| U1 — Core Electronics | $3,391 | $33.91 |
| U2 — PCB + PCBA | $895 | $8.95 |
| U3 — Enclosure (CNC SS) | $4,960 | $49.60 |
| U4 — Wireless Charger | $1,225 | $12.25 |
| U5 — Packaging | $440 | $4.40 |
| NRE (one-time) | $2,500 | — |
| Tooling (one-time) | $800 | — |
| Shipping + Import | $600 | — |
| QA + Labor | $500 | — |
| **GRAND TOTAL** | **$15,311** | **~$153** |

---

## U1 — Core Electronics (per unit, × 100)

| Ref | Description | Manufacturer | Part Number | Qty | Unit Price | Extended | Supplier |
|-----|-------------|-------------|-------------|-----|------------|----------|----------|
| U1 | MCU — ESP32-S3-MINI-1-N4R2 (4MB Flash, 2MB PSRAM) | Espressif | ESP32-S3-MINI-1-N4R2 | 1 | $2.80 | $280 | LCSC / Mouser |
| U2 | PMIC — BQ25120A (LiPo charger + LDO, QFN-16) | Texas Instruments | BQ25120AYFFR | 1 | $2.10 | $210 | Mouser / DigiKey |
| U3 | Qi RX IC — STWLC33 (5W Qi receiver, WLCSP-15) | STMicroelectronics | STWLC33JR | 1 | $3.40 | $340 | Mouser / STMicro |
| U4 | Weather Sensor — BME680 (Temp/RH/Pressure/VOC, LGA-8L) | Bosch Sensortec | BME680 | 1 | $4.80 | $480 | Mouser / DigiKey |
| U5 | IMU/AI — LSM6DSOX (6-axis + MLC, VLGA-14) | STMicroelectronics | LSM6DSOXTR | 1 | $2.90 | $290 | Mouser / LCSC |
| DSP1 | Display — 1.1" 240×240 TFT IPS (ST7789V driver) | Generic / Waveshare equiv | WS-11-240240 | 1 | $6.50 | $650 | AliExpress / LCSC |
| CAM1 | Camera — OV2640 2MP DVP module | OmniVision | OV2640-MINI | 1 | $4.20 | $420 | LCSC |
| L1 | Qi RX Coil — 30mm, 3µH, flat flex | TDK | WR202630-30F1-G | 1 | $1.80 | $180 | Mouser / TDK |
| BAT1 | LiPo Battery — 240mAh, 3.7V, 30×25×3mm | Generic | LP302530 | 1 | $2.50 | $250 | Battery supplier |
| SW1 | Tactile button — TS1109F, 6mm, 160gf | CUI Devices | TS1109F06026B45LF | 1 | $0.15 | $15 | LCSC |
| SW1-CAP | Button cap — 316L SS, domed, 5.8mm | Custom (PCBWay CNC) | CIA-BTN-CAP-001 | 1 | $0.80 | $80 | PCBWay |
| Y1 | TCXO 40MHz | TXC Corporation | 7M-40.000MAAJ-T | 1 | $0.45 | $45 | Mouser |
| LED1 | RGB LED 0402 | Lite-On | LTST-C191KFKT | 1 | $0.25 | $25 | Mouser |
| NTC1 | NTC thermistor (battery protection) | Murata | NXRT15WF104FA1B | 1 | $0.20 | $20 | Mouser |
| C1–C20 | Decoupling capacitors 0402 (100nF, 10µF, 22µF) | Samsung | Various | 20 | $0.02 | $40 | LCSC |
| R1–R10 | Resistors 0402 (10kΩ, 100kΩ, 4.7kΩ) | Yageo | Various | 10 | $0.01 | $10 | LCSC |
| FB1–FB4 | Ferrite bead 0402 (600Ω@100MHz) | Murata | BLM15AG601SN1D | 4 | $0.05 | $20 | Mouser |
| D1–D3 | ESD protection array | NXP | PRTR5V0U2X | 3 | $0.12 | $36 | Mouser |
| **TOTAL U1** | | | | | | **$3,391** | |

---

## U2 — PCB + PCBA

| # | Item | Specification | Unit Price | 100× Total | Supplier |
|---|------|---------------|------------|------------|----------|
| PCB | 4-layer PCB, 40×40mm | FR4 TG150, 1.0mm, ENIG, black SM, 4/4mil | $0.95 | $95 | PCBWay |
| PCBA | SMT assembly both sides | Lead-free SAC305, AOI, programming | $8.00 | $800 | PCBWay PCBA |
| **TOTAL U2** | | | | **$895** | |

**PCBWay PCB Order URL:** https://www.pcbway.com/orderonline.aspx  
**PCBWay PCBA URL:** https://www.pcbway.com/pcba.html  

---

## U3 — Enclosure (CNC Machining)

| # | Item | Material | Process | Unit Price | 110× Total | Supplier |
|---|------|----------|---------|------------|------------|----------|
| Part A | Back cover — 40×40×2mm | 316L SS | CNC + electropolish + mirror polish | $18.00 | $1,980 | PCBWay CNC |
| Part B | Front housing — 40×40×3mm | 316L SS | CNC + satin brush | $22.00 | $2,420 | PCBWay CNC |
| PEEK-W | PEEK window — 28×28×1mm | PEEK polymer | CNC + polish | $3.50 | $385 | PCBWay CNC |
| GLASS-S | Sapphire glass screen window — 24×24×0.5mm | Sapphire, AR coat | Optical grinding | $4.00 | $440 | Crystran / custom |
| GLASS-C | Camera optical glass — 4mm circle | Optical glass | Die cut | $0.80 | $88 | Custom optical |
| SCREW | M1.2 × 2mm countersunk SS A4 × 8 (8 per unit) | SS A4 | Standard | $0.10 ea | $80 | McMaster / LCSC |
| GASKET | Silicone IP54 gasket | Silicone 50A | Die-cut | $0.60 | $66 | Custom |
| FOAM | 3M VHB 4932 pads | 3M 4932 | Die-cut | $0.30 | $33 | 3M |
| BTN-MAGNETS | Alignment magnets for dock — N35, 2mm dia × 1mm, × 4 | NdFeB | Standard | $0.12 ea | $48 | K&J Magnetics |
| **TOTAL U3** | | | | | **$4,540** | |

*(Extra 10 units of enclosure ordered for prototype/spare = 110 pieces of Parts A & B, 110 of PEEK)*

**PCBWay CNC URL:** https://www.pcbway.com/rapid-prototyping/manufacture/CNC-Machining-Services.html  

---

## U4 — Wireless Charging Dock

| # | Item | Specification | Unit Price | 100× Total | Supplier |
|---|------|---------------|------------|------------|----------|
| TX-IC | Qi TX IC — IP6808 | 5W A11, INJOINIC, QFN-28 | $1.80 | $180 | LCSC / INJOINIC |
| TX-COIL | Qi TX Coil — 40mm flat | 40mm dia, 10µH | $2.20 | $220 | TDK |
| DOCK-PCB | Dock PCB — 45×45mm, 2-layer | FR4, 0.8mm, HASL | $0.40 | $40 | PCBWay |
| DOCK-BODY | Dock enclosure — 45×45×8mm | Al 6061, silver anodize | $6.00 | $600 | PCBWay CNC |
| USB-C | USB-C receptacle (dock input) | GCT USB4135-GF-A | $0.35 | $35 | Mouser / GCT |
| CABLE | USB-C cable 1m, braided | USB-A to USB-C | $1.50 | $150 | Generic |
| **TOTAL U4** | | | | **$1,225** | |

---

## U5 — Packaging

| # | Item | Specification | Unit Price | 100× Total | Supplier |
|---|------|---------------|------------|------------|----------|
| BOX | Rigid box 80×80×30mm, black | Rigid paperboard, matte black | $2.50 | $250 | Packaging supplier |
| FOAM | Custom foam insert — dual cavity | EVA foam, die-cut | $1.20 | $120 | Packaging supplier |
| CARD | Quick start card — printed, 80×40mm | 350gsm, CMYK | $0.40 | $40 | Local print |
| STICKER | COSMO® CIA sticker sheet | Matte vinyl | $0.30 | $30 | Local print |
| **TOTAL U5** | | | | **$440** | |

---

## One-Time / NRE Costs

| Item | Cost | Notes |
|------|------|-------|
| PCB design + layout (KiCad) | $800 | 20h @ $40/h engineering |
| Schematic capture | $200 | 5h |
| Firmware development | $1,200 | 30h @ $40/h |
| Software Connector (LOT backend) | $300 | 8h @ $37.5/h |
| PCBWay prototype run (5× PCB + enclosure) | — | Included in prototype phase BOM |
| Stencil (PCBWay) | $50 | Laser stainless 0.12mm |
| Jigs + fixtures | $750 | Programming jig CIA-JIG-001 |
| **TOTAL NRE** | **$3,300** | |

---

## Supplier Contact / Order Info

| Supplier | Contact | Lead Time (est.) |
|----------|---------|-----------------|
| PCBWay (PCB + PCBA + CNC) | sales@pcbway.com / pcbway.com | 5–15 business days |
| Mouser Electronics | mouser.com | 2–7 days (US stock) |
| LCSC Electronics | lcsc.com | 7–14 days (from China) |
| DigiKey | digikey.com | 1–3 days (US stock) |
| TDK Product Center | product.tdk.com | 2–4 weeks (coils) |
| STMicroelectronics | st.com / Mouser | 2–4 weeks |
| Bosch Sensortec | mouser.com | 1–2 weeks |

---

*Document: BOM-v1.md*  
*Generated: 2026-06-16*  
*© 2026 LOT Systems Corporation / COSMO® CIA*
