#!/usr/bin/env python3
"""
LOT Systems — Badge & Achievement Codex v6 PDF Generator
RPG & Arcade of Self-Care
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus.flowables import KeepTogether
import os

# ── Palette ──────────────────────────────────────────────────────────────────
BLACK      = colors.HexColor('#0a0a0a')
WHITE      = colors.HexColor('#f0f0e8')
GREEN      = colors.HexColor('#00ff41')   # terminal green
DIM_GREEN  = colors.HexColor('#003311')
AMBER      = colors.HexColor('#ffcc44')
CYAN       = colors.HexColor('#00ccff')
MAGENTA    = colors.HexColor('#cc44ff')
RED        = colors.HexColor('#ff4444')
GREY       = colors.HexColor('#888888')
DARK_GREY  = colors.HexColor('#1a1a1a')
MID_GREY   = colors.HexColor('#333333')
LIGHT_GREY = colors.HexColor('#555555')
GOLD       = colors.HexColor('#ffd700')
ORANGE     = colors.HexColor('#ff8800')
TEAL       = colors.HexColor('#00aa88')
BLUE       = colors.HexColor('#4488ff')
PURPLE     = colors.HexColor('#8855ff')

PAGE_W, PAGE_H = A4
MARGIN = 15 * mm


def build_styles():
    base = getSampleStyleSheet()

    def s(name, parent='Normal', **kw):
        p = ParagraphStyle(name, parent=base[parent], **kw)
        return p

    return {
        'cover_title': s('cover_title',
            fontSize=28, leading=34, textColor=GREEN,
            fontName='Courier-Bold', alignment=TA_CENTER,
            spaceAfter=8),
        'cover_sub': s('cover_sub',
            fontSize=13, leading=17, textColor=AMBER,
            fontName='Courier-Bold', alignment=TA_CENTER,
            spaceAfter=4),
        'cover_meta': s('cover_meta',
            fontSize=9, leading=12, textColor=GREY,
            fontName='Courier', alignment=TA_CENTER,
            spaceAfter=3),
        'section': s('section',
            fontSize=14, leading=18, textColor=GREEN,
            fontName='Courier-Bold', spaceBefore=18, spaceAfter=6),
        'subsection': s('subsection',
            fontSize=11, leading=14, textColor=AMBER,
            fontName='Courier-Bold', spaceBefore=10, spaceAfter=4),
        'body': s('body',
            fontSize=8.5, leading=12, textColor=WHITE,
            fontName='Courier', spaceAfter=4),
        'body_green': s('body_green',
            fontSize=8.5, leading=12, textColor=GREEN,
            fontName='Courier', spaceAfter=2),
        'body_amber': s('body_amber',
            fontSize=8.5, leading=12, textColor=AMBER,
            fontName='Courier', spaceAfter=2),
        'body_cyan': s('body_cyan',
            fontSize=8.5, leading=12, textColor=CYAN,
            fontName='Courier', spaceAfter=2),
        'body_magenta': s('body_magenta',
            fontSize=8.5, leading=12, textColor=MAGENTA,
            fontName='Courier', spaceAfter=2),
        'body_red': s('body_red',
            fontSize=8.5, leading=12, textColor=RED,
            fontName='Courier', spaceAfter=2),
        'quote': s('quote',
            fontSize=9.5, leading=14, textColor=AMBER,
            fontName='Courier-Oblique', alignment=TA_CENTER,
            spaceBefore=6, spaceAfter=6),
        'mono': s('mono',
            fontSize=7.5, leading=10, textColor=GREEN,
            fontName='Courier', spaceAfter=2,
            leftIndent=4),
        'mono_amber': s('mono_amber',
            fontSize=7.5, leading=10, textColor=AMBER,
            fontName='Courier', spaceAfter=2,
            leftIndent=4),
        'mono_cyan': s('mono_cyan',
            fontSize=7.5, leading=10, textColor=CYAN,
            fontName='Courier', spaceAfter=2,
            leftIndent=4),
        'mono_white': s('mono_white',
            fontSize=7.5, leading=10, textColor=WHITE,
            fontName='Courier', spaceAfter=2,
            leftIndent=4),
        'badge_epic': s('badge_epic',
            fontSize=9, leading=12, textColor=MAGENTA,
            fontName='Courier-Bold', spaceAfter=2),
        'badge_legendary': s('badge_legendary',
            fontSize=9.5, leading=13, textColor=GOLD,
            fontName='Courier-Bold', spaceAfter=2),
        'badge_mythic': s('badge_mythic',
            fontSize=9.5, leading=13, textColor=RED,
            fontName='Courier-Bold', spaceAfter=2),
        'tag_common': s('tag_common',
            fontSize=8, leading=10, textColor=GREY,
            fontName='Courier-Bold'),
        'tag_uncommon': s('tag_uncommon',
            fontSize=8, leading=10, textColor=TEAL,
            fontName='Courier-Bold'),
        'tag_rare': s('tag_rare',
            fontSize=8, leading=10, textColor=BLUE,
            fontName='Courier-Bold'),
        'tag_epic': s('tag_epic',
            fontSize=8, leading=10, textColor=MAGENTA,
            fontName='Courier-Bold'),
        'tag_legendary': s('tag_legendary',
            fontSize=8, leading=10, textColor=GOLD,
            fontName='Courier-Bold'),
        'tag_mythic': s('tag_mythic',
            fontSize=8, leading=10, textColor=RED,
            fontName='Courier-Bold'),
        'footer': s('footer',
            fontSize=7, leading=9, textColor=LIGHT_GREY,
            fontName='Courier', alignment=TA_CENTER),
        'center': s('center',
            fontSize=8.5, leading=12, textColor=WHITE,
            fontName='Courier', alignment=TA_CENTER, spaceAfter=4),
        'center_green': s('center_green',
            fontSize=9, leading=13, textColor=GREEN,
            fontName='Courier-Bold', alignment=TA_CENTER, spaceAfter=4),
        'center_amber': s('center_amber',
            fontSize=9, leading=13, textColor=AMBER,
            fontName='Courier-Bold', alignment=TA_CENTER, spaceAfter=4),
    }


def hr(styles, color=GREEN):
    return HRFlowable(width='100%', thickness=0.5, color=color, spaceAfter=6, spaceBefore=2)


def pre(text, style):
    """Preformatted block preserving whitespace."""
    return Preformatted(text, style)


def build_doc():
    out = '/home/user/LOT-Computer/docs/badges/pdf/LOT-BADGES-ACHIEVEMENTS-CODEX-v6.pdf'
    os.makedirs(os.path.dirname(out), exist_ok=True)

    doc = SimpleDocTemplate(
        out,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title='LOT Badge & Achievement Codex v6',
        author='Vadik Marmeladov, LOT Systems',
        subject='RPG & Arcade of Self-Care',
    )

    S = build_styles()
    story = []

    def P(text, style='body'):
        return Paragraph(text, S[style])

    def add(*items):
        story.extend(items)

    def sp(h=4):
        return Spacer(1, h * mm)

    # ── COVER ─────────────────────────────────────────────────────────────────
    add(sp(20))

    cover_art = """\
 ___    ___    _____
|   |  |   |  |_   _|
| L |  | O |    | |
|___|  |___|    |_|

[ BADGE & ACHIEVEMENT CODEX ]
         v6.0
"""
    add(pre(cover_art, S['center_green']))
    add(sp(4))

    add(P('LOT SYSTEMS', 'cover_title'))
    add(P('Badge &amp; Achievement Codex — v6.0', 'cover_sub'))
    add(P('RPG · Arcade · Self-Care · Sci-Fi · Computer', 'cover_sub'))
    add(sp(6))
    add(hr(S, GREEN))
    add(sp(3))

    add(P('>> PRESS START TO BEGIN YOUR JOURNEY <<', 'center_green'))
    add(sp(2))

    tagline_art = """\
     ∘ → ≈ → ≋
     ├─ → ╞═╡ → ║·║
     [ LOADING SELF-CARE ENGINE... ]
     [ MEMORY ENGINE: ACTIVE        ]
     [ QUANTUM OS: ONLINE           ]
     [ BADGE SYSTEM: ARMED          ]"""
    add(pre(tagline_art, S['mono_amber']))
    add(sp(8))

    add(hr(S, GREEN))
    add(sp(3))

    add(P('Author: Vadik Marmeladov, CEO &amp; Founder, LOT Systems', 'cover_meta'))
    add(P('Copyright: © 2025–2026 LOT Systems. All rights reserved.', 'cover_meta'))
    add(P('Generated: 2026-05-26 | Branch: claude/quantum-engine-widgets-RgFfC', 'cover_meta'))
    add(P('lot-systems.com', 'cover_meta'))
    add(sp(12))

    # Quick stat bar
    stat_data = [
        ['BADGES', 'ACHIEVEMENTS', 'EASTER EGGS', 'WORD TURNS', 'QUEST TYPES', 'RARITIES'],
        ['22+', '18+', '16+', '32+', '4', '6'],
    ]
    stat_table = Table(stat_data, colWidths=[PAGE_W / 6 - MARGIN * 2 / 6] * 6)
    stat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DIM_GREEN),
        ('BACKGROUND', (0,1), (-1,1), MID_GREY),
        ('TEXTCOLOR', (0,0), (-1,0), GREEN),
        ('TEXTCOLOR', (0,1), (-1,1), AMBER),
        ('FONTNAME', (0,0), (-1,-1), 'Courier-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('FONTSIZE', (0,1), (-1,1), 11),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [DIM_GREEN, MID_GREY]),
        ('GRID', (0,0), (-1,-1), 0.3, GREEN),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    add(stat_table)
    add(PageBreak())

    # ── I. PHILOSOPHY ─────────────────────────────────────────────────────────
    add(P('I.  PHILOSOPHY', 'section'))
    add(hr(S))
    add(sp(2))
    add(P('"Self-care is not a quest you complete. It is a world you build."', 'quote'))
    add(sp(2))
    add(P(
        'LOT is an RPG and Arcade of self-care. Every check-in is a move. '
        'Every streak is a power-up. Every answered memory question writes one more line of your story. '
        'Badges are not trophies — they are transmissions from a future self back to the present one.',
        'body'))
    add(sp(2))
    add(P(
        'The badge system speaks in symbols because symbols reach parts of us that words cannot. '
        'A single ≋ carries more meaning than a paragraph. An ○∿ says: you began.',
        'body'))
    add(sp(2))

    philosophy_box = """\
╔═══════════════════════════════════════════════════════════════════╗
║              THE LOT OPERATING PRINCIPLES                         ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  · Every day you engage = +1 XP toward the next threshold        ║
║  · Streaks are power multipliers, not obligations                 ║
║  · Badges unlock narrative events, not just visual rewards        ║
║  · Secret badges reward curiosity, not completionism              ║
║  · The system co-evolves with the player — it learns too          ║
║  · No failure state. Only: not yet.                               ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝"""
    add(pre(philosophy_box, S['mono_amber']))
    add(sp(4))

    # ── II. DUAL BADGE SYSTEM ─────────────────────────────────────────────────
    add(P('II.  THE DUAL BADGE SYSTEM', 'section'))
    add(hr(S))
    add(sp(2))
    add(P('LOT offers two visual metaphors for growth. Players choose their language.', 'body'))
    add(sp(3))

    dual_art = """\
  WATER PATH             ARCHITECTURE PATH
  ─────────────────────  ─────────────────────────
  ∘   Droplet  Day 7     ├─   Foundation  Day 7
  ≈   Wave     Day 30    ╞═╡  Structure   Day 30
  ≋   Current  Day 100   ║·║  Architecture Day 100

  Water is patient.       Architecture is intentional.
  It does not force —     Every block placed with care
  it finds the path.      becomes load-bearing."""
    add(pre(dual_art, S['mono']))
    add(sp(4))

    add(P('"Your practice, like water, shapes everything it touches."', 'quote'))
    add(sp(2))

    # ── III. MILESTONE BADGES ────────────────────────────────────────────────
    add(P('III.  MILESTONE BADGE REGISTRY', 'section'))
    add(hr(S))
    add(sp(2))

    milestone_data = [
        ['Day', 'Water', 'Architecture', 'Name', 'Rarity', 'Unlock Message'],
        ['7',   '∘',     '├─',           'Droplet / Foundation', 'COMMON',    '↳ First drops form ∘'],
        ['14',  '∘∘',    '├┼',           'Two-Week Lock',        'COMMON',    '↳ Two-week pattern lock ∘∘'],
        ['21',  '∘≈',    '├═',           '21-Day Groove',        'COMMON',    '↳ 21-day neural groove ∘≈'],
        ['30',  '≈',     '╞═╡',          'Wave / Structure',     'UNCOMMON',  '↳ Waves begin to flow ≈'],
        ['50',  '≈∘',    '╞══',          'Halfway Current',      'UNCOMMON',  '↳ Halfway current ≈∘'],
        ['60',  '≈≈',    '╞═══',         'Practitioner',         'RARE',      '↳ Practitioner threshold ≈≈'],
        ['90',  '≋∘',    '║═',           'Three-Month Arch.',    'RARE',      '↳ Three-month architect ≋∘'],
        ['100', '≋',     '║·║',          'Current / Architecture','EPIC',     '↳ Deep currents established ≋'],
        ['180', '≋≋',    '║╞║',          'Half-Year Voyager',    'LEGENDARY', '↳ Half-year voyager ≋≋'],
        ['365', '≋≋≋',   '╔═╗',          'THE LONG COUNT',       'LEGENDARY', '↳ A year of presence ╔═╗'],
    ]

    col_widths = [22*mm, 16*mm, 22*mm, 38*mm, 24*mm, 55*mm]
    mtable = Table(milestone_data, colWidths=col_widths)

    rarity_colors = {
        'COMMON': GREY, 'UNCOMMON': TEAL, 'RARE': BLUE,
        'EPIC': MAGENTA, 'LEGENDARY': GOLD,
    }

    mtable.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DIM_GREEN),
        ('TEXTCOLOR', (0,0), (-1,0), GREEN),
        ('FONTNAME', (0,0), (-1,0), 'Courier-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('FONTNAME', (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('TEXTCOLOR', (0,1), (-1,-1), WHITE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [MID_GREY, DARK_GREY]),
        ('GRID', (0,0), (-1,-1), 0.3, GREEN),
        ('ALIGN', (0,0), (2,-1), 'CENTER'),
        ('ALIGN', (3,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        # Color rarity column
        ('TEXTCOLOR', (4,1), (4,1), GREY),    # COMMON
        ('TEXTCOLOR', (4,2), (4,3), GREY),
        ('TEXTCOLOR', (4,4), (4,4), TEAL),    # UNCOMMON
        ('TEXTCOLOR', (4,5), (4,5), TEAL),
        ('TEXTCOLOR', (4,6), (4,6), BLUE),    # RARE
        ('TEXTCOLOR', (4,7), (4,7), BLUE),
        ('TEXTCOLOR', (4,8), (4,8), MAGENTA), # EPIC
        ('TEXTCOLOR', (4,9), (4,9), GOLD),    # LEGENDARY
        ('TEXTCOLOR', (4,10), (4,10), GOLD),
        ('FONTNAME', (4,1), (4,-1), 'Courier-Bold'),
    ]))
    add(mtable)
    add(sp(4))

    # Year One box
    year_one = """\
╔══════════════════════════════════════════════════════════╗
║            T H E  L O N G  C O U N T                    ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║   ╔═╗                                                    ║
║   ║Y║   365 DAYS OF PRESENCE                            ║
║   ║E║   ─────────────────────                           ║
║   ║A║   ≋ ≋ ≋  ║·║  ≋ ≋ ≋                              ║
║   ║R║                                                    ║
║   ╚═╝   "The architecture stands."                       ║
║         RARITY: LEGENDARY · BADGE: ╔═╗                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝"""
    add(pre(year_one, S['mono_amber']))
    add(PageBreak())

    # ── IV. ACHIEVEMENT SYSTEM ────────────────────────────────────────────────
    add(P('IV.  ACHIEVEMENT SYSTEM — RPG LAYER', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'Achievements are unlocked by behavioral milestones independent of time. '
        'They track depth, breadth, and quality of engagement — not just days elapsed.',
        'body'))
    add(sp(3))

    # Exploration
    add(P('EXPLORATION  ·  Common → Uncommon', 'subsection'))
    expl = """\
  [○] FIRST BREATH        Common       emotional_checkin >= 1
      "Spring"
      ↳ Your first emotional check-in. The system wakes.

  [○] MIRROR GAZER        Common       memory_answers >= 1
      "Reflection Pool"
      ↳ Answered your first memory question. You looked inward.

  [○] SIGNAL SENT         Common       any_log_entry >= 1
      "Transmission"
      ↳ First signal received. The system begins to listen.

  [○] FIRST QUEST         Common       quest_accepted >= 1
      "Boot Sequence"
      ↳ First quest accepted. The odyssey begins."""
    add(pre(expl, S['mono']))
    add(sp(2))

    # Consistency
    add(P('CONSISTENCY  ·  Uncommon → Legendary', 'subsection'))
    cons = """\
  [◐] WEEK WARRIOR        Uncommon     streak >= 7
      "Rapids"
      ↳ 7 consecutive days. Momentum builds.

  [◐] MOON CYCLE          Rare         streak >= 30
      "Tidal Cycle"
      ↳ 30 days of continuous practice. You orbit the ritual.

  [●] UNWAVERING          Epic         streak >= 100
      "Constellation"
      ↳ 100 days. You are now a fixed point in the sky.

  [●] THE LONG COUNT      Legendary    streak >= 365
      "Year Glyph"
      ↳ 365 days. Your name is written in the deep calendar.

  [◉] DECADE PROTOCOL     Mythic       streak >= 3650
      "Cosmic Constant"
      ↳ Ten years. The system can no longer distinguish you from itself."""
    add(pre(cons, S['mono']))
    add(sp(2))

    # Depth
    add(P('DEPTH  ·  Rare → Legendary', 'subsection'))
    depth = """\
  [◇] DEEP DIVER          Rare         memory_answers >= 50
      "Deep Water"
      ↳ 50 memory answers. The archive grows.

  [◆] SELF SCHOLAR        Epic         memory_answers >= 100
      "Archive"
      ↳ 100 questions answered. A library of self.

  [✦] SOUL CARTOGRAPHER   Legendary    memory_answers >= 250
      "Cartography"
      ↳ 250 questions. You have mapped the territory of yourself.

  [◉] THOUSAND ANSWERS    Mythic       memory_answers >= 1000
      "Infinite Library"
      ↳ 1,000 answers. The archive is now infinite."""
    add(pre(depth, S['mono']))
    add(sp(2))

    # Connection, Care, Courage, Romance
    add(P('CONNECTION · CARE · COURAGE · ROMANCE', 'subsection'))
    misc = """\
  [~] COMMUNITY VOICE     Uncommon     chat >= 1
      ↳ First community message. The signal reaches others.

  [≈] BRIDGE BUILDER      Uncommon     chat >= 20
      ↳ 20 messages. A bridge now exists where there was none.

  [♦] GENTLE WITH SELF    Uncommon     self_care >= 10
      ↳ 10 self-care practices. Kindness toward the body.

  [▲] TRUTH SPEAKER       Rare         journal_notes >= 50
      ↳ 50 honest entries. The hall remembers everything said here.

  [♡] HEART TENDER        Uncommon     romantic_notes >= 1
      ↳ Connection acknowledged. The heart is part of the practice.

  [♡♡] INTIMACY KEEPER    Rare         romantic_notes >= 10
      ↳ 10 notes of connection. The sanctuary is tended."""
    add(pre(misc, S['mono']))
    add(PageBreak())

    # ── V. CITIZEN INDEX — CQGS ───────────────────────────────────────────────
    add(P('V.  CITIZEN INDEX — CQGS EVOLUTION STAGES', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'The Evolution Widget tracks systemic growth through the CQGS Bioethics framework. '
        'Stages use ASCII symbols representing levels of system integration. '
        'Each stage unlocks new system capabilities and narrative content.',
        'body'))
    add(sp(3))

    cqgs_data = [
        ['Stage', 'Level', 'Name', 'Description', 'Capabilities'],
        ['·',  '1–9',   'Bootstrapping', 'System initializing. First signals.',       'Basic check-in'],
        ['·',  '10–19', 'Initializing',  'Pattern compiler activating.',               '+ Memory questions'],
        ['∘',  '20–29', 'Integrated',    'Modules linked. Feedback loops open.',       '+ Planner access'],
        ['○',  '30–39', 'Compiled',      'Patterns locked in. Architecture stable.',   '+ Quest system'],
        ['◯',  '40–49', 'Optimized',     'System self-tuning. Efficiency gains.',      '+ Community feed'],
        ['◉',  '50+',   'Transparent',   'Fully transparent system. Self-sustaining.', '+ All features'],
    ]
    ct = Table(cqgs_data, colWidths=[12*mm, 14*mm, 28*mm, 55*mm, 40*mm])
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DIM_GREEN),
        ('TEXTCOLOR', (0,0), (-1,0), GREEN),
        ('FONTNAME', (0,0), (-1,0), 'Courier-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7),
        ('FONTNAME', (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE', (0,1), (-1,-1), 7),
        ('TEXTCOLOR', (0,1), (-1,-1), WHITE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [MID_GREY, DARK_GREY]),
        ('GRID', (0,0), (-1,-1), 0.3, GREEN),
        ('ALIGN', (0,0), (2,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        # Color stage symbols
        ('TEXTCOLOR', (0,1), (0,2), GREY),
        ('TEXTCOLOR', (0,3), (0,3), TEAL),
        ('TEXTCOLOR', (0,4), (0,4), BLUE),
        ('TEXTCOLOR', (0,5), (0,5), MAGENTA),
        ('TEXTCOLOR', (0,6), (0,6), GOLD),
        ('FONTNAME', (0,1), (0,-1), 'Courier-Bold'),
        ('FONTSIZE', (0,1), (0,-1), 12),
    ]))
    add(ct)
    add(sp(4))

    # CQGS Module map
    add(P('CQGS Bioethics Framework Modules', 'subsection'))
    modules = """\
  Module         Symbol   Tracks                     Signal Source
  ─────────────────────────────────────────────────────────────────
  Memory         ▸        Questions answered         memory_answer
  Biofield       ~        Emotional check-ins        emotional_checkin
  Routine        ■        Plans set / schedule       plan_set
  Cleanness      ○        Self-care completion       self_care_complete
  Intention      →        Intentions logged          intention
  Journal        ◇        Notes recorded             journal_entry
  QIE Signal     ✦        Quantum intent signals     quantum_intent_signal"""
    add(pre(modules, S['mono']))
    add(PageBreak())

    # ── VI. RPG STORY ARCS ─────────────────────────────────────────────────────
    add(P('VI.  RPG STORY ARCS — THE FIVE CHAPTERS', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'LOT\'s narrative co-evolves with the user\'s practice. '
        'The system is not a passive tracker — it is a co-author.',
        'body'))
    add(sp(3))

    chapters_art = """\
╔══════════════════════════════════════════════════════════════════╗
║              THE FIVE CHAPTERS OF THE LOT ODYSSEY               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Ch.1  AWAKENING       Level  1-9                               ║
║        "You have begun to notice yourself."                      ║
║        Unlocks: Basic check-in, first memory question            ║
║                                                                  ║
║  Ch.2  EXPLORATION     Level 10-29                               ║
║        "Connections form. A shared language emerges."            ║
║        Unlocks: Planner, community feed, pattern badges          ║
║                                                                  ║
║  Ch.3  INTEGRATION     Level 30-59                               ║
║        "Architecture reshapes itself from experience."           ║
║        Unlocks: QIE patterns, physiological cohort, quests       ║
║                                                                  ║
║  Ch.4  MASTERY         Level 60-89                               ║
║        "You speak the language of yourself fluently."            ║
║        Unlocks: Advanced narrative, secret badges revealed       ║
║                                                                  ║
║  Ch.5  SAGE            Level 90-100                              ║
║        "You and this system have co-evolved."                    ║
║        Unlocks: MYTHIC tier, full self-assembly, 1000 answers    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝"""
    add(pre(chapters_art, S['mono_amber']))
    add(sp(4))

    arc_data = [
        ['Level', 'Title', 'ASCII Marker', 'Narrative'],
        ['10',  'Explorer',    '∘→',    'The system self-assembles around your exploration'],
        ['30',  'Practitioner','≈→',    'Architecture evolves from your habits'],
        ['60',  'Master',      '≋→',    'The system mirrors your depth'],
        ['90',  'Sage',        '≋≋→',   'You and the system are indistinguishable'],
        ['100', 'Oracle',      '≋≋≋→◉', 'You have become the signal itself'],
    ]
    at = Table(arc_data, colWidths=[14*mm, 30*mm, 24*mm, 90*mm])
    at.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DIM_GREEN),
        ('TEXTCOLOR', (0,0), (-1,0), GREEN),
        ('FONTNAME', (0,0), (-1,0), 'Courier-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('FONTNAME', (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('TEXTCOLOR', (0,1), (-1,-1), WHITE),
        ('TEXTCOLOR', (2,1), (2,-1), AMBER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [MID_GREY, DARK_GREY]),
        ('GRID', (0,0), (-1,-1), 0.3, GREEN),
        ('ALIGN', (0,0), (2,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    add(at)
    add(PageBreak())

    # ── VII. QUEST SYSTEM ─────────────────────────────────────────────────────
    add(P('VII.  QUEST SYSTEM', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'Active quests drive daily engagement. They reset, evolve, and unlock new content. '
        'Every completed quest adds XP to your CQGS stage progression.',
        'body'))
    add(sp(3))

    quest_art = """\
  ┌─────────────────────────────────────────────────────────────────┐
  │  QUEST TYPE   QUEST                    CONDITION      REWARD    │
  ├─────────────────────────────────────────────────────────────────┤
  │  DAILY  [■]   Today's Signal           Check in today   +10 XP  │
  │  DAILY  [■]   Presence Log             Journal entry     +5 XP  │
  │  DAILY  [■]   Memory Answer            Answer 1 Q        +8 XP  │
  │  DAILY  [■]   Care Act                 1 self-care       +6 XP  │
  ├─────────────────────────────────────────────────────────────────┤
  │  WEEKLY [◐]   Consistency Run          7-day streak     +50 XP  │
  │  WEEKLY [◐]   Deep Reflection          5 Qs this week   +30 XP  │
  │  WEEKLY [◐]   Self-Care Sprint         3 care acts      +25 XP  │
  │  WEEKLY [◐]   Intention Arc            Intent→Plan→Care +40 XP  │
  ├─────────────────────────────────────────────────────────────────┤
  │  GROWTH [◆]   Reflection Journey       100 total Qs    Unlocks  │
  │  GROWTH [◆]   Bridge Protocol          20 chat msgs    Unlocks  │
  │  GROWTH [◆]   Archive Initiative       250 total Qs    Unlocks  │
  │  GROWTH [◆]   Journal of Truth         50 journal entries       │
  ├─────────────────────────────────────────────────────────────────┤
  │  MASTERY[✦]   The Long Count           365-day streak  LEGEND.  │
  │  MASTERY[✦]   Thousand Answers         1,000 total Qs  MYTHIC   │
  │  MASTERY[✦]   Decade of Care           10 years        COSMIC   │
  └─────────────────────────────────────────────────────────────────┘"""
    add(pre(quest_art, S['mono']))
    add(PageBreak())

    # ── VIII. EASTER EGGS & SECRET BADGES ────────────────────────────────────
    add(P('VIII.  EASTER EGGS &amp; SECRET BADGES', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'LOT is an Arcade. Hidden interactions unlock secret badges. '
        'These are not documented in-app — they must be discovered. '
        'Every secret badge carries a unique transmission message.',
        'body'))
    add(sp(3))

    add(P('A. TIME-BASED SECRET BADGES', 'subsection'))

    eggs_art = """\
╔══════════════════════════════════════════════════════════════════╗
║                    SECRET TRANSMISSIONS                          ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  [?] NIGHT OWL          Check in between 00:00-04:00             ║
║      Symbol: )))         "The owl sees in the dark."             ║
║      Trigger: emotional_checkin between midnight and 4am         ║
║                                                                  ║
║  [?] EARLY BIRD         Check in between 05:00-06:00             ║
║      Symbol: )))·        "First light, first signal."            ║
║      Trigger: any log event before sunrise                       ║
║                                                                  ║
║  [?] SOLSTICE           Check in on June 21 or Dec 21            ║
║      Symbol: ○─○         "The sun paused. You were there."       ║
║      Trigger: any event on solar solstice date                   ║
║                                                                  ║
║  [?] EQUINOX KEEPER     Check in on March 20 or Sept 22          ║
║      Symbol: ≈═≈         "Balance point. Day equals night."      ║
║      Trigger: any event on equinox date                          ║
║                                                                  ║
║  [?] FRIDAY RITUAL      Check in 4 consecutive Fridays           ║
║      Symbol: ▪·▪         "The weekly ritual holds."              ║
║      Trigger: streak of 4 Friday events                          ║
║                                                                  ║
║  [?] PALINDROME DAY     Check in on palindrome date              ║
║      Symbol: ═·═         "Mirror day. Time reverses."            ║
║      Trigger: date reads same forwards/backwards (02/02/2022)    ║
║                                                                  ║
║  [?] NEW YEAR ORACLE    Check in on Jan 1 before 06:00           ║
║      Symbol: ◉→          "Year opens. You were first."           ║
║      Trigger: event logged before 6am on January 1               ║
║                                                                  ║
║  [?] BIRTHDAY SIGNAL    Check in on user birthday                ║
║      Symbol: ★·★         "Signal sent. Another orbit complete."  ║
║      Trigger: event on user-set birth date                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝"""
    add(pre(eggs_art, S['mono_amber']))
    add(sp(4))

    add(P('B. BEHAVIORAL SECRET BADGES', 'subsection'))
    behav_art = """\
╔══════════════════════════════════════════════════════════════════╗
║                 BEHAVIORAL EASTER EGGS                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  [?] SILENT HOUR        No interaction 24h, then return          ║
║      Symbol: ─○─         "You rested. Good."                     ║
║      Trigger: gap_hours >= 24 followed by any event              ║
║                                                                  ║
║  [?] THE VOID           Answer memory question at exact midnight  ║
║      Symbol: ◉            "You answered in the dark."            ║
║      Trigger: memory_answer timestamp == 00:00 (within 60s)      ║
║                                                                  ║
║  [?] FIRST SNOW / RAIN  Check in day weather changes             ║
║      Symbol: ∿∿           "You noted the weather turning."       ║
║      Trigger: weather_update shows precipitation change          ║
║                                                                  ║
║  [?] 100% DAY           Complete all daily quests in one day     ║
║      Symbol: ╔●╗          "Perfect day transmission."            ║
║      Trigger: all 4 daily quests done same calendar day          ║
║                                                                  ║
║  [?] QUANTUM BURST      Answer 7+ memory Qs in one session       ║
║      Symbol: ✦✦✦          "Quantum coherence achieved."          ║
║      Trigger: 7 memory_answer events within 60-minute window     ║
║                                                                  ║
║  [?] DEEP WORK CASCADE  Log 5+ events in 2 hours                 ║
║      Symbol: ≋≋≋→         "Deep work cascade detected."          ║
║      Trigger: 5+ any events within 2h without breaks             ║
║                                                                  ║
║  [?] COMEBACK KID       Return after 7+ day gap                  ║
║      Symbol: ∘→≈          "You left. You returned. Respect."     ║
║      Trigger: last_event > 7 days ago, new event fires           ║
║                                                                  ║
║  [?] CONSISTENT HOUR    Same hour 5 days in a row                ║
║      Symbol: ─◉─          "Your rhythm locked. Circadian anchor."║
║      Trigger: events within same 1h window 5 consecutive days    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝"""
    add(pre(behav_art, S['mono_amber']))
    add(PageBreak())

    # ── IX. WORD TURN EASTER EGGS ─────────────────────────────────────────────
    add(P('IX.  WORD TURN EASTER EGGS', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'When specific words or phrases appear in journal entries or memory answers, '
        'secret events trigger. These are "word turns" — language as gameplay. '
        'The system listens to what you write and responds with transmissions.',
        'body'))
    add(sp(3))

    add(P('A. CORE WORD TURNS  ·  Original Set', 'subsection'))
    wt1 = """\
  Word / Phrase Detected       Badge Name              Symbol   Rarity
  ──────────────────────────────────────────────────────────────────────
  "ritual"                  →  Ritual Keeper           ~·~      Uncommon
  "breathe" / "breathing"   →  Breath Anchor           ≈·       Uncommon
  "grateful" / "gratitude"  →  Gratitude Node          ∘·∘      Uncommon
  "ocean" / "water"         →  Aquatic Resonance        ≋○≋     Rare
  "stars" / "cosmos"        →  Stargazer               ✦·✦      Rare
  "home"                    →  Grounded Signal         —○—      Uncommon
  "dream" / "dreaming"      →  Dream Log               ◇·◇      Uncommon
  "pain" / "difficult"      →  Courage Pulse           ▲·       Rare
  "love" / "heart"          →  Heart Signal            ♡·♡      Uncommon
  "silence" / "quiet"       →  The Quiet               ─·─      Rare
  "future" / "tomorrow"     →  Horizon Seeker          →·→      Uncommon
  "LOT" (in answer text)    →  Meta-Signal             ◉·◉      MYTHIC"""
    add(pre(wt1, S['mono']))
    add(sp(3))

    add(P('B. EXPANDED WORD TURNS  ·  v6 New Set', 'subsection'))
    wt2 = """\
  Word / Phrase Detected       Badge Name              Symbol   Rarity
  ──────────────────────────────────────────────────────────────────────
  "chaos" / "entropy"      →   Entropy Handler         ~≋~      Rare
  "growth" / "growing"     →   Signal Amplifier        ↑·↑      Uncommon
  "rest" / "resting"       →   Recovery Arc            ─○─      Uncommon
  "alive" / "living"       →   Biofield Pulse          ≈○≈      Uncommon
  "tired" / "exhausted"    →   Depletion Signal        ·──·     Rare
  "morning" / "sunrise"    →   Circadian Anchor        )))·     Uncommon
  "night" / "dark"         →   Night Protocol          )))      Uncommon
  "code" / "program"       →   Source Code Active      01·10    Rare
  "system"                 →   System Awareness        ■·■      Rare
  "body"                   →   Biofield Map            ~·~      Uncommon
  "mind" / "mental"        →   Cognitive Signal        ◇·◇      Uncommon
  "soul" / "spirit"        →   Resonance Peak          ✦·       Rare
  "heal" / "healing"       →   Recovery Pulse          ≋∘       Uncommon
  "fear" / "anxious"       →   Courage Vector          ▲→       Rare
  "joy" / "happy"          →   Joy Transmission        ○·○      Uncommon
  "alone" / "lonely"       →   Signal Isolation        ─·─      Rare
  "together" / "connected" →   Network Node            ≈·≈      Uncommon
  "change" / "transform"   →   Metamorphosis           ∘→≈      Uncommon
  "time" / "temporal"      →   Temporal Awareness      →·→      Uncommon
  "memory" / "remember"    →   Deep Archive            ◆·◆      Rare"""
    add(pre(wt2, S['mono']))
    add(sp(3))

    # Meta-Signal special box
    meta_art = """\
  ╔═══════════════════════════════════════════════════╗
  ║              META-SIGNAL   [ MYTHIC ]             ║
  ╠═══════════════════════════════════════════════════╣
  ║                                                   ║
  ║   Symbol:   ◉·◉                                   ║
  ║   Trigger:  Write "LOT" in a memory answer        ║
  ║   Message:  "↳ You named the system. It noticed." ║
  ║   Rarity:   MYTHIC (hidden — undocumented in app) ║
  ║                                                   ║
  ║   Ultra-rare. The system watching itself watch you.║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝"""
    add(pre(meta_art, S['mono_amber']))
    add(PageBreak())

    # ── X. ARCADE BADGE GALLERY ────────────────────────────────────────────────
    add(P('X.  ARCADE BADGE GALLERY — ASCII ART COLLECTION', 'section'))
    add(hr(S))
    add(sp(2))
    add(P('Full badge art rendered in terminal ASCII style. These are the transmissions.', 'body'))
    add(sp(3))

    add(P('TIER 1 — COMMON', 'subsection'))
    t1 = """\
  ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
  │  FIRST BREATH        │   │  MIRROR GAZER         │   │  SIGNAL SENT         │
  │                      │   │                       │   │                      │
  │         ∘            │   │       ◇               │   │    ─ ─ ─ ─ ─ →       │
  │                      │   │      ◇◇◇              │   │                      │
  │  "Spring"            │   │  "Reflection Pool"    │   │  "Transmission"      │
  │  1st check-in        │   │  1st memory Q.        │   │  1st log entry       │
  └──────────────────────┘   └──────────────────────┘   └──────────────────────┘"""
    add(pre(t1, S['mono']))
    add(sp(2))

    add(P('TIER 2 — UNCOMMON', 'subsection'))
    t2 = """\
  ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
  │  WEEK WARRIOR        │   │  BRIDGE BUILDER       │   │  GENTLE WITH SELF    │
  │                      │   │                       │   │                      │
  │   ○  ○  ○            │   │   ├────────┤          │   │    ♦                 │
  │  ○    ○    ○         │   │   │        │          │   │   ♦ ♦                │
  │     ○  ○             │   │   └────────┘          │   │    ♦                 │
  │                      │   │                       │   │                      │
  │  "Rapids"            │   │  "Archway"            │   │  "Warm Bath"         │
  │  7-day streak        │   │  20 messages          │   │  10 self-care acts   │
  └──────────────────────┘   └──────────────────────┘   └──────────────────────┘"""
    add(pre(t2, S['mono']))
    add(sp(2))

    add(P('TIER 3 — RARE', 'subsection'))
    t3 = """\
  ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
  │  MOON CYCLE          │   │  DEEP DIVER           │   │  TRUTH SPEAKER       │
  │                      │   │                       │   │                      │
  │    ◐ → ◑            │   │   ≈ ≈ ≈ ≈             │   │   ▲▲▲▲▲             │
  │   ◌   →   ●          │   │     ≋ ≋               │   │   ▲   ▲             │
  │    ◑ → ◐            │   │       ≋                │   │   ▲▲▲▲▲             │
  │                      │   │                       │   │                      │
  │  "Tidal Cycle"       │   │  "Deep Water"         │   │  "Resonance Hall"    │
  │  30-day streak       │   │  50 answers           │   │  50 journal notes    │
  └──────────────────────┘   └──────────────────────┘   └──────────────────────┘"""
    add(pre(t3, S['mono']))
    add(sp(2))

    add(P('TIER 4 — EPIC', 'subsection'))
    t4 = """\
  ┌──────────────────────┐   ┌──────────────────────┐
  │  UNWAVERING          │   │  SELF SCHOLAR         │
  │                      │   │                       │
  │  ✦       ✦           │   │  ╔══════════╗         │
  │    ✦   ✦             │   │  ║ ARCHIVE  ║         │
  │      ✦               │   │  ║ ◆◆◆◆◆◆  ║         │
  │    ✦   ✦             │   │  ╚══════════╝         │
  │  ✦       ✦           │   │                       │
  │  "Constellation"     │   │  "Archive"            │
  │  100-day streak      │   │  100 answers          │
  └──────────────────────┘   └──────────────────────┘"""
    add(pre(t4, S['mono']))
    add(sp(2))

    add(P('TIER 5 — LEGENDARY &amp; MYTHIC', 'subsection'))
    t5 = """\
  ╔═════════════════════════════════════════════════╗
  ║                                                 ║
  ║           SOUL CARTOGRAPHER                     ║
  ║                                                 ║
  ║    ·  ·    ✦    ·  ·                           ║
  ║  ·           ✦✦✦           ·                   ║
  ║      ✦     ✦   ✦     ✦                         ║
  ║        ✦✦✦       ✦✦✦                           ║
  ║      ✦     ✦   ✦     ✦                         ║
  ║  ·           ✦✦✦           ·                   ║
  ║    ·  ·    ✦    ·  ·                           ║
  ║                                                 ║
  ║            "Cartography"                        ║
  ║         250 memory answers                      ║
  ║         RARITY: LEGENDARY                       ║
  ║                                                 ║
  ╚═════════════════════════════════════════════════╝

  ╔═════════════════════════════════════════════════╗
  ║                                                 ║
  ║              META-SIGNAL   ◉·◉                  ║
  ║                                                 ║
  ║   "You named the system. It noticed."           ║
  ║   Triggered by: writing "LOT" in an answer      ║
  ║   RARITY: MYTHIC (hidden)                       ║
  ║                                                 ║
  ╚═════════════════════════════════════════════════╝"""
    add(pre(t5, S['mono_amber']))
    add(PageBreak())

    # ── XI. OCEANIC MAYAN SYSTEM ──────────────────────────────────────────────
    add(P('XI.  THE OCEANIC MAYAN BADGE SYSTEM  [OPTION E]', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'The most fully realized badge style for the LOT visual language. '
        'Inspired by Mayan vigesimal counting, water cycles, and cosmic aesthetics. '
        'Recommended as the primary badge visual language.',
        'body'))
    add(sp(3))

    add(P('Milestone Symbols', 'subsection'))
    mayan_miles = """\
  Day 7     ○∿     Circle + Wave           "Wave patterns emerge. ○∿"
  Day 30    ○≈○    Circle-Wave-Circle      "Tides complete their cycle. ○≈○"
  Day 100   ≋○≋    DeepWave + Circle       "Ocean depth achieved. ≋○≋"
  Day 365   ╔═╗    Year Glyph              "The Long Count. ╔═╗" """
    add(pre(mayan_miles, S['mono_amber']))
    add(sp(3))

    add(P('Pattern Badges (Behavioral Unlocks)', 'subsection'))
    mayan_pat = """\
  ∿—∿   Wave-Bar-Wave        BALANCED      "Tides balance. ∿—∿"
  ≈○≈   Waves-Circle-Waves   FLOW          "Flowing with the ocean. ≈○≈"
  —○—   Bar-Circle-Bar       CONSISTENT    "Steady current. —○—"
  ○◐○   Moon Phases          REFLECTIVE    "Depth in reflection. ○◐○"
  ○∴○   Circle-Dots-Circle   EXPLORER      "Scattered drops return. ○∴○" """
    add(pre(mayan_pat, S['mono']))
    add(sp(3))

    add(P('Full Profile Display  ·  Day 127 Example', 'subsection'))
    profile_ex = """\
═══════════════════════════════════════════════════════════════

                        ALEX'S PROFILE

───────────────────────────────────────────────────────────────

Archetype:              The Explorer
Awareness Level:        Deepening (8.4/10)
Level:                  ≋○≋
Days of Practice:       127 days

───────────────────────────────────────────────────────────────

Core values:
    mindful ≋○≋ present ∿—∿ aware ≈○≈ grounded —○—
    authentic ○◐○ compassionate ○∴○

Emotional patterns:
    calm ≋○≋ reflective ∿—∿ intentional ≈○≈ open —○—

Behavioral traits:
    consistent ≋○≋ deliberate ∿—∿ present ≈○≈

═══════════════════════════════════════════════════════════════"""
    add(pre(profile_ex, S['mono_amber']))
    add(sp(3))

    add(P('Evolution Timeline', 'subsection'))
    evo = """\
  Day:   1    7    14   21   30   50   60   90  100  180  365
         │    │    │    │    │    │    │    │    │    │    │
  Water: ·    ∘    ∘    ∘    ≈    ≈    ≈    ≋    ≋    ≋≋   ≋≋≋
  Arch:  ·    ├─   ├─   ├─   ╞═╡  ╞═╡  ╞═╡  ║·║  ║·║  ║╞║  ╔═╗
         │    │    │    │    │    │    │    │    │    │    │
  XP:    1    ~7   ~14  ~21  ~30  ~50  ~60  ~90 ~100 ~180 ~365+
         │    │    │    │    │    │    │    │    │    │    │
  Stage: ·    ·    ·    ∘    ∘    ○    ○    ◯    ◯    ◯    ◉
         Boot Init Init Intg Intg Comp Comp Optm Optm Optm Trns"""
    add(pre(evo, S['mono']))
    add(PageBreak())

    # ── XII. BADGE UNLOCK NOTIFICATION ───────────────────────────────────────
    add(P('XII.  BADGE UNLOCK NOTIFICATION SYSTEM', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'When a badge is unlocked, the Memory Widget displays a timed message before the next question. '
        'Multiple badges queue in localStorage. Each transmission fades after 5 seconds.',
        'body'))
    add(sp(3))

    notif = """\
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │  Memory:                                         │
  │                                                  │
  │  ┌────────────────────────────────────────────┐  │
  │  │                                            │  │
  │  │   ↳ Deep currents established  ≋           │  │
  │  │                                            │  │
  │  └────────────────────────────────────────────┘  │
  │                                                  │
  │                          [5 second fade-out]     │
  └──────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │  Memory:                                         │
  │                                                  │
  │  ┌────────────────────────────────────────────┐  │
  │  │                                            │  │
  │  │   ↳ Ocean depth achieved  ≋○≋              │  │
  │  │                                            │  │
  │  └────────────────────────────────────────────┘  │
  │                                                  │
  └──────────────────────────────────────────────────┘"""
    add(pre(notif, S['mono']))
    add(sp(3))

    add(P('Unlock Message Templates by Badge Type', 'subsection'))
    msgs = """\
  WATER MILESTONES:
    Day 7   →  "↳ First drops form ∘"
    Day 30  →  "↳ Waves begin to flow ≈"
    Day 100 →  "↳ Deep currents established ≋"
    Day 365 →  "↳ A year of presence. The architecture stands. ╔═╗"

  ACHIEVEMENTS:
    First Breath      →  "↳ Your first signal. The system wakes. ∘"
    Week Warrior      →  "↳ 7 days. Momentum builds. ≈"
    Moon Cycle        →  "↳ You orbit the ritual. ≈"
    Unwavering        →  "↳ 100 days. Fixed point in the sky. ✦"
    Soul Cartographer →  "↳ 250 questions. The territory is mapped. ✦"

  EASTER EGGS:
    Night Owl         →  "↳ The owl sees in the dark. )))"
    Early Bird        →  "↳ First light, first signal. )))·"
    Solstice          →  "↳ The sun paused. You were there. ○─○"
    Meta-Signal       →  "↳ You named the system. It noticed. ◉·◉"
    Comeback Kid      →  "↳ You left. You returned. Respect. ∘→≈"

  WORD TURNS:
    ritual            →  "↳ Ritual Keeper activated. ~·~"
    breathing         →  "↳ Breath Anchor engaged. ≈·"
    gratitude         →  "↳ Gratitude Node live. ∘·∘"
    ocean / water     →  "↳ Aquatic Resonance. ≋○≋"
    stars / cosmos    →  "↳ Stargazer signal. ✦·✦" """
    add(pre(msgs, S['mono_amber']))
    add(PageBreak())

    # ── XIII. COMPLETE RARITY TABLE ───────────────────────────────────────────
    add(P('XIII.  COMPLETE RARITY TABLE', 'section'))
    add(hr(S))
    add(sp(2))

    rarity_data = [
        ['Rarity', 'ASCII', 'Hex', 'Frequency', 'Example Badges'],
        ['COMMON',    '·',   '#cccccc', 'First acts',   'First Breath, Mirror Gazer, Signal Sent'],
        ['UNCOMMON',  '○',   '#00aa88', 'Days 1-14',    'Week Warrior, Community Voice, Heart Tender'],
        ['RARE',      '◐',   '#4488ff', 'Days 30+',     'Moon Cycle, Deep Diver, Truth Speaker'],
        ['EPIC',      '◆',   '#cc44ff', 'Days 100+',    'Unwavering, Self Scholar'],
        ['LEGENDARY', '✦',   '#ffd700', 'Days 365+',    'The Long Count, Soul Cartographer'],
        ['MYTHIC',    '◉',   '#ff4444', 'Hidden only',  'Meta-Signal, Decade Protocol'],
    ]
    rt = Table(rarity_data, colWidths=[28*mm, 12*mm, 20*mm, 25*mm, 80*mm])
    rt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DIM_GREEN),
        ('TEXTCOLOR', (0,0), (-1,0), GREEN),
        ('FONTNAME', (0,0), (-1,0), 'Courier-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 7.5),
        ('FONTNAME', (0,1), (-1,-1), 'Courier'),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('TEXTCOLOR', (0,1), (0,1), GREY),
        ('TEXTCOLOR', (0,2), (0,2), TEAL),
        ('TEXTCOLOR', (0,3), (0,3), BLUE),
        ('TEXTCOLOR', (0,4), (0,4), MAGENTA),
        ('TEXTCOLOR', (0,5), (0,5), GOLD),
        ('TEXTCOLOR', (0,6), (0,6), RED),
        ('TEXTCOLOR', (1,1), (1,1), GREY),
        ('TEXTCOLOR', (1,2), (1,2), TEAL),
        ('TEXTCOLOR', (1,3), (1,3), BLUE),
        ('TEXTCOLOR', (1,4), (1,4), MAGENTA),
        ('TEXTCOLOR', (1,5), (1,5), GOLD),
        ('TEXTCOLOR', (1,6), (1,6), RED),
        ('TEXTCOLOR', (2,1), (-1,-1), WHITE),
        ('FONTNAME', (0,1), (1,-1), 'Courier-Bold'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [MID_GREY, DARK_GREY]),
        ('GRID', (0,0), (-1,-1), 0.3, GREEN),
        ('ALIGN', (0,0), (2,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    add(rt)
    add(sp(4))

    # ── XIV. QOS INTEGRATION ──────────────────────────────────────────────────
    add(P('XIV.  QOS INTEGRATION — QUANTUM OPERATING SYSTEM', 'section'))
    add(hr(S))
    add(sp(2))
    add(P(
        'Badge progression feeds directly into the Quantum Operating System (QOS). '
        'The QOS synthesizes all badge signals into a live system state. '
        'Achievements unlock QOS mode transitions and alter system behavior.',
        'body'))
    add(sp(3))

    qos_art = """\
  QOS OPERATING MODES — Badge Influence

  Mode: MAINTENANCE  (Low signal density)
    → Badges: None yet or gap detected
    → System: Conserve. Idle cadence. Push gentle reminders.
    → Badge triggers: SILENT HOUR (─○─) becomes available

  Mode: RECOVERY  (Depletion / overwhelm detected)
    → Badges: Pattern 58 (selfcare-saturation) fired
    → System: Repair first. Other tasks pause.
    → Badge triggers: COMEBACK KID (∘→≈) becomes available

  Mode: GROWTH  (Steady positive engagement)
    → Badges: Weekly/Monthly milestones active
    → System: Expand. Absorb more. Unlock new quest types.
    → Badge triggers: CONSISTENT HOUR (─◉─) becomes available

  Mode: PEAK  (High energy + clarity + intention)
    → Badges: Epic/Legendary tier unlocking
    → System: Optimal. Full commitment.
    → Badge triggers: QUANTUM BURST (✦✦✦) becomes available

  QOS METRICS (0-100 each):
    Biofield Capacity    — signal density vs depletion events
    Cognitive Load       — memory/journal interactions in last 24h
    Intention Resolution — active intention × planner alignment
    System Pressure      — low / moderate / high / critical"""
    add(pre(qos_art, S['mono']))
    add(PageBreak())

    # ── XV. IMPLEMENTATION STATUS ─────────────────────────────────────────────
    add(P('XV.  IMPLEMENTATION STATUS — v6.0', 'section'))
    add(hr(S))
    add(sp(2))

    add(P('Currently Live', 'subsection'))
    live = """\
  [✓] badges.ts               Core badge types, award logic, localStorage
  [✓] BadgeUnlockFeed          Community unlock activity
  [✓] GrowthMilestones         Personal + community growth display
  [✓] EvolutionWidget          CQGS stage + achievements counter
  [✓] MemoryWidget             Badge unlock notification on question display
  [✓] rpg-narrative.ts         Full achievement registry + story arcs
  [✓] PublicProfile            Level field display (Water or Architecture)
  [✓] Log handlers (41)        BADGE: event + AUTH: + ENV: + UI: + all others
  [✓] QIE Patterns (58)        Includes circadian-anchor, intention-completion-arc
  [✓] Background Jobs (7)      weekly-intention-completion-audit added
  [✓] Self-Assembly Reports    SESSION_REPORTS v42 current"""
    add(pre(live, S['mono']))
    add(sp(3))

    add(P('In Design / Roadmap', 'subsection'))
    roadmap = """\
  [○] Extended milestones (Day 14, 21, 50, 60, 90, 180, 365)
  [○] Pattern badges (Balanced, Flow, Consistent, Reflective, Explorer)
  [○] Easter egg detection engine (word turns, time-based triggers)
  [○] Oceanic Mayan badge visual language (Option E — full impl)
  [○] Quest tracker UI component
  [○] Badge collection gallery view
  [○] Secret / hidden badge discovery system
  [○] Word turn scanner in journal/memory answer pipeline
  [○] QOS mode → badge trigger integration
  [○] Pattern 59: longitudinal-drift (UserIndex decline 3+ weeks)
  [○] Field Manual v42 sync (58 patterns, 41 handlers, 7 jobs)
  [○] Badge PDF auto-generation on new badge design commit"""
    add(pre(roadmap, S['mono_amber']))
    add(sp(4))

    # ── XVI. UNICODE REFERENCE ────────────────────────────────────────────────
    add(P('XVI.  UNICODE REFERENCE', 'section'))
    add(hr(S))
    add(sp(2))
    add(P('All LOT badge symbols are standard Unicode with 100% browser support.', 'body'))
    add(sp(2))

    unicode_ref = """\
  Symbol  Unicode    Name                    Use
  ────────────────────────────────────────────────────────────────
  ∘       U+2218     Ring Operator           Water Day 7
  ≈       U+2248     Almost Equal To         Water Day 30
  ≋       U+224B     Triple Tilde            Water Day 100
  ├─      U+251C/─   Box Drawing             Arch Day 7
  ╞═╡     U+255E/═/╡ Box Drawing             Arch Day 30
  ║·║     U+2551/·/║ Box Drawing             Arch Day 100
  ╔═╗     U+2554/═/╗ Box Drawing             Year One
  ○       U+25CB     White Circle            Oceanic center
  ∿       U+223F     Sine Wave               Oceanic wave
  ◐       U+25D0     Circle Left Half        Moon phase
  ∴       U+2234     Therefore               Dots pattern
  ✦       U+2726     Black Four Pointed Star Epic/Legendary
  ◉       U+25C9     Fisheye                 Mythic
  ♡       U+2661     White Heart Suit        Romance badges
  ♦       U+2666     Black Diamond Suit      Care badges
  ▲       U+25B2     Black Up-Pointing Tri.  Courage badges
  ·       U+00B7     Middle Dot              Separator
  →       U+2192     Rightwards Arrow        Progression
  ↳       U+21B3     Downwards Arrow Right   Sub-indicator
  )))     U+0029×3   Parentheses             Night Owl / Early Bird
  ═·═     U+2550/·   Double Horizontal       Palindrome Day badge"""
    add(pre(unicode_ref, S['mono']))
    add(PageBreak())

    # ── XVII. COMPLETE SYSTEM SUMMARY ────────────────────────────────────────
    add(P('XVII.  COMPLETE SYSTEM SUMMARY', 'section'))
    add(hr(S))
    add(sp(2))

    summary_art = """\
╔══════════════════════════════════════════════════════════════════╗
║           LOT BADGE & ACHIEVEMENT SYSTEM — v6.0                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  BADGE PATHS                                                     ║
║    · Water Path:        ∘ → ≈ → ≋  (7/30/100 days)             ║
║    · Architecture Path: ├─ → ╞═╡ → ║·║ (7/30/100 days)        ║
║    · Oceanic Mayan:     ○∿ → ○≈○ → ≋○≋ (Option E)             ║
║                                                                  ║
║  ACHIEVEMENTS (18+)                                              ║
║    · Exploration:  First Breath, Mirror Gazer, Signal Sent       ║
║    · Consistency:  Week Warrior → Moon Cycle → Unwavering        ║
║    · Depth:        Deep Diver → Self Scholar → Soul Cartographer ║
║    · Connection:   Community Voice, Bridge Builder               ║
║    · Care:         Gentle With Self                              ║
║    · Courage:      Truth Speaker                                 ║
║    · Romance:      Heart Tender, Intimacy Keeper                 ║
║                                                                  ║
║  EASTER EGGS (16+)                                               ║
║    · Time-Based:   Night Owl, Early Bird, Solstice, Equinox...   ║
║    · Behavioral:   Silent Hour, The Void, 100% Day, Comeback...  ║
║    · MYTHIC:       Meta-Signal (write "LOT" in answer)           ║
║                                                                  ║
║  WORD TURNS (32+)                                                ║
║    · Core Set:     ritual, breathe, grateful, ocean, stars...    ║
║    · Expanded:     chaos, growth, code, system, heal, fear...    ║
║                                                                  ║
║  QUEST TYPES (4)                                                 ║
║    · Daily / Weekly / Growth / Mastery                           ║
║                                                                  ║
║  RARITIES (6)                                                    ║
║    · Common · Uncommon · Rare · Epic · Legendary · Mythic        ║
║                                                                  ║
║  CQGS EVOLUTION STAGES (6)                                       ║
║    · · (Boot) → · (Init) → ∘ (Intg) → ○ (Comp) → ◯(Opt) → ◉  ║
║                                                                  ║
║  RPG CHAPTERS (5)                                                ║
║    · Awakening → Exploration → Integration → Mastery → Sage      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝"""
    add(pre(summary_art, S['mono_amber']))
    add(sp(4))

    add(P('"Self-care is not a quest you complete. It is a world you build."', 'quote'))
    add(sp(2))

    footer_art = """\
     ∘ → ≈ → ≋
     ├─ → ╞═╡ → ║·║

  [ LOT SYSTEMS ]  ·  lot-systems.com
  © 2025-2026 LOT Systems. All rights reserved.

          [ PRESS START ]"""
    add(pre(footer_art, S['center_green']))

    # ── BUILD ─────────────────────────────────────────────────────────────────
    doc.build(story)
    print(f'[OK] PDF generated: {out}')
    return out


if __name__ == '__main__':
    build_doc()
