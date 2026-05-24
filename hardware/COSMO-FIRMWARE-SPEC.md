# COSMO NODE — Firmware Specification
**MCU:** ESP32-S3-MINI-1-N8R8  
**Framework:** ESP-IDF v5.x  
**Language:** C (core) + C++ (BSEC2 wrapper)  
**Revision:** 1.0  
**Date:** 2026-05-24  

---

## 1. Partition Table

```
# Name        Type    SubType    Offset     Size
nvs           data    nvs        0x9000     0x6000    # Device config, WiFi creds, token
otadata       data    ota        0xf000     0x2000    # OTA state
ota_0         app     ota_0      0x10000    0x1E0000  # Active firmware
ota_1         app     ota_1      0x1F0000   0x1E0000  # OTA update slot
spiffs        data    spiffs     0x3D0000   0x30000   # Log cache + assets
```

---

## 2. Pin Assignment (ESP32-S3-MINI-1)

```c
// OLED SSD1327 (I2C)
#define PIN_I2C_SDA     GPIO_NUM_8
#define PIN_I2C_SCL     GPIO_NUM_9

// BME688 (shared I2C bus)
#define BME688_ADDR     0x76

// Camera OV2640 (DVP)
#define CAM_PIN_PWDN    GPIO_NUM_38
#define CAM_PIN_RESET   GPIO_NUM_39
#define CAM_PIN_XCLK    GPIO_NUM_40
#define CAM_PIN_SIOD    GPIO_NUM_41   // I2C SDA (dedicated cam bus)
#define CAM_PIN_SIOC    GPIO_NUM_42   // I2C SCL
#define CAM_PIN_D7      GPIO_NUM_48
#define CAM_PIN_D6      GPIO_NUM_47
#define CAM_PIN_D5      GPIO_NUM_21
#define CAM_PIN_D4      GPIO_NUM_14
#define CAM_PIN_D3      GPIO_NUM_13
#define CAM_PIN_D2      GPIO_NUM_12
#define CAM_PIN_D1      GPIO_NUM_11
#define CAM_PIN_D0      GPIO_NUM_10
#define CAM_PIN_VSYNC   GPIO_NUM_45
#define CAM_PIN_HREF    GPIO_NUM_46
#define CAM_PIN_PCLK    GPIO_NUM_7

// External SPI flash GD25Q64
#define PIN_SPI_MOSI    GPIO_NUM_35
#define PIN_SPI_MISO    GPIO_NUM_37
#define PIN_SPI_CLK     GPIO_NUM_36
#define PIN_FLASH_CS    GPIO_NUM_34

// WS2812B LED
#define PIN_LED_DATA    GPIO_NUM_4

// Copy button
#define PIN_BUTTON      GPIO_NUM_3   // active low, internal pull-up

// USB-C UART (via CH340C — hardware, no GPIO mapping needed)
// UART0 TX = GPIO_NUM_43, RX = GPIO_NUM_44 (default ESP32-S3)
```

---

## 3. FreeRTOS Task Architecture

```
Core 0 (Protocol CPU)         Core 1 (Application CPU)
─────────────────────         ──────────────────────────
wifi_manager_task             display_task
  priority: 5, 4KB              priority: 3, 3KB
  handles: connect, reconnect   handles: OLED frame buffer update

api_task                      sensor_task
  priority: 4, 6KB              priority: 2, 2KB
  handles: HTTP/WS to LOT API   handles: BME688 poll every 3s

ota_task (spawned on demand)  button_task
  priority: 3, 8KB              priority: 6, 2KB
  handles: firmware download     handles: ISR debounce, press events

session_task                  camera_task (spawned on demand)
  priority: 2, 4KB              priority: 3, 8KB
  handles: compress + upload     handles: JPEG capture on request
```

**Inter-task communication:** FreeRTOS queues + event groups  

```c
// Event group bits
#define EVT_WIFI_CONNECTED    BIT0
#define EVT_BUTTON_SHORT      BIT1
#define EVT_BUTTON_LONG       BIT2
#define EVT_NOTIF_RECEIVED    BIT3
#define EVT_API_LOG_SUCCESS   BIT4
#define EVT_API_LOG_FAIL      BIT5
#define EVT_OTA_AVAILABLE     BIT6
#define EVT_BATTERY_LOW       BIT7
```

---

## 4. WiFi Manager

```c
typedef enum {
    WIFI_STATE_DISCONNECTED,
    WIFI_STATE_CONNECTING,
    WIFI_STATE_CONNECTED,
    WIFI_STATE_PROVISIONING,  // BLE pairing mode
} wifi_state_t;

void wifi_manager_task(void *pvParams) {
    // 1. Load SSID + password from NVS
    // 2. esp_wifi_start() with station mode
    // 3. On EVT_WIFI_CONNECTED: notify api_task
    // 4. On disconnect: exponential backoff reconnect
    //    attempts: 1s, 2s, 4s, 8s, 16s, 32s, 60s cap
    // 5. After 5 min no connect: enter deep sleep, retry on wake
}
```

**Provisioning (first boot or factory reset):**
1. ESP32-S3 advertises BLE GATT service: UUID `6E400001-B5A3-F393-E0A9-E50E24DCCA9E`
2. Characteristic WRITE: receive `{"ssid":"...","password":"...","token":"..."}`
3. Store in NVS, restart WiFi in station mode
4. Notify LOT site companion app: device online
5. BLE advertisement stops (power save)

---

## 5. LOT API Client

```c
// Base URL stored in NVS, default:
#define LOT_API_BASE "https://lot-systems.com/api"

// HTTP client config
esp_http_client_config_t http_cfg = {
    .url = LOT_API_BASE,
    .cert_pem = lot_systems_root_ca,   // bundled in firmware
    .timeout_ms = 8000,
    .buffer_size = 2048,
};
```

### 5.1 Copy Button — POST /api/log

```c
typedef struct {
    char     device_id[20];   // "COSMO-0042"
    uint32_t timestamp;       // Unix epoch
    float    temp_c;
    float    humidity_pct;
    float    pressure_hpa;
    uint16_t iaq_index;
    uint8_t  battery_pct;
} lot_log_payload_t;

esp_err_t lot_send_copy_log(const lot_log_payload_t *payload) {
    char body[256];
    snprintf(body, sizeof(body),
        "{\"source\":\"cosmo_node\","
        "\"device_id\":\"%s\","
        "\"action\":\"copy\","
        "\"timestamp\":%lu,"
        "\"payload\":{"
        "\"temp_c\":%.1f,"
        "\"humidity_pct\":%.1f,"
        "\"pressure_hpa\":%.1f,"
        "\"iaq_index\":%d,"
        "\"battery_pct\":%d}}",
        payload->device_id,
        (unsigned long)payload->timestamp,
        payload->temp_c,
        payload->humidity_pct,
        payload->pressure_hpa,
        payload->iaq_index,
        payload->battery_pct
    );
    // POST with Authorization: Bearer <device_token>
    // On 200: set EVT_API_LOG_SUCCESS, pulse LED green
    // On error: queue for retry, pulse LED red
    return ESP_OK;
}
```

### 5.2 Notification Poll — GET /api/notifications/device

```c
typedef struct {
    char     id[36];
    char     message[128];
    uint32_t display_duration_ms;
    uint8_t  priority;         // 0=low 1=normal 2=urgent
} lot_notification_t;

void api_task(void *pvParams) {
    while (1) {
        if (xEventGroupWaitBits(evt, EVT_WIFI_CONNECTED, ...) {
            lot_notification_t notif;
            esp_err_t ret = lot_poll_notification(&notif);
            if (ret == ESP_OK) {
                xQueueSend(display_queue, &notif, 0);
            }
        }
        // Poll interval: 60s default (NVS configurable: 30s–300s)
        vTaskDelay(pdMS_TO_TICKS(poll_interval_ms));
    }
}
```

### 5.3 WebSocket Push (alternative to polling)

```c
esp_websocket_client_config_t ws_cfg = {
    .uri = "wss://lot-systems.com/ws/device/COSMO-XXXX",
    .headers = "Authorization: Bearer <token>\r\n",
    .reconnect_timeout_ms = 5000,
    .network_timeout_ms   = 10000,
};
// On WEBSOCKET_EVENT_DATA: parse JSON, push to display_queue
// On WEBSOCKET_EVENT_DISCONNECTED: reconnect with backoff
```

---

## 6. Display Driver (SSD1327 OLED)

```c
// Resolution: 128×128, 4-bit grayscale (16 levels)
// Frame buffer: 128 × 128 / 2 = 8,192 bytes in PSRAM

void display_task(void *pvParams) {
    oled_init();
    oled_show_idle_clock();    // default state: time + date

    lot_notification_t notif;
    while (1) {
        if (xQueueReceive(display_queue, &notif, pdMS_TO_TICKS(1000))) {
            oled_show_notification(&notif);   // typewriter + fade
        } else {
            oled_update_clock();              // refresh time display
        }
    }
}

void oled_show_notification(const lot_notification_t *n) {
    oled_clear();
    // Typewriter: render one char every 80ms
    for (int i = 0; i < strlen(n->message); i++) {
        oled_draw_char(x, y, n->message[i], FONT_16PT);
        oled_flush();
        vTaskDelay(pdMS_TO_TICKS(80));
    }
    vTaskDelay(pdMS_TO_TICKS(n->display_duration_ms));
    oled_fade_out(500);   // fade to black over 500ms
    oled_show_idle_clock();
}
```

**Fonts bundled in firmware SPIFFS:**
- `font_6x8.bin` — small monospace (status bar)
- `font_16pt.bin` — notification body
- `font_24pt.bin` — clock display

---

## 7. Sensor Task (BME688 + BSEC2)

```c
#include "bsec.h"   // Bosch BSEC2 library

void sensor_task(void *pvParams) {
    bsec_init();
    bsec_set_configuration(bsec_config_iaq);   // IAQ mode

    while (1) {
        bsec_input_t inputs[BSEC_MAX_PHYSICAL_SENSOR];
        bsec_output_t outputs[BSEC_NUMBER_OUTPUTS];

        bme688_read_forced(&inputs[0]);   // trigger forced mode measurement
        bsec_do_steps(inputs, n_inputs, outputs, &n_outputs);

        // Extract and cache values for API payload
        current_env.temp_c       = outputs[BSEC_OUTPUT_COMPENSATED_GAS].signal;
        current_env.humidity_pct = outputs[BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY].signal;
        current_env.pressure_hpa = bme688_get_pressure_hpa();
        current_env.iaq_index    = (uint16_t)outputs[BSEC_OUTPUT_IAQ].signal;

        // BSEC2 next_call_timestamp determines sleep duration
        uint64_t sleep_ms = (bsec_next_call - esp_timer_get_time()) / 1000;
        vTaskDelay(pdMS_TO_TICKS(sleep_ms));
    }
}
```

---

## 8. Button Handler

```c
static void IRAM_ATTR button_isr(void *arg) {
    BaseType_t high_prio_woken = pdFALSE;
    xTaskNotifyFromISR(button_task_handle, 0, eNoAction, &high_prio_woken);
    portYIELD_FROM_ISR(high_prio_woken);
}

void button_task(void *pvParams) {
    gpio_set_intr_type(PIN_BUTTON, GPIO_INTR_NEGEDGE);
    gpio_isr_handler_add(PIN_BUTTON, button_isr, NULL);

    while (1) {
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(50));   // debounce

        uint32_t press_start = xTaskGetTickCount();
        while (gpio_get_level(PIN_BUTTON) == 0) {
            vTaskDelay(pdMS_TO_TICKS(10));
        }
        uint32_t duration_ms = (xTaskGetTickCount() - press_start) * portTICK_PERIOD_MS;

        if (duration_ms < 1000) {
            // Short press: send Copy log
            xEventGroupSetBits(evt, EVT_BUTTON_SHORT);
            lot_log_payload_t payload = build_log_payload();
            lot_send_copy_log(&payload);
        } else if (duration_ms > 3000) {
            // Long press (3s+): enter BLE provisioning mode
            xEventGroupSetBits(evt, EVT_BUTTON_LONG);
            ble_start_provisioning();
        }
    }
}
```

---

## 9. Session Compression & Upload

```c
void session_task(void *pvParams) {
    // Run once per power cycle at shutdown (before deep sleep)
    while (1) {
        // Wait for shutdown signal or daily trigger (00:00 UTC)
        EventBits_t bits = xEventGroupWaitBits(evt, EVT_SHUTDOWN | EVT_DAILY_SYNC, ...);

        session_buffer_t *buf = session_collect();   // gather all interactions since last save
        uint8_t compressed[512];
        size_t comp_len = zlib_compress(buf->data, buf->len, compressed, sizeof(compressed));

        spiffs_append_session(compressed, comp_len);   // store to external NOR flash

        if (xEventGroupGetBits(evt) & EVT_WIFI_CONNECTED) {
            lot_upload_session_batch();   // POST all pending compressed sessions
        }
        // Sleep until next trigger
        vTaskDelay(pdMS_TO_TICKS(86400000));   // 24h
    }
}
```

---

## 10. OTA Firmware Update

```c
#define OTA_ENDPOINT "https://lot-systems.com/firmware/cosmo-node/latest.bin"
#define OTA_VERSION_ENDPOINT "https://lot-systems.com/firmware/cosmo-node/version.json"

void ota_check_and_update(void) {
    // 1. GET version.json → compare with NVS stored version
    // 2. If newer: GET latest.bin via esp_https_ota
    // 3. Validate SHA-256 signature against lot_systems_ota_signing_key
    // 4. esp_ota_set_boot_partition(new_partition)
    // 5. esp_restart()
    // OTA checks: on boot + every 24h
}
```

**OTA signing key** is bundled in firmware (Elliptic Curve P-256).  
Firmware binaries signed by LOT Systems build pipeline before publish.

---

## 11. Power Management

```c
typedef enum {
    POWER_MODE_ACTIVE,      // WiFi on, display on, polling
    POWER_MODE_IDLE,        // WiFi on, display off (clock only)
    POWER_MODE_LIGHT_SLEEP, // WiFi modem sleep, CPU 40MHz
    POWER_MODE_DEEP_SLEEP,  // WiFi off, RTC timer wake
} power_mode_t;

// Deep sleep trigger: 10 minutes no interaction + no pending notifications
// Wake sources: RTC timer (60s, for notification check), button GPIO

esp_sleep_enable_timer_wakeup(60 * 1000000ULL);   // 60s periodic wake
esp_sleep_enable_ext0_wakeup(PIN_BUTTON, 0);       // button press wake
esp_deep_sleep_start();

// On wake: check notification, display if any, return to deep sleep
// Deep sleep current: ~20 µA (ESP32-S3 RTC domain only)
// Active current: ~85 mA (WiFi TX peak 180 mA)
// Average current (60s poll cycle): ~4 mA
// Battery life: 150 mAh / 4 mA = ~37.5 hours (~2 days active)
//               with 10min sleep windows: 5–7 days
```

---

## 12. Build & Flash

```bash
# Setup
idf.py set-target esp32s3
idf.py menuconfig   # enable PSRAM, set flash size 8MB, enable SPI flash encryption

# Build
idf.py build

# Flash (via USB-C)
idf.py -p /dev/ttyUSB0 flash monitor

# Batch flash (production jig — 10 devices simultaneously)
for port in /dev/ttyUSB{0..9}; do
  idf.py -p $port flash &
done
wait
```

**Factory firmware includes:**
- WiFi credentials: empty (requires BLE provisioning)
- Device ID: programmed via NVS at factory (`COSMO-XXXX` serial)
- Device token: empty (issued after pairing to lot-systems.com)

---

## 13. Firmware File Structure

```
cosmo-firmware/
├── main/
│   ├── main.c               # app_main, task spawn, event groups
│   ├── wifi_manager.c/h     # WiFi connect, BLE provisioning
│   ├── api_client.c/h       # LOT API HTTP + WebSocket client
│   ├── display.c/h          # SSD1327 driver, frame buffer, animations
│   ├── sensor.c/h           # BME688 + BSEC2 integration
│   ├── button.c/h           # Interrupt, debounce, press classification
│   ├── camera.c/h           # OV2640 DVP driver, JPEG capture
│   ├── led.c/h              # WS2812B RMT driver, pulse patterns
│   ├── session.c/h          # Interaction log, zlib compress, SPI flash
│   ├── ota.c/h              # esp_https_ota wrapper, version check
│   ├── nvs_config.c/h       # NVS read/write helpers
│   └── fonts/
│       ├── font_6x8.h
│       ├── font_16pt.h
│       └── font_24pt.h
├── components/
│   ├── bsec2/               # Bosch BSEC2 precompiled library + headers
│   └── certs/
│       ├── lot_systems_ca.pem    # HTTPS root CA
│       └── ota_signing_key.pem   # OTA signature verification
├── partitions.csv
├── sdkconfig
└── CMakeLists.txt
```
