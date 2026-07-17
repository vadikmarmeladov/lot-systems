<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Manual Outline (source for generated PDFs)

**Document:** COSMO-CUBE-MANUAL-OUTLINE.md
**Classification:** Public — Documentation Reference
**Prepared:** 2026-07-17
**Status:** Outline only. One PDF has been generated from this outline this
session as a v1.0 preview (see session report); it will need a real revision
once Phase 1 hardware exists to photograph/screenshot.

---

Per requirement #7 ("Result in PDF manuals") and #11 ("Separate
documents"), the Cube ships with **two** distinct PDF manuals, not one
combined document — a builder reads one, an end user reads the other, and
neither should have to wade through the other's content.

## Manual A — Assembly & Manufacturing Manual (internal / builder-facing)

1. Safety notes (soldering, battery handling, CNC part deburring)
2. Bill of materials (pulled from `COSMO-CUBE-BOM.md`)
3. PCB bring-up checklist (power-on test, Wi-Fi join test, display test)
4. Shell assembly steps (photos once Phase 3 hardware exists)
5. Firmware flashing procedure (USB-C jig, per-unit serial assignment)
6. Function test checklist (the 5-point test from
   `COSMO-CUBE-MANUFACTURING.md` assembly section)
7. Troubleshooting table (no Wi-Fi join / blank screen / button not
   registering / camera not activating)

## Manual B — User Manual (ships with the device)

1. What COSMO® Cube is, in one paragraph — a pager for LOT
2. Unboxing + first pairing (scan the code shown on the Cube's screen at
   lot-systems.com/pair-device)
3. Placing the Cube (silver face up, on its charging puck)
4. What a notification looks like ("Coffee time!" example) and how long it
   stays lit
5. The Copy button — what pressing it does (creates a Log entry on your
   lot-systems.com Log tab)
6. Charging (wireless puck, USB-C fallback)
7. Privacy: the camera is off by default; how to opt in from both the
   account settings and the device itself (dual-gate, per FIRMWARE-SPEC)
8. Care of the polished stainless steel face (avoid abrasive cleaners)
9. What to do if the light doesn't come on / Wi-Fi drops
10. How to unpair (instant, permanent — from account settings)

## Generation pipeline

Both manuals are generated from these Markdown sources (this file +
referenced companion docs) using the repo's standard PDF generation approach
(same tooling used for `LOT_Corporate_Expense_AI_Subscription_2026-2027.pdf`
at repo root) — Markdown stays the editable source of truth; PDF is a build
artifact, regenerated whenever the underlying spec changes, not hand-edited.

A v1.0 preview PDF (concept + plan overview, not the full illustrated
manuals — those need real hardware photos) has been generated this session:
`docs/hardware/COSMO-CUBE-PREVIEW-v1.0.pdf`.

---

*Full Manual A and Manual B cannot be finalized with real photos/screenshots
until Phase 2/3 hardware exists. This outline is the structure to fill in then.*
