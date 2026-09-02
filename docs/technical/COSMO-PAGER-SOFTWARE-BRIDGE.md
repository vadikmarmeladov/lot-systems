<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® PAGER — Software Bridge Specification

**Document:** COSMO-PAGER-SOFTWARE-BRIDGE
**Parent plan:** docs/corporate/COSMO-PAGER-HARDWARE-COMPUTER.md (Sections 05, 06, 11)
**Companion:** docs/technical/COSMO-PAGER-FIRMWARE-SPEC.md
**Author:** Vadik Marmeladov, Inventor — COSMO® CIA
**Date:** 2026-09-02
**Version:** 0.1 — pre-hardware, targets v0.1 breadboard build

This document owns everything that runs on the LOT platform SIDE of the
device connection — the server routes, the notification authoring
pipeline, and how a Copy press becomes a Log tab entry. It extends,
rather than replaces, the existing M2M protocol
(docs/corporate/LOT-TERMINAL-M2M.md) and the existing `logs` table
already backing the Log tab (src/server/routes/api.ts).

---

## 1. Relationship to Existing Systems

```
EXISTING                                  NEW (this document)
────────                                  ───────────────────
LOT-TERMINAL-M2M.md                       Channel 2 — platform -> device
  POST /v1/m2m/intake (device -> platform)  pager push (does not exist
  Format 1/2/3 payloads                      anywhere prior to this doc)

`logs` table (api.ts)                     "device_copy" event value —
  event: note | log_entry | journal | ...   one new value on the SAME
                                             table, no schema migration
                                             beyond an enum addition

Memory Engine / QI-46 Calibration Loop    Pager Line Authoring — the
  (existing signal -> Index of Systems      compression step that turns
  pipeline)                                  an Index signal into ≤24
                                             characters for Channel 2
```

Nothing here stands up a parallel backend. It is three additions to
systems the platform already runs.

---

## 2. Channel 1 — Device -> Platform (reused, unmodified)

```
POST /v1/m2m/intake
Authorization: Bearer <operator_token>
Content-Type: application/json

{
  "device_id": "cosmo-pager-<serial>",
  "operator": "<user id>",
  "device_type": "environmental_monitoring",
  "fw_version": "0.1.0",
  "timestamp": "2026-09-02T14:32:00Z",
  "sensors": [
    { "type": "temperature", "value": 22.5, "unit": "celsius" },
    { "type": "humidity", "value": 45, "unit": "percent" },
    { "type": "pressure", "value": 1013.25, "unit": "hPa" },
    { "type": "air_quality", "value": 67, "scale": 100, "status": "Good" }
  ],
  "recommendation": "Conditions optimal. Open windows for fresh air.",
  "alert_level": "normal"
}
```

This is LOT-TERMINAL-M2M.md Format 3 verbatim, plus one additive field
(`fw_version`, firmware spec doc Section 7) that existing M2M consumers
ignore harmlessly. One payload per session (firmware spec doc Section
5) — the server does not need new de-duplication or rate-limiting
logic because the device already ships pre-compressed.

---

## 3. Channel 2 — Platform -> Device (new)

```
GET /v1/pager/subscribe?device_id=cosmo-pager-<serial>
Authorization: Bearer <device_token>       (device-scoped, not operator-
                                             scoped — see Section 5,
                                             security)

Server holds the connection (SSE or long-poll, 30s timeout, client
reconnects) and pushes when a line is queued:

{
  "device_id": "cosmo-pager-<serial>",
  "line": "Coffee time!",
  "gesture": "nudge",
  "issued_at": "2026-09-02T14:32:00Z"
}
```

**The 24-character cap is enforced at the point the line is queued,
server-side — not at send time and not by the device.** Concretely:
the queuing function REJECTS (not truncates) any candidate line over
24 characters and logs the rejection with the source signal that
produced it, so an over-length line is a bug surfaced in monitoring,
never silently shipped short or shipped long. This is the parent
plan's Section 06 discipline made concrete: hardware never sees the
platform's internal reasoning, only the compressed output, and the
compression is not allowed to be lossy-by-truncation.

---

## 4. Pager Line Authoring — the Compression Step

The Memory Engine / QI-46 Calibration Loop already decides WHEN an
operator should be told something (Index of Systems signal firing —
same trigger class LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04 uses for
CUBIQ's haptic gestures). This document adds the WHAT, specifically
for the 24-character pager channel:

```
Index of Systems signal  ──▶  Pager Line Authoring
  (e.g. "operator's 2pm         (new, small function —
  calendar block ends,           NOT a general LLM call
  historical pattern: gets       per line; a constrained
  coffee within 4 min")          template/lookup keyed by
                                  signal type, so latency
                                  and cost stay bounded and
                                  the 24-char cap is
                                  structurally guaranteed,
                                  not hoped for)
                                        │
                                        ▼
                              "Coffee time!"  (13 chars)
                                        │
                                        ▼
                              Channel 2 queue (Section 3)
```

Signal-type -> template mapping ships as a small, human-reviewed table
(not a runtime prompt), because a pager line is a promise about
length and tone that must hold every time, not most of the time. New
signal types get a new template entry reviewed before going live —
this is deliberately a slower, more editorial process than the
Memory Engine's own question generation, matching the higher cost of
getting a physical object's one line of text wrong.

---

## 5. Channel 3 — Copy Button -> Log Tab

```
POST /v1/m2m/log
Authorization: Bearer <device_token>
Content-Type: application/json

{
  "device_id": "cosmo-pager-<serial>",
  "event": "device_copy",
  "text": "Coffee time!",          // the line on screen at press time,
                                     empty string if screen was blank
  "timestamp": "2026-09-02T14:35:12Z"
}
```

Server-side handling:
1. Resolve `device_id` -> `operator` via the existing device-pairing
   record (Section 6).
2. Insert into the existing `logs` table: `event: "device_copy"`,
   `text`, `source: "cosmo-pager"`, `timestamp`. No new table.
3. The Log tab's existing render path already displays rows by
   `event` type (api.ts already branches on `note` / `log_entry` /
   `journal`) — `device_copy` needs one new case in that same switch,
   rendered as e.g. "Copied from COSMO® PAGER: Coffee time!" with a
   small device glyph. This is a UI addition, not a new surface.

---

## 6. Security and Pairing

- Two token scopes: `operator_token` (existing, used on Channel 1 for
  continuity with M2M) and a new `device_token` (used on Channels 2
  and 3) — minted once at pairing (firmware spec doc Section 4, camera
  Job 2 / QR pairing) and scoped ONLY to that one device_id. A stolen
  device_token can page and log-spam one operator's account, never
  read anything, never act as the operator_token can elsewhere.
- Pairing flow: operator opens a pairing screen on lot-systems.com,
  which renders a QR encoding a short-lived pairing code; device
  captures it (camera Job 2), POSTs the code to `/v1/m2m/pair`, server
  exchanges it for the device_token, device stores it in NVS (ESP-IDF
  encrypted flash partition).
- All three channels run over TLS 1.3+, matching the existing M2M
  security standard (LOT-TERMINAL-M2M.md, "Data Standards").
- De-pairing (operator removes the device from their account) revokes
  the device_token server-side immediately — Channel 2's long-poll
  returns 401 on next reconnect, and firmware clears its stored token
  and re-enters pairing mode.

---

## 7. PDF Manual Generation Hook

Parent plan Section 10 ties each PDF manual to a firmware tag. This
document owns the trigger: on a tagged firmware release
(`cosmo-pager-fw-vX.Y.Z`), a build step regenerates the three manual
PDFs from their markdown source using the same tooling already
producing docs/badges/pdf/*.pdf from markdown in this repo, and files
the output at docs/technical/pdf/cosmo-pager/. No new PDF toolchain is
introduced.

---

## 8. Open Items for v0.5

- Confirm SSE (vs. long-poll) survives ESP32-S3 light-sleep between
  polls without the connection dying and forcing a full TLS
  renegotiation every wake — affects the power budget in the firmware
  spec doc (Section 2).
- Decide whether `device_copy` log entries should also produce a
  Memory Engine signal back into the Calibration Loop (closing a loop
  analogous to CUBIQ's IMU telemetry feedback, LOT-CUBIQ-QUANTUM-CUBE-v0.md
  Section 05) — deferred, not required for v0.1/v0.5 gates.

---

**Authorized by:** S-2 // Vadik Marmeladov, Inventor — COSMO® CIA
**End COSMO-PAGER-SOFTWARE-BRIDGE**
