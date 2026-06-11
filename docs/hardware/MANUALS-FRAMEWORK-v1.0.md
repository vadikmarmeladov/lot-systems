<!--
  LOT SYSTEMS CORPORATION
  LOT Computer — PDF Manuals Framework v1.0
  2026-06-11
-->

# LOT Computer — PDF Manuals Framework
## MANUALS-FRAMEWORK-v1.0 | 2026-06-11

**Classification:** Internal — Documentation
**Output format:** PDF (generated from Markdown via Pandoc + LaTeX)
**Target audience:** End users + hardware engineers + firmware developers

---

## 1. Manual Set Overview

The LOT Computer ships with and references four PDF manuals. Each is generated from a separate Markdown source file using Pandoc.

| Manual | Filename | Pages | Audience |
|--------|----------|-------|---------|
| Quick Start Guide | `LOT-Computer-Quick-Start.pdf` | 4 | End user |
| User Manual | `LOT-Computer-User-Manual.pdf` | 24 | End user |
| Technical Reference | `LOT-Computer-Technical-Reference.pdf` | 48 | Hardware engineers |
| Firmware Developer Guide | `LOT-Computer-Firmware-Dev-Guide.pdf` | 32 | Firmware developers |

---

## 2. PDF Generation Pipeline

### 2.1 Prerequisites

```bash
# Install Pandoc
brew install pandoc         # macOS
apt-get install pandoc      # Linux

# Install LaTeX (for PDF output)
brew install basictex       # macOS minimal
apt-get install texlive-latex-recommended  # Linux

# Install fonts (LOT brand)
# Montserrat for headings, Inter for body
# Place in ~/.fonts/ or /usr/share/fonts/
```

### 2.2 Build Script (`docs/hardware/manuals/build-pdfs.sh`)

```bash
#!/bin/bash
set -e

MANUALS_DIR="docs/hardware/manuals"
OUTPUT_DIR="docs/hardware/manuals/output"
TEMPLATE="$MANUALS_DIR/templates/lot-manual.tex"

mkdir -p "$OUTPUT_DIR"

build_manual() {
  local name=$1
  local src=$2
  echo "Building: $name"
  pandoc "$MANUALS_DIR/src/$src.md" \
    --template="$TEMPLATE" \
    --pdf-engine=xelatex \
    --variable=title:"$name" \
    --variable=brand:"LOT Systems" \
    --variable=product:"LOT Computer" \
    --variable=version:"1.0" \
    --variable=date:"$(date +%Y-%m-%d)" \
    --toc \
    --highlight-style=tango \
    -o "$OUTPUT_DIR/$src.pdf"
  echo "  → $OUTPUT_DIR/$src.pdf"
}

build_manual "Quick Start Guide"       "LOT-Computer-Quick-Start"
build_manual "User Manual"             "LOT-Computer-User-Manual"
build_manual "Technical Reference"     "LOT-Computer-Technical-Reference"
build_manual "Firmware Developer Guide" "LOT-Computer-Firmware-Dev-Guide"

echo "All manuals built in $OUTPUT_DIR"
```

### 2.3 LaTeX Template (`lot-manual.tex`)

Key styling elements:
- LOT® brand colors: Primary #0A0A0A (black), Accent #C0C0C0 (silver)
- Montserrat Bold for section headers
- Inter Regular 11pt for body text
- Full-bleed cover page with LOT® logo
- Header: LOT® logo left, document title right
- Footer: Page number center, lot-systems.com right
- Code blocks: monospace, dark background (#1A1A1A), silver text

---

## 3. Manual 1 — Quick Start Guide

**File:** `manuals/src/LOT-Computer-Quick-Start.md`
**Pages:** 4 (double-sided = 1 sheet)
**In-box:** Yes — printed, folded

### Content Outline

```
PAGE 1 — COVER
  LOT® logo (large)
  "LOT Computer"
  "Quick Start Guide"
  lot-systems.com

PAGE 2 — WHAT'S IN THE BOX + SETUP
  ┌─────────────────────────────────┐
  │ What's in the box               │
  │  1. LOT Computer device         │
  │  2. Wireless charging pad       │
  │  3. USB-A to USB-C cable        │
  │  4. Activation QR card          │
  │  5. This guide                  │
  └─────────────────────────────────┘
  
  Step 1: Scan the QR code
  [QR placeholder image]
  Open lot-systems.com/device/activate
  Log in to your LOT account
  
  Step 2: Connect to Wi-Fi
  Your device will show "LOT-XXXX" in Bluetooth
  Open LOT app → Devices → Add LOT Computer
  Enter your Wi-Fi credentials

  Step 3: Place on charging pad
  [Illustration: device on pad, LED breathing]
  Green breathing light = charging
  First charge takes ~45 minutes

PAGE 3 — USING YOUR LOT COMPUTER
  The Display
  [Illustration of screen showing notification]
  Your LOT Computer receives notifications from lot-systems.com

  The COPY Button
  [Illustration: button highlighted]
  Press once to save the notification to your Log
  Press twice to see next notification
  Hold 2s to enter pairing mode

  Charging
  [Illustration: device on wireless pad]
  Place device on charging pad — any Qi-standard pad works
  USB-C port on right edge for emergency charge

  The Mirror
  [Illustration: back of device, mirror reflection]
  The back is a mirror. Look at it.
  The LOT Computer remembers that.

PAGE 4 — CARE + SUPPORT
  Cleaning: Soft microfiber cloth. No solvents.
  Mirror back: Fingerprints are normal. Polish with cloth.
  Temperature: Store 0°C–40°C. Operate 0°C–50°C.
  Water: IP52 — splash resistant. Not waterproof.
  
  Support: lot-systems.com/support
  Firmware updates: Automatic (when on Wi-Fi)
  
  LOT® | COSMO® | brand.lot-systems.com
  © 2026 LOT Systems, Inc. Made in USA.
```

---

## 4. Manual 2 — User Manual

**File:** `manuals/src/LOT-Computer-User-Manual.md`
**Pages:** 24
**Distribution:** Digital PDF + printed in box (folded booklet)

### Table of Contents

```
1. Welcome to LOT Computer .............. 2
2. Your Device at a Glance .............. 3
3. Setting Up ........................... 4
   3.1 What's in the Box ................ 4
   3.2 Activating Your Device ........... 5
   3.3 Connecting to Wi-Fi .............. 6
   3.4 First Charge ..................... 7
4. Notifications ........................ 8
   4.1 How Notifications Work ........... 8
   4.2 Notification Types ............... 9
   4.3 Reading the Display .............. 10
5. The COPY Button ...................... 11
   5.1 Single Press ..................... 11
   5.2 Double Press ..................... 12
   5.3 Long Press (Pairing Mode) ........ 12
6. Charging ............................ 13
   6.1 Wireless Charging ................ 13
   6.2 USB-C Charging ................... 14
   6.3 Battery Life ..................... 14
7. Sensors ............................. 15
   7.1 Environmental Monitoring ......... 15
   7.2 How Sensor Data Helps You ........ 16
8. The Mirror Face ...................... 17
9. LOT Account Integration .............. 18
   9.1 Log Tab .......................... 18
   9.2 Device Settings .................. 19
10. Care & Maintenance .................. 20
11. Troubleshooting ..................... 21
12. Technical Specifications ............ 22
13. Regulatory & Safety ................. 23
14. Warranty ............................ 24
```

### Key Sections (Content Notes)

**Section 4 — Notifications:**
Explain the AI-powered notification system:
- lot-systems.com generates personalized reminders based on QOS patterns
- Examples: "Coffee time!", "Energy peak window", "Hydration check"
- Notifications appear automatically — device wakes from sleep
- Screen auto-dims after 30 seconds

**Section 7 — Sensors:**
Explain in plain language what BME688 measures and how it enriches the user's LOT profile. Frame it as: "Your LOT Computer learns the quality of your environment."

**Section 8 — The Mirror Face:**
```
The back of your LOT Computer is a mirror.

This is intentional.

LOT Systems is built on the idea of self-awareness — understanding
who you are through how you live. The mirror is a physical reminder
of that principle.

Look at it when you pick up the device. That's the point.
```

---

## 5. Manual 3 — Technical Reference

**File:** `manuals/src/LOT-Computer-Technical-Reference.md`
**Pages:** 48
**Distribution:** Digital PDF only

### Table of Contents

```
1. Hardware Architecture ................ 2
2. PCB Schematic (block diagram) ........ 6
3. Component Specifications ............. 10
   3.1 MCU — ESP32-S3 .................. 10
   3.2 Display — SSD1306 ............... 12
   3.3 Camera — OV2640 ................. 14
   3.4 Environmental Sensor — BME688 ... 16
   3.5 IMU — ISM330DHCX ................ 18
   3.6 Wireless Charging — STWLC38 .... 20
4. Pin Assignments ...................... 22
5. Power Architecture ................... 26
6. Antenna & RF ......................... 29
7. Physical Design ...................... 32
8. Manufacturing Specifications ......... 36
9. Regulatory Compliance ................ 40
10. Environmental Ratings ............... 42
11. Revision History .................... 44
```

### Section 4 — Pin Assignments (Sample)

```
ESP32-S3 → SSD1306 OLED (I2C)
  GPIO8  → SDA
  GPIO9  → SCL
  GPIO10 → RES (reset, active low)
  3.3V   → VCC
  GND    → GND

ESP32-S3 → BME688 (I2C, same bus)
  GPIO8  → SDA (address 0x76)
  GPIO9  → SCL
  3.3V   → VCC
  GND    → GND

ESP32-S3 → ISM330DHCX (I2C, same bus)
  GPIO8  → SDA (address 0x6A)
  GPIO9  → SCL
  GPIO34 → INT1 (tap interrupt)
  3.3V   → VCC
  GND    → GND

ESP32-S3 → OV2640 Camera (DVP)
  GPIO11 → PWDN
  GPIO12 → RESET
  GPIO13 → XCLK (20MHz)
  GPIO14 → PCLK
  GPIO15 → VSYNC
  GPIO16 → HREF
  GPIO17 → D0
  GPIO18 → D1
  GPIO21 → D2
  GPIO38 → D3
  GPIO39 → D4
  GPIO40 → D5
  GPIO41 → D6
  GPIO42 → D7
  GPIO47 → SDA (camera I2C)
  GPIO48 → SCL (camera I2C)

ESP32-S3 → Button
  GPIO21 → COPY button (pull-up, active low)

ESP32-S3 → LED
  GPIO22 → LED anode (via 33Ω resistor)

ESP32-S3 → STWLC38 (I2C)
  GPIO8  → SDA
  GPIO9  → SCL
  GPIO33 → INT (charging interrupt)

USB-C → USB data (GPIO19/20, ESP32 USB-OTG)
```

---

## 6. Manual 4 — Firmware Developer Guide

**File:** `manuals/src/LOT-Computer-Firmware-Dev-Guide.md`
**Pages:** 32
**Distribution:** Digital PDF + GitHub wiki

### Table of Contents

```
1. Development Environment Setup ........ 2
   1.1 ESP-IDF Installation ............. 2
   1.2 Repository Setup ................. 4
   1.3 First Build ....................... 5
2. Firmware Architecture ................ 6
   2.1 FreeRTOS Task Map ................ 6
   2.2 Module Overview .................. 8
3. Flashing Firmware .................... 10
   3.1 Via USB-C ........................ 10
   3.2 OTA Update ....................... 11
4. Debug & Logging ...................... 12
5. LOT API Integration .................. 14
   5.1 Authentication ................... 14
   5.2 SSE Stream ....................... 15
   5.3 POST /api/device/log ............. 17
6. Sensor Configuration ................. 18
   6.1 BME688 BSEC Calibration .......... 18
   6.2 ISM330DHCX Tap Tuning ............ 20
7. Display Driver ........................ 22
8. Adding New Notification Types ........ 24
9. Power Management ..................... 26
10. Security — NVS + TLS ................ 28
11. Contributing & Versioning ........... 30
12. Changelog ........................... 32
```

---

## 7. Manual Production Checklist

For 100-unit pilot run:

- [ ] All 4 Markdown source files written
- [ ] LaTeX template finalized (LOT brand)
- [ ] PDF generation script verified
- [ ] Quick Start: printed 110 copies (100 + 10 spare), folded, in box
- [ ] User Manual: PDF uploaded to lot-systems.com/support/lcm-001
- [ ] Technical Reference: PDF uploaded to lot-systems.com/support/lcm-001
- [ ] Firmware Developer Guide: PDF on GitHub wiki + lot-systems.com/support

---

## 8. Regulatory Notices (Included in User Manual p.23)

```
FCC NOTICE:
This device complies with Part 15 of the FCC Rules. Operation is
subject to the following two conditions: (1) This device may not cause
harmful interference, and (2) this device must accept any interference
received, including interference that may cause undesired operation.

FCC ID: [TO BE ASSIGNED]

CE NOTICE:
LOT Computer — LCM-001 complies with the essential requirements of
the Radio Equipment Directive 2014/53/EU.

RoHS:
This product complies with Directive 2011/65/EU (RoHS II).
No lead, mercury, cadmium, hexavalent chromium, PBB, PBDE, DEHP,
BBP, DBP, or DIBP exceeding restricted concentrations.

Battery disposal:
Li-Po battery. Do not dispose in household waste.
Return to LOT Systems or authorized e-waste facility.

California Proposition 65:
⚠ This product can expose you to chemicals known to the State of
California to cause cancer or reproductive harm.
For more information: www.P65Warnings.ca.gov
```

---

*LOT COMPUTER MANUALS FRAMEWORK v1.0 — COMPLETE*
*© 2026 LOT Systems. All rights reserved.*
