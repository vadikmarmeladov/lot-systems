<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Terminal — Software Layer / LOT API Connector

**Document:** LOT-COSMO-TERMINAL-SOFTWARE
**Classification:** RESTRICTED // S-2 EYES
**Companion to:** [LOT-COSMO-TERMINAL-v1.md](./LOT-COSMO-TERMINAL-v1.md), [LOT-COSMO-TERMINAL-FIRMWARE.md](./LOT-COSMO-TERMINAL-FIRMWARE.md)
**Prepared:** 2026-08-17
**S-2:** Vadik Marmeladov
**Status:** SPEC — no server code exists yet; this document specifies the
connector that firmware (Section 3 of the firmware doc) talks to. Proposed
implementation location: a new `src/server/routes/device-api.ts`, following
the existing route-module pattern already used by `os-api.ts` and
`public-api.ts` (both read this session — see plan doc Section 00).

---

## 1. Pairing

```
POST /api/device/pair
Body:  { pairingCode: string, deviceId: string }
Auth:  session cookie (operator is logged into lot-systems.com)
```

- `pairingCode` is the 6-character code firmware displays on first boot
  (firmware doc Section 2). `deviceId` is the MCU's factory unique ID.
- **Gate:** rejects with 403 unless the authenticated operator's account
  is Yellow-tier Benchmark or above — reusing the eligibility check
  already defined for COSMO® hardware activation
  (docs/corporate/LOT_ROBOTICS_COSMO.md, "Benchmark Arbitrage® Gate").
  This connector does not introduce a new eligibility rule; it calls the
  existing one.
- On success: generates a device token (JWT, device-scoped, long-lived,
  revocable), returns it over the SAME request/response cycle the
  pairing code was entered on — never printed to a log, never re-
  displayed after this one response.
- Writes a `Device` record: `{ deviceId, userId, pairedAt, revoked: false }`.

## 2. Notification stream (the pager pipe — requirement #2)

```
GET /api/device/notify/stream
Auth:  device token (header)
Type:  Server-Sent Events (text/event-stream)
```

- One persistent connection per paired device.
- Server-side message selection is NOT new logic — it subscribes to the
  same signal sources already firing inside the Memory Engine / QI·46
  layer (plan doc Section 05's table). This endpoint is a NEW DELIVERY
  CHANNEL for existing signals, not a new decision-making system.
- Message envelope:
  ```json
  { "id": "msg_...", "text": "Coffee time.", "class": "care_nudge", "sentAt": "2026-08-17T09:14:00Z" }
  ```
- Server enforces the same rate limit firmware enforces (firmware doc
  Section 3) — belt and suspenders, not a substitute for the on-device
  cap.

## 3. Log write (the Copy button — requirement #16)

```
POST /api/device/log
Body:  { msgId: string | null, text: string, capturedAt: string, sensorSnapshot?: {...} }
Auth:  device token (header)
```

- Writes one entry to the operator's existing Log — the same data store
  behind the `/log` client route (`src/client/stores/router.ts` line 31,
  read this session). The device is a new WRITER into an existing table,
  not a new log system.
- `msgId: null` covers the blank-screen "check-in" case (plan doc
  Section 06) — the entry is tagged with a `source: "cosmo_terminal"`
  field so the operator can later distinguish device-originated entries
  from ones written through the web app, without needing a separate view.

## 4. Sensor upload (weather + session compression — requirements #8, #14)

```
POST /api/device/sensor
Body:  { readings: [{ temp, humidity, pressure, capturedAt }], sessions: [{...compressed record from firmware doc Section 8...}] }
Auth:  device token (header)
```

- `readings[]` feeds directly into the existing weather pipeline
  (`src/server/utils/weather.ts`, read this session) as a local ground-
  truth data point blended with the API-sourced forecast that pipeline
  already produces — the device does not replace `getWeather()`, it
  supplements it.
- `sessions[]` is written to a compact `DeviceSession` table — one row
  per notification-to-Copy(or-timeout) cycle, matching firmware's
  edge-compression design (firmware doc Section 8) rather than a raw
  event stream.

## 5. Security

- Device token: JWT, device-scoped (not the operator's own session
  token), revocable independently of the operator's login — unpairing a
  device must not require the operator to log out of the web app, and
  logging out of the web app must not silently kill a paired device.
- Revocation: `DELETE /api/device/pair` (operator-authenticated, from
  Settings) sets `revoked: true`. Firmware's 401-handling (firmware doc
  Section 2, step 5) then returns the unit to PAIRING mode within one
  reconnect cycle.
- No camera data ever transits this API. There is no endpoint in this
  spec that accepts an image upload — that is a deliberate omission
  matching the firmware-side privacy boundary (firmware doc Section 5),
  not an oversight.

## 6. Rate & abuse limits

- `/api/device/pair`: 5 attempts per account per hour (brute-force
  protection on the 6-character pairing code).
- `/api/device/log`, `/api/device/sensor`: standard per-device token
  rate limiting, matching the existing Fastify route conventions already
  in `src/server/routes/` (rate-limit middleware reused, not reinvented).

---
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-TERMINAL-SOFTWARE
