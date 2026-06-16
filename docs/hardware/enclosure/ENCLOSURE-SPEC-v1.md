# COSMO® CIA Device — Enclosure Specification v1.0

**Document:** Enclosure / Mechanical Specification  
**Device:** COSMO® CIA v1  
**Date:** 2026-06-16  
**Revision:** 1.0  

---

## 1. Overview

Two-part 316L stainless steel enclosure. Total assembled dimensions: **40.0 × 40.0 × 5.0 mm**.

## 2. Part A — Back Cover

```
Drawing: CIA-ENC-A-001

Top view (40×40mm):
┌──────────────────────────────────────────┐
│                                          │
│         ╔══════════════════╗             │
│         ║  PEEK Window     ║             │
│         ║  28 × 28 mm      ║             │
│         ╚══════════════════╝             │
│                                          │
│   COSMO® CIA         lot-systems.com     │
│        (laser etched, bottom zone)       │
└──────────────────────────────────────────┘

Cross-section (5mm height):
══════════════════════════════════  ← top (outer surface, mirror polished)
═══════╗              ╔═══════════
       ║  PEEK inlay  ║            ← 1.0mm pocket for PEEK
═══════╝              ╚═══════════
══════════════════════════════════  ← mating face (bottom)
   ↑ 2.0mm total thickness ↑
```

| Dimension | Value |
|-----------|-------|
| Overall | 40.0 × 40.0 × 2.0 mm |
| PEEK pocket depth | 1.0 mm |
| PEEK pocket size | 28.0 × 28.0 mm (centered) |
| Corner radius | R1.5 mm |
| Screw holes | 4× Ø1.2mm through-holes, 3mm from each corner |
| Material | 316L Stainless Steel |
| Outer finish | Electropolished + mechanical mirror polish (Ra ≤ 0.05 µm) |
| Mating face | Machined flat, Ra 0.8 µm |
| Laser etch | COSMO® CIA logo + lot-systems.com URL, 0.1mm depth |
| PEEK inlay | PEEK polymer, press-fit + UV adhesive bond |

## 3. Part B — Front Housing

```
Drawing: CIA-ENC-B-001

Front face (40×40mm):
┌──────────────────────────────────────────┐
│                                          │
│   ┌────────────────────────────────┐     │
│   │                                │     │
│   │   Screen aperture              │     │
│   │   24 × 24 mm                  │     │
│   │                                │     │
│   └────────────────────────────────┘     │
│                                          │
│      ◉ (Camera Ø4mm)  ● (Button Ø6mm)  │
│                                          │
└──────────────────────────────────────────┘

Cross-section (3mm housing):
══════════════════════════════════  ← mating face (top, joins Part A)
│  PCB cavity                     │  ← 2.5mm deep cavity for PCB+battery
│  Screw bosses ×4                │
│  Screen aperture (through)      │
══════════════════════════════════  ← front face (bottom, user-facing)
   ↑ 3.0mm total thickness ↑
```

| Dimension | Value |
|-----------|-------|
| Overall | 40.0 × 40.0 × 3.0 mm |
| PCB cavity depth | 2.5 mm |
| Screen aperture | 24.0 × 24.0 mm (centered, R1.0mm corners) |
| Camera aperture | Ø4.0 mm (8mm from right edge, 6mm from bottom) |
| Button aperture | Ø6.0 mm (14mm from right edge, 6mm from bottom) |
| Screw bosses | 4× M1.2 blind threaded inserts, 3mm from each corner |
| Corner radius | R1.5 mm |
| Material | 316L Stainless Steel |
| Front face finish | Satin brush, Ra 0.4 µm (direction: horizontal) |
| Mating face | Machined flat, Ra 0.8 µm, gasket groove (0.4mm wide × 0.3mm deep) |
| Camera lens recess | 0.5mm counterbore for lens glass |
| Weight (approx.) | 18g |

## 4. Assembly Mating

```
          Part A (back cover)
    ══════════════════════════════
    ───────────────────────────── ← gasket groove
    ≡≡≡≡≡≡≡≡ silicone gasket ≡≡≡≡
    ─────────────────────────────
    ══════════════════════════════
          Part B (front housing)

4× M1.2 × 2mm countersunk screws
through Part A holes → Part B bosses
Torque: 0.05 N·m
```

## 5. PEEK Window Insert (CIA-ENC-PEEK-001)

| Dimension | Value |
|-----------|-------|
| Size | 28.0 × 28.0 × 1.0 mm |
| Material | PEEK (Polyether Ether Ketone) |
| Color | Natural (off-white/translucent) |
| Finish | Polished faces (Ra 0.4 µm) |
| Fit | Press-fit into Part A pocket + UV adhesive |
| Purpose | Allow Qi magnetic flux through (stainless blocks RF/EM) |

## 6. Tolerances

| Feature | Tolerance |
|---------|-----------|
| Overall dimensions | ± 0.05 mm |
| Aperture sizes | ± 0.02 mm |
| Screw hole positions | ± 0.05 mm |
| Flatness (mating faces) | 0.02 mm total |
| Parallelism (top/bottom) | 0.02 mm |
| Mirror finish Ra | ≤ 0.05 µm |
| Satin finish Ra | 0.4 ± 0.1 µm |

## 7. PCBWay CNC Order Checklist

- [ ] Submit STEP file (3D model) for Part A and Part B separately
- [ ] Specify material: 316L Stainless Steel (confirm EN 1.4404)
- [ ] Specify finish: Part A = mirror polish; Part B = satin horizontal brush
- [ ] Specify tolerances: ± 0.05mm critical features
- [ ] Specify screw thread: M1.2 × 0.25 pitch for bosses
- [ ] Include technical drawing PDFs (CIA-ENC-A-001, CIA-ENC-B-001)
- [ ] Order 110 pieces of each (10 spares for QA/prototypes)
- [ ] Request CMM inspection report for first 5 pieces

**PCBWay CNC URL:** https://www.pcbway.com/rapid-prototyping/manufacture/CNC-Machining-Services.html

---

*Document: ENCLOSURE-SPEC-v1.md*  
*Generated: 2026-06-16*  
*© 2026 LOT Systems Corporation / COSMO® CIA*
