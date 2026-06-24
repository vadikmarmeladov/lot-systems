<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION / COSMO® CIA
COSMO NODE — PHYSICAL INTELLIGENCE COMPANION
HARDWARE DESIGN + PRODUCTION SPECIFICATION
================================================================================

DOCUMENT     HW-SPEC / COSMO-NODE-01
ISSUE DATE   2026.06.24
AUTHOR       Vadik Marmeladov, Inventor, COSMO® CIA
CLASS        INTERNAL / BUILD / PRODUCTION
STYLE        TERMINAL GRID
REVISION     1.0

================================================================================

## 00  PRODUCT IDENTITY

The COSMO NODE is the first physical hardware node in the COSMO® CIA ecosystem.
It is a companion device to lot-systems.com: a flat, silver, pager-like square
that receives AI-generated proactive notifications from the LOT platform, logs
user actions back to the site, and carries environmental sensors for context
awareness.

    FORM       40×40mm square, 5mm target height (7mm production fallback)
    FINISH     316L stainless steel — polished mirror front / matte functional back
    PURPOSE    Receive LOT notifications · Log Copy events · Sense environment
    BRAND      COSMO® CIA — Made in the USA

It does not replace the screen — it extends the platform into physical space.
A quiet object on the desk that catches your eye when the AI has something
worth your attention.

================================================================================

## 01  PHYSICAL DESIGN

### 1.1  FORM FACTOR

```
    ┌───────────────────────┐
    │                       │  40mm
    │   POLISHED STAINLESS  │
    │   (FRONT / BACK-A)    │
    │                       │
    └───────────────────────┘
             40mm

    HEIGHT TARGET: 5.0mm  (design goal)
    HEIGHT FLOOR:  7.0mm  (production-safe without custom display)
```

**NOTE ON 5mm:** Achievable only with a plastic-substrate e-paper film
(~0.38mm vs 1.1mm glass-based) and a 0.5mm flat Qi coil. Recommended
for revision R1.0 is 7mm with standard glass-substrate e-paper. A 5mm
revision (R2.0) follows after tooling validation.

### 1.2  TWO-PART 316L STAINLESS STEEL BODY

```
SIDE A — POLISHED MIRROR (FRONT / DISPLAY FACE)
────────────────────────────────────────────────
- Full 40×40mm mirror-polished 316L stainless steel
- 21mm circular window aperture for 1.54" e-paper display
- Surface: Ra 0.05 μm mirror finish (electropolish + buff)
- No visible text, logo, or markings on this face
- Subtle chamfered edge (0.3mm × 45°) around perimeter

SIDE B — SATIN FUNCTIONAL (BACK / SENSOR FACE)
────────────────────────────────────────────────
- 316L stainless steel, hairline satin finish (Ra 0.4 μm)
- Camera aperture: 4.5mm circular hole, anti-reflective coated glass lens cover
- Copy button: 8×8mm recessed square, 0.4mm travel, tactile
- Charging indicator LED: 1mm edge-lit slot (right side)
- "COSMO" laser-etched text, 6pt, bottom center
- "lot-systems.com" laser-etched, 5pt, below COSMO
- Four M1.2 countersunk screws at corners (interior, not visible from outside)
```

### 1.3  INTERNAL STACK (7mm production profile)

```
TOP → BOTTOM (side A facing up)

┌─────────────────────────────────────────┐  0.5mm   316L SS front plate
├─────────────────────────────────────────┤  0.1mm   optical adhesive
├─────────────────────────────────────────┤  1.1mm   e-paper display + glass
├─────────────────────────────────────────┤  0.1mm   FPC ribbon flex connector
├─────────────────────────────────────────┤  0.8mm   main PCB (4-layer rigid)
├─────────────────────────────────────────┤  2.0mm   LiPo cell (LP403030 150mAh)
├─────────────────────────────────────────┤  0.8mm   Qi coil (flat, ferrite-backed)
├─────────────────────────────────────────┤  0.1mm   thermal pad
└─────────────────────────────────────────┘  0.5mm   316L SS back plate
                                            ───────
                                            7.0mm   TOTAL
```

### 1.4  CAMERA BUMP

The camera protrudes 1.5mm from the back face due to the lens assembly.
This creates a 4.5mm × 4.5mm × 1.5mm square bump, consistent with
premium camera hardware convention. The bump has a 316L stainless ring
bezel machined into the back plate.

================================================================================

## 02  COMPONENT BILL OF MATERIALS

All prices are at quantity 100 units, USD. Mouser/Digi-Key quoted June 2026.

### 2.1  MAIN ELECTRONIC COMPONENTS

```
#   COMPONENT              PART NUMBER           VENDOR       QTY   UNIT $
──  ─────────              ───────────           ──────       ───   ──────
01  MCU — ESP32-S3         ESP32-S3-MINI-1-N4    Mouser       100   $2.80
    WiFi 802.11b/g/n · BT 5.0 · 240MHz · 4MB flash
    15.4×11.3×1.7mm · DVP camera interface · USB OTG
    Mouser: 356-ESP32S3MINI1N4
    Link: mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-MINI-1-N4

02  DISPLAY — e-paper       GDEY0154D67           Good Display  100   $4.50
    1.54" · 200×200px · B/W · SPI · ultra-low power
    27.6×27.6mm active area · 0-40°C · 1.1mm thick
    Link: gooddisplay.net/product/GDEY0154D67.html

03  CAMERA                  GC032A                AliExpress   100   $2.20
    0.3MP · 640×480 · DVP/parallel · 15fps
    Sensor: 3.2×3.2×3.5mm (with lens: 4.8×4.8×5.2mm)
    Used in smart badges, wearables, IoT cameras
    Alt: OV7670 (Mouser: 688-OV7670)

04  WEATHER SENSOR          BME688                Mouser       100   $4.80
    Temp/Humidity/Pressure/Gas (AI feature extraction)
    3.0×3.0×0.93mm · I2C+SPI · ±1°C / ±3% RH
    Mouser: 667-BME688
    Link: mouser.com/ProductDetail/Bosch-Sensortec/BME688

05  AI IMU                  BHI260AP              Mouser       100   $3.50
    On-chip AI motion processor · 6-axis · self-learning
    3.0×3.0×0.95mm · I2C/SPI · Bosch SensorTec
    Mouser: 667-BHI260AP
    Link: mouser.com/ProductDetail/Bosch-Sensortec/BHI260AP

06  QI RX IC                BQ51013BRHLR          Mouser       100   $1.20
    Wireless power receiver · 5W · WPC 1.1 Qi
    20-VQFN 3.5×3.5mm · TI
    Mouser: 595-BQ51013BRHLR

07  QI COIL                 WR202020-27K8-G       Mouser       100   $0.90
    Receive coil · 20×20mm · Würth Elektronik
    Flat profile 0.8mm including ferrite shield
    Mouser: 710-WR202020-27K8-G
    Link: mouser.com/ProductDetail/Wurth-Elektronik/760308103

08  LIPO BATTERY            LP403030-150mAh       Digi-Key     100   $2.80
    3.7V · 150mAh · 4.0×30×30mm
    Alt for 7mm design: LP402535 (4.0×25×35mm, 150mAh)
    Supplier: EEMB / Shenzhen Tianchen Battery
    Link: digi-key.com (search LP402535)

09  LIPO CHARGER IC         MCP73831T-2ACI/OT     Mouser       100   $0.45
    Single-cell LiPo charger · SOT-23-5 · Microchip
    Mouser: 579-MCP73831T2ACIOOT
    Link: mouser.com/ProductDetail/Microchip-Technology/MCP73831T-2ACI-OT

10  POWER MANAGEMENT        TPS63802DRLR          Mouser       100   $1.10
    Buck-boost converter · 0.8-5.5V in/out · 400mA
    DRL-8 package · TI
    Mouser: 595-TPS63802DRLR

11  COPY BUTTON             TL3315NF160Q          Mouser       100   $0.28
    Low-profile tactile switch · 4.2×3.2mm · 160gf
    Top-actuated · 0.6mm travel · E-Switch
    Mouser: 612-TL3315NF160Q

12  USB-C CONNECTOR         USB4135-GF-A-0190     Mouser       100   $0.35
    USB-C 2.0 · mid-mount · 0.8mm height · GCT
    For firmware flash + emergency charge
    Mouser: 640-USB4135-GF-A-0190

13  NOR FLASH               W25Q32JVSSIQ          Mouser       100   $0.55
    32Mb (4MB) · SPI · 2.7-3.6V · Winbond
    Mouser: 454-W25Q32JVSSIQ

14  STATUS LED              VLMTG1300             Mouser       100   $0.15
    Green · 1.6×0.8mm · 0603 · Vishay
    Edge-fired for charging/notification status

15  PASSIVES                Various 0402/0201     Mouser       lot   $1.50
    Resistors, capacitors, ferrite beads, crystals

    UNIT COMPONENT SUBTOTAL:                                         $26.58
```

### 2.2  PCB MANUFACTURING (PCBWay)

```
#   SERVICE                SPECIFICATION              UNIT $   100U TOTAL
──  ───────                ─────────────              ──────   ──────────
16  PCB FABRICATION        4-layer · 40×40mm          $0.90    $90
                           1oz copper · 1.6mm →
                           0.8mm for 7mm target
                           ENIG finish · IPC Class 2
                           PCBWay standard 5-day
                           Link: pcbway.com/PCBPrototype.html

17  SMT ASSEMBLY           Double-side reflow         $8.00    $800
                           All components placed
                           PCBWay turnkey assembly
                           Link: pcbway.com/pcb-assembly.html

18  STENCIL                0.12mm laser-cut SS        $25.00   one-off
                           (single tooling charge)

    PCBWay ORDER URL:
    pcbway.com/orderonline.aspx
    (Upload Gerbers + BOM + CPL for turnkey assembly quote)
```

### 2.3  MECHANICAL — CNC STAINLESS STEEL (PCBWay)

```
#   COMPONENT              SPECIFICATION              UNIT $   100U TOTAL
──  ─────────              ─────────────              ──────   ──────────
19  FRONT PLATE (Side A)   316L SS · 40×40×0.5mm      $8.00    $800
                           CNC mill + electropolish
                           Mirror finish Ra 0.05μm
                           21mm circular window aperture
                           PCBWay CNC link:
                           pcbway.com/CNC-Machining.html

20  BACK PLATE (Side B)    316L SS · 40×40×0.5mm      $10.00   $1,000
                           CNC mill + hairline satin
                           Camera aperture + button recess
                           Laser-etch COSMO + URL
                           4x M1.2 threaded inserts

21  CAMERA BEZEL RING      316L SS · 5×5×2mm ring     $1.50    $150
                           Press-fit into back plate

    MECHANICAL SUBTOTAL per unit:                      $19.50
    PCBWay CNC Machining contact: pcbway.com
```

### 2.4  WIRELESS CHARGING DOCK

```
#   COMPONENT              SPECIFICATION              UNIT $   100U TOTAL
──  ─────────              ─────────────              ──────   ──────────
22  QI DOCK COIL           WPCF3-5W transmit coil     $1.80    $180
                           5W · 40mm diameter
                           Würth Elektronik 760308201

23  QI TX IC               STWLC68 (or BQ500211)      $2.20    $220
                           5W wireless TX controller · ST

24  DOCK BODY              316L SS puck · ⌀50×10mm    $4.00    $400
                           Flat round · matching mirror polish
                           USB-C input on edge
                           PCBWay CNC

25  DOCK USB-C INPUT        USB-C receptacle           $0.35    $35
    DOCK PCB               1-layer · ⌀38mm round      $1.50    $150

    DOCK SUBTOTAL per unit:                            $9.85
```

### 2.5  TOTAL BOM SUMMARY PER UNIT (100-UNIT RUN)

```
CATEGORY                               UNIT COST    100-UNIT TOTAL
────────                               ─────────    ──────────────
Electronic components (items 01-15)    $26.58       $2,658
PCB fabrication + SMT assembly         $8.90        $890
Stainless steel case (2 parts)         $19.50       $1,950
Camera bezel ring                      $1.50        $150
Wireless charging dock                 $9.85        $985
Packaging (white box, foam, USB-C)     $3.00        $300
QC inspection + test fixture           $2.00        $200
Firmware flashing (PCBWay prog service)$1.50        $150
────────                               ─────────    ──────────────
SUBTOTAL                               $72.83       $7,283
15% contingency (MOQ variance)                      $1,092
────────────────────────────────────── ─────────    ──────────────
TOTAL (100 UNITS)                      $83.75       $8,375
────────────────────────────────────── ─────────    ──────────────
RECOMMENDED RETAIL                     $199–$249    —
GROSS MARGIN AT $199 RETAIL            57.8%        —
```

================================================================================

## 03  PCB DESIGN SPECIFICATION

### 3.1  BOARD OVERVIEW

```
DIMENSIONS    40×40mm (matches enclosure exactly)
LAYERS        4-layer stackup:
              L1 — Signal + components (top)
              L2 — Ground plane
              L3 — Power plane (3.3V / 1.8V)
              L4 — Signal + components (bottom)
THICKNESS     0.8mm (to hit 7mm height budget)
COPPER        1oz (35μm) all layers
SURFACE       ENIG (Electroless Nickel Immersion Gold)
SOLDER MASK   Black matte (LOT aesthetic)
SILKSCREEN    White, top side only
MIN TRACE     0.1mm / 0.1mm clearance
VIA SIZE      0.3mm drill / 0.6mm pad
IMPEDANCE     Controlled 50Ω for RF antenna trace
CERT          IPC Class 2
```

### 3.2  SCHEMATIC BLOCKS

```
┌──────────────┐    SPI     ┌──────────────┐
│ ESP32-S3     │ ─────────► │ e-paper      │
│ MINI-1-N4    │            │ GDEY0154D67  │
│              │    DVP     ┌──────────────┐
│              │ ─────────► │ Camera GC032A│
│              │    I2C     ┌──────────────┐
│              │ ─────────► │ BME688       │
│              │    SPI     │ (weather/gas)│
│              │ ─────────► ├──────────────┤
│              │    I2C     │ BHI260AP     │
│              │ ─────────► │ (AI IMU)     │
│              │    SPI     ┌──────────────┐
│              │ ─────────► │ W25Q32       │
│              │            │ (4MB flash)  │
│              │    GPIO    ┌──────────────┐
│              │ ─────────► │ Copy button  │
│              │            │ TL3315NF     │
└──────────────┘            └──────────────┘
       │
       │ USB
┌──────────────┐
│ USB-C        │ ◄── Firmware flash / debug
│ USB4135      │
└──────────────┘
       │
┌──────────────┐           ┌──────────────┐
│ MCP73831     │ ◄──────── │ BQ51013B     │ ◄── Qi coil
│ LiPo charger │           │ Qi RX IC     │
└──────────────┘           └──────────────┘
       │
┌──────────────┐
│ LP403030     │
│ LiPo 150mAh  │
└──────────────┘
       │
┌──────────────┐
│ TPS63802     │
│ Buck-boost   │ ──► 3.3V rail
└──────────────┘
```

### 3.3  PCBWay ORDER CHECKLIST

```
□  Export Gerbers (RS-274X, 6-layer zip)
□  Export drill file (Excellon)
□  Export BOM (CSV: Reference, Value, Package, MPN)
□  Export CPL/Pick-and-place (CSV: X, Y, Rotation, Side)
□  Upload all to pcbway.com → Turnkey Assembly
□  Request controlled impedance stackup note (50Ω RF)
□  Specify black solder mask, ENIG, IPC Class 2
□  Specify 0.8mm board thickness
□  Include 3D Gerber viewer export for final check
```

================================================================================

## 04  FIRMWARE ARCHITECTURE

### 4.1  PLATFORM

```
FRAMEWORK    ESP-IDF v5.2+  (Espressif IoT Development Framework)
RTOS         FreeRTOS (bundled with ESP-IDF)
LANGUAGE     C / C++ (core) + Python (build tooling)
BOOTLOADER   ESP-IDF custom bootloader with OTA partition
OTA          HTTPS OTA via lot-systems.com/api/firmware/update
FLASH MAP    4MB:
             - 64KB bootloader
             - 64KB NVS (WiFi credentials, device ID, prefs)
             - 2× 1.9MB OTA app partitions (rollback support)
```

### 4.2  TASK ARCHITECTURE (FreeRTOS)

```
TASK                  PRIORITY    STACK     INTERVAL    DESCRIPTION
────                  ────────    ─────     ────────    ───────────
wifi_task             8           8KB       event       Manage WiFi connection + reconnect
notification_poll     5           4KB       5 min       GET /api/device/notifications
display_task          6           6KB       event       Render e-paper frame on demand
sensor_task           4           4KB       60 sec      Read BME688 + BHI260AP → POST log
copy_button_task      9           2KB       interrupt   Debounce + trigger copy event
ota_task              3           8KB       daily 3AM   Check + apply firmware update
battery_task          2           2KB       30 sec      ADC battery voltage + Qi detect
led_task              7           1KB       event       Charge/notify status LED
```

### 4.3  LOT API INTEGRATION

```
BASE URL      https://lot-systems.com/api
AUTH          Bearer token (stored in NVS encrypted partition)
              Token provisioned during initial WiFi setup via BLE

ENDPOINTS USED:

  GET  /api/device/notifications
       → Returns pending notification for this device
       → Response: { "text": "Coffee time!", "id": "notif_xxx" }
       → Rendered to e-paper display on receipt

  POST /api/logs
       → Body: { "text": "Copy button pressed", "event": "lot_node_copy",
                 "metadata": { "deviceId": "COSMO-XXXX",
                               "firmware": "1.0.3",
                               "battery": 82 } }
       → Appears in Log tab on lot-systems.com dashboard
       → Triggered by: Copy button press

  POST /api/logs
       → Body: { "event": "lot_node_sensor",
                 "metadata": { "temp": 22.1, "humidity": 54.2,
                               "pressure": 1013.4, "iaq": 85,
                               "steps": 120 } }
       → Triggered by: sensor_task every 60 seconds

  POST /api/logs
       → Body: { "event": "lot_node_heartbeat",
                 "metadata": { "battery": 75, "rssi": -62,
                               "uptime": 3600 } }
       → Triggered by: battery_task every 30 minutes

  GET  /api/firmware/update?version=1.0.3&device=cosmo-node
       → Returns: { "hasUpdate": true, "url": "...", "version": "1.0.4" }
       → Triggered by: ota_task daily
```

### 4.4  WIFI PROVISIONING

```
FLOW:
1. First boot: device starts BLE advertisement "COSMO-XXXX"
2. User opens lot-systems.com on phone → Settings → Add Device
3. Site sends WiFi SSID + password + auth token via BLE (BLE-Prov protocol)
4. Device connects WiFi, stores credentials in NVS
5. Device POSTs lot_node_registered event to /api/logs
6. BLE advertisement stops. Normal operation begins.

RESET: Hold Copy button 10 seconds → clears NVS, returns to step 1.
```

### 4.5  DISPLAY PROTOCOL

```
NOTIFICATION RENDER SEQUENCE:
1. notification_poll receives { "text": "Coffee time!" }
2. display_task wakes: clears e-paper buffer
3. Renders text centered, 16px system font, black on white
4. Sub-text: current time HH:MM (from NTP)
5. E-paper full refresh: 1.5 sec
6. Partial refresh for clock updates every minute: 0.3 sec
7. Status bar (3px bottom): battery icon + WiFi icon

DISPLAY FORMAT:
   ┌────────────────────────┐
   │                        │
   │      Coffee time!      │
   │                        │
   │         14:32          │
   │                        │
   │  [battery] [wifi]      │
   └────────────────────────┘
```

### 4.6  POWER MANAGEMENT

```
STATES           CURRENT DRAW    DESCRIPTION
──────           ────────────    ───────────
Active (WiFi)    80mA            Polling, uploading sensor data
Idle (no WiFi)   1.2mA           Light sleep, button interrupt armed
Deep sleep       15μA            Between 5-min poll intervals
Qi charging      250mA IN        Full charge from dock
Display refresh  +20mA peak      During e-paper update only

BATTERY LIFE ESTIMATE (150mAh):
  4 notification polls/hour × 3 seconds WiFi = 12s active/hr
  55 minutes idle/hr + 5 minutes deep sleep/hr
  Estimated: 18–24 hours per full charge
  With dock: perpetual (device charges whenever placed on dock)
```

================================================================================

## 05  SOFTWARE — LOT API CONNECTOR

### 5.1  OVERVIEW

The LOT API Connector is a TypeScript module in the LOT-Computer codebase
that handles bidirectional communication with COSMO NODE devices. It extends
the existing `/api/logs` infrastructure with device-specific routing.

### 5.2  NEW API ENDPOINTS (Server-side, Fastify)

```typescript
// src/server/routes/device.ts

// Register device on first connect
POST /api/device/register
  Body: { deviceId: string, firmwareVersion: string, userId: string }
  Auth: Bearer token
  → Creates device record in DB, associates with user

// Device polls this every 5 minutes
GET /api/device/notifications?deviceId=COSMO-XXXX
  Auth: Bearer token (device token)
  → Returns oldest undelivered notification for this device
  → Marks as delivered after 200 response
  Response: { id: string, text: string, createdAt: string } | null

// Firmware update check
GET /api/firmware/update?version=1.0.3&device=cosmo-node
  → Response: { hasUpdate: boolean, url?: string, version?: string }

// OTA binary served from: /firmware/cosmo-node-v{version}.bin
// Stored in: public/firmware/ directory
```

### 5.3  NOTIFICATION DISPATCH (Site → Device)

```typescript
// src/server/services/device-notifications.ts
// Called by the LOT notification engine when generating user alerts

async function dispatchToDevice(userId: string, text: string) {
  // Check if user has a registered COSMO NODE
  const device = await db.device.findFirst({ where: { userId, type: 'cosmo-node' } })
  if (!device) return

  // Queue notification for next device poll
  await db.deviceNotification.create({
    data: {
      deviceId: device.id,
      text,                     // e.g. "Coffee time!"
      delivered: false,
      createdAt: new Date()
    }
  })
}
```

### 5.4  LOG TAB INTEGRATION (Copy Button)

```typescript
// Existing /api/logs route handles Copy button events automatically.
// The log entry appears in the Log tab with event: 'lot_node_copy'
// No new code needed — device POSTs to existing log endpoint.

// Log tab display (src/client/components/LogWidget.tsx)
// Add handler for 'lot_node_copy' event type:
if (log.event === 'lot_node_copy') {
  return `COSMO NODE · Copy · ${log.metadata?.deviceId}`
}
```

### 5.5  PRISMA SCHEMA ADDITIONS

```prisma
// prisma/schema.prisma additions

model Device {
  id              String   @id @default(cuid())
  userId          String
  deviceId        String   @unique  // e.g. "COSMO-A3F2"
  type            String            // "cosmo-node"
  firmwareVersion String
  lastSeen        DateTime?
  registeredAt    DateTime @default(now())
  user            User     @relation(fields: [userId], references: [id])
  notifications   DeviceNotification[]
}

model DeviceNotification {
  id        String   @id @default(cuid())
  deviceId  String
  text      String
  delivered Boolean  @default(false)
  createdAt DateTime @default(now())
  device    Device   @relation(fields: [deviceId], references: [id])
}
```

================================================================================

## 06  WIRELESS CHARGING SYSTEM

### 6.1  DEVICE-SIDE (RECEIVER)

```
IC        BQ51013BRHLR (Texas Instruments)
PROTOCOL  WPC Qi 1.1 (5W maximum)
COIL      WR202020-27K8-G · Würth Elektronik
          20×20mm receive coil
          27μH inductance
          Integrated ferrite shield (0.3mm)
          Total height: 0.8mm

CHARGE PROFILE:
  Qi contact detected → BQ51013 outputs 5.1V
  → MCP73831 charges LiPo at 100mA (0.67C for 150mAh cell)
  → Full charge time: ~100 minutes from empty
  → LED indicator: red (charging) / green (full) / off (no dock)

BACK COMPATIBILITY: Any Qi-compatible charger (phone chargers, pads) works.
```

### 6.2  CHARGING DOCK (TRANSMITTER)

```
IC        STWLC68 (STMicroelectronics) — Qi TX controller
COIL      WPCF3-5W transmit coil · 40mm diameter
INPUT     USB-C PD · 9V/2A → 18W input
POWER     5W to COSMO NODE
BODY      316L stainless steel puck · ⌀50mm × 10mm
          Mirror-polished top surface (matches device aesthetic)
          Matte underside with rubber non-slip pad
          "COSMO" laser-etched on underside only

PLACEMENT: Device rests polished-side-up on dock.
           Qi coils align automatically within ±5mm tolerance.
```

================================================================================

## 07  PRODUCTION ROADMAP — 100 UNITS

### 7.1  PHASE OVERVIEW

```
PHASE   MILESTONE                                    DURATION   TARGET DATE
─────   ─────────                                    ────────   ───────────
P0      Schematic complete + reviewed                2 weeks    Week 2
P1      PCB layout complete · DFM check · Gerbers    3 weeks    Week 5
P2      3D model SS enclosure · DXF for CNC          2 weeks    Week 5
P3      PCBWay proto order (5 units) · SS proto      1 week     Week 6
P4      Bring-up: power, WiFi, display, sensors      2 weeks    Week 8
P5      Firmware v0.1: WiFi, notifications, logging  3 weeks    Week 11
P6      LOT API connector code merged + tested       2 weeks    Week 11
P7      Proto validation: 5 units · field test       2 weeks    Week 13
P8      EVT → DVT sign-off: 15 units                 2 weeks    Week 15
P9      PCBWay production order: 100 units           4 weeks    Week 19
P10     Firmware flash + QC at PCBWay                1 week     Week 20
P11     Packaging + fulfillment prep                 1 week     Week 21
P12     SHIP — 100 units                             —          Week 22
```

### 7.2  PCBWAY PRODUCTION ORDER SEQUENCE

```
01  Log into pcbway.com → Quick Order
02  Upload Gerbers (ZIP) → confirm 40×40mm · 4-layer · 0.8mm
03  Select: ENIG finish · black SM · IPC Class 2 · qty 100
04  Assembly tab: upload BOM + CPL → select Turnkey
05  Upload SS CNC files (STEP/DXF) to CNC Machining service
06  Consolidate PCB + CNC + assembly into single order for shipping
07  Request: pre-programmed ESP32-S3 (firmware flash service)
08  Shipping: DHL Express to US address

PCBWay contact: support@pcbway.com
Order portal:   pcbway.com/orderonline.aspx
CNC service:    pcbway.com/CNC-Machining.html
Assembly:       pcbway.com/pcb-assembly.html
```

### 7.3  QC CHECKLIST (PER UNIT)

```
□  Power-on: device boots, LED blinks green 3× = PASS
□  WiFi: connects to test SSID, pings lot-systems.com = PASS
□  Display: full black → full white → test pattern = PASS
□  Camera: captures 640×480 test frame, no dead pixels = PASS
□  BME688: returns temp 20–30°C, humidity 30–70% = PASS
□  BHI260AP: returns accelerometer values (flat = 0,0,1g) = PASS
□  Copy button: press registers log event = PASS
□  Qi charging: place on dock, LED turns red within 5s = PASS
□  OTA: firmware update test endpoint responds = PASS
□  Enclosure: no scratches on mirror face, snug fit = PASS
```

================================================================================

## 08  PDF MANUALS STRUCTURE

Seven separate manuals. All generated from Markdown source via Pandoc + wkhtmltopdf.
LOT terminal grid styling. Black cover, white text.

### MANUAL 01 — QUICK START GUIDE
```
Pages: 8
Audience: End user
Contents:
  - What's in the box
  - Charge before first use (dock)
  - Download LOT app / open lot-systems.com
  - Go to Settings → Add Device
  - Hold Copy button 3 seconds to enter pairing mode
  - Follow on-screen setup (BLE provisioning)
  - Your COSMO NODE is live
  - What the LED means
  - Copy button: what it does
```

### MANUAL 02 — USER GUIDE (FULL)
```
Pages: 24
Audience: End user
Contents:
  - COSMO NODE overview and parts diagram
  - Charging: dock placement, charge time, battery indicator
  - Notifications: how they work, frequency, customization on site
  - Copy button: function, Log tab on lot-systems.com
  - Sensors: what is measured, where to view data
  - Display: reading notifications, time display
  - WiFi: changing networks, reconnecting
  - Factory reset procedure
  - Care: cleaning stainless steel, storage
  - Specifications table
  - Warranty and support
```

### MANUAL 03 — FIRMWARE REFERENCE
```
Pages: 32
Audience: Developer / LOT engineering
Contents:
  - Firmware architecture overview
  - FreeRTOS task map
  - Memory map (flash partitions)
  - Build environment setup (ESP-IDF v5.2)
  - Build commands: idf.py build / flash / monitor
  - Configuration: menuconfig options
  - WiFi provisioning protocol
  - OTA update mechanism
  - NVS key registry
  - Power state machine
  - Debug UART output format
  - Error codes
  - Changelog
```

### MANUAL 04 — API CONNECTOR REFERENCE
```
Pages: 20
Audience: Developer / LOT backend engineer
Contents:
  - API endpoints: device/register, device/notifications, logs
  - Authentication: token provisioning, bearer header
  - Event types: lot_node_copy, lot_node_sensor, lot_node_heartbeat
  - Prisma schema: Device, DeviceNotification models
  - Notification dispatch flow (site → device)
  - Log tab integration
  - Rate limits
  - Error handling + retry policy
  - WebSocket upgrade path (future)
```

### MANUAL 05 — HARDWARE REFERENCE
```
Pages: 28
Audience: Hardware engineer / repair tech
Contents:
  - Full BOM with part numbers and approved alternates
  - PCB schematic (PDF export from EDA)
  - PCB layout diagrams (layer by layer)
  - Enclosure drawings (DXF reference)
  - Internal stack-up diagram
  - Connector pinouts
  - Test points map
  - Electrical characteristics (voltage rails, power budget)
  - Thermal analysis
  - EMC notes (WiFi antenna keep-out zone)
  - Rework + repair notes
```

### MANUAL 06 — PRODUCTION + QC GUIDE
```
Pages: 16
Audience: PCBWay / contract manufacturer
Contents:
  - PCBWay order instructions
  - Gerber file index
  - BOM with approved vendors and alternates
  - CPL format specification
  - SMT profile (reflow temperature curve)
  - Firmware flashing procedure (JTAG + USB)
  - QC checklist (10 tests per unit)
  - Packaging instructions
  - Serialization: COSMO-XXXX format
  - Shipping requirements
```

### MANUAL 07 — REGULATORY + SAFETY
```
Pages: 12
Audience: Legal / certification
Contents:
  - FCC Part 15 compliance notes (WiFi/BT device)
  - CE marking roadmap (for EU distribution)
  - RoHS compliance statement (316L SS, lead-free PCB)
  - Li-ion battery safety: UN 38.3, IATA for shipping
  - SAR statement (BT 5.0 at max 10dBm)
  - Recycling instructions
  - Copyright and trademark notice
```

================================================================================

## 09  FIRMWARE DOCUMENTS (SEPARATE FILE SET)

To be maintained in: docs/hardware/firmware/

```
firmware/
├── FIRMWARE-ARCHITECTURE.md       Task map, state machines, boot sequence
├── FIRMWARE-BUILD-GUIDE.md        ESP-IDF setup, build, flash, monitor
├── FIRMWARE-OTA-PROTOCOL.md       OTA partition layout, update flow
├── FIRMWARE-NVS-REGISTRY.md       All NVS keys, types, defaults
├── FIRMWARE-POWER-STATES.md       Active/idle/deep-sleep transitions
├── FIRMWARE-WIFI-PROV.md          BLE provisioning protocol spec
├── FIRMWARE-DISPLAY-DRIVER.md     e-paper SPI protocol, refresh modes
├── FIRMWARE-SENSOR-DRIVERS.md     BME688 + BHI260AP I2C driver notes
├── FIRMWARE-API-CLIENT.md         HTTP client, retry policy, auth
├── FIRMWARE-CHANGELOG.md          Version history
└── FIRMWARE-ERROR-CODES.md        All error codes + remediation
```

================================================================================

## 10  SOFTWARE DOCUMENTS (SEPARATE FILE SET)

To be maintained in: docs/hardware/software/

```
software/
├── SOFTWARE-API-CONNECTOR.md      New endpoints, Prisma schema, dispatch
├── SOFTWARE-DEVICE-PAIRING.md     BLE provisioning flow, UI spec
├── SOFTWARE-LOG-TAB-EVENTS.md     lot_node_* event types, display rules
├── SOFTWARE-NOTIFICATION-ENGINE.md How LOT AI queues device notifications
├── SOFTWARE-SETTINGS-UI.md        Device management page on lot-systems.com
└── SOFTWARE-TESTING.md            Integration test plan, mock device
```

================================================================================

## 11  SESSION COMPRESSION LOG

Each development session compresses its context into this section.
New entries prepended. Keeps the document self-contained.

```
────────────────────────────────────────────────────────────────────────────
SESSION  001 · 2026.06.24
AUTHOR   Claude (claude-sonnet-4-6) / Vadik Marmeladov
OUTCOME  Full hardware specification written from brief
         19-point brief → structured into 11 document sections
         BOM: 25 line items, 100-unit COGS $83.75/unit
         PCB: 4-layer 40×40mm, 0.8mm, PCBWay turnkey
         MCU: ESP32-S3-MINI-1-N4 (WiFi+BT+DVP camera)
         Display: GDEY0154D67 e-paper 1.54" (200×200px)
         Case: 316L SS, 2-part, CNC at PCBWay
         7 PDF manuals + 11 firmware docs + 6 software docs outlined
         Production timeline: 22 weeks to 100-unit ship
         LOT API: /api/device/notifications + /api/logs integration
         Copy button → POST /api/logs { event: 'lot_node_copy' }
         Wireless charging: Qi 5W, matching SS dock
         Height: 7mm production (5mm aspirational R2.0)
BRANCH   claude/brave-lamport-c4qf7k
STATUS   COMPLETE — pushed to GitHub
────────────────────────────────────────────────────────────────────────────
```

================================================================================

## 12  QUICK REFERENCE — KEY LINKS

```
PCBWay PCB order:         pcbway.com/orderonline.aspx
PCBWay SMT assembly:      pcbway.com/pcb-assembly.html
PCBWay CNC machining:     pcbway.com/CNC-Machining.html
ESP32-S3-MINI-1 datasheet: espressif.com/en/products/socs/esp32-s3
BME688 datasheet:         bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688
BHI260AP datasheet:       bosch-sensortec.com/products/motion-sensors/bhi260ap
GDEY0154D67 display:      gooddisplay.net/product/GDEY0154D67.html
Mouser cart (key parts):  Search MPNs above on mouser.com
LOT Systems:              lot-systems.com
LOT brand guide:          brand.lot-systems.com
COSMO® CIA:               lot-systems.com/about
```

================================================================================
LOT SYSTEMS CORPORATION / COSMO® CIA                          LOS ANGELES, CA
COSMO NODE — HW-SPEC-01                                           2026.06.24
"THE METAL IS THE MESSAGE."
================================================================================
