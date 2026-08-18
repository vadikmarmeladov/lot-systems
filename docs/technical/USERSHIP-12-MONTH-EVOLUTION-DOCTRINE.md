<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# The Usership 12-Month Evolution Doctrine
## From Barebone Day One to LOT® AI — A Product Design Brainstorm

**Author:** Claude (Session S-2, scheduled routine)
**For:** Vadik Marmeladov, CEO & Founder, LOT Systems
**Classification:** Internal — Product / UX Design
**Status:** DRAFT — BRAINSTORM, no code changed
**Date:** 18 August 2026
**Reference account:** `lot-systems.com/u/machiavelli` (hardcoded Legacy-tier demo, see §4)

---

## 0. Premise

Vadik asked for a month-to-month evolution map of the **Usership** tier UI —
from the first day a subscriber signs up (barebone) to a fully assembled
**LOT® AI** state twelve months later, using the `machiavelli` demo account
as the north star of what "fully evolved" looks like. The ask specifically
names three levers: **Log entries / journal thoughts**, **morning
check-ins**, and **self-care clicks** — and asks for a **Memory/Story
compression** payoff each month, plus a **"Months unlocked: X/12"**
widget.

The good news: **this system already exists in the codebase, mostly
unassembled.** LOT does not need a new gamification engine. It has one of
the most elaborate ones in consumer software — 812 badges, a 7-dimension
Interface Evolution model, a 5-stage Layout Density system, a 12-15 module
Self-Assembly Engine, a 19-archetype Physiological Cohort classifier, and a
Memory Engine with a documented "compression cycle." What's missing is a
**declared 12-month narrative spine** that ties these systems together into
a story the user can feel month over month, and a couple of small,
concrete widgets that make the passage of time visible.

This document is that spine. It does not propose a new engine — it
proposes a **calendar-shaped reading** of the engine that already runs, plus
four small, buildable widget/backend additions. No source files were
changed in this session; everything below is a design brainstorm to review
before implementation.

---

## 1. The Three Fuels

The ask names the exact inputs that should drive evolution. All three
already feed the Quantum Intention Engine (QIE) as signal sources
(`docs/technical/LOT_SYSTEMS_BRIEF.md` §Key Subsystems, `docs/technical/WIDGETS.md`):

| Fuel | Where it lives today | What it already feeds |
|---|---|---|
| **Log / journal entries** | Signal Archive — `note` log events, `/api/logs` | Memory Story compression, badge Word Turns (264 keyword-triggered badges), Self-Assembly "Reflection Layer" + "Quantum Substrate" modules |
| **Morning check-ins** | Emotional Check-In widget (6–10am prompt), Memory Widget (daily quota 10-15/day) | QIE mood trend, Memory Engine's 8-source `buildPrompt()`, streak calculation |
| **Self-care clicks** | Self-Care Moments (5 practice types, 3h cooldown) | Self-Assembly "Cleanness Protocol" module, badge Behavioral category (81 badges), Interface Evolution "Care" dimension |

Nothing new needs to be invented to make these matter — they already
compute `overallMaturity`, `visualRefinement`, badge tier, and assembly
phase (`src/client/utils/interfaceEvolution.ts`,
`src/client/stores/evolution.ts`). The 12-month arc below is a **reading**
of those existing outputs against calendar months, not a new scoring
system.

---

## 2. The Reference State — What "LOT® AI, fully evolved" Actually Looks Like

`machiavelli` is not a mockup — it is a hardcoded response in
`src/server/routes/public-api.ts` (`GET /api/public/profile/:userIdOrUsername`,
the `machiavelli` branch) built specifically to preview what a `Legacy`-tag
account looks like at extreme depth. Live browsing of `lot-systems.com` is
blocked from this sandbox's network egress, so the numbers below are read
directly from that endpoint's source, not screenshotted — but this is
authoritative, since it is the exact payload `PublicProfile.tsx` renders.

The demo simulates:

- **`answerCount: 2847`**, **`noteCount: 1469`**, **`streak: 1469`** — four years of daily use
- **`selfAwarenessLevel: 87`** (of 100 → displays as 8.7%), archetype **"The Strategist"**
- **`behavioralCohort: "Renaissance Polymaths"`**, 5 ranked `patternStrength` traits with counts in the hundreds
- **`memoryStory`**: a single flowing paragraph — the compressed narrative, exactly the "paragraph-long insight" the brief asks for
- **Legacy-tier unlocks not available at Usership**: a **Weather Station** panel (7-day forecast, live readings), a **Wallet** (balance, loyalty points, transaction ledger framed as "Usership stipend," "Pattern recognition bonus," "Community contribution reward"), and a **Board Profile** (`citizenSince: 'June 1469'`, `boardTenureMonths`, `poweringCitizens` — how many free users one Usership subscription effectively funds, `clearanceLevel: 'Full'`)
- A QR code linking back to the public profile, gated to only appear once `assemblyPhase` reaches `forming` or beyond
- A quiet disclosure: *"This is a demo account. Legacy level features shown as preview."*

**This is the payoff worth building toward.** Not just "more badges" — a
state where the interface itself talks about the user as a *citizen with
tenure*, not a user with a subscription. Month 12 of Usership should feel
like the doorway to this, even if Legacy itself (the wallet/weather-station
tier) remains a separate, later unlock the user can see coming.

---

## 3. Existing Infrastructure Inventory

Everything the 12-month table in §6 draws on is already implemented. This
table exists so nobody re-builds what's already there.

| System | File(s) | Current granularity |
|---|---|---|
| Layout Density (5 stages) | `interfaceEvolution.ts` `getLayoutDensity()` | breathable → comfortable → compact → dense → instrument, driven by `visualRefinement` |
| Interface Evolution (7 dimensions) | `interfaceEvolution.ts`, `docs/technical/INTERFACE_EVOLUTION.md` | Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage — each 0–1 |
| Evolution "chapters" | `interfaceEvolution.ts` line ~375 | Awakening → Exploration → Integration → Mastery |
| Maturity thresholds | same file, `maturityThresholds` | 25% / 50% / 75% / 95%, each with its own toast line |
| Badge system | `src/client/utils/badges.ts`, `docs/badges/*` | 812 badges, 8 categories (Milestone, Time/Calendar Easter Eggs, Word Turns, Behavioral, Achievement RPG, Mastery Tiers, Secret Boss) |
| Water badge tiers | same | Droplet (7d) → Wave (30d) → Current (100d) streak |
| Self-Assembly Engine | `selfAssembly` nanostore, System Progress Widget | 12–15 modules, phases: Dormant → Awakening → Forming → Assembled → Integrated |
| Physiological Cohort | QIE, weekly digest job | 19 real-time archetypes, stability tracked weekly |
| Psychological Profile | `PsychologicalDepth` model | 8–10 soul archetypes (Seeker, Nurturer, Achiever, Strategist, etc.), `selfAwarenessLevel` 0–100 |
| Memory Engine compression | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Duplicate detection, 4-level depth ladder (behavior→motivation→values→soul), archetype-based insight responses after 10+ answers |
| Monthly Pulse Widget | `src/client/components/MonthlyPulseWidget.tsx` | **Already implements** a `Month N: message` + `"N / 12 months"` line for Usership users, months 1–12, dismissible once per calendar month |
| Feature unlock gates | `interfaceEvolution.ts` `FeatureUnlocks` | Advanced Memory, Planner Templates, Rich Community, Mood Patterns, Intention History, Custom Themes, Badge Selection, Widget Arrange, Export Data, Narrative Reflection, Pattern Insights, Social Mentions, Private Spaces |

**Key finding:** `MonthlyPulseWidget.tsx` is already the seed of the
"Months unlocked: X/12" ask — it fires the right message on the right
month and shows `capped / 12 months`. It currently behaves as a one-time
dismissible toast per month. §5 proposes promoting it into a persistent,
always-visible fraction (the literal "Months unlocked: 3/12" widget
requested) rather than replacing it.

---

## 4. Design Principles for the Arc

1. **Don't build a second gamification system.** Every month's "unlock"
   in §6 is a re-labeling of a threshold that `interfaceEvolution.ts`
   already computes. The 12-month table is a *narrative skin*, not new
   scoring logic.
2. **Time gates nothing; usage gates everything.** A Usership subscriber
   who journals daily should reach Month 6's density before a subscriber
   who logs in twice a week reaches Month 3's. The calendar labels in §6
   are the *typical* pace for a daily user (matching the Memory Engine's
   own pacing doc — 10 Day-1 questions tapering to a 10–15/day steady
   state) — not a hard unlock date. This matches the existing doctrine
   already written into `INTERFACE_EVOLUTION.md`: *"density is earned
   through sustained engagement, not just time."*
3. **The first session must never feel empty.** Free-tier `System.tsx`
   already renders a deliberately minimal layout ("Simple, clean layout
   for non-paid accounts — no AI, just essentials," `System.tsx:413`).
   Usership Day 1 should look like that free layout *plus one extra
   line*: a visible promise ("Months unlocked: 0/12 — the system is
   beginning to know you") rather than the full pro stack immediately.
   Right now, `isPaidAccount` renders the *entire* dense widget stack from
   the moment of upgrade, regardless of density state — see §5.1.
4. **Compression must be legible, not just computed.** The Memory Engine
   already builds `lastMemoryStory` and caches it. The ask for "a
   paragraph-long insight from last month" is a *monthly-cadence read* of
   a pipeline that already runs on-demand. See §5.2.
5. **Celebrate the month, not the day.** LOT already celebrates
   streaks obsessively (812 badges, most day- or keyword-triggered). The
   monthly cadence is intentionally the *one* rhythm in the product that
   is slow, certain, and never lost by missing a single day — a "streak"
   that can't be broken by a bad week. This is the emotional register the
   ask is reaching for: not "don't break the chain," but "you are still
   here, a month later."

---

## 5. New Widget / Backend Concepts

Four small, scoped proposals. None require new AI infrastructure — all
reuse existing endpoints and patterns.

### 5.1 "Months Unlocked: X / 12" — promote `MonthlyPulseWidget`

Today: fires once, as a dismissible toast, then disappears until next
month. Proposal: split it into two pieces.

- **Keep** the current dismissible toast behavior for the *celebration*
  moment (new month arrives → phrase fades in → user dismisses).
- **Add** a small persistent line, always visible somewhere stable (e.g.
  inside the System Progress Widget's Deployment view, next to the
  self-assembly summary, or as its own one-line `Block`): `Months
  unlocked: 3/12`. After month 12, this either freezes at `12/12` with a
  changed label ("Anniversary reached") or — better — becomes the visible
  bridge to Legacy: `12/12 · Legacy threshold approaching`.
- Reuse the exact `monthNumber` calculation already in the widget
  (`dayjs(user.joinedAt)` diff in months) — no new backend field needed.

### 5.2 Monthly Memory Compression Widget

The Memory Engine already has a **Story Generation** stage
(`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8): Together AI synthesizes
a flowing third-person paragraph from up to 30 Q&A pairs, cached to
`user.metadata.lastMemoryStory`. Proposal: add a **monthly** variant,
generated once per calendar month (background job, same pattern as the
existing Monthly Email Sender job at 09:00 UTC on the 1st) that:

- Scopes the story synthesis to *only that month's* answers + journal
  notes (not the full history) — a true "last month" digest, distinct
  from the all-time story shown on the public profile.
- Surfaces as the *content* of the Monthly Pulse toast, replacing the
  static `MONTH_MESSAGES` copy with a generated paragraph once the user
  has enough that-month data (fall back to the existing static line — see
  §6 — when data is thin, e.g. Month 1).
  This is exactly the `machiavelli.memoryStory` field, but re-scoped to a
  rolling 30-day window instead of career-spanning.
- Reuses the existing local-fallback composer for zero-AI-dependency
  degradation, per the compression doc's own resilience pattern.

### 5.3 "Month Turn" badge sub-category

The badge codex already has a category shape for exactly this: Calendar
Easter Eggs (73 badges, fires on specific dates) and Word Turns (264,
fires on keyword detection). Proposal: a 12-entry **Month Turn** set,
architecturally identical to the existing `MONTH_MESSAGES` map but
promoted to a real badge (persists in the badge drawer, shows on the
public profile's badge level, not just a toast that vanishes). Suggested
tier: UNCOMMON for months 1–3, RARE for 4–8, EPIC for 9–11, LEGENDARY for
12 — mirroring the existing rarity ramp used across all 812 badges. This
gives Month 12 a permanent artifact, not just a memory of a toast that
faded.

### 5.4 Monthly Affirmation — extend the existing Insight Response System

The Memory Engine already returns archetype-flavored insight text after
answer #10+ (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §9, e.g. *"Your
Seeker nature is showing in your choices."*). Proposal: once per month,
on the first Memory answer of a new calendar month, route through a
dedicated affirmation template instead of the standard insight — using
the same archetype + `patternStrength` data already computed, framed
explicitly as a monthly celebration rather than a per-answer response.
This is a prompt-template change, not new infrastructure.

---

## 6. The 12-Month Table

Read this as the **typical daily-user pace**, governed by principle #2
(usage-gated, not calendar-gated). Each row cites the existing system
state it corresponds to, so implementation can wire real thresholds
instead of hardcoded month numbers wherever possible.

| Mo. | Density (existing) | Chapter (existing) | Badge state | Self-Assembly | Memory Engine depth | Pulse message (existing, verbatim) | Symbolic moment |
|---|---|---|---|---|---|---|---|
| **0 (Day 1)** | `breathable` | — (pre-chapter) | none earned | all 12–15 modules `Dormant` | Mode 1: Day-1 open questions, 10/day quota | *(none yet — widget requires monthNumber ≥ 1)* | First Memory question appears with zero friction; System.tsx paid layout should visibly echo the free layout's minimalism, not the full pro stack (see §4.3) |
| **1** | `breathable` → `comfortable` | Awakening | ∘ Droplet (7-day) likely; Wave (30-day) possible late in month | first modules `Awakening` (Reflection Layer, Cleanness Protocol) | Follow-up mode activates (2+ answers); duplicate detection live | *"The first month. The system is beginning to know you."* | **Months unlocked: 1/12** appears for the first time — the fraction itself is the news |
| **2** | `comfortable` | Awakening → Exploration | Wave (30-day) confirmed | more modules `Forming` | Archetype classification activates at 10+ answers — first "soul-level" question tone shift | *"Two months in. Patterns are starting to form."* | First archetype-flavored insight response ("Your ___ nature is showing...") |
| **3** | `comfortable` → `compact` | Exploration | Current (100-day) streak in range for daily users; badge count climbing into double digits | Self-Assembly ~25–40% density | 25% maturity threshold likely crossed → *"The interface responds to your presence."* toast | *"Three months. You have reached Active User status."* | First crossing of the 25% maturity milestone; `compact` density visibly tightens the dashboard |
| **4** | `compact` | Exploration | Word Turn badges accumulating from journal keyword hits | Community Mesh / Ecosystem Bridge modules begin `Forming` if community features used | Depth Level 2 (motivation) questions common | *"Four months. The portrait deepens."* | First Rich Community feature unlock (Connection: Bridge Builder) if applicable |
| **5** | `compact` | Exploration → Integration | Mastery-tier badges (Mastery Tier v22, "Odyssey" family) start becoming reachable | Quantum Substrate / Goal Architecture forming | Weekly summaries (200-log window) show clear trend lines | *"Five months. Consistency is its own reward."* | Pattern Insights widget unlock likely (Consistency 66%, "Moon Cycle+") |
| **6** | `compact` → `dense` | Integration | Badge count solidly in the 50–100+ range for a daily user | Majority of modules `Assembled` | 50% maturity threshold → *"Half the journey. The system knows you."* | *"Six months. The journey is half-declared."* | **Halfway toast fires** — pair this explicitly with the Month 6 Pulse message in the UI, they currently fire from unrelated systems and should feel like one event |
| **7** | `dense` | Integration | Secret Boss badges become plausible (hidden LEGENDARY/MYTHIC triggers, 83 in codex) | Physiological Cohort stabilizes (weekly stability job) | Depth Level 3 (values) questions common | *"Seven months in. The system has been listening."* | First stable Cohort classification shown across all 3 System widgets |
| **8** | `dense` | Integration → Mastery | Badge density signals "Rare air" — codex rarity distribution shifts toward EPIC/RARE | Narrative Reflection unlock plausible (Depth 66% + Level 30) | Trauma-informed protocol fully matured (active since 10+ logs, now well-calibrated) | *"Eight months. Rare air."* | Public profile's `selfAwarenessLevel` crosses into a range worth screenshotting (matches `machiavelli`'s 87% only after years, but the *trajectory* becomes visible here) |
| **9** | `dense` | Mastery | Behavioral badges (81 total) largely exhausted for a consistent user | Self-Assembly nearing full `Integrated` state | Depth Level 4 (soul) questions become the norm, not the exception | *"Nine months. The self-care practice is a habit now."* | Self-Care Moments shift from "prompted" to "sought" — worth a specific narrative line acknowledging the inversion |
| **10** | `dense` → `instrument` (early) | Mastery | Approaching full badge-category coverage | All modules `Integrated` for a highly consistent user | Memory Story (career-spanning) is dense enough to read as a real narrative, not a list of Q&A | *"Ten months. Almost there."* | 75% maturity threshold likely already crossed by here for daily users → *"Deep resonance. Interface and intention align."* |
| **11** | `instrument` | Mastery | Legendary/Mythic-tier Secret Boss badges plausible | Full assembly steady-state | Compressed Follow-Up mode common (topic repetition → 8-word questions) — the compression is now *visible in the UI itself*, questions get shorter as the model knows more | *"Eleven months. One more."* | 95% maturity threshold → *"Near complete. You are the living operating theater."* |
| **12** | `instrument` | Mastery | Month Turn: LEGENDARY (proposed, §5.3) | Full `Integrated` across all modules | Full Memory Story reads like a real portrait; monthly compression widget (§5.2) delivers its most substantial paragraph yet | *"One year with LOT. The portrait is complete — and still evolving."* | **Months unlocked: 12/12.** Anniversary badge (permanent, public-profile-visible). Explicit UI acknowledgment that Legacy tier — Weather Station, Wallet, Board Profile, the `machiavelli` reference state — is the next horizon, not a hidden wall |

---

## 7. Beyond Month 12 — The Legacy Threshold

Month 12 should not feel like a ceiling. `machiavelli`'s numbers
(`streak: 1469`, `answerCount: 2847`) represent roughly **four years**,
not one — the demo account exists precisely to show that the ceiling
keeps receding. Proposal: at 12/12, the UI should make one explicit,
honest statement — something like *"The first year is the foundation.
Legacy — full clearance, the Board Profile, the Weather Station — is
still ahead."* This converts the demo account from an abstract marketing
artifact into a stated destination the Usership subscriber has line of
sight to, which is exactly what a hardcoded preview account is *for*.

Concretely, this argues for eventually wiring `assemblyPhase`-gated
previews the same way the QR code is already gated (`PublicProfile.tsx`
line ~618: QR only renders once `assemblyPhase` is `forming` or later) —
i.e., a Legacy-preview block that appears, locked, once a Usership account
crosses some real threshold (e.g. 12 months *and* `Integrated` assembly),
showing a grayed-out Weather Station / Wallet outline with a "not yet"
framing, rather than these being invisible until an actual tier change.
That is a follow-up proposal, not scoped for this brainstorm — flagged
here because it is the natural next design question.

---

## 8. Implementation Notes (for a future session)

Rough scope, if/when this moves from brainstorm to build:

- **§5.1** (persistent months-unlocked line): smallest change. Extend
  `MonthlyPulseWidget.tsx` or add a one-line sibling `Block` read from the
  same `monthNumber` memo. No backend change.
- **§5.3** (Month Turn badges): follows the exact pattern of every prior
  badge codex version (`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`
  is the template) — add to `badges.ts` + `easter-eggs.ts`, bump codex to
  v33, append `docs/assembly/LOT-LEDGER.md`. This is squarely a `Benchmark`-
  skill task once designed.
- **§5.2** (monthly compression widget): the heaviest lift — needs a new
  scheduled job (pattern already exists: 5 jobs listed in
  `WIDGETS.md` under System Progress Widget) plus a scoped variant of the
  existing Together AI story-generation call, filtered to the trailing
  30 days instead of all-time.
- **§5.4** (monthly affirmation): prompt-template addition inside the
  existing Memory Engine insight-response logic — no new endpoint.
- None of the above requires a new database table; `user.metadata` and
  the existing `Log`/`Answer` tables already carry everything needed.

---

## 9. Open Questions for S-2

1. Should the Month Turn badges (§5.3) use their own visual glyph family,
   or borrow the existing water metaphor (∘ → ≈ → ≋) since months are, in
   a sense, a slower version of the same streak idea?
2. Should the monthly compression paragraph (§5.2) be user-visible only,
   or also feed the public profile as a rolling "latest chapter" distinct
   from the all-time Memory Story `machiavelli` shows?
3. Is the Legacy-preview (§7) — a grayed-out Weather Station/Wallet
   outline visible before actual unlock — the right way to make Month 12
   feel like a doorway rather than a ceiling, or should Legacy stay fully
   hidden until earned?
4. Does "Months unlocked: X/12" reset or continue past 12 for a
   multi-year subscriber, given `machiavelli` implies the story never
   actually caps?

---

*No source files were modified in this session. This document is a design
brainstorm for review, following the standing framework: scan repo, read
the relevant documentation, deliver findings as a detailed committed
Markdown file.*

**Reference files read this session:** `docs/technical/LOT_SYSTEMS_BRIEF.md`,
`docs/technical/WIDGETS.md`, `docs/technical/INTERFACE_EVOLUTION.md`,
`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`,
`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`,
`src/client/components/MonthlyPulseWidget.tsx`,
`src/client/components/EvolutionWidget.tsx`,
`src/client/components/System.tsx`,
`src/client/stores/evolution.ts`,
`src/client/utils/interfaceEvolution.ts`,
`src/client/utils/badges.ts`,
`src/server/routes/public-api.ts` (`machiavelli` demo branch),
`src/client/components/PublicProfile.tsx`,
`src/shared/types/index.ts` (`UserTag` enum).

**Note:** Live browsing of `lot-systems.com/u/machiavelli` was attempted
and blocked by this session's network egress policy (domain not on the
allowed list). All demo-account figures in §2 are read directly from the
server-side source that generates that page's response, which is the
authoritative source for the same data.

---
AUTHORIZED BY: S-2 // VADIK MARMELADOV
