<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Usership — 12-Month UI Evolution

## Classification: DESIGN BRIEF // S-2 REVIEW

**Author:** LOT Systems Corporation (session brainstorm, automated)
**S-2:** Vadik Marmeladov
**Date:** 4 August 2026
**Status:** PROPOSAL — not yet built
**Scope:** Usership tier ($99/month) — Day 1 (barebones, first login) → Month 12 (fully evolved, Legacy-adjacent)
**Reference account:** [lot-systems.com/u/machiavelli](https://lot-systems.com/u/machiavelli) — hardcoded demo, treated here as the Month-12+ ceiling

---

## 1. Doctrine

A Usership subscriber pays $99/month for twelve months before this document's arc completes. The subscription is not a feature list — it is a **year-long relationship with a system that visibly changes because the operator showed up.** Every mechanic below already has partial engineering behind it. This document's job is to name the parts, show where they already interlock, close the three gaps that keep them from reading as one story, and specify exactly what Month 1 through Month 12 should look, feel, and say.

The governing constraint, restated from `LOT-STYLE-GUIDE.md`: *long-term tracking, gradual meaningful progression, no cheap gamification.* The badge/quantum layer that shipped after that guide (v29 codex, 719 badges) is a later, additive aesthetic — this document treats it as the second half of the voice, not a replacement for the first half's restraint. Both registers coexist: plain, dry, factual copy for the everyday widgets; the Water/Architecture/Quantum vocabulary reserved for ceremony moments (month-end, badge unlock, chapter turn).

---

## 2. Current State Audit — what already exists

Three systems already implement fragments of a Day1→Month12 arc. None of them currently talk to each other as a single number the user can see. This is the core finding of this brief.

### 2.1 `MonthlyPulseWidget.tsx` — the literal Month-N/12 mechanic

Already Usership-gated. Already computes `monthNumber = diff(now, joinedAt, 'month')`. Already shows a hardcoded one-line message per month (1–12) and a `{month} / 12 months` caption, once per calendar month, with a fade-in/fade-out and a randomized dismiss phrase. **This is the widget the brief asked for — it exists.** Its gap: the message is a static string, not a paragraph pulled from what the user actually did that month. See §5.1.

### 2.2 Interface Evolution Engine — the UI actually gets denser

`interfaceEvolution.ts` computes `visualRefinement` (0–1, from consistency/depth/level) and maps it to five layout densities:

```
refinement   density        feel
< 0.15       breathable     Open, airy. Wellness-journal feel.
0.15–0.35    comfortable    Settling in.
0.35–0.55    compact        Working rhythm established.
0.55–0.75    dense          Power-user layout.
≥ 0.75       instrument     Bloomberg-terminal-grade. Every pixel justified.
```

Fourteen `featureUnlocks` gate widgets/customization at level and dimension thresholds (custom themes @ level 5, widget arrange @ level 10, intention history @ level 15, pattern insights @ consistency 0.66, export data @ level 25, narrative reflection @ depth 0.66 + level 30, …). This is a real, quantified progression engine — it is the mechanism, not the story. It has no month labels on it.

### 2.3 Self-Assembly Engine — the "is anything built yet" narrative

`selfAssembly.ts`: 18 modules, each independently `dormant → awakening → forming → assembled → integrated` off raw signal count (1 / 5 / 15 / 30 signals). Day 1 for a real user is close to all-dormant, and the system says so directly ("Quantum Cube dormant. Send the first signal — assembly begins with you."). This is signal-density-based, not calendar-based — it will race ahead of or lag behind the calendar month depending on how active the user is. That's a feature, not a bug, but the month-facing UI needs to reconcile the two clocks (see §4).

### 2.4 The badge milestone ladder — already covers 5 of 12 months

`badges.ts` milestone badges are day-counts that map cleanly onto months 1, 2, 3, 6, and 12:

| Days | Badge | Rarity | Month equiv. |
|---|---|---|---|
| 30 | Wave / Structure | uncommon | **Month 1** |
| 60 | Dual Wave | rare | **Month 2** |
| 90 | Deep Reach | rare/epic | **Month 3** |
| 180 | Voyager | — | **Month 6** |
| 365 | Long Count / Citadel | legendary | **Month 12** |

Months 4, 5, 7, 8, 9, 10, 11 have no dedicated milestone badge today. Gap — see §5.3.

### 2.5 Memory compression — two systems, both usable, neither monthly

- **Memory Story** (`memory.ts` / `story-generator.ts`): last 30 answered Q&As → Together AI (Llama 3.3 70B) → flowing third-person narrative, cached on `user.metadata.lastMemoryStory`. This is the deep portrait — the thing the machiavelli account's `memoryStory` field is a hand-written example of.
- **Weekly LOT® AI Story** (`scheduled-jobs.ts`, Job 24, Sunday 18:00 UTC): template-based (no AI call), buckets the last 7 days of logs into a `weekTone` (growth/recovery/steady) + `dominantMood` + counts, writes a `lot_ai_story` log event, feeds QIE Patterns 87/88 when the user reflects on it within 24h.

Neither is currently rolled up into a **month**. Four weekly stories a month already exist as raw material for exactly the "paragraph-long insight from last month" the brief asks for. Gap — see §5.1.

### 2.6 Citizen Index — three incompatible scales (needs reconciliation, not more scales)

This is the one finding that should change something before new copy gets written:

| Where | Basis | Stages |
|---|---|---|
| Wiki (documented, uncoded) | answer count | Observer(0–24) → Participant(25–49) → Contributor(50–99) → Collaborator(100–149) → Synthesizer(150–199) → Elite(200+) |
| `EvolutionWidget.tsx` (coded, live) | level 1–100 | Bootstrapping(1–9) → Initializing(10–19) → Integrated(20–29) → Compiled(30–39) → Optimized(40–49) → Transparent(50+) |
| `About.tsx` "Quantum Success Benchmark" (coded, live, different feature) | 5-tier | White → Green → Yellow → Purple → Black |

Three names for progress, three thresholds, none month-anchored. **Recommendation: for the Usership 12-month arc specifically, adopt the coded `EvolutionWidget` scale (Bootstrapping→Transparent) as the on-screen Citizen Index** — it's the one already wired to a symbol (`· · ∘ ○ ◯ ◉`) users can see today — and retire the wiki's word-scale from user-facing copy, keeping it as an internal analytics label if needed. §4 maps this scale onto the 12 months.

### 2.7 The machiavelli demo — the ceiling, one tier up

Hardcoded in `public-api.ts`, tagged `['RND', 'Usership', 'Legacy']`, explicitly captioned *"Legacy level features shown as preview."* Its `weatherStation` and `wallet` blocks are Legacy-only, not Usership. **Month 12 of Usership should feel like arriving at machiavelli's doorstep, not inside his house.** The wallet/weather-station blocks are the correct visual bait for a Month 13+ Legacy upsell — Month 12 itself should max out the Citizen Index, the badge shelf, and the Memory Story, and stop there.

---

## 3. The Unified Model

One clock, three dials, read together:

```
CALENDAR MONTH (1–12)     — MonthlyPulseWidget's clock. Ground truth for "which month is this."
CITIZEN INDEX (· → ◉)     — EvolutionWidget's clock. Engagement depth, can lead or lag the calendar.
DENSITY (breathable→instrument) — Interface Evolution's clock. Visual consequence of Citizen Index.
```

A user who logs in daily keeps the three roughly synchronized — that's the intended, celebrated path, and it's what the month table in §4 assumes. A lapsed-then-returning user will see the calendar month advance while Citizen Index and density stay behind — the UI should let that be visible and honest (a "Month 4, still Bootstrapping" state is not an error state, it's information), rather than force-synchronizing them. Do not paper over the gap with fake progress.

---

## 4. Month-by-Month Evolution

Assumes a consistently-engaged operator (daily check-in, occasional journal, weekly self-care). Each row is the state a user should find themselves in by the *end* of that month.

| Month | Citizen Index | Density | Badge earned | Widgets newly visible | Memory Story state | MonthlyPulseWidget message (existing → keep) |
|---|---|---|---|---|---|---|
| **1** | `·` Bootstrapping | breathable | Wave / Structure (30d) | Memory, EmotionalCheckIn, SelfCareMoments, JournalReflection, EvolutionWidget (bare) | First 20–30 answers accumulating; no synthesized story yet — Memory widget shows raw Q&A only | "The first month. The system is beginning to know you." |
| **2** | `·` Initializing | breathable→comfortable | Dual Wave (60d) | Custom themes (level 5), badge selection | First Memory Story generated (30-answer threshold reached); 4 weekly stories now in the log | "Two months in. Patterns are starting to form." |
| **3** | `∘` Integrated | comfortable | Deep Reach (90d) | Planner templates (consistency ≥0.33), advanced Memory (depth ≥0.33) | Second Memory Story revision; first month-over-month comparison possible | "Three months. You have reached Active User status." |
| **4** | `∘` Integrated | comfortable→compact | *(gap — propose new)* | Widget arrange (level 10) | Story references specific prior answers by name (compression visibly sharper — see §1 of the Memory Engine doc) | "Four months. The portrait deepens." |
| **5** | `○` Compiled | compact | *(gap — propose new)* | Intention history (level 15) | — | "Five months. Consistency is its own reward." |
| **6** | `○` Compiled | compact→dense | Voyager (180d) | Pattern insights (consistency ≥0.66) | Half-year narrative arc: story now spans two seasons — weather/seasonal callbacks become meaningful | "Six months. The journey is half-declared." |
| **7** | `○` Compiled | dense | *(gap — propose new)* | — | — | "Seven months in. The system has been listening." |
| **8** | `◯` Optimized | dense | *(gap — propose new)* | — | — | "Eight months. Rare air." |
| **9** | `◯` Optimized | dense | *(gap — propose new)* | — | — | "Nine months. The self-care practice is a habit now." |
| **10** | `◯` Optimized | dense→instrument | *(gap — propose new)* | Export data (level 25) | — | "Ten months. Almost there." |
| **11** | `◉` Transparent | instrument | *(gap — propose new)* | Narrative reflection (depth ≥0.66 + level 30) | — | "Eleven months. One more." |
| **12** | `◉` Transparent | instrument | Long Count / Citadel (365d) | Achievement gallery, full Citizen Index display, machiavelli-adjacent public profile fields (board profile, correlated indexes) | Year-long Memory Story: full narrative arc, explicit callback to Day-1 answers ("You once said tea. A year later—") | "One year with LOT. The portrait is complete — and still evolving." |

Feature-unlock levels above are drawn straight from `getFeatureUnlocks()` thresholds and lined up against the month a steady user should plausibly reach that level — they are illustrative pacing, not a promise the engine currently enforces month-by-month (it enforces level/dimension thresholds only, which is correct: keep it behavior-driven, not calendar-driven, per §3).

---

## 5. Proposals — closing the three gaps

### 5.1 Memory widget: real paragraph, not static line

`MonthlyPulseWidget`'s message is a hardcoded string today. Replace it — for Usership users only, on the month-boundary trigger that already exists — with a short paragraph assembled from that month's four `lot_ai_story` weekly-story log entries (already written by Job 24 every Sunday, no new backend job required): dominant tone across the month, one specific recalled detail (a note/journal excerpt, or a self-care streak), and a single forward-looking line. This is a **compression of compressions** — weekly stories (already compressed from daily logs) rolled into a monthly paragraph (new), which is itself what eventually feeds the year-end Memory Story (already exists). Keep the existing static line as the fallback for users below the 30-answer Memory Story threshold or with fewer than 2 weekly stories that month, so Month 1 (before enough data exists) still reads naturally.

### 5.2 "Months unlocked: N/12" as a persistent fact, not just a monthly toast

Today the `N / 12 months` line only appears inside the once-a-month dismissable toast. Add a small permanent readout in `EvolutionWidget`'s existing metrics view (it already has a metrics/activity view-cycle) — one more line alongside level/streak/entries: `Months: 4/12`. This makes the number checkable anytime, not just on the day the toast happens to fire, and it's the natural home since `EvolutionWidget` is already the Citizen Index surface (§2.6).

### 5.3 Fill the badge gap — months 4, 5, 7, 8, 9, 10, 11

Extend the existing milestone ladder (`badges.ts`) with day-count badges at 120, 150, 210, 240, 270, 300, 330 — same rarity progression logic already in place (uncommon→rare→epic climbing with day count), same dual Water/Architecture naming convention. This is additive to an existing record, not a new system: every calendar month gets a distinct, earnable badge, closing the "Month 4. The portrait deepens." line so it always lands next to something the user actually received that month, not just a sentence.

### 5.4 Reconcile the Citizen Index name collision (§2.6) before shipping new copy

Pick the coded `EvolutionWidget` scale as canonical for anything user-facing in this arc. This is a documentation/copy decision, not a schema migration — the wiki's word-scale can stay as an internal reference if useful, but no new widget copy should introduce a fourth name for the same idea.

### 5.5 Month 12 → Legacy bridge, not Legacy preview

At Month 12, surface a single new read-only line adjacent to the Citizen Index — "Legacy tier includes: Weather Station, Wallet." — with no interactive gate, no upsell button in the widget itself (the existing `SubscribeWidget` cooldown/random-chance pattern already owns upsell timing elsewhere; don't duplicate it here). The goal is recognition ("this is what's past the ceiling"), not a sales moment inside the ceremony widget.

---

## 6. What this document does not do

It does not propose new AI infrastructure, new database tables, or a new onboarding wizard — the audit in §2 found the mechanism already distributed across `interfaceEvolution.ts`, `selfAssembly.ts`, `badges.ts`, `scheduled-jobs.ts`, and `MonthlyPulseWidget.tsx`. Every proposal in §5 extends an existing file's existing pattern. The reconciliation in §2.6/§5.4 is the only structural change; everything else is additive copy, additive badge records, and one new metrics-view line.

---

## 7. Style compliance

- No emojis, no checkmarks-as-celebration, no superlatives in any new copy — the Month N messages in §4 already comply (existing `MONTH_MESSAGES` in `MonthlyPulseWidget.tsx` were written to this standard; new proposed copy in §5.1/§5.5 should match).
- Database-backed, not localStorage-backed, for anything that must survive across devices — the monthly-paragraph story in §5.1 is already server-computed (Job 24); only the toast's dismiss-state stays in localStorage, consistent with existing `MonthlyPulseWidget` behavior.
- Long-term growth over quick wins: the badge gap-fill in §5.3 uses day-count thresholds already in the codebase's idiom (7/14/21/30/50/60/90/100/180/365), not a new points system.

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
