<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT NODE-1
## Hardware Computer — Full Specification & Production Roadmap
### Document Type: Hardware Design Brief · Revision: v1.0 · Date: 2026-06-29
### Author: Claude Code Session · Inventor: Vadik Marmeladov, COSMO® CIA

---

> *"A physical extension of the Memory Engine. Ambient. Silent. Always connected."*

---

## TABLE OF CONTENTS

```
 1. EXECUTIVE SUMMARY
 2. DEVICE IDENTITY
 3. PHYSICAL SPECIFICATION
 4. HARDWARE ARCHITECTURE
 5. COMPONENT SELECTION & BUYING LIST
 6. PCBWAY MANUFACTURING PLAN
 7. LOT API INTEGRATION
 8. FIRMWARE ARCHITECTURE
 9. SOFTWARE — API CONNECTOR
10. WIRELESS CHARGING SPECIFICATION
11. INDUSTRIAL DESIGN SPECIFICATION
12. SESSION COMPRESSION PROTOCOL
13. PRODUCTION ROADMAP — 100 UNITS
14. BUDGET BREAKDOWN
15. PDF MANUAL OUTLINE
16. RISK REGISTER
17. GLOSSARY
```

---

## 1. EXECUTIVE SUMMARY

**LOT NODE-1** is a hardware pager-class device that bridges the LOT Layers-of-Time digital platform with the physical world. It is a 40 × 40 × 5 mm flat square computer enclosed in a two-part stainless steel shell, designed to deliver ambient AI-generated notifications from `lot-systems.com` and to record user intent signals back to the platform's Log tab via a single dedicated **Copy** button.

The device is not a phone. It is not a smartwatch. It is an instrument — silent, polished, purposeful.

**Core function:** Receive proactive AI-dispatched notifications ("Coffee time!", QOS state alerts, Memory Engine check-ins) on a small display, and send one-tap log confirmations back to the LOT platform.

**Platform:** ESP32-S3 SoC · WiFi 802.11 b/g/n · BLE 5.0 · E-ink display · Wireless (Qi) charging · Weather sensor · Camera · PCBWay PCBA + CNC stainless steel body.

**Run size:** 100 units (pilot production).

---

## 2. DEVICE IDENTITY

| Field               | Value                                                  |
|---------------------|--------------------------------------------------------|
| Product name        | LOT NODE-1                                             |
| Codename            | PAGER-1                                                |
| Brand               | COSMO® CIA / LOT Systems                               |
| Inventor            | Vadik Marmeladov                                       |
| Platform            | lot-systems.com                                        |
| Form factor         | Flat square badge / pager                              |
| Primary interaction | Ambient display + single Copy button                   |
| Connectivity        | WiFi 802.11 b/g/n, BLE 5.0                             |
| Power               | Qi wireless charging, 350 mAh LiPo                     |
| Operating system    | FreeRTOS (via ESP-IDF / Arduino framework)             |
| Production method   | PCBWay PCBA + CNC stainless steel                      |
| Pilot run           | 100 units                                              |
| Document set        | This spec + Firmware Doc + Software Doc + PDF Manuals  |

---

## 3. PHYSICAL SPECIFICATION

### 3.1 Outer Dimensions

```
Width:    40 mm
Height:   40 mm
Depth:     5 mm  (total outer shell)
Weight:   ~45 g  (estimated, including battery and SS body)
```

### 3.2 Body

- **Material:** 316L Stainless Steel (corrosion-resistant, food-grade)
- **Construction:** Two-piece CNC-machined shell — top plate + bottom plate with snap-fit or M1.2 screw closure
- **Finish — Side A (rear):** Mirror-polished stainless steel. No markings. Clean reflective surface.
- **Finish — Side B (front):** Bead-blasted matte finish. Houses camera aperture, display window, and Copy button.

### 3.3 Side B Layout (Front Face — 40 × 40 mm)

```
┌─────────────────────────────────────────┐
│  ● Camera (top-left, 5mm aperture)      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │     E-INK DISPLAY               │    │
│  │     27.6 × 27.6 mm              │    │
│  │     200 × 200 px                │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│             [ COPY ]                    │
│          (tactile button)               │
└─────────────────────────────────────────┘
```

### 3.4 Internal Stack (5 mm total depth)

```
Layer                     Thickness
─────────────────────────────────────
SS Top shell              0.5 mm
E-ink display (flex)      0.9 mm
PCB (4-layer rigid)       0.8 mm
LiPo 350 mAh (35×35×3mm) 3.0 mm
SS Bottom shell           0.5 mm
─────────────────────────────────────
SUBTOTAL                  5.7 mm  (engineering target: 5.5 mm)
```

> **Engineering note:** A 0.6 mm PCB variant and 2.5 mm thin LiPo (300 mAh) brings total to 5.4 mm — within tolerance for 5 mm design goal. Final thickness confirmed at proto stage.

---

## 4. HARDWARE ARCHITECTURE

### 4.1 Block Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        LOT NODE-1                            │
│                                                              │
│  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐  │
│  │  ESP32-S3   │────▶│  E-ink 1.54" │     │  OV2640 Cam  │  │
│  │  (MCU+WiFi) │     │  SSD1681     │     │  (ribbon)    │  │
│  │             │────▶│  200×200 px  │     └──────────────┘  │
│  │             │                    │            │           │
│  │             │◀────┤  Copy Button │◀───────────┘           │
│  │             │     └──────────────┘                        │
│  │             │     ┌──────────────┐                        │
│  │             │────▶│  BME280      │  (Temp/Humidity/Press) │
│  │             │     └──────────────┘                        │
│  │             │     ┌──────────────┐                        │
│  │             │◀────│  BQ51013B    │  (Wireless Rx)         │
│  └──────┬──────┘     │  Qi Receiver │                        │
│         │            └──────┬───────┘                        │
│         │            ┌──────▼───────┐                        │
│         └───────────▶│  TP4056      │  (Battery charge IC)  │
│                      │  + LiPo 300mAh                        │
│                      └──────────────┘                        │
└──────────────────────────────────────────────────────────────┘
                              │
                        WiFi / BLE
                              │
                   ┌──────────▼──────────┐
                   │   lot-systems.com   │
                   │   LOT API Server    │
                   │   (Fastify/Node.js) │
                   └─────────────────────┘
```

### 4.2 Communication Flow

```
LOT Server                    LOT NODE-1
──────────                    ──────────
POST /api/device/notify  ───▶  Receive notification
                               Display on e-ink
                               User reads message

User presses Copy button  ───▶  HTTP POST /api/logs
                                 {source: "lot-node-1",
                                  text: "Copy signal",
                                  metadata: {
                                    deviceId: "node-xxx",
                                    notification: "Coffee time!",
                                    weather: {temp, humidity},
                                    timestamp: ISO8601
                                  }}
                                Returns: 200 OK → Log entry created
```

---

## 5. COMPONENT SELECTION & BUYING LIST

### 5.1 Main Components — 100-Unit BOM

| # | Component | Part Number | Supplier | Unit Price (USD) | 100x Total | Link/Source |
|---|-----------|-------------|----------|-----------------|------------|-------------|
| 1 | MCU — ESP32-S3-MINI-1-N8 | ESP32-S3-MINI-1-N8R2 | LCSC / Mouser | $3.20 | $320 | LCSC: C2913202 |
| 2 | E-ink 1.54" 200×200 (SSD1681) | GDEW0154M10 | Good Display / AliExpress | $4.50 | $450 | good-display.com |
| 3 | Camera Module OV2640 (flat flex) | OV2640 22-pin FPC | LCSC / AliExpress | $2.80 | $280 | LCSC: C80544 |
| 4 | Weather Sensor BME280 | BME280 SPI/I2C | Bosch / LCSC | $1.90 | $190 | LCSC: C92489 |
| 5 | Thin LiPo 3.5mm 350mAh (35×35mm) | 353535 3.7V | EEMB / AliExpress | $3.80 | $380 | EEMB: LP353535 |
| 6 | Qi Wireless Rx IC | BQ51013BRHLR | TI / Mouser | $2.20 | $220 | Mouser: 595-BQ51013BRHLR |
| 7 | Qi Rx Coil (thin, 40mm) | WR483232-15F8-G | Wurth Elektronik / Mouser | $1.40 | $140 | Mouser: 760308100 |
| 8 | Battery Charge IC | TP4056 SOT-23 | LCSC | $0.35 | $35 | LCSC: C16002 |
| 9 | Copy Button (SMD 4×4mm) | TS-1109S-A02016 | LCSC | $0.08 | $8 | LCSC: C318884 |
| 10 | 3.3V LDO Regulator | AMS1117-3.3 | LCSC | $0.12 | $12 | LCSC: C347553 |
| 11 | 100nF / 10µF Decoupling Caps | Various 0402 | LCSC | $0.02 ea | $20 (100 kits) | LCSC: bulk |
| 12 | Level Shifter (3.3V↔1.8V for e-ink) | TXB0104PWR | TI / LCSC | $0.45 | $45 | LCSC: C53434 |
| 13 | ESD Protection Array | PRTR5V0U2X | NXP / LCSC | $0.18 | $18 | LCSC: C12333 |
| 14 | PCB — 4-layer 40×40mm | Custom | PCBWay | $5.20 | $520 | pcbway.com |
| 15 | Stainless steel body (2 parts, CNC) | Custom 316L SS | PCBWay CNC | $18.00 | $1,800 | pcbway.com/CNC |
| 16 | FPC Connector (camera, 22-pin 0.5mm) | AFC01-S22ECA-00 | Molex / LCSC | $0.35 | $35 | LCSC: C262263 |
| 17 | FPC Connector (display, 24-pin 0.5mm) | AFC01-S24ECA-00 | Molex / LCSC | $0.35 | $35 | LCSC: C262264 |
| 18 | USB-C port (charging / debug) | TYPE-C-31-M-12 | LCSC | $0.28 | $28 | LCSC: C165948 |
| 19 | Glass lens cover (optical clear 38×38mm) | Custom 0.3mm glass | PCBWay / supplier | $1.20 | $120 | PCBWay custom |
| 20 | Adhesive gasket (IP42 seal) | Custom NBR die-cut | Local rubber supplier | $0.60 | $60 | Local |

**Component subtotal (100 units): ~$4,716**

### 5.2 Wireless Charger (Separate Accessory — 100 units)

| # | Component | Details | Unit Price | 100x Total |
|---|-----------|---------|------------|------------|
| 1 | Qi TX pad (flat, 5W) | WPC Qi 1.2.4 certified, 40×40mm pad | $8.50 | $850 |
| 2 | Qi TX IC | BQ500215YFFR (TI) | $1.80 | $180 |
| 3 | USB-C power input cable | 0.5m, 5V/2A | $1.20 | $120 |
| 4 | Silicone pad housing | Custom mold or off-shelf | $2.40 | $240 |

**Charger subtotal (100 units): ~$1,390**

---

## 6. PCBWAY MANUFACTURING PLAN

### 6.1 Overview

PCBWay (`pcbway.com`) is the primary manufacturing partner for both PCB + PCBA and CNC stainless steel body fabrication.

### 6.2 PCB Specification

```
Board size:          40 × 40 mm
Layer count:         4-layer (Signal / GND / Power / Signal)
Board thickness:     0.8 mm (specify: 0.8mm, not standard 1.6mm)
Copper weight:       1 oz / 35µm (all layers)
Surface finish:      ENIG (Electroless Nickel Immersion Gold)
Soldermask:          Black (both sides)
Silkscreen:          White (top side only)
Min trace/space:     4/4 mil
Min hole size:       0.2 mm
IPC class:           IPC Class 2
Quantity:            110 PCBs (100 production + 10 spares)
```

### 6.3 PCBA (PCB Assembly) via PCBWay

**Service type:** Turnkey PCBA — PCBWay sources components from BOM, assembles, and tests.

```
Assembly type:       SMT (top) + THT (USB-C port)
Stencil:             Laser-cut stainless steel, 0.12mm
Solder paste:        SAC305 lead-free
Reflow:              8-zone nitrogen reflow oven
AOI:                 Automated Optical Inspection (all boards)
X-ray:               BGA/QFN inspection (ESP32-S3 LGA package)
Functional test:     Power-on + WiFi ping + display test (LOT provides test firmware)
Test yield target:   >97%
```

### 6.4 CNC Stainless Steel Body

**Service:** PCBWay CNC Machining + Surface Finishing

```
Material:            316L Stainless Steel
Part A (rear shell): Mirror-polished (#8 mirror finish)
  - 40 × 40 × 1.2 mm (outer)
  - Pocket for PCB + battery stack
  - 4× M1.2 threaded inserts or snap-clip geometry
Part B (front shell): Bead-blasted matte (#4 finish)
  - 40 × 40 × 1.2 mm (outer)
  - Camera aperture: ⌀5.0 mm
  - Display window: 30 × 30 mm (optical glass inset)
  - Button aperture: ⌀5.5 mm
  - USB-C slot: 10 × 4 mm
Quantity:            110 pairs (220 total parts)
Finish confirmation: 2× prototype parts before production run
```

### 6.5 PCBWay Ordering Process

```
Step 1: Gerber files (KiCad → PCBWay Gerber export)
Step 2: BOM + CPL (centroid) file upload
Step 3: PCBWay DFM review (1–2 days)
Step 4: Quote approval + payment
Step 5: PCB fabrication: 5–7 business days
Step 6: PCBA: 7–10 business days after PCB
Step 7: CNC body: 10–14 business days
Step 8: Shipping: DHL Express, 3–5 days to USA
Total lead time: ~30–35 business days (6–7 weeks)
```

---

## 7. LOT API INTEGRATION

### 7.1 Authentication

The device authenticates via a **device API token** — a JWT stored in ESP32 NVS (non-volatile storage). Tokens are issued through a new device-provisioning endpoint on the LOT server.

```
Provisioning endpoint (to be added to LOT server):
POST /api/device/register
Body: { deviceId, deviceModel, firmwareVersion, publicKey }
Returns: { token, refreshToken, userId, deviceConfig }
```

### 7.2 Notification Push (Server → Device)

**Method:** Long-poll or WebSocket (WebSocket preferred for real-time delivery).

```
WebSocket endpoint:
wss://lot-systems.com/api/device/ws?token=<JWT>

Message format (server → device):
{
  "type": "notification",
  "id": "notif-uuid",
  "text": "Coffee time!",
  "source": "memory-engine" | "qos" | "manual",
  "priority": "low" | "normal" | "urgent",
  "displayDuration": 30,   // seconds before auto-clear
  "timestamp": "2026-06-29T10:30:00Z"
}
```

**Fallback:** If WebSocket unavailable, device polls `GET /api/device/notifications/pending` every 60 seconds.

### 7.3 Copy Button Signal (Device → LOT Log Tab)

When the user presses **Copy**, the device posts to the existing `/logs` endpoint:

```
POST https://lot-systems.com/api/logs
Authorization: Bearer <device-jwt>
Content-Type: application/json

{
  "text": "LOT NODE-1 Copy: Coffee time!",
  "metadata": {
    "source": "lot-node-1",
    "deviceId": "node-abc123",
    "notificationId": "notif-uuid",
    "notificationText": "Coffee time!",
    "weather": {
      "temperature": 22.4,
      "humidity": 58,
      "pressure": 1013.2
    },
    "firmwareVersion": "1.0.0",
    "timestamp": "2026-06-29T10:31:15Z"
  }
}

Response: 201 Created
{ "id": "log-uuid", "createdAt": "..." }
```

The log entry appears in the user's **Log tab** on lot-systems.com exactly as any other self-care log entry, tagged with source `lot-node-1`.

### 7.4 Weather Data Sync

The device reads the BME280 sensor and posts weather data at 30-minute intervals, syncing with the user's QOS ambient context:

```
POST https://lot-systems.com/api/device/weather
{
  "temperature": 22.4,
  "humidity": 58,
  "pressure": 1013.2,
  "deviceId": "node-abc123",
  "timestamp": "..."
}
```

---

## 8. FIRMWARE ARCHITECTURE

**Platform:** ESP-IDF v5.x + FreeRTOS  
**Language:** C (core) + Arduino-compatible wrapper where appropriate  
**OTA:** Over-the-air firmware updates via HTTPS from lot-systems.com

### 8.1 Task Map (FreeRTOS Tasks)

```
Task Name           Priority   Stack     Function
────────────────────────────────────────────────────────────────
wifi_task           5          8KB       WiFi connect, reconnect loop
websocket_task      4          12KB      WS connection to LOT server
notification_task   4          8KB       Receive + queue notifications
display_task        3          8KB       E-ink render, partial refresh
sensor_task         2          4KB       BME280 read @ 30min interval
button_task         6          4KB       Copy button debounce + POST
camera_task         2          16KB      OV2640 capture on demand
ota_task            1          16KB      Background OTA update check
battery_task        2          4KB       ADC battery voltage monitor
sleep_task          1          4KB       Deep sleep management
```

### 8.2 Boot Sequence

```
1. Power on → ESP32-S3 ROM bootloader
2. Load app partition from flash
3. Initialize NVS — load WiFi creds + device token
4. Start WiFi task — connect to last-known SSID
5. Start sensor task — initial BME280 read
6. Start display task — show LOT logo + connecting...
7. WebSocket connect to lot-systems.com
8. Display "Ready" on e-ink
9. Enter main loop (event-driven)
```

### 8.3 Display Logic

- **Normal state:** Last received notification (persists on e-ink, no power needed)
- **New notification:** Partial refresh (1.5 sec) → show new text
- **Copy pressed:** Display "✓ Logged" for 3 sec → revert to notification
- **No notification:** LOT logo + time + weather (temperature + humidity)
- **Low battery (<10%):** Battery warning overlay on notification

### 8.4 Power Management

```
State               Current Draw    Battery Life
────────────────────────────────────────────────
WiFi active (WS)    70 mA avg       ~4.5 hours
WiFi connected      25 mA avg       ~12 hours
Deep sleep          0.015 mA        ~800 days
Display (e-ink)     +20 mA (refresh only, 0 hold)

Target duty cycle:  WiFi active 5min/hour → ~24h battery life
```

### 8.5 Session Compression

At the end of each active session (defined as a period with ≥1 notification received), the firmware compresses and stores a session summary in NVS:

```c
typedef struct {
  uint32_t session_id;
  uint32_t start_ts;
  uint32_t end_ts;
  uint8_t  notification_count;
  uint8_t  copy_count;
  float    avg_temperature;
  float    avg_humidity;
  uint8_t  battery_start;
  uint8_t  battery_end;
  char     last_notification[64];
} SessionSummary;
```

Sessions upload to LOT server when WiFi is available. NVS stores the last 32 sessions (ring buffer).

---

## 9. SOFTWARE — API CONNECTOR

**Repository:** `/src/server/routes/device-api.ts` (new file, LOT Computer repo)  
**Language:** TypeScript (matches existing LOT Systems stack)

### 9.1 New Endpoints Required

The following endpoints must be added to the LOT server to support LOT NODE-1:

```typescript
// Device registration
POST   /api/device/register
POST   /api/device/refresh-token

// Notification dispatch
GET    /api/device/notifications/pending
DELETE /api/device/notifications/:id/ack

// WebSocket gateway
WS     /api/device/ws

// Weather ingestion
POST   /api/device/weather

// Session upload
POST   /api/device/session

// OTA firmware
GET    /api/device/firmware/latest
GET    /api/device/firmware/:version/download
```

### 9.2 Device Pairing Flow (Web UI)

A new **Devices** section in the LOT Settings tab allows users to:

1. Click "Pair LOT NODE-1"
2. Server generates a one-time pairing code (6 digits)
3. User enters code on device via long-press button sequence
4. Device exchanges code for permanent JWT
5. Device appears in Settings → Devices list with status, battery %, firmware version

### 9.3 Notification Dispatch (Admin / AI Engine)

The LOT Memory Engine and QOS engine can dispatch notifications to paired devices:

```typescript
// Called by memory engine, QOS, or manual admin trigger
await dispatchDeviceNotification(userId, {
  text: "Coffee time!",
  source: "memory-engine",
  priority: "normal",
  ttl: 3600  // expires in 1 hour if undelivered
})
```

---

## 10. WIRELESS CHARGING SPECIFICATION

### 10.1 Standard

- **Protocol:** Qi 1.2.4 (WPC standard)
- **Power class:** 5W (BPP — Baseline Power Profile)
- **Rx IC:** Texas Instruments BQ51013BRHLR
- **Rx coil:** Würth Elektronik WR483232-15F8-G (32×32mm, fits inside 40×40 SS shell)
- **Charging time:** 0 → 100% in approximately 1.5 hours at 5W

### 10.2 Charger Pad (Accessory)

- Flat square pad, ~50×50mm, silicone base
- Tx IC: BQ500215YFFR (TI)
- Input: USB-C 5V/2A
- LED indicator: single blue LED (charging) / green (full)
- Alignment: passive magnets in charger pad align with device (optional v2 feature)

### 10.3 USB-C Backup

- USB-C port (bottom edge slot in SS body) used for firmware flashing + emergency charging
- Not intended for daily charging — Qi is primary

---

## 11. INDUSTRIAL DESIGN SPECIFICATION

### 11.1 Design Language

LOT NODE-1 follows the COSMO® CIA aesthetic: **minimal, precise, premium**. No branding on exterior. No ports visible from front. The device communicates through its material quality alone.

### 11.2 Material: 316L Stainless Steel

- **Grade:** 316L — marine-grade, highest corrosion resistance
- **Hardness:** ~180 HB (Brinell)
- **Why not 304:** 316L has superior pitting resistance for daily-carry use against sweat, humidity
- **Magnetic:** Non-magnetic (critical for Qi coil performance)

### 11.3 Surface Finishes

| Side | Finish | Spec | Process |
|------|--------|------|---------|
| Rear (Side A) | Mirror polish | #8 mirror (Ra ≤ 0.025 µm) | Mechanical polish + electropolish |
| Front (Side B) | Bead blast | #4 satin (Ra 0.8–1.6 µm) | 120-grit steel bead blast |
| Edges (4 sides) | Brushed | Directional grain | Belt sander finish |

### 11.4 Assembly

```
1. Insert Qi coil → adhere with 0.1mm double-sided kapton tape
2. Solder FPC connectors → camera + display ribbons
3. Insert LiPo → secure with adhesive-backed foam
4. Snap front shell → camera FPC through aperture
5. Insert display behind optical glass (UV-bonded)
6. Install Copy button cap (flush, no protrusion)
7. Join SS halves → 4× M1.2 screws (torque: 0.03 N·m)
8. Apply NBR gasket seal to perimeter
9. Final inspection: display on, WiFi connect, button test
```

### 11.5 Packaging

- Rigid matte black cardboard box, 60×60×30mm
- Device presented on black foam cutout
- 1x USB-C cable (0.3m, white, braided)
- 1x Qi charging pad
- 1x Quick Start Card (credit-card sized, matte black, white text)
- NO plastic wrap on device — direct touch on unboxing

---

## 12. SESSION COMPRESSION PROTOCOL

Every interaction session between LOT NODE-1 and lot-systems.com is compressed and stored using the following protocol.

### 12.1 Session Definition

A **session** begins when the device receives its first notification after a 30+ minute gap, and ends 30 minutes after the last user interaction (Copy press or notification received).

### 12.2 Compressed Payload

```json
{
  "v": 1,
  "sid": "s-20260629-abc123",
  "uid": "user-uuid",
  "t0": 1751232000,
  "t1": 1751235600,
  "dur_s": 3600,
  "notifs": 4,
  "copies": 2,
  "weather": { "t_avg": 22.1, "h_avg": 55, "p_avg": 1013 },
  "batt": { "start": 84, "end": 71 },
  "last_notif": "Coffee time!",
  "fw": "1.0.0"
}
```

### 12.3 Storage

- **On-device:** NVS ring buffer, 32 sessions max (~4KB total)
- **Server:** `device_sessions` table (new migration), linked to `userId`
- **Retention:** 90 days raw → archived to compressed JSON in S3-compatible storage

---

## 13. PRODUCTION ROADMAP — 100 UNITS

### Phase 0: Engineering (Weeks 1–4)

```
Week 1:  KiCad schematic + PCB layout
Week 2:  PCB layout DRC clean, Gerber export
Week 3:  3D model of SS shell (Fusion 360), DFM review with PCBWay
Week 4:  BOM finalization, supplier orders placed
```

### Phase 1: Prototype (Weeks 5–10)

```
Week 5:  PCBWay prototype order: 5× PCBs, 5× PCBA, 2× CNC SS bodies
Week 6:  PCBs + CNC arrive, manual assembly of 2 prototypes
Week 7:  Firmware bring-up: WiFi, display, button, BLE
Week 8:  LOT API integration: WebSocket, Copy→POST /logs
Week 9:  Full system test: notifications, Copy, weather, OTA
Week 10: Prototype sign-off, design locked
```

### Phase 2: Pilot Production (Weeks 11–18)

```
Week 11: PCBWay pilot order: 110× PCBs + PCBA + 220× CNC SS parts
Week 12: PCB fabrication (5–7 days)
Week 13: PCBA (7–10 days)
Week 14: CNC SS body fabrication (10–14 days)
Week 15: Parts arrive → incoming inspection
Week 16: Final assembly: 100 units (10 per day × 2 assemblers × 5 days)
Week 17: Functional test: 100% power-on, WiFi, display, button, charge
Week 18: Packaging, labeling, serial number assignment
```

### Phase 3: Delivery (Week 19–20)

```
Week 19: Ship to Vadik / LOT Systems fulfillment
Week 20: End-user provisioning + pairing guide distributed
```

### Milestone Summary

| Milestone | Target Date |
|-----------|-------------|
| Schematic complete | Week 4 |
| Prototype boards ordered | Week 5 |
| First working prototype | Week 9 |
| Design lock | Week 10 |
| Production order placed | Week 11 |
| All 100 units assembled | Week 16 |
| Tested and packaged | Week 18 |
| Delivered | Week 20 |

---

## 14. BUDGET BREAKDOWN

### 14.1 Hardware — 100 Units

| Category | Cost (USD) |
|----------|------------|
| Electronic components (all) | $4,716 |
| PCBWay PCB fabrication (110×) | $572 |
| PCBWay PCBA (100×) | $1,800 |
| PCBWay CNC SS bodies (110 pairs) | $1,980 |
| Wireless charger accessories (100×) | $1,390 |
| Optical glass + adhesive | $180 |
| Packaging materials (100×) | $320 |
| USB-C cables (100×) | $120 |
| Gaskets + screws + misc hardware | $95 |
| Shipping (PCBWay → USA, DHL) | $420 |
| **Component + Manufacture Subtotal** | **$11,593** |

### 14.2 Engineering & Development

| Category | Cost (USD) |
|----------|------------|
| KiCad PCB design (external or internal) | $1,200 |
| Fusion 360 / CAD for SS body | $800 |
| Firmware development (ESP-IDF) | $2,400 |
| LOT server-side API development | $1,600 |
| Prototype iteration budget | $600 |
| DFM + tooling consultation | $400 |
| **Engineering Subtotal** | **$7,000** |

### 14.3 Documentation

| Category | Cost (USD) |
|----------|------------|
| PDF manual design (InDesign / layout) | $600 |
| Firmware documentation | $300 |
| Software API documentation | $300 |
| **Documentation Subtotal** | **$1,200** |

### 14.4 Total

| | |
|-|-|
| Hardware (100 units) | $11,593 |
| Engineering | $7,000 |
| Documentation | $1,200 |
| Contingency (10%) | $1,979 |
| **TOTAL** | **$21,772** |
| **Per-unit cost** | **~$218** |

---

## 15. PDF MANUAL OUTLINE

Three separate PDF documents are produced. All printed on matte black stock, white/silver typography, COSMO® CIA brand language.

### Document 1: LOT NODE-1 Quick Start Guide

```
Pages: 8 (credit-card accordion fold or A5 booklet)

1. What is LOT NODE-1
2. In the box
3. Charging (Qi pad placement)
4. Pairing with lot-systems.com (QR code → Settings → Devices)
5. The Copy button
6. Reading the display
7. Care instructions (SS surface)
8. Support: support@lot-systems.com
```

### Document 2: LOT NODE-1 Firmware Reference Manual

```
Pages: 24

1. Firmware architecture overview
2. FreeRTOS task map
3. Boot sequence
4. NVS data schema
5. WebSocket protocol specification
6. POST /logs payload reference
7. OTA update process
8. Low-power modes
9. Session compression format
10. Debug mode & USB-C serial console
11. Firmware version history
12. Build instructions (ESP-IDF)
```

### Document 3: LOT NODE-1 Software & API Connector Guide

```
Pages: 20

1. API endpoint reference
2. Device registration & token lifecycle
3. Notification dispatch API
4. LOT server integration (device-api.ts)
5. WebSocket event schema
6. Database migrations
7. Pairing flow (web UI)
8. Device management UI (Settings → Devices)
9. Session data schema
10. Analytics & reporting
11. Security model (JWT, NVS storage)
12. Changelog
```

---

## 16. RISK REGISTER

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| R1 | 5mm height unachievable with selected LiPo | Medium | Medium | Use 2.5mm LiPo (300mAh) or revise to 5.5mm |
| R2 | OV2640 camera too large for 40×40mm layout | Low | Medium | Use OV7670 (smaller die) or omit camera in v1 |
| R3 | PCBWay CNC lead time exceeds 14 days | Medium | Low | Order SS body 1 week before PCBA |
| R4 | BQ51013B Qi Rx not available at LCSC | Low | Medium | Source from Mouser or use MP-A10 alternative |
| R5 | Qi coil interference with SS body | Medium | High | Non-magnetic 316L eliminates eddy current issue |
| R6 | LOT server WebSocket endpoint not ready | Medium | High | Implement fallback polling at firmware level |
| R7 | E-ink partial refresh too slow (<2 sec) | Low | Low | Use GDEW0154M10 (0.3s partial refresh variant) |
| R8 | Battery life < 24 hours | Medium | Medium | Tune deep-sleep duty cycle, add LDO shutdown |
| R9 | PCBWay PCBA yield < 97% | Low | Medium | Order 110 units, absorb ~3 rejects |
| R10 | USB-C slot in 5mm body structurally weak | Medium | Medium | Add SS reinforcement bracket around USB-C |

---

## 17. GLOSSARY

| Term | Definition |
|------|------------|
| LOT NODE-1 | The hardware device specified in this document |
| PAGER-1 | Internal codename for LOT NODE-1 |
| COSMO® CIA | Inventor's identity, Kuzya Cosmo Marmeladov / Vadik Marmeladov |
| PCBWay | PCB fabrication + PCBA + CNC manufacturing partner |
| PCBA | Printed Circuit Board Assembly (PCB with components soldered) |
| ESP32-S3 | Main system-on-chip (Espressif, WiFi+BLE) |
| E-ink | Electronic ink display (zero power when static) |
| BME280 | Bosch MEMS sensor (temperature, humidity, pressure) |
| OV2640 | OmniVision 2MP camera sensor |
| Qi | Wireless charging standard (WPC consortium) |
| NVS | Non-Volatile Storage (ESP32 flash key-value store) |
| QOS | Quantum Operating System (LOT platform concept) |
| Memory Engine | LOT's AI self-care companion that builds user Memory Story |
| Log tab | LOT platform UI tab showing timestamped self-care log entries |
| Copy button | Physical button on device that sends current notification to Log tab |
| Session compression | On-device summary of a usage session, stored compactly in NVS |
| FreeRTOS | Real-time operating system running on ESP32 |
| OTA | Over-the-Air firmware update |
| JWT | JSON Web Token (device authentication to LOT server) |
| ENIG | Electroless Nickel Immersion Gold PCB surface finish |
| DFM | Design for Manufacturability |
| 316L SS | Marine-grade stainless steel, non-magnetic, used for device body |

---

## APPENDIX A — Key Supplier Links

| Supplier | URL | Use |
|----------|-----|-----|
| PCBWay | pcbway.com | PCB, PCBA, CNC machining |
| LCSC | lcsc.com | Electronic components (bulk) |
| Mouser | mouser.com | TI ICs, Würth coils |
| Good Display | good-display.com | E-ink panels |
| EEMB | eemb.com | Thin LiPo batteries |
| Würth Elektronik | we-online.com | Qi coils |

---

## APPENDIX B — LOT Server Files to Create

```
src/server/routes/device-api.ts          — New device API routes
src/server/utils/device-notifications.ts — Notification dispatch logic
prisma/migrations/XXXXXX_device.sql      — device_tokens, device_sessions tables
src/client/components/DeviceSettings.tsx — Pairing UI in Settings tab
```

---

*Document generated: 2026-06-29*  
*LOT Systems · COSMO® CIA · Vadik Marmeladov, Inventor*  
*© 2026 LOT Systems. All rights reserved.*
