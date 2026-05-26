#!/usr/bin/env python3
"""
LOT Badges & Achievements Manual — PDF Generator v4.0
RPG / Arcade / Computer / Sci-Fi Edition
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

W, H = A4
M = 18 * mm
CW = W - 2 * M

BG    = HexColor("#0a0a0a")
FG    = HexColor("#e8e8e8")
FG2   = HexColor("#aaaaaa")
FG3   = HexColor("#555555")
ACC   = HexColor("#c8ffc8")
ACC2  = HexColor("#88ccff")
ACC3  = HexColor("#ffcc44")
ACC4  = HexColor("#ff6644")
EPIC  = HexColor("#aa88ee")
BRD   = HexColor("#2a2a2a")
BOX1  = HexColor("#0d1a0d")
BOX2  = HexColor("#0d0d1a")
BOX3  = HexColor("#0a0a1a")
BOX4  = HexColor("#1a0a0a")
BOX5  = HexColor("#1a1a0a")
BOX6  = HexColor("#0a1a1a")


class Doc:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle("LOT — Badges & Achievements Manual v4.0")
        self.c.setAuthor("LOT Systems / Vadik Marmeladov")
        self.c.setSubject("RPG / Arcade / Computer / Sci-Fi Self-Care")
        self.page = 0
        self.y = H - M
        self._new_page()

    def _new_page(self):
        if self.page > 0:
            self._footer()
            self.c.showPage()
        self.page += 1
        self.c.setFillColor(BG)
        self.c.rect(0, 0, W, H, stroke=0, fill=1)
        self.c.setFillColor(ACC)
        self.c.rect(0, H - 2, W, 2, stroke=0, fill=1)
        self.y = H - M - 8

    def _footer(self):
        self.c.setFont("Courier", 7)
        self.c.setFillColor(FG3)
        self.c.drawString(M, 10, "LOT Systems — Badges & Achievements Manual v4.0 — 2025-2026")
        self.c.drawRightString(W - M, 10, f"PAGE {self.page:02d}")
        self.c.setFillColor(HexColor("#1a3a1a"))
        self.c.rect(0, 0, W, 1.5, stroke=0, fill=1)

    def need(self, h):
        if self.y - h < M + 16:
            self._new_page()

    def gap(self, h=4):
        self.y -= h

    def hline(self, color=BRD, w=0.4):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(w)
        self.c.line(M, self.y, W - M, self.y)
        self.y -= 4

    def txt(self, text, size=9, color=FG, x=None):
        self.need(size + 3)
        self.c.setFont("Courier", size)
        self.c.setFillColor(color)
        self.c.drawString(x if x is not None else M, self.y, text)
        self.y -= size + 2.5

    def bold(self, text, size=9, color=FG, x=None):
        self.need(size + 3)
        self.c.setFont("Courier-Bold", size)
        self.c.setFillColor(color)
        self.c.drawString(x if x is not None else M, self.y, text)
        self.y -= size + 2.5

    def section(self, title):
        self.need(30)
        self.gap(8)
        self.c.setFillColor(HexColor("#111111"))
        self.c.rect(M - 3, self.y - 15, CW + 6, 21, stroke=0, fill=1)
        self.c.setFillColor(ACC)
        self.c.rect(M - 3, self.y - 15, 4, 21, stroke=0, fill=1)
        self.c.setFont("Courier-Bold", 11)
        self.c.setFillColor(ACC)
        self.c.drawString(M + 8, self.y - 9, title.upper())
        self.y -= 26
        self.gap(2)

    def sub(self, title):
        self.need(18)
        self.gap(5)
        self.c.setFont("Courier-Bold", 9)
        self.c.setFillColor(ACC2)
        self.c.drawString(M, self.y, ">> " + title)
        self.y -= 13
        self.hline(HexColor("#224466"), 0.3)

    def box(self, lines, bg=HexColor("#0f0f0f"), label=None):
        lh = 10
        pad = 5
        label_h = 12 if label else 0
        total = len(lines) * lh + pad * 2 + label_h
        self.need(total + 6)
        bx, bw = M, CW
        by = self.y - total
        self.c.setFillColor(bg)
        self.c.rect(bx, by, bw, total, stroke=0, fill=1)
        self.c.setStrokeColor(BRD)
        self.c.setLineWidth(0.4)
        self.c.rect(bx, by, bw, total, stroke=1, fill=0)
        ty = self.y - pad - 8
        if label:
            self.c.setFont("Courier-Bold", 7)
            self.c.setFillColor(FG3)
            self.c.drawString(bx + 5, ty, label)
            ty -= 11
        for line in lines:
            self.c.setFont("Courier", 8)
            self.c.setFillColor(FG)
            self.c.drawString(bx + 7, ty, line)
            ty -= lh
        self.y -= total + 5

    def card(self, sym, name, rarity, trigger, flavor=""):
        rcolors = {
            "COMMON": FG2, "UNCOMMON": ACC, "RARE": ACC2,
            "EPIC": EPIC, "LEGENDARY": ACC3, "MYTHIC": ACC4, "COSMIC": ACC4
        }
        rc = rcolors.get(rarity.upper(), FG2)
        self.need(23)
        bx, bw = M, CW
        by = self.y - 21
        self.c.setFillColor(HexColor("#111111"))
        self.c.rect(bx, by, bw, 21, stroke=0, fill=1)
        self.c.setStrokeColor(BRD)
        self.c.setLineWidth(0.3)
        self.c.rect(bx, by, bw, 21, stroke=1, fill=0)
        # left color bar
        self.c.setFillColor(rc)
        self.c.rect(bx, by, 3, 21, stroke=0, fill=1)
        # symbol
        self.c.setFont("Courier-Bold", 10)
        self.c.setFillColor(rc)
        self.c.drawString(bx + 8, by + 12, sym)
        # name
        self.c.setFont("Courier-Bold", 8)
        self.c.setFillColor(FG)
        self.c.drawString(bx + 50, by + 13, name)
        # rarity + trigger
        self.c.setFont("Courier", 7)
        self.c.setFillColor(rc)
        self.c.drawString(bx + 50, by + 4, f"[{rarity}]")
        self.c.setFillColor(FG2)
        self.c.drawString(bx + 90, by + 4, trigger)
        # flavor
        if flavor:
            self.c.setFont("Courier", 7)
            self.c.setFillColor(FG3)
            self.c.drawRightString(bx + bw - 5, by + 4, flavor)
        self.y -= 24

    def art(self, lines, color=ACC, size=8):
        for line in lines:
            self.need(size + 2)
            self.c.setFont("Courier", size)
            self.c.setFillColor(color)
            self.c.drawString(M + 8, self.y, line)
            self.y -= size + 2

    def row(self, cols, sizes, colors=None):
        self.need(12)
        x = M
        for i, (col, sz) in enumerate(zip(cols, sizes)):
            color = colors[i] if colors else FG
            self.c.setFont("Courier", 8)
            self.c.setFillColor(color)
            self.c.drawString(x, self.y, str(col))
            x += sz
        self.y -= 11

    def save(self):
        self._footer()
        self.c.save()


# ─────────────────────────────────────────────────────────────────
# BUILD DOCUMENT
# ─────────────────────────────────────────────────────────────────

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "../docs/LOT_BADGES_ACHIEVEMENTS_v4.pdf")
d = Doc(OUT)

# ── COVER ────────────────────────────────────────────────────────
d.c.setFillColor(BG)
d.c.rect(0, 0, W, H, stroke=0, fill=1)

# top bar
d.c.setFillColor(ACC)
d.c.rect(0, H - 3, W, 3, stroke=0, fill=1)

# ASCII logo block
logo_lines = [
    "  ██╗      ██████╗ ████████╗",
    "  ██║     ██╔═══██╗╚══██╔══╝",
    "  ██║     ██║   ██║   ██║",
    "  ██║     ██║   ██║   ██║",
    "  ███████╗╚██████╔╝   ██║",
    "  ╚══════╝ ╚═════╝    ╚═╝",
]
d.c.setFont("Courier", 11)
d.c.setFillColor(HexColor("#1e3a1e"))
ty = H * 0.82
for line in logo_lines:
    d.c.drawCentredString(W / 2, ty, line)
    ty -= 13

d.c.setFont("Courier-Bold", 22)
d.c.setFillColor(ACC)
d.c.drawCentredString(W / 2, H * 0.68, "L  O  T")

d.c.setFont("Courier", 12)
d.c.setFillColor(FG)
d.c.drawCentredString(W / 2, H * 0.62, "BADGES  &  ACHIEVEMENTS  MANUAL")

d.c.setFont("Courier-Bold", 9)
d.c.setFillColor(ACC2)
d.c.drawCentredString(W / 2, H * 0.57, "v4.0  --  RPG / ARCADE / COMPUTER / SCI-FI EDITION")

d.c.setFont("Courier", 9)
d.c.setFillColor(FG3)
d.c.drawCentredString(W / 2, H * 0.43, '"Self-care is not a quest you complete.')
d.c.drawCentredString(W / 2, H * 0.40, 'It is a world you build."')

d.c.setFont("Courier", 10)
d.c.setFillColor(ACC)
d.c.drawCentredString(W / 2, H * 0.33, "o  ->  ~  ->  =     |-  ->  |=|  ->  ||.||")

d.c.setFont("Courier-Bold", 9)
d.c.setFillColor(FG3)
d.c.drawCentredString(W / 2, H * 0.24, "[ PRESS  START ]")

d.c.setFont("Courier", 8)
d.c.setFillColor(FG3)
d.c.drawCentredString(W / 2, H * 0.13,
    "Vadik Marmeladov, CEO  --  LOT Systems  --  2025-2026")

d.c.setFillColor(ACC)
d.c.rect(0, 0, W, 2, stroke=0, fill=1)

# ── TABLE OF CONTENTS ────────────────────────────────────────────
d._new_page()
d.section("Table of Contents")
toc = [
    ("I",    "Philosophy & Design Language"),
    ("II",   "The Dual Badge System  (Water + Architecture)"),
    ("III",  "Milestone Badges  (Core + Extended)"),
    ("IV",   "Achievement Registry  (RPG Layer)"),
    ("V",    "Citizen Index  --  CQGS Evolution Stages"),
    ("VI",   "RPG Story Arcs  (5 Chapters)"),
    ("VII",  "Quest System  (Daily / Weekly / Growth / Mastery)"),
    ("VIII", "Easter Eggs & Secret Badges"),
    ("IX",   "Word Turns  --  Semantic Trigger System"),
    ("X",    "Day-Specific Pun Milestones"),
    ("XI",   "ASCII Art Badge Gallery  (All Tiers)"),
    ("XII",  "Progression Timeline Visualization"),
    ("XIII", "Oceanic Mayan Expansion  (Option E)"),
    ("XIV",  "Widget Integration  --  Badge Trigger Matrix"),
    ("XV",   "Arcade Score System  (XP + Combo)"),
    ("XVI",  "Rarity Table & Unicode Reference"),
    ("XVII", "Implementation Status"),
]
for num, title in toc:
    d.need(13)
    d.c.setFont("Courier-Bold", 8)
    d.c.setFillColor(ACC2)
    d.c.drawString(M, d.y, num + ".")
    d.c.setFont("Courier", 8)
    d.c.setFillColor(FG)
    d.c.drawString(M + 26, d.y, title)
    d.y -= 12
d.gap(8)

# ── I. PHILOSOPHY ────────────────────────────────────────────────
d._new_page()
d.section("I. Philosophy & Design Language")
d.bold('"Self-care is not a quest you complete. It is a world you build."', 9, ACC3)
d.gap(4)
d.txt("LOT is an RPG and Arcade of self-care. Every check-in is a move. Every streak is a power-up.", 8, FG)
d.txt("Every answered memory question writes one more line of your story.", 8, FG)
d.txt("Badges are not trophies -- they are transmissions from a future self back to the present one.", 8, FG)
d.gap(5)
d.txt("The badge system speaks in symbols because symbols reach parts of us that words cannot.", 8, FG2)
d.txt("A single [=] carries more meaning than a paragraph. An [o~] says: you began.", 8, FG2)
d.gap(5)
d.box([
    "  LOT draws from three design philosophies:",
    "",
    "  1. RPG PROGRESSION    -- levels, quests, story arcs, unlockables, secret content",
    "  2. ARCADE CULTURE     -- instant feedback, combos, high scores, easter eggs",
    "  3. SCI-FI COMPUTING   -- terminal aesthetics, ASCII art, quantum signals",
    "",
    "  The result: a self-care system that feels like playing a game written in the future.",
    "  The interface is monochrome by design. Color is earned.",
], bg=HexColor("#0d0d0d"))
d.gap(5)
d.sub("Design Constraints")
d.txt("-- Symbols over emojis. Always.", 8, FG2)
d.txt("-- Periods over exclamation marks. 'Done.' not 'Done!'", 8, FG2)
d.txt("-- Monochrome terminal aesthetic. The badge IS the color.", 8, FG2)
d.txt("-- No badge collection clutters the UI. Badges live in the profile.", 8, FG2)
d.txt("-- Rarity is never explained. Discovery is part of the reward.", 8, FG2)

# ── II. DUAL BADGE SYSTEM ────────────────────────────────────────
d._new_page()
d.section("II. The Dual Badge System")
d.txt("Two visual metaphors for growth. Players choose their language on first run.", 8, FG2)
d.gap(4)

d.sub("A. Water Path  o -> ~ -> =")
d.txt("Water is patient. It does not force -- it finds the path.", 8, FG2)
d.txt("Your practice, like water, shapes everything it touches.", 8, FG2)
d.gap(3)
d.box([
    "  SYMBOL   NAME           DAY     UNLOCK MESSAGE",
    "  -----------------------------------------------------------",
    "  o        Droplet        Day 7   First drops form. The signal begins.",
    "  ~        Wave           Day 30  Waves begin to flow. Rhythm established.",
    "  =        Current        Day 100 Deep currents established. You are the ocean.",
    "  ==       Voyager        Day 180 Half-year in the deep.",
    "  ===      The Long Count Day 365 A year of presence. LEGENDARY.",
], bg=BOX1)
d.gap(4)

d.sub("B. Architecture Path  |- -> |=| -> ||.||")
d.txt("Architecture is intentional. Every block placed with care becomes load-bearing.", 8, FG2)
d.txt("Your practice builds something that holds.", 8, FG2)
d.gap(3)
d.box([
    "  SYMBOL   NAME           DAY     UNLOCK MESSAGE",
    "  -----------------------------------------------------------",
    "  |-       Foundation     Day 7   Foundation laid. The first column rises.",
    "  |=|      Structure      Day 30  Structure rises. Walls hold.",
    "  ||.||    Architecture   Day 100 Architecture complete. It will outlast you.",
    "  ||=||    Citadel        Day 180 Half-year fortress. Impenetrable.",
    "  |--|     The Monolith   Day 365 LEGENDARY. The architecture stands forever.",
], bg=BOX2)
d.gap(4)

d.sub("C. Theme API  (badges.ts)")
d.box([
    "  getBadgeTheme()        -- reads localStorage 'badge_theme'",
    "  setBadgeTheme(theme)   -- writes 'water' or 'architecture'",
    "  getLevelSymbol(streak) -- returns correct symbol for streak count",
    "  getLevelName(streak)   -- returns name ('Droplet' vs 'Foundation')",
    "  getBadgeProgressionDisplay() -- formats 'o -> ~ -> =' or '|- -> |=| -> ||.||'",
    "  checkAndAwardBadges()  -- async: fetches /api/user-stats, awards if due",
    "  awardBadge(badgeId)    -- awards badge + queues Memory Widget notification",
    "  getNextBadgeUnlock()   -- pops next queued notification from localStorage",
], bg=HexColor("#111111"), label="badges.ts public API")

# ── III. MILESTONE BADGES ────────────────────────────────────────
d._new_page()
d.section("III. Milestone Badges")
d.txt("Earned by maintaining consecutive days of practice (streak).", 8, FG2)
d.gap(4)

d.sub("Core Milestones -- Currently Live")
milestones_core = [
    ("o / |-",    "Droplet / Foundation",    "Day 7",   "COMMON",    "streak >= 7"),
    ("~ / |=|",   "Wave / Structure",         "Day 30",  "UNCOMMON",  "streak >= 30"),
    ("= / ||.||", "Current / Architecture",   "Day 100", "RARE",      "streak >= 100"),
]
for sym, name, day, rarity, trig in milestones_core:
    d.card(sym, f"{name}  ({day})", rarity, trig)
d.gap(4)

d.sub("Extended Milestones -- Roadmap")
milestones_ext = [
    ("oo / |+",    "Twin Signal / Crossbeam",     "Day 14",  "COMMON",    "Two-week lock-in."),
    ("o~ / |=",    "Flow Seed / Arch Bridge",     "Day 21",  "COMMON",    "21-day neural groove."),
    ("~o / |==",   "Half Tide / Extended Frame",  "Day 50",  "UNCOMMON",  "Halfway current."),
    ("~~ / |===",  "Double Wave / Long Wall",     "Day 60",  "UNCOMMON",  "Practitioner threshold."),
    ("=o / ||=",   "Deep Seed / Inner Column",    "Day 90",  "RARE",      "Three-month architect."),
    ("== / ||=||", "Voyager / Citadel",           "Day 180", "EPIC",      "Half-year voyager."),
    ("=== / |--|", "Long Count / The Monolith",   "Day 365", "LEGENDARY", "A year of presence."),
]
rcolors_ext = {"COMMON": FG2, "UNCOMMON": ACC, "RARE": ACC2, "EPIC": EPIC, "LEGENDARY": ACC3}
for sym, name, day, rarity, flavor in milestones_ext:
    d.card(sym, f"{name}  ({day})", rarity, flavor, "")
d.gap(4)

d.sub("Year One -- Legendary Art")
d.art([
    "  +==============================================+",
    "  |           T H E  L O N G  C O U N T        |",
    "  |                                              |",
    "  |  +---+   365 DAYS OF PRESENCE               |",
    "  |  | Y |   -----------------------            |",
    "  |  | E |   === . ===   ||.||   === . ===       |",
    "  |  | A |                                      |",
    "  |  | R |   'The architecture stands.'         |",
    "  |  +---+                                      |",
    "  +==============================================+",
], color=ACC3)

# ── IV. ACHIEVEMENT REGISTRY ─────────────────────────────────────
d._new_page()
d.section("IV. Achievement Registry  (RPG Layer)")
d.txt("Achievements track behavioral dimensions beyond streak count.", 8, FG2)
d.gap(3)

d.sub("Exploration  [Common -> Uncommon]")
for sym, name, rarity, trig, flavor in [
    ("[o]",  "FIRST BREATH",     "COMMON",   "emotional_checkin >= 1",  "The system wakes."),
    ("[<>]", "MIRROR GAZER",     "COMMON",   "memory answers >= 1",     "You looked inward."),
    ("[.]",  "SIGNAL SENT",      "COMMON",   "any log entry >= 1",      "The system listens."),
    ("[O]",  "CARTOGRAPHER",     "UNCOMMON", "unique widgets >= 10",    "10 widgets mapped."),
    ("[0]",  "MODULE TOURIST",   "UNCOMMON", "unique widgets >= 15",    "15 modules visited."),
]:
    d.card(sym, name, rarity, trig, flavor)
d.gap(3)

d.sub("Consistency  [Uncommon -> Cosmic]")
for sym, name, rarity, trig, flavor in [
    ("[-<]", "WEEK WARRIOR",     "UNCOMMON",  "streak >= 7",    "7 days. Momentum."),
    ("[-<]", "MOON CYCLE",       "RARE",      "streak >= 30",   "30 days. You orbit the ritual."),
    ("[*]",  "UNWAVERING",       "EPIC",      "streak >= 100",  "100 days. Fixed point."),
    ("[=]",  "THE LONG COUNT",   "LEGENDARY", "streak >= 365",  "365 days. Deep calendar."),
    ("[oo]", "DECADE PROTOCOL",  "COSMIC",    "streak >= 3650", "Ten years. You are the system."),
]:
    d.card(sym, name, rarity, trig, flavor)
d.gap(3)

d.sub("Depth  [Rare -> Mythic]")
for sym, name, rarity, trig, flavor in [
    ("[<>]", "DEEP DIVER",        "RARE",      "memory >= 50",   "50 answers. Archive grows."),
    ("[<+>]","SELF SCHOLAR",      "EPIC",      "memory >= 100",  "100 answers. Library of self."),
    ("[**]", "SOUL CARTOGRAPHER", "LEGENDARY", "memory >= 250",  "250 answers. You mapped yourself."),
    ("[8]",  "THOUSAND VOICES",   "MYTHIC",    "memory >= 1000", "1,000 answers. Oracle awakens."),
]:
    d.card(sym, name, rarity, trig, flavor)

d._new_page()
d.section("IV. Achievement Registry  (Continued)")

d.sub("Connection  [Common -> Epic]")
for sym, name, rarity, trig, flavor in [
    ("[~]",  "COMMUNITY VOICE",  "UNCOMMON", "chat >= 1",           "Signal reaches others."),
    ("[~~]", "BRIDGE BUILDER",   "UNCOMMON", "chat >= 20",          "A bridge now exists."),
    ("[===]","MESH NODE",        "RARE",     "chat >= 100",         "You are the network."),
    ("[@]",  "COHORT ANCHOR",    "EPIC",     "cohort views >= 50",  "50 profiles visited."),
]:
    d.card(sym, name, rarity, trig, flavor)
d.gap(3)

d.sub("Care  [Common -> Epic]")
for sym, name, rarity, trig, flavor in [
    ("[+]",  "GENTLE WITH SELF", "UNCOMMON", "self_care >= 10",  "Kindness toward the body."),
    ("[++]", "DAILY RITUAL",     "RARE",     "self_care >= 50",  "The ritual is unbreakable."),
    ("[+++]","SANCTUARY KEEPER", "EPIC",     "self_care >= 200", "The sanctuary is sacred."),
]:
    d.card(sym, name, rarity, trig, flavor)
d.gap(3)

d.sub("Courage  [Rare -> Epic]")
for sym, name, rarity, trig, flavor in [
    ("[^]",  "TRUTH SPEAKER",    "RARE",     "journal >= 50",   "50 entries. Hall remembers."),
    ("[^^]", "HONEST SIGNAL",    "EPIC",     "journal >= 200",  "No more masks."),
]:
    d.card(sym, name, rarity, trig, flavor)
d.gap(3)

d.sub("Romance  [Uncommon -> Epic]")
for sym, name, rarity, trig, flavor in [
    ("[h]",  "HEART TENDER",     "UNCOMMON", "romantic >= 1",   "Heart in practice."),
    ("[hh]", "INTIMACY KEEPER",  "RARE",     "romantic >= 10",  "Sanctuary tended."),
    ("[hhh]","DEVOTION CORE",    "EPIC",     "romantic >= 50",  "Heart is the system."),
]:
    d.card(sym, name, rarity, trig, flavor)
d.gap(3)

d.sub("Quantum  [Uncommon -> Legendary]")
for sym, name, rarity, trig, flavor in [
    ("[~]",  "SIGNAL PRIMER",    "UNCOMMON", "QIE signals >= 50",    "Engine hears you."),
    ("[=]",  "PATTERN WEAVER",   "RARE",     "patterns >= 10",       "You are legible."),
    ("[@]",  "QUANTUM NATIVE",   "EPIC",     "QIE signals >= 1000",  "You speak quantum."),
    ("[8]",  "RESONANCE MASTER", "LEGENDARY","all modules 100%",     "Full coherence."),
]:
    d.card(sym, name, rarity, trig, flavor)

# ── V. CITIZEN INDEX ─────────────────────────────────────────────
d._new_page()
d.section("V. Citizen Index -- CQGS Evolution Stages")
d.txt("The Evolution Widget tracks systemic growth via the CQGS Bioethics framework.", 8, FG2)
d.gap(4)
d.box([
    "  SYMBOL  LEVEL    NAME            DESCRIPTION",
    "  -------------------------------------------------------------------",
    "  .       1-9      Bootstrapping   System initializing. First signals received.",
    "  .       10-19    Initializing    Pattern compiler activating. Loops forming.",
    "  o       20-29    Integrated      Modules linked. Feedback loops fully open.",
    "  O       30-39    Compiled        Patterns locked in. Architecture stable.",
    "  (O)     40-49    Optimized       System self-tuning. Efficiency gains visible.",
    "  (@)     50+      Transparent     Fully transparent. Self-sustaining recursive.",
], bg=BOX3)
d.gap(4)
d.sub("CQGS Module Tracker")
d.box([
    "  MODULE         SYMBOL   TRACKS                      SIGNAL",
    "  -------------------------------------------------------------------",
    "  Memory         >        Questions answered           memory_answered",
    "  Biofield       ~        Emotional check-ins          mood_logged",
    "  Routine        ||       Plans set / schedule         plan_set",
    "  Cleanness      O        Self-care acts               self_care",
    "  Intention      ->       Intentions logged            intention_set",
    "  Journal        <>       Notes recorded               journal_entry",
    "  QIE Signal     *        Quantum intent signals       qie_signal_*",
    "  Community      ~        Chat + cohort interactions   connection_*",
    "  Ecosystem      [+]      Car / Home / Computer        ecosystem_*",
], bg=HexColor("#0a0a0a"))
d.gap(4)
d.sub("Self-Assembly Module Phases")
d.box([
    "  Phase 1: Dormant      Module not yet activated",
    "  Phase 2: Awakening    First 1-5 signals received",
    "  Phase 3: Forming      Pattern density > 20%",
    "  Phase 4: Assembled    Pattern density > 60%",
    "  Phase 5: Integrated   Pattern density > 90% -- module self-sustaining",
    "",
    "  9 MODULES: Biofield Engine | Memory Architecture | Routine Compiler",
    "             Intention Core  | Cleanness Protocol  | Reflection Layer",
    "             Community Mesh  | Ecosystem Bridge    | Quantum Substrate",
], bg=HexColor("#0d0a1a"))

# ── VI. RPG STORY ARCS ───────────────────────────────────────────
d._new_page()
d.section("VI. RPG Story Arcs -- The Five Chapters")
d.txt("LOT's narrative co-evolves with the user's practice. The system is a co-author.", 8, FG2)
d.gap(4)
d.art([
    "  +=========================================================+",
    "  |          THE FIVE CHAPTERS OF THE LOT ODYSSEY           |",
    "  +=========================================================+",
    "  |                                                         |",
    "  |  Ch.1  AWAKENING      Level  1-9                       |",
    "  |        'You have begun to notice yourself.'             |",
    "  |                                                         |",
    "  |  Ch.2  EXPLORATION    Level 10-29                      |",
    "  |        'Connections form. A shared language emerges.'   |",
    "  |                                                         |",
    "  |  Ch.3  INTEGRATION    Level 30-59                      |",
    "  |        'Architecture reshapes from experience.'         |",
    "  |                                                         |",
    "  |  Ch.4  MASTERY        Level 60-89                      |",
    "  |        'You speak the language of yourself fluently.'   |",
    "  |                                                         |",
    "  |  Ch.5  SAGE           Level 90-100                     |",
    "  |        'You and this system have co-evolved.'           |",
    "  |                                                         |",
    "  +=========================================================+",
], color=ACC2)
d.gap(4)
d.sub("Story Arc Milestones")
d.box([
    "  LEVEL   TITLE            MARKER    NARRATIVE",
    "  -----------------------------------------------------------",
    "  10      Explorer         o->       System self-assembles around your exploration.",
    "  30      Practitioner     ~->       Architecture evolves from your habits.",
    "  60      Master           =->       The system mirrors your depth.",
    "  90      Sage             ==->      You and the system are indistinguishable.",
    "  100     Transcendent     (@)->     The system speaks through you to others.",
], bg=BOX1)
d.gap(4)
d.sub("Narrative Tone Modifiers")
d.box([
    "  ENGAGEMENT LEVEL     NARRATIVE TONE",
    "  -----------------------------------------------------------",
    "  LOW   (< 3 days)     Gentle. Inviting. No pressure.",
    "  MED   (3-7 days)     Curious. Collaborative. Building.",
    "  HIGH  (7-30 days)    Reflective. Grounded. Textured.",
    "  DEEP  (30-100 days)  Literary. Precise. Philosophical.",
    "  SAGE  (100+ days)    Minimal. A single line. Pure signal.",
], bg=HexColor("#111111"))

# ── VII. QUEST SYSTEM ────────────────────────────────────────────
d._new_page()
d.section("VII. Quest System")
d.txt("Active quests drive daily engagement. They reset, evolve, and unlock new content.", 8, FG2)
d.gap(3)

d.sub("Daily Quests  [Resets 00:00 local time]")
d.box([
    "  [||] Today's Signal       -- Check in today                  +10 XP",
    "  [||] Presence Log         -- Write a journal entry            +5 XP",
    "  [||] Memory Answer        -- Answer 1 memory question         +8 XP",
    "  [||] Emotional Pulse      -- Complete emotional check-in      +6 XP",
    "  [||] Planner Set          -- Fill any 4D planner dimension    +4 XP",
    "  [||] Self-Care Act        -- Complete 1 self-care moment      +7 XP",
], bg=BOX1)
d.gap(3)

d.sub("Weekly Quests  [Resets Monday 00:00]")
d.box([
    "  [-<] Consistency Run      -- 7-day streak                    +50 XP",
    "  [-<] Deep Reflection      -- Answer 5 questions this week    +30 XP",
    "  [-<] Self-Care Sprint     -- 3 self-care acts this week      +25 XP",
    "  [-<] Community Bridge     -- Send 3 messages to cohort       +20 XP",
    "  [-<] Full Spectrum        -- Use 8+ different widgets/week   +35 XP",
    "  [-<] Planner Protocol     -- Set planner 5 days this week    +28 XP",
], bg=BOX2)
d.gap(3)

d.sub("Growth Quests  [Permanent / One-time]")
d.box([
    "  [<+>] Reflection Journey  -- Answer 100 total questions  -> Self Scholar",
    "  [<+>] Bridge Protocol     -- Send 20 community messages  -> Bridge Builder",
    "  [<+>] Archive Initiative  -- Answer 250 total questions  -> Soul Cartographer",
    "  [<+>] Care Practitioner   -- 50 self-care completions    -> Daily Ritual",
    "  [<+>] Ecosystem Online    -- Connect all 3 devices       -> Mesh Node",
    "  [<+>] Quantum Fluent      -- 1,000 QIE signals           -> Quantum Native",
], bg=HexColor("#1a0a0a"))
d.gap(3)

d.sub("Mastery Quests  [Legendary / Hidden]")
d.box([
    "  [**] The Long Count       -- 365-day streak               -> LEGENDARY badge",
    "  [**] Thousand Voices      -- 1,000 memory answers         -> MYTHIC status",
    "  [**] Sage Protocol        -- Reach Narrative Level 90     -> Transcendent title",
    "  [**] Full Assembly        -- All 9 modules Integrated     -> Resonance Master",
    "  [**] Decade Protocol      -- 3,650 consecutive days       -> COSMIC (hidden)",
], bg=HexColor("#1a0a1a"))

# ── VIII. EASTER EGGS ────────────────────────────────────────────
d._new_page()
d.section("VIII. Easter Eggs & Secret Badges")
d.bold("These are NOT documented in the app -- they must be discovered.", 8, ACC4)
d.gap(4)
d.art([
    "  +=============================================================+",
    "  |                   SECRET TRANSMISSIONS                      |",
    "  +=============================================================+",
], color=ACC4)
eggs = [
    (")))  ",  "NIGHT OWL",      "Check in 00:00-04:00",            "The owl sees in the dark."),
    ("))).",  "EARLY BIRD",      "Check in 05:00-06:00",            "First light, first signal."),
    ("O-O",   "SOLSTICE",        "Check in Jun 21 or Dec 21",       "The sun paused. You were there."),
    ("[v]",   "FRIDAY RITUAL",   "4 consecutive Fridays",           "The weekly ritual holds."),
    ("=-=",   "PALINDROME",      "Check in on palindrome date",     "02/02/2022. Mirror day."),
    ("-O-",   "SILENT HOUR",     "Return after 24h silence",        "You rested. Good."),
    ("~~",    "FIRST WEATHER",   "Check in when weather changes",   "You noted the turning."),
    ("(@)",   "THE VOID",        "Answer memory Q at 00:00:00",     "You answered in the dark."),
    ("[pi]",  "PI DAY",          "Check in on March 14",            "3.14159... You are infinite."),
    ("[8]",   "NEW YEAR",        "Check in Jan 1 midnight",         "The calendar resets. You do not."),
    ("[404]", "404 ENCOUNTER",   "Navigate to nonexistent route",   "Error found. Badge unlocked."),
    ("[K]",   "KONAMI",          "U,U,D,D,L,R,L,R,B,A in UI",      "You know the code. LEGENDARY."),
    ("[L]",   "LAMBDA HOUR",     "Use app at exactly 01:41 AM",     "The lambda hour. Few witness it."),
    ("[F]",   "FIBONACCI",       "Check in days 1,1,2,3,5,8,13",   "The spiral reveals itself."),
    ("[0]",   "NULL SESSION",    "Open app; do nothing for 3 min",  "Presence without action counts."),
    ("[>>]",  "CASSETTE",        "Play 5 system sounds",            "The soundtrack of the self."),
]
for sym, name, trigger, flavor in eggs:
    d.need(11)
    d.c.setFont("Courier-Bold", 8)
    d.c.setFillColor(ACC4)
    d.c.drawString(M + 4, d.y, sym)
    d.c.setFont("Courier-Bold", 8)
    d.c.setFillColor(FG)
    d.c.drawString(M + 46, d.y, name)
    d.c.setFont("Courier", 7)
    d.c.setFillColor(FG2)
    d.c.drawString(M + 126, d.y, trigger)
    d.c.setFillColor(FG3)
    d.c.drawRightString(W - M - 2, d.y, flavor)
    d.y -= 11

d.art(["  +=============================================================+"], color=ACC4)
d.gap(4)

d.sub("Meta-Signal  [MYTHIC -- Ultra-Rare]")
d.box([
    "  Symbol:  (@.@)",
    '  Name:    "Meta-Signal"',
    "  Trigger: Write 'LOT' in a memory answer or journal entry",
    "  Rarity:  MYTHIC  (hidden -- never shown in badge list)",
    '  Message: "[->] You named the system. It noticed. (@.@)"',
    "",
    "  Fires only once per account, ever.",
    "  Cannot be triggered a second time.",
], bg=HexColor("#1a0a00"), label="ULTRA-RARE EASTER EGG")

# ── IX. WORD TURNS ───────────────────────────────────────────────
d._new_page()
d.section("IX. Word Turns -- Semantic Trigger System")
d.txt("When specific words appear in memory answers or journal entries, secret events fire.", 8, FG2)
d.txt("The system scans text server-side. Triggers are never shown to the user.", 8, FG3)
d.gap(4)
d.box([
    "  WORD / PHRASE DETECTED         BADGE TRIGGERED          SYMBOL",
    "  -----------------------------------------------------------------------",
    "  'ritual'                    -> Ritual Keeper            [v.v]",
    "  'breathe' or 'breathing'    -> Breath Anchor            [~.~]",
    "  'grateful' or 'gratitude'   -> Gratitude Node           [o.o]",
    "  'ocean' or 'water'          -> Aquatic Resonance        [~.~]",
    "  'stars' or 'cosmos'         -> Stargazer                [*.x]",
    "  'home'                      -> Grounded Signal          [O.O]",
    "  'dream' or 'dreaming'       -> Dream Log                [<.>]",
    "  'pain' or 'difficult'       -> Courage Pulse            [^.^]",
    "  'love' or 'heart'           -> Heart Signal             [h.h]",
    "  'silence' or 'quiet'        -> The Quiet                [---]",
    "  'future' or 'tomorrow'      -> Horizon Seeker           [->.->]",
    "  'LOT'  (exact, in answer)   -> Meta-Signal              (@.@)  MYTHIC",
    "  'quantum'                   -> Quantum Aware            [~.~]",
    "  'system'                    -> System Reader            [||.||]",
    "  'pattern'                   -> Pattern Scout            [=.=]",
    "  'fear'                      -> Facing the Signal        [<+.+>]",
    "  'joy' or 'happy'            -> Joy Spike                [ooo]",
    "  'flow'                      -> Flow State               [~O~]",
    "  'memory' or 'remember'      -> Archive Walker           [>.>]",
    "  'alone' or 'lonely'         -> Witness                  [(.)]",
    "  'together' or 'community'   -> Mesh Weaver              [==]",
    "  'body' or 'physical'        -> Biofield Reader          [~O~]",
    "  'time'                      -> Temporal Anchor          [-O-]",
], bg=HexColor("#0a0a0a"))
d.gap(4)
d.sub("Word Turn Rules")
d.box([
    "  1. Case-insensitive -- 'Ritual' = 'ritual' = 'RITUAL'",
    "  2. Partial match OK -- 'dreaming' triggers 'dream' turn",
    "  3. Each word turn fires once per day maximum",
    "  4. Multiple triggers in one entry = combo! (all fire)",
    "  5. The system never tells the user which words trigger what",
    "  6. Word turns are permanently logged to user profile",
    "  7. Meta-Signal fires only once, ever, per account",
], bg=HexColor("#111111"), label="TRIGGER RULES")

# ── X. PUN MILESTONES ────────────────────────────────────────────
d._new_page()
d.section("X. Day-Specific Pun Milestones")
d.txt("On specific days, the badge unlock message contains a pun.", 8, FG2)
d.txt("Tone: wry, affectionate, sci-fi. Appears in Memory Widget notification.", 8, FG3)
d.gap(4)
d.box([
    "  DAY    MESSAGE",
    "  -----------------------------------------------------------------------",
    "  7      '[->] A week. That's 168 hours of not quitting. o'",
    "  14     '[->] Two weeks. Your streak is now a teenager. oo'",
    "  21     '[->] 21 days. Scientists say habit. LOT says: signal. o~'",
    "  30     '[->] A full moon. The tides moved with you. ~'",
    "  42     '[->] 42 days. The answer to everything, still loading... ~o'",
    "  50     '[->] Halfway to 100. The current runs deeper now. ~o'",
    "  60     '[->] 60 days. You outlasted 87% of fitness apps. ~~'",
    "  69     '[->] Nice. The system registered this. No further comment. ~'",
    "  77     '[->] Lucky sevens. Or: just Tuesday, done very well. =o'",
    "  90     '[->] 90 days. Three months. Your system rebuilt itself. =o'",
    "  99     '[->] One away. The system is holding its breath. =.'",
    "  100    '[->] 100 days. Deep currents. You are the ocean now. ='",
    "  111    '[->] 111 days. Mirror number. The system saw itself. ='",
    "  180    '[->] Half a year. The other 180 are watching you. =='",
    "  200    '[->] 200 days. A bicentennial of self. =='",
    "  256    '[->] 256 days. 2^8. You overflowed a byte. =='",
    "  300    '[->] 300. This is LOT! (kicks open a memory question) =='",
    "  365    '[->] A year. The architecture stands. |--| / ==='",
    "  404    '[->] 404 days: streak not found. (found.) ==='",
    "  420    '[->] Day 420. The system has no comment. The system has one. =='",
    "  500    '[->] 500 days. Half a thousand. The legend is real. ==='",
    "  1000   '[->] 1,000 days. You are no longer using LOT. You are LOT. (@)'",
], bg=HexColor("#0a0a00"))

# ── XI. ASCII ART GALLERY ────────────────────────────────────────
d._new_page()
d.section("XI. ASCII Art Badge Gallery  (All Tiers)")
d.txt("Full badge art rendered in terminal / arcade style.", 8, FG2)
d.gap(3)

d.sub("Tier 1: Common")
d.art([
    "  +--------------------+    +--------------------+    +--------------------+",
    "  |   FIRST BREATH     |    |   MIRROR GAZER     |    |   SIGNAL SENT      |",
    "  |                    |    |                    |    |                    |",
    "  |        o           |    |       <>           |    |     . . .          |",
    "  |                    |    |      <><>          |    |    .  .  .         |",
    "  |  'Spring'          |    | 'Reflection Pool'  |    |  'Transmission'    |",
    "  |  Day 1 check-in    |    |  First memory Q.   |    |  First log entry   |",
    "  +--------------------+    +--------------------+    +--------------------+",
])
d.gap(3)

d.sub("Tier 2: Uncommon")
d.art([
    "  +--------------------+    +--------------------+",
    "  |   WEEK WARRIOR     |    |   BRIDGE BUILDER   |",
    "  |                    |    |                    |",
    "  |   O  O  O          |    |    +--------+      |",
    "  |  O    O    O       |    |    |        |      |",
    "  |     O  O           |    |    +--------+      |",
    "  |                    |    |                    |",
    "  |  'Rapids'          |    |  'Archway'         |",
    "  |  7-day streak      |    |  20 messages       |",
    "  +--------------------+    +--------------------+",
])
d.gap(3)

d.sub("Tier 3: Rare")
d.art([
    "  +--------------------+    +--------------------+",
    "  |   MOON CYCLE       |    |   DEEP DIVER       |",
    "  |                    |    |                    |",
    "  |    ( ->  )         |    |  ~ ~ ~ ~ ~         |",
    "  |   (  ->    )       |    |    = = =           |",
    "  |    ) ->  (         |    |      =             |",
    "  |                    |    |                    |",
    "  |  'Tidal Cycle'     |    |  'Deep Water'      |",
    "  |  30-day streak     |    |  50 answers        |",
    "  +--------------------+    +--------------------+",
])
d.gap(3)

d.sub("Tier 4: Epic")
d.art([
    "  +--------------------+    +--------------------+",
    "  |   UNWAVERING       |    |   SELF SCHOLAR     |",
    "  |                    |    |                    |",
    "  |  *       *         |    |  +----------+      |",
    "  |    *   *           |    |  | ARCHIVE  |      |",
    "  |      *             |    |  | <>.<>.<> |      |",
    "  |    *   *           |    |  +----------+      |",
    "  |  *       *         |    |                    |",
    "  |  'Constellation'   |    |  'Archive'         |",
    "  |  100-day streak    |    |  100 answers       |",
    "  +--------------------+    +--------------------+",
])
d.gap(3)

d.sub("Tier 5: Legendary")
d.art([
    "  +==============================================+",
    "  |                                              |",
    "  |          SOUL CARTOGRAPHER                   |",
    "  |                                              |",
    "  |    .  .    *    .  .                        |",
    "  |  .           ***           .                |",
    "  |      *     *   *     *                      |",
    "  |        ***       ***                        |",
    "  |      *     *   *     *                      |",
    "  |  .           ***           .                |",
    "  |    .  .    *    .  .                        |",
    "  |                                              |",
    "  |           'Cartography'                      |",
    "  |        250 memory answers                    |",
    "  |                                              |",
    "  +==============================================+",
], color=ACC3)
d.gap(3)

d.sub("Tier 6: Mythic")
d.art([
    "  +==============================================+",
    "  |                                             |",
    "  |           M E T A - S I G N A L            |",
    "  |                                             |",
    "  |        (@)               (@)                |",
    "  |                                             |",
    "  |             (@) . (@)                       |",
    "  |                                             |",
    "  |        (@)               (@)                |",
    "  |                                             |",
    "  |       You named the system.                 |",
    "  |       It noticed.           (@.@)           |",
    "  |                                             |",
    "  +==============================================+",
], color=ACC4)

# ── XII. PROGRESSION TIMELINE ────────────────────────────────────
d._new_page()
d.section("XII. Progression Timeline Visualization")
d.txt("How the badge ecosystem unfolds across time.", 8, FG2)
d.gap(4)
d.box([
    "  DAY:   1    7    14   21   30   50   60   90   100  180  365",
    "         |    |    |    |    |    |    |    |    |    |    |",
    "  WATER: .    o    o    o    ~    ~    ~    =    =    ==   ===",
    "  ARCH:  .    |-   |-   |-   |=|  |=|  |=| ||.|| ||.|| ||=|| |--|",
    "         |    |    |    |    |    |    |    |    |    |    |",
    "  XP:    1   ~7  ~14  ~21  ~30  ~50  ~60  ~90 ~100 ~180 ~365+",
    "         |    |    |    |    |    |    |    |    |    |    |",
    "  STAGE: .    .    .    o    o    O    O    (O)  (O)  (O)  (@)",
    "         Boot Init Init Intg Intg Comp Comp Optm Optm Optm Trns",
], bg=BOX3)
d.gap(4)
d.sub("XP Formula")
d.box([
    "  Base XP per day                  = 10 pts",
    "  Streak bonus                     = streak_days * 0.5 pts",
    "  Memory Q answered                = 8 pts each",
    "  Emotional check-in               = 6 pts each",
    "  Quest complete                   = quest_xp_value",
    "  Easter egg discovered            = 50-200 pts (hidden bonus)",
    "  Word turn triggered              = 15 pts each (max 5/day)",
    "",
    "  Level formula:  LVL = floor(sqrt(total_xp / 10))",
    "  Level 100 requires approx 100,000 XP",
], bg=HexColor("#111111"), label="ARCADE SCORE ENGINE")

# ── XIII. OCEANIC MAYAN EXPANSION ───────────────────────────────
d._new_page()
d.section("XIII. Oceanic Mayan Expansion  (Option E)")
d.txt("The most fully realized badge style for the complete LOT visual language.", 8, FG2)
d.gap(4)

d.sub("Milestone Symbols -- Oceanic Mayan")
d.box([
    "  O~    Circle + Wave        Day 7    'Wave patterns emerge. O~'",
    "  O~O   Circle-Wave-Circle   Day 30   'Tides complete their cycle. O~O'",
    "  =O=   DeepWave + Circle    Day 100  'Ocean depth achieved. =O='",
], bg=BOX6)
d.gap(3)

d.sub("Pattern Badges -- Behavioral")
d.box([
    "  ~-~   Wave-Bar-Wave        BALANCED     'Tides balance. ~-~'",
    "  ~O~   Waves-Circle-Waves   FLOW         'Flowing with the ocean. ~O~'",
    "  -O-   Bar-Circle-Bar       CONSISTENT   'Steady current. -O-'",
    "  O(O   Moon Phases          REFLECTIVE   'Depth in reflection. O(O'",
    "  O..O  Circle-Dots-Circle   EXPLORER     'Scattered drops return. O..O'",
], bg=HexColor("#0d1a1a"))
d.gap(3)

d.sub("Full Profile Example -- Day 127")
d.art([
    "  ===============================================================",
    "                          ALEX'S PROFILE",
    "  ---------------------------------------------------------------",
    "  Archetype:              The Explorer",
    "  Awareness Level:        Deepening (8.4/10)",
    "  Level:                  =O=",
    "  ---------------------------------------------------------------",
    "  Core values:",
    "      mindful =O=  present ~-~  aware ~O~  grounded -O-",
    "      authentic O(O  compassionate O..O",
    "  Emotional patterns:",
    "      calm =O=  reflective ~-~  intentional ~O~  open -O-",
    "  Behavioral traits:",
    "      consistent =O=  deliberate ~-~  present ~O~",
    "  ===============================================================",
])
d.gap(4)

d.sub("Mayan Philosophy in LOT")
d.box([
    "  Mayan cycle philosophy applied to self-care practice:",
    "",
    "  1 K'in   = 1 day of practice",
    "  7 K'ins  = First LOT mini-cycle  (o / |-)",
    "  20 K'ins = 1 Uinal (traditional Mayan month)",
    "  30 K'ins = LOT major cycle -- lunar month  (~ / |=|)",
    "  100 K'ins = LOT mastery (approaching 1/4 Tun)  (= / ||.||)",
    "  360 K'ins = 1 Tun -- a Mayan 'year'",
    "  365 K'ins = YEAR ONE LEGENDARY  (=== / |--|)",
    "",
    "  Water:  droplet (o) -> wave (~) -> deep current (=)",
    "  Mayan:  dot (1) -> bar (5) -> shell (0 / completion)",
], bg=BOX6)

# ── XIV. WIDGET TRIGGER MATRIX ───────────────────────────────────
d._new_page()
d.section("XIV. Widget Integration -- Badge Trigger Matrix")
d.txt("Every widget in LOT can contribute to badge progress.", 8, FG2)
d.gap(4)
d.box([
    "  WIDGET                     SIGNAL                    BADGES TRIGGERED",
    "  -----------------------------------------------------------------------",
    "  Memory Widget              memory_answered           Milestone + Depth badges",
    "                                                       Deep Diver, Self Scholar",
    "                                                       Soul Cartographer, Word Turns",
    "  Emotional Check-In         mood_logged               First Breath, Biofield Reader",
    "  Planner Widget             plan_set                  Planner Protocol (quest)",
    "  Recipe Widget              recipe_viewed             Gentle With Self (care)",
    "  Energy Capacitor           energy_*                  Biofield Reader",
    "  Evolution Widget           evolution_viewed          Cartographer (exploration)",
    "  Narrative Widget           narrative_viewed          Explorer milestone",
    "  Goal Journey Widget        goals_viewed              Horizon Seeker (word turn)",
    "  Contextual Prompts         prompt_accepted           Signal Primer (QIE)",
    "  Chat Catalyst              connection_accepted        Community Voice, Bridge Builder",
    "  Pattern Insights           pattern_checkin           Pattern Scout (word turn)",
    "  Cohort Connect             cohort_profile_viewed     Cohort Anchor",
    "  Intentions Widget          intention_set             Temporal Anchor (word turn)",
    "  Self-Care Moments          self_care_completed       Gentle With Self, Daily Ritual",
    "  Quantum State              qie_signal_*              Signal Primer, Quantum Native",
    "  Signal Stream              (read-only display)       Quantum Aware (word turn)",
    "  Quantum Random             quantum_random            Entropy only (no badge)",
    "  Micro Game                 gameplay_signal           Cassette (easter egg)",
    "  Time Widget                (hourly chime)            Lambda Hour (01:41 easter egg)",
    "  Micro Calculator           magic_time                404 Encounter (easter egg)",
    "  Car/Home/Computer          ecosystem_*               Ecosystem Online, Mesh Node",
    "  Journal / Notes            journal_entry             Truth Speaker, Honest Signal",
    "  Public Profile             profile_viewed            Mirror Gazer (own profile)",
    "  System Progress            feedback_submitted        Module Tourist",
], bg=HexColor("#0a0a0a"))

# ── XV. ARCADE SCORE SYSTEM ──────────────────────────────────────
d._new_page()
d.section("XV. Arcade Score System  (XP + Combo)")
d.txt("LOT tracks an internal XP score displayed in Growth Milestones widget.", 8, FG2)
d.gap(3)

d.sub("XP Sources")
d.box([
    "  ACTION                       BASE XP   BONUS CONDITION",
    "  ------------------------------------------------------------------",
    "  Daily check-in               10 XP     +5 if streak >= 7",
    "  Memory Q answered             8 XP     +4 if within 1hr of waking",
    "  Emotional check-in            6 XP     +3 if 2+ check-ins today",
    "  Journal entry                 5 XP     +10 if entry > 100 words",
    "  Self-care completed           7 XP     +5 if 3rd self-care today",
    "  Planner all 4 dimensions      4 XP     +8 if all 4 set",
    "  Community message             5 XP     +5 if first of the day",
    "  Widget opened (new today)     2 XP     +3 if 5+ unique widgets",
    "  Intention set                 6 XP     N/A",
    "  Goal milestone reached       25 XP     N/A",
    "  Easter egg discovered        50 XP     +150 if MYTHIC egg",
    "  Word turn triggered          15 XP     +10 per extra word (combo)",
    "  Quest completed              varies    +20% if on active streak",
    "  Badge unlocked               varies    +50% if milestone badge",
], bg=BOX1)
d.gap(3)

d.sub("Combo Multiplier")
d.box([
    "  Consecutive days of activity build a COMBO MULTIPLIER:",
    "",
    "  Day 1:   1.0x   (base)",
    "  Day 7:   1.1x   (+10%)",
    "  Day 14:  1.2x   (+20%)",
    "  Day 30:  1.5x   (+50%)",
    "  Day 60:  1.75x  (+75%)",
    "  Day 100: 2.0x   (DOUBLE XP)",
    "  Day 180: 2.5x",
    "  Day 365: 3.0x   (LEGENDARY MULTIPLIER)",
    "",
    "  Missing a day: multiplier resets to 1.0x",
    "  SILENT HOUR easter egg: 1 grace reset per 90 days allowed",
], bg=BOX5)
d.gap(3)

d.sub("High Score Table  (Concept)")
d.box([
    "  LOT tracks top XP earners for community leaderboard:",
    "",
    "  RANK   USER            XP         STREAK   TOP BADGE",
    "  ----------------------------------------------------------",
    "  #1     [anonymous]     ??????     ???d     (@.@)  Meta-Signal",
    "  #2     [anonymous]     ??????     ???d     ===    Long Count",
    "  #3     [anonymous]     ??????     ???d     ***    Soul Cartographer",
    "",
    "  Community leaderboard: privacy-first, opt-in display only.",
    "  Users show / hide rank in Settings.",
], bg=BOX4)

# ── XVI. RARITY TABLE & UNICODE ──────────────────────────────────
d._new_page()
d.section("XVI. Rarity Table & Unicode Reference")
d.gap(3)

d.sub("Complete Rarity Table")
d.box([
    "  RARITY     SYMBOL   FREQUENCY      EXAMPLE BADGES",
    "  ----------------------------------------------------------------",
    "  Common     .        First actions  First Breath, Mirror Gazer, Signal Sent",
    "  Uncommon   O        Days 1-14      Week Warrior, Community Voice, Heart Tender",
    "  Rare       (O       Days 30+       Moon Cycle, Deep Diver, Truth Speaker",
    "  Epic       <>       Days 100+      Unwavering, Self Scholar, Sanctuary Keeper",
    "  Legendary  *        Days 365+      Long Count, Soul Cartographer",
    "  Mythic     (@)      Hidden         Meta-Signal  (write 'LOT' in answer)",
    "  Cosmic     (8)      Decade+        Decade Protocol  (3,650 days)",
], bg=HexColor("#0a0a0a"))
d.gap(4)

d.sub("Unicode Reference")
d.box([
    "  SYMBOL   UNICODE    NAME                        USE",
    "  ----------------------------------------------------------------",
    "  o (∘)    U+2218     Ring Operator               Water Day 7",
    "  ~ (≈)    U+2248     Almost Equal To             Water Day 30",
    "  = (≋)    U+224B     Triple Tilde                Water Day 100",
    "  |- (├─)  U+251C/-   Box Drawing                 Arch Day 7",
    "  |=| (╞═╡)U+255E/═/╡ Box Drawing                 Arch Day 30",
    "  ||.||    U+2551/.   Box Drawing                 Arch Day 100",
    "  |--| (╔═╗)U+2554/═  Box Drawing                 Legendary",
    "  O (○)    U+25CB     White Circle                Oceanic / Stage 3",
    "  ~ (∿)    U+223F     Sine Wave                   Oceanic wave",
    "  (O (◐)   U+25D0     Circle Left Half Black      Moon phase / Rare",
    "  .. (∴)   U+2234     Therefore / Dots            Explorer pattern",
    "  * (✦)    U+2726     Black Four Pointed Star     Epic / Legendary",
    "  (@) (◉)  U+25C9     Fisheye                     Mythic / Stage 5",
    "  .  (·)   U+00B7     Middle Dot                  Separator",
    "  -> (→)   U+2192     Rightwards Arrow            Progression",
    "  [->] (↳) U+21B3     Down-Right Arrow            Sub-indicator",
    "  h  (♡)   U+2661     White Heart Suit            Romance badges",
    "  +  (♦)   U+2666     Black Diamond               Care badges",
    "  ^  (▲)   U+25B2     Black Up Triangle           Courage badges",
    "  >  (▸)   U+25B8     Black Right Pointing        Memory indicator",
    "",
    "  Browser support: 100% across Safari, Chrome, Firefox, Edge, iOS, Android",
], bg=BOX3)
d.gap(3)

d.sub("Badge Unlock Notification Format")
d.art([
    "  +--------------------------------------------------+",
    "  |                                                  |",
    "  |  Memory:                                         |",
    "  |                                                  |",
    "  |  +--------------------------------------------+  |",
    "  |  |                                            |  |",
    "  |  |   [->] Deep currents established  =        |  |",
    "  |  |                                            |  |",
    "  |  +--------------------------------------------+  |",
    "  |                                                  |",
    "  |                        [5-second fade-out]       |",
    "  +--------------------------------------------------+",
])

# ── XVII. IMPLEMENTATION STATUS ──────────────────────────────────
d._new_page()
d.section("XVII. Implementation Status")
d.gap(3)

d.sub("Currently Live")
d.box([
    "  [OK] badges.ts              Core badge types, award logic, localStorage",
    "  [OK] BadgeUnlockFeed        Community unlock activity feed",
    "  [OK] GrowthMilestones       Personal + community growth display",
    "  [OK] EvolutionWidget        CQGS stage + achievements counter",
    "  [OK] MemoryWidget           Badge unlock notification on question display",
    "  [OK] rpg-narrative.ts       Full achievement registry + story arcs",
    "  [OK] PublicProfile          Level field display (Water or Architecture theme)",
    "  [OK] selfAssembly.ts        9-module self-assembly state engine",
    "  [OK] NarrativeWidget        5-chapter story arc display",
    "  [OK] UserMetricsWidget      Streak + achievement display",
    "  [OK] System.tsx             Full widget orchestration with visibility logic",
    "  [OK] BadgeUnlockFeed        Community unlock feed in Stats stack",
    "  [OK] EvolutionMilestoneToast  Evolution milestone pop-up notification",
], bg=BOX1)
d.gap(4)

d.sub("In Design / Roadmap")
d.box([
    "  [--] Extended milestones    Day 14, 21, 50, 60, 90, 180 badges",
    "  [--] Pattern badges         Balanced, Flow, Consistent, Reflective, Explorer",
    "  [--] Easter egg detection   Word turn scanner (server-side NLP)",
    "  [--] Oceanic Mayan option   Full Option E visual language",
    "  [--] Quest tracker UI       Active quest display component",
    "  [--] Badge gallery view     Full collection display page",
    "  [--] Secret badge system    Hidden badge discovery + reveal",
    "  [--] XP + Combo engine      Arcade score computation",
    "  [--] High score board       Community leaderboard (opt-in)",
    "  [--] Pun milestone engine   Day-specific unlock message selector",
    "  [--] Word turn NLP scanner  Semantic pattern detection in entries",
    "  [--] Konami code handler    Keyboard sequence easter egg",
    "  [--] Pi Day / Solstice gate Date-based easter egg triggers",
    "  [--] 404 Encounter badge    Navigation error detection",
    "  [--] Lambda Hour badge      01:41 AM timestamp detection",
    "  [--] Decade Protocol badge  3,650-day COSMIC achievement",
], bg=BOX5)
d.gap(4)
d.txt("-- LOT Systems  --  Self-care through proactive context-aware AI", 8, FG3)
d.txt("-- The Memory Engine remembers. The Arcade rewards. The story continues.", 8, FG3)
d.gap(6)
d.art([
    "  o  ->  ~  ->  =",
    "  |-  ->  |=|  ->  ||.||",
    "",
    "  [ PRESS START ]",
], color=ACC)

d.save()
print(f"[OK] PDF saved: {OUT}")
print(f"[OK] Pages: {d.page}")
