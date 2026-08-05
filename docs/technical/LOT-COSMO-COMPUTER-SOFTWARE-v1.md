================================================================================
LOT SYSTEMS CORPORATION
COSMO® COMPUTER — SITE-SIDE SOFTWARE SPECIFICATION (LOT API CONNECTOR)
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
================================================================================

DOCUMENT    LOT-COSMO-COMPUTER-SOFTWARE-v1
ISSUE DATE  2026.08.05
STYLE       TERMINAL GRID
PARENT      docs/corporate/LOT-COSMO-COMPUTER-v1.md (Section 10, item 3)
SIBLING     docs/technical/LOT-COSMO-COMPUTER-FIRMWARE-v1.md (device-side
            half of the same LOT API connector — kept separate per brief
            point 11)

================================================================================

## 00  SCOPE

This document specifies what runs on lot-systems.com (server + client) to
connect to a COSMO® Computer unit — brief point 10: "Software to connect
with firmware." It is written against the live codebase as of this session
(verified paths below), not against a hypothetical future rewrite. It
proposes additions; it does not implement them — implementation is a normal
Benchmark ENGINEERING session against these exact files.

================================================================================

## 01  WHAT ALREADY EXISTS (VERIFIED THIS SESSION)

    src/server/routes/api.ts
      Existing GET /weather and GET /logs endpoint family (lines ~1038,
      ~1082 as of this session's read). The weather endpoint already
      answers the same class of question the device's BME280 sensor
      answers locally (parent doc Section 03) — device telemetry should be
      treated as a second SOURCE feeding the same concept, not a
      competing endpoint.

    src/client/components/SystemProgressWidget.tsx
      Existing military-handler dispatch table for log events — REC:
      (recipe_viewed), BADGE: (badge_unlock), COHORT: (cohort_determined),
      VITALS: (os_vitals_snapshot), SYNC: (signal_sync), and a generic
      event-name-derived fallback label, per this file's own build
      history. This is the exact table the new COPY: handler (Section 03
      below) extends — one more row, not a new mechanism.

    docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md, Section III
      Layer 1, Calibration Loop: "deliberate + passive inputs = user-
      specific context vector." The device's Copy-button event is
      deliberate; its weather telemetry is passive. Both map onto inputs
      the Loop already has a shape for.

No public, device-facing authenticated endpoint currently exists in
public-api.ts or api.ts for a physical device to push events or pull
notifications. Section 02 proposes the minimal addition.

================================================================================

## 02  PROPOSED ADDITIONS (NOT YET IMPLEMENTED)

    DEVICE PROVISIONING
      A per-device auth token, issued when an operator pairs a COSMO®
      Computer unit via BLE from an authenticated lot-systems.com session
      (firmware doc Section 01). Server-side: a device record bound to the
      operator's user ID, token stored hashed, same pattern as any other
      long-lived API credential in the existing auth model — no new auth
      PARADIGM, one new credential class.

    DOWN-CHANNEL — GET /api/device/notifications/poll
      Device-authenticated (per-device token, not the operator's browser
      session cookie). Returns the next pending pager-class notification
      for the bound operator, or empty. Notification SOURCE is QI·46's
      existing signal-fire decision point (already diagrammed for CUBIQ in
      LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 05) — this endpoint is a new
      DELIVERY target for a decision the Index of Systems already makes,
      not a new decision engine.

    UP-CHANNEL — POST /api/device/events
      Device-authenticated. Accepts the three event classes named in the
      firmware document Section 05:
        - device_notification_copy  (Section 03 below — the Copy button)
        - weather_telemetry
        - device_photo_capture
      Server behavior: writes to the existing log-event pipeline that
      /logs already reads from (src/server/routes/api.ts), tagged with the
      device's bound operator ID exactly as any other user-originated
      event is tagged today.

    v1.1 UPGRADE PATH
      Poll-based down-channel replaced with a persistent connection
      (parent doc Section 07, v1.1) once the poll-based loop is field-
      proven. Not proposed for v1.0 server work.

================================================================================

## 03  THE COPY BUTTON -> LOG TAB (BRIEF POINT 16, FULL SITE-SIDE PATH)

    POST /api/device/events { type: device_notification_copy, ... }
        |
        v
    Server validates device token, resolves bound operator ID, writes a
    log event using the SAME event-write path other log-producing features
    already use (no new table — the CQGS-documented pattern of routing
    everything through one log pipeline holds here too)
        |
        v
    Existing /logs read path (src/server/routes/api.ts) returns it to the
    client alongside every other event type it already returns
        |
        v
    SystemProgressWidget.tsx dispatch table gains ONE new entry:
      device_notification_copy -> COPY: handler
      Rendered form (matching the existing terse military-label
      convention of REC:/BADGE:/VITALS:): 
        COPY: "Coffee time!" — device <short-id> — <local time>
        |
        v
    Operator's Log tab at lot-systems.com shows the line, in place,
    alongside their existing journal/badge/cohort history — the device
    event reads as ONE MORE thing the operator's own system logged about
    them, not as a separate device-management surface.

    WHY ONE HANDLER, NOT A NEW TAB
      brief point 16 says "back to the site's Log tab" — singular,
      existing tab. A dedicated "Devices" surface is out of scope for this
      document; if operators eventually own multiple units, that is a
      future document's problem, flagged here so it is not silently
      assumed away.

================================================================================

## 04  WEATHER + CAMERA EVENTS — SITE-SIDE HANDLING

    weather_telemetry
      Same up-channel POST, different type. Server-side: candidate to feed
      the SAME context the existing GET /weather endpoint (Section 01)
      already serves into "session context" (LOT-CUBIQ-OPERATOR.md Section
      01, PRESENCE: "Weather and location context per session") — a
      device-local reading is a more precise source for an operator who
      has one, not a replacement for the remote-API path for operators who
      don't.

    device_photo_capture
      Same up-channel POST, image payload. v1.0 server behavior: store,
      associate with the operator's account, do NOT auto-surface into any
      public or shared view. This event class exists because the parent
      document (Section 02/03) specifies a camera; this document does not
      propose what the operator-facing feature built on top of it looks
      like — that is future product scope, explicitly not decided here.

================================================================================

## 05  WHAT THIS DOCUMENT DOES NOT DO

It does not write the actual Fastify route handlers, does not add the
device table to prisma schema, and does not implement the
SystemProgressWidget.tsx dispatch entry. Those are ENGINEERING-class
Benchmark work, sized to run once a physical prototype exists to test
against — building the server endpoint before any device can call it would
produce untested code sitting idle in the tree, which is not this
protocol's discipline (docs/benchmark/ — no artifact ships ahead of a real
consumer). This document is the agreed shape both firmware and site-side
implementation will build to when that session runs.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-SOFTWARE-v1
================================================================================
