"""
LOT Systems Corporation
Badge & Achievements Master Codex v16 — PDF Generator
Generates a monospaced terminal-style PDF from the v16 Codex markdown.

Author: Vadik Marmeladov, CEO & Founder, LOT Systems
Copyright: (c) 2025-2026 LOT Systems. All rights reserved.
"""

import re
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ── Colors ────────────────────────────────────────────────────────────────────
BG_COLOR   = colors.HexColor('#0a0a0a')
FG_COLOR   = colors.HexColor('#e0e0e0')
ACC_COLOR  = colors.HexColor('#88ccee')   # headers / badges
GOLD_COLOR = colors.HexColor('#ffcc44')   # legendary
RED_COLOR  = colors.HexColor('#ff6644')   # mythic
GRID_COLOR = colors.HexColor('#333333')   # box-draw
DIM_COLOR  = colors.HexColor('#555555')   # comments / footer
MINT_COLOR = colors.HexColor('#88eeaa')   # new / v16
EPIC_COLOR = colors.HexColor('#cc88ee')   # epic

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.join(SCRIPT_DIR, '..')
MD_FILE     = os.path.join(REPO_ROOT, 'docs', 'badges', 'LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v16.md')
OUT_FILE    = os.path.join(REPO_ROOT, 'docs', 'badges', 'LOT-BADGES-ACHIEVEMENTS-MASTER-CODEX-v16.pdf')

# ── Styles ────────────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 15 * mm

def make_styles():
    styles = {}

    styles['title'] = ParagraphStyle(
        'title',
        fontName='Courier-Bold',
        fontSize=16,
        textColor=GOLD_COLOR,
        backColor=BG_COLOR,
        alignment=TA_CENTER,
        spaceAfter=6,
        leading=20,
    )
    styles['h1'] = ParagraphStyle(
        'h1',
        fontName='Courier-Bold',
        fontSize=13,
        textColor=ACC_COLOR,
        backColor=BG_COLOR,
        spaceBefore=10,
        spaceAfter=4,
        leading=17,
    )
    styles['h2'] = ParagraphStyle(
        'h2',
        fontName='Courier-Bold',
        fontSize=11,
        textColor=MINT_COLOR,
        backColor=BG_COLOR,
        spaceBefore=8,
        spaceAfter=3,
        leading=14,
    )
    styles['h3'] = ParagraphStyle(
        'h3',
        fontName='Courier-Bold',
        fontSize=10,
        textColor=EPIC_COLOR,
        backColor=BG_COLOR,
        spaceBefore=6,
        spaceAfter=2,
        leading=13,
    )
    styles['body'] = ParagraphStyle(
        'body',
        fontName='Courier',
        fontSize=8,
        textColor=FG_COLOR,
        backColor=BG_COLOR,
        spaceAfter=2,
        leading=11,
    )
    styles['code'] = ParagraphStyle(
        'code',
        fontName='Courier',
        fontSize=7,
        textColor=FG_COLOR,
        backColor=colors.HexColor('#111111'),
        spaceAfter=1,
        spaceBefore=1,
        leading=9,
        leftIndent=4,
        borderPad=2,
    )
    styles['new'] = ParagraphStyle(
        'new',
        fontName='Courier-Bold',
        fontSize=8,
        textColor=MINT_COLOR,
        backColor=BG_COLOR,
        spaceAfter=2,
        leading=11,
    )
    styles['footer'] = ParagraphStyle(
        'footer',
        fontName='Courier',
        fontSize=7,
        textColor=DIM_COLOR,
        backColor=BG_COLOR,
        alignment=TA_CENTER,
        leading=9,
    )
    return styles


def escape_xml(text):
    """Escape XML special characters for Paragraph."""
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    return text


def parse_markdown(md_text, styles):
    """Convert markdown to reportlab flowables."""
    elements = []
    lines = md_text.split('\n')
    in_code = False
    code_buf = []

    def flush_code():
        nonlocal code_buf
        if code_buf:
            block = '\n'.join(code_buf)
            # Use Preformatted for monospace code blocks
            pre = Preformatted(block, styles['code'])
            elements.append(pre)
            elements.append(Spacer(1, 2 * mm))
            code_buf = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Code fence toggle
        if line.startswith('```'):
            if in_code:
                flush_code()
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        # Skip HTML comments
        if line.strip().startswith('<!--'):
            while i < len(lines) and '-->' not in lines[i]:
                i += 1
            i += 1
            continue

        # Headings
        if line.startswith('# '):
            elements.append(Paragraph(escape_xml(line[2:]), styles['title']))
            i += 1
            continue
        if line.startswith('## '):
            elements.append(Paragraph(escape_xml(line[3:]), styles['h1']))
            i += 1
            continue
        if line.startswith('### '):
            elements.append(Paragraph(escape_xml(line[4:]), styles['h2']))
            i += 1
            continue
        if line.startswith('#### '):
            elements.append(Paragraph(escape_xml(line[5:]), styles['h3']))
            i += 1
            continue

        # Horizontal rule
        if line.strip() == '---':
            elements.append(HRFlowable(
                width='100%', thickness=0.5, color=GRID_COLOR,
                spaceBefore=3, spaceAfter=3
            ))
            i += 1
            continue

        # Empty line → small spacer
        if line.strip() == '':
            elements.append(Spacer(1, 1.5 * mm))
            i += 1
            continue

        # NEW-labeled lines
        is_new = '★ NEW' in line
        style = styles['new'] if is_new else styles['body']

        # Bold markers **text**
        escaped = escape_xml(line)
        escaped = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', escaped)
        escaped = re.sub(r'`(.+?)`', r'<font name="Courier" size="7">\1</font>', escaped)

        try:
            elements.append(Paragraph(escaped, style))
        except Exception:
            # Fall back to plain text if XML parse fails
            elements.append(Paragraph(escape_xml(re.sub(r'[*`]', '', line)), style))

        i += 1

    flush_code()
    return elements


def build_pdf():
    print(f'Reading: {MD_FILE}')
    with open(MD_FILE, 'r', encoding='utf-8') as f:
        md_text = f.read()

    styles = make_styles()

    doc = SimpleDocTemplate(
        OUT_FILE,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN,
        title='LOT Badges & Achievements Master Codex v16',
        author='Vadik Marmeladov — LOT Systems',
        subject='RPG & Arcade of Self-Care — Full Badge Registry v16',
        keywords='LOT, badges, achievements, RPG, arcade, self-care, v16',
        creator='LOT Systems Corporation',
    )

    elements = parse_markdown(md_text, styles)

    # Footer spacer
    elements.append(Spacer(1, 10 * mm))
    elements.append(Paragraph(
        'LOT SYSTEMS CORPORATION · Badge Codex v16 · 284 Badges · June 2026',
        styles['footer']
    ))
    elements.append(Paragraph(
        'LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024 · brand.lot-systems.com',
        styles['footer']
    ))

    print(f'Building PDF: {OUT_FILE}')
    doc.build(elements)
    size_kb = os.path.getsize(OUT_FILE) // 1024
    print(f'Done. File size: {size_kb} KB')


if __name__ == '__main__':
    build_pdf()
