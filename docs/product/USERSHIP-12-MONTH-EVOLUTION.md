<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# The 12-Month Usership Arc — From Barebone Day 1 to LOT® AI
## Product & UI/UX Brainstorm — Compressed Memory as a Visible, Monthly Story

**Author:** Claude (Session S-2), for Vadik Marmeladov, CEO & Founder
**Date:** 21 July 2026
**Status:** Brainstorm / product spec — no code shipped in this pass
**North Star reference:** [`lot-systems.com/u/machiavelli`](https://lot-systems.com/u/machiavelli) — the hardcoded "maximally evolved Usership account" fixture in `src/server/routes/public-api.ts`
**Companion reading:** `README.md` (Memory Engine philosophy), `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v26.md`, `docs/technical/WIDGETS.md`

---

## 0. Why this document exists

Vadik's brief: a paid Usership account starts on day one as a **barebone UI** and should feel like it is **tangibly becoming** the fully-realized `/u/machiavelli` account over 12 months — not through a settings toggle, but through *lived evidence*: the volume of Log entries, the rhythm of morning check-ins, the clicks on self-care actions. The AI should notice the person changing and **say so**, monthly, through affirmation and a compressed Memory/Story insight — visibly, with widgets that feel earned rather than granted.

This document scans the current codebase (per the required framework), grounds every proposal in what already exists vs. what would be net-new, and lays out a month-by-month structure for the arc.

---

## 1. What already exists (do not rebuild — extend)

The repo already contains real infrastructure for almost every piece of this idea. The brainstorm below is explicitly a *composition and completion* of these systems, not a from-scratch design.

| System | File(s) | What it does today | Gap vs. the 12-month vision |
|---|---|---|---|
| **Usership tag** | `src/shared/types/index.ts` (`UserTag` enum) | Admin-granted tag, not self-serve, gates most premium UI (`Sync.tsx`, `System.tsx`, `Settings.tsx`, `PublicProfile.tsx`, etc.) | No day-1-vs-month-12 differentiation — the gate is binary (has Usership / doesn't), not progressive |
| **Monthly cadence widget** | `src/client/components/MonthlyPulseWidget.tsx` | Computes `monthNumber` from `user.joinedAt`, shows one canned line per month 1–12, shows `"N / 12 months"` | This is *literally* the "Months unlocked: 3/12" idea already, half-built. Dismiss state is `localStorage`-only (not server-persisted, so it re-fires per device and can't be reported on server-side) |
| **Monthly narrative engine** | `src/server/utils/monthly-summary.ts` | `generateMonthlySummary()` builds a full `MonthlySummary` (presence, energy trajectory, pattern insights, growth, narrative, `memoryStory`) on a real cadence check (`shouldShowMonthlySummary`: first 3 days of month, ≥25 days since last) | Built for **email delivery only** — never rendered as an in-app widget or surfaced as a celebratory UI moment |
| **Memory Story compression** | `src/server/utils/memory/story-generator.ts`, `src/server/utils/memory.ts` (`generateMemoryStory`) | Takes up to 30 answer-type logs, sends to the AI engine, returns a first-person narrative paragraph | Already the "paragraph-long insight" mechanism the brief asks for — currently surfaced once, statically, in Settings/PublicProfile, not as a monthly-refreshing widget |
| **Badges** | `src/client/utils/badges.ts`, `docs/badges/` (626 badges, v26) | Deep **day/streak**-based badge system (7/14/21/30/50/60/90/100/180/365-day milestones, Water ∘→≈→≋ / Architecture ├─→╞═╡→║·║ symbol progressions) | Zero **month-based** badges exist. A Usership year has no distinct badge tier of its own today |
| **Journal / Log** | `src/client/components/Logs.tsx`, `src/server/utils/memory.ts` (`formatLog`) | Freeform running log, typed entries (`answer`, `chat_message`, `note`, `settings_change`) | This *is* "Log" from the brief — already the volume signal, just not yet visualized as a monthly-growing artifact |
| **Check-ins** | `src/client/components/EmotionalCheckIn.tsx` (Biofield Check-In), `SelfCareMoments.tsx` | Check-in flow with `EmotionalState` (energized/calm/tired/…), history/patterns/graph views | Not morning-specific or time-gated; no explicit "self-care button" tally feeding evolution |
| **Evolved-state demo** | `src/server/routes/public-api.ts` (`machiavelli` fixture) | Fully populated: Board Profile, Psychological Profile, Correlated Indexes, **Legacy-level** Weather Station + Wallet, QR code, streak 1469, 626-badge-era vocabulary | This is the *destination*. There is currently no *path* to it — real accounts don't progressively unlock these blocks |
| **`Legacy` tag** | `UserTag.Legacy` in the enum; comments `// Legacy Level unlock: Weather Station` / `Wallet` in `PublicProfile.tsx` | Already exists as a tier *above* Usership in the type system and is what gates Weather Station/Wallet | Never wired to any real earning logic — it's a dormant tag. **This is the natural Month-12+ narrative hook** |
| **Onboarding / Day 1** | `src/server/routes/auth.ts` (magic-code login → bare `User` row, `joinedAt: new Date()`, no tags) | Confirmed: there is no onboarding wizard. Day 1 barebone is real — it's simply the *absence* of Usership, described in `About.tsx` as "Civilian Mode" | This is the correct starting canvas — no redesign needed, just a clear Month-0→Month-1 transition moment |

**Conclusion of the scan:** every mechanic the brief describes — monthly congratulations, "months unlocked," compressed-memory insight, celebration through badges — has a real, working backend precursor. The work is **wiring existing systems into a progressive, visible, monthly-refreshing front end**, plus a modest amount of new gating logic and one new widget family.

---

## 2. Design principles

1. **Tangibility over information.** Every month must change something the user can *see* without opening Settings — a new widget appears, a symbol changes shape, a paragraph rewrites itself. Progress must not live only in a database column.
2. **Earned, not elapsed.** Time alone (`joinedAt` diff) unlocks the *opportunity* for a month's reveal, but the *richness* of what's shown should scale with real engagement (Log entries, check-ins, self-care actions) — matching `monthly-summary.ts`'s existing `presence.consistency` tiers (`exceptional / strong / steady / intermittent / minimal`). A quiet month still advances the calendar; it does not produce a hollow celebration.
3. **Compression, not accumulation.** The product philosophy (`README.md`: *"From data accumulation → TO memory densification"*) means the Month 12 state should not be Month 1 with more rows — it should be the same story, said more precisely, in fewer, better words. The Memory Story paragraph should visibly *tighten and deepen*, not just lengthen.
4. **The AI notices first.** The celebratory beat is the system observing the person, not the person hitting a "claim reward" button. Voice stays in the existing `MonthlyPulseWidget` register — plain, a little solemn, never confetti-emoji.
5. **Reversible, private by default.** Nothing here should force new public exposure. All of this lives first in the private dashboard; `PublicProfile` visibility remains opt-in per the existing `UserPrivacySettings`.
6. **No dark patterns.** Free/Civilian users are never shown a "locked" padlock UI baiting upgrade. Usership users are never shown a countdown that punishes a quiet month. Absence of a badge is silence, not a red X.

---

## 3. The three engines of evolution

The brief names three inputs explicitly. Map each to what's measurable today, and to the aggregate signal that should drive monthly richness:

| Engine | Existing signal | Where it's captured |
|---|---|---|
| **Log volume** ("journal entries and thoughts put into Log") | `Log` rows of type `note` / `chat_message`, counted per day in `monthly-summary.ts` (`uniqueDays`, `totalEntries`) | `Logs.tsx` → `useCreateLog` |
| **Morning check-ins** | `EmotionalCheckIn` rows; `activeDays` / `longestStreak` in `monthly-summary.ts` | `EmotionalCheckIn.tsx` |
| **Self-care button clicks** | `SelfCareMoments.tsx` interactions (not currently persisted as its own countable metric — needs a lightweight event log) | `SelfCareMoments.tsx` |

Propose a single derived value, the **Presence Index**, computed monthly (reusing `monthly-summary.ts`'s existing `presence` block almost as-is):

```
Presence Index (0–100) = weighted(
  activeDays / totalDaysInMonth,       // cadence
  logEntries this month,                // depth of Log
  checkIns this month,                  // morning ritual adherence
  selfCareClicks this month             // self-care engagement
)
```

This does **not** gate whether the month unlocks (that stays purely `joinedAt`-based, matching `MonthlyPulseWidget` today — predictable, never punitive). It gates the *tier* of that month's reveal:

- **Minimal presence** → the month still advances (`"N / 12 months"` ticks up), affirmation copy is gentle and forward-looking, no new badge.
- **Steady/Strong presence** → full reveal: new Memory Story paragraph, badge, widget unlock.
- **Exceptional presence** → the reveal includes one extra "notable progress" line, matching the `notableProgress: string[]` field that already exists unused in `MonthlySummary.growth`.

This directly reuses `monthly-summary.ts`'s `consistency` enum — no new taxonomy needed.

---

## 4. New / extended components

### 4.1 `MonthlyPulseWidget` → `MonthEvolutionWidget` (extend, don't replace)

Keep the existing dismiss interaction and tone exactly — it's good. Extend it:

- **Server-persist dismissal.** Today's `localStorage`-only dismiss (`lot_pulse_{userId}`) means the moment isn't recorded server-side and can't feed analytics or be replayed on a new device. Add a `monthlyPulseSeenAt: Record<number, Date>` (or a small `MonthlyReveal` table) alongside the existing `User` model, written on dismiss.
- **Presence-aware copy.** Today `MONTH_MESSAGES` is a static 12-line map. Keep it as the *base* line, but append a second line sourced from `monthly-summary.ts`'s `narrative` field when Presence Index ≥ "steady" — this is the AI "noticing," not a canned string.
- **Badge reveal inline.** When a monthly badge is earned (§4.3), show its symbol appearing next to the `"N / 12 months"` line with the same fade-in choreography already coded (`isShown` → `opacity-100`, 1400ms).

### 4.2 `MemoryWidget` (net new, small)

A standing (non-dismissible, always-present once Usership + Month ≥ 1) widget on the dashboard — distinct from the ephemeral pulse toast:

- Header: `Memory —` (matches `Block label` convention used throughout, e.g. `MonthlyPulseWidget`'s `label="Month N:"`)
- Body: the current month's compressed paragraph, pulled from `generateMemoryStory()` (already exists, already AI-generated, already first-person). Refresh cadence matches `shouldShowMonthlySummary()`'s window (first 3 days of month).
- Footer, small/faded (matching `PublicProfile.tsx`'s `opacity-50` convention used for `weatherStation.location`): `"Based on {answerCount} answers · last updated {month}"`.
- On click: expand to show the **previous month's** paragraph directly above (two-paragraph diff-by-eye — the person can *see* the compression happening: the Month 6 paragraph should read differently, not just longer, than Month 5's).

This is the "Memory widget displays a paragraph-long insight from last month" idea from the brief, built entirely on `story-generator.ts` + `monthly-summary.ts`, both already functional.

### 4.3 Monthly badge tier (net new, small addition to `badges.ts`)

The existing 626-badge system is exclusively day/streak-based. Add a **13th category**, small and deliberately sparse (12 entries, one per Usership month, not per calendar month — so a Free user never sees these):

| Month | ID | Symbol (Water→Architecture, scaled to months not days) | Tone |
|---|---|---|---|
| 1 | `usership_month_1` | `∘` | Arrival |
| 2 | `usership_month_2` | `∘∘` | Pattern |
| 3 | `usership_month_3` | `≈` | Active User (matches existing copy) |
| 4 | `usership_month_4` | `≈≈` | Depth |
| 5 | `usership_month_5` | `≈≈≈` | Consistency |
| 6 | `usership_month_6` | `╞═╡` | Halfway — architecture begins |
| 7 | `usership_month_7` | `╞═╡·` | Listening |
| 8 | `usership_month_8` | `╞═╡≈` | Rare air |
| 9 | `usership_month_9` | `║·║` | Habit as structure |
| 10 | `usership_month_10` | `║··║` | Near-complete |
| 11 | `usership_month_11` | `║·║·` | Threshold |
| 12 | `usership_month_12` | `║═║` | **Year One** — matches `docs/badges` "Citadel" tier visual weight used for the 365-day milestone, but this is *account-age*, not streak, so it must read distinctly (rectangular closure `║═║` rather than the existing `╔═╗` 365-day citadel, to avoid symbol collision with the day-streak system) |

Each is earned once, permanently, regardless of later gaps — this is a *tenure* badge family, not a streak family, and must never be lost. Displayed as a small horizontal row on `PublicProfile.tsx` beside the existing `getLevelSymbol(streak)` line, labeled `Usership Year:` — visually distinct from the day-streak `Level:` row directly above it (line 404–409 today).

### 4.4 "Months Unlocked" context widget (net new, tiny)

A persistent small-format stat, not a toast — lives near the existing `SystemProgressWidget` / stats cluster:

```
Months unlocked: 3 / 12
```

Directly reuses the `monthNumber` / `"N / 12 months"` computation already in `MonthlyPulseWidget.tsx` (lines 73–79, 108). This is the ambient, always-visible version; `MonthEvolutionWidget` (§4.1) is the one-time monthly event. Both read the same underlying number — no new computation, just a second render target.

### 4.5 Progressive `PublicProfile` gating (extend existing code, no new blocks)

`PublicProfile.tsx` already contains every visual block the Month-12 state needs (`psychologicalProfile`, `correlatedIndexes`, `weatherStation`, `wallet`, `boardProfile`) — they're just gated on `hasUsership` alone today. Add a `monthNumber` dimension to the *existing* gates, server-side in `public-api.ts`, so a real account's public profile visibly grows toward the `machiavelli` fixture rather than jumping straight to it on day 1 of paid access:

| Block | Current gate | Proposed additional gate |
|---|---|---|
| Memory Story | `showMemoryStory` privacy flag | unchanged — visible from Month 1 (it's the whole point) |
| `psychologicalProfile` (archetype, cohort, traits) | `hasUsership` | Month ≥ 3 (matches existing "Active User status" copy) |
| `correlatedIndexes` | `composite > 0` | Month ≥ 6 |
| `boardProfile` | presence of data | Month ≥ 9 |
| `weatherStation` / `wallet` ("Legacy Level" per existing code comments) | currently dormant/demo-only | Month ≥ 12 **and** `Legacy` tag — see §5 |
| QR code | `Usership` + `assemblyPhase ≥ forming` | unchanged |

This turns the existing static block list into the literal 12-month reveal sequence, with zero new UI components required — only a month check added to existing conditionals.

---

## 5. The Legacy threshold — Month 12 and beyond

`UserTag.Legacy` already exists in the type system and is already the documented gate (in code comments) for the two most "evolved" blocks on a profile: Weather Station and Wallet. It is currently dormant — nothing ever grants it.

**Proposal:** Month 12 is not just "badge #12." It is the moment a Usership account becomes **eligible** for the `Legacy` tag — an admin-confirmed (not self-serve, consistent with how Usership itself is granted per `About.tsx`) transition that unlocks the final two blocks and matches the `machiavelli` demo's actual tag set: `['RND', 'Usership', 'Legacy']`.

This gives the 12-month arc a real narrative destination instead of a soft fade-out at month 12: **Free → Usership (Month 1) → Legacy (Month 12, earned)** — three tiers, all already present in `UserTag`, none of which currently have a lived path between them. The MonthlyPulseWidget's own Month-12 copy already gestures at this ("the portrait is complete — and still evolving") without the mechanism existing yet.

---

## 6. The 12-month arc

Each month below lists: the UI moment (`MonthEvolutionWidget` reveal), what becomes visible on the private dashboard, what becomes visible on `PublicProfile` if shared, and the badge earned. Base affirmation lines are the **existing** `MONTH_MESSAGES` strings (unchanged) — new material is additive.

### Month 0 → Day 1: Barebone / Civilian
- No Usership tag. Matches `About.tsx`'s documented "Civilian Mode": rotating stock Memory questions, no profiling, dashboard present but flat.
- The moment Usership is granted (admin action), a **single** first-run beat fires — not a full pulse widget, just the existing dashboard reflowing to reveal the previously-hidden blocks (Memory Story panel appears empty/inviting, `Months unlocked: 0 / 12` appears for the first time). No badge yet — Month 1 hasn't elapsed.

### Month 1 — "The system is beginning to know you"
- `MonthEvolutionWidget` fires with existing copy.
- Badge `usership_month_1` (`∘`) — first symbol.
- Memory Story panel now populated (even sparse — `generateMemoryStory` works from day one of answers).
- `Months unlocked: 1 / 12`.

### Month 2 — "Patterns are starting to form"
- Badge `usership_month_2` (`∘∘`).
- Memory widget's expand-to-compare (§4.2) becomes meaningful for the first time — Month 1 vs Month 2 paragraph, side by side.

### Month 3 — "Active User status"
- Badge `usership_month_3` (`≈`).
- `PublicProfile` gate opens: `psychologicalProfile` block (archetype, core values, behavioral cohort) becomes visible if shared. This is the first month a shared profile stops looking like a placeholder.

### Month 4 — "The portrait deepens"
- Badge `usership_month_4` (`≈≈`).
- No new block; this month is intentionally a "consolidation" beat — the copy says "deepens," the UI shows the *existing* Memory paragraph visibly rewritten/tightened rather than something new appearing. Reinforces principle 3 (compression, not accumulation).

### Month 5 — "Consistency is its own reward"
- Badge `usership_month_5` (`≈≈≈`).
- If Presence Index is "exceptional," the widget's second line (the AI-noticing line, §4.1) surfaces a specific `notableProgress` item from `monthly-summary.ts` rather than the generic narrative sentence — the first month the celebration gets *personal* rather than templated.

### Month 6 — "The journey is half-declared"
- Badge `usership_month_6` (`╞═╡`) — first Architecture-family symbol, marking the halfway structural shift (Water → Architecture, same visual grammar the existing day-streak badges already use at their own halfway points).
- `PublicProfile` gate opens: `correlatedIndexes` (self-awareness / user / person / longevity / composite scores).
- This is a natural point to also surface the QOS "Self-Assembly map" cohort block (already exists, README §"Quantum Operating System") more prominently — the halfway point is when the system's read of the person's *state*, not just their *history*, becomes worth showing.

### Month 7 — "The system has been listening"
- Badge `usership_month_7` (`╞═╡·`).
- No new gate; copy leans into the Memory widget's growing footer count (`"Based on N answers"`) — a visible, incrementing number is itself a celebration beat requiring no new component.

### Month 8 — "Rare air"
- Badge `usership_month_8` (`╞═╡≈`).
- First soft preview of Legacy-tier content: Weather Station block appears in a muted/preview state (opacity-reduced, matching the existing demo's `"This is a demo account. Legacy level features shown as preview."` copy pattern) — visible but explicitly marked not-yet-earned. This is the only place a "preview, not yet unlocked" pattern is used in the whole arc, and only because Month 8 is close enough to Month 12 for a preview to read as anticipation rather than a paywall nag.

### Month 9 — "The self-care practice is a habit now"
- Badge `usership_month_9` (`║·║`).
- `PublicProfile` gate opens: `boardProfile` (citizen-since, tenure, activity counts, biofield state) — the block that most directly narrates "this person has been here a while."

### Month 10 — "Almost there"
- Badge `usership_month_10` (`║··║`).
- Wallet preview joins the Weather Station preview from Month 8 (same muted treatment).

### Month 11 — "One more"
- Badge `usership_month_11` (`║·║·`).
- Quiet month by design — no new gate, no new preview. The copy ("One more") is the whole beat; over-designing this month would undercut Month 12's arrival.

### Month 12 — "One year with LOT. The portrait is complete — and still evolving."
- Badge `usership_month_12` (`║═║`) — final tenure badge, permanent.
- **Legacy eligibility** flagged for admin review (§5) — on confirmation: Weather Station and Wallet blocks convert from preview to live, `Legacy` tag added alongside `Usership`.
- Memory Story reaches its densest form — this is the month the paragraph should read closest in *quality* (not necessarily length) to the `machiavelli` fixture's tone: specific, patterned, no longer generic.
- `Months unlocked: 12 / 12` — this counter does not reset or hide at 12; it stands as a permanent tenure marker (`MonthlyPulseWidget`'s existing `Math.min(monthNumber, 12)` cap already supports this — months 13+ simply keep showing "12/12" plus, optionally, a new `+N` suffix for multi-year accounts, which is a one-line change).

---

## 7. Visual & symbol system — keeping the two badge families legible

The existing 626-badge system is dense and sci-fi/RPG-themed (`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v26.md`: "THE QUANTUM LIBRARY," entanglement/singularity/matrix vocabulary). The new 12-entry monthly-tenure family must **not** compete with it for visual space or symbol vocabulary:

- **Streak badges** (existing): earned by daily behavior, can theoretically be lost/reset in spirit (though the badge itself persists once earned), symbol families cycle through 16 "engine" themes (Water, Architecture, Quantum Library, Alchemist, etc.) — *many* symbols, *high* density, displayed as a `getBadgeProgressionDisplay()` dot-joined string.
- **Tenure badges** (new): earned by calendar-month elapsed + presence quality, never lost, exactly 12 possible, symbol family restricted to a single **Water → Architecture** arc that mirrors the account's own literal maturation (fluid/forming in early months, structural/built by month 12) — deliberately *sparse*, displayed as its own single labeled row (`Usership Year:`), never interleaved with the streak dots.

This keeps the "which badge system am I looking at" question always answerable at a glance: dots = daily practice, the `Usership Year:` row = tenure.

---

## 8. Technical implementation map

For a future build pass (not this session), rough sequencing:

1. **Data model** — add `monthlyRevealSeenAt` (or equivalent) to `User`/a new small table so §4.1's dismiss state moves server-side; add a lightweight `self_care_click` event log if §3's Presence Index needs it (check whether `SelfCareMoments.tsx` interactions are already logged as `Log` rows of some type before adding a new table — may already be covered).
2. **`monthly-summary.ts`** — no structural change needed; it already computes everything §3–§6 need. Wire its output into a live API endpoint instead of (or in addition to) the email path.
3. **`badges.ts`** — add the 12-entry tenure family as a new `TenureBadgeType` union, separate from `BadgeType`, with its own `getTenureBadge(monthNumber)` accessor — keep it structurally isolated from the streak system per §7.
4. **`MonthlyPulseWidget.tsx`** — rename/extend per §4.1; keep existing dismiss choreography and copy untouched, add the narrative-line append and server-persisted dismiss.
5. **New `MemoryWidget.tsx`** — thin wrapper around existing `generateMemoryStory()` output plus the expand/compare interaction; reuses `Block` UI primitive already used everywhere else.
6. **`public-api.ts`** — add `monthNumber` checks to the existing conditional blocks per §4.5's table; no new fixture data needed beyond what `machiavelli` already demonstrates as the ceiling.
7. **Admin tooling** — a small internal action to grant `Legacy` tag on Month-12 review, consistent with how `Usership` itself is already granted manually today (no self-serve flow to build).

Every item above touches existing files. The only wholly new component is `MemoryWidget.tsx`; everything else is extension of code that already runs in production.

---

## 9. Metrics / success criteria

- **Retention inflection at Month 3 and Month 6** — the two months with a new `PublicProfile` block unlocking are hypothesized retention/engagement checkpoints; instrument and compare against Months 4/5 (no-op months) as a natural control.
- **Presence Index correlation** — validate that "exceptional" months (richer reveal) correlate with lower churn than "minimal" months in the following 30 days.
- **Memory Story quality, not length, over time** — track paragraph length across a user's 12 months; flat-or-shrinking length with rising `answerCount` is the target signature of "compression," not growth-for-growth's-sake (principle 3).
- **Legacy conversion rate** — % of accounts reaching Month 12 who are actually granted `Legacy` on admin review vs. simply left at "eligible."

## 10. Open questions

1. Should the Month 8/10 "preview" blocks (Weather Station, Wallet) exist at all, or does showing *any* locked content — even softly — contradict principle 6 ("no dark patterns")? Recommend testing Month 8 preview off by default and A/B'ing it.
2. Is a single global 12-month arc right, or should the *rate* of reveal (not the ceiling) vary by Presence Index — i.e., can a highly engaged user reach the Month-6 block set in real-month 4? This would break the clean `joinedAt` math everywhere and needs a decision before implementation.
3. `Legacy` tag today has no defined *exit* or *renewal* semantics anywhere in the codebase — worth deciding whether it's permanent-once-earned (recommended, matches "tenure badge never lost" principle) before wiring admin tooling.

---

## Appendix — Day 1 vs. Month 12, side by side

| Surface | Day 1 (Civilian → fresh Usership) | Month 12 (target state, ≈ `/u/machiavelli`) |
|---|---|---|
| Dashboard | Flat, rotating stock questions, empty Memory panel | Full widget set, dense but calm |
| Memory Story | Empty / one-line invitation | Dense first-person paragraph, tightened not lengthened |
| `Months unlocked:` | `0 / 12` | `12 / 12` (permanent marker) |
| Badges | None | `usership_month_1…12` full row (Water → Architecture arc) + independent day-streak dots |
| `PublicProfile` | Name, date, weather only (if shared) | + psychologicalProfile, correlatedIndexes, boardProfile, (pending Legacy) weatherStation + wallet, QR |
| Tags | none / `Usership` | `Usership` (+ `Legacy` on admin confirmation) |
| Voice | System asks simple stock questions | System states specific, remembered patterns back to the person |

---

**This document is a brainstorm, not a build ticket.** Recommend the next session pick 2–3 items from §8 (suggest: `MemoryWidget.tsx` + tenure badges + the Month-3/Month-6 `PublicProfile` gating) as a scoped first build pass, rather than attempting the full 12-month system at once.
