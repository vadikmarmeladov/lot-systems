================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-PAGER-FIRMWARE
TITLE:    LOT® Pager — On-Device Firmware Architecture
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV — INVENTOR, COSMO® CIA
DATE:     2026-08-20
VERSION:  0.1 — ARCHITECTURE (PRE-IMPLEMENTATION)
STATUS:   PLANNING — companion document to LOT-PAGER-HARDWARE-v1.md
          (brief items 9, 11: "Firmware documents" / "Separate documents")
================================================================================

This document is deliberately narrow: it covers only what runs on the
ESP32-S3 inside the LOT® Pager shell. Physical form, BOM, and PCBWay path
live in LOT-PAGER-HARDWARE-v1.md. Server-side pairing, push composition,
and the Log-tab write path live in LOT-PAGER-SOFTWARE.md. Do not merge
these three documents — the separation is the point (hardware brief item
11).

--------------------------------------------------------------------------------
01 // TOOLCHAIN
--------------------------------------------------------------------------------

  FRAMEWORK        ESP-IDF (not Arduino-core) — direct access to deep-sleep
                    wake-source configuration and the esp32-camera driver's
                    full API, both of which the Arduino wrapper constrains.
  LANGUAGE          C, with the standard ESP-IDF FreeRTOS task model.
  OTA                ESP-IDF's native OTA partition scheme (two app
                    partitions, rollback-on-boot-failure) — a bricked
                    Pager in the field is a shipped unit that cannot be
                    physically re-flashed by the operator, so OTA safety is
                    a hard requirement, not a nice-to-have.

--------------------------------------------------------------------------------
02 // BOOT AND POWER STATE MACHINE
--------------------------------------------------------------------------------

  STATES
    DEEP_SLEEP      Default state. ~7uA. ESP32-S3 timer + GPIO wake
                    sources armed: (a) Copy button GPIO (active-low,
                    RTC-domain pin), (b) LSM6DS3TR-C interrupt line
                    (pickup/motion), (c) 15s periodic timer wake for a
                    WiFi poll (v.1 fallback path — see Section 03).
    WAKE_WIFI       WiFi radio up, connects to last-known AP, opens HTTPS
                    to api.lot-systems.com. Budget: <2s to connected on a
                    cached AP, else falls back to WAKE_PROVISION.
    ACTIVE_DISPLAY  Display driven, message rendered, TTL countdown
                    running. Camera stays powered off unless a Copy press
                    or presence check requests a frame.
    ACTIVE_CAPTURE  Camera powered, one frame grabbed into the PSRAM ring
                    buffer, camera immediately powered back down. Never
                    left running — a camera with no shutter indicator that
                    stays powered is a trust problem this design refuses
                    to create.
    WAKE_PROVISION  No known AP or auth failure. Display shows a static
                    pairing glyph; device becomes a BLE GATT peripheral for
                    the pairing flow (LOT-PAGER-SOFTWARE.md Section 02).
    OTA_UPDATE      Entered only on an explicit signed OTA payload from
                    lot-systems.com. Downloads to the inactive partition,
                    verifies signature, reboots. Rolls back automatically
                    if the new partition fails to report healthy within
                    30s of boot.

  TRANSITIONS
    DEEP_SLEEP → WAKE_WIFI            any wake source fires
    WAKE_WIFI → ACTIVE_DISPLAY        push message received, or poll
                                       returns a pending message
    WAKE_WIFI → DEEP_SLEEP            poll returns empty, no button/motion
                                       event pending
    ACTIVE_DISPLAY → ACTIVE_CAPTURE   Copy button pressed during or after
                                       display
    ACTIVE_DISPLAY → DEEP_SLEEP       TTL expires, screen dims and device
                                       re-sleeps
    ACTIVE_CAPTURE → WAKE_WIFI        frame + sensor bundle POSTed
    * → WAKE_PROVISION                3 consecutive WAKE_WIFI connect
                                       failures
    WAKE_WIFI → OTA_UPDATE            signed OTA payload present in poll
                                       response

--------------------------------------------------------------------------------
03 // NOTIFICATION TRANSPORT — LONG-LIVED VS. POLL
--------------------------------------------------------------------------------

  v.1 SHIPS WITH: 15-second HTTPS poll while in WAKE_WIFI, immediately
  re-entering DEEP_SLEEP on an empty response. This is the boring, reliable
  choice for a first hardware run — no persistent-connection edge cases to
  debug on a device that cannot be plugged into a debugger once it ships.

  KNOWN TRADEOFF: a 15s poll interval means a "Coffee time!" message can
  arrive on the server up to 15s before the device displays it. Documented
  and accepted for v.1. NOT a hardware limitation — a firmware-only change.

  v.2 CANDIDATE (not built, not scheduled): MQTT over TLS with a
  persistent broker connection, sub-second push latency, at the cost of a
  higher deep-sleep power draw during the connected window. Revisit only
  if field data from v.1 shows the 15s delay meaningfully hurts the
  "Coffee time!" use case (a message that's stale by the time it's seen is
  worse than the CUBIQ team's own "presence without spectacle" thesis
  intends).

--------------------------------------------------------------------------------
04 // DISPLAY DRIVER
--------------------------------------------------------------------------------

  PANEL         GC9A01, 240x240, SPI, round.
  RENDER PATH   Server sends plain text (≤24 chars, per
                LOT-PAGER-HARDWARE-v1.md Section 09) plus an optional
                8-bit icon-set index (weather glyph, badge glyph, question
                glyph). Firmware owns a fixed local font + icon table — no
                bitmap font download over the air, no arbitrary image
                rendering. This keeps the display attack surface to "an
                index into a table baked at build time," not "arbitrary
                pixels from the network," which matters on a device with no
                way for the operator to visually audit what's being sent.
  IDLE STATE    Display fully off (not dimmed — off) whenever no message is
                within its TTL window. A round display with visible
                backlight bleed when "off" defeats the presence-object
                framing on Part A/B's join line; firmware must confirm true
                panel sleep, not just backlight PWM to zero.

--------------------------------------------------------------------------------
05 // CAMERA CAPTURE PIPELINE
--------------------------------------------------------------------------------

  1. Camera powered via a dedicated GPIO-gated LDO — never left rail-hot in
     DEEP_SLEEP.
  2. On trigger (Copy press, or a periodic low-rate presence check — see
     below), init OV2640, capture one JPEG frame at QVGA (320x240) into
     PSRAM.
  3. Camera immediately powered down. Total camera-on window target: <400ms.
  4. Frame either (a) attached to the Copy-press log payload and uploaded,
     or (b) run through a tiny on-device luma-variance check for presence
     detection only — the frame itself is discarded, never uploaded, when
     used purely for presence gating.

  PRESENCE-GATING CAPTURE (distinct from Copy-triggered capture)
    Runs at most once every 5 minutes, only if the device has a pending
    message queued, to decide whether to light the display immediately or
    hold the message until presence is detected (avoids waking the screen
    to an empty desk). This frame is never transmitted or stored past the
    luma check — an explicit firmware guarantee, called out because it is
    the one camera behavior that runs without an operator-initiated
    trigger and therefore carries the highest trust burden.

--------------------------------------------------------------------------------
06 // BUTTON HANDLING
--------------------------------------------------------------------------------

  Single GPIO, active-low, 10k pull-up, RC debounce on-board (40ms) plus a
  40ms firmware debounce as belt-and-suspenders against a bad solder joint
  reading as chatter. No long-press, no double-press gesture in v.1 — one
  press, one action (Section 08 of the hardware doc). Firmware explicitly
  does NOT implement multi-function overloading on this button; if a
  second function is ever needed, it gets a second button in a future
  revision rather than a press-count heuristic that operators will
  mis-trigger.

--------------------------------------------------------------------------------
07 // OFFLINE QUEUE
--------------------------------------------------------------------------------

  Up to 20 Copy-press events queue in a dedicated flash partition (not the
  OTA partitions) when the POST in Section 08 of the hardware doc fails.
  FIFO, oldest-first retry on next successful WAKE_WIFI. Queue entries
  older than 72 hours are dropped with a one-line note in the next
  successful log write ("N stale entries dropped") rather than silently
  vanishing — the operator's Log tab should never show a gap it can't
  explain.

--------------------------------------------------------------------------------
08 // OPEN QUESTIONS (flag for Phase 1 breadboard proof)
--------------------------------------------------------------------------------

  - BLE provisioning UX (Section 02, WAKE_PROVISION) is named but not
    speced in detail — needs a phone-side pairing flow, which belongs in
    LOT-PAGER-SOFTWARE.md, not here. Cross-reference once that document's
    Section 02 is written.
  - OTA signature scheme (which key, where the private key is held) is not
    yet decided — flag as a Phase 2 blocker, not a Phase 0 one.
  - Exact TTS/text-composition budget for "≤24 characters" needs validation
    against the GC9A01's default font metrics on real hardware, not just
    computed from a font table on paper.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV, INVENTOR, COSMO® CIA
END LOT-PAGER-FIRMWARE
================================================================================
