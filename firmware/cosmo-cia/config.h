#pragma once

// ─── COSMO CIA Firmware — Configuration Header ────────────────────────────────
// Hardware: ESP32-S3-MINI-1-N8
// Version:  1.0.0

// ── Firmware version ──────────────────────────────────────────────────────────
#define FIRMWARE_VERSION      "1.0.0"
#define DEVICE_MODEL          "COSMO-CIA-v1"

// ── LOT API ───────────────────────────────────────────────────────────────────
#define LOT_SERVER_URL        "https://lot-systems.com"
#define API_BASE              "/api/device"
#define API_PING              "/api/device/ping"
#define API_NOTIFICATIONS     "/api/device/notifications"
#define API_NOTIFICATIONS_ACK "/api/device/notifications/ack"
#define API_EVENT             "/api/device/event"
#define API_SENSOR            "/api/device/sensor"

// ── Poll & upload intervals (milliseconds) ────────────────────────────────────
#define NOTIFICATION_POLL_MS  30000UL    // 30 seconds
#define SENSOR_UPLOAD_MS      300000UL   // 5 minutes
#define HEARTBEAT_MS          600000UL   // 10 minutes
#define BSEC_SAMPLE_RATE      BSEC_SAMPLE_RATE_LP  // 3-second BSEC2 sample

// ── WiFi ──────────────────────────────────────────────────────────────────────
#define WIFI_CONNECT_TIMEOUT  15000UL    // 15s connection timeout
#define WIFI_AP_NAME          "COSMO-CIA-Setup"
#define WIFI_AP_PASS          "lotsystems"  // captive portal password (not security critical)
#define WIFI_AP_TIMEOUT       300          // portal auto-close after 5 min of inactivity

// ── NVS keys (Non-Volatile Storage) ──────────────────────────────────────────
#define NVS_NAMESPACE         "cosmo"
#define NVS_API_TOKEN         "api_token"
#define NVS_SERVER_URL        "server_url"
#define NVS_DEVICE_SERIAL     "device_serial"
#define NVS_BSEC_STATE        "bsec_state"
#define NVS_BSEC_TIMESTAMP    "bsec_ts"

// ── GPIO Pin Map ──────────────────────────────────────────────────────────────
// E-paper display (SPI)
#define DISP_CS               10
#define DISP_DC               9
#define DISP_RST              8
#define DISP_BUSY             7
#define SPI_SCK               12
#define SPI_MOSI              11
// (MISO not needed for write-only e-paper)

// Camera (DVP)
#define CAM_SIOC              37  // SCCB clock
#define CAM_SIOD              38  // SCCB data
#define CAM_VSYNC             6
#define CAM_HREF              5
#define CAM_PCLK              13
#define CAM_XCLK              14
#define CAM_D0                15
#define CAM_D1                16
#define CAM_D2                17
#define CAM_D3                18
#define CAM_D4                39
#define CAM_D5                40  // shared I2C bus on alt config — adjust if conflict
#define CAM_D6                41
#define CAM_D7                42

// Sensors & power (I2C — shared bus)
#define I2C_SDA               41
#define I2C_SCL               40
#define BME688_ADDR           0x76  // SDO pin = GND
#define MAX17048_ADDR         0x36  // fixed address
#define STWLC68_ADDR          0x61  // fixed address

// User interface
#define BTN_COPY              0   // active low, internal pull-up
#define LED_CHG               2   // active high, charge indicator

// USB (native ESP32-S3 USB OTG)
// USB_D+  = GPIO 19  (hardware fixed)
// USB_D-  = GPIO 20  (hardware fixed)

// ── Display layout (pixels) ───────────────────────────────────────────────────
#define DISPLAY_WIDTH         200
#define DISPLAY_HEIGHT        200
#define STATUS_BAR_HEIGHT     20
#define FOOTER_BAR_HEIGHT     20
#define NOTIFICATION_AREA_Y   (STATUS_BAR_HEIGHT + 4)
#define NOTIFICATION_AREA_H   (DISPLAY_HEIGHT - STATUS_BAR_HEIGHT - FOOTER_BAR_HEIGHT - 8)

// ── Copy button gesture timings ───────────────────────────────────────────────
#define BTN_HOLD_MS           3000   // 3s hold = camera capture
#define BTN_CLICK_MS          50     // debounce

// ── Power management ─────────────────────────────────────────────────────────
#define LIGHT_SLEEP_DURATION_MS  25000UL  // sleep between notification polls
#define DEEP_SLEEP_AFTER_MS      1800000UL // enter deep sleep after 30 min of no activity
#define BATT_LOW_THRESHOLD       15  // % — show low battery notification
#define BATT_CRITICAL_THRESHOLD  5   // % — enter deep sleep

// ── OTA ───────────────────────────────────────────────────────────────────────
#define OTA_CHECK_URL         "/api/device/ota/check"
#define OTA_MIN_BATT_LEVEL    25  // % — don't OTA below this battery level

// ── BSEC2 state save interval ─────────────────────────────────────────────────
#define BSEC_STATE_SAVE_MS    21600000UL  // save every 6 hours

// ── TLS certificate (ISRG Root X1 — Let's Encrypt) ───────────────────────────
// Bundle is embedded via ESP-IDF's esp_crt_bundle_attach()
// No manual cert needed when using Arduino ESP32 HTTPClient with setCACertBundle()
