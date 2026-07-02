<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Pager — Firmware Specification

**Document:** LOT-PAGER-FIRMWARE.md
**Classification:** Internal / Build
**Prepared:** July 2, 2026
**Kept separate from:** `LOT-PAGER-SOFTWARE-CONNECTOR.md` (phone/server side),
`LOT-PAGER-HARDWARE-SPEC.md` (electronics this firmware runs on) — per LOT
documentation convention of one concern per file.

This document specifies firmware behavior only. It does not specify the
server-side API (see the Software Connector doc) or the physical BOM (see
`LOT-PAGER-BOM.md`).

---

## 01. Framework & Target

- **Target MCU class:** ESP32-S3 (or equivalent WiFi+BLE SoC — final part in
  `LOT-PAGER-BOM.md`)
- **Framework:** ESP-IDF (preferred for power-management control at deep-sleep
  granularity) or PlatformIO/Arduino core if EVT schedule favors faster
  iteration over sleep-current optimization. Decide at breadboard stage
  (Hardware Spec, Build Order step 01) based on actual measured sleep current
  on both — don't pre-commit before the numbers exist.
- **OTA:** dual-partition OTA (A/B) so a bad firmware push never bricks a
  device that's already in someone's pocket. Signed images only.

---

## 02. State Machine

```
                    ┌───────────────┐
        ┌──────────►│  DEEP SLEEP    │◄─────────────┐
        │           │  (radio off)   │               │
        │           └───────┬───────┘               │
        │                   │ periodic timer          │
        │                   │ (env sensor poll,        │
        │                   │  ~every 10-15 min)        │
        │                   ▼                          │
        │           ┌───────────────┐                  │
        │           │  SENSOR WAKE   │                  │
        │           │  read + buffer │──────────────────┘
        │           └───────┬───────┘  (buffer, don't transmit yet)
        │                   │
        │                   │ button press (any time, interrupt-driven)
        │                   │ OR notification poll window reached
        │                   ▼
        │           ┌───────────────┐
        │           │  RADIO WAKE    │
        │           │  WiFi join     │
        │           │  (cached creds,│
        │           │  fast-connect) │
        │           └───────┬───────┘
        │                   │
        │        ┌──────────┴──────────┐
        │        ▼                     ▼
        │  ┌────────────┐      ┌────────────────┐
        │  │ RECEIVE     │      │ SEND            │
        │  │ notification│      │ button "Copy"   │
        │  │ → display   │      │ signal + buffered│
        │  └──────┬─────┘      │ sensor session   │
        │         │            └────────┬────────┘
        │         ▼                     │
        │  ┌────────────┐               │
        └──┤ RADIO SLEEP │◄──────────────┘
           │ (WiFi off)  │
           └────────────┘
```

**Radio wake is the expensive state.** Everything in Section 01 (Power Budget)
depends on minimizing time spent here. Two triggers only:

1. **Button press** — always wakes radio immediately (operator-initiated,
   latency matters for the "Copy" gesture to feel instant).
2. **Notification poll window** — a short-interval check-in (target: every
   30-90 seconds while radio is briefly up, or a persistent low-power MQTT
   keep-alive if EVT power testing shows that's cheaper than repeated
   join/leave — see Software Connector doc Section 02 for the transport
   decision this firmware implements).

---

## 03. Session Compression

Item 8 of the original brief: *"Compress the information in each session."*
LOT® Pager applies the same principle the platform already uses in its Memory
Engine (`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) — don't
transmit raw samples, transmit a compressed summary of what happened since the
last sync.

**On-device session buffer** accumulates between radio wakes:

```json
{
  "device_id": "pager-<serial>",
  "session_start": "2026-07-02T08:00:00Z",
  "session_end": "2026-07-02T08:14:00Z",
  "env_samples": 14,
  "env_summary": {
    "temp_c": { "min": 21.2, "max": 22.1, "avg": 21.6 },
    "humidity_pct": { "min": 41, "max": 46, "avg": 43 },
    "pressure_hpa": { "avg": 1013.2 },
    "aqi_index": { "avg": 62, "status": "Good" }
  },
  "button_events": 1,
  "notifications_shown": 2,
  "battery_pct": 78
}
```

Rules:

- **Never transmit per-sample env data.** 14 raw temperature readings compress
  to one min/max/avg triplet. This is the same "complexity → simplicity"
  philosophy documented in `LOT-TERMINAL-VISION.md` (*"Air quality: 67/100 →
  Air quality: Good (67/100) – open your windows for 3 minutes"*).
- **Button events and notification-shown events are logged as counts + first
  timestamp**, not full event streams, unless a single button press is the
  transmission trigger (in which case that one event carries its own precise
  timestamp — see Software Connector doc's `pager-copy` payload).
  minute in the payload is enough for consistency scoring — the platform does
  not need device-side clock precision beyond what NTP-on-join provides.
- **CBOR over JSON on the wire.** JSON above is for spec readability; the
  actual radio payload should use CBOR (or a similarly compact binary
  encoding) to minimize radio-on time, since transmit duration is a direct
  power cost (Hardware Spec Section 03).

---

## 04. Notification Handling

1. Radio wakes (button or poll window).
2. Device requests pending notifications for its `device_id` (Software
   Connector doc, `GET /api/pager/notifications`).
3. If a notification is pending: render to display, mark as delivered
   (ack to server), start a local "shown" timer.
4. Display holds the message until the shown-timer expires (target: 8-15s
   on OLED/LCD; e-paper holds indefinitely at zero power until the next
   write — no timer needed, just let the ink sit).
5. Radio sleeps.

No local notification queue beyond one-at-a-time — if the operator hasn't
seen the last message, the device shows the newest on next wake rather than
stacking a backlog. A pager is not an inbox.

---

## 05. Button ("Copy") Handling

```
GPIO interrupt (button press)
  → debounce (50ms)
  → wake radio immediately (bypass poll-window wait)
  → attach buffered session summary (Section 03) to the Copy payload
  → POST to /api/pager/copy-signal (Software Connector doc Section 03)
  → on 200 OK: brief haptic/visual acknowledgment (single display flash
    or, if a vibration motor is added in a later BOM revision, one buzz)
  → clear session buffer
  → radio sleep
```

If the POST fails (no connectivity), the session buffer is **not** cleared —
it accumulates and merges with the next successful sync, per the same
compress-don't-drop principle as Section 03. Cap the buffer at a fixed
duration (e.g., 24h of summarized data) to bound memory on a device with no
local storage beyond a few KB of RAM.

---

## 06. Camera Capture

Per Hardware Spec Section 04 (consent model): camera power rail is off by
default. Firmware never initializes the camera on boot. Capture path:

```
Operator holds button 2s+ (distinct gesture from the quick "Copy" tap)
  → LED lights (camera rail live)
  → single frame captured, JPEG-encoded on-device
  → image held in RAM, NOT auto-transmitted
  → operator confirms via companion app (Software Connector doc) before
    the image leaves the device
  → camera rail powers down immediately after capture regardless of what
    the operator decides next
```

This keeps "camera" from silently becoming "always-on sensor" — the single
biggest trust risk in a wearable-adjacent device with a lens on it.

---

## 07. Weather Sensor Polling

Independent of the notification/button loop. Runs on its own low-power timer
(Section 02), buffers into the session summary (Section 03), and only leaves
the device when radio wakes for another reason (button press or poll window)
— sensor data does not justify its own radio wake. This is the main lever
that keeps average daily radio-on time low.

---

## 08. Security

- **Per-device credential**, provisioned once via BLE at first setup (see
  Software Connector doc Section 01 — pairing flow), not a shared fleet
  secret. Matches the existing LOT Terminal M2M model of
  operator-authenticated device tokens (`LOT-TERMINAL-M2M.md`).
- **TLS to the LOT API.** No plaintext notification payloads over WiFi.
- **Signed OTA images**, verified before the A/B partition switch commits.
- **No always-listening microphone or continuous camera stream** — nothing in
  this firmware spec introduces either; if a future revision adds audio, it
  requires its own consent-model section, not a silent addition here.

---

## 09. Open Questions for EVT

1. WiFi-direct vs. BLE-relay-through-phone — decide once real current-draw
   numbers exist (Hardware Spec Section 03).
2. E-paper vs. low-power LCD/OLED — decide on felt notification latency, not
   datasheet numbers alone.
3. Poll-window interval (30s vs. 90s vs. persistent low-power MQTT) — tune
   against measured battery life in DVT (25-unit field test).

These are intentionally left open rather than pre-decided in this document —
locking them now, before hardware exists to measure, would be designing
against guesses.
