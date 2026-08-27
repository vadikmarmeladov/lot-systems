#!/usr/bin/env python3
"""Generate the COSMO(R) Computer PDF manual from its Terminal Grid markdown
source set (product spec + firmware doc + software doc). Terminal Grid docs
use ASCII box-drawing and fixed-width tables/diagrams rather than clean
markdown headers, so this renders each source file as monospace flowing
text (Preformatted) instead of parsing markdown structure — the point is
to preserve the exact grid alignment, not reflow it."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER
import os

ROOT = "/home/user/LOT-Computer"
OUTPUT_PATH = f"{ROOT}/docs/corporate/LOT-COSMO-COMPUTER-MANUAL-v1.pdf"

SOURCES = [
    ("COSMO(R) COMPUTER — PRODUCT SPEC, PLAN, BOM, ROADMAP",
     f"{ROOT}/docs/corporate/LOT-COSMO-COMPUTER-v1.md"),
    ("COSMO(R) COMPUTER — FIRMWARE SPECIFICATION",
     f"{ROOT}/docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md"),
    ("COSMO(R) COMPUTER — SERVER + COMPANION SOFTWARE SPECIFICATION",
     f"{ROOT}/docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md"),
]

BLACK      = colors.HexColor("#000000")
WHITE      = colors.HexColor("#ffffff")
GRAY_DARK  = colors.HexColor("#1a1a1a")
GRAY_MID   = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
ACCENT     = colors.HexColor("#cccccc")
GOLD       = colors.HexColor("#bb8800")
CYAN       = colors.HexColor("#336688")
STEEL      = colors.HexColor("#5a6b73")   # cool steel-gray — COSMO(R) hardware register


def build_styles():
    title = ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=15,
        leading=19, textColor=WHITE, backColor=BLACK, spaceAfter=6,
        alignment=TA_CENTER)
    doctitle = ParagraphStyle('LotDocTitle', fontName='Courier-Bold', fontSize=11,
        leading=15, textColor=STEEL, spaceBefore=4, spaceAfter=8,
        alignment=TA_CENTER)
    subtitle = ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
        leading=12, textColor=GRAY_MID, spaceAfter=3, alignment=TA_CENTER)
    meta = ParagraphStyle('LotMeta', fontName='Courier', fontSize=7,
        leading=9, textColor=GRAY_LIGHT, spaceAfter=2, alignment=TA_CENTER)
    pre = ParagraphStyle('Pre', fontName='Courier', fontSize=6.6, leading=8.4,
        textColor=GRAY_DARK, spaceAfter=0, spaceBefore=0,
        leftIndent=2, rightIndent=2)
    return {'title': title, 'doctitle': doctitle, 'subtitle': subtitle,
            'meta': meta, 'pre': pre}


def load_body(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    # Strip the leading HTML attribution comment block, if present.
    if text.lstrip().startswith('<!--'):
        end = text.find('-->')
        if end != -1:
            text = text[end + 3:]
    return text.strip('\n')


def wrap_ascii(text, width=96):
    """Wrap only lines that overrun the printable width; short/table lines
    pass through untouched to preserve alignment."""
    out = []
    for line in text.split('\n'):
        if len(line) <= width:
            out.append(line)
        else:
            # Preserve leading indentation on continuation lines.
            indent = len(line) - len(line.lstrip(' '))
            pad = ' ' * min(indent + 2, 12)
            words = line.split(' ')
            cur = ''
            for w in words:
                trial = (cur + ' ' + w).strip() if cur else w
                if len(trial) > width and cur:
                    out.append(cur)
                    cur = pad + w
                else:
                    cur = trial
            if cur:
                out.append(cur)
    return '\n'.join(out)


def build_pdf():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
    )
    styles = build_styles()
    story = []

    # Cover block
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("LOT SYSTEMS CORPORATION", styles['title']))
    story.append(Paragraph("COSMO&reg; COMPUTER — OPERATOR MANUAL", styles['doctitle']))
    story.append(Paragraph("Vadim Marmeladov — CEO, Owner LOT&reg; &nbsp;|&nbsp; "
                            "Kuzya Cosmo Marmeladov — CEO, Owner COSMO&reg;", styles['subtitle']))
    story.append(Paragraph("LOT&reg; Founded 7 April 2016 | COSMO&reg; Founded 1 July 2024 | "
                            "brand.lot-systems.com", styles['meta']))
    story.append(Paragraph("DOCUMENT SET: LOT-COSMO-COMPUTER-v1 (product spec) + "
                            "LOT-COSMO-COMPUTER-FIRMWARE + LOT-COSMO-COMPUTER-SOFTWARE",
                            styles['meta']))
    story.append(Paragraph("CLASS: RESTRICTED // S-2 EYES &nbsp;|&nbsp; DATE: 2026-08-27", styles['meta']))
    story.append(Spacer(1, 0.2 * inch))
    story.append(HRFlowable(width="100%", thickness=0.75, color=ACCENT))
    story.append(PageBreak())

    for i, (label, path) in enumerate(SOURCES):
        story.append(Paragraph(label, styles['doctitle']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=6))
        body = load_body(path)
        body = wrap_ascii(body)
        # Escape XML-sensitive chars for Preformatted-adjacent safety; the
        # source is already plain ASCII/box-drawing so this is a no-op for
        # nearly all lines and only matters for stray '&'.
        story.append(Preformatted(body, styles['pre']))
        if i < len(SOURCES) - 1:
            story.append(PageBreak())

    # Footer / colophon
    story += [
        PageBreak(),
        HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=6, spaceBefore=12),
        Paragraph("COSMO&reg; COMPUTER — v1.0 DESIGN LOCK PENDING (PRE-PROTOTYPE)", styles['meta']),
        Paragraph("100-UNIT PILOT RUN &nbsp;|&nbsp; PCBWay FABRICATION &nbsp;|&nbsp; "
                  "LOT API CONNECTOR (M2M PROTOCOL)", styles['meta']),
        Paragraph("&copy; 2025&ndash;2026 LOT SYSTEMS. ALL RIGHTS RESERVED.", styles['meta']),
    ]

    doc.build(story)
    size = os.path.getsize(OUTPUT_PATH)
    print(f"[OK] PDF generated: {OUTPUT_PATH}")
    print(f"     Size: {size:,} bytes ({size // 1024} KB)")


if __name__ == '__main__':
    build_pdf()
