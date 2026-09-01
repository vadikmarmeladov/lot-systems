<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Software Bridge (Server ↔ Firmware)

**Document:** LOT-COMPUTER-SOFTWARE-BRIDGE.md
**Companion to:** [`LOT-COMPUTER-PLAN-v1.md`](../corporate/LOT-COMPUTER-PLAN-v1.md), [`LOT-COMPUTER-FIRMWARE.md`](./LOT-COMPUTER-FIRMWARE.md)
**Kept separate per the brief:** this document covers only the
lot-systems.com side of the connection — new routes, data model, and how
the device reuses the existing Log tab. It does not restate firmware
behavior already covered in `LOT-COMPUTER-FIRMWARE.md`.

---

## 1. Design principle

Build as little new surface as possible. lot-systems.com already has:

- A Fastify API (`src/server/routes/api.ts`) with an existing
  `GET /api/logs` and log-mutation routes backing
  `src/client/components/Logs.tsx` and `src/client/queries.ts`
  (`useLogs`, `useUpdateLog`).
- Contextual, short, single-line prompt generation already running —
  `ContextualPromptsWidget.tsx`, `CalendarWidget.tsx`, and the Memory
  Engine's proactive questions (README.md, "How It Works").
- An AI engine abstraction (`docs/technical/AI-ENGINE-GUIDE.md`) for any
  server-side reasoning about a captured photo.

The device should feel like a new *surface* on data structures that
already exist, not a new subsystem. The one genuinely new concept is the
**Device** itself (pairing, presence, notification delivery target).

---

## 2. New data model

```
Device
  id            uuid, pk
  userId        fk -> User
  label         string            (e.g. "Desk — Home Office")
  apiToken      string, hashed at rest
  firmwareVersion string
  pairedAt      timestamp
  lastSeenAt    timestamp
  status        enum: provisioning | active | revoked
```

No changes required to the existing `Log` model — a captured moment from
the device is a normal `Log` row with metadata identifying its origin
(§4). This keeps the Log tab as the single place operators look for
their captured moments, whether typed, spoken, or copied from the
device, per Plan §03 ("No parallel inbox, no new tab").

---

## 3. API surface (new routes, `src/server/routes/api.ts` pattern)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/device/pair` | Exchange a pairing code (Firmware §5) for a device token, scoped to the authenticated user's account |
| `POST` | `/api/device/heartbeat` | Device liveness + firmware version report; updates `lastSeenAt` |
| `GET`/subscribe | `lot/device/{deviceId}/notify` (MQTT topic, not HTTP) | Server publishes outbound notifications; device holds the persistent subscription (Firmware §3) |
| `POST` | `/api/device/copy` | Device-authenticated equivalent of creating a Log entry — internally creates a row via the same path `POST /api/logs` already uses, tagged per §4 |
| `DELETE` | `/api/device/:id` | Revoke a device (lost/replaced unit) — sets `status: revoked`, invalidates its token |

`/api/device/copy` is a thin wrapper rather than a fork of the Log
creation path — it calls the same internal log-creation function the
existing `/api/logs` route uses, so any future change to Log validation,
storage, or downstream signal recording (`recordLogSignal` in
`intentionEngine.ts`) automatically applies to device-originated entries
too.

---

## 4. The COPY button, end to end

1. Device fires `POST /api/device/copy` with `{deviceId, ts, text?,
   imageBase64?}` (text is empty for a pure "moment marker" press; image
   is optional per Firmware §2 CAPTURE).
2. Server authenticates the device token, resolves `userId` from the
   `Device` row.
3. Server creates a `Log` row for that user via the existing internal
   creation path, with:
   - `text`: the device's text if present, else a short default
     ("Captured from LOT® Computer")
   - `metadata.source`: `"lot-computer"`
   - `metadata.deviceId`, `metadata.hasImage`
4. If an image was attached, it is stored the same way any other
   image-bearing Log attachment is stored today, and — only if the
   owner's account has AI captioning enabled — passed through the AI
   engine abstraction to generate a short caption appended to the Log
   text.
5. The owner's Log tab (`Logs.tsx`) shows the new entry through its
   existing `useLogs` query — **no client-side change is required in
   `Logs.tsx` for this to work**, because it is, structurally, the same
   `Log` row any other creation path produces. This is the exact
   behavior the brief specifies: "a signal back to the site's Log tab."

---

## 5. Notification delivery, end to end

1. An existing trigger fires — Memory Engine proactive question ready,
   QOS mode change, a `ContextualPromptsWidget`/`CalendarWidget`-class
   event, or an operator-authored scheduled note.
2. A new thin publisher (server-side) checks whether the triggering
   user has an `active` Device, and if so, reduces the trigger's full
   payload to the pager-length string the device can render (Firmware
   §4 — text only, one line) and publishes to
   `lot/device/{deviceId}/notify`.
3. This publisher does not replace the existing in-app notification —
   it is an additional, optional delivery target. A user without a
   paired device sees no behavior change anywhere in the existing
   product.

---

## 6. Pairing UI

New settings surface: **Settings → Devices**, listing paired `Device`
rows (label, last seen, firmware version) with a "Pair a device" flow
that accepts the pairing code shown on the unit's e-paper (Firmware §5)
and a "Revoke" action per row, calling `DELETE /api/device/:id`. Follows
the existing Settings page's component and privacy patterns already
established for `UserPrivacySettings` (README.md, Public Profile
System) — a device pairing is exactly the kind of thing an operator
should be able to see and revoke as plainly as any other connected
surface.

---

## 7. Security notes

- Device tokens are bearer tokens scoped to `POST /api/device/copy` and
  `POST /api/device/heartbeat` only — a stolen device token cannot read
  a user's Log history, only append to it and report liveness.
- Revocation (`DELETE /api/device/:id`) must take effect on the very
  next request the server sees from that device token — no cache
  window, since a lost physical unit is a lost credential.
- Image payloads from `/api/device/copy` go through the same upload
  validation (size limits, content-type sniffing) as any other
  image-bearing Log entry — the device is not a trusted-by-default
  client.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR — COSMO® CIA
END LOT-COMPUTER-SOFTWARE-BRIDGE
================================================================================
