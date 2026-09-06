# LOT Node — Hardware Spec

## 1. Mechanical

### 1.1 Enclosure — 2-part stainless steel body

- **Footprint:** 40mm × 40mm (4×4cm), flat square, rounded 3mm corner radius
- **Height:** spec'd as 5mm in the brief; **not achievable** with the
  electronics stack below. Revised target: **11mm** (front cap 3.5mm +
  chassis 6mm + rear cap 1.5mm). Flagged in `LOT-COMPUTER-PLAN.md` §7.
- **Construction:** 2 pieces, press-fit + 4× M1.6 security screws (hidden
  under rear rubber feet)
  - **Front plate:** SUS304 stainless steel, bead-blasted matte finish,
    machined cutouts for camera lens, display window, button
  - **Rear plate:** SUS304 stainless steel, **mirror-polished** (brief item 17)
- **Material:** SUS304 (cost-effective, good machinability) or SUS316 (better
  corrosion resistance, +~15% cost) — SUS304 recommended for v1
- **Process:** CNC milling from bar stock, bead blasting (front) + mechanical
  polishing (rear), passivation finish

### 1.2 Face layout

| Face | Contents |
|---|---|
| **Front** (brief item 18) | Camera lens (top), 1.3" round display (center), single button (bottom) |
| **Rear** (brief item 17) | Polished mirror finish, laser-etched LOT wordmark, Qi charging accepts through this face |

## 2. Electronics

### 2.1 Compute / connectivity

- **MCU:** ESP32-S3 (dual-core, Wi-Fi + BLE, hardware JPEG for camera,
  enough RAM/PSRAM to drive a round LCD without external frame buffer chip)
- Chosen because it is a single off-the-shelf module that covers Wi-Fi,
  camera interface, and display driving — minimizes BOM line count for a
  100-unit run (brief item 15 — "AI-grade off-the-shelf sensors", extended
  here to off-the-shelf compute).

### 2.2 Display

- 1.3" round IPS LCD (GC9A01 driver), SPI interface — round shape suits a
  square puck better visually than a rectangular panel, keeps the
  "pager-like notification" (brief item 2) legible from arm's length in short
  text bursts (e.g. "Coffee time!").

### 2.3 Camera (brief item 5)

- OV2640 2MP module (SPI/parallel to ESP32-S3), fixed-focus
- **Scope for v1 firmware:** presence/ambient-light-assisted wake, and
  QR-code scan for Wi-Fi provisioning during first setup. No continuous
  recording, no cloud photo upload — this keeps the device consistent with
  the "your data stays yours" privacy stance already stated in the project's
  main `README.md`. Revisit scope with the inventor before committing
  firmware (see plan §7, risk 2).

### 2.4 Weather sensor (brief item 14)

- Bosch **BME280** — temperature / humidity / barometric pressure, I²C,
  widely available, already conceptually mirrored by the existing
  `WeatherResponse` model and public-profile weather fields in the LOT
  web app (`src/server/routes/api.ts` weather endpoint, `README.md` public
  profile section) — the device becomes a physical sensor feeding the same
  weather concept the site already tracks per-user.

### 2.5 Button (brief item 16)

- Single tactile push-button, "Copy" silkscreen/engraving
- Debounced in firmware; single press = one Log event; see
  `SOFTWARE-CONNECTOR.md` §4 for the exact API call it triggers.

### 2.6 Power + charging (brief items 12, 19)

- **Battery:** 1× LiPo 500mAh, 3.7V (flat profile, fits the puck's height budget)
- **Wireless charging receiver:** Qi-compliant receiver coil + PMIC
  (e.g. IDT/Renesas P9221 or equivalent) mounted behind the rear stainless
  plate — stainless steel is **not** ferromagnetic-shielding-friendly in the
  way plastic is, so SUS304 (austenitic, non-magnetic) is required, not a
  magnetic stainless grade, or Qi coupling will fail. This is why §1.1
  specifies SUS304 rather than a magnetic 400-series stainless.
- **Charging accessory:** separate Qi charging puck/stand (brief item 12),
  sourced off-the-shelf rather than custom-built — see `BOM-COMPONENTS.md`.

### 2.7 Indicators

- Single RGB status LED, front bezel, hidden under the stainless finish
  (light-pipe drilled through) — used for boot/pairing/OTA status distinct
  from the main display's notification content.

## 3. Environmental / regulatory notes

- Target IP54 (dust/splash resistant) — acceptable for a desk object, not a
  requirement to certify for v1's 100-unit internal/beta run.
- FCC/CE certification required only when the device is sold at retail —
  see `LOT-COMPUTER-PLAN.md` §7, risk 4, and `MANUFACTURING-ROADMAP.md` §5.
