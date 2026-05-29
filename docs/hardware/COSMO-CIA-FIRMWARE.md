<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Firmware Documentation

**Document:** COSMO-CIA-FIRMWARE.md
**Version:** 1.0.0
**Prepared:** May 29, 2026
**Framework:** ESP-IDF v5.2 + FreeRTOS
**Target MCU:** ESP32-S3-MINI-1-N8

---

## 1. Architecture Overview

The firmware runs FreeRTOS on the ESP32-S3 dual-core. Tasks are pinned to cores to avoid contention between Wi-Fi and the display pipeline.

```
Core 0 (PRO_CPU)                   Core 1 (APP_CPU)
─────────────────────────────────  ──────────────────────────────────
Wi-Fi stack (system)               DisplayTask
WebSocket client task              CameraTask
HTTPS API task                     WeatherTask
OTA update task                    SleepManager
PowerMonitor task                  ButtonISR (GPIO interrupt)
```

### Task Table

| Task Name         | Core | Priority | Stack  | Period      | Purpose                              |
|------------------|------|----------|--------|-------------|--------------------------------------|
| wifi_task         | 0    | 5        | 4 KB   | event-driven| Maintain Wi-Fi, reconnect on drop    |
| ws_client_task    | 0    | 4        | 6 KB   | persistent  | WebSocket to lot-systems.com         |
| api_task          | 0    | 3        | 4 KB   | on-demand   | HTTPS POST (log, register, OTA)      |
| ota_task          | 0    | 2        | 8 KB   | on-demand   | OTA firmware update                  |
| display_task      | 1    | 5        | 4 KB   | event-driven| SSD1351 SPI render                   |
| camera_task       | 1    | 3        | 8 KB   | on-demand   | OV2640 capture + JPEG encode         |
| weather_task      | 1    | 2        | 2 KB   | 60 s        | BME280 read + push to API            |
| sleep_manager     | 1    | 1        | 2 KB   | 30 s idle   | Light/deep sleep decision            |
| power_monitor     | 0    | 2        | 2 KB   | 10 s        | ADC read VBAT, update display        |

---

## 2. File Structure

```
firmware/
├── main/
│   ├── main.c                  # App entry, task launch
│   ├── config.h                # Pin definitions, compile-time config
│   ├── wifi/
│   │   ├── wifi_manager.c      # Connect, reconnect, event handler
│   │   └── wifi_manager.h
│   ├── api/
│   │   ├── lot_api.c           # HTTPS calls to lot-systems.com
│   │   ├── lot_api.h
│   │   ├── ws_client.c         # WebSocket client (esp-idf websocket)
│   │   └── ws_client.h
│   ├── display/
│   │   ├── display.c           # SSD1351 SPI driver + layout renderer
│   │   ├── display.h
│   │   ├── fonts/              # BDF-converted bitmap fonts
│   │   └── icons/              # LOT® logo, battery, Wi-Fi icons (1-bit)
│   ├── sensors/
│   │   ├── bme280.c            # BME280 I²C driver
│   │   ├── bme280.h
│   │   ├── camera.c            # OV2640 DVP driver
│   │   └── camera.h
│   ├── power/
│   │   ├── power.c             # BQ25895 I²C, ADC battery voltage
│   │   └── power.h
│   ├── storage/
│   │   ├── nvs_config.c        # NVS: store Wi-Fi creds, device token
│   │   ├── nvs_config.h
│   │   ├── session.c           # LZ4-compress notification history
│   │   └── session.h
│   ├── ota/
│   │   ├── ota.c               # esp_https_ota wrapper
│   │   └── ota.h
│   └── button/
│       ├── button.c            # GPIO ISR + debounce
│       └── button.h
├── components/                 # External ESP-IDF components
│   ├── esp-idf-lib/            # BME280, SSD1351 community drivers
│   └── websocket/              # esp-idf websocket component
├── partitions.csv              # Custom partition table
├── sdkconfig.defaults          # Build defaults (Wi-Fi, BLE, camera)
├── CMakeLists.txt
└── pytest/                     # pytest-based integration tests
    ├── test_api.py
    ├── test_display.py
    └── test_button.py
```

---

## 3. Pin Assignments (ESP32-S3-MINI-1)

| GPIO | Function         | Direction | Notes                          |
|------|-----------------|-----------|--------------------------------|
| 4    | SPI_CLK (SSD1351)| OUT       | Display SPI clock              |
| 5    | SPI_MOSI         | OUT       | Display SPI data               |
| 6    | DISPLAY_CS       | OUT       | Display chip select            |
| 7    | DISPLAY_DC       | OUT       | Display data/command           |
| 8    | DISPLAY_RST      | OUT       | Display reset (active low)     |
| 10   | I2C_SDA          | I/O       | BME280 + BQ25895               |
| 11   | I2C_SCL          | OUT       | BME280 + BQ25895               |
| 12   | BUTTON_COPY      | IN        | COPY button, pull-up, active low|
| 13   | BUZZER           | OUT       | Passive buzzer via LEDC PWM    |
| 14   | VBAT_ADC         | IN (ADC1) | Battery voltage (divider /2)   |
| 15   | CAMERA_PWDN      | OUT       | OV2640 power down              |
| 16   | CAMERA_RESET     | OUT       | OV2640 reset                   |
| 17–24| CAMERA_D0–D7     | IN        | OV2640 DVP data bus            |
| 25   | CAMERA_PCLK      | IN        | OV2640 pixel clock             |
| 26   | CAMERA_VSYNC     | IN        | OV2640 vertical sync           |
| 27   | CAMERA_HREF      | IN        | OV2640 horizontal ref          |
| 28   | CAMERA_XCLK      | OUT       | OV2640 master clock (20 MHz)   |

---

## 4. NVS Configuration Keys

Persistent configuration stored in NVS partition:

| Key               | Type    | Description                              |
|------------------|---------|------------------------------------------|
| `wifi_ssid`       | string  | Wi-Fi network name                       |
| `wifi_pass`       | string  | Wi-Fi password                           |
| `device_token`    | string  | JWT bearer token for LOT API             |
| `device_id`       | string  | UUID assigned at device registration     |
| `user_id`         | string  | LOT user ID this device is paired to     |
| `ota_url`         | string  | Override OTA URL (for staged rollouts)   |
| `notify_volume`   | uint8   | Buzzer volume 0–3                        |
| `sleep_timeout`   | uint16  | Idle seconds before light sleep (default: 30)|

---

## 5. Wi-Fi Provisioning Flow

Initial setup via BLE (no phone app required for BLE-capable devices, or via USB serial for headless setup):

```
1. Device boots with no NVS credentials
2. Display shows: "Scan QR at lot-systems.com/pair"
3. Display renders QR code (device UUID + BLE advert UUID)
4. User opens LOT Settings → Devices on phone/browser
5. LOT site generates pairing token
6. BLE provisioning: phone sends SSID + password + device_token
7. ESP32 connects to Wi-Fi, saves to NVS
8. Device registers via POST /api/device/register
9. Display shows: "✓ Connected — Welcome, [Name]"
```

Alternative: USB-C serial provisioning via `idf.py monitor` + custom AT commands.

---

## 6. WebSocket Notification Protocol

The device maintains a persistent WebSocket connection:

```
wss://lot-systems.com/api/device/notifications
Authorization: Bearer <device_token>
```

### Incoming message (server → device)

```json
{
  "type": "notification",
  "id": "notif_abc123",
  "text": "Coffee time!",
  "subtext": "Your morning ritual awaits",
  "timestamp": "2026-05-29T09:45:00Z",
  "chime": true,
  "priority": "normal"
}
```

### Heartbeat (every 30 s)

```json
{ "type": "ping" }
```
Device responds:
```json
{ "type": "pong", "battery": 78, "temp": 22.4, "humidity": 45.2 }
```

### Reconnect policy

```
Disconnect detected →
  Wait 2 s → retry
  Wait 4 s → retry
  Wait 8 s → retry
  Wait 16 s → retry
  Wait 32 s → retry (cap at 32 s)
  Log failure to NVS → display "⚠ Offline"
```

---

## 7. COPY Button Handler

```c
// button/button.c
static void IRAM_ATTR button_isr_handler(void *arg) {
    uint32_t gpio_num = (uint32_t)arg;
    BaseType_t higher_priority_woken = pdFALSE;
    xQueueSendFromISR(button_event_queue, &gpio_num, &higher_priority_woken);
    if (higher_priority_woken) portYIELD_FROM_ISR();
}

// Debounce in button_task:
// - Record timestamp of press
// - Ignore presses within 300 ms of last press
// - On valid press: xEventGroupSetBits(api_event_group, COPY_BUTTON_BIT)
```

When `COPY_BUTTON_BIT` is set, `api_task` fires a POST:

```
POST https://lot-systems.com/api/device/log
Authorization: Bearer <device_token>
Content-Type: application/json

{
  "device_id": "cia_xxxxxxxx",
  "action": "copy",
  "notification_id": "notif_abc123",
  "timestamp": "2026-05-29T09:46:00Z",
  "weather": {
    "temp_c": 22.4,
    "humidity_pct": 45.2,
    "pressure_hpa": 1013.2
  }
}
```

Display briefly shows `✓ Logged` (1.5 seconds) then returns to notification.

---

## 8. Session Compression

After each WebSocket session, the notification history (up to 50 items) is compressed to SPIFFS:

```c
// storage/session.c
void session_compress_and_save(notification_t *history, uint8_t count) {
    // Serialize to CBOR (compact binary JSON)
    uint8_t cbor_buf[4096];
    size_t cbor_len = cbor_serialize(history, count, cbor_buf);

    // LZ4 compress
    uint8_t lz4_buf[2048];
    int compressed = LZ4_compress_default(cbor_buf, lz4_buf, cbor_len, sizeof(lz4_buf));

    // Write to SPIFFS /notifications/session_YYYYMMDD.lz4
    spiffs_write_file(session_path, lz4_buf, compressed);

    // Keep only last 7 session files (rolling window)
    spiffs_prune_old_sessions(7);
}
```

On reconnect, the last session is sent to the server for context:
```
POST /api/device/session-sync
Body: compressed session binary
```
The server uses this to avoid re-sending already-seen notifications.

---

## 9. OTA Update

OTA is triggered by the server sending:

```json
{ "type": "ota", "url": "https://lot-systems.com/firmware/cia-v1.1.bin", "sha256": "abc..." }
```

```c
// ota/ota.c
esp_https_ota_config_t ota_config = {
    .http_config = &http_config,
};
esp_err_t ret = esp_https_ota(&ota_config);
if (ret == ESP_OK) {
    display_show("✓ Update OK\nRestarting...");
    esp_restart();
}
```

Firmware binary is signed with RSA-2048. Device verifies signature before applying. Rollback on failed boot (ESP32-S3 dual-partition OTA).

---

## 10. Display Layouts

### Idle (no notification)

```
┌────────────────────────────┐
│  LOT®             ▌78%     │
│                            │
│  22.4°C  45% RH            │
│  1013 hPa                  │
│                            │
│  ── No new messages ──     │
│  9:45 AM  May 29           │
└────────────────────────────┘
```

### Notification

```
┌────────────────────────────┐
│  LOT®             ▌78%     │
│                            │
│  ☀  Coffee time!           │
│  Your morning ritual       │
│  awaits                    │
│                            │
│  ── COPY to Log ─────────  │
└────────────────────────────┘
```

### Acknowledged

```
┌────────────────────────────┐
│                            │
│                            │
│       ✓  Logged            │
│                            │
│                            │
│                            │
└────────────────────────────┘
```

All text rendered with embedded bitmap fonts (8px, 12px, 16px). Icons stored as 16×16 px 1-bit XBM arrays.

---

## 11. Build & Flash

```bash
# Prerequisites: ESP-IDF v5.2 installed, port /dev/ttyUSB0

cd firmware/
idf.py set-target esp32s3
idf.py menuconfig        # Set Wi-Fi, LOT API base URL in Kconfig
idf.py build
idf.py -p /dev/ttyUSB0 flash monitor

# Production flash (programming jig, no USB-C per unit):
esptool.py --chip esp32s3 --port /dev/ttyUSB0 \
  write_flash -z 0x0 build/bootloader/bootloader.bin \
              0x8000 build/partition_table/partition-table.bin \
              0x10000 build/cosmo-cia.bin
```

---

## 12. Testing

```bash
# Unit tests (pytest via serial bridge)
cd firmware/pytest/
pytest test_button.py -v       # Simulate button press, verify log POST
pytest test_display.py -v      # Verify notification renders at correct coords
pytest test_api.py -v          # Mock server: verify WS reconnect, OTA flow

# Integration test (real hardware, staging server)
pytest test_integration.py --port /dev/ttyUSB0 --server https://staging.lot-systems.com
```

---

*COSMO® CIA Firmware — Built on ESP-IDF, powered by LOT.*
*© 2026 LOT Systems, Inc. All rights reserved.*
