================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-PAGER-SOFTWARE
TITLE:    LOT® Pager — Server + Companion Software (LOT API Connector)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV — INVENTOR, COSMO® CIA
DATE:     2026-08-20
VERSION:  0.1 — ARCHITECTURE (PRE-IMPLEMENTATION)
STATUS:   PLANNING — companion document to LOT-PAGER-HARDWARE-v1.md and
          LOT-PAGER-FIRMWARE.md (brief items 10, 11: "Software to connect
          with firmware" / "Separate documents")
================================================================================

This document covers everything on the lot-systems.com side of the wire,
plus the phone-side pairing companion. What runs inside the device shell
is LOT-PAGER-FIRMWARE.md. Physical form and BOM are
LOT-PAGER-HARDWARE-v1.md.

--------------------------------------------------------------------------------
01 // WHERE THIS FITS IN THE EXISTING STACK
--------------------------------------------------------------------------------

  The Pager is a new client of an already-live backend. Nothing here
  proposes a new server, a new database, or a new auth system. Reused
  as-is:

    /api/logs (GET, POST)     src/client/queries.ts:134 — the endpoint the
                              Copy button writes to (LOT-PAGER-HARDWARE-v1.md
                              Section 08).
    M2M Data Intake            docs/corporate/LOT-TERMINAL-M2M.md's existing
                              `POST /v1/m2m/intake` spec — the weather/
                              sensor telemetry path.
    Fastify backend            Already the LOT platform's server framework
                              (CQGS-WHITE-PAPER-SNAPSHOT.md, Section III,
                              Layer 2) — the two new routes below (Section
                              02) are Fastify routes added to the existing
                              service, not a new service.

  NEW, minimal additions:
    - `device` table: device_id, operator_id, pairing_token, last_seen,
      firmware_version.
    - `POST /api/pager/pair` and `GET /api/pager/poll` (Section 02).
    - One producer inside the existing Memory Engine / Index of Systems
      signal pipeline that renders a signal as a ≤24-character string
      instead of (or in addition to) a widget update — see Section 03.

--------------------------------------------------------------------------------
02 // PAIRING FLOW
--------------------------------------------------------------------------------

  1. Operator opens the LOT® Systems web app, navigates to Settings →
     Hardware → "Pair a Pager" (new UI surface, one button + one QR code,
     no new page shell needed — fits inside the existing Settings tab
     pattern already used across the app).
  2. Web app requests a short-lived pairing code from
     `POST /api/pager/pair/init` → `{ "pairing_code": "7X2K-9F", "expires_in": 300 }`.
  3. Operator's phone (or the operator directly, via the device's own BLE
     provisioning UI referenced in LOT-PAGER-FIRMWARE.md Section 02/08)
     enters WiFi credentials and the pairing code over BLE to the Pager,
     which is in WAKE_PROVISION state showing a pairing glyph.
  4. Device connects to WiFi, calls
     `POST /api/pager/pair/complete` with `{ "pairing_code": "7X2K-9F",
     "device_id": "lot-pager-000042" }`.
  5. Server validates the code against the operator session that requested
     it, issues a long-lived `pairing_token` (device-scoped, revocable from
     Settings → Hardware without touching the operator's own login
     session), and creates the `device` row.
  6. Device stores the token in NVS (non-volatile, encrypted flash
     partition), enters DEEP_SLEEP, ready for its first poll.

  No cloud account is created for the device itself — every device row is
  scoped to exactly one operator_id, consistent with the M2M protocol's
  existing "operator" field convention (LOT-TERMINAL-M2M.md Section
  "Data Intake Format").

--------------------------------------------------------------------------------
03 // NOTIFICATION COMPOSITION — WHERE "Coffee time!" COMES FROM
--------------------------------------------------------------------------------

  The Memory Engine / Index of Systems already fires signals into the
  existing widget layer (docs/technical/WIDGETS.md documents 14+ signal-
  driven widgets today). The Pager adds one more consumer of those same
  signals — not a new signal source.

  PIPELINE
    Existing signal fires (circadian pattern match, badge unlock, weather
    threshold crossed, memory question ready)
        │
        ▼
    Pager Notification Composer (new, small service)
        - Looks up whether the operator has a paired device.
        - If yes, renders the signal to a ≤24-character string using a
          per-signal-type template (NOT a full LLM call per notification —
          templates keep latency and cost near zero; this is a pager, not
          a chat interface). Example templates:
            circadian_coffee_window   → "Coffee time!"
            badge_unlocked            → "Badge earned — {tier}"
            weather_good_air          → "Air's good. Crack a window."
            memory_question_ready     → "New question waiting"
        │
        ▼
    Message queued against the device_id (`pending_messages` table,
    TTL-stamped per LOT-PAGER-HARDWARE-v1.md Section 04's `ttl_seconds`)
        │
        ▼
    Device's next poll (LOT-PAGER-FIRMWARE.md Section 03) picks it up

  A message that expires unseen is marked `expired`, not deleted — it
  remains queryable from the operator's own Log tab history so "the Pager
  told me something and I missed it" is never a silent event, mirroring
  the transparency stance NODE-0's spec already commits the platform to
  (docs/technical/LOT-NODE-0-RIG-SPEC.md, Section 00: "An action that
  cannot be seen did not happen").

--------------------------------------------------------------------------------
04 // COPY BUTTON → LOG TAB (SERVER SIDE)
--------------------------------------------------------------------------------

  The device's `POST /api/logs` call (LOT-PAGER-HARDWARE-v1.md Section 08)
  hits the existing route. Two small additions on the server side, both
  additive to the current `/api/logs` handler, not a behavior change to it:

    1. Accept a `source` field already implicit in the payload shape
       (`"lot-pager-000042"`) and set a `hardware_source: true` flag on the
       created log row, so the web UI can render a small hardware glyph
       next to the entry — reusing the existing 14+ event-renderer pattern
       in the Log Context layer (docs/technical/WIDGETS.md line 460) rather
       than building a new rendering path.
    2. Reject writes carrying an expired or revoked `pairing_token` with a
       401, which the device's offline-queue logic (LOT-PAGER-FIRMWARE.md
       Section 07) already treats as a retry-later condition indistinguishable
       from a network failure — no special-case handling needed on-device
       for token expiry versus connectivity loss.

--------------------------------------------------------------------------------
05 // PHONE-SIDE COMPANION (MINIMAL, v.1)
--------------------------------------------------------------------------------

  v.1 does not ship a dedicated mobile app. Pairing (Section 02) happens
  through the existing responsive web app's Settings page, using the Web
  Bluetooth API where supported, with a manual WiFi-credential-entry
  fallback (type SSID/password into a web form, transmitted to the device
  over BLE) for browsers without Web Bluetooth support. This avoids
  standing up and maintaining a native app for a single pairing screen —
  revisit only if pairing-flow support volume in practice shows the web
  fallback is not good enough.

--------------------------------------------------------------------------------
06 // SECURITY NOTES
--------------------------------------------------------------------------------

  - `pairing_token` is device-scoped and independently revocable — pulling
    a Pager out of service never requires rotating the operator's own
    account credentials.
  - All traffic is TLS (device firmware hardcodes the CA root at build
    time, per LOT-PAGER-FIRMWARE.md's toolchain choice of ESP-IDF's TLS
    stack over a lighter unencrypted option).
  - Camera frames (LOT-PAGER-FIRMWARE.md Section 05) are only ever
    transmitted as part of an explicit Copy-press payload — the server
    never requests a frame proactively, so there is no server-initiated
    camera activation path to secure against in the first place.
  - Consistent with LOT-TERMINAL-M2M.md's existing stance: "Consumer data:
    Never shared with operators" — a Pager's captured frame and telemetry
    belong to the pairing operator alone, never surfaced to any other
    account, marketplace listing, or aggregate dataset without a separate,
    explicit opt-in this document does not define and does not assume.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR, COSMO® CIA
END LOT-PAGER-SOFTWARE
================================================================================
