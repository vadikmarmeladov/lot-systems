<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® TILE (CT-1) — Software / LOT API Connector Specification

**Document:** COSMO-TILE-SOFTWARE.md
**Parent plan:** [`docs/corporate/LOT-COSMO-TILE-v1.md`](../corporate/LOT-COSMO-TILE-v1.md)
**Classification:** Restricted // S-2 Eyes
**Prepared:** 2026-08-25
**Target:** LOT Systems backend (Fastify + PostgreSQL, per README.md)

---

## 1. Scope

This document specifies the **server-side** half of the CT-1 system —
the code that runs at lot-systems.com, not on the device itself
(firmware is specified separately in
[`COSMO-TILE-FIRMWARE.md`](./COSMO-TILE-FIRMWARE.md), per the parent
plan's Section 11 requirement). It is written against the stack already
described in this repository's README.md (Fastify server, PostgreSQL via
Sequelize, JWT/cookie session management) so that implementation is an
extension of the existing backend, not a parallel service.

---

## 2. Data model (new tables)

```
devices
  id                UUID PK
  user_id           UUID FK → users
  device_type       VARCHAR(32)         'cosmo-tile'
  device_token_hash VARCHAR(255)        hashed, device-scoped auth token
                                          (parent plan Section 06 — NOT
                                          the operator's own session
                                          cookie)
  paired_at         TIMESTAMP
  last_seen_at      TIMESTAMP
  revoked_at        TIMESTAMP NULL

device_notifications
  id                BIGINT PK
  device_id         UUID FK → devices
  payload           VARCHAR(64)          the compressed one-line string
                                          (parent plan Section 06)
  priority          SMALLINT
  source_signal     VARCHAR(64)          e.g. 'qos.maintenance',
                                          'badge.unlock', 'weather.delta'
  created_at        TIMESTAMP
  delivered_at      TIMESTAMP NULL
  acknowledged_at   TIMESTAMP NULL

device_telemetry
  id                BIGINT PK
  device_id         UUID FK → devices
  temperature_c     FLOAT NULL
  humidity_pct      FLOAT NULL
  pressure_hpa      FLOAT NULL
  frame_ref         VARCHAR(255) NULL     pointer to transient frame
                                          storage, never persisted
                                          beyond the operator's own
                                          account (parent plan Section 03)
  received_at       TIMESTAMP
```

`device_notifications.payload` is capped at 64 characters at the schema
level — matching the firmware doc's Section 4 statement that the device
never truncates; the server enforces the budget once, at write time.

---

## 3. API surface

All routes are namespaced under `/api/device/:deviceId/...` and require
the device-scoped bearer token (Section 4), never the operator's own
session JWT.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/device/:deviceId/pair` | One-time pairing: exchanges a short-lived pairing code (shown on-device per firmware doc Section 9) for a long-lived device token |
| `GET` | `/api/device/:deviceId/next` | Returns the next unacknowledged, undelivered `device_notifications` row, or `204 No Content` if the queue is empty |
| `POST` | `/api/device/:deviceId/ack` | Marks a notification acknowledged; writes one Log tab entry (Section 5) |
| `POST` | `/api/device/:deviceId/telemetry` | Accepts a `device_telemetry` row (weather + optional frame reference) |
| `DELETE` | `/api/device/:deviceId` | Operator-initiated unpair/revoke, callable from the operator's own authenticated session (not the device) — from Settings, not from the device itself |

Existing precedent: `GET /api/public/profile/:userIdOrUsername` (README.md,
"Public Profile System") establishes the pattern of a scoped, unauthenticated-by-default
read path with explicit privacy gating — the device routes above follow
the same file/route placement convention (`src/server/routes/device-api.ts`,
mirroring `src/server/routes/public-api.ts`).

---

## 4. Auth

- Pairing issues a device-scoped token (Section 2, `device_token_hash`),
  distinct from the operator's session cookie (README.md: `JWT_SECRET`,
  `JWT_COOKIE_KEY`) — this is the same separation of concerns already
  used for API-key-based integrations elsewhere in the platform.
- Token is bcrypt/argon2-hashed at rest, exactly like the existing
  password storage pattern implied by the auth module.
- `DELETE /api/device/:deviceId` (operator-authenticated) sets
  `revoked_at`; any subsequent device call with that token returns `401`,
  which the firmware doc (Section 3) already specifies as the trigger
  back into the `PAIRING` state.

---

## 5. Session compression job

A background job (same job-runner class already used elsewhere in the
platform per README.md's QOS "Background monitor") runs on a short
interval (candidate: every 60s, faster than the 30-min QOS-wide cadence
because pager-class latency is the whole point — see firmware doc
Section 4) and, for every paired device with `last_seen_at` recent:

1. Reads that operator's current Index of Systems state (QOS mode,
   badge queue, memory-question readiness, weather delta) — the same
   state already computed for the web app, not a second computation.
2. Applies a priority ordering (badge > memory-question > weather >
   QOS-mode nudge) and picks **at most one** candidate.
3. Compresses it to a ≤64-char string (parent plan Section 06) using a
   fixed template per `source_signal` type — e.g.
   `qos.maintenance` → `"{{ritual}} time!"` (the "Coffee time!" example
   from the parent plan, Section 04, is one instantiation of this
   template with `ritual = "Coffee"` pulled from the operator's own
   Memory Story per README.md's Memory Engine).
4. Writes one `device_notifications` row. If an unacknowledged row
   already exists for that device, the job does not enqueue a second one
   — the one-at-a-time render rule (parent plan Section 04) is enforced
   here, not left to the firmware to deduplicate.

This job is the literal implementation of "compress the information in
each session" (parent plan Section 06, item 8 of the original brief):
the operator's full, stateful Index of Systems goes in; one disposable
line comes out; nothing about the compression logic is ever sent to or
stored on the device itself.

---

## 6. Log tab write-back

`POST /api/device/:deviceId/ack` writes to the **same** Log entity the
web app's Log tab already reads (LOT_PRODUCT_BENCHMARK.md confirms a
"Log tab click area" exists in the current app) — this is an additive
write path into existing storage, not a new Log system. The entry
records: `payload` text, `source_signal`, device local ack timestamp,
and a `source: 'cosmo-tile'` marker so the operator can distinguish
physical acknowledgments from in-app ones when browsing their Log.

---

## 7. Rate limits & abuse gates

- `GET /next`: max 1 request per 10s per device (firmware polls at 30s —
  this leaves headroom without allowing a compromised device to hammer
  the endpoint).
- `POST /telemetry`: max 1 frame reference per 60s per device — matches
  firmware's own capture-gating (firmware doc Section 7), enforced again
  server-side so a firmware bug cannot turn into a storage-cost problem.
- All device routes inherit the platform's existing rate-limit and
  fingerprint middleware (README.md: "Security middleware ✓ OPERATIONAL
  (rate limit, fingerprint, CSP)").

---

## 8. Repository layout (implementation phase — not yet created)

```
src/server/routes/device-api.ts       Routes from Section 3
src/server/utils/device-auth.ts       Token issue/verify/revoke (Section 4)
src/server/jobs/device-compress.ts    Session compression job (Section 5)
migrations/<timestamp>_add-device-tables.cjs   Section 2 schema
```

Mirrors the existing `src/server/routes/public-api.ts` and job-runner
conventions already in the codebase; no new backend framework or queue
system is introduced for CT-1.

---

*Parent plan: [`docs/corporate/LOT-COSMO-TILE-v1.md`](../corporate/LOT-COSMO-TILE-v1.md) · BOM: [`COSMO-TILE-BOM.md`](./COSMO-TILE-BOM.md) · Firmware: [`COSMO-TILE-FIRMWARE.md`](./COSMO-TILE-FIRMWARE.md)*
