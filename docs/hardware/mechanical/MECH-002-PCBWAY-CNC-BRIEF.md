<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# MECH-002 — PCBWAY CNC ORDER BRIEF
## Stainless Steel Enclosure · LOT Computer Node v1.0

---

## Order Summary

Submit to: https://www.pcbway.com/rapid-prototyping/manufacture/?type=3

**Prototype order:** 5 sets (Side A + Side B)
**Production order:** 100 sets (after prototype approval)

---

## Files to Upload

```
File                          Format    Notes
─────────────────────────────────────────────────────────
LOT-HW-BODY-A_v1.0.step      STEP AP214  Mirror-polish side
LOT-HW-BODY-B_v1.0.step      STEP AP214  Functional side
LOT-HW-BODY-A_v1.0.pdf       2D drawing  Dimensions + tolerances
LOT-HW-BODY-B_v1.0.pdf       2D drawing  Cutout dimensions
```

---

## Material Specification

```
Material:       SUS316L (316L Stainless Steel)
Hardness:       HB ≤ 200 (annealed)
Certification:  Material cert required for production run
Alternate:      SUS304 acceptable for prototype only
```

---

## Side A — Mirror Polish Face

```
Outer dimensions:   40.0 × 40.0 × 4.5mm
Shell thickness:    0.8mm minimum (walls + base)
Corner radius:      R3.0mm (all 4 outer corners)
Internal pocket:    38.0 × 38.0 × 3.5mm deep
                    4× boss Ø3.0mm H2.0mm for PCB standoffs
                    1× pocket 32×32mm D1.5mm for Qi coil recess
Threaded inserts:   4× M1.2 × 0.25 × 2mm deep (corner bosses)
Split line face:    flat, Ra ≤ 3.2μm (gasket seat)

SURFACE FINISH (CRITICAL):
  External face:    Mirror polish, 8K finish, Ra ≤ 0.1μm
                    Process: 180→320→600→1200→2000 grit + buffing
  Internal walls:   Ra ≤ 3.2μm (standard machine finish)
  Split line:       Ra ≤ 1.6μm (gasket seat, smooth)
```

## Side B — Functional Face

```
Outer dimensions:   40.0 × 40.0 × 3.5mm
Shell thickness:    0.8mm
Corner radius:      R3.0mm (all 4 outer corners)
Internal pocket:    38.0 × 38.0 × 2.5mm deep
Split line face:    flat, Ra ≤ 3.2μm (gasket seat)

CUTOUTS (measure from top-left corner, external face):
  Camera aperture:  Ø8.0mm through-hole
                    Center: X=7.0, Y=7.0mm
                    Chamfer: 0.3mm × 45° on external face

  Display window:   26.0 × 26.0mm rectangular through-hole
                    Center: X=20.0, Y=22.0mm
                    Corner radius: R1.0mm
                    Rabbet: 0.5mm × 1.0mm deep for glass press-fit

  Button hole:      Ø4.2mm through-hole
                    Center: X=33.0, Y=33.0mm
                    Counterbore Ø6.0mm × 1.0mm deep (flush mount)

SURFACE FINISH:
  External face:    #240 grit brushed finish (horizontal direction)
                    No polishing — uniform brushed grain
  Internal walls:   Ra ≤ 3.2μm
  Split line:       Ra ≤ 1.6μm
```

---

## Tolerances

```
Linear dimensions:   ±0.05mm (CNC standard)
Hole positions:      ±0.03mm
Surface finish:      Per spec above (include in drawing notes)
Flatness (split line): 0.03mm
```

---

## PCBWay Notes to Include in Quote Request

```
"This is a 2-part stainless steel enclosure for an electronics device.

Side A requires an 8K mirror polish on the external face ONLY.
No markings, no logo, no engraving on any external surface.

Side B requires a #240 horizontal brushed finish on external face.
Three precision cutouts must be held to ±0.03mm position tolerance.
Display window requires a press-fit rabbet for 0.5mm glass.

Please quote:
- 5-piece prototype (both parts)
- 100-piece production (both parts, confirm lead time)
- Material certification for 316L on production run"
```

---

## Assembly Notes

The two halves are joined with 4× M1.2 × 3.5mm countersunk screws
into the threaded inserts on Side A. A 1.5mm neoprene gasket sits
between the halves at the split line (IP54 sealing).

Final assembly torque: 0.08 N·m (hand-tight + 1/8 turn).
