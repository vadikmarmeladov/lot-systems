================================================================================
LOT SYSTEMS CORPORATION
COSMO® COMPUTER — ON-DEVICE FIRMWARE SPECIFICATION
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
================================================================================

DOCUMENT    LOT-COSMO-COMPUTER-FIRMWARE-v1
ISSUE DATE  2026.08.05
STYLE       TERMINAL GRID
PARENT      docs/corporate/LOT-COSMO-COMPUTER-v1.md (Section 10, item 1)
SIBLING     docs/technical/LOT-COSMO-COMPUTER-SOFTWARE-v1.md (site-side half
            of the same LOT API connector — kept separate per brief point 11)

================================================================================

## 00  SCOPE

This document specifies the firmware that runs ON the COSMO® Computer
(ESP32-S3, per docs/corporate/LOT-COSMO-COMPUTER-v1.md Section 03). It does
not specify server-side or lot-systems.com client-side behavior — that is
the sibling SOFTWARE document. The two meet at exactly one boundary: the LOT
API connector's wire format (Section 05 below), which both documents must
agree on and neither owns unilaterally.

This is a PRE-HARDWARE specification. No firmware has been flashed to a
physical unit as of this document's issue date. It exists to give the first
physical prototype (parent doc Section 06, assembly step 4) a target to
build against.

================================================================================

## 01  BOOT + PROVISIONING

    POWER ON (Qi charge detected OR battery has charge)
        |
        v
    Read provisioning state from flash (NVS)
        |
        +-- UNPROVISIONED --> BLE ADVERTISE
        |                       Operator pairs the unit to their
        |                       lot-systems.com session via BLE from an
        |                       already-authenticated browser/app session
        |                       (parent doc Section 03: "BLE reserved for
        |                       v1.0 provisioning only"). Device receives:
        |                         - Wi-Fi credentials
        |                         - Per-device auth token (Section 05)
        |                         - Operator account binding
        |                       Writes to NVS, reboots into PROVISIONED path.
        |
        +-- PROVISIONED --> Connect Wi-Fi (2.4GHz) --> hold LOT API
                             connector session (Section 05) --> enter
                             MAIN LOOP (Section 02)

    UNPAIR (operator-initiated, from lot-systems.com device settings, or
    long-press Copy button 10s): clears NVS provisioning state, returns to
    UNPROVISIONED. A COSMO® Computer with no bound operator account holds
    no session and displays nothing — mirrors LOT_ROBOTICS_COSMO.md's own
    hardware principle: "A COSMO® unit without a verified LOT profile does
    not activate."

================================================================================

## 02  MAIN LOOP

Runs continuously once provisioned. Four concurrent tasks on the ESP32-S3's
dual cores, all published against the up/down channel defined in Section 05:

    TASK A — DOWN-CHANNEL LISTENER
      Holds the LOT API connector session (poll interval v1.0, per parent
      doc Section 05 transport note). On a pager-class notification
      payload: decode text (<=20 chars target), render to e-paper
      (Section 03), store the notification's ID as CURRENT_NOTIFICATION for
      the Copy button (Section 04) to reference.

    TASK B — BUTTON WATCHER
      GPIO interrupt on the Copy button. Debounce (hardware + 20ms
      firmware confirm). On confirmed press: emit a device event carrying
      CURRENT_NOTIFICATION's ID (Section 04/05).

    TASK C — WEATHER POLL
      BME280 read on a fixed low-frequency interval (v1.0 target: every
      10-15 minutes — ambient data, not a live feed, matching parent doc
      Section 05's "passive, ambient, continuous-ish" characterization).
      Queues a telemetry event on the up-channel.

    TASK D — CAMERA (GATED, OPERATOR-INITIATED ONLY)
      No task runs this on a timer. Camera capture fires ONLY from an
      explicit operator action — a distinct long-press gesture reserved
      from the Copy button's short-press semantics (exact gesture TBD at
      first prototype; NOT a v1.0 motion trigger, NOT remote-initiated).
      This enforces the CAMERA GATE recorded in the parent document,
      Section 08 — loosening it is an explicit future decision, not a
      firmware default.

================================================================================

## 03  E-PAPER DRIVER

SPI display driver for the 1.54" e-paper module (parent doc Section 03).
Partial-refresh mode for short text swaps (battery + speed); full refresh
on boot and roughly every N partial refreshes to clear ghosting (exact N
tuned at bring-up — e-paper panels vary by vendor batch).

Render contract: ONE short line of text per notification, no scrolling, no
animation, no queue of unread messages shown at once. This is a firmware-
level enforcement of the parent document's anti-feed principle (Section
02) — the display physically cannot become a notification list, because
the driver only ever holds one string in its render buffer.

================================================================================

## 04  COPY BUTTON EVENT (BRIEF POINT 16)

    ON confirmed press (Section 02, Task B):
      IF CURRENT_NOTIFICATION is set:
        build device_notification_copy event:
          { device_id, notification_id: CURRENT_NOTIFICATION,
            copied_text: <the currently rendered string>,
            ts: <device RTC, corrected against last known-good
                 server time> }
        enqueue on up-channel (Section 05)
        flash a brief e-paper acknowledgment (e.g. a corner glyph,
        not a new message — screen contract in Section 03 still holds)
      ELSE:
        no-op — nothing to copy if no notification is currently
        displayed. No error state shown; silence is correct here.

This firmware-side event is the device half of the signal path fully
diagrammed in docs/corporate/LOT-COSMO-COMPUTER-v1.md Section 04. The
server-side handler (new Logs.tsx military handler, working name COPY:) is
sibling-document, not firmware, scope.

================================================================================

## 05  LOT API CONNECTOR — DEVICE-SIDE CLIENT

Firmware-side half only. Wire format, auth, and server routes are defined
jointly with the sibling SOFTWARE document — this section states what the
DEVICE must implement, not the full protocol.

    SESSION      Per-device auth token issued at provisioning (Section 01),
                 held in NVS, sent with every up/down-channel request.

    DOWN-CHANNEL  HTTPS poll (v1.0) at a bounded interval (target: 15-30s
                  when idle, tightened opportunistically after any recent
                  activity — exact backoff curve tuned at bring-up).
                  Payload: one pager-class notification (text, id) or
                  empty. v1.1 upgrade to a persistent push channel is
                  named in the parent doc roadmap (Section 07) and is NOT
                  v1.0 firmware scope.

    UP-CHANNEL    HTTPS POST, three event classes:
                    1. device_notification_copy (Section 04)
                    2. weather_telemetry (Section 02, Task C)
                    3. device_photo_capture (Section 02, Task D — gated,
                       operator-initiated only)
                  Queued locally if Wi-Fi is briefly unavailable; dropped
                  (not indefinitely retried) past a bounded queue depth —
                  a desk object with a battery buffer (parent doc Section
                  03) is not a store-and-forward log shipper.

    FAILURE MODE  Loss of Wi-Fi or auth: e-paper holds its last rendered
                  string (no error message shown — see Section 03 render
                  contract) until connectivity restores. This is a
                  deliberate quiet-failure design: an object whose whole
                  purpose is to NOT compete for attention should not start
                  competing for attention specifically to report that it
                  is broken.

================================================================================

## 06  WHAT THIS DOCUMENT DOES NOT SPECIFY

Exact GPIO pin assignments, clock configuration, RTOS task priorities, and
power-management sleep-state tuning are bring-up work against a physical
prototype board, not corpus-level planning. This document fixes the
ARCHITECTURE (tasks, event classes, render contract, gates) that bring-up
work must not violate — it is not itself a build-ready firmware image spec.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-FIRMWARE-v1
================================================================================
