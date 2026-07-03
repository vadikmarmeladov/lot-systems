================================================================================
LOT SYSTEMS CORPORATION
LOT® COMPUTER — FIRMWARE SPECIFICATION
SEPARATE FROM HARDWARE SPEC AND SOFTWARE/API SPEC BY DESIGN
================================================================================

DOCUMENT    FIRMWARE-SPEC / LOT-COMPUTER-v1
ISSUE DATE  2026.07.03
CLASS       INTERNAL / BUILD
RELATED     docs/technical/LOT-COMPUTER-RIG-SPEC.md (hardware)
            docs/technical/LOT-COMPUTER-SOFTWARE-BRIDGE.md (companion software / API)

Kept as an independent document because firmware ships on a slower, riskier
cadence than platform software — an OTA firmware bug bricks physical units
in the field; a bad platform deploy rolls back in seconds. The two must be
versioned, reviewed, and released on separate clocks.

================================================================================

## 00  RUNTIME

    TARGET     ESP32-S3-WROOM-1 (N8R2)
    FRAMEWORK  ESP-IDF (not Arduino core) — direct control of deep-sleep
               states and the DVP camera interface matters more here than
               Arduino convenience.
    LANGUAGE   C, with a thin C++ layer for the session-compression buffer

================================================================================

## 01  STATE MACHINE

```
                    ┌─────────────┐
        power-on    │   BOOT      │
        ───────────▶│ self-test   │
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
              ┌─────▶│    IDLE     │◀─────┐
              │      │ e-paper held│      │
              │      │ deep sleep  │      │
              │      └──────┬──────┘      │
              │             │             │
       display refreshed    │      Copy tap detected
       (message arrived)    │             │
              │             ▼             │
              │      ┌─────────────┐      │
              └──────┤   ACTIVE    ├──────┘
                     │ radio wake  │
                     │ sensor read │
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ SESSION     │
                     │ COMPRESS    │──── see §03
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ SYNC        │──── see software-bridge doc
                     │ (BLE/Wi-Fi) │
                     └─────────────┘
```

The device spends its life in IDLE. E-paper holds the last message with
zero standing current. ACTIVE is entered only by: (a) a message arriving
over the radio, (b) a Copy tap on the piezo sensor, or (c) the periodic
weather-sensor sample interval (default: every 15 minutes).

================================================================================

## 02  SENSOR DRIVERS

| Sensor | Interface | Sample Rate | Notes |
|---|---|---|---|
| BME680 (weather/gas) | I2C | 1 sample / 15 min | Bosch BSEC library for gas-baseline compensation |
| OV2640 (camera) | DVP (native ESP32-S3) | on-demand only | Never free-running. Captures a single low-res frame for ambient-light/presence estimate, then powers down. No continuous video, no local storage, no image ever leaves the device — see §03. |
| Piezo disc (Copy button) | ADC, threshold + debounce | interrupt-driven | Same GPIO also drives haptic tick on confirmation (bidirectional use) |
| BQ51013B (Qi) | I2C (status only) | polled on wake | Charge state feeds power-budget logic, not user-facing telemetry |

**Camera use is intentionally narrow.** The OV2640 is a presence/ambient-light
sensor with a lens, not a recording device. Firmware never buffers more than
one frame, never writes a frame to flash, and the frame itself never crosses
the radio — only a derived scalar (`ambient_lux`, `presence: bool`) leaves
the device. This is a hard firmware invariant, not a policy promise: there
is no code path that serializes raw frame bytes to the sync buffer.

================================================================================

## 03  SESSION COMPRESSION — ON-DEVICE

Mirrors the compression discipline already documented for the platform's
Memory Engine (`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`):
raw signal in, one dense fact out. A "session" here is bounded by IDLE→ACTIVE→IDLE.

```
SESSION COMPRESSION BUFFER (RAM, cleared every sync)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
raw samples over the session window:
  - N x BME680 readings (temp, humidity, pressure, gas)
  - camera-derived ambient_lux, presence bool (never raw frames)
  - copy_tap: bool, tap_timestamp
  - battery_mv, charge_state
        │
        ▼  on-device reduction (mean/median/delta, not raw log)
        ▼
ONE COMPRESSED RECORD PER SESSION:
{
  deviceId, sessionStart, sessionEnd,
  weather: { tempC, humidityPct, pressureHpa, vocIndex },  // reduced, not raw series
  presence: { seen: bool, ambientLux },
  copy: { tapped: bool, tapTimestamp },
  battery: { mv, chargeState }
}
```

The device never accumulates history across sessions. Once a compressed
record is synced (software-bridge doc), the RAM buffer is cleared. If sync
fails, exactly one record queues for retry — the device does not become a
local data store. This keeps the firmware's failure mode simple: worst case
is a dropped notification, never a privacy incident from an accumulating
on-device log.

================================================================================

## 04  DISPLAY UPDATE RULE

Firmware enforces the Ambient AI™ "one line, no alarm" rule at the lowest
level, not just as a design guideline:

- A new message triggers **partial refresh only** (~0.3s, no flash) unless
  8+ hours have elapsed since the last full refresh (e-paper ghosting
  correction — a full refresh is scheduled automatically, never on demand).
- Maximum message length is enforced in firmware (not just by the sender):
  one line, ~24 characters at the display's default type size. A longer
  string sent to the device is truncated firmware-side, not word-wrapped —
  this keeps the hardware honest to the brand rule even if a future
  software bug tries to send more.
- No blink, no inverted flash-alert state. A haptic tick (piezo disc, §02)
  is the only non-visual acknowledgment, fired once on message arrival.

================================================================================

## 05  POWER BUDGET

```
STATE                CURRENT DRAW          DUTY
─────                ─────────────          ────
Deep sleep / IDLE     <25uA                  ~99% of lifetime
BME680 sample          ~1.5mA for ~50ms      every 15 min
Wi-Fi/BLE sync burst   ~120mA for ~2-4s       per session, on Copy tap or push
E-paper refresh        ~15mA for ~0.3-2s      per message
Camera single frame    ~80mA for ~100ms       on-demand only
```

Given the bridge-cell battery decision in the rig spec (§07 there), firmware
defaults to Wi-Fi OFF / BLE-only sync when the device has been off the
charging puck for >30 minutes, falling back to Wi-Fi direct only if BLE
companion sync (software-bridge doc) is unavailable. This is a firmware-level
power policy, tunable but shipped with a conservative default for v1.

================================================================================

## 06  OTA UPDATE

- Dual-partition (A/B) OTA via ESP-IDF's native `esp_ota` — a failed update
  rolls back to the last-known-good partition automatically on watchdog
  timeout. No bricking on a bad flash.
- OTA payloads are signed; the bootloader rejects unsigned images. Given
  100 units in the field talking to a production API, an unsigned-OTA path
  is not acceptable even at pilot scale.
- OTA is pulled by the device on its own schedule (checked once per day
  during a sync burst), never pushed unsolicited — consistent with the
  "no silent writes" transparency principle already documented for LOT®
  server infrastructure (`docs/technical/LOT-NODE-0-RIG-SPEC.md`, §04).

================================================================================

## 07  WHAT FIRMWARE EXPLICITLY DOES NOT DO

- Does not store raw camera frames, ever, in flash or RAM beyond one frame.
- Does not accumulate a local log across sessions (see §03).
- Does not accept unsigned OTA images.
- Does not render more than one line of text regardless of what is sent.
- Does not attempt local Wi-Fi provisioning UI on a 200x200 e-paper screen —
  provisioning is BLE-only, driven from the companion app (software-bridge
  doc §01), because there is no keyboard on this device and there will
  never be one.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION                                                2026.07.03
================================================================================
