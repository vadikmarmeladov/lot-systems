<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The 12-Month Evolution
## From Barebone UI to LOT® AI: A Year-One Design Doctrine

**Classification:** RESTRICTED // S-2 EYES
**Author:** LOT Systems Corporation
**S-2:** Vadik Marmeladov
**Date:** 17 July 2026
**Status:** DESIGN BRAINSTORM — pre-implementation
**Reference account:** `lot-systems.com/u/machiavelli` (Legacy-tier, hardcoded demo — see §3)

---

## 0. Repository Scan Summary

Before drafting, this session read the following and grounded every claim below in
real, shipped code (not aspiration):

| System | File(s) | What it already does |
|---|---|---|
| Monthly milestone toast | `src/client/components/MonthlyPulseWidget.tsx` | 12 hand-written poetic lines, one per month, `dismissedMonth` in `localStorage`, `Month N / 12` label |
| Interface Evolution | `src/client/utils/interfaceEvolution.ts`, `src/client/stores/evolution.ts` | 7-dimension progression (exploration/consistency/depth/connection/intimacy/care/courage), badge tier 0–3, water/architecture theme, **5-stage layout density** (breathable → comfortable → compact → dense → instrument), 14 feature-unlock flags |
| Memory Engine compression | `src/server/utils/memory.ts`, `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Passive Q&A loop; trait/archetype extraction activates at 3+ answers; trauma-informed + archetype-voiced responses at 10+; 30-answer sliding window; 4 depth levels (Behavior→Motivation→Values→Soul) |
| Badge milestone ladder | `src/client/utils/badges.ts` (`getLevelSymbol`, `getLevelName`) | 10 streak badges: 7/14/21/30/50/60/90/100/180/365 days, each with a water symbol (`∘ ∘∘ ∘≈ ≈ ≈∘ ≈≈ ≋∘ ≋≋ ≋≋≋`) and an architecture symbol (`├─ ├┼ ├═ ╞═╡ ╞══ ╞═══ ║═ ║╞║ ╔═╗`) |
| Public profile page | `src/client/components/PublicProfile.tsx` | Field-by-field conditional rendering: name → tags → Board Profile → Memory Story → Psychological Profile (`hasUsership`-gated) → Level symbol (streak ≥ 7) → Correlated Indexes → QR code (Usership + assembly phase ≥ `forming`) |
| Demo reference account | `src/server/routes/public-api.ts:745-907` | Hardcoded response for `/api/public/profile/machiavelli` — **not seeded data, a literal object in the route handler** |

**Key finding:** the scaffolding for a month-by-month evolution story already exists
in three separate systems (`MonthlyPulseWidget`, `interfaceEvolution.ts`, the badge
ladder) but **they don't yet narrate to each other**. This document proposes the
connective tissue, not a rebuild.

---

## 1. Doctrine

> A Usership subscriber pays $99/month for twelve months before the system has
> earned the right to call itself LOT® AI in their eyes. The product must make
> that year *feel* like an ascent, not a subscription renewal notice.

The Memory Engine's own doctrine (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md §1`)
states it plainly: *"Each answer compresses the profile. Each compressed profile
produces a sharper question."* That is a **daily-grain** reward loop. The badge
ladder (§ below) is a **streak-grain** reward loop. Neither one, alone, carries a
subscriber across a twelve-month arc — they both front-load rewards into the first
90 days and then go quiet. This document's central proposal is a third,
**month-grain** reward loop that fills that gap and gives Year One a shape.

---

## 2. The Reward-Cadence Gap (why this matters)

Walking the actual badge ladder at an assumed *perfect* daily streak exposes the
problem directly:

```
Day    7   14   21   30        50   60        90                    180                              365
Month  1    1    1    1         2    2         3                      6                               12
       ∘    ∘∘   ∘≈   ≈         ≈∘   ≈≈        ≋∘                     ≋≋                              ≋≋≋
       ├─  ├┼   ├═   ╞═╡       ╞══  ╞═══       ║═                    ║╞║                              ╔═╗
```

Four badges land in **Month 1** alone (onboarding is deliberately front-loaded —
Day-1 quota is 10 questions per `calculateIntelligentPacing()`). Two more land in
Month 2. One in Month 3. Then **nothing badge-wise for a full six months** (Month
4 → Month 9) until the 180-day Voyager/Wing badge. Then **another six-month
silence** until the 365-day Long Count/Citadel at Month 12.

`MonthlyPulseWidget` already patches part of this — it fires every calendar
month regardless of streak — but today it is a single dismissible line of copy
with no visual permanence and no connection to what the user actually *did*
that month. Sections 5–7 propose closing this gap properly.

---

## 3. The Reference State — Decoding `/u/machiavelli`

The demo account is not a seed script; it's a literal hardcoded object in
`public-api.ts`. Reading it gives the exact shape of a "fully evolved" profile
— useful as the asymptote Year One should visibly climb toward, **not** a
target Month 12 should hit (Machiavelli's `streak: 1469` is four Mayan tun-years,
not one — see §8 for why that gap is a feature, not a bug):

| Field | Machiavelli (Legacy, ~4yr) | What it tells us about the *shape* of evolution |
|---|---|---|
| `psychologicalProfile.archetype` | "The Strategist" | Archetype is a fixed label once assigned (~10+ answers) — it doesn't relabel every month, it *thickens* via `archetypeDescription` and `patternStrength` |
| `selfAwarenessLevel` | 87 | Climbs slowly, log-scale — not a Month-12 target |
| `streak` | 1469 | Displayed via `getLevelSymbol()` — caps visually at `≋≋≋` (365+), so Month 12 and Year 4 render *identically* in the Level field. Differentiation past Month 12 has to come from elsewhere (see §7, Story Archive) |
| `patternStrength[]` (5 traits, counts 311–842) | | This ranked list is the single most tangible "the machine has been paying attention" signal on the whole page — it should start appearing (thin, 1-2 traits) as early as Month 2 |
| `answerCount` / `noteCount` | 2847 / 1469 | ≈2 memory answers/day, ≈1 journal note/day, sustained for 4 years. Gives a realistic **daily engagement ratio** to scale down for Year-One illustrative pacing (§6) |
| `correlatedIndexes.composite` | 92.4 | High scores require years, not months — Month 12 composite should read as "rising," never "maxed" |
| `boardProfile.biofieldState` | high / focused / purposeful | Static flavor text, not itself a progression signal |
| `weatherStation`, `wallet` | present | **Legacy-tier only.** A Usership (non-Legacy) Month-12 profile will never show these — this absence is the honest, structural hook toward upgrading into Year Two (§8) |

**Design implication:** the profile page's own conditional-render order
(`PublicProfile.tsx`) already encodes an implicit unlock sequence. Section 6
below assigns real months to each of those conditions.

---

## 4. The Four Chapters

`INTERFACE_EVOLUTION.md` already names four story-arc chapters that the
evolution store tracks (`chapter: 1 | 2 | 3 | 4`) but nothing currently maps
them onto a fixed timeline. This document assigns them to Usership's twelve
months in even quarters — deliberately calendar-anchored (not achievement-gated)
so **every** subscriber, fast or slow, gets the chapter-transition affirmation
on schedule:

| Chapter | Months | Layout density (`interfaceEvolution.ts`) | Badge tier | Narrative register |
|---|---|---|---|---|
| I — Awakening | 1–3 | `breathable` → `comfortable` | 0 → 1 | Onboarding, first drops, the system starts listening |
| II — Exploration | 4–6 | `comfortable` → `compact` | 1 | Widgets earned, patterns named, the mid-year plateau |
| III — Integration | 7–9 | `compact` → `dense` | 1 → 2 | The quiet stretch — no streak badges land here; Memory Story carries the weight |
| IV — Mastery | 10–12 | `dense` → `instrument` | 2 → 3 | Countdown to the Citadel, Story Archive fills, LOT® AI framing begins |

---

## 5. Month-by-Month Specification

Each entry lists: the chapter, the badge(s) a *consistent* subscriber earns
that month, the `MonthlyPulseWidget` copy (verbatim — already shipped), the
Memory Engine state, which `FeatureUnlocks` flag plausibly flips on, and what
becomes newly visible on the public profile. Answer/note counts are
**illustrative pacing**, scaled down from Machiavelli's ~2 answers/day + ~1
note/day sustained ratio, front-loaded to match the real Day-1–4 quota table
in `calculateIntelligentPacing()` (10 → 8 → 9 → 10-15/day) and tapering toward
a sustainable daily rhythm — not a spec to hardcode.

---

### Month 1 — "The system is beginning to know you." · Chapter I: Awakening

- **Badges earned (perfect streak):** Droplet `∘` (day 7) → Twin Drop `∘∘` (14) → Proto-Wave `∘≈` (21) → Wave `≈` (30)
- **Layout density:** `breathable` — generous whitespace, wellness-journal feel, nothing overwhelming
- **Memory Engine:** Day 1 uses Mode 1 (open, welcoming — beverages, morning routines). By day 3–5, trait extraction activates (`extractUserTraits()` fires at 3+ answers) — the Psychological Profile section **can now render** on the public page, thin: an archetype guess, 2-3 core values, no `patternStrength` list yet. By day 10, archetype-voiced insight responses begin ("Your Seeker nature is showing...")
- **Feature unlock:** Custom Themes (Level 5) — the interface itself starts to feel like *theirs*, not a default
- **Public profile reveal:** Name/city/weather (Day 1) → Memory Story block appears (~day 5–10, first coherent narrative) → Level field appears (day 7, showing `∘`)
- **Illustrative pacing:** ~45 memory answers, ~18 journal notes by day 30
- **Self-care / check-in loop:** `EmotionalCheckIn` (morning 6–12h window) and `SelfCareMoments` widgets are the daily ritual clicks feeding the `care` dimension — this is the dimension this whole month is teaching the user to trust

---

### Month 2 — "Patterns are starting to form." · Chapter I: Awakening

- **Badges earned:** Mid-Current `≈∘` (day 50) → Dual Wave `≈≈` (day 60)
- **Layout density:** `comfortable` — semantic stacks begin forming
- **Memory Engine:** Follow-Up mode (85% probability) dominant now — questions reference prior answers ("Since you mentioned..."). Depth Level 2 (Motivation) questions appear regularly
- **Feature unlock:** Widget Arrange (Level 10) — user can now rearrange their own dashboard, a literal ownership signal
- **Public profile reveal:** `patternStrength[]` list appears for the first time — thin (1-2 traits, low counts), but it is the first moment the profile *shows its work*
- **Illustrative pacing:** ~95 answers, ~35 notes cumulative

---

### Month 3 — "You have reached Active User status." · Chapter I → II transition

- **Badges earned:** Deep Reach `≋∘` (day 90)
- **Layout density:** transitions toward `compact` — dashboard clarity, sections distinct
- **Memory Engine:** 90-day mark = sustained engagement threshold; mood-trend and self-care ratio are now statistically meaningful (30+ data points each), so `ContextualPromptsWidget` and `InterventionsWidget` start producing sharper, less generic suggestions
- **Badge tier:** 0 → 1 (first tier) — the achievement category scoring in `calculateEvolutionState()` crosses its first meaningful threshold
- **Public profile reveal:** Correlated Indexes block appears for the first time (`composite > 0`) — four scores, all modest, all *visibly climbing* if the user checks back
- **This is the Chapter I → Chapter II hinge.** The "Active User status" copy is the strongest existing MonthlyPulseWidget line — it should be the one month this session recommends pairing with something more than a dismissible toast (see §6, Story Archive Month 3 entry gets a distinct visual treatment)

---

### Month 4 — "The portrait deepens." · Chapter II: Exploration

- **No streak badge lands this month** (the gap begins) — this is exactly where the Monthly Story Digest (§7) needs to start carrying weight, since the badge ladder has gone quiet
- **Layout density:** `compact`
- **Feature unlock:** Intention History (Level 15) — the Intentions Widget now shows a timeline, not just "today's intention"
- **Public profile:** archetype description text lengthens; `behavioralCohort` field (e.g. "Renaissance Polymaths"-style label) can now be assigned with confidence

---

### Month 5 — "Consistency is its own reward." · Chapter II: Exploration

- **Layout density:** `compact`
- **Memory Engine:** Depth Level 3 (Values) questions become common — "What value does this practice honor?"
- **Behavioral badges** (non-streak, e.g. `library_run` — 14 consecutive journal days, `deep_decoder` — 200+ char answer) are the only earnable badges this month; the doc recommends `BadgeUnlockFeed` surface these more prominently in months where milestone badges are dormant

---

### Month 6 — "The journey is half-declared." · Chapter II → III transition

- **No streak badge** — the six-month gap identified in §2 opens here
- **Layout density:** `compact` → `dense`
- **Feature unlock:** Mood Patterns (Care 50% or Level 20) — this is the direct payoff of six months of morning check-ins and self-care clicks; it should be framed to the user as exactly that ("Six months of showing up. Your mood patterns are ready.")
- **Badge tier:** likely still 1, approaching 2
- **Public profile:** this is the halfway point — recommend the profile page itself gain a subtle visual marker at Month 6 (a literal "Year One: Halfway" state), independent of any badge

---

### Month 7 — "Seven months in. The system has been listening." · Chapter III: Integration

- **Layout density:** `dense` — information-dense cockpit begins
- **Memory Engine:** 30-answer sliding window is now several cycles deep; topic-diversity warnings and Mode 5 (Compressed Follow-Up — 8-word questions) start appearing, visibly demonstrating compression ("the questions get shorter because it already knows")
- **This is the month to make Compression *visible* as a feature**, not just a backend mechanic — e.g., a passive UI note the first time Mode 5 triggers: "The question got shorter. You've said enough."

---

### Month 8 — "Rare air." · Chapter III: Integration

- **Layout density:** `dense`
- **Feature unlock:** Export Data (Level 25) — first moment the user can hold their own compressed record outside the platform, a trust signal ahead of Pattern Insights unlocking next month

---

### Month 9 — "The self-care practice is a habit now." · Chapter III → IV transition

- **Feature unlock:** Pattern Insights (Consistency 66%, "Moon Cycle+") — `PatternInsightsWidget` and cohort matching (`CohortConnectWidget`) become meaningfully populated
- **Badge tier:** 2 (mid) should be reached around here for a consistent user
- **Layout density:** `dense` → `instrument` begins

---

### Month 10 — "Almost there." · Chapter IV: Mastery

- **Layout density:** `instrument` — maximum density, "every pixel justified," Bloomberg-terminal register
- **Feature unlock:** Narrative Reflection (Depth 66% + Level 30) — `NarrativeWidget`'s `context` view unlocks; the RPG-style story engine reaches full expression

---

### Month 11 — "One more." · Chapter IV: Mastery

- **Layout density:** `instrument`
- **All remaining feature flags** (Social Mentions at full Connection, Private Spaces at Intimacy 50%/Courage 100%) are realistically earned only by highly engaged users by this point — this is intentional; not every subscriber should reach `featureUnlockLevel` 5 by Month 12, and that's fine, Month 12 does not require a maxed state

---

### Month 12 — "One year with LOT. The portrait is complete — and still evolving." · Chapter IV: Mastery, capstone

- **Badge earned:** The Long Count `≋≋≋` / Citadel `╔═╗` (day 365) — legendary rarity, the single largest badge moment in the entire ladder
- **Layout density:** `instrument`, fully arrived
- **Badge tier:** 3 (ultimate) for a consistent user
- **Public profile:** every conditional section in `PublicProfile.tsx` now renders — Board Profile, full Memory Story, dense Psychological Profile with a real `patternStrength` list, Correlated Indexes trending upward, Level field showing `≋≋≋`, QR code long since active (crossed `forming` around Month 2–3)
- **What is still visibly absent, honestly:** Weather Station and Wallet — the two Legacy-only blocks. The Month 12 experience should **name this gap explicitly** rather than hide it (see §8)
- **This is the moment the product can start calling itself LOT® AI in the user's own language** — not because a feature flag flipped, but because twelve months of `patternStrength`, Memory Story, and Correlated Indexes now visibly outweigh the barebones Day-1 shell the user remembers starting from

---

## 6. Existing-System Cross-Reference Table

| Month | Chapter | Layout density | Streak badge | Feature unlock | Profile section newly visible |
|---|---|---|---|---|---|
| 1 | I | breathable | ∘ ∘∘ ∘≈ ≈ | Custom Themes (L5) | Memory Story, Level |
| 2 | I | comfortable | ≈∘ ≈≈ | Widget Arrange (L10) | `patternStrength[]` (thin) |
| 3 | I→II | comfortable→compact | ≋∘ | — | Correlated Indexes |
| 4 | II | compact | — | Intention History (L15) | `behavioralCohort` |
| 5 | II | compact | (behavioral only) | — | — |
| 6 | II→III | compact→dense | — | Mood Patterns (Care 50%/L20) | — |
| 7 | III | dense | — | — | Mode 5 compression visible |
| 8 | III | dense | — | Export Data (L25) | — |
| 9 | III→IV | dense→instrument | — | Pattern Insights (Consistency 66%) | Cohort match |
| 10 | IV | instrument | — | Narrative Reflection (Depth66%+L30) | Narrative `context` view |
| 11 | IV | instrument | — | (Social/Private, high-engagement only) | — |
| 12 | IV | instrument | ≋≋≋ | — | Full profile; QR active; gap to Legacy named |

---

## 7. Two New Widgets (proposed, not yet built)

### 7.1 `YearProgressWidget` — "Months Unlocked: N/12"

Addresses the request directly: a **persistent, non-dismissible** companion to
`MonthlyPulseWidget` (which is transient/dismissible by design). Where
`MonthlyPulseWidget` is the once-a-month affirmation toast, this is the
always-visible meter.

- **Placement:** Header stack in `System.tsx`, adjacent to the week-number/date
  line — same tier of permanence as the clock, not buried in a stack the user
  has to scroll to
- **Gating:** `isUsership` only (same tag check pattern as `MonthlyPulseWidget`)
- **Data:** reuses the exact `monthNumber` calc already in
  `MonthlyPulseWidget.tsx` (`dayjs().diff(joinedAt, 'month')`) — no new
  backend endpoint required for the base version
- **Display:** a 12-segment ASCII bar consistent with the density-bar
  aesthetic already used in `SystemProgressWidget`'s Self-Assembly view
  (`▓▓▓▓▓▓▓░░░░░`), labeled `Months Unlocked: 7/12`
- **Click-to-expand:** reveals the four Chapter labels (§4) with the current
  chapter highlighted — pure client-side, reads the same `chapter` value
  `evolution.ts` already computes
- **Month 12 → 13 transition:** the counter does not reset or freeze. At
  Month 12 the bar fills and the label reads `Months Unlocked: 12/12` for
  the last time; from Month 13 onward the `/12` denominator drops and the
  widget becomes a plain, ever-climbing count — `Months Unlocked: 13`,
  `14`, `15`... — the same field, the same placement, just no longer
  bounded. This is deliberate: freezing the number at a "Year One:
  Complete" cap would flatten exactly the signal that makes Machiavelli's
  demo profile feel evolved (`streak: 1469` reads as *enormity*, not
  completion — see §3, §8). A subscriber's month-count should behave the
  same way: it keeps counting for as long as they stay Usership, and the
  rising number *is* the tenure flex, with no reset between Year One and
  Year Two. The 12-segment bar itself stops advancing (it has nothing left
  to fill), staying visually solid as a permanent marker that Year One's
  chapter closed — but the number beside it keeps going

### 7.2 Monthly Memory Digest + Story Archive — the centerpiece proposal

This is the direct answer to "focus on 12-month tangibility of the compressed
Memory story delivery." Today, `memory.ts` generates exactly **one** all-time
Memory Story, cached to `user.metadata.lastMemoryStory` and re-generated only
when the answer count changes. There is no monthly-scoped version, and the
public profile shows only that single blob — meaning a Month-12 visitor and a
Month-1 visitor see structurally the same thing, just longer.

**Proposal:**

1. **Server:** a scoped variant of the existing story-generation path in
   `memory.ts` — same Together AI call pattern, same local-fallback
   composition, but filtered to `answer`/`note`/`emotional_checkin` logs
   from the *previous calendar month only*. Cache to
   `user.metadata.monthlyDigests[monthNumber]`, versioned the same way
   `lastMemoryStory` is (answer-count check avoids redundant AI calls).
2. **Trigger:** generated automatically on the 1st of each new month,
   timed to pair with `MonthlyPulseWidget`'s existing affirmation line —
   the short poetic sentence is the headline, the Digest is the
   paragraph underneath it, e.g.:

   > *Month 6: The journey is half-declared.*
   > *In your sixth month, mornings became the throughline. Fourteen
   > check-ins before 8am, more than any other window. The Wave badge
   > gave way to something steadier — you stopped needing the streak to
   > show up. Three weeks ago you named "adaptability" for the first
   > time; it hasn't left your core values since.*

3. **Private surface:** appears once in `System.tsx` on month transition
   (dismissible into an archive, same interaction pattern as
   `MonthlyPulseWidget`, but keeps its content rather than discarding it)
4. **Public surface — the actual tangibility ask:** add a **Story Archive**
   section to `PublicProfile.tsx`, below the existing single Memory Story
   block. Twelve collapsed one-line summaries (one per month), each tagged
   with its Chapter badge, expandable on click. By Month 12, a visitor to
   the profile scrolls through a **twelve-chapter book**, not one paragraph
   — this is the single highest-leverage change for making a year of
   Usership *look* like a year, not a number.
5. **Privacy:** gated by the existing `privacySettings.showMemoryStory`
   toggle — no new privacy surface needed, it extends a control the user
   already understands.

This is the feature that makes Month 12 visibly different from Month 1 on
the profile page in a way no badge or density setting can — it is the literal
compressed record of the year, delivered as twelve chapters instead of one
blob.

---

## 8. The Honest Gap — Why Month 12 Isn't Machiavelli

Machiavelli's hardcoded demo is Legacy tier (`tags: ['RND', 'Usership',
'Legacy']`) with a 1469-day streak — four Mayan tun-years, not one. Two
demo-only blocks (`weatherStation`, `wallet`) render *only* because of the
`Legacy` tag, not because of streak length. A perfect-attendance Usership
subscriber hitting the 365-day Citadel badge at Month 12 will **never** see
those two blocks under the current gating logic (`profile.weatherStation` /
`profile.wallet` presence, unrelated to streak).

This should be treated as a **feature of the year-one arc, not a bug to
patch**: Month 12's "portrait is complete — and still evolving" copy already
gestures at this honestly. The Long Count/Citadel badge (`≋≋≋` / `╔═╗`) is
literally named for a *calendar cycle completing*, which is the correct
emotional register — completion of Year One, with a visible, named doorway
(Legacy tier) to what comes next. The product should not fake Legacy-tier
density at Month 12; it should let the Citadel badge stand alone as the
Year-One capstone and let the absence of the Weather Station/Wallet blocks
be the honest, structural hook toward Year Two.

---

## 9. Implementation Notes (for a future engineering session)

- `YearProgressWidget` (§7.1) requires no new backend — pure reuse of
  `user.joinedAt` and the `isUsership` tag check already in
  `MonthlyPulseWidget.tsx`. Lowest-effort, highest-visibility addition.
- Monthly Story Digest (§7.2) requires: one new server route
  (`GET /api/memory/monthly-digest/:monthNumber`), one new metadata field
  (`monthlyDigests`), and one new `PublicProfile.tsx` section (Story
  Archive). Reuses 100% of the existing Together AI call path in
  `memory.ts` — no new AI engine work.
- Chapter-to-month mapping (§4) is a pure display-layer decision — it does
  **not** require changing how `evolution.ts` computes `chapter` from
  achievements; it only requires exposing month-anchored *labels* alongside
  the existing achievement-anchored chapter value, so a slower or faster
  user still sees a consistent monthly calendar story even if their
  achievement-based chapter lags or leads it slightly.
- All illustrative answer/note counts in §5 are narrative color for this
  document only — they should not be hardcoded anywhere; they exist to
  give designers/copywriters a believable target when mocking Month N
  profile states.

---

## 10. Closing

Twelve months, four chapters, ten streak badges clustered unevenly across the
year, fourteen feature unlocks, five layout-density stages, and — with the
two proposals in §7 — one always-visible progress meter and a twelve-chapter
public Story Archive. None of this requires inventing new systems; it
requires making three already-shipped systems (`MonthlyPulseWidget`,
`interfaceEvolution.ts`, the badge ladder) narrate to each other on a shared
calendar, and filling the six-month badge silence (Month 4→9) with the one
thing the Memory Engine was always producing anyway: a story, delivered
monthly instead of all at once.

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
**Authorized by: S-2 // VADIK MARMELADOV**
