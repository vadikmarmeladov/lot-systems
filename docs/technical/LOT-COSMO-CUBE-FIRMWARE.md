<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
COSMO® CUBE — MODEL S1
FIRMWARE SPECIFICATION v1.0
================================================================================

DOCUMENT    LOT-COSMO-CUBE-FIRMWARE
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
DATE        2026-07-05
RELATED     LOT-COSMO-CUBE-HARDWARE-SPEC.md · LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md

This document is separate from the software bridge doc (point 11 of the
brief: separate documents per domain). This file governs what runs ON the
device. LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md governs the server-side API and
the pairing app the operator uses on lot-systems.com / their phone.

================================================================================
00 // PLATFORM
================================================================================

    TOOLCHAIN     ESP-IDF (native) or Arduino-ESP32 core — either targets
                  the ESP32-S3 module chosen in LOT-COSMO-CUBE-BOM.md §02.
                  ESP-IDF recommended for production firmware: finer power
                  management control, smaller binary, native FreeRTOS task
                  scheduling for the sleep/wake loop in §04.
    OTA           esp_https_ota — signed firmware images pulled from the
                  same LOT API host (see LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md
                  §05), version-checked against Device.firmwareVersion
                  server-side before rollout.
    LANGUAGE      C (ESP-IDF components), no RTOS-level C++ required.

================================================================================
01 // BOOT + STATE MACHINE
================================================================================

    ┌──────────┐   pairing code    ┌──────────┐   token stored   ┌──────────┐
    │ UNPAIRED │ ───────────────→  │ PAIRING  │ ───────────────→ │  ACTIVE  │
    └──────────┘   entered via     └──────────┘   in NVS flash   └──────────┘
                    BLE config app                                     │
                                                                        │ deep sleep
                                                                        ▼
                                                                  ┌──────────┐
                                                                  │ SLEEPING │
                                                                  └──────────┘
                                                                        │ timer wake /
                                                                        │ button press
                                                                        ▼
                                                                  back to ACTIVE

UNPAIRED is the out-of-box state — device advertises BLE, waits for the
companion pairing flow described in LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md §01.
Once paired, the device never re-enters UNPAIRED except on a factory-reset
(10-second button hold, not part of normal operation).

================================================================================
02 // WAKE / SLEEP LOOP
================================================================================

The device spends the overwhelming majority of its life in deep sleep. This
is not an optimization pass — it is the only way a 15-150mAh battery
(LOT-COSMO-CUBE-HARDWARE-SPEC.md §03) lasts more than a day.

    EVERY WAKE CYCLE (timer-driven, default interval 90s, configurable
    server-side per operator — see LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md §04):

      1. Wake MCU from deep sleep.
      2. Read env sensor + accelerometer (cheap, I2C, <5ms).
      3. If accelerometer reports face-down orientation: skip network,
         re-enter deep sleep immediately (do-not-disturb, no server call).
      4. Otherwise: bring up WiFi, one HTTPS GET to /api/device/pull
         (LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md §04).
      5. If response line differs from what's currently on screen: push
         new line to the display driver (e-paper refresh or OLED redraw
         per LOT-COSMO-CUBE-HARDWARE-SPEC.md §05).
      6. Tear down WiFi. Re-enter deep sleep.

    BUTTON PRESS (interrupt-driven, can fire mid-sleep):
      Wakes the MCU immediately regardless of the timer, runs the handler
      in §05, then falls back into the normal sleep loop rather than
      resetting the wake timer — a button press does not delay or advance
      the next scheduled pull.

Interval choice: 90s balances "feels live enough for a pager" against
radio-on time. WiFi associate + single GET + teardown on an ESP32-S3
typically completes in under 2 seconds; at a 90s interval that is under
2.5% radio duty cycle.

================================================================================
03 // SESSION COMPRESSION (point 8)
================================================================================

The device never uploads a raw sensor stream. It maintains a small ring
buffer of the last N wake cycles (env reading, orientation, whether the
displayed line changed, timestamp) and only includes a compressed summary
of that buffer in the payload of the next §05 Copy action — it does not
sync on its own schedule.

    BUFFER ENTRY (in-memory, never persisted past a Copy or reboot):
      { t: uptime_seconds, tempC, humidityPct, orientation, lineChanged }

    ON COPY PRESS, the buffer compresses to:
      { sinceLastCopy: seconds, avgTempC, avgHumidityPct,
        orientationFlips: count, linesShown: count }

This is the same shape of decision the web client already makes —
LOT-DOCTRINE.md's "Async Signal Recording" clause defers expensive
recording work off the interaction path, and the QIE syncs "every 10
signals" rather than per-signal (LOT-SYSTEM-OUTLINE.md §04). The device
applies the identical principle at the firmware layer: don't call home
until there's a reason to, and when you do, send a compressed fact, not a
log.

The rationale is doubly practical here: every unnecessary radio wake costs
battery directly, not just server load.

================================================================================
04 // DISPLAY DRIVER
================================================================================

    E-PAPER (default, LOT-COSMO-CUBE-HARDWARE-SPEC.md §05)
      Partial refresh for same-length text swaps (~300ms), full refresh
      every 20th update to clear ghosting (e-paper accumulation artifact).
      Zero holding current — the panel does not need power once the image
      is set, so the MCU can fully power down the display driver between
      wakes.

    OLED (alternate)
      Explicit sleep-after-8-seconds display timeout in firmware — the
      panel draws power continuously while lit, so leaving it on between
      wake cycles is not acceptable on this battery budget. A wake cycle
      lights the panel, holds 8s, sleeps it.

Both drivers expose the same firmware-internal interface —
`display_show_line(const char *text)` — so switching CONFIG A/B display
choice (LOT-COSMO-CUBE-HARDWARE-SPEC.md §03) does not touch calling code.

================================================================================
05 // BUTTON HANDLER
================================================================================

Debounced in hardware timer (20ms), then classified in software:

    < 1000ms, single edge         → SHORT PRESS  → copy_current_line()
    >= 1000ms held                → LONG PRESS   → force_pull()
    two edges within 400ms window → DOUBLE PRESS → capture_photo_and_copy()

    copy_current_line():
      POST /api/device/copy with { text: <current screen line>,
      sessionSummary: <§03 compressed buffer>, batteryPct, firmwareVersion }.
      On 2xx: flash the display border once (visual confirmation without a
      persistent "sent" icon — matches the LOT web client's instant-visual-
      feedback-first pattern, LOT-DOCTRINE.md "Async Signal Recording").
      On failure: queue payload in NVS, retry next wake cycle (max 3
      queued payloads — oldest dropped if a 4th Copy fires before the
      queue drains, since this is an ambient companion, not a ledger of
      record; the LOG tab's own append-only Postgres table is the ledger
      of record, not the device's flash).

    force_pull():
      Same as a normal wake-cycle pull (§02 step 4) but skips the
      orientation check — an explicit long-press overrides do-not-disturb.

    capture_photo_and_copy():
      Single JPEG capture at lowest resolution the camera module supports
      (this is a context snapshot, not photography — LOT-COSMO-CUBE-
      HARDWARE-SPEC.md §06). Attached to the same /api/device/copy payload
      as base64 or, if over ~8KB, a separate multipart field — final choice
      depends on which the LOT API's existing body-size limits tolerate
      (see LOT-COSMO-CUBE-SOFTWARE-BRIDGE.md §03).

================================================================================
06 // POWER BUDGET (planning estimate, CONFIG B)
================================================================================

    STATE                  CURRENT      DURATION/CYCLE   NOTES
    ─────                  ───────      ──────────────   ─────
    Deep sleep              ~15uA        ~88s of 90s      dominant state
    Wake + sensor read      ~20mA        ~5ms
    WiFi assoc + GET        ~120mA       ~1.5-2s          single largest draw
    Display update           ~15mA        ~0.3-8s (driver-dependent)
    Button press handling    ~25mA        ~0.2s

At a 90s poll interval with CONFIG B's 150mAh cell, planning-grade estimate
is 3-6 days of runtime between wireless charges, dominated almost entirely
by WiFi association time — the single biggest firmware lever for extending
battery life is reducing per-wake WiFi connect time (e.g. via WiFi modem
sleep + fast-reconnect using cached AP credentials/channel, rather than a
full re-associate each cycle).

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-FIRMWARE
================================================================================
