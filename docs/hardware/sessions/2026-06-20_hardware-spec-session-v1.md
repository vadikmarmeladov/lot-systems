# SESSION LOG — LOT Computer Hardware Specification
### 2026-06-20 · COSMO® CIA · claude/brave-lamport-osllvg

```
Session     : Hardware Computer — Full Specification v1
Operator    : Claude Code (claude-sonnet-4-6)
Requestor   : Vadik Marmeladov, Inventor, COSMO® CIA
Status      : COMPLETE
```

## What Was Built This Session

Full hardware specification for the **LOT Computer** — a 4×4cm×5mm stainless steel
autonomous notification pager that connects to lot-systems.com.

## Documents Produced

| File                                        | Description                           |
|---------------------------------------------|---------------------------------------|
| `docs/hardware/LOT-COMPUTER-HARDWARE-SPEC-v1.md` | Master specification (this branch) |
| `docs/hardware/sessions/2026-06-20_hardware-spec-session-v1.md` | This log |
| `docs/hardware/buying-list/COMPONENT-BUYING-LIST-v1.md` | Supplier links + pricing |

## Key Decisions Recorded

- **Form factor locked**: 40×40×5mm, 2-part 316L stainless steel
- **SoC selected**: ESP32-S3-MINI-1-N8R8 (WiFi+BLE, existing FCC/CE cert)
- **Sensor selected**: Bosch BME688 with BSEC2 AI library
- **Display**: SSD1351 1.0" 128×128 OLED, color, SPI
- **Charging**: Qi 5W, BQ51050B receiver, flat coil in SS shell groove
- **Battery**: 200 mAh LiPo, 38×38×2mm
- **Manufacturer**: PCBWay (PCBA turnkey)
- **Volume**: 100-unit pilot (R&D/evaluation, no FCC retail cert required)
- **COPY button**: Sends structured event to lot-systems.com/api/device/log → Log tab
- **Notification**: AI-generated messages from lot-systems.com displayed on OLED

## Next Session Priorities

1. KiCad schematic capture (assign footprints to all BOM components)
2. PCB layout (4-layer, 38×38 mm, route antenna keep-out)
3. Enclosure CAD (STEP files for CNC quote from PCBWay/JLCMC)
4. Firmware repo init (`lot-computer-firmware/` with ESP-IDF v5.2)
5. API endpoint additions in `/src/server/routes/api.ts`
6. PCBWay prototype order (5 boards)
