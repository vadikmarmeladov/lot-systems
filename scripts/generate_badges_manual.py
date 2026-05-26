#!/usr/bin/env python3
"""
LOT Systems — Badges & Achievements PDF Generator
RPG / Arcade / Sci-Fi Self-Care Manual

© 2025-2026 LOT Systems. All rights reserved.
"""

from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

# ── Font paths ───────────────────────────────────────────────────────────────
FONT_DIR   = '/usr/share/fonts/truetype/dejavu'
MONO_R     = os.path.join(FONT_DIR, 'DejaVuSansMono.ttf')
MONO_B     = os.path.join(FONT_DIR, 'DejaVuSansMono-Bold.ttf')
SANS_R     = os.path.join(FONT_DIR, 'DejaVuSans.ttf')
SANS_B     = os.path.join(FONT_DIR, 'DejaVuSans-Bold.ttf')

# ── Palette ─────────────────────────────────────────────────────────────────
BG        = (10,  10,  10)
FG        = (220, 220, 220)
GOLD      = (200, 160,  60)
CYAN      = ( 80, 200, 200)
PURPLE    = (160,  80, 200)
RED       = (200,  60,  60)
GREEN     = ( 80, 200, 120)
ORANGE    = (220, 140,  50)
DIMGRAY   = ( 90,  90,  90)
PINK      = (220, 100, 140)
TEAL      = (100, 200, 180)


# ── PDF Subclass ─────────────────────────────────────────────────────────────
class LOT_PDF(FPDF):
    def __init__(self):
        super().__init__(orientation='P', unit='mm', format='A4')
        self.set_auto_page_break(auto=True, margin=18)
        self.set_margins(18, 18, 18)
        # Load Unicode fonts
        self.add_font('Mono',   '', MONO_R)
        self.add_font('Mono',   'B', MONO_B)
        self.add_font('Sans',   '', SANS_R)
        self.add_font('Sans',   'B', SANS_B)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font('Mono', '', 6.5)
        self.set_text_color(*DIMGRAY)
        self.cell(0, 5, 'LOT SYSTEMS  ·  BADGES & ACHIEVEMENTS  ·  RPG SELF-CARE EDITION',
                  new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
        self.set_draw_color(*DIMGRAY)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(3)

    def footer(self):
        self.set_y(-13)
        self.set_font('Mono', '', 6.5)
        self.set_text_color(*DIMGRAY)
        self.cell(0, 5,
                  f'© 2025-2026 LOT Systems  ·  lot-systems.com  ·  Page {self.page_no()}',
                  align='C')

    # ── Helpers ──────────────────────────────────────────────────────────────

    def mono(self, size=8.5, bold=False):
        self.set_font('Mono', 'B' if bold else '', size)

    def sans(self, size=10, bold=False):
        self.set_font('Sans', 'B' if bold else '', size)

    def rc(self):
        self.set_text_color(*FG)

    def chapter_title(self, text, color=GOLD):
        self.ln(4)
        self.sans(12, True)
        self.set_text_color(*color)
        self.cell(0, 8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*color)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(3)
        self.rc()

    def section(self, text, color=CYAN):
        self.ln(2)
        self.sans(9, True)
        self.set_text_color(*color)
        self.cell(0, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.rc()
        self.ln(1)

    def body(self, text, size=8.2, color=None):
        self.mono(size)
        if color:
            self.set_text_color(*color)
        self.multi_cell(0, 4.5, text)
        self.rc()

    def code(self, lines, color=FG):
        self.mono(7.5)
        self.set_text_color(*color)
        for line in lines:
            self.cell(0, 4.2, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.rc()
        self.ln(2)

    def rule(self, color=DIMGRAY):
        self.ln(2)
        self.set_draw_color(*color)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(3)

    def rarity_color(self, rarity):
        return {
            'common':    GREEN,
            'uncommon':  ORANGE,
            'rare':      CYAN,
            'epic':      PURPLE,
            'legendary': RED,
        }.get(rarity, FG)


# ─────────────────────────────────────────────────────────────────────────────
def build_pdf() -> str:
    pdf = LOT_PDF()

    # ══════════════════════════════════════════════════════════
    # PAGE 1 — COVER
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.set_y(22)
    logo = [
        " _     ___ _____   ____            _                ",
        "| |   / _ \\_   _| / ___|_   _ ___| |_ ___ _ __ ___ ",
        "| |  | | | || |   \\___ \\ | | / __| __/ _ \\ '_ ` _ \\",
        "| |__| |_| || |    ___) | |_| \\__ \\ ||  __/ | | | | |",
        "|_____\\___/ |_|   |____/ \\__, |___/\\__\\___|_| |_| |_|",
        "                         |___/                       ",
    ]
    pdf.mono(7.5, True)
    pdf.set_text_color(*CYAN)
    for line in logo:
        pdf.cell(0, 4.5, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    pdf.ln(6)
    pdf.mono(10, True)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 7, 'BADGES & ACHIEVEMENTS MANUAL', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    pdf.mono(8)
    pdf.set_text_color(*FG)
    pdf.cell(0, 6, 'RPG / ARCADE / SCI-FI SELF-CARE EDITION', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    pdf.ln(4)
    pdf.set_draw_color(*GOLD)
    pdf.line(40, pdf.get_y(), 170, pdf.get_y())
    pdf.ln(7)

    frame = [
        "  ╔══════════════════════════════════════════════════════════╗",
        "  ║                                                          ║",
        "  ║    > PLAYER ONE — INITIALIZING SELF-CARE PROTOCOL       ║",
        "  ║                                                          ║",
        "  ║    System:    LOT Memory Engine  v3.0                   ║",
        "  ║    Mode:      RPG  ·  Arcade  ·  Sci-Fi                 ║",
        "  ║    Mission:   Map the Self. Earn the Stars.             ║",
        "  ║    Difficulty: LIFE                                      ║",
        "  ║                                                          ║",
        "  ║    INSERT COIN TO CONTINUE  . . .  ∘ ≈ ≋               ║",
        "  ║                                                          ║",
        "  ╚══════════════════════════════════════════════════════════╝",
    ]
    pdf.mono(7.5)
    pdf.set_text_color(*CYAN)
    for line in frame:
        pdf.cell(0, 4.5, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    pdf.ln(7)
    progression = [
        "       ∘            ≈            ≋",
        "    Droplet       Wave        Current",
        "    7 days        30 days     100 days",
        "",
        "    ├─           ╞═╡           ║·║",
        "  Foundation   Structure   Architecture",
    ]
    pdf.mono(8)
    pdf.set_text_color(*GOLD)
    for line in progression:
        pdf.cell(0, 4.5, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    pdf.ln(7)
    pdf.set_draw_color(*DIMGRAY)
    pdf.line(40, pdf.get_y(), 170, pdf.get_y())
    pdf.ln(5)

    pdf.mono(6.5)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 4, 'Created by Vadik Marmeladov, CEO & Founder, LOT Systems',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    pdf.cell(0, 4, '© 2025-2026 LOT Systems. All rights reserved.',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    pdf.cell(0, 4, 'lot-systems.com',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    # ══════════════════════════════════════════════════════════
    # PAGE 2 — SYSTEM PHILOSOPHY
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER I — THE LOT SELF-CARE RPG', GOLD)

    pdf.body("""LOT is not a wellness tracker. It is an RPG of the self.

Every question you answer is an XP gain. Every streak is a boss defeated. Every badge
is a sigil earned through genuine presence — not by clicking a button, but by showing
up, day after day, and giving the Memory Engine an honest signal.

This manual is your complete guide to the badge and achievement systems embedded in LOT.
It documents every medal, milestone, constellation, and secret easter egg.""")

    pdf.section('THE THREE PILLARS OF PROGRESSION')
    pdf.code([
        '  1. STREAKS     — Consecutive days of check-in        [ Time-based ]',
        '  2. DEPTH       — Memory questions answered           [ Knowledge-based ]',
        '  3. PATTERNS    — Behavioral consistency detected     [ Signal-based ]',
    ], CYAN)

    pdf.section('BADGE THEMES — CHOOSE YOUR PATH')
    pdf.body('Two parallel metaphor systems. Same milestones, different philosophy:\n')
    pdf.code([
        '  WATER THEME        — Growth like nature. Fluid, cyclical, ancient.',
        '    ∘  Droplet        The first act of presence.',
        '    ≈  Wave           Pattern emerges from repetition.',
        '    ≋  Current        Deep, established, unmistakable.',
        '',
        '  ARCHITECTURE THEME — Growth like structure. Built, precise, permanent.',
        '    ├─  Foundation    The first stone placed.',
        '    ╞═╡ Structure     Walls and beams. Form taking shape.',
        '    ║·║ Architecture  Complete. A standing edifice of self.',
    ], GOLD)

    pdf.section('LEVEL PROGRESSION — THE FIVE ARCS')
    pdf.code([
        '  LVL  1–9    ░░░░░░░░░░  Awakening     [ You notice yourself. ]',
        '  LVL 10–29   ▒░░░░░░░░░  Explorer      [ You map the terrain. ]',
        '  LVL 30–59   ▒▒▒░░░░░░░  Practitioner  [ Practice is embedded. ]',
        '  LVL 60–89   ▒▒▒▒▒▒░░░░  Master        [ The system mirrors you. ]',
        '  LVL 90–100  ▒▒▒▒▒▒▒▒▒▒  Sage          [ You and LOT co-evolved. ]',
    ], CYAN)

    pdf.rule()
    pdf.body(
        '  "This isn\'t data collection.\n'
        '   This is your life story, told through self-care choices."', color=GREEN)

    # ══════════════════════════════════════════════════════════
    # PAGE 3 — MILESTONE BADGES
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER II — MILESTONE BADGES', GOLD)
    pdf.body('Milestone badges are earned through consecutive days of practice.\n'
             'The first badge proves you began. The last proves you stayed.\n')

    pdf.section('WATER THEME MILESTONES')
    water_ms = [
        ('∘',   'DROPLET',       '7 days',    'common',   '↳ First drops form [∘]'),
        ('≈',   'WAVE',          '30 days',   'rare',     '↳ Waves begin to flow [≈]'),
        ('≋',   'CURRENT',       '100 days',  'epic',     '↳ Deep currents established [≋]'),
    ]
    for sym, name, days, rarity, unlock in water_ms:
        rc = pdf.rarity_color(rarity)
        pdf.mono(8.5, True)
        pdf.set_text_color(*rc)
        pdf.cell(14, 6, f'  {sym}')
        pdf.set_text_color(*GOLD)
        pdf.cell(30, 6, name)
        pdf.set_text_color(*FG)
        pdf.cell(22, 6, days)
        pdf.set_text_color(140, 140, 140)
        pdf.cell(0, 6, f'  rarity: {rarity.upper()}',
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.mono(7.5)
        pdf.set_text_color(*GREEN)
        pdf.cell(0, 4, f'       {unlock}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)

    pdf.rule()
    pdf.section('ARCHITECTURE THEME MILESTONES')
    arch_ms = [
        ('├─',  'FOUNDATION',    '7 days',    'common',   '↳ Foundation laid [├─]'),
        ('╞═╡', 'STRUCTURE',     '30 days',   'rare',     '↳ Structure rises [╞═╡]'),
        ('║·║', 'ARCHITECTURE',  '100 days',  'epic',     '↳ Architecture complete [║·║]'),
    ]
    for sym, name, days, rarity, unlock in arch_ms:
        rc = pdf.rarity_color(rarity)
        pdf.mono(8.5, True)
        pdf.set_text_color(*rc)
        pdf.cell(14, 6, f'  {sym}')
        pdf.set_text_color(*GOLD)
        pdf.cell(30, 6, name)
        pdf.set_text_color(*FG)
        pdf.cell(22, 6, days)
        pdf.set_text_color(140, 140, 140)
        pdf.cell(0, 6, f'  rarity: {rarity.upper()}',
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.mono(7.5)
        pdf.set_text_color(*GREEN)
        pdf.cell(0, 4, f'       {unlock}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)

    pdf.rule()
    pdf.section('BADGE PROGRESSION DISPLAY')
    pdf.code([
        '  WATER:        ∘  →  ≈  →  ≋',
        '               Droplet  Wave  Current',
        '',
        '  ARCHITECTURE: ├─  →  ╞═╡  →  ║·║',
        '               Foundation  Structure  Architecture',
        '',
        '  PROFILE EXAMPLE (Level field under Awareness):',
        '    Archetype:        The Explorer',
        '    Awareness Level:  Deepening (8.4/10)',
        '    Level:            ≋              <- your milestone badge',
        '    Days of Practice: 127 days',
        '',
        '    Core values:  mindful · present · aware · grounded',
        '    Emotional:    calm · reflective · intentional · open',
    ], CYAN)

    # ══════════════════════════════════════════════════════════
    # PAGE 4 — OCEANIC MAYAN BADGES
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER III — OCEANIC MAYAN BADGE SYSTEM', CYAN)
    pdf.body(
        'Inspired by Mayan vigesimal counting and water cycles.\n'
        'The Mayan calendar is not a list — it is a spiral. So is self-care.\n\n'
        'Circles (○) = completion, the Mayan concept of zero / return.\n'
        'Bars (—)    = stability, the Mayan bar (= 5).\n'
        'Waves (~ ≈ ≋) = the fluid nature of honest practice.\n')

    pdf.section('OCEANIC MILESTONE BADGES')
    oceanic_ms = [
        ('○~',  'Wave Emerges',  '7 days',    'rare',      'Wave patterns emerge. ○~'),
        ('○≈○', 'Full Tide',     '30 days',   'epic',      'Tides complete their cycle. ○≈○'),
        ('≋○≋', 'Ocean Depth',   '100 days',  'legendary', 'Ocean depth achieved. ≋○≋'),
    ]
    for sym, name, days, rarity, msg in oceanic_ms:
        rc = pdf.rarity_color(rarity)
        pdf.mono(8.5, True)
        pdf.set_text_color(*rc)
        pdf.cell(18, 6, f'  {sym}')
        pdf.set_text_color(*CYAN)
        pdf.cell(34, 6, name)
        pdf.set_text_color(*FG)
        pdf.cell(22, 6, days)
        pdf.set_text_color(140, 140, 140)
        pdf.cell(0, 6, f'  rarity: {rarity.upper()}',
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.mono(7.5)
        pdf.set_text_color(*GREEN)
        pdf.cell(0, 4, f'       Unlock: "{msg}"',
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)

    pdf.rule()
    pdf.section('OCEANIC PATTERN BADGES')
    oceanic_pat = [
        ('~—~', 'Balanced Tides',  'All planner dimensions used evenly',         'uncommon', 'Tides balance. ~—~'),
        ('≈○≈', 'Flow State',      'Multiple widgets engaged in one session',     'uncommon', 'Flowing with the ocean. ≈○≈'),
        ('—○—', 'Steady Current',  'Regular engagement at similar times',        'uncommon', 'Current holds steady. —○—'),
        ('○◐○', 'Moon Phases',     'Deep engagement with memory questions',      'rare',     'You reflect like the moon. ○◐○'),
        ('○∴○', 'Scattered Drops', 'Diverse options tried across widgets',       'uncommon', 'Curiosity scattered, returns. ○∴○'),
    ]
    for sym, name, desc, rarity, msg in oceanic_pat:
        rc = pdf.rarity_color(rarity)
        pdf.mono(8.5, True)
        pdf.set_text_color(*rc)
        pdf.cell(18, 5.5, f'  {sym}')
        pdf.set_text_color(*CYAN)
        pdf.cell(32, 5.5, name)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5.5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.mono(7.5)
        pdf.set_text_color(*GREEN)
        pdf.cell(0, 4, f'       "{msg}"',
                 new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)

    pdf.rule()
    pdf.section('MAYAN CYCLE PHILOSOPHY')
    pdf.code([
        '  1 Kin   = 1 day          (sacred unit)',
        '  7 Kins  = First LOT cycle (mini-uinal, first badge)',
        '  30 Kins = LOT major cycle (~1 lunar month, second badge)',
        '  100 Kins= LOT mastery    (approaching 1/4 Tun, final badge)',
        '',
        '  SYMBOL DICTIONARY:',
        '  ○  Shell / Zero / Completion / Return',
        '  —  Bar = 5 (Mayan counting unit)',
        '  ~  Sine wave (first ripple)   ≈  Deep waves   ≋  Oceanic current',
        '  ◐  Half-moon / Reflection     ∴  Therefore / Discovery',
    ], CYAN)

    pdf.section('FULL PROFILE — OCEANIC MAYAN VIEW')
    pdf.code([
        '  ═══════════════════════════════════════════════════',
        "                    ALEX'S PROFILE",
        '  ───────────────────────────────────────────────────',
        '  Archetype:              The Explorer',
        '  Awareness Level:        Deepening (8.4/10)',
        '  Level:                  ≋○≋',
        '  Days of Practice:       127 days',
        '  ───────────────────────────────────────────────────',
        '  Core values:',
        '      mindful · present · aware · grounded · authentic',
        '  Emotional patterns:',
        '      calm · reflective · intentional · open · curious',
        '  ═══════════════════════════════════════════════════',
    ], GOLD)

    # ══════════════════════════════════════════════════════════
    # PAGE 5 — ACHIEVEMENTS CATALOG
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER IV — ACHIEVEMENTS CATALOG', GOLD)
    pdf.body(
        'Achievements are earned through genuine engagement — not by trying to earn them.\n'
        'The system detects authentic behavioral signals. Gaming yields nothing.\n')

    categories = [
        ('EXPLORATION', [
            ('○',  'First Breath',      'Your first emotional check-in',            'common'),
            ('◦',  'Mirror Gazer',      'Answered your first memory question',       'common'),
            ('≈',  'Community Voice',   'Shared your first community message',       'uncommon'),
        ], CYAN),
        ('CONSISTENCY', [
            ('≈',  'Week Warrior',      '7 consecutive check-in days',               'uncommon'),
            ('≋',  'Moon Cycle',        '30 consecutive days of practice',           'rare'),
            ('✦',  'Unwavering',        '100 days of continuous practice',           'epic'),
        ], GOLD),
        ('DEPTH', [
            ('≋',  'Deep Diver',        '50 memory questions answered',              'rare'),
            ('▪',  'Self Scholar',      '100 memory questions answered',             'epic'),
            ('◈',  'Soul Cartographer', '250 memory questions answered',             'legendary'),
        ], PURPLE),
        ('CONNECTION', [
            ('≋',  'Bridge Builder',    '20 community messages sent',                'uncommon'),
        ], GREEN),
        ('ROMANCE', [
            ('◐',  'Heart Tender',      'Acknowledged romantic connection in practice','uncommon'),
            ('●',  'Intimacy Keeper',   'Tending to romantic connection (10x)',      'rare'),
        ], PINK),
        ('CARE', [
            ('○',  'Gentle With Self',  '10 self-care practices completed',          'uncommon'),
        ], TEAL),
        ('COURAGE', [
            ('◈',  'Truth Speaker',     '50 honest log entries recorded',            'rare'),
        ], RED),
    ]

    for cat_name, achievements, cat_color in categories:
        pdf.section(cat_name + '  ─────────────────────────────────────────', cat_color)
        for icon, title, desc, rarity in achievements:
            rc = pdf.rarity_color(rarity)
            pdf.mono(8.5, True)
            pdf.set_text_color(*rc)
            pdf.cell(10, 5.5, f'  {icon}')
            pdf.set_text_color(*GOLD)
            pdf.cell(38, 5.5, title)
            pdf.set_text_color(*FG)
            pdf.mono(8.5)
            pdf.cell(0, 5.5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.mono(7)
            pdf.set_text_color(100, 100, 100)
            pdf.cell(0, 3.5, f'       rarity: {rarity.upper()}',
                     new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.ln(1)
        pdf.ln(1)

    # ══════════════════════════════════════════════════════════
    # PAGE 6 — EVOLUTION SYSTEM / CQGS
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER V — EVOLUTION SYSTEM (CQGS)', PURPLE)
    pdf.body(
        'The CQGS (Citizen Index) tracks your progression across seven dimensions.\n'
        'These evolve from behavioral signals — the real texture of your engagement.\n'
        'The interface itself evolves as you do.\n')

    pdf.section('THE SEVEN DIMENSIONS')
    dims = [
        ('≈', 'EXPLORATION', 'Discovery and first-time experiences',       CYAN),
        ('—', 'CONSISTENCY', 'Behavioral stamina and streaks',             GOLD),
        ('≋', 'DEPTH',       'Knowledge accumulation',                    PURPLE),
        ('○', 'CONNECTION',  'Social engagement with community',          GREEN),
        ('◐', 'INTIMACY',    'Romantic vulnerability and openness',       PINK),
        ('≈', 'CARE',        'Self-compassion practices',                 TEAL),
        ('✦', 'COURAGE',     'Truth-telling and honesty',                 RED),
    ]
    for sym, name, desc, color in dims:
        pdf.mono(8.5, True)
        pdf.set_text_color(*color)
        pdf.cell(10, 5.5, f'  {sym}')
        pdf.set_text_color(*FG)
        pdf.cell(30, 5.5, name)
        pdf.mono(8.5)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5.5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    pdf.section('INTERFACE EVOLUTION — LAYOUT DENSITY')
    pdf.code([
        '  As visual refinement increases, the interface condenses:',
        '',
        '  breathable   ░░░░░░░░░░  Open, airy. Wellness journal feel.',
        '  comfortable  ▒░░░░░░░░░  Semantic stacks begin forming.',
        '  compact      ▒▒▒░░░░░░░  Dashboard clarity. Sections tight.',
        '  dense        ▒▒▒▒▒▒░░░░  Information-dense cockpit.',
        '  instrument   ▒▒▒▒▒▒▒▒▒▒  Bloomberg-terminal grade. Niche pro.',
    ], PURPLE)

    pdf.section('STORY ARC CHAPTERS')
    arcs = [
        ('1', 'Awakening',    'LVL  1–9',   'You have begun to notice yourself.'),
        ('2', 'Exploration',  'LVL 10–29',  'You explore your inner landscape.'),
        ('3', 'Integration',  'LVL 30–59',  'Practice deepens; the system evolves.'),
        ('4', 'Mastery',      'LVL 60–89',  'You speak the language of yourself fluently.'),
        ('5', 'Sage',         'LVL 90–100', 'You and this system have co-evolved.'),
    ]
    for ch, title, lvl, narrative in arcs:
        pdf.mono(8.5, True)
        pdf.set_text_color(*GOLD)
        pdf.cell(8, 5.5, f'  {ch}.')
        pdf.set_text_color(*CYAN)
        pdf.cell(26, 5.5, title)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(18, 5.5, lvl)
        pdf.set_text_color(*FG)
        pdf.mono(8)
        pdf.cell(0, 5.5, narrative, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    pdf.section('CQGS MILESTONE TITLES')
    pdf.code([
        '  LVL 10  →  Explorer      The system has begun to self-assemble.',
        '  LVL 30  →  Practitioner  Practice embedded. Architecture evolves.',
        '  LVL 60  →  Master        The system mirrors your depth.',
        '  LVL 90  →  Sage          You and LOT are indistinguishable.',
    ], GOLD)

    pdf.section('FEATURE UNLOCKS BY EVOLUTION LEVEL')
    pdf.code([
        '  Unlock Level 1  →  Advanced Memory    (deep reflection questions)',
        '  Unlock Level 2  →  Planner Templates  (custom planner templates)',
        '  Unlock Level 3  →  Community Rich     (full community features)',
        '  Unlock Level 4  →  Mood Patterns      (behavioral pattern analysis)',
        '  Unlock Level 5  →  Intention History  (historical intention tracking)',
    ], CYAN)

    pdf.section('SELF-ASSEMBLY MODULES')
    pdf.code([
        '  Nine modules assemble from real QIE signals:',
        '',
        '  Biofield Engine     Memory Architecture    Routine Compiler',
        '  Intention Core      Cleanness Protocol     Reflection Layer',
        '  Community Mesh      Ecosystem Bridge       Quantum Substrate',
        '',
        '  Phases: Dormant → Awakening → Forming → Assembled → Integrated',
    ], PURPLE)

    # ══════════════════════════════════════════════════════════
    # PAGE 7 — EASTER EGGS & SECRETS
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER VI — EASTER EGGS & SECRET ACHIEVEMENTS', RED)
    pdf.body('Hidden depths. The system watches. These cannot be forced.\nFind them, and the interface whispers back.\n')

    pdf.section('MAGIC TIME CALCULATOR')
    pdf.code([
        '  The micro-calculator appears ONLY at magical timestamps:',
        '',
        '  11:11   12:12   13:13   22:22   00:00   11:11 PM',
        '  12:34   01:23   11:22   10:01   20:02   ...',
        '',
        '  23 magical time triggers total. You cannot summon it.',
        '  It appears. You compute. It fades.',
        '',
        '  Signal recorded: [ magic_time ] → Quantum Intention Engine',
    ], GOLD)

    pdf.section('MICRO GAMES — TIME-LOCKED ARCADE')
    pdf.code([
        '  Three games rotate by time of day on a 32×32 monochrome canvas:',
        '',
        '  MORNING   05:00–11:59  →  MICRO TETRIS     [ stack the self ]',
        '  AFTERNOON 12:00–17:59  →  PIXEL INVADERS   [ defend the peace ]',
        '  EVENING   18:00–23:59  →  DOT SNAKE        [ follow the thread ]',
        '',
        '  All signals recorded to QIE for engagement pattern tracking.',
    ], CYAN)

    pdf.section('QUANTUM RANDOM — THE SIGNAL BENEATH THE SIGNAL')
    pdf.code([
        '  A number (0–99) appears at random intervals between 1 and 72 seconds.',
        '  Each generation records [ quantum_random ] to the QIE.',
        '',
        '  Notice which numbers you notice. That is the easter egg.',
    ], PURPLE)

    pdf.section('SOVIET SYNTH KEYBOARD — SECRET INPUT')
    pdf.code([
        '  A secret sound interface exists in the Settings layer.',
        '  Triggered by: secret-emoji input in the Settings tab.',
        '  Plays retro synth tones in Soviet / space-age aesthetic.',
        '',
        '  No further documentation beyond this sentence.',
    ], RED)

    pdf.section('QUANTUM SIGN — DAILY ORACLE')
    pdf.code([
        '  Subscribers only. Seeded from the date — same signal all day.',
        '  Only surfaces for users with LOW recent activity.',
        '  The system is asking: are you still here?',
        '',
        '  Astrology patch available. Psychology patch available.',
        '  Both are the same. The frame changes. The signal remains.',
    ], GOLD)

    pdf.section('ECOSYSTEM FULL COHERENCE — SECRET COMPOSITE SIGNAL')
    pdf.code([
        '  Connect Car + Home + Computer to the Quantum Engine simultaneously.',
        '  The system records:',
        '      [ ecosystem_full_coherence ]',
        '',
        '  This is the ONLY composite signal in the entire QIE.',
        '  What it changes: classified.',
    ], CYAN)

    pdf.section('FLASH DRIVE MANIFEST — OFFLINE EASTER EGG')
    pdf.code([
        '  Go offline. Or enable investor mode.',
        '  The Flash Drive Manifest appears.',
        '',
        '  32GB flash drive: both business card and portal.',
        '  It carries your Memory Story. Plug into any LOT terminal.',
        '  Your system reassembles from the drive.',
        '',
        '  This is the LOT offline-first philosophy made physical.',
    ], GOLD)

    pdf.section('COSMIC UPDATE — VOID IMAGE GENERATOR')
    pdf.code([
        '  Subscribers (Usership / R&D / Legacy) only.',
        '  Generates unique images from void-inspired prompts.',
        '  Powered by Together.AI FLUX image engine.',
        '',
        '  Each image is singular. Generated once. Cannot be regenerated.',
    ], PURPLE)

    pdf.section('SECRET ACHIEVEMENT UNLOCKS')
    secrets = [
        ('◈', 'SOUL CARTOGRAPHER', 'LEGENDARY', 'Answer 250 memory questions. The map becomes the territory.'),
        ('✦', 'UNWAVERING',        'EPIC',       '100 consecutive days. Not tracked until the 100th sunrise.'),
        ('●', 'INTIMACY KEEPER',   'RARE',       '10 romantic practice entries. The system honors what you tend.'),
    ]
    for sym, title, rarity, desc in secrets:
        rc = pdf.rarity_color(rarity.lower())
        pdf.mono(8.5, True)
        pdf.set_text_color(*rc)
        pdf.cell(10, 6, f'  {sym}')
        pdf.set_text_color(*GOLD)
        pdf.cell(40, 6, title)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(0, 6, f'[ {rarity} ]', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.mono(7.5)
        pdf.set_text_color(*FG)
        pdf.cell(0, 4, f'       {desc}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(2)

    # ══════════════════════════════════════════════════════════
    # PAGE 8 — WORD TURNS & ARCADE PHRASES
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER VII — WORD TURNS & ARCADE PHRASES', CYAN)
    pdf.body('These are the in-game messages. Study them. They are the voice of LOT.\n')

    pdf.section('BADGE UNLOCK MESSAGES')
    unlocks = [
        ('∘',   'First drops form',              'Water · 7 days'),
        ('≈',   'Waves begin to flow',           'Water · 30 days'),
        ('≋',   'Deep currents established',     'Water · 100 days'),
        ('├─',  'Foundation laid',               'Architecture · 7 days'),
        ('╞═╡', 'Structure rises',               'Architecture · 30 days'),
        ('║·║', 'Architecture complete',         'Architecture · 100 days'),
        ('○~',  'Wave patterns emerge',          'Mayan · 7 days'),
        ('○≈○', 'Tides complete their cycle',    'Mayan · 30 days'),
        ('≋○≋', 'Ocean depth achieved',          'Mayan · 100 days'),
        ('~—~', 'Tides balance',                 'Pattern · Balanced'),
        ('≈○≈', 'Flowing with the ocean',        'Pattern · Flow'),
        ('—○—', 'Current holds steady',          'Pattern · Consistent'),
        ('○◐○', 'You reflect like the moon',     'Pattern · Reflective'),
        ('○∴○', 'Curiosity scattered, returns',  'Pattern · Explorer'),
    ]
    for sym, msg, tag in unlocks:
        pdf.mono(8.5)
        pdf.set_text_color(*CYAN)
        pdf.cell(20, 5, f'  {sym}')
        pdf.set_text_color(*GOLD)
        pdf.cell(0, 5, f'"{msg}"', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.mono(7)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 3.5, f'       [ {tag} ]', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(0.5)

    pdf.rule()
    pdf.section('STORY ARC TRANSITIONS')
    arc_msgs = [
        ('Chapter 1→2', 'You have begun to notice yourself.'),
        ('Chapter 2→3', 'The system builds new pathways around your patterns.'),
        ('Chapter 3→4', 'Moods, patterns, relationships — woven into architecture.'),
        ('Chapter 4→5', 'You speak the language of yourself fluently.'),
        ('Sage reached', 'You and this system have co-evolved.'),
    ]
    for stage, msg in arc_msgs:
        pdf.mono(8.5, True)
        pdf.set_text_color(*GOLD)
        pdf.cell(32, 5, f'  {stage}')
        pdf.mono(8.5)
        pdf.set_text_color(*FG)
        pdf.cell(0, 5, f'"{msg}"', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    pdf.section('ARCADE MOMENT PHRASES')
    arcade = [
        '> PLAYER ONE — INITIALIZING SELF-CARE PROTOCOL',
        '> INSERT COIN TO CONTINUE  . . .  ∘ ≈ ≋',
        '> LEVEL UP  //  NEW DIMENSION UNLOCKED',
        '> STREAK INTACT  //  SIGNAL CONFIRMED',
        '> QUANTUM FLUX: NOMINAL',
        '> MEMORY ENGINE: ONLINE',
        '> BIOFIELD CAPACITOR: CHARGING',
        '> PATTERN DETECTED  //  BADGE INCOMING',
        '> ECOSYSTEM COHERENCE: FULL',
        '> HIGH SCORE: [YOUR NAME]',
        '> CONTINUE?  10 ... 9 ... 8 ...',
        '> SELF-ASSEMBLY: IN PROGRESS',
        '> NEURAL ACTIVITY: ELEVATED',
        '> RESONANCE: 7.83 Hz',
        '> TODAY\'S SIGNAL ACCEPTED',
        '> GAME OVER — BUT YOU RESPAWN AT DAWN',
    ]
    pdf.mono(8)
    pdf.set_text_color(*GREEN)
    for phrase in arcade:
        pdf.cell(0, 4.8, f'  {phrase}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(3)

    pdf.section('ACHIEVEMENT TITLES — POETIC NAMES')
    whispers = [
        ('First Breath',       'Spring',           'First emotional check-in'),
        ('Mirror Gazer',       'Reflection Pool',  'First memory question answered'),
        ('Week Warrior',       'Rapids',           '7-day streak'),
        ('Moon Cycle',         'Tidal Cycle',      '30-day streak'),
        ('Unwavering',         'Constellation',    '100-day streak'),
        ('Deep Diver',         'Deep Water',       '50 memory questions'),
        ('Self Scholar',       'Archive',          '100 memory questions'),
        ('Soul Cartographer',  'Cartography',      '250 memory questions'),
        ('Bridge Builder',     'Archway',          '20 community messages'),
        ('Heart Tender',       'Heart Chamber',    'Romantic connection acknowledged'),
        ('Intimacy Keeper',    'Sanctuary',        '10 romantic practice entries'),
        ('Gentle With Self',   'Warm Bath',        '10 self-care practices'),
        ('Truth Speaker',      'Resonance Hall',   '50 honest entries'),
        ('Community Voice',    'Current',          'First community message'),
    ]
    pdf.mono(7.5)
    for title, icon, desc in whispers:
        pdf.set_text_color(*GOLD)
        pdf.cell(38, 4.5, f'  {title}')
        pdf.set_text_color(100, 100, 100)
        pdf.cell(32, 4.5, f'[ {icon} ]')
        pdf.set_text_color(*FG)
        pdf.cell(0, 4.5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # ══════════════════════════════════════════════════════════
    # PAGE 9 — QUICK REFERENCE GRID
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.chapter_title('CHAPTER VIII — QUICK REFERENCE GRID', GOLD)

    pdf.section('ALL BADGES AT A GLANCE')
    pdf.code([
        '  ┌─────────────────────────────────────────────────────────────────┐',
        '  │  WATER THEME                    ARCHITECTURE THEME              │',
        '  │                                                                 │',
        '  │  ∘    Droplet       7d          ├─   Foundation      7d         │',
        '  │  ≈    Wave          30d         ╞═╡  Structure       30d        │',
        '  │  ≋    Current       100d        ║·║  Architecture    100d       │',
        '  │                                                                 │',
        '  │  OCEANIC MAYAN                                                  │',
        '  │                                                                 │',
        '  │  ○~   Wave Emerges  7d                                           │',
        '  │  ○≈○  Full Tide     30d                                          │',
        '  │  ≋○≋  Ocean Depth   100d                                         │',
        '  │                                                                 │',
        '  │  PATTERN BADGES                                                 │',
        '  │                                                                 │',
        '  │  ~—~  Balanced Tides   ≈○≈  Flow State   —○—  Steady Current   │',
        '  │  ○◐○  Moon Phases      ○∴○  Scattered Drops                     │',
        '  │                                                                 │',
        '  │  ACHIEVEMENTS                                                   │',
        '  │                                                                 │',
        '  │  ○  First Breath     ◦  Mirror Gazer     ≈  Community Voice    │',
        '  │  ~  Week Warrior     ≋  Moon Cycle       ✦  Unwavering         │',
        '  │  ≋  Deep Diver       ▪  Self Scholar     ◈  Soul Cartographer  │',
        '  │  ≋  Bridge Builder   ◐  Heart Tender     ●  Intimacy Keeper    │',
        '  │  ○  Gentle With Self ◈  Truth Speaker                          │',
        '  └─────────────────────────────────────────────────────────────────┘',
    ], FG)

    pdf.rule()
    pdf.section('RARITY COLOR CODE')
    rarities = [
        ('COMMON',    GREEN,  'First steps. Available to all. Precious because they happen first.'),
        ('UNCOMMON',  ORANGE, 'Earned by those who return. One week, one repeated decision.'),
        ('RARE',      CYAN,   'One in ten achieves this. Depth requires patience.'),
        ('EPIC',      PURPLE, 'One in fifty. This is mastery territory.'),
        ('LEGENDARY', RED,    'One in a hundred. The system recognizes you completely.'),
    ]
    for rarity, color, desc in rarities:
        pdf.mono(8.5, True)
        pdf.set_text_color(*color)
        pdf.cell(22, 5.5, f'  {rarity}')
        pdf.mono(8.5)
        pdf.set_text_color(*FG)
        pdf.cell(0, 5.5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    pdf.section('XP CURVE — LEVEL TO ACTIVITY MAP')
    pdf.code([
        '  Activities   0–9    →  Level  1–9    (1 activity = 1 level)',
        '  Activities  10–49   →  Level 10–29   (2 activities per level)',
        '  Activities  50–149  →  Level 30–59   (4 activities per level)',
        '  Activities 150–499  →  Level 60–89   (12 activities per level)',
        '  Activities  500+    →  Level 90–100  (50 activities per level)',
        '',
        '  1 XP = 1 activity  (check-in, answer, plan, note, message)',
    ], CYAN)

    pdf.section('ACTIVE QUESTS')
    pdf.code([
        '  DAILY   [ today\'s signal     ]  Check in today.                +10 XP',
        '  GROWTH  [ reflection journey ]  Answer 100 memory questions.   → Self Scholar',
        '  WEEKLY  [ pattern weaving    ]  Engage diverse widget types.',
        '  MASTERY [ the long game      ]  100 consecutive days.          → Unwavering',
    ], GOLD)

    pdf.rule()
    pdf.body(
        '  "Self-care is not about tracking every data point.\n'
        '   It is about understanding patterns, preferences,\n'
        '   and the story of who you\'re becoming.\n\n'
        '   Your story. Your data. Your AI provider of choice.\n\n'
        '   That\'s LOT Systems."', color=GOLD)

    # ══════════════════════════════════════════════════════════
    # PAGE 10 — BACK COVER
    # ══════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_fill_color(*BG)
    pdf.rect(0, 0, 210, 297, 'F')

    pdf.set_y(46)
    back = [
        '   ╔══════════════════════════════════════════════════╗',
        '   ║                                                  ║',
        '   ║    ∘  →  ≈  →  ≋                               ║',
        '   ║    Droplet  Wave  Current                        ║',
        '   ║                                                  ║',
        '   ║    ├─  →  ╞═╡  →  ║·║                         ║',
        '   ║    Foundation  Structure  Architecture           ║',
        '   ║                                                  ║',
        '   ║    ○~  →  ○≈○  →  ≋○≋                         ║',
        '   ║    Wave Emerges  Full Tide  Ocean Depth          ║',
        '   ║                                                  ║',
        '   ╠══════════════════════════════════════════════════╣',
        '   ║                                                  ║',
        '   ║    LOT SYSTEMS                                   ║',
        '   ║    Self-care through proactive                   ║',
        '   ║    context-aware AI                              ║',
        '   ║                                                  ║',
        '   ║    Memory Engine  ·  RPG Progression             ║',
        '   ║    Quantum Intention Engine  ·  CQGS             ║',
        '   ║    Badges  ·  Achievements  ·  Easter Eggs       ║',
        '   ║                                                  ║',
        '   ║    lot-systems.com                               ║',
        '   ║    lot-systems.com/u/vadik                       ║',
        '   ║                                                  ║',
        '   ╚══════════════════════════════════════════════════╝',
    ]
    pdf.mono(8, True)
    pdf.set_text_color(*CYAN)
    for line in back:
        pdf.cell(0, 5, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    pdf.ln(8)
    pdf.mono(8, True)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 6, '"The map becomes the territory."',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    pdf.ln(4)
    pdf.mono(7)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 4, 'Created by Vadik Marmeladov, CEO & Founder, LOT Systems',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    pdf.cell(0, 4, '© 2025-2026 LOT Systems. All rights reserved.',
             new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')

    # ── Write output ──────────────────────────────────────────────────────────
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_dir = os.path.join(script_dir, '..', 'docs')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.abspath(os.path.join(out_dir, 'LOT_BADGES_ACHIEVEMENTS_MANUAL.pdf'))
    pdf.output(out_path)
    return out_path


if __name__ == '__main__':
    path = build_pdf()
    size_kb = os.path.getsize(path) // 1024
    print(f'PDF written → {path}')
    print(f'Size: {size_kb} KB  ({os.path.getsize(path)} bytes)')
