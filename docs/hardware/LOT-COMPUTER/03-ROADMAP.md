<!--
  LOT SYSTEMS CORPORATION — brand.lot-systems.com
-->

# LOT COMPUTER — Roadmap

## Manufacturing partner

**PCBWay** (pcbway.com) covers three of the four services this device
needs from one vendor: PCB fabrication, PCBA (turnkey SMT assembly), and
CNC machining (for the two stainless steel shells). That consolidation is
why it is the named partner in spec point 1 — one supplier relationship,
one shipment, one DFM conversation, instead of a PCB house plus a separate
metal shop plus a separate assembly house. Wireless-charging-coil winding
and the gasket may still be separate small-quantity vendors at 100 units;
re-evaluate consolidating those too once volume passes ~500 units.

## Phases

### Phase 0 — DVT (design validation), target 2–4 weeks

- Finalize schematic + rigid-flex PCB layout from `02-BOM.md`.
- Bring up firmware on a breadboard/dev-kit stack (ESP32-S3 dev board +
  OV2640 breakout + e-paper breakout + BME280 breakout) — prove the
  notification-poll → display-render → COPY-button → Log-write loop
  end-to-end on the bench, in plastic, before spending on stainless tooling.
- Request PCBWay PCB + PCBA quote for a 5-unit prototype run.
- Request PCBWay CNC quote for Face A + Face B in both 304 and 316L, to
  settle the material decision in `02-BOM.md`.
- **Gate:** notification round-trip and COPY→Log round-trip both work on
  the bench before any tooling is cut.

### Phase 1 — EVT (engineering validation), target 4–6 weeks

- 5–10 unit prototype build: real PCBA from PCBWay, real CNC shells.
- Fit-check: does the rigid-flex stack actually close inside 11mm at the
  gasket, with the antenna window in the right place. This is where the
  RF risk (`01-PLAN.md` §7.1) either resolves or forces a redesign — test
  Wi-Fi RSSI with the shell fully closed, not just the bare board.
  IP54 gasket seal test.
  Qi charging alignment test (coil-to-coil tolerance through 11mm stainless
  + gasket).
- Firmware: OTA update path proven (see `04-FIRMWARE.md` §OTA) — the
  pilot run must be field-updatable without a screwdriver.
- **Gate:** 10/10 EVT units pass a 72h soak test (notification delivery,
  battery runtime, no RF dropout) before ordering pilot tooling.

### Phase 2 — Pilot run: 100 units, target 6–10 weeks after EVT gate

- Lock BOM (`02-BOM.md`), submit PCBWay CNC order for 100× Face A + 100×
  Face B, PCBWay PCBA order for 100 boards.
- Final assembly (board + battery + coil + camera + display into shell,
  gasket, close, program, QC) — in-house or a light-assembly house
  local to LOT, since PCBWay's turnkey stops at the bare PCBA.
- Per-unit QC: flash + pairing test, camera focus check, display refresh
  check, COPY→Log round-trip check, wireless-charge check. Every unit,
  not a sample — 100 units is small enough that 100% functional test is
  cheaper than a field return.
- Serialize each unit (`DEVICE: LOT-COMPUTER-000x`, matches the Log body
  format in `01-PLAN.md` §5) at flash time.
- **Gate:** 100/100 pass functional QC before any unit ships to an
  operator.

### Phase 3 — Field, ongoing

- First units go to internal/founder use (S-2) and a small operator
  cohort before wider distribution — this repo's own "Ship Mode
  Discipline" (`docs/benchmark/LOT-DOCTRINE.md`) pattern applies to
  hardware too: one feature (device) at a time, gated, not a mass push of
  the pilot output.
- Every field session on this program gets a compressed session report
  (spec point 8) — same convention as `docs/LOT-SR-*.md` for the software
  side, filed under `docs/LOT-SR-*.md` or `docs/hardware/LOT-COMPUTER/`
  depending on whether the session touched code or hardware/process.

## Cost shape (order of magnitude, 100 units)

```
Electronics + PCBA        ~$23-35/unit (BOM ex-enclosure, see 02-BOM.md) + PCBWay PCBA labor
Enclosure (2x CNC + polish + etch + gasket)   likely $15-40/unit — dominant cost line, needs a live PCBWay CNC quote
Final assembly + QC labor (100 units)         fixed cost, not per-unit-negligible at this volume
NRE (tooling, DVT/EVT prototype spend)        one-time, amortizes over the 100-unit run
```

No total is asserted here — the two PCBWay quotes (PCBA, CNC) are the
actual numbers; this roadmap exists so those quote requests can be filed
with a complete spec instead of a vague one.

## Immediate next actions

1. File PCBWay PCB+PCBA quote request using `02-BOM.md` part list (Phase 0).
2. File PCBWay CNC quote request for Face A/B in 304 and 316L (Phase 0).
3. Order dev-kit breakout parts (ESP32-S3 dev board, OV2640, e-paper,
   BME280, LD2410) for bench bring-up — these are the "Presence (option A)"
   / display / camera rows in `02-BOM.md`, all in-stock COTS parts.
4. S-2 sign-off on the Rev-A 42×42×11mm deviation from the 4×4×0.5cm
   spec (`01-PLAN.md` §Form factor) before DVT schematic is frozen.
