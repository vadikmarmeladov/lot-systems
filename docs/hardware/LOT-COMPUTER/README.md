<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT COMPUTER — Hardware Program

Physical companion device for lot-systems.com. Not a general-purpose computer —
a single-purpose signal terminal: it receives autonomous notifications from the
Memory Engine / QOS ("Coffee time!"), reads the operator's local environment
(weather, presence), and lets the operator push one signal back to the site
with a single button ("Copy" → Log tab).

INTAKE: 19-point spec from S-2 (Vadik Marmeladov), 2026-08-23 scheduled session.
CLASS: HARDWARE / PRODUCT
STATUS: PLAN — no board spun, no tooling cut. This package is the artifact a
contract manufacturer, firmware engineer, and PCBWay quote request are built from.

## Documents

| File | Contents |
|---|---|
| [`01-PLAN.md`](./01-PLAN.md) | Concept, industrial design, the 19-point spec mapped to decisions, open risks |
| [`02-BOM.md`](./02-BOM.md) | Component buying list — parts, suppliers, links, unit cost at 100pcs |
| [`03-ROADMAP.md`](./03-ROADMAP.md) | Phase plan, PCBWay engagement, 100-unit pilot run timeline & cost |
| [`04-FIRMWARE.md`](./04-FIRMWARE.md) | Firmware architecture — MCU, drivers, power states, OTA |
| [`05-SOFTWARE.md`](./05-SOFTWARE.md) | LOT API connector spec — how firmware talks to lot-systems.com |
| [`06-MANUAL.md`](./06-MANUAL.md) | End-user manual source (exported to `06-MANUAL.pdf`) |

Each document stands alone per spec point 11 ("separate documents"). This
README is the index, not a summary — read the doc you need.

## One-paragraph brief

LOT COMPUTER is a 42×42×11mm two-piece 304 stainless steel tile that sits on
a desk. One face is mirror-polished stainless with no visible electronics —
a closed object. The other face carries a 1.3" round display, a 2MP camera,
a weather/presence sensor cluster, and one button labeled COPY. The device
polls or subscribes to the operator's LOT account and prints short
AI-generated lines to the screen the way a pager prints a page — no app to
open, no scroll, one line, gone when the next one arrives. Pressing COPY
writes a `hw_copy_signal` event to the same Log the web app already renders
in COCKPIT-RULE style (Block label + instrument-reading body, no prose) —
see `docs/benchmark/LOT-DOCTRINE.md` "Log Military Style". Charging is
wireless, off a matching stainless puck. First run is 100 units through
PCBWay for both PCB fab/assembly and CNC steel enclosure.

## Traceability — spec point → document

```
 1  PCB Way                          -> 03-ROADMAP.md  §Manufacturing partner
 2  Pager-like AI notification       -> 04-FIRMWARE.md §Notification pipeline · 05-SOFTWARE.md §GET /api/hw/notifications
 3  2-part stainless steel body      -> 01-PLAN.md §Industrial design
 4  Flat silver square 4x4cm x 5mm   -> 01-PLAN.md §Form factor — target vs Rev-A buildable
 5  Camera                           -> 02-BOM.md §Optics · 04-FIRMWARE.md §Camera driver
 6  LOT API connector                -> 05-SOFTWARE.md (full spec)
 7  Result in PDF manuals            -> 06-MANUAL.md + 06-MANUAL.pdf
 8  Compress info each session       -> docs/LOT-SR-20260823-01.md (this session's report)
 9  Firmware documents                -> 04-FIRMWARE.md
10  Software to connect w/ firmware  -> 05-SOFTWARE.md
11  Separate documents                -> this file structure
12  Charger                           -> 02-BOM.md §Power · wireless, see also §19
13  100 units run                     -> 03-ROADMAP.md §Pilot run: 100 units
14  Weather sensor                    -> 02-BOM.md §Sensors (BME280)
15  AI-grade off-the-shelf sensors   -> 02-BOM.md §Sensors
16  COPY button -> Log tab signal    -> 04-FIRMWARE.md §Button handler · 05-SOFTWARE.md §POST /api/hw/log
17  Polished stainless face           -> 01-PLAN.md §Industrial design
18  Camera+screen+button face        -> 01-PLAN.md §Industrial design
19  Wireless charging                 -> 02-BOM.md §Power
```
