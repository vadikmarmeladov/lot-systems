<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
LOT COMPUTER — HARDWARE SPECIFICATION & BUILD PLAN
================================================================================

DOCUMENT    LOT-COMPUTER-HARDWARE-SPEC
ISSUE DATE  2026.07.18
CLASS       RESTRICTED // S-2 EYES
STYLE       TERMINAL GRID
S-2         VADIK MARMELADOV, Inventor, COSMO® CIA
STATUS      READY — v1.0, first surviving iteration (prior brave-lamport
            COSMO Hardware work, LOT-MANIFEST entry brave-lamport-t9z5u8,
            +2610 lines / 7 files, was never merged and no longer exists on
            any remote branch — this document restarts the record from zero,
            verbatim, so it cannot be lost the same way twice)
SOURCE      S-2 request, 19-point hardware spec, 2026-07-18. Read against
            docs/corporate/LOT_ROBOTICS_COSMO.md, docs/corporate/LOT-CUBIQ-
            VISION.md (Quantum Cube precedent), docs/technical/LOT-NODE-0-
            RIG-SPEC.md (format precedent), docs/technical/OS_API.md and
            live source (POST /api/logs — the real endpoint this device
            calls).

================================================================================

## 00  COMPRESSED SUMMARY (session-compression pass, per spec item 8)

    ONE SENTENCE:  A palm-sized, two-piece stainless steel companion computer
                   that shows one LOT-pushed notification at a time on a
                   round display, watches the room through a small camera and
                   an environmental sensor, and has one button — COPY — that
                   writes a signal to the owner's Log tab on lot-systems.com.

    SHAPE:      2-part stainless body, 40mm x 40mm x 5mm flat silver square.
    FRONT:      polished stainless steel — no seams, no ports, the calm face.
    BACK:       camera + round display + COPY button — the working face.
    POWER:      Qi wireless charging, no charge port breaking the shell.
    BRAIN:      ESP32-S3 (Wi-Fi, camera ISP, enough RAM for a UI + TLS).
    SENSES:     camera (OV2640/OV5640) + BME280/BME680 weather/env sensor.
    LINK:       LOT API connector — pulls notifications, POSTs to /api/logs.
    MAKE:       PCBWay for PCB + SMT assembly, 100-unit first run.
    PAPER:      3 documents, kept separate on purpose (spec item 11) —
                this file (hardware/BOM/roadmap), LOT-COMPUTER-FIRMWARE.md,
                LOT-COMPUTER-SOFTWARE-CONNECTOR.md — plus a generated PDF
                manual (spec item 7).

    RETAINED TOKENS FOR FUTURE SESSIONS:  LOT-COMPUTER (product), COPY-SIGNAL
    (button → /api/logs event), TERMINAL-FACE (display side), MIRROR-FACE
    (polished blank side). See docs/assembly/LOT-LEXICON.md.

================================================================================

## 01  PRODUCT THESIS

The LOT Computer is the physical terminal for a LOT profile. It does not
run the app — the app already runs on the phone and the web. It does one
thing the phone cannot: sit on a desk, ambient and undistracting, and
surface exactly one signal from lot-systems.com at a time — a pushed
notification like "Coffee time!" — the way a pager surfaces exactly one
page. No feed. No scroll. No app icons. A cube-shaped moment, made object,
consistent with the CUBIQ® thesis in docs/corporate/LOT-CUBIQ-VISION.md
("physical products — sci-fi hygiene, cleanse, real-world cubic").

It is the entry-level physical product in the COSMO® hardware line, sized
and priced to precede the COSMO® robotics unit (docs/corporate/
LOT_ROBOTICS_COSMO.md, Phase 3, 2028-2029, $2,500-$5,000/unit) by roughly
two years. The LOT Computer is the low-cost proof that a LOT profile can
live outside a browser tab before the company asks anyone to trust it
inside a robot.

================================================================================

## 02  FORM FACTOR (spec items 3, 4, 17, 18)

```
                    FRONT — "MIRROR-FACE"           BACK — "TERMINAL-FACE"
                    ─────────────────────           ──────────────────────
                    Polished stainless steel,        Bead-blasted stainless
                    mirror (#8) finish. No seam,      steel, matte. Cutouts
                    no port, no branding beyond a     for:
                    laser-etched LOT® mark, filled      - camera window
                    and polished flush.                 (sapphire or
                                                          Gorilla Glass lens)
                    Functions as a physical             - round display
                    "off" state — face-down, the        window (same glass)
                    device shows nothing and reads       - COPY button
                    nothing. Face-up, TERMINAL-FACE      (stainless, flush,
                    is presented to the room.            tactile click)

    BODY:    2-part stainless steel shell, laser-welded or press-fit at the
             equator seam, gasket-sealed (IP54 target — desk object, not a
             dive watch).
    FOOTPRINT: 40mm x 40mm (4cm x 4cm), flat square, rounded 3mm corners.
    HEIGHT:  5mm — deliberately thin. This is the hard engineering
             constraint of the whole build (see 03, stack budget).
    WEIGHT:  target 35-45g (stainless is dense; thinness keeps it light).
    FINISH:  MIRROR-FACE polished #8, TERMINAL-FACE bead-blasted #4 —
             same two-finish language as LOT-CUBIQ-VISION's "sci-fi
             hygiene, cleanse" aesthetic.
```

### 02.1  THE 5mm PROBLEM

A 5mm total height is the single hardest constraint in this spec — thinner
than an iPhone (7.8mm) and close to a credit card stack (0.76mm x 6 = 4.6mm
for reference). It rules out a coin-cell-class battery with any real
capacity, rules out a full-size camera module, and forces a rigid-flex or
ultra-thin rigid PCB. The roadmap in section 06 treats 5mm as a Phase 2
target, not a Phase 1 guarantee — Phase 1 (proto) is allowed to land at
6-8mm while the stack is proven, then gets thinned for the 100-unit run.

================================================================================

## 03  COMPONENT BILL OF MATERIALS

Prices are current street quotes, July 2026, single-unit vs. estimated
100-unit-run landed cost (component-only, before PCBWay assembly + CNC
enclosure — those are priced separately in section 04). Links are real
supplier/manufacturer pages, not placeholders — verify current stock and
exact SKU before ordering; component markets move week to week the same
way NODE-0's GPU pricing does (docs/technical/LOT-NODE-0-RIG-SPEC.md).

```
PART                  SPEC / SKU CLASS                    UNIT x1    UNIT x100
────                   ─────────────────                    ───────    ─────────
MCU + CAMERA (5)      ESP32-S3 module w/ OV2640 2MP,        $5-8       $2.50-4
  spec item 6          integrated Wi-Fi/BLE, DVP camera
                        interface, enough PSRAM for a
                        framebuffer + TLS stack.
                        Ref (dev-kit form, for prototyping):
                        Meshnology ESP32-S3 OV2640 board
                        https://www.amazon.com/dp/B0GLX9XCP4
                        FORIOT ESP32-S3-CAM N16R8
                        https://www.amazon.com/dp/B0F4DKTBR9
                        Production form: bare WROOM-class
                        module + discrete OV2640/OV5640 on
                        the custom PCB, not the dev board.

DISPLAY               1.28" round TFT, 240x240, GC9A01
  spec item "screen"    driver, SPI. Round face matches the
  (18)                  TERMINAL-FACE window; renders one
                        pushed notification at a time, large
                        type, high contrast, no chrome.
                        Waveshare 1.28" round LCD module
                        https://www.waveshare.com/1.28inch-lcd-module.htm
                        Makerfabs GC9A01 round module
                        https://www.makerfabs.com/gc9a01-1-28-inch-round-lcd-module.html
                        NOTE: candidate module is TFT, not
                        e-ink — chosen for instant refresh on
                        a pushed notification. An e-ink
                        variant is a Phase 3 power-savings
                        option (see 06) once refresh latency
                        is proven acceptable.
                        Unit: $8-15                          $8-15      $4-7

WEATHER / ENV SENSOR   BME280 (temp/humidity/pressure) or
  spec items 14, 15     BME680 (adds VOC/air-quality — the
                        "AI-grade off-the-shelf sensor" tier).
                        Bosch Sensortec, industry-standard,
                        I2C, small enough for the 5mm stack.
                        Adafruit BME280 STEMMA QT
                        https://www.adafruit.com/product/2652
                        Adafruit BME680 STEMMA QT
                        https://www.adafruit.com/product/3660
                        Bosch BME280 product page
                        https://www.bosch-sensortec.com/en/products/environmental-sensors/humidity-sensors-bme280
                        Bare-die/module pricing at volume runs
                        well under the breakout-board price.
                        Unit: $9-19 (breakout) / ~$3-5 (bare, x100)

BUTTON                 Single stainless tactile switch,        <$1        <$0.40
  spec item 16           IP54-rated, flush-mount, laser-
                        etched "COPY". Any qualified SMT
                        tactile switch behind a stainless
                        cap; supplier selected at CM
                        (contract manufacturer) stage — not
                        BOM-critical, commodity part.

WIRELESS CHARGE        Qi receiver module, small coil          $3-8       $1.50-3
  RECEIVER               (~10-15mm diameter to fit the 40mm
  spec items 12, 19      footprint), 5V/1A out, feeds a
                        buck/charge-management stage.
                        Adafruit Universal Qi Receiver
                        https://www.adafruit.com/product/1901
                        Small-coil Qi receiver reference
                        https://www.wirelesschargingcoil.com/small-wireless-charging-coil/

BATTERY                Ultra-thin LiPo pouch cell, 40-80mAh,   $2-5       $1-2
                        sized to the 40x40x5mm envelope
                        (a full 500mAh pouch will NOT fit at
                        5mm total height — see 02.1; Phase 1
                        proto uses a larger cell and accepts
                        a thicker enclosure).

CHARGE MANAGEMENT IC   TP4057 (500mA linear Li-ion charger,   <$0.15     <$0.11
  spec item 12           SOT-23-6) between the Qi receiver
                        and the battery.
                        TP4057 datasheet
                        https://mm.digikey.com/Volume0/opasdata/d220001/medias/docus/5010/TP4057.pdf

PCB (bare)             Custom rigid or rigid-flex, 2-4 layer, $2-6       $0.80-2
  spec item 1             sized to the 40x40mm footprint,
                        fabricated by PCBWay.
                        PCBWay PCB quote
                        https://www.pcbway.com/HighQualityOrderOnline.aspx

PCB ASSEMBLY (SMT)     PCBWay turnkey SMT assembly — parts    n/a        $8-18/unit
  spec item 1             sourced, placed, reflowed, AOI +
                        functional test.
                        PCBWay SMT assembly quote
                        https://www.pcbway.com/quotesmt.aspx
                        PCBWay assembly overview
                        https://www.pcbway.com/pcb-assembly.html
                        NOTE: PCBWay's stated minimum panel is
                        50mm x 100mm — a 40x40mm board must be
                        panelized (multiple units per panel,
                        v-scored or tab-routed) to hit their
                        production minimums economically. Fold
                        this into the panel design from day 1,
                        not as a retrofit.

ENCLOSURE (2-part      Stainless steel, CNC-machined or        n/a        $15-35/unit
  stainless shell)      deep-drawn + CNC-finished, mirror
  spec items 3, 4,       polish one half, bead-blast the
  17, 18                 other, laser-etched button legend
                        and LOT® mark.
                        Xometry stainless CNC quote
                        https://www.xometry.com/capabilities/cnc-machining-service/cnc-stainless-steel/
                        Xometry small-batch CNC
                        https://www.xometry.com/capabilities/cnc-machining-service/small-batch-cnc-machining/
                        NOTE: at 100 units, deep-drawing +
                        CNC-finish is materially cheaper per
                        unit than pure CNC-from-billet; get
                        both quotes before committing tooling.

LENS/WINDOW             Sapphire or Gorilla-Glass-class disc,  $2-5       $1-2
                        camera + display cover, bonded into
                        the TERMINAL-FACE cutout.

GASKET / SEAL            Silicone o-ring or laser-cut gasket   <$1        <$0.30
                        at the shell equator, IP54 target.

────────────────       ────────────────────────────────      ───────    ─────────
COMPONENT SUBTOTAL     (excludes assembly + enclosure)        ~$30-55    ~$15-25
FULL LANDED, x100 RUN  components + assembly + enclosure                 ~$40-65/unit
```

================================================================================

## 04  PCBWAY MANUFACTURING PLAN (spec items 1, 13)

```
STAGE   ACTION                                              VENDOR / TOOL
─────   ──────                                              ─────────────
1       Panelize the 40x40mm board — target 4-up or 6-up    PCBWay quote tool
        per panel to clear the 50x100mm assembly minimum.   https://www.pcbway.com/HighQualityOrderOnline.aspx
2       Bare PCB fab, 2-4 layer, ENIG finish (small pads,    PCBWay
        fine-pitch ESP32-S3 module).
3       Turnkey SMT assembly — PCBWay sources BOM parts,     PCBWay SMT quote
        places, reflows, AOI + functional test per unit.     https://www.pcbway.com/quotesmt.aspx
4       X-ray inspection on the ESP32-S3 module footprint    PCBWay
        (BGA/QFN-class package, hidden joints).
5       V-score or tab-route depanelization, 100 boards.     PCBWay / CM
6       Enclosure run in parallel — CNC or deep-draw          Xometry (or
        stainless, 100 units, both faces finished, laser-     PCBWay's own
        etched.                                               CNC service —
                                                                get both
                                                                quotes)
7       Final assembly: PCB into shell, lens/window bonded,   Contract
        gasket seated, wireless-charge coil aligned, unit      manufacturer
        function test (charge, camera frame, display render,  (CM) — PCBWay
        button → /api/logs round-trip against a staging       offers this as
        LOT API endpoint) before ship.                         an add-on; a
                                                                 dedicated CM
                                                                 is the Phase
                                                                 3 default.
```

FIRST RUN SIZE: 100 units, per spec item 13. This is a pilot-production
quantity — large enough to amortize PCB panel tooling and get a real CNC
quote, small enough that a design flaw costs a batch, not a warehouse.

================================================================================

## 05  DOCUMENTATION SET (spec items 7, 9, 10, 11)

Per spec item 11, firmware and software documentation are kept as
SEPARATE files — not sections of this one — so each can version
independently as the MCU-side and backend-side implementations diverge.

```
DOCUMENT                                          COVERS
────────                                          ──────
LOT-COMPUTER-HARDWARE-SPEC.md  (this file)        Plan, BOM, roadmap, PCBWay
                                                    plan, form factor.
LOT-COMPUTER-FIRMWARE.md                          MCU firmware: boot, camera
                                                    driver, display render
                                                    loop, button/COPY signal
                                                    handling, wireless-charge
                                                    power management, OTA.
LOT-COMPUTER-SOFTWARE-CONNECTOR.md                LOT API connector: pairing/
                                                    auth, notification pull,
                                                    POST /api/logs schema,
                                                    retry/offline behavior.
LOT-COMPUTER-HARDWARE-SPEC.pdf                    Generated PDF manual
                                                    (spec item 7) — this
                                                    document, print-ready,
                                                    filed alongside the badge
                                                    codex PDFs precedent
                                                    (docs/badges/pdf/).
```

================================================================================

## 06  ROADMAP

```
PHASE   NAME                TARGET              KEY WORK
─────   ────                ──────              ────────
0       Paper                2026 Q3 (now)       This spec. BOM priced.
                                                   PCBWay + CNC quotes
                                                   requested. Firmware +
                                                   software connector docs
                                                   authored (this session).
1       Bench Prototype      2026 Q4              ESP32-S3-CAM dev board +
                                                   breakout GC9A01 display +
                                                   BME280 breakout, wired
                                                   dead-bug on a bench.
                                                   Thickness constraint
                                                   relaxed (accepts >5mm).
                                                   Proves: camera capture,
                                                   round-display render of a
                                                   pushed "Coffee time!"
                                                   notification, COPY button
                                                   -> POST /api/logs
                                                   round-trip against
                                                   staging.
2       Custom PCB Rev A     2027 Q1              Panelized custom board,
                                                   PCBWay fab + assembly,
                                                   10-25 units. First real
                                                   attempt at the 40x40x5mm
                                                   envelope. Wireless
                                                   charging integrated.
3       Enclosure + Rev B    2027 Q2              Stainless shell (Xometry
                                                   or PCBWay CNC) fitted to
                                                   Rev A/B board. IP54 seal
                                                   validated. Battery
                                                   sized to final cavity.
4       100-Unit Run         2027 Q3              Section 04 pipeline,
                                                   full 100 units, CM final
                                                   assembly + function test.
5       Fleet Pairing        2027 Q3-Q4           Software connector live
                                                   against lot-systems.com
                                                   production, per-unit
                                                   pairing flow, OTA
                                                   firmware channel open.
```

================================================================================

## 07  OPEN RISKS (recorded honestly, not smoothed over)

```
RISK                                    MITIGATION
────                                    ──────────
5mm height may not fit camera + coil +  Phase 1/2 explicitly allowed to
battery + display stack simultaneously  exceed 5mm; thinness is a Phase 3
                                         target, not a Phase 1 gate.
40x40mm PCB is below PCBWay's stated    Panelize from the first fab run
50x100mm assembly minimum               (section 04, stage 1).
Round display + camera window in a      Sapphire/Gorilla-glass bonding is
5mm stainless shell = two sealed         a real yield risk at 100 units;
optical cutouts in a metal shell        budget for a higher scrap rate on
                                         the enclosure line than the PCB
                                         line.
No physical charge port (Qi-only) means Firmware must expose a clear
a bricked unit cannot be recovered by   low-battery / boot-fail signal on
wired debug in the field                the display before it goes dark;
                                         OTA and pairing flow must be
                                         resilient to a mid-update power
                                         loss (see LOT-COMPUTER-FIRMWARE.md
                                         06 OTA section).
```

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END OF SPECIFICATION                                                2026.07.18
================================================================================
