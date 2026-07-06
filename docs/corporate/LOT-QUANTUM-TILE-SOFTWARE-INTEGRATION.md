<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Quantum Tile — Software Integration (LOT API Connector)

**Document:** LOT-QUANTUM-TILE-SOFTWARE-INTEGRATION.md
**Classification:** Restricted — S-2 Eyes
**Companion to:** `LOT-QUANTUM-TILE-HARDWARE-PLAN.md`, `LOT-QUANTUM-TILE-FIRMWARE-SPEC.md`
**Prepared:** July 6, 2026

This is the contract between the Tile's firmware and the existing LOT OS server (`src/server/routes/`). It proposes a new route module, `hardware-api.ts`, alongside the existing `api.ts`, `os-api.ts`, and `public-api.ts`, rather than overloading an existing file — the hardware surface has a different auth model (device token, not user session) and should stay isolated.

---

## 1. Pairing — How a Tile Gets a Token

1. User buys/activates a Tile as part of their Usership hardware kit and opens the **Hardware** section of their LOT OS dashboard.
2. Dashboard displays a pairing QR code encoding a short-lived pairing code tied to the logged-in user's account.
3. Tile boots into `PROVISION` (firmware doc §2), camera scans the QR, decodes the pairing code on-device.
4. Tile POSTs the pairing code (over the phone/hotspot Wi-Fi used for setup, or via BLE relay to the LOT mobile companion if one exists) to `POST /api/v1/hardware/pair`.
5. Server validates the pairing code against the user's session, mints a **device-scoped API token** (long-lived, revocable, scoped only to the `hardware.*` routes below — never a full user session token), and returns it once.
6. Tile stores the token in flash. Every subsequent request authenticates with this device token, not a user password or full-scope API key.
7. User can revoke a Tile's token from the dashboard at any time — instant, permanent disconnect, matching the same consent model already stated for COSMO® hardware in `LOT_ROBOTICS_COSMO.md`: *"Disconnection is instant and permanent."*

---

## 2. Notification Channel (Server → Device)

**Direction:** LOT OS → Tile. This is the "pager-like notification from an AI-powered site" directive.

- Transport: persistent connection (SSE-style long-lived HTTP stream) at `GET /api/v1/hardware/stream`, authenticated with the device token. Chosen over plain polling specifically to avoid the radio-wake cost a poll loop would add (see firmware doc §6).
- When QI-46 / the Memory Engine pipeline determines a moment worth surfacing (the same detection pattern class already in `intentionEngine.ts`, just routed to a hardware sink instead of only a widget), the server emits:

```json
{
  "type": "notify",
  "deviceId": "tile_8f2a...",
  "text": "Coffee time.",
  "ttlSeconds": 1200
}
```

- `text` is capped short (recommend ≤ 40 chars) — the display is one line, not a scroll.
- Server-side rate limiting mirrors the firmware's own floor (firmware doc §4): even though the device enforces a 20-minute minimum locally, the server should not rely on the device to be the only guardrail. Cap emission per device at the same cadence server-side too, defense in depth.

---

## 3. Session Compression Upload (Device → Server)

**Direction:** Tile → LOT OS. Implements the parent plan doc's Session Compression Protocol (§5).

`POST /api/v1/hardware/ingest`

```json
{
  "deviceId": "tile_8f2a...",
  "windowStart": "2026-07-06T08:00:00Z",
  "windowEnd": "2026-07-06T14:00:00Z",
  "envSamples": { "count": 24, "tempAvgC": 21.4, "humidityAvgPct": 38, "pressureAvgHpa": 1013, "vocIndexAvg": 62 },
  "presenceEvents": { "count": 6 },
  "notificationsShown": 2,
  "batteryPct": 71
}
```

Server maps this into a single `models.Log` entry per window (event type: `hardware_session`), not one row per raw sample — same rationale as the existing Sunday `lot_ai_story` job that compresses 7 days of activity into one story text rather than a flood of rows.

---

## 4. The "Copy" Button — Device → Log Tab

**Direction:** Tile → LOT OS, immediate (never batched — firmware doc §6 explicitly excludes this from the batching rule).

`POST /api/v1/hardware/copy`

```json
{
  "deviceId": "tile_8f2a...",
  "notifId": "ntf_91c2...",
  "ts": "2026-07-06T14:03:12Z"
}
```

Server behavior:
1. Validate device token maps to a real, active pairing.
2. Create a `models.Log` row: `{ eventType: 'hardware_copy', userId, metadata: { notifId, deviceId, ts } }`.
3. This row surfaces in `Logs.tsx` (the user-facing **Log** tab) through the same rendering path as every other LOT OS log event — no special-cased UI needed, it's a first-class Log entry, formatted with a handler line similar in spirit to the existing COCKPIT-RULE handlers (e.g. `COPY: {notification text} — acknowledged {relative time}`).

This is the literal implementation of directive #16: pressing **Copy** on the device puts a line in the site's Log tab.

---

## 5. Firmware OTA Manifest

`GET /api/v1/hardware/firmware/manifest` (device token auth)

```json
{
  "latestVersion": "1.2.0",
  "sha256": "…",
  "signature": "…",
  "url": "https://cdn.lot-systems.com/firmware/tile/1.2.0.bin",
  "minCompatibleHardwareRev": "A"
}
```

Device compares against its running version, downloads only on mismatch, verifies signature per firmware doc §7 before flashing the inactive bank.

---

## 6. Auth & Scope Summary

| Token type | Used by | Scope |
|------------|---------|-------|
| User session token | Dashboard, mobile app | Full account — can pair/revoke devices |
| Device token (minted at pairing) | Tile firmware | `hardware.stream.read`, `hardware.ingest.write`, `hardware.copy.write`, `hardware.firmware.read` — nothing else. Cannot read journal entries, cannot read other widgets, cannot act as the user anywhere else in the API surface. |

Keeping the device token narrowly scoped means a compromised or lost Tile can leak, at most, environment samples and Copy timestamps — never journal content, never the behavioral signal that feeds the Benchmark score.

---

## 7. Open Integration Questions for Phase 2

1. Confirm whether `src/server/routes/hardware-api.ts` should be a new file (recommended, per this doc's opening note) or folded into `os-api.ts` — decide during Phase 2 implementation, not before real endpoint code exists.
2. Confirm SSE vs. a lighter MQTT-over-TLS broker for the notification channel once real device count (100 units, then Usership-kit scale) makes persistent-HTTP-connection-per-device cost worth reconsidering.
3. Log formatter string for `hardware_copy` events in `Logs.tsx` — needs an actual UI pass, not just a schema, before Phase 2 closes.

---

*Invented by Vadik Marmeladov. LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024.*
*Made in the USA · brand.lot-systems.com*
