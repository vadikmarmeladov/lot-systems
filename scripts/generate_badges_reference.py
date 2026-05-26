#!/usr/bin/env python3
"""
LOT Badges & Achievements — Complete Reference PDF Generator
Light/terminal aesthetic with comprehensive tables, ASCII art gallery.
© 2025-2026 LOT Systems. All rights reserved.

Run: python3 scripts/generate_badges_reference.py
Output: docs/LOT_BADGES_AND_ACHIEVEMENTS.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

BLACK     = HexColor('#000000')
WHITE     = HexColor('#ffffff')
GREY_DARK = HexColor('#1a1a1a')
GREY_MID  = HexColor('#555555')
GREY_LITE = HexColor('#aaaaaa')
GREY_BG   = HexColor('#f5f5f5')
BORDER    = HexColor('#dddddd')

RARITY_COLORS = {
    'Common':    HexColor('#888888'),
    'Uncommon':  HexColor('#559955'),
    'Rare':      HexColor('#4455cc'),
    'Epic':      HexColor('#884499'),
    'Legendary': HexColor('#cc9922'),
    'Mythic':    HexColor('#cc4422'),
}

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm
INNER_W = PAGE_W - 2 * MARGIN

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'docs', 'LOT_BADGES_AND_ACHIEVEMENTS.pdf'
)


def P(text, style):
    return Paragraph(text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'), style)

def Praw(text, style):
    return Paragraph(text, style)

def sp(h=4):
    return Spacer(1, h * mm)

def rule(w=0.5, c=BORDER):
    return HRFlowable(width='100%', thickness=w, color=c, spaceAfter=5, spaceBefore=5)

def tbl_style(has_header=True):
    s = TableStyle([
        ('FONTNAME',       (0,0),  (-1,0 if has_header else -1), 'Courier-Bold' if has_header else 'Courier'),
        ('FONTNAME',       (0,1),  (-1,-1), 'Courier'),
        ('FONTSIZE',       (0,0),  (-1,-1), 8.5),
        ('TEXTCOLOR',      (0,0),  (-1,0 if has_header else 0), WHITE if has_header else GREY_DARK),
        ('BACKGROUND',     (0,0),  (-1,0 if has_header else 0), GREY_DARK if has_header else WHITE),
        ('ROWBACKGROUNDS', (0,1),  (-1,-1), [WHITE, GREY_BG]),
        ('GRID',           (0,0),  (-1,-1), 0.4, BORDER),
        ('VALIGN',         (0,0),  (-1,-1), 'MIDDLE'),
        ('TOPPADDING',     (0,0),  (-1,-1), 4),
        ('BOTTOMPADDING',  (0,0),  (-1,-1), 4),
        ('LEFTPADDING',    (0,0),  (-1,-1), 6),
    ])
    return s


class PageCounter(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._pages = []

    def showPage(self):
        self._pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        n = len(self._pages)
        for s in self._pages:
            self.__dict__.update(s)
            self.setFont('Courier', 7)
            self.setFillColor(GREY_LITE)
            self.drawCentredString(PAGE_W/2, 10*mm,
                f'LOT Systems  —  Badges & Achievements  —  {self._pageNumber} / {n}')
            self.setStrokeColor(BORDER)
            self.line(MARGIN, 16*mm, PAGE_W-MARGIN, 16*mm)
            super().showPage()
        super().save()


def build():
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=22*mm,
        title='LOT — Badges & Achievements Complete Reference',
        author='Vadik Marmeladov / LOT Systems',
    )

    title_s = ParagraphStyle('T', fontName='Courier-Bold', fontSize=22, textColor=BLACK,
                              spaceAfter=4, leading=28, alignment=TA_CENTER)
    sub_s   = ParagraphStyle('S', fontName='Courier', fontSize=10, textColor=GREY_MID,
                              spaceAfter=4, leading=15, alignment=TA_CENTER)
    sec_s   = ParagraphStyle('SEC', fontName='Courier-Bold', fontSize=12, textColor=BLACK,
                              spaceBefore=12, spaceAfter=5, leading=17)
    ssec_s  = ParagraphStyle('SSEC', fontName='Courier-Bold', fontSize=9.5, textColor=GREY_DARK,
                              spaceBefore=8, spaceAfter=4, leading=14)
    body_s  = ParagraphStyle('B', fontName='Courier', fontSize=9, textColor=GREY_DARK,
                              spaceAfter=4, leading=14)
    small_s = ParagraphStyle('SM', fontName='Courier', fontSize=8, textColor=GREY_MID,
                              spaceAfter=3, leading=12)
    mono_s  = ParagraphStyle('MO', fontName='Courier', fontSize=8.5, textColor=GREY_DARK,
                              spaceAfter=2, leading=13, leftIndent=6)
    mono_c  = ParagraphStyle('MC', fontName='Courier', fontSize=8.5, textColor=GREY_DARK,
                              spaceAfter=2, leading=13, alignment=TA_CENTER)
    quote_s = ParagraphStyle('Q', fontName='Courier-Oblique', fontSize=10, textColor=GREY_MID,
                              spaceBefore=6, spaceAfter=6, leading=15, alignment=TA_CENTER,
                              leftIndent=16)
    foot_s  = ParagraphStyle('FT', fontName='Courier', fontSize=7, textColor=GREY_LITE,
                              alignment=TA_CENTER)

    def code(lines):
        return [P(l, mono_s) for l in lines]

    def ascii_c(lines):
        return [P(l, mono_c) for l in lines]

    def rarity_col(style, col, rows, data):
        for i, row in enumerate(data[1:], 1):
            r = row[col]
            if r in RARITY_COLORS:
                style.add('TEXTCOLOR', (col,i), (col,i), RARITY_COLORS[r])
                style.add('FONTNAME',  (col,i), (col,i), 'Courier-Bold')

    story = []

    # COVER
    story += [sp(10),
              Praw('LOT', title_s),
              Praw('BADGES &amp; ACHIEVEMENTS SYSTEM', title_s),
              sp(3), rule(1.5, BLACK), sp(2),
              Praw('Complete Design Reference &nbsp;&middot;&nbsp; v1.0', sub_s),
              Praw('RPG &nbsp;&middot;&nbsp; Arcade &nbsp;&middot;&nbsp; Self-Care &nbsp;&middot;&nbsp; Sci-Fi &nbsp;&middot;&nbsp; Computer', sub_s),
              sp(3), rule(), sp(4)]
    story += ascii_c([
        '. : . : . : . : . : . : . : . : . : .',
        '',
        '    o  ->  ~  ->  =',
        '   |--  ->  |==|  ->  ||.||',
        '',
        '         [ PRESS START ]',
        '',
        '. : . : . : . : . : . : . : . : . : .',
    ])
    story += [sp(5),
              Praw('"Self-care is not a quest you complete. It is a world you build."', quote_s),
              sp(4), rule(), sp(2),
              P('Author: Vadik Marmeladov, CEO & Founder, LOT Systems', small_s),
              P('Copyright: (c) 2025-2026 LOT Systems. All rights reserved.', small_s),
              PageBreak()]

    # I. PHILOSOPHY
    story += [Praw('I.  PHILOSOPHY', sec_s), rule(),
              P('LOT is an RPG and Arcade of self-care. Every check-in is a move. Every streak '
                'is a power-up. Every answered memory question writes one more line of your '
                'story. Badges are not trophies — they are transmissions from a future self '
                'back to the present one.', body_s), sp(2),
              P('The badge system speaks in symbols because symbols reach parts of us that words '
                'cannot. A single = carries more meaning than a paragraph. An o~ says: you began.', body_s),
              sp(4)]

    # II. DUAL BADGE SYSTEM
    story += [Praw('II.  THE DUAL BADGE SYSTEM', sec_s), rule(),
              P('LOT offers two visual metaphors for growth. Players choose their language.', body_s),
              sp(3)]

    def simple_tbl(data, col_widths, style=None):
        if style is None:
            style = tbl_style()
        return Table(data, colWidths=col_widths, style=style)

    cw4 = [18*mm, 35*mm, 18*mm, INNER_W - 71*mm]
    water = [['Symbol', 'Name', 'Day', 'Meaning'],
             ['o', 'Droplet',  '7',   'First drops form'],
             ['~', 'Wave',     '30',  'Waves begin to flow'],
             ['=', 'Current',  '100', 'Deep currents established']]
    arch =  [['Symbol', 'Name', 'Day', 'Meaning'],
             ['|--',   'Foundation',   '7',   'Foundation laid'],
             ['|==|',  'Structure',    '30',  'Structure rises'],
             ['||.||', 'Architecture', '100', 'Architecture complete']]

    story += [Praw('<b>A. WATER PATH  o -&gt; ~ -&gt; =</b>', ssec_s),
              simple_tbl(water, cw4), sp(2),
              P('Water is patient. It does not force — it finds the path.', small_s),
              sp(4),
              Praw('<b>B. ARCHITECTURE PATH  |-- -&gt; |==| -&gt; ||.||</b>', ssec_s),
              simple_tbl(arch, cw4), sp(2),
              P('Architecture is intentional. Every block placed with care becomes load-bearing.', small_s),
              sp(4)]

    # III. MILESTONES
    story += [Praw('III.  MILESTONE BADGES', sec_s), rule()]

    ms_data = [['Water', 'Arch', 'Day', 'Name (W / A)', 'Rarity', 'Unlock Message'],
               ['o',    '|--',  '7',   'Droplet / Foundation',   'Common',    '-> First drops form o'],
               ['~',    '|==|', '30',  'Wave / Structure',        'Uncommon',  '-> Waves begin to flow ~'],
               ['=',    '||.||','100', 'Current / Architecture',  'Rare',      '-> Deep currents established ='],
               ['==', '|=|', '180', 'Half-Year Voyager',       'Epic',      '-> Six months of presence'],
               ['===', 'Y',   '365', 'The Long Count',          'Legendary', '-> A year. The architecture stands.']]

    ms_style = tbl_style()
    ms_style.add('TEXTCOLOR', (4,2),(4,2), RARITY_COLORS['Uncommon'])
    ms_style.add('TEXTCOLOR', (4,3),(4,3), RARITY_COLORS['Rare'])
    ms_style.add('TEXTCOLOR', (4,4),(4,4), RARITY_COLORS['Epic'])
    ms_style.add('TEXTCOLOR', (4,5),(4,5), RARITY_COLORS['Legendary'])
    for i in range(1,6): ms_style.add('FONTNAME',(4,i),(4,i),'Courier-Bold')

    story += [simple_tbl(ms_data, [16*mm,16*mm,12*mm,38*mm,22*mm,INNER_W-104*mm], ms_style), sp(4)]

    # IV. ACHIEVEMENTS
    story += [Praw('IV.  ACHIEVEMENT SYSTEM (RPG LAYER)', sec_s), rule(),
              P('Achievements are earned through meaningful actions — not grinding, but genuine '
                'engagement. Each achievement is a named marker in your story.', body_s), sp(3)]

    ach_data = [['Symbol','Achievement','Rarity','Category','Condition','Unlock'],
                ['o',    'First Breath',      'Common',    'Exploration', '1st check-in',          '-> The system wakes.'],
                ['<>',   'Mirror Gazer',      'Common',    'Exploration', '1st memory answer',      '-> You looked inward.'],
                ['oo',   'Signal Sent',       'Common',    'Exploration', 'Any 1st log entry',      '-> System listens.'],
                ['(',    'Week Warrior',      'Uncommon',  'Consistency', '7-day streak',           '-> Momentum builds.'],
                ['()',   'Moon Cycle',        'Rare',      'Consistency', '30-day streak',          '-> You orbit the ritual.'],
                ['*',    'Unwavering',        'Epic',      'Consistency', '100-day streak',         '-> A fixed point.'],
                ['**',   'The Long Count',    'Legendary', 'Consistency', '365-day streak',         '-> Deep calendar.'],
                ['<><>', 'Deep Diver',        'Rare',      'Depth',       '50 memory answers',      '-> Archive grows.'],
                ['<**>', 'Self Scholar',      'Epic',      'Depth',       '100 memory answers',     '-> Library of self.'],
                ['***',  'Soul Cartographer', 'Legendary', 'Depth',       '250 memory answers',     '-> Mapped yourself.'],
                ['~',    'Community Voice',   'Uncommon',  'Connection',  '1st community msg',      '-> Signal reaches others.'],
                ['~~',   'Bridge Builder',    'Uncommon',  'Connection',  '20 community msgs',      '-> A bridge exists.'],
                ['()',   'Gentle With Self',  'Uncommon',  'Care',        '10 self-care acts',      '-> Kindness to body.'],
                ['^',    'Truth Speaker',     'Rare',      'Courage',     '50 journal notes',       '-> Hall remembers.'],
                ['<3',   'Heart Tender',      'Uncommon',  'Romance',     '1st romantic note',      '-> Heart in practice.'],
                ['<33',  'Intimacy Keeper',   'Rare',      'Romance',     '10 connection notes',    '-> Sanctuary tended.']]

    ach_style = tbl_style()
    ach_style.add('FONTSIZE',(0,0),(-1,-1), 7.5)
    ach_style.add('TOPPADDING',(0,0),(-1,-1),3)
    ach_style.add('BOTTOMPADDING',(0,0),(-1,-1),3)
    rarity_col(ach_style, 2, ach_data, ach_data)
    story += [simple_tbl(ach_data, [14*mm,34*mm,22*mm,24*mm,42*mm,INNER_W-136*mm], ach_style),
              sp(4), PageBreak()]

    # V. CITIZEN INDEX
    story += [Praw('V.  CITIZEN INDEX — CQGS EVOLUTION STAGES', sec_s), rule(),
              P('The Evolution Widget tracks systemic growth through the CQGS Bioethics '
                'framework. ASCII symbols represent levels of system integration.', body_s), sp(3)]

    cqgs = [['Symbol','Level','Stage','Description'],
            ['.',   '1-9',  'Bootstrapping', 'System initializing. First signals.'],
            ['.',   '10-19','Initializing',  'Pattern compiler activating.'],
            ['o',   '20-29','Integrated',    'Modules linked. Feedback loops open.'],
            ['O',   '30-39','Compiled',      'Patterns locked. Architecture stable.'],
            ['(O)', '40-49','Optimized',     'System self-tuning. Efficiency gains.'],
            ['@',   '50+',  'Transparent',   'Fully transparent. Self-sustaining.']]

    story += [simple_tbl(cqgs, [16*mm,18*mm,30*mm,INNER_W-64*mm]), sp(4)]

    mod_data = [['Module','Symbol','Tracks'],
                ['Memory',    '^',  'Memory questions answered'],
                ['Biofield',  '~',  'Emotional check-ins'],
                ['Routine',   '#',  'Plans set / schedule'],
                ['Cleanness', 'O',  'Self-care completion'],
                ['Intention', '->',  'Intentions logged'],
                ['Journal',   '<>', 'Notes recorded'],
                ['QIE Signal','*',  'Quantum intent signals']]
    story += [Praw('<b>CQGS Module Map</b>', ssec_s),
              simple_tbl(mod_data, [28*mm,16*mm,INNER_W-44*mm]), sp(4)]

    # VI. RPG STORY ARCS
    story += [Praw('VI.  RPG STORY ARCS', sec_s), rule(),
              P("LOT's narrative co-evolves with the user's practice. Five chapters unfold.", body_s), sp(3)]

    arcs = [['Chapter','Arc','Range','Narrative'],
            ['Ch. 1','AWAKENING',   'Lvl  1-9', 'You have begun to notice yourself.'],
            ['Ch. 2','EXPLORATION', 'Lvl 10-29','Connections form. A shared language emerges.'],
            ['Ch. 3','INTEGRATION', 'Lvl 30-59','Architecture reshapes itself from experience.'],
            ['Ch. 4','MASTERY',     'Lvl 60-89','You speak the language of yourself fluently.'],
            ['Ch. 5','SAGE',        'Lvl 90-100','You and this system have co-evolved.']]

    arc_style = tbl_style()
    arc_style.add('FONTNAME',(1,1),(1,-1),'Courier-Bold')
    story += [simple_tbl(arcs, [18*mm,30*mm,28*mm,INNER_W-76*mm], arc_style), sp(3)]

    ms2 = [['Level','Milestone','Marker','Narrative Note'],
           ['10','Explorer',    'o->',  'System self-assembles around your exploration.'],
           ['30','Practitioner','~->',  'Architecture evolves from your habits.'],
           ['60','Master',      '=->',  'The system mirrors your depth.'],
           ['90','Sage',        '==->','You and the system are indistinguishable.']]

    story += [Praw('<b>Story Arc Milestones</b>', ssec_s),
              simple_tbl(ms2, [16*mm,30*mm,18*mm,INNER_W-64*mm]), sp(4), PageBreak()]

    # VII. QUEST SYSTEM
    story += [Praw('VII.  QUEST SYSTEM', sec_s), rule(),
              P('Active quests drive daily engagement. They reset, evolve, and unlock new content.', body_s), sp(3)]

    quests = [['Type','Quest','Objective','Reward'],
              ['DAILY',   "Today's Signal",    'Check in today',               '+10 XP'],
              ['DAILY',   'Presence Log',       'Write a journal entry',        '+5 XP'],
              ['DAILY',   'Memory Answer',      'Answer one memory question',   '+8 XP'],
              ['WEEKLY',  'Consistency Run',    '7-day streak',                 '+50 XP'],
              ['WEEKLY',  'Deep Reflection',    'Answer 5 questions this week', '+30 XP'],
              ['WEEKLY',  'Self-Care Sprint',   '3 self-care acts this week',   '+25 XP'],
              ['GROWTH',  'Reflection Journey', 'Answer 100 total questions',   'Self Scholar'],
              ['GROWTH',  'Bridge Protocol',    'Send 20 community messages',   'Bridge Builder'],
              ['GROWTH',  'Archive Initiative', 'Answer 250 total questions',   'Soul Cartographer'],
              ['MASTERY', 'The Long Count',     '365-day streak',               'LEGENDARY badge'],
              ['MASTERY', 'Thousand Answers',   'Answer 1,000 questions',       'MYTHIC status'],
              ['MASTERY', 'Decade of Care',     '10 years in the archive',      'COSMIC status']]

    q_style = tbl_style()
    q_style.add('FONTSIZE',(0,0),(-1,-1),8)
    for i in range(1,4):  q_style.add('TEXTCOLOR',(0,i),(0,i), HexColor('#227722'))
    for i in range(4,7):  q_style.add('TEXTCOLOR',(0,i),(0,i), HexColor('#225588'))
    for i in range(7,10): q_style.add('TEXTCOLOR',(0,i),(0,i), HexColor('#664488'))
    for i in range(10,13):q_style.add('TEXTCOLOR',(0,i),(0,i), RARITY_COLORS['Legendary'])
    for i in range(1,13): q_style.add('FONTNAME', (0,i),(0,i), 'Courier-Bold')

    story += [simple_tbl(quests, [20*mm,42*mm,58*mm,INNER_W-120*mm], q_style), sp(4)]

    # VIII. EASTER EGGS
    story += [Praw('VIII.  EASTER EGGS &amp; SECRET BADGES', sec_s), rule(),
              P('LOT is an Arcade. Hidden interactions unlock secret badges. These must be discovered through play.', body_s), sp(3)]

    eggs = [['Symbol','Badge','Trigger','Message'],
            [')))','Night Owl',     '00:00-04:00 check-in',           '"The owl sees in the dark."'],
            ['))).',  'Early Bird',   '05:00-06:00 check-in',           '"First light, first signal."'],
            ['o-o',  'Solstice',     'June 21 or Dec 21',              '"The sun paused. You were there."'],
            ['|.|',  'Friday Ritual','4 consecutive Fridays',          '"The weekly ritual holds."'],
            ['=.=',  'Palindrome',   'Palindrome date check-in',       '"Mirror day detected."'],
            ['-o-',  'Silent Hour',  '24h gap then return',            '"You rested. Good."'],
            ['~~',   'First Snow',   'Weather season change',          '"You noted the turning."'],
            ['@',    'The Void',     'Memory answer at midnight',      '"You answered in the dark."'],
            ['@.@',  'Meta-Signal',  'Write "LOT" in a memory answer', '"You named the system. [MYTHIC]"']]

    ee_style = tbl_style()
    ee_style.add('FONTSIZE',(0,0),(-1,-1),7.5)
    ee_style.add('TEXTCOLOR',(1,9),(1,9), RARITY_COLORS['Mythic'])
    ee_style.add('FONTNAME', (1,9),(1,9),'Courier-Bold')
    story += [simple_tbl(eggs, [14*mm,26*mm,62*mm,INNER_W-102*mm], ee_style), sp(4)]

    wt = [['Keyword(s)','Badge Name','Effect'],
          ['ritual',          'Ritual Keeper',    'Ritual Keeper badge activates'],
          ['breathe/breathing','Breath Anchor',   'Breath Anchor badge activates'],
          ['grateful/gratitude','Gratitude Node', 'Gratitude Node badge activates'],
          ['ocean/water',     'Aquatic Resonance','Aquatic Resonance badge activates'],
          ['stars/cosmos',    'Stargazer',        'Stargazer badge activates'],
          ['home',            'Grounded Signal',  'Grounded Signal badge activates'],
          ['dream/dreaming',  'Dream Log',        'Dream Log badge activates'],
          ['pain/difficult',  'Courage Pulse',    'Courage Pulse badge activates'],
          ['love/heart',      'Heart Signal',     'Heart Signal badge activates'],
          ['silence/quiet',   'The Quiet',        'The Quiet badge activates'],
          ['future/tomorrow', 'Horizon Seeker',   'Horizon Seeker badge activates'],
          ['LOT',             'Meta-Signal [MYTHIC]','System acknowledgment event']]

    wt_style = tbl_style()
    wt_style.add('TEXTCOLOR',(1,12),(1,12), RARITY_COLORS['Mythic'])
    wt_style.add('FONTNAME', (1,12),(1,12),'Courier-Bold')
    story += [Praw('<b>WORD TURN EASTER EGGS</b>', ssec_s),
              P('Specific words/phrases in journal entries or memory answers trigger secret badge events.', small_s),
              sp(2),
              simple_tbl(wt, [44*mm,44*mm,INNER_W-88*mm], wt_style),
              sp(4), PageBreak()]

    # IX. ASCII BADGE GALLERY
    story += [Praw('IX.  ARCADE BADGE GALLERY — ASCII ART', sec_s), rule(),
              P('Full badge art in terminal / retro-computer style.', body_s), sp(3)]

    gallery_items = [
        ('TIER 1: COMMON', [
            '+--------------------+    +--------------------+',
            '|  FIRST BREATH      |    |  MIRROR GAZER      |',
            '|                    |    |                    |',
            '|        o           |    |       <>           |',
            '|                    |    |      <><>          |',
            '|  "Spring"          |    |  "Reflection Pool" |',
            '|  Day 1 check-in    |    |  First memory Q.   |',
            '+--------------------+    +--------------------+',
        ]),
        ('TIER 2: UNCOMMON', [
            '+--------------------+    +--------------------+',
            '|  WEEK WARRIOR      |    |  BRIDGE BUILDER    |',
            '|                    |    |                    |',
            '|   o  o  o          |    |    |--------+      |',
            '|  o    o    o       |    |    |        |      |',
            '|     o  o           |    |    +--------+      |',
            '|  "Rapids"          |    |  "Archway"         |',
            '|  7-day streak      |    |  20 messages       |',
            '+--------------------+    +--------------------+',
        ]),
        ('TIER 3: RARE', [
            '+--------------------+    +--------------------+',
            '|  MOON CYCLE        |    |  DEEP DIVER        |',
            '|                    |    |                    |',
            '|    ( -> )          |    |  ~ ~ ~ ~           |',
            '|   (   ->   )       |    |    = =             |',
            '|    ( -> )          |    |      =             |',
            '|  "Tidal Cycle"     |    |  "Deep Water"      |',
            '|  30-day streak     |    |  50 answers        |',
            '+--------------------+    +--------------------+',
        ]),
        ('TIER 4: EPIC', [
            '+--------------------+    +--------------------+',
            '|  UNWAVERING        |    |  SELF SCHOLAR      |',
            '|                    |    |                    |',
            '|  *       *         |    |  +============+    |',
            '|    *   *           |    |  | ARCHIVE    |    |',
            '|      *             |    |  | [][][][][] |    |',
            '|    *   *           |    |  +============+    |',
            '|  *       *         |    |                    |',
            '|  "Constellation"   |    |  "Archive"         |',
            '|  100-day streak    |    |  100 answers       |',
            '+--------------------+    +--------------------+',
        ]),
        ('TIER 5: LEGENDARY', [
            '+============================================+',
            '|                                            |',
            '|           SOUL CARTOGRAPHER                |',
            '|                                            |',
            '|    .  .    *    .  .                       |',
            '|  .           ***           .               |',
            '|      *     *   *     *                     |',
            '|        ***       ***                       |',
            '|      *     *   *     *                     |',
            '|  .           ***           .               |',
            '|    .  .    *    .  .                       |',
            '|            "Cartography"                   |',
            '|         250 memory answers                 |',
            '+============================================+',
        ]),
        ('YEAR ONE — THE LONG COUNT', [
            '+=============================================+',
            '|                                             |',
            '|          T H E   L O N G   C O U N T       |',
            '|                                             |',
            '|   +--+                                      |',
            '|   |Y |   365 DAYS OF PRESENCE               |',
            '|   |E |   -----------------------            |',
            '|   |A |   = = =  ||.||  = = =                |',
            '|   |R |                                      |',
            '|   +--+   "The architecture stands."         |',
            '|                                             |',
            '+=============================================+',
        ]),
    ]

    for tier, lines in gallery_items:
        story += [Praw(f'<b>{tier}</b>', ssec_s)] + code(lines) + [sp(3)]

    story += [PageBreak()]

    # X. PROGRESSION TIMELINE
    story += [Praw('X.  PROGRESSION TIMELINE', sec_s), rule(),
              P('How the badge ecosystem unfolds across the player journey:', body_s), sp(3)]

    story += code([
        'DAY:  1    7    14   21   30   50   60   90   100  180  365',
        '      |    |    |    |    |    |    |    |    |    |    |  ',
        'WATR: .    o    o    o    ~    ~    ~    =    =    ==   ===',
        'ARCH: .   |--  |--  |--  |==| |==| |==| ||.| ||.| |=|   Y',
        '      |    |    |    |    |    |    |    |    |    |    |  ',
        'XP:   1   ~7   ~14  ~21  ~30  ~50  ~60  ~90 ~100 ~180 365+',
        '      |    |    |    |    |    |    |    |    |    |    |  ',
        'STGE: .    .    .    o    o    O    O    @    @    @    @@ ',
        '     Boot Init Init Intg Intg Comp Comp Optm Optm Optm Trns',
    ])
    story += [sp(2),
              P('Key: . Boot  o/O Integrated/Compiled  @ Optimized  @@ Transparent', small_s),
              sp(4)]

    # XI. OCEANIC MAYAN
    story += [Praw('XI.  OCEANIC MAYAN BADGE LANGUAGE (OPTION E)', sec_s), rule(),
              P('The most fully realized badge visual language: Mayan cycles meet water aesthetics.', body_s), sp(3)]

    mayan = [['Symbol','Meaning','Type','Condition','Unlock Message'],
             ['o~',   'Circle + Wave',      'Milestone',  'Day 7',    '"Wave patterns emerge. o~"'],
             ['o~o',  'Circle-Wave-Circle', 'Milestone',  'Day 30',   '"Tides complete. o~o"'],
             ['=o=',  'Deep Wave + Circle', 'Milestone',  'Day 100',  '"Ocean depth achieved. =o="'],
             ['~-~',  'Wave-Bar-Wave',      'Behavioral', 'Balanced', '"Tides balance. ~-~"'],
             ['~o~',  'Waves-Circle-Waves', 'Behavioral', 'Flow',     '"Flowing with the ocean. ~o~"'],
             ['-o-',  'Bar-Circle-Bar',     'Behavioral', 'Consistent','"Steady current. -o-"'],
             ['o(o',  'Moon Phases',        'Behavioral', 'Reflective','"Depth in reflection. o(o"'],
             ['o..o', 'Circles-Dots',       'Behavioral', 'Explorer', '"Scattered drops return. o..o"']]

    m_style = tbl_style()
    m_style.add('TEXTCOLOR',(2,1),(2,3), HexColor('#225588'))
    m_style.add('TEXTCOLOR',(2,4),(2,-1),HexColor('#664488'))
    for i in range(1,9): m_style.add('FONTNAME',(2,i),(2,i),'Courier-Bold')

    story += [simple_tbl(mayan, [14*mm,40*mm,24*mm,24*mm,INNER_W-102*mm], m_style), sp(4)]

    story += code([
        '======================================================',
        "                   ALEX'S PROFILE",
        '------------------------------------------------------',
        'Archetype:         The Explorer',
        'Awareness Level:   Deepening (8.4/10)',
        'Level:             =o=',
        '------------------------------------------------------',
        'Core values:',
        '    mindful =o= present ~-~ aware ~o~ grounded -o-',
        '    authentic o(o compassionate o..o',
        '======================================================',
    ])
    story += [sp(4), PageBreak()]

    # XII. BADGE UNLOCK NOTIFICATION
    story += [Praw('XII.  BADGE UNLOCK NOTIFICATION', sec_s), rule(),
              P('When a badge is unlocked, the Memory Widget displays a timed notification.', body_s), sp(3)]

    story += code([
        '+--------------------------------------------------+',
        '|  Memory:                                         |',
        '|                                                  |',
        '|  +------------------------------------------+   |',
        '|  |                                          |   |',
        '|  |   -> Deep currents established  =        |   |',
        '|  |                                          |   |',
        '|  +------------------------------------------+   |',
        '|                       [5 second fade-out]       |',
        '+--------------------------------------------------+',
    ])
    story += [sp(4)]

    # XIII. RARITY TABLE
    story += [Praw('XIII.  COMPLETE RARITY TABLE', sec_s), rule(), sp(2)]

    rar = [['Rarity','ASCII','Hex','Frequency','Examples'],
           ['Common',   '.', '#888888','First acts',   'First Breath, Mirror Gazer'],
           ['Uncommon', 'o', '#559955','Days 1-14',    'Week Warrior, Community Voice'],
           ['Rare',     '(', '#4455cc','Days 30+',     'Moon Cycle, Deep Diver'],
           ['Epic',     '*', '#884499','Days 100+',    'Unwavering, Self Scholar'],
           ['Legendary','**','#cc9922','Days 365+',    'Long Count, Soul Cartographer'],
           ['Mythic',   '@', '#cc4422','Hidden only',  'Meta-Signal']]

    r_style = tbl_style()
    for i, rarity in enumerate(['Common','Uncommon','Rare','Epic','Legendary','Mythic'],1):
        r_style.add('TEXTCOLOR',(0,i),(0,i), RARITY_COLORS[rarity])
        r_style.add('FONTNAME', (0,i),(0,i),'Courier-Bold')

    story += [simple_tbl(rar, [22*mm,14*mm,22*mm,24*mm,INNER_W-82*mm], r_style), sp(4)]

    # XIV. IMPLEMENTATION STATUS
    story += [Praw('XIV.  IMPLEMENTATION STATUS', sec_s), rule(), sp(2)]

    live = [['Status','Component','Description'],
            ['[V]','badges.ts',         'Core badge types, award logic, localStorage'],
            ['[V]','BadgeUnlockFeed',   'Community unlock activity feed'],
            ['[V]','GrowthMilestones',  'Personal + community growth display'],
            ['[V]','EvolutionWidget',   'CQGS stage + achievements counter'],
            ['[V]','MemoryWidget',      'Badge unlock notification display'],
            ['[V]','rpg-narrative.ts',  '13 achievements + 5 story arcs'],
            ['[V]','PublicProfile',     'Level field (Water or Architecture theme)']]

    road = [['Status','Component','Description'],
            ['[o]','Extended milestones','Day 14, 21, 50, 60, 90, 180, 365 badges'],
            ['[o]','Pattern badges',     'Balanced, Flow, Consistent, Reflective, Explorer'],
            ['[o]','Easter egg engine',  'Word turn detection, time-based triggers'],
            ['[o]','Oceanic Mayan',      'Full Option E visual language implementation'],
            ['[o]','Quest tracker UI',   'Active quest display component'],
            ['[o]','Badge gallery',      'Collection viewer with progress'],
            ['[o]','Secret badge system','Hidden badge discovery via keyword detection']]

    l_style = tbl_style()
    r_road_style = tbl_style()
    for i in range(1,8): r_road_style.add('TEXTCOLOR',(0,i),(0,i), HexColor('#999944'))
    for i in range(1,8): r_road_style.add('FONTNAME',(0,i),(0,i),'Courier-Bold')

    cw3 = [12*mm, 44*mm, INNER_W-56*mm]
    story += [Praw('<b>Currently Live</b>', ssec_s),
              simple_tbl(live, cw3, l_style), sp(4),
              Praw('<b>In Design / Roadmap</b>', ssec_s),
              simple_tbl(road, cw3, r_road_style), sp(4)]

    # XV. UNICODE REFERENCE
    story += [Praw('XV.  UNICODE REFERENCE', sec_s), rule(),
              P('All LOT badge symbols use standard Unicode with 100% browser support.', body_s), sp(3)]

    uni = [['Symbol','Unicode','Name','Use in LOT'],
           ['∘','U+2218','Ring Operator',         'Water Day 7 milestone'],
           ['≈','U+2248','Almost Equal To',        'Water Day 30 milestone'],
           ['≋','U+224B','Triple Tilde',            'Water Day 100 milestone'],
           ['○','U+25CB','White Circle',            'Oceanic center symbol'],
           ['∿','U+223F','Sine Wave',              'Oceanic wave symbol'],
           ['◐','U+25D0','Circle Left Half Black', 'Moon phase / Reflective badge'],
           ['∴','U+2234','Therefore',              'Explorer pattern badge'],
           ['✦','U+2726','Black Four Pointed Star','Epic / Legendary badges'],
           ['◉','U+25C9','Fisheye',                'Mythic / CQGS Transparent stage'],
           ['·','U+00B7','Middle Dot',             'Default trait separator'],
           ['→','U+2192','Rightwards Arrow',       'Progression indicator'],
           ['↳','U+21B3','Downwards Right Arrow',  'Sub-item / unlock notification']]

    u_style = tbl_style()
    u_style.add('ALIGN',(0,0),(1,-1),'CENTER')
    story += [simple_tbl(uni, [14*mm,22*mm,52*mm,INNER_W-88*mm], u_style), sp(8)]

    # FINAL
    story += [rule(1.0, BLACK), sp(4)]
    story += ascii_c([
        '',
        'LOT Systems  --  Self-care through proactive context-aware AI',
        'The Memory Engine remembers. The Arcade rewards. The story continues.',
        '',
        '    o -> ~ -> =        (Water Path)',
        '   |-- -> |==| -> ||.||   (Architecture Path)',
        '',
        '               [ PRESS START ]',
        '',
    ])
    story += [sp(4),
              Praw('LOT Systems &mdash; Badges &amp; Achievements System &mdash; v1.0', foot_s),
              Praw('&copy; 2025&ndash;2026 LOT Systems. All rights reserved.', foot_s)]

    doc.build(story, canvasmaker=PageCounter)
    print(f'PDF generated: {OUTPUT_PATH}')


if __name__ == '__main__':
    build()
