<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Manufacturing (PCBWay route)

## 1. Why one vendor for two service lines

PCBWay runs both a PCB fab/assembly line and a CNC machining line (including
stainless steel), which keeps logistics simple for a first hardware product —
one vendor relationship, two quote forms, parts can potentially ship combined.

| Service | Quote page |
|---------|------------|
| PCB fabrication | [pcbway.com](https://www.pcbway.com/) |
| SMT / turnkey assembly | [pcbway.com/quotesmt.aspx](https://www.pcbway.com/quotesmt.aspx) |
| CNC machining, general | [pcbway.com/rapid-prototyping/cnc-machining](https://www.pcbway.com/rapid-prototyping/cnc-machining/) |
| CNC machining, stainless steel 304 | [pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304](https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/) |

## 2. What to upload, when

**PCB + assembly quote** needs, per PCBWay's own requirements: Gerber files,
a Bill of Materials, a Centroid (placement) file. Assembly options range from
"Turnkey" (PCBWay sources every part) to "Kitted/Consigned" (LOT ships the
parts). For the odd/uncommon parts in `03-BOM.md` (the e-ink display, the Qi
receiver), **Kitted** is the safer choice for DVT/PVT — don't rely on
turnkey sourcing to find a 1.54" round e-ink panel.

**CNC quote** needs a CAD file (STEP preferred) per body half, plus explicit
notes in the quote request for:
- Material: 304 stainless steel
- Finish: **polished** for Side A, **brushed** for Side B — PCBWay's default
  CNC finish is neither; per their own FAQ, complex/custom finishing requests
  may fall outside instant online quoting and require engineer review before
  a final price — budget extra lead time for this, don't assume instant
  pricing covers it.
- Tolerances on the lens/display/button cutouts (Side B) and the gasket groove
  (both halves) — finalized once DVT CAD is locked in Phase 2.

## 3. Batch sizing across phases

| Phase | Quantity | What's ordered |
|-------|----------|------------------|
| Phase 1 (EVT) | 0 custom parts | Off-the-shelf dev boards + 3D-printed shell only — no PCBWay order yet |
| Phase 2 (DVT) | 5 PCBs + 5 CNC body sets | First real quotes, first real lead-time data |
| Phase 3 (PVT) | 100 PCBs + 100 CNC body sets | The brief's "100 units run" (item 13) |

Unit price on both PCB and CNC drops meaningfully from 5→100 units — get the
100-unit quote in parallel with the 5-unit DVT quote (PCBWay's instant-quote
tools support multiple quantities on the same CAD upload) so Phase 3 budget
is known before Phase 2 finishes, not discovered afterward.

## 4. Assembly sequence (per unit)

1. Reflow/place custom PCB (done by PCBWay under the SMT order).
2. Solder/connect flying leads: battery JST, Qi coil, e-ink FPC if not
   board-mounted.
3. Seat PCB assembly into Side B (front) body half — camera lens aligned to
   its cutout, display aligned to its window, button cap seated over the
   tactile switch.
4. Lay gasket into the mating groove.
5. Close with Side A (back) body half, polished face out.
6. Insert and torque 4× hex screws (torque spec TBD once fastener size is
   final — do not over-torque into the stainless housing threads).
7. Power-on self-test (§5).
8. Apply peel-off protective film to the polished face before packaging —
   called out explicitly because a scratched mirror-polish face is very hard
   to fix after the fact (see risk register in `02-ROADMAP.md`).

## 5. QA checklist (every unit, Phase 3)

- [ ] Continuity/power-on: device boots, e-ink draws a test pattern
- [ ] WiFi association succeeds against a test network
- [ ] Camera captures a still, shutter LED fires
- [ ] Button press registers (both short-press Copy and long-press Camera
      gestures)
- [ ] BME280 returns a plausible temp/humidity reading (sanity range check,
      not calibration-grade verification)
- [ ] Qi charging: device draws charge current when placed on a reference
      dock
- [ ] Gasket seated correctly, no visible gap between Side A/B
- [ ] Polished face free of visible scratches before film applied

## 6. Compliance (do not skip before Phase 4 sale)

- **Radio (2.4GHz WiFi/BLE):** FCC (US) / CE (EU) certification required to
  sell a radio-emitting device. Using a pre-certified module (many ESP32-S3
  modules carry modular FCC/CE approval already) can inherit that approval for
  the radio portion — confirm the specific module's certification status
  before relying on this.
- **Wireless charging (Qi):** Qi certification is a separate program from the
  radio certification above; using an already Qi-certified receiver/
  transmitter reference design is the fast path.
- **Battery shipping (LiPo):** UN38.3 test report required from the cell
  supplier for shipping units by air — factor supplier selection in
  `03-BOM.md` accordingly, don't discover this requirement at ship time.

None of the above blocks Phase 1–2 (bench/prototype work), but all three
should be closed out before Phase 4 launch to any external recipient.
