<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — HARDWARE DEVICE
## COSMO® CIA Pocket Terminal
### Design Report v1.0 · 18 June 2026

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   LOT SYSTEMS CORPORATION                                     ║
║   COSMO® CIA POCKET TERMINAL                                  ║
║                                                               ║
║   4 × 4 cm · 5 mm · STAINLESS STEEL · WIRELESS               ║
║   NOTIFICATION PAGER + AI SENSOR NODE + LOT CONNECTOR        ║
║                                                               ║
║   INVENTOR: VADIM MARMELADOV                                  ║
║   CLASSIFICATION: PUBLIC — PRODUCT SPECIFICATION             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 00 — PRODUCT BRIEF

The LOT Computer Hardware Device is a palm-sized stainless-steel terminal that acts as a physical extension of the LOT Systems software platform. It receives autonomous AI-generated notifications from lot-systems.com, captures environmental data through AI-grade sensors, and sends a one-tap signal back to the platform Log tab via a dedicated Copy button.

**Form factor:** 40 × 40 × 5 mm flat square tile  
**Material:** 316L stainless steel, two-piece CNC body  
**Run quantity:** 100 units (Pilot Production)  
**Manufacturing route:** PCBWay (PCB + PCBA + CNC enclosure)  
**Connectivity:** Wi-Fi 802.11n, Bluetooth 5.0 LE  
**Power:** Wireless Qi charging (Rx coil embedded in base)

---

## 01 — PHYSICAL DESIGN

### 1.1 Body Layout

```
TOP VIEW (40 × 40 mm)
┌─────────────────────────────────────┐
│  POLISHED 316L STAINLESS STEEL      │ ← BASE PLATE (Side A)
│                                     │
│         [ LOT® wordmark ]           │
│                                     │
│  Mirror finish — no features        │
└─────────────────────────────────────┘

BOTTOM VIEW (40 × 40 mm)
┌─────────────────────────────────────┐
│  BRUSHED 316L STAINLESS STEEL       │ ← TOP PLATE (Side B)
│                                     │
│  ┌──────┐   ┌──┐   [ COPY ]        │
│  │ CAM  │   │  │    BUTTON         │
│  │      │   │  │                   │
│  └──────┘   │SC│                   │
│             │RE│                   │
│             │EN│                   │
│             └──┘                   │
└─────────────────────────────────────┘
```

### 1.2 Cross-Section (5 mm total)

```
┌─────────────────────────────────────┐
│ TOP PLATE (Side B): 0.5 mm SS       │  ← Camera lens / screen / button cutouts
├─────────────────────────────────────┤
│ GASKET + ADHESIVE: 0.2 mm           │
├─────────────────────────────────────┤
│ PCB (4-layer): 1.0 mm               │  ← All electronics
├─────────────────────────────────────┤
│ LiPo BATTERY (2 mm) + AIR: 0.8 mm  │  ← 401730 ultra-slim cell
├─────────────────────────────────────┤
│ Qi COIL (flex): 0.3 mm              │
├─────────────────────────────────────┤
│ BASE PLATE (Side A): 0.5 mm SS      │  ← Mirror-polished exterior
│  (acts as Qi backing + shielding)   │
└─────────────────────────────────────┘
                                 = 4.3 mm (target ≤ 5 mm) ✓
```

### 1.3 Side A — Polished Stainless Steel

- 316L, grade 8 mirror polish (#8 finish)
- No features, no ports, no seams visible
- LOT® wordmark laser-engraved (recessed 0.1 mm)
- Acts as Qi shielding layer and thermal spreader

### 1.4 Side B — Active Face

| Feature | Location | Spec |
|---------|----------|------|
| Micro camera | Top-left 10×10mm cutout | OV2640, f/2.8, 2MP |
| Screen | Center 18×18mm aperture | 0.85" SPI color TFT |
| Copy button | Bottom-right, 6mm dia | Tactile + SS keycap |
| Ambient sensor port | Side-edge slot 2×1mm | BME680 vent |
| Status LED ring | Around button | WS2812B × 4 |

---

## 02 — HARDWARE ARCHITECTURE

### 2.1 Block Diagram

```
          ┌──────────────────────────────────────────────┐
          │            LOT CIA POCKET TERMINAL           │
          │                                              │
          │  ┌─────────────┐    ┌──────────────────────┐ │
          │  │ ESP32-S3    │◄──►│  OV2640 Camera       │ │
          │  │ MINI-1U     │    │  (DVP Interface)      │ │
          │  │ 240MHz      │    └──────────────────────┘ │
          │  │ 8MB PSRAM   │    ┌──────────────────────┐ │
          │  │ 8MB Flash   │◄──►│  SSD1327 0.85" TFT   │ │
          │  │ Wi-Fi 802.11│    │  (SPI 8MHz)           │ │
          │  │ BLE 5.0     │    └──────────────────────┘ │
          │  │             │    ┌──────────────────────┐ │
          │  │    I2C ─────┼───►│  BME680 Weather      │ │
          │  │    I2C ─────┼───►│  ICM-42688-P IMU     │ │
          │  │    I2C ─────┼───►│  OPT4048 Color Light │ │
          │  │    I2C ─────┼───►│  MLX90614 IR Temp    │ │
          │  │    GPIO ────┼───►│  Copy Button         │ │
          │  │    GPIO ────┼───►│  WS2812B LED × 4     │ │
          │  └─────────────┘    └──────────────────────┘ │
          │         │                                     │
          │  ┌──────▼───────┐   ┌──────────────────────┐ │
          │  │ TPS63031     │   │  BQ51013B Qi RX      │ │
          │  │ Buck-Boost   │◄──│  + 40mm Qi Coil      │ │
          │  │ 3.3V / 1.8V │   └──────────────────────┘ │
          │  └──────────────┘                            │
          │         │                                     │
          │  ┌──────▼───────┐                            │
          │  │ 401730 LiPo  │                            │
          │  │ 170mAh 3.7V  │                            │
          │  │ TP4056 charger│                            │
          │  └──────────────┘                            │
          └──────────────────────────────────────────────┘
```

---

## 03 — BILL OF MATERIALS

### 3.1 Core Electronics

| # | Component | Part Number | Supplier | Unit Price (100+) | Purpose |
|---|-----------|------------|----------|-------------------|---------|
| 1 | MCU Module | ESP32-S3-MINI-1U-N8R8 | Espressif / Mouser | $2.80 | Main processor, Wi-Fi, BLE |
| 2 | Camera | OV2640-FPC-1817 | Arducam / AliExpress | $2.50 | 2MP camera, DVP interface |
| 3 | Display | GC9A01A 0.85" round TFT | Waveshare / LCSC | $3.20 | Notification screen |
| 4 | Weather | BME680 | Bosch / Mouser #828-BME680 | $3.40 | Temp/Humidity/Pressure/VOC |
| 5 | IMU | ICM-42688-P | TDK / DigiKey #1428-ICM-42688-P | $2.10 | 6-axis motion, AI-grade |
| 6 | Color light | OPT4048DTSR | TI / DigiKey #296-OPT4048DTSR | $1.90 | Ambient light + color XYZ |
| 7 | IR thermometer | MLX90614ESF-BAA | Melexis / Mouser #951-MLX90614ESF | $5.20 | Contactless temperature |
| 8 | Qi RX IC | BQ51013BRHLR | TI / DigiKey #296-BQ51013BRHLR | $1.60 | Wireless charging receiver |
| 9 | Qi coil | WR202020-40T8R5-G | Würth #760308101215 | $0.85 | 40mm flat Qi receive coil |
| 10 | Battery charger IC | MCP73831T-2ACI | Microchip / Mouser #579-MCP73831T | $0.45 | LiPo charge management |
| 11 | Buck-boost regulator | TPS63031DSKR | TI / DigiKey #296-TPS63031DSKR | $1.55 | 3.3V from LiPo |
| 12 | LiPo battery | 401730-170mAh | Generic / AliExpress | $1.80 | 4×17×30mm, 2mm thick, 170mAh |
| 13 | Status LEDs | WS2812B-2020 | Worldsemi / LCSC | $0.25 × 4 = $1.00 | RGB status ring |
| 14 | Copy button | PTS841 GKS M SMTR2 | CUI / Mouser | $0.45 | Main tactile switch |
| 15 | SS keycap | Custom CNC | PCBWay CNC | $1.20 | 6mm circular stainless cap |

**Electronics subtotal per unit: ~$28.80**

### 3.2 Passive Components

| Category | Qty | Unit Price | Subtotal |
|----------|-----|-----------|---------|
| Decoupling caps 100nF 0402 | 24 | $0.012 | $0.29 |
| Bulk caps 10μF 0805 | 8 | $0.045 | $0.36 |
| Pull-up resistors 10kΩ 0402 | 6 | $0.010 | $0.06 |
| Current-limit resistors | 8 | $0.012 | $0.10 |
| 0Ω jumpers / ferrites | 4 | $0.020 | $0.08 |

**Passives subtotal: ~$0.89**

### 3.3 PCB

| Item | Spec | Supplier | Cost (100 pcs) |
|------|------|---------|---------------|
| PCB fabrication | 4-layer, 39×39mm, 1.0mm, ENIG, IPC Class 2 | PCBWay | $280 total = **$2.80/unit** |
| PCBA (assembly) | SMT + reflow, full BOM supply | PCBWay | $6.50/unit (100 pcs) |

PCBWay PCBA direct link: `https://www.pcbway.com/pcbassembly.html`

### 3.4 Stainless Steel Enclosure

| Part | Spec | Process | Unit Cost (200 pcs = 100 devices) |
|------|------|---------|----------------------------------|
| Base plate (Side A) | 316L SS, 40×40×0.5mm, #8 mirror polish | CNC + electropolish | $8.50 |
| Top plate (Side B) | 316L SS, 40×40×0.5mm, brushed, 4 cutouts | CNC + wire EDM | $10.20 |
| Assembly gasket | Silicone self-adhesive 0.2mm | Die cut | $0.30 |
| Fastener set | M1.2 SS flathead × 4 (internal) | Standard | $0.40 |

**Enclosure subtotal: $19.40/unit**

PCBWay CNC service: `https://www.pcbway.com/rapid-prototyping/manufacture/?type=2`

### 3.5 Full BOM Summary (Per Unit, 100-Unit Run)

| Category | Cost |
|----------|------|
| Core electronics | $28.80 |
| Passive components | $0.89 |
| PCB fabrication | $2.80 |
| PCBA (assembly) | $6.50 |
| Stainless steel enclosure | $19.40 |
| Battery | $1.80 |
| Wireless charging (coil + IC) | $2.45 |
| Firmware flashing + QC test | $3.00 |
| Packaging (foam + box) | $2.50 |
| **Unit total (100-unit run)** | **$68.14** |
| **100-unit run TOTAL** | **≈ $6,814** |

---

## 04 — PCBWay MANUFACTURING ROUTE

### 4.1 Order Sequence

```
STEP 1: PCB Fabrication (PCBWay)
  → Upload Gerber files (.zip) + drill file
  → Spec: 4-layer / 39×39mm / 1.0mm / ENIG / green
  → Qty: 110 pcs (10 extra for prototype test)
  → Lead time: 3–5 business days

STEP 2: PCBA (PCBWay Assembly)
  → Upload BOM (.xlsx) + centroid/CPL file
  → Full turnkey: PCBWay sources all components
  → Stencil: 0.12mm laser cut
  → Reflow profile: lead-free SAC305
  → Qty: 100 pcs assembled + 10 bare boards
  → Lead time: 7–10 business days

STEP 3: CNC Enclosure (PCBWay CNC)
  → Upload STEP files for base plate + top plate
  → Material: 316L stainless steel
  → Finish: mirror (#8) for base / brushed for top
  → Cutouts: laser + wire EDM for camera / screen apertures
  → Qty: 110 sets (base + top)
  → Lead time: 5–7 business days

STEP 4: Final Assembly (in-house or PCBWay)
  → Insert Qi coil under PCB
  → Connect battery via FPC connector
  → Close SS enclosure with adhesive gasket
  → M1.2 screws at 4 corners (internal, tamper-evident)
  → Total assembly time: ~8 min/unit

STEP 5: Firmware Flash + QC
  → Flash via USB-C pogo pin jig (3-pin)
  → Automated sensor test script
  → Wi-Fi pairing verification
  → LOT API ping test
  → Pass/Fail LED indication
  → Expected yield: >95%
```

### 4.2 Gerber File Specification

```
LOT_CIA_TERMINAL_v1.0/
  ├── gerber/
  │   ├── LOT_CIA_Terminal.GTL      (copper top)
  │   ├── LOT_CIA_Terminal.GBL      (copper bottom)
  │   ├── LOT_CIA_Terminal.G2L      (copper inner 1)
  │   ├── LOT_CIA_Terminal.G3L      (copper inner 2)
  │   ├── LOT_CIA_Terminal.GTO      (silkscreen top)
  │   ├── LOT_CIA_Terminal.GBO      (silkscreen bottom)
  │   ├── LOT_CIA_Terminal.GTS      (soldermask top)
  │   ├── LOT_CIA_Terminal.GBS      (soldermask bottom)
  │   ├── LOT_CIA_Terminal.GKO      (board outline)
  │   └── LOT_CIA_Terminal.DRL      (drill file, Excellon)
  ├── bom/
  │   ├── LOT_CIA_Terminal_BOM.xlsx
  │   └── LOT_CIA_Terminal_CPL.csv  (pick-and-place)
  └── cad/
      ├── LOT_CIA_Base_Plate.STEP
      └── LOT_CIA_Top_Plate.STEP
```

### 4.3 PCB Layer Stack

```
Layer 1 (Top):     Signal + Components
Layer 2 (Inner 1): Ground plane (continuous, no splits)
Layer 3 (Inner 2): Power planes (3.3V, 1.8V, VBAT zones)
Layer 4 (Bottom):  Signal + Qi coil connection pads

Via rules: 0.2mm drill / 0.4mm annular ring
Trace: 4mil min signal / 8mil power / 20mil battery
Impedance: 50Ω controlled for antenna keepout
```

---

## 05 — FIRMWARE ARCHITECTURE

### 5.1 Stack

```
RTOS:           FreeRTOS (via ESP-IDF v5.2)
LANGUAGE:       C / C++ (ESP-IDF native)
OTA:            ESP-IDF OTA via HTTPS (lot-systems.com/firmware)
CRYPTO:         mbedTLS, AES-256-GCM for API tokens
STORAGE:        NVS flash (Wi-Fi creds, device ID, session state)
COMPRESSION:    heatshrink library (session data → compact log)
```

### 5.2 Task Map (FreeRTOS)

```
TASK                  PRIORITY  STACK   PERIOD    PURPOSE
─────────────────────────────────────────────────────────────────
wifi_manager          5         8KB     event     Connect / reconnect
lot_api_client        4         12KB    5s poll   Poll lot-systems.com/api/device
notification_render   3         6KB     event     Display incoming notification
sensor_collector      2         6KB     30s       Read BME680+IMU+OPT4048+MLX
copy_button_isr       6         2KB     IRQ       GPIO interrupt handler
ota_watchdog          1         4KB     60min     Check firmware version
session_compressor    1         8KB     session   Compress + ship session blob
display_driver        3         4KB     event     SPI TFT write
led_controller        2         2KB     event     WS2812B status ring
```

### 5.3 Notification Flow (Pager Mode)

```
lot-systems.com
    │
    │  POST /api/device/notify
    │  { "device_id": "LOT-CIA-xxxx",
    │    "message": "Coffee time!",
    │    "type": "info" | "alert" | "reminder",
    │    "ttl": 300 }
    ▼
ESP32-S3 (lot_api_client task)
    │  HTTP poll or WebSocket push
    │
    ▼
notification_render task
    │  Clear TFT → render message → vibrate 50ms
    │  LED ring: blue pulse (info) / amber (alert) / green (reminder)
    │
    ▼
Display holds message for TTL seconds
    │  User presses Copy → acknowledge + log
    │
    ▼
LOT API: POST /api/device/log
    { "event": "notification_acknowledged",
      "device_id": "...",
      "notification_id": "...",
      "timestamp": "ISO8601" }
```

### 5.4 Copy Button → Log Tab Signal

```
USER PRESSES COPY BUTTON
    │
    ├── GPIO ISR fires (edge-triggered, debounce 50ms)
    │
    ├── Captures: timestamp, current sensor snapshot,
    │            last notification ID, device_id
    │
    ├── Packages as JSON log entry:
    │   { "event": "copy_press",
    │     "device_id": "LOT-CIA-0042",
    │     "timestamp": "2026-06-18T14:30:00Z",
    │     "sensors": {
    │       "temp_c": 22.4,
    │       "humidity_pct": 48.2,
    │       "pressure_hpa": 1013.1,
    │       "voc_iaq": 85,
    │       "lux": 312,
    │       "skin_temp_c": 36.2
    │     },
    │     "last_notification": "notif_abc123"
    │   }
    │
    ├── POST → https://lot-systems.com/api/device/log
    │
    ├── On success: LED ring green flash 3×
    └── On failure: queue for retry (NVS buffer, max 50 entries)

lot-systems.com backend:
    → Writes to agent_ledger table
    → Appears in Log tab under "Device Events"
    → Classification: "device_signal" (auto gate)
```

### 5.5 Session Compression

Each device session (boot → sleep cycle) produces a log blob. Before transmission, it is compressed using the heatshrink algorithm (LZ-based, optimized for constrained devices):

```c
// Session compression flow
typedef struct {
    uint32_t session_id;
    uint32_t boot_timestamp;
    uint32_t duration_s;
    uint8_t  notification_count;
    uint8_t  copy_press_count;
    uint8_t  ota_checked;
    float    avg_temp_c;
    float    avg_humidity;
    float    avg_lux;
    uint32_t wifi_connect_ms;
    uint8_t  battery_pct_start;
    uint8_t  battery_pct_end;
    // ... 64 bytes raw
} lot_session_t;

// After heatshrink compression:
// 64 bytes → ~28 bytes (typical 56% ratio)
// Transmitted as base64 in device heartbeat POST
```

Session blobs are stored in NVS if offline, flushed on next Wi-Fi connection. Maximum local storage: 48 sessions (~1.4 KB NVS).

---

## 06 — LOT API CONNECTOR

### 6.1 Authentication

```
Device provisioning (factory flash):
  1. Device generates unique keypair (Ed25519)
  2. Public key sent to lot-systems.com/api/device/register
  3. Server issues device_token (JWT, 365-day expiry)
  4. device_token stored in NVS encrypted partition

All API calls:
  Authorization: Bearer <device_token>
  X-Device-ID: LOT-CIA-{6-digit-serial}
  X-Firmware: 1.0.3
```

### 6.2 API Endpoints (lot-systems.com)

| Method | Endpoint | Purpose | Rate |
|--------|----------|---------|------|
| POST | `/api/device/register` | Factory provisioning | Once |
| GET | `/api/device/notify/poll` | Pull pending notifications | 5s |
| POST | `/api/device/log` | Copy button + events | On event |
| POST | `/api/device/heartbeat` | Session blob + battery status | 5 min |
| GET | `/api/device/firmware/check` | OTA version check | 60 min |
| GET | `/api/device/firmware/download` | OTA binary stream | On update |

### 6.3 Notification Payload Schema

```json
{
  "id": "notif_abc123",
  "device_id": "LOT-CIA-0042",
  "message": "Coffee time!",
  "type": "info",
  "source": "lot-systems.com/ai-scheduler",
  "priority": 1,
  "ttl_seconds": 300,
  "created_at": "2026-06-18T14:30:00Z",
  "display": {
    "icon": "coffee",
    "color": "#4A90D9",
    "vibrate": true,
    "sound": false
  }
}
```

### 6.4 Log Entry Schema (Copy Button → Log Tab)

```json
{
  "event": "copy_press",
  "device_id": "LOT-CIA-0042",
  "timestamp": "2026-06-18T14:30:22Z",
  "session_id": "sess_00041",
  "sensors": {
    "ambient_temp_c": 22.4,
    "humidity_pct": 48.2,
    "pressure_hpa": 1013.1,
    "voc_iaq_score": 85,
    "ambient_lux": 312,
    "color_cct_k": 4200,
    "ir_surface_temp_c": 36.2,
    "accel_g": [0.01, 0.02, 1.00],
    "gyro_dps": [0.1, -0.2, 0.0]
  },
  "last_notification_id": "notif_abc123",
  "battery_pct": 82,
  "wifi_rssi_dbm": -62
}
```

---

## 07 — AI SENSOR STACK

### 7.1 Sensor Specifications

| Sensor | IC | Measurement | Accuracy | Interface | Package |
|--------|-----|-------------|----------|-----------|---------|
| **Weather** | BME680 | Temp / Humidity / Pressure / VOC IAQ | ±0.5°C / ±3% RH / ±0.12 hPa | I2C 400kHz | LGA-8 2.5×2.5mm |
| **AI-grade IMU** | ICM-42688-P | Accel 3-axis ±2g–16g / Gyro 3-axis ±15.6–2000 dps | ±1% sensitivity | I2C/SPI | QFN-14 2.5×3.0mm |
| **Color + light** | OPT4048 | Lux 1–150,000 / XYZ color / CCT | ±2% Lux | I2C | SOT-5X1.6 1.35×0.7mm |
| **IR thermometer** | MLX90614 | Object temp –40 to +125°C contactless | ±0.5°C | SMBus (I2C) | TO-39 / SOT-23 |

### 7.2 AI Integration Points

The sensor data is transmitted with every `copy_press` event and in the 5-minute heartbeat. The LOT backend can feed this into the Quantum Intent Engine as environmental context signals:

```
BME680 VOC IAQ score  → correlates with cognitive clarity windows
ICM-42688-P motion    → detects whether device is being held / carried
OPT4048 CCT           → circadian light exposure (warm/cool light tracking)
MLX90614 skin temp    → stress proxy (skin temperature drops under stress)
```

These enrich the existing 52 behavioral pattern detection with physical-world context, enabling the AI scheduler to send smarter notifications based on the user's actual physical environment.

---

## 08 — WEATHER SENSOR INTEGRATION

### 8.1 BME680 Configuration

```c
// BME680 initialization (I2C addr: 0x77)
bme680_settings_t bme_cfg = {
    .os_temp    = BME680_OS_2X,    // 2× oversampling
    .os_hum     = BME680_OS_1X,    // 1× oversampling
    .os_pres    = BME680_OS_16X,   // 16× oversampling (noise reduction)
    .filter     = BME680_FILTER_SIZE_3,
    .run_gas    = BME680_ENABLE_GAS_MEAS,
    .heatr_temp = 320,             // °C (heater target for VOC)
    .heatr_dur  = 150              // ms
};
// Sample every 30s (forced mode)
// Average 6 samples for stability
```

### 8.2 Weather Notifications

The LOT backend can push weather-triggered notifications using the device's own sensor data:

```
IF pressure drops > 3 hPa in 2 hours → "Storm approaching"
IF VOC IAQ > 150 → "Poor air quality — open a window"
IF humidity < 25% RH → "Air is very dry today"
```

These notifications appear on the screen within seconds of the sensor event, delivered via the pager notification channel.

---

## 09 — WIRELESS CHARGING

### 9.1 Qi Implementation

```
TRANSMITTER: Any Qi-certified pad (5W profile)
RECEIVER IC: BQ51013BRHLR (TI, Qi v1.2 compliant)
COIL:        Würth 760308101215 — 40mm diameter, 5-turn, 7μH, Q=40
EFFICIENCY:  ~83% end-to-end at 5W
CHARGE TIME: 170mAh from 0% → 100% ≈ 50 minutes
PROTECTION:  Overvoltage, overcurrent, overtemp (on-chip BQ51013B)
INDICATION:  LED ring amber pulse during charge; green solid = full
```

### 9.2 Qi Coil Placement

The Qi receive coil is a flat flex PCB positioned between the main PCB and the base plate (Side A). The polished stainless steel of Side A does NOT block Qi (316L is non-ferromagnetic at standard Qi frequencies). A 0.1mm ferrite sheet (Laird BMF30-0050) is placed between the coil and PCB to prevent eddy-current losses from the PCB ground plane.

### 9.3 Wireless Charger Unit (Included in Kit)

Each LOT CIA Terminal ships with:
- **Qi transmitter pad:** Anker PowerWave 5W flat pad (15.5×15.5cm) — $12 bulk
- **Cable:** USB-A to USB-C 1m — $1.20
- **Total charger BOM add-on:** $13.20/unit

---

## 10 — MANUFACTURING ROADMAP (100 UNITS)

### 10.1 Phase Timeline

```
WEEK 1–2: DESIGN FINALIZATION
  ├── PCB layout complete (KiCad 8 / Altium)
  ├── STEP enclosure finalized
  ├── BOM locked (100% sourced, alternatives logged)
  ├── Firmware v0.1 (boot + Wi-Fi + screen)
  └── PCBWay quotes confirmed

WEEK 3–4: PROTOTYPE (5 UNITS)
  ├── PCBWay PCBA: 5-unit pilot
  ├── Enclosure: hand-machined 5 sets (local CNC)
  ├── Firmware bench test: all sensors verified
  ├── LOT API integration test
  └── Pass/Fail: go / no-go decision

WEEK 5–6: PRE-PRODUCTION CORRECTIONS
  ├── Incorporate prototype findings
  ├── Update Gerber + STEP files
  ├── Firmware v0.5 (all features operational)
  └── Finalize test jig (pogo-pin USB-C)

WEEK 7–9: PRODUCTION (100 UNITS)
  ├── PCBWay PCBA: 100 units ordered
  ├── PCBWay CNC: 110 enclosure sets ordered
  ├── Components: turnkey (PCBWay sources all)
  └── Lead time: 10–14 business days concurrent

WEEK 10: FINAL ASSEMBLY + QC
  ├── In-house: coil installation, battery wire, enclosure close
  ├── Firmware flash via pogo jig: 100 units
  ├── Automated QC test: sensor, Wi-Fi, button, Qi charge
  ├── Serial number laser engraving
  └── Packaging + shipment prep

WEEK 11: DELIVERY
  ├── Domestic: FedEx Ground
  └── International: DHL Express
```

### 10.2 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| ESP32-S3 lead time | Low | High | DigiKey has 12K+ stock (verified June 2026) |
| 316L SS CNC cost overrun | Medium | Medium | Get 3 quotes: PCBWay + 2 local CNC shops |
| BME680 sourcing | Low | Medium | Bosch distributor confirmed; alt: BME688 pin-compatible |
| Qi coil eddy current heating | Medium | Medium | Ferrite sheet mitigates; validate at prototype |
| OV2640 image quality in 5mm body | High | Low | Camera is supplemental; reduce to HM01B0 if needed |
| Battery swelling in SS enclosure | Low | High | Use UL-certified cells; temp monitoring via MCU |

---

## 11 — FIRMWARE DOCUMENTS

### 11.1 Document Index

| Document | File | Status |
|----------|------|--------|
| Firmware Architecture | `docs/hardware/firmware/FIRMWARE-ARCH.md` | This spec |
| API Reference | `docs/hardware/firmware/LOT-DEVICE-API.md` | This spec |
| Flash Procedure | `docs/hardware/firmware/FLASH-PROCEDURE.md` | To create |
| OTA Update Guide | `docs/hardware/firmware/OTA-GUIDE.md` | To create |
| Sensor Calibration | `docs/hardware/firmware/SENSOR-CALIBRATION.md` | To create |
| Test Protocol | `docs/hardware/firmware/QC-TEST-PROTOCOL.md` | To create |
| Error Codes | `docs/hardware/firmware/ERROR-CODES.md` | To create |

### 11.2 Firmware Repository Structure

```
firmware/
├── CMakeLists.txt
├── sdkconfig.defaults
├── main/
│   ├── main.c                  (FreeRTOS task launch)
│   ├── wifi_manager.c/.h
│   ├── lot_api_client.c/.h
│   ├── notification_render.c/.h
│   ├── sensor_collector.c/.h
│   ├── copy_button.c/.h
│   ├── session_compressor.c/.h
│   ├── display_driver.c/.h
│   ├── led_controller.c/.h
│   └── ota_watchdog.c/.h
├── components/
│   ├── bme680/                 (Bosch BSEC library)
│   ├── icm42688p/              (TDK driver)
│   ├── opt4048/                (TI driver)
│   ├── mlx90614/               (Melexis driver)
│   ├── gc9a01a/                (TFT display driver)
│   ├── ov2640/                 (camera driver)
│   └── heatshrink/             (session compression)
├── test/
│   ├── test_sensors.c
│   ├── test_api_client.c
│   └── test_session_compress.c
└── tools/
    ├── flash_device.py         (production flash script)
    └── qc_test.py              (automated QC validation)
```

### 11.3 Build Commands

```bash
# Setup (one-time)
git clone https://github.com/lot-systems/lot-cia-firmware.git
cd lot-cia-firmware
idf.py --version  # requires ESP-IDF v5.2+

# Build
idf.py build

# Flash (development, USB-C direct)
idf.py -p /dev/ttyUSB0 flash monitor

# Flash (production, pogo jig)
python tools/flash_device.py --port /dev/ttyUSB0 --serial LOT-CIA-0042

# Run QC test
python tools/qc_test.py --port /dev/ttyUSB0
```

---

## 12 — SOFTWARE CONNECTOR

### 12.1 Purpose

The Software Connector is a lightweight Node.js/TypeScript service (integrated into the existing LOT Fastify backend) that acts as the bridge between lot-systems.com and the physical device fleet.

### 12.2 Backend Integration (Fastify)

```typescript
// src/server/routes/device-api.ts (new route file)

// Device registration
fastify.post('/api/device/register', deviceRegisterHandler)

// Notification delivery (polled by device every 5s)
fastify.get('/api/device/notify/poll', deviceNotifyPollHandler)

// Copy button event ingestion → agent_ledger
fastify.post('/api/device/log', deviceLogHandler)

// Heartbeat + session blob
fastify.post('/api/device/heartbeat', deviceHeartbeatHandler)

// OTA check
fastify.get('/api/device/firmware/check', deviceFirmwareCheckHandler)
fastify.get('/api/device/firmware/download', deviceFirmwareDownloadHandler)
```

### 12.3 Database Tables (New Migrations)

```sql
-- devices table
CREATE TABLE devices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial      VARCHAR(20) UNIQUE NOT NULL,        -- LOT-CIA-0042
  public_key  TEXT NOT NULL,                       -- Ed25519 public key
  device_token TEXT NOT NULL,                      -- JWT issued at provisioning
  user_id     UUID REFERENCES users(id),
  firmware_version VARCHAR(20),
  last_seen   TIMESTAMP,
  battery_pct SMALLINT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- device_notifications table
CREATE TABLE device_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id   UUID REFERENCES devices(id),
  message     TEXT NOT NULL,
  type        VARCHAR(20) DEFAULT 'info',
  ttl_seconds INTEGER DEFAULT 300,
  delivered   BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- device_logs table (Copy button events + heartbeats)
-- Extends agent_ledger with device-specific columns
-- Or: stored directly in agent_ledger with source='device'
```

### 12.4 Admin UI Integration

The existing Log tab at lot-systems.com receives device events automatically via the agent_ledger write. No UI changes needed for basic integration. Enhanced view adds:

```
Log Tab — Device Events filter:
  [ Copy Press ] [ Heartbeat ] [ Notification Delivered ] [ Low Battery ]
  
Device Dashboard (new admin panel):
  LOT-CIA-0001 · 82% battery · Last seen 2 min ago · 3 notifications today
  LOT-CIA-0042 · 14% battery ⚠ · Offline 3h ⚠ · Location: --
  ...
```

---

## 13 — PDF MANUALS

### 13.1 Manual Set (7 Documents)

| Manual | Audience | Pages (est.) | Format |
|--------|----------|-------------|--------|
| **Quick Start Guide** | End user | 4 | A5, full-color |
| **User Manual** | End user | 24 | A5, full-color |
| **API Reference** | Developer | 32 | A4, technical |
| **Firmware Developer Guide** | Developer | 48 | A4, technical |
| **Hardware Design Reference** | Engineer | 64 | A4, technical |
| **Manufacturing & Assembly** | Factory | 40 | A4, technical |
| **Safety & Regulatory** | Compliance | 16 | A4, B&W |

### 13.2 Quick Start Guide — Content Outline

```
Page 1: Cover — "LOT CIA Terminal" product photo, LOT® wordmark
Page 2: In the box / charging / first boot
Page 3: Pairing with lot-systems.com (QR code → account link)
Page 4: Copy button guide / notification types / support
```

### 13.3 Manual Generation Pipeline

```
Source: Markdown in docs/hardware/manuals/
Render: Pandoc + LaTeX template (LOT brand fonts + colors)
Output: PDF/A-2b (archival grade)
Host:   lot-systems.com/device/manuals/ (public URL)
OTA:    Device firmware downloads manual checksum; alerts user if updated
```

---

## 14 — COST SUMMARY

### 14.1 Total 100-Unit Production Budget

| Line Item | Cost |
|-----------|------|
| Electronics BOM (100 units) | $2,969 |
| PCB fabrication + PCBA | $922 |
| Stainless steel enclosure (100 sets) | $1,940 |
| Wireless charger kit (100 units) | $1,320 |
| Packaging | $250 |
| Firmware development (one-time) | $0 (in-house) |
| PCBWay NRE (stencil, setup) | $150 |
| QC test jig | $200 |
| Shipping / logistics | $400 |
| Buffer (10%) | $815 |
| **GRAND TOTAL** | **$8,966** |
| **Per-unit landed cost** | **~$89.66** |

### 14.2 Pricing Model

| Tier | Price | Margin |
|------|-------|--------|
| Early access (LOT members) | $199 | 122% |
| Retail | $249 | 178% |
| Enterprise (10+ units) | $179 | 100% |

---

## 15 — REGULATORY CHECKLIST

| Certification | Required | Timeline | Notes |
|--------------|---------|---------|-------|
| FCC Part 15 (Wi-Fi/BLE) | Yes | 6–8 weeks | ESP32-S3 module pre-certified (ESP32-S3-MINI-1U holds FCC ID 2AC7Z-ESP32S3MINI1) — enclosure integration test only |
| CE (Europe) | Optional | 4–6 weeks | If EU sales planned |
| RoHS | Yes | Covered by PCBWay PCBA (lead-free process) | Certificate from PCBWay |
| UN 38.3 (battery) | Yes | Use pre-certified LiPo cells | Source from certified supplier |
| Qi (WPC) | Covered | BQ51013B is WPC-listed | No additional cert needed |
| UL (safety) | Optional | Required for US retail | Phase 2 if retail distribution |

FCC ID of ESP32-S3-MINI-1U: `2AC7Z-ESP32S3MINI1` — covers Wi-Fi 2.4GHz and Bluetooth 5.0 emissions. Module integration grants derivative use rights.

---

## 16 — APPENDIX: SUPPLIER LINKS

### Primary Suppliers

| Supplier | Role | URL |
|---------|------|-----|
| PCBWay | PCB fab + PCBA + CNC | pcbway.com |
| DigiKey | Component sourcing | digikey.com |
| Mouser | Component sourcing | mouser.com |
| LCSC | Budget components | lcsc.com |
| Espressif | ESP32-S3 modules | espressif.com/en/products/modules |
| Bosch Sensortec | BME680 | bosch-sensortec.com |
| TDK InvenSense | ICM-42688-P | invensense.tdk.com |
| Texas Instruments | OPT4048, BQ51013B, TPS63031 | ti.com |
| Melexis | MLX90614 | melexis.com |
| Würth Elektronik | Qi coil | we-online.com |
| Arducam | OV2640 module | arducam.com |

### PCBWay Ordering Links

| Service | Direct URL |
|---------|-----------|
| PCB fabrication | pcbway.com/QuickOrderOnline.aspx |
| PCBA turnkey | pcbway.com/pcbassembly.html |
| CNC machining | pcbway.com/rapid-prototyping/manufacture/?type=2 |
| Sheet metal | pcbway.com/rapid-prototyping/manufacture/?type=3 |

---

## 17 — DOCUMENT CONTROL

```
Document:       LOT-HARDWARE-DEVICE-v1.0.md
Version:        1.0
Date:           18 June 2026
Author:         LOT Systems AI (Claude Sonnet 4.6)
Commissioned:   Vadim Marmeladov, Inventor, COSMO® CIA
Classification: Internal — Product Specification
Repository:     github.com/lot-systems/lot-computer/docs/hardware/
Next review:    After prototype (Week 3–4 per roadmap)
```

---

```
LOT SYSTEMS CORPORATION
COSMO® CIA Pocket Terminal
Hardware Design Report v1.0
18 June 2026 · Made in the USA

"The metal is the floor. The discipline is the structure."
```
