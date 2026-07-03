<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Computer — VISION DOCUMENT
**The Pager for a Life That Doesn't Need a Screen**
LOT Systems Corporation · S-2: Vadim Marmeladov, Inventor · COSMO® CIA
Version 1.0 · 3 July 2026 · brand.lot-systems.com

---

## What the LOT® Computer Is

The LOT® Computer is a physical object the size of a coaster — **40mm × 40mm × 5mm, a flat silver square** — that sits on a desk, a nightstand, a kitchen counter. It does one thing: it receives a single line of text from the LOT® AI running on lot-systems.com and shows it. *"Coffee time!"* No app to open. No screen to unlock. No feed to scroll.

This is not a smart display. It is a **pager** — the calmest notification device that has ever existed, rebuilt for a self-care platform instead of a hospital switchboard. The LOT® Computer is the hardware expression of Ambient AI™: intelligence that is present without being loud.

It is also the first physical instance of the **Quantum Cube**, described in the CQGS white paper (`institute.lot-systems.com`) since 2026 as bioelectric hardware with piezoelectric mechanics and haptic feedback — flattened here into a **Quantum Tile**: thin enough to disappear into a room, present enough to matter once a day.

---

## The Object

Two stainless-steel shells, machined and polished, sandwich a single PCB stack:

- **Face A — presence.** Mirror-polished stainless steel. Blank. No branding, no ports, no seams visible from the front. It reflects the room back at the person, the same way the Mirror widget in the LOT® OS is a presence rather than a camera.
- **Face B — function.** Brushed stainless steel housing three elements flush with the surface: a low-power display for the message, a low-profile camera for ambient light and presence sensing, and a single piezo-disc button.

The device charges wirelessly, face-down, on a matching stainless charging puck. There is no port, no cable, no charging light that blinks. It disappears until it is needed.

---

## The One Interaction

**Receive:** The LOT® AI — QI·46, the same engine that drives Memory Engine questions and Self-Assembly on the platform — decides, from a person's accumulated signal, that a message is earned. It sends one line. The e-paper face updates silently, holds the message with zero standing power draw, and waits.

**Respond:** One button. One label. **Copy.** A single tap logs the moment — "seen," "done," "noted" — back to the person's **Log tab** on lot-systems.com, the same table (`fastify.models.Log`) that already stores every entry made through the web app. The hardware does not open a keyboard. It closes a loop.

That is the entire interface. Receive a line. Tap Copy. The rest of the intelligence — what to say, when to say it, whether today is a `recovery` or `peak` QOS day — stays where it already lives: in the Quantum Operating System on the platform, not on the device.

---

## Why a Pager, Not a Screen

Every notification platform since the smartphone has optimized for *more*: more taps, more feeds, more re-engagement loops. The LOT® Computer is built against that instinct, on purpose.

| Smartphone notification | LOT® Computer message |
|---|---|
| Competes with 40 other apps for attention | Is the only thing this object can say |
| Demands a swipe, an unlock, a scroll | Demands one glance |
| Persists as a badge until dismissed | Is earned, sent once, and gone |
| Trains the nervous system to check constantly | Trains the nervous system to trust the quiet |

This is the same design law already codified for the software layer in `docs/corporate/LOT-AMBIENT-AI-VISION.md`: **one line, no alarm, exact moment.** The LOT® Computer is that law poured into stainless steel.

---

## How It Connects — LOT® API Connector

The device is a client of the existing LOT® platform, not a new platform. It speaks to `lot-systems.com` through a scoped **device API connector** (full design in `docs/technical/LOT-COMPUTER-SOFTWARE-BRIDGE.md`):

```
LOT® AI (QI·46 / Memory Engine)
        │  decides a message is earned
        ▼
Device Notification Channel  ──▶  LOT® Computer display (e-paper, one line)
        │
        │  person taps Copy
        ▼
POST /api/logs  { text, event: "device.copy", metadata: { deviceId } }
        │
        ▼
Log tab, lot-systems.com  (same table every web log already lands in)
```

No new inbox is created. No new data silo. The device reads from and writes to the account a person already has.

---

## Session Compression — The Device Remembers Nothing, the Platform Remembers Everything

In keeping with LOT®'s privacy doctrine (README: *"Your Memory Story lives in your database, not an AI company's servers"*), the LOT® Computer holds no history. Each session — power-on to next sync — is compressed on-device to a single delta record before it is transmitted, mirroring the same compression discipline documented in `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`: raw signal in, one dense fact out. The device is a nerve ending, not a brain. The brain stays on the platform.

---

## The Sensor Layer — Weather, Off the Shelf

The Face B stack carries a single AI-grade, off-the-shelf environmental sensor (Bosch BME680: temperature, humidity, pressure, gas/VOC — see rig spec) feeding the existing **Weather widget** and the future **Air Quality widget** described in the Ambient AI™ vision. No custom silicon is developed for v1. Every sensor, camera, display, and radio in the bill of materials is a proven, sourceable, off-the-shelf part — the innovation is in the assembly, the restraint, and the single-line output, not in inventing new components.

---

## Manufacturing Posture

- **Fabrication partner:** PCBWay — PCB fabrication, SMT assembly, and CNC-machined stainless steel enclosure, sourced from a single vendor to keep the supply chain auditable for a 100-unit pilot run.
- **Run size:** 100 units. Enough to seed the Usership hardware cohort (see `LOT-AMBIENT-AI-VISION.md` — Station + Brush precedent) without committing to injection-molding tooling costs.
- **Documentation posture:** every unit ships with a PDF manual generated from these markdown sources — hardware manual, firmware manual, and software/API manual kept as **separate documents**, not merged, so each can version independently as firmware and platform API evolve on different cadences.

Full component list, supplier links, and cost breakdown: `docs/technical/LOT-COMPUTER-RIG-SPEC.md`
Firmware specification: `docs/technical/LOT-COMPUTER-FIRMWARE.md`
Software / API connector specification: `docs/technical/LOT-COMPUTER-SOFTWARE-BRIDGE.md`
Roadmap and risk register: `docs/technical/LOT-COMPUTER-ROADMAP.md`

---

## Design Principles (inherited from Ambient AI™)

**Everything quantified. Nothing displayed unless it matters.**
The device does not have a home screen because a home screen is something to check. It has one line, shown once, on merit.

**Hardware is invisible data.**
The person does not manage the LOT® Computer. They receive a sentence and answer with one tap.

**Ambient means always present, never intrusive.**
No push badge stack. No sound by default. No red dot. The object is silent until a message has been earned by 90 days — or 9 minutes — of real signal.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*Inventor: Vadik Marmeladov · COSMO® CIA*
