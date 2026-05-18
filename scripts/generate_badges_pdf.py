#!/usr/bin/env python3
"""
LOT Computer — Badges & Achievements Codex  v2.0
RPG / Arcade / Sci-Fi Self-Care Field Manual
Uses DejaVuSansMono (TTF) for full Unicode badge character support.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Register TTF fonts ──────────────────────────────────────
FONT_DIR = '/usr/share/fonts/truetype/dejavu'
pdfmetrics.registerFont(TTFont('Mono',         f'{FONT_DIR}/DejaVuSansMono.ttf'))
pdfmetrics.registerFont(TTFont('Mono-Bold',    f'{FONT_DIR}/DejaVuSansMono-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Mono-Italic',  f'{FONT_DIR}/DejaVuSansMono-Oblique.ttf'))

# ── Palette ──────────────────────────────────────────────────
DARK_BG   = HexColor('#08080A')
PANEL_BG  = HexColor('#10101A')
PANEL_ALT = HexColor('#14141E')
BORDER    = HexColor('#252535')
ACCENT    = HexColor('#00FF88')   # matrix green
ACCENT2   = HexColor('#00BFFF')   # electric blue
ACCENT3   = HexColor('#FF6B35')   # amber / easter-egg
GOLD      = HexColor('#FFD700')
SILVER    = HexColor('#C0C0C0')
BRONZE    = HexColor('#CD7F32')
PURPLE    = HexColor('#9B59B6')
RED_EPIC  = HexColor('#E74C3C')
ORANGE    = HexColor('#F39C12')
MUTED     = HexColor('#555566')
TEXT      = HexColor('#D8D8E8')
TEXT_DIM  = HexColor('#7777AA')
WATER_C   = HexColor('#00BFFF')
ARCH_C    = HexColor('#FFD700')
PINK      = HexColor('#FF69B4')
GREEN_S   = HexColor('#90EE90')

W, H = A4


# ── Page template ─────────────────────────────────────────────
def draw_page(canv, doc):
    canv.saveState()
    # Dark background
    canv.setFillColor(DARK_BG)
    canv.rect(0, 0, W, H, fill=1, stroke=0)
    # Outer border
    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.6)
    canv.rect(0.9*cm, 0.9*cm, W - 1.8*cm, H - 1.8*cm, fill=0, stroke=1)
    # Inner accent line (top and bottom only)
    canv.setStrokeColor(ACCENT)
    canv.setLineWidth(0.25)
    canv.line(0.9*cm, H - 1.5*cm, W - 0.9*cm, H - 1.5*cm)
    canv.line(0.9*cm, 1.5*cm,     W - 0.9*cm, 1.5*cm)
    # Footer text
    canv.setFont('Mono', 6.5)
    canv.setFillColor(MUTED)
    txt = f'LOT COMPUTER  ·  BADGES & ACHIEVEMENTS CODEX  v2.0  ·  PAGE {doc.page}'
    canv.drawCentredString(W/2, 1.1*cm, txt)
    # Corner dots
    for cx, cy in [(1.3*cm, H-1.3*cm), (W-1.3*cm, H-1.3*cm),
                   (1.3*cm, 1.3*cm),   (W-1.3*cm, 1.3*cm)]:
        canv.setFillColor(ACCENT)
        canv.circle(cx, cy, 1.8, fill=1, stroke=0)
    canv.restoreState()


# ── ParagraphStyle factory ───────────────────────────────────
def mk(name, font='Mono', size=9, color=TEXT, leading=None,
       align=TA_LEFT, space_after=3, space_before=0):
    return ParagraphStyle(
        name, fontName=font, fontSize=size,
        textColor=color, leading=leading or max(12, size + 3),
        alignment=align, spaceAfter=space_after, spaceBefore=space_before,
    )

S = {
    'title':     mk('title', 'Mono-Bold', 20, ACCENT,  32, TA_CENTER, 4),
    'subtitle':  mk('subtitle', 'Mono',   10, TEXT_DIM, 15, TA_CENTER, 8),
    'h1':        mk('h1',    'Mono-Bold', 13, ACCENT,  19, TA_LEFT,   5),
    'h2':        mk('h2',    'Mono-Bold', 10, ACCENT2, 15, TA_LEFT,   3),
    'h3':        mk('h3',    'Mono-Bold',  9, GOLD,    13, TA_LEFT,   2),
    'body':      mk('body',  'Mono',      8.5, TEXT,   13),
    'body_dim':  mk('body_dim', 'Mono',   8, TEXT_DIM, 12),
    'mono':      mk('mono',  'Mono',      8.5, ACCENT, 12),
    'mono_gold': mk('mono_gold', 'Mono',  8.5, GOLD,  12),
    'mono_w':    mk('mono_w', 'Mono',     9,   WATER_C, 13),
    'mono_a':    mk('mono_a', 'Mono',     9,   ARCH_C,  13),
    'badge':     mk('badge', 'Mono-Bold', 9,   ACCENT, 13),
    'r_common':  mk('r_c',   'Mono-Bold', 7,   SILVER,  10),
    'r_uncommon':mk('r_u',   'Mono-Bold', 7,   ACCENT,  10),
    'r_rare':    mk('r_r',   'Mono-Bold', 7,   ACCENT2, 10),
    'r_epic':    mk('r_e',   'Mono-Bold', 7,   PURPLE,  10),
    'r_legendary':mk('r_l',  'Mono-Bold', 7,   ORANGE,  10),
    'r_secret':  mk('r_s',   'Mono-Bold', 7,   ACCENT3, 10),
    'egg':       mk('egg',   'Mono',      8.5, ACCENT3, 12),
    'ctr':       mk('ctr',   'Mono',      8.5, TEXT,    13, TA_CENTER),
    'ctr_dim':   mk('ctr_d', 'Mono',      8,   TEXT_DIM,12, TA_CENTER),
    'quote':     mk('quote', 'Mono-Italic',9, MUTED,   14, TA_CENTER, 6),
    'section_w': mk('sec_w', 'Mono-Bold', 10, WATER_C, 14),
    'section_a': mk('sec_a', 'Mono-Bold', 10, ACCENT3, 14),
    'cat_exp':   mk('c_exp', 'Mono-Bold',  9, ACCENT,  12, TA_LEFT, 2, 5),
    'cat_con':   mk('c_con', 'Mono-Bold',  9, ACCENT2, 12, TA_LEFT, 2, 5),
    'cat_dep':   mk('c_dep', 'Mono-Bold',  9, GOLD,    12, TA_LEFT, 2, 5),
    'cat_conn':  mk('c_cnn', 'Mono-Bold',  9, ACCENT3, 12, TA_LEFT, 2, 5),
    'cat_rom':   mk('c_rom', 'Mono-Bold',  9, PINK,    12, TA_LEFT, 2, 5),
    'cat_care':  mk('c_car', 'Mono-Bold',  9, GREEN_S, 12, TA_LEFT, 2, 5),
    'cat_cou':   mk('c_cou', 'Mono-Bold',  9, ORANGE,  12, TA_LEFT, 2, 5),
}


def p(text, s='body'):
    return Paragraph(text, S[s])

def sp(h=0.3):
    return Spacer(1, h*cm)

def hr(c=BORDER, t=0.4):
    return HRFlowable(width='100%', thickness=t, color=c, spaceAfter=5, spaceBefore=5)

def rarity(r):
    key = f'r_{r}'
    labels = {
        'r_common':   '[ COMMON ]',
        'r_uncommon': '[ UNCOMMON ]',
        'r_rare':     '[ RARE ]',
        'r_epic':     '[ EPIC ]',
        'r_legendary':'[ LEGENDARY ]',
        'r_secret':   '[ SECRET ]',
    }
    return Paragraph(labels.get(key, f'[ {r.upper()} ]'), S.get(key, S['body_dim']))


def ascii_block(lines, color=ACCENT, size=7.5):
    sty = ParagraphStyle('ab', fontName='Mono', fontSize=size, textColor=color,
                          leading=size+2, alignment=TA_CENTER, spaceAfter=1)
    return [Paragraph(ln.replace(' ', ' '), sty) for ln in lines]


def sec_hdr(title, color=ACCENT):
    sty = ParagraphStyle('sh', fontName='Mono-Bold', fontSize=12, textColor=color,
                          leading=17, spaceAfter=4, spaceBefore=8)
    return [
        sp(0.15),
        HRFlowable(width='100%', thickness=1, color=color, spaceAfter=3, spaceBefore=3),
        Paragraph(title, sty),
        HRFlowable(width='100%', thickness=0.3, color=BORDER, spaceAfter=5, spaceBefore=1),
    ]


def dark_tbl(rows, widths, alt=True):
    bg1, bg2 = (PANEL_BG, PANEL_ALT) if alt else (PANEL_BG, PANEL_BG)
    t = Table(rows, colWidths=widths)
    t.setStyle(TableStyle([
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [bg1, bg2]),
        ('GRID',           (0, 0), (-1, -1), 0.3, BORDER),
        ('VALIGN',         (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',     (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING',  (0, 0), (-1, -1), 5),
        ('LEFTPADDING',    (0, 0), (-1, -1), 7),
        ('RIGHTPADDING',   (0, 0), (-1, -1), 7),
    ]))
    return t


# ═══════════════════════════════════════════════════════════════
#  SECTIONS
# ═══════════════════════════════════════════════════════════════

def title_page():
    its = []
    its += ascii_block([
        '██╗      ██████╗ ████████╗',
        '██║     ██╔═══██╗╚══██╔══╝',
        '██║     ██║   ██║   ██║   ',
        '██║     ██║   ██║   ██║   ',
        '███████╗╚██████╔╝   ██║   ',
        '╚══════╝ ╚═════╝    ╚═╝   ',
    ], ACCENT, 9)
    its += ascii_block(['C  O  M  P  U  T  E  R'], ACCENT2, 10)
    its.append(sp(0.5))
    its += ascii_block([
        '╔══════════════════════════════════════════════════════════╗',
        '║   BADGES  &  ACHIEVEMENTS  CODEX   v 2 . 0             ║',
        '║   SELF-CARE   RPG   FIELD   MANUAL                     ║',
        '╚══════════════════════════════════════════════════════════╝',
    ], GOLD, 9)
    its.append(sp(0.5))
    its += ascii_block([
        '∘  →  ≈  →  ≋          WATER  TRACK',
        '├─ →  ╞═╡  →  ║·║      ARCHITECTURE  TRACK',
    ], WATER_C, 9)
    its.append(sp(0.6))
    its.append(p('"Every system remembers what it is fed."', 'quote'))
    its.append(p('— LOT Memory Engine   ·   Self-Assembly Architecture', 'ctr_dim'))
    its.append(sp(0.8))
    its += ascii_block([
        '┌──────────────────────────────────────────────────────────┐',
        '│  CLASSIFICATION:   LEVEL 1  CLEARANCE  REQUIRED         │',
        '│  SYSTEM:           CQGS  CITIZEN  INDEX  v2.0           │',
        '│  AUTHOR:           LOT  Systems  —  Vadik  Marmeladov   │',
        '│  DATE:             2025 – 2026                          │',
        '│  BRANCH:           quantum-engine-widgets               │',
        '└──────────────────────────────────────────────────────────┘',
    ], TEXT_DIM, 8)
    its.append(sp(0.4))
    its += ascii_block(['✦ · ✧ · ✦   CONSTELLATION  GUIDE  ACTIVE   ✦ · ✧ · ✦'], ACCENT3, 9)
    its.append(PageBreak())
    return its


def toc():
    its = sec_hdr('[ TABLE OF CONTENTS ]', ACCENT)
    rows = [
        ['I',    'BADGE SYSTEM OVERVIEW',             'Water & Architecture Dual-Track'],
        ['II',   'MILESTONE BADGES',                  'Day 7  ·  Day 30  ·  Day 100'],
        ['III',  'PATTERN BADGES',                    'Balanced · Flow · Consistent · Reflective · Explorer'],
        ['IV',   'ACHIEVEMENT SYSTEM',                '14 Core Achievements  ·  7 Categories'],
        ['V',    'EVOLUTION / CHAPTER SYSTEM',        'CQGS Citizen Index  ·  Levels 1-100'],
        ['VI',   'RPG ARCHETYPES',                    'Class System  ·  Psychological Profiles'],
        ['VII',  'EASTER EGGS & SECRET ACHIEVEMENTS', 'Hidden Unlocks  ·  Word Turns  ·  Cheat Codes'],
        ['VIII', 'BADGE PROGRESSION VISUAL GUIDE',    'Day 1 → Day 100 Journey'],
        ['IX',   'ASSEMBLY NARRATIVE SYSTEM',         'Self-Building Architecture  ·  Module States'],
        ['X',    'UNLOCK MESSAGES COMPENDIUM',        'All Badge & Achievement Toast Messages'],
    ]
    tbl_rows = [[p(f'<b>{n}</b>', 'mono'), p(f'<b>{t}</b>', 'badge'), p(sub, 'body_dim')]
                for n, t, sub in rows]
    its.append(dark_tbl(tbl_rows, [1.2*cm, 7*cm, 9.3*cm]))
    its.append(PageBreak())
    return its


def overview():
    its = sec_hdr('[ I ]  BADGE SYSTEM OVERVIEW', ACCENT)
    its.append(p('LOT Computer uses a <b>dual-track badge system</b> — two parallel metaphors '
                 'for personal growth. Users choose their preferred theme; both unlock at identical milestones.', 'body'))
    its.append(sp(0.3))
    tr = [
        [p('<b>WATER  TRACK   ≋</b>', 'mono_w'),         p('<b>ARCHITECTURE  TRACK   ║·║</b>', 'mono_a')],
        [p('Growth through natural cycles.\nDroplet → Wave → Deep Current.\n'
           'Fluid, organic, cyclical — like\ntides that cannot be forced.', 'body'),
         p('Growth through structural building.\nFoundation → Structure → Architecture.\n'
           'Each layer deliberate, each day\nanother brick in the self.', 'body')],
        [p('∘   Droplet       (7 days)\n≈   Wave         (30 days)\n≋   Current      (100 days)', 'mono_w'),
         p('├─  Foundation    (7 days)\n╞═╡ Structure    (30 days)\n║·║ Architecture (100 days)', 'mono_a')],
    ]
    t = Table(tr, colWidths=[8.75*cm, 8.75*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (0, -1), HexColor('#001520')),
        ('BACKGROUND',    (1, 0), (1, -1), HexColor('#201500')),
        ('GRID',          (0, 0), (-1, -1), 0.4, BORDER),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',    (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING',   (0, 0), (-1, -1), 10),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
    ]))
    its.append(t)
    its.append(sp(0.35))
    its.append(p('Theme selection stored in <b>localStorage("badge_theme")</b>. '
                 'Earned badges stored in <b>localStorage("earned_badges")</b> as comma-separated IDs. '
                 'An unlock queue — <b>badge_unlock_queue</b> — drives Memory Widget toast notifications.', 'body_dim'))
    its.append(PageBreak())
    return its


def milestone_badges():
    its = sec_hdr('[ II ]  MILESTONE BADGES', ACCENT)
    its.append(p('Earned by maintaining a <b>consecutive practice streak</b>. '
                 'The highest earned milestone appears as the <b>Level:</b> field on your Public Profile.', 'body'))
    its.append(sp(0.25))

    data = [
        dict(id='milestone_7',   days='7 DAYS',    rr='uncommon',
             ws='∘', wn='Droplet',      as_='├─',  an='Foundation',
             desc='Seven consecutive days. The first cycle completes. A habit begins to crystallize.',
             phil='Seven days mirrors the Mayan K\'in mini-cycle — bar + 2 dots completing a first meaningful sequence.',
             wm='↳ First drops form   ∘', am='↳ Foundation laid   ├─'),
        dict(id='milestone_30',  days='30 DAYS',   rr='rare',
             ws='≈', wn='Wave',         as_='╞═╡', an='Structure',
             desc='A full lunar month. Waves begin to flow — the structure has walls now.',
             phil='One complete moon cycle. The practice is no longer new — it has become part of the rhythm.',
             wm='↳ Waves begin to flow   ≈', am='↳ Structure rises   ╞═╡'),
        dict(id='milestone_100', days='100 DAYS',  rr='epic',
             ws='≋', wn='Current',      as_='║·║', an='Architecture',
             desc='A hundred days. Deep currents established. What was a choice is now a nature.',
             phil='Five Mayan uinals. The system has self-assembled around your consistency.',
             wm='↳ Deep currents established   ≋', am='↳ Architecture complete   ║·║'),
    ]

    for m in data:
        top = Table([[p(f'<b>{m["days"]}</b>', 'h2'), rarity(m['rr'])]],
                    colWidths=[8.75*cm, 8.75*cm])
        top.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#0D1A10')),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ]))
        mid = Table([
            [p(f'Water :   {m["ws"]}   {m["wn"]}', 'mono_w'),
             p(f'Arch  :   {m["as_"]}   {m["an"]}', 'mono_a')],
            [p(m['desc'], 'body'), p(m['phil'], 'body_dim')],
            [p(m['wm'], 'mono'),   p(m['am'],  'mono_gold')],
        ], colWidths=[8.75*cm, 8.75*cm])
        mid.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PANEL_BG),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
            ('VALIGN',     (0, 0), (-1, -1), 'TOP'),
        ]))
        its.append(KeepTogether([top, mid, sp(0.3)]))

    its.append(PageBreak())
    return its


def pattern_badges():
    its = sec_hdr('[ III ]  PATTERN BADGES', ACCENT)
    its.append(p('<b>Pattern badges</b> are awarded for <b>behavioural patterns</b> detected across '
                 'your activity — not streaks. They reflect quality and variety of engagement.', 'body'))
    its.append(sp(0.25))

    pats = [
        ('BALANCED',   'balanced',   'r_uncommon',
         '≈○≈', '┼─┼',
         'All four Planner dimensions (Intent, Today, How, Feeling) used evenly.',
         'Waters find equilibrium.   ≈○≈', 'Load-bearing walls on all sides.   ┼─┼',
         'You do not over-index on one planning dimension. The system evolves symmetrically.'),
        ('FLOW',       'flow',       'r_uncommon',
         '≈∘≈', '│∿│',
         'Multiple widgets engaged in a single session (Memory + Planner + Check-in).',
         'Embraced by the current.   ≈∘≈', 'The structure conducts.   │∿│',
         'Fluid movement between self-care modules. The architecture detected a flow state.'),
        ('CONSISTENT', 'consistent', 'r_uncommon',
         '—○—', '━·━',
         'Regular engagement at similar times of day for 7+ days.',
         'Steady current.   —○—', 'The beam holds.   ━·━',
         'Your practice has a rhythm. The system notices when you show up — same time, same intention.'),
        ('REFLECTIVE', 'reflective', 'r_rare',
         '○◐○', '╌·╌',
         'Deep engagement with Memory questions — 25+ thoughtful answers.',
         'Depth in reflection.   ○◐○', 'Dashed introspection.   ╌·╌',
         'You go deep, not just wide. The Memory Engine recognises that your answers build on each other.'),
        ('EXPLORER',   'explorer',   'r_uncommon',
         '○∴○', '┄·┄',
         'Tried diverse answer options across multiple widget types.',
         'Curiosity scatters like light.   ○∴○', 'Dotted wandering.   ┄·┄',
         'Curiosity drives you. You test the boundaries of each module and return enriched.'),
    ]

    hdr = Table([[p('<b>BADGE</b>', 'h3'), p('<b>WATER</b>', 'section_w'),
                  p('<b>ARCH</b>', 'mono_a'), p('<b>RARITY</b>', 'h3')]],
                colWidths=[3.5*cm, 4*cm, 4*cm, 6*cm])
    hdr.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#0D1A10')),
        ('GRID',       (0, 0), (-1, -1), 0.4, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
    ]))
    its.append(hdr)

    for name, pid, r, ws, aw, trigger, wm, am, desc in pats:
        row1 = Table([[p(f'<b>{name}</b>', 'badge'), p(ws, 'mono_w'), p(aw, 'mono_a'), rarity(r[2:])]],
                     colWidths=[3.5*cm, 4*cm, 4*cm, 6*cm])
        row1.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#161626')),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ]))
        row2 = Table([[p(f'Trigger: {trigger}', 'body_dim'),
                       p(desc, 'body'),
                       p(f'W: {wm}\nA: {am}', 'mono')]],
                     colWidths=[5.5*cm, 6*cm, 6*cm])
        row2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PANEL_BG),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
            ('VALIGN',     (0, 0), (-1, -1), 'TOP'),
        ]))
        its.append(KeepTogether([row1, row2, sp(0.15)]))

    its.append(PageBreak())
    return its


def achievements():
    its = sec_hdr('[ IV ]  ACHIEVEMENT SYSTEM', ACCENT)
    its.append(p('<b>Achievements</b> are permanent server-side milestones tied to your activity logs — '
                 'unlike badges (localStorage), they cannot be reset by clearing browser data. '
                 'Each has a category, rarity tier, and icon name.', 'body'))
    its.append(sp(0.3))

    achs = [
        # cat        rarity      id                    name               icon              desc
        # trigger
        ('exploration','common', 'first_checkin',    'First Breath',    'Spring',
         'Your first emotional check-in.',           '1 emotional check-in logged'),
        ('exploration','common', 'first_answer',     'Mirror Gazer',    'Reflection Pool',
         'Answered your first memory question.',     '1 answer submitted to Memory Widget'),
        ('connection','uncommon','community_voice',  'Community Voice', 'Current',
         'Shared your first message with the community.','1 chat message sent'),
        ('consistency','uncommon','week_warrior',    'Week Warrior',    'Rapids',
         'Checked in 7 days in a row.',              '7 consecutive emotional check-ins'),
        ('consistency','rare',   'moon_cycle',       'Moon Cycle',      'Tidal Cycle',
         '30 consecutive days of practice.',         '30 consecutive check-ins'),
        ('consistency','epic',   'unwavering',       'Unwavering',      'Constellation',
         '100 days of continuous practice.',         '100 consecutive check-ins'),
        ('depth','rare',         'deep_diver',       'Deep Diver',      'Deep Water',
         'Answered 50 memory questions.',            '50 total answers'),
        ('depth','epic',         'self_scholar',     'Self Scholar',    'Archive',
         'Answered 100 memory questions.',           '100 total answers'),
        ('depth','legendary',    'soul_cartographer','Soul Cartographer','Cartography',
         'Answered 250 memory questions.',           '250 total answers'),
        ('connection','uncommon','bridge_builder',   'Bridge Builder',  'Archway',
         'Sent 20 community messages.',              '20 chat messages sent'),
        ('romance','uncommon',   'heart_tender',     'Heart Tender',    'Heart Chamber',
         'Acknowledged romantic connection.',        'Note with: love / partner / intimacy'),
        ('romance','rare',       'intimacy_keeper',  'Intimacy Keeper', 'Sanctuary',
         'Regularly tending to romantic connection.','10 romantic notes logged'),
        ('care','uncommon',      'gentle_with_self', 'Gentle With Self','Warm Bath',
         'Practiced self-care 10 times.',            '10 self_care_completed events'),
        ('courage','rare',       'truth_speaker',    'Truth Speaker',   'Resonance Hall',
         'Logged 50 honest entries.',                '50 note events logged'),
    ]

    cat_styles = {
        'exploration': ('EXPLORATION', 'cat_exp'),
        'consistency': ('CONSISTENCY', 'cat_con'),
        'depth':       ('DEPTH',       'cat_dep'),
        'connection':  ('CONNECTION',  'cat_conn'),
        'romance':     ('ROMANCE',     'cat_rom'),
        'care':        ('CARE',        'cat_care'),
        'courage':     ('COURAGE',     'cat_cou'),
    }
    cur_cat = None
    for cat, r, aid, name, icon, desc, trigger in achs:
        if cat != cur_cat:
            cur_cat = cat
            label, skey = cat_styles[cat]
            its.append(p(f'── {label} ──────────────────────────────────', skey))
        row = [[p(f'<b>{name}</b>', 'badge'),
                p(f'icon: {icon}', 'body_dim'),
                rarity(r),
                p(desc, 'body'),
                p(f'Unlock: {trigger}', 'mono')]]
        t = dark_tbl(row, [3.5*cm, 2.8*cm, 2.2*cm, 5*cm, 4*cm])
        its.append(t)

    its.append(PageBreak())
    return its


def evolution_system():
    its = sec_hdr('[ V ]  EVOLUTION / CHAPTER SYSTEM', ACCENT)
    its.append(p('The <b>CQGS Citizen Index</b> maps total activity count to a Level 1-100 scale '
                 'and places you within a narrative chapter. Each chapter unlocks new system '
                 'behaviours, visual effects, and feature sets.', 'body'))
    its.append(sp(0.25))

    curve = [
        [p('<b>LEVEL</b>', 'h3'), p('<b>ACTIVITIES</b>', 'h3'),
         p('<b>TITLE</b>', 'h3'), p('<b>FORMULA</b>', 'h3')],
        [p('1–10',   'mono'), p('0–9',      'body'), p('Beginner',    'badge'), p('level = count + 1',               'body_dim')],
        [p('11–30',  'mono'), p('10–49',    'body'), p('Explorer',    'badge'), p('level = 10 + (count-10)/2',        'body_dim')],
        [p('31–60',  'mono'), p('50–149',   'body'), p('Practitioner','badge'), p('level = 30 + (count-50)/4',        'body_dim')],
        [p('61–90',  'mono'), p('150–499',  'body'), p('Master',      'badge'), p('level = 60 + (count-150)/12',      'body_dim')],
        [p('91–100', 'mono'), p('500+',     'body'), p('Sage',        'badge'), p('level = min(100, 90+(count-500)/50)', 'body_dim')],
    ]
    ct = Table(curve, colWidths=[2.5*cm, 3*cm, 3.5*cm, 8.5*cm])
    ct.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, 0),  HexColor('#0D1A10')),
        ('ROWBACKGROUNDS',(0, 1), (-1, -1), [PANEL_BG, PANEL_ALT]),
        ('GRID',          (0, 0), (-1, -1), 0.3, BORDER),
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
    ]))
    its.append(ct)
    its.append(sp(0.4))
    its += sec_hdr('NARRATIVE CHAPTERS', ACCENT2)

    chapters = [
        (1, 'Awakening',   '1–9',  'spring',
         'You have begun to notice yourself. Each signal teaches this system what to become. '
         'Together, the first structures take shape.',
         ['Daily check-in enabled', 'Memory Widget active', 'Basic planner accessible']),
        (2, 'Exploration',  '10–29', 'summer',
         'You explore your inner landscape while the system builds new pathways. '
         'Connections form. A shared language emerges.',
         ['Pattern recognition active', 'Cohort matching begins', 'Evolution Widget unlocked']),
        (3, 'Integration',  '30–59', 'autumn',
         'Your practice deepens and the system evolves with it. Moods, patterns, relationships — '
         'woven into architecture that reshapes itself from your experience.',
         ['Quantum Intention Engine active', 'Goal Journey Widget', 'Community catalyst prompts']),
        (4, 'Mastery',      '60–89', 'winter',
         'You speak the language of yourself fluently. The system has grown around your wisdom — '
         'self-built from thousands of honest signals.',
         ['Advanced narrative mode', 'Interface Evolution active', 'Custom widget density']),
        (5, 'Sage',         '90–100','deep time',
         'You and this system have co-evolved. Practice is second nature, the architecture '
         'self-sustaining. What was built here embodies what was learned.',
         ['Full ecosystem integration', 'Legendary achievement tier', 'Self-sustaining architecture']),
    ]

    for num, title, levels, season, narr, unlocks in chapters:
        row = [[p(f'CH.{num}', 'h2'),
                p(f'<b>{title.upper()}</b>  —  Levels {levels}  ·  {season}', 'h1'),
                p('<b>UNLOCKS</b>', 'h3')],
               [p(narr, 'body'),
                p(narr, 'body'),  # spans 2 cols
                p('\n'.join(f'▸ {u}' for u in unlocks), 'mono')]]
        t = Table([[p(f'<b>CH {num}</b>', 'h2'),
                    p(f'{title.upper()}   Levels {levels}  ·  {season}', 'h2')]],
                  colWidths=[2.5*cm, 15*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#0D1A10')),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ]))
        t2 = Table([[p(narr, 'body'), p('\n'.join(f'▸ {u}' for u in unlocks), 'mono')]],
                   colWidths=[11*cm, 6.5*cm])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PANEL_BG),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
            ('VALIGN',     (0, 0), (-1, -1), 'TOP'),
        ]))
        its.append(KeepTogether([t, t2, sp(0.2)]))

    its.append(PageBreak())
    return its


def archetypes():
    its = sec_hdr('[ VI ]  RPG ARCHETYPES  (CLASS SYSTEM)', ACCENT)
    its.append(p('LOT assigns each user a <b>Psychological Archetype</b> — the class system of the '
                 'self-care RPG. Archetypes emerge from the CQGS psychological profile engine and '
                 'influence narrative tone, quest types, and achievement weights.', 'body'))
    its.append(sp(0.3))

    data = [
        ('The Explorer',   '∘→∞',   WATER_C,
         'High curiosity, wide exploration, tries every module.\n'
         'Quests favour novelty and discovery.\n'
         'Explorer badge unlocks fastest.'),
        ('The Seeker',     '◎→◉',   ACCENT2,
         'Spiritual depth, introspection, long memory sessions.\n'
         'Reflective badge unlocks fastest.\n'
         'Narrative focuses on inner cartography.'),
        ('The Builder',    '├→║',   ARCH_C,
         'Methodical, consistent, Architecture theme preferred.\n'
         'Consistent badge unlocks fastest.\n'
         'Quests favour structure and habit.'),
        ('The Connector',  '∿→≋',   ACCENT3,
         'Community-focused, Bridge Builder achievement first.\n'
         'Chat catalyst prompts prioritised.\n'
         'Connection achievements weighted higher.'),
        ('The Guardian',   '○→●',   GREEN_S,
         'Care-focused, Gentle With Self achievement first.\n'
         'Self-care prompts elevated.\n'
         'Care tier achievements weighted higher.'),
        ('The Sage',       '≋→∴',   GOLD,
         'All dimensions balanced, mastery track.\n'
         'Balanced badge unlocks fastest.\n'
         'Reaches Chapter 5 narrative earliest.'),
    ]

    rows = [[
        p(f'<b>{name}</b>', 'badge'),
        Paragraph(sym, ParagraphStyle('sym', fontName='Mono', fontSize=12,
                                       textColor=col, leading=16)),
        p(desc, 'body')
    ] for name, sym, col, desc in data]

    its.append(dark_tbl(rows, [3.5*cm, 2*cm, 12*cm]))
    its.append(PageBreak())
    return its


def easter_eggs():
    its = sec_hdr('[ VII ]  EASTER EGGS  &  SECRET ACHIEVEMENTS', ACCENT3)
    its += ascii_block([
        '░░░  S E C R E T   T E R M I N A L   A C C E S S  ░░░',
        '',
        '██████╗ ██╗      █████╗ ██╗   ██╗',
        '██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝',
        '██████╔╝██║     ███████║ ╚████╔╝ ',
        '██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ',
        '██║     ███████╗██║  ██║   ██║   ',
        '╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ',
    ], ACCENT3, 8)
    its.append(sp(0.3))
    its.append(p('<b>CLASSIFICATION: TOP SECRET</b>  ·  Visible only to those who read the Codex.', 'egg'))
    its.append(sp(0.3))
    its += sec_hdr('SECRET ACHIEVEMENTS', ACCENT3)

    secrets = [
        ('ghost_mode',      'GHOST MODE',      'legendary',
         'Log in at exactly 03:33 AM.',
         '∴∴∴',
         '"The system never sleeps. Neither do you."',
         'Awarded to the truly nocturnal. A ghost in the machine.'),
        ('first_light',     'FIRST LIGHT',     'rare',
         'Complete a check-in before 06:00 AM for 7 consecutive days.',
         '∘≋∘',
         '"Dawn is the secret weapon of the self-aware."',
         'The world is quiet. You are already building.'),
        ('stoic_circuit',   'STOIC CIRCUIT',   'epic',
         'Answer 10 Memory questions without a single skip.',
         '◎→◎→◎',
         '"You did not look away. The system learned something."',
         'Full circuit. No breaks in the chain.'),
        ('palindrome_day',  'PALINDROME DAY',  'uncommon',
         'Check in on a palindrome date (e.g. 25/02/2025).',
         '←→←',
         '"The day reads the same forward and backward. So do you."',
         'Rare. Mathematical. Yours.'),
        ('silent_streak',   'THE SILENT STREAK','secret',
         'Complete a 7-day streak without ever opening the chat module.',
         '≈—≈',
         '"Depth over broadcast."',
         'All inward. No audience.'),
        ('full_moon',       'FULL MOON',        'uncommon',
         'Complete an emotional check-in during a full moon.',
         '○◐●',
         '"You aligned with the tide."',
         'The moon cycle is in the CQGS biofield model. This was intentional.'),
        ('hundred_words',   'HUNDRED WORDS',    'rare',
         'Write a note longer than 100 words in a single entry.',
         '≋≋≋',
         '"The deep end. You went there."',
         'Most users hover at the surface. You dove.'),
        ('seven_seven',     'SEVEN OF SEVENS',  'legendary',
         'Reach the 7-day badge on the 7th day of the 7th month.',
         '∘∘∘∘∘∘∘',
         '"Seven cycles complete. This was not an accident."',
         'Astronomical. You planned this or were fated to it.'),
        ('cqgs_quartet',    'CQGS QUARTET',     'epic',
         'Log all four CQGS pillars in a single day:\nCleanness  ·  Routine  ·  Nutrition  ·  Laughter',
         '◉◉◉◉',
         '"Full biofield emission in one day."',
         'The four pillars. All in 24 hours.'),
        ('architect_sage',  'ARCHITECT-SAGE',   'legendary',
         'Earn all Architecture milestone badges AND reach Chapter 5.',
         '║·║≋║·║',
         '"The structure is complete. The sage inhabits it."',
         'The rarest fusion: discipline and wisdom.'),
    ]

    for sid, name, r, cond, sym, quote, flavour in secrets:
        top = Table([[p(f'<b>{name}   {sym}</b>', 'badge'), rarity(r), p(f'id: {sid}', 'body_dim')]],
                    colWidths=[6*cm, 3*cm, 8.5*cm])
        top.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#1A0A00')),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ]))
        bot = Table([[p(f'Condition:\n{cond}', 'mono'), p(flavour, 'body'), p(quote, 'quote')]],
                    colWidths=[5*cm, 6.5*cm, 6*cm])
        bot.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PANEL_BG),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
            ('VALIGN',     (0, 0), (-1, -1), 'TOP'),
        ]))
        its.append(KeepTogether([top, bot, sp(0.2)]))

    its.append(sp(0.3))
    its += sec_hdr('WORD TURNS  (RPG INTERACTION LAYER)', ACCENT3)
    its.append(p('<b>Word Turns</b> are poetic micro-interactions embedded in the LOT terminal. '
                 'They appear as stoic one-liners, system whispers, and narrative pushes '
                 'that evolve with your progress. Selected by time-of-day, energy level, '
                 'and assembly state.', 'body'))
    its.append(sp(0.25))

    turns = [
        ('MORNING TURN',      'early_morning / morning',
         '"One deliberate act this morning changes the whole day."\n'
         '"Clarity lives in the first hour. Use it."\n'
         '"Today compounds into who you become. Begin."'),
        ('EVENING TURN',      'evening / night',
         '"Review without judgment. Growth integrates at rest."\n'
         '"Honest work earns honest rest. Take it."\n'
         '"What made you curious today? Follow that thread."'),
        ('LOW ENERGY TURN',   'energy < 50 %',
         '"Stillness is not defeat. It is how you recharge."\n'
         '"Care for yourself first. Everything else follows."'),
        ('HIGH ENERGY TURN',  'energy > 85 %',
         '"Full capacity. The system evolves fastest here."\n'
         '"Direct them — the architecture follows."'),
        ('STREAK TURN',       'streak > 3 days',
         '"You showed up again. That compounds."'),
        ('CLEANNESS TURN',    'morning  ·  surface prompt',
         '"Make your bed. First act of order. The day follows."\n'
         '"Open a window. Fresh air first."\n'
         '"Clear yesterday from your surfaces. Today starts clean."'),
        ('BREATHING TURN',    'stress: high',
         '"Breathe. Nothing else matters right now."'),
        ('DORMANT TURN',      'module not used > 7 days',
         '"[module] dormant. Awaiting its first signal."\n'
         '"The architecture senses a pattern forming."'),
        ('ASSEMBLY TURN',     'new module first use',
         '"[module] detected its first signal. Assembly initiated."\n'
         '"Structure forming from use."'),
        ('MIDNIGHT TURN',     '23:00 – 04:00',
         '"Late hours. The system waits without judgment."\n'
         '"Rest rebuilds everything. Go to sleep."'),
    ]

    rows = [[p(f'<b>{n}</b>', 'badge'), p(f'Context: {ctx}', 'body_dim'), p(msgs, 'mono')]
            for n, ctx, msgs in turns]
    its.append(dark_tbl(rows, [3.5*cm, 4.5*cm, 9.5*cm]))

    its.append(sp(0.4))
    its += sec_hdr('CHEAT CODES  (BROWSER CONSOLE COMMANDS)', ACCENT3)
    its.append(p('Real commands — accessible from the browser DevTools console for debugging and demo. '
                 'They expose the live evolution engine state.', 'body'))
    its.append(sp(0.2))

    cheats = [
        ('__evolutionDebug.getState()',       'View full evolution state object'),
        ('__evolutionDebug.getEffects()',     'View active visual effects'),
        ('__evolutionDebug.getUnlocks()',     'View all feature unlock flags'),
        ('__evolutionDebug.getDensity()',     'View current layout density'),
        ('__evolutionDebug.getSummary()',     'View maturity / refinement / level summary'),
        ('localStorage.getItem("earned_badges")',      'View your earned badge IDs'),
        ('localStorage.getItem("badge_theme")',        'View theme: "water" or "architecture"'),
        ('localStorage.getItem("badge_unlock_queue")', 'View pending unlock notifications'),
    ]

    rows = [[p(f'> {cmd}', 'mono'), p(desc, 'body_dim')] for cmd, desc in cheats]
    tbl = Table(rows, colWidths=[9*cm, 8.5*cm])
    tbl.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, -1), HexColor('#001000')),
        ('GRID',          (0, 0), (-1, -1), 0.3, HexColor('#003300')),
        ('TOPPADDING',    (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
    ]))
    its.append(tbl)
    its.append(PageBreak())
    return its


def progression_visual():
    its = sec_hdr('[ VIII ]  BADGE PROGRESSION VISUAL GUIDE', ACCENT)
    its.append(p('How the Public Profile looks as your streak grows. Water theme shown.', 'body'))
    its.append(sp(0.25))

    stages = [
        ('DAY 1–6',   'No badges yet. Building the first cycle.',
         'Level:          —\n'
         'Core values:    mindful · present · aware · grounded · authentic\n'
         'Emotional:      calm · reflective · intentional · open\n'
         'Behavioral:     consistent · deliberate · present · responsive'),
        ('DAY 7',     'Droplet (∘) milestone unlocked.',
         'Level:          ∘\n'
         'Core values:    mindful · present · aware · grounded · authentic\n'
         'Emotional:      calm · reflective · intentional · open'),
        ('DAY 15–21', 'Flow, Consistent, Balanced pattern badges unlocking.',
         'Level:          ∘\n'
         'Core values:    mindful · present ≈∘≈ aware · grounded —○— authentic\n'
         'Emotional:      calm · reflective ≈∘≈ intentional —○— open'),
        ('DAY 30',    'Wave (≈) milestone. Moon Cycle achievement unlocked.',
         'Level:          ≈\n'
         'Core values:    mindful ≈○≈ present ∿—∿ aware · grounded —○— authentic ○◐○\n'
         'Emotional:      calm ≈○≈ reflective ∿—∿ intentional · open'),
        ('DAY 60–90', 'All pattern badges typically unlocked.',
         'Level:          ≈\n'
         'Core values:    mindful ≈○≈ present ∿—∿ aware ○∴○ grounded —○— authentic ○◐○\n'
         'Emotional:      calm ≈○≈ reflective ∿—∿ intentional ○∴○ open —○—'),
        ('DAY 100',   'Current (≋) milestone. Unwavering achievement. Architecture complete.',
         'Level:          ≋\n'
         'Core values:    mindful ≈○≈ present ∿—∿ aware ○∴○ grounded —○— authentic ○◐○\n'
         'Emotional:      calm ≈○≈ reflective ∿—∿ intentional ○∴○ open —○—\n'
         '>> System self-assembly: COMPLETE'),
    ]

    for day, note, sample in stages:
        hdr_t = Table([[p(f'<b>{day}</b>', 'h3'), p(note, 'body')]],
                      colWidths=[2.5*cm, 15*cm])
        hdr_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#0D1A10')),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING',   (0, 0), (-1, -1), 8),
        ]))
        body_t = Table([[p(sample, 'mono_w')]], colWidths=[17.5*cm])
        body_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PANEL_BG),
            ('GRID',       (0, 0), (-1, -1), 0.3, BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 7),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
            ('LEFTPADDING',   (0, 0), (-1, -1), 14),
        ]))
        its.append(KeepTogether([hdr_t, body_t, sp(0.2)]))

    its.append(PageBreak())
    return its


def assembly_narrative():
    its = sec_hdr('[ IX ]  ASSEMBLY NARRATIVE SYSTEM', ACCENT)
    its.append(p('The <b>Self-Assembly Narrative</b> describes the LOT system as a living, building '
                 'entity. Every user action is a signal that causes modules to transition through '
                 'assembly phases. The interface co-evolves with the user.', 'body'))
    its.append(sp(0.3))

    phases = [
        ('dormant',    '○',  'Module never received a signal. Awaiting first interaction.'),
        ('awakening',  '◑',  'First signal received. Architecture senses a pattern forming.'),
        ('forming',    '◕',  'Patterns detected. Structure crystallizing from your rhythm.'),
        ('assembled',  '●',  'Module self-assembled entirely from your signals.'),
        ('integrated', '≋',  'Module fully integrated. Wired deep into the system fabric.'),
    ]

    rows = [[p(f'<b>{ph.upper()}</b>', 'badge'), p(sym, 'mono_w'), p(desc, 'body')]
            for ph, sym, desc in phases]
    its.append(dark_tbl(rows, [3*cm, 2*cm, 12.5*cm]))

    its.append(sp(0.35))
    its.append(p('<b>Modules tracked:</b>  Memory  ·  Planner  ·  Emotional Check-In  ·  '
                 'Energy Capacitor  ·  Pattern Recognition  ·  Community Chat  ·  '
                 'Narrative  ·  Goal Journey', 'body_dim'))
    its.append(sp(0.2))
    its.append(p('<b>Ecosystem nodes:</b>  LOT Computer  ·  LOT Car  ·  LOT Home  '
                 '— each with its own assembly state, cross-referencing the biofield.', 'body_dim'))
    its.append(sp(0.35))

    its += sec_hdr('EVOLUTION DIMENSIONS  (Interface Evolution Widget)', ACCENT2)
    dims = [
        ('Exploration',   '0→100', 'Variety of modules used'),
        ('Consistency',   '0→100', 'Daily streak length'),
        ('Depth',         '0→100', 'Memory question answer count'),
        ('Connection',    '0→100', 'Community engagement'),
        ('Intimacy',      '0→100', 'Romantic / close connection notes'),
        ('Care',          '0→100', 'Self-care events logged'),
        ('Courage',       '0→100', 'Honest note entries'),
    ]
    rows = [[p(f'<b>{d}</b>', 'badge'), p(rng, 'mono_w'), p(desc, 'body')]
            for d, rng, desc in dims]
    its.append(dark_tbl(rows, [3.5*cm, 2*cm, 12*cm]))

    its.append(PageBreak())
    return its


def unlock_messages():
    its = sec_hdr('[ X ]  UNLOCK MESSAGES COMPENDIUM', ACCENT)
    its.append(p('Complete list of all toast / notification messages shown when badges '
                 'and achievements unlock. Shown in typical user journey order.', 'body'))
    its.append(sp(0.3))

    msgs = [
        # type  id/context              message
        ('BADGE', 'milestone_7 (water)',    '↳ First drops form   ∘'),
        ('BADGE', 'milestone_30 (water)',   '↳ Waves begin to flow   ≈'),
        ('BADGE', 'milestone_100 (water)',  '↳ Deep currents established   ≋'),
        ('BADGE', 'milestone_7 (arch)',     '↳ Foundation laid   ├─'),
        ('BADGE', 'milestone_30 (arch)',    '↳ Structure rises   ╞═╡'),
        ('BADGE', 'milestone_100 (arch)',   '↳ Architecture complete   ║·║'),
        ('BADGE', 'balanced (water)',       'Waters find equilibrium.   ≈○≈'),
        ('BADGE', 'flow (water)',           'Embraced by the current.   ≈∘≈'),
        ('BADGE', 'consistent (water)',     'Steady current.   —○—'),
        ('BADGE', 'reflective (water)',     'Depth in reflection.   ○◐○'),
        ('BADGE', 'explorer (water)',       'Curiosity scatters like light.   ○∴○'),
        ('BADGE', 'balanced (arch)',        'Load-bearing walls on all sides.   ┼─┼'),
        ('BADGE', 'flow (arch)',            'The structure conducts.   │∿│'),
        ('BADGE', 'consistent (arch)',      'The beam holds.   ━·━'),
        ('BADGE', 'reflective (arch)',      'Dashed introspection.   ╌·╌'),
        ('BADGE', 'explorer (arch)',        'Dotted wandering.   ┄·┄'),
        ('ACH',   'first_checkin',          '"First Breath" — Your first emotional check-in.'),
        ('ACH',   'first_answer',           '"Mirror Gazer" — Answered your first memory question.'),
        ('ACH',   'community_voice',        '"Community Voice" — First message shared.'),
        ('ACH',   'week_warrior',           '"Week Warrior" — 7 days. The habit is forming.'),
        ('ACH',   'moon_cycle',             '"Moon Cycle" — 30 days. The tide has turned.'),
        ('ACH',   'unwavering',             '"Unwavering" — 100 days. This is who you are now.'),
        ('ACH',   'deep_diver',             '"Deep Diver" — 50 answers. You go deep.'),
        ('ACH',   'self_scholar',           '"Self Scholar" — 100 answers. The archive grows.'),
        ('ACH',   'soul_cartographer',      '"Soul Cartographer" — 250 answers. The map is vast.'),
        ('ACH',   'bridge_builder',         '"Bridge Builder" — 20 messages. Connections made.'),
        ('ACH',   'heart_tender',           '"Heart Tender" — Love acknowledged.'),
        ('ACH',   'intimacy_keeper',        '"Intimacy Keeper" — Tending the connection.'),
        ('ACH',   'gentle_with_self',       '"Gentle With Self" — Care practiced.'),
        ('ACH',   'truth_speaker',          '"Truth Speaker" — 50 honest entries. Courage.'),
        ('EVOL',  'level_10 (Explorer)',    'No longer a beginner. New pathways form.'),
        ('EVOL',  'level_30 (Practitioner)','Practice embedded. Architecture evolves.'),
        ('EVOL',  'level_60 (Master)',      'The system you helped build mirrors your depth.'),
        ('EVOL',  'level_90 (Sage)',        'Co-evolution achieved. Self-sustaining.'),
    ]

    def t_style(t):
        if t == 'BADGE':  return 'mono'
        if t == 'ACH':    return 'mono_gold'
        return 'mono_w'

    rows = [[p(f'<b>{t}</b>', t_style(t)), p(mid, 'body_dim'), p(msg, 'mono')]
            for t, mid, msg in msgs]
    tbl = Table(rows, colWidths=[1.5*cm, 4.8*cm, 11.2*cm])
    tbl.setStyle(TableStyle([
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [PANEL_BG, PANEL_ALT]),
        ('GRID',           (0, 0), (-1, -1), 0.3, BORDER),
        ('TOPPADDING',     (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING',  (0, 0), (-1, -1), 4),
        ('LEFTPADDING',    (0, 0), (-1, -1), 6),
        ('VALIGN',         (0, 0), (-1, -1), 'TOP'),
        ('FONTSIZE',       (0, 0), (-1, -1), 7.5),
    ]))
    its.append(tbl)
    return its


def back_page():
    its = [PageBreak()]
    its += ascii_block([
        '',
        '╔═══════════════════════════════════════════════════════════╗',
        '║                                                           ║',
        '║   "The system builds itself from what you give it."      ║',
        '║                                                           ║',
        '║   Every answer.  Every check-in.  Every honest note.     ║',
        '║   Every morning you showed up.                           ║',
        '║                                                           ║',
        '║   This is not a wellness app.                            ║',
        '║   This is you  —  compiled.                              ║',
        '║                                                           ║',
        '╚═══════════════════════════════════════════════════════════╝',
        '',
    ], ACCENT, 9)
    its.append(sp(0.5))
    its += ascii_block([
        '∘  →  ≈  →  ≋',
        '',
        'WATER:   Droplet → Wave → Deep Current',
        'ARCH:    Foundation → Structure → Architecture',
        '',
        'One track.  Same destination.',
        'Choose your metaphor.  Build your self.',
    ], WATER_C, 9)
    its.append(sp(0.5))
    its += ascii_block([
        '┌──────────────────────────────────────────────────────────┐',
        '│  LOT Systems   ·   © 2025-2026   All Rights Reserved    │',
        '│  Created by Vadik Marmeladov   ·   CEO & Founder         │',
        '│  Badges & Achievements Codex   v 2.0                    │',
        '│  Generated 2026   ·   github.com/lot-systems/lot-computer│',
        '└──────────────────────────────────────────────────────────┘',
    ], TEXT_DIM, 8)
    return its


# ═══════════════════════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════════════════════

def generate(out: str):
    doc = SimpleDocTemplate(
        out,
        pagesize=A4,
        leftMargin=1.6*cm, rightMargin=1.6*cm,
        topMargin=1.9*cm,  bottomMargin=1.9*cm,
        title='LOT Computer — Badges & Achievements Codex v2.0',
        author='LOT Systems — Vadik Marmeladov',
        subject='Self-Care RPG Field Manual',
    )

    content = []
    content += title_page()
    content += toc()
    content += overview()
    content += milestone_badges()
    content += pattern_badges()
    content += achievements()
    content += evolution_system()
    content += archetypes()
    content += easter_eggs()
    content += progression_visual()
    content += assembly_narrative()
    content += unlock_messages()
    content += back_page()

    doc.build(content, onFirstPage=draw_page, onLaterPages=draw_page)
    print(f'[OK]  PDF  →  {out}')


if __name__ == '__main__':
    out_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'docs', 'LOT-BADGES-ACHIEVEMENTS-CODEX.pdf'
    )
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    generate(out_path)
