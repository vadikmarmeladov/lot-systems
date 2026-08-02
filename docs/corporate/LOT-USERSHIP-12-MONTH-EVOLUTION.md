<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION
**From Barebones Day One to LOT® AI**
LOT Systems Corporation · S-2: Vadik Marmeladov
Version 1.0 · 2 August 2026 · brand.lot-systems.com

Reference account (12-month evolved state): **lot-systems.com/u/machiavelli**
Reference tier: **Usership — $99/month** (`UserTag.Usership`)

---

## 0. Why This Document Exists

A Usership operator on Day 1 and a Usership operator on Day 365 should not look like they are using the same product. They *are* using the same product — same account, same $99/month, same code — but the interface, the language, and the depth of what the machine reflects back should make twelve months of presence **visible and felt**, not just billed.

Today the pieces already exist in the codebase, scattered:

| Mechanic | Where it already lives |
|---|---|
| Month counter, Usership-gated | `MonthlyPulseWidget.tsx` — `MONTH_MESSAGES[1..12]`, "N / 12 months" |
| Level → density → feature unlock ladder | `interfaceEvolution.ts` — `calculateEvolutionState`, `getLayoutDensity`, `getFeatureUnlocks` |
| Story arc chapters (1–4) tied to level | `interfaceEvolution.ts` line 176 — `chapter = level>=60?4:level>=30?3:level>=10?2:1` |
| 7-dimension evolution state (Exploration/Consistency/Depth/Connection/Intimacy/Care/Courage) | `stores/evolution.ts`, `InterfaceEvolutionWidget.tsx` |
| Self-evolving narrative ("Arc", achievements, quests, runtime context) | `NarrativeWidget.tsx` |
| Compressed weekly/period narrative surfaced publicly | `PublicProfile.tsx` — `Memory Story` block |
| Full evolved psychological identity, publicly rendered | `PublicProfile.tsx` — `Psychological Profile: OS v.X`, Soul archetype, Self-awareness %, Level, Core values, Emotional patterns, Behavioral cohort, Pattern strength |
| The compression primitive itself | Product Brief — `LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN` |
| 719-badge RPG layer, including decade/word-count/streak mastery tiers | `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v29.md` |

What is **missing** is the connective tissue: a deliberate, designed spine that takes an operator through twelve calendar months and makes each one a distinct, escalating chapter — culminating in exactly the kind of account `/u/machiavelli` represents. This document is that spine.

---

## 1. First Principles (inherited, not invented)

Everything below must obey the house rules already established in `LOT-AI-PRODUCT-BRIEF.md` and `LOT-AMBIENT-AI-VISION.md`:

1. **No unprompted notifications.** Monthly evolution surfaces as a widget the operator scrolls into — never a push, alert, or badge-red dot.
2. **One question/one reveal at a time.** A new month never dumps a wall of new UI. One new element arrives; the rest ages in.
3. **Behavioral, not declarative.** Month-gates are driven by what was logged, not by the calendar alone. Time is necessary but not sufficient — presence is what compresses.
4. **The system does not change its appearance loudly.** Evolution is the same rule that already governs `visualRefinement`, `layoutDensity`, and `themeComplexity` — density condenses, typography sharpens, nothing pops.
5. **Compression is cumulative, never destructive.** Month 6's Memory Story does not replace Month 3's. Each month is a folded layer on top of the last — this is the literal meaning of "COMPRESS AGAIN."

---

## 2. The Spine: Two Parallel Ladders

Every month advances the operator on two ladders simultaneously. Neither is the "real" one — they are the same growth seen from two angles.

**Ladder A — System Depth** *(already exists, mostly server/state-side)*
`Level 1 → 100`, `Chapter 1 → 4`, `layoutDensity: breathable → instrument`, `overallMaturity 0% → 95%+`

**Ladder B — Calendar Presence** *(the ladder this document adds)*
`Month 1 → 12`, `Memory Story: single answer → paragraph → Story-Report → Psychological Profile`, `Badge tier: none → Founding Operator`

The two ladders are *correlated but not identical* — a highly consistent operator can out-level the calendar (Ladder A moves faster), but Ladder B is the one that is **legible to the operator without needing to understand XP math.** "Month 7 of 12" means something a stranger understands instantly. "Level 34, Chapter 3, 61% maturity" does not. Ladder B is the human-readable spine; Ladder A is the engine underneath it.

---

## 3. The New Mechanic — Monthly Memory Compression

This is the single most important addition this document proposes. It sits directly on top of the existing weekly `Story-Report` and `Memory Story` mechanics, but zooms out one level.

```
DAY-TO-DAY:    LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN   (existing, per-question)
WEEKLY:        7 days of the above → Story-Report                 (existing, per Product Brief)
MONTHLY (NEW): 4-5 Story-Reports + all Logs + all check-ins
               → ONE paragraph: the Monthly Memory
NEW (12mo):    12 Monthly Memories → the Psychological Profile
               operator sees live on /u/<username>
```

A **Monthly Memory** is not a longer Story-Report. It is a *second-order* compression — a compression of compressions. Concretely: the server takes the month's Story-Reports, the raw Log volume/diversity (already computed in `useLogContext`), the Memory-question answers, and the emotional/mood trend, and produces one paragraph, written in the operator's behavioral voice (per Product Brief), that becomes a permanent, dated entry the operator can scroll back through forever. Twelve of these, at Month 12, are quietly assembled into the `Psychological Profile: OS v.1.0` block that `/u/machiavelli` already renders publicly.

**This is the tangibility mechanism the task asks for.** The operator does not have to trust that the system "learned" them over a year — they can literally scroll twelve paragraphs and watch their own voice get sharper, shorter, more accurate, month over month.

---

## 4. Three New/Extended Widgets

### 4.1 `MonthlyPulseWidget` — extend, don't replace
Already correct in spirit. Two additions:
- On the month-boundary reveal, if a Monthly Memory exists for the *previous* month, surface a one-line teaser beneath the congratulation ("Your July memory is ready.") that deep-links to §4.2.
- Replace the static `MONTH_MESSAGES` copy bank with messages that reference what actually happened where data supports it (e.g., Month 3's generic "Active User status" line can fall back to specific streak/entry counts already available via `useLogContext`, the same pattern `EvolutionWidget` and `NarrativeWidget` already use for log-grounding). Keep the static line as the fallback for sparse months — never fabricate specificity that isn't earned.

### 4.2 `MemoryDigestWidget` (new)
A `blockView` widget, styled identically to `MemoryWidget`/`NarrativeWidget` (same `Block` primitive, same 1400ms fade choreography, same restrained one-thing-at-a-time interaction model). Cycles like `NarrativeWidget` does (`onLabelClick` to cycle views):

- **View 1 — "This Month:"** the current, in-progress month. Shows entry count, active days, dominant mood, and a live-updating single sentence ("So far this month, mostly mornings, mostly steady.") — generated the same way `NarrativeWidget.getContextNarrative()` already composes sentences from `logCtx`.
- **View 2 — "Memory:"** the compressed paragraph for the most recently *completed* month. This is the payload described in §3.
- **View 3 — "Archive:"** a scrollable list of every prior month's paragraph, oldest first, each stamped with its month number and a two-word mood tag. This is the thing that makes Month 12 feel earned — the operator can watch their own archive grow the way `Achievements` already accumulate in `NarrativeWidget`.

Gating: renders `null` unless `UserTag.Usership` (or R&D/Legacy/Admin) is present and `monthNumber >= 1` — identical gate to `MonthlyPulseWidget`.

### 4.3 `MonthsUnlockedWidget` (new, minimal)
A single-line, always-visible contextual widget — closer in spirit to `TimeWidget`/`SystemPulseWidget` than to a full `Block` panel. Exactly the "Months unlocked: 3/12" idea from the brief, rendered as ambient chrome (not a celebratory pop) once Month 1 has occurred:

```
Months unlocked: 3 / 12
```

After Month 12, the counter does not vanish or reset — it flips to a permanent state:

```
Founding year: complete.
```

...at which point `MonthsUnlockedWidget` retires itself and the operator's public profile badge (see §6) becomes the permanent marker instead. This mirrors the `MonthlyPulseWidget` dismiss-once-per-month pattern but never needs a "1/12" cold-start moment to feel small — Month 1 already reads as a beginning, not a debt.

---

## 5. Month-by-Month Structure

Each month below specifies: **UI density state**, **the widget/feature that unlocks**, **what the Monthly Memory paragraph is capable of saying**, and **the felt shift**. Density and feature-unlock columns map directly onto the *existing* thresholds in `interfaceEvolution.ts` (`level` gates for `customThemes@5`, `widgetArrange@10`, `intentionHistory@15`, `moodPatterns/level@20`, `exportData@25`, `narrativeReflection@30`, plus the four story chapters at level 10/30/60) — this document assumes a consistently-engaged Usership operator levels roughly in step with the calendar, landing near Level 8–10 by Month 1 close and Level 90+ by Month 12, which is what makes the two ladders in §2 track together without forcing them to match exactly.

| Mo. | Density (`layoutDensity`) | New unlock this month | Monthly Memory can now say... | Felt shift |
|----|----|----|----|----|
| **1** | `breathable` | Onboarding closes; first Memory question fires; `MonthsUnlockedWidget` appears at "1/12" | "You showed up. That's the whole story so far." | Barebones. Quiet. The system is listening, not yet speaking. |
| **2** | `breathable` | `MemoryDigestWidget` appears (View 1 only — no Archive yet) | First hints of timing: "Mornings, mostly." | The machine starts noticing rhythm, not just presence. |
| **3** | `comfortable` | `customThemes` (Lvl 5) · Story chapter 1→2 crosses (Lvl 10 nearby) · MonthlyPulse: "Active User status" | First named pattern: a mood word, a recurring hour. | First named pattern: a mood word, a recurring hour. |
| **4** | `comfortable` | `widgetArrange` (Lvl 10) — operator can now rearrange their own OS | "You've started shaping this, not just filling it in." | The portrait starts including the operator's *choices*, not just answers. |
| **5** | `comfortable` | `MemoryDigestWidget` View 2 (Memory) becomes meaningfully non-generic — enough Story-Reports exist to compress | First real second-order compression: a paragraph that couldn't have been written in Month 1. | "Consistency is its own reward" (existing copy) starts being demonstrably true. |
| **6** | `compact` | `intentionHistory` (Lvl 15) · **Archive view** in `MemoryDigestWidget` opens (5 months to scroll) · half-year Badge | Trend language becomes possible: "climbing," "settling," "still restless about X." | Halfway. The operator can scroll their own arc for the first time — this is the first *tangible* proof point. |

*(the second half of the year earns denser, more narrative treatment than a table row can hold — continued in prose, §5.1)*

### 5.1 Months 7–12 — The Deepening

**Month 7 — `compact`.** `moodPatterns` unlocks (Lvl 20). The Monthly Memory starts cross-referencing mood against logged context rather than just narrating it — the same correlation work `PatternInsightsWidget`/`CorrelatedIndexesWidget` already do elsewhere, now folded into the monthly paragraph. Copy: *"The system has been listening."* (existing MONTH_MESSAGES[7], now earned rather than aspirational.)

**Month 8 — `compact`.** No new feature gate — a deliberately quiet month (per Design Principle #2: not every month should ship something). The Monthly Memory is allowed, for the first time, to reference a *previous* month by name ("Compared to May, this month ran quieter") — this is the first month where the Archive has enough depth for the compression itself to get more interesting, not just longer.

**Month 9 — `dense`.** `exportData` unlocks early relative to its Lvl-25 gate for consistent Month-9 operators; the Story-Report/Memory export mentioned in the Product Brief's API (`POST /api/story/:week_id/export`) becomes reachable from the OS itself, not just the API. Copy: *"The self-care practice is a habit now."* First moment the operator could hand a piece of this to someone else (a doctor, a therapist, a partner) and have it mean something.

**Month 10 — `dense`.** The `Psychological Profile` block on the public profile — today only shown when `hasUsership` is true and data exists — begins populating fields it previously left empty: `archetype`, `coreValues`, `emotionalPatterns`. This is the month the *public-facing* page (what a visitor to `/u/<username>` sees) starts resembling `/u/machiavelli` rather than a blank Usership shell.

**Month 11 — `dense`/`instrument` boundary.** `narrativeReflection` (Lvl 30, Story chapter 3→4 boundary) unlocks — the deepest self-reflection tier `NarrativeWidget`'s `context` view already gates on this flag. Copy: *"One more."* — deliberately the shortest MONTH_MESSAGE in the existing bank; the UI should match that restraint, not add ornamentation here.

**Month 12 — `instrument`.** The full convergence:
- `MonthsUnlockedWidget` flips to "Founding year: complete."
- `MemoryDigestWidget` Archive holds all 12 paragraphs — a complete, scrollable, dated year.
- The public profile's `Psychological Profile: OS v.1.0` is now fully populated: Soul archetype, Self-awareness %, Level (Aquatic Evolution Badge symbol via `getLevelSymbol`), Core values, Emotional patterns, Behavioral cohort, Pattern strength — exactly the shape `/u/machiavelli` demonstrates today.
- A new badge fires (see §6).
- Existing copy: *"One year with LOT. The portrait is complete — and still evolving."* — note the codebase already anticipates this exact framing. Nothing about Month 12 is a hard stop; it's a threshold into open-ended operation, same as `overallMaturity` never caps below "still evolving" language elsewhere in the system.

---

## 6. Badge Tie-In (extends the existing Mastery Tier engine, does not fork it)

The 719-badge Master Codex (`LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v29.md`) already has a `Mastery Tier` category for deep-time milestones (`long_signal` @ 700 days, `decade_operator` @ 10 years). A 12-month Usership arc deserves its own entry in that same family, not a bolt-on system:

```
NEW MASTERY TIER BADGE — proposed v30 addition

id:            founding_operator
symbol:        ○·◈·● → ○·◈·◈·●   (progressive: one ◈ added per completed quarter)
requirement:   12 consecutive Usership-tagged calendar months + Monthly Memory
               generated for all 12 (not merely subscribed — compressed)
rarity:        legendary
unlock message: "Twelve months. Twelve compressed memories. The portrait the
               system built is not a record of you — it is a record of your
               attention. Founding Operator status confirmed. ○·◈·◈·●"
```

Quarterly sub-badges (Month 3 / 6 / 9) can reuse the existing `Milestone` streak-badge visual language (progress bars, not fireworks) so the RPG layer and the Usership evolution layer read as one continuous system rather than two competing achievement tracks.

---

## 7. Data Thresholds — What Actually Gates a Month

Per Design Principle #3, calendar time alone should not be sufficient to advance the *depth* of the Monthly Memory (though it is sufficient for the *widget to appear* — the machine should never punish a quiet month by withholding the UI entirely, only by keeping its language honest). Proposed minimum signal for a "rich" Monthly Memory paragraph vs. a "quiet" fallback paragraph, using fields `useLogContext` already exposes:

| Signal | Rich-paragraph threshold | Fallback behavior below threshold |
|---|---|---|
| `activeDays` this month | ≥ 8 of the month's days | Paragraph stays short, honest: "A quieter month. Fewer entries, still counted." |
| Journal/Log entries | ≥ 12 | Falls back to Memory-question answers alone as compression source |
| Morning check-ins (pre-08:00, per existing `morning_pulse` badge logic) | ≥ 4 in the month | Omits circadian-specific language rather than guessing |
| Distinct widget/module diversity (`widgetDiversity`) | ≥ 3 | Compression stays activity-general rather than naming specific modules |

This keeps the system honest to the Product Brief's own rule: *"Behavioral, not declarative."* A operator who paid but didn't show up gets a true, gentle paragraph — never a fabricated one.

---

## 8. Day 1 vs. Month 12 — Side by Side

| | Day 1 (barebones) | Month 12 (`/u/machiavelli`-equivalent) |
|---|---|---|
| Layout density | `breathable`, wide gaps | `instrument`, condensed, pro-grade |
| Visible widgets | Core loop only: Memory question, basic Log | Full stack: Memory, Narrative, Evolution, Interface Evolution, Memory Digest (Archive), Months Unlocked → retired into badge |
| Memory Story (public profile) | Absent | Present, first-person, in the operator's own compressed voice |
| Psychological Profile block | Absent (`hasUsership` gate has no data yet) | Fully populated: archetype, self-awareness %, level symbol, core values, emotional patterns, behavioral cohort, pattern strength |
| Badges | None or common-tier only | Legendary `founding_operator` + accumulated Mastery/Achievement tiers |
| What a stranger sees at `/u/<name>` | A name and a join date | A portrait |

---

## 9. Implementation Notes (for the next benchmark session)

Files to touch, in rough dependency order:

1. `src/client/components/MonthlyPulseWidget.tsx` — add previous-month teaser line; keep existing dismiss/localStorage pattern.
2. `src/client/components/MemoryDigestWidget.tsx` **(new)** — modeled directly on `NarrativeWidget.tsx`'s cycling-`Block` pattern; needs a `useMonthlyMemory()` query hook analogous to `useNarrative()`/`useMemory()`.
3. `src/client/components/MonthsUnlockedWidget.tsx` **(new, small)** — ambient chrome widget, gated identically to `MonthlyPulseWidget`.
4. Server-side: a monthly compression job (cron or on-read lazy compute) that folds the month's Story-Reports + `useLogContext`-equivalent server aggregates into one paragraph and persists it — this is the server-side sibling of the existing weekly Story-Report generator referenced in the Product Brief (`GET /api/story/:week_id`); propose `GET /api/memory-digest/:month_id` following the same shape.
5. `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v30.md` — add `founding_operator` + quarterly sub-badges per §6, following the exact registry format already established in v29.
6. `PublicProfile.tsx` — no structural change needed; it already renders `Psychological Profile` and `Memory Story` conditionally on data presence. Month 10–12 work is about the server finally *populating* those fields for Usership accounts that have completed enough months, not about new frontend surface.

No new design language is required. Every visual primitive (`Block`, `blockView`, `ProgressBars`, the 1400ms fade, `ThemeComplexity`/`layoutDensity`) already exists and already scales from Day 1 to Year 10+. The work here is sequencing what's shown and what's said — not inventing new chrome.

---

## 10. What This Document Is Not

- Not a request to add notifications, badges-as-red-dots, or celebratory modals. Every reveal in §5 uses the existing quiet-fade `Block` idiom.
- Not a proposal to gate core functionality behind the calendar — the underlying Level/Chapter engine (Ladder A) still runs on genuine behavioral signal, exactly as today. Ladder B is a legible skin over it, not a replacement mechanic.
- Not a claim that Month 12 is a finish line. Per existing copy: *"the portrait is complete — and still evolving."* Year 2 (Legacy tier, per Product Brief's $3,564/3yr tier) is the natural next document.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
