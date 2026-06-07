<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — Hardware Specification & Production Roadmap

```
================================================================================
DOCUMENT:   LOT-COMPUTER-HW-SPEC-v1
TITLE:      LOT Computer — COSMO® CIA Edition
            Hardware Design, BOM, Firmware, Software & Manufacturing Plan
CLASS:      RESTRICTED // S-2 EYES
S-2:        VADIK MARMELADOV (Inventor, COSMO® CIA)
DATE:       2026-06-07
VERSION:    v1.0
STAGE:      Pre-Production (100-Unit Run)
STATUS:     ACTIVE DESIGN
================================================================================
```

---

## 00 // EXECUTIVE SUMMARY

The **LOT Computer** is a palm-scale autonomous notification device — a flat,
polished stainless steel square (40×40×5mm) that receives AI-powered signals
from **lot-systems.com** and surfaces them without a phone.

It carries a camera, an OLED screen, a weather sensor, and a single "Copy"
button that fires a signal directly into the LOT Log tab. It charges wirelessly.
It talks to the LOT API. It fits in a shirt pocket.

This document is the authoritative specification for the first 100-unit
production run, manufactured through PCBWay.

---

## 01 // DESIGN PHILOSOPHY

| Principle | Expression |
|-----------|------------|
| Silent intelligence | Device notifies without demanding attention |
| LOT-first hardware | Every component serves the LOT API connection |
| Behavioral continuity | Presses, signals, and sensor data feed the Quantum Intent Engine |
| One good action | The Copy button: one press, one log entry, one signal back |
| Stainless permanence | Mirror steel reflects the permanence of recorded behavior |

The LOT Computer is not a phone accessory. It is a **hardware node** in the
LOT behavioral network — the first physical object to carry a user's QIE signal
into the world.

---

## 02 // PHYSICAL SPECIFICATION

```
┌─────────────────────────────────────────┐
│  FORM FACTOR                            │
│  Shape:      Square                     │
│  Width:      40 mm                      │
│  Height:     40 mm                      │
│  Depth:      5 mm                       │
│  Weight:     ~28g (est.)                │
│  Material:   304 Stainless Steel        │
│  Finish:     See SIDE A / SIDE B        │
└─────────────────────────────────────────┘
```

### SIDE A — Mirror Face (Back)

- **Finish:** Electrolytically polished, Ra ≤ 0.05 µm (mirror grade)
- **Surface:** Flat, no protrusions
- **Engraving:** `LOT®` logotype + `COSMO® CIA` — laser-etched, 0.1mm depth,
  centered lower-third
- **Wireless charging coil** embedded inside (invisible from exterior)

### SIDE B — Active Face (Front)

```
┌──────────────────────────────────────┐  ← 40mm
│                                      │
│  ┌──────────────────┐  ← OLED 1.2"  │
│  │                  │               │
│  │  LOT SCREEN      │               │
│  │  128×64 px       │               │
│  └──────────────────┘               │
│                        ● CAMERA     │
│                          (OV2640)   │
│             [  COPY  ]              │
│               BUTTON               │
│                                    │
└──────────────────────────────────────┘
```

- **Screen:** 1.2" OLED, 128×64, white-on-black
- **Camera:** 2MP OV2640 module, flush-mount, 3mm lens cutout
- **Button:** Single tactile SMD button, 5mm diameter, "COPY" silk-screen
- **Finish:** Brushed stainless (#4 finish), Ra 0.8–1.2 µm
- **Gap/seal:** Silicone O-ring gasket between A and B halves

### Enclosure Assembly

```
SIDE A (Mirror)  ←─── M1.2 × 4 screws (internal) ───→  SIDE B (Brushed)
      └────────────────────────────────────────────────────┘
                         O-ring seal (IP53)
```

- Two-piece CNC machined 304 SS shell
- 4× M1.2 stainless countersunk screws (internal, hidden)
- Press-fit alignment pins (0.8mm diameter × 2)
- IP53 rated (splash-resistant)

---

## 03 // COMPONENT BILL OF MATERIALS

**Production quantity:** 100 units
**Exchange rate basis:** USD, June 2026

### 3.1 Core Electronics

| # | Component | Part Number | Function | Unit Price | 100-unit | Supplier |
|---|-----------|-------------|----------|-----------|---------|---------|
| 1 | MCU/SoC | ESP32-S3-WROOM-1-N16R8 | Main processor, WiFi+BLE5, AI accel, camera I/F | $4.50 | $450 | [Mouser 356-ESP32S3WROOM1N16R8](https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-WROOM-1-N16R8) |
| 2 | OLED Display | SSD1306 1.2" 128×64 | Notification screen | $8.80 | $880 | [Adafruit 938](https://www.adafruit.com/product/938) / Alibaba OEM |
| 3 | Camera | OV2640 Mini Module | 2MP image sensor, DVP interface | $3.20 | $320 | [AliExpress OV2640 DVP](https://www.aliexpress.com) / LCSC |
| 4 | Weather/AI Sensor | Bosch BME688 | Gas, temp, humidity, pressure (AI-ready BSEC2.0) | $5.60 | $560 | [Mouser 828-BME688](https://www.mouser.com/ProductDetail/Bosch/BME688) |
| 5 | IMU | ICM-42688-P | 6-axis motion, ultra-low noise AI-grade | $2.00 | $200 | [Mouser 602-ICM-42688-P](https://www.mouser.com) |
| 6 | WL Charging RX IC | BQ51013BRHLR | Qi-compliant 5W receiver | $2.50 | $250 | [TI/Digi-Key 296-38804-1-ND](https://www.digikey.com) |
| 7 | WL Charging Coil | WR202020 | 20×20mm, 10µH Qi RX coil | $2.00 | $200 | [Würth 760308103](https://www.we-online.com) |
| 8 | Battery | LP304040 LiPo | 3mm thick, 40×40mm, ~180mAh | $5.00 | $500 | [GREPOW custom](https://www.grepow.com) |
| 9 | Battery Charger IC | BQ25180YBGR | Nano-power 1A charger (supports Qi input) | $0.80 | $80 | [TI/Mouser](https://www.mouser.com) |
| 10 | Fuel Gauge | MAX17048G+T | I2C coulomb counter, SOT-23 | $1.20 | $120 | [Mouser 700-MAX17048G+T](https://www.mouser.com) |
| 11 | Button | TS-1187-1.7H | 5mm SMD tactile, 1.7mm height | $0.15 | $15 | [Digi-Key](https://www.digikey.com) |
| 12 | USB-C Debug Port | USB4085-GF-A | 2.0 USB-C, 6-pin SMD | $0.30 | $30 | [GCT/Digi-Key](https://www.digikey.com) |
| 13 | Step-down Regulator | TPS62840DGRR | 750nA Iq, 3.3V rail | $0.70 | $70 | [TI/Mouser](https://www.mouser.com) |
| 14 | Level Shifter | TXS0108EPWR | 8-channel I/O translation | $0.60 | $60 | [TI/Mouser](https://www.mouser.com) |
| 15 | Passives (R, C, L) | Various 0402 | Decoupling, filtering, bias | $1.50 | $150 | PCBWay sourced |
| 16 | Crystal | ABM8-25.000MHZ | 25MHz for ESP32-S3 | $0.40 | $40 | [Abracon/Mouser](https://www.mouser.com) |
| 17 | ESD Protection | PRTR5V0U2X | USB-C + button ESD | $0.30 | $30 | [NXP/Mouser](https://www.mouser.com) |

**Electronics Subtotal: ~$2,955 (100 units)**
**Per-unit electronics cost: ~$29.55**

### 3.2 PCB Manufacturing (PCBWay)

| Item | Spec | Per Unit | 100 Units |
|------|------|---------|---------|
| PCB bare board | 4-layer, 38×38mm, 1.0mm FR4, ENIG | $3.80 | $380 |
| PCB assembly (PCBA) | SMT + reflow, PCBWay assembly service | $18.00 | $1,800 |
| Stencil | Laser-cut stainless, 38×38mm | — | $45 (one-time) |
| **PCBWay subtotal** | | **$21.80** | **$2,225** |

**PCBWay Order Link Base:** [https://www.pcbway.com/orderonline.aspx](https://www.pcbway.com/orderonline.aspx)
- Upload Gerber + BOM + CPL (centroid) files
- Select: PCBA service → 100 pcs → 4-layer → ENIG → SMT both sides

### 3.3 Mechanical Enclosure

| Item | Spec | Per Unit | 100 Units | Supplier |
|------|------|---------|---------|---------|
| Shell A (mirror) | 304 SS CNC, Ra≤0.05µm electrolytic polish | $18.00 | $1,800 | PCBWay CNC / Protolabs |
| Shell B (brushed) | 304 SS CNC, #4 brush, camera+screen+btn cutouts | $18.00 | $1,800 | PCBWay CNC / Protolabs |
| O-ring gasket | Silicone, 36×36mm, 0.8mm cord | $0.40 | $40 | McMaster-Carr |
| M1.2 screws ×4 | 304 SS, countersunk | $0.20 | $20 | McMaster-Carr |
| Alignment pins ×2 | 304 SS, 0.8mm×3mm | $0.05 | $5 | McMaster-Carr |
| Laser engraving | LOT® + COSMO® CIA, Side A | $2.00 | $200 | PCBWay laser |
| **Enclosure subtotal** | | **$38.65** | **$3,865** |

**PCBWay CNC Link:** [https://www.pcbway.com/rapid-prototyping/manufacture/CNC-Machining-Service.html](https://www.pcbway.com/rapid-prototyping/manufacture/CNC-Machining-Service.html)

### 3.4 Wireless Charger (Accessory)

| Item | Spec | Per Unit | 100 Units | Supplier |
|------|------|---------|---------|---------|
| Qi charger pad | 5W, flat, 40×40mm base, USB-C input | $6.00 | $600 | Alibaba OEM / custom |
| TX coil | 40×40mm, matched to WR202020 RX | $2.50 | $250 | Würth |
| Charger TX IC | IP5306 or BQ500212A | $1.20 | $120 | LCSC |
| USB-C cable 0.3m | Braided, 5W | $1.50 | $150 | Supplier |
| Charger enclosure | Brushed AL, 45×45×8mm | $5.00 | $500 | CNC Alibaba |
| **Charger subtotal** | | **$16.20** | **$1,620** |

### 3.5 Total BOM Summary

| Category | Per Unit | 100 Units |
|----------|---------|---------|
| Electronics | $29.55 | $2,955 |
| PCB (bare + assembly) | $21.80 | $2,225 |
| Enclosure | $38.65 | $3,865 |
| Wireless charger | $16.20 | $1,620 |
| Packaging (box, inserts) | $3.00 | $300 |
| **TOTAL** | **$109.20** | **$10,965** |

**Non-Recurring Engineering (NRE):**

| Item | Cost |
|------|------|
| PCB design (schematic + layout, 4-layer) | $2,500 |
| Mechanical CAD (SolidWorks enclosure) | $1,800 |
| Firmware development (ESP32-S3 full stack) | $4,000 |
| Software connector (desktop app) | $2,000 |
| Testing fixtures (bed-of-nails + jig) | $1,200 |
| PCBWay stencil + setup fees | $200 |
| **NRE Total** | **$11,700** |

**All-in first run cost: ~$22,665 (100 units = ~$226/unit)**
**Subsequent runs (NRE amortized): ~$109/unit**

---

## 04 // ELECTRICAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LOT COMPUTER — BLOCK DIAGRAM                        │
│                                                                               │
│  WIRELESS                  POWER RAIL                                         │
│  CHARGING                  ──────────                                         │
│  ┌─────────┐  5V Qi    ┌──────────────┐   3.3V    ┌────────────────────────┐│
│  │Qi Coil  │──────────▶│  BQ51013B    │──────────▶│   TPS62840 (3.3V)      ││
│  │WR202020 │           │  Qi RX IC    │           │   Step-Down Regulator  ││
│  └─────────┘           └──────┬───────┘           └────────────┬───────────┘│
│                               │ 4.2V                           │ 3.3V       │
│                        ┌──────▼───────┐                        │            │
│                        │  LP304040    │               ┌────────▼──────────┐ │
│                        │  LiPo 180mAh │               │  ESP32-S3-WROOM-1 │ │
│                        │  BQ25180 mgr │               │  Xtensa LX7 dual  │ │
│                        │  MAX17048 fg │               │  WiFi + BLE 5.0   │ │
│                        └──────────────┘               │  Camera DVP I/F   │ │
│                                                        │  AI Neural Accel  │ │
│  SENSORS                                               └──┬────┬────┬──────┘ │
│  ┌──────────┐  I2C                                       │    │    │        │
│  │ BME688   │◀───────────────────────────────────────────┘    │    │        │
│  │ Temp/Hum │                                                  │    │        │
│  │ Press/Gas│  (BSEC 2.0 AI air quality)                      │    │        │
│  └──────────┘                                                  │    │        │
│  ┌──────────┐  SPI                                             │    │        │
│  │ICM-42688P│◀──────────────────────────────────────────────── ┘    │        │
│  │ 6-axis   │  (motion, gesture)                                    │        │
│  │ IMU      │                                                        │        │
│  └──────────┘                                                        │        │
│                                                                      │        │
│  DISPLAY        SPI                                                  │        │
│  ┌──────────┐◀──────────────────────────────────────────────────────┘        │
│  │ SSD1306  │                                                                 │
│  │ 1.2" OLED│                                                                 │
│  └──────────┘                                                                 │
│                                                                               │
│  CAMERA         DVP (8-bit parallel)                                          │
│  ┌──────────┐◀──────────────────────────────────────────────────────────┐    │
│  │ OV2640   │                                              ESP32-S3     │    │
│  │ 2MP DVP  │                                                           │    │
│  └──────────┘                                                           │    │
│                                                                         │    │
│  BUTTON         GPIO (interrupt)                                        │    │
│  ┌──────────┐──────────────────────────────────────────────────────────┘    │
│  │  COPY    │  (debounced, 50ms)                                             │
│  └──────────┘                                                                 │
│                                                                               │
│  USB-C DEBUG    USB 2.0                                                       │
│  ┌──────────┐──────────────────────────────────────────────────────────      │
│  │USB4085   │  UART bridge for firmware flashing + debug logs                │
│  └──────────┘                                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Power Budget

| Mode | Current Draw | Battery Life (180mAh) |
|------|--------------|-----------------------|
| Deep sleep (WiFi off, BLE adv.) | 0.8 mA | ~225 hours |
| Active notification display | 18 mA | ~10 hours |
| Camera capture | 60 mA | ~3 hours continuous |
| WiFi active (API call) | 80 mA | ~2.25 hours continuous |
| **Typical duty cycle** | **~3 mA avg** | **~60 hours (~2.5 days)** |

Wireless charging at 5W recharges the battery from 0→100% in ~15 minutes.

---

## 05 // PCB DESIGN SPECIFICATION

### PCB Stack-Up (4-Layer, 1.0mm)

```
Layer 1 (Top):    Signal + components (SMT both sides)
Layer 2 (GND):    Solid ground plane
Layer 3 (PWR):    3.3V + 4.2V power planes
Layer 4 (Bottom): Signal + RF keep-out (ESP32 antenna region clear)
```

### Critical Design Rules

| Rule | Value |
|------|-------|
| Board outline | 38 × 38 mm (leaves 1mm border for enclosure lip) |
| Min trace width | 0.1mm (0.15mm preferred) |
| Min clearance | 0.1mm |
| Via drill | 0.2mm min (0.3mm preferred) |
| Copper weight | 1oz outer, 0.5oz inner |
| Surface finish | ENIG (Electroless Nickel Immersion Gold) |
| Solder mask | Black LPI, both sides |
| Silkscreen | White, both sides |
| Impedance | 50Ω ±10% for RF traces |
| ESP32-S3 antenna | 3mm keep-out from board edge, no copper below |
| Qi coil | Routed on flex extension or separate coil PCB taped to Side A |

### Gerber File Set (PCBWay Upload)

```
LOT-COMPUTER-HW-001/
├── gerber/
│   ├── LOT-COMPUTER.GTL     (top copper)
│   ├── LOT-COMPUTER.GBL     (bottom copper)
│   ├── LOT-COMPUTER.G2      (inner layer 2 — GND)
│   ├── LOT-COMPUTER.G3      (inner layer 3 — PWR)
│   ├── LOT-COMPUTER.GTS     (top solder mask)
│   ├── LOT-COMPUTER.GBS     (bottom solder mask)
│   ├── LOT-COMPUTER.GTO     (top silkscreen)
│   ├── LOT-COMPUTER.GBO     (bottom silkscreen)
│   ├── LOT-COMPUTER.DRL     (drill file, Excellon)
│   └── LOT-COMPUTER.GML     (board outline/milling)
├── bom/
│   └── LOT-COMPUTER-BOM.csv (ref, value, package, MPN, qty)
├── cpl/
│   └── LOT-COMPUTER-CPL.csv (centroid/pick-and-place)
└── fab_notes.txt            (special instructions for PCBWay)
```

---

## 06 // SENSOR SUITE — AI-GRADE

### 6.1 Bosch BME688 — Environmental AI Sensor

The BME688 is the only consumer sensor rated as "AI-grade" by its manufacturer.
It includes an on-chip gas sensor array with Bosch's **BSEC 2.0** (Bosch Sensortec
Environmental Cluster) algorithm library, producing real AI-computed air quality indices.

| Measurement | Range | Accuracy |
|-------------|-------|---------|
| Temperature | −40 to +85°C | ±0.5°C |
| Humidity | 0–100% RH | ±3% RH |
| Barometric pressure | 300–1100 hPa | ±0.6 hPa |
| Gas resistance | VOC detection | AI Index 0–500 |
| IAQ (Indoor Air Quality) | 0–500 | BSEC computed |

**LOT Integration:** BME688 readings feed the Quantum Intent Engine as
environmental context — detecting if a user is in a stale room (low IAQ triggers
"Coffee time + open a window" notification), or if barometric pressure drops
(mood correlation study integration).

### 6.2 ICM-42688-P — Motion AI Sensor

| Measurement | Range | Noise density |
|-------------|-------|--------------|
| Accelerometer | ±2/4/8/16g | 70 µg/√Hz |
| Gyroscope | ±15.6–2000°/s | 2.8 mdps/√Hz |
| Temp | On-chip | ±1°C |

**LOT Integration:** Gesture recognition (tap = wake, double-tap = Copy action
alternative), activity detection (still vs. moving), and sleep tracking integration
via BLE sync with the LOT OS.

### 6.3 OV2640 Camera

| Parameter | Value |
|-----------|-------|
| Resolution | 2MP (1600×1200 UXGA max) |
| Interface | DVP 8-bit parallel |
| Frame rate | 15fps at UXGA, 30fps at VGA |
| Lens | Fixed focus, f/2.4, 3mm |
| Power | ~120mW active, <1µA standby |

**LOT Integration:** Camera is user-triggered via the LOT API (e.g., the site
sends a "capture moment" notification). Captured images are JPEG-compressed
on-device (ESP32-S3 hardware JPEG encoder) and uploaded to the LOT API endpoint.
Camera is **never** active without an explicit API command or local button press.
No background surveillance.

---

## 07 // LOT API CONNECTOR

### 7.1 Connection Architecture

```
LOT Computer (ESP32-S3)
        │
        │  WiFi 2.4GHz / BLE 5.0
        │
        ▼
   lot-systems.com API
        │
        ├──▶ /api/device/notifications    (GET — poll or WebSocket push)
        ├──▶ /api/device/log              (POST — Copy button signal)
        ├──▶ /api/device/sensor           (POST — BME688 + IMU data)
        ├──▶ /api/device/capture          (POST — camera image upload)
        └──▶ /api/device/heartbeat        (GET — 60s keepalive)
```

### 7.2 Authentication

- **Method:** HMAC-SHA256 signed JWT, device-bound
- **Provisioning:** Device gets a unique `device_id` + `device_secret` burned
  to eFuse during manufacturing flash (PCBWay firmware flash step)
- **Token refresh:** Every 24 hours via `/api/device/auth/refresh`
- **Key storage:** eFuse block 3 (write-once, read-protected)

### 7.3 Notification Protocol

The LOT Computer operates on a **WebSocket persistent connection** when on WiFi.
On BLE-only mode, it polls every 60 seconds.

```json
// Incoming notification payload (from lot-systems.com)
{
  "type": "notification",
  "id": "notif_abc123",
  "message": "Coffee time!",
  "priority": "normal",
  "icon": "coffee",
  "duration_ms": 5000,
  "haptic": false,
  "source": "lot-ai-scheduler"
}
```

```json
// Copy button signal (device → lot-systems.com)
{
  "type": "copy_signal",
  "device_id": "LOT-001",
  "timestamp": "2026-06-07T14:32:00Z",
  "context": {
    "notification_id": "notif_abc123",
    "sensor": {
      "temp_c": 22.4,
      "humidity_pct": 48.2,
      "iaq": 82,
      "pressure_hpa": 1013.2
    },
    "battery_pct": 74
  }
}
```

### 7.4 Log Tab Integration

The Copy button press routes to the **LOT Log tab** at `lot-systems.com`:

1. User sees notification on device screen: *"Coffee time!"*
2. User presses COPY button
3. Device sends POST to `/api/device/log` with full context payload
4. LOT backend creates a Log entry: `[14:32] LOT Computer: Coffee time! ✓`
5. Entry appears instantly in the user's Log tab via WebSocket push to browser

### 7.5 WiFi Provisioning (First Setup)

The device enters BLE provisioning mode on first boot:
1. User opens LOT site → Settings → Add Device
2. Site sends BLE advertisement scan
3. Device pairs, receives WiFi SSID + password + `device_secret`
4. Device connects to WiFi, registers at `/api/device/register`
5. LED blink pattern confirms pairing (3× slow green via screen)

---

## 08 // FIRMWARE ARCHITECTURE

### 8.1 Firmware Stack

```
┌─────────────────────────────────────────┐
│         LOT-COMPUTER FIRMWARE           │
│         ESP-IDF v5.1 (FreeRTOS)         │
├─────────────────────────────────────────┤
│  APPLICATION LAYER                      │
│  ├── lot_notification.c    (display mgr)│
│  ├── lot_api_client.c      (HTTP/WS)    │
│  ├── lot_copy_button.c     (ISR + log)  │
│  ├── lot_sensor_bme688.c   (BSEC 2.0)  │
│  ├── lot_sensor_icm.c      (IMU)        │
│  ├── lot_camera.c          (OV2640)     │
│  └── lot_power.c           (sleep mgr)  │
├─────────────────────────────────────────┤
│  MIDDLEWARE LAYER                       │
│  ├── wifi_manager.c        (WPA2/WPA3)  │
│  ├── ble_provisioning.c    (BLE GATT)   │
│  ├── jwt_auth.c            (HMAC-SHA256)│
│  ├── websocket_client.c    (WS/WSS)     │
│  └── ota_updater.c         (HTTPS OTA)  │
├─────────────────────────────────────────┤
│  HAL / DRIVER LAYER                     │
│  ├── ssd1306_driver.c      (SPI OLED)   │
│  ├── ov2640_driver.c       (DVP camera) │
│  ├── bme688_driver.c       (I2C sensor) │
│  ├── icm42688_driver.c     (SPI IMU)    │
│  ├── bq51013_driver.c      (I2C Qi)     │
│  └── max17048_driver.c     (I2C gauge)  │
├─────────────────────────────────────────┤
│  ESP-IDF / FreeRTOS / lwIP / mbedTLS   │
└─────────────────────────────────────────┘
```

### 8.2 Task Architecture (FreeRTOS)

| Task | Priority | Stack | Period |
|------|----------|-------|--------|
| `lot_api_task` | 5 (high) | 8KB | Event-driven (WS) |
| `lot_sensor_task` | 3 | 4KB | 60s |
| `lot_display_task` | 4 | 4KB | 100ms (notification active) |
| `lot_power_task` | 6 (highest) | 2KB | 1s |
| `lot_ota_task` | 2 | 16KB | On-demand |
| `lot_camera_task` | 3 | 32KB | On-demand |
| `lot_button_task` | 7 (ISR) | 1KB | Interrupt |

### 8.3 OTA Update Flow

Firmware updates are pushed from `lot-systems.com/firmware/latest.bin` via
HTTPS OTA. The device checks for updates on every WiFi connect and once per
24-hour cycle. Updates are applied in a dual-partition A/B scheme with automatic
rollback on boot failure (3 consecutive fails → rollback to previous partition).

### 8.4 Power State Machine

```
                     ┌─────────────┐
                     │  DEEP SLEEP │ ← WiFi off, BLE adv, 0.8mA
                     │  (default)  │
                     └──────┬──────┘
                            │ Wake triggers:
                            │ - BLE notification received
                            │ - RTC timer (60s poll)
                            │ - Copy button press
                            │ - Qi charging connect
                            ▼
                     ┌─────────────┐
                     │  ACTIVE     │ ← WiFi on, API call, 18-80mA
                     │  (transient)│
                     └──────┬──────┘
                            │ After API call + display:
                            │ 5s inactivity timeout
                            ▼
                     ┌─────────────┐
                     │  DISPLAY ON │ ← Screen active, 18mA
                     │  (5s max)   │
                     └──────┬──────┘
                            │ 5s elapsed
                            ▼
                       DEEP SLEEP
```

### 8.5 Session Compression Protocol

Every 24-hour cycle, the device compresses and uploads its local sensor log:

```
Raw sensor log (1 week): ~50KB
DEFLATE compressed:       ~8KB
Delta-encoded + DEFLATE:  ~2KB
```

The compressed session payload is sent to `/api/device/session` containing:
- Temperature, humidity, IAQ summary (min/avg/max per hour)
- Motion profile (still/active/sleep periods)
- Notification receipt + Copy button correlation log
- Battery cycle data
- Uptime + connection quality metrics

This compressed session data feeds the LOT Quantum Intent Engine as a new
behavioral signal vector: **the physical environment correlates with the soul.**

---

## 09 // SOFTWARE CONNECTOR

The **LOT Computer Desktop Connector** is a lightweight tray application
that bridges the device to the user's computer when on the same WiFi network.

### 9.1 Stack

| Platform | Technology |
|----------|-----------|
| macOS | Swift + Cocoa, native menu bar app |
| Windows | Electron (cross-platform fallback) |
| Linux | Electron |

### 9.2 Features

| Feature | Description |
|---------|-------------|
| Auto-discovery | mDNS/Bonjour scans for `lot-computer-*.local` |
| Firmware flash | Drag-and-drop `.bin` firmware update via USB-C |
| WiFi config | GUI for SSID/password provisioning |
| Log viewer | Live tail of device logs over USB serial or WiFi |
| Sensor dashboard | Real-time BME688 + IMU data visualization |
| Camera preview | MJPEG stream viewer (USB-C tethered mode) |
| Notification test | Send test notification to device from PC |

### 9.3 Protocol

The connector communicates with the device over:
1. **Local WiFi**: REST API on `http://lot-computer.local:8080/`
2. **USB-C serial**: 115200 baud UART, JSON-framed protocol
3. **BLE**: For initial provisioning only

---

## 10 // DOCUMENT SYSTEM

### 10.1 Deliverable Documents

| Document | ID | Format | Audience |
|----------|----|--------|---------|
| Hardware Design Spec (this) | HW-SPEC-v1 | .MD / PDF | Engineering |
| Schematic + PCB Layout | HW-PCB-v1 | KiCad + PDF | PCBWay |
| Mechanical CAD | HW-MECH-v1 | SolidWorks + STEP | CNC vendor |
| Bill of Materials | HW-BOM-v1 | .CSV + PDF | Procurement |
| Firmware Architecture | FW-ARCH-v1 | .MD / PDF | Firmware engineer |
| Firmware API Reference | FW-API-v1 | .MD / PDF | Firmware engineer |
| LOT API Integration Guide | API-INT-v1 | .MD / PDF | Backend engineer |
| Software Connector Guide | SW-CONN-v1 | .MD / PDF | App developer |
| Manufacturing Test Plan | MFG-TEST-v1 | .MD / PDF | PCBWay / QA |
| User Manual (EN) | MAN-USER-v1 | PDF | End user |
| Quick Start Guide | MAN-QSG-v1 | PDF (2-page) | End user |
| Wireless Charger Manual | MAN-CHARGE-v1 | PDF | End user |
| Safety & Regulatory | REG-SAFETY-v1 | PDF | Regulatory |
| Firmware Release Notes | FW-REL-v1+ | .MD | All |

### 10.2 PDF Manual Structure (User Manual — MAN-USER-v1)

```
LOT COMPUTER
User Manual — COSMO® CIA Edition
Version 1.0 | 2026

1. WELCOME
   1.1 What is the LOT Computer?
   1.2 In the box
   1.3 Meet the device

2. GETTING STARTED
   2.1 Charge your device (wireless)
   2.2 Download LOT app or open lot-systems.com
   2.3 Pair with your LOT account (BLE setup)
   2.4 First notification

3. THE SCREEN
   3.1 Notification display
   3.2 Screen timeout
   3.3 Battery indicator

4. THE COPY BUTTON
   4.1 What it does
   4.2 The LOT Log tab
   4.3 Context data sent

5. SENSORS
   5.1 Weather & air quality
   5.2 Motion tracking
   5.3 Camera (on-demand)

6. WIRELESS CHARGING
   6.1 Placing the device
   6.2 Charging indicator
   6.3 Full charge time

7. NOTIFICATIONS
   7.1 Types of notifications
   7.2 Setting up schedules at lot-systems.com
   7.3 AI-powered notification examples

8. FIRMWARE UPDATES
   8.1 Automatic over-the-air
   8.2 Manual update via USB-C

9. CARE & MAINTENANCE
   9.1 Cleaning the mirror surface
   9.2 Water resistance
   9.3 Temperature limits

10. COMPLIANCE
    10.1 FCC / CE declarations
    10.2 RoHS compliance
    10.3 Warranty

APPENDIX A: Technical Specifications
APPENDIX B: API Endpoint Reference (for developers)
APPENDIX C: Troubleshooting
```

### 10.3 Firmware Document Structure (FW-ARCH-v1)

```
LOT COMPUTER FIRMWARE
Architecture Document — v1.0

1. OVERVIEW
   1.1 Target hardware
   1.2 Development environment (ESP-IDF v5.1)
   1.3 Build system (CMake)

2. TASK ARCHITECTURE
   2.1 FreeRTOS task map
   2.2 Inter-task communication (queues + semaphores)
   2.3 Memory layout

3. DRIVER REFERENCE
   3.1 SSD1306 OLED (SPI)
   3.2 OV2640 Camera (DVP)
   3.3 BME688 (I2C + BSEC 2.0)
   3.4 ICM-42688-P (SPI)
   3.5 BQ51013B Qi receiver
   3.6 MAX17048 fuel gauge

4. NETWORK STACK
   4.1 WiFi manager
   4.2 WebSocket client
   4.3 HTTPS OTA updater
   4.4 mDNS/Bonjour

5. SECURITY
   5.1 eFuse key storage
   5.2 JWT authentication
   5.3 Certificate pinning
   5.4 Secure boot + flash encryption

6. POWER MANAGEMENT
   6.1 Sleep state machine
   6.2 Wake sources
   6.3 Battery management

7. FLASHING PROCEDURE
   7.1 Production flash (PCBWay)
   7.2 Developer flash (USB-C)
   7.3 OTA flow

8. TESTING
   8.1 Unit tests (Unity framework)
   8.2 Hardware-in-loop tests
   8.3 Production test fixture
```

---

## 11 // MANUFACTURING ROADMAP — 100 UNITS

### Phase 0: Design Lock (Weeks 1–4)

| Week | Milestone | Owner |
|------|-----------|-------|
| W1 | Schematic complete + reviewed | Hardware engineer |
| W1 | PCB layout begun (KiCad) | Hardware engineer |
| W2 | Mechanical CAD complete (SolidWorks) | Mechanical engineer |
| W2 | PCB layout complete | Hardware engineer |
| W3 | DFM review with PCBWay | PCBWay account manager |
| W3 | BOM finalized, component sourcing confirmed | Procurement |
| W4 | Gerber + BOM + CPL uploaded to PCBWay | Engineer |
| W4 | CNC order placed for enclosure prototypes (5 units) | Engineer |

### Phase 1: Prototype Build (Weeks 5–8)

| Week | Milestone | Notes |
|------|-----------|-------|
| W5 | PCBWay ships prototype PCBs (bare) | 5 units, 2-week turn |
| W5 | Enclosure prototypes received (CNC) | 5 units |
| W6 | Firmware bring-up on prototype boards | USB-C flash |
| W6 | Driver validation (display, camera, sensors, Qi) | All peripherals |
| W7 | Mechanical fit-check: PCB into enclosure | Tolerances verified |
| W7 | LOT API integration testing | End-to-end notification + Copy |
| W8 | Prototype sign-off (S-2 approval) | Vadik Marmeladov |

### Phase 2: Pre-Production (Weeks 9–12)

| Week | Milestone | Notes |
|------|-----------|-------|
| W9 | PCBWay PCBA order placed: 110 units (10% excess) | Full assembly + test |
| W9 | CNC enclosure order placed: 110 sets | Mirror + brushed |
| W9 | Battery custom order: GREPOW LP304040 × 110 | 3–4 week lead time |
| W10 | Firmware v1.0 release candidate | Full OTA tested |
| W10 | Production test fixture complete | Bed-of-nails + software |
| W11 | PCBWay boards received + incoming inspection | AQL 2.5 |
| W11 | Enclosures received + inspection | Finish + tolerance |
| W12 | Assembly line: PCB → battery → enclosure → test | 100 units |

### Phase 3: Production & QA (Weeks 13–14)

| Week | Milestone | Notes |
|------|-----------|-------|
| W13 | 100 units assembled | In-house assembly |
| W13 | 100% functional test: screen, button, WiFi, BLE, sensors | Test fixture |
| W13 | 10% sample destructive test: drop, thermal | AQL sampling |
| W14 | Firmware flash: device_id + device_secret per unit | Serial production |
| W14 | Packaging + documentation insert | Box + QSG card |
| W14 | 100 units ready for distribution | S-2 sign-off |

### PCBWay Order Checklist

```
□ Gerber files (GTL, GBL, G2, G3, GTS, GBS, GTO, GBO, DRL, GML)
□ BOM in PCBWay CSV format (MPN, value, footprint, qty)
□ CPL centroid file (ref, x, y, rotation, side)
□ Fab notes (impedance, stacking, finish specs)
□ Special instructions: ENIG, black solder mask, IPC Class 2
□ PCBA service selected: turnkey
□ Quantity: 110 units (10% buffer)
□ Board thickness: 1.0mm
□ Layer count: 4
□ Min trace: 0.1mm
□ Surface finish: ENIG
□ Payment confirmed
□ DHL Express shipping selected
```

---

## 12 // WIRELESS CHARGING SPECIFICATION

### Charger Design

```
LOT COMPUTER WIRELESS CHARGER

┌─────────────────────────┐
│  ┌───────────────────┐  │  ← Brushed aluminum enclosure, 45×45×8mm
│  │   Qi TX Coil      │  │
│  │   40×40mm         │  │
│  │   BQ500212A TX IC │  │
│  └───────────────────┘  │
│         USB-C IN        │
└─────────────────────────┘
         ↑ 5V/1A

Place LOT Computer mirror-side down on charger.
Magnet alignment guide: 2× N45 magnets (3mm diameter)
embedded in charger + matching SS cups in device back.
```

### Charger Specifications

| Parameter | Value |
|-----------|-------|
| Standard | Qi 1.3 (5W) |
| Input | USB-C 5V/1A |
| Output | 5W to device |
| Efficiency | ≥70% typical |
| Foreign object detection | Yes (BQ500212A) |
| Coil size | 40×40mm (matched to RX) |
| Alignment magnets | 2× N45, 3mm dia. |
| Enclosure | Brushed 6061 aluminum, 45×45×8mm |
| Cable | Braided USB-C, 0.3m |

### Charging Experience

1. Place device mirror-side down on charger pad
2. Magnets click into alignment
3. Screen briefly shows: `⚡ Charging` (3 seconds, then off)
4. LED indicator on charger: amber (charging) → white (full)
5. Full charge from 0%: ~15 minutes

---

## 13 // NOTIFICATIONS — EXAMPLE LIBRARY

The LOT AI scheduler at `lot-systems.com` generates contextual notifications
based on the user's QIE behavioral profile. Examples:

| Notification | Trigger |
|-------------|---------|
| `Coffee time!` | 10:00 AM weekday, low energy pattern detected |
| `Stand up. Move.` | 90 min stationary (IMU signal) |
| `Air quality low. Open a window.` | BME688 IAQ < 50 |
| `Your streak: 42 days. Keep going.` | Daily journal complete |
| `Reflection window: 3 min` | Evening circadian pattern |
| `Benchmark score updated: 78 → 81` | Purple tier milestone |
| `Take a photo of your workspace.` | Weekly environment capture request |
| `Recovery mode: rest protocol` | Low recovery velocity pattern |
| `Kuzya says: hi, dad.` | COSMO® CIA special message |

All notifications are generated by the **LOT Quantum Intent Engine** based on the
user's behavioral profile — not by push marketing. No ads. No third-party content.

---

## 14 // COMPLIANCE & CERTIFICATION

| Certification | Region | Required For | Timeline |
|--------------|--------|-------------|---------|
| FCC Part 15 B | USA | WiFi/BLE radio | Pre-distribution |
| CE RED | EU | Radio equipment | Pre-distribution |
| RoHS 3 | EU | Lead-free materials | PCBWay compliant |
| WEEE | EU | Electronics disposal | Packaging mark |
| UL 62368-1 | USA | Safety (charger) | Charger cert |
| Qi 1.3 | Global | Wireless charging | BQ51013B already certified |
| REACH | EU | Chemical safety | Materials list |

FCC/CE testing through a certified lab (UL, Nemko, SGS) is required prior to
the 100-unit distribution. Budget: ~$8,000–12,000 for combined FCC + CE.

Prototype testing (pre-cert) can proceed immediately. Full certification applies
to the production-locked PCB revision.

---

## 15 // SECURITY ARCHITECTURE

| Layer | Implementation |
|-------|---------------|
| Boot | ESP32-S3 Secure Boot V2 (RSA-3072) |
| Flash | AES-256 flash encryption |
| Key storage | eFuse block 3 (write-once, read-protected) |
| Transport | TLS 1.3 with certificate pinning to lot-systems.com |
| Auth | HMAC-SHA256 signed JWT, 24h expiry |
| OTA | Code-signed firmware (RSA-2048) |
| API | Device-unique secret, never transmitted after provisioning |
| Camera | Capture only on explicit LOT API command or physical button |
| Data | All sensor data encrypted in transit + at rest (device FLASH) |

Privacy principle inherited from LOT Systems:
**The behavioral data belongs to the user. The device never phones home to
anyone except the authenticated lot-systems.com endpoint.**

---

## 16 // REPOSITORY STRUCTURE (FUTURE)

```
LOT-Computer/
├── docs/
│   └── hardware/
│       ├── 2026-06-07_LOT-COMPUTER-HW-SPEC-v1.md  ← this document
│       ├── LOT-COMPUTER-FW-ARCH-v1.md              (firmware architecture)
│       ├── LOT-COMPUTER-API-INT-v1.md              (LOT API integration)
│       ├── LOT-COMPUTER-SW-CONN-v1.md              (software connector)
│       ├── LOT-COMPUTER-MFG-TEST-v1.md             (manufacturing test plan)
│       └── LOT-COMPUTER-BOM-v1.csv                 (component BOM)
├── firmware/
│   ├── main/
│   │   ├── lot_notification.c
│   │   ├── lot_api_client.c
│   │   ├── lot_copy_button.c
│   │   ├── lot_sensor_bme688.c
│   │   ├── lot_sensor_icm.c
│   │   ├── lot_camera.c
│   │   └── lot_power.c
│   └── CMakeLists.txt
├── hardware/
│   ├── kicad/                   (schematic + PCB layout)
│   ├── gerber/                  (export for PCBWay)
│   ├── bom/                     (CSV for PCBWay PCBA)
│   └── mechanical/              (SolidWorks + STEP files)
└── software/
    └── connector/               (macOS/Windows/Linux tray app)
```

---

## 17 // SESSION SUMMARY

```
================================================================================
LOT SYSTEMS / SESSION REPORT
DOCUMENT:   LOT-HW-SR-20260607-01
TITLE:      LOT Computer — Hardware Specification, BOM, Roadmap (v1.0)
CLASS:      RESTRICTED // S-2 EYES
S-2:        VADIK MARMELADOV
DATE:       2026-06-07
RESULT:     DOCUMENT COMPLETE
================================================================================

INTAKE:
  Artifact:        Hardware product specification (19-point brief)
  Classification:  ENGINEERING / PRODUCT
  Action:          Full hardware design document produced

DELIVERABLE SUMMARY:
  Physical spec:   40×40×5mm, 304 SS two-part, polished/brushed
  BOM:             17 electronic components, PCBWay PCBA, CNC enclosure
  Cost per unit:   ~$109 BOM (100-unit run), ~$226 all-in (first run NRE)
  Sensors:         BME688 (AI weather), ICM-42688-P (AI motion), OV2640 (camera)
  Wireless charge: Qi 1.3 / 5W / 15-min full charge
  API:             WebSocket to lot-systems.com, HMAC-SHA256 JWT auth
  Copy button:     1 press → Log entry at lot-systems.com/log
  Notifications:   AI-generated from QIE behavioral profile
  Production:      PCBWay PCBA + CNC, 14-week roadmap, 100 units
  Firmware:        ESP-IDF v5.1, FreeRTOS, OTA, secure boot
  Software:        Desktop connector (macOS/Win/Linux), BLE provisioning
  Documents:       14 deliverable docs enumerated, PDF manual structured
  Compliance:      FCC, CE RED, RoHS, Qi 1.3, UL 62368-1

PUSH:       docs/hardware/ → claude/brave-lamport-ahNEL
================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-HW-SR-20260607-01
================================================================================
```

---

*Invented by Vadim Marmeladov. Named for Kuzya Cosmo Marmeladov.*
*LOT Systems, Inc. — COSMO® CIA Division.*
*brand.lot-systems.com | lot-systems.com*
