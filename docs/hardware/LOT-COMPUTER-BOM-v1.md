================================================================================
LOT SYSTEMS CORPORATION / BILL OF MATERIALS
DOCUMENT:   LOT-COMPUTER-BOM-v1
TITLE:      COSMO PAGER™ — Components Buying List (100-Unit Run)
CLASS:      RESTRICTED // S-2 EYES
VERSION:    v1.0.0
DATE:       2026-06-26
CURRENCY:   USD
QTY BASIS:  100 units + 10% overage (110 units ordered where noted)
================================================================================


LEGEND:
  MOUSER  = mouser.com
  DIGIKEY = digikey.com
  LCSC    = lcsc.com
  PCBWAY  = pcbway.com
  ALIBABA = alibaba.com
  MFG     = direct from manufacturer
  UNIT $  = per-unit cost at order quantity
  EXT $   = total extended cost for 100 units (+ overage where noted)


--------------------------------------------------------------------------------
A // MAIN ELECTRONICS
--------------------------------------------------------------------------------

┌──────┬──────────────────────────────────────┬──────────────┬────────┬────────┬──────────┬────────────────────────────────────────────────────────┐
│  #   │ Component                            │ Part Number  │  Qty   │ Unit $ │  Ext $   │ Supplier & Link                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A01  │ ESP32-S3-MINI-1-N8R8 (SoC module)   │ ESP32-S3-    │  110   │ $3.80  │  $418    │ MOUSER: mouser.com/ProductDetail/                      │
│      │ Dual-core LX7 240MHz, 8MB+8MB       │ MINI-1-N8R8  │        │        │          │ 356-ESP32S3MINI1N8R8                                   │
│      │ Wi-Fi + BT5 LE integrated           │              │        │        │          │ Also: lcsc.com/product-detail/C2913202                 │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A02  │ Bosch BME688 (AI env sensor)        │ BME688       │  110   │ $5.20  │  $572    │ MOUSER: mouser.com/ProductDetail/991-BME688            │
│      │ Gas/Temp/Humidity/Pressure + BSEC2  │              │        │        │          │ DIGIKEY: digikey.com search "BME688"                   │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A03  │ Good Display GDEP010WS1             │ GDEP010WS1   │  110   │ $4.20  │  $462    │ MFG DIRECT: good-display.com                           │
│      │ 1.02" E-Paper 128×80 px SPI         │              │        │        │          │ Email: service@e-ink.com.cn for bulk quote              │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A04  │ OV2640 Camera Module M7 lens        │ OV2640-M7    │  110   │ $2.40  │  $264    │ LCSC: lcsc.com (search OV2640 module)                  │
│      │ 2MP DVP, fisheye 160°, 8×8mm PCB   │              │        │        │          │ ALIBABA: search "OV2640 M7 fisheye module"              │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A05  │ BQ51021YRCT Qi Rx IC (TI)          │ BQ51021YRCT  │  110   │ $2.80  │  $308    │ MOUSER: mouser.com/ProductDetail/595-BQ51021YRCT       │
│      │ 5W Qi 1.2.4 wireless charge recv   │              │        │        │          │ DIGIKEY: digikey.com search "BQ51021YRCT"              │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A06  │ Würth WR003A Qi coil 15µH          │ 760308101    │  110   │ $1.40  │  $154    │ MOUSER: mouser.com/ProductDetail/710-760308101         │
│      │ 26×26mm, 0.3mm thin, Qi receiver   │              │        │        │          │                                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A07  │ IP5306 LiPo PMIC + boost (2A)      │ IP5306       │  110   │ $0.55  │   $61    │ LCSC: lcsc.com/product-detail/C85960                  │
│      │ Battery management + 5V USB boost   │              │        │        │          │ ALIBABA: search "IP5306 IC"                            │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A08  │ TP4056 LiPo charger IC             │ TP4056       │  110   │ $0.12  │   $13    │ LCSC: lcsc.com search "TP4056"                         │
│      │ 1A charge, SOT-23-8 or SOT-23-5    │              │        │        │          │                                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A09  │ XC6206P332MR 3.3V LDO 200mA       │ XC6206P332MR │  110   │ $0.08  │    $9    │ LCSC: lcsc.com/product-detail/C5446                   │
│      │ Ultra-low IQ 0.1µA, SOT-23-3       │              │        │        │          │                                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A10  │ WS2812B-2020 RGB LED               │ WS2812B-2020 │  110   │ $0.08  │    $9    │ LCSC: lcsc.com search "WS2812B-2020"                  │
│      │ 2×2mm, addressable, 3.3V compat    │              │        │        │          │                                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A11  │ Panasonic EVQ-PA2A tactile switch  │ EVQ-PA2A     │  110   │ $0.35  │   $39    │ MOUSER: mouser.com/ProductDetail/667-EVQ-PA2A         │
│      │ 4.5×4.5mm SMT, 160gf               │              │        │        │          │ DIGIKEY: digikey.com search "EVQ-PA2A"                 │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A12  │ Abracon ABS07-32.768kHz-T crystal  │ ABS07-32.768 │  110   │ $0.38  │   $42    │ MOUSER: mouser.com search "ABS07-32.768"               │
│      │ RTC crystal for ESP32-S3            │              │        │        │          │                                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A13  │ USBLC6-2SC6Y ESD protection        │ USBLC6-2SC6Y │  220   │ $0.10  │   $22    │ MOUSER / LCSC (search "USBLC6-2SC6Y")                  │
│      │ SOT-363, USB + IO lines             │              │        │        │          │                                                        │
├──────┼──────────────────────────────────────┼──────────────┼────────┼────────┼──────────┼────────────────────────────────────────────────────────┤
│ A14  │ JST PH 1.25mm 2-pin connector      │ SM02B-SRSS   │  110   │ $0.18  │   $20    │ LCSC: lcsc.com search "SM02B-SRSS-TB"                  │
│      │ Battery connector on PCB            │              │        │        │          │                                                        │
│ A15  │ USB Type-C 6-pin SMD receptacle    │ TYPE-C-31-M  │  110   │ $0.22  │   $24    │ LCSC: lcsc.com search "USB-C 6pin SMT"                 │
│      │ Programming port (hidden edge)      │              │        │        │          │                                                        │
└──────┴──────────────────────────────────────┴──────────────┴────────┴────────┴──────────┴────────────────────────────────────────────────────────┘

SUBTOTAL A:   $2,417


--------------------------------------------------------------------------------
B // PASSIVE COMPONENTS (SMD 0402 unless noted)
--------------------------------------------------------------------------------

  B01  Resistors 0402 — 22 values, 200 pcs each         $0.002/ea  $88
       (pull-ups, I2C, UART, LED current limiting)
       LCSC: lcsc.com search "0402 resistor kit"

  B02  Capacitors 0402 ceramic — 10 values, 200 pcs     $0.003/ea  $60
       (decoupling: 100nF, 1µF, 10µF, 22µF; bypass)
       LCSC: lcsc.com search "0402 capacitor MLCC"

  B03  Capacitors 0603 electrolytic — 47µF × 50         $0.08/ea   $40
       (bulk decoupling, PMIC input)
       LCSC: lcsc.com search "47uF 0603 electrolytic"

  B04  Inductors 0402 — 4.7µH × 110, 10µH × 110        $0.05/ea   $11
       (PMIC boost inductor, RF matching)
       LCSC: lcsc.com search "4.7uH 0402 inductor"

  B05  Ferrite bead 0402 — 600Ω@100MHz × 100            $0.01/ea    $1
       (Wi-Fi RF supply filtering)

SUBTOTAL B:   $200


--------------------------------------------------------------------------------
C // MECHANICAL / BODY
--------------------------------------------------------------------------------

  C01  316L Stainless Steel — Back shell (CNC)
       SPEC: 40×40×4mm billets, mirror polish #8 finish
       QTY:  110 units
       UNIT: $12.00–18.00 (MOQ 100, CNC mill + polish)
       EXT:  $1,320–$1,980
       SUPPLIER: Alibaba — search "CNC stainless steel enclosure custom"
         Recommended vendors: Shenzhen Mingde / Dongguan Longway
         Lead time: 15–20 days
         Process: CNC milling → deburr → electrolytic polish → #8 buff

  C02  316L Stainless Steel — Front shell (CNC)
       SPEC: 40×40×2mm billets, brushed satin 180-grit + cutouts
       QTY:  110 units
       UNIT: $9.00–14.00
       EXT:  $990–$1,540
       SUPPLIER: Same as C01 (quote both shells together for discount)

  C03  Custom SS 316L button keycap (CNC)
       SPEC: ⌀4.8mm disc, 1.2mm height, knurled top, M1.0 center boss
       QTY:  110 units
       UNIT: $0.80
       EXT:  $88
       SUPPLIER: Same CNC vendor (add to C01/C02 order)

  C04  M1.0 × 3mm SS countersunk screws
       QTY:  600 (4 screws × 100 units + 200 spare)
       UNIT: $0.04
       EXT:  $24
       SUPPLIER: McMaster-Carr / Alibaba (search "M1.0 stainless screw")

  C05  Silicone perimeter gasket (custom molded or cut)
       SPEC: 38mm inner sq., 40mm outer sq., 0.5mm W × 0.3mm H
       QTY:  200 (100 installed + 100 spare)
       UNIT: $0.45 (cut silicone strip, custom die or laser cut)
       EXT:  $90
       SUPPLIER: Alibaba search "custom silicone O-ring flat gasket"

  C06  Sapphire glass display cover (0.5mm, 22×16mm)
       QTY:  120
       UNIT: $2.20
       EXT:  $264
       SUPPLIER: Alibaba search "sapphire glass custom cut 0.5mm"
                 Alt: tempered Gorilla Glass 0.55mm (cheaper, less scratch resistant)

  C07  Conductive foam gasket sheet (PCB-to-shell GND)
       QTY:  1 sheet (200mm × 200mm, 1mm thick, cut to 38×38mm)
       UNIT: $8.00/sheet
       EXT:  $8 (one sheet covers all 100 units)
       SUPPLIER: Amazon / McMaster-Carr "EMI conductive foam"

  C08  Loctite 222 Threadlocker (5 mL)
       QTY:  2 bottles
       UNIT: $12.00
       EXT:  $24
       SUPPLIER: Amazon / Grainger

  C09  UV adhesive (Norland NOA68) for glass bonding
       QTY:  1 bottle (30 mL)
       UNIT: $22.00
       EXT:  $22
       SUPPLIER: Norland Products / Amazon

SUBTOTAL C:   $2,830–$4,040 (use midpoint: $3,435)


--------------------------------------------------------------------------------
D // BATTERY
--------------------------------------------------------------------------------

  D01  402025 LiPo 150mAh 3.7V (4.0×20×25mm)
       QTY:  120 (100 installed + 20 spare)
       UNIT: $2.10
       EXT:  $252
       SUPPLIER: Alibaba — search "402025 lipo battery 150mah"
         Preferred: EEMB / Renata / Varta equivalent
         Include: UL 2054 cert, UN38.3 test report required for shipping
       ALT:  Adafruit #4237 (similar spec, pre-certified)

  D02  JST PH 1.25mm 2-wire pigtail (battery side)
       QTY:  120
       UNIT: $0.15
       EXT:  $18
       SUPPLIER: LCSC / Alibaba

SUBTOTAL D:   $270


--------------------------------------------------------------------------------
E // PCB MANUFACTURING & ASSEMBLY
--------------------------------------------------------------------------------

  E01  PCB Fabrication — 4-layer, 38×38mm ENIG black mask
       QTY:  110 boards
       SPEC: 1.0mm thick, min 0.1mm trace, blind via, ENIG, black LPI
       COST: ~$150–220 (PCBWay standard service, 5-day)
       LINK: pcbway.com → "Custom PCB" → upload Gerbers
       Lead: 5–8 business days

  E02  PCB Assembly (PCBA) — turnkey SMT
       QTY:  100 units assembled (10 boards as spare bare)
       INCLUDES: Component sourcing (BOM upload) + SMT + AOI + X-ray
       COST: ~$800–1,400 (PCBWay PCBA, 100 units, ~40 SMD parts)
       LINK: pcbway.com → "PCB Assembly"
       Notes:
         - Upload Gerber + BOM + CPL (centroid) files
         - Specify: lead-free SAC305, IPC Class 2, black soldermask
         - Request X-ray on ESP32-S3-MINI-1 module pads
       Lead: 10–15 business days (includes component sourcing)

SUBTOTAL E:   $950–$1,620 (midpoint: $1,285)


--------------------------------------------------------------------------------
F // WIRELESS CHARGER (INCLUDED IN BOX — 1 PER UNIT)
--------------------------------------------------------------------------------

  F01  5W Qi wireless charging pad (USB-C input)
       SPEC: Qi 1.2.4, 5W, USB-C input, 1m cable, flat pad design
             White or black colorway (match box)
       QTY:  100
       UNIT: $4.50–7.00 (Alibaba OEM, white-label)
       EXT:  $450–700
       SUPPLIER: Alibaba — search "5W Qi wireless charger pad USB-C OEM"
         Verified vendor: ask for FCC/CE cert before order
       ALT:  Anker PowerWave Pad (retail, ~$12 each) if OEM timeline tight

SUBTOTAL F:   $575 (midpoint)


--------------------------------------------------------------------------------
G // PACKAGING
--------------------------------------------------------------------------------

  G01  Black rigid card box (90×90×20mm, custom printed)
       QTY:  105 (5 spare)
       UNIT: $1.20 (1-color print, custom die)
       EXT:  $126
       SUPPLIER: Alibaba/Packola — search "rigid box black custom 90x90"
       Lead: 15–20 days (custom print)

  G02  Custom EVA foam tray insert (device-shaped cutout)
       QTY:  105
       UNIT: $0.60
       EXT:  $63
       SUPPLIER: Same packaging vendor or separate foam cutter

  G03  Quick Start folded card (4-panel, 85×55mm folded)
       QTY:  105
       UNIT: $0.25 (digital print, 2-sided)
       EXT:  $26
       SUPPLIER: Printful / local print shop / VistaPrint

  G04  QR setup card (85×55mm, heavy stock)
       QTY:  105
       UNIT: $0.15
       EXT:  $16
       SUPPLIER: Same as G03

SUBTOTAL G:   $231


--------------------------------------------------------------------------------
H // TOOLING & NON-RECURRING ENGINEERING (NRE)
--------------------------------------------------------------------------------

  H01  PCB Design (Gerbers, BOM, CPL) — in-house or contract
       COST: $0 (in-house) or $800–1,500 (contract EE)

  H02  Firmware development — in-house (ESP-IDF + BSEC2)
       COST: $0 (in-house) or $2,000–4,000 contract (1-2 month dev)

  H03  Factory test fixture (pogo-pin bed-of-nails)
       COST: $200–400 (custom 3D print + spring pins)

  H04  Programming jig (6-pin pogo adapter for USB-C UART)
       COST: $80–150

  H05  CNC body tooling setup fee (C01+C02)
       COST: ~$200–400 (one-time fixture fee, amortized into C01/C02 unit price)

  H06  Gasket die cut (C05)
       COST: $50–100 (one-time steel rule die)

  H07  FCC SDoC testing (optional for pilot)
       COST: $1,500–3,000 (accredited lab, needed before retail sale in USA)

SUBTOTAL H (in-house tooling only, no FCC):   $530–$1,050


--------------------------------------------------------------------------------
I // COST SUMMARY — 100-UNIT RUN
--------------------------------------------------------------------------------

  SECTION                           LOW $      HIGH $     MID $
  ─────────────────────────────────────────────────────────────
  A  Core electronics               $2,417     $2,417    $2,417
  B  Passive components             $200       $200       $200
  C  Mechanical body (SS CNC)       $2,830     $4,040    $3,435
  D  Battery                        $270       $270       $270
  E  PCB fab + PCBA                 $950       $1,620    $1,285
  F  Wireless charger (box-in)      $450       $700       $575
  G  Packaging                      $231       $231       $231
  H  Tooling / NRE                  $530       $1,050     $790
  ─────────────────────────────────────────────────────────────
  TOTAL (100 units)                 $7,878    $10,528    $9,203
  ─────────────────────────────────────────────────────────────
  COST PER UNIT                     $78.78    $105.28    $92.03
  ─────────────────────────────────────────────────────────────

  CONTINGENCY (15%):                +$1,181   +$1,579    +$1,380
  ─────────────────────────────────────────────────────────────
  TOTAL WITH CONTINGENCY:           $9,059    $12,107   $10,583
  COST/UNIT WITH CONTINGENCY:       $90.59    $121.07   $105.83


--------------------------------------------------------------------------------
J // SUPPLIER QUICK REFERENCE LINKS
--------------------------------------------------------------------------------

  PCBWay (PCB + PCBA):    https://www.pcbway.com
  Mouser Electronics:     https://www.mouser.com
  Digi-Key:               https://www.digikey.com
  LCSC (passives/ICs):    https://www.lcsc.com
  Alibaba (mechanical):   https://www.alibaba.com
  Good Display (e-paper): https://www.good-display.com
  Bosch Sensortec:        https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688/
  Espressif (ESP32-S3):   https://www.espressif.com/en/products/socs/esp32-s3
  Würth Elektronik:       https://www.we-online.com (coil 760308101)
  EEMB (LiPo battery):    https://www.eemb.com
  Norland NOA68:          https://www.norlandprod.com


--------------------------------------------------------------------------------
K // ORDERING SEQUENCE (TIMELINE)
--------------------------------------------------------------------------------

  WEEK 1-2   PCB design finalized → upload Gerbers to PCBWay
             Quote CNC SS body vendor on Alibaba (get 3 quotes, compare)
             Order ESP32-S3, BME688, display, camera from Mouser/LCSC

  WEEK 3     PCBWay bare boards delivered
             CNC SS bodies ordered (15-20 day lead)
             Battery + packaging ordered

  WEEK 4-5   PCBA submitted to PCBWay (turnkey)
             Firmware development / test fixture build

  WEEK 6     PCBA returned
             CNC bodies arrive
             Assembly begins (PCB into shell, glass bond, gasket)

  WEEK 7     Factory test (100 units × 10-step)
             Packaging + QR setup
             Ship to inventory

  WEEK 8     Delivery complete


================================================================================
END OF DOCUMENT — LOT-COMPUTER-BOM-v1
CLASSIFICATION: RESTRICTED // S-2 EYES
LOT SYSTEMS CORPORATION | brand.lot-systems.com
================================================================================
