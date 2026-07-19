# LOT® Usership — The 12-Month Evolution
**From Barebone Day One to LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Design Brainstorm · 19 July 2026 · brand.lot-systems.com

---

## Purpose

Usership ($99/month) is not a feature unlock. It is a relationship that compounds. Today the interface already evolves — but it evolves on *behavior* (streaks, answers, badges). This document designs the second axis: **tenure**. It maps what a paying Operator sees on Day 1 against what the [Machiavelli demo account](https://lot-systems.com/u/machiavelli) shows at full maturity, and lays twelve deliberate steps between them.

This is a brainstorm and specification, not a shipped change. No code was modified. It is grounded entirely in mechanisms that already exist and ship in this repository — the goal is to give a future assembly session an unambiguous, doctrine-compliant blueprint.

---

## Part 1 — What Already Exists (the engine we are extending)

A repo scan (`System.tsx`, `interfaceEvolution.ts`, `evolution.ts`, `badges.ts`, `memory.ts`, `PublicProfile.tsx`, `public-api.ts`, plus the Doctrine/Lexicon/Style Guide/Badge Codex/Memory Engine docs) surfaced a real, wired evolution engine already in production:

- **Interface Evolution** (`interfaceEvolution.ts`) — 7 behavioral dimensions (exploration, consistency, depth, connection, intimacy, care, courage), each 0–1, composing into `overallMaturity`, `visualRefinement`, `themeComplexity`, and a `featureUnlockLevel`. This gates 14 named features (advanced Memory, planner templates, custom themes, narrative reflection, etc).
- **Layout Density** — a real, shipped, 5-step CSS mechanism (`breathable → comfortable → compact → dense → instrument`), driven by `visualRefinement`, resolved via `[data-density]` selectors in `index.css`. New Operators get airy, generous spacing; mature Operators get a Bloomberg-terminal-grade instrument panel. This is the single strongest lever available for "the UI visibly changed" — and it already exists.
- **Badges** — 626 badges (Badge Engine v26), 70+ categories, 8 rarity tiers, mostly hidden. `getLevelSymbol()` renders a streak-based glyph in one of two visual metaphors the Operator chooses: **Water** (∘ → ≈ → ≋, Mayan/tidal) or **Architecture** (├─ → ╞═╡ → ║·║, structural).
- **Memory & Story** — Memory (capital M) asks one question at a time, depth-progressing WHAT (week 1) → HOW (weeks 2–3) → WHY / soul-level (week 4+). A weekly Story (capital S) compresses the week's Log into a first-person narrative, cached to `user.metadata.lastMemoryStory`, surfaced on the profile and in the Memory widget.
- **`MonthlyPulseWidget`** — **this already exists and is the seed of everything below.** It computes `monthNumber = dayjs(joinedAt).diff(now, 'month')`, gates on the `Usership` tag, and shows one of twelve pre-written canonical lines plus a literal `N / 12 months` counter — dismissible once per month, with a rotating set of quiet acknowledgment phrases ("Onward.", "Noted.", "The next month begins."). These twelve lines are canon; this document builds its month-by-month structure around them rather than inventing new copy that would compete with them.
- **OS Version = Tenure, already** — `public-api.ts` computes `osVersion = monthsSinceJoined.padStart(3, '0')`, displayed on the public profile as "Psychological Profile: OS v.NNN". The Machiavelli demo hardcodes `v.531` (531 months — a joke on the 1469 founding date). **The month-counter mechanism this document needs already has a canonical public-facing representation.** Nothing new needs to be invented here — it needs to be *surfaced earlier and more often* for the paying Operator, not just shown to visitors of their public profile.
- **The gap.** None of the above gate on *subscription duration*. Everything gates on activity (streak, answer count, level). A highly engaged Operator on day 10 can already be denser and further unlocked than a quiet Operator on month 6. That's correct and should stay true — but it means there is currently no mechanism that makes *paying for a year* feel different from *paying for a week and grinding hard*. That is the hole this document fills.

---

## Part 2 — Design Thesis: Two Axes, Not One

**Mastery** (existing, behavior-earned, unlimited ceiling) stays exactly as it is. It must never be cheapened — badges and density earned through real engagement are the entire emotional payoff of the system, and Military Purity doctrine forbids anything that reads as flattery or a participation trophy.

**Tenure** (new, calendar-earned from `joinedAt`, capped at 12) is additive, not a replacement. It does three things and three things only:

1. Sets a **floor**, not a ceiling, on density and feature-unlock level — a quiet, low-activity Usership member still visibly moves forward every month, because they are paying for a relationship, not a leaderboard position.
2. Unlocks a small set of **tenure-exclusive surfaces** (the Months Unlocked indicator, the Monthly Memoir, the twelve `MonthlyPulseWidget` messages) that a free or R&D-tier Operator, however active, never sees. These are Usership's actual differentiator — visible time, not visible grind.
3. Triggers a **once-a-month ceremony** (Part 4) — the one moment per month the system pauses to acknowledge the Operator by name, distinct from the constant low-hum feedback of daily widgets.

Mastery can exceed Tenure (a power user is denser sooner). Tenury cannot exceed what Mastery has *actually earned* on the badge/feature axis — Usership buys a floor and a ceremony, never a shortcut into content that must be earned honestly (the 626-badge economy, in particular, stays 100% behavior-gated; no "loyalty badges" masquerading as achievement badges).

---

## Part 3 — Day One: Barebone, On Purpose

There is currently no dedicated onboarding flow in the codebase — day 1 is simply whatever the existing gates produce at level 0 / streak 0 / month 0. That default state is *correct* and should be kept, with one addition:

- **What Day 1 already gives, unmodified:** the full Usership widget stack is present (not the free-tier "essentials" cut-down), but almost every `featureUnlocks` flag is false and density sits at `breathable`. This reads as spacious and quiet rather than empty — which is the right first impression: *the system is present, and it is listening, and it has nothing to perform yet.*
- **The one real gap:** `MonthlyPulseWidget` only fires once `monthNumber >= 1` — i.e., not until ~30 days in. There is currently no acknowledgment moment between signup and the Month 1 pulse. A brand-new Operator gets no "you're in" moment at all.
- **Recommendation:** a single, one-time **Welcome pulse** (Day 0, fires once, never repeats) reusing `MonthlyPulseWidget`'s exact visual and interaction pattern — same `Block`, same fade choreography, same dismiss-phrase mechanic — with its own line, e.g. *"Usership begins. The system starts listening."* followed by `0 / 12 months`. This costs almost nothing to build (it is the same component with a 13th message keyed to day 0 instead of month 1–12) and closes the only hole in an otherwise-complete mechanism.

---

## Part 4 — The Month-Turn Ceremony

Once a month, on the Operator's personal anniversary (not a shared calendar date — `joinedAt`-relative, exactly as `MonthlyPulseWidget` already computes it, so every Operator's "new month" lands on a different day and feels personal rather than batched), three things happen together:

1. **The Pulse fires** (existing mechanism) — the canonical month message + `N / 12 months`.
2. **The Monthly Memoir compresses** (new, Part 5.3) — a paragraph-length rollup of the past month's weekly Stories, written in the Operator's own behavioral voice, surfaced the moment the Pulse is dismissed.
3. **An affirmation is drawn** from whichever of the 7 evolution dimensions scored highest that month — not a generic compliment, a specific, earned observation (e.g., if `care` led the month: *"Self-care logged nineteen times this month. The pattern held."*). This directly answers the brief's request for monthly affirmations, and keeps them evidence-based rather than saccharine, per Military Purity (no superlatives, state what happened).

The three fire in sequence, not simultaneously — Pulse first (the ceremony), Memoir second (the reflection), affirmation woven into the Memoir's closing line rather than as a fourth separate popup. One ceremony, not four notifications.

---

## Part 5 — New / Extended Surfaces

### 5.1 Months Unlocked (persistent, new)
A small, always-present stat — not a toast like the Pulse, a permanent line, living where the Board Profile's "OS v.NNN" already lives on the public profile, and mirrored privately in the System dashboard stats stack (`UserMetricsWidget` neighborhood). Literal copy: `Months unlocked: 3 / 12`. Reuses the identical `dayjs(joinedAt).diff(now, 'month')` calculation `MonthlyPulseWidget` already performs — one formula, two surfaces, no drift between them. Caps display at `12 / 12`; the underlying OS version keeps counting past 12 for veteran Operators (this is exactly what the Machiavelli account demonstrates — `v.531` is what "past the 12-month arc, still counting" looks like).

### 5.2 Monthly Pulse (existing — keep as-is)
No changes to the twelve canonical messages. They are good, they are Military-Purity-compliant, and they already form the emotional spine of the whole system. Extend only with the Day-0 Welcome variant (Part 3).

### 5.3 Monthly Memoir (new)
The weekly Story mechanism (`memory.ts`, Job 24, `lot_ai_story`) already compresses a week of Log entries into a first-person narrative. The Memoir is the same compression pattern applied one level up: roughly four cached weekly Stories → one paragraph, cached to `user.metadata.monthlyMemoir[N]`, generated on the Operator's month-turn rather than a shared calendar week. This is the direct answer to "a Memory widget displays a paragraph-long insight from last month" — surfaced as a new cyclable view on `NarrativeWidget` (which already cycles Story → Achievements → Quests → Context) or as its own small widget, `MonthlyMemoirWidget`, following the exact same `Block` + fade pattern as its neighbors.

### 5.4 Tenure Mark (new, Usership-exclusive glyph)
A minimal third visual track alongside the existing Water/Architecture badge metaphors — not a competing badge economy, a single evolving glyph tied only to `monthNumber`, literally the zero-padded OS version already computed server-side (`v.001` → `v.012`). No new badge logic required; this is a rendering treatment of a number the server already produces. Where Water/Architecture badges say *"you did the work,"* the Tenure Mark says *"you have been here this long"* — and the two coexisting side by side is the whole point: mastery and tenure, legible as two different things.

### 5.5 Density Ramp — Tenure Floor
`visualRefinement` thresholds already exist (`interfaceEvolution.ts:442-467`: 0 / 0.15 / 0.35 / 0.55 / 0.75 → breathable / comfortable / compact / dense / instrument). Proposal: `monthNumber` establishes a **minimum** `visualRefinement` floor per the table below, via `Math.max(behaviorDerivedRefinement, tenureFloor(monthNumber))` in `calculateEvolutionState()`. A quiet Usership Operator who logs rarely still visibly densifies across the year; an active one still outpaces the floor exactly as today. No existing threshold, formula, or behavior-derived value changes — one `Math.max` guard is the entire code delta this implies.

---

## Part 6 — The Twelve Months

Each row: the canonical Pulse line (verbatim, unchanged) · the density floor it introduces · the dimension the month leans on · what becomes newly visible · the Log/check-in rhythm suggested (never enforced — Style Guide is explicit: *suggests, doesn't command*).

| Mo. | Canonical Pulse (verbatim) | Density floor | Leaning dimension | What's newly tangible | Log / self-care rhythm |
|---|---|---|---|---|---|
| **0** | *(new)* "Usership begins. The system starts listening." | breathable | — | Welcome pulse fires once; `0/12`; widget stack present but quiet | No expectation set yet. Morning check-in offered, never required. |
| **1** | "The first month. The system is beginning to know you." | breathable | exploration | First Monthly Memoir (thin — one month of Log to work with); Tenure Mark `v.001` appears | Whatever the Operator naturally does. First Memory questions are WHAT-level. |
| **2** | "Two months in. Patterns are starting to form." | breathable→comfortable | exploration/consistency | `Months unlocked: 2/12` becomes visible in dashboard stats (not just profile) | Memory questions shift toward HOW. Self-care widget starts appearing at natural anxiety/pattern triggers, not on a fixed clock. |
| **3** | "Three months. You have reached Active User status." | comfortable | consistency | Density floor visibly steps up — a real Day 1 vs. Day 90 screenshot difference; first badge-tier milestones realistic by now | Streak-based badges (7/14/21/30-day) start landing naturally if the Operator has been logging. |
| **4** | "Four months. The portrait deepens." | comfortable | depth | `advancedMemory` feature (deep reflection questions) now floor-guaranteed regardless of activity | Memory questions reach WHY-level territory. Monthly Memoir starts reading less like a summary, more like a portrait. |
| **5** | "Five months. Consistency is its own reward." | comfortable→compact | consistency | `plannerTemplates`, `customThemes` floor-guaranteed | Widget copy tone shifts — less instructional, more familiar, matching the Style Guide's "earned informality" register. |
| **6** | "Six months. The journey is half-declared." | compact | connection/care | Halfway ceremony — Monthly Memoir explicitly references month-1 vs. month-6 contrast (the system quoting itself back) | First moment the affirmation draws on a full half-year of dimension data — genuinely comparative, not just descriptive. |
| **7** | "Seven months in. The system has been listening." | compact | depth | `intentionHistory`, `moodPatterns` floor-guaranteed | — |
| **8** | "Eight months. Rare air." | compact→dense | consistency | Density crosses into `dense` — cockpit register begins even for low-activity Operators | Tenure Mark and badge glyphs now visually distinct enough to read at a glance (per Style Guide opacity hierarchy: primary vs. tertiary). |
| **9** | "Nine months. The self-care practice is a habit now." | dense | care | This line is the system stating a fact, not encouragement — self-care cadence should, by month 9, be visibly the most logged category in the Activity view (`EvolutionWidget`'s activity breakdown) | Self-care affirmation is the headline affirmation this month by design — the canonical copy already commits to this being the "care" month. |
| **10** | "Ten months. Almost there." | dense | courage | `exportData`, `narrativeReflection` (if depth ≥ 0.66 and level ≥ 30) realistically online for anyone who has been present | Monthly Memoir starts previewing what the month-12 close will look like — the system signaling its own approaching ceremony. |
| **11** | "Eleven months. One more." | dense→instrument | — | Final approach; density floor reaches the edge of `instrument` | — |
| **12** | "One year with LOT. The portrait is complete — and still evolving." | instrument | all seven | **Year-Close Memoir** — not a monthly rollup but a twelve-month one, explicitly the longest and most synthesized piece of writing the system has produced about the Operator; Tenure Mark reaches `v.012`; `Months unlocked: 12/12` — after this, the private dashboard indicator quietly retires and only the OS version (uncapped, `v.013…`) keeps counting, matching what the Machiavelli account demonstrates at `v.531` | This is the month the system explicitly says the portrait is "complete — and still evolving" — the UI should not visually change less after month 12, it should stop being framed as *arriving* somewhere and start being framed as *living* somewhere. |

---

## Part 7 — Machiavelli as the Month-12+ Reference

The demo account is hardcoded in `public-api.ts` at `v.531` — not month 12, but month 531. That is deliberate and useful: it proves the ceiling this document designs toward is not "month 12 and done," it's "month 12 is where the *onboarding arc* ends and the *lived* system begins." Every mechanism above (density, Tenure Mark, Monthly Memoir, feature floor) keeps running unbounded past 12; only the *narrative framing* — "you are being brought somewhere" — retires at month 12 in favor of "you live here now." A future engineering pass should treat the demo account's full Board Profile, Citizen Index, Legacy-tier Weather Station and Wallet blocks as the literal end-state screenshot for "what a Usership member's UI looks like once tenure and mastery are both maxed" — everything in Part 6 is the twelve-step path from the current Day-1 barebone state to that screenshot.

---

## Part 8 — Doctrine Compliance Checklist

- No emoji anywhere in any of the above. Periods, not exclamation marks. ✗ *("Amazing progress!")* → ✓ *("Nine months. The self-care practice is a habit now.")*
- **Usership** (capital U), **Log** (capital L), **Memory** (capital M), **Story** (capital S), **Operator** never "user" in-voice, **LOT®** with the mark on first use per section.
- COCKPIT RULE preserved: nothing above proposes adding narration or prose *inside* the Log itself — all new narrative surfaces (Memoir, affirmations) live in dedicated reflection widgets, exactly where the Story already lives, never inline with instrument-grade Log entries.
- No pay-to-win: the 626-badge economy is untouched; Tenure only floors density/feature-unlock and unlocks its own exclusive, non-competing glyph track.
- "Suggests, doesn't command": every Log/check-in rhythm above is described as a rhythm the system *supports*, never a quota it enforces — consistent with existing `calculateIntelligentPacing()`, which already varies Memory's daily quota (10 on Day 1, up to 15 by day 4+) without ever blocking or scolding.

---

## Part 9 — Implementation Pointers (for a future assembly session)

This document authorizes no code changes. If greenlit, the smallest-footprint path is:

1. `interfaceEvolution.ts` — add `getTenureFloor(monthNumber): number` (five-band lookup matching Part 6's density column) and one `Math.max()` guard inside `calculateEvolutionState()`.
2. `MonthlyPulseWidget.tsx` — add a `0` entry to `MONTH_MESSAGES` for the Day-0 Welcome variant; relax the `monthNumber < 1` guard to `< 0`.
3. New `MonthsUnlockedWidget.tsx` — trivial, reuses the exact `dayjs(joinedAt).diff(now,'month')` calculation already in `MonthlyPulseWidget.tsx`; renders as a permanent stat line, not a toast.
4. `memory.ts` — new `buildMonthlyMemoir()`, mirroring the existing weekly Story job (Job 24 pattern), reading the past ~4 cached weekly Stories from `user.metadata`, writing to `user.metadata.monthlyMemoir[N]`. Trigger per-Operator on their `joinedAt` anniversary, not a shared cron date.
5. `NarrativeWidget.tsx` — new `memoir` view in its existing view-cycle, or a sibling `MonthlyMemoirWidget.tsx` following the same `Block` pattern as `MemoryWidget`/`NarrativeWidget`.
6. `PublicProfile.tsx` / dashboard stats — no change needed; `osVersion` computation already exists and already IS the Tenure Mark's data source.

Estimated surface: two new small widgets, one new server job, one guard clause in an existing pure function, one new array entry. Everything else in this document is composition of mechanisms already shipped.

---

## Part 10 — Open Questions

1. Should the density **floor** apply retroactively to existing Usership members (their true tenure) or only forward from this feature's ship date? Retroactive is more honest to the "you've been here this long" promise but needs a one-time migration pass over `joinedAt`.
2. Should the Year-Close Memoir (month 12) be exportable via the existing Story API (`POST /api/story/:week_id/export`) the same way weekly Stories are, so it can reach the Robot/Vehicle/Dashboard recipients described in the Product Brief? Likely yes — it would be the highest-signal payload the export pipeline ever produces.
3. Harmonize naming: `EvolutionWidget`'s stage names (Bootstrapping → Transparent, keyed on level) and the Board Profile's Citizen Index stages (Observer → Elite, keyed on answer count) currently describe similar territory with different vocabularies. Not blocking for this design, but worth a single naming pass before the Tenure Mark ships alongside both.

---

*This document is a design brainstorm per S-2's request. It reads every mechanism above from the actual shipped code (`interfaceEvolution.ts`, `evolution.ts`, `MonthlyPulseWidget.tsx`, `EvolutionWidget.tsx`, `NarrativeWidget.tsx`, `MemoryWidget.tsx`, `PublicProfile.tsx`, `public-api.ts`, `memory.ts`, `badges.ts`) and the current Doctrine/Lexicon/Style Guide/Badge Codex/Memory Engine documentation, not from assumption.*
