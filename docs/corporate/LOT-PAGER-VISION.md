<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT SYSTEMS — LOT® Pager: The Physical Notification Companion

**Document:** LOT-PAGER-VISION.md
**Classification:** Public — Product Vision
**Prepared:** July 2, 2026
**Inventor:** Vadim Marmeladov, Founder & CEO, LOT Systems
**Filed by:** COSMO® CIA (Concept Intake & Assembly)

---

## The Core Thesis

LOT Computer already knows when it is coffee time. It knows from streak data, from
mood check-ins, from the weather, from the pattern of a hundred prior mornings. What
it does not have is a way to say so without a phone screen between it and the person
it is talking to.

A pager solves that. Not a smartwatch, not another app icon — a small, cold, honest
piece of stainless steel that lights up with one line of text when the system has
something worth interrupting you for, and goes dark again. The interruption is the
product. Everything else is plumbing.

This is not LOT Systems' first hardware. Vadim Marmeladov built Lapka — radiation,
humidity, and temperature sensors housed in soft-touch industrial design — before
Airbnb acquired it in 2015. LOT® Pager is the same instinct, ten years later, aimed
at a different sensor: the human being, as measured by the Memory Engine and the
Quantum Intent Engine, not by a Geiger tube.

---

## What LOT® Pager Is

A flat, two-piece stainless steel object, roughly the size of a large coin —
**40mm × 40mm × 5mm** at the core module, sealed inside a **two-part 304/316L
stainless steel shell**:

| Face | Surface | Function |
|------|---------|----------|
| Front | Brushed / camera-cut | Camera lens, low-power display window, single button |
| Back | Fully polished mirror stainless | No electronics visible — a clean signature object |

It does three things:

1. **Receives.** A short line of text, pushed from lot-systems.com, appears on the
   display — *"Coffee time!"*, *"Streak day 12 — log before midnight"*, *"Air
   quality: Good — open a window"*. No app to open. No feed to scroll. One line,
   then the screen sleeps.
2. **Senses.** An onboard weather/environmental sensor (temperature, humidity,
   pressure, air quality) feeds the same M2M data-intake pipeline that LOT®
   Station already defines — LOT® Pager can act as the pocket-sized version of the
   Station for operators who want ambient sensing without a desk unit.
3. **Answers back.** One button, labeled **Copy**. Press it, and a signal is sent
   directly to the operator's **Log tab** on lot-systems.com — an acknowledgment,
   a "received," a single log line with no typing required. This is the entire
   interaction model: the system speaks, the operator copies.

The camera is not a surveillance feature. It is a low-resolution, operator-owned
capture used for optional presence/context snapshots tied to a log entry — off by
default, entirely local until the operator chooses to attach an image to a Log
entry. See `LOT-PAGER-HARDWARE-SPEC.md` for the privacy/consent model.

Power: a small internal LiPo cell, topped up via **Qi wireless charging** through
the polished stainless back — no port, no door, nothing to corrode.

---

## Why Stainless Steel, Why This Shape

LOT Systems' physical product line so far has favored consumables and soft goods
(the Usership kit, LOT® Brush) or desk hardware (LOT® Station, the NODE-0 AI
server rig). LOT® Pager is the first **wearable-adjacent, pocketable** object in
the catalog, and the material choice is deliberate:

- **Stainless steel, not plastic.** A device meant to sit on a desk or in a pocket
  for years needs to feel like a tool, not a gadget that ages out. The Quantum
  Cube concept (see `CQGS-WHITE-PAPER-SNAPSHOT.md`) already established
  nano-ceramic/piezoelectric bioelectric hardware as part of the LOT physical
  language; stainless steel is the more manufacturable, more durable sibling of
  that instinct.
- **Two-part construction.** A CNC-milled shell (polished back + machined front)
  clamshells around the PCB, battery, and Qi coil, gasket-sealed. Two parts keep
  tooling cost and assembly time low for a 100-unit pilot run (see
  `LOT-PAGER-ROADMAP.md`).
- **One flat square core.** The 40×40×5mm dimension is sized to the largest
  component on the board — the display — plus battery thickness. It is small
  enough to sit face-up on a desk, in a pocket, or clipped to a lanyard.

---

## How It Fits the LOT Hardware Family

| Product | Status | Role |
|---|---|---|
| LOT® Station | Vision (Ambient AI™, ships with Usership kit) | Desk weather/air-quality sensor |
| LOT® Brush | Vision (Ambient AI™, ships with Usership kit) | Connected toothbrush — self-care signal |
| Quantum Cube | Vision (CQGS white paper) | Bioelectric haptic feedback, nano-ceramic |
| **LOT® Pager** | **This document — pilot spec** | **Pocket notification + ambient sensing + Log-tab signal** |
| COSMO® (robot) | Vision (Robotics division) | Full companion robotics, Benchmark-gated (Purple+) |

LOT® Pager is the smallest, cheapest, and fastest of these to build. It requires
no soul-transfer gate, no Benchmark tier — it is available to any operator with a
LOT profile, the same way LOT® Station and LOT® Brush are scoped. It is also the
most direct proof point that "AI-powered site → physical world" works before the
company invests further in Quantum Cube or COSMO® hardware.

---

## The Interaction Loop

```
lot-systems.com (Memory Engine / QIE / OS API)
        │
        │  notification: "Coffee time!"
        ▼
LOT® Pager display (wakes, shows text, sleeps after N seconds)
        │
        │  operator presses [Copy]
        ▼
Signal → Log tab (lot-systems.com/logs)
        │
        │  entry recorded: "Copied: Coffee time! — via LOT® Pager"
        ▼
Memory Engine / QIE ingest the acknowledgment as a signal
(did the operator see it, when, how fast — feeds consistency scoring)
```

This closes a loop that today only exists inside the browser tab: notice → act →
record. LOT® Pager takes the first and last steps out of the phone.

---

## Document Set

This vision is supported by four technical documents, kept separate per LOT
documentation convention (one concern per file):

| Document | Covers |
|---|---|
| `docs/technical/LOT-PAGER-HARDWARE-SPEC.md` | Mechanical + electronics spec, PCBWay manufacturing plan |
| `docs/technical/LOT-PAGER-BOM.md` | Components buying list, suppliers, 100-unit run costing |
| `docs/technical/LOT-PAGER-FIRMWARE.md` | Firmware architecture, sleep/wake, session compression, OTA |
| `docs/technical/LOT-PAGER-SOFTWARE-CONNECTOR.md` | LOT API / M2M integration, Log tab wiring, companion app |
| `docs/technical/LOT-PAGER-ROADMAP.md` | Phased build plan from breadboard to 100-unit pilot run |
| `docs/technical/LOT-PAGER-MANUAL.md` + PDF | Operator-facing quick-start manual |

---

## Sourcing Note

`lot-systems.com/about`, `brand.lot-systems.com`, and
`institute.lot-systems.com/cqgs.html` were consulted for brand and philosophy
continuity while drafting this set; the live pages returned HTTP 403 to
automated fetch during this session (bot protection), so this document draws on
the repository's existing snapshots of those sources
(`docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md`, `LOT_ROBOTICS_COSMO.md`,
`LOT-AMBIENT-AI-VISION.md`, `LOT-TERMINAL-VISION.md`, `LOT-TERMINAL-M2M.md`) and
public search results confirming Vadim Marmeladov's Lapka hardware history. A
human pass against the live pages is recommended before external publication of
this vision doc.

---

*Invented by Vadim Marmeladov. Built for the moment the system needs to say one
true thing without asking for a phone unlock first.*

*LOT Systems, Inc. — Los Angeles, CA.*
