<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® SLATE — Software Document (v1)

Companion doc to `docs/corporate/COSMO-SLATE-v1.md`. Covers item 10 of the
brief ("software to connect with firmware") — this is the lot-systems.com
side of the connection. See `FIRMWARE.md` for what runs on the device
itself.

This document deliberately does not repeat the wire protocol —
`docs/corporate/LOT-TERMINAL-M2M.md` and `docs/corporate/LOT-TERMINAL-SYNC.md`
already specify it, and COSMO-SLATE-v1.md Section 05 maps SLATE onto that
existing spec. This document describes the pieces that are new: server-side
handlers, pairing storage, and the Log tab write path.

## 01. What already exists vs. what's new

| Piece | Status |
|---|---|
| M2M JSON payload formats | Already specified — `LOT-TERMINAL-M2M.md` |
| WebSocket + HTTPS-batch sync modes | Already specified — `LOT-TERMINAL-SYNC.md` |
| `POST /v1/m2m/intake` endpoint | Documented, not yet implemented server-side (per `LOT-TERMINAL-M2M.md`, "Data Intake Endpoint (Future)") |
| `wss://sync.lot-systems.com/m2m/intake` | Documented, not yet implemented server-side |
| Device pairing → user account binding | **New** — needed for a consumer device, the existing M2M spec assumes an S-2 operator with a CLI, not a one-button consumer object |
| Message composition (Memory Engine → 1 line) | **New** — server-side compression described in COSMO-SLATE-v1.md Section 06 |
| Log tab write from a `copy` event | **New route**, existing UI — `src/client/components/Logs.tsx` already renders the log stream this writes into |

## 02. Server-side implementation plan

```
src/server/routes/hardware-api.ts   (new)
  POST /api/hardware/pair            Accept a device's short-lived pairing
                                      code + the operator's session, bind
                                      device_id → user_id in a new table
  POST /v1/m2m/intake                Implements LOT-TERMINAL-M2M.md's
                                      documented endpoint — validates
                                      device_id is paired, routes by
                                      payload shape:
                                        sensors[] batch  → weather telemetry
                                        event: "copy"    → write log entry
                                                            (Section 03 below)
  WS   /m2m/intake                   Implements LOT-TERMINAL-SYNC.md's
                                      real-time mode — pushes composed
                                      messages down, accepts the same
                                      telemetry/copy payloads up

migrations/xxxx_hardware_devices.sql (new)
  hardware_devices table: device_id, user_id, paired_at, last_seen_at,
  device_type ('cosmo-slate'), firmware_version

src/server/services/hardwareMessageComposer.ts (new)
  Called whenever the Memory Engine / QIE has new context for a paired
  operator. Compresses to <=32 chars per COSMO-SLATE-v1.md Section 06,
  queues for delivery over the WS channel (or next HTTPS batch pull).
```

## 03. The Copy button → Log tab path (item 16)

```
Device button press
     │
     ▼
firmware connector.c queues { device_id, event: "copy", timestamp }
     │
     ▼
POST /v1/m2m/intake  (or WS equivalent)
     │
     ▼
hardware-api.ts: validate device_id is paired → look up user_id
     │
     ▼
write standard log entry (same log-write path other LOT features already
use — no new log schema, no new Log tab component)
     │
     ▼
src/client/components/Logs.tsx renders it in the operator's Log tab,
same as any other log event, next time they open lot-systems.com
```

No new client-side UI is built for this — the Log tab already exists and
already renders a log stream. The only new code is the server route that
turns a device event into a log write.

## 04. Pairing flow (operator-facing)

```
1. Operator powers on a new SLATE unit for the first time
2. Device broadcasts BLE pairing code, operator's phone/laptop (any BLE-
   capable device) relays Wi-Fi credentials + pairing code to the unit
3. Operator logs into lot-systems.com → Settings → Hardware → "Pair a device"
4. Operator enters the same short-lived pairing code shown on the SLATE's
   own display during setup
5. POST /api/hardware/pair binds device_id to user_id
6. Device begins receiving messages over the WS channel
```

This reuses the account-verification posture already established for
COSMO® hardware in `docs/corporate/LOT_ROBOTICS_COSMO.md` ("verify through
behavior, not declaration") at consumer scale: pairing requires an active,
logged-in lot-systems.com session — a SLATE unit cannot be bound to an
account it hasn't been explicitly authenticated into.

## 05. What this document does not cover

- Exact database schema beyond the table sketch in Section 02 — write this
  as a real migration when implementation starts, following the existing
  migration conventions in `migrations/`.
- Rate limiting / abuse handling on `/v1/m2m/intake` — reuse the existing
  per-route rate-limit pattern already live elsewhere in
  `src/server/routes/` (see `docs/benchmark/LOT-SR-20260613-03.md` for the
  precedent: "Per-route AI rate limiting — 5 Together AI endpoints capped").
- Multi-device-per-operator UX (a second SLATE, a SLATE + a future CUBIQ
  unit on one account) — v1 assumes one device per operator; extend the
  `hardware_devices` table's obvious one-to-many shape when that's needed,
  don't redesign for it now.

---

*Companion to `docs/corporate/COSMO-SLATE-v1.md`. See `FIRMWARE.md` for the
device-side implementation, `MANUAL.md` for the operator-facing setup guide.*
