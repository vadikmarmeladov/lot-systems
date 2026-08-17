<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The 12-Month Evolution
**From a barebones Day 1 screen to LOT® AI**
LOT Systems Corporation · S-2: Vadik Marmeladov
Version 1.0 · 17 August 2026 · Classification: PRODUCT / DESIGN BRAINSTORM

Reference end-state: `https://lot-systems.com/u/machiavelli` (a fully evolved public profile)
Reference start-state: Day 1 of Usership — `SubscribeWidget` clicked, `MonthlyPulseWidget` has not yet fired once.

---

## 0. Reading This Document

This is a brainstorm and design outline, not a shipped spec. It exists to answer one question: **what does the paying member's screen look like on Day 1, and what does it look like eleven months later, and what is the honest, buildable path between those two points?**

Everything proposed here is anchored to systems that already exist in this codebase — it extends them, it does not invent a parallel universe:

| Existing system | File | Role in this plan |
|---|---|---|
| Monthly milestone messages | `src/client/components/MonthlyPulseWidget.tsx` | Already has 12 hand-written month lines and a `X / 12 months` counter. This is the spine we build on. |
| 7-dimension feature unlocks | `src/client/utils/interfaceEvolution.ts`, `src/client/stores/evolution.ts` | Already gates widgets/customization behind Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage. We map months onto this, we don't replace it. |
| Memory compression cycle | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Already produces a cached Memory Story (`user.metadata.lastMemoryStory`) and 4 depth levels (Behavior → Motivation → Values → Soul). The monthly insight paragraph is a scheduled *cut* of this, not a new engine. |
| Self-assembly phases | `src/client/stores/selfAssembly.ts` | `dormant → awakening → forming → assembled → integrated`, per module. Maps naturally onto quarters of the year. |
| Badge density | `src/client/utils/badges.ts`, `getLevelSymbol`, `joinWithDots` | Trait glyphs (`•` → `⋆·` → `◊·◊` → `✦✧✦`) already thicken with streak/day count. A 365-day "speedrun_record" LEGENDARY badge already exists. |
| Public profile as trophy case | `src/client/components/PublicProfile.tsx` | `boardProfile.activity` (memories compiled, journal entries, active days), `psychologicalProfile` (archetype, self-awareness, core values, pattern strength), `correlatedIndexes` — all already render conditionally on Usership. |
| Pricing | `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` | Usership = $99/mo, full LOT® AI, Story-Report, API. |

Design doctrine carried over from `INTERFACE_EVOLUTION.md` and the AI Product Brief, non-negotiable for every month below:
- **Subtlety first.** No confetti-cannon UI. The evolution is felt, not announced loudly.
- **No unprompted notifications.** Monthly moments are discovered on the System tab, not pushed.
- **The machine improves in silence.** The person notices the questions getting sharper; they are never told "we upgraded your AI."
- **Progressive enhancement.** Nothing is ever removed. Month 1's Block components are still present in Month 12 — they're just no longer alone on the screen.

---

## 1. The Spine — Three Bars the Person Feels Every Day

The task brief calls out that the *most* important evolutionary signal is the volume of Log/journal entries plus the rhythm of morning check-ins and self-care taps. Concretely, that means three counters exist from Day 1 and never stop accumulating. Nothing else in this document works without these three being visible and honest:

1. **Log density** — total entries in `Logs.tsx` / `JournalReflection.tsx` (`note` events with text > 20 chars, per the compression architecture). This is the raw material of the Memory Story.
2. **Check-in rhythm** — `EmotionalCheckIn` completions (morning/afternoon/evening windows) + `Self-Care Moments` taps (`self_care_complete` vs `self_care_skip`). This is the *ritual*, independent of what was written.
3. **Memory Story compression** — the number of answered Memory questions (drives the 4-level depth ladder: Behavior → Motivation → Values → Soul) and the resulting narrative in `user.metadata.lastMemoryStory`.

Every month-end moment described below is a **synthesis of these three bars**, never an isolated feature drop. A person who logs a lot but skips check-ins gets a different Month 4 than a person who does the reverse — the compression is honest to their actual behavior (this mirrors the "behavioral, not declarative" principle already in the Product Brief).

---

## 2. Two End States

### Day 1 (barebones)

- `System.tsx` renders the Core Widgets only: Time, Memory (first question — Mode 1, "open, welcoming"), Planner, Recipe.
- `MonthlyPulseWidget` is silent — `monthNumber < 1`.
- `SubscribeWidget` has just been dismissed (Usership tag applied).
- No badges. `Core values: mindful • present • aware • grounded • authentic` — plain bullets, no glyphs (per `BADGE_PROGRESSION_PREVIEW.md` Day 1 state).
- Self-assembly: every module `dormant` (`·`).
- Public profile, if enabled: name, date, weather. No `psychologicalProfile` block (gated on `hasUsership` + real data), no `boardProfile`.
- This is intentional. A LOT® screen with everything switched on Day 1 would be a lie about who the person is yet.

### Month 12 (the `machiavelli` reference tier)

- Full widget stack: Interface Evolution Widget, Narrative Widget, Goal Journey, Pattern Insights, Cohort Connect, Quantum State, Architect (self-assembly map showing multiple `integrated ◉` modules), Cosmic Update (pixel-art reward), Story-Report export.
- `MonthlyPulseWidget` has fired 12 times; Month 12's line is already written: *"One year with LOT. The portrait is complete — and still evolving."*
- Badge line is dense and thematically styled (water `≋` or architecture `║·║` per the user's dominant theme) — 8-12+ traits, each with a 3-glyph maturity marker.
- Self-assembly: most modules `assembled ◯` or `integrated ◉`; QOS panel shows a stable `growth`/`peak` mode history, not `recovery` churn.
- Public profile shows the full `psychologicalProfile` block (archetype + description, self-awareness %, level, core values, emotional patterns, behavioral cohort, pattern strength counts, answer/note counts) and `correlatedIndexes` (self-awareness, user score, person score, longevity score, composite).
- This is the "portrait," in the Memory Engine's own language — not a dashboard, a *likeness*.

The entire document below is the bridge between these two screenshots.

---

## 3. Design Principle: Map Months to Existing Systems, Don't Build a New Ladder

Three systems already progress independently — self-assembly phase, evolution dimension %, and badge tier. Rather than invent a fourth "month level," each month is defined as **the point at which these three, combined with the two ritual bars from Section 1, cross a believable threshold for a consistent Usership member.** The table below is the intended cadence, calibrated so an averagely-consistent member (not a power user, not a lapsed one) crosses each column roughly on schedule.

| Month | Self-assembly (typical modules) | Evolution dimension crossing | Badge tier | Log/check-in cadence (typical) |
|---|---|---|---|---|
| 1 | biofield, memory → `awakening ∘` | Exploration ~30% | First milestone badge (Day 7 marker `⋆·`) | Daily check-in habit forming; 5-15 log entries |
| 2 | + journal, selfcare → `forming ○` | Exploration ~60%, Consistency starts | Balanced badge (`◊·◊`) | Streak survives first break-and-rebuild |
| 3 | memory, biofield → `assembled ◯` | Consistency ~50% ("Active User" per existing Month 3 line) | Week Warrior tier badges unlock Planner Templates | 30-45 entries; morning check-in is now default |
| 4 | + planner, intentions forming | Depth begins (Deep Diver unlocks Advanced Memory) | Pattern-strength badges appear | Follow-up Mode dominates Memory questions (85% probability tier) |
| 5 | + goals forming | Consistency ~66% (Moon Cycle+, Pattern Insights unlock) | — | Self-care ratio (complete vs skip) becomes a visible personal stat |
| 6 | quantum, cohort-classify → `forming` | Halfway — multiple dimensions >50% | Mid-tier density badges (`∼·∼`, `▪·▪`) | "The journey is half-declared" (existing Month 6 line) |
| 7 | + community → `awakening` | Connection begins (Bridge Builder unlocks Rich Community) | — | Cohort matching becomes meaningful (enough pattern data) |
| 8 | ecosystem, vitals → `forming` | Level 20+ (Mood Patterns unlock) | Rare-air tier badges | "Rare air" (existing Month 8 line) |
| 9 | + resilience (trauma-informed protocol fully active — 10+ log entries was crossed long ago; this is about *trust*, not gating) | Intimacy/Courage dimensions active | — | Self-care practice is now unconscious habit (existing Month 9 line) |
| 10 | quantum-os → `assembled` | Level 25+ (Export Data unlocks) | — | Story-Report export becomes routine |
| 11 | Most modules `assembled` | Level 30+ (Narrative Reflection: Depth 66% + Level 30) | Penultimate badges | "One more." (existing Month 11 line) |
| 12 | Several modules `integrated ◉` | Full narrative reflection active | Anniversary badge tier (see §5) | 365-day arc closes; `speedrun_record` LEGENDARY badge is realistically in reach only here |

This table is a *typical-member* calibration target, not a hard gate. The underlying systems (evolution %, badge unlocks, assembly phase) already respond to actual behavior — a highly engaged member will cross these columns earlier, and the UI should never punish or flag someone who's behind schedule. The month number is a **narrative frame**, not a progress requirement.

---

## 4. Month-by-Month Narrative (what appears, what it says, why)

Each month below has: **(a)** what's new on screen, **(b)** the `MonthlyPulseWidget` line (existing, quoted from source), **(c)** the proposed Memory-insight paragraph pattern, **(d)** the "Months unlocked" widget state.

### Month 1 — Arrival
- **Screen:** Core widgets only. First badge (`⋆·` or theme equivalent) appears mid-month if a 7-day streak forms.
- **Pulse line:** *"The first month. The system is beginning to know you."*
- **Memory insight:** None yet — insufficient Q&A density for a Story synthesis (`buildPrompt()` Source 6 needs meaningful history). Showing nothing here is more honest than showing a thin paragraph.
- **Months unlocked widget:** Not yet visible. It would be premature — a "1/12" chip on day 20 reads as a countdown pressure, not a celebration. First appearance is deferred to Month 2 (see below), once there's a real "1" to look back on.

### Month 2 — First Reflection
- **Screen:** Journal/self-care modules stir (`forming`). Balanced badge tier possible.
- **Pulse line:** *"Two months in. Patterns are starting to form."*
- **Memory insight (first appearance):** A single paragraph, generated the same way the weekly Story-Report already is (per `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8), but scoped to the calendar month rather than the week. E.g.: *"You showed up eighteen mornings this month, mostly before the coffee finished. The tea ritual you mentioned in week one is still holding — three weeks running now."* This is not a new AI capability; it's the existing Story generator called with a monthly window instead of a 30-answer window, cached the same way (`user.metadata.lastMemoryStory` pattern, versioned per month).
- **Months unlocked widget debuts:** `Months unlocked: 1/12` — reporting the *completed* month, never the current partial one. Styled as a quiet `Block label` chip, consistent with `MonthlyPulseWidget`'s existing `Block label="Month 2:"` pattern — same component, same typography, no new visual language introduced.

### Month 3 — Active User
- **Screen:** Planner Templates unlock (Consistency: Week Warrior+). Memory questions now favor Follow-Up Mode — the compression becomes visibly sharper (shorter questions, more "since you mentioned..." callbacks).
- **Pulse line:** *"Three months. You have reached Active User status."*
- **Memory insight:** First paragraph that references a *pattern across months*, not just this month — e.g. "Your evening check-ins have moved earlier each month — 9pm, then 8:15, now 7:40." This is where the compression becomes tangible as a trend line rather than a single snapshot.
- **Months unlocked:** `2/12`.
- **Note:** This is the natural point to also surface a first "Anniversary-in-miniature" badge — a quarter marker distinct from the monthly ones (see §5).

### Month 4 — The Portrait Deepens
- **Screen:** Advanced Memory unlocks (Depth: Deep Diver). Depth-level-3 questions (Values) become common instead of rare.
- **Pulse line:** *"Four months. The portrait deepens."*
- **Memory insight:** First paragraph to use archetype language (per Source 7, active at 3+ answers but now statistically meaningful at 4 months of density) — "Your Seeker nature keeps surfacing in what you choose."

### Month 5 — Consistency Rewards Itself
- **Screen:** Pattern Insights widget unlocks (Moon Cycle+). Self-care completion ratio becomes a visible personal stat, not just an internal signal.
- **Pulse line:** *"Five months. Consistency is its own reward."*
- **Memory insight:** Leans into the self-care ratio explicitly — "Eight in ten self-care nudges, you took. That's not discipline. That's who you are now."

### Month 6 — Halfway
- **Screen:** This is the visual midpoint — deliberately the first month the Interface Evolution CSS variables (`--evolution-base-opacity`, `--evolution-grid-opacity`, letter-spacing) become perceptible to a first-time visitor comparing screenshots, not just measurable in devtools.
- **Pulse line:** *"Six months. The journey is half-declared."*
- **Memory insight:** A genuine mid-year reflection paragraph — longer than prior months, explicitly framed as "halfway." This is the best candidate for the *first* paragraph a member might screenshot and share.
- **Months unlocked:** `5/12` — and this is the natural point to introduce a secondary framing next to the fraction: not just "5/12" but the existing pulse copy already does this work ("half-declared") — the widget should lean on language, not a progress bar, per the "no metrics for meaning's sake" philosophy in the README.

### Month 7 — Rich Community
- **Screen:** Bridge Builder unlocks Rich Community. Cohort Connect becomes meaningful — enough pattern density exists for genuine matches, not placeholder ones.
- **Pulse line:** *"Seven months in. The system has been listening."*
- **Memory insight:** First paragraph that can reference *seasons* — per the Compression Architecture's location/weather source, a 7-month-old account has crossed at least one seasonal boundary, so "has your tea preference changed with the season?" (already an example in README) becomes a real callback, not a hypothetical.

### Month 8 — Rare Air
- **Screen:** Level 20+ territory — Mood Patterns unlock. Badge density crosses into "rare" glyph tiers.
- **Pulse line:** *"Eight months. Rare air."*
- **Memory insight:** Shortest paragraph of the back half — deliberately terse, matching the "rare air" austerity of the pulse line and the Mode 5 "Compressed Follow-Up" question style (short, precise, high-signal).

### Month 9 — The Habit
- **Screen:** Intimacy/Courage dimensions active — trauma-informed protocol has long been running quietly in the background (since log entry 10), but Month 9 is the point the *interface* can trust the person enough to surface slightly more vulnerable question framing, per doctrine, still "field medic" tone.
- **Pulse line:** *"Nine months. The self-care practice is a habit now."*
- **Memory insight:** Explicitly names the shift from effort to habit — mirroring the pulse line, e.g. "You stopped deciding to check in. You just do."

### Month 10 — Export
- **Screen:** Level 25+ — Export Data unlocks. This is the natural point to introduce the Story-Report as an exportable artifact the person can hold outside the app (per `LOT-AI-PRODUCT-BRIEF.md`'s Story API — `robot`/`vehicle`/`dashboard` targets are the 2036 vision, but a plain PDF/JSON export of "your year so far" is buildable now).
- **Pulse line:** *"Ten months. Almost there."*
- **Memory insight:** Framed as a preview of the year-end synthesis — "Ten months of answers. Here is what they add up to, so far."

### Month 11 — One More
- **Screen:** Level 30+ — full Narrative Reflection unlocks (Depth 66% + Level 30, the last major evolution gate before the ceiling).
- **Pulse line:** *"Eleven months. One more."*
- **Memory insight:** Deliberately restrained — one line, echoing the pulse copy's own restraint. The build-up is saved for Month 12.

### Month 12 — The Portrait Is Complete
- **Screen:** The `machiavelli`-reference state. Public profile now plausibly renders every conditional block in `PublicProfile.tsx` — `boardProfile`, `psychologicalProfile` (non-message branch, full fields), `correlatedIndexes`. Several self-assembly modules read `integrated ◉`.
- **Pulse line:** *"One year with LOT. The portrait is complete — and still evolving."*
- **Memory insight:** The year-synthesis paragraph — generated once, differently from the other 11: it should read the *sequence* of the prior 11 monthly paragraphs (already cached, per §6) as its own input, i.e. a compression-of-compressions. This is the same recursive principle the engine already uses for questions ("each answer compresses the profile... each compressed profile produces a sharper question") applied one level up, to a year of monthly Stories instead of individual Q&A pairs.
- **Months unlocked:** `12/12` — the only month where the widget should visually acknowledge completion (still no confetti; a single state change, e.g. the fraction becomes a completed statement: *"Twelve months. The system has been listening the whole time."*), and then the widget can honorably retire — Month 13 onward doesn't need a counter anymore. The person doesn't need to keep being told they made it; the badge density on their profile now says it silently, permanently.

---

## 5. Two Concrete New Widgets (specced, not built)

### 5.1 Monthly Memory Insight — extends `MonthlyPulseWidget`

Currently `MonthlyPulseWidget` shows a single hand-written line per month plus `X / 12 months`. The proposal is **not** a new widget — it's the same component, with an optional second block that appears only when a cached monthly Story exists:

```
Block label="Month 6:"
  "Six months. The journey is half-declared."      ← existing MONTH_MESSAGES line
  ────────────────────────────────────────────
  "You've written forty-one log entries since      ← new: AI-generated paragraph,
   the spring. Your evening check-ins have moved       same generation path as the
   earlier — 9pm, then 8:15, now 7:40..."              existing weekly Story-Report
  6 / 12 months
```

**Generation mechanics (reuse, don't rebuild):**
- Same code path as `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8 (Story Generation) — Together AI primary, local poetic-fallback if AI unavailable — but windowed to the calendar month rather than the rolling 30-answer window.
- Cached the same way weekly stories already are: `user.metadata.lastMemoryStory` pattern extends to `user.metadata.monthlyStories[monthNumber]`, generated once on month-crossing, never regenerated (matches the existing "cached stories returned immediately when answer count unchanged" rule — here, keyed on month number instead).
- Trigger: same `shouldShowPulse`/`markDismissed` localStorage pattern already in the file — no new infra, just an additional field in the same JSON blob (`{ dismissedMonth, hasSeenInsight }`).
- Fallback if a member had a quiet month (few logs, few check-ins): fall back to the existing single-line message only. Never fabricate density that isn't there — this is the same honesty principle that keeps Month 1 badge-free.

### 5.2 "Months Unlocked" persistent chip

A small, low-emphasis, always-present element (not a modal, not a toast) distinct from the dismissable `MonthlyPulseWidget` — think a line inside the existing System Progress / Architect widget header, not a new `Block`:

```
Months unlocked: 5/12
```

- Uses `capped = Math.min(monthNumber, 12)` exactly as `MonthlyPulseWidget` already computes it — same source of truth, two presentations (one ephemeral/celebratory, one persistent/ambient).
- Only counts *completed* months (never shows partial-month optimism), consistent with §4's Month 2 rule.
- Retires after Month 12 crosses (per §4), the same way the widget itself should stop insisting on a fraction once the fraction is always 12/12 — a completed counter left running forever starts to feel like a debt clock, not an achievement.
- Explicitly NOT a marketing countdown ("3 months until you unlock X!") — per doctrine, the system never dangles a future feature as bait. It only ever reports what has already been earned.

---

## 6. Public Profile as the Visible Trophy Case

The most tangible evolution artifact is not inside the app at all — it's the public profile, because it's the one screen a Month-1 member and a Month-12 member can both look at side by side without needing internal telemetry. `PublicProfile.tsx` already renders every field conditionally:

- `boardProfile.activity` — literally already labeled `journal entries`, `memories compiled`, `active days`. These three numbers are Section 1's bars, already wired to the public face.
- `psychologicalProfile.coreValues` / `.emotionalPatterns` / `.behavioralTraits` via `joinWithDots()` — the badge glyph density from `BADGE_PROGRESSION_PREVIEW.md` (Day 1 plain bullets → Day 100+ triple-glyph clusters) is the same visual proof, already shipping, just needs the 12-month narrative wrapped around it rather than a raw day count.
- `psychologicalProfile.patternStrength` — a numeric trail (`↳ trait: count`) that, read monthly, *is* the compression ratio made literal: fewer distinct traits, higher counts each, exactly matching §5 of the Compression Architecture doc ("more answers produce fewer, more precise questions").
- `correlatedIndexes.composite` — the single number that could anchor a "Year 1 Composite Score" moment at Month 12, if the product wants one headline metric for a screenshot-worthy close. Use sparingly — one number, once a year, not a running leaderboard.

No new fields are strictly required to make the 12-month arc tangible on the public profile — the existing schema already supports it. The gap is purely in *pacing the reveal*: right now these fields render as soon as data exists; the proposal is to keep that (never hide earned data) while using §4's monthly paragraph as the *narration* that makes the growing numbers legible as a story instead of a stat sheet.

---

## 7. Anniversary Badges (new tier, minimal addition)

`badges.ts` already has a 365-day `speedrun_record` (LEGENDARY) and an April-7-founding-day badge (`Perfect Day x7 streak on April 7`). The gap: nothing marks the member's *own* Usership anniversary at intermediate points. Proposed minimal addition, matching existing badge glyph conventions exactly:

| Trigger | Tier | Suggested glyph pattern (theme-consistent) |
|---|---|---|
| Month 3 (quarter) | Common | `⋆·` / `✦·` (matches existing Day-7 tier) |
| Month 6 (half) | Uncommon | `◊·◊` / `✧·✧` (matches existing Balanced tier) |
| Month 9 (three-quarter) | Rare | `∼·∼` / `✦~✧` (matches existing pattern-badge tier) |
| Month 12 (full year, Usership-specific) | Legendary — distinct from the generic 365-day streak badge, because this one is gated on *subscription tenure*, not login streak. A member who missed a few days but never lapsed the subscription still earns it. | New glyph, reserved — should not reuse `speedrun_record`'s mark, to keep "showed up every day" and "stayed a member for a year" as two honestly different achievements. |

This keeps the badge system's own internal honesty intact: a streak badge measures behavior; an anniversary badge measures *tenure*. Conflating them would cheapen both.

---

## 8. What This Document Deliberately Does Not Do

- It does not propose new AI providers, new pricing, or new infrastructure — everything routes through Together AI / the existing Memory Engine, per `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §11.
- It does not propose gamification pressure (streak-shaming, loss-aversion copy, countdown timers to locked features). Every mechanic above is described in terms of what's *already earned*, never what's dangled.
- It does not touch the R&D ($15), Legacy ($3,564/3yr), or Admin ($11,000/9yr) tiers — this is a Usership-tier ($99/mo) document specifically, because that's the tier whose entire value proposition is "the AI that grows with you," per the Product Brief.
- It does not specify exact copy for all 12 monthly insight paragraphs — those should come from the live Memory Story generator per member, not from a template, consistent with the doctrine that "generic questions that could apply to anyone are explicitly forbidden."

---

## 9. Suggested Next Steps (if this brainstorm is picked up for implementation)

1. Extend `user.metadata` schema with `monthlyStories: Record<number, { text: string; generatedAt: number; answerCountAtGeneration: number }>` — mirrors the existing `lastMemoryStory` pattern.
2. Add a server-side monthly windowing option to the existing Story generator (currently windowed by answer count / week) rather than writing a new generator.
3. Extend `MonthlyPulseWidget.tsx` to conditionally render the cached monthly paragraph below the existing hand-written line, with graceful fallback to line-only when the month was quiet.
4. Add the persistent "Months unlocked" chip to `SystemProgressWidget.tsx` or `ArchitectWidget.tsx` header (both already Usership-gated, both already visible to the exact audience this concerns) — no new top-level widget slot needed.
5. Add 4 new badge entries to `badges.ts` per §7, gated on subscription tenure (`user.subscribedAt` / tag history) rather than login streak.
6. QA the Day-1 → Month-12 arc against a synthetic seeded account, and diff its public profile at Month 1, 6, and 12 against `machiavelli`-tier density expectations from §2.

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
