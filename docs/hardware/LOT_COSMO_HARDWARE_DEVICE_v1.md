<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COSMO CIA — Hardware Device
## Full Design Report · Session: 2026-06-13

**Document:** LOT_COSMO_HARDWARE_DEVICE_v1.md  
**Classification:** Internal — Product Engineering  
**Author:** Vadim Marmeladov, Inventor, COSMO® CIA  
**Status:** v1 — Planning & Component Specification  
**Target Production:** 100 units (Pilot Run)  

---

## 0. Executive Summary

The LOT COSMO CIA Device is a 4×4cm × 5mm stainless-steel companion hardware unit
that extends the LOT platform into the physical world. It receives autonomous AI
notifications from lot-systems.com, captures ambient sensor data, relays a "Copy"
signal to the site's Log tab, and charges wirelessly.

The device is the physical manifestation of the Quantum Cube described in the CQGS
White Paper — bioelectric-aware, pager-class connectivity, minimal but precise.

One side: mirror-polished 316L stainless steel.  
Other side: camera + screen + button.  
Inside: LOT API, firmware, sensors, battery.

---

## 1. Physical Specification

| Parameter | Value |
|-----------|-------|
| Form factor | Square, 4.0 cm × 4.0 cm × 5.0 mm |
| Body material | 316L stainless steel, 2-part CNC milled |
| Side A (back) | Mirror-polished (#8 finish), flat |
| Side B (front) | Camera lens, OLED screen, tactile button |
| Color | Silver / brushed steel |
| Sealing | IP52 gasket between halves (dust + light splash) |
| Fastening | M1.2 countersunk screws × 4 (hidden under gasket) |
| Weight (estimated) | 38–44 g |
| Wireless charging | Qi 5W, receiver coil embedded in PCB |

---

## 2. Block Diagram

```
┌─────────────────────────────────────────────┐
│              LOT COSMO CIA Device            │
│                                             │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐ │
│  │ Camera  │   │  Screen  │   │  Button  │ │
│  │ OV5647  │   │ 1.0"OLED │   │  (Copy)  │ │
│  └────┬────┘   └────┬─────┘   └────┬─────┘ │
│       │             │              │        │
│  ┌────┴─────────────┴──────────────┴──────┐ │
│  │            ESP32-S3-MINI-1             │ │
│  │     (WiFi · BLE · Camera CSI · SPI)   │ │
│  └──┬──────┬──────┬──────┬───────────────┘ │
│     │      │      │      │                 │
│  BME688  TSL2591  LIS3DH  BQ25100          │
│  Weather  Light   IMU    Charge IC         │
│     │      │      │      │                 │
│  ┌──┴──────┴──────┴──────┴───────────────┐ │
│  │           LiPo 150mAh 3.7V            │ │
│  └───────────────────────────────────────┘ │
│                    │                        │
│  ┌─────────────────┴──────────────────────┐ │
│  │         Qi Coil (ACWT-24-31)          │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 3. Bill of Materials (BOM) — 100 Units

### 3.1 Microcontroller

| # | Component | Part Number | Qty/unit | Unit Cost | 100-unit Cost | Source |
|---|-----------|-------------|----------|-----------|---------------|--------|
| 1 | MCU — ESP32-S3-MINI-1 (8MB flash, 512KB SRAM, WiFi+BLE, CSI camera) | ESP32-S3-MINI-1-N8 | 1 | $3.20 | $320 | LCSC / Mouser |

**Why ESP32-S3**: Dual-core Xtensa LX7 at 240 MHz, native USB, hardware JPEG encoder,
camera interface (DVP/MIPI), low power modes (20μA deep sleep). Fits 4×4cm PCB.
WiFi for LOT API. BLE for future phone pairing. Built-in security fuse for OTA.

---

### 3.2 Display

| # | Component | Part Number | Qty/unit | Unit Cost | 100-unit Cost | Source |
|---|-----------|-------------|----------|-----------|---------------|--------|
| 2 | OLED 1.0" 128×64 SSD1306 SPI (2.5mm height) | SSD1306 1.0" | 1 | $2.80 | $280 | LCSC / AliExpress bulk |

**Why 1.0" SSD1306**: Glass thickness 0.7mm + driver IC = 2.5mm total. Fits within 5mm
enclosure. Monochrome white on black — matches LOT Terminal Grid aesthetic. SPI interface
frees up I2C bus for sensors. Visibility: high contrast, legible at arm's length.

Screen content: notification text ("Coffee time!"), time, battery indicator, signal icon.

---

### 3.3 Camera

| # | Component | Part Number | Qty/unit | Unit Cost | 100-unit Cost | Source |
|---|-----------|-------------|----------|-----------|---------------|--------|
| 3 | Camera module 2MP OV2640 15×15mm, FPC ribbon, M12 lens | OV2640 + M12 | 1 | $3.50 | $350 | Seeed Studio / LCSC |

**Why OV2640**: Industry standard for ESP32 camera projects. 1600×1200 (UXGA), outputs
JPEG directly (hardware). 15×15mm sensor area fits behind a 6mm lens hole in the front
panel. Ribbon cable routes flat across PCB. Power: 70mW active, <1mW standby.

Camera use cases: QR code scan (LOT login), photo log to the Log tab, future COSMO vision.

---

### 3.4 Weather & Environmental Sensors

| # | Component | Part Number | Qty/unit | Unit Cost | 100-unit Cost | Source |
|---|-----------|-------------|----------|-----------|---------------|--------|
| 4 | Weather/Air sensor — BME688 (temp, humidity, pressure, gas/VOC, AI tflite on-chip) | Bosch BME688 | 1 | $4.10 | $410 | Mouser / Digikey |
| 5 | Ambient light — TSL2591 (dynamic range 600M:1, IR+visible) | AMS TSL2591 | 1 | $1.80 | $180 | Mouser / LCSC |
| 6 | 3-axis IMU accelerometer — LIS3DH (tap, tilt, gesture, 0.9μA low-power) | ST LIS3DH | 1 | $0.90 | $90 | Mouser / Digikey |

**Why BME688**: Bosch's AI-grade sensor — includes an on-device ML core (BSEC library)
that classifies indoor air quality, runs self-calibration, and outputs IAQ score.
This is the "AI grade off-the-shelf sensor" specification satisfied. Size: 3×3×0.93mm.

**Why LIS3DH**: Detects tap (button backup), orientation, wrist-lift analog (wake on move).
Feeds into LOT QOS biofield awareness layer.

---

### 3.5 Button

| # | Component | Part Number | Qty/unit | Unit Cost | 100-unit Cost | Source |
|---|-----------|-------------|----------|-----------|---------------|--------|
| 7 | Tactile switch 4×4mm, 0.5mm travel, SMD, 50mN actuation, 100k cycle | Alps SKRPACE010 | 1 | $0.35 | $35 | Mouser / Digikey |
| 8 | Button lens cap — stainless steel D5mm flush | Custom machined | 1 | $1.20 | $120 | PCBWay / local |

**Button function**: Single press = "Copy" signal → POST to lot-systems.com/api/log
with payload: `{ action: "copy_tap", device_id, timestamp, sensor_snapshot }`.
The signal appears in the LOT site's Log tab in real time via WebSocket.

---

### 3.6 Power System

| # | Component | Part Number | Qty/unit | Unit Cost | 100-unit Cost | Source |
|---|-----------|-------------|----------|-----------|---------------|--------|
| 9 | LiPo battery 3.7V 150mAh, 2.5mm thick, 20×35mm | LP251535 | 1 | $2.80 | $280 | Battery Junction / LCSC |
| 10 | Charge IC — BQ25100 (Qi + USB-C path, 500mA charge, 1.5mm QFN) | TI BQ25100 | 1 | $1.50 | $150 | Mouser / Digikey |
| 11 | Wireless charging receiver — WR483050-15W, 5W Qi, 0.3mm coil | WURTH 760308103 | 1 | $2.20 | $220 | Mouser |
| 12 | LDO 3.3V — TPS7A1601 (100mA, 40μA quiescent) | TI TPS7A1601 | 1 | $0.80 | $80 | Mouser |

**Battery life estimate:**  
- Deep sleep: 20μA → 7,500 hours  
- BLE advertising: 5mA → 30 hours  
- Active (WiFi + screen + sensors): 120mA → ~1.2 hours  
- Typical usage (10min active/day + sleep): ~14 days per charge  
- Wireless charge time (150mAh at 500mA): ~20 minutes  

**Note on 5mm constraint**: The coil (0.3mm) + battery (2.5mm) + PCB (1.0mm) + top glass
(0.7mm) = 4.5mm internal. Enclosure walls = 2×0.3mm = 0.6mm. Total: ~5.1mm. Achievable
with 0.2mm shell walls in the thinnest regions, or targeting 5.5mm as final production height.

---

### 3.7 PCB

| # | Component | Qty | Unit Cost | 100-unit Cost | Source |
|---|-----------|-----|-----------|---------------|--------|
| 13 | 4-layer rigid PCB, 38×38mm, 1.0mm FR4, HASL-LF, min trace 4mil | 1 per unit | $4.80 | $480 | PCBWay |
| 14 | SMD passives (0402 resistors/capacitors, total ~80pcs/unit) | 80 | $0.02 ea | $160 | LCSC |
| 15 | SMA antenna + U.FL connector (optional external) | 1 | $0.60 | $60 | Mouser |

---

### 3.8 Enclosure

| # | Component | Qty | Unit Cost | 100-unit Cost | Source |
|---|-----------|-----|-----------|---------------|--------|
| 16 | 316L SS body — Part A (polished mirror back, 40×40×2.5mm) | 100 | $12.00 | $1,200 | PCBWay CNC |
| 17 | 316L SS body — Part B (front panel, camera/screen/button cutouts) | 100 | $14.00 | $1,400 | PCBWay CNC |
| 18 | Silicone gasket 0.5mm | 100 | $0.80 | $80 | Custom, local rubber shop |
| 19 | M1.2 × 2.5mm SS screws × 4 per unit | 400 | $0.08 ea | $32 | McMaster-Carr |
| 20 | Camera lens glass window D6mm, sapphire-coated | 100 | $1.80 | $180 | Edmund Optics / AliExpress |
| 21 | Screen glass bezel window 26×14mm optical clear | 100 | $1.20 | $120 | Custom cut, local glass |

---

### 3.9 Packaging & Accessories

| # | Item | Qty | Unit Cost | 100-unit Total |
|---|------|-----|-----------|----------------|
| 22 | Wireless charger pad — 5W Qi, USB-C, white aluminum | 100 | $8.50 | $850 |
| 23 | USB-C cable 30cm (for charger pad) | 100 | $1.20 | $120 |
| 24 | Matte black box with magnetic lid, custom printed | 100 | $4.00 | $400 |
| 25 | Quick start card (printed, 4×4cm folded) | 100 | $0.30 | $30 |

---

### 3.10 BOM Cost Summary

| Category | 100-unit Total |
|----------|---------------|
| MCU + Camera + Display | $950 |
| Sensors (BME688 + TSL2591 + LIS3DH) | $680 |
| Button | $155 |
| Power system (battery + charge IC + coil + LDO) | $730 |
| PCB (bare + passives + antenna) | $700 |
| Enclosure (SS body × 2 + gasket + screws + windows) | $3,012 |
| Accessories (charger + cable + box + card) | $1,400 |
| **Subtotal hardware** | **$7,627** |
| Assembly labor (PCBWay PCBA, 100 units) | $1,800 |
| Engineering NRE (fixtures, jigs, stencils) | $600 |
| Shipping + duty (DHL, China→US) | $400 |
| **TOTAL (100 units)** | **$10,427** |
| **Per unit cost** | **~$104** |

---

## 4. PCBWay Manufacturing Plan

### 4.1 Services Used

| Service | Specification |
|---------|---------------|
| PCB fabrication | 4-layer, 38×38mm, FR4, 1.0mm, HASL lead-free, 6/6mil |
| PCBA (turnkey) | PCBWay provides all SMD components from BOM, hand-solders through-hole |
| CNC machining | 316L SS, 40×40mm, Part A + B, ±0.05mm tolerance |
| Surface finishing | Part A: #8 mirror polish; Part B: #4 brushed then clear coat |

### 4.2 Gerber File Requirements

- Gerber RS-274X (all copper layers, silkscreen, solder mask)
- Drill file: Excellon format
- BOM in XLS: reference, value, footprint, manufacturer PN
- Pick & Place (Centroid) CSV: designator, x, y, rotation, layer
- Assembly drawing PDF showing component orientation

### 4.3 DFM Checklist

- [ ] All BGAs and QFNs have thermal vias under pad
- [ ] ESP32-S3-MINI keepout respected (3mm from module edge)
- [ ] Camera FPC connector: ZIF type, facing up for assembly
- [ ] Qi coil lands on bottom layer, no vias under coil footprint
- [ ] 4 mounting holes M1.2, 0.5mm annular ring
- [ ] Silkscreen: device serial number field, QC date, LOT® logo

### 4.4 PCBWay Order Sequence

1. Upload Gerbers → quote (2-3 days PCB, 5-7 days PCBA)
2. Confirm BOM sourcing (PCBWay sources 90%+ of LCSC/Mouser parts)
3. Approve engineering sample × 3 before full 100-unit run
4. Full run delivery: ~18–22 business days from approval

---

## 5. Firmware Architecture

### 5.1 Overview

```
Firmware Stack (ESP32-S3, FreeRTOS)
├── RTOS Kernel (FreeRTOS 10.4)
├── HAL Layer
│   ├── camera.c          — OV2640 init, JPEG capture, stream
│   ├── display.c         — SSD1306 SPI driver, text render, logo
│   ├── sensors.c         — BME688 BSEC, TSL2591, LIS3DH I2C
│   ├── button.c          — debounce, long press, IRQ handler
│   ├── power.c           — BQ25100 charge state, battery gauge
│   └── wireless_charge.c — Qi detect, charge enable/disable
├── Connectivity
│   ├── wifi.c            — WPA2, reconnect loop, mDNS
│   ├── lot_api.c         — HTTPS REST client → lot-systems.com
│   ├── ota.c             — OTA via HTTPS, signed firmware
│   └── ble.c             — BLE provisioning (WiFi setup via phone)
├── Application
│   ├── notification.c    — Poll LOT API, render to screen
│   ├── copy_signal.c     — Button ISR → POST to Log tab
│   ├── sensor_report.c   — 60s loop: BME688 + TSL2591 + IMU → API
│   ├── session.c         — JWT token store (NVS encrypted)
│   └── compress.c        — Session data LZ4 compression before POST
└── Main
    └── main.c            — Task init, watchdog, power state machine
```

### 5.2 Task Table (FreeRTOS)

| Task | Priority | Stack | Period | Description |
|------|----------|-------|--------|-------------|
| `wifi_manager` | 5 | 4KB | event-driven | WiFi connect, reconnect, status LED |
| `notification_poll` | 3 | 6KB | 30s | GET /api/device/notifications → render to screen |
| `sensor_loop` | 2 | 4KB | 60s | Read BME688+TSL2591+LIS3DH → POST to API |
| `button_handler` | 7 | 2KB | IRQ | Debounce, POST /api/log (copy signal) |
| `ota_check` | 1 | 8KB | 6h | Check firmware version, download+verify+flash |
| `display_refresh` | 4 | 3KB | 1s | Update screen (time, battery, last notification) |
| `power_monitor` | 2 | 2KB | 10s | Battery %, Qi charge state, sleep trigger |
| `camera_task` | 3 | 16KB | on-demand | JPEG capture on button long-press → POST to Log |

### 5.3 Power State Machine

```
ACTIVE ──(30s idle)──► LIGHT_SLEEP ──(5min)──► DEEP_SLEEP
  ▲                          │                       │
  │                    (motion/button)          (WiFi beacon)
  └──────────────────────────┴───────────────────────┘

ACTIVE:      120mA, all systems on, screen bright
LIGHT_SLEEP: 8mA, ESP32 modem sleep, sensors polling, screen dim
DEEP_SLEEP:  0.02mA, timer wake only, screen off
```

### 5.4 OTA Security

- Firmware signed with ECDSA-P256 private key (stored offline)
- Public key burned into eFuse at provisioning
- Rollback protection: version counter in NVS, increments on successful boot
- Partition table: factory + OTA_0 + OTA_1 (A/B scheme)

---

## 6. LOT API Connector

### 6.1 Device Auth Flow

```
1. First boot: BLE provisioning
   Phone → BLE → device WiFi credentials + LOT user token

2. Device stores in NVS (encrypted flash):
   { wifi_ssid, wifi_pass, lot_user_id, lot_device_token }

3. All API calls: Authorization: Bearer <lot_device_token>
```

### 6.2 API Endpoints Used

| Method | Endpoint | Payload | Trigger |
|--------|----------|---------|---------|
| `GET` | `/api/device/notifications` | — | Every 30s |
| `POST` | `/api/log` | `{ action, device_id, timestamp, sensors }` | Button press |
| `POST` | `/api/device/sensors` | `{ temp, humidity, pressure, iaq, lux, accel }` | Every 60s |
| `POST` | `/api/device/camera` | multipart JPEG | Long-press button |
| `GET` | `/api/device/config` | — | Boot + 6h |
| `POST` | `/api/device/heartbeat` | `{ battery_pct, rssi, fw_version }` | Every 5min |

### 6.3 Notification Response Schema

```json
{
  "notifications": [
    {
      "id": "notif_abc123",
      "text": "Coffee time!",
      "icon": "☕",
      "priority": 1,
      "expires_at": "2026-06-13T14:30:00Z",
      "source": "ai_schedule"
    }
  ],
  "config": {
    "poll_interval_s": 30,
    "screen_brightness": 80,
    "sleep_after_s": 30
  }
}
```

### 6.4 Copy Signal Payload (Log Tab)

```json
{
  "action": "copy_tap",
  "device_id": "cosmo_cia_0042",
  "user_id": "usr_vadik",
  "timestamp": "2026-06-13T12:00:00Z",
  "sensors": {
    "temp_c": 22.4,
    "humidity_pct": 48.2,
    "pressure_hpa": 1013.2,
    "iaq_score": 87,
    "lux": 342,
    "accel_g": [0.01, 0.02, 1.00]
  },
  "camera_attached": false,
  "battery_pct": 73,
  "fw_version": "1.0.3"
}
```

This payload posts to the **Log tab** on lot-systems.com and appears as a new log entry
attributed to the device, visible alongside the user's other check-ins.

### 6.5 Site-Side: New Server Route (lot-systems.com)

```typescript
// src/server/routes/device-api.ts

// POST /api/device/log — receives Copy tap signal
fastify.post('/api/device/log', {
  preHandler: [authenticateDevice],
  schema: { body: DeviceLogPayload }
}, async (request, reply) => {
  const { action, device_id, sensors, timestamp } = request.body
  
  await Log.create({
    userId: request.deviceUser.id,
    source: 'cosmo_device',
    deviceId: device_id,
    action,
    sensorData: sensors,
    timestamp: new Date(timestamp),
    displayText: `COSMO tap · ${sensors.temp_c}°C · IAQ ${sensors.iaq_score}`
  })
  
  // Push to WebSocket for real-time Log tab update
  fastify.websocketServer.broadcast(request.deviceUser.id, {
    type: 'device_log',
    payload: { action, device_id, timestamp }
  })
  
  return reply.send({ status: 'ok' })
})

// GET /api/device/notifications — serves screen content
fastify.get('/api/device/notifications', {
  preHandler: [authenticateDevice]
}, async (request, reply) => {
  const notifs = await getAINotificationsForUser(request.deviceUser.id)
  return reply.send({ notifications: notifs, config: getDeviceConfig() })
})
```

---

## 7. Software: Desktop/Mobile Companion App

### 7.1 Provisioning App (React Native / Expo)

Purpose: first-time WiFi setup + device pairing via BLE.

```
Screens:
  1. Scan for COSMO devices (BLE discovery)
  2. Enter WiFi credentials
  3. Login with LOT account (OAuth2)
  4. Device paired — shows device ID, firmware version
  5. Settings: notification preferences, screen brightness, sleep timeout
```

### 7.2 Web Dashboard (lot-systems.com additions)

New sections added to the existing platform:

| Section | Location | Content |
|---------|----------|---------|
| Device Manager | /settings/devices | Pair/unpair, rename, firmware version |
| Log Tab (enhanced) | /log | New "COSMO tap" entries with sensor data |
| Notification Editor | /settings/notifications | Create/schedule AI notifications to device |
| Sensor History | /devices/:id/sensors | BME688, light, IMU charts over time |

---

## 8. Session Compression Protocol

Each device session (active WiFi period) is compressed before upload to minimize
bandwidth and LOT API payload size.

### 8.1 Compression Approach

- **Algorithm**: LZ4 (fast, embedded-friendly, ~1MB RAM)
- **Format**: Binary msgpack → LZ4 compressed → base64 for HTTPS POST
- **Typical payload**: 800 bytes raw → 220 bytes compressed (72% reduction)
- **Implementation**: `src/compress.c` using esp-idf `lz4` component

### 8.2 Session Packet Structure

```c
typedef struct {
  uint32_t session_id;
  uint64_t start_ts;
  uint64_t end_ts;
  uint16_t uptime_s;
  uint8_t  battery_start_pct;
  uint8_t  battery_end_pct;
  uint8_t  wifi_rssi;
  uint8_t  fw_major, fw_minor, fw_patch;
  uint8_t  notifs_received;
  uint8_t  copy_taps;
  float    avg_temp_c;
  float    avg_humidity;
  float    avg_iaq;
  float    avg_lux;
  uint8_t  camera_captures;
} SessionPacket; // 48 bytes raw → ~28 bytes LZ4
```

---

## 9. Manufacturing Roadmap — 100 Units

### 9.1 Phase Timeline

```
Week  1–2:   Schematic design (KiCad) — finalize all component footprints
Week  3–4:   PCB layout (4-layer, DRC clean) — route all signals
Week  5:     Gerber export + DFM check with PCBWay engineer
Week  6:     Upload to PCBWay — order bare PCBs × 110 (10% spares)
Week  6:     Upload BOM + centroid → PCBA quote approval
Week  7–8:   PCBWay fabricates bare PCBs
Week  9–10:  PCBWay SMD assembly + reflow (100 units)
Week  10:    Engineering samples × 3 shipped to Vadik for review
Week  11:    Firmware v1.0.0 loaded, QA test on samples
Week  11:    PCBWay CNC: 316L SS body Part A + Part B (100 pairs)
Week  12:    Surface finishing: Part A mirror polish, Part B clear coat
Week  12:    Enclosure assembly: PCB → gasket → screw → close
Week  13:    End-to-end test: LOT API, notifications, copy signal, OTA
Week  14:    Packaging: custom boxes, quick start cards
Week  15:    Fulfillment: ship to early adopters / pilot users
```

### 9.2 Quality Gates

| Gate | Criteria | Fail Action |
|------|----------|-------------|
| G1 — PCB | DRC 0 errors, electrical test pass | Redesign + re-order |
| G2 — PCBA sample | All 3 samples boot, WiFi connects, screen on | PCBWay rework or component swap |
| G3 — Firmware | All 7 tasks run, OTA works, API connects | Firmware fix + reflash |
| G4 — Enclosure | SS finish per spec, screw torque 0.05Nm, IP52 | Reject + rework |
| G5 — LOT API | Copy tap appears in Log tab < 500ms | API fix + deploy |
| G6 — Final QA | 100% units pass burn-in test (24h idle + 10 copy taps) | Individual rework |

### 9.3 Cost & Pricing

| Metric | Value |
|--------|-------|
| Per-unit COGS | ~$104 |
| Target retail price | $299 |
| Gross margin | 65% |
| 100-unit revenue potential | $29,900 |
| Break-even units (at $299) | ~35 units |

---

## 10. Wireless Charging Specification

**Standard**: Qi 1.3 (5W baseline power profile)  
**Receiver coil**: WURTH 760308103, 38×38mm footprint (fits PCB exactly), 0.3mm thick  
**Charge IC**: TI BQ25100 — manages Qi power path + LiPo charge algorithm  
**Input voltage**: 5V from Qi pad  
**Charge current**: 500mA (C/0.3 rate for 150mAh battery — gentle, safe)  
**Charge time**: ~25 minutes to 100%  
**Charge pad**: 5W USB-C Qi pad, aluminum housing, LED indicator, included in box  
**Foreign object detection**: handled by BQ25100 + Qi pad negotiation  
**Placement indicator**: blue LED on device button pulses while charging  

---

## 11. Firmware Documents Index

| Document | File | Content |
|----------|------|---------|
| Firmware Architecture | `docs/hardware/firmware/FIRMWARE_ARCH.md` | Task table, state machine, memory map |
| API Integration Guide | `docs/hardware/firmware/LOT_API_GUIDE.md` | All endpoints, auth, schemas |
| OTA Update Procedure | `docs/hardware/firmware/OTA_PROCEDURE.md` | Signing keys, partition layout, rollback |
| Flash & Provision Guide | `docs/hardware/firmware/PROVISIONING.md` | First-boot BLE setup, test commands |
| Sensor Calibration | `docs/hardware/firmware/SENSOR_CAL.md` | BME688 BSEC init, TSL2591 gain settings |
| Power Management | `docs/hardware/firmware/POWER_MGMT.md` | Sleep states, wake sources, battery math |
| Button Protocol | `docs/hardware/firmware/BUTTON_PROTOCOL.md` | Debounce, press types, Log API call |

---

## 12. PDF Manual Outline

**Title**: LOT COSMO CIA — User Manual v1.0  
**Format**: A6 (10.5×14.8cm), 16 pages, printed on 100gsm matte  
**Language**: English  

```
Page 1:   Cover — COSMO® logo, silver device render, "Made in the USA"
Page 2:   In the box — device, charger, cable, quick start card
Page 3:   Device anatomy — labeled diagram (front + back)
Page 4:   First-time setup — download LOT app, pair via BLE
Page 5:   Notifications — how AI messages reach your screen
Page 6:   The Copy button — what it does, Log tab on site
Page 7:   Wireless charging — place on pad, LED color guide
Page 8:   Screen icons — battery, WiFi, notification, camera indicators
Page 9:   Camera — long-press to capture, photo appears in Log
Page 10:  Weather sensor — what it measures, where to see data
Page 11:  Firmware updates — automatic OTA, no action needed
Page 12:  Troubleshooting — WiFi not connecting, no notifications
Page 13:  Care instructions — cleaning SS mirror finish, storage
Page 14:  Technical specifications — full table
Page 15:  Warranty & support — support@lot-systems.com, 1 year
Page 16:  Back cover — lot-systems.com, LOT® COSMO® marks
```

**PDF generation**: LaTeX or Figma → PDF export. Stored in `docs/hardware/manuals/`.

---

## 13. Separate Document Index

All hardware documents live under `docs/hardware/`:

```
docs/hardware/
├── LOT_COSMO_HARDWARE_DEVICE_v1.md    ← this document
├── firmware/
│   ├── FIRMWARE_ARCH.md
│   ├── LOT_API_GUIDE.md
│   ├── OTA_PROCEDURE.md
│   ├── PROVISIONING.md
│   ├── SENSOR_CAL.md
│   ├── POWER_MGMT.md
│   └── BUTTON_PROTOCOL.md
├── pcb/
│   ├── SCHEMATIC_NOTES.md
│   ├── PCB_LAYOUT_GUIDE.md
│   ├── PCBWAY_ORDER_CHECKLIST.md
│   └── BOM_v1.csv
├── enclosure/
│   ├── CNC_SPEC_PART_A.md
│   ├── CNC_SPEC_PART_B.md
│   └── ASSEMBLY_PROCEDURE.md
├── manuals/
│   ├── USER_MANUAL_v1.0.pdf            ← generated
│   └── QUICK_START_CARD.pdf            ← generated
└── qa/
    ├── TEST_PROTOCOL.md
    ├── BURN_IN_PROCEDURE.md
    └── DEFECT_LOG_TEMPLATE.md
```

---

## 14. Roadmap Analysis

### 14.1 Technical Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| 5mm enclosure infeasible | Medium | High | Accept 5.5mm, revalidate with CNC shop |
| ESP32-S3 camera + WiFi concurrent | Low | Medium | Use dual-core: Core 0 = camera, Core 1 = WiFi |
| BME688 BSEC library license | Low | Low | Bosch provides free binary BSEC for commercial use |
| Battery capacity < 1 day | Medium | Medium | Add aggressive sleep, extend to 200mAh (2.8mm thick) |
| LOT API rate limiting | Low | Medium | Add device JWT with 60s polling floor |
| PCBWay SS finish variance | Medium | Low | Order sample parts before full run |

### 14.2 Priority Build Order

```
P0 (must have for pilot):
  ✓ ESP32-S3 boot + WiFi
  ✓ SSD1306 screen renders notification text
  ✓ Button → POST to LOT /api/log
  ✓ Wireless charging works
  ✓ BME688 reads sensor data

P1 (should have for pilot):
  ✓ Camera capture on long-press
  ✓ OTA firmware update
  ✓ BLE provisioning app (iOS/Android)
  ✓ Battery gauge display

P2 (nice to have for v1.1):
  ○ LIS3DH motion wake (lift to check)
  ○ TSL2591 screen brightness auto-adjust
  ○ Sound (piezo buzzer for notification chime)
  ○ NFC tag (tap phone to share LOT profile URL)
```

### 14.3 Integration with LOT Platform

This device integrates at **Layer 4 — Memory Arc** of the CQGS stack:

```
Layer 0: Corpus
Layer 1: Calibration Loop  ← BME688 IAQ feeds biofield signals
Layer 2: Inference Layer
Layer 3: Response Grammar  ← Notifications rendered on screen
Layer 4: Memory Arc        ← Copy tap signals logged to memory
Layer 5: COSMO Node        ← Device ID authenticated, behavior verified
```

The device is not decorative. It is a sensor node for the LOT Memory Engine —
every tap, every ambient reading, every notification acknowledged builds
richer behavioral context in the CQGS stack.

---

## 15. Component Sourcing Links

Search these exact part numbers on the following platforms:

| Platform | URL | Best For |
|----------|-----|----------|
| LCSC | lcsc.com | Chinese components, MOQ 1, cheapest ESP32/passives |
| Mouser | mouser.com | US stock, TI/Bosch/AMS sensors, same-day |
| Digikey | digikey.com | US stock, all components, good for prototyping |
| PCBWay | pcbway.com | PCB fab, PCBA, CNC machining, SS finishing |
| Seeed Studio | seeedstudio.com | OV2640 camera modules, Grove sensors |
| Battery Junction | batteryjunction.com | LP series thin LiPo cells |
| Wurth Electronics | we-online.com | Qi coil 760308103 |

---

## 16. Closing Notes

**Inventor**: Vadim Marmeladov  
**Brand**: COSMO® CIA — Connected Intelligence Architecture  
**Physical philosophy**: The mirror side is what the world sees. The camera-screen-button
side is what the device sees. Both are real. Both are the user.

This device costs ~$104 to build and sells for $299.  
It sends a signal to a website with one press.  
The website is built to understand that signal.  
That is the product.

Next session: Schematic design, KiCad component footprint library, PCBWay upload checklist.

---

*LOT Systems Corporation · Los Angeles, CA · lot-systems.com*  
*COSMO® is a registered trademark of LOT Systems, Inc.*  
*Session: 2026-06-13 · Push: claude/brave-lamport-vd3f80*
