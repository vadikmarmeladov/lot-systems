<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® SLATE — Manufacturing Plan (v1, 100-unit pilot)

Companion doc to `docs/corporate/COSMO-SLATE-v1.md`. Covers item 1 (PCBWay)
and item 13 (100-unit run) of the original brief.

## 01. Why one vendor for board and body

PCBWay was named directly in the brief (item 1) and offers both PCB
fabrication/assembly and CNC metal machining under one account. For a
100-unit pilot, routing both the electronics and the stainless steel shells
through one vendor means:

- One shipping consolidation point instead of two vendor relationships to
  chase for a small run
- One quality contact if a batch has a defect
- Lower per-unit freight — board + shell ship together

This is a pilot-scale decision. At production volume (thousands of units),
re-evaluate a dedicated stainless CNC/MIM house against PCBWay's machining
arm — PCBWay is optimized for PCB work first, metal second.

## 02. Production sequence

```
01  Finalize board layout (FIRMWARE.md Section 02 pin map) → Gerbers to PCBWay
02  Order 5-10 prototype boards + assembly — bring up firmware on real
    hardware before committing to the 100-unit PCBA order
03  Finalize enclosure CAD (Face A + Face B, per COSMO-SLATE-v1.md Section 02)
    → order 2-3 prototype shell pairs from PCBWay CNC service
04  Fit-check: prototype board inside prototype shell — confirm the camera/
    display/button cutouts on Face B align with the assembled PCB stack
05  Correct any fit issues, re-order updated prototype shell if needed
06  Place 100-unit PCBA order (Section 5 of BOM.md)
07  Place 100-unit CNC order for Face A + Face B pairs (Section 6 of BOM.md)
08  Incoming inspection on arrival: every one of the 100 boards gets a
    power-on + display + camera + button + Wi-Fi-join test BEFORE final
    assembly into a shell (COSMO-SLATE-v1.md Section 09 v1 gate)
09  Final assembly: board into Face B housing, Face A bonded/fastened on,
    battery connected, retail box packed
10  Ship pilot units — founder unit first, then family, then first-cohort
    Usership/Legacy operators, with spares held back for field failures
```

Order matters: prototype board + prototype shell are proven to fit together
BEFORE either goes to 100-unit volume. A CNC re-order on a shell that
doesn't clear the display module is a wasted 100-unit batch, not a wasted
prototype.

## 03. The two-piece body — fastened vs. bonded seam

Item 3 of the brief specifies a two-piece stainless steel body. Two
join options, with a real trade-off:

| Approach | Pros | Cons |
|---|---|---|
| Structural adhesive bond (seamless) | No visible screws, cleanest Face A polish line, better dust/moisture seal | Not user-serviceable — a dead battery means sending the unit back, not opening it |
| Hidden M1.6 screws + silicone gasket | User/technician can open for battery service or firmware recovery | Screw heads or a visible parting line, harder to hit a true IP54 splash rating |

**v1 decision:** bonded seam with a silicone gasket at the seam line before
bonding, prioritizing the water-splash gate named in COSMO-SLATE-v1.md
Section 09 ("seam has to survive a spilled coffee") over field
serviceability. Battery service becomes a factory-return process for the
100-unit pilot, which is acceptable at this scale — revisit for a
serviceable design if volume scales past a few hundred units and RMA
shipping cost outweighs a small increase in per-unit tooling for a
gasketed screw seam.

## 04. Cost structure (100 units)

See `BOM.md` for full component costing. Manufacturing-specific line items:

```
PCB fab (100x, 2-layer)              ~$150 – $250
PCB assembly (100x, all parts)       ~$500 – $900
CNC — Face A + Face B (100x pairs)   ~$1,850 – $3,200
Prototype run (boards + shells)       ~$300 – $500   (one-time, not per-unit)
Incoming inspection labor             ~$3 – $5/unit  (100 units hand-tested)
──────────────────────────────────────────────────────────────────────────
EST. TOTAL MANUFACTURING (100 units) ~$3,100 – $5,350   (excludes NRE/tooling)
```

Get a real PCBWay RFQ before treating this as a committed budget — these
are planning-stage ranges, not quotes.

## 05. Quality gate before any unit ships

Per COSMO-SLATE-v1.md Section 09, v1's gate is: **100/100 units pass
incoming inspection** (display renders, camera captures a frame, button
registers a press, Qi charging draws current, device joins Wi-Fi and
completes one round-trip through the LOT API connector) before any unit
leaves the building. A unit that fails any one of those five checks is
held for rework, not shipped and patched later — same "never push red"
discipline the software side of LOT already runs under
(`docs/benchmark/LOT-DOCTRINE.md`).

---

*Companion to `docs/corporate/COSMO-SLATE-v1.md`. See `BOM.md` for parts and
costing, `FIRMWARE.md` for what ships on the board, `SOFTWARE.md` for the
server-side connector.*
