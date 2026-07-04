<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Software / LOT API Connector

**Document 5 of 7 · Hardware Documentation Set**

> Kept separate from the firmware document (Doc 4) per the brief's
> instruction #11 — this document covers the connector layer between the
> Cube's firmware and lot-systems.com: pairing, auth, and endpoints. It
> does not cover what runs on the MCU itself.

---

## What Already Exists

The Cube's Copy button (brief #16) does not need a new logging mechanism
— it reuses the existing, already-shipped Log tab endpoint:

```
POST /logs
Body: { text: string, event?: string, metadata?: Record<string, any> }
```

Confirmed in `src/server/routes/api.ts` (`fastify.post('/logs', ...)`,
around line 1429): it creates a `Log` row with the requesting user's
`req.user.id`, the given `text`, an `event` type (defaults to `'note'`),
and arbitrary `metadata`. This is exactly the mechanism that already
populates a user's Log tab from every other widget in the app
(`docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md`).
For the Cube, the Copy button will call this same endpoint with:

```json
{
  "text": "Copied via COSMO® Cube",
  "event": "cosmo_cube_copy",
  "metadata": { "deviceId": "<cube-id>", "battery": 82 }
}
```

**No new Log-tab-side work is required.** What's new is authenticating a
physical device as a specific user, and getting notifications back out —
covered below.

## What's New: Device Pairing & Auth

The existing web app authenticates users via a JWT stored in an
`auth_token` cookie (`JWT_SECRET` / `JWT_COOKIE_KEY`, see `src/server/config.ts`).
A hardware device can't hold a browser cookie, so it needs its own
credential, scoped narrowly:

**Proposed pairing flow (not yet implemented — this is the spec):**

1. On first boot, the Cube's firmware (`boot_pair`, Doc 4) generates a
   short pairing code and shows it on its own display.
2. The user opens lot-systems.com, goes to Settings → Devices, and enters
   the code.
3. Server mints a **device-scoped JWT** — same signing mechanism as the
   existing user JWT, but with a `scope: ["hardware:cosmo_cube"]` claim
   and a longer, refreshable expiry — and returns it to the device over
   the pairing session.
4. The Cube stores this token and attaches it as a bearer token on all
   subsequent API calls. The server's auth middleware resolves it to the
   same `req.user` the web app already uses, so `POST /logs` needs **zero**
   changes to accept device-originated calls.
5. Un-pairing (from Settings, or a factory-reset button combo on the
   device) immediately revokes the token — consistent with the
   `LOT_ROBOTICS_COSMO.md` principle that a hardware unit is inert without
   a verified, currently-consenting profile.

## Proposed New Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/device/pair` | `POST` | Exchange a pairing code for a device-scoped JWT |
| `/api/device/unpair` | `POST` | Revoke a device's token (from web Settings or the device itself) |
| `/api/device/notifications` | `GET` (SSE) or MQTT topic | Stream of pager-style messages for this device — sourced from QOS mode transitions, Memory Engine events, and scheduled jobs, filtered to "ambient" priority only |
| `/api/device/telemetry` | `POST` | Ingest one compressed session digest (Doc 4 §Session Compression): weather readings, camera digest, battery state |
| `/logs` | `POST` | **Already exists.** Used as-is by the Copy button. |

`/api/device/notifications` reuses the same event sources that already
feed the web app's cross-device SSE sync
(`Cross-Device Sync | SSE sync + Settings crash fix`, per
`docs/benchmark/LOT-MANIFEST.md`) — the Cube is simply one more subscriber
to events that already exist, filtered down to the subset of messages
short enough and calm enough to show on a one-line display.

## Data Flow

```
COSMO Cube (firmware)
   │  session digest (compressed)         │  Copy press
   ▼                                       ▼
POST /api/device/telemetry            POST /logs  (existing)
   │                                       │
   ▼                                       ▼
PostgreSQL — new telemetry table      PostgreSQL logs table (existing)
   │                                       │
   └──────────────► feeds QOS / Memory Engine ◄──────────────┘
                              │
                              ▼
                   GET/SSE /api/device/notifications
                              │
                              ▼
                    COSMO Cube display ("Coffee time!")
```

## Offline / Retry Behavior

- Device queues events locally (Doc 4 `session_buffer`) when
  disconnected; flushes in order on reconnect.
- Exponential backoff on connection retry (consistent with this repo's
  own git-push retry convention: 2s, 4s, 8s, 16s).
- Notification messages carry a `ttl_seconds`; if the device reconnects
  after a message's TTL has expired, it is dropped rather than shown
  stale — an ambient notification that arrives late is not ambient
  anymore, it's noise.

## Software Deliverables (kept separate per brief #11)

- **API Client Library** (device-side, C, part of firmware but documented
  separately from the message/render logic in Doc 4)
- **Pairing UI** — new Settings → Devices panel on lot-systems.com
- **Device Management API doc** — full request/response reference for the
  four new endpoints above, written once endpoints are implemented
- **Error Handling & Offline Queue Spec** — retry limits, queue size caps,
  what happens to a Copy press made while permanently unpaired

---

*Previous: [`04-FIRMWARE-SPEC.md`](./04-FIRMWARE-SPEC.md) · Next: [`06-MANUFACTURING-AND-COMPLIANCE.md`](./06-MANUFACTURING-AND-COMPLIANCE.md)*
