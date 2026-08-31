<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® AI — THE 12-MONTH USERSHIP EVOLUTION
## From Barebones Day 1 to a Fully-Assembled Personal OS

**Document:** LOT-USERSHIP-12-MONTH-EVOLUTION-UX
**Author:** Vadik Marmeladov, CEO & Founder, LOT Systems (brainstorm authored by Claude Code, S-2 session)
**Date:** 2026-08-31
**Status:** Design brainstorm — not yet implemented. No code changed in this session.
**Reference account:** `lot-systems.com/u/machiavelli` (cited by S-2 as the "fully evolved" Usership example — not reachable from this session's network egress, so this brief reasons from the shipped evolution/badge/widget architecture already in the repo rather than a live screenshot).

---

## 0. The Ask, Restated

Day 1 of paid Usership looks almost the same as Day 1 of free. That's correct — a stranger shouldn't get a cockpit. But nothing today tells the person *this will become something else if you stay*. The system already contains everything needed to make that promise real — it just isn't wired to the calendar yet. This document is the wiring diagram: what changes, month by month, and why each change is felt rather than announced.

The one constraint repeated three times in the brief is the design center of gravity: **the compressed Memory Story is the thing that must feel tangibly different every month.** Everything else (density, badges, widgets) is scaffolding around that one deliverable.

---

## 1. What Already Exists (do not rebuild — extend)

A brainstorm that ignores the shipped substrate produces a parallel system nobody maintains. Four pieces of existing architecture already do 80% of this job:

| System | File | What it already does | The gap |
|---|---|---|---|
| **Interface Evolution Engine** | `src/client/utils/interfaceEvolution.ts` | 7-dimension `EvolutionState` (exploration, consistency, depth, connection, intimacy, care, courage) → `LayoutDensityLevel` (`breathable → comfortable → compact → dense → instrument`) + `FeatureUnlocks` flags, driven by `visualRefinement` / `overallMaturity` | Gated purely by **behavior**, never by **tenure**. A power user could hit `instrument` density in week 2. Month 1 needs a density *ceiling* regardless of activity. |
| **Monthly Pulse Widget** | `src/client/components/MonthlyPulseWidget.tsx` | Already computes `monthNumber` from `user.joinedAt`, gates on `UserTag.Usership`, shows one static line per month 1–12, shows `X / 12 months`, dismiss-once-per-month via localStorage | The 12 lines are **hardcoded strings** (`MONTH_MESSAGES`) — the same sentence for every Usership member. No connection to *this specific person's* logs. This is the single biggest gap between what exists and what was asked for. |
| **Memory Engine / Compression Loop** | `src/server/utils/memory.ts`, `docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md` | `buildPrompt()` already reads every log type (answers, notes, mood, plans, patterns) into one context object per question | Only used to generate the *next question*. Never used to generate a *retrospective paragraph*. |
| **Weekly Story-Report** | `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` §"The Weekly Story-Report" | `GET /api/story/latest`, `GET /api/story/:week_id` — a compressed first-person narrative of the week, in the user's own behavioral voice | Stops at the week. There is no monthly or yearly rollup, and it isn't surfaced inside a widget on `System.tsx` today — only described as an export target for Robot/Vehicle/Dashboard. |
| **Badge Codex** | `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`, `src/client/utils/badges.ts` | 812 badges across 8 categories, rarity tiers common → mythic/cosmic, milestone badges keyed to day-counts | Milestone thresholds are day-based (30/60/90/180/365-ish), not calendar-month-based, so they drift out of sync with the clean "Month N" story beat. |

**Design principle for this brief: reuse the vocabulary that already shipped.** `MonthlyPulseWidget`'s 12 lines ("Rare air." for month 8, "The portrait is complete — and still evolving." for month 12) are good copy — keep them as the *headline* per month, and build the tangible substance underneath each one instead of replacing them.

---

## 2. The Core Mechanic: Monthly Story Digest

This is the answer to the brief's central ask. One new primitive, three new surfaces.

### 2.1 The primitive: `MonthlyStoryDigest`

Extend the Weekly Story-Report pattern one level up. At month-rollover (cron, same family as the existing Monthly Email Sender job at `09:00 UTC, 1st` mentioned in `docs/technical/WIDGETS.md`):

1. Pull every log from the closed month (`answer`, `note`, `emotional_checkin`, `plan_set`, `quantum_intent_signal`, `self_care_complete/skip`) — same source `buildPrompt()` already reads.
2. Run one compression pass through the AI engine chain (Together → Gemini → Mistral → Claude → OpenAI, same fallback order as `memory.ts`), producing **one paragraph** (120–180 words), first-person-observational, in the tone the codex already uses ("You. Not data about you.").
3. Persist it — new table or JSONB column, e.g. `monthly_digests(userId, monthNumber, year, text, createdAt)` — once generated, it never regenerates. This is a permanent chapter, not a live query.
4. Chain it: month N's digest prompt includes month N−1's digest as compressed context, so the story visibly *builds* rather than resets each month (this is the same recursive compression the Memory Engine already does at question-level, just one octave up).

This is the tangible thing. Not a badge, not a density change — an actual paragraph, in the system's voice, about *this person's* actual month, that did not exist the month before and will never be regenerated or overwritten.

### 2.2 Surface 1 — `MonthlyPulseWidget`, upgraded

Keep the existing dismiss-once ritual and fade animation. Replace the static `MONTH_MESSAGES[monthNumber]` body with:

```
[Existing headline, e.g. "Rare air."]          ← unchanged, from MONTH_MESSAGES
[monthlyDigest.text]                            ← NEW: the compressed paragraph
8 / 12 months                                   ← unchanged counter
```

Fallback: if the digest hasn't generated yet (rollover job hasn't run, or user is mid-month), show the existing static line only — never block on generation, never show a loading spinner in what is designed to feel like an ambient, already-arrived message.

### 2.3 Surface 2 — "Months Unlocked" widget (new, small, persistent)

A compact, always-on status chip — closer to `Growth Milestones` in weight than to `MonthlyPulseWidget`'s one-time toast. Sits in the Stats stack or Header area.

```
Months unlocked: 3 / 12
[███░░░░░░░░░]
Next: Month 4 — 12 days
```

- No dismiss — this is a persistent thermometer, not an event.
- Clicking it opens a scrollable **Memory Story archive**: every past month's digest paragraph in order, oldest first, read like a table of contents to a book being written about you. This becomes the tangible artifact users would screenshot and keep.
- Visible only to `UserTag.Usership` (same gate as `MonthlyPulseWidget`, `CosmicUpdateWidget`, `QuantumSignWidget` today).

### 2.4 Surface 3 — Year Story (Month 12 capstone)

At month 12 the digest generation gets one extra step: a synthesis pass over all 12 monthly digests → a single ~400-word "Year One" narrative. This is the payoff moment:

- A dedicated, non-auto-dismissing overlay (longer-lived than `EvolutionMilestoneToast`'s 6s) — the one moment in the whole year the system asks the user to *stay* rather than glance and move on.
- Offered as the default `memoryStory` field on the Public Profile (`PublicProfile.tsx`, already supports a `memoryStory` string, already privacy-toggleable via `showMemoryStory`) — one click to publish "my first year" to `lot-systems.com/u/<handle>`. This is likely close to what the `machiavelli` reference account is actually showing.
- Pairs with a `LEGENDARY`-tier badge, e.g. `year_one_complete` (fits cleanly into the existing Mastery Tier category in the Badge Codex, alongside `saga_age` at the 5-year end of the same spectrum).

---

## 3. The 12-Month Structure

Each month is one row of a coherent system, not twelve unrelated ideas. Four layers move together every month: what the interface *looks* like (density), what it *can do* (feature unlocks), what's *earned* (badges), and what's *said* (the digest + the existing pulse headline). Layout density is tenure-gated with a floor here — activity can pull a user forward within a month, but tenure sets the earliest a stage can appear, so month 1 never looks like month 8 no matter how hard someone uses it on day 3.

| Month | Pulse headline (existing) | Density floor | Feature unlocks (new, gated) | Badge beat | Digest character |
|---|---|---|---|---|---|
| **1** | "The system is beginning to know you." | `breathable` | Base widget stack only. No Subscriber Stack extras beyond Usership gate itself. | First milestone badge (existing day-based, e.g. week-1 tier) | Descriptive: what was *noticed* — first patterns named, tentative |
| **2** | "Patterns are starting to form." | `breathable` | — | — | First callback: "since [thing from month 1]..." — proof the system didn't forget |
| **3** | "You have reached Active User status." | `comfortable` | `achievementGallery`, `patternInsights` unlock | Badge: Active User tier | First digest that references a *trend*, not just events |
| **4** | "The portrait deepens." | `comfortable` | `intentionHistory` unlock | — | Portrait language literally — traits, values vocabulary from the badge system starts appearing in-line |
| **5** | "Consistency is its own reward." | `comfortable` | `customThemes` unlock | Behavioral/consistency badge tier | Digest foregrounds streak/rhythm, not novelty |
| **6** | "The journey is half-declared." | `compact` | `moodPatterns`, `widgetArrange` unlock | Halfway badge (new: `half_year_arc`) | First **retrospective**: digest explicitly references month 1 vs. month 6, the arc so far |
| **7** | "The system has been listening." | `compact` | `plannerTemplates` unlock | — | Tone shifts from observational to slightly anticipatory — starts naming what it expects, not just what happened |
| **8** | "Rare air." | `compact` | `narrativeReflection` unlock (AI narrative synthesis, full power) | Rarity-tier badge (few users reach month 8) | Digest gets noticeably sparser and sharper — matches the product-brief principle: *"the questions become fewer and hit harder"* |
| **9** | "The self-care practice is a habit now." | `dense` | `exportData` unlock (own story is exportable) | Habit-formation badge | Digest starts using "you always..." / "you never..." constructions — pattern language, not event language |
| **10** | "Almost there." | `dense` | `badgeSelection`, `socialMentions` unlock | — | Anticipatory framing toward the Year Story |
| **11** | "One more." | `dense` | All remaining flags on | Penultimate badge | Digest explicitly sets up month 12 — "one chapter left" |
| **12** | "One year with LOT. The portrait is complete — and still evolving." | `instrument` | Full unlock; Year Story synthesis triggers | `year_one_complete` (LEGENDARY) | Year Story capstone (§2.4) — synthesis of all 12, offered to Public Profile |

Notes on the table:
- Density floors only ever gate the *minimum* stage for that month — a highly active user can still be pulled toward `dense`/`instrument` earlier by `overallMaturity` from `interfaceEvolution.ts`; tenure just prevents a day-3 power user from seeing `instrument` density, which would read as broken rather than earned.
- Feature-unlock assignments above are illustrative sequencing, not a rewrite of `FeatureUnlocks` — the flags already exist in `interfaceEvolution.ts`; this is a proposal for *when* Usership tenure additionally gates them versus pure activity-maturity.
- Badge names beyond the two called out (`half_year_arc`, `year_one_complete`) are placeholders for the next Badge Codex revision, not commitments — the actual codex is on v32 and iterates fast; whoever implements this should slot them into the existing Mastery Tier / Achievement RPG categories rather than starting a ninth category.

---

## 4. Morning Check-Ins & Self-Care Buttons — the felt cadence

The brief calls these out specifically as one of "the most important evolutionary states." The tangibility isn't in changing *what* the check-in widgets do — `EmotionalCheckIn`, `SelfCareMoments`, `PlannerWidget` stay mechanically the same all 12 months — it's in what surrounds them:

- **Early months (1–3):** broad option sets, generous cooldowns already in place (3h/3-per-day for Self-Care Moments) — nothing changes here. The system is still building vocabulary, so the check-ins should feel like the widest part of the funnel.
- **Middle months (4–8):** the *Contextual Prompts Widget* (already reads mood trend, dormant modules) starts referencing the Memory Story digests directly — a check-in prompt that says "You mentioned this pattern in month 4" rather than a generic time-of-day nudge. This is where compression starts visibly folding back into the daily surface, not just the monthly one.
- **Late months (9–12):** the product brief's own line applies literally — "the questions become fewer and hit harder." Fewer options per Memory question, more direct phrasing, because the model has enough compressed context per `buildPrompt()` to be specific instead of exploratory.

No new widgets needed here — this is a *content* evolution inside `memory.ts`'s existing prompt assembly (`quantumContext + plannerContext + goalContext`), keyed off `monthNumber` the same way `MonthlyPulseWidget` already computes it.

---

## 5. Log & Journal Density as the Evolution Driver

The brief flags "the amount of journal entries and thoughts put into Log" as one of the most important evolutionary states — this is exactly what `interfaceEvolution.ts`'s `depth` dimension and the Badge Codex's word-count badges (`long_quest` at 500+ words, `great_work` at 150,000+ total words) already measure. The recommendation is not a new metric — it's making the *existing* one visible on the same monthly cadence:

- The Monthly Story Digest (§2.1) should open with a compressed *quantity* signal before the qualitative paragraph — e.g., folded into the first sentence rather than a separate stat line, so it reads as narration, not a dashboard: "Forty-one entries this month, more than any before it, and—". This keeps the Log-volume signal inside the story register the brief asks for, rather than turning it into a bare counter.
- This is also the natural gate for the `depth` dimension in `EvolutionState` to accelerate density progression *within* a tenure floor — a user who journals heavily in month 2 should feel the interface respond (more widget density, more feature unlocks) even though the Year Story and `instrument` density stay locked to month 12.

---

## 6. What Not To Do

- **Don't gate the Memory Story digest behind a "generate" button.** The whole design principle across the codebase (`AMBIENT AI™` in the compression-loop doc) is that the system acts first and the user discovers, not requests. The digest should simply be *there* on the 1st, same cadence as the existing Monthly Email Sender job.
- **Don't let density outrun tenure.** An `instrument`-density Day-5 account (technically possible today under pure activity-based `visualRefinement`) breaks the entire promise of this brief — there'd be nothing left to feel in month 8. Tenure floor is the load-bearing rule of this whole design.
- **Don't invent a ninth badge category.** 812 badges across 8 categories is already dense; two or three tenure-anchored badges belong inside Mastery Tier / Achievement RPG, not a parallel "Usership badges" system.
- **Don't overwrite past digests.** Once month N's paragraph is generated and shown, it's permanent — re-running the AI engine on it later (e.g. after a prompt-quality improvement) would falsify the user's own remembered history. Regenerate the *pipeline* going forward; never rewrite a chapter already delivered.

---

## 7. Engineering Handoff Checklist (for whoever implements this next)

- [ ] New table (or JSONB column on `users`) for `monthly_digests`: `userId, monthNumber, year, text, createdAt` — append-only, never updated
- [ ] New server job, same family as Monthly Email Sender (`09:00 UTC, 1st`) — generates prior month's digest for every active Usership user via the existing AI engine fallback chain
- [ ] `memory.ts`: new `buildMonthlyDigestPrompt(user, logsForMonth, previousDigest)` — sibling to `buildPrompt()`, not a modification of it
- [ ] `MonthlyPulseWidget.tsx`: fetch and render `monthlyDigest.text` beneath the existing static headline; graceful fallback to headline-only if digest not yet generated
- [ ] New `MonthsUnlockedWidget.tsx`: persistent progress chip + click-to-expand digest archive, Usership-gated same as `MonthlyPulseWidget`
- [ ] `interfaceEvolution.ts`: add a tenure-based floor function — `getDensityFloor(monthNumber): LayoutDensityLevel` — combined with existing `visualRefinement` via `max()`, not replacing it
- [ ] Badge Codex: add `half_year_arc` (month 6) and `year_one_complete` (month 12, LEGENDARY) to the next revision, Mastery Tier category
- [ ] Month-12 synthesis pass: `buildYearStoryPrompt(user, all12Digests)` → offered as one-click `memoryStory` publish to `PublicProfile.tsx`
- [ ] `GET /api/story/monthly/:monthNumber` and `GET /api/story/year` — sibling endpoints to the existing `/api/story/latest`, `/api/story/:week_id`

---

## 8. Open Questions for S-2

1. Should the density floor be strict (hard-blocks `instrument` until month 12) or soft (month 12 is merely the *earliest guaranteed* month, with an override for extreme early activity)? This brief assumes strict, for narrative integrity.
2. Does `Legacy` tag (referenced in `CosmicUpdateWidget` alongside Usership/R&D) inherit or reset the 12-month clock on renewal past year one? Not addressed here — needs a product decision before Month 13+ is designed.
3. Is the Year Story synthesis (§2.4) meant to be *exportable* (PDF/share card) in addition to the Public Profile publish flow? The brief's "tangibility" language suggests users may want something to hold, not just view.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | 2026-08-31
