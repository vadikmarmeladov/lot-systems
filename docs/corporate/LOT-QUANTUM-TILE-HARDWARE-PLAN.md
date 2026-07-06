<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Quantum Tile — Hardware Computer Master Plan

**Document:** LOT-QUANTUM-TILE-HARDWARE-PLAN.md
**Classification:** Restricted — S-2 Eyes / Product Vision
**Prepared:** July 6, 2026
**Inventor:** Vadik Marmeladov, Founder & CEO, LOT Systems · COSMO® CIA
**Division:** COSMO® Hardware — first physical SKU
**Codename lineage:** Supersedes the placeholder "Quantum Cube" hardware slot (docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md, Section VI — previously PLANNED, Month 12+)

---

## 0. What This Is

Nineteen directives came in from S-2 describing a hardware object. This document turns them into one buildable product, a bill of materials with real sourcing, a firmware and software integration spec (in companion documents), and a manufacturing roadmap to a 100-unit run.

**Name:** LOT® Quantum Tile ("the Tile"). The earlier CQGS placeholder called this hardware slot "Quantum Cube" before any industrial design existed. The directives below specify a flat 4×4cm square, not a cube — the name is corrected here and the correction is logged, not silently overwritten. Internally the COSMO® Hardware division may also refer to this as the **COSMO® Cube** SKU (product-line naming continuity with the COSMO® robotics roadmap); the physical form is a tile.

**One-sentence thesis:** The Tile is Ambient AI™ made physical — a pager-style object that says one honest sentence ("Coffee time.") at the exact right moment, and nothing else, ever.

---

## 1. Directive Traceability Matrix

Every numbered line from the intake is addressed somewhere in this document set. Nothing is dropped silently.

| # | Directive | Where It Lands |
|---|-----------|-----------------|
| 1 | PCB Way | §4 Manufacturing — PCBA partner |
| 2 | Pager-like notification from an AI-powered site | §2 Core Function; SOFTWARE-INTEGRATION doc §2 |
| 3 | 2-part stainless steel body | §3 Industrial Design |
| 4 | Flat silver square, 4×4cm × 5mm height | §3 Industrial Design; §7 Feasibility Notes |
| 5 | Camera | §3.2; FIRMWARE-SPEC doc §3 |
| 6 | Use LOT API connector | SOFTWARE-INTEGRATION doc (full spec) |
| 7 | Result in PDF manuals | §6 Documentation Deliverables |
| 8 | Compress the information in each session | §5 Session Compression Protocol |
| 9 | Firmware documents | FIRMWARE-SPEC doc (full spec) |
| 10 | Software to connect with firmware | SOFTWARE-INTEGRATION doc (full spec) |
| 11 | Separate documents | §8 Document Set (this is the index) |
| 12 | Charger | BOM doc §5; §3.3 |
| 13 | 100 units run | §4 Manufacturing Roadmap |
| 14 | Weather sensor | §3.2; BOM doc §2 |
| 15 | AI-grade off-the-shelf sensors | §3.2; §7 |
| 16 | "Copy" button → Log tab signal | §2.2; SOFTWARE-INTEGRATION doc §4 |
| 17 | One side polished stainless steel | §3.1 |
| 18 | Other side: camera, screen, button | §3.1 |
| 19 | Wireless charger | §3.3; BOM doc §5 |

---

## 2. Core Function

### 2.1 The Notification Loop

The Tile does one thing: it receives a short line of text from the LOT® AI stack (QI-46 / Memory Engine, same pipeline that already writes `weeklyStory` and Story-Reports server-side) and displays it — once, quietly, no sound, no vibration escalation. Pager doctrine, not smartphone doctrine.

```
LOT® OS (server)                         LOT® Quantum Tile (device)
     │                                          │
     ├─ QI-46 detects a moment                  │
     │    (pattern match: e.g. "Coffee time")   │
     │                                          │
     ├─ POST /api/v1/hardware/notify ──────────▶│  (via LOT API Connector,
     │    { deviceId, text, ttl }               │   see SOFTWARE-INTEGRATION doc)
     │                                          │
     │                                    display renders one line
     │                                    no chime · no LED flash
     │                                    screen holds, then clears on TTL
```

Rate-limited to protect the Ambient AI™ principle already codified in `docs/corporate/LOT-AMBIENT-AI-VISION.md`: *"It does not alert. It does not badge. It waits."* Default cap: 1 push per 20 minutes per device, hard-coded in firmware, not server-adjustable per unit — the device itself refuses to be turned into a spam surface.

### 2.2 The "Copy" Button — Return Signal

One physical button on the active face, laser-etched **COPY** (radio-operator acknowledgement language — "message received"). Pressing it does not open a menu or a chat. It fires one signal back:

```
Button press ──▶ POST /api/v1/hardware/copy { deviceId, notifId, ts }
                        │
                        ▼
              models.Log entry created (event type: hardware_copy)
                        │
                        ▼
          Appears in the user's Log tab (src/client/components/Logs.tsx)
          exactly like any other LOT OS log event — same list, same feed.
```

This closes the loop the CQGS doc calls the Calibration Loop: a deliberate input (button press) fused with the passive signal (the notification that prompted it). See SOFTWARE-INTEGRATION doc §4 for the exact payload and Log formatter.

---

## 3. Industrial Design

### 3.1 Form Factor — Two Faces, One Object

| | Spec |
|---|------|
| **Overall shape** | Flat square, 40mm × 40mm, 5mm height (target — see §7 feasibility note on this number) |
| **Body** | Two-part stainless steel shell, precision-milled, press-fit + 4 hidden M1.6 screws |
| **Face A — "Presence" side** | Mirror-polished stainless steel (SUS316L, Ra < 0.1µm). No electronics, no markings. A calm object, face-up — same design language as the LOT® Mirror widget: a surface for reflection, not information. |
| **Face B — "Interface" side** | Recessed camera aperture (sapphire window) · reflective memory-LCD display window (chemically strengthened glass) · single COPY button |
| **Finish** | Face A: mirror polish. Face B: bead-blasted matte satin (glare control around the display) |
| **Color** | Silver (natural stainless, no paint, no anodizing — matches "flat silver square" directive literally) |
| **Reference comparator** | Similar footprint/thickness class to a Tile® Slim tracker or a thick credit card stack — useful for grounding size expectations before CAD is final |

### 3.2 Internal Stack (Face B side, thinnest achievable stack-up)

| Layer | Component | Role |
|-------|-----------|------|
| Optics | Camera module, low-res DVP (OV2640-class, 2MP) | Presence/gesture wake signal + one-time QR pairing scan. **Never streams video off-device.** All inference (presence yes/no, QR decode) happens on-chip; raw frames are discarded in RAM. This is a hard firmware rule, consistent with COSMO® ethics ("no surveillance, ever" — `LOT_ROBOTICS_COSMO.md`). |
| Display | Reflective memory LCD, ~1.2–1.3", monochrome, ultra-low-power, always-on-capable without backlight | Pager-style text rendering. Chosen over color OLED specifically because it draws power only on refresh, not while static — the correct physical expression of "present but never loud." |
| Compute | ESP32-S3 (dual-core, Wi-Fi + BLE, camera DVP interface, vector instructions for on-device inference) | MCU + Wi-Fi radio + BLE provisioning. Off-the-shelf, well-documented, no custom silicon — matches directive 15. |
| Environment | Bosch BME680-class sensor (temperature, humidity, pressure, gas/VOC) | Same signal class as the existing LOT® Station widget (`LOT-AMBIENT-AI-VISION.md` §"LOT® Station") — the Tile absorbs that function into a wearable/desk object instead of a separate box. |
| Power | Qi wireless-charging receiver coil + PMIC, thin-format LiPo cell | See §3.3. |
| Input | One tactile switch under the COPY button, IP-rated membrane | Single input. No touchscreen, no keyboard — pager doctrine. |

### 3.3 Charging

Wireless (Qi) only — **no charge port**. This is a deliberate trade against the 5mm/sealed-enclosure goals:

- No port means no port gasket to fail, no corrosion path, no cable wear — supports weather-sensor use outdoors.
- Included accessory: a **LOT® Charging Puck** — a small Qi base station, flat disk, same silver stainless-adjacent finish language, sits on a desk or nightstand. Detailed in BOM doc §5.
- Trade-off accepted: device cannot be charged while in active use away from the puck. Given the Tile's target battery life (days, not hours — see FIRMWARE-SPEC doc §5 power budget), this is acceptable for a pager-class object.

---

## 4. Manufacturing Roadmap — 100-Unit Run

### 4.1 Partners

| Function | Partner | Why |
|----------|---------|-----|
| PCB fabrication + SMT assembly (PCBA) | **PCBWay** | Directive #1. PCBWay also offers CNC machining and small-batch mechanical assembly under one account — evaluate as single vendor for both PCBA and enclosure quoting before splitting across two shops. |
| Stainless enclosure (CNC) | PCBWay CNC (if quote is competitive) or a dedicated metal shop (Xometry / JLCCNC / RapidDirect) | Two-part SUS316L body, mirror-polish pass on Face A, satin-blast + optical/display window pockets on Face B. |
| Final assembly (100 units) | In-house or PCBWay assembly-plus service | PCBA + enclosure + battery + Qi coil + glass/sapphire windows + screws. |

### 4.2 Phases

| Phase | Units | Weeks | Milestone |
|-------|-------|-------|-----------|
| 0 — DFM | 0 | 1–3 | Schematic capture, 3D CAD of the two-part shell, PCBWay DFM review, ESP32-S3 dev-kit bring-up (camera + memory LCD driver) |
| 1 — Prototype | 5 | 4–8 | Hand-assembled PCBA, CNC or 3D-printed housing, firmware v0.1 (display + button + Copy loop only, no camera/weather yet) |
| 2 — Pilot | 25 | 9–14 | Full sensor stack live, firmware v0.5, LOT API Connector end-to-end, internal dogfood (S-2 + immediate cohort) |
| 3 — Production | 100 | 15–22 | CNC stainless enclosures ×100 (incl. polish pass), PCBWay SMT ×100, firmware v1.0, OTA channel live, PDF manuals finalized, Charging Puck sourced |
| 4 — Rollout | — | 23+ | Bundled into the existing $99/mo Usership hardware kit alongside LOT® Station and LOT® Brush (`LOT-AMBIENT-AI-VISION.md`) |

### 4.3 Cost Rollup (planning-level estimate — confirm against live vendor quotes before committing spend)

| Line | Est. unit cost @ qty 100 | Notes |
|------|--------------------------|-------|
| PCBA (ESP32-S3, sensors, display, camera, coil, passives) | $18–$25 | PCBWay small-batch SMT pricing band |
| Stainless enclosure, 2-part, machined + polished | $35–$55 | Dominated by the mirror-polish pass on Face A; satin Face B is cheaper |
| Battery (thin LiPo) | $2–$4 | |
| Glass/sapphire windows + screws + gasket | $3–$6 | |
| **Per-unit BOM subtotal** | **≈ $58–$90** | Detailed line items: BOM doc |
| Charging Puck accessory (per unit, if bundled) | $8–$15 | |
| One-time NRE (CNC programming, 2 fixtures, DFM iteration) | $3,000–$6,000 total | Amortized across the 100-unit run this is $30–$60/unit on the first batch only |

These numbers are deliberately presented as a range with the estimation basis stated, not a false-precision single figure — get real PCBWay + CNC-shop quotes before Phase 3 commits.

---

## 5. Session Compression Protocol

Directive #8: compress the information in each session. The Memory Engine already does this server-side — the Sunday `lot_ai_story` job aggregates 7 days of logs into a compressed story text (`docs/benchmark/LOT-MANIFEST.md` §06, Routine 1). The Tile applies the same pattern at the edge, one level down:

1. Each wake cycle (notification shown, presence detected, Copy pressed, weather sample taken) is appended to an in-RAM ring buffer, not flash-logged individually.
2. On a fixed interval (default: every 6 hours, or on 80% buffer fill) the firmware compresses the buffer into one compact JSON session summary — counts and deltas, not raw event streams — and POSTs it once via the LOT API Connector.
3. The server-side Log model receives one compressed session record instead of dozens of micro-events, keeping the user's Log tab readable and keeping device flash-write cycles low (extends battery-adjacent flash lifespan on a sealed, non-serviceable object).

Full wire format: SOFTWARE-INTEGRATION doc §3.

---

## 6. Documentation Deliverables (PDF Manuals)

Directive #7. Four manuals, generated from Markdown source using the same MD→PDF pipeline already proven in this repo for the Badge Codex (`scripts/generate_badge_codex_pdf_v13.py` and successors, output examples in `docs/badges/pdf/`):

| Manual | Audience | Source doc (to author in Phase 3) |
|--------|----------|-------------------------------------|
| Quick Start Guide | End user, in-box | `docs/corporate/pdf-source/LOT-QUANTUM-TILE-QUICKSTART.md` |
| User Manual | End user, full reference | Derived from this plan + FIRMWARE-SPEC user-facing sections |
| Compliance & Safety Manual | Regulatory (FCC/CE, battery, RF) | New — required before any production run ships; not yet drafted |
| Firmware & API Developer Reference | Internal / future partners | Direct export of FIRMWARE-SPEC + SOFTWARE-INTEGRATION docs |

No manual is generated in this session — the pipeline and file plan are locked here so Phase 3 has zero ambiguity about where output goes.

---

## 7. Feasibility Notes (Read Before Committing to CAD)

Honest accounting, in the spirit of the CQGS "Honest COGS" doctrine — surplus above the real number is coherence, not spin:

1. **5mm total height is the hardest constraint in this brief.** Camera module + memory LCD + ESP32-S3 + BME680 + Qi coil + battery, all stacked, realistically land closer to 8–10mm in a first CNC prototype using off-the-shelf modules. Hitting 5mm requires a custom rigid-flex PCB, a bare display panel (not a module with its own PCB), and a bare camera sensor on flex — each of which raises NRE and lowers the "off-the-shelf" property that keeps directive #15 true. **Recommendation:** ship Phase 1–3 at 8–10mm as "Quantum Tile v1," treat 5mm as the stated v2 miniaturization target once the sensor stack is proven.
2. **Camera + always-clean ethics.** The camera must never become a surveillance object, or it breaks the entire COSMO® trust thesis in one stroke. Firmware-level rule (§3.2) — no raw frame leaves the device — should be treated as non-negotiable, not an optimization.
3. **No charge port + weather sensor** is a good pairing (sealed enclosure survives condensation/humidity exposure better) but means field battery life must be generous enough that "leave it on the puck" isn't a daily chore. Firmware power budget target: multi-day idle life between charges. Full budget: FIRMWARE-SPEC doc §5.
4. **100-unit run is small-batch, not mass-production pricing.** The per-unit costs in §4.3 will not resemble consumer-electronics COGS the CQGS white paper describes for the Quantum Bread Factory model — that scale arrives only past a few thousand units. Set Usership hardware-kit pricing expectations accordingly.

---

## 8. Document Set (Directive #11 — Separate Documents)

This plan is deliberately split, not bundled into one file:

1. **`LOT-QUANTUM-TILE-HARDWARE-PLAN.md`** — this document. Concept, industrial design, manufacturing roadmap, feasibility.
2. **`LOT-QUANTUM-TILE-BOM.md`** — full bill of materials, component-by-component, with sourcing links and cost basis.
3. **`LOT-QUANTUM-TILE-FIRMWARE-SPEC.md`** — firmware architecture, state machine, power budget, OTA plan.
4. **`LOT-QUANTUM-TILE-SOFTWARE-INTEGRATION.md`** — LOT API Connector contract: pairing, endpoints, payload schemas, Log tab write-back.

All four live in `docs/corporate/`. This session's report is filed separately per standing protocol at `docs/benchmark/LOT-SR-20260706-01.md`.

---

## Trademarks

| Mark | Status | Owner |
|------|--------|-------|
| LOT® | Pending | LOT Systems, Inc. |
| COSMO® | Pending | LOT Systems, Inc. |
| Ambient AI™ | Pending | LOT Systems, Inc. |
| LOT® Quantum Tile | New — filed by this document | LOT Systems, Inc. |

---

*Invented by Vadik Marmeladov. LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024.*
*Made in the USA · brand.lot-systems.com*
