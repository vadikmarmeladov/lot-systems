# COSMO® CIA — Firmware Documentation
## ESP32-S3 Firmware v1.0 Reference

```
DOCUMENT:  03-COSMO-CIA-FIRMWARE
REVISION:  v1.0
DATE:      2026-05-26
MCU:       ESP32-S3-MINI-1-N8
FRAMEWORK: Arduino (ESP32 Arduino Core 3.x)
IDE:       Arduino IDE 2.x or PlatformIO
```

---

## 1. Repository Location

```
firmware/
└── cosmo-cia/
    ├── cosmo_cia.ino    — Main firmware (Arduino sketch)
    └── config.h         — Configuration and pin definitions
```

---

## 2. Hardware Abstraction (Pin Map)

| Signal | ESP32-S3 GPIO | Description |
|--------|--------------|-------------|
| DISP_CS | GPIO 10 | E-paper chip select |
| DISP_DC | GPIO 9 | E-paper data/command |
| DISP_RST | GPIO 8 | E-paper hardware reset |
| DISP_BUSY | GPIO 7 | E-paper busy flag |
| SPI_SCK | GPIO 12 | SPI clock (display) |
| SPI_MOSI | GPIO 11 | SPI data out (display) |
| CAM_SIOC | GPIO 37 | Camera SCCB clock (I2C) |
| CAM_SIOD | GPIO 38 | Camera SCCB data |
| CAM_VSYNC | GPIO 6 | Camera vertical sync |
| CAM_HREF | GPIO 5 | Camera horizontal ref |
| CAM_PCLK | GPIO 13 | Camera pixel clock |
| CAM_XCLK | GPIO 14 | Camera external clock |
| CAM_D0–D7 | GPIO 15–22 | Camera parallel data |
| BME_SDA | GPIO 41 | BME688 I2C data |
| BME_SCL | GPIO 40 | BME688 I2C clock |
| BTN_COPY | GPIO 0 | Copy button (active low, internal pull-up) |
| LED_CHG | GPIO 2 | Charge indicator LED (active high) |
| BATT_SDA | GPIO 41 | MAX17048 fuel gauge I2C (shared bus) |
| USB_DP | GPIO 19 | USB D+ (native USB OTG) |
| USB_DM | GPIO 20 | USB D- (native USB OTG) |

---

## 3. Required Libraries

Install via Arduino Library Manager or `platformio.ini`:

```ini
[env:cosmo-cia]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
lib_deps =
    https://github.com/tzapu/WiFiManager.git
    knolleary/PubSubClient @ ^2.8
    bblanchon/ArduinoJson @ ^7.1
    GxEPD2                  ; e-paper display
    adafruit/Adafruit BME280 Library @ ^2.2
    boschsensortec/BSEC2 Software Library @ ^1.7
    mathertel/OneButton @ ^2.3
```

---

## 4. Boot Sequence

```
POWER ON
  │
  ├─ GPIO init (button, LED, SPI, I2C)
  ├─ Display init → show COSMO CIA logo (1.5s)
  ├─ BME688 init → start BSEC2 IAQ calibration
  ├─ WiFiManager check
  │     ├─ Saved credentials exist?
  │     │     YES → connect (10s timeout)
  │     │     NO  → start captive portal "COSMO-CIA-Setup"
  │     │            User enters WiFi + LOT API token
  │     └─ Save credentials to NVS flash
  ├─ Validate API token → GET /api/device/ping
  ├─ OTA check → GET /api/device/ota/check
  ├─ Display: "Connected · LOT Systems"
  └─ Enter main loop
```

---

## 5. Main Loop

The main loop runs at variable intervals using `millis()` timers:

| Task | Interval | Description |
|------|----------|-------------|
| Button poll | 50ms | OneButton library debounce |
| BME688 read | 3,000ms | BSEC2 output ready signal |
| Notification poll | 30,000ms | GET /api/device/notifications |
| Sensor upload | 300,000ms | POST /api/device/sensor (5 min) |
| Heartbeat ping | 600,000ms | GET /api/device/ping (10 min) |
| Display refresh | On data | Only refresh e-paper when content changes |
| OTA check | On boot only | Not periodic (conserve power) |

---

## 6. WiFi Management

WiFiManager library creates a captive portal at first boot or when WiFi fails for >60 seconds.

**Portal SSID:** `COSMO-CIA-<MAC_SUFFIX>`
**Portal IP:** `192.168.4.1`
**Portal URL:** Any HTTP request on this IP

Custom portal fields added:
- LOT API Token (lot_device_... string)
- LOT Server URL (default: https://lot-systems.com)

Credentials are stored in ESP32 NVS (Non-Volatile Storage) — survives power cycles and firmware updates.

---

## 7. LOT API Integration

All API calls use HTTPS with certificate verification. The root CA for `lot-systems.com` (Let's Encrypt ISRG Root X1) is bundled in firmware.

### Authentication Header

```
Authorization: Bearer lot_device_<48-hex-chars>
Content-Type: application/json
```

### API Endpoints Called

| Method | Endpoint | Trigger |
|--------|----------|---------|
| GET | /api/device/ping | Boot + every 10 min |
| GET | /api/device/notifications | Every 30s |
| POST | /api/device/notifications/ack | On notification display |
| POST | /api/device/event | Copy button press |
| POST | /api/device/sensor | Every 5 min |

### Copy Button Press Flow

```
Button pressed (single click)
  │
  ├─ Haptic feedback: LED flash 100ms
  ├─ Display: "Copying..." (animated dots)
  ├─ POST /api/device/event
  │     { "event": "copy_button" }
  ├─ Response 200: Display "✓ Logged"
  └─ Return to notification display after 2s
```

---

## 8. E-Paper Display Management

The GDEH0154D67 e-paper display uses full refresh (~2s) and partial refresh (~0.5s).

| Scenario | Refresh type |
|----------|-------------|
| New notification | Full refresh (crisp render) |
| Acknowledgment animation | Partial refresh |
| Battery/status bar update | Partial refresh |
| Boot screen | Full refresh |

### Display Layout (200×200 px)

```
┌─────────────────────────┐
│ LOT  [battery 87%]      │  ← Status bar (top, 20px)
├─────────────────────────┤
│                         │
│   Coffee time!          │  ← Notification text
│                         │  ← (18pt Courier bold)
│   11:34 AM              │  ← Timestamp
│                         │
│   Source: Memory Engine │  ← Source label (10pt)
│                         │
├─────────────────────────┤
│ [●] 1 new  ◎ BME OK    │  ← Footer bar (bottom, 20px)
└─────────────────────────┘
```

---

## 9. Camera

Camera captures are triggered by:
- **Hold 3s** on Copy button → capture + POST to `/api/device/event` with `event: "camera_capture"` and base64 image in metadata
- **API command** via notification metadata: `{ "type": "capture_request" }`

Resolution: 320×240 (QVGA) for upload, 160×120 for context thumbnails.

Images are **not stored on device** — they are sent to the LOT API immediately.

---

## 10. BME688 / BSEC2

The Bosch BSEC2 library runs a closed-source AI model on the BME688 sensor data to produce:

| Output | Range | Description |
|--------|-------|-------------|
| Temperature | -40 to +85°C | Compensated ambient temperature |
| Humidity | 0–100% RH | Relative humidity |
| Pressure | 300–1100 hPa | Barometric pressure |
| IAQ Index | 0–500 | Indoor Air Quality (0=excellent, 500=extremely polluted) |
| IAQ Accuracy | 0–3 | BSEC2 calibration confidence (wait for 3) |
| CO₂ equivalent | 400–25000 ppm | Estimated CO₂ equivalent |

The device uploads all values to `/api/device/sensor`. IAQ accuracy < 2 is uploaded with a low-confidence flag.

**BSEC2 State Saving:** BSEC2 learns over ~5 days. Its calibration state (512 bytes) is saved to NVS every 6 hours so the model doesn't reset on power cycle.

---

## 11. Wireless Charging Integration

The STWLC68 Qi receiver IC communicates via I2C. The firmware:
1. Reads charging status register on boot + every 60s
2. Sets LED_CHG pin HIGH when `CHG_STATUS == CHARGING`
3. On full charge: LED slow pulse (0.5Hz)
4. Charging parameters configured via I2C on boot (5W maximum input)

---

## 12. OTA (Over-The-Air) Updates

OTA is served from the LOT Systems server:

```
GET /api/device/ota/check
Response: {
  "version": "1.2.0",
  "url": "https://lot-systems.com/firmware/cosmo-cia-v1.2.0.bin",
  "sha256": "abc123...",
  "forceUpdate": false
}
```

If `version > current_version`, the firmware downloads and verifies the binary (SHA256), then calls `esp_ota_set_boot_partition()` and restarts.

The OTA partition scheme uses dual-bank OTA (ESP32's built-in `ota_0` / `ota_1` partitions).

**Partition table:** `partitions.csv`
```
# Name,   Type, SubType, Offset,   Size
nvs,      data, nvs,     0x9000,   0x6000
ota_data, data, ota,     0xf000,   0x2000
app0,     app,  ota_0,   0x10000,  0x1C0000
app1,     app,  ota_1,   0x1D0000, 0x1C0000
bsec,     data, spiffs,  0x390000, 0x70000
```

---

## 13. Power Management

The firmware uses ESP32-S3 light sleep between API polls to achieve multi-day battery life:

```
Active (WiFi TX): 80mA
Active (WiFi RX): 60mA
Light sleep (WiFi off, RTC running): 2mA
Deep sleep (RTC running): 120µA
```

**Sleep strategy:**
- After each API poll cycle, enter **light sleep** for 25 seconds
- Wake on: timer, Copy button GPIO interrupt, charging status change
- Enter **deep sleep** after 30 min with no WiFi activity (user likely moved device away from router)

---

## 14. Factory Reset

Hold Copy button for **10 seconds** during boot (while logo is displayed):
1. WiFi credentials cleared (NVS)
2. API token cleared (NVS)
3. BSEC2 calibration state cleared
4. Device restarts into WiFiManager portal

---

## 15. Firmware Build

```bash
# PlatformIO
cd firmware/cosmo-cia
pio run                          # Build
pio run --target upload          # Flash via USB-C
pio run --target monitor         # Serial monitor (115200 baud)

# Arduino IDE
# 1. Install ESP32 Arduino core (Espressif) v3.x
# 2. Board: "ESP32S3 Dev Module"
# 3. Flash size: "8MB (64Mb)"
# 4. Partition scheme: "Custom" → upload partitions.csv
# 5. Upload mode: "UART0 / Hardware CDC"
```

---

```
COSMO® CIA — Firmware Documentation
LOT Systems Corporation | lot-systems.com
Document: 03-COSMO-CIA-FIRMWARE v1.0
```
