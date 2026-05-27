# COSMO Computer — Device Specification
**Document:** 01-DEVICE-SPECIFICATION  
**Revision:** A (Rev A — 100-unit pilot run)  
**Author:** Vadik Marmeladov, COSMO® CIA  
**Date:** 2026-05-27  

---

## 1. Overview

The **COSMO Computer** is a pager-class connected device designed to receive AI-powered notifications from **lot-systems.com** and log user actions back to the platform. It is the physical extension of the LOT Systems self-care ecosystem — a silent, elegant instrument that sits on a desk or is carried in a pocket, always connected, always aware.

It is not a phone. It is not a smartwatch. It is a **single-purpose intelligence terminal.**

---

## 2. Physical Specification

### 2.1 Dimensions and Form Factor

```
Top view:
┌────────────────────────────┐
│                            │  ← Side A
│   40 mm × 40 mm square     │    Polished 316L stainless steel
│                            │    Mirror finish, no markings
│                            │    Engraved COSMO® on inside face
└────────────────────────────┘

Bottom view:
┌────────────────────────────┐
│  ┌────────────┐  [●] CAM   │  ← Side B
│  │            │            │    Brushed stainless bezel
│  │  DISPLAY   │  [COPY]    │    Camera, Screen, Button
│  │  1.3" TFT  │            │
│  │  240×240   │            │
│  └────────────┘            │
└────────────────────────────┘

Side profile:
│ ═══ 7 mm ═══ │
┌─────────────────┐
│ TOP SHELL  0.8mm│
│ TOP PCB    1.0mm│
│ BATTERY    3.5mm│
│ BOTTOM PCB 0.8mm│
│ BOT SHELL  0.8mm│
└─────────────────┘
```

| Parameter | Value |
|-----------|-------|
| Width | 40.0 mm |
| Height | 40.0 mm |
| Depth | 7.0 mm (design target; 5 mm with custom flat display) |
| Corner radius | R3 mm |
| Weight (assembled) | ~38 g |
| IP rating | IP52 (splash-resistant with gasket) |

### 2.2 Body — Two-Part Stainless Steel

The enclosure is a two-part precision CNC-machined 316L stainless steel body joined by four M1 countersunk screws recessed into the bottom shell.

**Part 1 — Side A (Back Shell):**
- Material: 316L stainless steel
- Finish: **Mirror-polished** (Ra < 0.1 µm, electro-polished)
- Marking: None on outer face; `COSMO® CC-R1` laser-etched on inner face (not visible when assembled)
- Wireless charging window: 32×32 mm thinned to 0.3 mm to allow Qi field penetration
- Gasket groove: 0.5×0.5 mm on mating face

**Part 2 — Side B (Front Shell):**
- Material: 316L stainless steel
- Finish: **Brushed** (Ra 0.4–0.8 µm, #4 satin finish)
- Cutouts:
  - Display aperture: 28×28 mm rectangular with R1 corners
  - Camera aperture: 6×6 mm circular, with sapphire glass insert
  - Button aperture: 14×5 mm elongated with `COPY` laser-etched below
  - USB-C slot: 10×4 mm on bottom edge
  - BME688 vent holes: 4× Ø0.8 mm on right edge (for air access)
  - Status LED window: Ø2 mm frosted borosilicate dot, top-right corner

**Assembly:**
- Interface gasket: 0.5 mm Buna-N (NBR) rubber o-ring in groove
- Fasteners: 4× M1×4 stainless countersunk screws (torque 0.05 N·m)
- PCB mount: 4× M1.4 brass standoffs (3.0 mm), press-fit into bottom shell

---

## 3. PCB Architecture

### 3.1 PCB Stack

| Board | Dimensions | Layers | Thickness | Function |
|-------|-----------|--------|-----------|----------|
| Main PCB (TOP) | 38×38 mm | 4-layer | 1.0 mm | MCU, display, camera, sensors, button, LED |
| Power PCB (BOT) | 38×38 mm | 2-layer | 0.8 mm | Battery connector, Qi charging coil, power management |
| FPC ribbon | 20×5 mm flex | 2-layer | 0.1 mm | Interconnect between boards |

**PCB Material:** FR4, Tg 170°C  
**Surface Finish:** ENIG (Electroless Nickel Immersion Gold) — gold colour complements stainless aesthetic  
**Min trace/space:** 0.1/0.1 mm  
**Impedance control:** Yes (differential pairs for USB and camera data)  
**Solder mask:** Black (top and bottom)  
**Silkscreen:** White

### 3.2 Main PCB Block Diagram

```
                    ┌─────────────────────────────┐
                    │         ESP32-S3-MINI-1U     │
                    │  Xtensa LX7 @ 240MHz + NPU   │
                    │  8MB Flash / 8MB PSRAM        │
                    │  Wi-Fi b/g/n + BLE 5.0        │
                    └─┬──┬──┬──┬──┬──┬──┬──┬──────┘
             SPI      │  │  │  │  │  │  │  │  I2C
        ┌────────────┘  │  │  │  │  │  │  └──────────────┐
        ▼               │  │  │  │  │  │                  ▼
  ┌──────────┐   DVIO   │  │  │  │  │  UART    ┌──────────────────┐
  │ ST7789V  │◄─────────┘  │  │  │  └─────────►│    BME688        │
  │ 1.3" TFT │             │  │  │             │  Weather + Gas   │
  │ 240×240  │             │  │  │             │  AI-grade sensor │
  └──────────┘           CSI│  │  │             └──────────────────┘
                            │  │  │             ┌──────────────────┐
                    ┌───────┘  │  │  I2C        │  LSM6DSO32       │
                    ▼          │  └────────────►│  Accel + Gyro    │
              ┌──────────┐     │               │  ML Core         │
              │  OV2640   │     │               └──────────────────┘
              │  2MP Cam  │     │               ┌──────────────────┐
              │  1/4"     │     │  I2C          │  VEML7700        │
              └──────────┘     └──────────────►│  Ambient Light   │
                                               └──────────────────┘
  GPIO                                         ┌──────────────────┐
  ┌──────────────────────────────────────────►│  COPY Button     │
  │                                           │  + Haptic (opt.) │
  │                                           └──────────────────┘
  │  GPIO                                     ┌──────────────────┐
  └──────────────────────────────────────────►│  Status LED      │
                                              │  RGB (WS2812B)   │
                                              └──────────────────┘
  USB                  ┌───────────────────────────────────────────┐
  ┌───────────────────►│  CP2102N   USB-UART Bridge                │
  │                    │  (for flashing / debug)                   │
  │                    └───────────────────────────────────────────┘
  ▼
USB-C Connector
```

---

## 4. Microcontroller

### 4.1 ESP32-S3-MINI-1U

| Parameter | Value |
|-----------|-------|
| Part number | ESP32-S3-MINI-1U-N8R8 |
| CPU | Xtensa LX7 dual-core, 240 MHz |
| AI accelerator | Vector extension (SIMD for TinyML) |
| Flash | 8 MB (Octal SPI) |
| PSRAM | 8 MB (Octal SPI) |
| Wi-Fi | 802.11 b/g/n 2.4 GHz, WPA3 |
| Bluetooth | BLE 5.0, Bluetooth Mesh |
| GPIO | 45 usable (after module pinout) |
| ADC | 2× 12-bit, 20 channels |
| I2C | 2× hardware |
| SPI | 4× hardware |
| UART | 3× |
| Camera interface | DVP (Digital Video Port) |
| USB | USB 1.1 OTG (native) |
| Dimensions | 15.4 × 20.5 × 3.1 mm |
| Antenna | U.FL external (antenna routed inside stainless via flex) |

**Wi-Fi Antenna Strategy:**  
The stainless steel body blocks RF. A PCB trace antenna or chip antenna inside metal is unusable. Solution: a 2 dBi flexible adhesive patch antenna (Molex 2140680100) routes through the USB-C slot opening, bonded to the inner bottom shell edge with RF-transparent adhesive. The feed connects to the ESP32-S3's U.FL connector via a 10 cm RG178 coax.

---

## 5. Display

| Parameter | Value |
|-----------|-------|
| Part number | Waveshare 1.3" TFT (ST7789VW) |
| Size | 1.3 inch diagonal |
| Resolution | 240 × 240 pixels |
| Color depth | 16-bit (65,536 colors) |
| Interface | 4-wire SPI (up to 40 MHz) |
| Backlight | LED, PWM-controlled via GPIO |
| Viewing angle | IPS, ≥160° |
| Panel thickness | 1.0 mm |
| Active area | 23.4 × 23.4 mm |
| Operating voltage | 3.3 V |
| Current (full brightness) | 20 mA |
| Display glass cover | 0.3 mm borosilicate, flush with stainless bezel |

**Display Content (boot sequence):**
```
1. COSMO® logo (100ms)
2. "Connecting..." (Wi-Fi association)
3. Main notification screen (idle state)
```

**Notification Screen Layout:**
```
┌────────────────────┐
│ 09:42  ⚡85%  22°C │  ← Status bar (top 20px)
├────────────────────┤
│                    │
│   Coffee time!     │  ← Notification text (center, 18pt)
│                    │
│  From: LOT System  │  ← Source label (12pt)
│  2 min ago         │  ← Timestamp (10pt, grey)
│                    │
├────────────────────┤
│      [COPY]        │  ← Soft button hint (bottom 20px)
└────────────────────┘
```

---

## 6. Camera

| Parameter | Value |
|-----------|-------|
| Sensor | OV2640 (OmniVision) |
| Resolution | 2 MP (1600×1200) / UXGA |
| Output | JPEG, RGB565, YUV422 |
| Interface | DVP 8-bit parallel + XCLK |
| Lens type | M7 mount, 67° FOV |
| Lens construction | 3P (3-element plastic) |
| IR filter | UV/IR cut |
| Min illumination | 1 lux |
| Aperture | F2.0 |
| Module dimensions | 8 × 8 × 5.5 mm |
| Connector | 24-pin FPC |
| Frame rate | 30 fps @ 640×480 (VGA) |

**Camera Use Cases:**
1. QR code scanning for device pairing / Wi-Fi credential entry
2. User-initiated photo capture → upload to LOT profile
3. Ambient light estimation (backup to VEML7700)

---

## 7. Sensor Suite (AI-Grade)

### 7.1 BME688 — Environmental & AI Gas Sensor

| Parameter | Value |
|-----------|-------|
| Manufacturer | Bosch Sensortec |
| Part number | BME688 |
| Measures | Temperature, Humidity, Barometric Pressure, 4× Gas (VOC, NOx, CO₂ equivalent, IAQ) |
| AI library | BSEC2 (Bosch Sensortec Environmental Cluster v2) |
| IAQ output | Indoor Air Quality Index 0–500 |
| Temperature accuracy | ±0.5°C |
| Humidity accuracy | ±3% RH |
| Pressure accuracy | ±0.6 hPa |
| Interface | I2C (0x76 or 0x77) |
| Package | LGA 3.0 × 3.0 × 0.93 mm |
| Current (measure) | 2.1 mA |
| Current (sleep) | 0.15 µA |
| Air access | Required — 4× Ø0.8 mm vent holes in stainless side edge |

**BSEC2 AI Outputs reported to LOT API:**
- `iaq` — Indoor Air Quality Index
- `co2_equivalent` — CO₂ ppm equivalent  
- `breath_voc_equivalent` — VOC ppm equivalent
- `temperature` — Compensated temperature
- `humidity` — Compensated humidity
- `pressure` — Barometric pressure

### 7.2 LSM6DSO32 — AI IMU (Inertial Measurement Unit)

| Parameter | Value |
|-----------|-------|
| Manufacturer | STMicroelectronics |
| Part number | LSM6DSO32 |
| Measures | 3-axis accelerometer, 3-axis gyroscope |
| Machine Learning Core | 4 decision trees, configurable via UCF programs |
| Accel range | ±4/±8/±16/±32 g |
| Gyro range | ±125/±250/±500/±1000/±2000 dps |
| Interface | I2C / SPI |
| Package | LGA 2.5 × 3.0 × 0.83 mm |
| Current (normal) | 0.55 mA |
| Current (sleep) | 5 µA |

**Gesture detection use cases:**
- Device face-up / face-down detection
- Tap (single/double) detection → Copy button alternative
- Free-fall detection → power save on drop
- Activity classification (still / walking / carried)

### 7.3 VEML7700 — Ambient Light Sensor

| Parameter | Value |
|-----------|-------|
| Manufacturer | Vishay |
| Part number | VEML7700-TT |
| Measures | Ambient light (lux) |
| Range | 0 – 120,000 lux |
| Interface | I2C (0x10) |
| Package | ODFN 2.0 × 2.0 × 0.73 mm |
| Current (active) | 90 µA |

**Use:** Auto-brightness control for display backlight.

---

## 8. Button — COPY

| Parameter | Value |
|-----------|-------|
| Type | Momentary tactile push button |
| Part number | PTS526SK15SMTR2LFS (C&K) |
| Dimensions | 4.2 × 3.2 mm SMD |
| Actuation force | 1.57 N |
| Travel | 0.15 mm |
| Life | 1,000,000 cycles |
| Label | `COPY` laser-etched on front stainless shell |

**COPY Button Logic:**
```
User presses COPY
    → GPIO interrupt (falling edge)
    → Capture current notification content + timestamp + sensor snapshot
    → POST /api/device/log  {
          device_id, user_id, timestamp,
          notification_text, sensor_snapshot,
          action: "COPY"
        }
    → LOT site logs this event in user's Log tab
    → LED flashes white 3× (acknowledge)
    → Display briefly shows "Logged ✓"
```

---

## 9. Status LED

| Parameter | Value |
|-----------|-------|
| Type | WS2812B-Mini (Neopixel compatible) |
| Package | 3.5 × 3.5 mm |
| Colors | Full RGB (24-bit) |
| Driver | Single-wire protocol, ESP32 RMT peripheral |
| Diffuser | Ø2 mm frosted borosilicate dot in top-right corner of front shell |

**LED Color Codes:**
| Color | Event |
|-------|-------|
| White pulse (slow) | Connected, idle |
| Blue pulse (slow) | New notification received |
| White triple-flash | COPY button registered |
| Green solid 2s | OTA firmware update complete |
| Yellow blink | Low battery (< 20%) |
| Red blink | Wi-Fi disconnected |
| Purple | Pairing mode (Bluetooth) |

---

## 10. Power System

### 10.1 Battery

| Parameter | Value |
|-----------|-------|
| Type | Lithium Polymer (LiPo) |
| Capacity | 300 mAh |
| Voltage | 3.7 V nominal (4.2 V max, 3.0 V min) |
| Dimensions | 30 × 28 × 3.5 mm |
| Protection circuit | Integrated PCM (over-charge, over-discharge, short-circuit) |
| Connector | 1.25 mm JST 2-pin |
| Estimated battery life | ~18–24 hours (Wi-Fi connected, display on 30% brightness, polling every 60 s) |

### 10.2 Wireless Charging (Qi)

| Parameter | Value |
|-----------|-------|
| Standard | Qi v1.3 |
| Receiver IC | BQ51013BRHLR (Texas Instruments) |
| Coil | 30 × 30 mm wound, 6 turns |
| Input voltage to BQ51 | 4.5–5.5 V (from Qi TX) |
| Output | 5 V @ 300 mA (regulated) |
| Efficiency | ~82% at rated load |
| Charge time (empty → full) | ~80 min |
| Coil placement | Power PCB, centred on stainless back shell thinned window |

### 10.3 Power Management

| IC | Function |
|----|---------|
| BQ51013BRHLR | Qi wireless receive + 5V output |
| TP4056 | LiPo charge management (CC/CV, 300 mA) |
| HT7833 | 3.3V LDO regulator (500 mA, for MCU + peripherals) |
| TPS63036 | 3.3V buck-boost (for stable rail during charge) |

**Power budget (active, Wi-Fi connected):**
```
ESP32-S3 (Wi-Fi Tx active)   : 240 mA peak, ~80 mA average
Display (50% brightness)      : 12 mA
Camera (standby)              : 10 mA
BME688 (1 measure / 15 min)  : 0.2 mA avg
LSM6DSO32 (low power)        : 0.6 mA
VEML7700                     : 0.1 mA
LED (white, 20% brightness)  : 3 mA
Total average                 : ~106 mA
Battery life (300 mAh)        : ~2.8 h continuous Wi-Fi
Battery life (poll every 60s) : ~18–24 h
```

---

## 11. Connectivity

| Protocol | Spec | Use |
|----------|------|-----|
| Wi-Fi | 802.11 b/g/n, 2.4 GHz, WPA2/WPA3 | Primary cloud connectivity |
| BLE 5.0 | BLE, Bluetooth Mesh | Pairing, config, proximity |
| USB-C | USB 2.0 Full Speed | Firmware flash, debug UART, emergency charge |

**Antenna:** Molex 2140680100, 2 dBi adhesive patch, external to stainless body, fed via U.FL + RG178 coax.

---

## 12. Interfaces Summary

| Interface | Signal | GPIO Pin | Notes |
|-----------|--------|----------|-------|
| Display SPI MOSI | SPI | GPIO11 | ST7789V |
| Display SPI CLK | SPI | GPIO12 | ST7789V |
| Display CS | GPIO | GPIO10 | ST7789V |
| Display DC | GPIO | GPIO9 | ST7789V |
| Display RST | GPIO | GPIO8 | ST7789V |
| Display BL | PWM | GPIO7 | Backlight, LEDC PWM |
| Camera XCLK | CLK | GPIO15 | OV2640 |
| Camera PCLK | CLK | GPIO16 | OV2640 |
| Camera VSYNC | GPIO | GPIO17 | OV2640 |
| Camera HREF | GPIO | GPIO18 | OV2640 |
| Camera D0–D7 | GPIO | GPIO19–26 | OV2640 DVP |
| Camera SIOC | I2C | GPIO38 | SCCB (I2C) |
| Camera SIOD | I2C | GPIO39 | SCCB (I2C) |
| BME688 SCL | I2C | GPIO3 | I2C bus 0 |
| BME688 SDA | I2C | GPIO4 | I2C bus 0 |
| LSM6DSO32 SCL | I2C | GPIO3 | I2C bus 0 |
| LSM6DSO32 SDA | I2C | GPIO4 | I2C bus 0 |
| VEML7700 SCL | I2C | GPIO3 | I2C bus 0 |
| VEML7700 SDA | I2C | GPIO4 | I2C bus 0 |
| COPY Button | GPIO | GPIO5 | Active low, 10kΩ pull-up |
| Status LED | RMT | GPIO6 | WS2812B |
| USB-C D+ | USB | GPIO19_USB | ESP32-S3 native USB |
| USB-C D- | USB | GPIO20_USB | ESP32-S3 native USB |
| Battery ADC | ADC1 | GPIO1 | Voltage divider |
| UART TX | UART0 | GPIO43 | Debug / CP2102N |
| UART RX | UART0 | GPIO44 | Debug / CP2102N |

---

## 13. Operating Conditions

| Parameter | Min | Typical | Max | Unit |
|-----------|-----|---------|-----|------|
| Operating temperature | -20 | 25 | 70 | °C |
| Storage temperature | -40 | 25 | 85 | °C |
| Relative humidity | 10 | 50 | 90 | % RH (non-condensing) |
| Operating voltage (USB-C) | 4.75 | 5.0 | 5.25 | V |
| ESD protection | ±2kV (HBM) on all exposed pins | | | |

---

## 14. Mechanical Drawings Reference

> Full STEP / DXF files for stainless body and PCBs are located in:  
> `/hardware/cad/` — **not yet in repo; to be added after first PCBWay prototype**

Critical tolerances:
- Display aperture to PCB: ±0.1 mm
- Camera aperture to sensor: ±0.1 mm
- Button cutout to PCB button: ±0.15 mm
- PCB to shell: 0.1 mm nominal clearance all sides

---

## 15. Regulatory Targets

| Certification | Region | Target |
|--------------|--------|--------|
| FCC Part 15B | USA | Rev B |
| CE (RED) | EU/UK | Rev B |
| RoHS | Global | Rev A |
| WEEE | EU | Rev B |
| Wi-Fi Alliance | Global | Rev B |

*Rev A (100-unit pilot) is for internal testing and does not require FCC/CE certification.*

---

*Document: 01-DEVICE-SPECIFICATION.md — COSMO Computer Rev A*  
*COSMO® CIA — LOT Systems © 2026*
