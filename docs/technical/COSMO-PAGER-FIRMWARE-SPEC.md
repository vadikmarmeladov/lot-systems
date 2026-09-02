<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® PAGER — Firmware Specification

**Document:** COSMO-PAGER-FIRMWARE-SPEC
**Parent plan:** docs/corporate/COSMO-PAGER-HARDWARE-COMPUTER.md (Section 11)
**Companion:** docs/technical/COSMO-PAGER-SOFTWARE-BRIDGE.md
**Author:** Vadik Marmeladov, Inventor — COSMO® CIA
**Date:** 2026-09-02
**Version:** 0.1 — pre-hardware, targets v0.1 breadboard build

This document owns everything that runs ON the device. It does not
duplicate the physical BOM (see parent plan Section 04) or the platform
API contract (see the software bridge document) beyond what firmware
needs to implement against them.

---

## 1. Target MCU and Toolchain

| Item | Choice | Why |
|---|---|---|
| SoC | ESP32-S3-WROOM-1 | WiFi + BLE, DVP camera interface, enough RAM/flash for a single-line display + one sensor + TLS client |
| Framework | ESP-IDF (not Arduino) | Direct access to power-management APIs and the camera DVP driver; Arduino-ESP32 wraps both with overhead this device's power budget can't afford |
| RTOS | FreeRTOS (bundled with ESP-IDF) | Four tasks total (Section 3) — no custom scheduler needed |
| OTA | ESP-IDF native OTA, dual-partition | A/B slot so a bad firmware push never bricks a unit already on someone's desk |

---

## 2. Power Budget and Sleep Model

The device is desk-resident and Qi-charged (parent plan Section 03), so
firmware optimizes for **idle current**, not battery life between
charges — the 250mAh cell (parent plan Section 04) is a buffer against
being lifted off the charging pad, not a daily-use battery.

```
STATE               CURRENT      DURATION
─────               ───────      ────────
Deep sleep           <20µA        Default state, WiFi radio off,
                                    BME688 in forced low-power mode
Wake on button        —           GPIO interrupt wake
Wake on pager push     —           Scheduled light-sleep + WiFi modem
                                    sleep between poll intervals
                                    (Channel 2 poll, Section 4)
Active (display+radio) ~80mA       <2s per pager line render
Camera active          ~120mA      <500ms per frame (Job 1 or Job 2 only,
                                    parent plan Section 08 — never idle)
```

No state exists where the device is awake, on WiFi, and not actively
doing one of: polling Channel 2, sending Channel 1/3, or servicing a
camera job. This is enforced by never leaving the WiFi radio task
runnable outside those three windows — see Section 3.

---

## 3. Task Architecture (FreeRTOS)

```
TASK                 PRIORITY   RESPONSIBILITY
────                 ────────   ──────────────
sensor_task           2          BME688 sample on a session timer
                                  (parent plan Section 06 — "on the way
                                  in" compression happens HERE, not on
                                  the server: firmware keeps a running
                                  min/max/mean per sensor per session,
                                  never buffers raw samples)
pager_poll_task        3          Long-poll GET /v1/pager/subscribe
                                  (software bridge doc, Channel 2).
                                  On a line arriving: hands off to
                                  display_task, does not render itself
display_task            2          Owns the SPI memory-LCD/OLED. Single
                                    responsibility: render one string,
                                    ≤24 chars (hard truncation guard —
                                    the platform is contracted not to
                                    send more, Section 4, but firmware
                                    truncates-and-logs rather than
                                    crashing if it ever does)
button_task              4          Debounced GPIO ISR -> queue. Short
                                    press = Channel 3 (Copy). Long press
                                    (3s) = enter pairing mode -> hands
                                    off to camera_task Job 2
camera_task               1          Idle: shutter closed, module
                                     powered off. Runs ONLY for Job 1
                                     (10-min timer, ambient light) or
                                     Job 2 (pairing). No third caller
                                     exists in code — this is the code-
                                     level enforcement of parent plan
                                     Section 08's hard gate
```

Priorities keep pairing/button response snappy (4) over cosmetic
ambient-light sampling (1) — the operator pressing COPY should never
feel input lag because a light sample happens to be running.

---

## 4. Camera Job Enforcement (parent plan Section 08)

```c
// Illustrative shape, not final code. The invariant that matters:
// there is no third caller of camera_power_on() anywhere in firmware.
typedef enum { CAM_JOB_AMBIENT, CAM_JOB_PAIRING } camera_job_t;

void camera_run_job(camera_job_t job) {
    shutter_open();
    camera_power_on();
    frame_t f = camera_capture_one();
    if (job == CAM_JOB_AMBIENT) {
        display_set_brightness(ambient_from_frame(f));
    } else {
        qr_result_t r = decode_qr(f);
        if (r.valid) pairing_submit(r.payload);
    }
    frame_discard(f);          // never written to flash, never queued for TX
    camera_power_off();
    shutter_close();
}
```

The shutter-closed state is the firmware's default and its explicit
return path — `camera_run_job` cannot return without calling
`shutter_close()` (structured so a failure mid-capture still closes the
shutter in a `finally`-equivalent cleanup). Test-jig verification
(parent plan Section 07, v1.0 gate) checks this mechanically, not by
reading the code.

---

## 5. Session Definition and Compression

A "session" (parent plan Section 06) is bounded by the device leaving
and returning to the Qi charging pad, detected via the charge-IC's
`CHG_STAT` line (STWLC38). On session close:

1. `sensor_task`'s running min/max/mean is packaged as ONE Format-3
   M2M payload (software bridge doc, Channel 1) and queued for send.
2. The raw sample ring buffer is cleared — it never persists past the
   session it was collected in, and it is never sent as a raw series.
3. If the device never leaves the pad (stationary desk unit, the
   common case), a session closes on a 24-hour timer instead, so data
   still ships daily even without a physical lift event.

---

## 6. Display Rendering Contract

- Input: a single string, ≤24 characters (software bridge doc, Channel
  2, server-side cap).
- No word-wrap, no scroll, no marquee. If a line is too long for the
  physical character width at the chosen font size, firmware truncates
  with a single trailing `.` and emits a diagnostic log line — this is
  a contract violation from the platform side and is meant to be rare
  and visible, not silently handled forever.
- `gesture` field (`nudge` | `flash` | `hold`, software bridge doc)
  maps to a display transition only — no haptic actuator exists on
  this device (that is CUBIQ's job, not P-1's — parent plan Section
  02). `nudge` = fade in, `flash` = blink 2x then hold, `hold` = appear
  instantly and stay until the next line or a 24h timeout clears it.

---

## 7. OTA and Versioning

- Firmware version string is embedded in every Channel 1 M2M payload
  (`fw_version` field, additive to the existing M2M schema — does not
  break LOT-TERMINAL-M2M.md's existing consumers).
- PDF manuals (parent plan Section 10) are regenerated per firmware
  tag — a manual in a box always describes the firmware that shipped
  in that box.
- OTA pulls are opt-in per device via a config flag set at pairing
  time; a desk-resident notification device auto-updating itself
  without consent is exactly the kind of unaccountable behavior the
  LOT Autonomous AI Server doctrine (docs/technical/LOT-NODE-0-RIG-SPEC.md
  Section 04, "NO SILENT WRITES") argues against — the same discipline
  applies to firmware pushes onto hardware someone owns.

---

## 8. Open Items for v0.5

- Confirm BME688 BSEC2 library RAM footprint fits alongside the WiFi
  TLS stack on ESP32-S3's SRAM without switching to PSRAM (adds a BOM
  line if not).
- Confirm DVP camera ribbon routing survives the 9-11mm v0.5 Z-height
  target (parent plan Section 03) without a right-angle connector
  penalty on board area.

---

**Authorized by:** S-2 // Vadik Marmeladov, Inventor — COSMO® CIA
**End COSMO-PAGER-FIRMWARE-SPEC**
