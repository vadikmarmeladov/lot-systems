# LOT® USERSHIP — THE TWELVE-MONTH EVOLUTION
**From a Barebone First Day to LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · August 2026 · brand.lot-systems.com

---

## What This Document Is

A brainstorm and structural outline for how the Usership UI should look, feel, and *unlock* across its first twelve paid months — Day 1 (barebone) to Month 12 (the fully-evolved operator, the shape our own demo account [`lot-systems.com/u/machiavelli`](https://lot-systems.com/u/machiavelli) is meant to demonstrate).

This is not a proposal to build a new system. It is a map of a **journey that is already half-built** — `MonthlyPulseWidget`, the Monthly Summary generator, the Interface Evolution store, and the badge/milestone engine already exist and already do real work. What's missing is the connective narrative: a deliberate, month-numbered story arc that ties these systems together so the operator *feels* the twelve months pass, culminating in the Ambient AI threshold LOT® AI is meant to cross.

Everything below is written to extend existing code paths, existing vocabulary, and the existing design doctrine — not to invent a parallel system.

---

## The North Star: `/u/machiavelli`

The Machiavelli account is what "12 months evolved" looks like today at `/u/:username` (`PublicProfile.tsx`). A fully-unlocked profile carries, in order:

- Name, week/date header, city (privacy-gated), visit counter
- Team tags and a **boardProfile** block — total invested, Citizen Index, biofield state, activity counts, memory-engine status, clearance level, `citizenSince` + `boardTenureMonths` + `boardMemberNumber`
- A **Psychological Profile** section (Usership-gated) — soul archetype, self-awareness %, badge Level symbol (once streak ≥ 7), core values, emotional patterns, behavioral cohort, pattern strength
- **Correlated Indexes** — self-awareness / user / person / longevity / composite scores
- A rendered **Memory Story** paragraph
- A **QR code** — gated on Usership *and* on `assemblyPhase` reaching `forming` or later
- Footer: *"This is {name}'s System powered by LOT"*

Day 1 renders almost none of this. Every section above is a *destination*, not a default. The twelve-month arc is the deliberate, narrated path from the empty state to this page.

---

## Design Doctrine — What We're Bound By

Two documents already govern this territory, and they're in quiet tension. The plan below resolves that tension rather than picks a side.

**`LOT-STYLE-GUIDE.md`** insists on restraint: opacity as hierarchy (not color), no bold, no emojis, "periods over symbols," milestones surfaced "subtly, every 20 answers," and explicitly — *"No gamification: no points, badges, or leaderboards."*

**The badge system** (812 badges as of Codex v32, `badges.ts`, `INTERFACE_EVOLUTION.md`) exists anyway, and it's good — Water and Architecture metaphor families, Hero's Journey mastery tiers, multi-year milestones (`saga_age` at 5 years, `great_work` at 150,000 journal words).

The resolution: **badges and months are not score, they're narrative chapters.** A badge never appears as a trophy shelf, a counter going up, or a leaderboard rank. It appears once, as a sentence, in the operator's own Story — the same voice the Memory Engine already writes in. `MonthlyPulseWidget`'s existing copy is the proof this works: *"Three months. You have reached Active User status."* is a badge. It just doesn't look like one. Every new unlock in this plan follows that pattern: text, not iconography; earned, not gamified; "12 months" framed as a portrait completing, not a progress bar filling.

---

## The Scaffolding Already in Production

| System | File | What it already does |
|---|---|---|
| Month-tenure milestones | `src/client/components/MonthlyPulseWidget.tsx` | `monthNumber = diff(now, joinedAt, 'month')`, one scripted line per month 1–12, "N / 12 months" footer, fires once per calendar month, Usership-gated |
| Monthly compression | `src/server/utils/monthly-summary.ts` | `generateMonthlySummary()` — Presence / Energy / Patterns / Evolution narrative + "Forward Look" closing line, embeds a `generateMemoryStory()` call, delivered as a scheduled email (09:00 UTC, 1st of month) |
| Memory Story | `src/server/utils/memory.ts` → `generateMemoryStory()` | Compresses up to 30 stored answers into a flowing narrative, cached on `user.metadata.lastMemoryStory`, regenerates only when answer count changes |
| Interface Evolution | `src/client/utils/interfaceEvolution.ts` | 7-dimension store (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) driving CSS custom properties (`--evolution-glow-intensity`, `--evolution-grid-opacity`, etc.), feature-gates by tier (Advanced Memory, Custom Themes, Export Data, Narrative Reflection), a four-chapter arc (Awakening → Exploration → Integration → Mastery) |
| Day-streak badges | `src/client/utils/badges.ts` | `milestone_7`…`milestone_365`, dual Water (Droplet→Wave→Current) / Architecture (Foundation→Structure→Citadel) themes, `getLevelSymbol()` / `getLevelName()` |
| Self-Assembly phases | `ArchitectWidget.tsx`, `SystemProgressWidget.tsx` | Usage-density (not calendar) evolution: `dormant → awakening → forming → assembled → integrated` |
| Self-care & check-in tracking | `SelfCareMoments.tsx`, `EmotionalCheckIn.tsx` | Daily streak calculation off `self_care_complete` / `emotional_checkin` log events |
| Public evolved-state render | `src/client/components/PublicProfile.tsx` | The `/u/:username` destination page described above |

Nothing in the plan below requires a new engine. It requires **wiring the month-count already computed in `MonthlyPulseWidget` into a shared "Usership Age" signal**, and letting existing widgets (boardProfile, badge Level, QR gating, Interface Evolution tier gates) read from it.

---

## The Twelve-Month Arc

Each month row: **what the operator sees for the first time**, **what the Memory Story is capable of saying about them by then**, and **the one sentence `MonthlyPulseWidget` already speaks (or should speak) at that threshold.**

### Month 0 — Day 1: The Barebone State

No boardProfile. No badge Level (streak < 7). No QR. No Memory Story worth reading yet (fewer than 5 answer-logs — below the threshold `monthly-summary.ts` requires to even attempt a story). The UI is close to the Free tier described in `About.tsx`'s Usership Tiers section, plus one thing Free doesn't get: the first Emotional Check-In and the first Self-Care button, unstyled, unexplained, just present. The Log is an empty, blinking field.

This starkness is deliberate — it is the *only* month the operator sees the raw instrument before the system starts responding to them. Nothing to unlock yet; there's nothing to have earned. The first Usership screen should say, in the existing tone-of-voice register, something like: *"Day one. The system is listening."* — visually identical to Month 1's line in `MONTH_MESSAGES`, just fired on Day 1 instead of Month 1, so the arc has a true starting gun.

### Month 1 — "The system is beginning to know you"

Existing line, unchanged: *"The first month. The system is beginning to know you."* First Memory Story becomes possible once answer-logs cross 5. First `milestone_7` badge (Droplet / Foundation) likely lands mid-month off the existing day-streak logic — this is the first time a badge symbol appears anywhere in the UI, and it should appear exactly once, inline, in the Log or Memory widget, never as a popup shelf.

**New widget, first appearance: "Months Unlocked."** A small, context-based widget — label-cycling per the style guide's core interaction pattern — showing `Months unlocked: 1/12`. Not a progress bar. A number, styled identically to every other metric label in the system (`opacity-60`, no color, no icon). It is the one persistent thread the operator sees every month for the rest of the year.

### Month 2 — "Patterns are starting to form"

Existing line, unchanged. Behavioral cohort computation (already used in `monthly-summary.ts`'s "dominant themes" pass) becomes visible for the first time as a single line in the Memory widget — not the full Psychological Profile, just one clause borrowed from it. `milestone_30`-adjacent day-streak badges (Wave / Structure) begin to appear if consistency holds.

### Month 3 — "Active User status"

Existing line, unchanged — this is already the first *named* status change in the copy, and it should be treated as the first real threshold. This is where the **boardProfile block on `PublicProfile.tsx` should first partially render** — `citizenSince` and `boardTenureMonths` populate, but `boardMemberNumber` and the full Citizen Index stay hidden until Month 6. The public profile page stops being "Private" and starts showing name + tenure only.

### Month 4 — "The portrait deepens"

Existing line, unchanged. First **Memory Widget insight paragraph**: instead of just the raw Memory Story, the widget now surfaces one paragraph pulled from the prior month's `generateMonthlySummary()` output — the "Evolution" section specifically, since by Month 4 there's enough month-over-month delta to compare. This is the tangible version of "compressed Memory story delivery" the brief asks for: not a new generation pipeline, just promoting the existing Monthly Summary's Evolution paragraph from email-only to an in-app widget.

### Month 5 — "Consistency is its own reward"

Existing line, unchanged. Interface Evolution's Depth dimension (per `INTERFACE_EVOLUTION.md`'s existing gate table) should be close to unlocking Advanced Memory and Narrative Reflection features for a consistent operator at this point — this is where the Log interface itself should visibly gain its first bit of "earned complexity" (subtler grid, slightly higher glow-intensity CSS variable), per the evolution store's own "start minimal, earn complexity" principle.

### Month 6 — "The journey is half-declared"

Existing line, unchanged, and it should be leaned into hard — this is the arc's literal midpoint. **Full boardProfile activates**: Citizen Index, biofield state, `boardMemberNumber` all populate. This is also the natural point for the first **Assembly Phase transition to `forming`** to coincide with tenure (today `forming` is purely usage-density-driven; a six-month Usership operator with any real consistency should already have crossed it) — which is the trigger that unlocks the **QR code** on the public profile for the first time. Six months in, the operator's page becomes shareable in the way `/u/machiavelli` is shareable.

### Month 7 — "The system has been listening"

Existing line, unchanged. Psychological Profile section on `PublicProfile.tsx` should begin partial render — soul archetype and core values only, self-awareness % and pattern strength held back until Month 9.

### Month 8 — "Rare air"

Existing line, unchanged. This is the natural home for a `milestone_180`-adjacent early flag (the actual 180-day badge lands closer to Month 6 on a daily-streak clock, but the *narrative* beat of rarity belongs here on the calendar-month clock) — worth a single line in the Memory widget acknowledging that most Usership operators don't reach this month with an active streak. Not a leaderboard comparison. A private, first-person observation, in the Story's own voice.

### Month 9 — "The self-care practice is a habit now"

Existing line, unchanged — and it should be taken literally: this is where `SelfCareMoments.tsx`'s streak data graduates from a private counter into a line in the public Psychological Profile's "behavioral traits" — self-awareness % and full pattern strength now render. The system is naming, out loud, what the operator has built.

### Month 10 — "Almost there"

Existing line, unchanged. Correlated Indexes (self-awareness / user / person / longevity / composite) fully populate on the public profile. Memory widget insight paragraph, by this point, should read noticeably different in register from Month 4's — longer-arc, less descriptive, more interpretive — the same shift `MEMORY-ENGINE-WHITE-PAPER.md`'s own WHAT → HOW → WHY progression describes, just stretched from weeks to months.

### Month 11 — "One more"

Existing line, unchanged. No new unlocks — this month is intentionally quiet, a held breath before Month 12, matching the style guide's "gradual, meaningful progression over quick wins" doctrine. The Months Unlocked widget reads `11/12` and nothing else changes.

### Month 12 — "The portrait is complete — and still evolving"

Existing line, unchanged, and it is exactly right: *complete, and still evolving* — not "finished." This is the month the operator's `/u/:username` page should be structurally indistinguishable from `/u/machiavelli`: full boardProfile, full Psychological Profile, full Correlated Indexes, QR code active, badge Level visible, Memory Story reading as a settled first-person voice rather than a sparse compressed one.

This is also the month the product crosses into what `LOT-AI-PRODUCT-BRIEF.md` and `LOT-AMBIENT-AI-VISION.md` describe as the actual LOT® AI threshold — the Weekly Story-Report becomes a meaningful export (`GET /api/story/latest`), not just an internal artifact, because there's finally a year of compressed signal behind it. The "Months Unlocked: 12/12" widget should retire itself gracefully — its final state is the one time in the entire arc a widget is allowed to say something close to a superlative, because it's now a *fact*, not encouragement: a full year, compressed.

---

## Three New Widgets, Concretely

**1. "Months Unlocked" — context widget.**
Persistent, small, always-visible companion to `MonthlyPulseWidget` rather than a replacement for it. `MonthlyPulseWidget` is the *event* (fires once, fades, gone); this widget is the *state* (always reads `N/12`, click-to-cycle per the style guide's label-cycling pattern into `N/12` → tenure date → next-milestone countdown). Reads the same `monthNumber` computation `MonthlyPulseWidget.tsx:73-79` already derives — no new backend logic, just a second, persistent consumer of that number.

**2. New-Month Congratulations widget.**
`MonthlyPulseWidget` already *is* this, functionally — it just currently reads as a status update ("Three months. Active User status.") rather than a celebration. The recommendation is not a new widget but a copy and framing pass: keep the exact mechanism (once-per-month, click-to-dismiss, `DISMISS_PHRASES` rotation), but let the Month 3/6/9/12 lines specifically borrow one clause from that operator's own `generateMonthlySummary()` output (e.g. their actual longest streak, their actual dominant theme) so "congratulations" feels sourced from their year, not scripted for everyone's.

**3. Memory Widget — last month's insight paragraph.**
Surfaces the "Evolution" section of the prior month's `generateMonthlySummary()` output (already generated server-side for the monthly email — `monthly-summary.ts`) as an in-app paragraph, refreshed on the 1st–3rd of each month alongside `MonthlyPulseWidget`'s own reveal window (`shouldShowMonthlySummary()` already limits this to the first 3 days of the month). This is the most direct answer to "12-month tangibility of the compressed Memory story delivery" in the brief: the compression pipeline exists and already runs monthly — this widget just gives its output a home in the product instead of only in an email inbox.

---

## Badge & Tenure Vocabulary to Reuse

The Water and Architecture theme families (`badges.ts`, `INTERFACE_EVOLUTION.md`) already carry exactly the register this arc needs and should not be reinvented:

- **Water:** Droplet → Wave → Current → ... — organic, cumulative, fits the Memory Story's first-person voice
- **Architecture:** Foundation → Structure → Architecture → Wing → Citadel — fits the boardProfile / Psychological Profile's more structural, "system being built" register
- `perfect_month` ("28 consecutive Perfect Days") and `memory_keeper_30` ("Memory answers on 30 distinct calendar days") are existing badges that map almost exactly onto monthly cadence already — worth surfacing explicitly in the Month 1 and Month 2 beats above rather than leaving them buried in the general badge stream
- Longer-arc Codex v32 badges (`saga_age`, 5-year account age; `great_work`, 150,000 journal words) establish that the system already thinks in multi-year terms — the 12-month arc is this document's attempt to give the *first* year of that multi-year story its own clear shape

Lexicon terms worth keeping load-bearing in any copy written for this arc: **Virtuous Cycle** (more use → deeper profile → more resonant questions → more use — literally the mechanism this whole plan rides), **Operator** (never "subscriber," even though Usership is a subscription), **Ambient AI™** (the state Month 12 is meant to cross into).

---

## Open Items Surfaced During Research

Not fixes — flagging for whoever picks this up next, since they affect how confidently this arc can be shipped:

- **Pricing is inconsistent across the UI.** `SubscribeWidget.tsx` and `Settings.tsx` show $99/mo; `About.tsx`'s two Usership mentions show $50/mo in one place and a "$99" heading in another. `LOT-AI-PRODUCT-BRIEF.md`'s pricing table says $99/mo. Whatever the twelve-month arc communicates about "what Usership is," it should wait on this being resolved to one number, or the arc's own Month 0 framing will contradict the pricing page.
- **Route naming mismatch.** `About.tsx`'s "Usership Tiers" section describes the public profile as living at `/os/{username}`; the actual route is `/u/:userIdOrUsername` (`server/index.ts:243`, `server/server.ts:182`). Any copy written for this arc should say `/u/`, and the About page copy should eventually be corrected to match.
- **The "no gamification" clause in `LOT-STYLE-GUIDE.md`** directly contradicts the shipped badge system (812 badges as of Codex v32). This document resolves it editorially (badges as narrative sentences, never as trophy UI) rather than by code change — but the style guide itself would benefit from an update that reflects what's actually true of the product today.
- **`shouldShowMonthlySummary()`'s first-3-days-of-month window** and `MonthlyPulseWidget`'s own once-per-month reveal are two independent gates computed differently. If the Memory Widget (idea #3 above) is built to ride the same reveal window, the two gates should be unified into one shared "reveal window" check rather than kept as two separately-tuned timers that can drift out of sync.

---

## Summary Table

| Month | Milestone line (existing) | New surface |
|---|---|---|
| 0 | *"Day one. The system is listening."* (new, mirrors M1 register) | Barebone: Log, Check-In, Self-Care only |
| 1 | The first month. The system is beginning to know you. | First Memory Story; Months Unlocked widget debuts (1/12) |
| 2 | Two months in. Patterns are starting to form. | Cohort clause in Memory widget |
| 3 | Three months. Active User status. | boardProfile partial render (citizenSince, tenure) |
| 4 | Four months. The portrait deepens. | Memory widget: Evolution-paragraph insight |
| 5 | Five months. Consistency is its own reward. | Interface Evolution: earned visual complexity begins |
| 6 | Six months. The journey is half-declared. | Full boardProfile; Assembly Phase → forming; QR unlocks |
| 7 | Seven months in. The system has been listening. | Psychological Profile: archetype + values |
| 8 | Eight months. Rare air. | Private rarity note in Memory widget |
| 9 | Nine months. The self-care practice is a habit now. | Psychological Profile: full self-awareness % + traits |
| 10 | Ten months. Almost there. | Correlated Indexes fully populate |
| 11 | Eleven months. One more. | Quiet — no new unlocks |
| 12 | One year with LOT. The portrait is complete — and still evolving. | Profile structurally matches `/u/machiavelli`; Story-Report export becomes meaningful |

---

*This document is a brainstorm and outline, not an implementation spec. No source files were modified in producing it. Next step, if this direction is approved: a scoped engineering pass on `MonthlyPulseWidget.tsx`, `monthly-summary.ts`, and `PublicProfile.tsx`'s gating conditions to wire the shared "Usership Age" signal described above.*
