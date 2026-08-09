<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION
## From Barebone Day 1 to LOT® AI: A UI/UX Design Brainstorm

**Author:** Claude session, on behalf of S-2 (Vadik Marmeladov)
**Date:** 9 August 2026
**Status:** DESIGN BRAINSTORM — not yet implemented
**Scope:** Usership tier ($99/month) — the paid tier that runs the full LOT® AI OS
**North star account:** `lot-systems.com/u/machiavelli` (referenced conceptually — see §0 note)

---

## §0. How this document was built

Per the session framework: the repository was scanned first, then the relevant `.md`
doctrine was read before writing a single word of design. This document is
synthesized from what already exists in code and doctrine, not invented from
scratch — the goal is a evolution ladder LOT can actually build, month by
month, using primitives that are already half-built.

**Sources read in full before drafting:**
- `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` — the Compression Loop, the Weekly
  Story-Report, the Usership tier definition ($99/mo)
- `docs/technical/INTERFACE_EVOLUTION.md` — the 7-dimension evolution system,
  badge theme aesthetics (Water vs. Architecture), CSS evolution properties
- `docs/technical/WIDGETS.md` — full widget catalog, visibility/gating logic,
  the Subscriber Stack
- `docs/technical/LOT-STYLE-GUIDE.md` — voice, tone, interaction, and spacing
  conventions
- `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` — the compression
  cycle, Story generation, archetype system
- `docs/badges/BADGE_LEVEL_DESIGN.md` + `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`
  — the milestone badge ladder and 812-badge codex
- `src/client/components/MonthlyPulseWidget.tsx` — **already implements** a
  month-by-month message ladder (1–12) for Usership users
- `src/client/utils/interfaceEvolution.ts` — layout density (breathable →
  instrument), chapter arc (1–4), badge tier (0–3)
- `src/client/utils/badges.ts` — the real day-count milestone ladder (7 / 14 /
  21 / 30 / 50 / 60 / 90 / 100 / 180 / 365)
- `src/shared/types/index.ts` — the `boardProfile` type, which is *already the
  data shape of a fully evolved Usership account* (tenure months, memories
  compiled, journal entries, active days, clearance level)

**Note on the demo account.** This session's outbound network access is
sandboxed and `lot-systems.com` could not be reached directly to screenshot
`/u/machiavelli`. Rather than guess at pixels, this brainstorm treats the
codebase's own definition of "fully evolved" as the source of truth — the
`boardProfile` type, the `instrument`-density layout, the chapter-4 "Mastery"
narrative state, and the 812-badge codex are what a twelve-month Usership
account *is*, by construction. `machiavelli` is the person; these primitives
are the machine that made them look that way. A follow-up session with live
access should screenshot the account and diff it against this plan.

**What already exists vs. what this proposes.** `MonthlyPulseWidget.tsx`
already ships a `MONTH_MESSAGES` ladder (1–12) with a "12 / 12 months" progress
line — this document does not invent that mechanic, it treats it as the spine
and builds the missing limbs around it: the Memory paragraph, the header
counter, the badge-milestone alignment, and the Month 12 capstone.

---

## §1. The premise

LOT already has three independent evolution systems running in parallel:

1. **Interface Evolution** (`interfaceEvolution.ts`) — 7 psychological
   dimensions → layout density, opacity, feature unlocks
2. **Badge System** (`badges.ts`) — 812 badges, with a clean day-count spine
   (7 → 14 → 21 → 30 → 50 → 60 → 90 → 100 → 180 → 365)
3. **Memory Engine** (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) — the
   compression loop that turns logged behavior into sharper questions and,
   weekly, into a Story

None of these three currently speak the language of **calendar months**. The
`MonthlyPulseWidget` is the one component that does — and it is Usership-gated
already. This document's central move: **make the month the unit of
narrative**, and let density (interface evolution), badges (day-count), and
story (memory compression) all report *up* into that monthly frame instead of
running as three disconnected clocks.

A Usership member should be able to look at one place and know, at a glance:
*which month am I in, what did the machine learn about me this month, and what
changed in the room because of it.*

---

## §2. The three tangibility threads

The user's brief calls out three concrete behaviors to make visible over
twelve months. Each maps to an existing signal source:

| Thread | Existing signal | File |
|---|---|---|
| **Journal / Log volume** | `note` log events, Signal Archive | `src/server/routes/api.ts`, WIDGETS.md §"Signal Archive" |
| **Morning check-ins & self-care clicks** | `emotional_checkin`, `self_care_complete` events | `EmotionalCheckIn`, `SelfCareMoments` widgets |
| **Compressed Memory Story** | Weekly Story-Report, `user.metadata.lastMemoryStory` | `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8 |

The 12-month plan below treats these three threads as the *substance* the
interface reacts to — the UI never fakes progress. Every visual change in this
document is a rendering of a real, already-logged number.

---

## §3. Three new/extended surfaces

Before the month-by-month table, here are the concrete UI pieces this plan
depends on. Two are extensions of code that already exists; one is new.

### 3.1 Extend `MonthlyPulseWidget` → add a Memory Insight view

`MonthlyPulseWidget.tsx` already cycles a message per month and shows
`{capped} / 12 months`. Give it a second, clickable view — following the
established **clickable-label-cycling** pattern from `LOT-STYLE-GUIDE.md`
(`Widget:` → cycles to next view):

```
Month 4:                         [label click →]     Memory:
Four months. The portrait          The system notes that your
deepens.                           mornings have gotten quieter —
                                    fewer words, more precision.
4 / 12 months                      You answer faster now. The
                                    questions have started asking
                                    about what you're building,
                                    not what you're avoiding.
```

The Memory view is a single paragraph — sourced the same way the existing
Weekly Story-Report is (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8), but
scoped to *this calendar month's* answers instead of the last 30-question
window, and cached to `user.metadata.lastMemoryStory` the same way the weekly
story already is (§8: "cached stories are returned immediately when answer
count is unchanged"). No new AI infrastructure required — same Together AI
call, narrower `WHERE createdAt` filter, a monthly cache key instead of a
weekly one.

**Why this widget and not a new one:** it is already Usership-gated, already
fires exactly once per calendar month per user (`shouldShowPulse`), and
already has the fade-in/dismiss choreography the style guide requires. Adding
a second cycled view costs a `view` state variable, not a new component.

### 3.2 Header: "Month X/12" tag — mirrors the existing week-number tag

`WIDGETS.md`'s Architecture Overview already lists the Header stack as:

> Header — User identity, week number, date, location

A user's week number is already computed and displayed at all times. For
Usership members only, add a parallel tag using the exact same `boardProfile`
field that already exists in `src/shared/types/index.ts`:

```
machiavelli · Week 214 · Month 12/12 · Los Angeles, CA
```

`boardTenureMonths` is already on the `boardProfile` type — this is a
one-line JSX addition next to the week number, gated on `hasUsership`, capped
display at `12` (see §6 on what happens after month 12). This is the
lowest-cost, highest-visibility piece of this whole plan: it turns the
month-counter from "something you discover when a toast appears" into
"something you see in the header every session," the same ambient way you
already see your week number.

### 3.3 New: The Memory Compression Vault (Month 12 capstone)

This is the one genuinely new surface. At month 12, instead of a monthly
paragraph, the system compiles **all twelve** monthly paragraphs into a single
scrollable "Year One" story — reusing the Story API already specified in the
Product Brief:

```
GET  /api/story/latest
GET  /api/story/:week_id
POST /api/story/:week_id/export  { target: "robot" | "vehicle" | "dashboard" }
```

Extend this with a `year` scope:

```
GET  /api/story/year/1
POST /api/story/year/1/export  { target: "robot" | "vehicle" | "dashboard" }
```

The Vault widget itself is a `Block` (per the style guide's component
template) with a label that cycles `Year One:` → `Chapters:` (12 collapsed
month paragraphs) → `Export:` (the existing export targets, now meaningfully
useful — a year of context is what a robot or vehicle actually wants on first
boot, per the 2036 vision in the Product Brief). It is the terminal artifact of
the whole ladder — the thing a Usership member has actually been building
toward without being told that's what they were doing.

---

## §4. The month-by-month ladder

Four acts of three months each, mirroring the existing **chapter arc**
(`interfaceEvolution.ts`: `chapter 1–4`, driven by `level`) and **layout
density** (`breathable → comfortable → compact → dense → instrument`, driven
by `visualRefinement`). Badge milestones are the real day-count badges from
`badges.ts` — nothing invented. `MONTH_MESSAGES` text is quoted verbatim from
the shipped `MonthlyPulseWidget.tsx`.

### ACT I — AWAKENING (Months 1–3)
*Chapter 1 · Layout: breathable → comfortable · Badge tier 0 → 1*

| Month | Pulse message (shipped) | Day-badge crossed | Layout density | What's new in the room |
|---|---|---|---|---|
| **1** | *"The first month. The system is beginning to know you."* | `milestone_7` (∘ Droplet), `milestone_14`, `milestone_21` | breathable | Barebone dashboard. Memory widget asks open, welcoming questions (Mode 1). No badge chrome yet — `badgeTier: 0` shows nothing, by design (§ interfaceEvolution: "0=none"). Self-care and morning check-in appear on their plain time-gated schedule, no personalization yet. |
| **2** | *"Two months in. Patterns are starting to form."* | `milestone_30` (≈ Wave / Structure) — first real badge | comfortable | `badgeTier: 1`. First badge chrome appears — Level field goes from nothing to `≈`. Semantic widget stacks begin forming (`gap-y-24` → tighter stacks). Memory Engine crosses 3+ answers: psychological profile + archetype activate (`MEMORY-ENGINE...md` §4 Source 7). |
| **3** | *"Three months. You have reached Active User status."* | `milestone_50`, `milestone_60` (≈≈ Dual Wave / Master Frame) | comfortable | `customThemes` unlocks at level 5 (`FeatureUnlocks.customThemes`). First Monthly Pulse **Memory view** has enough data to be non-generic — month 3 is the earliest point the compressed paragraph will read as *specific* rather than templated, matching the Memory Engine's own "10+ answers → archetype-based response" threshold. |

### ACT II — EXPLORATION (Months 4–6)
*Chapter 2 (level 10–30) · Layout: comfortable → compact · Badge tier 1 → 2*

| Month | Pulse message | Day-badge crossed | Layout density | What's new in the room |
|---|---|---|---|---|
| **4** | *"Four months. The portrait deepens."* | `milestone_90` (≋∘ Deep Reach / Inner Wall) — three-month immersion | comfortable → compact | `advancedMemory` unlocks (`depth >= 0.33`, "Deep Diver"). Memory Engine's four depth levels (behavior → motivation → values → soul, §5 Mode 3) start reaching level 2–3 for consistent users. `intentionHistory` unlocks at level 15. |
| **5** | *"Five months. Consistency is its own reward."* | streak-driven badges (`extra_life`, consistency-category) | compact | `plannerTemplates` unlocks (`consistency >= 0.33`, "Week Warrior+"). This is the month the **self-care ritual goes quiet** — per the Memory Engine doctrine, the AI "never initiates conversation... the questions get fewer and hit harder." Fewer prompts, sharper ones. |
| **6** | *"Six months. The journey is half-declared."* | `milestone_100` (≋ Current / Architecture), `milestone_180` (≋≋ Voyager / Wing) both land in this window | compact → dense | `badgeTier: 2`. Chapter may cross into Chapter 2/3 boundary depending on level. This is the **halfway maturity milestone** in `getEvolutionMilestone()`: *"Half the journey. The system knows you."* The Memory Compression Vault's month-6 chapter is the natural midpoint checkpoint — surface a small "halfway" affirmation here, distinct from the monthly one, reusing that exact string. |

### ACT III — INTEGRATION (Months 7–9)
*Chapter 3 (level 30–60) · Layout: dense · Badge tier 2 → 3*

| Month | Pulse message | Day-badge crossed | Layout density | What's new in the room |
|---|---|---|---|---|
| **7** | *"Seven months in. The system has been listening."* | Behavioral + Achievement RPG badges compound | dense | `patternInsights` unlocks (`consistency >= 0.66`, "Moon Cycle+"). `narrativeReflection` unlocks if `depth >= 0.66 && level >= 30` — the AI-narrative synthesis layer turns on. Information-dense cockpit layout; whitespace has mostly collapsed (`gap-y-8`). |
| **8** | *"Eight months. Rare air."* | Mastery Tier badges begin appearing | dense | `badgeTier: 3` ("ultimate") likely reached. The Memory paragraph this month should lean into scarcity language — "Rare air" is already the shipped copy; the Memory view should echo it by surfacing a stat like *"most sessions logged, most consecutive weeks"* pulled straight from `boardProfile.activity`. |
| **9** | *"Nine months. The self-care practice is a habit now."* | Consistency-category compounding | dense → instrument | `moodPatterns` unlocks (`care >= 0.5 \|\| level >= 20`). This is the thematically correct month to retire the *suggestion* framing of self-care entirely and switch the widget's default view to `Patterns:` (mood-pattern view) instead of `Prompt:` — the ritual has become observation, not instruction, matching the copy exactly. |

### ACT IV — MASTERY (Months 10–12)
*Chapter 4 (level 60+) · Layout: instrument · Badge tier 3, full · Milestone 365*

| Month | Pulse message | Day-badge crossed | Layout density | What's new in the room |
|---|---|---|---|---|
| **10** | *"Ten months. Almost there."* | Secret Boss / hidden badges become statistically likely | instrument | `exportData` unlocks (level 25) — the Story API export targets (`robot \| vehicle \| dashboard`) become live, not theoretical, ahead of the Month 12 Vault. |
| **11** | *"Eleven months. One more."* | Approaching `milestone_365` | instrument | `socialMentions` and `privateSpaces` likely both unlocked (full connection path / high intimacy-courage). Interface is at maximum density — "every pixel justified" (`interfaceEvolution.ts` comment on the `instrument` tier). |
| **12** | *"One year with LOT. The portrait is complete — and still evolving."* | `milestone_365` (≋≋≋ The Long Count / Citadel) — *"A year of presence. The architecture stands."* | instrument | **The Memory Compression Vault opens** (§3.3). The Monthly Pulse's own copy already says "and still evolving" — the Vault is the literal proof: twelve compressed paragraphs, one Story, exportable to hardware that doesn't exist yet but will read this the day it does. |

---

## §5. Badges as the month's visual currency

The badge Level field (per `BADGE_LEVEL_DESIGN.md`, "Aquatic Evolution" —
already the team's own top recommendation) already has a clean symbol ladder:
`∘` (7d) → `≈` (30d) → `≋` (100d). That ladder tops out at 100 days — a third
of the year. This plan's only addition is **not a new symbol set**, it's
wiring the existing 180-day and 365-day milestone badges (`milestone_180`,
`milestone_365` — both already fully defined in `badges.ts` with Water and
Architecture variants) into the *same* `Level:` field so the symbol keeps
evolving past day 100 instead of going stale for the back half of the year:

```
Level:  ∘        Month 1   (Day 7+)
Level:  ≈        Month 2   (Day 30+)
Level:  ≈≈       Month 3   (Day 60+)
Level:  ≋∘       Month 4   (Day 90+)
Level:  ≋        Month 4-6 (Day 100+)
Level:  ≋≋       Month 6   (Day 180+)
Level:  ≋≋≋      Month 12  (Day 365+) — "The Long Count"
```

This costs nothing new in `badges.ts` — the badges are already written,
described, and themed (Water/Architecture per user preference). The only gap
is that `PublicProfile.tsx`'s `Level:` field (per the implementation notes in
`BADGE_LEVEL_DESIGN.md`) should read the *highest earned milestone badge*
rather than stopping its display logic at `milestone_100`.

---

## §6. What happens after month 12

The shipped `MonthlyPulseWidget` code already caps display at 12
(`Math.min(monthNumber, 12)`) — month 13 onward silently keeps showing the
month-12 message forever if untouched. This plan proposes that's correct
*for the Pulse widget* (it is a threshold ladder, not a running odometer) but
wrong for the Vault: month 13 begins "Year Two," a fresh compression cycle
using the same mechanism, with the Year One Vault becoming a permanently
accessible artifact (`Chapters:` view, always available) rather than a thing
that only exists once. This mirrors the Product Brief's own 2036 vision
language directly: *"the Story-Report has been running for 10+ years for
founding operators."* Year One is the first proof of that claim, not the end
of it.

---

## §7. Voice and tone guardrails

Every string proposed above should pass the existing `LOT-STYLE-GUIDE.md`
checklist before implementation:

- No emojis, no exclamation points, no superlatives ("amazing," "incredible")
- Periods, not checkmarks: *"Complete."* not *"Complete! ✓"*
- Objective register even at the Month 12 capstone — *"The portrait is
  complete — and still evolving"* is already correctly unshowy; the Vault copy
  should match that restraint, not escalate into celebration-speak
- Duration format `(X mins)` where relevant; action-verb buttons only
  (`View`, `Export`, `Dismiss` — not `Celebrate!` or `Unlock Now!`)
- Cross-device state via database logs, never `localStorage`, for anything
  that must be consistent across the PWA and Desktop clients — the existing
  `MonthlyPulseWidget` dismiss-tracking is the one place in this plan still on
  `localStorage` and would be worth migrating to a log event
  (`monthly_pulse_dismissed`) for the same reason the style guide already
  flags cooldowns as a `localStorage` anti-pattern

---

## §8. Implementation pointers (for the build session, not this one)

This document is a design brainstorm — no code was changed in this session,
per the task's own framing as an outline/brainstorm exercise. A follow-up
build session should start here:

| Piece | File | Change |
|---|---|---|
| Memory Insight view | `src/client/components/MonthlyPulseWidget.tsx` | Add `view` state (`'pulse' \| 'memory'`), `onLabelClick` cycling per style guide §"Clickable Label Cycling" |
| Monthly story generation | server memory utils (`src/server/utils/memory.ts` / `memory/*`) | Add month-scoped variant of the existing weekly Story-Report generator; cache key `lastMonthlyStory:{YYYY-MM}` alongside existing `lastMemoryStory` |
| Header month tag | `src/client/components/System.tsx` (Header stack) | Read `boardProfile.boardTenureMonths`, gate on `hasUsership`, render next to existing week-number tag |
| Level field ladder extension | `PublicProfile.tsx` + wherever `practiceLevel` / badge-to-symbol mapping lives | Extend lookup past `milestone_100` to include `milestone_180`, `milestone_365` |
| Memory Compression Vault | New component, e.g. `src/client/components/MemoryVaultWidget.tsx` | Gate on `hasUsership && boardTenureMonths >= 12`; consume extended `/api/story/year/:n` endpoint |
| Story API year scope | `src/server/routes/api.ts` (or `os-api.ts`) | Add `GET /api/story/year/:n`, `POST /api/story/year/:n/export`, mirroring existing weekly Story API shape from the Product Brief |
| Dismiss-tracking migration | `MonthlyPulseWidget.tsx` | Move `localStorage` dismiss key to a `monthly_pulse_dismissed` log event, per §7 |

None of these require new AI infrastructure, new badge art, or a new
subscription tier — the ladder is assembled entirely from primitives that
already exist in this repository. The work is wiring, not invention.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
