# COSMO® CIA — Firmware Documentation

**Version:** 1.0
**Platform:** ESP-IDF v5.2+ (ESP32-S3)
**Language:** C (ESP-IDF components) + C++ (BSEC2 wrapper)
**Target chip:** ESP32-S3
**Date:** 2026-05-26

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    COSMO® CIA Firmware                      │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │                  Application Layer                  │    │
│  │  main_task  │  notification_task  │  sensor_task   │    │
│  └──────┬──────┴──────────┬──────────┴───────┬────────┘    │
│         │                 │                  │              │
│  ┌──────▼─────────────────▼──────────────────▼────────┐    │
│  │                  Service Layer                      │    │
│  │  lot_api  │  wifi_mgr  │  ble_prov  │  ota_mgr    │    │
│  └──────┬────┴──────┬─────┴────┬───────┴──────┬───────┘    │
│         │           │          │              │             │
│  ┌──────▼───────────▼──────────▼──────────────▼───────┐    │
│  │                  Driver Layer                       │    │
│  │  eink  │  camera  │  bme688  │  haptic  │  button  │    │
│  └──────┬───────────────────────────────────────────────┘    │
│         │                                                    │
│  ┌──────▼───────────────────────────────────────────────┐   │
│  │              ESP-IDF / FreeRTOS                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Partition Table

```
# Name,   Type, SubType, Offset,   Size,     Flags
nvs,      data, nvs,     0x9000,   0x6000,
phy_init, data, phy,     0xF000,   0x1000,
factory,  app,  factory, 0x10000,  0x200000,
ota_0,    app,  ota_0,   0x210000, 0x200000,
ota_1,    app,  ota_1,   0x410000, 0x200000,
nvs_key,  data, nvs_keys,0x610000, 0x1000,   encrypted
session,  data, nvs,     0x611000, 0x20000,
```

- `factory`: initial factory image (fallback on OTA failure)
- `ota_0` / `ota_1`: A/B OTA partitions (rolling update)
- `nvs_key`: encrypted NVS master key (flash encryption)
- `session`: session log ring buffer (LZ4-compressed events)

---

## 3. Boot Sequence

```
Power-on / Wake from deep sleep
         │
         ▼
  esp_restart() / esp_wake_stub()
         │
         ▼
  Flash decryption init (AES-256)
  Secure Boot v2 signature check
         │
         ▼
  app_main()
         │
         ├── Is first boot? ──YES──▶ provisioning_mode()
         │                              BLE advertising
         │                              Wait for credentials
         │                              Store in NVS
         │                              Restart
         │
         │         NO
         ▼
  load_config_from_nvs()
    — WiFi SSID + PSK
    — device UUID
    — API token
    — last notification hash
         │
         ▼
  wake_reason = esp_sleep_get_wakeup_cause()
         │
         ├── TIMER_WAKEUP ──▶ poll_cycle()
         ├── EXT0_WAKEUP (button) ──▶ button_handler()
         └── RESET ──▶ full_boot()
```

### poll_cycle() — every 5 minutes
```
wifi_connect()
  │
  ▼
sensor_read()          ← BME688 single-shot measurement
  │
  ▼
lot_api_get_notifications()
  │
  ├── New notification? ──YES──▶ eink_partial_refresh(notification)
  │                              save_notification_hash_to_nvs()
  │
  ▼
session_log_append(event)
  │
  ▼
wifi_disconnect()
  │
  ▼
esp_deep_sleep_start(5 * 60 * 1000000)   // 5 minutes in µs
```

---

## 4. Deep Sleep & Power Management

| Wake source | Trigger | Handler |
|---|---|---|
| Timer | Every 5 minutes (poll interval) | `poll_cycle()` |
| EXT0 GPIO | Copy button press (GPIO 0, active low) | `button_handler()` |
| EXT1 GPIO | Copy button long-press (2s) | `camera_log_handler()` |

**Deep sleep current:** ~90 µA (ESP32-S3 RTC + GPIO wakeup + e-ink holds display).

**Battery life model (120 mAh):**
- Poll cycle: 3s active × 85mA = 0.071 mAh/cycle
- Cycles/day: 288 (every 5 min)
- Daily poll cost: 20.4 mAh
- Button press: 5s × 80mA = 0.11 mAh (assume 10/day = 1.1 mAh)
- Deep sleep leakage: 0.090 mA × 24h = 2.16 mAh/day
- **Total/day: ~23.7 mAh → ~5 days continuous. 7+ days in light use.**

---

## 5. WiFi Management (`wifi_mgr`)

```c
// wifi_mgr.h
esp_err_t wifi_mgr_connect(const char *ssid, const char *password);
esp_err_t wifi_mgr_disconnect(void);
bool wifi_mgr_is_connected(void);
int  wifi_mgr_rssi(void);
```

- WPA2-Personal + WPA3-SAE (auto-negotiate)
- Reconnect: exponential backoff (2s → 4s → 8s → 16s → 32s → fail)
- On connection fail after 5 retries: log error to session buffer, return without API call
- Power save: `WIFI_PS_MIN_MODEM` during active poll; `WIFI_PS_MAX_MODEM` when idle

---

## 6. BLE Provisioning (`ble_prov`)

Uses ESP-IDF `wifi_provisioning` component over BLE (NimBLE stack).

### Provisioning GATT profile (custom extension)

**Service UUID:** `A9A2-LOT0-0001` (custom 128-bit)

| Characteristic | UUID suffix | Properties | Description |
|---|---|---|---|
| WiFi SSID | 0002 | Write | Target network SSID |
| WiFi PSK | 0003 | Write, Encrypted | Network password |
| API token | 0004 | Write, Encrypted | LOT device API token (from lot-systems.com) |
| Device name | 0005 | Write | Human-readable name ("Vadik's COSMO") |
| Status | 0006 | Read, Notify | Provisioning status: `WAITING / SUCCESS / FAILED` |

### Provisioning flow
1. Device boots, NVS has no credentials → BLE advertising starts
2. LED: blue pulsing at 1 Hz
3. LOT web app (Web Bluetooth) or mobile app discovers device by name `COSMO-CIA-XXXX`
4. App writes WiFi credentials + API token to characteristics
5. Device attempts WiFi connect → if success, writes `SUCCESS` to Status char
6. Device saves to encrypted NVS, ends BLE, restarts into poll mode
7. LED: green 3× flash → deep sleep

**Security:** All credential characteristics require BLE pairing (MITM protection, passkey displayed as LED blink count if needed).

---

## 7. LOT API Client (`lot_api`)

```c
// lot_api.h

typedef struct {
    float temperature;
    float humidity;
    float pressure;
    float iaq;
    uint8_t iaq_accuracy;
} lot_sensors_t;

typedef struct {
    char id[37];          // UUID string
    char text[129];       // notification text
    char timestamp[25];   // ISO 8601
} lot_notification_t;

// Poll for latest notification
esp_err_t lot_api_get_notifications(lot_notification_t *out, int max_count, int *received);

// Post Copy button event
esp_err_t lot_api_post_log(const char *notification_id, const lot_sensors_t *sensors);

// Post camera photo log
esp_err_t lot_api_post_log_photo(const char *notification_id,
                                  const lot_sensors_t *sensors,
                                  const uint8_t *jpeg_buf, size_t jpeg_len);

// Check for OTA update
esp_err_t lot_api_check_ota(char *version_out, char *url_out);
```

### HTTPS configuration
```c
esp_http_client_config_t config = {
    .url = "https://lot-systems.com",
    .cert_pem = lot_systems_cert_pem,   // pinned leaf cert
    .transport_type = HTTP_TRANSPORT_OVER_SSL,
    .timeout_ms = 10000,
    .keep_alive_enable = false,
};
```

### Authentication header
```
Authorization: Bearer <device-api-token>
X-Device-ID: <uuid>
X-Firmware-Version: 1.0.0
```

### Retry policy
```c
#define LOT_API_MAX_RETRIES 3
#define LOT_API_RETRY_BASE_MS 2000

// Retry with exponential backoff on HTTP 5xx or network error
// HTTP 4xx (except 429): no retry — log error, continue
// HTTP 429: retry after Retry-After header value
```

---

## 8. e-ink Display Driver (`eink`)

Based on Good Display SSD1681 controller (EPD 1.54" 200×200).

```c
// eink.h
esp_err_t eink_init(void);
esp_err_t eink_full_refresh(const uint8_t *framebuffer);   // 200×200 bits = 5000 bytes
esp_err_t eink_partial_refresh(const uint8_t *framebuffer, uint16_t x, uint16_t y,
                                uint16_t w, uint16_t h);
esp_err_t eink_sleep(void);   // deep sleep mode — image persists, 0µA
esp_err_t eink_wake(void);
```

### Display layout renderer

```
Framebuffer layout (200×200, 1-bit, MSB first):
Row 0..11:   Header bar — "LOT  ·  HH:MM"  (12px font, 12 rows)
Row 12:      Horizontal divider
Row 13..165: Notification text area (18px font, word-wrap, max 4 lines)
Row 166:     Horizontal divider
Row 167..199: Sensor footer — "22.4°C  45%  IAQ 87"  (10px font)
```

**Font:** Custom 1-bit bitmap fonts generated from Roboto (open licence):
- `font_12px.h` — header/footer
- `font_18px.h` — notification body (bold)
- `font_10px.h` — sensor footer

**Partial refresh:** On new notification, only rows 13–165 are refreshed (300ms). Header clock updates on every wake using partial refresh (no full-screen flicker).

**Full refresh:** Every 24 hours to clear ghosting. Triggered on first poll of each calendar day.

---

## 9. BME688 Sensor Driver (`bme688`)

Wraps Bosch BSEC2 library (C, pre-compiled for ESP32-S3).

```c
// bme688.h
esp_err_t bme688_init(void);
esp_err_t bme688_measure(lot_sensors_t *out);
// Blocks ~180ms for forced-mode measurement + BSEC2 processing
```

**BSEC2 configuration:**
- Sample rate: `BSEC_SAMPLE_RATE_LP` (low-power, 3-second cycle)
- Output: temperature, humidity, pressure, iaq, co2_equivalent, breath_voc_equivalent
- IAQ accuracy: 0 (stabilizing) → 3 (stable, calibrated)
- State save: BSEC2 internal state saved to NVS after each measurement (for calibration continuity across deep sleep)

**I2C configuration:**
```c
// BME688 I2C address: 0x76 (SDO = GND)
i2c_config_t bme_i2c = {
    .mode = I2C_MODE_MASTER,
    .sda_io_num = GPIO_NUM_21,
    .scl_io_num = GPIO_NUM_22,
    .sda_pullup_en = GPIO_PULLUP_ENABLE,
    .scl_pullup_en = GPIO_PULLUP_ENABLE,
    .master.clk_speed = 400000,
};
```

---

## 10. Camera Driver (`camera`)

Uses ESP32-S3 camera component (`esp32-camera`).

```c
// camera.h
esp_err_t camera_init(void);
esp_err_t camera_capture_jpeg(uint8_t **buf, size_t *len, size_t max_len);
// Captures VGA JPEG at Q=15 (typical output 40–80KB)
esp_err_t camera_deinit(void);
```

**Configuration:**
```c
camera_config_t cam_config = {
    .pin_d0 = CAM_PIN_D0,  // ... d0-d7
    .pin_vsync = CAM_PIN_VSYNC,
    .pin_href = CAM_PIN_HREF,
    .pin_pclk = CAM_PIN_PCLK,
    .xclk_freq_hz = 20000000,
    .pixel_format = PIXFORMAT_JPEG,
    .frame_size = FRAMESIZE_VGA,   // 640×480
    .jpeg_quality = 15,             // 0=best, 63=worst. 15 ≈ 60KB
    .fb_count = 1,
    .grab_mode = CAMERA_GRAB_WHEN_EMPTY,
};
```

**Power gating:** Camera module powered via GPIO-controlled load switch (Si2302DS MOSFET). Camera power off during deep sleep, poll-only cycles. Powered only on long-press event.

---

## 11. Button & Haptic Driver (`button`)

```c
// button.h
typedef enum {
    BUTTON_EVENT_SINGLE_PRESS,
    BUTTON_EVENT_DOUBLE_PRESS,
    BUTTON_EVENT_LONG_PRESS,
} button_event_t;

void button_init(void (*callback)(button_event_t));
// callback called from GPIO ISR context — post to queue, handle in task
```

**Debounce:** 20ms hardware debounce (RC filter on PCB) + 50ms software debounce in ISR.

**Long-press detection:** GPIO ISR timestamps press; if held > 2000ms at release → `LONG_PRESS`.

**Haptic feedback:**
```c
// drv2605l.h
esp_err_t haptic_init(void);
esp_err_t haptic_play(uint8_t effect_id);
// Effect 14: "Strong Click 100%" — used on single press
// Effect 58: "Double Click 60%" — used on double press
// Effect 8: "Strong Buzz 100%" — used on long-press confirm
```

---

## 12. Session Compression (`session`)

Each device maintains a local ring buffer of the last 50 events in the `session` NVS partition. On each poll cycle, new events are appended. When WiFi is available, the compressed session is flushed to the LOT backend.

```c
// session.h

typedef struct {
    uint32_t timestamp;          // Unix epoch
    uint8_t event_type;          // COPY=1, PHOTO=2, NOTIFICATION=3, SENSOR=4
    char notification_id[37];    // UUID or empty
    lot_sensors_t sensors;
} session_event_t;

esp_err_t session_append(const session_event_t *event);
esp_err_t session_compress_and_get(uint8_t *out_buf, size_t *out_len);
esp_err_t session_clear(void);
```

**Compression:** LZ4 frame format (LZ4 v1.9, available as ESP-IDF component). Typical 50-event session: ~3.5KB raw → ~900 bytes compressed (74% reduction).

**Sync:** `POST /api/device/session-sync` with LZ4-compressed body, `Content-Encoding: lz4`. Server decompresses + stores in user's session history. Clears local buffer on HTTP 200.

---

## 13. OTA Updates (`ota_mgr`)

```c
// ota_mgr.h
esp_err_t ota_check_and_update(const char *current_version);
// Returns ESP_OK if no update needed or update succeeded
// Returns ESP_ERR_OTA_ROLLBACK_FAILED on signature failure
```

**Update flow:**
1. GET `/api/device/firmware/check` → compare version string
2. If newer: GET `/api/device/firmware/download` → stream to inactive OTA partition
3. After download: verify RSA-2048 signature (public key embedded in firmware)
4. `esp_ota_set_boot_partition()` → restart
5. On first boot from new partition: `esp_ota_mark_app_valid_cancel_rollback()`
6. If 3 consecutive boot failures: auto-rollback to previous partition

**Firmware signing key:** RSA-2048 key pair. Public key embedded in firmware. Private key held by LOT Systems (air-gapped signing machine for production).

---

## 14. NVS Key Layout

| Key namespace | Key | Type | Description |
|---|---|---|---|
| `cosmo_cfg` | `wifi_ssid` | String | WiFi SSID |
| `cosmo_cfg` | `wifi_psk` | String | WiFi password |
| `cosmo_cfg` | `device_uuid` | String | 36-char UUID |
| `cosmo_cfg` | `api_token` | String | LOT API bearer token |
| `cosmo_cfg` | `device_name` | String | "Vadik's COSMO" |
| `cosmo_cfg` | `fw_version` | String | "1.0.0" |
| `cosmo_cfg` | `last_notif_hash` | Blob | SHA256 of last notification text |
| `cosmo_cfg` | `last_full_refresh` | U32 | Unix timestamp of last full e-ink refresh |
| `bsec_state` | `bsec_blob` | Blob | BSEC2 calibration state (139 bytes) |
| `session` | `ring_idx` | U32 | Ring buffer write index |
| `session` | `event_N` | Blob | session_event_t for index N (0–49) |

All NVS namespaces encrypted with flash encryption key (eFuse-protected, device-unique).

---

## 15. Build & Flash

### Prerequisites
```bash
# Install ESP-IDF v5.2+
. $IDF_PATH/export.sh

# Install BSEC2 library
# Download from Bosch: https://www.bosch-sensortec.com/software-tools/software/bsec/
# Place in components/bsec2/
```

### Build
```bash
cd cosmo-cia-firmware/
idf.py set-target esp32s3
idf.py menuconfig    # set partition table path, flash encryption
idf.py build
```

### Flash (first-time, via USB-C)
```bash
idf.py -p /dev/ttyUSB0 flash monitor
# Or use the batch programming script:
./scripts/flash.sh --port /dev/ttyUSB0 --device-uuid <uuid> --api-token <token>
```

### Batch flash (100-unit production)
```bash
# flash.sh iterates through all serial ports on the programming jig
# Flashes firmware, provisions UUID + token, runs QC test sequence
./scripts/batch_flash.sh --firmware build/cosmo_cia.bin --devices-csv devices.csv
```

### OTA flash (production units, wireless)
Triggered from LOT admin panel → device downloads on next poll cycle. No physical access required after initial flash.

---

## 16. Debug & Diagnostics

**Serial console (USB-C, 115200 baud):**
```
[BOOT] COSMO® CIA v1.0.0 — device: ABC12345
[WIFI] Connecting to 'MyNetwork'...
[WIFI] Connected, IP: 192.168.1.42, RSSI: -48 dBm
[SENSOR] T=22.4°C H=45% P=1013.2hPa IAQ=87(acc:3)
[API] GET /api/device/notifications → 200, 1 notification
[EINK] Partial refresh: "Coffee time!" (hash changed)
[SESSION] Appended NOTIFICATION event (idx=7)
[SLEEP] Entering deep sleep for 300s
```

**LED status codes:**
| Pattern | Meaning |
|---|---|
| Blue pulsing | BLE provisioning mode |
| Green 3× flash | Provisioning success / boot OK |
| White flash on press | Copy button acknowledged |
| Orange pulse | Charging (Qi active) |
| Green solid | Charge complete (100%) |
| Red 2× | API error (check WiFi/token) |
| Red 5× fast | Fatal error (check serial) |

---

*COSMO® CIA Firmware — LOT Systems. © 2026 All rights reserved.*
