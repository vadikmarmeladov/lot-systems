<!--
  LOT SYSTEMS CORPORATION
  COSMO® CIA Hardware Division
  Document: COSMO-ROADMAP-ANALYSIS-v1.md
  Roadmap Critical Path & Risk Analysis
  Date: 2026-07-07
-->

# COSMO® Cube — Roadmap Analysis v1.0

**Document:** COSMO-ROADMAP-ANALYSIS-v1.md
**Analyzes:** The 4-phase roadmap in COSMO-HARDWARE-REPORT-v1.md
**Author:** Vadim Marmeladov, Inventor
**Date:** 2026-07-07

---

## 1. Critical Path

The roadmap's four phases (Design → Engineering → Prototype → Production →
Launch) are not equally risky. Reading the dependency graph across the six
existing v1 documents, three items gate everything downstream of them:

```
PCB schematic (KiCad)  ──┐
                         ├──► PCB layout ──► Gerbers ──► PCBWay PCB order ──┐
Enclosure CAD (Fusion)  ──┘                                                 │
                                                                            ▼
LOT backend hardware API endpoints ──────────────────────────────► Prototype firmware v0.2
                                                                            │
                                                                            ▼
                                                          10-unit prototype validation
                                                                            │
                                                                            ▼
                                                          100-unit production order
```

**Critical path:** PCB schematic → PCB layout → enclosure CAD fit-check →
prototype build → firmware v0.3 validated on real hardware → production order.
Everything in Phase 3–4 is downstream of the Phase 1 schematic/layout being
correct — an error caught after the 100-unit PCBWay order is the single most
expensive failure mode in this plan (SS CNC enclosures are the most expensive
line item at ~$40/unit and are not owner-correctable after machining).

---

## 2. Risk Register

| # | Risk | Phase | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| 1 | 5mm stack-up doesn't close (camera + OLED + battery + PCB all fight for Z-height) | 1–2 | Medium | High — forces dimension change | Build a non-SS foam-core mechanical mockup BEFORE ordering CNC enclosures; DEVICE-SPEC-v1.md §2–3 already budgets this tightly |
| 2 | HM01B0 camera lead time / MOQ from ArduCam | 1 | Medium | Medium | Confirm stock + MOQ before schematic freeze; OV2640 is the documented fallback (HARDWARE-REPORT-v1.md §4) |
| 3 | Custom LiPo cell (Grepow, 35×35×2.5mm) tooling lead time | 1 | Medium | High — blocks prototype build | Order Grepow sample cells at Phase 1 start, not Phase 2 — custom cell tooling can run 3–4 weeks |
| 4 | Qi 5W charging efficiency drops below spec through 0.5mm SS back plate | 2 | Low–Medium | Medium | SS is not ferromagnetic-transparent like plastic; 316L is austenitic (non-magnetic) so this is expected to work, but MUST be validated on the first prototype, not assumed from datasheet math |
| 5 | FCC/CE certification timeline underestimated | 4 | Medium | High — blocks commercial sale | Budget ($15–25K, per DEVICE-SPEC-v1.md §10) is sized; timeline (typically 8–12 weeks post-final-firmware) is NOT yet in the phase roadmap — add explicit certification lead time to Phase 4 |
| 6 | 100-unit PCBWay CNC order committed before prototype fully validates enclosure fit | 3 | Low | Very High (irreversible spend, ~$4,400 in enclosures alone) | Cardinal rule: no 100-unit CNC order until all 10 prototype units pass the QA checklist in COSMO-MANUFACTURING-v1.md |
| 7 | LOT backend hardware endpoints (register/log/notifications/firmware) not built until Phase 1, but device firmware needs them for Phase 2 integration testing | 1–2 | Medium | Medium | Backend endpoints should be built and mock-tested with `curl` before the first prototype boots — currently listed as a Phase 1 checkbox with no explicit ordering vs. firmware work |

---

## 3. Roadmap Amendment (v1.0 → this analysis)

The original 4-phase roadmap (COSMO-HARDWARE-REPORT-v1.md) is sound but under-specifies
two things this analysis makes explicit:

1. **Insert a Phase 1.5 — Mechanical Mockup** (foam-core or 3D-printed, not SS):
   validates the 5mm stack-up and camera/OLED/battery fit BEFORE the CNC enclosure
   order. Cost: <$200, days not weeks. This is the single highest-leverage risk
   reduction available and is currently missing from the phase list.
2. **Extend Phase 4 with explicit certification lead time** (8–12 weeks), placed
   in parallel with the 100-unit production run, not after it — certification
   samples can be pulled from the first prototype batch rather than waiting for
   full production.

No other phase content changes. The BOM, firmware, manufacturing, and API docs
remain v1.0 and require no revision from this analysis.

---

## 4. Go / No-Go Gate Recommendation

Before the 100-unit PCBWay CNC order (the irreversible-spend risk, #6 above),
require all of:

- [ ] 10-unit prototype passes full QA checklist (COSMO-MANUFACTURING-v1.md)
- [ ] Qi charging validated through actual 316L SS back plate at rated 5W
- [ ] Firmware v0.3 (Copy button + sensor logging) round-trips to
      `lot-systems.com/api/hardware/log` and appears in the Log tab
- [ ] Battery life measured ≥ 15 hours real-world (spec target: 18h, DEVICE-SPEC-v1.md §11)

---

*Document v1.0 — COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadim Marmeladov — 2026-07-07*
