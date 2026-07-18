<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — SOFTWARE / LOT API CONNECTOR SPECIFICATION
================================================================================

DOCUMENT    LOT-COMPUTER-SOFTWARE-CONNECTOR
ISSUE DATE  2026.07.18
CLASS       RESTRICTED // S-2 EYES
STYLE       TERMINAL GRID
S-2         VADIK MARMELADOV, Inventor, COSMO® CIA
STATUS      READY — v1.0, kept SEPARATE from LOT-COMPUTER-FIRMWARE.md and
            LOT-COMPUTER-HARDWARE-SPEC.md by design (spec item 11), so the
            backend contract can version independently of MCU firmware and
            the hardware BOM.
COMPANION   docs/technical/LOT-COMPUTER-HARDWARE-SPEC.md (BOM/roadmap)
            docs/technical/LOT-COMPUTER-FIRMWARE.md (MCU-side firmware)
GROUND      This document specifies the device's use of REAL, already-live
TRUTH       LOT backend surface where one exists — POST /api/logs is a
            production endpoint today (src/client/queries.ts useCreateLog,
            called from ContextualPromptsWidget.tsx, CalendarWidget.tsx,
            RecipeWidget.tsx, PlannerWidget.tsx, SelfCareMoments.tsx) and
            /api/os/status, /api/os/version, /api/os/insights are documented
            in docs/technical/OS_API.md. Where the device needs a surface
            that does not exist yet (device pairing, a notification-push
            queue), this document specifies it as a new, additive API and
            marks it PROPOSED — it does not claim code that hasn't been
            written.

================================================================================

## 00  SCOPE

This document specifies how LOT Computer firmware talks to
lot-systems.com. It does not specify what runs on the MCU below the
network socket — that is LOT-COMPUTER-FIRMWARE.md.

================================================================================

## 01  CONNECTOR ARCHITECTURE

```
LOT Computer (ESP32-S3, firmware per LOT-COMPUTER-FIRMWARE.md)
     │
     │  TLS 1.2+, hardware AES/SHA on the ESP32-S3
     ▼
lot-systems.com  (Fastify + PostgreSQL, per docs/corporate/
                   CQGS-WHITE-PAPER-SNAPSHOT.md "LOT Platform Architecture")
     │
     ├── GET  /api/devices/:id/notifications   [PROPOSED]  — pending push
     ├── POST /api/devices/:id/heartbeat       [PROPOSED]  — status, battery,
     │                                                        sensor readings
     ├── POST /api/logs                        [LIVE TODAY]  — COPY button
     │                                                        signal, per 04
     ├── GET  /api/os/status                   [LIVE TODAY]  — user OS health,
     │                                                        can inform what
     │                                                        notification to
     │                                                        surface next
     │                                                        (docs/technical/
     │                                                        OS_API.md)
     └── POST /api/devices/pair                [PROPOSED]  — pairing handshake,
                                                              per 02
```

================================================================================

## 02  PAIRING / AUTH (PROPOSED)

```
STEP   ACTION
────   ──────
1      Firmware boots with no stored Wi-Fi credentials or device token ->
       enters PAIRING MODE (LOT-COMPUTER-FIRMWARE.md 02/03) -> advertises
       over BLE with a short device ID printed/etched on the enclosure
       (not the button legend — a separate serial, factory-lasered).
2      User opens lot-systems.com on phone/web, navigates to a "Pair
       Device" flow (PROPOSED UI, analogous to the existing QR-gated
       Usership flows referenced in docs/benchmark/LOT-MANIFEST.md 01
       "QR code gating: Usership + assembly phase >= forming").
3      Phone/web sends the device's Wi-Fi credentials + a short-lived
       pairing token to the device over BLE.
4      Device connects to Wi-Fi, calls POST /api/devices/pair with the
       pairing token -> backend validates token against the requesting
       user's session -> issues a long-lived device auth token (JWT-class,
       scoped to that one device + that one LOT profile) -> device stores
       it in flash (encrypted with the ESP32-S3's hardware key, not
       plaintext).
5      Device is now bound to exactly one LOT profile. Per docs/corporate/
       LOT_ROBOTICS_COSMO.md's ethical framework precedent ("A COSMO® unit
       without a verified LOT profile does not activate" / "Disconnection
       is instant and permanent"), the same rule applies here: a LOT
       Computer with no bound profile shows only the pairing glyph and
       does nothing else — no camera capture, no notification surface,
       no button signal beyond re-pairing.
```

All subsequent authenticated calls (heartbeat, notification pull, /api/
logs) carry this device auth token as a bearer credential, scoped
server-side to the one paired LOT profile.

================================================================================

## 03  NOTIFICATION DELIVERY (PROPOSED)

```
MODEL           Poll, not push-socket — matches the firmware power budget
                (LOT-COMPUTER-FIRMWARE.md 05: Wi-Fi radio off between
                cycles). A persistent WebSocket/MQTT session would keep
                the radio hot continuously, which the 40-80mAh cell
                cannot afford.

DEFAULT CADENCE 60 seconds, server-configurable per device via the same
                heartbeat call that reports battery/sensor state.

REQUEST         GET /api/devices/:id/notifications
                Authorization: Bearer <device token>

RESPONSE        {
                  "pending": [
                    { "id": "ntf_...", "text": "Coffee time!",
                      "dwell_seconds": 20, "issued_at": "2026-07-18T..." }
                  ],
                  "next_poll_seconds": 60,
                  "firmware_update_available": false
                }

SOURCE OF       Notifications are authored the same way existing LOT
NOTIFICATIONS   autonomous nudges are — see docs/technical/OS_API.md
                insights (temporal/weather-mood pattern detection) and
                the weekly-story / contextual-checkin job family referenced
                in docs/benchmark/LOT-LEDGER.md (Job 25 "archetype-
                directive-pulse", "STORY:"/"DRCT:" handlers). The LOT
                Computer is a NEW DELIVERY SURFACE for signals the AI
                engine already computes — not a new signal source. A
                "Coffee time!" nudge is the same class of contextual
                prompt already rendered in-app by ContextualPromptsWidget.tsx,
                routed instead (or additionally) to a paired physical
                device.
```

================================================================================

## 04  COPY BUTTON -> POST /api/logs (spec item 16 — LIVE endpoint)

This is the one call in this document that hits a real, already-shipping
endpoint. No new backend work is required for this path; the device is a
new CLIENT of an existing API.

```
TRIGGER   Short press on the COPY button (LOT-COMPUTER-FIRMWARE.md 04).

REQUEST   POST /api/logs
          Authorization: Bearer <device token>
          Content-Type: application/json

          {
            "event": "device_copy_signal",
            "source": "lot_computer",
            "device_id": "<paired device id>",
            "timestamp": "2026-07-18T14:32:00Z",
            "context": {
              "last_notification_id": "ntf_...",      // if one was showing
              "battery_pct": 82,
              "sensor": { "temp_c": 21.4, "humidity_pct": 44 }
            }
          }

BACKEND   Lands in the same Log tab (Logs.tsx, route 'logs') as every
EFFECT    other LOT log event, per the existing useCreateLog() pattern
          used by ContextualPromptsWidget.tsx, CalendarWidget.tsx,
          RecipeWidget.tsx, PlannerWidget.tsx, and SelfCareMoments.tsx
          (all confirmed live call sites of POST /api/logs in
          src/client/). "event": "device_copy_signal" is a NEW event
          type value on the existing /api/logs contract — additive, not
          a schema break. Existing log-event renderers (docs/benchmark/
          LOT-LEDGER.md references "Log event renderer count reaches 17
          distinct" and growing) get a new renderer case for this type;
          that renderer implementation is application-layer work tracked
          separately from this hardware documentation pass.

WHY       This is the literal meaning of spec item 16 — "Button as 'Copy'
"COPY"    with a signal back to the site's Log tab" — the physical button
          copies a moment (whatever notification/context was on screen)
          into the user's permanent LOT log, the same way a person might
          tap "log this" in the app, but from the object on their desk.
```

================================================================================

## 05  OFFLINE / RETRY BEHAVIOR

```
CONDITION                    BEHAVIOR
─────────                    ────────
Wi-Fi unreachable at boot    Enter OFFLINE display state (LOT-COMPUTER-
                              FIRMWARE.md 03). Retry Wi-Fi association on
                              an exponential backoff (5s, 10s, 20s, 40s,
                              capped at 5 min) — never a tight retry loop.
TLS/API unreachable mid-run  Same backoff. Notification polling pauses;
                              button presses still queue locally.
COPY press while offline     Event is written to a local flash-backed
                              queue (bounded, oldest-evicted after a cap —
                              e.g. 50 entries — since this is a signal
                              device, not a database). On reconnect, the
                              queue flushes to POST /api/logs in order,
                              oldest first, before resuming normal
                              notification polling.
Device token revoked/        Backend returns 401 -> device clears its
invalid (e.g. profile         local token, re-enters PAIRING MODE. Applies
disconnected server-side)     the same "instant and permanent" disconnect
                              principle as docs/corporate/
                              LOT_ROBOTICS_COSMO.md's COSMO® ethical
                              framework.
```

================================================================================

## 06  PRIVACY / DATA BOUNDARY

```
Camera frames are NOT uploaded raw by default. Per the product thesis
(LOT-COMPUTER-HARDWARE-SPEC.md 01, LOT-COMPUTER-FIRMWARE.md 03), the
camera's low-rate capture exists for on-device presence/context signal.
Any future decision to transmit camera data off-device is a distinct,
explicit consent surface — out of scope for this v1.0 connector, and
explicitly NOT implied by spec item 5 ("Camera") on its own. This mirrors
docs/corporate/LOT_ROBOTICS_COSMO.md's stated boundary: "This is not
surveillance."
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END OF SPECIFICATION                                                2026.07.18
================================================================================
