#!/usr/bin/env python3
"""Generate COSMO Cube Quick Reference PDF from the hardware doc set source."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER
import os

OUTPUT_PATH = "/home/user/LOT-Computer/docs/hardware/cosmo-cube/pdf/COSMO-CUBE-QUICK-REFERENCE-v1.pdf"
MD_PATH = "/home/user/LOT-Computer/docs/hardware/cosmo-cube/QUICK-REFERENCE-SOURCE.md"

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
ACCENT = colors.HexColor("#cccccc")
STEEL = colors.HexColor("#4a5a66")


def build_styles():
    title = ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=16,
        leading=20, textColor=WHITE, backColor=BLACK, spaceAfter=6, alignment=TA_CENTER)
    subtitle = ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
        leading=12, textColor=GRAY_MID, spaceAfter=3, alignment=TA_CENTER)
    h1 = ParagraphStyle('LotH1', fontName='Courier-Bold', fontSize=12,
        leading=15, textColor=STEEL, spaceBefore=14, spaceAfter=5)
    h2 = ParagraphStyle('LotH2', fontName='Courier-Bold', fontSize=10,
        leading=13, textColor=GRAY_DARK, spaceBefore=10, spaceAfter=3)
    body = ParagraphStyle('LotBody', fontName='Courier', fontSize=8,
        leading=11, textColor=GRAY_DARK, spaceAfter=3)
    meta = ParagraphStyle('LotMeta', fontName='Courier', fontSize=7,
        leading=9, textColor=GRAY_LIGHT, spaceAfter=2, alignment=TA_CENTER)
    return {'title': title, 'subtitle': subtitle, 'h1': h1, 'h2': h2,
            'body': body, 'meta': meta}


def make_pre(text):
    return Preformatted(text, ParagraphStyle('Pre', fontName='Courier',
        fontSize=7, leading=9, textColor=GRAY_DARK,
        backColor=colors.HexColor("#f5f5f5"),
        spaceAfter=5, spaceBefore=5, leftIndent=6, rightIndent=6))


def parse_md(styles):
    with open(MD_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    story = []
    in_code = False
    buf = []

    def flush():
        if buf:
            text = ''.join(buf).rstrip('\n')
            story.append(make_pre(text))
            buf.clear()

    for raw in lines:
        line = raw.rstrip('\n')
        if line.strip().startswith('<!--') or line.strip() == '-->':
            continue
        if line.strip().startswith('```'):
            if in_code:
                flush()
            in_code = not in_code
            continue
        if in_code:
            buf.append(raw)
            continue
        s = line.strip()
        if s.startswith('## ') and not s.startswith('### '):
            story.append(Paragraph(s[3:], styles['h1']))
        elif s.startswith('# '):
            story.append(Spacer(1, 0.08 * inch))
            story.append(Paragraph(s[2:], styles['title']))
        elif s == '---':
            story.append(HRFlowable(width="100%", thickness=0.5,
                color=ACCENT, spaceAfter=3, spaceBefore=3))
        elif s == '':
            story.append(Spacer(1, 0.03 * inch))
        elif s.startswith(('- ', '1. ', '2. ', '3. ', '4. ', '5. ', '6. ', '7. ')):
            clean = s.replace('**', '').replace('*', '')
            story.append(Paragraph(clean, styles['body']))
        else:
            clean = s.replace('**', '').replace('*', '')
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
    canvas.drawString(0.45 * inch, h - 0.22 * inch,
                       "LOT SYSTEMS -- COSMO CUBE -- QUICK REFERENCE v1")
    canvas.drawRightString(w - 0.45 * inch, h - 0.22 * inch, f"p.{doc.page}")
    canvas.setFillColor(GRAY_LIGHT)
    canvas.setFont("Courier", 6.5)
    canvas.drawCentredString(w / 2, 0.2 * inch,
        "(c) 2025-2026 LOT Systems - LOT Founded 7 April 2016 - brand.lot-systems.com")
    canvas.restoreState()


def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    print(f"Generating: {OUTPUT_PATH}")
    doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=letter,
        rightMargin=0.6 * inch, leftMargin=0.6 * inch,
        topMargin=0.55 * inch, bottomMargin=0.45 * inch,
        title="COSMO Cube Quick Reference v1",
        author="Vadik Marmeladov -- LOT Systems",
        subject="COSMO Cube hardware computer -- quick reference")
    styles = build_styles()
    story = []

    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("LOT SYSTEMS CORPORATION", styles['title']))
    story.append(Spacer(1, 0.08 * inch))
    story.append(Paragraph("COSMO CUBE -- MODEL C1", styles['subtitle']))
    story.append(Paragraph("QUICK REFERENCE -- HARDWARE DOC SET v1 -- DRAFT", styles['subtitle']))
    story.append(Spacer(1, 0.06 * inch))
    story.append(Paragraph("40mm x 40mm x 5mm target -- two-part 316L stainless steel", styles['meta']))
    story.append(Paragraph('"One line, no alarm, exact moment."', styles['meta']))
    story.append(Paragraph("Author: Vadik Marmeladov, CEO &amp; Founder, LOT Systems", styles['meta']))
    story.append(HRFlowable(width="100%", thickness=1, color=BLACK,
        spaceAfter=6, spaceBefore=6))
    cover_art = """\
+----------------------------------------------------------------+
|      L . O . T     S Y S T E M S     C O R P O R A T I O N     |
|                COSMO CUBE -- MODEL C1                           |
|         TOP:    camera . screen . copy button                  |
|         BOTTOM: polished stainless . wireless charge window    |
|                                                                  |
|   PCB: ESP32-S3   SENSOR: BME680   CAMERA: OV2640 -> OVM6948    |
|   CHARGE: Qi / BQ51013B            LOG: POST /logs (existing)  |
|                                                                  |
|   PHASE 0: SPEC  ->  BENCH PROTO  ->  PCBWAY SPIN  ->  ALPHA    |
|            ->  100-UNIT PILOT RUN  ->  USERSHIP HARDWARE TIER  |
+----------------------------------------------------------------+"""
    story.append(make_pre(cover_art))
    story.append(PageBreak())

    content = parse_md(styles)
    story.extend(content)
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    size = os.path.getsize(OUTPUT_PATH)
    print(f"Done. Size: {size:,} bytes ({size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
