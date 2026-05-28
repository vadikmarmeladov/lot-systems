<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Computer — Firmware Architecture & Guide

**Document:** FIRMWARE-GUIDE.md
**Revision:** 1.0
**Date:** May 28, 2026
**Project:** COSMO® Computer CC-1
**MCU:** ESP32-S3FN8 (Xtensa LX7 dual-core, 240 MHz)
**Framework:** ESP-IDF v5.2 (FreeRTOS)

---

## 1. Overview

The COSMO® Computer firmware runs on ESP-IDF (Espressif IoT Development Framework) with FreeRTOS. It is organized as a set of concurrent tasks communicating through FreeRTOS queues and event groups. The firmware has no operating system shell — it boots directly into the LOT application loop.

```
Boot → System Init → WiFi Connect → LOT Auth → Main Loop
          │
          ├── Task: Display Manager
          ├── Task: Sensor Loop
          ├── Task: LOT API Client (SSE)
          ├── Task: Button Handler
          └── Task: Session Compressor
```

---

## 2. Repository Structure

```
firmware/
├── CMakeLists.txt
├── sdkconfig                    # ESP-IDF Kconfig settings
├── partitions.csv               # Flash partition table
├── main/
│   ├── CMakeLists.txt
│   ├── main.c                   # App entry point
│   ├── config.h                 # Device config, API keys
│   ├── tasks/
│   │   ├── display_task.c       # OLED rendering
│   │   ├── sensor_task.c        # BME688, VEML7700, VEML6075
│   │   ├── api_task.c           # HTTPS client, SSE listener
│   │   ├── button_task.c        # Copy button ISR + debounce
│   │   └── compressor_task.c    # Session compression + upload
│   ├── drivers/
│   │   ├── ssd1327.c            # OLED driver (SPI)
│   │   ├── ov2640.c             # Camera driver (DVP)
│   │   ├── bme688.c             # BME688 + BSEC integration
│   │   ├── veml7700.c           # Ambient light
│   │   └── qi_charger.c        # BQ51013 status read (I2C)
│   ├── lot/
│   │   ├── lot_auth.c           # Device authentication
│   │   ├── lot_api.c            # API request builders
│   │   ├── lot_notifications.c  # SSE parser + notification queue
│   │   └── lot_log.c            # Log event formatters
│   └── utils/
│       ├── zlib_compress.c      # Session data compression
│       ├── efuse_key.c          # eFuse API key storage
│       ├── ntp.c                # Time sync
│       └── watchdog.c           # WDT management
├── components/
│   ├── bsec/                    # Bosch BSEC SDK (BME688 AI)
│   └── mbedtls/                 # TLS (bundled with ESP-IDF)
└── tools/
    ├── flash.sh                 # Flashing script
    ├── provision.py             # Device provisioning (writes eFuse)
    └── qc_test.py               # Factory QC test suite
```

---

## 3. Boot Sequence

```c
// main.c — simplified

void app_main(void) {
    // 1. Initialize NVS (non-volatile storage)
    nvs_flash_init();

    // 2. Initialize hardware peripherals
    ssd1327_init();         // OLED on SPI2
    bme688_init();          // Weather sensor on I2C0
    veml7700_init();        // Light sensor on I2C0
    veml6075_init();        // UV sensor on I2C0
    ov2640_init();          // Camera on DVP
    button_init();          // GPIO with interrupt

    // 3. Display boot screen
    display_show_text("LOT.", ALIGN_CENTER, FONT_LARGE);

    // 4. Connect to WiFi (stored credentials or BLE provisioning)
    wifi_connect_stored();
    // Fallback: BLE provisioning if no stored credentials

    // 5. Sync time via NTP
    ntp_sync("pool.ntp.org");

    // 6. Authenticate with LOT API
    lot_auth_device();      // Uses eFuse-stored API key

    // 7. Start FreeRTOS tasks
    xTaskCreate(display_task,     "display",    4096, NULL, 5, NULL);
    xTaskCreate(sensor_task,      "sensors",    4096, NULL, 3, NULL);
    xTaskCreate(api_task,         "api",        8192, NULL, 4, NULL);
    xTaskCreate(button_task,      "button",     2048, NULL, 6, NULL);
    xTaskCreate(compressor_task,  "compress",   4096, NULL, 2, NULL);
}
```

---

## 4. Task Descriptions

### 4.1 Display Task (`display_task.c`)

Manages the SSD1327 OLED. Receives render commands from a FreeRTOS queue.

```c
typedef enum {
    DISPLAY_TEXT,       // Show plain text notification
    DISPLAY_METRIC,     // Show sensor reading
    DISPLAY_WEATHER,    // Weather summary
    DISPLAY_STATUS,     // Connection / system status
    DISPLAY_BLANK,      // Clear screen
} DisplayCmd;

typedef struct {
    DisplayCmd  cmd;
    char        line1[64];
    char        line2[64];
    uint8_t     duration_s;  // 0 = persistent
} DisplayMessage;

// Queue handle (global)
QueueHandle_t display_queue;
```

Notification rendering follows LOT design principles:
- **Font:** 5×7 monospace bitmap (matches LOT monospace aesthetic)
- **Alignment:** Center-aligned horizontally and vertically
- **Case:** Sentence case, no ALL CAPS
- **Punctuation:** Period at end of notification text ("Coffee time.")
- **Animation:** Fade in over 400ms, hold, fade out over 1400ms

```c
void display_show_notification(const char *text, uint8_t hold_secs) {
    // Fade in
    for (int brightness = 0; brightness <= 255; brightness += 5) {
        ssd1327_set_contrast(brightness);
        vTaskDelay(pdMS_TO_TICKS(8));
    }
    // Hold
    vTaskDelay(pdMS_TO_TICKS(hold_secs * 1000));
    // Fade out (1400ms)
    for (int brightness = 255; brightness >= 0; brightness -= 5) {
        ssd1327_set_contrast(brightness);
        vTaskDelay(pdMS_TO_TICKS(22));
    }
    ssd1327_clear();
}
```

---

### 4.2 Sensor Task (`sensor_task.c`)

Reads all environmental sensors on a 60-second cycle. Stores readings in a circular buffer in PSRAM.

```c
typedef struct {
    time_t   timestamp;
    float    temperature_c;
    float    humidity_pct;
    float    pressure_hpa;
    uint16_t iaq_score;        // BME688 BSEC: 0–500
    float    lux;
    float    uv_index;
    uint8_t  battery_pct;
} SensorReading;

// Circular buffer in PSRAM (512 readings = ~8.5h at 60s interval)
#define SENSOR_BUFFER_SIZE 512
SensorReading sensor_buffer[SENSOR_BUFFER_SIZE];
uint16_t      sensor_head = 0;

void sensor_task(void *pvParameters) {
    while (1) {
        SensorReading r = {0};
        r.timestamp      = time(NULL);
        r.temperature_c  = bme688_read_temperature();
        r.humidity_pct   = bme688_read_humidity();
        r.pressure_hpa   = bme688_read_pressure();
        r.iaq_score      = bsec_get_iaq();
        r.lux            = veml7700_read_lux();
        r.uv_index       = veml6075_read_uv_index();
        r.battery_pct    = battery_read_percent();

        sensor_buffer[sensor_head % SENSOR_BUFFER_SIZE] = r;
        sensor_head++;

        vTaskDelay(pdMS_TO_TICKS(60000));  // 60 seconds
    }
}
```

**BSEC Integration (BME688 AI):**
The Bosch BSEC library runs inside `sensor_task` on a 3-second cycle to feed the BME688's AI pattern recognition. The IAQ output is only valid after a 5-minute warm-up period; the device shows "Calibrating." on the display during this period.

---

### 4.3 LOT API Task (`api_task.c`)

Maintains an HTTPS connection to `lot-systems.com` and listens for Server-Sent Events (SSE).

```c
void api_task(void *pvParameters) {
    while (1) {
        // Open SSE connection
        esp_http_client_handle_t client = lot_sse_connect(
            "https://lot-systems.com/api/notifications/stream"
        );

        if (client == NULL) {
            display_show_status("Connecting...");
            vTaskDelay(pdMS_TO_TICKS(10000));
            continue;
        }

        display_show_status("Connected.");

        // Read SSE stream
        char buf[512];
        while (esp_http_client_read(client, buf, sizeof(buf)) > 0) {
            lot_notification_t notif = lot_parse_sse(buf);
            if (notif.valid) {
                xQueueSend(display_queue, &notif, 0);
                // Also forward to compressor for session logging
                xQueueSend(session_queue, &notif, 0);
            }
        }

        esp_http_client_cleanup(client);
        vTaskDelay(pdMS_TO_TICKS(5000));  // Reconnect delay
    }
}
```

**Hourly sync:** Every hour, the API task POSTs the last hour of sensor readings to `/api/device/sync` in compressed JSON format.

---

### 4.4 Button Task (`button_task.c`)

Handles the Copy button with hardware debounce and event queuing.

```c
#define BUTTON_GPIO     GPIO_NUM_0
#define DEBOUNCE_MS     50
#define LONG_PRESS_MS   3000

void IRAM_ATTR button_isr_handler(void *arg) {
    BaseType_t higher_priority_task_woken = pdFALSE;
    xQueueSendFromISR(button_event_queue, NULL, &higher_priority_task_woken);
    if (higher_priority_task_woken) portYIELD_FROM_ISR();
}

void button_task(void *pvParameters) {
    gpio_install_isr_service(0);
    gpio_isr_handler_add(BUTTON_GPIO, button_isr_handler, NULL);

    while (1) {
        if (xQueueReceive(button_event_queue, NULL, portMAX_DELAY)) {
            vTaskDelay(pdMS_TO_TICKS(DEBOUNCE_MS));

            // Read hold time
            TickType_t press_start = xTaskGetTickCount();
            while (gpio_get_level(BUTTON_GPIO) == 0) {
                vTaskDelay(pdMS_TO_TICKS(10));
            }
            TickType_t hold_ms = (xTaskGetTickCount() - press_start)
                                  * portTICK_PERIOD_MS;

            if (hold_ms >= LONG_PRESS_MS) {
                // Long press → trigger session upload
                xTaskNotify(compressor_task_handle, 0, eNoAction);
            } else {
                // Short press → POST copy event to LOT log
                lot_post_copy_event();
            }
        }
    }
}

void lot_post_copy_event(void) {
    SensorReading latest = sensor_buffer[(sensor_head - 1) % SENSOR_BUFFER_SIZE];

    char body[512];
    snprintf(body, sizeof(body),
        "{"
        "\"text\":\"COSMO® Computer: Copy signal sent\","
        "\"event\":\"hardware_copy\","
        "\"metadata\":{"
            "\"deviceId\":\"%s\","
            "\"temperature\":%.1f,"
            "\"humidity\":%.1f,"
            "\"pressure\":%.2f,"
            "\"iaq\":%d,"
            "\"lux\":%.0f,"
            "\"uvIndex\":%.2f"
        "}"
        "}",
        efuse_get_device_id(),
        latest.temperature_c,
        latest.humidity_pct,
        latest.pressure_hpa,
        latest.iaq_score,
        latest.lux,
        latest.uv_index
    );

    lot_api_post("/api/logs", body);

    // Visual confirmation: flash display
    display_show_text("Sent.", ALIGN_CENTER, FONT_MEDIUM);
    vTaskDelay(pdMS_TO_TICKS(2000));
    display_clear();
}
```

---

### 4.5 Session Compressor Task (`compressor_task.c`)

Compresses the in-memory sensor buffer and POSTs to `/api/device/sync`.

```c
void compressor_task(void *pvParameters) {
    while (1) {
        // Wait for trigger: long press OR 5-minute inactivity OR battery < 10%
        ulTaskNotifyTake(pdTRUE, pdMS_TO_TICKS(300000)); // 5 min timeout

        uint16_t count = MIN(sensor_head, SENSOR_BUFFER_SIZE);
        if (count == 0) continue;

        // Serialize to JSON
        size_t json_len;
        char *json = sensor_buffer_to_json(sensor_buffer, count, &json_len);

        // Compress with zlib deflate
        uint8_t *compressed;
        size_t  compressed_len;
        zlib_compress(json, json_len, &compressed, &compressed_len);
        free(json);

        // POST compressed payload (base64-encoded for JSON transport)
        char *b64 = base64_encode(compressed, compressed_len);
        free(compressed);

        char body[4096];
        snprintf(body, sizeof(body),
            "{"
            "\"deviceId\":\"%s\","
            "\"sessionStart\":%lld,"
            "\"readingCount\":%d,"
            "\"compressionRatio\":%.2f,"
            "\"data\":\"%s\""
            "}",
            efuse_get_device_id(),
            session_start_time,
            count,
            (float)json_len / compressed_len,
            b64
        );
        free(b64);

        lot_api_post("/api/device/sync", body);

        // Reset session
        sensor_head = 0;
        session_start_time = time(NULL);
    }
}
```

---

## 5. Security

### 5.1 API Key Storage (eFuse)

The device's LOT API key is written to ESP32-S3 eFuse block 3 during factory provisioning. eFuse is one-time programmable — once written, the key cannot be read or overwritten via software.

```python
# tools/provision.py (run once at factory)
import esptool
import hashlib

def provision_device(port, api_key):
    # Burn device serial to eFuse block 1
    device_id = generate_device_serial()  # "CC1-" + 8-char hex
    esptool.burn_efuse(port, "BLOCK1", device_id.encode())

    # Burn API key hash to eFuse block 3
    key_hash = hashlib.sha256(api_key.encode()).digest()
    esptool.burn_efuse(port, "BLOCK3", key_hash)

    print(f"Provisioned: {device_id}")
```

```c
// efuse_key.c — read at runtime
char device_id[16];
void efuse_init(void) {
    esp_efuse_read_block(EFUSE_BLK1, device_id, 0, 64);
}

// API key is retrieved from NVS, validated against eFuse hash
// Key can only be set via BLE provisioning, hash must match eFuse
```

### 5.2 TLS / HTTPS

All communication with `lot-systems.com` uses TLS 1.3 with certificate pinning. The LOT Systems server certificate SHA-256 fingerprint is embedded in firmware at compile time and checked against every connection.

### 5.3 OTA Firmware Updates

Over-the-air updates are delivered via HTTPS from `lot-systems.com/api/firmware/cc1/latest`. The OTA partition scheme uses ESP-IDF's dual-partition rollback: if the new firmware fails to boot 3 times, the previous version is automatically restored.

---

## 6. WiFi Provisioning

New devices are provisioned via BLE using the ESP-IDF BLE Provisioning component:

1. Device powers on fresh → displays "Setup: COSMO-XXXX" on OLED
2. User opens COSMO® Companion app on phone
3. App discovers device via BLE
4. User enters home WiFi credentials in app
5. App sends credentials to device via BLE encrypted channel
6. Device connects to WiFi, displays "Connected."
7. Device authenticates with LOT API using pre-provisioned eFuse API key
8. Setup complete.

---

## 7. Power Management

```c
// Power states
typedef enum {
    POWER_ACTIVE,        // WiFi on, screen on, sensors on — 80mA avg
    POWER_IDLE,          // WiFi on, screen off, sensors on — 35mA avg
    POWER_STANDBY,       // WiFi modem-sleep, screen off — 12mA avg
    POWER_DEEP_SLEEP,    // All off, RTC timer wake — 20µA
} PowerState;

// State transitions
// Active → Idle: after 30s no notification + no button press
// Idle → Standby: after 5min
// Standby → Deep Sleep: after 30min (unless charging)
// Any → Active: on notification received, button press, or USB plug
```

Battery life estimates:
| Usage Pattern | Expected Life |
|---------------|--------------|
| Active use (screen on, frequent notifs) | 6–8 hours |
| Normal use (mix of active + idle) | 12–18 hours |
| Standby (rare notifications) | 3–5 days |
| Deep sleep (no WiFi) | 30+ days |

---

## 8. Factory QC Test

```python
# tools/qc_test.py — automated test at end of production line

def run_qc_test(port):
    tests = [
        test_esp32_boot,         # MCU boots correctly
        test_display_pixels,     # OLED full-pixel test
        test_camera_capture,     # Capture 1 frame, check resolution
        test_bme688_readings,    # Temp must be 15–35°C, humidity 20–80%
        test_veml7700,           # Lux > 50 (bench lamp on)
        test_button_press,       # Operator presses button, ISR fires
        test_wifi_connect,       # Connect to factory test AP
        test_lot_api_ping,       # GET /api/ping returns 200
        test_qi_charging,        # BQ51013 status register read
        test_battery_voltage,    # VBAT > 3.6V (charged before test)
        test_efuse_provisioned,  # eFuse BLOCK1 not empty
    ]

    results = []
    for test in tests:
        result = test(port)
        results.append(result)
        print(f"{'PASS' if result.passed else 'FAIL'}: {result.name}")

    passed = all(r.passed for r in results)
    print(f"\n{'QC PASS' if passed else 'QC FAIL'}: {sum(r.passed for r in results)}/{len(results)}")
    return passed
```

---

## 9. Build & Flash Instructions

### Prerequisites
```bash
# Install ESP-IDF v5.2
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf && git checkout v5.2
./install.sh esp32s3
source export.sh
```

### Build
```bash
cd firmware/
idf.py set-target esp32s3
idf.py menuconfig  # Configure WiFi SSID, API endpoint, etc.
idf.py build
```

### Flash (Production)
```bash
# Tools script handles partition layout
./tools/flash.sh --port /dev/ttyUSB0 --baud 921600

# Or manually:
idf.py -p /dev/ttyUSB0 flash monitor
```

### OTA (Field Update)
```bash
# Server-side: upload new firmware binary
curl -X POST https://lot-systems.com/api/firmware/cc1/upload \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -F "firmware=@build/cosmo_computer.bin" \
  -F "version=1.1.0"

# Device polls hourly and auto-updates
```

---

## 10. Notification Format (SSE)

The SSE stream from `lot-systems.com` delivers events in this format:

```
event: notification
data: {"type":"reminder","text":"Coffee time.","duration":10}

event: notification
data: {"type":"insight","title":"Morning person","body":"You engage most 7–9 AM.","duration":15}

event: notification
data: {"type":"weather","temp":22,"humidity":48,"condition":"Clear","duration":5}

event: ping
data: {}
```

The firmware SSE parser extracts these events and routes them to the display queue. The `ping` event is used to keep the connection alive and confirm the device is still connected.

---

*© 2026 LOT Systems, Inc. — Proprietary and Confidential*
*COSMO® Computer CC-1 — Firmware Guide v1.0*
