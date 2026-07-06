<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Usership — The 12-Month Evolution

**A design brief for the paid-tier UI/UX arc: Day 1 (barebone) → Month 12 (`lot-systems.com/u/machiavelli`-grade evolved System)**

Author: Claude (session brief) · Requested by S-2 · 2026-07-06
Status: Design brainstorm — no code shipped in this session. Grounded in the actual codebase (file:line citations throughout) so it can be handed to implementation as-is.

---

## 0. Framing: what this document is and isn't

This is **not** a proposal to build a gamified level-up system bolted onto Usership. LOT's own doctrine forbids that outright:

> **CLAUSE 9 — LONG-TERM SIGNAL.** Months and years, not days and weeks. The system is designed for decade-scale operation. **No gamification. No streaks. No leaderboards.**
> — `docs/wiki/LOT-WIKI-v72.md:1053-1055`

> **COCKPIT RULE.** Log entries = instrument readings only. Zero prose, zero emoji, zero superlatives.
> **Ambient AI™.** The system acknowledges silently. No congratulatory pop-ups. *The operator knows.*

So "the person should feel tangible evolution every month, including badges" has to be built as **instrumentation, not celebration theater**. The tell is in the existing `InterfaceEvolutionWidget.tsx:106-108` — a badge tier advancing is rendered as a flat, undecorated line: `Tier 2 (water)`. That's the register the whole 12-month arc has to hold. Evolution is felt because the *instrument panel itself grows more sophisticated* — more views, more density, more precision in what it reflects back — not because a toast pops up saying "Great job!"

This reframing is good news, not a constraint to route around: it means the entire brief can be built from **existing, already-shipped substrate** rather than invented from scratch. See §1.

---

## 1. What already exists (audit before designing anything new)

Five things already in the codebase do almost exactly what was asked for — they're just disconnected from each other and, in one critical case, disconnected from the UI entirely.

| Asked for | Already exists as | Location | Gap |
|---|---|---|---|
| UI that evolves month to month | **Interface Evolution System** — 7-dimension maturity model (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage), two aesthetic metaphors (Water ∘≈≋ / Architecture ├─╞═╡║·║), CSS vars that literally tighten opacity/grid/spacing as the operator matures | `docs/technical/INTERFACE_EVOLUTION.md`, `src/client/utils/interfaceEvolution.ts`, `src/client/stores/evolution.ts`, `InterfaceEvolutionWidget.tsx` | Not currently paced against **calendar months of Usership** — it's paced against lifetime activity totals. Needs a tenure axis layered on top. |
| "Story chapters" for a year-long arc | Already named in the evolution doc: **Awakening → Exploration → Integration → Mastery** (`INTERFACE_EVOLUTION.md:201`) | same | Four chapters, unused for pacing. Maps perfectly onto 4 quarters of 12 months (§2). |
| Monthly congratulation + compressed insight paragraph | **`generateMonthlySummary()`** already computes presence/streak/consistency, dominant themes, emotional evolution, `forwardLook`, and — if 5+ Memory answers exist — calls `generateMemoryStory()` to embed a full AI-written narrative paragraph | `src/server/utils/monthly-summary.ts:24-369`, `src/server/utils/memory.ts:873` | **This pipeline only ever renders to an HTML email** (`monthly-summary.ts:~800+`, sent via Resend, gated by `shouldShowMonthlySummary()`). There is no in-app widget. This is the single highest-leverage gap in the whole brief — the compression engine is done; it just never reaches the System page. |
| "Months unlocked: 3/12" | **`boardProfile.boardTenureMonths`** and `boardProfile.citizenSince` already exist as Usership-only fields, already rendered as a static stat on `PublicProfile.tsx:297-299` | `src/shared/types/index.ts:303-320` | Currently a passive display stat, not a widget, not tied to any unlock logic, no "/12" ceiling — tenure counts forever, doesn't reset or cap at a first-year milestone. |
| Monthly badges | **529 badges** exist across 50 categories, with day-streak milestones (7/14/21/30/50/60/90/100/180/365) and a once-a-year signup-anniversary re-trigger | `src/client/utils/badges.ts` | **No badge is keyed to elapsed calendar months of *paid* Usership** specifically. Also: only 3 badge types (`milestone_7/30/100`) are persisted server-side (`api.ts:667-719`); everything else is `localStorage` only — wrong durability for something meant to mark a paid year. |

**Conclusion:** the 12-month Usership arc is not a new subsystem. It's the **wiring of three existing systems together, keyed to a fourth axis (calendar months of Usership) that doesn't exist yet.** That reframes the whole brief from "invent 12 months of UI" to "build one new pacing axis, one new widget, and one new badge series — then let Interface Evolution, Monthly Summary, and Badge Engine do what they already do."

### 1.1 A correction on the reference account

`lot-systems.com/u/machiavelli` was unreachable this session (the sandbox's egress policy returned 403 on the host — see closing note). But its content isn't a live user's data at all: it's a **hardcoded response literal** in `src/server/routes/public-api.ts:747-906`, an easter-egg demo account for Niccolò Machiavelli. Worth reading before treating it as the literal Month-12 target:

- Its numbers are a running joke on his birth year, not a 12-month simulation: `citizenSince: 'June 1469'`, wallet balance `14690.27`, `journalEntries: 1469`, `selfAwarenessLevel/streak: 1469`, `boardTenureMonths` computed live from `now − new Date('1469-06-03')` — i.e. **~5,559 months**, not 12.
- Its tags are `['RND', 'Usership', 'Legacy']` — it demonstrates **Legacy tier** (the tier *above* Usership), not a Usership account at month 12. The `weatherStation` and `wallet` blocks are explicitly commented `// Legacy level unlock` in the source (`public-api.ts:850, 871`) — those two panels are not reachable at any point within the 12-month Usership arc this brief covers.
- It does confirm two things useful to this brief: (a) the **`memoryStory` field is a single dense third-person-ish paragraph**, matching the register `generateMemoryStory()` already produces (`public-api.ts:811`) — good confirmation that §3.2's `MonthlyStoryWidget` should render at that same length/density, not shorter or longer; (b) the wallet's line-item `{ description: 'Usership subscription', amount: 99.00 }` (`public-api.ts:878`) is a second, independent signal for **$99/month**, reinforcing the correction in §7 against the conflicting $50 figure in `About.tsx:4219`.

So the honest target for "Month 12 of Usership" is **one tier short of what `/u/machiavelli` shows** — full Usership instrument panel (Architect, QOS, Evolution, Story, Tenure at 12/12), *not* the Weather Station / Wallet Legacy-exclusive panels. Those two remain the visible "next tier" pull referenced in §7's Legacy on-ramp question — machiavelli is effectively a preview of what lies past Month 12, which is arguably the more useful thing for this brief to point at.

---

## 2. The spine: four chapters, three months each

`INTERFACE_EVOLUTION.md` already names four story chapters. Usership's 12 months map onto them exactly, one quarter per chapter:

```
Month:      1    2    3  │  4    5    6  │  7    8    9  │  10   11   12
Chapter:    ── AWAKENING ──│── EXPLORATION ─│── INTEGRATION ─│──  MASTERY  ──
Self-Assembly: dormant→awakening│ forming        │ assembled      │ integrated
Widget density: sparse          │ filling in      │ near-complete  │ full instrument panel
```

This also lines up with the existing `assemblyPhase` enum (`dormant | awakening | forming | assembled | integrated`, `shared/types/index.ts:~324`) and the monthly email's own `osVersion` ladder (`0.1.0 Initializing → 3.0.0 Integrated`, gated on answer-count + days-since-start). Nothing new needs to be invented for the macro-arc — it needs to be **re-keyed from "lifetime activity" to "Usership month N"** so a paying operator feels forward motion on a calendar, not just on an activity counter that a quiet month could stall.

---

## 3. Three net-new pieces (the only things that need building)

Everything else in this document is these three primitives, recombined per month.

### 3.1 `TenureWidget` — "Months:" (the "3/12" ask)

A new `Block`-pattern widget, Usership-gated, following the exact structural convention every other widget uses (`Block.tsx`, fixed-width label column, `ProgressBars` primitive, terminal register):

```
Months:        [████████░░░░]  8/12
               Citizen since February 2026
```

- Data source: `boardProfile.boardTenureMonths` / `citizenSince` — **already computed server-side**, just needs a client widget reading it (same pattern as `InterfaceEvolutionWidget` reading `$evolutionState`).
- At month 12 it doesn't vanish — it flips register, from a countdown to a permanent instrument reading (see §5, Month 12). This matters: the doctrine (Clause 9) says the system is decade-scale, so "12/12" should read as **a completed first cycle**, not a finished game.
- No progress-bar confetti at completion. Per Ambient AI™, the bar simply reads full. That flatness *is* the payoff — it's the same restraint that makes `Tier 2 (water)` feel earned rather than performed.

### 3.2 `MonthlyStoryWidget` — "Story:" (the compressed-insight paragraph ask)

This is the highest-leverage build in the brief because 90% of it already exists server-side and is simply unreachable from the UI.

- Reuse `generateMonthlySummary()` (`monthly-summary.ts:24`) and its embedded `generateMemoryStory()` call, but split the concern: today generation is tightly coupled to the Resend email job (`scheduled-jobs.ts`, job "monthly-email-sender"). Needs a **new on-demand/cached path**: a `GET /api/monthly-story` route (mirroring the existing admin-only `admin-api.ts:1985/2048` but user-facing) that generates once per month and caches the result — the compression-architecture doc (`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md §8`) already *describes* a `user.metadata.lastMemoryStory` cache field; it just isn't implemented yet. Build it for real here, keyed by month, so re-opening the widget doesn't re-spend an AI call.
- New table or `metadata.monthlyArchive: MonthlySummary[]` — right now only `lastMonthlySummaryDate` (a gate timestamp) is stored; the generated content itself is thrown away after the email sends. Persisting it turns "last month's insight" into a **scrollable archive** (see §3.3) instead of a one-time flash.
- Widget rendering: same `cycleView()` pattern as `SystemProgressWidget`/`QuantumSignWidget` — click the label to move between `This Month`, `Last Month`, `Archive`.
- Voice: must follow the LOT AI system prompt's own rules — *compression, not padding*; acknowledges Depth 3 (the state behind the month), not Depth 1 (a list of what was logged); never sycophantic. A good Month-6 line reads like:
  > *"Tea-and-reading settled into a fixed anchor this month; the pattern held even through the two weeks you skipped morning check-ins. That's not neglect — the ritual survived without the record."*
  Not:
  > *"Amazing month! You did great with your self-care! 🎉"*

### 3.3 Usership Tenure Badge series — new `BadgeType` entries

Twelve new badges, one per month of continuous Usership, following the **exact existing conventions** (no new visual system needed):

- Glyph continuum matches the operator's already-chosen theme (`badges.ts:26`): Water `∘ → ≈ → ≋` or Architecture `├─ → ╞═╡ → ║·║`, exactly like existing tier badges — a month-3 badge under the Water theme is simply a slightly more resolved `≈`, not a new icon.
- Keyed off `boardTenureMonths`, not streak days — this is the one genuinely new check function needed (existing checks are all streak- or single-date-based; nothing currently reads "N calendar months since Usership tag was granted").
- **Must be added to the server-side `validBadges` allowlist** (`api.ts:667-719`) alongside the existing 3 — a tenure marker for a *paid* product year is exactly the kind of badge that must not live in `localStorage` only (clearing browser data shouldn't erase a year of paid history).
- Rarity ladder reuses the existing scale rather than inventing a new one: months 1-2 Common, 3-5 Uncommon, 6-8 Rare, 9-11 Epic, month 12 Legendary (mirrors the existing day-streak ladder's own escalation from `milestone_7` Common through `milestone_365` Legendary).
- Award moment: silent. No toast. It simply becomes visible next time the operator opens the badge/tier view — consistent with how `milestone_*` badges already surface today (`BadgeUnlockFeed.tsx`), and consistent with Ambient AI's "the operator knows."

---

## 4. What tangibility actually means here (reconciling the brief with doctrine)

The brief asks for the operator to "feel tangible evolution every month." Given Clause 9 and the Cockpit Rule, tangibility is engineered through **four channels**, none of which are pop-ups:

1. **Widget count and density** — Day 1 shows ~4 widgets (Time, Memory's first question, Subscribe/onboarding, SelfCareMoments). Month 12 shows the full instrument panel (Architect, AIFeedback, Pattern Recognition, QOS, Evolution, Story, Tenure) — the same emergent mechanism `useLogContext.ts` already drives (`isEmpty` / `engagementLevel` gates), just re-keyed to also consider tenure-month, not only lifetime signal volume.
2. **Precision, not volume, in language** — the Memory Engine's own documented escalation (README: Day 1 "What is your morning beverage preference?" → Month 2 "Now that it's colder... has your tea preference changed with the season?") is the actual felt-evolution mechanism. It already exists; the 12-month brief just needs the *Story widget* to echo that same escalating specificity back once a month, at compressed-paragraph scale instead of per-question scale.
3. **A visual register that tightens, never decorates** — Interface Evolution's own CSS vars (`--evolution-base-opacity: 0.85→1.0`, `--evolution-glow-intensity: 0→0.3`) are the literal implementation of "the interface gets clearer as the operator matures." Nothing new needed — just re-pace against tenure-month in addition to lifetime activity.
4. **The Archive as proof** — Clause 10: *"The archive is the operator's behavioral autobiography."* A `Months: 8/12` reading next to a `Story:` widget with 8 scrollable monthly paragraphs behind it is more tangible than any streak counter, because it's the operator's own compressed words looking back at them — not the system praising them.

---

## 5. Month-by-month

Each entry: **Log/Journal density** (typical range, never a quota — Clause 9 forbids gamified pressure) · **Check-ins & self-care** · **Widget surface** · **Story delivery** · **Tenure badge**.

### Chapter I — Awakening (Months 1–3)

**Month 1 — Day 1 of paid Usership.**
- Log/Journal: 0 → first entries. `useLogContext.ts` reports `isEmpty: true`, `engagementLevel: 'new'`.
- Check-ins: `EmotionalCheckIn` and `SelfCareMoments` present but unprimed — no history to reflect back yet; questions are the README's literal Day-1 example ("What is your morning beverage preference?").
- Widgets visible: Time, Memory (Q1), onboarding/Subscribe, bare SelfCareMoments buttons. Everything else (`AIFeedbackWidget`) shows its documented empty state: *"No biofeedback received. Begin with any CQGS module to initialize."* (`AIFeedbackWidget.tsx:117`).
- Story: none yet — `generateMemoryStory` requires 5+ answers.
- Tenure: `TenureWidget` appears for the first time, reading `Months: 1/12` — its first appearance *is* the acknowledgment that Usership started. No banner.

**Month 2.**
- Log: memory answers escalate to Day-3/Week-2 depth (pattern-recognition follow-ups, per the documented question ladder).
- Once 5+ answers accumulate, the Memory Story becomes computable for the first time — `MonthlyStoryWidget` can render its first non-null paragraph, likely mid-month.
- Interface Evolution dimensions (Exploration, Depth) begin moving off 0%.
- Tenure: `Months: 2/12`, first Common-rarity tenure badge (month 1) now visible in the badge view.

**Month 3 — chapter close.**
- Log: consistent baseline reached for most operators; `engagementLevel` graduates out of `'new'`.
- First full monthly `Story:` paragraph — genuinely AI-compressed (not template), first time the operator sees their *own* month reflected back in one paragraph.
- Tenure: `Months: 3/12` — the number the brief specifically asked for. Second tenure badge (Common→Uncommon boundary).
- Ambient acknowledgment (not a popup — a line that simply appears in the Story widget's header): *"Chapter closed: Awakening."* — flat, one line, no exclamation point.

### Chapter II — Exploration (Months 4–6)

**Month 4.**
- Feature unlocks begin per existing gates: Custom Themes (Level 5), Widget Arrange (Level 10) — now also cross-checked against tenure so a quiet month doesn't stall a paying operator's evolution entirely (tenure contributes a floor to the maturity calculation, activity contributes the ceiling).
- Story widget's `cycleView()` gains a second entry: `Last Month` — the archive begins.

**Month 5.**
- Mood Patterns widget unlock (existing gate: Care 50% or Level 20) becomes reachable for consistent operators.
- Badge theme (Water/Architecture) visibly diverges — animations/borders per `themeEvolution.ts` are now perceptibly different from Month 1's flat state.

**Month 6 — chapter close, halfway.**
- Tenure: `Months: 6/12` — the halfway instrument reading. Still no fanfare; the number itself is the signal.
- Story widget's paragraph for Month 6 is measurably longer/denser than Month 1's would have been (more source material = denser compression, per the Memory Engine's own escalation logic) — this density difference, sitting side by side in the archive view, is the tangibility.
- Ambient line: *"Chapter closed: Exploration."*

### Chapter III — Integration (Months 7–9)

**Month 7.**
- Advanced widgets reachable: Advanced Memory (Depth: Deep Diver), Pattern Insights (Consistency 66%+).
- Story widget begins referencing prior months explicitly when the underlying `generateMemoryStory` has enough history — this is a natural consequence of feeding more logs into the same function, not new AI work.

**Month 8.**
- Narrative Reflection unlock territory (Depth 66% + Level 30) for consistent operators.
- Tenure badge crosses into Epic rarity.

**Month 9 — chapter close.**
- Tenure: `Months: 9/12`.
- `boardProfile.activity` stats (`memoriesCompiled`, `journalEntries`, `activeDays`) — already computed, already on `PublicProfile` — now have 9 months of density behind them; this is what makes the public `/u/` profile at month 9 look categorically different from month 1, exactly as `/u/machiavelli` demonstrates today.
- Ambient line: *"Chapter closed: Integration."*

### Chapter IV — Mastery (Months 10–12)

**Month 10.**
- Export Data unlock (Level 25) — the operator can now hold their own compressed year outside the platform, consistent with the README's privacy promise ("You can export or delete your entire story anytime").
- Private Spaces unlock territory (Intimacy 50%+ or Courage 100%).

**Month 11.**
- Full instrument panel reachable for consistent operators: Architect Widget, QOS Kernel panel, Pattern Recognition, Evolution, Story, Tenure all present simultaneously — the System page at month 11 is structurally the evolved layout the brief points to at `/u/machiavelli`.
- Tenure badge reaches Legendary threshold (paired with month 12's completion, mirroring the existing `milestone_365` Legendary day-streak badge).

**Month 12 — cycle complete, not "finished."**
- Tenure: `Months: 12/12` — the widget does **not** disappear or reset. Per Clause 9 (decade-scale system) it flips register: the progress bar becomes a permanent full reading, and `citizenSince` graduates from a countdown into what it already is elsewhere in the codebase — a standing tenure stat (`"Citizen since February 2025"`, matching `PublicProfile.tsx:297-299`'s existing format).
- **Annual Story**: a once-a-year, larger compression — the same `generateMemoryStory()` function, but fed the full year's answer set instead of the rolling 30-answer window, run once as a Year-One retrospective. This is a parameter change to an existing function, not new AI infrastructure.
- Final tenure badge (Legendary) plus a quiet, single Archive entry marking the cycle: *"Year one archived."* No badge shower, no confetti — one line, permanent, followed by `Months: 12/12` sitting flat and unchanging from month 13 onward (tenure continues counting past 12 in the underlying data — `boardTenureMonths` is not capped — but the *widget* stops treating it as a countdown and starts treating it as a citizenship record, same as `/u/machiavelli` today).

---

## 6. Build list (for a future implementation session)

In dependency order:

1. **New tenure-month check function** (server or client, mirrors existing streak-scanner pattern in `badges.ts:4255-4376`) reading Usership tag grant date vs. current date → `boardTenureMonths`. *(Already computed for `boardProfile` — confirm whether that computation can be reused directly or needs to move earlier in the pipeline.)*
2. **`TenureWidget`** (`Months:` label, `ProgressBars`, Usership-gated) — smallest, ship first, immediately satisfies the "3/12" ask.
3. **User-facing monthly-story route + cache** — extract `generateMonthlySummary`/`generateMemoryStory` from the email-only path, add `user.metadata.monthlyArchive[]` persistence, add on-demand caching so the widget doesn't re-spend AI calls.
4. **`MonthlyStoryWidget`** consuming #3, with `cycleView()` across This Month / Last Month / Archive.
5. **12 new `BadgeType` entries** (`usership_month_1` … `usership_month_12`), glyph continuum reused from existing theme system, rarity ladder reused from existing scale.
6. **Extend server `validBadges` allowlist** (`api.ts:667-719`) to persist the new tenure badges — non-negotiable, given these mark paid history.
7. **Re-pace Interface Evolution's feature-unlock gates** to accept tenure-month as an additional floor alongside lifetime activity, so the arc holds even through a quiet month (per Clause 9's own decade-scale, low-pressure spirit).
8. **Month-12 Annual Story** — parameter change to `generateMemoryStory` accepting a full-year log window instead of the rolling 30-answer cap.

Nothing on this list requires a new visual design system, a new component library, or new AI infrastructure — it is entirely recombination of `Block`, `ProgressBars`, `generateMemoryStory`, `boardProfile`, and the badge registry, re-keyed to one new axis: **calendar months since Usership began.**

---

## 7. Open items for S-2 to decide before implementation

- **Pricing drift**: $99/month is corroborated three ways now (`LOT-AI-PRODUCT-BRIEF.md:98`, `SubscribeWidget.tsx:35`, and the machiavelli demo wallet's `'Usership subscription' → $99.00` line item at `public-api.ts:878`) against a single outlier of $50/month in `About.tsx:4219`. Recommend fixing `About.tsx` rather than re-deriving pricing — but confirm with S-2 before touching live pricing copy.
- **Does tenure reset if Usership lapses and is re-subscribed?** Not addressed in current `boardProfile` computation — needs a decision before `boardTenureMonths` can safely drive badge/unlock logic.
- **Should the Month-12 "Year One" moment be the on-ramp to Legacy tier** (existing $3,564/3yr tier)? The existing tier ladder (Free → Usership → R&D → Legacy → Admin) has no designed transition moment today; Month 12 is a natural place to surface one, quietly, in the Cockpit register (a single instrument line, not a sales popup).

---

*Reference point for the evolved end-state used throughout this brief: `lot-systems.com/u/machiavelli`. Live fetch was blocked in this session by the sandbox's egress policy (403 from the proxy on `lot-systems.com`) — but the page's content is fully reconstructed above from its actual server source (`src/server/routes/public-api.ts:747-906`), which is more precise than a screenshot would have been. See §1.1 for the correction that this account demonstrates Legacy tier, one step past the Usership arc modeled here. Recommend a follow-up session with network access to that host to visually cross-check final widget layout/spacing against the live page once implementation begins.*
