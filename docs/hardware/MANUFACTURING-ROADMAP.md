# LOT Node — Manufacturing Roadmap (PCBWay + 100-unit run)

## 1. Why PCBWay (brief item 1)

PCBWay is used for three distinct services on this program, all through one
vendor to reduce coordination overhead for a first hardware run:

1. **PCB fabrication** — bare 4-layer board, ENIG finish
2. **PCBA (assembly)** — SMT placement of the ESP32-S3, display, camera,
   sensor, and passives from `BOM-COMPONENTS.md`
3. **CNC rapid prototyping / low-volume production** — the 2-part SUS304
   stainless steel enclosure (PCBWay's CNC service supports stainless steel
   as a listed material, plus bead-blast and polish finishing options)

Quote flow: [pcbway.com](https://www.pcbway.com/) → PCB Prototype for the
board, PCB Assembly for SMT, and Rapid Prototyping / CNC Machining for the
enclosure. Request DFM (design-for-manufacture) feedback on the CAD before
committing — PCBWay does this as part of quoting.

## 2. Process, in order

```
1. Finalize schematic + PCB layout (KiCad recommended, ESP32-S3 footprint
   from Espressif reference design)
2. Finalize enclosure CAD (front + rear plate, SUS304, tolerances for
   press-fit + 4× M1.6 screws)
3. Submit PCB + PCBA quote to PCBWay with the BOM CSV
4. Submit CNC quote to PCBWay (or a secondary CNC house) for the enclosure
5. Order 5-10 proto units first (Phase 1) — validate fit, charging coupling
   through the stainless rear plate, camera/display alignment
6. Firmware bring-up against proto units (see FIRMWARE.md)
7. Fix any DFM issues found in proto (this is expected — budget 1 iteration)
8. Place 100-unit production order (Phase 6)
9. Incoming QC on delivered units (sample 10%, functional test each: boot,
   Wi-Fi join, display, camera, button, Qi charge)
10. Pack + ship
```

## 3. 100-unit run — economics

See `BOM-COMPONENTS.md` §5 for the full BOM roll-up:

- **Per-unit landed cost (excl. tooling/freight/cert):** ~$61
- **100-unit total:** ~$6,110
- **One-time tooling:** ~$1,500–2,500
- **Freight (100 units, air/courier):** ~$150–400
- **All-in for the 100-unit run:** **~$7,800–9,000**

PCBWay's standard MOQ for PCBA is typically far below 100 units (they
support prototype-scale orders), so there is no minimum-order barrier to
running exactly 100 — the volume is a deliberate choice (brief item 13), not
a supplier constraint.

## 4. Timeline

| Phase | Duration | Notes |
|---|---|---|
| Schematic + PCB layout | 1-2 weeks | Can start immediately from `HARDWARE-SPEC.md` |
| Enclosure CAD | 1-2 weeks | Parallel with PCB layout |
| PCBWay PCB+PCBA lead time (proto, 5-10 units) | 1-2 weeks | Standard PCBWay turnaround for small proto runs |
| CNC proto lead time | 2-3 weeks | Stainless steel machining + finishing takes longer than PCB |
| Firmware bring-up | 3-4 weeks | Parallel with CNC lead time |
| Integration + fixes | 1-2 weeks | Buffer for the "expected 1 iteration" in §2 |
| 100-unit production (PCBA + CNC) | 3-4 weeks | Larger batch, same vendor relationship |
| QC + packaging + ship | 1 week | |
| **Total, plan to shipped 100 units** | **~13-18 weeks** | Assuming no major redesign after proto |

## 5. Certification note

A 100-unit run for internal use, beta testers, or gifting does **not**
require FCC/CE certification in the US. It **does** become required the
moment units are sold at retail to the general public. Budget for FCC Part
15 testing (~$1,500-3,000 typical for a simple Wi-Fi device through a test
lab) as a separate future line item if/when this moves from a 100-unit pilot
to a sellable product — not included in the totals above.
