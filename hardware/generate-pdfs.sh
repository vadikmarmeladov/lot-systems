#!/usr/bin/env bash
# Generate PDF manuals for COSMO NODE hardware documents
# Requires: pandoc, wkhtmltopdf
# Install: sudo apt install pandoc wkhtmltopdf

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

check_deps() {
  for cmd in pandoc wkhtmltopdf; do
    if ! command -v "$cmd" &>/dev/null; then
      echo "Missing: $cmd — install with: sudo apt install pandoc wkhtmltopdf"
      exit 1
    fi
  done
}

generate_pdf() {
  local md_file="$1"
  local pdf_file="${md_file%.md}.pdf"
  local title
  title=$(head -1 "$md_file" | sed 's/^# //')

  echo "Generating: $pdf_file"
  pandoc "$md_file" \
    -o "$pdf_file" \
    --pdf-engine=wkhtmltopdf \
    --metadata title="$title" \
    --metadata author="COSMO® CIA · LOT Systems" \
    --metadata date="$(date +%Y-%m-%d)" \
    -V geometry:margin=2cm \
    -V fontsize=11pt \
    -V colorlinks=true \
    -V linkcolor=blue \
    --toc \
    --toc-depth=2 \
    2>/dev/null
  echo "  OK: $pdf_file"
}

check_deps

echo "=== COSMO NODE — PDF Manual Generation ==="
echo ""

for md in COSMO-INDEX.md COSMO-DEVICE-PLAN.md COSMO-BOM.md COSMO-ROADMAP.md COSMO-FIRMWARE-SPEC.md COSMO-API-CONNECTOR.md; do
  if [ -f "$md" ]; then
    generate_pdf "$md"
  else
    echo "SKIP (not found): $md"
  fi
done

echo ""
echo "=== All PDFs generated in: $SCRIPT_DIR ==="
ls -lh COSMO-*.pdf 2>/dev/null || echo "(No PDFs found — check pandoc output above)"
