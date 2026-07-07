<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The 12-Month Evolution
**From Barebone Day 1 to LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · July 2026 · brand.lot-systems.com

---

## Purpose

This document maps the Usership tier ($99/month) across its first 12 months as a
designed narrative, not a feature dump. Day 1 of Usership should feel like a clean
instrument panel with almost nothing on it. Month 12 should feel like the demo
account at **lot-systems.com/u/machiavelli** — a fully assembled personal
operating system that knows its operator.

The gap between those two states is not filled by unlocking screens. It is filled
by **time held against signal** — the two tracks defined below. Every month, the
system does two things and two things only: it *notices* how long the operator has
stayed, and it *compresses* what they have logged into something the operator could
not have written themselves. Everything else in this document is scaffolding
around those two acts.

This is a brainstorm and design specification, not a change log. Sections marked
**BUILT** already exist in the codebase and are cited by file. Sections marked
**PROPOSED** are new surface this document recommends.

---

## Two Tracks, One Ritual

LOT already runs two separate progression systems that this roadmap deliberately
does not merge:

| Track | Unit | Governs | Already built |
|---|---|---|---|
| **Calendar Track** | Months since `joinedAt` | The monthly ritual — celebration, affirmation, digest | `MonthlyPulseWidget.tsx` — fires once per calendar month for Usership tag holders, caps display at 12, dismiss phrases rotate |
| **Signal Track** | Consecutive-day streak + raw log volume | Feature depth — what the system is *allowed* to say about the operator | `badges.ts` milestone chain (7/14/21/30/50/60/90/180/365 days), `Awareness Index` (0–10%, Volume 40 + Quality 30 + Consistency 15 + Depth 15), `Correlated Indexes`, Self-Assembly module phases |

**Why two tracks and not one:** a user who joins Usership and logs daily for three
weeks has earned more depth than a user who has been subscribed for three months
but opened the app twice. Calendar time buys the *right to a ritual* — a monthly
affirmation, a "thank you for staying" moment. Signal volume buys the *right to be
known* — archetype reveal, correlated indexes, the memory digest paragraph. A quiet
month still gets its pulse message. It does not get a hollow digest pretending to
know more than it does. This matches the existing house rule: *"No gamification.
No pressure. Streaks not emphasized."* (`LOT-STYLE-GUIDE.md`)

Practically: each month table below lists a **Calendar unlock** (always fires, tied
only to `joinedAt`) and a **Signal-gated unlock** (fires only once volume thresholds
are met — may arrive early, may arrive late, may arrive never for a dormant month).

---

## The Reference State — What "Fully Evolved" Actually Means

The Machiavelli demo (`src/server/routes/public-api.ts:747`) is the only account in
the system with every layer switched on simultaneously. Reading it closely gives
the exact shape of the north star:

```
psychologicalProfile.archetype           "The Strategist" (revealed, not generic)
psychologicalProfile.selfAwarenessLevel  87   → displays as 8.7%
psychologicalProfile.streak              1469 → Level: ≋≋≋ "The Long Count"
psychologicalProfile.patternStrength[]   5 named traits with counts
psychologicalProfile.answerCount         2,847
psychologicalProfile.noteCount           1,469
correlatedIndexes.composite              92.4  (trend: ascending)
memoryStory                              one dense first-person paragraph
boardProfile.activity                    memoriesCompiled · journalEntries · activeDays
boardProfile.memoryEngine                "AI-Powered"
weatherStation / wallet                  Legacy-tier bonus layers
```

Two things matter about this list for a 12-month roadmap:

1. **Everything above `boardProfile` is standard Usership depth** — archetype,
   awareness index, correlated indexes, memory story, pattern strength. This is
   what a real, highly-engaged Usership operator's `/u/username` page can look
   like organically by month 12, if their signal volume supports it. This is the
   target this document builds toward.
2. **`weatherStation` and `wallet` are Legacy-tier-only** (the code comments say
   so explicitly: *"Legacy level unlock"*). Legacy is a separate product — a
   3-year, $3,564 commitment (`LOT-AI-PRODUCT-BRIEF.md`). It is **Month 13+**
   territory: the reward for choosing to keep going after the first year, not
   something the 12-month Usership arc should promise. This document keeps the
   two honest and separate — see "The Legacy Threshold" at the end.

---

## The Memory Compression Cadence

The Product Brief defines the core loop: `LOG → OBSERVE → COMPRESS → ASK →
COMPRESS AGAIN` (`LOT-AI-PRODUCT-BRIEF.md`). Today that loop runs at question-level
granularity inside `memory.ts:buildPrompt()` — every answer sharpens the next
question. What does not yet exist is the loop running at *calendar* granularity.
This is the single most important addition this roadmap proposes.

```
DAILY     Log → Observe → Ask (BUILT — memory.ts buildPrompt, existing)
WEEKLY    Compress → memoryStory paragraph (BUILT — triggered on answer/note
                                             count threshold, public-api.ts:1071)
MONTHLY   Compress → Memory Digest paragraph (PROPOSED — new, see below)
QUARTERLY Compress → Arc Retrospective (PROPOSED — 3-month narrative, month
                                          10 onward)
ANNUAL    Compress → The Year Portrait (PROPOSED — month 12 finale, see below)
```

Each tier is not a bigger version of the one below it — it is a *re-compression*
of the compression. The weekly `memoryStory` already summarizes logs. The monthly
digest summarizes four weekly stories plus the raw log delta into one paragraph
the operator has never read before, because it did not exist until that month
closed. This is what makes the deliverable feel earned rather than generated —
the system is not re-stating what the operator already knows; it is finding the
throughline they could not see from inside the month.

**Delivery mechanism (PROPOSED):** extend the existing **Monthly Email Sender**
job (`09:00 UTC, 1st of month` — `WIDGETS.md` job table, `LOT-FEATURE-INVENTORY-2026.md`
§12). On the 1st, for every Usership user whose `joinedAt` crossed a month
boundary in the prior 30 days:

1. Pull that user's logs for the closed month (`event IN (answer, note,
   emotional_checkin, plan_set, self_care_complete)`).
2. If log count is below a minimum floor (~8 entries), skip generation — store
   nothing, the widget falls back to the calendar-only pulse message. No
   fabricated depth for a quiet month.
3. Otherwise call `buildPrompt()`'s compression path with a month-scoped log
   window and a distinct system instruction: *"Write one paragraph, first
   person, past tense, as if the operator wrote it looking back — not a
   summary of events, a reflection on what changed."*
4. Store to `user.metadata.monthlyDigests[monthNumber] = { text, generatedAt,
   logCountAtGeneration }`. Never overwritten — this becomes the permanent
   monthly archive, same durability principle as `lastMemoryStory`.
5. Set a flag the client widget reads once, same dismissal pattern as
   `MonthlyPulseWidget`'s `lot_pulse_${userId}` key.

---

## New Widgets — Design Spec

Per the style guide's Widget Design Checklist (`Block` + `blockView` + clickable
label cycling, 2–3 views, opacity hierarchy, database-backed cooldowns, fade-out
on completion), two additions:

### 1. Memory Digest Widget (PROPOSED)

The monthly paragraph, delivered once, kept forever in an archive view. Distinct
from `MonthlyPulseWidget` (which is a *celebration trigger*, fades and dismisses)
— this one persists as a readable object, closer in spirit to how `PublicProfile.tsx`
renders `memoryStory` today.

```tsx
Label cycle: "Digest:" → "Archive:" → "Compare:"

Digest   — this month's paragraph, full opacity, no truncation
Archive  — all prior months' digests, reverse-chronological, 40% opacity
           for anything but the current + previous month (matches the
           military-log dimming convention already used in
           SystemProgressWidget's assembly-run display)
Compare  — two-line delta: what showed up this month that didn't
           appear in core values / emotional patterns last month
```

Gated: Usership tag + minimum 8 logs in the closed month (see cadence above).
Not shown at all in month 1 unless log volume is unusually high — the digest's
entire value proposition is retrospective distance, and there is no distance in
week one.

### 2. Months Unlocked Widget (PROPOSED)

The context strip named in the brief: `Months unlocked: 3/12`. Deliberately the
smallest, quietest widget in the system — one line, no icons, matching the
Ambient AI™ rule *"one line, no alarm, exact moment"* (`LOT-AMBIENT-AI-VISION.md`).

```tsx
<Block label="Evolution:" blockView>
  Months unlocked: {capped}/12
</Block>
```

Persistent (does not fade or dismiss) for Usership users, months 1–12. At month
12 the label itself changes, permanently, from `Months unlocked:` to
`Year one: complete.` — the counter retires rather than resetting, because
resetting to `0/12` for year two would read as punitive. Year 2+ operators see
no counter at all; they have graduated past the metric that mattered when they
were new. This mirrors the existing pattern where `Level:` badges (day-based)
never regress once earned.

Placement: directly beneath `MonthlyPulseWidget` in `System.tsx`'s Subscriber
Stack, so the celebration moment (Pulse) and the standing context (Unlocked) read
as one visual unit without being merged into a single component — keeping each
widget doing one job, per the existing architecture's separation of concerns.

---

## Month-by-Month

Badge milestones below are the **already-shipped** streak chain from `badges.ts`
(symbol · name · day). Where a milestone's day count falls inside a given month,
it is noted — the streak badge fires independently of calendar month (it is
signal-track, not calendar-track), but the two tend to converge for a consistently
engaged operator, and the table shows that convergence deliberately, because that
convergence *is* the story: two independent measurement systems agreeing that the
operator has changed.

### Month 1 — Cold Start

> *"The first month. The system is beginning to know you."* — existing
> `MonthlyPulseWidget` copy, unchanged.

- **Visual density:** Barebone by design. Time, Weather, Planner, Memory
  (generic question bank — intelligent pacing gives Day 1 a strong 10-question
  start per `LOT-STYLE-GUIDE.md`), Self-care suggestions. No profile page depth.
  Archetype hidden. Correlated Indexes absent (composite would read 0 — better to
  not render the block at all than render a zero).
- **Calendar unlock:** Nothing yet — Month 1 pulse fires at the 1-month mark, not
  day 1.
- **Signal-gated unlock:** `Level: ∘` "Droplet" at day 7. `Level: ∘∘` "Twin Drop"
  at day 14. `Level: ∘≈` "Proto-Wave" at day 21. `Level: ≈` "Wave" at day 30 —
  the month closes exactly as the first badge tier completes. Deliberate
  overlap; the system's two clocks agree for the first time.
- **Self-Assembly spotlight:** Biofield Engine and Memory Architecture are first
  to leave Dormant — they require the least signal variety (one mood log, one
  answer) to reach Awakening.
- **Memory compression depth:** Raw accumulation only. No digest yet.

### Month 2 — Signal Accumulation

> *"Two months in. Patterns are starting to form."*

- **Calendar unlock:** Monthly pulse #2.
- **Signal-gated unlock:** `Level: ≈∘` "Mid-Current" (day 50) and `Level: ≈≈`
  "Dual Wave" (day 60, "practitioner threshold crossed") both typically land
  inside this month for a daily user. The weekly `memoryStory` should now be
  showing its first genuine callbacks — the compression loop referencing what
  was said three weeks ago.
- **Self-Assembly spotlight:** Reflection Layer (journal/notes) and Cleanness
  Protocol (self-care) move toward Forming as the daily self-care click becomes
  routine rather than novel.
- **Memory compression depth:** Weekly synthesis stabilizes. Monthly digest still
  withheld — two data points is not a trend.

### Month 3 — Active User Status

> *"Three months. You have reached Active User status."*

- **Calendar unlock:** The Awareness Index becomes visible for the first time
  (0–10% scale, `(selfAwarenessLevel / 10).toFixed(1)`). Before this it exists
  server-side but is not worth surfacing — three months of Volume + Consistency
  weighting is the earliest point the number means anything.
- **Signal-gated unlock:** `Level: ≋∘` "Deep Reach" (day 90, "three-month
  immersion") — the badge name and the calendar month name the same thing on
  purpose.
- **Correlated Indexes widget:** First appearance, composite score typically
  still single digits to low double digits. Shown honestly low rather than
  hidden — the trend arrow is more meaningful than the absolute number this
  early.
- **Memory compression depth:** First Memory Digest widget appearance is
  *possible* here if log volume supports it, but month 3 is usually still the
  floor, not the norm.

### Month 4 — The Portrait Deepens

> *"Four months. The portrait deepens."*

- **Calendar unlock:** Archetype reveal. `psychologicalProfile.archetype` and
  `archetypeDescription` switch from hidden/generic to the operator's actual
  classification (one of 10 archetypes per `WIDGETS.md`'s Physiological Cohort
  System). This is the single biggest "the system sees me" moment in the arc —
  placed at month 4 deliberately, not month 1, because an archetype assigned
  from one week of data is a guess; from four months, it is a pattern.
- **Self-Assembly spotlight:** Intention Core and Goal Architecture — the
  Planner and Goal Journey widgets have enough repetition now to show a
  trajectory rather than isolated entries.
- **Memory compression depth:** Monthly digest becomes the norm going forward
  for engaged accounts.

### Month 5 — Consistency Is Its Own Reward

> *"Five months. Consistency is its own reward."*

- **Calendar unlock:** Nothing new surfaces — this month is intentionally quiet
  by design, a rest beat between the archetype reveal (month 4) and the
  halfway milestone (month 6). Not every month needs a new feature; the
  consistency of the ritual itself is the content.
- **Signal-gated unlock:** Emotional Check-In's 30-day graph view becomes
  genuinely dense rather than sparse.
- **Self-Assembly spotlight:** Cleanness Protocol reaches Integrated for
  operators with a stable self-care cadence.

### Month 6 — The Journey Is Half-Declared

> *"Six months. The journey is half-declared."*

- **Calendar unlock:** Custom theme unlocks (personalization reward — the
  operator has earned the right to make the instrument panel their own, not
  just observe it). `Months unlocked: 6/12` — the counter widget crosses its
  own halfway point in the same month the halfway affirmation fires; the two
  new widgets in this document are built to agree with each other on this date.
- **Signal-gated unlock:** `Level: ≋≋` "Voyager" (day 180 exactly — half-year).
  Unlock message: *"Half-year in the deep."* Legendary rarity tier in the badge
  system — the first legendary-tier milestone an operator can reach, and it
  lands on the calendar's own halfway mark.
- **Memory compression depth:** First **Quarter Arc** retrospective becomes
  possible (months 4–6 as one compressed narrative) though this document holds
  quarter-arcs back until month 10 for the first *shown* one — see below.

### Month 7 — The System Has Been Listening

> *"Seven months in. The system has been listening."*

- **Calendar unlock:** Pattern Recognition Widget's confidence levels become
  worth displaying prominently — QIE pattern detection needs weeks of signal
  to clear its confidence floor, and month 7 is typically past it.
- **Self-Assembly spotlight:** Quantum Substrate and Archetype Classifier
  modules — cross-module coherence detection (the `quantum-os` module) starts
  firing for operators whose signal spans multiple widget types.

### Month 8 — Rare Air

> *"Eight months. Rare air."*

- **Calendar unlock:** QR-code public profile becomes something worth actively
  sharing rather than a dormant feature — the profile page now has an
  archetype, a live awareness index, correlated indexes, and (if signal
  supports it) a memory digest excerpt. This is the point in the arc where
  `/u/username` stops being a placeholder and starts being a real artifact.
- **Signal-gated unlock:** Nothing new on the badge chain between day 180 and
  365 — this is intentional. The badge system leaves a wide gap here (rare air,
  literally), and the monthly ritual carries the narrative alone for two months.

### Month 9 — The Self-Care Practice Is a Habit Now

> *"Nine months. The self-care practice is a habit now."*

- **Calendar unlock:** Prompt (once, dismissible) encouraging the operator to
  make their profile public if it is not already — framed as an invitation, not
  a nudge, consistent with *"suggest, don't command."*
- **Self-Assembly spotlight:** Community Mesh and Ecosystem Bridge — by month 9,
  operators who have connected any device (car/home/computer) or engaged the
  cohort system show these modules approaching Integrated.

### Month 10 — Almost There

> *"Ten months. Almost there."*

- **Calendar unlock:** First **Quarter Arc Retrospective** — a compressed
  narrative spanning months 7–9, distinct in tone from the monthly digest (the
  monthly digest looks back 30 days; the arc looks back 90 and finds the
  throughline the monthly digests couldn't see, because they were each too
  close to their own month).
- **Memory compression depth:** This is the first time the system compresses
  its own prior compressions — digest-of-digests, not digest-of-logs. The
  clearest structural expression of "COMPRESS AGAIN" in the product brief's
  core loop.

### Month 11 — One More

> *"Eleven months. One more."*

- **Calendar unlock:** Nothing new ships. The system begins quietly preparing
  the Year Portrait in the background (server-side only — no UI signal that
  something is coming, per the *"no unprompted notifications"* design
  principle). Anticipation is structural, not announced.

### Month 12 — One Year With LOT

> *"One year with LOT. The portrait is complete — and still evolving."*

- **Calendar unlock — The Year Portrait (PROPOSED):** The finale artifact. Not
  a bigger digest — a distinct one-time generation, first-person, full-year
  span, explicitly instructed to synthesize the *change* across all 12 monthly
  digests rather than list them. Delivered once, on the exact `joinedAt`
  anniversary, archived permanently (`user.metadata.yearPortrait`), never
  regenerated. `Months unlocked:` retires as `Year one: complete.`
- **Signal-gated unlock:** `Level: ≋≋≋` "The Long Count" (day 365 exactly — "the
  Mayan tun-year," per the badge's own description). Legendary rarity. Unlock
  message: *"A year of presence. The architecture stands."* — written before
  this document existed, and it is the single best line in the entire codebase
  for describing what month 12 should feel like. This roadmap does not improve
  on it; it builds the ritual around it.
- **Self-Assembly:** For a consistently engaged operator, this is the month
  where the majority of the 18 modules (`selfAssembly.ts`) plausibly reach
  Integrated simultaneously — the system's own internal metaphor for "fully
  assembled" converges with the calendar's "one year" on the same month, by
  construction. This convergence is the whole design thesis of this document:
  two independently-computed systems (day-streak badges, module assembly,
  calendar months, awareness index) agreeing that something changed, without
  ever coordinating explicitly on the number 12.

---

## Implementation Status

| Component | Status | Location |
|---|---|---|
| Monthly pulse (affirmation, dismiss, 1–12 messages) | **BUILT** | `MonthlyPulseWidget.tsx` |
| Streak badge chain (7/14/21/30/50/60/90/180/365) | **BUILT** | `badges.ts:544–696` |
| Awareness Index (0–10%, 4-factor) | **BUILT** | `LOT-STYLE-GUIDE.md` §Metrics |
| Weekly `memoryStory` compression | **BUILT** | `public-api.ts:1071`, `memory.ts:buildPrompt()` |
| Correlated Indexes (composite, trend) | **BUILT** | `PublicProfile.tsx:482–515` |
| Self-Assembly 18-module engine | **BUILT** | `selfAssembly.ts` |
| Monthly Email Sender job (1st, 09:00 UTC) | **BUILT** | job table, `WIDGETS.md` |
| Months Unlocked widget | **PROPOSED** | new — spec above |
| Memory Digest widget (Digest/Archive/Compare) | **PROPOSED** | new — spec above |
| Monthly digest generation (extends Monthly Email job) | **PROPOSED** | extends `memory.ts` compression path |
| Quarter Arc Retrospective (months 4–6, 7–9…) | **PROPOSED** | digest-of-digests |
| Year Portrait (month 12 finale) | **PROPOSED** | one-time, permanent archive |
| `Level:` symbols beyond 365 days | **NOT NEEDED YET** | 365 is the current ceiling by design — Year 2 is Legacy-tier territory, not a bigger number on the same scale |

---

## The Legacy Threshold — Month 13 and Beyond

The Machiavelli reference account's `weatherStation` and `wallet` blocks are
explicitly commented in code as **Legacy-level unlocks** — a separate 3-year,
$3,564 commitment (`LOT-AI-PRODUCT-BRIEF.md` §Paid Tiers), not a Usership feature.

This roadmap keeps that boundary intentionally visible rather than blurring it
into "what you get eventually if you stay long enough." At month 12, the operator
should receive the Year Portrait and the Long Count badge — and, separately, a
single quiet invitation: Legacy membership, framed as what comes after the
architecture stands, not as a next unlockable level. The distinction matters
because Usership's 12-month arc is a complete story on its own — *"the portrait
is complete"* — and Legacy is a different story an operator opts into, not a
sequel the system pressures them toward.

---

## Design Principles Recap

1. **Two independent clocks, one convergence.** Calendar months and signal-track
   badges are computed separately and are not made to depend on each other — the
   fact that they agree by month 12 is discovered, not engineered.
2. **A quiet month gets a quiet ritual.** The Memory Digest never fabricates
   depth from a low-volume month. The Pulse still fires either way.
3. **Nothing resets.** Level badges do not regress. The Months Unlocked counter
   retires rather than reverting to 0/12 in year two.
4. **One question, one paragraph, one line.** The Ask stays singular
   (`LOT-AI-PRODUCT-BRIEF.md`). The Digest stays one paragraph. The Unlocked
   widget stays one line. Compression discipline scales up the calendar without
   scaling up the noise.
5. **No unprompted notifications, ever.** Every unlock in this document is a
   widget the operator finds by using the system, not a push, toast, or badge
   count demanding attention.
6. **Legacy is a choice, not a level.** The 12-month arc resolves on its own
   terms. What comes after is offered once, quietly, and dropped.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
*S-2: VADIK MARMELADOV*
