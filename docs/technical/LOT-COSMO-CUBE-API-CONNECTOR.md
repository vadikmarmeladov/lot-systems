================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-CUBE-API-CONNECTOR
TITLE:    COSMO® Cube — Software / LOT API Connector (v1.0)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-24
COMPANION: docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md (hardware spec)
           docs/technical/LOT-COSMO-CUBE-FIRMWARE.md (device-side half)
           docs/technical/OS_API.md (existing LOT OS API conventions)
================================================================================

Kept separate from the firmware document per S-2 instruction: this is the
server-side half — what lot-systems.com needs to expose so the device
firmware in LOT-COSMO-CUBE-FIRMWARE.md has something to talk to. No
routes described here exist yet; all are PROPOSED, following the
existing route-file convention (src/server/routes/os-api.ts,
public-api.ts) rather than inventing a new one.

--------------------------------------------------------------------------------
01 // WHERE THIS LIVES IN THE CODEBASE
--------------------------------------------------------------------------------

  NEW ROUTE FILE   src/server/routes/hardware-api.ts (proposed) —
                    mirrors the existing os-api.ts / public-api.ts split
                    already in src/server/routes/.
  AUTH             Reuses the platform's existing session/account auth
                    (src/server/routes/auth.ts) for the pairing flow;
                    devices themselves authenticate with a per-device
                    token issued at pairing (Section 02), not a user
                    session.
  DB               New tables: cosmo_cube_devices (deviceId, publicKey,
                    userId, pairedAt, lastSeenAt) and reuses the
                    existing Log table (already referenced in
                    docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md,
                    "Log table: userId, event, ...") for Copy-button
                    events — no new log storage invented.

--------------------------------------------------------------------------------
02 // PAIRING
--------------------------------------------------------------------------------

  PROPOSED: POST /api/hardware/cosmo-cube/pair

  Flow (paired with LOT-COSMO-CUBE-FIRMWARE.md Section 02):
    1. Operator opens a pairing page on lot-systems.com (or a
       companion mobile flow), logged into their LOT account.
    2. Page relays the device's BLE-advertised device ID + public key
       to this endpoint.
    3. Server verifies the device ID against the manufacturing ledger
       (100-unit pilot serial list, generated at PCBWay flash time —
       see LOT-COSMO-CUBE-HARDWARE-v1.md Section 07), creates a row in
       cosmo_cube_devices bound to the logged-in userId, and returns a
       long-lived device token + Wi-Fi credentials for the BLE
       provisioning write described in the firmware doc.
    4. A device ID not on the manufacturing ledger is refused pairing —
       mirrors the "no activation without a verified profile" principle
       from docs/corporate/LOT_ROBOTICS_COSMO.md, scoped to
       account-binding rather than Benchmark eligibility.

--------------------------------------------------------------------------------
03 // NOTIFICATION PUSH (SERVER -> DEVICE)
--------------------------------------------------------------------------------

  PROPOSED: persistent channel at wss://lot-systems.com/api/hardware/cosmo-cube/stream
             (device holds this connection open; matches the firmware's
             "persistent TLS connection" in
             LOT-COSMO-CUBE-FIRMWARE.md Section 04)

  WHO WRITES TO IT
    The same engine that already decides what to surface to an operator
    inside the app (the Memory Engine / notification logic referenced
    throughout README.md and docs/technical/MEMORY-ENGINE-*.md) gets one
    more output channel: instead of only rendering into the web app, a
    short-text version of the same nudge is pushed down this channel
    when the operator has a paired Cube. This is an additional sink on
    existing decision logic, not a new decision-making system.

  PAYLOAD (matches firmware Section 04)
    { "text": string (<=40 chars, truncated server-side),
      "priority": "high" | "low",
      "notificationId": string }

  RATE DISCIPLINE
    No more than one push per device per 15 minutes, enforced
    server-side, regardless of how many nudges the engine generates
    internally — the Cube's screen is meant to be rare and worth
    looking at, not a mirrored feed (same anti-feed principle as
    LOT-COSMO-CUBE-HARDWARE-v1.md Section 04).

--------------------------------------------------------------------------------
04 // COPY-BUTTON SIGNAL -> LOG TAB (DEVICE -> SERVER)
--------------------------------------------------------------------------------

  PROPOSED: POST /api/hardware/cosmo-cube/log

  Request (matches firmware Section 05 and hardware spec Section 05):
    { "deviceId": string,
      "event": "copy",
      "ts": ISO8601,
      "lastNotificationId": string | null }
    Authenticated via the device token issued at pairing (Section 02),
    signed with the device's on-chip keypair (firmware Section 02) —
    the server verifies the signature against the stored public key
    before writing anything.

  SERVER EFFECT
    Resolves deviceId -> userId via cosmo_cube_devices, writes one row
    to the existing Log table with event: "cosmo_cube_copy", visible on
    the operator's Log tab on lot-systems.com exactly like any other
    logged entry — no separate hardware-only log view. The physical
    button and the on-screen Log tab are one system, not two.

  RESPONSE
    204 on success (device only needs the checkmark trigger described
    in firmware Section 05, not a body).

--------------------------------------------------------------------------------
05 // TELEMETRY (DEVICE -> SERVER, LOW-FREQUENCY)
--------------------------------------------------------------------------------

  PROPOSED: POST /api/hardware/cosmo-cube/telemetry (device heartbeat,
             ~1/hour: battery %, Wi-Fi RSSI, BME680 last reading,
             firmware version)

  Feeds the v1.0 pilot gate directly — LOT-COSMO-CUBE-HARDWARE-v1.md
  Section 06's "100/100 units pass a 3-day burn-in" is measured off this
  channel, not off manual per-unit check-ins.

--------------------------------------------------------------------------------
06 // WHAT THIS DOCUMENT DELIBERATELY DOES NOT SPECIFY
--------------------------------------------------------------------------------

  - Exact Postgres migration / Prisma schema for cosmo_cube_devices —
    that is implementation work for when v1.0 firmware bring-up starts
    against a real server, not a planning-stage decision.
  - OTA image hosting/signing infrastructure — covered at the firmware
    level (LOT-COSMO-CUBE-FIRMWARE.md Section 06); the server-side
    signing key custody is an operational decision for that milestone.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-CUBE-API-CONNECTOR
================================================================================
