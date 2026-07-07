<!--
  LOT SYSTEMS CORPORATION
  COSMO® CIA Hardware Division
  Document: COSMO-PDF-MANUALS-v1.md
  PDF Manual Generation Pipeline
  Date: 2026-07-07
-->

# COSMO® Cube — PDF Manual Generation Pipeline v1.0

**Document:** COSMO-PDF-MANUALS-v1.md
**Supersedes:** "PDF Manual Plan" table in COSMO-HARDWARE-REPORT-v1.md (planning only, no pipeline)
**Author:** Vadim Marmeladov, Inventor
**Date:** 2026-07-07

---

## 1. Purpose

COSMO-HARDWARE-REPORT-v1.md named six manuals to produce but did not specify how.
This document is the pipeline: source markdown → print-ready PDF, reproducible from
a clean checkout, no manual desktop-publishing step.

---

## 2. Source-to-Manual Map

Every manual is generated FROM an existing engineering doc in `docs/hardware/` —
never hand-authored separately. One source of truth; PDFs are a rendered view.

| Manual (PDF) | Audience | Generated from | Pages (est.) |
|---|---|---|---|
| `COSMO-Cube-Quick-Start.pdf` | End user | New: `manuals/quick-start.md` (excerpt of DEVICE-SPEC §3–4, §8, CHARGER-SPEC §5) | 4 |
| `COSMO-Cube-User-Manual.pdf` | End user | DEVICE-SPEC-v1.md + CHARGER-SPEC-v1.md (user-facing sections only) | 20 |
| `COSMO-Cube-Firmware-Developer-Guide.pdf` | Firmware engineers | FIRMWARE-v1.md (full) | 40+ |
| `COSMO-Cube-Hardware-Reference-Manual.pdf` | Hardware engineers | DEVICE-SPEC-v1.md (full) + BOM-v1.md | 30+ |
| `COSMO-Cube-API-Integration-Guide.pdf` | Backend developers | SOFTWARE-API-v1.md (full) | 25+ |
| `COSMO-Cube-Manufacturing-QA-Manual.pdf` | Production / PCBWay liaison | MANUFACTURING-v1.md (full) | 20+ |

End-user manuals are **excerpts** — engineering detail (register maps, SQL schema,
PCBWay order steps) is stripped for the Quick Start and User Manual. Everything
else is a **full render** of its source doc, so the source markdown is the only
thing that needs to stay accurate.

---

## 3. Toolchain

Reuses the pattern already live in this repo for Badge Codex PDFs
(`scripts/generate-badge-codex-pdf.cjs`, `scripts/generate_badges_pdf.py`) —
Pandoc + a LaTeX engine, no new dependency class introduced.

```bash
# One-time setup (already satisfied on any machine that built the badge codex PDFs)
brew install pandoc          # or: apt-get install pandoc
brew install --cask basictex # or: apt-get install texlive-xetex texlive-fonts-recommended
```

| Tool | Role |
|---|---|
| Pandoc | Markdown → PDF via LaTeX (`--pdf-engine=xelatex`) |
| `docs/hardware/manuals/lot-manual.latex` | Custom LaTeX template — A5, LOT® typography |
| `scripts/generate-cosmo-manuals.sh` | Driver script — excerpt + full render + output naming |

---

## 4. LaTeX Template Rules (`lot-manual.latex`)

Matches LOT Voice / Terminal Grid cadence (per CQGS Response Grammar layer —
docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md §III): density over sprawl, no
decorative color, system-default aesthetic.

| Rule | Value |
|---|---|
| Page size | A5 (148mm × 210mm) |
| Body font | Latin Modern Mono (matches OLED / Terminal Grid monospace cadence) |
| Heading font | Latin Modern Sans, bold, no color — black only |
| Margins | 15mm all sides |
| Header | `COSMO® CIA` left, page number right |
| Footer | `LOT Systems, Inc. — Made in the USA` centered, 7pt |
| Cover page | LOT® wordmark + COSMO® mark + doc title + version + date, no imagery |
| Code blocks | Monospace, 1pt border, no syntax color (grayscale only) |
| Tables | Pandoc `grid_tables`, no color fill |

---

## 5. Driver Script (`scripts/generate-cosmo-manuals.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail
SRC=docs/hardware
OUT=docs/hardware/manuals/pdf
TPL=docs/hardware/manuals/lot-manual.latex
mkdir -p "$OUT"

render() {
  local title="$1" src="$2" out="$3"
  pandoc "$src" \
    --template="$TPL" \
    --pdf-engine=xelatex \
    -V title="$title" \
    -V documentclass=article \
    -V papersize=a5paper \
    -o "$OUT/$out"
  echo "-> $OUT/$out"
}

render "COSMO(R) Cube - Quick Start"              "$SRC/manuals/quick-start.md"      "COSMO-Cube-Quick-Start.pdf"
render "COSMO(R) Cube - User Manual"               "$SRC/manuals/user-manual.md"      "COSMO-Cube-User-Manual.pdf"
render "COSMO(R) Cube - Firmware Developer Guide"  "$SRC/COSMO-FIRMWARE-v1.md"        "COSMO-Cube-Firmware-Developer-Guide.pdf"
render "COSMO(R) Cube - Hardware Reference Manual" "$SRC/COSMO-DEVICE-SPEC-v1.md"     "COSMO-Cube-Hardware-Reference-Manual.pdf"
render "COSMO(R) Cube - API Integration Guide"     "$SRC/COSMO-SOFTWARE-API-v1.md"    "COSMO-Cube-API-Integration-Guide.pdf"
render "COSMO(R) Cube - Manufacturing & QA Manual" "$SRC/COSMO-MANUFACTURING-v1.md"   "COSMO-Cube-Manufacturing-QA-Manual.pdf"
```

`manuals/quick-start.md` and `manuals/user-manual.md` are thin excerpt files
(a few paragraphs + a pointer table) checked in next to the script — not
generated, since excerpting is an editorial choice, not a mechanical transform.

---

## 6. Output Location & Distribution

| Stage | Path |
|---|---|
| Generated PDFs (build artifact, not committed) | `docs/hardware/manuals/pdf/*.pdf` |
| Public download (post-launch) | `lot-systems.com/downloads/cosmo-cube/` |
| In-box (printed) | Quick Start only — printed A5 card, PCBWay/packaging vendor |

PDFs are **not committed to git** — they are a build artifact of markdown that
IS committed. `docs/hardware/manuals/pdf/` is added to `.gitignore`. Regenerating
after any source-doc edit is a single `bash scripts/generate-cosmo-manuals.sh`.

---

## 7. Tie to Session Compression

Every hardware session that edits a source doc (DEVICE-SPEC, FIRMWARE, etc.)
invalidates its derived PDF. See COSMO-SESSION-COMPRESSION-v1.md §3 for the rule
that keeps manuals from silently drifting out of date.

---

*Document v1.0 — COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadim Marmeladov — 2026-07-07*
