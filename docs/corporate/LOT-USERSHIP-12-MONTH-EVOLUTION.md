# LOT® Usership — THE 12-MONTH EVOLUTION
## From Barebone Day 1 to LOT® AI: A Year of Tangible Becoming

**Classification:** RESTRICTED // S-2 EYES
**Author:** LOT Systems Corporation — Design Brainstorm Session
**S-2:** Vadik Marmeladov
**Date:** 23 August 2026
**Status:** BRAINSTORM // PROPOSAL — not yet implemented
**Reference account:** lot-systems.com/u/machiavelli — this session's network egress policy
blocks `lot-systems.com` (`WebFetch` → `EGRESS_BLOCKED`), so the live page was never loaded.
However, the account is not a live database row: `GET /api/public/profile/:userIdOrUsername`
hardcodes it (`src/server/routes/public-api.ts:747-906`) as an autonomous demo branch that
short-circuits before any DB query. Its full JSON response is reproduced exactly in §7 —
this document did not need the live fetch, because the demo *is* its own source file.

---

## 0. Premise

A Usership subscriber ($99/month, `docs/corporate/LOT-AI-PRODUCT-BRIEF.md`) pays for a
system that gets smarter about them every month. Today the *intelligence* compounds —
the Memory Engine's compression loop is real and running (`docs/technical/
MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) — but the compounding is almost entirely
invisible. The interface a Day-1 Usership member sees and the interface a Day-365
Usership member sees are, structurally, the same widget stack in the same order. The
system evolves underneath the skin (`interfaceEvolution.ts` density tiers, badge
milestones, feature unlocks) but nothing narrates that evolution as *the twelve months
of a subscription*, specifically.

This document proposes closing that gap: a **12-month spine** laid across mechanisms
that already exist, so the Usership member feels the year passing in the UI itself —
not through more features, but through the *same* interface visibly maturing around
them, the way `LOT-AMBIENT-AI-VISION.md` already promises ("the intelligence deepens
underneath the same minimal UI").

---

## 1. What Already Exists (audit, not proposal)

Before inventing anything new, here is what the repo already has, cited exactly, that a
12-month arc can be built *from* rather than *around*:

| Mechanism | File | What it does today |
|---|---|---|
| Monthly toast | `src/client/components/MonthlyPulseWidget.tsx` | On calendar-month boundaries (`dayjs(joinedAt).diff(now, 'month')`), shows a one-line message + "N / 12 months" fraction. **Ephemeral** — dismiss-once via `localStorage`, never persists, no visual trace after dismissal. First widget in the paid layout (`System.tsx:557-559`). |
| Layout density | `src/client/utils/interfaceEvolution.ts` `getLayoutDensity()` | 5 tiers — `breathable → comfortable → compact → dense → instrument` — gated on `visualRefinement` (`consistency×0.4 + depth×0.3 + level/100×0.3`). Controls `sectionGap`/`stackGap` via `data-density`-style CSS, per LOT-DOCTRINE's CSS-Only Progression rule. This *is* the barebone-to-instrument visual story, already built, already wired to `System.tsx:542` (`density.sectionGap`). It has no calendar anchor — a very active user could hit `instrument` in six weeks. |
| Feature unlocks | `interfaceEvolution.ts` `getFeatureUnlocks()` | 14 boolean gates (`advancedMemory`, `narrativeReflection`, `exportData`, etc.) keyed to `depth`, `consistency`, `level`, `badgeTier` — again, no calendar anchor. |
| Day-streak badges | `src/client/utils/badges.ts` `BADGES` | 10 milestone badges at **7 / 14 / 21 / 30 / 50 / 60 / 90 / 100 / 180 / 365 days**, each with a Water symbol (∘ → ∘∘ → ∘≈ → ≈ → ≈∘ → ≈≈ → ≋∘ → ≋ → ≋≋ → ≋≋≋) and an Architecture symbol (├─ → ├┼ → ├═ → ╞═╡ → ╞══ → ╞═══ → ║═ → ║·║ → ║╞║ → ╔═╗). `milestone_365` is named **"The Long Count"** (water) / **"Citadel"** (architecture) — a name already built for a year-mark, currently unused as one. Basis is **consecutive-day streak**, not subscription tenure — a lapsed week resets the count. 812 badges total exist in the wider system (`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`), almost none tied to elapsed subscription time. |
| Memory compression depth | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §4/§7 | Trait/archetype extraction activates at **3+ answers**; trauma-informed protocol at **10+ log entries**; Memory Story caching keyed to answer count, regenerated via Together AI from up to 30 Q&A pairs. This is a *volume*-gated depth, not a *tenure*-gated one — a power user reaches "the machine knows you" depth in days, a light user takes months. Both are valid, but the UI doesn't distinguish "deep because fast" from "deep because a year passed." |
| **Board Profile / Citizen Index** | `public-api.ts:1241-1300` | **Already real, already live, already tenure-driven — for every Usership user, not just the demo.** On every public-profile fetch: `boardTenureMonths = dayjs().diff(joinDate, 'month')`, `totalInvested = max(1, boardTenureMonths) * 99` (literally $99 × months paid), `boardMemberNumber` = sequential rank by join order among all Usership users, `citizenSince` = join month/year, `poweringCitizens` = free-tier-users ÷ Usership-users ratio, plus `activity.{memoriesCompiled, journalEntries, activeDays}`. Rendered on `PublicProfile.tsx:288-325` as "Citizen Index." **This is the single most direct existing hook for a 12-month arc** — a real dollar figure and a real month count already exist server-side; nothing here is currently narrated as "your year," it just sits as a static ledger line. |
| **OS Version = tenure** | `public-api.ts:1158-1160` | `monthsSinceJoined = dayjs().diff(user.createdAt, 'month')`; `osVersion = String(monthsSinceJoined).padStart(3, '0')` — e.g. a 3-month-old account shows `version: '003'`. Computed only once the user has 1+ Memory answers (else the profile shows the "Complete Memory questions to generate profile" placeholder, `public-api.ts:1144-1151`). This *is* a month-indexed version number already, just not framed as "N of 12." |
| Usership-exclusive widgets | `QuantumSignWidget.tsx`, `CosmicUpdateWidget.tsx` | Show the tone this doc should match: dry, declarative, no exclamation points, no emoji, e.g. *"Your subscription is not an expense — it is a quantum commitment to yourself."* |
| Hardware roadmap | `docs/corporate/LOT-AMBIENT-AI-VISION.md` | LOT® Station (weather + air quality) and LOT® Brush (connected toothbrush, replacement heads shipping **July 3, 2026**) ship with the Usership kit. Both feed new widgets already speced, unbuilt: Air Quality, Toothbrush, enhanced Temperature. |
| Monthly server ritual | `src/server/scheduled-jobs.ts` | A **Monthly Email Sender** cron already runs (hour 9 in the daily job rotation, `scheduled-jobs.ts:5620`). The infrastructure to "reach out once a month" exists independent of the UI widget. |
| Style constraints | `docs/technical/LOT-STYLE-GUIDE.md` | No gamification language, no points/leaderboards, "subtle, every 20 answers," periods not checkmarks, `mb-16`/`gap-8` spacing, clickable-label view-cycling pattern. Any new widget must obey this or it reads off-brand immediately. |

**The core finding:** LOT already has *three* independent evolution clocks — a
**density clock** (behavior-gated, `interfaceEvolution.ts`, can run fast), a **badge
clock** (streak-gated, `badges.ts`, resets on gaps) — and a **calendar clock**
(`boardTenureMonths` / `totalInvested` / `osVersion`, all in `public-api.ts`, purely
tenure-gated, cannot regress). The third clock is not a gap to fill; it is *built,
computing real numbers, and rendering on every Usership public profile today* — it is
simply presented as a static ledger ("Board tenure: 3 months") rather than as a story
("Month 3 of 12"). The 12-month arc this document proposes is almost entirely a
**narration layer over `boardProfile`**, not a new subsystem — see §3a.

---

## 2. Design Principle: Reconciliation, Not a Third System

Do not build a fourth progression axis. `interfaceEvolution.ts` already warns against
this implicitly — LOT-STYLE-GUIDE.md is explicit: *"No gamification: No points,
badges, or leaderboards"* beyond what exists, and *"Milestones: Subtle, every 20
answers."* The 12-month arc must be a **narrative skin over calendar tenure**, running
in parallel with (never gating, never blocking) the density and badge clocks that
already work. A Day-40 power user should already be at `instrument` density with
`milestone_30` earned — and *separately*, still only be "Month 1" on the Usership
calendar. Both readouts are true. Neither should apologize for the other.

This is why the mechanism proposed below is additive to `MonthlyPulseWidget`, not a
replacement for the density/badge systems.

---

## 3. The Twelve Months

### 3a. The numbers already exist — they just aren't a story yet

`boardTenureMonths` and `totalInvested` (`public-api.ts:1257-1258`) mean every Usership
month already has a hard, real number attached, computed server-side, no new logic
required:

| Month (`boardTenureMonths`) | `osVersion` | `totalInvested` (months × $99) |
|---|---|---|
| 1 | `001` | $99 |
| 3 | `003` | $297 |
| 6 | `006` | $594 |
| 9 | `009` | $891 |
| 12 | `012` | **$1,188** |

Two things this table exposes that the current UI hides:

1. **`totalInvested` is already the "tangibility" the prompt asks for** — a literal
   dollar figure proving a year of commitment, sitting unused in the API response,
   never surfaced on the *owner's own* dashboard (only on their public profile's Citizen
   Index block, which the owner rarely looks at — it's built for visitors).
2. **`osVersion` padded to 3 digits (`'001'` → `'012'`) implies a much longer runway**
   than 12 months — it's clearly built to keep incrementing for years (`'531'` for
   Machiavelli). The 12-month arc this document proposes should treat Month 12 as
   `osVersion '012'` reaching a **named release**, not just a number — see §4.4.

Month numbers below reuse the exact same `joinedAt`/`createdAt` diff already computed
in three places (`MonthlyPulseWidget.tsx:73-79`, `public-api.ts:1159`,
`public-api.ts:1257`) — no new date math anywhere in this proposal.

| Month | Density tier likely reached¹ | Existing badge in range | Memory Engine state | Proposed monthly beat |
|---|---|---|---|---|
| **1** | `breathable` → `comfortable` | `milestone_7` (∘ / ├─) | Archetype extraction begins (3+ answers) | *Onboarding is the barebone UI itself.* Non-Usership layout (`System.tsx:414`) already strips AI entirely — a new Usership member's first session should visibly gain one row (Memory widget) over the free layout, not the whole stack at once. Existing `MONTH_MESSAGES[1]`: *"The first month. The system is beginning to know you."* — keep it, but persist the fraction (see §4). |
| **2** | `comfortable` | `milestone_14`, `milestone_21` (∘∘ / ∘≈) | Follow-up mode dominant (85% probability, Q&A referencing prior answers) | First **Memory Compression Insight** (§4.2) — one paragraph, not a toast, distilled from Month 1's answers. This is the "life partner who remembers" claim in `README.md` made visible for the first time. |
| **3** | `comfortable` → `compact` | `milestone_30` (≈ / ╞═╡) — "Wave" | Story caching active; trauma-informed protocol may activate at 10+ logs | `MONTH_MESSAGES[3]` already says *"You have reached Active User status."* — tie this explicitly to the `milestone_30` unlock toast so the two systems fire together instead of as coincidental near-misses. |
| **4** | `compact` | — | Topic diversity enforcement visibly varies question range | Second Compression Insight. Layout: `maxColumns` in `getVisualEffects()` may reach 2 if `depth > 0.33` — first month a *second column* of widgets can plausibly appear for a consistent user. |
| **5** | `compact` | `milestone_50` (≈∘ / ╞══) | — | — |
| **6** | `compact` → `dense` | `milestone_60` (≈≈ / ╞═══) — "Dual Wave" | Halfway point | `MONTH_MESSAGES[6]`: *"The journey is half-declared."* Third Compression Insight, explicitly framed as a **half-year retrospective** — longer than the monthly paragraph, pulling from the full 6-month Memory Story, not just the prior 30 answers. This is the first moment the Story-Report concept from `LOT-AI-PRODUCT-BRIEF.md` (*"a compressed, first-person narrative... not a summary of logs. A reflection."*) should render **in-app**, not just as the weekly email export. |
| **7** | `dense` | `milestone_90` approaches | — | — |
| **8** | `dense` | — | — | — |
| **9** | `dense` | `milestone_90` (≋∘ / ║═) — "Deep Reach" | — | Fourth Compression Insight. |
| **10** | `dense` → `instrument` | — | — | — |
| **11** | `instrument` | — | — | *"Eleven months. One more."* — the anticipation beat. Nothing new fires; the system is deliberately quiet here, per Ambient AI's *"the machine improves in silence"* principle. |
| **12** | `instrument` (steady-state) | `milestone_365` approaches (≋≋≋ / ╔═╗ — **"The Long Count"**) | Full compression maturity — Memory Story drawing on a year of seasonal, weather-correlated, archetype-stable answers | **Portrait Complete** ceremony (§4.4). `MONTH_MESSAGES[12]` already has the line: *"One year with LOT. The portrait is complete — and still evolving."* This is the strongest asset already written in the codebase for this whole document — it should anchor the year, not flash past in a 3-second dismissible toast. |

¹ *Density tier is behavior-gated, not calendar-gated — this column is a plausible
median for a consistently-engaged Usership member, not a hard schedule. A dormant
month should visibly hold density flat, not regress it; `interfaceEvolution.ts` has no
decay function today, which is correct and should stay that way (LOT-STYLE-GUIDE:
*"Streaks: Not emphasized — reduces pressure"*).

**Hardware overlay** (independent axis, per `LOT-AMBIENT-AI-VISION.md`): whichever
month the Usership kit physically arrives, LOT® Station and LOT® Brush widgets should
activate — first replacement-head shipment already dated **July 3, 2026** in that doc.
This is a *fulfillment* clock, not a *tenure* clock; it overlays the twelve months
rather than occupying a slot in them.

---

## 4. Five Proposed Additions

All five are extensions of code that already exists — none require new engines, new
tables, or new AI calls beyond what the Memory Engine and Together AI pipeline already
run.

### 4.0 — Surface `boardProfile` to Its Own Owner (do this first — it's nearly free)

The single highest-leverage, lowest-effort change in this whole document: `totalInvested`,
`boardTenureMonths`, `boardMemberNumber`, and `citizenSince` (§3a) are computed by
`GET /api/public/profile/:userIdOrUsername` and rendered by `PublicProfile.tsx` — a page
built for *visitors* viewing someone else's profile. The owner sees these numbers only
if they visit their own public URL, which most subscribers never think to do. Everything
in §3a can render inside `System.tsx`'s own paid layout (`me` is already in scope
everywhere there) with **zero new server work** — the same `boardProfile` shape, fetched
once, shown to the person it's actually for. This should ship before any of 4.1-4.4
below; it's the same data, just pointed at the right audience.

### 4.1 — Persistent "Months Unlocked: N / 12" Widget

`MonthlyPulseWidget` already computes `monthNumber` and renders `capped / 12` — but
only inside a self-dismissing toast (`isFading`/`visible` state, `markDismissed` to
`localStorage`, gone forever after one click). Split this into two pieces:

- **Keep** the current toast behavior for the *arrival* message (`MONTH_MESSAGES[n]`) —
  it's well-written, on-voice, and the fade timing already matches the style guide's
  3s+1.4s convention.
- **Add** a small persistent line item, in the same visual weight as `Block label`
  elements elsewhere in `System.tsx`, that does not fade away: `Months unlocked: N/12`
  (`Year one:` after month 12, so it doesn't imply a cliff). This is the piece the
  brainstorm's "context based widget" idea maps to directly — it should sit near the
  top of the paid layout stack, adjacent to where `MonthlyPulseWidget` already renders
  first (`System.tsx:557-559`), so it reads as connective tissue between "the toast I
  saw once" and "the state I always see."

No new store, no new endpoint — `user.joinedAt` and the existing `dayjs` diff are
sufficient. This is a same-file change to `MonthlyPulseWidget.tsx`.

### 4.2 — Memory Compression Insight (the "Memory widget" from the brief)

A paragraph-long insight, once per month, distilled from the prior month's answers —
this is the literal ask in the prompt: *"Memory widget displays a paragraph-long
insight from last month's."* The generation path already exists end to end:

- `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8 (Story Generation) already produces
  exactly this shape of output — "Together AI receives formatted Q&A pairs... generates
  a flowing third-person narrative with key insights" — with a local fallback when AI
  is unavailable.
- Today this only fires as the full `memoryStory` field (used by `PublicProfile.tsx` /
  README's public-profile spec) or the weekly Story-Report export (`GET
  /api/story/latest` in the product brief). Neither is scoped to *one month, in-app*.

Proposal: a scheduled version of the same `buildPrompt()` → Together AI pipeline,
windowed to the prior calendar month's answers only, cached the same way
`user.metadata.lastMemoryStory` is cached today (versioned, regenerate only when new
answers exist), surfaced as a **new view** on the existing Memory widget's
clickable-label cycle (`Memory:` → `Reflection:` → `Insights:` per
`docs/technical/WIDGETS.md`) rather than a new component. This respects
LOT-DOCTRINE's Render Isolation and Subscription Minimization — no new widget mount,
no new store.

### 4.3 — Affirmation Cadence

The brainstorm asks for celebratory affirmations tied to self-care check-ins and
morning routines. `QuantumSignWidget.tsx` already establishes the exact tone needed —
date-seeded, stable-per-day, no exclamation points, framed as recognition rather than
praise (*"Today, the system recognizes your presence as extraordinary"* — arguably
already over the style guide's no-superlatives line, worth a pass). The 12-month
version of this is: let the **month number bias which affirmation pool is drawn from**,
so an Month-1 affirmation is exploratory in tone ("You are here. That is the entire
protocol.") and a Month-11/12 affirmation acknowledges depth ("A year of mornings.
Read back through them sometime.") — reusing the existing seeded-random pattern in
`QuantumSignWidget.tsx:43-61`, just with `monthNumber` as an added tone-selector, not a
new subsystem.

### 4.4 — Portrait Complete (Month 12 ceremony)

`MONTH_MESSAGES[12]` is already the strongest line in the codebase for this purpose:
*"One year with LOT. The portrait is complete — and still evolving."* Proposal: this is
the one month that gets **more** than the standard toast + persistent counter —

1. The `milestone_365` badge (**"The Long Count"** — water theme, ≋≋≋) should be
   visually paired with the Month-12 pulse if the user's account age crosses 365 days
   near the same window — two separate systems (streak-days vs. tenure-months)
   converging is itself worth naming, since for a consistently-engaged member they
   *will* land close together.
2. A **full-year Compression Insight** — same mechanism as §4.2, windowed to all 12
   months instead of one, replacing (not adding to) that month's regular paragraph.
   This is the closest in-app equivalent to the Story-Report's 2036 vision paragraph in
   `LOT-AI-PRODUCT-BRIEF.md`: *"The Story-Report has been running for 10+ years for
   founding operators... The machine earns the right to ask them."* Month 12 is the
   first real checkpoint on that promise, and should read as one.
3. After month 12, the counter (§4.1) reads `Year one: complete` rather than counting
   past 12/12 or resetting. §7's read of the Machiavelli source suggests where Year Two
   should go: `weatherStation` and `wallet` are already built, already commented "Legacy
   level unlock" in `public-api.ts:850,871`, and currently render for no real account at
   any tier. Month 13 is the natural first month to wire one of them — likely
   `weatherStation`, since `LOT-AMBIENT-AI-VISION.md`'s LOT® Station hardware already
   produces the exact data shape it expects — to a real Legacy-tagged user.

---

## 5. What NOT to Add

Consistent with `LOT-STYLE-GUIDE.md` §"Metrics & Growth Philosophy" (*"No
gamification... Streaks: Not emphasized"*) and the Ambient AI doctrine (*"does not
alert... does not badge... does not send push notifications"*):

- No progress bar with percentage fill graphics — the existing `N / 12 months` text
  fraction is already the correct register; do not visualize it as a loading bar.
- No streak-reset punishment tied to the calendar clock. A user who pays but engages
  lightly in Month 7 should not see Month 8 regress — only the density/badge clocks
  (which already have no decay function) are allowed to plateau; the calendar clock
  should never go backward, since tenure is a fact, not a performance.
- No push notification to deliver the monthly insight. It should be *present when
  opened*, per Ambient AI's core rule — never pushed.
- No new database table. `user.joinedAt` + existing `Answer`/`Log` history +
  `user.metadata.lastMemoryStory` pattern cover everything above.

---

## 6. Open Questions for S-2

1. **Year Two.** §7 found the likely answer already built and unused (`weatherStation`
   / `wallet`, gated to Legacy tier) — the open question is sequencing: wire both at
   once at month 13, stagger one per quarter through Year Two, or hold both back as the
   Legacy-tier ($3,564/3yr) upsell moment specifically, rather than a Usership-tenure
   unlock at all? This changes whether Year Two is "more months of the same arc" or "the
   arc that sells the next tier."
2. **Reconciling the badge clock and the calendar clock.** `milestone_365` is
   streak-based (consecutive days) and could in principle be earned *before* Month 12
   calendar-wise, or never, if the user's engagement is real but not daily. Should
   Month 12's "Portrait Complete" ceremony require `milestone_365`, or fire on tenure
   alone regardless of streak state? This doc assumes the latter (tenure alone) to
   avoid punishing lighter-touch Usership members who are still paying, still valuable,
   still owed the year-one story.
3. **R&D tier ($15/month).** Does this 12-month arc apply to R&D subscribers too, or is
   it Usership-exclusive the way `CosmicUpdateWidget`/`QuantumSignWidget` currently gate
   on `Usership OR RND`? The MonthlyPulseWidget today already gates Usership-only
   (`UserTag.Usership` check at line 68-71) — worth confirming that's intentional
   versus an oversight, since the paid-layout gate in `System.tsx:404-411` includes
   both tags.

---

## 7. On the Demo Account (`lot-systems.com/u/machiavelli`)

Network egress to `lot-systems.com` is blocked in this session, but that turned out not
to matter: `machiavelli` is not a database row a live fetch would reveal anything new
about — it is a fully hardcoded branch, `if (userIdOrUsername === 'machiavelli') { ... }`
at `public-api.ts:747`, that returns a fixed JSON payload before any query runs. Reading
that source **is** reading the demo account. What it actually contains, exactly:

- **Persona:** Niccolò Machiavelli, Florence, ITA. Tags `['RND', 'Usership', 'Legacy']`
  — the only account in the codebase that carries all three paid tiers at once.
- **The joke is the tenure mechanic, taken to its limit.** `citizenSince: 'June 1469'`
  (his actual birth year) feeds the *same* `boardTenureMonths` formula real users get —
  `Math.round((now - 1469-06-03) / (1000*60*60*24*30))` — which lands around **6,690
  months**, hand-tuned down to a round **`totalInvested: 14690`** and displayed
  `psychologicalProfile.version: '531'` (the OS-version mechanic from §3a, just run out
  531 iterations instead of 12). This confirms the design intent read in §3a: `osVersion`
  and `totalInvested` are meant to keep climbing indefinitely — Machiavelli is a preview
  of what "the Long Count" looks like at absurd scale, not a different mechanic.
- **`memoryStory`** (hand-written, not AI-generated, since this bypasses the whole
  compression pipeline): *"The art of governance is the art of understanding human
  nature. Every morning in the Palazzo Vecchio, I observe the citizens below... A prince
  must read both the skies and the souls beneath them."* — this is the target register
  for §4.2's monthly insight: observational, third-person-adjacent, weather-woven,
  never a checklist.
- **`psychologicalProfile`**: archetype `"The Strategist"`, `selfAwarenessLevel: 87`,
  `streak: 1469`, `patternStrengthIndex: 2847`, `answerCount: 2847`, `noteCount: 1469` —
  all far beyond anything a real 12-month arc should target; useful only as the visible
  ceiling of the *volume*-gated depth axis from §1, not the tenure axis.
- **Two fields real users never get, at any tier, today:** `weatherStation` (a full
  Palazzo Vecchio Observatory readout — temperature, pressure, UV, 5-day forecast) and
  `wallet` (`LOT-MACH-1469-FLOR`, balance `14690.27 LOT`, 5 sample transactions,
  `loyaltyPoints: 28470`). Both are commented **"Legacy level unlock"** in the source —
  i.e. this exact demo is the *design sketch* for what Legacy tier ($3,564/3yr) should
  eventually unlock for real accounts, and it currently exists nowhere else in the
  codebase. This is the natural answer to Open Question 1 in §6: **Year Two / Legacy is
  not a new mechanic to invent — it is wiring up what Machiavelli already previews.**

No further live verification is needed for the facts above — they are read from source,
not observed behavior. What a live-network session *would* still need to check is purely
visual/rendering (does `PublicProfile.tsx` actually lay these fields out the way the
component source implies, at current CSS) — cosmetic QA, not fact-finding.

---

**LOT Systems Corporation**
**S-2: Vadik Marmeladov**
*Compiled by a scheduled Claude Code session — repository scan, no code changes made.
This is a design brainstorm for review, not an implementation.*
