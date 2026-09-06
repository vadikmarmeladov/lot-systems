# LOT Node — Bill of Materials & Buying List

Prices are budgetary, from public list pricing at typical small-batch (100
unit) quantity breaks as of this session. Links point to supplier
**search/category pages** rather than a single SKU, since exact part
availability and pricing shift — use these to pull current quotes rather than
treating them as locked purchase orders.

## 1. Electronics BOM (per unit)

| # | Part | Function | Qty | Est. unit cost @100pcs | Supplier search |
|---|---|---|---|---|---|
| 1 | ESP32-S3-WROOM-1 module | MCU, Wi-Fi/BLE, camera + display interface | 1 | $3.50 | [Mouser](https://www.mouser.com/c/?q=ESP32-S3-WROOM-1) · [DigiKey](https://www.digikey.com/en/products/result?keywords=ESP32-S3-WROOM-1) |
| 2 | GC9A01 1.3" round IPS LCD, SPI | Display / notification screen | 1 | $4.20 | [DigiKey](https://www.digikey.com/en/products/result?keywords=GC9A01+round+LCD) · [Seeed Studio](https://www.seeedstudio.com/catalogsearch/result/?q=GC9A01) |
| 3 | OV2640 2MP camera module | Camera (presence/QR pairing) | 1 | $3.80 | [DigiKey](https://www.digikey.com/en/products/result?keywords=OV2640) · [Seeed Studio](https://www.seeedstudio.com/catalogsearch/result/?q=OV2640) |
| 4 | Bosch BME280 breakout/bare IC | Weather sensor (temp/humidity/pressure) | 1 | $2.90 | [Mouser](https://www.mouser.com/c/?q=BME280) · [Adafruit](https://www.adafruit.com/?q=BME280) |
| 5 | Qi wireless-charging receiver IC + coil (e.g. P9221-class) | Wireless charging receiver | 1 | $2.60 | [Mouser](https://www.mouser.com/c/?q=Qi+wireless+power+receiver) · [DigiKey](https://www.digikey.com/en/products/result?keywords=qi+wireless+receiver) |
| 6 | LiPo battery, 500mAh 3.7V, flat profile | Power | 1 | $2.20 | [Adafruit](https://www.adafruit.com/?q=500mAh+lipo) · [Mouser](https://www.mouser.com/c/?q=lipo+battery+500mah) |
| 7 | Battery charge/protection PMIC | Power management | 1 | $0.90 | [Mouser](https://www.mouser.com/c/?q=lipo+charge+protection+ic) |
| 8 | Tactile push-button ("Copy") | Input | 1 | $0.30 | [Mouser](https://www.mouser.com/c/?q=tactile+switch) |
| 9 | RGB status LED | Boot/pair/OTA indicator | 1 | $0.15 | [Mouser](https://www.mouser.com/c/?q=rgb+led+0603) |
| 10 | PCB (4-layer, ENIG finish, ~40×40mm) | Carrier board | 1 | $1.20 | [PCBWay](https://www.pcbway.com/) |
| 11 | PCB assembly (SMT, both sides) | Assembly labor | 1 | $6.00 | [PCBWay](https://www.pcbway.com/) (PCBA service) |
| 12 | Passives, connectors, antenna, misc. | Support components | 1 lot | $3.50 | [Mouser](https://www.mouser.com/) BOM upload |
| | **Electronics subtotal** | | | **~$31.25** | |
| | + PCBWay handling/test | | | **~$3** | |
| | **Electronics total / unit** | | | **~$34** | |

## 2. Mechanical / enclosure (per unit, 100-unit run)

| # | Part | Function | Est. unit cost @100pcs | Supplier |
|---|---|---|---|---|
| 1 | CNC-machined SUS304 front plate, bead-blasted | Front housing | $9.00 | [PCBWay CNC service](https://www.pcbway.com/rapid-prototyping.html) |
| 2 | CNC-machined SUS304 rear plate, mirror-polished | Rear housing | $8.00 | [PCBWay CNC service](https://www.pcbway.com/rapid-prototyping.html) |
| 3 | M1.6 security screws (×4) + rubber feet | Assembly hardware | $0.60 | [Mouser](https://www.mouser.com/c/?q=M1.6+security+screw) |
| 4 | Lens window (sapphire/acrylic, camera+display cutout) | Optical windows | $0.80 | [DigiKey](https://www.digikey.com/en/products/result?keywords=sapphire+lens+window) |
| | **Mechanical total / unit** | | **~$18.40** | |

## 3. Accessories (per unit)

| # | Part | Function | Est. unit cost @100pcs | Supplier |
|---|---|---|---|---|
| 1 | Off-the-shelf Qi charging puck (5W) | Charger (brief item 12) | $5.50 | [Mouser](https://www.mouser.com/c/?q=qi+wireless+charger+puck) · [Adafruit](https://www.adafruit.com/?q=qi+charger) |
| 2 | USB-C cable (for the puck) | Charger cable | $0.80 | [Mouser](https://www.mouser.com/c/?q=usb-c+cable) |
| | **Accessory total / unit** | | **~$6.30** | |

## 4. Packaging & documentation (per unit)

| # | Item | Est. unit cost @100pcs |
|---|---|---|
| Retail box (custom, minimal) | $2.00 |
| Printed quick-start card | $0.40 |
| Full PDF manual | digital, $0 marginal (see `manuals/`) |
| **Packaging total / unit** | **~$2.40** |

## 5. Roll-up

| Category | Per unit | × 100 units |
|---|---|---|
| Electronics | $34.00 | $3,400 |
| Mechanical/enclosure | $18.40 | $1,840 |
| Accessories (charger) | $6.30 | $630 |
| Packaging | $2.40 | $240 |
| **Total (excl. tooling, freight, certification)** | **$61.10** | **$6,110** |

One-time, not per-unit:
- CNC fixturing / soft tooling: ~$1,500–2,500 (quote from PCBWay or a CNC
  house before committing)
- PCB stencil + SMT programming: typically included in PCBWay PCBA quote
- Freight (China→US, 100 units, small parcels): ~$150–400 depending on
  method (air vs. sea is irrelevant at this volume; use air/courier)

Get firm quotes from PCBWay (electronics + CNC, both offered on their
platform) before ordering — see `MANUFACTURING-ROADMAP.md`.
