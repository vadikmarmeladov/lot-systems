# LOT COMPUTER — COMPONENT BUYING LIST v1.0
### 100-Unit Pilot Run · COSMO® CIA

```
Document    : Component Buying List
Version     : 1.0
Date        : 2026-06-20
Purpose     : Procurement guide with supplier links, quantities, and estimated pricing
```

---

## HOW TO USE THIS LIST

1. Verify each link is live before ordering
2. Request quotes for 110 units minimum (10% overrun for yield/rework)
3. Source all components **before** placing PCBWay PCBA order
4. Upload final BOM CSV to PCBWay; use this list to cross-check
5. Stainless enclosure (items 20–21) ordered separately from PCB assembly

---

## SECTION A — ACTIVE COMPONENTS

| # | Component | Part # | Qty (100 units) | Supplier | Search Term | Est. Unit $ |
|---|-----------|--------|-----------------|----------|-------------|-------------|
| 1 | **SoC — ESP32-S3-MINI-1-N8R8** | ESP32-S3-MINI-1-N8R8 | 110 | Mouser / DigiKey | ESP32-S3-MINI-1-N8R8 | $3.20 |
| 2 | **OLED Display — SSD1351 1.0"** | SSD1351 128×128 | 110 | Adafruit / Alibaba OEM | SSD1351 1.0 inch 128x128 OLED SPI | $3.50 |
| 3 | **AI Environmental Sensor — BME688** | BME688 | 110 | Mouser / DigiKey | Bosch BME688 | $5.50 |
| 4 | **Camera — OV2640** | OV2640 DVP bare | 110 | AliExpress OEM / Arducam | OV2640 2MP DVP module | $2.80 |
| 5 | **Qi Wireless Charging RX — BQ51050B** | BQ51050B | 110 | Mouser / DigiKey | TI BQ51050B | $2.10 |
| 6 | **Battery Management IC — MCP73831** | MCP73831T-2ACI/OT | 110 | Mouser / DigiKey | MCP73831T-2ACI SOT-23 | $0.60 |
| 7 | **LDO 3.3V — AP2112K** | AP2112K-3.3TRG1 | 110 | Mouser / DigiKey | AP2112K-3.3 SOT-23-5 | $0.25 |
| 8 | **Power Supervisor — TPS3813** | TPS3813K33DBVR | 110 | Mouser / DigiKey | TPS3813K33 SOT-23-5 | $0.40 |
| 9 | **ESD Protection — PRTR5V0U2X** | PRTR5V0U2X | 110 | Mouser / DigiKey | PRTR5V0U2X SOT-363 | $0.20 |

---

## SECTION B — PASSIVE COMPONENTS

| # | Component | Value / Package | Qty | Supplier | Notes | Est. Unit $ |
|---|-----------|----------------|-----|----------|-------|-------------|
| 10 | MLCC Cap | 100nF, 0402, 10V X5R | 2,640 | Mouser / JLCPCB SMT stock | Decoupling | $0.02 |
| 11 | MLCC Cap | 10µF, 0402, 10V X5R | 1,100 | Mouser / JLCPCB SMT stock | Bulk bypass | $0.04 |
| 12 | Resistor | 4.7kΩ, 0402, 1% | 660 | Mouser / JLCPCB SMT stock | I2C pull-ups | $0.01 |
| 13 | Resistor | 10kΩ, 0402, 1% | 110 | Mouser / JLCPCB SMT stock | Button pull-up | $0.01 |
| 14 | Crystal | 40 MHz, NX5032GA | 110 | Mouser / DigiKey | ESP32 clock | $0.30 |
| 15 | Load cap | 10pF, 0402, C0G | 220 | Mouser | Crystal load caps | $0.02 |

---

## SECTION C — CONNECTORS & MECHANICAL

| # | Component | Part / Spec | Qty | Supplier | Notes | Est. Unit $ |
|---|-----------|------------|-----|----------|-------|-------------|
| 16 | **Tactile Button** | TS-1185A-C1T2, 4×4mm SMD | 110 | Mouser / DigiKey | COPY button | $0.15 |
| 17 | **USB-C Connector** | USB4135-GF-A, SMD | 110 | Mouser / DigiKey | Debug/flash only, hidden | $0.55 |
| 18 | **RGB LED** | 0402 SMD RGB common cathode | 110 | JLCPCB SMT / Mouser | Status indicator | $0.08 |
| 19 | **M1.2 × 2mm Screws** | A2 stainless, Phillips | 440 | McMaster-Carr / AliExpress | 4 per unit | $0.05ea |
| 20 | **Foam gasket / light seal** | 0.3mm EVA, 38×38mm die-cut | 110 | Custom die-cut / foam.com | OLED isolation | $0.30 |
| 21 | **Sapphire display lens** | 20×20mm, 0.5mm, AR-coated | 110 | GemTech Optics / AliExpress | Screen window | $2.00 |
| 22 | **Camera lens (M12)** | f/2.0 fixed-focus, 5.5mm OD | 110 | Arducam / AliExpress | OV2640 lens | $1.20 |

---

## SECTION D — BATTERY & POWER

| # | Component | Spec | Qty | Supplier | Notes | Est. Unit $ |
|---|-----------|------|-----|----------|-------|-------------|
| 23 | **LiPo Battery** | 3.7V 200mAh, 38×38×2mm | 110 | GREPOW / LiPol Battery Co. | Thin-form pouch cell | $3.20 |
| 24 | **Qi Receiver Coil** | WCT-15K6050-S1F, 40×40mm | 110 | Würth Elektronik (Mouser) | 15µH flat spiral | $1.80 |
| 25 | **Ferrite Sheet** | 36×36mm × 0.1mm | 110 | Mouser (Würth 3544011X20) | Qi coil backing | $0.40 |
| 26 | **Qi Charger Pad (ship-in)** | 5W Qi, USB-C input | 100 | Anker PowerWave / branded | White, LOT logo | $8.00 |
| 27 | **USB-C Cable (ship-in)** | 0.5m, braided, USB-IF cert | 100 | Anker / brand | Ships with charger | Bundled |

---

## SECTION E — PCB & ASSEMBLY (PCBWAY)

| # | Item | Spec | Qty | Supplier | Link Hint | Est. Cost |
|---|------|------|-----|----------|-----------|-----------|
| 28 | **PCB (prototype)** | 4-layer, 38×38mm, ENIG, 0.8mm | 5 | PCBWay | pcbway.com → Instant Quote | ~$50 |
| 29 | **Stencil (prototype)** | Laser SS, 0.12mm | 1 | PCBWay | Add to PCB order | ~$25 |
| 30 | **PCBA (100 units, turnkey)** | Supply BOM + SMT + AOI | 100 | PCBWay | pcbway.com → PCB Assembly | ~$970 |
| 31 | **PCB (production, 110 units)** | Same spec as prototype | 110 | PCBWay | Bundled in PCBA | Included |

**PCBWay PCBA order checklist:**
- [ ] Gerber files (RS-274X, zipped)
- [ ] Drill file (.DRL)
- [ ] BOM CSV (MPN, value, package, qty, designator)
- [ ] Centroid/Pick-and-place file (CPL, CSV)
- [ ] Assembly notes: all SMD, top side only (except battery connector)
- [ ] Confirm ENIG surface finish
- [ ] Request AOI (Automated Optical Inspection) — included standard

---

## SECTION F — STAINLESS STEEL ENCLOSURE (CNC)

The enclosure is CNC-machined from **316L stainless steel** and is ordered separately from a precision machining supplier. PCBWay also offers CNC machining — use if consolidating.

| # | Item | Spec | Qty | Supplier Option | Est. Unit $ |
|---|------|------|-----|----------------|-------------|
| 32 | **Front half (polished)** | 40×40×2.5mm, 316L SS, electro-polish | 110 | PCBWay CNC / Xometry / RapidDirect | $12.00 |
| 33 | **Rear half (brushed + cutouts)** | 40×40×2.5mm, 316L SS, #4 brush; 3 cutouts (screen, camera, button) | 110 | PCBWay CNC / Xometry / RapidDirect | $14.00 |

**Enclosure order files needed:**
- [ ] STEP file for front half
- [ ] STEP file for rear half
- [ ] 2D drawing PDF with tolerances (screen cutout ±0.05mm, camera ±0.1mm)
- [ ] Surface finish callout on drawing: electro-polish front, #4 brush rear
- [ ] Material cert: 316L SS RoHS compliant

**CNC Suppliers to quote:**
- PCBWay CNC: pcbway.com/rapid-prototyping/cnc-machining
- Xometry: xometry.com
- RapidDirect: rapiddirect.com
- 3ERP: 3erp.com (good for stainless, small volumes)

---

## SECTION G — PACKAGING (PER UNIT, 100 UNITS)

| # | Item | Spec | Qty | Supplier | Est. Unit $ |
|---|------|------|-----|----------|-------------|
| 34 | **Outer box** | 60×60×30mm, rigid, matte black | 100 | Pakible / Arka / local | $2.00 |
| 35 | **EVA foam insert** | Custom die-cut, LOT Computer + charger slots | 100 | Foam Factory | $1.00 |
| 36 | **Insert card** | Quick Start Card, 2-sided print, 55×85mm | 100 | Moo / Vistaprint / local print | $0.30 |
| 37 | **Holographic sticker** | COSMO® CIA logo, 20mm round | 100 | Sticker Mule | $0.20 |

---

## PROCUREMENT SEQUENCE

```
Week 1: Place orders for long-lead items:
  → LiPo batteries (GREPOW, 3–4 week lead)
  → BME688 (may be allocation-constrained, order early)
  → Qi coil + ferrite sheet (Würth via Mouser)
  → Sapphire display lens (custom, 3–4 week lead)

Week 1: Start prototype PCB order (PCBWay, 5 boards):
  → Upload Gerbers + stencil request
  → 5 business day standard lead time

Week 2: Place orders for standard components:
  → ESP32-S3-MINI-1 (Mouser)
  → SSD1351 OLED (confirm stock)
  → OV2640 camera (AliExpress or Arducam)
  → BQ51050B, MCP73831, AP2112K (Mouser)
  → Passives (JLCPCB stock pull or Mouser)

Week 3: Enclosure CNC quotes:
  → Send STEP + drawings to 3 suppliers, get quotes
  → Target: sample pair in Week 4–5

Week 15: Full production order:
  → PCBWay PCBA 100+10 units (upload verified BOM)
  → CNC enclosure 110 units (winning supplier from DVT)
  → Packaging materials (all items Section G)
```

---

## TOTAL ESTIMATED BOM COST — 100 UNITS

| Category            | Per Unit | ×100 Units  |
|---------------------|----------|-------------|
| Active ICs          | $14.85   | $1,485      |
| Passives + connectors | $2.40  | $240        |
| Battery + power     | $13.60   | $1,360      |
| PCB + PCBA          | $9.70    | $970        |
| Enclosure (2 halves)| $26.00   | $2,600      |
| Display lens + cam  | $3.20    | $320        |
| Qi charger pad      | $8.00    | $800        |
| Packaging           | $3.50    | $350        |
| **TOTAL COGS**      | **$81.25** | **$8,125** |

> Note: Overrun units (10%) and NRE costs (prototyping, DVT, CNC samples) add ~$6,000 to the project total. See master spec Section 11 for full cost breakdown.

---

*LOT Systems · lot-systems.com · COSMO® CIA · 2026*
