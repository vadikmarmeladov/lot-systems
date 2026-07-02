<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Pager — Bill of Materials & Components Buying List

**Document:** LOT-PAGER-BOM.md
**Classification:** Internal / Procurement
**Prepared:** July 2, 2026
**Research method:** Live web search against distributor/manufacturer sites
(Digi-Key, Mouser, LCSC, Adafruit, Seeed, SOS Electronic, Bosch, PCBWay,
Bulgin, Azoteq) on 2026-07-02. Every link below was returned directly by a
search result — none were guessed or reconstructed from memory. Digi-Key,
Mouser, LCSC, Adafruit, and PCBWay block automated page *fetching* (403), so
most prices are the single-unit or lowest confirmed tier from search
snippets, not a verified qty-100 quote — **flagged per line below.** Get a
live quote for each before locking the 100-unit order (see
`LOT-PAGER-ROADMAP.md` Phase 3).

---

## 01. Core Electronics

| Part | Spec | Price (qty seen) | Source | Verified qty-100? |
|---|---|---|---|---|
| **ESP32-S3-WROOM-1-N8** | WiFi4+BLE5, dual-core, 8MB flash, OTA-capable | ~$3.03 (LCSC tier) | [LCSC](https://www.lcsc.com/product-detail/C2913198.html) · [Digi-Key](https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N8/15200089) | No — get live qty-100 quote |
| Alt: ESP32-C6-WROOM-1-N8 | RISC-V, WiFi6+BLE5.3, 8MB flash | $5.38 (single-unit) | [Digi-Key](https://www.digikey.com/en/products/detail/espressif-systems/ESP32-C6-WROOM-1-N8/17728866) | No |
| Alt: Seeed XIAO ESP32-C6 (dev module) | 21×17.5mm castellated module, good for breadboard/EVT | $5.20 | [Seeed](https://www.seeedstudio.com/Seeed-Studio-XIAO-ESP32C6-p-5884.html) | No |

**Recommendation:** ESP32-S3-WROOM-1-N8 for the production board (widest
ecosystem, OTA tooling maturity); Seeed XIAO ESP32-C6 for the breadboard
stage (Hardware Spec Build Order step 01) — don't wait on a custom PCB to
start firmware bring-up.

---

## 02. Display

| Part | Spec | Price | Source | Verified qty-100? |
|---|---|---|---|---|
| Good Display GDEY0154D67 | 1.54" e-paper, 200×200, SSD1681 driver | $6.88 (single-unit) | [AliExpress](https://www.aliexpress.com/item/1005004027620986.html) | No |
| Waveshare 2.13" e-Paper HAT | 250×122 | €16.90 (single-unit) | [Waveshare](https://www.waveshare.com/2.13inch-e-paper-hat.htm) | No |
| Adafruit 1.5" 128×128 grayscale OLED (SSD1327) | Faster refresh than e-paper, higher idle power | $22.50 | [Adafruit](https://www.adafruit.com/product/4741) | No |

**Recommendation:** prototype both an e-paper option (near-zero hold power,
matches the "shows one line, sleeps" interaction — Firmware doc Section 04)
and the OLED (faster refresh, better felt latency) — the Hardware Spec
(Section 02) explicitly defers this choice to EVT testing.

---

## 03. Camera Module

| Part | Spec | Price | Source | Verified qty-100? |
|---|---|---|---|---|
| Seeed OV2640 Fisheye Camera | 2MP, DVP interface, ESP32-compatible | $7.60 | [Seeed](https://www.seeedstudio.com/OV2640-Fisheye-Camera-p-4048.html) | No |
| Waveshare OV2640 Camera Board | 2MP | from $9.69 | [LCSC](https://lcsc.com/product-detail/sensor-modules_waveshare-ov2640-camera-board_C359962.html) | No |
| Adafruit OV5640 Camera Breakout | 5MP, autofocus (higher-spec option) | $14.95 | [Adafruit](https://www.adafruit.com/product/5838) | No |

**Recommendation:** OV2640-class (2MP) is enough for the "presence snapshot,
not a security camera" use case defined in the Vision doc — no reason to pay
for autofocus/5MP on a device this small.

---

## 04. Environmental / Weather Sensor

| Part | Spec | Price | Source | Verified qty-100? |
|---|---|---|---|---|
| Bosch BME280 | Temp/humidity/pressure only | $4.03 (single-unit) | [Digi-Key](https://www.digikey.com/en/products/detail/bosch-sensortec/BME280/6136306) | No |
| Bosch BME680 | 4-in-1 incl. VOC/gas | from $6.68 | [LCSC](https://www.lcsc.com/product-detail/C125972.html) | No |
| **Bosch BME688** — "AI-grade" | 4-in-1 + Bosch-marketed on-chip AI gas-recognition (BME AI-Studio) | $8.60 (single-unit) | [Digi-Key](https://www.digikey.com/en/products/detail/bosch-sensortec/BME688/13681261) · [Bosch product page](https://www.bosch-sensortec.com/en/products/environmental-sensors/gas-sensors/bme688) · [flyer PDF](https://www.bosch-sensortec.com/media/boschsensortec/downloads/product_flyer/bst-bme688-fl000.pdf) | No |

**This directly satisfies brief item 15** ("AI grade off-the-shelf
sensors") — Bosch's own materials describe the BME688 as combining sensing
with "innovative artificial intelligence (AI) capability," the closest thing
the market sells to an "AI-grade" COTS environmental sensor. Recommended part
for production; BME280 is the fallback if BOM cost needs to drop and the
gas/AQI feature is deprioritized.

---

## 05. Wireless Charging + Battery

| Part | Spec | Price | Source | Verified qty-100? |
|---|---|---|---|---|
| TI BQ51013BRHLT | 5W Qi (WPC v1.1) receiver IC, QFN-20 | $3.50 @ qty1, tiered from $1.24 | [Digi-Key](https://www.digikey.com/en/products/detail/texas-instruments/BQ51013BRHLT/3877679) · [LCSC](https://www.lcsc.com/product-detail/C55663.html) | Partial (LCSC shows tiered pricing) |
| Adafruit Universal Qi Receiver Module | Ready coil+PCB, BQ51013B-based — good for breadboard stage | $14.95 | [Adafruit](https://www.adafruit.com/product/1901) | No |
| **Battery: EEMB LP502030** | 3.7V 250mAh LiPo, 20.5×32×5.3mm | **€5.76 @ 100+ qty — confirmed** | [SOS Electronic](https://www.soselectronic.com/en-us/products/eemb/lp502030-pcm-ld-157315) | **Yes** |
| Alt battery: Adafruit #1317 | 3.7V 150mAh, 19.75×26.02×3.8mm — thinner, fits 5mm core tighter | $5.95 (single-unit) | [Adafruit](https://www.adafruit.com/product/1317) | No |

Note: the 5.3mm-thick LP502030 cell alone nearly consumes the 5mm core
target from the Hardware Spec — if the thinner Adafruit #1317 (3.8mm, 150mAh)
doesn't clear DVT battery-life targets (Firmware doc Section 03: 5-7 days at
~10 notifications/day), the core thickness assumption may need to grow past
5mm rather than the battery capacity shrinking further. Flag for EVT review.

---

## 06. Button

| Part | Spec | Price (qty seen) | Source | Verified qty-100? |
|---|---|---|---|---|
| **C&K PTS810SJS250SMTRLFS** | IP67 tactile switch, SMT, 4.3×3.2×2.5mm | **$0.266 @ qty 100 — confirmed** | [Mouser](https://www.mouser.com/ProductDetail/CK/PTS810SJS250SMTRLFS) | **Yes** |
| Bulgin MPZ019/F | Stainless-steel piezo switch, IP68/IP69K, solid metal button (no bore seal needed) | ~€62.62 (single-unit — premium panel-mount part) | [Bulgin](https://www.bulgin.com/en/products/stainless-steel-flathead-piezo-switch-mpz-series-19mm-diameter-momentary-action-ip68-ip69k-sealed.html) | No — likely cost-prohibitive at this price for a 100-unit consumer BOM |
| Azoteq IQS227B | Capacitive touch IC — button becomes a solid part of the stainless shell, no bore/gasket needed at all | ~$0.125 @ qty 200 | [LCSC](https://www.lcsc.com/product-detail/Touch-Sensors_Azoteq-IQS227B-00000000-CSR_C3827639.html) | Partial (200-qty tier shown) |
| Alt: Grease Bulgin | — |

**Recommendation:** C&K PTS810 tactile switch for EVT/DVT (cheap, proven,
IP67 already meets the Hardware Spec Section 04 target rating) with the
Azoteq IQS227B capacitive path as the production upgrade if metal-over-cap
sensing tests well — it removes a sealed bore entirely, which is a
manufacturing simplification worth the redesign if EVT time allows. The
Bulgin piezo switch is noted for completeness but is priced for
industrial/marine panel-mount use, not a 100-unit consumer product.

---

## 07. PCBWay Services (brief item 1)

| Service | Capability | Link |
|---|---|---|
| PCB Fabrication | Effective MOQ ~5pcs at special pricing; standard turnaround "normally 24 hours," urgent 12h option | [pcbway.com/orderonline.aspx](https://www.pcbway.com/orderonline.aspx) |
| SMT / Turnkey Assembly | Stated MOQ 1pc, full turnkey sourcing (PCBWay buys and places the parts above), pricing "starts from $30," turnaround "usually 3 working days" for small/medium runs | [pcbway.com/pcb-assembly.html](https://www.pcbway.com/pcb-assembly.html) · [quote tool](https://www.pcbway.com/quotesmt.aspx) |
| CNC Machining — Stainless Steel | Supports SS 304/316/316L/201/430, lead time "as fast as 5 days"; polishing/electroplating (needed for the polished back face — Hardware Spec Section 01) requires a direct quote via `3dcnc@pcbway.com` | [pcbway.com — CNC stainless steel](https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/) |

PCBWay covers all three manufacturing needs (PCB, assembly, enclosure) under
one vendor relationship, which matches brief item 1 directly and simplifies
the pilot-run logistics — one shipment path instead of three vendors.

---

## 08. Indicative Unit Cost (Prototype-Tier Pricing — NOT a locked BOM)

```
COMPONENT                    UNIT PRICE (as sourced above, mixed tiers)
─────────                    ──────────────────────────────────────────
ESP32-S3-WROOM-1-N8            $3.03
Display (e-paper, GDEY0154D67) $6.88
Camera (OV2640-class)          $7.60
Env sensor (BME688)            $8.60
Qi receiver IC (BQ51013B)      $1.24 (LCSC low tier)
Battery (LP502030, 100+ qty)   €5.76  (~$6.20)
Button (PTS810, qty 100)       $0.27
PCB fab + SMT assembly         ~$30+ setup, per-unit TBD from live quote
Stainless CNC shell (2-piece)  TBD — requires direct PCBWay quote
─────────                    ──────────────────────────────────────────
ELECTRONICS SUBTOTAL           ≈ $34/unit (components only, prototype
                                pricing, excludes PCB/assembly/enclosure
                                labor and the ~50% of line items still
                                needing a live qty-100 quote)
```

**This is explicitly not a final costed BOM.** It is a defensible starting
point built entirely from real, sourced links, with every unverified price
flagged. The single biggest unknowns before the 100-unit order (Roadmap
Phase 3) are: (1) PCB fab + SMT assembly cost at qty 100, and (2) CNC
stainless enclosure cost at qty 100 with electropolish finish — both require
a direct PCBWay quote, which is the first procurement action in the roadmap.

---

## 09. Procurement Next Steps

1. Request PCBWay quotes for: bare PCB (qty 10 for EVT, qty 100 for pilot),
   turnkey SMT assembly sourcing the parts above, and CNC stainless shell
   (2-piece, one electropolished face) at qty 10 and qty 100.
2. Confirm qty-100 pricing directly with Digi-Key/Mouser/LCSC for every line
   above flagged "No" in the verified-qty-100 column — sales/distribution
   reps typically respond within 1-2 business days for BOM quote requests.
3. Order EVT-quantity parts (5-10 of each) for breadboard + first PCB spin
   before committing to the 100-unit purchase.
