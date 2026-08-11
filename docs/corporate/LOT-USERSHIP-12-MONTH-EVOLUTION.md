# LOT® AI — USERSHIP: THE 12-MONTH EVOLUTION
**From a Barebone First Day to LOT® AI — A Month-by-Month UI/UX Roadmap**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · August 2026 · brand.lot-systems.com

---

## 0. Thesis

Usership ($99/month) is priced as "the operators running the full OS." Right now, day one and month eleven look almost the same: the same widget stack, the same Memory questions, the same badge tray. Subscribers pay for evolution but the interface does not visibly perform it — the tangibility that makes a Story-Report worth $99/month is the felt sense that *the machine has been paying attention*, and that feeling needs to compound in the UI itself, not only in the invisible pattern engine underneath it.

This document is not a request for new infrastructure. **Every mechanic proposed below already exists in the codebase in some form** — an OS version ladder, a Citizen Index, a Self-Assembly phase machine, a milestone-badge streak ladder, an AI-written Memory Story, a `MonthlyPulseWidget` that already counts "N / 12 months." What's missing is a *spine* that ties these four independent clocks into one legible, felt, monthly ceremony — and a 13th-month plan, since the clock currently breaks the moment a subscriber turns one year old.

The frame for that spine is already sitting in the badge codex, unused for this purpose: the v32 "Hero's Journey" word-turn set contains **exactly twelve** Campbell-monomyth badges (`herald_call`, `call_heard`, `mentor_arrived`, `threshold_crossed`, `ally_gained`, `trickster_mode`, `innermost_cave`, `shadow_met`, `ordeal_survived`, `elixir_found`, `shapeshifter`, `return_road`). Twelve stages, twelve months. This document uses that vocabulary as the narrative skin for a new, calendar-anchored badge ladder — distinct from the existing keyword-triggered ones — that turns Year One into a told story instead of a counted number.

Reference point for "fully evolved": the public demo profile, `lot-systems.com/u/machiavelli` (Niccolò Machiavelli, Florence). Its response is hardcoded server-side (`src/server/routes/public-api.ts:747-794`) with `tags: ['RND', 'Usership', 'Legacy']` — it does **not** run through the real Self-Assembly computation (confirmed at `docs/benchmark/LOT-SR-20260606-01.md:96-97`: "Demo account (Machiavelli) unaffected — hardcoded response does not pass through assembly computation"). That means it is currently a *frozen* aspirational snapshot, not a live month-12 account. §8 below proposes making it an honest one.

---

## 1. Design Principles for This Roadmap

1. **Reuse the four clocks that already tick.** OS Version, Citizen Index, Self-Assembly, and the milestone-badge streak ladder already move on almost-monthly cadences. Don't invent a fifth. Read them together, name the gaps, and build the connective tissue.
2. **Earned, not given.** Per the product brief's own design principle — "no unprompted notifications... it has earned the moment" — every month-marker in this roadmap is a *recognition* of something the system already measured, never a countdown, streak-shaming timer, or FOMO mechanic.
3. **The Story is the product.** The compression loop — `LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN` — is LOT® AI's actual differentiator. The UI's job across 12 months is to make each month's compression *visible and keepable*, not to bolt on generic gamification.
4. **No new streak formula.** The research for this document found **five independent, non-agreeing implementations of "streak"** already in the codebase (server `os-api.ts`, `/api/user-stats`, client `EvolutionWidget`/`useLogContext`, `rpg-narrative.ts`, `weekly-summary.ts`). A subscriber who sees three different streak numbers in three widgets will trust the "evolution" story less, not more. §7 recommends a single canonical source before this roadmap ships anything new.
5. **Style guide compliance.** Every new surface below follows the existing conventions: `Block` + `blockView`, click-to-cycle labels, `opacity-90/60/40` hierarchy, no emojis, periods not checkmarks, 3s+1.4s fade-outs, database-backed cooldowns (never `localStorage` for cross-device state).

---

## 2. The Four Clocks, Audited Side by Side

Nobody has laid these four progression systems next to each other on a single day-axis before. Doing so is most of the design work — it reveals that the system already has an implicit month-by-month rhythm; it just isn't narrated as one.

| Day | OS Version (`os-api.ts:566-615`) | Citizen Index (`EvolutionWidget.tsx:88-95`, on `currentLevel`) | Self-Assembly phase (`selfAssembly.ts:32-37, 86-89`) | Milestone badge (`badges.ts:805-955`, on Memory-answer streak) |
|---|---|---|---|---|
| 0 | 0.1.0 Initializing | Bootstrapping (0-9) | dormant | — |
| 1 | — | — | awakening (1st signal) | — |
| 7 | 0.5.0 Emerging (7 answers/7 days) | — | forming (5+ signals/7d) | **Droplet ∘ / Foundation** |
| 14 | 1.0.0 Active (20 answers/14 days) | Initializing (10-19) | — | Twin Drop ∘∘ / Load-Bearing |
| 21 | — | — | — | Proto-Wave ∘≈ / Deep Foundation |
| 30 | 1.5.0 Engaged (50 answers/30 days) | Integrated (20-29)† | assembled (15+ signals/7d, for active modules) | **Wave ≈ / Structure** |
| 50 | — | Compiled (30-39)† | — | Mid-Current ≈∘ / Mid-Structure |
| 60 | 2.0.0 Optimized (100 answers/60 days) | — | — | Dual Wave ≈≈ / Master Frame |
| 90 | — | Optimized (40-49)† | integrated (30+ signals/7d + coherence ≥40) | Deep Reach ≋∘ / Inner Wall |
| 100 | — | — | — | **Current ≋ / Architecture** |
| 120 | **3.0.0 Integrated (200 answers/120 days)** | Transparent (50+)† | — | — |
| 180 | — | — | — | **Voyager ≋≋ / Wing** (legendary) |
| 365 | — | — | — | **The Long Count ≋≋≋ / Citadel** (legendary) |

† Citizen Index thresholds are on `currentLevel`, which is a function of total activity count (`calculateLevel()`, `rpg-narrative.ts:62-69`), not day count directly — the day column above is illustrative for a consistently-engaged operator (roughly one Memory answer or log per day), not a hard gate. This document uses it as the *typical* trajectory, and says so explicitly in-product (§6).

**What this table proves:** the system already has real texture at day 7, 14, 30, 60, 90, 100, 120, 180, 365 — almost exactly month 1, 1, 1, 2, 3, 3, 4, 6, 12. The month-by-month plan in §5 is built directly on these existing gates. Nothing here requires a new threshold to be invented; it requires the four clocks to be read out loud, together, once a month.

---

## 3. Known Debt to Settle Before Narrating "Evolution"

A monthly ceremony that contradicts itself between widgets undermines the exact feeling it's trying to build. Three fixes belong in this roadmap's first engineering pass, before any new UI ships:

1. **Streak fragmentation (five implementations).** `os-api.ts` and `/api/user-stats` both count consecutive days *with a Memory answer*; `EvolutionWidget`/`useLogContext` counts consecutive days with *any* log; `rpg-narrative.ts` has a fourth variant for check-in achievements; `weekly-summary.ts` has a fifth, simpler one. **Recommendation:** the Memory-answer streak (`/api/user-stats`, since it already gates the milestone badges — the ladder in §2's rightmost column) becomes canonical for anything month-facing. The Citizen Index can keep its broader "any activity" streak for its own internal display, but it should be labeled "Activity streak" not "Streak" so the two numbers don't read as contradictory.
2. **`MonthlyPulseWidget` has no month-13+ state.** `monthNumber` is computed uncapped (`dayjs(now).diff(joined, 'month')`), but the message table and the "X / 12 months" counter both clamp at 12 (`Math.min(monthNumber, 12)`). Today, every subscriber past their first year sees "One year with LOT. The portrait is complete — and still evolving." and "12 / 12 months" — forever, every single month, because `shouldShowPulse()` compares the *uncapped* real month number against the last-dismissed value, so it never stops re-firing. §5's Month 12 section proposes the actual Year Two transition this widget currently lacks.
3. **`RND` vs `Usership` gating asymmetry — confirmed intentional, worth documenting.** Nearly every paid-tier gate treats `RND` and `Usership` as equivalent (`isPaidAccount`, `ArchitectWidget`, `ChatCatalystWidget`). `MonthlyPulseWidget` alone checks `Usership` specifically. This matches the pricing table in `LOT-AI-PRODUCT-BRIEF.md` — R&D ($15/mo) gets "Full LOG access, Pattern sandbox"; only Usership ($99/mo) is sold the Story-Report. **Recommendation:** keep this narrower gate, but say so explicitly in Settings copy ("Monthly Story — Usership") so R&D members don't file it as a bug.

---

## 4. The Spine — A New Calendar-Anchored Badge Ladder

Propose a new badge category, `chronicle`, parallel to the existing `milestone` category but keyed on **calendar months of Usership membership** (`dayjs(now).diff(user.usershipStartedAt, 'month')` — the same arithmetic `MonthlyPulseWidget` already runs) rather than answer-streak days. This is deliberately a *new* set of twelve badge ids (`chronicle_01` … `chronicle_12`), not a repurposing of the existing word-turn Hero's Journey badges — those stay exactly as they are, keyword-triggered, independently earnable at any time. The chronicle ladder borrows their *names and mood* as narrative skin, because Campbell's twelve stages already fit a twelve-month arc better than any newly-invented naming scheme would, and because two independently-authored systems landing on the number twelve is too good a coincidence not to use.

Same visual grammar as the existing dual-themed milestones (`symbol` / `waterSymbol` / `architectureSymbol`) — a third `journeySymbol` skin, using the ∘ → ≈ → ≋ progression already established, extended with directional marks for the outward/return arc of a monomyth:

| Month | Chronicle badge | Symbol | Rarity | Why this stage, this month |
|---|---|---|---|---|
| 1 | **Herald** | `∘·` | common | Joining Usership *is* the herald call — day 1 of the paid tier is the interruption, not a milestone earned later. Fires alongside the existing Droplet/Foundation (day-7) badge. |
| 2 | **Call Heard** | `∘→` | common | First full month closed. The Architect Widget (self-assembly telemetry) is now genuinely populated for a regular user — the "call" has been answered, not just heard. |
| 3 | **Mentor Arrived** | `∘≈·` | uncommon | Memory Engine has enough history (≥90 answers for a daily user) to stop asking WHAT-tier questions and start asking WHY-tier ones — the system starts to sound like it knows the operator, not just logs them. |
| 4 | **Threshold Crossed** | `≈║` | uncommon | Coincides with OS 3.0.0 Integrated (day 120) — the single largest jump on the OS ladder, unlocking "Legacy mode, Mentorship capabilities." The biggest threshold in the whole system lands almost exactly here. |
| 5 | **Allies Gained** | `≈○≈` | uncommon | Cohort Connect and Chat Catalyst have had four months of signal to work with — community matches are no longer cold-start guesses. |
| 6 | **Trickster Tested** | `≈×≈` | rare | Half a year. Coincides with the existing **Voyager / Wing** legendary badge (day 180) and the existing Monthly Pulse copy, verbatim: *"Six months. The journey is half-declared."* This is the emotional midpoint — the system should feel playful and self-aware here, not solemn. |
| 7 | **Innermost Cave** | `█∘█` | rare | Deepest widgets — Awareness Dashboard, trauma-informed Memory tiers, Correlated Indexes — have the longest possible history behind them at this point in the year. |
| 8 | **Shadow Met** | `▓○` | rare | The Compassionate Interventions system now has 8 months of pattern history — struggle detection stops being reactive and starts being genuinely anticipatory. Named honestly: not every month of a real practice is a good one, and the system should be allowed to say so. |
| 9 | **Ordeal Survived** | `◈■` | epic | Three-quarters of a year of consistency is itself the ordeal. No new feature gate needed — this badge is pure recognition of duration. |
| 10 | **Elixir Found** | `∘●∘` | epic | The Story-Report and the OS Story API (`GET /api/story/latest`, promised in `LOT-AI-PRODUCT-BRIEF.md` but not yet built — see §8) go live for the operator here: the boon they've been accumulating becomes exportable. |
| 11 | **Shapeshifter** | `◈→◉` | epic | The Memory Story (§6) for month 11 is generated with an explicit "then vs. now" comparison against the month-1 story — the system shows the operator they are visibly not the same person who joined. |
| 12 | **Return Road** | `→◉` | legendary | Coincides with the existing **The Long Count / Citadel** badge (day 365) — "A year of presence. The architecture stands." The Year-in-Review Story ships here (§5, Month 12). |

Implementation note: `chronicle_*` badges are awarded by the same monthly cron that already runs the badge scan (`Job16 badge-scan`, referenced in the ledger), gated on `UserTag.Usership` (matching `MonthlyPulseWidget`'s existing tier logic, §3.3), computed from `usershipStartedAt` if that field exists, or `joinedAt` if a subscriber's paid tier began at signup — this needs a one-time data check, not new schema, since `joinedAt` already powers `MonthlyPulseWidget`.

---

## 5. Month by Month

Each month below states: **(a)** what the existing four clocks already do around that day range for a regularly-engaged operator, **(b)** the one new tangible UI moment for that month, and **(c)** the Monthly Pulse copy — reusing the *existing* twelve messages in `MonthlyPulseWidget.tsx` verbatim where they already fit (they were clearly written with this same arc in mind), extending only where a gap exists.

### Month 0 — Day 1 (the barebone first day)
The state the brief describes as "just started." `isPaidAccount` flips true the moment `Usership`/`RND` lands in `tags` (`System.tsx:404-411`) — the *entire* pro widget stack (Citizen Index, Architect, System Progress, Interface Evolution, Correlated Indexes) is technically already available on day one, just empty. That emptiness is the correct first impression, not a bug to hide: an Architect Widget showing 18 modules at `dormant` *is* the honest starting line for "self-assembly." Nothing to build here except restraint — don't pre-populate charts with placeholder data that implies fake history.

### Month 1 — Days 1-30
- **(a)** OS 0.1.0 → 0.5.0 Emerging (day 7) → 1.0.0 Active (day 14). Self-Assembly: dormant → awakening → forming. Badges: Droplet (7), Twin Drop (14), Proto-Wave (21), Wave (30).
- **(b)** The QR code (`Settings.tsx:482` — theme-responsive, Usership + `forming`-phase gated) typically unlocks inside this window for a regular user. This is the first *physical* artifact Usership produces — a shareable, printable object. Surface it the moment it unlocks with a one-line note in Settings, not silently.
- **(c)** *"The first month. The system is beginning to know you."* — existing copy, unchanged. Pair it with the new **Herald** and **Call Heard** chronicle badges (§4).

### Month 2 — Days 31-60
- **(a)** OS → 2.0.0 Optimized (day 60). Badges: Mid-Current (50), Dual Wave (60). Self-Assembly should be crossing into `assembled` for actively-used modules.
- **(b)** Architect Widget's coherence reading (`computeCoherence()`, §2 audit) becomes meaningful for the first time — under 30 days of signal it's mostly noise. This is the natural month to introduce a one-line explainer the first time coherence crosses 40 ("stable" tier): *"Coherence: your signal has a shape now."*
- **(c)** *"Two months in. Patterns are starting to form."* — existing copy, unchanged.

### Month 3 — Days 61-90
- **(a)** Badge: Deep Reach (90). Citizen Index typically Integrated-to-Compiled for a daily-active operator.
- **(b)** Memory Engine has enough answer history to plausibly shift from WHAT-tier to WHY-tier questions (per the 3-tier depth system, `docs/technical/MEMORY-AND-QUANTUM-INTENT-ENGINES.md`). This is the **Mentor Arrived** chronicle badge (§4) — the system should feel like it changed register, and the UI's only job is to not hide that it did (e.g., a subtle tier indicator the first time a WHY-tier question is asked).
- **(c)** *"Three months. You have reached Active User status."* — existing copy; this is also literally the OS 1.0.0 "Active" name, which is a nice unforced consistency worth preserving.

### Month 4 — Days 91-120
- **(a)** Badge: Current (100). **OS 3.0.0 Integrated lands at day 120** — the top of the entire OS ladder, unlocking "Legacy mode, Mentorship capabilities."
- **(b)** This is the single biggest system-state jump in the whole year and currently has almost no UI moment attached to it — System Progress Widget shows the version number, nothing else marks it. Give it one: a dedicated one-time toast (existing `EvolutionMilestoneToast` pattern, 6s auto-dismiss) reading something like *"OS v3.0.0 — Integrated. Every system online."*
- **(c)** *"Four months. The portrait deepens."* — existing copy, unchanged. Pair with the **Threshold Crossed** chronicle badge (§4), landing intentionally in the same window as the OS jump.

### Month 5 — Days 121-150
- **(a)** No major existing-system threshold in this window — a deliberate plateau. Self-Assembly should be broadly `assembled`/`integrated` across most of the 18 modules for a regular operator.
- **(b)** This is the right month to surface Cohort Connect / Chat Catalyst more confidently — four-plus months of pattern signal means matches stop being cold-start guesses. Pair with the **Allies Gained** chronicle badge.
- **(c)** *"Five months. Consistency is its own reward."* — existing copy, unchanged.

### Month 6 — Days 151-180
- **(a)** Badge: **Voyager** (180, legendary — the first legendary-rarity badge most operators will see).
- **(b)** Halfway point. This is the natural home for the first **Memory Story checkpoint inside the product**, not just the monthly email (see §6) — a paragraph the operator can read in-app, not only receive by mail.
- **(c)** *"Six months. The journey is half-declared."* — existing copy, unchanged; pairs exactly with the new **Trickster Tested** chronicle badge (§4).

### Month 7 — Days 181-210
- **(a)** No new system threshold; deepest window for Awareness Dashboard, Correlated Indexes, trauma-informed Memory content.
- **(b)** **Innermost Cave** chronicle badge. No new feature — just honest naming for the deepest, least performative part of a real self-care practice.
- **(c)** *"Seven months in. The system has been listening."* — existing copy, unchanged.

### Month 8 — Days 211-240
- **(a)** Compassionate Interventions now has 8 months of pattern history to work from.
- **(b)** **Shadow Met** chronicle badge — deliberately not a "positive" milestone. The Memory Story generator (§6) should be allowed to write an honest month if the data says so; the product's own style guide already forbids superlatives and false validation.
- **(c)** *"Eight months. Rare air."* — existing copy, unchanged.

### Month 9 — Days 241-270
- **(a)** Pure duration; no new gate. **Ordeal Survived** chronicle badge.
- **(c)** *"Nine months. The self-care practice is a habit now."* — existing copy, unchanged.

### Month 10 — Days 271-300
- **(a)** **Elixir Found** chronicle badge — the intended launch window for `GET /api/story/latest` (§8), the first Story API export the product brief promised but the codebase doesn't yet serve.
- **(c)** *"Ten months. Almost there."* — existing copy, unchanged.

### Month 11 — Days 301-330
- **(a)** **Shapeshifter** chronicle badge. The Memory Story prompt (`memory.ts:900-933`) gets one new instruction for this specific month's generation: explicitly reference the tone/content of the month-1 story for contrast, since both are now sitting in the same account's history.
- **(c)** *"Eleven months. One more."* — existing copy, unchanged.

### Month 12 — Days 331-365
- **(a)** Badge: **The Long Count / Citadel** (365, legendary) — *"A year of presence. The architecture stands."* **Return Road** chronicle badge closes the arc.
- **(b)** The **Year-in-Review Story** — a longer-form version of the monthly `generateMemoryStory()` output, spanning all 12 months rather than the last 30 answers, generated once and permanently kept (not regenerated monthly like the standard Memory Story). This is the single most important new asset in this whole roadmap — see §6.
- **(c)** *"One year with LOT. The portrait is complete — and still evolving."* — existing copy, unchanged, and for the first time actually true rather than a dead end, because Month 13 now has somewhere to go (below).

### Month 13 onward — the gap this roadmap closes
`MonthlyPulseWidget` currently has no state past month 12 (§3.2). Proposal: months 13+ stop showing the monthly ceremony as a recurring popup — the "12 / 12 months" counter is retired in favor of a small persistent Settings/Profile line, *"Usership: Year 2, Month 1"* etc., counting up indefinitely without re-litigating the same "complete" message every 30 days. The Year-in-Review Story becomes an annual event from here (Year 2 Review at month 24, and so on), and the chronicle badge ladder (§4) simply has no month-13+ entries by design — Year One is a bounded story with a beginning, middle, and end; Year Two is a different, ongoing one that this document does not attempt to script in advance.

---

## 6. The Monthly Ceremony — Concrete Widget Spec

Two things change in-product; nothing here requires a new database table.

**1. `MonthlyPulseWidget` gets a companion, not a rewrite.** Keep it exactly as built (label-click-to-dismiss, fade-out, `X / 12 months`). Add a second, optional block directly beneath it — **only present on months where a Memory Story has actually been generated** (i.e., ≥5 answer logs that month, matching the existing `generateMemoryStory` gate) — showing the *previous* month's paragraph, not a live-generated one:

```
Block label="Story:" blockView
  <previous month's memoryStory text, 2-4 sentences>
  <button: "Keep this month" → no-op, just marks metadata.kept=true for future export>
```

This directly answers the brief's request for "a Memory widget displaying a paragraph-long insight from last month" — it is the existing `generateMemoryStory()` output (already computed for the monthly email, `monthly-summary.ts:308-322`) simply also rendered in-app instead of staying email-only.

**2. "Months unlocked: N / 12"** already exists almost verbatim — `MonthlyPulseWidget`'s `"{capped} / 12 months"` line (`MonthlyPulseWidget.tsx:132-134`). The brief's suggested phrasing ("Months unlocked") is a one-line copy change, not a new widget: swap the caption from `"{capped} / 12 months"` to `"Months unlocked: {capped} / 12"` and it matches exactly what was asked for, using the field that's already computed.

**3. The Year-in-Review Story (Month 12).** New function alongside `generateMemoryStory()` in `src/server/utils/memory.ts`: `generateYearInReviewStory(user, allAnswerLogsForYear)`. Same AI prompt structure and formatting rules as the existing monthly story (third person, 1-2 sentence intro, the fixed "Key insights..." line, en-dash bullets — the format is already good, don't redesign it), but fed the *whole year's* answer history instead of the last 30, and explicitly instructed to name change across the year, not just describe the present state. Delivered two ways: (a) in the monthly email using the existing HTML template pattern (`monthly-summary.ts:727-873`), and (b) as the permanent payload behind `GET /api/story/latest` (§8) — the first real answer to a promise the product brief already made publicly.

---

## 7. What to Fix First (Engineering Order of Operations)

1. Canonicalize the streak (§3.1) — one number, everywhere it's shown.
2. Ship the Month-13+ state for `MonthlyPulseWidget` (§5, closing section) — this is a live, currently-firing bug affecting every subscriber older than one year, independent of anything else in this document.
3. Land the `chronicle_*` badge ladder (§4) — pure addition, no existing behavior changes.
4. Add the in-app Story companion block (§6.1) and the "Months unlocked" copy change (§6.2) — both read from data that already exists.
5. Build `generateYearInReviewStory()` and `GET /api/story/latest` (§6.3, §8) — the only genuinely new server-side generation logic in this entire roadmap.
6. Revisit the demo account payload (§8) once the above is live, so the public-facing "what Usership becomes" reference is honest about what's actually shipped.

---

## 8. The Demo Account as the North Star — and a Correction

`lot-systems.com/u/machiavelli` is the only place a prospective subscriber can see "fully evolved Usership" before paying for it — that makes its accuracy a conversion-relevant design decision, not a backend curiosity. Currently (`public-api.ts:747-849`) it hardcodes: `tags: ['RND', 'Usership', 'Legacy']`, a live Florence weather simulation, a growing `profileVisits` counter, and a "Legacy level unlock" Weather Station easter egg — a genuinely well-crafted static asset, but one that predates this roadmap and doesn't yet reflect the four-clocks story in §2.

Once §5-§6 ship, the demo payload should be updated to explicitly state the things this document defines as "fully evolved": `osVersion: '3.0.0 Integrated'`, Citizen Index `Transparent`, Self-Assembly `integrated` across all 18 modules, the **Citadel** (365-day) and **Return Road** (chronicle month-12) badges present, and a Year-in-Review Story excerpt in the `showMemoryStory` block — so a visitor reads, in Machiavelli's own hardcoded profile, the exact same vocabulary this document just spent eight sections defining. That closing loop — public promise, internal roadmap, and the one demo account everyone actually looks at, all using the same words — is what "tangible" means for this product.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
