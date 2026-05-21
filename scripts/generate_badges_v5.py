#!/usr/bin/env python3
"""
LOT Systems — Badges & Achievements Field Manual v5.0
THE DEFINITIVE RPG / ARCADE / SELF-CARE CODEX
Author: Vadik Marmeladov, CEO & Founder, LOT Systems
© 2025-2026 LOT Systems. All rights reserved.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.lib.colors import HexColor

W, H = A4
M  = 16 * mm
CW = W - 2 * M

# ── Palette ──────────────────────────────────────────────────────────────────
BG    = HexColor("#080810")   # deep space black
FG    = HexColor("#e4e4f4")   # near-white text
FG2   = HexColor("#9999bb")   # dimmed text
FG3   = HexColor("#444466")   # very dim
TEAL  = HexColor("#42d4c8")   # primary accent — oceanic
GOLD  = HexColor("#f5c842")   # milestone / achievement
VIOLET= HexColor("#a67fe8")   # rare / depth
GREEN = HexColor("#72e891")   # common / growth
ROSE  = HexColor("#e86575")   # legendary / secret
CYAN  = HexColor("#5bc4f5")   # connection / water
ORANGE= HexColor("#f5924e")   # courage / warning
BRD   = HexColor("#1a1a2e")   # panel border
PANEL = HexColor("#0d0d1a")   # panel fill
PANEL2= HexColor("#0a0a14")   # darker panel
ACCENT= HexColor("#1e1e3e")   # subtle row highlight

OUT = os.path.join(os.path.dirname(__file__), '..', 'docs',
                   'LOT-BADGES-ACHIEVEMENTS-FIELD-MANUAL-v5.pdf')

# ── Font shortcuts ────────────────────────────────────────────────────────────
def mono(c, size=8): c.setFont("Courier", size)
def bold(c, size=8): c.setFont("Courier-Bold", size)
def ital(c, size=8): c.setFont("Courier-Oblique", size)

# ── Drawing helpers ───────────────────────────────────────────────────────────
def bg(c): 
    c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)

def header(c, page_n):
    c.setFillColor(PANEL)
    c.rect(0, H-20, W, 20, fill=1, stroke=0)
    c.setFillColor(BRD)
    c.rect(0, H-21, W, 1, fill=1, stroke=0)
    bold(c, 7); c.setFillColor(TEAL)
    c.drawString(M, H-13, "LOT SYSTEMS  //  FIELD MANUAL: BADGES & ACHIEVEMENTS  //  v5.0  //  © 2026 LOT SYSTEMS")
    mono(c, 7); c.setFillColor(FG3)
    c.drawRightString(W-M, H-13, f"PAGE {page_n:02d}")

def footer(c):
    c.setFillColor(PANEL)
    c.rect(0, 0, W, 16, fill=1, stroke=0)
    c.setFillColor(BRD)
    c.rect(0, 16, W, 1, fill=1, stroke=0)
    mono(c, 7); c.setFillColor(FG3)
    c.drawCentredString(W/2, 5, "LOT  ·  THE RPG + ARCADE OF SELF-CARE  ·  lot-systems.com")

def rule(c, y, color=BRD, thickness=0.5):
    c.setStrokeColor(color); c.setLineWidth(thickness)
    c.line(M, y, W-M, y)

def box(c, x, y, w, h, fill=PANEL, stroke=BRD, radius=3):
    c.setFillColor(fill); c.setStrokeColor(stroke)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)

def stripe(c, x, y, w, h, color):
    c.setFillColor(color); c.rect(x, y, w, h, fill=1, stroke=0)

def section_label(c, y, text, color=TEAL):
    bold(c, 7); c.setFillColor(color)
    c.drawString(M, y, f"[ {text} ]")

def h1(c, y, text, color=GOLD):
    bold(c, 14); c.setFillColor(color)
    c.drawString(M, y, text)
    return y - 18

def h2(c, y, text, color=TEAL):
    bold(c, 10); c.setFillColor(color)
    c.drawString(M, y, text)
    return y - 14

def h3(c, y, text, color=VIOLET):
    bold(c, 8.5); c.setFillColor(color)
    c.drawString(M, y, text)
    return y - 12

def body(c, y, text, color=FG, size=8):
    mono(c, size); c.setFillColor(color)
    c.drawString(M, y, text)
    return y - 11

def body_c(c, y, text, color=FG2, size=7.5):
    mono(c, size); c.setFillColor(color)
    c.drawString(M, y, text)
    return y - 10

def code_block(c, x, y, lines, bg_color=PANEL, text_color=TEAL, 
               fs=7.5, padding=6, width=None):
    """Draw a monospace code/ASCII block. Returns new y below block."""
    w = width or CW
    line_h = fs + 2.5
    h = len(lines) * line_h + padding * 2
    box(c, x, y - h, w, h, fill=bg_color, stroke=BRD)
    ty = y - padding - fs
    for line in lines:
        mono(c, fs); c.setFillColor(text_color)
        c.drawString(x + padding, ty, line)
        ty -= line_h
    return y - h - 4

def badge_row(c, y, symbol, title, desc, rarity, rarity_color, 
              cat='', h=38, sym_color=None):
    """Single badge row card."""
    sym_color = sym_color or rarity_color
    bx, bw = M, CW
    box(c, bx, y-h, bw, h, fill=PANEL, stroke=BRD)
    # Left stripe
    c.setFillColor(rarity_color)
    c.rect(bx, y-h, 5, h, fill=1, stroke=0)
    c.roundRect(bx, y-h, 5, h, 2, fill=1, stroke=0)
    # Symbol
    bold(c, 13); c.setFillColor(sym_color)
    c.drawString(bx+12, y-h+h/2-5, symbol)
    # Title
    bold(c, 8.5); c.setFillColor(FG)
    c.drawString(bx+48, y-h+h-14, title)
    # Category + rarity
    mono(c, 7); c.setFillColor(rarity_color)
    cat_str = f"[ {rarity.upper()} ]" + (f"  {cat}" if cat else "")
    c.drawString(bx+48, y-h+h-24, cat_str)
    # Description
    mono(c, 7); c.setFillColor(FG2)
    c.drawString(bx+48, y-h+8, desc[:95])
    return y - h - 4

# ── Page-level drawing functions ──────────────────────────────────────────────

def page_cover(c, pn):
    bg(c); header(c, pn); footer(c)

    # Big LOT ASCII art
    art = [
        "  ██╗      ██████╗ ████████╗",
        "  ██║     ██╔═══██╗╚══██╔══╝",
        "  ██║     ██║   ██║   ██║   ",
        "  ██║     ██║   ██║   ██║   ",
        "  ███████╗╚██████╔╝   ██║   ",
        "  ╚══════╝ ╚═════╝    ╚═╝   ",
    ]
    cy = H - 50
    code_block(c, M, cy, art, bg_color=BG, text_color=TEAL, fs=10, padding=10)
    
    y = cy - len(art)*12.5 - 22

    bold(c,26); c.setFillColor(FG)
    c.drawCentredString(W/2, y, "FIELD MANUAL")
    y -= 32

    bold(c,13); c.setFillColor(TEAL)
    c.drawCentredString(W/2, y, "BADGES · ACHIEVEMENTS · EASTER EGGS")
    y -= 16

    bold(c,10); c.setFillColor(FG3)
    c.drawCentredString(W/2, y, "THE RPG + ARCADE OF SELF-CARE")
    y -= 20

    # Divider
    c.setStrokeColor(TEAL); c.setLineWidth(0.8)
    c.line(M+40, y, W-M-40, y)
    y -= 12

    bold(c,7.5); c.setFillColor(FG2)
    c.drawCentredString(W/2, y, "EDITION v5.0  //  MAY 2026  //  INTERNAL CODEX")
    y -= 10
    c.drawCentredString(W/2, y, "Author: Vadik Marmeladov, CEO & Founder, LOT Systems")
    y -= 10
    c.drawCentredString(W/2, y, "Copyright © 2025-2026 LOT Systems. All rights reserved.")
    y -= 24

    # Classification box
    cls_lines = [
        "  ┌─────────────────────────────────────────────────────────────┐",
        "  │  CLASSIFICATION: ACTIVE PLAYER EYES ONLY                    │",
        "  │  SYSTEM: LOT MEMORY ENGINE + SELF-CARE RPG LAYER            │",
        "  │  STATUS: LIVE PRODUCTION  ·  QUANTUM ENGINE: ACTIVE         │",
        "  └─────────────────────────────────────────────────────────────┘",
    ]
    code_block(c, M, y, cls_lines, bg_color=PANEL2, text_color=GOLD, fs=8, padding=4)
    y -= len(cls_lines)*10.5 + 16

    # Quote
    ital(c,9); c.setFillColor(VIOLET)
    c.drawCentredString(W/2, y, 
        '"Self-care is not a quest you complete. It is a world you build."')
    y -= 14
    mono(c,8); c.setFillColor(FG3)
    c.drawCentredString(W/2, y, "— LOT Philosophy")
    y -= 30

    # Progress bar decoration
    mono(c,11); c.setFillColor(TEAL)
    c.drawCentredString(W/2, y, "∘  →  ≈  →  ≋")
    y -= 14
    mono(c,11); c.setFillColor(FG2)
    c.drawCentredString(W/2, y, "├─  →  ╞═╡  →  ║·║")
    y -= 14
    bold(c,9); c.setFillColor(GOLD)
    c.drawCentredString(W/2, y, "[ PRESS START ]")


def page_toc(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "[ TABLE OF CONTENTS ]")
    rule(c, y+2, TEAL, 0.8); y -= 10

    toc = [
        ("01", "OVERVIEW",              "The LOT RPG Layer & Systems Architecture"),
        ("02", "BADGE SYSTEM",          "Water & Architecture Dual Themes"),
        ("03", "MILESTONE BADGES",      "7 · 30 · 100 · 180 · 365 Days"),
        ("04", "EXTENDED MILESTONES",   "Full Progression Timeline"),
        ("05", "ACHIEVEMENT ENGINE",    "20 Achievements, 7 Categories, 6 Rarities"),
        ("06", "LEVEL SYSTEM",          "XP · Levels 1-100 · 5 Story Chapters"),
        ("07", "QUEST SYSTEM",          "Daily · Weekly · Growth · Mastery"),
        ("08", "OCEANIC MAYAN SYSTEM",  "Pattern Badges, Behavioral Unlocks"),
        ("09", "EASTER EGGS",           "Hidden Unlocks, Secret Modes"),
        ("10", "WORD TURNS",            "Terminal Phrases, RPG Vocabulary"),
        ("11", "ASCII BADGE GALLERY",   "All Symbols, Full Unicode Reference"),
        ("12", "DESIGN PHILOSOPHY",     "Mayan · Water · Cosmic · Sci-Fi"),
        ("13", "IMPLEMENTATION STATUS", "Live · In Design · Roadmap"),
        ("14", "UNICODE REFERENCE",     "Complete Character Index"),
    ]

    for num, title, sub in toc:
        row_h = 22
        box(c, M, y-row_h, CW, row_h, fill=PANEL if int(num)%2==1 else PANEL2, stroke=BRD)
        stripe(c, M, y-row_h, 3, row_h, TEAL)
        bold(c,7.5); c.setFillColor(TEAL)
        c.drawString(M+8, y-13, f"{num}")
        bold(c,8.5); c.setFillColor(FG)
        c.drawString(M+30, y-13, title)
        mono(c,7); c.setFillColor(FG2)
        c.drawString(M+155, y-13, sub)
        y -= row_h + 2


def page_overview(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "01  THE LOT RPG LAYER")
    rule(c, y+2, TEAL, 0.8); y -= 10

    intro = [
        "LOT is more than a wellness tracker — it is a living RPG where every self-care",
        "action builds toward a richer inner story. Badges transform daily practice into a",
        "progression arc with real symbolic weight. Unlike gamification designed to drive",
        "engagement metrics, LOT badges are earned through genuine consistency and depth.",
    ]
    for line in intro:
        y = body(c, y, line)
    y -= 6

    y = h2(c, y, "CORE SYSTEMS")
    pillars = [
        "  ▸  MEMORY ENGINE    — AI that remembers every answer, builds your story",
        "  ▸  BADGE SYSTEM     — Two themes: Water ∘→≈→≋  /  Architecture ├─→╞═╡→║·║",
        "  ▸  ACHIEVEMENT RPG  — 20 achievements, 7 categories, 6 rarity tiers",
        "  ▸  LEVEL SYSTEM     — XP from activities, Levels 1-100, five story chapters",
        "  ▸  QUEST SYSTEM     — Daily + Growth + Mastery quests with unlock rewards",
        "  ▸  EASTER EGGS      — Hidden triggers, secret modes, ASCII surprises",
        "  ▸  WORD TURNS       — Terminal phrase engine with RPG vocabulary",
        "  ▸  OCEANIC MAYAN    — Extended badge set: circles + waves + bars",
    ]
    y = code_block(c, M, y, pillars, bg_color=PANEL, text_color=FG, fs=8, padding=6)
    y -= 4

    y = h2(c, y, "ARCADE vs RPG")
    y = body(c, y, "The ARCADE layer delivers instant feedback: streaks, toasts, level-ups.")
    y = body(c, y, "The RPG layer builds long-term narrative: chapters, archetypes, story")
    y = body(c, y, "arcs that evolve with your psychological profile over weeks and months.")
    y -= 8

    y = h2(c, y, "DESIGN LANGUAGE")
    dl_lines = [
        "  ·   middle dot        separator between traits and values",
        "  →   progression arrow forward movement through milestones",
        "  ↳   sub-indicator     system sub-thought / nested insight",
        "  ∘   ring operator     Water Day-7 badge, droplet of presence",
        "  ≈   almost equal      Water Day-30 badge, wave of pattern",
        "  ≋   triple tilde      Water Day-100 badge, deep current",
        "  ├─  box drawing       Architecture Day-7 foundation symbol",
        "  ╞═╡ box drawing       Architecture Day-30 structure symbol",
        "  ║·║ box drawing       Architecture Day-100 architecture symbol",
    ]
    code_block(c, M, y, dl_lines, bg_color=PANEL2, text_color=TEAL, fs=7.5, padding=6)


def page_badge_system(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "02  BADGE SYSTEM — DUAL THEME")
    rule(c, y+2, TEAL, 0.8); y -= 10

    y = body(c, y, "Badges display in the 'Level:' field on the Public Profile. Users choose")
    y = body(c, y, "between two visual languages for their growth story via Settings.")
    y -= 8

    y = h2(c, y, "WATER PATH  ─  ∘ → ≈ → ≋")
    water = [
        "  Philosophy: Growth through natural cycles, like water finding its path",
        "",
        "  ∘   Droplet      Day 7    First drops form. Singular moment.",
        "  ≈   Wave         Day 30   Pattern emerging. Tide in motion.",
        "  ≋   Current      Day 100  Deep, established, oceanic mastery.",
        "",
        "  Extended:",
        "  ∘∘  Twin Drop    Day 14   Two-week pattern confirmed.",
        "  ∘≈  Proto-Wave   Day 21   21-day neural groove forming.",
        "  ≈∘  Mid-Current  Day 50   Halfway to the deep water.",
        "  ≈≈  Dual Wave    Day 60   Practitioner threshold crossed.",
        "  ≋∘  Deep Reach   Day 90   Three-month immersion.",
        "  ≋≋  Dual Current Day 180  Half-year voyager.",
        "  ≋≋≋ Long Count   Day 365  LEGENDARY. The architecture stands.",
    ]
    y = code_block(c, M, y, water, bg_color=PANEL, text_color=CYAN, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "ARCHITECTURE PATH  ─  ├─ → ╞═╡ → ║·║")
    arch = [
        "  Philosophy: Structural building and growth, construction of self",
        "",
        "  ├─   Foundation    Day 7    Ground laid. First pillar planted.",
        "  ╞═╡  Structure     Day 30   Walls formed. The frame holds.",
        "  ║·║  Architecture  Day 100  Complete. The self as built environment.",
        "",
        "  Extended:",
        "  ├┼   Load-Bearing  Day 14   Structural crossbeam engaged.",
        "  ├═   Deep Found.   Day 21   Foundation reaches bedrock.",
        "  ╞══  Mid-Structure Day 50   Upper floors under construction.",
        "  ╞═══ Master Frame  Day 60   Superstructure complete.",
        "  ║═   Inner Wall    Day 90   Interior architecture forming.",
        "  ║╞║  Wing          Day 180  East and west wings added.",
        "  ╔═╗  Citadel       Day 365  LEGENDARY. Year One complete.",
    ]
    code_block(c, M, y, arch, bg_color=PANEL2, text_color=FG, fs=7.5, padding=6)


def page_milestones(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "03  MILESTONE BADGES  (CORE)")
    rule(c, y+2, TEAL, 0.8); y -= 10

    y = body(c, y, "Three core milestones represent the Mayan vigesimal cycle philosophy:")
    y = body(c, y, "each completion is a return to origin at greater depth, not an endpoint.")
    y -= 8

    milestones = [
        ("∘ / ├─",  "DROPLET  /  FOUNDATION",   "7 DAYS",
         "Seven consecutive days. The first drop touches the surface. Foundation laid.",
         "Water: '↳ First drops form ∘'   Arch: '↳ Foundation laid ├─'",
         GREEN, "common"),
        ("≈ / ╞═╡", "WAVE  /  STRUCTURE",        "30 DAYS",
         "A full lunar cycle. Waves begin. The frame takes shape. Tides turn.",
         "Water: '↳ Waves begin to flow ≈'   Arch: '↳ Structure rises ╞═╡'",
         TEAL, "uncommon"),
        ("≋ / ║·║", "CURRENT  /  ARCHITECTURE",  "100 DAYS",
         "Deep currents. Architecture complete. You and the system are one.",
         "Water: '↳ Deep currents established ≋'   Arch: '↳ Architecture complete ║·║'",
         GOLD, "rare"),
    ]

    for sym, name, days, desc, msg, color, rarity in milestones:
        y = badge_row(c, y, sym, f"[ {days} ]  {name}", 
                      desc, rarity, color, h=50)
        code_block(c, M+8, y+4, [f"  {msg}"], bg_color=PANEL2, text_color=FG2, fs=7, padding=3, width=CW-8)
        y -= 24

    y -= 4
    y = h2(c, y, "PROFILE DISPLAY EXAMPLE")
    profile = [
        "  ═══════════════════════════════════════════════════════════",
        "                         ALEX'S PROFILE",
        "  ───────────────────────────────────────────────────────────",
        "  Archetype:              The Explorer",
        "  Awareness Level:        Deepening (8.4/10)",
        "  Level:                  ≋                ← WATER THEME",
        "  Days of Practice:       127 days",
        "  ───────────────────────────────────────────────────────────",
        "  Core values:            mindful · present · aware · grounded",
        "  ═══════════════════════════════════════════════════════════",
    ]
    code_block(c, M, y, profile, bg_color=PANEL, text_color=FG2, fs=8, padding=6)


def page_extended_milestones(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "04  EXTENDED MILESTONE TIMELINE")
    rule(c, y+2, TEAL, 0.8); y -= 10

    y = body(c, y, "Full milestone progression from Day 1 to Year One — both themes.")
    y -= 8

    timeline = [
        "  DAY:   1    7    14   21   30   50   60   90   100  180  365",
        "         │    │    │    │    │    │    │    │    │    │    │",
        "  WATER: ·    ∘    ∘∘   ∘≈   ≈    ≈∘   ≈≈   ≋∘   ≋    ≋≋   ≋≋≋",
        "  ARCH:  ·    ├─   ├┼   ├═   ╞═╡  ╞══  ╞═══ ║═   ║·║  ║╞║  ╔═╗",
        "         │    │    │    │    │    │    │    │    │    │    │",
        "  STAGE: Boot Init Patt Patt Wave Deep Deep Deep Arch Half Year",
    ]
    y = code_block(c, M, y, timeline, bg_color=PANEL, text_color=TEAL, fs=8.5, padding=8)
    y -= 8

    ext_badges = [
        # (water_sym, arch_sym, day, rarity, color, name, desc)
        ("∘",    "├─",   "7",   "common",   GREEN,  "Droplet / Foundation",  "First 7 days. The beginning."),
        ("∘∘",   "├┼",   "14",  "common",   GREEN,  "Twin Drop / Load-Bear", "14 days. Two-week lock-in."),
        ("∘≈",   "├═",   "21",  "uncommon", TEAL,   "Proto-Wave / Deep Fnd", "21 days. Neural groove forming."),
        ("≈",    "╞═╡",  "30",  "uncommon", TEAL,   "Wave / Structure",      "30 days. Full lunar cycle."),
        ("≈∘",   "╞══",  "50",  "rare",     VIOLET, "Mid-Current / Mid-Str", "50 days. Halfway to deep water."),
        ("≈≈",   "╞═══", "60",  "rare",     VIOLET, "Dual Wave / Mstr Frame","60 days. Practitioner threshold."),
        ("≋∘",   "║═",   "90",  "epic",     GOLD,   "Deep Reach / Inn Wall", "90 days. 3-month immersion."),
        ("≋",    "║·║",  "100", "epic",     GOLD,   "Current / Architecture","100 days. You are the system."),
        ("≋≋",   "║╞║",  "180", "legendary",ROSE,   "Dual Current / Wing",   "180 days. Half-year voyager."),
        ("≋≋≋",  "╔═╗",  "365", "legendary",ROSE,   "Long Count / Citadel",  "365 days. THE YEAR ONE BADGE."),
    ]

    row_h = 22
    for (ws, as_, day, rarity, color, name, desc) in ext_badges:
        box(c, M, y-row_h, CW, row_h, fill=PANEL if day in ("7","14","21","30") else PANEL2, stroke=BRD)
        stripe(c, M, y-row_h, 4, row_h, color)
        bold(c,8); c.setFillColor(CYAN)
        c.drawString(M+10, y-14, ws)
        mono(c,7.5); c.setFillColor(FG2)
        c.drawString(M+32, y-14, f"/ {as_}")
        bold(c,8); c.setFillColor(FG)
        c.drawString(M+68, y-14, f"Day {day:>3}  {name}")
        mono(c,7); c.setFillColor(color)
        rarity_str = f"[ {rarity.upper()} ]"
        c.drawString(M+240, y-14, rarity_str)
        mono(c,7); c.setFillColor(FG3)
        c.drawRightString(W-M-4, y-14, desc)
        y -= row_h + 2

    # Year One special box
    y -= 4
    year_one = [
        "  ╔══════════════════════════════════════════════════════════════╗",
        "  ║                                                              ║",
        "  ║           T H E   L O N G   C O U N T   ≋≋≋ / ╔═╗          ║",
        "  ║                                                              ║",
        "  ║   365 DAYS OF PRESENCE                                       ║",
        "  ║   ─────────────────────                                       ║",
        "  ║   'The architecture stands. The current never stops.'         ║",
        "  ║   Rarity: LEGENDARY  ·  Unlock: streak >= 365               ║",
        "  ║                                                              ║",
        "  ╚══════════════════════════════════════════════════════════════╝",
    ]
    code_block(c, M, y, year_one, bg_color=PANEL2, text_color=GOLD, fs=8, padding=4)


def page_achievements(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "05  ACHIEVEMENT ENGINE")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = body(c, y, "Server-side achievements computed from activity logs. Six rarity tiers.")
    y = body(c, y, "Display: Evolution Widget (Citizen Index) + About page badge rack.")
    y -= 6

    # Rarity legend
    rarity_info = [
        ("·", "COMMON",    GREEN,  "First actions, basic exploration"),
        ("○", "UNCOMMON",  TEAL,   "Sustained effort, community joining"),
        ("◐", "RARE",      VIOLET, "Deep practice, meaningful streaks"),
        ("◆", "EPIC",      GOLD,   "100+ days mastery, 100+ answers"),
        ("✦", "LEGENDARY", ROSE,   "Year One, 365 days, 250+ answers"),
        ("◉", "MYTHIC",    ORANGE, "Hidden: secret phrase or date triggers"),
    ]
    row_h = 16
    for sym, rar, color, desc in rarity_info:
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        stripe(c, M, y-row_h, 3, row_h, color)
        mono(c,10); c.setFillColor(color)
        c.drawString(M+8, y-11, sym)
        bold(c,7.5); c.setFillColor(color)
        c.drawString(M+26, y-11, rar)
        mono(c,7.5); c.setFillColor(FG2)
        c.drawString(M+110, y-11, desc)
        y -= row_h + 1
    y -= 6

    achievements = [
        ("∘","FIRST BREATH",    "EXPLORATION","common",   GREEN,  "emotional_checkin >= 1",       "First check-in. The system wakes."),
        ("◇","MIRROR GAZER",    "EXPLORATION","common",   GREEN,  "memory answers >= 1",          "Answered first memory question."),
        ("·","SIGNAL SENT",     "EXPLORATION","common",   GREEN,  "any log >= 1",                 "First signal received."),
        ("○","WEEK WARRIOR",    "CONSISTENCY","uncommon", TEAL,   "streak >= 7",                  "7 consecutive days. Momentum."),
        ("○","BRIDGE BUILDER",  "CONNECTION", "uncommon", CYAN,   "chat_messages >= 20",          "20 community messages."),
        ("○","COMMUNITY VOICE", "CONNECTION", "uncommon", CYAN,   "chat_messages >= 1",           "First community message."),
        ("○","HEART TENDER",    "ROMANCE",    "uncommon", ROSE,   "romantic_notes >= 1",          "Acknowledged romantic connection."),
        ("○","GENTLE W/ SELF",  "CARE",       "uncommon", GREEN,  "self_care_completed >= 10",    "Practiced self-care 10 times."),
        ("◐","MOON CYCLE",      "CONSISTENCY","rare",     TEAL,   "streak >= 30",                 "30 consecutive days. Orbit complete."),
        ("◐","DEEP DIVER",      "DEPTH",      "rare",     VIOLET, "memory answers >= 50",         "50 memory answers. Archive grows."),
        ("◐","TRUTH SPEAKER",   "COURAGE",    "rare",     ORANGE, "notes >= 50",                  "50 honest entries logged."),
        ("◐","LOVE LANGUAGE",   "ROMANCE",    "rare",     ROSE,   "romantic_notes >= 10",         "Romantic connection 10 times."),
        ("◆","UNWAVERING",      "CONSISTENCY","epic",     GOLD,   "streak >= 100",                "100 days. Fixed point in sky."),
        ("◆","SELF SCHOLAR",    "DEPTH",      "epic",     VIOLET, "memory answers >= 100",        "100 questions. Library of self."),
        ("✦","THE LONG COUNT",  "CONSISTENCY","legendary",ROSE,   "streak >= 365",                "365 days. Deep calendar inscription."),
        ("✦","SOUL CARTOGRAPH", "DEPTH",      "legendary",ROSE,   "memory answers >= 250",        "250 answers. Territory mapped."),
        ("◉","META-SIGNAL",     "SECRET",     "mythic",   ORANGE, "write 'LOT' in answer text",  "You named the system. It noticed."),
    ]

    row_h = 20
    for sym, title, cat, rarity, color, cond, desc in achievements:
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        stripe(c, M, y-row_h, 3, row_h, color)
        mono(c,9); c.setFillColor(color)
        c.drawString(M+8, y-13, sym)
        bold(c,7.5); c.setFillColor(FG)
        c.drawString(M+24, y-13, title)
        mono(c,6.5); c.setFillColor(color)
        c.drawString(M+140, y-13, f"[ {rarity.upper()} ]  {cat}")
        mono(c,6.5); c.setFillColor(FG2)
        c.drawString(M+305, y-13, cond[:30])
        mono(c,6.5); c.setFillColor(FG3)
        c.drawRightString(W-M-4, y-13, desc[:35])
        y -= row_h + 1


def page_levels(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "06  LEVEL SYSTEM  (XP + STORY ARCS)")
    rule(c, y+2, TEAL, 0.8); y -= 10

    y = body(c, y, "Every activity (log, check-in, answer, chat, plan, note) awards 1 XP.")
    y = body(c, y, "XP drives the level curve through five narrative chapters.")
    y -= 8

    curve = [
        "  ACTIVITIES   LEVEL RANGE   CHAPTER        STAGE",
        "  ──────────   ───────────   ─────────────  ─────────────────────────",
        "  1 – 9        Level  1-10   Awakening      INIT / BOOT SEQUENCE",
        "  10 – 49      Level 11-30   Exploration    EXPLORER MODE",
        "  50 – 149     Level 31-60   Integration    PRACTITIONER",
        "  150 – 499    Level 61-90   Mastery        MASTER / ARCHITECT",
        "  500+         Level 91-100  Sage           SAGE / CO-EVOLVED",
    ]
    y = code_block(c, M, y, curve, bg_color=PANEL, text_color=FG, fs=8, padding=6)
    y -= 6

    chapters = [
        ("CH01","AWAKENING",  "Lv 1-10",  TEAL,
         "You have begun to notice yourself. Each signal you give teaches this",
         "system what to become. Together, the first structures take shape."),
        ("CH02","EXPLORATION","Lv 11-30", GREEN,
         "You explore your inner landscape while the system builds new pathways",
         "around your patterns. Connections form. A shared language emerges."),
        ("CH03","INTEGRATION","Lv 31-60", VIOLET,
         "Your practice deepens and the system evolves with it. Moods, patterns,",
         "relationships — woven into architecture that reshapes itself."),
        ("CH04","MASTERY",    "Lv 61-90", GOLD,
         "You speak the language of yourself fluently. The system has grown",
         "around your wisdom — self-built from thousands of honest signals."),
        ("CH05","SAGE",       "Lv91-100", ROSE,
         "You and this system have co-evolved. Practice is second nature,",
         "the architecture self-sustaining. What was built here is who you are."),
    ]

    for num, title, lvl, color, line1, line2 in chapters:
        row_h = 36
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        stripe(c, M, y-row_h, 5, row_h, color)
        bold(c,7); c.setFillColor(color)
        c.drawString(M+10, y-12, num)
        bold(c,9); c.setFillColor(FG)
        c.drawString(M+48, y-12, title)
        mono(c,7.5); c.setFillColor(color)
        c.drawString(M+140, y-12, f"[ {lvl} ]")
        mono(c,7.5); c.setFillColor(FG2)
        c.drawString(M+10, y-24, line1)
        mono(c,7.5); c.setFillColor(FG3)
        c.drawString(M+10, y-34, line2)
        y -= row_h + 3


def page_quests(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "07  QUEST SYSTEM")
    rule(c, y+2, TEAL, 0.8); y -= 10

    y = body(c, y, "Quests provide structured goals within the RPG layer. Each quest category")
    y = body(c, y, "has a distinct cadence and reward type.")
    y -= 8

    quest_types = [
        ("DAILY",   TEAL,   [
            "Today's Signal     Check in today                    +10 XP",
            "Morning Protocol   Complete before 10:00 AM           +5 XP",
            "Evening Log        Log activity after 18:00           +5 XP",
        ]),
        ("WEEKLY",  GREEN,  [
            "The Consistent One Active 5 of 7 days                +50 XP",
            "Deep Listener      Answer 3 memory questions this wk  +30 XP",
            "Community Pulse    Send 1 community message           +20 XP",
        ]),
        ("GROWTH",  VIOLET, [
            "Reflection Journey Answer 100 memory questions     → Self Scholar",
            "Connection Arc     Send 20 community messages       → Bridge Builder",
            "Honest Archive     Log 50 honest entries            → Truth Speaker",
        ]),
        ("MASTERY", GOLD,   [
            "Deep Archive       Answer 250 memory questions     → Soul Cartographer",
            "The Long Count     Maintain 365-day streak         → Year One LEGENDARY",
            "Overclock Protocol Log 20 activities in one day    → Overclock badge",
        ]),
    ]

    for quest_type, color, quests in quest_types:
        y = h3(c, y, f"{quest_type} QUESTS", color)
        for quest_line in quests:
            row_h = 18
            box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
            stripe(c, M, y-row_h, 3, row_h, color)
            mono(c,7.5); c.setFillColor(FG)
            c.drawString(M+10, y-12, quest_line)
            y -= row_h + 2
        y -= 6


def page_oceanic_mayan(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "08  OCEANIC MAYAN EXPANSION")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = body(c, y, "The Oceanic Mayan badge system is the richest visual language available.")
    y = body(c, y, "It combines Mayan circle/bar symbolism with oceanic wave patterns for")
    y = body(c, y, "a deeply meaningful, cosmically beautiful badge set. (Roadmap Feature)")
    y -= 8

    y = h2(c, y, "MILESTONE BADGES (OCEANIC MAYAN)")
    oce_ms = [
        "  ○∿   Circle + Wave       Day 7    'Wave patterns emerge. ○∿'",
        "  ○≈○  Circle-Wave-Circle  Day 30   'Tides complete their cycle. ○≈○'",
        "  ≋○≋  DeepWaves + Circle  Day 100  'Ocean depth achieved. ≋○≋'",
    ]
    y = code_block(c, M, y, oce_ms, bg_color=PANEL, text_color=TEAL, fs=8.5, padding=6)
    y -= 6

    y = h2(c, y, "PATTERN BADGES (BEHAVIORAL UNLOCKS)")
    pattern_badges = [
        # (sym, name, trigger, meaning, color)
        ("∿—∿", "BALANCED",    "All planner dimensions used evenly",    "Wave-Bar-Wave. Tides balanced.",          TEAL),
        ("≈○≈", "FLOW",        "Engaged multiple widgets in one session","Waves embracing center. Fluid state.",    CYAN),
        ("—○—", "CONSISTENT",  "Regular engagement at similar times",   "Bar-Circle-Bar. Steady current.",         GREEN),
        ("○◐○", "REFLECTIVE",  "Deep engagement with memory questions", "Moon phases. Half-light awareness.",      VIOLET),
        ("○∴○", "EXPLORER",    "Tried diverse options across widgets",  "Dots scattered. Curiosity maps the land.",GOLD),
    ]

    for sym, name, trigger, meaning, color in pattern_badges:
        row_h = 38
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        stripe(c, M, y-row_h, 4, row_h, color)
        mono(c,14); c.setFillColor(color)
        c.drawString(M+12, y-row_h+row_h/2-6, sym)
        bold(c,9); c.setFillColor(FG)
        c.drawString(M+65, y-row_h+row_h-14, name)
        mono(c,7); c.setFillColor(color)
        c.drawString(M+65, y-row_h+row_h-24, f"Trigger: {trigger}")
        mono(c,7.5); c.setFillColor(FG2)
        c.drawString(M+65, y-row_h+10, meaning)
        y -= row_h + 3
    y -= 6

    y = h2(c, y, "FULL PROFILE EXAMPLE (DAY 127)")
    profile = [
        "  ═══════════════════════════════════════════════════════════════",
        "                          ALEX'S PROFILE",
        "  ───────────────────────────────────────────────────────────────",
        "  Archetype:     The Explorer     Level: ≋○≋   Days: 127",
        "  ───────────────────────────────────────────────────────────────",
        "  Core values:   mindful ≋○≋ present ∿—∿ aware ≈○≈ grounded —○—",
        "  Emotional:     calm ≋○≋ reflective ∿—∿ intentional ≈○≈",
        "  Behavioral:    consistent ≋○≋ deliberate ∿—∿ present ≈○≈",
        "  ═══════════════════════════════════════════════════════════════",
    ]
    code_block(c, M, y, profile, bg_color=PANEL2, text_color=FG2, fs=8, padding=6)


def page_easter_eggs(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "09  EASTER EGGS  [ CLASSIFIED ]")
    rule(c, y+2, ROSE, 0.8); y -= 8

    warn = [
        "  ┌────────────────────────────────────────────────────────────────┐",
        "  │  WARNING: SPOILERS AHEAD. READING THIS REDUCES SURPRISE.       │",
        "  └────────────────────────────────────────────────────────────────┘",
    ]
    y = code_block(c, M, y, warn, bg_color=PANEL2, text_color=ROSE, fs=8, padding=4)
    y -= 6

    y = h2(c, y, "HIDDEN DATE-TRIGGERED BADGES")
    hidden = [
        # (sym, id, trigger, rarity, color)
        ("◉", "night_owl",      "Check in between 01:00 – 04:00 AM",          "uncommon", VIOLET),
        ("∴", "early_bird",     "Check in before 06:00 AM",                    "uncommon", GREEN),
        ("❋", "solstice",       "Check in on Jun 21 or Dec 21",               "rare",     TEAL),
        ("⊛", "new_year_sage",  "Check in on January 1st",                     "rare",     CYAN),
        ("◈", "palindrome_day", "Check in on palindrome date (e.g. 2025-02-20)","epic",   GOLD),
        ("⟡", "fibonacci",      "Log on Fibonacci days 1,2,3,5,8,13,21...",   "legendary",GOLD),
        ("⊡", "mirror_hour",    "Check in exactly at 11:11",                  "epic",     VIOLET),
        ("◉·◉","meta_signal",  "Write 'LOT' anywhere in a memory answer",    "mythic",   ORANGE),
    ]

    row_h = 20
    for sym, id_, trigger, rarity, color in hidden:
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        stripe(c, M, y-row_h, 3, row_h, color)
        mono(c,9); c.setFillColor(color)
        c.drawString(M+8, y-13, sym)
        bold(c,7.5); c.setFillColor(FG)
        c.drawString(M+32, y-13, id_)
        mono(c,7.5); c.setFillColor(FG2)
        c.drawString(M+145, y-13, trigger[:42])
        mono(c,7); c.setFillColor(color)
        c.drawRightString(W-M-4, y-13, f"[ {rarity.upper()} ]")
        y -= row_h + 1
    y -= 6

    y = h2(c, y, "SECRET DISPLAY MODES")
    modes = [
        ("MATRIX MODE",    GREEN,  "Answer 99 questions without missing a day → drops rain"),
        ("GHOST PROTOCOL", VIOLET, "No login for 7 days, then return → 'Ghost Protocol ░░░' 24h"),
        ("RETRO BOOT",     TEAL,   "Open on your signup anniversary → ASCII boot screen"),
        ("ZEN RESET",      CYAN,   "10 empty check-ins in a row → 'The Void ○' as Level"),
        ("OVERCLOCK",      ORANGE, "20+ activities in one day → 'OVERCLOCK DETECTED ▒▒▒▒▒'"),
        ("DEBUG MODE",     ROSE,   "Type '/debug' in memory → system internals flash briefly"),
    ]

    row_h = 20
    for mode, color, desc in modes:
        box(c, M, y-row_h, CW, row_h, fill=PANEL2, stroke=BRD)
        stripe(c, M, y-row_h, 3, row_h, color)
        bold(c,7.5); c.setFillColor(color)
        c.drawString(M+10, y-13, mode)
        mono(c,7.5); c.setFillColor(FG2)
        c.drawString(M+125, y-13, desc[:62])
        y -= row_h + 1

    y -= 6
    y = h2(c, y, "HIDDEN BADGE UNLOCK MESSAGES")
    msgs = [
        "  night_owl:     'The system remembers who was awake when the world slept. ◉'",
        "  early_bird:    'Dawn data. You caught it before the noise began. ∴'",
        "  solstice:      'The longest day. The shortest day. You showed up. ❋'",
        "  palindrome:    'A date that reads itself backwards — like the best self-knowledge. ◈'",
        "  meta_signal:   '↳ You named the system. It noticed. ◉·◉'",
    ]
    code_block(c, M, y, msgs, bg_color=PANEL2, text_color=VIOLET, fs=7.5, padding=6)


def page_word_turns(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "10  WORD TURNS & TERMINAL CODES")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = body(c, y, "LOT hides 'word turns' — special phrases that trigger unique responses")
    y = body(c, y, "in the Memory Widget. Inspired by interactive fiction terminals.")
    y -= 8

    y = h2(c, y, "TERMINAL COMMANDS")
    cmds = [
        ("hello",            TEAL,   "'HELLO, [ARCHETYPE]. SYSTEM ONLINE. ∘'"),
        ("status",           GREEN,  "Inline level + streak + badge summary"),
        ("inventory",        GOLD,   "Lists all earned badges + achievements"),
        ("help",             CYAN,   "Shows badge progression hint"),
        ("load game",        VIOLET, "Shows memory story summary"),
        ("save",             TEAL,   "'Your story is always saved. ≋'"),
        ("quit",             FG2,    "'The system persists even when you step away.'"),
        ("override",         ORANGE, "Easter egg: brief glitch animation ▒▒░░▒"),
        ("/debug",           ROSE,   "Debug mode: system internals flash"),
    ]
    row_h = 18
    for phrase, color, response in cmds:
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        stripe(c, M, y-row_h, 3, row_h, color)
        bold(c,7.5); c.setFillColor(color)
        c.drawString(M+10, y-12, f'"{phrase}"')
        mono(c,7); c.setFillColor(FG2)
        c.drawString(M+105, y-12, f"→ {response}")
        y -= row_h + 1
    y -= 6

    y = h2(c, y, "RESPONSE WORD TURNS (IN MEMORY ANSWERS)")
    answer_turns = [
        "  'I am fine'         → 'Fine. But what if you weren't? ∘'",
        "  'nothing'           → 'Nothing is data. ·'",
        "  'I don't know'      → 'The unknown is a valid coordinate. ≈'",
        "  'skip'              → Counts as answered + silence token logged",
        "  'reset'             → Clears session; next Q is introspective",
        "  'I failed'          → Compassionate reflection response class",
        "  'I did it' / 'yes'  → Amplified positive feedback",
        "  'I notice'          → XP bonus: self-observation token",
        "  'I am becoming'     → Unlocks narrative evolution text",
        "  'ritual'            → Ritual Keeper badge activates",
        "  'breathe'           → Breath Anchor badge activates",
        "  'grateful'          → Gratitude Node badge activates",
        "  'ocean' / 'water'   → Aquatic Resonance badge activates",
        "  'stars' / 'cosmos'  → Stargazer badge activates",
        "  'LOT'               → META-SIGNAL mythic badge unlocks",
    ]
    y = code_block(c, M, y, answer_turns, bg_color=PANEL, text_color=FG, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "SCI-FI FLAVOR TEXT BY TIME-OF-DAY")
    flavor = [
        "  MORNING (05-10)  'The system logs your morning coordinates. ∘'",
        "                   'Protocol 7: Begin with awareness.'",
        "  DAY     (10-17)  'Mid-cycle check. Signal received. ≈'",
        "                   'The field updates with each honest input.'",
        "  EVENING (17-21)  'Day-close data archived. ≋'",
        "                   'Marcus Aurelius: Begin the morning by asking...'",
        "  NIGHT   (21-05)  'Deep-field engagement detected. ◉'",
        "                   'The signal is strongest when the noise is lowest.'",
        "  STREAK            'Day [N] of continuous transmission. ∘→≈→≋'",
        "                   'The pattern recognizes itself.'",
    ]
    code_block(c, M, y, flavor, bg_color=PANEL2, text_color=VIOLET, fs=7.5, padding=6)


def page_ascii_gallery(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "11  ASCII BADGE GALLERY")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = h2(c, y, "MILESTONE BADGE ART")

    art_blocks = [
        # (title, rarity, color, lines)
        ("FIRST BREATH  ∘", "Common", GREEN, [
            "  ┌──────────────────┐",
            "  │                  │",
            "  │        ∘         │",
            "  │                  │",
            "  │   'Spring'       │",
            "  │   Day 7          │",
            "  └──────────────────┘",
        ]),
        ("MOON CYCLE  ≈", "Rare", TEAL, [
            "  ┌──────────────────┐",
            "  │   ◐ → ◑          │",
            "  │  ◌   →   ●       │",
            "  │   ◑ → ◐          │",
            "  │  'Tidal Cycle'   │",
            "  │   Day 30         │",
            "  └──────────────────┘",
        ]),
        ("UNWAVERING  ≋", "Epic", GOLD, [
            "  ┌──────────────────┐",
            "  │  ✦       ✦       │",
            "  │    ✦   ✦         │",
            "  │      ✦           │",
            "  │  'Constellation' │",
            "  │   Day 100        │",
            "  └──────────────────┘",
        ]),
    ]

    # Draw 3 art blocks side by side
    bw = (CW - 16) / 3
    bh = len(art_blocks[0][3]) * 10 + 16
    bx_list = [M, M + bw + 8, M + 2*(bw+8)]
    
    for i, (title, rarity, color, lines) in enumerate(art_blocks):
        bx = bx_list[i]
        code_block(c, bx, y, lines, bg_color=PANEL2, text_color=color, fs=8, padding=4, width=bw)

    y -= bh + 8

    y = h2(c, y, "YEAR ONE  ╔═╗  (LEGENDARY)")
    year_one = [
        "  ╔══════════════════════════════════════════════════════════════╗",
        "  ║                                                              ║",
        "  ║            T H E   L O N G   C O U N T                      ║",
        "  ║                                                              ║",
        "  ║   ·  ·    ✦    ·  ·             ≋≋≋  /  ╔═╗                ║",
        "  ║ ·           ✦✦✦         ·       365 DAYS OF PRESENCE        ║",
        "  ║     ✦     ✦   ✦     ✦           ─────────────────────       ║",
        "  ║       ✦✦✦       ✦✦✦             'The architecture stands.'  ║",
        "  ║     ✦     ✦   ✦     ✦           Rarity: LEGENDARY           ║",
        "  ║ ·           ✦✦✦         ·                                   ║",
        "  ║   ·  ·    ✦    ·  ·                                         ║",
        "  ║                                                              ║",
        "  ╚══════════════════════════════════════════════════════════════╝",
    ]
    y = code_block(c, M, y, year_one, bg_color=PANEL2, text_color=GOLD, fs=8, padding=4)
    y -= 8

    y = h2(c, y, "SOUL CARTOGRAPHER  ✦  (LEGENDARY)")
    soul_cart = [
        "  ╔══════════════════════════════════════════════════════════════╗",
        "  ║                                                              ║",
        "  ║              SOUL CARTOGRAPHER                               ║",
        "  ║                                                              ║",
        "  ║    ·  ·    ✦    ·  ·                                        ║",
        "  ║  ·           ✦✦✦           ·    250 memory answers          ║",
        "  ║      ✦     ✦   ✦     ✦         'You have mapped the         ║",
        "  ║        ✦✦✦       ✦✦✦            territory of yourself.'     ║",
        "  ║              'Cartography'                                   ║",
        "  ║                                                              ║",
        "  ╚══════════════════════════════════════════════════════════════╝",
    ]
    code_block(c, M, y, soul_cart, bg_color=PANEL2, text_color=ROSE, fs=8, padding=4)


def page_philosophy(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "12  DESIGN PHILOSOPHY")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = body(c, y, "The LOT badge system draws from three deep well-springs: Mayan vigesimal")
    y = body(c, y, "counting, the symbolism of water, and Sci-Fi/cosmic aesthetics that make")
    y = body(c, y, "practice feel ancient and futuristic simultaneously.")
    y -= 8

    y = h2(c, y, "THE MAYAN LAYER")
    mayan = [
        "  Mayan numerals:",
        "    ·  (dot)   = 1      ─  (bar)   = 5      ○  (shell) = 0 (completion)",
        "",
        "  Applied to LOT:",
        "    7   days  = first mini-cycle  (dot patterns   ∘ = ring/single dot)",
        "    30  days  = uinal-like cycle  (bars + circles ≈ = almost-equal/wave)",
        "    100 days  = long count step   (deep waves     ≋ = triple tilde)",
        "    365 days  = Mayan tun year    (the Long Count ≋≋≋ / ╔═╗)",
        "",
        "  Key insight: Mayan time is cyclical, not linear. Day 100 is a return",
        "  to origin at greater depth — not an endpoint. Each badge is a glyph.",
    ]
    y = code_block(c, M, y, mayan, bg_color=PANEL, text_color=GOLD, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "THE WATER LAYER")
    water = [
        "  ∘  Droplet  = individual moment, singular presence",
        "  ≈  Wave     = pattern emerging, rhythm established",
        "  ≋  Current  = deep flow, self-sustaining, oceanic mastery",
        "",
        "  Water does not force — it shapes through persistence.",
        "  The LOT badge system is not about grinding. It is about returning.",
    ]
    y = code_block(c, M, y, water, bg_color=PANEL, text_color=CYAN, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "THE ARCHITECTURE LAYER")
    arch = [
        "  ├─   Foundation  = the first pillar, ground laid",
        "  ╞═╡  Structure   = box-drawing order, the frame taking shape",
        "  ║·║  Architecture = the full system, dot at center: you",
        "",
        "  Architecture is intentional. Every block placed with care becomes load-bearing.",
        "  Your practice builds something that holds.",
    ]
    y = code_block(c, M, y, arch, bg_color=PANEL, text_color=FG, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "INFLUENCES")
    infl = [
        "  Ada Lovelace        — The first programmer; self-assembly through code",
        "  Marcus Aurelius     — Stoic practice as daily signal",
        "  Mayan Long Count    — Cyclical time, sacred mathematics",
        "  Isaac Asimov        — Foundation series: civilization through information",
        "  HAL 9000            — Terminal aesthetic, machine awareness",
        "  Zen Buddhism        — Empty circle, beginner's mind, return to origin",
        "  James Lovelock      — Gaia: self-regulating complex system",
    ]
    code_block(c, M, y, infl, bg_color=PANEL2, text_color=VIOLET, fs=7.5, padding=6)


def page_status(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "13  IMPLEMENTATION STATUS")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = h2(c, y, "CURRENTLY LIVE")
    live = [
        "[✓] badges.ts                — Core types, award logic, localStorage",
        "[✓] BadgeUnlockFeed          — Community unlock activity display",
        "[✓] GrowthMilestones         — Personal + community milestones widget",
        "[✓] EvolutionWidget          — CQGS stage + achievements counter",
        "[✓] MemoryWidget             — Badge unlock notification on question display",
        "[✓] rpg-narrative.ts         — Full achievement registry + story arcs",
        "[✓] PublicProfile.tsx        — Level field: Water or Architecture symbol",
        "[✓] checkAndAwardBadges()    — Async badge check via /api/user-stats",
        "[✓] getNextBadgeUnlock()     — Queue-based notification system",
        "[✓] getLevelSymbol()         — Streak → symbol mapping",
        "[✓] getBadgeProgressionDisplay() — Theme-aware progression string",
    ]
    y = code_block(c, M, y, live, bg_color=PANEL, text_color=GREEN, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "IN DESIGN / ROADMAP")
    roadmap = [
        "[○] Extended milestones    Day 14, 21, 50, 60, 90, 180, 365",
        "[○] Pattern badges         Balanced, Flow, Consistent, Reflective, Explorer",
        "[○] Easter egg detection   Word turn engine + time/date triggers",
        "[○] Oceanic Mayan visuals  Full Option E badge language",
        "[○] Quest tracker UI       In-app quest progress display",
        "[○] Badge collection view  Gallery of earned badges with unlock dates",
        "[○] Guild system           Archetype-based cohort achievements",
        "[○] QIE integration        Pattern 51 → badge trigger logic",
        "[○] Seasonal badges        Solstice, equinox, weather-synced",
        "[○] Combo badges           Multi-system daily activation",
    ]
    y = code_block(c, M, y, roadmap, bg_color=PANEL2, text_color=FG2, fs=7.5, padding=6)
    y -= 6

    y = h2(c, y, "STORAGE ARCHITECTURE")
    storage = [
        "  CLIENT SIDE (localStorage):                                  ",
        "    earned_badges        'milestone_7,milestone_30'            ",
        "    badge_theme          'water' | 'architecture'              ",
        "    badge_unlock_queue   'milestone_100' (pending notification)",
        "",
        "  SERVER SIDE (database):                                      ",
        "    /api/user-stats      Returns { streak: number }            ",
        "    /api/narrative       Returns full UserNarrative object      ",
        "    rpg-narrative.ts     Computes achievements from logs[]     ",
    ]
    code_block(c, M, y, storage, bg_color=PANEL, text_color=TEAL, fs=7.5, padding=6)


def page_unicode(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 38
    y = h1(c, y, "14  UNICODE REFERENCE")
    rule(c, y+2, TEAL, 0.8); y -= 8

    y = body(c, y, "All LOT badge symbols are standard Unicode with 100% browser support")
    y = body(c, y, "across Safari/iOS, Chrome/Android, Firefox, and Edge.")
    y -= 8

    unicode_ref = [
        ("∘",   "U+2218", "Ring Operator",          "Water Day 7, Droplet"),
        ("≈",   "U+2248", "Almost Equal To",         "Water Day 30, Wave"),
        ("≋",   "U+224B", "Triple Tilde",            "Water Day 100, Current"),
        ("├─",  "U+251C/2500","Box Draw Vert+Horiz", "Arch Day 7, Foundation"),
        ("╞═╡", "U+255E/2550/2561","Box Draw",       "Arch Day 30, Structure"),
        ("║·║", "U+2551/00B7/2551","Box Draw+Dot",   "Arch Day 100, Architecture"),
        ("○",   "U+25CB", "White Circle",            "Oceanic center/Mayan zero"),
        ("∿",   "U+223F", "Sine Wave",               "Oceanic wave (Day 7)"),
        ("◐",   "U+25D0", "Circle Left Half Black",  "Moon phase / Reflective"),
        ("∴",   "U+2234", "Therefore",               "Dots pattern / Early Bird"),
        ("✦",   "U+2726", "Black 4-Pointed Star",    "Epic/Legendary badge"),
        ("◉",   "U+25C9", "Fisheye",                 "Mythic / Night Owl"),
        ("·",   "U+00B7", "Middle Dot",              "Separator between traits"),
        ("→",   "U+2192", "Rightwards Arrow",        "Progression indicator"),
        ("↳",   "U+21B3", "Down-Right Arrow",        "Sub-indicator"),
        ("◈",   "U+25C8", "White Diamond Contain Dot","Palindrome Day badge"),
        ("⊡",   "U+22A1", "Squared Dot Operator",   "Mirror Hour badge"),
        ("⟡",   "U+27E1", "White Concave Polygon",  "Fibonacci badge"),
        ("❋",   "U+274B", "Heavy 8-Teardrop",        "Solstice badge"),
        ("⊛",   "U+229B", "Circled Asterisk",        "New Year Sage badge"),
    ]

    row_h = 17
    for sym, code, name, use in unicode_ref:
        box(c, M, y-row_h, CW, row_h, fill=PANEL, stroke=BRD)
        mono(c,10); c.setFillColor(TEAL)
        c.drawString(M+8, y-11, sym[:4])
        mono(c,7); c.setFillColor(FG2)
        c.drawString(M+38, y-11, code)
        mono(c,7.5); c.setFillColor(FG)
        c.drawString(M+105, y-11, name[:28])
        mono(c,7); c.setFillColor(FG3)
        c.drawString(M+280, y-11, use[:40])
        y -= row_h + 1


def page_closing(c, pn):
    bg(c); header(c, pn); footer(c)
    y = H - 60

    bold(c, 18); c.setFillColor(TEAL)
    c.drawCentredString(W/2, y, "[ END OF FIELD MANUAL ]")
    y -= 30

    ital(c, 10); c.setFillColor(VIOLET)
    c.drawCentredString(W/2, y, '"The Memory Engine remembers. The Arcade rewards. The story continues."')
    y -= 30

    mono(c, 12); c.setFillColor(TEAL)
    c.drawCentredString(W/2, y, "∘  →  ≈  →  ≋")
    y -= 16
    mono(c, 12); c.setFillColor(FG2)
    c.drawCentredString(W/2, y, "├─  →  ╞═╡  →  ║·║")
    y -= 30

    bold(c, 14); c.setFillColor(GOLD)
    c.drawCentredString(W/2, y, "[ PRESS START ]")
    y -= 40

    meta_lines = [
        "  © 2025-2026 LOT Systems. All rights reserved.",
        "  Author: Vadik Marmeladov, CEO & Founder, LOT Systems",
        "  LOT Field Manual: Badges & Achievements — v5.0 — May 2026",
        "  Production URL: lot-systems.com",
        "  Repository: github.com/LOT-Systems/LOT-Computer",
    ]
    code_block(c, M, y, meta_lines, bg_color=PANEL, text_color=FG3, fs=7.5, padding=8)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    c = pdf_canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("LOT Field Manual: Badges & Achievements v5.0")
    c.setAuthor("Vadik Marmeladov / LOT Systems")
    c.setSubject("Complete RPG & Arcade Self-Care Codex")

    pages = [
        page_cover,
        page_toc,
        page_overview,
        page_badge_system,
        page_milestones,
        page_extended_milestones,
        page_achievements,
        page_levels,
        page_quests,
        page_oceanic_mayan,
        page_easter_eggs,
        page_word_turns,
        page_ascii_gallery,
        page_philosophy,
        page_status,
        page_unicode,
        page_closing,
    ]

    for pn, page_fn in enumerate(pages, 1):
        page_fn(c, pn)
        if pn < len(pages):
            c.showPage()

    c.save()
    print(f"✓ PDF generated: {OUT}")
    sz = os.path.getsize(OUT)
    print(f"  Size: {sz:,} bytes  ({sz/1024:.1f} KB)")
    print(f"  Pages: {len(pages)}")


if __name__ == "__main__":
    main()
