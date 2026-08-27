<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-SOFTWARE
TITLE:    COSMO® Computer — Server + Companion Software Specification
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-27
VERSION:  0.1 — DRAFT (companion to docs/corporate/LOT-COSMO-COMPUTER-v1.md)
================================================================================

This is the software half of the two-document split S-2's brief requires
(item 11: firmware and connecting software kept separate). Read
`docs/corporate/LOT-COSMO-COMPUTER-v1.md` first for the device and wire
protocol, and `docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md` for exactly
what the device sends and expects. This document covers three things: the
lot-systems.com endpoint that composes and pushes pager text, the
provisioning flow that pairs one physical unit to one operator, and the
server-side handling of what the firmware sends back.

--------------------------------------------------------------------------------
01 // WHERE THIS SITS IN THE EXISTING STACK
--------------------------------------------------------------------------------

No new backend framework — this rides the same Fastify + PostgreSQL stack
already running lot-systems.com (`src/server/`). Three additions:

  1. An outbound push path: something in the existing signal-routing
     substrate (QIE — Quantum Intention Engine, see LOT-LEXICON.md)
     decides a short line of text is worth sending to a paired device,
     and a delivery service turns that decision into the firmware's
     inbound `{ "display_text": ... }` payload (product spec Section 06).
  2. An inbound intake path: the existing M2M intake route
     (`POST /v1/m2m/intake`, docs/corporate/LOT-TERMINAL-M2M.md) gains
     handling for the `events` array batching shape the firmware sends
     (LOT-COSMO-COMPUTER-FIRMWARE.md Section 05) — an extension of the
     existing route's payload shape, not a new route.
  3. A provisioning flow (Section 03 below) that does not exist yet
     anywhere in the M2M protocol, since the S-2 Operator model in
     LOT-TERMINAL-M2M.md pairs a *maker's* hardware to their own
     account; COSMO® Computer pairing is closer to "activate a
     purchased consumer device," which needs its own short flow.

--------------------------------------------------------------------------------
02 // NOTIFICATION COMPOSITION + PUSH
--------------------------------------------------------------------------------

  SOURCE OF TEXT       Composed by the same AI layer already generating
                     Memory Engine questions and Log narration elsewhere
                     in the product — not a new model, a new delivery
                     surface for existing composition capability. Input:
                     one QIE signal (badge unlock, memory question
                     ready, cohort ping, a scheduled-job output like the
                     brief's own "Coffee time!" example). Output: one
                     short line, length-bounded to what the device's
                     ~30-32mm single-line screen (product spec Section
                     04) can render without truncation-mid-word.
  DELIVERY DECISION     Not every QIE signal becomes a push — the same
                     "AI decides WHAT/WHEN/HOW to send" logic named in
                     docs/corporate/LOT-CUBIQ-OPERATOR.md Section 04
                     governs this device too. A rate limit (exact
                     cadence: operator-configurable, default TBD at
                     prototype stage) prevents the device from becoming
                     a second feed — the whole point of a pager-class
                     object is that it says less, not more, than a phone.
  PUSH TRANSPORT         Server holds no persistent connection to the
                     device (firmware Section 03 — device is asleep by
                     default). Delivery is queued server-side and
                     delivered on the device's next scheduled wake or via
                     a low-power wake mechanism appropriate to the final
                     radio choice (BLE: connection-oriented wake; WiFi:
                     a lightweight push service) — the exact wake-trigger
                     mechanism is a v0.2 breadboard-stage decision
                     (product spec Section 10), not fixed here.

--------------------------------------------------------------------------------
03 // PROVISIONING — PAIRING ONE UNIT TO ONE OPERATOR
--------------------------------------------------------------------------------

    1. Operator receives a physical unit (out of the 100-unit pilot run,
       product spec Section 10) with a unique device_id printed or
       encoded (e.g. QR on the packaging, not on the polished shell
       itself — product spec Section 02 keeps Face A feature-free).
    2. Operator scans/enters device_id on lot-systems.com, authenticated
       into their existing LOT profile.
    3. Server checks Benchmark/Usership eligibility per the same gating
       posture named in docs/corporate/LOT_ROBOTICS_COSMO.md ("A COSMO®
       unit without a verified LOT profile does not activate") — the
       eligibility bar for a pager-class device is a policy decision
       left open here, not assumed to be the same Purple-tier bar set
       for full COSMO® robotics hardware in that document.
    4. Server mints a scoped operator_token for that device_id and holds
       it pending device-side confirmation.
    5. Device, powered on for the first time (or after a factory reset),
       enters a pairing-wait state and receives the token on first
       successful radio handshake, storing it per firmware Section 07.
    6. Server marks the device_id ACTIVE, tied to the operator's account.
       Re-provisioning (device changes hands, or is reset) explicitly
       revokes the prior token before issuing a new one — never two live
       tokens for one device_id.

--------------------------------------------------------------------------------
04 // HANDLING THE FIRMWARE'S BATCHED EVENTS
--------------------------------------------------------------------------------

Server-side handling of the `events` array the firmware sends
(LOT-COSMO-COMPUTER-FIRMWARE.md Section 05):

  copy_event      Written to the operator's Log tab
                  (`src/client/components/Logs.tsx` surfaces this to the
                  operator) using the COCKPIT-RULE format the product
                  spec's Section 05 already defines: label names the
                  event ("COSMO-COMPUTER: COPY"), body carries the raw
                  fields (device_id, operator, displayed_text,
                  timestamp, image_ref), no server-generated narration
                  is injected into the Log body itself — any narrative
                  framing happens at display time in the Logs UI, same
                  as every other Log entry class in the product today.
  env_reading     Folded into the device's status record, and made
                  available to the same M2M "Multi-Sensor Array" surface
                  (LOT-TERMINAL-M2M.md Format 3) other hardware in the
                  ecosystem already uses — no bespoke weather-data table.
  image_ref       Resolved against whatever object-storage path the
                  device's follow-up upload used (firmware Section 05
                  leaves the exact transport to this document — the
                  concrete choice, e.g. presigned upload URL returned in
                  the same intake response, is a prototype-stage
                  decision, not fixed here). Attached to the copy_event's
                  Log entry as image_ref once resolved.

--------------------------------------------------------------------------------
05 // PDF MANUAL GENERATION
--------------------------------------------------------------------------------

Per product spec Section 12 and S-2's brief item 7 ("result in PDF
manuals"): the operator-facing manual is generated from this documentation
set (product spec + this document + the firmware document), not
hand-maintained separately, the same "generate the PDF from the markdown
source of truth" pattern already used for
`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v*.md` ->
`.pdf` in this repo (see `scripts/generate_badge_pdf_v31.py` and siblings
for the existing tooling pattern this reuses). A COSMO® Computer manual
PDF is produced this session (Section 06) as the first instance of that
pipeline applied to this product line.

--------------------------------------------------------------------------------
06 // WHAT IS EXPLICITLY NOT DESIGNED HERE
--------------------------------------------------------------------------------

  - The exact low-power wake-trigger mechanism (Section 02) — depends on
    a radio choice not yet locked (product spec Section 11 open items).
  - Rate-limit defaults for push cadence (Section 02) — an operator-
    facing settings decision, not a hardcoded constant.
  - Object storage choice for image_ref resolution (Section 04) — an
    infrastructure decision that should reuse whatever the product
    already uses for other user-uploaded media, not invent a new store.
  - Benchmark/Usership eligibility tier required to provision a unit
    (Section 03, step 3) — a business decision for S-2, not a technical
    one, and explicitly left unset rather than guessed.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-SOFTWARE
================================================================================
