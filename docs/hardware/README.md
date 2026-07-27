<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Hardware Track

Planning documentation for **LOT Computer**, the first commercial physical
device in the QIoT™ line (see `docs/technical/LOT-NODE-0-RIG-SPEC.md`'s
sibling concept "LOT® Station / COSMO® node" and `docs/corporate/
LOT-TERMINAL-*` for the open-source S-2 operator platform this builds on).

Status: **planning phase — no components ordered, no PCB fabricated.**

## Document set

| Document | Covers |
|---|---|
| [`LOT-COMPUTER-PRODUCT-SPEC.md`](./LOT-COMPUTER-PRODUCT-SPEC.md) | The full 19-point brief mapped to spec, industrial design, notification protocol, manufacturing, positioning |
| [`LOT-COMPUTER-BOM.md`](./LOT-COMPUTER-BOM.md) | Components buying list, supplier links, unit cost, 100-unit run costing |
| [`LOT-COMPUTER-ROADMAP.md`](./LOT-COMPUTER-ROADMAP.md) | Phased plan: planning → server scaffolding → 10-unit bring-up → gate → 100-unit run → V2 miniaturization |
| [`LOT-COMPUTER-FIRMWARE-SPEC.md`](./LOT-COMPUTER-FIRMWARE-SPEC.md) | On-device firmware (ESP32-S3, camera, display, sensor loop, Copy button, OTA) |
| [`LOT-COMPUTER-SOFTWARE-SPEC.md`](./LOT-COMPUTER-SOFTWARE-SPEC.md) | New lot-systems.com server surface (`/api/device/*`) that firmware talks to |
| [`manuals/`](./manuals/) | PDF exports of the above, regenerated per phase (brief pt.7) |
| [`sessions/`](./sessions/) | Compressed per-session reports (brief pt.8) |

## Reading order

1. `LOT-COMPUTER-PRODUCT-SPEC.md` §01 — the 19-point brief mapping table,
   the fastest way to see what's specified where.
2. `LOT-COMPUTER-ROADMAP.md` §00 — the build order and current phase.
3. `LOT-COMPUTER-BOM.md` / `LOT-COMPUTER-FIRMWARE-SPEC.md` /
   `LOT-COMPUTER-SOFTWARE-SPEC.md` as needed per phase.

## Relationship to existing docs

This track does not replace or edit:
- `docs/corporate/LOT-TERMINAL-VISION.md` — the S-2 operator platform vision
- `docs/corporate/LOT-TERMINAL-M2M.md` — the data-intake protocol LOT
  Computer's sensor telemetry is byte-compatible with
- `docs/corporate/LOT-TERMINAL-SYNC.md` — the sync/auth pattern LOT
  Computer's pairing flow follows
- `docs/technical/OS_API.md` — the existing internal API this track adds a
  sibling `/api/device/*` namespace next to, not into
- `docs/technical/LOT-NODE-0-RIG-SPEC.md` — a different hardware track
  entirely (the self-hosted AI inference server, not the desk device)
