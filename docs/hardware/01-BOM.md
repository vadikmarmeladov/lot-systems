<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Bill of Materials (v1.0)

**Parent document:** [`docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md`](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
**Scope:** Full components buying list for one prototype unit and a 100-unit pilot run.

> **Sourcing note:** this session's environment has outbound network access restricted
> to a small allowlist and could not live-browse supplier catalogs or verify exact SKU
> URLs at write time. Part numbers below are real, commonly-stocked parts as of this
> plan's writing — **verify current stock, exact SKU, and price on the distributor's
> site before ordering.** Distributor search URLs (not deep product links) are given
> so the next session can resolve them in one query.

---

## 1. Electronics

| # | Part | Reference component | Qty/unit | Est. unit cost (100-pc price break) | Distributor search |
|---|------|---------------------|----------|--------------------------------------|---------------------|
| 1 | MCU + Wi-Fi + camera interface | Espressif **ESP32-S3-WROOM-1-N8R8** module (8MB flash / 8MB PSRAM, camera DVP interface) | 1 | ~$3.00–3.80 | Mouser / DigiKey / LCSC: "ESP32-S3-WROOM-1-N8R8" |
| 2 | Camera sensor | **OV2640** 2MP module, DVP interface, w/ auto white balance | 1 | ~$3.50–5.00 | Mouser / LCSC / Arducam: "OV2640 camera module DVP" |
| 3 | Display | 1.28"–1.4" round or 1" square **reflective/transflective LCD** or **low-power IPS**, SPI, e.g. GDEY0154D67 (e-paper, ultra low power) or a round SPI TFT (GC9A01 driver) if refresh speed matters more than idle power | 1 | ~$4.00–7.00 | DigiKey / Good Display / Buydisplay: "1.28 round SPI TFT GC9A01" or "1.54 e-paper GDEY0154D67" |
| 4 | Weather sensor | Bosch **BME280** (temp / humidity / barometric pressure, I2C) | 1 | ~$1.80–2.50 | Mouser / DigiKey: "BME280" |
| 5 | Button | Sealed IP67 stainless tactile switch, 6mm, momentary | 1 | ~$0.60–1.00 | Mouser / DigiKey: "IP67 sealed tactile switch 6mm stainless" |
| 6 | Wireless charge receiver | Qi-class RX coil + **TI BQ51013B** (or equivalent Qi receiver IC) | 1 set | ~$2.50–3.50 | Mouser / DigiKey: "BQ51013B Qi receiver" + "Qi receiver coil 20mm" |
| 7 | Battery charge/power management | **TI BQ25185** (linear charger, Qi-compatible input) or MCP73831 for simpler charge path | 1 | ~$1.20–1.80 | Mouser / DigiKey: "BQ25185" |
| 8 | Battery | LiPo, ultra-thin, 150–250mAh, w/ protection circuit (e.g. 401230 or 402530 form factor) | 1 | ~$2.50–4.00 | Adafruit / Mouser / PowerStream: "LiPo 200mAh ultra thin" |
| 9 | Passives (decoupling caps, resistors, LED-free per Section 04) | Standard 0402/0603 | ~30 | ~$0.50 total | LCSC (bulk reel, part of PCBWay assembly BOM) |
| 10 | Antenna | ESP32-S3 module has PCB trace antenna option (no separate part) or U.FL + external chip antenna if steel shell attenuates signal (**likely required** — see Section 3 below) | 1 | ~$0.80–1.50 | Mouser: "2.4GHz chip antenna U.FL" |

**Electronics subtotal (est., 100-unit price breaks):** ~$18–30 per unit.

---

## 2. Mechanical / Enclosure

| # | Part | Spec | Qty/unit | Notes |
|---|------|------|----------|-------|
| 11 | Rear shell (Part A) | 40×40×2.2mm, 304 or 316L stainless steel, CNC-machined, mirror-polished one face | 1 | Fabricated via PCBWay CNC machining service (or a dedicated CNC/metal shop — see `04-MANUFACTURING-PCBWAY.md`) |
| 12 | Front shell (Part B) | 40×40×2.8mm, matching grade, machined with camera/display/button cutouts, brushed or polished per prototype-review decision | 1 | Same fabrication path as Part A |
| 13 | Cover lens (camera) | Sapphire or hardened mineral glass, 3mm dia. | 1 | Mouser/DigiKey optical or a watch-crystal supplier (sapphire watch crystal blanks are a viable low-volume source) |
| 14 | Display window glass | Custom-cut hardened glass or acrylic, matched to display cutout | 1 | Cut to spec by the display vendor or a local glass shop |
| 15 | Gasket | Silicone, custom die-cut to shell perimeter, ~0.5mm | 1 | IP54 target — local gasket fabricator or PCBWay's sister rubber-parts service |
| 16 | Fasteners | M1.6 × 3mm stainless captured screws | 4 | McMaster-Carr / Mouser hardware |
| 17 | PCB | 4-layer, ENIG finish, rigid, ~35×35mm outline to fit shell internal cavity | 1 | PCBWay PCB fabrication — see manufacturing doc |

**Mechanical subtotal (est., 100-unit price breaks, CNC steel dominates):** ~$12–20 per unit (highly dependent on final polish/finish spec and CNC shop quote).

---

## 3. Design risk flagged for prototype review

**RF attenuation from the stainless-steel shell.** A fully metal two-part
enclosure is a Faraday-cage risk for the ESP32-S3's 2.4GHz Wi-Fi. Two
mitigations, both listed in the BOM above, should be prototyped before the
100-unit commit:
  - An RF-transparent window (the display glass or camera lens area) with
    the antenna routed directly behind it, OR
  - A U.FL external chip antenna fed through a small non-metallic insert
    in the shell seam.

This is exactly the kind of finding a single hand-built prototype
(v1.0 gate, per the parent document Section 08) exists to catch before
committing to a 100-unit CNC run.

---

## 4. Manufacturing services (parts 11, 12, 17)

**PCBWay** (pcbway.com) is the specified fabrication partner (task brief
item 1) for:
  - PCB fabrication + SMT assembly (parts 1–10, reflow-mounted)
  - CNC machining of the two stainless-steel shells (parts 11, 12) —
    PCBWay's CNC machining service supports stainless steel with mirror
    polish and bead-blast finish options
  - Full turnkey quote request should bundle PCB + assembly + CNC shells
    into one RFQ for the 100-unit run — see
    [`04-MANUFACTURING-PCBWAY.md`](./04-MANUFACTURING-PCBWAY.md) for the
    procurement roadmap and cost/timeline breakdown.

This session could not reach pcbway.com directly (outbound network
allowlist) to pull a live quote — the next session with browsing access
should submit the RFQ using this BOM plus the mechanical drawings named
in `04-MANUFACTURING-PCBWAY.md`.

---

## 5. Rolled-up cost estimate (100-unit pilot run)

| Category | Est. per-unit | Est. 100-unit total |
|---|---|---|
| Electronics (Section 1) | ~$18–30 | ~$1,800–3,000 |
| Mechanical / enclosure (Section 2) | ~$12–20 | ~$1,200–2,000 |
| PCB fab + SMT assembly service fee | ~$3–6 | ~$300–600 |
| CNC setup / tooling (one-time, amortized) | — | ~$300–800 one-time |
| **Total estimated (100 units)** | **~$35–58/unit** | **~$3,900–6,800** |

This excludes freight, import duties, and final assembly/QC labor
(Section 5 of `04-MANUFACTURING-PCBWAY.md`). Compare against the $2,500–
$5,000/unit *retail* target named in `docs/corporate/LOT_ROBOTICS_COSMO.md`
Phase 3 — that figure is for the COSMO® robotics line broadly, not this
device; COSMO® Cube v1.0 is priced here as a near-cost pilot, not a
margin product.
