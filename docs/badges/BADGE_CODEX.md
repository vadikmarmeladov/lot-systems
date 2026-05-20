# LOT Systems — Badge & Achievement Codex

**Author:** Vadik Marmeladov, CEO & Founder, LOT Systems  
**Edition:** 2026 Expanded — RPG / Arcade / Sci-Fi  
**Status:** Active Production  

> "Every check-in is an action. Every streak is a quest.  
> Every milestone is a boss fight you win by showing up."

---

## Overview

LOT treats self-care as an RPG. Badges are not rewards for perfection — they are records of cycles completed. Like Mayan K'in counts, like arcade high-scores, like chapters in a sci-fi novel: they mark where you have been, not judge where you are going.

**57 unique badges across 4 categories:**
- 18 milestone symbols (6 themes × 3 levels)
- 8 character class badges (archetype-based)
- 12 hidden Easter egg badges
- 19 word achievement badges (journey / data / chapter / sys tiers)

---

## Part I — Milestone Badges

Milestone badges mark streak thresholds: **7 / 30 / 100 days**. Users choose their visual theme from 6 options. All themes unlock at identical thresholds.

### Theme Selection

Users select their growth metaphor in Settings. Stored in `localStorage` as `badge_theme`.

```
water        ∘  →  ≈  →  ≋       Aquatic Evolution
architecture ├─ →  ╞═╡ →  ║·║    Structural Growth
terminal     >_ →  >>$ →  >|<    Computer Metaphor
pixel        [.] → [o] →  [#]    8-Bit Arcade
circuit      -o- → -+- →  =o=    Electronics / Sci-Fi
mayan        ○∿  → ○≈○ →  ≋○≋   Oceanic Mayan Cycles
```

### Water Theme — Aquatic Evolution

| Symbol | Name | Streak | Unlock Message |
|--------|------|--------|----------------|
| `∘` | Droplet | 7 days | "First drops form." |
| `≈` | Wave | 30 days | "Waves begin to flow." |
| `≋` | Current | 100 days | "Deep currents established." |

### Architecture Theme — Structural Growth

| Symbol | Name | Streak | Unlock Message |
|--------|------|--------|----------------|
| `├─` | Foundation | 7 days | "Foundation laid." |
| `╞═╡` | Structure | 30 days | "Structure rises." |
| `║·║` | Architecture | 100 days | "Architecture complete." |

### Terminal Theme — Computer Metaphor

| Symbol | Name | Streak | Unlock Message |
|--------|------|--------|----------------|
| `>_` | Boot | 7 days | "Boot sequence initiated." |
| `>>$` | Process | 30 days | "Process loaded." |
| `>|<` | Master | 100 days | "System mastered." |

### Pixel Theme — 8-Bit Arcade

| Symbol | Name | Streak | Unlock Message |
|--------|------|--------|----------------|
| `[.]` | Sprite | 7 days | "Pixel planted." |
| `[o]` | Render | 30 days | "Sprite loaded." |
| `[#]` | Bitmap | 100 days | "Full render." |

### Circuit Theme — Electronics / Sci-Fi

| Symbol | Name | Streak | Unlock Message |
|--------|------|--------|----------------|
| `-o-` | Open | 7 days | "Circuit open." |
| `-+-` | Signal | 30 days | "Signal stable." |
| `=o=` | Current | 100 days | "Full current." |

### Oceanic Mayan Theme — Ancient Cycles

| Symbol | Name | Streak | Unlock Message |
|--------|------|--------|----------------|
| `○∿` | Wave | 7 days | "Wave patterns emerge." |
| `○≈○` | Tide | 30 days | "Tides complete their cycle." |
| `≋○≋` | Ocean | 100 days | "Ocean depth achieved." |

*Mayan K'in philosophy: 7 days = first mini-cycle, 30 = major cycle (~1.5 uinals), 100 = mastery.*

---

## Part II — Easter Egg Badges

These badges **do not appear in-app** until discovered. Trigger conditions are intentionally cryptic.

| Badge | Trigger | Unlock Message |
|-------|---------|----------------|
| `PLAYER.ONE` | First log of your journey | "INSERT COIN. Your story begins." |
| `INSERT.COIN` | Subscribe to any LOT tier | "CONTINUE? Y/N" |
| `KONAMI.CODE` | Answer at same time of day, 3 days running | "UP UP DOWN DOWN: Self-care unlocked." |
| `NIGHT.OWL` | Answer after 11:00 PM for 7 consecutive days | "DO ANDROIDS DREAM OF ELECTRIC SELF-CARE?" |
| `DAWN.BOOT` | Answer before 6:00 AM for 7 consecutive days | "System.sunrise = True. Clarity module online." |
| `EXTRA.LIFE` | Return after 7+ days absence | "CONTINUE? Y_  . . .  Session resumed." |
| `SPEEDRUN` | Answer within 5 min of opening, 10 days straight | "WR ATTEMPT: 00:04:59. glitchless." |
| `THE.ANSWER` | Exactly 42-day streak | "42. The answer is always the process." |
| `NEW.GAME+` | 365-day streak — one full year | "You finished the base game. New Game+ unlocked." |
| `FINAL.BOSS` | 1,000 Memory questions answered | "The final boss was yourself. You won." |
| `TRUE.END` | All other badges collected | "You found the true ending. The credits roll." |
| `GHOST.MODE` | 30 days with public profile set to private | "Entity detected. No trace found." |

---

## Part III — RPG Character Classes

| Archetype | Class | Description | Quote |
|-----------|-------|-------------|-------|
| The Explorer | `[ RANGER ]` | Scouts the unknown. Maps inner terrain. | "Every exploration is a quest." |
| The Builder | `[ ARTIFICER ]` | Crafts systems. Turns patterns into structure. | "You build what others imagine." |
| The Healer | `[ CLERIC ]` | Restores. Repairs. Holds the group. | "Rest is a power, not a weakness." |
| The Sage | `[ ARCHMAGE ]` | Deep knowledge. Sees ancient patterns. | "Wisdom accumulates like sediment." |
| The Creator | `[ BARD ]` | Expresses, generates, surprises. | "Creation is a form of healing." |
| The Guardian | `[ PALADIN ]` | Protects. Holds structure for others. | "Boundaries are sacred architecture." |
| The Catalyst | `[ ROGUE ]` | Disrupts. Transforms. Moves fast. | "The pattern breaker is the pattern." |
| The Visionary | `[ ORACLE ]` | Sees ahead. Synthesizes the unseen. | "The future is already a memory." |

---

## Part IV — Word Achievement Badges

### Journey Tier
| Badge | Trigger | Message |
|-------|---------|--------|
| `NEWCOMER` | First Memory answer | "The journey of a thousand days begins now." |
| `REGULAR` | 10 total answers | "You are building a habit." |
| `DEDICATED` | 50 total answers | "Dedication is a superpower." |
| `VETERAN` | 200 total answers | "You have seen the system evolve." |
| `LEGEND` | 500 total answers | "Your Memory Story is a novel now." |

### Data Tier
| Badge | Trigger | Message |
|-------|---------|--------|
| `BYTE` | 5 questions | "First byte of self-knowledge stored." |
| `KILOBYTE` | 20 questions | "A kilobyte of self-awareness." |
| `MEGABYTE` | 100 questions | "Megabyte-class memory density." |
| `GIGABYTE` | 500 questions | "Your story exceeds most libraries." |
| `TERABYTE` | 1,000 questions | "TERABYTE CLASS. The system is you." |

### Chapter Tier
| Badge | Trigger | Message |
|-------|---------|--------|
| `CHAPTER I` | Day 1 | "The story begins." |
| `CHAPTER III` | Day 30 | "The first arc closes." |
| `CHAPTER VII` | Day 100 | "The middle of everything." |
| `CHAPTER X` | Day 365 | "A year of chapters." |
| `EPILOGUE` | Day 500+ | "Beyond the story. Into the myth." |

### SYS Tier
| Badge | Trigger | Message |
|-------|---------|--------|
| `SYS.BOOT` | First session | "Operating system: online." |
| `SYS.RUN` | 7-day streak | "Processes running. Stay online." |
| `SYS.COMPILE` | 30-day streak | "Compiled and optimized." |
| `SYS.MASTER` | 100-day streak | "Master build. Zero errors." |

---

## Part V — Sci-Fi Easter Egg Messages

| Reference | Message | Context |
|-----------|---------|--------|
| *Dune* — Frank Herbert | "The spice must flow." | 100-day Water badge |
| *Solaris* — Stanislaw Lem | "The ocean is thinking about you." | 30-day Water badge |
| *Neuromancer* — William Gibson | "Ice broken. The matrix yields." | Deep Reflection badge |
| *1984* — George Orwell | "DOUBLETHINK.EXE: knowing and not-knowing." | Reflective badge |
| *Hitchhiker's Guide* — Douglas Adams | "42. The answer is always the process." | 42-day streak |
| *Foundation* — Isaac Asimov | "Psychohistory confirms: you are ahead of the curve." | 50 questions |
| *2001* — Arthur C. Clarke | "Any sufficiently advanced self-care is indistinguishable from magic." | All badges |
| *Do Androids Dream* — Philip K. Dick | "Do androids dream of electric self-care? Yes." | NIGHT.OWL badge |
| *Ender's Game* — Orson Scott Card | "The enemy's gate is down. The enemy was entropy." | FINAL.BOSS badge |

---

## Part VI — Arcade Callbacks

| Message | Context |
|---------|--------|
| `PRESS START` | First app open |
| `GAME OVER... BUT...` | Streak broken |
| `1-UP` | Streak restored |
| `ALL YOUR BASE ARE BELONG TO SELF-CARE` | 100-question milestone |
| `IT'S DANGEROUS TO GO ALONE` | First public profile share |
| `YOU WIN!` | 365-day streak |
| `LEVEL COMPLETE` | Each 10-question milestone |
| `HIGH SCORE` | Top streak in 30 days |

---

## Part VII — Technical Reference

### Badge Taxonomy Summary

```
Milestone (6 themes × 3 levels)     = 18 badge symbols
Character Classes (8 archetypes)    =  8 badge names
Easter Egg badges                   = 12 hidden triggers
Journey word badges                 =  5 named badges
Data tier word badges               =  5 named badges
Chapter tier word badges            =  5 named badges
SYS tier word badges                =  4 named badges
─────────────────────────────────────────────────────
TOTAL                               = 57 unique badges
```

### localStorage Keys

| Key | Values | Purpose |
|-----|--------|---------|
| `badge_theme` | water / architecture / terminal / pixel / circuit / mayan | User's visual theme |
| `earned_badges` | comma-separated IDs | All earned badges |
| `badge_unlock_queue` | comma-separated IDs | Pending notifications |

### Key API Functions (badges.ts)

```typescript
getBadgeTheme()              // Returns current theme
setBadgeTheme(theme)         // Saves theme
getEarnedBadges()            // Array of earned IDs
awardBadge(badgeId)          // Award + queue notification
hasBadge(badgeId)            // Check if earned
getLevelSymbol(streak)       // Theme-aware symbol
getLevelName(streak)         // Theme-aware name
getBadgeProgressionDisplay() // Full ∘ → ≈ → ≋ string
getNextBadgeUnlock()         // Pop next notification
checkAndAwardBadges()        // Full check: all categories
getEarnedAchievements()      // All non-milestone earned
```

---

*© 2025–2026 LOT Systems. All rights reserved.*  
*Source: `src/client/utils/badges.ts`*  
*PDF: `docs/LOT-BADGE-CODEX.pdf`*
