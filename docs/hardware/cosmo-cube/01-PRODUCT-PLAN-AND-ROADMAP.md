<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Product Plan & Roadmap

**Document 1 of 7 · Hardware Documentation Set**
**Status:** DRAFT — Phase 0 (specification, unbuilt)

---

## What It Is

COSMO® Cube is LOT Systems' first standalone hardware computer: a small,
two-part stainless steel object that sits on a desk, nightstand, or
charging pad, and does three things —

1. **Listens** — a weather/air sensor and a camera give it ambient
   awareness of the room.
2. **Speaks, rarely** — it receives one-line, pager-style notifications
   pushed from the LOT AI running on lot-systems.com ("Coffee time!",
   "Air quality: open a window.").
3. **Remembers, on command** — a single physical button, **Copy**, sends
   a signal straight to the Log tab on lot-systems.com.

It is the physical expression of a rule LOT® already lives by in software
(`docs/corporate/LOT-AMBIENT-AI-VISION.md`): *"Ambient means always
present, never intrusive."* The Cube does not badge, alert, or buzz. It
waits, and when it speaks, the moment was earned.

It is also the first concrete unit toward the **Quantum Cube** described
in the CQGS white paper snapshot (`docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md`)
and the hardware tier referenced in `LOT_ROBOTICS_COSMO.md`'s revenue path
("Phase 3: COSMO® Hardware, 2028–2029, $2,500–$5,000/unit"). This plan pulls
that timeline forward: a 100-unit pilot run, priced and built to reach
real desks, not a slide.

---

## Design Pillars

1. **One line, no alarm, exact moment.** Every notification the Cube shows
   follows the same rule as the Air Quality and Toothbrush widgets already
   shipped in software. No blinking. No sound by default.
2. **Consent is physical.** The camera has a hardware-visible active
   indicator (see Doc 06 §Camera Privacy). A device without a paired,
   consenting LOT profile does not activate — the same rule
   `LOT_ROBOTICS_COSMO.md` sets for COSMO® robotics ("A COSMO® unit without
   a verified LOT profile does not activate") applies here, at the smallest
   possible scale.
3. **The steel is the interface.** No screen full of icons. A blank stainless
   face at rest; a single line of text when it matters; one button.
4. **Session, not stream.** The device does not livestream sensor data. It
   buffers a session, compresses it once, and sends a digest — mirroring the
   Widget → Memory Engine compression loop already running in the LOT
   backend (`docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md`).

---

## Roadmap

| Phase | Name | Scope | Target Duration |
|-------|------|-------|-----------------|
| 0 | Specification | This document set (7 docs). No hardware. | Complete (this session) |
| 1 | Bench Prototype | 2–3 units, off-the-shelf dev boards (ESP32-S3-EYE class) wired to a breadboard weather sensor + Qi module. Validates firmware + LOT API connector end-to-end. Enclosure: 3D-printed shell, not stainless — de-risks electronics before committing to metal tooling. | 3–4 weeks |
| 2 | PCBWay Custom PCB Spin | Purpose-built PCB sized to the 40×40mm footprint; PCBWay prototype fab + SMT assembly, qty 10. First real stainless steel shells (CNC, single unit quotes) fitted to the new PCB. | 4–6 weeks |
| 3 | Alpha (10 units) | Full mechanical + electrical integration: 2-part stainless body, polished bottom face with ceramic charging window, camera + display + Copy button on top. Internal dogfood — S-2's unit is Alpha #1. | 3–4 weeks |
| 4 | Pilot Production Run (100 units) | PCBWay/CNC-partner volume quote at 100pcs, DFM pass, IP-rating pass, FCC/CE pre-scan. See Doc 06. | 8–10 weeks |
| 5 | Usership Hardware Tier | Bundle Cube into the existing $99/mo Usership tier as a hardware add-on, or a new priority tier — the CQGS white paper already prices a "$399/mo priority with Quantum Cube sync" tier; Cube is the first real object behind that number. | Following pilot |

Total spec-to-pilot-in-hand estimate: **~6 months**, sequential, one phase
gating the next — consistent with the repo's own rule of shipping one
feature at a time rather than all at once (`docs/benchmark/LOT-MANIFEST.md`
§06).

---

## Success Criteria (Phase 1–4)

- [ ] Cube receives a pushed notification from lot-systems.com and renders
      it within 2 seconds of the QOS/Memory Engine event firing.
- [ ] Copy button press produces a visible Log tab entry within 3 seconds,
      end to end, over Wi-Fi.
- [ ] Weather/air readings match a reference sensor within stated tolerance
      (see Doc 02 sensor datasheet specs).
- [ ] Full charge (wireless pad) to full battery in under 2 hours; idle
      standby (screen off, notification-poll only) lasts 5+ days.
- [ ] Enclosure survives a 1m drop onto hardwood without shell separation
      (2-part body must not pop open).
- [ ] 100-unit run lands within ±15% of the Doc 06 cost model.

## Risks

| Risk | Mitigation |
|------|------------|
| 5mm total height is extremely aggressive once camera + display + battery + Qi coil are stacked (see Doc 03 §Thickness Stack-Up). | Phase 1–2 prototypes run thicker (10–14mm) to validate electronics; shrink to 5mm is a Phase 3–4 mechanical target, not a Phase 1 blocker. |
| Wireless charging does not pass through solid stainless steel (eddy currents). | Non-conductive ceramic/composite insert window on the charging face — same approach used on stainless Apple Watch models. See Doc 03. |
| Camera on an always-on IoT device raises consent/privacy concerns. | Hardware LED indicator wired directly to the camera power rail (not software-controlled), device inactive without a verified paired profile. See Doc 06 §Camera Privacy. |
| 100-unit stainless CNC run has real NRE and per-unit cost. | Doc 06 gives two sourcing paths (PCBWay CNC service vs. Xometry/Protolabs on-demand quote) with cost comparison before committing. |
| Single-vendor dependency on PCBWay for both PCB and enclosure. | Phase 2 gets parallel quotes from a dedicated CNC house before the 100-unit commitment in Phase 4. |

---

*Next: [`02-BILL-OF-MATERIALS.md`](./02-BILL-OF-MATERIALS.md)*
