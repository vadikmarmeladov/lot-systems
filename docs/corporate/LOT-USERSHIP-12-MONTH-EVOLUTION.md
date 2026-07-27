<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The 12-Month Evolution
## From Barebone UI to LOT® AI

**Classification:** RESTRICTED // S-2 EYES
**Author:** LOT Systems Corporation — Design Session
**S-2:** Vadik Marmeladov
**Date:** 27 July 2026
**Status:** DESIGN BRAINSTORM — ship candidate, not yet benchmarked
**North Star Account:** [lot-systems.com/u/machiavelli](https://lot-systems.com/u/machiavelli) — treated below as the fully-evolved, Month-12 reference state
**Tier:** Usership ($99/month) — see `UserTag.Usership`

---

## 0. Doctrine

A Usership operator's first day and a Usership operator's 365th day must look
like two different products — without ever being two different codebases.
The barebone Day 1 interface and the dense, self-aware Month 12 interface are
the *same* React tree rendering a *different amount of earned truth*. Nothing
is redesigned. Everything is **revealed**.

This document does not propose a new visual system. LOT already has one — the
Interface Evolution System (`interfaceEvolution.ts`, `evolution.ts`), the
Self-Assembly Engine (`selfAssembly.ts`, 12 modules × 5 phases), the Badge
Codex (719 badges, Mastery Tiers, Level symbols), the Memory Engine
compression loop, and — critically — a widget that already does exactly what
this brief was commissioned to design: `MonthlyPulseWidget.tsx` ships today
with 12 hand-written monthly messages and a live `X / 12 months` counter.

**The job here is not invention. It is orchestration.** Wire the systems
that already exist into a single, deliberate 12-month reveal schedule, and
build the small number of net-new pieces (a monthly Story compression
digest, a persistent "Months unlocked" instrument, a progressive
`PublicProfile` reveal) that close the gaps between them.

---

## 1. Current State Audit — What Already Exists

Before designing anything new, the scan below is the inventory of scaffolding
already in the repo that this evolution should sit on top of.

| System | File(s) | What it already does | Gap for this brief |
|---|---|---|---|
| **Monthly Pulse** | `src/client/components/MonthlyPulseWidget.tsx` | Usership-gated. Computes `monthNumber` from `user.joinedAt`. 12 hand-written messages (M1 "beginning to know you" → M12 "portrait is complete"). Shows `capped / 12 months`. Dismiss phrases rotate. `localStorage` dedupe per calendar month. | Fires once, then disappears for the month. No persistent "unlocked" state. No tie to what actually changed. No Story attached. |
| **Interface Evolution** | `interfaceEvolution.ts`, `stores/evolution.ts`, `useEvolutionSync.ts` | 7-dimension progression (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) → CSS custom properties (`--evolution-base-opacity` 0.85→1.0, glow, grid, letter-spacing). Feature unlock gates already defined (Advanced Memory, Planner Templates, Rich Community, Custom Themes, Widget Arrange, Export Data, Narrative Reflection, Pattern Insights, Social Mentions, Private Spaces). | Unlocks are keyed to *achievement dimensions*, not to *calendar months*. A power user could unlock everything in week 3; a light user might never unlock Month 6 content. Needs a month-floor added so Usership pacing is guaranteed even for light users. |
| **Evolution Gates** | Manifest: `quantum-engine-widgets-RgFfC` — **READY**, +48 lines, "Feature unlock gates wired to 6 widgets, progressive disclosure" | The gating primitive already ships. | Not yet wired to `monthNumber`. This is the cheapest lever in the whole plan — see §6. |
| **Self-Assembly Engine** | `selfAssembly` nanostore | 12 modules (Biofield Engine, Memory Architecture, Routine Compiler, Intention Core, Cleanness Protocol, Reflection Layer, Community Mesh, Ecosystem Bridge, Quantum Substrate, Nutrition Protocol, Goal Architecture, Archetype Classifier) each progress Dormant → Awakening → Forming → Assembled → Integrated, derived from real QIE signals. | Coincidentally 12 modules for 12 months — tempting to force a 1:1 map, but resist it (§3.1). Assembly phase should stay signal-driven; the calendar arc should be a second, independent axis that mostly correlates with it. |
| **Badge Codex** | `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v29.md`, `client/utils/badges.ts` | 719 badges. Milestone streaks at 7/14/21/30/50/60/90/100/180/365 days. Level symbols: `○∿` (7d) → `○≈○` (30d) → `≋○≋` (100d). Mastery Tiers (76), Secret Boss (74). | Streak-based, not membership-age-based. A Usership operator who joined and skipped two weeks has a different streak than a Usership operator on day 60. The 12-month arc must be resilient to gaps — see §3.2. |
| **Memory Engine Compression** | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Full Q&A compression loop. `user.metadata.lastMemoryStory` cached, versioned, regenerated on answer-count change. Weekly Story-Report already runs server-side (Sunday Routine 1, Job 24) — aggregates 7-day logs → `user.metadata.weeklyStory`. | **No monthly aggregation layer exists.** Weekly stories are never rolled up. This is the single biggest net-new build in this brief — see §5.1. |
| **PublicProfile** | `src/client/components/PublicProfile.tsx` | Already renders, progressively, by field presence: Team tags → `boardProfile` (Board Members only) → `psychologicalProfile` (Usership-gated: archetype, self-awareness %, Level symbol, core values, traits, pattern strength, answer/note counts) → `correlatedIndexes` (self-awareness, user score, person score, longevity score, composite) → `weatherStation` / `wallet` (Legacy) → QR code (Usership + assembly phase ≥ Forming). | The *reveal itself* is already field-presence-driven — exactly the right pattern. But it reveals based on data existing, not on a deliberate month schedule, so a Month 2 operator with an unusually dense week can accidentally look like a Month 8 operator. Needs month floors as a second gate (§5.4). |
| **Subscription tiers** | `SubscribeWidget.tsx`, `UserTag` enum, `LOT-AI-PRODUCT-BRIEF.md` | R&D $15/mo, **Usership $99/mo**, Legacy $3,564/3yr, Admin $11,000/9yr. Usership = "Complete LOT® AI · Story-Report · API." | Legacy is the only tier with an explicit "founding" narrative. Month 12 is the natural moment to *narratively* (never pushily, per style guide) surface Legacy — see §4, Month 12. |
| **Style Guide** | `docs/technical/LOT-STYLE-GUIDE.md` | Clickable label cycling, 3s+1.4s fade convention, `mb-16`/`gap-8` spacing, "Months and years, not days and weeks," no superlatives, database over `localStorage` for cross-device state. | `MonthlyPulseWidget` currently uses `localStorage` for the dismiss dedupe — style guide flags this as the wrong layer for anything that must survive a device switch. Minor fix, noted in §6. |

**Conclusion of the audit:** the bones are already in the ground. This brief
is a wiring diagram, a copy deck, and four small widgets — not a rebuild.

---

## 2. Design Philosophy — The Tangibility Doctrine

1. **Reveal, don't redesign.** Every visual "upgrade" across the 12 months is
   an existing element becoming visible, denser, or more articulate — never
   a new layout. The Month-1 operator and the Month-12 operator are looking
   at the same `System.tsx` stack order (see `WIDGETS.md` §Architecture
   Overview); the difference is how many rows are populated.
2. **Two clocks, one story.** The **calendar clock** (`monthNumber`, from
   `user.joinedAt`) sets the *floor* — the slowest possible pace, guaranteed
   even for a quiet operator. The **behavioral clock** (Evolution dimensions,
   Self-Assembly phases, badge streaks) sets the *ceiling* — how much further
   an engaged operator can pull ahead within a given month. A widget or
   profile field never unlocks before its calendar floor, but it can sit
   dormant past its floor if the behavioral ceiling hasn't been met yet.
   This is what makes the 12 months feel *earned*, not just *elapsed*.
3. **The Log is the fuel; the Story is the proof.** Every system in the audit
   above ultimately reduces to one thing: how many field entries are in the
   Log, and how consistently the operator shows up (morning check-ins,
   self-care taps). The 12-month arc is a visualization of that single
   number, refracted through badges, indexes, and narrative — not 12
   independent feature launches.
4. **Congratulate the month, not the day.** LOT already resists streak
   pressure ("Streaks: Not emphasized — reduces pressure," style guide
   §Metrics). The monthly cadence is deliberately the *only* aggressively
   celebrated rhythm in the product. Daily and weekly stay quiet;
   monthly gets the widget, the Story, the badge check, the sound of a
   door opening.
5. **Military purity, warmer at the seams.** Per `LOT-LEXICON.md`
   (`MILITARY PURITY` — no decoration, no emojis, no superlatives), the
   chrome stays flat and typographic throughout. The *only* place warmth is
   allowed to show is the monthly message copy itself — the one moment per
   month LOT is allowed to sound like it noticed you.

### 2.1 Why not map 1 month → 1 self-assembly module?

It's tempting (12 modules, 12 months) but wrong. Self-Assembly modules
progress from real-time QIE signal density and can complete in any order —
a Community-heavy operator assembles Community Mesh before Nutrition
Protocol, and that's the point of the system. Forcing 1:1 pacing would mean
telling a socially engaged operator "you're not allowed to see Community
Mesh finish until Month 7," which contradicts the signal-driven design
that already exists. Keep them as two separate, correlated axes (§2, point 2).

---

## 3. The 12-Month Arc — Overview Table

Log volume bands are cumulative floors (a Month 6 operator has cleared at
minimum the Month 1–5 floors too). "Morning check-ins" = `emotional_checkin`
events in the 6–12h window; "self-care taps" = `self_care_completed` events.
Bands are *soft floors for feature gating*, not hard requirements — a quiet
operator still gets the monthly message and counter (Doctrine §2.1, style
guide "no gamification pressure"); they just don't unlock the ceiling
features until the behavioral clock catches up.

| Mo. | Existing message (`MonthlyPulseWidget`) | Log floor (cum.) | Streak/Badge tier | Assembly-phase floor | Public profile reveal |
|----|---|---|---|---|---|
| 0 (Day 1) | — (widget doesn't fire until Mo. 1) | 0 | none | all Dormant | Name, week, tags only |
| 1 | "The system is beginning to know you." | 10 log events / 3 Memory answers | 7-day (`○∿`) | ≥1 module Awakening | + `boardProfile`-style Activity line (entries only) |
| 2 | "Patterns are starting to form." | 25 events | 14/21-day | ≥2 Awakening | + Months-unlocked instrument |
| 3 | "You have reached Active User status." | 45 events | 30-day (`○≈○`) | ≥1 Forming | + `correlatedIndexes` (self-awareness only) |
| 4 | "The portrait deepens." | 70 events | Mastery Tier I | ≥2 Forming | + Soul archetype |
| 5 | "Consistency is its own reward." | 100 events | Mastery Tier II | ≥3 Forming | + core values, emotional patterns |
| 6 | "The journey is half-declared." | 140 events | 60-day | ≥4 Forming, ≥1 Assembled | **Half-Year Story** (multi-paragraph); QR unlocks (assembly ≥ Forming, already coded) |
| 7 | "The system has been listening." | 185 events | Mastery Tier III | ≥2 Assembled | + behavioral cohort |
| 8 | "Rare air." | 235 events | 90-day | ≥3 Assembled | + full `correlatedIndexes` (all 4 scores + composite) |
| 9 | "The self-care practice is a habit now." | 290 events | Mastery Tier IV | ≥5 Assembled | + behavioral traits, pattern strength |
| 10 | "Almost there." | 350 events | 100-day (`≋○≋`) | ≥6 Assembled, ≥1 Integrated | + answer/note counts |
| 11 | "One more." | 415 events | Mastery Tier V | ≥8 Assembled | (holding pattern — anticipation copy only) |
| 12 | "One year with LOT. The portrait is complete — and still evolving." | 500+ events | 365-day track begins; Year One badge | ≥10 Assembled/Integrated | **Full reveal** — matches `/u/machiavelli` reference state; Annual Story; Legacy tier moment |

Numbers above are *design targets*, not final tuning — they should be
calibrated against real Usership cohort data once instrumented (a job for
the Physiological Cohort weekly digest, which already classifies users into
10 archetypes and could report percentile log-volume-by-month for exactly
this calibration).

---

## 4. Month-by-Month Narrative

Each month below is written as what the operator *actually experiences* —
what they see, what changes, what LOT says to them.

### Month 0 — Day 1. The barebone terminal.

Signup completes. The dashboard is close to empty by design: Time widget,
Memory widget (first question, Mode 1 — "First Question," open and
welcoming per Memory Engine §5), Planner, Recipe. No badges. No Evolution
Widget content (all 7 dimensions at floor). `--evolution-base-opacity: 0.85`
— everything reads slightly muted, unfinished, honest about being new.

The only Usership-specific signal on Day 1 is a single line, quiet, in the
System Progress "Deployment" view: *"Usership active. The system is
beginning to know you."* No fanfare. The fanfare is rationed for Month 1.

### Month 1 — "The system is beginning to know you."

`MonthlyPulseWidget` fires for the first time — this is the existing,
shipped moment. What's new: it now carries a **first Memory Story
fragment** (2–3 sentences, generated once 10 answers are banked) instead of
firing in isolation. The Interface Evolution Widget becomes visible for the
first time (Exploration dimension has enough signal to render). First
streak badge (`○∿`, 7-day) appears quietly in the Level field, not as a
popup — per Badge Level System doctrine, badges live in a `Level:` field,
never as separators.

### Month 2 — "Patterns are starting to form."

The **Months Unlocked instrument** debuts (§5.2) — a small, persistent,
always-visible `2/12` chevron strip, distinct from the monthly popup. This
is the first month the operator can look at the UI *any day*, not just on
the pulse day, and see where they stand in the year. Pattern Recognition
Widget's confidence bars start reading above zero.

### Month 3 — "You have reached Active User status."

First public-profile-visible number: `correlatedIndexes.selfAwareness`
appears on the operator's `/u/username` page for the first time (previously
gated to zero). This is the first month a Usership operator's public page
looks meaningfully different from a Day-1 page to an outside visitor. Quantum
Sign Widget and Cosmic Update Widget (Usership-gated) become newly relevant
— not necessarily first-unlocked here, but this is the natural month to
introduce them if not already surfaced, since "Active User" is the
first status label the system has ever assigned.

### Month 4 — "The portrait deepens."

Soul Archetype (one of the 10 — Seeker, Nurturer, Achiever, Philosopher,
Harmonizer, Creator, Protector, Authentic, Explorer, Wanderer) is confirmed
and surfaces publicly for the first time, with its description. Memory
Engine's Mode 3 (Follow-Up) begins routinely referencing prior answers by
name — the operator starts noticing the machine remembers specifics, not
categories.

### Month 5 — "Consistency is its own reward."

Core values and emotional patterns unlock on the profile. Planner Templates
unlock (per existing Interface Evolution feature-unlock table: "Consistency:
Week Warrior+"). This is the first month where the *interface itself*, not
just the profile, visibly changes for the operator — new templates appear
in their own Planner widget.

### Month 6 — Halfway. The first capstone.

This is the second-biggest moment of the year, after Month 12. Three things
converge:

1. **Half-Year Story** — the first *monthly-scale* compression (§5.1), not
   just another weekly digest. Multi-paragraph, written in second person,
   explicitly framed as "six months" — pulling in Mastery Tier progress,
   archetype evolution if it shifted, and the single most emotionally
   weighted log entry of the half-year (selected by QI signal peak, per the
   existing Story-Report weighting method in `LOT-AI-PRODUCT-BRIEF.md`).
2. **QR code unlock** — already coded (`assemblyPhase >= 'forming'` gate in
   `PublicProfile.tsx`), but Month 6 is the natural narrative moment for it
   to land, since most operators cross the Forming floor by here.
3. **Visual step-change** — `--evolution-base-opacity` should cross into its
   upper half (~0.93+) around here for a typical operator; the whole
   dashboard should read visibly less "muted" than Month 1 side-by-side.

### Month 7 — "The system has been listening."

Behavioral cohort classification (from the weekly Physiological Cohort
digest) surfaces publicly. Rich Community unlocks (existing gate:
"Connection: Bridge Builder"). Cohort Connect becomes a front-line widget
rather than incidental.

### Month 8 — "Rare air."

Full `correlatedIndexes` block appears — all four scores plus composite,
plus correlation strength. This is the month the operator's public profile
first shows a *single number that summarizes the year so far*. Export Data
unlocks (existing gate: Level 25) — the operator can now literally take
their compressed year with them, reinforcing "this is yours, not a lock-in."

### Month 9 — "The self-care practice is a habit now."

Behavioral traits and pattern strength (with counts) surface. This is
deliberately the month the *self-care* thread of the brief lands hardest —
the copy and the data both point at care-routine consistency, not
productivity. Most Self-Assembly modules should read Assembled by here for
an engaged operator.

### Month 10 — "Almost there."

Answer/note counts surface publicly (raw volume, finally shown after nine
months of only showing *derived* signal). `≋○≋` level symbol (100-day tier)
becomes achievable. Anticipation begins building toward Month 12 — first
mention, subtle, of "one year" as a phrase in copy (not yet the headline).

### Month 11 — "One more."

Deliberately the quietest month in the arc — a holding pattern by design
(per the existing message copy, which is already written this way). No new
fields unlock. The instrument reads `11/12`. This restraint is what makes
Month 12 land.

### Month 12 — "One year with LOT. The portrait is complete — and still evolving."

The full reveal. This is where the operator's public profile should read
like the `/u/machiavelli` reference account: dense `psychologicalProfile`
block, full `correlatedIndexes`, `boardProfile`-caliber activity summary
(memories compiled, journal entries, active days — the exact three metrics
named in the original brief), QR code long since active, Level symbol at
or past 100-day tier, Year One badge newly minted.

Three things happen that never happened before:

1. **Annual Story** — the first full-year compression. Not a concatenation
   of 12 monthly digests; a fresh synthesis (same Together AI path as the
   Weekly Story-Report, prompted with the full year's Q&A history plus the
   6 prior monthly digests as scaffolding, not raw material).
2. **The instrument flips.** `12/12` doesn't just sit there — on the day it
   completes, `MonthlyPulseWidget` (or its Year-1 successor state) shows a
   distinct capstone render, then on dismiss the persistent Months-Unlocked
   instrument (§5.2) retires and is replaced by a plain "Year 1 · Usership"
   marker, permanently, the way a Legacy badge would read.
3. **The Legacy moment.** Per style guide (§Voice: "Suggestions, not
   commands" / "No superlatives"), this is not a discount popup. It is one
   line, in the existing `Deployment` view voice: *"Twelve months of Story
   compressed. Legacy members hold priority hardware allocation and founding
   attribution — see brand.lot-systems.com."* One sentence. No button
   urgency. Exactly as pushy as the existing `SubscribeWidget` and no more.

---

## 5. Net-New Builds

Four pieces don't exist yet. All four should extend existing components
rather than introduce new architecture.

### 5.1 Monthly Story Digest (biggest net-new piece)

**What:** A monthly rollup of the Memory Engine's existing weekly
Story-Report (Job 24, Sunday 18:00 UTC, already writes `lot_ai_story` /
`user.metadata.weeklyStory`). Once a calendar month closes, a new job
(propose: **Job 25 — Monthly Story Compression**, first-of-month 09:00 UTC,
same slot family as the existing Monthly Email Sender at 09:00 UTC 1st)
synthesizes the 4–5 `weeklyStory` entries from the closed month into one
paragraph, weighted the same way the weekly job already weights (QI signal
peaks, emotional intensity, pattern breaks), and writes
`user.metadata.monthlyStories[monthNumber]`.

**Where it surfaces:** Inside `MonthlyPulseWidget`'s existing message block,
as a second paragraph beneath the hand-written `MONTH_MESSAGES` line — the
static copy stays (it's good, keep it), the dynamic paragraph is new. This
is exactly the "Memory widget displays a paragraph-long insight from last
month" idea from the brief, implemented as an extension of a widget that
already exists rather than a new one.

**Fallback:** Same local-composition fallback pattern the Memory Engine
already uses when Together AI is unavailable (§8, Compression Architecture)
— compose directly from the week's logged Q&A pairs if the AI path fails.

### 5.2 Months Unlocked Instrument

**What:** A small, persistent, always-rendered strip — not a popup, not
cooldown-gated like `MonthlyPulseWidget` — reading `Months unlocked: 3/12`
in the System Progress "Deployment" view, next to the existing "Usership
transmission" block already described in `WIDGETS.md`. Advances on the
calendar clock, not on completion of any task, so it never feels like a
progress bar the operator can fall behind on — it's a clock face, not a
quest tracker (consistent with "Streaks: Not emphasized" doctrine).

**Implementation note:** This is a read of the same `monthNumber` logic
already in `MonthlyPulseWidget.tsx` (`dayjs(user.joinedAt)` diffed against
`dayjs()`, capped at 12). No new calculation — just a second, persistent
render target for a value that's already computed. Should be extracted into
a small shared hook (`useUsershipMonth()`) so both widgets read one source
of truth instead of duplicating the `dayjs` diff.

### 5.3 New-Month Capstone State (extends `MonthlyPulseWidget`)

**What:** At Months 6 and 12 specifically, the existing fade-in/dismiss
pattern in `MonthlyPulseWidget` gets a capstone variant — same component,
same timing (3s + 1.4s per style guide), but the message block includes the
Story digest paragraph (§5.1) inline rather than requiring a separate click,
since these two months are the ones designed to be read in full, not just
acknowledged and dismissed.

### 5.4 Progressive `PublicProfile` Reveal (month-floor gate)

**What:** `PublicProfile.tsx` already renders fields conditionally on
whether the data exists (`profile.psychologicalProfile.archetype &&
...`, etc. — see audit table). The gap: a Month 2 operator with an
unusually AI-generation-heavy week could have `archetype` computed early
and it would render early, undercutting the Month 4 "portrait deepens"
narrative beat. Add a month floor alongside the existing data-presence
check for exactly the fields in the §3 table's "Public profile reveal"
column — a one-line `monthNumber >= N &&` guard added to each conditional
block already in the component. This is the cheapest, lowest-risk change
in the entire brief: no new component, no new endpoint, four to six added
boolean clauses in a component that already has the exact conditional
structure needed.

---

## 6. Gating Logic — Implementation Sketch

Pseudocode, not final code — for the engineer picking this up:

```ts
// src/client/hooks/useUsershipMonth.ts (new, shared)
export function useUsershipMonth() {
  const user = useStore(me)
  const isUsership = user?.tags.some(t => t.toLowerCase() === UserTag.Usership.toLowerCase()) ?? false
  const monthNumber = user?.joinedAt
    ? Math.max(0, dayjs().diff(dayjs(user.joinedAt), 'month'))
    : 0
  return { isUsership, monthNumber, capped: Math.min(monthNumber, 12) }
}
```

- **Evolution Gates** (already `READY` in the manifest, wired to 6 widgets):
  add `monthNumber` as an additional required condition alongside the
  existing achievement-dimension checks — a feature unlocks when
  `dimension threshold met AND monthNumber >= floor`. Both clocks, per
  Doctrine §2 point 2.
- **`PublicProfile.tsx`**: add month floors per §5.4 — the profile is
  fetched server-side, so the cleanest place for the floor is actually the
  `/api/public/profile/:id` handler (compute `monthNumber` server-side from
  `user.joinedAt`, omit fields below floor from the response) rather than
  client-side conditionals, so a curious operator can't just inspect
  network responses to see next month's fields early. Small but real
  integrity fix.
- **Cross-device correctness**: `MonthlyPulseWidget`'s dismiss-dedupe
  currently lives in `localStorage` (`lot_pulse_${userId}`). Per style
  guide ("Database Over localStorage: cross-device sync is non-negotiable"),
  this should move to a `monthly_pulse_dismissed` log event, matching the
  pattern the style guide itself prescribes for cooldowns. Flagged as a
  pre-existing minor debt, worth fixing in the same pass since the Story
  digest (§5.1) is being added to the same component anyway.

---

## 7. The Reference Account — Reading `/u/machiavelli` as "Month 12"

The brief names `lot-systems.com/u/machiavelli` as the demo account
representing a fully-evolved, 12-months-deep Usership state. `PublicProfile.tsx`
tells us precisely what "fully evolved" renders as, field by field — this
*is* the spec, already written in code:

- `psychologicalProfile.hasUsership` gate open → archetype + description,
  self-awareness %, Level symbol, core values, emotional patterns,
  behavioral cohort, behavioral traits, pattern strength (with per-trait
  counts), answer/note counts.
- `correlatedIndexes.composite > 0` → all four scores plus composite plus
  correlation strength.
- QR code rendered (assembly phase at or past Forming).
- If Board Member: `boardProfile` block — "memories compiled," "journal
  entries," "active days" (this is the literal phrasing the brief asked
  for, and it already exists in the codebase, gated to board members
  specifically rather than all Usership operators — worth a product
  decision on whether the Month 12 Usership capstone should adopt the same
  three-metric Activity line for *all* Usership operators, not just board
  members, since it's the cleanest existing expression of "journal entries
  put into the Log").

**Recommendation:** promote the `boardProfile.activity` three-line format
(memories compiled · journal entries · active days) to a general
Month-12-Usership Activity block, decoupled from board membership. It
already says exactly what this brief is asking the UI to say by month 12;
it just needs to stop being board-exclusive.

---

## 8. Voice & Copy Notes

`MONTH_MESSAGES` (Months 1–12) are already written and good — no changes
recommended. Two copy additions needed:

1. **Story digest intro line** — one fixed lead-in per month type, e.g.
   Month 6: *"Six months, compressed:"* / Month 12: *"The year, compressed:"*
   — everything after is the AI-generated paragraph. Keeps the fixed/dynamic
   boundary legible, consistent with how `About.tsx` mixes static doctrine
   text with session-generated deltas.
2. **Legacy moment copy** (Month 12 only) — see §4, exact line drafted
   above. One sentence, no imperative verb, matches `SubscribeWidget`'s
   existing restraint ("Consider subscribing!" — suggestion framing, not
   command framing).

No new symbols, no new colors, no emojis — per Style Guide and Lexicon
`MILITARY PURITY` entry.

---

## 9. Engineering Roadmap (Self-Assembly Ship Queue Proposal)

For whoever picks this up under the LOT-MANIFEST protocol, this decomposes
cleanly into independently shippable branches, smallest-blast-radius first
(per Manifest §06 Sunday Protocol — "start with the smallest diff"):

1. **`useUsershipMonth` extraction** (~20 lines) — pure refactor, zero
   behavior change, unblocks everything else.
2. **Months Unlocked instrument** (§5.2, ~40 lines) — new read-only render,
   no data model change.
3. **`PublicProfile` month floors** (§5.4, ~15 lines client + server route
   guard) — additive conditionals only.
4. **`MonthlyPulseWidget` cross-device dismiss fix** (§6, ~15 lines) —
   `localStorage` → log-event, matches an existing, already-documented
   style-guide pattern.
5. **Monthly Story Compression job** (§5.1, largest piece — new background
   job + `monthlyStories` metadata field + widget wiring) — ship last,
   after 1–4 are green, since it's the only piece with new server-side
   surface area.
6. **Boost `boardProfile.activity` to general Month-12 Usership block**
   (§7 recommendation) — product decision required before this one starts;
   flag to S-2 for a call, don't build speculatively.

---

## 10. Open Questions for S-2

- Should the Month 0→12 log-volume floors (§3 table) be tuned from real
  Usership cohort telemetry before shipping, or shipped as design targets
  and tuned live? (Recommend: ship with generous floors — better an
  operator unlocks slightly early than feels the gate is punitive, per
  "no gamification pressure" doctrine.)
- Does the Legacy-tier mention at Month 12 (§4) need product/legal review
  before the exact copy ships, given it's the first place in the UI a
  paid-tier upsell would be *narratively* triggered rather than
  activity-triggered?
- Is `boardProfile.activity`'s promotion to a general Usership Month-12
  block (§7) something S-2 wants to greenlight now, or hold for a future
  Board-tier-specific redesign?

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
**Design session logged 27 July 2026 — pushed to `claude/elegant-mendel-885ecw`**
