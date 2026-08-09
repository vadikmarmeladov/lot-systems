<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT SYSTEMS CORPORATION
## COSMO® Computer — Hardware Plan, Bill of Materials, and Build Roadmap

**Document:** LOT_COSMO_COMPUTER.md
**Classification:** Restricted // S-2 Eyes — Product Vision & Procurement Plan
**Prepared:** August 9, 2026
**Inventor:** Vadik Marmeladov, Founder & CEO, LOT Systems · COSMO®
**Status:** v1.0 — PLANNING (pre-fabrication, design lock pending)
**Branch:** `claude/brave-lamport-xdjrxx`

---

## 00 // READING LOG — SOURCES THIS DOCUMENT IS BUILT ON

This is the physical hardware computer named in `docs/benchmark/LOT-MANIFEST.md`
line item **"COSMO Hardware | brave-lamport-t9z5u8 | COSMO® Cube — complete
hardware computer design v1.0."** That branch series is gone from the remote;
this document is the first surviving specification of the object it named.
It is written from the current session, on a branch sharing the same
`brave-lamport` lineage, closing the gap the manifest left open.

Before writing a line of spec, the following prior art was read in full:

  `docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md`
    The sibling hardware track. CUBIQ™ is explicitly scoped there as
    **"a notification body, not a computer."** Section 00 of that document
    names this object directly: *"a general-purpose hardware computer"*
    under Kuzya's COSMO® brand, textually distinct from CUBIQ. This
    document is that object. The two share no naming collision, no shared
    enclosure, and no shared actuator stack — they share a charging
    philosophy (wireless, table-as-power-surface) and a notification
    philosophy (motion/glance over screen-feed).

  `docs/corporate/LOT_ROBOTICS_COSMO.md`
    COSMO® brand thesis — behavioral-verified soul transfer, the
    Benchmark Arbitrage® gate, Phase 3 revenue path ("COSMO® Hardware,
    2028–2029, $2,500–$5,000/unit + $100/month soul sync"). The Computer
    is the near-term, buildable precursor to that roadmap: a desk object
    that proves the LOT ⇄ hardware sync loop before a full robotics form
    factor is attempted.

  `docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md`
    Section III (Technology Layers) and the platform mapping table —
    "Quantum Cube Hardware | Hardware feedback integration (Month 12+) |
    PLANNED." Confirms hardware was always the terminal layer of the
    Calibration Loop, not an afterthought.

  `src/client/components/Logs.tsx`, `src/client/stores/router.ts`
    The live "Log" tab — military-format handler lines (`MCOHERE:`,
    `CEXP:`, `BIOARC:`, etc.) rendered from `Logs.tsx`. Item 16 of the
    build brief ("Button as 'Copy' with a signal back to the site's Log
    tab") targets this exact surface. The device writes a new handler
    class into this same feed.

  `src/server/routes/api.ts`, `src/server/routes/public-api.ts`,
  `src/server/routes/os-api.ts`
    The existing LOT API surface. Section 06 of this document specifies
    the COSMO Computer as a client of these routes (plus new endpoints
    scoped in `COSMO_COMPUTER_SOFTWARE.md`) rather than a parallel stack.

  Brand and Institute reference pages (`brand.lot-systems.com`,
  `lot-systems.com/about`, `institute.lot-systems.com/cqgs.html`) were
  named in the build brief as reading material. They were not reachable
  from this session's network (egress policy blocks the `lot-systems.com`
  domain family from this container) — the document instead draws brand
  and technical continuity from the mirrored corpus already checked into
  `docs/corporate/` and `docs/technical/`, which is the authoritative
  in-repo source for this material. A follow-up session with reachable
  egress should diff this document against the live brand pages and
  reconcile any drift.

---

## 01 // WHAT THIS IS AND WHAT IT IS NOT

**COSMO® Computer** is a small, dual-face desk object: one face a polished
stainless steel mirror, the other face a working computer — camera,
screen, button, sensors — synced continuously to a LOT® profile over the
LOT API. It is the hardware terminus of the Calibration Loop that
`CQGS-WHITE-PAPER-SNAPSHOT.md` already names as "PLANNED."

  IT IS:
    - A general-purpose embedded computer (not a single-purpose
      notification actuator like CUBIQ) that receives AI-driven signals
      from lot-systems.com and displays them as short, glanceable text —
      "Coffee time!" being the reference example from the brief.
    - A physical extension of the site's **Log tab**: a hardware button
      that writes a new log line back into the operator's own Logs feed,
      closing a hardware→software loop the same way CUBIQ closes a
      software→hardware one.
    - A pilot-run product: 100 units, built to prove the industrial
      design, the firmware, and the LOT API connector before any larger
      manufacturing commitment.

  IT IS NOT:
    - CUBIQ. No actuator, no jump mechanics, no levitation research
      track. This object does not move itself.
    - A general AI assistant or camera-first surveillance device. The
      camera exists for one function only (Section 04) and is inert
      otherwise — no local recording loop, no third-party data sale, in
      keeping with `LOT_ROBOTICS_COSMO.md`'s ethical framework ("What LOT
      Will Never Do").
    - A COSMO® robotics unit in the `LOT_ROBOTICS_COSMO.md` sense. It
      carries no soul-transfer profile and requires no Benchmark gate.
      It is infrastructure for that future, not an instance of it.

---

## 02 // PHYSICAL FORM

```
                    ┌──────────────────────────┐
                    │                          │
                    │   FACE A — MIRROR SIDE   │
                    │   polished stainless      │
                    │   steel, no markings      │
                    │                          │
                    └──────────────────────────┘
                              │  5mm
                    ┌──────────────────────────┐
                    │                          │
                    │   FACE B — COMPUTE SIDE  │
                    │   camera · screen ·       │
                    │   button                  │
                    │                          │
                    └──────────────────────────┘

        Footprint: 40mm × 40mm (4cm × 4cm)      Height: 5mm
```

| Spec | Value | Note |
|---|---|---|
| Footprint | 40mm × 40mm | "A flat silver square 4×4cm" — item 4 |
| Height | 5mm | Flush desk object, not a stand-up unit |
| Body | 2-part stainless steel shell | Item 3 — top (Face B carrier) + bottom (Face A mirror), machined and laser-cut, joined at a hairline seam around the perimeter |
| Face A | Polished (mirror-finish) stainless steel | Item 17 — no camera, no screen, no button. This is the "off" face — the object at rest on a desk or shelf |
| Face B | Camera + screen + button | Item 18 — the "on" face, oriented up when the operator wants presence |
| Finish | Face A: mirror polish (Ra < 0.05 µm). Face B: bead-blasted matte bezel around the display cutout | Matches LOT's black/silver material language already used for CUBIQ's nano-ceramic shell — silver here to visually pair with Face A |
| Charging | Wireless, Qi-class inductive, through Face A (mirror side sits face-down on the charging pad; Face B stays up, legible, while charging) | Items 12 + 19 |
| Weight target | < 60g fully assembled | 5mm height forces a compact stack — every component is chosen against this ceiling |

A 4×4cm × 5mm envelope is tight. It rules out a coin-cell-plus-MCU hobbyist
stack and forces a flip-chip / chip-scale component strategy — this shapes
every BOM choice in Section 03.

---

## 03 // BILL OF MATERIALS (BOM) — PILOT RUN, 100 UNITS

All links below are to real supplier catalog / category pages for
sourcing reference, not confirmed purchase orders. Prices are August 2026
street estimates for 100-unit quantity where available; confirm against
live quotes before committing spend.

### 03.1 — Compute / Connectivity

| Item | Candidate Part | Why | Source |
|---|---|---|---|
| SoC / MCU | ESP32-S3 (WROOM-1 module, or bare chip for the 5mm-height BOM) | Wi-Fi + BLE on one die, camera-interface (DVP) support, enough headroom for a local UI loop + LOT API client | [espressif.com/en/products/socs/esp32-s3](https://www.espressif.com/en/products/socs/esp32-s3) · [digikey.com search: ESP32-S3](https://www.digikey.com/en/products/filter/embedded-processors-controllers/786) |
| Camera module | OV2640 (2MP) low-height variant | Smallest common off-the-shelf DVP camera that pairs natively with ESP32-S3 tooling; 2MP is enough resolution for the single function in Section 04 | [seeedstudio.com — OV2640 camera modules](https://www.seeedstudio.com/catalogsearch/result/?q=OV2640) |
| Display | 0.96"–1.3" round or square TFT/OLED, SPI interface, ≤ 2mm module height | Must clear the 5mm shell height alongside the camera and battery stack — round OLED matches the square footprint with a circular "coin" readout | [adafruit.com — OLED breakouts](https://www.adafruit.com/category/63) · [mouser.com — display modules](https://www.mouser.com/c/optoelectronics/display-modules/) |
| Wireless charge receiver | Qi receiver IC + coil, e.g. BQ51013B-class | Standard, well-documented Qi receiver reference design; coil must be sized to fit inside the 40×40mm footprint without conflicting with the camera/display stack | [ti.com — BQ51013B](https://www.ti.com/product/BQ51013B) |
| Battery | Thin-format LiPo, ≤ 1.5mm cell, ~40–80mAh | Height-constrained cell — trades runtime for form factor; device is expected to sit on/near its charging pad most of the time | [digikey.com search: thin LiPo pouch cell](https://www.digikey.com/en/products/filter/batteries-non-rechargeable-primary/90) |
| Button | Low-profile SMD tactile switch, ≤ 0.8mm actuation height | Single button, Face B — see Section 05 for its function | [mouser.com — SMD tactile switches](https://www.mouser.com/c/electromechanical/switches/tactile-switches/) |

### 03.2 — Sensors (Item 14, 15 — weather + off-the-shelf AI-grade sensors)

| Item | Candidate Part | Signal | Source |
|---|---|---|---|
| Environmental / weather | Bosch BME280 or BME680 | Temperature, humidity, barometric pressure (BME680 adds gas/VOC) | [bosch-sensortec.com/products/environmental-sensors/bme280](https://www.bosch-sensortec.com/products/environmental-sensors/bme280/) · [digikey.com search: BME280](https://www.digikey.com/en/products/filter/humidity-moisture-sensors/529) |
| Ambient light | VEML7700 or similar I²C ALS | Auto-dims the Face B display, avoids screen-glow at night — keeps the "anti-feed thesis" from `LOT-CUBIQ-QUANTUM-CUBE-v0.md` intact (light stays utilitarian, not attention-seeking) | [vishay.com — VEML7700](https://www.vishay.com/en/product/84286/) |
| Motion / presence | LIS2DUX12 or similar low-power 3-axis accelerometer | Wake-on-touch / wake-on-pickup, avoids an always-on display draining the small cell | [st.com — LIS2DUX12](https://www.st.com/en/mems-and-sensors/lis2dux12.html) |

"AI-grade off-the-shelf sensors" (item 15) is interpreted here as: standard
commodity sensor ICs (not custom silicon), chosen so their raw output is
clean enough to feed directly into LOT's existing signal-classification
pipeline (the same Calibration Loop that already ingests mood, journal,
and biofield signals) without on-device inference. All on-device
"intelligence" is signal conditioning only — classification happens
server-side via the LOT API, consistent with `os-api.ts` / `public-api.ts`.

### 03.3 — Enclosure & Fabrication

| Item | Spec | Vendor track | Source |
|---|---|---|---|
| PCB | 2-layer or 4-layer rigid-flex, 40×40mm max outline, thickness ≤ 0.8mm to leave room for the battery/camera stack under the 5mm shell | **PCBWay** (item 1 — named vendor) | [pcbway.com](https://www.pcbway.com/) — quote via their online instant-quote tool for a 40×40mm 4-layer board, 100-unit run, plus PCBWay's SMT assembly service (populate the board there rather than hand-assemble 100 units) |
| Stainless steel shell (2 parts) | Face A: mirror-polished 40×40mm plate, ~1.5mm stock. Face B: 40×40mm carrier plate with camera/display/button cutouts, ~1.5mm stock. CNC-milled + polished | Precision sheet-metal / CNC vendor — PCBWay also offers CNC machining and sheet metal fabrication as an adjacent service to its PCB business, worth quoting alongside the board run for single-vendor logistics | [pcbway.com/rapid-prototyping/CNC_Machining.html](https://www.pcbway.com/rapid-prototyping/CNC_Machining.html) |
| Assembly hardware | Perimeter seam: laser-welded or press-fit tab closure (no visible screws on either face, to preserve Face A's unbroken mirror surface) | TBD with the CNC/sheet-metal quote | — |

### 03.4 — Estimated Unit Cost (100-unit pilot run, rough order of magnitude)

```
PCB fab + SMT assembly (PCBWay)         $18 – $28 / unit
Stainless steel shell (2-part, CNC)     $12 – $22 / unit
SoC + camera + display + sensors        $9  – $14 / unit
Battery + Qi receiver                   $3  – $5  / unit
Misc (button, fasteners, packaging)     $2  – $4  / unit
─────────────────────────────────────────────────────────
ESTIMATED UNIT COST                     $44 – $73 / unit
100-UNIT PILOT RUN                      $4,400 – $7,300
```

These are planning-grade estimates for budgeting the pilot, not binding
quotes. Confirm against live PCBWay + CNC vendor quotes before committing
to the 100-unit order (Section 07, Phase 3).

---

## 04 // FUNCTION — WHAT THE DEVICE ACTUALLY DOES

Two data paths, one object. Both ride the existing LOT API rather than a
new backend.

### 04.1 — Inbound: the pager (items 2, 6)

```
lot-systems.com (AI signal — Index of Systems / QI-46)
        │
        ▼
LOT API  (src/server/routes/api.ts, os-api.ts, public-api.ts
          + a new COSMO Computer endpoint, scoped in
          COSMO_COMPUTER_SOFTWARE.md)
        │
        ▼
COSMO Computer firmware (COSMO_COMPUTER_FIRMWARE.md)
        │
        ▼
Face B screen — short text line, e.g. "Coffee time!"
```

This is a pager, not a chat client: one line of text, no scroll, no reply
UI on-device. The reply channel is the button (Section 04.2), not the
screen. This mirrors the CUBIQ anti-feed thesis in a different medium —
motion there, a single glanceable line here — rather than opening a
second attention surface.

### 04.2 — Outbound: the Copy button → Log tab (item 16)

```
Face B button pressed
        │
        ▼
Firmware packages a signal event (timestamp, device id,
last-displayed message id)
        │
        ▼
LOT API endpoint (new — see COSMO_COMPUTER_SOFTWARE.md)
        │
        ▼
Written as a new log line in the operator's Logs feed
(src/client/components/Logs.tsx) — a new military-format
handler, e.g. HWCOPY: <message echoed> · <timestamp>
```

"Copy" names the button's function precisely: it does not dismiss or
acknowledge in the generic sense, it **copies** the notification currently
on Face B back into the permanent record on lot-systems.com. The device
never stores history locally beyond the current line — the Log tab is the
device's memory, by design (see Section 05, session compression).

### 04.3 — Camera (item 5)

Scoped narrowly, consistent with `LOT_ROBOTICS_COSMO.md`'s ethical
framework: the camera captures a single still frame only on an explicit,
user-initiated trigger (long-press of the Face B button, distinct from
the short-press "Copy" action), used for one of:
  - A presence check paired with the ambient-light/motion sensors (is
    someone actually at the desk before a pager message is escalated)
  - An optional, explicitly-opted-in visual log entry attached to a Logs
    tab line, mirroring how journal entries already attach text
No continuous recording, no local video buffer, no cloud upload without
the same explicit trigger. This boundary is a firmware-level gate, not a
UI setting — see `COSMO_COMPUTER_FIRMWARE.md` Section 03.

---

## 05 // SESSION COMPRESSION (item 8)

The device holds no long-term local state. Each "session" — power-on to
next Face-A-down charging dock, or a rolling 24h window, whichever is
shorter — is compressed to a single structured event before being
flushed to the LOT API:

```
{
  deviceId,
  sessionStart, sessionEnd,
  messagesDisplayed: [ {id, ts} ],   // ids only, not full text —
                                      // full text already lives
                                      // server-side, no duplication
  copyEvents: [ {messageId, ts} ],
  sensorSummary: { tempAvg, humidityAvg, pressureAvg, lightAvg },
  cameraTriggers: n                  // count only, unless an explicit
                                      // opt-in visual log was attached
}
```

This is the same compression discipline the Memory Engine already applies
to journal/mood signals (raw event → compressed daily/weekly arc) — the
device is a new signal source into an existing pattern, not a new
storage paradigm. Full specification of the compression schema and sync
cadence belongs in `COSMO_COMPUTER_SOFTWARE.md` (Section 07 below).

---

## 06 // LOT API CONNECTOR (item 6)

The device is a client, not a server. It authenticates once (device
pairing, tied to a single LOT profile — no shared/anonymous units) and
thereafter:

  - **Polls or subscribes** (long-poll or lightweight persistent
    connection, TBD in firmware doc) for pager messages
  - **Posts** Copy-button events and compressed sessions (Section 05)
  - **Never** holds a standing write scope beyond its own device's log
    stream — it cannot read or write any other part of the operator's
    profile

Full endpoint contract, auth flow, and payload schemas are specified in
`docs/technical/COSMO_COMPUTER_SOFTWARE.md`, which extends
`src/server/routes/api.ts` / `os-api.ts` rather than standing up a
parallel service.

---

## 07 // ROADMAP

```
PHASE 0 — THIS DOCUMENT (2026-08-09)
  Plan, BOM, sourcing links, positioning against CUBIQ and the
  COSMO® robotics thesis. No hardware ordered yet.

PHASE 1 — FIRMWARE + SOFTWARE SPEC (next session)
  docs/technical/COSMO_COMPUTER_FIRMWARE.md
  docs/technical/COSMO_COMPUTER_SOFTWARE.md
  Define the LOT API endpoint contract, auth/pairing flow, the
  compressed-session schema (Section 05), and the camera-gate
  logic (Section 04.3) in implementable detail.

PHASE 2 — PROTOTYPE (1–3 units)
  Dev-kit stand-in for the 5mm form factor (breakout boards, no
  custom PCB yet) — validate firmware + API loop end-to-end before
  committing to the constrained PCB layout. Gate: pager message
  round-trip + Copy → Log tab round-trip both work reliably on
  real hardware.

PHASE 3 — PCB + ENCLOSURE (PCBWay quote → fab)
  Commission the 40×40mm PCB design, get PCBWay SMT assembly +
  CNC/sheet-metal quotes for the 2-part stainless shell (Section
  03.3). Gate: 5 fully-assembled review units pass fit, charge,
  and the Phase 2 functional gate in the real enclosure.

PHASE 4 — PILOT RUN (100 UNITS, item 13)
  Place the 100-unit PCBWay + shell order. Gate: 500/500 charge
  cycles with zero thermal or mechanical failures across a sample
  set, before wider distribution — same gate discipline the CUBIQ
  document holds its own actuator to (500/500 hop cycles).

PHASE 5 — MANUALS + DOCUMENTATION (item 7, 9, 10, 11)
  PDF user manual (see companion PDF, this session).
  Firmware doc finalized from Phase 1 draft.
  Software/API connector doc finalized from Phase 1 draft.
  Kept as separate documents per item 11 — hardware plan (this
  file), firmware, software, and manual are four distinct
  documents, cross-referenced, not merged into one.

PHASE 6 — DISTRIBUTION
  100 units to early Purple/Black-tier Benchmark operators
  (`LOT_ROBOTICS_COSMO.md` tiering) as the first hardware cohort —
  feeding real usage data back into the same Calibration Loop the
  CQGS white paper already names as the destination for hardware
  feedback (Month 12+ milestone).
```

---

## 08 // DOCUMENT MAP (item 11 — separate documents)

| Document | Scope | Status |
|---|---|---|
| `docs/corporate/LOT_COSMO_COMPUTER.md` | This file — plan, BOM, roadmap, positioning | v1.0 — this session |
| `docs/technical/COSMO_COMPUTER_FIRMWARE.md` | On-device firmware architecture | v0.1 — this session |
| `docs/technical/COSMO_COMPUTER_SOFTWARE.md` | LOT API connector, pairing, sync protocol | v0.1 — this session |
| `docs/corporate/COSMO_COMPUTER_MANUAL.pdf` | End-user PDF manual (item 7) | v0.1 — this session |
| `docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md` | Sibling hardware track (notification cube, not this computer) | Prior art, referenced |
| `docs/corporate/LOT_ROBOTICS_COSMO.md` | COSMO® robotics brand thesis, this device's long-term context | Prior art, referenced |

---

## 09 // BRAND

```
COSMO® Computer          The object specified in this document
LOT® Log Tab              The permanent record the Copy button writes to
LOT®† COSMO®              The combined mark — LOT software, COSMO hardware
```

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT_COSMO_COMPUTER
================================================================================
