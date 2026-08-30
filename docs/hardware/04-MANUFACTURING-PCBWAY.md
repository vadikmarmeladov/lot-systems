<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Manufacturing Roadmap: PCBWay + 100-Unit Pilot Run (v1.0)

**Parent document:** [`docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md`](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
**BOM reference:** [`01-BOM.md`](./01-BOM.md)

> This session's network access could not reach pcbway.com to pull a live
> quote or confirm current service tiers (outbound egress restricted to an
> allowlist in this environment). The roadmap below is built from PCBWay's
> publicly known standard service structure (PCB fab, SMT assembly, CNC
> machining, all offered as of this plan's writing) and should be
> confirmed/updated by whichever session next has browsing access — that
> is the first open task in Section 6.

---

## 1. Why PCBWay (task brief item 1)

PCBWay offers three services this design needs under one vendor, which
avoids a three-way shipping/tolerance-reconciliation problem between
separate PCB, assembly, and metal shops:
1. **PCB fabrication** — the 4-layer board (BOM part #17)
2. **SMT assembly (PCBA)** — placing and reflowing parts #1–10
3. **CNC machining** — the two stainless-steel shells (BOM parts #11–12),
   including mirror-polish and bead-blast finish options

A single RFQ bundling all three, referencing this document and the BOM,
is the target — not three separate vendor relationships.

---

## 2. Phase plan

### Phase 0 — Design files (this session's remaining deliverable)
- Finalize PCB layout (KiCad or Altium — recommendation: KiCad, open
  format, no license cost) at 35×35mm outline per BOM part #17.
- Finalize mechanical drawings (STEP + DXF) for both shell halves,
  including the M1.6 screw bosses, gasket channel, and cutouts (camera,
  display, button — parent doc Section 02).
- Both file sets are prerequisites for any PCBWay quote — **this is the
  actual next engineering task**, not yet done in this session (see
  Section 6, "Open items").

### Phase 1 — Prototype (1–5 units)
- PCBWay PCB fab + assembly: typical turnaround 5–10 business days for a
  4-layer board with standard parts.
- CNC shells: typical turnaround 7–15 business days for stainless steel
  with mirror polish (polish adds days over a bead-blast-only finish).
- **Goal:** one fully assembled, hand-soldered-if-needed unit that clears
  the parent document's v1.0 gate (Section 08: power-on, notify
  round-trip, Copy round-trip against a live account).
- **Gate before Phase 2:** the RF-attenuation risk flagged in
  `01-BOM.md` Section 3 must be resolved on this prototype batch before
  committing to 100-unit CNC tooling.

### Phase 2 — Pre-production (10 units)
- Validate the factory test matrix (`02-FIRMWARE.md` Section 8) on a
  small batch before committing to full tooling costs.
- Confirm gasket fit and IP54 target with a basic splash test.
- Confirm wireless charging alignment/efficiency through the polished
  rear shell (parent doc Section 02 — the rear face is the charging
  face; steel-through-coil efficiency loss should be measured here, not
  assumed).

### Phase 3 — Pilot run (100 units)
- Full PCBWay turnkey order: PCB + SMT assembly (100 boards) + CNC
  shells (100 sets, both halves) + hardware (screws, gaskets sourced
  either through PCBWay's parts sourcing or separately per BOM).
- Typical turnaround at 100-unit scale: 3–5 weeks (CNC steel finishing
  is usually the long pole, not the PCB/SMT side).
- Factory test (per `02-FIRMWARE.md` Section 8) run on 100/100 units
  before shipment — this is the v1.1 gate named in the parent document,
  Section 08.

---

## 3. Cost roll-up (from `01-BOM.md` Section 5)

| Item | Estimate |
|---|---|
| Per-unit BOM (electronics + mechanical) | ~$35–58 |
| PCBWay assembly service fee (100 units) | ~$300–600 |
| CNC tooling/setup (one-time) | ~$300–800 |
| **Total estimated for 100-unit pilot** | **~$3,900–6,800** |

Freight (steel parts are heavier than typical PCBA shipments — budget
for this explicitly), import duties (if fabricating outside the unit's
destination market), and hand-assembly/QC labor for final unit
build-out (mating shells, gasket install, screen/lens bonding) are not
included above and should be quoted alongside the PCBWay RFQ.

---

## 4. Assembly (post-PCBWay)

PCBWay's SMT service covers the PCB + components. Final assembly — PCB
into the front shell, battery connection, display/lens bonding, gasket
seating, mating the two shells with the captured M1.6 screws, and
flashing firmware via the pogo-pin jig (`02-FIRMWARE.md` Section 1) — is
a manual step, either:
  (a) done by PCBWay's assembly service if their scope extends to full
      mechanical assembly (confirm in the RFQ), or
  (b) done in-house / by a contract assembler, in which case a simple
      assembly fixture (a jig holding both shells aligned during
      screw-down) is a Phase 1 deliverable, not a Phase 3 afterthought.

---

## 5. Result: PDF manuals (task brief item 7)

Two PDF deliverables accompany this manufacturing plan:
- `docs/hardware/pdf/LOT-COSMO-CUBE-USER-MANUAL-v1.pdf` — operator-facing
  setup and use (source: [`06-USER-MANUAL.md`](./06-USER-MANUAL.md))
- A PCBWay-facing **assembly/quote packet** (mechanical drawings +
  BOM + this document) is the next deliverable once Phase 0 design files
  (Section 2) exist — not yet produced, tracked as an open item below.

---

## 6. Open items for the next session

1. **Produce Phase 0 design files** — PCB layout (KiCad) and mechanical
   drawings (STEP/DXF) for both shell halves. Nothing in this document
   or the BOM can become a real PCBWay quote until these exist.
2. **Confirm PCBWay's current CNC + PCBA + parts-sourcing scope** with
   live browsing access — this session's cost/turnaround figures are
   estimates from general knowledge of PCBWay's public service
   structure, not a live quote.
3. **Resolve the RF-attenuation risk** (`01-BOM.md` Section 3) on the
   Phase 1 prototype before ordering Phase 3 CNC tooling.
4. **Decide brushed vs. mirror-polish** for the front shell (Part B) —
   the parent document specifies the rear (Part A) as fully polished;
   the front finish is left open pending a hands-on prototype review
   for fingerprint/glare behavior around the display window.
