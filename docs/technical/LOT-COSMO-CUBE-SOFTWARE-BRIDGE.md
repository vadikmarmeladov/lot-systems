<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
COSMO® CUBE — MODEL S1
SOFTWARE BRIDGE / LOT API CONNECTOR v1.0
================================================================================

DOCUMENT    LOT-COSMO-CUBE-SOFTWARE-BRIDGE
CLASS       RESTRICTED // S-2 EYES
S-2         VADIK MARMELADOV
DATE        2026-07-05
RELATED     LOT-COSMO-CUBE-FIRMWARE.md · LOT-COSMO-CUBE-HARDWARE-SPEC.md

This document governs everything on the lot-systems.com side: the new
routes, the new model, and the pairing app. It is written against the
actual current codebase (LOT-SYSTEM-OUTLINE.md architecture: Fastify +
Sequelize + PostgreSQL, SSE for the browser client, no WebSocket) — every
reference below points at a real file and line in this repo as of this
session, not a hypothetical API.

================================================================================
01 // PAIRING
================================================================================

The device ships UNPAIRED (LOT-COSMO-CUBE-FIRMWARE.md §01). Pairing needs a
human-in-the-loop step because the device has no keyboard to enter LOT
credentials directly.

    FLOW:
      1. Operator opens Settings on lot-systems.com (existing tab, see
         LOT-SYSTEM-OUTLINE.md §03 SETTINGS TAB), new "Devices" section.
      2. Operator clicks "Pair a COSMO Cube" → server issues a 6-digit
         pairing code, valid 10 minutes, tied to req.user.id. This reuses
         the exact pattern already in src/server/models/email-code.ts
         (short-lived code + validUntil column) — a new `DeviceCode` model,
         same shape, rather than a new mechanism.
      3. Device is in BLE advertising mode out of the box. A minimal
         pairing companion (a thin page served at lot-systems.com/pair,
         Web Bluetooth — no native app required for v1) connects to the
         device over BLE and writes the 6-digit code plus the operator's
         chosen WiFi SSID/password into the device over a BLE
         characteristic.
      4. Device connects to WiFi, POSTs the code to
         POST /api/device/pair { code, deviceHwId }.
      5. Server validates the code against DeviceCode, creates a `Device`
         row scoped to req.user.id (resolved via the code, not a session
         cookie — the device has no browser session), returns a long-lived
         device token. Device stores it in NVS flash and moves to ACTIVE.

    WHY BLE FOR PAIRING BUT WIFI FOR OPERATION: BLE has no WiFi credentials
    to leak over the air during setup and doesn't require the device to
    already be on the operator's network to start pairing. Once WiFi
    credentials are delivered once over BLE, the device never needs BLE
    again in normal operation (LOT-COSMO-CUBE-HARDWARE-SPEC.md §09).

================================================================================
02 // NEW MODEL — Device
================================================================================

Twelfth Sequelize model, added alongside the existing eleven
(LOT-SYSTEM-OUTLINE.md §05 MODELS). Same file convention as
src/server/models/email-code.ts:

    src/server/models/device.ts

      id               UUID, primary key
      userId           UUID, FK → User.id
      name             string, operator-assigned label ("Desk Cube")
      tokenHash        string, hashed long-lived device token (never store
                       the raw token — same principle as password/session
                       handling elsewhere in this codebase)
      hwId             string, device-reported hardware ID (from the MCU's
                       factory-programmed identifier)
      firmwareVersion  string
      lastSeenAt       DATE, updated on every /api/device/pull
      batteryPct       integer, nullable, last-reported value
      pairedAt         DATE

    src/server/models/device-code.ts  (the short-lived pairing code,
                                       mirrors email-code.ts exactly:
                                       code, userId, validUntil)

Both registered in src/server/models/index.ts alongside the current
eleven.

================================================================================
03 // NEW ROUTES — device-api.ts
================================================================================

New route module, following the existing convention of one file per
concern (LOT-SYSTEM-OUTLINE.md §05 ROUTES: api.ts, admin-api.ts, os-api.ts,
public-api.ts, auth.ts) — this becomes the sixth: src/server/routes/
device-api.ts, registered in the same fastify.register() pattern as the
others.

    POST /api/device/pair
      Body: { code, hwId }. No auth header (device has no token yet).
      Validates code against DeviceCode, creates Device, returns
      { deviceToken }.

    GET /api/device/pull
      Auth: Bearer <deviceToken>, resolved to Device → userId (a small
      fastify preHandler mirroring the existing session-auth preHandler in
      spirit, but checking the device token table instead of the Session
      model).
      Returns: { text: string, ttl: number }. This is the line
      LOT-COSMO-CUBE-FIRMWARE.md §02 displays. See §04 below for how
      `text` is generated. Updates Device.lastSeenAt and, if provided as a
      query param, Device.batteryPct.

    POST /api/device/copy
      Auth: Bearer <deviceToken>.
      Body: { text, sessionSummary, batteryPct, firmwareVersion, photo?
      (base64, optional) }.
      Creates a Log row exactly the way the existing
      POST /logs handler does (src/server/routes/api.ts:1455-1479) —
      same fastify.models.Log.create() call, same getLogContext(req.user)
      call for consistency with every other log entry — but with
      event: 'device_copy' and metadata: { deviceId, sessionSummary,
      batteryPct, firmwareVersion, hasPhoto }. If a photo is present, it is
      stored the same way any existing image-bearing feature in this
      codebase stores binary payloads (object storage, not inline in
      Postgres) and metadata carries the reference URL, not the bytes.

    REQUIRED WHITELIST CHANGE (Backend Whitelist Hygiene, LOT-DOCTRINE.md):
      'device_copy' must be added to the displayableEvents array in
      GET /logs (src/server/routes/api.ts:1041-1109) or the entry is
      created but never appears in the operator's LOG tab — silently.
      This is the exact failure mode the doctrine clause names
      (SR-20260604-01: calendar_entry saved but never returned). The Copy
      button's entire purpose is to write into the LOG tab, so this line
      is not optional polish — it is the feature.

================================================================================
04 // THE PAGER LINE — WHERE "text" COMES FROM (point 2)
================================================================================

The brief asks for "a pager-like notification from an AI-powered site" —
concretely: what generates "Coffee time!"

    GET /api/device/pull generates its response the same way the existing
    Memory Engine already generates a contextual line for the browser
    client — reusing infrastructure rather than building a second AI path:

      - getLogContext(req.user)-equivalent context gather: time of day,
        weather (WeatherResponse model), last session gap, current
        assembly phase.
      - Same tiered AI engine as Memory questions
        (LOT-SYSTEM-OUTLINE.md §05 AI INFERENCE: Claude Haiku for
        lightweight generation) — a short prompt constrained to
        "one short phrase, under 40 characters, for a small ambient
        display" rather than the Memory Engine's fuller question format.
      - Cached server-side per operator for the poll interval (default
        90s, matches LOT-COSMO-CUBE-FIRMWARE.md §02) so a device polling
        every 90s doesn't trigger a fresh AI call every single poll — only
        when the cached line has expired or the underlying context
        (weather, time-of-day bucket, assembly phase) has materially
        changed.

    THIS DOES NOT CONTRADICT THE SITE'S OWN "NO PUSH" DOCTRINE. About.tsx
    already states the browser client's design position explicitly:
    "No push. No alert. No interruption" (Context Over Notification,
    About.tsx:4104) and draws a firm line between a "transmission"
    (structural state report) and a "notification" (About.tsx:3358). The
    Cube does not change that — the browser client still never pushes.
    The physical device is a deliberately separate channel: an ambient
    object the operator chooses to look at, not an interruption injected
    into the software. The pager metaphor lives on the object, not on
    lot-systems.com itself.

================================================================================
05 // OTA
================================================================================

    GET /api/device/firmware/latest
      Auth: Bearer <deviceToken>.
      Returns: { version, url, sha256 } if Device.firmwareVersion is
      behind the current release; device fetches and verifies before
      flashing (LOT-COSMO-CUBE-FIRMWARE.md §00 esp_https_ota, signed
      images). Rollout can be staged by Device row (percentage or
      allow-list) rather than all-at-once — relevant once past the
      100-unit pilot run into any larger batch.

================================================================================
06 // WHAT THIS DELIBERATELY DOES NOT DO IN v1
================================================================================

    - No MQTT broker, no persistent socket to the device. Poll-based
      /api/device/pull is simpler ops for a 100-unit pilot and reuses the
      existing Fastify REST stack with zero new infrastructure. Revisit
      only if unit volume and battery data justify a push transport
      (LOT-COSMO-CUBE-ROADMAP.md §05 flags this as a Phase-2-or-later
      decision, not a v1 requirement).
    - No public Robot Training Data API exposure for device signals
      (docs/corporate/LOT-CUBIQ-OPERATOR.md §06) in v1 — device-sourced
      log entries are operator-private like any other LOG entry until a
      separate decision is made to include them in that pipeline.
    - No COSMO® Benchmark eligibility gate (docs/corporate/
      LOT_ROBOTICS_COSMO.md "Benchmark Arbitrage Gate") on this SKU —
      that gate is specific to the soul-transfer robotics line described
      in that document. The Cube is a desk companion, sold directly to
      any Usership-tier operator, not gated by Benchmark tier.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-SOFTWARE-BRIDGE
================================================================================
