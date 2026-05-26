# COSMO LOT Computer — Firmware Guide
## ESP-IDF v5.2 Firmware Architecture & Developer Reference

**Device:** COSMO® CIA LOT Computer  
**MCU:** ESP32-S3-MINI-1U  
**SDK:** ESP-IDF v5.2  
**Firmware Version:** 1.0  
**Date:** 2026-05-26

---

## 1. Repository Structure

```
firmware/
├── CMakeLists.txt
├── sdkconfig.defaults
├── main/
│   ├── CMakeLists.txt
│   ├── main.c                   — Entry point, app_main()
│   ├── Kconfig.projbuild        — Build-time config menu
│   └── modules/
│       ├── wifi_manager/        — Wi-Fi connection + reconnect
│       ├── lot_api_client/      — REST client for lot-systems.com
│       ├── notification_engine/ — Display queue + render
│       ├── sensor_hub/          — BME688 + VEML7700 + BMI270 + mic
│       ├── button_handler/      — Copy button + haptic
│       ├── camera_driver/       — OV2640 capture + QR scan
│       ├── ota_updater/         — HTTPS OTA from lot-systems.com
│       ├── power_manager/       — Sleep/wake, battery monitoring
│       ├── session_log/         — Session compression + upload
│       └── display_driver/      — SSD1327 OLED rendering
├── components/
│   ├── ssd1327/                 — OLED driver (custom)
│   ├── bme688/                  — Bosch BSEC2 library wrapper
│   ├── bmi270/                  — Bosch BMI270 driver
│   ├── drv2605l/                — Haptic driver I2C
│   ├── veml7700/                — Ambient light I2C
│   └── qr_scanner/              — Quirc QR decode library
├── tools/
│   ├── flash_jig.py             — Batch flash script for 100-unit run
│   └── provision.py             — Assign deviceId + burn to NVS
└── docs/
    └── (links to this file)
```

---

## 2. Build & Flash

### Prerequisites

```bash
# Install ESP-IDF v5.2
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf && git checkout v5.2 && ./install.sh esp32s3
source export.sh

# Clone firmware repo
git clone https://github.com/lot-systems/lot-computer-firmware.git
cd lot-computer-firmware
```

### Build

```bash
idf.py set-target esp32s3
idf.py menuconfig     # Set Wi-Fi SSID/pass, LOT API URL, device ID
idf.py build
```

### Flash (single device)

```bash
idf.py -p /dev/ttyUSB0 flash monitor
```

### Batch Flash (100 units via jig)

```bash
cd tools/
python flash_jig.py \
  --firmware ../build/lot_computer.bin \
  --start-id 1 \
  --count 100 \
  --port-prefix /dev/ttyUSB
```

---

## 3. Module Reference

### 3.1 `wifi_manager`

Manages Wi-Fi connection lifecycle.

```c
// Initialize and connect
wifi_manager_init();
wifi_manager_connect(ssid, password);

// Event callbacks
void on_wifi_connected(ip_addr_t ip);
void on_wifi_disconnected(int reason);
```

**Behavior:**
- Auto-reconnect on disconnect (exponential backoff: 2s, 4s, 8s, 16s, 30s max)
- Credentials stored in NVS (encrypted partition)
- Provisioning mode: AP "COSMO-XXXX" + QR scan via camera
- Power: reduces TX power to 12 dBm (sufficient for home Wi-Fi, saves 30 mW)

**Key config (sdkconfig):**
```
CONFIG_WIFI_MAX_RECONNECT_ATTEMPTS=20
CONFIG_WIFI_TX_POWER=48    # 12 dBm
CONFIG_WIFI_PS_MODE=WIFI_PS_MIN_MODEM
```

---

### 3.2 `lot_api_client`

REST client for lot-systems.com hardware API. Uses `esp_http_client`.

```c
// Initialize with device credentials
lot_api_init(device_id, jwt_token, api_base_url);

// Poll for notifications
lot_notification_t notifications[10];
int count = lot_api_get_notifications(notifications, 10);

// Send Copy button event
lot_api_send_event("copy_button_press", notification_id, &sensor_snapshot);

// Acknowledge notification
lot_api_ack_notification(notification_id);

// Refresh JWT (called automatically on 401)
lot_api_refresh_token();
```

**Authentication:**
- Device JWT stored in NVS encrypted partition
- JWT lifetime: 30 days; auto-refresh 7 days before expiry
- All requests: `Authorization: Bearer <jwt>` header
- TLS: Root CA cert for lot-systems.com bundled in firmware

**Polling:**
- Default interval: 30 seconds (configurable via `/api/hardware/config`)
- Server-Sent Events (SSE) upgrades available in FW v1.1 for instant push

**Error handling:**
- HTTP 401 → refresh token, retry once
- HTTP 429 → back off 5 minutes
- HTTP 5xx → retry with exponential backoff
- Network failure → queue events locally, upload on reconnect

---

### 3.3 `notification_engine`

Manages the notification display queue and renders to the OLED.

```c
// Add notification to queue
notif_engine_push(&notification);

// Process queue (called from main loop)
notif_engine_tick();

// Force-display notification now
notif_engine_display_now(&notification);
```

**Display Layout (128×128 OLED):**

```
┌──────────────────────────────┐
│  [LOT icon, 16×16]           │  y: 8px
│                              │
│  Coffee time!                │  y: 32px (large font, 16px)
│                              │
│  ─────────────────────       │  y: 56px (divider)
│                              │
│  11:42 AM                    │  y: 72px (small font, 8px)
│  22°C · 48% RH               │  y: 84px
│                              │
│  [▶ Copy]                    │  y: 108px (button hint)
└──────────────────────────────┘
```

**Notification types + icons:**

| type | Icon | Description |
|---|---|---|
| `reminder` | ☕ cup | User-defined reminder ("Coffee time!") |
| `memory` | ◈ diamond | Memory Engine question prompt |
| `insight` | ◉ dot | New pattern insight detected |
| `weather` | ◌ circle | Weather change alert |
| `system` | ▣ square | System status (low battery, etc.) |

**Queue behavior:**
- Max 20 queued notifications (circular buffer)
- Display each notification for 10 seconds, then cycle
- Copy button dismisses current + logs the event

---

### 3.4 `sensor_hub`

Reads and fuses all sensor data.

```c
// Initialize all sensors on I2C bus 0
sensor_hub_init(I2C_NUM_0, SDA_PIN, SCL_PIN);

// Read current snapshot (call every 60 seconds in normal mode)
sensor_snapshot_t snap;
sensor_hub_read(&snap);
```

**`sensor_snapshot_t` structure:**

```c
typedef struct {
    float temperature;     // °C, BME688
    float humidity;        // % RH, BME688
    float pressure;        // hPa, BME688
    uint16_t gas_index;    // VOC IAQ index 0–500, BME688 + BSEC2
    uint16_t lux;          // ambient light, VEML7700
    int16_t accel[3];      // mg, BMI270
    int16_t gyro[3];       // dps × 100, BMI270
    uint32_t steps;        // daily step count, BMI270
    uint8_t battery_pct;   // 0–100%, from BQ25185 fuel gauge
    bool charging;         // true if on Qi pad
    uint32_t timestamp;    // Unix epoch
} sensor_snapshot_t;
```

**BSEC2 (Bosch AI) integration:**
- Bosch BSEC2 library runs on ESP32-S3 — classifies air quality index in real time
- IAQ 0–50: Excellent  
- IAQ 51–100: Good  
- IAQ 101–150: Moderate  
- IAQ 151–200: Poor  
- IAQ > 200: Very Poor  
- BSEC2 state saved to NVS every 6 hours (persists calibration across reboots)

---

### 3.5 `button_handler`

Handles the Copy button press with debounce and haptic feedback.

```c
// Initialize button on GPIO pin
button_handler_init(BUTTON_PIN);

// Register callback
button_handler_on_press(on_copy_button_pressed);
```

```c
static void on_copy_button_pressed(void) {
    // 1. Trigger haptic feedback (80ms buzz)
    drv2605l_play(WAVEFORM_STRONG_BUZZ_80MS);
    
    // 2. Get current displayed notification ID
    char *notif_id = notif_engine_get_current_id();
    
    // 3. Read sensor snapshot
    sensor_snapshot_t snap;
    sensor_hub_read(&snap);
    
    // 4. POST to LOT API
    lot_api_send_event("copy_button_press", notif_id, &snap);
    
    // 5. Visual feedback: flash screen white briefly
    display_flash_white(150);
    
    // 6. Dismiss current notification
    notif_engine_dismiss_current();
}
```

**Debounce:** 50 ms hardware debounce via RC filter + 20 ms software debounce  
**Long press (3s):** Enters provisioning mode (displays QR for device pairing)

---

### 3.6 `camera_driver`

OV2640 camera for provisioning QR scan.

```c
// Initialize OV2640 on DVP bus
camera_driver_init();

// Capture JPEG to buffer
uint8_t *jpeg_buf;
size_t jpeg_len;
camera_capture_jpeg(&jpeg_buf, &jpeg_len);

// Scan QR code from camera (returns decoded string)
char qr_result[256];
camera_scan_qr(qr_result, sizeof(qr_result));
```

**QR provisioning flow:**
1. User presses button 3s → device enters provisioning mode
2. OLED shows "Point at QR code"
3. LOT site (Settings → Hardware) generates QR containing: `{ssid, password, deviceToken, deviceName}`
4. Camera scans and decodes QR
5. Device stores credentials in NVS, connects to Wi-Fi, registers with LOT API
6. OLED shows "Connected. Welcome, [Name]!"

---

### 3.7 `ota_updater`

Over-the-air firmware update via HTTPS.

```c
// Check for update (called once per day)
ota_check_and_update("https://lot-systems.com/api/hardware/firmware/latest");
```

**Update process:**
1. GET `/api/hardware/firmware/latest` → returns `{version, url, sha256}`
2. If version > current: download binary from signed URL
3. Verify SHA-256 of downloaded binary
4. Write to OTA partition (ESP32-S3 has 2 OTA partitions)
5. Set boot partition to new OTA slot
6. Restart device
7. On successful boot: mark OTA slot as valid
8. On failed boot (3 attempts): rollback to previous partition

**Security:** Firmware binaries signed with RSA-2048 private key (LOT Systems); public key embedded in firmware.

---

### 3.8 `power_manager`

Manages ESP32-S3 sleep/wake cycles for battery efficiency.

```c
// Initialize power manager
power_manager_init();

// Enter light sleep (wake on timer or GPIO)
power_manager_light_sleep_ms(5000);

// Enter deep sleep (wake on timer only)
power_manager_deep_sleep_s(30);
```

**Power modes:**

| Mode | Current | Wake trigger | Use case |
|---|---|---|---|
| Active (Wi-Fi TX) | ~160 mA | — | Notification poll, OTA |
| Active (display on) | ~25 mA | — | Showing notification |
| Light sleep | ~2 mA | GPIO (button, IMU tap) | Between polls |
| Deep sleep | ~50 µA | Timer (30s), GPIO | Extended idle |

**Battery life calculation:**
- Active cycle (30s poll): 1s active @ 160mA + 29s light sleep @ 2mA = avg 7.3mA
- Standby mode: 50µA deep sleep (notification check via SSE in FW v1.1)
- 380mAh / 7.3mA = ~52h with 30s polling  
- 380mAh / 2.5mA (optimized, SSE) = ~152h = ~6 days

---

### 3.9 `session_log`

Compresses and uploads session data.

```c
// Called on power-off or daily
session_log_compress_and_upload();
```

Session compression algorithm:
1. Aggregate all sensor readings since last upload
2. Compute min/max/avg for each metric
3. Count events: notifications received, button presses
4. Build JSON payload (< 1 KB)
5. POST to `/api/hardware/session`
6. On success: clear local session buffer
7. On failure: retain in NVS flash (up to 7 days of buffered sessions)

---

## 4. GPIO Pin Map

| GPIO | Function | Direction |
|---|---|---|
| 4 | OLED SPI CLK | OUT |
| 5 | OLED SPI MOSI | OUT |
| 6 | OLED CS | OUT |
| 7 | OLED DC | OUT |
| 8 | OLED RESET | OUT |
| 9 | Camera XCLK | OUT |
| 10 | Camera PCLK | IN |
| 11 | Camera VSYNC | IN |
| 12 | Camera HREF | IN |
| 13–20 | Camera D0–D7 (DVP) | IN |
| 21 | Camera SDA (I2C config) | I/O |
| 22 | Camera SCL | I/O |
| 35 | I2C SDA (sensors) | I/O |
| 36 | I2C SCL (sensors) | I/O |
| 37 | BMI270 INT1 (wake-on-tap) | IN |
| 38 | Copy button | IN |
| 39 | Haptic motor (DRV2605L trigger) | OUT |
| 40 | RGB LED Red | OUT |
| 41 | RGB LED Green | OUT |
| 42 | RGB LED Blue | OUT |
| 43 | USB D+ (JTAG/USB) | I/O |
| 44 | USB D- (JTAG/USB) | I/O |
| 45 | Battery ADC (voltage sense) | IN |
| 46 | Charge status from BQ25185 | IN |

---

## 5. NVS Partition Layout

```
nvs_partition (16KB)
├── wifi/
│   ├── ssid           (string)
│   └── password       (string, encrypted)
├── device/
│   ├── device_id      (string, e.g. "cosmo_001")
│   ├── jwt_token      (string, encrypted)
│   └── api_base_url   (string)
├── bsec/
│   └── state_blob     (blob, BSEC2 calibration)
└── session/
    └── pending_data   (blob, compressed sessions not yet uploaded)
```

---

## 6. Partition Table

```
# Name,     Type,  SubType,  Offset,  Size
nvs,        data,  nvs,      0x9000,  0x6000
otadata,    data,  ota,      0xF000,  0x2000
ota_0,      app,   ota_0,    0x10000, 0x1E0000
ota_1,      app,   ota_1,    0x1F0000,0x1E0000
storage,    data,  spiffs,   0x3D0000,0x30000
```

---

## 7. Firmware Release Process

1. Tag release: `git tag fw-v1.0.3 && git push --tags`
2. Build signed binary: `idf.py build && python tools/sign_firmware.py`
3. Upload to LOT CDN: `aws s3 cp build/lot_computer.bin s3://lot-firmware/v1.0.3/`
4. Update firmware manifest: `POST /api/hardware/firmware/manifest` with version + SHA-256
5. Devices self-update within 24 hours on next daily OTA check

---

*COSMO® CIA — LOT Systems — Firmware Guide v1.0 — 2026-05-26*
