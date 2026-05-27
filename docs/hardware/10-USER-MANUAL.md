# COSMO Computer
## User Manual
**Model:** CC-R1 · Rev A  
**Brand:** COSMO® CIA / LOT Systems  
**Firmware:** v1.0.0  

---

```
                    ┌────────────────┐
                    │                │
                    │   COSMO®       │
                    │                │
                    │   Computer     │
                    │                │
                    └────────────────┘
                     Polished  Silver
                     316L Stainless Steel
```

---

# Welcome

Your **COSMO Computer** is a personal intelligence terminal connected to your LOT Systems account at **lot-systems.com**.

It receives AI-powered notifications from your LOT System — reminders, wellness cues, environmental alerts — and displays them on its screen. When a notification resonates, press **COPY** to log it to your account's Log tab.

It knows the time. It reads the air. It speaks from your LOT System.

---

# Contents of Box

- COSMO Computer (1×)
- COSMO Charger — wireless charging pad (1×)
- USB-C cable, 1 m braided (1×)
- Quick Start Card (1×)
- Claim Code sticker — inside flap of box lid

---

# Physical Tour

```
FRONT (Side B):

┌─────────────────────────────┐
│                    [● CAM]  │  ← Camera (top right)
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   Notification      │    │
│  │   screen            │    │
│  │   1.3"  240×240     │    │
│  │                     │    │
│  └─────────────────────┘    │
│         [ COPY ]            │  ← COPY button (bottom centre)
│                         [·] │  ← Status light (top right dot)
└─────────────────────────────┘

BACK (Side A):

┌─────────────────────────────┐
│                             │
│       mirror-polished       │
│       stainless steel       │
│                             │
│         ·  ·  ·  ·          │  ← Wi-Fi window (invisible)
│         ·  ·  ·  ·          │
│         ·  ·  ·  ·          │
│         ·  ·  ·  ·          │
│                             │
└─────────────────────────────┘
Place this side DOWN on the charger.

BOTTOM EDGE:
                [USB-C] ← for initial setup / firmware flash only
```

---

# Step 1 — Claim Your Device

1. Visit **lot-systems.com** and log in to your account
2. Go to **Settings → Devices**
3. Click **"Link a new device"**
4. Enter the **Claim Code** from inside the box lid
5. Your device is now linked to your account

---

# Step 2 — Set Up Wi-Fi

Your COSMO Computer needs to connect to your home or office Wi-Fi (2.4 GHz).

**Using the LOT Companion app (recommended):**
1. Download **LOT Companion** from lot-systems.com/companion
2. Connect your computer to the COSMO Computer via USB-C
3. Open LOT Companion → click **"Configure Wi-Fi"**
4. Enter your Wi-Fi network name and password
5. Click **"Save"** — the device restarts and connects

**Using BLE provisioning (alternative):**
1. Hold **COPY button for 5 seconds** — LED turns purple
2. Open LOT Companion on your phone (iOS / Android)
3. Tap **"Find COSMO device"**
4. Select your COSMO Computer
5. Enter Wi-Fi credentials
6. Device restarts and connects automatically

---

# Step 3 — Device is Ready

When connected:
- The display shows your first notification (or "Waiting for messages...")
- The status light pulses **white slowly**
- Notifications from your LOT System begin arriving

---

# Using Your COSMO Computer

## Receiving Notifications

Notifications appear automatically on the screen. They come from:
- **LOT System** — AI-generated wellness reminders based on your Memory Story
- **COSMO Sensors** — Air quality, temperature alerts from the built-in sensors
- **LOT Platform** — Subscription updates, system messages

Example notifications:
```
 09:42  ⚡85%  22°C
─────────────────────
    Coffee time!

  From: LOT System
   2 minutes ago

      [ COPY ]
```

```
 10:15  ⚡83%  22°C
─────────────────────
  Air quality alert
    IAQ: 112 Fair

 From: COSMO Sensors
   just now

      [ COPY ]
```

## The COPY Button

Press **COPY** when a notification resonates with you.

This instantly logs the event to your **Log tab** on lot-systems.com, along with:
- The notification text
- Current time
- Environmental snapshot (temperature, humidity, air quality, battery)

Find your COPY log entries at: **lot-systems.com → Logs → COSMO entries**

---

# Charging

**Wireless charging (recommended):**
1. Place the COSMO Computer on the COSMO Charger pad
2. **Back (mirror-polished) face DOWN** on the pad
3. LED on charger glows white — charging is active
4. Full charge in approximately 95 minutes

**Charging indicator on device:**
- Battery icon in status bar shows charging animation
- LED: white slow pulse during charge

**USB-C (emergency only):**
Connect to any USB-C 5V charger. This is for firmware updates and emergency charging only — wireless charging is the intended everyday method.

---

# Status Light Guide

| Light | Meaning |
|-------|---------|
| White pulse (slow) | Connected, idle, all good |
| Blue pulse | New notification received |
| White 3× flash | COPY button registered |
| Green solid 2s | Firmware update complete |
| Yellow blink | Low battery (< 20%) — please charge |
| Red blink | Wi-Fi disconnected — check network |
| Purple pulse | Pairing mode (BLE provisioning) |

---

# Screen Brightness

The COSMO Computer adjusts screen brightness automatically based on ambient light (VEML7700 sensor).

To set brightness manually:
1. Go to **lot-systems.com → Settings → Devices → [Your Device]**
2. Adjust the **Display Brightness** slider
3. Change is pushed to device within 60 seconds

---

# Environmental Readings

Your COSMO Computer's sensors report to your LOT System account:

| Sensor | What it measures | Where it shows |
|--------|-----------------|----------------|
| BME688 | Temperature, humidity, air pressure | System tab weather |
| BME688 AI | Indoor Air Quality (IAQ 0–500) | System tab environment |
| BME688 AI | CO₂ equivalent (ppm) | System tab environment |
| IMU | Activity (stationary / walking) | System tab activity |
| Light sensor | Ambient light (lux) | Used for auto-brightness |

**IAQ Guide:**
```
0–50   ← Excellent
51–100 ← Good
101–150 ← Lightly polluted
151–200 ← Moderately polluted
201–250 ← Heavily polluted
251+   ← Severely polluted → ventilate room
```

---

# Camera

The camera is used for:
1. **Device pairing** — Scanning a QR code during initial setup
2. **Photo capture** — Manually upload a photo to your LOT profile

To capture a photo: *[Feature coming in firmware v1.1]*

---

# Firmware Updates

Your COSMO Computer updates its firmware automatically over Wi-Fi when an update is available.

You will see:
- Display: "Updating firmware... Do not unplug"
- LED: green slow pulse during update
- LED: green solid 2 seconds when complete
- Device restarts automatically

Do not charge or move the device during an OTA update (approximately 2 minutes).

---

# Factory Reset

Hold **COPY button for 10 seconds** → LED turns red → release.

This erases:
- Wi-Fi credentials
- Auth token

This does NOT erase:
- Your device serial (factory-set)
- Your LOT account link (managed on lot-systems.com)

After factory reset, re-configure Wi-Fi (see Step 2).

---

# Troubleshooting

| Problem | Solution |
|---------|---------|
| Screen is blank | Check battery; place on charger for 10 minutes |
| Red LED blinking | Wi-Fi disconnected; check your router is on and 2.4 GHz is enabled |
| "Waiting for messages..." | Verify claim code entered at lot-systems.com → Settings → Devices |
| COPY button not logging | Check Wi-Fi connection (red LED = disconnected) |
| Device won't charge wirelessly | Ensure back (polished) face is down on pad; remove any case |
| Screen too dim | Adjust brightness at lot-systems.com → Settings → Devices |
| Device won't connect to 5 GHz Wi-Fi | COSMO Computer uses 2.4 GHz only; switch router to 2.4 GHz or enable dual-band |
| "DEVICE_NOT_CLAIMED" on companion app | Enter claim code at lot-systems.com → Settings → Devices |

---

# Technical Specifications

| Parameter | Value |
|-----------|-------|
| Dimensions | 40 × 40 × 7 mm |
| Weight | ~38 g |
| Display | 1.3" TFT IPS, 240×240 pixels |
| Battery | 300 mAh LiPo |
| Charging | Qi wireless, 5W; USB-C emergency |
| Battery life | ~18–24 hours (standard use) |
| Wi-Fi | 802.11 b/g/n, 2.4 GHz |
| Bluetooth | BLE 5.0 (provisioning only) |
| Camera | 2 MP OV2640 |
| Weather sensor | Bosch BME688 (AI-grade) |
| IMU | ST LSM6DSO32 (AI core) |
| Body | 316L stainless steel (2-part CNC) |
| Side A | Mirror polished (electro-polished) |
| Side B | Brushed #4 satin |
| Water resistance | IP52 (splash resistant) |
| Operating temperature | -20°C to +70°C |

---

# Safety Information

- Do not immerse in water. IP52 splash resistant only.
- Do not expose to temperatures above 70°C (e.g., direct sunlight in a closed car).
- The stainless steel body may become warm during wireless charging — this is normal.
- If the device feels excessively hot (> 55°C), remove from charger immediately.
- Do not attempt to open or modify the device — the body is sealed with screws and a gasket.
- Dispose of according to local WEEE regulations. The LiPo battery must be recycled separately.
- Keep away from strong magnets (> 100 mT) — may affect compass calibration.

---

# Warranty

COSMO Computer is warranted against defects in materials and workmanship for **12 months** from date of shipment.

Warranty does not cover:
- Physical damage (drops, scratches)
- Water damage beyond IP52 rating
- Damage from unauthorised modification

Contact: **support@lot-systems.com**

---

# Contact

**LOT Systems**  
support@lot-systems.com  
lot-systems.com  

**COSMO® CIA**  
Inventor: Vadik Marmeladov  
institute.lot-systems.com

---

*COSMO® is a registered trademark of LOT Systems.*  
*© 2026 LOT Systems. All rights reserved.*

---

> **PDF Export Note:** This document is formatted for PDF export at A5 size, portrait orientation. Use `pandoc 10-USER-MANUAL.md -o COSMO-User-Manual.pdf --pdf-engine=wkhtmltopdf -V papersize:a5` or print from browser at A5.
