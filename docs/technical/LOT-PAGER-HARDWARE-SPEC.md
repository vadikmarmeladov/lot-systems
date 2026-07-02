================================================================================
LOT SYSTEMS CORPORATION
LOT® PAGER
HARDWARE + MANUFACTURING SPECIFICATION
================================================================================

DOCUMENT    LOT-PAGER-HARDWARE-SPEC
ISSUE DATE  2026.07.02
CLASS       INTERNAL / BUILD
STYLE       TERMINAL GRID
PAIRS WITH  LOT-PAGER-VISION.md · LOT-PAGER-BOM.md · LOT-PAGER-FIRMWARE.md

================================================================================

## 00  PRINCIPLE — WHAT THIS DEVICE ACTUALLY DOES

One job: receive a short text notification from lot-systems.com and display it.
One reply: a single button that sends a signal back to the operator's Log tab.
Everything else — camera, weather sensor, wireless charging — is secondary
payload riding on that core loop. If the core loop is not rock solid (wakes
fast, shows text, sleeps, survives a week on one charge), the rest doesn't
matter. Build order in Section 05 reflects this.

    ONE LINE OF TEXT    ONE BUTTON    ONE WEEK OF BATTERY    SEALED STEEL SHELL

================================================================================

## 01  MECHANICAL — THE SHELL

### FORM FACTOR

    OVERALL          40mm x 40mm x 5mm core module (PCB + battery + Qi coil)
    ENCLOSURE         2-piece stainless steel shell, ~2mm wall, ~44mm x 44mm
                      x 8mm assembled (shell adds ~1.5mm/side + gasket)
    MATERIAL          304 stainless (prototype/EVT) -> 316L (production, better
                      corrosion resistance for pocket/skin contact)
    MASS              ~55-70g assembled (steel-dominant, deliberate — a pager
                      should feel like an object, not a toy)

### TWO-PART CONSTRUCTION

```
FRONT HALF (working face)              BACK HALF (signature face)
┌────────────────────────┐             ┌────────────────────────┐
│  ○  <- camera lens cut  │             │                        │
│  ▭▭▭▭▭▭  <- display     │  <—clam—>   │   mirror-polished      │
│   window                │   shell     │   316L stainless        │
│         (●) <- button   │             │   no visible features   │
└────────────────────────┘             └────────────────────────┘
  bead-blasted / brushed                 electropolished
  finish around cutouts                  Qi charging passes through
```

FRONT HALF — camera aperture (sapphire or hardened acrylic window, ~4mm dia),
display window (chemically-strengthened glass, matched to display active
area), button bore for a sealed tactile switch or capacitive pad.

BACK HALF — no cutouts. Fully polished. Qi charging works through stainless
at this thickness (Qi is inductive, not magnetic-latch; stainless is a poor
eddy-current absorber at the frequencies Qi uses if walls stay under ~1mm in
the coil area — spec a milled recess under the coil to thin the wall locally,
see Section 02).

SEAL — compressed silicone gasket at the parting line, 2x M1.6 security
screws (or adhesive-bond for the sealed pilot run — screws add rework
flexibility during EVT/DVT, switch to structural adhesive for production if
100-unit cost model favors it, see `LOT-PAGER-BOM.md`).

### PCBWAY — ENCLOSURE MANUFACTURING PATH

    PROCESS         CNC milling from bar stock (not sheet metal — the polished
                    back face and lens/display cutouts need machined
                    tolerance, not stamping)
    FINISH          Back: mirror electropolish. Front: bead-blast + PVD or
                    passivation around cutouts.
    QUANTITY BREAKS Prototype: 5-10 units (design validation)
                    EVT: 10-25 units (fit/function on real PCB)
                    Pilot run: 100 units (this spec's target)
    LEAD TIME       CNC stainless typically 7-15 business days per PCBWay's
                    stated CNC machining turnaround for small-batch metal
                    parts; confirm current quote/turnaround directly at
                    PCBWay's CNC machining service page before committing —
                    see `LOT-PAGER-BOM.md` Section 07 for the verified link.

================================================================================

## 02  ELECTRONICS — BLOCK DIAGRAM

```
                         ┌───────────────────────────┐
                         │   MCU / SoC (WiFi + BLE)   │
                         │   e.g. ESP32-S3 class      │
                         └─────┬───────┬───────┬──────┘
                               │       │       │
              ┌────────────────┘       │       └────────────────┐
              ▼                        ▼                        ▼
    ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
    │  Low-power display  │   │  Camera module     │   │  Env sensor (I2C)  │
    │  (e-paper or         │   │  (OV2640-class,    │   │  temp/humidity/    │
    │  low-power OLED)     │   │  QVGA, off by      │   │  pressure/AQ       │
    │  short text only     │   │  default)          │   │  (BME680-class)    │
    └───────────────────┘   └───────────────────┘   └───────────────────┘
              │
              ▼
    ┌───────────────────┐        ┌───────────────────┐
    │  Tactile "Copy"     │        │  Qi RX coil + PMIC  │
    │  button (GPIO int) │        │  + LiPo 150-300mAh  │
    └───────────────────┘        └───────────────────┘
```

### WHY THESE CHOICES

**MCU** — needs WiFi (to talk to lot-systems.com directly or via a phone-relay
BLE bridge) and BLE (for provisioning + optional phone relay to save power).
An ESP32-S3-class part covers both, has deep-sleep current low enough for
week-scale battery life between notification wakes, and has a large enough
hobbyist/production ecosystem that a 100-unit run isn't fighting allocation.

**Display** — the interaction is "show one line, then go dark." An e-paper
panel holds the last message with zero power draw once written (ideal for a
device that's asleep 99% of the time); a low-power reflective/transflective
LCD or OLED is the fallback if refresh latency on e-paper (seconds) reads as
too slow for a "pager" feel. Prototype both; pick in EVT based on felt
latency, not spec sheet.

**Camera** — QVGA/2MP class is enough for a presence snapshot, not a security
camera. Physically gated: camera power rail is switched by MCU GPIO and off
by default; firmware never streams — it captures a single frame on explicit
operator action only (see `LOT-PAGER-FIRMWARE.md` Section 03).

**Env sensor** — a combined temp/humidity/pressure/gas-index part (BME680
class) is what the market ships as "AI-grade" off-the-shelf environmental
sensing — Bosch's own material calls the gas/IAQ output an on-chip inference
result, which matches item 15 of the original brief ("AI grade of-the-shelf
sensors") without requiring a custom ASIC.

**Qi + PMIC** — standard Qi receiver IC + charge controller into the LiPo.
Coil sits directly under the polished back face; the enclosure spec (Section
01) locally thins the wall under the coil to keep charging efficiency
reasonable through stainless.

**Button** — one button, does one thing: **Copy**. A sealed tactile switch
(preferred — deterministic click, works in an IP-rated bore) or a capacitive
pad behind the stainless (no bore to seal, slightly more complex firmware
debounce). Prototype with tactile; capacitive is the production upgrade path
if watertightness testing on the tactile bore underperforms.

================================================================================

## 03  POWER BUDGET (TARGET)

```
STATE                       CURRENT DRAW        DURATION/DAY   NOTES
─────                       ─────────────        ────────────   ─────
Deep sleep (radio off)       ~10-20uA            ~23h            MCU + sensor off
Sensor poll (periodic)       ~1-5mA (burst)       ~seconds/hr     env sensor wake
WiFi notification receive    ~80-150mA (burst)    <5s x N/day     N = notification count
Display update                one-shot, low        per message      e-paper near-zero hold
Camera capture (rare, opt-in) ~100-200mA burst     seconds, opt-in  operator-triggered only

TARGET BATTERY LIFE:  5-7 days on a 200mAh cell at ~10 notifications/day,
                       assuming WiFi join is fast (cached credentials, no
                       full DHCP/TLS handshake per wake — see FIRMWARE doc
                       Section 02 for the session-resume design that makes
                       this budget realistic).
```

Battery life is the single biggest schedule risk in this spec. If WiFi
join-per-notification proves too power-hungry in EVT testing, the fallback is
a BLE-only device that relays through a phone app (companion software, see
`LOT-PAGER-SOFTWARE-CONNECTOR.md`) — same UX, lower device power draw, added
dependency on the phone being nearby. Decide at EVT, not before; don't
over-engineer the fallback until real current-draw numbers exist.

================================================================================

## 04  IP RATING & CONSENT MODEL

    TARGET RATING    IP54 (dust + splash) minimum for a pocketed/desk object;
                      IP67 is a stretch goal if gasket + button-bore sealing
                      validate cleanly in DVT — not required for pilot run.

    CAMERA CONSENT    Hardware: camera power rail physically switchable by
                      MCU, LED indicator lights whenever the rail is live.
                      Firmware: no autonomous capture, no streaming — single
                      frame on explicit local button-hold gesture, image
                      stays on-device until operator opts to attach it to a
                      Log entry via the companion app.

================================================================================

## 05  BUILD ORDER — SEQUENCE

```
01   Breadboard the electronics: MCU dev board + display + env sensor +
     button. Validate wake/sleep/notification loop against a mock API.
02   Add camera + Qi charging to the breadboard. Validate power budget
     (Section 03) with real current-draw measurements, not datasheet math.
03   Lay out the PCB sized to the 40x40mm core envelope. Send to PCBWay for
     fab + turnkey SMT assembly (see LOT-PAGER-BOM.md Section 07).
04   3D-print a fit-check enclosure at real dimensions before cutting metal.
     Confirm lens, display window, and button bore alignment.
05   CNC the first stainless shell (5-10 units, EVT quantity) at PCBWay.
     Fit-check against the real PCB assembly.
06   Firmware bring-up on real hardware: sleep current, WiFi join latency,
     notification-to-display latency, button debounce, Qi charge curve.
07   Wire the software connector: LOT API notification push + Log tab
     "Copy" signal (see LOT-PAGER-SOFTWARE-CONNECTOR.md). End-to-end test:
     trigger a real notification from lot-systems.com, see it on the
     device, press Copy, confirm the Log tab entry.
08   DVT pass: 25 units, real operators, one week of pocket/desk carry.
     Revisit gasket, button bore, and battery life against Section 03
     targets with field data.
09   Lock BOM, lock enclosure tooling, place the 100-unit pilot order
     (see LOT-PAGER-ROADMAP.md for phased timeline and cost).
10   Generate the PDF quick-start manual (LOT-PAGER-MANUAL.md) from final,
     as-shipped hardware — not from the spec. Manuals written from spec
     drift the moment DVT changes anything.
```

Order matters: the software connector (step 07) happens before tooling lock
(step 09) so the 100-unit run is never committed against an unproven
notification/Copy loop.

================================================================================
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
END OF SPECIFICATION                                                2026.07.02
================================================================================
