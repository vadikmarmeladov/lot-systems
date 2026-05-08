#!/usr/bin/env python3
"""
LOT Systems — Badges & Achievements PDF Generator
RPG / Arcade / Sci-Fi Book aesthetic, terminal-style.
"""

import base64
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Palette ──────────────────────────────────────────────────────────────────
BG        = HexColor('#0a0a0a')   # near-black
PANEL     = HexColor('#111111')   # slightly lighter
BORDER    = HexColor('#1e1e1e')   # border / grid
GREEN     = HexColor('#00ff88')   # primary accent — terminal green
CYAN      = HexColor('#00ccff')   # secondary accent
AMBER     = HexColor('#ffcc00')   # level badges
PURPLE    = HexColor('#cc44ff')   # rare/epic
RED       = HexColor('#ff4444')   # warnings/legendary
MUTED     = HexColor('#555555')   # dimmed text
DIM       = HexColor('#333333')   # even dimmer
TEXT      = HexColor('#dddddd')   # body text
SUBTEXT   = HexColor('#888888')   # sub-body text
WHITE     = HexColor('#ffffff')
PAGE_W, PAGE_H = A4  # 595.28 x 841.89

OUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'docs',
                        'LOT-Badges-Achievements-Guide.pdf')

# ── Canvas helpers ────────────────────────────────────────────────────────────
def draw_bg(c, w=PAGE_W, h=PAGE_H):
    c.setFillColor(BG)
    c.rect(0, 0, w, h, fill=1, stroke=0)

def draw_scanlines(c, w=PAGE_W, h=PAGE_H, opacity=0.03):
    c.saveState()
    c.setStrokeColor(HexColor('#ffffff'))
    c.setLineWidth(0.3)
    c.setStrokeAlpha(opacity)
    y = 0
    while y < h:
        c.line(0, y, w, y)
        y += 4
    c.restoreState()

def draw_corner_brackets(c, x, y, w, h, color=GREEN, size=8):
    c.setStrokeColor(color)
    c.setLineWidth(1)
    # TL
    c.line(x, y+h, x+size, y+h)
    c.line(x, y+h, x, y+h-size)
    # TR
    c.line(x+w-size, y+h, x+w, y+h)
    c.line(x+w, y+h, x+w, y+h-size)
    # BL
    c.line(x, y+size, x, y)
    c.line(x, y, x+size, y)
    # BR
    c.line(x+w-size, y, x+w, y)
    c.line(x+w, y, x+w, y+size)

def mono(size, color=TEXT, bold=False):
    return ParagraphStyle(
        'mono',
        fontName='Courier-Bold' if bold else 'Courier',
        fontSize=size,
        textColor=color,
        leading=size * 1.5,
        spaceAfter=0,
        spaceBefore=0,
    )

def centered(size, color=TEXT, bold=False):
    s = mono(size, color, bold)
    s.alignment = TA_CENTER
    return s

def right_aligned(size, color=TEXT, bold=False):
    s = mono(size, color, bold)
    s.alignment = TA_RIGHT
    return s

# ── Page builder ──────────────────────────────────────────────────────────────
class LotPDF:
    def __init__(self, path):
        self.path = path
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle("LOT Systems — Badges & Achievements Guide")
        self.c.setAuthor("LOT Systems")
        self.c.setSubject("RPG Self-Care Achievement System")
        self.page = 0

    def new_page(self):
        if self.page > 0:
            self.c.showPage()
        self.page += 1
        draw_bg(self.c)
        draw_scanlines(self.c)
        self._draw_footer()

    def _draw_footer(self):
        c = self.c
        c.setFont('Courier', 6)
        c.setFillColor(MUTED)
        footer = f"LOT Systems  ·  lot-systems.com  ·  v2026  ·  page {self.page}"
        c.drawCentredString(PAGE_W/2, 10*mm, footer)
        c.setStrokeColor(DIM)
        c.setLineWidth(0.5)
        c.line(20*mm, 14*mm, PAGE_W-20*mm, 14*mm)

    def text(self, x, y, s, font='Courier', size=9, color=TEXT, align='left'):
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        if align == 'center':
            self.c.drawCentredString(x, y, s)
        elif align == 'right':
            self.c.drawRightString(x, y, s)
        else:
            self.c.drawString(x, y, s)

    def hline(self, y, x1=20*mm, x2=None, color=BORDER, width=0.5):
        if x2 is None:
            x2 = PAGE_W - 20*mm
        self.c.setStrokeColor(color)
        self.c.setLineWidth(width)
        self.c.line(x1, y, x2, y)

    def panel(self, x, y, w, h, fill=PANEL, border=BORDER, radius=2):
        self.c.setFillColor(fill)
        self.c.setStrokeColor(border)
        self.c.setLineWidth(0.5)
        self.c.roundRect(x, y, w, h, radius, fill=1, stroke=1)

    def badge_box(self, x, y, w, h, symbol, name, desc, unlock_msg,
                  symbol_color=GREEN, tier_color=GREEN):
        self.panel(x, y, w, h, fill=HexColor('#0d1a0d'), border=tier_color)
        draw_corner_brackets(self.c, x, y, w, h, color=tier_color, size=5)
        cx = x + w/2
        # Symbol
        self.c.setFont('Courier-Bold', 18)
        self.c.setFillColor(symbol_color)
        self.c.drawCentredString(cx, y + h - 14*mm, symbol)
        # Name
        self.c.setFont('Courier-Bold', 7)
        self.c.setFillColor(WHITE)
        self.c.drawCentredString(cx, y + h - 20*mm, name.upper())
        # Desc
        self.c.setFont('Courier', 6)
        self.c.setFillColor(SUBTEXT)
        # Wrap desc
        words = desc.split()
        line = ''
        lines = []
        for w2 in words:
            test = (line + ' ' + w2).strip()
            if self.c.stringWidth(test, 'Courier', 6) < w - 6*mm:
                line = test
            else:
                if line:
                    lines.append(line)
                line = w2
        if line:
            lines.append(line)
        ty = y + h - 26*mm
        for l in lines[:3]:
            self.c.drawCentredString(cx, ty, l)
            ty -= 3.5*mm
        # Unlock msg
        self.c.setFont('Courier-Oblique', 5.5)
        self.c.setFillColor(tier_color)
        self.c.drawCentredString(cx, y + 4*mm, unlock_msg)

    def achievement_row(self, x, y, w, id_, title, desc, rarity, color):
        rarity_colors = {
            'common':    HexColor('#44aa44'),
            'uncommon':  CYAN,
            'rare':      AMBER,
            'epic':      PURPLE,
            'legendary': RED,
        }
        rc = rarity_colors.get(rarity, GREEN)
        self.panel(x, y, w, 10*mm, fill=HexColor('#0d0d14'), border=DIM)
        # Rarity bar
        self.c.setFillColor(rc)
        self.c.rect(x, y, 2*mm, 10*mm, fill=1, stroke=0)
        # Title
        self.c.setFont('Courier-Bold', 7.5)
        self.c.setFillColor(WHITE)
        self.c.drawString(x + 5*mm, y + 6.5*mm, title)
        # ID
        self.c.setFont('Courier', 6)
        self.c.setFillColor(MUTED)
        self.c.drawString(x + 5*mm, y + 3*mm, f"[{id_}]")
        # Rarity label
        self.c.setFont('Courier-Bold', 6)
        self.c.setFillColor(rc)
        self.c.drawRightString(x + w - 3*mm, y + 6*mm, rarity.upper())
        # Desc
        self.c.setFont('Courier', 6)
        self.c.setFillColor(SUBTEXT)
        self.c.drawRightString(x + w - 3*mm, y + 2.5*mm, desc[:55])

    def save(self):
        self.c.save()
        print(f"  PDF saved → {self.path}")


# ── Utilities ─────────────────────────────────────────────────────────────────
def glitch_title(pdf, x, y, text, size=24, color=GREEN, shadow=RED):
    """Chromatic aberration / glitch effect for titles."""
    pdf.c.setFont('Courier-Bold', size)
    pdf.c.setFillColor(HexColor('#ff000022'))
    pdf.c.drawString(x - 1, y + 1, text)
    pdf.c.setFillColor(HexColor('#0000ff22'))
    pdf.c.drawString(x + 1, y - 1, text)
    pdf.c.setFillColor(color)
    pdf.c.drawString(x, y, text)


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 1 — COVER
# ─────────────────────────────────────────────────────────────────────────────
def page_cover(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    # Big glowing border
    c.setStrokeColor(GREEN)
    c.setLineWidth(1)
    c.roundRect(mx, 20*mm, PAGE_W - 2*mx, PAGE_H - 40*mm, 3, fill=0, stroke=1)
    c.setStrokeColor(HexColor('#00ff8833'))
    c.setLineWidth(3)
    c.roundRect(mx - 2, 20*mm - 2, PAGE_W - 2*mx + 4, PAGE_H - 40*mm + 4,
                5, fill=0, stroke=1)

    # Scanline overlay on panel
    c.setFillColor(HexColor('#00ff8806'))
    for i in range(60):
        c.rect(mx, 20*mm + i*14, PAGE_W - 2*mx, 7, fill=1, stroke=0)

    # ASCII art logo block
    logo_lines = [
        "  ██╗      ██████╗ ████████╗",
        "  ██║     ██╔═══██╗╚══██╔══╝",
        "  ██║     ██║   ██║   ██║   ",
        "  ██║     ██║   ██║   ██║   ",
        "  ███████╗╚██████╔╝   ██║   ",
        "  ╚══════╝ ╚═════╝    ╚═╝   ",
    ]
    c.setFont('Courier', 9)
    c.setFillColor(GREEN)
    ly = PAGE_H - 60*mm
    for line in logo_lines:
        c.drawCentredString(PAGE_W/2, ly, line)
        ly -= 5.5*mm

    # Subtitle bar
    c.setFillColor(HexColor('#00ff8820'))
    c.rect(mx + 10*mm, PAGE_H - 120*mm, PAGE_W - 2*mx - 20*mm, 8*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 8)
    c.setFillColor(CYAN)
    c.drawCentredString(PAGE_W/2, PAGE_H - 116*mm,
                        "Q U A N T U M   I N T E N T   E N G I N E   †")

    # Title
    glitch_title(pdf, PAGE_W/2 - 60*mm, PAGE_H - 145*mm,
                 "BADGES &", 28, GREEN)
    glitch_title(pdf, PAGE_W/2 - 73*mm, PAGE_H - 165*mm,
                 "ACHIEVEMENTS", 28, GREEN)

    # Tagline
    c.setFont('Courier', 9)
    c.setFillColor(AMBER)
    c.drawCentredString(PAGE_W/2, PAGE_H - 178*mm,
                        "RPG · ARCADE · SCI-FI SELF-CARE OS")

    # Separator
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.5)
    c.line(mx + 20*mm, PAGE_H - 185*mm, PAGE_W - mx - 20*mm, PAGE_H - 185*mm)

    # Ascii badge showcase
    showcase = [
        ("○∿", "WAVE", GREEN),
        ("○≈○", "TIDE", CYAN),
        ("≋○≋", "OCEAN", AMBER),
        ("∿—∿", "BALANCE", HexColor('#88ff88')),
        ("≈○≈", "FLOW", CYAN),
        ("—○—", "STEADY", AMBER),
        ("○◐○", "DEPTH", PURPLE),
        ("○∴○", "QUEST", RED),
    ]
    bw = (PAGE_W - 2*mx - 10*mm) / 8
    bx = mx + 5*mm
    by = PAGE_H - 220*mm
    for sym, lbl, col in showcase:
        c.setFillColor(HexColor('#0d1a0d'))
        c.roundRect(bx, by, bw - 2, 18*mm, 2, fill=1, stroke=0)
        c.setStrokeColor(col)
        c.setLineWidth(0.5)
        c.roundRect(bx, by, bw - 2, 18*mm, 2, fill=0, stroke=1)
        c.setFont('Courier-Bold', 12)
        c.setFillColor(col)
        c.drawCentredString(bx + (bw-2)/2, by + 11*mm, sym)
        c.setFont('Courier', 5)
        c.setFillColor(SUBTEXT)
        c.drawCentredString(bx + (bw-2)/2, by + 4*mm, lbl)
        bx += bw

    # Flavour text box
    c.setFillColor(HexColor('#00000060'))
    c.roundRect(mx + 10*mm, PAGE_H - 290*mm, PAGE_W - 2*mx - 20*mm, 50*mm,
                2, fill=1, stroke=0)
    c.setStrokeColor(DIM)
    c.setLineWidth(0.5)
    c.roundRect(mx + 10*mm, PAGE_H - 290*mm, PAGE_W - 2*mx - 20*mm, 50*mm,
                2, fill=0, stroke=1)

    flavour = [
        "> SYSTEM BOOT: SELF-CARE OS v2026.05",
        "> Loading memory engine .............. OK",
        "> Loading quantum intent engine ....... OK",
        "> Initialising badge subsystem ........ OK",
        "> Achievement registry ............... 14 records",
        "> Badge tiers detected ............... 3 (water/mayan)",
        "> Evolution dimensions ............... 7 active",
        "> Easter eggs loaded ................. [CLASSIFIED]",
        ">",
        "> READY. Your self-care journey awaits.",
        "> Press any key to begin  _",
    ]
    fy = PAGE_H - 244*mm
    c.setFont('Courier', 7)
    for i, line in enumerate(flavour):
        col = GREEN if i < 8 else (AMBER if i == 9 else HexColor('#00ff8888'))
        c.setFillColor(col)
        c.drawString(mx + 15*mm, fy, line)
        fy -= 4.5*mm

    # Version + copyright
    c.setFont('Courier', 6.5)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W/2, 28*mm, "© 2025-2026 LOT Systems  ·  All rights reserved")
    c.setFillColor(DIM)
    c.drawCentredString(PAGE_W/2, 23*mm,
        "lot-systems.com/u/vadik  ·  Created by Vadik Marmeladov")


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 2 — BADGE SYSTEM OVERVIEW
# ─────────────────────────────────────────────────────────────────────────────
def page_badge_overview(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    # Section header
    c.setFillColor(GREEN)
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(BG)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm, "[ BADGE SYSTEM :: OCEANIC MAYAN PROTOCOL ]")

    y = PAGE_H - 42*mm

    # Philosophy block
    pdf.panel(mx, y - 30*mm, PAGE_W - 2*mx, 32*mm,
              fill=HexColor('#0a100a'), border=HexColor('#1a3a1a'))
    c.setFont('Courier-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(mx + 4*mm, y - 4*mm, "DESIGN PHILOSOPHY")
    c.setFont('Courier', 7.5)
    c.setFillColor(TEXT)
    lines = [
        "Badges are earned through presence, not grinding. Inspired by Mayan cyclical time",
        "(K'in, Uinal, Tun) and the fluid intelligence of water, each symbol encodes a",
        "real story of self-care. Progression moves from droplet → wave → ocean current.",
        "",
        "Two badge families:  MILESTONE (time-based)  +  PATTERN (behaviour-based)",
    ]
    ly = y - 12*mm
    for line in lines:
        c.drawString(mx + 4*mm, ly, line)
        ly -= 4.5*mm

    y -= 38*mm

    # ── Milestone badges ───────────────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(AMBER)
    c.drawString(mx, y, ">> MILESTONE BADGES  (time × practice)")
    pdf.hline(y - 2*mm, color=AMBER)
    y -= 8*mm

    milestones = [
        ("○∿",  "WAVE EMERGES",   "7 Days",
         "Seven days of presence. The first mini-cycle closes.",
         "Wave patterns emerge. ○∿",
         GREEN),
        ("○≈○", "TIDE COMPLETES", "30 Days",
         "Full lunar cycle. Waves embrace the stable centre.",
         "Tides complete their cycle. ○≈○",
         CYAN),
        ("≋○≋", "OCEAN DEPTH",   "100 Days",
         "Deep current established. Mastery of the long count.",
         "Ocean depth achieved. ≋○≋",
         AMBER),
    ]

    bw = (PAGE_W - 2*mx - 8*mm) / 3
    bx = mx
    for sym, name, days, desc, unlock, col in milestones:
        bh = 38*mm
        pdf.badge_box(bx, y - bh, bw - 4*mm, bh, sym, name, desc, unlock,
                      symbol_color=col, tier_color=col)
        # Days label
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(col)
        c.drawCentredString(bx + (bw-4*mm)/2, y - bh - 4*mm, f"[ {days} ]")
        bx += bw

    y -= 52*mm

    # ── Pattern badges ─────────────────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(CYAN)
    c.drawString(mx, y, ">> PATTERN BADGES  (behaviour × awareness)")
    pdf.hline(y - 2*mm, color=CYAN)
    y -= 8*mm

    patterns = [
        ("∿—∿", "BALANCED",   "All planner dimensions used evenly",
         "You explore with balance. ∿—∿",  HexColor('#88ff88')),
        ("≈○≈", "FLOW",       "Multi-widget session engagement",
         "You move with flow. ≈○≈",         CYAN),
        ("—○—", "CONSISTENT", "Regular engagement at similar times",
         "Your rhythm is steady. —○—",      AMBER),
        ("○◐○", "REFLECTIVE", "Deep engagement with memory questions",
         "Depth in reflection. ○◐○",        PURPLE),
        ("○∴○", "EXPLORER",   "Diverse options across all widgets",
         "Curiosity guides you. ○∴○",       RED),
    ]

    bw5 = (PAGE_W - 2*mx - 8*mm) / 5
    bx = mx
    bh = 34*mm
    for sym, name, desc, unlock, col in patterns:
        pdf.badge_box(bx, y - bh, bw5 - 3*mm, bh, sym, name, desc, unlock,
                      symbol_color=col, tier_color=col)
        bx += bw5

    y -= bh + 8*mm

    # ── How badges appear on profile ────────────────────────────────────────
    pdf.panel(mx, y - 28*mm, PAGE_W - 2*mx, 30*mm,
              fill=HexColor('#0a0a14'), border=DIM)
    c.setFont('Courier-Bold', 7.5)
    c.setFillColor(CYAN)
    c.drawString(mx + 4*mm, y - 4*mm, "HOW BADGES APPEAR — Public Profile Evolution")
    c.setFont('Courier', 7)
    c.setFillColor(MUTED)
    examples = [
        ("Day 1  ",  "mindful · present · aware · grounded · authentic",  MUTED),
        ("Day 7  ",  "mindful ○∿ present ○∿ aware · grounded · authentic", GREEN),
        ("Day 30 ",  "mindful ○≈○ present ∿—∿ aware ≈○≈ grounded —○— authentic ○◐○", CYAN),
        ("Day 100",  "mindful ≋○≋ present ∿—∿ aware ≈○≈ grounded —○— authentic ○∴○", AMBER),
    ]
    ey = y - 12*mm
    for prefix, line, col in examples:
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(MUTED)
        c.drawString(mx + 4*mm, ey, prefix)
        c.setFont('Courier', 6.5)
        c.setFillColor(col)
        c.drawString(mx + 22*mm, ey, line)
        ey -= 4.5*mm


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 3 — ACHIEVEMENTS REGISTRY
# ─────────────────────────────────────────────────────────────────────────────
def page_achievements(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    c.setFillColor(PURPLE)
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(BG)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm,
                 "[ ACHIEVEMENT REGISTRY :: 14 RECORDS FOUND ]")

    y = PAGE_H - 40*mm

    # Rarity legend
    pdf.panel(mx, y - 12*mm, PAGE_W - 2*mx, 14*mm,
              fill=HexColor('#0d0d0d'), border=DIM)
    c.setFont('Courier-Bold', 6.5)
    c.setFillColor(MUTED)
    c.drawString(mx + 4*mm, y - 4*mm, "RARITY KEY:")
    rarities = [
        ("COMMON",    HexColor('#44aa44'), mx + 36*mm),
        ("UNCOMMON",  CYAN,                mx + 72*mm),
        ("RARE",      AMBER,               mx + 108*mm),
        ("EPIC",      PURPLE,              mx + 144*mm),
        ("LEGENDARY", RED,                 mx + 180*mm),
    ]
    for name, col, rx in rarities:
        c.setFillColor(col)
        c.rect(rx, y - 8*mm, 2*mm, 6*mm, fill=1, stroke=0)
        c.setFont('Courier-Bold', 6)
        c.drawString(rx + 3*mm, y - 5*mm, name)
    y -= 18*mm

    # Achievements grouped by dimension
    dimensions = [
        ("EXPLORATION",  "◈ Discovery & First-Time Experiences",  CYAN,   [
            ("first_breath",     "FIRST BREATH",     "common",   "First self-care reflection completed"),
            ("mirror_gazer",     "MIRROR GAZER",     "uncommon", "Profile viewed 10+ times — self-awareness"),
            ("community_voice",  "COMMUNITY VOICE",  "rare",     "Engaged with the community layer"),
        ]),
        ("CONSISTENCY",  "⬡ Behavioural Stamina & Streaks",       AMBER,  [
            ("week_warrior",     "WEEK WARRIOR",     "common",   "7-day engagement streak maintained"),
            ("moon_cycle",       "MOON CYCLE",       "uncommon", "30-day streak — full lunar cycle"),
            ("unwavering",       "UNWAVERING",       "rare",     "100-day streak — the long count"),
        ]),
        ("DEPTH",        "○ Knowledge Accumulation & Reflection", GREEN,  [
            ("deep_diver",       "DEEP DIVER",       "common",   "Deep engagement with memory questions"),
            ("self_scholar",     "SELF SCHOLAR",     "uncommon", "Consistent reflection patterns unlocked"),
            ("soul_cartographer","SOUL CARTOGRAPHER", "epic",    "Full psychological profile mapped"),
        ]),
        ("CONNECTION",   "≋ Social Engagement",                   HexColor('#88ff88'), [
            ("bridge_builder",   "BRIDGE BUILDER",   "rare",     "Connected with cohort members"),
        ]),
        ("INTIMACY",     "◇ Romantic Vulnerability",              PURPLE, [
            ("heart_tender",     "HEART TENDER",     "uncommon", "Opened the intimacy reflection layer"),
            ("intimacy_keeper",  "INTIMACY KEEPER",  "rare",     "Sustained vulnerability over time"),
        ]),
        ("CARE",         "● Self-Compassion Practices",           HexColor('#ff88aa'), [
            ("gentle_with_self", "GENTLE WITH SELF", "common",   "Completed self-compassion check-in"),
        ]),
        ("COURAGE",      "⟡ Truth-Telling & Honesty",             RED,    [
            ("truth_speaker",    "TRUTH SPEAKER",    "epic",     "Shared a difficult truth with the system"),
        ]),
    ]

    col_w = (PAGE_W - 2*mx - 4*mm) / 2
    cx1 = mx
    cx2 = mx + col_w + 4*mm
    row_col = cx1
    row_y = y

    for dim_name, dim_desc, dim_col, achievements in dimensions:
        if row_y < 60*mm:
            row_col = cx2
            row_y = y

        # Dimension header
        c.setFillColor(HexColor('#0d0d0d'))
        c.rect(row_col, row_y - 7*mm, col_w, 8*mm, fill=1, stroke=0)
        c.setStrokeColor(dim_col)
        c.setLineWidth(1)
        c.line(row_col, row_y, row_col, row_y - 7*mm)
        c.setFont('Courier-Bold', 7.5)
        c.setFillColor(dim_col)
        c.drawString(row_col + 3*mm, row_y - 4*mm, dim_name)
        c.setFont('Courier', 6)
        c.setFillColor(MUTED)
        c.drawString(row_col + 30*mm, row_y - 4*mm, dim_desc)
        row_y -= 10*mm

        for ach_id, title, rarity, desc in achievements:
            pdf.achievement_row(row_col, row_y - 10*mm, col_w,
                                ach_id, title, desc, rarity, dim_col)
            row_y -= 12*mm

        row_y -= 3*mm

        # After DEPTH, swap to column 2
        if dim_name == "DEPTH":
            row_col = cx2
            row_y = y


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 4 — EVOLUTION & LEVEL SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
def page_evolution(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    c.setFillColor(CYAN)
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(BG)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm,
                 "[ EVOLUTION ENGINE :: CQGS CITIZEN INDEX ]")

    y = PAGE_H - 42*mm

    # ── Story Arc Chapters ─────────────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(AMBER)
    c.drawString(mx, y, ">> STORY ARC CHAPTERS  (RPG Progression)")
    pdf.hline(y - 2*mm, color=AMBER)
    y -= 8*mm

    chapters = [
        ("01", "AWAKENING",   "Lv 1-9",   "You notice yourself",
         "Breathable layout. Space to begin.",                GREEN),
        ("02", "EXPLORATION", "Lv 10-29", "Patterns emerge",
         "Comfortable density. Widgets find rhythm.",          CYAN),
        ("03", "INTEGRATION", "Lv 30-59", "Meaning weaves through everything",
         "Compact dashboard. Sections sharpen.",               AMBER),
        ("04", "MASTERY",     "Lv 60+",   "You architect your becoming",
         "Dense / Instrument. Bloomberg-grade cockpit.",       PURPLE),
    ]

    cw = (PAGE_W - 2*mx - 6*mm) / 4
    cx = mx
    for num, name, lvl, tagline, desc, col in chapters:
        ch = 38*mm
        c.setFillColor(HexColor('#0d0d14'))
        c.roundRect(cx, y - ch, cw - 2*mm, ch, 2, fill=1, stroke=0)
        c.setStrokeColor(col)
        c.setLineWidth(0.7)
        c.roundRect(cx, y - ch, cw - 2*mm, ch, 2, fill=0, stroke=1)
        # Number
        c.setFont('Courier-Bold', 22)
        c.setFillColor(HexColor(col.hexval() + '33'))
        c.drawCentredString(cx + (cw-2*mm)/2, y - 16*mm, num)
        c.setFont('Courier-Bold', 22)
        c.setFillColor(col)
        c.drawCentredString(cx + (cw-2*mm)/2, y - 16*mm, num)
        # Name
        c.setFont('Courier-Bold', 7)
        c.setFillColor(WHITE)
        c.drawCentredString(cx + (cw-2*mm)/2, y - 21*mm, name)
        # Level
        c.setFont('Courier', 6)
        c.setFillColor(col)
        c.drawCentredString(cx + (cw-2*mm)/2, y - 25.5*mm, lvl)
        # Tagline
        c.setFont('Courier-Oblique', 5.5)
        c.setFillColor(SUBTEXT)
        c.drawCentredString(cx + (cw-2*mm)/2, y - 30*mm, f'"{tagline}"')
        # Desc
        c.setFont('Courier', 5)
        c.setFillColor(MUTED)
        words = desc.split()
        line = ''
        dlines = []
        for w2 in words:
            test = (line + ' ' + w2).strip()
            if c.stringWidth(test, 'Courier', 5) < cw - 6*mm:
                line = test
            else:
                if line: dlines.append(line)
                line = w2
        if line: dlines.append(line)
        dy = y - 34*mm
        for dl in dlines[:2]:
            c.drawCentredString(cx + (cw-2*mm)/2, dy, dl)
            dy -= 3.5*mm
        cx += cw

    y -= 48*mm

    # ── 7 Evolution Dimensions ─────────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(GREEN)
    c.drawString(mx, y, ">> 7 EVOLUTION DIMENSIONS  (Interface DNA)")
    pdf.hline(y - 2*mm, color=GREEN)
    y -= 8*mm

    dims = [
        ("EXPLORATION",   "◈", "0.15×",  "Discovery & first-time widget experiences",      CYAN),
        ("CONSISTENCY",   "⬡", "0.25×",  "Behavioural stamina, streaks, habit integrity",  AMBER),
        ("DEPTH",         "○", "0.20×",  "Knowledge accumulation, memory reflection",       GREEN),
        ("CONNECTION",    "≋", "0.10×",  "Social engagement, cohort bridge-building",       HexColor('#88ff88')),
        ("INTIMACY",      "◇", "0.10×",  "Romantic vulnerability, heart openness",          PURPLE),
        ("CARE",          "●", "0.10×",  "Self-compassion, gentle check-in practices",      HexColor('#ff88aa')),
        ("COURAGE",       "⟡", "0.10×",  "Truth-telling, honesty signals, transparency",   RED),
    ]

    dw = (PAGE_W - 2*mx - 4*mm) / 2
    dx1 = mx
    dx2 = mx + dw + 4*mm
    dy1 = y
    dy2 = y
    for i, (name, sym, weight, desc, col) in enumerate(dims):
        dcol = dx1 if i < 4 else dx2
        dy   = dy1 if i < 4 else dy2
        pdf.panel(dcol, dy - 11*mm, dw, 12*mm,
                  fill=HexColor('#0d0d0d'), border=DIM)
        c.setFillColor(col)
        c.rect(dcol, dy - 11*mm, 2*mm, 12*mm, fill=1, stroke=0)
        c.setFont('Courier-Bold', 14)
        c.setFillColor(col)
        c.drawString(dcol + 5*mm, dy - 7*mm, sym)
        c.setFont('Courier-Bold', 7.5)
        c.setFillColor(WHITE)
        c.drawString(dcol + 14*mm, dy - 4.5*mm, name)
        c.setFont('Courier', 6)
        c.setFillColor(SUBTEXT)
        c.drawString(dcol + 14*mm, dy - 9*mm, desc)
        c.setFont('Courier-Bold', 6)
        c.setFillColor(col)
        c.drawRightString(dcol + dw - 2*mm, dy - 4.5*mm, f"weight {weight}")
        if i < 4:
            dy1 -= 14*mm
        else:
            dy2 -= 14*mm

    y = min(dy1, dy2) - 6*mm

    # ── Layout Density Progression ──────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(CYAN)
    c.drawString(mx, y, ">> LAYOUT DENSITY EVOLUTION  (Interface breathes with you)")
    pdf.hline(y - 2*mm, color=CYAN)
    y -= 8*mm

    densities = [
        ("BREATHABLE", "<0.15", "gap-y-24 / gap-y-16", "Open, airy. Wellness journal feel.",    GREEN),
        ("COMFORTABLE","0.15+", "gap-y-24 / gap-y-8",  "Stacks begin forming. Slightly denser.", CYAN),
        ("COMPACT",    "0.35+", "gap-y-16 / gap-y-4",  "Dashboard clarity. Sections sharpen.",  AMBER),
        ("DENSE",      "0.55+", "gap-y-8  / gap-y-0",  "Info cockpit. Minimal whitespace.",     PURPLE),
        ("INSTRUMENT", "0.75+", "gap-y-4  / gap-y-0",  "Maximum density. Bloomberg-grade.",     RED),
    ]

    dw5 = (PAGE_W - 2*mx - 8*mm) / 5
    dx = mx
    for name, thresh, gaps, desc, col in densities:
        dh = 28*mm
        c.setFillColor(HexColor('#0d0d14'))
        c.roundRect(dx, y - dh, dw5 - 2*mm, dh, 2, fill=1, stroke=0)
        c.setStrokeColor(col)
        c.setLineWidth(0.5)
        c.roundRect(dx, y - dh, dw5 - 2*mm, dh, 2, fill=0, stroke=1)
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(col)
        c.drawCentredString(dx + (dw5-2*mm)/2, y - 6*mm, name)
        c.setFont('Courier', 5.5)
        c.setFillColor(AMBER)
        c.drawCentredString(dx + (dw5-2*mm)/2, y - 11*mm, thresh)
        c.setFont('Courier', 5)
        c.setFillColor(MUTED)
        c.drawCentredString(dx + (dw5-2*mm)/2, y - 16*mm, gaps)
        # wrap desc
        words = desc.split()
        line = ''
        dlines2 = []
        for w2 in words:
            test = (line + ' ' + w2).strip()
            if c.stringWidth(test, 'Courier', 5) < dw5 - 4*mm:
                line = test
            else:
                if line: dlines2.append(line)
                line = w2
        if line: dlines2.append(line)
        ld = y - 21*mm
        for dl in dlines2[:2]:
            c.setFillColor(SUBTEXT)
            c.drawCentredString(dx + (dw5-2*mm)/2, ld, dl)
            ld -= 3.5*mm
        dx += dw5


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 5 — EASTER EGGS & WORD TURNS
# ─────────────────────────────────────────────────────────────────────────────
def page_easter_eggs(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    c.setFillColor(AMBER)
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(BG)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm,
                 "[ EASTER EGGS :: [CLASSIFIED] TRANSMISSIONS ]")

    y = PAGE_H - 42*mm

    # ── Magic Time Calculator ──────────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(AMBER)
    c.drawString(mx, y, ">> MICRO CALCULATOR  (Magic Timestamp Trigger)")
    pdf.hline(y - 2*mm, color=AMBER)
    y -= 8*mm

    pdf.panel(mx, y - 40*mm, PAGE_W - 2*mx, 42*mm,
              fill=HexColor('#140d00'), border=HexColor('#332200'))
    c.setFont('Courier', 7)
    c.setFillColor(AMBER)
    magic_intro = (
        "An ASCII-styled calculator fades into existence only during 23 pre-defined 'magical'  "
        "timestamps. When the clock aligns, the universe pauses to let you calculate."
    )
    c.drawString(mx + 4*mm, y - 5*mm, magic_intro[:80])
    c.drawString(mx + 4*mm, y - 9.5*mm, magic_intro[80:])

    magic_times = [
        "00:00", "01:11", "02:22", "03:33", "04:44", "05:55",
        "10:01", "11:11", "12:12", "12:21", "12:34", "13:13",
        "13:31", "14:14", "14:41", "15:15", "15:51", "16:16",
        "17:17", "18:18", "19:19", "22:22", "23:32",
    ]
    c.setFont('Courier-Bold', 7)
    c.setFillColor(HexColor('#ffaa00'))
    c.drawString(mx + 4*mm, y - 16*mm, "MAGIC TIMESTAMPS (23 triggers):")
    c.setFont('Courier', 6.5)
    c.setFillColor(AMBER)
    tx = mx + 4*mm
    ty = y - 22*mm
    for i, t in enumerate(magic_times):
        c.drawString(tx, ty, t)
        tx += 18*mm
        if tx > PAGE_W - mx - 20*mm:
            tx = mx + 4*mm
            ty -= 5*mm
    c.setFont('Courier-Oblique', 6.5)
    c.setFillColor(MUTED)
    c.drawString(mx + 4*mm, y - 36*mm,
                 '"The interface sees time as sacred. So should you."  — QIE Proverb')

    y -= 50*mm

    # ── Micro Game Widget ──────────────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(GREEN)
    c.drawString(mx, y, ">> MICRO GAME WIDGET  (32×32 px Monochrome Arcade)")
    pdf.hline(y - 2*mm, color=GREEN)
    y -= 8*mm

    games = [
        ("MICRO TETRIS",    "Morning",   "06:00-12:00",
         "Stack falling pieces in the quantum field.",
         "⠀⠀██⠀⠀\n⠀██████\n██████  \n████████",  GREEN),
        ("PIXEL INVADERS",  "Afternoon", "12:00-18:00",
         "Defend the self-care OS from entropy invaders.",
         "  ^  \n /|\\\\\n  |  \n /|\\\\ ",           CYAN),
        ("DOT SNAKE",       "Evening",   "18:00-24:00",
         "Feed the snake. The longer the streak, the longer the serpent.",
         "●●●●>\n      \n   ◦  ",                   AMBER),
    ]

    gw = (PAGE_W - 2*mx - 8*mm) / 3
    gx = mx
    for gname, period, hours, desc, art, col in games:
        gh = 38*mm
        c.setFillColor(HexColor('#0a140a'))
        c.roundRect(gx, y - gh, gw - 3*mm, gh, 2, fill=1, stroke=0)
        c.setStrokeColor(col)
        c.setLineWidth(0.7)
        c.roundRect(gx, y - gh, gw - 3*mm, gh, 2, fill=0, stroke=1)
        c.setFont('Courier-Bold', 7)
        c.setFillColor(col)
        c.drawCentredString(gx + (gw-3*mm)/2, y - 5*mm, gname)
        c.setFont('Courier', 6)
        c.setFillColor(AMBER)
        c.drawCentredString(gx + (gw-3*mm)/2, y - 9.5*mm, f"{period}  {hours}")
        c.setFont('Courier', 6)
        c.setFillColor(SUBTEXT)
        words = desc.split()
        line = ''
        dlines = []
        for w2 in words:
            test = (line + ' ' + w2).strip()
            if c.stringWidth(test, 'Courier', 6) < gw - 8*mm:
                line = test
            else:
                if line: dlines.append(line)
                line = w2
        if line: dlines.append(line)
        ly2 = y - 16*mm
        for dl in dlines[:2]:
            c.drawCentredString(gx + (gw-3*mm)/2, ly2, dl)
            ly2 -= 4*mm
        # ASCII art
        c.setFont('Courier', 6.5)
        c.setFillColor(col)
        alines = art.split('\n')
        ay = y - 28*mm
        for al in alines:
            c.drawCentredString(gx + (gw-3*mm)/2, ay, al)
            ay -= 4*mm
        gx += gw

    y -= 50*mm

    # ── Quantum Random ──────────────────────────────────────────────────────
    pdf.panel(mx, y - 20*mm, (PAGE_W - 2*mx - 4*mm)/2, 22*mm,
              fill=HexColor('#0d000d'), border=PURPLE)
    c.setFont('Courier-Bold', 8)
    c.setFillColor(PURPLE)
    c.drawString(mx + 4*mm, y - 5*mm, "QUANTUM RANDOM WIDGET")
    c.setFont('Courier', 7)
    c.setFillColor(TEXT)
    c.drawString(mx + 4*mm, y - 10*mm,
                 "Generates 0-99 at randomised intervals of")
    c.drawString(mx + 4*mm, y - 14.5*mm,
                 "1-72 seconds. Each generation is a QIE signal.")
    c.setFont('Courier-Bold', 14)
    c.setFillColor(PURPLE)
    c.drawString(mx + 4*mm, y - 19*mm, "?? ← live entropy")

    # ── Word Turns / Stoic Reflections ───────────────────────────────────────
    rx = mx + (PAGE_W - 2*mx - 4*mm)/2 + 4*mm
    rw = (PAGE_W - 2*mx - 4*mm)/2
    pdf.panel(rx, y - 20*mm, rw, 22*mm,
              fill=HexColor('#00080d'), border=CYAN)
    c.setFont('Courier-Bold', 8)
    c.setFillColor(CYAN)
    c.drawString(rx + 4*mm, y - 5*mm, "WORD TURNS — STOIC REFLECTIONS")
    c.setFont('Courier', 6.5)
    c.setFillColor(TEXT)
    c.drawString(rx + 4*mm, y - 10*mm,
                 "Between memory question rounds, the system")
    c.drawString(rx + 4*mm, y - 14*mm,
                 "surfaces stoic reflections. These 'word turns'")
    c.drawString(rx + 4*mm, y - 18*mm,
                 "reframe the session as narrative, not metrics.")

    y -= 28*mm

    # ── Unlock Sequence / Flavour ──────────────────────────────────────────
    c.setFont('Courier-Bold', 8.5)
    c.setFillColor(RED)
    c.drawString(mx, y, ">> NATURAL UNLOCK SEQUENCE  (typical journey)")
    pdf.hline(y - 2*mm, color=RED)
    y -= 7*mm

    sequence = [
        ("Day 7",  "○∿ unlocked",         "First wave emerges. The system notices.",           GREEN),
        ("Day 12", "≈○≈ Flow unlocked",   "Multi-widget session detected. You are in flow.",  CYAN),
        ("Day 18", "—○— Steady unlocked", "Timing patterns emerge. Rhythm established.",      AMBER),
        ("Day 21", "∿—∿ Balance unlocks", "All planner dims used. You navigate completely.",  HexColor('#88ff88')),
        ("Day 30", "○≈○ unlocked",        "Full lunar cycle complete. Tide returns.",          CYAN),
        ("Day 40", "○◐○ Reflect unlocks", "Moon phases: your light-dark awareness grows.",    PURPLE),
        ("Day 60", "○∴○ Explorer unlocks","Origin → scattered curiosity → return.",            RED),
        ("Day 100","≋○≋ unlocked",        "Ocean depth. The long count is yours.   ≋○≋",      AMBER),
    ]

    sw = (PAGE_W - 2*mx - 4*mm) / 2
    sx1, sx2 = mx, mx + sw + 4*mm
    sy1, sy2 = y, y
    for i, (day, badge, msg, col) in enumerate(sequence):
        scol = sx1 if i % 2 == 0 else sx2
        sy   = sy1 if i % 2 == 0 else sy2
        pdf.panel(scol, sy - 10*mm, sw, 11*mm,
                  fill=HexColor('#0a0a0a'), border=DIM)
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(col)
        c.drawString(scol + 3*mm, sy - 4*mm, f"{day}  {badge}")
        c.setFont('Courier', 6)
        c.setFillColor(SUBTEXT)
        c.drawString(scol + 3*mm, sy - 8.5*mm, msg[:65])
        if i % 2 == 0:
            sy1 -= 13*mm
        else:
            sy2 -= 13*mm


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 6 — WIDGET INTEGRATION MAP
# ─────────────────────────────────────────────────────────────────────────────
def page_widget_map(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    c.setFillColor(HexColor('#001a33'))
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(CYAN)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm,
                 "[ WIDGET INTEGRATION MAP :: BADGE SIGNAL FLOW ]")

    y = PAGE_H - 42*mm

    # Intro
    c.setFont('Courier', 7.5)
    c.setFillColor(TEXT)
    c.drawString(mx, y, "Badges and achievements are not separate from the system — they are")
    c.drawString(mx, y - 5*mm, "the system responding to your presence. Every widget feeds signals.")
    y -= 14*mm

    widgets = [
        ("MEMORY WIDGET",           "Primary self-reflection engine",
         ["Triggers badge unlock notifications on milestones",
          "Records answers as QIE signals for pattern analysis",
          "Surfaces stoic reflections (Word Turns) between rounds",
          "7-day streak → unlocks ○∿  |  30-day → ○≈○  |  100-day → ≋○≋"],
         GREEN),
        ("EVOLUTION WIDGET",         "CQGS Citizen Index display",
         ["Shows level, achievements, streak in RPG format",
          "Cycles: Metrics view ↔ Activity breakdown",
          "Derives from log data + narrative progression",
          "Reflects all 7 evolution dimensions in real-time"],
         CYAN),
        ("NARRATIVE WIDGET",         "RPG story progression engine",
         ["Story, Achievements, Quests, Context views",
          "Narrative tone shifts with engagement level",
          "Self-assembly map: 9 modules, 5 assembly phases",
          "Quests tie directly to achievement unlock criteria"],
         AMBER),
        ("INTERFACE EVOLUTION WIDGET","7-dimension CQGS state",
         ["Exploration, Consistency, Depth, Connection,",
          "Intimacy, Care, Courage — all tracked live",
          "Features, Dimensions, Effects views",
          "Unlocks CSS evolution properties on the document"],
         PURPLE),
        ("BADGE UNLOCK FEED",        "Community achievement stream",
         ["Live feed: 5 most recent community badge unlocks",
          "Shows user name, badge symbol, relative timestamp",
          "Displays today's total badge count across community",
          "Provides social proof and collective motivation"],
         HexColor('#ff88aa')),
        ("GROWTH MILESTONES WIDGET", "Personal + community metrics",
         ["Journey days, questions answered, insights, badge level",
          "Community: total users, operation days, wisdom count",
          "'Next directive' guidance based on log context",
          "Reads from /api/growth-stats + log enrichment"],
         HexColor('#88ff88')),
        ("EVOLUTION MILESTONE TOAST","Unlock notification overlay",
         ["Appears when badge tier advances or chapter changes",
          "Auto-dismisses after 6 seconds (non-intrusive)",
          "Layout density change also triggers milestone toast",
          "Water theme: fluid message  |  Architecture: structured"],
         RED),
        ("PLANNER WIDGET",           "4D daily planning interface",
         ["Intent, Today, How, Feeling — four dimensions",
          "Full keyboard navigation (arrow keys)",
          "Records plan_set signals for ∿—∿ Balance badge",
          "Contributes to Exploration dimension score"],
         HexColor('#ffcc44')),
    ]

    ww = (PAGE_W - 2*mx - 4*mm) / 2
    wx1 = mx
    wx2 = mx + ww + 4*mm
    wy1 = y
    wy2 = y
    for i, (name, sub, points, col) in enumerate(widgets):
        wcol = wx1 if i % 2 == 0 else wx2
        wy   = wy1 if i % 2 == 0 else wy2
        wh = 30*mm
        c.setFillColor(HexColor('#0d0d0d'))
        c.roundRect(wcol, wy - wh, ww, wh, 2, fill=1, stroke=0)
        c.setStrokeColor(col)
        c.setLineWidth(0.7)
        c.line(wcol, wy, wcol + ww, wy)   # top border
        c.setStrokeColor(DIM)
        c.roundRect(wcol, wy - wh, ww, wh, 2, fill=0, stroke=1)
        # Color top accent
        c.setFillColor(col)
        c.rect(wcol, wy - 2*mm, ww, 2*mm, fill=1, stroke=0)
        # Name
        c.setFont('Courier-Bold', 7.5)
        c.setFillColor(WHITE)
        c.drawString(wcol + 3*mm, wy - 7*mm, name)
        # Sub
        c.setFont('Courier', 6)
        c.setFillColor(col)
        c.drawString(wcol + 3*mm, wy - 11*mm, sub)
        # Points
        py = wy - 16*mm
        for pt in points[:4]:
            c.setFont('Courier', 5.5)
            c.setFillColor(SUBTEXT)
            c.drawString(wcol + 3*mm, py, f"· {pt[:68]}")
            py -= 3.8*mm
        if i % 2 == 0:
            wy1 -= wh + 4*mm
        else:
            wy2 -= wh + 4*mm


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 7 — BADGE SYMBOL REFERENCE CARD
# ─────────────────────────────────────────────────────────────────────────────
def page_symbol_reference(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    c.setFillColor(DIM)
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(WHITE)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm,
                 "[ SYMBOL REFERENCE CARD :: UNICODE REGISTRY ]")

    y = PAGE_H - 42*mm

    # Intro
    c.setFont('Courier', 7.5)
    c.setFillColor(SUBTEXT)
    c.drawString(mx, y,
        "All LOT badge symbols are standard Unicode — no custom fonts required.")
    c.drawString(mx, y - 5*mm,
        "100% browser compatibility: Safari, Chrome, Firefox, Edge, iOS, Android.")
    y -= 14*mm

    all_symbols = [
        ("○",  "U+25CB", "White Circle",         "Completion / Centre / Mayan Shell"),
        ("∿",  "U+223F", "Sine Wave",            "First wave / Initial oscillation"),
        ("≈",  "U+2248", "Almost Equal To",      "Double wave / Sustained flow"),
        ("≋",  "U+224B", "Triple Tilde",         "Deep current / Ocean mastery"),
        ("—",  "U+2014", "Em Dash",              "Bar / Mayan 5 / Stability"),
        ("◐",  "U+25D0", "Left Half Black Circle","Moon phase / Light-dark awareness"),
        ("∴",  "U+2234", "Therefore",            "Scattered dots / Curiosity / Therefore"),
        ("·",  "U+00B7", "Middle Dot",           "Separator / Neutral pause"),
        ("✦",  "U+2726", "Black Four-Pointed Star","Constellation / Navigation (alt theme)"),
        ("✧",  "U+2727", "White Four-Pointed Star","Binary star / Pair / Balance (alt)"),
        ("⋆",  "U+22C6", "Star Operator",        "Geometric star / Minimal milestone (alt)"),
        ("◊",  "U+25CA", "Lozenge",              "Diamond / Balance (alt geometric)"),
        ("∼",  "U+223C", "Tilde",               "Wave / Flow (alt geometric)"),
        ("▪",  "U+25AA", "Small Black Square",   "Consistent / Steady beat (alt)"),
        ("◇",  "U+25C7", "White Diamond",        "Reflective / Inner depth (alt)"),
        ("▫",  "U+25AB", "Small White Square",   "Explorer / Open discovery (alt)"),
    ]

    # Table header
    c.setFillColor(HexColor('#1a1a1a'))
    c.rect(mx, y - 7*mm, PAGE_W - 2*mx, 8*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 7)
    c.setFillColor(GREEN)
    c.drawString(mx + 4*mm, y - 4*mm, "SYM")
    c.drawString(mx + 16*mm, y - 4*mm, "UNICODE")
    c.drawString(mx + 40*mm, y - 4*mm, "UNICODE NAME")
    c.drawString(mx + 100*mm, y - 4*mm, "LOT MEANING")
    y -= 8*mm

    for i, (sym, code, name, meaning) in enumerate(all_symbols):
        bg = HexColor('#0d0d0d') if i % 2 == 0 else BG
        c.setFillColor(bg)
        c.rect(mx, y - 6*mm, PAGE_W - 2*mx, 6.5*mm, fill=1, stroke=0)
        c.setFont('Courier-Bold', 10)
        c.setFillColor(GREEN)
        c.drawString(mx + 4*mm, y - 4.5*mm, sym)
        c.setFont('Courier', 6.5)
        c.setFillColor(AMBER)
        c.drawString(mx + 16*mm, y - 4.5*mm, code)
        c.setFillColor(TEXT)
        c.drawString(mx + 40*mm, y - 4.5*mm, name)
        c.setFillColor(SUBTEXT)
        c.drawString(mx + 100*mm, y - 4.5*mm, meaning)
        y -= 7*mm

    y -= 6*mm

    # Alt badge themes box
    pdf.panel(mx, y - 42*mm, PAGE_W - 2*mx, 44*mm,
              fill=HexColor('#0a0a14'), border=DIM)
    c.setFont('Courier-Bold', 8)
    c.setFillColor(CYAN)
    c.drawString(mx + 4*mm, y - 5*mm, "ALTERNATIVE BADGE THEMES  (available but not default)")
    c.setFont('Courier', 6.5)
    c.setFillColor(MUTED)

    alt_themes = [
        ("CONSTELLATION (Option 8, recommended alt)",
         "✦·  ✦✧  ✦✧✦  |  ✧·✧  ✦~✧  ✧═✧  ✦◇✦  ✧○✧",
         "Celestial navigation. Stars guide the journey."),
        ("GEOMETRIC MINIMAL (Option 1)",
         "⋆·  ⋆⋆  ⋆⋆⋆  |  ◊·◊  ∼·∼  ▪·▪  ◇·◇  ▫·▫",
         "Clean, modern. Structured elegance."),
        ("ZEN GARDEN (Option 7)",
         "≈·  ≈≈  ≋·   |  ═·═  ≈·≈  ━·━  ╌·╌  ┄·┄",
         "Meditative. Raked sand patterns for the reflective mind."),
        ("AQUATIC EVOLUTION (Option 5, simplest)",
         "∘   ≈   ≋       milestone only (no pattern badges)",
         "Ultra-minimal. Droplet → Wave → Current."),
    ]

    ty = y - 13*mm
    for title, symbols, desc in alt_themes:
        c.setFont('Courier-Bold', 7)
        c.setFillColor(WHITE)
        c.drawString(mx + 4*mm, ty, title)
        c.setFont('Courier', 7.5)
        c.setFillColor(HexColor('#88aaff'))
        c.drawString(mx + 10*mm, ty - 4.5*mm, symbols)
        c.setFont('Courier', 6.5)
        c.setFillColor(MUTED)
        c.drawString(mx + 10*mm, ty - 9*mm, desc)
        ty -= 13*mm


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 8 — IMPLEMENTATION STATUS + ROADMAP
# ─────────────────────────────────────────────────────────────────────────────
def page_roadmap(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    c.setFillColor(GREEN)
    c.rect(mx, PAGE_H - 32*mm, PAGE_W - 2*mx, 10*mm, fill=1, stroke=0)
    c.setFont('Courier-Bold', 11)
    c.setFillColor(BG)
    c.drawString(mx + 4*mm, PAGE_H - 25*mm,
                 "[ SYSTEM STATUS :: IMPLEMENTATION MAP v2026 ]")

    y = PAGE_H - 44*mm

    # Status legend
    c.setFont('Courier', 7)
    c.setFillColor(MUTED)
    statuses = [
        ("[LIVE]",    GREEN,  "Deployed and active in production"),
        ("[PLANNED]", AMBER,  "Designed; implementation pending"),
        ("[DRAFT]",   CYAN,   "Concept stage; open for iteration"),
        ("[EASTER]",  PURPLE, "Hidden / undocumented feature"),
    ]
    sx = mx
    for code, col, desc in statuses:
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(col)
        c.drawString(sx, y, code)
        c.setFont('Courier', 6.5)
        c.setFillColor(MUTED)
        c.drawString(sx + 20*mm, y, desc)
        sx += 70*mm
    y -= 10*mm
    pdf.hline(y, color=DIM)
    y -= 8*mm

    items = [
        # (status_code, color, category, name, detail)
        ("[LIVE]",    GREEN,  "BADGE",       "Oceanic Mayan Badge System",
         "8 badges: 3 milestone + 5 pattern. Live in production."),
        ("[LIVE]",    GREEN,  "BADGE",       "Badge Unlock Notifications",
         "Toast alerts trigger on milestone days 7, 30, 100."),
        ("[LIVE]",    GREEN,  "BADGE",       "Community Badge Unlock Feed",
         "Live feed of 5 most recent community unlocks. /api/badge-stats"),
        ("[LIVE]",    GREEN,  "EVOLUTION",   "7-Dimension Evolution Engine",
         "Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage."),
        ("[LIVE]",    GREEN,  "EVOLUTION",   "Interface Evolution CSS Properties",
         "14 CSS custom props update dynamically with evolution state."),
        ("[LIVE]",    GREEN,  "EVOLUTION",   "Layout Density System (5 levels)",
         "Breathable → Instrument. Driven by visualRefinement score."),
        ("[LIVE]",    GREEN,  "EVOLUTION",   "Evolution Milestone Toasts",
         "Chapter advancement, density changes, badge tier toasts."),
        ("[LIVE]",    GREEN,  "ACHIEVEMENT", "14 Achievement Records",
         "7 categories: Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage."),
        ("[LIVE]",    GREEN,  "EASTER",      "Micro Calculator (23 Magic Timestamps)",
         "Appears only at sacred times. ASCII-styled. Records magic_time signals."),
        ("[LIVE]",    GREEN,  "EASTER",      "Micro Game Widget (3 Arcade Games)",
         "Tetris/Invaders/Snake rotate by time of day. 32×32 pixel canvas."),
        ("[LIVE]",    GREEN,  "EASTER",      "Quantum Random Number Widget",
         "Generates 0-99 at 1-72s intervals. Entropy as signal."),
        ("[LIVE]",    GREEN,  "NARRATIVE",   "RPG Narrative Engine",
         "Story, Achievements, Quests, Context views. Tone adapts to engagement."),
        ("[LIVE]",    GREEN,  "NARRATIVE",   "Self-Assembly Engine (9 Modules)",
         "Dormant→Awakening→Forming→Assembled→Integrated. Powered by QIE signals."),
        ("[LIVE]",    GREEN,  "NARRATIVE",   "Goal Journey Widget",
         "Detects goals through 3 journey stages. Syncs with narrative system."),
        ("[PLANNED]", AMBER,  "BADGE",       "Badge Style Selector (User Choice)",
         "Let users pick: Oceanic Mayan, Constellation, Geometric, Zen Garden."),
        ("[PLANNED]", AMBER,  "ACHIEVEMENT", "Achievement Gallery Widget",
         "Showcase page for earned achievements. Unlocks at full exploration."),
        ("[PLANNED]", AMBER,  "EVOLUTION",   "Pattern Insights (Quantum Intent)",
         "Unlocks at Consistency ≥ 0.66 (Moon Cycle+). /api/intention-patterns"),
        ("[PLANNED]", AMBER,  "EVOLUTION",   "Narrative Reflection (AI Synthesis)",
         "Unlocks at Depth ≥ 0.66 + Level ≥ 30. Deep AI narrative synthesis."),
        ("[DRAFT]",   CYAN,   "BADGE",       "Legendary Tier (365 Days)",
         "One year. Symbol TBD. The ultimate K'atun cycle badge."),
        ("[DRAFT]",   CYAN,   "EASTER",      "Secret Archetype Reveal",
         "Hidden badge for users who answer 100% of memory questions honestly."),
        ("[EASTER]",  PURPLE, "EASTER",      "Flash Drive Manifest",
         "Offline mode: 32GB flash drive concept. The system lives in your pocket."),
        ("[EASTER]",  PURPLE, "EASTER",      "Quantum Sign (Daily Oracle)",
         "Subscriber-only. Stable daily message from date-based seed."),
    ]

    col_w = (PAGE_W - 2*mx) / 2
    ix1 = mx
    ix2 = mx + col_w
    iy1 = y
    iy2 = y

    for j, (status, col, cat, name, detail) in enumerate(items):
        icol = ix1 if j % 2 == 0 else ix2
        iy   = iy1 if j % 2 == 0 else iy2
        ih = 11*mm
        c.setFillColor(HexColor('#0d0d0d'))
        c.rect(icol, iy - ih, col_w - 2*mm, ih, fill=1, stroke=0)
        # Left colour bar
        c.setFillColor(col)
        c.rect(icol, iy - ih, 1.5*mm, ih, fill=1, stroke=0)
        # Status tag
        c.setFont('Courier-Bold', 5.5)
        c.setFillColor(col)
        c.drawString(icol + 3*mm, iy - 4*mm, status)
        # Category
        c.setFont('Courier', 5.5)
        c.setFillColor(MUTED)
        c.drawString(icol + 3*mm, iy - 8*mm, cat)
        # Name
        c.setFont('Courier-Bold', 6.5)
        c.setFillColor(WHITE)
        c.drawString(icol + 22*mm, iy - 4*mm, name[:45])
        # Detail
        c.setFont('Courier', 5.5)
        c.setFillColor(SUBTEXT)
        c.drawString(icol + 22*mm, iy - 8.5*mm, detail[:60])
        if j % 2 == 0:
            iy1 -= ih + 1.5*mm
        else:
            iy2 -= ih + 1.5*mm


# ─────────────────────────────────────────────────────────────────────────────
#   PAGE 9 — CLOSING / PHILOSOPHY
# ─────────────────────────────────────────────────────────────────────────────
def page_closing(pdf):
    pdf.new_page()
    c = pdf.c
    mx = 20*mm

    draw_corner_brackets(c, mx, 18*mm, PAGE_W - 2*mx, PAGE_H - 36*mm,
                         color=GREEN, size=12)

    # Quote blocks
    quotes = [
        ("Evolution is not something you can fork from a repo.",
         "It is earned through presence.",
         GREEN),
        ("Badges are not trophies.",
         "They are the system recognising that you showed up.",
         CYAN),
        ("The interface breathes with you.",
         "Breathable → Comfortable → Compact → Dense → Instrument.",
         AMBER),
        ("Self-care is cyclical, not linear.",
         "K'in → Uinal → Tun. Droplet → Wave → Ocean.",
         PURPLE),
    ]

    qy = PAGE_H - 60*mm
    for q1, q2, col in quotes:
        c.setFont('Courier-Bold', 11)
        c.setFillColor(col)
        c.drawCentredString(PAGE_W/2, qy, f'"{q1}')
        c.setFont('Courier', 11)
        c.setFillColor(WHITE)
        c.drawCentredString(PAGE_W/2, qy - 8*mm, f' {q2}"')
        pdf.hline(qy - 12*mm, x1=PAGE_W/2 - 30*mm, x2=PAGE_W/2 + 30*mm,
                  color=col, width=0.3)
        qy -= 28*mm

    # Final ASCII art
    art = [
        "  ╔══════════════════════════════════════════════╗  ",
        "  ║  LOT SYSTEMS — QUANTUM INTENT ENGINE †       ║  ",
        "  ║                                              ║  ",
        "  ║  Self-care through proactive context AI      ║  ",
        "  ║                                              ║  ",
        "  ║   ○∿  ○≈○  ≋○≋   ∿—∿  ≈○≈  —○—  ○◐○  ○∴○   ║  ",
        "  ║                                              ║  ",
        "  ║  lot-systems.com  ·  /u/vadik               ║  ",
        "  ╚══════════════════════════════════════════════╝  ",
    ]
    ay = 85*mm
    c.setFont('Courier', 9)
    c.setFillColor(GREEN)
    for line in art:
        c.drawCentredString(PAGE_W/2, ay, line)
        ay -= 5.5*mm

    c.setFont('Courier', 7)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W/2, 48*mm,
        "© 2025-2026 LOT Systems · All rights reserved · Created by Vadik Marmeladov")
    c.setFont('Courier', 6.5)
    c.setFillColor(DIM)
    c.drawCentredString(PAGE_W/2, 42*mm,
        "Generated: 2026-05-05  ·  Branch: claude/quantum-engine-widgets-RgFfC")


# ─────────────────────────────────────────────────────────────────────────────
#   MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main():
    os.makedirs(os.path.dirname(os.path.abspath(OUT_PATH)), exist_ok=True)
    pdf = LotPDF(os.path.abspath(OUT_PATH))

    print("  Generating LOT Badges & Achievements PDF...")
    page_cover(pdf)
    print("    [1/9] Cover page")
    page_badge_overview(pdf)
    print("    [2/9] Badge overview")
    page_achievements(pdf)
    print("    [3/9] Achievement registry")
    page_evolution(pdf)
    print("    [4/9] Evolution engine")
    page_easter_eggs(pdf)
    print("    [5/9] Easter eggs")
    page_widget_map(pdf)
    print("    [6/9] Widget integration map")
    page_symbol_reference(pdf)
    print("    [7/9] Symbol reference card")
    page_roadmap(pdf)
    print("    [8/9] Implementation roadmap")
    page_closing(pdf)
    print("    [9/9] Closing page")

    pdf.save()
    size = os.path.getsize(os.path.abspath(OUT_PATH))
    print(f"  Done. File size: {size:,} bytes ({size//1024} KB)")


if __name__ == '__main__':
    main()
