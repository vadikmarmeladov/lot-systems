<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Software Bridge (v1.0)

**Parent document:** [`docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md`](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
**Companion document (kept separate per spec):** [`02-FIRMWARE.md`](./02-FIRMWARE.md)

This document is server/web-side only: the software running on
lot-systems.com that the firmware in `02-FIRMWARE.md` talks to. It is the
LOT API connector named in the task brief (item 6). Nothing here describes
what runs on the device itself.

---

## 1. Design constraint

Every route below is **additive**. No existing endpoint, table, or type in
`src/server/` or `src/client/queries.ts` is modified. The device is a new,
independent client of the platform — the same way a mobile app or a public
profile viewer would be — not a special case woven into the existing web
client's code paths.

---

## 2. New routes

All four routes live under a new `src/server/routes/hardware-api.ts`
(mirroring the existing pattern in `src/server/routes/public-api.ts`,
referenced in `README.md` line 418).

### `POST /api/hardware/pair`
Called from the *web app* (not the device) when an operator submits a
pairing code shown on their device screen at `lot-systems.com/hardware/pair`
(new client route, `src/client/components/HardwarePairing.tsx`).
- Validates the pairing code against the short-lived code the device
  generated (`02-FIRMWARE.md` Section 3), issued via the BLE
  provisioning handshake.
- On match: creates a `hardware_devices` row (Section 5 below), issues a
  device-scoped bearer token, and returns it to be relayed to the device
  over the same provisioning channel.

### `GET /api/hardware/notify`
Device-authenticated (bearer token). Long-poll (30s hold, HTTP
chunked-friendly) or a plain 200/204 for the 60s-fallback poll path
named in `02-FIRMWARE.md` Section 4.
- Reuses the existing AI engine abstraction (`README.md` line 143-158)
  to compose a notice — this is not a new AI pipeline. A notice is
  generated the same way a Memory Engine question is generated, with a
  device-specific prompt constraint: **one line, ~24 characters**,
  enforced server-side before the notice is ever queued (belt-and-suspenders
  with the firmware's own display truncation).
- Notice triggers (initial set — extend over time, do not need a v1.1):
  badge unlocked, memory question ready, QOS mode change (`README.md`
  line 111-139), a scheduled operator-set reminder ("Coffee time!" —
  operator-configurable in Settings, not hardcoded), significant local
  weather delta (sourced from `/api/hardware/telemetry`, Section below).

### `POST /api/hardware/copy`
Device-authenticated. Body: `{ noticeId?: string, snapshot?: base64 }`.
- Thin wrapper over the existing `useCreateLog` mutation path
  (`src/client/queries.ts` line 139-142 — same `/api/logs` table, same
  `Log` type). Server sets `event: "hardware_copy"` and
  `metadata: { deviceId, source: "cosmo-cube", noticeId }`.
- If `snapshot` is present (opt-in long-press capture, `02-FIRMWARE.md`
  Section 4), it is uploaded to the same object storage the platform
  already uses for user-uploaded images and referenced from the Log
  entry's metadata — no new storage system.
- **This is the "signal back to the Log tab" the task brief specifies
  (item 16).** The operator sees the entry in their existing Log tab UI
  with no client-side changes required — it is indistinguishable in
  shape from any other Log entry, only the `event`/`metadata` fields
  identify its hardware origin.

### `POST /api/hardware/telemetry`
Device-authenticated. Body per `02-FIRMWARE.md` Section 5's compressed
record shape. Server behavior:
- Writes to a new `hardware_telemetry` table (Section 5 below) — kept
  separate from `logs` because telemetry is high-frequency structured
  data, not a narrative entry a human reads in their Log.
- If a record is a "no-change extension" (firmware already collapsed
  flat readings, `02-FIRMWARE.md` Section 5), the server extends the
  previous record's `valid_until` rather than inserting a new row —
  keeping the table from filling with redundant identical readings.
- Feeds two existing systems, unmodified: the QOS System Pressure signal
  set (`README.md` line 124-129) gets a `presence` boolean input it
  didn't previously have; the public-profile weather block (`README.md`
  line 309-313) can optionally prefer hyperlocal device readings over
  the city-level API forecast when both are available and recent.

---

## 3. Notice queue semantics

- One outstanding notice per device at a time — the server does not
  queue a backlog of unread notices. If a new trigger fires while a
  prior notice is still uncleared, the newer notice **replaces** the
  queued one (a pager shows the latest page, not a history).
- This is a deliberate product choice, matching the anti-feed thesis
  already established for CUBIQ™
  (`docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md` line 194-201): no
  unread-count badge, no backlog anxiety, one line at a time.

---

## 4. OTA endpoint

`GET /api/hardware/ota-manifest` — device-authenticated, returns
`{ version, url, sha256 }` for the current signed firmware image if
newer than the device's reported version (sent as a header on every
device request). Firmware behavior (fetch, verify, apply, rollback) is
specified in `02-FIRMWARE.md` Section 6 — this endpoint only serves the
manifest and the signed binary from existing static asset hosting.

---

## 5. Data model additions

Two new tables, added via a new migration in `migrations/` (following the
existing migration pattern in that directory — see `migrations:up` in
`README.md` line 241). No existing table is altered.

```sql
CREATE TABLE hardware_devices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  device_serial TEXT NOT NULL UNIQUE,   -- laser-etched serial, parent doc Sec 02
  token_hash    TEXT NOT NULL,          -- bearer token, hashed at rest
  paired_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at    TIMESTAMPTZ,
  firmware_version TEXT
);

CREATE TABLE hardware_telemetry (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID NOT NULL REFERENCES hardware_devices(id),
  temp_c        NUMERIC(4,1),
  humidity_pct  NUMERIC(4,1),
  pressure_hpa  NUMERIC(6,1),
  presence      BOOLEAN,
  confidence    SMALLINT,
  battery_pct   SMALLINT,
  recorded_at   TIMESTAMPTZ NOT NULL,
  valid_until   TIMESTAMPTZ NOT NULL
);
```

`logs` (existing table, `src/client/queries.ts` line 134) is untouched —
`/api/hardware/copy` writes into it through the existing mutation path,
not a new one.

---

## 6. Settings > Hardware (web client)

New panel (`src/client/components/settings/HardwareSettings.tsx`),
consistent with the existing Settings component structure:
- List paired devices (serial, paired date, last-seen, firmware version)
- Revoke a device's token (sets `revoked_at`, device's next request gets
  401 and re-enters Pairing Mode per `02-FIRMWARE.md` Section 3)
- Toggle: allow camera snapshot capture (long-press), allow presence
  scanning — both OFF by default, matching the parent document's privacy
  posture (Section 04: "Default OFF; opt-in per device")
- Configure scheduled notices (e.g. "Coffee time!" at a set hour) — this
  is operator-authored content, not AI-generated, stored per-device and
  merged into the notice queue (Section 3) alongside AI-composed notices

---

## 7. What this document deliberately does not cover

- Firmware internals — see `02-FIRMWARE.md`.
- Enclosure, BOM, manufacturing — see `01-BOM.md` and
  `04-MANUFACTURING-PCBWAY.md`.
- User-facing setup instructions — see `06-USER-MANUAL.md`.
