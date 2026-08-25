================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT:   LOT-USERSHIP-12-MONTH-EVOLUTION
CLASS:      RESTRICTED // S-2 EYES
S-2:        VADIK MARMELADOV
DATE:       2026-08-25
VERSION:    v1.0 (design brainstorm — not yet implemented)
REFERENCE:  docs/corporate/LOT-AI-PRODUCT-BRIEF.md, docs/technical/WIDGETS.md,
            docs/technical/LOT-STYLE-GUIDE.md, docs/benchmark/LOT-LEXICON.md,
            docs/badges/BADGE_MAYAN_EVOLUTION.md, docs/benchmark/LOT-MANIFEST.md
DEMO ANCHOR: lot-systems.com/u/machiavelli — the target Month-12 silhouette
================================================================================

# LOT® Usership — The 12-Month Evolution

> "Month 1. The system is beginning to know you. ... Month 12. One year with
> LOT. The portrait is complete — and still evolving."
> — `MONTH_MESSAGES`, `src/client/components/MonthlyPulseWidget.tsx` (already shipped)

This is a design brainstorm, not a build. It proposes how the paid **Usership**
tier's UI should visibly, tangibly evolve from a barebones Day 1 surface to a
LOT® AI–grade personal instrument by Day 365 — using systems that already
exist in this codebase, wired together for the first time.

---

## 00. WHY THIS DOCUMENT EXISTS

Four separate progression systems already compute "how far along is this
person" — and none of them talk to each other:

```
SYSTEM                  ANCHOR                          LIVES IN
──────                  ──────                          ────────
Memory pacing           days since first Memory answer   src/server/utils/memory/pacing.ts
OS Version ladder       days since start + answer count   src/server/utils/monthly-summary.ts
                        (0.1.0 → 0.5.0@7d → 1.0.0@14d →
                        1.5.0@30d → 2.0.0@60d → 3.0.0@120d)
Board Tenure            months since Usership join        src/server/routes/public-api.ts
                        (citizenSince, boardTenureMonths,  (board profile, public-facing)
                        totalInvested = months × $99)
Evolution Gates         badges + streak + entry volume     src/client/utils/interfaceEvolution.ts
                        (NOT calendar-driven at all)        src/client/stores/evolution.ts

MonthlyPulseWidget      months since joinedAt              src/client/components/MonthlyPulseWidget.tsx
                        (Usership-gated, MONTH_MESSAGES     — ALREADY SHIPPED, already says
                        1–12 already written, "X / 12       "3/12 months" — just isn't wired
                        months" already on screen)          to anything else yet
```

`MonthlyPulseWidget.tsx` is the closest thing to this entire brief already
in production: it counts months since `joinedAt`, gates on the `Usership`
tag, and displays copy for exactly the arc this document is about — up to
and including "One year with LOT. The portrait is complete." **It currently
dismisses to nothing.** No widget unlocks, no badge, no story artifact, no
density change follows from it. That gap — the felt month-turn with nothing
behind it — is the single thing this brief exists to close.

The fix is not a fifth system. It's making `boardTenureMonths` (already
computed, already public on the board profile) the **one canonical month
counter**, and hanging the other three off it as views of the same number.

---

## 01. DESIGN THESIS — TWO AXES, ONE LADDER

LOT already has exactly the right split, just not wired together:

- **The TIME axis** (`boardTenureMonths`) sets the *ceiling* — what is even
  possible to unlock this month. This is ceremony: the system telling the
  person "you have been here long enough that this now exists for you."
- **The DEPTH axis** (Evolution Gates: exploration / consistency / depth /
  connection / intimacy / care / courage — already computed from real
  behavior in `interfaceEvolution.ts`) sets the *floor* — what has actually
  been earned through use within that ceiling.

```
                    ┌─────────────────────────────────────┐
Month ceiling  ───▶ │  What CAN exist this month           │
(boardTenureMonths) │  (widgets, density, story depth)     │
                    └───────────────┬───────────────────────┘
                                    │  intersect
                    ┌───────────────▼───────────────────────┐
Behavior floor ───▶ │  What actually unlocks, right now      │
(Evolution Gates)   │  (badges + streak + entries earned)    │
                    └─────────────────────────────────────┘
```

Why both, not one:

- **Month-only** turns evolution into a subscription countdown — pay 12
  months, get everything, regardless of whether the person ever opened a
  Log. That's a paywall dressed as a story.
- **Behavior-only** (today's Evolution Gates) lets a manic first week
  unlock everything and flatten the whole year into day 4. There is no
  "the portrait deepens" left to feel by month 3 — it's already deep.

The ceiling makes the floor mean something: a badge earned in month 2 reads
differently than the same badge earned in month 9, because the *stage* it
arrived on was itself earned by staying. This is exactly the "growth
through cycles, not grinding" principle already written into
`BADGE_MAYAN_EVOLUTION.md` — applied at the macro (year) scale instead of
only the micro (day-streak) scale it currently governs.

**One rule, stated plainly:** *A feature is available starting month N. Once
available, it still unlocks only when its Evolution Gate condition is met.*
Nothing currently gated by Evolution Gates loses its gate — this only adds
a floor beneath month 1–2 (nothing subscription-only should be fully open
in week one) and gives month 9–12 users something month 2 users provably
cannot have yet, regardless of how hard they use the system.

---

## 02. THE 12-MONTH LADDER

Month text below is **verbatim from the shipped `MONTH_MESSAGES` constant**
— nothing here invents new copy for the pulse itself, it only gives that
copy something to stand on. "New this month" lists what becomes possible
to unlock (ceiling); the Evolution Gate / badge / streak system already in
the repo decides whether it's earned.

```
MO  MONTH_MESSAGES (shipped)                    DENSITY TIER    OS VERSION
──  ─────────────────────────────────────────   ─────────────   ──────────
 0  (pre-Month-1 / Day 1–29, no pulse yet)       breathable      0.1.0 Initializing
 1  "The system is beginning to know you."       breathable      0.5.0 Emerging (day 7)
 2  "Patterns are starting to form."             comfortable     1.0.0 Active (day 14)
 3  "You have reached Active User status."       comfortable     1.5.0 Engaged (day 30)
 4  "The portrait deepens."                      comfortable     1.5.0 Engaged
 5  "Consistency is its own reward."             compact         1.5.0 Engaged
 6  "The journey is half-declared."              compact         2.0.0 Optimized (day 60)
 7  "The system has been listening."             compact         2.0.0 Optimized
 8  "Rare air."                                  dense           2.0.0 Optimized
 9  "The self-care practice is a habit now."     dense           2.0.0 Optimized
10  "Almost there."                              dense           3.0.0 Integrated (day 120+)
11  "One more."                                  instrument      3.0.0 Integrated
12  "One year with LOT. The portrait is          instrument      3.0.0 Integrated
    complete — and still evolving."                              + Year-One seal
```

Density tiers reuse the existing `DENSITY-TIER` lexicon token (`breathable
/ comfortable / compact / dense / instrument`, `docs/benchmark/LOT-LEXICON.md`)
and the existing `getLayoutDensity()` in `interfaceEvolution.ts` — currently
driven only by `visualRefinement`. Under this proposal, density is capped by
month and refined within that cap by the same visual-refinement score. A
month-2 power user should not be looking at `instrument` density; a month-11
casual user should not still be at `breathable`.

### Feature ceiling by month (maps to the 14 existing `FeatureUnlocks` flags)

```
MO   NEWLY POSSIBLE THIS MONTH (ceiling raised — still gated by behavior)
───  ──────────────────────────────────────────────────────────────────
1    advancedMemory                         (Memory Widget, AI-tier questions)
2    plannerTemplates, intentionHistory
3    achievementGallery, narrativeReflection  — "Active User" badge (see §04)
4    moodPatterns
5    patternInsights
6    communityRich, socialMentions            — QOS full 7-view unlock
7    customThemes
8    widgetArrange
9    badgeSelection, exportData               — "practice is a habit" seal
10   privateSpaces
11   (behavior catch-up month — no new ceiling; last chance to close gaps
     before Year-One Story-Report locks its dataset)
12   Year-One Story-Report + Legacy-tier invitation surfaced
```

This list is a proposed re-mapping of the 14 flags already defined in
`interfaceEvolution.ts` — no new flags are required, only a `monthCeiling`
lookup gating each one in addition to its existing behavioral condition.

Subscription-gated widgets that are *already* Usership-only regardless of
tenure (`CosmicUpdateWidget`, `QuantumSignWidget`, `ArchitectWidget`, board
profile QR code) slot naturally into months 6–10 above — they don't need new
gating, just a recommended *reveal* month so they don't all appear day 1 the
moment someone subscribes.

---

## 03. THE COMPRESSED MEMORY STORY — 12-MONTH DELIVERY (primary focus)

This is the part the brief asked to be the center of gravity: **the story
artifact itself must visibly thicken month over month**, or "evolution" is
just a number changing in a corner.

### 03.1 Current state — three cadences, one of them a gap

```
CADENCE   MECHANISM                              STATUS
───────   ─────────────────────────────────────  ──────────────────────
Weekly    Job 24, Sunday 18:00 UTC                LIVE — but TEMPLATE-BASED.
          (scheduled-jobs.ts)                     Aggregates dominantMood +
          → lot_ai_story log                      weekTone into 2–3 templated
          → user.metadata.weeklyStory              sentences. No LLM call.

Monthly   Monthly Email Summary, 1st @09:00 UTC   LIVE — OS version + cohort
          (monthly-summary.ts)                    evolution in an HTML email.
                                                   Also not LLM-generated prose.

On-demand Memory Story (admin/profile view)        LIVE — genuinely AI-generated
          (api.ts ~2612+)                          via Together AI, Usership-gated.
                                                    This is the ONLY cadence that
                                                   actually calls an AI engine.
```

The gap: the cadence that *should* feel most alive — the once-a-month
"here is who you were this month" — is currently the same mechanical
template as the weekly one, just re-run at a longer interval. Nothing
about month 9's monthly story is structurally richer than month 1's. That
directly undercuts the "tangible evolution" goal.

### 03.2 Proposed fix — the Compression Loop applied at three depths

`docs/corporate/LOT-AI-PRODUCT-BRIEF.md` already defines the mechanic:
`LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN`. Apply it once per
cadence, each pass compressing a longer, denser window, and — critically —
**each pass reads the previous pass's output as an input**, so months
build on months instead of re-deriving from raw logs every time:

```
WEEKLY STORY  (unchanged mechanism, template is fine here — it's a pulse,
              not a portrait)
     │  7 compressed weekly stories accumulate
     ▼
MONTHLY STORY-REPORT  (NEW — must become a real AI call, one paragraph,
                       reads the month's ~4 weekly stories + raw signal
                       peaks as context, not just mood counters)
     │  12 compressed monthly paragraphs accumulate
     ▼
YEAR-ONE STORY  (NEW — a single AI-generated page, reads all 12 monthly
                 paragraphs as its source material, explicitly callbacks
                 to month 1's opening question and month 12's answer to
                 the same theme — the "portrait is complete" payoff)
```

Each compression is real AI generation over the *prior compressions*, not
the raw log firehose — this is what makes month 12's story feel
qualitatively different from month 1's rather than just longer: it is
built from a stack of the person's own condensed history, in the machine's
accumulating understanding of their voice, exactly as the Product Brief's
"the questions become fewer and hit harder" principle describes for
questions, applied here to narrative.

### 03.3 Concrete monthly artifact — what the user actually sees

A **Memory/Story widget**, new, Usership + month-1-or-later gated:

```
Block label:  "Memory:"  (existing label taken by Memory Widget's question
              flow — recommend "Story:" or "Portrait:" to avoid collision)

View 1 (default) — Last Month's Insight
   One paragraph, AI-generated, in second person, in the operator's own
   behavioral voice (per Product Brief tone rule). Example shape, not
   final copy:
     "October asked more of your evenings than your mornings. You leaned
      on the breathing practice twice as often as September, and the
      Tuesday check-ins kept landing on 'steady' even through the two
      weeks weather turned. The system noticed you stopped skipping
      the self-care suggestion around the 15th — that's new."

View 2 (click label) — Months Unlocked
   "Months unlocked: 3 / 12"
   + a compact row of the month's badge glyphs earned so far (reuses the
     Oceanic Mayan badge set already specified, §04)

View 3 (click label) — This Month vs. Last
   A short delta line, not a chart: "Journal entries: 9 → 14. Check-ins:
   12 → 15. Self-care streak: 4 days → 11 days." Numbers already exist in
   growth-stats / OS performance endpoints — this view is presentation
   only, no new data source.
```

Placement: Subscriber Stack (existing System.tsx grouping, alongside
Cosmic Update / Quantum Sign), surfaced once per new calendar month —
same shouldShowPulse/localStorage-dismiss pattern MonthlyPulseWidget
already implements, so this can literally extend that component rather
than duplicate its cooldown logic.

### 03.4 Why paragraph, not dashboard

Per the Style Guide's "no gamification, no points" instinct and the
Product Brief's "not a summary of logs, a reflection" framing: the
monthly artifact must stay prose-first. Numbers (§03.3 View 3) exist
*behind* a click, never as the default face. The felt evolution is in the
sentence getting sharper, not a bar getting longer.

### 03.5 Year-One Story — the Month 12 payoff

On the day `boardTenureMonths` crosses 12:

- A full-page (not widget) Story-Report, reachable from the Board Profile
  and the Story widget's Month-12 state.
- Opens with a quoted callback to the person's actual first Memory answer
  or first Log entry (already in the database from day 1 — this is a
  read, not a guess).
- Closes with the current month's dominant pattern, explicitly framed as
  contrast to the opening quote.
- Offers the **Legacy tier** invite here specifically (per pricing table
  in `LOT-AI-PRODUCT-BRIEF.md`: $3,564 / 3 years, "Founders members,
  priority hardware allocation, founding attribution") — this is the one
  moment in the whole year where an upsell is earned rather than
  interruptive, because the system just proved a decade of this is worth
  having.
- Exportable via the same `POST /api/story/:week_id/export` pattern the
  Product Brief already specifies for weekly stories — generalize the
  target param (`week_id` → `period_id` covering week/month/year) rather
  than building a parallel export path.

---

## 04. BADGES — RIDING THE EXISTING MAYAN-WATER SYSTEM

`docs/badges/BADGE_MAYAN_EVOLUTION.md` already picked "Option E: Oceanic
Mayan" as the house style (circles, waves, bars — cyclical, not
game-point). Its day-based milestones (Day 7 droplet, Day 30 full tide,
Day 100 ocean depth) already sit almost exactly on the month ladder. This
proposes filling the gap between Day 100 and "forever" with explicit
**month badges 1–12**, same glyph language, so the badge shelf itself
narrates the year:

```
MONTH  GLYPH   NAME (proposed)          UNLOCK CONDITION
─────  ─────   ──────────────────────   ─────────────────────────────────
 1     ○∿      First Tide               boardTenureMonths = 1 (automatic —
                                         this one is ceremony, not earned)
 3     ≈○≈     Active Current           month ceiling reached AND
                                         Evolution Gate depth ≥ threshold
                                         ("Active User" — matches shipped copy)
 6     —○—     Half-Tide Held           month 6 AND consistency dimension
                                         above median for the cohort
 9     ○◐○     Habit Tide               month 9 AND self-care streak ≥ 20
                                         days total across the quarter
12     ≋○≋     Year Tide                month 12 — reuses the existing
                                         "Day 100: Ocean Depth" glyph
                                         family, now re-earned at the
                                         year scale — same symbol,
                                         larger meaning, deliberately
```

Reusing `≋○≋` for both "Day 100" and "Month 12" is intentional, not a
collision: the Mayan-cycle philosophy the badge doc argues for is cycles
*within* cycles. Seeing the same glyph return at the year mark, larger and
alone rather than part of a dense constellation, is the visual expression
of "the portrait is complete — and still evolving."

Server-side note (flagged, not solved here): the research pass found that
badge unlock is presently client-first with only a small hardcoded
allowlist (`milestone_7/30/100`) validated server-side. Month badges tied
to `boardTenureMonths` should be validated server-side from the start
(the date is already authoritative and server-held via `joinedAt`) rather
than added to the client-trust surface — this is the one place in this
brief where the existing pattern should *not* be extended as-is.

---

## 05. MONTH-BY-MONTH UI NARRATIVE (day-1 barebones → machiavelli-parity)

Read top to bottom as the felt experience, not a spec:

**Day 1.** Time widget, one Memory question, Log entry field, Self-care
suggestion. Nothing else visible. No board profile yet (that's a Usership
board-tenure construct starting month 1). Density: breathable — wide
margins, few blocks, no cycling views crowding the screen.

**Month 1.** MonthlyPulseWidget fires once: "The system is beginning to
know you." Story widget appears for the first time with a short, plain
first paragraph (necessarily sparse — one month of data). Board Profile
now exists and shows `citizenSince` + `boardTenureMonths: 1`.

**Month 3.** "Active User" badge and copy land together — this is the
first moment behavior (Evolution Gate depth) and ceiling (month 3) are
both visibly satisfied at once, so the badge reads as *earned*, not
handed out on a timer. Narrative Widget and Achievement Gallery open.

**Month 6.** Density steps to compact→dense transition. QOS's full
7-view panel opens (previously partial). Community Mesh widgets
(Cohort Connect, Chat Catalyst) become available. The Story widget's
paragraph is now visibly longer and starts referencing patterns across
months ("for the third month running, your evenings run calmer than
your mornings") rather than only the current month in isolation.

**Month 9.** "The self-care practice is a habit now" — Habit Tide badge.
Custom themes, widget rearrange, and data export unlock: the system is
now saying, structurally, *you may reshape this instrument yourself*.
That is the single clearest signal of graduation from "using LOT" to
"operating LOT," and it is deliberately withheld until here.

**Month 12.** Instrument density. Year Tide badge. Full Year-One
Story-Report with the opening/closing callback described in §03.5.
Board Profile now reads close to the shape of the public demo reference
at `lot-systems.com/u/machiavelli` — full psychological profile, board
tenure, QR code, custom theme, populated Memory Story, visible badge
constellation. This is the target silhouette this entire ladder is
building toward, arrived at through twelve legible steps rather than
unlocked wholesale at signup.

---

## 06. WHAT THIS DOES *NOT* PROPOSE

- No new subscription tier or price change. This is entirely a Usership
  ($99/mo) experience layer; Legacy is surfaced only as an earned
  invitation at month 12 (§03.5), never gated behind it.
- No new backend systems. `boardTenureMonths`, `interfaceEvolution.ts`,
  `MonthlyPulseWidget.tsx`, the badge registry, and the monthly-summary
  job all already exist. This is a wiring and content proposal, not new
  infrastructure — the one clear exception is making the monthly Story
  cadence an actual AI call (§03.2), which is a scoped change to an
  existing job, not a new engine.
- No change to the Evolution Gates' existing behavioral thresholds —
  this adds a month-based ceiling *alongside* them, it doesn't loosen or
  tighten what's currently required to earn any given unlock.

---

## 07. IMPLEMENTATION POINTERS (for a future build session — not done here)

```
touch point                              change
───────────                              ──────
interfaceEvolution.ts                    add monthCeiling(boardTenureMonths)
                                          lookup; intersect with existing
                                          FeatureUnlocks booleans
evolution.ts (store)                     surface monthCeiling alongside
                                          $featureUnlocks so widgets can
                                          show "unlocks month N" state
MonthlyPulseWidget.tsx                   on dismiss, if new features/badge
                                          unlocked this month, chain into
                                          the unlock toast instead of a
                                          plain dismiss phrase
NEW: StoryWidget.tsx                     §03.3 — extends MonthlyPulseWidget's
                                          cooldown/localStorage pattern
scheduled-jobs.ts (Job 24 + monthly job) monthly cadence: replace template
                                          compression with a real AI call
                                          reading the month's weekly stories
badges.ts                                add MONTH_1..MONTH_12 entries using
                                          Oceanic Mayan glyphs (§04); route
                                          month badges through server-side
                                          validation against joinedAt, not
                                          the client allowlist
public-api.ts (board profile)            no change required — boardTenureMonths
                                          already computed; becomes the read
                                          source for all of the above
```

---

## 08. OPEN QUESTIONS FOR S-2

1. Should `boardTenureMonths` reset if a Usership subscription lapses and
   resumes, or is tenure cumulative regardless of billing gaps? (Affects
   whether the Year-One Story can be "lost" — recommend cumulative; the
   Story is a relationship record, not a billing artifact.)
2. Is the monthly Story-Report meant to be exportable to the Robot/Vehicle
   API surface from month 1, or only once the Year-One Story exists?
   (Product Brief's Story API payload targets suggest robot/vehicle
   context wants the *richest* available compression — likely fine to
   export at any month, richness scales automatically.)
3. Confirm "Story:" vs. "Portrait:" as the new widget's label — "Memory:"
   is already taken by the question-flow widget and the two should not
   share a label under the clickable-label-cycling convention.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
================================================================================
