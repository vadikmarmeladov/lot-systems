<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® SLATE — Bill of Materials (v1, 100-unit pilot)

Companion doc to `docs/corporate/COSMO-SLATE-v1.md`. Read that document first
for the device concept, the physical-form engineering note (Section 02), and
why each part below was chosen.

**Status:** Planning estimate. No parts ordered, no RFQ sent yet. Prices are
2026 street-range estimates from part class and typical small-batch pricing,
not live quotes — get real quotes from PCBWay and a distributor before
committing spend. Every "link" below is a **vendor search link** (search by
the part number given), not a pinned product-detail page — exact catalog
URLs shift and a stale deep link is worse than a working search.

---

## 1. Compute + connectivity

| Qty/unit | Part | Why | Est. unit cost (100pc) | Source |
|---|---|---|---|---|
| 1 | ESP32-S3-WROOM-1-N16R8 module | Dual-core MCU, Wi-Fi+BLE, JPEG-capable camera interface — the "hardware computer" per COSMO-SLATE-v1.md Section 03 | $3.50–$4.50 | [Espressif product page](https://www.espressif.com/en/products/modules/esp32-s3) · [LCSC search](https://www.lcsc.com/search?q=ESP32-S3-WROOM-1-N16R8) |
| 1 | 16MB flash + 8MB PSRAM | Included in -N16R8 module variant above | — | — |

## 2. Sensing

| Qty/unit | Part | Why | Est. unit cost (100pc) | Source |
|---|---|---|---|---|
| 1 | OV2640 2MP camera module (fixed-focus, FPC ribbon) | Presence/ambient-light signal, item 6/18 of brief; ~1.5mm module depth | $2.00–$3.50 | [DigiKey search](https://www.digikey.com/en/products/result?keywords=OV2640) · [LCSC search](https://www.lcsc.com/search?q=OV2640) |
| 1 | Bosch BME280 (temp/humidity/pressure), breakout or bare die | Weather sensor, item 14/15 — same 3 metrics already specified in `docs/corporate/LOT-TERMINAL-M2M.md`'s weather-station example | $2.50–$4.00 | [Bosch Sensortec product page](https://www.bosch-sensortec.com/products/environmental-sensors/humidity-sensors-bme280/) · [DigiKey search](https://www.digikey.com/en/products/result?keywords=BME280) |

## 3. Display + input

| Qty/unit | Part | Why | Est. unit cost (100pc) | Source |
|---|---|---|---|---|
| 1 | GC9A01 1.28" round IPS LCD, 240×240, SPI | Single-line message display, matches CUBIQ's round-indicator brand language | $4.00–$6.00 | [LCSC search](https://www.lcsc.com/search?q=GC9A01) · [DigiKey search](https://www.digikey.com/en/products/result?keywords=GC9A01) |
| 1 | Tactile momentary switch, sealed/IP-rated | The single COPY button, item 16 | $0.30–$0.60 | [DigiKey search](https://www.digikey.com/en/products/result?keywords=sealed+tactile+switch) |

## 4. Power

| Qty/unit | Part | Why | Est. unit cost (100pc) | Source |
|---|---|---|---|---|
| 1 | 250mAh LiPo pouch cell | 4–5 day runtime target at 6–10 messages/day | $2.00–$3.50 | [DigiKey search](https://www.digikey.com/en/products/result?keywords=250mAh+lipo) |
| 1 | Qi wireless receiver IC + coil (e.g. BQ51013B class) | Wireless charging, item 19 — shares charging-puck design with LOT CUBIQ | $2.50–$4.00 | [DigiKey search](https://www.digikey.com/en/products/result?keywords=BQ51013B) |
| 1 | LiPo charge/protection IC | Battery safety, required alongside the Qi receiver | $0.50–$1.00 | [DigiKey search](https://www.digikey.com/en/products/result?keywords=lipo+charge+protection+ic) |

## 5. PCB + assembly (PCBWay, item 1)

| Item | Spec | Est. cost @ 100 units | Source |
|---|---|---|---|
| Main board fab | 2-layer, ~30×30mm rigid FR4, ENIG finish | ~$150–$250 total (100 boards) | [PCBWay PCB fabrication](https://www.pcbway.com/) |
| PCB assembly (PCBA) | SMT placement of all parts above, 100 units | ~$500–$900 total, part-cost dependent | [PCBWay PCB assembly](https://www.pcbway.com/pcb_assembly.html) |

## 6. Enclosure (PCBWay CNC, items 3/4/17/18)

| Item | Spec | Est. cost @ 100 units | Source |
|---|---|---|---|
| Face A — polished plate | 304 stainless steel, 40×40×5mm, CNC + mirror polish | ~$8–$14/unit | [PCBWay CNC machining](https://www.pcbway.com/rapid-prototype/) |
| Face B — working face housing | 304 stainless steel, CNC-pocketed for display/camera/button cutouts | ~$10–$18/unit | same, single PO with Face A |
| Fasteners/gasket (seam, item 3's 2-piece body) | M1.6 screws or structural adhesive + silicone gasket | ~$0.50–$1.00/unit | distributor of choice, see MANUFACTURING.md Section 03 for the trade-off |

## 7. Misc

| Item | Spec | Est. cost @ 100 units | Notes |
|---|---|---|---|
| Qi charging puck (shared design with CUBIQ) | Flat inductive charging base | ~$6–$10/unit if not already tooled from the CUBIQ line | Reuse CUBIQ's charging puck design per COSMO-SLATE-v1.md Section 02 rather than tooling a second SKU |
| Retail box + printed quick-start card | Small unboxing kit | ~$1.50–$2.50/unit | Full manual ships as PDF (item 7), not printed, to keep box cost down |

---

## Per-unit cost roll-up (100-unit run, estimate only)

```
Compute + connectivity     $3.50 – $4.50
Sensing (camera + weather) $4.50 – $7.50
Display + input            $4.30 – $6.60
Power                       $5.00 – $8.50
PCB fab + assembly          $6.50 – $11.50   ($650–$1150 / 100)
Enclosure (2-piece steel)  $18.50 – $33.00
Charging puck               $6.00 – $10.00
Packaging                   $1.50 – $2.50
──────────────────────────────────────────
EST. UNIT COST (parts+build) $49.80 – $84.10
```

This is a **component + fab estimate**, not a landed retail price — it
excludes firmware/software engineering time, tooling NRE for the CNC
fixtures, QC labor, shipping/duties, and margin. Get PCBWay quotes for
Sections 5–6 before treating this range as a budget number.

---

*Companion to `docs/corporate/COSMO-SLATE-v1.md`. See `MANUFACTURING.md` for
the PCBWay production process and `FIRMWARE.md` / `SOFTWARE.md` for what
runs on and around this hardware.*
