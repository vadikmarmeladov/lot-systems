#!/usr/bin/env python3
"""Generate PDF manuals for the COSMO Computer document set — Terminal Grid style."""

import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Preformatted, PageBreak, Spacer
from reportlab.lib.enums import TA_CENTER

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_LIGHT = colors.HexColor("#888888")

PRE_STYLE = ParagraphStyle(
    "Pre", fontName="Courier", fontSize=7.2, leading=9.2, textColor=GRAY_DARK,
)

TITLE_STYLE = ParagraphStyle(
    "LotTitle", fontName="Courier-Bold", fontSize=13, leading=17,
    textColor=WHITE, backColor=BLACK, spaceAfter=10, alignment=TA_CENTER,
)

FOOTER_STYLE = ParagraphStyle(
    "LotFooter", fontName="Courier", fontSize=7, leading=9,
    textColor=GRAY_LIGHT, alignment=TA_CENTER,
)


def build_pdf(md_path, pdf_path, title):
    with open(md_path, "r", encoding="utf-8") as f:
        text = f.read()

    doc = SimpleDocTemplate(
        pdf_path, pagesize=letter,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        topMargin=0.6 * inch, bottomMargin=0.6 * inch,
        title=title,
    )

    story = []
    story.append(Spacer(1, 0.1 * inch))

    # Split into blocks on blank lines so the flowable engine can paginate
    # between blocks rather than mid-paragraph.
    blocks = text.split("\n\n")
    for block in blocks:
        block = block.rstrip("\n")
        if not block.strip():
            continue
        story.append(Preformatted(block, PRE_STYLE))
        story.append(Spacer(1, 0.06 * inch))

    def draw_footer(canvas, doc_):
        canvas.saveState()
        canvas.setFont("Courier", 7)
        canvas.setFillColor(GRAY_LIGHT)
        canvas.drawCentredString(
            letter[0] / 2, 0.35 * inch,
            f"LOT SYSTEMS CORPORATION — RESTRICTED // S-2 EYES — page {doc_.page}",
        )
        canvas.restoreState()

    doc.build(story, onFirstPage=draw_footer, onLaterPages=draw_footer)
    print(f"Wrote {pdf_path}")


if __name__ == "__main__":
    jobs = [
        (
            "/home/user/LOT-Computer/docs/corporate/LOT-COSMO-COMPUTER-v1.md",
            "/home/user/LOT-Computer/docs/corporate/LOT-COSMO-COMPUTER-v1.pdf",
            "COSMO Computer v1.0 — Plan & Roadmap",
        ),
        (
            "/home/user/LOT-Computer/docs/corporate/LOT-COSMO-COMPUTER-BOM-v1.md",
            "/home/user/LOT-Computer/docs/corporate/LOT-COSMO-COMPUTER-BOM-v1.pdf",
            "COSMO Computer v1.0 — BOM & Buying List",
        ),
        (
            "/home/user/LOT-Computer/docs/technical/LOT-COSMO-COMPUTER-FIRMWARE-v1.md",
            "/home/user/LOT-Computer/docs/technical/LOT-COSMO-COMPUTER-FIRMWARE-v1.pdf",
            "COSMO Computer v1.0 — Firmware Specification",
        ),
        (
            "/home/user/LOT-Computer/docs/technical/LOT-COSMO-COMPUTER-SOFTWARE-v1.md",
            "/home/user/LOT-Computer/docs/technical/LOT-COSMO-COMPUTER-SOFTWARE-v1.pdf",
            "COSMO Computer v1.0 — Software / LOT API Connector",
        ),
    ]
    for md_path, pdf_path, title in jobs:
        build_pdf(md_path, pdf_path, title)
