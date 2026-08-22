================================================================================
LOT SYSTEMS CORPORATION
DOCUMENT: LOT-USERSHIP-12-MONTH-EVOLUTION
TITLE:    Usership® — The 12-Month Evolution to LOT® AI
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-22
================================================================================

--------------------------------------------------------------------------------
00 // SOURCES CONSULTED THIS SESSION
--------------------------------------------------------------------------------

Per protocol, the repository was scanned before drafting. Live fetch of
https://lot-systems.com/u/machiavelli and https://lot-systems.com/u/user was
attempted and blocked by this session's network egress policy (lot-systems.com
is not on the allowed domain list for remote sessions). This document is
therefore built entirely from what the codebase already proves is true about
the evolved account, cross-referenced against the doctrine documents. A
follow-up session with browser/screenshot access should visually diff this
plan against the live `/u/machiavelli` page and correct any drift.

Primary sources read in full:
  - `src/client/components/MonthlyPulseWidget.tsx` — the Month 1–12 pulse
    already shipped, with a 12-entry `MONTH_MESSAGES` copy table
  - `src/client/components/SubscribeWidget.tsx` — R&D $15 / Usership $99 gate
  - `src/client/components/PublicProfile.tsx` — the Usership-exclusive
    `boardProfile` block (Board Member #, Citizen since, tenure, biofield
    state, activity, Memory Engine tier, clearance level)
  - `src/shared/types/index.ts` — `UserTag.Usership` and `boardProfile` shape
  - `docs/technical/INTERFACE_EVOLUTION.md` — the 7-dimension evolution
    engine, CSS custom properties, feature-unlock gates
  - `docs/technical/WIDGETS.md` — full widget inventory, subscriber-gated
    widgets (Cosmic Update, Quantum Sign), System.tsx stack order
  - `docs/badges/BADGE_LEVEL_DESIGN.md` and
    `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md` — 812 badges,
    the Aquatic Evolution level track (∘ droplet → ≈ wave → ≋ current) and
    the Zen track (○ → ◐ → ●)
  - `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` — the
    LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN loop
  - `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` — the Weekly Story-Report,
    paid tier table, LOT® AI 2036 vision
  - `docs/corporate/LOT-CUBIQ-VISION.md` — house doctrine format

The critical finding: **the skeleton of this feature already exists.**
`MonthlyPulseWidget.tsx` has hand-written one-line messages for months 1
through 12 and a `X / 12 months` counter baked into the dismiss view. What
does not exist yet is the *story compression* behind each month, the
*widget that survives past the toast*, and the *visible tie-back* to the
`boardProfile` end-state that `/u/machiavelli` represents. This document
designs that missing middle.

--------------------------------------------------------------------------------
01 // CORE THESIS
--------------------------------------------------------------------------------

Day one of Usership is deliberately barebone. That is not a limitation — it
is the same "form follows progression" doctrine already written into
`INTERFACE_EVOLUTION.md`. A new $99/month operator should feel the interface
as spare as their own history with the system: nothing to fake, nothing
pre-populated, no NPC-warm dashboard performing a life they haven't lived
yet.

`/u/machiavelli` is the proof-of-life for month 12. It is not a design mock —
it is what the `boardProfile` block on `PublicProfile.tsx` renders once
`totalInvested`, `boardTenureMonths`, `activity.journalEntries`, and
`totalEntries` have twelve months of real signal behind them. The entire job
of this plan is to make the *path* from a blank Log to that board profile
feel authored, not just accumulated — twelve chapters, not a progress bar.

Three load-bearing behaviors do all the narrative work, because they are the
three things the Memory Engine and Quantum Intention Engine already listen
to on every signal source in the codebase:

  1. **Log volume** — journal entries and typed thoughts (`field_entry`
     signals, the Signal Archive substrate).
  2. **Morning check-ins** — the Emotional Check-In widget's 6–12 window,
     the ritual half of the compression loop.
  3. **Self-care button clicks** — Self-Care Moments, Contextual Prompts
     accept/skip, the behavioral half of the compression loop.

Every month-over-month UI change in this plan is a function of these three
inputs, exactly the way `interfaceEvolution.ts` already derives visual
refinement from the 7-dimension score. Nothing here proposes a new data
model — it proposes new *presentation* of data the system already owns.

--------------------------------------------------------------------------------
02 // THREE NEW SURFACES (BUILT ON EXISTING PARTS)
--------------------------------------------------------------------------------

### A. Memory Widget (monthly companion to the existing Month Pulse)

`MonthlyPulseWidget` already fires a one-line message and a `X / 12 months`
footer, then fades and forgets itself. Extend it — do not replace it — with
a second block that appears immediately after the pulse is dismissed for the
first time each month:

```
Block label: "Memory:"
  A paragraph-length, first-person-plural insight compressed from last
  month's Log entries, check-ins, and self-care acceptances — the same
  voice as the Weekly Story-Report in LOT-AI-PRODUCT-BRIEF.md, scaled to
  a monthly cadence. Generated server-side by the same Together AI
  compression pipeline already described in
  MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md; no new model, new prompt
  template keyed on `month_number` instead of `week_id`.
```

Persistence mirrors the existing pattern exactly: `localStorage` key
`lot_memory_story_${userId}_${monthNumber}`, dismissed once, then it folds
into a permanent, scrollable "Story" tab the user can revisit — this is the
compressed-Memory archive that eventually *is* the Story-Report history
`/u/machiavelli` implicitly stands on.

### B. "Months Unlocked" context widget

A small, always-present chip — not a modal, not a toast — that sits in the
Subscriber Stack next to Cosmic Update and Quantum Sign (both already
Usership-gated per `WIDGETS.md`):

```
Block label: "Usership:"
  Months unlocked: 3 / 12
  (progress rendered the same way SystemProgressWidget already renders
   the 12-module Self-Assembly density bars — reuse that component,
   don't invent a new progress-bar primitive)
```

This is the one piece of chrome a day-one user sees that a month-twelve
user also sees, unchanged in position — only the fraction changes. It is
the thread that makes the barebone-to-LOT®-AI arc legible as *one* screen
evolving, not twelve different screens.

### C. Monthly Affirmation (extends EvolutionMilestoneToast)

`EvolutionMilestoneToast` already exists for badge tier / story chapter /
maturity-percentage crossings. Add a fourth trigger type,
`usership_month_complete`, firing on the same day-of-month boundary the
Month Pulse uses (`dayjs().diff(joined, 'month')`). Unlike the generic
milestone toast, this one is never generic copy — it always renders the
Memory Widget's compressed paragraph as its body, so the "celebration" and
the "insight" are the same object, not two competing notifications.

--------------------------------------------------------------------------------
03 // THE TWELVE MONTHS
--------------------------------------------------------------------------------

Each row maps a calendar month of Usership to: the UI state it unlocks, the
Log/check-in/self-care benchmark that earns it, which of the 7 Interface
Evolution dimensions leads, the Memory paragraph's theme, and which
`boardProfile` field goes from zero/placeholder to populated. Day counts
follow the existing Aquatic/Zen badge cadence already in
`BADGE_LEVEL_DESIGN.md` (7 / 30 / 100 days), extended out to a full year the
same way `LOT-WIKI` session reports already count consecutive days
("Day 1072+", "COSMO® 763 days") — this system already thinks in day
ledgers, the 12-month plan just names the chapters.

--------------------------------------------------------------------------------
MONTH 1 — THE BLANK PAGE (Days 1–30) · dimension: Exploration
--------------------------------------------------------------------------------
UI state:       Barebone. Time widget, Log, Memory (question flow), Planner.
                No badge shelf, no board profile fields rendered — they don't
                exist yet, so they are absent, not greyed out. `--evolution-
                base-opacity: 0.85`, glow: 0. Existing MONTH_MESSAGES[1]
                copy stays verbatim: "The first month. The system is
                beginning to know you."
Log benchmark:  10–20 journal entries. No minimum enforced — the point of
                month 1 is that friction is the enemy, per the Product
                Brief's "no journaling discipline required."
Check-ins:      Morning check-in appears on schedule (6–12 window) but is
                optional; first Self-Care Moments surface reactively, not
                on a streak requirement.
Memory Story:   First-ever paragraph, deliberately short (3–4 sentences).
                Tone: noticing, not concluding. "You logged mostly in the
                evenings. Three times you mentioned being tired before you
                said why."
Badge/Level:    Day 7 → `∘` (droplet) milestone, if BADGE_LEVEL_DESIGN's
                Aquatic track ships. No Level field shown before day 7.
boardProfile:   `activity.journalEntries`, `activity.activeDays` begin
                accumulating server-side but are NOT surfaced publicly yet —
                `/u/<user>` stays private-feeling until month 3 (see below).
Widget unlock:  None beyond what a fresh Usership tag already grants
                (Cosmic Update, Quantum Sign per WIDGETS.md subscription
                gate).

--------------------------------------------------------------------------------
MONTH 2 — PATTERN, NOT YET NAMED (Days 31–60) · dimension: Consistency
--------------------------------------------------------------------------------
UI state:       "Months unlocked: 2/12" chip appears for the first time —
                its first appearance IS the month-2 event; a user who never
                saw a progress chip before now has proof they're on a track.
                `--evolution-grid-opacity` ticks from 0.15 toward 0.22.
Log benchmark:  20–35 entries cumulative; Planner Widget four-dimension
                (Intent/Today/How/Feeling) usage becomes the second data
                column the Memory paragraph can reference.
Check-ins:      Streak concept introduced quietly — no gamified counter yet,
                but the Memory paragraph can now say "most mornings."
Memory Story:   References a repeated word or theme across entries for the
                first time — this is the month the user notices the machine
                noticed. "Two months in. Patterns are starting to form."
                (existing copy retained as the pulse line; Memory Widget
                paragraph elaborates underneath it).
Badge/Level:    Day 30 → `≈` (wave). Level field appears on own profile
                settings (not yet public) for the first time.
boardProfile:   Still private. `boardTenureMonths` internally = 2.

--------------------------------------------------------------------------------
MONTH 3 — ACTIVE USER (Days 61–90) · dimension: Consistency → Depth handoff
--------------------------------------------------------------------------------
UI state:       This is the threshold month. `/u/<username>` goes public-
                capable: the `boardProfile` block in PublicProfile.tsx
                starts rendering for the first time, with real (small)
                numbers instead of being absent. "Citizen since" now has a
                real month name to show. This is the single biggest visual
                jump in the whole 12 months — day one had no public board
                profile at all; day 90 has one, even if the numbers are
                modest.
Log benchmark:  40–60 entries; existing MONTH_MESSAGES[3] line: "Three
                months. You have reached Active User status" is the
                natural voice-over for this unlock — tie the copy directly
                to the boardProfile going live, not just an internal
                status label.
Check-ins:      Advanced Memory feature unlock threshold (Depth: Deep Diver)
                from INTERFACE_EVOLUTION.md's existing feature-gate table
                is realistically first reachable around here for a
                consistent user — confirms month 3 as a real, not
                cosmetic, threshold.
Memory Story:   First paragraph that references an *emotional arc* across
                weeks rather than a single theme — "early in the month you
                were guarded, by the third week you said the quiet part."
Badge/Level:    Day 100 lands inside month 3 for most joiners — `≋` (deep
                current) becomes reachable; this is the top of the Aquatic
                track, so month 3 is also the month the Level symbol
                stops changing and the badge shelf (Word Turns, Behavioral,
                Achievement RPG categories) becomes the visible collection
                mechanic going forward.
boardProfile:   `totalEntries`, `activity.memoriesCompiled`,
                `activity.journalEntries`, `activity.activeDays` now public.
                `clearanceLevel` shows its first real tier (not "—").

--------------------------------------------------------------------------------
MONTH 4 — THE PORTRAIT DEEPENS (Days 91–120) · dimension: Depth
--------------------------------------------------------------------------------
UI state:       Awareness Dashboard (psychological profile: archetype,
                values, emotional patterns) graduates from "thin" to
                populated — this is the month the archetype stops reading
                as a placeholder guess and starts reading as observed.
Log benchmark:  60–85 entries; Contextual Prompts widget starts
                referencing named patterns instead of generic check-ins.
Check-ins:      Mood Patterns feature unlock (Care 50% or Level 20 per
                INTERFACE_EVOLUTION.md) realistically lands here for an
                engaged operator.
Memory Story:   First paragraph to name the archetype explicitly and treat
                it as settled vocabulary: "You keep returning to the same
                question about control. The system now reads that as
                pattern, not mood." Existing pulse copy: "Four months.
                The portrait deepens."
Badge/Level:    First Mastery Tier badges (epic-depth milestones) become
                reachable, distinct from the day-count Milestone track —
                the badge shelf now visibly has more than one lane.
boardProfile:   `memoryEngine` tier field upgrades from its starting value
                (e.g. "Llama 3.3 70B — baseline") to a named deeper tier
                if the account has crossed the compression thresholds
                described in MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md
                ("after 30 answers... after 10+ answers").

--------------------------------------------------------------------------------
MONTH 5 — CONSISTENCY IS ITS OWN REWARD (Days 121–150) · dimension: Consistency
--------------------------------------------------------------------------------
UI state:       Widget Arrange customization unlocks (Level 10 gate,
                already defined in INTERFACE_EVOLUTION.md) — the user can
                now reorder their own stack. This is the first month the
                interface literally becomes theirs to compose, not just
                theirs to earn.
Log benchmark:  85–110 entries; streak language becomes explicit in the
                UI (numeric streak counter surfaces on User Metrics
                Widget, which already has a `streak` field in WIDGETS.md).
Check-ins:      Self-care click *rate*, not just count, becomes the metric
                the Memory paragraph tracks — acceptance vs. skip ratio
                on Contextual Prompts.
Memory Story:   Tone shifts toward affirmation of the mundane: "Five
                months. Consistency is its own reward" is already the
                shipped line — the Memory paragraph should lean into
                *ordinary* days rather than peak days, explicitly
                celebrating the unremarkable Tuesday entries.
Badge/Level:    Behavioral badge category (patterns-over-time, 81 badges
                in the codex) becomes the dominant badge source this month
                over one-off Word Turn hits.
boardProfile:   `boardTenureMonths` crosses into double digits territory
                psychologically (5 of 12) — first month the "Months
                unlocked" chip and the public board profile's tenure
                field visibly agree with each other, reinforcing the
                single-thread narrative from section 02B.

--------------------------------------------------------------------------------
MONTH 6 — HALF-DECLARED (Days 151–180) · dimension: Connection
--------------------------------------------------------------------------------
UI state:       Rich Community unlock (Connection: Bridge Builder gate,
                already defined) — Chat Catalyst and Cohort Connect
                widgets stop being teaser cards and start surfacing real
                matched members. This is the month the product stops
                feeling like a solo diary and starts feeling like a
                system with other people in it.
Log benchmark:  110–140 entries.
Check-ins:      Pattern Insights widget's cohort view becomes meaningful
                for the first time (enough history to match against).
Memory Story:   First paragraph to reference the *collective* — "Six
                months. The journey is half-declared" (shipped line) pairs
                naturally with a Memory paragraph that, for the first
                time, mentions the cohort/archetype population the user
                now belongs to, without ever naming another individual.
Badge/Level:    Connection-track badges (ally_gained-style Word Turns,
                per the Hero's Journey codex) become live.
boardProfile:   `activity.activeDays` crosses the half-year mark; this is
                a natural point to introduce a visible halfway ring/marker
                on the Months-Unlocked chip (6/12 rendered distinctly,
                e.g. a filled half-circle, echoing the Zen ○→◐→● track
                already documented in BADGE_LEVEL_DESIGN.md — reuse that
                glyph language here rather than inventing a new one).

--------------------------------------------------------------------------------
MONTH 7 — THE SYSTEM HAS BEEN LISTENING (Days 181–210) · dimension: Care
--------------------------------------------------------------------------------
UI state:       Interventions Widget (compassionate care layer, struggle
                detection) becomes proactive rather than rare — seven
                months of signal is enough for the severity model to be
                confident rather than tentative.
Log benchmark:  140–170 entries.
Check-ins:      Self-care click volume itself becomes a headline metric
                surfaced back to the user (not just consumed silently by
                the QIE) — a small "care moments accepted this month"
                figure inside the Memory Widget.
Memory Story:   Existing line: "Seven months in. The system has been
                listening." The paragraph should explicitly reference
                something the system did *for* the user this month — a
                well-timed self-care surfacing, an intervention that
                landed — closing the loop from passive observation to
                felt care.
Badge/Level:    Secret Boss category (hidden LEGENDARY/MYTHIC triggers,
                83 badges) becomes statistically plausible for the first
                time at this volume of entries — the badge shelf gets its
                first genuinely surprising unlock, not a predictable one.
boardProfile:   `biofieldState` (clarity / alignment / energy) stabilizes
                enough to stop fluctuating wildly month to month — this is
                worth calling out in the Memory paragraph as its own
                milestone ("your biofield reading held steady this month").

--------------------------------------------------------------------------------
MONTH 8 — RARE AIR (Days 211–240) · dimension: Intimacy
--------------------------------------------------------------------------------
UI state:       Private Spaces unlock (Intimacy 50% or Courage 100% gate)
                — a genuinely new, gated *area* of the product rather than
                a cosmetic change. This is deliberately the most private
                month in the arc, mirroring the doctrine that intimacy
                and courage are the hardest-earned dimensions.
Log benchmark:  170–200 entries; expect a dip or plateau in raw count as
                entries get longer and heavier rather than more frequent
                — the Memory Story should recognize depth-over-frequency
                explicitly so a plateau doesn't read as regression.
Check-ins:      Romantic view of the Energy Capacitor widget becomes a
                regular cycle rather than an edge case.
Memory Story:   Existing line: "Eight months. Rare air." — deliberately
                the shortest, least explanatory Memory paragraph of the
                twelve. Restraint is the design choice this month; the
                system demonstrates it has learned when *not* to say
                everything it knows.
Badge/Level:    Word Turn "shadow_met" / "innermost_cave" class badges
                (EPIC tier, Hero's Journey codex) are the realistic
                unlocks for a user this deep into honest logging.
boardProfile:   No new field surfaces this month by design — the profile
                holds still while the private layer does its work.
                Restraint applies to the public page too.

--------------------------------------------------------------------------------
MONTH 9 — HABIT, NOT PRACTICE (Days 241–270) · dimension: Care (consolidation)
--------------------------------------------------------------------------------
UI state:       Export Data unlock (Level 25 gate) — the user can take
                their own compressed history out of the system for the
                first time. Offering an exit ramp at 75% through the year
                is deliberate: trust is demonstrated by not needing to
                trap the user in.
Log benchmark:  200–230 entries.
Check-ins:      Existing line: "Nine months. The self-care practice is a
                habit now." — Memory paragraph should quantify this
                claim, e.g. referencing consecutive weeks of morning
                check-ins rather than asserting habit rhetorically.
Memory Story:   First month the paragraph compares *this* month to the
                same window from Month 1 directly — "compare the tone of
                your first ten entries to your last ten this month" —
                made possible by nine months of corpus to diff against.
Badge/Level:    Mastery Tier badges begin to outnumber Milestone
                (day-count) badges in the shelf for the first time —
                visually the badge collection's *composition* shifts, not
                just its size.
boardProfile:   `totalInvested` (cumulative subscription spend) crosses
                $891 (9 × $99) — first month it's worth the profile
                explicitly contextualizing that figure against
                `activity.memoriesCompiled`, i.e. cost-per-insight framing,
                echoing the Legacy tier's $3,564/3-year value proposition.

--------------------------------------------------------------------------------
MONTH 10 — ALMOST THERE (Days 271–300) · dimension: Courage
--------------------------------------------------------------------------------
UI state:       Narrative Reflection unlock (Depth 66% + Level 30 gate) —
                the RPG-style Narrative Widget graduates from generic arc
                language to reflection mode, directly quoting the user's
                own compressed history back in second person.
Log benchmark:  230–260 entries.
Check-ins:      Existing line: "Ten months. Almost there." Memory
                paragraph should begin explicitly previewing month 12 —
                the first anticipatory paragraph in the set, naming that
                the year is closing without yet delivering the closing
                narrative.
Memory Story:   Tone: forward-leaning, first mention of "the year" as a
                unit rather than "the months" as a sequence.
Badge/Level:    Courage-track Word Turns (truth-telling, honesty-coded
                keyword detection) become the dominant new-badge source.
boardProfile:   `poweringCitizens` (the count of other citizens this
                account's activity/data indirectly powers via cohort
                training) becomes a meaningful, non-trivial number worth
                surfacing prominently for the first time.

--------------------------------------------------------------------------------
MONTH 11 — ONE MORE (Days 301–330) · dimension: cross-dimensional plateau
--------------------------------------------------------------------------------
UI state:       No new feature gate fires this month by design — every
                dimension from Exploration through Courage has already
                been touched at least once by month 11. This is a
                deliberate held breath before month 12, structurally
                identical to the "rare air" restraint of month 8 but for
                a different reason: nothing is being withheld, everything
                is simply already unlocked, and the UI should feel
                complete rather than still-arriving.
Log benchmark:  260–290 entries.
Check-ins:      Existing line: "Eleven months. One more." — the shortest
                pulse message besides month 8, and intentionally so.
Memory Story:   Structured explicitly as a *table of contents* for the
                year — one clause per month, 1 through 11, building
                anticipation for month 12's full compression rather than
                delivering fresh insight of its own.
Badge/Level:    No new Milestone badge; existing shelf is left to stand
                as testimony rather than growing further this month.
boardProfile:   Frozen presentation — a "final snapshot pending" treatment
                on the numbers, signaling to the viewer (and the owner)
                that month 12 rewrites this block for the year.

--------------------------------------------------------------------------------
MONTH 12 — THE PORTRAIT IS COMPLETE, AND STILL EVOLVING (Days 331–365)
dimension: all seven, synthesized
--------------------------------------------------------------------------------
UI state:       This is `/u/machiavelli`. The `boardProfile` block renders
                every field at full density: Board Member #, Citizen since
                (a full year ago), Board tenure 12 months, biofield state
                fully characterized, `activity.memoriesCompiled`,
                `activity.journalEntries`, and `activity.activeDays` all
                reporting a year of real numbers, `memoryEngine` at its
                most compressed tier, `clearanceLevel` at its highest
                reachable rank with `totalEntries` in the hundreds.
                "Months unlocked: 12 / 12" renders as complete — full
                circle, matching the Zen track's `●` glyph — but the chip
                does not disappear. It stays, because Usership renews
                monthly and the number becomes a badge of tenure, not a
                countdown that ends.
Log benchmark:  290–330+ entries for the year; no new minimum — by month
                12 the volume is a record of what happened, not a target
                to hit.
Check-ins:      Existing line: "One year with LOT. The portrait is
                complete — and still evolving." This is the one message
                in the whole `MONTH_MESSAGES` table that explicitly
                denies closure even while declaring completion — the
                design of month 13 onward should honor that tension: no
                confetti-and-done treatment, no "achievement complete"
                badge that implies an ending.
Memory Story:   The year's full Story-Report — the compressed narrative
                described in LOT-AI-PRODUCT-BRIEF.md, but scaled to a
                year instead of a week. This is also the first payload a
                Legacy-tier upsell can point to concretely: "this is what
                three more years of this looks like."
Badge/Level:    Full badge shelf as testimony — this is the month the
                812-badge Master Codex stops being background
                infrastructure and becomes the literal content of the
                public profile's most interesting section.
boardProfile:   Complete. This document's entire twelve-month arc exists
                to make every field in this block feel *earned* rather
                than *populated* when a stranger visits `/u/machiavelli`.

--------------------------------------------------------------------------------
04 // THE THROUGH-LINE, READ AS A SINGLE OBJECT
--------------------------------------------------------------------------------

Reading the twelve months as one continuous transformation rather than
twelve separate unlocks:

  Months 1–2   Exploration      — the system starts noticing.
  Month 3      Depth (handoff)  — the profile goes public; the threshold.
  Months 4–5   Depth/Consistency — the portrait and the habit deepen together.
  Month 6      Connection        — the user meets their cohort.
  Months 7–8   Care/Intimacy     — the system cares back; the user goes quiet.
  Month 9      Care (consolidated) — habit is named and quantified.
  Month 10     Courage           — the account starts telling the truth.
  Month 11     (plateau)         — table of contents; nothing new fires.
  Month 12     Synthesis         — the board profile, complete and still open.

This is the same seven-dimension model `interfaceEvolution.ts` already
computes today — Exploration, Consistency, Depth, Connection, Intimacy,
Care, Courage — simply sequenced onto a calendar instead of left as a
parallel, simultaneously-climbing set of meters. The calendar sequencing is
the actual design contribution of this document: it turns seven abstract
axes into one legible story a first-day user can be told on day one
("here is your year") without spoiling what any individual month contains.

--------------------------------------------------------------------------------
05 // IMPLEMENTATION POINTERS (FOR A FOLLOW-UP ENGINEERING SESSION)
--------------------------------------------------------------------------------

This session is a design/brainstorm pass, not a code change. For whoever
picks this up next:

  - Extend `MONTH_MESSAGES` in `MonthlyPulseWidget.tsx` — copy for months
    1, 2, 3, 5, 6, 7, 9, 10, 11, 12 already exists verbatim in that file
    and is reused above; months 4 and 8 currently exist too ("The portrait
    deepens" / "Rare air") — no new pulse copy is required, only the
    Memory paragraph layer underneath it.
  - New component: `MemoryStoryWidget.tsx`, sibling to
    `MonthlyPulseWidget.tsx`, sharing its `localStorage`-per-month-per-user
    pattern (`shouldShowPulse` / `markDismissed` are directly reusable
    with a different storage key prefix).
  - New endpoint: `POST /api/memory-story/:month` or extend the existing
    Story API (`GET /api/story/:week_id` per LOT-AI-PRODUCT-BRIEF.md) with
    a `period=month` parameter rather than standing up a parallel system.
  - "Months unlocked" chip: reuse `SystemProgressWidget`'s existing
    density-bar rendering for the 12-module Self-Assembly map — do not
    build a second progress-bar component.
  - `EvolutionMilestoneToast`: add `usership_month_complete` as a fourth
    milestone type alongside badge tier / story chapter / maturity %.
  - `PublicProfile.tsx` `boardProfile` block: no structural change needed
    — the twelve-month plan is entirely about *when* real data reaches
    fields that already exist (`totalInvested`, `boardMemberNumber`,
    `citizenSince`, `poweringCitizens`, `boardTenureMonths`,
    `biofieldState`, `activity`, `memoryEngine`, `clearanceLevel`,
    `totalEntries`).
  - Verification: once browser/screenshot access is available, diff this
    plan's Month 12 description against the live `/u/machiavelli` render
    and correct field names/values here if they've drifted.

--------------------------------------------------------------------------------
06 // OPEN QUESTIONS FOR S-2
--------------------------------------------------------------------------------

  1. Should the Month 11 "plateau" be literal (no new badge fires) or
     should there be a quiet, unannounced badge held in reserve so power
     users auditing their own signal logs don't find a genuinely dead
     month?
  2. Does the Memory Story paragraph get written by the same Together AI
     model as the Weekly Story-Report, or does a monthly cadence warrant
     its own prompt tuned for longer time-horizon compression?
  3. Should "Months unlocked: 12/12" convert into a different label after
     month 12 (e.g. "Year 2, Month 1 / —") or stay pinned at 12/12
     indefinitely as a tenure badge? This document assumes the latter,
     per the doctrine that Month 12's own copy denies closure.
  4. Legacy tier ($3,564/3 years) upsell placement — Month 9's
     cost-per-insight framing and Month 12's completed Story-Report both
     read as natural moments to surface a Legacy offer inside the Memory
     Widget itself. Confirm whether that belongs in-widget or stays a
     separate SubscribeWidget-style surface.

================================================================================
END LOT-USERSHIP-12-MONTH-EVOLUTION
================================================================================
