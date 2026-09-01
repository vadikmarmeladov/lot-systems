# SESSION REPORT — LOT® Computer, Planning Lock v1
## Date: 2026-09-01 · Branch: claude/brave-lamport-0884et
### Session Type: Hardware Product Specification (Plan → BOM → Roadmap → Firmware → Software Bridge → Manual)

---

```
╔══════════════════════════════════════════════════════════════════╗
║  LOT SYSTEMS CORPORATION — HARDWARE SESSION REPORT               ║
║  LOT® Computer — Planning Lock v1.0                              ║
║  September 1, 2026                                               ║
║  Authorized: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA      ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 1. SESSION CONTEXT

**Brief:** build a hardware computer connected to the LOT site — from
plan, to a components buying list with links, to a roadmap. A 19-point
logic list specified the object precisely: PCBWay-manufactured, a
pager-like AI notification device, a two-part stainless-steel body, a
40mm x 40mm x 5mm flat silver square, a camera, LOT API connectivity,
PDF manuals, session compression, separate firmware/software documents,
a wireless charger, a 100-unit pilot run, a weather sensor, off-the-
shelf sensors, a "Copy" button that signals the site's Log tab, one
polished stainless face, one face with camera/screen/button, and a
simple screen for short autonomous notifications ("Coffee time!").

**Prior state entering session:** no existing document specified this
object. Three related but distinct hardware efforts already existed on
record and were read in full before writing anything, to avoid
collision:

- `docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md` — CUBIQ™, a haptic
  motion-only notification cube, screen-less by design.
- `docs/technical/LOT-NODE-0-RIG-SPEC.md` — Node-0, the self-hosted AI
  inference server.
- `docs/benchmark/LOT-MANIFEST.md` row 31 — a prior "COSMO® Cube —
  complete hardware computer design v1.0" effort (branch
  `brave-lamport-t9z5u8`) whose spec document does not survive in this
  checkout, and which per `LOT_ROBOTICS_COSMO.md` belongs to the
  COSMO® robotics/soul-transfer line, not a desk object.

The real, already-shipped surfaces this device plugs into were also
confirmed directly in code rather than assumed: `GET /api/logs` and the
`Log` model behind `src/client/components/Logs.tsx` and
`src/client/queries.ts` (`useLogs`, `useUpdateLog`), and the existing
contextual-prompt trigger surfaces (`ContextualPromptsWidget.tsx`,
`CalendarWidget.tsx`).

---

## 2. WHAT WAS BUILT

**Product name:** LOT® Computer — a thin client of lot-systems.com, not
a general-purpose computer. Distinguished explicitly from CUBIQ (motion,
no screen) and from Node-0 (back-end server, not a peripheral).

### 2a. Master plan
`docs/corporate/LOT-COMPUTER-PLAN-v1.md` — reading log, what the object
is/is not, physical form (two-part CNC stainless, 40x40x5mm, mirror face
= Qi charging face, matte face = screen/camera/button), function
(receive notification, send via Copy button, compress session locally),
manufacturing approach (single-vendor PCBWay for both PCB and CNC metal
— resolves the brief's "PCB Way" line item and the enclosure sourcing in
one relationship), sensors, and the separate-document map.

### 2b. Bill of materials
`docs/hardware/LOT-COMPUTER-BOM.md` — full parts list for the 100-unit
pilot: MCU (ESP32-S3, native camera interface), camera (OV2640),
display (1.54" e-paper, chosen specifically for its zero-standing-power
"last message persists" behavior), weather sensor (BME280), Qi receiver
IC + coil, thin LiPo cell, tactile "Copy" button, RF-window insert, and
manufacturing line items, each with a vendor link (DigiKey, Mouser,
Adafruit, PCBWay, McMaster-Carr search/catalog pages — not fabricated
deep product links) and a rough per-unit cost. Landed cost estimate:
~$64–115/unit at pilot volume, excluding NRE and freight. Four explicit
open sourcing decisions flagged for resolution before PO.

### 2c. Roadmap
`docs/hardware/LOT-COMPUTER-ROADMAP.md` — five gated stages: v0.1 bench
prototype (breadboard, prove the signal loop against the real
`/api/logs` endpoint) → v0.2 first enclosure + PCB Rev A (3D-printed
shell, real PCBA, validate Qi through the shell) → v0.5 stainless DVT
(the highest-risk step: prove WiFi/BLE actually works through a real
stainless shell, via the RF-window mitigation) → v1.0 pilot production
(100 units, full BOM lock, factory function test on every unit before
ship) → v1.1+ field iteration (unscheduled, telemetry-driven).

### 2d. Firmware specification
`docs/hardware/LOT-COMPUTER-FIRMWARE.md` — ESP32-S3/ESP-IDF target, a
five-state machine (PROVISION → IDLE ⇄ NOTIFY/CAPTURE → BUFFER), the LOT
API connector (persistent MQTT-over-TLS subscription for low-latency
push, HTTPS POST for outbound events, per-device token in encrypted
flash), e-paper rendering discipline (text only, no UI), BLE-based
provisioning (no WiFi credentials ever typed on a keyboardless device),
session compression modeled directly on
`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`, OTA with
mandatory rollback-on-failure (no physical port means no field-recovery
path if an update bricks the device), and pogo-pin-only factory
flashing.

### 2e. Software bridge specification
`docs/hardware/LOT-COMPUTER-SOFTWARE-BRIDGE.md` — the design principle
is minimal new surface: one new `Device` table, a small `/api/device/*`
route set following the existing `src/server/routes/api.ts` pattern,
and — critically — the "Copy" button (brief item 16) implemented as a
thin wrapper over the *existing* Log creation path rather than a new
system, so a captured moment appears in the operator's real Log tab with
zero client-side changes to `Logs.tsx`. Notification delivery specified
as an additive publisher over existing trigger sources (Memory Engine
questions, QOS mode changes, contextual prompts) — no behavior change
for any operator without a paired device. Security notes scope device
tokens to write-only Log creation, never read access.

### 2f. Manual
`docs/hardware/LOT-COMPUTER-MANUAL.md`, rendered to
`docs/hardware/LOT-COMPUTER-MANUAL.pdf` via ReportLab (charge, pair, use
COPY, care instructions, a troubleshooting table) — the PDF manual the
brief specifically asked for as an output of the session.

### 2g. Index
`docs/README.md` updated with a new **Hardware** section linking all six
documents above, following the repository's existing documentation-index
convention.

---

## 3. DESIGN DECISIONS WORTH FLAGGING FORWARD

- **RF window is a named, resolved-in-plan risk, not a hidden one.** A
  sealed stainless shell attenuates 2.4GHz radio. The BOM carries a
  dedicated RF-transparent insert as a line item; the roadmap's v0.5
  stainless DVT stage exists specifically to measure whether this
  mitigation is sufficient before committing to the 100-unit PO.
- **The Copy button reuses the Log system exactly, rather than building
  a parallel inbox.** This was a deliberate reading of brief item 16
  ("signal back to the site's Log tab") as literally as possible — the
  existing `Log` model, `Logs.tsx`, and `useLogs`/`useUpdateLog` queries
  needed no modification for this integration to be correct in spec.
- **No local AI inference on the device.** Every AI-adjacent behavior
  (photo captioning, notification content generation) is specified to
  run server-side through the AI engine abstraction already documented
  in `AI-ENGINE-GUIDE.md`. The device's firmware is transport and
  rendering only.

---

## 4. NOT DONE THIS SESSION (BY DESIGN)

No PO was placed, no schematic was captured, no firmware code was
written, and no `/api/device/*` routes were implemented in
`src/server/routes/api.ts`. This session is the planning lock the
roadmap's v0.1 stage depends on — implementation is scoped as the next
session's work, gated by the roadmap already written.

---

## 5. FILES CHANGED

```
docs/corporate/LOT-COMPUTER-PLAN-v1.md               (new)
docs/hardware/LOT-COMPUTER-BOM.md                     (new)
docs/hardware/LOT-COMPUTER-ROADMAP.md                 (new)
docs/hardware/LOT-COMPUTER-FIRMWARE.md                (new)
docs/hardware/LOT-COMPUTER-SOFTWARE-BRIDGE.md         (new)
docs/hardware/LOT-COMPUTER-MANUAL.md                  (new)
docs/hardware/LOT-COMPUTER-MANUAL.pdf                 (new)
docs/README.md                                        (updated — Hardware section)
docs/SESSION_REPORT_2026_09_01_LOT_COMPUTER_v1.md     (this report)
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SESSION REPORT                                              2026-09-01
================================================================================
