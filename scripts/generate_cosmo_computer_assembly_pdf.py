#!/usr/bin/env python3
"""Generate LOT® Computer (COSMO® Cube v1.0) Assembly & QC Manual PDF (production-facing)"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

OUTPUT_PATH = "/home/user/LOT-Computer/docs/corporate/LOT-COSMO-COMPUTER-ASSEMBLY-MANUAL-v1.pdf"

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
GOLD = colors.HexColor("#bb8800")
CYAN = colors.HexColor("#336688")


def build_styles():
    return {
        'title': ParagraphStyle('LotTitle', fontName='Courier-Bold', fontSize=18,
            leading=22, textColor=WHITE, backColor=BLACK, spaceAfter=6, alignment=TA_CENTER),
        'subtitle': ParagraphStyle('LotSubtitle', fontName='Courier', fontSize=9,
            leading=12, textColor=GRAY_MID, spaceAfter=3, alignment=TA_CENTER),
        'meta': ParagraphStyle('LotMeta', fontName='Courier', fontSize=7,
            leading=9, textColor=GRAY_LIGHT, spaceAfter=2, alignment=TA_CENTER),
        'h1': ParagraphStyle('LotH1', fontName='Courier-Bold', fontSize=13,
            leading=16, textColor=GOLD, spaceBefore=16, spaceAfter=6),
        'body': ParagraphStyle('LotBody', fontName='Courier', fontSize=9,
            leading=13, textColor=GRAY_DARK, spaceAfter=6, alignment=TA_LEFT),
    }


def divider():
    return HRFlowable(width="100%", thickness=1, color=GRAY_LIGHT, spaceBefore=6, spaceAfter=10)


def build():
    doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=letter,
        topMargin=0.7 * inch, bottomMargin=0.7 * inch,
        leftMargin=0.8 * inch, rightMargin=0.8 * inch)
    s = build_styles()
    story = []

    story.append(Paragraph("LOT&reg; COMPUTER", s['title']))
    story.append(Paragraph("COSMO&reg; Cube v1.0 &mdash; Assembly &amp; QC Manual", s['subtitle']))
    story.append(Paragraph("CLASSIFICATION: RESTRICTED // S-2 EYES &middot; PRODUCTION-FACING", s['meta']))
    story.append(divider())

    story.append(Paragraph("SCOPE", s['h1']))
    story.append(Paragraph(
        "This manual covers final assembly and QC for the 100-unit pilot run. "
        "PCB fabrication and SMT placement are performed by PCBWay per "
        "docs/corporate/LOT-COSMO-COMPUTER-BOM.md Section 02; this manual begins "
        "at receipt of populated boards.", s['body']))

    story.append(Paragraph("ENCLOSURE ASSEMBLY", s['h1']))
    story.append(Paragraph(
        "1. Seat the populated PCB into the front shell (polished face), display and "
        "camera windows aligned to their cutouts.<br/>"
        "2. Place the 150mAh LiPo cell in its pocket, connector routed clear of the "
        "wireless charge coil.<br/>"
        "3. Align the wireless charge coil into the rear shell (matte face) pocket.<br/>"
        "4. Mate front and rear shells. Install 4 &times; M1.4 recessed screws into the "
        "threaded standoffs.<br/>"
        "5. Torque to 0.05 N&middot;m. Do not overtorque &mdash; stainless standoffs at "
        "this size strip above 0.08 N&middot;m.", s['body']))

    story.append(Paragraph("100-UNIT QC CHECKLIST", s['h1']))
    data = [
        ["#", "CHECK", "PASS CRITERIA"],
        ["1", "Battery voltage at receipt", "3.7V nominal, 3.4-4.2V acceptable range"],
        ["2", "Enclosure seam gap", "No visible gap, screws fully seated"],
        ["3", "Wireless charge handshake", "Device wakes and reports charging within 5s of pad contact"],
        ["4", "Wi-Fi + SSE handshake", "Device reaches SSE STANDBY state (firmware doc Sec. 3) within 30s of boot"],
        ["5", "Pairing flow", "SoftAP visible, completes test pairing to a staging LOT profile"],
        ["6", "Display render", "Test string renders legibly, no dead pixels/segments"],
        ["7", "Camera capture", "One test frame captured and received server-side on COPY press"],
        ["8", "Weather sensor read", "Temperature/humidity reading within 2 degrees C / 5% RH of reference"],
        ["9", "Button continuity + debounce", "Single press registers exactly one COPY event"],
        ["10", "Laser serial legible + logged", "Serial matches hardware_devices record (software doc Sec. 6)"],
    ]
    t = Table(data, colWidths=[0.35 * inch, 2.15 * inch, 3.6 * inch])
    t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Courier'),
        ('FONTNAME', (0, 0), (-1, 0), 'Courier-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BACKGROUND', (0, 0), (-1, 0), BLACK),
        ('GRID', (0, 0), (-1, -1), 0.5, GRAY_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    story.append(Paragraph("DISPOSITION", s['h1']))
    story.append(Paragraph(
        "A unit failing any check above is set aside, not reworked into the shipping "
        "batch without a second full pass of all 10 checks. Pass rate below 95/100 "
        "halts the run and reopens LOT-COSMO-COMPUTER-BOM.md Section 01 for a "
        "component-level review before continuing.", s['body']))

    story.append(divider())
    story.append(Paragraph(
        "Full technical specification: docs/corporate/LOT-COSMO-COMPUTER-v1.md &middot; "
        "Firmware: docs/technical/LOT-COSMO-COMPUTER-FIRMWARE.md &middot; "
        "Software: docs/technical/LOT-COSMO-COMPUTER-SOFTWARE.md", s['meta']))
    story.append(Paragraph("LOT Systems Corporation — 2026", s['meta']))

    doc.build(story)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
