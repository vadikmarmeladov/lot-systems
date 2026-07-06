<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Quantum Tile — Firmware Specification

**Document:** LOT-QUANTUM-TILE-FIRMWARE-SPEC.md
**Classification:** Restricted — S-2 Eyes
**Companion to:** `LOT-QUANTUM-TILE-HARDWARE-PLAN.md`, `LOT-QUANTUM-TILE-SOFTWARE-INTEGRATION.md`
**Prepared:** July 6, 2026
**Target MCU:** ESP32-S3

---

## 1. Design Rule

The firmware exists to enforce one promise the whole LOT® brand already makes: *present but never loud* (`LOT-AMBIENT-AI-VISION.md`). Every state below defaults to sleep. Nothing wakes the radio, the camera, or the display unless one of a small, named set of triggers fires. There is no "check for updates every N seconds" background chatter beyond what §6 specifies.

---

## 2. State Machine

```
                    ┌────────────┐
         power on   │    BOOT    │
        ───────────▶│            │
                    └─────┬──────┘
                          │  no stored Wi-Fi/device token
                          ▼
                    ┌────────────┐
                    │ PROVISION  │  camera wakes, scans QR shown in
                    │            │  the LOT OS dashboard pairing screen
                    └─────┬──────┘
                          │  token + Wi-Fi credentials received
                          ▼
                    ┌────────────┐
              ┌────▶│   IDLE     │◀────────────────────────┐
              │     │  (ambient) │                          │
              │     └─────┬──────┘                          │
              │           │                                 │
              │  ┌────────┼─────────┬───────────┬───────────┤
              │  ▼        ▼         ▼           ▼           │
              │ NOTIFY  PRESENCE  ENV_SAMPLE  COPY_ACK       │
              │  │        │         │           │           │
              │  └────────┴─────────┴───────────┴───────────┘
              │           returns to IDLE after each handled event
              │
              ├── CHARGING (entered/exited independently, Qi coil detects field)
              ├── LOW_BATTERY (entered from IDLE below threshold, degrades to text-only)
              └── OTA_UPDATE (entered only from IDLE, on explicit server-signed manifest)
```

### State notes

| State | Wakes | Duration budget | Exit |
|-------|-------|------------------|------|
| BOOT | full system | < 500ms | → PROVISION or IDLE |
| PROVISION | camera + display + radio | user-paced (seconds to minutes) | → IDLE once token stored |
| IDLE | nothing (deep sleep, timer wake only) | indefinite | → any event state on trigger |
| NOTIFY | display only | < 200ms render, then screen holds per TTL | → IDLE |
| PRESENCE | camera (low-res single frame, on-chip inference, frame discarded) | < 300ms | → IDLE |
| ENV_SAMPLE | env sensor only | < 100ms | → IDLE |
| COPY_ACK | radio (single POST) + display (brief confirm glyph) | < 500ms | → IDLE |
| CHARGING | power management only | while on puck | → IDLE on removal |
| LOW_BATTERY | display (text-only fallback) | indefinite | → IDLE on charge |
| OTA_UPDATE | radio + flash write | minutes, dual-bank safe | → BOOT on success, → IDLE on verified-fail (no bricking) |

---

## 3. Camera Discipline (Non-Negotiable)

The camera is a sensor, not a recorder:

1. Every frame is captured into a fixed RAM buffer, processed in-place (QR decode during PROVISION; simple presence/motion delta during PRESENCE), and the buffer is overwritten on the next capture. No frame is ever written to flash. No frame is ever transmitted off-device, in any state, under any firmware build. This rule has no exception path, including debug builds — a debug build that violates it must not ship, full stop.
2. PRESENCE sampling cadence is sparse by default (e.g., once per several minutes) — the goal is "is someone near enough to read a notification," not continuous tracking.

This mirrors the COSMO® ethical framework's hard line: *"No military, surveillance, or law enforcement applications. Ever."* (`LOT_ROBOTICS_COSMO.md`) — applied here at the firmware level, not just the policy level.

---

## 4. Notification Rendering

- Payload from server: `{ text, ttlSeconds }` (see SOFTWARE-INTEGRATION doc §2 for the wire schema).
- Firmware enforces a hard floor between notifications regardless of what the server sends: **minimum 20 minutes between renders.** If a second notification arrives inside that window, it is queued and coalesced — only the newest text is shown when the window opens, never a backlog of missed pager beeps.
- Text render is one line, no icon, no badge count, no "1 new" indicator — consistent with the existing Ambient AI™ widget rule: *"one line, no alarm, exact moment"* (`LOT-AMBIENT-AI-VISION.md`).

---

## 5. Power Budget (Planning Target)

| Mode | Target draw | Notes |
|------|-------------|-------|
| IDLE (deep sleep, memory LCD static) | < 10µA | Memory LCD holds its last image with no refresh power; MCU in deep sleep with RTC timer only |
| ENV_SAMPLE | brief spike, sub-mA·s per sample | Sampled every 10–15 min by default |
| PRESENCE | brief spike, camera dominates | Sampled every few minutes by default; tune against battery test data in Phase 1 |
| NOTIFY render | brief spike, single display refresh | |
| Radio (Wi-Fi TX, any POST) | dominant single-event cost | Batched — see §6 — to minimize radio-on time, which is the single biggest power line item on this class of MCU |

**Target:** multi-day operation between Charging Puck visits under default sampling cadence. This number must be validated against real current-draw measurement in Phase 1 hardware bring-up before it's treated as a spec rather than a target — flagged here so nobody downstream mistakes a plan for a measurement.

---

## 6. Networking & Batching

Radio time is the power budget's biggest lever, so firmware batches aggressively:

- Environment samples and presence events accumulate in the in-RAM session buffer described in the parent plan doc §5 (Session Compression Protocol).
- The radio wakes on: (a) an incoming notification push arriving via the LOT API Connector's event channel, (b) a Copy button press (immediate — this one is never batched, it's a deliberate user action), (c) the periodic session-compression flush (default every 6 hours), or (d) an OTA check (default once per 24 hours, off-peak).
- No polling loop runs faster than the OTA check interval. The notification channel is push (long-lived connection or SSE-style), not polled — full contract in SOFTWARE-INTEGRATION doc §2.

---

## 7. OTA Update

- Signed firmware images only — device firmware verifies a signature against a key baked in at manufacturing before accepting an image.
- Dual-bank flash: new image writes to the inactive bank; device only marks it active and reboots into it after a self-check passes. A failed self-check rolls back to the last-known-good bank automatically. A sealed, non-serviceable, portless object cannot be allowed to brick itself on a bad update.
- Manifest and transport: SOFTWARE-INTEGRATION doc §5.

---

## 8. Open Firmware Questions for Phase 0

1. Exact memory-LCD driver timing budget on ESP32-S3 (needs dev-kit bring-up before the PRESENCE/NOTIFY duration estimates above are trusted).
2. Whether the 5mm height target (parent plan doc §7) forces a bare-panel display driven directly rather than a modular display board — changes this doc's §2 duration numbers if so.
3. Final PRESENCE and ENV_SAMPLE cadence, tuned against real battery data from Phase 1 prototypes, not the placeholder cadence used above.

---

*Invented by Vadik Marmeladov. LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024.*
*Made in the USA · brand.lot-systems.com*
