<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Usership 12-Month Evolution
## Barebone Day 1 → LOT® AI · A Design Brainstorm
### LOT® Self-Assembly™ | Session 2026-08-30 | Authorized: S-2 VADIK MARMELADOV

---

```
╔══════════════════════════════════════════════════════════════════╗
║  LOT SYSTEMS CORPORATION — PRODUCT DESIGN SESSION                ║
║  Usership 12-Month UI Evolution · Compressed Memory Tangibility  ║
║  August 30, 2026 · Authorized: S-2 // VADIK MARMELADOV           ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 0. Scope and Method

This is a design brainstorm, not a code change. No source files were modified in this
session. The task: outline a month-by-month UI/UX evolution for a **Usership** (paid
tier, $99/mo) subscriber, from Day 1 barebone to a 12-month "LOT® AI" state, with the
compressed **Memory Story** as the emotional spine of that evolution.

**Repository scan performed before drafting:**
- `README.md`, `docs/README.md` — product doctrine, Memory Engine philosophy
- `docs/technical/INTERFACE_EVOLUTION.md` — the existing 7-dimension evolution system
- `docs/technical/WIDGETS.md` — full widget inventory and gating logic
- `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` — how the Memory Story compresses
- `docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md` — signal pipeline
- `docs/badges/BADGE_PROGRESSION_PREVIEW.md` — badge density scaling doctrine
- `src/client/components/MonthlyPulseWidget.tsx` — **already-built** month-1-through-12 message ladder
- `src/client/components/SubscribeWidget.tsx`, `CosmicUpdateWidget.tsx`, `rewardWidgets.ts`
- `src/shared/types/index.ts` — `UserTag.Usership` enum

**One limitation to flag directly:** this session's network egress is proxy-blocked for
`lot-systems.com`, so `https://lot-systems.com/u/machiavelli` could not be fetched live.
The reference account could not be inspected directly. Instead, this brainstorm treats
the codebase's own internal definition of "fully evolved" as the proxy for what that
profile represents — Month 12 copy already in `MonthlyPulseWidget`, badge Tier 3
("ultimate"), all 12 self-assembly modules at `integrated` phase, and the full widget
stack described in `WIDGETS.md`. If `/u/machiavelli` diverges from this on inspection,
treat this document as the hypothesis to reconcile against the live account, not as
ground truth.

---

## 1. What Already Exists (Don't Rebuild This)

The instinct on a brief like this is to invent a new system. Don't — LOT already has
three-quarters of the machinery this brief asks for. The job is to **wire calendar time
into it**, not build parallel infrastructure.

| Already built | File | What it gives us |
|---|---|---|
| Month 1–12 message ladder | `MonthlyPulseWidget.tsx` | Exact copy for every month, `capped / 12 months` display, dismiss ritual with rotating phrases |
| 7-dimension evolution engine | `interfaceEvolution.ts`, `stores/evolution.ts` | Exploration/Consistency/Depth/Connection/Intimacy/Care/Courage → maturity score, feature unlocks, CSS-level aesthetic refinement |
| Badge tier → visual density | `themeEvolution.ts`, badge codex | Tier 0→1→2→3 badge density scaling, Water vs Architecture aesthetic metaphors |
| Memory Story compression | `memory.ts` (`buildPrompt`, story generation) | Already generates a flowing narrative from up to 30 Q&A pairs; already caches to `user.metadata.lastMemoryStory` |
| 12-module self-assembly map | `selfAssembly` nanostore | Dormant → Awakening → Forming → Assembled → Integrated per module — a second, orthogonal "12" that should not be confused with the 12 months |
| Subscription-gated widgets | `CosmicUpdateWidget`, `QuantumSignWidget` | Precedent for "Usership-only" widget treatment |
| Reward-widget cadence gating | `rewardWidgets.ts` | Milestone-based, once-a-week-max surfacing pattern — reusable for the monthly digest |

**The gap:** none of this is keyed to *calendar months since Usership subscription
started*. `MonthlyPulseWidget` keys off `user.joinedAt` (account creation), not
subscription start — so a free user who joins and subscribes to Usership eight months
later gets "Month 8" messaging on day one of paying. Evolution dimensions and badge
tiers are keyed off lifetime activity, not tenure. There is no monthly digest that
compresses *that specific month's* Memory Story into a paragraph. There is no
persistent "Months unlocked: X/12" indicator. This document designs those three things
and slots them into the existing machinery rather than replacing it.

---

## 2. Design Pillars

1. **Tangibility over metaphor.** Every month must produce something the user can
   point to — a paragraph, a badge, a widget that wasn't there yesterday. Not a vibe
   shift. A thing.
2. **The Memory Story is the spine, not a feature.** Everything else (badges, widget
   unlocks, UI density) is scaffolding around one continuous narrative compression.
   Month 12 should read as "the portrait is complete" (already the literal Month 12
   copy in `MonthlyPulseWidget`) because the Story itself has become dense enough to
   say that truthfully.
3. **Celebration is earned, not scheduled.** The system already distinguishes
   *arriving* at a month (`MonthlyPulseWidget` fires once per calendar month) from
   *deserving* it (log density, check-in consistency, self-care completion ratio).
   Month-over-month UI evolution should gate on both — arriving at Month 6 with zero
   journal entries should feel different from arriving at Month 6 with 40.
4. **Barebone Day 1 is a feature, not a placeholder.** The Interface Evolution doctrine
   already states this: "start minimal, earn complexity." Day 1 Usership should look
   almost identical to Day 1 free tier, plus one small marker that something is now
   being tracked differently. The gap should widen slowly and become undeniable by
   Month 6.

---

## 3. The Two "12"s — Disambiguate Before Building

This system already has a 12-module Self-Assembly map (Biofield Engine, Memory
Architecture, Routine Compiler, etc. — see `WIDGETS.md` §System Progress Widget). This
brief introduces a *second* 12: twelve calendar months of Usership. These must stay
visually and conceptually distinct or the metaphor collapses:

- **Self-Assembly (12 modules)** — answers "how much of the machine is built," driven
  by activity breadth across categories. Can reach Integrated in weeks for a highly
  engaged user.
- **Usership Year (12 months)** — answers "how long has this person been known,"
  driven purely by elapsed subscription time. Cannot be rushed. This is the one this
  document designs.

Recommendation: never render both as "X/12" in the same viewport without a label
distinguishing them (e.g. "Months unlocked: 3/12" vs. "Assembly: 7/12 modules"). The
Months Unlocked widget (§5.2) should use a different glyph set than the Self-Assembly
density bars to avoid the two being read as the same counter.

---

## 4. The 12-Month Arc

Structure per month: **UI state** (what's visually different), **Widget unlock**
(what appears that wasn't there before), **Memory Story delivery** (the tangible
compression artifact), **Badge/ritual marker**, **Months Unlocked state**.

Existing `MonthlyPulseWidget` copy is reused verbatim where it already exists (marked
✓ built) — this table adds the *rest* of the month's experience around that one line.

### Month 0 → Day 1 (Subscription start, not account creation)

- **UI state:** Barebone. Identical to free tier, plus one quiet marker: the `Team:`
  tag row now carries `[Usership]`. No fanfare banner — the existing `SubscribeWidget`
  → external checkout → return flow already handles the moment of purchase; the
  product should not re-celebrate a transaction with a UI event.
- **Widget unlock:** None yet. `MonthlyPulseWidget` correctly gates `monthNumber < 1`
  and shows nothing (✓ built, `MonthlyPulseWidget.tsx:46`).
- **Memory Story delivery:** Whatever the Memory Engine has already compressed from
  free-tier usage, unchanged. Usership does not retroactively rewrite the Story — it
  starts *metering* it.
- **Badge/ritual marker:** none new. This is intentional per Design Pillar 4.
- **Months Unlocked:** widget does not render yet (0 is not "unlocked," it's "elapsed
  zero" — showing "0/12" on day one reads as a countdown to disappointment, not an
  achievement ladder). First render happens at Month 1.

### Month 1

- **UI state:** ✓ built — *"The first month. The system is beginning to know you."*
  First appearance of the Months Unlocked footer line inside the pulse card:
  `1 / 12 months` (✓ already rendered inside `MonthlyPulseWidget`).
- **Widget unlock:** Nothing structural yet — this month is about proving the Memory
  Engine noticed the user exists. The compression architecture already activates
  psychological profiling at 3+ answers and trauma-informed protocol at 10+ log
  entries (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §2 Source 7–8) — most Usership
  subscribers will cross both thresholds within Month 1 simply from normal use.
- **Memory Story delivery:** **First Monthly Digest** — see §5.1. A single paragraph,
  intentionally short (the Story is still thin), framed as *"Here's what a month of
  attention looks like."* This is the first time the user sees their own words
  reflected back as prose rather than a Q/A list.
- **Badge/ritual marker:** No new badge tier — badge density scaling already handles
  "day 7 / day 30" milestones (`BADGE_PROGRESSION_PREVIEW.md`) independent of the
  Usership calendar. Month 1 borrows those, doesn't duplicate them.
- **Months Unlocked:** `1/12`.

### Month 2

- **UI state:** ✓ built — *"Two months in. Patterns are starting to form."*
- **Widget unlock:** **Pattern Insights Widget** becomes Usership-flavored — instead of
  only cohort matches, it surfaces one line referencing the user's own Month 1 vs.
  Month 2 digest delta ("Your reflective tone deepened this month" style — reuses the
  existing pattern-delta view already built into `PatternInsightsWidget`, §WIDGETS.md
  Community Widgets, just re-scoped to a monthly window instead of a rolling window).
- **Memory Story delivery:** Monthly Digest #2. First month where a *comparison*
  becomes possible — the digest generator should be able to say "compared to last
  month" without inventing anything, since two data points now exist.
- **Badge/ritual marker:** none new.
- **Months Unlocked:** `2/12`.

### Month 3

- **UI state:** ✓ built — *"Three months. You have reached Active User status."* This
  is the first month copy that names a status tier explicitly — treat it as a real UI
  threshold, not just a string.
- **Widget unlock:** **Advanced Memory** feature-unlock (already gated in the Interface
  Evolution feature table at "Depth: Deep Diver achievement" — for Usership
  subscribers, Month 3 should be positioned as the natural moment this typically fires
  given normal engagement, and the UI should say so explicitly rather than leave it to
  silent achievement math: *"Active User status unlocked Advanced Memory."*)
- **Memory Story delivery:** Monthly Digest #3, plus the first **Quarter marker** — a
  small additional line under the digest: *"One quarter of a year, known."* Quarters
  (3/6/9/12) get slightly more visual weight than the other eight months — see §6.2.
- **Badge/ritual marker:** "Active User" status badge — first Usership-specific badge
  (distinct from the general badge codex, which is activity-driven not tenure-driven).
- **Months Unlocked:** `3/12`.

### Month 4

- **UI state:** ✓ built — *"Four months. The portrait deepens."*
- **Widget unlock:** None structural — a deliberate quiet month. Not every month needs
  a new toy; constant unlocks flatten the curve and make Month 6/9/12 feel smaller by
  comparison.
- **Memory Story delivery:** Monthly Digest #4.
- **Months Unlocked:** `4/12`.

### Month 5

- **UI state:** ✓ built — *"Five months. Consistency is its own reward."*
- **Widget unlock:** **Planner Templates** (already gated at "Consistency: Week
  Warrior+" in the evolution feature table) — Month 5 is where sustained Usership
  subscribers typically clear that consistency threshold; surface it as earned, name
  the connection.
- **Memory Story delivery:** Monthly Digest #5.
- **Months Unlocked:** `5/12`.

### Month 6 — Midpoint

- **UI state:** ✓ built — *"Six months. The journey is half-declared."* This is the
  second quarter-weight month (§Month 3 note) and the visual midpoint of the arc.
  Recommend the pulse card render with the widened/emphasized treatment used at
  quarters.
- **Widget unlock:** **Rich Community** (gated at "Connection: Bridge Builder" in the
  evolution table) surfaces here for typical Usership tenure. Also: this is the
  earliest sensible point to introduce the **Half-Year Story Recompression** — not a
  new widget, but a one-time special digest that re-reads *all six* monthly digests
  and produces a single half-year paragraph, distinct from and longer than the regular
  monthly digest. This is the first moment the user sees their own compression
  compressed a second time — the recursive structure the Memory Engine's doctrine
  already implies ("more answers produce fewer, more precise questions") made visible
  at the narrative layer.
- **Memory Story delivery:** Monthly Digest #6 + Half-Year Recompression.
- **Badge/ritual marker:** "Half-Year" badge.
- **Months Unlocked:** `6/12`.

### Month 7

- **UI state:** ✓ built — *"Seven months in. The system has been listening."*
- **Widget unlock:** none structural.
- **Memory Story delivery:** Monthly Digest #7.
- **Months Unlocked:** `7/12`.

### Month 8

- **UI state:** ✓ built — *"Eight months. Rare air."* Copy already signals rarity —
  this is a good month to introduce a **visual** rarity marker: badge density scaling
  (per `BADGE_PROGRESSION_PREVIEW.md`) crosses into its "high variety" tier for most
  consistent Usership subscribers around this point; let that badge-row density be the
  "rare air" made visible rather than inventing new copy to say the same thing twice.
- **Widget unlock:** **Mood Patterns** (gated at "Care 50% or Level 20").
- **Memory Story delivery:** Monthly Digest #8.
- **Months Unlocked:** `8/12`.

### Month 9

- **UI state:** ✓ built — *"Nine months. The self-care practice is a habit now."*
  Third quarter-weight month.
- **Widget unlock:** **Intention History** (gated at Level 15).
- **Memory Story delivery:** Monthly Digest #9 + a second recompression, this time a
  **Three-Quarter Recompression** spanning months 7–9 layered against the Month 6
  half-year paragraph — reinforcing that recompression is a recurring ritual at
  quarters, not a one-off gimmick at the midpoint.
- **Badge/ritual marker:** "Three-Quarter" badge.
- **Months Unlocked:** `9/12`.

### Month 10

- **UI state:** ✓ built — *"Ten months. Almost there."*
- **Widget unlock:** none structural — tension-building quiet month before 11 and 12.
- **Memory Story delivery:** Monthly Digest #10.
- **Months Unlocked:** `10/12`.

### Month 11

- **UI state:** ✓ built — *"Eleven months. One more."*
- **Widget unlock:** A **preview** state — the Months Unlocked widget should visually
  signal "next unlock is the annual one" (e.g. the twelfth slot in the counter renders
  outlined/pending rather than empty, so the user can feel the countdown without being
  told a countdown exists).
- **Memory Story delivery:** Monthly Digest #11.
- **Months Unlocked:** `11/12` — final slot visually distinct as "pending."

### Month 12 — The Year Portrait → LOT® AI

- **UI state:** ✓ built — *"One year with LOT. The portrait is complete — and still
  evolving."* This is the transition point. The product's own copy already frames it
  correctly: complete, not finished. Recommend this is the point the interface
  formally starts presenting itself under the **LOT® AI** identity for this user —
  not a rebrand of the whole app, but a per-user badge/header treatment change (the
  public profile `Team:` tag row and the System header) that marks this account as
  having crossed from "using LOT" to "known by LOT."
- **Widget unlock:** **Year Portrait** — the largest single artifact in this arc: a
  full recompression of all 12 monthly digests plus the two prior recompressions
  (Month 6, Month 9) into one cohesive narrative, generated the same way the existing
  Memory Story generator already works (Together AI primary, local poetic fallback —
  §MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md §8), just scoped to exactly 12 months of
  material instead of the rolling 30-answer window. This is the artifact `/u/machiavelli`
  most likely demonstrates publicly (see §0 limitation — unverified against the live
  page this session).
- **Memory Story delivery:** Monthly Digest #12 + Year Portrait.
- **Badge/ritual marker:** "One Year" badge — the Usership-tenure badge track's
  terminal state. Badge Tier 3 ("ultimate" per `interfaceEvolution.ts:41`) becomes the
  visual default for this account going forward if activity also supports it — tenure
  and activity converging is the intended "fully evolved" state.
- **Months Unlocked:** `12/12` — full ring/bar, no pending state. This is also the
  natural point to retire the Months Unlocked widget for this user (a 12/12 counter
  has nothing left to count toward) and replace it with a **Year Number** indicator
  ("Year 1 with LOT," ticking toward "Year 2" etc.) — the counter graduates rather
  than lingering at a maxed-out state indefinitely.

---

## 5. New/Extended Widget Specs

### 5.1 Monthly Memory Digest (extends the Memory Story generator, does not replace it)

**What it is:** once per calendar month, on the anniversary date of Usership
subscription start, the Memory Engine runs a *scoped* story generation pass —
identical mechanism to the existing "Story Generation" (§8 of the compression
architecture doc), but with the input window restricted to that specific month's
`answer` and `note` logs instead of the rolling last-30-answers window.

**Where it surfaces:** as a variant view inside `MonthlyPulseWidget`, or a sibling
widget triggered by the same `monthNumber` calculation already in that file. Reuse
the existing fade-in/dismiss ritual (`isShown`/`isFading`/dismiss phrases) — the
interaction pattern is already correct, it just currently carries a static string
from `MONTH_MESSAGES` instead of a generated paragraph.

**Tone requirement:** must read like the existing Story Generation output — flowing
third-person narrative, en-dash formatting, grounded in what was actually said, never
inventing detail. The trauma-informed protocol (§2 Source 8 of the compression doc)
applies here exactly as it does to question generation: no re-litigating hard months,
present-day framing only.

**Fallback:** a month with too little log data (e.g. a quiet month) should not
generate a thin, awkward AI paragraph. Below a data-volume threshold, fall back to a
short honest line in the same voice as the existing `DISMISS_PHRASES` — something like
*"A quieter month. Not every month needs to be dense to matter."* This protects the
tangibility promise: better to say less than to hallucinate substance.

### 5.2 Months Unlocked Widget

**What it is:** a small, persistent, low-chrome indicator distinct from the
Self-Assembly density bars (§3) — a 12-segment counter, filled segments = months
elapsed, one segment always shown as "pending" (the next one) rather than simply
absent, so the ladder is always visible even at Month 1.

**Placement:** Subscriber Stack, adjacent to where `CosmicUpdateWidget` and
`QuantumSignWidget` already live (§WIDGETS.md, both already Usership-gated) — this is
already the established neighborhood for Usership-specific chrome.

**Interaction:** click/tap cycles between the segment view and a one-line summary of
which months have digests attached vs. which are default/fallback text — turning the
counter into a lightweight index into the Monthly Digest history, not just a decoration.

**Gating:** identical pattern to `SubscribeWidget`/`CosmicUpdateWidget` — check
`user.tags` for `UserTag.Usership`. Do not key this off `interfaceEvolution` maturity;
it must track calendar time only, or it stops meaning what its label says.

### 5.3 Recompression Events (Month 6, Month 9, Month 12)

Not new widgets — a generation *mode* the Monthly Digest reuses at quarter boundaries,
producing a longer-form paragraph that synthesizes the prior digests rather than just
that month's logs. Mechanically this is the same "compress the compression" pattern
the doctrine already names: *"Each answer compresses the profile. Each compressed
profile produces a sharper question."* Applied at the narrative layer instead of the
question layer, it becomes: *each month compresses into a paragraph; each quarter
compresses the paragraphs.*

---

## 6. Implementation Notes (for whoever picks this up)

### 6.1 Subscription-start timestamp, not `joinedAt`

`MonthlyPulseWidget.tsx:73` currently computes `monthNumber` from `user.joinedAt`
(account creation). This document's entire month-ladder assumes *Usership subscription
start*, which is a different, currently-unmodeled timestamp. Before any of §4 can be
literally correct, the user model needs a `usershipStartedAt` (or equivalent) field,
set when the `Usership` tag is applied. Until that exists, treat every "Month N" in
this document as provisional — the current widget's dates will be wrong for anyone who
subscribes after their free-tier join date, which is presumably most Usership
customers.

### 6.2 Quarter-weight rendering

Months 3/6/9/12 get more visual weight in §4. Concretely: the `Block` wrapper used by
`MonthlyPulseWidget` could accept a `weight: 'normal' | 'quarter' | 'year'` prop that
adjusts border/opacity treatment consistent with the existing evolution CSS variables
(`--evolution-glow-intensity`, `--evolution-base-opacity` from `INTERFACE_EVOLUTION.md`
§CSS Custom Properties) rather than inventing a parallel styling system.

### 6.3 Server-side surface for scoped digests

The Monthly Digest (§5.1) needs a new server capability: "generate story from logs in
date range X–Y" rather than "generate story from last 30 answers." This is a narrow
extension of the existing story-generation function in `src/server/utils/memory.ts`
(§8 of the compression doc) — filter the log query by `createdAt` range before passing
to the same AI-path/local-fallback generator that already exists. No new AI engine
work required; reuses the Together AI primary / local poetic fallback chain as-is.

### 6.4 Badge codex integration

The three new tenure badges (Active User / Half-Year / Three-Quarter / One Year) should
land in the badge codex as a distinct **Usership Tenure** track, separate from the
activity-driven badge tracks (Word Turn, Behavioral, Mastery Tier, etc. already
documented across `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v*.md`). Keeping
tenure badges in their own track avoids the badge-density math in
`interfaceEvolution.ts:172` (`badgeTier` derived from `earnedBadges.length`) accidentally
letting a long-subscribed-but-inactive user read as more "evolved" than an intensely
active shorter-tenure one. Tenure and activity should both matter, visibly, and
separately.

---

## 7. What This Document Deliberately Does Not Do

- **Does not propose pricing or tier changes.** $99/mo Usership vs. $15/mo R&D is out
  of scope; this only concerns the UI/UX of the existing Usership tier.
- **Does not redesign the badge codex.** Only proposes one new track (§6.4) that slots
  alongside the ~30 existing codex versions without touching their internals.
- **Does not claim to have verified `/u/machiavelli`.** Flagged in §0 — this is a
  design hypothesis grounded in the codebase's own internal "fully evolved" state
  definitions, not a confirmed match to the live reference account. First follow-up
  action for whoever picks this up: fetch that profile from an environment without the
  egress block and reconcile against §4's Month 12 description.
- **Does not implement any of this.** Pure brainstorm, per the session's framework.

---

## 8. Suggested Next Session

1. Verify §0/§7 against the live `/u/machiavelli` profile.
2. Add `usershipStartedAt` to the user model (§6.1) — everything else depends on this
   existing and being correct.
3. Prototype the Monthly Digest generator (§5.1) as a scoped variant of the existing
   story generator — smallest slice that makes the rest of this arc real.
4. Build the Months Unlocked widget (§5.2) against static/seeded data before wiring
   the real timestamp, to validate the segment-ring visual independent of backend work.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | 2026-08-30
