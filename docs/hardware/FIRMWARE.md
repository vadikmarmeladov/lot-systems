# LOT Node — Firmware Architecture

Target: ESP32-S3 (Arduino-core or ESP-IDF; ESP-IDF recommended for
production power-management control).

## 1. Boot flow

```
Power on / wake from Qi charge
  → init display (GC9A01, SPI) → splash "LOT"
  → init Wi-Fi (stored credentials) or enter pairing mode
      pairing mode: show QR code on display; user's phone camera (not the
      device's own camera) scans a URL that opens a captive-portal-style
      setup page served by the device (BLE or SoftAP) to input Wi-Fi creds
  → connect to lot-systems.com over HTTPS (see SOFTWARE-CONNECTOR.md)
  → enter main loop
```

## 2. Main loop responsibilities

1. **Notification poll/push client** — see `SOFTWARE-CONNECTOR.md` §3 for
   the transport decision (poll vs. persistent connection); render
   incoming short text on the round display.
2. **Button debounce + Copy signal** — on a clean press, fire the
   `POST /api/logs` call described in `SOFTWARE-CONNECTOR.md` §4; show a
   brief on-screen confirmation ("Logged ✓").
3. **Weather sensor read** — poll BME280 every 10 minutes, cache locally,
   forward on the same cadence the site's own weather cache uses (the
   existing `WeatherResponse` model in `src/server/routes/api.ts` already
   caches per city/country — the device should not spam the endpoint more
   often than that cache refreshes).
4. **Camera** — idle by default; wakes only for (a) first-time QR pairing
   and (b) an optional presence-detection tick (single low-res frame,
   processed on-device, never uploaded) to dim the display when no one is
   at the desk. No continuous capture, no photo storage, no cloud upload —
   this is a firmware-level privacy commitment, not just a UI setting.
5. **OTA update check** — daily, signed firmware images only.
6. **Power management** — display dims after N seconds idle; deep-sleep
   between weather polls if not actively displaying a notification.

## 3. Display states

| State | Shown |
|---|---|
| Boot | LOT wordmark |
| Pairing | QR code + "Scan to connect" |
| Idle | Small clock / weather glyph (low brightness) |
| Notification | Full-brightness short text, auto-dims after ~15s |
| Copy confirmed | Checkmark flash, ~1s, then returns to previous state |
| Offline | Small disconnect glyph in corner, cached last notification stays visible |

## 4. Data the device stores locally

- Wi-Fi credentials (encrypted NVS partition)
- Device auth token (see `SOFTWARE-CONNECTOR.md` §2) — encrypted NVS
- Last-shown notification (for offline display continuity)
- No camera frames are ever written to flash or transmitted.

## 5. Firmware release process

- Versioned firmware images built from a dedicated `firmware/` source tree
  (not yet created — out of scope for Session 1, which is plan/BOM/roadmap
  only per the brief)
- Signed images, OTA delivered via the same LOT API host, a
  `/api/devices/firmware/latest` style endpoint to be added when firmware
  work begins (does not exist yet — see `SOFTWARE-CONNECTOR.md` §5 for the
  list of server-side endpoints that still need to be built vs. those that
  already exist today)
