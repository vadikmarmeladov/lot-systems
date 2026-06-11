<!--
  LOT SYSTEMS CORPORATION
  LOT Computer — Firmware Architecture Specification v1.0
  2026-06-11
-->

# LOT Computer — Firmware Architecture Specification
## FIRMWARE-SPEC-v1.0 | 2026-06-11

**Classification:** Internal — Embedded Software
**Platform:** ESP32-S3, ESP-IDF v5.x (FreeRTOS)
**Language:** C / C++ (ESP-IDF native)
**Repository path (future):** `firmware/` (in LOT-Computer repo)

---

## 1. Firmware Overview

The LOT Computer firmware runs on the ESP32-S3 under FreeRTOS. It maintains a persistent Wi-Fi connection to lot-systems.com, subscribes to an SSE notification stream, renders notifications on the OLED, manages sensors, and handles the COPY button event.

### Design Principles

1. **Low power first.** The device spends most time in light sleep. Wake on: SSE data, tap detection (ISM330DHCX INT1), button press.
2. **Offline resilient.** Notifications are stored in NVS ring buffer. The device shows last 20 notifications without network.
3. **Secure by default.** TLS 1.3 for all LOT API connections. Device secret stored in encrypted NVS partition.
4. **OTA capable.** Over-the-air firmware updates from lot-systems.com on user command.

---

## 2. Task Architecture (FreeRTOS)

```
┌────────────────────────────────────────────────────────────────┐
│                        FreeRTOS Tasks                          │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  WiFi Task   │  │  SSE Task    │  │  Display Task        │ │
│  │  Priority: 5 │  │  Priority: 4 │  │  Priority: 3         │ │
│  │  Core: 0     │  │  Core: 0     │  │  Core: 1             │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Sensor Task │  │  Button Task │  │  OTA Task            │ │
│  │  Priority: 2 │  │  Priority: 6 │  │  Priority: 2         │ │
│  │  Core: 1     │  │  Core: 0     │  │  Core: 0             │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Heartbeat Task  |  Priority: 1  |  Core: 1              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Inter-task communication: FreeRTOS queues + event groups      │
└────────────────────────────────────────────────────────────────┘
```

### Task Definitions

| Task | Period | Stack | Purpose |
|------|--------|-------|---------|
| `wifi_task` | Event-driven | 4KB | Wi-Fi connect, reconnect, status |
| `sse_task` | Blocking read | 8KB | SSE stream from LOT API |
| `display_task` | Event-driven | 4KB | OLED render, animations |
| `sensor_task` | 60s interval | 4KB | BME688 + ISM330DHCX read |
| `button_task` | Interrupt-driven | 2KB | COPY button handler |
| `ota_task` | On-demand | 8KB | Firmware update |
| `heartbeat_task` | 5min interval | 2KB | Uptime + device telemetry |

---

## 3. Module Breakdown

### 3.1 `main.c` — Entry Point

```c
// main.c — LOT Computer firmware entry
// Initializes NVS, peripherals, tasks

void app_main(void) {
    // 1. Initialize NVS encrypted partition
    nvs_flash_init_encrypted();
    
    // 2. Load device config from NVS
    lot_config_load();
    
    // 3. Initialize I2C bus (sensors + OLED)
    i2c_master_init();
    
    // 4. Initialize SPI bus (unused in v1, reserved)
    
    // 5. Initialize display
    ssd1306_init();
    display_show_splash();  // LOT® logo on boot
    
    // 6. Initialize sensors
    bme688_init();
    ism330_init();          // Configure tap interrupt → GPIO
    
    // 7. Initialize camera DVP
    ov2640_init();
    
    // 8. Initialize button
    button_init();
    
    // 9. Initialize LED
    led_init();
    
    // 10. Initialize Qi charging monitor (I2C → STWLC38)
    qi_init();
    
    // 11. Start tasks
    xTaskCreatePinnedToCore(wifi_task,      "wifi",      4096, NULL, 5, NULL, 0);
    xTaskCreatePinnedToCore(sse_task,       "sse",       8192, NULL, 4, NULL, 0);
    xTaskCreatePinnedToCore(display_task,   "display",   4096, NULL, 3, NULL, 1);
    xTaskCreatePinnedToCore(sensor_task,    "sensor",    4096, NULL, 2, NULL, 1);
    xTaskCreatePinnedToCore(button_task,    "button",    2048, NULL, 6, NULL, 0);
    xTaskCreatePinnedToCore(heartbeat_task, "heartbeat", 2048, NULL, 1, NULL, 1);
}
```

---

### 3.2 `wifi.c` — Wi-Fi Management

```c
// wifi.c
// Manages: connect, reconnect with exponential backoff, status events

// Credentials stored in NVS encrypted partition, loaded at boot
// Supports: WPA2, WPA3

typedef enum {
    WIFI_STATE_DISCONNECTED,
    WIFI_STATE_CONNECTING,
    WIFI_STATE_CONNECTED,
    WIFI_STATE_FAILED
} wifi_state_t;

// Public API
void wifi_init(void);
wifi_state_t wifi_get_state(void);
bool wifi_wait_connected(uint32_t timeout_ms);
void wifi_provision_credentials(const char* ssid, const char* password);

// Internal reconnect backoff: 2s, 4s, 8s, 16s, 32s (max)
// After 5 failures: enter BLE provisioning mode for new credentials
```

**Wi-Fi Provisioning (first-run):**
On first boot or factory reset, if no Wi-Fi credentials in NVS:
1. Start BLE advertising with name `LOT-XXXX` (last 4 of serial)
2. Display shows: "Open LOT app → Devices → Add LOT Computer"
3. LOT app sends credentials over BLE Secure Connection
4. Device connects, confirms, stores encrypted

---

### 3.3 `lot_api.c` — LOT API Connector

```c
// lot_api.c
// All HTTP/HTTPS communication with lot-systems.com

#define LOT_API_BASE  "https://lot-systems.com"
#define LOT_SSE_PATH  "/api/device/notifications"
#define LOT_LOG_PATH  "/api/device/log"
#define LOT_TELEM_PATH "/api/device/telemetry"

// Device authentication header
// Authorization: Bearer <device_secret>
// X-Device-ID: LCM-001-XXXX

typedef struct {
    char device_id[32];
    char device_secret[64];  // Stored in encrypted NVS
    char user_id[32];        // Paired user
} lot_device_config_t;

// Open SSE stream — blocking function, called from sse_task
esp_err_t lot_sse_open(lot_sse_callback_t callback);

// Post notification to Log tab (COPY button action)
esp_err_t lot_post_log(const lot_notification_t* notif, 
                        const sensor_snapshot_t* sensors);

// Post sensor telemetry (every 5 minutes from heartbeat_task)
esp_err_t lot_post_telemetry(const sensor_snapshot_t* sensors,
                              const device_health_t* health);

// Register device (first boot, or re-register)
esp_err_t lot_register_device(const char* activation_code);
```

**TLS Configuration:**
```c
// Use Espressif's mbedTLS (built into ESP-IDF)
// Pin LOT Systems root CA certificate
// Certificate bundled in firmware flash (SPIFFS)
// Update certificate bundle via OTA

extern const uint8_t lot_root_ca_pem_start[] asm("_binary_lot_ca_pem_start");
extern const uint8_t lot_root_ca_pem_end[]   asm("_binary_lot_ca_pem_end");
```

---

### 3.4 `sse.c` — SSE Stream Handler

```c
// sse.c
// Parses Server-Sent Events from lot-systems.com
// Format: "data: {json}\n\n"

typedef struct {
    char id[32];
    char type[32];           // reminder | insight | weather | system
    char headline[128];
    char subtext[128];
    char icon[16];
    uint8_t priority;
    uint32_t ttl;
    int64_t created_at;
} lot_notification_t;

// Notification ring buffer in NVS (20 entries, GZIP compressed)
#define NOTIF_BUFFER_SIZE 20

void sse_parse_event(const char* raw_data, lot_notification_t* out);
void sse_store_notification(const lot_notification_t* notif);
lot_notification_t* sse_get_current(void);
lot_notification_t* sse_get_at_index(uint8_t index);
uint8_t sse_get_count(void);
```

**SSE Reconnect Logic:**
```
On disconnect:
  1. Wait 2s
  2. Retry SSE open
  3. If fail: wait 4s → 8s → 16s (cap at 30s)
  4. Wake LED: red flash pattern
  5. On reconnect: LED: 1× green flash
```

---

### 3.5 `display.c` — OLED Renderer

```c
// display.c
// Driver for SSD1306 1.3" OLED (128×64) via I2C
// Font: u8g2 library (https://github.com/olikraus/u8g2)

// Fonts used:
//   u8g2_font_6x10_tf   → body text (128÷6 = ~21 chars/line)
//   u8g2_font_10x20_tf  → headline (128÷10 = ~12 chars/line)
//   u8g2_font_open_iconic_all_2x_t → icons

// Screen regions:
//   Line 1 (y=0–18):  Icon + Headline
//   Line 2 (y=18–28): Timestamp
//   Line 3 (y=28–44): Subtext (2 lines, wrapping)
//   Line 4 (y=44–52): Separator line
//   Line 5 (y=52–64): Navigation + status

void display_show_notification(const lot_notification_t* notif);
void display_show_splash(void);           // LOT® logo on boot (2s)
void display_show_connecting(void);       // Animated dots
void display_show_charging(uint8_t pct);  // Battery + Qi animation
void display_dim(void);                   // 30% brightness
void display_off(void);                   // Sleep, <10μA
void display_on(void);                    // Full brightness

// Scroll animation for long text (128px, 6px/tick)
void display_scroll_text(const char* text, uint8_t y, uint16_t delay_ms);

// Auto-off timer: 30s after last interaction
// Wake triggers: tap (ISM330DHCX INT1), button press, new notification
```

---

### 3.6 `sensors.c` — Environmental & Motion

```c
// sensors.c
// BME688 via I2C + Bosch BSEC library
// ISM330DHCX via I2C

typedef struct {
    float temperature;        // °C, ±0.5°C
    float humidity;           // %RH, ±3%
    float pressure;           // hPa, ±0.6hPa
    float iaq;                // Indoor Air Quality 0–500 (BSEC)
    float iaq_accuracy;       // 0=unreliable, 3=calibrated
    float voc_equivalent;     // ppm
    float co2_equivalent;     // ppm
    float accel_x, accel_y, accel_z;  // m/s²
    float gyro_x, gyro_y, gyro_z;     // dps
    int64_t timestamp;        // Unix ms
} sensor_snapshot_t;

// BME688 initialization with BSEC library
esp_err_t bme688_init(void);
esp_err_t bme688_read(sensor_snapshot_t* out);

// ISM330DHCX initialization + tap config
esp_err_t ism330_init(void);
esp_err_t ism330_read(sensor_snapshot_t* out);
void ism330_configure_tap_interrupt(uint8_t threshold, uint8_t duration);
// Tap interrupt → GPIO34 → button_task wakes display
```

**BSEC Integration:**
```c
// Bosch BSEC library (binary + header, licensed)
// Download: https://www.bosch-sensortec.com/software-tools/software/bme688-software/
// Include path: components/bsec/include/
// Library: components/bsec/lib/libalgobsec.a (ESP32-S3 build)

// BSEC state saved to NVS every 6h (calibration persistence)
```

---

### 3.7 `button.c` — COPY Button Handler

```c
// button.c
// GPIO interrupt on COPY button press
// Connected to: GPIO21 (configurable)

typedef enum {
    BUTTON_EVENT_NONE,
    BUTTON_EVENT_SINGLE,    // <500ms: COPY notification
    BUTTON_EVENT_DOUBLE,    // 2× in 500ms: next notification
    BUTTON_EVENT_LONG,      // >2000ms: enter pairing mode
    BUTTON_EVENT_VERY_LONG  // >5000ms: factory reset
} button_event_t;

void button_init(void);
void button_register_callback(button_event_t event, button_cb_t cb);

// On SINGLE press:
static void on_copy_pressed(void) {
    lot_notification_t* current = sse_get_current();
    if (current == NULL) return;
    
    sensor_snapshot_t sensors;
    sensors_read_quick(&sensors);
    
    led_set(LED_PATTERN_SENDING);
    
    esp_err_t ret = lot_post_log(current, &sensors);
    if (ret == ESP_OK) {
        led_set(LED_PATTERN_SUCCESS);  // 2× green flash
    } else {
        led_set(LED_PATTERN_ERROR);    // 2× red flash
    }
}
```

---

### 3.8 `ota.c` — Over-the-Air Updates

```c
// ota.c
// OTA firmware update from lot-systems.com
// Triggered by: SSE notification of type "system" + subtype "ota"

#define OTA_URL  "https://lot-systems.com/api/device/firmware/latest"

// ESP-IDF native OTA via esp_https_ota
// Dual partition: ota_0 + ota_1 (alternating active)
// Rollback on boot failure (3 failed boots → revert)

esp_err_t ota_check_update(char* version_out);
esp_err_t ota_perform_update(const char* url);

// OTA flow:
// 1. SSE delivers {"type":"system","subtype":"ota","version":"1.2.0","url":"..."}
// 2. ota_task starts
// 3. Display shows: "Updating firmware v1.2.0"
// 4. LED: rapid green breathing
// 5. Download + verify SHA256
// 6. Reboot to new partition
// 7. If boot OK: confirm partition, send telemetry
// 8. If boot fail: rollback, send error telemetry
```

---

### 3.9 `nvs_storage.c` — Encrypted Non-Volatile Storage

```c
// nvs_storage.c
// Manages all persistent data on ESP32-S3 NVS flash

// Namespaces:
//   "config"   → device_id, device_secret, user_id, wifi_ssid, wifi_pass
//   "notifs"   → notification ring buffer (20 slots, gzip compressed)
//   "bsec"     → BSEC calibration state (BME688)
//   "counters" → boot_count, copy_count, ota_count

// All "config" namespace stored in encrypted NVS partition
// Key: derived from ESP32-S3 eFuse device key (unique per chip)

esp_err_t nvs_save_config(const lot_device_config_t* cfg);
esp_err_t nvs_load_config(lot_device_config_t* cfg);
esp_err_t nvs_save_notification(uint8_t slot, const lot_notification_t* notif);
esp_err_t nvs_load_notification(uint8_t slot, lot_notification_t* notif);
esp_err_t nvs_save_bsec_state(const uint8_t* state, uint32_t len);
esp_err_t nvs_load_bsec_state(uint8_t* state, uint32_t* len);
```

---

### 3.10 `session_compress.c` — Session Compression

```c
// session_compress.c
// Compresses notification + sensor data for efficient NVS storage
// Algorithm: DEFLATE (zlib) — available in ESP-IDF as miniz

typedef struct {
    uint8_t compressed_data[512];   // Max 512 bytes per session slot
    uint32_t compressed_len;
    uint32_t original_len;
    uint8_t compression_ratio;      // original/compressed × 10
    int64_t timestamp;
} compressed_session_t;

// Compress a notification + sensor snapshot into one slot
esp_err_t session_compress(const lot_notification_t* notif, 
                            const sensor_snapshot_t* sensors,
                            compressed_session_t* out);

// Decompress for display or upload
esp_err_t session_decompress(const compressed_session_t* in,
                              lot_notification_t* notif,
                              sensor_snapshot_t* sensors);

// Typical compression ratio: 3:1 to 5:1 for JSON notification data
// 20 sessions × 512 bytes = 10KB NVS — well within ESP32 limits
```

---

## 4. Power Management

### 4.1 Power States

| State | Current | Duration |
|-------|---------|---------|
| Active (Wi-Fi + OLED on) | ~85mA | On demand |
| Wi-Fi idle (OLED off) | ~15mA | Between SSE events |
| Light sleep (modem off, tap wake) | ~0.8mA | Between events |
| Deep sleep (Wi-Fi off, RTC wake) | ~80μA | Night mode (midnight–6am) |
| Charging via Qi | Up to 500mA | While on pad |

### 4.2 Battery Life Estimates (320mAh)

| Usage Pattern | Estimated Battery Life |
|---------------|----------------------|
| Light (2h active/day) | ~5 days |
| Moderate (4h active/day) | ~3 days |
| Heavy (continuous Wi-Fi) | ~8 hours |
| Night mode (deep sleep 8h) | Extends all estimates by ~25% |

### 4.3 Charging Behavior

- Qi charging: STWLC38 handles CC/CV profile
- USB-C charging: MCP73831 at 500mA
- Charge complete: LED solid green
- Low battery (<10%): LED slow red flash; SSE paused to conserve power

---

## 5. Build System

### 5.1 ESP-IDF Setup

```bash
# Install ESP-IDF v5.2
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf && git checkout v5.2.0
./install.sh esp32s3
source export.sh

# Clone firmware repo
git clone https://github.com/lot-systems/lot-computer-firmware
cd lot-computer-firmware

# Configure target
idf.py set-target esp32s3

# Configure (menu)
idf.py menuconfig
# → Component config → LOT Computer → Enter device credentials

# Build
idf.py build

# Flash (USB-C)
idf.py -p /dev/ttyUSB0 flash monitor
```

### 5.2 Project Structure

```
firmware/
├── main/
│   ├── main.c
│   ├── wifi.c / wifi.h
│   ├── lot_api.c / lot_api.h
│   ├── sse.c / sse.h
│   ├── display.c / display.h
│   ├── sensors.c / sensors.h
│   ├── button.c / button.h
│   ├── ota.c / ota.h
│   ├── nvs_storage.c / nvs_storage.h
│   ├── session_compress.c / session_compress.h
│   ├── led.c / led.h
│   ├── qi_charger.c / qi_charger.h
│   └── CMakeLists.txt
├── components/
│   ├── u8g2/        ← OLED font/graphics library
│   ├── bsec/        ← Bosch BSEC (BME688 AI library, binary)
│   └── miniz/       ← DEFLATE compression
├── certs/
│   └── lot_root_ca.pem   ← TLS certificate
├── partition_table.csv   ← Custom partition layout
├── sdkconfig.defaults    ← Default config values
├── CMakeLists.txt
└── README.md
```

### 5.3 Partition Table

```csv
# Name,       Type, SubType, Offset,  Size,    Flags
nvs,          data, nvs,     0x9000,  0x6000,
nvs_keys,     data, nvs_keys,0xF000,  0x1000,
ota_data,     data, ota,     0x10000, 0x2000,
phy_init,     data, phy,     0x12000, 0x1000,
factory,      app,  factory, 0x20000, 0x180000,
ota_0,        app,  ota_0,   0x1A0000,0x180000,
ota_1,        app,  ota_1,   0x320000,0x180000,
storage,      data, spiffs,  0x4A0000,0x100000,  ← Certs + assets
```

---

## 6. Security Model

| Concern | Mitigation |
|---------|-----------|
| Device secret storage | ESP32-S3 encrypted NVS, key from eFuse |
| TLS certificate | Pinned root CA cert in firmware |
| Wi-Fi credentials | Encrypted NVS partition |
| BLE provisioning | Secure Connection (ECDH pairing) |
| OTA binary | SHA256 verification before flash |
| JTAG/UART | Disabled in production (eFuse burn) |
| Factory reset | Requires 5s button hold — clears all NVS |

---

## 7. Firmware Version Strategy

| Version | Feature Set |
|---------|-------------|
| v0.1.0 | Boot, Wi-Fi, OLED splash, basic SSE |
| v0.2.0 | Notification display, COPY button, LED feedback |
| v0.3.0 | BME688 sensor read + telemetry upload |
| v0.4.0 | ISM330DHCX tap-wake + IMU data |
| v0.5.0 | OTA update system |
| v0.6.0 | Camera capture + upload |
| v0.7.0 | Session compression + NVS ring buffer |
| v0.8.0 | BLE provisioning + pairing mode |
| v0.9.0 | Night mode + deep sleep |
| **v1.0.0** | **Production release — all features** |

---

*LOT COMPUTER FIRMWARE SPEC v1.0 — COMPLETE*
*© 2026 LOT Systems. All rights reserved.*
