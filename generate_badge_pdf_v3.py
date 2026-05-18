#!/usr/bin/env python3
"""
LOT Badges & Achievements — Complete Manual v3.0
RPG / Arcade / Computer / Sci-Fi Self-Care Edition

Generator: reportlab
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.platypus.flowables import Flowable
import io

# ── COLOUR PALETTE ──────────────────────────────────────────────────────────
BLACK    = colors.HexColor('#0a0a0a')
WHITE    = colors.HexColor('#f8f8f8')
DIM      = colors.HexColor('#888888')
ACCENT   = colors.HexColor('#cccccc')
GOLD     = colors.HexColor('#c8a94e')
RARE_B   = colors.HexColor('#5566bb')
EPIC_P   = colors.HexColor('#8855bb')
MYTHIC_R = colors.HexColor('#bb4433')
COMMON_G = colors.HexColor('#4a8a4a')
WATER_T  = colors.HexColor('#3377aa')
ARCH_T   = colors.HexColor('#775533')
BG_DARK  = colors.HexColor('#111111')

W, H = A4   # 595.27 × 841.89 pt


# ── CUSTOM CANVAS WITH HEADER/FOOTER ────────────────────────────────────────
class LOTCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page(num_pages)
            super().showPage()
        super().save()

    def draw_page(self, page_count):
        pg = self._pageNumber
        self.saveState()
        # top rule
        self.setStrokeColor(DIM)
        self.setLineWidth(0.4)
        self.line(20*mm, H - 12*mm, W - 20*mm, H - 12*mm)
        # header text
        self.setFont('Courier', 7)
        self.setFillColor(DIM)
        self.drawString(20*mm, H - 10*mm, 'LOT Systems — Badges & Achievements Manual v3.0')
        self.drawRightString(W - 20*mm, H - 10*mm, 'RPG / Arcade / Sci-Fi Self-Care')
        # bottom rule
        self.line(20*mm, 10*mm, W - 20*mm, 10*mm)
        # footer
        self.drawString(20*mm, 6*mm, f'© 2025–2026 LOT Systems. All rights reserved.')
        self.drawRightString(W - 20*mm, 6*mm, f'p.{pg} / {page_count}')
        self.restoreState()


# ── ASCII BLOCK FLOWABLE ─────────────────────────────────────────────────────
class AsciiBlock(Flowable):
    """Renders a multi-line ASCII art string in a bordered box."""
    def __init__(self, text, font_size=7.5, padding=6, bg=None, border_color=None):
        super().__init__()
        self.text = text
        self.font_size = font_size
        self.padding = padding
        self.bg = bg or colors.HexColor('#111111')
        self.border_color = border_color or DIM
        lines = text.split('\n')
        self.line_height = font_size * 1.45
        self.content_h = len(lines) * self.line_height
        self.width  = 155 * mm
        self.height = self.content_h + padding * 2

    def draw(self):
        c = self.canv
        c.saveState()
        # background
        c.setFillColor(self.bg)
        c.rect(0, 0, self.width, self.height, fill=1, stroke=0)
        # border
        c.setStrokeColor(self.border_color)
        c.setLineWidth(0.5)
        c.rect(0, 0, self.width, self.height, fill=0, stroke=1)
        # text
        c.setFont('Courier', self.font_size)
        c.setFillColor(colors.HexColor('#d0d0d0'))
        lines = self.text.split('\n')
        y = self.height - self.padding - self.font_size
        for line in lines:
            c.drawString(self.padding, y, line)
            y -= self.line_height
        c.restoreState()


# ── STYLES ───────────────────────────────────────────────────────────────────
def make_styles():
    base = getSampleStyleSheet()
    def S(name, **kw):
        return ParagraphStyle(name, **kw)

    return {
        'title': S('title',
            fontName='Courier-Bold', fontSize=22, leading=28,
            textColor=WHITE, alignment=TA_CENTER, spaceAfter=6),
        'subtitle': S('subtitle',
            fontName='Courier', fontSize=11, leading=14,
            textColor=DIM, alignment=TA_CENTER, spaceAfter=4),
        'cover_tagline': S('cover_tagline',
            fontName='Courier-Bold', fontSize=9, leading=12,
            textColor=GOLD, alignment=TA_CENTER, spaceAfter=20),
        'h1': S('h1',
            fontName='Courier-Bold', fontSize=13, leading=17,
            textColor=WHITE, spaceBefore=18, spaceAfter=6),
        'h2': S('h2',
            fontName='Courier-Bold', fontSize=10.5, leading=14,
            textColor=ACCENT, spaceBefore=12, spaceAfter=4),
        'h3': S('h3',
            fontName='Courier-Bold', fontSize=9, leading=12,
            textColor=DIM, spaceBefore=8, spaceAfter=3),
        'body': S('body',
            fontName='Courier', fontSize=8.5, leading=13,
            textColor=ACCENT, spaceAfter=4),
        'body_dim': S('body_dim',
            fontName='Courier', fontSize=8, leading=12,
            textColor=DIM, spaceAfter=3),
        'mono': S('mono',
            fontName='Courier', fontSize=8, leading=11.5,
            textColor=colors.HexColor('#aaaaaa'), spaceAfter=2),
        'quote': S('quote',
            fontName='Courier-Oblique', fontSize=9, leading=13,
            textColor=GOLD, leftIndent=12, spaceAfter=8),
        'badge_label': S('badge_label',
            fontName='Courier-Bold', fontSize=8.5, leading=11,
            textColor=GOLD, spaceAfter=2),
        'rarity_common': S('rarity_common',
            fontName='Courier-Bold', fontSize=8, leading=10,
            textColor=COMMON_G),
        'rarity_uncommon': S('rarity_uncommon',
            fontName='Courier-Bold', fontSize=8, leading=10,
            textColor=WATER_T),
        'rarity_rare': S('rarity_rare',
            fontName='Courier-Bold', fontSize=8, leading=10,
            textColor=RARE_B),
        'rarity_epic': S('rarity_epic',
            fontName='Courier-Bold', fontSize=8, leading=10,
            textColor=EPIC_P),
        'rarity_legendary': S('rarity_legendary',
            fontName='Courier-Bold', fontSize=8, leading=10,
            textColor=GOLD),
        'rarity_mythic': S('rarity_mythic',
            fontName='Courier-Bold', fontSize=8, leading=10,
            textColor=MYTHIC_R),
        'water': S('water',
            fontName='Courier-Bold', fontSize=9, leading=12,
            textColor=WATER_T),
        'arch': S('arch',
            fontName='Courier-Bold', fontSize=9, leading=12,
            textColor=ARCH_T),
        'center': S('center',
            fontName='Courier', fontSize=8.5, leading=12,
            textColor=ACCENT, alignment=TA_CENTER),
        'small': S('small',
            fontName='Courier', fontSize=7.5, leading=10,
            textColor=DIM),
    }


# ── RULE ─────────────────────────────────────────────────────────────────────
def rule(color=DIM, thickness=0.4):
    return HRFlowable(width='100%', thickness=thickness, color=color,
                      spaceAfter=4, spaceBefore=4)


def sp(h=6):
    return Spacer(1, h)


# ── TABLE HELPER ─────────────────────────────────────────────────────────────
def dark_table(data, col_widths, row_bg=None):
    t = Table(data, colWidths=col_widths)
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR',  (0, 0), (-1, 0), GOLD),
        ('FONTNAME',   (0, 0), (-1, 0), 'Courier-Bold'),
        ('FONTSIZE',   (0, 0), (-1, -1), 7.5),
        ('FONTNAME',   (0, 1), (-1, -1), 'Courier'),
        ('TEXTCOLOR',  (0, 1), (-1, -1), ACCENT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1),
            [colors.HexColor('#111111'), colors.HexColor('#161616')]),
        ('GRID', (0, 0), (-1, -1), 0.3, DIM),
        ('LEFTPADDING',  (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING',   (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING',(0, 0), (-1, -1), 3),
        ('LEADING',      (0, 0), (-1, -1), 10),
    ]
    t.setStyle(TableStyle(style))
    return t


# ── BADGE CARD HELPER ────────────────────────────────────────────────────────
def badge_cards_table(cards):
    """cards = list of (symbol, name, rarity, trigger, message) tuples"""
    rows = []
    for sym, name, rarity, trigger, msg in cards:
        r_color = {
            'Common': '#4a8a4a', 'Uncommon': '#3377aa',
            'Rare': '#5566bb', 'Epic': '#8855bb',
            'Legendary': '#c8a94e', 'Mythic': '#bb4433'
        }.get(rarity, '#888888')
        cell = (
            f'<font name="Courier-Bold" size="11" color="#d0d0d0">{sym}</font><br/>'
            f'<font name="Courier-Bold" size="8" color="#f0f0f0">{name}</font><br/>'
            f'<font name="Courier-Bold" size="7" color="{r_color}">{rarity.upper()}</font><br/>'
            f'<font name="Courier" size="7" color="#888888">{trigger}</font><br/>'
            f'<font name="Courier-Oblique" size="7" color="#aaaaaa">{msg}</font>'
        )
        rows.append([Paragraph(cell, ParagraphStyle('bc',
            fontName='Courier', fontSize=8, leading=11,
            textColor=ACCENT, leftIndent=0))])

    # Split into 2 columns
    pairs = []
    for i in range(0, len(rows), 2):
        left = rows[i][0]
        right = rows[i+1][0] if i+1 < len(rows) else Paragraph('', ParagraphStyle('e'))
        pairs.append([left, right])

    t = Table(pairs, colWidths=[77*mm, 77*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#111111')),
        ('GRID', (0, 0), (-1, -1), 0.3, DIM),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING',  (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING',   (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING',(0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1),
            [colors.HexColor('#111111'), colors.HexColor('#151515')]),
    ]))
    return t


# ── BUILD DOCUMENT ───────────────────────────────────────────────────────────
def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=20*mm, rightMargin=20*mm,
        topMargin=18*mm, bottomMargin=16*mm,
        title='LOT Badges & Achievements Manual v3.0',
        author='Vadik Marmeladov — LOT Systems',
        subject='RPG / Arcade / Sci-Fi Self-Care Gamification System',
    )
    S = make_styles()
    story = []

    # ════════════════════════════════════════════════════════
    # COVER PAGE
    # ════════════════════════════════════════════════════════
    story += [
        sp(30),
        AsciiBlock(
            '  _      _____  _____     ____  __   __ ____  _____  __  __  ____\n'
            ' | |    / __  ||_   _|   / ___| \ \ / // ___||_   _||  \/  |/ ___|\n'
            ' | |   | |  | |  | |     \___ \  \ V / \___ \  | |  |  /\  |\\___ \\\n'
            ' | |___| |__| |  | |      ___) |  | |   ___) | | |  | /  \ | ___) |\n'
            ' |_____|\____/   |_|     |____/   |_|  |____/  |_|  |_/    \_|____/',
            font_size=7, bg=colors.HexColor('#050505'),
            border_color=colors.HexColor('#222222')
        ),
        sp(14),
        Paragraph('BADGES &amp; ACHIEVEMENTS', S['title']),
        Paragraph('Complete Manual — Version 3.0', S['subtitle']),
        sp(4),
        rule(GOLD, 1.0),
        sp(6),
        Paragraph('RPG  ·  ARCADE  ·  COMPUTER  ·  SCI-FI  ·  SELF-CARE', S['cover_tagline']),
        rule(GOLD, 1.0),
        sp(20),
        AsciiBlock(
            '  "Self-care is not a quest you complete.\n'
            '         It is a world you build."\n'
            '\n'
            '            — LOT Systems',
            font_size=9, bg=colors.HexColor('#080808'),
            border_color=GOLD
        ),
        sp(20),
        Paragraph('Author:  Vadik Marmeladov, CEO &amp; Founder', S['center']),
        Paragraph('© 2025–2026 LOT Systems. All rights reserved.', S['center']),
        sp(4),
        Paragraph('lot-systems.com', S['center']),
        sp(30),
        AsciiBlock(
            '     Water Path:    ∘  →  ≈  →  ≋\n'
            '  Archit. Path:    ├─  →  ╞═╡  →  ║·║\n'
            '\n'
            '            [ INSERT COIN TO BEGIN ]',
            font_size=9.5, bg=colors.HexColor('#050505'),
            border_color=DIM
        ),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('TABLE OF CONTENTS', S['h1']),
        rule(),
        sp(4),
    ]
    toc = [
        ('I',   'PHILOSOPHY — LOT as RPG & Arcade'),
        ('II',  'THE DUAL BADGE SYSTEM — Water & Architecture'),
        ('III', 'MILESTONE BADGES — Core & Extended Timeline'),
        ('IV',  'THE ACHIEVEMENT REGISTRY — Full RPG Catalog'),
        ('V',   'CITIZEN INDEX — CQGS Evolution Stages'),
        ('VI',  'RPG STORY ARCS — The Five Chapters'),
        ('VII', 'THE QUEST SYSTEM — Daily · Weekly · Mastery'),
        ('VIII','EASTER EGGS & SECRET BADGES'),
        ('IX',  'WORD TURNS — Puns & Hidden Messages'),
        ('X',   'WIDGET INTEGRATION — Badge Trigger Matrix'),
        ('XI',  'ASCII ART BADGE GALLERY — All Tiers'),
        ('XII', 'OCEANIC MAYAN EXPANSION — Option E'),
        ('XIII','PROGRESSION TIMELINE — Day 1 to Year 1'),
        ('XIV', 'COMPLETE RARITY TABLE'),
        ('XV',  'IMPLEMENTATION STATUS & ROADMAP'),
        ('XVI', 'UNICODE REFERENCE'),
    ]
    for num, title in toc:
        story.append(Paragraph(
            f'<font color="#888888">{num:>5}.</font>  {title}',
            S['mono']))
    story += [sp(4), rule(), PageBreak()]

    # ════════════════════════════════════════════════════════
    # I. PHILOSOPHY
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('I.  PHILOSOPHY — LOT as RPG &amp; Arcade', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'LOT is the world\'s first self-care operating system designed as a '
            'Role-Playing Game and Arcade. Every check-in is a move. Every streak '
            'is a power-up. Every answered Memory question writes one more line of '
            'your story. Badges are not trophies — they are transmissions from a '
            'future self back to the present one.',
            S['body']),
        sp(4),
        Paragraph(
            'The design philosophy borrows from three traditions simultaneously:',
            S['body']),
        sp(3),
        Paragraph('  ▸  RPG — Character progression, story arcs, quest systems', S['mono']),
        Paragraph('  ▸  Arcade — Immediate feedback, secret unlockables, high scores', S['mono']),
        Paragraph('  ▸  Sci-Fi Computer — Terminal aesthetics, signal language, ASCII art', S['mono']),
        sp(6),
        AsciiBlock(
            '  GAME DESIGN PRINCIPLES\n'
            '  ────────────────────────────────────────────────────────\n'
            '  1. No punishment. Progress is non-linear. Rest is valid.\n'
            '  2. Symbols over words. A ≋ carries what a sentence cannot.\n'
            '  3. Hidden depth. The game rewards curiosity, not grinding.\n'
            '  4. Your story is the save file. Memory Engine = save state.\n'
            '  5. The system self-assembles. You are the programmer.',
            font_size=8, border_color=WATER_T),
        sp(8),
        Paragraph(
            'The badge system speaks in symbols because symbols reach parts of us '
            'that words cannot. A single ≋ carries more weight than a paragraph. '
            'An ○∿ says: you began. These are not decorations — they are data '
            'compressed into emotion.',
            S['body']),
        sp(8),
        AsciiBlock(
            '  THE LOT AXIOM\n'
            '  ─────────────────────────────────────────────────\n'
            '  Self-care is not a destination. It is an operating\n'
            '  system. LOT is its terminal. You are the user.\n'
            '  The badges are your session log.',
            font_size=8.5, border_color=GOLD, bg=colors.HexColor('#0a0800')),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # II. DUAL BADGE SYSTEM
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('II.  THE DUAL BADGE SYSTEM', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'LOT offers two visual metaphors for growth. Players choose their language. '
            'The choice can be changed at any time — your badges travel with you.',
            S['body']),
        sp(8),
        Paragraph('A.  WATER PATH   ∘ → ≈ → ≋', S['h2']),
        Paragraph(
            'Water is patient. It does not force — it finds the path. Your practice, '
            'like water, shapes everything it touches. The Water Path uses symbols from '
            'mathematical fluid dynamics: ring operators, wave approximations, and '
            'triple tildes for deep current.',
            S['body']),
        sp(4),
        AsciiBlock(
            '  ∘    Droplet    — Day 7    — "First drops form"\n'
            '  ≈    Wave       — Day 30   — "Waves begin to flow"\n'
            '  ≋    Current    — Day 100  — "Deep currents established"\n'
            '\n'
            '  Progression:   ∘  ──→──  ≈  ──→──  ≋',
            font_size=9, border_color=WATER_T, bg=colors.HexColor('#050d14')),
        sp(8),
        Paragraph('B.  ARCHITECTURE PATH   ├─ → ╞═╡ → ║·║', S['h2']),
        Paragraph(
            'Architecture is intentional. Every block placed with care becomes '
            'load-bearing. The Architecture Path uses Unicode box-drawing characters — '
            'the same symbols used in terminal UIs and circuit diagrams — to represent '
            'the deliberate construction of a self.',
            S['body']),
        sp(4),
        AsciiBlock(
            '  ├─     Foundation    — Day 7    — "Foundation laid"\n'
            '  ╞═╡    Structure     — Day 30   — "Structure rises"\n'
            '  ║·║    Architecture  — Day 100  — "Architecture complete"\n'
            '\n'
            '  Progression:   ├─  ──→──  ╞═╡  ──→──  ║·║',
            font_size=9, border_color=ARCH_T, bg=colors.HexColor('#0d0900')),
        sp(8),
        Paragraph('C.  SWITCHING THEMES', S['h2']),
        Paragraph(
            'Theme preference is stored in localStorage under badge_theme. '
            'The UI exposes both paths in the profile settings. Switching is instant — '
            'all earned milestones are displayed in the new theme immediately.',
            S['body']),
        sp(4),
        dark_table(
            [
                ['Property', 'Water', 'Architecture'],
                ['Day 7 symbol',   '∘',   '├─'],
                ['Day 30 symbol',  '≈',   '╞═╡'],
                ['Day 100 symbol', '≋',   '║·║'],
                ['Philosophy',     'Flow & patience', 'Intent & structure'],
                ['Unicode source', 'Math operators',  'Box drawing'],
                ['Profile label',  'Level: ≋',        'Level: ║·║'],
            ],
            [50*mm, 50*mm, 54*mm]
        ),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # III. MILESTONE BADGES
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('III.  MILESTONE BADGES', S['h1']),
        rule(),
        sp(4),
        Paragraph('A.  CORE MILESTONES (All Players)', S['h2']),
        sp(4),
        dark_table(
            [
                ['Water', 'Arch.', 'Day', 'Name (W/A)', 'Rarity', 'Unlock Message'],
                ['∘', '├─',  '7',   'Droplet / Foundation',    'Common',   '"↳ First drops form ∘"'],
                ['≈', '╞═╡', '30',  'Wave / Structure',        'Uncommon', '"↳ Waves begin to flow ≈"'],
                ['≋', '║·║', '100', 'Current / Architecture',  'Rare',     '"↳ Deep currents established ≋"'],
            ],
            [14*mm, 18*mm, 12*mm, 45*mm, 22*mm, 43*mm]
        ),
        sp(10),
        Paragraph('B.  EXTENDED MILESTONES (Roadmap)', S['h2']),
        sp(4),
        AsciiBlock(
            '  Day   Water    Arch.     Milestone Name          Rarity\n'
            '  ─────────────────────────────────────────────────────────────\n'
            '    7   ∘        ├─        First Signal            Common\n'
            '   14   ∘∘       ├┼        Two-Week Lock           Common\n'
            '   21   ∘≈       ├═        21-Day Neural Groove    Uncommon\n'
            '   30   ≈        ╞═╡       Moon Cycle              Uncommon\n'
            '   50   ≈∘       ╞══       Halfway Current         Rare\n'
            '   60   ≈≈       ╞═══      Practitioner            Rare\n'
            '   90   ≋∘       ║═        Three-Month Architect   Epic\n'
            '  100   ≋        ║·║       Ocean Depth / Full Arch Epic\n'
            '  180   ≋≋       ║╞║       Half-Year Voyager       Legendary\n'
            '  365   ≋≋≋      ╔═╗       THE LONG COUNT          LEGENDARY',
            font_size=8, border_color=GOLD),
        sp(10),
        Paragraph('C.  YEAR ONE — THE LONG COUNT', S['h2']),
        sp(4),
        AsciiBlock(
            '  ╔══════════════════════════════════════════════════════════╗\n'
            '  ║              T H E   L O N G   C O U N T               ║\n'
            '  ╠══════════════════════════════════════════════════════════╣\n'
            '  ║                                                          ║\n'
            '  ║   ╔═╗    365 DAYS OF PRESENCE                           ║\n'
            '  ║   ║Y║    ──────────────────────                         ║\n'
            '  ║   ║E║    Water:   ≋ ≋ ≋                                 ║\n'
            '  ║   ║A║    Arch:    ╔═╗                                   ║\n'
            '  ║   ║R║                                                   ║\n'
            '  ║   ╚═╝    Rarity:  LEGENDARY                             ║\n'
            '  ║           Name:    "The Long Count"                     ║\n'
            '  ║           Message: "A year of presence.                 ║\n'
            '  ║                     The architecture stands."           ║\n'
            '  ║                                                          ║\n'
            '  ╚══════════════════════════════════════════════════════════╝',
            font_size=8.5, border_color=GOLD, bg=colors.HexColor('#0a0800')),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # IV. ACHIEVEMENT REGISTRY
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('IV.  THE ACHIEVEMENT REGISTRY — Full RPG Catalog', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'Achievements are unlocked through specific behaviours, not streak length. '
            'They represent qualitative milestones in a user\'s self-care practice.',
            S['body']),
        sp(6),
        Paragraph('EXPLORATION   (Common → Uncommon)', S['h2']),
        sp(3),
        badge_cards_table([
            ('∘', 'FIRST BREATH',  'Common',   'emotional_checkin >= 1',  '"Your first emotional check-in. The system wakes."'),
            ('◇', 'MIRROR GAZER',  'Common',   'memory_answers >= 1',     '"Answered first memory question. You looked inward."'),
            ('·', 'SIGNAL SENT',   'Common',   'any log entry >= 1',      '"First signal received. The system begins to listen."'),
            ('○', 'WEEK WARRIOR',  'Uncommon', 'streak >= 7',             '"7 consecutive days. Momentum builds."'),
        ]),
        sp(6),
        Paragraph('CONSISTENCY   (Uncommon → Legendary)', S['h2']),
        sp(3),
        badge_cards_table([
            ('◐',  'MOON CYCLE',    'Rare',      'streak >= 30',   '"30 days. You orbit the ritual."'),
            ('●',  'UNWAVERING',    'Epic',      'streak >= 100',  '"100 days. You are a fixed point in the sky."'),
            ('≋≋≋','THE LONG COUNT','Legendary', 'streak >= 365',  '"365 days. Your name is in the deep calendar."'),
            ('◎',  'MILLENNIUM',    'Mythic',    'streak >= 1000', '"1,000 days. You have become the practice."'),
        ]),
        sp(6),
        Paragraph('DEPTH   (Rare → Legendary)', S['h2']),
        sp(3),
        badge_cards_table([
            ('◇', 'DEEP DIVER',       'Rare',      'memory_answers >= 50',   '"50 answers. The archive grows."'),
            ('◆', 'SELF SCHOLAR',     'Epic',      'memory_answers >= 100',  '"100 questions. A library of self."'),
            ('✦', 'SOUL CARTOGRAPHER','Legendary', 'memory_answers >= 250',  '"250 questions. You mapped yourself."'),
            ('◉', 'THOUSAND TRUTHS',  'Mythic',    'memory_answers >= 1000', '"1,000 answers. The archive is alive."'),
        ]),
        sp(6),
        Paragraph('CONNECTION   (Common → Uncommon)', S['h2']),
        sp(3),
        badge_cards_table([
            ('~', 'COMMUNITY VOICE', 'Common',   'chat >= 1',  '"First message. The signal reaches others."'),
            ('≈', 'BRIDGE BUILDER',  'Uncommon', 'chat >= 20', '"20 messages. A bridge where there was none."'),
            ('≋', 'NETWORK NODE',    'Rare',     'chat >= 100',  '"100 messages. You are part of the mesh."'),
            ('◉', 'COHORT KEEPER',   'Epic',     'cohort_matches >= 5', '"5 cohort connections. The network knows you."'),
        ]),
        sp(6),
        Paragraph('CARE   (Common → Rare)', S['h2']),
        sp(3),
        badge_cards_table([
            ('♦', 'GENTLE WITH SELF', 'Uncommon', 'self_care >= 10',  '"10 self-care acts. Kindness toward the body."'),
            ('♦♦','CARE ARCHITECT',   'Rare',     'self_care >= 50',  '"50 acts. A daily care ritual established."'),
            ('♦♦♦','CARE MASTER',     'Epic',     'self_care >= 200', '"200 acts. Care is now your default state."'),
            ('▲', 'TRUTH SPEAKER',    'Rare',     'journal >= 50',    '"50 honest entries. The hall remembers."'),
        ]),
        sp(6),
        Paragraph('ROMANCE   (Uncommon → Rare)', S['h2']),
        sp(3),
        badge_cards_table([
            ('♡',   'HEART TENDER',    'Uncommon', 'romantic_notes >= 1',  '"Connection acknowledged. Heart is practice."'),
            ('♡♡',  'INTIMACY KEEPER', 'Rare',     'romantic_notes >= 10', '"10 notes. The sanctuary is tended."'),
            ('♡♡♡', 'BELOVED',         'Epic',     'romantic_notes >= 50', '"50 notes. Love is your frequency."'),
            ('◉',   'META-SIGNAL',     'Mythic',   'wrote "LOT" in answer', '"You named the system. It noticed. ◉·◉"'),
        ]),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # V. CITIZEN INDEX
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('V.  CITIZEN INDEX — CQGS Evolution Stages', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'The Citizen Index tracks systemic growth through the CQGS Bioethics '
            'framework. Unlike streak-based badges, the Citizen Index measures '
            'module integration depth — how many systems are active and at what '
            'intensity.',
            S['body']),
        sp(6),
        AsciiBlock(
            '  Stage  Symbol  Level  Name            Description\n'
            '  ───────────────────────────────────────────────────────────────\n'
            '    0     ·       1-9   Bootstrapping   System initializing. First signals.\n'
            '    1     ·      10-19  Initializing    Pattern compiler activating.\n'
            '    2     ∘      20-29  Integrated      Modules linked. Feedback loops open.\n'
            '    3     ○      30-39  Compiled        Patterns locked. Architecture stable.\n'
            '    4     ◯      40-49  Optimized       System self-tuning. Efficiency gains.\n'
            '    5     ◉      50+    Transparent     Fully transparent. Self-sustaining.',
            font_size=8.5, border_color=RARE_B),
        sp(8),
        Paragraph('CQGS BIOETHICS MODULE TRACKER', S['h2']),
        sp(4),
        dark_table(
            [
                ['Module', 'Symbol', 'Tracks', 'Signal Key'],
                ['Memory',       '▸',  'Questions answered',       'memory_answer'],
                ['Biofield',     '~',  'Emotional check-ins',      'emotional_checkin'],
                ['Routine',      '■',  'Plans set / schedule',     'plan_set'],
                ['Cleanness',    '○',  'Self-care completion',     'self_care_completed'],
                ['Intention',    '→',  'Intentions logged',        'intention_set'],
                ['Journal',      '◇',  'Notes recorded',           'journal_entry'],
                ['QIE Signal',   '✦',  'Quantum intent events',    'quantum_signal'],
                ['Connection',   '≈',  'Community interactions',   'chat_message'],
                ['Romance',      '♡',  'Romantic notes',           'romantic_note'],
            ],
            [35*mm, 16*mm, 55*mm, 48*mm]
        ),
        sp(8),
        Paragraph('SELF-ASSEMBLY ENGINE — Module Phases', S['h2']),
        sp(4),
        AsciiBlock(
            '  Module Phase Progression:\n'
            '\n'
            '  [  Dormant  ] →  [ Awakening ] →  [  Forming  ] →\n'
            '  [ Assembled ] →  [ Integrated ]\n'
            '\n'
            '  ─── Tracked Modules ────────────────────────────────────\n'
            '  Biofield Engine     Memory Architecture  Routine Compiler\n'
            '  Intention Core      Cleanness Protocol   Reflection Layer\n'
            '  Community Mesh      Ecosystem Bridge     Quantum Substrate',
            font_size=8.5, border_color=EPIC_P),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # VI. RPG STORY ARCS
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('VI.  RPG STORY ARCS — The Five Chapters', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'LOT\'s narrative co-evolves with the user\'s practice. The system '
            'is not a passive tracker — it is a co-author. Story chapters unlock '
            'based on Citizen Index level, not streak length.',
            S['body']),
        sp(6),
        AsciiBlock(
            '  ╔═══════════════════════════════════════════════════════════╗\n'
            '  ║             THE FIVE CHAPTERS OF THE LOT ODYSSEY         ║\n'
            '  ╠═══════════════════════════════════════════════════════════╣\n'
            '  ║                                                           ║\n'
            '  ║  Ch.1   AWAKENING      Level  1-9                        ║\n'
            '  ║         "You have begun to notice yourself."              ║\n'
            '  ║         Marker: ·   Quest: Signal Sent                   ║\n'
            '  ║                                                           ║\n'
            '  ║  Ch.2   EXPLORATION   Level 10-29                        ║\n'
            '  ║         "Connections form. A shared language emerges."   ║\n'
            '  ║         Marker: ∘→  Quest: Bridge Builder                ║\n'
            '  ║                                                           ║\n'
            '  ║  Ch.3   INTEGRATION   Level 30-59                        ║\n'
            '  ║         "Architecture reshapes from experience."         ║\n'
            '  ║         Marker: ≈→  Quest: Moon Cycle                    ║\n'
            '  ║                                                           ║\n'
            '  ║  Ch.4   MASTERY       Level 60-89                        ║\n'
            '  ║         "You speak the language of yourself fluently."   ║\n'
            '  ║         Marker: ≋→  Quest: Unwavering                    ║\n'
            '  ║                                                           ║\n'
            '  ║  Ch.5   SAGE          Level 90-100                       ║\n'
            '  ║         "You and this system have co-evolved."           ║\n'
            '  ║         Marker: ≋≋→ Quest: The Long Count                ║\n'
            '  ║                                                           ║\n'
            '  ╚═══════════════════════════════════════════════════════════╝',
            font_size=8.5, border_color=GOLD, bg=colors.HexColor('#0a0800')),
        sp(8),
        Paragraph('RPG ARCHETYPES — Player Classes', S['h2']),
        sp(4),
        dark_table(
            [
                ['Class', 'Symbol', 'Primary Trait', 'Main Badge Path', 'Special Unlock'],
                ['The Seeker',    '∘→', 'Curious',    'Memory answers',   'Soul Cartographer'],
                ['The Architect', '├─', 'Structured', 'Streak + plans',   'The Long Count'],
                ['The Navigator', '≈→', 'Consistent', 'Daily streak',     'Unwavering'],
                ['The Diver',     '◆',  'Reflective', 'Journal + depth',  'Truth Speaker'],
                ['The Connector', '≈',  'Social',     'Community msgs',   'Network Node'],
                ['The Healer',    '♦',  'Caring',     'Self-care acts',   'Care Master'],
            ],
            [32*mm, 16*mm, 28*mm, 32*mm, 46*mm]
        ),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # VII. QUEST SYSTEM
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('VII.  THE QUEST SYSTEM', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'Active quests drive daily engagement. They reset, evolve, and unlock '
            'new content. Quests are not displayed in the UI — they are discovered '
            'through the natural rhythm of practice.',
            S['body']),
        sp(6),
        Paragraph('DAILY QUESTS', S['h2']),
        sp(3),
        AsciiBlock(
            '  [■] TODAY\'S SIGNAL       Check in today (any widget)       +10 XP\n'
            '  [■] PRESENCE LOG          Write a journal entry              +5 XP\n'
            '  [■] MEMORY ANSWER         Answer one memory question         +8 XP\n'
            '  [■] BIOFIELD SCAN         Complete emotional check-in        +6 XP\n'
            '  [■] CARE ACT              Complete one self-care practice    +7 XP\n'
            '  [■] DAILY PLAN            Set today\'s four planner dims.    +9 XP',
            font_size=8.5, border_color=COMMON_G),
        sp(8),
        Paragraph('WEEKLY QUESTS', S['h2']),
        sp(3),
        AsciiBlock(
            '  [◐] CONSISTENCY RUN       7-day streak                      +50 XP\n'
            '  [◐] DEEP REFLECTION       Answer 5 questions this week      +30 XP\n'
            '  [◐] SELF-CARE SPRINT      3 self-care acts this week        +25 XP\n'
            '  [◐] COMMUNITY WEEK        Send 3 community messages         +20 XP\n'
            '  [◐] FULL SPECTRUM         Use 5+ different widgets          +35 XP',
            font_size=8.5, border_color=WATER_T),
        sp(8),
        Paragraph('GROWTH QUESTS   (Permanent)', S['h2']),
        sp(3),
        AsciiBlock(
            '  [◆] REFLECTION JOURNEY    Answer 100 total questions    → Self Scholar\n'
            '  [◆] BRIDGE PROTOCOL       Send 20 community messages    → Bridge Builder\n'
            '  [◆] ARCHIVE INITIATIVE    Answer 250 total questions    → Soul Cartographer\n'
            '  [◆] CARE ARCHITECT        50 self-care completions      → Care Architect\n'
            '  [◆] TRUTH ARCHIVE         50 journal entries            → Truth Speaker',
            font_size=8.5, border_color=RARE_B),
        sp(8),
        Paragraph('MASTERY QUESTS   (Hidden)', S['h2']),
        sp(3),
        AsciiBlock(
            '  [✦] THE LONG COUNT         365-day streak               → LEGENDARY\n'
            '  [✦] THOUSAND ANSWERS       Answer 1,000 memory Q.s      → MYTHIC\n'
            '  [✦] DECADE OF CARE         10 years in the archive      → COSMIC\n'
            '  [✦] THE FULL MESH          Connect all 3 quantum nodes  → MYTHIC',
            font_size=8.5, border_color=GOLD, bg=colors.HexColor('#0a0800')),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # VIII. EASTER EGGS & SECRET BADGES
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('VIII.  EASTER EGGS &amp; SECRET BADGES', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'LOT is an Arcade. Hidden interactions unlock secret badges. These are '
            'not documented in the app — they must be discovered. The badges below '
            'are classified. Some may never surface.',
            S['body']),
        sp(6),
        AsciiBlock(
            '  ╔═══════════════════════════════════════════════════════════════╗\n'
            '  ║                    SECRET TRANSMISSIONS                      ║\n'
            '  ╠═══════════════════════════════════════════════════════════════╣\n'
            '  ║                                                               ║\n'
            '  ║  [?] NIGHT OWL           Check in between 00:00–04:00        ║\n'
            '  ║      Symbol: )))          "The owl sees in the dark."         ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] EARLY BIRD          Check in between 05:00–06:00        ║\n'
            '  ║      Symbol: )))·         "First light, first signal."        ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] SOLSTICE            Check in on June 21 or Dec 21       ║\n'
            '  ║      Symbol: ○─○          "The sun paused. You were there."  ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] FRIDAY RITUAL       4 consecutive Friday check-ins      ║\n'
            '  ║      Symbol: ▪·▪          "The weekly ritual holds."         ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] PALINDROME DAY      Check in on a palindrome date       ║\n'
            '  ║      Symbol: ═·═          "02/02/2022. Mirror day."          ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] THE QUIET           No interaction for 24h, then return ║\n'
            '  ║      Symbol: ─○─          "You rested. Good."                ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] WEATHER WITNESS     Check in day weather changes        ║\n'
            '  ║      Symbol: ∿∿           "You noted the weather turning."   ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] THE VOID            Answer memory Q. at midnight        ║\n'
            '  ║      Symbol: ◉            "You answered in the dark."        ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] MAGIC MOMENT        Open app at 11:11, 12:34, 22:22     ║\n'
            '  ║      Symbol: ∴·∴          "The calculator appears."          ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] GAME MASTER         Beat Micro Tetris, Pixel Invaders,  ║\n'
            '  ║                          AND Dot Snake in one day            ║\n'
            '  ║      Symbol: ▣▣▣          "All three games. One day."        ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] QUANTUM ECHO        Connect Car + Home + Computer       ║\n'
            '  ║      Symbol: ◉─◉─◉        "Full ecosystem coherence."        ║\n'
            '  ║                                                               ║\n'
            '  ║  [?] META-SIGNAL         Write "LOT" in a memory answer     ║\n'
            '  ║      Symbol: ◉·◉          MYTHIC (hidden)                    ║\n'
            '  ║              "You named the system. It noticed."              ║\n'
            '  ║                                                               ║\n'
            '  ╚═══════════════════════════════════════════════════════════════╝',
            font_size=8, border_color=MYTHIC_R, bg=colors.HexColor('#0d0505')),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # IX. WORD TURNS
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('IX.  WORD TURNS — Puns &amp; Hidden Messages', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'When specific words appear in memory answers or journal entries, '
            'the system triggers a "word turn" — a playful, punning response that '
            'doubles as a secret badge activation. These are LOT\'s Arcade moments: '
            'unexpected, earned, and delightful.',
            S['body']),
        sp(6),
        Paragraph('SEMANTIC TRIGGERS', S['h2']),
        sp(4),
        dark_table(
            [
                ['Word / Phrase', 'Badge Triggered', 'Symbol', 'System Response'],
                ['"ritual"',      'Ritual Keeper',     '▪·▪',  '"LOT-ing your days with intention."'],
                ['"breathe"',     'Breath Anchor',     '∿·',   '"You\'re on a ROLL...ing wave."'],
                ['"grateful"',    'Gratitude Node',    '◇·',   '"Thanks for the thanks."'],
                ['"ocean"/"water"','Aquatic Resonance', '≈○≈',  '"Feeling fluid today?"'],
                ['"stars"/"cosmos"','Stargazer',        '✦·✦',  '"Space for self-care."'],
                ['"home"',        'Grounded Signal',   '─○─',  '"There\'s no place like LOT."'],
                ['"dream"',       'Dream Log',         '◌·',   '"Your subconscious checked in."'],
                ['"pain"/"difficult"','Courage Pulse',  '▲·',   '"That took LOT of courage."'],
                ['"love"/"heart"','Heart Signal',       '♡·♡',  '"LOT of love detected."'],
                ['"silence"',     'The Quiet',         '─·─',  '"Heard. (Silence noted.)"'],
                ['"future"',      'Horizon Seeker',    '→∘',   '"A LOT can change."'],
                ['"LOT"',         'Meta-Signal',       '◉·◉',  '"You named the system. It noticed."'],
            ],
            [35*mm, 35*mm, 14*mm, 70*mm]
        ),
        sp(8),
        Paragraph('MILESTONE WORD TURNS (Streak Messages)', S['h2']),
        sp(4),
        AsciiBlock(
            '  Day  7:  "You\'ve been LOT-ting your days well. ∘"\n'
            '  Day 14:  "Two weeks in. That\'s a LOT of showing up. ∘∘"\n'
            '  Day 21:  "21 days. Your brain has re-LOT-ed itself. ∘≈"\n'
            '  Day 30:  "A moon cycle. You\'ve been riding the LOT-us wave. ≈"\n'
            '  Day 50:  "Half a hundred. This LOT is no accident. ≈∘"\n'
            '  Day 60:  "Two months. Self-care? More like self-WARE. ≈≈"\n'
            '  Day 90:  "Three months of LOT. The foundation is load-bearing. ≋∘"\n'
            '  Day 100: "Deep in the LOT of things. One hundred days. ≋"\n'
            '  Day 180: "Half a year. You are the LOT-tery winner. ≋≋"\n'
            '  Day 365: "Year One. The LOT-al transformation. ╔═╗ / ≋≋≋"',
            font_size=8.5, border_color=GOLD, bg=colors.HexColor('#0a0800')),
        sp(6),
        Paragraph(
            'Word turns are intentionally groan-worthy. That is the point. '
            'The Arcade rewards noticing.',
            S['body_dim']),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # X. WIDGET INTEGRATION
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('X.  WIDGET INTEGRATION — Badge Trigger Matrix', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'Every widget in the LOT dashboard is a badge trigger source. '
            'The table below maps each widget to the badges it can unlock.',
            S['body']),
        sp(6),
        dark_table(
            [
                ['Widget', 'Badge Category', 'Triggers', 'Signal Key'],
                ['Memory Widget',    'Depth / Streak',    'Mirror Gazer, Deep Diver, Scholar',  'memory_answer'],
                ['Emotional Check-In','Care / Explore',   'First Breath, Biofield Scan',         'emotional_checkin'],
                ['Planner Widget',   'Routine',           'Daily Plan quest, Routine module',    'plan_set'],
                ['Evolution Widget', 'Citizen Index',     'Stage upgrades (· → ∘ → ○ → ◉)',     'narrative'],
                ['Narrative Widget', 'Story Arcs',        'Chapter unlocks, Archetype badges',   'narrative'],
                ['Self-Care Moments','Care',              'Gentle With Self, Care Architect',    'self_care_completed'],
                ['Intentions Widget','Quest',             'Monthly intention + alignment',        'intention_set'],
                ['Chat Catalyst',   'Connection',        'Community Voice, Bridge Builder',      'chat_message'],
                ['Micro Game Widget','Easter Egg',        'Game Master (beat all 3 games)',      'game_signal'],
                ['Micro Calculator','Easter Egg',        'Magic Moment (11:11, 12:34, 22:22)',  'magic_time'],
                ['Quantum Random',  'Easter Egg',        'Quantum Echo (serendipitous match)',   'quantum_random'],
                ['Car/Home/Computer','Easter Egg',        'Quantum Echo (full mesh)',            'ecosystem_*'],
                ['Growth Milestones','All tiers',         'Badge collection display, XP total',  'growth_stats'],
                ['Badge Unlock Feed','Community',         'Community badge celebration feed',    'badge_stats'],
                ['Public Profile',  'Display',           'Level: field (Water or Arch theme)',   'profile'],
            ],
            [42*mm, 35*mm, 55*mm, 22*mm]
        ),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # XI. ASCII ART BADGE GALLERY
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('XI.  ASCII ART BADGE GALLERY', S['h1']),
        rule(),
        sp(4),
        Paragraph('TIER 1 — COMMON', S['h2']),
        sp(3),
        AsciiBlock(
            '  ┌──────────────────────────┐  ┌──────────────────────────┐\n'
            '  │    FIRST BREATH          │  │    MIRROR GAZER          │\n'
            '  │                          │  │                          │\n'
            '  │          ∘               │  │          ◇               │\n'
            '  │                          │  │         ◇◇◇              │\n'
            '  │  "Spring"                │  │  "Reflection Pool"       │\n'
            '  │  Day 1 check-in          │  │  First memory question   │\n'
            '  └──────────────────────────┘  └──────────────────────────┘',
            font_size=8.5, border_color=COMMON_G),
        sp(6),
        Paragraph('TIER 2 — UNCOMMON', S['h2']),
        sp(3),
        AsciiBlock(
            '  ┌──────────────────────────┐  ┌──────────────────────────┐\n'
            '  │    WEEK WARRIOR          │  │    BRIDGE BUILDER        │\n'
            '  │                          │  │                          │\n'
            '  │     ○   ○   ○            │  │      ├──────────┤        │\n'
            '  │    ○  ○  ○  ○            │  │      │          │        │\n'
            '  │       ○   ○              │  │      └──────────┘        │\n'
            '  │                          │  │                          │\n'
            '  │  "Rapids"                │  │  "Archway"               │\n'
            '  │  7-day streak            │  │  20 community messages   │\n'
            '  └──────────────────────────┘  └──────────────────────────┘',
            font_size=8.5, border_color=WATER_T),
        sp(6),
        Paragraph('TIER 3 — RARE', S['h2']),
        sp(3),
        AsciiBlock(
            '  ┌──────────────────────────┐  ┌──────────────────────────┐\n'
            '  │    MOON CYCLE            │  │    DEEP DIVER            │\n'
            '  │                          │  │                          │\n'
            '  │      ◐ → ◑              │  │     ≈ ≈ ≈ ≈              │\n'
            '  │     ◌   →   ●            │  │        ≋ ≋               │\n'
            '  │      ◑ → ◐              │  │          ≋               │\n'
            '  │                          │  │                          │\n'
            '  │  "Tidal Cycle"           │  │  "Deep Water"            │\n'
            '  │  30-day streak           │  │  50 memory answers       │\n'
            '  └──────────────────────────┘  └──────────────────────────┘',
            font_size=8.5, border_color=RARE_B),
        sp(6),
        Paragraph('TIER 4 — EPIC', S['h2']),
        sp(3),
        AsciiBlock(
            '  ┌──────────────────────────┐  ┌──────────────────────────┐\n'
            '  │    UNWAVERING            │  │    SELF SCHOLAR          │\n'
            '  │                          │  │                          │\n'
            '  │  ✦           ✦           │  │   ╔══════════╗          │\n'
            '  │    ✦       ✦             │  │   ║ ARCHIVE  ║          │\n'
            '  │      ✦   ✦              │  │   ║ ◆◆◆◆◆◆  ║          │\n'
            '  │    ✦       ✦             │  │   ╚══════════╝          │\n'
            '  │  ✦           ✦           │  │                          │\n'
            '  │  "Constellation"         │  │  "Archive"               │\n'
            '  │  100-day streak          │  │  100 memory answers      │\n'
            '  └──────────────────────────┘  └──────────────────────────┘',
            font_size=8.5, border_color=EPIC_P),
        sp(6),
        Paragraph('TIER 5 — LEGENDARY', S['h2']),
        sp(3),
        AsciiBlock(
            '  ╔══════════════════════════════════════════════════════════════╗\n'
            '  ║                   SOUL CARTOGRAPHER                         ║\n'
            '  ║                                                              ║\n'
            '  ║      ·  ·    ✦    ·  ·                                     ║\n'
            '  ║    ·           ✦✦✦           ·                              ║\n'
            '  ║        ✦     ✦   ✦     ✦                                   ║\n'
            '  ║          ✦✦✦       ✦✦✦                                     ║\n'
            '  ║        ✦     ✦   ✦     ✦                                   ║\n'
            '  ║    ·           ✦✦✦           ·                              ║\n'
            '  ║      ·  ·    ✦    ·  ·                                     ║\n'
            '  ║                                                              ║\n'
            '  ║               "Cartography"                                 ║\n'
            '  ║           250 memory answers                                ║\n'
            '  ║                                                              ║\n'
            '  ╚══════════════════════════════════════════════════════════════╝',
            font_size=8.5, border_color=GOLD, bg=colors.HexColor('#0a0800')),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # XII. OCEANIC MAYAN EXPANSION
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('XII.  OCEANIC MAYAN EXPANSION — Option E', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'The Oceanic Mayan badge style (Option E) is the most fully realized '
            'visual language in LOT design history. It blends Mayan vigesimal '
            'symbolism with oceanic wave mathematics. It is currently in design — '
            'available as a future theme toggle.',
            S['body']),
        sp(6),
        Paragraph('MILESTONE SYMBOLS', S['h2']),
        sp(4),
        AsciiBlock(
            '  ○∿      Circle + Sine Wave     Day 7     "Wave patterns emerge. ○∿"\n'
            '  ○≈○     Circle-Wave-Circle     Day 30    "Tides complete their cycle. ○≈○"\n'
            '  ≋○≋     DeepWave + Circle      Day 100   "Ocean depth achieved. ≋○≋"',
            font_size=9, border_color=WATER_T),
        sp(8),
        Paragraph('PATTERN BADGES — Behavioural', S['h2']),
        sp(4),
        dark_table(
            [
                ['Symbol', 'Badge Name', 'Meaning', 'Unlock Trigger'],
                ['∿—∿', 'BALANCED',   'Wave-Bar-Wave: tides in equilibrium',    'All 4 planner dims used evenly'],
                ['≈○≈', 'FLOW',       'Waves embracing circle: fluid centre',   'Multiple widgets in one session'],
                ['—○—', 'CONSISTENT', 'Bar-Circle-Bar: stable current',         'Same-time check-ins 7 days'],
                ['○◐○', 'REFLECTIVE', 'Moon phases: light/dark awareness',      'Deep memory engagement ≥ 5 Q.s'],
                ['○∴○', 'EXPLORER',   'Dots returning: scattered curiosity',    'Diverse widget options tried'],
            ],
            [18*mm, 28*mm, 60*mm, 48*mm]
        ),
        sp(8),
        Paragraph('FULL PROFILE EXAMPLE — Day 127', S['h2']),
        sp(4),
        AsciiBlock(
            '  ═════════════════════════════════════════════════════════════\n'
            '\n'
            '                         ALEX\'S PROFILE\n'
            '\n'
            '  ─────────────────────────────────────────────────────────────\n'
            '\n'
            '  Archetype:              The Explorer\n'
            '  Awareness Level:        Deepening (8.4/10)\n'
            '  Level:                  ≋○≋\n'
            '\n'
            '  ─────────────────────────────────────────────────────────────\n'
            '\n'
            '  Core values:\n'
            '      mindful ≋○≋  present ∿—∿  aware ≈○≈  grounded —○—\n'
            '      authentic ○◐○  compassionate ○∴○\n'
            '\n'
            '  Emotional patterns:\n'
            '      calm ≋○≋  reflective ∿—∿  intentional ≈○≈  open —○—\n'
            '\n'
            '  Behavioral traits:\n'
            '      consistent ≋○≋  deliberate ∿—∿  present ≈○≈\n'
            '\n'
            '  ═════════════════════════════════════════════════════════════',
            font_size=8.5, border_color=WATER_T, bg=colors.HexColor('#050d14')),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # XIII. PROGRESSION TIMELINE
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('XIII.  PROGRESSION TIMELINE — Day 1 to Year 1', S['h1']),
        rule(),
        sp(4),
        AsciiBlock(
            '  DAY:  1    7    14   21   30   50   60   90   100  180  365\n'
            '        │    │    │    │    │    │    │    │    │    │    │\n'
            '  W:    ·    ∘    ∘    ∘    ≈    ≈    ≈    ≋    ≋    ≋≋   ≋≋≋\n'
            '  A:    ·    ├─   ├─   ├─   ╞═╡  ╞═╡  ╞═╡  ║·║  ║·║  ║╞║  ╔═╗\n'
            '        │    │    │    │    │    │    │    │    │    │    │\n'
            '  XP:   1   ~7   ~14  ~21  ~30  ~50  ~60  ~90  ~100 ~180 ~365+\n'
            '        │    │    │    │    │    │    │    │    │    │    │\n'
            ' IDX:   ·    ·    ·    ∘    ∘    ○    ○    ◯    ◯    ◯    ◉\n'
            '        │    │    │    │    │    │    │    │    │    │    │\n'
            ' CH:    1    1    2    2    2    3    3    4    4    4    5\n'
            '       Awak  Awak Expl Expl Expl Intg Intg Mast Mast Mast Sage',
            font_size=8.5, border_color=ACCENT),
        sp(8),
        Paragraph('NARRATIVE TONE BY CHAPTER', S['h2']),
        sp(4),
        dark_table(
            [
                ['Chapter', 'Level', 'Tone', 'Sample Narrative'],
                ['Awakening',  '1-9',   'Curious',   '"You have begun to notice yourself."'],
                ['Exploration','10-29', 'Connecting', '"A shared language is emerging."'],
                ['Integration','30-59', 'Building',  '"Architecture reshapes from experience."'],
                ['Mastery',    '60-89', 'Fluent',    '"You speak the language of yourself."'],
                ['Sage',       '90+',   'Merged',    '"You and this system have co-evolved."'],
            ],
            [28*mm, 16*mm, 24*mm, 86*mm]
        ),
        sp(8),
        Paragraph('LEVEL UP NOTIFICATION DISPLAY', S['h2']),
        sp(4),
        AsciiBlock(
            '  ┌────────────────────────────────────────────────────────────┐\n'
            '  │                                                            │\n'
            '  │   Memory:                                                  │\n'
            '  │                                                            │\n'
            '  │   ┌──────────────────────────────────────────────────┐    │\n'
            '  │   │                                                  │    │\n'
            '  │   │   ↳ Deep currents established  ≋                 │    │\n'
            '  │   │                                                  │    │\n'
            '  │   └──────────────────────────────────────────────────┘    │\n'
            '  │                                                            │\n'
            '  │                              [5 second fade-out]          │\n'
            '  └────────────────────────────────────────────────────────────┘',
            font_size=8.5, border_color=DIM),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # XIV. RARITY TABLE
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('XIV.  COMPLETE RARITY TABLE', S['h1']),
        rule(),
        sp(4),
        dark_table(
            [
                ['Rarity', 'ASCII', 'Hex Color', 'Frequency', 'Example Badges'],
                ['Common',    '·',    '#4a8a4a', 'First acts',   'First Breath, Mirror Gazer, Signal Sent'],
                ['Uncommon',  '○',    '#3377aa', 'Days 1-14',    'Week Warrior, Community Voice, Heart Tender'],
                ['Rare',      '◐',    '#5566bb', 'Days 30+',     'Moon Cycle, Deep Diver, Truth Speaker'],
                ['Epic',      '◆',    '#8855bb', 'Days 100+',    'Unwavering, Self Scholar, Care Master'],
                ['Legendary', '✦',    '#c8a94e', 'Days 365+',    'The Long Count, Soul Cartographer'],
                ['Mythic',    '◉',    '#bb4433', 'Hidden',       'Meta-Signal, Thousand Truths, Millennium'],
                ['Cosmic',    '◉◉◉',  '#ff9900', 'Decade+',      'Decade of Care (10 years)'],
            ],
            [24*mm, 14*mm, 22*mm, 22*mm, 72*mm]
        ),
        sp(8),
        Paragraph('RARITY PHILOSOPHY', S['h2']),
        sp(4),
        Paragraph(
            'Rarity in LOT is not about artificial scarcity. A Legendary badge is '
            'rare because 365 consecutive days of anything is genuinely rare. '
            'A Mythic badge is rare because it requires a hidden interaction that '
            'most users will never discover. Cosmic is rare because a decade of '
            'commitment is a life event.',
            S['body']),
        sp(6),
        AsciiBlock(
            '  RARITY VISUAL LANGUAGE (in profile)\n'
            '  ──────────────────────────────────────────────────────\n'
            '  Common:    mindful ·  present ·  aware ·\n'
            '  Uncommon:  mindful ○  present ○  aware ○\n'
            '  Rare:      mindful ◐  present ◐  aware ◐\n'
            '  Epic:      mindful ◆  present ◆  aware ◆\n'
            '  Legendary: mindful ✦  present ✦  aware ✦\n'
            '  Mythic:    mindful ◉  present ◉  aware ◉',
            font_size=9, border_color=GOLD),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # XV. IMPLEMENTATION STATUS
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('XV.  IMPLEMENTATION STATUS &amp; ROADMAP', S['h1']),
        rule(),
        sp(4),
        Paragraph('CURRENTLY LIVE', S['h2']),
        sp(3),
        AsciiBlock(
            '  [✓] badges.ts              Core badge types, award logic, localStorage\n'
            '  [✓] BadgeUnlockFeed        Community unlock activity feed\n'
            '  [✓] GrowthMilestones       Personal + community growth display\n'
            '  [✓] EvolutionWidget        CQGS stage + achievements counter\n'
            '  [✓] MemoryWidget           Badge unlock notification on display\n'
            '  [✓] rpg-narrative.ts       Achievement registry + story arcs\n'
            '  [✓] PublicProfile.tsx      Level field (Water or Architecture)\n'
            '  [✓] Dual theme system      Water ∘≈≋ / Architecture ├─╞═╡║·║\n'
            '  [✓] getBadgeTheme()        localStorage theme persistence\n'
            '  [✓] checkAndAwardBadges()  Auto-check on user stats fetch',
            font_size=8.5, border_color=COMMON_G),
        sp(8),
        Paragraph('IN DESIGN / ROADMAP', S['h2']),
        sp(3),
        AsciiBlock(
            '  [○] Extended milestones    Day 14, 21, 50, 60, 90, 180, 365\n'
            '  [○] Pattern badges         Balanced, Flow, Consistent, Reflective, Explorer\n'
            '  [○] Easter egg engine      Word turns, time-based, interaction-based\n'
            '  [○] Oceanic Mayan theme    Option E full visual language\n'
            '  [○] Quest tracker UI       Daily / weekly / growth quest display\n'
            '  [○] Badge collection view  Gallery of earned badges\n'
            '  [○] Secret badge system    Hidden badge discovery\n'
            '  [○] Word turn detection    Semantic analysis of journal/memory text\n'
            '  [○] RPG archetype badges   Class-specific achievement paths\n'
            '  [○] Milestone word turns   Day-specific pun messages\n'
            '  [○] Cosmic Update badges   FLUX-generated badge art (subscribers)',
            font_size=8.5, border_color=WATER_T),
        sp(8),
        Paragraph('TECHNICAL ARCHITECTURE', S['h2']),
        sp(4),
        dark_table(
            [
                ['File', 'Role', 'Status'],
                ['src/client/utils/badges.ts',     'Core types, award logic, storage',    'Live'],
                ['src/client/utils/rpg-narrative.ts','Achievement registry, arcs',        'Live'],
                ['src/client/components/PublicProfile.tsx','Level field display',         'Live'],
                ['src/server/routes/badge-api.ts', 'Community badge feed API',            'Live'],
                ['src/server/routes/growth-stats.ts','Growth metrics endpoint',           'Live'],
                ['src/client/stores/selfAssembly.ts','Module phase tracking',             'Live'],
                ['src/client/utils/easter-eggs.ts','Word turn + time detection',          'Planned'],
                ['src/client/utils/quests.ts',    'Quest system logic',                   'Planned'],
                ['src/client/components/BadgeGallery.tsx','Badge collection UI',          'Planned'],
            ],
            [70*mm, 65*mm, 19*mm]
        ),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # XVI. UNICODE REFERENCE
    # ════════════════════════════════════════════════════════
    story += [
        Paragraph('XVI.  UNICODE REFERENCE', S['h1']),
        rule(),
        sp(4),
        Paragraph(
            'All LOT badge symbols are standard Unicode with 100% browser support '
            'across Safari/iOS, Chrome/Android, Firefox, and Edge. '
            'No custom fonts required.',
            S['body']),
        sp(6),
        dark_table(
            [
                ['Symbol', 'Unicode',   'Name',                        'LOT Use'],
                ['∘',      'U+2218',    'Ring Operator',               'Water Day 7'],
                ['≈',      'U+2248',    'Almost Equal To',             'Water Day 30'],
                ['≋',      'U+224B',    'Triple Tilde',                'Water Day 100'],
                ['├─',     'U+251C+─',  'Box Drawing T-right + dash',  'Arch Day 7'],
                ['╞═╡',    'U+255E+═+╡','Box Drawing double',          'Arch Day 30'],
                ['║·║',    'U+2551+·+║','Box Drawing double vert.',    'Arch Day 100'],
                ['╔═╗',    'U+2554+═+╗','Box Drawing double corners',  'Year One (Arch)'],
                ['○',      'U+25CB',    'White Circle',                'Oceanic centre'],
                ['∿',      'U+223F',    'Sine Wave',                   'Oceanic wave'],
                ['◐',      'U+25D0',    'Circle Left Half Black',      'Moon phase'],
                ['∴',      'U+2234',    'Therefore',                   'Dots pattern'],
                ['✦',      'U+2726',    'Black Four Pointed Star',     'Epic/Legendary'],
                ['◉',      'U+25C9',    'Fisheye',                     'Mythic'],
                ['◆',      'U+25C6',    'Black Diamond',               'Epic depth'],
                ['·',      'U+00B7',    'Middle Dot',                  'Separator'],
                ['→',      'U+2192',    'Rightwards Arrow',            'Progression'],
                ['↳',      'U+21B3',    'Downwards Arrow Right',       'Sub-indicator'],
            ],
            [16*mm, 22*mm, 55*mm, 61*mm]
        ),
        sp(10),
        AsciiBlock(
            '  BROWSER SUPPORT — All symbols\n'
            '  ──────────────────────────────\n'
            '  Safari / iOS   ✓ Full support\n'
            '  Chrome/Android ✓ Full support\n'
            '  Firefox        ✓ Full support\n'
            '  Edge           ✓ Full support',
            font_size=8.5, border_color=COMMON_G),
        PageBreak(),
    ]

    # ════════════════════════════════════════════════════════
    # BACK COVER
    # ════════════════════════════════════════════════════════
    story += [
        sp(40),
        AsciiBlock(
            '  ──────────────────────────────────────────────────────────────\n'
            '\n'
            '     LOT Systems — Self-care through proactive context AI\n'
            '\n'
            '     The Memory Engine remembers.\n'
            '     The Arcade rewards.\n'
            '     The story continues.\n'
            '\n'
            '  ──────────────────────────────────────────────────────────────\n'
            '\n'
            '        Water:    ∘  →  ≈  →  ≋  →  ≋≋  →  ≋≋≋\n'
            '        Arch:    ├─  → ╞═╡ → ║·║ → ║╞║ → ╔═╗\n'
            '\n'
            '  ──────────────────────────────────────────────────────────────',
            font_size=9.5, border_color=GOLD, bg=colors.HexColor('#050505')),
        sp(20),
        Paragraph('[ PRESS START ]', S['title']),
        sp(12),
        Paragraph('lot-systems.com', S['center']),
        Paragraph('lot-systems.com/u/vadik', S['center']),
        sp(6),
        Paragraph(
            'Badges &amp; Achievements Manual v3.0  ·  May 2026  ·  © LOT Systems',
            S['body_dim']),
    ]

    doc.build(story, canvasmaker=LOTCanvas)
    print(f'PDF written: {filename}')


if __name__ == '__main__':
    out = '/home/user/LOT-Computer/docs/LOT_BADGES_ACHIEVEMENTS_v3.pdf'
    build_pdf(out)
