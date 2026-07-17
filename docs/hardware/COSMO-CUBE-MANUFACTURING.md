<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Manufacturing Plan

**Document:** COSMO-CUBE-MANUFACTURING.md
**Classification:** Public — Operations Reference
**Prepared:** 2026-07-17
**Status:** PLAN — no orders placed.

---

## Single-vendor strategy: PCBWay

PCBWay was specified as the manufacturing partner (requirement #1). It
happens to be a genuinely good fit for this exact device, because it offers
**both** of the two processes this device needs, under one account:

1. **PCB fabrication + SMT assembly** — for the custom carrier board.
2. **CNC machining in stainless steel (304 / 316 / 316L / 303 / 430)** — for
   the two-part body, including mirror-polish finishing options.

Relevant PCBWay tools:
- PCB prototype + order: https://www.pcbway.com/orderonline.aspx
- SMT/PCB assembly quote: https://www.pcbway.com/quotesmt.aspx
- CNC machining quote: https://www.pcbway.com/rapid-prototyping/manufacture/?type=2
- CNC stainless steel 304 material page: https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/
- CNC stainless steel 316 material page: https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/
- Custom enclosure design quote (if outsourcing CAD): https://www.pcbway.com/pcbdesign/quoteenclosure

## PCB fabrication + assembly path

| Stage | What's ordered | Quantity | Notes |
|---|---|---|---|
| Phase 2 prototype | Bare PCB, 4-layer or 2-layer (TBD at schematic stage) | 5–10 pcs | PCBWay's standard small-batch minimum; extras are cheap insurance against a bad first spin |
| Phase 2 assembly | SMT assembly of the above | 5–10 pcs | Choose **kitted/consigned** supply for the XIAO module, display, and BME680 (send PCBWay the modules directly) and **turnkey** for passives (resistors, caps, connector, button) — PCBWay sources those |
| Phase 4 pilot | Bare PCB + SMT assembly | 100 pcs | Same design, no changes — get a fresh instant quote at 100pcs once BOM is locked; PCBWay's small-batch (50–200pcs) tier is machine-assembled, appropriate for this volume |

Component supply model: **Combo** (per PCBWay's three supply options —
Turnkey / Kitted / Combo) — PCBWay stocks the generic passives, the LOT team
supplies the XIAO ESP32S3 Sense, GC9A01 display, BME680, and Qi receiver
modules directly, since these are pre-assembled modules PCBWay would
otherwise have to source at markup.

## Stainless steel enclosure path

| Stage | What's ordered | Quantity | Notes |
|---|---|---|---|
| Phase 3 test cut | 1 unpolished shell pair (top + bottom) | 1 set (2 parts) | Validate PCB fit, display window, camera aperture, button hole, and standoff alignment before spending on polish |
| Phase 3 finish validation | 1 mirror-polished shell pair | 1 set | Confirm the #8 mirror polish process on the top plate meets the "flat silver square" look (requirement #4) |
| Phase 4 pilot run | 100 shell pairs (200 machined parts total) | 100 sets | One PCBWay CNC order once CAD + finish are locked |

**Material choice:** stainless steel 304 is the standard, lower-cost option;
316 costs more but resists corrosion/skin-oil tarnishing better for an
object handled daily and left near coffee, sinks, etc. — worth the delta for
a device that's explicitly a desk object touched often. Get quotes for both
at the Phase 3 test-cut stage before deciding.

**Finish:** top shell (the "flat silver square," requirements #4 and #17)
gets a #8 mirror polish. Bottom shell (the "instrument face," requirement
#18) can be a lighter bead-blast or brushed finish — it has openings for the
display, camera, and button, so a mirror finish there would show fingerprints
and CNC witness marks more than it would look intentional.

## Assembly (not offered by PCBWay for a bespoke enclosure like this)

PCBWay assembles PCBs but does not do final product assembly (PCB → shell →
battery → screen ribbon → close-up) for a custom mechanical design like this
one. Plan for **manual assembly in-house**, in batches:

1. Flash firmware onto each assembled PCB via USB-C jig (before enclosure
   assembly — much easier to access the port).
2. Seat PCB into bottom shell, connect display ribbon, seat battery, connect
   Qi receiver coil.
3. Function test: Wi-Fi pairing, screen render, button press → Log tab entry,
   camera capture (opt-in path), BME680 reading sane.
4. Close shell with top plate + 4x M1.6 standoffs + gasket.
5. Label with serial number (ties to the `Device.id` used in pairing).

At 100 units, budget this as ~10 batches of 10, function-tested individually
— not a line-assembly process, a bench process. If volume grows past a pilot
run, a contract assembler becomes worth evaluating; not needed at this scale.

## Timeline (from S-2 sign-off)

```
Phase 1  (proto, breadboard)         ~2-3 weeks
Phase 2  (custom PCB v1, 5-10 pcs)   ~3-4 weeks  (PCBWay turnaround + bring-up)
Phase 3  (enclosure CAD + test cut)  ~2 weeks    (can overlap Phase 2)
Phase 4  (100-unit pilot order)      ~3-4 weeks  (PCBWay batch lead time)
Phase 4  (manual assembly, 100 pcs)  ~1-2 weeks  (in-house, ~10 batches)
────────────────────────────────────────────────
Total, sign-off to shippable units   ~11-15 weeks
```

This assumes no design revisions between phases. Any Phase 2 respin (likely
— few boards are right on the first try) adds one PCBWay turnaround cycle.

---

*No purchase orders have been placed against this plan. Phase 1 requires
S-2 sign-off per `COSMO-CUBE-PLAN.md`.*
