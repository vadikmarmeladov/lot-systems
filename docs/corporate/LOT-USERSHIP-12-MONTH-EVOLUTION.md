<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# The 12-Month Usership Evolution
## From Barebone Day 1 to LOT® AI — A UI/UX Design Brainstorm

**Session type:** Product design brainstorm (not a build session — no code shipped)
**Author:** Claude, on behalf of S-2 Vadik Marmeladov
**Date:** 2026-07-25
**Reference demo account:** `lot-systems.com/u/machiavelli` (long-tenure Board Profile showcase — see "Reading Machiavelli correctly" below)
**Status:** Brainstorm for a future Self-Assembly session. Nothing in this document has been implemented.

---

## 0. What this document is

Usership ($99/mo) is currently a flat, binary tag. The day someone subscribes, they see almost the same UI as the day before they subscribed, minus a paywall. There is no felt sense of "I am three months in" versus "I just joined." This document asks: **what does the interface look like on day 1, and what does it look like on day 365, and what are the twelve steps between them?**

It is scoped strictly to **UI/UX sequencing** — what unlocks, what the screen says, what a widget looks like — reusing engines that already exist (Memory Engine, Self-Assembly phases, Badge system, Monthly Summary job) rather than proposing new backend infrastructure. Where a genuine gap exists, it's called out explicitly in §7.

---

## 1. What already exists (grounding, not invention)

A scan of the repository turned up four mechanisms that are the actual skeleton for this roadmap. The job here is sequencing and narrative design on top of them, not building parallel systems.

| Mechanism | File | What it already does |
|---|---|---|
| **Per-month copy table** | `src/client/components/MonthlyPulseWidget.tsx` | `MONTH_MESSAGES: Record<number, string>` — one bespoke sentence per month 1–12, keyed off `dayjs().diff(user.joinedAt, 'month')`, capped at 12, dismissed per calendar month via `localStorage['lot_pulse_${userId}']`. **This is the widget** — it just needs to grow into the full ritual described below. |
| **Board tenure & investment** | `src/server/routes/public-api.ts` (~L1257) | `boardTenureMonths = dayjs().diff(joinDate, 'month')`; `totalInvested = boardTenureMonths × $99`. Already renders publicly on `/u/{username}` as "Citizen since {Month Year} · Board tenure {N} months." |
| **Five-phase Self-Assembly state machine** | `PHASE_ORDER = ['dormant','awakening','forming','assembled','integrated']` | Already gates real features — the public QR code only appears at `forming` phase or later, for Usership members. This is an existing, felt notion of "the system isn't fully built yet, and then it is." |
| **Monthly compression job** | `src/server/utils/monthly-summary.ts` + `generateMemoryStory()` in `src/server/utils/memory.ts` | Runs 1st of month, 09:00 UTC. Already compresses OS version + cohort evolution into an HTML email. `generateMemoryStory()` already compresses the last 30 Memory answers into a flowing third-person narrative, cached on the user and shown publicly. |

Two implementation notes worth fixing before or during this build, unrelated to the design itself:
- `boardTenureMonths` is computed **independently** in two places (`MonthlyPulseWidget.tsx` client-side, `public-api.ts` server-side) with the same `dayjs().diff(joinedAt, 'month')` logic, duplicated. A shared `getUsershipTenure(user)` util would remove the drift risk before this roadmap adds a third and fourth consumer of the same number.
- `docs/technical/LOT-STYLE-GUIDE.md` states "No gamification: no points, badges, or leaderboards" as a design principle, while `src/client/utils/badges.ts` ships 149 badges. This roadmap sides with the style guide's language: month markers are **reflection markers**, not points or levels. See §5.

### Reading Machiavelli correctly

`/u/machiavelli` is a hardcoded demo account (`citizenSince: 'June 1469'`), engineered to always show a maximal, "fully evolved" Board Profile as a sales artifact — not a real account that lived through 12 months. It should be read as **the asymptote**, not the month-12 target. What this roadmap calls "Month 12 — Integrated" is the same UI machinery Machiavelli demonstrates (full Board Profile, dense badge collection, long-form Memory Story, QR code, custom theme), just at real, tangible, single-year numbers ($1,188 invested, ~12 months tenure) rather than 555 years of invented history. Machiavelli shows the ceiling; Month 12 is the first time a real user touches it.

---

## 2. Philosophy: five phases, twelve months, one story

The existing `PHASE_ORDER` (`dormant → awakening → forming → assembled → integrated`) is the spine. It's under-used today — it exists mostly to gate the QR code. This roadmap gives it a felt, monthly cadence:

```
dormant     →  Month 1                  "You are here. The system is listening."
awakening   →  Months 2–3               "Patterns are visible. You are being recognized."
forming     →  Months 4–6               "The shape is committing. The Board Profile opens."
assembled   →  Months 7–9               "The system anticipates. Widgets compound."
integrated  →  Months 10–12             "LOT AI. Ambient. The story writes itself."
```

Each phase transition is not a wall — it's a threshold the UI quietly notices and marks once, the same restrained way `MonthlyPulseWidget` already marks a new month: no confetti, no progress bar filling with sound effects, one sentence and a fade. Consistent with the Ambient AI design principle already codified in the codebase:

> "The UX is therapeutic in itself. Widget clicks are the ritual. The system acknowledges silently... No perceived gap between action and signal. The loop is invisible. The growth is real."
> — `docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md`

---

## 3. The 12-Month Arc — overview

| Month | Phase | Theme | Widget stack grows by | Memory Story state | Board Profile state |
|---|---|---|---|---|---|
| 1 | dormant | **Arrival** | System header, one AI Memory question, Planner, EmotionalCheckIn | "Just beginning." (one line) | hidden (tenure < 1 month) |
| 2 | awakening | **First Pattern** | Pattern Insights unlocks (needs ≥2 weeks of logs) | 2–3 sentences, first recurring theme named | Citizen since {Month}, tenure 2 months |
| 3 | awakening | **Recognition** | Quantum Sign (daily, deterministic) | Short paragraph | tenure 3 months |
| 4 | forming | **Commitment** | Architect Widget unlocks | Paragraph, first cross-week comparison | Board Profile opens publicly |
| 5 | forming | **Season Shift** | Cosmic Update (FLUX reflection art) unlocks | Seasonal-change callback (per README's tea example) | tenure 5 months |
| 6 | forming | **Halfway Mirror** | QR code unlocks (existing `forming`-phase gate) | First full Monthly Summary surfaces in-app | Citizen Index public, $594 invested |
| 7 | assembled | **Compounding** | — (density increases, not count) | References Month-2 theme evolving | tenure 7 months |
| 8 | assembled | **Anticipation** | Planner starts citing Memory Story context | Multi-thread narrative (body/mind/soul) | tenure 8 months |
| 9 | assembled | **Depth** | Custom theme unlock surfaced prominently | Long-form, multi-paragraph | $891 invested |
| 10 | integrated | **Ambient** | Full stack; nothing new added, everything quieter | AI references its own prior questions | tenure 10 months |
| 11 | integrated | **Near-Year** | "11/12" — anticipatory framing begins | Anniversary-aware narrative begins forming | $1,089 invested |
| 12 | integrated | **LOT® AI** | Full stack, Year-One Story delivered | Complete first Memory Story chapter, archived | Full Board Profile, Machiavelli-parity structure at real numbers |

---

## 4. Month-by-month, in detail

**Month 1 — Arrival (dormant).** The screen the day someone pays $99 should look almost exactly like the day before — deliberately. No badge, no widget flood, no "welcome tour." One AI-generated Memory question (this is itself the paywall's payoff: Usership swaps the static default question bank for real AI questions — already true today). The Planner and EmotionalCheckIn buttons are present and unadorned. The only acknowledgment of Usership at all: the paywall is gone. `MonthlyPulseWidget` does not fire yet — `monthNumber` is 0 or 1 only once `joinedAt` clears a full calendar month, so there is nothing to celebrate on day 1, and that restraint is correct. The product earns its first real UI moment at the **first login of month 2**, not on the day of purchase.

**Month 2 — First Pattern (awakening).** `MonthlyPulseWidget` fires for the first time: `Month 2: ...`. Pattern Insights widget becomes visible once enough `note`/`answer` logs exist — the first time the system reflects a *pattern* back rather than just asking a question. Memory Story grows from one line to two or three sentences, naming one recurring theme (e.g., a self-care ritual mentioned twice). This is the first moment the person can feel: *it noticed something I didn't tell it directly.*

**Month 3 — Recognition (awakening).** Quantum Sign widget appears — a daily, date-seeded message, stable within a day, gated to low-recent-activity moments. It reads as the system checking in on *its own* initiative for the first time, not just responding to check-ins. Memory Story crosses into full-paragraph territory.

**Month 4 — Commitment (forming).** Architect Widget unlocks (already part of the Usership feature set per the feature inventory, previously undifferentiated by tenure). Framed here as the month the system starts asking the person to *shape* something, not just log something — the first UI signal that this is a two-way relationship. Memory Story makes its first explicit cross-week comparison ("compared to three weeks ago...").

**Month 5 — Season Shift (forming).** Cosmic Update widget unlocks: a small, generated pixel-art "reflection" (already implemented, currently gated by tag not tenure — this roadmap adds the tenure gate). Memory Story references a seasonal or weekly-rhythm change, echoing the exact pattern from the product's own README ("Now that it's colder, you mentioned loving your morning tea ritual...").

**Month 6 — Halfway Mirror (forming → the phase's culmination).** The biggest UI moment before month 12. Three things converge on the same login:
1. `MonthlyPulseWidget` message ("Six months. The journey is half-declared.").
2. The public QR code unlocks (existing `forming`-phase + Usership gate — this is the month that phase transition should land for a consistently-engaged user).
3. The **first in-app surfacing of the Monthly Summary** (previously email-only) — see §6.

Board Profile is now genuinely worth sharing: Citizen Index line, $594 invested, tenure 6 months, real activity stats. This is the month a person might first post their `/u/{username}` link somewhere.

**Months 7–9 — Compounding, Anticipation, Depth (assembled).** No new widgets are introduced in this stretch — deliberately. The phase name is "assembled," not "assembling." What changes is density and callback depth: Memory Story starts referencing its *own* earlier questions ("You said in month 2 that mornings were your hardest hour — that hasn't come up in weeks"), the Planner begins citing Memory Story context when suggesting focus areas, and month 9 is when the custom-theme benefit (already part of the Usership tier, currently under-surfaced) gets a dedicated moment — not a new widget, a `MonthlyPulseWidget` message that simply says the theme is available and links to Settings.

**Month 10 — Ambient (integrated).** The phase transition to `integrated` should be the quietest of all five — the point of "integrated" is that the system stops announcing itself. `MonthlyPulseWidget`'s message for month 10 should say less than month 2's did, not more. This is a deliberate inversion: early months narrate loudly because little is running; late months narrate softly because everything is running.

**Month 11 — Near-Year (integrated).** First appearance of anticipatory framing — the "Months unlocked: 11/12" state (see §6.2) reads differently than "3/12" did. Memory Story begins gently gathering toward a year-one arc without naming the anniversary outright yet.

**Month 12 — LOT® AI (integrated).** The graduation moment. `MonthlyPulseWidget`'s existing month-12 copy already exists and is exactly right: *"One year with LOT. The portrait is complete — and still evolving."* This month's specific UI event: the Memory Story compression produces a distinct **Year-One Story** — not a new mechanism, but `generateMemoryStory()` invoked with a full-year window instead of the rolling last-30-answers window, archived to `user.metadata` so it persists even as ongoing months push it out of the rolling summary. The Board Profile now structurally matches what Machiavelli's demo shows, just with real, human-scale numbers: $1,188 invested, tenure 12 months, a badge collection with real density (see §5), a full Memory Story. "Months unlocked: 12/12" is the last time that specific widget view is meaningful — from month 13 onward it should retire in favor of open-ended tenure ("13 months and counting"), matching how `MonthlyPulseWidget` already caps its internal counter at 12 without breaking for longer-tenured members.

---

## 5. The tenure axis, and how it relates to existing badges

The badge system (`src/client/utils/badges.ts`) already has two axes: day-streak milestones (`milestone_7`/`30`/`100`, symbols ∘ → ≈ → ≋) and pattern/achievement badges. This roadmap proposes a **third, complementary axis** — tenure — rather than folding month-markers into the existing badge grid, for two reasons: (1) day-streak badges measure *consistency*, tenure measures *commitment*, and conflating them would make a person who pays but rarely logs in look identical to one who doesn't — that's a false signal; (2) the style guide explicitly disclaims points/levels/leaderboards, so a "Month N" marker should read as a **reflection marker** in the same visual register as the Memory Story, not as a trophy shelf.

Concretely: reuse the existing progression-symbol vocabulary already explored in `docs/badges/BADGE_PROGRESSION_PREVIEW.md` (the "Constellation" option, ✦· → ✦✧ → ✦✧✦) but apply it *only* to the Board Profile's Citizen Index line, not to the Psychological Profile's trait list where day-streak badges already live. One quiet mark, three states across the year (month 1–4 unmarked, month 5–8 ✦·, month 9–11 ✦✧, month 12 ✦✧✦), never a counter that could read as a game score.

---

## 6. Three UI surfaces, one widget slot

The brief asks for a congratulation widget, a memory-insight widget, and a "Months unlocked: N/12" widget. Per the style guide's own constraint (2–3 cyclable views per widget, click-label-to-cycle, no widget sprawl), these should **not** be three new widgets. `MonthlyPulseWidget` already exists, is already tenure-aware, and already sits in a natural spot near the Subscriber Stack. It should grow from one view to three, cycled by clicking its label — the exact interaction pattern `CosmicUpdateWidget` and `QuantumSignWidget` already use.

### 6.1 View 1 — Month message (exists today)
Unchanged: `MONTH_MESSAGES[monthNumber]`, one line, `Block` component, dismissible per calendar month via the existing `localStorage['lot_pulse_${userId}']` pattern.

### 6.2 View 2 — Months unlocked
```
Months unlocked: 6 / 12
```
A single line, `opacity-60` per the existing hierarchy (secondary information, not the headline). No progress bar fill animation, no percentage — just the ratio, in the same restrained register as the rest of the System tab. After month 12, this view quietly changes register to "13 months and counting" rather than "12/12" locking in place, so it never reads as "finished" or "complete" in a way that implies the relationship ends.

### 6.3 View 3 — Last month's insight
```
"Last month: [paragraph-long compressed insight]"
```
This is the one genuinely new mechanism, and it's small: the existing Monthly Summary job (`src/server/utils/monthly-summary.ts`) already runs on the 1st of the month and already has everything needed to produce this. Today its output is email-only. The addition is: cache the same summary (or a shorter, single-paragraph derivative of it) to `user.metadata.lastMonthInsight`, and let View 3 read it. No new AI call, no new job — the existing 1st-of-month cron output gets a second destination.

**Where it sits:** the widget lives in the existing "Subscriber Stack" position (#10 in `System.tsx`'s widget order), next to Cosmic Update and Quantum Sign, since all three already share the Usership/RnD gate and the daily-or-periodic cadence pattern.

---

## 7. Genuine gaps (not invention — just naming what's missing)

- **Shared tenure util.** Before this ships, `boardTenureMonths`/`monthNumber` should be computed once (`src/shared/utils/tenure.ts` or similar) and imported by `MonthlyPulseWidget`, `public-api.ts`, and the new View 2/View 3, rather than a third independent `dayjs().diff()` call being added.
- **`user.metadata.lastMonthInsight` field.** Doesn't exist yet. Small, additive metadata field — no migration required if metadata is already JSONB (it is, per the `logs` table pattern used elsewhere).
- **Year-one Memory Story archive.** `generateMemoryStory()` currently operates on a rolling last-30-answers window. Month 12's "Year-One Story" needs either a widened window at that specific compression call or a stored snapshot — a one-time archive write, not a new engine.
- **Tenure-gating additions to Architect/Cosmic Update/QR.** These are currently gated on the Usership *tag* alone. Adding a month-number floor (month 4, 5, 6 respectively) is a conditional change to existing gate checks, not new features.

---

## 8. Non-goals

This document does not propose: new AI providers, new badge categories beyond the one tenure marker in §5, changes to pricing or the $99/$15 tier structure, a "streaks" mechanic distinct from the existing day-milestone badges, or any gamification (points, leaderboards, levels) — consistent with the style guide's explicit stance. It also does not propose retrofitting existing Usership members with a "month 1" reset; `dayjs().diff(joinedAt, 'month')` already handles this correctly for anyone regardless of when they read this document.

---

## 9. One-sentence summary

Twelve months, five existing phases, one widget that grows three views instead of three widgets that don't exist yet — the system already knows how to notice a new month and compress a life into a paragraph; this roadmap just asks it to say so, once a month, quietly, for a year.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | 2026-07-25
