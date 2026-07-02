<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Pager — Software Connector (Firmware ↔ LOT API)

**Document:** LOT-PAGER-SOFTWARE-CONNECTOR.md
**Classification:** Internal / Build
**Prepared:** July 2, 2026
**Status:** Proposed — extends the existing (also proposed/future) M2M intake
protocol documented in `LOT-TERMINAL-M2M.md`. Nothing in this document
describes code that exists in `src/server` today; it is the integration spec
to build against once firmware (see `LOT-PAGER-FIRMWARE.md`) reaches EVT.

Kept separate from the firmware document per LOT convention: this is the
network/server contract; the firmware doc is device-side behavior only.

---

## 01. Pairing (BLE Provisioning)

1. Operator opens the LOT Systems companion surface (a panel inside the
   existing System/Settings tab — no new standalone app required for v1).
2. Device in an unpaired state advertises over BLE (`LOT-PAGER-<serial>`).
3. Companion surface connects over BLE, sends WiFi credentials + a
   short-lived pairing token obtained from `POST /api/pager/pair-token`
   (authenticated as the logged-in operator).
4. Device stores WiFi credentials + exchanges the pairing token for a
   long-lived device credential via `POST /api/pager/register` (device →
   server, over WiFi once connected).
5. Server binds `device_id` to `operator_id` — same operator-authenticated
   device-token model as `LOT-TERMINAL-M2M.md`'s S-2 operator credentials,
   scoped to one operator per device (no shared fleet secrets).

```json
POST /api/pager/register
Authorization: Bearer <pairing_token>
{
  "device_id": "pager-A1B2C3",
  "hw_rev": "evt-1",
  "fw_version": "0.1.0"
}
```
```json
200 OK
{
  "device_token": "<long-lived device credential>",
  "operator": "vadik",
  "poll_interval_seconds": 60
}
```

---

## 02. Notification Push (Server → Device)

**Transport decision, EVT-gated:** two viable transports, pick based on the
power numbers firmware bring-up produces (Firmware doc, Section 09):

- **Poll model (default assumption for this spec):** device wakes on its own
  schedule, calls `GET /api/pager/notifications`. Simple, works with the
  existing Fastify + SSE-for-browsers architecture (`LOT-SYSTEM-OUTLINE.md`)
  without adding a persistent-connection broker for hardware.
- **Push model (if poll-interval power cost is too high in DVT):** a
  lightweight MQTT broker (e.g. add `mosquitto` alongside the existing Docker
  Compose services) with the device holding a low-power persistent
  subscription. Higher server complexity, potentially lower device power —
  a real tradeoff, not a default. Decide with EVT battery data in hand.

**Poll model contract:**

```json
GET /api/pager/notifications
Authorization: Bearer <device_token>
```
```json
200 OK
{
  "pending": [
    {
      "id": "ntf_9f2a",
      "text": "Coffee time!",
      "source": "memory_engine",
      "created_at": "2026-07-02T08:00:00Z"
    }
  ]
}
```

Device renders `text` (Firmware doc Section 04), then acknowledges:

```json
POST /api/pager/notifications/ntf_9f2a/ack
Authorization: Bearer <device_token>
{ "shown_at": "2026-07-02T08:00:04Z" }
```

**Where notifications originate:** any existing LOT signal source can enqueue
one — Memory Engine reminders, streak-at-risk alerts from the OS API
diagnostics endpoint (`docs/technical/OS_API.md`, `issues[].suggestion`), or a
weather-derived recommendation from the same pipeline `LOT-AMBIENT-AI-VISION.md`
describes for LOT® Station. This document does not add a new notification
*generator* — it adds a *delivery surface* those existing systems can target,
the same way a push-notification service is a delivery surface, not a source
of truth.

---

## 03. The "Copy" Signal (Device → Log tab)

This is the core reverse path: pressing the physical button writes to the
operator's **Log tab** on lot-systems.com.

```json
POST /api/pager/copy-signal
Authorization: Bearer <device_token>
{
  "device_id": "pager-A1B2C3",
  "pressed_at": "2026-07-02T08:00:09Z",
  "last_notification_id": "ntf_9f2a",
  "session": {
    "env_summary": {
      "temp_c": { "min": 21.2, "max": 22.1, "avg": 21.6 },
      "humidity_pct": { "avg": 43 },
      "aqi_index": { "avg": 62, "status": "Good" }
    },
    "notifications_shown": 2,
    "battery_pct": 78
  }
}
```

Server-side handling (proposed, mirrors the existing LOG trigger pattern in
`src/client/utils/logTriggers.ts` and the block-rendering convention in
`src/client/components/Logs.tsx`):

1. Validate `device_token` → resolve `operator_id`.
2. Write a Log entry: *"Copied: Coffee time! — via LOT® Pager"* (or a
   sensor-only variant if `last_notification_id` is null — a plain ambient
   check-in).
3. If `session.env_summary` is present, route it through the same intake
   path `LOT-TERMINAL-M2M.md` defines for LOT® Station-class devices (Format
   3, multi-sensor array) — the Pager is simply another `device_type` in that
   existing schema, not a new protocol.
4. Emit a new `LogTrigger` value, e.g. `'pager-copy'`, so the Log tab can
   render a `PGR:` block the same way `/breathe`, `/fast`, and `/silent`
   render `BRE:`, `FAST:`, `SIL:` blocks today (`Logs.tsx`) — giving the
   operator a visual confirmation distinct from a typed log entry.
5. Feed the acknowledgment timing (`pressed_at` minus `notification
   created_at`) into QIE as a new signal: how fast does this operator respond
   to a physical nudge versus an in-app one. This is additive context for
   the existing consistency/response-pattern scoring, not a new engine.

---

## 04. Companion Surface (Phone/Browser Side)

v1 does not require a native mobile app. The existing System/Settings tab
gains one panel:

```tsx
// Proposed — Settings tab, "Hardware" panel
const PagerPanel = () => {
  const { paired, battery, lastSeen } = usePagerStatus() // GET /api/pager/status

  return (
    <Block label="LOT® Pager:" blockView>
      {!paired && <PairButton />}
      {paired && (
        <>
          <div>Battery: {battery}%</div>
          <div>Last seen: {lastSeen}</div>
          <div>Camera capture: {/* pending-image review, if any */}</div>
        </>
      )}
    </Block>
  )
}
```

This follows the same shape as the existing `OSInfoPanel` /
`PerformanceWidget` pattern documented in `OS_API.md` — a read-only status
block plus one action (pair / unpair), nothing heavier for v1.

**Camera review flow:** if firmware captured an image (Firmware doc Section
06), it surfaces here as a pending item — operator explicitly attaches it to
a Log entry or discards it. The device never auto-uploads; this panel is
where the operator's consent action actually happens, per the Hardware Spec
Section 04 consent model.

---

## 05. Endpoint Summary

```
POST /api/pager/pair-token          operator-authenticated, issues short-lived token
POST /api/pager/register            device → server, exchanges pairing token
GET  /api/pager/notifications       device polls for pending messages
POST /api/pager/notifications/:id/ack   device confirms display
POST /api/pager/copy-signal          device → Log tab write + M2M sensor intake
GET  /api/pager/status               companion surface reads device state
```

All device-facing endpoints require `Authorization: Bearer <device_token>`
issued at registration — no endpoint accepts a shared or fleet-wide secret,
consistent with the operator-scoped credential model already established for
M2M intake.

---

## 06. Relationship to Existing M2M Protocol

`LOT-TERMINAL-M2M.md` already defines the multi-sensor JSON intake format and
the `POST https://api.lot-systems.com/v1/m2m/intake` endpoint (marked
"Future" in that document — still future here too). LOT® Pager's
`session.env_summary` payload (Section 03) is designed to map directly onto
that existing Format 3 schema:

```json
{
  "device_id": "pager-A1B2C3",
  "operator": "vadik",
  "device_type": "wearable_notification_pager",
  "sensors": [
    { "type": "temperature", "value": 21.6, "unit": "celsius" },
    { "type": "humidity", "value": 43, "unit": "percent" },
    { "type": "air_quality", "value": 62, "scale": 100, "status": "Good" }
  ]
}
```

No second intake pipeline is proposed. LOT® Pager is a new `device_type`
inside the protocol the platform has already scoped, which is the same
reuse discipline `LOT-PAGER-VISION.md` applies to the product line as a
whole (Pager as the smallest sibling of Station/Brush/Cube, not a parallel
system).
