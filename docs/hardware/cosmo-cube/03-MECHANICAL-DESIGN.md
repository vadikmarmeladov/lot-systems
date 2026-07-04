<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Mechanical Design

**Document 3 of 7 · Hardware Documentation Set**

---

## Form Factor

**Target silhouette:** a flat silver square, **40mm × 40mm × 5mm**
(the "final" v2 target from the brief).

**Body:** two parts — a top shell and a bottom shell — that close over the
internal PCB stack. No visible seam gap greater than 0.1mm when closed.

## Top Face — "the working face"

Per the brief, one side carries all active interface elements:

- **Camera** — a single lens aperture, ~2mm diameter, flush with the
  surface, positioned off-center near one edge.
- **Display** — the 1" square OLED (Doc 02), centered, showing nothing at
  rest. A blank stainless face is the default state.
- **Copy button** — a single recessed tactile button near the opposite
  edge from the camera, stainless steel cap flush with the shell so the
  face reads as unbroken metal until pressed.
- **Camera privacy LED** — a small ring or dot around the lens aperture,
  hard-wired to the camera's power rail (see Doc 06 §Camera Privacy) so it
  cannot be turned off in firmware alone.

## Bottom Face — "the resting face"

Per the brief, the opposite side is plain, **polished (mirror-finish)
stainless steel** — no visible ports, buttons, or seams. This is the face
that rests on the wireless charging pad.

### Charging Window (engineering note)

Solid stainless steel blocks the magnetic flux a Qi coil needs — a fully
metal bottom shell will not charge wirelessly. To keep the "one side
polished stainless steel" identity while still charging inductively, the
bottom shell has a **machined recess fitted with a non-conductive ceramic
or sapphire insert**, centered over the Qi coil, finished flush and
polished to match the surrounding steel. This is the same solution used on
stainless steel Apple Watch models, which use a ceramic/sapphire back
specifically to let wireless charging and sensors pass through a metal
body. From 30cm away the face reads as a single polished plate; up close,
a faint window is visible over the coil.

## Materials & Finish

| Part | Material | Finish | Rationale |
|------|----------|--------|-----------|
| Top shell | 316L stainless steel | Bead-blasted matte | Hides fingerprints around camera/button; matches LOT®'s minimal, quiet visual language |
| Bottom shell | 316L stainless steel | Mirror-polished / electropolished | The "flat silver square" identity the brief calls for; corrosion-resistant for a surface handled daily |
| Charging window | Ceramic or sapphire crystal | Polished flush to bottom shell | Passes Qi flux; scratch-resistant |
| Seal | Silicone O-ring gasket, custom diameter | — | IP-rating seal between shells (Doc 01 success criteria: survive a drop without separating) |

316L was chosen over 304 for its marine-grade corrosion resistance —
this is an object meant to sit on a nightstand or kitchen counter and be
picked up daily.

## Assembly

Two closure options, to be prototyped in parallel during Phase 2 (Doc 01):

1. **Press-fit + adhesive gasket** — no visible fasteners, cleanest look,
   harder to service/repair.
2. **Concealed M1.2 stainless screws** through the O-ring gasket, hidden
   under the bottom shell's rim — serviceable, marginally thicker seam.

Alpha units (Doc 01 Phase 3) will build both and pressure/drop-test each
before the 100-unit commitment.

## Thickness Stack-Up (why 5mm is aggressive)

| Layer | Approx. thickness |
|-------|--------------------|
| Top shell wall | 0.6mm |
| Camera module (OV2640, v1) | 4.5mm |
| Camera module (OVM6948, v2 miniaturization target) | ~1.2mm |
| Display (OLED module w/ glass) | 1.4mm |
| PCB (flex-rigid) | 0.4mm |
| Battery (LiPo pouch, Alpha) | 2.5mm |
| Battery (thin-film cell, v2 target) | ~0.5mm |
| Qi coil | 0.5mm |
| Bottom shell wall | 0.6mm |

Stacking the Alpha-spec (v1) components, gives roughly **10–12mm**, not
5mm. This is expected and is why Doc 01's roadmap treats 5mm as a **Phase
3–4 mechanical target**, reached by swapping to the miniature camera
module and thin-film battery once the electronics and firmware are proven
at the easier, thicker Alpha size. Shipping a working 12mm Alpha before
chasing 5mm avoids blocking the whole program on a single hard
miniaturization problem.

---

*Previous: [`02-BILL-OF-MATERIALS.md`](./02-BILL-OF-MATERIALS.md) · Next: [`04-FIRMWARE-SPEC.md`](./04-FIRMWARE-SPEC.md)*
