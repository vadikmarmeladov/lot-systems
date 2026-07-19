<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT SIGNAL — Software Connector Document

**Document:** LOT-SIGNAL-SOFTWARE-CONNECTOR.md
**Classification:** Internal / Build
**Scope:** How the firmware (LOT-SIGNAL-FIRMWARE.md) talks to lot-systems.com
**Companion:** LOT_SIGNAL_PRODUCT_PLAN.md · LOT-TERMINAL-M2M.md · LOT-TERMINAL-SYNC.md

---

## 1. LOT API Surfaces Used

LOT SIGNAL is a client of the existing LOT API — it does not introduce a
new backend. Three surfaces, all already documented or already live in
this repository:

| Surface | Direction | Reference |
|---------|-----------|-----------|
| M2M intake (WebSocket + batch HTTPS) | device → server | `docs/corporate/LOT-TERMINAL-M2M.md`, `docs/corporate/LOT-TERMINAL-SYNC.md` |
| Notification push | server → device | Same M2M WebSocket channel, reverse direction |
| `POST /api/logs` | device → server (button press) | `src/server/routes/api.ts`, used today by `ContextualPromptsWidget.tsx` |
| `GET /api/os/status` | device → server (periodic, optional) | `docs/technical/OS_API.md` |

No new authentication scheme, no new database table for the pilot run —
the device is a new *client*, not a new *system*.

---

## 2. Pairing & Auth

Mirrors the existing S-2 operator registration flow in
`LOT-TERMINAL-SYNC.md`, adapted for a headless device with no keyboard:

```
1. First boot: device starts a local WiFi AP, "LOT-SIGNAL-XXXX"
2. User connects a phone/laptop, opens 192.168.4.1
3. Minimal captive page: pick home WiFi + enter LOT account pairing code
   (pairing code generated on lot-systems.com, account settings)
4. Device joins home WiFi, POSTs pairing code to
   POST https://api.lot-systems.com/v1/m2m/pair
   { "pairing_code": "...", "device_id": "signal-<chip-id>" }
5. Server responds with a scoped device token (JWT, 30-day rotation,
   same rotation policy as S-2 operator tokens)
6. Device stores token in NVS (encrypted flash partition), begins normal
   operation
```

A device token is scoped to exactly one thing: this device, this account.
It cannot read another user's data and cannot be used to call any API
route beyond the three listed in §1.

---

## 3. Notification Push (server → device)

```
wss://sync.lot-systems.com/m2m/intake
Authorization: Bearer <device_token>

Server → device:
{
  "type": "nudge",
  "text": "Coffee time!",
  "ttl_seconds": 8
}
```

The AI decision of *what* and *when* to send happens entirely server-side
— this is the existing pattern-detection and recommendation surface
(`docs/technical/OS_API.md` §3 "Pattern insights", `MEMORY-AND-QUANTUM-INTENT-ENGINES.md`).
LOT SIGNAL adds one more delivery channel to a decision the AI was already
capable of making; it doesn't add new intelligence.

Fallback: if the WebSocket is down (outside notify-window, or network
drop), notifications queue server-side and the device picks them up on
its next batch-mode HTTPS poll, per the Hybrid Mode behavior already
specified in `LOT-TERMINAL-SYNC.md` §"Sync Modes."

---

## 4. Button → Log Tab (device → server)

This is item 16 from the product brief, end to end:

```
Device, on button press with an active notification on screen:

POST https://api.lot-systems.com/api/logs
Authorization: Bearer <device_token>
Content-Type: application/json

{
  "text": "Coffee time!",
  "event": "device_signal",
  "metadata": { "device_id": "signal-a1b2c3", "source": "lot-signal" }
}
```

This hits the exact route the web client already writes to —
`fastify.post('/logs', ...)` in `src/server/routes/api.ts:1515`, which
does `fastify.models.Log.create({ userId: req.user.id, text, event, metadata, context })`.
Compare the existing client-side call from
`src/client/components/ContextualPromptsWidget.tsx:230` (`axios.post('/api/logs', { text })`)
and the `useLogs` read hook at `src/client/queries.ts:134` that powers the
Log tab UI. No new table, no new serializer — the Log tab already knows
how to render this entry, because it's the same shape a web-app action
produces today. The `event: "device_signal"` tag is the only new
convention this pilot introduces, so device-originated entries are
distinguishable from `note` (default) entries in the Log tab if the UI
later wants to badge them differently.

Device-token-authenticated requests need a scoped variant of the existing
session-cookie-based `/api/logs` auth — the practical delta this pilot
run introduces server-side: accept `Authorization: Bearer <device_token>`
as an alternate auth path on that one route, resolved to the same
`req.user` the session-cookie path resolves to. This is the only backend
change LOT SIGNAL requires; everything else is the device acting as a
client of surfaces that already exist.

---

## 5. Weather Sensor Reporting (device → server)

Uses M2M Format 3 (Multi-Sensor Array) verbatim, per
`LOT-TERMINAL-M2M.md`:

```json
{
  "device_id": "signal-a1b2c3",
  "operator": "<account-linked, not S-2-pseudonymized for LOT SIGNAL>",
  "device_type": "environmental_monitoring",
  "timestamp": "2026-07-19T14:32:00Z",
  "sensors": [
    { "type": "temperature", "value": 22.4, "unit": "celsius" },
    { "type": "humidity", "value": 46, "unit": "percent" },
    { "type": "pressure", "value": 1012.8, "unit": "hPa" }
  ],
  "alert_level": "normal"
}
```

Unlike the open S-2/LOT-Terminal marketplace flow (which pseudonymizes the
operator for public hardware listings), a LOT SIGNAL unit is
account-linked, not marketplace-listed by default — this is a personal
companion device, not an S-2 intelligence contribution, unless the owner
explicitly opts a unit into the marketplace path described in
`LOT-TERMINAL-M2M.md` §"Hardware Marketplace Protocol."

---

## 6. What the Backend Needs (Pilot-Run Scope)

Minimal, deliberately:

1. `POST /v1/m2m/pair` — new, issues device tokens.
2. Bearer-token auth accepted on `POST /api/logs`
   (`src/server/routes/api.ts:1515`, currently resolves `req.user` from
   session cookie only) — small addition: accept a device JWT as an
   alternate path to the same `req.user` resolution.
3. WebSocket relay at `wss://sync.lot-systems.com/m2m/intake` — per
   `LOT-TERMINAL-SYNC.md`, marked "Awaiting deployment" there; this is the
   first concrete consumer that would make standing it up worth doing.

No changes to the Log tab UI, the Memory Engine, or the OS API — LOT
SIGNAL is a new client, using existing server contracts, plus the two
small additions above.

---

*LOT Systems Corporation — Software Connector Document — 2026-07-19*
