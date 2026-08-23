<!--
  LOT SYSTEMS CORPORATION — brand.lot-systems.com
-->

# LOT COMPUTER — Plan

## 1. What it is

A single-purpose signal terminal, not a general computer. It does three
things:

1. **Receives** — one autonomous line of text from the LOT Memory Engine /
   QOS, pushed without the operator opening an app ("Coffee time!").
2. **Senses** — local weather (temp/humidity/pressure) and presence, fed
   back into the operator's QIE signal stream as ground-truth environment
   data, not an estimate from a public weather API.
3. **Signals back** — one button, COPY, writes one event to the operator's
   Log. No keyboard, no text entry. A pager, not a terminal.

It is deliberately *not*: a smart-speaker, a voice assistant, a display for
browsing the LOT app, or a always-on camera/recording device. The camera is
narrow-purpose (§ Camera, below) — it is not a webcam and does not stream.

## 2. Industrial design

Two-part 304 (or 316L, TBD on cost delta in `03-ROADMAP.md`) stainless
steel shell, CNC-machined:

- **Face A — mirror.** Polished stainless, no seams, no visible fasteners
  from this side, no electronics. Laser-etched LOT wordmark, small enough
  to disappear at a glance (Field Manual "MILITARY PURITY" standard: no
  decoration, no superlatives — applies to physical objects too, not just
  UI). This face is the object's default state on a desk: closed, quiet,
  a mirror or a paperweight until it has something to say.
- **Face B — instrument.** Bead-blasted or matte stainless, holds (clockwise
  from top): camera aperture, round display, weather/presence sensor grille,
  COPY button. Screen is off (e-paper) or blank (OLED) until a notification
  arrives — no clock, no idle screen, no chrome.

The two shells close around an internal rigid-flex PCB stack and battery,
sealed with a compressed silicone gasket (IP54 target — desk object, not
submersible) and closed with 4 countersunk M1.6 stainless screws accessible
only from Face B's edge, so Face A stays seamless.

### Form factor — target vs. buildable

Spec point 4 calls for **4×4cm × 5mm** — a flat silver square. Taken
literally, 5mm is thinner than a single 2MP camera module (2.5–3.5mm) stacked
on a rigid PCB (1.0–1.6mm) stacked on a display module (1.5–4mm) stacked on
any battery thick enough to run a Wi-Fi radio for a day. There is no COTS
path to 5mm total Z-height with a camera, a screen, wireless charging, and a
battery inside stainless steel walls. Two honest options, both scoped in
this package:

- **Rev-A (buildable, this plan):** 42×42×11mm. Keeps the flat-square
  silhouette and the "coin on a desk" read from arm's length; the 6mm of
  extra height is invisible in normal use and is where the battery, coil,
  and camera stack actually live. This is the version quoted in
  `02-BOM.md` and `03-ROADMAP.md`.
- **Rev-B (aspirational, v2):** true 5mm requires dropping the onboard
  battery (device runs only while docked / on wireless power, no untethered
  operation), a chip-on-flex camera (no lens stack, fixed-focus pinhole,
  materially worse image quality), and a flexible e-paper laminate instead
  of a rigid display module. Feasible as a second-generation "always-docked"
  variant; not attempted in the 100-unit pilot run.

Recommendation: build Rev-A for the pilot, keep Rev-B as the named target so
the roadmap has a real next step instead of the spec being silently dropped.

## 3. Camera

Fixed 2MP module behind a small aperture on Face B. Scope, deliberately
narrow:

- **Setup / pairing** — scans a QR code shown in the operator's LOT web
  session to bind the device to an account (`05-SOFTWARE.md` §Pairing).
- **Presence gate** — low-res, low-frame-rate motion/presence check to wake
  the display from deep sleep only when someone is in front of it, instead
  of polling the network on a fixed timer (see `04-FIRMWARE.md` §Power).
- **Optional Visual Log capture** — a long-press (not the COPY tap) can
  capture and upload a single still to the operator's Memory Engine as a
  new log event type, parallel to Journal/Memory but visual. Off by
  default; the operator opts in per-device in Settings. No local storage of
  captured frames beyond the single upload buffer, no video, no continuous
  capture. This is called out explicitly because a camera on a self-care
  device that quietly does more than the operator expects is exactly the
  kind of trust break `docs/README.md` "Privacy First" promises against.

## 4. Weather + presence sensors

BME280-class sensor for temperature / humidity / pressure — see `02-BOM.md`
§Sensors. This closes a gap that already exists in the product: the public
profile system (`README.md` §Public Profile) shows Weather sourced from a
geocoded public API — city-level, not room-level. LOT COMPUTER supplies the
operator's actual desk environment as a QOS input (Biofield Capacity has no
current environmental term). Presence sensing (§ Camera, above, plus an
optional PIR/mmWave module — see BOM) gates both the display wake and the
notification poll cadence.

## 5. COPY button → Log tab

One button, one action, no modes. Press → device writes a `hw_copy_signal`
event through the existing Log pipeline (`src/server/models/log.ts`,
rendered by `useLogs()` in `System.tsx`). Body is COCKPIT-RULE: instrument
readings, not narration — e.g.

```
DEVICE: LOT-COMPUTER-0042  SIGNAL: COPY  BATT: 81%  TEMP: 21.4C  RH: 38%
```

No text entry on the device — "Copy" means "log that I saw this, right
now," the same gesture as a physical pager's ACK button. The label is
literal: it is not a clipboard-copy, it is copying the moment into the
record.

## 6. What is explicitly out of scope for the pilot

- No microphone, no voice capture, no audio pipeline.
- No always-on video; camera fires on discrete triggers only (§ Camera).
- No local app/UI beyond the single-line display — all intelligence is
  server-side (Memory Engine / QOS), the device is a thin terminal.
- No cellular radio — Wi-Fi only, requires the operator's home network.
- Rev-B (5mm, battery-less, always-docked) is not built in the pilot.

## 7. Open risks (carried into `03-ROADMAP.md` as gate items)

1. **RF through steel.** A stainless enclosure is close to a Faraday cage
   for 2.4GHz Wi-Fi/BT. Requires either a non-metal antenna window (ceramic
   or polymer insert on one edge) or accepting reduced range. Flagged in
   `02-BOM.md` §RF and `04-FIRMWARE.md` §Radio.
2. **IP54 vs. seamless Face A.** All 4 closure screws must live on the
   Face-B edge only; DFM review with the CNC shop before tooling.
3. **Rev-A Z-height (11mm) vs. spec (5mm).** Documented above as an
   explicit deviation, not a silent miss — needs S-2 sign-off before the
   pilot BOM is locked.
