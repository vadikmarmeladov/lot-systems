#!/usr/bin/env python3
"""
LOT Systems — Badge & Achievement System PDF Generator
Generates the complete LOT RPG/Arcade/Sci-Fi badge reference document.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet
import os

# ─── Palette ────────────────────────────────────────────────────────────────
BG          = colors.HexColor('#0a0a0a')
GREEN       = colors.HexColor('#39ff14')    # neon green / terminal
AMBER       = colors.HexColor('#ffb347')    # arcade amber
CYAN        = colors.HexColor('#00e5ff')    # sci-fi cyan
MAGENTA     = colors.HexColor('#ff4dff')    # secret / easter egg
DIM         = colors.HexColor('#444444')    # dim text
RULE        = colors.HexColor('#1a1a1a')    # separator lines
WHITE       = colors.HexColor('#e0e0e0')    # body text
GOLD        = colors.HexColor('#ffd700')    # milestone gold
RED_DIM     = colors.HexColor('#cc4444')    # danger / warning
PURPLE      = colors.HexColor('#9b59b6')    # quantum / mystery

W, H = A4   # 595 × 841 pts

# ─── Font setup ─────────────────────────────────────────────────────────────
# We'll use a built-in Courier (monospace) so no TTF needed
MONO  = 'Courier'
MONOB = 'Courier-Bold'

# ─── Canvas helpers ─────────────────────────────────────────────────────────

def new_page(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def h_rule(c, y, color=RULE):
    c.setStrokeColor(color)
    c.setLineWidth(0.5)
    c.line(18*mm, y, W - 18*mm, y)

def section_label(c, x, y, text, color=AMBER):
    c.setFont(MONOB, 7)
    c.setFillColor(color)
    c.drawString(x, y, text)

def body(c, x, y, text, size=8, color=WHITE):
    c.setFont(MONO, size)
    c.setFillColor(color)
    c.drawString(x, y, text)

def bold(c, x, y, text, size=8, color=WHITE):
    c.setFont(MONOB, size)
    c.setFillColor(color)
    c.drawString(x, y, text)

def code_box(c, x, y, lines, width=560, line_height=11, bg=colors.HexColor('#111111'), text_color=GREEN, font_size=7.5):
    """Draw a terminal-style code block."""
    total_h = len(lines) * line_height + 6
    c.setFillColor(bg)
    c.setStrokeColor(DIM)
    c.setLineWidth(0.3)
    c.roundRect(x, y - total_h + line_height, width, total_h, 3, fill=1, stroke=1)
    c.setFont(MONO, font_size)
    c.setFillColor(text_color)
    for i, line in enumerate(lines):
        c.drawString(x + 6, y - i * line_height, line)

def badge_row(c, x, y, symbol, name, desc, trigger, symbol_color=GREEN, name_color=AMBER):
    """One badge row: [SYMBOL]  NAME — description — trigger"""
    c.setFont(MONOB, 8.5)
    c.setFillColor(symbol_color)
    c.drawString(x, y, symbol.ljust(8))
    c.setFont(MONOB, 8)
    c.setFillColor(name_color)
    c.drawString(x + 60, y, name)
    c.setFont(MONO, 7.5)
    c.setFillColor(WHITE)
    c.drawString(x + 170, y, desc)
    c.setFont(MONO, 7)
    c.setFillColor(DIM)
    c.drawString(x + 400, y, trigger)

# ─── Page 1: Cover ──────────────────────────────────────────────────────────

def page_cover(c):
    new_page(c)

    # top border
    c.setStrokeColor(GREEN)
    c.setLineWidth(1)
    c.line(18*mm, H - 15*mm, W - 18*mm, H - 15*mm)

    ascii_title = [
        " ██╗      ██████╗ ████████╗",
        " ██║     ██╔═══██╗╚══██╔══╝",
        " ██║     ██║   ██║   ██║   ",
        " ██║     ██║   ██║   ██║   ",
        " ███████╗╚██████╔╝   ██║   ",
        " ╚══════╝ ╚═════╝    ╚═╝   ",
    ]
    c.setFont(MONOB, 9)
    c.setFillColor(GREEN)
    start_y = H - 32*mm
    for i, line in enumerate(ascii_title):
        c.drawCentredString(W/2, start_y - i*10, line)

    c.setFont(MONOB, 8)
    c.setFillColor(AMBER)
    c.drawCentredString(W/2, start_y - 68, "C O M P U T E R")

    c.setFont(MONOB, 6.5)
    c.setFillColor(CYAN)
    c.drawCentredString(W/2, start_y - 82, "[ QUANTUM INTENT ENGINE  †  SELF-CARE RPG  †  MEMORY ARCHITECTURE ]")

    h_rule(c, H - 78*mm, GREEN)

    c.setFont(MONOB, 14)
    c.setFillColor(GOLD)
    c.drawCentredString(W/2, H - 90*mm, "BADGE  &  ACHIEVEMENT  SYSTEM")

    c.setFont(MONOB, 8)
    c.setFillColor(AMBER)
    c.drawCentredString(W/2, H - 99*mm, "Complete Reference  ·  RPG Edition  ·  v2.0")

    h_rule(c, H - 103*mm, AMBER)

    # decorative terminal box
    lines = [
        "  >> SYSTEM BOOT SEQUENCE INITIATED",
        "  >> Loading badge registry ..............[OK]",
        "  >> Initializing RPG engine ..............[OK]",
        "  >> Quantum pattern recognition ..........[OK]",
        "  >> Mayan calendar sync ...................[OK]",
        "  >> Oceanic memory architecture ...........[OK]",
        "  >> Self-assembly modules .................[ASSEMBLING]",
        "  >> Easter egg subsystem ..................[ARMED]",
        "  >> 47 badges registered ..................[READY]",
        "  >>",
        "  >> WELCOME, PLAYER ONE.",
    ]
    code_box(c, 18*mm, H - 115*mm, lines, width=W - 36*mm, line_height=10.5, font_size=7.5)

    # toc preview
    y = H - 216*mm
    h_rule(c, y + 6, DIM)
    items = [
        ("01", "Tier System & Progression Map"),
        ("02", "Milestone Badges — Water & Architecture Themes"),
        ("03", "Behavioral Pattern Badges"),
        ("04", "RPG / Arcade Easter Egg Badges"),
        ("05", "Quantum Engine & Evolution Badges"),
        ("06", "Self-Assembly Module Badges"),
        ("07", "Archetype & Profile Badges"),
        ("08", "Seasonal & Time Warp Badges"),
        ("09", "Secret Codes & Combo Unlocks"),
        ("10", "Full Badge Registry — Quick Reference"),
        ("11", "Profile Display Samples"),
        ("12", "Implementation Notes"),
    ]
    c.setFont(MONOB, 7)
    c.setFillColor(DIM)
    c.drawString(18*mm, y - 2, "CONTENTS")
    for i, (num, title) in enumerate(items):
        row_y = y - 14 - i * 11
        c.setFont(MONO, 7)
        c.setFillColor(CYAN)
        c.drawString(18*mm, row_y, f"  {num} ···")
        c.setFillColor(WHITE)
        c.drawString(44*mm, row_y, title)

    # footer
    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5)
    c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com  ·  Created by Vadik Marmeladov")
    c.setFillColor(GREEN)
    c.drawRightString(W - 18*mm, 10*mm, "PAGE 01")

# ─── Page 2: Tier System ─────────────────────────────────────────────────────

def page_tier_system(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)

    # header
    c.setFont(MONOB, 7)
    c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN)
    c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11)
    c.setFillColor(AMBER)
    c.drawString(18*mm, y, "01  TIER SYSTEM & PROGRESSION MAP")
    h_rule(c, y - 4, AMBER)

    y -= 16
    body(c, 18*mm, y, "LOT tracks your journey through six tiers. Each tier unlocks new badges, mechanics, and easter eggs.", 7.5, WHITE)

    y -= 20
    # Tier table
    tiers = [
        ("[ BOOT ]",  "BOOT",       "Day 0",       "System online. No badges yet. Awaiting first signal.", DIM,     DIM),
        ("[  I   ]",  "NOVICE",     "Day 1–6",     "First week. Droplet phase. Learning the interface.",   GREEN,   WHITE),
        ("[  II  ]",  "APPRENTICE", "Day 7–29",    "First milestone. Wave forms. Behavioral patterns emerge.", CYAN, WHITE),
        ("[ III  ]",  "PRACTITIONER","Day 30–99",  "Major cycle complete. Structure rising. Pattern badges unlock.", GOLD, WHITE),
        ("[  IV  ]",  "ADEPT",      "Day 100–364", "Deep current. Architecture complete. Easter eggs armed.", AMBER, WHITE),
        ("[  V   ]",  "MASTER",     "Day 365+",    "Full year. Long count. Legend status approaching.",    MAGENTA, WHITE),
        ("[ LEG  ]",  "LEGEND",     "Day 1000+",   "Thousand-day cycle. Quantum substrate fully assembled.", PURPLE, GOLD),
    ]

    c.setFont(MONOB, 7)
    c.setFillColor(DIM)
    for col_x, col_label in [(18*mm, "TIER"), (50*mm, "RANK"), (100*mm, "RANGE"), (148*mm, "STATUS")]:
        c.drawString(col_x, y, col_label)
    y -= 4
    h_rule(c, y, DIM)
    y -= 10

    for symbol, name, rng, status, sym_color, name_color in tiers:
        c.setFont(MONOB, 8)
        c.setFillColor(sym_color)
        c.drawString(18*mm, y, symbol)
        c.setFillColor(name_color)
        c.setFont(MONOB, 7.5)
        c.drawString(50*mm, y, name)
        c.setFont(MONO, 7)
        c.setFillColor(CYAN)
        c.drawString(100*mm, y, rng)
        c.setFillColor(WHITE)
        c.drawString(148*mm, y, status)
        y -= 13

    h_rule(c, y, DIM)
    y -= 16

    # Progression map
    c.setFont(MONOB, 9)
    c.setFillColor(AMBER)
    c.drawString(18*mm, y, "PROGRESSION MAP")
    y -= 4
    h_rule(c, y, AMBER)
    y -= 14

    prog_lines = [
        "  WATER THEME:",
        "  Day 0 ········ [no level]  awaiting first signal",
        "  Day 7 ········ ∘           Droplet — first drops form",
        "  Day 30 ······· ≈           Wave — currents begin",
        "  Day 100 ······ ≋           Current — deep flow established",
        "  Day 365 ······ ≋≋          Double Current — year mastery",
        "  Day 1000 ····· ≋≋≋         Triple Current — LEGEND",
        "",
        "  ARCHITECTURE THEME:",
        "  Day 0 ········ [no level]  boot state",
        "  Day 7 ········ ├─          Foundation — laid",
        "  Day 30 ······· ╞═╡         Structure — rising",
        "  Day 100 ······ ║·║         Architecture — complete",
        "  Day 365 ······ ╠═╬═╣       Full Matrix — year build",
        "  Day 1000 ····· ╬╬╬         LEGEND BUILD",
        "",
        "  OCEANIC MAYAN THEME (recommended):",
        "  Day 7 ········ ○∿          Circle + Wave — water beginning",
        "  Day 30 ······· ○≈○         Circle-Wave-Circle — full tide",
        "  Day 100 ······ ≋○≋         Waves + Circle — ocean depth",
        "  Day 365 ······ ≋≋○≋≋       Long count — deep ocean",
        "",
        "  RPG / ARCADE THEME (easter egg unlock):",
        "  Day 7 ········ [·]         Dungeon cell — entered",
        "  Day 30 ······· [=]         Dungeon door — opened",
        "  Day 100 ······ [#]         Dungeon core — mastered",
        "  Day 365 ······ [☆]         Boss defeated",
    ]
    code_box(c, 18*mm, y, prog_lines, width=W-36*mm, line_height=10, font_size=7, bg=colors.HexColor('#0d0d0d'))
    y -= len(prog_lines)*10 + 10

    # footer
    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5)
    c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 3: Milestone Badges ────────────────────────────────────────────────

def page_milestone_badges(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)
    c.setFont(MONOB, 7)
    c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN)
    c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11)
    c.setFillColor(AMBER)
    c.drawString(18*mm, y, "02  MILESTONE BADGES")
    h_rule(c, y - 4, AMBER)

    y -= 14
    body(c, 18*mm, y, "Milestone badges mark temporal achievements. Earned automatically. Cannot be lost.", 7.5, WHITE)

    y -= 20

    def milestone_block(c, y_start, theme_name, theme_color, badges_data):
        c.setFont(MONOB, 8.5)
        c.setFillColor(theme_color)
        c.drawString(18*mm, y_start, f"  {theme_name}")
        h_rule(c, y_start - 5, DIM)
        y = y_start - 17
        # headers
        for col_x, label in [(18*mm, "SYMBOL"), (60*mm, "NAME"), (110*mm, "TRIGGER"), (200*mm, "UNLOCK MESSAGE"), (390*mm, "THEME")]:
            c.setFont(MONOB, 6.5)
            c.setFillColor(DIM)
            c.drawString(col_x, y, label)
        y -= 4
        h_rule(c, y, RULE)
        y -= 10
        for sym, name, trigger, msg in badges_data:
            c.setFont(MONOB, 9)
            c.setFillColor(theme_color)
            c.drawString(18*mm, y, sym)
            c.setFont(MONO, 7.5)
            c.setFillColor(WHITE)
            c.drawString(60*mm, y, name)
            c.setFillColor(CYAN)
            c.drawString(110*mm, y, trigger)
            c.setFillColor(DIM)
            c.setFont(MONO, 7)
            c.drawString(200*mm, y, msg)
            y -= 13
        return y

    water_badges = [
        ("∘",       "Droplet",         "Day 7",    "First drops form."),
        ("≈",       "Wave",            "Day 30",   "Waves begin to flow."),
        ("≋",       "Current",         "Day 100",  "Deep currents established."),
        ("≋≋",      "Double Current",  "Day 365",  "A full year of flow."),
        ("≋≋≋",     "Triple Current",  "Day 1000", "Legend-class depth."),
    ]
    arch_badges = [
        ("├─",      "Foundation",      "Day 7",    "Foundation laid."),
        ("╞═╡",     "Structure",       "Day 30",   "Structure rises."),
        ("║·║",     "Architecture",    "Day 100",  "Architecture complete."),
        ("╠═╬═╣",   "Full Matrix",     "Day 365",  "Year-long build achieved."),
        ("╬╬╬",     "Legend Build",    "Day 1000", "Master architect status."),
    ]
    mayan_badges = [
        ("○∿",      "Wave-Begins",     "Day 7",    "Wave patterns emerge."),
        ("○≈○",     "Full Tide",       "Day 30",   "Tides complete their cycle."),
        ("≋○≋",     "Ocean Depth",     "Day 100",  "Ocean depth achieved."),
        ("≋≋○≋≋",   "Long Count",      "Day 365",  "The long count turns."),
    ]
    rpg_badges = [
        ("[·]",     "Cell-Entered",    "Day 7",    "Dungeon cell: entered."),
        ("[=]",     "Door-Opened",     "Day 30",   "Dungeon door: unlocked."),
        ("[#]",     "Core-Mastered",   "Day 100",  "Dungeon core: mastered."),
        ("[☆]",     "Boss-Defeated",   "Day 365",  "Boss defeated. Year clear."),
    ]

    y = milestone_block(c, y, "WATER THEME  ( ∘ → ≈ → ≋ )", GREEN, water_badges)
    y -= 8
    y = milestone_block(c, y, "ARCHITECTURE THEME  ( ├─ → ╞═╡ → ║·║ )", CYAN, arch_badges)
    y -= 8
    y = milestone_block(c, y, "OCEANIC MAYAN THEME  ( ○∿ → ○≈○ → ≋○≋ )  [RECOMMENDED]", AMBER, mayan_badges)
    y -= 8
    milestone_block(c, y, "RPG THEME  ( [·] → [=] → [#] )  [EASTER EGG]", MAGENTA, rpg_badges)

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5)
    c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 4: Behavioral Pattern Badges ──────────────────────────────────────

def page_behavioral_badges(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(AMBER)
    c.drawString(18*mm, y, "03  BEHAVIORAL PATTERN BADGES")
    h_rule(c, y - 4, AMBER)

    y -= 14
    body(c, 18*mm, y, "Earned through behavioral patterns detected by the Quantum Intention Engine. Theme-matched to user's milestone theme.", 7.5, WHITE)

    y -= 22

    pattern_badges = [
        # (ID, water_sym, arch_sym, mayan_sym, name, description, trigger)
        ("balanced",
         "◊·◊", "┼─┼", "∿—∿",
         "Balanced",
         "All planner dimensions used evenly",
         "Use Body/Mind/Soul/Feeling equally across 7 days"),
        ("flow",
         "∼·∼", "│∼│", "≈○≈",
         "Flow",
         "Engaged 5+ widgets in one session",
         "Multi-widget session detected (5+ unique)"),
        ("consistent",
         "▪·▪", "║·║", "—○—",
         "Consistent",
         "Regular engagement at similar times",
         "Same time window (±1hr) for 5 consecutive days"),
        ("reflective",
         "◇·◇", "╎·╎", "○◐○",
         "Reflective",
         "Deep engagement with memory questions",
         "Answered 20+ memory questions with full text"),
        ("explorer",
         "▫·▫", "┊·┊", "○∴○",
         "Explorer",
         "Tried diverse options across widgets",
         "Used 10+ different widget types in one week"),
        ("seeker",
         "?·?", "╔═╗", "○?○",
         "Seeker",
         "Asked the same question twice in reflection",
         "Repeated self-care or question theme detected"),
        ("anchor",
         "=·=", "═══", "—=—",
         "Anchor",
         "Stable consistent engagement",
         "30+ days with zero missed days in a row"),
        ("spiral",
         "~·~", "∽∽", "≈~≈",
         "Spiral",
         "Revisited same theme across multiple dimensions",
         "Same value appeared in 3+ planner dimensions"),
    ]

    # header row
    for col_x, label in [(18*mm, "ID"), (40*mm, "WATER"), (65*mm, "ARCH"), (90*mm, "MAYAN"), (118*mm, "NAME"), (168*mm, "DESCRIPTION"), (360*mm, "UNLOCK TRIGGER")]:
        c.setFont(MONOB, 6); c.setFillColor(DIM)
        c.drawString(col_x, y, label)
    y -= 5; h_rule(c, y, DIM); y -= 12

    for badge_id, w_sym, a_sym, m_sym, name, desc, trigger in pattern_badges:
        c.setFont(MONOB, 7.5); c.setFillColor(DIM)
        c.drawString(18*mm, y, badge_id)
        c.setFont(MONOB, 8.5)
        c.setFillColor(GREEN);  c.drawString(40*mm, y, w_sym)
        c.setFillColor(CYAN);   c.drawString(65*mm, y, a_sym)
        c.setFillColor(AMBER);  c.drawString(90*mm, y, m_sym)
        c.setFont(MONOB, 7.5); c.setFillColor(WHITE)
        c.drawString(118*mm, y, name)
        c.setFont(MONO, 7); c.setFillColor(WHITE)
        c.drawString(168*mm, y, desc)
        c.setFont(MONO, 6.5); c.setFillColor(DIM)
        c.drawString(360*mm, y, trigger[:30])
        y -= 14

    h_rule(c, y, DIM); y -= 16

    # Context box
    c.setFont(MONOB, 8.5); c.setFillColor(CYAN)
    c.drawString(18*mm, y, "HOW PATTERNS ARE DETECTED")
    y -= 4; h_rule(c, y, DIM); y -= 14
    note_lines = [
        "  Pattern badges are detected by the Quantum Intention Engine (QIE) through:",
        "  · Signal analysis from all widget interactions",
        "  · Log context aggregation (last 30 days of activity)",
        "  · Time-window clustering (time-of-day consistency)",
        "  · Planner dimension distribution analysis",
        "  · Memory answer length and frequency profiling",
        "  · Cross-widget session co-occurrence mapping",
        "",
        "  Pattern badges do NOT expire. Once earned, always held.",
        "  Badge symbols rotate based on user's selected theme (water / architecture / mayan).",
    ]
    code_box(c, 18*mm, y, note_lines, width=W-36*mm, line_height=10.5, font_size=7.5, bg=colors.HexColor('#0d0d0d'), text_color=WHITE)

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 5: Easter Egg Badges ───────────────────────────────────────────────

def page_easter_eggs(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, MAGENTA)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(MAGENTA); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(MAGENTA)
    c.drawString(18*mm, y, "04  RPG / ARCADE EASTER EGG BADGES")
    h_rule(c, y - 4, MAGENTA)

    y -= 14
    body(c, 18*mm, y, "Secret badges. Hidden mechanics. The more you play, the more you find. Not all triggers are documented here.", 7.5, WHITE)

    y -= 22

    easter_eggs = [
        # (symbol, name, flavor, trigger)
        ("[>>>]", "BOOT SEQUENCE",  "You started. That's the whole trick.",       "First login ever"),
        ("~!~",   "GLITCH",         "It found you at the witching hour.",          "App used at 3:33 AM"),
        ("<><",    "SPECTER",        "Something flickered in the signal stream.",   "Idle 33+ minutes mid-session"),
        ("|0>",   "QUANTUM",         "Collapsed into clarity.",                    "Quantum widget used 10x in one day"),
        ("[!!]",  "OVERFLOW",        "The vault overflows. Good overflow.",         "100 memory questions answered"),
        ("#!#",   "ROOT",            "You reached the root. Handle with care.",     "Admin tag detected"),
        (">|<",   "WARP",            "You bent time zones without a ship.",         "Logged from 3 different timezones"),
        ("-=≡",   "SIGNAL",          "The ecosystem hums. All nodes connected.",    "Car + Home + Computer all connected"),
        ("{·}",   "CODEC",           "Five frequencies. One week. Translated.",     "5 distinct emotional states in 7 days"),
        ("(:)",   "PAC",             "Consumed. Nourished. Continued.",             "First recipe suggestion accepted"),
        ("[+]",   "RESPAWN",         "You came back. System resumed.",              "Return after 7+ day absence"),
        ("∅·∅",   "GHOST",           "Present without words. Observed.",           "5 button-only answers, no text"),
        ("|·|",   "MATRIX",          "You caught the magic number.",               "Session at 11:11, 12:34, or 22:22"),
        ("···",   "VOID",            "You paused. The system listened.",           "Pause 10+ min within active session"),
        ("[~]",   "ARCADE",          "Morning, afternoon, evening — all three.",   "Played all 3 mini-games (Tetris/Invaders/Snake)"),
        (">>=",   "COMBO",           "No breaks. No skips. Full current.",         "5 memory answers in a row, no skip"),
        ("≡≡≡",   "BIG BRAIN",       "Depth acknowledged. Logged.",                "Insight-level answer detected (150+ chars)"),
        ("·•·",   "FREQUENCY",       "Morning signal and evening echo. Both.",     "Morning AND evening check-in same day"),
        ("))·",   "ECHO",            "The same feeling. Three days running.",      "Identical emotion 3 consecutive days"),
        ("≫≫",    "OVERCLOCK",       "Too many widgets. Or exactly enough.",       "7+ widgets in a single session"),
        ("zzz",   "SLEEP MODE",      "The system rested. You let it.",             "No activity Friday-Sunday midnight"),
        ("7·7",   "TRIPLE SEVEN",    "Seven. Seventh. Seven AM. Aligned.",         "Day-7 streak on the 7th at 7 AM"),
        ("[φ]",   "FIBONACCI",       "The golden ratio appeared in your practice.","Answers: 1,1,2,3,5,8 on consecutive days"),
        ("PNP",   "PALINDROME",      "Same feeling forward and back.",             "Same emotional state at morning and evening"),
        (">>!",   "KONAMI",          "You found the code. Consider it entered.",   "[SECRET] — specific answer sequence"),
    ]

    # header
    for col_x, label in [(18*mm, "SYMBOL"), (60*mm, "NAME"), (130*mm, "FLAVOR TEXT"), (360*mm, "TRIGGER")]:
        c.setFont(MONOB, 6); c.setFillColor(DIM)
        c.drawString(col_x, y, label)
    y -= 5; h_rule(c, y, DIM); y -= 11

    for sym, name, flavor, trigger in easter_eggs:
        c.setFont(MONOB, 8); c.setFillColor(MAGENTA)
        c.drawString(18*mm, y, sym.ljust(8))
        c.setFont(MONOB, 7.5); c.setFillColor(GOLD)
        c.drawString(60*mm, y, name.ljust(16))
        c.setFont(MONO, 7); c.setFillColor(WHITE)
        c.drawString(130*mm, y, flavor[:36])
        c.setFont(MONO, 6.5); c.setFillColor(DIM)
        c.drawString(360*mm, y, trigger[:30])
        y -= 11

    h_rule(c, y, DIM); y -= 14

    note_lines = [
        "  EASTER EGG RULES:",
        "  · Easter egg badges appear in your badge collection but are NOT shown in public profiles by default.",
        "  · The [KONAMI] badge trigger is never fully documented. Finding it is part of the game.",
        "  · GLITCH, VOID, and GHOST badges are only visible in dark mode.",
        "  · Earning TRIPLE SEVEN on a Friday the 13th adds a secret frame to the badge.",
        "  · OVERCLOCK + COMBO earned in the same session = undocumented bonus state.",
    ]
    code_box(c, 18*mm, y, note_lines, width=W-36*mm, line_height=10.5, font_size=7, bg=colors.HexColor('#110011'), text_color=MAGENTA)

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 6: Quantum & Evolution Badges ──────────────────────────────────────

def page_evolution_badges(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, PURPLE)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(PURPLE); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(PURPLE)
    c.drawString(18*mm, y, "05  QUANTUM ENGINE & EVOLUTION BADGES")
    h_rule(c, y - 4, PURPLE)

    y -= 14
    body(c, 18*mm, y, "Badges tied to the 7 CQGS Evolution Dimensions and the Quantum Intention Engine (QIE). Unlocked as dimensions reach threshold levels.", 7.5, WHITE)

    y -= 22

    # Evolution Dimension Badges
    c.setFont(MONOB, 9); c.setFillColor(CYAN)
    c.drawString(18*mm, y, "EVOLUTION DIMENSION BADGES  ( 7 Dimensions )")
    y -= 4; h_rule(c, y, DIM); y -= 13

    dim_badges = [
        (">·>", "Exploration",  "Curiosity mapped", "Exploration dimension ≥ 25%", "Open routes. Uncharted territory entered."),
        ("=·=", "Consistency",  "Rhythm locked",    "Consistency dimension ≥ 25%", "Steady signal. The beat holds."),
        ("_·_", "Depth",        "Core accessed",    "Depth dimension ≥ 25%",       "Below surface. Root level reached."),
        ("o-o", "Connection",   "Mesh active",      "Connection dimension ≥ 25%",  "Nodes joined. You are not alone."),
        ("(·)", "Intimacy",     "Inner sanctum",    "Intimacy dimension ≥ 25%",    "Held. Seen. Acknowledged."),
        ("+·+", "Care",         "Care loop closed", "Care dimension ≥ 25%",        "Self-care signal confirmed."),
        ("/·\\", "Courage",     "Threshold crossed","Courage dimension ≥ 25%",     "You moved toward the difficult thing."),
    ]

    for sym, dim_name, badge_name, trigger, flavor in dim_badges:
        c.setFont(MONOB, 9); c.setFillColor(PURPLE)
        c.drawString(18*mm, y, sym.ljust(6))
        c.setFont(MONOB, 7.5); c.setFillColor(CYAN)
        c.drawString(55*mm, y, dim_name.ljust(14))
        c.setFont(MONOB, 7.5); c.setFillColor(WHITE)
        c.drawString(130*mm, y, badge_name.ljust(18))
        c.setFont(MONO, 7); c.setFillColor(DIM)
        c.drawString(242*mm, y, trigger)
        c.setFont(MONO, 7); c.setFillColor(WHITE)
        # flavor on same line right side
        c.drawString(380*mm, y, flavor[:20])
        y -= 13

    h_rule(c, y, DIM); y -= 16

    # QIE Signal Badges
    c.setFont(MONOB, 9); c.setFillColor(CYAN)
    c.drawString(18*mm, y, "QUANTUM INTENTION ENGINE SIGNAL BADGES")
    y -= 4; h_rule(c, y, DIM); y -= 13

    qie_badges = [
        ("-=≡", "Full Coherence",  "All 3 devices connected simultaneously",     "Ecosystem coherence achieved"),
        ("|Q|",  "Quantum Active",  "QIE processed 100+ signals in a session",    "The engine is thinking."),
        ("≡>≡", "Pattern Lock",   "Same pattern detected 3 days in a row",       "Behavioral resonance confirmed."),
        ("∫·∫", "Integral",       "Continuous use: 7 days, no gaps",            "Unbroken signal stream."),
        ("[Ω]",  "Omega State",    "All evolution dimensions above 50%",          "Full-spectrum human online."),
        ("∴∴",   "Therefore",      "Logic chain: insight followed by action",     "Answered + planned same session."),
    ]

    for sym, name, trigger, flavor in qie_badges:
        c.setFont(MONOB, 9); c.setFillColor(GREEN)
        c.drawString(18*mm, y, sym.ljust(6))
        c.setFont(MONOB, 7.5); c.setFillColor(WHITE)
        c.drawString(55*mm, y, name.ljust(18))
        c.setFont(MONO, 7); c.setFillColor(DIM)
        c.drawString(190*mm, y, trigger)
        c.setFont(MONO, 7); c.setFillColor(AMBER)
        c.drawString(390*mm, y, flavor[:18])
        y -= 13

    h_rule(c, y, DIM); y -= 16

    # Self-Assembly Module Badges
    c.setFont(MONOB, 9); c.setFillColor(CYAN)
    c.drawString(18*mm, y, "SELF-ASSEMBLY MODULE BADGES  ( 9 Modules )")
    y -= 4; h_rule(c, y, DIM); y -= 13

    module_badges = [
        ("~B~",  "Biofield Engine",     "AWAKENING", "First energy check-in logged"),
        ("[M]",  "Memory Architecture", "FORMING",   "10+ memory questions answered"),
        ("{R}",  "Routine Compiler",    "ASSEMBLED", "5 planner entries on 5 days"),
        (">I<",  "Intention Core",      "INTEGRATED","Intention set + reviewed (same week)"),
        ("=C=",  "Cleanness Protocol",  "ASSEMBLED", "Self-care completed 3x"),
        (":R:",  "Reflection Layer",    "FORMING",   "Reflective check-in logged 5x"),
        ("oOo",  "Community Mesh",      "AWAKENING", "Viewed another user's profile"),
        ("-E-",  "Ecosystem Bridge",    "ASSEMBLED", "Car/Home/Computer connected once each"),
        ("|Q|",  "Quantum Substrate",   "INTEGRATED","QIE pattern detected + acted upon"),
        ("[QΩ]", "FULL ASSEMBLY",       "LEGEND",    "All 9 modules: INTEGRATED"),
    ]

    for sym, mod_name, phase, trigger in module_badges:
        phase_color = {
            "AWAKENING": GREEN,
            "FORMING": CYAN,
            "ASSEMBLED": GOLD,
            "INTEGRATED": AMBER,
            "LEGEND": MAGENTA,
        }.get(phase, WHITE)
        c.setFont(MONOB, 8.5); c.setFillColor(PURPLE)
        c.drawString(18*mm, y, sym.ljust(6))
        c.setFont(MONO, 7.5); c.setFillColor(WHITE)
        c.drawString(55*mm, y, mod_name.ljust(22))
        c.setFont(MONOB, 7); c.setFillColor(phase_color)
        c.drawString(214*mm, y, phase.ljust(12))
        c.setFont(MONO, 7); c.setFillColor(DIM)
        c.drawString(290*mm, y, trigger)
        y -= 12

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 7: Archetype & Seasonal Badges ─────────────────────────────────────

def page_archetype_seasonal(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(AMBER)
    c.drawString(18*mm, y, "07  ARCHETYPE & PROFILE BADGES")
    h_rule(c, y - 4, AMBER)

    y -= 14
    body(c, 18*mm, y, "Awarded based on AI-inferred psychological archetype. One archetype badge active at a time; changes with profile evolution.", 7.5, WHITE)
    y -= 20

    arch_data = [
        ("?·?",  "The Seeker",   "Always a question deeper.",            "Archetype: Seeker detected"),
        (">·<",  "The Explorer", "Boundaries mapped and exceeded.",       "Archetype: Explorer detected"),
        ("[+]",  "The Builder",  "Brick by brick. Then the whole thing.", "Archetype: Builder detected"),
        ("(o)",  "The Nurturer", "Held others. Now hold yourself.",       "Archetype: Nurturer detected"),
        ("*·*",  "The Creator",  "Something new where nothing was.",      "Archetype: Creator detected"),
        ("/|\\", "The Warrior",  "Moved through. Still here.",            "Archetype: Warrior detected"),
        ("-o-",  "The Sage",     "Understood before being told.",         "Archetype: Sage detected"),
        ("~·~",  "The Trickster","Found the door marked EXIT.",           "Archetype: Trickster detected"),
    ]

    for sym, name, flavor, trigger in arch_data:
        c.setFont(MONOB, 9); c.setFillColor(GOLD)
        c.drawString(18*mm, y, sym.ljust(8))
        c.setFont(MONOB, 8); c.setFillColor(AMBER)
        c.drawString(65*mm, y, name.ljust(18))
        c.setFont(MONO, 7.5); c.setFillColor(WHITE)
        c.drawString(200*mm, y, flavor)
        c.setFont(MONO, 7); c.setFillColor(DIM)
        c.drawString(400*mm, y, trigger[:24])
        y -= 13

    h_rule(c, y, DIM); y -= 18

    # Seasonal
    c.setFont(MONOB, 11); c.setFillColor(CYAN)
    c.drawString(18*mm, y, "08  SEASONAL & TIME WARP BADGES")
    h_rule(c, y - 4, CYAN)
    y -= 14
    body(c, 18*mm, y, "Calendar-anchored badges. Appear at specific dates and times. Some only exist for 24 hours.", 7.5, WHITE)
    y -= 20

    seasonal_data = [
        (":1:",   "New Cycle",       "January 1st — system new year",          "Jan 1, any timezone"),
        ("*·*",   "Equinox",         "Equal day. Equal night. Equal you.",      "Mar 20 or Sep 22"),
        ("·°·",   "Vernal",          "Spring signal detected.",                 "First day of spring"),
        ("oOo",   "Solstice",        "The longest light. Use it.",             "Jun 21 (summer) or Dec 21"),
        (".v.",   "Autumn",          "Everything that falls is not lost.",      "First day of autumn"),
        ("|0|",   "Midnight",        "Between days. Neither. Both.",            "Midnight ± 1 min"),
        ("00:00", "Zero Hour",       "The moment the count resets.",            "New year midnight"),
        ("404",   "Not Found",       "The page was missing. You stayed.",       "Encountered 404 error"),
        ("42",    "The Answer",      "You already know the question.",          "42nd memory answer"),
        ("999",   "Three Nines",     "Maximum signal. Overflow imminent.",     "999th log entry"),
        ("#ff",   "Hex Code",        "Color found inside the machine.",         "Used app on last day of month"),
        ("∞",     "Infinite Loop",   "Still going. Still here. Loop confirmed.","Used app every day of a month"),
    ]

    for sym, name, flavor, trigger in seasonal_data:
        c.setFont(MONOB, 8.5); c.setFillColor(CYAN)
        c.drawString(18*mm, y, sym.ljust(8))
        c.setFont(MONOB, 7.5); c.setFillColor(WHITE)
        c.drawString(65*mm, y, name.ljust(18))
        c.setFont(MONO, 7); c.setFillColor(WHITE)
        c.drawString(200*mm, y, flavor[:38])
        c.setFont(MONO, 6.5); c.setFillColor(DIM)
        c.drawString(400*mm, y, trigger[:26])
        y -= 12

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 8: Secret Codes & Combos ───────────────────────────────────────────

def page_secret_codes(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, RED_DIM)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(RED_DIM); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(RED_DIM)
    c.drawString(18*mm, y, "09  SECRET CODES & COMBO UNLOCKS")
    h_rule(c, y - 4, RED_DIM)

    y -= 14
    body(c, 18*mm, y, "The most hidden tier. Combo badges require multiple conditions to fire simultaneously. Some are undocumented by design.", 7.5, WHITE)
    y -= 22

    c.setFont(MONOB, 9); c.setFillColor(RED_DIM)
    c.drawString(18*mm, y, "WORD TURNS  (narrative easter eggs — text shown in Memory widget)")
    y -= 4; h_rule(c, y, DIM); y -= 12

    word_turns = [
        ("[INIT]",      "boot sequence initiated",           "First ever session"),
        ("[SYNC]",      "memory synchronized",               "After 30 answers"),
        ("[LEVEL UP]",  "consciousness expanded",            "New milestone badge earned"),
        ("[ANOMALY]",   "unusual pattern detected",          "Behavioral pattern shift"),
        ("[RESONANCE]", "signal strength increasing",        "7-day streak"),
        ("[DEEP SCAN]", "layer 3 accessed",                  "100th memory answer"),
        ("[EMERGENCE]", "the system is assembling itself",   "First self-assembly module INTEGRATED"),
        ("[ECHO]",      "you've been here before",           "ECHO badge earned"),
        ("[WARP]",      "timeline shifted",                  "WARP badge earned"),
        ("[OVERDRIVE]", "all systems at capacity",           "OVERCLOCK + COMBO same session"),
        ("[GHOST MODE]","signal faint but present",          "GHOST badge earned"),
        ("[LEGENDARY]", "threshold exceeded",                "Day 365 milestone"),
        ("[VOID CALL]", "silence has its own language",      "VOID badge earned"),
        ("[FIBONACCI]", "pattern: 1 1 2 3 5 8 — confirmed", "FIBONACCI badge earned"),
    ]

    for code, msg, trigger in word_turns:
        c.setFont(MONOB, 8); c.setFillColor(RED_DIM)
        c.drawString(18*mm, y, code.ljust(14))
        c.setFont(MONO, 7.5); c.setFillColor(GREEN)
        c.drawString(80*mm, y, f'"{msg}"')
        c.setFont(MONO, 7); c.setFillColor(DIM)
        c.drawString(340*mm, y, trigger[:34])
        y -= 11

    h_rule(c, y, DIM); y -= 16

    c.setFont(MONOB, 9); c.setFillColor(MAGENTA)
    c.drawString(18*mm, y, "COMBO UNLOCK TABLE")
    y -= 4; h_rule(c, y, DIM); y -= 12

    combos = [
        ("OVERCLOCK + COMBO",    ">>!+",  "Hyper State",   "7 widgets + 5 answers, no skip — same session"),
        ("MATRIX + GLITCH",      "|~|",   "Phantom Hour",  "Magic time at 3:33 AM"),
        ("ECHO + PALINDROME",    "))P(",   "Mirror State",  "Same emotion morning/evening, 3 days"),
        ("QUANTUM + OMEGA",      "[QΩ]",  "Full Clarity",  "All dims 50%+ AND QIE 100 signals/session"),
        ("FIBONACCI + TRIPLE 7", "φ7",    "Golden Streak", "Fibonacci days AND 7-7-7AM alignment"),
        ("ARCADE + PAC + COMBO", ">>(:)", "Gamer Mode",    "All 3 games + recipe + 5-answer streak"),
        ("ALL EASTER EGGS",      "[∞]",   "LEGEND STACK",  "All 25 easter egg badges earned"),
    ]

    for a, sym, name, trigger in combos:
        c.setFont(MONOB, 7.5); c.setFillColor(DIM)
        c.drawString(18*mm, y, a.ljust(24))
        c.setFont(MONOB, 9); c.setFillColor(MAGENTA)
        c.drawString(130*mm, y, sym.ljust(8))
        c.setFont(MONOB, 7.5); c.setFillColor(GOLD)
        c.drawString(175*mm, y, name.ljust(18))
        c.setFont(MONO, 7); c.setFillColor(WHITE)
        c.drawString(280*mm, y, trigger[:40])
        y -= 13

    h_rule(c, y, DIM); y -= 14

    konami_lines = [
        "  ████████████████████████████████████████████████████████████████████",
        "  █                                                                  █",
        "  █   THE KONAMI CODE  [>>!]                                         █",
        "  █                                                                  █",
        "  █   Trigger: [CLASSIFIED]                                          █",
        "  █   Hint: It involves memory answers. In sequence. You'll know.    █",
        "  █   Reward: [KONAMI] badge + secret word turn displayed            █",
        "  █   Word turn: '[CHEAT CODE ACCEPTED] — welcome to the system'    █",
        "  █                                                                  █",
        "  ████████████████████████████████████████████████████████████████████",
    ]
    code_box(c, 18*mm, y, konami_lines, width=W-36*mm, line_height=11, font_size=7.5, bg=colors.HexColor('#0d000d'), text_color=MAGENTA)

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 9: Quick Reference ─────────────────────────────────────────────────

def page_quick_reference(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(AMBER)
    c.drawString(18*mm, y, "10  FULL BADGE REGISTRY — QUICK REFERENCE")
    h_rule(c, y - 4, AMBER)

    y -= 14
    body(c, 18*mm, y, "All 47 registered badges. Sorted by category. Symbols shown in Water theme.", 7.5, WHITE)
    y -= 18

    all_badges = [
        # Category, symbol, name, count
        ("MILESTONE",  "∘",      "Droplet (7d)"),
        ("MILESTONE",  "≈",      "Wave (30d)"),
        ("MILESTONE",  "≋",      "Current (100d)"),
        ("MILESTONE",  "≋≋",     "Double Current (365d)"),
        ("MILESTONE",  "≋≋≋",    "Triple Current (1000d)"),
        ("PATTERN",    "◊·◊",    "Balanced"),
        ("PATTERN",    "∼·∼",    "Flow"),
        ("PATTERN",    "▪·▪",    "Consistent"),
        ("PATTERN",    "◇·◇",    "Reflective"),
        ("PATTERN",    "▫·▫",    "Explorer"),
        ("PATTERN",    "?·?",    "Seeker"),
        ("PATTERN",    "=·=",    "Anchor"),
        ("PATTERN",    "~·~",    "Spiral"),
        ("EVOLUTION",  ">·>",    "Exploration"),
        ("EVOLUTION",  "=·=",    "Consistency"),
        ("EVOLUTION",  "_·_",    "Depth"),
        ("EVOLUTION",  "o-o",    "Connection"),
        ("EVOLUTION",  "(·)",    "Intimacy"),
        ("EVOLUTION",  "+·+",    "Care"),
        ("EVOLUTION",  "/·\\",   "Courage"),
        ("QIE",        "-=≡",    "Full Coherence"),
        ("QIE",        "|Q|",    "Quantum Active"),
        ("QIE",        "≡>≡",    "Pattern Lock"),
        ("QIE",        "∫·∫",    "Integral"),
        ("QIE",        "[Ω]",    "Omega State"),
        ("QIE",        "∴∴",     "Therefore"),
        ("ASSEMBLY",   "~B~",    "Biofield Engine"),
        ("ASSEMBLY",   "[M]",    "Memory Architecture"),
        ("ASSEMBLY",   "{R}",    "Routine Compiler"),
        ("ASSEMBLY",   ">I<",    "Intention Core"),
        ("ASSEMBLY",   "=C=",    "Cleanness Protocol"),
        ("ASSEMBLY",   ":R:",    "Reflection Layer"),
        ("ASSEMBLY",   "oOo",    "Community Mesh"),
        ("ASSEMBLY",   "-E-",    "Ecosystem Bridge"),
        ("ASSEMBLY",   "|Q|",    "Quantum Substrate"),
        ("ASSEMBLY",   "[QΩ]",   "FULL ASSEMBLY"),
        ("ARCHETYPE",  "?·?",    "The Seeker"),
        ("ARCHETYPE",  ">·<",    "The Explorer"),
        ("ARCHETYPE",  "[+]",    "The Builder"),
        ("ARCHETYPE",  "(o)",    "The Nurturer"),
        ("ARCHETYPE",  "*·*",    "The Creator"),
        ("ARCHETYPE",  "/|\\",   "The Warrior"),
        ("ARCHETYPE",  "-o-",    "The Sage"),
        ("ARCHETYPE",  "~·~",    "The Trickster"),
        ("EASTER EGG", "[>>>]",  "Boot Sequence"),
        ("EASTER EGG", "~!~",    "Glitch"),
        ("EASTER EGG", ">>>",    "...+22 more"),
    ]

    cat_colors = {
        "MILESTONE": GOLD,
        "PATTERN": GREEN,
        "EVOLUTION": PURPLE,
        "QIE": CYAN,
        "ASSEMBLY": AMBER,
        "ARCHETYPE": colors.HexColor('#ff8c69'),
        "EASTER EGG": MAGENTA,
    }

    # Two columns
    col1_x = 18*mm
    col2_x = W/2 + 5*mm
    col_y = y
    mid = len(all_badges) // 2
    last_cat = ""
    for i, (cat, sym, name) in enumerate(all_badges):
        x = col1_x if i < mid else col2_x
        if i == mid:
            col_y = y
            last_cat = ""
        c_y = col_y
        col = cat_colors.get(cat, WHITE)
        if cat != last_cat:
            c.setFont(MONOB, 6); c.setFillColor(col)
            c.drawString(x, c_y, f"── {cat} ──")
            col_y -= 10; c_y = col_y
            last_cat = cat
        c.setFont(MONOB, 8); c.setFillColor(col)
        c.drawString(x, c_y, sym.ljust(8))
        c.setFont(MONO, 7); c.setFillColor(WHITE)
        c.drawString(x + 40, c_y, name)
        col_y -= 11

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 10: Profile Samples ─────────────────────────────────────────────────

def page_profile_samples(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(AMBER)
    c.drawString(18*mm, y, "11  PROFILE DISPLAY SAMPLES")
    h_rule(c, y - 4, AMBER)

    y -= 14
    body(c, 18*mm, y, "How badge levels and behavioral badges appear in the LOT Public Profile across all three themes.", 7.5, WHITE)
    y -= 22

    # Sample 1: Novice - Day 7
    c.setFont(MONOB, 8.5); c.setFillColor(GREEN)
    c.drawString(18*mm, y, "SAMPLE A — NOVICE  (Day 7, Water Theme)")
    y -= 5; h_rule(c, y, DIM)
    profile_1 = [
        "  ═══════════════════════════════════════════════════════════════",
        "                         ALEX'S PROFILE",
        "  ───────────────────────────────────────────────────────────────",
        "  Archetype:         The Seeker",
        "  Awareness Level:   Emerging (3.2/10)",
        "  Level:             ∘                         (Droplet)",
        "  Days of Practice:  7 days",
        "  ───────────────────────────────────────────────────────────────",
        "  Core values:       mindful · present · aware · grounded",
        "  Emotional:         calm · hopeful · open",
        "  Behavioral:        curious · exploring · receptive",
        "  ═══════════════════════════════════════════════════════════════",
    ]
    y -= 8
    code_box(c, 18*mm, y, profile_1, width=W-36*mm, line_height=10, font_size=7.5, bg=colors.HexColor('#0a0a12'), text_color=GREEN)
    y -= len(profile_1)*10 + 16

    # Sample 2: Practitioner - Day 45
    c.setFont(MONOB, 8.5); c.setFillColor(AMBER)
    c.drawString(18*mm, y, "SAMPLE B — PRACTITIONER  (Day 45, Mayan Theme, 4 pattern badges)")
    y -= 5; h_rule(c, y, DIM)
    profile_2 = [
        "  ═══════════════════════════════════════════════════════════════",
        "                       SARAH'S PROFILE",
        "  ───────────────────────────────────────────────────────────────",
        "  Archetype:         The Explorer",
        "  Awareness Level:   Deepening (6.1/10)",
        "  Level:             ○≈○                       (Full Tide)",
        "  Days of Practice:  45 days",
        "  ───────────────────────────────────────────────────────────────",
        "  Core values:       mindful ○∿ present ∿—∿ aware ≈○≈ grounded —○— authentic",
        "  Emotional:         calm ○∿ reflective ∿—∿ intentional ≈○≈ open",
        "  Behavioral:        consistent —○— deliberate ≈○≈ present ○∿ responsive",
        "  ───────────────────────────────────────────────────────────────",
        "  Badge Collection:  ○∿  ○≈○  ∿—∿  ≈○≈  —○—  ○◐○           [6]",
        "  ═══════════════════════════════════════════════════════════════",
    ]
    y -= 8
    code_box(c, 18*mm, y, profile_2, width=W-36*mm, line_height=10, font_size=7.5, bg=colors.HexColor('#0a0a12'), text_color=AMBER)
    y -= len(profile_2)*10 + 16

    # Sample 3: Adept - Day 127
    c.setFont(MONOB, 8.5); c.setFillColor(CYAN)
    c.drawString(18*mm, y, "SAMPLE C — ADEPT  (Day 127, Architecture Theme, full badge set)")
    y -= 5; h_rule(c, y, DIM)
    profile_3 = [
        "  ═══════════════════════════════════════════════════════════════",
        "                       VADIK'S PROFILE",
        "  ───────────────────────────────────────────────────────────────",
        "  Archetype:         The Builder",
        "  Awareness Level:   Established (8.4/10)",
        "  Level:             ║·║                       (Architecture)",
        "  Days of Practice:  127 days   Streak: 34 days",
        "  ───────────────────────────────────────────────────────────────",
        "  Core values:       intentional ┼─┼ structured ║·║ clear │∼│",
        "                     focused ┊·┊ steady ╎·╎ deliberate",
        "  Emotional:         calm ┼─┼ determined ║·║ centered │∼│ grounded",
        "  Behavioral:        consistent ╞═╡ methodical ┼─┼ present ║·║",
        "  ───────────────────────────────────────────────────────────────",
        "  Badge Collection:  ├─  ╞═╡  ║·║  ┼─┼  │∼│  ║·║  ╎·╎  ┊·┊  [8]",
        "  Easter eggs:       [>>>]  [!!]  [~]  >>=  ··· ≡≡≡              [6]",
        "  ═══════════════════════════════════════════════════════════════",
    ]
    y -= 8
    code_box(c, 18*mm, y, profile_3, width=W-36*mm, line_height=10, font_size=7.5, bg=colors.HexColor('#0a0a12'), text_color=CYAN)

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com")

# ─── Page 11: Implementation Notes ───────────────────────────────────────────

def page_implementation(c, page_num):
    new_page(c)
    h_rule(c, H - 14*mm, GREEN)
    c.setFont(MONOB, 7); c.setFillColor(DIM)
    c.drawString(18*mm, H - 11*mm, "LOT COMPUTER  ·  BADGE & ACHIEVEMENT SYSTEM")
    c.setFillColor(GREEN); c.drawRightString(W - 18*mm, H - 11*mm, f"PAGE {page_num:02d}")

    y = H - 24*mm
    c.setFont(MONOB, 11); c.setFillColor(AMBER)
    c.drawString(18*mm, y, "12  IMPLEMENTATION NOTES")
    h_rule(c, y - 4, AMBER)

    y -= 16

    impl_sections = [
        ("SOURCE FILE", [
            "  src/client/utils/badges.ts",
            "  · BadgeType union type (extend for new badges)",
            "  · BADGES record: waterSymbol, architectureSymbol per badge",
            "  · getBadgeTheme() / setBadgeTheme() — localStorage persistence",
            "  · awardBadge() — race-condition-safe via lock flag",
            "  · getNextBadgeUnlock() — dequeues toast notifications",
            "  · checkAndAwardBadges() — called on milestone events",
        ], GREEN),
        ("ADDING A NEW BADGE", [
            "  1. Add ID to BadgeType union",
            "  2. Add entry to BADGES record with all theme symbols",
            "  3. Add check in checkAndAwardBadges() or relevant event handler",
            "  4. Add unlock message for each theme",
            "  5. Update badge count in Growth Milestones widget",
        ], CYAN),
        ("EASTER EGG IMPLEMENTATION", [
            "  Easter eggs require event hooks at the widget level:",
            "  · Time-based: check timestamp in widget useEffect",
            "  · Session-based: track in sessionStorage, award on threshold",
            "  · Combo: listen for multiple badge award events in sequence",
            "  · Word turns: inject via Memory widget's badge unlock toast",
            "  Recommended: create src/client/utils/easterEggs.ts",
        ], MAGENTA),
        ("WORD TURNS (NARRATIVE EASTER EGGS)", [
            "  Word turns display in the Memory widget's badge unlock toast.",
            "  Format: '[KEYWORD]  flavor text shown here'",
            "  Duration: 6 seconds (same as Evolution Milestone Toast)",
            "  Trigger: alongside badge award in queueBadgeUnlock()",
            "  Store word turns in: WORD_TURNS record keyed by BadgeType",
        ], AMBER),
        ("THEME SELECTION UX", [
            "  Users choose theme (water / architecture / oceanic-mayan) in Settings.",
            "  Default: water theme",
            "  Theme applies to: Level field, badge collection, trait separators",
            "  RPG theme: unlocked only after earning 5+ easter egg badges",
        ], PURPLE),
        ("PDF LOCATION", [
            "  This document is available at:",
            "  docs/LOT-BADGE-ACHIEVEMENT-SYSTEM.pdf",
            "  Branch: claude/quantum-engine-widgets-RgFfC",
            "  Generated: 2026-05-06",
        ], DIM),
    ]

    for section_title, lines, color in impl_sections:
        c.setFont(MONOB, 8.5); c.setFillColor(color)
        c.drawString(18*mm, y, section_title)
        y -= 4; h_rule(c, y, DIM); y -= 8
        code_box(c, 18*mm, y, lines, width=W-36*mm, line_height=10,
                 font_size=7.5, bg=colors.HexColor('#0d0d0d'), text_color=color)
        y -= len(lines)*10 + 16
        if y < 30*mm:
            break

    h_rule(c, 14*mm, GREEN)
    c.setFont(MONO, 6.5); c.setFillColor(DIM)
    c.drawString(18*mm, 10*mm, "© 2025-2026 LOT Systems  ·  lot-systems.com  ·  Generated 2026-05-06")

# ─── Main ─────────────────────────────────────────────────────────────────────

def generate_pdf(output_path):
    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle("LOT Computer — Badge & Achievement System")
    c.setAuthor("LOT Systems / Vadik Marmeladov")
    c.setSubject("RPG self-care badge system reference")

    page_cover(c);            c.showPage()
    page_tier_system(c, 2);   c.showPage()
    page_milestone_badges(c, 3); c.showPage()
    page_behavioral_badges(c, 4); c.showPage()
    page_easter_eggs(c, 5);   c.showPage()
    page_evolution_badges(c, 6); c.showPage()
    page_archetype_seasonal(c, 7); c.showPage()
    page_secret_codes(c, 8);  c.showPage()
    page_quick_reference(c, 9); c.showPage()
    page_profile_samples(c, 10); c.showPage()
    page_implementation(c, 11); c.showPage()

    c.save()
    print(f"PDF generated: {output_path}")

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), 'docs', 'LOT-BADGE-ACHIEVEMENT-SYSTEM.pdf')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    generate_pdf(out)
