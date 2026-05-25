# COSMO® CIA — Wireless Charger Specification
**Document:** COSMO-CHG-001 · Rev 1.0
**Date:** 2026-05-25

---

## 1. Overview

The COSMO® CIA uses Qi wireless inductive charging. The charging system has two components:

| Component | Location | Purpose |
|---|---|---|
| **Receiver** | Inside COSMO® CIA (Side A) | Receives power, charges the LiPo battery |
| **Transmitter Pad** | Accessory charger | Sits on desk; device rests on top |

---

## 2. Receiver (Inside Device)

| Parameter | Value |
|---|---|
| IC | Texas Instruments BQ51013BRHLT |
| Qi standard | Qi Baseline Power Profile (BPP), 5W |
| Input voltage (from coil) | 5V regulated |
| Output | 4.2V / 500mA to charge circuit |
| Receive coil | Würth WR450060-20M8-G, 40×40mm flex |
| Coil inductance | 12.5 µH |
| Coil placement | Adhered to inside of Side A (bottom shell), centred |
| Shielding | Ferrite sheet 38×38×0.1mm behind coil |
| Charge indicator | Edge RGB LED: red=charging, green=full |

### 2.1 BQ51013B Key Features
- WPC 1.1 compliant (Qi)
- 5V/1A input, OVP/OCP protection
- Foreign object detection (FOD)
- Communication via backscatter modulation
- 16-pin VQFN, 3×3mm

---

## 3. Transmitter Pad (Accessory)

| Parameter | Value |
|---|---|
| IC | Texas Instruments BQ500210AYRGZT |
| Qi standard | Qi BPP (5W) |
| Input | USB-C, 5V/1A |
| Coil | Würth 760308103, 40mm diameter |
| Coil inductance | 13.2 µH |
| PCB | 40×40mm, 2-layer FR4, 1.6mm |
| Enclosure | Matte black ABS, 45×45×8mm |
| Finish | Top surface: rubber non-slip pad |
| LED | White, indicates active charging |

### 3.1 Charger Aesthetic
- Matte black square, same 40×40mm footprint as device
- The COSMO® CIA rests flat, polished side down, on the charger
- Satisfying magnetic alignment using 4× N35 neodymium disc magnets (3mm×1mm) in charger + 4× in device shell
- Alignment magnets placed at corners so they don't interfere with Qi coil

---

## 4. Charging Sequence

```
User places device (Side A down) on charger pad
        │
        ▼
BQ500210 detects Q-factor change → initiates ping
        │
        ▼
BQ51013B responds with signal strength packet
        │
        ▼
Power transfer begins: 5W @ ~200kHz
        │
        ▼
MCP73831 regulates charge: CC (500mA) → CV (4.2V)
        │
        ▼
MAX17048 fuel gauge reports SOC to ESP32-S3
        │
        ▼
ESP32-S3 reads SOC every 5 min:
  - < 90%: RGB LED = Red (pulse)
  - ≥ 90%: RGB LED = Orange
  - 100%: RGB LED = Green (steady)
  - Not charging: LED off
```

### 4.1 Charge Time Estimate

| Starting SOC | Time to 100% |
|---|---|
| 0% (empty) | ~30 minutes |
| 50% | ~15 minutes |
| 80% | ~6 minutes |

> Based on 200mAh battery, 500mA charge rate (CC phase).

---

## 5. Safety Features

| Feature | Component | Protection |
|---|---|---|
| Overvoltage | BQ51013B internal | Clamps at 4.35V |
| Overcurrent | MCP73831 internal | Limits to 500mA |
| Overtemperature | NTC thermistor on PCB | Pauses charge above 45°C |
| Short circuit | BQ51013B + fuse | Shuts down |
| Foreign object | BQ500210 FOD | Stops TX if metal on pad |
| Battery OVP | Protection circuit on battery | Disconnects above 4.25V |

---

## 6. Manufacturing Notes

### Receiver (inside device)
- Qi coil is the last component placed before top shell is closed
- Ferrite sheet must be between coil and battery to prevent heating
- Use 3M 9080A adhesive tape to fix coil to shell interior
- Leave 2mm gap at USB-C port edge

### Transmitter (charger pad)
- PCB sourced from PCBWay (40×40mm, 2-layer)
- ABS enclosure sourced from Alibaba (custom mold, min qty 200)
- Non-slip rubber pad applied to bottom + top surfaces
- USB-C port centred on one edge

---

## 7. Qi Compliance Notes

For the 100-unit pilot, full Qi certification by the Wireless Power Consortium (WPC) is not required. The BQ51013B is a WPC-certified chip, which satisfies the most important requirement (interoperability).

Full WPC product certification (Qi ID) is recommended before scaling beyond 500 units:
- Cost: ~$8,000–$15,000
- Timeline: 3–4 months
- Required to display the Qi logo on packaging

---

*Document COSMO-CHG-001 · lot-systems.com · Rev 1.0 · 2026-05-25*
