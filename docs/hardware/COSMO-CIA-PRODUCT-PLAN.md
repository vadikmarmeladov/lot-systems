# COSMO® CIA — Product Plan
## Compact Intelligence Apparatus · LOT Systems Hardware Division
**Version:** 1.0  
**Author:** Vadik, Inventor · COSMO® CIA  
**Date:** 2026-05-26  
**Classification:** Internal Product Document

---

## 1. Product Identity

**Name:** COSMO® CIA  
**Full form:** Compact Intelligence Apparatus  
**Form factor:** 40 × 40 × 5 mm flat square  
**Material:** 316L brushed/polished stainless steel  
**Run size:** 100 units (pilot production)  
**Manufacturer:** PCBWay (PCB + PCBA + CNC enclosure)

The COSMO® CIA is a pager-class wearable intelligence node. It receives AI-powered notifications from lot-systems.com, logs user actions back to the platform, monitors ambient environmental conditions, and captures imagery — all within a device no larger than a hotel room key card, half the thickness.

---

## 2. Physical Design

### 2.1 Enclosure

| Face | Material | Finish | Features |
|------|----------|--------|----------|
| Front (top) | 316L stainless steel | Mirror-polished | Plain, reflective, logo laser-etched |
| Back (bottom) | 316L stainless steel | Brushed satin | Camera aperture · Screen window · Copy button · USB-C / charging port |

- **Snap-fit + gasket** assembly: no visible screws on polished face
- **Internal tolerance:** 0.15 mm for PCB stack
- **Corner radius:** 3 mm
- **Overall volume:** 8,000 mm³

### 2.2 Back Face Layout (38 × 38 mm working area)

```
┌──────────────────────────────────────┐
│  ○  CAM       [SCREEN 1.0"]          │
│                                      │
│                    [COPY ●]          │
│  ≋  CHARGE                           │
└──────────────────────────────────────┘
```

- Camera: 8 mm aperture, centered left
- Screen: 26 × 26 mm window, right-center
- Copy button: flush tactile, right-bottom, silver dome
- Wireless charge indicator: LED ring, bottom-left edge

---

## 3. Core Logic

### 3.1 Notification Flow

```
lot-systems.com  →  WebSocket push  →  COSMO® CIA  →  display
                                              │
                              BME688 weather reading injected
                              into notification context
```

### 3.2 Copy Button Flow

```
User presses COPY
      │
      ▼
ESP32 captures:
  - Timestamp
  - Current notification text
  - Weather snapshot (temp/humidity/AQI)
  - Device ID
      │
      ▼
HTTPS POST → lot-systems.com/api/device/log
      │
      ▼
Appears in user's Log tab (lot-systems.com) within 2 seconds
```

### 3.3 Session Compression

Each 30-minute session window:
- All received notifications batched
- Sensor readings averaged
- Compressed JSON payload (gzip) stored to flash
- Uploaded on next stable WiFi connection

---

## 4. Key Features Summary

| # | Feature | Technology |
|---|---------|-----------|
| 1 | AI notifications from lot-systems.com | WebSocket + LOT API |
| 2 | OLED/TFT display for notification content | 1.0" ST7789 color TFT |
| 3 | Copy button → Log tab signal | HTTPS POST to /api/device/log |
| 4 | Camera (2MP) | OV2640 via FPC |
| 5 | Weather sensor (AI-grade) | Bosch BME688 |
| 6 | IMU (motion/orientation) | ICM-42688-P |
| 7 | Wireless charging (Qi) | BQ51050B + custom coil |
| 8 | PCB manufacturing | PCBWay 4-layer HASL |
| 9 | Stainless steel enclosure | PCBWay CNC · 316L |
| 10 | Session compression | ESP32 firmware gzip |
| 11 | LOT API connector | ESP32 WiFi + TLS |
| 12 | 100-unit production run | PCBWay PCBA service |

---

## 5. Document Index

| Document | File | Purpose |
|----------|------|---------|
| This file | `COSMO-CIA-PRODUCT-PLAN.md` | Master product plan |
| BOM | `COSMO-CIA-COMPONENTS-BOM.md` | Buying list + links + pricing |
| Roadmap | `COSMO-CIA-ROADMAP.md` | Timeline + milestones |
| Firmware | `COSMO-CIA-FIRMWARE.md` | Firmware architecture + spec |
| Software | `COSMO-CIA-SOFTWARE.md` | API connector + desktop app |
| Manufacturing | `COSMO-CIA-MANUFACTURING.md` | PCBWay + CNC enclosure guide |
| User Manual | `COSMO-CIA-USER-MANUAL.md` | End-user PDF manual |

---

## 6. Brand Notes

- Device carries COSMO® mark on polished face (laser etch, ~2 mm height)
- LOT Systems wordmark on enclosure inner lip (not visible externally)
- Packaging: matte black card sleeve, silver foil stamp
- Notification copy voice: terse, direct, alive — matches LOT Systems tone

---

*COSMO® is a registered trademark of LOT Systems. CIA = Compact Intelligence Apparatus.*
