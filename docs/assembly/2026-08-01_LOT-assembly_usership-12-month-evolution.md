<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Assembly Run — 2026-08-01
## Usership 12-Month Evolution — Barebones Day 1 → LOT® AI
### Design Brainstorm · S-2 Directed · Not Yet Built

---

**Date:** 2026-08-01
**Session ID:** claude/elegant-mendel-mf9ec6
**Branch:** claude/elegant-mendel-mf9ec6
**Classification:** Product design brainstorm. No code changed in this session — this is the specification for a future assembly run.
**Reference account:** `lot-systems.com/u/machiavelli` — cited throughout as the intended 12-months-evolved state. WebFetch to the live profile returned `403` this session (bot-protected), so machiavelli's *actual* rendered content is not quoted anywhere below — every claim about "the evolved state" is derived from the codebase (`assemblyPhase: integrated`, full `boardProfile`, `hasUsership` gates) and should be checked against the live page before this doc is treated as ground truth.

---

## 0. Sources Read

**Product framing:**
- `README.md` — Memory Engine narrative, QOS modes, philosophy
- `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` — compression loop, weekly story-report, paid tiers
- `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` — 8-source prompt build, story generation
- `docs/technical/INTERFACE_EVOLUTION.md` — 7-dimensional progression, density tiers, feature unlocks
- `docs/technical/WIDGETS.md` — full widget catalogue and gating logic
- `docs/wiki/LOT-WIKI-v82.md` §§9, 12, 17–20, 25 — Memory Engine, Log Event System, Display Architecture (Military Purity Orders), Density Tier System, Cockpit Rule, Recipe Widget as a worked context-engine example
- `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v29.md` — 719-badge system, rarity scale, mastery tier (700-day / 10-year badges)
- `docs/badges/BADGE_LEVEL_DESIGN.md`, `BADGE_PROGRESSION_PREVIEW.md` — symbol progression philosophy, "Level" field precedent
- `docs/assembly/2026-04-26_LOT-assembly_os-journal-readiness.md` — worked example of adding a live-computed row to `SystemProgressWidget.tsx`
- `docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md` — signal → log → Memory Engine pipeline, "every widget click is a signal" doctrine

**Code survey (Explore agent, this session):** `UserTag.Usership` gating, `MonthlyPulseWidget.tsx`, `src/client/utils/interfaceEvolution.ts` + `stores/evolution.ts`, `badges.ts` streak-milestone pattern, `src/server/utils/monthly-summary.ts` + `scheduled-jobs.ts`, `PublicProfile.tsx` / `public-api.ts` board-profile block. Findings are cited by file and line throughout §5–§8.

---

## 1. The Headline Finding

**Three-quarters of this feature already exists. It has just never been assembled into one story.**

| Piece needed | Already built | Where | Gap |
|---|---|---|---|
| Month counter (1–12) | Yes | `MonthlyPulseWidget.tsx:73-79` — `dayjs().diff(joinedAt,'month')`, message table for all 12 months, `N / 12` display | Only a dismissible toast. Doesn't gate anything else. Keyed to `joinedAt`, not to when Usership was purchased. |
| UI density / feature ramp | Yes | `interfaceEvolution.ts` — 5-tier density (`breathable → comfortable → compact → dense → instrument`), `featureUnlockLevel 0-5`, `getFeatureUnlocks()` | Driven entirely by *engagement* (streak/depth/badges), never by *calendar time*. A power user hits "instrument" density in week 3. A quiet Usership subscriber never leaves "breathable" even in month 11. |
| Monthly compressed Memory Story | Yes | `src/server/utils/monthly-summary.ts` — `generateMonthlySummary()` computes presence, energy, patterns, growth, narrative, forward-look for the last complete calendar month, and internally calls `generateMemoryStory()` | **Email-only.** Zero client consumer. No in-app surface reads this at all. |
| Monthly celebration cadence | Yes | `scheduled-jobs.ts` — `executeMonthlyEmailJob`, runs 1st of month, 09:00 UTC | Same as above — lands in an inbox, never in the product. |
| Badge milestone pattern | Yes | `badges.ts:6444-6459` — `streakMilestones` array, cloned pattern ready to reuse | Keyed to consecutive-day streak only. No badge exists for "months as a subscriber." |
| Public-facing tenure signal | Partial | `public-api.ts:1257` — `boardTenureMonths`, feeds `citizenSince` string on the profile | Buried inside a prose join ("Board member #4 since Feb 2026..."). Not a first-class "Months unlocked: X/12" element anywhere, in-app or public. |

The job this document does is **not** invent five new subsystems. It is: fix one data-model gap (§2), and specify how to wire three already-working engines — the month counter, the density/feature ramp, and the monthly compression job — into a single felt arc, with a fourth new piece (month-keyed badges) that's a direct clone of an existing pattern.

---

## 2. Prerequisite — Fix What "Month" Means

`MonthlyPulseWidget.tsx` and `public-api.ts`'s `boardTenureMonths` both compute elapsed time from `user.joinedAt` (account creation). Usership is a tag (`UserTag.Usership`), added to a user's `tags` array at an arbitrary later date — there is no `usershipStartedAt` or `usershipTagAddedAt` field anywhere in the schema (confirmed: no such field in `src/server/models/user.ts`).

This means, as built today: a person who created a free account in 2024 and upgraded to Usership yesterday would see **"Month 24 of 12"** the moment they subscribe. The entire premise of this document — day 1 barebones, month 12 fully evolved — silently breaks for every user who wasn't a Usership subscriber from the literal instant of account creation. Given Usership is a $99/month upsell reached after 10+ Memory answers and a cooldown-gated `SubscribeWidget` prompt (`WIDGETS.md`, Subscribe Widget entry), this is very likely the *majority* case, not an edge case.

**Required before anything below can work correctly:**
1. Add a real timestamp — `usershipStartedAt` (or reuse the tag-write event already logged somewhere in the tag-mutation path, if one exists) — stamped the moment `UserTag.Usership` is added to a user.
2. Every month calculation in this document (`usershipMonthNumber`) must diff against **that** timestamp, never `joinedAt`.
3. `boardTenureMonths` (public-api.ts:1257) and `MonthlyPulseWidget`'s `monthNumber` (MonthlyPulseWidget.tsx:73-79) should both be repointed at the new field once it exists — this is a one-line change in each place, not a rewrite.

Everything downstream in this document assumes `usershipMonthNumber` is computed correctly. Treat this as Priority 0.

---

## 3. The Voice Problem, and the Resolution

The request is to "celebrate each month... through affirmations." The codebase's own standing law says otherwise:

```
ORDER 1   No emoji in system text. Periods only.
ORDER 8   No superlatives. "Done." not "Amazing job!"
ORDER 10  COCKPIT RULE. Log body = instrument readings only.
```
— `LOT-WIKI-v82.md` §17, §20

This is not an oversight to route around. It is the single most consistent piece of design doctrine in the entire codebase (11 Military Purity Orders, enforced across 719 badges, dozens of widgets, and every log renderer). A confetti-and-emoji "You did it!!" moment would be the first thing in the product that violates house style, and it would read as fake precisely because everything around it doesn't talk that way.

**Resolution: precision *is* the affirmation.** The emotional payoff of a LOT monthly moment isn't enthusiasm — it's specificity. "You wrote about tea on day 3, and by month 6 it had become a whole evening ritual, and the system noticed" lands harder coming from an instrument panel than from a cheerleader, because the specificity itself proves the system was paying attention. This is the same logic already embodied in the Memory Engine's own doctrine (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §9): the insight response system never says "Great answer!" — it says something concrete and archetype-specific.

Every celebration artifact in this document (§6) follows this rule: **no emoji, no superlatives, data-row structure, but content dense enough with the user's own specifics that it can't have been written for anyone else.** Call this pattern the **MONTH SEAL** — styled identically to the DCSAL (`daily_coherence_seal`) and other `SEAL`-family log renderers already in the Log Event System (§12 of the wiki), just monthly instead of daily.

---

## 4. Structural Backbone — Reuse the Chapters That Already Exist

`interfaceEvolution.ts`'s `EvolutionState` already has a `chapter (1-4 story arc)` field, and `WIDGETS.md` documents the Narrative Widget's four story chapters: **Awakening → Exploration → Integration → Mastery**. Twelve months divides across those four chapters at three months each — a division that requires zero new vocabulary and slots directly into code that already exists:

```
CHAPTER I    AWAKENING       Months  1– 3
CHAPTER II   EXPLORATION     Months  4– 6
CHAPTER III  INTEGRATION     Months  7– 9
CHAPTER IV   MASTERY         Months 10–12
```

Chapter boundaries (end of month 3, 6, 9, 12) are the four moments that carry real weight — a badge, a longer Memory recap, a visible density-tier jump if earned. The eight months in between get the existing lightweight `MonthlyPulseWidget` treatment: message updates, counter increments, no new ceremony. This mirrors the badge system's own existing philosophy exactly — milestone badges sit at 7/30/100/180/365 days, not at every single day (`badges.ts:6444-6459`) — so a 4-badge chapter structure over 12 badges is *more* consistent with house style, not less.

---

## 5. The Governing Rule — Time Sets the Ceiling, Engagement Fills It

This reconciles the two systems that currently don't talk to each other: `MonthlyPulseWidget` (pure time) and `interfaceEvolution.ts` (pure engagement).

```
density_shown(user) = min( density_ceiling(usershipMonthNumber), density_earned(engagement) )
```

- **`density_ceiling(month)`** — a new, small lookup table mapping `usershipMonthNumber` → the *maximum* density tier and feature-unlock level available that month. This is the only new time-axis logic required; it sits beside the existing `getLayoutDensity()` (`interfaceEvolution.ts:442-467`) rather than replacing it.
- **`density_earned(engagement)`** — the existing, unmodified `interfaceEvolution.ts` calculation from streak/depth/badges/level.
- **The `min()`** is the whole design. A highly engaged user in month 1 does *not* get instrument-density UI on day 4 — the arc is supposed to be felt, not skippable. A quiet Usership subscriber in month 11 who logged nothing does *not* get instrument-density UI either — time alone doesn't buy density, same as today.

Critically, **density never regresses.** If a user reaches `compact` in month 5 through heavy engagement, and goes quiet for two months, the UI does not roll back to `comfortable`. The `min()` only throttles *new* ceiling increases; earned density is sticky. This matches an explicit design principle already stated in `INTERFACE_EVOLUTION.md` §"Design Principles" — *"Meaningful Gates - Features unlock when users demonstrate readiness"* — readiness is never revoked, only new readiness withheld. It's also the same posture as QOS: *"The QOS does not direct the person — it mirrors their actual state with precision"* (README.md). A regressing UI would be a punishment; this system doesn't punish, it just doesn't rush.

**What "reaching" a month's ceiling requires** (proposed threshold, tunable): averaged over the calendar month, ≥15 active days, plus at least one `emotional_checkin` and one `self_care_complete`/`self_care_skip` event per week. This ties directly to signals already logged today (§7 of `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`: login streak, journal entries, mood check-ins, self-care completion/skip ratio) and to the existing **Density Tier System** (`LOT-WIKI-v82.md` §18: TRACE/LIGHT/MODERATE/DENSE/SATURATED, 1–2 vs 12+ signal sources active in 24h) — the monthly threshold is simply "average daily tier stayed at MODERATE or above across the month," reusing a metric that's already computed, not inventing a new one.

---

## 6. Month-by-Month Table

Density tiers and feature-unlock levels are the existing `interfaceEvolution.ts` vocabulary, now capped per §5. "New this month" lists only what's genuinely new — most months are quiet by design; four months (3/6/9/12) carry the chapter weight.

| Month | Chapter | Density ceiling | Feature-unlock ceiling | New this month | Badge |
|---|---|---|---|---|---|
| 1 | I — Awakening | `breathable` | 0 | `MonthlyPulseWidget` message 1 (already written). "Months unlocked: 1/12" first appears — see §8. Log/Memory/morning-check-in/self-care widgets present, undecorated. | — |
| 2 | I | `breathable` | 0–1 | Nothing new. Quiet accumulation month — the arc should have room to breathe, per `INTERFACE_EVOLUTION.md`'s own "Subtlety First" principle. | — |
| 3 | I → II | `comfortable` | 1 | **Chapter I closes.** First MONTH SEAL (§9 example). First badge. Public profile (§10) shows its first real content beyond name/date. | `orbit_i` — chapter close, common |
| 4 | II — Exploration | `comfortable` | 1–2 | Nothing new. | — |
| 5 | II | `comfortable` | 2 | Nothing new. | — |
| 6 | II → III | `compact` | 2–3 | **Chapter II closes.** MONTH SEAL. Advanced Memory unlock becomes *possible* (still gated by `Depth: Deep Diver`, per existing `INTERFACE_EVOLUTION.md` feature table — density ceiling now permits it, engagement still decides). | `orbit_ii` — uncommon |
| 7 | III — Integration | `compact` | 3 | Nothing new. | — |
| 8 | III | `compact`–`dense` | 3–4 | Nothing new. | — |
| 9 | III → IV | `dense` | 4 | **Chapter III closes.** MONTH SEAL. Pattern Insights / Cohort widgets reach full richness ceiling. | `orbit_iii` — rare |
| 10 | IV — Mastery | `dense` | 4 | Nothing new. | — |
| 11 | IV | `dense`–`instrument` | 4–5 | Nothing new. | — |
| 12 | IV | `instrument` | 5 | **Chapter IV closes. Year Seal** — the longest MONTH SEAL, explicitly framed as "first orbit complete." Full density ceiling lifted — from month 13 onward `density_shown` is governed by `interfaceEvolution.ts` alone, uncapped by time. This is the literal "LOT® AI" state: the ceiling stops being the limiting factor, engagement is the only remaining variable — same regime the `machiavelli` reference account should already be in. | `orbit_full` — legendary |

This is deliberately front-loaded with quiet and back-loaded with density, not evenly spaced — matching the existing pacing philosophy in `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §6 (Day 1 quota is high and *simple*; sophistication — Mode 5 compressed follow-ups, trauma-informed protocol at 10+ entries — arrives only once there's a corpus to be sophisticated about). The 12-month arc is the same shape at a longer time constant.

---

## 7. Log Volume, Morning Check-Ins, Self-Care — the Substrate

The user's framing is exactly right: the felt sense of evolution should come from *volume and consistency of the person's own input*, not from the calendar alone. Concretely, three existing signal streams do this work without any new instrumentation:

- **Log entries** (`Logs.tsx`, `note` events) — already counted (`public-api.ts:1270-1277`: `totalLogs`, `noteCount`) and already surfaced on the public profile as `journalEntries` and `Clearance level: → Full (N entries)`. The 12-month arc's job is to make this count *visible progression*, not a static number — e.g., a small sparkline or month-over-month delta inside the existing `EvolutionWidget` (`Entries: {totalEntries}`, `EvolutionWidget.tsx:172-173`), which already has the "N/M" display precedent this needs.
- **Morning check-ins** — not a separate component; `EmotionalCheckIn.tsx`'s `getTimeSlot()` branch for hours 5–12 (`EmotionalCheckIn.tsx:64-85`). Notably, this file already contains the comment `// LOT AI: leads in morning + evening (check-in moments)` and already toggles its label between `"LOT AI:"` and `"Biofield:"` by time of day (`:156-158, 208`) — the product's own code has, unprompted, already started calling the morning moment "LOT AI." Monthly consistency of morning check-ins (weeks with ≥1 morning check-in / weeks elapsed) is one of the two engagement gates in §5.
- **Self-care completions** — `SelfCareMoments.tsx`, `self_care_complete`/`self_care_skip` events, with an existing client-side streak calculator (`calculateStreak()`, lines 56-95). This is the other §5 engagement gate.

None of these need new tracking. They need a monthly rollup, which — see next section — already exists server-side and simply isn't shown anywhere.

---

## 8. "Months Unlocked: X/12" — Where It Lives

Three placements, in order of implementation cost:

1. **`SystemProgressWidget.tsx`, Deployment view.** Exact precedent already exists: the April 26 assembly run (`docs/assembly/2026-04-26_LOT-assembly_os-journal-readiness.md`) added a live `Readiness N/100 [band]` row below the assembly progress bar, gated on `report !== null`, styled `opacity-30` label + `tabular-nums` value. Add a sibling row, gated on `hasUsership`:
   ```
   Usership      Month 03/12 · Chapter I — Awakening
   ```
   This is the cheapest placement — same component, same pattern, one more conditional row.

2. **`MonthlyPulseWidget.tsx` itself.** It already renders `{capped} / 12 months` (line 134) inside a once-per-month dismissible toast (`localStorage` key `lot_pulse_${userId}`). Today that number disappears the moment the toast is dismissed. Recommend splitting it: keep the toast for the *message* (one-time, dismissible, per §6's table), but promote the `X/12` counter itself to a small persistent chip that doesn't depend on the toast being open — this is a rendering split, not new data.

3. **Public profile — `boardProfile` block.** `public-api.ts:1288-1303` already computes `boardTenureMonths`; `PublicProfile.tsx:289-325` already renders it, but only inside a prose join ("Board member #4 since February 2026..."). Recommend a first-class line in the same block:
   ```
   Months unlocked:    03/12
   Chapter:            I — Awakening
   ```
   This is what makes the arc *visible on `machiavelli`'s profile as fully unlocked (12/12, Chapter IV)* and *visible on a fresh Usership subscriber's profile as 01/12, Chapter I* — the exact side-by-side contrast the user is asking this document to design toward. It's also a two-line addition to a block that already has all the data it needs.

---

## 9. The Memory Compression Moment — the Part That Matters Most

This is the section the user flagged as highest priority, and it's also the one place where real backend work — not just wiring — already sits finished and unused.

`src/server/utils/monthly-summary.ts` (873 lines) already computes, for the last complete calendar month:
- **Presence** — active days, total entries, consistency, longest streak
- **Energy** — via existing energy-band logic
- **Patterns** — via `analyzeUserPatterns`
- **Growth** — current level, levels gained, new achievements via `generateUserNarrative`
- **Narrative + forward-look** — and it internally calls `generateMemoryStory()` (`memory.ts:873`), the same engine that powers the in-app Memory Story, scoped to that month's answers

It is driven by a real scheduled job (`scheduled-jobs.ts`, `executeMonthlyEmailJob`, 1st of month 09:00 UTC, tracked per-user via `metadata.lastMonthlySummaryDate`) and gated by `shouldShowMonthlySummary()` (fires only in the first 3 days of the month, only if ≥25 days since the last one — sane, already-correct pacing). **It has zero client consumers.** Confirmed: no file under `src/client` references `monthly-summary` or `MonthlySummary`. Right now this entire apparatus exists solely to generate an email.

**Proposed: a new widget, `MonthSealWidget`, Usership-gated, that is the in-app twin of that email.**

- **Trigger:** same `shouldShowMonthlySummary()` gate the email already uses — reuse it, don't reimplement it. Fires once per calendar month, first few days.
- **Content:** the same `narrative` + `forwardLook` fields `generateMonthlySummary()` already produces, formatted as a MONTH SEAL (§3 voice rule) instead of email HTML. A worked example, built from real field names in the existing return object — presence/energy/growth are all already-computed fields, not invented ones:
  ```
  MONTH SEAL — 06/12 · CHAPTER II CLOSE

  PRESENCE   21 active days · 17 journal entries · consistency 71%
  ENERGY     moderate, rising · longest streak 9 days
  GROWTH     level 14 → 17 · 2 new achievements

  The system has 94 answers on file. In April you were still
  answering questions about morning beverages. By June the same
  questions returned answers about who you're becoming when no
  one's watching. The pattern held on 4 of the last 5 weekends.
  That is not an accident of scheduling. That is a person choosing
  the same thing on purpose, repeatedly, when it would have been
  easiest not to.

  NEXT   Chapter III — Integration begins. Density ceiling: compact.
  ```
  Every line above maps to a real field the backend already returns (`presence.activeDays`, `presence.totalEntries`, `presence.consistency`, `energy`, `growth.currentLevel`/`levelsGained`/`newAchievements`, `narrative`). The only new work is the client component and formatting — the compression, the data, and the pacing already exist.
- **Archive:** persist each fired MONTH SEAL (it's already computed once and cached — `metadata.lastMonthlySummaryDate` prevents recomputation) into a lightweight "Story Chapters" list, visible from the Memory widget or System Progress widget's OS Journal view — twelve entries by month 12, each one a paragraph, each one dated, forming exactly the "compressed Memory story delivery" the user asked this document to center. This is the tangible artifact: by month 12, a Usership subscriber has *twelve short, specific, dated paragraphs about their own year*, generated from data they already produced by using the product normally. Nothing about it is manufactured for the occasion — it's the exhaust of the compression loop that already runs, finally shown instead of only emailed.

**Cost:** one new client widget consuming an existing, already-scheduled, already-cached, already-correct backend function. No new AI calls, no new schema beyond §2's timestamp fix, no new scheduled job.

---

## 10. Public Profile — the Before/After the User Is Asking For

Today `PublicProfile.tsx` gates almost everything behind a single flat `hasUsership` boolean (`:366-479` — Psychological Profile, archetype, streak-based Level, core values, all appear at once, all-or-nothing) plus a separate `assemblyPhase` gate on just the QR code (`:611-663`, requires `forming` or later). There is no graduated reveal — a Usership subscriber's profile looks identical on day 1 of the subscription and day 340 of it, apart from numbers slowly climbing inside sections that were already fully visible.

**Recommended graduated reveal, keyed to `usershipMonthNumber` (post §2 fix), layered on top of the existing `hasUsership` gate rather than replacing it:**

| Profile section (existing) | Currently gated by | Proposed additional gate |
|---|---|---|
| Board profile block, name/date/tags | `hasUsership` (implicit — always shown) | Always, from month 1 — this is the "barebones day-1" state the user described |
| Months unlocked / Chapter (new, §8.3) | — | Always, from month 1 — this *is* the thing that makes the arc visible |
| Memory Story (raw text) | `showMemoryStory && memoryStory` | Unchanged — privacy toggle already covers this correctly |
| Psychological Profile / archetype / Level / core values | `hasUsership` | Month 3+ (Chapter I close) — currently dumped on day 1, which undercuts the "barebones start" the user wants |
| Correlated Indexes (self-awareness / longevity / composite scores) | `hasUsership` | Month 6+ (Chapter II close) |
| Story Chapters list (new, §9) | — | Grows organically — 1 entry by month 1, up to 12 by month 12. Nothing to gate; it's just as long as it's earned. |
| QR code | `isUsership && assemblyPhase ≥ forming` | Unchanged — already time/engagement-sensitive via `assemblyPhase`, already correct in spirit |

This directly produces the two reference states the user named: a fresh Usership profile (month 1) shows identity + tags + an explicit "Months unlocked: 01/12," and nothing else yet — genuinely barebones, not barebones-except-for-a-wall-of-psychological-data. A profile at month 12+ with sustained engagement — the state `machiavelli` should already be in, architecturally (`assemblyPhase: integrated`, full `boardProfile`, presumably 12 Story Chapter entries) — shows everything, because everything has been earned across a year. **This should be verified against the live `machiavelli` page directly (the WebFetch in this session was blocked by bot protection); if the live page doesn't yet show a Story Chapters list or explicit Months-unlocked line, that confirms §9 and this section are net-new surface, not a redundant rebuild of something already shipped.**

---

## 11. Badges — Cloning an Existing Pattern

`badges.ts:6444-6459` already has a `streakMilestones` array (`[7,14,21,30,50,60,90,100,180,365]`) checked against `stats.streak` inside `checkAndAwardBadges()`. Proposed: a parallel, small array —

```ts
const usershipChapterMilestones = [3, 6, 9, 12]  // months
```

— checked against `usershipMonthNumber` (post §2 fix) inside the same function, awarding four new badges: `orbit_i`, `orbit_ii`, `orbit_iii`, `orbit_full`, rarities common → uncommon → rare → legendary (reusing the existing 7-tier `RARITY SCALE` from the badge codex verbatim, §"RARITY SCALE" in `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v29.md`). Unlock messages follow the existing lore-writing convention (short, second-person, precise, no exclamation points — see any entry in the Mastery Tier section of the codex for tone reference). This is intentionally the smallest-footprint addition in this entire document: four rows in an existing array, four entries in an existing `BADGES` object, zero new architecture.

Explicitly **not recommended:** a unique badge for every one of the 12 months. The badge system's own established philosophy (streak badges at 7/14/21/30/50/60/90/100/180/365 — sparser as commitment required grows) argues against 12 discrete monthly badges; the quiet months (§6's rows 2/4/5/7/8/10/11) should stay quiet. The `MonthlyPulseWidget` message table already covers month-to-month texture without needing a badge attached to each one.

---

## 12. Open Questions / Risks

1. **§2 is a hard blocker.** Nothing in §5–§11 produces correct output until `usershipStartedAt` exists and is used consistently. Recommend this ships alone, first, as its own small assembly run — it's also independently valuable (fixes the existing `MonthlyPulseWidget` and `boardTenureMonths` bugs today, before the rest of this design is even built).
2. **Threshold tuning in §5** (15 active days, weekly check-in/self-care cadence) is a proposal, not a measured number. Recommend instrumenting first — pull the actual distribution of active-days-per-month across current Usership subscribers before locking the threshold, so month 1 isn't accidentally unreachable for a normal, engaged-but-not-obsessive user.
3. **Voice discipline (§3) needs an editor, not just a template.** A generated MONTH SEAL that's technically emoji-free and superlative-free can still *read* like marketing copy if the AI-generated `narrative`/`forwardLook` text from `generateMonthlySummary()` isn't reviewed against the Cockpit Rule. Recommend a lightweight tone-lint pass (banned-word list: "amazing," "incredible," "so proud," any exclamation point) on the AI output before it's shown, same spirit as the existing trauma-informed protocol's tone override in the Memory Engine.
4. **Density ceiling table in §6 is illustrative, not final.** The exact month → tier/level mapping should be tuned against `interfaceEvolution.ts`'s actual thresholds (`overallMaturity`, `visualRefinement` numeric ranges) rather than assigned by feel, once someone is implementing this.
5. **This document does not cover the R&D ($15/mo) or Legacy tiers.** Scope was explicitly "12 month of paid tier Usership" — if a similar arc is wanted for R&D, it needs its own document; the $99 vs $15 tiers likely deserve different pacing, not a shared table with a gate switched off.

---

## 13. Summary

Day 1 of Usership should look close to what it looks like today — a few widgets, one visible new element: **"Months unlocked: 01/12 · Chapter I — Awakening."** Nothing else changes about that first session; the barebones feeling is real, not simulated.

What changes between then and month 12 is not decoration layered on top. It's the same three engines the product already runs — a month counter, a density/feature ramp, a monthly compression job — finally introduced to each other, gated by one governing rule (§5: time sets the ceiling, engagement fills it, nothing ever regresses), voiced in the instrument-panel register the rest of the product already speaks (§3), and structured around four chapters the codebase already named (§4). By month 12, the same person has twelve dated paragraphs about their own year, a profile that has earned its density one chapter at a time, and four small badges marking exactly where each chapter closed — which is, as far as this document can verify without a working fetch to the live page, the state `machiavelli` is already meant to represent.

---

**LOT Systems Corporation**
**Session prepared for S-2 — Vadim Marmeladov**
