<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Bill of Materials

**Document 2 of 7 · Hardware Documentation Set**

> Links below point to manufacturer homepages and known product-family
> pages so the right part family can be found and sourced. **Verify exact
> SKU, package variant, and current distributor stock before ordering** —
> do not order from a link in this document without confirming the part
> page yourself first.

Unit costs are rough-order-of-magnitude engineering estimates at a
**100-unit** order quantity, not vendor quotes. See Doc 06 for the full
production cost model.

---

## Compute & Connectivity

| Component | Function | Representative Part | Supplier | Est. Cost/Unit @100 |
|-----------|----------|---------------------|----------|---------------------|
| MCU + Wi-Fi/BLE | Main compute, camera interface (DVP), TLS to LOT API, OTA | Espressif ESP32-S3 (WROOM-1 module, 8MB PSRAM variant) | [espressif.com/en/products/socs/esp32-s3](https://www.espressif.com/en/products/socs/esp32-s3) · [digikey.com](https://www.digikey.com/) · [mouser.com](https://www.mouser.com/) · [lcsc.com](https://www.lcsc.com/) | $3.50 |
| Antenna | Wi-Fi/BLE 2.4GHz | PCB trace antenna, built into ESP32-S3-WROOM module | — (no separate part) | $0.00 |
| Flash/PSRAM | Firmware + camera frame buffer | Included on WROOM-1 module (8MB PSRAM / 8–16MB flash) | (above) | (included above) |

## Camera & Sensing

| Component | Function | Representative Part | Supplier | Est. Cost/Unit @100 |
|-----------|----------|---------------------|----------|---------------------|
| Camera module (v1/Alpha) | 2MP ambient camera, JPEG-capable, standard ESP32 camera pairing | OmniVision OV2640 module | [ovt.com](https://www.ovt.com/) · [digikey.com](https://www.digikey.com/) · [lcsc.com](https://www.lcsc.com/) | $4.00 |
| Camera module (miniaturization target, v2) | Path to fitting inside the 5mm target height (see Doc 03) | OmniVision OVM6948 (ultra-miniature, medical-scope-grade sensor module) | [ovt.com](https://www.ovt.com/) | TBD — quote direct |
| Environmental/weather sensor | Temperature, humidity, pressure, VOC/gas — same class of sensor as LOT® Station | Bosch Sensortec BME680 | [bosch-sensortec.com](https://www.bosch-sensortec.com/) | $3.20 |
| Camera privacy indicator | Hardware-wired LED on camera power rail (not software-controlled — see Doc 06) | Standard 0603 LED, any color-safe supplier | [digikey.com](https://www.digikey.com/) · [mouser.com](https://www.mouser.com/) | $0.05 |

## Display & Input

| Component | Function | Representative Part | Supplier | Est. Cost/Unit @100 |
|-----------|----------|---------------------|----------|---------------------|
| Display | Single-line pager-style notification rendering | 1" square OLED, 128×128, SSD1327 driver | [adafruit.com](https://www.adafruit.com/) · [waveshare.com](https://www.waveshare.com/) | $6.50 |
| Copy button | Physical tactile input, wired to `/api/logs` write (Doc 05) | Panasonic EVQ-series or C&K tactile switch, IP54-rated cap | [digikey.com](https://www.digikey.com/) · [mouser.com](https://www.mouser.com/) | $0.60 |

## Power & Charging

| Component | Function | Representative Part | Supplier | Est. Cost/Unit @100 |
|-----------|----------|---------------------|----------|---------------------|
| Battery (Alpha, thicker enclosure) | Primary power, standby + active use | 3.7V LiPo, 250–400mAh thin-profile pouch cell | [adafruit.com](https://www.adafruit.com/) | $3.00 |
| Battery (5mm target, v2) | Fits ultra-thin final form factor | Thin-film lithium cell (e.g. Ultralife/Blue Spark class, ~0.5mm) + small buffer supercap | Direct manufacturer quote | TBD |
| Qi receiver IC | Wireless charging | Texas Instruments BQ51013B | [ti.com/product/BQ51013B](https://www.ti.com/product/BQ51013B) | $1.80 |
| Qi receiver coil | Inductive power pickup | Würth Elektronik WE-WPCC series thin coil | [we-online.com](https://www.we-online.com/) | $1.50 |
| Charge/power management IC | Battery charge control, load switching, brownout protection | TI BQ25XXX-series or equivalent | [ti.com](https://www.ti.com/) | $1.20 |

## Mechanical / Enclosure

| Component | Function | Representative Part | Supplier | Est. Cost/Unit @100 |
|-----------|----------|---------------------|----------|---------------------|
| Enclosure, top shell | Camera + display + button face | 316L stainless steel, CNC-machined, bead-blast finish | [pcbway.com](https://www.pcbway.com/) (CNC Machining service) · [xometry.com](https://www.xometry.com/) · [protolabs.com](https://www.protolabs.com/) | $9.00 |
| Enclosure, bottom shell | Polished charging face | 316L stainless steel, CNC-machined, mirror/electropolish finish | (same as above) | $9.50 |
| Charging window insert | Non-conductive window so Qi flux passes through the bottom face (see Doc 03) | Machined ceramic or sapphire crystal insert, press-fit | [pcbway.com](https://www.pcbway.com/) · specialty crystal supplier (direct quote) | $2.50 |
| Seal gasket | IP-rating seal between shells | Silicone O-ring, custom diameter | [mcmaster.com](https://www.mcmaster.com/) | $0.30 |
| Fasteners (if not adhesive/press-fit) | Shell assembly | M1.2 stainless steel screws, 4× per unit | [mcmaster.com](https://www.mcmaster.com/) | $0.20 |

## PCB Fabrication & Assembly

| Component | Function | Representative Part | Supplier | Est. Cost/Unit @100 |
|-----------|----------|---------------------|----------|---------------------|
| PCB fabrication | Custom flex-rigid or rigid PCB sized to 40×40mm footprint | 4-layer, ENIG finish | [pcbway.com](https://www.pcbway.com/) | $1.80 |
| SMT assembly | Populate all SMD components | PCBWay turnkey assembly service | [pcbway.com](https://www.pcbway.com/) | $4.50 |

---

## Cost Rollup (100-unit run, Alpha-spec electronics, prior to NRE)

| Category | Subtotal/Unit |
|----------|---------------|
| Compute & Connectivity | $3.50 |
| Camera & Sensing | $7.25 |
| Display & Input | $7.10 |
| Power & Charging | $7.50 |
| Mechanical / Enclosure | $21.50 |
| PCB Fab & Assembly | $6.30 |
| **BOM total (before NRE, packaging, labor overhead)** | **~$53.15/unit** |

This is a components-only estimate. Non-recurring engineering (tooling,
certification, DFM iterations) and final assembly/packaging labor are
covered in [`06-MANUFACTURING-AND-COMPLIANCE.md`](./06-MANUFACTURING-AND-COMPLIANCE.md).

---

*Previous: [`01-PRODUCT-PLAN-AND-ROADMAP.md`](./01-PRODUCT-PLAN-AND-ROADMAP.md) · Next: [`03-MECHANICAL-DESIGN.md`](./03-MECHANICAL-DESIGN.md)*
