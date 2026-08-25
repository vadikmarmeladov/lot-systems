<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® TILE (CT-1) — Firmware Specification

**Document:** COSMO-TILE-FIRMWARE.md
**Parent plan:** [`docs/corporate/LOT-COSMO-TILE-v1.md`](../corporate/LOT-COSMO-TILE-v1.md)
**Classification:** Restricted // S-2 Eyes
**Prepared:** 2026-08-25
**Target:** ESP32-S3 (see [`COSMO-TILE-BOM.md`](./COSMO-TILE-BOM.md), Table 1)

---

## 1. Scope

This is the single source of truth for what runs **on the device**.
Everything server-side lives in the separate software document
([`COSMO-TILE-SOFTWARE.md`](./COSMO-TILE-SOFTWARE.md)), per the parent
plan's Section 11 requirement that firmware and software stay in
separate documents. Firmware's job is small and fixed: pair once, poll,
render, watch one button, report telemetry. It does not grow features
independently of the plan — any new firmware capability must trace back
to a section of `LOT-COSMO-TILE-v1.md` before it is implemented.

---

## 2. Toolchain

| Layer | Choice | Why |
|---|---|---|
| SDK | ESP-IDF (native), not Arduino-core | Direct control over sleep states and TLS stack size on a tight flash/RAM budget |
| Language | C, with a thin C++ wrapper only around the display driver | Match the SoC vendor's own reference stack; minimize third-party dependency surface |
| Display driver | LVGL, single-screen configuration (no multi-page nav) | Enforces the "one message at a time" render rule (parent plan Section 04) at the library level, not just by convention |
| TLS | mbedTLS (ESP-IDF default) | Device-scoped token auth over HTTPS to the LOT API connector |
| OTA | ESP-IDF native OTA (dual-partition A/B) | Signed images only — see Section 6 |
| Build/CI | PlatformIO project, versioned in this repo under `firmware/cosmo-tile/` (not yet created — this document specifies the layout for the implementation phase) | Keeps firmware source in the same repo as the platform it talks to |

---

## 3. State machine

```
                    ┌────────────┐
        power-on ──▶│   BOOT     │
                    └─────┬──────┘
                          │  read stored device token
                          ▼
                    ┌────────────┐   no token / revoked
                    │   PAIRING  │◀──────────────────────┐
                    └─────┬──────┘                        │
                          │ pair success                   │
                          ▼                                │
                    ┌────────────┐   token rejected ───────┘
                    │   IDLE     │◀────────────┐
                    │ (screen    │              │
                    │  dark)     │              │
                    └─────┬──────┘              │
             poll cycle   │                     │
          (Section 4)     ▼                     │
                    ┌────────────┐              │
                    │  DISPLAY   │              │
                    │ (one line  │              │
                    │  rendered) │              │
                    └─────┬──────┘              │
             COPY pressed │  or timeout          │
                          ▼                     │
                    ┌────────────┐              │
                    │  ACK-SEND  │──────────────┘
                    └────────────┘   (returns to IDLE)
```

`PAIRING` and `ACK-SEND` are the only states that write to flash
(stored token) or make a mutating API call. `IDLE` and `DISPLAY` are
read-only with respect to the network.

---

## 4. Poll / render loop

- Device wakes on a configurable interval (v0 default: 30s, matches the
  platform's own QOS background-monitor cadence class referenced in the
  parent plan's reading log — README.md: "Background monitor — 30-min
  interval refresh" is the QOS-wide cadence; CT-1 polls faster because a
  pager-class device needs sub-minute latency, not the QOS's own 30-min
  window).
- `GET /api/device/:deviceId/next` (see software doc, Section 3).
- Empty response → screen stays/returns dark, device sleeps until next
  cycle (light-sleep, radio off between polls to manage the thin battery
  buffer named in the BOM).
- Non-empty response → render the returned string verbatim, no local
  reformatting beyond the fixed LVGL template (font, margin, timestamp
  corner). The device does not interpret or truncate server content —
  the 64-char budget (parent plan Section 06) is a server-side contract,
  not something firmware re-validates or silently clips.

## 5. Button handling

- Single GPIO interrupt, debounced in software (20ms).
- Press while `DISPLAY` state → transition to `ACK-SEND`, fire
  `POST /api/device/:deviceId/ack` with the currently-shown message ID.
- Press while `IDLE` (nothing on screen) → no-op. The button has exactly
  one function (parent plan Section 03: "not a multi-function button");
  firmware must not grow a long-press or double-press gesture in v0.
- Network failure on ack → local state still clears (operator's physical
  experience is not blocked by connectivity), ack is queued in a small
  ring buffer (8 entries) and retried on next successful poll cycle.

## 6. OTA & signing

- Every image is signed; the bootloader refuses unsigned or
  signature-mismatched images. This is the device-side half of the "no
  third-party firmware" boundary named in the parent plan's Section 01.
- A/B partitioning: a failed boot after OTA auto-rolls back to the prior
  known-good partition after 3 watchdog resets.
- OTA check runs at most once per 24h, off the notification-poll
  network path, so a stalled OTA server never blocks the pager loop.

## 7. Camera capture path

- Camera stays powered off between captures — this is a hardware power
  gate, not just a software idle state, because "no continuous stream"
  (parent plan Section 03) needs to be true even against firmware bugs.
- Capture triggers: (a) local proximity/light-change heuristic on the
  ambient sensor, or (b) an explicit `capture: true` flag on a poll
  response.
- One frame captured, immediately POSTed to
  `POST /api/device/:deviceId/telemetry` (software doc, Section 3), then
  the frame buffer is freed. No frame is ever written to flash.

## 8. Weather telemetry

- BME280 read once per poll cycle, batched into the same telemetry POST
  as any pending camera frame — one network round-trip per cycle, not
  two, to keep radio-on time (and battery draw) minimal.

## 9. Failure modes firmware must handle without a factory reset

| Failure | Behavior |
|---|---|
| WiFi credentials wrong/expired | Falls back to a local BLE provisioning mode (screen shows a short pairing code) |
| API token revoked server-side | Returns to `PAIRING` state (Section 3), screen shows "re-pair" prompt, does not brick |
| Display module fault (I2C/SPI NACK) | Firmware still services the button and API calls headless — a dark screen degrades to "silent pager," not to a dead device |
| Charge coil misaligned / no power | Battery buffer graceful-shutdown sequence (BOM Table 1, line 6) — saves ack retry queue to flash before brownout |

---

## 10. Repository layout (implementation phase — not yet created)

```
firmware/cosmo-tile/
  platformio.ini
  src/
    main.c
    state_machine.c
    display.c        (LVGL glue)
    camera.c
    weather.c
    api_client.c      (mirrors software doc Section 3 endpoints exactly)
    ota.c
  partitions.csv       (A/B OTA layout)
  README.md             (build + flash instructions, references this doc)
```

This document specifies the layout; the actual `firmware/` tree is
implementation work for a subsequent build session, gated on the
Section 09 (parent plan) Stage 1 bring-up hardware existing to flash.

---

*Parent plan: [`docs/corporate/LOT-COSMO-TILE-v1.md`](../corporate/LOT-COSMO-TILE-v1.md) · BOM: [`COSMO-TILE-BOM.md`](./COSMO-TILE-BOM.md) · Software: [`COSMO-TILE-SOFTWARE.md`](./COSMO-TILE-SOFTWARE.md)*
