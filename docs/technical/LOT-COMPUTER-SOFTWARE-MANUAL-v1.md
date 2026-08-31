<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube v1.0 — Software Manual (LOT API Connector)

**Document:** LOT-COMPUTER-SOFTWARE-MANUAL-v1
**Classification:** Restricted — S-2 Eyes
**Companion documents:** LOT-COMPUTER-HARDWARE-SPEC-v1.md (mechanical/
electrical), LOT-COMPUTER-FIRMWARE-MANUAL-v1.md (on-device — kept
deliberately separate; do not merge).

This manual covers everything **off** the Cube: the pairing app, the
lot-systems.com-side connector service, and how a Cube's data becomes
part of a user's LOT profile. It does not describe firmware internals —
see the firmware manual for that.

---

## 01. Components

```
COMPONENT                  WHERE IT RUNS              PURPOSE
─────────                  ─────────────              ───────
Pairing flow               Phone/web, lot-systems.com  QR-scan pairing,
                            /hardware                   device_token issuance
Hardware Connector          lot-systems.com backend     WebSocket + HTTPS
Service                     (new service, Fastify —     endpoints the Cube's
                            matches existing stack,      firmware calls
                            see LOT-NODE-0-RIG-SPEC.md)
Notification Composer       Existing Memory Engine /     Decides WHAT/WHEN to
                            QOS / Job scheduler          send (reuses AI-driven
                                                          delivery model, LOT-
                                                          CUBIQ-OPERATOR.md §04)
Log Write Path              Existing Log/Note storage    Receives COPY-button
                                                          events as new Log
                                                          entries
```

---

## 02. Pairing Flow (first use)

1. User places the Cube on the charging plate for the first time.
2. Cube boots into `UNPAIRED` state, camera activates for exactly one
   QR-scan window (no continuous camera operation otherwise — see
   hardware spec Section 03).
3. User opens `lot-systems.com/hardware`, is shown a QR code encoding a
   short-lived pairing nonce.
4. Cube scans the code, POSTs the nonce alongside its hardware serial to
   `POST /api/hardware/pair` [NEW]:
   ```json
   { "serial": "COSMO-CUBE-000042", "pairing_nonce": "9f3a..." }
   ```
5. Server validates the nonce belongs to the requesting user's session,
   issues a scoped `device_token` (JWT, no expiry — revocable, per
   Section 05), and binds `device_id` to that user's profile.
6. Cube stores `device_token` in NVS (encrypted flash partition) and
   transitions to `PAIRED`.

This mirrors the existing S-2 operator registration flow already
specified in docs/corporate/LOT-TERMINAL-SYNC.md ("Terminal Side" /
"lot-systems.com Side" registration), reused here for a consumer device
instead of a Terminal operator account.

---

## 03. Hardware Connector Service — Endpoints

```
ENDPOINT                              DIRECTION   STATUS
────────                              ─────────   ──────
POST /api/hardware/pair               Cube → LOT  NEW (Section 02)
WSS  /hardware/notify                 LOT → Cube  NEW — pushes
                                                    pager_notification
                                                    payloads (schema in
                                                    LOT-COMPUTER-HARDWARE-
                                                    SPEC-v1.md §05)
GET  /api/hardware/notify/poll        LOT → Cube  NEW — HTTPS fallback for
                                                    the firmware's 30s
                                                    DEEP_SLEEP poll
POST /api/log/hardware-append         Cube → LOT  NEW — COPY button event,
                                                    schema in hardware spec
                                                    §05
POST /api/hardware/session            Cube → LOT  NEW — one compressed
                                                    session record (firmware
                                                    manual §04) per cycle
POST /api/hardware/ota/check          Cube → LOT  NEW — firmware version
                                                    check + signed image URL
```

All five new endpoints reuse the existing JWT auth middleware already
used by `/api/os/*` (docs/technical/OS_API.md) and `/api/public/profile/*`
(README.md, Public Profile System) — no new authentication stack, just a
new token scope (`hardware:device`) that cannot access any other
account endpoint.

---

## 04. Notification Composer — What Decides "Coffee Time!"

The Cube does not generate its own notification text. Composition
reuses the existing Memory Engine / QOS / scheduled-Job infrastructure
(README.md, "The Memory Engine," "Quantum Operating System (QOS)") the
same way docs/corporate/LOT-CUBIQ-OPERATOR.md Section 04 already
describes AI-driven physical product delivery deciding WHAT/WHEN/HOW:

```
Job scheduler / QOS mode change / Memory Engine question-ready signal
        │
        ▼
Notification Composer (existing AI engine abstraction, README.md
"AI Vendor Independence" — same 5-provider pool, same auto-fallback)
        │
        ▼
Queued against device_id → Hardware Connector Service → WSS push
        │
        ▼
Cube displays text, e.g. "Coffee time!"
```

v1.0 constraint: composed text is capped at 24 characters (fits the
1.28" round display at a legible font size — see hardware spec Section
03). The Composer must truncate or rephrase, never send text the display
cannot render whole.

---

## 05. Session Data → Memory Story

Per LOT-COMPUTER-HARDWARE-SPEC-v1.md Section 06 (server-side half), a
`POST /api/hardware/session` record is NOT stored as raw device
telemetry in an isolated table. It is folded into the same Memory Story
pipeline that journal entries and mood check-ins already populate
(README.md, "The Memory Engine: Your Personal Self-care Vault") —
weather and presence readings become part of "what patterns emerge in
your self-care," not a disconnected sensor log. A user who deletes their
LOT profile (README.md, "Your Story, Your Data") also deletes every
session record their Cube has ever sent.

---

## 06. Device Token Lifecycle and Revocation

```
ISSUED    at pairing (Section 02)
ACTIVE    while bound to exactly one user profile
REVOKED   user taps "Unpair" on lot-systems.com/hardware, OR
          user deletes their LOT profile, OR
          5 consecutive failed-signature requests (possible clone/replay)
```

A revoked token is rejected at the Hardware Connector Service
immediately — no grace period — matching the "Deploy without consent" /
"Disconnection is instant and permanent" ethical rule already set for
COSMO® hardware in docs/corporate/LOT_ROBOTICS_COSMO.md, applied here to
the Cube even though the Cube itself carries no behavioral "soul," only
an account binding.

---

## 07. M2M / Marketplace Path (optional, opt-in, v1.1+)

A Cube's weather-sensor stream is a valid intelligence asset under the
existing M2M protocol (docs/corporate/LOT-TERMINAL-M2M.md, Format 3 —
"Multi-Sensor Array"). v1.0 does not enable this by default — a Cube's
session data stays private to its paired user unless that user
explicitly opts in via the same `lot m2m register` / `lot sync enable`
flow already specified for LOT Terminal hardware. Not built for v1.0;
recorded here so the Hardware Connector Service's data model does not
foreclose it.

---

**Classification:** Restricted — S-2 Eyes
**Status:** Pre-hardware — none of the five NEW endpoints in Section 03
exist in this codebase yet. This manual is the specification they must
be built to, once LOT-COMPUTER-HARDWARE-SPEC-v1.md's pilot run is funded.
