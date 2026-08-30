<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Firmware Documentation (v1.0)

**Parent document:** [`docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md`](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
**Companion document (kept separate per spec):** [`03-SOFTWARE-BRIDGE.md`](./03-SOFTWARE-BRIDGE.md)

This document is firmware-only: what runs on the ESP32-S3 itself. The
server-side bridge that the firmware talks to is specified separately in
`03-SOFTWARE-BRIDGE.md` — the two are intentionally not merged, so either
can be handed to a different engineer (or a different session) without the
other.

---

## 1. Toolchain and framework

- **Framework:** ESP-IDF (native), or Arduino-ESP32 core if faster
  prototyping is preferred for v1.0 — recommendation is ESP-IDF for the
  pilot run given the low-power sleep requirements (Section 4) and OTA
  needs (Section 6), which are more directly exposed there.
- **Language:** C (ESP-IDF) — no RTOS application framework beyond
  FreeRTOS, which ships with ESP-IDF.
- **Build/flash:** `idf.py build flash monitor` over USB-C during
  development; production units are flashed at the assembly stage
  (Section 5 of `04-MANUFACTURING-PCBWAY.md`) via a pogo-pin jig, not a
  user-facing port — v1.0 shell has no external USB opening (Section 02
  of the parent doc lists exactly three front-face elements: camera,
  screen, button).

---

## 2. Boot flow

```
POWER ON (wireless charge contact OR battery has charge)
   │
   ▼
[0] Bootloader → firmware image validation (rollback-safe, Section 6)
   │
   ▼
[1] Peripheral init: I2C (BME280), SPI (display), DVP (camera, powered
    down immediately after self-test), button GPIO (interrupt-armed)
   │
   ▼
[2] First-boot check: is a pairing token stored in NVS?
   │
   ├── NO  → PAIRING MODE (Section 3)
   │
   └── YES → NORMAL MODE (Section 4)
```

---

## 3. Pairing mode (first boot / factory reset)

1. Device generates a 6-character pairing code from its unique serial
   (laser-etched on the rear shell, per the parent doc Section 02) and
   displays it full-screen.
2. Device opens a local Wi-Fi AP (`COSMO-Cube-XXXX`) for the operator's
   phone/laptop to join, OR — v1.0 preferred path — the operator enters
   the device's Wi-Fi credentials via the `lot-systems.com/hardware/pair`
   web flow, which relays them over a short-lived BLE provisioning
   channel (ESP-IDF's `wifi_provisioning` component supports this
   directly, no custom protocol needed).
3. Once Wi-Fi joins and the operator confirms the pairing code
   server-side, the server issues a device-scoped API token (spec in
   `03-SOFTWARE-BRIDGE.md`, Section 2). Firmware stores it in encrypted
   NVS (ESP-IDF NVS encryption, enabled at production flash time) and
   reboots into Normal Mode.

---

## 4. Normal mode — the operating loop

```
LOOP (event-driven, deep-sleep between events):
  │
  ├─ Every 15 min  → wake, read BME280, compress into one telemetry
  │                  record (Section 3 below), POST to
  │                  /api/hardware/telemetry, sleep
  │
  ├─ Long-poll     → maintained connection (or 60s fallback poll) to
  │  (or 60s poll)   GET /api/hardware/notify; on 200, render the one
  │                  line to the display and hold (no sleep) until
  │                  cleared
  │
  ├─ Button: SHORT → "Copy" — POST /api/hardware/copy with the current
  │  press           notice ID (if any), clear display, brief
  │                  confirmation glyph, return to idle/sleep
  │
  ├─ Button: LONG  → power camera, capture one frame, attach as base64
  │  press (2s)      to the same /api/hardware/copy payload (Section 05
  │                  of the parent doc — this is opt-in, checked
  │                  against a local flag set during pairing/settings
  │                  sync)
  │
  └─ Presence scan → (if enabled) every 5 min, power camera briefly,
     (opt-in)         compute a low-res frame-diff score on-device,
                       fold the boolean result into the next telemetry
                       record — the raw frame is discarded immediately,
                       never queued or transmitted
```

**Power posture:** the device spends the overwhelming majority of its
time in deep sleep with only the button GPIO and the RTC timer active as
wake sources. The always-on-capable display (Section 04 of the parent
doc — reflective/transflective or e-paper) is chosen specifically so a
notice can remain visible without keeping the MCU awake.

---

## 5. On-device session compression (brief item 8)

A "session," here, is one wake cycle: sensor read → local processing →
one outbound record. Firmware never queues raw sensor ticks individually.
The compression routine, run entirely on-device before any network call:

```
INPUT (raw, in RAM only):
  - BME280: temp, humidity, pressure (single reading)
  - Presence scan result, if enabled (single boolean + confidence score)
  - Battery gauge reading
  - Wall-clock timestamp (synced via SNTP at boot + daily resync)

COMPRESS:
  - Round temp/humidity/pressure to sensor-rated precision (no
    false-precision floats)
  - Collapse presence scan to boolean + 0-100 confidence
  - Drop anything unchanged since the last transmitted record beyond a
    noise threshold (±0.3°C, ±2% RH, ±1 hPa) — a flat reading does not
    re-transmit, it extends the previous record's validity window
    server-side (handled in `03-SOFTWARE-BRIDGE.md`, Section 3)

OUTPUT (single JSON record, <200 bytes):
  { deviceId, tempC, humidityPct, pressureHpa, presence, confidence,
    batteryPct, ts }
```

This mirrors the platform's existing Memory Engine compression discipline
(`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) — the
principle ("compress to meaning, not raw data points") is the same one
applied here at the hardware edge, before the record ever reaches the
network.

---

## 6. OTA updates

- ESP-IDF's native OTA (`esp_https_ota`) with dual-partition rollback:
  a failed boot after an OTA update automatically reverts to the
  previous known-good image.
- Update check runs once daily (piggybacked on the SNTP resync in
  Section 5), pulling a signed manifest from a server-side OTA endpoint
  specified in `03-SOFTWARE-BRIDGE.md`, Section 4.
- No forced updates — an operator's device applies an update only after
  the current notice (if any) has been cleared, so an OTA never
  interrupts an unread notice.

---

## 7. Watchdog / safety

- Hardware watchdog timer (ESP-IDF `esp_task_wdt`) resets the device if
  the main loop stalls beyond 30s (e.g., a hung network call).
- Camera power rail is gated by a GPIO the firmware only asserts for the
  duration of a capture (presence scan or explicit snapshot) — the
  camera is physically unpowered the rest of the time, which is also
  the honest technical backing for the privacy claim in the parent
  document (Section 04: "raw frames never leave the device").

---

## 8. Test matrix (factory + field)

| Test | Method | Pass criteria |
|---|---|---|
| Boot | Power-on via wireless charge contact | Display shows LOT wordmark within 2s |
| Wi-Fi join | Pairing flow (Section 3) | Joins AP, receives token, reboots to Normal Mode |
| Notify round-trip | Server sends test notice | Displayed within 5s of long-poll delivery |
| Copy round-trip | Button short-press | Log entry visible in operator's Log tab within 5s |
| Weather sensor | Compare against reference thermometer/hygrometer | ±0.5°C, ±3% RH |
| Wireless charge | Place on charging dock | Battery gauge increments within 60s |
| Deep sleep current | Bench multimeter | <50µA between wake events |

This matrix is the factory test referenced in the parent document,
Section 08 (v1.1 gate: "100/100 units pass a five-point factory test").
