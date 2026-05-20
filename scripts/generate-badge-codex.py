#!/usr/bin/env python3
"""LOT Systems — Badge & Achievement Codex Generator (reportlab edition)"""

from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
import os

# ── fonts ──────────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont(
    "Mono",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"))
pdfmetrics.registerFont(TTFont(
    "MonoBold",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"))

OUTPUT = "/home/user/LOT-Computer/docs/LOT-BADGE-CODEX.pdf"
W, H = A4   # 595.28 × 841.89 pt

# ── palette (0-1 floats for reportlab) ────────────────────────────────────
BG      = (0.039, 0.039, 0.039)
GREEN   = (0.0,   1.0,   0.39)
DG      = (0.0,   0.70,  0.27)
AMBER   = (1.0,   0.78,  0.19)
CYAN    = (0.31,  0.86,  1.0 )
WHITE   = (0.94,  0.94,  0.94)
DIM     = (0.63,  0.63,  0.63)
RED     = (1.0,   0.31,  0.31)
MAG     = (0.86,  0.31,  1.0 )
BLUE    = (0.31,  0.55,  1.0 )
BORDER  = (0.0,   0.39,  0.20)

# ── canvas wrapper ─────────────────────────────────────────────────────────
class C:
    """Thin wrapper with top-left origin cursor."""

    def __init__(self, filename):
        self.c = canvas.Canvas(filename, pagesize=A4)
        self.y = 0.0          # cursor from top (pt)
        self.lm = 28.0        # left margin
        self.rm = W - 28.0    # right margin

    # core helpers -----------------------------------------------------------
    def new_page(self):
        self.c.showPage()
        self._fill_bg()
        self.y = 0.0

    def _fill_bg(self):
        self.c.setFillColorRGB(*BG)
        self.c.rect(0, 0, W, H, fill=True, stroke=False)

    def _ry(self):
        """Reportlab y (from bottom)."""
        return H - self.y

    def font(self, bold=False, size=9):
        self.c.setFont("MonoBold" if bold else "Mono", size)

    def color(self, rgb):
        self.c.setFillColorRGB(*rgb)

    # drawing ----------------------------------------------------------------
    def text(self, txt, color=WHITE, bold=False, size=9, indent=0, dy=5.5):
        self.font(bold, size)
        self.color(color)
        x = self.lm + indent
        self.c.drawString(x, self._ry() - dy, txt)
        self.y += dy + 1

    def ml(self, txt, color=WHITE, bold=False, size=9, indent=0, line_h=5.5):
        """Multi-cell: auto-wrap on ~76 chars."""
        max_w = self.rm - self.lm - indent
        # rough char width estimation
        cw = size * 0.6
        chars_per_line = max(1, int(max_w / cw))
        words = txt.split(' ')
        lines, cur = [], ''
        for w in words:
            test = (cur + ' ' + w).strip()
            if len(test) <= chars_per_line:
                cur = test
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for ln in lines:
            self.text(ln, color, bold, size, indent, line_h)

    def skip(self, pts=5):
        self.y += pts

    def hr(self, char="─", color=BORDER, n=74):
        self.text(char * n, color, False, 8, 0, 4)

    def page_fill(self):
        self._fill_bg()

    # section header ---------------------------------------------------------
    def header(self, title, color=AMBER):
        self.skip(6)
        self.hr("═", color)
        self.text("  " + title, color, True, 11, 0, 8)
        self.hr("═", color)
        self.skip(4)

    # box drawing ------------------------------------------------------------
    def box(self, lines, color=GREEN):
        w = 74
        top = "╔" + "═" * (w - 2) + "╗"
        bot = "╚" + "═" * (w - 2) + "╝"
        self.text(top, color, False, 8)
        for ln in lines:
            pad = w - 2 - len(ln)
            self.text("║ " + ln + " " * max(0, pad - 1) + "║", color, False, 8)
        self.text(bot, color, False, 8)

    # badge row --------------------------------------------------------------
    def badge(self, sym, name, trigger, msg, color=GREEN):
        self.font(True, 9)
        self.color(color)
        self.c.drawString(self.lm, self._ry() - 5.5, sym)
        self.font(False, 9)
        self.color(WHITE)
        self.c.drawString(self.lm + 30, self._ry() - 5.5, name)
        self.font(False, 8)
        self.color(DIM)
        self.c.drawString(self.lm + 70, self._ry() - 5.5, trigger)
        self.y += 6.5
        self.font(False, 8)
        self.color(DG)
        self.c.drawString(self.lm + 30, self._ry() - 4.5, '"' + msg + '"')
        self.y += 6

    def finish(self):
        self.c.save()
        print(f"[OK] {OUTPUT}")
        print(f"[OK] {os.path.getsize(OUTPUT):,} bytes")


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 1 — COVER
# ══════════════════════════════════════════════════════════════════════════════
def cover(c: C):
    c.page_fill()
    c.y = 30

    logo = [
        " ██╗      ██████╗ ████████╗   ███████╗██╗   ██╗███████╗",
        " ██║     ██╔═══██╗╚══██╔══╝   ██╔════╝╚██╗ ██╔╝██╔════╝",
        " ██║     ██║   ██║   ██║       ███████╗ ╚████╔╝ ███████╗",
        " ██║     ██║   ██║   ██║       ╚════██║  ╚██╔╝  ╚════██║",
        " ███████╗╚██████╔╝   ██║       ███████║   ██║   ███████║",
        " ╚══════╝ ╚═════╝    ╚═╝       ╚══════╝   ╚═╝   ╚══════╝",
    ]
    for ln in logo:
        c.text(ln, GREEN, True, 8)

    c.skip(6)
    c.hr("─", DG)
    c.text("  ACHIEVEMENT & BADGE CODEX", AMBER, True, 16, 0, 12)
    c.text("  The RPG of Self-Care  —  Official Reference  v2.0", CYAN, False, 10, 0, 8)
    c.hr("─", DG)
    c.skip(6)

    c.box([
        "  CLASSIFICATION : PUBLIC                                     ",
        "  AUTHOR         : Vadik Marmeladov  —  lot-systems.com      ",
        "  EDITION        : 2026 Expanded  (RPG / Arcade / Sci-Fi)    ",
        "  STATUS         : ACTIVE PRODUCTION                         ",
    ], CYAN)

    c.skip(8)
    lines = [
        "     Water:      ∘  →  ≈  →  ≋    (Droplet → Wave → Current)",
        "     Arch:    ├─  →  ╞═╡  →  ║·║  (Foundation → Architecture)",
        "     Terminal:  >_  →  >>$  →  >|<  (Boot → Process → Master)",
        "     Pixel:   [.] →  [o]  →  [#]  (Sprite → Bitmap render)",
        "",
        "     Easter Eggs:  PLAYER.ONE  KONAMI.CODE  NIGHT.OWL",
        "                   SPEEDRUN  EXTRA.LIFE  NEW.GAME+  FINAL.BOSS",
        "",
        "     RPG Classes:  [ RANGER ]  [ ARTIFICER ]  [ CLERIC ]",
        "                   [ ARCHMAGE ]  [ BARD ]  [ PALADIN ]",
        "                   [ ROGUE ]  [ ORACLE ]",
        "",
        "     Word Badges:  NEWCOMER → REGULAR → DEDICATED → VETERAN → LEGEND",
        "                   BYTE → KILOBYTE → MEGABYTE → GIGABYTE → TERABYTE",
        "                   CHAPTER I → III → VII → X → EPILOGUE",
    ]
    for ln in lines:
        c.text(ln, DG if ln == "" else DIM, False, 8)

    c.skip(8)
    c.hr("═", BORDER)
    c.text("  © 2025–2026 LOT Systems.  Self-care through proactive context-aware AI.", DIM, False, 8)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 — TOC + PHILOSOPHY
# ══════════════════════════════════════════════════════════════════════════════
def toc_page(c: C):
    c.new_page()

    c.header("TABLE OF CONTENTS", AMBER)
    toc = [
        ("01", "PHILOSOPHY OF BADGES"),
        ("02", "EXISTING PRODUCTION BADGES  (Water + Architecture)"),
        ("03", "EXPANDED BADGE SYSTEM  (Terminal / Pixel / Circuit / Mayan)"),
        ("04", "EASTER EGG BADGES  (Hidden & Secret Unlocks)"),
        ("05", "RPG CHARACTER CLASSES  (Archetype-Based Badges)"),
        ("06", "WORD ACHIEVEMENTS  (Named Milestones)"),
        ("07", "SCI-FI & ARCADE EASTER EGG MESSAGES"),
        ("08", "BADGE UNLOCK MECHANICS & Data Flow"),
    ]
    for num, entry in toc:
        c.font(True, 9)
        c.color(GREEN)
        c.c.drawString(c.lm, c._ry() - 5.5, num)
        c.font(False, 9)
        c.color(WHITE)
        c.c.drawString(c.lm + 18, c._ry() - 5.5, entry)
        c.y += 7

    c.header("PHILOSOPHY", CYAN)

    lines = [
        ("LOT treats self-care as an RPG.", WHITE),
        ("", WHITE),
        ("Every check-in is an action. Every streak is a quest.", WHITE),
        ("Every milestone is a boss fight you win by showing up.", WHITE),
        ("", WHITE),
        ("Badges are not rewards for perfection — they are records", WHITE),
        ("of cycles completed. Like Mayan K'in counts, like arcade", WHITE),
        ("high-scores, like chapters in a sci-fi novel: they mark", WHITE),
        ("where you have been, not judge where you are going.", WHITE),
        ("", WHITE),
        ("The badge system speaks three visual languages:", WHITE),
        ("", WHITE),
        ("  WATER       ∘ → ≈ → ≋       natural cycles, ocean depth", CYAN),
        ("  ARCH         ├─ → ╞═╡ → ║·║  structural building, growth", AMBER),
        ("  COMPUTER    >_ → >>$ → >|<  system boot, process, mastery", GREEN),
        ("", WHITE),
        ("All three say the same thing in different dialects:", WHITE),
        ("You are building something real.", WHITE),
        ("", WHITE),
        ("Easter eggs reward curiosity. Character classes honor", DIM),
        ("who you already are. Word badges speak plainly.", DIM),
        ("Sci-fi messages make the journey feel like literature.", DIM),
        ("", WHITE),
        ("  >_ self_care --mode=rpg --player=you", GREEN),
    ]
    for ln, col in lines:
        c.text("  " + ln if ln else "", col, False, 9)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 3 — EXISTING PRODUCTION BADGES
# ══════════════════════════════════════════════════════════════════════════════
def existing_page(c: C):
    c.new_page()

    c.header("EXISTING PRODUCTION BADGES", GREEN)

    c.text("  ≈  WATER THEME  —  Aquatic Evolution", CYAN, True, 10, 0, 8)
    c.skip(3)
    c.badge("∘",    "DROPLET",       "7-day streak",   "First drops form.",        CYAN)
    c.badge("≈",    "WAVE",          "30-day streak",  "Waves begin to flow.",     CYAN)
    c.badge("≋",    "CURRENT",       "100-day streak", "Deep currents established.", CYAN)
    c.text("  Mayan water cycle: droplet → wave → deep ocean current.", DIM, False, 8)
    c.skip(4)

    c.hr("─", BORDER)
    c.text("  ■  ARCHITECTURE THEME  —  Structural Growth", AMBER, True, 10, 0, 8)
    c.skip(3)
    c.badge("├─",   "FOUNDATION",    "7-day streak",   "Foundation laid.",         AMBER)
    c.badge("╞═╡",  "STRUCTURE",     "30-day streak",  "Structure rises.",         AMBER)
    c.badge("║·║",  "ARCHITECTURE",  "100-day streak", "Architecture complete.",   AMBER)
    c.text("  Box-drawing: foundation → full structural architecture.", DIM, False, 8)
    c.skip(4)

    c.hr("─", BORDER)
    c.skip(4)
    c.box([
        "  THEME SELECTION                                             ",
        "                                                              ",
        "  Users choose Water or Architecture via Settings.           ",
        "  Both themes unlock at identical streak milestones.         ",
        "  Badge theme stored in localStorage: 'badge_theme'          ",
        "  API: getBadgeTheme()  /  setBadgeTheme(theme)              ",
    ], DIM)

    c.skip(4)
    c.text("  BADGE PROGRESSION  (theme-aware display):", WHITE, True, 9)
    c.skip(2)
    c.text("  Water:       ∘  →  ≈  →  ≋", CYAN, False, 10)
    c.text("  Arch:     ├─  →  ╞═╡  →  ║·║", AMBER, False, 10)
    c.skip(4)
    c.text("  getLevelSymbol(streak)  → current level symbol", DG, False, 8)
    c.text("  getLevelName(streak)   → current level name", DG, False, 8)
    c.text("  getBadgeProgressionDisplay() → full ∘ → ≈ → ≋ string", DG, False, 8)
    c.skip(4)
    c.text("  Source: src/client/utils/badges.ts", DIM, False, 8)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 — EXPANDED BADGE SYSTEM
# ══════════════════════════════════════════════════════════════════════════════
def expanded_page(c: C):
    c.new_page()

    c.header("EXPANDED BADGE SYSTEM — RPG / ARCADE / SCI-FI", MAG)

    c.text("  >_  TERMINAL THEME  —  Computer Metaphor", GREEN, True, 10, 0, 7)
    c.skip(2)
    c.badge(">_",    "BOOT",     "7-day streak",   "Boot sequence initiated.",  GREEN)
    c.badge(">>$",   "PROCESS",  "30-day streak",  "Process loaded.",           GREEN)
    c.badge(">|<",   "MASTER",   "100-day streak", "System mastered.",          GREEN)

    c.hr("─", BORDER)
    c.text("  [·]  PIXEL THEME  —  8-Bit Arcade", CYAN, True, 10, 0, 7)
    c.skip(2)
    c.badge("[.]",   "SPRITE",   "7-day streak",   "Pixel planted.",            CYAN)
    c.badge("[o]",   "RENDER",   "30-day streak",  "Sprite loaded.",            CYAN)
    c.badge("[#]",   "BITMAP",   "100-day streak", "Full render.",              CYAN)

    c.hr("─", BORDER)
    c.text("  -o-  CIRCUIT THEME  —  Electronics / Sci-Fi", AMBER, True, 10, 0, 7)
    c.skip(2)
    c.badge("-o-",   "OPEN",     "7-day streak",   "Circuit open.",             AMBER)
    c.badge("-+-",   "SIGNAL",   "30-day streak",  "Signal stable.",            AMBER)
    c.badge("=o=",   "CURRENT",  "100-day streak", "Full current.",             AMBER)

    c.hr("─", BORDER)
    c.text("  ○∿  OCEANIC MAYAN THEME  —  Ancient Cycles", BLUE, True, 10, 0, 7)
    c.skip(2)
    c.badge("○∿",    "WAVE",     "7-day streak",   "Wave patterns emerge.",     BLUE)
    c.badge("○≈○",   "TIDE",     "30-day streak",  "Tides complete their cycle.", BLUE)
    c.badge("≋○≋",   "OCEAN",    "100-day streak", "Ocean depth achieved.",     BLUE)
    c.text("  Mayan K'in: 7 / 30 / 100 days. Circle (○) = Mayan zero.", DIM, False, 8)
    c.skip(4)

    c.hr("═", BORDER)
    c.text("  ALL MILESTONE SYMBOLS AT A GLANCE:", WHITE, True, 9)
    c.skip(2)
    rows = [
        ("Water:    ", "∘   →   ≈   →   ≋",   CYAN),
        ("Arch:     ", "├─  →   ╞═╡  →  ║·║", AMBER),
        ("Terminal: ", ">_  →   >>$  →  >|<",  GREEN),
        ("Pixel:    ", "[.] →   [o]  →  [#]",  CYAN),
        ("Circuit:  ", "-o- →   -+-  →  =o=",  AMBER),
        ("Mayan:    ", "○∿  →   ○≈○  →  ≋○≋",  BLUE),
    ]
    for label, sym, col in rows:
        c.font(False, 9)
        c.color(DIM)
        c.c.drawString(c.lm + 5, c._ry() - 5.5, label)
        c.color(col)
        c.c.drawString(c.lm + 55, c._ry() - 5.5, sym)
        c.y += 7


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 5 — EASTER EGG BADGES
# ══════════════════════════════════════════════════════════════════════════════
def easter_page(c: C):
    c.new_page()

    c.header("EASTER EGG BADGES  [ HIDDEN / SECRET ]", RED)

    c.text("  These badges do not appear in-app until discovered.", DIM, False, 8)
    c.text("  Trigger conditions are intentionally cryptic. Find them.", DIM, False, 8)
    c.skip(4)

    eggs = [
        ("PLAYER.ONE",    RED,
         "First log of your journey.",
         '"INSERT COIN. Your story begins."'),
        ("INSERT.COIN",   AMBER,
         "Subscribe to any LOT tier.",
         '"CONTINUE? Y/N"'),
        ("KONAMI.CODE",   GREEN,
         "Answer at the same time of day, 3 days in a row.",
         '"UP UP DOWN DOWN: Self-care unlocked."'),
        ("NIGHT.OWL",     CYAN,
         "Answer after 11:00 PM for 7 consecutive days.",
         '"DO ANDROIDS DREAM OF ELECTRIC SELF-CARE?"'),
        ("DAWN.BOOT",     AMBER,
         "Answer before 6:00 AM for 7 consecutive days.",
         '"System.sunrise = True. Clarity module online."'),
        ("EXTRA.LIFE",    GREEN,
         "Return after 7+ days absence.",
         '"CONTINUE? Y_  . . .  Session resumed."'),
        ("SPEEDRUN",      CYAN,
         "Answer within 5 min of opening, 10 days straight.",
         '"WR ATTEMPT: 00:04:59. glitchless."'),
        ("THE.ANSWER",    MAG,
         "Exactly 42-day streak.",
         '"42. The answer is always the process."'),
        ("NEW.GAME+",     AMBER,
         "365-day streak — one full year.",
         '"You finished the base game. New Game+ unlocked."'),
        ("FINAL.BOSS",    RED,
         "1,000 Memory questions answered.",
         '"The final boss was yourself. You won."'),
        ("TRUE.END",      MAG,
         "All other badges collected.",
         '"You found the true ending. The credits roll."'),
        ("GHOST.MODE",    DIM,
         "30 days with public profile set to private.",
         '"Entity detected. No trace found."'),
    ]

    for name, col, trigger, msg in eggs:
        if c.y > H - 80:
            c.new_page()

        c.font(True, 9)
        c.color(col)
        c.c.drawString(c.lm, c._ry() - 5.5, "[ " + name + " ]")
        c.y += 7

        c.font(False, 8)
        c.color(WHITE)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, "Trigger:  " + trigger)
        c.y += 5.5

        c.font(False, 8)
        c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, "Message:  " + msg)
        c.y += 7


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 6 — RPG CHARACTER CLASSES
# ══════════════════════════════════════════════════════════════════════════════
def classes_page(c: C):
    c.new_page()

    c.header("RPG CHARACTER CLASSES  [ ARCHETYPE → CLASS ]", MAG)

    c.text("  Each LOT archetype maps to a classic RPG class.", DIM, False, 8)
    c.text("  Class badge unlocks when the profile engine confirms archetype.", DIM, False, 8)
    c.skip(5)

    classes = [
        ("The Explorer",  "[ RANGER ]",    "Scouts the unknown. Maps inner terrain.",      GREEN,
         "Every exploration is a quest."),
        ("The Builder",   "[ ARTIFICER ]", "Crafts systems. Turns patterns into structure.", AMBER,
         "You build what others imagine."),
        ("The Healer",    "[ CLERIC ]",    "Restores. Repairs. Holds the group together.", CYAN,
         "Rest is a power, not a weakness."),
        ("The Sage",      "[ ARCHMAGE ]",  "Deep knowledge. Sees ancient patterns.",       MAG,
         "Wisdom accumulates like sediment."),
        ("The Creator",   "[ BARD ]",      "Expresses, generates, surprises.",             AMBER,
         "Creation is a form of healing."),
        ("The Guardian",  "[ PALADIN ]",   "Protects. Holds structure for others.",        BLUE,
         "Boundaries are sacred architecture."),
        ("The Catalyst",  "[ ROGUE ]",     "Disrupts. Transforms. Moves fast.",            RED,
         "The pattern breaker is the pattern."),
        ("The Visionary", "[ ORACLE ]",    "Sees ahead. Synthesizes the unseen.",          CYAN,
         "The future is already a memory."),
    ]

    for archetype, badge, desc, col, quote in classes:
        c.font(True, 9)
        c.color(col)
        c.c.drawString(c.lm, c._ry() - 5.5, archetype)
        c.font(True, 9)
        c.color(WHITE)
        c.c.drawString(c.lm + 80, c._ry() - 5.5, badge)
        c.y += 7

        c.font(False, 8)
        c.color(DIM)
        c.c.drawString(c.lm + 12, c._ry() - 4.5, desc)
        c.y += 5.5

        c.font(False, 8)
        c.color(DG)
        c.c.drawString(c.lm + 12, c._ry() - 4.5, '"' + quote + '"')
        c.y += 7

    c.skip(4)
    c.hr("─", BORDER)
    c.skip(4)

    c.box([
        "  CLASS PROGRESSION NOTE                                      ",
        "                                                              ",
        "  Archetypes are not fixed. The profile engine re-evaluates  ",
        "  after significant behavioral shifts. A user may transition  ",
        "  from [ ROGUE ] to [ ARCHMAGE ] as their patterns deepen.   ",
        "  The RPG class badge updates automatically.                  ",
        "                                                              ",
        "  'Character growth is literal here.'                        ",
    ], MAG)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 7 — WORD ACHIEVEMENTS
# ══════════════════════════════════════════════════════════════════════════════
def words_page(c: C):
    c.new_page()

    c.header("WORD ACHIEVEMENTS  [ NAMED MILESTONES ]", CYAN)

    # Journey tier
    c.text("  JOURNEY TIER  —  Engagement Level", GREEN, True, 10, 0, 7)
    c.skip(2)
    journey = [
        ("NEWCOMER",   "First Memory answer.",       "The journey of a thousand days begins now."),
        ("REGULAR",    "10 total answers.",           "You are building a habit."),
        ("DEDICATED",  "50 total answers.",           "Dedication is a superpower."),
        ("VETERAN",    "200 total answers.",          "You have seen the system evolve."),
        ("LEGEND",     "500 total answers.",          "Your Memory Story is a novel now."),
    ]
    for name, trigger, msg in journey:
        c.font(True, 9); c.color(WHITE)
        c.c.drawString(c.lm, c._ry() - 5.5, name)
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 65, c._ry() - 5.5, trigger)
        c.y += 6.5
        c.font(False, 8); c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, '"' + msg + '"')
        c.y += 6

    c.hr("─", BORDER)

    # Data tier
    c.text("  DATA TIER  —  Memory Depth", AMBER, True, 10, 0, 7)
    c.skip(2)
    data = [
        ("BYTE",       "5 questions answered.",        "First byte of self-knowledge stored."),
        ("KILOBYTE",   "20 questions answered.",       "A kilobyte of self-awareness."),
        ("MEGABYTE",   "100 questions answered.",      "Megabyte-class memory density."),
        ("GIGABYTE",   "500 questions answered.",      "Your story exceeds most libraries."),
        ("TERABYTE",   "1,000 questions answered.",    "TERABYTE CLASS. The system is you."),
    ]
    for name, trigger, msg in data:
        c.font(True, 9); c.color(WHITE)
        c.c.drawString(c.lm, c._ry() - 5.5, name)
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 65, c._ry() - 5.5, trigger)
        c.y += 6.5
        c.font(False, 8); c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, '"' + msg + '"')
        c.y += 6

    c.hr("─", BORDER)

    # Chapter tier
    c.text("  CHAPTER TIER  —  Story Progression", MAG, True, 10, 0, 7)
    c.skip(2)
    chapters = [
        ("CHAPTER I",   "Day 1.",      "The story begins."),
        ("CHAPTER III", "Day 30.",     "The first arc closes."),
        ("CHAPTER VII", "Day 100.",    "The middle of everything."),
        ("CHAPTER X",   "Day 365.",    "A year of chapters."),
        ("EPILOGUE",    "Day 500+.",   "Beyond the story. Into the myth."),
    ]
    for name, trigger, msg in chapters:
        c.font(True, 9); c.color(WHITE)
        c.c.drawString(c.lm, c._ry() - 5.5, name)
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 75, c._ry() - 5.5, trigger)
        c.y += 6.5
        c.font(False, 8); c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, '"' + msg + '"')
        c.y += 6

    c.skip(2)
    c.hr("─", BORDER)
    c.text("  SYS TIER  —  Computer System Metaphor", GREEN, True, 10, 0, 7)
    c.skip(2)
    sys_tier = [
        ("SYS.BOOT",      "First session.",            "Operating system: online."),
        ("SYS.RUN",       "7-day streak.",             "Processes running. Stay online."),
        ("SYS.COMPILE",   "30-day streak.",            "Compiled and optimized."),
        ("SYS.MASTER",    "100-day streak.",           "Master build. Zero errors."),
    ]
    for name, trigger, msg in sys_tier:
        c.font(True, 9); c.color(WHITE)
        c.c.drawString(c.lm, c._ry() - 5.5, name)
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 75, c._ry() - 5.5, trigger)
        c.y += 6.5
        c.font(False, 8); c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, '"' + msg + '"')
        c.y += 6


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 8 — SCI-FI MESSAGES
# ══════════════════════════════════════════════════════════════════════════════
def scifi_page(c: C):
    c.new_page()

    c.header("SCI-FI & ARCADE EASTER EGG MESSAGES", BLUE)

    c.text("  Hidden messages woven into the unlock flow.", DIM, False, 8)
    c.text("  Each one is a micro-story. A wink from the system.", DIM, False, 8)
    c.skip(5)

    refs = [
        ("DUNE  —  Frank Herbert",
         '"The spice must flow."',
         "100-day Water badge",     AMBER),
        ("NEUROMANCER  —  William Gibson",
         '"Ice broken. The matrix yields."',
         "Deep Reflection badge",   CYAN),
        ("1984  —  George Orwell",
         '"DOUBLETHINK.EXE: knowing and not-knowing, simultaneously."',
         "Reflective badge",        RED),
        ("HITCHHIKER'S GUIDE  —  Douglas Adams",
         '"42. The answer is always the process, not the destination."',
         "Exactly 42-day streak",   GREEN),
        ("SOLARIS  —  Stanislaw Lem",
         '"The ocean is thinking about you."',
         "30-day Water badge",      BLUE),
        ("FOUNDATION  —  Isaac Asimov",
         '"Psychohistory confirms: you are ahead of the curve."',
         "50 questions answered",   MAG),
        ("2001  —  Arthur C. Clarke",
         '"Any sufficiently advanced self-care is indistinguishable from magic."',
         "Final badge completion",  AMBER),
        ("DO ANDROIDS DREAM  —  Philip K. Dick",
         '"Do androids dream of electric self-care? Yes. They answer the questions."',
         "NIGHT.OWL badge",         CYAN),
        ("ENDER'S GAME  —  Orson Scott Card",
         '"The enemy\'s gate is down. The enemy was entropy."',
         "FINAL.BOSS badge",        GREEN),
    ]

    for title, quote, usage, col in refs:
        if c.y > H - 70:
            c.new_page()
        c.font(True, 9); c.color(col)
        c.c.drawString(c.lm, c._ry() - 5.5, title)
        c.y += 7
        c.font(False, 8); c.color(WHITE)
        # wrap long quote
        max_chars = 80
        if len(quote) > max_chars:
            c.c.drawString(c.lm + 10, c._ry() - 4.5, quote[:max_chars])
            c.y += 5.5
            c.c.drawString(c.lm + 10, c._ry() - 4.5, quote[max_chars:])
            c.y += 5.5
        else:
            c.c.drawString(c.lm + 10, c._ry() - 4.5, quote)
            c.y += 5.5
        c.font(False, 8); c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, "Shown: " + usage)
        c.y += 7

    c.skip(4)
    c.hr("─", BORDER)
    c.text("  ARCADE CALLBACKS  —  Classic Game References", GREEN, True, 10, 0, 7)
    c.skip(2)
    arcade = [
        ('"PRESS START"',           "First app open",          GREEN),
        ('"HIGH SCORE"',            "Top streak in 30 days",   AMBER),
        ('"LEVEL COMPLETE"',        "Each 10-question milestone", CYAN),
        ('"GAME OVER... BUT..."',   "Streak broken",           RED),
        ('"1-UP"',                  "Streak restored",         GREEN),
        ('"ALL YOUR BASE..."',      "100-question milestone",  MAG),
        ('"IT\'S DANGEROUS ALONE"', "First public profile share", AMBER),
        ('"YOU WIN!"',              "365-day streak",          GREEN),
    ]
    for msg, ctx, col in arcade:
        c.font(True, 9); c.color(col)
        c.c.drawString(c.lm, c._ry() - 5.5, msg)
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 120, c._ry() - 5.5, "→  " + ctx)
        c.y += 7


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 9 — BADGE MECHANICS
# ══════════════════════════════════════════════════════════════════════════════
def mechanics_page(c: C):
    c.new_page()

    c.header("BADGE UNLOCK MECHANICS & DATA FLOW", GREEN)

    c.text("  HOW BADGES ARE AWARDED", WHITE, True, 10, 0, 7)
    c.skip(2)
    flow = [
        "1.  User answers a Memory question  (primary trigger)",
        "2.  checkAndAwardBadges() is called post-answer",
        "3.  API: GET /api/user-stats  → returns { streak: N }",
        "4.  Milestone thresholds checked:  7 / 30 / 100 days",
        "5.  If threshold met + badge not yet earned:",
        "      awardBadge(badgeId) → saved to localStorage",
        "      queueBadgeUnlock(badgeId) → notification queue",
        "6.  Memory Widget reads queue on next render",
        "7.  Unlock toast displayed for 5 seconds, then fades",
        "8.  Badge visible in Public Profile as 'Level:' field",
    ]
    for ln in flow:
        col = DG if ln.startswith("      ") else (GREEN if "→" in ln else WHITE)
        c.text("  " + ln, col, False, 8)

    c.skip(4)
    c.hr("─", BORDER)

    c.text("  localStorage DATA MODEL", AMBER, True, 10, 0, 7)
    c.skip(2)
    storage = [
        ("badge_theme",         "'water' | 'architecture'",   "User visual theme"),
        ("earned_badges",       "comma-separated IDs",        "All earned badges"),
        ("badge_unlock_queue",  "comma-separated IDs",        "Pending notifications"),
    ]
    for key, val, desc in storage:
        c.font(True, 8); c.color(GREEN)
        c.c.drawString(c.lm, c._ry() - 4.5, key)
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 105, c._ry() - 4.5, val)
        c.y += 5.5
        c.font(False, 8); c.color(DG)
        c.c.drawString(c.lm + 10, c._ry() - 4.5, "↳ " + desc)
        c.y += 6

    c.skip(4)
    c.hr("─", BORDER)

    c.text("  API FUNCTIONS  (badges.ts)", CYAN, True, 10, 0, 7)
    c.skip(2)
    fns = [
        ("getEarnedBadges()",           "Returns array of earned badge IDs from storage"),
        ("awardBadge(badgeId)",         "Awards badge if not already earned; queues notification"),
        ("hasBadge(badgeId)",           "Checks if a specific badge has been earned"),
        ("getLevelSymbol(streak)",      "Returns current level symbol (theme-aware)"),
        ("getLevelName(streak)",        "Returns current level name  (theme-aware)"),
        ("getNextBadgeUnlock()",        "Pops next notification from queue"),
        ("getBadgeProgressionDisplay()", "Returns ∘ → ≈ → ≋  or  ├─ → ╞═╡ → ║·║"),
        ("checkAndAwardBadges()",       "Fetches user stats, awards all qualifying badges"),
    ]
    for fn, desc in fns:
        c.font(True, 8); c.color(GREEN)
        c.c.drawString(c.lm, c._ry() - 4.5, fn)
        c.y += 5.5
        c.font(False, 8); c.color(DIM)
        c.c.drawString(c.lm + 12, c._ry() - 4.5, "↳ " + desc)
        c.y += 6

    c.skip(4)
    c.hr("═", BORDER)
    c.skip(4)

    c.box([
        "  COMPLETE BADGE TAXONOMY                                     ",
        "                                                              ",
        "  MILESTONE (6 themes x 3 levels)       = 18 badge symbols   ",
        "  CHARACTER CLASSES (8 archetypes)      =  8 badge names     ",
        "  EASTER EGG badges                     = 12 hidden triggers  ",
        "  JOURNEY word badges                   =  5 named badges     ",
        "  DATA tier word badges                 =  5 named badges     ",
        "  CHAPTER tier word badges              =  5 named badges     ",
        "  SYS tier word badges                  =  4 named badges     ",
        "  ──────────────────────────────────────────────────────────  ",
        "  TOTAL                                 = 57 unique badges    ",
        "                                                              ",
        "  © 2025-2026 LOT Systems  —  lot-systems.com  —  v2.0       ",
    ], GREEN)


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════
def main():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    c = C(OUTPUT)

    cover(c)
    toc_page(c)
    existing_page(c)
    expanded_page(c)
    easter_page(c)
    classes_page(c)
    words_page(c)
    scifi_page(c)
    mechanics_page(c)

    c.finish()


if __name__ == "__main__":
    main()
