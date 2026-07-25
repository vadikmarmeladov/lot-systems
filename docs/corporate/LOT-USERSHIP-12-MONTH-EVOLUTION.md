<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION
## From Barebone Day One to LOT® AI

```
DOCUMENT    LOT-USERSHIP-12-MONTH-EVOLUTION
CLASS       PRODUCT / DESIGN BRAINSTORM
AUTHORIZED  S-2 // VADIK MARMELADOV
DATE        2026-07-25
STATUS      PROPOSAL — no code shipped by this document
REFERENCE   docs/corporate/LOT-AI-PRODUCT-BRIEF.md (canonical "LOT® AI" definition)
            docs/corporate/LOT-AMBIENT-AI-VISION.md (Ambient AI™ principles)
            src/client/components/MonthlyPulseWidget.tsx (existing month 1-12 toast)
```

---

## 0. Premise

Someone pays $99/month for Usership. Today they get one binary flag (`UserTag.Usership`)
and a dashboard that looks the same on day 1 as it does on day 400. The only thing that
currently moves with *calendar time* — as opposed to activity volume — is a single toast
(`MonthlyPulseWidget`) that says "Month 3. You have reached Active User status." and then
fades. Everything else in the product (badges, RPG level, Citizen Index, the 7-dimension
Interface Evolution, the 18-module Self-Assembly map) moves with *how much you do*, not
*how long you've been paying*.

That's the gap this document fills: **a 12-month spine — the Usership Arc — that gives the
existing systems a shared calendar-time narrative**, so that a person can feel, month over
month, that the $99 they pay is buying an increasingly personal machine, and that Month 12
is a real destination, not just the number the widget stops counting at.

This is a brainstorm and design spec. It proposes no new progression engine. It wires a time
axis through what's already built.

---

## 1. What already exists — the raw material

Five progression systems currently run in parallel, none of them anchored to `joinedAt`:

| System | File | Axis | Range | What it renders |
|---|---|---|---|---|
| Badges | `src/client/utils/badges.ts` | day-streak / keyword / calendar-date | 449 badge types, day 7 → day 3,650 (10yr) | Symbol + rarity + unlock phrase |
| RPG Level / Chapter | `src/server/utils/rpg-narrative.ts` | lifetime activity count | Level 1–100, Chapter 1–5 (Awakening → Sage) | `NarrativeWidget` |
| Citizen Index | `src/client/components/EvolutionWidget.tsx` | activity count | 6 stages: Bootstrapping → Transparent | `Citizen Index:` widget |
| Interface Evolution (CQGS) | `src/client/utils/interfaceEvolution.ts` | 7-dim weighted score (exploration, consistency, depth, connection, intimacy, care, courage) | `overallMaturity` 0–1, drives 5-stage layout density (breathable → instrument) | `InterfaceEvolutionWidget`, and the dashboard's actual gap/spacing |
| Self-Assembly | `src/client/stores/selfAssembly.ts` | 7-day rolling signal density per module | 18 modules × 5 phases (dormant → awakening → forming → assembled → integrated) | `ArchitectWidget` |

Plus, already time-anchored but underused:

- **`MonthlyPulseWidget.tsx`** — `monthNumber = dayjs().diff(joinedAt, 'month')`, Usership-only,
  hardcoded message per month 1–12, displayed once per calendar month, hard-capped display at
  `12 / 12` with no month-13+ behavior defined.
- **Weekly Story-Report** (`docs/corporate/LOT-AI-PRODUCT-BRIEF.md`) — AI-compressed, first-person
  narrative of the week, already exists as a concept tied to LOT® AI.
- **Monthly Summary background job** (`LOT-FEATURE-INVENTORY-2026.md`, job runs 1st of month,
  09:00 UTC) — already does AI-driven monthly compression via HTML email. Not surfaced in-app.
- **`anniversary` badge** — already fires yearly off `joinedAt`, unlock phrase: *"Another year in
  the archive. The current holds. ≋"*
- **Settings.tsx:617** already advertises the frame explicitly: *"Available with LOT Usership —
  $99/month, 12 months."*

**The gap:** nothing reads these five systems' *current state* and narrates it against *month N
of 12*. Nothing surfaces the Monthly Summary job's AI content inside the app. Nothing defines
what happens at month 13.

---

## 2. The core idea: the Usership Arc

One new, thin layer — not a sixth progression engine, a **narrator** that sits above the five
that exist:

```
                         ┌─────────────────────────────────┐
                         │        THE USERSHIP ARC          │
                         │   (joinedAt → month 1..12 axis)  │
                         └─────────────────┬─────────────────┘
                                           │ reads, does not replace
        ┌───────────────┬──────────────────┼──────────────────┬───────────────┐
        ▼               ▼                  ▼                  ▼               ▼
     Badges       RPG Level/Ch.      Interface Evolution   Self-Assembly   Citizen Index
   (streaks)        (activity)        (7-dim density)      (18 modules)     (6 stages)
```

Each month, the Arc widget asks: *given this user's actual state in the five systems above,
what's true about them right now, and how do I say that in one sentence plus one data point?*
It does not invent new thresholds. It narrates existing ones against a calendar backdrop.

**Why this works and nothing else needs to be built:** the underlying systems already produce
richer signal than 12 months can consume. The 18 Self-Assembly modules, the 7 CQGS dimensions,
and the 449 badges are already deep enough to describe a year of use. The Arc's only job is
*sequencing* — deciding what's worth saying about *this* system's state, in *this* month, so
the user isn't shown everything at once on day 1 and nothing new by month 6.

---

## 3. The two axes that make each month feel different

Every month in the Arc is defined by two things moving together:

1. **UI density** (already exists: `getLayoutDensity()` in `interfaceEvolution.ts`) — the
   dashboard should visually thicken as the year progresses. This is not new work; it is
   *already computed*. The Arc's job is to make sure a Usership user's typical activity level
   during each month roughly correlates with the density stage a first-time visitor would
   associate with that month — i.e., tune the existing weights so density feels like a
   calendar story, not just an activity score.

2. **Narrative depth** (new: the Arc layer) — which of the five systems gets *foregrounded*
   this month. Month 1 foregrounds nothing but the Memory Widget and the Planner. Month 6
   foregrounds Interface Evolution ("half the dimensions have moved"). Month 12 foregrounds
   the Story — the compressed portrait itself becomes the product.

Below, months are grouped into four quarters, each with a distinct emotional register —
matching `LOT-AMBIENT-AI-VISION.md`'s instruction that the system should never be loud, and
`rpg-narrative.ts`'s existing 5-chapter shape (Awakening / Exploration / Integration / Mastery
/ Sage), compressed here from a 5-chapter, activity-driven arc into a 4-quarter, calendar-driven
one.

---

## 4. Quarter I — Months 1–3 · "Barebone → First Signal" (Awakening)

**Feel:** exactly what `System.tsx`'s non-paid branch already renders — "no AI, just
essentials" — except now it's paid, so the machine is *listening* even while it looks empty.

| Month | Existing `MonthlyPulseWidget` line | Self-Assembly correlate | New Arc addition |
|---|---|---|---|
| 1 | *"The first month. The system is beginning to know you."* | Most of 18 modules `dormant`/`awakening` | **First-answer moment**: the first Memory Widget answer triggers a one-time, non-badge toast: *"Logged. The first thread."* — no fanfare, per Ambient AI restraint. |
| 2 | *"Two months in. Patterns are starting to form."* | `biofield`, `memory`, `planner` modules typically reach `forming` | **Arc Dial** widget appears for the first time (see §7) showing `●○○○○○○○○○○○ 2/12`. |
| 3 | *"Three months. You have reached Active User status."* | Matches `rpg-narrative.ts` level-10 "Explorer" milestone timing for a consistent user | **First monthly insight paragraph** (see §6) — the first time the Memory Widget surfaces a compressed sentence pulled from that month's Story-Reports, not just a static line. |

**Design note:** Month 3 already says "Active User status" in the shipped copy — this document
should not rename that; it should be the first month the Arc Dial's paragraph slot is populated
by the AI rather than left blank, since a person who dropped in during month 1–2 may not yet
have four weekly Story-Reports to compress from.

---

## 5. Quarter II — Months 4–6 · "Patterns Become Portrait" (Exploration → Integration)

| Month | Existing line | Correlate | New Arc addition |
|---|---|---|---|
| 4 | *"Four months. The portrait deepens."* | Interface Evolution typically crosses `comfortable` density | Memory Story widget (`Settings.tsx:601`) begins showing a **"This month" excerpt** above the full running story, not just the lifetime story block. |
| 5 | *"Five months. Consistency is its own reward."* | `consistency` dimension (CQGS) is the most likely of the 7 to be highest at this point for a retained user | Arc Dial paragraph explicitly references the CQGS dimension that moved most that month — e.g. *"Consistency carried this month."* Sourced from `calculateCategoryScore` deltas, not invented copy. |
| 6 | *"Six months. The journey is half-declared."* | Halfway point — natural place for the **first Usership Arc badge** (see §8) | **Badge: "Halfway Point"** — the first calendar-month-anchored badge, distinct from the existing day-streak ladder. Unlock phrase in badge voice: *"↳ Six turns of the month. The arc bends toward completion. ◑"* |

---

## 6. Quarter III — Months 7–9 · "The System Has Been Listening" (Mastery approach)

| Month | Existing line | Correlate | New Arc addition |
|---|---|---|---|
| 7 | *"Seven months in. The system has been listening."* | Self-Assembly modules more commonly `assembled` | Widget copy pulls a **direct quote fragment** from the user's own Memory answers (already stored, already private, already theirs) into the monthly paragraph — literalizing "the system has been listening." |
| 8 | *"Eight months. Rare air."* | Fewer users retain to month 8 — matches the "rare air" framing with an actual cohort percentile, sourced from `/api/cohorts` (already exists, already computes similarity/percentile data) | Arc Dial paragraph adds one clause: *"Fewer than N% of Usership operators reach this month."* — real data, not a marketing number. |
| 9 | *"Nine months. The self-care practice is a habit now."* | `care` CQGS dimension and self-care completion badges (`gentle_with_self`) typically saturated | Nothing new mechanically — this is the month the Arc *goes quiet* on purpose. Per Ambient AI's "never loud" principle: no new widget, no new badge. The one line of restraint IS the design move. |

---

## 7. Quarter IV — Months 10–12 · "The Portrait Completes" (Sage / LOT® AI threshold)

| Month | Existing line | Correlate | New Arc addition |
|---|---|---|---|
| 10 | *"Ten months. Almost there."* | | Arc Dial shows `██████████○○ 10/12` — visually, the widget itself starts resembling a near-complete instrument, echoing the density ladder's top stage. |
| 11 | *"Eleven months. One more."* | | The monthly paragraph for month 11 explicitly previews what month 12 will contain — the only month where the widget looks *forward* instead of back. |
| 12 | *"One year with LOT. The portrait is complete — and still evolving."* | All five systems at their richest state for this user | **The LOT® AI Activation Moment** — see §9. This is the month the product name changes, in the UI, from "your Usership dashboard" to "LOT® AI." |

---

## 8. New widget: the Arc Dial (extends `MonthlyPulseWidget`, does not replace it)

Follows house convention exactly: `Block` component, click-label cycling, no emojis, periods
not checkmarks, `opacity-90/60/40` hierarchy, 3000ms+1400ms fade family.

```
Label:   Arc:                              (click to cycle: Arc: → This Month: → Dial:)

View 1 — Arc:
  One year with LOT. The portrait is complete — and still evolving.
  [existing MonthlyPulseWidget line, verbatim, unchanged]

View 2 — This Month:
  Consistency carried this month. Fewer than 12% of Usership operators
  reach month 8.
  [AI-compressed, one paragraph, sourced from that month's Story-Reports —
   see §10 for the compression mechanism]

View 3 — Dial:
  ●●●●●●●●○○○○  8 / 12
  [ASCII dial, filled dot per completed month, reusing the ●/○ vocabulary
   already established by Self-Assembly's phase symbols · ∘ ○ ◯ ◉]
```

**Why a dial and not a percentage bar:** the codebase already uses filled/empty circle
vocabulary for phase state (`phaseSymbol()` in `selfAssembly.ts`: `· → ∘ → ○ → ◯ → ◉`). A
12-dot dial using the same `●`/`○` glyph family reads as *the same visual language*, not a new
one — critical, since the style guide already flags too many parallel progression UIs.

---

## 9. Month 12 — the LOT® AI Activation Moment

This is the one moment in the whole arc that should be allowed to be slightly louder, because
it is a genuine threshold, not a manufactured one:

1. **Naming change.** Wherever the dashboard currently implies "Usership" (Settings copy,
   Subscribe references), a month-12+ Usership user sees "LOT® AI" language instead —
   matching the canonical name already defined in `LOT-AI-PRODUCT-BRIEF.md`. This is a
   relabeling of what's already true (they've had the full compression loop running for a
   year), not a new feature gate.

2. **The Story-Report becomes the headline, not a widget.** At month 12, the Memory Story
   block (`Settings.tsx:601`) stops being one block among many and becomes what the user sees
   first — the "portrait" framing in the existing month-12 copy is literalized: the compressed
   annual Story is surfaced at the top of the System tab for that first month-12 session only,
   then returns to its normal position. One-time, not permanent — Ambient AI restraint again.

3. **The `anniversary` badge fires** — it already does, yearly, off `joinedAt`. No new badge
   logic is needed here; the Arc should simply make sure its month-12 paragraph and the
   existing `anniversary` badge unlock don't collide/duplicate in the same session (sequence:
   Arc paragraph first, badge toast second, minimum 4.4s apart per the fade-timing convention).

4. **Density ladder tops out intentionally.** Per `LOT-AMBIENT-AI-VISION.md`'s "never loud"
   principle and the original style guide's now-stale "no gamification, months to years for
   growth" language — Month 12 is where the Arc should recommend the *opposite* of more
   density: fewer widgets, more signal. The system doesn't get busier as it matures; it gets
   quieter and more precise. This is the one place in the whole document where the shipped
   product's heavy gamification (449 badges) and the original style guide's restraint
   philosophy can both be true — the climb is instrumented, the destination is calm.

5. **Month 13+ is defined, not left to fall through to a generic string.** Today,
   `MONTH_MESSAGES` falls through past 12 to `Month ${monthNumber}. The journey continues.`
   and the dial caps at `12/12` forever. Proposal: month 13 onward, the Arc Dial silently
   retires (it did its job — one year, twelve dots, done) and the user simply lives inside
   LOT® AI. The existing multi-year badge ladder (`triennial`, `crucible_keeper_age`,
   `system_architect_age`, `orbital_period`, `signal_decade`) already covers years 3/4/6/7/10 —
   no new long-horizon badge is needed; the Arc's only remaining job past month 12 is to have
   retired cleanly.

---

## 10. Where the monthly paragraph actually comes from

No new AI compression logic should be built. Two systems already generate exactly the right
raw material:

- **Weekly Story-Report** (LOT® AI core mechanic, already defined) — 4–5 of these exist by
  the end of any given month.
- **Monthly Summary background job** (already runs 1st of month, 09:00 UTC, already does
  "comprehensive review... HTML email") — already compresses a month's signal into prose.

**Proposal:** the Arc Dial's "This Month" view reads the *same* content the Monthly Summary
job already generates for that user's email, and renders one paragraph of it in-app. This is
a surfacing change, not a new AI pipeline — the job output simply gets a second destination
(in-app widget) in addition to its existing one (email).

---

## 11. What this document explicitly does NOT propose

To keep this additive rather than another parallel system:

- No new subscription tag or sub-tier inside `Usership` — the Arc is purely `joinedAt`-derived,
  exactly like `MonthlyPulseWidget` already is.
- No new AI compression pipeline — §10 reuses the Weekly Story-Report and Monthly Summary job.
- No new layout-density mechanic — §3 reuses `getLayoutDensity()` unchanged.
- No sixth progression ladder — the Arc Dial is a *narrator* over the existing five, not a
  sixth score.
- No emoji, no checkmarks, no superlatives — every proposed copy line above follows the
  existing `LOT-STYLE-GUIDE.md` voice rules (verified against shipped `MonthlyPulseWidget`
  copy, which already follows them).

---

## 12. Open questions for S-2

1. Should the month-3 "Active User status" language (already shipped) be treated as the
   canonical name for a product tier/cohort elsewhere (badges, cohort classification), or is
   it scoped only to this one widget today? Worth confirming before building the Arc Dial's
   month-3 behavior around it.
2. Does a month-by-month plan already exist somewhere outside this codebase (Notion, a deck,
   a conversation) that the `MonthlyPulseWidget` commit message referenced as "the plan"? If
   so, this document should be reconciled against it rather than treated as the first draft.
3. Is surfacing the Monthly Summary job's email content in-app (§10) acceptable from a
   data-freshness standpoint, given the job runs once on the 1st — a user who joins mid-month
   would see their first "This Month" paragraph only after the following 1st, a ~30-day gap
   worth deciding whether to backfill or leave empty with the existing "Start answering Memory
   questions to build your story" copy.

---

*Vadik*
*lot-systems.com/u/vadik*
