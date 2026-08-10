<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® SLATE — Firmware Document (v1)

Companion doc to `docs/corporate/COSMO-SLATE-v1.md`. Covers item 9 of the
brief ("firmware documents"). This describes what runs ON the ESP32-S3 —
see `SOFTWARE.md` for what runs on lot-systems.com's side of the connection.

## 01. Design constraint

Per COSMO-SLATE-v1.md Section 06, all message composition and history
compression happens server-side. The firmware's job is deliberately small:
render a string, read three sensors, watch one button, manage power. It is
NOT a general application runtime — no on-device scripting, no OTA-pushed
arbitrary code execution without the update-signing check in Section 05.

## 02. Pin map (v1 reference, confirm against final board layout)

```
ESP32-S3-WROOM-1-N16R8
  SPI0  → GC9A01 display (MOSI, SCLK, CS, DC, RST)
  I2C0  → BME280 (SDA, SCL) — shared bus, weather sensor only
  DVP   → OV2640 camera (8-bit parallel + I2C control on same I2C0 bus,
          different address — confirm no address collision with BME280
          during bring-up, Section 05 step 02)
  GPIO  → tactile switch (interrupt-driven, debounced in firmware)
  GPIO  → Qi charge-detect line (from charge/protection IC, BOM.md Section 4)
  UART0 → debug console (prototype units only, disabled in production
          build per Section 04 security note)
```

## 03. Firmware modules

```
MODULE            RESPONSIBILITY
──────            ──────────────
boot.c            Cold boot < 2s to last-known message on screen (cached
                   in flash) before Wi-Fi even attempts to connect — the
                   device should never show a blank screen while booting
display.c         Render exactly one line of text on the GC9A01, large,
                   centered, high-contrast. No second content type.
camera.c           Capture on a timer (default: every 60s while device is
                   awake), run on-device presence/ambient-light derivation,
                   discard the raw frame immediately after — never buffers
                   or transmits a raw image in v1 (COSMO-SLATE-v1.md
                   Section 01 hard constraint)
weather.c          Poll BME280 every 5 min, queue reading for the next
                   telemetry batch
button.c           Debounce + single-press detection on the COPY switch;
                   queues one "copy" event for the next connector sync
connector.c        LOT API connector client — WebSocket primary, HTTPS
                   batch fallback, per COSMO-SLATE-v1.md Section 05.
                   Owns all outbound JSON framing (weather batch, presence
                   field, copy event) and inbound message parsing.
power.c            Battery/Qi charge state machine, deep-sleep between
                   camera/weather polls to hit the 4-5 day runtime target
pairing.c          First-boot BLE provisioning: broadcast a short pairing
                   code, accept Wi-Fi credentials over BLE, hand off to
                   connector.c once Wi-Fi joins (COSMO-SLATE-v1.md
                   Section 05, "Pairing")
ota.c              Signed firmware update check (Section 05 below)
```

## 04. Security notes

- No raw camera frames leave the device (module `camera.c`, hard constraint
  carried over from COSMO-SLATE-v1.md Section 01 — do not weaken this in a
  future firmware revision without a new document that explicitly reopens
  the question, the same way CUBIQ's levitation section stayed a named-but-
  unscoped research track rather than a silent scope change).
- `UART0` debug console is compiled OUT of production builds — left in
  prototype/bring-up builds only, flagged clearly in the build config so a
  100-unit production flash can't accidentally ship a debug image.
- Wi-Fi credentials and the device's LOT API token are stored in the
  ESP32-S3's encrypted NVS partition, not plaintext flash.

## 05. OTA update path (item 9/10 boundary)

Firmware updates are signed by LOT Systems and delivered over the same
LOT API connector channel used for messages (`connector.c`), not a
separate update server. Update flow:

```
01  lot-systems.com backend publishes a signed firmware image + version tag
02  Device checks version tag on each successful connector sync (piggybacked
    on the existing WebSocket/HTTPS channel — no separate poll loop)
03  If newer: download image over HTTPS, verify signature before flashing
04  Flash to inactive OTA partition, reboot, verify boot success
05  If boot fails 3x: automatic rollback to prior partition (ESP-IDF's
    built-in OTA rollback, not custom logic — don't reinvent this)
```

## 06. Bring-up checklist (prototype stage, before the 100-unit order)

```
[ ] ESP32-S3 boots, serial console visible on debug build
[ ] GC9A01 renders a static test string
[ ] BME280 returns plausible temp/humidity/pressure over I2C
[ ] OV2640 captures a frame in debug build (frame discarded in prod build,
    verified visually only during bring-up)
[ ] Button press registers exactly one event per press, no double-fire
[ ] BLE pairing flow completes against a test lot-systems.com endpoint
[ ] WebSocket connects to wss://sync.lot-systems.com/m2m/intake (or a
    local dev stand-in), round-trips one test message
[ ] Deep sleep + Qi wake cycle measured against the 4-5 day battery target
[ ] OTA update flow tested end-to-end on a bench unit before it's trusted
    on the 100-unit batch
```

---

*Companion to `docs/corporate/COSMO-SLATE-v1.md`. See `SOFTWARE.md` for the
server-side connector and pairing implementation, `MANUAL.md` for the
operator-facing instructions.*
