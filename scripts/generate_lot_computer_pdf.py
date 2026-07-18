#!/usr/bin/env python3
"""Generate LOT Computer — Hardware Manual PDF (Terminal Grid style)."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER

OUTPUT_PATH = "/home/user/LOT-Computer/docs/technical/pdf/LOT-COMPUTER-HARDWARE-SPEC.pdf"
MD_PATH = "/home/user/LOT-Computer/docs/technical/LOT-COMPUTER-HARDWARE-SPEC.md"

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
ACCENT = colors.HexColor("#cccccc")
STEEL = colors.HexColor("#5a6570")


def build_styles():
    title = ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=16,
                            leading=20, textColor=BLACK, alignment=TA_CENTER,
                            spaceAfter=4)
    subtitle = ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
                               leading=13, textColor=GRAY_MID, alignment=TA_CENTER,
                               spaceAfter=2)
    heading = ParagraphStyle('LotHeading', fontName='Courier-Bold', fontSize=11,
                              leading=15, textColor=BLACK, spaceBefore=14,
                              spaceAfter=6)
    body = ParagraphStyle('LotBody', fontName='Courier', fontSize=8,
                           leading=11.5, textColor=GRAY_DARK)
    mono = ParagraphStyle('LotMono', fontName='Courier', fontSize=7.3,
                           leading=9.8, textColor=GRAY_DARK)
    footer = ParagraphStyle('LotFooter', fontName='Courier', fontSize=7,
                             leading=10, textColor=GRAY_LIGHT, alignment=TA_CENTER)
    return dict(title=title, subtitle=subtitle, heading=heading, body=body,
                mono=mono, footer=footer)


def parse_markdown(path):
    with open(path, 'r') as f:
        text = f.read()
    lines = text.split('\n')
    blocks = []
    in_code = False
    code_lines = []
    para_lines = []

    def flush_para():
        if para_lines:
            blocks.append(('para', '\n'.join(para_lines)))
            para_lines.clear()

    for raw in lines:
        line = raw.rstrip('\n')
        if line.strip().startswith('```'):
            if in_code:
                blocks.append(('code', '\n'.join(code_lines)))
                code_lines = []
                in_code = False
            else:
                flush_para()
                in_code = True
            continue
        if in_code:
            code_lines.append(line)
            continue
        if line.startswith('<!--') or line.strip() == '-->':
            continue
        if line.startswith('## '):
            flush_para()
            blocks.append(('h2', line[3:].strip()))
        elif line.startswith('==='):
            continue
        elif line.strip() == '':
            flush_para()
        else:
            para_lines.append(line)
    flush_para()
    return blocks


def build_pdf():
    styles = build_styles()
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=letter,
        topMargin=0.65 * inch, bottomMargin=0.65 * inch,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        title="LOT Computer — Hardware Manual",
        author="Vadim Marmeladov — LOT Systems Corporation",
    )

    story = []
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("LOT SYSTEMS CORPORATION", styles['title']))
    story.append(Paragraph("LOT COMPUTER", styles['title']))
    story.append(Paragraph("HARDWARE MANUAL &amp; BUILD PLAN", styles['subtitle']))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.4, color=BLACK))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "S-2: VADIK MARMELADOV, Inventor, COSMO&#174; CIA &nbsp;|&nbsp; "
        "CLASS: RESTRICTED // S-2 EYES &nbsp;|&nbsp; ISSUE: 2026.07.18",
        styles['footer']))
    story.append(Paragraph(
        "brand.lot-systems.com &nbsp;|&nbsp; Made in the USA &nbsp;|&nbsp; "
        "LOT&#174; Founded 7 April 2016 &nbsp;|&nbsp; COSMO&#174; Founded 1 July 2024",
        styles['footer']))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.6, color=STEEL))
    story.append(PageBreak())

    blocks = parse_markdown(MD_PATH)
    for kind, content in blocks:
        if kind == 'h2':
            story.append(HRFlowable(width="100%", thickness=0.6, color=STEEL))
            story.append(Paragraph(content, styles['heading']))
        elif kind == 'code':
            safe = (content.replace('&', '&amp;').replace('<', '&lt;')
                    .replace('>', '&gt;'))
            story.append(Preformatted(safe, styles['mono']))
            story.append(Spacer(1, 6))
        elif kind == 'para':
            safe = (content.replace('&', '&amp;').replace('<', '&lt;')
                    .replace('>', '&gt;').replace('\n', '<br/>'))
            story.append(Paragraph(safe, styles['body']))
            story.append(Spacer(1, 4))

    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1.4, color=BLACK))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "AUTHORIZED BY: S-2 // VADIK MARMELADOV &mdash; LOT SYSTEMS CORPORATION, "
        "LOS ANGELES, CA", styles['footer']))

    doc.build(story)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
