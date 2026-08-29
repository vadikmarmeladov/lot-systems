<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-FIRMWARE
TITLE:    COSMO® Terminal (T-1) — Firmware Specification
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
COMPANION TO: docs/corporate/LOT-COSMO-COMPUTER-v1.md
DATE:     2026-08-29
VERSION:  0.1 — v1.0 SCOPE ONLY (camera dormant, see Section 05)
================================================================================

--------------------------------------------------------------------------------
01 // SCOPE
--------------------------------------------------------------------------------

Runs on the ESP32-S3 named in LOT-COSMO-COMPUTER-v1.md Section 03. Firmware
owns exactly four responsibilities in v1.0:

  1. Maintain a local (BLE or local Wi-Fi) link to the paired Bridge — see
     docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md. Firmware never talks to
     the public internet directly (LOT-COSMO-COMPUTER-v1.md Section 06).
  2. Render an incoming notification string on the round display.
  3. Sample the BME280 on an interval and report readings to the Bridge.
  4. Detect a press of the COPY button and emit a Copy event to the Bridge
     with the exact text currently on screen.

Nothing else. No local storage of a message history beyond what is needed to
answer a Copy press with the right text; no on-device notification queue
logic beyond "show the newest, replace the oldest" — queueing/priority is a
Bridge-side decision (Section 09 of the plan document notes device-management
as v2.0 scope).

--------------------------------------------------------------------------------
02 // BOOT + MAIN LOOP
--------------------------------------------------------------------------------

```
BOOT
  -> init display (GC9A01 driver)
  -> init I2C (BME280)
  -> init button GPIO (interrupt, debounced)
  -> load pairing state from NVS (paired Bridge address + link key)
  -> paired?  NO  -> render "PAIR ME" + advertise BLE (pairing mode)
              YES -> connect to Bridge link
  -> enter MAIN LOOP

MAIN LOOP (event-driven, not polled where avoidable — battery budget, Section 06)
  on BRIDGE MESSAGE (new notification)
     -> store text in currentMessage + displayedAt = now()
     -> render currentMessage on display
  on BUTTON PRESS (debounced, ISR-flagged, handled in loop)
     -> pressedAt = now()
     -> if currentMessage is set: emit COPY_EVENT { text: currentMessage,
        displayedAt, pressedAt } to Bridge
     -> if no currentMessage: emit COPY_EVENT with text: null (Bridge decides
        whether a bare Copy press with nothing on screen is loggable —
        firmware does not decide business logic, Section 01)
  on WEATHER TICK (every N minutes, N set by Bridge at pairing time)
     -> read BME280 -> emit WEATHER_SAMPLE to Bridge
  on LOW BATTERY THRESHOLD
     -> render low-battery glyph, reduce weather-tick frequency
```

--------------------------------------------------------------------------------
03 // DISPLAY RENDERING RULES
--------------------------------------------------------------------------------

Pager-length only. The display is 240x240 round — firmware truncates any
incoming message beyond a fixed character budget (Bridge is responsible for
keeping AI-generated notifications under that budget; firmware truncation is
the hard backstop, not the primary control). No scrolling, no multi-screen
messages in v1.0 — this is a deliberate constraint from LOT-COSMO-COMPUTER-v1
Section 04: "short and legible (pager-length, not paragraph-length)."

--------------------------------------------------------------------------------
04 // LOCAL LINK (FIRMWARE <-> BRIDGE)
--------------------------------------------------------------------------------

BLE preferred for v1.0 (lower power draw than a persistent local Wi-Fi socket
on a coin-cell-adjacent power budget). Link is paired once (Section 02) and
trusted thereafter — firmware performs no authentication of its own beyond
"is this the paired Bridge's link key" (LOT-COSMO-COMPUTER-v1.md Section 06:
"Terminal firmware has no auth, trusts only its paired Bridge"). All real
authentication to lot-systems.com happens Bridge-side
(docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md).

--------------------------------------------------------------------------------
05 // CAMERA — PRESENT, DORMANT
--------------------------------------------------------------------------------

The OV2640 camera is populated on the board from v1.0 (BOM, Section 01) but
its driver is not initialized in v1.0 firmware. This is intentional: shipping
the camera hardware now and activating it in firmware at the v1.1 gate
(LOT-COSMO-COMPUTER-v1.md Section 08) avoids a second hardware revision for a
software-only feature add. v1.1 firmware adds: camera init, a lightweight
presence-detection routine, and a QR-decode routine for the pairing flow.

--------------------------------------------------------------------------------
06 // POWER BUDGET (v1.0 TARGET, TO BE MEASURED AT PROTOTYPE)
--------------------------------------------------------------------------------

```
STATE                    DRAW (TARGET)     NOTE
──────────────────────   ───────────────   ─────────────────────────────
Deep sleep (idle, no msg)  <5 mA            BLE connection kept alive at
                                             lowest duty cycle the paired
                                             link allows
Display active (message)   ~40 mA           Only while a message is showing;
                                             display sleeps after a fixed
                                             timeout, message state persists
Weather sample              brief spike     BME280 duty-cycled, not continuous
Camera (v1.1+)              not budgeted    Added at the v1.1 gate
```

Actual current draw is measured at prototype bring-up, not assumed — this
table is a design target, marked as such per LOT doctrine ("do not fabricate
a precise metric; an honest 'trend' beats a made-up number").

--------------------------------------------------------------------------------
07 // OTA UPDATES
--------------------------------------------------------------------------------

Firmware updates are delivered Bridge-mediated (same trust boundary as
notifications): the Bridge fetches a signed firmware image from
lot-systems.com and pushes it over the local link. The Terminal never fetches
an update directly from the internet — same rationale as Section 04.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-FIRMWARE
================================================================================
