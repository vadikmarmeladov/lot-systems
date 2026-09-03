<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Usership 12-Month Evolution — Design Brainstorm

**Author:** Claude Session (design proposal, not yet implemented)
**Date:** 3 September 2026
**Status:** DRAFT — for S-2 review
**Scope:** UI/UX evolution arc for the Usership tier ($99/mo), Day 1 → Month 12
**Reference account:** `lot-systems.com/u/machiavelli` — treated as the "fully evolved,
12-month" Usership target state. *(Live fetch of this URL was blocked by the
session's egress proxy — this document infers the Month 12 shape from the
`boardProfile` schema already implemented in `PublicProfile.tsx` and
`src/shared/types/index.ts`, not from a screenshot. Recommend a human spot-check
against the live page before implementation.)*

---

## 0. Why this document exists

Vadik asked for a month-to-month brainstorm of how the Usership UI should evolve
from a barebones Day 1 surface into "LOT® AI" — with the evolution *felt*, not
just logged. He named three concrete levers:

1. **Volume of Log entries / journal thoughts** — the raw fuel of the Memory Engine.
2. **Morning check-ins and self-care button clicks** — the ritual cadence.
3. **AI-driven celebration** — affirmations + Story/Memory compression, delivered
   monthly, with a widget that visibly counts `"Months unlocked: N/12"`.

This document does not propose new infrastructure. It proposes a *sequencing* of
systems that **already exist in this codebase** — the Memory Engine, the Interface
Evolution System, the Self-Assembly Engine, the Badge Codex, and `MonthlyPulseWidget`
— into one coherent 12-month story, plus a small number of new surfaces to make
that story visible where it currently isn't.

---

## 1. What's already built (the scaffolding)

A repo scan turned up five systems that are *already* the raw material for this
arc. None of them currently talk to each other on a monthly cadence — that's the
gap this document closes.

| System | File | What it already does |
|---|---|---|
| **Monthly Pulse** | `src/client/components/MonthlyPulseWidget.tsx` | Gated on `UserTag.Usership` + `user.joinedAt`. Already has a `MONTH_MESSAGES` map for months 1–12 and already renders `"{capped} / 12 months"`. **This is the seed of "Months unlocked: 3/12" — it exists, it's just under-decorated and fires once per month as a dismissible toast, not a persistent state.** |
| **Memory Engine compression** | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Every answer compresses the profile; Memory Story is regenerated from up to 30 Q&A pairs and cached to `user.metadata.lastMemoryStory` with a version + answer count. Archetype-aware insight responses already activate at 10+ answers. |
| **Interface Evolution** | `docs/technical/INTERFACE_EVOLUTION.md`, `src/client/utils/interfaceEvolution.ts` | 7-dimension maturity model (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) driving CSS custom properties — opacity, grid density, glow, animation speed. Milestone notifications already fire at **narrative chapters: Awakening → Exploration → Integration → Mastery.** |
| **Self-Assembly Engine** | `docs/technical/WIDGETS.md` §System Progress Widget | 12 modules (Biofield Engine, Memory Architecture, Routine Compiler, Intention Core, Cleanness Protocol, Reflection Layer, Community Mesh, Ecosystem Bridge, Quantum Substrate, Nutrition Protocol, Goal Architecture, Archetype Classifier), each moving through Dormant → Awakening → Forming → Assembled → Integrated. **12 modules. 12 months. This mapping is sitting right there, unused.** |
| **Badge Codex** | `src/client/utils/badges.ts`, `docs/badges/` | 800+ badges across Mastery Tiers v1–v22. Water-theme milestones already exist: `∘` (7 days) → `≈` (30 days) → `≋` (100 days), plus compound states `∘≈`, `≈∘`, `≈≈`. No Usership-exclusive monthly sub-track exists yet. |
| **Board Profile (public)** | `PublicProfile.tsx` L288–325, `types/index.ts` L309+ | Renders `Board Member #N`, `Citizen since {date}`, `Board tenure N months`, biofield state, `{N} memories compiled`, `{N} journal entries`, `{N} active days`, `Memory Engine: →`, `Clearance level: → {level} ({N} entries)`. **This is almost certainly what Month 12 (the machiavelli reference) looks like** — it is the only block in the public profile that reports cumulative journal/memory volume as a badge of tenure. |

The narrative chapter names already documented in `INTERFACE_EVOLUTION.md`
(**Awakening → Exploration → Integration → Mastery**) give this arc its spine for
free. Four chapters, three months each, twelve months total:

```
Q1  Months  1– 3   AWAKENING     "the system is beginning to know you"
Q2  Months  4– 6   EXPLORATION   "patterns are starting to form"
Q3  Months  7– 9   INTEGRATION   "the self-care practice is a habit now"
Q4  Months 10–12   MASTERY       "the portrait is complete — and still evolving"
```

Those quoted phrases are not invented for this document — they're lifted directly
from the `MONTH_MESSAGES` map already in `MonthlyPulseWidget.tsx`. The chapter
structure was already implied by the copy; it just wasn't named or built out.

---

## 2. The core loop, once per month

Every month should close the same five-beat loop, so the *pattern* becomes
recognizable even as the *content* deepens:

```
 LOG + SELF-CARE ACTIVITY  →  MEMORY STORY RECOMPRESSED  →  MONTH BADGE UNLOCKS
        (the fuel)               (the AI does the work)         (the proof)
                                          │
                                          ▼
                          AFFIRMATION + PARAGRAPH INSIGHT
                             delivered by Memory widget
                                          │
                                          ▼
                        "Months unlocked: N/12" ticks forward
                          Self-Assembly module advances a phase
                           Interface visibly refines (opacity,
                              grid, glow, badge theme tier)
```

The user should never have to go looking for evidence of growth. It should
arrive as a small ceremony at each month boundary, then leave behind a
permanent, visible trace (badge, profile line, widget state) they can revisit
any day after.

---

## 3. Month-by-month table

Gating principle, consistent with `INTERFACE_EVOLUTION.md`'s "Subtlety First" and
"Meaningful Gates": **the calendar month gates *access* (nothing before is
possible — no elapsed time, no badge). Log volume and self-care consistency gate
*richness* — how dense the Memory Story insight is, whether the AI can go a
"depth level" deeper (per the Behavior → Motivation → Values → Soul ladder
already defined in the Memory Engine doc).** A Usership member who logs in but
never journals still gets Month N's badge on schedule — a thinner, more generic
one. A member who journals daily gets the same badge, richer.

Log/self-care numbers below are *cumulative target bands*, not hard walls — they
calibrate what "typical" density looks like at each stage, borrowed from the
existing pacing system (`calculateIntelligentPacing()`, 8–15 Memory prompts/day).

| Mo. | Chapter | UI complexity (Interface Evolution) | Self-Assembly module advancing | Usership badge | Memory delivery | Affirmation register |
|---|---|---|---|---|---|---|
| **1** | Awakening | Barebones. `evolution-base-opacity` at floor (0.85), no glow, minimal grid. Water theme: `∘` | Biofield Engine: Dormant → Awakening | `usership_moon_01` — **New Moon** `○` | First Memory Story generated at 3+ answers — literal, descriptive, no interpretation yet | *"The first month. The system is beginning to know you."* (existing copy) |
| **2** | Awakening | Grid opacity ticks up one notch; letter-spacing starts tightening | Memory Architecture: Dormant → Awakening | `usership_moon_02` — **Waxing Crescent** `◔` | Story starts referencing specific prior answers ("Since you mentioned...") | *"Two months in. Patterns are starting to form."* |
| **3** | Awakening → Exploration | First badge-theme choice unlocks (Water vs. Architecture) — Depth: Deep Diver feature gate reachable | Routine Compiler: Awakening → Forming | `usership_moon_03` — **First Quarter** `◑` — chapter-close badge, slightly larger unlock toast | Archetype classification activates for the first time (10+ answers threshold from Memory Engine doc) — Memory widget names the archetype for the first time | *"Three months. You have reached Active User status."* (existing copy) — first affirmation to name the user's archetype explicitly |
| **4** | Exploration | Planner Templates unlock (Consistency: Week Warrior+); animation speed increases slightly | Intention Core: Dormant → Awakening | `usership_moon_04` — **Waxing Gibbous** `◕` | Paragraph insight starts citing a *pattern*, not just an answer ("You return to tea in the evening more than any other ritual") | *"Four months. The portrait deepens."* |
| **5** | Exploration | Subtle glow (`evolution-glow-intensity`) appears for the first time at high-achievement moments | Cleanness Protocol: Dormant → Forming | `usership_moon_05` — **Full Moon (I)** `●` | Seasonal callback fires — Memory Engine already asks "has your tea preference changed with the season?" style follow-ups; this is the month that pattern becomes visible in the story itself | *"Five months. Consistency is its own reward."* |
| **6** | Exploration → Integration | Rich Community unlock (Connection: Bridge Builder); chapter-close visual refinement pass across all widgets | Reflection Layer: Awakening → Forming | `usership_moon_06` — **Waning Gibbous** `◕` (inverted) — halfway badge, gets its own toast styling distinct from monthly ones | First **full narrative chapter transition** milestone fires (Awakening → Exploration, per Interface Evolution's own milestone system) — Memory widget frames it as a chapter turn, not just a month | *"Six months. The journey is half-declared."* |
| **7** | Integration | Mood Patterns unlock (Care 50% / Level 20); theme aesthetic (Water fluidity or Architecture precision) visibly more pronounced | Community Mesh: Dormant → Awakening | `usership_moon_07` — **Last Quarter** `◐` | Insight starts synthesizing across *modules* (mood + journal + planner together), not one signal at a time | *"Seven months in. The system has been listening."* |
| **8** | Integration | Intention History unlocks (Level 15); `evolution-transition-speed` shortens — the UI itself feels more responsive | Ecosystem Bridge: Dormant → Awakening | `usership_moon_08` — **Waning Crescent** `◔` | Story references a *goal journey stage* transition (beginning → struggle → breakthrough, per Goal Journey Widget) for the first time | *"Eight months. Rare air."* |
| **9** | Integration → Mastery | Custom Themes fully unlocked (Level 5 gate long since passed; user now has real aesthetic agency); chapter-close pass | Quantum Substrate: Forming → Assembled | `usership_moon_09` — **New Moon (II)** `○` — cycle-restart symbol, deliberately mirrors Month 1's badge to signal "you've completed one full turn, a deeper one begins" | Second full chapter transition milestone (Exploration → Integration) fires | *"Nine months. The self-care practice is a habit now."* |
| **10** | Mastery | Widget Arrange unlocks (Level 10); Narrative Reflection reachable (Depth 66% + Level 30) | Nutrition Protocol: Dormant → Forming | `usership_moon_10` — **Waxing Crescent (II)** `◔` | Memory Story begins operating at the "Soul" depth level (Level 4 of the Behavior→Motivation→Values→Soul ladder) for returning topics | *"Ten months. Almost there."* |
| **11** | Mastery | Export Data unlocks (Level 25); Social Mentions reachable (Connection 100%) | Goal Architecture: Forming → Assembled | `usership_moon_11` — **Full Moon (II)** `●` | Pre-anniversary preview — Memory widget surfaces a *retrospective* fragment ("a year ago you told the system...") for the first time | *"Eleven months. One more."* |
| **12** | Mastery — complete | Full theme tier reached (highest Water `≋`/Architecture `║·║` state); all CSS evolution variables at ceiling; public profile now renders the `boardProfile` block (Board Member #, Citizen since, tenure, biofield state, memories compiled, journal entries, active days, Memory Engine line, clearance level) — **this is the machiavelli state** | Archetype Classifier: Assembled → Integrated (12th and final module completes the map) | `usership_moon_12` — **Full Cycle** `◐●◑○` (all four phases in one glyph) — the year-badge, distinct visual weight, permanent on public profile | Full-year Memory Story regenerated as a single flowing narrative across all 12 months (not just the last 30 answers) — this is the one moment the compression window should widen beyond the normal 30-Q&A cap | *"One year with LOT. The portrait is complete — and still evolving."* (existing copy) |

Symbol choice note: the lunar-phase glyphs (`○ ◔ ◑ ◕ ●`) are not arbitrary — they
reuse the "Zen Progression" option already sketched in
`docs/badges/BADGE_LEVEL_DESIGN.md` (`○` beginning → `◐` emerging → `●`
complete), extended from 3 states to 12 because a year is, literally, 12 moons.
It also sidesteps clashing with the existing `∘ ≈ ≋` water-tier system, which
should keep governing *streak*-based badges (7/21/30/50/60/100 days)
independently of the *tenure*-based Usership moons proposed here — a user can
be a 3-moon Usership member with a `≋` 100-day streak, or a 12-moon veteran who
just came back from a gap. The two systems measure different things and should
stay visibly separate on the profile.

---

## 4. New/evolved surfaces

### 4.1 Evolve `MonthlyPulseWidget` into the "Months Unlocked" widget

It already has 90% of the logic. Three changes turn it from a one-time
dismissible toast into a persistent, revisitable state:

- **Persist past the dismiss.** Currently `markDismissed()` hides it until next
  month; there's no way to look back. Add a collapsed persistent chip —
  `"Months unlocked: 3/12"` — that stays in the widget stack (Header or
  Subscriber Stack per `WIDGETS.md`'s Dashboard Orchestration list) year-round,
  expanding to the full monthly message + moon glyph on click, exactly as the
  toast does today on the month it fires.
- **Render the moon glyph**, not just the fraction — `◑ 3/12` reads as
  progress at a glance before the user reads a single word.
- **Cross-link to the badge.** Clicking through should land on the matching
  `usership_moon_0N` badge in the profile, closing the loop between the
  ephemeral celebration and the permanent trophy.

### 4.2 Memory Widget: "Last Month" insight mode

The Memory Engine already caches `user.metadata.lastMemoryStory` with a version
and answer count (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8). Add a mode,
gated the same way `MonthlyPulseWidget` is (Usership + `joinedAt`), that surfaces
one cached paragraph — the compression snapshot taken at the *previous* month
boundary — distinct from the live, ever-changing "current" story. This gives the
user something the current story can't: a fixed point to look back from. Concrete
implementation: snapshot `lastMemoryStory` to `user.metadata.monthlySnapshots[N]`
at each month-boundary job (the existing Monthly Email Sender job, 09:00 UTC on
the 1st, is the natural place to trigger this — it already runs monthly for
Usership-adjacent purposes).

### 4.3 Public profile: Usership Codex row

A new row in `PublicProfile.tsx`, visible only when `boardProfile` (or a new,
lighter `usershipProfile`) is present — a compact strip of the 12 moon glyphs,
filled for months completed, hollow for months ahead:

```
Usership Codex:   ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○   (3/12)
```

This is the single most tangible "evolution you can point at" surface — it's
what a visitor to `/u/<username>` sees immediately, the same way `boardProfile`
already shows `Board tenure N months` today.

---

## 5. Why log volume and self-care clicks specifically

Vadik singled these two out, and the codebase backs the instinct: they're the
only two signal types in the Memory Engine's eight context sources
(`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §4) that are **entirely
user-authored** rather than inferred or environmental. Weather, quantum state,
widget patterns — all observed. Journal entries and self-care completions are
the two places the user is *telling* the system something in their own words or
their own explicit choice. They deserve to be the two metrics the monthly
affirmation cites back verbatim:

> *"This month you wrote 34 journal entries and completed self-care 21 times.
> The system noticed you return to evening reflection more than any other hour."*

That sentence pattern — count what they gave, then reflect one pattern back —
is the whole product philosophy from the README's "From data accumulation →
TO memory densification" restated as a single monthly sentence.

---

## 6. Implementation touchpoints (for a future build session)

Not implemented in this session — this is a design pass only. If greenlit,
the natural entry points are:

- `src/client/components/MonthlyPulseWidget.tsx` — persistent chip + glyph (§4.1)
- `src/client/utils/badges.ts` — add `usership_moon_01`..`usership_moon_12` to
  `BadgeType` union + `BADGES` record, water/lunar hybrid glyphs per §3
- `src/client/utils/narrative.ts` — surface the Awakening/Exploration/
  Integration/Mastery chapter name inside monthly copy, not just as an internal
  milestone concept
- `src/client/stores/selfAssembly.ts` — optional: bias which of the 12 modules
  advances based on tenure month, per the mapping in §3
- `src/server` — monthly snapshot job for `user.metadata.monthlySnapshots[N]`
  (§4.2), piggybacking on the existing Monthly Email Sender cron
- `src/client/components/PublicProfile.tsx` L288+ — Usership Codex row (§4.3)
- `src/shared/types/index.ts` — extend `boardProfile` (or add sibling
  `usershipProfile`) with `moonsCompleted: number` and `moonBadges: string[]`

---

## 7. Design principles carried over from `INTERFACE_EVOLUTION.md`

This proposal deliberately inherits the existing six principles rather than
inventing new ones:

1. **Subtlety First** — no month should feel like a jump-scare redesign.
2. **Progressive Enhancement** — Month 1 stays genuinely barebones; nothing here
   front-loads complexity.
3. **User Agency** — badge theme (Water/Architecture) stays user-chosen; the
   moon track doesn't override it, it runs alongside.
4. **Meaningful Gates** — access gates on tenure (can't be gamed), richness
   gates on authored activity (can be earned).
5. **Aesthetic Coherence** — lunar glyphs were chosen to slot into a system that
   already speaks in `∘ ≈ ≋` and `○ ◐ ●`, not a new visual language.
6. **Performance** — everything proposed is CSS-variable and badge-table driven,
   consistent with the existing evolution engine's all-CSS transition approach.

---

*This document is a brainstorm for review, not a build log. No application code
was changed in this session.*
