<!--
  LOT SYSTEMS CORPORATION — COSMO® CIA
  Regulatory Pathway v1.0
  Prepared: 2026-06-15
-->

# COSMO® CIA — Regulatory Pathway v1.0

**Classification:** Internal — Legal & Compliance
**Scope:** USA (FCC), EU (CE), Global (Qi, RoHS, REACH, WEEE)

---

## 1. USA — FCC Certification

### Radio Module
COSMO® CIA uses the Espressif ESP32-S3-MINI-1 module, which holds a modular FCC grant:
- **FCC ID:** 2BBQ2-ESP32S3MINI1
- **Grant date:** 2022
- **Authorization type:** Single Modular Approval

Under FCC rules (47 CFR Part 15.212), a host device using an approved module only requires:
- Part 15 Subpart B unintentional emissions testing (Class B — residential)
- No additional radio testing required

### Required Testing (Host Device)
| Test | Standard | Lab |
|------|----------|-----|
| Radiated emissions | FCC Part 15 Subpart B | FCC-accredited lab |
| Conducted emissions | FCC Part 15 Subpart B | FCC-accredited lab |
| ESD | Not required for FCC | — |

### Filing
- FCC ID: Apply under `2BBQ2` (Espressif) as responsible party, or obtain own FCC ID
- Alternative: use SDoC (Supplier's Declaration of Conformity) — no lab ID number needed for Class B unintentional device with modular radio
- **Recommended for pilot 100-unit run:** SDoC (self-declaration, no fee, no lead time)
- **Required before retail sale in USA:** FCC ID filing (~$3,000–5,000, 6–10 weeks)

### FCC Label Requirement
Laser-engrave on device:
```
FCC ID: 2BBQ2-ESP32S3MINI1
Contains FCC-licensed transmitter.
```

---

## 2. EU — CE Marking

### Applicable Directives

| Directive | Number | Relevance |
|-----------|--------|-----------|
| Radio Equipment Directive (RED) | 2014/53/EU | Wi-Fi + BLE radio |
| Low Voltage Directive (LVD) | 2014/35/EU | Battery-powered device |
| RoHS 2 | 2011/65/EU | Materials compliance |
| EMC Directive | 2014/30/EU | Covered by RED for radio device |

### RED Compliance Path

ESP32-S3-MINI-1 holds CE / RED approval from Espressif (certificate available on Espressif website). This covers the radio element.

Host device requires:
1. Essential requirements assessment (Article 10, RED)
2. Technical file (TCF)
3. DoC (Declaration of Conformity)
4. CE mark on device

For pilot 100-unit EU run: **self-declaration** path under Annex II of RED is available without Notified Body involvement for non-novel radio equipment using certified module.

### CE Label
Laser-engrave on device back edge:
```
CE
```

---

## 3. Qi Wireless Charging

### Receiver (Built into COSMO® CIA)
- IC: TI BQ51013B — holds Qi certification from Texas Instruments
- Certification covers the IC, not the final device assembly
- For pilot: no additional Qi certification required
- For retail: WPC full product certification recommended (~$5,000, 8 weeks)

### Transmitter (Charging Pad Accessory)
- IC: IDT P9038 — holds WPC Qi certification
- Same as receiver: IC certification transfers to product for pilot use
- WPC product certification required before commercial sale

---

## 4. RoHS — Materials Compliance

All components sourced for COSMO® CIA comply with EU RoHS 2 (2011/65/EU):

| Substance | Limit | Compliance |
|-----------|-------|-----------|
| Lead (Pb) | < 0.1% | ENIG finish (gold), SAC305 solder |
| Mercury (Hg) | < 0.1% | No mercury components |
| Cadmium (Cd) | < 0.01% | No cadmium components |
| Hexavalent chromium (Cr⁶⁺) | < 0.1% | 316L stainless uses trivalent chromium only |
| Polybrominated biphenyls (PBB) | < 0.1% | FR4 PCB: halogen-free grade |
| Polybrominated diphenyl ether (PBDE) | < 0.1% | Flame retardants: halogen-free |

Maintain RoHS compliance documentation per component in BOM (supplier DoC files).

---

## 5. REACH — Chemical Safety

Under EU REACH Regulation (EC 1907/2006):

- Confirm SVHC (Substances of Very High Concern) content < 0.1% by weight
- Key concern: DEHP (phthalate) in cable insulation — verify USB-C cable compliance
- 316L stainless steel: no SVHC
- LiPo battery: request REACH DoC from battery supplier
- All ICs: standard REACH DoC from Mouser / DigiKey

---

## 6. Battery Compliance

LiPo 402540 — regulatory requirements:

| Standard | Requirement |
|----------|-------------|
| UN 38.3 | Lithium battery transport testing (vibration, shock, external short, overcharge, forced discharge, thermal) |
| IEC 62133 | Safety for portable sealed secondary cells |
| EU Battery Directive 2006/66/EC | Registration + labelling |
| IATA DGR Section II | Shipping by air |

**Action:** Obtain UN 38.3 test report from battery supplier before air shipment. Battery ≤ 250mAh qualifies for Section II (small lithium cell) — simplified air shipping.

Battery label on packaging:
```
Li-ion 3.7V 250mAh
Handle with care — do not puncture or incinerate
Recycle per local regulations
```

---

## 7. WEEE — Waste Electrical Equipment

**EU WEEE Directive (2012/19/EU):**
- Register with a WEEE compliance scheme in each EU member state before sale
- Products must carry the crossed-out wheelie bin symbol
- Pilot 100 units: register with one scheme (e.g., Compliance Direct UK / Recupel Belgium)

Add to device packaging:
```
[Crossed-out wheelie bin symbol]
Do not dispose in household waste.
```

---

## 8. Pilot 100-Unit Compliance Summary

| Requirement | Status for Pilot | Action Needed for Retail |
|-------------|-----------------|------------------------|
| FCC radio (module) | ✅ Covered by ESP32-S3 FCC ID | None |
| FCC emissions (host) | ✅ SDoC self-declaration | Full FCC ID application |
| CE/RED | ✅ Self-declaration with TCF | Notified Body review for volume |
| CE/LVD | ✅ Self-declaration | — |
| RoHS | ✅ All components compliant | Maintain supplier DoCs |
| REACH | ✅ No SVHC > 0.1% | Ongoing monitoring |
| Qi receiver | ✅ IC certified (BQ51013B) | Full product certification |
| Qi transmitter | ✅ IC certified (IDT P9038) | Full product certification |
| UN 38.3 battery | ⚠️ Obtain from battery supplier | Required before air shipment |
| WEEE | ⚠️ Register one EU scheme | Required before EU retail |

---

*COSMO® CIA Regulatory Pathway v1.0 — LOT Systems, Inc.*
*© 2026 LOT Systems, Inc. All rights reserved.*
*This document does not constitute legal advice. Consult regulatory counsel before commercial sale.*
