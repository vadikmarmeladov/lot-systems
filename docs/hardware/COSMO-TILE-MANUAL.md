<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® TILE (CT-1)
## Operator Manual — v0 Pilot Build

---

**LOT Systems Corporation**
Made in the USA · brand.lot-systems.com

---

## What CT-1 Is

COSMO® TILE is a small physical companion for your LOT account. It sits
on your desk, charges wirelessly, and shows you exactly one message at a
time — the way a pager does, not the way a phone does. When LOT's AI has
something worth telling you, the screen lights up with a single short
line. Press **COPY** to acknowledge it; the moment is saved to your Log
tab at lot-systems.com automatically.

CT-1 does not run apps, does not stream video, and does not notify you
about anything except what your own LOT Index of Systems decides is
worth a line of text.

---

## In the Box

- 1× COSMO® TILE (CT-1) — polished stainless steel top, matte stainless
  steel underside
- 1× Wireless charging puck (USB-C powered; cable included)
- 1× Quick-start card

---

## Physical Layout

```
   ┌───────────────────────┐
   │                       │   FACE A — Polished
   │      (mirror)         │   Rests here. This is the
   │                       │   side you see when the
   │                       │   Tile is charging, screen
   └───────────────────────┘   down, on its puck.


   ┌───────────────────────┐
   │  ┌───┐         ┌────┐ │   FACE B — Matte
   │  │CAM│  screen  │ COPY│ │   Camera, screen, and the
   │  └───┘         └────┘ │   COPY button live here.
   │                       │   This is the working side.
   └───────────────────────┘
```

40mm × 40mm footprint. Two-piece stainless steel body, no adhesive seams
— the shell is held together with four stainless screws so it can be
opened for service.

---

## Setup

1. Place CT-1 on the charging puck, polished face (Face A) down.
2. Plug the puck into any USB-C power source.
3. The screen (Face B) will show a short pairing code.
4. On lot-systems.com, go to **Settings → Devices → Add COSMO® TILE**
   and enter the code shown on-screen.
5. Once paired, the screen goes dark. This is normal — a dark screen
   means "nothing to tell you right now," not "something is wrong."

---

## Using CT-1

**When a message appears:** the screen shows one short line — for
example, *"Coffee time!"* or *"Memory question ready."* — with a small
timestamp in the corner.

**To acknowledge it:** press **COPY**. The screen clears, and the moment
is written to your Log tab at lot-systems.com, so you always have a
permanent record even though the Tile itself only ever shows you one
line at a time.

**If you don't press COPY:** the message will clear on its own after a
timeout, and (if still relevant) may reappear later. Nothing is lost —
your Log tab is the durable record either way.

**The camera:** CT-1's camera does not stream or record continuously. It
only activates briefly, either when you interact with the Tile directly
or when your LOT account explicitly requests a presence check. No frame
is ever stored anywhere except your own account, and never by a third
party.

**The weather reading:** CT-1 quietly reads the temperature, humidity,
and pressure at your desk and reports it back to your LOT profile,
alongside your existing location-based weather data.

---

## Care

- Wipe the polished face (Face A) with a soft cloth; avoid abrasive
  cleaners, which will dull the mirror finish.
- The matte face (Face B) is more forgiving of fingerprints by design.
- Keep CT-1 on its charging puck when not carried — it is not designed
  for long off-charger runtime (see Technical Notes).
- Do not submerge. Do not open the shell yourself; service is handled
  through LOT Systems support.

---

## Troubleshooting

| Symptom | What it means | What to do |
|---|---|---|
| Screen never lights up | No messages pending, OR device not paired | Check Settings → Devices at lot-systems.com to confirm pairing |
| Screen shows a pairing prompt again | Device was unpaired or its access was revoked | Re-pair using the code shown on-screen |
| COPY doesn't seem to do anything | Acknowledgment is queued and will sync once the Tile reconnects | No action needed — it will catch up automatically |
| Tile feels warm on the charging puck | Normal during wireless charging | No action needed |

---

## Technical Notes (for the curious)

CT-1 is intentionally a thin client — nearly all of its intelligence
lives on LOT's servers, not inside the device. This keeps the object
small, repairable, and inexpensive, and means the Tile itself never
needs to "understand" anything about your Index of Systems; it just
displays the one line it's given and reports back what you do with it.

Full engineering documentation:
- Plan & roadmap: `docs/corporate/LOT-COSMO-TILE-v1.md`
- Components list: `docs/hardware/COSMO-TILE-BOM.md`
- Firmware spec: `docs/hardware/COSMO-TILE-FIRMWARE.md`
- Software / API spec: `docs/hardware/COSMO-TILE-SOFTWARE.md`

---

## Support

support@lot-systems.com
lot-systems.com/status

---

*COSMO® TILE (CT-1) — LOT Systems Corporation*
*© 2025-2026 LOT Systems. All rights reserved.*
*This manual describes a v0 pilot build (100 units). Specifications may
change before wider production — see the roadmap in
`LOT-COSMO-TILE-v1.md` Section 12.*
