<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT_COMPUTER_FIRMWARE_SPEC
TITLE:    LOT® Computer — On-Device Firmware Specification
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-01
VERSION:  0.1 — DEVELOPMENT START
COMPANION:  docs/corporate/LOT_COMPUTER_HARDWARE_PLAN.md (physical + BOM)
            docs/technical/LOT_COMPUTER_SOFTWARE_CONNECTOR.md (server API)
================================================================================

Kept as a separate document from the hardware plan and the software
connector spec per brief item 11. Read the hardware plan first — physical
form (Section 02), camera scope (Section 03), and BOM (Section 04) are the
constraints this firmware is written against.

--------------------------------------------------------------------------------
01 // PLATFORM
--------------------------------------------------------------------------------

```
MCU / SoC        ESP32-S3 (WROOM-1 or WROOM-2 module — hardware plan §04)
RTOS             FreeRTOS (native to ESP-IDF, no separate RTOS port needed)
LANGUAGE         C (ESP-IDF) — camera + display driver ecosystem is most
                  mature here; avoid Arduino-core abstraction overhead on
                  a device this power-constrained
TOOLCHAIN        ESP-IDF (Espressif's official SDK), OTA partition table
                  with A/B firmware slots from day one (Section 06)
```

WHY ESP32-S3 (not a smaller MCU, not a full Linux SBC): it is the smallest
part that natively drives a camera (DVP interface), has enough RAM/PSRAM
headroom for a JPEG frame buffer plus a display frame buffer at once, and
carries WiFi + BLE on one die — one radio part serves both the pairing
flow (BLE, Section 02) and the data connection (WiFi, Section 03-04). A
full SBC (e.g. a Linux-class module) is unnecessary weight, power, and
cost for a device whose only jobs are: render text, take one photo on
request, read a weather sensor, and POST small JSON payloads.

--------------------------------------------------------------------------------
02 // PROVISIONING & PAIRING
--------------------------------------------------------------------------------

  FACTORY STAGE (100-unit run, hardware plan §06)
    Each unit is flashed with a unique device certificate / device ID at
    the QC test jig station (Section 06) before it ever leaves assembly.
    No two units share a credential. The certificate is written to a
    protected flash partition, never exposed over BLE or WiFi in plaintext.

  FIELD PAIRING (operator's first setup)
    1. Device boots unpaired, screen shows a short pairing code, radio
       advertises over BLE only (WiFi stays off until paired — no device
       joins a network it has no reason to be on yet).
    2. Operator enters the pairing code on lot-systems.com (device
       pairing endpoint — software connector document, Section 02).
    3. Device receives WiFi credentials + a scoped device token over the
       encrypted BLE channel, switches to WiFi, confirms pairing with the
       server, screen shows "Paired." once confirmed.
    UNPAIR: operator-initiated from the dashboard is immediate — the
    server revokes the device token, the device's next request fails
    auth and the device falls back to the unpaired/advertising state on
    its own (no remote wipe command needed; a dead token is enough,
    hardware plan §11 — instant disconnect).

--------------------------------------------------------------------------------
03 // DISPLAY & NOTIFICATION RENDERER
--------------------------------------------------------------------------------

  PANEL CANDIDATES (hardware plan §04)
    GC9A01 round LCD — always-backlit, fast refresh, higher idle power.
    GDEY-class round e-paper — near-zero standby power, refresh takes
    longer and briefly flashes on update (acceptable for a pager — a
    notification is not time-critical to the millisecond).
    Prototype tier (v0/v1, hardware plan §06) should test both; e-paper
    is the likely production choice given this is a low-frequency,
    battery/wireless-charge-dependent display.

  RENDERER STATE MACHINE
```
    IDLE (last message shown, screen not redrawn — e-paper holds image
    with zero power draw)
        │  new message arrives (Section 04 — push channel)
        ▼
    QUEUED → RENDER (single message drawn, short text only — no
              scrolling, no animation; a pager shows one thing)
        │
        ▼
    DISPLAYED (message stays on screen until: operator presses Copy,
               OR a newer message supersedes it, OR a TTL elapses —
               TTL default 24h, configurable server-side)
```
  Message queue depth: 1. LOT Computer does not accumulate a notification
  backlog on-screen — a second message arriving while one is displayed
  replaces it. Anything the operator did not see stays recoverable in
  their Log/notification history on lot-systems.com itself; the device
  is a surface, not the system of record.

--------------------------------------------------------------------------------
04 // CAMERA PIPELINE
--------------------------------------------------------------------------------

  TRIGGER    Long-press on the Copy button only (hardware plan §03, §08).
             No timer-based, motion-based, or remote-triggered capture
             exists in this spec.
  CAPTURE    Single JPEG frame, OV2640/OV5640-class module (hardware plan
             §04), resolution capped low (this is a Log-tab thumbnail,
             not a photography product — hardware plan §03).
  LIFECYCLE  Frame held in RAM/PSRAM only until the upload (Section 05)
             either succeeds or exhausts its retry budget. On success,
             the buffer is zeroed immediately. On failure, one retry
             cycle (Section 07 — offline behavior), then discarded — the
             device never accumulates a photo backlog in flash. No frame
             is ever written to persistent storage.

--------------------------------------------------------------------------------
05 // WEATHER SENSOR
--------------------------------------------------------------------------------

  MODULE     BME280 (temp/humidity/pressure) or BME680 (adds gas/VOC —
             hardware plan §04, "AI-grade" tier for brief item 15).
  POLL RATE  Once per 15 minutes while on the charging base (weather does
             not change fast enough to justify more frequent reads, and
             the base is where the sensor physically lives — hardware
             plan §02, Part B).
  PURPOSE    Local ground-truth reading folded into the session summary
             (Section 06) and cross-checked server-side against the
             existing weather API (`#server/utils/weather`) that already
             powers the weather-mood pattern insight
             (docs/technical/OS_API.md, insight type `weather-mood`).
             Full ingestion contract in the software connector document,
             Section 04.

--------------------------------------------------------------------------------
06 // SESSION COMPRESSION (hardware plan §09)
--------------------------------------------------------------------------------

Firmware accumulates, in RAM, a rolling session record:

```
{
  copyPresses: [{ ts, displayedText }],
  captures: [{ ts, uploadStatus }],
  weatherSamples: [{ ts, tempC, humidity, pressure, gas? }],
  chargeEvents: [{ ts, event: "docked"|"undocked"|"charge_complete" }]
}
```

Uploaded as one compressed summary per session-close trigger, not
per-event streaming:

```
SESSION-CLOSE TRIGGER      BEHAVIOR
────────────────────────   ────────────────────────────────────
Undocked → redocked        Session closes on redock; summary uploads
                            once charging resumes (charging = reliable
                            network + power, the right moment to upload)
24h elapsed, still docked  Forced session close at 24h regardless of
                            dock state, so a permanently-docked unit
                            still reports daily
```

This is a firmware-level mirror of the Widget→Memory Compression Loop
already governing the server (docs/benchmark/LOT-DOCTRINE.md) — the
device is one more compressor upstream of the same Memory Engine, not a
new raw-event firehose. Server-side unpacking of this payload is
specified in the software connector document, Section 04.

--------------------------------------------------------------------------------
07 // POWER MANAGEMENT
--------------------------------------------------------------------------------

```
STATE           TRIGGER                          BEHAVIOR
─────────────   ───────────────────────────────   ─────────────────────
DEEP SLEEP      Docked, no message queued,         Radio off, MCU deep
                weather poll not due                sleep, e-paper holds
                                                     last image at 0 draw
LIGHT WAKE      Weather poll due (15 min timer)     Sensor read, sample
                                                     appended, back to
                                                     deep sleep
ACTIVE          Message received (push channel),    WiFi/BLE active,
                Copy pressed, capture triggered      display redraw,
                                                     upload in flight
UNDOCKED        Face lifted off Base                Runs on internal
                                                     LiPo (hardware plan
                                                     §04); same state
                                                     machine, shorter
                                                     budget — undocked
                                                     operation is a
                                                     read-and-Copy
                                                     window, not a
                                                     standing mode
```

WHY e-paper is the production-leaning display choice (Section 03): a
device that spends most of its life docked, deep-sleeping, and rendering
at most a few times a day should not pay a continuous backlight power
budget for a screen that is showing the same static text for hours.

--------------------------------------------------------------------------------
08 // OTA UPDATES & QC TEST JIG
--------------------------------------------------------------------------------

  OTA POLICY   A/B partition scheme — new firmware writes to the inactive
               partition, boots once to confirm health, only then is it
               marked active. A firmware update is classified the same
               way agent actions are classified server-side
               (docs/technical/LOT_Autonomous_AI_Server.md, Section 04):
               OTA push to a device already in an operator's hands is
               irreversible-adjacent and requires explicit human approval
               in the fleet management panel (software connector
               document, Section 05) before it is offered to any paired
               unit — never a silent forced push.

  QC TEST JIG (100-unit run, hardware plan §06)
    Per-unit bench test before a unit is boxed:
```
    1. Flash factory firmware + unique device certificate (Section 02)
    2. Display: render test pattern, visual pass/fail by operator
    3. Camera: capture one test frame, confirm non-blank JPEG
    4. Weather sensor: confirm live reading within plausible bounds
    5. Wireless charge: dock on test base, confirm charge current draw
    6. BLE pairing: confirm advertising, complete one test pairing cycle
    7. Copy button: 10 presses, confirm 10 debounced events registered
    8. Burn-in: 1 hour powered, confirm zero crash/reset
```
    A unit failing any step is not boxed. Pass/fail log per serial number
    feeds the fleet management panel's initial device roster (software
    connector document, Section 05).

--------------------------------------------------------------------------------
09 // OFFLINE / FAILURE BEHAVIOR
--------------------------------------------------------------------------------

  NO NETWORK       Display keeps last-known message. Session buffer
                   (Section 06) keeps accumulating in RAM up to a bounded
                   cap; if the cap is hit before reconnection, oldest
                   weather samples are dropped first (lowest-value data),
                   Copy-press and capture events are never dropped.
  UPLOAD FAILURE   One retry on the next session-close trigger. A capture
                   frame (Section 04) that fails twice is discarded, not
                   queued indefinitely — no photo backlog.
  NO SILENT BRICK  A device that cannot reach the server still functions
                   as a clock-less pager showing its last message; it
                   never enters an unrecoverable or blank-forever state
                   from a network outage alone.

--------------------------------------------------------------------------------
10 // SECURITY
--------------------------------------------------------------------------------

  - Device certificate + token stored in a protected flash partition, not
    readable over any exposed interface post-provisioning.
  - TLS to the LOT API for every request (pairing, notification pull,
    Copy POST, session upload) — no plaintext transport, ever.
  - Camera frames never persist past a successful upload or a two-strike
    failure (Section 04, Section 09) — no on-device photo library exists
    to be extracted if a unit is physically compromised.
  - BLE pairing window is time-boxed (5 minutes post-boot or post-factory-
    reset) — a unit does not sit indefinitely advertising an open pairing
    channel.
  - Inherits, unmodified, the ethics register in
    docs/corporate/LOT_ROBOTICS_COSMO.md and hardware plan Section 11: no
    surveillance posture, no data resale, instant disconnect, human gate
    on OTA (Section 08).

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT_COMPUTER_FIRMWARE_SPEC
================================================================================
