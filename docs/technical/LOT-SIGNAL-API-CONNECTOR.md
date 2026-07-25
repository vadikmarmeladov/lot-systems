<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Signal — API Connector Specification

**Document:** LOT-SIGNAL-API-CONNECTOR.md
**Classification:** Internal / Engineering
**Prepared:** 2026-07-25
**Parent spec:** docs/technical/LOT-SIGNAL-HARDWARE-SPEC.md
**Companion:** docs/technical/LOT-SIGNAL-FIRMWARE-SPEC.md
**Status:** Design — no server code written yet (Phase 4 target)

---

## 00. What This Connector Actually Is

LOT® Signal does not need a new backend. It needs two things bolted onto
the LOT® OS backend that already exists in this repository: a way to push
a compressed line down to a device, and a way for a button press to become
a row in the `logs` table (`src/server/models/log.ts`) — the exact same
table every widget in this codebase already writes to (chat messages,
journal entries, badge unlocks, emotional check-ins).

This is deliberate. LOT® Signal is not a separate product with its own
data silo — it is one more `event` type flowing through the pipeline that
already feeds the Memory Engine's `buildPrompt()` context and the Log tab
UI (`src/client/components/Logs.tsx`). Hardware in, hardware out, same
pipe.

---

## 01. Device Identity & Pairing

A new table, `hardware_devices`, mirrors the shape of existing models in
`src/server/models/`:

```
hardware_devices
  id            UUID, primary key
  userId        UUID, references users.id, cascade delete
  deviceType    STRING          — 'lot_signal'
  deviceSerial  STRING, unique  — printed on the rear base at manufacture
  pairedAt      DATE
  lastSeenAt    DATE
  credential    TEXT (encrypted) — device-side auth token, rotated on OTA
  metadata      JSONB           — firmware version, battery level, etc.
```

Pairing (matches LOT-SIGNAL-FIRMWARE-SPEC.md §05):

```
1. Device shows a QR code encoding a short-lived pairing token
   (generated device-side, never touches the network unpaired).
2. User's browser session (already authenticated on lot-systems.com)
   posts POST /api/hardware/pair { token, deviceSerial }.
3. Server verifies token freshness (60s TTL, matches firmware timeout),
   creates the hardware_devices row, mints a device credential, and
   returns it over the same BLE link the QR code came from.
4. Device stores the credential, switches to MQTT-over-TLS using it
   as the connection username/password equivalent.
```

---

## 02. Notification Push — Server → Device

### Transport

MQTT over TLS (port 8883). A lightweight broker (e.g. EMQX or Mosquitto)
sits alongside the existing Fastify backend — this is new infrastructure,
scoped narrowly to hardware, not a replacement for any existing HTTP API.
Each device subscribes to exactly one topic: `lot/signal/{deviceId}/notify`.

### Payload — Already Compressed (Requirement #8)

The compression happens server-side, inside the existing Memory Engine
pipeline, before the message ever reaches MQTT. The device never runs
inference and never sees raw context — it receives a finished sentence:

```json
{
  "line": "Coffee time!",
  "ttlSeconds": 3600,
  "sourceEvent": "morning_coherence_launch"
}
```

`line` is capped server-side at 18 characters (the firmware's fixed
render budget, LOT-SIGNAL-FIRMWARE-SPEC.md §04) — truncation and
word-choice happen in the same compression step that already produces
one-line widget copy elsewhere in the OS (see
`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` for the
existing compression pattern this reuses). `sourceEvent` lets the
acknowledgment (§03) reference what was actually said.

### Trigger Sources

Any existing scheduled job or widget action already writing to `logs`
can additionally publish to a user's device topic — this is additive,
not a new decision engine. `src/server/scheduled-jobs.ts` is the natural
home for a new `pushHardwareSignal(userId, line, sourceEvent)` helper
called from existing job handlers (e.g. the circadian/coherence jobs
already computing "right now" moments for widgets).

---

## 03. Acknowledgment — Device → Log Tab (Requirement #16)

### Transport

Same MQTT session, publish to `lot/signal/{deviceId}/ack` on COPY press.

### Payload

```json
{ "sourceEvent": "morning_coherence_launch", "pressedAt": 1785225600 }
```

### Server-Side Handling

A subscriber on the backend consumes `lot/signal/+/ack` and writes:

```js
await Log.create({
  userId: device.userId,
  event: 'hardware_signal_copy',
  text: line, // the line that was on screen when COPY was pressed
  metadata: { deviceId, deviceType: 'lot_signal', sourceEvent },
  context: { channel: 'hardware' },
})
```

`hardware_signal_copy` is a new `event` value, following the existing
naming convention (`emotional_checkin`, `badge_unlock`, `chat_message`,
etc. — see the full list already in use across `src/server/routes/`).
This row appears on the Log tab (`Logs.tsx`) exactly like any other
log entry, and flows into `buildPrompt()` context like any other signal
— a person who copies "Coffee time!" every morning at 7am becomes a
pattern the Memory Engine can reference, the same way a journal entry
would.

---

## 04. Firmware Update Delivery

The OTA manifest check (LOT-SIGNAL-FIRMWARE-SPEC.md §06) is a plain HTTPS
GET against a static manifest URL, not MQTT — firmware binaries are large
and infrequent, better served from object storage than pushed through the
broker. `hardware_devices.metadata.firmwareVersion` is compared against
the manifest on each device MQTT reconnect; if a diff is found, the
device fetches the signed binary via HTTPS.

---

## 05. What Explicitly Does Not Change

- No new AI inference path. The Memory Engine already decides *what* to
  say and *when* for existing widgets; this connector routes that
  existing decision to a new output (a physical screen) instead of
  building a second decision engine.
- No new privacy surface beyond the device itself. The camera's presence
  -check enum (LOT-SIGNAL-FIRMWARE-SPEC.md §03) is the only device-side
  signal that reaches the server, and even that only as a boolean/enum
  used to decide notification timing — never an image.
- No change to the Log tab UI. `hardware_signal_copy` events render with
  the existing generic log-entry template; no hardware-specific frontend
  work is required to ship Phase 4.

---

## 06. Open Items for Phase 4 Implementation

- Confirm MQTT broker choice and hosting (co-located with the existing
  Fastify/PostgreSQL stack, or a managed broker) — this is infrastructure
  the current backend does not yet run.
- Decide device credential rotation cadence and revocation path (e.g. a
  "unpair this device" action surfaced somewhere in account settings).
- Load-test the compression step under concurrent multi-device delivery
  once more than a handful of Phase-2 prototype units are paired
  simultaneously in bring-up testing.

---

**LOT Systems Corporation** — Los Angeles, CA
*End of API Connector Specification — 2026-07-25*
