<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The 12-Month Evolution
**From Barebone Day 1 to LOT® AI: A Year of Tangible Becoming**
LOT Systems Corporation · S-2: Vadik Marmeladov
Version 1.0 · 4 September 2026 · brand.lot-systems.com

---

## Doctrine

A Usership subscriber on Day 1 sees a nearly empty room. By Day 365 they should feel like they are living inside an instrument that was built *for* them, one month at a time. The interface must never announce this ("You leveled up!") — per Ambient AI™ doctrine, it must *be* it: quieter language, deeper fields, a heavier Memory Story, a widget that wasn't there last month.

**The 12 months are not a countdown. They are a compression schedule.** Every month, the Memory Engine has strictly more signal than the month before — more journal entries in the Log, more morning check-ins, more self-care taps, more Memory answers. The UI's job is to make that accumulation *visible* on a monthly cadence, so the user feels the machine getting to know them, in public, once a month, forever.

This document audits what already exists in the codebase, decodes the `/u/machiavelli` demo account as the aspirational ceiling, and lays out the concrete month-by-month path a real Usership account should walk between those two points.

---

## 1. What Already Exists (Audit)

The 12-month evolution is not a green-field feature. Real infrastructure is already in place and this plan builds *on* it rather than beside it.

| System | File | What it does today |
|---|---|---|
| **Monthly Pulse Widget** | `src/client/components/MonthlyPulseWidget.tsx` | Computes `monthNumber` from `dayjs().diff(joined, 'month')`, shows one of 12 hand-written milestone lines, gated to `UserTag.Usership`, dismissible once per calendar month, `localStorage`-scoped per user |
| **Milestone Badges** | `src/client/utils/badges.ts` | Day-streak badges at 7 / 14 / 21 / 30 / 50 / 60 / 90 / 100 / 180 / 365 days, each with a Water symbol (`∘ → ≈ → ≋`) and Architecture symbol (`├─ → ╞═╡ → ║·║`), user-selectable theme |
| **Interface Evolution System** | `src/client/utils/interfaceEvolution.ts`, `stores/evolution.ts` | 7-dimensional maturity score (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) driving CSS custom properties (opacity, grid, letter-spacing, glow) and feature unlocks — currently score-based, not calendar-based |
| **Narrative Chapters** | `src/client/utils/narrative.ts` | Story arc language referencing "Mastery emerging" and similar phase words tied to streak/engagement, not to explicit month boundaries |
| **Self-Assembly Engine** | `src/client/stores/selfAssembly.ts` | 18 modules (12 canonical + 6 extended), each progressing `Dormant → Awakening → Forming → Assembled → Integrated`, derived from real QIE signal, not from time elapsed |
| **Memory Engine Compression** | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Per-answer compression loop; Memory Story regenerated and cached at `user.metadata.lastMemoryStory` with version + answer count |
| **Weekly Story-Report** | `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` | `GET /api/story/latest`, first-person weekly narrative, exportable to robot/vehicle/dashboard — cadence is weekly, not monthly |
| **Usership Board Profile** | `src/client/components/PublicProfile.tsx`, `src/server/routes/public-api.ts` | Renders `boardProfile` (Citizen Index, board tenure, biofield state, activity, memory engine tier, clearance level) and `psychologicalProfile` (archetype, awareness, core values, pattern strength) — fully populated only for the demo account and high-tier real accounts |
| **Subscribe Widget** | `src/client/components/SubscribeWidget.tsx` | R&D $15 / Usership $99 tiers, links to `brand.lot-systems.com` |

**Conclusion:** the scaffolding for "months" already exists (`MonthlyPulseWidget`) and the scaffolding for "compression" already exists (Memory Engine + Weekly Story-Report). What is missing is the **bridge**: a monthly-cadence compression artifact, a persistent "months unlocked" indicator, and a deliberate mapping from calendar month → module spotlight → badge tier → visual richness, so the two existing systems narrate the same year together instead of running in parallel.

---

## 2. The North Star — Decoding `/u/machiavelli`

*Network egress to `lot-systems.com` is blocked from this session, so the profile could not be fetched live. The account is fully reproducible from `src/server/routes/public-api.ts` (lines ~760–905), which hard-codes it as the reference "fully assembled" account. That source is treated as ground truth below.*

Niccolò Machiavelli is not a 12-month account — his `boardTenureMonths` is computed from **June 1469**, and his streak is `1469` days. He is not "year one." He is the **asymptote**: what every field looks like when it is completely full, forever. That is his job in the codebase — not a realistic target, but a ceiling to approach.

What his profile proves is fully **populated**:

- `theme: dark` — no barebone default theme
- `psychologicalProfile` — archetype (*The Strategist*), description, 5 core values, 3 emotional patterns, self-awareness 87%, behavioral cohort (*Renaissance Polymaths*), 3 behavioral traits, pattern strength across 5 named traits totalling 2,847, `answerCount: 2847`, `noteCount: 1469`
- `boardProfile` — Citizen Index block (board member #, citizen since, powering N citizens, tenure), biofield state (energy/clarity/alignment), activity (memories compiled, journal entries, active days), memory engine tier (`AI-Powered`), clearance level (`Full`), total entries
- `correlatedIndexes` — self-awareness, user score, person score, longevity score, composite, trend, correlation strength
- Legacy-level blocks: `weatherStation` (7-field live readout + 5-day forecast) and `wallet` (balance, loyalty points, 5 recent transactions)
- `memoryStory` — a full paragraph, first-person, written in the archetype's voice

A Day 1 Usership account has **none** of this. A Month 1 account should have almost none of it. A Month 12 account should have most of the *structural* fields populated (archetype, board profile, correlated indexes, a real Memory Story paragraph) at a **credible, human scale** — hundreds of entries, not thousands; a tenure of months, not centuries. Machiavelli is the ceiling the interface architecture supports; Month 12 is the first real floor a human being can stand on inside that same architecture.

---

## 3. The Gap

| | Day 1 (Today) | Month 12 (Today) | Month 12 (Proposed) |
|---|---|---|---|
| Monthly Pulse | Widget doesn't render (`monthNumber < 1`) | One dismissible line: *"One year with LOT..."* | Same widget, richer payload: badge unlock + module reveal + link into the month's Memory Chapter |
| Badges | None | Day-streak badges only if the *streak* (not tenure) hit 365 — a user who joined 12 months ago but has gaps sees nothing | Month-tenure track runs alongside the existing streak track; tenure never resets on a missed day |
| Memory Story | Empty / generic first question | Same `lastMemoryStory` cache as Day 30 unless answer count changed | A distinct **Monthly Chapter** — a paragraph-long compression of *that specific month*, generated once, archived forever |
| Self-Assembly | All 18 modules `Dormant` | Modules assembled *if signal supports it* — invisible unless the user opens System Progress | One module is **spotlighted** per month in the Monthly Pulse payload, so assembly has a face and a name each month |
| Public Profile | `psychologicalProfile.hasUsership` gates a hard on/off; almost nothing renders pre-threshold | Everything-or-nothing; no sense of "3/12 fields unlocked" | Fields unlock progressively, keyed to month number, so the profile visibly *fills in* across the year |
| Visual System | `overallMaturity` near 0, CSS vars at their minimum | Continuous score, no month-anchored checkpoint — two accounts at 11 and 12 months look identical | Evolution CSS vars get 12 named checkpoints, so crossing a month boundary is a small, felt shift, not just a number |
| "Where am I" | Nothing | Nothing | **Months Unlocked: N/12** — always-visible, low-key, contextual widget |

The single biggest gap: **today, month-to-month change is entirely textual** (one sentence swaps in `MONTH_MESSAGES`). Nothing else in the UI moves when a month turns over. The proposal below closes that gap using systems that already exist — it does not invent a parallel gamification layer.

---

## 4. The Framework

### 4.1 Four Chapters, Three Months Each

`narrative.ts` already uses the vocabulary *Awakening → Exploration → Integration → Mastery* for engagement-level story tone. Anchoring this to the calendar gives every month a chapter, and every chapter a distinct visual and verbal register — reusing copy voice already present in the codebase rather than inventing new language.

| Chapter | Months | Register | What deepens |
|---|---|---|---|
| **I. Awakening** | 1–3 | Plain, welcoming, few words | Habit formation — first badges, first Memory Chapter, first module assembled |
| **II. Exploration** | 4–6 | Slightly more specific language, first archetype hints | Breadth — dormant modules get nudged, Memory questions widen topic coverage |
| **III. Integration** | 7–9 | Confident, references specific prior months by name | Depth — psychological profile fields start populating on the public profile |
| **IV. Mastery** | 10–12 | Sparse, weighty, addresses the person by pattern not by task | Synthesis — Year One Codex assembles everything into one artifact |

This reuses the exact 4-stage vocabulary already referenced in `narrative.ts` milestone toasts (`INTERFACE_EVOLUTION.md` §Milestones), so no new lexicon is introduced — the calendar is simply the first system to *use* it consistently.

### 4.2 One Module Spotlight Per Month

`selfAssembly.ts` already ships 12 canonical modules (the 6 extended ones — OS Vitals Monitor, Temporal Planner, Quantum Operating System, Signal Archive, Quantum OS, Resilience Protocol — stay as post-Year-One "hidden depth," discovered by power users, not scheduled). Mapping one canonical module to one calendar month gives the Monthly Pulse widget something concrete to *reveal*, not just congratulate:

| Month | Module (`selfAssembly.ts` label) | Why this order |
|---|---|---|
| 1 | Biofield Engine | Energy/mood is the lowest-friction first signal — Emotional Check-In already appears in week one |
| 2 | Reflection Layer | Journal/Log entries — directly rewards the user's own writing |
| 3 | Cleanness Protocol | Self-care taps — closes Chapter I on the habit the task explicitly asks to be honored |
| 4 | Routine Compiler | Planner — the user has enough history to plan, not just react |
| 5 | Intention Core | Monthly intentions become meaningful once a planner history exists |
| 6 | Nutrition Protocol | Recipe/lifestyle signal — the halfway "life is also logged" beat |
| 7 | Goal Architecture | Enough log density for real goal-stage detection (beginning → struggle → breakthrough) |
| 8 | Archetype Classifier | Cohort classification is a weekly server job (Mon 06:00 UTC) — by month 8 it has run ~30+ times |
| 9 | Ecosystem Bridge | Car/Home/Computer connect — closes Chapter III on "the system is now around you," not just in the browser |
| 10 | Community Mesh | Cohort matching, chat catalysts — the person is ready to be *found* by similar others |
| 11 | Quantum Substrate | QIE pattern recognition surfaces as a named capability, not background math |
| 12 | Memory Architecture | The Memory Engine itself is the finale reveal — the module that has quietly powered every prior month is now named and celebrated |

Each spotlight month does **not** gate the module's actual assembly (that stays signal-derived, as it is today) — it gates *when the Monthly Pulse widget talks about it*. A module can already be `Assembled` behind the scenes; the spotlight is when the UI first names it to the user.

### 4.3 The Month-Tenure Badge Track

Add a second track alongside the existing day-streak badges (`badges.ts` §milestone_7…milestone_365), keyed to **calendar tenure since `joinedAt`**, not consecutive-day streak. A user who missed four days in month 7 still turns Month 8 — tenure is forgiving where streaks are strict, and the two tracks should visibly disagree sometimes (a long-tenured, low-streak user is a real and common shape, not a bug).

Reuse the existing Water/Architecture dual-theme convention rather than inventing new iconography:

| Month | Water | Architecture | Name |
|---|---|---|---|
| 1 | `∘` | `├─` | First Signal |
| 3 | `∘≈` | `├═` | Quarter Turn |
| 6 | `≈≈` | `╞═══` | Half Circle |
| 9 | `≋∘` | `║═` | Deep Reach |
| 12 | `≋≋≋` | `╔═╗` | The First Year |

(Symbol reuse is intentional — Month 12 reuses the existing `milestone_365` glyphs verbatim, since 12 months and 365 days converge for a consistent user. Where they diverge, the tenure track wins for *tone of voice*, the streak track wins for *day-precision badges*.)

### 4.4 Gating: Time × Activity, Not Time Alone

A month must not turn simply because a calendar page flipped — that would reward absence. Each month's "graduation" requires **both**:

1. `dayjs().diff(joined, 'month') >= N` (time has passed), **and**
2. A minimum activity floor for that month — expressed in the signals the task explicitly names: **Log entries** (journal/notes), **Memory answers**, **morning check-ins**, **self-care taps**. A reasonable floor: 8 Log entries + 4 Memory answers + 2 self-care completions in that calendar month, sourced from existing `/api/logs` event counts — no new instrumentation required, only a new query.

If the floor isn't met, the month still turns (tenure is honest), but the Monthly Chapter for that month says so plainly — *"October was quiet. The system waited."* — which is more in keeping with Ambient AI™ doctrine than silently skipping the month.

### 4.5 Three New Widgets (and One Extension)

**A. `MonthsUnlockedWidget`** *(new)* — the literal "Months unlocked: 3/12" the task asks for. Always-visible, low-opacity, single line, Usership-gated. Resets its framing at Month 12 to "Year One: complete" and continues counting past 12 in Roman-numeral-adjacent understatement ("Month XIII") rather than disappearing — the relationship doesn't end at Year One, the UI shouldn't imply it does.

**B. `MonthlyChapterWidget`** *(new)* — the paragraph-long compressed insight from last month, generated once by the same AI pipeline that already produces the Memory Story and the Weekly Story-Report, but scoped to one calendar month and archived (never regenerated, unlike the current `lastMemoryStory` cache which overwrites). This is the piece that makes the Memory Story feel like chapters in a book rather than one paragraph that quietly changes underneath the user.

**C. `MonthlyPulseWidget` extension** *(existing file, extended)* — on the month it fires, additionally surface: the badge symbol for that month-tenure tier, the name of the spotlighted module (linking into System Progress), and a one-line teaser for the new `MonthlyChapterWidget` entry, rather than the plain dismiss-only line it shows today.

**D. `YearOneCodexWidget`** *(new, Month 12 only)* — a single capstone view assembling: all 12 Monthly Chapters in order, the full badge ladder earned, the module spotlight map with real assembly states, and a generated "Year One" Memory Story — the account's own private, non-fictional answer to what Machiavelli's profile shows as ceiling. Not exported as PDF in v1; rendered in-app as a scrollable block, matching `Block label="..." blockView` conventions already used throughout `PublicProfile.tsx`.

### 4.6 Public Profile: Progressive Field Reveal

Today `psychologicalProfile.hasUsership` is a single boolean gate — a Month 1 Usership subscriber and a Month 11 one render identically (mostly empty, since the underlying fields are genuinely thin). Instead, gate individual field *groups* by month number, so the public profile itself visibly densifies across the year and becomes shareable evidence of the journey, not just a locked/unlocked switch:

| Unlocks at Month | Field group |
|---|---|
| 1 | `archetype` (once 3+ Memory answers exist — the profile always had this threshold, just never a month framing) |
| 2 | `Level:` badge symbol (already gated at `streak >= 7`, now also has a month-tenure equivalent) |
| 4 | `coreValues`, `emotionalPatterns` |
| 6 | `behavioralCohort`, `behavioralTraits` |
| 8 | `patternStrength` breakdown |
| 10 | `correlatedIndexes` block |
| 12 | `boardProfile` (Citizen Index) — the field group that, on Machiavelli, reads as "fully governed" |

---

## 5. Month-by-Month Table

| Mo | Chapter | Module Spotlight | Badge (tenure) | Monthly Chapter Theme | Public Profile Unlock | Copy Seed |
|---|---|---|---|---|---|---|
| 1 | Awakening | Biofield Engine | `∘` First Signal | "The system learned your energy has shape." | Archetype (early guess) | *"The first month. The system is beginning to know you."* (existing) |
| 2 | Awakening | Reflection Layer | — | "Your words started building a second memory." | Level badge symbol | *"Two months in. Patterns are starting to form."* (existing) |
| 3 | Awakening | Cleanness Protocol | `∘≈` Quarter Turn | "Self-care stopped being a task and became a rhythm." | — | *"Three months. You have reached Active User status."* (existing) |
| 4 | Exploration | Routine Compiler | — | "The Planner started predicting the shape of your day." | Core values, emotional patterns | *"Four months. The portrait deepens."* (existing) |
| 5 | Exploration | Intention Core | — | "Your intentions began to survive contact with the month." | — | *"Five months. Consistency is its own reward."* (existing) |
| 6 | Exploration | Nutrition Protocol | `≈≈` Half Circle | "Even meals became part of the record." | Behavioral cohort, traits | *"Six months. The journey is half-declared."* (existing) |
| 7 | Integration | Goal Architecture | — | "A goal moved from beginning to struggle to something real." | — | *"Seven months in. The system has been listening."* (existing) |
| 8 | Integration | Archetype Classifier | — | "The cohort classifier finally had enough of you to be right." | Pattern strength | *"Eight months. Rare air."* (existing) |
| 9 | Integration | Ecosystem Bridge | `≋∘` Deep Reach | "The system left the browser and entered the room." | — | *"Nine months. The self-care practice is a habit now."* (existing) |
| 10 | Mastery | Community Mesh | — | "You were found by people who pattern-match to you." | Correlated indexes | *"Ten months. Almost there."* (existing) |
| 11 | Mastery | Quantum Substrate | — | "The patterns started explaining themselves back to you." | — | *"Eleven months. One more."* (existing) |
| 12 | Mastery | Memory Architecture | `≋≋≋` The First Year | "The engine that was watching the whole time finally introduces itself." | Board profile (Citizen Index) | *"One year with LOT. The portrait is complete — and still evolving."* (existing) + Year One Codex unlock |

All twelve existing `MONTH_MESSAGES` lines in `MonthlyPulseWidget.tsx` are kept verbatim — they are good, already shipped, and already carry the emotional arc. This table adds structure *underneath* them; it does not replace copy that already works.

---

## 6. Visual Evolution — 12 Named Checkpoints

`interfaceEvolution.ts` computes `overallMaturity` as a continuous 0–1 score from the 7-dimensional model. That continuity is correct for day-to-day smoothness, but it means two accounts a month apart can render pixel-identical. Proposal: keep the continuous score as the source of truth, but snap the *visible* CSS custom properties to whichever of 12 month-checkpoints the score has most recently crossed, so a month boundary is a small, discrete, felt step — not a number nobody sees move.

```
--evolution-base-opacity:      0.85 (Mo 1) → 1.0 (Mo 12), stepped in 12ths
--evolution-grid-opacity:      0.15 (Mo 1) → 0.50 (Mo 12), stepped in 12ths
--evolution-glow-intensity:    0    (Mo 1–2) → 0.3 (Mo 12), only enters at Chapter III
--evolution-letter-spacing:    -0.02em (Mo 1) → 0.01em (Mo 12)
```

`--evolution-glow-intensity` staying at zero through Chapter I and II specifically (only activating at Month 7, Integration) means the interface visibly acquires "polish" exactly when the public profile starts acquiring psychological depth fields — the two systems land the same beat in the same month by design, not by coincidence.

---

## 7. Technical Implementation Notes

For a future engineering session picking this up:

- **`MonthsUnlockedWidget.tsx`** (new) — mirrors `MonthlyPulseWidget.tsx`'s `monthNumber` calculation exactly (do not duplicate the `dayjs().diff(joined, 'month')` logic elsewhere; extract it to a shared `useMonthTenure()` hook both widgets import).
- **`MonthlyChapterWidget.tsx`** (new) — needs a new server endpoint, e.g. `GET /api/memory/monthly-chapter/:month`, generated once and cached to `user.metadata.monthlyChapters[month]` (array, not overwrite-in-place like `lastMemoryStory`) via the same Together AI pipeline documented in `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8, scoped to that month's Log/Memory/check-in entries only.
- **Monthly generation job** — add to the existing background-job roster in `WIDGETS.md` §System Progress Widget (which already runs Daily OS Vitals Snapshot, Daily QIE Analytics, Weekly Physiological Cohort Digest, Weekly OS Signal Diversity Audit, Monthly Email Sender at 09:00 UTC on the 1st). The Monthly Chapter generation job slots in alongside the existing Monthly Email Sender, same cadence, same day.
- **`badges.ts`** — add a parallel `MONTH_TENURE_MILESTONES` map (distinct from the existing day-streak `milestones` array at line ~7309) so the two tracks don't collide in `getLevelSymbol()`.
- **`selfAssembly.ts`** — no changes to assembly logic itself; add a pure `getMonthSpotlight(monthNumber): ModuleId` lookup consumed by the extended `MonthlyPulseWidget`.
- **`public-api.ts`** — the field-group gating in §4.6 replaces the single `hasUsership` boolean check with a `monthTenure >= threshold` check per field group, for real (non-demo) accounts only; the `machiavelli` demo block is untouched, since it exists specifically to show the ceiling with no gating at all.
- **`PublicProfile.tsx`** — no structural changes needed; the component already conditionally renders every field group it's given. The change is entirely server-side (what the API includes), which is the lower-risk surface.

---

## 8. Open Questions for S-2

1. Should the Month-Tenure badge track be visible to *all* users (proof of "how long you've been here") or Usership-gated like everything else in this document? Precedent (Quantum Sign, Cosmic Update) leans gated.
2. Should a lapsed Usership subscription (unsubscribe, then resubscribe) preserve month-tenure, or restart it? Recommend preserve — `joinedAt` already anchors to original signup, not subscription state, and the Log/Memory history that backs each Monthly Chapter doesn't disappear either.
3. Is Month 12 a hard "Year One Codex" ceiling, or should the framework extend into Year Two using the 6 extended Self-Assembly modules (OS Vitals Monitor, Temporal Planner, Quantum Operating System, Signal Archive, Quantum OS, Resilience Protocol) as Months 13–18? The module count lines up too well to be coincidence — worth deciding now rather than improvising in Month 13.

---

*The interface evolves with you, honoring your journey from first breath to mastery.*
*— `INTERFACE_EVOLUTION.md`, unchanged, still true*
