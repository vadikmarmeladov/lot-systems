<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Terminal — Firmware Specification

**Document:** LOT-COSMO-TERMINAL-FIRMWARE
**Classification:** RESTRICTED // S-2 EYES
**Companion to:** [LOT-COSMO-TERMINAL-v1.md](./LOT-COSMO-TERMINAL-v1.md), [LOT-COSMO-TERMINAL-BOM.md](./LOT-COSMO-TERMINAL-BOM.md)
**Prepared:** 2026-08-17
**S-2:** Vadik Marmeladov
**Status:** SPEC — no firmware source exists yet; this document defines what v0.1 bench firmware must implement (roadmap Section 11 of the plan doc)

---

## 1. Platform

- **MCU:** ESP32-S3 module (BOM Section 2) — chosen for on-chip Wi-Fi/BLE,
  camera peripheral (DVP/I8080 interface), and enough SRAM to run a
  single-frame vision inference pass without external RAM.
- **Toolchain:** ESP-IDF (open, no vendor lock beyond the silicon itself —
  consistent with LOT Terminal's "zero dependencies" open-source posture,
  docs/corporate/LOT-TERMINAL-VISION.md).
- **RTOS:** FreeRTOS (bundled with ESP-IDF) — two tasks: `signal_task`
  (Wi-Fi/SSE, Section 3) and `ui_task` (screen, button, sensors). No
  general-purpose OS, no filesystem beyond a small NVS partition for
  pairing credentials.

## 2. Boot & pairing

1. First boot (no stored credentials in NVS): device enters PAIRING mode.
   Screen displays a static pairing code (6 characters, generated on-device
   from the MCU's factory-programmed unique ID, not server-assigned).
2. Operator opens lot-systems.com → Settings → "Connect COSMO® Terminal" →
   enters the code (mirrors CUBIQ™'s planned QR/code pairing flow).
3. Server calls `POST /api/device/pair` (spec in
   [LOT-COSMO-TERMINAL-SOFTWARE.md](./LOT-COSMO-TERMINAL-SOFTWARE.md)
   Section 1) — this is gated at Yellow-tier Benchmark+ per the COSMO®
   activation rule (plan doc Section 07).
4. On success, device receives a device token over the same pairing
   channel, stores it in NVS, reboots into NORMAL mode.
5. NORMAL mode: opens the SSE connection (Section 3) using the stored
   token. Any 401 response clears NVS credentials and returns to PAIRING
   mode — a revoked pairing must not leave a device silently retrying
   forever.

## 3. Signal receive (the pager function — requirement #2)

- `signal_task` holds a persistent SSE connection to
  `GET /api/device/notify/stream` (software doc Section 2).
- On message receive: validate payload (≤24 chars, plain text, no control
  characters), hand off to `ui_task` via a FreeRTOS queue.
- **Firmware-enforced rate limit** (plan doc Section 05): a rolling
  counter rejects any message that would exceed 1/15min or 12/day,
  regardless of what the server sends. This is deliberately duplicated
  server-side AND on-device — the device does not trust the network layer
  alone to protect the operator's attention.
- Reconnect policy: exponential backoff (1s → 2s → 4s ... capped at 60s)
  on SSE drop. No message queuing across a reconnect gap — a notification
  missed because the device was offline is not resent late; lateness would
  make "Coffee time." arrive at 2pm, which is worse than not arriving.

## 4. Display driver

- SPI-driven round LCD (BOM Section 4), default state: **power gated off**
  (not just black-filled — the panel's own supply rail is switched, to
  hold the runtime target in plan doc Section 04).
- On message: panel power on, render text (single font, no animation),
  hold 8 seconds, panel power off.
- Text rendering: fixed bitmap font, center-aligned, no line-wrap logic
  needed — the 24-char cap (Section 3) combined with the LOT-STYLE-GUIDE.md
  "one line" convention means every message fits a single row at the
  chosen font size.

## 5. Camera capture (requirement #5 — privacy boundary is firmware-enforced)

- Camera peripheral is powered down by default.
- Wakes only on: (a) Copy button press with no message on screen
  (plan doc Section 06, "check-in" case), or (b) an explicit
  `capture_request` event from the signal stream.
- Capture → single frame into a fixed on-chip buffer → local inference
  pass (presence/ambient-light/scene-class only, no object detection
  requiring cloud round-trip) → buffer is zeroed (not just marked free —
  explicitly overwritten) before the camera is powered back down.
- **No code path exists in this spec that writes a camera frame to NVS,
  to the network, or to any persistent store.** This is the hardware/
  firmware half of the privacy boundary named in the plan doc; it must be
  verifiable by reading `camera_task.c` top to bottom at v0.1, not taken
  on faith.

## 6. Weather sensor loop

- BME280 polled every 10 minutes (not continuously — matches the sensor's
  own recommended low-power sampling interval).
- Each reading queued for the next `POST /api/device/sensor` batch
  (software doc Section 4) — not sent individually; batches every 30
  minutes, consistent with the session-compression principle (plan doc
  Section 08).

## 7. Copy button (requirement #16)

- GPIO interrupt, debounced 50ms in firmware.
- Press handling per plan doc Section 06's two cases (message-on-screen
  vs. blank-screen). Both cases queue one compressed record (Section 8
  below) for the next uplink.
- Button press latency budget: interrupt → screen flash confirmation
  within 100ms, independent of network state — the operator sees
  confirmation even if the uplink to `/api/device/log` is momentarily
  queued behind a reconnect.

## 8. Session compression (requirement #8)

On session close (message shown-and-timed-out, or message shown-and-
Copy-pressed), firmware assembles one compact record:

```
{ msg_id, shown_at, copy_pressed: bool, sensor_snapshot: {temp, humidity, light} }
```

and appends it to an in-RAM ring buffer (capacity: 50 records — enough to
survive a multi-hour Wi-Fi outage). The buffer is flushed as a single
batched POST on reconnect, not record-by-record. This is the firmware
implementation of the plan doc's Section 08 principle: compress on the
edge, mirroring the server-side Memory Engine's own compression cycle.

## 9. OTA updates

- ESP-IDF's native OTA (dual-partition, A/B slot) — a failed update boots
  back to the last-known-good slot automatically. No bricking risk from a
  bad push.
- OTA checked once per 24 hours, applied only when the device is on its
  charging pad (never mid-battery, never during an active notification
  window) — a firmware update should never coincide with a missed
  "Coffee time."

## 10. Power management

- Deep sleep between weather polls and signal-task wake intervals is not
  used for the radio (SSE requires the Wi-Fi radio to stay associated) —
  power budget instead comes from the screen being off by default
  (Section 4) and the camera being off by default (Section 5). These two
  are the dominant power draws when active; keeping them gated is what
  makes the 72-hour runtime target (plan doc Section 04) achievable with
  a 320mAh cell.

---

## What v0.1 firmware does NOT need to implement

Per the roadmap gate (plan doc Section 11), v0.1 bench firmware only needs
Sections 2, 3, and 4 working end-to-end against a real account. Camera
(Section 5), weather batching (Section 6), and OTA (Section 9) are v0.5+
scope — recorded here so the architecture accounts for them from the
start, not bolted on later.

---
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-TERMINAL-FIRMWARE
