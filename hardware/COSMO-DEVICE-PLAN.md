# COSMO NODE — Hardware Device Plan
**Project:** LOT Systems Physical Companion  
**Codename:** COSMO NODE  
**Author:** Vadik — Inventor, COSMO® CIA  
**Revision:** 1.0  
**Date:** 2026-05-24  
**Status:** Pre-Production Design  

---

## 1. Product Vision

COSMO NODE is the physical extension of the LOT (Layers of Time) personal operating system. It is a flat, silent device that sits on a desk or clips to a surface. It receives autonomous notifications from lot-systems.com — "Coffee time.", "Deep work window open.", "Rest signal detected." — and returns a single signal when the user presses Copy: a timestamped log entry sent back to the LOT Log tab.

It does not demand attention. It rewards presence.

---

## 2. Industrial Design

### Form Factor

| Dimension | Spec | Note |
|---|---|---|
| Footprint | 40 × 40 mm | Square |
| Thickness target | 5.0 mm | Aspirational; Rev A expect 7.5 mm |
| Thickness confirmed | 7.5 mm | First 100-unit run |
| Weight | ~22 g | Without strap |
| Profile | Uniform slab | No taper |

### Two-Part Stainless Steel Body

The enclosure is CNC-machined 316L stainless steel in two halves joined by M1.2 screws hidden inside the perimeter seam.

**Side A — Polished (Top Face)**
- Mirror-polished (#8 finish) 316L stainless steel
- No markings, ports, or openings
- Reflective surface: doubles as a micro mirror
- Laser-etched COSMO® mark on inner face (not visible when closed)
- Thickness: 1.5 mm plate

**Side B — Functional (Bottom Face)**
- Satin-brushed 316L stainless steel
- Window cutouts:
  - Display: 28 × 28 mm square opening, flush Gorilla Glass 3 lens (0.5 mm)
  - Camera: 6 × 6 mm circular aperture, sapphire crystal lens cover
  - Button: 8 mm circular recess, stainless steel tactile cap
- Wireless charging: No port. Qi coil embedded in PCB stack
- USB-C port: 3.0 × 1.0 mm slot on bottom edge (for firmware flash / emergency charge only)
- Thickness: 1.5 mm plate

### Assembly Method

```
[Side A — Polished SS]
      ↓
[Display glass — Gorilla Glass 0.5mm]
      ↓
[PCB Stack — 4-layer, 38 × 38 mm]
      ↓
[LiPo battery — 3.0mm thin cell]
      ↓
[Wireless charge coil + thermal pad]
      ↓
[Side B — Functional SS]
```

All gaskets are 0.3 mm silicone O-ring. IPX4 water resistance target.

---

## 3. Electronics Architecture

### Primary MCU

**ESP32-S3-MINI-1-N8R8** (Espressif)
- Dual-core Xtensa LX7 @ 240 MHz
- 8 MB Flash / 8 MB PSRAM
- 2.4 GHz WiFi 802.11 b/g/n
- Bluetooth 5.0 LE
- AI vector acceleration (SIMD for edge inference)
- DVP camera interface
- 20 × 20 mm module, 2.54 mm pitch castellation
- Operating voltage: 3.0–3.6 V

### Display

**SSD1327 1.5" 128×128 Grayscale OLED**
- 16-level grayscale
- I2C or SPI interface
- 38.1 × 38.1 mm panel (fits 40 × 40 mm body with 1 mm border)
- 1.5 mm total thickness (driver board + panel)
- Ultra-low power: 10 mA typical, 0.5 µA sleep
- Pager aesthetic: monochrome, sharp, readable at a glance

Alternatively: **SSD1306 0.96" 128×64 OLED** if 1.5" does not fit z-stack.

### Camera

**OV2640 1/4" 2MP CMOS Module**
- 2 Megapixel (1600×1200 max)
- DVP 8-bit interface — native to ESP32-S3
- Built-in JPEG encoder (offloads MCU)
- 27 × 27 mm module with lens — trimmed to 24 × 24 mm for body fit
- Frame rate: 15 fps @ full res, 30 fps @ VGA
- Use case: LOT site image upload, QR code scan of session IDs

### Weather Sensor

**Bosch BME688** (AI-grade environmental sensor)
- Temperature: ±1.0°C accuracy
- Humidity: ±3% RH
- Barometric pressure: ±1 hPa
- Gas resistance (VOC / IAQ index)
- **Bosch BSEC2 library**: onboard pattern classification for air quality index, CO₂ equivalent, breath VOC
- Package: 3.0 × 3.0 × 0.93 mm LGA — fits anywhere on PCB
- I2C @ 400 kHz

### Copy Button

**C&K PTS526 SMD Tactile Switch** (or equivalent)
- 5.2 × 5.2 mm, 1.5 mm travel
- Stainless steel actuator cap, press-fit into Side B recess
- 160 gf actuation force — deliberate, not accidental
- Function: Send POST to `lot-systems.com/api/log` with timestamp, device ID, weather snapshot
- LED feedback: WS2812B RGB LED (1 × 1 mm) under button recess — pulsed green on send confirm

### Power System

**Battery:** Cellevia LP401826 LiPo
- 3.7 V nominal / 4.2 V max
- Capacity: 150 mAh
- Dimensions: 4.0 × 18 × 26 mm (fits 38 × 38 mm footprint)
- Estimated runtime: 5–7 days standby, 2 days active polling

**Wireless Charger Receiver:** Qi EP-WC-05 (5W)
- Receiver coil: 30 × 30 mm, 0.8 mm thick, embedded on back of PCB
- Charge IC: IP5310 (5V/1A Qi receiver + LiPo charge + boost)
- Charge time: ~90 min (150 mAh @ 100 mA)
- Compatible chargers: any Qi pad (iPhone charger, Samsung pad, etc.)

**USB-C Port:** CH340C USB-UART bridge
- Emergency charge input
- Firmware flashing (esptool.py)
- Not primary charge path

**Battery Management IC:** TP4056 or MCP73831
- Overcharge, overdischarge, short circuit protection
- Charge indicator on status LED

### Additional ICs

| IC | Function |
|---|---|
| TXS0102 | Level shifter (3.3V ↔ 1.8V for OLED) |
| AP2112K-3.3V | LDO regulator (camera + sensor rail) |
| SN74LVC1G04 | Inverter for button debounce logic |
| GD25Q64CSIG | 8 MB external NOR flash (log cache) |

---

## 4. PCB Specification (for PCBWay)

| Parameter | Value |
|---|---|
| Board size | 38 × 38 mm |
| Layers | 4 |
| Thickness | 1.0 mm |
| Surface finish | ENIG (gold pads) |
| Solder mask | Matte black |
| Silkscreen | White (top) |
| Min trace / space | 0.1 / 0.1 mm |
| Min drill | 0.2 mm (laser via) |
| Copper weight | 1 oz outer / 0.5 oz inner |
| Stackup | Signal / GND / Power / Signal |
| IPC class | Class 2 |
| Quantity (NPI run) | 10 bare boards |
| Quantity (production) | 120 bare boards (100 units + 20% yield buffer) |
| PCBWay service | PCB + SMT Assembly (turnkey) |

### PCBWay Turnkey SMT Assembly
- Gerber files + BOM + CPL (centroid) submitted to PCBWay
- PCBWay sources components from their partner suppliers
- Stencil: laser-cut stainless steel 0.12 mm
- Reflow: lead-free SAC305
- AOI + X-ray inspection included

---

## 5. LOT API Integration

The device connects to lot-systems.com over WiFi HTTPS.

### Outbound: Copy Button Signal

```
POST https://lot-systems.com/api/log
Authorization: Bearer <device_token>
Content-Type: application/json

{
  "source": "cosmo_node",
  "device_id": "COSMO-XXXX",
  "action": "copy",
  "timestamp": "2026-05-24T14:32:00Z",
  "payload": {
    "temp_c": 22.4,
    "humidity_pct": 55,
    "pressure_hpa": 1013,
    "iaq_index": 87,
    "battery_pct": 78
  }
}
```

Response: `{ "status": "ok", "log_id": "..." }` triggers green LED pulse.

### Inbound: Notification Stream

Device polls `GET /api/notifications/device` every 60 seconds (configurable).  
Or: maintains persistent WebSocket `wss://lot-systems.com/ws/device/<device_id>`.

Notification payload:
```json
{
  "id": "notif_001",
  "type": "reminder",
  "message": "Coffee time.",
  "priority": "low",
  "display_duration_ms": 5000
}
```

Device renders message on OLED with typewriter animation, then fades.

### Device Authentication

1. First boot: device broadcasts BLE advertisement `COSMO-NODE-XXXX`
2. LOT site companion app (mobile/web) detects device, pairs via BLE
3. Site issues `device_token` (JWT, 365-day TTL)
4. Token stored in ESP32-S3 NVS (encrypted flash partition)
5. Subsequent communication: WiFi HTTPS only (BLE disabled post-pair to save power)

---

## 6. Notification Display Logic

Notifications originate from lot-systems.com AI engine (Quantum Intent Engine™) and are pre-authored or AI-generated per user state.

Example messages displayed on OLED:
```
Coffee time.
─────────────
Deep work window.
─────────────
Rest signal.
─────────────
Intention set.
─────────────
Memory question ready.
```

Display behavior:
- Idle: clock + date in minimal monospace (bottom 12px strip)
- Notification arrives: full-screen text, 16pt, centered
- Duration: 5 seconds default (overridable per notification)
- After display: fade to idle
- If user presses Copy during notification: logs interaction + dismisses

---

## 7. Session Compression

Each device session (power-on cycle) compresses its interaction log before deep sleep:

```
Session data → JSON compact → zlib compress → store in external NOR flash
```

On next WiFi connection, compressed session batch uploads to LOT API:
```
POST /api/device/session
Content-Encoding: deflate
Body: <compressed session blob>
```

Compressed session ~200 bytes per day of interactions. 8MB external flash = ~11 years of sessions before requiring cloud sync flush.

---

## 8. Physical Interface Summary

| Element | Location | Function |
|---|---|---|
| OLED display | Side B center | Notification + status display |
| Camera | Side B top-center | Image capture, QR scan |
| Copy button | Side B bottom-center | Send log entry to LOT site |
| Wireless charge | Bottom of PCB | Qi 5W charging |
| USB-C | Bottom edge | Firmware flash + emergency charge |
| Status LED | Under button cap | Green = sent, Red = error, Blue = charging |
| Polished face | Side A | Mirror surface, no controls |

---

## 9. Regulatory & Safety

| Standard | Path |
|---|---|
| FCC Part 15 (WiFi/BLE) | Module pre-certified (ESP32-S3-MINI-1 has FCC ID: 2AC7Z-MINI1) |
| CE RED | Required for EU sale — conducted via PCBWay certification partner |
| RoHS | ENIG PCB + SAC305 solder = compliant |
| UN38.3 | LiPo battery — order certified cells only |
| IP rating | IPX4 target (silicone gasket, no submerge claim) |

100-unit run: FCC/CE not required for internal/prototype use. Required before retail.

---

## 10. Production Run: 100 Units

| Phase | Action | Timeline |
|---|---|---|
| Rev A PCB | 10 bare boards from PCBWay, hand-assemble | Week 1–2 |
| Rev A testing | Firmware flash, WiFi test, API test | Week 3 |
| Enclosure sample | 2 CNC SS enclosures from PCBWay CNC service | Week 3–4 |
| Rev B PCB | Fix Rev A findings, order 120 PCBA (turnkey) | Week 5–6 |
| Final assembly | Join PCBs into SS enclosures | Week 7–8 |
| QA / burn-in | 48-hour power cycle test per unit | Week 8–9 |
| Shipping | 100 units boxed | Week 10 |
