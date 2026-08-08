#!/usr/bin/env python3
"""Generate LOT® Computer (COSMO® Cube v1.0) User Manual PDF"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak, Table, TableStyle
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

OUTPUT_PATH = "/home/user/LOT-Computer/docs/corporate/LOT-COSMO-COMPUTER-USER-MANUAL-v1.pdf"

BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#ffffff")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#333333")
GRAY_LIGHT = colors.HexColor("#888888")
GOLD = colors.HexColor("#bb8800")
CYAN = colors.HexColor("#336688")
GREEN = colors.HexColor("#336644")


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
        'h2': ParagraphStyle('LotH2', fontName='Courier-Bold', fontSize=10,
            leading=13, textColor=CYAN, spaceBefore=10, spaceAfter=3),
        'body': ParagraphStyle('LotBody', fontName='Courier', fontSize=9,
            leading=13, textColor=GRAY_DARK, spaceAfter=6, alignment=TA_LEFT),
        'step': ParagraphStyle('LotStep', fontName='Courier-Bold', fontSize=9,
            leading=13, textColor=GREEN, spaceBefore=4, spaceAfter=2),
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
    story.append(Paragraph("COSMO&reg; Cube v1.0 &mdash; Operator's Manual", s['subtitle']))
    story.append(Paragraph("LOT Systems Corporation &middot; brand.lot-systems.com &middot; Made in the USA", s['meta']))
    story.append(divider())

    story.append(Paragraph("WHAT THIS IS", s['h1']))
    story.append(Paragraph(
        "LOT&reg; Computer is a flat, two-piece stainless steel device, 40 x 40 x 5mm, "
        "that receives short notifications from your LOT profile on lot-systems.com and "
        "shows them on its screen &mdash; a pager, not a phone. One camera. One screen. "
        "One button, labeled COPY.", s['body']))

    story.append(Paragraph("IN THE BOX", s['h1']))
    story.append(Paragraph(
        "1 &times; LOT&reg; Computer &middot; 1 &times; wireless charging pad "
        "(flat silver square, 4 x 4cm, USB-C powered) &middot; this manual.", s['body']))

    story.append(Paragraph("SETUP", s['h1']))
    for i, (step, text) in enumerate([
        ("1. CHARGE", "Place the device, rear face down, on the charging pad. The screen shows PAIR ME once powered."),
        ("2. PAIR", "Open lot-systems.com on your phone or laptop, sign in, go to Settings -> Hardware -> Pair Device. Follow the on-screen steps to connect the device to your Wi-Fi and your LOT profile."),
        ("3. PLACE", "Set the device anywhere on a desk, polished face up. It needs no cable once paired &mdash; only occasional time back on the charging pad."),
    ], start=1):
        story.append(Paragraph(step, s['step']))
        story.append(Paragraph(text, s['body']))

    story.append(Paragraph("USING IT", s['h1']))
    story.append(Paragraph(
        "The screen stays off between notifications. When your LOT profile has something "
        "for you &mdash; a reminder, a nudge, a badge unlock &mdash; the device wakes its "
        "screen and shows a short line of text, for example: &ldquo;Coffee time!&rdquo; "
        "It stays lit for a few seconds, then sleeps again on its own.", s['body']))

    story.append(Paragraph("THE COPY BUTTON", s['h1']))
    story.append(Paragraph(
        "One button, rear face, labeled COPY. Press it any time to acknowledge the "
        "notification currently on screen &mdash; the way a two-way radio operator says "
        "&ldquo;copy&rdquo; to mean received, understood. Every COPY press appears in your "
        "Log tab on lot-systems.com within moments, along with a snapshot of that session's "
        "weather reading and, if the camera captured a frame, a note that it did.", s['body']))

    story.append(Paragraph("CHARGING", s['h1']))
    story.append(Paragraph(
        "Wireless only &mdash; there is no port on the device itself. Set it on the pad "
        "when the screen shows a low-battery notice. A full charge from the 150mAh cell "
        "supports several days of normal pager-style use.", s['body']))

    story.append(Paragraph("TROUBLESHOOTING", s['h1']))
    data = [
        ["SYMPTOM", "WHAT TO DO"],
        ["Screen never lights up", "Confirm pairing in Settings -> Hardware. Re-seat on charging pad."],
        ["“PAIR ME” keeps returning", "Wi-Fi credentials may have changed. Re-run pairing (Setup, Step 2)."],
        ["COPY press not in Log tab", "Check the device has a network connection; it will retry automatically."],
        ["Device feels warm on the pad", "Normal during wireless charging. Remove if uncomfortably hot and contact support."],
    ]
    t = Table(data, colWidths=[2.1 * inch, 4.0 * inch])
    t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Courier'),
        ('FONTNAME', (0, 0), (-1, 0), 'Courier-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BACKGROUND', (0, 0), (-1, 0), BLACK),
        ('GRID', (0, 0), (-1, -1), 0.5, GRAY_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    story.append(divider())
    story.append(Paragraph(
        "This device carries no data beyond one compressed session summary per use. "
        "Full technical specification: docs/corporate/LOT-COSMO-COMPUTER-v1.md", s['meta']))
    story.append(Paragraph("LOT Systems Corporation — 2026", s['meta']))

    doc.build(story)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
