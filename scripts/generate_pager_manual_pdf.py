#!/usr/bin/env python3
"""Generate LOT® Pager User Manual v1 PDF from its Markdown source."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable
)
from reportlab.lib.enums import TA_CENTER
import os

OUTPUT_PATH = "/home/user/LOT-Computer/docs/manuals/LOT-PAGER-USER-MANUAL-v1.pdf"
MD_PATH = "/home/user/LOT-Computer/docs/manuals/LOT-PAGER-USER-MANUAL-v1.md"

BLACK      = colors.HexColor("#000000")
WHITE      = colors.HexColor("#ffffff")
GRAY_DARK  = colors.HexColor("#1a1a1a")
GRAY_MID   = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
ACCENT     = colors.HexColor("#cccccc")
STEEL      = colors.HexColor("#5a6b74")
BG_TINT    = colors.HexColor("#f4f6f7")


def build_styles():
    return {
        'title': ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=17,
            leading=21, textColor=BLACK, spaceAfter=6, alignment=TA_CENTER),
        'subtitle': ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
            leading=12, textColor=GRAY_MID, spaceAfter=3, alignment=TA_CENTER),
        'h1': ParagraphStyle('LotH1', fontName='Courier-Bold', fontSize=12,
            leading=15, textColor=STEEL, spaceBefore=14, spaceAfter=5),
        'body': ParagraphStyle('LotBody', fontName='Courier', fontSize=9,
            leading=13, textColor=GRAY_DARK, spaceAfter=4),
        'bullet': ParagraphStyle('LotBullet', fontName='Courier', fontSize=9,
            leading=13, textColor=GRAY_DARK, spaceAfter=3, leftIndent=14),
        'meta': ParagraphStyle('LotMeta', fontName='Courier', fontSize=7,
            leading=9, textColor=GRAY_LIGHT, spaceAfter=2, alignment=TA_CENTER),
    }


def make_pre(text):
    return Preformatted(text, ParagraphStyle('Pre', fontName='Courier',
        fontSize=8, leading=11, textColor=GRAY_DARK, backColor=BG_TINT,
        spaceAfter=6, spaceBefore=6, leftIndent=6, rightIndent=6))


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def render_inline(s):
    s = esc(s)
    while '**' in s:
        s = s.replace('**', '<b>', 1)
        if '**' in s:
            s = s.replace('**', '</b>', 1)
    return s


def parse_md(styles):
    with open(MD_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    story = []
    in_code = False
    buf = []

    def flush():
        if buf:
            story.append(make_pre(''.join(buf).rstrip('\n')))
            buf.clear()

    for raw in lines:
        line = raw.rstrip('\n')
        s = line.strip()
        if s.startswith('```'):
            if in_code:
                flush()
            in_code = not in_code
            continue
        if in_code:
            buf.append(raw)
            continue
        if s.startswith('# ') and not s.startswith('## '):
            story.append(Spacer(1, 0.06 * inch))
            story.append(Paragraph(render_inline(s[2:]), styles['title']))
        elif s.startswith('## '):
            story.append(Paragraph(render_inline(s[3:]), styles['h1']))
        elif s == '---':
            story.append(HRFlowable(width="100%", thickness=0.5,
                color=ACCENT, spaceAfter=6, spaceBefore=6))
        elif s.startswith('- '):
            story.append(Paragraph('&#8226;&nbsp;&nbsp;' + render_inline(s[2:]), styles['bullet']))
        elif s.startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.')):
            story.append(Paragraph(render_inline(s), styles['bullet']))
        elif s.startswith('*') and s.endswith('*') and len(s) > 1:
            story.append(Paragraph('<i>' + render_inline(s.strip('*')) + '</i>', styles['meta']))
        elif s == '':
            story.append(Spacer(1, 0.05 * inch))
        else:
            story.append(Paragraph(render_inline(s), styles['body']))
    if buf:
        flush()
    return story


def build_pdf():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=letter,
        leftMargin=0.85 * inch, rightMargin=0.85 * inch,
        topMargin=0.85 * inch, bottomMargin=0.85 * inch,
    )
    styles = build_styles()
    story = [
        Paragraph("LOT SYSTEMS CORPORATION", styles['subtitle']),
        Paragraph("COSMO® Hardware Division · brand.lot-systems.com", styles['meta']),
        Spacer(1, 0.12 * inch),
    ] + parse_md(styles) + [
        HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=6, spaceBefore=12),
        Paragraph("LOT® PAGER — USER MANUAL v1.0 · PRODUCT CODE LOT-PAGER-01", styles['meta']),
        Paragraph("© 2025–2026 LOT SYSTEMS. ALL RIGHTS RESERVED.", styles['meta']),
    ]
    doc.build(story)
    size = os.path.getsize(OUTPUT_PATH)
    print(f"[OK] PDF generated: {OUTPUT_PATH}")
    print(f"     Size: {size:,} bytes ({size // 1024} KB)")


if __name__ == '__main__':
    build_pdf()
