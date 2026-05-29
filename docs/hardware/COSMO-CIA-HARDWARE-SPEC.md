<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — Hardware Specification

**Document:** COSMO-CIA-HARDWARE-SPEC.md
**Version:** 1.0.0
**Classification:** Internal — Engineering
**Prepared:** May 29, 2026
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems
**Production Run:** 100 units (Pilot)
**Manufacturer:** PCBWay (PCB + Assembly) + Custom CNC Stainless Body

---

## 1. Overview

The **COSMO® CIA** (Connected Intelligence Agent) is a palm-sized physical device that extends the LOT Systems platform into the physical world. It receives proactive, AI-generated notifications from lot-systems.com, displays them on a minimal screen, and lets the user acknowledge or log them with a single button press.

This is not a smartwatch or a phone. It is a **pager-class ambient intelligence node** — a physical extension of the LOT Memory Engine.

---

## 2. Physical Design

### 2.1 Form Factor

| Attribute        | Value                        |
|-----------------|------------------------------|
| Shape            | Square                       |
| Width            | 40 mm                        |
| Height           | 40 mm                        |
| Depth            | 5 mm                         |
| Weight (approx.) | 28–32 g                      |
| Body parts       | 2 (front shell + back shell) |

### 2.2 Body Material

| Component  | Material                  | Finish                              |
|-----------|---------------------------|-------------------------------------|
| Back shell | 304 Stainless Steel       | Mirror-polished (#8 mirror finish)  |
| Front shell| 316 Stainless Steel       | Satin brushed (sides) + cutouts     |
| Gasket     | Silicone O-ring, 0.8 mm   | IP44 dust/splash resistance         |

The two halves are assembled with M1.2 Torx screws (×4 corners, recessed flush). The device rests flat on any surface, polished side down.

### 2.3 Front Face Layout (40 × 40 mm)

```
┌────────────────────────────┐
│                            │
│   ┌────────────────────┐   │
│   │                    │   │
│   │   OLED DISPLAY     │   │
│   │   (28 × 28 mm)     │   │
│   │                    │   │
│   └────────────────────┘   │
│                            │
│        ●   CAMERA          │
│                            │
│   ════════ BUTTON ════════ │
└────────────────────────────┘
```

- **Top 70 %:** Display cutout, flush Gorilla Glass 3 cover lens (0.5 mm, adhesive bonded)
- **Center right:** 2 mm camera aperture with sapphire lens cover
- **Bottom 15 %:** Full-width capacitive/tactile Copy button, silk-printed `COPY` label

### 2.4 Back Face

Mirror-polished #8 finish, no markings except:
- Laser-etched LOT® logo (centre, 8 mm × 8 mm)
- Serial number (bottom-right, micro-engraved, 1 mm font)
- `COSMO® CIA` wordmark (top-left, micro-engraved, 1 mm font)

---

## 3. Electronics Architecture

### 3.1 Block Diagram

```
[USB-C / Qi RX] ──▶ [PMIC BQ25895] ──▶ [LiPo 150 mAh]
                                              │
                                              ▼
[BME280 Weather] ──▶                   [3.3V LDO]
[OV2640 Camera]  ──▶ [ESP32-S3-MINI-1] ──▶ [SSD1351 OLED]
[COPY Button]    ──▶                   ──▶ [Wi-Fi / BLE]
                                       ──▶ [Buzzer (passive)]
                                       ──▶ [USB-C Debug Port]
```

### 3.2 Microcontroller

| Attribute     | Value                                  |
|--------------|----------------------------------------|
| Part          | ESP32-S3-MINI-1-N8 (8 MB Flash)        |
| Vendor        | Espressif Systems                      |
| CPU           | Xtensa LX7 dual-core, 240 MHz          |
| RAM           | 512 KB SRAM + 8 MB PSRAM (MINI-1U)     |
| Wi-Fi         | 802.11 b/g/n 2.4 GHz                   |
| Bluetooth     | BLE 5.0                                |
| Module size   | 15.4 × 20.5 × 3.1 mm                   |
| Operating temp| –40 °C to +85 °C                       |

### 3.3 Display

| Attribute     | Value                                  |
|--------------|----------------------------------------|
| Part          | SSD1351 OLED, 128 × 128 px             |
| Diagonal      | 1.5 inch                               |
| Colors        | 65 K (16-bit RGB)                      |
| Interface     | SPI (4-wire)                           |
| Active area   | 26.86 × 26.86 mm                       |
| View angle    | >160° (all directions)                 |
| Module size   | 33 × 34 × 3.5 mm (including FPC)       |
| Power         | 15–20 mA typical                       |

### 3.4 Camera

| Attribute     | Value                                  |
|--------------|----------------------------------------|
| Part          | OV2640 camera module (1/4" CMOS)       |
| Resolution    | 2 MP (1632 × 1232)                     |
| Output format | JPEG / YUV422 / RGB565                 |
| Interface     | DVP (parallel) via ESP32-S3 CAMERA I/O |
| Module size   | 21 × 21 × 5 mm (fits flush)            |
| Field of view | 65° diagonal                           |
| Power         | 130 mA (active), 20 µA (standby)       |

### 3.5 Weather Sensor

| Attribute     | Value                                  |
|--------------|----------------------------------------|
| Part          | Bosch BME280                           |
| Measures      | Temperature, Humidity, Barometric Pressure |
| Accuracy (T)  | ±0.5 °C                                |
| Accuracy (H)  | ±3 % RH                                |
| Accuracy (P)  | ±1 hPa                                 |
| Interface     | I²C (address 0x76)                     |
| Package       | LCC8 2.5 × 2.5 × 0.93 mm              |
| Power         | 2.7 µA @ 1 Hz sampling                 |

### 3.6 Power Management

| Attribute        | Value                                  |
|-----------------|----------------------------------------|
| PMIC             | TI BQ25895 (USB-C + wireless input)    |
| Wireless RX coil | WR202020-4MS5-G (20 × 20 mm, 5W Qi)   |
| Qi standard      | WPC 1.3, 5W                            |
| Battery          | LiPo 401428 (4 × 14 × 28 mm, 150 mAh) |
| Charge time      | ~1.2 h from Qi, ~45 min from USB-C     |
| Standby draw     | ~1.8 mA (deep sleep + OLED off)        |
| Active draw      | ~110 mA (Wi-Fi + OLED + camera)        |
| Battery life     | ~14 h standby / ~1.5 h continuous      |

### 3.7 Button

| Attribute     | Value                                  |
|--------------|----------------------------------------|
| Type          | Capacitive touch + physical backup     |
| Part          | Omron B3FS-1000P (tactile, 4.4 × 4 mm)|
| Label         | `COPY` (silk-screen, front face)       |
| Action        | Single press → POST to LOT Log API     |
| LED indicator | None (display handles feedback)        |

### 3.8 Passive Buzzer

| Attribute  | Value                 |
|-----------|-----------------------|
| Part       | CMT-1603-SMT-TR       |
| Frequency  | 2 kHz–4 kHz range     |
| Purpose    | Notification chime    |
| Power      | 5 mW peak             |

### 3.9 Connectivity

| Interface  | Use                                           |
|-----------|-----------------------------------------------|
| Wi-Fi      | Primary LOT API connection (HTTPS + WSS)      |
| BLE 5.0    | Initial provisioning via LOT mobile app       |
| USB-C      | Firmware flashing, debug UART, backup charge  |
| Qi         | Daily wireless charging                       |

---

## 4. PCB Specification

| Attribute         | Value                           |
|------------------|---------------------------------|
| Layers            | 4 (signal / GND / power / signal)|
| Dimensions        | 36 × 36 mm (fits inside body)   |
| Thickness         | 0.8 mm                          |
| Copper weight     | 1 oz outer, 0.5 oz inner        |
| Surface finish    | ENIG (gold fingers on camera FPC)|
| Min trace/space   | 4/4 mil                         |
| Min drill         | 0.2 mm (0.15 mm laser vias)     |
| Manufacturer      | PCBWay (4-layer HASL/ENIG)      |
| Quantity (pilot)  | 150 PCBs (100 production + 50 test)|
| Assembly          | PCBWay SMT assembly service     |

---

## 5. Power & Charging

### 5.1 Wireless Charger Dock

A matching 40 × 40 × 8 mm charging puck is included with each unit:

| Attribute     | Value                         |
|--------------|-------------------------------|
| Coil          | TX coil 36 × 36 mm            |
| Input         | USB-C PD 5V/2A                |
| Output        | 5W Qi to device               |
| IC            | STWBC-EP (STMicro)            |
| Body material | Matching stainless steel      |
| Magnet align  | 4× N52 neodymium (1.5 mm dia.)|
| Indicator LED | Single LED (green = charging) |

The device snaps magnetically onto the dock, face up. No cable required for daily use.

---

## 6. Notification System

The device polls or maintains a persistent WebSocket connection to:

```
wss://lot-systems.com/api/device/notifications
```

Notifications are displayed as:

```
┌────────────────────────────┐
│  LOT®                      │
│                            │
│  ☀ Coffee time!            │
│  9:45 AM                   │
│                            │
│  ─────────────────         │
│  COPY to Log               │
└────────────────────────────┘
```

Notification sources:
- Memory Engine reminders
- QOS state changes ("Recovery mode entered")
- Scheduled self-care prompts
- Weather-based suggestions
- Custom LOT site messages

---

## 7. COPY Button Behavior

1. User receives a notification on device screen
2. User presses `COPY` button
3. Device POSTs to `https://lot-systems.com/api/device/log`
4. Site Log tab shows: `[COSMO CIA] "Coffee time!" acknowledged — 9:45 AM`
5. Device screen briefly shows `✓ Logged` confirmation

---

## 8. Environmental & Compliance

| Attribute      | Value                          |
|---------------|--------------------------------|
| IP rating      | IP44 (dust + splash proof)     |
| Operating temp | 0 °C to 50 °C                  |
| Storage temp   | –20 °C to 60 °C                |
| Certifications | FCC (Part 15), CE, RoHS        |
| Battery cert   | UL 2054                        |
| Wi-Fi cert     | Wi-Fi Alliance (via ESP32-S3)  |

---

## 9. Production Run

| Parameter       | Value                           |
|----------------|---------------------------------|
| Pilot quantity  | 100 units                       |
| PCBs ordered    | 150 (50 surplus for testing)    |
| Body CNC (SS)   | 100 × front + 100 × back shells |
| Charger docks   | 100 units                       |
| Packaging       | Custom LOT® box, black          |
| Target ship     | Q4 2026                         |

---

## 10. Dimensions Summary

```
Top view (front face):
┌──────────────────────────────────────┐
│         40 mm                        │
│  ┌──────────────────────────────┐    │
│  │  Camera  ●                   │ 40 │
│  │  ┌──────────────────────┐    │ mm │
│  │  │   OLED 28 × 28       │    │    │
│  │  │   128 × 128 px       │    │    │
│  │  └──────────────────────┘    │    │
│  │  ════ COPY BUTTON ═══════    │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘

Side view:
┌──────────────────────────────────────┐
│ ≈≈≈≈≈ Front shell (SS316) ≈≈≈≈≈≈≈≈  │
│ ─────────── PCB (0.8 mm) ──────────  │ 5 mm
│ ─── Qi coil + battery layer ──────  │
│ ═══════ Back shell (SS304) ════════  │
└──────────────────────────────────────┘
```

---

*COSMO® CIA — Physical intelligence for the LOT ecosystem.*
*© 2026 LOT Systems, Inc. All rights reserved.*
