<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Software Bridge & API Connector Specification

**Document:** LOT-COMPUTER-SOFTWARE-BRIDGE.md
**Related, kept separate on purpose:**
`docs/technical/LOT-COMPUTER-FIRMWARE.md` (device-side firmware)
`docs/technical/LOT-COMPUTER-RIG-SPEC.md` (hardware)

This document is the **software that connects the firmware to lot-systems.com**
— the LOT® API connector. It is kept as its own document because it evolves
on the platform's release cadence (frequent, git-deployed), not the
firmware's (slow, OTA-signed, riskier). Conflating the two would force
platform API changes to wait for a firmware release cycle, or vice versa.

---

## 00 — Two Sync Paths

```
LOT® Computer (device)
     │
     ├── Path A: BLE → LOT Bridge companion app (phone/desktop) → HTTPS → lot-systems.com
     │           Preferred. Lower device power draw (§05, firmware doc).
     │
     └── Path B: Wi-Fi direct → HTTPS → lot-systems.com
                 Fallback only, used when no paired companion app is reachable.
```

Both paths terminate at the same backend contract (§02). The device firmware
does not know or care which path is active — that decision is made by the
companion app / device based on radio availability, per firmware §05.

---

## 01 — Pairing

The device has no keyboard and no way to enter a Wi-Fi password or log in.
Pairing happens once, through the companion app, the same way a smartwatch
pairs:

1. Companion app (already authenticated as a LOT® user via the existing
   session/cookie flow — `src/server/models/session.ts`) scans BLE, finds
   an unpaired LOT® Computer advertising its device ID.
2. App calls `POST /api/devices/pair` (**new endpoint, see §03**) with the
   device ID, under the user's existing authenticated session.
3. Server mints a **device-scoped token** (see §03) and returns it once.
4. App relays the token to the device over BLE. The device stores it in
   its OTA-protected settings partition. The token is never re-issuable
   through the device itself — only through an authenticated companion-app
   session, so a stolen device cannot be re-paired to a stranger's account
   without also compromising that stranger's LOT® login.

---

## 02 — The LOT® API Connector Contract

Two calls only. This is intentionally the entire surface area.

### Receive: notification pull (or push, transport-dependent)

```
GET /api/devices/:deviceId/notifications/next
Authorization: Bearer <device-scoped token>

200 → { text: "Coffee time!", messageId: "...", issuedAt: "..." }
204 → no message pending
```

Poll interval is set by the companion app (typically 60-300s while phone is
reachable over BLE) or, on the Wi-Fi-direct fallback path, a longer interval
matched to the firmware power budget (§05, firmware doc). A future version
may upgrade this to a push channel (webhook-to-BLE via the companion app,
or MQTT over Wi-Fi) once volume justifies the added infrastructure — v1
ships with poll because it is simpler to audit and does not require a new
always-on connection on the server side.

### Respond: the Copy button

```
POST /api/logs
Authorization: Bearer <device-scoped token>
Body: {
  text: "Copy",
  event: "device.copy",
  metadata: { deviceId, messageId, tapTimestamp }
}

200 → { id, userId, text, event, metadata, context, createdAt }
```

This is **the same `/api/logs` endpoint the web app already uses**
(`src/server/routes/api.ts`, `fastify.post('/logs', ...)`), not a new
parallel table. The Copy tap lands in the person's existing Log tab,
indistinguishable in storage from a log entry typed on the website — only
`event: "device.copy"` and the `metadata.deviceId` distinguish its origin
for display/filtering purposes.

Session-compression weather/presence records from the firmware's
compression buffer (firmware doc §03) ride the same `/api/logs` call with
`event: "device.session"` and the compressed payload in `metadata`, rather
than opening a third endpoint — keeping the connector to two calls total.

---

## 03 — Required Backend Additions (Roadmap Item, Not Yet Built)

The device cannot hold a browser session cookie. Today's auth
(`JWT_COOKIE_KEY`, `src/server/models/session.ts`) is built for a browser.
Two small additions are needed before §01–§02 can go live — flagged here
explicitly as build work for the roadmap, not assumed to already exist:

1. **`Device` model** — mirrors the existing `Session` model's shape
   (`token` PK, `userId` FK, `createdAt`, `expiresAt`, `lastUsedAt`) plus
   `deviceId` (hardware-burned identifier) and `pairedAt`. Same prune-on-
   expiry pattern as `Session.pruneExpired()`.
2. **Bearer-token auth middleware** for the two routes in §02, parallel to
   the existing cookie-session middleware, scoped so a device token can
   only ever call `GET /notifications/next` and `POST /logs` for its own
   paired `userId` — never the full authenticated-user API surface a
   browser session gets.

This is a contained, reviewable change (one new model, one new middleware,
two route guards) — sized to land in a single PR before the first pilot
unit ships.

---

## 04 — Companion App / "LOT Bridge"

A minimal app (mobile or desktop menu-bar utility) whose entire job is:

- Hold the BLE pairing relationship (§01)
- Relay poll requests / Copy events between the device and the platform
  when the device has no direct Wi-Fi reach
- Surface OTA availability to the user for confirmation (firmware §06) —
  OTA is pulled by the device but the human sees "Firmware update
  available" in the Bridge app first, consistent with the platform's
  human-gate-on-consequential-action principle already documented for
  server infrastructure (`docs/technical/LOT-NODE-0-RIG-SPEC.md`, §04).

The Bridge app has no independent UI beyond pairing + OTA consent. It is
not a second dashboard — the dashboard is lot-systems.com, same as it is
today.

---

## 05 — What This Connector Explicitly Does Not Do

- Does not create a new inbox, new notification table, or new user-facing
  surface. Notifications are authored by the existing QI·46 / Memory
  Engine pipeline on the platform; this document only specifies how they
  reach a physical object.
- Does not give a device token access to anything beyond its own two
  routes for its own paired user.
- Does not store platform credentials on the device. The device only ever
  holds the narrow, revocable device-scoped token from §01/§03.
- Does not require the device to be online continuously — a missed poll
  or a failed Copy sync is retried once (firmware §03) and dropped, not
  queued indefinitely.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
