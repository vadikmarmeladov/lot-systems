<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Firmware Specification

**Document:** COSMO_COMPUTER_FIRMWARE.md
**Classification:** Restricted // S-2 Eyes — Technical Specification
**Prepared:** August 9, 2026
**Status:** v0.1 — draft, precedes Phase 2 prototype (see LOT_COSMO_COMPUTER.md Section 07)
**Parent document:** `docs/corporate/LOT_COSMO_COMPUTER.md` (hardware plan, BOM, roadmap)
**Sibling document:** `docs/technical/COSMO_COMPUTER_SOFTWARE.md` (companion app / API connector)

---

## 01 // SCOPE

This document specifies the code that runs on the COSMO® Computer itself
(ESP32-S3 target, per the BOM in `LOT_COSMO_COMPUTER.md` Section 03.1). It
does not specify the server-side LOT API or the companion app — those are
`COSMO_COMPUTER_SOFTWARE.md`. Kept separate per item 11 of the build
brief ("separate documents").

---

## 02 // ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                      FIRMWARE (ESP32-S3)                    │
│                                                               │
│  ┌───────────┐   ┌───────────┐   ┌────────────┐            │
│  │  Sensor    │   │  Display   │   │  Camera     │            │
│  │  Loop      │   │  Driver    │   │  Gate       │            │
│  │ (BME280,   │   │ (SPI TFT/  │   │ (OV2640,    │            │
│  │  VEML7700, │   │  OLED)     │   │  trigger-   │            │
│  │  LIS2DUX12)│   │            │   │  only)      │            │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘            │
│        │                │                │                   │
│        └────────┬───────┴───────┬────────┘                   │
│                  │               │                            │
│           ┌──────▼──────┐  ┌────▼─────┐                      │
│           │  Session     │  │  Button   │                      │
│           │  Compressor  │  │  Handler  │                      │
│           │ (Section 05, │  │ (short =  │                      │
│           │  parent doc) │  │  Copy,    │                      │
│           │              │  │  long =   │                      │
│           │              │  │  camera)  │                      │
│           └──────┬───────┘  └────┬─────┘                      │
│                  │               │                             │
│           ┌──────▼───────────────▼──────┐                     │
│           │   LOT API Client (Wi-Fi)     │                     │
│           │   — pairing, poll/push,      │                     │
│           │     event POST               │                     │
│           └──────────────┬───────────────┘                     │
│                           │                                    │
│           ┌───────────────▼───────────────┐                    │
│           │  Power Manager (Qi charge      │                    │
│           │  state, deep-sleep scheduler)  │                    │
│           └────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 03 // MODULES

### 03.1 — Sensor Loop
Polls BME280 (temp/humidity/pressure), VEML7700 (ambient light), and
LIS2DUX12 (motion/wake) on a low-power interval (target: 1 sample /
60s active, suspended during deep-sleep). Feeds two consumers:
  - **Display Driver** — VEML7700 reading drives auto-brightness/auto-dim,
    never full-off while a pager message is pending (Section 03.2).
  - **Session Compressor** — rolling average accumulated into the
    `sensorSummary` block specified in `LOT_COSMO_COMPUTER.md` Section 05.

### 03.2 — Display Driver
Single responsibility: render one line of text (the current pager
message) plus a minimal status glyph (charge state, connectivity dot).
No scrolling text, no menu system, no settings UI on-device — device
configuration happens entirely through the companion app / web dashboard
(`COSMO_COMPUTER_SOFTWARE.md`), never on the 40×40mm screen itself. This
is a hard scope boundary, not a v1 limitation to be relaxed later — it is
what keeps the object a pager and not a phone.

### 03.3 — Camera Gate
The camera is powered down (not merely idle) except during an explicit
trigger window:
  - **Trigger:** long-press (≥ 1.5s) of the Face B button.
  - **Behavior:** power up OV2640 → capture one still frame → power down
    within a bounded window (target: < 2s total). No frame is buffered
    beyond that window; no frame is transmitted unless the operator has
    an active "attach to log" opt-in set in their LOT profile
    (server-side flag, checked before transmission — see
    `COSMO_COMPUTER_SOFTWARE.md`).
  - **No fallback path** exists that lights the camera outside this
    gate. This is enforced at the firmware state-machine level: the
    camera power rail has exactly one code path that can assert it, and
    that path is the long-press handler.

### 03.4 — Session Compressor
Accumulates the structured session object defined in
`LOT_COSMO_COMPUTER.md` Section 05 in RAM only. Flushed to the LOT API
Client on any of: session end (Face-A-down on the charging pad, i.e.
charging begins), a rolling 24h boundary, or a buffer-pressure threshold
(defensive — should not trigger in normal operation given the compressed
schema's small size). Nothing in this module writes to flash/EEPROM
beyond the minimum needed to survive a brief Wi-Fi outage (a single
pending-session buffer, overwritten on next successful flush, not
accumulated).

### 03.5 — Button Handler
Debounced single-button state machine:
  - **Short press (< 1.5s):** fires the Copy event (`LOT_COSMO_COMPUTER.md`
    Section 04.2) — echoes the currently-displayed message id + timestamp
    to the LOT API Client for the Log tab write.
  - **Long press (≥ 1.5s):** fires the Camera Gate trigger (Section 03.3).
  - No double-press, no chord gestures — one button, two clearly
    distinguishable actions, matching the "single button" hardware
    constraint (item 16 of the build brief).

### 03.6 — LOT API Client
Thin HTTP(S) client over Wi-Fi. Three operations only:
  1. **Pair** (one-time, at setup — see `COSMO_COMPUTER_SOFTWARE.md` for
     the pairing flow).
  2. **Poll or subscribe** for the next pager message.
  3. **POST** Copy events and compressed sessions.
  No other network surface is exposed by the device — no local web
  server, no open ports, no direct-to-device connections. All
  configuration flows through the LOT API in one direction (server →
  device for messages, device → server for events).

### 03.7 — Power Manager
Tracks Qi charge state (via the BQ51013B-class receiver) and schedules
deep-sleep between sensor polls and pager checks. Target battery life on
the ~40–80mAh cell (Section 03.1, BOM) is measured in hours between
charges given the small cell forced by the 5mm height — the device is
designed to live on or near its charging pad, waking fully only on
motion (LIS2DUX12 interrupt) or an inbound pager message.

---

## 04 // OPEN QUESTIONS FOR PHASE 2 (PROTOTYPE)

```
[ ]  Confirm ESP32-S3 variant (module vs. bare chip) against the
     final 5mm stack height once real component datasheets (not
     catalog listings) are in hand.
[ ]  Decide poll-interval vs. persistent-connection for pager
     delivery — trade battery life against message latency.
[ ]  Validate OV2640 power-up-to-capture timing against the < 2s
     Camera Gate budget on real silicon.
[ ]  Define exact debounce/long-press timing constants after
     handling a physical prototype button (Section 03.5 timings
     above are planning defaults, not measured).
[ ]  Specify OTA firmware update path (must not open a standing
     listen port per Section 03.6 — likely a pull-based update
     check piggybacked on the existing poll cycle).
```

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END COSMO_COMPUTER_FIRMWARE
================================================================================
