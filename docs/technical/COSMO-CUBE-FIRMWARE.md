<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — Firmware

## Classification: RESTRICTED // S-2 EYES

**Companion to:** [../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md)
**Kept separate from:** [COSMO-CUBE-SOFTWARE.md](./COSMO-CUBE-SOFTWARE.md) — this
document is on-device code only. Server-side and companion-app code is the
other document, per the intake brief's explicit instruction to keep
firmware and software documentation apart.

**Date:** 2026-09-04
**Target:** ESP32-S3-WROOM-1 (N8R8)
**Status:** SPEC — no firmware written yet; this is the build reference

---

## 1. Toolchain

| Layer | Choice | Why |
|-------|--------|-----|
| SDK | ESP-IDF 5.x (not Arduino-core) | Direct access to deep-sleep + secure-boot APIs the power and pairing design depend on |
| Language | C, with a thin C++ display-layout helper | ESP-IDF's own idiom; keeps the binary small on an 8MB flash budget shared with OTA slots |
| RTOS | FreeRTOS (bundled with ESP-IDF) | Two tasks are enough: `net_task` (poll/push, Section 4) and `ui_task` (display + button, Section 3) |
| Build | `idf.py build / flash / monitor` | Standard ESP-IDF flow, no custom build system |
| OTA | ESP-IDF native OTA (`esp_https_ota`), dual-slot | Firmware updates pulled over the same Wi-Fi link as notifications |

---

## 2. Module map

```
firmware/
├── main/
│   ├── app_main.c          entry point, task spawn
│   ├── power_mgmt.c        deep-sleep scheduling, battery ADC read
│   ├── display_driver.c    e-paper SPI driver + 3-line text renderer
│   ├── camera_driver.c     OV2640 DVP init + single-frame capture
│   ├── weather_sensor.c    BME280 I2C read (temp/humidity/pressure)
│   ├── button.c            debounce + single-action dispatch (Section 5)
│   ├── net_client.c        Wi-Fi assoc, HTTPS client, poll loop (Section 4)
│   ├── pairing.c           BLE GATT server, one-time provisioning (Section 6)
│   └── device_id.c         derives device_id from efuse MAC, Section 4 format
└── sdkconfig.defaults      flash encryption + secure boot flags (Section 7)
```

---

## 3. Display driver — the pager screen

The display renders **at most 3 lines of text**, left-aligned, one font
size (16pt). No scrolling, no graphics in v1.0 (docs/corporate/
LOT-COSMO-CUBE-HARDWARE-v1.md, Section 08 — graphical layouts are
explicitly out of scope). The renderer takes one input: a `notify_payload`
struct (Section 4) with a `text` field truncated to 60 characters and
wrapped to 3 lines client-side.

E-paper is refreshed only on a state change (new message, pairing state
change, low-battery warning) — never on a timer, since a full refresh
draws far more current than the sleep floor. Partial refresh is used for
the battery/status glyph in the corner; full refresh for message text
(ghosting-prevention pass every 10th full refresh, per e-paper vendor
guidance).

---

## 4. Networking — poll + push, one payload shape

`net_task` runs a state machine: `SLEEP -> WAKE -> ASSOC -> POLL -> (RENDER) -> SLEEP`.

```c
typedef struct {
  char text[64];       // truncated server-side to 60 chars, null-padded
  char event_class[24];// e.g. "memory_question", "badge_unlock", "weather_update"
  uint32_t ttl_s;       // how long this message should stay on screen before
                          // the device treats it as stale on next wake
} notify_payload_t;
```

- Default wake interval: 60s (docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md,
  Section 04 — "the power-safe floor").
- While on charge (Qi presence detected via charge-IC status pin), the
  device stays Wi-Fi-associated and additionally opens the low-latency
  SSE/WebSocket path described in the software document instead of
  polling every 60s.
- Every request carries the device-scoped bearer token from `pairing.c`
  flash storage (Section 6) — firmware never holds the operator's actual
  LOT session credentials, only the derived device token.
- Full request/response schema, endpoint list, and server-side auth
  lifecycle: [COSMO-CUBE-SOFTWARE.md](./COSMO-CUBE-SOFTWARE.md), Section 2.

---

## 5. Button — one action, debounced, fire-and-confirm

```c
// button.c — single GPIO interrupt, 40ms debounce window
void on_button_press(void) {
    log_event_t evt = {
        .event = "device_copy",
        .text  = "COSMO Cube — Copy pressed",
        .battery_pct = power_mgmt_battery_pct(),
        .last_notification = display_driver_last_text(),
    };
    // Queued to net_task; ui_task shows a 1-line "Sent." confirmation
    // on successful POST, or "Retry..." if offline (payload persists in
    // a small ring buffer in flash and retries on next association —
    // per LOT-GENESIS-v1.md Doctrine clause 7, graceful degradation:
    // a network failure queues, it does not drop.
    net_client_enqueue_log(&evt);
}
```

The exact HTTP call this produces (`POST /api/logs`) is specified in
docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md, Section 05, and its
server-side auth wrapper in COSMO-CUBE-SOFTWARE.md, Section 3.

---

## 6. Pairing — BLE provisioning, no keyboard on-device

1. Factory-flashed firmware boots into `PAIRING` mode on first power-on
   (no stored device token in flash).
2. BLE GATT server advertises as `COSMO-CUBE-XXXXXX` (last 6 hex of MAC).
3. Operator's phone (via lot-systems.com/settings, Web Bluetooth) writes
   a short-lived provisioning token + the target Wi-Fi credentials to a
   GATT characteristic.
4. Firmware exchanges the provisioning token for a long-lived device
   token over HTTPS (first Wi-Fi association), stores it in encrypted
   flash, exits `PAIRING` mode permanently until a factory-reset (button
   held 10s at boot).

---

## 7. Security

- **Secure Boot v2** + **Flash Encryption** enabled in `sdkconfig.defaults`
  — the device token and Wi-Fi credentials are unreadable if the flash is
  physically extracted.
- **OTA signature verification** — updates are rejected unless signed
  with the LOT Systems firmware signing key; no unsigned OTA path.
- **No local web server, no open ports** — the device only makes outbound
  HTTPS/BLE connections, mirroring the "no open inbound ports" posture
  already used server-side (docs/technical/LOT-NODE-0-RIG-SPEC.md,
  Section 03 — "Cloudflare Tunnel — no open inbound ports").

---

## 8. Power budget (informational, ties to BOM battery sizing)

| State | Draw | Duration/day (typical) |
|-------|------|------------------------|
| Deep sleep | ~15uA | ~23h |
| Wi-Fi poll (assoc + HTTPS GET) | ~120mA avg | ~2 min/day (60s interval, few-second bursts) |
| E-paper full refresh | ~20mA for ~2s | a few times/day (message-driven, not timer-driven) |
| Camera capture (on-demand only) | ~120mA for <1s | rare, operator/presence-triggered |

300mAh cell, this budget: several days of standby between wireless
charges under normal notification volume — validated at the v1.0 gate
(docs/corporate/LOT-COSMO-CUBE-HARDWARE-v1.md, Section 08 — "72-hour
multi-day standby test").

---

**Companion documents:** [../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md](../corporate/LOT-COSMO-CUBE-HARDWARE-v1.md) · [COSMO-CUBE-SOFTWARE.md](./COSMO-CUBE-SOFTWARE.md) · [../corporate/LOT-COSMO-CUBE-BOM.md](../corporate/LOT-COSMO-CUBE-BOM.md)

**Authorized by:** S-2 // Vadik Marmeladov
