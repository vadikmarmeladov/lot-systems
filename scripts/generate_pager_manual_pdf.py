#!/usr/bin/env python3
"""Generate the LOT® Pager Quick-Start Manual PDF from docs/technical/LOT-PAGER-MANUAL.md"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable
)
from reportlab.lib.enums import TA_CENTER
import os

OUTPUT_PATH = "/home/user/LOT-Computer/docs/technical/pdf/LOT-PAGER-QUICKSTART-MANUAL.pdf"
MD_PATH = "/home/user/LOT-Computer/docs/technical/LOT-PAGER-MANUAL.md"

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
ACCENT = colors.HexColor("#cccccc")
STEEL = colors.HexColor("#5a6a72")


def build_styles():
    title = ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=18,
        leading=22, textColor=WHITE, backColor=BLACK, spaceAfter=6, alignment=TA_CENTER)
    subtitle = ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
        leading=12, textColor=GRAY_MID, spaceAfter=3, alignment=TA_CENTER)
    h1 = ParagraphStyle('LotH1', fontName='Courier-Bold', fontSize=12,
        leading=16, textColor=STEEL, spaceBefore=14, spaceAfter=5)
    h2 = ParagraphStyle('LotH2', fontName='Courier-Bold', fontSize=10,
        leading=13, textColor=BLACK, spaceBefore=10, spaceAfter=3)
    body = ParagraphStyle('LotBody', fontName='Courier', fontSize=9,
        leading=13, textColor=GRAY_DARK, spaceAfter=4)
    meta = ParagraphStyle('LotMeta', fontName='Courier', fontSize=7,
        leading=9, textColor=GRAY_LIGHT, spaceAfter=2, alignment=TA_CENTER)
    return {'title': title, 'subtitle': subtitle, 'h1': h1, 'h2': h2,
            'body': body, 'meta': meta}


def make_pre(text):
    return Preformatted(text, ParagraphStyle('Pre', fontName='Courier',
        fontSize=8, leading=10, textColor=GRAY_DARK,
        backColor=colors.HexColor("#f2f2f2"),
        spaceAfter=6, spaceBefore=4, leftIndent=8, rightIndent=8))


def parse_md(styles):
    with open(MD_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    story = []
    in_code = False
    in_header_comment = False
    buf = []

    def flush():
        if buf:
            text = ''.join(buf).rstrip('\n')
            story.append(make_pre(text))
            buf.clear()

    for raw in lines:
        line = raw.rstrip('\n')
        stripped = line.strip()
        if stripped.startswith('<!--'):
            in_header_comment = True
            continue
        if in_header_comment:
            if stripped == '-->':
                in_header_comment = False
            continue
        if stripped.startswith('```'):
            if in_code:
                flush()
            in_code = not in_code
            continue
        if in_code:
            buf.append(raw)
            continue
        if stripped.startswith('> '):
            story.append(Paragraph('<i>' + stripped[2:] + '</i>', styles['meta']))
            continue
        if stripped.startswith('# ') and not stripped.startswith('## '):
            story.append(Spacer(1, 0.08 * inch))
            story.append(Paragraph(stripped[2:], styles['title']))
        elif stripped.startswith('## '):
            story.append(Paragraph(stripped[3:], styles['h1']))
        elif stripped.startswith('### '):
            story.append(Paragraph(stripped[4:], styles['h2']))
        elif stripped == '---':
            story.append(HRFlowable(width="100%", thickness=0.5,
                color=ACCENT, spaceAfter=4, spaceBefore=4))
        elif stripped == '':
            story.append(Spacer(1, 0.04 * inch))
        elif stripped.startswith('- '):
            clean = stripped[2:].replace('**', '')
            story.append(Paragraph('•  ' + clean, styles['body']))
        else:
            clean = stripped.replace('**', '')
            if clean.startswith('*') and clean.endswith('*') and len(clean) > 1:
                story.append(Paragraph('<i>' + clean.strip('*') + '</i>', styles['meta']))
            else:
                story.append(Paragraph(clean, styles['body']))
    flush()
    return story


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = letter
    canvas.setFillColor(BLACK)
    canvas.rect(0, h - 0.35 * inch, w, 0.35 * inch, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Courier-Bold", 7)
    canvas.drawString(0.5 * inch, h - 0.22 * inch, "LOT® PAGER — QUICK-START MANUAL")
    canvas.drawRightString(w - 0.5 * inch, h - 0.22 * inch, f"p.{doc.page}")
    canvas.setFillColor(GRAY_LIGHT)
    canvas.setFont("Courier", 6.5)
    canvas.drawCentredString(w / 2, 0.2 * inch,
        "© 2026 LOT Systems, Inc. · LOT® Founded 7 April 2016 · brand.lot-systems.com")
    canvas.restoreState()


def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    print(f"Generating: {OUTPUT_PATH}")
    doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=letter,
        rightMargin=0.7 * inch, leftMargin=0.7 * inch,
        topMargin=0.55 * inch, bottomMargin=0.45 * inch,
        title="LOT Pager Quick-Start Manual",
        author="Vadim Marmeladov — LOT Systems",
        subject="LOT Pager hardware quick-start guide")
    styles = build_styles()
    story = parse_md(styles)
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("Done.")


if __name__ == '__main__':
    main()
