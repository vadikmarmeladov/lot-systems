<!--
  LOT SYSTEMS CORPORATION — brand.lot-systems.com
-->

# LOT COMPUTER — LOT API connector

This is the contract between firmware (`04-FIRMWARE.md`) and
lot-systems.com. **Nothing in this document has been implemented on the
server in this session** — this is the spec a future engineering session
implements against, written so that session doesn't have to re-derive the
architecture. Existing pieces it hooks into, all already live in this
repo:

- `src/server/models/log.ts` — `Log` model: `userId, text, event, metadata,
  context`. Every device event below is one `Log` row.
- `src/server/routes/api.ts` — where a new `hw` sub-router mounts.
- Backend Whitelist Hygiene (`docs/benchmark/LOT-DOCTRINE.md`): any new
  `event` value (`hw_copy_signal`, `hw_paired`, `hw_visual_log`) must be
  added to the `displayableEvents` whitelist or it writes but never
  renders in the Log tab — this is the single most common way this kind
  of integration silently half-works.
- `useLogs()` (`src/client/queries.ts`) — client already renders whatever
  the API returns; no client change needed beyond the whitelist entry and
  a COCKPIT-RULE `formatLog()` case for each new event type (same pattern
  as `plan_set`, `qi_rfi`, `assembly_directive`).

## Auth model

Device is not a user session. It authenticates with a long-lived **device
token**, scoped to exactly one `userId`, issued at pairing time and
revocable from the operator's Settings (a "Devices" panel — not built yet,
listed as a dependency below). Device token travels as a bearer header,
never the operator's own JWT/session cookie — a lost or stolen device
should be revocable without touching the operator's login.

## Pairing

1. Operator opens Settings → Devices → "Pair a LOT COMPUTER" on
   lot-systems.com (new UI, not built).
2. Server generates a short-lived (5 min) pairing code, renders it as a QR
   containing `{pairingCode, apiHost}`.
3. Device camera scans it (`04-FIRMWARE.md` §Camera driver), POSTs to
   `POST /api/hw/pair` with the code.
4. Server validates the code, mints a device token bound to that `userId`
   and a generated `deviceId` (`LOT-COMPUTER-0042` style, matches the Log
   body format in `01-PLAN.md` §5), returns the token once. Device stores
   it in NVS (encrypted flash), never transmits it again in plaintext.
5. Server writes a `hw_paired` Log event so pairing itself is visible in
   the operator's own Log — consistent with this repo's general principle
   that anything that changes account state should be legible in the
   record, not just in an admin table.

## Endpoints (new, under `/api/hw/`)

### `POST /api/hw/pair`
Body: `{ pairingCode }`. Returns: `{ deviceToken, deviceId }`. Unauthenticated
(the pairing code itself is the short-lived credential).

### `GET /api/hw/notifications`
Auth: device token. Returns the newest unread notification for this
`userId`, or empty. Response:
```json
{ "text": "Coffee time!", "id": "uuid", "createdAt": "..." }
```
Server caps `text` at 40 chars (`04-FIRMWARE.md` §Display driver) —
truncate before this response leaves the server, not on-device, so the
truncation logic lives in one place. Marking-read semantics: server marks
the returned notification (and any older queued ones) read as soon as it
is served, matching the "one notification renders per wake, no queue UI"
decision in `04-FIRMWARE.md`.

Source of the notification text: the same Memory Engine / QOS pipeline
that already produces `assembly_directive` (`src/server/routes/api.ts`
`/assembly` handler) is the natural generator — a new short-form prompt
variant ("one pager-length line, present tense, no punctuation flourish")
rather than a new AI pipeline. Reuses the existing 5-provider AI engine
abstraction (`README.md` §AI Vendor Independence) and its fallback chain.

### `POST /api/hw/log`
Auth: device token. Body:
```json
{
  "event": "hw_copy_signal",
  "metadata": { "battPct": 81, "tempC": 21.4, "rhPct": 38 }
}
```
Server resolves `userId` from the device token, writes one `Log` row.
`event` must be one of a fixed enum (`hw_copy_signal`, `hw_visual_log`,
`hw_env_sample`) — device cannot write an arbitrary event string. Body
format on render follows COCKPIT-RULE (`01-PLAN.md` §5 shows the target
rendered form).

### `POST /api/hw/visual-log` (opt-in feature, `01-PLAN.md` §Camera)
Auth: device token. Multipart body: single JPEG. Requires the operator's
per-device opt-in flag (stored on the device record, checked server-side —
not merely a firmware-side toggle, since the flag must survive a factory
reset/re-pair). Writes a `hw_visual_log` event with the image reference in
`metadata`, same storage path pattern as any other user-uploaded image in
this codebase (avatar, journal attachments — reuse, do not invent a new
upload pipeline).

### `POST /api/hw/heartbeat` (optional, EVT-phase nice-to-have)
Auth: device token. Body: `{ battPct, rssiDbm, firmwareVersion }`. Lets
Settings → Devices show battery/signal/firmware state per device without
polling the device itself — useful for the 100-unit pilot's fleet
visibility, not required for Phase 0/1.

## Server-side dependencies this spec assumes but does not implement

- Settings → Devices UI (list paired devices, revoke a device token,
  toggle Visual Log opt-in per device).
- `displayableEvents` whitelist entries + `formatLog()` cases for
  `hw_paired`, `hw_copy_signal`, `hw_visual_log`, `hw_env_sample`.
- Short-form notification prompt variant in the Memory Engine / QOS
  pipeline (distinct from the existing `assembly_directive` prompt, which
  is written for the in-app UI, not a 40-character pager line).
- Device token issuance/revocation table (new model, `DeviceToken` or
  similar — userId, deviceId, token hash, issuedAt, revokedAt).

None of this is implemented in this session (see `docs/LOT-SR-20260823-01.md`
— this is a hardware planning session, not a server code change). Flagging
it explicitly here so the next engineering session has a checklist instead
of an open-ended "wire up the API" task.
