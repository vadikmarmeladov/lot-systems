#!/usr/bin/env python3
"""Generate COSMO® Cube Quick Start Guide v1 PDF from its Markdown source."""

import re

from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

MD_PATH = "/home/user/LOT-Computer/docs/hardware/COSMO-CUBE-QUICK-START-v1.md"
OUTPUT_PATH = "/home/user/LOT-Computer/docs/hardware/pdf/COSMO-CUBE-QUICK-START-v1.pdf"

BLACK = colors.HexColor("#000000")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#4d4d4d")
GRAY_LIGHT = colors.HexColor("#888888")
SILVER = colors.HexColor("#9aa0a6")


def build_styles():
    return {
        "title": ParagraphStyle(
            "Title", fontName="Helvetica-Bold", fontSize=18, leading=22,
            textColor=BLACK, alignment=TA_CENTER, spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle", fontName="Helvetica", fontSize=10, leading=13,
            textColor=SILVER, alignment=TA_CENTER, spaceAfter=10,
        ),
        "h1": ParagraphStyle(
            "H1", fontName="Helvetica-Bold", fontSize=12, leading=15,
            textColor=BLACK, spaceBefore=12, spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "Body", fontName="Helvetica", fontSize=9.5, leading=13.5,
            textColor=GRAY_DARK, alignment=TA_LEFT, spaceAfter=4,
        ),
        "li": ParagraphStyle(
            "ListItem", fontName="Helvetica", fontSize=9.5, leading=13.5,
            textColor=GRAY_DARK,
        ),
        "footer": ParagraphStyle(
            "Footer", fontName="Helvetica-Oblique", fontSize=8, leading=11,
            textColor=GRAY_LIGHT, alignment=TA_CENTER, spaceBefore=14,
        ),
    }


def strip_bold(text):
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


def parse_markdown(md_text):
    lines = md_text.splitlines()
    blocks = []
    list_buffer = []
    in_html_comment = False

    def flush_list():
        if list_buffer:
            blocks.append(("list", list(list_buffer)))
            list_buffer.clear()

    for raw in lines:
        line = raw.rstrip()

        if line.strip().startswith("<!--"):
            in_html_comment = True
            continue
        if in_html_comment:
            if "-->" in line:
                in_html_comment = False
            continue

        if not line.strip():
            flush_list()
            continue
        if line.strip() == "---":
            flush_list()
            continue
        if line.startswith("# "):
            flush_list()
            blocks.append(("title", line[2:].strip()))
        elif line.startswith("## "):
            flush_list()
            blocks.append(("h1", line[3:].strip()))
        elif line.strip().startswith(("- ", "1. ", "2. ", "3. ", "4. ")) or re.match(r"^\d+\.\s", line.strip()):
            item = re.sub(r"^(-|\d+\.)\s+", "", line.strip())
            list_buffer.append(item)
        elif line.strip().startswith("**A hardware computer"):
            flush_list()
            blocks.append(("subtitle", line.strip()))
        elif line.strip().startswith("*") and line.strip().endswith("*") and not line.strip().startswith("**"):
            flush_list()
            blocks.append(("footer", line.strip().strip("*")))
        else:
            flush_list()
            blocks.append(("body", line.strip()))

    flush_list()
    return blocks


def build_pdf():
    with open(MD_PATH, "r") as f:
        md_text = f.read()

    blocks = parse_markdown(md_text)
    styles = build_styles()

    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=A5,
        topMargin=16 * mm, bottomMargin=16 * mm,
        leftMargin=14 * mm, rightMargin=14 * mm,
        title="COSMO Cube Quick Start Guide v1",
        author="Vadim Marmeladov / COSMO CIA / LOT Systems, Inc.",
    )

    story = []
    for kind, content in blocks:
        if kind == "title":
            story.append(Paragraph(strip_bold(content), styles["title"]))
        elif kind == "subtitle":
            story.append(Paragraph(strip_bold(content).strip("*"), styles["subtitle"]))
            story.append(HRFlowable(width="100%", thickness=0.6, color=SILVER, spaceAfter=8))
        elif kind == "h1":
            story.append(Paragraph(strip_bold(content), styles["h1"]))
            story.append(HRFlowable(width="30%", thickness=1.2, color=BLACK, spaceAfter=6, hAlign="LEFT"))
        elif kind == "list":
            items = [ListItem(Paragraph(strip_bold(i), styles["li"]), leftIndent=6) for i in content]
            story.append(ListFlowable(items, bulletType="bullet", start="circle", leftIndent=10, spaceAfter=6))
        elif kind == "footer":
            story.append(Spacer(1, 4))
            story.append(Paragraph(strip_bold(content), styles["footer"]))
        else:
            story.append(Paragraph(strip_bold(content), styles["body"]))

    doc.build(story)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
