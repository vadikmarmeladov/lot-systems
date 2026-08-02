<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-SOFTWARE
TITLE:    COSMO® Cube — Software / LOT API Connector Specification v1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-02
VERSION:  1.0
COMPANIONS: docs/technical/LOT-COSMO-CUBE-FIRMWARE.md (device-side firmware),
            docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md (physical spec)
================================================================================

Kept SEPARATE from the firmware document per brief item 11 — this document
covers the lot-systems.com side: what already exists in this codebase, what
is new, and the wire protocol between the two.

--------------------------------------------------------------------------------
00 // WHAT ALREADY EXISTS IN THIS REPO (read before designing anything new)
--------------------------------------------------------------------------------

  fastify.models.Log                  A Log model already exists and is
   (src/server/routes/api.ts:2435-2440) written to today: `{ userId, event,
                                        text, metadata }`. This is the "Log
                                        tab" the brief refers to (brief item
                                        16) — it is a real, existing table,
                                        not a new concept invented for this
                                        device.

  GET /logs                           An existing endpoint already reads
   (src/server/routes/api.ts:1082)     back a user's log entries — this is
                                        what renders the Log tab UI. The
                                        Copy button's job (Section 02) is to
                                        add ONE more row to what this
                                        endpoint already returns, via a new
                                        event type, not a new table.

  GET /weather                        An existing endpoint already fetches
   (src/server/routes/api.ts:1038-1080) and caches weather by the user's
                                        city/country (external API,
                                        WeatherResponse model, cached
                                        15-min-ish via WEATHER_STALE_TIME_MINUTES).
                                        COSMO® Cube's on-device weather
                                        sensor (hardware spec Section 02,
                                        brief item 14) is a DIFFERENT,
                                        complementary signal — hyperlocal,
                                        physically at the device, not city-
                                        level from an external API. v1 does
                                        not merge the two; Section 03 below
                                        records them as two distinct signal
                                        sources under the same user.

  req.user session auth                Every existing route above reads
   (throughout src/server/routes/api.ts) `req.user` from an authenticated
                                        session (cookie-based, browser
                                        login flow) — there is no existing
                                        Bearer-token / device-credential
                                        auth path in this codebase. Section
                                        01 below is NEW work, not a reuse of
                                        something that already exists.

--------------------------------------------------------------------------------
01 // DEVICE PAIRING & AUTH  (NEW)
--------------------------------------------------------------------------------

  COSMO® Cube cannot hold a browser session cookie. v1 adds a narrow,
  device-scoped credential instead of reusing the session model:

    PAIRING FLOW
      1. Operator opens a "Pair a device" screen on lot-systems.com
         (new UI, scoped to their existing logged-in session).
      2. Server issues a short-lived (10 min) 6-digit pairing code tied
         to `req.user.id`.
      3. Device (first boot, no stored credentials) exposes a
         Wi-Fi-AP provisioning mode; once given Wi-Fi credentials and
         the pairing code, it calls a NEW endpoint:
           POST /api/device/pair  { pairing_code, device_id }
         Server validates the code, issues a long-lived device token
         (opaque, revocable, stored hashed — same pattern as any API
         key, not a session cookie), and returns it once.
      4. Device stores the token in NVS (firmware spec Section 01) and
         sends it as `Authorization: Bearer <device_token>` on every
         subsequent call.

    REVOCATION
      Operator can revoke a paired device from their LOT Systems
      account settings (new UI) at any time — the same "disconnection
      is instant and permanent" principle already stated for COSMO®
      robotics in docs/corporate/LOT_ROBOTICS_COSMO.md's ethical
      framework applies here to a much smaller, non-robotic device.

--------------------------------------------------------------------------------
02 // THE COPY SIGNAL  (brief item 16 — the core new endpoint)
--------------------------------------------------------------------------------

    POST /api/device/copy
    Authorization: Bearer <device_token>
    Content-Type: application/json

    {
      "device_id": "cosmo-cube-<serial>",
      "notification_id": "ntf_8f21ac",
      "ts": "2026-08-02T13:40:00Z"
    }

  Server-side handling (extends the existing pattern at
  src/server/routes/api.ts:2434-2440):

    const context = await getLogContext(req.user)
    await fastify.models.Log.create({
      userId: req.user.id,
      event: 'cosmo_cube_copy',
      text: '',
      metadata: { device_id, notification_id, source: 'cosmo_cube' },
    })

  RESPONSE
    { "status": "logged" }   — device shows the local confirm blink
                               (firmware spec Section 04) on receipt;
                               it does not wait for or render this
                               response as on-screen text.

  This is deliberately the entire feature: one signal, one new event
  type on an existing model, appearing in the existing Log tab UI via
  the existing GET /logs endpoint with no changes required there — a
  new `event` value is additive, not breaking.

--------------------------------------------------------------------------------
03 // NOTIFICATION PUSH  (brief item 2 — "AI-powered site" -> device)
--------------------------------------------------------------------------------

  NEW: a persistent WebSocket channel, one connection per paired device,
  authenticated at connect time with the same device token from Section
  01.

    SERVER -> DEVICE
    { "type": "notify", "text": "Coffee time!", "ttl_s": 3600 }

  WHAT DECIDES TO SEND ONE
    Out of scope for this document — the decision of WHAT/WHEN to
    notify belongs to lot-systems.com's existing pattern/archetype
    engine (the same Index of Systems referenced throughout the LOT
    corpus, e.g. docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 05).
    This connector only specifies the transport: server decides, pushes
    over the open socket, device renders. No polling loop on the device
    side — a held-open socket is cheaper on both battery (firmware spec
    Section 03's duty-cycle discipline) and server load than a poll.

--------------------------------------------------------------------------------
04 // ON-DEMAND CAMERA CAPTURE  (brief item 5)
--------------------------------------------------------------------------------

    SERVER -> DEVICE (over the same WebSocket)
    { "type": "capture_request", "request_id": "req_44a1" }

    DEVICE -> SERVER (new endpoint, multipart or base64 JPEG)
    POST /api/device/capture
    Authorization: Bearer <device_token>
    { "request_id": "req_44a1", "image": "<jpeg bytes>" }

  Server stores the frame (new table or object storage — not specified
  further here; a storage/retention policy is a v1 implementation
  decision, not an architecture decision, and does not block this
  document). No frame is ever captured or uploaded without an explicit
  `capture_request` or a local long-press (firmware spec Section 04) —
  there is no scheduled/background capture loop in v1.

--------------------------------------------------------------------------------
05 // HYPERLOCAL WEATHER UPLOAD  (brief item 14)
--------------------------------------------------------------------------------

    POST /api/device/weather
    Authorization: Bearer <device_token>
    { "device_id": "...", "readings": [
        { "ts": "...", "temp_c": 22.4, "humidity_pct": 41, "pressure_hpa": 1013.2 }
        ... up to 6 batched readings, firmware spec Section 03
    ]}

  Stored against the device/user, kept distinct from the existing
  WeatherResponse cache (Section 00) rather than merged into it — the
  existing table is external-API city-level data; this is a new,
  separate device-reading table. Any future correlation (e.g. "your
  desk is 3 degrees warmer than the city average, blinds closed?") is a
  v2+ product decision, not a v1 requirement.

--------------------------------------------------------------------------------
06 // SECURITY NOTES
--------------------------------------------------------------------------------

  - Device tokens are opaque and stored hashed server-side (never
    reversible), matching the standard API-key storage pattern already
    implied by `apiKeysConfigured` (src/server/routes/api.ts:2225) for
    other integrations in this codebase.
  - All device<->server traffic over TLS. The device holds no PII
    beyond its own token; the Log/Copy signal carries no data payload
    beyond an event and a notification ID, consistent with the
    M2M security stance already documented in
    docs/corporate/LOT-TERMINAL-M2M.md ("Data Standards" — encrypted
    transport, no personal health data in M2M protocol).
  - A stolen device token can create Copy log entries and request one
    captured frame — it cannot read the operator's account, journal, or
    any other LOT Systems data. Scope of the token is deliberately
    narrow.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-SOFTWARE
================================================================================
