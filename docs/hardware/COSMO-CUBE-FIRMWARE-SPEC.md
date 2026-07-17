<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Firmware Specification

**Document:** COSMO-CUBE-FIRMWARE-SPEC.md
**Classification:** Public — Engineering Reference
**Prepared:** 2026-07-17
**Status:** SPEC — no firmware written yet. This is the target architecture for Phase 1.

---

## Target platform

- **MCU:** ESP32-S3 (on the Seeed XIAO ESP32S3 Sense module)
- **Toolchain:** Arduino-ESP32 core or ESP-IDF directly. Recommend
  Arduino-ESP32 for Phase 1 (faster iteration, huge library support for
  GC9A01/BME680/camera), migrate hot paths to ESP-IDF later only if power
  budget demands it.
- **Language:** C++ (firmware), with a small amount of Python (`esptool.py` /
  `mpremote`-class tooling) for flashing scripts, not runtime firmware.

## State machine

```
        ┌─────────────┐
        │   BOOT       │  power-on / wake from deep sleep
        └──────┬───────┘
               │
        ┌──────▼───────┐
        │  WIFI_CONNECT │  join stored SSID, timeout 15s → PAIRING if it fails
        └──────┬───────┘
               │ success
        ┌──────▼───────┐
        │   IDLE        │  screen OFF, poll /api/device/notify every 30s,
        │               │  BME680 sample every 5 min, camera OFF
        └──────┬───────┘
               │ new notification received
        ┌──────▼───────┐
        │  NOTIFY       │  screen ON, render message, backlight timer starts
        └──────┬───────┘
               │ button press           │ timeout (default 20s)
        ┌──────▼───────┐         ┌──────▼───────┐
        │  COPY_SENT    │         │   IDLE        │
        │  (POST ack,   │         │  (screen off) │
        │  screen pulse)│         └───────────────┘
        └──────┬───────┘
               │
               ▼  back to IDLE
```

```
        ┌─────────────┐
        │   PAIRING     │  no known Wi-Fi / no known device token
        │               │  → BLE or SoftAP provisioning mode
        │               │  (see SOFTWARE-INTEGRATION doc, pairing flow)
        └───────────────┘
```

## Modules

| Module | Responsibility |
|---|---|
| `net/wifi.cpp` | Wi-Fi connect, reconnect backoff, RSSI reporting |
| `net/lot_client.cpp` | HTTPS client for `/api/device/*` — poll + POST, device-token auth header |
| `ui/display.cpp` | GC9A01 driver wrapper, message render, dim/backlight timer, idle "silver plate" state (screen fully off, not just black — see note below) |
| `sensors/bme680.cpp` | Periodic env sample (temp/humidity/pressure/gas), local threshold check (e.g., "stuffy room" → optional local-only notice) |
| `sensors/camera.cpp` | OV2640 capture, off by default, only active on explicit LOT-side request (privacy — see below) |
| `input/button.cpp` | Debounced button read, short-press = Copy, long-press (5s) = re-enter pairing mode |
| `power/charge.cpp` | Battery ADC read, Qi charge-detect pin, low-battery UI state |
| `ota/updater.cpp` | Signed OTA update pull, staged rollback on boot failure (see OTA section) |

## Display idle state — the "silver plate" behavior

When idle, the display does not merely go black — it powers off entirely
(backlight + panel), so the bottom shell face reads as inert metal/plastic,
not a lit rectangle. This matters for requirement #4/#17 (the top being a
"flat silver square" object on a desk): the device should visually disappear
between notifications, not glow.

## Notification payload

Firmware polls (or holds an SSE connection to, if the LOT backend supports
it — see SOFTWARE-INTEGRATION doc) a single endpoint and expects:

```json
{
  "hasNotification": true,
  "id": "ntf_8f2a...",
  "text": "Coffee time!",
  "ttlSeconds": 20
}
```

Rendering constraint: **one line, max ~24 characters at the chosen font
size** on a 240x240 round display — the LOT backend is responsible for
truncating/summarizing before it ever reaches the device (see
SOFTWARE-INTEGRATION doc, compression note). Firmware does not word-wrap;
it renders what it's given, centered, and truncates defensively with an
ellipsis if the string is too long regardless.

## Camera privacy default

The camera ships **disabled in firmware** (capture path compiled in but
gated behind a device-side setting that defaults to `false`). It only
activates if:
1. The paired LOT account has explicitly opted in (server-side flag,
   checked at each poll), AND
2. The device-side setting has also been toggled (physical/local
   confirmation — e.g. hold button 10s to enable).

Both must be true. Neither side can unilaterally turn it on. This mirrors
the "human gate on irreversible/sensitive actions" doctrine already used
elsewhere in this repo (see `LOT-NODE-0-RIG-SPEC.md`, transparency layer).

## Weather sensor use

BME680 readings are local-first: firmware can show a local air-quality glyph
on request, but the primary use is **uploading periodic samples to LOT**
(via `/api/device/telemetry`, see SOFTWARE-INTEGRATION doc) so the
Quantum Intent Engine can factor real desk-side environment data into its
notification decisions — e.g. "Get some air" when local air quality drops
this is closer to what requirement #14/#15 implies ("AI grade off-the-shelf
sensors") than a decorative weather-station display on the device itself.

## OTA updates

- Firmware version + a signed manifest URL checked once per day (configurable).
- Standard A/B partition scheme on ESP32-S3: new image written to the
  inactive partition, boot flag flipped, device reboots. If the new image
  fails a self-check (Wi-Fi connect + one successful `/api/device/notify`
  poll within 60s of boot), firmware automatically rolls back to the
  previous partition. No bricked units from a bad OTA push.

## Power budget (rough, Phase 1 target)

| State | Draw (approx) | Notes |
|---|---|---|
| Deep idle (Wi-Fi light-sleep, screen off) | ~15–25 mA | ESP32-S3 modem-sleep between polls |
| Notify (screen on) | ~60–90 mA | GC9A01 backlight + panel active |
| Camera capture burst | ~150–200 mA | Brief, only when explicitly triggered |
| Charging (Qi) | N/A (external) | 5V/1A typical Qi receiver output |

With a 400mAh cell and mostly-idle usage between notifications, multi-day
runtime is the target; exact number depends on notification frequency and
needs measurement once Phase 1 hardware exists — do not publish a runtime
claim to users until measured.

---

*This is a target spec for Phase 1 implementation, not a description of
firmware that currently exists. No code has been written against this spec yet.*
