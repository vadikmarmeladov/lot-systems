<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Manufacturing & Compliance

**Document 6 of 7 · Hardware Documentation Set**

---

## Fabrication Partner: PCBWay

Per brief #1, [PCBWay](https://www.pcbway.com/) is the primary fabrication
partner across three services it offers under one account:

1. **PCB Fabrication** — the 40×40mm 4-layer board (Doc 02)
2. **SMT Assembly (turnkey)** — populating ESP32-S3, camera, display,
   BME680, Qi IC, button onto the fabricated board
3. **CNC Machining** — the two 316L stainless steel shells (Doc 03),
   quoted alongside a dedicated CNC house (Xometry, Protolabs) for
   comparison before the 100-unit commitment

Using one vendor for PCB + assembly + enclosure simplifies Phase 1–2
logistics; Phase 4 gets a second, independent CNC quote specifically for
the mirror-polish bottom shell, since cosmetic finish quality on a
consumer-visible surface is worth a second opinion before locking in 100
units.

## Production Run (100 units)

Per brief #13, structured as two batches rather than one 100-unit
commitment:

| Batch | Qty | Purpose |
|-------|-----|---------|
| Pilot | 10 | Validates the production PCB spin + shell tooling at real (not one-off) tolerances; full functional + drop + charge test on every unit |
| Production | 90 | Runs once the pilot batch passes Doc 01's success criteria with zero critical defects |

**Why split:** a defect found across 10 units costs 10 units to fix. A
defect found across 100 costs 100. This also matches the repo's own
"ship one thing, gate it green, then the next" discipline
(`docs/benchmark/LOT-MANIFEST.md` §06) applied to physical goods instead
of software branches.

### Cost Model (100-unit run)

| Line Item | Basis | Est. Total |
|-----------|-------|------------|
| BOM (Doc 02) | $53.15/unit × 100 | $5,315 |
| PCB tooling / stencil NRE | one-time | $250 |
| CNC shell tooling/setup (2 shells × fixture) | one-time | $1,200 |
| DFM iteration (1–2 rounds) | one-time | $600 |
| Assembly labor (final integration, not SMT) | $4/unit × 100 | $400 |
| QA — functional + drop + charge test, 100% of units | $2/unit × 100 | $200 |
| Packaging | $1.50/unit × 100 | $150 |
| **Total (100 units)** | | **~$8,115** |
| **Effective cost/unit** | | **~$81** |

This is a components-and-shop-floor estimate, not a landed retail price —
it excludes certification (below), shipping/duties, and margin.

## Compliance

| Requirement | Why | Action |
|-------------|-----|--------|
| **FCC Part 15** (US) | Any intentional (Wi-Fi/BLE) + unintentional radiator must be certified before sale/import to the US | Use a pre-certified ESP32-S3 module (module-level FCC ID is standard practice) to inherit radio certification; verify final assembly doesn't require a full modular-approval retest |
| **CE / RED** (EU) | Equivalent EU requirement if any unit ships there | Same module-level approach; confirm RED Declaration of Conformity coverage |
| **Qi Certification** (Wireless Power Consortium) | Ensures the charging coil/IC combination is interoperable with third-party Qi pads | Confirm the chosen Qi receiver IC (Doc 02, TI BQ51013B) is on a certified reference design; run WPC compliance test on the Alpha units |
| **Camera Privacy** | An always-available camera on a personal device raises real consent concerns — this is a genuine engineering/ethics requirement, not paperwork | Hardware-wired LED (Doc 02, Doc 03) tied directly to the camera's power rail, not a firmware flag — the light is on if and only if the sensor has power. Device inert until paired to a consenting profile (Doc 05), same rule `LOT_ROBOTICS_COSMO.md` sets for COSMO® robotics. |
| **Battery Safety (UN38.3 / IEC 62133)** | Required for shipping lithium cells, especially internationally | Source cells from a supplier that provides UN38.3 test reports; required regardless of order quantity |
| **RoHS** | Standard for consumer electronics materials | Specify RoHS-compliant components across the BOM (Doc 02) at time of order |

None of the above is optional at 100 units shipping to real people — this
is treated as a Phase 4 gate, not a follow-up task.

---

*Previous: [`05-SOFTWARE-LOT-API-CONNECTOR.md`](./05-SOFTWARE-LOT-API-CONNECTOR.md) · Next: [`07-USER-MANUAL-PDF-PLAN.md`](./07-USER-MANUAL-PDF-PLAN.md)*
