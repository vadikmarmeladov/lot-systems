<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — FIRMWARE SPECIFICATION
(SEPARATE DOCUMENT, PER BRIEF PT.9/11)
================================================================================

DOCUMENT    FIRMWARE-SPEC / LOT-COMPUTER v0.1 (DRAFT)
ISSUE DATE  2026.07.27
PARENT      LOT-COMPUTER-PRODUCT-SPEC.md
COUNTERPART LOT-COMPUTER-SOFTWARE-SPEC.md (server side of the same link)
STYLE       TERMINAL GRID

================================================================================

## 00  SCOPE

Everything that runs ON the device, in flash, below the LOT API. This
document ends where SOFTWARE-SPEC.md begins: the boundary is the HTTPS
request the device makes outward and the response it parses.

================================================================================

## 01  PLATFORM

```
MCU              ESP32-S3-WROOM-1 (BOM §02.1)
Toolchain         ESP-IDF (FreeRTOS underneath) — not Arduino framework,
                  for direct camera DVP driver access and finer power control
Language          C, with a thin C++ wrapper only where ESP-IDF drivers
                  require it (camera driver, display driver)
Update mechanism   OTA via ESP-IDF's native OTA partitions, pulled from a
                  LOT API endpoint (SOFTWARE-SPEC §02.5), never pushed blind
```

================================================================================

## 02  SUBSYSTEMS

### 02.1  CAMERA (BME280 sibling: OV2640, BOM §02.3)

- Native ESP32-S3 DVP interface, no companion capture chip.
- v1 scope is intentionally narrow: capture-on-demand only, triggered by
  server request or local Copy-button press — NOT continuous streaming.
  No local storage of images beyond a single in-RAM frame buffer; nothing
  written to flash. This keeps the privacy surface small until a real
  feature (presence detection, gesture) is designed and reviewed.
- Future (not v1): local presence/motion heuristic to auto-wake the
  display, computed on-device, image discarded immediately after.

### 02.2  DISPLAY

- SPI-driven OLED (BOM §02.4), single-purpose: render one line of text,
  center-aligned, auto-sized to fit the notification string.
- Idle state: display OFF. Side A (polished steel) is the resting state
  of the object — the display only lights when a notification arrives or
  the Copy button is pressed (to show what was just copied, 2s confirm).
- No local UI, no menus, no settings on-device — all configuration lives
  server-side, consistent with LOT's "zero-configuration intelligence"
  principle (`docs/technical/LOT_SYSTEMS_BRIEF.md`).

### 02.3  SENSOR LOOP (BME280, BOM §02.5)

```
Every 5 minutes (matches LOT-TERMINAL-SYNC.md batch-mode default):
  read BME280 (temp, humidity, pressure)
  hold last 3 readings in RAM
  on WiFi availability → flush as one M2M-shaped POST (SOFTWARE-SPEC §02.4)
  on WiFi unavailable → queue locally (ring buffer, 24h depth), retry
```

Reporting cadence intentionally mirrors the existing "Batch Mode" default
already specified in `docs/corporate/LOT-TERMINAL-SYNC.md` §"Sync Modes" —
no new cadence invented for this device.

### 02.4  INPUT — THE "COPY" BUTTON

```
Debounce: 40ms hardware + software double-check
Short press (<600ms)  → fire Copy event: {last_shown_text, timestamp}
Long press (>=3s)      → local-only: re-enter WiFi provisioning mode
                        (does NOT touch server state — safety valve for a
                        unit that's lost its network, not a data action)
```

Only one gesture is meaningful in v1 (short press = Copy). The long-press
provisioning fallback exists so a unit is never bricked by a WiFi change,
without adding a second server-facing action to reason about at launch.

### 02.5  WIRELESS CHARGING (BQ51013B, BOM §02.6)

- Firmware reads charge status via I2C from the BQ51013B where exposed,
  purely for local low-battery display behavior (dim/blank display below
  10% rather than risk a brownout mid-write).
- No charge-state telemetry is sent to the server in v1 — out of scope
  until there's a product reason to track it (e.g. a "charger placement"
  UX problem shows up in the field).

### 02.6  POWER STATES

```
ACTIVE     WiFi radio on, display possibly lit         — seconds, on event
IDLE       WiFi radio duty-cycled, display off, sensor
           loop still runs on its 5-minute timer         — default state
DEEP SLEEP  Battery critical, all radios/sensors off,
           wakes only on Qi charge detect                — battery <5%
```

================================================================================

## 03  DEVICE IDENTITY & AUTH

```
device_id     assigned at first pairing (SOFTWARE-SPEC §02.1), stored in
              NVS (non-volatile storage), never regenerated on reboot
device_token   short-lived bearer token, refreshed automatically before
              expiry, same JWT-based shape as the rest of the LOT API
              (docs/technical/LOT_SYSTEMS_BRIEF.md "Authentication")
```

Firmware never embeds a long-lived secret in flash beyond the initial
pairing credential — matches the existing LOT-TERMINAL-SYNC.md security
posture ("automatic token rotation").

================================================================================

## 04  OUT OF SCOPE FOR V1 FIRMWARE

Explicitly deferred, so scope creep doesn't quietly re-enter mid-build:

- On-device gesture/presence recognition from the camera
- Any local display of more than one line of text
- Multi-device mesh or device-to-device communication
- Firmware-side notification history/log (server is the source of truth)
- Any audio (no speaker in v1 BOM)

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF FIRMWARE SPECIFICATION — DRAFT v0.1                          2026.07.27
================================================================================
