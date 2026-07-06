<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Quantum Tile — Bill of Materials & Sourcing

**Document:** LOT-QUANTUM-TILE-BOM.md
**Classification:** Restricted — S-2 Eyes
**Companion to:** `LOT-QUANTUM-TILE-HARDWARE-PLAN.md`
**Prepared:** July 6, 2026

All costs below are planning-level estimates at qty 100, stated with their basis. Every line needs a live vendor quote before Phase 3 (production) commits — see the parent plan doc §4.3 for the same caveat at the assembly level. Vendor links below are each company's live quoting tool or catalog homepage — get the exact part-number quote directly through them rather than trusting any specific SKU URL to still resolve months later.

---

## 1. Compute, Radio, Camera, Display

| Component | Spec target | Example part class | Vendor / quoting tool | Est. $/unit @100 |
|-----------|-------------|---------------------|------------------------|-------------------|
| MCU + radio | Dual-core, Wi-Fi + BLE, camera (DVP) interface | ESP32-S3 module (e.g. ESP32-S3-WROOM-1) | [Digi-Key](https://www.digikey.com) · [Mouser](https://www.mouser.com) · [LCSC](https://www.lcsc.com) | $3.50–$5.50 |
| Camera | ~2MP DVP module, presence/QR only | OV2640-class module | [Digi-Key](https://www.digikey.com) · [Seeed Studio](https://www.seeedstudio.com) | $2.50–$4.00 |
| Display | ~1.2–1.3" reflective memory LCD, monochrome, ultra-low-power | Sharp Memory LCD class (LS013B7DHxx family) | [Digi-Key](https://www.digikey.com) · [Mouser](https://www.mouser.com) | $8–$14 |
| Display glass window | Chemically strengthened cover glass, custom cut to aperture | Gorilla-Glass-class cover lens | Quote via enclosure CNC shop or a dedicated cover-lens shop | $1.50–$3 |
| Camera window | Sapphire or hardened glass, small aperture | Sapphire optical window | [Edmund Optics](https://www.edmundoptics.com) or CNC shop optics add-on | $1–$2.50 |

## 2. Sensors

| Component | Spec target | Example part class | Vendor / quoting tool | Est. $/unit @100 |
|-----------|-------------|---------------------|------------------------|-------------------|
| Environment sensor | Temp, humidity, pressure, gas/VOC (feeds the same signal class as LOT® Station) | Bosch BME680-class | [Digi-Key](https://www.digikey.com) · [Mouser](https://www.mouser.com) · [Adafruit](https://www.adafruit.com) | $3–$6 (breakout-equivalent bare part) |
| Ambient light (optional, for display auto-contrast) | Simple I2C ALS | Off-the-shelf ALS IC | [Digi-Key](https://www.digikey.com) | $0.40–$0.80 |

## 3. Power

| Component | Spec target | Example part class | Vendor / quoting tool | Est. $/unit @100 |
|-----------|-------------|---------------------|------------------------|-------------------|
| Battery | Thin LiPo pouch cell, ~150–250mAh, sub-2mm where possible | Custom-thin LiPo cell | [DigiKey battery section](https://www.digikey.com) or a dedicated thin-cell manufacturer (quote direct — capacity/thickness tradeoff is the key negotiation) | $2–$4 |
| Qi wireless charging receiver | 5V-class Qi RX coil + PMIC | Qi RX chipset (e.g. Renesas/IDT P9221-class) + matched coil | [Digi-Key](https://www.digikey.com) · [Mouser](https://www.mouser.com) | $2.50–$4.50 |
| Power management (charge/boost/regulation) | Battery charge management IC + buck/boost | Standard PMIC | [Digi-Key](https://www.digikey.com) | $1–$2 |

## 4. Input, PCB, Passives, Enclosure Hardware

| Component | Spec target | Example part class | Vendor / quoting tool | Est. $/unit @100 |
|-----------|-------------|---------------------|------------------------|-------------------|
| Tactile switch | IP-rated membrane push button, laser-etchable cap | Sealed tactile switch | [Digi-Key](https://www.digikey.com) · [Mouser](https://www.mouser.com) | $0.50–$1.20 |
| PCB fabrication + SMT assembly | 2–4 layer (or rigid-flex if pursuing the 5mm v2 target) | Custom board per schematic | [PCBWay](https://www.pcbway.com) | $18–$25 (PCBA subtotal, all above compute/sensor/power parts placed) |
| Fasteners | M1.6 stainless screws, 4 per unit, hidden | Standard fastener | [McMaster-Carr](https://www.mcmaster.com) | $0.20 |
| Gasket / seal | Ring gasket for sealed, portless enclosure | Silicone O-ring, custom ID/OD | Enclosure CNC shop or [McMaster-Carr](https://www.mcmaster.com) | $0.50–$1 |

## 5. Enclosure & Charging Accessory

| Component | Spec target | Vendor / quoting tool | Est. $/unit @100 |
|-----------|-------------|------------------------|-------------------|
| Stainless enclosure, Face A (mirror-polished half) | SUS316L, CNC-milled, Ra < 0.1µm polish pass | [PCBWay CNC](https://www.pcbway.com) · [Xometry](https://www.xometry.com) · [JLCCNC](https://jlccnc.com) · [RapidDirect](https://www.rapiddirect.com) | $20–$32 |
| Stainless enclosure, Face B (satin half, windows + button bore) | SUS316L, CNC-milled, bead-blast satin | Same shops as above | $15–$23 |
| LOT® Charging Puck (accessory) | Qi transmitter base, flat disk, matching finish language | Source Qi TX module from [Digi-Key](https://www.digikey.com)/[Mouser](https://www.mouser.com), housing from same CNC shop as the Tile enclosure | $8–$15 |

---

## 6. Cost Summary (Planning-Level)

| Category | Est. $/unit @ qty 100 |
|----------|-------------------------|
| Compute / radio / camera / display | $17–$30 |
| Sensors | $3.50–$7 |
| Power (battery, Qi RX, PMIC) | $5.50–$10.50 |
| Input / fasteners / seal | $1.20–$2.40 |
| PCBA assembly (PCBWay) | folded into above component totals via their SMT service |
| Enclosure (both halves) | $35–$55 |
| Charging Puck accessory | $8–$15 |
| **Total per unit (device + puck)** | **≈ $70–$120** |

One-time NRE not included above (CNC programming, DFM iteration, fixtures): **$3,000–$6,000**, see parent plan doc §4.3.

---

## 7. Sourcing Notes

- **Single-vendor consolidation:** PCBWay now offers PCB fabrication, SMT assembly, and CNC machining under one account. Get a combined quote from them for PCBA + enclosure before splitting the order across PCBWay (electronics) and a dedicated metal shop (enclosure) — consolidation may reduce logistics overhead even if per-part unit cost is a touch higher.
- **AI-grade off-the-shelf sensors (directive #15):** every sensor and compute part above is a standard, datasheet-published, widely second-sourced component — no custom ASIC, no exclusive-fab silicon. This keeps the 100-unit run financeable and keeps a second-source path open if any single vendor has a lead-time problem.
- **Do not lock BOM until Phase 0 DFM review is back from PCBWay** — the 5mm height goal (parent doc §7) may force part substitutions (bare display panel instead of a modular one, bare camera sensor on flex instead of a boxed module), which changes several lines in this table.

---

*Invented by Vadik Marmeladov. LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024.*
*Made in the USA · brand.lot-systems.com*
