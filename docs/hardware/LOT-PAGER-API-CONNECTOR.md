================================================================================
LOT SYSTEMS CORPORATION
LOT PAGER — SOFTWARE / LOT API CONNECTOR SPECIFICATION
DOCUMENT: LOT-PAGER-API-CONNECTOR / v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-01
COMPANION: LOT-PAGER-SPEC.md (section 05, 07), LOT-PAGER-FIRMWARE.md
================================================================================

--------------------------------------------------------------------------------
00 // SCOPE
--------------------------------------------------------------------------------
This document is the software half of Requirement #10 (software to connect
with firmware) and covers only backend/LOT API surface — nothing that runs
on-device (that's LOT-PAGER-FIRMWARE.md). Kept separate per Requirement #11.

Everything in this document is NEW backend work. A direct code audit (this
session, 2026-07-01) confirmed none of it exists today:

    EXISTS TODAY                        DOES NOT EXIST TODAY
    -------------                        --------------------
    POST /api/logs (api.ts:1414)        Any device/API-key auth path
    GET  /api/logs (api.ts:1020)        Any push/WebSocket/webhook system
    JWT cookie + Session model auth     Device pairing / registration
    (server.ts:206–241)                 A nudge/notification generator

The M2M protocol described in docs/corporate/LOT-TERMINAL-M2M.md and the
WebSocket sync design in docs/corporate/LOT-TERMINAL-SYNC.md are the closest
prior art — both are written as vision documents, not implemented endpoints.
This spec treats them as the intended shape and makes them concrete enough
to build.

--------------------------------------------------------------------------------
01 // DEVICE PAIRING & AUTH (the blocker flagged in LOT-PAGER-SPEC.md §07)
--------------------------------------------------------------------------------
The existing auth hook (src/server/server.ts:206–228) reads a JWT cookie,
loads a `Session` row, and sets `req.user`. A second hook (server.ts:236–241)
401s if `req.user` is unset. A hardware device cannot hold a browser cookie,
so it needs a parallel path into the same `req.user` — not a parallel API.

    NEW MODEL — DeviceToken
        id            uuid, pk
        userId        uuid, fk -> users
        deviceId      string, unique   (e.g. "lot-pager-<serial>")
        tokenHash     string           (store hashed, like a password)
        label         string           (user-facing name, e.g. "Kitchen Pager")
        createdAt / lastSeenAt / revokedAt

    NEW AUTH BRANCH — inserted alongside the existing cookie hook, not
    replacing it:
        if (req.headers.authorization?.startsWith('Bearer ')) {
          const token = req.headers.authorization.slice(7)
          const deviceToken = await DeviceToken.findByHash(token)
          if (deviceToken && !deviceToken.revokedAt) {
            req.user = await User.findByPk(deviceToken.userId)
            req.device = deviceToken   // so handlers can tag the source
          }
        }
    This runs in the same `onRequest` hook as the cookie check
    (server.ts:206), before the 401 gate (server.ts:236) — every existing
    route under `/api`, including `/api/logs`, works unmodified once
    `req.user` is set this way. No route handler needs to change.

    PAIRING FLOW (user-facing):
        1. LOT web app → Settings → "Pair a Device"
        2. Server mints a DeviceToken row + a one-time 6-digit pairing code
        3. Device (in PROVISIONING mode, LOT-PAGER-FIRMWARE.md §05) shows
           the code on its own screen, or receives it via BLE from the phone
        4. User enters the code in the web app; server confirms match and
           returns the raw token to the device once, over the BLE
           provisioning channel — never over an unencrypted path, never
           logged
        5. Device stores the token in NVS; all subsequent requests use it
           as a Bearer token

--------------------------------------------------------------------------------
02 // NOTIFICATION TRANSPORT — GREENFIELD
--------------------------------------------------------------------------------
Per LOT-PAGER-SPEC.md §05, nothing server-side exists for this today (no
web-push, no APNs/FCM, no device-facing WebSocket — the only real-time
channel found, `GET /api/sync`, is an SSE stream scoped to browser tabs,
api.ts:324–410).

    NEW ENDPOINT — WS  wss://.../api/device/notifications
        Auth: Bearer DeviceToken (section 01)
        Server → device only. One frame per nudge:
            { "line": "Coffee time.", "id": "ntf_...", "ts": "2026-07-01T..." }
        No device → server payload on this channel — acks go over HTTPS
        (section 03) to keep the socket single-purpose and easy to reason
        about.

    FALLBACK — HTTPS long-poll
        GET /api/device/notifications/poll?since=<id>
        Used automatically by firmware when the socket drops
        (LOT-PAGER-FIRMWARE.md boot sequence) — polled every 60s, matching
        the "Hybrid Mode" fallback cadence sketched in
        docs/corporate/LOT-TERMINAL-SYNC.md.

    NUDGE GENERATION
        A scheduled job (pattern: src/server/scheduled-jobs.ts, which
        already runs the weekly/monthly email summaries) reads the same
        Memory Engine compression output used for in-app prompts
        (docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md) and
        reduces it one step further: from a paragraph to a single line
        under ~24 characters, then pushes it to any paired device for that
        user over the WS channel above.

--------------------------------------------------------------------------------
03 // COPY BUTTON → LOG TAB (Requirement #16)
--------------------------------------------------------------------------------
No new endpoint needed here — this is the one piece of the Pager that maps
directly onto an existing, working route once section 01's auth branch
lands:

    POST /api/logs
    Authorization: Bearer <device_token>
    {
      "text": "Coffee time.",
      "event": "device_copy",
      "metadata": {
        "device_id": "lot-pager-<serial>",
        "battery_pct": 84,
        "source": "lot-pager"
      }
    }

This is created via the existing handler at src/server/routes/api.ts:1414–
1438 exactly as any other log write — `event` is an unconstrained string at
the model layer (src/server/models/log.ts), so `"device_copy"` needs no
schema migration. It appears in the Log tab immediately via the existing
`GET /api/logs` read path (api.ts:1020–1103), which already allowlists
displayable event types — `device_copy` must be added to that allowlist
(the `displayableEvents` list around api.ts:1022–1068) or it will be
written but invisible in the tab. This one-line addition is the only
existing-code change this whole project requires.

--------------------------------------------------------------------------------
04 // WEATHER + SESSION COMPRESSION (Requirement #8)
--------------------------------------------------------------------------------
The device batches BME280 readings locally (LOT-PAGER-FIRMWARE.md §04) and
sends one compressed payload per session rather than one call per reading:

    POST /api/device/telemetry
    Authorization: Bearer <device_token>
    {
      "device_id": "lot-pager-<serial>",
      "session_start": "2026-07-01T14:00:00Z",
      "session_end": "2026-07-01T15:00:00Z",
      "weather_samples": [
        { "t": "14:00", "temp_c": 22.1, "humidity": 41, "pressure_hpa": 1012.3 },
        { "t": "14:10", "temp_c": 22.3, "humidity": 40, "pressure_hpa": 1012.1 }
      ]
    }
This mirrors the `sensors[]` array shape already sketched (aspirationally)
in docs/corporate/LOT-TERMINAL-M2M.md's "Multi-Sensor Array" format, and
feeds the same weather-mood correlation already live in
docs/technical/OS_API.md's Insights endpoint (`GET /api/os/insights`,
insight type `weather-mood`) — the Pager becomes one more weather source
for a correlation that already exists, not a new feature end-to-end.

--------------------------------------------------------------------------------
05 // SECURITY NOTES
--------------------------------------------------------------------------------
    - Device tokens are bearer credentials with no expiry check built into
      the JWT cookie flow they parallel — they MUST support revocation
      (the `revokedAt` column in section 01) and SHOULD rotate on a fixed
      schedule (e.g. 90 days), unlike the aspirational 30-day rotation
      claimed in docs/corporate/LOT-TERMINAL-SYNC.md, which this spec does
      not assume is already built anywhere.
    - `req.device` (section 01) should be threaded into any log line
      written this way so a compromised or lost device's activity can be
      audited and revoked without touching the user's own session.
    - TLS everywhere (matches the existing LOT-TERMINAL-M2M.md requirement
      of TLS 1.3+) — no exceptions for the WS channel or the fallback poll.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-PAGER-API-CONNECTOR
================================================================================
