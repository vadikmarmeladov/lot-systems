<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Pager — Roadmap & Analysis

**Document:** LOT-PAGER-ROADMAP.md
**Classification:** Internal / Planning
**Prepared:** July 2, 2026

---

## 01. Phased Build Plan

```
PHASE                TIMELINE        WHAT SHIPS                          COST (rough)
─────                ────────        ──────────                          ────────────
0. Breadboard         2-3 weeks       MCU dev board + display + sensor +  <$200
                                       button on a bench, mock API        (dev parts only)

1. EVT                4-6 weeks       First real PCB (qty 10) via         ~$500-1,500
   (Engineering       after Phase 0   PCBWay fab+SMT · 3D-printed fit-    (PCB+assembly+
   Validation Test)                   check enclosure · firmware bring-  3D print, no
                                       up on real hardware                CNC steel yet)

2. DVT                4-6 weeks       CNC stainless shell (qty 10-25) ·   ~$2,000-5,000
   (Design            after Phase 1   software connector wired end-to-   (CNC quote is
   Validation Test)                   end · 25-unit real-operator field  the open unknown
                                       test (pocket/desk carry, 1 week)   — BOM Section 07)

3. Pilot Run           6-10 weeks     100-unit production order: PCB +    Electronics:
   (production)        after Phase 2  SMT + CNC stainless (2-piece,      ~$3,400+ (100 x
                                       polished back) · firmware locked   ~$34 component
                                       · manuals generated from as-       subtotal, BOM
                                       shipped hardware                   doc Section 08)
                                                                          + PCB/assembly/
                                                                          CNC (TBD, quote-
                                                                          gated)

4. Launch               after Phase 3  Bundled into Usership kit          Ongoing: server-
                                       alongside LOT® Station/Brush ·     side notification
                                       companion Settings panel ships     + Log tab infra
                                       in the main LOT Computer app       (existing stack)
```

**Total estimated timeline, Phase 0 → 100 units in hand: ~4-6 months**,
dominated by CNC stainless lead time (Hardware Spec Section 01: "as fast as
5 days" per order, but iterated across EVT → DVT → pilot that's 3 separate
CNC cycles plus PCBWay quote/polish turnaround which is not instant) and by
however long the field test in Phase 2 takes to run honestly (a battery-life
claim of "5-7 days" needs at least one full week of real carry to validate,
not a lab bench measurement).

---

## 02. Roadmap Analysis — Fit Against Existing Company Plans

The brief asks to "analyze the roadmap," not just state one. Here is where
LOT® Pager sits against what the repository already commits to elsewhere:

### Tension: COSMO® hardware timeline vs. this proposal

`LOT_ROBOTICS_COSMO.md` lays out a four-phase revenue path with **Phase 3:
COSMO® Hardware scheduled 2028-2029**, gated behind a Benchmark Purple-tier
soul-transfer requirement. LOT® Pager is explicitly **not** that product —
it requires no Benchmark tier, no soul-transfer protocol, and this roadmap
targets a 100-unit pilot inside **2026-2027**, roughly two years ahead of
the company's only other published hardware timeline.

**Read this as a feature, not a conflict.** LOT® Pager is small, cheap
(~$34 components + PCB/CNC, versus COSMO®'s $2,500-5,000 target price), and
carries no ethical gate — it is the right vehicle to prove "AI-powered site
→ physical world → back to the site" works in production *before* the
company commits CNC tooling and Benchmark-gating engineering to COSMO®. If
LOT® Pager's notification-and-Copy loop doesn't hold up with real operators,
that is far cheaper information to have in 2026 than after COSMO® hardware
spend begins in 2028.

### Alignment: LOT® Station / LOT® Brush

`LOT-AMBIENT-AI-VISION.md` (merged into master 2026-06-30, per commit
`fc01236`) already commits to LOT® Station and LOT® Brush shipping "with the
Usership kit" — no specific date is published there either. LOT® Pager's
Phase 4 (Launch, bundled into the same Usership kit) is scheduling itself
alongside an already-open commitment, not creating a new one. **Recommend
Phase 4 planning coordinate directly with whoever owns the Station/Brush
launch date**, since bundling three new hardware SKUs into one kit
shipment is a materially bigger logistics event than any one of them alone.

### Gap: no current server-side notification delivery or M2M intake code

Both `OS_API.md` ("OS Alerts — Push notifications for optimization
opportunities") and `LOT-TERMINAL-M2M.md` ("Data Intake Endpoint (Future)")
mark the exact capabilities LOT® Pager depends on as **not yet built**. This
roadmap's Phase 2 ("software connector wired end-to-end") is therefore not
just device integration work — it is the first real implementation of two
features the platform has been describing as future work for months. That
makes Phase 2 the highest-leverage phase in this roadmap: it delivers
platform value (working push notifications, working M2M intake) even if the
hardware program stalled entirely after DVT.

### Risk: battery life and enclosure cost are both open unknowns

Per the Firmware doc (Section 09) and BOM doc (Section 08), the two biggest
unresolved numbers — real-world battery life and CNC stainless cost at
qty-100 — are exactly the two things that determine whether this is a
$50-retail accessory or a $150+-retail one. **Recommend gating the Phase 3
purchase order on both numbers being measured, not estimated**, per the
Hardware Spec build order (Section 05, steps 06 and 08).

### Recommendation

Sequence LOT® Pager as the company's **near-term hardware proof point**
(2026-2027), explicitly positioned as de-risking work for the COSMO®
hardware phase (2028-2029) rather than a competing initiative — same
positioning `LOT-PAGER-VISION.md` already states ("the most direct proof
point that 'AI-powered site → physical world' works before the company
invests further in Quantum Cube or COSMO® hardware"). Bring the Phase 2
software connector work to the existing engineering benchmark pipeline
(`docs/benchmark/`) as its own gated session once an EVT board exists to
test against — that work is real platform code (new API routes, a new LOG
trigger, a Settings panel), not documentation, and belongs in the normal
GREEN-gated build process the rest of `LOT-Computer` uses.

---

## 03. What This Roadmap Deliberately Does Not Commit To

- No fixed launch date — Phase 4 depends on Phase 2/3 numbers not yet
  measured, per Section 02 risk above.
- No final retail price — depends on the same open BOM/CNC numbers.
- No decision on WiFi-direct vs. BLE-relay-through-phone, or e-paper vs.
  OLED display — both explicitly deferred to EVT data (Firmware doc Section
  09, BOM doc Section 02).

Committing dates or prices ahead of these numbers would be planning against
guesses, which this roadmap intentionally avoids.
