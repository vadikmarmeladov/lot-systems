#!/usr/bin/env python3
"""
LOT Badges & Achievements — PDF Generator
© 2025-2026 LOT Systems. All rights reserved.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, Preformatted
)
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

# ─── Palette ──────────────────────────────────────────────────────────────────
BLACK     = HexColor('#000000')
WHITE     = HexColor('#ffffff')
GREY_DARK = HexColor('#1a1a1a')
GREY_MID  = HexColor('#555555')
GREY_LITE = HexColor('#aaaaaa')
GREY_BG   = HexColor('#f5f5f5')
ACCENT    = HexColor('#222222')
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
    'docs',
    'LOT_BADGES_AND_ACHIEVEMENTS.pdf'
)

# ─── Styles ───────────────────────────────────────────────────────────────────
def make_styles():
    base = getSampleStyleSheet()

    def s(name, **kw):
        return ParagraphStyle(name, **kw)

    return {
        'title': s('title',
            fontName='Courier-Bold', fontSize=22,
            textColor=BLACK, spaceAfter=6, leading=28,
            alignment=TA_CENTER),

        'subtitle': s('subtitle',
            fontName='Courier', fontSize=11,
            textColor=GREY_MID, spaceAfter=4, leading=16,
            alignment=TA_CENTER),

        'section': s('section',
            fontName='Courier-Bold', fontSize=13,
            textColor=BLACK, spaceBefore=14, spaceAfter=6,
            leading=18, borderPadding=(0,0,4,0)),

        'subsection': s('subsection',
            fontName='Courier-Bold', fontSize=10,
            textColor=GREY_DARK, spaceBefore=10, spaceAfter=4,
            leading=14),

        'body': s('body',
            fontName='Courier', fontSize=9,
            textColor=GREY_DARK, spaceAfter=4,
            leading=14),

        'body_small': s('body_small',
            fontName='Courier', fontSize=8,
            textColor=GREY_MID, spaceAfter=3,
            leading=12),

        'mono': s('mono',
            fontName='Courier', fontSize=8.5,
            textColor=GREY_DARK, spaceAfter=2,
            leading=13, leftIndent=8),

        'mono_center': s('mono_center',
            fontName='Courier', fontSize=8.5,
            textColor=GREY_DARK, spaceAfter=2,
            leading=13, alignment=TA_CENTER),

        'quote': s('quote',
            fontName='Courier-Oblique', fontSize=10,
            textColor=GREY_MID, spaceBefore=8, spaceAfter=8,
            leading=16, leftIndent=16, alignment=TA_CENTER),

        'label_common':    s('label_common',    fontName='Courier-Bold', fontSize=8, textColor=RARITY_COLORS['Common'],    leading=12),
        'label_uncommon':  s('label_uncommon',  fontName='Courier-Bold', fontSize=8, textColor=RARITY_COLORS['Uncommon'],  leading=12),
        'label_rare':      s('label_rare',       fontName='Courier-Bold', fontSize=8, textColor=RARITY_COLORS['Rare'],      leading=12),
        'label_epic':      s('label_epic',       fontName='Courier-Bold', fontSize=8, textColor=RARITY_COLORS['Epic'],      leading=12),
        'label_legendary': s('label_legendary',  fontName='Courier-Bold', fontSize=8, textColor=RARITY_COLORS['Legendary'], leading=12),
        'label_mythic':    s('label_mythic',     fontName='Courier-Bold', fontSize=8, textColor=RARITY_COLORS['Mythic'],    leading=12),

        'footer': s('footer',
            fontName='Courier', fontSize=7,
            textColor=GREY_LITE, alignment=TA_CENTER),
    }

ST = make_styles()

# ─── Helpers ──────────────────────────────────────────────────────────────────
def rule(weight=0.5, color=BORDER):
    return HRFlowable(width='100%', thickness=weight, color=color, spaceAfter=6, spaceBefore=6)

def sp(h=4):
    return Spacer(1, h * mm)

def code_block(lines, indent=0):
    """Render a block of monospaced lines."""
    items = []
    for line in lines:
        items.append(Paragraph(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'),
                               ST['mono']))
    return items

def ascii_box(lines):
    """Full-width centered mono block."""
    items = []
    for line in lines:
        items.append(Paragraph(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'),
                               ST['mono_center']))
    return items

def badge_row(symbol, name, rarity, description, unlock_msg):
    rarity_style = ST.get(f'label_{rarity.lower()}', ST['label_common'])
    return [
        Paragraph(f'<b>{symbol}</b>', ST['subsection']),
        Paragraph(f'<b>{name}</b>', ST['body']),
        Paragraph(rarity, rarity_style),
        Paragraph(description, ST['body_small']),
        Paragraph(f'<i>{unlock_msg}</i>', ST['body_small']),
    ]

# ─── Page template ────────────────────────────────────────────────────────────
class NumberedCanvas(canvas.Canvas):
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
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.setFont('Courier', 7)
        self.setFillColor(GREY_LITE)
        self.drawCentredString(
            PAGE_W / 2,
            12 * mm,
            f'LOT Systems  —  Badges & Achievements  —  page {self._pageNumber} of {page_count}'
        )
        self.setFillColor(BORDER)
        self.line(MARGIN, 18 * mm, PAGE_W - MARGIN, 18 * mm)


# ─── Document assembly ────────────────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=25 * mm,
        title='LOT — Badges & Achievements System',
        author='Vadik Marmeladov / LOT Systems',
        subject='Complete Badge & Achievement Reference v1.0',
    )

    story = []

    # ── Cover ─────────────────────────────────────────────────────────────────
    story += [
        sp(12),
        Paragraph('LOT', ST['title']),
        Paragraph('BADGES &amp; ACHIEVEMENTS SYSTEM', ST['title']),
        sp(4),
        rule(1.5, BLACK),
        sp(2),
        Paragraph('Complete Design Reference  ·  v1.0', ST['subtitle']),
        Paragraph('RPG · Arcade · Self-Care · Sci-Fi · Computer', ST['subtitle']),
        sp(3),
        rule(0.5),
        sp(4),
    ]

    story += ascii_box([
        '  . : . : . : . : . : . : . : . : . : . : . ',
        '',
        '         o  ->  ~  ->  =         ',
        '        |--  ->  |==|  ->  ||.||  ',
        '',
        '           [ PRESS START ]          ',
        '',
        '  . : . : . : . : . : . : . : . : . : . : . ',
    ])

    story += [
        sp(6),
        Paragraph('"Self-care is not a quest you complete. It is a world you build."', ST['quote']),
        sp(4),
        rule(0.5),
        sp(2),
        Paragraph('Author: Vadik Marmeladov, CEO &amp; Founder, LOT Systems', ST['body_small']),
        Paragraph('Copyright: &copy; 2025&ndash;2026 LOT Systems. All rights reserved.', ST['body_small']),
        PageBreak(),
    ]

    # ── I. Philosophy ─────────────────────────────────────────────────────────
    story += [
        Paragraph('I.  PHILOSOPHY', ST['section']),
        rule(),
        Paragraph(
            'LOT is an RPG and Arcade of self-care. Every check-in is a move. Every streak is a power-up. '
            'Every answered memory question writes one more line of your story. Badges are not trophies — '
            'they are transmissions from a future self back to the present one.',
            ST['body']),
        sp(3),
        Paragraph(
            'The badge system speaks in symbols because symbols reach parts of us that words cannot. '
            'A single <b>&#x224B;</b> carries more meaning than a paragraph. An <b>&#x2218;&#x223F;</b> says: <i>you began</i>.',
            ST['body']),
        sp(4),
    ]

    # ── II. Dual Badge System ─────────────────────────────────────────────────
    story += [
        Paragraph('II.  THE DUAL BADGE SYSTEM', ST['section']),
        rule(),
        Paragraph('LOT offers two visual metaphors for growth. Players choose their language.', ST['body']),
        sp(3),
    ]

    # Water path table
    water_data = [
        ['Symbol', 'Name', 'Day', 'Meaning'],
        ['∘', 'Droplet',  ' 7',  'First drops form'],
        ['≈', 'Wave',     '30',  'Waves begin to flow'],
        ['≋', 'Current',  '100', 'Deep currents established'],
    ]
    arch_data = [
        ['Symbol', 'Name', 'Day', 'Meaning'],
        ['|--',    'Foundation',   ' 7',  'Foundation laid'],
        ['|==|',   'Structure',    '30',  'Structure rises'],
        ['||.||',  'Architecture', '100', 'Architecture complete'],
    ]

    cell_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ])

    col_w = [18*mm, 35*mm, 18*mm, INNER_W - 71*mm]

    story += [
        Paragraph('<b>A. WATER PATH  ∘ &rarr; ≈ &rarr; ≋</b>', ST['subsection']),
        Table(water_data, colWidths=col_w, style=cell_style),
        sp(2),
        Paragraph('Water is patient. It does not force — it finds the path.', ST['body_small']),
        sp(4),
        Paragraph('<b>B. ARCHITECTURE PATH  |-- &rarr; |==| &rarr; ||.||</b>', ST['subsection']),
        Table(arch_data, colWidths=col_w, style=cell_style),
        sp(2),
        Paragraph('Architecture is intentional. Every block placed with care becomes load-bearing.', ST['body_small']),
        sp(4),
    ]

    # ── III. Milestone Badges ─────────────────────────────────────────────────
    story += [
        Paragraph('III.  MILESTONE BADGES', ST['section']),
        rule(),
    ]

    milestone_data = [
        ['Water', 'Arch', 'Day', 'Name (W / A)', 'Rarity', 'Unlock Message'],
        ['∘',    '|--',  ' 7',  'Droplet / Foundation',   'Common',    '↳ First drops form ∘'],
        ['≈',    '|==|', '30',  'Wave / Structure',        'Uncommon',  '↳ Waves begin to flow ≈'],
        ['≋',    '||.||','100', 'Current / Architecture',  'Rare',      '↳ Deep currents established ≋'],
        ['≋≋', '|=|', '180', 'Half-Year Voyager',    'Epic',      '↳ Six months of presence'],
        ['≋≋≋', 'Y', '365', 'The Long Count',   'Legendary', '↳ A year. The architecture stands.'],
    ]

    rarity_row_colors = [
        GREY_DARK,
        WHITE, GREY_BG, WHITE, GREY_BG, WHITE
    ]

    ms_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        # Color the rarity cells
        ('TEXTCOLOR',   (4,2), (4,2),  RARITY_COLORS['Uncommon']),
        ('TEXTCOLOR',   (4,3), (4,3),  RARITY_COLORS['Rare']),
        ('TEXTCOLOR',   (4,4), (4,4),  RARITY_COLORS['Epic']),
        ('TEXTCOLOR',   (4,5), (4,5),  RARITY_COLORS['Legendary']),
        ('FONTNAME',    (4,1), (4,-1), 'Courier-Bold'),
    ])

    ms_col_w = [16*mm, 16*mm, 12*mm, 40*mm, 22*mm, INNER_W - 106*mm]
    story += [
        Table(milestone_data, colWidths=ms_col_w, style=ms_style),
        sp(4),
    ]

    # ── IV. Achievement System ────────────────────────────────────────────────
    story += [
        Paragraph('IV.  ACHIEVEMENT SYSTEM (RPG LAYER)', ST['section']),
        rule(),
        Paragraph(
            'Achievements are earned through meaningful actions — not grinding, but genuine engagement. '
            'Each achievement is a named marker in your story.',
            ST['body']),
        sp(3),
    ]

    achievements = [
        # symbol, name, rarity, category, condition, unlock_msg
        ('∘',     'First Breath',      'Common',    'Exploration',  'First emotional check-in',           '↳ The system wakes.'),
        ('◇',     'Mirror Gazer',      'Common',    'Exploration',  'First memory question answered',      '↳ You looked inward.'),
        ('∘∘', 'Signal Sent',     'Common',    'Exploration',  'Any first log entry',                '↳ The system begins to listen.'),
        ('◐',     'Week Warrior',      'Uncommon',  'Consistency',  '7 consecutive check-in days',        '↳ Momentum builds.'),
        ('◐◑', 'Moon Cycle',      'Rare',      'Consistency',  '30 consecutive days',                '↳ You orbit the ritual.'),
        ('✦',     'Unwavering',        'Epic',      'Consistency',  '100 consecutive days',               '↳ You are a fixed point in the sky.'),
        ('✦✦', 'The Long Count',  'Legendary', 'Consistency',  '365 consecutive days',               '↳ Your name is in the deep calendar.'),
        ('◇◇', 'Deep Diver',      'Rare',      'Depth',        '50 memory questions answered',       '↳ The archive grows.'),
        ('◆',     'Self Scholar',      'Epic',      'Depth',        '100 memory questions answered',      '↳ A library of self.'),
        ('✦◆', 'Soul Cartographer', 'Legendary','Depth',       '250 memory questions answered',      '↳ You have mapped yourself.'),
        ('~',          'Community Voice',   'Uncommon',  'Connection',   'First community message sent',       '↳ The signal reaches others.'),
        ('≈',     'Bridge Builder',    'Uncommon',  'Connection',   '20 community messages sent',         '↳ A bridge now exists.'),
        ('◆',     'Gentle With Self',  'Uncommon',  'Care',         '10 self-care practices completed',   '↳ Kindness toward the body.'),
        ('▲',     'Truth Speaker',     'Rare',      'Courage',      '50 journal notes logged',            '↳ The hall remembers.'),
        ('♡',     'Heart Tender',      'Uncommon',  'Romance',      'Romantic connection acknowledged',   '↳ The heart is part of the practice.'),
        ('♡♡', 'Intimacy Keeper', 'Rare',      'Romance',      '10 connection notes logged',         '↳ The sanctuary is tended.'),
    ]

    ach_data = [['Symbol', 'Achievement', 'Rarity', 'Category', 'Condition', 'Unlock Message']]
    for sym, name, rarity, cat, cond, msg in achievements:
        ach_data.append([sym, name, rarity, cat, cond, msg])

    ach_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 7.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.3, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 3),
        ('BOTTOMPADDING',(0,0),(-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ])

    # Color rarity column
    rarity_order = ['Common','Uncommon','Rare','Epic','Legendary','Mythic']
    for i, row in enumerate(achievements, start=1):
        rarity = row[2]
        if rarity in RARITY_COLORS:
            ach_style.add('TEXTCOLOR', (2,i), (2,i), RARITY_COLORS[rarity])
            ach_style.add('FONTNAME',  (2,i), (2,i), 'Courier-Bold')

    ach_col_w = [14*mm, 36*mm, 22*mm, 24*mm, 44*mm, INNER_W - 140*mm]
    story += [
        Table(ach_data, colWidths=ach_col_w, style=ach_style),
        sp(4),
        PageBreak(),
    ]

    # ── V. Citizen Index ──────────────────────────────────────────────────────
    story += [
        Paragraph('V.  CITIZEN INDEX — CQGS EVOLUTION STAGES', ST['section']),
        rule(),
        Paragraph(
            'The Evolution Widget tracks systemic growth through the CQGS Bioethics framework. '
            'Stages use ASCII symbols representing levels of system integration.',
            ST['body']),
        sp(3),
    ]

    cqgs_data = [
        ['Symbol', 'Level', 'Stage', 'Description'],
        ['.',      '1-9',   'Bootstrapping', 'System initializing. First signals received.'],
        ['.',      '10-19', 'Initializing',  'Pattern compiler activating. Loops forming.'],
        ['∘', '20-29', 'Integrated',    'Modules linked. Feedback loops open.'],
        ['○', '30-39', 'Compiled',      'Patterns locked in. Architecture stable.'],
        ['◯', '40-49', 'Optimized',     'System self-tuning. Efficiency gains.'],
        ['◉', '50+',   'Transparent',   'Fully transparent. Self-sustaining system.'],
    ]

    cqgs_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('ALIGN',       (0,0), (1,-1),  'CENTER'),
    ])

    cqgs_col_w = [16*mm, 18*mm, 32*mm, INNER_W - 66*mm]
    story += [
        Table(cqgs_data, colWidths=cqgs_col_w, style=cqgs_style),
        sp(4),
    ]

    # CQGS Modules
    story += [
        Paragraph('<b>CQGS Bioethics Framework — Module Map</b>', ST['subsection']),
        sp(2),
    ]

    mod_data = [
        ['Module', 'Symbol', 'Tracks'],
        ['Memory',    '▸',  'Memory questions answered'],
        ['Biofield',  '~',       'Emotional check-ins'],
        ['Routine',   '■',  'Plans set / schedule maintained'],
        ['Cleanness', '○',  'Self-care completion'],
        ['Intention', '→',  'Intentions logged'],
        ['Journal',   '◇',  'Notes recorded'],
        ['QIE Signal','✦',  'Quantum intent signals sent'],
    ]

    mod_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('ALIGN',       (1,0), (1,-1),  'CENTER'),
    ])

    mod_col_w = [28*mm, 18*mm, INNER_W - 46*mm]
    story += [
        Table(mod_data, colWidths=mod_col_w, style=mod_style),
        sp(4),
    ]

    # ── VI. RPG Story Arcs ────────────────────────────────────────────────────
    story += [
        Paragraph('VI.  RPG STORY ARCS', ST['section']),
        rule(),
        Paragraph(
            "LOT's narrative co-evolves with the user's practice. The system is not a passive tracker "
            "— it is a co-author. Five chapters unfold across 100 levels.",
            ST['body']),
        sp(3),
    ]

    arcs = [
        ('Ch. 1', 'AWAKENING',   'Levels  1-9',  'You have begun to notice yourself.'),
        ('Ch. 2', 'EXPLORATION', 'Levels 10-29', 'Connections form. A shared language emerges.'),
        ('Ch. 3', 'INTEGRATION', 'Levels 30-59', 'Architecture reshapes itself from experience.'),
        ('Ch. 4', 'MASTERY',     'Levels 60-89', 'You speak the language of yourself fluently.'),
        ('Ch. 5', 'SAGE',        'Levels 90-100','You and this system have co-evolved.'),
    ]

    arc_data = [['Chapter', 'Arc', 'Range', 'Narrative']]
    for ch, arc, rng, narr in arcs:
        arc_data.append([ch, arc, rng, narr])

    arc_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',(0,0),(-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('FONTNAME',    (1,1), (1,-1),  'Courier-Bold'),
    ])

    arc_col_w = [18*mm, 32*mm, 28*mm, INNER_W - 78*mm]
    story += [
        Table(arc_data, colWidths=arc_col_w, style=arc_style),
        sp(3),
    ]

    # Milestones
    story += [
        Paragraph('<b>Story Arc Milestones</b>', ST['subsection']),
    ]

    ms2_data = [
        ['Level', 'Milestone', 'Marker', 'Narrative Note'],
        ['10',  'Explorer',    '∘→',  'System self-assembles around your exploration.'],
        ['30',  'Practitioner','≈→',  'Architecture evolves from your habits.'],
        ['60',  'Master',      '≋→',  'The system mirrors your depth.'],
        ['90',  'Sage',        '≋≋→','You and the system are indistinguishable.'],
    ]

    ms2_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('ALIGN',       (0,0), (1,-1),  'CENTER'),
    ])

    ms2_col_w = [16*mm, 30*mm, 18*mm, INNER_W - 64*mm]
    story += [
        Table(ms2_data, colWidths=ms2_col_w, style=ms2_style),
        sp(4),
        PageBreak(),
    ]

    # ── VII. Quest System ─────────────────────────────────────────────────────
    story += [
        Paragraph('VII.  QUEST SYSTEM', ST['section']),
        rule(),
        Paragraph('Active quests drive daily engagement. They reset, evolve, and unlock new content.', ST['body']),
        sp(3),
    ]

    quest_data = [
        ['Type', 'Quest', 'Objective', 'Reward'],
        ['DAILY',   "Today's Signal",      'Check in today',                  '+10 XP'],
        ['DAILY',   'Presence Log',         'Write a journal entry',           '+5 XP'],
        ['DAILY',   'Memory Answer',        'Answer one memory question',      '+8 XP'],
        ['WEEKLY',  'Consistency Run',      '7-day streak',                    '+50 XP'],
        ['WEEKLY',  'Deep Reflection',      'Answer 5 questions this week',    '+30 XP'],
        ['WEEKLY',  'Self-Care Sprint',     '3 self-care acts this week',      '+25 XP'],
        ['GROWTH',  'Reflection Journey',   'Answer 100 total questions',      'Self Scholar'],
        ['GROWTH',  'Bridge Protocol',      'Send 20 community messages',      'Bridge Builder'],
        ['GROWTH',  'Archive Initiative',   'Answer 250 total questions',      'Soul Cartographer'],
        ['MASTERY', 'The Long Count',       '365-day streak',                  'LEGENDARY badge'],
        ['MASTERY', 'Thousand Answers',     'Answer 1,000 memory questions',   'MYTHIC status'],
        ['MASTERY', 'Decade of Care',       '10 years in the archive',         'COSMIC status'],
    ]

    q_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        # Type label colors
        ('TEXTCOLOR',   (0,1), (0,3),  HexColor('#227722')),   # DAILY
        ('TEXTCOLOR',   (0,4), (0,6),  HexColor('#225588')),   # WEEKLY
        ('TEXTCOLOR',   (0,7), (0,9),  HexColor('#664488')),   # GROWTH
        ('TEXTCOLOR',   (0,10),(0,12), RARITY_COLORS['Legendary']),  # MASTERY
        ('FONTNAME',    (0,1), (0,-1), 'Courier-Bold'),
    ])

    q_col_w = [20*mm, 42*mm, 60*mm, INNER_W - 122*mm]
    story += [
        Table(quest_data, colWidths=q_col_w, style=q_style),
        sp(4),
    ]

    # ── VIII. Easter Eggs ─────────────────────────────────────────────────────
    story += [
        Paragraph('VIII.  EASTER EGGS &amp; SECRET BADGES', ST['section']),
        rule(),
        Paragraph(
            'LOT is an Arcade. Hidden interactions unlock secret badges. These are not documented '
            'in the app — they must be discovered through play.',
            ST['body']),
        sp(3),
    ]

    easter_data = [
        ['Symbol', 'Badge', 'Trigger', 'Message'],
        [')))',     'Night Owl',      'Check in between 00:00-04:00',          '"The owl sees in the dark."'],
        ['))).', 'Early Bird',       'Check in between 05:00-06:00',          '"First light, first signal."'],
        ['o-o',    'Solstice',       'Check in on June 21 or Dec 21',          '"The sun paused. You were there."'],
        ['|.|',    'Friday Ritual',  'Check in 4 consecutive Fridays',         '"The weekly ritual holds."'],
        ['=.=',    'Palindrome Day', 'Check in on a palindrome date',          '"Mirror day detected."'],
        ['-o-',    'Silent Hour',    '24h gap then return',                    '"You rested. Good."'],
        ['~~',     'First Snow/Rain','Check in when weather changes season',   '"You noted the turning."'],
        ['◉', 'The Void',       'Answer memory question at midnight',     '"You answered in the dark."'],
        ['o.o',    'Meta-Signal',    'Write "LOT" in a memory answer',         '"You named the system."'],
    ]

    ee_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 7.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.3, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        # Meta-Signal special color
        ('TEXTCOLOR',   (1,9), (1,9),   RARITY_COLORS['Mythic']),
        ('FONTNAME',    (1,9), (1,9),   'Courier-Bold'),
    ])

    ee_col_w = [14*mm, 28*mm, 64*mm, INNER_W - 106*mm]
    story += [
        Table(easter_data, colWidths=ee_col_w, style=ee_style),
        sp(4),
    ]

    # Word Turns
    story += [
        Paragraph('<b>WORD TURN EASTER EGGS</b>', ST['subsection']),
        Paragraph(
            'When specific words appear in journal entries or memory answers, secret events trigger. '
            'These are activated server-side via NLP keyword detection.',
            ST['body_small']),
        sp(2),
    ]

    word_turns = [
        ('ritual',          'Ritual Keeper',      'Ritual Keeper badge activates'),
        ('breathe/breathing', 'Breath Anchor',    'Breath Anchor badge activates'),
        ('grateful/gratitude','Gratitude Node',   'Gratitude Node badge activates'),
        ('ocean/water',     'Aquatic Resonance',  'Aquatic Resonance badge activates'),
        ('stars/cosmos',    'Stargazer',          'Stargazer badge activates'),
        ('home',            'Grounded Signal',    'Grounded Signal badge activates'),
        ('dream/dreaming',  'Dream Log',          'Dream Log badge activates'),
        ('pain/difficult',  'Courage Pulse',      'Courage Pulse badge activates'),
        ('love/heart',      'Heart Signal',       'Heart Signal badge activates'),
        ('silence/quiet',   'The Quiet',          'The Quiet badge activates'),
        ('future/tomorrow', 'Horizon Seeker',     'Horizon Seeker badge activates'),
        ('LOT',             'Meta-Signal [MYTHIC]','System acknowledgment event'),
    ]

    wt_data = [['Keyword(s)', 'Badge Name', 'Effect']] + [list(r) for r in word_turns]

    wt_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.3, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 3),
        ('BOTTOMPADDING',(0,0),(-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('TEXTCOLOR',   (1,12),(1,12),  RARITY_COLORS['Mythic']),
        ('FONTNAME',    (1,12),(1,12),  'Courier-Bold'),
    ])

    wt_col_w = [44*mm, 44*mm, INNER_W - 88*mm]
    story += [
        Table(wt_data, colWidths=wt_col_w, style=wt_style),
        sp(4),
        PageBreak(),
    ]

    # ── IX. ASCII Badge Gallery ───────────────────────────────────────────────
    story += [
        Paragraph('IX.  ARCADE BADGE GALLERY — ASCII ART', ST['section']),
        rule(),
        Paragraph('Full badge art rendered in terminal / retro-computer style.', ST['body']),
        sp(3),
    ]

    gallery = [
        ('TIER 1: COMMON', [
            '  +--------------------+    +--------------------+  ',
            '  |  FIRST BREATH      |    |  MIRROR GAZER      |  ',
            '  |                    |    |                    |  ',
            '  |        o           |    |       <>           |  ',
            '  |                    |    |      <><>          |  ',
            '  |  "Spring"          |    |  "Reflection Pool" |  ',
            '  |  Day 1 check-in    |    |  First memory Q.   |  ',
            '  +--------------------+    +--------------------+  ',
        ]),
        ('TIER 2: UNCOMMON', [
            '  +--------------------+    +--------------------+  ',
            '  |  WEEK WARRIOR      |    |  BRIDGE BUILDER    |  ',
            '  |                    |    |                    |  ',
            '  |   o  o  o          |    |    |--------+      |  ',
            '  |  o    o    o       |    |    |        |      |  ',
            '  |     o  o           |    |    +--------+      |  ',
            '  |                    |    |                    |  ',
            '  |  "Rapids"          |    |  "Archway"         |  ',
            '  |  7-day streak      |    |  20 messages       |  ',
            '  +--------------------+    +--------------------+  ',
        ]),
        ('TIER 3: RARE', [
            '  +--------------------+    +--------------------+  ',
            '  |  MOON CYCLE        |    |  DEEP DIVER        |  ',
            '  |                    |    |                    |  ',
            '  |    ( -> )          |    |  ~ ~ ~ ~           |  ',
            '  |   (   ->   )       |    |    = =             |  ',
            '  |    ( -> )          |    |      =             |  ',
            '  |                    |    |                    |  ',
            '  |  "Tidal Cycle"     |    |  "Deep Water"      |  ',
            '  |  30-day streak     |    |  50 answers        |  ',
            '  +--------------------+    +--------------------+  ',
        ]),
        ('TIER 4: EPIC', [
            '  +--------------------+    +--------------------+  ',
            '  |  UNWAVERING        |    |  SELF SCHOLAR      |  ',
            '  |                    |    |                    |  ',
            '  |  *       *         |    |  +============+    |  ',
            '  |    *   *           |    |  | ARCHIVE    |    |  ',
            '  |      *             |    |  | [][][][][] |    |  ',
            '  |    *   *           |    |  +============+    |  ',
            '  |  *       *         |    |                    |  ',
            '  |  "Constellation"   |    |  "Archive"         |  ',
            '  |  100-day streak    |    |  100 answers       |  ',
            '  +--------------------+    +--------------------+  ',
        ]),
        ('TIER 5: LEGENDARY', [
            '  +============================================+  ',
            '  |                                            |  ',
            '  |           SOUL CARTOGRAPHER                |  ',
            '  |                                            |  ',
            '  |    .  .    *    .  .                       |  ',
            '  |  .           ***           .               |  ',
            '  |      *     *   *     *                     |  ',
            '  |        ***       ***                       |  ',
            '  |      *     *   *     *                     |  ',
            '  |  .           ***           .               |  ',
            '  |    .  .    *    .  .                       |  ',
            '  |                                            |  ',
            '  |            "Cartography"                   |  ',
            '  |         250 memory answers                 |  ',
            '  |                                            |  ',
            '  +============================================+  ',
        ]),
        ('YEAR ONE: LEGENDARY — THE LONG COUNT', [
            '  +=============================================+  ',
            '  |                                             |  ',
            '  |          T H E   L O N G   C O U N T       |  ',
            '  |                                             |  ',
            '  |   +--+                                      |  ',
            '  |   |Y |   365 DAYS OF PRESENCE               |  ',
            '  |   |E |   -----------------------            |  ',
            '  |   |A |   = = =  ||.||  = = =                |  ',
            '  |   |R |                                      |  ',
            '  |   +--+   "The architecture stands."         |  ',
            '  |                                             |  ',
            '  +=============================================+  ',
        ]),
    ]

    for tier_title, lines in gallery:
        story += [
            Paragraph(f'<b>{tier_title}</b>', ST['subsection']),
        ]
        story += code_block(lines)
        story += [sp(3)]

    story += [PageBreak()]

    # ── X. Progression Timeline ───────────────────────────────────────────────
    story += [
        Paragraph('X.  PROGRESSION TIMELINE VISUALIZATION', ST['section']),
        rule(),
        Paragraph('How the badge ecosystem unfolds across the player journey:', ST['body']),
        sp(3),
    ]

    timeline_lines = [
        'DAY:  1    7    14   21   30   50   60   90   100  180  365',
        '      |    |    |    |    |    |    |    |    |    |    |  ',
        'WATR: .    o    o    o    ~    ~    ~    =    =    ==   ===',
        'ARCH: .   |--  |--  |--  |==| |==| |==| ||.| ||.| |=|   Y',
        '      |    |    |    |    |    |    |    |    |    |    |  ',
        'XP:   1   ~7   ~14  ~21  ~30  ~50  ~60  ~90 ~100 ~180 365+',
        '      |    |    |    |    |    |    |    |    |    |    |  ',
        'STAGE:.    .    .    o    o    O    O    @    @    @    @@ ',
        '     Boot Init Init Intg Intg Comp Comp Optm Optm Optm Trns',
    ]
    story += code_block(timeline_lines)
    story += [sp(2), Paragraph('Key: . Boot  o/O Integrated/Compiled  @ Optimized  @@ Transparent', ST['body_small']), sp(4)]

    # ── XI. Oceanic Mayan ─────────────────────────────────────────────────────
    story += [
        Paragraph('XI.  THE OCEANIC MAYAN BADGE LANGUAGE (DESIGN OPTION E)', ST['section']),
        rule(),
        Paragraph(
            'The most fully realized badge visual language for LOT. '
            'Mayan cycles meet water aesthetics — ancient, fluid, timeless.',
            ST['body']),
        sp(3),
    ]

    mayan_data = [
        ['Symbol', 'Meaning', 'Type', 'Condition', 'Unlock Message'],
        ['o~',   'Circle + Wave',       'Milestone',  'Day 7',       '"Wave patterns emerge. o~"'],
        ['o~o',  'Circle-Wave-Circle',  'Milestone',  'Day 30',      '"Tides complete their cycle. o~o"'],
        ['=o=',  'DeepWave + Circle',   'Milestone',  'Day 100',     '"Ocean depth achieved. =o="'],
        ['~-~',  'Wave-Bar-Wave',       'Behavioral', 'Balanced',    '"Tides balance. ~-~"'],
        ['~o~',  'Waves-Circle-Waves',  'Behavioral', 'Flow',        '"Flowing with the ocean. ~o~"'],
        ['-o-',  'Bar-Circle-Bar',      'Behavioral', 'Consistent',  '"Steady current. -o-"'],
        ['o(o',  'Moon Phases',         'Behavioral', 'Reflective',  '"Depth in reflection. o(o"'],
        ['o..o', 'Circle-Dots-Circle',  'Behavioral', 'Explorer',    '"Scattered drops return. o..o"'],
    ]

    mayan_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('TEXTCOLOR',   (2,1), (2,3),  HexColor('#225588')),  # Milestone
        ('TEXTCOLOR',   (2,4), (2,-1), HexColor('#664488')),  # Behavioral
        ('FONTNAME',    (2,1), (2,-1), 'Courier-Bold'),
    ])

    mayan_col_w = [14*mm, 42*mm, 26*mm, 26*mm, INNER_W - 108*mm]
    story += [
        Table(mayan_data, colWidths=mayan_col_w, style=mayan_style),
        sp(4),
    ]

    # Full profile example
    story += [
        Paragraph('<b>Full Profile Example (Day 127 — Oceanic Mayan)</b>', ST['subsection']),
        sp(2),
    ]

    profile_ex = [
        '======================================================',
        '',
        '                   ALEX\'S PROFILE',
        '',
        '------------------------------------------------------',
        '',
        'Archetype:         The Explorer',
        'Awareness Level:   Deepening (8.4/10)',
        'Level:             =o=',
        '',
        '------------------------------------------------------',
        '',
        'Core values:',
        '    mindful =o= present ~-~ aware ~o~ grounded -o-',
        '    authentic o(o compassionate o..o',
        '',
        'Emotional patterns:',
        '    calm =o= reflective ~-~ intentional ~o~ open -o-',
        '',
        '======================================================',
    ]
    story += code_block(profile_ex)
    story += [sp(4)]

    # ── XII. Badge Unlock Notification ───────────────────────────────────────
    story += [
        Paragraph('XII.  BADGE UNLOCK NOTIFICATION DISPLAY', ST['section']),
        rule(),
        Paragraph(
            'When a badge is unlocked, the Memory Widget displays a timed notification '
            'before the next memory question appears.',
            ST['body']),
        sp(3),
    ]

    notif_lines = [
        '+--------------------------------------------------+',
        '|                                                  |',
        '|  Memory:                                         |',
        '|                                                  |',
        '|  +-----------------------------------------+    |',
        '|  |                                         |    |',
        '|  |   -> Deep currents established  =       |    |',
        '|  |                                         |    |',
        '|  +-----------------------------------------+    |',
        '|                                                  |',
        '|                          [5 second fade-out]    |',
        '+--------------------------------------------------+',
    ]
    story += code_block(notif_lines)
    story += [sp(4)]

    # ── XIII. Rarity Table ────────────────────────────────────────────────────
    story += [
        Paragraph('XIII.  COMPLETE RARITY TABLE', ST['section']),
        rule(),
        sp(2),
    ]

    rarity_data = [
        ['Rarity', 'ASCII', 'Hex Color', 'Frequency', 'Examples'],
        ['Common',    '.',    '#888888', 'First acts',    'First Breath, Mirror Gazer'],
        ['Uncommon',  'o',    '#559955', 'Days 1-14',     'Week Warrior, Community Voice'],
        ['Rare',      '(',    '#4455cc', 'Days 30+',      'Moon Cycle, Deep Diver'],
        ['Epic',      '<>',   '#884499', 'Days 100+',     'Unwavering, Self Scholar'],
        ['Legendary', '*',    '#cc9922', 'Days 365+',     'Long Count, Soul Cartographer'],
        ['Mythic',    '@',    '#cc4422', 'Hidden only',   'Meta-Signal'],
    ]

    rar_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',(0,0),(-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ])

    # Apply rarity colors to first column
    for i, rarity in enumerate(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'], start=1):
        rar_style.add('TEXTCOLOR', (0,i), (0,i), RARITY_COLORS[rarity])
        rar_style.add('FONTNAME',  (0,i), (0,i), 'Courier-Bold')

    rar_col_w = [22*mm, 16*mm, 24*mm, 24*mm, INNER_W - 86*mm]
    story += [
        Table(rarity_data, colWidths=rar_col_w, style=rar_style),
        sp(4),
        PageBreak(),
    ]

    # ── XIV. Implementation Status ────────────────────────────────────────────
    story += [
        Paragraph('XIV.  IMPLEMENTATION STATUS', ST['section']),
        rule(),
        sp(2),
    ]

    live_items = [
        ('[V] badges.ts',           'Core badge types, award logic, localStorage persistence'),
        ('[V] BadgeUnlockFeed',     'Community unlock activity feed (recent unlocks)'),
        ('[V] GrowthMilestones',    'Personal + community growth display widget'),
        ('[V] EvolutionWidget',     'CQGS stage + achievements counter + activity view'),
        ('[V] MemoryWidget',        'Badge unlock notification on question display'),
        ('[V] rpg-narrative.ts',    'Full achievement registry (13 achievements) + story arcs'),
        ('[V] PublicProfile',       'Level field display (Water or Architecture theme)'),
    ]

    roadmap_items = [
        ('[o] Extended milestones',  'Day 14, 21, 50, 60, 90, 180, 365 milestones'),
        ('[o] Pattern badges',       'Balanced, Flow, Consistent, Reflective, Explorer'),
        ('[o] Easter egg engine',    'Word turn detection, time-based triggers'),
        ('[o] Oceanic Mayan style',  'Full Option E visual language implementation'),
        ('[o] Quest tracker UI',     'Active quest display component'),
        ('[o] Badge gallery view',   'Collection viewer with progress'),
        ('[o] Secret badge system',  'Hidden badge discovery via keyword detection'),
    ]

    impl_data = [['Status', 'Component', 'Notes']]
    for sym, comp in live_items:
        impl_data.append([sym, comp.split('           ')[0].strip(), comp])
    for sym, comp in roadmap_items:
        impl_data.append([sym, comp.split('         ')[0].strip(), comp])

    impl_data2 = [['Status', 'Component', 'Description']]
    for sym, comp, desc in [(s, c.strip(), d) for s, c in live_items for d in [c]] + \
                            [(s, c.strip(), d) for s, c in roadmap_items for d in [c]]:
        pass

    # Simpler: two separate tables
    live_tbl = [['Status', 'Component', 'Description']]
    for sym, desc in live_items:
        comp = sym.replace('[V] ', '').replace('[o] ', '').strip()
        live_tbl.append([sym[:3], comp, desc])

    road_tbl = [['Status', 'Component', 'Description']]
    for sym, desc in roadmap_items:
        comp = sym.replace('[V] ', '').replace('[o] ', '').strip()
        road_tbl.append([sym[:3], comp, desc])

    impl_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ])

    road_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('TEXTCOLOR',   (0,1), (0,-1),  HexColor('#999966')),
        ('FONTNAME',    (0,1), (0,-1),  'Courier-Bold'),
    ])

    impl_col_w = [16*mm, 44*mm, INNER_W - 60*mm]

    story += [
        Paragraph('<b>Currently Live</b>', ST['subsection']),
        Table(live_tbl, colWidths=impl_col_w, style=impl_style),
        sp(4),
        Paragraph('<b>In Design / Roadmap</b>', ST['subsection']),
        Table(road_tbl, colWidths=impl_col_w, style=road_style),
        sp(4),
    ]

    # ── XV. Unicode Reference ─────────────────────────────────────────────────
    story += [
        Paragraph('XV.  UNICODE REFERENCE', ST['section']),
        rule(),
        Paragraph('All LOT badge symbols use standard Unicode with 100% browser support.', ST['body']),
        sp(3),
    ]

    unicode_data = [
        ['Symbol', 'Unicode', 'Name', 'Use in LOT'],
        ['∘', 'U+2218', 'Ring Operator',          'Water Day 7 milestone'],
        ['≈', 'U+2248', 'Almost Equal To',         'Water Day 30 milestone'],
        ['≋', 'U+224B', 'Triple Tilde',             'Water Day 100 milestone'],
        ['○', 'U+25CB', 'White Circle',             'Oceanic center symbol'],
        ['∿', 'U+223F', 'Sine Wave',               'Oceanic wave symbol'],
        ['◐', 'U+25D0', 'Circle Left Half Black',  'Moon phase / Reflective badge'],
        ['∴', 'U+2234', 'Therefore',               'Dots pattern / Explorer badge'],
        ['✦', 'U+2726', 'Black Four Pointed Star', 'Epic / Legendary tier badges'],
        ['◉', 'U+25C9', 'Fisheye',                 'Mythic / Meta-Signal / CQGS Transparent'],
        ['·', 'U+00B7', 'Middle Dot',              'Default separator between traits'],
        ['→', 'U+2192', 'Rightwards Arrow',        'Progression indicator'],
        ['↳', 'U+21B3', 'Downwards Arrow Right',  'Sub-item / unlock notification indicator'],
        ['║', 'U+2551', 'Box Drawings Double Vert','Architecture badge symbol'],
        ['╞', 'U+255E', 'Box Drawings Double Up',  'Architecture Day 30 symbol'],
    ]

    uni_style = TableStyle([
        ('FONTNAME',    (0,0), (-1,0),  'Courier-Bold'),
        ('FONTNAME',    (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE',    (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR',   (0,0), (-1,0),  WHITE),
        ('BACKGROUND',  (0,0), (-1,0),  GREY_DARK),
        ('ROWBACKGROUNDS', (0,1),(-1,-1), [WHITE, GREY_BG]),
        ('GRID',        (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',  (0,0), (-1,-1), 4),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('ALIGN',       (0,0), (0,-1),  'CENTER'),
        ('ALIGN',       (1,0), (1,-1),  'CENTER'),
    ])

    uni_col_w = [14*mm, 24*mm, 54*mm, INNER_W - 92*mm]
    story += [
        Table(unicode_data, colWidths=uni_col_w, style=uni_style),
        sp(8),
    ]

    # ── Final Page ────────────────────────────────────────────────────────────
    story += [
        rule(1.0, BLACK),
        sp(4),
    ]

    story += ascii_box([
        '',
        'LOT Systems  --  Self-care through proactive context-aware AI',
        'The Memory Engine remembers. The Arcade rewards. The story continues.',
        '',
        '  o -> ~ -> =        (Water Path)',
        '  |-- -> |==| -> ||.||   (Architecture Path)',
        '',
        '               [ PRESS START ]',
        '',
    ])

    story += [
        sp(4),
        Paragraph('LOT Systems  &mdash;  Badges &amp; Achievements System  &mdash;  v1.0', ST['footer']),
        Paragraph('&copy; 2025&ndash;2026 LOT Systems. All rights reserved.', ST['footer']),
    ]

    # ── Build ─────────────────────────────────────────────────────────────────
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f'PDF generated: {OUTPUT_PATH}')


if __name__ == '__main__':
    build_pdf()
