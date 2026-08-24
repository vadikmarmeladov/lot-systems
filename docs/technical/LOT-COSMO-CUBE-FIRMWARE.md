================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-FIRMWARE
TITLE:    COSMO® Cube — Firmware Architecture (v1.0)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-24
COMPANION: docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md (hardware spec)
           docs/corporate/LOT-COSMO-CUBE-BOM.md (parts + suppliers)
           docs/technical/LOT-COSMO-CUBE-API-CONNECTOR.md (server-side half)
================================================================================

Kept separate from the hardware spec and the API connector document per
S-2 instruction: this document is what a firmware engineer needs, and
nothing else.

--------------------------------------------------------------------------------
01 // TARGET + TOOLCHAIN
--------------------------------------------------------------------------------

  MCU              ESP32-S3 (see BOM, Section 01)
  FRAMEWORK        ESP-IDF (native camera + SPI display drivers are
                    first-class here; Arduino-core is the fallback for
                    faster prototyping on the reference dev module
                    named in the BOM, not the shipping firmware)
  DISPLAY DRIVER   GC9A01 (SPI), round-frame-buffer aware — text is
                    rendered center-origin, never assuming a rectangular
                    safe area
  CAMERA DRIVER    esp32-camera component (OV2640, QVGA capture for
                    the presence check — Section 03)
  SENSOR DRIVER    Bosch BME680 official driver (I2C) via bme68x
                    library

--------------------------------------------------------------------------------
02 // BOOT + PROVISIONING
--------------------------------------------------------------------------------

  FIRST POWER-ON
    1. Device generates a unique keypair on-chip (ESP32-S3 hardware
       crypto accelerator), device ID derived from the public key.
    2. BLE advertises a provisioning service for 5 minutes.
    3. Operator pairs via the lot-systems.com pairing flow (see
       LOT-COSMO-CUBE-API-CONNECTOR.md Section 02) — Wi-Fi credentials
       and an account-binding token are written over BLE, never over an
       open network.
    4. Device connects to Wi-Fi, exchanges its device-ID + binding token
       for a short-lived session credential from the LOT API.
    5. Screen confirms pairing with a single checkmark, then goes idle.

  SUBSEQUENT BOOTS
    Stored Wi-Fi credentials + refresh token reconnect automatically. No
    BLE re-provisioning unless the operator explicitly unpairs from
    their lot-systems.com account settings.

--------------------------------------------------------------------------------
03 // MAIN LOOP
--------------------------------------------------------------------------------

    ┌─────────────────────────────────────────────────────────────┐
    │  IDLE (screen off, Wi-Fi in power-save, BME680 polled 1/min) │
    └───────────────────────┬─────────────────────────────────────┘
                             │
             notification pushed (Section 04) ──OR── button pressed (Section 05)
                             │
                             ▼
    ┌─────────────────────────────────────────────────────────────┐
    │  ON NOTIFICATION:                                            │
    │    priority == high?  → render immediately                   │
    │    priority == low?   → OV2640 QVGA capture → on-device       │
    │                          presence check (Section 03a) →       │
    │                          render if present, else re-queue     │
    └───────────────────────┬─────────────────────────────────────┘
                             ▼
    ┌─────────────────────────────────────────────────────────────┐
    │  DISPLAY: render text, center-screen, LOT type style          │
    │  (docs/technical/LOT-STYLE-GUIDE.md governs the type choice)  │
    │  Auto-clears after configurable dwell (default 30s) or on     │
    │  Copy press — whichever comes first.                          │
    └─────────────────────────────────────────────────────────────┘

  03a — PRESENCE CHECK (ON-DEVICE ONLY)
    A single QVGA frame is captured, run through a lightweight
    face/motion heuristic entirely on the ESP32-S3, reduced to one
    boolean, and the frame buffer is freed immediately. No frame is ever
    written to flash or transmitted off-device — this is a hard
    invariant tested in QA (Section 06), not a configuration flag.

--------------------------------------------------------------------------------
04 // NOTIFICATION INGEST
--------------------------------------------------------------------------------

  TRANSPORT     Persistent TLS connection to the LOT API notification
                 channel (see LOT-COSMO-CUBE-API-CONNECTOR.md Section 03
                 for the exact endpoint/protocol). Firmware reconnects
                 with exponential backoff on drop; BME680 polling and
                 the idle loop continue uninterrupted during reconnect.

  PAYLOAD        { "text": string (<=40 chars), "priority": "high"|"low",
                   "notificationId": string }
                 Firmware does not interpret or template the text — all
                 message composition happens server-side (see the
                 connector doc). The device is a renderer, not an
                 author.

--------------------------------------------------------------------------------
05 // "COPY" BUTTON HANDLER
--------------------------------------------------------------------------------

  1. GPIO interrupt on button press, 50ms software debounce.
  2. Firmware builds the signed event described in
     LOT-COSMO-CUBE-HARDWARE-v1.md Section 05:
       { deviceId, event: "copy", ts, lastNotificationId? }
  3. POSTs to the LOT API Log endpoint (LOT-COSMO-CUBE-API-CONNECTOR.md
     Section 04). If offline, the event is queued in a small ring buffer
     (16 entries) in NVS and flushed on reconnect — a button press is
     never silently dropped for a transient Wi-Fi blip.
  4. On confirmed write, display shows a checkmark glyph for 800ms.

--------------------------------------------------------------------------------
06 // OTA + QA GATES
--------------------------------------------------------------------------------

  OTA            Signed firmware images, delivered over the same TLS
                  channel as notifications, dual-partition A/B update
                  with automatic rollback if the new image fails to
                  report healthy within 60s of boot.

  v1.0 GATE       Per LOT-COSMO-CUBE-HARDWARE-v1.md Section 06: 100/100
                  units pass a 3-day burn-in — charge cycle, Wi-Fi
                  reconnect after router drop, 50 button-press round
                  trips to the Log tab with zero dropped events — before
                  the pilot batch ships.

  v1.1 GATE       OTA update path itself validated on 10 pilot units
                  (touch layer activation, message queue) before a
                  fleet-wide push, per the same roadmap section.

  PRIVACY GATE    No camera frame ever leaves the device in any firmware
                  build. This is verified by static review of every
                  release before signing, not just tested at runtime.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-FIRMWARE
================================================================================
