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
================================================================================

DOCUMENT    LOT-COMPUTER-FIRMWARE
ISSUE DATE  2026.07.18
CLASS       RESTRICTED // S-2 EYES
STYLE       TERMINAL GRID
S-2         VADIK MARMELADOV, Inventor, COSMO® CIA
STATUS      READY — v1.0, kept SEPARATE from LOT-COMPUTER-HARDWARE-SPEC.md
            and LOT-COMPUTER-SOFTWARE-CONNECTOR.md by design (spec item 11),
            so MCU-side firmware can version independently of the hardware
            BOM and the backend connector.
COMPANION   docs/technical/LOT-COMPUTER-HARDWARE-SPEC.md (BOM/roadmap)
            docs/technical/LOT-COMPUTER-SOFTWARE-CONNECTOR.md (backend API)

================================================================================

## 00  SCOPE

This document specifies the firmware that runs on the LOT Computer's
ESP32-S3 MCU. It does not specify the LOT backend contract — that is
LOT-COMPUTER-SOFTWARE-CONNECTOR.md. This file owns everything below the
network socket: boot, drivers, the render loop, button handling, and power.

================================================================================

## 01  TARGET PLATFORM

```
MCU             ESP32-S3 (Xtensa LX7 dual-core, Wi-Fi + BLE, camera DVP
                interface, hardware AES/SHA for TLS).
TOOLCHAIN       ESP-IDF (native) — chosen over Arduino-core for direct
                camera ISP + SPI display DMA control at the 5mm power/
                timing budget this device runs under.
FLASH           4-8MB (firmware + OTA partition x2 + notification/asset
                cache).
DISPLAY DRIVER  GC9A01 (round, 240x240, SPI) — see LOT-COMPUTER-HARDWARE-
                SPEC.md section 03.
CAMERA DRIVER   OV2640 (DVP interface, native ESP32-S3 camera support via
                esp32-camera component).
SENSOR DRIVER   BME280/BME680 over I2C (Bosch reference driver, ported).
POWER PATH      Qi receiver -> TP4057 charge IC -> LiPo cell -> 3.3V
                regulator to MCU/peripherals. Firmware reads battery
                voltage via ADC on a resistor divider off the charge rail.
```

================================================================================

## 02  BOOT SEQUENCE

```
STEP   ACTION                                          FAILURE HANDLING
────   ──────                                          ─────────────────
1      Power-on (Qi field detected or battery has        n/a
       charge above brown-out threshold).
2      ROM bootloader -> second-stage bootloader ->      Corrupt image ->
       verify active OTA partition signature.            fall back to the
                                                           other OTA slot
                                                           (A/B partitioning
                                                           — see 06).
3      Init display (GC9A01 over SPI), show LOT® mark    Display init fail
       boot splash immediately — first visible action    -> continue boot
       on power-up, before Wi-Fi or camera init, so a     silent (no visible
       user always sees SOMETHING within ~300ms of        state is a defined
       power-on.                                          firmware bug, not
                                                           acceptable —
                                                           logged to flash
                                                           for next OTA
                                                           pull).
4      Init I2C bus -> probe BME280/BME680 -> confirm     Sensor absent/
       chip ID.                                           fail -> continue,
                                                           mark sensor
                                                           DEGRADED in
                                                           status payload
                                                           (see connector
                                                           doc 03).
5      Init camera (OV2640 over DVP) -> capture one       Camera fail ->
       throwaway frame to warm the sensor.                continue, mark
                                                           CAMERA DEGRADED.
6      Read battery voltage (ADC) -> if below critical    Below critical ->
       threshold, skip Wi-Fi entirely, show low-battery   render low-battery
       glyph, deep-sleep.                                 glyph only, deep
                                                           sleep, wake on Qi
                                                           field re-detect.
7      Wi-Fi connect using stored credentials (set        No stored creds ->
       during pairing — see connector doc 02).            enter PAIRING MODE
                                                           (BLE advertise +
                                                           on-screen pairing
                                                           glyph).
8      TLS handshake to lot-systems.com, run connector    Handshake fail ->
       handshake (connector doc 02).                      retry with backoff
                                                           (connector doc 05),
                                                           show "offline"
                                                           glyph on screen,
                                                           do not block the
                                                           button — COPY still
                                                           queues locally.
9      Enter main loop (03).                              —
```

TARGET COLD-BOOT-TO-DISPLAY: under 1 second from power application (Qi
field contact) to the first frame on TERMINAL-FACE, whether that frame is
the LOT mark, a low-battery glyph, or a pairing prompt. The device should
never sit dark and unresponsive for more than a second while genuinely
powered.

================================================================================

## 03  MAIN LOOP

```
The device runs an event loop, not a polling UI framework — the display
only redraws on state change, to keep average power low on a 40-80mAh
cell (see 05).

STATE           TRIGGER                              DISPLAY
─────           ───────                              ───────
IDLE / CLOCK    default, no pending notification      minimal glyph — a
                                                        small ambient mark,
                                                        not a full UI (this
                                                        is a pager, not a
                                                        dashboard — see
                                                        LOT-COMPUTER-
                                                        HARDWARE-SPEC.md
                                                        section 01 thesis)
NOTIFICATION    connector delivers a pushed message     large centered text,
                (e.g. "Coffee time!") — see              e.g. "Coffee time!",
                connector doc 03                         held for a
                                                          configurable dwell
                                                          (default 20s), then
                                                          returns to IDLE
BUTTON PRESS    COPY button (GPIO interrupt, debounced   brief confirm glyph
                in firmware, ~30ms)                      (checkmark-class),
                                                          then returns to
                                                          prior state.
                                                          Signal is queued to
                                                          the connector layer
                                                          — see connector doc
                                                          04 for the /api/
                                                          logs payload this
                                                          produces.
LOW BATTERY     ADC threshold crossed                    low-battery glyph,
                                                          reduced radio duty
                                                          cycle
CHARGING        Qi field + charge IC reports active       charging glyph
                charge current
PAIRING         no stored Wi-Fi credentials, or long-      pairing glyph +
                press on COPY (>3s) triggers re-pair       instructions
OFFLINE         Wi-Fi/TLS unreachable but device has       small offline
                power                                      indicator overlaid
                                                            on IDLE/CLOCK
```

The camera is NOT continuously streaming. Per the product thesis (ambient,
undistracting, one signal at a time — LOT-COMPUTER-HARDWARE-SPEC.md
section 01), the camera captures on a low-rate cadence (default: one frame
every 5 minutes, configurable server-side) for presence/context signal
only — not video, not continuous surveillance. This is a deliberate
product and privacy boundary, consistent with docs/corporate/
LOT_ROBOTICS_COSMO.md's ethical framework ("What LOT Will Never Do" —
never deploy without consent, never operate as surveillance).

================================================================================

## 04  BUTTON / COPY SIGNAL HANDLING (spec item 16)

```
GPIO INTERRUPT -> DEBOUNCE (30ms) -> CLASSIFY (short press vs. long press
>3s) -> ACTION

SHORT PRESS:    Build a local signal event {device_id, ts, battery_pct,
                last_notification_id (if any was showing)} -> hand to the
                connector queue (connector doc 04) -> connector layer
                performs POST /api/logs against lot-systems.com (or its
                offline-queue equivalent if unreachable) -> on 2xx, render
                confirm glyph; on failure, glyph still shows (the human
                gets confirmation the press registered locally even if the
                network call is still retrying) -> firmware does not block
                on network I/O in the button ISR path; the confirm glyph
                renders from the local queue-accepted state, not from the
                HTTP response.

LONG PRESS:     Enter/exit PAIRING MODE (03). Used for re-pairing a unit
                to a different LOT profile, or first-time setup.
```

This is the one and only user input surface on the device (spec item 18:
"a button" — singular, by design). No modes, no double-click, no menu.
One press, one signal, one glyph.

================================================================================

## 05  POWER MANAGEMENT

```
BUDGET DRIVER   40-80mAh LiPo cell (LOT-COMPUTER-HARDWARE-SPEC.md 03) —
                aggressive sleep is mandatory, not an optimization.

Wi-Fi radio     off between connector poll/push cycles; default poll
                interval 60s for notification pull (connector doc 03),
                immediate wake-and-push on a COPY press.
Display         redraw-on-change only (03); GC9A01 supports partial
                refresh, used for glyph-only updates (battery, charging,
                offline icons) without a full-frame redraw.
Camera          duty-cycled per 03 — powered down between capture
                cycles, not continuously clocked.
Deep sleep      entered whenever: no notification is showing, no button
                event pending, no active charge cycle, and the last
                connector poll returned nothing new. Wakes on: GPIO
                (button), Wi-Fi push-capable timer, or Qi-field-detect
                (charging start).

TARGET RUNTIME  multi-day on a full charge under default 60s poll +
                5-minute camera cadence; exact figure to be measured on
                Phase 2 hardware (LOT-COMPUTER-HARDWARE-SPEC.md section
                06) — not claimed here without bench data.
```

================================================================================

## 06  OTA UPDATE PLAN

```
PARTITION       A/B OTA partitioning (ESP-IDF standard). New firmware
                writes to the inactive slot; boot only flips the active
                slot after the new image self-verifies (checksum + a
                successful boot-to-main-loop signal written back to the
                connector).
TRIGGER         Connector layer checks for a firmware update alongside
                its normal notification poll (connector doc 03) — no
                separate always-on OTA channel, to keep the power budget
                predictable.
RECOVERY        If a device fails to reach main-loop 3 consecutive times
                on a new image, bootloader auto-reverts to the last-known-
                good slot (standard ESP-IDF anti-rollback + health-check
                pattern). This directly addresses the hardware-spec risk
                (LOT-COMPUTER-HARDWARE-SPEC.md section 07): "no physical
                charge port means a bricked unit cannot be recovered by
                wired debug in the field" — the firmware must never brick
                itself; recovery is entirely automatic and on-device.
MID-UPDATE      OTA writes to the inactive partition only, so a power
POWER LOSS      loss mid-write leaves the currently-running (active)
                partition untouched — device reboots into the last-good
                image and simply retries the OTA next cycle.
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END OF SPECIFICATION                                                2026.07.18
================================================================================
