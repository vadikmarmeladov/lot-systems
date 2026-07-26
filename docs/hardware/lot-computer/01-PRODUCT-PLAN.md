<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Product Plan

## §0. Concept

LOT's software product is the Memory Engine: an AI that remembers a person's
self-care story and occasionally says the exactly-right thing at the exactly-right
moment ("Since you prefer tea, how do you usually prepare it?"). Today that
voice only exists inside a browser tab. **LOT Computer** takes it out of the
tab: a small object that sits in physical space, says one thing at a time, and
gives the person exactly one gesture back — a copy button that writes the
moment into their Log.

It is deliberately not a smart-home hub, not a smart speaker, not a wearable.
It has one screen, one button, one camera, and one job: be the pager for a
person's own life.

## §1. Industrial design

**Form factor:** a flat silver square, **40mm × 40mm × 5mm** (the "puck").
Two-piece **stainless steel** shell, precision CNC machined (see
`06-MANUFACTURING.md`).

| Side | Finish | Contents |
|------|--------|----------|
| **A — Back** | Polished (mirror) stainless steel | Brand mark (LOT / COSMO® etched), Qi charging contact patch, rubber isolation feet |
| **B — Front** | Brushed stainless steel bezel around a cutout | Camera lens, e-ink screen window, one tactile button ("Copy") |

**Reality check on the 5mm target.** 5mm total height is an aggressive
industrial-design goal — for reference, an Apple AirTag is 8mm thick and
carries no camera or screen. A stack of: PCB + MCU + camera module + display +
LiPo cell + Qi receiver coil realistically needs **8–9mm** with today's
off-the-shelf parts (the thinnest common flat LiPo cells run 2.5–3mm alone;
the display + camera module stack another 3–4mm). Two ways forward, both kept
in the roadmap:

1. **v0.1 / EVT prototype** — build at true thickness (~9mm) to prove the
   electronics and firmware; treat 5mm as the finish-line spec, not the
   starting spec.
2. **v1.0 / production target** — hit 5mm by moving to a rigid-flex PCB,
   stacking the battery *beside* rather than *under* the camera/display module,
   and using a slimmer 1.2mm-cell or supercapacitor-assisted power stage
   (flagged as an open R&D item in `02-ROADMAP.md`).

Vadik's 5mm spec is the design target the whole plan is built toward; it is
called out here so Phase 0→1 doesn't quietly slip it without anyone noticing.

## §2. The 19-point brief, mapped to decisions

| # | Brief item | Decision |
|---|-----------|----------|
| 1 | PCB Way | Manufacturing partner for PCB fab+assembly *and* CNC stainless steel body — one vendor, two service lines. See `06-MANUFACTURING.md`. |
| 2 | Pager-like AI notification | Server pushes short text (≤ 40 chars) generated from the existing `contextual-prompts` / Memory Engine pattern analysis; device renders it on the e-ink screen exactly like a 1990s pager: text appears, stays until dismissed or replaced. |
| 3 | 2-part stainless steel body | Top (Side B, front) + bottom (Side A, back), joined by 4 flush hex screws + silicone gasket. |
| 4 | Flat silver square 4×4cm × 5mm | See §1 reality check. |
| 5 | Camera | Low-power OV2640 (2MP) for on-demand still capture tied to a Log entry — not continuous recording. Shutter LED mandatory (privacy, see `manuals/user-manual.md`). |
| 6 | LOT API connector | Device firmware authenticates as a **device**, not a browser session, against a new token-scoped surface on the existing API. See `05-SOFTWARE-API-CONNECTOR.md`. |
| 7 | Result in PDF manuals | Quick-start, user manual, and assembly manual authored in Markdown, rendered to PDF — see `manuals/`. |
| 8 | Compress the information in each session | Each firmware/software work session ends by folding new decisions into the connector doc's running log and a session report, mirroring the existing `docs/wiki` compression convention already used for the software product. |
| 9 | Firmware documents | `04-FIRMWARE.md`. |
| 10 | Software to connect with firmware | `05-SOFTWARE-API-CONNECTOR.md`. |
| 11 | Separate documents | Enforced by this directory's file layout — plan, roadmap, BOM, firmware, software, manufacturing, and manuals are six distinct files, not one mega-doc. |
| 12 | Charger | Qi wireless charging **dock accessory** (transmitter side), sold/bundled separately from the puck itself. |
| 13 | 100 units run | Pilot production run sized at 100 units after EVT/DVT prototypes clear QA. See `02-ROADMAP.md` Phase 4 and `06-MANUFACTURING.md`. |
| 14 | Weather sensor | Bosch BME280 (temp/humidity/pressure) on-board. Note: the LOT backend *already* serves live weather per-account via `GET /api/weather` (confirmed in `src/server/routes/api.ts`) — the on-device sensor is for **hyper-local ambient context** (is it actually warm in this room right now), complementary to, not a replacement for, the city-level API weather. |
| 15 | AI-grade off-the-shelf sensors | See `03-BOM.md` "Sensor grade notes" — components chosen for calibrated accuracy and clean signal (BME280, ambient light, low-noise MEMS mic as a stretch item), not hobbyist-grade unclamped parts. |
| 16 | "Copy" button signal to Log tab | Single press → `POST /api/logs` with `event: "device_copy"`, capturing whatever notification text was on screen at press time. This endpoint **already exists** — no server change required for the basic flow (see `05-SOFTWARE-API-CONNECTOR.md §3`). |
| 17 | One side polished stainless steel | Side A (back). |
| 18 | Other side: camera, screen, button | Side B (front). |
| 19 | Wireless charging | Qi receiver embedded in Side A; charges from the dock in §12. |

## §3. Interaction model

1. **Idle.** Screen is blank/asleep. Device sits on desk, sipping µA-level
   power in deep sleep, waking briefly on a schedule to poll for a push.
2. **Notify.** A short text lands ("Coffee time!"). E-ink screen wakes,
   renders it, stays lit (e-ink holds an image with ~0 power once drawn).
3. **Copy.** Person presses the button. The exact text + timestamp + whatever
   on-device sensor context (temp/humidity/light) is available is written to
   their Log tab on lot-systems.com, appearing there within the same request
   round-trip.
4. **Camera (optional, explicit).** A long-press (not the same gesture as
   Copy) wakes the camera for a single still, attached to the same Log entry.
   Never continuous, never background — a hardware-visible LED confirms every
   capture.
5. **Charging.** Placed back-down on the Qi dock; screen shows a small
   charge glyph if awake, otherwise stays asleep and simply charges.

## §4. Non-goals for v1

- No microphone / voice assistant (revisit only as a clearly-labeled v2 sensor
  upgrade, not silently bundled in).
- No always-on camera or continuous photo capture.
- No third-party notification sources — v1 speaks only for the LOT Memory
  Engine / QOS, not a general pager.
- No mobile app requirement for pairing — pairing happens through the existing
  lot-systems.com Settings page (a QR/short-code flow), not a new app.
