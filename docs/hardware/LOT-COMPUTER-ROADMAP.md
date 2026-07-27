<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — ROADMAP
FROM SPEC TO 100-UNIT RUN
================================================================================

DOCUMENT    ROADMAP / LOT-COMPUTER v0.1 (DRAFT)
ISSUE DATE  2026.07.27
PARENT      LOT-COMPUTER-PRODUCT-SPEC.md
STYLE       TERMINAL GRID

================================================================================

## 00  SEQUENCE — BUILD ORDER

```
00   THIS SESSION — plan, BOM, roadmap, firmware spec, software spec (docs only)
01   Server-side scaffolding — device pairing + notification queue + M2M
     extension for the "Copy" write-back (SOFTWARE-SPEC §02). Software before
     hardware exists so the bring-up units have something real to talk to.
02   Bring-up batch — 10 units, V1 PILOT shell (40x40x9mm), off-the-shelf
     modules per BOM §02. Hand-assembled or PCBWay low-qty PCBA.
03   Bring-up gate — firmware + protocol proven on real desks before the
     100-unit order is placed. See §03 below. NEVER SKIP THIS GATE.
04   100-unit production run — PCBWay PCBA + CNC shells at run pricing
     (BOM §04).
05   PDF manuals finalized from the by-then-stable spec/firmware/software
     docs (brief pt.7) and shipped in the box.
06   V2 miniaturization track (5mm shell) begins in parallel with V1 field
     use, not before — see §04 below.
```

Order matters, same discipline as `docs/technical/LOT-NODE-0-RIG-SPEC.md`
§05: the channel the device reports into must exist and be tested before
the first unit leaves the bench, so there is never a batch of hardware with
nothing real to talk to.

================================================================================

## 01  PHASE 0 — PLANNING (THIS SESSION)

```
Deliverable                                          Status
──────────                                            ──────
LOT-COMPUTER-PRODUCT-SPEC.md                           DONE — this session
LOT-COMPUTER-BOM.md                                     DONE — this session
LOT-COMPUTER-ROADMAP.md (this file)                     DONE — this session
LOT-COMPUTER-FIRMWARE-SPEC.md                            DONE — this session
LOT-COMPUTER-SOFTWARE-SPEC.md                             DONE — this session
PDF manual export                                        DONE — this session
Session report (compressed)                               DONE — this session
```

No components ordered, no PCB fabricated, no code written against production
in this phase — planning only, per the scheduled-task scope. Phase 1 is the
first phase that touches the live LOT API surface.

================================================================================

## 02  PHASE 1 — SERVER-SIDE SCAFFOLDING

```
Task                                                  Owns
────                                                  ────
Device pairing endpoint (device_id + operator token)   SOFTWARE-SPEC §02.1
Notification queue table + push-to-device endpoint      SOFTWARE-SPEC §02.2
"Copy" write-back endpoint → Log model                   SOFTWARE-SPEC §02.3
M2M sensor-intake extension (reuses existing M2M shape) SOFTWARE-SPEC §02.4
Admin test harness (simulate a device with curl/Postman) SOFTWARE-SPEC §03
```

Exit criterion: a curl script can (a) register a fake device, (b) push
"Coffee time!" to it and read it back, (c) POST a fake Copy-button event and
see a Log entry appear in a test account — all before any physical unit
exists.

================================================================================

## 03  PHASE 2 — BRING-UP BATCH (10 UNITS) → GATE → 100-UNIT RUN

### Bring-up (10 units)

```
Order PCB (PCBWay proto), CNC shells x20 (2/unit), components per BOM §03
Hand-populate or low-qty PCBA
Flash FIRMWARE-SPEC.md v1 firmware
Pair each unit against the Phase-1 server scaffolding
Run on a real desk for >=7 consecutive days per unit
```

### Gate — DO NOT SKIP

```
[ ] Qi charge cycle survives >=200 cycles on a sample unit (accelerated test)
[ ] Notification round-trip (site → screen) latency <5s, measured, 20 pushes
[ ] "Copy" button write-back appears in Log tab within 5s, 20/20 presses
[ ] BME280 telemetry matches a reference thermometer/hygrometer within spec
[ ] Battery lasts >=48h between Qi charges under normal notification cadence
[ ] Enclosure gasket passes a light-splash test, no ingress
[ ] Zero units in bring-up batch bricked by an OTA update test
```

Only once every box above is checked does the 100-unit PCBWay order go out.
A failed gate is not a delay — it is the gate doing its job.

### 100-unit run

```
Place PCBWay PCBA + CNC order at BOM §04 run pricing
QC jig: every unit flashed, paired, and given one live notification +
        one Copy-button test before packaging
Package with printed quick-start card + link to full PDF manual
```

================================================================================

## 04  PHASE 3 — V2 MINIATURIZATION (5MM TARGET)

Begins only after Phase 2's field data exists (real battery life, real
thermal behavior, real firmware stability). Substitutes the parts flagged
"V2" in BOM §02 (bare-die MCU package, flexible OLED, thin-film battery,
lensless camera). Treated as a separate hardware revision, not a silent
swap — a V1 unit and a V2 unit must both report `hw_rev` in their M2M
payload so server-side analytics can tell them apart.

================================================================================

## 05  PDF MANUALS (BRIEF PT.7) — STANDING PRACTICE

Each phase above regenerates the PDF manual set from the then-current
markdown specs, not written fresh by hand:

```
Manual                              Source markdown
───────                             ────────────────
Build & Buying Manual (this session) PRODUCT-SPEC.md + BOM.md + ROADMAP.md
Firmware Manual (Phase 1+)            FIRMWARE-SPEC.md
Software / API Manual (Phase 1+)      SOFTWARE-SPEC.md
User Quick-Start Card (Phase 2+)      New, once UX is field-tested
```

Keeping the PDFs derived from markdown (not maintained separately) is the
same "single source of truth" discipline the rest of this repo already uses
for wiki/field-manual generation — see `docs/wiki/` and `docs/technical/
LOT-FIELD-MANUAL-v53-SNAPSHOT.md` for the existing precedent.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF ROADMAP — DRAFT v0.1                                         2026.07.27
================================================================================
