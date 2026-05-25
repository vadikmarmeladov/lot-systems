#!/usr/bin/env python3
"""
LOT Computer — Badges, Achievements & RPG/Arcade System PDF Generator
Uses reportlab. Outputs: docs/LOT_BADGES_AND_ACHIEVEMENTS.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white, black

# ── Page setup ────────────────────────────────────────────────────────────────
W, H = A4  # 595.3 x 841.9 pt
LM = 14 * mm
RM = W - 14 * mm
TM = 12 * mm
BM = 14 * mm
COL_W = RM - LM

# ── Palette ───────────────────────────────────────────────────────────────────
BG      = HexColor("#0a0a0a")
PANEL   = HexColor("#121212")
BORDER  = HexColor("#282828")
DIM     = HexColor("#505050")
MID     = HexColor("#787878")
BRIGHT  = HexColor("#c8c8c8")
WHITE_  = HexColor("#f0f0f0")
ACCENT  = HexColor("#b4dcff")
GOLD    = HexColor("#ffd76e")
GREEN_  = HexColor("#64dc8c")
RED_    = HexColor("#dc6464")
PURPLE_ = HexColor("#b478ff")
CYAN_   = HexColor("#64dcdc")
ORANGE_ = HexColor("#ffaa50")

# ── Font helpers ──────────────────────────────────────────────────────────────
MONO = "Courier"
MONO_B = "Courier-Bold"
MONO_I = "Courier-Oblique"

os.makedirs("docs", exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
class LOTPdf:
    """Minimal reportlab wrapper for terminal-style LOT PDF."""

    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.path = path
        self.page_num = 0
        self._new_page()

    def _new_page(self):
        self.page_num += 1
        c = self.c
        # Background fill
        c.setFillColor(BG)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        self.y = H - TM - 6 * mm

    def save(self):
        self.c.save()
        print(f"PDF saved: {self.path}")

    def new_page(self):
        self._footer()
        self.c.showPage()
        self._new_page()
        c = self.c
        c.setFillColor(BG)
        c.rect(0, 0, W, H, fill=1, stroke=0)

    def _footer(self):
        c = self.c
        c.setFont(MONO, 5.5)
        c.setFillColor(DIM)
        txt = f"[ {self.page_num} ]   LOT Computer — Badges & Achievements   —   lot-systems.com"
        c.drawCentredString(W / 2, BM - 4 * mm, txt)

    # ── Drawing helpers ───────────────────────────────────────────────────────

    def h_line(self, color=BORDER):
        c = self.c
        c.setStrokeColor(color)
        c.setLineWidth(0.3)
        c.line(LM, self.y, RM, self.y)
        self.y -= 2.5 * mm

    def section_title(self, txt, color=ACCENT):
        self.y -= 3 * mm
        c = self.c
        c.setFont(MONO_B, 8.5)
        c.setFillColor(color)
        c.drawString(LM, self.y, txt)
        self.y -= 1.5 * mm
        self.h_line(color=color)

    def sub_title(self, txt, color=BRIGHT):
        self.y -= 1.5 * mm
        c = self.c
        c.setFont(MONO_B, 7.5)
        c.setFillColor(color)
        c.drawString(LM, self.y, txt)
        self.y -= 3.5 * mm

    def body(self, txt, color=MID, size=6.5):
        c = self.c
        c.setFont(MONO, size)
        c.setFillColor(color)
        for line in txt.split("\n"):
            c.drawString(LM, self.y, line)
            self.y -= 3.5 * mm

    def row(self, *cells, sizes=None, colors=None, font=MONO, size=6.5):
        """Draw a table row. cells=list of strings, sizes=list of col widths (mm)."""
        c = self.c
        x = LM
        for i, cell in enumerate(cells):
            fc = (colors[i] if colors and i < len(colors) else MID)
            fn = (MONO_B if font == MONO_B else MONO)
            c.setFont(fn, size)
            c.setFillColor(fc)
            c.drawString(x, self.y, str(cell))
            if sizes:
                x += sizes[i] * mm
            else:
                x += COL_W / len(cells)
        self.y -= 3.5 * mm

    def panel(self, lines, title="", bk=PANEL, border_c=BORDER):
        c = self.c
        h_per_line = 3.4 * mm
        title_h = 4.5 * mm if title else 0
        total_h = len(lines) * h_per_line + title_h + 4 * mm
        # draw panel box
        c.setFillColor(bk)
        c.setStrokeColor(border_c)
        c.setLineWidth(0.3)
        c.rect(LM, self.y - total_h, COL_W, total_h, fill=1, stroke=1)
        inner_y = self.y - 2 * mm
        if title:
            c.setFont(MONO_B, 7)
            c.setFillColor(ACCENT)
            c.drawString(LM + 3 * mm, inner_y, title)
            inner_y -= title_h
        c.setFont(MONO, 6.5)
        c.setFillColor(BRIGHT)
        for ln in lines:
            c.drawString(LM + 3 * mm, inner_y, ln)
            inner_y -= h_per_line
        self.y -= total_h + 2 * mm

    def badge_row(self, symbol, name, desc, rc=GREEN_):
        c = self.c
        c.setFont(MONO_B, 7.5)
        c.setFillColor(rc)
        c.drawString(LM, self.y, symbol)
        c.setFont(MONO_B, 7)
        c.setFillColor(BRIGHT)
        c.drawString(LM + 22 * mm, self.y, name)
        c.setFont(MONO, 6.5)
        c.setFillColor(MID)
        c.drawString(LM + 60 * mm, self.y, desc)
        self.y -= 3.8 * mm

    def check_page(self, needed_mm=20):
        if self.y < BM + needed_mm * mm:
            self.new_page()

# ══════════════════════════════════════════════════════════════════════════════
#  BUILD
# ══════════════════════════════════════════════════════════════════════════════

pdf = LOTPdf("docs/LOT_BADGES_AND_ACHIEVEMENTS.pdf")
c = pdf.c

# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 1  COVER
# ─────────────────────────────────────────────────────────────────────────────

# Header chrome bar
c.setFillColor(PANEL)
c.rect(0, H - 14 * mm, W, 14 * mm, fill=1, stroke=0)
c.setFont(MONO, 6)
c.setFillColor(DIM)
c.drawString(LM, H - 8 * mm, "lot-systems.com   //   LOT Computer v1.x   //   BADGES & ACHIEVEMENTS SYSTEM")

# Title
c.setFont(MONO_B, 22)
c.setFillColor(WHITE_)
c.drawCentredString(W / 2, H - 46 * mm, "LOT COMPUTER")

c.setFont(MONO_B, 10)
c.setFillColor(ACCENT)
c.drawCentredString(W / 2, H - 56 * mm, "Badges   *   Achievements   *   RPG & Arcade System")

c.setFont(MONO, 7)
c.setFillColor(DIM)
c.drawCentredString(W / 2, H - 63 * mm, "Complete System Reference  |  May 2026  |  Version 1.0")

# Divider
c.setStrokeColor(ACCENT)
c.setLineWidth(0.5)
c.line(LM, H - 67 * mm, RM, H - 67 * mm)

# Tagline
c.setFont(MONO_B, 9)
c.setFillColor(GOLD)
c.drawCentredString(W / 2, H - 74 * mm, '"The RPG + Arcade of Self-Care"')

# ASCII art (simplified)
logo_y = H - 82 * mm
logo_lines = [
    "  =================================================================",
    "  |                                                               |",
    "  |    L  O  T   C  O  M  P  U  T  E  R                          |",
    "  |                                                               |",
    "  |    o -> ~ -> ~       Live On Terms       |-- -> |=| -> ||.|| |",
    "  |                                                               |",
    "  |    Quantum Intent Engine  *  Self-Care OS  *  Arcade Mode     |",
    "  |                                                               |",
    "  =================================================================",
]
c.setFont(MONO, 6.5)
c.setFillColor(DIM)
for ln in logo_lines:
    c.drawCentredString(W / 2, logo_y, ln)
    logo_y -= 3.8 * mm

pdf.y = logo_y - 4 * mm

# Contents
pdf.h_line(color=BORDER)
pdf.section_title("CONTENTS", color=ACCENT)

contents = [
    ("1", "Badge System Overview",           "Water & Architecture Dual-Theme"),
    ("2", "Milestone Badges",                "Core 3-Tier Progression  o -> ~ -> ~"),
    ("3", "Achievement Catalogue",           "14 Achievements across 7 Dimensions"),
    ("4", "Interface Evolution System",      "7 Dimensions  *  5 Layout Density Levels"),
    ("5", "Narrative & Quest System",        "RPG Story Arc  *  Active Quests  *  Unlocks"),
    ("6", "Easter Eggs & Secret Badges",     "Hidden Triggers  *  Word Turns  *  Combos"),
    ("7", "Arcade Achievements",             "Micro-Games  *  Magic Times  *  Sequences"),
    ("8", "Sci-Fi / Computer Lore Badges",   "Terminal Culture  *  Sci-Fi  *  Seasonal"),
    ("9", "Full ASCII Badge Registry",       "Complete Symbol Reference  (80+ badges)"),
    ("10","Unlock Triggers & Logic",         "How Each Badge Is Earned  *  Award Pipeline"),
]
for num, title, sub in contents:
    c.setFont(MONO_B, 7)
    c.setFillColor(BRIGHT)
    c.drawString(LM, pdf.y, f"{num}.")
    c.drawString(LM + 8 * mm, pdf.y, title)
    c.setFont(MONO, 6.5)
    c.setFillColor(DIM)
    c.drawString(LM + 75 * mm, pdf.y, sub)
    pdf.y -= 4 * mm

pdf.h_line()
c.setFont(MONO_I, 6.5)
c.setFillColor(DIM)
quote = (
    "Every badge, quest, and easter egg in LOT is designed around one principle: "
    "self-care should feel as addictive"
)
quote2 = "as the best arcade games you ever played. The system evolves with you. You evolve with the system."
c.drawCentredString(W / 2, pdf.y, quote)
pdf.y -= 4 * mm
c.drawCentredString(W / 2, pdf.y, quote2)


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 2  BADGE SYSTEM OVERVIEW
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("1. BADGE SYSTEM OVERVIEW")

pdf.body(
    "LOT's badge system uses two parallel metaphors for growth. Each user chooses their\n"
    "preferred theme — Water (organic flow) or Architecture (deliberate construction).\n"
    "Symbols are pure ASCII/Unicode: no emoji, no images. Just marks.",
    color=BRIGHT
)

pdf.sub_title("DUAL THEME DESIGN")
pdf.panel([
    "WATER THEME              o  -->  ~  -->  ~",
    "  o  Droplet   Day 7    First drops form. Presence establishing.",
    "  ~  Wave      Day 30   Waves begin to flow. Rhythm emerges.",
    "  ~  Current   Day 100  Deep currents established. Mastery.",
    "",
    "ARCHITECTURE THEME       |--  -->  |=|  -->  ||.||",
    "  |--  Foundation  Day 7    Foundation laid. Structure begins to rise.",
    "  |=|  Structure   Day 30   Architecture emerges. Each piece finds place.",
    "  ||.|| Mastery    Day 100  The system breathes with you.",
], title="PROGRESSION SYMBOLS (Unicode-safe rendering)")

pdf.sub_title("BADGE STORAGE & MECHANICS")
data = [
    ("Storage:",        "localStorage key: earned_badges  (comma-separated badge IDs)"),
    ("Theme pref:",     "localStorage key: badge_theme  [ water | architecture ]"),
    ("Unlock queue:",   "localStorage key: badge_unlock_queue  (FIFO notification)"),
    ("Race guard:",     "awardingBadge mutex -- prevents duplicate awards in multi-tab"),
    ("Check trigger:",  "checkAndAwardBadges() polls /api/user-stats for streak data"),
    ("Notification:",   "Memory Widget renders unlock toast on next appearance"),
]
for lbl, val in data:
    c.setFont(MONO_B, 7)
    c.setFillColor(BRIGHT)
    c.drawString(LM, pdf.y, lbl)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 28 * mm, pdf.y, val)
    pdf.y -= 3.8 * mm

pdf.check_page(30)
pdf.sub_title("SEPARATOR SYSTEM")
pdf.panel([
    "Separator dot:  *  (DEFAULT_SEPARATOR -- used before first badge earned)",
    "Sub-indicator:  ->  (SUB_INDICATOR -- hierarchical display prefix)",
    "Progression:    -->  (PROGRESSION_ARROW -- milestone chain display)",
    "",
    "Profile Level field (dedicated row under Awareness Level):",
    "  Day 1-6   :  (empty)   -- system builds in silence",
    "  Day 7+    :  o  or  |--    (theme-dependent)",
    "  Day 30+   :  ~  or  |=|",
    "  Day 100+  :  ~  or  ||.||",
], title="SEPARATOR & LEVEL DISPLAY")

pdf.sub_title("BADGE THEME AESTHETICS")
pdf.body(
    "Water     -->  Fluid animations  *  Organic curves  *  Radial gradients  *  Wave animations\n"
    "Architect -->  Geometric precision  *  Structural depth  *  Linear gradients  *  Pulse animations",
    color=MID
)


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 3  MILESTONE BADGES
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("2. MILESTONE BADGES  --  CORE 3-TIER PROGRESSION")

pdf.body(
    "Milestone badges are earned by sustained streak (consecutive active days).\n"
    "They are the backbone of the LOT progression system -- the clearest signal\n"
    "that the practice has taken root.",
    color=BRIGHT
)

pdf.sub_title("TIER 1  --  FIRST DROPS / FOUNDATION  [ Day 7 ]", color=GREEN_)
pdf.panel([
    "Water symbol   :  o    (Ring/droplet)",
    "Arch  symbol   :  |--  (Box Drawing characters)",
    "Water name     :  Droplet",
    "Arch  name     :  Foundation",
    "Water unlock   :  -> First drops form [o]",
    "Arch  unlock   :  -> Foundation laid [|--]",
    "Trigger        :  streak >= 7  AND  milestone_7 not yet earned",
    "Rarity         :  Common   |   XP value: +50",
], title="TIER 1")

pdf.sub_title("TIER 2  --  WAVES BEGIN / STRUCTURE  [ Day 30 ]", color=ACCENT)
pdf.panel([
    "Water symbol   :  ~    (Wave)",
    "Arch  symbol   :  |=|  (Box Drawing characters)",
    "Water name     :  Wave",
    "Arch  name     :  Structure",
    "Water unlock   :  -> Waves begin to flow [~]",
    "Arch  unlock   :  -> Structure rises [|=|]",
    "Trigger        :  streak >= 30  AND  milestone_30 not yet earned",
    "Rarity         :  Uncommon   |   XP value: +200",
], title="TIER 2")

pdf.sub_title("TIER 3  --  DEEP CURRENT / ARCHITECTURE  [ Day 100 ]", color=GOLD)
pdf.panel([
    "Water symbol   :  ~~    (Deep Wave)",
    "Arch  symbol   :  ||.||  (Box Drawing characters)",
    "Water name     :  Current",
    "Arch  name     :  Architecture",
    "Water unlock   :  -> Deep currents established [~~]",
    "Arch  unlock   :  -> Architecture complete [||.||]",
    "Trigger        :  streak >= 100  AND  milestone_100 not yet earned",
    "Rarity         :  Rare   |   XP value: +1000",
], title="TIER 3")

pdf.sub_title("MILESTONE VISUAL PROGRESSION")
pdf.panel([
    "[ WATER ]                  [ ARCHITECTURE ]",
    "  Day 1    *                 Day 1    *",
    "  Day 7    o                 Day 7    |--",
    "  Day 30   ~                 Day 30   |=|",
    "  Day 100  ~~                Day 100  ||.||",
    "",
    "Badge chain:  o --> ~ --> ~~   |   |-- --> |=| --> ||.||",
    "Level field lives under Awareness Level in Public Profile.",
], title="VISUAL PROGRESSION")

pdf.sub_title("OCEANIC MAYAN EXTENDED VARIANTS  (alt design options)")
pdf.panel([
    "  Milestone symbols from Mayan water + cyclic time philosophy:",
    "  Day 7    :  o~    (Circle + Wave)  -- individual riding first wave",
    "  Day 30   :  o~~o  (Circle-Wave-Circle)  -- complete tide cycle",
    "  Day 100  :  ~~o~~ (Deep Waves + Circle)  -- ocean depth mastery",
    "",
    "  Pattern badges (earn through behavior, not time):",
    "  ~-~   Balanced  -- all planner dimensions used evenly",
    "  ~o~   Flow      -- multiple widgets in one session",
    "  -o-   Consistent -- regular engagement at similar times",
    "  o/o   Reflective -- deep memory engagement",
    "  o:o   Explorer  -- diverse choices across widgets",
], title="MAYAN / OCEANIC VARIANTS")


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 4  ACHIEVEMENT CATALOGUE
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("3. ACHIEVEMENT CATALOGUE  --  14 NAMED ACHIEVEMENTS ACROSS 7 DIMENSIONS")

pdf.body(
    "Achievements track specific behavioral categories and feed into the Interface Evolution\n"
    "System, unlocking visual features and advanced widgets.",
    color=BRIGHT
)

dims = [
    ("EXPLORATION  (weight: 0.15, max 3)", CYAN_, [
        ("first_breath",      "First Breath",        "Common",   "Completed first Memory question. The signal begins."),
        ("mirror_gazer",      "Mirror Gazer",        "Common",   "Used the Mirror mode for the first time."),
        ("community_voice",   "Community Voice",     "Uncommon", "Posted first message in community space."),
    ]),
    ("CONSISTENCY  (weight: 0.25, max 3)", GREEN_, [
        ("week_warrior",      "Week Warrior",        "Common",   "7-day active streak. First rhythm established."),
        ("moon_cycle",        "Moon Cycle",          "Uncommon", "30-day active streak. Lunar completion."),
        ("unwavering",        "Unwavering",          "Rare",     "100-day active streak. Deep current."),
    ]),
    ("DEPTH  (weight: 0.20, max 3)", ACCENT, [
        ("deep_diver",        "Deep Diver",          "Uncommon", "50+ Memory questions. Unlocks Advanced Memory."),
        ("self_scholar",      "Self Scholar",        "Rare",     "200+ Memory questions + Narrative Reflection."),
        ("soul_cartographer", "Soul Cartographer",   "Epic",     "All archetype/value dimensions in Profile complete."),
    ]),
    ("CONNECTION  (weight: 0.10, max 1)", PURPLE_, [
        ("bridge_builder",    "Bridge Builder",      "Uncommon", "Accepted 5+ Chat Catalyst connections."),
    ]),
    ("INTIMACY  (weight: 0.10, max 2)", RED_, [
        ("heart_tender",      "Heart Tender",        "Uncommon", "10+ romantic/relationship memory reflections."),
        ("intimacy_keeper",   "Intimacy Keeper",     "Rare",     "30+ consecutive emotional check-in days."),
    ]),
    ("CARE  (weight: 0.10, max 1)", ORANGE_, [
        ("gentle_with_self",  "Gentle with Self",    "Uncommon", "Self-Care widget used 20+ times."),
    ]),
    ("COURAGE  (weight: 0.10, max 1)", GOLD, [
        ("truth_speaker",     "Truth Speaker",       "Rare",     "10+ high-difficulty Memory questions answered honestly."),
    ]),
]

for dim_name, dim_color, ach_list in dims:
    pdf.check_page(28)
    pdf.sub_title(dim_name, color=dim_color)
    for aid, atitle, rarity, desc in ach_list:
        rc = {"Common": GREEN_, "Uncommon": ACCENT, "Rare": GOLD, "Epic": PURPLE_}.get(rarity, WHITE_)
        c.setFont(MONO_B, 7)
        c.setFillColor(rc)
        c.drawString(LM, pdf.y, ">")
        c.setFillColor(BRIGHT)
        c.drawString(LM + 5 * mm, pdf.y, atitle)
        c.setFont(MONO, 6)
        c.setFillColor(DIM)
        c.drawString(LM + 40 * mm, pdf.y, f"[{aid}]")
        c.setFillColor(rc)
        c.drawString(LM + 78 * mm, pdf.y, f"[{rarity}]")
        c.setFont(MONO, 6)
        c.setFillColor(MID)
        c.drawString(LM + 100 * mm, pdf.y, desc[:52])
        pdf.y -= 3.8 * mm

pdf.check_page(30)
pdf.sub_title("ACHIEVEMENT --> FEATURE UNLOCK MAP")
unlock_map = [
    ("deep_diver",           "Advanced Memory Widget"),
    ("week_warrior+",        "Planner Templates"),
    ("bridge_builder",       "Rich Community Features"),
    ("gentle_with_self",     "Mood Patterns Widget"),
    ("moon_cycle+",          "Pattern Insights (Quantum Engine)"),
    ("soul_cartographer",    "Achievement Gallery"),
    ("self_scholar+",        "Narrative Reflection (AI synthesis)"),
    ("bridge_builder (full)","Social @Mentions"),
    ("heart_tender+",        "Private Spaces"),
]
for ach, feat in unlock_map:
    c.setFont(MONO_B, 6.5)
    c.setFillColor(ACCENT)
    c.drawString(LM, pdf.y, ach)
    c.setFont(MONO, 6.5)
    c.setFillColor(GREEN_)
    c.drawString(LM + 58 * mm, pdf.y, f"-->  {feat}")
    pdf.y -= 3.8 * mm


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 5  INTERFACE EVOLUTION SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("4. INTERFACE EVOLUTION SYSTEM  --  7 DIMENSIONS  *  5 DENSITY LEVELS")

pdf.body(
    "The Interface Evolution System reshapes the LOT dashboard based on user growth.\n"
    "It is not a skin -- the system literally builds itself around the user's rhythm.\n"
    "Zero config. Everything is automatic and earned.",
    color=BRIGHT
)

pdf.sub_title("7 EVOLUTION DIMENSIONS  (0 to 1 normalized)")
dims_data = [
    ("exploration",  "Discovery & first-time experiences",        "0.15", CYAN_),
    ("consistency",  "Behavioral stamina & streaks",              "0.25", GREEN_),
    ("depth",        "Knowledge accumulation & reflection vol.",  "0.20", ACCENT),
    ("connection",   "Social engagement & community",             "0.10", PURPLE_),
    ("intimacy",     "Romantic / relationship vulnerability",     "0.10", RED_),
    ("care",         "Self-compassion practices",                 "0.10", ORANGE_),
    ("courage",      "Truth-telling & honesty",                   "0.10", GOLD),
]
c.setFont(MONO_B, 6.5)
c.setFillColor(DIM)
c.drawString(LM, pdf.y, "DIMENSION")
c.drawString(LM + 34 * mm, pdf.y, "MEANING")
c.drawString(LM + 106 * mm, pdf.y, "WEIGHT")
pdf.y -= 4 * mm
for dim, meaning, weight, dc in dims_data:
    c.setFont(MONO_B, 7)
    c.setFillColor(dc)
    c.drawString(LM, pdf.y, dim)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 34 * mm, pdf.y, meaning)
    c.setFillColor(DIM)
    c.drawString(LM + 106 * mm, pdf.y, weight)
    pdf.y -= 3.8 * mm

pdf.sub_title("5 LAYOUT DENSITY LEVELS  (visualRefinement driven)")
density_data = [
    ("breathable",  "r < 0.15", "Open, airy, generous. Wellness-journal feel.",     BRIGHT),
    ("comfortable", "r < 0.35", "Semantic stacks form. Slightly denser.",           ACCENT),
    ("compact",     "r < 0.55", "Dashboard clarity. Sections distinct.",            GREEN_),
    ("dense",       "r < 0.75", "Info-dense cockpit. Minimal whitespace.",          GOLD),
    ("instrument",  "r >= 0.75","MAX density. Bloomberg-terminal-grade niche.",     PURPLE_),
]
c.setFont(MONO_B, 6.5)
c.setFillColor(DIM)
c.drawString(LM, pdf.y, "LEVEL")
c.drawString(LM + 28 * mm, pdf.y, "THRESHOLD")
c.drawString(LM + 54 * mm, pdf.y, "DESCRIPTION")
pdf.y -= 4 * mm
for lv, thresh, desc, dc in density_data:
    c.setFont(MONO_B, 7)
    c.setFillColor(dc)
    c.drawString(LM, pdf.y, lv)
    c.setFont(MONO, 6.5)
    c.setFillColor(DIM)
    c.drawString(LM + 28 * mm, pdf.y, thresh)
    c.setFillColor(MID)
    c.drawString(LM + 54 * mm, pdf.y, desc)
    pdf.y -= 3.8 * mm

pdf.sub_title("CSS EVOLUTION VARIABLES")
pdf.panel([
    "--evolution-base-opacity      0.85 --> 1.0   (clearer as you grow)",
    "--evolution-accent-opacity    0.70 --> 1.0",
    "--evolution-grid-opacity      0.15 --> 0.50  (grid becomes more defined)",
    "--evolution-letter-spacing    -0.02em --> 0.01em (typography refines)",
    "--evolution-line-height       1.4 --> 1.6",
    "--evolution-grid-size         6px --> 4px    (tighter grid = more mature)",
    "--evolution-glow-intensity    0 --> 0.3      (achievement glow unlocks)",
    "--evolution-blur-radius       8px --> 0px    (sharp focus earned)",
    "--evolution-transition-speed  400ms --> 150ms (snappier with mastery)",
], title="CSS CUSTOM PROPERTIES (injected dynamically)")

pdf.sub_title("CHAPTER PROGRESSION")
chapters = [
    ("Chapter 1", "Level 1-9",   "Awakening",   "You notice yourself.",               BRIGHT),
    ("Chapter 2", "Level 10-29", "Exploration", "Patterns emerge.",                   ACCENT),
    ("Chapter 3", "Level 30-59", "Integration", "Meaning weaves through everything.", GREEN_),
    ("Chapter 4", "Level 60+",   "Mastery",     "You architect your becoming.",       GOLD),
]
for ch, lvl, name, narr, cc in chapters:
    c.setFont(MONO_B, 7)
    c.setFillColor(cc)
    c.drawString(LM, pdf.y, ch)
    c.setFillColor(DIM)
    c.drawString(LM + 22 * mm, pdf.y, lvl)
    c.setFillColor(BRIGHT)
    c.drawString(LM + 44 * mm, pdf.y, name)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 66 * mm, pdf.y, narr)
    pdf.y -= 3.8 * mm


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 6  NARRATIVE & QUEST SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("5. NARRATIVE & QUEST SYSTEM  --  RPG STORY ARC")

pdf.body(
    "LOT runs an RPG-style narrative engine grounded in real user data.\n"
    "The story is not fiction -- it is a mirror. Quests derive from actual behavioral gaps.",
    color=BRIGHT
)

pdf.sub_title("NARRATIVE WIDGET -- 4 VIEWS")
views = [
    ("Arc:",            "Level, chapter title, narrative prose, next milestone"),
    ("Unlocked:",       "Earned achievements sorted newest-first (max 5 shown)"),
    ("Active Quests:",  "Live quests with percentage progress bars"),
    ("Runtime Context:","Log-derived self-assembly: engagement level, mood, streak"),
]
for lbl, desc in views:
    c.setFont(MONO_B, 7)
    c.setFillColor(ACCENT)
    c.drawString(LM, pdf.y, lbl)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 30 * mm, pdf.y, desc)
    pdf.y -= 3.8 * mm

pdf.sub_title("CQGS FOUR PILLARS  (Cognitive Quantum Growth Scale)")
pillars = [
    ("Cleanness",  "Hygiene, environment, routine care -- space as biofield mirror"),
    ("Routine",    "Sleep, activity, work -- lifestyle transparency and rhythm"),
    ("Nutrition",  "Biofield, ATP, energy quality -- body as quantum system"),
    ("Laughter",   "Curiosity, joy, genuine human emission -- the anti-grind signal"),
]
for pillar, desc in pillars:
    c.setFont(MONO_B, 7)
    c.setFillColor(CYAN_)
    c.drawString(LM, pdf.y, pillar)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 28 * mm, pdf.y, desc)
    pdf.y -= 3.8 * mm

pdf.sub_title("SELF-ASSEMBLY ENGINE  --  9 MODULES")
modules = [
    ("Biofield Engine",      "Energy, mood, ATP signals"),
    ("Memory Architecture",  "Memory questions + answers"),
    ("Routine Compiler",     "Planning + consistency data"),
    ("Intention Core",       "Quantum Engine intentions"),
    ("Cleanness Protocol",   "Self-care + environment acts"),
    ("Reflection Layer",     "Depth of memory engagement"),
    ("Community Mesh",       "Chat, cohort, connection"),
    ("Ecosystem Bridge",     "Car / Home / Computer connections"),
    ("Quantum Substrate",    "QIE signals + pattern density"),
]
for mod, src in modules:
    c.setFont(MONO, 6.5)
    c.setFillColor(ACCENT)
    c.drawString(LM, pdf.y, f"  {mod}")
    c.setFillColor(MID)
    c.drawString(LM + 52 * mm, pdf.y, src)
    pdf.y -= 3.8 * mm

pdf.sub_title("MODULE ASSEMBLY PHASES")
phases = [
    ("dormant",   "No signals received -- system waits"),
    ("awakening", "First signal detected -- assembly initiated"),
    ("forming",   "Pattern recognized -- structure crystallizing"),
    ("assembled", "Self-assembled from your signals alone"),
    ("integrated","Wired deep into the system fabric"),
]
for phase, desc in phases:
    c.setFont(MONO_B, 7)
    c.setFillColor(GREEN_)
    c.drawString(LM, pdf.y, phase)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 30 * mm, pdf.y, desc)
    pdf.y -= 3.8 * mm

pdf.sub_title("ENGAGEMENT LEVEL NARRATIVE")
eng_levels = [
    ("new",        "You are at the beginning. Every signal teaches the system what to become."),
    ("exploring",  "Exploration active. Each module you touch, the site reshapes around."),
    ("building",   "Foundation self-assembling. Your patterns are becoming the architecture."),
    ("integrated", "Systems integrated. The site builds features from your rhythm."),
    ("mastered",   "Full co-evolution. You and this system grow as one."),
]
for lv, narr in eng_levels:
    c.setFont(MONO_B, 7)
    c.setFillColor(GREEN_)
    c.drawString(LM, pdf.y, f"  [{lv}]")
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 32 * mm, pdf.y, narr[:78])
    pdf.y -= 3.8 * mm


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 7  EASTER EGGS & SECRET BADGES
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("6. EASTER EGGS & SECRET BADGES  --  HIDDEN TRIGGERS", color=GOLD)

pdf.body(
    "LOT hides rewards in unexpected places. These badges appear silently in your\n"
    "profile after the trigger fires. Some require specific sequences, times, or words.",
    color=BRIGHT
)

pdf.sub_title("MAGIC TIME BADGES  (Micro-Calculator Easter Egg)")
magic_times = [
    ("11:11", "[>_]",  "The Terminal Hour",    "All four digits align. System awakens."),
    ("12:34", "[seq]", "Sequential Boot",      "Counting forward -- order rewarded."),
    ("22:22", "[==]",  "Mirror State",         "Perfect symmetry in time itself."),
    ("00:00", "[O]",   "Midnight Root",        "The hour of reset. Witnessed."),
    ("03:33", "[///]", "Deep Night Protocol",  "Late-night presence. Dedication logged."),
    ("13:37", "[1337]","Elite Access",         "The legendary leet hour. Classic."),
    ("07:07", "[::]",  "Double Inference",     "7 twice. Mathematical harmony."),
    ("10:10", "[><]",  "Dual Core",            "Both channels open simultaneously."),
]
c.setFont(MONO_B, 6.5)
c.setFillColor(DIM)
c.drawString(LM, pdf.y, "TIME")
c.drawString(LM + 18 * mm, pdf.y, "BADGE")
c.drawString(LM + 36 * mm, pdf.y, "NAME")
c.drawString(LM + 78 * mm, pdf.y, "LORE")
pdf.y -= 4 * mm
for time_str, badge_sym, name, lore in magic_times:
    c.setFont(MONO_B, 7)
    c.setFillColor(GOLD)
    c.drawString(LM, pdf.y, time_str)
    c.setFillColor(CYAN_)
    c.drawString(LM + 18 * mm, pdf.y, badge_sym)
    c.setFillColor(BRIGHT)
    c.drawString(LM + 36 * mm, pdf.y, name)
    c.setFont(MONO, 6)
    c.setFillColor(MID)
    c.drawString(LM + 78 * mm, pdf.y, lore[:48])
    pdf.y -= 3.8 * mm

pdf.sub_title("WORD TURN BADGES  (Konami-style text in Planner / Intent field)")
word_turns = [
    ("CARE",     "[<3]",   "Care Protocol",      "Type CARE in planner intent."),
    ("BREATHE",  "[~.~]",  "Breath Signal",      "Type BREATHE. System pauses with you."),
    ("REST",     "[zzz]",  "Rest Mode",          "Type REST. Recovery acknowledged."),
    ("FOCUS",    "[<>]",   "Focus Lock",         "Type FOCUS. Clarity mode engaged."),
    ("WATER",    "[~]",    "Hydration Override", "Type WATER. Drink reminder fired."),
    ("LOT",      "[.]",    "The Word",           "Type LOT in any field 3x in session."),
    ("GROUNDED", "[|||]",  "Earth Anchor",       "Type GROUNDED. Roots acknowledged."),
    ("QUANTUM",  "[~<>~]", "Quantum State",      "Type QUANTUM. The engine notices."),
    ("NOW",      "[*]",    "Present Signal",     "Type NOW 5x in session."),
]
c.setFont(MONO_B, 6.5)
c.setFillColor(DIM)
c.drawString(LM, pdf.y, "WORD(S)")
c.drawString(LM + 26 * mm, pdf.y, "BADGE")
c.drawString(LM + 44 * mm, pdf.y, "NAME")
c.drawString(LM + 78 * mm, pdf.y, "TRIGGER")
pdf.y -= 4 * mm
for word, badge_sym, name, lore in word_turns:
    c.setFont(MONO_B, 7)
    c.setFillColor(ORANGE_)
    c.drawString(LM, pdf.y, word)
    c.setFillColor(CYAN_)
    c.drawString(LM + 26 * mm, pdf.y, badge_sym)
    c.setFillColor(BRIGHT)
    c.drawString(LM + 44 * mm, pdf.y, name)
    c.setFont(MONO, 6)
    c.setFillColor(MID)
    c.drawString(LM + 78 * mm, pdf.y, lore[:48])
    pdf.y -= 3.8 * mm

pdf.sub_title("SEQUENCE COMBO BADGES  (multi-widget session streaks)")
combos = [
    ("MORNING RITUAL",  "[o-->]",  "Memory + Planner + Check-in before 10 AM"),
    ("FULL SCAN",       "[~.~]",   "All 4 planner dimensions filled in one session"),
    ("QUANTUM LOCK",    "[<>=<>]", "QIE State + Pattern + Feedback in sequence"),
    ("NIGHT OPERATOR",  "[#]",     "Active after 23:00 three days in a row"),
    ("ECOSYSTEM NODE",  "[*.*]",   "Car + Home + Computer all connected at once"),
    ("PERFECT WEEK",    "[**.**]", "Memory + Planner + Check-in every day 7d"),
    ("DEEP DIVE",       "[VV]",    "50 memory answers in a single week"),
    ("STOIC HOUR",      "[--.-]",  "Same opening time +-15min for 14 days"),
]
for name, badge_sym, desc in combos:
    c.setFont(MONO_B, 7)
    c.setFillColor(PURPLE_)
    c.drawString(LM, pdf.y, name)
    c.setFillColor(CYAN_)
    c.drawString(LM + 46 * mm, pdf.y, badge_sym)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 64 * mm, pdf.y, desc[:60])
    pdf.y -= 3.8 * mm


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 8  ARCADE ACHIEVEMENTS
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("7. ARCADE ACHIEVEMENTS  --  MICRO-GAMES & PIXEL FUN", color=ORANGE_)

pdf.body(
    "Three micro-games rotate by time of day. Each has its own achievement track.\n"
    "Games are 2cm squares, 32x32 pixel grids. Maximum fun density.",
    color=BRIGHT
)

pdf.sub_title("MICRO TETRIS  (Morning: 06:00-12:00)")
tetris_ach = [
    ("[T1]",  "First Line",        "Clear your first line. The stack yields.",    GREEN_),
    ("[T5]",  "Five-Stack",        "Clear 5 lines total across all sessions.",    ACCENT),
    ("[T!]",  "Tetromino Master",  "Score 500+ in a single session.",             GOLD),
    ("[T~]",  "Cascader",         "4 lines cleared in one drop (Tetris).",       PURPLE_),
]
for sym, name, desc, rc in tetris_ach:
    pdf.badge_row(sym, name, desc, rc)

pdf.sub_title("PIXEL INVADERS  (Afternoon: 12:00-18:00)")
invader_ach = [
    ("[>o]",  "First Contact",     "Destroy first invader.",                      GREEN_),
    ("[>.]",  "Wave Cleared",      "Clear a full wave.",                          ACCENT),
    ("[>~]",  "Defender",          "Survive 3 waves without dying.",              GOLD),
    ("[>0]",  "No Mercy",         "Perfect clear -- zero shots missed.",          PURPLE_),
]
for sym, name, desc, rc in invader_ach:
    pdf.badge_row(sym, name, desc, rc)

pdf.sub_title("DOT SNAKE  (Evening: 18:00-00:00)")
snake_ach = [
    ("[So]",  "First Bite",        "Eat first dot. Growth begins.",              GREEN_),
    ("[S~]",  "Coiling",           "Reach length 10.",                           ACCENT),
    ("[S~~]", "Ouroboros",         "Reach length 25 without dying.",             GOLD),
    ("[S!]",  "Serpent God",       "Fill 50% of the grid.",                      PURPLE_),
]
for sym, name, desc, rc in snake_ach:
    pdf.badge_row(sym, name, desc, rc)

pdf.sub_title("QUANTUM RANDOM ACHIEVEMENTS  (Quantum Random Widget)")
qrandom = [
    ("[00]",   "Double Zero",     "Widget rolls 00 twice in one session",     CYAN_),
    ("[99]",   "Maximum Output",  "Widget rolls 99",                          CYAN_),
    ("[:77:]", "Triple Seven",    "Widget rolls 77 three times in session",   CYAN_),
    ("[Q!]",   "Quantum Surge",   "Widget fires 10 times in under 5 minutes", CYAN_),
]
for sym, name, desc, rc in qrandom:
    pdf.badge_row(sym, name, desc, rc)

pdf.sub_title("MAGIC TIME CALCULATOR ACHIEVEMENTS")
calc_ach = [
    ("[>_o]",  "First Magic",      "Witnessed first magic timestamp (any)"),
    ("[>_5]",  "Time Collector",   "Witnessed 5 different magic timestamps"),
    ("[>_!]",  "Chronologist",    "Witnessed all 23 magic timestamps"),
    ("[>_0]",  "The Long Watch",  "Active during both 00:00 and 23:59"),
]
for sym, name, desc in calc_ach:
    pdf.badge_row(sym, name, desc, GOLD)


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 9  SCI-FI / COMPUTER LORE BADGES
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("8. SCI-FI / COMPUTER LORE BADGES", color=CYAN_)

pdf.body(
    "LOT sits at the intersection of self-care, Sci-Fi, and vintage computer culture.\n"
    "These badges reward the hacker-philosopher: meticulous, curious, nocturnal.",
    color=BRIGHT
)

pdf.sub_title("TERMINAL CULTURE BADGES")
terminal_badges = [
    ("[root@lot]",  "ROOT ACCESS",     "Epic",     "Answered every question category at least once"),
    ("[>_]",        "SHELL INIT",      "Common",   "First visit to LOT. Session established."),
    ("[0x0F]",      "HEX OPERATOR",    "Uncommon", "Active on 15 different days (0x0F = 15)"),
    ("[0xFF]",      "MAX REGISTER",    "Rare",     "Active on 255 different days (0xFF = 255)"),
    ("[EOF]",       "END OF FILE",     "Uncommon", "Completed an entire journal session"),
    ("[NULL]",      "NULL POINTER",    "Rare",     "Opened LOT on day with no plans (intentional rest)"),
    ("[SIGTERM]",   "GRACEFUL EXIT",   "Uncommon", "Logged out intentionally 7 days in a row"),
    ("[sudo care]", "ELEVATED CARE",   "Rare",     "Self-Care + Intervention widget in same session"),
    ("[STACK]",     "CALL STACK",      "Uncommon", "5+ widgets used in sequence within 10 minutes"),
    ("[PING 0ms]",  "ZERO LATENCY",    "Rare",     "Planner filled within 60s of opening LOT"),
]
c.setFont(MONO_B, 6.5)
c.setFillColor(DIM)
c.drawString(LM, pdf.y, "BADGE")
c.drawString(LM + 30 * mm, pdf.y, "NAME")
c.drawString(LM + 68 * mm, pdf.y, "RARITY")
c.drawString(LM + 88 * mm, pdf.y, "TRIGGER")
pdf.y -= 4 * mm
for sym, name, rarity, trigger in terminal_badges:
    rc = {"Common": GREEN_, "Uncommon": ACCENT, "Rare": GOLD, "Epic": PURPLE_}.get(rarity, WHITE_)
    c.setFont(MONO_B, 7)
    c.setFillColor(CYAN_)
    c.drawString(LM, pdf.y, sym)
    c.setFillColor(BRIGHT)
    c.drawString(LM + 30 * mm, pdf.y, name)
    c.setFillColor(rc)
    c.drawString(LM + 68 * mm, pdf.y, rarity)
    c.setFont(MONO, 6)
    c.setFillColor(MID)
    c.drawString(LM + 88 * mm, pdf.y, trigger[:46])
    pdf.y -= 3.8 * mm

pdf.sub_title("SCI-FI BOOK / ARCHETYPE BADGES")
scifi_badges = [
    ("[DUNE]",       "Muad'Dib",         "Rare",      "30+ consecutive days. Fear faced."),
    ("[HAL]",        "I'm Sorry Dave",   "Epic",      "Denied 3+ self-care prompts then returned."),
    ("[2001]",       "Beyond Jupiter",   "Rare",      "Level 100 reached."),
    ("[ASIMOV]",     "First Law",        "Uncommon",  "Care + Intervention widget same day."),
    ("[DICK]",       "Blade Runner",     "Uncommon",  "Emotional check-in + mirror + profile."),
    ("[GIBSON]",     "Cyberspace",       "Rare",      "QIE State + Signal Stream + Patterns chained."),
    ("[TURING]",     "Imitation Game",   "Rare",      "Memory Widget: 100+ questions answered."),
    ("[MANDELA]",    "Effect",           "Secret",    "Opened LOT same weekday 7 consecutive weeks."),
    ("[VOYAGER]",    "Pale Blue Dot",    "Legendary", "365-day streak. You are the mission."),
    ("[LOT:OMEGA]",  "The Last Word",    "Legendary", "All other badges earned."),
]
for sym, name, rarity, trigger in scifi_badges:
    rc = {"Common": GREEN_, "Uncommon": ACCENT, "Rare": GOLD, "Epic": PURPLE_,
          "Legendary": RED_, "Secret": ORANGE_}.get(rarity, WHITE_)
    c.setFont(MONO_B, 7)
    c.setFillColor(PURPLE_)
    c.drawString(LM, pdf.y, sym)
    c.setFillColor(BRIGHT)
    c.drawString(LM + 30 * mm, pdf.y, name)
    c.setFillColor(rc)
    c.drawString(LM + 68 * mm, pdf.y, rarity)
    c.setFont(MONO, 6)
    c.setFillColor(MID)
    c.drawString(LM + 88 * mm, pdf.y, trigger[:46])
    pdf.y -= 3.8 * mm

pdf.sub_title("SEASONAL & RITUAL BADGES")
seasonal = [
    ("[ice]",    "Winter Protocol",  "Active on Winter Solstice (Dec 21 +/- 1)"),
    ("[sun]",    "Summer Core",      "Active on Summer Solstice (Jun 21 +/- 1)"),
    ("[~]",      "Equinox Sync",     "Active on both Spring and Autumn equinox"),
    ("[:::]",    "New Year Init",    "Active Jan 1 -- new cycle acknowledged"),
    ("[@dawn]",  "Dawn Ritual",      "3 consecutive days checking in before 7 AM"),
    ("[moon]",   "Moon Watcher",     "Active on 4 consecutive full moon nights"),
]
for sym, name, desc in seasonal:
    pdf.badge_row(sym, name, desc, ACCENT)


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 10  FULL ASCII BADGE REGISTRY
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("9. FULL ASCII BADGE REGISTRY  --  COMPLETE SYMBOL REFERENCE", color=BRIGHT)

pdf.body(
    "All badges use Unicode characters with 100% browser support.\n"
    "No emoji. No images. Pure terminal aesthetic.",
    color=MID
)

all_badges = [
    # Core milestones
    ("o",           "Droplet (Day 7, Water)"),
    ("~",           "Wave (Day 30, Water)"),
    ("~~",          "Current (Day 100, Water)"),
    ("|--",         "Foundation (Day 7, Architecture)"),
    ("|=|",         "Structure (Day 30, Architecture)"),
    ("||.||",       "Mastery (Day 100, Architecture)"),
    # Magic times
    ("[>_]",        "Shell Init / 11:11"),
    ("[seq]",       "Sequential Boot / 12:34"),
    ("[==]",        "Mirror State / 22:22"),
    ("[O]",         "Midnight Root / 00:00"),
    ("[///]",       "Deep Night / 03:33"),
    ("[1337]",      "Elite Access / 13:37"),
    ("[::]",        "Double Inference / 07:07"),
    ("[><]",        "Dual Core / 10:10"),
    # Word turns
    ("[<3]",        "Care Protocol"),
    ("[~.~]",       "Breath Signal"),
    ("[zzz]",       "Rest Mode"),
    ("[<>]",        "Focus Lock"),
    ("[~]",         "Hydration Override"),
    ("[.]",         "The Word (LOT x3)"),
    ("[|||]",       "Earth Anchor"),
    ("[~<>~]",      "Quantum State"),
    ("[*]",         "Present Signal"),
    # Combo badges
    ("[o-->]",      "Morning Ritual"),
    ("[~.~]",       "Full Scan"),
    ("[<>=<>]",     "Quantum Lock"),
    ("[#]",         "Night Operator"),
    ("[*.*]",       "Ecosystem Node"),
    ("[**.**]",     "Perfect Week"),
    ("[VV]",        "Deep Dive"),
    ("[--.-]",      "Stoic Hour"),
    # Arcade
    ("[T1]",        "First Line (Tetris)"),
    ("[T5]",        "Five-Stack (Tetris)"),
    ("[T!]",        "Tetromino Master"),
    ("[T~]",        "Cascader (Tetris)"),
    ("[>o]",        "First Contact (Invaders)"),
    ("[>.]",        "Wave Cleared"),
    ("[>~]",        "Defender"),
    ("[>0]",        "No Mercy"),
    ("[So]",        "First Bite (Snake)"),
    ("[S~]",        "Coiling (Snake)"),
    ("[S~~]",       "Ouroboros"),
    ("[S!]",        "Serpent God"),
    ("[00]",        "Double Zero (QRandom)"),
    ("[99]",        "Maximum Output"),
    ("[:77:]",      "Triple Seven"),
    ("[Q!]",        "Quantum Surge"),
    ("[>_o]",       "First Magic (Calc)"),
    ("[>_5]",       "Time Collector"),
    ("[>_!]",       "Chronologist"),
    ("[>_0]",       "The Long Watch"),
    # Terminal / Lore
    ("[root@lot]",  "Root Access"),
    ("[0x0F]",      "Hex Operator (15 days)"),
    ("[0xFF]",      "Max Register (255 days)"),
    ("[EOF]",       "End of File"),
    ("[NULL]",      "Null Pointer"),
    ("[SIGTERM]",   "Graceful Exit"),
    ("[sudo care]", "Elevated Care"),
    ("[STACK]",     "Call Stack"),
    ("[PING 0ms]",  "Zero Latency"),
    # Sci-Fi
    ("[DUNE]",      "Muad'Dib"),
    ("[HAL]",       "I'm Sorry Dave"),
    ("[2001]",      "Beyond Jupiter (Lv100)"),
    ("[ASIMOV]",    "First Law"),
    ("[DICK]",      "Blade Runner"),
    ("[GIBSON]",    "Cyberspace"),
    ("[TURING]",    "Imitation Game"),
    ("[MANDELA]",   "Effect (Secret)"),
    ("[VOYAGER]",   "Pale Blue Dot (365d)"),
    ("[LOT:OMEGA]", "The Last Word (All)"),
    # Seasonal
    ("[ice]",       "Winter Protocol"),
    ("[sun]",       "Summer Core"),
    ("[~]",         "Equinox Sync"),
    ("[:::]",       "New Year Init"),
    ("[@dawn]",     "Dawn Ritual"),
    ("[moon]",      "Moon Watcher"),
    # Named achievements
    ("first_breath",      "First Breath"),
    ("mirror_gazer",      "Mirror Gazer"),
    ("community_voice",   "Community Voice"),
    ("week_warrior",      "Week Warrior"),
    ("moon_cycle",        "Moon Cycle"),
    ("unwavering",        "Unwavering"),
    ("deep_diver",        "Deep Diver"),
    ("self_scholar",      "Self Scholar"),
    ("soul_cartographer", "Soul Cartographer"),
    ("bridge_builder",    "Bridge Builder"),
    ("heart_tender",      "Heart Tender"),
    ("intimacy_keeper",   "Intimacy Keeper"),
    ("gentle_with_self",  "Gentle with Self"),
    ("truth_speaker",     "Truth Speaker"),
]

mid_idx = len(all_badges) // 2
left_col  = all_badges[:mid_idx]
right_col = all_badges[mid_idx:]

row_h = 3.6 * mm
col_w_sym  = 36 * mm
col_w_name = 55 * mm

for i in range(max(len(left_col), len(right_col))):
    pdf.check_page(8)
    y = pdf.y
    x = LM
    if i < len(left_col):
        sym, name = left_col[i]
        c.setFont(MONO_B, 6.5)
        c.setFillColor(CYAN_)
        c.drawString(x, y, sym)
        c.setFont(MONO, 6)
        c.setFillColor(MID)
        c.drawString(x + col_w_sym, y, name)
    x = LM + col_w_sym + col_w_name
    if i < len(right_col):
        sym, name = right_col[i]
        c.setFont(MONO_B, 6.5)
        c.setFillColor(CYAN_)
        c.drawString(x, y, sym)
        c.setFont(MONO, 6)
        c.setFillColor(MID)
        c.drawString(x + col_w_sym, y, name)
    pdf.y -= row_h

pdf.y -= 2 * mm
c.setFont(MONO, 6)
c.setFillColor(DIM)
c.drawString(LM, pdf.y,
    f"Total registry: {len(all_badges)} badges/achievements  |  "
    "Unicode-safe  |  100% cross-browser compatible"
)
pdf.y -= 5 * mm


# ─────────────────────────────────────────────────────────────────────────────
#  PAGE 11  UNLOCK TRIGGERS & LOGIC
# ─────────────────────────────────────────────────────────────────────────────
pdf.new_page()
pdf.section_title("10. UNLOCK TRIGGERS & LOGIC  --  HOW EACH BADGE IS EARNED", color=GREEN_)

pdf.body(
    "All badge awards are non-destructive, atomic, and idempotent.\n"
    "Badges cannot be lost. Unlock messages queue in localStorage.",
    color=BRIGHT
)

pdf.sub_title("CORE AWARD FLOW")
pdf.panel([
    "1. User activity generates a signal (widget interaction, answer, plan, etc.)",
    "2. Signal recorded to Quantum Intention Engine + /api/logs",
    "3. checkAndAwardBadges() fires after significant events:",
    "     -- Memory answer submitted",
    "     -- Planner saved",
    "     -- Session start (streak check)",
    "4. /api/user-stats fetched --> streak extracted",
    "5. Milestone thresholds evaluated (7 / 30 / 100 days)",
    "6. awardBadge(id) called --> localStorage updated --> unlock queued",
    "7. Memory Widget reads badge_unlock_queue on next render",
    "8. Unlock toast shown:  ->  [message]  [symbol]",
    "9. Queue item consumed (FIFO)",
], title="AWARD PIPELINE")

pdf.sub_title("TRIGGER REFERENCE TABLE")
triggers = [
    ("milestone_7",       "streak >= 7",                        "checkAndAwardBadges()"),
    ("milestone_30",      "streak >= 30",                       "checkAndAwardBadges()"),
    ("milestone_100",     "streak >= 100",                      "checkAndAwardBadges()"),
    ("first_breath",      "first Memory question answered",      "MemoryWidget submit"),
    ("mirror_gazer",      "Mirror mode used",                    "Mirror toggle"),
    ("community_voice",   "first community message sent",        "Community post"),
    ("week_warrior",      "streak >= 7 (achievement track)",     "checkAndAwardBadges()"),
    ("moon_cycle",        "streak >= 30 (achievement track)",    "checkAndAwardBadges()"),
    ("unwavering",        "streak >= 100 (achievement track)",   "checkAndAwardBadges()"),
    ("deep_diver",        "50+ Memory answers",                  "Memory answer count"),
    ("self_scholar",      "200+ Memory answers",                 "Memory answer count"),
    ("soul_cartographer", "All profile dimensions complete",     "Profile completion"),
    ("bridge_builder",    "5+ chat connections accepted",        "ChatCatalyst accept"),
    ("heart_tender",      "10+ romantic reflections",            "Memory category filter"),
    ("intimacy_keeper",   "30+ consecutive check-ins",           "Emotional check-in"),
    ("gentle_with_self",  "20+ self-care widget uses",           "SelfCare widget"),
    ("truth_speaker",     "10+ high-difficulty answers",         "Memory difficulty"),
    ("Magic time badges", "Clock matches magic timestamp",        "MicroCalculator visibility"),
    ("Word turn badges",  "Specific words typed in Planner",      "Planner onChange"),
    ("Combo badges",      "Multi-widget sequence in session",     "Signal stream analysis"),
    ("[VOYAGER]",         "streak >= 365",                       "checkAndAwardBadges()"),
    ("[LOT:OMEGA]",       "All other badges earned",             "Award completion scan"),
]

c.setFont(MONO_B, 6.5)
c.setFillColor(DIM)
c.drawString(LM, pdf.y, "BADGE ID")
c.drawString(LM + 44 * mm, pdf.y, "CONDITION")
c.drawString(LM + 110 * mm, pdf.y, "TRIGGER POINT")
pdf.y -= 4 * mm

for bid, cond, tp in triggers:
    pdf.check_page(8)
    c.setFont(MONO_B, 6.5)
    c.setFillColor(CYAN_)
    c.drawString(LM, pdf.y, bid)
    c.setFont(MONO, 6)
    c.setFillColor(MID)
    c.drawString(LM + 44 * mm, pdf.y, cond)
    c.setFillColor(DIM)
    c.drawString(LM + 110 * mm, pdf.y, tp)
    pdf.y -= 3.6 * mm

pdf.sub_title("RARITY & XP VALUE SCALE")
rarity_table = [
    ("Common",    GREEN_,  "+50 XP",     "First actions, early milestones"),
    ("Uncommon",  ACCENT,  "+200 XP",    "Sustained effort, behavioral shifts"),
    ("Rare",      GOLD,    "+1000 XP",   "Long-term commitment (30-100 days)"),
    ("Epic",      PURPLE_, "+5000 XP",   "Deep mastery, multi-dimension achievements"),
    ("Legendary", RED_,    "+25000 XP",  "Year+ streaks, completion states"),
    ("Secret",    ORANGE_, "+??? XP",    "Hidden -- value revealed on unlock"),
]
for rarity, rc, xp, desc in rarity_table:
    c.setFont(MONO_B, 7)
    c.setFillColor(rc)
    c.drawString(LM, pdf.y, rarity)
    c.setFillColor(DIM)
    c.drawString(LM + 26 * mm, pdf.y, xp)
    c.setFont(MONO, 6.5)
    c.setFillColor(MID)
    c.drawString(LM + 48 * mm, pdf.y, desc)
    pdf.y -= 4 * mm

# Closing
pdf.check_page(28)
pdf.y -= 4 * mm
pdf.h_line()
pdf.y -= 2 * mm
c.setFont(MONO_I, 7)
c.setFillColor(DIM)
lines = [
    "The badge system is designed to feel inevitable, not gamified.",
    "You do not chase badges -- they find you when you show up.",
    "Easter eggs exist for the curious. Legendary badges exist for the committed.",
    "The only badge that truly matters is the one you haven't earned yet.",
    "",
    "     o  -->  ~  -->  ~~        Keep going.",
]
for ln in lines:
    c.drawCentredString(W / 2, pdf.y, ln)
    pdf.y -= 4.5 * mm

# ── Save ──────────────────────────────────────────────────────────────────────
pdf._footer()
pdf.save()
