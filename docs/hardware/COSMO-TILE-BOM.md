<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® TILE (CT-1) — Components Buying List

**Document:** COSMO-TILE-BOM.md
**Parent plan:** [`docs/corporate/LOT-COSMO-TILE-v1.md`](../corporate/LOT-COSMO-TILE-v1.md)
**Classification:** Restricted // S-2 Eyes
**Prepared:** 2026-08-25
**Scope:** v0 pilot run, 100 units (see parent plan Section 09)

---

## How to read this document

Every line below names a **component class** (a real, sourceable part
family) and a **representative part number** commonly used in projects of
this kind, so the list is buildable rather than aspirational. Prices are
**planning estimates at 100-unit volume**, not vendor quotes. Before any
purchase order is cut, every line marked `[QUOTE NEEDED]` must be
re-priced directly with the named supplier — this document does not
represent that pricing has been confirmed. No deep-linked product URLs
are included for the same reason: a specific SKU page can go stale or
mis-match a revision. Supplier **homepages** are given instead; search
each supplier's own catalog by the part number listed.

---

## 1. Electronics — per unit

| # | Component | Representative part | Qty | Est. unit cost | Supplier | Notes |
|---|---|---|---|---|---|---|
| 1 | Compute/radio module | ESP32-S3-WROOM-1 (N16R8 class) | 1 | $3.20 | Mouser / DigiKey | Section 03 — WiFi+BLE, dual-core |
| 2 | Camera module | OV2640 fixed-focus, FPC | 1 | $2.80 | Mouser / PCBWay sourcing | ≤2.5mm z-height target |
| 3 | Display module | GC9A01 round TFT 1.28" or ST7789 square 1.3" | 1 | $4.50 | Mouser / Adafruit | Pager-grade one-line render |
| 4 | Environment sensor | BME280 (temp/humidity/pressure) | 1 | $2.10 | Mouser / Adafruit | Weather sensor, Section 03 |
| 5 | Wireless charge receiver + PMIC | Qi receiver coil + BQ51013B-class PMIC | 1 | $2.40 | Mouser / DigiKey | Section 03 |
| 6 | Battery buffer | Thin-format LiPo pouch or solid-state supercap | 1 | $1.80 | DigiKey / Mouser | Graceful-shutdown runtime only |
| 7 | Tactile button (COPY) | Low-profile SMD tactile switch | 1 | $0.15 | Mouser | Section 03 |
| 8 | PCB — rigid-flex | 2-layer rigid-flex, custom | 1 | $4.50 | **PCBWay** [QUOTE NEEDED] | Fab cost amortized/unit at 100pcs |
| 9 | SMT assembly labor | — | 1 | $3.50 | **PCBWay** [QUOTE NEEDED] | Per-unit at 100pcs, incl. stencil amortization |
| 10 | Passives, connectors, misc | — | 1 lot | $2.00 | Mouser / DigiKey | Decoupling caps, FPC connectors, antenna |
| | | | | **≈ $27.00** | | **Electronics subtotal / unit** |

---

## 2. Mechanical — per unit

| # | Component | Spec | Qty | Est. unit cost | Supplier | Notes |
|---|---|---|---|---|---|---|
| 1 | Shell — Face A (polished) | 316L stainless, 40×40mm, CNC + #8 polish | 1 | $6.50 | **PCBWay** metal parts [QUOTE NEEDED] | Section 02 |
| 2 | Shell — Face B (matte) | 316L stainless, 40×40mm, CNC + bead blast, camera/screen/button cutouts | 1 | $7.80 | **PCBWay** metal parts [QUOTE NEEDED] | Section 02 |
| 3 | Standoffs + M1.4 screws | Stainless, 4 sets | 4 | $0.60 | PCBWay / McMaster-Carr | Clamshell fastening, not adhesive |
| 4 | Lens/screen window | Sapphire or hardened glass, 2 pcs | 2 | $1.20 | PCBWay optical sourcing | Camera lens + display window |
| | | | | **≈ $16.10** | | **Mechanical subtotal / unit** |

---

## 3. Charging puck (companion accessory, sold or bundled per unit)

| # | Component | Spec | Est. unit cost | Supplier | Notes |
|---|---|---|---|---|---|
| 1 | Qi transmitter module | 5W-class transmitter coil + driver | $3.50 | Mouser / DigiKey | The "table" the tile rests on |
| 2 | Enclosure | Injection-molded or 3D-printed puck | $2.00 | PCBWay | Shared design language with CT-1 |
| 3 | USB-C input + cable | — | $1.20 | DigiKey | Standard power-in |
| | | **≈ $6.70** | | **Charger subtotal / unit** |

---

## 4. 100-unit pilot rollup

| Category | Per-unit | × 100 units | Notes |
|---|---|---|---|
| Electronics | $27.00 | $2,700 | Table 1 |
| Mechanical (shell) | $16.10 | $1,610 | Table 2 |
| Charging puck | $6.70 | $670 | Table 3, one per unit |
| **BOM subtotal** | **$49.80** | **$4,980** | |
| NRE — PCB stencil + fixtures | — | $600-$1,200 | One-time, amortized informally into pilot budget, not per-unit above |
| NRE — CNC shell tooling/fixtures | — | $800-$1,800 | One-time; deep-draw die tooling NOT included (Section 09 of parent plan — evaluated only past pilot) |
| Firmware bring-up + test labor | — | $1,500-$3,000 | Engineering time, not a purchased line |
| **Planning total, 100-unit pilot** | — | **≈ $8,500-$11,600** | All lines marked `[QUOTE NEEDED]` above must be confirmed before this number is treated as a budget |

This lands the parent plan's headline estimate (Section 10: "$18-$32
electronics + $8-$18 shell") inside the actual line-item build above —
electronics at $27.00 and shell at $16.10 both sit mid-range of that
earlier estimate.

---

## 5. Suppliers named in this document

| Supplier | Role | Homepage |
|---|---|---|
| PCBWay | PCB fab, SMT assembly, CNC/sheet-metal shells, low-volume prototyping | https://www.pcbway.com |
| Mouser Electronics | Passive/active component sourcing | https://www.mouser.com |
| DigiKey | Passive/active component sourcing, alternate to Mouser | https://www.digikey.com |
| Adafruit | Breakout-level sourcing for bring-up/prototype units (Stage 1-2 only, Section 09) | https://www.adafruit.com |
| McMaster-Carr | Fasteners, standoffs | https://www.mccmaster.com |

---

## 6. Open items before purchase order

- [ ] Real PCBWay quote: rigid-flex PCB, 2-layer, qty 100, incl. stencil
- [ ] Real PCBWay quote: SMT assembly, qty 100, incl. reflow + AOI
- [ ] Real PCBWay quote: 316L CNC shell pair (Face A + Face B), qty 100
- [ ] Camera module z-height confirmed against Section 02 height budget
      once physical samples are in hand — a datasheet number is not the
      same as a measured tolerance stack
- [ ] Battery buffer chemistry/safety review (shipping a LiPo pouch cell
      inside a sealed metal shell has UN38.3/IEC 62133 implications for
      the 100-unit shipment — flag to compliance before Stage 4)

---

*Parent plan: [`docs/corporate/LOT-COSMO-TILE-v1.md`](../corporate/LOT-COSMO-TILE-v1.md) · Firmware: [`COSMO-TILE-FIRMWARE.md`](./COSMO-TILE-FIRMWARE.md) · Software: [`COSMO-TILE-SOFTWARE.md`](./COSMO-TILE-SOFTWARE.md)*
