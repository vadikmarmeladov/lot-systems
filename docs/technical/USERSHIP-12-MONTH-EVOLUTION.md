<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Usership: The 12-Month Evolution
## From Barebones Day 1 to LOT® AI — A Story Told Through the UI

**Classification:** DESIGN BRAINSTORM // PRODUCT ARCHITECTURE
**Author:** LOT Systems Corporation
**Session:** Claude Code — scheduled routine
**Authorized by:** S-2 Vadik Marmeladov
**Date:** 5 September 2026
**Status:** PROPOSAL — no code changed in this session
**Reference account:** `lot-systems.com/u/machiavelli` (demo, Usership-tier rendering)

---

## 0. Doctrine

This document does not invent a new gamification system. LOT already has one — an
enormous one: 812+ badges (`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`),
a 7-dimension Interface Evolution engine (`docs/technical/INTERFACE_EVOLUTION.md`), a
12-module Self-Assembly map, a Memory Engine that compresses a user's answers into an
ever-sharper story (`docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`), and a
monthly summary job that already generates a Memory Story digest server-side
(`src/server/utils/monthly-summary.ts`) and a client widget that already counts
`{month} / 12 months` (`src/client/components/MonthlyPulseWidget.tsx`).

**The gap is not features. The gap is sequencing.** A brand-new Usership subscriber on
Day 1 is dropped into a system built for someone who has been here for a year. Nothing
currently tells the story of *why* the UI looks sparse on day one, or *what* it is
building toward. This document proposes the narrative spine that turns twelve months of
real usage-driven growth into a legible, felt arc — using almost entirely what already
exists, plus three small, well-scoped additions.

The framework requested for this session:
1. Scan the repository before every session — done (see §1, cited file paths throughout).
2. Read all the `.md`s — done (README, docs/technical/*, docs/badges/*, docs/assembly/*
   compression-loop spec, docs/corporate feature inventory).
3. Push the session with a detailed `.md` — this file.
4. Focus on 12-month tangibility of compressed Memory delivery — see §3 and §4.

---

## 1. What Already Exists (Ground Truth Audit)

| System | Where | Relevant to this doc because |
|---|---|---|
| **Usership tag** | `src/server/models/user.ts:62-93` — `hasUsershipTag = tags.some(t => t.toLowerCase() === 'usership')` | Gates `memoryEngine: 'ai'`, board profile, architect widget, QR code. No Stripe — tag is assigned manually. Pricing: Free $0 / Usership $99/mo / R&D $15/mo (`docs/corporate/LOT-FEATURE-INVENTORY-2026.md` §16). |
| **Self-Assembly Engine** | `selfAssembly` nanostore, `docs/technical/WIDGETS.md` §System Progress | 12 modules — Biofield Engine, Memory Architecture, Routine Compiler, Intention Core, Cleanness Protocol, Reflection Layer, Community Mesh, Ecosystem Bridge, Quantum Substrate, Nutrition Protocol, Goal Architecture, Archetype Classifier — each moving Dormant → Awakening → Forming → Assembled → Integrated from real QIE signals. **12 modules for 12 months is not a coincidence I'm inventing — it's already the shape of the system.** |
| **Interface Evolution** | `src/client/utils/interfaceEvolution.ts`, `src/client/stores/evolution.ts` | 7 dimensions (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) already gate feature unlocks — Advanced Memory, Planner Templates, Rich Community, Mood Patterns, Intention History, Custom Themes, Widget Arrange, Export Data, Narrative Reflection, Pattern Insights. This *is* the feature-unlock ladder; it just isn't narrated month-by-month. |
| **Memory Engine compression** | `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`, `src/server/utils/memory.ts` | 4 depth levels (Behavior → Motivation → Values → Soul), archetype resolution at 10+ answers, trauma-informed protocol at 10+ logs, `generateMemoryStory()` caches to `user.metadata.lastMemoryStory`. |
| **Monthly job** | `src/server/scheduled-jobs.ts` (`shouldRunMonthlyEmailJob`), `src/server/utils/monthly-summary.ts` | Already runs monthly, already calls `generateMemoryStory()`, already computes OS version (`0.1.0 Initializing → 3.0.0 Integrated`), consistency label, cohort evolution, notable progress. **This is the raw material for the in-app "New Month" moment — it just never surfaces in-app today, only by email.** |
| **MonthlyPulseWidget** | `src/client/components/MonthlyPulseWidget.tsx` | Already exists. Computes `monthNumber = dayjs(now).diff(dayjs(user.joinedAt), 'month')`, shows a canned one-line message per month (1–12) and a literal `{capped} / 12 months` counter. Dismissible, once per calendar month, via `localStorage`. **This is 70% of the "Months unlocked: 3/12" widget already asked for in the brief — it needs deepening, not replacing.** |
| **Badge system** | `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`, `src/client/utils/badges.ts` | 812 badges, rarity tiers COMMON → UNCOMMON → RARE → EPIC → LEGENDARY → MYTHIC → COSMIC. `getLevelSymbol(streak)` renders a single glyph (∘ day 7, ≈ day 30, ≋ day 100) shown on `PublicProfile.tsx`. |
| **PublicProfile.tsx** | `src/client/components/PublicProfile.tsx` | The literal Month-12 target state. Renders (Usership-gated): `boardProfile` (total invested, Citizen Index, board tenure months, biofield state, activity — memories compiled / journal entries / active days, memory engine mode, clearance level), `psychologicalProfile` (archetype + description, self-awareness %, Level glyph, core values, emotional patterns, behavioral cohort, behavioral traits, pattern strength, answer/note counts), `correlatedIndexes` (composite score), Memory Story block, and a QR code gated by `assemblyPhase >= forming`. |
| **Demo account** | `docs/corporate/LOT-FEATURE-INVENTORY-2026.md` line 429: *"Demo Account — Niccolo Machiavelli. Simulated Florence weather."* | `/u/machiavelli` is the codebase's own designated "fully evolved" showcase profile — confirms the brief's instinct to use it as the Month-12 reference. (Live fetch of the URL was blocked by this session's network egress policy; the description below is derived from what `PublicProfile.tsx` renders for a fully-populated Usership profile, which is exactly what a curated demo account exists to show.) |

**Gap confirmed:** there is no `Onboarding.tsx` or "Day 1" branch anywhere. The barebones-to-evolved
transition today happens *implicitly*, through feature-unlock flags with no narration attached
to them. A new Usership subscriber sees an empty Architect widget, a Level-less profile, and a
Memory widget asking generic questions — with nothing in the UI explaining that this is a
beginning, not a ceiling.

---

## 2. Design Principle: Calendar as Narrative Overlay, Not a Gate

`docs/technical/INTERFACE_EVOLUTION.md` already states the house philosophy: *"form follows
progression... features unlock when users demonstrate readiness."* Assembly modules derive
from real QIE signals, not from the calendar. This must not change — a user who journals daily
should out-evolve a user who logs in once a week, regardless of who has been subscribed longer.

So this proposal does **not** add new time-locks. It adds a second, thinner layer on top of the
existing usage-driven one: **subscription tenure narrates and spotlights, it never blocks.**

- Usage-driven progression (badges, assembly phases, evolution dimensions, archetype resolution)
  stays exactly as it is — the substance of growth.
- Tenure-driven narration (which module gets *spotlighted* this month, which affirmation plays,
  what the "New Month" widget says) is the story wrapped around it — the legibility of growth.

A user who is usage-fast will simply see more of their own real badges and assembly progress
inside each month's spotlight than a usage-slow user will — the spotlight reflects back
*whatever is actually true*, it doesn't manufacture false progress.

---

## 3. Three Additions (Small, on Top of What Exists)

### 3.1 `MonthlyPulseWidget` → deepen, don't replace

Today `MONTH_MESSAGES` is a static one-liner per month plus a bare `{n}/12` counter. Proposed
evolution, same component, same file:

- Replace the static string with a short server-composed line built from real data already
  computed by `generateMonthlySummary()` — e.g. month 3's message becomes something like
  *"Three months. \{cohortEvolution\}. \{notableProgress[0] ?? 'The pattern is forming.'\}"*
  rather than the fixed "You have reached Active User status." Requires a thin new endpoint,
  e.g. `GET /api/monthly-pulse`, that returns the same shape `monthly-summary.ts` already
  builds for email, trimmed to `{ monthNumber, headline, memoryStoryExcerpt }`.
- Add a **one-paragraph Memory Story excerpt** beneath the headline — pull the first ~280
  characters of `summary.memoryStory` (already generated monthly, currently email-only). This
  is the literal "Memory widget displays a paragraph-long insight from last month" the brief
  asked for — the generation already exists, it just needs a second delivery surface.
  Cache it the same way `lastMemoryStory` is cached today so it costs no extra AI calls.
- Add a **module spotlight line**: `Assembling this month: {moduleName}` (see §4 mapping below),
  read from the existing `selfAssembly` nanostore's per-module phase — no new computation, just
  a label pointing at data that already exists.
- On dismiss (existing `handleDismiss` flow), if this is the first time `monthNumber` has been
  reached, write a `Log.create({ event: 'usership_month_reached', metadata: { monthNumber } })`
  — this becomes the trigger a new badge (§3.3) and the historical record for §3.2.

### 3.2 Memory Capsule Timeline — extend the Memory Story from "one blob" to "12 chapters"

Currently `user.metadata.lastMemoryStory` holds exactly one cached story, overwritten every
time it regenerates. Proposal: on each `usership_month_reached` event, snapshot the current
`generateMemoryStory()` output into an **append-only** record —
`Log.create({ event: 'memory_capsule', metadata: { monthNumber, story, answerCountAtCapture } })`
— rather than a new table. This turns the Memory Story from a single evolving paragraph into a
scrollable 12-entry timeline: "Month 1 said this about you. Month 12 says this." The delta
between capsule N and capsule N+1 *is* the tangibility the brief is asking for — it's not a
new metric, it's the existing compression engine's own output, kept instead of discarded.

Surface it as a new view on the existing Memory widget (it already cycles
`Memory: → Reflection: → Insights:` per `docs/technical/LOT-STYLE-GUIDE.md` §Clickable Label
Cycling) — add a fourth view, `Chapters:`, that lists the 12 capsules chronologically.

### 3.3 Two new badges, in the existing taxonomy — not a new system

Following the exact pattern of `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`'s
Achievement RPG category (milestone combinations, e.g. `quest_entry` / `quest_complete`):

```
usership_month          ∘→●    COMMON     — usership_month_reached fires (any month 1–11)
usership_year_one       ≋●≋∞   LEGENDARY  — usership_month_reached fires with monthNumber = 12
```

`usership_year_one` is the Month-12 capstone — the moment the profile most resembles
`/u/machiavelli`. No new rarity tier, no new registry file — two entries in `badges.ts` and
`easter-eggs.ts`, same as every other addition in the v1–v32 codex history.

That's the entire net-new surface area: one endpoint, one widget deepened, one new log event,
one append-only capsule pattern, two badges. Everything else in §4 below is *sequencing and
spotlighting* of systems that are already fully built.

---

## 4. The 12-Month Arc

Narrative order for which Self-Assembly module gets **spotlighted** each month (the module
itself still assembles from real signals at its own pace — this is which one the UI *talks
about* that month, chosen so the story matches how a new user actually behaves: body/energy
first, reflection and memory next, intention and routine once a rhythm exists, community and
ecosystem only once there's a self to bring into them, and the psychological/quantum modules
last, once there's enough signal for them to say anything true).

| Mo. | Spotlight module | What becomes newly *narrated* (not newly unlocked — see §2) | Memory Engine state | Badge-tier reality |
|---|---|---|---|---|
| **1** | Biofield Engine | Energy Capacitor + Emotional Check-In framed as "the system learning your baseline." Memory questions still Mode 1 (open, welcoming). MonthlyPulseWidget's first appearance: *"The first month. The system is beginning to know you."* (existing copy — kept, paired with real activeDays/entries). | Depth Level 1 (Behavior) | First milestone badges only (day 7, day 30 in-progress) |
| **2** | Reflection Layer | Journal/note-taking framed as the thing that's "read" — `note` logs already feed `buildPrompt()`. Self-Care Moments widget's `Why This:` view gets emphasized. | Still mostly Level 1–2 | — |
| **3** | Memory Architecture | Archetype resolution typically becomes possible around here (10+ answers per compression architecture §7). First Memory Capsule (§3.2) worth reading back. `psychologicalProfile.archetype` starts rendering on the public profile for the first time. | Archetype + trait extraction activate | Day-30 Level glyph (≈) likely earned |
| **4** | Intention Core | Planner Widget's `plan_set` signals, now with 3 months of history, start producing Goal Journey Widget content (journey stages: beginning → struggle → breakthrough). | Level 2 (Motivation) questions become common | — |
| **5** | Routine Compiler | Self-care completion ratio has enough data to be honestly reported back (`self_care_complete` vs `self_care_skip`), not just suggested. | — | — |
| **6** | Cleanness Protocol | Halfway point. MonthlyPulseWidget: *"The journey is half-declared."* Good moment for the Interface Evolution milestone toast (25%/50% maturity thresholds already exist in `INTERFACE_EVOLUTION.md`) to co-occur with the monthly pulse rather than fire independently. | Level 3 (Values) questions begin appearing | Consistency-tier badges (Week Warrior+) plausible |
| **7** | Community Mesh | Cohort matching (`/api/cohorts`) and Chat Catalyst become relevant — enough behavioral signal exists to match meaningfully. | — | Connection-tier feature unlocks (Bridge Builder) plausible |
| **8** | Ecosystem Bridge | Quantum Engine Connect (Car/Home/Computer) widgets get a narrative hook: "extending the system beyond the screen." | — | — |
| **9** | Nutrition Protocol | Recipe Widget + physiological cohort data (weekly job) have 9 months of seasonal variance to draw on — the "Month 2" Memory Engine seasonal-question example from the README (tea preference changing with season) is now literal, twice over. | Depth Level 4 (Soul) questions become the norm for repeat topics | — |
| **10** | Goal Architecture | Goal Journey Widget can show full-arc stories (beginning through integration), not fragments. | — | Day-100 Level glyph (≋) plausible |
| **11** | Archetype Classifier | Cohort and archetype are now stable, not provisional — `behavioralCohort`, `patternStrength` counts are large enough to be a confident readout, not a guess. | — | `Achievements: N unlocked · M total` (from monthly email growth block) is now a large, honest number |
| **12** | Quantum Substrate (QOS) | Capstone. `usership_year_one` badge fires. Full Memory Capsule timeline (12 entries) becomes browsable. Profile now plausibly resembles `/u/machiavelli`: populated `boardProfile`, `psychologicalProfile`, `correlatedIndexes`, QR code unlocked (`assemblyPhase` realistically at `assembled`/`integrated` by now for an engaged user). MonthlyPulseWidget's existing copy: *"One year with LOT. The portrait is complete — and still evolving."* — already correct, already written, already in the codebase. | Full compression cycle mature | Legacy-tier preview (Weather Station / Wallet blocks, currently demo-only per `isDemo`) becomes the honest Year-Two teaser |

Note what this table is: an **editorial calendar for existing widget copy and spotlight order**,
not a spec for twelve new features. Every cell on the right maps to a file already in this
repository.

---

## 5. Day 1 vs. Month 12 — Concrete Before/After

**Day 1 (today, unnarrated):**
- Tag flips to `Usership` → `hasUsershipTag` true → Memory widget switches to `memoryEngine: 'ai'`
  and starts Mode 1 questions (open, welcoming, per compression architecture §5).
- Subscribe Widget disappears (already subscribed).
- System Progress / Architect widget appears, all 12 modules `Dormant`.
- `psychologicalProfile` block on `/u/{username}` either doesn't render (`hasUsership` true but
  `archetype`/`selfAwarenessLevel` empty) or renders with `Answers: 0 · Notes: 0`.
- `boardProfile.boardTenureMonths` = 0. `MonthlyPulseWidget` doesn't fire yet
  (`dayjs.diff(joinedAt, 'month')` = 0).
- QR code hidden (`assemblyPhase` below `forming`).
- **Nothing on screen tells the user this is Month 0 of 12.** This is the actual gap.

**Month 12 (`/u/machiavelli`-equivalent, per `PublicProfile.tsx`'s own rendering logic):**
- `boardProfile` fully populated: board tenure ~12 months, meaningful "memories compiled,"
  "journal entries," "active days" counts, `Memory Engine: → ai`, a real clearance level.
- `psychologicalProfile`: resolved archetype + description, self-awareness percentage that has
  had a year to compound (per the style guide, this metric grows "months to years," so a year-one
  reading is meant to look like real, hard-won progress, not a maxed-out bar), Level glyph (≈ or ≋),
  populated core values / emotional patterns / behavioral traits / cohort, large `patternStrength`
  and answer/note counts.
- `correlatedIndexes.composite` rendering as a real, non-zero number.
- QR code visible (assembly at `forming` or beyond).
- The `usership_year_one` badge and a 12-entry Memory Capsule timeline exist — a scrollable record
  of how the Memory Story's own language changed month over month, which is the most concrete
  possible evidence of "the person's evolution," because it's the system's own words changing, not
  a synthetic progress bar.
- `isDemo` accounts additionally preview Legacy-tier blocks (Weather Station, Wallet) — already
  wired in `PublicProfile.tsx` — which is the natural cliffhanger into a Year Two the product
  doesn't need to build yet, only gesture at.

---

## 6. Voice Check

`docs/technical/LOT-STYLE-GUIDE.md` (Jan 2026) states "No gamification: no points, badges, or
leaderboards" — this has been overtaken by events; the badge codex has since grown to 812
entries across 8 categories (`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`, Aug
2026). This document treats the *badge system's existence* as settled fact and does not
re-litigate it. What still holds from the style guide, and what everything proposed above must
obey:

- No emojis, no exclamation points, no superlatives ("amazing", "incredible").
- Periods, not checkmarks: "Complete." not "Complete! 🎉"
- Suggestions, not commands; the system observes and narrates, it doesn't cheer.
- Duration format `(N mins)`, action-verb button labels, 2–3 buttons max.

`MonthlyPulseWidget`'s existing copy ("The first month. The system is beginning to know you.")
is already in-voice. Any new month-line or Memory Capsule excerpt should read the same way: flat,
declarative, slightly literary, never congratulatory in tone even when the content is a
celebration.

---

## 7. Open Questions for S-2

1. Should the Memory Capsule (§3.2) be visible to the user only, or should a private/board-only
   comparison view exist (e.g., "your Month 1 story vs. your Month 12 story," side by side) —
   this seems like the single highest-leverage "tangibility" surface in the whole plan, worth
   prioritizing first if only one piece of this ships.
2. `usership_year_one` firing at exactly month 12 assumes uninterrupted tenure. Does a lapsed-then-
   resubscribed Usership member reset to month 0, or does `boardProfile.boardTenureMonths` already
   handle continuity? (Not confirmed in this session — worth checking before implementing the badge
   trigger.)
3. The Legacy-tier teaser at Month 12 (§5) implies a Year Two roadmap this document does not
   attempt to design. Worth a follow-up session once Year One ships and real month-over-month data
   exists to design against.

---

**LOT Systems Corporation**
**Prepared during a scheduled Claude Code session, authorized by S-2 — Vadik Marmeladov**
