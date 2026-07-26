<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Bill of Materials

Status: **planning-stage estimate**. Prototype-quantity links are for EVT
bring-up (Phase 1); production-quantity sourcing (bare ICs/modules bought
through PCBWay's turnkey BOM sourcing, or direct from DigiKey/Mouser at
100-unit tiers) happens in Phase 2–3 and will replace several of these
breakout-board line items with bare components on the custom PCB.

## Core electronics

| Part | Role | Prototype source (EVT) | Production note | Prototype unit cost |
|------|------|------------------------|------------------|----------------------|
| ESP32-S3 (WROOM module, dual-core, WiFi+BLE, camera-capable) | MCU + radio | [DigiKey — ESP32-S3-DEVKITC-1U-N8R8](https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-DEVKITC-1U-N8R8/) · [Mouser — ESP32-S3](https://www.mouser.com/en/ProductDetail/Espressif-Systems/ESP32-S3) | Bare WROOM-1 module reflowed on custom PCB in Phase 2 | ~$8–15 (dev board) / ~$4–6 (bare module, 100-unit tier) |
| OV2640 camera module (2MP) | Camera (brief item 5) | [Seeed XIAO ESP32S3 Sense (module w/ OV2640-class camera)](https://www.digikey.com/en/products/detail/seeed-technology-co-ltd/113991115/) or any ESP32-S3-CAM dev board, e.g. [LilyGO T-Camera S3](https://lilygo.cc/products/t-camera-s3) | Camera ribbon module sourced loose for custom PCB mount | ~$12–17 (dev board incl. MCU) |
| 1.54" round e-ink display, 200×200, SPI | Screen (pager-like notification) | [Waveshare 1.54" e-Paper module](https://www.waveshare.com/1.54inch-e-paper-module.htm) · [DigiKey — Pervasive Displays E2154QS0F1](https://www.digikey.com/en/products/detail/pervasive-displays/E2154QS0F1/20685864) | Same part carries to production; e-ink chosen specifically for near-zero hold power (screen stays lit with notification while MCU sleeps) | ~$15–25 |
| BME280 (temp / humidity / pressure) | Weather sensor (brief item 14) | [Adafruit BME280 STEMMA QT breakout](https://www.adafruit.com/product/2652) | Bare Bosch BME280 IC on custom PCB in Phase 2 | ~$10–14 (breakout) / ~$2–3 (bare IC, volume) |
| Qi wireless charging receiver (coil + rectifier) | On-device charging (brief item 19) | [Adafruit Universal Qi Wireless Receiver](https://www.adafruit.com/product/1901) | Bare receiver IC + custom-wound coil to fit the 40mm footprint | ~$13–15 (breakout) / ~$3–5 (bare, volume) |
| LiPo battery, slim flat cell, 3.7V ~350–500mAh | Power | Generic slim LiPo (e.g. via Adafruit/Amazon industrial listings) — exact cell picked once EVT power budget (`04-FIRMWARE.md`) is measured | Must ship with UN38.3 test report from supplier | ~$5–8 |
| Charge management IC (USB-C in, LiPo out) | Charging control | [TP4056-class module, USB-C variant](https://www.amazon.com/TP4056/s?k=TP4056) for EVT bring-up | Bare MCP73831/TP4056-equivalent IC on custom PCB | ~$1–2 |
| Tactile SMD momentary switch | "Copy" button (brief item 16) | Any 6×6mm or low-profile SMD tactile switch (Mouser/DigiKey generic) | Fitted with a stainless-steel button cap through the CNC body | ~$0.10–0.30 |
| Ambient light sensor (optional) | Auto screen/notification timing | Generic I2C ALS (e.g. VEML7700 breakout) | Stretch item — see sensor grade notes below | ~$5 |

## Charging dock accessory (brief item 12)

| Part | Role | Source | Unit cost |
|------|------|--------|-----------|
| Qi wireless charging transmitter module, 5W | Desk charging dock (sold/bundled separately from the puck) | [Adafruit Universal Qi Wireless Charging Transmitter](https://www.adafruit.com/product/2162) · reference design: [Microchip Qi 5W Transmitter](https://www.microchip.com/en-us/tools-resources/reference-designs/qi-5w-wireless-transmitter-charger) | ~$8–12 |

## Enclosure

| Part | Role | Manufacturing route | Notes |
|------|------|----------------------|-------|
| Stainless steel body, Side A (polished, back) | Brand face + Qi contact | PCBWay CNC, [304 stainless steel](https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/) — 304 chosen over 316 for lower cost at equivalent corrosion resistance for an indoor desk object | Polishing is a post-process finishing step — flag explicitly on the PCBWay quote form, it is not the default CNC finish |
| Stainless steel body, Side B (brushed, front) | Camera/screen/button housing | Same PCBWay CNC service | Brushed finish + precision cutouts for lens, display window, and button through-hole |
| Gasket / O-ring | Light dust/splash resistance between the two halves | Generic silicone gasket, cut to the CNC body's mating groove | Sized once Side A/B CAD is final |
| 4× flush hex screws | Body assembly | Standard M1.6 or M2 stainless, sourced with the CNC order or separately (McMaster-Carr style supplier) | |

## PCB fabrication + assembly

| Service | Role | Link |
|---------|------|------|
| PCB fab (2-layer or rigid-flex) | Custom board for the 40×40mm footprint | [PCBWay PCB fab](https://www.pcbway.com/) |
| SMT assembly (turnkey) | Populate the custom board at 5-unit (DVT) and 100-unit (PVT) quantities | [PCBWay SMT assembly quote](https://www.pcbway.com/quotesmt.aspx) |

## Sensor grade notes (brief item 15)

"AI-grade off-the-shelf" is read here as: **calibrated, documented accuracy,
not hobbyist-tier unclamped sensors** — because whatever the sensor reports
feeds back into the Memory Engine's pattern analysis, and noisy input degrades
that analysis. Concretely:

- **BME280** — Bosch factory-calibrated, ±1.0°C / ±3% RH / ±1 hPa. This is the
  same tier used in weather stations, not the noisier/cheaper DHT11 class.
- **Camera (OV2640)** — fixed-focus 2MP is sufficient; this is a Log-entry
  snapshot, not a vision-analysis pipeline, so no need for a higher grade
  sensor in v1.
- **Ambient light (stretch item)** — VEML7700-class parts give a lux reading
  with a documented response curve, useful for correlating notification
  timing with actual room brightness rather than clock time alone.

## Indicative per-unit cost at 100-unit quantity

**This is a rough planning number, not a quote.** Real numbers depend on the
Phase 2 PCBWay PCB+CNC quotes (`02-ROADMAP.md` Phase 2/3, `06-MANUFACTURING.md`).

| Category | Est. cost/unit at qty 100 |
|----------|---------------------------|
| Electronics (MCU/camera/display/sensors/charging/battery, bare parts + SMT assembly) | ~$35–50 |
| Stainless steel body (2 CNC pieces, one polished) | ~$25–45 (highly dependent on machining complexity and polish finishing) |
| Gasket, screws, misc hardware | ~$1–2 |
| **Total landed cost/unit (pre-packaging, pre-cert, pre-margin)** | **~$60–100** |

Getting this range tight requires the actual PCBWay CAD-file quote (CNC) and
BOM-file quote (SMT) — both are Phase 2 action items, not something to
estimate further from research alone.
