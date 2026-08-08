<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — Firmware Specification (v1.0)

**Document:** LOT-COSMO-COMPUTER-FIRMWARE.md
**Classification:** RESTRICTED // S-2 EYES
**S-2:** Vadik Marmeladov
**Companion documents:**
docs/corporate/LOT-COSMO-COMPUTER-v1.md (plan — read first),
docs/corporate/LOT-COSMO-COMPUTER-BOM.md (parts),
docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md (server side of this contract)

---

## 1. Scope

This document specifies what runs on the device (ESP32-S3, per the BOM).
It does not specify the server. Every wire-format claim here has a matching
receiver defined in LOT-COSMO-COMPUTER-SOFTWARE.md — the two documents are
kept in sync by matching section numbers where the same payload is described
from both ends.

## 2. Boot Sequence

```
POWER ON (wireless charge detected, or button wake from deep sleep)
  1. Init peripherals: display, camera (standby, not streaming), BME280,
     button GPIO (interrupt-capable), battery ADC
  2. Load stored Wi-Fi credentials + pairing token from NVS (non-volatile
     storage) — set during pairing (Section 6)
  3. If no pairing token: render "PAIR ME" on display, enter pairing mode
     (Section 6), do not proceed
  4. If pairing token present: connect Wi-Fi, open SSE connection
     (Section 4), enter MAIN LOOP
```

## 3. Power States

```
STATE          DISPLAY   WI-FI          CAMERA   TARGET DRAW    WAKE TRIGGER
─────          ───────   ────           ──────   ───────────    ────────────
DEEP SLEEP     off       off            off      <50uA           button press,
                                                                   RTC timer
SSE STANDBY    off       connected,     off      ~25-40mA        server push,
                          idle                                    button press
NOTIFY         on        connected      off      ~60-80mA        (self, on push)
SESSION        on        connected      standby  ~90-120mA        button press
CAPTURE        on        connected      active   ~150-180mA       COPY press,
                                                                   server request
```

SSE STANDBY is the default resting state, not DEEP SLEEP — brief item 2
requires the device to *receive* a pager-style push without the operator
waking it first, which rules out deep-sleep-between-polls as the default.
DEEP SLEEP is used only when the paired profile is explicitly set to
"quiet hours" server-side (Section 5 of the software document) — the
device is told to sleep, it does not decide to on its own.

## 4. Inbound: SSE Notification Client

The device holds a long-lived HTTP connection to the LOT API connector's
SSE stream (`text/event-stream`, matching the existing production endpoint
at src/server/routes/api.ts line ~329). Firmware behavior on event receipt:

```c
on_sse_event(const char* payload) {
    // payload is a short JSON: {"text": "Coffee time!", "dwell_ms": 8000}
    wake_display();
    render_centered_text(payload.text);
    if (haptic_present) pulse_haptic(SHORT_PULSE);   // Section 3, BOM 03
    start_dwell_timer(payload.dwell_ms);
    log_session_event(NOTIFY_SHOWN, payload.text);   // Section 5 buffer
}

on_dwell_timeout() {
    sleep_display();
    // does NOT close the SSE connection — standby persists
}
```

Reconnection: standard exponential backoff (1s, 2s, 4s ... capped at 60s)
on connection drop, matching the reconnect behavior already implemented
client-side in src/client/utils/sse.ts for the software app — firmware
mirrors that retry curve rather than inventing a new one.

## 5. On-Device Session Compression Buffer

Implements plan doc Section 06. A session is bounded by wake and sleep
(button press or scheduled sensor read → screen timeout or explicit
sleep). Firmware accumulates into a fixed-size struct, not a growing log:

```c
typedef struct {
    uint32_t session_start_ts;
    uint32_t session_end_ts;
    float    temp_min, temp_max, temp_sum;   // BME280
    float    humid_min, humid_max, humid_sum;
    uint16_t sample_count;
    uint8_t  camera_captured;                // 0 or 1 — at most one frame
    uint8_t  button_pressed;                 // 0 or 1
    uint8_t  battery_pct;
} lot_session_t;
```

At session close, firmware computes min/max/mean from the accumulators
(not from stored samples — the struct above holds no per-sample array) and
serializes ONE JSON payload, matching the shape the software document's
Section 3 receiver expects. This is the entire "compression" step: O(1)
memory regardless of session length, one POST per session instead of one
POST per sensor tick.

## 6. Pairing Mode

```
1. Device boots with no stored token → SoftAP "LOT-COMPUTER-<serial>"
2. Operator connects phone/laptop to the SoftAP, LOT app (or captive
   portal page) posts { wifi_ssid, wifi_pass, lot_profile_token }
3. Device stores credentials in NVS, connects to home Wi-Fi
4. Device POSTs its serial + lot_profile_token to the pairing endpoint
   (LOT-COSMO-COMPUTER-SOFTWARE.md Section 2)
5. Server verifies the profile token against the operator's LOT account
   (same profile-verification gate named in docs/corporate/
   LOT_ROBOTICS_COSMO.md — "a robot without a verified LOT profile does
   not activate"; this device follows the identical rule)
6. On success, server returns a long-lived device token; device stores it,
   exits pairing mode, proceeds to boot Section 2 step 4
```

A device with a torn-off or reset pairing token re-enters pairing mode on
next boot rather than retaining any cached profile data — no stale
operator data survives an unpair.

## 7. The COPY Button

```c
on_button_isr() {
    if (current_state == DEEP_SLEEP) { wake(); return; }  // wake only
    close_session(COPY_PRESSED);            // Section 5: finalize buffer
    if (camera_standby) capture_one_frame(); // at most 1 frame, this session
    payload = serialize_session();           // Section 5 struct → JSON
    http_post("/api/logs", payload);         // see software doc Section 4
    flash_display("COPY");                   // 400ms acknowledgement, then sleep
}
```

Exactly one HTTP POST per button press, carrying exactly one compressed
session payload. The button does not queue multiple requests — a second
press before the first POST completes is debounced and ignored.

## 8. OTA Update Path

100-unit pilot fleet, wireless charge as the only physical connector —
firmware updates must be over-the-air. ESP32-S3 native OTA (dual-partition,
A/B slot) is triggered only:

- On explicit operator confirmation surfaced through the software side
  (never silently, never mid-session), and
- Only when battery >= 40% and the device is on its charging pad (wireless
  power connected) — an OTA failure mid-flash on battery-only power bricks
  a unit with no serial recovery port; this gate is a hard rule, not a
  suggestion.

## 9. Firmware Bill of State

| Data | Stored where | Cleared on |
|---|---|---|
| Wi-Fi credentials | NVS | factory reset (button held 10s during boot) |
| Pairing/device token | NVS | factory reset, or explicit unpair command |
| Current session buffer | RAM only | every session close (Section 5) |
| Firmware image (A/B) | Flash partitions | OTA update (Section 8) |

No per-sample sensor history is ever stored on-device. This is a
consequence of Section 5's design, not a separate privacy decision — the
compression buffer has nowhere to put per-sample history even if it wanted
to.

---

*Companion to docs/corporate/LOT-COSMO-COMPUTER-v1.md. Revise this document
on MCU/PCB changes; revise LOT-COSMO-COMPUTER-SOFTWARE.md on backend
changes — see plan doc Section 08 for why the two are kept separate.*
