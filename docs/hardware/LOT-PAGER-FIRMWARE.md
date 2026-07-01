================================================================================
LOT SYSTEMS CORPORATION
LOT PAGER — FIRMWARE SPECIFICATION
DOCUMENT: LOT-PAGER-FIRMWARE / v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-01
COMPANION: LOT-PAGER-SPEC.md, LOT-PAGER-API-CONNECTOR.md
TARGET:   ESP32-S3-WROOM-1 (see LOT-PAGER-BOM.md section 01)
================================================================================

--------------------------------------------------------------------------------
00 // SCOPE
--------------------------------------------------------------------------------
This document covers only what runs on the device (Requirement #9). What the
device talks to on the backend — auth, endpoints, payload shapes — is kept in
LOT-PAGER-API-CONNECTOR.md (Requirement #11: separate documents; a firmware
engineer should not need to read backend routing code to build the image).

Toolchain: ESP-IDF (not Arduino core) — the camera DVP interface and deep-
sleep power states are better exposed at that layer, and the existing LOT
stack already favors boring, explicit tooling over frameworks
(docs/technical/LOT-NODE-0-RIG-SPEC.md section 03 sets this precedent for
the server side: "bare, boring, stable").

--------------------------------------------------------------------------------
01 // BOOT SEQUENCE
--------------------------------------------------------------------------------
```
01  Power on (Qi charge or battery) → RTC/NVS read: last-known WiFi creds,
    device_id, device_token (see API-CONNECTOR doc for how these are minted)
02  If no stored creds: enter PROVISIONING MODE (section 05)
03  If creds present: join WiFi (2.4GHz only — ESP32-S3 has no 5GHz radio)
04  Open persistent connection to notification transport (API-CONNECTOR
    doc section 02) — WS primary, HTTPS long-poll fallback
05  Draw idle screen (blank / last message, dimmed)
06  Enter main loop
```

--------------------------------------------------------------------------------
02 // MAIN LOOP — STATE MACHINE
--------------------------------------------------------------------------------
```
STATE          ENTRY CONDITION                    ACTION
-----          ---------------                    ------
IDLE           default, screen dimmed/off          poll button IRQ, poll
                                                    weather sensor every 10min,
                                                    hold WS/long-poll open
MESSAGE        new line received from transport    render full-brightness,
                                                    start 30s dim timer
COPY_PENDING   button pressed while in MESSAGE      flash confirmation glyph,
                                                    fire log-write request
                                                    (API-CONNECTOR doc §03)
COPY_PENDING   button pressed while in IDLE         same, but text = "—"
                                                    (no active message to
                                                    copy — logs a bare tap)
CHARGING       Qi field detected                    show charge glyph, WiFi
                                                    stays joined but radio
                                                    duty-cycled down further
PROVISIONING   no stored creds / long-press RESET   see section 05
```
The COPY_PENDING-while-IDLE case matters: requirement #16 says the button
always signals the Log tab, not only when a notification is showing. A tap
with no message on screen is still a real, intentional gesture and should
still land in the log — firmware must not silently drop it.

--------------------------------------------------------------------------------
03 // DISPLAY RENDERING
--------------------------------------------------------------------------------
    - One line, max ~24 characters at the target font size on the 0.96" OLED
      (LOT-PAGER-BOM.md section 01). Longer strings from the backend are
      truncated on-device with an ellipsis — truncation logic belongs in
      firmware, not the server, because it depends on the exact glyph widths
      of whatever font ships in the image.
    - No animation, no scrolling marquee. Static text only — the brand
      tension noted in LOT-PAGER-SPEC.md section 01 ("no alert, no
      interruption") extends to the display behavior itself: it should read
      like a note left on a desk, not like a ticker.
    - Dim-to-off after 30s idle in MESSAGE state; full off after 5 minutes
      to protect the battery budget.

--------------------------------------------------------------------------------
04 // WEATHER SENSOR LOOP
--------------------------------------------------------------------------------
    - BME280 read every 10 minutes in IDLE state (LOT-PAGER-BOM.md section 01
      / SGI table in section 05).
    - Readings are batched locally (up to 6 samples / hour) and sent with the
      next log-write or notification-ack request rather than opening a
      dedicated connection per reading — this is the on-device half of
      Requirement #8 (compress the information in each session): the device
      never phones home once per sensor tick, it folds an hour of samples
      into one payload before transmission (payload shape in API-CONNECTOR
      doc section 04).
    - On repeated transport failure, samples continue to accumulate in NVS
      up to a 48-hour ring buffer, then oldest-first drop — never blocks the
      main loop waiting on a network write.

--------------------------------------------------------------------------------
05 // PROVISIONING (FIRST BOOT / RESET)
--------------------------------------------------------------------------------
    - No WiFi creds stored → device broadcasts a BLE provisioning service.
    - Pairing happens through the LOT web app (Settings → "Pair a Device"),
      which is also where the device-token in section 01 gets minted — full
      flow is API-CONNECTOR doc section 01.
    - Long-press COPY for 10s in any state forces re-provisioning (factory
      reset of stored creds/token, not of the device_id itself).

--------------------------------------------------------------------------------
06 // OTA UPDATES
--------------------------------------------------------------------------------
    - ESP-IDF's native OTA (dual app partition, rollback-on-boot-failure) —
      standard, not custom. A/B partitioning means a bad firmware push never
      bricks a pilot unit; it just rolls back on next boot.
    - OTA checks happen once per day in IDLE state, over the same
      authenticated connection as everything else (API-CONNECTOR doc) — no
      separate unauthenticated update channel.

--------------------------------------------------------------------------------
07 // POWER BUDGET (TO BE MEASURED IN PHASE 1)
--------------------------------------------------------------------------------
Numbers below are targets, not measurements — LOT-PAGER-SPEC.md Phase 1
(board bring-up) is where these get replaced with real current-draw data
against the 150mAh cell (LOT-PAGER-BOM.md section 01):

```
STATE          RADIO                    TARGET DRAW
-----          -----                    -----------
IDLE           WS held open, WiFi modem-sleep    ~15–25mA
MESSAGE        display on, WiFi active           ~40–60mA
CHARGING       Qi active, WiFi duty-cycled        ~30mA (net, while charging)
DEEP SLEEP     (not currently in the state        ~1mA — held in reserve if
                machine above — a Phase 1          IDLE draw proves too high
                candidate if battery life
                targets are missed)
```

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-PAGER-FIRMWARE
================================================================================
