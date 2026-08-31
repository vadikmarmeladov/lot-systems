<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube v1.0 — Firmware Manual

**Document:** LOT-COMPUTER-FIRMWARE-MANUAL-v1
**Classification:** Restricted — S-2 Eyes
**Companion documents:** LOT-COMPUTER-HARDWARE-SPEC-v1.md (mechanical/
electrical), LOT-COMPUTER-SOFTWARE-MANUAL-v1.md (server/companion-app
side — kept deliberately separate; do not merge).

This manual covers only what runs **on** the ESP32-S3 inside the Cube.
Anything that runs on a phone, a browser, or lot-systems.com's servers is
out of scope here — see the software manual.

---

## 01. Target and Toolchain

- **MCU:** ESP32-S3-WROOM-1 (N16R8 — 16MB flash, 8MB PSRAM)
- **Framework:** ESP-IDF (not Arduino core) — needed for the camera JPEG
  pipeline and fine-grained power management the pager loop depends on.
- **RTOS:** FreeRTOS (bundled with ESP-IDF)
- **Build:** `idf.py build` / `idf.py flash monitor`; CI target is a
  reproducible `sdkconfig.defaults` checked into the firmware repo so a
  100-unit production flash is byte-identical across units.

---

## 02. Task Architecture

Five FreeRTOS tasks, pinned as noted (ESP32-S3 is dual-core):

```
TASK                CORE   PRIORITY   RESPONSIBILITY
────                ────   ────────   ──────────────
net_task            0      3          Wi-Fi/BLE connection, LOT API
                                       connector client (Section 05)
sensor_task         1      4          Poll BME280 (1/min), LD2410
                                       (continuous, interrupt-driven),
                                       LIS2DH12 (on-change interrupt)
display_task        1      3          Render pager text, idle mirror
                                       state, wake/sleep transitions
button_task         1      5          IRQ-driven, debounced, fires the
                                       COPY event (highest priority —
                                       a button press must never be
                                       dropped by other work)
session_task        0      2          Buffers sensor + event data into
                                       one compressed session record
                                       per wake cycle (Section 04)
```

---

## 03. Power States

```
STATE        TRIGGER                          DISPLAY   RADIO
─────        ───────                          ───────   ─────
DEEP_SLEEP   No presence, no pending notif,    off       off (wakes
             >10 min since last activity                 every 30s to
                                                          poll LOT API)
IDLE         Presence confirmed (LD2410) or    off       Wi-Fi light-
             Cube picked up (LIS2DH12)                    sleep, BLE on
NOTIFY       Pager notification received       on        Wi-Fi active
             from LOT API connector
CONFIRM      COPY button pressed               on (ack   Wi-Fi active
                                                 flash)   (send + wait
                                                          for 202)
```

A unit in DEEP_SLEEP still services the 30-second LOT API poll — this is
the one exception to "no continuous radio," because a pager that misses
its own wake-up defeats the product. Battery budget (Section 06) is sized
around this poll interval, not around continuous connectivity.

---

## 04. Session Compression (on-device half of the doctrine)

Per LOT-COMPUTER-HARDWARE-SPEC-v1.md Section 06, a **session** = one
IDLE→NOTIFY-or-CONFIRM→DEEP_SLEEP cycle. `session_task` does not stream
raw sensor samples; it accumulates one record per session:

```c
typedef struct {
    uint32_t session_start_epoch;
    uint16_t duration_ms;
    int16_t  temp_centideg;      // BME280, single delta from last session
    uint8_t  humidity_pct;       // BME280
    uint16_t pressure_hpa_x10;   // BME280
    uint8_t  presence_confirmed; // LD2410 boolean
    uint8_t  notification_id;    // 0 if none shown this session
    uint8_t  button_pressed;     // boolean
    char     notification_text[64]; // only populated if button_pressed
} cube_session_record_t;         // 76 bytes, fixed-size, no malloc
```

One `cube_session_record_t` is flushed to `net_task` at session end. This
caps the Cube's outbound traffic to one small, fixed-size record per
human-triggered event — not a telemetry firehose — regardless of how
often the sensors themselves sample internally.

---

## 05. LOT API Connector — Firmware Side

Firmware implements exactly two network operations (full protocol,
payload shapes, and auth are defined in LOT-COMPUTER-SOFTWARE-MANUAL-v1.md
Section 03 and LOT-COMPUTER-HARDWARE-SPEC-v1.md Section 05 — this section
only lists the firmware's call sites):

1. **Poll/subscribe** for a pending `pager_notification` (WebSocket where
   reachable, falling back to the 30-second HTTPS poll in DEEP_SLEEP).
2. **POST** a `cube_session_record_t` (Section 04) — fired on every
   session end, and immediately (bypassing the session boundary) on a
   COPY button press, since a button press must reach
   `POST /api/log/hardware-append` with the lowest possible latency.

Firmware never talks to any endpoint other than the LOT API connector's
declared host. No local HTTP server, no unauthenticated debug port ships
in a production (non-JTAG) build.

---

## 06. Battery Budget

```
STATE        CURRENT DRAW   DUTY (typical desk use)
─────        ────────────   ───────────────────────
DEEP_SLEEP   ~8 mA avg      ~85% of a day (30s poll amortized)
IDLE         ~25 mA         ~12%
NOTIFY       ~90 mA         ~2%
CONFIRM      ~110 mA        <1%
```

Blended average ≈ 15 mA → a 400mAh cell (BOM Section 01) yields ≈ 26
hours of runtime worst-case, ≈ 2-3 days typical with plate visits
overnight. Firmware does not attempt more aggressive sleep than
DEEP_SLEEP's 30-second poll — a longer poll interval trades battery life
for pager latency, and pager latency is the product.

---

## 07. OTA Update

- Dual OTA partition (`ota_0` / `ota_1`), signed images only
  (`esp_secure_boot` + `esp_image_format` signature check) — a
  100-unit fleet must be updatable without a truck roll, but never
  updatable by an unsigned image.
- Update trigger: server-initiated via the LOT API connector (software
  manual Section 04), never a firmware self-check against a public
  update server — one fewer unauthenticated network dependency.
- Rollback: on three consecutive boot failures post-update, the
  bootloader reverts to the last-known-good OTA slot automatically.

---

## 08. Bring-Up / Test Checklist (per unit, production line)

```
[ ] Flash production firmware image (signed)
[ ] Verify Wi-Fi provisioning QR scan (camera) completes pairing
[ ] BME280 reads within ±2% of reference thermometer
[ ] LD2410 detects presence at 0.5m and 2m, no detection at 4m
[ ] Button: 10 presses register 10 distinct COPY events, zero drops
[ ] Qi charge: 0%→100% within spec time on the plate (BOM Section 02)
[ ] DEEP_SLEEP current draw measured <10 mA
[ ] Unit ID burned to eFuse, device_token provisioning stub confirmed
```

This checklist gates every one of the 100 pilot units — see
LOT-COMPUTER-HARDWARE-SPEC-v1.md Section 07 for the run-level DFM gate
this individual-unit checklist feeds into.

---

**Classification:** Restricted — S-2 Eyes
**Status:** Pre-hardware — firmware not yet written, this manual is the
architecture the firmware must be built to.
