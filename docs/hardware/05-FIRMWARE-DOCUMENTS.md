# COSMO Computer — Firmware Reference Documents
**Document:** 05-FIRMWARE-DOCUMENTS  
**Revision:** A  
**Date:** 2026-05-27  

---

## 1. Pin Configuration Reference

### 1.1 ESP32-S3-MINI-1U Pin Assignment

```
┌─────────────────────────────────────────────────────────┐
│                  ESP32-S3-MINI-1U                        │
│                                                          │
│  GPIO01 ── Battery ADC (via 100k/100k divider)          │
│  GPIO02 ── NC (reserved)                                 │
│  GPIO03 ── I2C SDA (BME688, LSM6DSO32, VEML7700)        │
│  GPIO04 ── I2C SCL (BME688, LSM6DSO32, VEML7700)        │
│  GPIO05 ── COPY Button (active low, 10kΩ pull-up)       │
│  GPIO06 ── WS2812B LED (RMT peripheral)                  │
│  GPIO07 ── Display Backlight (LEDC PWM, 10kHz)          │
│  GPIO08 ── Display RESET (active low)                    │
│  GPIO09 ── Display DC (Data/Command)                     │
│  GPIO10 ── Display CS (SPI CS, active low)              │
│  GPIO11 ── Display MOSI (SPI)                           │
│  GPIO12 ── Display CLK (SPI)                            │
│  GPIO13 ── NC                                            │
│  GPIO14 ── NC                                            │
│  GPIO15 ── Camera XCLK (20 MHz)                         │
│  GPIO16 ── Camera PCLK                                   │
│  GPIO17 ── Camera VSYNC                                  │
│  GPIO18 ── Camera HREF                                   │
│  GPIO19 ── Camera D0 / USB D- (shared, see note)        │
│  GPIO20 ── Camera D1 / USB D+ (shared, see note)        │
│  GPIO21 ── Camera D2                                     │
│  GPIO22 ── Camera D3                                     │
│  GPIO23 ── Camera D4                                     │
│  GPIO24 ── Camera D5                                     │
│  GPIO25 ── Camera D6                                     │
│  GPIO26 ── Camera D7                                     │
│  GPIO38 ── Camera SIOC (SCCB/I2C Clock)                 │
│  GPIO39 ── Camera SIOD (SCCB/I2C Data)                  │
│  GPIO43 ── UART0 TX (debug, CP2102N RX)                 │
│  GPIO44 ── UART0 RX (debug, CP2102N TX)                 │
│                                                          │
│  GPIO19/20 NOTE: These are also ESP32-S3 native USB     │
│  pins. Camera and USB are mutually exclusive.           │
│  STRAPPING OPTION: if CP2102N is NOT populated, GPIO19/ │
│  20 can be camera data lines. With CP2102N, camera D0/  │
│  D1 connect to GPIO21/22 instead.                       │
└─────────────────────────────────────────────────────────┘
```

---

## 2. I2C Device Map

| Device | Address | Bus | Notes |
|--------|---------|-----|-------|
| BME688 | 0x76 | I2C0 | SDO pin → GND |
| LSM6DSO32 | 0x6A | I2C0 | SA0 → GND |
| VEML7700 | 0x10 | I2C0 | Fixed address |
| OV2640 (SCCB) | 0x30 | I2C1 (GPIO38/39) | Camera control |

**I2C0 scan expected response (firmware `task_sensors.c`):**
```
Scanning I2C bus 0...
Found device at 0x10  → VEML7700 ✓
Found device at 0x6A  → LSM6DSO32 ✓
Found device at 0x76  → BME688 ✓
I2C scan complete. 3 devices found.
```

---

## 3. NVS (Non-Volatile Storage) Schema

The ESP32-S3 NVS stores device configuration, credentials, and session data.

### 3.1 Namespace: `cosmo_cfg`

| Key | Type | Description | Default |
|-----|------|-------------|---------|
| `device_id` | string | Factory-assigned device ID (e.g., `CC-R1-20260601-0001`) | Set at factory |
| `device_secret` | string | Factory-assigned device secret (32-byte hex) | Set at factory |
| `fw_version` | string | Current firmware version | `"1.0.0"` |
| `wifi_ssid` | string | Wi-Fi SSID | `""` (empty = not provisioned) |
| `wifi_pass` | string | Wi-Fi password (WPA2 PSK) | `""` |
| `auth_token` | string | LOT API JWT access token | `""` |
| `refresh_token` | string | LOT API JWT refresh token | `""` |
| `token_expiry` | uint32 | UNIX timestamp of token expiry | 0 |
| `api_host` | string | LOT API host | `"lot-systems.com"` |
| `poll_interval` | uint16 | Notification poll interval (seconds) | 60 |
| `display_brightness` | uint8 | Display brightness 0–255 | 128 |
| `timezone_offset` | int16 | UTC offset in minutes | 0 |

### 3.2 Namespace: `cosmo_session`

| Key | Type | Description |
|-----|------|-------------|
| `session_count` | uint32 | Number of sessions since factory reset |
| `session_buf` | blob | LZ4-compressed session data (max 32 KB) |
| `session_dirty` | uint8 | 1 if session_buf has unsynchronised data |
| `last_sync` | uint32 | UNIX timestamp of last successful API sync |

---

## 4. UART Debug Protocol

All debug output is at **115200 baud, 8N1** on GPIO43/44 (via CP2102N to USB-C).

### 4.1 Log Format

```
[HH:MM:SS.mmm] [LEVEL] [TASK] message
```

Example boot log:
```
[00:00:00.001] [I] [main    ] COSMO Computer v1.0.0 booting...
[00:00:00.005] [I] [main    ] NVS init OK
[00:00:00.012] [I] [main    ] Display init OK (ST7789V 240x240)
[00:00:00.045] [I] [sensors ] BME688 init OK (addr=0x76)
[00:00:00.051] [I] [sensors ] LSM6DSO32 init OK (addr=0x6A)
[00:00:00.055] [I] [sensors ] VEML7700 init OK (addr=0x10)
[00:00:00.060] [I] [wifi    ] Connecting to SSID: "HomeNetwork"
[00:00:03.421] [I] [wifi    ] Connected. IP: 192.168.1.42
[00:00:03.500] [I] [api     ] Authenticating with lot-systems.com...
[00:00:04.120] [I] [api     ] Auth OK. Token expires in 3600s.
[00:00:04.200] [I] [time    ] SNTP sync: 2026-05-27 09:42:00 UTC
[00:00:04.300] [I] [ota     ] Checking for firmware updates...
[00:00:04.850] [I] [ota     ] Firmware up to date (v1.0.0)
[00:00:04.900] [I] [main    ] System ready. Entering poll loop.
```

### 4.2 Debug Commands (UART RX)

Send single-character commands over UART for debug interaction:

| Command | Action |
|---------|--------|
| `s` | Print full sensor snapshot |
| `n` | Force notification poll immediately |
| `c` | Simulate COPY button press |
| `b` | Print battery voltage and percent |
| `w` | Print Wi-Fi status and RSSI |
| `r` | Restart device |
| `f` | Enter flash mode (hold for OTA) |
| `p` | Enter BLE provisioning mode |
| `?` | Print this help |

---

## 5. OTA Update Protocol

### 5.1 OTA Partition Layout

```
partitions.csv:
# Name,   Type, SubType, Offset,   Size,     Flags
nvs,      data, nvs,     0x9000,   0x6000,
otadata,  data, ota,     0xF000,   0x2000,
phy_init, data, phy,     0x11000,  0x1000,
ota_0,    app,  ota_0,   0x20000,  0x1F0000,
ota_1,    app,  ota_1,   0x210000, 0x1F0000,
session,  data, nvs,     0x400000, 0x80000,   # Session storage partition
```

Dual-bank OTA: device boots from `ota_0`, downloads new firmware to `ota_1`, verifies SHA256, then switches boot partition to `ota_1`. If new firmware fails to boot, ESP-IDF rolls back to `ota_0`.

### 5.2 OTA State Machine

```
IDLE
  │ (boot check or API push notification)
  ▼
CHECK_UPDATE ── GET /api/device/firmware/latest ──► No new version → IDLE
  │ New version found
  ▼
DOWNLOAD ── GET firmware_url ──► (progress display on screen)
  │ Download complete + SHA256 verified
  ▼
VALIDATE ── esp_ota_end() ──► Validation fail → DOWNLOAD_ERROR → IDLE
  │ Validated
  ▼
SET_BOOT ── esp_ota_set_boot_partition(ota_1)
  │
  ▼
RESTART ── esp_restart()
  │ (device reboots from ota_1)
  ▼
CONFIRM ── esp_ota_mark_app_valid_cancel_rollback()
  │ (after 60s successful operation)
  ▼
IDLE (running new firmware)
```

---

## 6. Sensor Register Reference

### 6.1 BME688 Initialisation Sequence

```c
// I2C write sequence for BME688 basic init
// (Full init handled by BSEC2 library)

// 1. Read chip ID (should be 0x61)
bme688_read_reg(0xD0, &chip_id);
assert(chip_id == 0x61);

// 2. Soft reset
bme688_write_reg(0xE0, 0xB6);
vTaskDelay(pdMS_TO_TICKS(10));

// 3. Configure via BSEC2 API
bsec_init();
bsec_update_subscription(requested_outputs, n_outputs, required_sample_rate);

// BSEC2 sample rates:
// BSEC_SAMPLE_RATE_LP    = 0.33333 Hz (every 3 seconds, low power)
// BSEC_SAMPLE_RATE_ULP   = 0.00278 Hz (every 5 minutes, ultra low power) ← USE THIS
// BSEC_SAMPLE_RATE_SCAN  = 0.1 Hz (every 10 seconds, for IAQ scanning)
```

### 6.2 LSM6DSO32 Initialisation

```c
// Read WHO_AM_I register (0x0F) → should return 0x6C
lsm6dso32_read_reg(0x0F, &who_am_i);
assert(who_am_i == 0x6C);

// CTRL1_XL (0x10): accelerometer config
// ODR=104Hz, ±8g range
lsm6dso32_write_reg(0x10, 0x4C);  // 0100 1100

// CTRL2_G (0x11): gyroscope config  
// ODR=104Hz, ±2000dps
lsm6dso32_write_reg(0x11, 0x4C);  // 0100 1100

// CTRL3_C (0x12): block data update, auto-increment
lsm6dso32_write_reg(0x12, 0x44);  // BDU=1, IF_INC=1

// INT1_CTRL (0x0D): enable data ready interrupt on INT1
lsm6dso32_write_reg(0x0D, 0x03);  // DRDY_XL=1, DRDY_G=1
```

### 6.3 VEML7700 Initialisation

```c
// Configuration register (0x00)
// ALS_GAIN: 1/4 (for high lux), ALS_IT: 25ms, ALS_PERS: 1
// Reg value: 0x1800
veml7700_write_reg(0x00, 0x1800);

// Read ALS data (register 0x04)
uint16_t als_raw;
veml7700_read_reg(0x04, &als_raw);

// Convert to lux (depends on gain/IT settings)
float lux = als_raw * 0.0576f;   // For gain=1/4, IT=25ms
```

---

## 7. Battery Monitoring

Battery voltage is read via ADC1 channel 0 (GPIO01) through a voltage divider:

```
Battery+ ──┬── 100kΩ ──┬── 100kΩ ── GND
            │           │
            │           └── GPIO01 (ADC)
            └── Battery+ (to power system)

ADC reads: V_adc = V_battery * (100k / (100k + 100k)) = V_battery / 2
ESP32-S3 ADC reference: 3.1 V (11dB attenuation)
ADC full scale: 3.1 V → 4095 counts
```

```c
// battery_monitor.c

float battery_get_voltage(void) {
    int raw = adc1_get_raw(ADC1_CHANNEL_0);
    float v_adc = (raw / 4095.0f) * 3.1f;
    return v_adc * 2.0f;  // Undo voltage divider
}

uint8_t battery_get_percent(void) {
    float v = battery_get_voltage();
    // LiPo discharge curve (linear approximation)
    if (v >= 4.20f) return 100;
    if (v >= 4.00f) return (uint8_t)(80 + (v - 4.00f) / 0.20f * 20);
    if (v >= 3.70f) return (uint8_t)(20 + (v - 3.70f) / 0.30f * 60);
    if (v >= 3.00f) return (uint8_t)((v - 3.00f) / 0.70f * 20);
    return 0;
}
```

---

## 8. Interrupt Handlers

### 8.1 COPY Button ISR

```c
// Installed on GPIO05, negative edge (falling)
static void IRAM_ATTR button_isr_handler(void *arg) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    button_event_t evt = {
        .type = BUTTON_PRESS_COPY,
        .timestamp = esp_timer_get_time()  // microseconds
    };
    xQueueSendFromISR(button_event_queue, &evt, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

// task_button.c processes events from queue:
// - Debounce (50ms)
// - Long press detection (> 10s → factory reset)
// - Post COPY_EVENT to task_lot_api
```

---

## 9. Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| 0x00 | `ERR_OK` | Success |
| 0x01 | `ERR_WIFI_TIMEOUT` | Wi-Fi association timed out (30s) |
| 0x02 | `ERR_API_AUTH_FAIL` | Authentication rejected by LOT API |
| 0x03 | `ERR_API_TIMEOUT` | HTTP request timed out (10s) |
| 0x04 | `ERR_API_PARSE` | JSON response parse error |
| 0x05 | `ERR_SENSOR_I2C` | I2C sensor not responding |
| 0x06 | `ERR_DISPLAY_SPI` | SPI display not responding |
| 0x07 | `ERR_OTA_DOWNLOAD` | OTA download failed |
| 0x08 | `ERR_OTA_VERIFY` | OTA SHA256 mismatch |
| 0x09 | `ERR_NVS_READ` | NVS read error |
| 0x0A | `ERR_NVS_WRITE` | NVS write error |
| 0x0B | `ERR_BATTERY_LOW` | Battery below 5% |
| 0x0C | `ERR_CAMERA_INIT` | OV2640 not responding |

Error codes are logged to UART and, if Wi-Fi is available, posted to `/api/device/error-report`.

---

## 10. Firmware Changelog

### v1.0.0 (2026-06-01, planned Rev A release)
- Initial firmware for 100-unit pilot run
- Notification polling via HTTPS
- COPY button → LOT Log tab integration
- BME688 AI sensor via BSEC2 library
- LSM6DSO32 IMU (activity classification)
- VEML7700 ambient light → auto-brightness
- Qi charge status monitoring
- BLE Wi-Fi provisioning
- OTA update via lot-systems.com API
- LZ4 session compression
- Factory provisioning script

---

*Document: 05-FIRMWARE-DOCUMENTS.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
