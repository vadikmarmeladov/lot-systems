<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-FIRMWARE
TITLE:    COSMO® Cube — Firmware Specification v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-02
VERSION:  1.0
COMPANIONS: docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md (physical spec),
            docs/technical/LOT-COSMO-CUBE-SOFTWARE.md (server-side connector)
================================================================================

Kept SEPARATE from the software/connector document per brief item 11 —
firmware is what runs ON the device (ESP32-S3); the connector document
covers what runs on lot-systems.com and the wire protocol between them.

--------------------------------------------------------------------------------
01 // FIRMWARE ARCHITECTURE
--------------------------------------------------------------------------------

    ┌─────────────────────────────────────────────────────────────┐
    │  COSMO® CUBE FIRMWARE (ESP32-S3, Arduino/ESP-IDF)            │
    │                                                               │
    │  BOOT                                                        │
    │   ├─ Load pairing token from NVS (non-volatile storage)      │
    │   ├─ Connect Wi-Fi (stored credentials)                      │
    │   └─ Open persistent WebSocket to lot-systems.com             │
    │                                                               │
    │  MAIN LOOP (event-driven, deep-sleep between events)         │
    │   ├─ NOTIFICATION HANDLER   <- WebSocket push from server     │
    │   │    renders text to screen, holds until replaced or        │
    │   │    COPY-acknowledged                                     │
    │   ├─ BUTTON HANDLER         <- physical COPY press (IRQ)      │
    │   │    posts Copy-signal event, plays local confirm blink     │
    │   ├─ WEATHER POLL           <- timer, every 5 min             │
    │   │    reads BME280 (temp/humidity/pressure), buffers,        │
    │   │    batches upload every 30 min (radio duty-cycle          │
    │   │    discipline — see Section 03)                           │
    │   ├─ CAMERA CAPTURE         <- on-demand only, server-         │
    │   │    triggered ("show me the room") or local long-press     │
    │   │    of COPY (v1 does not auto-capture on a timer — no      │
    │   │    passive surveillance loop, matches the anti-feed       │
    │   │    posture named across the LOT corpus)                   │
    │   └─ OTA CHECK              <- timer, every 24h, only over    │
    │        Wi-Fi, only when battery > 30%                         │
    └─────────────────────────────────────────────────────────────┘

--------------------------------------------------------------------------------
02 // NOTIFICATION RENDER (brief items 2, closing paragraph)
--------------------------------------------------------------------------------

  Screen shows exactly one active notification at a time (hardware spec
  Section 04). Firmware behavior:

    - Incoming WebSocket message `{type: "notify", text: "Coffee time!",
      ttl_s: 3600}` replaces whatever is currently displayed.
    - No queueing, no badge count, no unread number. A second
      notification arriving before the first is acknowledged simply
      overwrites it — the device shows the newest thing LOT wants the
      operator to know, not a backlog.
    - `ttl_s` expiry clears the screen to a blank/idle state (plain
      LOT wordmark or clock), not to an error state — an expired
      notification is not a failure.

--------------------------------------------------------------------------------
03 // WEATHER SENSOR LOOP (brief item 14)
--------------------------------------------------------------------------------

  Poll BME280 every 5 minutes; buffer up to 6 readings; upload as one
  batched payload every 30 minutes rather than one radio wake per
  reading. Justification: Wi-Fi TX is the single largest power draw on
  this class of MCU — batching is what makes a ~200mAh cell (BOM
  Section 02) last a useful number of days between wireless charges,
  and 30-minute granularity is more than sufficient for ambient weather.

--------------------------------------------------------------------------------
04 // THE COPY BUTTON (brief item 16)
--------------------------------------------------------------------------------

  SHORT PRESS   Fires `{type: "copy", notification_id, device_id,
                ts}` to the software connector (full payload and
                endpoint in LOT-COSMO-CUBE-SOFTWARE.md Section 02).
                Local confirm: single LED blink or brief screen flash
                — no on-screen text confirmation needed, per hardware
                spec's minimal-UI stance.
  LONG PRESS    (>1.5s) Triggers an on-demand camera capture
                (Section 01) rather than a second Copy signal —
                reserves the device's one physical control for two
                distinct, low-collision gestures rather than adding a
                second button, consistent with the hardware spec's
                single-button industrial design (Section 02).

--------------------------------------------------------------------------------
05 // OTA UPDATE PATH
--------------------------------------------------------------------------------

  Standard ESP32 OTA dual-partition scheme: new firmware image
  downloaded and verified (signature check against a LOT-held signing
  key) into the inactive partition, boot pointer flipped only after a
  successful post-flash self-test (Wi-Fi reconnect, screen draw, sensor
  read). A failed self-test rolls the boot pointer back automatically —
  no unit can be bricked by a bad OTA push, which matters for a 100-unit
  fleet with no local physical access guarantee after distribution.

--------------------------------------------------------------------------------
06 // WHAT v1 FIRMWARE DELIBERATELY DOES NOT DO
--------------------------------------------------------------------------------

  - No on-device ML/vision inference. Captured frames are sent to
    lot-systems.com for interpretation — the device is a sensor and
    display, not an edge-AI node. Keeps the ESP32-S3 firmware small and
    auditable.
  - No local notification history. The device shows the current
    notification only; history lives in the operator's Log tab on
    lot-systems.com, queryable from any device, not fragmented onto
    the Cube's own limited flash.
  - No BLE-only fallback mode in v1. Wi-Fi is assumed available at
    pairing and thereafter; a BLE provisioning-only mode is a
    documented v2+ candidate, not a v1 requirement.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-FIRMWARE
================================================================================
