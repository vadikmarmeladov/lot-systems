<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COSMO® C-1 — HARDWARE COMPUTER
## Complete Design, BOM, Firmware & Manufacturing Roadmap
### Document: LOT_COSMO_C1_HARDWARE_DESIGN.md
### Classification: PRODUCT — ENGINEERING RELEASE
### Version: 1.0.0 — 14 June 2026
### Author: Vadim Marmeladov, Inventor, COSMO® CIA

---

```
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   LOT SYSTEMS CORPORATION                                             ║
║   COSMO® C-1 HARDWARE COMPUTER — FULL ENGINEERING SPECIFICATION       ║
║                                                                       ║
║   VERSION: 1.0.0                                                      ║
║   DATE: 14 June 2026                                                  ║
║   FORM FACTOR: 40 × 40 × 5 mm — 316L Stainless Steel                ║
║   RUN SIZE: 100 UNITS — PCBWay Production                             ║
║   STATUS: DESIGN RELEASE — READY FOR COMPONENT SOURCING              ║
║                                                                       ║
║   Vadim Marmeladov — CEO, Owner LOT®          Founded 7 Apr 2016     ║
║   Kuzya Cosmo Marmeladov — CEO, Owner COSMO®    Founded 1 Jul 2024   ║
║   Made in the USA | brand.lot-systems.com                             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## SECTION 00 — DEVICE CONCEPT

The COSMO® C-1 is a pager-class personal intelligence terminal. It is the first physical node in the LOT Systems network — a silent, always-on companion that receives autonomous AI notifications from lot-systems.com and lets the user send one-tap signals back to their LOT Log.

It does not run apps. It does not host a UI. It is a receiver and a button.

**One surface: mirror-polished stainless steel.**  
**One surface: a display, a camera, and a button.**

The display shows what the LOT platform decides matters right now: "Coffee time." "Recovery window." "You have not journaled today." "Benchmark: Purple."

The button copies the last notification directly into the user's LOT Log tab on lot-systems.com — one signal, zero friction.

The camera reads the environment. The weather sensor reads the air. The AI reads both and personalizes the next notification.

---

## SECTION 01 — PHYSICAL SPECIFICATION

```
┌─────────────────────────────────────────────────────────────────────┐
│  COSMO® C-1 — PHYSICAL DIMENSIONS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Outer dimensions:    40.0 × 40.0 × 5.0 mm                        │
│  Body material:       316L stainless steel (CNC machined, 2-part)  │
│  Shell wall:          0.6 mm minimum (CNC precision)               │
│  PCB footprint:       36.0 × 36.0 mm (2-layer, 1.0 mm thickness)  │
│  Weight (est.):       42 g (steel body + PCB + battery)            │
│                                                                     │
│  SIDE A — FRONT (Mirror Polish)                                     │
│  ├── Surface: 316L stainless, electropolished to mirror finish      │
│  ├── No openings. No markings. No logos.                            │
│  └── COSMO® micro-engraving on bottom edge (laser etched, 0.3mm)   │
│                                                                     │
│  SIDE B — BACK (Functional Surface)                                 │
│  ├── Surface: 316L stainless, brushed/satin finish                  │
│  ├── Display aperture: 28 × 14 mm (centered, upper half)           │
│  ├── Camera aperture: 5 × 5 mm (centered, lower right)             │
│  ├── Button aperture: 8 mm circle (centered, lower left)           │
│  └── Charging coil window: full back panel (internal Qi coil)      │
│                                                                     │
│  SEAM: Precision snap-fit + 4× M1.0 torx screws (concealed)        │
│  IP RATING: IPX4 (splash resistant — seam sealed with silicone bead)│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Body Cross-Section (5 mm stack)

```
  0.6 mm  — Side A stainless shell (mirror)
  0.2 mm  — Internal foam gasket
  1.0 mm  — PCB (components facing inward)
  2.2 mm  — Battery (LiPo, flat cell)
  0.2 mm  — Wireless charging coil (flexible PCB)
  0.6 mm  — Side B stainless shell (brushed)
  ──────
  4.8 mm  + 0.2 mm seam gap = 5.0 mm total
```

---

## SECTION 02 — SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│  COSMO® C-1 — SYSTEM BLOCK DIAGRAM                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐    │
│  │   MCU Core   │────▶│  OLED/E-Ink  │     │  lot-systems.com │    │
│  │  nRF5340-DK  │     │  Display     │     │  LOT API (HTTPS) │    │
│  │  (BLE 5.3 +  │     └──────────────┘     └────────┬─────────┘    │
│  │   USB CDC)   │                                    │              │
│  │              │────▶┌──────────────┐     ┌────────▼─────────┐    │
│  │              │     │  OV5640      │     │  iOS/Android App │    │
│  │              │     │  Camera      │     │  (BLE Bridge)    │    │
│  │              │     └──────────────┘     └──────────────────┘    │
│  │              │                                                   │
│  │              │────▶┌──────────────┐                             │
│  │              │     │  BME688      │                             │
│  │              │     │  Weather +   │                             │
│  │              │     │  AI Sensor   │                             │
│  │              │     └──────────────┘                             │
│  │              │                                                   │
│  │              │────▶┌──────────────┐                             │
│  │              │     │  COPY Button │                             │
│  │              │     │  + Haptic    │                             │
│  │              │     │  Feedback    │                             │
│  │              │     └──────────────┘                             │
│  │              │                                                   │
│  │              │────▶┌──────────────┐                             │
│  │              │     │  BQ25504     │                             │
│  │              │     │  Wireless Qi │                             │
│  │              │     │  Charger IC  │                             │
│  │              │     └──────────────┘                             │
│  └──────────────┘                                                   │
│                                                                     │
│  CONNECTIVITY: BLE 5.3 (device ↔ phone) → HTTPS (phone ↔ LOT API) │
│  POWER: 150 mAh LiPo + Qi 5W wireless charging                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Connectivity model:** The C-1 communicates via BLE 5.3 to a paired smartphone. The smartphone's LOT app acts as the BLE-to-HTTPS bridge, forwarding notifications from lot-systems.com to the device and relaying the COPY button signal back to the user's LOT Log API endpoint. No SIM card. No independent WiFi chip. This keeps the PCB within 36×36 mm and the battery within 150 mAh.

---

## SECTION 03 — COMPONENTS BILL OF MATERIALS (BOM)

> All prices in USD. Quantities for 100-unit production run (×120 ordered for 20% overstock). Sourcing: DigiKey primary, Mouser secondary, LCSC tertiary (for PCBWay PCBA).

---

### 03.1 — MICROCONTROLLER

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| U1 | Nordic nRF5340 SoC (BLE 5.3 + ARM M33 dual-core) | nRF5340-CLAA-R | DigiKey | $5.42 | 120 | $650 | [DigiKey](https://www.digikey.com/en/products/detail/nordic-semiconductor-asa/NRF5340-CLAA-R/13610762) |

**Why nRF5340:** Dual-core (app + network), BLE 5.3, 1 MB Flash, 512 KB RAM, ultra-low power (1 µA sleep), USB CDC for firmware updates. Industry standard for wearables. Nordic SDK + Zephyr RTOS.

---

### 03.2 — DISPLAY

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| LCD1 | 1.3" OLED 128×64 SSD1306 (I²C, white, 27×14 mm module) | SSD1306 | LCSC / AliExpress | $2.10 | 120 | $252 | [LCSC C5261568](https://www.lcsc.com/product-detail/OLED-Displays_HGLRC-SSD1306_C5261568.html) |

**Rationale:** The SSD1306 128×64 monochrome OLED fits the 28×14 mm aperture precisely. White-on-black. Draws ~20 mA active, 0 mA when blanked. Perfect for pager-style notifications. Text is crisp at reading distance.

**Alternative (lower power):** Waveshare 1.02" e-Paper (128×80, partial refresh 500 ms) — draw is 0 mA when static. Adds 2× cost but triples battery life. Recommended for v2.

---

### 03.3 — CAMERA

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| CAM1 | OV5640 5MP camera module, MIPI CSI, 24-pin FPC, 8.5×8.5 mm | OV5640-D | ArduCam / LCSC | $4.80 | 120 | $576 | [ArduCam B0182](https://www.arducam.com/product/arducam-5mp-ov5640-ultracompact-mipi-csi-2-camera-with-auto-focus/) |

**Purpose:** Environment capture for AI context (lighting condition, face presence for privacy-aware notifications, QR code scanning for LOT profile pairing). Module sits flush in the 5×5 mm back aperture with a lens element recessed 0.3 mm below steel surface.

---

### 03.4 — WEATHER + AI SENSOR

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| U2 | Bosch BME688 (Temp / Humidity / Pressure / VOC / AI) | BME688 | DigiKey / Mouser | $7.20 | 120 | $864 | [DigiKey 828-BME688CT-ND](https://www.digikey.com/en/products/detail/bosch-sensortec/BME688/13681260) |

**Why BME688:** The BME688 includes Bosch's on-chip AI (BSEC2 library) that classifies air quality into an Indoor Air Quality (IAQ) score. It measures: temperature (±0.5°C), relative humidity (±3%), barometric pressure (±1 hPa), VOC/gas index. The BSEC2 library runs directly on the nRF5340 and outputs an IAQ score (0–500). This feeds the LOT API as a real-time environmental context variable — enabling notifications like "Air quality degrading — consider a walk" or "Temperature spike — hydration reminder."

---

### 03.5 — WIRELESS CHARGING

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| U3 | Texas Instruments BQ51050B (Qi receiver IC, 5V/1A) | BQ51050BRHLR | DigiKey | $1.85 | 120 | $222 | [DigiKey 296-45636-1-ND](https://www.digikey.com/en/products/detail/texas-instruments/BQ51050BRHLR/6193791) |
| L1 | Qi Wireless Charging Receiver Coil, 35×35 mm, Flex PCB | WR202020-35F3-G | TDK | $2.40 | 120 | $288 | [TDK Product Page](https://product.tdk.com/en/search/inductors/coil/wireless_charging/info?part_no=WR202020-35F3-G) |
| U4 | MCP73831 LiPo Charger IC (from Qi output to battery) | MCP73831T-2ACI/OT | DigiKey | $0.62 | 120 | $74 | [DigiKey MCP73831T-2ACI/OT-ND](https://www.digikey.com/en/products/detail/microchip-technology/MCP73831T-2ACI-OT/964305) |

**Standard:** Qi 1.3 (5W max). The receiver coil is a 35×35 mm flexible PCB that maps to the full back panel footprint inside the steel shell. Steel transmits Qi fields adequately at 5 mm depth. Charge time from 0%: ~45 min for 150 mAh cell.

---

### 03.6 — BATTERY

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| BAT1 | LiPo Cell, 3.7V 150 mAh, 35×30×2.0 mm flat | LP352035 | LCSC / Alibaba | $1.20 | 120 | $144 | [LCSC search: LP352035](https://www.lcsc.com/search?q=LP352035) |

**Battery life estimate:** BLE active (1 ms/100 ms duty) + MCU active: ~8 mA avg. Deep sleep between notifications: 0.05 mA. At average 30 min active / 23.5 h sleep: estimated ~6 days between charges. Display on for 15 s per notification adds ~0.1 mAh per event.

---

### 03.7 — BUTTON + HAPTIC

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| SW1 | Tactile push button, 6×6 mm, 0.8 mm travel, SMD | TS-1187A | LCSC | $0.08 | 120 | $10 | [LCSC C318884](https://www.lcsc.com/product-detail/Tactile-Switches_Korean-Hroparts-Elec-TS-1187A-B-A-B_C318884.html) |
| M1 | ERM Vibration Motor, 8 mm coin, 3V, 120 mA | 1030-025-ND | DigiKey | $1.45 | 120 | $174 | [DigiKey 1030-025-ND](https://www.digikey.com/en/products/detail/pui-audio-inc/SMT-0832-F-1-2-R/16686997) |

**COPY Button behavior:** Single press → haptic confirmation pulse (50 ms) → BLE packet sent → LOT API `/api/log/append` called with last notification text + timestamp → LOT Log tab displays "📋 [Copied from COSMO C-1] Coffee time! — 14:32"

**Long press (2 s):** Device pairing mode (BLE advertising). LED flash via display white-out.

---

### 03.8 — POWER MANAGEMENT

| # | Component | Part Number | Supplier | Unit Price | Qty | Extended | Link |
|---|-----------|-------------|----------|------------|-----|----------|------|
| U5 | TPS62840 Buck Converter (3.3V rail for MCU/display) | TPS62840DGRR | DigiKey | $0.95 | 120 | $114 | [DigiKey 296-51116-1-ND](https://www.digikey.com/en/products/detail/texas-instruments/TPS62840DGRR/9607596) |

---

### 03.9 — PASSIVE COMPONENTS (SMD)

| # | Component | Value | Package | Qty | Unit Price | Extended |
|---|-----------|-------|---------|-----|------------|----------|
| C1–C10 | Decoupling capacitors | 100 nF | 0402 | 1200 | $0.01 | $12 |
| C11–C15 | Bulk capacitors | 10 µF | 0805 | 600 | $0.03 | $18 |
| R1–R8 | Pull-up / current limit | 10 kΩ, 100 Ω | 0402 | 960 | $0.01 | $10 |
| L2 | Buck inductor | 1.5 µH | 0402 | 120 | $0.08 | $10 |
| D1 | ESD protection diode | TVS | SOD-323 | 120 | $0.12 | $14 |

---

### 03.10 — PCB & MANUFACTURING

| # | Item | Supplier | Unit Price | Qty | Extended | Notes |
|---|------|----------|------------|-----|----------|-------|
| PCB | 2-layer, 36×36 mm, 1.0 mm, ENIG finish | PCBWay | $0.80 | 120 | $96 | Min order 100 + 20 spares |
| PCBA | SMT assembly service (all SMD components) | PCBWay | $12.00 | 100 | $1,200 | Includes stencil, placement, reflow |
| Stencil | Laser-cut stainless paste stencil | PCBWay | $25.00 | 1 | $25 | One-time tooling |
| DFM Review | PCBWay DFM check | PCBWay | $0.00 | 1 | $0 | Included |

---

### 03.11 — MECHANICAL

| # | Item | Process | Material | Supplier | Unit Price | Qty | Extended |
|---|------|---------|----------|----------|------------|-----|----------|
| Shell A | Front panel, mirror finish | CNC + Electropolish | 316L SS | PCBWay CNC | $8.50 | 120 | $1,020 |
| Shell B | Back panel, brushed + apertures | CNC + Brush | 316L SS | PCBWay CNC | $9.20 | 120 | $1,104 |
| Screws | M1.0 × 2.5 mm Torx T2 | — | A2 SS | McMaster | $0.04 | 480 | $19 |
| Silicone bead | Seam sealant | Manual apply | Silicone | McMaster | $0.08 | 100 | $8 |
| Display window | 0.3 mm optical glass, 28×14 mm, AR coated | CNC + bond | Glass | Alibaba | $0.60 | 120 | $72 |
| Camera lens | M5 wide-angle lens, 120° FOV, 5 mm | — | Glass | AliExpress | $0.45 | 120 | $54 |
| Button cap | 316L SS, 7 mm disc, mirror | CNC | 316L SS | PCBWay CNC | $1.20 | 120 | $144 |
| Foam gasket | 0.2 mm closed-cell foam | Die-cut | EVA | Alibaba | $0.10 | 120 | $12 |

---

## SECTION 04 — COST SUMMARY (100-UNIT RUN)

```
╔══════════════════════════════════════════════════════════════════════╗
║  COSMO® C-1 — 100-UNIT PRODUCTION COST SUMMARY                      ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  CATEGORY                        TOTAL       PER UNIT               ║
║  ─────────────────────────────────────────────────────────          ║
║  MCU (nRF5340)                   $650         $6.50                 ║
║  Display (OLED SSD1306)          $252         $2.52                 ║
║  Camera (OV5640)                 $576         $5.76                 ║
║  Weather AI Sensor (BME688)      $864         $8.64                 ║
║  Wireless Charging System        $584         $5.84                 ║
║  Battery (150 mAh LiPo)          $144         $1.44                 ║
║  Button + Haptic                 $184         $1.84                 ║
║  Power Management (TPS62840)     $114         $1.14                 ║
║  Passives                        $64          $0.64                 ║
║  PCB Fabrication                 $96          $0.96                 ║
║  PCBA Assembly (PCBWay)          $1,200       $12.00                ║
║  Stencil (one-time)              $25          $0.25                 ║
║  Steel Shell (2 parts, CNC)      $2,124       $21.24                ║
║  Mechanical (screws/glass/etc.)  $309         $3.09                 ║
║  ─────────────────────────────────────────────────────────          ║
║  SUBTOTAL HARDWARE BOM           $7,186       $71.86                ║
║  ─────────────────────────────────────────────────────────          ║
║  Packaging + foam insert (×100)  $300         $3.00                 ║
║  QA / Functional test (labor)    $500         $5.00                 ║
║  Firmware flashing (USB CDC)     $100         $1.00                 ║
║  Shipping + customs              $400         $4.00                 ║
║  ─────────────────────────────────────────────────────────          ║
║  TOTAL LANDED COST               $8,486       $84.86/unit           ║
║  ─────────────────────────────────────────────────────────          ║
║  Suggested retail (founder tier) $299.00                            ║
║  Gross margin                    71.6%                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## SECTION 05 — PCBWay PRODUCTION ROADMAP

### Phase 1 — Design Submission (Weeks 1–2)

1. **Schematic capture** — KiCad 7.0. Export Gerber files (RS-274X), BOM (CSV), and placement files (PnP CSV).
2. **DRC (Design Rule Check)** — PCBWay standard rules: 6/6 mil trace/space, min 0.2 mm drill.
3. **PCBWay upload** — Submit via pcbway.com: 36×36 mm, 2-layer, 1.0 mm, ENIG, green solder mask, white silkscreen.
4. **PCBA order** — Upload BOM with LCSC part numbers for auto-sourcing. Components not on LCSC submitted separately.
5. **CNC order** — Submit STEP files for both shell halves. Specify: 316L SS, Ra 0.4 µm finish on Side A, Ra 0.8 µm on Side B.

### Phase 2 — Prototype Run (Weeks 3–5)

- **Quantity:** 5 PCBAs + 5 shell sets
- **Goal:** Validate mechanical fit, BLE range, OLED legibility, camera FOV in steel aperture, Qi charging through steel
- **Test protocol:** See Section 09

### Phase 3 — Pilot Run (Weeks 6–8)

- **Quantity:** 20 units, fully assembled
- **Goal:** Firmware v1.0 loaded, paired with iOS LOT app, live notification delivery verified
- **LOT API integration test:** POST to `/api/device/notify`, receive on C-1 within 3 s BLE latency

### Phase 4 — Production Run (Weeks 9–12)

- **Quantity:** 100 units
- **PCBWay turnaround:** 10 business days PCBA + 5 business days CNC
- **Assembly:** Manual final assembly (PCB into shell, screw torque 0.8 N·cm, silicone bead, QA visual inspection)
- **Firmware flash:** USB CDC via pogo-pin jig (2-pad: VBUS + D−/D+) before shell closure

---

## SECTION 06 — LOT API CONNECTOR SPECIFICATION

The C-1 connects to lot-systems.com via a BLE peripheral → smartphone bridge architecture.

### 06.1 — Device-Side BLE Profile

```
Service UUID:  12345678-1234-1234-1234-123456789ABC  (LOT C-1 Service)
  Characteristic: NOTIFY_RX   (write, notify) — receive notification from app
  Characteristic: LOG_TX      (write)          — send COPY button event to app
  Characteristic: STATUS      (read)           — battery %, sensor readings
  Characteristic: CONFIG      (write)          — brightness, vibration, sleep timer
```

### 06.2 — API Endpoints (lot-systems.com)

```
POST /api/device/register
  Body: { deviceId, userId, pairedAt }
  Response: { token, syncInterval }

GET  /api/device/notifications/{deviceId}
  Response: { notifications: [{ id, text, priority, timestamp }] }
  Called by: mobile app, polled every 60 s

POST /api/log/device-append
  Body: { userId, notificationId, text, copiedAt, deviceId }
  Response: { logEntryId }
  Effect: Appends "📋 [C-1] {text}" to user's LOT Log tab

POST /api/device/sensor-data
  Body: { deviceId, temp, humidity, pressure, iaq, timestamp }
  Response: { received: true }
  Effect: Feeds environmental context into QIE notification engine

GET  /api/device/status/{deviceId}
  Response: { battery, lastSeen, firmwareVersion }
```

### 06.3 — Notification Payload Format

```json
{
  "id": "notif_20260614_143200",
  "text": "Coffee time!",
  "priority": "low",
  "duration": 15,
  "vibration": "single",
  "source": "lot-schedule",
  "qie_pattern": "circadian_anchor",
  "timestamp": "2026-06-14T14:32:00Z"
}
```

**Sources:** LOT scheduled jobs → QIE pattern match → notification generated → pushed to device queue → polled by mobile bridge → BLE forwarded to C-1 → displayed for `duration` seconds.

---

## SECTION 07 — FIRMWARE ARCHITECTURE

```
COSMO C-1 Firmware v1.0
Toolchain: nRF Connect SDK v2.6 + Zephyr RTOS 3.5
Language: C (Zephyr native)

├── main.c                    — System init, power state machine
├── ble/
│   ├── ble_service.c         — GATT service definition
│   ├── ble_advertising.c     — BLE advertisement + pairing
│   └── ble_handler.c         — Characteristic read/write callbacks
├── display/
│   ├── oled_ssd1306.c        — SSD1306 I²C driver
│   ├── display_manager.c     — Notification render, font, scroll
│   └── fonts/
│       └── font_6x8.h        — Monospace 6×8 bitmap font (ASCII 32–126)
├── sensors/
│   ├── bme688_driver.c       — Bosch BSEC2 integration
│   ├── camera_ov5640.c       — MIPI CSI capture, JPEG encode
│   └── sensor_manager.c      — Periodic read, deep-sleep aware
├── button/
│   ├── button_handler.c      — GPIO interrupt, debounce, long-press
│   └── haptic.c              — ERM motor PWM control
├── power/
│   ├── battery_monitor.c     — ADC voltage → % SOC
│   ├── charger_bq51050.c     — Qi charge state monitoring
│   └── power_manager.c       — Sleep scheduling, wake triggers
├── usb/
│   └── usb_cdc.c             — Firmware update via USB (DFU mode)
└── config/
    └── c1_config.h           — Hardware pin assignments, thresholds
```

### Firmware State Machine

```
BOOT
 │
 ▼
INIT (0.3 s) — peripheral init, BLE start advertising
 │
 ▼
PAIRING WAIT — display "Pair with LOT app" — timeout 5 min → DEEP SLEEP
 │
 ▼
CONNECTED
 │
 ├──▶ IDLE (display off, BLE connected, BSEC2 running every 3 s)
 │        │
 │        │ [Notification received via BLE NOTIFY_RX]
 │        ▼
 │    DISPLAY ON — show notification text, vibrate (priority-based)
 │        │  (15 s default, configurable)
 │        ▼
 │    DISPLAY OFF → IDLE
 │
 └──▶ COPY BUTTON PRESS
          │
          ├── Haptic pulse (50 ms)
          ├── BLE write LOG_TX (last notification payload)
          └── Display flash "✓ Sent to LOT Log" (2 s)
```

### Power Budget

```
State                Draw        Duration        µAh/day
───────────────────────────────────────────────────────
Deep sleep           18 µA       23.0 h          414
BLE connected idle   320 µA      0.8 h           256
Display active       22 mA       0.17 h          3,740
BME688 read          3.5 mA      0.025 h × 480   42
Camera capture       85 mA       0.003 h × 10    2.55
Haptic (button)      120 mA      0.00014 h × 20  0.33
───────────────────────────────────────────────────────
TOTAL ESTIMATED               ~4,455 µAh/day
BATTERY:             150 mAh = 150,000 µAh
RUNTIME:             ~33.6 h (~1.4 days) worst case
                     ~6 days average use (8 notif/day)
```

---

## SECTION 08 — SOFTWARE: LOT MOBILE BRIDGE APP

The COSMO® C-1 requires a companion app running on iOS or Android. This is not a standalone app — it is a background BLE bridge added to the existing LOT Systems mobile experience.

### Architecture

```
LOT Mobile App (React Native)
├── BLE Manager (react-native-ble-plx)
│   ├── Scan + pair C-1 on first launch
│   ├── Background BLE connection (BLE peripheral mode)
│   └── Characteristic listeners (NOTIFY_RX, LOG_TX)
│
├── Notification Bridge
│   ├── Poll GET /api/device/notifications every 60 s
│   ├── Queue notifications locally (SQLite)
│   └── Forward to C-1 via BLE write
│
├── Log Bridge
│   ├── Listen for LOG_TX events (COPY button)
│   └── POST /api/log/device-append with notification text
│
├── Sensor Upload
│   ├── Receive STATUS from C-1 (battery, IAQ, temp)
│   └── POST /api/device/sensor-data every 5 min
│
└── Settings Screen
    ├── Pair / unpair C-1
    ├── Notification brightness (0–100%)
    ├── Vibration pattern (single / double / long)
    ├── Sleep schedule (notifications suppressed 23:00–07:00)
    └── Firmware version + OTA update trigger
```

### OTA Firmware Update Flow

1. LOT API signals new firmware available (GET /api/device/firmware/latest)
2. App downloads .zip (nRF DFU package) from LOT CDN
3. App triggers BLE DFU mode on C-1 (CONFIG characteristic write)
4. nRF DFU Library handles BLE firmware transfer (~90 s for 200 KB)
5. C-1 reboots with new firmware, reconnects

---

## SECTION 09 — QA TEST PROTOCOL

### Unit Test Suite (per device, pre-shipment)

```
TEST 01 — Power-on boot           PASS if: display shows LOT logo within 1 s
TEST 02 — BLE advertising         PASS if: device visible in BLE scan within 2 s
TEST 03 — BLE pair                PASS if: connects to test phone, GATT profile visible
TEST 04 — Notification display    PASS if: "Test notification" displays correctly
TEST 05 — COPY button             PASS if: LOG_TX characteristic written on press
TEST 06 — Haptic                  PASS if: vibration felt on button press
TEST 07 — BME688 sensor           PASS if: temp within ±2°C of reference, IAQ < 25 (clean air)
TEST 08 — Camera capture          PASS if: JPEG captured, filesize > 5 KB
TEST 09 — Qi charging             PASS if: battery voltage rises on Qi pad within 30 s
TEST 10 — Battery readout         PASS if: SOC displayed on STATUS characteristic
TEST 11 — Deep sleep              PASS if: current draw < 25 µA after 60 s idle
TEST 12 — IPX4 splash             PASS if: no failures after 30 s water spray (IPX4)
TEST 13 — Display legibility      PASS if: 6-point text readable at 30 cm distance
TEST 14 — Steel shell fit         PASS if: no rattle, no gap > 0.1 mm at seam
TEST 15 — Full integration        PASS if: live LOT notification appears on display within 5 s
```

### Acceptance Criteria

- All 15 tests PASS → **SHIP**
- Any 1 test FAIL → **REWORK or SCRAP**
- Target yield: 95% (5 units expected scrap from 100-unit run)

---

## SECTION 10 — WIRELESS CHARGER (INCLUDED IN BOX)

The C-1 ships with a dedicated Qi charging pad matched to the device footprint.

### Charger Specifications

| Parameter | Value |
|-----------|-------|
| Standard | Qi 1.3 |
| Output power | 5W (5V / 1A) |
| Coil size | 45 × 45 mm (slightly larger than C-1 for alignment tolerance) |
| Input | USB-C (5V / 2A) |
| Material | Brushed aluminum disc, 50 × 50 × 4 mm |
| Cable | 1.0 m braided USB-C, non-detachable |
| Alignment guide | Laser-engraved 40×40 mm square on pad surface |
| LED indicator | Single white LED, illuminates during charge, off when complete |

### Charger BOM (Pad Unit, 100 units)

| # | Component | Supplier | Unit Price | Qty | Extended |
|---|-----------|----------|------------|-----|----------|
| Qi TX coil (45×45 mm flex) | TDK | $1.80 | 100 | $180 |
| WPC transmitter IC (IDT P9242) | DigiKey | $2.10 | 100 | $210 |
| Aluminum pad body (CNC) | PCBWay CNC | $3.50 | 100 | $350 |
| USB-C cable + housing | AliExpress | $1.20 | 100 | $120 |
| PCB (45×45 mm, 1-layer) | PCBWay | $0.40 | 100 | $40 |
| **Charger total** | | | | **$900** ($9.00/unit) |

---

## SECTION 11 — NOTIFICATION SYSTEM LOGIC

The LOT platform generates notifications through the Quantum Intent Engine (QIE). The C-1 receives them as silent pushes rather than phone alerts — they surface only on the device display.

### Notification Categories

| Category | Example | QIE Pattern | Priority |
|----------|---------|-------------|----------|
| Circadian | "Coffee time!" | circadian_anchor | Low |
| Recovery | "Rest window — 20 min" | recovery_velocity | Medium |
| Benchmark | "Benchmark: Purple. Strong week." | benchmark_gate | High |
| Journal | "You haven't journaled today." | reflection_depth | Medium |
| Environmental | "Air quality dropping — open a window." | sensor_iaq | Medium |
| Hydration | "2 hours since last water." | care_pattern | Low |
| Weather | "Rain in 20 min. Adjust plans." | weather_sensor | Low |
| COSMO | "Kuzya milestone: 6 months." | cosmo_milestone | High |
| Intention | "Morning intention unset." | intention_execution | Medium |
| Silence | "Signal silence: 4 hours. Check in?" | signal_silence | Medium |

### Notification Rendering on SSD1306 (128×64 px)

```
┌────────────────────────────────┐   ← 128 px
│ ┌──────────────────────────┐   │
│ │  COSMO®                  │   │  Line 1: device brand (small, 5×7 font)
│ │                          │   │
│ │  Coffee time!            │   │  Lines 2–3: notification text (6×8 font)
│ │                          │   │
│ │  14:32  ████░░░ 72%      │   │  Line 4: time + battery bar
│ └──────────────────────────┘   │
└────────────────────────────────┘
     64 px height
```

Display auto-blanks after configured duration (default 15 s). Blank state: all pixels off (OLED 0 mA draw). Notifications queue if multiple arrive during blank state — displayed sequentially on next wake.

---

## SECTION 12 — FIRMWARE DOCUMENTS INDEX

| Document | File | Status |
|----------|------|--------|
| Firmware Architecture Overview | `firmware/FIRMWARE_ARCHITECTURE.md` | Defined (this doc) |
| BLE GATT Profile Specification | `firmware/BLE_GATT_PROFILE.md` | To be written |
| nRF5340 Pin Assignment Table | `firmware/PIN_ASSIGNMENTS.md` | To be written |
| BME688 / BSEC2 Integration Guide | `firmware/BSEC2_INTEGRATION.md` | To be written |
| OV5640 Camera Driver Guide | `firmware/CAMERA_DRIVER.md` | To be written |
| SSD1306 Display Driver | `firmware/DISPLAY_DRIVER.md` | To be written |
| Power Management Spec | `firmware/POWER_MANAGEMENT.md` | To be written |
| DFU OTA Update Protocol | `firmware/DFU_OTA_PROTOCOL.md` | To be written |
| Firmware Build Guide (nRF Connect SDK) | `firmware/BUILD_GUIDE.md` | To be written |
| QA Test Jig Wiring Diagram | `firmware/QA_TEST_JIG.md` | To be written |

---

## SECTION 13 — PDF MANUAL OUTLINE

The C-1 ships with two printed documents:

### Manual 1: User Guide (8 pages, A6 format, 105×148 mm)

```
Page 1  — Cover: COSMO® C-1. LOT Systems logo. "Your personal intelligence terminal."
Page 2  — What is this device? (2 paragraphs)
Page 3  — Device surfaces diagram (Front / Back labeled)
Page 4  — Setup: Download LOT app → Pair C-1 → You're connected
Page 5  — Receiving notifications (display diagram)
Page 6  — COPY button: what it does, how it logs to LOT
Page 7  — Charging: place on pad, LED colors, charge time
Page 8  — Troubleshooting + support: lot-systems.com/support
```

### Manual 2: Technical Reference (separate, engineering-only)

```
Section 1  — Full BOM (this document, Section 03)
Section 2  — PCB Gerber file index
Section 3  — Firmware architecture (Section 07)
Section 4  — API connector specification (Section 06)
Section 5  — QA test protocol (Section 09)
Section 6  — Shell CNC tolerances
Section 7  — Wireless charger spec (Section 10)
Section 8  — Regulatory compliance notes (FCC / CE path)
```

Both manuals are generated as PDF from Markdown source. Typeset in Helvetica Neue (LOT brand). Printed on uncoated white stock, saddle-stitched. Included in box alongside device + charger.

---

## SECTION 14 — SESSION COMPRESSION PROTOCOL

Each session between the C-1 device and the LOT platform is compressed before storage. This keeps the server-side event log manageable across 100 devices × high notification frequency.

### Compression Schema

```json
{
  "session_id": "c1_20260614_vm_001",
  "device_id": "COSMO-C1-000001",
  "user_id": "vm_001",
  "period_start": "2026-06-14T00:00:00Z",
  "period_end": "2026-06-14T23:59:59Z",
  "notifications_sent": 8,
  "notifications_read": 7,
  "copies_to_log": 3,
  "avg_display_duration_s": 12.4,
  "sensor_summary": {
    "avg_temp_c": 21.3,
    "avg_humidity_pct": 47,
    "avg_iaq": 38,
    "max_iaq": 92,
    "pressure_hpa": 1013
  },
  "battery_start_pct": 84,
  "battery_end_pct": 71,
  "charges_completed": 0,
  "ble_dropouts": 0,
  "firmware_version": "1.0.0"
}
```

One compressed session record per device per day. Raw notification events are retained for 7 days then purged. Session summaries retained indefinitely as part of the user's LOT behavioral record.

---

## SECTION 15 — REGULATORY COMPLIANCE ROADMAP

| Certification | Relevance | Timeline | Est. Cost |
|---------------|-----------|----------|-----------|
| FCC Part 15 (BLE radio) | Required for USA sale | After pilot run | $8,000–$15,000 |
| CE Mark (EU BLE + safety) | Required for EU sale | After FCC | $5,000–$10,000 |
| UL 2056 (Li-ion battery) | Required for USA sale | Concurrent FCC | $3,000–$6,000 |
| Qi WPC certification | Required for Qi branding | PCB design phase | $5,000 |
| RoHS compliance | Required for EU | At BOM stage (use RoHS parts) | $0 (design choice) |

**Strategy for 100-unit run:** Certifications are not required for internal beta distribution to LOT users (non-commercial, pre-market devices labeled "Engineering Sample — Not for Sale"). Full certifications pursued before commercial release at scale. All components specified above are RoHS-compliant.

---

## SECTION 16 — MANUFACTURING PARTNER: PCBWay

PCBWay handles all fabrication for this run.

| Service | URL | Notes |
|---------|-----|-------|
| PCB fabrication | pcbway.com/PCBPrototype | 2-layer, ENIG, min order 5 pcs |
| PCBA service | pcbway.com/PCBAssembly | BOM upload → auto-source from LCSC |
| CNC machining | pcbway.com/CNC | STEP upload, 316L SS supported |
| 3D printing | pcbway.com/3DPrinting | For prototype shell before CNC investment |

**Recommended order sequence:**

1. **Week 1:** Order 3D printed shells (SLA resin) for fit validation — $45 total, 5-day turnaround
2. **Week 2:** Order 5 PCBAs (prototype run) — ~$200, 10-day turnaround
3. **Week 3:** Fit-test prototype assemblies. Adjust DXF/STEP if needed.
4. **Week 4:** Order 5 CNC shells in 316L SS — ~$250, 10-day turnaround
5. **Week 5–6:** Full prototype validation (QA protocol Section 09)
6. **Week 7:** Production order: 120 PCBAs + 120 CNC shell sets

---

## SECTION 17 — FULL PROJECT ROADMAP

```
COSMO® C-1 — MASTER TIMELINE

PHASE 0 — DESIGN (Weeks 1–2)
  ├── Schematic capture (KiCad)
  ├── PCB layout (36×36 mm, 2-layer)
  ├── DXF/STEP for steel shells
  ├── Firmware skeleton (Zephyr + nRF5340)
  └── LOT API endpoints scaffolded

PHASE 1 — PROTOTYPE (Weeks 3–6)
  ├── PCBWay 3D resin shells (fit check)
  ├── PCBWay PCBA × 5 (functional check)
  ├── PCBWay CNC steel × 5 (appearance check)
  ├── BLE pairing + display test
  └── LOT API integration test (sandbox)

PHASE 2 — PILOT (Weeks 7–10)
  ├── PCBWay production: 20 full units
  ├── Firmware v1.0 complete
  ├── LOT mobile bridge app v1.0 (iOS)
  ├── Internal beta: 10 LOT users
  └── Iteration based on feedback

PHASE 3 — PRODUCTION RUN (Weeks 11–16)
  ├── PCBWay: 100 unit PCBA + CNC
  ├── Manual assembly + QA (100 units)
  ├── Firmware flashed via USB jig
  ├── Box + manual pack-out
  └── Ship to LOT founding users (Purple+ tier)

PHASE 4 — COMMERCIAL (2027+)
  ├── FCC / CE certification
  ├── Qi WPC certification
  ├── Retail-ready packaging
  └── Scale to 1,000+ unit runs

MILESTONE GATES
  ✓ Design freeze → Prototype order (Week 2)
  ✓ Prototype pass → Pilot order (Week 6)
  ✓ Pilot pass → Production order (Week 10)
  ✓ Production QA ≥ 95% yield → Ship (Week 16)
```

---

## SECTION 18 — OPEN QUESTIONS / NEXT DECISIONS

| # | Question | Owner | Target |
|---|----------|-------|--------|
| 1 | OLED vs e-Paper display — finalize display type | Vadim | Week 1 |
| 2 | iOS vs Android first for BLE bridge app | Vadim | Week 1 |
| 3 | Camera use case — confirm if needed for v1 or v2 | Vadim | Week 1 |
| 4 | Confirm LOT API auth token strategy for device registration | Dev | Week 2 |
| 5 | Steel finish: electropolish vs mechanical mirror on Side A | Vadim | Week 2 |
| 6 | Button material: flush steel vs proud polycarbonate | Vadim | Week 2 |
| 7 | Packaging: magnetic closure box vs clamshell | Vadim | Week 4 |
| 8 | First 100 users: how allocated (Purple+ auto? manual invite?) | Vadim | Week 8 |

---

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  COSMO® C-1 — HARDWARE COMPUTER                                      ║
║  ENGINEERING SPECIFICATION v1.0.0 — 14 JUNE 2026                    ║
║                                                                      ║
║  Form factor:    40 × 40 × 5 mm — 316L stainless steel, 2-part      ║
║  Display:        1.3" OLED SSD1306 — AI notifications from LOT       ║
║  Connectivity:   BLE 5.3 → phone bridge → lot-systems.com            ║
║  Sensors:        BME688 (temp/humidity/pressure/VOC/AI IAQ)          ║
║  Camera:         OV5640 5MP, MIPI CSI                                ║
║  Charging:       Qi 1.3 wireless, 5W, custom aluminum pad            ║
║  Battery:        150 mAh LiPo — ~6 days average use                 ║
║  Button:         COPY — 1 tap sends notification to LOT Log          ║
║  Run size:       100 units — PCBWay fabrication                      ║
║  BOM cost:       $84.86/unit landed                                  ║
║  Retail:         $299.00 (founding user / Purple+ tier)              ║
║  Timeline:       16 weeks design to ship                             ║
║                                                                      ║
║  Vadim Marmeladov — CEO, Owner LOT®          Founded 7 Apr 2016      ║
║  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®    Founded 1 Jul 2024    ║
║  Made in the USA | brand.lot-systems.com                             ║
║                                                                      ║
║  Inventor: Vadim Marmeladov, COSMO® CIA                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

*LOT Systems, Inc. — The soul of a good person, made portable.*
