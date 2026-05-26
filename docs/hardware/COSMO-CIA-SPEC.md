# COSMO® CIA — Hardware Specification

**Product:** COSMO® CIA (Connected Intelligence Appliance)
**Inventor:** Vadik Marmeladov, COSMO® CIA — LOT Systems
**Version:** 1.0 — Engineering Release
**Date:** 2026-05-26
**Status:** Pre-production design

---

## 1. Overview

COSMO® CIA is a palm-sized, AI-connected notification and self-care sensor device that pairs with the LOT Systems platform (lot-systems.com). It receives autonomous notifications from the LOT site ("Coffee time!", QOS state updates, Memory Engine prompts), captures ambient environmental data, and returns a single "Copy" signal to the LOT Log tab — closing the loop between the system and the person.

**Design philosophy:** The system talking to the person. Terse. Alive. Not a status widget — a transmission object.

---

## 2. Physical Dimensions

| Parameter | Value |
|---|---|
| Form factor | Flat square |
| Length × Width | 40 mm × 40 mm |
| Thickness (target) | 5 mm |
| Thickness (engineering minimum) | 5.2 mm |
| Mass (estimated) | 28–34 g |
| Enclosure material | 316L Stainless Steel (2-part CNC) |
| IP rating | IP52 (dust-protected, drip-resistant) |

### 2.1 Thickness Budget

The 5mm form factor is the tightest engineering constraint. Budget allocation:

```
Rear SS wall (polished):        0.5 mm
Qi flex coil (rear):            0.45 mm
Air gap / adhesive:             0.15 mm
LiPo cell (Grepow UFX type):    1.0 mm
PCB substrate (4-layer):        0.6 mm
Front components clearance:     1.2 mm
  — BME688 (0.93 mm tallest)
  — Passive components
Front e-ink panel (GDEM0154D67):1.1 mm  ← flush to front face
Front SS frame wall:            0.5 mm
──────────────────────────────────────
Total:                          5.5 mm target / 5.0 mm floor
```

> Engineering note: camera lens is flush-mount pinhole design (Himax HM01B0 or OV7675 flat-optic). No lens protrusion. Mirror-flat front glass panel covers the e-ink and camera flush.

---

## 3. Enclosure Design

### 3.1 Two-Part Stainless Steel Body

**Part A — Rear Shell (Polished Mirror)**
- Material: 316L Stainless Steel
- Finish: Mirror polish, Ra ≤ 0.05 µm (electro-polished + hand buffed)
- Wall thickness: 0.5 mm
- Features: Qi charging window (see §3.2), serial number engrave (rear, micro-etched)
- Corners: radius 2.0 mm

**Part B — Front Frame**
- Material: 316L Stainless Steel (satin/brushed finish, Ra ≈ 0.4 µm)
- Finish: Bead-blasted satin
- Features: 3 cutouts — camera aperture (3mm ⌀), e-ink display window (31×31mm), Copy button aperture (8×8mm, centered bottom)
- Front face: optically clear borosilicate glass panel (0.4mm), flush-bonded over e-ink + camera aperture
- Button: black anodized aluminium keycap, 8×8×1.2mm, flush with frame

**Assembly join:** 4× M1.0 titanium screws at corners (countersunk, invisible flush). Silicone perimeter gasket between Part A and Part B for IP52.

### 3.2 Qi Charging Window

316L SS attenuates Qi field. The rear shell includes a 28×28mm laser-cut aperture filled with injection-moulded PEEK (polyether ether ketone, dielectric, cosmetically flush) over which the flex Qi coil is bonded. Frame appearance is continuous mirror SS; only close inspection reveals the polymer inset.

---

## 4. Electronic Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    COSMO® CIA PCB (40×38mm, 4-layer)    │
│                                                         │
│  ┌──────────────┐   ┌──────────┐   ┌────────────────┐  │
│  │ ESP32-S3     │   │ BME688   │   │ BQ51013B       │  │
│  │ (MCU+WiFi    │   │ (Temp/   │   │ (Qi Receiver   │  │
│  │ +BLE+AI)     │   │ Hum/Pres │   │ + Charger IC)  │  │
│  │              │   │ /Gas/IAQ)│   │                │  │
│  └──────┬───────┘   └────┬─────┘   └───────┬────────┘  │
│         │  I2C            │ I2C             │           │
│  ┌──────┴───────┐   ┌────┴─────┐   ┌───────┴────────┐  │
│  │ e-ink SPI    │   │ OV7675   │   │ LiPo 150mAh    │  │
│  │ GDEM0154D67  │   │ Camera   │   │ + MCP73831     │  │
│  │ 1.54" 200x200│   │ (DVP)    │   │ (charge mgmt)  │  │
│  └──────────────┘   └──────────┘   └────────────────┘  │
│                                                         │
│  [Copy Button] — GPIO + haptic driver (DRV2605L)        │
│  [USB-C] — programming/debug only (no charging path)    │
│  [Status LED] — single RGB LED (SK6812-mini-e, 3.5×3mm) │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Microcontroller

**Part:** Espressif ESP32-S3-WROOM-1-N8R8
**Package:** LCC 18×18mm module (integrates antenna)

| Feature | Detail |
|---|---|
| CPU | Xtensa LX7 dual-core, 240 MHz |
| Flash | 8 MB SPI Flash (onboard) |
| PSRAM | 8 MB Octal PSRAM |
| WiFi | 802.11 b/g/n, 2.4 GHz |
| Bluetooth | BLE 5.0 + Bluetooth Mesh |
| Camera interface | DVP (8-bit parallel) |
| AI acceleration | Vector instructions, 200 TOPS int8 |
| Operating voltage | 3.3 V |
| Deep sleep current | 7 µA |

**Rationale:** The S3's AI vector instructions enable local edge inference for BME688 BSEC AI classification without cloud round-trips. The 8MB PSRAM supports JPEG camera frame buffering. Native DVP interface connects directly to OV7675.

---

## 6. Display

**Part:** Good Display GDEM0154D67 (1.54" e-Paper, B/W, SPI)

| Feature | Detail |
|---|---|
| Technology | E-ink (electrophoretic) |
| Size | 1.54 inch diagonal |
| Resolution | 200 × 200 px |
| Active area | 27.6 × 27.6 mm |
| Colours | Black / White (2-bit) |
| Refresh time | 15 s full / 0.3 s partial |
| Power (static) | 0 µW (bistable — retains image without power) |
| Power (refresh) | 26 mW peak |
| Interface | SPI (4-wire) |
| Thickness | 1.05 mm |

**Display role:** Shows autonomous notifications received from lot-systems.com. Because e-ink is bistable, notifications persist even when device is in deep sleep — battery life extends dramatically. Partial refresh mode updates single lines in 300ms for real-time feel.

---

## 7. Camera

**Part:** OmniVision OV7675 (or pin-compatible OV7670)

| Feature | Detail |
|---|---|
| Resolution | VGA (640×480) — 0.3 MP |
| Optical format | 1/6" CMOS |
| Lens height | 2.1 mm (flat optic, no protrusion) |
| Output format | YUV 4:2:2 / RGB565 / JPEG |
| Interface | DVP 8-bit parallel |
| Frame rate | 30 fps VGA |
| Power | 60 mW active |

**Camera role:** Session snapshot — user can trigger a photo attached to a Log entry via the Copy button (long-press). Photo is compressed to JPEG, sent via LOT API to the user's Log tab. Also used for QR-code provisioning during Wi-Fi setup.

---

## 8. Environmental Sensors

**Part:** Bosch Sensortec BME688

| Sensor | Range | Accuracy |
|---|---|---|
| Temperature | −40 to +85 °C | ±0.5 °C |
| Relative humidity | 0–100% RH | ±3% RH |
| Barometric pressure | 300–1100 hPa | ±1.0 hPa |
| Gas / VOC (IAQ) | 0–500 IAQ score | AI-classified |

**AI feature:** Bosch BSEC2 (Board Support for Environmental Sensing & Control) library runs on ESP32-S3, classifying air quality, predicting CO₂ equivalent, and detecting VOC events — all edge-local, no cloud required.

**Sensor data sent to LOT:** Temperature, humidity, pressure, and IAQ score are included in every Log entry. The LOT Memory Engine uses these as environmental context tags on user sessions.

---

## 9. Power System

### 9.1 Battery

**Supplier:** Grepow UFX Series (custom thin LiPo)
**Part reference:** Grepow GRP3035012 (approx. 40×30×1.0 mm, 100–120 mAh, 3.7V)

| Parameter | Value |
|---|---|
| Chemistry | LiPo (lithium polymer) |
| Nominal voltage | 3.7 V |
| Capacity | 120 mAh |
| Max discharge | 0.5C (60 mA) |
| Operating temp | −10 to +50 °C |
| Estimated standby life | 7–10 days (deep sleep + e-ink) |
| Estimated active life | 18–24 hours (WiFi on, 1 notification/hour) |

### 9.2 Wireless Charging

**Receiver IC:** Texas Instruments BQ51013BRHLR (Qi v1.1, 5W)
**Coil:** Wurth Elektronik 760308102214 (30×30mm flex Qi coil, 6.3 µH)

| Parameter | Value |
|---|---|
| Standard | Qi v1.1 (WPC) |
| Power | 5W input, ~4W delivered |
| Charge time (0–100%) | ~25 min at 5W |
| Efficiency | ~72% at 5mm air gap |
| Charger compatibility | Any Qi v1.1 pad |

**Compatible charger (recommended accessory):** Belkin BOOST↑CHARGE 5W Wireless Charging Pad (thin pad, flush on desk).

### 9.3 Charge Management

**Part:** Microchip MCP73831T-2ACI/OT (LiPo charge controller)
- Termination: 4.2V
- Charge current: 100mA (programmable via PROG resistor)
- Safety: thermal regulation, overcharge protection

### 9.4 Power Rails

| Rail | Voltage | Source | Consumers |
|---|---|---|---|
| VBAT | 3.7V (3.0–4.2V) | LiPo | All via regulators |
| VDD_3V3 | 3.3V | TPS62740 LDO | ESP32-S3, peripherals |
| VDD_1V8 | 1.8V | internal ESP32 LDO | Camera I/O |
| VDD_EINK | 3.3V | shared | e-ink driver |

---

## 10. Button: Copy

| Parameter | Value |
|---|---|
| Type | Tactile dome switch |
| Part | Panasonic EVQPUJ02K |
| Actuation force | 1.0 N |
| Travel | 0.15 mm |
| Height above PCB | 0.8 mm |
| Keycap | Aluminium, 8×8mm, anodised black |
| Single press | Copy current notification → POST to LOT Log tab |
| Long press (2 s) | Capture camera snapshot → attach to Log entry |
| Double press | Cycle display: notification / sensor data / time |

**Haptic feedback:** DRV2605L haptic driver (I2C) + 10mm LRA motor (Z-axis, 1mm thick) confirms each press with 10ms pulse.

---

## 11. Connectivity

| Interface | Spec | Purpose |
|---|---|---|
| WiFi | 802.11n 2.4GHz, WPA2/WPA3 | Primary data link to lot-systems.com |
| Bluetooth LE 5.0 | BLE GATT | Provisioning (mobile app), BLE beacon |
| USB-C | USB 2.0 FS | Firmware flashing / serial debug only |

**Provisioning flow:** First-boot → BLE advertising → LOT mobile/web companion app discovers device → sends WiFi credentials + LOT API token → stored in ESP32 NVS (encrypted flash partition).

---

## 12. LOT API Integration

The device authenticates with lot-systems.com using a per-device API token (generated at device registration, stored in encrypted NVS). All communication is HTTPS (TLS 1.3).

### 12.1 Inbound: Notification Pull

```
GET https://lot-systems.com/api/device/notifications
Authorization: Bearer <device-token>
X-Device-ID: <uuid>
```

Poll interval: 5 minutes (wake from deep sleep, check, update display if changed, sleep).

### 12.2 Outbound: Copy Button → Log Tab

```
POST https://lot-systems.com/api/device/log
Authorization: Bearer <device-token>
Content-Type: application/json

{
  "deviceId": "<uuid>",
  "event": "copy",
  "notificationId": "<id of displayed notification>",
  "timestamp": "2026-05-26T10:00:00Z",
  "sensors": {
    "temperature": 22.4,
    "humidity": 45,
    "pressure": 1013.2,
    "iaq": 87,
    "iaqAccuracy": 3
  }
}
```

### 12.3 Outbound: Camera Log (Long-press)

```
POST https://lot-systems.com/api/device/log/photo
Authorization: Bearer <device-token>
Content-Type: multipart/form-data

— deviceId, event: "photo_copy", jpeg_image (JPEG, max 80KB)
```

---

## 13. Security

| Layer | Implementation |
|---|---|
| Transport | TLS 1.3, certificate pinning (lot-systems.com cert) |
| Storage | ESP32 flash encryption (AES-256) + Secure Boot v2 |
| Token | 256-bit random device token, stored in eFuse-protected NVS partition |
| OTA | HTTPS signed firmware (ESP-IDF OTA, RSA-2048 signature) |
| Physical | No exposed JTAG pads on production units |

---

## 14. Notifications — Display Content

Notifications are plain-text strings (max 128 chars) sent from lot-systems.com. Examples:

```
Coffee time!
QOS mode: peak — commit fully today.
Memory prompt: How did your morning ritual feel?
Weather: 18°C, clear. Good walk conditions.
Hydration: 6h since last log.
```

Display layout (200×200 px, e-ink):
```
┌──────────────────────┐
│ LOT  ·  10:42        │  ← 12px header: logo + time
│──────────────────────│
│                      │
│  Coffee time!        │  ← 18px bold, word-wrapped
│                      │
│──────────────────────│
│ 22.4°C  45%  1013hPa │  ← 10px sensor footer
└──────────────────────┘
```

---

## 15. Operational States

| State | Description | Power |
|---|---|---|
| DEEP_SLEEP | Waiting, e-ink holds last notification | 90 µA |
| WAKE_POLL | WiFi on, GET notifications, update display | 85 mA |
| WAKE_COPY | WiFi on, POST log event | 80 mA |
| WAKE_OTA | Downloading firmware update | 90 mA |
| PROVISIONING | BLE advertising, awaiting credentials | 12 mA |
| CHARGING | Qi active, MCU in low-power | 40 mA draw from coil |

Wake cycle: every 5 min, ~3 sec active = 4 mA average → **~30-day battery life in poll-only mode** (120 mAh / 4 mA = 30h, but with display updates ~7–10 days realistic).

---

## 16. Regulatory Targets

| Certification | Region |
|---|---|
| FCC Part 15 | USA |
| CE (RED Directive) | EU |
| UKCA | UK |
| IC | Canada |
| RoHS | Global |
| Qi v1.1 WPC | Global |

> Note: The ESP32-S3-WROOM-1 module carries pre-certified FCC/CE modular approval. This significantly reduces certification scope to host device testing only.

---

*COSMO® CIA is a registered trademark. © 2026 LOT Systems / COSMO® CIA. All rights reserved.*
