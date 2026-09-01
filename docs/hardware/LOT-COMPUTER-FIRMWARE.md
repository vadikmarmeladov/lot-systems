<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Firmware Specification

**Document:** LOT-COMPUTER-FIRMWARE.md
**Companion to:** [`LOT-COMPUTER-PLAN-v1.md`](../corporate/LOT-COMPUTER-PLAN-v1.md), [`LOT-COMPUTER-SOFTWARE-BRIDGE.md`](./LOT-COMPUTER-SOFTWARE-BRIDGE.md)
**Kept separate per the brief:** firmware, software, and the manual are
independent documents — this one covers only what runs on the device.

---

## 1. Target

- **MCU:** Espressif ESP32-S3 (WROOM-1 module), dual-core, native camera
  (DVP) interface, hardware AES/SHA for TLS, WiFi + BLE.
- **Toolchain:** ESP-IDF, C, with the camera and e-paper drivers taken
  from their existing open-source component libraries rather than
  written from scratch — consistent with the BOM's "off-the-shelf"
  principle (Plan §05).
- **No local model inference.** The device has no on-board AI. Every
  "AI-grade" decision (Plan §05) — what a captured photo means, what
  notification to send — happens server-side against the existing AI
  engine abstraction (`docs/technical/AI-ENGINE-GUIDE.md`). The firmware's
  job is transport and rendering, not reasoning.

---

## 2. State machine

```
        power-on
           |
           v
      [ PROVISION ]  <-- no stored credentials / factory reset
           |  (QR / one-time code shown on e-paper, see §5)
           v
        [ IDLE ]  <-------------------------------+
        (screen shows last message or clock)      |
         |                    |                   |
   notification arrives   COPY pressed             |
         v                    v                    |
     [ NOTIFY ]           [ CAPTURE ]               |
     render text on       camera snap +             |
     e-paper, return      timestamp, queue           |
     to IDLE              event, POST to API         |
         |                    |                    |
         +--------------------+--------------------+
                              |
                        connectivity lost
                              v
                        [ BUFFER ]
                  queue grows locally, compress
                  on reconnect (§6), then -> IDLE
```

- `PROVISION` only runs once per device lifetime unless factory-reset
  (held COPY button for 10s during boot — the one deliberate exception
  to "the button does exactly one thing," documented here so it is never
  rediscovered as a surprise).
- `NOTIFY` and `CAPTURE` are both sub-second operations; the device
  spends the overwhelming majority of its life in `IDLE`, which on
  e-paper draws effectively zero power beyond the radio's keep-alive.

---

## 3. LOT API connector

- **Transport:** TLS 1.2+ over WiFi. The device is desk-resident and
  wirelessly charged (Plan §02), so unlike a battery-portable sensor it
  is designed around near-continuous power, not aggressive duty-cycling.
- **Session model:** a persistent MQTT-over-TLS subscription to a
  per-device topic (`lot/device/{deviceId}/notify`) for push-style
  notification delivery, plus a plain HTTPS `POST` for outbound events
  (COPY captures, heartbeat). MQTT was chosen over long-poll for
  latency — a "Coffee time!" message should reach the screen in low
  single-digit seconds, not on the next poll interval.
- **Auth:** per-device token issued during `PROVISION` (see
  `LOT-COMPUTER-SOFTWARE-BRIDGE.md` §Pairing), stored in encrypted
  flash (ESP32-S3 flash encryption + NVS encryption enabled — a device
  this size sitting on an open desk should not leak its API token to
  anyone who extracts the flash chip).
- **Endpoints used:** documented from the firmware's perspective in
  `LOT-COMPUTER-SOFTWARE-BRIDGE.md` §API Surface — this document does
  not duplicate that list, only the client-side behavior against it.

---

## 4. Rendering

- E-paper partial refresh for the common case (new single-line text
  replacing the old one) to keep the visible update fast; a full refresh
  (ghosting clear) triggered every N partial refreshes on a rolling
  counter, per the display driver's own recommended duty cycle.
- Text only, no icons, no animation, one font, one size — the pager
  register the brief specifies ("Coffee time!" style), not a UI.

---

## 5. Provisioning / pairing

1. First boot with no stored token: device generates a short pairing
   code and displays it on the e-paper (this is the one case where the
   screen shows device-generated content rather than a server push).
2. Owner enters the code at lot-systems.com under Settings → Devices
   (new UI surface, see Software Bridge doc).
3. Server issues a device token scoped to that owner's account; device
   receives it over a short-lived local BLE provisioning channel (WiFi
   credentials are never typed on a device with no keyboard — they are
   sent over BLE from the phone/browser doing the pairing, standard
   ESP32 provisioning pattern).
4. Device stores WiFi credentials + API token, moves to `IDLE`.

---

## 6. Session compression

Modeled directly on `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`
— the device is deliberately amnesiac, not a store of record:

- A ring buffer (fixed size, oldest-evicted) holds events during any
  connectivity gap: `{type: notify|copy|heartbeat, ts, payloadRef}`.
- On reconnect, the buffer is compressed to a single sync payload:
  event counts by type, first/last timestamp, and only the *content*
  for `copy` events (text + image), since those are the only events
  with owner-authored content worth preserving; `notify` and
  `heartbeat` entries collapse to counts.
- After a successful sync ack from the server, the local buffer clears.
  The device holds no history beyond the current session — the Log tab
  at lot-systems.com is the system of record, matching the Plan's
  explicit choice ("Memory Story lives server-side, as it does for
  every other LOT surface," Plan §03).

---

## 7. OTA updates

- ESP-IDF's standard OTA partition scheme (dual OTA slots + rollback on
  boot failure). A device with no physical port (Plan §02) must never
  be capable of bricking itself into a state that requires factory
  disassembly to recover — rollback-on-failure is a hard requirement,
  not an optimization.
- Update checks happen during `IDLE`, off the notification-latency
  path, and never interrupt an in-progress `CAPTURE`.

---

## 8. Flashing / debug (factory only)

- No USB port on the shipped unit (Plan §02 — the only ingress point is
  the sealed Qi charging face). Factory flashing and debug use a 5–6 pin
  pogo-pin test fixture against exposed pads on the main board, used
  once at manufacturing test and never again in the field.
- Field debugging, if ever required, happens entirely over the OTA/BLE
  channel already in place for provisioning — never by reopening the
  sealed stainless shell.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END LOT-COMPUTER-FIRMWARE
================================================================================
