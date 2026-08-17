<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Terminal — Bill of Materials & 100-Unit Pilot Run Costing

**Document:** LOT-COSMO-TERMINAL-BOM
**Classification:** RESTRICTED // S-2 EYES
**Companion to:** [LOT-COSMO-TERMINAL-v1.md](./LOT-COSMO-TERMINAL-v1.md)
**Prepared:** 2026-08-17
**S-2:** Vadik Marmeladov

---

## How to read this document

Every line names a supplier and a part class. Where a specific part number
is given, it is a known, currently-shipping commodity module used as the
reference design target — final part selection happens at v0.5 (see
roadmap, Section 11 of the plan document) once the bench prototype (v0.1)
validates fit. Prices are **per-unit at 100-unit quantity**, in USD,
2026-08 estimate — quote-verify before PO. This is a planning BOM, not a
purchase order.

---

## 1. Electronics — PCB fabrication & assembly

| Item | Spec | Supplier | Est. unit cost (Qty 100) | Link |
|---|---|---|---|---|
| PCB fab | 4-layer, ENIG, 40×36mm, 1.2mm | PCBWay | $2.10 | pcbway.com |
| PCB assembly (PCBA) | SMT both sides + hand-placed connectors | PCBWay PCBA service | $8.50 | pcbway.com |
| Stencil (one-time) | Stainless steel, both sides | PCBWay | $18.00 (one-time, not per-unit) | pcbway.com |

**Why PCBWay (requirement #1):** single vendor for board fab and assembly
at 100-unit scale keeps electronics procurement to one PO and one shipment,
and PCBWay's PCBA minimum order quantities fit a 100-unit pilot without
tripping into a higher production tier.

---

## 2. Compute, connectivity, power

| Item | Part class | Reference part | Supplier | Est. unit cost | Link |
|---|---|---|---|---|---|
| MCU/SoC | Wi-Fi + BLE, low-power, camera-capable | ESP32-S3 (module, not bare die) | Espressif / distributed via Digi-Key, Mouser | $3.80 | digikey.com, mouser.com |
| Flash | 8MB SPI flash (on-module, ESP32-S3 variant) | — included in module above | — | — | — |
| Battery | 320mAh Li-Po, single-cell, protected, JST-PH | Generic Li-Po, protected | Digi-Key, Mouser | $2.40 | digikey.com |
| Wireless charge receiver | Qi-class, 5V/1A output coil + rectifier IC | Generic Qi receiver module | Digi-Key, Mouser | $1.90 | digikey.com |
| Battery charge/protect IC | Li-Po charge management | MCP73831-class | Microchip, via Digi-Key/Mouser | $0.45 | digikey.com |
| Voltage regulator | 3.3V LDO | AMS1117-3.3-class | Digi-Key, Mouser, LCSC | $0.15 | lcsc.com |

---

## 3. Sensors (AI-grade, off-the-shelf — requirement #15)

| Item | Part class | Reference part | Supplier | Est. unit cost | Link |
|---|---|---|---|---|---|
| Camera | 2MP, single-frame capture, SPI/DVP | OV2640 module | Digi-Key, Mouser, Adafruit | $6.50 | adafruit.com |
| Weather sensor | Temp/humidity/pressure, I2C | BME280 | Bosch Sensortec, via Digi-Key/Mouser/Adafruit | $4.20 | adafruit.com |
| IMU (tip/orientation, screen wake) | 6-axis accel+gyro, I2C | LSM6DS3-class | Digi-Key, Mouser | $1.85 | digikey.com |
| Ambient light sensor | I2C, screen-wake gating | VEML7700 | Adafruit, Digi-Key | $1.20 | adafruit.com |

---

## 4. Display & input

| Item | Spec | Reference part | Supplier | Est. unit cost | Link |
|---|---|---|---|---|---|
| Screen | 1.28" round IPS/OLED, SPI, 240×240 | GC9A01-class round LCD | Adafruit, Waveshare, AliExpress (prototype qty only) | $5.90 | adafruit.com, waveshare.com |
| Copy button | Tactile switch, IP-rated cap, stainless bezel | Custom-capped tactile switch | Digi-Key (switch) + local machine shop (steel cap) | $0.85 + machining (Section 5) | digikey.com |
| Status LED (pairing only) | Single low-power LED, base-face indicator | Generic 0603 LED | Digi-Key, Mouser, LCSC | $0.05 | lcsc.com |

---

## 5. Enclosure — 2-part stainless steel body

| Item | Spec | Process | Supplier class | Est. unit cost (Qty 100) | Notes |
|---|---|---|---|---|---|
| Part A — Face Plate | 316L stainless, 40×40×5mm, mirror-polished | CNC mill + mechanical polish | CNC machine shop (e.g. Xometry, Protolabs, or a PCBWay-adjacent metal partner — quote separately from PCB order) | $14.00 | No coating — polish IS the finish |
| Part B — Instrument Body | 316L stainless, 40×40×15mm, bead-blasted matte, milled cavities for PCB/battery/coil/camera/screen bore | CNC mill (5-axis for camera/screen bores) + bead blast | Same CNC partner as Part A | $22.00 | Highest single line item in the BOM — driven by 5-axis milling time |
| Fasteners | 4× M2 stainless countersunk | Off-the-shelf | McMaster-Carr | $0.20 | mcmaster.com |
| Wireless charge pad (shared w/ CUBIQ™) | Qi transmitter, flat pad | Off-the-shelf Qi charger PCB + enclosure | Digi-Key, or existing CUBIQ™ pad supplier | $6.00 | Amortized across LOT hardware line, not COSMO® Terminal-exclusive |

**Enclosure note:** stainless CNC at 100-unit quantity is the single
largest cost driver in this BOM (~$36/unit, both parts combined) —
significantly more than the electronics stack. This is the direct cost of
requirement #17/#18's two-finish, two-part design. A future retail run
(v2.0, not scheduled — plan doc Section 11) would need either volume-price
CNC (1,000+ units) or a stamping/deep-draw process to bring this down.

---

## 6. Firmware & software (non-BOM, listed for completeness)

Not a hardware line item, but required before v0.1 bench validation:
firmware flashing station (ESP-IDF toolchain, existing open hardware),
pairing QR generation (server-side, no new hardware). See
[LOT-COSMO-TERMINAL-FIRMWARE.md](./LOT-COSMO-TERMINAL-FIRMWARE.md) and
[LOT-COSMO-TERMINAL-SOFTWARE.md](./LOT-COSMO-TERMINAL-SOFTWARE.md).

---

## 7. Per-unit cost roll-up (Qty 100)

| Category | Est. cost/unit |
|---|---|
| PCB fab + assembly | $10.60 |
| Compute, connectivity, power | $8.70 |
| Sensors | $13.75 |
| Display & input | $6.80 |
| Enclosure (2-part stainless) | $42.20 |
| **Subtotal, parts** | **$82.05** |
| Final assembly + QC labor (est.) | $12.00 |
| **Est. total landed cost/unit** | **~$94** |
| One-time tooling (stencil, fixtures) | $18.00 (amortized: $0.18/unit at 100) |

**100-unit pilot run total: ~$9,400**, plus one-time tooling (~$18) and
shipping/duties (not estimated here — depends on CNC partner location).

This lands inside the $2,500–$5,000/unit COSMO® Hardware retail price
band already named in docs/corporate/LOT_ROBOTICS_COSMO.md's Phase 3
revenue table — the pilot's ~$94 landed cost is a prototype-tier estimate
for a 100-unit run, not a claim about retail margin at scale.

---

## 8. What is deliberately NOT in this BOM

- No video-capable radio or codec (plan doc Section 03 — camera is
  single-frame capture only, hardware-enforced).
- No coating/plating on Part A — the brief specifies "polished stainless
  steel," not chrome or PVD. Adding a coating would be a scope change.
- No speaker/buzzer — the notification language is visual-only
  (plan doc Section 05); this also removes a cost line and an attention-
  competing channel.

---
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-TERMINAL-BOM
