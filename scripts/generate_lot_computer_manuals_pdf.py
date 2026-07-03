#!/usr/bin/env python3
"""Generate LOT Computer PDF manuals (user / firmware / software) from markdown sources.

Terminal Grid style, consistent with scripts/generate_badge_pdf_v19.py.
"""

import os
import re

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
GOLD = colors.HexColor("#bb8800")
CYAN = colors.HexColor("#336688")

DOCS = os.path.join(os.path.dirname(__file__), "..", "docs")
OUT_DIR = os.path.join(DOCS, "technical", "pdf")


def build_styles():
    title = ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=16,
        leading=20, textColor=WHITE, backColor=BLACK, spaceAfter=6, alignment=TA_CENTER)
    subtitle = ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
        leading=12, textColor=GRAY_MID, spaceAfter=3, alignment=TA_CENTER)
    h1 = ParagraphStyle('LotH1', fontName='Courier-Bold', fontSize=13,
        leading=16, textColor=GOLD, spaceBefore=14, spaceAfter=6)
    h2 = ParagraphStyle('LotH2', fontName='Courier-Bold', fontSize=10,
        leading=13, textColor=CYAN, spaceBefore=10, spaceAfter=3)
    body = ParagraphStyle('LotBody', fontName='Courier', fontSize=8.3,
        leading=11.5, textColor=GRAY_DARK, spaceAfter=5)
    code = ParagraphStyle('LotCode', fontName='Courier', fontSize=7.3,
        leading=9.5, textColor=GRAY_DARK, backColor=colors.HexColor("#f2f2f2"))
    return dict(title=title, subtitle=subtitle, h1=h1, h2=h2, body=body, code=code)


def esc(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def inline_md(text):
    text = esc(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`(.+?)`', r'<font face="Courier-Bold">\1</font>', text)
    return text


def md_to_flowables(md_text, styles, title, subtitle):
    flow = []
    flow.append(Paragraph(esc(title), styles['title']))
    flow.append(Paragraph(esc(subtitle), styles['subtitle']))
    flow.append(HRFlowable(width="100%", thickness=1, color=BLACK, spaceAfter=10))

    lines = md_text.splitlines()
    in_code = False
    code_buf = []
    i = 0
    # skip HTML comment header block and the first H1 (already rendered as title)
    skipped_h1 = False
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('<!--'):
            while i < len(lines) and '-->' not in lines[i]:
                i += 1
            i += 1
            continue
        if line.strip().startswith('```'):
            if not in_code:
                in_code = True
                code_buf = []
            else:
                in_code = False
                flow.append(Preformatted('\n'.join(code_buf), styles['code']))
                flow.append(Spacer(1, 6))
            i += 1
            continue
        if in_code:
            code_buf.append(line.rstrip())
            i += 1
            continue
        if line.strip() == '---' or set(line.strip()) == {'='} or set(line.strip()) == {'-'}:
            i += 1
            continue
        if line.startswith('# '):
            if not skipped_h1:
                skipped_h1 = True
                i += 1
                continue
            flow.append(Paragraph(inline_md(line[2:].strip()), styles['h1']))
            i += 1
            continue
        if line.startswith('## ') or line.startswith('### '):
            text = line.lstrip('#').strip()
            flow.append(Paragraph(inline_md(text), styles['h2']))
            i += 1
            continue
        if line.strip() == '':
            i += 1
            continue
        if line.strip().startswith('|'):
            # render table rows as monospace preformatted block
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i])
                i += 1
            flow.append(Preformatted('\n'.join(table_lines), styles['code']))
            flow.append(Spacer(1, 6))
            continue
        # regular paragraph line (bullets, prose)
        flow.append(Paragraph(inline_md(line), styles['body']))
        i += 1

    return flow


def render(md_path, pdf_path, title, subtitle):
    with open(md_path, 'r') as f:
        md_text = f.read()
    styles = build_styles()
    flow = md_to_flowables(md_text, styles, title, subtitle)
    doc = SimpleDocTemplate(
        pdf_path, pagesize=letter,
        topMargin=0.6 * inch, bottomMargin=0.6 * inch,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
    )
    doc.build(flow)
    print(f"Wrote {pdf_path}")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    render(
        os.path.join(DOCS, "corporate", "LOT-COMPUTER-VISION.md"),
        os.path.join(OUT_DIR, "LOT-COMPUTER-USER-MANUAL.pdf"),
        "LOT (R) COMPUTER",
        "USER MANUAL -- v1.0 -- 3 July 2026 -- brand.lot-systems.com",
    )
    render(
        os.path.join(DOCS, "technical", "LOT-COMPUTER-FIRMWARE.md"),
        os.path.join(OUT_DIR, "LOT-COMPUTER-FIRMWARE-MANUAL.pdf"),
        "LOT (R) COMPUTER",
        "FIRMWARE MANUAL -- INTERNAL / BUILD -- 3 July 2026",
    )
    render(
        os.path.join(DOCS, "technical", "LOT-COMPUTER-SOFTWARE-BRIDGE.md"),
        os.path.join(OUT_DIR, "LOT-COMPUTER-SOFTWARE-API-MANUAL.pdf"),
        "LOT (R) COMPUTER",
        "SOFTWARE / API CONNECTOR MANUAL -- 3 July 2026",
    )
    render(
        os.path.join(DOCS, "technical", "LOT-COMPUTER-RIG-SPEC.md"),
        os.path.join(OUT_DIR, "LOT-COMPUTER-RIG-SPEC.pdf"),
        "LOT (R) COMPUTER",
        "HARDWARE RIG SPEC + BOM -- 3 July 2026",
    )
    render(
        os.path.join(DOCS, "technical", "LOT-COMPUTER-ROADMAP.md"),
        os.path.join(OUT_DIR, "LOT-COMPUTER-ROADMAP.pdf"),
        "LOT (R) COMPUTER",
        "ROADMAP + RISK REGISTER -- 3 July 2026",
    )


if __name__ == "__main__":
    main()
