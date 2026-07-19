<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT SIGNAL — Firmware Document

**Document:** LOT-SIGNAL-FIRMWARE.md
**Classification:** Internal / Build
**Target:** ESP32-S3-WROOM-1 (N8R2)
**Companion:** LOT_SIGNAL_PRODUCT_PLAN.md · LOT-SIGNAL-RIG-SPEC.md · LOT-SIGNAL-SOFTWARE-CONNECTOR.md

---

## 1. Toolchain

- **Framework:** ESP-IDF (native), not Arduino-core — needed for real deep-sleep
  power control and DVP camera driver access.
- **Language:** C, with a thin C++ layer for the WebSocket/TLS client.
- **OTA:** ESP-IDF's native OTA partition scheme (two app partitions, rollback
  on boot-loop).
- **Build/flash:** `idf.py build flash monitor` over the rear-shell USB-C
  service port during bring-up; OTA-only after Phase 3 field test.

---

## 2. State Machine

```
                 ┌──────────────┐
                 │  DEEP SLEEP  │◄────────────────────────┐
                 └──────┬───────┘                          │
                         │ wake source:                     │
                         │  (a) timer (sensor poll, 5min)   │
                         │  (b) WiFi/RTC push interrupt      │
                         │  (c) button press                │
                         ▼                                   │
                 ┌──────────────┐                            │
                 │  WAKE + WIFI │                            │
                 │  (< 400ms    │                            │
                 │   connect,   │                            │
                 │   cached AP) │                            │
                 └──────┬───────┘                            │
                         │                                    │
          ┌──────────────┼──────────────┐                     │
          ▼              ▼              ▼                     │
   ┌────────────┐ ┌────────────┐ ┌────────────┐               │
   │ NOTIFY      │ │ SENSE      │ │ BUTTON      │              │
   │ (render msg │ │ (BME280    │ │ (POST log,  │              │
   │  on screen, │ │  read,      │ │  camera     │              │
   │  hold N sec)│ │  buffer)    │ │  optional)  │              │
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘              │
          │               │               │                     │
          └───────────────┴───────────────┘                     │
                          ▼                                      │
                 ┌──────────────┐                                │
                 │  COMPRESS +  │                                │
                 │  SYNC (§4)   │                                │
                 └──────┬───────┘                                │
                         └──────────────────────────────────────┘
```

Every wake is short by design — the device is a pager, not a monitor. WiFi
connect uses a cached BSSID/channel from the last successful join to avoid
a full scan, the single biggest deep-sleep-cycle time cost on ESP32-S3.

---

## 3. Wake Sources, In Detail

### (a) Timer wake — sensor poll
Every 5 minutes: wake, read BME280 (temp/humidity/pressure), buffer the
reading, sleep. No radio use on every tick — only flush to the server on
the batch schedule in §4.

### (b) Push wake — notification
The device holds a light WebSocket connection during active hours (see
SOFTWARE-CONNECTOR §2 for the hybrid real-time/batch mode) or, in the
battery-optimized default, wakes on an ESP-NOW-adjacent low-power beacon
from a paired hub. Pilot-run default: **hybrid mode**, WebSocket during
declared "notify windows" (user-configurable, defaults 07:00–22:00),
timer-poll-only outside that window.

On a push: render the notification text on the GC9A01 screen, hold it for
8 seconds (tunable), then return to sleep. No sound — screen only.

### (c) Button wake — Copy
GPIO interrupt wakes the device directly, bypassing the sleep-timer path.
Behavior:

1. If the screen currently shows a live notification: **copy that text**
   into a `POST /api/logs` call (see SOFTWARE-CONNECTOR §3).
2. If the screen is idle (no active notification): the button instead
   triggers a single camera frame capture, attached to a log entry as
   `"Snapshot logged from LOT SIGNAL"` — the device's only camera-use path.
   The camera is never active outside this explicit button-triggered
   capture. No idle preview, no continuous stream.

This is the whole of the device's decision logic. Everything else — what
to notify, when, why — is server-side.

---

## 4. Session Compression

A "session" = one wake-to-sleep cycle. The firmware never streams samples
individually; it buffers within a session and ships one compact payload on
sleep re-entry, or on batch flush if several sessions have queued while
off the notify-window WebSocket.

```c
typedef struct {
    uint32_t session_start_unix;
    uint16_t sensor_count;
    sensor_sample_t samples[MAX_SAMPLES_PER_SESSION]; // ring buffer, 12 max
    bool button_pressed;
    bool notification_shown;
    char notification_text[64];   // truncated, not stored verbatim server-side
} lot_signal_session_t;
```

Compression rule: consecutive sensor samples within a session that don't
move more than the sensor's noise floor (±0.3°C, ±2% RH, ±1 hPa) collapse
to a single min/max/mean triple instead of N raw points before the payload
ships. This mirrors the server-side Memory Engine's compression posture —
LOT SIGNAL should never be the noisiest data source hitting a user's Memory
Arc. Full server-side handling in `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`.

Batch flush cadence: every 4 sessions or 20 minutes, whichever comes first,
outside the WebSocket notify-window; immediate on the WebSocket when it's
open.

---

## 5. Power Budget

```
STATE                CURRENT        DURATION/DAY (typ.)
─────                ───────        ────────────────────
Deep sleep            ~18uA          ~22h
WiFi connect+sync      ~120mA         ~90s total (batched)
Screen active           ~35mA          ~5min total (notify holds)
Camera capture           ~110mA         <1s per button press (rare)

Est. daily draw: ~180mAh equivalent on a 300mAh cell
→ ~1.5–2 day runtime between Qi charges, worse with heavy button use.
```

Battery life is the one number that should get re-measured in Phase 3
field test before it goes in any customer-facing manual — the estimate
above is a design budget, not a measured result.

---

## 6. OTA Update Path

- Dual app-partition scheme; new firmware writes to the inactive partition,
  boots into it, and only commits (marks valid) after a successful
  WiFi+server round-trip. Boot-loop reverts automatically.
- OTA images signed; device rejects unsigned images. Signing key held
  server-side, not on-device.
- Delivered over the same WebSocket/HTTPS channel as M2M sync — no
  separate OTA server.

---

*LOT Systems Corporation — Firmware Document — 2026-07-19*
