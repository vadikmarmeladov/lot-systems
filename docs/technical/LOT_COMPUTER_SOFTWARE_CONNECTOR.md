<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT_COMPUTER_SOFTWARE_CONNECTOR
TITLE:    LOT® Computer — LOT API Connector & Server-Side Software Spec
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-01
VERSION:  0.1 — DEVELOPMENT START
COMPANION:  docs/corporate/LOT_COMPUTER_HARDWARE_PLAN.md (physical + BOM)
            docs/technical/LOT_COMPUTER_FIRMWARE_SPEC.md (on-device firmware)
================================================================================

Kept as a separate document from the hardware plan and firmware spec per
brief item 11. This document specifies only what runs on the LOT server
(src/server/routes/) and in the operator's dashboard — nothing here
describes on-device behavior; see the firmware spec for that.

--------------------------------------------------------------------------------
01 // WHAT ALREADY EXISTS (no reinvention)
--------------------------------------------------------------------------------

```
COMPONENT                          FILE                              STATUS
────────────────────────────────   ───────────────────────────────   ─────────
Log create/update endpoints        src/server/routes/api.ts:1547     LIVE
  POST /logs, PUT /logs/:id          (:1573)
Log context builder                #server/utils/logs                LIVE
  getLogContext()
Weather API integration            #server/utils/weather             LIVE
  used by public-api.ts, OS insights
SSE real-time event streaming      (house convention — no WebSocket,  LIVE
                                     per docs/technical/LOT_SYSTEMS_
                                     BRIEF.md architecture section)
Admin API patterns                 src/server/routes/admin-api.ts    LIVE
  (precedent for the device fleet panel, Section 05)
Public API patterns                src/server/routes/public-api.ts   LIVE
  (precedent for unauthenticated/device-scoped routes, Section 02)
Badge PDF generation scripts       scripts/generate_badge_pdf*.py     LIVE
  (precedent for the manual generation pipeline, Section 06)
```

Everything below is new surface built on top of this, not a parallel
stack.

--------------------------------------------------------------------------------
02 // DEVICE PAIRING
--------------------------------------------------------------------------------

New table: `devices` (Sequelize model, mirrors the existing `agent_ledger`
migration pattern — docs/corporate/LOT_Autonomous_AI_Server.md, Section 04).

```
devices
  id              UUID PK
  userId          UUID FK → users
  serialNumber    VARCHAR(64) UNIQUE   — burned at QC test jig (firmware
                                          spec, Section 08)
  deviceToken     VARCHAR(256)         — scoped bearer token, revocable
  pairedAt        TIMESTAMP
  lastSeenAt      TIMESTAMP
  status          VARCHAR(16)          — pairing/active/revoked
  firmwareVersion VARCHAR(32)
  metadata        JSONB
```

```
POST /api/devices/pair
  Body: { pairingCode: string }         (operator-entered, from the
                                          device's on-screen code —
                                          firmware spec Section 02)
  Auth: existing session (operator is logged in on lot-systems.com)
  Effect: looks up the pending device by pairingCode (short TTL, single
          use), creates a `devices` row bound to req.user.id, returns
          WiFi-credential-carrying payload over the same request the
          device's BLE-adjacent setup flow completes with.

POST /api/devices/:id/unpair
  Auth: existing session, must own the device
  Effect: sets status='revoked', deviceToken invalidated immediately.
          Hardware plan §11 — instant disconnect: no remote wipe command
          needed, a revoked token is sufficient (firmware spec Section 02).
```

--------------------------------------------------------------------------------
03 // NOTIFICATION PUSH CHANNEL
--------------------------------------------------------------------------------

Reuses the existing SSE infrastructure rather than introducing MQTT or a
second transport:

```
GET /api/devices/:id/stream          (device-authenticated, deviceToken
                                       bearer, long-lived SSE connection)
  Emits: { text: string, source: string, ts: string }
  Sourced from the same signal classes CUBIQ™ maps to gestures
  (hardware plan §07):
    - weather-mood pattern (OS_API insight) → "Coffee time!" class text
    - badge unlock event
    - memory question ready
    - assembly phase advance
    - streak milestone
  A lightweight mapping table (signal type → short pager text template)
  lives server-side, versioned independently of firmware so message
  copy can be tuned without an OTA push.
```

If a device is offline when a signal fires, the message is held
server-side (last-message-wins per device, matching the firmware's
depth-1 queue, firmware spec Section 03) and delivered on next connect —
the server does not need its own retry/backlog logic beyond "send current
pending message on stream-open."

--------------------------------------------------------------------------------
04 // COPY BUTTON → LOG TAB (hardware plan §08)
--------------------------------------------------------------------------------

No new endpoint. The device POSTs to the existing `/logs` route:

```
POST /logs
  Auth: deviceToken → resolved to req.user server-side (device requests
        authenticate as their paired user, same as a browser session
        resolves to req.user today)
  Body: {
    text: "<currently displayed pager text>",
    event: "device_copy",
    metadata: { deviceId, source: "lot-computer" }
  }
```

TWO REQUIRED CHANGES to existing server code, both additive:

  1. Auth middleware must accept a deviceToken bearer as an alternative
     to the existing session/cookie auth path, resolving to the same
     req.user contract every other route already expects. No existing
     route's auth logic changes; a new resolution path is added
     alongside it.

  2. `formatLog()` needs an explicit case for `event: 'device_copy'` —
     per docs/benchmark/LOT-DOCTRINE.md's Widget→Memory Compression Loop
     rule, an event type with no formatLog case returns empty string and
     is silently invisible to the Memory Engine even though it is stored.
     This is called out explicitly here because it is exactly the kind
     of silent-erasure bug that rule exists to prevent — LOT Computer's
     entire Section 04 purpose (make an operator's acknowledgment visible
     in their Log tab) fails silently if this case is skipped.

Camera captures (firmware spec, Section 04) attach as a second field on
the same POST when a long-press triggered a capture:

```
Body (long-press variant): {
  text: "<pager text>",
  event: "device_copy",
  metadata: { deviceId, source: "lot-computer", hasCapture: true },
  capture: "<base64 JPEG, size-capped>"
}
```

--------------------------------------------------------------------------------
05 // SESSION-COMPRESSION INGESTION (hardware plan §09)
--------------------------------------------------------------------------------

```
POST /api/devices/:id/session
  Auth: deviceToken
  Body: firmware spec §06 session payload (copyPresses, captures,
        weatherSamples, chargeEvents)
  Effect: unpacked server-side into a small number of Log entries — NOT
          one row per raw sample. Weather samples are reduced to a daily
          min/max/mean before ever touching the `logs` table, mirroring
          the existing weekly-story aggregation pattern (Job 24,
          docs/benchmark/LOT-MANIFEST.md §06) rather than flooding the
          Log tab with 96 weather rows a day.
```

  WEATHER CROSS-CHECK: device-reported local readings are compared
  against the existing server-side weather API call
  (`#server/utils/weather`) for the operator's registered location. A
  persistent drift beyond a threshold is itself worth one Log entry (a
  miscalibrated or misplaced sensor is useful signal), not silently
  discarded.

--------------------------------------------------------------------------------
06 // FLEET / DEVICE MANAGEMENT PANEL (100-unit run)
--------------------------------------------------------------------------------

Admin panel, following the existing admin-api.ts precedent:

```
GET  /api/admin/devices                 List all devices — serial,
                                         status, firmware version,
                                         lastSeenAt, owning user.
POST /api/admin/devices/:id/ota-approve  Human-gated OTA push (firmware
                                         spec §08) — the one write path
                                         in this whole spec classified
                                         irreversible-adjacent and
                                         requiring explicit approval,
                                         matching the agent-ledger human
                                         gate model already live in this
                                         repo (LOT_Autonomous_AI_Server.md
                                         §04, action classification
                                         "irreversible").
```

The QC test jig (firmware spec, Section 08) pass/fail log per serial
number is the seed data for this panel's initial 100-unit roster.

--------------------------------------------------------------------------------
07 // PDF MANUAL GENERATION (brief item 7)
--------------------------------------------------------------------------------

  PRECEDENT   scripts/generate_badge_pdf*.py — this repo already
              generates versioned PDF documents from structured content
              (the Badge Codex series, docs/badges/LOT-BADGES-
              ACHIEVEMENTS-MASTER-CODEX-v*.pdf). LOT Computer's manual
              generation reuses this pipeline shape rather than
              introducing a new PDF toolchain.

  PLAN        A markdown source (`docs/hardware/LOT-COMPUTER-MANUAL-
              SOURCE.md`, not yet written — gated on Section 08 below)
              feeds a generation script
              (`scripts/generate_lot_computer_manual_pdf.py`, not yet
              written) that outputs a versioned PDF to
              `docs/hardware/manuals/LOT-COMPUTER-MANUAL-v{N}.pdf`,
              covering: unboxing, pairing (Section 02), Copy button
              use (Section 04), charging (hardware plan §02 Part B),
              and troubleshooting (firmware spec §09 — offline
              behavior, explained in operator-facing language).

  GATE — NOT YET EXECUTABLE: a manual documents a physical object.
  Photography, exact button placement, and real charge-time figures
  require a hardware plan §06 v2 pilot unit in hand. This section is the
  plan for that pipeline, staged to run the moment a pilot unit exists —
  it is intentionally not populated with placeholder photos or invented
  specs today.

--------------------------------------------------------------------------------
08 // BUILD ORDER (server-side)
--------------------------------------------------------------------------------

```
01   `devices` table + migration (Section 02)
02   deviceToken auth resolution path, additive to existing middleware
03   POST /api/devices/pair, POST /api/devices/:id/unpair (Section 02)
04   formatLog() case for `device_copy` (Section 04) — do this before
      any device can POST, per the silent-erasure warning above
05   GET /api/devices/:id/stream (Section 03), signal→text mapping table
06   POST /api/devices/:id/session (Section 05), aggregation into Log
07   Admin fleet panel (Section 06), gated ota-approve endpoint
08   Manual generation pipeline (Section 07) — deferred until a pilot
      unit exists (hardware plan §06, v2)
```

Order matters for the same reason it matters in every other LOT hardware
document: the `device_copy` formatLog case (step 04) exists before any
device is allowed to write to `/logs` in the field, so there is never a
window where an operator's Copy press is stored but invisible.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT_COMPUTER_SOFTWARE_CONNECTOR
================================================================================
