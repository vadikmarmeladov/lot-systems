<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Firmware

**Target MCU:** ESP32-S3 (dual-core Xtensa LX7, WiFi 2.4GHz + BLE 5, camera
interface, deep-sleep with RTC memory retention).
**Toolchain:** ESP-IDF (preferred over Arduino core for the fine-grained power
management this device needs).
**Repo:** firmware lives in its own repository (`lot-computer-firmware`, not
this monorepo) — this document is the spec that repo is built against.

## 1. State machine

```
        ┌────────────────────────────────────────────┐
        │                   DEEP SLEEP                 │◄────────┐
        │  (screen holds last e-ink image, MCU off,    │         │
        │   RTC timer wakes it on a poll interval)      │         │
        └───────────────┬───────────────────────────────┘         │
                         │ RTC timer wake  or  button press        │
                         ▼                                        │
        ┌────────────────────────────────────────────┐            │
        │                 POLL / CONNECT               │            │
        │  WiFi assoc → TLS → check for new             │            │
        │  notification / respond to button event        │            │
        └───────┬─────────────────┬─────────────────────┘            │
                 │ new text        │ button = Copy                    │
                 ▼                 ▼                                  │
        ┌────────────────┐  ┌──────────────────────────┐              │
        │     NOTIFY       │  │   COPY (POST /api/logs)   │              │
        │  render on e-ink │  │  send last-shown text +   │              │
        │  hold power ~0   │  │  sensor snapshot           │              │
        └───────┬──────────┘  └──────────┬─────────────────┘              │
                 │                        │                                │
                 └────────────┬───────────┘                                │
                              ▼                                            │
                    back to DEEP SLEEP ──────────────────────────────────►┘

  Long-press (distinct from Copy) → CAMERA state → capture 1 still →
    attach to the same Log entry → back to DEEP SLEEP.
  Placed on Qi dock at any time → CHARGING overlay, independent of the
    above states (charging can happen while asleep).
```

## 2. Power budget (why e-ink, why deep sleep)

The whole power strategy rests on one property of e-ink: **it holds an image
with the display driver powered down**. So the expensive states (WiFi radio,
camera, MCU active) are all brief and infrequent:

| State | Duration | Approx. current draw | Frequency |
|-------|----------|------------------------|-----------|
| Deep sleep | most of the time | µA-range (ESP32-S3 deep sleep + e-ink idle) | continuous |
| Poll/connect (WiFi assoc + TLS + short HTTP check) | ~1–3s | ~120–180mA | every N minutes (configurable poll interval, target 5–15 min) |
| E-ink refresh (draw new notification) | ~1–2s | ~15–25mA spike | only when the text actually changes |
| Camera capture | ~1s | ~80–120mA | only on explicit long-press |
| Copy button POST | ~1–2s (reuses an already-open or freshly opened connection) | similar to poll | only on button press |

Real numbers get measured on the EVT bench in Phase 1 (`02-ROADMAP.md`) and
used to size the battery in `03-BOM.md`. The target is **multi-day battery
life** between Qi charges for a desk-resident device — this is not meant to be
charged nightly like a phone.

**Open design question carried from the poll model above:** a fixed poll
interval trades notification latency for battery life. A push-capable
transport (e.g. an always-listening low-power WiFi mode, or MQTT-over-TLS with
a kept-alive session) would cut latency but costs more power — worth
revisiting once Phase 1 has real battery numbers in hand, not decided here.

## 3. Tasks (FreeRTOS, under ESP-IDF)

- `net_task` — WiFi association, TLS session to the LOT API, poll/push logic
- `display_task` — owns the e-ink SPI bus, only wakes to draw
- `sensor_task` — periodic BME280 (+ optional ALS) sample, cached for the next
  Copy/notification payload — sampled opportunistically during POLL, not on
  its own wake cycle, to avoid an extra wake source
- `button_task` — ISR-driven, debounced, distinguishes short-press (Copy) from
  long-press (Camera)
- `camera_task` — powers the OV2640 only on demand, powers it back down
  immediately after capture
- `power_task` — manages the charge-management IC status line, drives the
  charging overlay on-screen when awake

## 4. OTA updates

- ESP-IDF's native OTA partition scheme (two app slots, rollback on failed
  boot) — standard, not custom.
- OTA image fetched only during a POLL cycle when one is flagged available by
  the server (avoids a second wake source).
- No OTA over BLE for v1 — WiFi-only, matches the rest of the connectivity
  model.

## 5. Security

- TLS to the LOT API, certificate-pinned to `lot-systems.com`'s chain (or, at
  minimum, standard CA validation — hard pin is a Phase 2 decision once the
  production API endpoint is finalized).
- Device holds a **device-scoped API token** (see `05-SOFTWARE-API-CONNECTOR.md
  §4`), not a user's session cookie — the firmware never sees the person's
  password or session token.
- Token provisioned once during pairing (§6) and stored in encrypted NVS
  (ESP-IDF's NVS encryption + flash encryption, both standard ESP32-S3
  features) — not in plaintext flash.

## 6. Pairing / provisioning flow

1. Device boots unprovisioned → opens a temporary WiFi AP + a minimal local
   web page (ESP-IDF's standard provisioning pattern) for WiFi credentials.
2. Once online, device displays a short pairing code on the e-ink screen.
3. Person enters that code on their existing lot-systems.com Settings page
   (new UI, backed by the new endpoint in `05-SOFTWARE-API-CONNECTOR.md §4`).
4. Server mints a device token, device fetches it once over the temporary
   pairing session, stores it, provisioning session closes.

This deliberately reuses the account the person is already logged into on the
web — there is no separate "device account."

## 7. Firmware documentation set (this repo will need its own docs, not covered here)

- `firmware/docs/BUILD.md` — ESP-IDF version pin, build/flash instructions
- `firmware/docs/PINOUT.md` — exact GPIO map once the custom PCB (Phase 2) is
  routed
- `firmware/docs/POWER-BUDGET.md` — measured (not estimated) numbers from
  Phase 1 bench testing, superseding the estimates in §2 above
