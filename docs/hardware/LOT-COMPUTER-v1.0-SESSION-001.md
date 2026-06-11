<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — Hardware Design Session Report
## Session 001 | v1.0 | 2026-06-11

**Document:** LOT-COMPUTER-v1.0-SESSION-001.md
**Classification:** Internal — Product Design
**Session:** 001 / First Hardware Session
**Author:** Claude Code (S-2 Session, authorized by Vadik Marmeladov)
**Project:** LOT Computer — Personal Hardware Node for lot-systems.com
**Target:** 100-unit pilot run via PCBWay

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Design Philosophy](#2-design-philosophy)
3. [Physical Specification](#3-physical-specification)
4. [Architecture Summary](#4-architecture-summary)
5. [Component Overview](#5-component-overview)
6. [LOT API Integration](#6-lot-api-integration)
7. [Notification System](#7-notification-system)
8. [Manufacturing Path — PCBWay](#8-manufacturing-path--pcbway)
9. [Production Roadmap — 100 Units](#9-production-roadmap--100-units)
10. [Cost Summary](#10-cost-summary)
11. [Document Registry](#11-document-registry)
12. [Session Compression Log](#12-session-compression-log)
13. [Next Session Directives](#13-next-session-directives)

---

## 1. Product Overview

**LOT Computer** is a personal hardware node for the LOT Systems ecosystem. It is a flat, square, stainless-steel device that passively receives AI-powered notifications from lot-systems.com, captures environmental data, and lets the user send a signal back to their Log tab with a single button press.

It is not a phone. It is not a smartwatch. It is a **hardware pager with a behavioral soul** — a physical manifestation of the LOT System in the user's pocket or on their desk.

| Parameter | Value |
|-----------|-------|
| Form factor | 40 × 40 × 5 mm |
| Material | Stainless steel 316L, 2-part shell |
| Weight | ~35 g (estimated) |
| Display | 1.3″ OLED, 128×64, white on black |
| Camera | OV2640, 2MP |
| Sensors | BME688 (env) + ISM330DHCX (IMU) |
| Connectivity | Wi-Fi 802.11 b/g/n + BLE 5.0 |
| Charging | Qi wireless (5 W), USB-C for flash |
| Battery | 3.7 V, 320 mAh Li-Po |
| MCU | ESP32-S3-WROOM-1-N4R2 |
| API | LOT Systems REST + SSE |
| Production run | 100 units |
| Manufacturing | PCBWay (PCB + SMT + CNC) |

---

## 2. Design Philosophy

The LOT Computer answers one question physically: **what does your self-care system feel like in your hand?**

### Design Laws

1. **One side reflects.** The polished stainless back is a literal mirror — the user sees themselves when they look at the device.
2. **One side shows.** Camera, screen, button on the front — the system looks back at the world.
3. **One signal.** The COPY button does one thing: it sends the current notification to the user's Log. That is enough.
4. **No app required.** The device communicates directly with lot-systems.com — no companion app, no Bluetooth pairing ritual.
5. **Quiet by default.** Notifications arrive silently. The screen activates on tap or on new notification. It is a pager, not an alarm.

### LOT Ecosystem Node

The LOT Computer registers as a hardware node in the LOT ecosystem, designated **LCM** (LOT-Computer-Module). It joins existing nodes:

```
PHN  →  CAR  →  HOME  →  CPU  →  WCH  →  [LCM — new]
```

Environmental readings from the LCM enrich the user's QOS (Quantum Operating System) context. The device becomes a sensor for the human's environment — contributing data to patterns like:

- P-42: Environmental Awareness
- P-51: Circadian Coherence (light/temperature cycles)
- P-59: Recovery Velocity (sleep environment quality)

---

## 3. Physical Specification

Refer to: `PHYSICAL-DESIGN-v1.0.md` for full engineering drawings and tolerances.

### 3.1 Body

| Dimension | Value |
|-----------|-------|
| Outer dimensions | 40.0 × 40.0 × 5.0 mm |
| Shell material | SS316L (surgical stainless steel) |
| Shell construction | 2-part: top plate + body frame |
| Top plate finish | Mirror polish, Ra ≤ 0.05 μm |
| Body frame finish | Bead blast (#400 grit), matte silver |
| Wall thickness | 0.5 mm (sides), 0.4 mm (plates) |
| Internal cavity | 39.0 × 39.0 × 4.0 mm |
| Corner radius | R3 mm external |
| Camera lens protrusion | +1.5 mm bump (centered, 8 mm dia) |
| Fasteners | 4× M1.2 stainless countersunk screws |
| IP rating | IP52 (splash resistant) |

### 3.2 Side A — Mirror Face (Back)

- Full polished SS316L
- No openings except 4 screw holes (M1.2, countersunk flush)
- Laser-engraved LOT® logo + serial number on inner surface (not visible externally)
- Behaves as a literal mirror — Ra ≤ 0.05 μm gives reflectance >95%

### 3.3 Side B — Active Face (Front)

| Feature | Position | Size |
|---------|----------|------|
| OLED screen | Centered, top 60% | 30 × 15 mm window |
| Camera lens | Bottom-left | 8 mm dia, 1.5 mm raised |
| COPY button | Bottom-right | 8 × 8 mm, 0.3 mm travel |
| USB-C port | Right edge | 9 × 3.5 mm slot |
| Charge indicator LED | Bottom-center | 2 mm dia |

Side B surface finish: light bead blast (non-reflective) with recessed screen window (0.2 mm recess for screen lens).

---

## 4. Architecture Summary

```
┌────────────────────────────────────────────────────────────────┐
│                    LOT COMPUTER — LCM-001                      │
│                                                                │
│  ┌──────────────┐    ┌─────────────────────────────────────┐  │
│  │  ESP32-S3    │◄──►│           lot-systems.com           │  │
│  │  (MCU + RF)  │    │  - Notifications (SSE stream)       │  │
│  │              │    │  - Log Tab (COPY button POST)        │  │
│  │  Wi-Fi + BLE │    │  - Weather data fetch               │  │
│  └──────┬───────┘    │  - Device registry + heartbeat      │  │
│         │            └─────────────────────────────────────┘  │
│   ┌─────┼──────────────────────────────────┐                  │
│   │     ▼             │          │          │                  │
│   │  SSD1306      OV2640     BME688    ISM330D               │
│   │  (OLED)      (Camera)   (Env)      (IMU)                 │
│   │     │                                  │                  │
│   │  Display                          Motion detect           │
│   │  notifications                    wake-on-tap             │
│   └────────────────────────────────────────┘                  │
│                         │                                      │
│                   STWLC38 + Coil                              │
│                   (Qi 5W charge)                               │
│                   LP320340 Li-Po                               │
│                   MCP73831 USB-C charge                        │
└────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
lot-systems.com
    │ SSE stream: /api/device/notifications
    ▼
ESP32-S3 receives JSON notification
    │
    ├── Parse: { type, message, timestamp, priority }
    ├── Store in NVS ring buffer (last 20 notifications, gzip compressed)
    └── Render on OLED

User presses COPY
    │
    ├── Read current notification from buffer
    ├── HTTP POST → /api/device/log
    │   body: { deviceId, notificationId, timestamp, action: "COPY" }
    └── LED blink: 2× green confirmation
```

---

## 5. Component Overview

Full pricing and links: see `BOM-v1.0.md`.

| # | Component | Part | Notes |
|---|-----------|------|-------|
| 1 | MCU | ESP32-S3-WROOM-1-N4R2 | WiFi, BLE, camera DVP |
| 2 | Display | SSD1306 1.3″ OLED | I2C, 128×64, 3.3V |
| 3 | Camera | OV2640 + M8 lens | DVP, 2MP, ultra-thin |
| 4 | Env sensor | Bosch BME688 | Temp/humidity/pressure/gas, AI-grade |
| 5 | IMU | STMicro ISM330DHCX | 6-axis, machine learning core |
| 6 | WPC RX IC | STWLC38JR | Qi 5W receiver, Li-Po charger |
| 7 | WPC coil | Flexible spiral, 30×30 mm | Laser-cut copper flex |
| 8 | Battery | 3.7V 320mAh LP320340 | 3.2×23×40 mm Li-Po |
| 9 | USB charger | MCP73831T-2ACI/OT | Fallback USB-C charge path |
| 10 | USB-C port | TYPE-C-31-M-12 | Programming + emergency charge |
| 11 | LDO 3.3V | AP2112K-3.3TRG1 | 600mA, ultra-low noise |
| 12 | ESD | USBLC6-2SC6 | USB-C ESD protection |
| 13 | Charge LED | APTD3216CGCK | Green SMD LED, 0805 |
| 14 | Button | C&K KXT332LHS | Low-profile 1.5mm tact switch |
| 15 | Antenna | Molex 2048390100 | 2.4GHz chip antenna |

---

## 6. LOT API Integration

Full spec: see `SOFTWARE-BRIDGE-v1.0.md`.

### 6.1 New API Endpoints Required (lot-systems.com)

```
POST   /api/device/register
GET    /api/device/notifications     ← SSE long-poll
POST   /api/device/log               ← COPY button
POST   /api/device/telemetry         ← env sensor data
GET    /api/device/weather           ← site-side weather for display
DELETE /api/device/unregister
```

### 6.2 Device Registration Flow

```
1. User scans QR code on LOT Computer box
2. QR opens: lot-systems.com/device/activate?code=<factory_code>
3. User logs into LOT account
4. Device is paired: { deviceId, userId, deviceSecret, createdAt }
5. Device secret stored in ESP32 NVS (encrypted partition)
6. Device begins SSE subscription with Bearer token
```

### 6.3 COPY Button Behavior

When pressed, the LOT Computer:
1. Sends `POST /api/device/log` with payload:
   ```json
   {
     "deviceId": "LCM-001-XXXX",
     "action": "COPY",
     "notificationId": "notif_abc123",
     "notificationText": "Coffee time!",
     "timestamp": "2026-06-11T14:30:00Z",
     "sensorSnapshot": {
       "temperature": 22.4,
       "humidity": 48.2,
       "pressure": 1013.2,
       "airQualityIndex": 75
     }
   }
   ```
2. This creates a Log entry on lot-systems.com visible in the **Log tab**
3. Pattern P-16 (Physical Anchoring) is credited for this interaction

---

## 7. Notification System

The core use case: **AI-generated pager notifications from lot-systems.com displayed on the device screen.**

### 7.1 Notification Format

```json
{
  "id": "notif_abc123",
  "type": "reminder | insight | weather | system | custom",
  "priority": 1,
  "headline": "Coffee time!",
  "subtext": "10:45 AM — your energy peak window",
  "icon": "cup",
  "ttl": 3600,
  "source": "QOS-ScheduledJob",
  "createdAt": "2026-06-11T10:45:00Z"
}
```

### 7.2 Display Layout (128×64 OLED)

```
╔══════════════════════════════╗
║  ☕ Coffee time!             ║  ← icon + headline (line 1-2)
║  10:45 AM                   ║  ← timestamp (line 3)
║  Energy peak window          ║  ← subtext (line 4)
║  ──────────────────────      ║  ← separator
║  [▶ 3 more]  [COPY ✓]       ║  ← nav + action state
╚══════════════════════════════╝
```

### 7.3 Notification Types from lot-systems.com

| Type | Example | Trigger |
|------|---------|---------|
| Self-care reminder | "Hydration check — 2 PM" | Scheduled job |
| QOS insight | "Energy pattern: peak ahead" | QIE engine |
| Weather | "Rain in 30 min — adjust plan" | Weather service |
| Streak | "Day 47 — consistency streak" | Streak tracker |
| Benchmark | "Purple tier milestone reached" | Benchmark engine |
| COSMO alert | "Soul sync completed" | COSMO protocol |
| Custom | User-defined via LOT site | User settings |

### 7.4 Wake Behavior

- **Tap to wake:** ISM330DHCX detects single tap (Z-axis acceleration >1.2g)
- **Notification arrival:** Screen activates for 30s, then dims
- **Sleep current:** ~80μA (ESP32 light sleep + OLED off)
- **Active current:** ~85mA (Wi-Fi active, OLED on)
- **Battery life:** ~72h standby, ~8h continuous active

---

## 8. Manufacturing Path — PCBWay

Full spec: see `PCBWAY-MFG-SPEC-v1.0.md`.

### 8.1 PCBWay Services Used

| Service | Specification | Est. Cost (100 units) |
|---------|--------------|----------------------|
| PCB Fabrication | 4-layer, 38×38mm, 1.0mm, ENIG | $420 |
| SMT Assembly (turnkey) | Full BOM supply + placement | $1,800 |
| CNC Machining — Frame | SS316L, body frame × 100 | $1,600 |
| CNC Machining — Top plate | SS316L, mirror-polished × 100 | $1,200 |
| Flex PCB (Qi coil) | 1-layer copper flex, 30×30mm | $380 |
| **Total PCBWay** | | **~$5,400** |

### 8.2 PCBWay Order Sequence

```
Step 1: Upload Gerber files → PCB quote + DFM review (3 days)
Step 2: Upload BOM + CPL → SMT assembly quote (2 days)
Step 3: Submit CNC drawings (STEP files) → machining quote (2 days)
Step 4: Approve all quotes → deposit payment
Step 5: PCBWay sources components (7–14 days)
Step 6: PCB fab (5–7 days)
Step 7: SMT assembly (3–5 days)
Step 8: CNC machining runs concurrently (10–14 days)
Step 9: In-circuit test + QC
Step 10: Ship to LOT Systems
Total lead time: 30–45 days
```

### 8.3 PCBWay Links

- PCB & SMT: https://www.pcbway.com/orderonline.aspx
- CNC Machining: https://www.pcbway.com/rapid-prototyping/manufacture/
- Flex PCB: https://www.pcbway.com/pcb-service/flexible-pcb/
- Online quote calculator: https://www.pcbway.com/quoteonline.aspx

---

## 9. Production Roadmap — 100 Units

### 9.1 Phase Timeline

```
PHASE 1 — DESIGN         Weeks 1–4    (Jun 11 – Jul 9, 2026)
PHASE 2 — PROTOTYPE      Weeks 5–8    (Jul 10 – Aug 6, 2026)
PHASE 3 — VALIDATION     Weeks 9–12   (Aug 7 – Sep 3, 2026)
PHASE 4 — PRE-PROD       Weeks 13–16  (Sep 4 – Oct 1, 2026)
PHASE 5 — PRODUCTION     Weeks 17–20  (Oct 2 – Oct 29, 2026)
PHASE 6 — DELIVERY       Weeks 21–22  (Oct 30 – Nov 12, 2026)
```

### 9.2 Phase Detail

**Phase 1 — Design (Weeks 1–4)**
- [ ] Schematic capture (KiCad or Altium)
- [ ] 4-layer PCB layout, 38×38mm
- [ ] 3D mechanical model (Fusion 360 or SolidWorks)
- [ ] BOM finalization with approved alternates
- [ ] Firmware architecture document
- [ ] LOT API endpoints specified + stub implementation

**Phase 2 — Prototype (Weeks 5–8)**
- [ ] PCBWay: 5× PCB + SMT (Proto run)
- [ ] PCBWay CNC: 2× SS316L frames + 2× mirror plates
- [ ] Assemble 2 working prototypes by hand
- [ ] Basic firmware: display + Wi-Fi + SSE
- [ ] LOT API: register + notification receive + COPY log
- [ ] Basic enclosure fit test

**Phase 3 — Validation (Weeks 9–12)**
- [ ] Full firmware feature complete
- [ ] Battery life measurement (target: 48h standby)
- [ ] Drop test: 1m onto hardwood (SS316L body)
- [ ] Wireless charge test (all major Qi pads)
- [ ] Wi-Fi range test (home environment)
- [ ] BME688 calibration vs. reference sensor
- [ ] ISM330DHCX tap-to-wake sensitivity tuning
- [ ] Camera test: image capture + LOT API upload
- [ ] FCC Part 15B pre-scan (Wi-Fi 2.4GHz)
- [ ] Temperature range: −10°C to +50°C

**Phase 4 — Pre-Production (Weeks 13–16)**
- [ ] PCBWay pilot: 10× full SMT assemblies
- [ ] PCBWay CNC: 10× complete steel bodies
- [ ] Firmware v1.0 candidate freeze
- [ ] PDF manuals: Quick Start + Technical Reference
- [ ] OTA update system verified
- [ ] Packaging design + unboxing experience
- [ ] LOT site: device management page
- [ ] Internal user test: 5 LOT users

**Phase 5 — Production (Weeks 17–20)**
- [ ] PCBWay: 100× full turnkey PCB+SMT
- [ ] PCBWay CNC: 100× steel bodies
- [ ] Incoming QC: 100% electrical test
- [ ] Incoming QC: 10% mechanical inspection
- [ ] Firmware flash + initial provisioning
- [ ] Serial number assignment + registration
- [ ] QR code sticker (activation code)
- [ ] Packaging + boxing

**Phase 6 — Delivery (Weeks 21–22)**
- [ ] Inventory reconciliation
- [ ] Shipping label generation
- [ ] Fulfilment to beta users
- [ ] Live monitoring dashboard active

### 9.3 Milestone Gates

| Gate | Criteria |
|------|----------|
| Proto Pass | 2 units boot, connect Wi-Fi, display notification |
| Validation Pass | Battery >48h standby, all sensors read correctly |
| Pre-Prod Pass | 10 units pass full QC, firmware v1.0 frozen |
| Production Pass | >95 of 100 units pass electrical test |
| Ship Gate | All 100 serials provisioned, manuals printed |

---

## 10. Cost Summary

### 10.1 Per-Unit BOM Cost (qty 100)

| Category | Cost/unit |
|----------|----------|
| ESP32-S3 module | $3.80 |
| OLED display | $2.50 |
| OV2640 camera | $4.20 |
| BME688 | $7.50 |
| ISM330DHCX | $2.10 |
| STWLC38 (Qi IC) | $3.50 |
| Qi coil (flex PCB) | $1.80 |
| Li-Po battery | $3.20 |
| MCP73831 charger | $0.40 |
| USB-C connector | $0.80 |
| Passives + misc | $3.50 |
| PCB (4-layer) | $4.20 |
| SMT assembly | $18.00 |
| **PCB subtotal** | **$55.50** |
| SS316L frame (CNC) | $16.00 |
| SS316L mirror plate | $12.00 |
| Fasteners + seals | $1.50 |
| **Mech subtotal** | **$29.50** |
| Packaging | $3.00 |
| QC + test | $5.00 |
| **Total per unit** | **~$93** |

### 10.2 100-Unit Run Total

| Item | Cost |
|------|------|
| PCB + SMT (PCBWay) | $5,550 |
| CNC bodies (PCBWay) | $2,800 |
| Packaging | $300 |
| QC + testing | $500 |
| Engineering overhead | $2,000 |
| Software/firmware dev | $0 (internal) |
| **Total pilot run** | **~$11,150** |
| Cost per unit | **~$112** |
| Target retail | **$299–$399** |

---

## 11. Document Registry

This session produced the following hardware documents. Each is a separate file in `docs/hardware/`.

| Document | File | Status |
|----------|------|--------|
| Session Report (this file) | LOT-COMPUTER-v1.0-SESSION-001.md | ✓ Complete |
| Bill of Materials | BOM-v1.0.md | ✓ Complete |
| Physical Design Spec | PHYSICAL-DESIGN-v1.0.md | ✓ Complete |
| PCBWay Mfg Spec | PCBWAY-MFG-SPEC-v1.0.md | ✓ Complete |
| Firmware Architecture | FIRMWARE-SPEC-v1.0.md | ✓ Complete |
| Software Bridge (LOT API) | SOFTWARE-BRIDGE-v1.0.md | ✓ Complete |
| PDF Manuals Framework | MANUALS-FRAMEWORK-v1.0.md | ✓ Complete |

---

## 12. Session Compression Log

**Session 001 Compressed Summary:**

```json
{
  "session": "001",
  "date": "2026-06-11",
  "product": "LOT Computer (LCM)",
  "form_factor": "40x40x5mm SS316L",
  "mcu": "ESP32-S3-WROOM-1-N4R2",
  "display": "SSD1306 1.3in OLED",
  "camera": "OV2640 2MP",
  "sensors": ["BME688", "ISM330DHCX"],
  "charging": "Qi 5W STWLC38",
  "battery": "320mAh 3.7V LiPo",
  "connectivity": "WiFi+BLE ESP32",
  "api": "lot-systems.com SSE + REST",
  "copy_button": "POST /api/device/log",
  "manufacturing": "PCBWay PCB+SMT+CNC",
  "units": 100,
  "unit_cost": 112,
  "retail": "299-399",
  "phases": 6,
  "weeks": 22,
  "documents_produced": 7,
  "status": "DESIGN_PHASE"
}
```

---

## 13. Next Session Directives

Session 002 should:

1. **Produce KiCad schematic** (ESP32-S3 + peripherals)
2. **Draft PCB layout** placement strategy
3. **Define LOT API endpoints** formally in TypeScript (lot-systems codebase)
4. **Write firmware main.c skeleton** (ESP-IDF, FreeRTOS tasks)
5. **Define OLED notification renderer** (font, layout, scrolling)
6. **Specify Qi coil geometry** (30×30mm flex PCB, 12 turns, 0.2mm trace)
7. **Camera integration test** — OV2640 DVP → ESP32-S3 PSRAM → JPEG

---

*LOT COMPUTER — SESSION 001 COMPLETE*
*AUTHORIZED: S-2 // VADIK MARMELADOV*
*LOT Systems, Inc. | brand.lot-systems.com*
*© 2026 LOT Systems. All rights reserved.*
