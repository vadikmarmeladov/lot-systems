<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Software (LOT API Connector)

## Classification: RESTRICTED // S-2 EYES

**Companion to:** [../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
**Kept separate from:** [COSMO-CUBE-FIRMWARE.md](./COSMO-CUBE-FIRMWARE.md) — this
document covers everything that is not on the device: the server-side
device API surface, the pairing web flow, and the auth lifecycle the
firmware's `net_client.c` and `pairing.c` call into.

**Date:** 2026-09-04
**Status:** SPEC — endpoints below are additive to the existing Fastify
API in `src/server/routes/api.ts`; none of them exist yet.

---

## 1. Where this sits in the existing stack

The Cube is a new client of the same backend every other LOT surface
already talks to (docs/assembly/LOT-GENESIS-v1.md, Node 2 — Fastify 5 +
PostgreSQL). No new service, no new database. Three additions:

1. A `Device` model (new) — one row per paired Cube, holding `device_id`,
   `userId` (FK -> existing `User`), a hashed device token, and
   `lastSeenAt`.
2. Two or three new routes under the existing `PROTECTED` route group in
   `src/server/routes/api.ts` (Section 2 below), authenticated by the
   device token instead of the browser session cookie.
3. One whitelist edit — `device_copy` (and optionally
   `device_notification_ack`) added to the `displayableEvents` array
   (`src/server/routes/api.ts`, ~line 1084) so Copy-button Log rows
   surface in `GET /api/logs` the same as every other event type.

---

## 2. Device API surface (new)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/device/pair` | provisioning token (short-lived, Section 4) | Exchange a provisioning token for a long-lived device token |
| GET | `/api/device/notify` | device token | Poll for a pending pager message (Section 3) |
| POST | `/api/device/weather` | device token | Submit a BME280 reading (Section 5) |
| POST | `/api/logs` | device token (resolved to `userId` server-side) | Copy-button event (existing endpoint, reused as-is) |

`GET /api/live-message` and the existing `/api/sync` SSE stream
(docs/assembly/LOT-GENESIS-v1.md, Node 4) are reused unmodified as the
fallback/broadcast path — the Cube is one more subscriber, not a new
protocol.

### 2.1 GET /api/device/notify

```
GET /api/device/notify
Authorization: Bearer <device token>
```

```json
{
  "text": "Coffee time!",
  "event_class": "self_care_complete",
  "ttl_s": 900
}
```

Server-side, this handler composes from the same signal sources the web
client already reads (Memory Engine question-ready state, `LiveMessage`,
recent `badge_unlock` rows) and picks at most one, truncated to 60
characters — the compression step described in Section 6.

### 2.2 POST /api/device/weather

```
POST /api/device/weather
Authorization: Bearer <device token>
Content-Type: application/json

{
  "device_id": "cosmo-cube-000041",
  "device_type": "environmental_monitoring",
  "sensors": [
    { "type": "temperature", "value": 22.4, "unit": "celsius" },
    { "type": "humidity", "value": 41, "unit": "percent" },
    { "type": "pressure", "value": 1012.8, "unit": "hPa" }
  ],
  "timestamp": "2026-09-04T14:02:11Z"
}
```

This is LOT-TERMINAL-M2M.md's "Format 3: Multi-Sensor Array" verbatim —
no new JSON shape invented. Server-side, the handler upserts into the
existing `WeatherResponse` model (docs/assembly/LOT-GENESIS-v1.md,
Node 3) keyed by the operator's `userId`, giving the profile a
first-party local reading instead of only the geocoded API fetch.

---

## 3. POST /api/logs — Copy button (reused endpoint)

No new route. The device token middleware (Section 4) resolves to the
paired `userId` and the request proceeds through the exact existing
handler:

```
POST /api/logs
Authorization: Bearer <device token>
Content-Type: application/json

{
  "text": "COSMO Cube — Copy pressed",
  "event": "device_copy",
  "metadata": {
    "device_id": "cosmo-cube-000041",
    "battery_pct": 82,
    "last_notification": "Coffee time!"
  }
}
```

`fastify.models.Log.create(...)` runs unmodified
(`src/server/routes/api.ts`, existing `POST /logs` handler) — the only
change anywhere in this pipeline is the whitelist edit named in Section 1
and the new auth middleware in Section 4 that lets a device token stand
in for a browser session on this one route.

---

## 4. Auth lifecycle — device token, not user session

The device never holds the operator's password, magic-link, or browser
session cookie. It holds a device-scoped bearer token, modeled on
LOT-TERMINAL-M2M.md's `operator_token` pattern:

```
PAIRING (once)
  1. Operator opens lot-systems.com/settings, clicks "Pair COSMO Cube".
  2. Server mints a provisioning token (5-minute TTL, single-use),
     rendered as a QR code + short PIN fallback.
  3. Firmware's BLE pairing flow (COSMO-CUBE-FIRMWARE.md, Section 6)
     receives the provisioning token + Wi-Fi credentials from the
     operator's phone.
  4. POST /api/device/pair { provisioning_token, wifi_ssid_hash } ->
     server verifies, creates a Device row (userId, device_id, hashed
     long-lived token), returns the token once. Firmware stores it
     encrypted (COSMO-CUBE-FIRMWARE.md, Section 7).

RUNTIME
  Every device-token request resolves through a new Fastify
  preHandler — analogous to the existing session preHandler, but
  looking up `Device` by hashed token instead of `Session` by cookie —
  and attaches `req.user` the same way, so every downstream handler
  (including the reused POST /api/logs) sees a normal authenticated
  request.

REVOCATION
  Operator can unpair from lot-systems.com/settings at any time —
  deletes the Device row, next device-token request 401s, firmware
  falls back to PAIRING mode on repeated 401.
```

---

## 5. Weather delivery — recap

Covered fully in Section 2.2. No separate document needed; recorded
here only because the intake brief lists "weather sensor" as its own
numbered item — the design decision is: reuse the existing
`WeatherResponse` model and the M2M "Format 3" JSON shape rather than
create a parallel weather pipeline.

---

## 6. Session compression — applying the Memory Engine doctrine

docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md's doctrine —
"Each answer compresses the profile. Each compressed profile produces a
sharper question" — is applied here to device sessions, not just Memory
Engine answers:

- A **device session** is one Wi-Fi-associated window (wake -> poll/push
  -> sleep, or one on-charge low-latency window).
- Rather than storing every poll as a Log row (which would flood the
  Log tab with near-duplicate `weather_update`/no-op rows), the server
  compresses each session to **at most one** summary write: the single
  most recent notification actually rendered, plus any Copy-button
  presses (which are meaningful operator actions and are never
  compressed away).
- This mirrors `getLogContext` in `src/server/utils/logs.ts` — context
  is attached once, at write time, not accumulated as a growing blob —
  and keeps the Cube's Log-tab footprint proportional to operator
  action, not to poll frequency.

---

## 7. Companion phone app (pairing UI only, v1.0 scope)

v1.0 needs no standalone native app. Pairing (Section 4) runs entirely
in the operator's mobile browser via Web Bluetooth, served from
lot-systems.com/settings — one more route on the existing React client
(docs/assembly/LOT-GENESIS-v1.md, Node 11), not a new codebase. A native
app is out of scope for v1.0, consistent with the "smallest true
computer first" principle in docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md,
Section 01.

---

**Companion documents:** [../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md) · [COSMO-CUBE-FIRMWARE.md](./COSMO-CUBE-FIRMWARE.md) · [../corporate/LOT-COSMO-CUBE-BOM.md](../corporate/LOT-COSMO-CUBE-BOM.md)

**Authorized by:** S-2 // Vadik Marmeladov
