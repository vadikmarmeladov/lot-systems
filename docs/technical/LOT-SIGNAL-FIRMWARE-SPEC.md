================================================================================
LOT SYSTEMS CORPORATION
LOT® SIGNAL — FIRMWARE SPECIFICATION
================================================================================

DOCUMENT    FW-SPEC / LOT-SIGNAL-01
ISSUE DATE  2026.07.25
CLASS       INTERNAL / ENGINEERING
PARENT SPEC docs/technical/LOT-SIGNAL-HARDWARE-SPEC.md
COMPANION   docs/technical/LOT-SIGNAL-API-CONNECTOR.md
STATUS      DESIGN — NO CODE WRITTEN YET (Phase 1 target)

================================================================================

## 00  PLATFORM

```
MCU             ESP32-S3-WROOM-1-N8R8 (dual-core, 8MB flash, 8MB PSRAM)
TOOLCHAIN       ESP-IDF v5.x (not Arduino core — direct driver access to
                the LCD SPI bus and camera DVP interface needed for the
                power budget in §02)
RTOS            FreeRTOS (bundled with ESP-IDF)
LANGUAGE        C, with a thin C++ layer for the notification-render module
OTA             ESP-IDF native OTA (dual-partition, A/B, rollback on
                boot-loop detection)
```

================================================================================

## 01  MODULE MAP

```
MODULE              RESPONSIBILITY
──────              ──────────────
power_mgr           Sleep-state machine (§02), battery ADC read, Qi
                    charge-detect GPIO, wake-source arbitration.
display_drv         SPI driver for the Sharp memory LCD. Owns the only
                    "what does the line say right now" buffer.
camera_drv          OV2640 init/capture, QR decode (pairing only), and
                    presence classification (person / no person / motion).
                    Never writes a frame to flash or transmits raw pixels.
sensor_svc          BME680 (temp/humidity/pressure/gas) + LSM6DSO (tap
                    gesture) + VEML7700 (ambient light) polling on a
                    30s cadence, feeding power_mgr's brightness decision.
button_svc          Debounce + long-press detection on the COPY button.
                    Short press = acknowledge. Long press (3s) = re-enter
                    pairing mode.
conn_mgr            WiFi provisioning + reconnect backoff + BLE fallback
                    for pairing. Owns the single MQTT-over-TLS session
                    described in LOT-SIGNAL-API-CONNECTOR.md.
notify_render       Takes the compressed line from conn_mgr, decides
                    font size / truncation, hands the final bitmap to
                    display_drv. This is the ONLY module allowed to
                    write to the screen buffer — prevents two subsystems
                    racing on the same 1-line surface.
ota_svc             Checks for firmware update manifest on each MQTT
                    reconnect; downloads to inactive partition; verifies
                    signature before marking bootable.
```

================================================================================

## 02  POWER BUDGET (WHY THE BATTERY IS ONLY 150mAh)

The Sharp memory LCD is the entire reason this device can run on a coin-cell
-sized pouch battery instead of needing a permanent Qi cradle:

```
COMPONENT           ACTIVE DRAW      SLEEP DRAW       DUTY CYCLE
─────────           ───────────      ──────────       ──────────
ESP32-S3 (deep sleep)     —          ~10µA            >99% of the time
Sharp memory LCD          ~5µA static (screen stays lit doing NOTHING —
                           it is a reflective bistable panel, not backlit)
BME680 + LSM6DSO + VEML   ~150µA avg  —                30s poll cadence
WiFi (MQTT keepalive)     ~120mA burst —               ~2s every 60s
Camera (presence check)   ~80mA burst —                ~200ms every 10s
                                                        (only when awake)

ESTIMATED BATTERY LIFE (150mAh cell): ~9–12 days between Qi charges,
assuming ~15 notifications/day and no continuous camera use.
```

This is the hard constraint that makes "camera" mean presence-check, not
continuous video: a live camera stream at this battery budget would drain
the cell in under two hours. The mechanical §02 in the parent spec and this
power budget are the same decision seen from two sides.

================================================================================

## 03  CAMERA — HARD PRIVACY CONSTRAINT (FIRMWARE-ENFORCED)

This is not a policy note — it is enforced in `camera_drv` at the driver
level, independent of any cloud-side promise:

```
ALLOWED                                  NOT IMPLEMENTED, NOT BUILT
───────                                  ──────────────────────────
QR-code capture during pairing mode      Continuous video streaming
Single-frame presence classification     Frame storage to flash
  (person / motion / empty — a 3-value   Frame transmission over
  enum, not an image, leaves the driver) MQTT/WiFi in any form
                                          Any endpoint that accepts
                                          image bytes from this device
```

`camera_drv` exposes exactly two functions to the rest of the firmware:
`camera_scan_qr()` (pairing mode only, times out after 60s) and
`camera_check_presence()` (returns an enum, called by `power_mgr` on its
own schedule). Neither function signature includes a frame buffer output
parameter — there is no code path for a captured image to leave this
module. Reviewers auditing this firmware should treat the absence of any
image-transmission API as the thing to verify, not a comment claiming it.

================================================================================

## 04  NOTIFICATION RENDER PIPELINE

```
1. conn_mgr receives a compressed notification payload over MQTT
   (see LOT-SIGNAL-API-CONNECTOR.md §02 for the wire format — the
   payload is ALREADY a single short string; no LLM inference runs
   on-device).
2. notify_render truncates to the display's fixed character budget
   (18 characters at the chosen font — "Coffee time!" fits with
   room to spare; longer lines are compressed server-side, not
   client-side, per requirement #8 — see the API connector doc).
3. display_drv writes the bitmap. The Sharp memory LCD holds the
   image with zero ongoing power draw until the next write.
4. button_svc watches for a COPY press. On press: conn_mgr publishes
   an acknowledgment message, notify_render clears the line, and the
   device returns to its sleep-dominant idle state.
```

No notification is ever composed, summarized, or generated on the device.
The device is a display and a button — all judgment about *what* to say
and *when* lives in the LOT® Memory Engine, server-side. This keeps the
firmware small, auditable, and free of any model weights to secure.

================================================================================

## 05  PAIRING FLOW

```
1. Long-press COPY (3s) → device generates a local BLE advertisement +
   shows a QR code on-screen encoding a short-lived pairing token.
2. User scans the QR from their LOT® OS mobile view (or the device's
   own camera scans a QR shown by the phone — either direction works;
   whichever is implemented first in Phase 1 becomes the default).
3. Phone/browser posts the pairing token to the LOT API connector,
   which mints a device credential (§ in the API connector doc) and
   pushes it down over the same BLE link.
4. Device stores the credential in NVS (encrypted partition), switches
   to WiFi + MQTT-over-TLS, and pairing mode exits automatically.
```

================================================================================

## 06  OTA UPDATE POLICY

```
CHECK CADENCE     On every MQTT reconnect (typically once per session,
                  not continuously polled — keeps radio awake time low).
VERIFICATION      Signed manifest, public key baked into firmware at
                  build time. Unsigned or mismatched-signature updates
                  are rejected and logged, never applied.
ROLLBACK          A/B partition scheme — if the new image fails to
                  report healthy within 3 boot cycles, the bootloader
                  reverts to the last-known-good partition automatically.
USER VISIBILITY   No user action required for firmware updates. This is
                  the one exception to "no silent writes" (see the
                  NODE-0 transparency doctrine) — firmware updates are
                  logged to the Log tab as a system event, not gated
                  behind a human confirmation, since they are reversible
                  via the A/B rollback above.
```

================================================================================

## 07  OPEN QUESTIONS FOR PHASE 1 (BREADBOARD)

```
- Confirm actual current draw on the Sharp memory LCD at the chosen
  refresh rate — datasheet figures assume a specific waveform driver.
- Decide QR-scan direction (device scans phone, or phone scans device)
  based on which is more reliable on the OV2640's fixed-focus lens at
  typical desk distance (~20-30cm).
- Measure real WiFi reconnect power cost on the ESP32-S3 in this
  enclosure — the stainless steel shell is a partial RF shield and may
  require an external antenna trace routed to a non-metal gasket gap.
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF FIRMWARE SPECIFICATION                                       2026.07.25
================================================================================
