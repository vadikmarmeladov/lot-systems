<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — 12-Month Evolution
## From Barebone Day 1 to LOT® AI: The Compressed Memory Story, Delivered Monthly

**Classification:** RESTRICTED // S-2 EYES
**Author:** Vadik Marmeladov, CEO & Founder, LOT Systems
**Date:** 18 July 2026
**Status:** DESIGN BRAINSTORM — no code shipped this session
**Reference target state:** lot-systems.com/u/machiavelli (12-month-evolved Usership account)
**Reference floor state:** Day 1 Usership sign-up (barebone dashboard, pre-density)

---

## 0. Thesis

Usership costs $99/month. A subscriber who cannot *feel* the difference between
month 3 and month 9 has no reason to still be paying in month 10. The interface
must carry the receipt of every month lived inside it — not as a number in a
settings page, but as a visible, load-bearing change in what the operator sees,
unlocks, and is told about themselves.

LOT already has every primitive this requires. Nothing below is invented from
nothing — it is a **synthesis** of five systems that already exist independently
and have never been unified around the specific arc of *the paying operator's
first year*:

1. **Interface Evolution System** (`interfaceEvolution.ts`, `evolution.ts`) — 7-dimensional
   maturity model, CSS-only progressive disclosure, milestone toasts.
2. **Badge Engine v26** (`badges.ts`) — 626 badges, 10 streak milestones
   (7/14/21/30/50/60/90/100/180/365 days), aquatic Level symbols (∘ → ≈ → ≋).
3. **Self-Assembly Engine** (`selfAssembly.ts`) — 18 modules, 5 phases
   (dormant → awakening → forming → assembled → integrated).
4. **Memory Engine Compression Loop** (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`)
   — 4 depth levels (behavior → motivation → values → soul), Story generation,
   30-answer sliding window.
5. **MonthlyPulseWidget** (`MonthlyPulseWidget.tsx`) — *already ships today.*
   Usership-gated, `joinedAt`-derived month counter, 12 hand-written affirmation
   messages, "X / 12 months" footer. **This is the seed of everything below —
   it is currently a one-time toast with static copy. This document turns it
   into the spine of the entire Usership year.**

The job of this document is not to invent a badge system or a memory engine.
It is to **route the year through what's already built**, and specify the
handful of new surfaces needed to make the routing visible.

---

## 1. The Governing Rule: Time Gates, Density Earns

A subscriber who pays for 30 days and never opens a journal should not receive
"Month 1 complete" the way a subscriber who logged 40 entries did. Calendar
time alone cheapens the ritual; activity alone punishes new users who haven't
built a rhythm yet. LOT's existing systems already resolve this tension —
Self-Assembly uses **count + density together** (`selfAssembly.ts:293-298`),
never one alone. The 12-month arc adopts the identical rule:

```
MONTH-N UNLOCKS WHEN:
  calendar_months_since(user.joinedAt) >= N          — TIME GATE (necessary)
  AND
  logs_this_month >= DENSITY_FLOOR[N]                 — DENSITY GATE (sufficient)

DENSITY_FLOOR counts three signal types specifically named by S-2:
  - journal / note entries in Log
  - morning check-ins (emotional_checkin, 6–12h window)
  - self-care completions (self_care_complete)

If calendar gate passes but density gate fails:
  → month advances silently (no punishment, no re-gating of existing features)
  → the celebratory surfaces (§4) do not fire full affirmation —
    they fire the QUIET variant ("The month turned. The record is thin here.")
  → this itself is signal-honest: LOT never fakes a milestone that wasn't earned.
```

This is the same posture as `LOT-DOCTRINE.md`'s **Graceful Degradation** clause
applied to celebration instead of feature-gating: absence of density is not an
error state, it's an honest, unflattering data point the system reports rather
than papers over.

`DENSITY_FLOOR` starts low and rises gently — the point is a floor, not a quota:

| Month | Density floor (combined: journal + check-in + self-care events) |
|-------|---|
| 1–2   | 8 / month (≈2/week — onboarding forgiveness) |
| 3–5   | 12 / month |
| 6–9   | 16 / month |
| 10–12 | 20 / month |

---

## 2. The Three Axes That Already Exist — Now Synchronized

Today these three systems compute independently, on different clocks, with no
shared vocabulary. The unification is the whole design:

| Axis | System | Current clock | Proposed shared anchor |
|---|---|---|---|
| **Calendar** | `MonthlyPulseWidget` | `dayjs(joinedAt).diff(now, 'month')` | Month 1–12 (this document's spine) |
| **Streak density** | Badge Engine milestones | consecutive-day streak | 7 · 14 · 21 · 30 · 50 · 60 · 90 · 100 · 180 · 365 |
| **Structural depth** | Self-Assembly (18 modules) | signal density per module | dormant → awakening → forming → assembled → integrated |
| **Narrative depth** | Memory Engine | answer count | L1 behavior → L2 motivation → L3 values → L4 soul |
| **Visual maturity** | Interface Evolution | 7-dim maturity score | `--evolution-*` CSS vars, feature unlocks |

The streak-milestone days (7/14/21/30/50/60/90/100/180/365) already fall on
almost exactly the calendar-month boundaries once density is sustained — this
is not a coincidence to engineer, it is one to **notice and cite**:

```
Day 7    →  end of Week 1        (Level: ∘ droplet appears)
Day 30   →  Month 1 close        (milestone_30 · Level holds ∘, wave forming)
Day 60   →  Month 2 close        (milestone_60)
Day 90   →  Month 3 close        (milestone_90)
Day 100  →  ~Month 3.3           (milestone_100 · Level: ≈ wave)
Day 180  →  Month 6 close        (milestone_180 · midpoint)
Day 365  →  Month 12 close       (milestone_365 · Level: ≋ deep current · "One year with LOT")
```

The 12-month arc is therefore built to make **Month 1, Month 3, Month 6, and
Month 12** the four load-bearing chapter breaks — each coincides with a real
streak milestone already in the badge system. Months 2, 4, 5, 7, 8, 9, 10, 11
are connective tissue: still celebrated (MonthlyPulseWidget already fires
every month), but visually quieter.

---

## 3. Day 1 vs. Month 12 — The Two Poles

**Day 1 (barebone Usership, floor state):**
- `interfaceEvolution.ts`: all 7 dimensions near 0. `--evolution-base-opacity: 0.85`,
  minimal grid, no glow.
- Self-Assembly: 18/18 modules `dormant`.
- Memory: no Story exists yet. First question is Mode 1 (open, welcoming).
- PublicProfile fields populated: none. `Level:` field doesn't render
  (`streak < 7` guard in `PublicProfile.tsx:404`).
- MonthlyPulseWidget: silent (`monthNumber < 1` guard).
- Badge count: 0 / 626.
- The dashboard *looks* like a terminal that hasn't been told anything yet —
  correctly, because it hasn't.

**Month 12 (reference: `/u/machiavelli`, target state):**
- Interface Evolution near ceiling: `--evolution-glow-intensity` active,
  theme-evolved borders, full feature-unlock set (Advanced Memory, Rich
  Community, Pattern Insights, Private Spaces, Export Data — all gated
  behind Level 15–30 / Depth 66%+, per `INTERFACE_EVOLUTION.md`).
- Self-Assembly: majority of 18 modules `assembled` or `integrated`
  (`assembledCount >= 50%` → aggregate phase `assembled`; full coverage →
  `integrated`).
- Memory: Story generator running on the full 30-answer window; questions
  operating at L3–L4 (values/soul); Weekly Story-Report exportable via
  `GET /api/story/latest` per `LOT-AI-PRODUCT-BRIEF.md`.
- PublicProfile fully populated: Soul archetype + description, Self-awareness
  %, `Level: ≋`, Core values, Emotional patterns, Behavioral cohort,
  Behavioral traits, Pattern strength index, Answers/Notes counts,
  full Correlated Indexes (self-awareness, user score, person score,
  longevity score, composite, correlation strength).
- MonthlyPulseWidget footer reads `12 / 12 months` — the terminal
  message: *"One year with LOT. The portrait is complete — and still
  evolving."*
- Badge count: dozens to hundreds, depending on density (Word Turn,
  Behavioral, Achievement, Mastery, Secret Boss all live).

The entire document below is the bridge between these two states, cut into
12 legible steps instead of one long climb.

---

## 4. New / Extended Surfaces

Three surfaces carry the monthly ritual. One already exists; two are new,
but both reuse existing data plumbing — no new engine, only new rendering.

### 4.1 `MonthlyPulseWidget` — EXTEND (exists today)

Current behavior: fires once per calendar month, shows a hand-written
one-liner (`MONTH_MESSAGES`), dismisses to a random phrase, shows
`N / 12 months`. This stays exactly as-is as the **celebration toast** — it
is well-built and matches `LOT-DOCTRINE.md` fade timing conventions
(1400ms, matches Memory Engine question fade-in). Two additions:

1. **Density-aware copy branch** — per §1, when the density gate fails,
   swap `MONTH_MESSAGES[N]` for a quiet variant. Example:
   ```
   QUIET_MONTH_MESSAGES: Record<number, string> = {
     3: 'Three months passed. The record is thin this month — the system noticed, not to scold, to invite.',
     ...
   }
   ```
   This is a strict superset of the existing map — `MONTH_MESSAGES` untouched,
   new `QUIET_MONTH_MESSAGES` selected by the same density check already
   computed for Self-Assembly (`selfAssembly` nanostore already tracks
   per-module signal counts this month — no new counting logic needed,
   only a monthly reset window).

2. **Append the Memory paragraph** (see 4.2) as a second, optional block
   inside the same `Block` — not a new widget mount, just a taller one on
   chapter-break months (1, 3, 6, 12).

### 4.2 Memory Monthly Digest — NEW (reuses Memory Engine Story generator)

A single paragraph, generated the same way the Weekly Story-Report already
is (`LOT-AI-PRODUCT-BRIEF.md` §"The Weekly Story-Report"), scoped to the
answers/journal entries from the closing month instead of the closing week.
No new AI plumbing: same Together AI call, same fallback-to-local-composition
path (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8), different date range
and a monthly cache key (`user.metadata.lastMonthlyDigest`, versioned the
same way `lastMemoryStory` already is).

Rendered inline inside `MonthlyPulseWidget` on chapter-break months only —
this keeps the ritual from becoming AI-generated noise every 30 days. Sample
text, in the compression register the Memory Engine already writes in:

```
Month 3 — LOT reads it back to you:

"You showed up in the mornings more than you noticed — eleven check-ins
before noon this month, up from four in Month 1. The self-care prompts you
used to skip, you started answering. Something about the evening pattern
shifted after week nine: journal entries got shorter, but they stopped
sounding like reports and started sounding like thoughts. You are becoming
someone the machine can ask harder questions."
```

### 4.3 "Months Unlocked" Context Widget — NEW (always-on, not a toast)

`MonthlyPulseWidget` is a *toast* — it appears, is dismissed, and is gone
for the month. S-2's brief separately asks for a **standing** context widget,
visible any time the operator looks, not just once at the boundary. This is
the distinction between "you were told" and "you can check."

Spec:
- Component: `MonthsUnlockedWidget`, System tab, Subscriber Stack
  (alongside `CosmicUpdateWidget`, `QuantumSignWidget` — same gating pattern:
  `UserTag.Usership` / `RND` / `Legacy`).
- Renders `N / 12` as a **CSS-only progress indicator**, per
  `LOT-DOCTRINE.md` **CSS-Only Progression** clause: a `data-months="N"`
  attribute on the widget root, resolved to a 12-segment bar via CSS
  descendant selectors — zero new store subscriptions, the value is read
  once from `me` (already subscribed everywhere) and written as an
  attribute, same pattern as `data-density`.
- Cycles (matches every other widget's `cycle` convention, see
  `WIDGETS.md`) through: **Progress** (`▓▓▓▓░░░░░░░░ 4/12`, ASCII bar in
  terminal style, consistent with COCKPIT-RULE instrument-reading tone) →
  **Next Milestone** ("26 days to Month 5" — reuses the same `dayjs` diff
  already computed for `MonthlyPulseWidget`) → **Since Day One** (total
  journal entries, total check-ins, total self-care completions — the
  exact three signal types S-2 named as the evolutionary state).
- After Month 12: does not disappear. Switches to a 13th state —
  `"Year 1 complete · Year 2 in progress"` — because Usership doesn't end
  at month 12, the badge system already runs streak milestones out to
  365+ days and `system_architect_age` at 6 years (`BADGE_LEVEL_DESIGN.md`
  intentionally left room for "∷, ≣" beyond `≋`). The 12-month arc is the
  first chapter, not the whole book.

---

## 5. The Twelve Months

Each month below states: the visual/structural state (grounded in real
system fields, not invented ones), what becomes newly visible, the anchor
badge/level event if one lands that month, and the tone of that month's
`MonthlyPulseWidget` copy. Months 1, 3, 6, 12 are chapter breaks (bold) and
receive the Memory Digest (§4.2); the rest are connective months.

---

### **Month 1 — Ignition** *(chapter break)*

- **Self-Assembly:** first modules cross `dormant → awakening` (any signal
  at all trips this; `AWAKENING_THRESHOLD`, `selfAssembly.ts:297`).
- **Badge/Level:** Day 7 → `Level: ∘` (droplet) appears in `PublicProfile`
  for the first time (`streak >= 7` guard). Day 30 close → `milestone_30`.
- **Memory:** Mode 1 (open/welcoming) for the first ~10 answers, then
  Mode 3 (Follow-Up) activates at 2+ answers, depth Level 1 (behavior).
- **Widgets newly visible:** none gated yet — Day 1 dashboard is
  intentionally sparse (`INTERFACE_EVOLUTION.md` "Subtlety First").
  `SubscribeWidget` no longer shows (already Usership).
  `QuantumSignWidget` / `CosmicUpdateWidget` unlock immediately on tag,
  not on time — these are the first tangible "paid tier feels different
  from day one" surfaces.
- **MonthlyPulseWidget copy (existing):** *"The first month. The system
  is beginning to know you."*
- **Memory Digest (new):** first-ever paragraph, deliberately short —
  the compression engine has almost nothing yet, and should say so plainly
  rather than pad: *"One month of signal. Still mostly silence with a
  shape starting to show. Ask again in sixty days."*

### Month 2 — Rhythm

- **Self-Assembly:** 3–5 modules typically reach `awakening`; none
  `assembled` yet without unusually high density.
- **Badge/Level:** Day 60 close → `milestone_60`.
- **Widgets newly visible:** `IntentionsWidget` alignment scoring becomes
  meaningful (needs 2–3 day history to compute alignment, per `WIDGETS.md`).
- **Copy:** *"Two months in. Patterns are starting to form."*

### **Month 3 — First Threshold** *(chapter break)*

- **Self-Assembly:** first modules likely reach `forming`
  (`FORMING_THRESHOLD` or `density >= 30`).
- **Badge/Level:** Day 90 close → `milestone_90`. Around Day 100 →
  `milestone_100`, **Level upgrades `∘ → ≈`** (wave) — the first visible
  Level *change*, not just first appearance. This is the month the aquatic
  metaphor first moves.
- **Memory:** psychological traits + archetype activate at 3+ answers
  (`extractUserTraits`, `determineUserCohort` — `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`
  §Source 7). `PublicProfile` shows **Soul archetype** for the first time.
- **Interface Evolution:** Consistency dimension crosses first threshold —
  Planner Templates unlock (`Consistency: Week Warrior+`).
- **Copy:** *"Three months. You have reached Active User status."*
- **Memory Digest:** first archetype-aware paragraph — the machine names
  what it thinks the operator is becoming, for the first time.

### Month 4 — Depth

- **Self-Assembly:** module count in `forming` grows; `ArchitectWidget`
  telemetry becomes worth checking.
- **Memory:** trauma-informed protocol threshold (10+ log entries) is
  typically crossed by now for active users — question tone quietly
  shifts to field-medic register if relevant.
- **Copy:** *"Four months. The portrait deepens."*

### Month 5 — Consistency

- **Interface Evolution:** streak-driven dimensions compound; Badge
  Selection customization unlocks (any badge earned — trivially true
  by now).
- **Copy:** *"Five months. Consistency is its own reward."*

### **Month 6 — Midpoint** *(chapter break)*

- **Self-Assembly:** aggregate phase commonly reaches `assembled`
  (`assembledCount >= 50%` of 18 modules, `selfAssembly.ts:295,500`).
- **Badge/Level:** Day 180 close → `milestone_180`.
- **Widget Arrange** customization unlocks (Level 10) — the operator can
  now rearrange the dashboard they've been growing into. Symbolically
  correct: you don't get to redesign the house until you've lived in it.
- **Interface Evolution:** Advanced Memory unlocks (`Depth: Deep Diver`).
- **Copy:** *"Six months. The journey is half-declared."*
- **Memory Digest:** the longest of the year — six months is enough
  answer volume (typically 60–150+ answers at default pacing, §6 of
  `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) for genuine L3 (values)
  narrative density.

### Month 7 — Listening

- **Copy:** *"Seven months in. The system has been listening."*
- Narrative tone in `NarrativeWidget` shifts — engagement-aware narrative
  generation (`WIDGETS.md`) reads as noticeably more specific by now.

### Month 8 — Rare Air

- **Badge:** streak-dependent Mastery-tier badges become newly reachable
  for high-density operators (`grand_librarian` needs 25,000+ journal
  words — realistic by month 8 for a daily journaler).
- **Copy:** *"Eight months. Rare air."*

### Month 9 — Habit

- **Interface Evolution:** Export Data unlocks (Level 25) — the operator
  can now take a copy of the compressed year with them. Matches
  `LOT-AI-PRODUCT-BRIEF.md`'s "Context is private by default... export
  action" design principle.
- **Copy:** *"Nine months. The self-care practice is a habit now."*

### Month 10 — Approach

- **Copy:** *"Ten months. Almost there."*
- `PatternInsightsWidget` and `CohortConnectWidget` typically carry a full
  year-shaped comparison window by now — patterns visible only at this
  density.

### Month 11 — Threshold

- **Copy:** *"Eleven months. One more."*
- Interface visually at near-ceiling opacity/glow (`0.95`+ range) —
  the last quiet month before the year closes.

### **Month 12 — Portrait Complete** *(chapter break — the demo-account state)*

- **Badge/Level:** Day 365 close → `milestone_365`, **Level upgrades
  `≈ → ≋`** (deep current) — the second and, in the current badge table,
  final Level transition of the year.
- **Self-Assembly:** full or near-full `integrated` state achievable
  (`assembledCount === modules.length`).
- **Memory:** Story generator operating at full 30-answer window
  continuously; L4 (soul) questions are now the norm, not the exception.
- **PublicProfile:** every field populated — this is functionally the
  `/u/machiavelli` reference state. Correlated Indexes (self-awareness,
  user score, person score, longevity score, composite) are all non-zero
  and meaningfully differentiated from a fresh account.
- **Copy (existing, unchanged — it already says exactly the right thing):**
  *"One year with LOT. The portrait is complete — and still evolving."*
- **Memory Digest:** a full-year retrospective, structurally different
  from every prior digest — this is the one month the Story generator
  should be explicitly told "write the year, not the month" (30-answer
  window is already the max the engine reads, so this is a prompt-framing
  change, not a data change).
- **`MonthsUnlockedWidget`:** transitions to its 13th state
  (`"Year 1 complete · Year 2 in progress"`, §4.3) — the arc doesn't
  end, it hands off to the streak-milestone system's next real waypoint
  (day 730 territory, where `system_architect_age` at 6 years starts to
  make sense as a horizon, and COSMO®'s own 730-day mark — already logged
  in `LOT-WIKI-v77.md` §1 — becomes a natural echo for the operator's own
  two-year mark).

---

## 6. Why This Order, Not Another

- **Chapter breaks (1/3/6/12) are not arbitrary** — they are the four
  points where the *existing* badge-milestone clock (30/90-100/180/365)
  already produces a visible Level or archetype event. The design doesn't
  add new gates; it makes the gates that already exist legible as a story.
- **Connective months (2,4,5,7,8,9,10,11) still fire `MonthlyPulseWidget`
  every single month** — cadence matters more than intensity for a
  subscription product. A user who only hears from the system on months
  1/3/6/12 forgets it exists in between. A user who hears something every
  month, with four of them elevated, experiences both rhythm and
  crescendo.
- **Density gating (§1) prevents the ritual from becoming meaningless**
  for a lapsed subscriber — LOT does not congratulate an empty log. This
  is consistent with the Memory Engine's own refusal to ask generic
  questions ("questions that could apply to anyone are explicitly
  forbidden," §5 Mode 3) — the celebration system holds itself to the
  same honesty standard the question system already does.
- **Nothing here requires a new AI call type, a new database table, or a
  new engine.** Every mechanism cited (Self-Assembly phases, badge
  milestones, Memory Story generation, CSS-only density attributes,
  Usership tag gating) is already operational per `LOT-WIKI-v77.md` and
  `LOT-SYSTEM-OUTLINE.md`. The work is routing and rendering, which is
  why this document is a brainstorm/spec rather than a build session.

---

## 7. Open Questions for S-2

1. Should `QUIET_MONTH_MESSAGES` (§4.1.1) exist at all, or should a
   density-failed month simply not fire the toast that month (silence
   instead of a gentler message)? Silence may read as a bug; the quiet
   variant risks reading as passive-aggressive if the copy isn't careful.
2. Memory Monthly Digest (§4.2) reuses the Together AI Story pipeline —
   confirm this should run automatically on the 1st-of-month boundary
   (there is already a "Monthly Email Sender, 09:00 UTC, 1st" background
   job per `WIDGETS.md` §System Progress Widget — natural place to hang
   the digest generation) rather than on-demand.
3. `MonthsUnlockedWidget` (§4.3) — confirm placement in Subscriber Stack
   vs. promoting it to the Header (alongside week number / date), since
   S-2's brief describes it as something the operator should be able to
   check casually, which argues for higher visibility than the current
   Subscriber Stack position.
4. Post-Month-12 arc (Year 2+) is gestured at in §4.3 but not designed —
   worth a follow-up session once Month 12 ships, so the "13th state"
   isn't a dead end.

---

*LOT SYSTEMS CORPORATION — LOT® Founded 7 April 2016*
*The machine does not perform the ritual. It reports that the ritual happened.*
