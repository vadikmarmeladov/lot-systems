<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-COMPUTER-FIRMWARE
TITLE:    LOT® Computer — Firmware Architecture (brief points 9, 11)
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-03
STATUS:   ARCHITECTURE ONLY — NO CODE WRITTEN
================================================================================

Companion to docs/corporate/LOT_COMPUTER_HARDWARE_PLAN_v1.md. This is a
standalone document per the brief's own instruction (point 11: "separate
documents") — it does not duplicate the software/companion-app document
(docs/technical/LOT-COMPUTER-SOFTWARE.md), which covers the phone/desktop
pairing app and the LOT API wire format. This document covers only what runs
on the ESP32-S3 itself.

--------------------------------------------------------------------------------
01 // PLATFORM
--------------------------------------------------------------------------------

  MCU              ESP32-S3-WROOM-1-N8R8 (BOM §1)
  FRAMEWORK        ESP-IDF (not Arduino-core) — chosen over Arduino for
                   direct access to the ESP32-S3's low-power modes and the
                   camera DVP peripheral's DMA path, both load-bearing for
                   the 04.5 privacy guarantee below.
  RTOS             FreeRTOS (bundled with ESP-IDF) — one task per subsystem
                   (radio, display, sensor poll, button, camera-presence),
                   not a monolithic loop.
  LANGUAGE         C (ESP-IDF native), with the presence-detection inference
                   pass isolated in its own compilation unit for future
                   portability to the Himax HX-WE2 co-processor (hardware
                   plan 04.8, v2.0).

--------------------------------------------------------------------------------
02 // TASK ARCHITECTURE
--------------------------------------------------------------------------------

  TASK                  PRIORITY   WAKE CONDITION                        RESPONSIBILITY
  ───────────────────   ────────   ───────────────────────────────────   ─────────────────────────────────
  radio_task             high      HTTPS long-poll response, or          Maintains the device-events
                                    30s keepalive timer                   connection to qi.lot-systems.com
                                                                           (LOT-COMPUTER-SOFTWARE.md §2);
                                                                           decodes payload, hands off to
                                                                           display_task
  display_task           high      Message from radio_task queue         Renders text/glyph to the GC9A01A
                                                                          panel (BOM §2); owns the 8s
                                                                          on-screen timeout before the
                                                                          panel returns to idle-blank
  button_task            highest   GPIO interrupt (B3S-1000 press)       Debounce (20ms), check
                                                                          "notification currently displayed"
                                                                          flag, if true → enqueue Copy event
                                                                          to radio_task's outbound queue
                                                                          (hardware plan 04.9 — no-op
                                                                          otherwise)
  sensor_task             low      1x per 60s timer                      Polls BME688 (weather, 04.7) and
                                                                          BHI260AP fused output (04.8);
                                                                          batches into the M2M Format 3
                                                                          payload (LOT-COMPUTER-SOFTWARE.md
                                                                          §3) sent once per 15 min, not
                                                                          per-poll — radio airtime budget
  presence_task           low      Timer, 1x per 4s while device         Captures ONE frame from the OV2640
                                    is unlocked/awake                     (BOM §3), runs the on-device
                                                                          presence classifier (03 below),
                                                                          discards the frame buffer
                                                                          immediately, emits a single bool
  power_task              idle     Battery ADC read, 1x per 5 min        Tracks charge state off the
                                                                          STWLC03 status pin (BOM §5);
                                                                          drives the v.0 CUBIQ-style single
                                                                          LED indicator (charge/pairing only
                                                                          — this device, like CUBIQ, treats
                                                                          light as secondary and utilitarian)

--------------------------------------------------------------------------------
03 // THE PRESENCE-DETECTION GUARANTEE (hardware plan 04.5)
--------------------------------------------------------------------------------

This is the section that makes the camera's privacy claim a firmware fact,
not a policy statement, so it is specified precisely:

  1. presence_task requests one frame from the OV2640 over the ESP32-S3's
     DVP/I2S camera peripheral, into a PSRAM frame buffer.
  2. A fixed, on-device classifier (frame-difference + simple luminance-
     blob heuristic in v1.0 — not a neural network; a full CNN is the
     Himax HX-WE2 v2.0 path, hardware plan 04.8) runs against that single
     buffer and produces one boolean.
  3. The frame buffer is freed (`heap_caps_free`) in the same function call
     that produces the boolean, before presence_task yields back to the
     scheduler.
  4. **Build-level guarantee:** the camera peripheral's DMA target is never
     an address the WiFi/BLE driver's buffer pool can read, and no function
     in the codebase passes the camera frame buffer pointer to any function
     in `radio_task`'s translation unit. This is checked at code-review
     time by a standing rule, not by runtime access control alone: any pull
     request that adds an `#include` from the camera module into the radio
     module's translation unit is rejected on sight.
  5. The only network-visible artifact of the camera's existence is the
     `presence: true/false` field inside the periodic sensor payload
     (LOT-COMPUTER-SOFTWARE.md §3, M2M Format 3) — a single bit, timestamped,
     indistinguishable on the wire from a PIR motion sensor's output.

  This is stated in LOT-COMPUTER-MANUAL.md in owner-facing language so it is
  auditable by the person who owns the unit, not just asserted here.

--------------------------------------------------------------------------------
04 // NOTIFICATION RENDER PATH (brief point 2)
--------------------------------------------------------------------------------

  Index of Systems event (server-side, existing QI·46 Calibration Loop)
        │
        ▼
  qi.lot-systems.com/v1/device-events  (LOT-COMPUTER-SOFTWARE.md §2)
        │  HTTPS long-poll response
        ▼
  radio_task decodes { "render": "Coffee time!", "ttl_s": 8, "glyph": null }
        │
        ▼
  display_task:
    - if a notification is already on-screen, the new one queues (FIFO,
      max depth 3 — older undisplayed notifications are dropped, never
      silently replaced without being shown at least once)
    - draws text centered in the 240x240 round frame buffer, GC9A01A SPI
      panel (BOM §2)
    - starts the ttl_s countdown; on expiry, screen returns to idle-blank
      (matching the CUBIQ house rule: light/screen is secondary, not a
      persistent feed — LOT-CUBIQ-QUANTUM-CUBE-v0.md Section 04)
    - sets the "notification currently displayed" flag button_task reads

--------------------------------------------------------------------------------
05 // PROVISIONING & OTA
--------------------------------------------------------------------------------

  FIRST-BOOT PAIRING   BLE GATT provisioning (ESP-IDF `wifi_provisioning`
                       component) — companion app (LOT-COMPUTER-SOFTWARE.md
                       §1) sends WiFi credentials + a one-time device-claim
                       token over BLE; device never ships with WiFi
                       credentials baked in.
  OTA                  ESP-IDF native OTA (`esp_https_ota`), dual-partition
                       A/B scheme — a failed boot after update auto-rolls
                       back to the previous partition (watchdog-verified,
                       3 failed boots trigger rollback). This is the
                       mechanism the v0.4 PVT gate (LOT-COMPUTER-ROADMAP.md)
                       tests at "20/20 OTA updates succeed."
  SIGNING              OTA images signed (ESP-IDF secure boot v2 + flash
                       encryption) — required before any unit leaves
                       controlled hands per hardware plan Section 07.

--------------------------------------------------------------------------------
06 // POWER BUDGET (against the 04.4 battery constraint)
--------------------------------------------------------------------------------

  STATE                    CURRENT DRAW (EST.)   DUTY
  ──────────────────────   ───────────────────   ────────────────────────
  Deep sleep (WiFi off)     ~15uA                 Between sensor_task and
                                                    presence_task wakes
  Radio idle (long-poll)    ~15-40mA (WiFi modem
                             sleep between polls)  Majority of awake time
  Display active + render   ~25mA (backlight/
                             panel draw)           <8s per notification
  Camera capture pass       ~90mA spike, <200ms    Every 4s while awake

  At a 350-400mAh cell (BOM §5) and the above duty cycle, target runtime is
  a planning estimate of 3-4 days between charges — to be measured, not
  assumed, at the v0.2 EVT stage (LOT-COMPUTER-ROADMAP.md) before it is
  quoted to a subscriber as a spec number.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-COMPUTER-FIRMWARE
================================================================================
