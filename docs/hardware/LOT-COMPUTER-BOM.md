<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — BILL OF MATERIALS / BUYING LIST
================================================================================

DOCUMENT    BOM / LOT-COMPUTER v0.1 (DRAFT)
ISSUE DATE  2026.07.27
PARENT      LOT-COMPUTER-PRODUCT-SPEC.md §02, §04
STYLE       TERMINAL GRID
NOTE        Part numbers below are real, commercially available parts chosen
            for realistic sourcing and costing. Exact SKUs/links must be
            re-verified against live distributor stock before the bring-up
            order — component availability and pricing shift weekly.

================================================================================

## 00  HOW TO READ THIS LIST

Two build targets, per PRODUCT-SPEC §02's honest sizing note:

    V1 PILOT   — 40 x 40 x 9mm shell, off-the-shelf modules, LOW RISK
    V2 TARGET  — 40 x 40 x 5mm shell, bare-die/flex modules, HIGH RISK

This BOM prices V1 PILOT (the buildable one) and flags the V2 substitution
where it differs. Order the V1 pilot first — see ROADMAP §02/§03.

================================================================================

## 01  MANUFACTURING VENDOR

| Item                     | Vendor  | Link                          |
|---------------------------|---------|--------------------------------|
| PCB fab + PCBA (assembly) | PCBWay  | https://www.pcbway.com         |
| CNC stainless shells (x2)  | PCBWay CNC service | https://www.pcbway.com/rapid-prototyping/CNC_Machining.html |
| SMT stencil                | PCBWay  | https://www.pcbway.com         |

PCBWay is specified per brief pt.1 for single-vendor accountability across
electronics + enclosure on the pilot run.

================================================================================

## 02  COMPONENTS

### 02.1  COMPUTE / RADIO — MCU

| Part                          | Role                                  | Source | Link |
|--------------------------------|-----------------------------------------|--------|------|
| Espressif ESP32-S3-WROOM-1     | MCU + WiFi + BLE, camera-capable (DVP) | Espressif / distributors | https://www.espressif.com/en/products/modules |
| Digi-Key / Mouser (distribution) | Distributor for ESP32-S3 + passives | Digi-Key, Mouser | https://www.digikey.com · https://www.mouser.com |

ESP32-S3 chosen over a simpler MCU specifically because it has a native
camera (DVP) interface and enough WiFi + crypto headroom to hold the
device-auth token for the LOT API connector (SOFTWARE-SPEC §02) without a
companion chip. V2 target: ESP32-S3-MINI-1 (smaller footprint, same silicon)
or a chip-scale variant once the 5mm shell is attempted.

### 02.2  BATTERY

| Part                        | Role                          | Source | Link |
|-------------------------------|----------------------------------|--------|------|
| 3.7V LiPo, 100–150mAh, thin (V1) | Power buffer between Qi charge cycles | Adafruit / Digi-Key | https://www.adafruit.com |
| 3.7V thin-film LiPo <60mAh (V2) | Same, sized for 5mm stack        | Specialty cell vendors (TBD at V2 gate) | — |

### 02.3  CAMERA

| Part                     | Role                                  | Source | Link |
|----------------------------|------------------------------------------|--------|------|
| OV2640 camera module (DVP, 2MP) | Ambient capture / future presence sensing | Adafruit, generic DVP-camera modules | https://www.adafruit.com |
| V2: ultra-thin lensless/pinhole camera module | 5mm-stack substitute | TBD, evaluate at V2 gate | — |

### 02.4  DISPLAY

| Part                          | Role                          | Source | Link |
|---------------------------------|----------------------------------|--------|------|
| 0.96"–1.3" round/square OLED, SPI/I2C (SSD1306/GC9A01 class) | Pager-line micro-display | Adafruit, Waveshare | https://www.adafruit.com · https://www.waveshare.com |
| V2: flexible OLED module          | 5mm-stack substitute            | TBD, evaluate at V2 gate | — |

### 02.5  SENSORS — "AI-GRADE OFF-THE-SHELF"

| Part                      | Role                                     | Source | Link |
|-----------------------------|---------------------------------------------|--------|------|
| Bosch BME280                | Temperature + humidity + pressure, I2C     | Adafruit, Digi-Key, Mouser | https://www.adafruit.com · https://www.bosch-sensortec.com |
| (Optional v1.1) Sensirion SGP40 | Air-quality (VOC) index, extends M2M sensor array to match LOT-TERMINAL-M2M.md example | Digi-Key, Mouser | https://www.sensirion.com |

BME280 is chosen specifically because it is the same class of part already
named as the reference sensor payload in `docs/corporate/LOT-TERMINAL-M2M.md`
("Temperature", "Humidity", "Barometric Pressure" fields) — the device ships
speaking the protocol that already exists on paper, no new data shape
required for v1.

### 02.6  WIRELESS CHARGING

| Part                        | Role                              | Source | Link |
|-------------------------------|--------------------------------------|--------|------|
| TI BQ51013B (Qi receiver IC) | Inductive charge receiver, regulates to battery | Digi-Key, Mouser, TI direct | https://www.ti.com/product/BQ51013B |
| Receiver coil (Qi, thin profile) | Paired inductive coil | Digi-Key, Wurth Elektronik | https://www.we-online.com |
| Matching Qi charging puck (stainless-styled, custom shell) | User-facing charger accessory | PCBWay CNC + generic Qi transmitter module | https://www.pcbway.com |

### 02.7  INPUT

| Part                       | Role                          | Source | Link |
|-------------------------------|----------------------------------|--------|------|
| Low-profile tactile switch OR capacitive touch pad (CAP1203-class) | "Copy" button | Digi-Key, Mouser | https://www.digikey.com |

### 02.8  ENCLOSURE

| Part                         | Role                          | Source | Link |
|---------------------------------|----------------------------------|--------|------|
| 316 stainless steel, CNC 2-piece shell, one face mirror-polished | Body (brief pt.3, 17, 18) | PCBWay CNC | https://www.pcbway.com/rapid-prototyping/CNC_Machining.html |
| Silicone gasket, custom-cut       | Dust/splash seal between halves | PCBWay or local gasket supplier | https://www.pcbway.com |
| M1.6 countersunk screws (x4)      | Shell fastening (bring-up only; production = laser weld) | McMaster-Carr | https://www.mcmaster.com |

================================================================================

## 03  UNIT COST — V1 PILOT (SINGLE UNIT, PROTOTYPE PRICING)

```
CATEGORY              PART                              EST. UNIT COST (proto qty)
────────              ────                              ──────────────────────────
Compute/Radio          ESP32-S3-WROOM-1                   $3.50 – $5.00
Battery                 100–150mAh thin LiPo                $2.50 – $4.00
Camera                  OV2640 module                       $4.00 – $7.00
Display                 0.96"–1.3" OLED module               $4.00 – $8.00
Sensors                 BME280 (+ optional SGP40)            $6.00 – $12.00
Wireless charging        BQ51013B + coil                     $3.00 – $5.00
Input                   Button/touch part                    $0.50 – $1.50
PCB fab + PCBA           PCBWay, proto qty                    $15.00 – $25.00
Enclosure (2 shells)      PCBWay CNC stainless, proto qty       $25.00 – $45.00
Gasket + fasteners        misc                                $1.00 – $2.00
────────              ────                              ──────────────────────────
TOTAL (proto, per unit)                                    ≈ $65 – $115
```

Prototype-quantity pricing is intentionally pessimistic — the bring-up batch
(10 units, ROADMAP §02) is expected to land at the top of this range or
above due to PCBWay/CNC minimum-order pricing.

================================================================================

## 04  100-UNIT RUN COSTING (BRIEF PT.13)

```
CATEGORY                 UNIT COST @ 100qty    x100 TOTAL
────────                 ──────────────────    ──────────
Electronics BOM (all)      $18 – $28              $1,800 – $2,800
PCB fab + PCBA               $6 – $10               $600 – $1,000
Enclosure (2 shells, CNC)     $10 – $18               $1,000 – $1,800
Gasket + fasteners            $0.60 – $1.20           $60 – $120
Qi charging puck accessory     $6 – $10                $600 – $1,000
────────                 ──────────────────    ──────────
SUBTOTAL, HARDWARE                                  ≈ $4,060 – $6,720

Firmware flash + QC test jig (one-time tooling)                     $500 – $1,200
Packaging (100 units)                                                $300 – $600
────────                 ──────────────────    ──────────
TOTAL, 100-UNIT RUN                                                ≈ $4,860 – $8,520
PER-UNIT, FULLY LOADED                                               ≈ $49 – $85
```

Component pricing drops meaningfully at 100qty vs. proto qty (roughly
2–3x reduction on the semiconductor line items) — this is the standard
justification for the bring-up → run gate in ROADMAP §03: never place the
100-unit order until the bring-up batch has proven the design, because a
respin at 100qty costs the whole run twice.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF BOM — DRAFT v0.1                                              2026.07.27
================================================================================
