# COSMO Computer — Hardware Documentation Index

**Product:** COSMO Computer  
**Brand:** COSMO® CIA / LOT Systems  
**Inventor:** Vadik Marmeladov  
**Form Factor:** 40 × 40 × 7 mm stainless steel pager-class device  
**Production Run:** 100 units (Rev A)  
**Manufacturing Partner:** PCBWay  

---

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 01 | [DEVICE-SPECIFICATION.md](./01-DEVICE-SPECIFICATION.md) | Full hardware spec, dimensions, materials, sensor suite |
| 02 | [BILL-OF-MATERIALS.md](./02-BILL-OF-MATERIALS.md) | BOM with supplier links, unit costs, 100-unit totals |
| 03 | [PCBWAY-MANUFACTURING.md](./03-PCBWAY-MANUFACTURING.md) | PCB + CNC + PCBA order guide for PCBWay |
| 04 | [FIRMWARE.md](./04-FIRMWARE.md) | Firmware architecture, build system, flash guide |
| 05 | [FIRMWARE-DOCUMENTS.md](./05-FIRMWARE-DOCUMENTS.md) | Firmware reference — registers, protocols, OTA |
| 06 | [SOFTWARE-CONNECTOR.md](./06-SOFTWARE-CONNECTOR.md) | Host software that connects to firmware |
| 07 | [LOT-API-CONNECTOR.md](./07-LOT-API-CONNECTOR.md) | LOT API integration — auth, WebSocket, endpoints |
| 08 | [CHARGER-SPEC.md](./08-CHARGER-SPEC.md) | Wireless Qi charger specification + schematic |
| 09 | [ROADMAP.md](./09-ROADMAP.md) | Full project roadmap — milestones, phases, gates |
| 10 | [USER-MANUAL.md](./10-USER-MANUAL.md) | PDF-ready user manual (English) |
| 11 | [SESSION-COMPRESSION.md](./11-SESSION-COMPRESSION.md) | Session data compression spec for device memory |

---

## Quick Reference

### Device Identity
```
Name:        COSMO Computer
Model:       CC-R1 (Rev A)
SKU:         LOT-CC-SS-001
Dimensions:  40 × 40 × 7 mm
Weight:      ~38 g (with stainless body)
Color:       Polished 316L stainless steel
Battery:     300 mAh LiPo, wireless Qi charging
Connectivity: Wi-Fi 802.11 b/g/n (2.4 GHz), BLE 5.0
MCU:         ESP32-S3 (Xtensa LX7, 240 MHz, NPU)
Display:     1.3" TFT 240×240 (ST7789V)
Camera:      OV2640 2MP
Sensors:     BME688 (AI weather + gas), LSM6DSO32 (IMU), VEML7700 (light)
Platform:    lot-systems.com
```

### Architecture Overview
```
┌─────────────────────────────────┐
│        LOT-SYSTEMS.COM          │
│   (Notifications · Log · API)   │
└──────────────┬──────────────────┘
               │  Wi-Fi / HTTPS / WebSocket
┌──────────────▼──────────────────┐
│         COSMO Computer          │
│  ESP32-S3 ─── Display (1.3")    │
│      │    ─── Camera (OV2640)   │
│      │    ─── BME688 (weather)  │
│      │    ─── LSM6DSO32 (IMU)   │
│      │    ─── COPY Button       │
│      └─── Wireless Qi Charge    │
└─────────────────────────────────┘
               │  USB-C (flash / debug)
┌──────────────▼──────────────────┐
│   LOT Companion (Desktop/Web)   │
│   (Flash · Config · Monitor)    │
└─────────────────────────────────┘
```

### Key Integration Points
- **Notifications**: Device polls `GET /api/device/notifications` every 60 s
- **Copy Button**: `POST /api/device/log` → appears in Log tab on lot-systems.com
- **Sensor Data**: `POST /api/device/sensor-data` every 15 min
- **OTA Updates**: `GET /api/device/firmware/latest` checked on boot

---

## Status

| Phase | Status |
|-------|--------|
| Hardware Spec | ✅ Complete |
| BOM | ✅ Complete |
| PCBWay Order Guide | ✅ Complete |
| Firmware Architecture | ✅ Complete |
| LOT API Integration | ✅ Complete |
| User Manual | ✅ Complete |
| Roadmap | ✅ Complete |
| Prototype (Rev A) | 🔲 Pending PCBWay order |
| Production 100 units | 🔲 Pending prototype validation |

---

*COSMO® CIA — LOT Systems © 2026. All rights reserved.*
