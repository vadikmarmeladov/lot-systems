================================================================================
LOT SYSTEMS CORPORATION
LOT® SIGNAL — BILL OF MATERIALS + COMPONENT BUYING LIST
================================================================================

DOCUMENT    BOM / LOT-SIGNAL-01
ISSUE DATE  2026.07.25
CLASS       INTERNAL / PROCUREMENT
PARENT SPEC docs/technical/LOT-SIGNAL-HARDWARE-SPEC.md

Prices are current street/quote ranges as of July 2026. Reference part
numbers, not endorsements of a single distributor — swap for whichever
authorized distributor (DigiKey, Mouser, LCSC) has stock at order time.
PCBWay is the manufacturing partner of record per requirement #1.

================================================================================

## 01  PROTOTYPE BOM — PER UNIT (PHASE 1–2, QTY 3–10)

```
COMPONENT              PART / WHERE TO SOURCE IT                   UNIT COST
─────────              ─────────────────────                       ─────────
MCU/SoC (WiFi+BLE)     ESP32-S3-WROOM-1-N8R8 — Espressif           $3.20
                       Search this exact part number on
                       digikey.com or mouser.com (authorized
                       Espressif distributors — do not use a
                       reseller for the RF module).

Camera                 OV2640 2MP module, FPC ribbon connector     $4.50
                       Search "OV2640 ESP32-CAM module" on
                       aliexpress.com or seeedstudio.com.

Display                Sharp Memory LCD, part LS013B7DH03          $14.00
                       Search this part number on digikey.com
                       or mouser.com. (Always-on reflective
                       panel, ~sub-mA static draw.)

Weather/gas sensor     Bosch BME680 (temp/humidity/pressure/VOC)   $8.90
                       Search "Bosch BME680 breakout" on
                       digikey.com, mouser.com, or adafruit.com.

IMU (tap/gesture)      ST LSM6DSO 6-axis accel+gyro                $2.10
                       Search this part number on digikey.com
                       or mouser.com.

Ambient light sensor   Vishay VEML7700                             $0.95
                       Search this part number on digikey.com
                       or mouser.com.

Qi receiver IC         TI BQ51013B                                 $2.35
                       Search this part number on ti.com
                       (Texas Instruments direct) or digikey.com.

Qi coil                Wurth Elektronik WE-WPCC receiver coil      $1.80
                       Search "WE-WPCC Qi receiver coil" on
                       we-online.com or digikey.com.

Battery                3.7V 150mAh LiPo pouch, ~3.5mm thick        $3.50
                       Search "150mAh 3.7V LiPo thin cell" on
                       adafruit.com or a UL-listed cell supplier —
                       confirm UN38.3 documentation before order.

Tactile button (COPY)  SMD momentary switch, 0.8mm actuation       $0.60
                       Search "SMD tactile switch" on digikey.com;
                       steel cap laser-etched by the CNC vendor.

PCB (2-layer, proto)   PCBWay 2-layer, ENIG finish, 10-piece qty   $25 (10pc)
                       pcbway.com — Instant Quote → PCB Prototype.

PCB assembly (PCBA)    PCBWay SMT assembly service, per-unit setup $18/unit
                       pcbway.com — PCB Assembly service, same     (proto qty)
                       order flow as the PCB quote above.

Passives + antenna     Decoupling caps, PCB trace antenna, misc    $1.50
─────────              ─────────────                              ─────────
PROTOTYPE UNIT TOTAL (electronics only, excl. enclosure)           ≈ $65–$70
```

================================================================================

## 02  ENCLOSURE BOM — PER UNIT (PHASE 3, PROTOTYPE QTY 10)

```
COMPONENT              SPEC                                        UNIT COST
─────────              ────                                        ─────────
Front bezel             316L stainless, 40x40x5mm, CNC + bead-      $45
                        blast finish. pcbway.com — CNC Machining
                        service, Instant Quote, material = 316L
                        stainless, finish = bead blast.

Rear base               316L stainless, 40x40x12mm cavity, CNC +   $55
                        mirror polish finish. Same PCBWay service,
                        polish finish selected at quote stage.

Silicone gasket         Compression seal, custom die-cut, 0.5mm     $2.50
                        PCBWay does not cut silicone gaskets —
                        source from a gasket house (e.g. search
                        "custom silicone gasket die cut" on
                        mcmaster.com or a local supplier).

M2 heat-set inserts     4x, brass, ultrasonic or heat-press install $1.00

Screws (M2, 4x)         Stainless flat-head, hidden under bezel     $0.80
─────────              ────                                        ─────────
PROTOTYPE ENCLOSURE TOTAL (per unit, 10-piece CNC quote)            ≈ $90–$105
```

================================================================================

## 03  PILOT PRODUCTION BOM — 100 UNITS (PHASE 5)

Per-unit pricing drops meaningfully at 100x due to PCBWay SMT setup
amortization and CNC batch fixturing. Quote both lines directly through
PCBWay's instant-quote tool before committing — figures below are planning
estimates, not binding quotes.

```
LINE ITEM                              QTY    UNIT COST    LINE TOTAL
─────────                              ───    ─────────    ──────────
PCB fab (2-layer, ENIG)                100     $1.60        $160
PCBA (SMT assembly, all components)    100     $32.00        $3,200
CNC front bezel (stainless, bead-blast) 100     $32.00        $3,200
CNC rear base (stainless, mirror)      100     $26.00        $2,600
Gaskets + inserts + screws (set)       100     $4.30         $430
Battery (150mAh LiPo, UL-listed)       100     $3.10         $310
Final assembly + QC labor (in-house)   100     $6.00         $600
Packaging (box + Quick Start card)     100     $3.50         $350
────────────────────────────────────────────────────────────────────
SUBTOTAL, 100 UNITS                                          $10,850
FCC Part 15 test (one-time, not per-unit)                    $3,500
────────────────────────────────────────────────────────────────────
TOTAL LANDED, 100-UNIT PILOT                                 $14,350
PER-UNIT FULLY LOADED (incl. one-time cert cost)             ≈ $143.50
PER-UNIT MARGINAL (cert cost excluded, run 101+)             ≈ $108.50
```

================================================================================

## 04  ORDERING SEQUENCE (WHAT TO BUY, IN ORDER)

```
STEP  ACTION                                                    PHASE
────  ──────                                                    ─────
1     Order 5x ESP32-S3-DevKitC + OV2640 module + BME680 +      1
      LSM6DSO + Sharp memory LCD breakout — breadboard bring-up.
2     Get PCBWay instant quote for 2-layer PCB, 10pc, ENIG.      2
      Submit Gerbers once schematic is routed.
3     Get PCBWay SMT assembly quote for the same 10pc run —      2
      submit BOM + pick-and-place file alongside the PCB order.
4     Get PCBWay CNC Machining quote for both stainless shells,  3
      10pc each, bead-blast (bezel) + mirror polish (base).
5     Order gaskets, heat-set inserts, and screws separately —   3
      PCBWay does not fabricate silicone gaskets.
6     Re-quote PCBA + CNC at 100pc once Phase 4 firmware is      5
      frozen — do not lock the pilot-run tooling before firmware
      is stable, since PCBA setup is charged per revision.
7     Submit FCC Part 15 pre-test (radiated emissions, BLE/WiFi) 6
      once one Phase-3 unit passes full functional QA.
```

Rule from NODE-0 applies here too: buy the small, cheap, reversible thing
first. Do not commit to the 100-unit CNC tool path until a Phase-3
prototype shell has been fit-checked by hand.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF BILL OF MATERIALS                                            2026.07.25
================================================================================
