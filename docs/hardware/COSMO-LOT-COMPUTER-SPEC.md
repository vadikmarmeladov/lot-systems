# COSMO® CIA — LOT Computer
## Hardware Product Specification

**Project:** COSMO LOT Computer  
**Inventor:** Vadik Marmeladov — COSMO® CIA  
**Organization:** LOT Systems  
**Document Version:** 1.0  
**Date:** 2026-05-26  
**Status:** Pre-Production Design  
**Production Target:** 100 units (Run 1)

---

## 1. Product Overview

The **COSMO LOT Computer** is an ultra-compact wearable pager-class device that bridges the LOT Systems AI platform to the physical world. It receives autonomous AI-generated notifications from lot-systems.com, surfaces them on a minimal screen, and allows the user to send one-tap signals back to the LOT Log tab via a dedicated **Copy** button.

### Design Philosophy

> One polished surface. One active surface. One button. Everything else is LOT.

The device is a **flat silver square**, 40 × 40 mm, 5 mm total height. It carries no operating system of its own — it is a physical extension of the LOT OS running on lot-systems.com.

---

## 2. Physical Dimensions & Form Factor

| Parameter | Value |
|---|---|
| Footprint | 40 mm × 40 mm |
| Total height | 5.0 mm |
| Body material | 316L Stainless Steel |
| Shell construction | 2-part CNC-machined body, friction-fit + M1.0 screws × 4 |
| Weight (estimated) | ~28 g |
| Color | Natural silver (316L) |

### Side A — Polished Mirror Back

- Full 40 × 40 mm mirror-polished 316L stainless steel
- No ports, no logos, no openings
- Surface finish: Ra ≤ 0.05 µm (mirror grade)
- Corner radius: 3 mm

### Side B — Active Front Face

| Feature | Position | Size |
|---|---|---|
| Screen (OLED/E-Ink) | Center | 28 × 28 mm visible area |
| Camera | Top-right corner | 5 mm circular aperture |
| Copy Button | Bottom-center | 8 × 4 mm rectangular recess |
| Status LED (RGB) | Bottom-left corner | 1.5 mm flush lens |
| USB-C Port (firmware flash only) | Bottom edge | 6.6 mm wide slot |
| Wireless charging receiver | Integrated inside shell | No external feature |

- Surface finish: Satin / bead-blasted (Ra ≈ 0.8 µm)
- Screen cutout glass: 0.5 mm optical cover glass, AR-coated

---

## 3. Hardware Architecture

```
┌─────────────────────────────────────────────────────┐
│                  COSMO LOT Computer                  │
│                                                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ ESP32-S3 │  │  Display  │  │  Camera OV2640   │  │
│  │  (MCU)   │  │ 1.3" OLED │  │  2MP, M12 lens   │  │
│  └────┬─────┘  └─────┬─────┘  └────────┬─────────┘  │
│       │              │                  │             │
│  ┌────▼─────────────▼──────────────────▼──────────┐  │
│  │                  SPI/I2C Bus                    │  │
│  └────┬────────────────────┬───────────────────────┘  │
│       │                    │                           │
│  ┌────▼───────┐   ┌────────▼──────────┐               │
│  │ BME688     │   │  Copy Button +    │               │
│  │ AI Weather │   │  Haptic Feedback  │               │
│  │ Sensor     │   │  (DRV2605L)       │               │
│  └────────────┘   └───────────────────┘               │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Power System                                    │ │
│  │  LiPo 380mAh → BQ25185 PMIC → 3.3V/1.8V rails  │ │
│  │  NU1619 Qi Receiver (5W) → Wireless charge       │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 Main Processing Unit

| Parameter | Value |
|---|---|
| IC | Espressif ESP32-S3-MINI-1U |
| CPU | Dual-core Xtensa LX7 @ 240 MHz |
| RAM | 512 KB SRAM + 8 MB PSRAM |
| Flash | 8 MB |
| Connectivity | Wi-Fi 802.11 b/g/n (2.4 GHz) + BLE 5.0 |
| AI Acceleration | Vector instructions for TFLite Micro |
| Package | 15.4 × 11.4 × 1.7 mm (LCC) |
| Operating voltage | 3.0–3.6 V |
| Notes | U.FL antenna connector → ceramic patch antenna on PCB edge |

### 4.2 Display

| Parameter | Value |
|---|---|
| Type | OLED — SSD1327 or SH1107 controller |
| Size | 1.3 inch diagonal |
| Resolution | 128 × 128 pixels |
| Color depth | 16-level grayscale |
| Interface | SPI (8 MHz) |
| Power | 15 mW typical |
| Cover glass | 0.5 mm optical glass, AR coat |
| Refresh rate | 60 fps max |
| Notes | White-on-black renders LOT notifications cleanly; no backlight required |

> **Alternative:** 1.54" Waveshare E-Paper (200×200, partial refresh 0.3s) for lower power. Recommended for v1.1.

### 4.3 Camera

| Parameter | Value |
|---|---|
| Sensor | OmniVision OV2640 |
| Resolution | 2 MP (1600×1200 max, JPEG output) |
| Interface | DVP (8-bit parallel) + I2C config |
| FOV | 65° |
| Focal length | Fixed, 2.8 mm M12 |
| Module size | 8 × 8 × 5 mm (custom lens mount) |
| Aperture placement | Flush with front face stainless, 5 mm circular cutout |
| Notes | Primary use: QR code scanning for device pairing + optional photo to LOT log |

### 4.4 Environmental / AI-Grade Sensors

| Sensor | IC | Measures | Interface | Notes |
|---|---|---|---|---|
| AI Weather Sensor | Bosch BME688 | Temp, Humidity, Pressure, Gas (VOC) | I2C | Bosch AI Studio compatible — classifies air quality profiles |
| Ambient Light | ams VEML7700 | Lux, UV index | I2C | Adjusts screen brightness automatically |
| Motion/Gesture | Bosch BMI270 | 6-axis IMU, step counter, tap detection | SPI | Wake-on-tap, flip-to-silence notifications |
| Microphone | PDM MEMS IMP34DT05 | Sound pressure level | PDM | Edge AI sound event detection (dog bark, alarm) |

### 4.5 Copy Button

| Parameter | Value |
|---|---|
| Mechanism | SMD tactile switch (Alps SKRPACE010) |
| Travel | 0.15 mm |
| Actuation force | 100 gF |
| Cover | Polished stainless steel key cap, 8 × 4 mm |
| Haptic feedback | TI DRV2605L with ERM motor — single 80ms buzz on press |
| Signal output | GPIO interrupt → ESP32-S3 → HTTP POST to `/api/hardware/event` |
| Log tag | `event: "copy_button_press"` → visible in LOT Log tab |

### 4.6 Power System

| Component | IC / Part | Spec |
|---|---|---|
| Battery | Custom LiPo pouch | 3.7V, 380 mAh, 38 × 30 × 2.5 mm |
| PMIC | TI BQ25185 | USB-C charging + Qi pass-through, 1A max charge |
| Wireless RX coil | NuVolta NU1619 | Qi 5W, 15 mm diameter coil, 0.4 mm total height |
| Regulator (3.3V) | TI TPS62840 | 750 mA, 90% efficiency |
| Regulator (1.8V) | TI TPS62740 | 300 mA (camera + sensor rail) |
| USB-C | USB2.0 full-speed, firmware flash + charge | |
| Estimated run time | ~48 h standby, ~8 h with screen active |
| Charge time | ~2.5 h via Qi 5W pad |

### 4.7 Wireless Charger (Companion Unit)

| Parameter | Value |
|---|---|
| Standard | Qi EPP (5W) |
| TX coil | 50 mm round |
| Enclosure | Matching 316L stainless disk, 60 mm diameter, 6 mm height |
| Cable | USB-C, 1 m |
| LED indicator | White LED ring (charging / full) |
| IC | Integrated Device Technology P9242-R |
| Surface finish | Mirror-polished (matches device back) |

---

## 5. PCB Design

### 5.1 PCBWay Specifications

| Parameter | Value |
|---|---|
| PCB service | PCBWay Standard Fabrication |
| Layers | 4-layer stackup |
| Board size | 37 × 37 mm |
| Board thickness | 0.8 mm |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Black |
| Silkscreen | White |
| Min trace/space | 4/4 mil |
| Min drill | 0.2 mm |
| Via fill | Resin-filled, copper-capped |
| Controlled impedance | Yes (50Ω for camera data lines) |
| Quantity | 100 PCBs (first production run) |
| PCBWay assembly | Yes — PCBA service (PCBWay will source and assemble SMD parts) |

### 5.2 4-Layer Stackup

```
Layer 1 (Top)    — Signal + RF components
Layer 2          — Ground plane (solid)
Layer 3          — 3.3V power plane
Layer 4 (Bottom) — Signal + battery connectors
```

### 5.3 Key Layout Rules

- ESP32 module placed at center for optimal antenna clearance (keep-out zone: 15 mm from top edge)
- Camera module on top-right corner with dedicated 1.8V island
- BME688 sensor placed near a vent slot in the stainless shell (0.5 mm gap for air exchange)
- Qi coil placed on bottom copper layer spanning Layer 4 (no metal pour in coil area on L3)
- USB-C connector flush-mounted on bottom edge (exposed through stainless slot)
- All passive components ≤ 0402 (1.0 × 0.5 mm) except bulk capacitors (0603)

---

## 6. Firmware Architecture

See `FIRMWARE-GUIDE.md` for full documentation.

| Module | Responsibility |
|---|---|
| `wifi_manager` | Connection, reconnection, WPA2/WPA3 |
| `lot_api_client` | REST calls to lot-systems.com, JWT auth |
| `notification_engine` | Poll interval, render queue, display driver |
| `sensor_hub` | BME688, VEML7700, BMI270, IMU data fusion |
| `button_handler` | Debounce, haptic trigger, API event POST |
| `camera_driver` | OV2640 init, JPEG capture, upload |
| `ota_updater` | Over-the-air firmware updates via HTTPS |
| `power_manager` | Sleep/wake cycles, battery monitoring |

**Firmware platform:** ESP-IDF v5.2 (Espressif official SDK)  
**Build system:** CMake  
**Language:** C (core) + C++ (display rendering)  
**OTA:** HTTPS-based, signed binaries  

---

## 7. LOT API Hardware Connector

See `LOT-API-CONNECTOR.md` for full documentation.

### New API Endpoints (to be added to lot-systems.com)

```
POST /api/hardware/register       — Register a new COSMO device
GET  /api/hardware/notifications  — Poll for pending notifications
POST /api/hardware/event          — Send button event (Copy press)
PUT  /api/hardware/ack/:id        — Acknowledge notification
GET  /api/hardware/config         — Fetch device config from server
```

### Notification Payload (server → device)

```json
{
  "id": "notif_abc123",
  "type": "reminder",
  "message": "Coffee time!",
  "priority": "normal",
  "icon": "cup",
  "expiresAt": "2026-05-26T15:30:00Z",
  "haptic": "double_buzz"
}
```

### Copy Button Event (device → server)

```json
{
  "deviceId": "cosmo_001",
  "event": "copy_button_press",
  "timestamp": "2026-05-26T14:55:12Z",
  "context": {
    "notificationId": "notif_abc123",
    "batteryLevel": 82,
    "sensorSnapshot": {
      "temp": 22.3,
      "humidity": 48,
      "pressure": 1013.2
    }
  }
}
```

---

## 8. Software Connector

See `SOFTWARE-CONNECTOR.md` for full SDK documentation.

| Layer | Technology |
|---|---|
| Firmware ↔ Server | HTTPS REST (TLS 1.3) |
| Auth | Device JWT (device-scoped, 30-day rolling) |
| Polling interval | 30 seconds (configurable via `/api/hardware/config`) |
| Push upgrade | Server-Sent Events (SSE) for instant notification delivery |
| OTA | HTTPS binary download, SHA-256 verified |
| Provisioning | QR code scan via camera → Wi-Fi + LOT auth token |

---

## 9. Production Run — 100 Units

See `MANUFACTURING-100-UNITS.md` for full production guide.

| Phase | Description | Partner |
|---|---|---|
| PCB fabrication | 4-layer, ENIG, 100 boards | PCBWay |
| PCB assembly | SMD pick-and-place, reflow, test | PCBWay PCBA |
| Stainless shell | CNC machining, 316L, 100 sets | Xometry / PCBWay CNC |
| Assembly | PCB into shell, cable, QC | Manual (LOT team) |
| Firmware flash | Initial firmware via USB-C jig | LOT team |
| QC testing | Functional test, charge test | LOT team |
| Packaging | Custom box (unbranded v1) | |
| Total units | 100 devices + 100 chargers | |

---

## 10. Session Compression

Each device session (power-on period) is summarized and compressed before upload to the LOT platform:

```json
{
  "sessionId": "cosmo_001_20260526_001",
  "duration": 14400,
  "sensorSummary": {
    "avgTemp": 21.4,
    "avgHumidity": 52,
    "peakVOC": 180,
    "stepCount": 3241
  },
  "notificationsReceived": 12,
  "buttonPresses": 3,
  "batteryStart": 95,
  "batteryEnd": 78,
  "fwVersion": "1.0.3"
}
```

Sessions are stored locally in ESP32 flash (RTC memory for power-off retention) and uploaded on next Wi-Fi connection.

---

## 11. Certification Requirements (100-unit run)

| Certification | Applicable | Notes |
|---|---|---|
| FCC Part 15 (USA) | Yes | Wi-Fi + BLE radio — required for US market |
| CE RED (EU) | Yes | Radio Equipment Directive |
| RoHS | Yes | PCBWay supplies RoHS-compliant materials |
| IEC 62133 (battery) | Yes | LiPo cell safety |
| Qi certification | Optional for v1 | Using certified Qi IC (NU1619) |

> For 100 units (pre-commercial / R&D), full FCC certification can be deferred under modular certification — the ESP32-S3-MINI-1U carries FCC ID 2AC7Z-ESP32S3MINI1U.

---

## 12. Document Index

| Document | File | Description |
|---|---|---|
| This specification | `COSMO-LOT-COMPUTER-SPEC.md` | Master hardware spec |
| Components list | `COMPONENTS-BUYING-LIST.md` | BOM with links, prices, suppliers |
| Roadmap | `ROADMAP.md` | Phase plan + milestones |
| Firmware guide | `FIRMWARE-GUIDE.md` | ESP-IDF firmware architecture |
| Software connector | `SOFTWARE-CONNECTOR.md` | TypeScript SDK for firmware bridge |
| LOT API connector | `LOT-API-CONNECTOR.md` | New API endpoints for hardware |
| PCB design guide | `PCB-DESIGN-GUIDE.md` | PCBWay order + Gerber checklist |
| Manufacturing guide | `MANUFACTURING-100-UNITS.md` | 100-unit production run |
| User manual | `USER-MANUAL.md` | End-user instructions (PDF source) |

---

*COSMO® CIA — LOT Systems — © 2026 Vadik Marmeladov. All rights reserved.*
