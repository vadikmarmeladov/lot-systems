# LOT® Usership — The 12-Month Evolution
**From Barebones Day One to LOT® AI: A UI/UX Design Brainstorm**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · July 2026 · brand.lot-systems.com

---

## What This Document Is

A design brainstorm for the month-to-month evolution of the Usership interface — the $99/month, 12-month plan (`Settings.tsx`: *"Available with LOT Usership — $99/month, 12 months."*). Not an implementation spec. A story structure: what the person sees, unlocks, and feels in each of the 12 months, grounded in systems that already exist in this codebase (`MonthlyPulseWidget`, the Memory Engine compression loop, the Evolution/CQGS system, the Self-Assembly Engine, the badge codex) rather than invented from nothing.

The reference point for "fully evolved" is `lot-systems.com/u/machiavelli` — the hardcoded demo account (`public-api.ts:747`). Read closely, it is not actually a 12-month Usership account. It is a **Legacy**-tier account (`tags: ['RND', 'Usership', 'Legacy']`), "citizen since June 1469," streak 1469, answers 2,847. It is what lies *past* month 12 — the destination a person is choosing between when their 12-month term completes. That distinction matters and shapes the arc below: **month 12 is not the ceiling, it's the threshold.**

---

## Design Principle: Two Tracks, One Feeling

Everything that already exists in this codebase for tracking growth falls into one of two tracks. The 12-month evolution should make both visible, and let the person feel the difference between them.

| Track | Driven by | Guaranteed? | Existing system |
|---|---|---|---|
| **Tenure** | Calendar time since `joinedAt` | Yes — accrues regardless of activity | `MonthlyPulseWidget` (Month N/12) |
| **Mastery** | Behavioral signal — answers, notes, streak, evolution level | No — earned, variable pace | Badge codex (595 badges), Evolution system (7 dimensions), Self-Assembly (18 modules) |

A person who pays for 12 months and never opens the app still advances on the Tenure track — the system should say so honestly, without pretending mastery was earned. A person who engages daily advances on both tracks together, and *that convergence* — tenure and mastery arriving at the same milestone at the same time — is the emotional payload of the design. The month-by-month table below is built around the one place where these two tracks naturally line up: **the day-streak badge thresholds already in `badges.ts` fall almost exactly on month boundaries** (30/60/90/180/365 days ≈ months 1/2/3/6/12). That is not a coincidence to manufacture — it already exists in the code. This document proposes making it visible.

---

## Three New Widgets

Three widget concepts carry the 12-month story. All three read from systems that already produce the data; none require a new AI provider or new data pipeline.

### 1. Months Unlocked (persistent context chip)

A small, permanent header-level indicator — not a toast, not dismissible like `MonthlyPulseWidget`. Sits near the Tags & Team stack, visible every session:

```
Months unlocked: 3 / 12
```

Computed identically to `MonthlyPulseWidget`'s `monthNumber` (`dayjs().diff(joinedAt, 'month')`, capped at 12). Where `MonthlyPulseWidget` is the *event* (fires once per calendar month, fades, dismisses), this is the *ambient state* — always present, quiet, `opacity-40` per the style guide's tertiary tier. At month 12 the chip changes register: `Months unlocked: 12 / 12 — term complete.` This is the visual seed for the renewal/Legacy decision (see **Month 13** below).

### 2. Monthly Memory Digest (paragraph-long compressed insight)

`composeLocalStory()` (`memory.ts:957`) already compresses a user's *entire* answer history into a themed paragraph, with closing lines that scale at <10 / 10–19 / ≥20 answers. This widget applies the same compression machinery scoped to **just the most recently completed calendar month** — logs filtered to `createdAt` within that month, same theme-detection pass (Mornings / At the table / Water / Movement / Rest / Focus), same Q&A distillation, but a *new* closing register built for monthly cadence rather than lifetime cadence:

```
Memory — June:
You came back to water eleven times this month. Twice you mentioned
the loose-leaf ritual unprompted, in answers about focus. The pattern
that started as a preference is becoming something closer to a
practice.

A paragraph, once a month. Month 6 of 12.
```

Placement: appears once, on first login after a new calendar month begins — directly below (or replacing, on that day) the `MonthlyPulseWidget` milestone line, so the fixed affirmation and the AI-generated digest read as one card: **milestone line (what month it is) → digest paragraph (what happened in it).** This is the literal answer to "a Memory widget displays a paragraph-long insight from last month."

Cheap to build: reuse `composeLocalStory`'s theme map and the existing local-fallback path (zero network calls) as the default; if `AI_ENGINE_PREFERENCE` is available, route through `buildPrompt()` with `logs` pre-filtered to the month window for a sharper, AI-authored version. Same pattern as the rest of the Memory Engine — local fallback always works, AI enriches when available.

### 3. Month-Close Affirmation (extends `MonthlyPulseWidget`, doesn't replace it)

The existing 12-message table in `MonthlyPulseWidget.tsx` is well-built and should not be rewritten — it is the spine. What's missing is *evidence* attached to the affirmation. Currently the widget says "Six months. The journey is half-declared." with nothing beneath it but "6 / 12 months." Pair each milestone message with one concrete, real number pulled from that user's own logs — same numbers already computed elsewhere in the codebase (`answerCount`, `noteCount`, `streak`, `patternStrengthIndex` — see the `psychologicalProfile` shape in `public-api.ts`):

```
Month 6:
Six months. The journey is half-declared.
6 / 12 months
142 answers · 38-day streak · Consistency dimension: 68%
```

No new computation — these fields already exist on `me`/`psychologicalProfile`. The affirmation stays untouched (the style guide's "no superlatives" rule is already respected); what changes is that the number underneath makes the affirmation *provable*, not just poetic.

---

## The 12-Month Table

Each row: the tenure milestone (existing `MonthlyPulseWidget` copy, unchanged), the mastery milestones that land near it *for an engaged, daily-active user* (streak badges, evolution chapters, layout density), and the UI-visible consequence.

| Month | Tenure milestone (existing copy) | Mastery landmark (~daily engagement) | UI consequence |
|---|---|---|---|
| **1** | *"The first month. The system is beginning to know you."* | Day 7: `∘` Droplet badge (common). Day 30: `≈` Wave / Structure badge (uncommon). Archetype activates at 3+ answers. | Layout: **breathable** (`gap-y-24`). Widget stack: Core only (Time, Memory, Planner, Recipe). First badge appears in trait list. Psychological Profile section on public profile goes from empty to populated. |
| **2** | *"Two months in. Patterns are starting to form."* | Day 60: `≈≈` Dual Wave / Master Frame (rare). Pattern Insights Widget begins surfacing cohort matches. | Community stack unlocks feel: Chat Catalyst, Cohort Connect become relevant (cohort classification runs weekly, needs weeks of signal). `customThemes` unlock likely (level ≥ 5). |
| **3** | *"Three months. You have reached Active User status."* | Day 90: `≋∘` Deep Reach / Inner Wall (**epic**). Evolution chapter 2 likely crossed (level ≥ 10): *"Awakening begins. You notice yourself."* | Layout may shift to **comfortable**. `widgetArrange` unlock (level ≥ 10) — user can now rearrange their own dashboard. First epic-tier badge is a genuine visual step change from common/uncommon. |
| **4** | *"Four months. The portrait deepens."* | Day 100: `≋` Current / Architecture (epic). `patternInsights` unlock likely (consistency ≥ 0.66). | Memory Story (lifetime) crosses the composeLocalStory 10-answer threshold comfortably — closing register shifts from *"the portrait has begun"* to *"the portrait is taking shape."* |
| **5** | *"Five months. Consistency is its own reward."* | Consistency-track badges (Word Turns, Behavioral tier) accumulate. | Density likely **compact**. Badge list on public profile now has real breadth across categories, not just streak tier. |
| **6** | *"Six months. The journey is half-declared."* | Day 180: `≋≋` Voyager / Wing (**legendary**). Evolution chapter 3 likely (level ≥ 30): *"Integration flows. Meaning weaves through everything."* | Half-term. First legendary badge. `narrativeReflection` unlock (depth ≥ 0.66 AND level ≥ 30) — the Narrative Widget's RPG-style arc becomes available. This is the emotional midpoint: tenure says "half," mastery just handed a legendary badge in the same window. |
| **7** | *"Seven months in. The system has been listening."* | `exportData` unlock territory (level ≥ 25, likely already crossed). | Story export becomes a real, felt capability — "the system has been listening" is now literally provable by exporting the accumulated log. |
| **8** | *"Eight months. Rare air."* | Density likely **dense** (`visualRefinement` ≥ 0.55). | Interface itself visibly tightens — more information per screen, less whitespace. The UI is rewarding fluency, not just adding content. |
| **9** | *"Nine months. The self-care practice is a habit now."* | Approaching day-270 territory; streak badge tiers (if unbroken) are now the exception, not the milestone — habit has outpaced gamification. | Design should *quiet down* here deliberately — fewer badge toasts, more ambient confirmation (Ambient AI™ principle: *"healing that the user does not notice happening"*). |
| **10** | *"Ten months. Almost there."* | Evolution chapter 4 territory (level ≥ 60): *"Mastery unfolds. You architect your becoming."* | Density likely **instrument** grade — "Bloomberg-grade" per `interfaceEvolution.ts`. The dashboard now looks meaningfully different from Month 1's breathable single-column layout. |
| **11** | *"Eleven months. One more."* | — | Deliberately the quietest month in the table. No new unlock proposed. Anticipation, not another feature. |
| **12** | *"One year with LOT. The portrait is complete — and still evolving."* | Day 365: `≋≋≋` The Long Count / Citadel (legendary). | **Months Unlocked: 12/12 — term complete.** Monthly Memory Digest for month 12 becomes a *year-close* variant (see below). This is the moment the Machiavelli-style profile fields (Board Profile, Correlated Indexes, Psychological Profile with full trait breadth) stop being aspirational and start looking like the demo account's shape. |

---

## Month 12 → Month 13: The Threshold, Not the Ceiling

The existing Month 12 copy already gets this right — *"the portrait is complete — and still evolving"* — but the UI has nothing today that acts on the second half of that sentence. Proposal: the Month-Close Affirmation for month 12 is structurally different from months 1–11. Instead of the usual milestone + digest pairing, it presents a **year-close compression** — a longer-form version of `composeLocalStory()` run across the full 12 months, genuinely closer in shape to the Machiavelli demo's `memoryStory` field (a dense, first-person-adjacent paragraph, not a bulleted Q&A list) — followed by the two paths forward that already exist as real tiers in `UserTag`:

```
One year with LOT.

[Year-close compressed story — the full 12-month composeLocalStory pass]

Your Usership term is complete. Two paths from here:
  → Renew Usership — another 12 months, same system, more signal.
  → Legacy — the tier the fully-evolved reference accounts run on.
```

This is the only point in the arc where the document proposes touching pricing/tier UI, and only because the infrastructure already exists (`UserTag.Legacy`, the Legacy-gated fields in `PublicProfile.tsx` — `weatherStation`, `wallet` — are already coded and only shown when `profile.weatherStation`/`profile.wallet` are present). The 12-month arc's job is to make that choice feel earned, not to build the Legacy tier itself.

---

## Badge Gap Worth Naming

The research pass into `badges.ts` and the v25 codex found **no badge keyed to Usership tenure specifically** — the 595 badges are streak-days, calendar easter eggs, word-count, behavioral, and account-age (3/4/5/7/10 years), but nothing says "completed month 6 of your Usership term" the way `MonthlyPulseWidget`'s copy does. A clean 12-entry badge cluster — `usership_month_1` through `usership_month_12`, or a single evolving symbol that fills in like the water-tier glyphs (`∘ → ≈ → ≋`) but keyed to Usership-month instead of day-streak — would let the Tenure track register in the badge list itself, not just in the one dismissible widget. This is a gap, not a build instruction; flagging it for the badge codex's next revision.

---

## What Deliberately Does Not Change

Per the style guide (`LOT-STYLE-GUIDE.md`): no superlatives, no exclamation points, no checkmark-and-confetti completion states, no leaderboards. The style guide's line — *"No gamification: No points, badges, or leaderboards"* — sits oddly next to a 595-badge system that demonstrably exists, and this document does not try to resolve that contradiction. It resolves it operationally instead: badges in this system read as **quiet evidence**, not as scoreboard pressure — Level shown as a single glyph (`∘`/`≈`/`≋`) in a profile field, not a progress bar with a leaderboard rank. The 12-month evolution should keep that register. The Months Unlocked chip, the Monthly Digest, and the Month-Close Affirmation are all designed to sit at `opacity-40`–`opacity-60`, non-modal, dismissible or ambient — never a popup demanding acknowledgment beyond the existing `MonthlyPulseWidget` tap-to-dismiss pattern already shipped.

---

## Appendix: Existing Systems This Design Reuses (No New Infrastructure)

| System | File | What it already provides |
|---|---|---|
| Tenure milestone messaging | `src/client/components/MonthlyPulseWidget.tsx` | 12-message table, month calculation, dismiss/fade pattern |
| Story compression | `src/server/utils/memory.ts` (`composeLocalStory`) | Theme detection, answer-count-scaled closing lines, zero-network local fallback |
| Mastery — streak badges | `src/client/utils/badges.ts` | 7/14/21/30/50/60/90/100/180/365-day tiers, dual water/architecture theming |
| Mastery — evolution dimensions | `src/client/stores/evolution.ts`, `interfaceEvolution.ts` | 7-dimension scoring, `$featureUnlocks`, chapter narrative, layout density |
| Mastery — module assembly | `src/client/stores/selfAssembly.ts` | 18 modules × 5 phases, density/coherence-derived phase transitions |
| Legacy-tier destination shape | `src/server/routes/public-api.ts` (`machiavelli` block), `PublicProfile.tsx` | Board Profile, Correlated Indexes, Weather Station, Wallet — the visual target past month 12 |

No new AI provider calls, no new database tables — `logs` already carries everything needed (`answer`, `note`, `emotional_checkin`, `quantum_intent_signal`) filtered by month. The 12-month arc is a presentation layer over signal that is already being recorded.

---

*The system does not perform the evolution. It reveals one that was already happening.*

---

AUTHORED BY: Claude (session) · REQUESTED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | 2026-07-16
