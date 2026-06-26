================================================================================
LOT SYSTEMS CORPORATION / PRODUCT ROADMAP
DOCUMENT:   LOT-COMPUTER-ROADMAP-v1
TITLE:      COSMO PAGER™ — Full Development Roadmap (100-Unit Pilot)
CLASS:      RESTRICTED // S-2 EYES
S-2:        VADIK MARMELADOV
VERSION:    v1.0.0
DATE:       2026-06-26
HORIZON:    8 Weeks (Pilot) + 6 Months (Production Scale)
================================================================================


--------------------------------------------------------------------------------
00 // ROADMAP PHILOSOPHY
--------------------------------------------------------------------------------

The COSMO PAGER™ is not a gadget — it is a physical extension of the LOT
operating system. Every design decision flows from one principle:

  SIGNAL QUALITY > FEATURE COUNT.

The device does one thing exceptionally: it receives AI-generated signals
from lot-systems.com and sends human-pressed acknowledgments back. The
hardware exists to make that signal tactile, wearable, and beautiful.

The 100-unit pilot is a proof of value, not a consumer launch. It validates
the manufacturing stack, the firmware architecture, and the LOT API connector.
Production scaling to 1,000+ units follows after pilot learnings.


--------------------------------------------------------------------------------
01 // MILESTONE MAP
--------------------------------------------------------------------------------

  M0   Spec Lock            Week 0    Documents signed, BOM finalized
  M1   PCB Design           Week 1    Gerbers, BOM, CPL complete
  M2   Prototype Build      Week 2    3× hand-built prototypes
  M3   Firmware Alpha       Week 3    All tasks running, LOT API connected
  M4   PCBWay PCBA Order    Week 3    100-unit PCBA submitted
  M5   SS Body Order        Week 2    CNC order placed (15-20 day lead)
  M6   Firmware Beta        Week 4    OTA, BSEC2, session compression done
  M7   PCBA Delivery        Week 5    Boards arrive from PCBWay
  M8   Body Delivery        Week 6    SS shells arrive from CNC vendor
  M9   Assembly             Week 6    PCB into shell, glass bond, gasket
  M10  Factory Test         Week 7    100 units × 10-step test
  M11  LOT API Live         Week 5    All device endpoints live on lot-systems.com
  M12  Pilot Delivery       Week 8    100 units ready to ship
  M13  PDF Manuals          Week 7    Quick Start + Full Manual PDFs generated
  M14  Post-pilot Review    Week 10   Learnings → v1.1 spec


--------------------------------------------------------------------------------
02 // GANTT — WEEK BY WEEK
--------------------------------------------------------------------------------

WEEK    1    2    3    4    5    6    7    8
────────────────────────────────────────────────────────────────
PCB Design     ████
Prototype      ·███
Firmware       ····████████████
PCBWay PCBA    ··██·················(fab 10-15 days)████
SS Body CNC    ·████··············(fab 15-20 days)████
LOT API        ··········████████
Log Tab UI     ··············████
Notif Engine   ···············████
OTA Hosting    ·················██
Assembly       ·····················████
Factory Test   ·······················███
PDF Manuals    ·······················██
Pilot Ship     ··························█


--------------------------------------------------------------------------------
03 // PHASE BREAKDOWN
--------------------------------------------------------------------------------

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — ENGINEERING (Weeks 1–3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  HW-1.1   Complete PCB schematic (KiCad or Altium)
           Deliverable: Schematic PDF + netlist

  HW-1.2   PCB layout (4-layer, 38×38mm, all components placed)
           Critical constraints:
             - ESP32-S3 antenna keep-out (top right corner)
             - OV2640 on front face, aligned to shell cutout
             - E-paper SPI traces: matched length, <50mm
             - BME688 on front PCB edge (air access, not covered)
             - Qi coil footprint on back copper pour
             - Button centered to front shell cutout
             - USB-C edge connector right side

  HW-1.3   Design Rule Check (DRC) + Electrical Rules Check (ERC)
           Fabrication output: Gerbers, drill files, BOM, CPL

  HW-1.4   3× hand-built prototypes (QFP hot-air rework station)
           Purpose: validate fitment, display alignment, camera FOV,
                    button feel, Qi charging, Wi-Fi antenna performance

  HW-1.5   Antenna gain measurement (2.4 GHz, simple RSSI vs distance)
           Target: –70 dBm at 10 m line-of-sight

  FW-1.1   ESP-IDF project scaffold (partitions, sdkconfig, CMake)
  FW-1.2   TaskWifi + HTTPS client + TLS cert pinning
  FW-1.3   E-paper driver (GDEP010WS1 SPI)
  FW-1.4   BME688 + BSEC2 library integration
  FW-1.5   OV2640 camera init + JPEG capture

  SW-1.1   Prisma schema additions + migration (local dev)
  SW-1.2   device-api.ts route scaffold (POST /register, POST /heartbeat)
  SW-1.3   Device Bearer token auth middleware

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — FIRMWARE COMPLETE + API LIVE (Weeks 3–5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FW-2.1   TaskNotify (poll /api/device/notifications, render to display)
  FW-2.2   TaskButton → POST /api/device/log (COPY event)
  FW-2.3   TaskSensor (BSEC2 forced mode, POST /api/device/sensor)
  FW-2.4   TaskCamera (command-triggered JPEG POST)
  FW-2.5   TaskOTA (HTTPS OTA with SHA256 + rollback)
  FW-2.6   TaskSession (CBOR compression, 32-entry ring buffer)
  FW-2.7   TaskPower (deep sleep, battery SOC, Qi detect wake)
  FW-2.8   TaskRGB (LED state machine: idle/charge/notify/error)
  FW-2.9   Factory provisioning tool (Python, pogo-pin serial)

  SW-2.1   GET /api/device/notifications endpoint live
  SW-2.2   POST /api/device/log → writes to existing logs table
  SW-2.3   POST /api/device/sensor → DeviceSensor table
  SW-2.4   GET /api/device/commands endpoint
  SW-2.5   Log Tab: device_copy event renderer (frontend)
  SW-2.6   SSE: device_copy events on existing stream

  MILESTONE: Prototype presses COPY → Log tab updates in browser (M3 gate)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — PRODUCTION + ASSEMBLY (Weeks 5–7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  MFG-3.1  PCBWay PCBA delivery → incoming inspection (AOI report review)
  MFG-3.2  CNC SS body delivery → dimensional inspection (caliper check)
  MFG-3.3  Sapphire glass bonding (UV adhesive, UV cure oven or lamp)
  MFG-3.4  Battery connection (JST PH 1.25mm, polarity verified)
  MFG-3.5  PCB insertion into back shell
  MFG-3.6  Button keycap installation (M1.0 screw + Loctite 222)
  MFG-3.7  Gasket installation + front shell assembly (4× M1.0 screws)
  MFG-3.8  Final torque: 0.2 N·m (M1.0 scale)

  TEST-3.1  Factory test fixture (pogo-pin bed-of-nails)
  TEST-3.2  Flash firmware (esptool.py, 12s/unit)
  TEST-3.3  Provision device identity (uuidgen + LOT API register)
  TEST-3.4  10-step self-test (see HW-SPEC Section 06)
  TEST-3.5  PASS → serial stamp + pack | FAIL → rework queue

  SW-3.1   Admin UI: /admin/devices (device list, send notification, OTA)
  SW-3.2   Notification engine: scheduled morning greeting + IAQ alerts
  SW-3.3   GET /api/device/firmware/latest endpoint
  SW-3.4   Firmware binary hosting (upload + serve)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — DOCUMENTATION + DELIVERY (Week 7–8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DOC-4.1  Generate PDF: Quick Start Guide (4 pages, box insert)
  DOC-4.2  Generate PDF: Full User Manual (~20 pages)
  DOC-4.3  Generate PDF: Firmware Reference (dev audience)
  DOC-4.4  Generate PDF: BOM export
  DOC-4.5  Upload PDFs to lot-systems.com/docs/cosmo-pager/
  DOC-4.6  QR code on setup card → lot-systems.com/cosmo-setup

  SHIP-4.1 Packaging: device in EVA tray + Qi charger + quick start card
  SHIP-4.2 Box seal, label with serial + device ID
  SHIP-4.3 100 units ready for dispatch
  SHIP-4.4 Pilot recipients notified via LOT site notification


--------------------------------------------------------------------------------
04 // POST-PILOT ROADMAP (Months 3–6)
--------------------------------------------------------------------------------

  v1.1   Design improvements from pilot learnings
    - Battery life optimization (target 72h light sleep)
    - Antenna redesign if RSSI < –70 dBm at 10m
    - BME688 placement optimization (edge ventilation)
    - Firmware OTA cycle: v1.1.0 pushed OTA to all 100 pilots

  v1.2   Feature additions
    - Haptic motor (ERM 8mm × 3mm, under button)
    - Accelerometer (LIS2DW12 2×2mm) for tap-to-wake
    - NFC tag (NTAG213, back shell) for phone tap-to-pair
    - Color e-paper upgrade (spectra 3-color, 1.02" ACeP)

  SCALE   1,000-unit production run
    - Full FCC SDoC certification (Part 15, Wi-Fi)
    - CE RED marking (Europe)
    - Injection-molded polymer gasket (replace cut silicone)
    - Automated assembly line (semi-auto PCBA + body press-fit)
    - Cost/unit target at 1K: < $60 BOM

  VARIANTS
    - COSMO PAGER™ PRO: 50×50×6mm, larger display, haptic, NFC
    - COSMO PAGER™ LITE: 30×30×4mm, BT only (no Wi-Fi), ultra-low power


--------------------------------------------------------------------------------
05 // RISK REGISTER
--------------------------------------------------------------------------------

  RISK                              PROB  IMPACT  MITIGATION
  ──────────────────────────────────────────────────────────────────────────
  CNC body lead time > 20 days      MED   HIGH    Order 2 vendors in parallel
  PCBWay PCBA yield < 90%           LOW   MED     Order 110 boards (10% buffer)
  OV2640 fitment in 5mm shell       MED   HIGH    Prototype validation (Phase 1)
  Qi field blocked by SS 316L       MED   HIGH    316L is non-magnetic → OK;
                                                   Thinned zone validates in proto
  BME688 BSEC2 lib size (>1MB)      LOW   MED     BSEC2 LP profile is ~180KB
  Battery capacity too small        MED   MED     Deep sleep extends to 48h;
                                                   402030 (200mAh) if needed
  lot-systems.com API latency       LOW   LOW     Retry with backoff in firmware
  Flash encryption breaks OTA       LOW   HIGH    Test OTA in Phase 1 prototype
  Customs delay (China → USA)       MED   MED     Use DHL Express + buffer week
  FCC concerns (Wi-Fi module)       LOW   HIGH    ESP32-S3-MINI-1 carries FCC ID;
                                                   SDoC covers host device
  ──────────────────────────────────────────────────────────────────────────


--------------------------------------------------------------------------------
06 // DECISION LOG
--------------------------------------------------------------------------------

  D01  E-paper over OLED
       WHY: E-paper retains image at 0 µA → extends battery from ~4h to ~48h.
            Notification visible indefinitely between Qi charges.
            Tradeoff: 2s full refresh (mitigated by partial refresh 0.3s).

  D02  ESP32-S3 over nRF5340 + separate Wi-Fi
       WHY: Single-chip Wi-Fi + BT + camera interface + USB OTG.
            nRF would require separate Wi-Fi module (more area, 2 firmwares).
            ESP32-S3 FCC ID via module reduces certification burden.

  D03  BME688 over BME280
       WHY: BME688 adds AI gas sensing (BSEC2 library) with no footprint change.
            Same package (3×3mm), same I2C. IAQ data is unique LOT differentiator.

  D04  316L stainless steel over aluminum
       WHY: Brand requirement (COSMO® premium aesthetic, mirror polish).
            316L is non-magnetic → Qi field passes through.
            Tradeoff: heavier (+~8g vs aluminum); accepted for premium feel.

  D05  OV2640 over more capable sensor
       WHY: 2MP is sufficient for identification/capture use cases.
            OV2640 DVP interface native to ESP32-S3; no MIPI CSI bridge needed.
            Footprint fits within 4×4cm PCB, M7 lens fits in 5mm shell depth.

  D06  Qi over USB-C charging (user-facing)
       WHY: Polished steel back with no visible port = premium.
            Qi allows sealed body → IP54 rating.
            USB-C retained as hidden engineering port (firmware flash only).

  D07  PCBWay turnkey PCBA over in-house assembly
       WHY: 100 units is below in-house SMT viability (stencil, oven).
            PCBWay PCBA cost justified vs. equipment + labor at this volume.


--------------------------------------------------------------------------------
07 // KEY CONTACTS & VENDOR LIST
--------------------------------------------------------------------------------

  ROLE                    CONTACT / RESOURCE
  ────────────────────────────────────────────────────────────
  S-2 / Inventor          Vadik Marmeladov — vadikmarmeladov@gmail.com
  PCB Fab + PCBA          PCBWay — pcbway.com / sales@pcbway.com
  CNC SS Body             TBD — source via Alibaba (3 quotes required)
  E-Paper Display         Good Display — good-display.com
  ESP32-S3 Module         Espressif / Mouser
  Bosch BME688            Bosch Sensortec / Mouser
  LiPo Battery            EEMB / Alibaba (UN38.3 cert required)
  Qi Charging IC (BQ51)   Texas Instruments / Mouser
  Qi Coil (WR003A)        Würth Elektronik / Mouser
  ESD + Passives          LCSC Electronics
  Glass Cover             Alibaba — "sapphire glass custom 0.5mm"
  Packaging               Alibaba / Packola
  Shipping (intl)         DHL Express (China → USA)
  FCC Lab (future)        UL Solutions / Element Materials


================================================================================
END OF DOCUMENT — LOT-COMPUTER-ROADMAP-v1
CLASSIFICATION: RESTRICTED // S-2 EYES
LOT SYSTEMS CORPORATION | brand.lot-systems.com
================================================================================
