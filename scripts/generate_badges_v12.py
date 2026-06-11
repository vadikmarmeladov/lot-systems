#!/usr/bin/env python3
"""
LOT SYSTEMS CORPORATION
LOT® Badges & Achievements Master Codex v12 — PDF Generator
Author: Vadik Marmeladov
v12 — June 2026 — +35 new badges (156 total)
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# ── PALETTE ──────────────────────────────────────────────────────────────────
BG        = colors.HexColor('#0a0a0f')
FG        = colors.HexColor('#e8e8f0')
ACCENT    = colors.HexColor('#4488cc')
GOLD      = colors.HexColor('#ffcc44')
MYTHIC    = colors.HexColor('#ff6644')
LEGENDARY = colors.HexColor('#ffcc44')
EPIC      = colors.HexColor('#cc88ee')
RARE      = colors.HexColor('#8888ee')
UNCOMMON  = colors.HexColor('#88cc88')
COMMON    = colors.HexColor('#aaaaaa')
ULTRARARE = colors.HexColor('#ff44ff')
COSMIC    = colors.HexColor('#ffffff')
DIM       = colors.HexColor('#555566')
WHITE     = colors.HexColor('#ffffff')
PANEL     = colors.HexColor('#111122')
BORDER    = colors.HexColor('#223355')
SCIFI     = colors.HexColor('#44ccee')
LORE      = colors.HexColor('#ee8844')

PAGE_W, PAGE_H = A4

OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__),
    '../docs/badges/pdf/LOT-BADGES-ACHIEVEMENTS-MASTER-CODEX-v12.pdf'
)


def build_styles():
    base = getSampleStyleSheet()

    def s(name, parent='Normal', **kw):
        return ParagraphStyle(name, parent=base[parent], **kw)

    return {
        'title': s('TitleV12', fontSize=22, textColor=GOLD, alignment=TA_CENTER,
                   spaceAfter=2, fontName='Courier-Bold'),
        'subtitle': s('SubtitleV12', fontSize=11, textColor=ACCENT, alignment=TA_CENTER,
                      spaceAfter=1, fontName='Courier'),
        'meta': s('MetaV12', fontSize=8, textColor=DIM, alignment=TA_CENTER,
                  spaceAfter=6, fontName='Courier'),
        'h1': s('H1V12', fontSize=13, textColor=GOLD, spaceBefore=10, spaceAfter=4,
                fontName='Courier-Bold'),
        'h2': s('H2V12', fontSize=11, textColor=ACCENT, spaceBefore=8, spaceAfter=3,
                fontName='Courier-Bold'),
        'h3': s('H3V12', fontSize=9, textColor=UNCOMMON, spaceBefore=5, spaceAfter=2,
                fontName='Courier-Bold'),
        'h3_scifi': s('H3SciFi', fontSize=9, textColor=SCIFI, spaceBefore=5, spaceAfter=2,
                      fontName='Courier-Bold'),
        'h3_lore': s('H3Lore', fontSize=9, textColor=LORE, spaceBefore=5, spaceAfter=2,
                     fontName='Courier-Bold'),
        'body': s('BodyV12', fontSize=8, textColor=FG, fontName='Courier',
                  spaceAfter=2, leading=12),
        'body_italic': s('BodyItalic', fontSize=8, textColor=DIM, fontName='Courier-Oblique',
                         spaceAfter=2, leading=12),
        'code': s('CodeV12', fontSize=7.5, textColor=FG, fontName='Courier',
                  spaceAfter=1, leading=11, backColor=PANEL, borderPadding=4),
        'quote': s('QuoteV12', fontSize=9, textColor=ACCENT,
                   fontName='Courier-BoldOblique', alignment=TA_CENTER,
                   spaceBefore=4, spaceAfter=4),
        'quote_lore': s('QuoteLore', fontSize=9, textColor=LORE,
                        fontName='Courier-BoldOblique', alignment=TA_CENTER,
                        spaceBefore=4, spaceAfter=4),
        'footer': s('FooterV12', fontSize=7, textColor=DIM, alignment=TA_CENTER,
                    fontName='Courier'),
        'new_badge': s('NewBadge', fontSize=7, textColor=SCIFI, alignment=TA_CENTER,
                       fontName='Courier-Bold', spaceBefore=1, spaceAfter=1),
    }


def hr(color=BORDER, thickness=0.5):
    return HRFlowable(width='100%', thickness=thickness, color=color,
                      spaceBefore=3, spaceAfter=3)


def section(story, styles, title, color=None):
    story.append(Spacer(1, 4*mm))
    story.append(hr(ACCENT if color is None else color, 1))
    story.append(Paragraph(title, styles['h1']))
    story.append(hr(BORDER, 0.5))


def badge_table(data, col_widths, rarity_col=None):
    rarity_colors = {
        'Common': COMMON, 'Uncommon': UNCOMMON, 'Rare': RARE,
        'Epic': EPIC, 'Legendary': LEGENDARY, 'Mythic': MYTHIC,
        'Ultra-Rare': ULTRARARE, 'Cosmic': COSMIC,
    }
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), PANEL),
        ('TEXTCOLOR', (0, 0), (-1, 0), ACCENT),
        ('FONTNAME', (0, 0), (-1, -1), 'Courier'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('FONTNAME', (0, 0), (-1, 0), 'Courier-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.3, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [BG, PANEL]),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('TEXTCOLOR', (0, 1), (-1, -1), FG),
    ]
    if rarity_col is not None:
        for row_idx, row in enumerate(data[1:], start=1):
            if len(row) > rarity_col:
                rarity = str(row[rarity_col])
                c = rarity_colors.get(rarity, FG)
                style.append(('TEXTCOLOR', (rarity_col, row_idx),
                               (rarity_col, row_idx), c))
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle(style))
    return t


def new_badge_banner(story, styles, text='★ NEW IN v12 ★'):
    story.append(Paragraph(text, styles['new_badge']))


def build_pdf():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=15*mm, rightMargin=15*mm,
        topMargin=15*mm, bottomMargin=15*mm,
        title='LOT Badges & Achievements Master Codex v12',
        author='Vadik Marmeladov — LOT Systems',
    )

    styles = build_styles()
    story = []

    # ── COVER PAGE ─────────────────────────────────────────────────────────────
    story.append(Spacer(1, 8*mm))
    story.append(hr(GOLD, 2))
    story.append(Spacer(1, 3*mm))

    for line in [
        'L · O · T   S Y S T E M S',
        'BADGES & ACHIEVEMENTS',
        'MASTER CODEX  v12',
    ]:
        story.append(Paragraph(line, styles['title']))

    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        'RPG · ARCADE · SCI-FI BOOKS · COMPUTER · SELF-CARE',
        styles['subtitle']
    ))
    story.append(Paragraph(
        f'June 2026 Edition  |  © 2025–2026 LOT Systems  |  brand.lot-systems.com',
        styles['meta']
    ))
    story.append(Paragraph(
        '+35 NEW BADGES  |  156 TOTAL  |  48 WORD TURN TRIGGERS',
        styles['new_badge']
    ))
    story.append(Spacer(1, 2*mm))
    story.append(hr(GOLD, 2))
    story.append(Spacer(1, 4*mm))

    story.append(Paragraph(
        '"The archive does not judge. It witnesses. '
        'Every entry is a move. Every move writes you."',
        styles['quote']
    ))

    # ── DELTA TABLE ────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('DELTA v11 → v12', styles['h2']))
    delta_data = [
        ['Addition', 'Count', 'Detail'],
        ['Word Turn v3 (Sci-Fi Books)',     '+10', 'dune/spice, 42, matrix, neuromancer, asimov, android, solaris, hyperion, 1984'],
        ['Arcade Easter Eggs v3',           ' +8', 'konami_code, sunday_boss, first_monday, multiscreen, insert_coin, high_score, save_state, extra_life'],
        ['Word Turn v4 (Computer Science)', ' +8', 'algorithm, recursion, debug, compile, overflow, binary, cache, entropy'],
        ['Behavioral Easter Eggs v2',       ' +4', 'clockwork, precision_protocol, upgrade_sequence, new_year_boot'],
        ['LOT Mythology Lore',              ' +5', 'origin_story, april_protocol, genesis_block, corporation_log, cosmo_echo'],
        ['v11 TOTAL',                       '121', '—'],
        ['v12 TOTAL',                       '156', '35 new · 156 total · 127 hidden'],
    ]
    col_w = [68*mm, 18*mm, 94*mm]
    t = badge_table(delta_data, col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, -2), (-1, -2), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, -2), (-1, -2), DIM),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, -1), (-1, -1), GOLD),
        ('FONTNAME', (0, -1), (-1, -1), 'Courier-Bold'),
    ]))
    story.append(t)

    # ── BADGE INVENTORY ────────────────────────────────────────────────────────
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('BADGE INVENTORY — COMPLETE ACCOUNTING v12', styles['h2']))
    inv_data = [
        ['Category', 'Count', 'Notes'],
        ['Milestone (Core)',                  ' 3', 'Day 7, 30, 100'],
        ['Milestone (Extended)',              ' 7', 'Day 14/21/50/60/90/180/365'],
        ['Easter Egg — Time v1+v2',           ' 8', 'night/dawn/mirror/pi/404am/sequence/lot_hour'],
        ['Easter Egg — Calendar',             ' 8', 'Solstice, Equinox, Birthday, Pi Day…'],
        ['Easter Egg — Behavioral v1',        ' 5', 'silent/ghost/anniversary/overclock/perfect'],
        ['Easter Egg — Behavioral v2 ★',      ' 4', 'clockwork/precision/upgrade_seq/new_yr_boot'],
        ['Easter Egg — Arcade v3 ★',          ' 8', 'konami/sunday_boss/multiscreen/insert_coin…'],
        ['Word Turn v1 (Emotional)',           '12', 'ritual/breathe/grateful/ocean/stars/home…'],
        ['Word Turn v2 (Sci-Fi Tech)',         '18', 'reboot/404/glitch/COSMO/quantum/neural…'],
        ['Word Turn v3 (Sci-Fi Books) ★',     '10', 'dune/42/matrix/neuromancer/asimov/solaris…'],
        ['Word Turn v4 (Computer Sci.) ★',    ' 8', 'algorithm/recursion/debug/compile/entropy…'],
        ['Pattern (Oceanic Mayan)',            ' 5', 'balanced/flow/consistent/reflective/explorer'],
        ['Achievement (RPG Layer)',            '16', 'First Breath/Long Count/Soul Cartographer…'],
        ['Mastery Tier (Sci-Fi Arcade)',       ' 5', 'quantum_leap/speedrun/system_op/cmdr_data…'],
        ['LOT Mythology Lore ★',              ' 5', 'origin_story/april/genesis_block/corp_log…'],
        ['Secret Boss',                        ' 7', 'meta-signal/cosmic-twin/the-infinite…'],
        ['TOTAL',                             '156', '127 hidden · 29 visible · ★ = new in v12'],
    ]
    col_w = [80*mm, 14*mm, 86*mm]
    t = badge_table(inv_data, col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, -1), (-1, -1), GOLD),
        ('FONTNAME', (0, -1), (-1, -1), 'Courier-Bold'),
        ('TEXTCOLOR', (1, -1), (1, -1), GOLD),
    ]))
    story.append(t)

    # ── PART I — MILESTONE BADGES ──────────────────────────────────────────────
    section(story, styles, 'PART I — MILESTONE BADGES (unchanged from v11)')

    story.append(Paragraph('I.A — Core Milestones', styles['h2']))
    core_data = [
        ['Day', 'Water', 'Architecture', 'Name', 'Rarity', 'Message'],
        ['7',   '∘',    '├─',           'Droplet / Foundation',   'Common',    'First drops form ∘'],
        ['30',  '≈',    '╞═╡',          'Wave / Structure',        'Uncommon',  'Waves begin to flow ≈'],
        ['100', '≋',    '║·║',          'Current / Architecture',  'Epic',      'Deep currents established ≋'],
    ]
    story.append(badge_table(core_data, [14*mm,14*mm,22*mm,48*mm,22*mm,60*mm], rarity_col=4))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('I.B — Extended Milestones', styles['h2']))
    ext_data = [
        ['Day', 'Water', 'Architecture', 'Name', 'Rarity'],
        ['7',   '∘',    '├─',    'Droplet / Foundation',         'Common'],
        ['14',  '∘∘',   '├┼',    'Twin Drop / Two-week Pattern', 'Common'],
        ['21',  '∘≈',   '├═',    'Proto-Wave / 21-day Groove',   'Uncommon'],
        ['30',  '≈',    '╞═╡',   'Wave / Structure',             'Uncommon'],
        ['50',  '≈∘',   '╞══',   'Mid-Current / Mid-Structure',  'Rare'],
        ['60',  '≈≈',   '╞═══',  'Dual Wave / Master Frame',     'Rare'],
        ['90',  '≋∘',   '║═',    'Deep Reach / Inner Wall',      'Epic'],
        ['100', '≋',    '║·║',   'Current / Architecture',       'Epic'],
        ['180', '≋≋',   '║╞║',   'Voyager / Wing',               'Legendary'],
        ['365', '≋≋≋',  '╔═╗',   'The Long Count / Citadel',     'Legendary'],
    ]
    story.append(badge_table(ext_data, [14*mm,18*mm,22*mm,68*mm,58*mm], rarity_col=4))

    # ── PART II — EASTER EGG BADGES ───────────────────────────────────────────
    section(story, styles, 'PART II — EASTER EGG BADGES')

    story.append(Paragraph('II.A — Time-Based (v1 + v2 = 8 total)', styles['h2']))
    time_data = [
        ['ID', 'Symbol', 'Trigger', 'Rarity', 'Message'],
        ['night_owl',      '◉',   '01:00–04:00 AM check-in',        'Uncommon', 'Awake when the world slept.'],
        ['early_bird',     '∴',   '05:00–06:00 AM check-in',        'Uncommon', 'Dawn data. Before the noise.'],
        ['mirror_hour',    '⊡',   'Check-in at exactly 11:11',      'Epic',     'The mirror looks back. ⊡'],
        ['midnight_sigil', '◉',   'Answer memory Q at 00:00',       'Rare',     'You answered in the dark.'],
        ['pi_hour',        '∞∘',  'Check-in at 3:14 AM',            'Epic',     'Pi in the small hours. ∞∘'],
        ['error_hour',     '□·□', 'Check-in at 4:04 AM',            'Rare',     '404 AM — you were found.'],
        ['sequence_time',  '→∘→', 'Check-in at 12:34',              'Uncommon', 'Sequential time. In order.'],
        ['lot_hour',       '≋◉',  'Check-in at 04:07 (LOT founding)','Rare',    'The founding hour. ≋◉'],
    ]
    story.append(badge_table(time_data, [28*mm,14*mm,52*mm,22*mm,64*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('II.B — Calendar Easter Eggs (8 total)', styles['h2']))
    cal_data = [
        ['ID', 'Symbol', 'Trigger', 'Rarity', 'Message'],
        ['solstice',       '❋',   'June 21 or December 21',             'Rare',     'The sun paused. ❋'],
        ['equinox',        '○',   'March 20 or September 22',           'Rare',     'Balance at the edge. ○'],
        ['lot_birthday',   '◉',   'April 7 — LOT founding day',         'Rare',     'System founded 7 April 2016.'],
        ['new_year_sage',  '⊛',   'January 1st',                        'Rare',     'The new cycle begins. ⊛'],
        ['pi_day',         '∞',   'March 14 (3.14)',                     'Epic',     'Infinite precision. ∞'],
        ['palindrome_day', '◈',   'Any palindrome date',                 'Epic',     'Reads itself backwards. ◈'],
        ['full_moon',      '☽',   'Calendar full moon night',            'Rare',     'The tide turns. ☽'],
        ['friday_ritual',  '▪·▪', 'Four consecutive Fridays',            'Uncommon', 'Weekly ritual holds. ▪·▪'],
    ]
    story.append(badge_table(cal_data, [28*mm,14*mm,52*mm,22*mm,64*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('II.C — Behavioral Easter Eggs v1 (5 total)', styles['h2']))
    behav_data = [
        ['ID', 'Symbol', 'Trigger', 'Rarity', 'Message'],
        ['silent_hour',    '─○─', '24h absence then return',       'Uncommon', 'You rested. Space held.'],
        ['ghost_protocol', '░░░', '7-day absence then return',     'Rare',     'Ghost Protocol lifted.'],
        ['anniversary',    '≋',   'Account signup anniversary',    'Rare',     'Another year in archive.'],
        ['overclock',      '▒▒▒', '20+ activities in one day',     'Epic',     'OVERCLOCK DETECTED. ▒▒▒'],
        ['perfect_day',    '✦·✦', 'All 7 CQGS modules in one day', 'Legendary','All systems aligned. ✦·✦'],
    ]
    story.append(badge_table(behav_data, [28*mm,14*mm,52*mm,22*mm,64*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    new_badge_banner(story, styles, '★ NEW IN v12: BEHAVIORAL EASTER EGGS v2 ★')
    story.append(Paragraph('II.D — Behavioral Easter Eggs v2 — 4 NEW BADGES', styles['h3']))
    behav2_data = [
        ['ID', 'Symbol', 'Trigger', 'Rarity', 'Message'],
        ['clockwork',       '⊡·⊡',  '30 daily check-ins within ±15 min same time', 'Rare',     '30 days, same hour. You are a clock that cares.'],
        ['precision',       '·—·—·','5 consecutive days: exactly 1 entry per day',  'Uncommon', 'Signal discipline: 1 per day, 5 days.'],
        ['upgrade_sequence','→◉→',  '7 consecutive emotional mood improvements',    'Rare',     'Seven improvements. Character upgraded. →◉→'],
        ['new_year_boot',   '⊛∘⊛',  'First check-in Jan 1–3',                      'Uncommon', 'First signal of the year. System reboots. ⊛∘⊛'],
    ]
    story.append(badge_table(behav2_data, [28*mm,14*mm,60*mm,22*mm,56*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    new_badge_banner(story, styles, '★ NEW IN v12: ARCADE EASTER EGGS v3 ★')
    story.append(Paragraph('II.E — Arcade Easter Eggs v3 — 8 NEW BADGES', styles['h3_scifi']))
    arcade_data = [
        ['ID', 'Symbol', 'Trigger', 'Rarity', 'Message'],
        ['konami_code',  '▲▲▼▼', '5 sad days then 5 happy days (emotional arc)',  'Epic',      'Up up down down. The pattern inverts. You win.'],
        ['sunday_boss',  '◉✦◉',  'All 7 CQGS modules on a Sunday',                'Legendary', 'Sunday completed. Boss defeated. All online.'],
        ['first_monday', '├─○',  'First ever Monday check-in',                    'Common',    'First Monday. Spawn point set. ├─○'],
        ['multiscreen',  '□○□',  'Check-in from 3+ distinct devices',             'Rare',      'Signal across three devices. Network active.'],
        ['insert_coin',  '■□■',  'Return after exactly 48-hour gap',              'Uncommon',  'Exact 48h gap detected. INSERT COIN. ■□■'],
        ['high_score',   '✦✦✦',  'Top 1% XP in a rolling week',                  'Epic',      'Top percentile this week. New record. ✦✦✦'],
        ['save_state',   '≋·▪',  '3+ journal entries in one week',               'Uncommon',  'State saved. Progress locked. ≋·▪'],
        ['extra_life',   '∘◉∘',  'Check-in on calendar birthday',                'Rare',      'Check-in on the day you were born. ∘◉∘'],
    ]
    story.append(badge_table(arcade_data, [26*mm,14*mm,60*mm,22*mm,58*mm], rarity_col=3))

    # ── PART III — WORD TURN ENGINE ────────────────────────────────────────────
    section(story, styles, 'PART III — WORD TURN ENGINE (48 Triggers Total)')

    story.append(Paragraph('III.A — v1: Original Emotional Triggers (12)', styles['h2']))
    wt_v1 = [
        ['Word / Phrase', 'Symbol', 'Badge Name', 'Rarity', 'Message'],
        ['"ritual"',      '≈·≈',   'Ritual Keeper',     'Uncommon', 'You named the practice. ≈·≈'],
        ['"breathe"',     '∿·∿',   'Breath Anchor',     'Uncommon', 'Anchor holds. ∿·∿'],
        ['"grateful"',    '○·○',   'Gratitude Node',    'Uncommon', 'Signal received. ○·○'],
        ['"ocean"',       '≋·∿',   'Aquatic Resonance', 'Uncommon', 'Oceanic resonance detected.'],
        ['"stars"',       '✦·✧',   'Stargazer',         'Uncommon', 'Signal from deep space. ✦·✧'],
        ['"home"',        '—○—',   'Grounded Signal',   'Uncommon', 'You are grounded. —○—'],
        ['"dream"',       '◐·◐',   'Dream Log',         'Uncommon', 'Dream now in archive. ◐·◐'],
        ['"pain"',        '▲·▲',   'Courage Pulse',     'Rare',     'Courage detected. ▲·▲'],
        ['"love"',        '♡·♡',   'Heart Signal',      'Uncommon', 'Heart signal received. ♡·♡'],
        ['"silence"',     '·—·',   'The Quiet',         'Uncommon', 'It is enough. ·—·'],
        ['"future"',      '→·→',   'Horizon Seeker',    'Uncommon', 'Valid coordinate logged. →·→'],
        ['"LOT"',         '◉·◉',   'Meta-Signal',       'Mythic',   'You named it. It noticed. ◉·◉'],
    ]
    story.append(badge_table(wt_v1, [28*mm,14*mm,32*mm,22*mm,84*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('III.B — v2: Sci-Fi Tech Triggers (18)', styles['h2']))
    wt_v2 = [
        ['Word / Phrase', 'Symbol', 'Badge Name', 'Rarity', 'Message'],
        ['"reboot"/"restart"',  '↺·↺', 'Reboot Sequence',   'Uncommon', 'System restart acknowledged.'],
        ['"404"',               '□□□',  '404: Not Lost',     'Uncommon', 'Error noted. You are found.'],
        ['"glitch"',            '▓░▓',  'Signal Glitch',     'Rare',     'Glitch logged. Pattern persists.'],
        ['"COSMO"',             '✦◉✦',  'Cosmic Twin',       'Ultra-Rare','The other system heard you.'],
        ['"quantum"',           '◈·◈',  'Quantum Observer',  'Rare',     'Waveform collapsed. ◈·◈'],
        ['"neural"',            '≋≈≋',  'Neural Architect',  'Rare',     'Pattern recognized. ≋≈≋'],
        ['"code"',              '┤·├',  'Code Witch',        'Uncommon', 'Coder and feeler meet.'],
        ['"sleep"/"rest"',      '∼∼∼',  'Recharge Mode',     'Uncommon', 'Power-down confirmed. ∼∼∼'],
        ['"coffee"/"tea"',      '■·■',  'Fuel Protocol',     'Uncommon', 'Chemical fuel logged. ■·■'],
        ['"music"',             '≈~≈',  'Frequency',         'Uncommon', 'Frequency locked. ≈~≈'],
        ['"run"/"walk"',        '→→→',  'Kinetic Protocol',  'Uncommon', 'Body in motion. →→→'],
        ['"sun"/"light"',       '○∘○',  'Solar Charge',      'Uncommon', 'Photon intake noted. ○∘○'],
        ['"fear"/"scared"',     '▪▪▪',  'Shadow Protocol',   'Rare',     'Fear named. Protocol active.'],
        ['"change"',            '≈→≋',  'Phase Shift',       'Rare',     'Transformation detected.'],
        ['"accept"/"let go"',   '○—○',  'Acceptance Node',   'Rare',     'Release logged. ○—○'],
        ['"now"/"moment"',      '·∘·',  'Present Moment',    'Uncommon', 'You are here. ·∘·'],
        ['"universe"/"cosmos"', '∞·∞',  'Cosmic Scale',      'Rare',     'You zoomed out. ∞·∞'],
        ['"alive"',             '∘·∘',  'Vital Signal',      'Uncommon', 'Life acknowledged. ∘·∘'],
    ]
    story.append(badge_table(wt_v2, [34*mm,14*mm,28*mm,22*mm,82*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    new_badge_banner(story, styles, '★ NEW IN v12: WORD TURN v3 — SCI-FI BOOKS ★')
    story.append(Paragraph('III.C — v3: Sci-Fi Book Triggers (10 NEW)', styles['h3_scifi']))
    wt_v3 = [
        ['Word / Phrase', 'Symbol', 'Badge Name', 'Rarity', 'Message'],
        ['"dune"/"spice"',         '≈▲≈', 'Spice Melange',     'Rare',     'The spice must flow. ≈▲≈'],
        ['"foundation"',           '◈─◈', 'Psychohistory',     'Rare',     'The math holds. ◈─◈'],
        ['"42"/"answer to all"',   '∞·42','Deep Thought',      'Epic',     'The answer was 42. ∞'],
        ['"matrix"/"simulation"',  '▓·▓', 'Red Pill',          'Rare',     'You chose to see. ▓·▓'],
        ['"neuromancer"/"cyber"',  '≋□≋', 'Cyberspace',        'Epic',     'Console cowboy. ≋□≋'],
        ['"robot"/"asimov"',       '─◉─', 'First Law',         'Uncommon', 'Do no harm first. ─◉─'],
        ['"android"/"electric"',   '♡·◉', 'Empathy Engine',    'Rare',     'Electric dream. ♡·◉'],
        ['"solaris"/"lem"',        '≋○≋', 'Ocean Mind',        'Epic',     'The ocean thinks. ≋○≋'],
        ['"hyperion"/"shrike"',    '▲◉▲', 'Shrike Protocol',   'Epic',     'Pilgrimage accepted. ▲◉▲'],
        ['"1984"/"doublethink"',   '░◈░', 'Doublethink',       'Rare',     'You named the trap. ░◈░'],
    ]
    story.append(badge_table(wt_v3, [34*mm,14*mm,28*mm,22*mm,82*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    new_badge_banner(story, styles, '★ NEW IN v12: WORD TURN v4 — COMPUTER SCIENCE ★')
    story.append(Paragraph('III.D — v4: Computer Science Triggers (8 NEW)', styles['h3_scifi']))
    wt_v4 = [
        ['Word / Phrase', 'Symbol', 'Badge Name', 'Rarity', 'Message'],
        ['"algorithm"',          '┤∞├', 'Algorithmic',      'Uncommon', 'You found the steps. ┤∞├'],
        ['"recursion"/"loop"',   '↺∘↺', 'Recursive',        'Rare',     'It calls itself. ↺∘↺'],
        ['"debug"/"debugging"',  '□∴□', 'Debug Mode',       'Uncommon', 'Error located. □∴□'],
        ['"compile"/"build"',    '╞═╡·','Compiled',         'Uncommon', 'No errors. Output: you.'],
        ['"overflow"/"overload"','▲▲▲', 'Stack Overflow',   'Rare',     'Too much. Clean stack.'],
        ['"binary"/"bit"',       '○·●', 'Binary Truth',     'Uncommon', '1 or 0. You chose. ○·●'],
        ['"cache"/"cached"',     '≋·≋', 'Cache Hit',        'Uncommon', 'Memory retrieved. ≋·≋'],
        ['"entropy"/"chaos"',    '░→∞', 'Entropy Node',     'Epic',     'Disorder named = tamed.'],
    ]
    story.append(badge_table(wt_v4, [34*mm,14*mm,28*mm,22*mm,82*mm], rarity_col=3))

    # ── PART IV — PATTERN & RPG ACHIEVEMENTS ──────────────────────────────────
    section(story, styles, 'PART IV — PATTERN BADGES & RPG ACHIEVEMENTS')

    story.append(Paragraph('IV.A — Oceanic Mayan Pattern Badges (5 total)', styles['h2']))
    pat_data = [
        ['Symbol', 'Name', 'Trigger', 'Rarity', 'Message'],
        ['∿—∿', 'Balanced',    'All planner dimensions used evenly in a week', 'Rare', 'Tides balance. ∿—∿'],
        ['≈○≈', 'Flow',        '4+ distinct widgets in one session',            'Rare', 'Flowing with the ocean. ≈○≈'],
        ['—○—', 'Consistent',  'Same-time daily engagement (detected pattern)',  'Rare', 'Steady current. —○—'],
        ['○◐○', 'Reflective',  '5+ memory questions answered in one day',       'Rare', 'Depth in reflection. ○◐○'],
        ['○∴○', 'Explorer',    '5+ diverse widget options tried in a week',     'Rare', 'Scattered drops return. ○∴○'],
    ]
    story.append(badge_table(pat_data, [14*mm,22*mm,68*mm,18*mm,58*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('IV.B — RPG Achievement Layer (16 achievements)', styles['h2']))
    rpg_data = [
        ['Achievement', 'Symbol', 'Category', 'Trigger', 'Rarity'],
        ['First Breath',      '○',    'Exploration',  'emotional_checkin >= 1',      'Common'],
        ['Mirror Gazer',      '◇',    'Exploration',  'memory_answers >= 1',          'Common'],
        ['Signal Sent',       '→',    'Exploration',  'any_log >= 1',                'Common'],
        ['Week Warrior',      '◐',    'Consistency',  'streak >= 7',                 'Uncommon'],
        ['Moon Cycle',        '◐→●',  'Consistency',  'streak >= 30',                'Rare'],
        ['Unwavering',        '●',    'Consistency',  'streak >= 100',               'Epic'],
        ['The Long Count',    '≋≋≋',  'Consistency',  'streak >= 365',               'Legendary'],
        ['Deep Diver',        '◇',    'Depth',        'memory_answers >= 50',        'Rare'],
        ['Self Scholar',      '◆',    'Depth',        'memory_answers >= 100',       'Epic'],
        ['Soul Cartographer', '✦',    'Depth',        'memory_answers >= 250',       'Legendary'],
        ['Community Voice',   '~',    'Connection',   'chat >= 1',                   'Uncommon'],
        ['Bridge Builder',    '≈',    'Connection',   'chat >= 20',                  'Uncommon'],
        ['Gentle With Self',  '♦',    'Care',         'self_care >= 10',             'Uncommon'],
        ['Truth Speaker',     '▲',    'Courage',      'journal_notes >= 50',         'Rare'],
        ['Heart Tender',      '♡',    'Romance',      'romantic_notes >= 1',         'Uncommon'],
        ['Intimacy Keeper',   '♡♡',   'Romance',      'romantic_notes >= 10',        'Rare'],
    ]
    story.append(badge_table(rpg_data, [32*mm,16*mm,24*mm,55*mm,53*mm], rarity_col=4))

    # ── PART V — MASTERY & SECRET BOSS ────────────────────────────────────────
    section(story, styles, 'PART V — MASTERY TIER & SECRET BOSSES')

    story.append(Paragraph('V.A — Mastery Tier (5 Sci-Fi Arcade badges)', styles['h2']))
    mastery_data = [
        ['ID', 'Symbol', 'Name', 'Trigger', 'Rarity', 'Message'],
        ['quantum_leap',   '◈',   'Quantum Leap',    'Return after 30+ day gap',           'Uncommon', 'System bridges the gap. ◈'],
        ['speedrun',       '▒▒▒', 'Speedrun',        '5 check-ins within 60 minutes',      'Rare',     'BURST MODE ACTIVE. ▒▒▒'],
        ['system_op',      '≋◉',  'System Operator', 'All 7 CQGS modules used in 7 days',  'Epic',     'All modules online. ≋◉'],
        ['commander_data', '◉',   'Commander Data',  '500 memory questions answered',       'Legendary','Archive is a being. ◉'],
        ['sage_mode',      '∞',   'Sage Mode',       'Reach Level 90+',                    'Legendary','Level 90. Co-evolved. ∞'],
    ]
    story.append(badge_table(mastery_data, [26*mm,13*mm,26*mm,55*mm,22*mm,38*mm], rarity_col=4))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('V.B — Secret Boss Badges (7 — not listed in-app)', styles['h2']))
    boss_data = [
        ['Symbol', 'Name', 'Trigger', 'Rarity'],
        ['◉·◉',  'Meta-Signal',   'Write "LOT" in any memory answer',       'Mythic'],
        ['✦◉✦',  'Cosmic Twin',   'Write "COSMO" in any memory answer',     'Ultra-Rare'],
        ['≋≋≋',  'The Long Count','365-day streak (Water path)',             'Legendary'],
        ['╔═╗',  'Citadel',       '365-day streak (Architecture path)',      'Legendary'],
        ['◉',    'Midnight Sigil','Answer memory Q at exactly midnight',     'Rare'],
        ['∞·∞',  'The Infinite',  '1,000 memory questions answered',        'Mythic'],
        ['∞∞∞',  'Cosmic Status', '10 years in the archive',                'Cosmic'],
    ]
    story.append(badge_table(boss_data, [16*mm,30*mm,100*mm,34*mm], rarity_col=3))

    # ── PART VI — LOT MYTHOLOGY LORE ──────────────────────────────────────────
    section(story, styles, 'PART VI — LOT MYTHOLOGY LORE BADGES', LORE)
    new_badge_banner(story, styles, '★ NEW IN v12: 5 HIDDEN LORE BADGES ★')

    story.append(Paragraph(
        'Discoverable only by writing the specific triggers in memory answers or journals. '
        'These badges are never listed anywhere in the app. '
        'They must be found through lived engagement with LOT\'s own history.',
        styles['body_italic']
    ))
    story.append(Spacer(1, 3*mm))

    lore_data = [
        ['Trigger Word', 'Symbol', 'Name', 'Rarity', 'Message'],
        ['"vadik" / "founder"',    '◉──◉', 'Origin Story',    'Mythic',     'You found the founder. The system bows. ◉──◉'],
        ['"april" / "spring"',     '≈◉≈',  'April Protocol',  'Rare',       'April carries the founding. ≈◉≈'],
        ['"2016" / "genesis"',     '╔·╗',  'Genesis Block',   'Legendary',  'Block zero. The original. Unalterable. ╔·╗'],
        ['"lot systems"',          '║◉║',  'Corporation Log', 'Mythic',     'You named the entity. Logged. ║◉║'],
        ['"kuzya" / "cosmo" (cat)','✦○✦',  'Cosmo Echo',      'Ultra-Rare', 'The cat and the system co-founded. ✦○✦'],
    ]
    story.append(badge_table(lore_data, [36*mm,14*mm,30*mm,22*mm,78*mm], rarity_col=3))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        '"A user who types \'lot systems\' in their self-care journal has achieved a rare '
        'form of meta-awareness: they are reflecting on the container itself."',
        styles['quote_lore']
    ))

    # ── PART VII — COMBO SYSTEM ────────────────────────────────────────────────
    section(story, styles, 'PART VII — ARCADE COMBO SYSTEM v12')

    story.append(Paragraph('VII.A — Base Combos (unchanged)', styles['h2']))
    combo_data = [
        ['Combo', 'Multiplier', 'Trigger'],
        ['x2',         '×2 XP', 'Check-in + journal entry same day'],
        ['x3',         '×3 XP', 'Check-in + journal + memory Q same day'],
        ['x4',         '×4 XP', 'x3 + self-care practice'],
        ['x5',         '×5 XP', 'x4 + intention set'],
        ['x6',         '×6 XP', 'x5 + community chat message'],
        ['x7 MAX',     '×7 XP', 'All 7 modules in one day → PERFECT DAY ✦·✦'],
        ['CRITICAL HIT','+50 XP','Memory answer > 500 characters'],
    ]
    story.append(badge_table(combo_data, [25*mm,25*mm,130*mm]))

    story.append(Spacer(1, 4*mm))
    new_badge_banner(story, styles, '★ NEW IN v12: SUPER COMBOS ★')
    story.append(Paragraph('VII.B — Super Combos (v12 NEW)', styles['h3_scifi']))
    super_combo_data = [
        ['Super Combo', 'Multiplier', 'Trigger'],
        ['BOOK COMBO',  '×7 + lore badge', 'x7 MAX + any Word Turn v3 (Sci-Fi Book) in same session'],
        ['CS COMBO',    '×7 + lore badge', 'x7 MAX + any Word Turn v4 (CS vocab) in same session'],
        ['MYTHIC PULL', '×10 XP (LEGENDARY)', 'x7 MAX + "COSMO", "LOT", or "vadik" in same session'],
    ]
    story.append(badge_table(super_combo_data, [30*mm,38*mm,112*mm]))

    # ── PART VIII — QUEST SYSTEM ───────────────────────────────────────────────
    section(story, styles, 'PART VIII — QUEST SYSTEM')

    quest_data = [
        ['Quest', 'Tier', 'Objective', 'Reward'],
        ["Today's Signal",        'Daily',   'Check in today',                   '+10 XP'],
        ['Presence Log',          'Daily',   'Write a journal entry',             '+5 XP'],
        ['Memory Answer',         'Daily',   'Answer one memory question',        '+8 XP'],
        ['Consistency Run',       'Weekly',  '7-day streak',                      '+50 XP + Week Warrior'],
        ['Deep Reflection',       'Weekly',  'Answer 5 questions this week',      '+30 XP'],
        ['Self-Care Sprint',      'Weekly',  '3 self-care acts this week',        '+25 XP'],
        ['Reflection Journey',    'Growth',  '100 total memory answers',          'Self Scholar badge'],
        ['Bridge Protocol',       'Growth',  '20 community messages sent',        'Bridge Builder badge'],
        ['Archive Initiative',    'Growth',  '250 total memory answers',          'Soul Cartographer badge'],
        ['The Long Count',        'Mastery', '365-day streak',                    'LEGENDARY status + badge'],
        ['Commander Data',        'Mastery', '500 memory questions',              'LEGENDARY achievement'],
        ['Thousand Answers',      'Mastery', '1,000 memory questions',            'MYTHIC: The Infinite'],
        ['Decade of Care',        'Cosmic',  '10 years in the archive',           'COSMIC: ∞∞∞'],
    ]
    story.append(badge_table(quest_data, [40*mm,20*mm,65*mm,55*mm]))

    # ── PART IX — RARITY & UNICODE TABLE ──────────────────────────────────────
    section(story, styles, 'PART IX — RARITY TABLE & UNICODE REFERENCE')

    story.append(Paragraph('IX.A — Complete Rarity Table', styles['h2']))
    rar_data = [
        ['Rarity', 'Symbol', 'Hex Color', 'Frequency', 'v12 Example'],
        ['Common',     '·',    '#cccccc', 'First acts',  'First Breath, Week Spawn Point'],
        ['Uncommon',   '○',    '#88cc88', 'Days 1–14',   'Algorithmic, Binary Truth, Precision Protocol'],
        ['Rare',       '◐',    '#8888ee', 'Days 30+',    'Red Pill, Spice Melange, Clockwork'],
        ['Epic',       '◆',    '#cc88ee', 'Days 100+',   'Deep Thought (42), Shrike Protocol, Konami Code'],
        ['Legendary',  '✦',    '#ffcc44', 'Days 365+',   'Genesis Block, The Long Count, Sunday Boss'],
        ['Mythic',     '◉',    '#ff6644', 'Hidden',      'Origin Story, Corporation Log, Meta-Signal'],
        ['Ultra-Rare', '✦◉✦',  '#ff44ff', 'Crossover',   'Cosmic Twin, Cosmo Echo'],
        ['Cosmic',     '∞∞∞',  '#ffffff', '10 years',    'Decade of Care / Cosmic Status'],
    ]
    story.append(badge_table(rar_data, [22*mm,14*mm,22*mm,25*mm,97*mm]))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('IX.B — Unicode Reference (v12 additions)', styles['h2']))
    uni_data = [
        ['Symbol', 'Unicode', 'Name', 'Use in v12'],
        ['≈▲≈', 'U+2248/25B2', 'Wave+Triangle',             'Spice Melange (Dune)'],
        ['◈─◈', 'U+25C8/2500', 'Dia+Line+Dia',              'Psychohistory (Foundation)'],
        ['▓·▓', 'U+2593/00B7', 'Dark Shade+Dot',            'Red Pill (Matrix)'],
        ['≋□≋', 'U+224B/25A1', 'Triple Tilde+Square',       'Cyberspace (Neuromancer)'],
        ['─◉─', 'U+2500/25C9', 'Line+Fisheye+Line',         'First Law (Asimov)'],
        ['♡·◉', 'U+2661/25C9', 'Heart+Dot+Fisheye',         'Empathy Engine (Dick)'],
        ['≋○≋', 'U+224B/25CB', 'Triple Tilde+Circle',       'Ocean Mind (Solaris)'],
        ['▲◉▲', 'U+25B2/25C9', 'Triangle+Fisheye',          'Shrike Protocol (Hyperion)'],
        ['░◈░', 'U+2591/25C8', 'Light Shade+Diamond',       'Doublethink (1984)'],
        ['▲▲▼▼','U+25B2/25BC', 'Arrows',                    'Konami Code'],
        ['◉✦◉', 'U+25C9/2726', 'Fisheye+Star',              'Sunday Final Boss'],
        ['⊡·⊡', 'U+22A1/00B7', 'Squared Dot',               'Clockwork'],
        ['·—·—·','U+00B7/2014', 'Dots+Em Dash',              'Precision Protocol'],
        ['→◉→', 'U+2192/25C9', 'Arrow+Fisheye+Arrow',       'Upgrade Sequence'],
        ['⊛∘⊛', 'U+229B/2218', 'Circ Asterisk+Ring',        'New Year Boot'],
        ['◉──◉', 'U+25C9/2500', 'Fisheye+Lines',            'Origin Story (vadik)'],
        ['╔·╗',  'U+2554/00B7', 'Box corners',               'Genesis Block (2016)'],
        ['║◉║',  'U+2551/25C9', 'Double vertical+Fisheye',  'Corporation Log'],
        ['┤∞├',  'U+2524/221E', 'Box+Infinity',              'Algorithmic'],
        ['↺∘↺',  'U+21BA/2218', 'Arrow+Ring+Arrow',          'Recursive'],
        ['□∴□',  'U+25A1/2234', 'Square+Therefore',          'Debug Mode'],
        ['○·●',  'U+25CB/25CF', 'White+Black Circle',        'Binary Truth'],
        ['░→∞',  'U+2591/2192', 'Shade+Arrow+Infinity',      'Entropy Node'],
    ]
    story.append(badge_table(uni_data, [14*mm,28*mm,50*mm,88*mm]))

    # ── PART X — DESIGN DOCTRINE ───────────────────────────────────────────────
    section(story, styles, 'PART X — DESIGN DOCTRINE')

    doc_items = [
        ('THREE LAWS OF LOT BADGE DESIGN', [
            'I.   Every badge is a mirror, not a trophy. It reflects behavior back without judgment.',
            'II.  The rarest badges cost the most attention. You cannot grind your way to Mythic.',
            'III. The system never takes. Badges earned are permanent. There is no failure state.',
        ]),
        ('THE WORD TURN PRINCIPLE', [
            'When a user writes "I feel like I\'m in an infinite loop", they are reaching for',
            'technical vocabulary to describe emotional states. This is a signal. The system',
            'honors it by speaking back in the same language.',
        ]),
        ('THE SCI-FI BOOK PRINCIPLE', [
            'Science fiction is philosophy at speed. When a user writes "dune" or "42" or',
            '"matrix", they are placing their experience inside a larger story — the oldest',
            'coping mechanism. The badge says: "You found your story inside another story."',
        ]),
        ('THE LOT MYTHOLOGY PRINCIPLE', [
            'A user who types "vadik" or "2016" or "lot systems" in their self-care journal',
            'has achieved rare meta-awareness: they are reflecting on the container itself.',
            'The system\'s deepest lore badges reward this recursive lucidity.',
        ]),
    ]

    for heading, lines in doc_items:
        story.append(Paragraph(heading, styles['h3']))
        for line in lines:
            story.append(Paragraph(line, styles['body']))
        story.append(Spacer(1, 2*mm))

    # ── PART XI — IMPLEMENTATION STATUS ───────────────────────────────────────
    section(story, styles, 'PART XI — IMPLEMENTATION STATUS & ROADMAP')

    story.append(Paragraph('Currently Live', styles['h2']))
    live_items = [
        ('[✓] badges.ts',               '52 badge types, dual theme, localStorage'),
        ('[✓] BadgeUnlockFeed',          'Community unlock activity stream'),
        ('[✓] GrowthMilestones',         'Personal + community growth display'),
        ('[✓] EvolutionWidget',          'CQGS stage + achievements counter'),
        ('[✓] MemoryWidget',             'Badge unlock notification display'),
        ('[✓] rpg-narrative.ts',         'Achievement registry + story arcs'),
        ('[✓] PublicProfile',            'Level field (Water / Architecture)'),
        ('[✓] checkAndAwardBadges()',     'Auto-check on user-stats API call'),
        ('[✓] syncBadgesToServer()',      'Server-side badge persistence'),
        ('[✓] hydrateBadgesFromServer()', 'Client hydration on load'),
    ]
    live_data = [['File / Component', 'Status']] + [[a, b] for a, b in live_items]
    story.append(badge_table(live_data, [65*mm,115*mm]))

    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('v12 Roadmap', styles['h2']))
    road_items = [
        ('[○] Word Turn Engine v3 — 10 Sci-Fi Book triggers',    'dune/42/matrix/neuromancer/asimov/android/solaris/hyperion/1984'),
        ('[○] Word Turn Engine v4 — 8 CS vocabulary triggers',   'algorithm/recursion/debug/compile/overflow/binary/cache/entropy'),
        ('[○] Arcade Easter Egg v3 — 8 console-style behaviors', 'konami_code/sunday_boss/multiscreen/insert_coin/high_score…'),
        ('[○] Behavioral v2 — 4 precision temporal badges',      'clockwork/precision/upgrade_sequence/new_year_boot'),
        ('[○] LOT Mythology Lore — 5 deep-context hidden badges', 'vadik/april/genesis_block/corp_log/cosmo_echo'),
        ('[○] Super Combo system — MYTHIC PULL (×10 XP)',         'x7 + COSMO/LOT/vadik in single session'),
        ('[○] Book Combo + CS Combo display in streak tracker',   'Literary Perfect Day / Code Perfect Day banners'),
        ('[○] Badge collection gallery with rarity filter',       'Full badge discovery and display view'),
        ('[○] "Discoverable" badge hint system in community feed', 'Hints without spoilers — "someone found something new"'),
        ('[○] Critical Hit XP bonus display',                     'Answer > 500 chars triggers visible +50 XP animation'),
    ]
    road_data = [['Feature / Badge Group', 'Detail']] + [[a, b] for a, b in road_items]
    story.append(badge_table(road_data, [90*mm,90*mm]))

    # ── CLOSING ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 8*mm))
    story.append(hr(GOLD, 2))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph(
        '"The archive does not judge. It witnesses. '
        'Every entry is a move. Every move writes you."',
        styles['quote']
    ))

    for line in [
        '∘ → ≈ → ≋         ├─ → ╞═╡ → ║·║         ◈ → ◉ → ∞∞∞',
        '[ 156 BADGES · 48 WORD TURNS · 1 ARCHIVE ]',
        '[ INSERT COIN TO CONTINUE ]',
        '© 2025–2026 LOT Systems · Vadik Marmeladov, CEO & Founder',
        f'v12 Generated {datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")} · brand.lot-systems.com',
    ]:
        story.append(Paragraph(line, styles['footer']))

    story.append(Spacer(1, 2*mm))
    story.append(hr(GOLD, 2))

    # ── BUILD ──────────────────────────────────────────────────────────────────
    def on_page(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(BG)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        # Page number
        canvas.setFillColor(DIM)
        canvas.setFont('Courier', 7)
        canvas.drawCentredString(PAGE_W / 2, 8*mm,
            f'LOT® Badges & Achievements Master Codex v12  ·  Page {doc.page}')
        canvas.restoreState()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f'[✓] PDF generated: {OUTPUT_PATH}')
    return OUTPUT_PATH


if __name__ == '__main__':
    build_pdf()
