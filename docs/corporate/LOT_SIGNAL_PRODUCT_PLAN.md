<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT SIGNAL — Hardware Companion Device

## Product Plan, Requirements Traceability & Roadmap

**Document:** LOT_SIGNAL_PRODUCT_PLAN.md
**Classification:** Internal — Product Vision + Build Plan
**Prepared:** 2026-07-19
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems
**Related:** COSMO® CIA brief (verbal, 2026-07-19)
**Sibling documents:** see [§8 Document Set](#8-document-set)

---

## 0. What This Is

A small, two-piece stainless-steel hardware device that sits on a desk or clips
to a bag: one polished mirror face, one working face with a camera, a screen,
and a single button. It pairs with a LOT® Systems account over the existing
M2M protocol and does three things:

1. **Receives** short autonomous notifications pushed by the LOT AI
   ("Coffee time!", "Stand up.", "Weather turning — window's closing.")
2. **Senses** ambient conditions (temperature, humidity, pressure, air
   quality) and reports them back as a weather-station-class M2M source.
3. **Logs** — one button press writes a timestamped entry to the user's
   Log tab on lot-systems.com, the same `/api/logs` table the web app
   already writes to.

It is not COSMO® (personal robotics, behavioral soul transfer, $2,500+,
2028–2029). It is not Node-0 (the self-hosted inference rig, $5,600+,
a server). LOT SIGNAL is the smallest possible physical extension of the
LOT platform — a pager, not a robot, not a computer in the CPU sense. This
document folds the earlier "hardware computer" brief into that correct
category so the BOM and firmware plan are honest about what a 4x4cm x 5mm
front plate can actually contain.

---

## 1. Requirements Traceability

Every line from the 2026-07-19 brief, mapped to where it lands in this
document set. Nothing was dropped; several items collapsed into one design
decision because they describe the same part from different angles.

| # | Brief item | Disposition |
|---|-----------|-------------|
| 1 | PCBWay | Fab + assembly + CNC vendor of record. §7, RIG-SPEC §1 |
| 2 | Pager-like notification from an AI-powered site | Core function. §2, SOFTWARE-CONNECTOR §2 |
| 3 | 2-part stainless steel body | Enclosure = front plate + rear shell. RIG-SPEC §2 |
| 4 | Flat silver square 4x4cm x 5mm height | The **front plate** spec exactly — see §2 note on why the rear shell must be deeper. RIG-SPEC §2 |
| 5 | Camera | Rear face module. RIG-SPEC §3 |
| 6 | Use LOT API connector | `/api/logs`, `/api/os/*`, M2M intake. SOFTWARE-CONNECTOR §1 |
| 7 | Result in PDF manuals | `LOT-SIGNAL-Quick-Start-Manual.pdf` — see §8 |
| 8 | Compress the information in each session | On-device + server session compression. FIRMWARE §4, ties to `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` |
| 9 | Firmware documents | `LOT-SIGNAL-FIRMWARE.md` — separate document, §8 |
| 10 | Software to connect with firmware | `LOT-SIGNAL-SOFTWARE-CONNECTOR.md` — separate document, §8 |
| 11 | Separate documents | Enforced — 4 sibling docs instead of one monolith. §8 |
| 12 | Charger | Wireless charging puck, spec'd with the device. RIG-SPEC §4 |
| 13 | 100 units run | Pilot production run costing. RIG-SPEC §6 |
| 14 | Weather sensor | BME280, same telemetry shape as `weather.ts` / M2M weather-station format. RIG-SPEC §3 |
| 15 | AI-grade off-the-shelf sensors | Bosch BME280/BME680 class parts — industrial-grade, not hobbyist knockoffs. RIG-SPEC §3 |
| 16 | "Copy" button → Log tab signal | Single button, single action, `POST /api/logs`. §2, SOFTWARE-CONNECTOR §3 |
| 17 | One side polished stainless steel | Front plate, mirror finish. RIG-SPEC §2 |
| 18 | Other side: camera, screen, button | Rear shell. RIG-SPEC §2–3 |
| 19 | Wireless charging | Qi receiver in rear shell + charging puck. RIG-SPEC §4 |

---

## 2. The Core Loop

This is the entire product in one sequence — everything else in this
document set exists to make this loop real, cheap, and buildable at 100
units.

```
LOT AI (lot-systems.com)                LOT SIGNAL (device)
       │                                        │
       │  M2M push: { type: "nudge",            │
       │    text: "Coffee time!" }              │
       ├──────────────────────────────────────► │
       │      wss://sync.lot-systems.com/m2m     │
       │                                        │  screen shows "Coffee time!"
       │                                        │  for N seconds, then sleeps
       │                                        │
       │                                        │  ● user presses the button
       │                                        │
       │  POST /api/logs                        │
       │    { text: "Coffee time!" — copied }   │
       │ ◄──────────────────────────────────────┤
       │                                        │
  entry appears in                              │
  user's Log tab                                │
  on lot-systems.com                            │
```

The button is deliberately not "acknowledge," "snooze," or "dismiss." It is
**Copy** — it takes whatever is on the screen and writes it into the user's
own record, the same paper-trail logic used everywhere else in the LOT
stack (see `LOT-NODE-0-RIG-SPEC.md` §04, "an action that cannot be seen did
not happen"). The device does not decide anything. It surfaces and it
records. All judgment stays server-side, in the AI that decided to send
the nudge.

Weather-sensor data flows the other direction, on a timer, using the exact
JSON shape already documented in `LOT-TERMINAL-M2M.md` Format 3
(Multi-Sensor Array) — so a LOT SIGNAL unit is, from the server's point of
view, just another S-2-class M2M weather station that also happens to have
a screen and a button.

---

## 3. Why the Physical Spec Reads the Way It Does

The brief's item 4 ("flat silver square 4x4cm x 5mm height") and items 17–18
(polished side / camera+screen+button side) describe the same two-part
enclosure from two angles:

- **Front plate** — the polished stainless-steel face. 4x4cm x 5mm is
  achievable here because this plate carries no electronics: it is a CNC'd
  and mirror-polished cap, laser-etched with the LOT mark, bonded or
  screwed to the rear shell.
- **Rear shell** — carries the camera, the screen, the button, the
  battery, the Qi coil, and the PCB. This cannot physically fit in 5mm
  alongside a battery and a wireless-charging coil. RIG-SPEC §2 sets the
  rear shell at 4x4cm x ~9mm, for a combined device thickness of ~14mm —
  thin enough to sit flat on a desk or clip to a strap, thick enough to
  hold a real 300mAh cell and not need charging twice a day.

Flagging this now, in the plan document, rather than silently padding the
5mm spec in the hardware doc, because a buying list built against a
dimension that can't hold its own battery would fail at first prototype.

---

## 4. Roadmap

```
PHASE 0   DESIGN                                          2 weeks
          Finalize enclosure CAD, PCB schematic, firmware
          state machine. Freeze BOM.

PHASE 1   PROTOTYPE (x5)                                  3–4 weeks
          PCBWay PCB fab + assembly (5 boards). PCBWay CNC
          for 5 stainless shells. Hand-assemble. Bring up
          firmware: screen, camera, button, weather sensor,
          Qi charging, WiFi provisioning.

PHASE 2   FIRMWARE + SOFTWARE CONNECTOR                   3 weeks
          M2M push/pull over WebSocket (hybrid mode, per
          LOT-TERMINAL-SYNC.md). POST /api/logs on button
          press. On-device session compression. OTA update
          path.

PHASE 3   FIELD TEST (x5 units, 2 weeks)                  2 weeks
          Founder + 4 S-2 operators carry prototypes daily.
          Validate: battery life, notification latency,
          Log-tab round-trip, mirror-finish durability.

PHASE 4   DFM PASS                                        2 weeks
          Fold field-test fixes into CAD + schematic v2.
          Lock BOM for volume pricing.

PHASE 5   PILOT RUN — 100 UNITS                            6–8 weeks
          PCBWay PCBA (100 boards) + PCBWay CNC (100 shell
          sets, 200 machined parts). Final assembly, QC,
          firmware flash + burn-in, packaging.

PHASE 6   MANUALS + LAUNCH                                 1 week
          PDF quick-start manual, firmware doc, software
          connector doc — all pushed alongside the 100-unit
          run. Marketplace listing per M2M "Hardware
          Marketplace Protocol."
```

Total: ~18–20 weeks from design freeze to 100 units in hand, run
sequentially. Phases 1 and 2 can overlap once the first prototype board
lands (firmware bring-up doesn't need to wait on all 5 units).

---

## 5. Cost Summary (detail in RIG-SPEC §6)

| Run | Unit qty | Cost/unit (parts+fab) | Total |
|-----|----------|------------------------|-------|
| Prototype | 5 | ≈ $48–$65 | ≈ $240–$325 |
| Pilot | 100 | ≈ $24–$32 | ≈ $2,400–$3,200 |

Volume drops unit cost roughly in half between 5 and 100 units — mostly
PCBA setup-fee amortization and CNC batch pricing on the stainless shells.
Full line-item BOM with supplier links is in `LOT-SIGNAL-RIG-SPEC.md` §5.

---

## 6. Session Compression — Why It's Here, Not Just in Firmware

Item 8 in the brief ("compress the information in each session") is not a
throwaway line — it's the same discipline already built into the LOT
platform's `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`. LOT SIGNAL applies
it twice:

- **On-device**: a "session" is one wake cycle (button press → screen
  render → optional camera frame → sleep). The firmware buffers sensor
  readings for the cycle and ships one compact M2M payload on sleep,
  not a stream per sample. Keeps radio-on time — and battery drain —
  down.
- **Server-side**: each device's session log rolls into the same
  longitudinal Memory Arc used for software users (`0-3mo calibration,
  3-6mo pattern, 6-12mo coherence` per the CQGS mapping), so a LOT
  SIGNAL unit's history compresses the same way a journal does, not as
  a separate raw-telemetry dump.

Full detail in `LOT-SIGNAL-FIRMWARE.md` §4.

---

## 7. Vendor of Record — PCBWay

Item 1 names PCBWay specifically. It covers three of this project's four
fabrication needs from one vendor, which is why it's listed first and
treated as the anchor supplier rather than one option among several:

- **PCB fab** — the rigid-flex or 2-layer board for the rear shell.
- **PCBA (assembly)** — SMT placement of the ESP32-S3, camera connector,
  sensor, charging IC; PCBWay does turnkey assembly at prototype and
  100-unit volumes.
- **CNC machining** — PCBWay's CNC service works in stainless steel and
  can produce both the polished front plate and the rear shell, so the
  metal body doesn't need a second vendor relationship.

https://www.pcbway.com/ — quotes for PCB, PCBA, and CNC are separate
uploads on the same account; see RIG-SPEC §7 for what to upload at each
phase.

---

## 8. Document Set

Per item 11 ("separate documents"), this plan is intentionally the only
narrative document. Everything buildable lives in its own file:

| Document | Contents |
|----------|----------|
| `docs/corporate/LOT_SIGNAL_PRODUCT_PLAN.md` | This file — plan, requirements traceability, roadmap |
| `docs/technical/LOT-SIGNAL-RIG-SPEC.md` | Enclosure, electronics, full BOM with supplier links, 100-unit costing |
| `docs/technical/LOT-SIGNAL-FIRMWARE.md` | Firmware architecture, state machine, session compression, OTA |
| `docs/technical/LOT-SIGNAL-SOFTWARE-CONNECTOR.md` | LOT API connector, M2M sync, `/api/logs` integration, auth |
| `docs/manuals/LOT-SIGNAL-Quick-Start-Manual.pdf` | End-user PDF manual (pairing, charging, button use) |
| `docs/SESSION_REPORT_2026_07_19_HARDWARE_SIGNAL_v1.md` | This session's build record |

---

## 9. What This Is Not (Guardrails)

Carried over from `LOT_ROBOTICS_COSMO.md`'s ethical framework, applied to a
device with a camera and a network connection:

- No image or sensor data is sold or shared with third parties.
- The camera captures on user action or explicit AI-triggered context only
  — no continuous recording, no always-on stream.
- Device pairing requires the same account auth as lot-systems.com. A LOT
  SIGNAL unit with no linked profile does not sync.
- The button's only function is "copy to my own Log." It cannot be
  repurposed server-side to mean anything else without a firmware update
  the user consents to.

---

*Authored by Vadik. LOT SIGNAL — the smallest node in the network.*
*LOT Systems Corporation — Los Angeles, CA — 2026-07-19*
