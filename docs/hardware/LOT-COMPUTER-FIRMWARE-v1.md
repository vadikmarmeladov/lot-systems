================================================================================
LOT SYSTEMS CORPORATION / FIRMWARE DOCUMENT
DOCUMENT:   LOT-COMPUTER-FIRMWARE-v1
TITLE:      COSMO PAGER™ — Firmware Architecture & Protocol Reference
CLASS:      RESTRICTED // S-2 EYES
VERSION:    v1.0.0
DATE:       2026-06-26
TARGET HW:  COSMO PAGER™ (ESP32-S3-MINI-1-N8R8)
SDK:        ESP-IDF v5.2.x (FreeRTOS 10.5)
LANGUAGE:   C (core) + C++ (BSEC2 wrapper)
================================================================================


--------------------------------------------------------------------------------
00 // FIRMWARE OVERVIEW
--------------------------------------------------------------------------------

The COSMO PAGER™ firmware ("LOT-FW") connects the physical device to the
LOT Systems ecosystem at lot-systems.com. It runs on the ESP32-S3 SoC using
the ESP-IDF framework with FreeRTOS multitasking.

Core responsibilities:
  1. Maintain Wi-Fi connectivity to lot-systems.com
  2. Poll for and display autonomous AI notifications
  3. Capture and transmit BME688 environmental sensor data
  4. Signal COPY button presses to the LOT Log API
  5. Trigger camera captures on server command
  6. Execute OTA firmware updates
  7. Compress and transmit session summaries
  8. Manage power (deep sleep, battery monitoring)


--------------------------------------------------------------------------------
01 // FLASH PARTITION MAP
--------------------------------------------------------------------------------

  ADDRESS     SIZE      NAME            TYPE      NOTES
  ─────────────────────────────────────────────────────────────────────
  0x000000    32KB      bootloader      internal  ESP-IDF 2nd-stage
  0x008000    4KB       nvs_keys        data      Flash encryption keys
  0x009000    20KB      nvs             data      Device config, token, sessions
  0x00E000    8KB       phy_init        data      Wi-Fi RF calibration
  0x010000    1.5MB     factory         app       Factory firmware (read-only)
  0x190000    1.5MB     ota_0           app       OTA slot A
  0x310000    1.5MB     ota_1           app       OTA slot B
  0x490000    4KB       otadata         data      OTA partition selector
  0x491000    32KB      spiffs          data      Cert bundle, CA chain
  0x499000    —         (end of 8MB)
  ─────────────────────────────────────────────────────────────────────

  NVS Keys (namespace "cosmo"):
    device_id      char[37]    UUID v4, provisioned at factory
    device_token   char[65]    Bearer token, provisioned at factory
    wifi_ssid      char[32]    User-configured or provisioned
    wifi_pass      char[64]    User-configured or provisioned
    fw_version     char[16]    Current firmware version string
    sessions_head  uint8       Ring buffer head index (0–31)
    session_N      uint8[64]   CBOR-encoded session data (N = 0–31)


--------------------------------------------------------------------------------
02 // BUILD SYSTEM
--------------------------------------------------------------------------------

  TOOLCHAIN:  xtensa-esp32s3-elf-gcc (ESP-IDF managed)
  BUILD:      CMake + idf.py
  FLASH:      idf.py -p /dev/ttyUSB0 flash monitor
              OR: esptool.py (for production fixture flashing)

  COMPONENTS (idf_component.yml):
    - idf: ">=5.2.0"
    - bsec2_esp32s3: local component (Bosch BSEC2 for ESP32)
    - esp_tls: built-in (TLS 1.3 with mbedTLS)
    - esp_http_client: built-in (HTTPS POST/GET)
    - esp_camera: https://github.com/espressif/esp32-camera (tag v2.0.9)
    - esp_lcd: built-in (SPI display driver)
    - nvs_flash: built-in
    - esp_spiffs: built-in (for CA bundle storage)

  SDKCONFIG HIGHLIGHTS:
    CONFIG_ESP32S3_DEFAULT_CPU_FREQ_MHZ=240
    CONFIG_MBEDTLS_TLS_VERSION_1_3=y
    CONFIG_ESP_TLS_INSECURE=n                    (pinned cert only)
    CONFIG_FREERTOS_HZ=1000
    CONFIG_ESP_TASK_WDT_TIMEOUT_S=30
    CONFIG_BOOTLOADER_FLASH_XTS_AES_256=y        (flash encryption)
    CONFIG_SECURE_BOOT_V2_ENABLED=y              (signed firmware)
    CONFIG_SECURE_BOOT_SIGNING_KEY=keys/secure_boot_signing_key.pem
    CONFIG_PARTITION_TABLE_CUSTOM=y
    CONFIG_PARTITION_TABLE_CUSTOM_FILENAME=partitions.csv
    CONFIG_CAMERA_TASK_PINNED_TO_CORE=1
    CONFIG_ESPCAMERA_CONV_PREFER_SIMD=y
    CONFIG_BSEC_SAMPLE_RATE=BSEC_SAMPLE_RATE_LP  (low power, 3s cycle)


--------------------------------------------------------------------------------
03 // TASK ARCHITECTURE
--------------------------------------------------------------------------------

  All tasks run on FreeRTOS. Stack sizes and priorities tuned for 240 MHz.

  TASK            CORE  PRIORITY  STACK    PERIOD      PURPOSE
  ─────────────────────────────────────────────────────────────────────────────
  TaskWifi         0      5       4096B    event-driven Maintain Wi-Fi conn
  TaskNotify       0      3       8192B    10 min       Poll + render notif
  TaskDisplay      1      3       4096B    on-demand    E-paper SPI update
  TaskSensor       1      2       6144B    5 min        BME688 forced mode
  TaskButton       1      6       2048B    ISR-driven   COPY event handler
  TaskCamera       1      2       16384B   on-demand    JPEG capture + POST
  TaskOTA          0      1       8192B    24 h         Check + apply OTA
  TaskRGB          1      1       2048B    100 ms       LED state machine
  TaskPower        0      4       2048B    30 s         Battery SOC, sleep
  TaskHeartbeat    0      2       4096B    60 s         Heartbeat POST
  TaskSession      0      1       4096B    on-sleep     Compress + save session
  ─────────────────────────────────────────────────────────────────────────────

  Inter-task communication:
    EventGroup:    wifi_event_group (WIFI_CONNECTED_BIT, WIFI_FAIL_BIT)
    Queue:         display_queue (xQueueHandle, depth 4, item = NotifPayload)
    Queue:         sensor_queue (depth 8, item = SensorReading)
    Semaphore:     spi_mutex (shared SPI bus: display + NVS flash)
    Direct notify: TaskButton → TaskHeartbeat via xTaskNotify on COPY event


--------------------------------------------------------------------------------
04 // WI-FI MANAGEMENT (TaskWifi)
--------------------------------------------------------------------------------

  STATE MACHINE:
    DISCONNECTED → CONNECTING → CONNECTED → IDLE
    CONNECTED failure → RECONNECTING (exponential backoff: 2s, 4s, 8s, 16s, 32s)
    After 5 failed retries → DEEP_SLEEP_REQUEST (notifies TaskPower)

  CONNECTION:
    esp_wifi_set_mode(WIFI_MODE_STA)
    esp_wifi_set_config(WIFI_IF_STA, &wifi_config)  ; SSID from NVS
    esp_wifi_start()
    ; WPA2-Personal, WPA3-SAE preferred if AP supports it

  POWER SAVE:
    esp_wifi_set_ps(WIFI_PS_MIN_MODEM)   ; DTIM 1 listen interval
    ; or WIFI_PS_MAX_MODEM between polls

  CA CERTIFICATE:
    Loaded from SPIFFS at /spiffs/lot-systems-ca.pem
    Pinned to lot-systems.com certificate authority
    Updated via OTA alongside firmware (separate spiffs image)


--------------------------------------------------------------------------------
05 // NOTIFICATION SYSTEM (TaskNotify)
--------------------------------------------------------------------------------

  POLL CYCLE (every 10 minutes via esp_timer):
    1. Wait for WIFI_CONNECTED_BIT
    2. HTTPS GET /api/device/notifications
       Headers: Authorization: Bearer <device_token>
                X-Device-Id: <device_id>
                X-Firmware-Version: <fw_version>
    3. Parse JSON response (cJSON library)
    4. Compare notification ID to last_notif_id in NVS
    5. If new notification: xQueueSend(display_queue, &notif, 0)
    6. Store new last_notif_id to NVS

  PAYLOAD STRUCT:
    typedef struct {
        char id[37];           // UUID
        char text[128];        // Notification text, e.g. "Coffee time!"
        char ts[25];           // ISO 8601
        uint8_t priority;      // 0=normal, 1=urgent
    } NotifPayload;

  DISPLAY RENDER (TaskDisplay on receipt):
    - E-paper full refresh if text changed
    - Layout:
        Line 1 (10pt bold):  Notification text (auto-word-wrap)
        Line 2 (7pt):        Time HH:MM (UTC, from ts field)
        Footer (6pt):        "lot-systems.com"
    - Urgent priority: invert display (white-on-black)
    - On-screen retention: e-paper holds image at 0 µA until next update

  FALLBACK:
    If GET fails: display shows "— no signal —" after 3 consecutive failures
    Battery indicator: small pixel bar bottom-right (8 segments = 8 levels)


--------------------------------------------------------------------------------
06 // SENSOR PIPELINE (TaskSensor + BSEC2)
--------------------------------------------------------------------------------

  BSEC2 CONFIGURATION:
    Sample rate: BSEC_SAMPLE_RATE_LP (low power, 3-second heater cycle)
    Outputs:
      BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE
      BSEC_OUTPUT_COMPENSATED_GAS
      BSEC_OUTPUT_IAQ               (Indoor Air Quality, 0–500)
      BSEC_OUTPUT_STATIC_IAQ
      BSEC_OUTPUT_CO2_EQUIVALENT
      BSEC_OUTPUT_BREATH_VOC_EQUIVALENT
      BSEC_OUTPUT_RAW_PRESSURE
      BSEC_OUTPUT_RAW_HUMIDITY

  5-MINUTE CYCLE:
    1. Wake BME688 from sleep (I2C write forced mode)
    2. Run BSEC2 algorithm for 3-second measurement window
    3. Collect all outputs
    4. xQueueSend(sensor_queue, &reading, 0)
    5. TaskHeartbeat picks up reading on next 60s heartbeat POST

  SENSOR POST:
    POST /api/device/sensor
    Body (JSON):
    {
      "deviceId": "<uuid>",
      "ts": "<ISO8601>",
      "temp": 22.1,
      "humidity": 45.2,
      "pressure": 1013.2,
      "iaq": 50,
      "iaqAccuracy": 2,
      "co2Eq": 550.0,
      "vocEq": 0.45,
      "gasResistance": 42000
    }
    → Server stores in weather/sensor table, feeds LOT site weather widget


--------------------------------------------------------------------------------
07 // COPY BUTTON HANDLER (TaskButton)
--------------------------------------------------------------------------------

  GPIO CONFIG:
    gpio_config_t:
      pin_bit_mask = (1ULL << BUTTON_GPIO)   ; GPIO 12 (example)
      mode = GPIO_MODE_INPUT
      pull_up_en = GPIO_PULLUP_ENABLE
      intr_type = GPIO_INTR_NEGEDGE           ; falling edge = press

  DEBOUNCE:
    ISR sets flag, 50ms software debounce timer before registering press

  ON BUTTON PRESS:
    1. RGB LED: single white flash (50ms)
    2. E-paper: brief invert flash to confirm receipt (optional)
    3. xTaskNotify(TaskHeartbeat, COPY_EVENT_BIT, eSetBits)

  LOG POST (from TaskHeartbeat on COPY_EVENT_BIT):
    POST /api/device/log
    Body:
    {
      "deviceId": "<uuid>",
      "event": "COPY",
      "ts": "<ISO8601>",
      "sensor": {
        "temp": 22.1,
        "humidity": 45.2
      }
    }
    → Appears in LOT site Log tab:
      [COSMO] Copy — 2026-06-26 14:32:00 UTC


--------------------------------------------------------------------------------
08 // CAMERA SUBSYSTEM (TaskCamera)
--------------------------------------------------------------------------------

  DRIVER:     esp32-camera (Espressif component)
  SENSOR:     OV2640 (detected via SCCB I2C auto-detect at init)

  PIN MAP (example, adjust per PCB layout):
    PWDN_GPIO  = -1 (not connected)
    RESET_GPIO = -1 (soft reset via SCCB)
    XCLK_GPIO  = 15   ; 20 MHz XCLK from ESP32-S3 LEDC
    SIOD_GPIO  = 4    ; SCCB SDA
    SIOC_GPIO  = 5    ; SCCB SCL
    D7–D0      = 36,37,38,39,40,41,42,43  ; 8-bit DVP data
    VSYNC      = 16
    HREF       = 17
    PCLK       = 18

  CAPTURE CONFIG:
    camera_config_t:
      frame_size = FRAMESIZE_QVGA     ; 320×240 (compact, fast)
      jpeg_quality = 12               ; 0=best, 63=worst; 12 = good quality
      fb_count = 2                    ; double-buffer
      pixel_format = PIXFORMAT_JPEG

  TRIGGER:
    Server sends { "cmd": "capture" } in GET /api/device/commands response
    TaskNotify polls /commands alongside /notifications (same 10-min cycle)
    On capture cmd: TaskCamera wakes, takes frame, HTTP multipart POST to
      /api/device/upload with signed upload URL from command payload

  PRIVACY:
    RGB LED activates (blue) during any capture
    No automatic capture without server command
    Camera power-gated when not in use (GPIO power switch)


--------------------------------------------------------------------------------
09 // OTA UPDATE SYSTEM (TaskOTA)
--------------------------------------------------------------------------------

  CHECK CYCLE: Every 24 hours (esp_timer, 86400s)

  PROTOCOL:
    GET /api/device/firmware/latest
    Response: { "version": "1.1.0", "url": "https://...", "sha256": "..." }

    If version > current (semantic version compare):
      esp_https_ota_config_t:
        http_config.url = firmware_url
        http_config.cert_pem = lot_systems_ca_cert   ; from SPIFFS
        http_config.skip_cert_common_name_check = false
      esp_https_ota(&ota_config)
      ; Writes to inactive OTA slot (ota_0 or ota_1)
      ; SHA256 verified by ESP-IDF OTA lib
      ; Sets otadata to boot new slot
      esp_restart()

  ROLLBACK:
    If new firmware fails TaskWifi connection within 5 min:
      esp_ota_mark_app_invalid_rollback_and_reboot()
    Previous firmware boots from other OTA slot

  SIGNED FIRMWARE:
    All OTA images signed with Secure Boot V2 key
    Key stored offline (not in device)
    Verification done by ESP-IDF bootloader before boot


--------------------------------------------------------------------------------
10 // SESSION COMPRESSION (TaskSession)
--------------------------------------------------------------------------------

  PURPOSE: Preserve a summary of each device session across reboots/sleep
           and batch-upload when connectivity available.

  SESSION STRUCT (CBOR encoded, ~48 bytes):
    typedef struct {
        uint32_t ts_start;          // Unix timestamp session start
        uint32_t ts_end;            // Unix timestamp session end
        uint16_t notif_count;       // Notifications received this session
        uint8_t  notif_last[32];    // Last notification text (truncated)
        int16_t  temp_avg_x10;      // Avg temp × 10 (e.g., 221 = 22.1°C)
        uint8_t  humidity_avg;      // Avg humidity (0–100)
        uint16_t iaq_avg;           // Avg IAQ (0–500)
        uint8_t  battery_start;     // Battery % at session start
        uint8_t  battery_end;       // Battery % at session end
        uint8_t  button_presses;    // Copy button presses this session
        uint8_t  wifi_reconnects;   // Wi-Fi reconnect count
    } SessionSummary;

  STORAGE: Ring buffer of 32 sessions in NVS (namespace "sessions")
           Oldest evicted when full (FIFO)

  UPLOAD: On next successful HTTPS connection, POST /api/device/sessions
          Body: CBOR array of pending sessions (1–32)
          On 200 OK: clear from NVS


--------------------------------------------------------------------------------
11 // POWER MANAGEMENT (TaskPower)
--------------------------------------------------------------------------------

  BATTERY MONITORING:
    ADC read of VBAT through resistor divider every 30s
    VBAT (4.2V max) → 10kΩ/10kΩ divider → 2.1V max → ESP32 ADC
    SOC lookup table (OCV vs capacity for 150mAh LiPo)
    Levels: 100, 87, 75, 62, 50, 37, 25, 12, 5, 0 %

  POWER STATES:
    ACTIVE:     All tasks running, Wi-Fi connected (~35 mA avg)
    LIGHT_SLEEP: Wi-Fi DTIM, display off, sensors off (~5 mA avg)
                 Entered between task cycles; wakes on timer or GPIO
    DEEP_SLEEP:  Wi-Fi off, display holds image (0 µA e-paper), RTC on
                 (~0.1 mA: RTC + Qi detect circuit)
                 Wakes: RTC timer (10 min) or button GPIO wakeup
                 Triggered if: battery < 10% OR idle > 30 min without Qi

  QI DETECTION:
    Qi VBUS pin → GPIO wakeup source
    On Qi detected in deep sleep: wake, connect Wi-Fi, send charging_start event
    Display: "Charging..." during Qi charge (RGB pulse blue)

  RUNTIME ESTIMATES:
    Active (Wi-Fi on, 10-min poll):     ~4 hours on 150 mAh
    Light sleep (wake 1x/10min):        ~18 hours on 150 mAh
    Deep sleep (wake on notif only):    ~48 hours on 150 mAh
    Charging (5W Qi, 82% efficient):    ~25 min to full


--------------------------------------------------------------------------------
12 // FACTORY PROVISIONING PROCEDURE
--------------------------------------------------------------------------------

  STEP 1: Flash factory firmware
    esptool.py --chip esp32s3 --port /dev/ttyUSB0 \
      write_flash 0x0 build/bootloader/bootloader.bin \
                  0x8000 build/partition_table/partition-table.bin \
                  0x10000 build/cosmo_pager.bin \
                  0x491000 build/storage.bin
    Time: ~12s per unit

  STEP 2: Provision unique identity
    provisioning_tool.py --port /dev/ttyUSB0 \
      --device-id $(uuidgen) \
      --token $(openssl rand -hex 32) \
      --register-url https://lot-systems.com/api/device/register
    ; Posts {deviceId, token} to LOT server → device registered
    ; Stores deviceId + token to NVS via serial command

  STEP 3: Wi-Fi provisioning
    Use ESP BLE Provisioning app or:
    provisioning_tool.py --ssid <SSID> --pass <PASS>
    ; Or: device enters soft-AP mode on first boot if no Wi-Fi stored

  STEP 4: Factory self-test (10 steps per Section 06 of HW-SPEC)
    test_runner.py --port /dev/ttyUSB0
    ; PASS/FAIL printed per step, serial number stored in NVS on PASS


--------------------------------------------------------------------------------
13 // FIRMWARE CHANGELOG
--------------------------------------------------------------------------------

  v1.0.0  2026-06-26   Initial release
    - TaskWifi, TaskNotify, TaskDisplay, TaskSensor, TaskButton
    - TaskCamera, TaskOTA, TaskRGB, TaskPower, TaskHeartbeat, TaskSession
    - BME688 BSEC2 LP mode integration
    - E-paper GDEP010WS1 full/partial refresh
    - OV2640 JPEG capture + HTTP multipart upload
    - Secure Boot V2 + Flash Encryption enabled
    - Factory provisioning tool (provisioning_tool.py)
    - Session CBOR compression (32 sessions ring buffer)


================================================================================
END OF DOCUMENT — LOT-COMPUTER-FIRMWARE-v1
CLASSIFICATION: RESTRICTED // S-2 EYES
LOT SYSTEMS CORPORATION | brand.lot-systems.com
================================================================================
