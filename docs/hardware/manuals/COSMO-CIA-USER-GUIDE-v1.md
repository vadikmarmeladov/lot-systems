<!--
  LOT SYSTEMS CORPORATION — COSMO® CIA
  User Guide v1.0 — Source for PDF export
  Prepared: 2026-06-15
-->

# COSMO® CIA
## User Guide — v1.0

*A LOT Systems device. brand.lot-systems.com*

---

## 1. What Is COSMO® CIA?

COSMO® CIA is a personal notification device from LOT Systems. It fits in your palm, sits on your desk, or clips to your bag. It receives short, human messages from your LOT account — things like "Coffee time!" or "Time to move." — and displays them on a small screen.

One button. One action. No app needed.

COSMO® CIA is part of the COSMO® hardware family, designed to bring your digital LOT system into the physical world — quietly, beautifully, without a phone screen.

---

## 2. In the Box

| Item | Qty |
|------|-----|
| COSMO® CIA device | 1 |
| Wireless charging pad | 1 |
| USB-C cable (for charging pad) | 1 |
| Quick start card | 1 |
| This user guide | 1 |

---

## 3. First Charge

Before pairing, charge the device fully.

1. Place the COSMO® CIA **face down** on the charging pad. The polished back faces down, onto the polished pad.
2. Align the device to the centre of the pad. A faint magnetic pull helps guide alignment.
3. The button LED glows white while charging.
4. LED turns off when fully charged (~90 minutes from empty).
5. Battery lasts **8–12 hours** in normal use.

> Do not use the device while charging. Place the pad on a flat, non-metallic surface.

---

## 4. Pairing with Your LOT Account

You pair COSMO® CIA once. After that, it connects to your Wi-Fi automatically.

### Step 1 — Generate a device token
1. Open lot-systems.com on your phone or computer
2. Go to **Settings → Hardware → Pair New Device**
3. Name your device (e.g., "Desk CIA")
4. Tap **Generate Token** — a QR code appears on screen

### Step 2 — Enter provisioning mode on COSMO® CIA
1. Hold the Copy button for **3 seconds**
2. The screen shows: `SCAN QR`

### Step 3 — Point the camera at the QR code
1. Hold the QR code 5–10cm from the camera aperture (small circle on front face)
2. The screen shows: `SCANNING...` then `PAIRED ✓`
3. The device automatically connects to your Wi-Fi and syncs with LOT

> Your Wi-Fi network must be 2.4GHz. The device does not support 5GHz.

---

## 5. Receiving Notifications

Your LOT account sends notifications to your COSMO® CIA based on your wellness patterns, QOS mode, and time of day.

When a notification arrives:
- The screen displays the message: e.g., `Coffee time!`
- The button LED flashes once
- The message stays on screen until you press Copy or it expires (2 hours)

Multiple pending notifications scroll in sequence.

**Example notifications:**
- `Coffee time!`
- `Hydrate now.`
- `Time to move.`
- `QOS: recovery mode`
- `Quiet reading time.`

You do not control which notifications you receive — your LOT system generates them based on your patterns. This is intentional.

---

## 6. The Copy Button

The single button on the front face of COSMO® CIA is labelled Copy.

| Press | Action |
|-------|--------|
| Single press | Acknowledge the current notification. Logs the moment to your LOT Log tab. |
| Double press | Take a camera snapshot. Uploads to your LOT account. |
| Hold 3 seconds | Enter Wi-Fi pairing mode. |
| Hold 10 seconds | Factory reset. All data erased. |

When you press Copy:
- The notification is marked as acknowledged
- A timestamped entry appears in your **Log tab** on lot-systems.com:
  `[09:01]  COSMO® CIA  ·  Copy  ·  Coffee time!  ·  🔋84%`
- The LOT Memory Engine notes your response time and adjusts future notification timing

---

## 7. The Screen

The screen is a small OLED display. It shows:

```
╔══════════════════╗
║ ● 09:14    🔋84% ║   ← time + battery
║                  ║
║  Coffee time!    ║   ← notification text
║                  ║
║  [■ Copy]        ║   ← button prompt
╚══════════════════╝
```

Status indicators:
- `●` — Wi-Fi connected
- `○` — Wi-Fi searching
- `⟳` — Syncing
- `🔋` — Battery percentage

When no notification is pending:
```
╔══════════════════╗
║ ● 09:14    🔋84% ║
║ 22°C  IAQ 72     ║   ← sensor readings
║                  ║
║  lot-systems.com ║
╚══════════════════╝
```

---

## 8. Weather & Air Quality Data

The sensor on the back of the device (small vent) measures:
- **Temperature** (°C)
- **Humidity** (%)
- **Barometric pressure** (hPa)
- **Air Quality Index (IAQ)** — 0 (excellent) to 500 (very poor)

This data is uploaded to your LOT account and appears in your public profile (if enabled) under the Weather block.

The sensor needs **5 minutes** after power-on to stabilise. IAQ readings are marked with accuracy 0–3; values with accuracy ≥ 2 are reliable.

---

## 9. Camera

The camera aperture is the small circle on the front face, beside the button.

**Double-press** the Copy button to take a photo. The photo is stored and uploaded to your LOT account.

The camera is not a streaming camera. It takes single still images on demand.

**QR code provisioning:** The camera also reads QR codes during the pairing process (see Section 4).

---

## 10. Battery & Charging

| Indicator | Meaning |
|-----------|---------|
| 🔋 100–50% | Normal |
| 🔋 49–15% | Monitor |
| 🔋LOW | Charge soon — polling slows to save power |
| LED flashing red | Battery critically low — place on charger |

**Charging:**
- Place device face-down on wireless charging pad
- Use the included USB-C cable and any USB-C charger (≥ 5W)
- Do not use third-party wireless charging pads — alignment may differ

**Full charge:** ~90 minutes from empty
**Battery life:** 8–12 hours active use

---

## 11. Troubleshooting

| Problem | Solution |
|---------|---------|
| Screen blank | Battery dead — charge for 10 minutes, then power on |
| `ERR 0x02` on screen | Wi-Fi not reachable — check router |
| `ERR 0x03` on screen | API token expired — re-pair in LOT Settings |
| `REVOKED` on screen | Token revoked by account — generate a new token |
| No notifications received | Check LOT account — Hardware must be enabled in Settings |
| Won't pair via QR | Ensure QR code is well-lit, hold 5–10cm from camera |
| Wi-Fi won't connect | Only 2.4GHz networks are supported |
| Device feels warm | Normal during charging — stop if uncomfortably hot |
| Factory reset needed | Hold button 10 seconds — screen shows `RESET ✓` |

---

## 12. Regulatory

**FCC Notice:** This device contains FCC ID 2BBQ2-ESP32S3MINI1. This device complies with Part 15 of the FCC Rules. Operation is subject to the following conditions: (1) this device may not cause harmful interference, and (2) this device must accept any interference received, including interference that may cause undesired operation.

**CE Notice:** This product complies with the Radio Equipment Directive (2014/53/EU) via modular certification.

**RoHS:** This product complies with EU RoHS 2 Directive (2011/65/EU).

**Qi:** Wireless charging compliant with WPC Qi standard.

**Battery disposal:** This device contains a lithium-ion battery. Do not dispose in household waste. Recycle in accordance with local regulations (WEEE).

---

## 13. Warranty & Support

**Warranty:** 12 months from purchase. Covers manufacturing defects. Does not cover physical damage, water damage, or unauthorised modification.

**Support:** support@lot-systems.com

**Firmware updates:** Automatic, delivered via Wi-Fi. Requires device to be connected and charging.

**Privacy:** COSMO® CIA sensor data is stored in your LOT account only. It is never sold or shared. You can delete all hardware data at any time via Settings → Hardware → Delete Device Data.

---

*COSMO® CIA — by LOT Systems*
*lot-systems.com | brand.lot-systems.com*
*© 2026 LOT Systems, Inc. All rights reserved.*
*Invented by Vadim Marmeladov. Named for Kuzya Cosmo Marmeladov.*
