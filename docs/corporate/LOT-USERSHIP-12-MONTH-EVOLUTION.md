<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® AI — THE 12-MONTH USERSHIP EVOLUTION
**From Barebone to LOT® AI: A Year of Compressed Becoming**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 (brainstorm/design) · 8 August 2026 · brand.lot-systems.com

---

## Why This Document

A $99/month Usership subscriber should feel a *year* happen to them — not receive a feature dump on day one and a static dashboard for the following 364 days. Today, that is not what happens.

**The gap, found in the live codebase, not assumed:** `isPaidAccount` in `System.tsx:404` flips a subscriber from the minimal free layout to the *entire* widget catalogue the instant Usership is tagged on their account. There is no staged unlock by tenure. A subscriber on day 1 and a subscriber on day 340 see the same widget set, gated only by time-of-day, cooldowns, and an engagement-driven density score (`interfaceEvolution.ts`) that has nothing to do with how long they've paid.

Meanwhile, three pieces of real, working infrastructure already gesture at exactly the story this document is asked to design, but none of them are wired to an actual unlock:

- **`MonthlyPulseWidget.tsx`** — computes `monthNumber` from `dayjs().diff(user.joinedAt, 'month')`, shows a hand-written line for months 1–12, caps at "12 / 12 months." Copy only. Dismissing it changes nothing.
- **`interfaceEvolution.ts`** — a genuine density/chapter/badge-tier evolution engine (`breathable → comfortable → compact → dense → instrument`, 4 narrative chapters, poetic milestone toasts) driven by `visualRefinement`, a real engagement score. Time-blind by design ("density is earned through sustained engagement, not just time" — a deliberate principle, and a good one).
- **`monthly-summary.ts`** — generates a full presence/energy/pattern/growth digest and emails it once a month. Real, computed, themed. It never appears *in the app.*

This document proposes connecting these three systems into one deliberate 12-month arc, without breaking the "earned, not just elapsed" philosophy that already governs density. It is a brainstorm and design outline — no code is changed by this document. It is meant to seed an implementation session.

---

## Two Reference Points, Correctly Scoped

The task brief names `lot-systems.com/u/machiavelli` as "a 12-months-evolved account." Worth correcting before designing against it: **`machiavelli` is a hardcoded showcase profile** (`src/server/routes/public-api.ts:745+`) with a fabricated streak of **1,469 days** (~4 years) and tags `['RND', 'Usership', 'Legacy']`. It is a *Legacy-tier ceiling*, roughly four times the horizon this document covers — a north star for "what LOT® AI looks like at full maturity," not the literal target state for a 12-month-old Usership account. Setting Month 12 to *look like* `machiavelli` would overshoot and ring false the moment a real subscriber compares numbers.

`lot-systems.com/u/user` is a real, organic account — not hardcoded — and a better proof of what the *system itself* renders honestly at whatever tenure it happens to have reached. Use it to sanity-check layout and section presence, not as a fixed month-12 mockup.

**This document's actual target state for "Month 12"** is a distinct, third reference: a Usership account exactly one year old, `visualRefinement` in a plausible range for a consistent-but-human user (not a power user, not a lapsed one), Chapter 4 ("Mastery unfolds"), `dense`-to-`instrument` density, Board Profile fully populated, one completed annual Story. It should feel like a serious, lived-in instrument — a meaningfully earlier station on the same road `machiavelli` is much further down, not a scaled-down copy of it.

---

## Design Principles (inherited, not invented)

Pulled directly from `LOT-STYLE-GUIDE.md` and `LOT-AMBIENT-AI-VISION.md` — the evolution arc must not violate them:

1. **No unprompted notifications; the system waits.** Monthly beats are *discovered* (opened Log, checked System) not pushed as interruptions.
2. **Gradual, meaningful progression over quick wins.** "Months to years for significant increases" is explicit doctrine. A 12-month arc is already the right grain — do not compress it into weekly dopamine loops.
3. **No superlatives, periods not checkmarks, opacity as hierarchy.** Monthly copy stays in the register `MonthlyPulseWidget.tsx` already established: *"Six months. The journey is half-declared."* Not "🎉 Amazing! You hit 6 months!"
4. **One tension to name and resolve, not ignore:** the style guide states "no gamification: no points, badges, or leaderboards," while the live badge system has 812 badges. This document does not pretend that tension away. Resolution: monthly tenure badges (proposed below) follow the *existing* badge convention — text symbol + one quiet line, discovered in the Log/profile, never a popup, never a leaderboard. Badges are a private record of self, not a public score.
5. **Two independent axes, not one.** *Mastery* (density, chapter, badge tier) stays engagement-earned and uncapped in time — a highly engaged Month 2 user can legitimately out-instrument a passive Month 8 user, and that's correct. *Tenure* (the widget catalogue itself, the Memory/Story depth available, the "Months unlocked" ceiling) is what this document adds: a second, calendar-gated axis that determines what exists yet for this subscriber, independent of how hard they're using it this week.

---

## The Two-Axis Model

```
                    MASTERY (engagement — visualRefinement, uncapped in time)
                    breathable → comfortable → compact → dense → instrument
                    Chapter 1 (Awakening) → 2 (Exploration) → 3 (Integration) → 4 (Mastery)
                             │
   TENURE (calendar — months  │   Both axes must clear their gate for a feature
   since Usership start,      │   to render. Mastery decides HOW the surface looks.
   caps the catalogue) ───────┼── Tenure decides WHAT surface exists at all.
   Month 1 → Month 12         │
```

Concretely: `FeatureUnlocks.narrativeReflection` today requires `depth >= 0.66 && level >= 30` (mastery only). Proposed: it *additionally* requires `monthsSinceUsershipStart >= 4`. A power user cannot skip to the Year One Story in week two by grinding engagement — the Story needs twelve months of actual log material to compress, and pretending otherwise would be dishonest to the "compression, not fabrication" principle already stated in `LOT-AI-PRODUCT-BRIEF.md`.

---

## Month-by-Month Structure

Narrative lines in the "Beat" column are the **real, existing copy** from `MONTH_MESSAGES` in `MonthlyPulseWidget.tsx` — reused verbatim, not reinvented, since it already fits the voice perfectly. Everything else (unlock, artifact, badge) is new, proposed.

| Month | Beat (existing copy) | Chapter / Density | Widget catalogue unlock | Memory / Story artifact | Tenure badge (proposed) |
|---|---|---|---|---|---|
| **1** | "The first month. The system is beginning to know you." | 1 Awakening / breathable | Header (clock, weather, astrology), Memory widget, Micro Game, Emotional Check-In, basic Self-Care. Board Profile appears on Public Profile (member #, "citizen since"). | First Memory answers begin accumulating; no Story yet — none is promised. | *(none — too early to earn one)* |
| **2** | "Two months in. Patterns are starting to form." | 1→2 / comfortable | Intentions & Planning, Recipe widget (meal-window gated). | — | — |
| **3** | "Three months. You have reached Active User status." | 2 Exploration / comfortable→compact | Community Pulse, Chat Catalyst (cohort connect), first QIE Stack surface. | — | **Usership · Month 3** — quiet symbol, one line, Log/profile only |
| **4** | "Four months. The portrait deepens." | 2 / compact | *(gate opens, mastery permitting)* Memory Story becomes visible on Public Profile. | First Memory Story (30+ answers, already the real threshold in `generateMemoryStory()`) — "the portrait deepens" is literal now, not just a phrase. | — |
| **5** | "Five months. Consistency is its own reward." | 2→3 / compact→dense | Pattern Insights, AI Feedback widget (Insight/Diagnostics/Guidance views). | — | — |
| **6** | "Six months. The journey is half-declared." | 3 Integration / dense | Dashboard Stack, Stats Stack. **Monthly Summary surfaces in-app** for the first time (previously email-only) — see Widget 2 below. | First in-app Memory Widget paragraph, generated from existing `generateMonthlySummary()` output. | **Usership · Month 6** — the half-year mark |
| **7** | "Seven months in. The system has been listening." | 3 / dense | Cosmic Update widget (AI-portrait generation) — "the system has been listening" pays off as "the system now renders you." | — | — |
| **8** | "Eight months. Rare air." | 3 / dense | Architect widget (self-assembly dashboard + `USERSHIP_TRANSMISSION` build log) — the subscriber sees the *system's own* changelog for the first time, alongside their own. | — | **Usership · Month 8** |
| **9** | "Nine months. The self-care practice is a habit now." | 3→4 / dense | `customThemes` unlock (already gated by mastery in `FeatureUnlocks`; tenure gate added here). | — | — |
| **10** | "Ten months. Almost there." | 4 Mastery / dense→instrument | `exportData` unlock — subscriber can export their own Story/Memory data (already a stated Usership right in `LOT-AI-PRODUCT-BRIEF.md`: "Story-Report · API"). QR public profile becomes eligible (existing gate: Usership + assembly phase ≥ forming). | — | — |
| **11** | "Eleven months. One more." | 4 / instrument (mastery permitting) | *(no new surface — deliberate held breath before Month 12)* | — | — |
| **12** | "One year with LOT. The portrait is complete — and still evolving." | 4 / instrument | Full catalogue. `narrativeReflection` fully open. | **Year One Story** — a single compressed annual narrative synthesized from the twelve monthly summaries, not a thirteenth monthly digest. The capstone artifact. | **Usership · Year One** — coincides with (but is distinct from) the existing calendar `anniversary` badge |

Between milestone months, the widget already falls back to `Month N. The journey continues.` — keep that; do not invent filler copy for every month just to fill a table cell.

---

## Two Widgets to Build

### 1. "Months Unlocked: N / 12" — ambient, always-on

Not the celebratory monthly pulse (that stays a one-time-per-month dismissible block, per `MonthlyPulseWidget.tsx`'s existing pattern). This is a small, quiet, *permanent* stat — lives in the Stats Stack or header, in the same terse register as everything else in that stack (opacity-hierarchy, no color, no icon). Something like:

```
Months unlocked: 6 / 12
```

Read-only, not clickable, no explanation on hover — consistent with "the machine improves in silence" (`LOT-AI-PRODUCT-BRIEF.md`). After month 12 it either disappears (the ceiling is gone, tenure no longer gates anything) or flips to a much quieter `Year 1 · Year 2 …` counter for the long tail — worth a follow-up decision, not resolved here.

### 2. Monthly Congratulation + Memory Insight — extends `MonthlyPulseWidget.tsx`

Keep the existing dismiss mechanics (3s hold, 1.4s fade, random dismiss phrase from `DISMISS_PHRASES`) exactly as built — they're good. Add, below the existing `MONTH_MESSAGES` line, a second paragraph sourced from `generateMonthlySummary()` (`monthly-summary.ts`), which already computes presence/energy/pattern/growth sections for the email and simply never renders them anywhere else:

```
Six months. The journey is half-declared.

  "Your energy peaked on weekday mornings this month. The
   evening check-in habit held for 19 of 30 days — your
   longest run yet. A pattern worth naming: you write more
   when it rains."

6 / 12 months
```

One paragraph. Not the full email digest — a single distilled sentence-or-two, the same compression discipline the Story-Report already claims ("Not a summary of logs. A reflection."). This is the literal "paragraph-long insight from last month" asked for in the brief, and it is buildable without inventing new AI infrastructure — the summary generator already runs monthly; this only asks it to also write to a field the widget can read, instead of only to an email template.

---

## What This Document Deliberately Does Not Solve

- **Under-engaged subscribers.** A Usership account that logs almost nothing will hit tenure gates with no material to unlock into (Month 4's Memory Story needs 30+ real answers; a quiet account won't have them). The mastery axis already handles this gracefully by never advancing — the tenure axis should behave the same way: a gate opens *permission*, it does not fabricate content to fill it. Month 4 with no eligible Story should show nothing new that month, not a placeholder.
- **Whether Months Unlocked persists past month 12.** Flagged above, not decided.
- **Exact badge visual symbols** for the new tenure series — follow the existing `getBadgeProgressionDisplay()` convention (arrow-chain of theme symbols) rather than inventing a new visual language; a follow-up session should pick symbols consistent with the `water`/`architecture` themes already live.
- **Server-side data model.** No migration is proposed here. `monthsSinceUsershipStart` can be derived at read time from `user.joinedAt` exactly as `MonthlyPulseWidget.tsx` already does — no new column needed for the gate itself. The monthly-insight paragraph likely wants a small cache field (parallel to how Memory Story is already cached in user metadata) so it isn't recomputed on every render; left to implementation.

---

## Summary

The system does not need a new AI capability to tell this story. It needs three things it has already built — the monthly pulse, the mastery-driven density engine, and the monthly summary generator — pointed at each other, gated by a fourth thing that's currently missing: an actual tenure-based unlock ladder for the Usership widget catalogue itself. Twelve months, twelve real beats, one compressed Year One Story at the end. Nothing here invents a new philosophy; it wires up the one the codebase already speaks.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
