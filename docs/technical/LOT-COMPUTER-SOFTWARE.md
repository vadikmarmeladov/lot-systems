<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-SOFTWARE
TITLE:    LOT® Computer — Companion Software & LOT API Connector
          (brief points 6, 10, 11)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-03
STATUS:   ARCHITECTURE ONLY — NO CODE WRITTEN
================================================================================

Companion to docs/corporate/LOT_COMPUTER_HARDWARE_PLAN_v1.md and
docs/technical/LOT-COMPUTER-FIRMWARE.md. This document is the software half:
the pairing app and the wire protocol connecting firmware to lot-systems.com.
Kept separate from the firmware document per the brief's own instruction
(point 11).

--------------------------------------------------------------------------------
01 // COMPANION APP (PAIRING)
--------------------------------------------------------------------------------

  PLATFORM     Thin pairing utility, not a full app surface — LOT® Computer's
               day-to-day experience lives on the device screen itself
               (Ambient AI™ principle: hardware is invisible data, LOT-AMBIENT
               -AI-VISION.md). The companion is used exactly twice in a
               unit's normal life: first-boot pairing, and Wi-Fi network
               changes.
  DELIVERY     A single page served from lot-systems.com/computer/setup
               (web-based, BLE via Web Bluetooth where supported, with a
               native-wrapper fallback for iOS Web Bluetooth gaps) — this
               reuses the existing brand.lot-systems.com web delivery
               surface rather than shipping a new native app to install,
               review, and maintain.
  FLOW         1. User signs in with their existing LOT® Usership session
                  (magic-link auth, per LOT_QI46_ENGINE.md Layer 2 auth
                  pattern).
               2. Page requests BLE pairing with the unit (advertises as
                  "LOT-COMPUTER-XXXX", last 4 of device serial).
               3. Page sends WiFi SSID/password + a one-time device-claim
                  token (minted server-side, single use, 10-minute expiry)
                  over the BLE GATT provisioning service
                  (LOT-COMPUTER-FIRMWARE.md §5).
               4. Device claims itself against the user's account via the
                  claim token over its new WiFi connection (03 below).
               5. Page confirms "LOT® Computer paired" and hands off — no
                  ongoing companion app requirement afterward.

--------------------------------------------------------------------------------
02 // NOTIFICATION CHANNEL (brief point 2)
--------------------------------------------------------------------------------

  ENDPOINT           GET https://qi.lot-systems.com/v1/device-events
                     (mirrors the existing inference endpoint shape in
                     LOT_QI46_ENGINE.md Layer 2, reversed direction —
                     server-to-device instead of device-to-server)
  TRANSPORT          HTTPS long-poll, 30s max hold, device reconnects
                     immediately on close (matches the QI·46 `Stream: true`
                     pattern's intent — near-real-time without a persistent
                     socket the ESP32-S3's radio budget can't sustain
                     indefinitely, per LOT-COMPUTER-FIRMWARE.md §06 power
                     budget)
  AUTH               Device-scoped bearer token, minted at claim time (01
                     step 4), rotated every 30 days via the same channel
  PAYLOAD (server → device)

    {
      "render": "Coffee time!",
      "ttl_s": 8,
      "glyph": null,
      "source_event": "routine_trigger:coffee",
      "issued_at": "2026-08-03T14:32:00Z"
    }

  SOURCE OF `render` TEXT   The Index of Systems / QI·46 Calibration Loop
                     (existing system, not new) — LOT® Computer is a second
                     physical output subscriber on that bus, alongside
                     CUBIQ™ (LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 05), one
                     rendering the event as text instead of motion.

--------------------------------------------------------------------------------
03 // SENSOR TELEMETRY CHANNEL (brief points 6, 14, 15)
--------------------------------------------------------------------------------

  This reuses the existing M2M data intake schema verbatim
  (docs/corporate/LOT-TERMINAL-M2M.md, "Format 3: Multi-Sensor Array") rather
  than inventing a new one — LOT® Computer is exactly the class of hardware
  that document was written for.

  ENDPOINT     POST https://api.lot-systems.com/v1/m2m/ingest
  AUTH         Same device-scoped bearer token as §02
  CADENCE      Every 15 minutes (LOT-COMPUTER-FIRMWARE.md §02, sensor_task)

  PAYLOAD (device → server):

    {
      "device_id": "lot-computer-<serial>",
      "operator": "<usership-account-id>",
      "device_type": "environmental_monitoring",
      "timestamp": "2026-08-03T14:30:00Z",
      "sensors": [
        { "type": "temperature", "value": 22.1, "unit": "celsius" },
        { "type": "humidity", "value": 41, "unit": "percent" },
        { "type": "pressure", "value": 1015.2, "unit": "hPa" },
        { "type": "gas_index", "value": 63, "scale": 500 },
        { "type": "voc_index", "value": 88, "scale": 500 },
        { "type": "presence", "value": true }
      ],
      "recommendation": null,
      "alert_level": "normal"
    }

  SERVER-SIDE HANDLING   Feeds the same Ambient AI™ widgets LOT® Station
                     already drives (LOT-AMBIENT-AI-VISION.md — Weather
                     widget, Air Quality widget), so a subscriber with a
                     LOT® Computer does not need a separate LOT® Station
                     unit for the same signal class (hardware plan 04.7).

--------------------------------------------------------------------------------
04 // THE "COPY" BUTTON → LOG TAB (brief point 16) — CORE ROUND TRIP
--------------------------------------------------------------------------------

This is the most concrete integration point in the whole spec, so it is
grounded in the actual client component rather than a hypothetical one:
the target UI surface is `src/client/components/JournalReflection.tsx`
(the "Log tab," confirmed present in this repository).

  ENDPOINT     POST https://api.lot-systems.com/v1/m2m/log-copy
  AUTH         Same device-scoped bearer token as §02/§03
  TRIGGER      button_task (LOT-COMPUTER-FIRMWARE.md §02) fires this
               exactly once per Copy press, and only while a notification
               is on-screen (hardware plan 04.9 — no general-purpose
               logging trigger)

  PAYLOAD (device → server):

    {
      "device_id": "lot-computer-<serial>",
      "operator": "<usership-account-id>",
      "event": "hardware_copy",
      "acknowledged_render": "Coffee time!",
      "acknowledged_source_event": "routine_trigger:coffee",
      "pressed_at": "2026-08-03T14:32:41Z"
    }

  SERVER-SIDE HANDLING   A new lightweight route (proposed:
               `src/server/routes/api.ts`, sibling to the existing note/
               journal creation handlers) writes one entry into the
               pressing user's journal store — the same data model
               `JournalReflection.tsx` already renders — with a fixed,
               auto-generated body ("Copied: Coffee time! · 2:32 PM · LOT®
               Computer") rather than free text. This is intentionally
               NOT a new endpoint that lets arbitrary hardware write
               arbitrary journal text: the body is server-templated from
               `acknowledged_render`, never passed through verbatim from
               the device without server-side construction, closing the
               obvious injection-into-journal risk before it exists.
  RESULT       The next time the user opens their Log tab
               (JournalReflection.tsx), the entry is already there — the
               physical Copy press became a journal entry with zero typing,
               which is the whole point of point 16.

--------------------------------------------------------------------------------
05 // WHAT THIS DOCUMENT DOES NOT COVER
--------------------------------------------------------------------------------

  - No server route named in §04 exists yet in src/server/routes/ — this is
    the architecture a future implementation session would build against,
    matching this document set's stated scope (hardware plan Section 01:
    "not a software/firmware implementation").
  - Device-claim token issuance, rotation, and revocation flows are named
    but not fully specified (session/token lifetime, revocation-on-unpair)
    — flagged as an open item for the implementation phase, not silently
    assumed solved.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COMPUTER-SOFTWARE
================================================================================
