================================================================================
LOT SYSTEMS CORPORATION
LOT® COMPUTER — HARDWARE RIG SPECIFICATION
QUANTUM TILE / PAGER-CLASS AMBIENT NOTIFICATION DEVICE
================================================================================

DOCUMENT    RIG-SPEC / LOT-COMPUTER-v1
ISSUE DATE  2026.07.03
CLASS       INTERNAL / BUILD
STYLE       TERMINAL GRID
VISION DOC  docs/corporate/LOT-COMPUTER-VISION.md
INVENTOR    Vadik Marmeladov · COSMO® CIA

================================================================================

## 00  FORM FACTOR — THE CONSTRAINT THAT DRIVES EVERY CHOICE

    40mm x 40mm x 5mm · flat silver square · two-part stainless steel shell

Every component below is selected first for whether it can physically live
inside a 5mm stack, second for cost at 100 units, third for being a proven,
sourceable, off-the-shelf part (no custom silicon in v1). Where a part
cannot fit flush, that is flagged here as a RISK, not hidden.

    FACE A (polished)          FACE B (function)
    ─────────────────          ─────────────────
    Mirror-finish 316L         E-paper display window
    stainless steel plate.     Camera lens boss
    No seams, no branding,     Piezo-disc button (under steel, no hole)
    no ports.                  Qi coil alignment mark

================================================================================

## 01  COMPUTE + RADIO

### ESP32-S3-WROOM-1 (N8R2 variant) — MCU + Wi-Fi + BLE

Dual-core Xtensa LX7, AI vector instructions, native 8-bit parallel camera
interface (DVP), Wi-Fi 4 + BLE 5.0, deep-sleep <20uA. The camera interface
being native to the SoC removes a second bridge chip from the 5mm stack —
the single reason this part beats an nRF52 + separate Wi-Fi combo here.

    DIGIKEY   https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N8R2/15200058
    DATASHEET https://www.espressif.com/en/products/socs/esp32-s3
    UNIT COST ≈ $2.80–$3.40 (qty 100)

================================================================================

## 02  DISPLAY — E-PAPER, NOT OLED

### Good Display GDEY0154D67 — 1.54" 200x200, partial refresh, SSD1681

E-paper holds an image with **zero standing power draw** — the message
stays legible on the charging puck, unpowered, indefinitely. Partial-refresh
mode (~0.3s) updates a single line without the full-frame black/white flash,
which matters for the Ambient AI™ rule: *no alarm, one line, exact moment.*
Panel is ~1.2mm thick glass-on-glass — fits the 5mm stack with room for
the driver board underneath.

    PRODUCT   https://www.good-display.com/product/388.html
    ALT MOD   https://www.buy-lcd.com/products/154-inch-electronic-paper-display-200x200-partial-refresh-digital-price-tags-sreen-gdey0154d67
    UNIT COST ≈ $6–$9 (qty 100, direct factory quote required — no listed retail price)

    RISK: Good Display prices via quote-only for panel-level orders. Get a
    formal 100-unit quote before locking BOM cost; do not assume retail-card
    pricing from hobbyist resellers.

================================================================================

## 03  CAMERA — THE HEIGHT-BUDGET RISK

### OV2640, 2MP, DVP/FPC

    ARDUCAM    https://www.arducam.com/arducam-ov2640-camera-module-2mp-mini-ccm-compact-camera-modules-compatible-with-arduino_m0031esp32-esp8266-development-board-with-dvp-24-pin-interface_.html
    FPC MODULE https://www.ktron.in/product/ov2640-camera-module-with-24-pin-ffc-fpc/
    UNIT COST  ≈ $6–$10 (qty 100)

    RISK — FLAGGED, NOT HIDDEN:
    Off-the-shelf OV2640 camera+lens assemblies run ~14mm x 14mm x ~5-8mm
    at the lens barrel alone. This does NOT fit flush inside a 5mm shell.
    Two real options, both go into the roadmap as an open decision:

      A. LENS BOSS — accept a small raised optical boss (~3-4mm) on Face B,
         the same way a phone accepts a camera bump. Body stays 5mm
         everywhere else. Matches how COSMO® hardware precedent already
         treats bioelectric sensor bosses. RECOMMENDED for v1.

      B. BARE DIE + FPC — source a bare CoB (chip-on-board) sensor die on
         a flex cable with the lens assembly relocated to sit inside the
         charging puck instead of the tile (the puck has no 5mm constraint).
         Tile becomes presence-only (ambient light + IR proximity); full
         camera lives in the dock. Cleaner industrial design, more
         integration risk, deferred to v2 evaluation.

    v1 BUILD PLAN uses OPTION A. This is the single biggest mechanical risk
    in the BOM and is carried forward into the roadmap risk register.

================================================================================

## 04  SENSOR — WEATHER, OFF THE SHELF

### Bosch BME680 — temperature / humidity / pressure / gas (VOC)

LGA package, 2.5mm x 2.5mm x 0.93mm — the one part in this BOM that
disappears into the stack with zero height risk. Feeds the existing LOT®
Weather widget directly; feeds the future Air Quality widget (see
`docs/corporate/LOT-AMBIENT-AI-VISION.md`) via VOC/gas channel. PM2.5/CO2
laser particulate sensing is NOT attempted in the tile — those sensors
need a fan and airflow channel that cannot fit 5mm. PM2.5 stays a
dock/LOT® Station-class product, not this device. That split is intentional,
not a shortfall.

    DIGIKEY    https://www.digikey.com/en/products/detail/bosch-sensortec/BME680/7401317
    OEM PAGE   https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors-bme680/
    ADAFRUIT   https://www.adafruit.com/product/3660  (breakout, for bring-up/dev only)
    UNIT COST  ≈ $4–$6 (qty 100)

================================================================================

## 05  BUTTON — PIEZO DISC, NOT A MECHANICAL SWITCH

### Copy button, tap-sense via piezo element under stainless steel

A 2-part stainless shell has no clean way to run a mechanical tact-switch
plunger without a visible seam or hole. Instead: a piezo disc bonded to
the INSIDE face of Face B stainless steel detects a tap through the metal
itself — the button has no visible hole, no seam, no moving part. This
also lets the same disc double as a haptic-confirmation buzzer (one soft
tick on tap-received), which is the piezoelectric / haptic-feedback
language already established for the Quantum Cube in the CQGS white paper
(`docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md`) — this is that concept,
built.

    DIGIKEY CATEGORY  https://www.digikey.com/en/products/filter/buzzer-elements-piezo-benders/160
    PUI AUDIO BENDERS https://www.digikey.com/en/product-highlight/p/pui-audio/piezo-benders
    ADAFRUIT (dev)    https://www.adafruit.com/product/1740
    UNIT COST         ≈ $1–$2 (qty 100)

================================================================================

## 06  WIRELESS CHARGING

### TI BQ51013B — Qi (WPC v1.1/1.2) receiver IC + coil

Sits in the tile; a matching transmitter coil sits in the stainless charging
puck (separate accessory, see §08). 20-QFN package, fits the stack easily.

    TI PRODUCT PAGE https://www.ti.com/product/BQ51013B
    DATASHEET        https://www.ti.com/lit/ds/symlink/bq51013b.pdf
    DIGIKEY          https://www.digikey.com/en/products/detail/texas-instruments/BQ51013BRHLT/3877679
    UNIT COST        ≈ $3.50–$3.60 (qty 100, cut-tape)

================================================================================

## 07  BATTERY — BRIDGE CELL, NOT A DAILY-USE PACK

### 3.7V 150mAh LiPo (JST-PH)

    ADAFRUIT   https://www.adafruit.com/product/1317
    UNIT COST  ≈ $5.95 (qty 1 retail; expect ~$3–4 at qty 100 direct from cell OEM)

    DESIGN NOTE: a 150mAh pouch cell alone runs ~4-5mm thick — close to the
    ENTIRE height budget by itself once you stack it against the PCB, e-paper
    panel, and camera boss. The resolution: the LOT® Computer is an ambient,
    stationary object that lives on its charging puck (§08) the overwhelming
    majority of the time, the same way the LOT® Station and LOT® Brush are
    dock-resident hardware, not portables. The on-board cell is a BRIDGE
    CELL sized for the seconds-to-minutes a person lifts or repositions the
    tile — not for all-day untethered operation. This directly resolves the
    5mm constraint instead of pretending it away. Evaluate a smaller
    40-80mAh cell in prototype fit-check before locking the BOM.

================================================================================

## 08  CHARGING PUCK (ACCESSORY, NOT HEIGHT-CONSTRAINED)

Matching stainless steel puck, Qi transmitter reference design built around
a standard Qi Tx IC (e.g. TI BQ500212A family — spec at prototype stage, not
locked here) plus mains adapter. The puck has no 5mm limit and is the
natural home for anything that doesn't fit the tile: larger antenna, status
LED (hidden, under-steel diffusion, same "no visible light" rule as the
Ambient AI™ doctrine), and — per §03 Option B — a future camera relocation
target if the tile-mounted lens boss proves undesirable in field testing.

================================================================================

## 09  ENCLOSURE — TWO-PART STAINLESS STEEL, PCBWAY

Both shells (Face A polished, Face B brushed with display/lens/coil cutouts)
machined from 316L stainless (marine-grade, corrosion-resistant, the same
grade already documented for CNC service at the fab partner). PCBWay is the
single vendor for enclosure + PCB + SMT assembly on this run, keeping supply
chain and QA under one accountable roof for a 100-unit pilot.

    CNC STAINLESS (316L)  https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-316-316L/
    CNC STAINLESS (304)   https://www.pcbway.com/rapid-prototyping/cnc-machining/metal/stainless-steel/Stainless-steel-304/
    SMT PCB ASSEMBLY      https://www.pcbway.com/pcb-assembly.html
    ASSEMBLY CAPABILITIES https://www.pcbway.com/pcb_prototype/SMT_Assembly_Capabilities.html
    QUOTE REQUEST         https://www.pcbway.com/rapid-prototyping/manufacture/?type=2

    UNIT COST (2-shell CNC 316L, polish + bead-blast finish) ≈ $18–$28 (qty 100)
    UNIT COST (4-layer PCB, SMT assembly, turnkey)           ≈ $12–$18 (qty 100)

================================================================================

## 10  BILL OF MATERIALS — 100-UNIT ROLLUP

```
COMPONENT                    UNIT COST     x100        NOTE
─────────                    ─────────     ────        ────
ESP32-S3-WROOM-1-N8R2        $3.20         $320        MCU+radio, camera-native
GDEY0154D67 e-paper          $7.50         $750        quote-only, verify before lock
OV2640 camera + lens         $8.00         $800        lens-boss option A
BME680 weather/gas sensor    $5.00         $500        LGA, no height risk
Piezo disc (Copy button)     $1.50         $150        doubles as haptic buzzer
BQ51013B Qi receiver         $3.55         $355        + coil + support caps
150mAh LiPo bridge cell      $3.50         $350        verify smaller cell in fit-check
PCB (4L, bare)                $4.00         $400        via PCBWay
SMT assembly (per unit)      $12.00        $1,200       via PCBWay turnkey
CNC stainless shell pair     $22.00        $2,200       316L, polish + brushed finish
Passives / misc SMD           $2.50         $250        caps, resistors, ESD protection
Wireless charging puck        $9.00         $900        Qi Tx + mains adapter, accessory
Packaging + manual insert     $3.00         $300        box, foam, printed quick-start
─────────                    ─────────     ────        ────
SUBTOTAL / UNIT               ≈ $85.25
SUBTOTAL / 100-UNIT RUN                    ≈ $8,525
NRE (tooling, CNC fixtures, first-article) — separate, ≈ $2,000–$4,000 one-time
```

Prices are current street/distributor estimates pulled July 2026 — verify
against a live PCBWay quote and distributor cart before committing purchase
orders. The e-paper panel in particular is quote-gated, not retail-priced.

================================================================================

## 11  WHAT THIS SPEC DELIBERATELY DOES NOT DO

- No custom ASIC, no custom sensor silicon — every part above is
  sourceable off a distributor shelf today ("AI-grade off-the-shelf
  sensors," per the intake brief).
- No injection-molded plastic tooling — CNC stainless only, appropriate
  for a 100-unit pilot; injection molding is a v2+ decision once volume
  justifies tooling amortization.
- No PM2.5/particulate sensing in the tile — deliberately deferred to a
  dock-class product (§04, §08).

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
FIRMWARE SPEC   → docs/technical/LOT-COMPUTER-FIRMWARE.md
SOFTWARE SPEC   → docs/technical/LOT-COMPUTER-SOFTWARE-BRIDGE.md
ROADMAP         → docs/technical/LOT-COMPUTER-ROADMAP.md
END OF SPECIFICATION                                                2026.07.03
================================================================================
