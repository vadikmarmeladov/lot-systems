# LOT Assembly Session — LOT® Signal Hardware Genesis

**Date:** 2026-07-25
**Branch:** claude/brave-lamport-98sy15
**S-2:** Vadik Marmeladov
**Scope:** New physical product line — plan, BOM, roadmap, firmware spec, API connector

---

## What Was Asked

S-2 requested a hardware computer connected to the LOT site: a small
stainless-steel, camera-and-screen notification device — pager-like AI
notifications (e.g. "Coffee time!"), a **Copy** button that writes back to
the Log tab on lot-systems.com, wireless charging, an on-board weather
sensor, manufactured via PCBWay in a 100-unit pilot run. The brief listed
19 discrete requirements, from PCB fab partner down to enclosure finish.

## What Was Found in the Repo

The hardware ecosystem already has a name and a design philosophy before
this session started:

- `docs/corporate/LOT-AMBIENT-AI-VISION.md` defines **Ambient AI™** ("one
  line, no alarm, exact moment") and already lists **LOT® Station**
  (weather/air quality) and **LOT® Brush** (connected toothbrush) as
  shipping hardware concepts feeding the same `logs` pipeline every
  software widget uses.
- `docs/technical/LOT-NODE-0-RIG-SPEC.md` set the Terminal Grid house
  style for hardware documents and the "prove small before buying big"
  build-order discipline, reused here.
- `src/server/models/log.ts` and the existing `event` naming convention
  (`emotional_checkin`, `badge_unlock`, etc.) gave a real, grounded shape
  for how a hardware button press becomes a Log tab entry — this is not
  invented plumbing, it is the same table every other feature writes to.
- `docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md` already names a "Quantum
  Cube Hardware" concept as a separate, later-stage (Month 12+) bioelectric
  product — this session's device is distinct from that and does not
  overlap it.

The device is named **LOT® Signal** — it slots into the existing Station /
Brush ecosystem as the third hardware product, and closes the notification
loop those two don't: Station and Brush *report* the room and the routine
inward; Signal *delivers* the Memory Engine's judgment outward and records
whether the person acted on it.

## Documents Produced

```
docs/technical/LOT-SIGNAL-HARDWARE-SPEC.md     Master plan — concept,
                                                mechanical design (2-part
                                                316L stainless body, 40x40mm
                                                footprint), 7-phase roadmap,
                                                cost roll-up to 100 units.

docs/technical/LOT-SIGNAL-BOM.md               Full component buying list —
                                                MCU, camera, display, weather
                                                sensor, IMU, Qi charging,
                                                battery, PCB/PCBA/CNC costs
                                                at prototype (10x) and pilot
                                                (100x) quantities. Ordering
                                                sequence, step by step.

docs/technical/LOT-SIGNAL-FIRMWARE-SPEC.md     Firmware architecture —
                                                ESP32-S3/ESP-IDF module map,
                                                power budget (why a 150mAh
                                                cell lasts ~9-12 days),
                                                camera privacy constraint
                                                enforced at the driver level,
                                                notification render pipeline,
                                                pairing flow, OTA policy.

docs/technical/LOT-SIGNAL-API-CONNECTOR.md     Backend connector — MQTT-
                                                over-TLS device channel,
                                                pairing, notification push
                                                (server-side compression,
                                                not on-device), Copy-button
                                                acknowledgment writing a
                                                real `logs` row with a new
                                                `hardware_signal_copy`
                                                event type.

docs/corporate/LOT-AMBIENT-AI-VISION.md        MODIFIED — added LOT® Signal
                                                to the Hardware Ecosystem
                                                section and terminology
                                                table alongside Station
                                                and Brush.
```

## Key Design Decisions Worth Flagging

1. **Camera scope is a hard firmware constraint, not a policy promise.**
   `camera_drv` exposes only a QR-scan function and a presence-enum
   function — no code path exists for a captured frame to leave the
   device. This was called out explicitly because "camera" on a personal
   device is the single highest-scrutiny line item in the brief.

2. **All compression happens server-side.** The device never runs
   inference; it receives an already-finished, already-short string and
   renders it. This keeps the firmware auditable and reuses the existing
   Memory Engine compression pattern instead of building a second one
   on-device.

3. **The two-part stainless body's dimensions were reconciled, not just
   repeated.** "4x4cm x 5mm" is specified as the front bezel/cosmetic
   plate only; the rear base carries the deeper electronics/battery
   cavity. Stated as one flat 5mm slab, the two halves plus a battery,
   PCB, and Qi coil would not physically fit — this is flagged in
   §02 of the hardware spec rather than left as a silent contradiction.

4. **Order of manufacturing commitment follows NODE-0 precedent:**
   breadboard (3 units) → PCBWay PCBA prototype (10) → CNC stainless
   prototype (10) → firmware/API bring-up → *then* the 100-unit pilot.
   The 100-unit PCBWay run is Phase 5, not Phase 1 — cheap and reversible
   before expensive and hard to reverse.

## Status

**Phase 0 complete: concept, mechanical envelope, BOM, firmware
architecture, and API connector design are locked on paper.** No
hardware has been built and no firmware code has been written — this
session is a planning and specification pass, per the brief's own framing
("Starting from a plan, to a components buying list, link, and analyze
the roadmap"). Next session's work is Phase 1: order the breadboard parts
listed in `LOT-SIGNAL-BOM.md` §01 and §04.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | 2026-07-25
