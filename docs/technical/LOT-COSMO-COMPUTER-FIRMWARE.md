<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COSMO-COMPUTER-FIRMWARE
TITLE:    COSMO® Computer — Firmware Specification
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-27
VERSION:  0.1 — DRAFT (companion to docs/corporate/LOT-COSMO-COMPUTER-v1.md)
================================================================================

This is the firmware half of the two-document split S-2's brief requires
(item 11: firmware documents and connecting software kept separate). Read
`docs/corporate/LOT-COSMO-COMPUTER-v1.md` first — it defines the physical
device, the session model, and the wire protocol this firmware implements.
The companion `LOT-COSMO-COMPUTER-SOFTWARE.md` covers the server and
provisioning side.

--------------------------------------------------------------------------------
01 // TARGET PLATFORM
--------------------------------------------------------------------------------

  MCU CLASS          Low-power ARM Cortex-M-class SoC with an integrated
                     low-power radio (BLE or WiFi — Section 05 of the
                     product spec leaves the final radio choice open;
                     firmware targets both classes behind one radio
                     abstraction so the choice can be made at the v0.2
                     breadboard stage without a firmware rewrite).
  RUNTIME             Bare-metal or a minimal RTOS (FreeRTOS-class),
                     decided at prototype stage by whichever the chosen
                     display + camera driver stack most naturally
                     supports. No general OS, no filesystem beyond a
                     small config/credential store — this device runs
                     one application, not a platform.
  MEMORY FOOTPRINT     Sized to the MCU's on-chip flash/RAM; no external
                     storage is planned at v1 (nothing on-device needs
                     to persist beyond the current display buffer, the
                     operator token, and a small queued-event buffer for
                     offline COPY presses — Section 04).

--------------------------------------------------------------------------------
02 // DRIVER STACK
--------------------------------------------------------------------------------

  DISPLAY            Single-line text render to the e-paper or
                     transflective LCD (product spec Section 04). Driver
                     responsibility: accept a UTF-8 string over the
                     session payload, render it centered on the ~30-32mm
                     active area, hold the frame with zero (e-paper) or
                     minimal (LCD sleep mode) standby current until the
                     next push.
  CAMERA              Single-shot capture on trigger (long COPY press),
                     JPEG or equivalent compressed encode on-device
                     before upload — the device never buffers or
                     transmits raw sensor frames, to keep the queued-
                     event payload (Section 04) small on a
                     battery-constrained radio budget.
  WEATHER SENSOR      Polled once per session wake (product spec Section
                     07), not continuously — a continuously-polled
                     sensor on an MCU with no external storage would
                     either be discarded between sessions or force a
                     persistent connection this device deliberately
                     avoids (Section 06 of the product spec, "session
                     compression").
  WIRELESS CHARGE MGMT Qi-BPP receiver IC handles the analog charge
                     path; firmware's role is limited to reading charge
                     state (charging / charged / not-present) for
                     status reporting and to gating radio wake behavior
                     — the device does not attempt to transmit while
                     actively drawing peak charge current, to keep the
                     instantaneous power budget inside the coil's rated
                     output.
  BUTTON (COPY)       Debounced GPIO interrupt, two press classes
                     (short / long-hold) per product spec Section 05.
                     Short press queues a copy_event; long press
                     additionally triggers the camera driver before
                     queuing.

--------------------------------------------------------------------------------
03 // SESSION STATE MACHINE
--------------------------------------------------------------------------------

Implements product spec Section 08 directly:

    SLEEP (radio off, display holding last frame)
       │
       │  wake source: server push OR button press OR scheduled
       │  weather-sensor interval
       ▼
    WAKE
       │
       ├── if push received  → DISPLAY_UPDATE → back to SLEEP
       │
       └── if outbound event queued (button press, weather reading)
              ▼
           RADIO_CONNECT (bounded — see Section 04 timeout)
              ▼
           FLUSH_QUEUE (send all queued events as one batched payload,
                        per product spec Section 06 "session compression")
              ▼
           RADIO_DISCONNECT
              ▼
           SLEEP

No state holds the radio connected without an active reason. This is the
firmware-level enforcement of the product spec's core constraint: every
session is bounded, nothing streams continuously.

--------------------------------------------------------------------------------
04 // OFFLINE QUEUE + CONNECTION BUDGET
--------------------------------------------------------------------------------

  QUEUE               A small fixed-depth ring buffer of pending
                     outbound events (copy_event, capture_ref,
                     env_reading). Sized to hold a full day's worth of
                     plausible button presses (single digits — this is a
                     pager, not a logger) plus one queued image
                     reference. Overflow policy: drop oldest non-image
                     event first — an image reference is treated as
                     higher-value than a redundant status ping.
  CONNECTION TIMEOUT   RADIO_CONNECT (Section 03) is bounded by a hard
                     timeout (exact value: prototype-stage tuning,
                     target order-of-magnitude: single-digit seconds for
                     a successful handshake). A timeout with events still
                     queued returns to SLEEP and retries on the next wake
                     rather than looping the radio in a wait state — a
                     device this battery-constrained cannot afford to
                     spin on a bad connection.

--------------------------------------------------------------------------------
05 // WIRE PROTOCOL — LOT API CONNECTOR
--------------------------------------------------------------------------------

Implements product spec Section 06, reusing the existing M2M intake
envelope (`docs/corporate/LOT-TERMINAL-M2M.md`) rather than a bespoke
schema:

```
Outbound (device -> lot-systems.com), one call per session flush:

POST /v1/m2m/intake
Authorization: Bearer <operator_token>
Content-Type: application/json

{
  "device_id": "cosmo-computer-<serial>",
  "operator": "<operator_id>",
  "events": [
    { "metric": "copy_event", "displayed_text": "...",
      "timestamp": "...", "image_ref": "..." },
    { "metric": "env_reading", "temperature_c": ..., "humidity_pct": ...,
      "pressure_hpa": ..., "timestamp": "..." }
  ]
}
```

```
Inbound (lot-systems.com -> device), server-initiated push:

{ "display_text": "Coffee time!", "timestamp": "..." }
```

  BATCHING NOTE       The base M2M protocol (LOT-TERMINAL-M2M.md) shows
                     one-metric-per-call examples (Format 1/2/3). This
                     firmware wraps outbound calls in an `events` array
                     specifically to implement the session-compression
                     requirement (product spec Section 06) — multiple
                     queued events flush as one call, not one call per
                     event. This is a firmware-side batching convention
                     on top of the existing envelope, not a protocol
                     version change; the server-side handling of this
                     shape is specified in the companion software
                     document.
  TRANSPORT            TLS 1.3+, matching LOT-TERMINAL-M2M.md's Data
                     Standards clause.
  IMAGE PAYLOAD        `image_ref` in the outbound events array is
                     resolved to actual image bytes via a follow-up
                     multipart or presigned-upload step — the exact
                     transport is a companion-software decision (see
                     `LOT-COSMO-COMPUTER-SOFTWARE.md`), kept out of this
                     firmware document because it depends on server-side
                     storage choices firmware should not need to know
                     about.

--------------------------------------------------------------------------------
06 // OTA UPDATE PATH
--------------------------------------------------------------------------------

Not scoped for v0.1-v0.3 prototypes. Required before the 100-unit pilot
run (product spec Section 10, PILOT gate: "firmware frozen... marked
RELEASE, not DRAFT") since a fielded batch of 100 units with no update
path means any post-ship bug is permanent per-unit. Candidate approach:
signed-firmware-image pull over the same session-bounded connection model
(Section 03), triggered by an explicit server flag rather than polled —
consistent with the device's "wake only when there's a reason" design.
Left as an open item for the v0.3 -> v1.0 transition, not designed here.

--------------------------------------------------------------------------------
07 // SECURITY POSTURE
--------------------------------------------------------------------------------

  - Operator token stored in on-chip secure storage (if the chosen MCU
    provides it) or, at minimum, not stored in plaintext in application
    flash. Exact mechanism depends on the final MCU selection (Section 01).
  - No device ever holds more than one operator token at a time —
    re-pairing (companion software) explicitly overwrites, never appends.
  - Camera trigger is always operator-initiated (long COPY press); there
    is no remote or scheduled capture path in this firmware. This is a
    firmware-level guarantee, not just a policy statement — the capture
    driver (Section 02) has no code path that fires without the button
    interrupt.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COSMO-COMPUTER-FIRMWARE
================================================================================
