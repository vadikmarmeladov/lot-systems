<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# COSMO® Cube — PDF Manual Plan

**Document 7 of 7 · Hardware Documentation Set**

---

## Reused Pipeline

Per brief #7, the result of this hardware program should include PDF
manuals. Rather than invent a new pipeline, this reuses the exact pattern
already in production for the Badge Codex (`scripts/generate_badge_pdf_v19.py`):
a Python script using `reportlab` to render a markdown source into a
styled, Terminal-Grid PDF, output to a `pdf/` subfolder next to the
source docs.

```
scripts/generate_cosmo_cube_manual_pdf.py
  reads:  docs/hardware/cosmo-cube/*.md
  writes: docs/hardware/cosmo-cube/pdf/*.pdf
```

## Manual Set

| Manual | Audience | Source |
|--------|----------|--------|
| Quick Start Card (1-pager) | End user, in the box | New — pairing steps + Copy button explainer |
| Full User Manual | End user | New — care, charging, notification behavior, privacy indicator |
| Firmware/Developer Manual | Internal + future OSS release | Doc 4 (`04-FIRMWARE-SPEC.md`) |
| Software/API Connector Manual | Internal + future OSS release | Doc 5 (`05-SOFTWARE-LOT-API-CONNECTOR.md`) |
| Safety & Compliance Insert | End user, legal requirement | Doc 6 (`06-MANUFACTURING-AND-COMPLIANCE.md`) §Compliance |

Firmware and software manuals stay **separate PDFs**, mirroring brief
#11's instruction to keep firmware and software documents apart even at
the manual stage — a firmware engineer flashing a unit should not have to
open the same document as someone building the pairing UI.

## What This Session Produced

As a concrete first artifact (not just a plan), this session generated
one real PDF using the reused pipeline: a **COSMO® Cube Quick Reference**
covering the device at a glance — form factor, faces, the Copy button,
and the notification rule — rendered from this document set via
`scripts/generate_cosmo_cube_manual_pdf.py`, output to
`docs/hardware/cosmo-cube/pdf/COSMO-CUBE-QUICK-REFERENCE-v1.pdf`.

Future sessions extend the same script to render the remaining four
manuals in the table above as the underlying specs mature past DRAFT.

---

*Previous: [`06-MANUFACTURING-AND-COMPLIANCE.md`](./06-MANUFACTURING-AND-COMPLIANCE.md) · Back to [`README.md`](./README.md)*
