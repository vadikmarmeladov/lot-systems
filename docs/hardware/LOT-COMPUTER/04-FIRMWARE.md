<!--
  LOT SYSTEMS CORPORATION — brand.lot-systems.com
-->

# LOT COMPUTER — Firmware

Target: ESP32-S3-WROOM-1-N8R2 (`02-BOM.md`), ESP-IDF (not Arduino — the
camera + e-paper + BQ51013B power-management stack benefits from IDF's
finer-grained sleep control; Arduino-ESP32 is an acceptable fallback for
DVT bring-up speed, see Phase 0 in `03-ROADMAP.md`).

## Module map

```
main/
  app_main.c            boot, wake-reason dispatch, task spawn
  net/
    wifi_prov.c          provisioning + reconnect state machine
    lot_client.c          HTTPS client for LOT API (05-SOFTWARE.md)
  display/
    epd_driver.c          GDEY0154D67 driver, single-line render
  camera/
    cam_driver.c           OV2640 capture, QR decode (setup), still upload (Visual Log)
  sensors/
    env_bme280.c            temp/humidity/pressure poll
    presence_ld2410.c       presence gate
  power/
    charge_bq51013b.c        Qi charge state monitor
    sleep_mgr.c              deep-sleep scheduling, wake sources
  input/
    button_copy.c            debounced COPY press -> event queue
  device_id.c                 serial, pairing token storage (NVS, encrypted)
```

## Notification pipeline (spec point 2)

The device does not run a chatbot or generate text locally — every line on
the screen originates server-side, from the Memory Engine / QOS on
lot-systems.com, the same subsystem that already generates the
`assembly_directive` prompts described in `docs/benchmark/LOT-DOCTRINE.md`
"Operator RFI Pattern". Firmware's job is delivery, not generation.

Delivery mechanism — poll, not SSE, for v1:

- Device wakes on `presence_ld2410` trigger or a 5-minute floor timer
  (whichever is sooner), opens a short-lived HTTPS connection, calls
  `GET /api/hw/notifications` (`05-SOFTWARE.md`), and goes back to deep
  sleep immediately after rendering or on empty response.
- SSE (already used server-side for `settings_updated` per
  `docs/benchmark/LOT-DOCTRINE.md` "Cross-Device Sync") is the natural v2
  upgrade once battery budget allows a persistent connection — deferred
  because a held-open TLS socket on a coin-cell-adjacent battery budget
  (`02-BOM.md` §Power, ~400mAh) is the wrong tradeoff for a pilot whose
  main open question is RF-through-steel, not latency.
- One notification renders per wake. If more than one is queued server-side,
  the device shows the newest and the API marks the rest read (no queue UI
  on a 1-line pager display — matches `01-PLAN.md` §"no scroll, one line").

## Display driver

E-paper (GDEY0154D67, `02-BOM.md`): partial-refresh single line of text,
~5-7 words max at a legible size on a 200×200 panel — truncation happens
server-side (`05-SOFTWARE.md` caps notification text at 40 chars) so the
device never has to decide what to cut. Screen
stays in whatever image it last drew when powered off (e-paper's whole
point) — "Coffee time!" stays visible on the desk with zero standby power
until the next wake overwrites it.

## Camera driver

OV2640 in JPEG mode, VGA capture downscaled to whatever the operation
needs:
- Setup QR scan: single frame, on-device zxing-lite style decode, result is
  a short pairing token — no frame leaves the device for this path.
- Visual Log (opt-in, `01-PLAN.md` §Camera): single JPEG, uploaded once to
  `05-SOFTWARE.md`'s upload endpoint, frame buffer freed immediately after
  the HTTP call completes or fails. No SD card, no local frame storage.

## Button handler

Debounced (20ms) rising-edge on the COPY GPIO. On press:
1. Snapshot current sensor readings (temp/RH/pressure, battery %) already
   cached from the last poll cycle — do not block the button press on a
   fresh sensor read.
2. Enqueue an event; wake radio if asleep; `POST /api/hw/log`
   (`05-SOFTWARE.md`).
3. Flash a small on-screen acknowledgment glyph (not text — e-paper partial
   refresh of a small confirmation mark) so the operator gets tactile +
   visual confirmation without a round-trip wait on the server response.
4. On POST failure (offline), queue the event in NVS and retry on next
   successful radio wake — the physical gesture must never be silently
   lost, matching the software Log's own "write→read loop" discipline
   (`docs/benchmark/LOT-DOCTRINE.md` "Backend Whitelist Hygiene").

## Power / sleep states

```
DEEP_SLEEP    default. Radio off, sensors off except LD2410 (its own
              ultra-low-power presence-detect mode wakes the MCU).
POLL_ACTIVE   presence trigger or 5-min floor -> Wi-Fi up, notification
              poll, sensor read, sleep again. Budget: <2s radio-on time.
COPY_ACTIVE   button press -> Wi-Fi up (if asleep), log POST, sleep again.
CHARGE_IDLE   docked on Qi puck -> deep sleep continues, BQ51013B handles
              charge state independent of MCU; MCU wakes on charge-complete
              to update a cached battery% for the next button press.
OTA_ACTIVE    server-flagged OTA available -> full download + verify +
              apply on next dock/charge event only, never mid-notification.
```

Target: ~1 full day untethered on the 400mAh cell at the pilot's
notification/poll cadence — needs EVT soak-test confirmation
(`03-ROADMAP.md` Phase 1 gate), not asserted as a spec here.

## OTA

Signed firmware images, dual-partition A/B scheme (ESP-IDF native OTA
support), applied only while docked and charging (§Power states above) so
a failed flash never leaves a field unit bricked on battery. Rollback to
previous partition on boot failure. This is a pilot-run hard requirement
(`03-ROADMAP.md` Phase 1 gate) — 100 units in operator hands with no OTA
path means every firmware fix is a physical recall.

## Radio / RF

See `01-PLAN.md` §7.1 and `02-BOM.md` §RF. Firmware exposes an RSSI
self-test (logged locally, retrievable at the setup QR-scan step) so EVT
testing can quantify the antenna-window design before it's frozen into
CNC tooling — do not treat this as solved until an EVT unit in a fully
closed shell reports usable RSSI.
