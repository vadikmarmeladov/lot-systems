<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — SOFTWARE SPECIFICATION (LOT-SYSTEMS.COM SIDE)
(SEPARATE DOCUMENT, PER BRIEF PT.10/11)
================================================================================

DOCUMENT    SOFTWARE-SPEC / LOT-COMPUTER v0.1 (DRAFT)
ISSUE DATE  2026.07.27
PARENT      LOT-COMPUTER-PRODUCT-SPEC.md
COUNTERPART LOT-COMPUTER-FIRMWARE-SPEC.md (device side of the same link)
STYLE       TERMINAL GRID

================================================================================

## 00  SCOPE

Everything that runs in THIS repository (the lot-systems.com Fastify/
Postgres backend) to give LOT Computer something to talk to. This is new
server surface — repository research this session (grep across `src/`)
confirmed none of it exists yet:

```
Checked                                  Result
───────                                  ──────
Push/webhook/SSE channel to a client       NOT FOUND — net new
Device-auth / API-key intake endpoint       NOT FOUND — net new
M2M protocol implementation                  SPEC ONLY — docs/corporate/
                                             LOT-TERMINAL-M2M.md, no route/
                                             model backs it today
Existing Log tab + API                       EXISTS — reused, not rebuilt
```

Stack this builds on (unchanged): Node.js + TypeScript, Fastify 5,
PostgreSQL via Sequelize, JWT auth — same as the rest of the app
(`docs/technical/LOT_SYSTEMS_BRIEF.md` "Core Technology Stack").

================================================================================

## 01  EXISTING SURFACE THIS REUSES

```
Log tab (frontend)     src/client/components/Logs.tsx
Log queries (frontend)  src/client/queries.ts:134 (useLogs), :144 (useUpdateLog)
Log routes (backend)     src/server/routes/api.ts:1082  GET /api/logs
                         (+ cleanup/delete family nearby, unrelated to this work)
Log model                src/server/models/log.ts
OS API precedent          docs/technical/OS_API.md (`/api/os/*` — pattern to
                         follow for a new `/api/device/*` namespace, not a
                         route to modify)
M2M protocol shape        docs/corporate/LOT-TERMINAL-M2M.md (JSON formats
                         1–3 — Format 3 "Multi-Sensor Array" is what LOT
                         Computer's sensor loop sends, unmodified)
Sync auth pattern          docs/corporate/LOT-TERMINAL-SYNC.md Layer 1
                         (JWT-based operator token, 30-day expiry, rotation)
```

Nothing above is edited by this plan. LOT Computer is additive — a new
`/api/device/*` namespace alongside the existing `/api/os/*` and
`/api/logs` surfaces, written once firmware exists to call it (ROADMAP §02).

================================================================================

## 02  NEW SURFACE — `/api/device/*`

### 02.1  Pairing

```
POST /api/device/pair
  body:  { pairing_code }        // short code shown once, out-of-band
                                  // (e.g. printed on a card in the box, or
                                  // shown briefly on the device's own OLED
                                  // at first boot)
  auth:  user's existing session (paired FROM the logged-in web app)
  →      { device_id, device_token }
```

New table: `devices` (id, user_id FK, device_id, hw_rev, paired_at,
last_seen_at, status). One user can pair multiple LOT Computer units.

### 02.2  Notification push

```
Server-internal (called by Memory Engine / QIE, not a public route):
  queueDeviceNotification(userId, text)   // text <=24 chars, plain

Device polls or holds a long-lived connection:
  GET /api/device/notifications/next      (device-token auth)
  →  { text, notification_id } | 204 No Content
```

v1 uses short-interval polling (device-side, ~15s while on WiFi and idle),
not a persistent WebSocket — matches FIRMWARE-SPEC §02.6 power-state model
and avoids standing up new realtime infrastructure (the app's existing
realtime pattern is SSE for browser sessions, `LOT_SYSTEMS_BRIEF.md`
"Infrastructure"; a battery device polling every 15s is simpler and cheaper
than holding either an SSE or WebSocket connection open 24/7). Real-time
WebSocket delivery (as sketched in `LOT-TERMINAL-SYNC.md` "Real-Time Mode")
remains the documented future path if latency requirements tighten.

New table: `device_notifications` (id, user_id FK, device_id FK, text,
created_at, delivered_at, source — e.g. `memory_engine`, `qie`, `manual`).

### 02.3  Copy button → Log tab

```
POST /api/device/copy
  body:  { notification_id, pressed_at }
  auth:  device-token
  →  writes one row via the EXISTING log model (src/server/models/log.ts),
     event: 'device_copy', metadata: { device_id, notification_id, text }
```

This is the one point where LOT Computer writes into a surface a human
already uses — the Log tab. It calls the same model the web app's own log
write path uses; no parallel log table, no special-cased device log view.
The UI-side glyph/badge for "this entry came from a device" is a Logs.tsx
rendering concern, out of scope for this backend spec.

### 02.4  Sensor intake

```
POST /api/device/telemetry
  auth:  device-token
  body:  LOT-TERMINAL-M2M.md "Format 3: Multi-Sensor Array", unmodified —
         { device_id, operator, device_type, timestamp, sensors[], ... }
  →      writes to a new `device_telemetry` table, keyed by device_id
```

Deliberately byte-compatible with the M2M spec that already exists in this
repo's documentation, so a future open-source LOT Terminal device and a
factory LOT Computer unit can share one intake shape.

### 02.5  OTA

```
GET /api/device/firmware/latest?hw_rev=...
  →  { version, url, sha256 }   // device fetches + verifies + flashes
```

Signed/checksummed, never auto-forced — device firmware chooses when to
apply (FIRMWARE-SPEC §01, "never pushed blind").

================================================================================

## 03  ADMIN TEST HARNESS (PHASE 1 EXIT CRITERION, ROADMAP §02)

Before any physical unit exists, all four endpoints above must be
exercisable from `curl`/Postman against a test account:
1. Pair a fake device.
2. Queue a notification, poll it back.
3. POST a fake Copy event, confirm a Log entry appears via `GET /api/logs`.
4. POST a fake M2M telemetry payload, confirm it lands in `device_telemetry`.

================================================================================

## 04  SECURITY NOTES

- Device tokens are bearer tokens scoped ONLY to `/api/device/*` — a
  compromised device cannot use its token against the user-session API
  surface. Enforced at the Fastify auth-decorator level, not by convention.
- `pairing_code` is single-use and short-lived (analogous to a password
  reset token, per existing "time-limited tokens" pattern in
  `LOT_SYSTEMS_BRIEF.md` "Data Protection").
- No image data leaves the device in v1 (FIRMWARE-SPEC §02.1) — so no new
  media-storage/privacy surface is needed on the server side yet.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SOFTWARE SPECIFICATION — DRAFT v0.1                          2026.07.27
================================================================================
