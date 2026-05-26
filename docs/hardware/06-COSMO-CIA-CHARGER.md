# COSMO® CIA — Wireless Charger Specification
## Qi Charging System

```
DOCUMENT:  06-COSMO-CIA-CHARGER
REVISION:  v1.0
DATE:      2026-05-26
STANDARD:  WPC Qi 1.2.4 (5W)
```

---

## 1. Charging Method

The COSMO CIA uses **Qi wireless charging** (WPC 1.2.4 standard) as the primary and only external power method. No exposed charging port is present on the exterior — the USB-C port on Side B is recessed behind the stainless steel shell and is intended for firmware flashing only (accessible only when the device is opened).

**Receiver (in device):**
- Coil: Würth Elektronik WR135-30003, 30mm diameter, 0.6mm thick
- IC: STMicroelectronics STWLC68, 5W WPC 1.2.4 receiver
- Input voltage range: 4.5–10V
- Charging current: up to 500mA → LiPo 200mAh charges in ~30 min

---

## 2. Compatible Chargers

**Any Qi-standard wireless charger is compatible.** The device negotiates 5W using WPC 1.2.4 protocol.

Tested and recommended:
| Charger | Power | Notes |
|---------|-------|-------|
| Anker 313 Wireless Pad | 5W | Flat pad, ideal for COSMO CIA |
| Apple MagSafe (15W) | 5W (Qi fallback) | Works, charges at 5W |
| Samsung EP-P1300 | 5W | Standard Qi, flat pad |
| Belkin BOOST Charge Wireless Pad | 5W–10W | 5W in Qi mode |

---

## 3. Optional: LOT Systems Qi Pad (COSMO-QI-PAD)

A custom wireless charging pad designed specifically for the COSMO CIA is planned as an optional accessory.

### Physical Specification

| Parameter | Value |
|-----------|-------|
| Footprint | 60 × 60 mm |
| Height | 4 mm |
| Material | Matte black POM plastic, aluminum base |
| Coil alignment window | 40 × 40 mm center (matches COSMO CIA) |
| Charging indicator | White LED ring around perimeter |
| Input | USB-C, 5V/1.5A (7.5W) |

### Design Intent

The COSMO-QI-PAD is a square pad designed so the COSMO CIA **sits flat and perfectly aligned** in the center. The polished Side A faces up (visible) when charging. The device charges from Side B (active face down on the pad).

### Qi Transmitter Circuit

| Component | Part | Notes |
|-----------|------|-------|
| TX coil | WR135-30006 (30mm transmit coil) | Wound for 5W |
| TX IC | STWLC33 (ST Qi 15W transmitter) | Configured for 5W max |
| MCU | STM32G030 (co-processor) | Charging status LED control |
| Input rectifier | USBLC6-2SC6 | USB-C ESD protection |
| Ferrite shield | 40×40mm Würth ferrite sheet | Minimizes coupling loss |
| LED | 8× WS2812B 3535 | RGB LED ring (white charging animation) |

### Electrical

| Parameter | Value |
|-----------|-------|
| Input | USB-C 5V/1.5A |
| Output (to device) | 5W Qi (WPC 1.2.4) |
| Standby power | < 100mW |
| Efficiency | ~80% at 5W load |
| Coil alignment tolerance | ±5mm |

### Manufacturing

COSMO-QI-PAD would be:
- PCB: PCBWay 2-layer 50×50mm
- Enclosure: CNC machined POM plastic base + aluminum bottom plate
- Ferrite: pre-cut Würth ferrite sheet, adhered to PCB
- Assembly: manual, ~10 min per unit

---

## 4. Charging Behavior (In Device Firmware)

| Condition | LED behavior | Display behavior |
|-----------|-------------|-----------------|
| Not charging, battery > 20% | LED off | Normal notification display |
| Charging (< 80% SOC) | LED solid green | Battery % shown in status bar |
| Charging (80–99% SOC) | LED slow pulse (0.5Hz) | "Charging..." in status bar |
| Fully charged (100%) | LED rapid pulse (2Hz) then off | "Charged" shown briefly |
| Low battery (< 15%) | LED rapid blink (5Hz) | "Low battery" notification shown |
| Battery critical (< 5%) | LED continuous rapid blink | Device shows battery warning, enters deep sleep |

---

## 5. Battery Safety

The BQ21040 charger IC provides:
- **Overvoltage protection:** Cuts off at 4.21V per cell
- **Overcurrent protection:** Limited to 500mA
- **Overtemperature protection:** Charges at 0–45°C only (thermistor monitoring)
- **Cell preconditioning:** Trickle charges depleted cells at 50mA until 3.0V

The COSMO CIA passes charging current through the STWLC68 → BQ21040 path, not directly to the battery. This is standard charging architecture.

---

## 6. Expected Battery Life

| Usage pattern | Estimated battery life |
|---------------|------------------------|
| Active (WiFi always on, polling every 30s) | 10–12 hours |
| Normal (polling every 30s, light sleep between) | 7–10 days |
| Minimal (daily notification only, deep sleep most of the time) | 30–45 days |
| Charging frequency (normal use) | Once per week |

**Recommendation for users:** Place the COSMO CIA on a Qi pad overnight or whenever it's on a desk. The device charges to 100% in ~30 minutes.

---

```
COSMO® CIA — Wireless Charger Specification
LOT Systems Corporation | lot-systems.com
Document: 06-COSMO-CIA-CHARGER v1.0
```
