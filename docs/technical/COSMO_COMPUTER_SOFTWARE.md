<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Software / LOT API Connector Specification

**Document:** COSMO_COMPUTER_SOFTWARE.md
**Classification:** Restricted // S-2 Eyes — Technical Specification
**Prepared:** August 9, 2026
**Status:** v0.1 — draft, precedes Phase 2 prototype (see LOT_COSMO_COMPUTER.md Section 07)
**Parent document:** `docs/corporate/LOT_COSMO_COMPUTER.md` (hardware plan, BOM, roadmap)
**Sibling document:** `docs/technical/COSMO_COMPUTER_FIRMWARE.md` (on-device firmware)

---

## 01 // SCOPE

This document specifies how the COSMO® Computer talks to lot-systems.com.
It extends the existing Fastify API surface (`src/server/routes/api.ts`,
`src/server/routes/os-api.ts`) rather than standing up a parallel
service. It does not specify on-device firmware behavior (that is
`COSMO_COMPUTER_FIRMWARE.md`) or the physical BOM (`LOT_COSMO_COMPUTER.md`).

Existing routes referenced as prior art for this spec:

  `GET  /api/logs`           — reads a user's Log tab entries
  `POST /api/logs`           — creates a Log tab entry, body:
                                `{ text, event?, metadata? }`
                                (`src/server/routes/api.ts` line 1563)
  `GET  /api/weather`        — existing weather endpoint (`api.ts` line 1038)
                                — the COSMO Computer's on-board BME280
                                reading is a *device-local* signal, distinct
                                from this site-level weather call; the two
                                are not the same data path and are not
                                merged in this spec
  `GET  /api/os/status`      — existing OS status surface (`os-api.ts`)

---

## 02 // DEVICE PAIRING

A COSMO Computer unit is useless until paired to exactly one LOT profile.
Pairing is a one-time, user-initiated flow — never automatic, never
silent:

```
1. Operator opens lot-systems.com → Settings → "Pair a COSMO Computer"
   (new UI surface, out of scope for this doc — companion-app-adjacent
   work, not firmware or API work)
2. Site generates a short-lived pairing code (6 digits, 10 min TTL)
3. Operator enters the code via the device's own minimal onboarding
   flow (device ships in an unpaired state, screen shows the pairing
   code prompt only — no other function until paired)
4. Device POSTs the code to /api/device/cosmo/pair
5. Server validates the code against the requesting session, mints a
   long-lived device token, returns it once
6. Device stores the token in flash (this is the ONE piece of
   persistent secret state on the device); token is never re-issued
   without a new pairing flow
```

Unpairing (from the site, at any time) immediately invalidates the
token server-side — the device continues to try its stored token, gets
401, and reverts to its unpaired onboarding state. This is the "instant
and permanent" disconnection behavior `LOT_ROBOTICS_COSMO.md` requires
of the COSMO® brand generally.

### 02.1 — New endpoint: pairing

```
POST /api/device/cosmo/pair
  Body:   { pairingCode: string, deviceId: string }
  Auth:   none (the pairing code itself is the credential, TTL-limited)
  Reply:  { deviceToken: string, userId: string }
  Errors: 400 invalid/expired code, 409 device already paired elsewhere
```

### 02.2 — Device auth for all subsequent calls

All other `/api/device/cosmo/*` routes require:
```
Authorization: Bearer <deviceToken>
```
resolved by a new Fastify `preHandler` (device-token auth, sibling to
whatever resolves `req.user` for the existing session-based routes) that
maps `deviceToken → userId` and populates `req.user` the same way, so
the existing `Log.create({ userId: req.user.id, ... })` pattern in
`api.ts` line 1577 needs no modification to be reused by device-authed
requests.

---

## 03 // INBOUND — PAGER DELIVERY (parent doc Section 04.1)

```
GET /api/device/cosmo/pager
  Auth:   device token
  Query:  ?since=<lastMessageId>   (long-poll style; empty on first call)
  Reply:  { message: string | null, messageId: string | null,
            ttlSeconds: number }
```

**Delivery model:** long-poll first (server holds the connection open up
to N seconds waiting for a new message, replies immediately if one is
already pending), falling back to short-interval polling if the ESP32-S3
Wi-Fi stack proves the long-poll pattern unreliable in Phase 2 prototype
testing (open question, `COSMO_COMPUTER_FIRMWARE.md` Section 04). This
endpoint is a thin wrapper — it does not generate messages, it reads from
the same Index of Systems signal queue the AI-driven notification system
already writes to (the same source CUBIQ's hardware driver reads from,
per `LOT-CUBIQ-QUANTUM-CUBE-v0.md` Section 05 — the two hardware tracks
consume the *same signal queue* through different device-specific
adapters, they do not duplicate signal generation).

`ttlSeconds` tells the firmware how long to keep the message on Face B
before clearing it (e.g. "Coffee time!" is stale after an hour and should
not linger indefinitely).

---

## 04 // OUTBOUND — COPY BUTTON → LOG TAB (parent doc Section 04.2)

```
POST /api/device/cosmo/copy
  Auth:   device token
  Body:   { messageId: string, ts: number }
  Reply:  { logId: string }
```

Server-side, this is a thin translation into the existing log-creation
path (`api.ts` line 1563 `POST /logs`):

```js
Log.create({
  userId: req.user.id,
  text: `${originalMessageText}`,
  event: 'hw_copy',
  metadata: { deviceId, messageId, sourceTs: ts },
  context,
})
```

`event: 'hw_copy'` is a new Log event type, additive to whatever enum/
union already governs `event` values in the Log model — it does not
replace or repurpose `'note'` or any existing type. `Logs.tsx` gains one
new military-format handler for this event class (naming convention:
`HWCOPY:`, consistent with the existing `MCOHERE:` / `CEXP:` / `BIOARC:`
handler family already in that component) — rendering work, not scoped
in this document.

---

## 05 // OUTBOUND — COMPRESSED SESSION FLUSH (parent doc Section 05)

```
POST /api/device/cosmo/session
  Auth:   device token
  Body:   {
    deviceId: string,
    sessionStart: number, sessionEnd: number,
    messagesDisplayed: [ { id: string, ts: number } ],
    copyEvents: [ { messageId: string, ts: number } ],
    sensorSummary: {
      tempAvg: number, humidityAvg: number,
      pressureAvg: number, lightAvg: number
    },
    cameraTriggers: number
  }
  Reply:  { accepted: true }
```

This is a new signal source into the same Calibration Loop the Memory
Engine already runs (raw event → compressed arc). It is **not** written
directly as Log entries — a flush here does not create 100 log lines, it
creates one compressed record consumed by the existing pattern-analysis
pipeline, matching the "compress the information in each session"
requirement (build brief item 8) at the transport layer, not just the
on-device layer already described in the firmware doc.

---

## 06 // CAMERA OPT-IN GATE (parent doc Section 04.3)

A profile-level flag, set by the operator on lot-systems.com (not on the
device — the device has no settings UI, per `COSMO_COMPUTER_FIRMWARE.md`
Section 03.2), governs whether a captured still frame may ever leave the
device:

```
GET /api/device/cosmo/camera-policy
  Auth:   device token
  Reply:  { attachEnabled: boolean }
```

Firmware checks this before any upload attempt following a long-press
capture (`COSMO_COMPUTER_FIRMWARE.md` Section 03.3). If `attachEnabled`
is `false` (the default), the captured frame is used for the on-device
presence-check function only and is never transmitted — discarded after
the local check completes. This is enforced server-side too: an upload
attempt against a profile with `attachEnabled: false` is rejected, not
merely discouraged, so a firmware bug cannot silently violate the policy.

---

## 07 // COMPANION SOFTWARE (item 10 — "software to connect with firmware")

Two surfaces, both extensions of the existing lot-systems.com app, not
new applications:

1. **Pairing + settings UI** (Section 02, Section 06's toggle) — a new
   panel under the existing Settings surface.
2. **Device status widget** — read-only view of the device's last-seen
   time, battery/charge state (from the most recent session flush,
   Section 05), and a manual "send test pager message" action for
   operators debugging their own unit.

No standalone desktop/mobile companion binary is specified for v0.1 — the
existing web app is the companion software. A native companion app is an
explicit non-goal for the pilot run (100 units); revisit only if pilot
feedback shows the web surface insufficient.

---

## 08 // OPEN QUESTIONS FOR PHASE 2 (PROTOTYPE)

```
[ ]  Confirm long-poll timeout budget against ESP32-S3 Wi-Fi
     stack behavior (Section 03) — may need to fall back to
     short-interval polling.
[ ]  Decide the device-token preHandler's relationship to
     existing session-cookie auth — new middleware chain or a
     branch inside the existing one (implementation detail,
     resolve against the current auth code in Phase 2).
[ ]  Define the OTA update check payload (referenced in
     COSMO_COMPUTER_FIRMWARE.md Section 04) as a field on the
     existing /api/device/cosmo/pager response, or a separate
     endpoint — pending Phase 2 findings on update frequency.
[ ]  Confirm Log model's `event` field is a free-form string or
     a constrained enum before adding 'hw_copy' — if constrained,
     needs a migration.
```

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END COSMO_COMPUTER_SOFTWARE
================================================================================
