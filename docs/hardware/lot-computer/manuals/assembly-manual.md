# LOT Computer — Assembly Manual (Internal / Manufacturing Partner)

*(Concept-stage — this is the DVT/PVT assembly reference to hand to whoever
builds the units, per `../06-MANUFACTURING.md`. Torque specs and exact
fastener sizes are placeholders pending final DVT CAD.)*

## Exploded structure (front to back)

1. **Side B shell** (brushed stainless, front) — camera lens cutout, display
   window, button through-hole.
2. **Camera module** — seated and adhered into its cutout, ribbon cable
   routed to the PCB.
3. **Display module** — seated into its window, FPC connector routed to the
   PCB.
4. **Button cap** (stainless) — sits over the SMD tactile switch on the PCB,
   protrudes just enough through Side B's through-hole for a positive click.
5. **Main PCB assembly** — MCU, sensors, charge management IC, Qi receiver
   coil, battery connector, all reflow/placed by the SMT partner.
6. **Battery** — connected via JST, seated in its pocket, secured with
   adhesive foam tape (no rattling).
7. **Gasket** — seated in the mating groove between Side B and Side A.
8. **Side A shell** (polished stainless, back) — Qi contact patch aligned to
   the receiver coil beneath it.
9. **4× hex screws** — through Side A into Side B's threaded standoffs.

## Assembly steps

1. Inspect Side B shell for cutout burrs; deburr if present before component
   seating — a burr near the display window can crack the FPC.
2. Seat camera module; connect ribbon cable to PCB header.
3. Seat display module; connect FPC to PCB header.
4. Place button cap.
5. Lower PCB assembly into Side B, aligning camera/display connectors and
   the button cap over its switch.
6. Connect battery JST; tuck cable away from the button mechanism.
7. Seat gasket into groove — check it sits flush, not twisted.
8. Lower Side A onto the assembly, Qi contact patch aligned over the coil.
9. Insert 4× hex screws, tighten in a cross pattern (not sequentially around
   the perimeter) to seat the gasket evenly. Final torque spec: **TBD** —
   set once the fastener size is finalized in DVT; do not over-torque into
   stainless threads in the meantime.
10. Run the power-on self-test (see QA checklist, `../06-MANUFACTURING.md §5`).
11. Apply peel-off protective film to the polished Side A face.
12. Package.

## Cautions

- The polished face scratches easily before the protective film is applied —
  handle by the edges/brushed side during assembly wherever possible.
- Do not force the gasket — if it doesn't seat flush, check for debris in the
  groove rather than compressing past it.
- Battery JST connector is polarized; do not force a reversed connection.
