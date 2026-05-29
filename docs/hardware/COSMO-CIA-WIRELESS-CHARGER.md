<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Wireless Charger Specification

**Document:** COSMO-CIA-WIRELESS-CHARGER.md
**Version:** 1.0.0
**Prepared:** May 29, 2026
**Standard:** Wireless Power Consortium (WPC) Qi v1.3, 5W

---

## 1. Overview

The COSMO® CIA wireless charging system consists of two matched components:

| Component  | Location           | Function                       |
|-----------|--------------------|---------------------------------|
| RX coil   | Inside CIA device  | Receives wireless power         |
| TX dock   | Separate charging dock | Transmits wireless power   |

The two are magnetically aligned using N52 neodymium magnets, allowing the user to drop the device onto the dock without precise positioning.

---

## 2. Receiver (RX) — Inside CIA Device

### 2.1 RX Coil

| Attribute       | Value                          |
|----------------|--------------------------------|
| Part            | WR202020-4MS5-G                |
| Manufacturer    | Wurth Elektronik               |
| Coil size       | 20 × 20 mm                     |
| Inductance      | 10.4 µH ±20%                  |
| DC resistance   | 1.5 Ω typical                  |
| Operating freq  | 100–205 kHz (Qi standard)     |
| Rated power     | 5 W                            |
| Thickness       | 0.5 mm (flexible, self-adhesive)|
| Placement       | Bottom shell, adhesive-bonded  |

### 2.2 RX Management IC

| Attribute       | Value                           |
|----------------|----------------------------------|
| Part            | TI BQ25895RTWT                  |
| Package         | 24-pin WQFN 4×4 mm              |
| Input voltage   | 3.9–14 V (Qi rectified + USB-C) |
| Input current   | Up to 3.25 A                    |
| Battery output  | 4.2 V (LiPo), 500 mA max (Qi)  |
| Efficiency      | ~90% (typ at 5W Qi)             |
| Features        | USB-C input multiplexing, thermal regulation, I²C status |

### 2.3 RX Integration in PCB

The WR202020 coil is mounted on the bottom of the back stainless steel shell (adhesive layer). Wires route through a 0.8 mm channel to the PCB's Qi RX pads on the bottom copper layer.

The stainless steel back shell does NOT shield the Qi field because the coil is positioned between the PCB and the shell, with the field radiating outward through a 0.2 mm gap (silicone-filled for coupling). Stainless steel reduces coupling efficiency by ~15% vs. standard plastic; compensated by specifying 5W dock vs. 3W.

**Alignment magnets (in device):** 4 × N52 neodymium magnets, 1.5 mm diameter × 1 mm thick, press-fit into 4 corners of the back shell cavity. These align with matching magnets in the dock.

---

## 3. Transmitter (TX) — Charging Dock

### 3.1 Physical Design

```
Top view:
┌──────────────────────────────────────┐
│       40 mm × 40 mm × 8 mm          │
│    ┌─────────────────────────────┐   │
│    │  TX Qi coil (36×36 mm)      │   │
│    │                             │   │
│    │    ● ● ● ● (magnets ×4)     │   │
│    │                             │   │
│    └─────────────────────────────┘   │
│                                      │
│  [USB-C input, one side edge]        │
│  [Status LED, one side edge]         │
└──────────────────────────────────────┘

Side view (8 mm total):
┌─────────────────────────────────────┐
│ SS316 top plate (1 mm)              │
│ TX coil (0.5 mm, adhesive)          │
│ PCB (0.8 mm)                        │
│ Air gap (SS316 standoffs)           │
│ SS316 bottom plate (1 mm)           │
└─────────────────────────────────────┘
```

### 3.2 TX Coil

| Attribute       | Value                          |
|----------------|--------------------------------|
| Coil size       | 36 × 36 mm (larger than RX for alignment tolerance) |
| Inductance      | 22 µH ±20%                    |
| Operating freq  | 100–205 kHz                    |
| Rated power     | 5 W continuous                 |
| Placement       | Adhesive-bonded to top plate underside |

### 3.3 TX IC

| Attribute       | Value                          |
|----------------|--------------------------------|
| Part            | STWBC-EP (STMicroelectronics)  |
| Package         | QFN-32 5×5 mm                  |
| Input           | 5V/2A (USB-C PD)               |
| Output (to coil)| Up to 5W                      |
| Qi version      | WPC 1.3                        |
| Features        | Foreign object detection (FOD), thermal protection, LED driver |
| STWBC-EP datasheet | https://www.st.com/resource/en/datasheet/stwbc-ep.pdf |

### 3.4 Dock PCB Specification

| Attribute         | Value                 |
|------------------|-----------------------|
| Dimensions        | 36 × 36 mm            |
| Layers            | 2                     |
| Thickness         | 0.8 mm                |
| Surface finish    | HASL or ENIG          |
| Components        | STWBC-EP, USB-C, LED, passives |

### 3.5 Status LED

| State                        | LED behavior          |
|-----------------------------|----------------------|
| No device on dock            | Off                  |
| Device placed, charging      | Solid green          |
| Device fully charged         | Dim green (10% duty) |
| Foreign object detected      | Flashing amber       |
| Fault (over-temp, overcurrent)| Solid red           |

LED (green, 0402, 520 nm) driven directly by STWBC-EP LED_OUT pin via 100 Ω resistor.

### 3.6 Magnetic Alignment System

4 × N52 neodymium magnets, 1.5 mm dia × 1 mm thick, press-fit into 4 corners of dock top plate. Mirror positions to the 4 magnets in the CIA device back shell. Alignment force: ~0.8 N per magnet (3.2 N total). This is sufficient to hold the device on the dock while not being strong enough to interfere with device removal or desk placement.

**Magnet layout (top view of dock):**
```
● ─────────── ●
│  36 × 36   │
│   TX coil  │
● ─────────── ●
```

Magnets are positioned outside the Qi coil perimeter to avoid flux interference.

---

## 4. Charging Performance

| Scenario                  | Charge Time | Notes                      |
|--------------------------|-------------|----------------------------|
| 0% → 100%, Qi dock       | ~1.2 h      | Full 5W, 150 mAh battery   |
| 0% → 100%, USB-C 5V/2A   | ~45 min     | BQ25895 fast charge mode   |
| Daily top-up (80% → 100%)| ~15 min     | Typical overnight on dock  |

Charging stops automatically at 4.20 V (±20 mV). BQ25895 maintains charge level with a top-up cycle every ~2 hours when device remains on dock.

---

## 5. Safety & Compliance

| Feature                  | Description                                          |
|-------------------------|------------------------------------------------------|
| Foreign object detection | STWBC-EP stops charging if non-device object placed |
| Overvoltage protection   | BQ25895 OVLO at 6.6 V                               |
| Overcurrent protection   | BQ25895 current limit at 500 mA (Qi mode)           |
| Thermal shutdown         | BQ25895 NTC thermistor on LiPo; stops at 60°C       |
| Short circuit protection | BQ25895 automatic                                   |
| Certifications           | WPC Qi 1.3 compliance (via STWBC-EP certified IC)   |
| Battery cert             | UL 2054 (401428 LiPo cell)                          |

---

## 6. Input Power Requirements

| Attribute          | Value                        |
|-------------------|------------------------------|
| Input connector    | USB-C (dock)                 |
| Input voltage      | 5V DC                        |
| Input current      | 2A max                       |
| Input power        | 10W max                      |
| Adapter (included) | Standard 5V/2A USB-C adapter |

Use only the included cable and a 5V/2A USB-C adapter. Do not use USB-C PD adapters providing >5V without testing — the STWBC-EP input is rated for 5V nominal.

---

## 7. BOM — Charging Dock (per unit)

| Part                    | P/N              | Qty | Price | Total (110u) |
|------------------------|-----------------|-----|-------|-------------|
| STWBC-EP                | STWBC-EP        | 1   | $1.80 | $198        |
| TX Qi coil 36×36        | custom/AliExp.  | 1   | $1.20 | $132        |
| USB-C connector         | USB4135-GF-A    | 1   | $0.45 | $49.50      |
| N52 magnets 1.5mm (×4) | AliExpress      | 4   | $0.08 | $35.20      |
| Green LED 0402          | LCSC            | 1   | $0.05 | $5.50       |
| 100Ω resistor 0402      | LCSC            | 1   | $0.01 | $1.10       |
| Decoupling caps         | LCSC            | 5   | $0.02 | $11         |
| Dock body SS316 CNC     | PCBWay CNC      | 1   | $14.00| $1,540      |
| Dock PCB (2-layer)      | PCBWay          | 1   | $1.50 | $165        |
| USB-C cable 1m          | AliExpress      | 1   | $1.20 | $132        |
| **Total (110 units)**   |                 |     |       | **$2,269.30**|

---

## 8. Assembly Notes

1. STWBC-EP EP pad requires thermal paste + via array — same as PMIC in main board.
2. TX coil is adhesive-bonded to inside of SS316 top plate, centered.
3. 4 magnets press-fit into 1.6 mm dia holes in top plate corners (interference fit, no adhesive needed).
4. Dock PCB screwed to bottom plate via 4 × M1.0 screws (recessed).
5. USB-C port faces one edge; LED visible from same edge.
6. Bottom plate has 4 × 1 mm rubber feet (adhesive, included in packaging).

---

*COSMO® CIA Wireless Charger — Qi 5W, magnetically aligned, stainless steel.*
*© 2026 LOT Systems, Inc. All rights reserved.*
