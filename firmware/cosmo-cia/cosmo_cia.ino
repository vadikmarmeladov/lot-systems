/*
 * COSMO® CIA Firmware v1.0
 * LOT Systems Connected Intelligence Architecture
 *
 * Board:     ESP32-S3-MINI-1-N8
 * Framework: Arduino (ESP32 Arduino Core 3.x)
 * Inventor:  Vadik Marmeladov — COSMO® CIA
 *
 * Build: pio run  OR  Arduino IDE with ESP32S3 Dev Module
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <OneButton.h>
#include <GxEPD2_BW.h>
#include <bsec2.h>
#include <esp_camera.h>
#include "config.h"

// ── Global objects ────────────────────────────────────────────────────────────

Preferences     prefs;
OneButton       copyBtn(BTN_COPY, true, true);  // active low, internal pull-up
Bsec2           bme;
HTTPClient      http;

// E-paper display: GxEPD2 driver for GDEH0154D67 (200x200, SPI)
GxEPD2_BW<GxEPD2_154_D67, GxEPD2_154_D67::HEIGHT> display(
  GxEPD2_154_D67(DISP_CS, DISP_DC, DISP_RST, DISP_BUSY)
);

// ── State ─────────────────────────────────────────────────────────────────────

struct AppState {
  String  apiToken;
  String  serverUrl;
  String  deviceSerial;
  bool    wifiConnected   = false;
  bool    apiConnected    = false;
  int     batteryPct      = 100;
  bool    isCharging      = false;
  float   temperature     = 0.0f;
  float   humidity        = 0.0f;
  float   pressure        = 0.0f;
  float   gasResistance   = 0.0f;
  int     iaqIndex        = 0;
  int     iaqAccuracy     = 0;
  String  currentNotificationId   = "";
  String  currentNotificationMsg  = "";
  String  currentNotificationSrc  = "";
  unsigned long lastNotifPoll     = 0;
  unsigned long lastSensorUpload  = 0;
  unsigned long lastHeartbeat     = 0;
  unsigned long lastBsecSave      = 0;
  unsigned long lastActivityMs    = 0;
};

AppState state;

// ── BSEC2 callback ───────────────────────────────────────────────────────────

void bsecCallback(const bme68xData data, const bsecOutputs outputs, Bsec2 bsec) {
  for (uint8_t i = 0; i < outputs.nOutputs; i++) {
    const bsecData& o = outputs.output[i];
    switch (o.sensor_id) {
      case BSEC_OUTPUT_RAW_TEMPERATURE:
        state.temperature = o.signal; break;
      case BSEC_OUTPUT_RAW_HUMIDITY:
        state.humidity = o.signal; break;
      case BSEC_OUTPUT_RAW_PRESSURE:
        state.pressure = o.signal / 100.0f; break;  // Pa → hPa
      case BSEC_OUTPUT_RAW_GAS:
        state.gasResistance = o.signal; break;
      case BSEC_OUTPUT_IAQ:
        state.iaqIndex    = (int)o.signal;
        state.iaqAccuracy = o.accuracy;
        break;
    }
  }
}

// ── Display helpers ───────────────────────────────────────────────────────────

void displayLogo() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);
    display.setFont(nullptr);
    display.setCursor(60, 80);
    display.setTextSize(2);
    display.print("COSMO");
    display.setCursor(72, 106);
    display.setTextSize(1);
    display.print("CIA");
    display.setCursor(30, 140);
    display.setTextSize(1);
    display.print("lot-systems.com");
    // Border
    display.drawRect(2, 2, DISPLAY_WIDTH - 4, DISPLAY_HEIGHT - 4, GxEPD_BLACK);
  } while (display.nextPage());
}

void displayNotification(const String& msg, const String& source, const String& timestamp) {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);

    // Status bar
    display.fillRect(0, 0, DISPLAY_WIDTH, STATUS_BAR_HEIGHT, GxEPD_BLACK);
    display.setTextColor(GxEPD_WHITE);
    display.setTextSize(1);
    display.setCursor(4, 6);
    display.print("LOT");
    display.setCursor(140, 6);
    display.print("BAT:");
    display.print(state.batteryPct);
    display.print("%");

    // Notification text (word-wrapped manually)
    display.setTextColor(GxEPD_BLACK);
    display.setTextSize(2);
    int y = 32;
    int lineLen = 10; // chars per line at size 2
    for (int i = 0; i < (int)msg.length(); i += lineLen) {
      String line = msg.substring(i, min((int)msg.length(), i + lineLen));
      display.setCursor(8, y);
      display.print(line);
      y += 22;
      if (y > 140) break;
    }

    // Timestamp
    display.setTextSize(1);
    display.setCursor(8, 155);
    display.print(timestamp);

    // Source label
    display.setCursor(8, 168);
    display.print("via: ");
    display.print(source);

    // Footer bar
    display.fillRect(0, DISPLAY_HEIGHT - FOOTER_BAR_HEIGHT, DISPLAY_WIDTH, FOOTER_BAR_HEIGHT, GxEPD_BLACK);
    display.setTextColor(GxEPD_WHITE);
    display.setCursor(4, DISPLAY_HEIGHT - 14);
    display.print("[O] Copy  ");
    if (state.isCharging) display.print("CHG");
    else display.print("OK");

  } while (display.nextPage());
}

void displayStatus(const String& line1, const String& line2 = "") {
  display.setPartialWindow(0, STATUS_BAR_HEIGHT, DISPLAY_WIDTH, DISPLAY_HEIGHT - STATUS_BAR_HEIGHT - FOOTER_BAR_HEIGHT);
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setTextColor(GxEPD_BLACK);
    display.setTextSize(1);
    display.setCursor(8, STATUS_BAR_HEIGHT + 16);
    display.print(line1);
    if (line2.length() > 0) {
      display.setCursor(8, STATUS_BAR_HEIGHT + 32);
      display.print(line2);
    }
  } while (display.nextPage());
}

// ── Battery (MAX17048 I2C fuel gauge) ─────────────────────────────────────────

int readBatteryPercent() {
  Wire.beginTransmission(MAX17048_ADDR);
  Wire.write(0x04);  // SOC register
  Wire.endTransmission(false);
  Wire.requestFrom(MAX17048_ADDR, 2);
  if (Wire.available() >= 2) {
    int msb = Wire.read();
    int lsb = Wire.read();
    return msb;  // 1 LSB = 1/256 %, MSB = integer %
  }
  return -1;
}

// ── Charging status (STWLC68 I2C) ────────────────────────────────────────────

bool readChargingStatus() {
  Wire.beginTransmission(STWLC68_ADDR);
  Wire.write(0x34);  // CHG_STATUS register
  Wire.endTransmission(false);
  Wire.requestFrom(STWLC68_ADDR, 1);
  if (Wire.available()) {
    uint8_t reg = Wire.read();
    return (reg & 0x02) != 0;  // bit 1 = charging active
  }
  return false;
}

// ── LOT API calls ─────────────────────────────────────────────────────────────

bool apiPing() {
  http.begin(state.serverUrl + API_PING);
  http.addHeader("Authorization", "Bearer " + state.apiToken);
  int code = http.GET();
  http.end();
  return code == 200;
}

String fetchNotifications() {
  http.begin(state.serverUrl + API_NOTIFICATIONS);
  http.addHeader("Authorization", "Bearer " + state.apiToken);
  int code = http.GET();
  if (code != 200) { http.end(); return ""; }
  String body = http.getString();
  http.end();
  return body;
}

void ackNotification(const String& notifId) {
  http.begin(state.serverUrl + String(API_NOTIFICATIONS_ACK));
  http.addHeader("Authorization", "Bearer " + state.apiToken);
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<128> doc;
  doc["notificationId"] = notifId;
  String body;
  serializeJson(doc, body);
  http.POST(body);
  http.end();
}

void logEvent(const char* event, const char* extra = nullptr) {
  http.begin(state.serverUrl + API_EVENT);
  http.addHeader("Authorization", "Bearer " + state.apiToken);
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<256> doc;
  doc["event"] = event;
  if (extra) {
    doc["metadata"]["detail"] = extra;
  }
  doc["metadata"]["batteryLevel"] = state.batteryPct;
  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  http.end();
  Serial.printf("[API] logEvent %s → %d\n", event, code);
}

void uploadSensor() {
  http.begin(state.serverUrl + API_SENSOR);
  http.addHeader("Authorization", "Bearer " + state.apiToken);
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<256> doc;
  doc["temperature"]   = serialized(String(state.temperature, 1));
  doc["humidity"]      = serialized(String(state.humidity, 0));
  doc["pressure"]      = serialized(String(state.pressure, 1));
  doc["gasResistance"] = serialized(String(state.gasResistance, 0));
  doc["iaqIndex"]      = state.iaqIndex;
  doc["batteryLevel"]  = state.batteryPct;
  doc["firmwareVersion"] = FIRMWARE_VERSION;
  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  http.end();
  Serial.printf("[API] uploadSensor → %d\n", code);
}

// ── Notification processing ───────────────────────────────────────────────────

void processNotifications() {
  String raw = fetchNotifications();
  if (raw.length() == 0) return;

  DynamicJsonDocument doc(1024);
  if (deserializeJson(doc, raw) != DeserializationError::Ok) return;

  JsonArray notifs = doc["notifications"].as<JsonArray>();
  if (notifs.size() == 0) return;

  JsonObject first = notifs[0];
  String id  = first["id"].as<String>();
  String msg = first["message"].as<String>();
  String src = first["source"].as<String>();
  String ts  = first["createdAt"].as<String>().substring(11, 16); // HH:MM

  if (id != state.currentNotificationId) {
    state.currentNotificationId  = id;
    state.currentNotificationMsg = msg;
    state.currentNotificationSrc = src;
    displayNotification(msg, src, ts);
    ackNotification(id);
    Serial.printf("[NOTIF] Displayed: %s\n", msg.c_str());
  }
}

// ── Camera capture ────────────────────────────────────────────────────────────

void captureAndUpload() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("[CAM] Capture failed");
    return;
  }

  // Encode to base64
  String b64;
  b64.reserve((fb->len * 4) / 3 + 4);
  static const char* enc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (size_t i = 0; i < fb->len; i += 3) {
    uint8_t a = fb->buf[i], b = (i+1 < fb->len) ? fb->buf[i+1] : 0, c = (i+2 < fb->len) ? fb->buf[i+2] : 0;
    b64 += enc[a >> 2];
    b64 += enc[((a & 3) << 4) | (b >> 4)];
    b64 += (i+1 < fb->len) ? enc[((b & 0xF) << 2) | (c >> 6)] : '=';
    b64 += (i+2 < fb->len) ? enc[c & 0x3F] : '=';
    if (b64.length() > 65000) break;  // cap at 65KB for 320x240 JPEG
  }
  esp_camera_fb_return(fb);

  http.begin(state.serverUrl + API_EVENT);
  http.addHeader("Authorization", "Bearer " + state.apiToken);
  http.addHeader("Content-Type", "application/json");
  DynamicJsonDocument doc(70000);
  doc["event"] = "camera_capture";
  doc["metadata"]["imageB64"] = b64;
  doc["metadata"]["format"] = "jpeg";
  doc["metadata"]["width"] = 320;
  doc["metadata"]["height"] = 240;
  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  http.end();
  Serial.printf("[CAM] Upload → %d\n", code);
}

// ── Button handlers ───────────────────────────────────────────────────────────

void onCopyClick() {
  state.lastActivityMs = millis();
  digitalWrite(LED_CHG, HIGH);
  delay(80);
  digitalWrite(LED_CHG, LOW);

  displayStatus("Logging...", "Copy button");

  if (state.apiConnected) {
    logEvent("copy_button");
    displayStatus("Logged!", "See Log tab");
  } else {
    displayStatus("Offline", "No WiFi");
  }
  delay(1800);

  // Return to notification display
  if (state.currentNotificationMsg.length() > 0) {
    displayNotification(state.currentNotificationMsg, state.currentNotificationSrc, "");
  }
}

void onCopyHold() {
  state.lastActivityMs = millis();
  displayStatus("Capturing...", "Camera");
  if (state.apiConnected) {
    captureAndUpload();
    displayStatus("Sent!", "Photo logged");
  } else {
    displayStatus("Offline", "No WiFi");
  }
  delay(2000);
  if (state.currentNotificationMsg.length() > 0) {
    displayNotification(state.currentNotificationMsg, state.currentNotificationSrc, "");
  }
}

// ── WiFi setup portal custom parameters ──────────────────────────────────────

WiFiManagerParameter paramApiToken("api_token", "LOT API Token (lot_device_...)", "", 64);
WiFiManagerParameter paramServerUrl("server_url", "LOT Server URL", LOT_SERVER_URL, 64);

void saveWifiConfig() {
  prefs.begin(NVS_NAMESPACE, false);
  prefs.putString(NVS_API_TOKEN, paramApiToken.getValue());
  prefs.putString(NVS_SERVER_URL, paramServerUrl.getValue());
  prefs.end();
  Serial.println("[NVS] Credentials saved");
}

// ── Camera init ───────────────────────────────────────────────────────────────

void initCamera() {
  camera_config_t cfg;
  cfg.ledc_channel = LEDC_CHANNEL_0;
  cfg.ledc_timer   = LEDC_TIMER_0;
  cfg.pin_d0 = CAM_D0; cfg.pin_d1 = CAM_D1; cfg.pin_d2 = CAM_D2; cfg.pin_d3 = CAM_D3;
  cfg.pin_d4 = CAM_D4; cfg.pin_d5 = CAM_D5; cfg.pin_d6 = CAM_D6; cfg.pin_d7 = CAM_D7;
  cfg.pin_xclk  = CAM_XCLK;
  cfg.pin_pclk  = CAM_PCLK;
  cfg.pin_vsync = CAM_VSYNC;
  cfg.pin_href  = CAM_HREF;
  cfg.pin_sscb_sda = CAM_SIOD;
  cfg.pin_sscb_scl = CAM_SIOC;
  cfg.pin_pwdn  = -1;
  cfg.pin_reset = -1;
  cfg.xclk_freq_hz = 20000000;
  cfg.pixel_format = PIXFORMAT_JPEG;
  cfg.frame_size   = FRAMESIZE_QVGA;  // 320x240
  cfg.jpeg_quality = 12;
  cfg.fb_count     = 1;
  cfg.fb_location  = CAMERA_FB_IN_PSRAM;
  cfg.grab_mode    = CAMERA_GRAB_WHEN_EMPTY;

  esp_err_t err = esp_camera_init(&cfg);
  if (err != ESP_OK) {
    Serial.printf("[CAM] Init failed: 0x%x\n", err);
  } else {
    Serial.println("[CAM] OV2640 initialized");
  }
}

// ── BSEC2 state persistence ───────────────────────────────────────────────────

void loadBsecState() {
  prefs.begin(NVS_NAMESPACE, true);
  size_t len = prefs.getBytesLength(NVS_BSEC_STATE);
  if (len > 0) {
    uint8_t* buf = new uint8_t[len];
    prefs.getBytes(NVS_BSEC_STATE, buf, len);
    bme.setState(buf);
    delete[] buf;
    Serial.println("[BSEC2] State restored from NVS");
  }
  prefs.end();
}

void saveBsecState() {
  uint8_t stateArr[BSEC_MAX_STATE_BLOB_SIZE];
  uint32_t n;
  bme.getState(stateArr, &n);
  prefs.begin(NVS_NAMESPACE, false);
  prefs.putBytes(NVS_BSEC_STATE, stateArr, n);
  prefs.end();
  Serial.printf("[BSEC2] State saved (%u bytes)\n", n);
}

// ── Setup ─────────────────────────────────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  Serial.println("\n[BOOT] COSMO CIA v" FIRMWARE_VERSION);

  // GPIO
  pinMode(BTN_COPY, INPUT_PULLUP);
  pinMode(LED_CHG, OUTPUT);
  digitalWrite(LED_CHG, LOW);

  // I2C
  Wire.begin(I2C_SDA, I2C_SCL);

  // Display init
  SPI.begin(SPI_SCK, -1, SPI_MOSI, DISP_CS);
  display.init(115200);
  display.setRotation(0);
  displayLogo();
  delay(1500);

  // Camera init
  initCamera();

  // BME688 / BSEC2
  if (bme.begin(BME688_ADDR, Wire)) {
    loadBsecState();
    bsecSensor_t sensorList[] = {
      BSEC_OUTPUT_IAQ,
      BSEC_OUTPUT_RAW_TEMPERATURE,
      BSEC_OUTPUT_RAW_HUMIDITY,
      BSEC_OUTPUT_RAW_PRESSURE,
      BSEC_OUTPUT_RAW_GAS,
    };
    bme.updateSubscription(sensorList, ARRAY_LEN(sensorList), BSEC_SAMPLE_RATE);
    bme.attachCallback(bsecCallback);
    Serial.println("[BME688] BSEC2 initialized");
  } else {
    Serial.println("[BME688] Init failed");
  }

  // Button gestures
  copyBtn.attachClick(onCopyClick);
  copyBtn.attachLongPressStart(onCopyHold);
  copyBtn.setPressTicks(BTN_HOLD_MS);

  // Load stored credentials
  prefs.begin(NVS_NAMESPACE, true);
  state.apiToken   = prefs.getString(NVS_API_TOKEN, "");
  state.serverUrl  = prefs.getString(NVS_SERVER_URL, LOT_SERVER_URL);
  state.deviceSerial = prefs.getString(NVS_DEVICE_SERIAL, "COSMO-" + String((uint32_t)ESP.getEfuseMac(), HEX));
  prefs.end();

  // WiFiManager
  displayStatus("Connecting...", "WiFi");
  WiFiManager wm;
  wm.addParameter(&paramApiToken);
  wm.addParameter(&paramServerUrl);
  wm.setSaveConfigCallback(saveWifiConfig);
  wm.setConfigPortalTimeout(WIFI_AP_TIMEOUT);

  if (!wm.autoConnect(WIFI_AP_NAME, WIFI_AP_PASS)) {
    Serial.println("[WiFi] Failed — offline mode");
    displayStatus("Offline", "No WiFi");
    state.wifiConnected = false;
  } else {
    Serial.printf("[WiFi] Connected: %s\n", WiFi.localIP().toString().c_str());
    state.wifiConnected = true;
    displayStatus("Connected", WiFi.SSID());

    // Validate API token
    if (state.apiToken.length() > 10) {
      state.apiConnected = apiPing();
      if (state.apiConnected) {
        Serial.println("[API] Connected to LOT Systems");
        logEvent("startup");
        displayStatus("LOT Ready", state.serverUrl.substring(8, 22));
      } else {
        Serial.println("[API] Token invalid — portal needed");
        displayStatus("Token invalid", "Re-setup needed");
      }
    } else {
      displayStatus("No token", "Visit portal");
    }
  }

  // Initial sensor read
  state.batteryPct = readBatteryPercent();
  state.isCharging = readChargingStatus();
  digitalWrite(LED_CHG, state.isCharging ? HIGH : LOW);

  state.lastActivityMs = millis();
  Serial.println("[BOOT] Setup complete");
}

// ── Main loop ─────────────────────────────────────────────────────────────────

void loop() {
  unsigned long now = millis();

  // Button polling (OneButton library)
  copyBtn.tick();

  // BSEC2 sensor processing
  if (!bme.run()) {
    // bsec not ready yet this tick — normal
  }

  if (!state.wifiConnected || !state.apiConnected) {
    delay(100);
    return;
  }

  // Notification poll
  if (now - state.lastNotifPoll >= NOTIFICATION_POLL_MS) {
    state.lastNotifPoll = now;
    processNotifications();
  }

  // Sensor upload
  if (now - state.lastSensorUpload >= SENSOR_UPLOAD_MS) {
    state.lastSensorUpload = now;
    state.batteryPct = readBatteryPercent();
    state.isCharging = readChargingStatus();
    digitalWrite(LED_CHG, state.isCharging ? HIGH : LOW);
    if (state.iaqAccuracy >= 1) uploadSensor();
  }

  // Heartbeat ping
  if (now - state.lastHeartbeat >= HEARTBEAT_MS) {
    state.lastHeartbeat = now;
    state.apiConnected = apiPing();
  }

  // BSEC2 state save
  if (now - state.lastBsecSave >= BSEC_STATE_SAVE_MS) {
    state.lastBsecSave = now;
    saveBsecState();
  }

  // Deep sleep if idle for 30 min
  if (now - state.lastActivityMs >= DEEP_SLEEP_AFTER_MS && !state.isCharging) {
    Serial.println("[POWER] Entering deep sleep");
    displayStatus("Sleeping", "Press button to wake");
    delay(1000);
    esp_deep_sleep_start();
  }

  // Light sleep between polls (conserve power)
  unsigned long msUntilNextPoll = NOTIFICATION_POLL_MS - (now - state.lastNotifPoll);
  if (msUntilNextPoll > 2000) {
    uint64_t sleepUs = min((unsigned long)LIGHT_SLEEP_DURATION_MS, msUntilNextPoll - 500) * 1000ULL;
    esp_sleep_enable_timer_wakeup(sleepUs);
    esp_sleep_enable_gpio_wakeup();
    gpio_wakeup_enable((gpio_num_t)BTN_COPY, GPIO_INTR_LOW_LEVEL);
    esp_light_sleep_start();
  }
}
