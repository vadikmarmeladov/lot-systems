================================================================================
LOT SYSTEMS CORPORATION / HARDWARE SPECIFICATION
DOCUMENT:   LOT-COMPUTER-HW-SPEC-v1
TITLE:      COSMO PAGER™ — Connected Hardware Computer
CLASS:      RESTRICTED // S-2 EYES
S-2:        VADIK MARMELADOV
ROLE:       Inventor, COSMO® CIA
VERSION:    v1.0.0
DATE:       2026-06-26
STATUS:     PLANNING — PRE-PRODUCTION
UNITS:      100 (First Run)
================================================================================


--------------------------------------------------------------------------------
00 // DEVICE OVERVIEW
--------------------------------------------------------------------------------

NAME:         COSMO PAGER™
CODENAME:     LOT-CP-100
FORM FACTOR:  40 × 40 × 5 mm flat square
BODY:         316L stainless steel, 2-part CNC shell
FINISH:       Back — mirror-polished (hairline #8) | Front — brushed satin
WEIGHT:       ~28 g (estimated, with battery)
CONNECTIVITY: Wi-Fi 802.11 b/g/n (2.4 GHz) + Bluetooth 5.0 LE
PLATFORM:     ESP32-S3 (Xtensa LX7, 240 MHz dual-core)
POWER:        3.7 V LiPo 150 mAh | Qi wireless charging (5 W)
PURPOSE:      LOT site-connected ambient computer — receives AI-generated
              autonomous notifications (e.g., "Coffee time!") from
              lot-systems.com, displays them on-screen, and signals back
              user interactions via the LOT Log API.


--------------------------------------------------------------------------------
01 // PHYSICAL DESIGN
--------------------------------------------------------------------------------

01A — OVERALL DIMENSIONS
  Width:        40.0 mm
  Height:       40.0 mm
  Depth:        5.0 mm
  Corner radius: 3.0 mm (R3 on all four corners, consistent with LOT aesthetic)

01B — SHELL: 2-PART STAINLESS STEEL BODY

  PART 1: BACK SHELL
    Material:  316L stainless steel
    Thickness: 0.8 mm walls + 1.0 mm base
    Finish:    Mirror-polished (#8 finish), no markings on exterior
    Interior:  Machined cavity for PCB stack + battery
    Features:
      - Laser-engraved LOT® wordmark on interior base (hidden, not exterior)
      - 4× M1.0 threaded blind holes for front shell attachment
      - Qi wireless charging window: 26 × 26 mm thinned zone (0.3 mm wall)
        allowing 5 W Qi field to pass through (non-magnetic SS 316L)
      - Rubber gasket groove around perimeter (0.5 mm wide × 0.3 mm deep)
        for IP54 water resistance
    CNC Ops:   Facing, pocketing, threading, polishing

  PART 2: FRONT SHELL
    Material:  316L stainless steel
    Thickness: 0.8 mm walls + 0.6 mm face
    Finish:    Brushed satin (180 grit directional) on non-cutout areas
    Cutouts:
      - Display window: 22 × 16 mm (centered upper zone, recessed 0.2 mm
        for glass flush-mount)
      - Camera aperture: ⌀ 4.2 mm (lower-left, with M4.0 counterbore for lens)
      - Button aperture: ⌀ 5.0 mm (lower-right, with countersink for keycap)
    Features:
      - "COSMO®" silk-screen or UV print below display (0.8 pt text)
      - 4× M1.0 countersunk through-holes aligned to back shell
      - Sapphire glass lens cover over display: 0.5 mm thick, flush-bond

  ASSEMBLY:
    - 4× M1.0 × 3 mm stainless steel countersunk screws
    - Loctite 222 threadlocker
    - Silicone perimeter gasket
    - Conductive foam gasket (internal, PCB-to-shell GND contact)


--------------------------------------------------------------------------------
02 // PCB SPECIFICATION
--------------------------------------------------------------------------------

02A — PCB PARAMETERS
  Dimensions:   38.0 × 38.0 mm (1 mm margin to shell walls on all sides)
  Layers:       4 (Signal / GND / Power / Signal)
  Thickness:    1.0 mm
  Copper:       1 oz outer layers, 0.5 oz inner planes
  Surface:      ENIG (Electroless Nickel Immersion Gold)
  Soldermask:   Black LPI, both sides
  Silkscreen:   White, top only
  Min trace:    0.1 mm / 0.1 mm space
  Min drill:    0.2 mm (laser via)
  Via type:     Through-hole + blind via (L1↔L2)
  Stack-up:     L1 Signal → L2 GND → L3 PWR → L4 Signal
  Manufacturer: PCBWay (https://www.pcbway.com)
  Order qty:    110 bare boards (10 spare)
  Lead time:    8–12 business days standard

02B — PCBA (ASSEMBLY)
  Service:      PCBWay PCBA (turnkey)
  BOM:          Full turnkey — PCBWay sources components
  IPC class:    Class 2
  Solder paste: SAC305 lead-free
  Reflow:       SMT reflow (top side) + selective solder (no THT except button)
  Inspection:   AOI + X-ray on ESP32 module pads
  Programming:  USB-UART flashing fixture (100 units in-house)
  Test:         Functional test fixture (see Section 06)


--------------------------------------------------------------------------------
03 // CORE ELECTRONICS
--------------------------------------------------------------------------------

03A — MAIN SYSTEM-ON-CHIP

  COMPONENT:  ESP32-S3-MINI-1-N8R8
  MFG:        Espressif Systems
  Package:    LCC 15.4 × 11.3 × 2.4 mm
  CPU:        Xtensa LX7 dual-core, 240 MHz
  FLASH:      8 MB (QSPI, integrated)
  PSRAM:      8 MB (Octal, integrated)
  Wi-Fi:      802.11 b/g/n 2.4 GHz
  BT:         Bluetooth 5.0 LE
  GPIO:       45 programmable
  ADC:        2× 12-bit, 20 channels
  Camera IF:  DVP parallel (camera via GPIO)
  USB:        USB 2.0 full-speed OTG (for firmware flash, hidden port)
  Temp range: –40 to +85 °C
  Supplier:   Mouser #356-ESP32S3MINI1N8R8
  Unit cost:  $3.80 (qty 100)

03B — DISPLAY

  COMPONENT:  Good Display GDEP010WS1
  TYPE:       1.02" E-Ink (E-Paper) monochrome
  RESOLUTION: 128 × 80 px
  Size:       25.7 × 17.0 mm (active: 21.8 × 13.6 mm)
  Interface:  SPI (4-wire)
  Refresh:    Full: 2 s | Partial: 0.3 s
  Power:      Sleep: 0 µA | Active: 1 mA
  Voltage:    3.3 V
  WHY E-INK:  Zero power idle → display persists without drain.
              Notification shows indefinitely between Qi charges.
  Supplier:   Good Display direct (https://www.good-display.com)
              Part: GDEP010WS1
  Unit cost:  $4.20 (qty 100)
  Glass cover: 0.5 mm sapphire bonded with UV adhesive

03C — CAMERA

  COMPONENT:  OV2640 sensor module (bare die + M7 lens)
  MFG:        OmniVision / module vendors (HiMax)
  SENSOR:     1/4" CMOS, 2 MP (1600×1200)
  INTERFACE:  DVP 8-bit parallel (direct to ESP32-S3 GPIO)
  LENS:       M7 fisheye f/2.0, 160° FOV, fixed focus, EFL 1.8 mm
              Lens height above PCB: 3.2 mm (fits within 5 mm shell)
  Power:      120 mW active, 1.5 µW sleep
  Module PCB: 8 × 8 mm breakout flex, soldered to main PCB
  Aperture:   ⌀ 3.8 mm clear, ⌀ 4.2 mm shell cutout
  Supplier:   LCSC Electronics / Alibaba module vendors
  Unit cost:  $2.40 (qty 100)
  Notes:      USB video-class not required; images compressed JPEG in firmware
              and posted to LOT API endpoint for remote capture use cases.

03D — WEATHER & ENVIRONMENT SENSOR

  COMPONENT:  Bosch BME688
  TYPE:       Gas / Temperature / Humidity / Pressure
  Gas:        VOC, CO2-equiv, IAQ index (Bosch BSEC2 AI stack)
  Temp:       ±0.5 °C accuracy
  Humidity:   ±3% RH
  Pressure:   ±0.6 hPa
  Interface:  I2C (addr 0x76 / 0x77)
  Package:    LGA-8 3.0 × 3.0 × 0.93 mm
  Power:      Sleep: 0.9 µA | Forced mode: 0.9 mA
  AI:         Bosch BSEC2 library runs on ESP32-S3 — classifies air quality,
              detects burning, alcohol, and ambient events
  Supplier:   Mouser #991-BME688
  Unit cost:  $5.20 (qty 100)

03E — POWER MANAGEMENT

  PRIMARY CHARGER / PMIC:
    COMPONENT:  TP4056 (charging) + IP5306 (boost + battery gauge)
    WHY:        Proven, tiny, handles LiPo charge + 5V boost for USB power path
    OR USE:     BQ25895RTWR (more feature-rich, single IC)
    Package:    WSON-10 or QFN-24
    Supplier:   LCSC Electronics
    Unit cost:  $0.80 + $1.20 = $2.00 combo

  QI WIRELESS CHARGING RECEIVER:
    COMPONENT:  STWLC68JR (STMicroelectronics) or BQ51021YRCT (TI)
    Standard:   Qi 1.2.4, 5 W max
    Efficiency: 82% typical
    Input:      6.5 V / 1 A from coil
    Output:     5 V regulated to PMIC
    Coil:       WR003A (Wurth Elektronik) 15 µH, 26 × 26 mm
                Thickness: 0.3 mm (fits in back shell thinned window)
    Supplier:   Mouser #710-760308101 (coil) + #595-BQ51021YRCT (IC)
    Unit cost:  $2.80 + $1.40 = $4.20 coil + IC

03F — BATTERY

  COMPONENT:  402025 LiPo (4.0 mm × 20 mm × 25 mm)
  CAPACITY:   150 mAh @ 3.7 V nominal (555 mWh)
  C-rate:     0.5C charge (75 mA), 1C max discharge
  Protection: Inline PCM (overcurrent + overcharge + overdischarge)
  Connector:  JST PH 1.25 mm 2-pin
  Supplier:   Alibaba / TinyCircuits / Adafruit (comparable spec)
  Unit cost:  $2.10 (qty 100)
  Runtime:    ~4 h continuous display + Wi-Fi polling (10-min intervals)
              ~48 h display-only (e-paper retains image, Wi-Fi in deep sleep)

03G — COPY BUTTON

  COMPONENT:  Panasonic EVPBA (or Alps Alpine SKRPABE010)
  TYPE:       4.5 × 4.5 mm SMT tactile switch, through-panel actuator
  Actuation:  180 gf, 0.15 mm travel
  Life:       100,000 cycles
  Keycap:     Custom CNC SS 316L, ⌀ 4.8 mm, 1.2 mm protrusion, knurled top
  Supplier:   Mouser #667-EVQ-P4JD5K / Digi-Key
  Unit cost:  $0.35 (switch) + $0.80 (keycap, machined)

03H — USB PROGRAMMING PORT (HIDDEN)

  COMPONENT:  USB Type-C receptacle (hidden recessed in base edge)
  PURPOSE:    Firmware flashing only — not for user access in production
  PLACEMENT:  Right edge of PCB, facing shell gap — accessible via tool pin
  OR:         OTA Wi-Fi updates eliminate need for exposed port;
              factory programming via pogo-pin bed-of-nails fixture

03I — ADDITIONAL ICs
  
  3.3V LDO:   XC6206P332MR (0.1 µA quiescent) — powers display logic
  32.768 kHz: Abracon ABS07 crystal for RTC (ESP32-S3 internal RTC)
  RGB LED:    WS2812B-2020 (2×2 mm) — status indicator, mounted at edge,
              viewable as thin colored ring around button
  ESD:        USBLC6-2SC6Y on all IO lines


--------------------------------------------------------------------------------
04 // FIRMWARE ARCHITECTURE SUMMARY
--------------------------------------------------------------------------------

  Runtime:    ESP-IDF v5.2 (FreeRTOS kernel)
  Language:   C (core) + C++ (BME688 BSEC2 wrapper)
  OTA:        ESP HTTPS OTA via lot-systems.com firmware endpoint
  Boot:       Bootloader → Factory partition → OTA_0 → OTA_1

  TASKS (FreeRTOS):
    TaskWifi       — maintain Wi-Fi connection, exponential backoff reconnect
    TaskNotify     — poll lot-systems.com/api/device/notifications every 10 min
    TaskDisplay    — update e-paper on notification change
    TaskSensor     — BME688 forced-mode measurement every 5 min, post to API
    TaskButton     — ISR → debounce → COPY event → POST to LOT Log API
    TaskCamera     — triggered capture on API command, JPEG POST
    TaskOTA        — background OTA check every 24 h
    TaskRGB        — LED state machine (idle=off, charging=blue pulse,
                     notification=white flash, error=red)
    TaskPower      — monitor battery SOC, deep-sleep trigger at <5%

  CONNECTIVITY:
    Protocol:   HTTPS (TLS 1.3, certificate pinned to lot-systems.com)
    Auth:       Device token (UUID generated at factory, stored in NVS efuse)
    Heartbeat:  POST /api/device/heartbeat every 60 s (includes battery %, temp)
    Log event:  POST /api/device/log with { event:"COPY", deviceId, timestamp }
    Notification GET /api/device/notifications (JSON array, newest first)
    Weather:    POST /api/device/sensor { temp, humidity, pressure, iaq, gas }

  DEEP SLEEP:  ESP32-S3 enters light-sleep between tasks; deep sleep if
               battery < 10% or idle > 30 min. Wakes on RTC timer or button GPIO.

  SESSION COMPRESSION:
    Each active session logged to NVS with:
      - Session ID (UTC timestamp)
      - Notifications received (count + last text)
      - Sensor readings (min/max/avg per session)
      - Battery drain delta
      - Button presses (count)
    Compressed to CBOR (~40 bytes/session) and POSTed to LOT API on next connect.
    Max 32 sessions stored locally before oldest is evicted.


--------------------------------------------------------------------------------
05 // SOFTWARE / API INTEGRATION
--------------------------------------------------------------------------------

  DEVICE → LOT SITE EVENTS:
    COPY button press:
      POST https://lot-systems.com/api/device/log
      Body: { "deviceId": "<uuid>", "event": "COPY", "ts": "<ISO8601>",
              "sensor": { "temp": 22.1, "humidity": 45.2 } }
      → Appears in Log tab at lot-systems.com as:
        [COSMO PAGER] Copy pressed — 2026-06-26T14:32:00Z

    Heartbeat:
      POST https://lot-systems.com/api/device/heartbeat
      Body: { "deviceId": "<uuid>", "battery": 78, "ts": "<ISO8601>",
              "firmwareVersion": "1.0.0" }

    Sensor upload:
      POST https://lot-systems.com/api/device/sensor
      Body: { "deviceId": "<uuid>", "temp": 22.1, "humidity": 45.2,
              "pressure": 1013.2, "iaq": 50, "gasResistance": 42000 }

  LOT SITE → DEVICE:
    Notification poll:
      GET https://lot-systems.com/api/device/notifications?deviceId=<uuid>
      Response: { "notifications": [{ "id": "...", "text": "Coffee time!",
                  "ts": "2026-06-26T09:00:00Z", "priority": "normal" }] }

    Camera trigger:
      GET /api/device/commands?deviceId=<uuid>
      Response may include: { "cmd": "capture", "uploadUrl": "..." }

    OTA trigger:
      Response may include: { "cmd": "ota", "url": "...", "sha256": "..." }

  AUTHENTICATION:
    Header:  Authorization: Bearer <device-token>
    Token:   UUID v4, provisioned at factory flash time
    Storage: ESP32-S3 NVS, protected partition (flash encryption enabled)


--------------------------------------------------------------------------------
06 // TEST & QA PLAN
--------------------------------------------------------------------------------

  FACTORY TEST FIXTURE (bed-of-nails):
    - Pogo pins: 6× (VCC, GND, TX, RX, BOOT, EN)
    - Auto-flash firmware + provision device token
    - Self-test sequence:
        1. Wi-Fi connection (scan + SSID connect)
        2. BME688 register read (device ID 0x61)
        3. Display draw test pattern (checkerboard)
        4. Camera capture (8×8 thumbnail, non-black check)
        5. Button GPIO IRQ test
        6. Qi charging detect (VBUS > 4.5 V on coil input)
        7. Battery voltage read (2.8–4.2 V range check)
        8. LED RGB cycle
        9. LOT API heartbeat POST (200 OK required)
        10. Certify → stamp serial + device ID to NVS

  ACCEPTANCE CRITERIA:
    - All 10 steps PASS = unit ships
    - Any FAIL = rework queue
    - Target: ≥ 95% first-pass yield

  ENVIRONMENTAL:
    - 10 random units from 100: thermal cycle –20 °C to +60 °C × 10 cycles
    - 5 units: drop test 1 m onto hardwood (functional after)
    - 5 units: water splash test (IP54 gasket verification)


--------------------------------------------------------------------------------
07 // CERTIFICATIONS (TARGET — 100-unit pilot waived, production required)
--------------------------------------------------------------------------------

  FCC Part 15 (Wi-Fi + BT):   Required for USA sale
  CE RED (EU):                  Required for EU sale
  RoHS:                         All components RoHS 3 compliant
  Qi:                           WPC Qi logo optional (receiver IC pre-certified)
  UL 2054:                      Battery cell certification (use pre-certified cell)
  FCC ID note:                  ESP32-S3-MINI-1 carries Espressif FCC ID 2AC7Z.
                                 Modular approval covers radio; host device
                                 requires FCC SDoC for unintentional radiators.


--------------------------------------------------------------------------------
08 // PACKAGING
--------------------------------------------------------------------------------

  RETAIL BOX:    Black rigid card (90 × 90 × 20 mm)
  INNER:         COSMO PAGER™ nested in custom EVA foam tray
  INCLUDED:
    - COSMO PAGER™ device
    - Qi wireless charger pad (5 W, USB-C, 1 m cable) — 1× per unit
    - Setup card (QR → lot-systems.com/cosmo-setup)
    - Quick Start Guide (folded card, 4-panel)
  BOX EXTERIOR:  "COSMO PAGER™ by LOT®" | lot-systems.com | "AI Connected"
  LANGUAGE:      English only (v1)


--------------------------------------------------------------------------------
09 // REGULATORY & SAFETY NOTES
--------------------------------------------------------------------------------

  - LiPo battery: UN38.3 certified cell required for air shipping
  - No user-replaceable parts (sealed stainless body)
  - Operating temperature: 0 to +45 °C
  - Charging temperature: +10 to +40 °C
  - Do not expose to salt water (IP54, not IP67)
  - Camera: Privacy LED (RGB) activates during any capture event
  - All AI processing: on-device (BME688 BSEC2) or server-side (lot-systems.com)
    — no third-party AI cloud calls from device


================================================================================
END OF DOCUMENT — LOT-COMPUTER-HW-SPEC-v1
CLASSIFICATION: RESTRICTED // S-2 EYES
LOT SYSTEMS CORPORATION | brand.lot-systems.com
================================================================================
