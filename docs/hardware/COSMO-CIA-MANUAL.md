<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® CIA — User Manual

**Document:** COSMO-CIA-MANUAL.md
**Version:** 1.0
**Prepared:** May 29, 2026
**Applies to:** COSMO® CIA hardware revision A, firmware v1.0

---

## What is COSMO® CIA?

**COSMO® CIA** (Connected Intelligence Agent) is a small ambient notification device, 40 × 40 × 5 mm, that brings your LOT System to life in the physical world.

It sits on your desk, charges wirelessly on its dock, and glows to life whenever lot-systems.com has something to tell you — a wellness reminder, a self-care nudge, a weather note, or a custom message you've set. When a notification feels right, you press **COPY** and it lands in your LOT Log.

No app. No phone. No distraction. Just signal.

---

## In The Box

- 1 × COSMO® CIA device (40 × 40 × 6 mm, stainless steel)
- 1 × Wireless charging dock (40 × 40 × 8 mm, stainless steel)
- 1 × USB-C cable (1 m, white)
- 1 × Quick-start card
- 1 × Warranty & safety leaflet

---

## Hardware Overview

```
FRONT                              BACK
┌────────────────────────────┐     ┌────────────────────────────┐
│                            │     │                            │
│   ┌────────────────────┐   │     │                            │
│   │  Notification      │   │     │         LOT®               │
│   │  display           │   │     │                            │
│   │  (128 × 128 px)    │   │     │                            │
│   └────────────────────┘   │     │                            │
│        ●  Camera           │     │         Serial             │
│   ════════ COPY ═════════  │     │         Number             │
└────────────────────────────┘     └────────────────────────────┘
```

| Feature          | Description                                              |
|-----------------|----------------------------------------------------------|
| **Display**      | 1.5" color OLED, 128 × 128 pixels                       |
| **Camera**       | 2 MP, for QR code pairing                               |
| **COPY button**  | Full-width button: copies notification to your LOT Log  |
| **Back face**    | Mirror-polished stainless steel                         |
| **USB-C port**   | Located on one edge (firmware updates, backup charge)   |
| **Qi coil**      | Embedded, aligns magnetically with charging dock        |

---

## First-Time Setup

### Step 1 — Charge the device

Place COSMO® CIA face-up on the charging dock. The dock LED turns green. Charge for at least 30 minutes before first use.

### Step 2 — Open LOT Settings on your phone or computer

1. Go to **lot-systems.com** and log in.
2. Open **Settings → Devices**.
3. Tap **"Pair CIA Device"**.
4. A QR code appears on your screen (valid for 10 minutes).

### Step 3 — Pair

1. Pick up COSMO® CIA from the dock.
2. Hold the camera side (front face) toward your screen.
3. The camera scans the QR code automatically.
4. The display shows **"✓ Connecting…"** then **"✓ Welcome, [Your Name]"**.

### Step 4 — Connect to Wi-Fi

If your device is on a new Wi-Fi network, the display will prompt you to send Wi-Fi credentials via the LOT app during the pairing step (BLE provisioning). Enter your Wi-Fi SSID and password when prompted on the LOT site.

That's it. COSMO® CIA is now connected to your LOT account and will begin receiving notifications.

---

## Daily Use

### Receiving a Notification

When lot-systems.com has something for you, the display wakes and shows:

```
LOT®                    ▌78%

☀  Coffee time!
Your morning ritual
awaits

── COPY to Log ──────────
```

The buzzer plays a soft two-tone chime (can be adjusted in Settings → Devices → Chime volume, or disabled).

### Pressing COPY

When you want to acknowledge a notification and log it:

1. Press the **COPY** button (the wide bar at the bottom of the device).
2. The display briefly shows **"✓ Logged"**.
3. In your LOT Log tab, a new entry appears:

```
[COSMO CIA]  "Coffee time!" — acknowledged at 9:46 AM
             22.4°C · 45% RH · 1013 hPa  ·  May 29, 2026
```

### Ignoring a Notification

Simply don't press COPY. The display returns to the idle screen after 60 seconds.

### Idle Screen

When no notification is active, the display shows your ambient data:

```
LOT®                    ▌78%

22.4°C  45% RH
1013 hPa

── No new messages ──────
9:45 AM  May 29
```

---

## Charging

### Wireless (recommended)

Place COSMO® CIA face-up, centered on the charging dock. The magnets snap it into alignment. The dock LED turns solid green while charging and dims when full.

- Full charge time: ~1.2 hours from empty
- Daily top-up: leave on dock overnight

### USB-C (backup)

Plug a USB-C cable into the port on the device edge. Charge time: ~45 minutes from empty. The display shows a charging indicator.

> **Do not use fast chargers (>10W) on the USB-C port.**  
> The device accepts a maximum of 5V/2A. Use the included cable and a standard 5W USB-C adapter.

---

## Sending a Custom Message

You can send any message to your CIA device from the LOT site:

1. Go to **Settings → Devices** on lot-systems.com.
2. Select your device.
3. Type your message in **"Send a message to device"**.
4. Press **Send**. The message appears on the device within seconds.

Useful for reminders, notes to yourself, or anything you want physically in front of you.

---

## Weather Sensor

COSMO® CIA contains a Bosch BME280 sensor that measures:
- **Temperature** (±0.5 °C accuracy)
- **Relative Humidity** (±3% accuracy)
- **Barometric Pressure** (±1 hPa accuracy)

The device sends readings to your LOT account every 60 seconds. This data:
- Appears on the idle screen
- Is recorded with each COPY button press
- Can supplement your public profile weather display

To disable sensor sync: **Settings → Devices → [Device name] → Weather sync → Off**

---

## LED and Sound Reference

| Event                  | Display                    | Sound             |
|-----------------------|----------------------------|-------------------|
| New notification       | Screen wakes, text appears | 2-tone chime      |
| COPY button pressed    | "✓ Logged" for 1.5 s       | Single short beep |
| Low battery (≤20%)     | Battery icon flashes red   | 3 short beeps     |
| Connected to Wi-Fi     | "✓ Connected"              | Rising 3-tone     |
| Wi-Fi disconnected     | "⚠ Offline"               | Descending tone   |
| Charging (on dock)     | Charging icon appears      | Silent            |
| OTA update complete    | "✓ Updated v1.1"           | Success chime     |

---

## Firmware Updates

COSMO® CIA updates its own firmware automatically over Wi-Fi when you are connected and the device is charging. The update process:

1. You receive a notification: **"Update available: v1.1"**
2. Press COPY to approve (or it auto-installs after 24 hours)
3. Device displays **"Updating… do not unplug"**
4. Device restarts, shows **"✓ Updated to v1.1"**

Never disconnect power during an update.

---

## Troubleshooting

### Display shows "⚠ Offline"

The device has lost Wi-Fi connection. Check:
- Is your Wi-Fi router on?
- Did your Wi-Fi password change? Re-pair the device from Settings → Devices.
- Is the device in range? Bring closer to router.

### No notifications arriving

- Check your LOT notification settings: **Settings → Notifications**
- Ensure the device is shown as "Online" in **Settings → Devices**
- Try sending a manual message from the site to test connectivity

### COPY button not responding

- Ensure the display is showing an active notification (not the idle screen)
- Press firmly for at least 0.3 seconds
- If still unresponsive, restart the device (hold COPY for 10 seconds)

### Device not charging on dock

- Ensure device is centered (magnets should click)
- Check dock LED — if off, check USB-C cable and power source
- Clean the contact area with a dry cloth

### Camera not scanning QR code

- Hold device 15–25 cm from the screen
- Ensure good lighting (not in direct bright sunlight)
- Make sure the entire QR code is visible to the camera
- Try increasing screen brightness

### Hard reset

Hold the COPY button for **15 seconds** until the display shows **"FACTORY RESET"**. Release, then hold again for 3 seconds to confirm. This clears all Wi-Fi credentials and device token. You will need to re-pair.

---

## Care & Maintenance

| Material   | Care                                                              |
|-----------|-------------------------------------------------------------------|
| Polished back | Wipe with microfiber cloth. Avoid abrasives.                 |
| Front face   | Gorilla Glass cover; wipe with slightly damp cloth.          |
| Stainless steel | Does not rust. Polish with SS-specific cloth if needed.  |
| Camera lens  | Blow dust off; wipe gently with lens cloth only.            |
| General      | Do not submerge. Splash-resistant only (IP44).               |

---

## Specifications

| Attribute        | Value                          |
|-----------------|--------------------------------|
| Dimensions       | 40 × 40 × 6 mm                |
| Weight           | ~30 g                          |
| Body             | 304/316 Stainless Steel        |
| Display          | 1.5" OLED, 128×128 px, 65K color|
| Camera           | 2 MP, for QR pairing           |
| Sensor           | Temp / Humidity / Pressure     |
| Wi-Fi            | 802.11 b/g/n 2.4 GHz           |
| Bluetooth        | BLE 5.0 (provisioning only)    |
| Battery          | 150 mAh LiPo                   |
| Standby time     | ~14 hours                      |
| Charging         | Qi wireless 5W / USB-C 5V 2A   |
| IP rating        | IP44 (splash resistant)        |
| Operating temp   | 0 °C – 50 °C                   |
| Certifications   | FCC Part 15, CE, RoHS          |

---

## Legal

© 2026 LOT Systems, Inc. All rights reserved.

**LOT®** and **COSMO®** are registered trademarks of LOT Systems, Inc.

This product contains a rechargeable lithium polymer battery. Do not expose to extreme heat, pierce, or dispose of in household waste. Follow local regulations for battery disposal.

FCC ID: 2AC7Z-ESP32S3MINI1 (radio module)

**Support:** support@lot-systems.com  
**Website:** lot-systems.com  
**Brand:** brand.lot-systems.com

---

*COSMO® CIA — Physical intelligence. Yours.*  
*COSMO® CIA is a product of LOT Systems Corporation.*  
*Made in the USA. Assembled in partnership with PCBWay.*
