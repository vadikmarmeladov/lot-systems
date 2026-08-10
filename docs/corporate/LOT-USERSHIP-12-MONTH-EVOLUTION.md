<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION
## From Barebone Day One to LOT® AI

**Author:** Claude (session), for S-2 Vadik Marmeladov
**Classification:** PRODUCT / DESIGN BRAINSTORM — not yet implemented
**Date:** 10 August 2026
**Status:** PROPOSAL — awaiting S-2 review before engineering
**Scope:** UI/UX evolution of the Usership ($99/mo) tier, month 1 → month 12

---

## 0. Executive Summary

Usership is priced like an operating system, not an app. The interface should
prove that out. Today a brand-new Usership subscriber and a 300-day veteran
see nearly the same widget stack — the difference is invisible except in a
handful of gated widgets and the `MonthlyPulseWidget`'s one-line monthly
message. That is a missed opportunity: the product's real asset is the
**compressed Memory story**, and right now nothing in the UI makes twelve
months of that compression *feel* different from one.

This document proposes a 12-month evolutionary path for the Usership UI —
barebone on Day 1, unmistakably "LOT® AI" by Month 12 — built entirely out of
**mechanisms that already exist in this codebase**. Nothing here invents a
new engine. It sequences and surfaces what `interfaceEvolution.ts`,
`selfAssembly.ts`, `memory.ts`, and `badges.ts` already compute, and proposes
three small new widgets to make that computation *visible as a story* rather
than a background process.

**Reference account:** `lot-systems.com/u/machiavelli` was named as the
target "12-months evolved" reference. This session's network egress policy
blocks `lot-systems.com`, so it could not be fetched directly — flagging this
rather than guessing at its content. In its place, `PublicProfile.tsx` (the
component that renders that exact page) was read directly: it is the ground
truth for what a fully-evolved Usership/Legacy profile actually displays
(`psychologicalProfile`, `boardProfile`, `correlatedIndexes`, `weatherStation`,
`wallet`, the QR code gated on Usership + assembly phase ≥ Forming). Section 1
below documents those fields as the real end-state target.

---

## 1. What Already Exists (Audit)

Four systems already compute exactly the kind of progression this brief asks
for. None of them currently narrate themselves month-by-month.

| System | File | What it already does |
|---|---|---|
| **Monthly Pulse** | `src/client/components/MonthlyPulseWidget.tsx` | Usership-gated. Computes `monthNumber` from `user.joinedAt`. Shows one hand-written line per month (1–12, see Appendix A) plus an `"X / 12 months"` counter. Dismiss-once-per-month via `localStorage`. **This is the seed of everything below — it already has the exact shape asked for, just under-powered.** |
| **Interface Evolution** | `src/client/utils/interfaceEvolution.ts` | 7 dimensions (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage), each 0–1. Derives `level` (1–100), `chapter` (1–4, thresholds: <10 → Ch.1, 10–29 → Ch.2, 30–59 → Ch.3, ≥60 → Ch.4), `badgeTier` (0–3), `badgeTheme` (water/architecture), and CSS custom properties (opacity, grid, glow, letter-spacing) that visibly refine the whole app. |
| **Self-Assembly Engine** | `src/client/stores/selfAssembly.ts`, rendered in `SystemProgressWidget.tsx` | 12 modules — Biofield Engine, Memory Architecture, Routine Compiler, Intention Core, Cleanness Protocol, Reflection Layer, Community Mesh, Ecosystem Bridge, Quantum Substrate, Nutrition Protocol, Goal Architecture, Archetype Classifier — each moving through Dormant → Awakening → Forming → Assembled → Integrated, driven by real QIE signals. **Twelve modules. Twelve months. This mapping doesn't exist yet and is free.** |
| **Memory Engine compression** | `src/server/utils/memory.ts`, doc: `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Four depth levels per `Mode 3: Follow-Up` — 1 Behavior → 2 Motivation → 3 Values → 4 Soul — unlocked by answer-count density, not calendar time. Weekly Story-Report already specced in `LOT-AI-PRODUCT-BRIEF.md` (`GET /api/story/latest`) as a first-person narrative export. **There is no monthly-cadence story artifact today — only weekly.** |

The `PublicProfile.tsx` end-state (the "machiavelli" proxy) renders, gated on
`hasUsership`: soul archetype + description, self-awareness %, the Level
badge (`∘`/`≈`/`≋` at 7/30/100 days via `getLevelSymbol()`), core values,
emotional patterns, behavioral cohort, behavioral traits, pattern-strength
counts, answer/note totals — then at Legacy tier adds `boardProfile`
(Citizen Index, biofield state, activity counts, Memory Engine version,
clearance level), `correlatedIndexes`, `weatherStation`, `wallet`, and a QR
code gated on `assemblyPhase ≥ forming`. **That is the destination.** The
question this brief answers is: what does the climb from Day 1 to that page
look like, month by month?

---

## 2. Design Thesis — Four Acts, Not Twelve Random Steps

`chapter` (1–4) already exists in code and is already named in
`INTERFACE_EVOLUTION.md`'s milestone log as *Awakening → Exploration →
Integration → Mastery*. The Memory Engine's four depth levels
(Behavior → Motivation → Values → Soul) are a near-exact semantic match. Pair
them, one act per quarter, and the 12 months stop being a flat counter and
become a story with rising stakes:

| Act | Months | Chapter (code) | Memory depth | Badge tier | Self-Assembly spotlight |
|---|---|---|---|---|---|
| **I — Awakening** | 1–3 | 1 (level <10) | 1 · Behavior | 0 → 1 | Biofield Engine, Memory Architecture, Routine Compiler |
| **II — Exploration** | 4–6 | 2 (level 10–29) | 2 · Motivation | 1 | Intention Core, Cleanness Protocol, Reflection Layer |
| **III — Integration** | 7–9 | 3 (level 30–59) | 3 · Values | 2 | Community Mesh, Ecosystem Bridge, Quantum Substrate |
| **IV — Mastery** | 10–12 | 4 (level ≥60) | 4 · Soul | 3 | Nutrition Protocol, Goal Architecture, Archetype Classifier |

Level thresholds are earned by engagement, not the calendar — a highly
active user could hit Chapter 4 in month 6; a lighter user might still be in
Chapter 2 at month 9. **The month-by-month plan below is the target pacing
for a consistently-engaged Usership subscriber**, not a hard gate. Where
calendar month and engagement level diverge, the UI should trust the level
(earned) over the month number (elapsed) for *feature* unlocks, and use the
month number only for the *narrative* layer (Monthly Pulse, badges, Story
Compression) — exactly the way `MonthlyPulseWidget` already separates
`monthNumber` (elapsed) from `evolutionState` (earned).

---

## 3. Month by Month

Each month specifies: the state of the UI, the log/check-in target that
keeps a consistently-engaged user on pace for that Act, the badge/module
spotlight, the visual evolution, and the Memory Story Compression concept
(new — see §4b). Monthly Pulse copy is quoted from the live code where it
exists (Appendix A); new copy is marked **(proposed)**.

### ACT I — AWAKENING (Chapter 1 · Depth 1: Behavior)

**Month 1 — "The system is beginning to know you"**
- UI state: barebone. Core Widgets only (Time, Memory, Planner, Recipe) plus
  the always-on QIE Stack. No feature unlocks yet — `Level 5` (Custom
  Themes) and `Level 10` (Widget Arrange) are still ahead.
- Log target: first 10 Memory answers (unlocks the Subscribe Widget's own
  gate, ironically now behind them). First `note` entries. First
  emotional check-in.
- Badge/module: Self-Assembly modules sit at Dormant/Awakening. No Level
  badge yet (`getLevelSymbol` starts at day 7).
- Visual: `--evolution-base-opacity` at its floor (0.85), grid barely
  visible, no glow. The app should feel deliberately quiet.
- Monthly Pulse (live): *"The first month. The system is beginning to know you."*
- Story Compression: none yet — insufficient answer density for even a
  local-fallback paragraph.

**Month 2 — "Patterns are starting to form"**
- Day 7 Level badge unlocks: `∘` (droplet, water theme) or the geometric
  equivalent under architecture theme.
- Widget Arrange candidate territory begins (Level 10 threshold approaching).
- Log target: consistency streak becomes visible for the first time (7+ days).
- Monthly Pulse (live): *"Two months in. Patterns are starting to form."*

**Month 3 — "You have reached Active User status"**
- Chapter 1 → 2 transition likely lands here for a consistently-engaged
  user (level crosses 10). This is the Act I → Act II hinge.
- Self-Assembly: Biofield Engine and Routine Compiler should be reaching
  Forming/Assembled if daily check-ins and planner use have been steady.
- Custom Themes unlock (Level 5) should already have landed; Widget Arrange
  (Level 10) lands around now.
- Monthly Pulse (live): *"Three months. You have reached Active User status."*
- Story Compression **(proposed)**: first monthly paragraph becomes
  possible — 30+ answers is the density threshold where the Memory Engine's
  archetype-aware insight responses already activate (`memory.ts` §9,
  Answer 10+). Month 3 is realistically the first month with enough Q&A
  density for a genuine paragraph rather than a template line.

### ACT II — EXPLORATION (Chapter 2 · Depth 2: Motivation)

**Month 4 — "The portrait deepens"**
- Questions shift from Level 1 (behavior: *"How do you prepare your tea?"*)
  toward Level 2 (motivation: *"What does this morning ritual provide for
  you?"*).
- Mood Patterns widget (Care 50% or Level 20) becomes a realistic unlock
  target this month or next.
- Monthly Pulse (live): *"Four months. The portrait deepens."*

**Month 5 — "Consistency is its own reward"**
- Day 30 Level badge: `≈` (wave) / structural equivalent. This is the
  first badge upgrade a user *notices* — day 7 badges arrive quietly inside
  a fast-moving first month, day 30 lands with more weight.
- Intention History (Level 15) unlock window.
- Monthly Pulse (live): *"Five months. Consistency is its own reward."*

**Month 6 — "The journey is half-declared"**
- Chapter 2 → 3 hinge for a consistently-engaged user (level crosses 30).
- Self-Assembly: Intention Core, Cleanness Protocol, Reflection Layer should
  be Assembled/Integrated by now if the Act II modules tracked engagement.
- This is the **halfway story beat** — the UI should treat it differently
  from the other 11 months. Proposed: Monthly Pulse for Month 6 gets a
  slightly longer companion line under the existing message, pulling one
  sentence from the accumulated Memory Story rather than a static string —
  the first appearance of real Story Compression inside the ritual itself.
- Monthly Pulse (live): *"Six months. The journey is half-declared."*

### ACT III — INTEGRATION (Chapter 3 · Depth 3: Values)

**Month 7 — "The system has been listening"**
- Questions shift to Level 3 (values: *"What value does this practice honor?"*).
- Trauma-informed protocol (active since 10+ log entries, much earlier in
  practice) is now operating on a rich enough history that its
  present-day-functioning framing is doing real protective work — worth
  noting in the narrative copy even if invisible in the widget itself.
- Monthly Pulse (live): *"Seven months in. The system has been listening."*

**Month 8 — "Rare air"**
- Pattern Insights (Consistency 66%, Moon Cycle+) unlock window.
- Self-Assembly: Community Mesh, Ecosystem Bridge should be Forming —
  this is the month the product's *social* surface (Chat Catalyst, Cohort
  Connect, Rich Community at Connection: Bridge Builder) should start
  feeling reachable rather than theoretical.
- Monthly Pulse (live): *"Eight months. Rare air."*

**Month 9 — "The self-care practice is a habit now"**
- Day 100 Level badge lands somewhere in this window for a user who
  started strong: `≋` (current) / monument-tier architecture equivalent.
  Chapter 3 → 4 hinge (level crosses 60) is realistic here for the most
  engaged cohort, later for most.
- Narrative Reflection (Depth 66% + Level 30) unlock window — the first
  widget explicitly gated on *depth*, not just level, becomes reachable.
- Monthly Pulse (live): *"Nine months. The self-care practice is a habit now."*

### ACT IV — MASTERY (Chapter 4 · Depth 4: Soul)

**Month 10 — "Almost there"**
- Questions can reach Level 4 (soul: *"What does this reveal about who
  you're becoming?"*) for users with sufficient density.
- Social Mentions (Connection 100%) and Private Spaces (Intimacy 50% /
  Courage 100%) — the two most vulnerability-gated unlocks — become
  reachable for users who leaned into Act III's community and values work.
- Monthly Pulse (live): *"Ten months. Almost there."*

**Month 11 — "One more"**
- Export Data (Level 25) should be long unlocked by now; this is the month
  to surface it more prominently — a user this deep in the compression
  loop is exactly the person who wants to see the shape of their own data
  before the year closes.
- Monthly Pulse (live): *"Eleven months. One more."*

**Month 12 — "The portrait is complete — and still evolving"**
- This is the destination page: the `PublicProfile.tsx` end-state audited
  in §1 — full `psychologicalProfile` block, Level badge, pattern strength,
  QR code (assembly phase ≥ Forming). Legacy-tier fields (`boardProfile`,
  `correlatedIndexes`, `weatherStation`, `wallet`) become the *visible next
  door* rather than an abstract upsell — Usership users should be able to
  see the shape of what Legacy adds without it being paywalled-invisible.
- Self-Assembly: all 12 modules should be at Assembled/Integrated for a
  consistently-engaged user — the module-per-month spotlight in §2's table
  closes its loop exactly here.
- Monthly Pulse (live): *"One year with LOT. The portrait is complete — and
  still evolving."* — note the code already refuses to call this an ending.
  Month 12 is a chapter close, not a finish line; the widget correctly caps
  displayed month number at 12 while `monthNumber` keeps counting
  underneath (`Math.min(monthNumber, 12)`), so Year 2 inherits the same
  ritual without a redesign.

---

## 4. Three New Widgets (Proposed — Not Built)

Everything above is narration of existing state. These three are the actual
*new surface area* this brief asks for — designed to slot into the existing
Subscriber Stack next to `MonthlyPulseWidget`, `QuantumSignWidget`, and
`CosmicUpdateWidget`, using the same gating and visual idioms already in the
codebase (`Block label blockView`, cascade fade, `evolution-*` CSS vars).

### 4a. "Months Unlocked: N/12" — contextual progress widget

A compact companion to `MonthlyPulseWidget`, styled after the existing
Self-Assembly module density bars in `SystemProgressWidget.tsx`. Rather than
duplicating the Monthly Pulse message, it renders the Act structure from §2
as a single line of progress:

```
Months unlocked:  ▮▮▮▮▮▮▯▯▯▯▯▯  6 / 12
Act:              II — Exploration
Chapter:          2 (Motivation)
```

- Data source: same `monthNumber` calc as `MonthlyPulseWidget` (from
  `user.joinedAt`), cross-referenced with `$evolutionState.chapter` from
  `interfaceEvolution.ts` — reusing, not duplicating, existing state.
- Gating: Usership tag, same as Monthly Pulse.
- Visibility: persistent in the Subscriber Stack (not a toast) — this is
  the one piece of "tangibility" that should be checkable anytime, not a
  once-a-month interstitial.
- When elapsed month and earned chapter diverge (a user at month 9 still
  in Chapter 2), render both numbers honestly rather than hiding the gap —
  consistent with "Behavioral, not declarative" from the Product Brief's
  design principles.

### 4b. Monthly Story Compression — the actual "tangibility" deliverable

This is the section the brief cares most about. Today the Memory Engine
generates two narrative artifacts: the cached `lastMemoryStory` (regenerated
whenever answer count changes) and the specced-but-not-yet-built Weekly
Story-Report. Neither is *monthly*, and neither is celebratory.

**Proposal:** on the same monthly boundary that triggers
`MonthlyPulseWidget`, generate one additional AI call (Together AI primary,
local-fallback composition per the existing chain) scoped narrowly:

> *Prompt shape: "Summarize this user's most recent 30 days of Memory Q&A,
> journal notes, and mood trajectory in one paragraph, second person,
> celebratory but specific — reference at least one concrete choice they
> made this month. This is a monthly milestone message, not a full Story."*

- Cache it the same way `lastMemoryStory` is cached: keyed to
  `(userId, monthNumber)`, generated once, served from cache thereafter —
  zero repeat AI cost per user per month.
- Surface it as the expanded state of `MonthlyPulseWidget` itself (click the
  existing "Month N:" label to cycle from the current one-liner into this
  paragraph — the exact `onLabelClick` cycling pattern already documented
  in `LOT-STYLE-GUIDE.md` §Interaction Patterns), rather than a fourth new
  widget competing for space.
- This is the concrete answer to "compressed Memory story delivery ...
  tangible every month": today the compression happens silently in
  `buildPrompt()` every time a question is generated. This makes one
  month's worth of that compression *visible as a sentence the user can
  screenshot* — the same instinct behind the Weekly Story-Report in the
  Product Brief, at monthly grain, framed as celebration rather than report.
- Cost containment: reuse the existing local-fallback composer
  (`memory.ts` §8) when Together AI is unavailable or when the user's
  answer density that month is too thin for a meaningful AI paragraph —
  never block the ritual on API availability.

### 4c. Monthly Rite — badge reveal folded into the existing dismiss flow

`MonthlyPulseWidget` already has a `DISMISS_PHRASES` rotation ("Onward.",
"Noted.", "Acknowledged."...) that plays after the user dismisses the
month's message. Proposed: when a Level badge or chapter transition lands
*in the same month* as the Monthly Pulse (Months 2, 5, 9 above are the
likely candidates given real thresholds), the dismiss phrase is replaced
for that one occurrence with a badge-aware line, e.g. *"≈ Wave. Onward."* —
reusing `getLevelSymbol()` from `badges.ts`, no new state, no new gate,
purely a copy-selection change in the existing `handleDismiss` callback.

---

## 5. Badge Track — "Month Rings" (concept, dual-theme)

The existing milestone badges (`∘ ≈ ≋` at day 7/30/100) are day-count based
and theme-locked to water/architecture per `BADGE_LEVEL_DESIGN.md`. Proposed
extension, additive not replacing: a parallel **month ring** that appears
only inside the `PublicProfile.tsx` Usership block, one glyph accreted per
elapsed calendar month, independent of the day-streak track:

| Month | Water theme | Architecture theme |
|---|---|---|
| 1–3 (Awakening) | `∘` | `├─` |
| 4–6 (Exploration) | `≈` | `╞═╡` |
| 7–9 (Integration) | `≋` | `║·║` |
| 10–12 (Mastery) | `≋≋≋` (full tide) | `║═║` (monument) |

Rendered as a single accreting string next to the existing `Level:` field —
`Level: ≋ ∿∿∿∿∿∿` where the first glyph is the day-streak badge (unchanged)
and the trailing string is the month ring, one mark per elapsed month, so a
Month 6 profile literally shows six marks. This is the most direct answer to
"the person-user should feel tangible evolution every month, including the
badges" — every month adds one visible character to a public, shareable
profile page, with zero new backend concepts (reuses `joinedAt`, reuses the
theme already stored on the user).

---

## 6. Implementation Hooks (for a future engineering session)

Not built in this session — this is a scoped checklist for whoever picks
this up next, pointing at exact real files:

- [ ] `MonthlyPulseWidget.tsx` — add `onLabelClick` cycling (Pulse ↔ Story
      Compression), per §4b. Reuses existing `Block blockView` pattern.
- [ ] `interfaceEvolution.ts` — no changes needed; `chapter`/`level` are
      already exported and ready to read from `$evolutionState`.
- [ ] New: `MonthsUnlockedWidget.tsx` (§4a) — reads `user.joinedAt` +
      `$evolutionState`, Usership-gated like `MonthlyPulseWidget`.
- [ ] `memory.ts` — new function alongside the existing story-generation
      path (§8 of the compression doc): monthly-scoped prompt, cached to
      `user.metadata.monthlyStory[monthNumber]` mirroring the
      `lastMemoryStory` caching pattern exactly.
- [ ] `badges.ts` — new `getMonthRing(joinedAt, theme)` helper alongside
      the existing `getLevelSymbol()`.
- [ ] `PublicProfile.tsx` — render month ring next to the existing `Level:`
      field (§5), Usership-gated block, no new top-level section needed.
- [ ] `WIDGETS.md` — add entries for the new widgets once built, following
      the existing Data Source / Persistence / Connection format used
      throughout that doc.
- [ ] Confirm with S-2 (see §7) before spending AI-call budget on the
      monthly story generation — it is one extra Together AI call per
      Usership user per month, not per session, so cost is bounded and
      small, but should be an explicit yes.

---

## 7. Open Questions for S-2

1. Should the monthly Story Compression consume the *same* Together AI
   quota/budget line as question generation, or be tracked separately for
   cost visibility?
2. Month Rings (§5) are proposed as Usership-only. Should R&D tier see a
   locked/greyed preview of the ring as a conversion nudge toward Usership,
   consistent with how `SubscribeWidget` already gates on activity?
3. Should Legacy-tier fields (`boardProfile`, `wallet`, `weatherStation`)
   become partially visible-but-locked to Usership users approaching Month
   12, or stay fully hidden until upgrade? §3's Month 12 section assumes
   partial visibility; this is a real product/pricing decision, not a
   design one.
4. `MonthlyPulseWidget` currently caps its displayed message at Month 12
   and repeats the Month 12 line indefinitely after (`Math.min(monthNumber,
   12)`). Confirm whether Year 2+ should get new copy eventually, or
   whether "the portrait is complete — and still evolving" is intentionally
   the permanent steady-state message.

---

## Appendix A — Live Monthly Pulse Copy (as of this session)

Quoted verbatim from `src/client/components/MonthlyPulseWidget.tsx`,
`MONTH_MESSAGES`:

```
1:  The first month. The system is beginning to know you.
2:  Two months in. Patterns are starting to form.
3:  Three months. You have reached Active User status.
4:  Four months. The portrait deepens.
5:  Five months. Consistency is its own reward.
6:  Six months. The journey is half-declared.
7:  Seven months in. The system has been listening.
8:  Eight months. Rare air.
9:  Nine months. The self-care practice is a habit now.
10: Ten months. Almost there.
11: Eleven months. One more.
12: One year with LOT. The portrait is complete — and still evolving.
```

This copy is strong and requires no changes — §3 above builds structure
*around* it, not a replacement for it.

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
*This document is a design brainstorm produced by an autonomous session per
S-2's standing framework (scan repo → read docs → push detailed .md). No
code was changed in this session.*
