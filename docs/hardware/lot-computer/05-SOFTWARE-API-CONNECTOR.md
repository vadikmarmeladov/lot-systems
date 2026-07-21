<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Software / LOT API Connector

This document grounds the device's server-side integration in the **actual
current codebase** (`src/server/routes/api.ts`, `src/server/index.ts`), not a
hypothetical API. It separates what already exists and needs zero server
changes from what's genuinely new.

## 1. What already exists and just works

Confirmed by reading the live route file this session:

| Endpoint | File:line | Use for the device |
|----------|-----------|----------------------|
| `POST /api/logs` — body `{ text, event?, metadata? }` | `src/server/routes/api.ts:1519` | The **Copy button**, verbatim. Send `event: "device_copy"` and the notification text as `text`. No server change needed for this to work. |
| `GET /api/weather` | `src/server/routes/api.ts:1038` | Server-side city-level weather per account, already keyed off `req.user.city/country`. Complements, doesn't replace, the on-device BME280 (`01-PRODUCT-PLAN.md §2` item 14). |
| `GET /api/contextual-prompts` | `src/server/routes/api.ts:3290` | The existing pattern-analysis engine that already generates the kind of short, context-aware nudge ("Coffee time!"-style) the pager screen is meant to display. This is the natural source for notification text — the device doesn't need its own AI, it needs to *surface* what this endpoint already computes. |
| `GET /api/logs` | `src/server/routes/api.ts:1082` | Useful for a companion "recent Log entries" view if a future settings page wants to show device history. |

**Implication:** the single highest-leverage integration is *not* new AI —
it's wiring `contextual-prompts` output to a push/poll channel the device can
read, and wiring the Copy button to the log endpoint that's already there.

## 2. Auth: why the existing session model doesn't fit, and what does

`src/server/index.ts:274-309` shows the current auth hook: it reads a JWT
cookie (`config.jwt.cookieKey`), looks up a `Session` row keyed by that token,
and attaches `req.user`. This is correct for a browser but wrong for a
headless device — a device can't hold a browser cookie jar, and we don't want
the device firmware anywhere near the person's actual login session/password.

**Proposed addition (additive, doesn't touch the existing hook):**

- New `DeviceToken` model: `{ id, userId, token (opaque, long random), deviceId, scopes, createdAt, lastUsedAt, revokedAt }`.
- A second `onRequest` hook (or an extension of the existing one) checks for
  `Authorization: Bearer <token>` when no session cookie is present, looks up
  `DeviceToken`, and sets `req.user` the same way the session hook does —
  same shape, same downstream code paths, so `POST /api/logs` etc. need no
  changes at all to accept a device caller.
- Scopes kept minimal for v1: `logs:write` (restricted to `event: "device_copy"`
  and `event: "device_photo"` only — a device token should never be able to
  edit/delete existing Log entries), `weather:read`, `contextual-prompts:read`.
- Revocation: a "Remove this device" button on the Settings page deletes the
  `DeviceToken` row — no session-wide logout needed.

This is new server work, scoped to Phase 2 (`02-ROADMAP.md`) — not something
to build during the planning session that produced this document.

## 3. The Copy button, end to end

```
Button press (short)
  → firmware reads last-rendered notification text + latest sensor snapshot
  → POST /api/logs
      Authorization: Bearer <device token>
      { "text": "Coffee time!",
        "event": "device_copy",
        "metadata": { "deviceId": "...", "tempC": 22.4, "humidityPct": 41 } }
  → server creates the Log row exactly as it does for a browser-typed entry
  → appears in the person's Log tab immediately (same model, same list)
```

No new model is needed for this — `Log.create` already accepts an arbitrary
`event` string and a free-form `metadata` JSON blob
(`src/server/routes/api.ts:1533-1539`), which is exactly the shape a device
event needs.

## 4. New endpoints actually required

| Endpoint (proposed) | Purpose |
|----------------------|---------|
| `POST /api/devices/pair` | Exchange a pairing code (shown on the device's e-ink screen) for a minted `DeviceToken`, tied to whichever account enters the code in Settings. |
| `GET /api/devices/notify` (polled) | Returns the current "thing to show" — a thin wrapper that calls the same logic behind `contextual-prompts`, formatted to ≤ 40 chars for the e-ink screen, plus a `changed: boolean` so the device only redraws (spends e-ink refresh power) when the text is new. |
| `GET /api/devices` / `DELETE /api/devices/:id` | Settings-page device management (list paired devices, revoke one). |

A push transport (WebSocket/MQTT) instead of polling is explicitly **not**
decided here — see the open question in `04-FIRMWARE.md §2`. `GET
/api/devices/notify` is written above as a poll target because it's the
version that requires no new infrastructure (no broker, no persistent
connections) and is the right Phase-2 starting point; a push upgrade is a
Phase 5 field-feedback item if poll latency proves annoying in practice.

## 5. Session compression (brief item 8)

Every firmware/software work session on this project should end by folding
what it learned into this document — not writing a fresh doc each time. In
practice: update the tables above in place, and append a one-line dated entry
below so the history of *why* something changed is visible without re-reading
old session reports. This mirrors the compression discipline already used for
the software product in `docs/wiki/` (see `docs/SESSION_REPORT_2026_07_19_WIKI_v78.md`
for that pattern applied to the Memory Engine/QOS side of the codebase).

### Running log

- **2026-07-21** — Initial connector spec written. Confirmed `POST /api/logs`,
  `GET /api/weather`, `GET /api/contextual-prompts` all exist and need zero
  changes for the Copy-button and weather-context flows. Identified the
  session-cookie auth hook (`src/server/index.ts:274`) as the reason a
  separate `DeviceToken` auth path is needed rather than reusing browser auth
  as-is. No code changed this session — plan only.
