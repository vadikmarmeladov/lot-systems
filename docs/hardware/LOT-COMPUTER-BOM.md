<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Bill of Materials (Pilot Run, 100 units)

**Document:** LOT-COMPUTER-BOM.md
**Companion to:** [`docs/corporate/LOT-COMPUTER-PLAN-v1.md`](../corporate/LOT-COMPUTER-PLAN-v1.md)
**Run size:** 100 units
**Status:** Sourcing candidates — not yet purchase-committed

> Links below point to vendor homepages, catalog/search pages, or a
> single-vendor manufacturing quote page — not to specific invented
> product listings. Confirm exact part revision, MOQ, and current price
> directly on the vendor site before ordering; commodity electronics
> pricing and part availability change week to week.

---

## 1. Manufacturing (single vendor — see Plan §04)

| Item | Spec | Vendor | Link | Est. cost @ 100 units | Notes |
|---|---|---|---|---|---|
| PCB fabrication + SMT assembly (PCBA) | 4-layer rigid, ~30x30mm, ENIG finish | PCBWay | https://www.pcbway.com | ~$8–14 / board | Single vendor for board + metal per Plan §04 |
| CNC machining + polish, Face A (mirror stainless) | 304 stainless, 40x40x2.5mm half-shell | PCBWay (CNC/metal service) | https://www.pcbway.com | ~$12–20 / part | Mirror polish adds a finishing pass — confirm on quote |
| CNC machining, Face B (matte stainless, 3 cutouts) | 304 stainless, 40x40x2.5mm half-shell, screen/camera/button bores | PCBWay (CNC/metal service) | https://www.pcbway.com | ~$10–18 / part | Bead-blast matte finish |
| Charging puck enclosure | ABS or aluminum CNC, small | PCBWay | https://www.pcbway.com | ~$3–6 / part | Houses Qi transmitter (Section 3) |
| RF-transparent antenna window insert | Glass-filled polymer ring, antenna keep-out | PCBWay (or local injection molder) | https://www.pcbway.com | ~$1–3 / part | See Plan §02 RF WINDOW — do not omit |

---

## 2. Main board components

| Item | Candidate part | Vendor / search | Est. cost @ 100 units | Notes |
|---|---|---|---|---|
| MCU (WiFi + BLE, camera interface, low power) | Espressif ESP32-S3-WROOM-1 | DigiKey: https://www.digikey.com/en/products/filter/embedded-processors-controllers/635 · Mouser: https://www.mouser.com/c/semiconductors/embedded-processors-controllers/ | ~$3–5 | Native camera (DVP) interface, hardware crypto for the LOT API connector's TLS |
| Camera module | OV2640 (or OV5640 for higher res) fixed-focus | DigiKey: https://www.digikey.com/en/products/result?keywords=OV2640 · Mouser: https://www.mouser.com/c/?q=OV2640 | ~$3–6 | Off-the-shelf, commodity — see Plan §05 selection principle |
| Display | 1.54" monochrome e-paper (SPI) | DigiKey: https://www.digikey.com/en/products/result?keywords=e-paper+display · Adafruit: https://www.adafruit.com/?q=eink+1.54 | ~$8–14 | Zero standing power for last-shown notification |
| Weather sensor | Bosch BME280 (temp / humidity / pressure, I2C) | DigiKey: https://www.digikey.com/en/products/result?keywords=BME280 · Mouser: https://www.mouser.com/c/?q=BME280 | ~$2–4 | Off-the-shelf breakout-grade part |
| Qi wireless-charge receiver IC + coil | TI BQ51013B or equivalent + matched receiver coil | DigiKey: https://www.digikey.com/en/products/result?keywords=BQ51013B · TI: https://www.ti.com/product/BQ51013B | ~$3–5 | Must fit within 5mm shell height budget — coil selection is height-critical |
| Battery | 3.7V LiPo pouch, ultra-thin (~150–250mAh) | DigiKey: https://www.digikey.com/en/products/result?keywords=lipo+battery+thin · Adafruit: https://www.adafruit.com/?q=lipo | ~$3–6 | Thinnest available cell class — confirm against final internal stack height |
| Tactile button (COPY) | Low-profile SMD tactile switch | DigiKey: https://www.digikey.com/en/products/result?keywords=low+profile+tactile+switch · Mouser: https://www.mouser.com/c/?q=tactile+switch | ~$0.20–0.50 | Laser-etched "COPY" cap, see Plan §02 |
| Antenna | Ceramic chip antenna (2.4GHz WiFi/BLE) | DigiKey: https://www.digikey.com/en/products/filter/antennas/188 | ~$0.50–1.50 | Must sit behind the RF window insert, item 1 |
| Pogo-pin debug/flash header | 5–6 pin spring-loaded test points | DigiKey: https://www.digikey.com/en/products/result?keywords=pogo+pin+connector | ~$1–2 | No physical port — see Firmware doc §Flashing |
| Passives (decoupling caps, resistors, LED, etc.) | Standard 0402/0603 | DigiKey / Mouser (BOM cart export) | ~$1–2 aggregate | Finalized at schematic capture |

**Main board subtotal (parts only), est. @ 100 units:** ~$25–46 / unit

---

## 3. Charging puck (accessory, sold/paired with each unit)

| Item | Candidate part | Vendor | Est. cost @ 100 units | Notes |
|---|---|---|---|---|
| Qi transmitter module | Standard 5W Qi transmitter coil + driver IC | DigiKey: https://www.digikey.com/en/products/result?keywords=qi+wireless+charging+transmitter · Mouser: https://www.mouser.com/c/?q=qi+transmitter | ~$4–7 | Matches Face A charging contact, Plan §02 |
| USB-C power input (puck side only) | USB-C receptacle, power-only | DigiKey: https://www.digikey.com/en/products/filter/usb-dvi-hdmi-connectors/487 | ~$0.50 | The device itself has no port; the puck does |
| Puck enclosure | See Manufacturing, item "Charging puck enclosure" | PCBWay | — | — |

---

## 4. Raw stock reference (if machining direct from bar/sheet rather than PCBWay's own metal stock)

| Item | Vendor | Link |
|---|---|---|
| 304 stainless sheet / bar stock | McMaster-Carr | https://www.mcmaster.com |
| 316 stainless (post-pilot, humidity-exposed option) | McMaster-Carr | https://www.mcmaster.com |

---

## 5. Cost summary (100-unit pilot, rough order of magnitude)

| Category | Est. per unit |
|---|---|
| Manufacturing (PCB + CNC, both shell halves, RF window) | ~$34–61 |
| Main board components | ~$25–46 |
| Charging puck | ~$5–8 |
| **Total est. landed cost / unit (pilot volume, excl. NRE, tooling, freight)** | **~$64–115** |

Pilot-volume pricing at 100 units carries no economies of scale — this
number is a sourcing sanity check, not a retail cost model. NRE
(schematic/layout, CNC fixturing, firmware bring-up labor) and freight
are excluded and tracked separately in
[`docs/hardware/LOT-COMPUTER-ROADMAP.md`](./LOT-COMPUTER-ROADMAP.md).

---

## 6. Open sourcing decisions (resolve before PO)

1. E-paper vs. low-power OLED — e-paper chosen in the Plan for its
   zero-standing-power "last message persists" behavior; confirm refresh
   latency (typically 1–2s) is acceptable for a live "Coffee time!" push.
2. ESP32-S3 variant — confirm PSRAM size needed for camera JPEG buffer
   before locking the exact WROOM module.
3. Qi coil diameter vs. 40x40mm footprint — coil, battery, and MCU/camera
   PCB all compete for the same 5mm z-height; stack-up drawing required
   before ordering the CNC shell halves.
4. 304 vs. 316 stainless for the pilot — 304 default; revisit if early
   field units are expected in high-humidity or coastal environments.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END LOT-COMPUTER-BOM
================================================================================
