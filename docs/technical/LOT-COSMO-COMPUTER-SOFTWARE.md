<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Software / API Integration Specification (v1.0)

**Document:** LOT-COSMO-COMPUTER-SOFTWARE.md
**Classification:** RESTRICTED // S-2 EYES
**S-2:** Vadik Marmeladov
**Companion documents:**
docs/corporate/LOT-COSMO-COMPUTER-v1.md (plan — read first),
docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md (device side of this contract)

---

## 1. Scope

This document specifies what runs on lot-systems.com to talk to the device
described in LOT-COSMO-COMPUTER-FIRMWARE.md. It names existing production
code paths wherever one already exists — the LOT API connector (plan doc
Section 05) is a hardware client bolted onto the current backend, not a new
service. Where a new route or a new allowlist entry is genuinely required,
it is called out explicitly as NEW.

## 2. Pairing Endpoint (NEW — small, additive)

```
POST /api/hardware/pair
  body: { serial: string, lot_profile_token: string, wifi_ssid: string }
  auth: lot_profile_token verified against the operator's session, same
        verification path already used for account-linked actions
  → on success: creates a device record (see Section 6), returns a
    long-lived device token
  → on failure (unverified profile): 403, matching the "no verified LOT
    profile, no activation" clause in docs/corporate/LOT_ROBOTICS_COSMO.md
```

This is the one new route the integration requires. Every other channel in
this document reuses an existing endpoint.

## 3. Inbound Push — Reusing the Existing SSE Stream

The production SSE endpoint at `GET /sync` (src/server/routes/api.ts,
`text/event-stream`, backed by `sync.listen('*', ...)` on the shared
EventEmitter in src/server/sync.ts) already fans out `live_message`,
`chat_message`, `chat_message_like`, and `settings_updated` events to
connected clients. The LOT Computer is a new *kind* of client on the same
stream, listening for one new event name:

```js
// wherever a notification-worthy signal already fires server-side
// (Memory Engine question ready, badge unlock, weather threshold —
//  the same signal classes named in LOT-CUBIQ-QUANTUM-CUBE-v0.md Sec. 04)
sync.emit('hardware_notify', {
  userId,
  text: 'Coffee time!',
  dwell_ms: 8000,
}, 'hardware_notify')
```

The `/sync` handler's `switch (event)` block (api.ts, inside the SSE
handler) gains one new `case 'hardware_notify':` arm that writes the event
only to the connection whose paired `userId` matches — the identical
per-user filtering pattern already used for `case 'settings_updated':`
a few lines above it. This is the exact push channel
LOT-COSMO-COMPUTER-FIRMWARE.md Section 4 connects to.

## 4. Outbound — The COPY Button and `/api/logs`

Firmware Section 7 POSTs a compressed session payload to `/api/logs` on
COPY press. No new endpoint: this hits the same log-write path every
software widget already uses (docs/assembly/2026-06-30_LOT-assembly_
widget-memory-engine-compression-loop.md documents the identical shape for
widget-originated events). The device authenticates with its device token
(Section 2) instead of a user session cookie; the route resolves the
device token to its paired `userId` and writes through
`src/server/models/log.ts` exactly as any other caller would:

```js
Log.create({
  userId,                       // resolved from device token
  event: 'hardware_copy',       // NEW allowlist entry, Section 5
  text: payload.notification_text ?? '',
  metadata: { device: 'lot-computer-v1', sessionId: payload.session_start_ts,
              batteryPct: payload.battery_pct, cameraCaptured: !!payload.camera_captured },
  context: { temperature: payload.temp_mean, humidity: payload.humid_mean },
})
```

## 5. Log Tab Visibility (NEW — one-line allowlist addition)

`src/server/routes/api.ts`, the `GET /logs` handler's `displayableEvents`
array (the same array documented at api.ts around line 1084 in the plan
doc's reading log) gains one new string:

```diff
   'physiological_cohort', 'archetype_shift', 'scheduled_job',
+  'hardware_copy',
```

With that one addition, every `hardware_copy` row written by Section 4
appears in the operator's Log tab (src/client/components/Logs.tsx) through
the existing render path — no client-side component changes required, the
Logs component already renders arbitrary `event`/`text` rows generically.

## 6. Device Records — Minimal New Table

```sql
CREATE TABLE hardware_devices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial        varchar UNIQUE NOT NULL,
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_token  varchar UNIQUE NOT NULL,
  paired_at     timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz,
  unpaired_at   timestamptz
);
```

One table, matching the existing migrations/ convention (Sequelize +
Postgres, already the LOT stack per docs/corporate/CQGS-WHITE-PAPER-
SNAPSHOT.md Section I). `unpaired_at` is set (never a hard delete) on
unpair, matching the append-only philosophy the Log table itself already
follows.

## 7. Admin Fleet View

For the 100-unit pilot, an admin-only read (`GET /admin-api/hardware`,
alongside the existing diagnostics surface in src/server/routes/
admin-api.ts) lists all `hardware_devices` rows with `last_seen_at`,
serial, and paired operator — the fleet visibility a 100-unit pilot needs
to catch a device that silently drops off the SSE stream (Section 3)
before an operator notices their COSMO® Cube stopped receiving
notifications.

## 8. What This Document Does Not Change

- No change to the Log model schema (`src/server/models/log.ts`) — the
  hardware payload fits the existing `event`/`text`/`metadata`/`context`
  columns exactly.
- No change to the client SSE utility (`src/client/utils/sse.ts`) — that
  file is the browser client; the device implements its own SSE client in
  firmware (LOT-COSMO-COMPUTER-FIRMWARE.md Section 4), not a reuse of the
  browser code.
- No change to `Logs.tsx` rendering — Section 5's allowlist addition is
  sufficient for `hardware_copy` rows to display.

---

*Companion to docs/corporate/LOT-COSMO-COMPUTER-v1.md. Revise this document
on backend/API changes; revise LOT-COSMO-COMPUTER-FIRMWARE.md on MCU/PCB
changes — see plan doc Section 08 for why the two are kept separate.*
