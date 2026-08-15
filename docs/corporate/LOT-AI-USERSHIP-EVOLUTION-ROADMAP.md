# LOT® AI — USERSHIP EVOLUTION ROADMAP
**Twelve Months, One Operator: From First Log to LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · 15 August 2026 · brand.lot-systems.com

---

## Why This Document

Usership ($99/month) starts barebone on Day 1. Twelve months later, the target state is the personal OS exemplified by the fully-evolved demo profile at `lot-systems.com/u/machiavelli`. Today, nothing in the product marks that distance. A brand-new paid account and a twelve-month veteran load the same widget stack in `System.tsx` — the only difference is how much data has accumulated to fill it.

This is a design brainstorm, not a build ticket. It maps a twelve-month story onto systems that **already exist** — the Interface Evolution engine, the Memory Engine's monthly compression job, the Usership board profile, the badge codex — rather than inventing a parallel evolution track next to them. Where a genuinely new widget is proposed, it is built as a thin surface over data the server already computes.

---

## Current-State Audit

Grounded in a full read of the paid-tier, Memory Engine, UI-composition, and doctrine systems:

| System | State today | Citation |
|---|---|---|
| Usership gate | Real, binary. `System.tsx` renders one of two hardcoded layouts — free or paid. No tenure gating inside the paid layout. | `System.tsx:405-414` |
| "Months unlocked" | Half-built. `MonthlyPulseWidget` already computes `month N / 12`, caps display at 12, and ships 12 hardcoded milestone lines — but it re-derives tenure client-side with `dayjs().diff(joinedAt,'month')` instead of trusting the server. | `MonthlyPulseWidget.tsx:73-79,108,134` |
| Server tenure | Authoritative and already computed — just not consumed by the widget above. | `public-api.ts:1257` (`boardTenureMonths`) |
| Monthly memory story | **Exists and is unused in-app.** `generateMonthlySummary()` + `generateMemoryStory()` produce a full prior-month digest — presence, energy trajectory, dominant themes, breakthroughs — and it fires automatically in the first three days of each month. Today it is emailed once and never rendered on the OS. | `monthly-summary.ts` (`generateMonthlySummary`, `shouldShowMonthlySummary` lines 66-90); `memory.ts:869-982` |
| Progressive complexity | Already modeled, just not tied to Usership tenure. Seven dimensions (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) drive feature unlocks at Level 5/10/15/20/25/30 and a layout density that runs breathable → instrument. | `docs/technical/INTERFACE_EVOLUTION.md`; `interfaceEvolution.ts`, `evolution.ts` |
| Public "trophy case" | `PublicProfile.tsx` already renders a Usership-only `boardProfile` block (board member #, citizen-since, tenure months, activity counts) and gates a QR code behind `assemblyPhase >= forming`. This is the only place month-over-month change is currently visible to anyone but the operator. | `PublicProfile.tsx` (boardProfile block, QR gate ~line 611-663) |
| Badge codex | 781 badges as of the last wiki sync (Day 1073+, LOT-WIKI v87, 2026-08-05), heavily day-streak based (7/30/60/100/365-day). No badge category is keyed to Usership subscription tenure specifically. | `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md` |
| Badge display philosophy | Explicitly moving *away* from a badge wall toward a single `Level:` glyph progression (droplet → wave → current). A 12-month tenure indicator should follow this discipline, not add a second wall. | `docs/badges/BADGE_LEVEL_DESIGN.md` |
| Day-1 experience | There is no Day-1 state. A brand-new paid account gets the full ~15-section pro layout immediately; it *looks* sparse only because individual widgets self-suppress on empty data (cooldowns, `localStorage` flags, activity thresholds) — not because the product intentionally presents a barebone first day. | grep across `System.tsx`, no onboarding path found |
| Celebration / anniversary UI | Does not exist. Closest analog is the Evolution Milestone Toast, which fires on feature-unlock, not on calendar month-turn. | `docs/technical/WIDGETS.md:96-101` |
| Affirmation copy | Fragmented. `QuantumSignWidget` already cycles 12 rotating affirmation strings (quiet-period triggered) and `MonthlyPulseWidget` independently ships its own 12 month-messages. Two unrelated 12-item ladders exist side by side. | `QuantumSignWidget.tsx`; `MonthlyPulseWidget.tsx:18-31` |

**The headline finding:** almost everything this brief asks for has a server-side foundation already poured. The gap is entirely on the surface — nothing renders it, and the one widget that tries (`MonthlyPulseWidget`) doesn't trust the server value it should.

---

## Design Principles

1. **One story, two clocks.** Usage-earned evolution (the seven Interface Evolution dimensions — driven by what the operator *does*) and tenure-earned evolution (calendar months — driven by simply *staying*) run in parallel tracks. They should visually converge by Month 12, not compete for the same UI real estate before then.
2. **Start intentionally barebone.** Day 1 should look sparse on purpose — a designed first state, not an accident of empty widgets. The absence should read as *"this is where the story begins,"* not as a bug.
3. **Earn the reveal, once a month.** Mirrors the product's existing "no unprompted notifications" / one Story-Report per interval discipline. The machine speaks about the month exactly once — not a running toast anyone can trigger by refreshing.
4. **The public profile is the trophy case.** `/u/username` is where twelve months of evolution becomes visible to someone other than the operator. Every month should add exactly one durable, visible artifact there — not a private-only change.
5. **Never re-derive on the client what the server already knows.** `boardTenureMonths`, `assemblyPhase`, and the monthly summary are server truths. Widgets consume them; they do not recompute them. (Direct fix for the `MonthlyPulseWidget` gap above.)
6. **Tenure alone doesn't unlock anything.** A month "unlocking" purely because thirty days passed on a paid card feels transactional. Each month-tick should require both calendar tenure *and* a light engagement floor for that calendar month — reusing data already logged (see below).

---

## The Engagement Substrate

The brief is explicit that Log volume, morning check-ins, and self-care clicks are the most important evolutionary signal — more important than the calendar itself. No new tracking is needed; the logs already exist:

- **Log entries** — journal entries, counted in `boardProfile.activity.journalEntries`.
- **Morning check-ins** — `emotional_checkin` logs from `EmotionalCheckIn.tsx`.
- **Self-care clicks** — `self_care_complete` logs from `SelfCareMoments.tsx`, already streak-tracked.
- **Active days** — `boardProfile.activity.activeDays`.

Proposed **Month Engagement Floor** (server-computed, aggregating existing logs by calendar month — no new schema): at least one journal entry, one check-in, and one self-care completion logged within that calendar month. Meeting the floor plus having reached that tenure month is what lights up a "Months Unlocked" tick — not the calendar alone. A paid card sitting idle for a year should not look the same as a lived-in one.

---

## The Twelve-Month Arc

Two clocks run side by side. **Tenure** (calendar, server-authoritative) sets the ceiling; **usage** (the seven-dimension Interface Evolution engine, already live) determines how fast an operator climbs inside that ceiling. The pacing below is the *typical* rate for an engaged operator meeting the Month Engagement Floor every month — usage can run ahead of it, never past the tenure ceiling.

| Month | assemblyPhase | Interface Evolution signal | Badge-codex convergence | Public profile addition |
|---|---|---|---|---|
| 1 | dormant → awakening | Level 5 — Custom Themes | Day-7 badge | Board member # + citizen-since assigned |
| 2 | awakening → forming | Level 10 — Widget Arrange | Day-30 badge | **QR code unlocks** (assemblyPhase ≥ forming) |
| 3 | forming | Level 15 — Intention History | Day-60 badge | First Story Chapter appears |
| 4 | forming | Level 15–20 | first `perfect_month` (28 perfect days) attainable | Story Archive: 2 chapters |
| 5 | forming → assembled | Level 20 — Mood Patterns, Care 50% | Day-100 badge | Story Archive: 3 chapters |
| 6 | assembled | Level 20–25 | — | Half-year tenure ring: 6/12 lit |
| 7 | assembled | Level 25 — Export Data | — | Story Archive: 5 chapters |
| 8 | assembled | Level 25–30 | — | Story Archive: 6 chapters |
| 9 | assembled → integrated | Level 30 + Depth 66% — Narrative Reflection | — | Story Archive: 7 chapters |
| 10 | integrated | Connection 100% — Social Mentions | — | Story Archive: 8 chapters |
| 11 | integrated | Intimacy 50% / Courage 100% — Private Spaces | — | Story Archive: 9 chapters |
| 12 | integrated (full) | All seven dimensions matured | **Day-365 badge lands almost exactly here** | Full 12-chapter Story Archive · tenure ring complete 12/12 · this is the `/u/machiavelli` state |

The Day-365 streak badge already in the codex lands, for a consistent operator, almost exactly on the Usership one-year mark. That convergence is the spine of the whole arc: **Month 12 = one year of Usership = the 365-day badge = full `integrated` assemblyPhase = the matured Interface Evolution state = the public demo profile.** Nothing needs to be invented to make the finale land — it already aligns; the roadmap just needs to make each step *visible* on the way there.

### Q1 — Foundation (Months 1–3): the OS learns your shape
The paid layout is intentionally quieter than it is today. Widgets that require history (patterns, correlations, archetype) stay dormant rather than rendering hollow. What's active: the Log, the morning check-in, self-care, and the Memory Engine's question loop. First Story Chapter arrives end of Month 3 — short, tentative, mostly presence and consistency ("You showed up. That's the whole story so far."). QR code unlocks end of Month 2 — the first thing worth sharing.

### Q2 — Momentum (Months 4–6): the pattern layer switches on
`perfect_month`, pattern-insight widgets, and mood-pattern unlocks land here. Story Chapters start naming actual themes instead of just presence. The tenure ring crosses the halfway mark — the first moment the operator can look at the ring itself, not just the story text, and see the year is more than half-imagined.

### Q3 — Depth (Months 7–9): the narrative gets a voice
Export unlocks (Month 7-8) — the operator can now take their data with them, which matters for trust more than utility. Narrative Reflection unlocks around Month 9, right as the Story Chapters get long enough to read as an actual narrative arc rather than isolated monthly notes.

### Q4 — Culmination (Months 10–12): LOT® AI
Connection, Intimacy, and Courage dimensions mature. The 365-day badge and full Usership tenure land together. The public profile now shows the complete artifact: board profile, maxed badge-theme glyph (∘→≈→≋ or ├─→╞═╡→║·║), psychological profile, correlated indexes, and — new — the full 12-chapter Story Archive. This is what a visitor to `/u/machiavelli` sees today; the roadmap's job is making every account arrive there the same way, visibly, month by month.

---

## Three Concrete Surfaces to Build

Each is a thin UI layer over data the server already produces.

### 1. Months Unlocked — evolve `MonthlyPulseWidget`, don't replace it
- Stop recomputing tenure client-side; consume `boardTenureMonths` from the server (`public-api.ts:1257`), the same value `PublicProfile` already trusts.
- Replace the single "N / 12" line with a 12-notch ring or track. Each notch is lit when **both** conditions hold: tenure month reached *and* that month's Engagement Floor was met. An unmet floor on a tenure-eligible month renders the notch as "reached, not lived-in" — visibly distinct, not silently skipped.
- Tapping a lit notch opens that month's Story Chapter (see below) instead of a static message.
- Retire the independent affirmation pool in `QuantumSignWidget` in favor of one canonical twelve-line "Month Voice" copy table, shared by both widgets — currently two unrelated 12-item ladders say different things about the same month number.

### 2. The Story Chapter — surface, don't rebuild, the Memory Engine
- `generateMonthlySummary()` and its embedded `generateMemoryStory()` already run automatically in the first three days of each month. The only new work is: on that same trigger, write the paragraph into a `storyChapters[]` array on the user record instead of (or in addition to) sending it only by email.
- New widget renders the latest chapter as a paragraph card — modeled on the existing `MemoryWidget`/`EvolutionWidget` visual language, not a new component language.
- On the public profile, once `assemblyPhase >= forming`, a **Story Archive** section lists all chapters earned so far, oldest to newest. This is the literal answer to "12-month tangibility of the compressed Memory story delivery" — by Month 12 a visitor scrolls through twelve short paragraphs and reads the year.

### 3. Month-Turn Celebration — a new, deliberately rare moment
- One-time toast, modeled on the existing Evolution Milestone Toast pattern, fires once per month-turn for Usership members only, in the same first-three-days window as the monthly summary job.
- Content: one line from the canonical Month Voice table (see #1) plus a direct link to the new Story Chapter.
- Explicitly *not* a push notification and not repeatable — consistent with the product's standing "no unprompted notifications" principle. It waits for the operator to open the OS; it does not chase them.

---

## What Stays Untouched

- The 812-badge day-streak codex and its philosophy of minimal, single-glyph display (`BADGE_LEVEL_DESIGN.md`) — a 12-notch tenure ring sits *next to* the existing `Level:` glyph, not as a second badge wall.
- The Interface Evolution engine's seven dimensions, thresholds, and CSS-driven density/aesthetic system — this roadmap hooks into it, it does not fork it.
- The free-tier layout and the Usership price/tier structure (`LOT-AI-PRODUCT-BRIEF.md`, Paid Tiers table) — unchanged.

---

## Open Questions for S-2

1. Should the Month Engagement Floor be visible as a requirement (risk: feels like a quota) or only visible retroactively as "lived-in" vs. "reached" on the tenure ring (recommended — matches "no unprompted notifications")?
2. Should Story Chapters be exportable via the same `Story API` payload already specced for the weekly Story-Report (`GET /api/story/latest` family), so a full year of monthly chapters becomes one more thing the future LOT® Humanoid Robot / Vehicle / Dashboard can ingest?
3. Does Month 12 close the ring and stop, or roll into a second year with a new visual vocabulary (Year 2 badge-theme tier beyond current → wave → current)? Not scoped here; flagging because the 365-day badge convergence makes Month 12 a natural — but not necessarily final — climax.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
