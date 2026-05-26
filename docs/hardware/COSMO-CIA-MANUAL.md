# COSMO® CIA — User Manual

**Product:** COSMO® CIA
**Version:** 1.0
**Date:** 2026-05-26
**Manufacturer:** LOT Systems / COSMO® CIA

*This document is the source for the printed PDF User Manual. Layout and typography are applied in Figma; this is the content master.*

---

## Cover Page

```
COSMO® CIA
─────────────────────────────
Connected Intelligence Appliance

User Manual

lot-systems.com
```

---

## 1. In the Box

- COSMO® CIA device (1)
- USB-A to USB-C cable, 0.3m (1)
- Quick Start Card (1)
- Warranty Card (1)

---

## 2. Device Overview

```
FRONT FACE (camera / screen / button side)
┌──────────────────────────────────────┐
│                                      │
│  ┌──┐  ←— Camera (top-left corner)  │
│  └──┘      3mm aperture, glass flush │
│                                      │
│  ┌──────────────────────┐            │
│  │ LOT  ·  10:42        │            │
│  │                      │ ← e-ink    │
│  │  Coffee time!        │   display  │
│  │                      │            │
│  │ 22°C  45%  IAQ 87   │            │
│  └──────────────────────┘            │
│                                      │
│  ┌────────┐                          │
│  │  COPY  │ ← Copy button            │
│  └────────┘                          │
│                                      │
└──────────────────────────────────────┘

REAR FACE (polished mirror side)
┌──────────────────────────────────────┐
│                                      │
│                                      │
│         Mirror polished              │
│         316L stainless steel         │
│                                      │
│    ┌──────────────┐                  │
│    │  [Qi zone]   │ ← Wireless       │
│    └──────────────┘   charging area  │
│                                      │
│                    SN: CIA-001-001   │
└──────────────────────────────────────┘

EDGES
- Right edge: USB-C port (for initial setup / firmware only)
- Top edge: 0.5mm vent hole for weather sensor (do not block)
- LED indicator: visible through gap between front and rear faces
```

---

## 3. First-Time Setup

### Step 1 — Charge your COSMO® CIA

Place the device on any Qi wireless charger (not included) with the polished side facing down.

- LED pulses **orange**: charging
- LED solid **green**: fully charged (~25 minutes from empty)

### Step 2 — Connect to LOT Systems

**On your phone or computer:**

1. Open **lot-systems.com** and sign into your LOT account
2. Go to **Settings → My Devices**
3. Tap **"+ Add COSMO® CIA"**
4. When prompted, enable Bluetooth on your device

**On your COSMO® CIA:**

The device displays "Awaiting setup…" and the LED pulses **blue** when ready to pair.

**In the LOT app:**

5. Select your Wi-Fi network and enter the password
6. The app transfers your credentials to COSMO® CIA wirelessly
7. COSMO® CIA connects and the LED flashes **green 3 times**

Setup is complete. Your COSMO® CIA will now receive notifications from LOT.

---

## 4. Receiving Notifications

COSMO® CIA checks for new notifications from LOT every 5 minutes. When a new notification arrives, the e-ink display updates automatically.

**Example notifications:**
```
Coffee time!

Good morning. How did you rest?

QOS: peak mode — commit fully today.

22°C outside. Good walk conditions.
```

The display is e-ink — it holds the last notification even when the device is asleep or charging. You never need to wake the device to read it.

The bottom of the display always shows live sensor data:
```
22.4°C  45%  IAQ 87
```
Temperature · Humidity · Air Quality (0=clean, 500=polluted)

---

## 5. The Copy Button

The Copy button on the front face sends a signal back to your **LOT Log tab**.

### Single press — Copy & Log
Press once to acknowledge the notification. This:
1. Records the notification in your LOT Log tab
2. Adds the current sensor data (temperature, humidity, air quality) to the log entry
3. Sends a brief haptic confirmation (single click)

**In your LOT Log tab, you'll see:**
```
⬡ COSMO® Copy                         10:42
  "Coffee time!"
  ▸ Sensors: 22.4°C  45%  1013 hPa  IAQ 87
```

### Double press — Cycle display
Cycles through three display views:
- Current notification (default)
- Sensor detail view (full-screen weather data)
- Time + date view

### Long press (hold 2 seconds) — Camera log
Captures a photo from the front camera and attaches it to a log entry in your LOT Log tab. Useful for capturing your environment alongside a notification. Haptic confirms capture.

---

## 6. LED Status Guide

| LED | Meaning |
|---|---|
| Orange pulse | Charging via Qi |
| Green solid | Fully charged |
| White flash | Copy button pressed — log sent |
| Blue pulse | Provisioning mode (awaiting setup) |
| Green ×3 | Connected successfully |
| Red ×2 | Connection error — check Wi-Fi |
| Red ×5 fast | Device error — contact support |

---

## 7. Wireless Charging

COSMO® CIA charges wirelessly via Qi (Wireless Power Consortium standard).

- Place the device **polished side down** on any Qi charging pad
- The device charges at up to 5W
- Full charge in approximately 25 minutes
- Compatible with any Qi v1.1 wireless charger

**Recommended charger:** Anker 313 Wireless Charger (5W, slim) — available at anker.com

**Note:** The Qi charging zone is in the centre of the rear face. Align the COSMO® CIA centred on the charger pad for best efficiency.

**Do not:**
- Use a metal charging surface between device and pad
- Stack multiple wireless chargers
- Use chargers rated above 15W (device accepts max 5W)

---

## 8. Battery Life

| Usage | Estimated battery life |
|---|---|
| Standby (1 notification/hour, mostly sleeping) | 7–10 days |
| Active (frequent notifications + button presses) | 2–3 days |
| Continuous (WiFi always on) | 18 hours |

Battery level is not displayed on the device. When the battery is low:
- Notification check interval reduces to 15 minutes (to conserve power)
- LED flashes red twice on wake

Place on charger when the device stops updating (missed expected notification).

---

## 9. Weather & Air Quality Sensor

COSMO® CIA includes a built-in Bosch BME688 environmental sensor — the same AI-grade chip used in professional weather stations.

**What it measures:**
| Measurement | Description |
|---|---|
| Temperature | Ambient temperature in °C |
| Humidity | Relative humidity (%) |
| Pressure | Barometric pressure (hPa) |
| IAQ | Air quality index (0–500) |

**IAQ scale:**
| Score | Quality |
|---|---|
| 0–50 | Excellent |
| 51–100 | Good |
| 101–150 | Lightly polluted |
| 151–200 | Moderately polluted |
| 201–300 | Heavily polluted |
| 301–500 | Severely polluted |

All sensor readings are automatically included in your LOT Log when you press Copy.

**Important:** Do not cover or block the 0.5mm vent hole on the top edge of the device. This hole allows air to reach the sensor. Blocking it will cause inaccurate readings.

---

## 10. Privacy & Data

COSMO® CIA does not record audio or video unless you press and hold the Copy button for a camera capture. The camera is **not active** during normal operation.

Your sensor data (temperature, humidity, air quality) is sent to lot-systems.com only when you press the Copy button. The device does not continuously stream sensor data.

Wi-Fi credentials and your LOT API token are stored in encrypted memory on the device. This information cannot be read externally.

For full privacy details, see: lot-systems.com/privacy

---

## 11. Notifications from LOT

COSMO® CIA delivers three types of notifications:

**Memory Engine prompts**
Questions from your LOT Memory Engine — follow-ups on your self-care journey. Tap Copy to acknowledge; the prompt is logged. Answer the full question in your LOT app later.

**QOS updates**
Your Quantum Operating System mode ("QOS: recovery — rest first today.") — a direct transmission of your current state.

**Reminders & environment**
Time-based ("Coffee time!") and weather-based ("18°C, clear — good walk conditions.") notifications generated by the LOT system.

**Custom notifications**
Sent by you via the LOT admin panel. Up to 128 characters.

---

## 12. Firmware Updates

COSMO® CIA updates its firmware automatically over Wi-Fi. When an update is available:
1. The device downloads the update in the background (during a scheduled poll cycle)
2. The update installs on the next restart (after charging cycle or manual restart)
3. LED flashes **green ×5** on first boot after update

You do not need to do anything. Updates are automatic, signed, and verified by LOT Systems.

To see your current firmware version: lot-systems.com → Settings → My Devices.

---

## 13. Troubleshooting

**Device shows no notification / blank screen**
- Place on Qi charger for 30 minutes (battery may be flat)
- Verify Wi-Fi is active in your home
- Check lot-systems.com for outages (lot-systems.com/status)

**LED red ×2 on wake**
- Wi-Fi connection failed. Check your router, or re-provision via Settings → My Devices → Reconnect

**Copy button press not appearing in LOT Log**
- Confirm device is connected (no red LED)
- Check lot-systems.com → Log tab for the entry
- Log may take up to 30 seconds to appear after button press

**Sensor data looks incorrect**
- Ensure vent hole on top edge is not blocked
- Temperature reading may be elevated if device is in direct sunlight

**Need to re-provision (new Wi-Fi)**
1. Hold button for 10 seconds until LED pulses blue (factory reset)
2. Re-run setup in LOT Settings → My Devices

---

## 14. Specifications

| Spec | Value |
|---|---|
| Dimensions | 40 × 40 × 5 mm |
| Weight | ~30 g |
| Display | 1.54" e-ink, 200×200 px |
| Camera | VGA (640×480) |
| Battery | 120 mAh LiPo |
| Charging | Qi wireless, 5W |
| Wireless | WiFi 802.11n + Bluetooth 5.0 |
| Sensors | Temperature, Humidity, Pressure, Air Quality (IAQ) |
| Enclosure | 316L Stainless Steel |
| Operating temp | 0°C to +45°C |
| Storage temp | −10°C to +60°C |
| IP rating | IP52 |
| Certifications | FCC, CE, UKCA, RoHS |

---

## 15. Legal

**COSMO® CIA** is manufactured by LOT Systems.
© 2026 LOT Systems / COSMO® CIA. All rights reserved.

COSMO® is a registered trademark of LOT Systems.

Qi® is a trademark of the Wireless Power Consortium.

**FCC Statement:** This device complies with Part 15 of the FCC Rules. Operation is subject to the following two conditions: (1) this device may not cause harmful interference, and (2) this device must accept any interference received, including interference that may cause undesired operation.

**CE Declaration:** This device complies with the Radio Equipment Directive (RED) 2014/53/EU.

**Warranty:** 12 months from date of purchase. See lot-systems.com/warranty for full terms.

**Support:** support@lot-systems.com | lot-systems.com/support

---

## Quick Start Card (separate insert, A6 double-sided)

**FRONT:**
```
COSMO® CIA
Quick Start

1  Charge: polished side down on any Qi pad
2  Setup: lot-systems.com → Settings → My Devices → + Add
3  Wait for blue LED → follow app instructions
4  Done. Notifications arrive automatically.

COPY button → logs to your LOT Log tab
```

**BACK:**
```
LED Guide
● Orange pulse   — Charging
● Green solid    — Charged
● White flash    — Copy logged
● Blue pulse     — Setup mode
● Red ×2         — Wi-Fi error

lot-systems.com
support@lot-systems.com
```

---

*PDF layout: Figma file `COSMO-CIA-Manual-v1.pdf` — exported at 300 DPI, A5 format, 12 pages.*
*Typography: Helvetica Neue (headings), Helvetica Neue Light (body), IBM Plex Mono (data/code)*
*Colour: Black + LOT Silver (#C0C0C0) accent*
