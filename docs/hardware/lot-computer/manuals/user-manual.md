# LOT Computer — User Manual

*(Concept-stage manual — written ahead of hardware, to be revised against a
real production unit before Phase 4 launch. Specs below reflect the plan in
`../01-PRODUCT-PLAN.md` and `../03-BOM.md`.)*

## What it is

LOT Computer is a small physical companion to your Memory Engine on
lot-systems.com. It has one screen, one button, and one camera. It shows you
short, context-aware nudges the same way an old pager showed a message — and
gives you exactly one way to respond: press **Copy** to save the moment to
your Log.

## What it is not

- Not a smart speaker — no microphone, no voice.
- Not a security camera — the camera only activates on an explicit long
  press, never continuously, never in the background, and its indicator LED
  is hardware-tied to the camera's power line, not software-controlled.
- Not a general notification hub — it only ever speaks for your own Memory
  Engine, not email, texts, or other apps.

## Physical description

- Flat square, approx. 40mm × 40mm, two-piece stainless steel body.
- **Back (polished):** mirror-finish stainless steel, brand mark, sits
  against the charging dock.
- **Front (brushed):** camera lens, small round display, one button.

## The screen

A low-power e-ink display. It shows either nothing (idle) or a short line of
text (an active notification). E-ink holds its image without power, so
don't worry about it "staying on" — that costs almost nothing.

## The button

- **Short press — Copy:** saves the currently displayed text (plus a
  timestamp and, if available, the room's temperature/humidity from the
  built-in sensor) into your Log tab on lot-systems.com.
- **Long press — Camera:** takes one photo and attaches it to that same Log
  entry. The shutter light confirms every capture.

## The sensor

An onboard temperature/humidity/pressure sensor gives hyper-local context
(is it actually warm in the room right now) alongside your account's city-
level weather already shown elsewhere on lot-systems.com. It only ever
travels with a Copy or Camera event — it does not report on its own schedule.

## Charging

Place the puck polished-side-down on the included wireless charging dock.
No cable to plug into the puck itself.

## Care

- Wipe the polished face with a soft cloth; avoid abrasive cleaners which
  will dull the mirror finish.
- Keep it dry — the gasket between the two halves resists dust and light
  splashes, it is not a waterproof rating.
- Do not disassemble — there are no user-serviceable parts inside.

## Privacy

- The camera cannot be triggered remotely — only the physical long-press
  on the device itself activates it.
- Everything the device sends goes to your own account's Log tab, under the
  same privacy rules as anything else you write there (see lot-systems.com's
  own privacy documentation for how your Log/Memory Story data is handled).
- You can unpair the device at any time from Settings → Devices, which
  immediately revokes its ability to write to your account.

## Troubleshooting

| Symptom | Likely cause | What to try |
|---------|--------------|-------------|
| Screen shows nothing, ever | Not paired, or battery depleted | Re-pair via Settings → Devices; place on charging dock for several hours |
| Copy press doesn't appear in Log tab | WiFi out of range, or device unpaired | Move closer to your WiFi router; check Settings → Devices shows it as connected |
| Camera LED doesn't light on long-press | Hardware fault | Contact support — the LED is hardware-tied and should not be possible to disable in software |

## Specifications (planning-stage — see `../03-BOM.md` for sourcing)

| Spec | Value |
|------|-------|
| Dimensions | ~40mm × 40mm × 5–9mm (see product plan for the height note) |
| Body material | 304 stainless steel, 2-piece |
| Display | 1.54", 200×200, e-ink |
| Camera | 2MP, fixed focus |
| Connectivity | WiFi 2.4GHz |
| Charging | Qi wireless |
| Sensors | Temperature, humidity, pressure |
