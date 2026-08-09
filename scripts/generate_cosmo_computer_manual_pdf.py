#!/usr/bin/env python3
"""Generate the COSMO Computer Operator Manual PDF — v1.0 pilot run."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Preformatted, HRFlowable,
    PageBreak, Table, TableStyle
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

OUTPUT_PATH = "/home/user/LOT-Computer/docs/corporate/COSMO_COMPUTER_MANUAL.pdf"

BLACK = colors.HexColor("#0a0a0a")
WHITE = colors.HexColor("#ffffff")
SILVER = colors.HexColor("#c0c0c8")
SILVER_DARK = colors.HexColor("#8a8a92")
GRAY_DARK = colors.HexColor("#1a1a1a")
GRAY_MID = colors.HexColor("#444444")
GRAY_LIGHT = colors.HexColor("#888888")
HAIRLINE = colors.HexColor("#cccccc")

PAGE_W, PAGE_H = letter


def styles():
    return {
        'cover_kicker': ParagraphStyle('CoverKicker', fontName='Courier', fontSize=9,
            leading=12, textColor=SILVER_DARK, alignment=TA_CENTER, spaceAfter=10),
        'cover_title': ParagraphStyle('CoverTitle', fontName='Courier-Bold', fontSize=22,
            leading=27, textColor=WHITE, backColor=BLACK, alignment=TA_CENTER,
            spaceAfter=8, spaceBefore=6),
        'cover_sub': ParagraphStyle('CoverSub', fontName='Courier-Bold', fontSize=12,
            leading=16, textColor=SILVER, alignment=TA_CENTER, spaceAfter=4),
        'cover_meta': ParagraphStyle('CoverMeta', fontName='Courier', fontSize=8,
            leading=12, textColor=GRAY_LIGHT, alignment=TA_CENTER, spaceAfter=2),
        'h1': ParagraphStyle('H1', fontName='Courier-Bold', fontSize=13,
            leading=16, textColor=BLACK, spaceBefore=16, spaceAfter=6),
        'h2': ParagraphStyle('H2', fontName='Courier-Bold', fontSize=10,
            leading=13, textColor=GRAY_MID, spaceBefore=10, spaceAfter=4),
        'body': ParagraphStyle('Body', fontName='Courier', fontSize=9,
            leading=13, textColor=GRAY_DARK, spaceAfter=6),
        'step': ParagraphStyle('Step', fontName='Courier', fontSize=9,
            leading=13, textColor=GRAY_DARK, spaceAfter=4, leftIndent=14),
        'meta': ParagraphStyle('Meta', fontName='Courier', fontSize=7,
            leading=10, textColor=GRAY_LIGHT, alignment=TA_CENTER),
        'footer': ParagraphStyle('Footer', fontName='Courier', fontSize=7,
            leading=9, textColor=GRAY_LIGHT, alignment=TA_CENTER),
    }


def hr(color=HAIRLINE, thickness=0.6, space=8):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                       spaceBefore=space, spaceAfter=space)


def diagram_block(text, s):
    return Preformatted(text, ParagraphStyle('Diagram', fontName='Courier',
        fontSize=8, leading=10.5, textColor=GRAY_DARK,
        backColor=colors.HexColor("#f4f4f6"), borderColor=HAIRLINE,
        borderWidth=0.5, spaceBefore=6, spaceAfter=10, leftIndent=8,
        rightIndent=8, borderPadding=8))


DEVICE_DIAGRAM = """\
        FACE A (mirror)          FACE B (compute)
      +----------------+       +----------------+
      |                |       |  [camera]      |
      |   polished     |  <->  |  [ screen ]    |
      |   stainless    | 5mm   |     (o) button |
      |    steel       |       |                |
      +----------------+       +----------------+
           40 x 40 mm               40 x 40 mm
"""

SETUP_DIAGRAM = """\
  1. Face A down on charge pad     2. Settings > Pair COSMO Computer
     +----------------+               ______________________
     |################|              | Pairing code: 4 8 1 2 |
     +----------------+ <- charging   |______________________|
       (( charge pad ))

  3. Enter code shown on device      4. Paired. Pager messages begin.
     screen into the site form          "Coffee time!" (example)
"""

BUTTON_DIAGRAM = """\
   SHORT PRESS  (< 1.5s)              LONG PRESS  (>= 1.5s)
   -----------------------            -----------------------
   -> COPY                            -> CAMERA (presence check)
      writes current message             single still frame,
      to your Log tab as                 device-local only unless
      HWCOPY: <text> <timestamp>         "attach to log" is ON
"""


def build():
    doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=letter,
        topMargin=0.85*inch, bottomMargin=0.75*inch,
        leftMargin=0.9*inch, rightMargin=0.9*inch,
        title="COSMO Computer — Operator Manual",
        author="LOT Systems Corporation")
    S = styles()
    story = []

    # ---- COVER ----
    story.append(Spacer(1, 1.6*inch))
    story.append(Paragraph("LOT SYSTEMS CORPORATION", S['cover_kicker']))
    story.append(hr(color=SILVER_DARK, thickness=0.8, space=14))
    story.append(Paragraph("COSMO&reg; COMPUTER", S['cover_title']))
    story.append(Paragraph("OPERATOR MANUAL", S['cover_title']))
    story.append(Spacer(1, 6))
    story.append(Paragraph("v1.0 &mdash; PILOT RUN &middot; 100 UNITS", S['cover_sub']))
    story.append(hr(color=SILVER_DARK, thickness=0.8, space=14))
    story.append(Spacer(1, 0.3*inch))
    story.append(diagram_block(DEVICE_DIAGRAM, S))
    story.append(Spacer(1, 0.6*inch))
    story.append(Paragraph("MADE IN THE USA", S['cover_meta']))
    story.append(Paragraph("brand.lot-systems.com &middot; lot-systems.com", S['cover_meta']))
    story.append(Paragraph("Prepared August 9, 2026 &middot; Document: COSMO_COMPUTER_MANUAL", S['cover_meta']))
    story.append(PageBreak())

    # ---- WHAT IT IS ----
    story.append(Paragraph("01 // WHAT IT IS", S['h1']))
    story.append(hr())
    story.append(Paragraph(
        "COSMO Computer is a 40mm &times; 40mm &times; 5mm dual-face desk object. "
        "One face is polished mirror-finish stainless steel &mdash; the object at rest, "
        "no markings, no display. The other face carries a camera, a screen, and a "
        "single button. The screen shows short, AI-driven notifications &mdash; a pager, "
        "not a chat client &mdash; sent from lot-systems.com. The example line used "
        "throughout LOT&reg; product material is &ldquo;Coffee time!&rdquo; A single button lets "
        "you Copy the message currently on screen into your Log tab on the site.",
        S['body']))
    story.append(Spacer(1, 4))
    story.append(diagram_block(DEVICE_DIAGRAM, S))

    story.append(Paragraph("02 // BOX CONTENTS", S['h1']))
    story.append(hr())
    contents = Table([
        ["1", "COSMO Computer device"],
        ["2", "Wireless charging pad"],
        ["3", "Quick-start card"],
    ], colWidths=[0.35*inch, 4.5*inch])
    contents.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Courier'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), GRAY_DARK),
        ('LINEBELOW', (0, 0), (-1, -1), 0.4, HAIRLINE),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(contents)
    story.append(PageBreak())

    # ---- SETUP ----
    story.append(Paragraph("03 // SETUP", S['h1']))
    story.append(hr())
    story.append(Paragraph("1. Place the device Face A (mirror side) down on the charging pad.", S['step']))
    story.append(Paragraph("2. On lot-systems.com, go to Settings &rarr; Pair a COSMO Computer.", S['step']))
    story.append(Paragraph("3. Enter the 6-digit pairing code shown on the device screen.", S['step']))
    story.append(Paragraph("4. The device is paired and begins receiving pager messages.", S['step']))
    story.append(Spacer(1, 4))
    story.append(diagram_block(SETUP_DIAGRAM, S))
    story.append(Paragraph(
        "The pairing code expires after 10 minutes. If it expires before you finish, "
        "reopen the pairing panel on the site to generate a new one.", S['body']))

    # ---- BUTTON ----
    story.append(Paragraph("04 // USING THE BUTTON", S['h1']))
    story.append(hr())
    story.append(diagram_block(BUTTON_DIAGRAM, S))
    story.append(Paragraph(
        "<b>Short press &mdash; Copy.</b> Writes the message currently on screen into your "
        "Log tab as a new HWCOPY: entry, alongside the other log handlers already on "
        "lot-systems.com.", S['body']))
    story.append(Paragraph(
        "<b>Long press (1.5 seconds or more) &mdash; Camera.</b> Captures a single still "
        "frame, used on-device for a presence check only. The frame is never transmitted "
        "unless you have explicitly turned on &ldquo;Attach photos to log&rdquo; in Settings. "
        "This setting is OFF by default.", S['body']))
    story.append(PageBreak())

    # ---- CHARGING ----
    story.append(Paragraph("05 // CHARGING", S['h1']))
    story.append(hr())
    story.append(Paragraph(
        "COSMO Computer charges wirelessly (Qi-class induction) through the mirror "
        "(Face A) side. Set the device mirror-down on the included charging pad; "
        "Face B stays face-up and legible while charging. The internal battery is "
        "intentionally small &mdash; the device is designed to live on or near its "
        "charging pad rather than run for long stretches unplugged.", S['body']))

    # ---- CARE ----
    story.append(Paragraph("06 // CARE", S['h1']))
    story.append(hr())
    story.append(Paragraph(
        "The Face A mirror finish shows fingerprints readily by design &mdash; it is a "
        "polished surface, not a coated one. Wipe with a soft, dry or lightly damp "
        "cloth. Avoid abrasive cleaners, abrasive cloths, and solvents, which will dull "
        "the polish.", S['body']))

    # ---- SAFETY & PRIVACY ----
    story.append(Paragraph("07 // SAFETY &amp; PRIVACY", S['h1']))
    story.append(hr())
    story.append(Paragraph(
        "The camera is powered off at all times outside of an explicit long-press "
        "capture. There is no continuous recording mode and no local video buffer. "
        "Captured frames are not transmitted from the device unless the "
        "&ldquo;Attach photos to log&rdquo; setting is on, and that setting defaults to off. "
        "Your data is never sold to third parties.", S['body']))
    story.append(Spacer(1, 10))

    # ---- SUPPORT ----
    story.append(Paragraph("08 // SUPPORT", S['h1']))
    story.append(hr())
    story.append(Paragraph(
        "lot-systems.com &middot; brand.lot-systems.com", S['body']))
    story.append(Spacer(1, 30))
    story.append(hr(color=SILVER_DARK))
    story.append(Paragraph(
        "COSMO&reg; and LOT&reg; are marks of LOT Systems, Inc. &middot; Document COSMO_COMPUTER_MANUAL v1.0",
        S['footer']))

    doc.build(story)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
