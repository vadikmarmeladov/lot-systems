<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO·01 — Firmware Documentation

**Document:** COSMO-CIA-FIRMWARE.md  
**Revision:** v1.0  
**Date:** 2026-06-10  
**Target Platform:** ESP32-S3 (Arduino + ESP-IDF)  
**Firmware Repository:** `firmware/` directory in this repo

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    COSMO·01 Firmware v1.0                      │
├──────────────┬──────────────┬─────────────┬────────────────────┤
│  WiFi/Net    │  Display     │  Sensors    │  Button            │
│  Manager     │  Manager     │  Manager    │  Handler           │
│              │              │             │                    │
│  - WPA2/3    │  - OLED SPI  │  - BME280   │  - Short press     │
│  - WebSocket │  - Font mgr  │  - OV2640   │  - Long press      │
│  - OTA       │  - Anim      │  - Battery  │  - Debounce        │
│  - NTP       │  - Sleep     │  - Temp     │  - ISR             │
└──────┬───────┴──────┬───────┴──────┬──────┴────────┬───────────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Core State       │
                    │   Machine          │
                    │                   │
                    │   IDLE            │
                    │   NOTIF_RECV      │
                    │   COPY_ACTION     │
                    │   SETUP_MODE      │
                    │   OTA_UPDATE      │
                    │   DEEP_SLEEP      │
                    └───────────────────┘
```

---

## 2. Development Environment

### 2.1 Prerequisites

```bash
# Install ESP-IDF v5.1+ (includes Arduino-ESP32 support)
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf && ./install.sh esp32s3

# Or use Arduino IDE 2.x with ESP32 board package:
# Boards Manager URL: https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
# Install: esp32 by Espressif Systems v2.0.14+

# Additional libraries (Arduino Library Manager):
# - ArduinoWebsockets by Gil Maimon
# - Adafruit SSD1351 + GFX library
# - ArduinoJson by Benoit Blanchon
# - WiFiManager by tzapu
```

### 2.2 Project Structure

```
firmware/
├── firmware.ino           # Main Arduino sketch
├── config.h               # Device config (WiFi, API endpoint)
├── display_manager.h/.cpp # OLED display abstraction
├── sensor_manager.h/.cpp  # BME280 + battery fuel gauge
├── wifi_manager.h/.cpp    # WiFi + WebSocket management
├── button_handler.h/.cpp  # Copy button ISR + debounce
├── lot_api.h/.cpp         # LOT API client
├── ota_manager.h/.cpp     # Over-the-air firmware updates
├── state_machine.h/.cpp   # Core state machine
├── fonts/                 # Custom bitmap fonts
│   ├── font_small.h       # 8pt system font
│   └── font_medium.h      # 14pt notification font
└── assets/                # Bitmap icons (32×32 PNG → XBM)
    ├── icon_coffee.h
    ├── icon_water.h
    ├── icon_walk.h
    └── ...
```

---

## 3. Configuration

### 3.1 `config.h`

```cpp
// LOT API
#define LOT_API_BASE     "https://lot-systems.com/api/device"
#define LOT_WS_URL       "wss://lot-systems.com/api/device/ws"
#define DEVICE_TOKEN     ""         // Filled at enrollment via captive portal
#define DEVICE_ID        ""         // UUID assigned at enrollment

// Display
#define OLED_CS          10
#define OLED_DC          9
#define OLED_RST         8
#define OLED_MOSI        11
#define OLED_SCK         12
#define SCREEN_WIDTH     128
#define SCREEN_HEIGHT    128

// Camera
#define CAM_PWDN         -1
#define CAM_RESET        -1
#define CAM_XCLK         15
#define CAM_SIOD         4
#define CAM_SIOC         5
#define CAM_D7           16
#define CAM_D6           17
#define CAM_D5           18
#define CAM_D4           19
#define CAM_D3           20
#define CAM_D2           21
#define CAM_D1           3
#define CAM_D0           1
#define CAM_VSYNC        6
#define CAM_HREF         7
#define CAM_PCLK         13

// BME280
#define BME_SDA          4
#define BME_SCL          5
#define BME_I2C_ADDR     0x76

// Battery fuel gauge (MAX17048 via I2C)
#define FUEL_I2C_ADDR    0x36

// Button (Copy)
#define BUTTON_PIN       0
#define BUTTON_DEBOUNCE_MS   50
#define BUTTON_LONG_MS       5000

// Power
#define SLEEP_AFTER_IDLE_S   300    // 5 min idle → deep sleep
#define NOTIF_HOLD_S         8      // notification display duration

// OTA
#define OTA_CHECK_INTERVAL_MS  3600000  // Check every 1 hour
#define OTA_SERVER_URL      "https://lot-systems.com/api/device/firmware"
```

---

## 4. State Machine

### 4.1 States

| State | Description | Entry Condition | Exit Condition |
|-------|-------------|-----------------|----------------|
| `IDLE` | Logo display, WiFi connected, waiting | Boot / return from notification | Notification received / button press / idle timeout |
| `NOTIF_RECV` | Display notification message | WebSocket message with `type: notification` | After `NOTIF_HOLD_S` seconds |
| `COPY_ACTION` | Show "Logged ✓", POST to API | Short button press | API response received |
| `SETUP_MODE` | Captive portal for WiFi + token setup | Long button press (5s) / no credentials | Credentials saved, reboot |
| `OTA_UPDATE` | Downloading + flashing firmware | OTA check returns new version | Reboot after flash |
| `DEEP_SLEEP` | Full low-power sleep, GPIO wake | Idle for `SLEEP_AFTER_IDLE_S` | Button press (GPIO0 interrupt) |

### 4.2 Transitions

```
IDLE ─────────────────────────────────► NOTIF_RECV
      (WebSocket notification arrives)

NOTIF_RECV ──────────────────────────► IDLE
           (NOTIF_HOLD_S seconds elapsed)

IDLE ─────────────────────────────────► COPY_ACTION
      (Button short press < 2s)

COPY_ACTION ─────────────────────────► IDLE
            (POST complete + display confirmation)

IDLE ─────────────────────────────────► DEEP_SLEEP
      (SLEEP_AFTER_IDLE_S with no events)

DEEP_SLEEP ──────────────────────────► IDLE
           (Button press wakes GPIO0)

ANY ──────────────────────────────────► SETUP_MODE
    (Button long press > 5s)

IDLE ─────────────────────────────────► OTA_UPDATE
      (OTA timer fires, new version available)
```

---

## 5. LOT API Integration

### 5.1 Device Enrollment Flow

```
1. Device boots with no stored credentials
2. Enters SETUP_MODE → hosts captive portal at 192.168.4.1
3. User connects phone to "COSMO-Setup" WiFi
4. Browser opens captive portal page:
   - Enter home WiFi SSID/password
   - Enter LOT account email
5. Device contacts LOT API:
   POST /api/device/enroll
   {
     "email": "user@example.com",
     "device_model": "COSMO-01",
     "device_serial": "C01-00042",
     "mac": "AA:BB:CC:DD:EE:FF"
   }
6. LOT API returns device token + device_id
7. Device stores credentials in NVS (non-volatile storage)
8. Reboots into IDLE state
```

### 5.2 Notification WebSocket Protocol

```
Device connects to:
  wss://lot-systems.com/api/device/ws?token=<DEVICE_TOKEN>

Server → Device (notification):
{
  "type": "notification",
  "id": "notif_abc123",
  "message": "Coffee time!",
  "category": "routine",
  "icon": "coffee",
  "timestamp": "2026-06-10T09:42:00Z"
}

Device → Server (acknowledgment):
{
  "type": "ack",
  "id": "notif_abc123",
  "device_id": "device_xyz"
}

Server → Device (ping, every 30s):
{ "type": "ping" }

Device → Server (pong):
{ "type": "pong" }
```

### 5.3 Copy Button API Call

On short button press, the firmware immediately:

```cpp
// lot_api.cpp
void postCopyLog(const char* deviceId, const char* token) {
    HTTPClient http;
    http.begin(LOT_API_BASE "/log");
    http.addHeader("Authorization", String("Bearer ") + token);
    http.addHeader("Content-Type", "application/json");

    DynamicJsonDocument doc(256);
    doc["device_id"] = deviceId;
    doc["action"] = "copy";
    doc["timestamp"] = getNTPTime();  // ISO8601 from NTP

    // Include last notification if available
    if (lastNotification.length() > 0) {
        doc["context"] = lastNotification;
    }

    // Include sensor snapshot
    doc["weather"]["temperature"] = getSensorTemp();
    doc["weather"]["humidity"]    = getSensorHumidity();
    doc["weather"]["pressure"]    = getSensorPressure();

    String payload;
    serializeJson(doc, payload);

    int code = http.POST(payload);
    // code 200: show "Logged ✓" for 2s
    // code 4xx/5xx: show "Error" for 2s, retry once
    http.end();
}
```

Expected API payload logged to LOT Log tab:

```json
{
  "device_id": "device_xyz",
  "user_id": "user_abc",
  "action": "copy",
  "timestamp": "2026-06-10T09:42:15Z",
  "context": "Coffee time!",
  "weather": {
    "temperature": 22.4,
    "humidity": 48,
    "pressure": 1013.2
  }
}
```

### 5.4 Sensor Upload

Sensor data is uploaded every 15 minutes when device is awake:

```
POST /api/device/sensor
{
  "device_id": "device_xyz",
  "timestamp": "2026-06-10T09:45:00Z",
  "temperature": 22.4,
  "humidity": 48.1,
  "pressure": 1013.2,
  "battery_pct": 87
}
```

---

## 6. Display Manager

### 6.1 Rendering Pipeline

```cpp
// display_manager.cpp
void DisplayManager::showNotification(const char* message, const char* icon) {
    display.fillScreen(BLACK);

    // Time (top-left, small)
    display.setFont(&font_small);
    display.setCursor(4, 12);
    display.print(getFormattedTime());  // "09:42 AM"

    // Icon (center-left, 24×24)
    const uint8_t* iconBitmap = getIcon(icon);
    display.drawBitmap(8, 32, iconBitmap, 24, 24, WHITE);

    // Message (center, medium bold)
    display.setFont(&font_medium);
    wrapText(message, 38, 36, 84, 14);  // x=38, y=36, maxW=84, lineH=14

    // Attribution (bottom-right, small)
    display.setFont(&font_small);
    display.setCursor(96, 120);
    display.print("- LOT");

    display.display();
}
```

### 6.2 Idle Animation

Idle state shows COSMO® logo mark with a subtle sine-wave brightness pulse
every 4 seconds. Implemented with PWM on display VCC enable pin.

### 6.3 Brightness Levels

| State | Brightness |
|-------|-----------|
| Idle | 20% |
| Notification | 100% |
| Confirmation | 100% → fade to 0% over 2s |
| Charging | 15% (ambient) |
| Deep sleep | 0% (display powered off) |

---

## 7. Power Management

### 7.1 WiFi Power Saving

```cpp
// After notification received, enable modem sleep:
WiFi.setSleep(true);
// WiFi TIM (Target Wakeup Time) interval: 100ms
// Current: ~3mA in modem sleep vs ~80mA active
```

### 7.2 Deep Sleep Configuration

```cpp
void enterDeepSleep() {
    display.clearDisplay();
    display.display();  // blank screen
    display.ssd1351_power(false);

    // Wake on button press (GPIO0, active low)
    esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0);

    // Also wake at 6:00 AM daily (for notification pre-cache)
    struct tm wakeTime = getNextWakeTime(6, 0);
    uint64_t sleepUs = (mktime(&wakeTime) - time(nullptr)) * 1000000ULL;
    esp_sleep_enable_timer_wakeup(sleepUs);

    esp_deep_sleep_start();
    // Never returns; resumes from setup() after wake
}
```

---

## 8. OTA Updates

### 8.1 Update Flow

1. Every hour (or on manual trigger), device checks:  
   `GET /api/device/firmware?version=<current>&model=COSMO-01`

2. Response:
   ```json
   { "available": true, "version": "1.2.0", "url": "https://..." }
   ```

3. If `available: true` and version > current:
   - Show "Update available" on display
   - Download + flash via `esp_https_ota()`
   - Verify SHA256 checksum
   - Reboot

### 8.2 Rollback Safety

ESP32-S3 supports dual OTA partitions. On flash failure or boot loop (3×),
the bootloader automatically reverts to the previous firmware partition.

---

## 9. QR Code Enrollment

On first boot (or SETUP_MODE), the camera captures a QR code displayed on
the user's phone containing:

```
lot://device-setup?token=TEMP_TOKEN&user_id=USER_ID
```

The firmware uses a lightweight QR decoder library (ZXing-C++ port) to:
1. Capture a frame from OV2640
2. Detect and decode QR
3. Extract token + user_id
4. Store in NVS, connect to WiFi

This eliminates the captive portal step for users who prefer QR enrollment.

---

## 10. Firmware Flashing — Quick Start

### First-time flash via USB:

```bash
# Install esptool.py
pip install esptool

# Put device in download mode:
# Hold BOOT button, press RESET, release BOOT

# Flash:
esptool.py --port /dev/ttyUSB0 --baud 921600 \
    write_flash -z 0x0 firmware.bin

# Or via Arduino IDE:
# Board: "ESP32S3 Dev Module"
# Flash Size: 8MB
# PSRAM: "OPI PSRAM"
# Upload Speed: 921600
# Port: (select device port)
# Click Upload
```

### OTA flash (after initial setup):

Device automatically checks and applies OTA updates. Manual trigger:

```
POST /api/device/config
{ "device_id": "...", "command": "check_update" }
```

---

## 11. Debug Interface

USB serial at 115200 baud provides runtime logs:

```
[BOOT] COSMO·01 v1.0.2 starting
[WIFI] Connecting to MyNetwork...
[WIFI] Connected. IP: 192.168.1.42
[NTP]  Time synced: 2026-06-10 09:42:00 UTC
[WS]   WebSocket connected to wss://lot-systems.com/api/device/ws
[SENSOR] Temp: 22.4°C  Humidity: 48%  Pressure: 1013.2hPa
[IDLE] State: IDLE. Battery: 87%
[WS]   Notification received: "Coffee time!" (category: routine)
[DISP] Showing notification for 8s
[BTN]  Copy button pressed (short, 0.3s)
[API]  POST /api/device/log → 200 OK
[DISP] Showing "Logged ✓"
```

---

*All firmware to be maintained in `firmware/` directory of the LOT-Computer
repository. Firmware version pinned against LOT platform API version.*
