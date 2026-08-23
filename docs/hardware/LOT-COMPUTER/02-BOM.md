<!--
  LOT SYSTEMS CORPORATION — brand.lot-systems.com
-->

# LOT COMPUTER — Bill of Materials (Rev-A, 42×42×11mm)

Pricing is order-of-magnitude at 100-unit quantity (2026 spot pricing,
verify against a live PCBWay/Digi-Key/Mouser/LCSC quote before ordering —
component pricing moves weekly and none of this is a firm quote). Every
part below is a real, currently-shipping COTS part — no custom silicon.
Links go to distributor search, not a specific SKU page, since exact
listings and stock rotate; search the MPN on arrival.

## Compute / radio

| Part | MPN | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| SoC module | Espressif **ESP32-S3-WROOM-1-N8R2** | MCU + Wi-Fi/BT, camera DVP interface, 8MB flash/2MB PSRAM | ~$3.20 | [digikey.com](https://www.digikey.com/en/products/result?keywords=ESP32-S3-WROOM-1-N8R2) · [mouser.com](https://www.mouser.com/c/?q=ESP32-S3-WROOM-1-N8R2) |
| Antenna | Ceramic chip antenna, 2.4GHz, e.g. Johanson **2450AT18B100** | External antenna fed through a non-metal window (§RF below) | ~$0.30 | [digikey.com](https://www.digikey.com/en/products/result?keywords=2450AT18B100) |

## Optics

| Part | MPN | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| Camera module | OmniVision **OV2640** (DVP, fixed-focus) 2MP | Setup QR scan, presence gate, optional Visual Log | ~$2.50 | [lcsc.com](https://www.lcsc.com/search?q=OV2640) · [seeedstudio.com](https://www.seeedstudio.com) |

## Display

| Part | MPN | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| Round display | Good Display **GDEY0154D67** 1.54" e-paper, 200×200, or **Waveshare 1.28" round LCD (GC9A01 driver)** | Pager-line display; e-paper preferred for zero idle power (screen is blank between pushes, not lit) | $4–7 | [good-display.com](https://www.good-display.com) · [waveshare.com](https://www.waveshare.com) |

Decision deferred to `04-FIRMWARE.md` §Display driver: e-paper wins on power
(matches "screen off until it has something to say," `01-PLAN.md` §2) but
has a ~1–2s refresh, which reads as *deliberate* for a pager and would read
as *broken* for anything interactive — acceptable here since the device has
no interactive UI.

## Sensors

| Part | MPN | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| Environment | Bosch **BME280** (I2C, LGA) | Temperature / humidity / pressure — feeds QOS as ground-truth desk environment | ~$1.90 | [digikey.com](https://www.digikey.com/en/products/result?keywords=BME280) · [mouser.com](https://www.mouser.com/c/?q=BME280) |
| Presence (option A) | HiLink **LD2410** 24GHz mmWave presence | Wake gate for display/notification poll — works through the sensor grille, does not need line-of-sight like PIR | ~$3.50 | [lcsc.com](https://www.lcsc.com/search?q=LD2410) |
| Presence (option B, cheaper) | PIR **HC-SR505** mini | Same role, lower cost, needs an IR-transparent window in the grille | ~$0.80 | [lcsc.com](https://www.lcsc.com/search?q=HC-SR505) |

Recommendation: LD2410 for the pilot — mmWave tolerates the sensor grille
being the same bead-blasted stainless as the rest of Face B (no separate
IR-clear window to source/seal), simplifying the CNC/gasket design.

## Input

| Part | MPN | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| COPY button | SMD tactile switch, e.g. **Omron B3U-1000P**, under a machined stainless cap laser-etched "COPY" | Single input, writes `hw_copy_signal` | ~$0.40 (switch) + CNC cap cost (§Enclosure) | [digikey.com](https://www.digikey.com/en/products/result?keywords=B3U-1000P) |

## Power

| Part | MPN | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| Battery | LiPo 3.7V 400mAh, e.g. **PKCELL LP502035** | ~1 day untethered runtime with e-paper + Wi-Fi duty-cycled (§Power in `04-FIRMWARE.md`) | ~$2.20 | [lcsc.com](https://www.lcsc.com/search?q=PKCELL+LP502035) |
| Qi receiver IC | TI **BQ51013B** | Wireless charge receiver, drives battery charge management | ~$2.80 | [mouser.com](https://www.mouser.com/c/?q=BQ51013B) |
| Receiver coil | Würth **760308102209** (Qi Rx coil, WPC-compliant) | Paired with BQ51013B | ~$1.10 | [mouser.com](https://www.mouser.com/c/?q=760308102209) |
| Charging dock (transmitter) | Qi transmitter reference design around TI **BQ500511A**, or a rebadged off-the-shelf 5W Qi puck for v1 bring-up | Matching stainless charging puck, item 19/12 of spec | $6–10 (custom) / $8–12 (rebadged COTS puck for prototyping) | [ti.com](https://www.ti.com) |

Prototyping shortcut: bring up Rev-A on a stock third-party Qi charging pad
first: prove the receiver-side design before committing to a custom
stainless transmitter puck for the 100-unit run.

## Enclosure

| Part | Spec | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| Face A (mirror) | 304 or 316L stainless, 42×42mm, CNC + mirror polish, laser-etched LOT wordmark | Sealed face, no electronics | Quote via PCBWay CNC | [pcbway.com](https://www.pcbway.com) |
| Face B (instrument) | 304 or 316L stainless, 42×42mm, CNC + bead-blast, 4× machined apertures (camera, display, sensor grille, button) | Electronics face | Quote via PCBWay CNC | [pcbway.com](https://www.pcbway.com) |
| Gasket | Compressed silicone, custom-cut to Face A/B perimeter | IP54 seal | Quote via PCBWay or a gasket house | — |
| Closure screws | 4× M1.6 stainless countersunk | Face-B-only closure (§Industrial design) | ~$0.05 ea | [mcmaster.com](https://www.mcmaster.com) |

Enclosure unit cost at 100pcs cannot be estimated without a PCBWay CNC quote
(machining time, polish pass, and etch are the real cost drivers, not
material) — this is the first quote to request in `03-ROADMAP.md`.

## PCB

| Part | Spec | Role | Est. unit @100pcs | Source |
|---|---|---|---|---|
| Rigid-flex PCB | 4-layer rigid + 1 flex section (bends the board around the battery/coil stack to hit 11mm Z-height) | Carries MCU, sensors, power | Quote via PCBWay | [pcbway.com](https://www.pcbway.com) |
| PCBA (assembly) | SMT assembly of above, 100 units | Turnkey — PCBWay sources & places all SMD parts from this BOM except the camera/display modules (through-connector) | Quote via PCBWay | [pcbway.com](https://www.pcbway.com) |

## RF — flagged risk (see `01-PLAN.md` §7.1)

Stainless steel on 5 of 6 enclosure faces attenuates 2.4GHz badly. The
antenna (Johanson 2450AT18B100 above) must sit behind a non-metal insert —
recommend a small machined pocket on one edge of Face B, filled with a
PTFE or glass-filled nylon plug, RF-transparent, flush-fit. This must be
in the CNC drawing before the first Face-B tooling pass — retrofitting an
antenna window after tooling is cut means re-cutting tooling.

## Rough unit cost roll-up (100-unit run, electronics + PCBA only)

```
Compute/radio     ~$3.50
Optics            ~$2.50
Display           ~$5.50
Sensors           ~$5.40
Input             ~$0.40
Power (device)    ~$6.10
PCBA turnkey       TBD — PCBWay quote
------------------------------
Electronics subtotal, ex-enclosure   ~$23/unit + PCBA labor
Enclosure (2× CNC stainless + gasket + screws)   TBD — PCBWay CNC quote, likely the dominant cost line
```

Full unit economics land in `03-ROADMAP.md` §Pilot run cost once both
PCBWay quotes (PCBA + CNC) are in hand — this BOM is the input to those
quote requests, not a substitute for them.
