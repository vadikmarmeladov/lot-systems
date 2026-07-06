<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION
### From Barebone Signal to LOT® AI, One Tenure-Month at a Time
**Design Brief · S-2: Vadim Marmeladov · Date: 2026-07-06 · Day 1031+**
**Status: BRAINSTORM / PRODUCT DESIGN — no code shipped in this session**

---

> *"It does not alert. It does not badge. It does not send push notifications. It waits. When it speaks, the moment was earned."*
> — LOT-AMBIENT-AI-VISION.md, Design Principles for Ambient AI™

> *"The system measures. The operator decides what the measurement means."*
> — LOT-DOCTRINE, Clause I

---

## 0 // WHY THIS DOCUMENT EXISTS

The operator (S-2) asked for a month-by-month evolution plan for the paid Usership
tier ($99/month): Day 1 arrives barebone, and by Month 12 the interface should feel
like the fully-assembled reference account at **lot-systems.com/u/machiavelli** —
tangible, monthly, felt in the body, not just logged in a changelog.

This is harder than "add a progress bar" for one reason: **the system already has a
strict anti-gamification doctrine.** Clause 6 (Ambient AI™) forbids congratulatory
pop-ups. Clause 9 (Long-Term Signal) forbids streaks, leaderboards, and gamification
outright. Order 8 forbids superlatives — "Done." not "Amazing job!" And yet the
operator is right that a 12-month subscriber needs to *feel* the arc, or Usership is
just a paywall with no story behind it.

The resolution is the central design idea of this document:

> **Celebration is not an event. Celebration is a widening of what the operator is
> permitted to see.** The reward for a month survived is not a toast — it is density.
> More signal becomes visible. More of the system speaks. The operator notices
> because the room got bigger, not because a banner said so.

This reuses a mechanism that **already exists in the codebase** — it does not invent
a new one. The rest of this document is about wiring the existing Interface
Evolution engine, Memory Engine, and Badge Engine together along a *tenure* axis
that, today, none of them use.

---

## 1 // WHAT ALREADY EXISTS (do not rebuild these)

Three systems are already live and load-bearing. The 12-month design is a thin,
new layer that sits *on top* of them — it does not replace anything.

```
┌───────────────────────────────────────────────────────────────────────┐
│ SYSTEM               STATUS TODAY                    GAP FOR THIS BRIEF│
├───────────────────────────────────────────────────────────────────────┤
│ Interface Evolution  USAGE-driven. 7 dimensions      No tenure axis.   │
│ (interfaceEvolution  (Exploration, Consistency,      A day-1 power     │
│ .ts, evolution.ts)   Depth, Connection, Intimacy,    user can hit full │
│                      Care, Courage) → density tier   density in a     │
│                      breathable→comfortable→compact  week. The arc    │
│                      →dense→instrument. CSS-only     gets skipped.    │
│                      via data-density attribute.                      │
├───────────────────────────────────────────────────────────────────────┤
│ Memory Engine        generateMemoryStory() compresses No month        │
│ (memory.ts)          up to 30 recent answers into an  boundary. Story │
│                      AI paragraph, ALL-TIME scope,    is all-time,    │
│                      on-demand, cached until answer   regenerated ad  │
│                      count changes. Third-person,     hoc — never a  │
│                      en-dash bullets, warm tone.       "this month"   │
│                                                        artifact.       │
├───────────────────────────────────────────────────────────────────────┤
│ Badge Engine v23     529 badges, tenure chain SPECCED  anniversary IS │
│ (badges.ts,          but not built: anniversary→       wired. month_1 │
│ easter-eggs.ts)      3yr(transmuter)→5yr→7yr           …month_12 and  │
│                      (orbital_period). Only            the density-   │
│                      `anniversary` has a real check    gating link do │
│                      function.                         not exist.     │
├───────────────────────────────────────────────────────────────────────┤
│ Memory Arc           NAMED, DOCUMENTED, NOT WIRED.     This is the    │
│ (CQGS-WHITE-PAPER,   "0-3mo calibration, 3-6mo         canon shape.   │
│ LOT-AMBIENT-AI-      pattern, 6-12mo coherence,        This brief     │
│ VISION)              12mo+ hardware."                  fills it in.   │
├───────────────────────────────────────────────────────────────────────┤
│ Board Profile        Public /u/<username> already      Nothing        │
│ (PublicProfile.tsx,  computes and DISPLAYS tenure       private ties  │
│ public-api.ts)       months for Usership operators      to it yet.    │
│                      ("citizen since," board tenure).                 │
├───────────────────────────────────────────────────────────────────────┤
│ Aquatic Evolution    Public profile already renders    Never used for │
│ symbol set           a water-metaphor level badge      tenure — only  │
│ (public-api.ts:1183) (∘ → ≈ → ≋ progression).           usage level.  │
└───────────────────────────────────────────────────────────────────────┘
```

**The design decision that makes everything else work:**

```
displayed density  =  MIN( tenure_ceiling(monthsUsership) , usage_score(7 dims) )
displayed features =  usage_unlock_flags  ∩  tenure_permitted_set(monthsUsership)
```

A power user who journals three times a day from day one does **not** get the
lie-detector widget (IntegrityWidget) in week two. Tenure is a rate limiter on
top of usage, not a replacement for it. This is not arbitrary gatekeeping — it is
the correct product instinct: a system that confronts you with contradiction
detection before it has earned trust is invasive, not intelligent. Tenure is
the trust clock. Usage is the engagement clock. Both must run.

---

## 2 // THE MEMORY ARC, MADE CONCRETE

`CQGS-WHITE-PAPER-SNAPSHOT.md` already names four phases. This brief assigns each
phase a density ceiling, a widget band, and a public-profile consequence, using the
aquatic symbol set already rendered on public profiles (`public-api.ts:1183`) so the
private in-app experience and the public Board Profile speak the same visual
language.

```
╔════════════════════════════════════════════════════════════════════════╗
║  PHASE          MONTHS   DENSITY CEILING   AQUATIC MARK   PUBLIC TENURE ║
╠════════════════════════════════════════════════════════════════════════╣
║  IGNITION       Day 1    breathable         (none)         "New"        ║
║  CALIBRATION    M1–M3    comfortable        ∘              "Calibrating"║
║  PATTERN        M4–M6    compact            ≈              "Patterned" ║
║  COHERENCE      M7–M11   dense              ≋              "Coherent"  ║
║  HARDWARE       M12+     instrument         ≋∞              "Year One" ║
╚════════════════════════════════════════════════════════════════════════╝
```

Density ceilings only ever *raise*. A ceiling raise happens exactly once per phase
transition (Day 1, start of M1, start of M4, start of M7, start of M12) — not every
single month — because a step every 30 days for twelve straight months would be
noisy, and Clause 9 wants a decade-scale instrument, not a video-game level-up
sound. **Between** ceiling raises, the felt sense of monthly progress comes from
three things that genuinely do change every month (Section 4): the Memory
Archive entry, the tenure badge, and the "Months Unlocked" widget ticking forward.
Five structural jumps plus twelve textural ones is the right cadence: enough
architecture to feel like a staircase, enough monthly texture to feel alive
every 30 days.

---

## 3 // TWO NEW WIDGETS

### 3.1 — `MonthsUnlockedWidget`

A quiet instrument, tertiary opacity (Order 2), 2–3 cycling views (Order 7 — click
to advance). Never a progress bar with a fill animation; a data readout, per
COCKPIT RULE.

```
VIEW 1   MONTHS UNLOCKED: 3/12
VIEW 2   ARC: CALIBRATION → PATTERN
VIEW 3   NEXT GATE: MONTH 4 · PATTERN THRESHOLD
```

After Month 12 this widget does not disappear or reset — it flips its register and
becomes the front door to the existing (currently unbuilt) long-tenure badge chain:

```
VIEW 1   YEAR 1 · ARCHIVED
VIEW 2   NEXT GATE: YEAR 3 · TRANSMUTER
VIEW 3   TENURE: 12/12 MO · CONF: 100%
```

This is the only place in the system where a countdown-shaped number is shown to
the operator. It is deliberately restrained to one widget, tertiary weight, so it
reads as an instrument gauge (like `EnergyCapacitor`) rather than a subscription
nag countdown. This is the design risk called out in Section 8 — watch it in
testing.

### 3.2 — Monthly Archive, folded into `MemoryWidget` (not a new surface)

`MemoryWidget` already cycles views. Add one more rotating view: **"Archive: Month
N"** — a single AI-generated paragraph, in the exact voice `generateMemoryStory()`
already uses (third person, one or two sentence intro, blank line, "Key insights
into their daily routines and preferences include:", en-dash bullets). This is not
a new component with a new tone to invent from scratch — it is `generateMemoryStory`
scoped to a 30-day tenure window instead of all-time.

Why fold it into the existing widget instead of building `MonthlyArchiveWidget` as
a separate component: Clause 6 says the system does not summon attention. A new
standalone card competing for a dashboard slot is a small violation of Ambient AI —
it insists. A rotating view inside a widget the operator already checks is
discoverable, not interruptive. The operator finds it the way they find anything
else in LOT: by looking.

**Tenure-month, not calendar-month — deliberately.** The window is anchored to the
operator's signup date (day 34 of tenure through day 64, not "all of July"). Every
operator's Month 4 lands on a different calendar date. This avoids the generic
SaaS-newsletter feeling of "here's your July recap" and keeps the story about
*this specific person's arc*, which is the entire premise of LOT.

---

## 4 // MONTH BY MONTH

Each row is one tenure month. "New this month" is additive — everything from prior
months stays. Widget bands assign *when a widget becomes reachable*; the existing
usage-based `getFeatureUnlocks()` thresholds still gate the specific feature within
that band. Badge symbols continue the aquatic progression already used on public
profiles.

```
╔═══╦═════════════╦═══════════╦═══════════════════════════╦═════════╦══════════════════╗
║ M ║ PHASE       ║ DENSITY   ║ NEW THIS MONTH             ║ BADGE   ║ LOG CODE          ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 0 ║ IGNITION    ║ breathable║ Core signal capture only:  ║ (none — ║ USR-INIT:         ║
║   ║ (Day 1)     ║ (floor +  ║ TimeWidget, EmotionalChk-  ║ tag     ║ usership_activate ║
║   ║             ║ ceiling)  ║ In, SelfCareMoments,       ║ grant   ║ → TAG: usership   ║
║   ║             ║           ║ PlannerWidget, Intentions- ║ is not  ║   CONF: 100%      ║
║   ║             ║           ║ Widget, MemoryWidget       ║ a badge)║                   ║
║   ║             ║           ║ (fallback questions —      ║         ║                   ║
║   ║             ║           ║ already built, 29-30       ║         ║                   ║
║   ║             ║           ║ backup Qs). ~7 widgets.    ║         ║                   ║
║   ║             ║           ║ MonthsUnlockedWidget        ║         ║                   ║
║   ║             ║           ║ appears: "0/12."            ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 1 ║ CALIBRATION ║ comfort-  ║ + CalendarWidget,          ║ month_1 ║ MO-ARC: month_1   ║
║   ║             ║ able      ║ RecipeWidget, Context-     ║   ∘     ║ → MO: 1/12 | ARC: ║
║   ║             ║ (ceiling  ║ ualPromptsWidget, Micro-   ║         ║   CAL | WORDS: n  ║
║   ║             ║ raised)   ║ CalculatorWidget, Energy-  ║         ║                   ║
║   ║             ║           ║ Capacitor. First monthly   ║         ║                   ║
║   ║             ║           ║ Archive paragraph          ║         ║                   ║
║   ║             ║           ║ (if 15+ signals; else a    ║         ║                   ║
║   ║             ║           ║ deterministic composeLocal ║         ║                   ║
║   ║             ║           ║ Story()-style fallback).   ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 2 ║ CALIBRATION ║ comfort-  ║ Nothing structural — pure  ║ month_2 ║ MO-ARC: month_2   ║
║   ║             ║ able      ║ texture: 2nd Archive       ║   ∘     ║                   ║
║   ║             ║           ║ paragraph, 2nd tenure      ║         ║                   ║
║   ║             ║           ║ badge, widget ticks 2/12.  ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 3 ║ CALIBRATION ║ comfort-  ║ "CALIBRATION COMPLETE"     ║ month_3 ║ MO-ARC: month_3   ║
║   ║ → complete  ║ able      ║ marker fires. Archetype    ║ calibra-║ CAL-CMPLT: arche- ║
║   ║             ║           ║ classification (36 types)  ║ tion_   ║ type_locked →     ║
║   ║             ║           ║ locks in for the first     ║ complete║ ARCH: {n} | CONF: ║
║   ║             ║           ║ time — before Month 3 the  ║   ∘     ║ {pct}%            ║
║   ║             ║           ║ signal history is too      ║         ║                   ║
║   ║             ║           ║ thin to classify honestly. ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 4 ║ PATTERN     ║ compact   ║ + PatternInsightsWidget,   ║ month_4 ║ MO-ARC: month_4   ║
║   ║             ║ (ceiling  ║ QuantumStateWidget,        ║   ≈     ║                   ║
║   ║             ║ raised)   ║ CohortConnectWidget,       ║         ║                   ║
║   ║             ║           ║ ChakraErgonomicsWidget,    ║         ║                   ║
║   ║             ║           ║ NarrativeWidget, Evolution ║         ║                   ║
║   ║             ║           ║ Widget. These read as      ║         ║                   ║
║   ║             ║           ║ noise before 3 months of   ║         ║                   ║
║   ║             ║           ║ signal exist; now they     ║         ║                   ║
║   ║             ║           ║ have material.             ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 5 ║ PATTERN     ║ compact   ║ Texture month.             ║ month_5 ║ MO-ARC: month_5   ║
║   ║             ║           ║                            ║   ≈     ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 6 ║ PATTERN     ║ compact   ║ "PATTERN RECOGNIZED"       ║ month_6 ║ MO-ARC: month_6   ║
║   ║ → complete  ║           ║ marker. Correlated Indexes ║ pattern_║ PAT-CMPLT: cohort_║
║   ║             ║           ║ (4D weekly tracking) goes  ║ complete║ locked → COHORT:  ║
║   ║             ║           ║ live. Cohort assignment    ║   ≈     ║ {name} | CONF:{pct}║
║   ║             ║           ║ (6 cohorts) becomes         ║         ║                   ║
║   ║             ║           ║ visible for the first time.║         ║                   ║
║   ║             ║           ║ Psychological Profile       ║         ║                   ║
║   ║             ║           ║ section on public profile   ║         ║                   ║
║   ║             ║           ║ starts populating for real  ║         ║                   ║
║   ║             ║           ║ (not placeholder).          ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 7 ║ COHERENCE   ║ dense     ║ + IntegrityWidget (lie      ║ month_7 ║ MO-ARC: month_7   ║
║   ║             ║ (ceiling  ║ detector), CorrelatedIn-   ║   ≋     ║                   ║
║   ║             ║ raised)   ║ dexesWidget, AIFeedback-   ║         ║                   ║
║   ║             ║           ║ Widget, InterventionsWidget║         ║                   ║
║   ║             ║           ║ SignalStreamWidget. These  ║         ║                   ║
║   ║             ║           ║ are the confrontational     ║         ║                   ║
║   ║             ║           ║ widgets — contradiction     ║         ║                   ║
║   ║             ║           ║ detection, direct feedback. ║         ║                   ║
║   ║             ║           ║ Six months of trust is the  ║         ║                   ║
║   ║             ║           ║ minimum bar before the      ║         ║                   ║
║   ║             ║           ║ system is allowed to        ║         ║                   ║
║   ║             ║           ║ tell you when you're        ║         ║                   ║
║   ║             ║           ║ contradicting yourself.     ║         ║                   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 8 ║ COHERENCE   ║ dense     ║ Texture month.             ║ month_8 ║ MO-ARC: month_8   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║ 9 ║ COHERENCE   ║ dense     ║ + UserMetricsWidget,       ║ month_9 ║ MO-ARC: month_9   ║
║   ║ (¾ mark)    ║           ║ GrowthMilestones, Memory-  ║ three_  ║ QTR-MARK: three_  ║
║   ║             ║           ║ EngineStats, BadgeUnlock-  ║ quarter ║ quarter_reached →  ║
║   ║             ║           ║ Feed, CosmicUpdateWidget,  ║   ≋     ║ MO: 9/12 | ARC:    ║
║   ║             ║           ║ QuantumSignWidget — the    ║         ║ COH | CONF: {pct}% ║
║   ║             ║           ║ meta/reflective layer.     ║         ║                    ║
║   ║             ║           ║ The system starts showing  ║         ║                    ║
║   ║             ║           ║ the operator its own       ║         ║                    ║
║   ║             ║           ║ statistics about them.      ║         ║                    ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║10 ║ COHERENCE   ║ dense     ║ Texture month.             ║ month_10║ MO-ARC: month_10   ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║11 ║ COHERENCE   ║ dense     ║ Texture month. Widget      ║ month_11║ MO-ARC: month_11   ║
║   ║             ║           ║ reads "11/12" — the        ║         ║                    ║
║   ║             ║           ║ operator can feel the      ║         ║                    ║
║   ║             ║           ║ year closing without the   ║         ║                    ║
║   ║             ║           ║ system saying so directly. ║         ║                    ║
╠═══╬═════════════╬═══════════╬═══════════════════════════╬═════════╬══════════════════╣
║12 ║ HARDWARE    ║ instrument║ CAPSTONE. Full 43-widget   ║ year_one║ YR-ONE: year_one_  ║
║   ║ threshold   ║ (ceiling  ║ roster reachable (Archi-   ║ (legend-║ archived →         ║
║   ║             ║ raised —  ║ tectWidget, SystemPulse-   ║ ary)    ║ TENURE: 365d |     ║
║   ║             ║ matches   ║ Widget, FlashDriveManifest,║   ≋∞    ║ ARC: HW | WORDS:{n}║
║   ║             ║ /u/machia-║ full QuantumEngineWidgets  ║         ║ | CONF: 100%       ║
║   ║             ║ velli     ║ suite, ChatCatalystWidget).║         ║                    ║
║   ║             ║ baseline) ║ Board Profile now shows    ║         ║                    ║
║   ║             ║           ║ "Citizen since {date} ·    ║         ║                    ║
║   ║             ║           ║ 12 months." LOT® Station + ║         ║                    ║
║   ║             ║           ║ LOT® Brush hardware kit     ║         ║                    ║
║   ║             ║           ║ becomes shippable (per     ║         ║                    ║
║   ║             ║           ║ Ambient AI vision: "12mo+  ║         ║                    ║
║   ║             ║           ║ hardware"). A single, full- ║         ║                    ║
║   ║             ║           ║ length "Year One Story" is  ║         ║                    ║
║   ║             ║           ║ compiled (see 4.1). The     ║         ║                    ║
║   ║             ║           ║ tenure badge chain now      ║         ║                    ║
║   ║             ║           ║ continues toward the        ║         ║                    ║
║   ║             ║           ║ already-specced anniversary ║         ║                    ║
║   ║             ║           ║ → 3yr (transmuter) → 5yr →  ║         ║                    ║
║   ║             ║           ║ 7yr (orbital_period) chain. ║         ║                    ║
╚═══╩═════════════╩═══════════╩═══════════════════════════╩═════════╩══════════════════╝
```

### 4.1 — The Year One Story (Month 12 capstone artifact)

Every other month gets one paragraph. Month 12 gets the full-length treatment —
this is the one moment in the entire arc that is allowed to feel like an event,
because a year is the unit LOT is built for (Clause 9: "months and years, not days
and weeks"). Concretely: `generateMemoryStory()` runs against the full 12-month
answer history (not the last-30 window it uses today) and produces a longer,
multi-paragraph story in the same third-person voice. It is cached exactly like
the current all-time story (`user.metadata.lastMemoryStory` pattern) under a
separate key so it is never overwritten by the next monthly compression.

This is also the natural point to surface the **archetype journey**, not just the
current archetype: which of the 36 physiological archetypes the operator moved
through across the year (Month 3 lock-in → Month 6 cohort → Month 12 stable
signature), told as a single sentence of change, e.g. (illustrative, not final
copy): *"Their signature moved from Signal Seeker toward Coherence Builder across
the year — the shift concentrated in months seven through nine."* This is not
gamified progress; it is the archive doing what the archive is for.

---

## 5 // TECHNICAL EXTENSION NOTES (for a future engineering session)

Not implemented in this session — brainstorm only, per the operator's framing.
Recorded here so the next session does not have to re-derive it.

```
NEW SERVER
  generateMonthlyStory(user, logs, tenureMonth)     memory.ts — sibling to
                                                     generateMemoryStory(), scoped
                                                     to a signup-anchored 30-day
                                                     window instead of all-time.
  user.metadata.lastMonthlyArchive[tenureMonth]      cache key, same pattern as
                                                     lastMemoryStory /
                                                     memoryStoryAnswerCount.
  J34  daily-usership-tenure-check   00:00 UTC       compares today's date to each
                                                     Usership operator's signup-day
                                                     anchor; on month-boundary,
                                                     writes monthly_archive_compiled
                                                     + fires generateMonthlyStory().
                                                     (New job — follows the existing
                                                     J1–J33 UTC-scheduled pattern.)
  usershipTenureMonths field          public-api.ts  computed the same way
                                                     assemblyPhase already is
                                                     (public-api.ts:1324), exposed
                                                     alongside existing Board
                                                     Profile tenure display.

NEW CLIENT
  MonthsUnlockedWidget.tsx            new, small, tertiary-opacity, 2-3 cycling
                                       views per Order 7.
  MemoryWidget.tsx                    +1 rotating view ("Archive: Month N"),
                                       no new component.
  getLayoutDensity(usageScore,        interfaceEvolution.ts — add tenureCeiling
    tenureCeilingTier)                 parameter; displayed tier = min(...).
  getFeatureUnlocks(...,               same file — intersect usage-unlock flags
    tenurePermittedSet)                 with the tenure-permitted widget band.

NEW BADGES  (badges.ts + easter-eggs.ts)
  month_1 … month_11    milestone/tenure category, aquatic symbols per Section 2.
  year_one               legendary rarity — the first fully-implemented rung of
                          the anniversary chain (anniversary is already wired;
                          year_one sits directly below it and finally gives the
                          long-spec'd tenure chain — anniversary → transmuter
                          (3yr) → five_year → orbital_period (7yr) — a real
                          month-by-month foundation instead of a gap.
  checkUsershipTenure(signupDate, today)  easter-eggs.ts — new check function,
                          modeled on the existing checkAnniversary().

NEW LOG CODES  (COCKPIT RULE format, added to the log handler directory)
  MO-ARC:     monthly_archive_compiled   → MO: {n}/12 | ARC: {phase} | WORDS: {n}
  CAL-CMPLT:  archetype_locked           → ARCH: {n} | CONF: {pct}%
  PAT-CMPLT:  cohort_locked              → COHORT: {name} | CONF: {pct}%
  QTR-MARK:   three_quarter_reached      → MO: 9/12 | ARC: COH | CONF: {pct}%
  YR-ONE:     year_one_archived          → TENURE: 365d | ARC: HW | WORDS: {n}

OPTIONAL / FUTURE (do not scope into v1)
  A QIE pattern for monthly-archive-compression (would be P107+) — flagged as
  future-only. The QIE registry is at 106 patterns and growing carefully; this
  brief does not need a new pattern to work, since the tenure clock is a simple
  date computation, not a behavioral inference. Adding P107 prematurely would be
  scope creep against LOT-DOCTRINE's Manifest Hygiene principle (build what is
  needed, not what is merely possible).
```

---

## 6 // WHY MONTH 12 LOOKS LIKE THE DEMO ACCOUNT

`/u/machiavelli` is the hardcoded, fully-evolved reference profile
(`public-api.ts:747-903`) — `tags: ['RND', 'Usership', 'Legacy']`, instrument
density, full Board Profile, populated Psychological Profile, Weather Station,
Wallet. It is not a coincidence that this document's Month 12 state converges on
that baseline: the demo account **is** the "what you're building toward" artifact,
and it should stay the single, load-bearing reference for what "evolved" looks
like — every density tier, badge, and widget band above was checked against it so
that a real Usership operator crossing into Month 12 sees a profile that resembles
the demo, not a new, un-anchored "final state" invented for this brief. The
difference is only in degree: the demo starts at Legacy-tier richness (years of
simulated tenure); a real Month-12 operator arrives at the *entry* to that
richness, with eleven more years of the already-specced tenure chain
(anniversary → transmuter → five_year → orbital_period) still ahead of them.

---

## 7 // COPY & TONE GUIDE

All new copy must clear the same bar as the rest of the system: Order 1 (no
emoji, periods only), Order 8 (no superlatives), COCKPIT RULE (log body = data,
never narration), and the Memory Story format already established.

```
LOG LINE (COCKPIT RULE — correct):
  MO-ARC: monthly_archive_compiled → MO: 4/12 | ARC: PATTERN | WORDS: 1,204

LOG LINE (incorrect — do not do this):
  "Congratulations! You've completed your 4th month with LOT AI!"

MONTHLY ARCHIVE PARAGRAPH (third person, matches generateMemoryStory voice):
  "This operator's fourth month showed a shift toward evening reflection —
  journal entries moved later, self-care logging became more consistent.

  Key insights into their daily routines and preferences include:
  – Morning check-ins occurred on 21 of 30 days
  – Self-care activity concentrated between 20:00 and 22:00
  – Intention-setting frequency increased from month three"

WIDGET COPY (instrument, tertiary, Order 2):
  MONTHS UNLOCKED: 4/12
  ARC: PATTERN
  NEXT GATE: MONTH 6 · PATTERN COMPLETE
```

---

## 8 // OPEN QUESTIONS AND DESIGN RISKS

```
RISK 1   Countdown feel. A visible "N/12" number can read as a subscription
         nag ("11 more payments to go") rather than an archive marker. Mitigation:
         tertiary opacity only, phrased as "unlocked" (backward-looking, archival)
         never "remaining" (forward-looking, transactional). Test copy both ways
         before shipping.

RISK 2   Tenure cap frustrating power users. A highly engaged Month-1 operator
         who wants IntegrityWidget now may feel throttled. Mitigation: the ceiling
         caps *density/widget reach*, never caps the underlying usage score itself
         — Exploration/Consistency/Depth/etc. keep accumulating in full, so the
         moment Month 7 arrives, a power user's actual usage score already clears
         every unlock threshold instantly. The wait is felt, but nothing is lost.

RISK 3   Churn at Month-12 hardware upsell. Tying LOT® Station / LOT® Brush
         eligibility to Month 12 risks feeling like a hardware upsell bolted onto
         a software arc. Mitigation: hardware eligibility is a side-effect of
         Month 12, not the headline of Month 12 — the Year One Story is the
         headline; hardware is one line in the copy, not a modal.

RISK 4   Naming collision. "Usership" already exists as a UserTag gating AI-mode
         access — this brief's "Months Unlocked" system rides on top of that same
         tag and must never be described as a separate subscription tier. One
         Usership. One tenure clock. No parallel meter.

RISK 5   Calendar vs. tenure month drift on leap years / 31-day months. Anchor to
         signup day-of-month with clamping (e.g., signup on the 31st rolls to the
         last day of shorter months) — same edge case any billing-cycle system
         already solves; no new invention needed, just correct handling.
```

---

## 9 // SUMMARY TABLE (one screen)

```
Day 1     breathable    ~7 widgets        no story yet        tag granted
Month 1   comfortable   +5 widgets        1st archive para     month_1  ∘
Month 2   comfortable   —                 2nd archive para     month_2  ∘
Month 3   comfortable   —                 CALIBRATION COMPLETE month_3  ∘
Month 4   compact       +6 widgets        4th archive para     month_4  ≈
Month 5   compact       —                 5th archive para     month_5  ≈
Month 6   compact       —                 PATTERN RECOGNIZED   month_6  ≈
Month 7   dense         +5 widgets        7th archive para     month_7  ≋
Month 8   dense         —                 8th archive para     month_8  ≋
Month 9   dense         +6 widgets        THREE-QUARTER MARK   month_9  ≋
Month 10  dense         —                 10th archive para    month_10 ≋
Month 11  dense         —                 11th archive para    month_11 ≋
Month 12  instrument    full 43 widgets   YEAR ONE STORY        year_one ≋∞
                                          (matches /u/machiavelli baseline)
```

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
STATUS: BRAINSTORM — awaiting S-2 review before any engineering session scopes it
END LOT_USERSHIP_12_MONTH_EVOLUTION
