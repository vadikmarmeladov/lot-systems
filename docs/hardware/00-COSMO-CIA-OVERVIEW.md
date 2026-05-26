# COSMO® CIA — Hardware Computer
## Device Overview & Physical Specification

```
PRODUCT:   COSMO CIA
SERIES:    LOT Systems Connected Intelligence Architecture
INVENTOR:  Vadik Marmeladov — COSMO® CIA
VERSION:   v1.0
RUN:       100 units
STATUS:    PCBWay Production
```

---

## 1. What Is the COSMO CIA?

The COSMO CIA is a **pager-class ambient display computer** that connects physically to the LOT Systems platform (lot-systems.com). It is the first dedicated hardware node in the LOT ecosystem — a palm-sized stainless steel square that receives AI-powered notifications, logs user intent, reads environmental data, and mirrors the user's QOS (Quantum Operating System) state back into physical space.

It does not run apps. It runs signal.

---

## 2. Form Factor

| Parameter | Value |
|-----------|-------|
| Shape | Square |
| Width × Depth | 40 mm × 40 mm |
| Height (thickness) | 5 mm |
| Body material | 316L stainless steel, 2-part CNC machined |
| Side A finish | Mirror polished (brushed optional) |
| Side B finish | Satin / matte |
| Weight | ~38 g (estimated with battery) |

### Side A — Polished Face

Flat mirror-polished 316L stainless steel. No features, no text, no ports. A perfect reflective square. The premium resting face of the device.

### Side B — Active Face

| Component | Position | Spec |
|-----------|----------|------|
| Display | Center | 1.54" e-paper, 200×200 px, BW |
| Camera | Top-right corner | 2MP OV2640, flush lens |
| "Copy" button | Bottom-center | 6mm tactile, recessed 0.5mm |
| Charging indicator LED | Bottom-left | 0402 green LED, diffused |

---

## 3. Internal Architecture

```
┌────────────────────────────────────────────────┐
│                  COSMO CIA v1                  │
│  ┌──────────────┐     ┌────────────────────┐  │
│  │  ESP32-S3    │     │  1.54" e-paper     │  │
│  │  MINI-1-N8   │─SPI─│  200×200 BW        │  │
│  │  WiFi + BLE  │     └────────────────────┘  │
│  │  240 MHz     │                              │
│  │  8MB Flash   │     ┌────────────────────┐  │
│  │  8MB PSRAM   │─I2C─│  BME688            │  │
│  └──────┬───────┘     │  T/H/P/Gas AI      │  │
│         │DVP           └────────────────────┘  │
│  ┌──────▼───────┐                              │
│  │  OV2640      │     ┌────────────────────┐  │
│  │  2MP Camera  │     │  Qi Rx Coil 30mm   │  │
│  └──────────────┘     │  STWLC68 5W        │  │
│                        └────────┬───────────┘  │
│  ┌──────────────┐               │              │
│  │  LiPo 200mAh │◄──────────────┘              │
│  │  3.7V / 3mm  │                              │
│  │  BQ21040     │                              │
│  └──────────────┘                              │
└────────────────────────────────────────────────┘
```

---

## 4. Component Summary

| Component | Part | Spec |
|-----------|------|------|
| MCU | ESP32-S3-MINI-1-N8 | Xtensa LX7 dual-core, 240MHz, WiFi 802.11n, BLE 5.0 |
| Display | GDEH0154D67 | 1.54" e-paper, 200×200, SPI, 3.3V |
| Camera | OV2640 + FPC | 2MP, DVP interface, 24×24mm, auto-focus |
| Weather sensor | BME688 | Temp / Humidity / Pressure / Gas / AI IAQ |
| Wireless charging RX coil | WR135-30003 | 30mm diameter, 0.6mm thick, 5W Qi |
| Wireless charging IC | STWLC68 | 5W Qi WPC 1.2.4, I2C config |
| Battery | 303030 LiPo | 200mAh, 3.7V, 30×30×3mm |
| Battery charger IC | BQ21040DBVR | 500mA LiPo charger, USB-C input |
| USB-C port | GCT USB4085 | Programming + emergency charge |
| Copy button | TS-1187A-B | 6mm tactile, 0.5mm travel |

---

## 5. Connectivity

| Protocol | Use |
|----------|-----|
| WiFi 802.11b/g/n | Primary — LOT API connection |
| Bluetooth 5.0 LE | Future — proximity triggers |
| USB-C (OTG) | Firmware flashing, debug UART |
| Qi 5W (wireless) | Primary charging method |

---

## 6. Notification System

The device **polls** `GET /api/device/notifications` every 30 seconds via HTTPS.

When a notification arrives (e.g., "Coffee time!" from the LOT AI Memory Engine), it is rendered on the e-paper display and stays visible until the next notification replaces it.

Display persistence: e-paper holds the image with **zero power draw** between updates. Battery life: 7+ days on a charge with notifications every hour.

---

## 7. Copy Button

The Copy button on Side B sends a `copy_button` event to `POST /api/device/event`.

This creates a Log entry in the user's Log tab on lot-systems.com — visible in real time. The button is designed to capture moments of intention: "I'm marking this moment." The AI Memory Engine processes these marks as signal.

---

## 8. Camera

The OV2640 camera is exposed as an API endpoint via the device firmware. Images can be:
- Sent to the LOT API on-demand
- Triggered by the Copy button (hold 3 seconds)
- Used for environmental context (ambient light, occupancy)

Camera data is never stored without explicit user action.

---

## 9. PCB Manufacturing

**Manufacturer:** PCBWay (pcbway.com)
**Layers:** 4
**Process:** SMT assembly (PCBA service)
**Surface finish:** ENIG (Electroless Nickel Immersion Gold)
**PCB size:** 36×36mm (fits inside 40×40mm enclosure with 2mm clearance)
**Quantity:** 110 boards (100 production + 10 spares)

See `02-COSMO-CIA-PCBWAY-GUIDE.md` for full submission details.

---

## 10. Enclosure Manufacturing

**Manufacturer:** PCBWay CNC Machining service
**Material:** 316L stainless steel
**Parts per unit:** 2 (Side A shell + Side B shell)
**Fastening:** M1.6 × 4 screws × 4 (recessed, bottom face)
**Gasket:** 0.3mm silicone ring for IP52 dust/splash resistance

| Shell | Finish | Notes |
|-------|--------|-------|
| Side A (polished) | Mirror polish Ra ≤ 0.1 µm | No features |
| Side B (active) | Satin Ra 0.8 µm | Camera aperture ø3.5mm, display window 32×43mm, button recess ø7mm |

---

## 11. Power Budget

| State | Current draw | Battery life |
|-------|-------------|--------------|
| Active (WiFi poll) | ~80mA peak, ~18mA avg | ~11 hours |
| Idle (light sleep) | ~2mA | ~4 days |
| Deep sleep | ~120µA | ~70 days |
| Wireless charging | 5W input | 1h full charge |

Typical use (30s poll interval, light sleep between polls): **7–10 days per charge**.

---

## 12. Wireless Charger

Supplied separately. Compatible with any Qi-standard charger.

Optional: Custom LOT Systems square Qi pad designed to match the 40×40mm device footprint. See `06-COSMO-CIA-CHARGER.md`.

---

```
COSMO® CIA — Connected Intelligence Architecture
LOT Systems Corporation | lot-systems.com
© 2026 All rights reserved
```
