<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Firmware Specification

**Document 4 of 7 · Hardware Documentation Set**

> Kept separate from the software/API connector document (Doc 5) per the
> brief's instruction #11 — firmware is what runs on the ESP32-S3 itself;
> the connector doc covers how that firmware talks to lot-systems.com.

---

## Platform

- **MCU:** Espressif ESP32-S3 (Wi-Fi + BLE, hardware JPEG, DVP camera
  interface, PSRAM for frame buffering, hardware crypto for TLS)
- **Toolchain:** ESP-IDF (C), or Arduino-ESP32 core for the bench
  prototype phase
- **OTA:** dual-partition (A/B) OTA update, signed images, rollback on
  boot failure

## Firmware Modules

| Module | Responsibility |
|--------|-----------------|
| `boot_pair` | First-boot pairing flow: device generates a short pairing code on its own display, user enters it on lot-systems.com to bind the Cube to their profile (see Doc 05). Device does not activate any sensor or camera until paired. |
| `camera_pipeline` | Drives the camera module, captures on a timer or event trigger, produces a compact digest (not raw frames — see Session Compression below) |
| `display_renderer` | Renders pager-style notifications: single line, fade in, hold, fade out. No icons, no badges — matches the existing Ambient AI™ rule already shipped in the web widgets. |
| `button_copy` | Debounced interrupt handler for the Copy button (see Copy Button below) |
| `sensor_poll` | Periodic BME680 read (temperature, humidity, pressure, gas/VOC) |
| `session_buffer` | Accumulates events between wake and idle; compresses on session close (see Session Compression) |
| `net_client` | Wi-Fi connection manager + TLS client to the LOT API connector (Doc 05); offline queue with retry/backoff |
| `power_mgmt` | Deep-sleep scheduling, wake sources (button, Wi-Fi push, timer), battery/charge state reporting |
| `ota` | Signed OTA update check + apply |

## Notification Channel ("pager-like notification")

The Cube does not poll aggressively — it holds a lightweight persistent
connection (MQTT over TLS, or a long-lived HTTPS stream) to the LOT API,
the same way the existing web client holds an SSE connection for
cross-device sync (`docs/assembly/.../Cross-Device Sync`).

**Message schema (device-received):**

```json
{
  "id": "ntf_8f21",
  "text": "Coffee time!",
  "ttl_seconds": 30,
  "priority": "ambient"
}
```

**Render rule:** on receipt, `display_renderer` shows `text` as a single
centered line, fades in over 300ms, holds for `ttl_seconds`, fades out.
No sound, no LED, no repeat — identical in spirit to the Air Quality and
Toothbrush widget rule already documented: *"one line, no alarm, exact
moment."* The source of these messages (QOS mode changes, Memory Engine
events, scheduled jobs) is the LOT AI backend; the Cube is a dumb, honest
renderer of whatever one-line message it's given.

## Session Compression

A **session** is the interval between the device waking (button press,
notification, or scheduled sensor read) and returning to deep sleep.

Instead of streaming raw sensor/camera data continuously, `session_buffer`
accumulates raw readings locally and, on session close, produces one
compact digest:

- Sensor readings: delta-encoded against the last transmitted value —
  only send a reading if it moved beyond a noise threshold.
- Camera: a single representative frame (or a perceptual hash of it) per
  session, not continuous frames — the Cube observes the room, it does
  not livestream it.
- Button events: raw timestamp + event type (cheap, always sent in full).

This directly mirrors the compression pattern already running server-side
for widget signals (`docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md`):
raw signal in, one compressed record out, sent once per session rather
than continuously. The device-side digest and the server-side Memory
Engine compression are the same idea applied at two ends of the same
pipe.

## Copy Button

1. Press detected, debounced (20ms).
2. `display_renderer` shows a brief local acknowledgment (a single
   checkmark-free line, e.g. a one-line flash of "Copied") — no network
   round-trip required to give the user feedback.
3. `session_buffer` enqueues a `cosmo_cube_copy` event with a timestamp.
4. `net_client` hands the event to the software connector layer (Doc 05),
   which performs the actual `POST /api/logs` call against the paired
   user's session — this is the same endpoint that already backs the Log
   tab (`src/server/routes/api.ts`, `fastify.post('/logs', ...)`).
5. If offline, the event stays in the session buffer and is sent on next
   successful connection — Copy always registers locally first, syncs
   later.

## Firmware Documentation Deliverables

Kept as their own artifacts (per brief #9, separate from this spec):

- **Pin/Schematic Reference** — camera, display, button, sensor, Qi IC
  wiring against the ESP32-S3 pinout
- **Build & Flash Guide** — toolchain setup, `idf.py build/flash`, OTA
  signing key generation
- **Power Budget Spec** — sleep-current, active-current, and expected
  standby/active battery life numbers per Doc 01's success criteria
- **OTA Update Protocol** — image signing, rollback conditions, staged
  rollout across the 100-unit pilot fleet

---

*Previous: [`03-MECHANICAL-DESIGN.md`](./03-MECHANICAL-DESIGN.md) · Next: [`05-SOFTWARE-LOT-API-CONNECTOR.md`](./05-SOFTWARE-LOT-API-CONNECTOR.md)*
