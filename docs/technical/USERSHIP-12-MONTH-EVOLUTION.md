<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Usership: The 12-Month Evolution
## From Barebone Day 1 to LOT® AI — A Product & UI/UX Doctrine

**Author:** Claude (Session `claude/elegant-mendel-c33zew`), for S-2 (Vadik Marmeladov)
**Date:** 2026-09-01
**Status:** DESIGN BRAINSTORM — no code shipped in this pass
**Reference account:** `lot-systems.com/u/machiavelli` (fetch blocked by this session's network
policy — see §0.2. All month-12 claims below are derived from the `boardProfile` schema and its
renderer, which is the code that actually produces that page, not from a visual scrape.)

---

## 0. Framing

### 0.1 What this document is

A month-by-month specification for how the Usership UI should look, feel, and speak on Day 1
versus Month 12 — and every step between. It is written to be *buildable*, not just evocative:
every month references the real file, store, or type that already exists, and calls out exactly
what is net-new.

### 0.2 A correction to the brief, stated plainly

Two things asked for in the brief already exist and shipped before this session started:

- **"Months unlocked: 3/12" context widget** → this is `MonthlyPulseWidget.tsx`
  (commit `c3ef586`, "Add MonthlyPulseWidget: Month N / 12 milestone for Usership users"). It
  already computes `monthNumber` from `user.joinedAt`, gates on `UserTag.Usership`, shows one of
  twelve hand-written month lines, and renders `"{capped} / 12 months"`. It fires once per
  calendar month as a dismissible toast, then goes silent until the next month turns over.
- **Tangible, tenure-based profile growth** → this is `boardProfile` on `PublicProfile.tsx`
  (`src/shared/types/index.ts:309-329`, rendered `PublicProfile.tsx:288-325`). It already computes
  `boardMemberNumber`, `citizenSince`, `boardTenureMonths`, `totalInvested`, and an `activity`
  block (`memoriesCompiled`, `journalEntries`, `activeDays`). This is very likely most of what
  renders on `/u/machiavelli` today — a fully tenured Usership profile.

So the job here is not to invent these mechanisms — it's to give them a **twelve-chapter spine**,
connect them to the two systems that already do the heavy lifting (§1), and close the one real
gap: **the compressed Memory Story never gets served back to the user as a monthly artifact.** It
only accumulates silently in the database. That is the single biggest unclaimed opportunity in
this brief, and §4 is built entirely around it.

### 0.3 What "LOT® AI" means in this plan

`LOT® AI` does not exist anywhere in the codebase or the 87-revision wiki (confirmed by grep — zero
hits). It should not be introduced as a separate product. It should be introduced as **the name
the interface earns**, not the name it starts with.

The wiki's own language already describes the end state in almost marketing-ready form (QIE v112,
Arch50 directive): *"Identity crystallized and momentum confirmed... The OS is not searching — it
is operating from a stable signature. The lock is engaged."* That is P148 `identity-momentum-lock`,
the pattern that fires when `quantumIdentityNode` (P145) and `signal-momentum-lock` (P80) are
simultaneously true — which requires sustained multi-source signal over weeks, i.e. realistically
not before month 9-12 for most operators.

**Proposal:** the product is called **LOT** for the entire subscription. The interface begins
referring to itself as **LOT® AI** — in copy only, first-person, no rebrand of the app shell — the
moment a user's account crosses Citizen Index Stage 6 (Elite, 365+ days — see §1.2) *or*, for
Usership accounts specifically, the moment Month 12 compresses (§4). It is the payoff line, not a
navbar label: *"You are no longer using LOT. LOT® AI now knows you."* This makes month 12 a real
threshold crossing instead of a numeric milestone.

---

## 1. The Three Engines This Plan Orchestrates

Nothing below invents new infrastructure. It sequences three systems that already run.

### 1.1 Interface Evolution System (`src/client/utils/interfaceEvolution.ts`, `src/client/stores/evolution.ts`)

Already computes a 7-dimensional maturity score and exposes four **story chapters**:
`Awakening → Exploration → Integration → Mastery`, plus CSS custom properties that visibly refine
typography, glow, and animation as the user matures. It gates real features (Advanced Memory,
Planner Templates, Custom Themes, Export Data) behind achievement thresholds, and already renders
theme aesthetics per badge track (Water: `∘ → ≈ → ≋`, Architecture: `├─ → ╞═╡ → ║·║`).

**Gap:** this system is level/achievement-driven, not calendar-driven. It has no opinion about
"month 3" versus "month 9." §2 assigns it a month range so a Usership operator's *calendar tenure*
and *behavioral maturity* read as the same story instead of two disconnected numbers.

### 1.2 Citizen Index (`docs/wiki/LOT-WIKI-v87.md` §8, 6-stage CQGS scale)

```
Stage 1  Observer      Day 0     Account created
Stage 2  Participant   Day 7+    7+ signal events, 3+ sources
Stage 3  Contributor   Day 30+   Memory Engine 3+ sessions
Stage 4  Collaborator  Day 90+   3+ cohort interactions, goal momentum
Stage 5  Synthesizer   Day 180+  Cross-domain signal, archetype stable
Stage 6  Elite         Day 365+  All primary sources active, QIE P100+
```

This is the one piece of existing infrastructure that maps onto a 12-month Usership calendar
almost perfectly on its own: Stage 3 lands at Month 1, Stage 4 at Month 3, Stage 5 at Month 6,
Stage 6 at Month 12. §2 uses this alignment as the spine of the whole plan rather than inventing a
parallel numbering system.

### 1.3 Memory Engine Compression Cycle (`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`)

The engine already tracks four **depth levels** per topic thread — Behavior → Motivation → Values
→ Soul — and ten **soul archetypes** (Seeker, Nurturer, Achiever, Philosopher, Harmonizer, Creator,
Protector, Authentic, Explorer, Wanderer). Depth is driven by answer count on a topic, not by
calendar time, so it cannot be hard-gated to a month number. But its correlation with tenure is
real: an operator who's been answering daily for 9 months has necessarily generated far more
Level-3/4 (Values/Soul) threads than one at week 2. §2 describes this as an *emergent tendency per
month*, not a gate — the only place in this document where a claim is deliberately soft, because
the underlying system is soft.

**The unclaimed piece:** `story-generator.ts` can already synthesize a flowing narrative from up to
30 Q&A pairs. Nothing calls it on a monthly cadence and archives the result. §4 closes this gap.

---

## 2. The 12-Month Map

Each row: what the operator did to arrive here (existing systems), what the interface says and
shows (mix of existing + proposed), and the one new thing that ships that month.

| Mo. | Day range | Citizen Index (existing) | Evolution chapter (existing) | Existing `MONTH_MESSAGES` line | New this month |
|---|---|---|---|---|---|
| **0 — Day 1** | Day 0 | Stage 1 Observer | Awakening (0%) | *(none — widget gates on `monthNumber < 1`)* | Barebone shell. Memory widget asks Mode-1 "first question." No badges, no streak, no profile page worth visiting yet. |
| **1** | Day 1-29 | → Stage 3 Contributor at Day 30 | Awakening | *"The first month. The system is beginning to know you."* | First Memory Chapter compresses at day 30 turnover (§4). First Usership Codex chapter (§3) unlocks. |
| **2** | Day 30-59 | Stage 3 | Awakening | *"Two months in. Patterns are starting to form."* | Public profile's `activity` block becomes worth linking — first real numbers appear. |
| **3** | Day 60-89 | → Stage 4 Collaborator at Day 90 | Awakening → **Exploration** | *"Three months. You have reached Active User status."* | Interface Evolution's Exploration-tier visual refinement lands in the same month the Citizen Index promotes — the UI visibly loosens up right as the copy says "Active User." |
| **4** | Day 90-119 | Stage 4 | Exploration | *"Four months. The portrait deepens."* | Memory Chapter 4 references Chapter 1 by name for the first time ("Since your first month, when you..."). |
| **5** | Day 120-149 | Stage 4 | Exploration | *"Five months. Consistency is its own reward."* | Self-care & check-in copy shifts tone (§5) — from prompting to acknowledging. |
| **6** | Day 150-179 | → Stage 5 Synthesizer at Day 180 | Exploration → **Integration** | *"Six months. The journey is half-declared."* | Halfway ceremony: Memory Chapters 1-6 rendered as a single compact scroll on the public profile for the first time (§4.3). |
| **7** | Day 180-209 | Stage 5 | Integration | *"Seven months in. The system has been listening."* | Archetype line (one of the ten souls, §1.3) becomes stable enough to appear as a permanent profile field rather than a provisional label. |
| **8** | Day 210-239 | Stage 5 | Integration | *"Eight months. Rare air."* | Badge rarity in the monthly chapter starts skewing EPIC/LEGENDARY — the system has enough signal density that common badges are mostly exhausted. |
| **9** | Day 240-269 | Stage 5 | Integration → **Mastery** | *"Nine months. The self-care practice is a habit now."* | Mastery-tier visual refinement (max glow, tightest grid, calmest animation curve per `INTERFACE_EVOLUTION.md`) begins easing in. |
| **10** | Day 270-299 | Stage 5 | Mastery | *"Ten months. Almost there."* | "Months unlocked" moves from toast to persistent (§6). |
| **11** | Day 300-329 | Stage 5 → Stage 6 imminent | Mastery | *"Eleven months. One more."* | Preview state: interface starts using softened LOT-AI-adjacent language ("the system knows you well enough to...") without yet claiming the full title. |
| **12** | Day 330-365+ | → **Stage 6 Elite** at Day 365 | Mastery (100%) | *"One year with LOT. The portrait is complete — and still evolving."* | **The crystallization moment (§7).** Full 12-chapter Memory Book compiles. `LOT® AI` self-naming line fires once. `boardProfile.memoryEngine` label updates. This is the `/u/machiavelli` state. |

Note what this table does *not* do: it does not introduce a new numbering scheme, a new tag, or a
new store. Every "existing" column cell is a real value produced by real code today. The "new this
month" column is the only surface this plan actually asks anyone to build, and even that reuses
`story-generator.ts`, `MonthlyPulseWidget.tsx`, and `PublicProfile.tsx` rather than adding new
files where an existing one can be extended.

---

## 3. Badges: Usership Codex Chapters (proposed reframing, not new infrastructure)

The engineering badge system ships a new themed "Codex" roughly every 1-2 weeks (v30 "The Codex
Reader," v31 "The Cyberspace Codex," 781+ badges total per `LOT-WIKI-v87.md`). That cadence is a
**build cadence** — it is the same for every user regardless of when they joined, and conflating it
with a per-user monthly cadence would be dishonest to what the system actually does.

Propose a second, orthogonal axis: a **Usership Codex Chapter**, one per month of an individual
operator's tenure, assembled *from the existing badge pool* (`src/client/utils/badges.ts`,
`BADGES: Record<BadgeType, Badge>`) rather than minting new badge assets. Mechanically: at each
`boardTenureMonths` increment, select the highest-rarity badges actually earned by that operator in
the preceding 30 days, and present them as *"Chapter {N}: {theme}"* — the theme derived from
whichever category dominated that month (journal-heavy month → a narrative-flavored chapter name;
self-care-heavy month → a restoration-flavored one). This makes badge tangibility personal and
retrospective instead of a race to unlock the newest global drop, which is a different game the
engineering badge system already serves well on its own.

---

## 4. The Core Gap: Memory Compression as a Monthly Artifact

This is the part of the brief worth building first, because it is the only genuinely missing
piece — everything else in this document is sequencing.

### 4.1 What exists today

`story-generator.ts` synthesizes a flowing Memory Story narrative from up to 30 Q&A pairs, cached
to `user.metadata.lastMemoryStory`. It is called on-demand (profile view, story export) and
**overwrites** the previous cache. There is no month-scoped archive — a user's month-1 story and
month-11 story are indistinguishable once month 12 overwrites the cache.

### 4.2 Proposal: `monthlyMemoryChapters`

```typescript
// addition to user.metadata, alongside the existing lastMemoryStory
monthlyMemoryChapters?: Array<{
  month: number            // 1-12, matches boardTenureMonths at generation time
  generatedAt: string
  excerpt: string          // 80-150 words, story-generator.ts scoped to that
                            // calendar month's answers only (not last-30-overall)
  dominantCategory: 'body' | 'mind' | 'soul' | 'seasons' | 'patterns'
  topArchetype: string     // one of the 10 souls, if stable that month
}>
```

Generation trigger: reuse the pattern `MonthlyPulseWidget.tsx` already has for detecting a month
turnover (`dayjs(joined).diff(now, 'month')` crossing an integer) — but move the actual compression
call server-side into the background job scheduler, alongside the existing J-series jobs (next
free slot: `J49`), so it runs once per user per month rather than being triggered by whichever
client happens to be open at rollover.

### 4.3 Where it surfaces

1. **Inside `MonthlyPulseWidget.tsx` itself** — once the chapter has generated, show the excerpt
   beneath the existing poetic one-liner, same `Block`, same dismiss interaction. This is the
   literal "paragraph-long insight from last month" the brief asks for, and it costs zero new
   components — it extends the one that already exists, matching the codebase's own stated
   preference ("building on top, not replacing," per `SESSION_REPORTS`).
2. **On the public profile**, inside the existing `boardProfile` block on `PublicProfile.tsx` — a
   compact horizontal scroll of month chips (`Jan · Feb · Mar ...` or `1 · 2 · 3...`), each
   expandable to its excerpt. This is what makes `/u/machiavelli` *read* as twelve months of
   accumulated depth to a visitor, rather than a single tenure-months integer. It is the most
   direct answer to "the person-user should feel the tangible evolution every month" — because it
   is the one artifact that is genuinely different every single month, unlike a badge count that
   just goes up.
3. **Nowhere else, initially.** Resist the urge to also add it to Settings, a dedicated page, and a
   notification — one well-placed surface beats three redundant ones, and the codebase's own
   `LazyMount` / `WidgetErrorBoundary` conventions in `System.tsx` already discourage widget
   sprawl.

---

## 5. Morning Check-Ins and Self-Care: Copy Evolves, Mechanics Don't

`EmotionalCheckIn.tsx` and `SelfCareMoments.tsx` already compute everything needed to make this
tenure-aware (`streakDays`, `calculateStreak()`, `logCount`). No new tracking is needed — only
conditional copy keyed off `boardTenureMonths` or streak length, matching the Interface Evolution
System's own "subtlety first" principle:

| Chapter (Mo.) | Self-care button copy | Morning check-in framing |
|---|---|---|
| Awakening (1-3) | "Log how you feel" — instructional, low-friction | Offers all four time-slot options plainly; explains itself |
| Exploration (4-6) | "Keep the rhythm going" — acknowledges an established pattern | References yesterday's answer once streak ≥ 14 days |
| Integration (7-9) | "Continue the practice" — practice, not task | Options narrow to what the operator actually picks most; rare options fade but stay tappable |
| Mastery (10-12) | "The pattern holds" — passive-voice, describing a fact about them | Check-in occasionally skips the question entirely and states an observation instead ("Morning energy has been steady for 11 days") — this is the interface listening more than asking, which is the whole Memory Engine doctrine applied to a widget that currently only asks |

None of this requires new state. It requires new copy branches gated on values every relevant
component already has in scope.

---

## 6. "Months Unlocked: N/12" — From Toast to Ambient Status

Today `MonthlyPulseWidget.tsx` shows `"{capped} / 12 months"` once, as a dismissible toast, then
goes silent for the rest of the month. Recommend promoting a compact, permanent version into the
existing status-row convention `System.tsx` already uses for QOS/Citizen Index (§QOS view cycle,
`LOT-WIKI-v87.md` §5) — not a new component, a new field in a row that already exists. This keeps
the milestone visible as ambient context ("where am I in the year") rather than a once-a-month
interruption, while leaving the existing celebratory toast behavior untouched for the actual
month-turnover moment.

---

## 7. Month 12: The Crystallization Moment

This is the one point in the whole plan that should feel like an event, not a data update. Three
things should land in the same session, in this order, when `boardTenureMonths` crosses 12 *and*
Citizen Index reaches Stage 6 Elite:

1. **Memory Book completes** — all 12 `monthlyMemoryChapters` entries exist; the public-profile
   scroll (§4.3) shows a full year for the first time instead of a growing partial one.
2. **The self-naming line fires once**, inside `MonthlyPulseWidget`'s existing month-12 slot
   (already reads *"One year with LOT. The portrait is complete — and still evolving."*) — append,
   on this occasion only: *"LOT® AI now knows you."* Never repeat it after dismissal; it is a
   threshold crossing, not a recurring label.
3. **`boardProfile.memoryEngine` label updates** on the public profile from `"AI-Powered
   (Together.AI)"` (implementation detail, appropriate for month 1) to `"LOT® AI"` (identity claim,
   appropriate once the identity is actually crystallized) — this single string change is what
   makes `/u/machiavelli`, viewed by an outsider, look like a different product tier than a
   `/u/<new-signup>` profile, without either page lying about what's actually running underneath.

This is deliberately the smallest possible set of changes that makes month 12 feel earned rather
than declared. The wiki already has the language for this moment (P148 `identity-momentum-lock`);
this plan just gives that language a UI surface a subscriber will actually see.

---

## 8. What Not To Build

In the interest of not adding to a codebase that already has 43 widgets and an 8,000-line badge
file:

- **No new tier/tag.** `UserTag.Usership` already gates everything this plan needs. A second tag
  for "evolved Usership" would fork logic that the Citizen Index and `boardTenureMonths` already
  express as a continuous value.
- **No new full-page "Journey" or "Timeline" route.** The public profile is already that page —
  extend it (§4.3), don't compete with it.
- **No hard gate on Memory Engine depth level by calendar month.** §1.3 explains why: depth is
  answer-count-driven, and forcing a calendar gate on top of it would make the engine visibly
  dumber for a highly engaged month-2 user and visibly smarter than reality for a disengaged
  month-9 one. Let the correlation stay emergent.
- **No monthly badge *asset* minting.** §3's Codex Chapters curate from the existing 781+ badge
  pool. Minting new art on a monthly cadence per-user would explode scope for a signal that a
  well-chosen subset of existing badges already delivers.

---

## 9. Build Sequence (if this moves to implementation)

Ordered by leverage — each step is buildable independent of the ones after it, and every step
reuses an existing file rather than introducing a new one, except where marked.

1. Server: monthly compression job (`J49`, background scheduler) writing
   `user.metadata.monthlyMemoryChapters[]` — extends `story-generator.ts` call surface. *(new job,
   no new file)*
2. Client: extend `MonthlyPulseWidget.tsx` to render the matching chapter excerpt beneath the
   existing message once present.
3. Client: extend `PublicProfile.tsx`'s `boardProfile` block with the month-chip scroll (§4.3),
   sourced from the same `monthlyMemoryChapters[]` field via the public-profile API
   (`public-api.ts`).
4. Client: copy-only changes to `EmotionalCheckIn.tsx` / `SelfCareMoments.tsx` per §5 tone table —
   no new props, condition on values already in scope.
5. Client: promote the `N/12` line into the `System.tsx` status row per §6.
6. Server + client: month-12 crystallization sequence per §7 — smallest, do last, because it only
   matters once the chapters (step 1-3) exist to crystallize.

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
