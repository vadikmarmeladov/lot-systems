<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Software Integration Spec (LOT API Connector)

**Document:** COSMO-CUBE-SOFTWARE-INTEGRATION.md
**Classification:** Public — Engineering Reference
**Prepared:** 2026-07-17
**Status:** SPEC — describes a `/api/device/*` surface that does NOT exist
yet in `src/server/routes/`. Written against the real, current LOT backend
conventions (Fastify + Sequelize + the existing `Log` model), so it can be
implemented directly.

---

## Why a new API surface (not the existing session-cookie API)

The current LOT backend (`src/server/routes/api.ts`, `os-api.ts`,
`admin-api.ts`) authenticates via HTTP-only session cookies — correct for a
browser, unusable by a microcontroller. `public-api.ts` is unauthenticated
and read-only (status, profile). Neither fits a physical device that must
authenticate itself over months without a login form.

**Proposal:** a new route file, `src/server/routes/device-api.ts`, mounted at
`/api/device/*`, authenticated by a long-lived **device token** (not a user
session) issued once during pairing.

## Data model additions (new, not yet in `prisma`/Sequelize models)

```
Device {
  id            string (uuid, pk)
  userId        string (fk -> User.id)
  deviceToken   string (hashed at rest, like a password)
  label         string           // "Vadik's desk Cube"
  cameraOptIn   boolean  default false
  lastSeenAt    datetime
  firmwareVersion string
  createdAt     datetime
}
```

One `User` can own multiple `Device` rows (desk + nightstand, etc.). This is
additive — no change to the existing `User` or `Log` models required.

## Pairing flow

1. On first boot with no stored token, firmware opens a SoftAP
   (`COSMO-CUBE-XXXX`) or BLE advertisement.
2. User's phone/laptop connects, is redirected to a small local pairing page
   served by the device (or to lot-systems.com with a pairing code shown on
   the device's 240x240 screen — preferred, since it reuses the existing
   auth session instead of building a second login surface).
3. User, already logged into lot-systems.com, enters the code shown on the
   device at a new page (e.g. `/pair-device`).
4. Server generates a `Device` row + token, sends the token to the device
   over the local pairing channel, done. Token never appears in the LOT web
   UI again after pairing (shown once, like an API key).

This mirrors the existing pattern in `public-api.ts`'s `/verify-api-keys`
endpoint of never re-displaying a secret once issued — same principle,
applied to a device credential instead of a server env var.

## New endpoints (`src/server/routes/device-api.ts`)

All device endpoints require header `Authorization: Bearer <deviceToken>`,
verified against the hashed token on the `Device` row, and update
`Device.lastSeenAt` on every call.

### `GET /api/device/notify`
Poll endpoint (called every ~30s by firmware, per FIRMWARE-SPEC).

```json
// response, nothing pending:
{ "hasNotification": false }

// response, message pending:
{
  "hasNotification": true,
  "id": "ntf_8f2a1c",
  "text": "Coffee time!",
  "ttlSeconds": 20
}
```

Server-side, this reads from a small new `DeviceNotification` queue table
(or reuses the existing `LiveMessage` model already used for the site's
real-time sync feature at `/api/sync` — see `routes/api.ts` line ~324 — which
is the closer architectural fit since LOT already has a live-message
pipeline; a device row would just be another subscriber, filtered to short
strings only).

The text truncation/compression referenced in FIRMWARE-SPEC happens here,
server-side: whatever triggers a notification (Quantum Intent Engine
pattern, a scheduled job, a manual "send to my Cube" action) is compressed
to a short line **before** it is queued, not on-device.

### `POST /api/device/copy`
The physical "Copy" button (requirement #16). Body: `{ "notificationId": "ntf_8f2a1c" }`.

Server action — using the existing, already-shipped `Log` model exactly as
every other feature in this codebase does (see `routes/api.ts`, e.g. the
`chat_message` / `settings_change` / `badge_unlock` log-write patterns):

```ts
await fastify.models.Log.create({
  userId: device.userId,
  event: 'cosmo_cube_copy',
  metadata: { notificationId, deviceId: device.id, deviceLabel: device.label },
})
```

Because this is a normal `Log` row with a normal `event` type, it needs
**zero changes** to the existing `GET /api/logs` endpoint or the Log tab UI
— it already lists whatever is in the `Logs` table for that user. The new
`event` value just needs to be added to that endpoint's allow-list of
"displayable events" if one exists (check `displayableEvents` around
`routes/api.ts` line ~1126 at implementation time) and given a one-line
display format ("Copied — Coffee time!") in the Log tab's client-side
renderer.

### `POST /api/device/telemetry`
Body: `{ "temperature": 21.4, "humidity": 44, "pressure": 1013, "gasResistance": 52000 }`

Stored the same way the site already stores weather data
(`models.WeatherResponse`), or a new lightweight `DeviceTelemetry` row keyed
by device — implementation detail, low risk either way. Feeds the Quantum
Intent Engine as one more signal source, alongside the 8 pipelines already
listed in `docs/technical/LOT_SYSTEMS_BRIEF.md` (mood, memory, planner,
intentions, selfcare, journal, energy, cohort). This would be signal
source #9: **device** — local environment).

### `POST /api/device/pair` and `POST /api/device/unpair`
Pairing/unpairing as described above. Unpair must be instant and irreversible
from the account side — same "disconnection is instant and permanent"
principle already stated for COSMO® robotics in
`docs/corporate/LOT_ROBOTICS_COSMO.md`.

### `GET /api/device/camera-opt-in`
Returns `{ "enabled": <Device.cameraOptIn> }`. Firmware checks this before
ever allowing a capture, per the dual-gate described in FIRMWARE-SPEC (both
server AND device-local toggle must be true).

---

## Companion software (desk/phone side)

Two small pieces, not part of the main lot-systems.com bundle:

1. **Pairing page** (`/pair-device`) — a page within the existing React app
   (`src/client`), same auth/session as everything else. Not a new app.
2. **CLI/flash tool** — a small Node script under `scripts/` (mirroring the
   existing `scripts/db-admin.ts`-style utility pattern already in this
   repo) to flash firmware + inject Wi-Fi credentials during Phase 1/2
   bench work, before a production flashing jig exists for Phase 4.

No separate mobile app is required for v1 — the device pairs through the
existing website, and the Log tab (already built) is the only "app" a user
needs to see Copy acknowledgments.

---

## Security notes

- Device tokens are bearer tokens over HTTPS only — same TLS posture as the
  rest of the site (`docs/security/SECURITY.md` conventions apply).
- Tokens are hashed at rest (bcrypt, matching the password-hashing approach
  already used for `User` per `LOT_SYSTEMS_BRIEF.md`), not stored plaintext.
- Rate-limit `/api/device/*` per-token, same posture as the existing
  API-endpoint throttling mentioned in `LOT_SYSTEMS_BRIEF.md`.
- Camera capture is opt-in on both sides (see above) — no device ships with
  an active always-on camera path.

---

*This spec describes new server code that does not exist yet in this
repository. Implementation is scoped for Phase 1/2 of the roadmap in
`COSMO-CUBE-PLAN.md`, once real hardware exists to test against.*
