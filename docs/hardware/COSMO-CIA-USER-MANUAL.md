# COSMO® CIA — User Manual
## Compact Intelligence Apparatus · Quick Start & Reference
**Version:** 1.0  
**For firmware:** 1.0.x  
**Document type:** End-user PDF manual  
**Format:** A5 (148 × 210 mm) — optimized for print + PDF

---

&nbsp;

---

# Welcome to COSMO®

Your COSMO® CIA is a personal intelligence device connected to LOT Systems.  
It receives messages from lot-systems.com, logs your actions, and keeps you informed — silently, precisely, without a phone in your hand.

**In the box:**
- COSMO® CIA device
- Qi wireless charging pad
- USB-C cable (0.5m)
- This quick-start card

---

## Part 1 — Getting Started

### 1.1 What You're Looking At

```
┌──────────────┐    ┌──────────────┐
│              │    │  ○  [SCREEN] │
│  (polished   │    │              │
│   surface)   │    │         [●]  │
│              │    │  ≋           │
└──────────────┘    └──────────────┘
  FRONT (top)         BACK (bottom)
```

**Front:** Mirror-polished stainless steel. COSMO® mark laser-etched.  
**Back:** Brushed steel. Contains all working elements:
- **Camera lens** (left, round aperture)
- **Screen** (center-right, 1-inch color display)
- **Copy button** (●, bottom-right)
- **Charge LED** (bottom-left)

---

### 1.2 First Charge

Place COSMO® CIA face-down on the included Qi charging pad.

```
    [COSMO on pad]
         ↓
    LED: amber blink   → Charging
    LED: solid green   → Full (100%)
```

Allow 90 minutes for a full charge from empty.

> **Note:** COSMO® CIA charges wirelessly only. No ports are exposed on the device. The charging pad uses the included USB-C cable connected to any 5V/2A USB adapter.

---

### 1.3 Powering On

COSMO® CIA powers on automatically when lifted from the charging pad or when you tap the screen face.

**Boot screen (3 seconds):**
```
  COSMO®
  CIA v1.0
  LOT Systems
```

After boot, the device connects to your WiFi network.

---

### 1.4 WiFi Setup

**First-time setup:**

1. Download the **LOT Systems** app or visit **lot-systems.com** on your phone
2. Go to **Settings → Devices → Add COSMO CIA**
3. Follow the on-screen pairing instructions
4. COSMO CIA briefly broadcasts a Bluetooth setup signal
5. Select your WiFi network and enter the password via the app
6. COSMO® CIA confirms connection on its screen:

```
  WiFi connected
  lot-systems.com ✓
  Ready
```

**Subsequent boots:** COSMO® CIA reconnects to saved WiFi automatically.

---

## Part 2 — Using COSMO® CIA

### 2.1 The Screen

The screen shows three zones:

```
┌────────────────────────────────┐
│ LOT                  10:42 AM  │  Header: time + connection status
├────────────────────────────────┤
│  ☁  72°F  AQI 42              │  Weather: from onboard sensors
├────────────────────────────────┤
│                                │
│   Coffee time!                 │  Notification text
│                                │
└────────────────────────────────┘
```

Notifications come from lot-systems.com automatically — no interaction required.

**Screen brightness** adjusts automatically based on ambient light (VEML7700 sensor).

---

### 2.2 Receiving Notifications

When lot-systems.com sends a notification:

1. Screen lights up (if sleeping)
2. Notification text appears
3. Subtle vibration pulse (haptic)
4. Notification stays for **8 seconds**, then returns to idle

**Long notifications** scroll horizontally. No action needed.

**Examples of notifications:**
```
  Coffee time!
  Stand up — you've been seated 90 min.
  Rain expected in 2 hours.
  New log entry from your team.
  System: Firmware updated to v1.0.3
```

---

### 2.3 The Copy Button

The **Copy button (●)** is the primary action on COSMO® CIA.

**Press once:**
- Sends the current notification + environmental context to your **Log tab** on lot-systems.com
- Haptic confirms: one short pulse
- Screen shows: `Sent ✓` for 1 second
- Log entry appears on lot-systems.com within 2 seconds

**What gets logged:**
```
📟 COSMO CIA · "Coffee time!" · 21.4°C · AQI 42 · 10:42 AM
```

You'll see this in your **Log** tab at lot-systems.com.

> **Use the Copy button** any time you want to mark a notification as significant, capture a moment, or signal back to the system that you've seen and acknowledged something.

---

### 2.4 Camera

COSMO® CIA has a 2MP camera on the back.

**To capture an image:**
- Press and hold the Copy button for **2 seconds**
- Screen flashes white (shutter)
- Image uploads to your account at lot-systems.com

Images appear in your **Captures** gallery on lot-systems.com.  
Camera images include the environmental context (time, temperature, AQI) as metadata.

> The camera aperture is on the back, left side. Point the back of the device at your subject.

---

### 2.5 Weather Sensor

COSMO® CIA continuously measures:

| Reading | Sensor | Display |
|---------|--------|---------|
| Temperature | BME688 | °C or °F (set in app) |
| Humidity | BME688 | %RH |
| Barometric pressure | BME688 | hPa |
| Air Quality Index | BME688 (AI) | 0–500 (lower is better) |

AQI ratings:
```
  0–50    Excellent
  51–100  Good
  101–150 Lightly polluted
  151–200 Moderately polluted
  201+    Seek fresh air
```

The BME688 uses Bosch AI algorithms to learn your environment over the first 5 days of use. AQI accuracy improves from Good (day 1) to High (day 5+).

---

### 2.6 Sleep & Wake

**Auto-sleep:** After 5 minutes without a notification, the screen turns off. The device stays connected and listening.

**Wake:** 
- Single tap on the device (IMU tap detection)
- A new notification arrives

**Deep sleep:** After 30 minutes of inactivity, COSMO® CIA enters deep sleep (<50µA). It still wakes for notifications.

---

## Part 3 — Sending Notifications from LOT Systems

### 3.1 Manual Send

From lot-systems.com → **My COSMO®** panel:

```
┌─────────────────────────────────┐
│  Send to COSMO®                 │
│                                 │
│  [ Type your message...   ]     │
│                    [Send →]     │
│                                 │
│  ● COSMO_001 · connected        │
└─────────────────────────────────┘
```

Type any message and press Send. It arrives on your device in under 3 seconds.

### 3.2 Automated Notifications

Configure automated notifications from **Settings → COSMO Automations**:

| Trigger | Example |
|---------|---------|
| Time of day | "Coffee time!" at 10:00 AM daily |
| Weather change | "Rain expected" when pressure drops 5hPa |
| Inactivity | "Stand up" after 90 minutes no log entries |
| AI-generated | Daily message based on your journal |
| Team event | "New reply from Vadik" |

---

## Part 4 — Maintenance

### 4.1 Cleaning

- **Polished front:** Wipe with a clean microfiber cloth. No liquids.
- **Brushed back:** Wipe with slightly damp microfiber cloth. Dry immediately.
- **Camera lens:** Soft lens cloth. Do not touch lens surface directly.
- **Screen:** Soft microfiber cloth. No solvents.

### 4.2 Charging

- Use only the included Qi charging pad and USB-C cable
- Operating temperature: 0°C – 45°C
- Do not charge in direct sunlight

### 4.3 Firmware Updates

Firmware updates install automatically when connected to WiFi. You'll see:

```
  Updating firmware
  v1.0.3 · Do not power off
  [████████░░] 80%
```

The update takes approximately 2 minutes. Do not remove from WiFi range.

To check firmware version: lot-systems.com → My COSMO® → Device Info.

---

## Part 5 — Troubleshooting

| Problem | Check |
|---------|-------|
| Screen blank, no response | Place on charger — battery may be empty |
| "Offline" shown on screen | Check WiFi — router restart or network change |
| Notifications not arriving | lot-systems.com → My COSMO® → Device status |
| Copy button not sending | Check lot-systems.com connection; offline queue sends on reconnect |
| AQI reads "Calibrating..." | Normal for first 5 days of use |
| Weak WiFi connection | Move closer to router; COSMO CIA is optimized for 2.4GHz networks |
| Screen flicker | Restart: hold Copy button 10 seconds (rare hardware reset) |

**Factory reset:**  
Hold Copy button for 15 seconds. Screen shows `Factory reset`. All settings cleared. Re-pair via lot-systems.com.

---

## Part 6 — Technical Specifications

| Specification | Value |
|---------------|-------|
| Dimensions | 40 × 40 × 5.5 mm |
| Weight | ~38 g |
| Enclosure | 316L stainless steel |
| Display | 1.0" color TFT, 80×160 px |
| Camera | 2MP OV2640, fixed focus |
| Connectivity | WiFi 802.11 b/g/n (2.4GHz), BLE 5.0 |
| Environmental sensor | Bosch BME688 (temp/humidity/pressure/AQI) |
| IMU | 6-axis (accelerometer + gyroscope) |
| Battery | 3.7V 280mAh Li-Polymer |
| Wireless charging | Qi v1.2, 5W |
| Battery life (active) | ~10 hours typical |
| Battery life (standby) | ~48 hours |
| Charge time | ~90 minutes |
| Operating temperature | 0°C to 45°C |
| Storage temperature | -20°C to 60°C |
| Firmware update | OTA (over-the-air) |
| Processor | ESP32-S3, dual-core 240MHz |

---

## Part 7 — Warranty & Support

**Warranty:** 1 year hardware warranty from date of purchase.  
Covers manufacturing defects. Does not cover physical damage, water damage, or unauthorized modification.

**Support:** lot-systems.com/support  
**Email:** support@lot-systems.com

---

*COSMO® is a registered trademark of LOT Systems.*  
*Document v1.0 · May 2026 · lot-systems.com*

---

&nbsp;

*This manual is available in PDF format at lot-systems.com/cosmo/manual*
