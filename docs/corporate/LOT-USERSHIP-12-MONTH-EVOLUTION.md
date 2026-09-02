# LOT® Usership — The 12-Month Evolution
**From Barebones Day 1 to LOT® AI**
LOT Systems Corporation · S-2: Vadik Marmeladov
Version 1.0 · 2 September 2026 · brand.lot-systems.com

---

## Thesis

**The demo account is not a mockup. It is the schema.**

`lot-systems.com/u/machiavelli` is not concept art of a "someday" account. Every field it returns from `GET /profile/machiavelli` (`src/server/routes/public-api.ts:747-906`) is a real field on the real `User` model — `psychologicalProfile`, `correlatedIndexes`, `boardProfile.activity.{memoriesCompiled, journalEntries, activeDays}`, `memoryEngine: 'AI-Powered'`, `clearanceLevel: 'Full'`, `memoryStory` as a written paragraph, plus the two Legacy-tier unlocks (`weatherStation`, `wallet`). Machiavelli is hand-authored with 1469 days of history typed directly into the route so the field never renders empty. A real Usership member fills the same fields for real, at a fraction of that density, over their first 365 days.

This document treats the 12 months of Usership ($99/mo, `docs/corporate/LOT-AMBIENT-AI-VISION.md`) as the **construction schedule** for that schema. Month 1 ships a person with almost every field at zero. Month 12 ships a person whose `boardProfile`, `psychologicalProfile`, and `memoryStory` read the way Machiavelli's do today — not identical numbers, but the same *shape* of a filled-out person.

The job of this document is to make that construction **tangible** — felt monthly, not just computed silently in the background.

---

## What Already Exists (do not rebuild)

Four systems already govern "the UI evolves with the person." This document adds a fifth axis — **Usership Tenure** — and reconciles it with the other four rather than replacing any of them.

| # | Axis | Where | Granularity | Resets? |
|---|------|-------|-------------|---------|
| 1 | **Density Tier** (WIKI §18) | `src/client/utils/interfaceEvolution.ts` | Trailing 7-day signal count, Tier 0–5 | Yes — weekly rolling window |
| 2 | **Citizen Index / CQGS** (WIKI §8) | `EvolutionWidget.tsx`, narrative store | 6 lifetime stages, day-count + event gates | No — irreversible |
| 3 | **Interface Evolution** (`docs/technical/INTERFACE_EVOLUTION.md`) | `stores/evolution.ts`, `useEvolutionSync.ts` | 7-dimensional maturity (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage), feature-gates by Level/achievement | No — cumulative |
| 4 | **Badge Codex v31** (WIKI §14–15) | `src/client/utils/badges.ts` | 781 badges, 8 categories, COMMON→COSMIC rarity | No — cumulative |
| 5 | **Usership Tenure** *(this doc, partially built)* | `MonthlyPulseWidget.tsx` | `now.diff(joinedAt, 'month')`, capped 1–12 | No — calendar-anchored to `joinedAt` |

**Axis 5 already exists in skeleton.** `MonthlyPulseWidget.tsx` computes tenure month from `joinedAt`, gates on the `usership` tag, shows one canned line from a `MONTH_MESSAGES` record (Month 1 → "The system is beginning to know you" … Month 12 → "One year with LOT. The portrait is complete — and still evolving"), and renders `"{month} / 12 months"`. It is a dismissible toast, shown once per tenure-month, with no persistent home once dismissed, and no AI behind the copy — it is static text, the same for every operator.

**The gap** this document exists to close: Axis 5 has a *counter* but no *content*. Axes 1–4 all compress real behavioral signal into something the operator sees reflected back. Axis 5 currently reflects nothing back except a fixed sentence. The Memory Engine's whole doctrine — `LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN` (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) — already knows how to compress a month of signal into a paragraph. It has just never been asked to do it on a monthly cadence and hand the result to `MonthlyPulseWidget`.

Everything below is variations on: *wire Axis 5's counter to the Memory Engine's compressor, and give tenure a permanent home in the UI instead of a toast that vanishes.*

---

## The Four Deliverables

1. **Monthly Memory Story Compression** — an AI-written paragraph per tenure-month, replacing the static `MONTH_MESSAGES` copy.
2. **A permanent "Months unlocked: N/12" widget** — not just a dismissible toast.
3. **Usership Tenure Codex** — 12 new badges, one per month, on the existing Badge Codex rails.
4. **The month-by-month curve** — what Log density, self-care clicks, and widget richness look like at each of the 12 stops, so "tangible evolution" has actual numbers behind it instead of vibes.

---

## Deliverable 1 — Monthly Memory Story Compression

### Doctrine extension

`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §5 defines five question-generation modes (First Question, Weekend, Follow-Up, Explore New Topic, Compressed Follow-Up). Add a sixth, running on a different trigger than the rest — not "next question," but "month boundary":

```
Mode 6: Monthly Compression
  Trigger:    now.diff(joinedAt, 'month') increments (same anchor MonthlyPulseWidget
              already uses — subscription-anniversary month, not calendar month)
  Input:      All Answer + Log rows from the closed tenure-month
              (Memory Q&A, journal/'note' events, self_care_complete events,
              emotional_checkin events, badge unlocks in-window)
  Engine:     Together AI (same pipeline as buildPrompt(), §3 of the architecture doc)
  Output:     One third-person paragraph, en-dash formatted, same register as
              the Machiavelli memoryStory field — NOT a Q&A pair, a narrative.
  Storage:    user.metadata.monthlyStories[monthNumber] = { text, generatedAt,
              answerCount, entryCount, selfCareCount }
  Fallback:   Local composition (same fallback tier as §8 Story Generation) if
              Together AI unavailable — never blocks the month-boundary moment
              on network calls.
```

This is the same "Story Generation" mechanism in §8 of the architecture doc, just windowed to one tenure-month of data instead of the full history. The 30-question compression the engine already does daily is the training wheels; the monthly compression is the recap.

### Where it surfaces

`MonthlyPulseWidget.tsx` currently renders `MONTH_MESSAGES[monthNumber]` — a lookup into static text. Change the render path to:

```
1. On mount, check user.metadata.monthlyStories[monthNumber]
2. If present → render it (AI paragraph, this is the new default)
3. If absent (compression job hasn't run yet, or Month 0 edge case)
   → fall back to the existing static MONTH_MESSAGES line
4. Keep the dismiss mechanic exactly as-is (DISMISS_PHRASES, localStorage
   per-user-per-month gate) — the interaction pattern already works
```

No new component. `MONTH_MESSAGES` stays in the file as the guaranteed fallback — the widget must never show nothing, per Ambient AI™ doctrine ("intelligence woven in, not summoned on command" — silence on failure is not acceptable, the static line is the safety net).

### Compute path

New background job, following the exact pattern of J46–J48 (WIKI §11, the most recently added jobs — daily, scan-previous-period, PostgreSQL writes only):

```
J49  monthly-story-compression-check   09:00 UTC   monthly_story_compressed
     Scans all Usership-tagged users where
     now.diff(joinedAt, 'month') > count(monthlyStories keys)
     — i.e. a tenure-month has closed with no story generated yet.
     Fires buildMonthlyStoryPrompt() → Together AI → writes to
     user.metadata.monthlyStories[N]. One user, one month, one AI call —
     runs once, cached forever, same caching discipline as §8's
     lastMemoryStory.
```

---

## Deliverable 2 — A Permanent Home for Tenure

A toast that dismisses and vanishes is the wrong container for "you are 6 months into a 12-month arc" — that fact should be checkable anytime, not just glimpsed once per month boundary. Two additions, both reusing existing widgets rather than inventing new UI chrome:

**A. `EvolutionWidget.tsx` gets a sixth metric row.** The widget already lists Entries / Active days / Streak / Achievements / Consistency (lines 170–193). Add:

```tsx
{isUsership && (
  <div className="flex justify-between items-baseline">
    <span className="opacity-30">Usership tenure</span>
    <span className="tabular-nums">{tenureMonth} / 12 months</span>
  </div>
)}
```

Same `tabular-nums`, same `opacity-30` label convention already used for every other row in that widget (`EvolutionWidget.tsx:170-193`) — no new visual language introduced.

**B. Public Profile gets a tenure line for Usership members with public profiles on**, next to the existing `boardProfile.boardTenureMonths` field the Machiavelli payload already returns (`public-api.ts:890`). Real users don't have `boardProfile` populated today (it's Machiavelli-only) — extending it to real Usership accounts, capped display at `min(tenureMonth, 12)`, is the natural convergence point between "the demo" and "the real account."

---

## Deliverable 3 — Usership Tenure Codex (12 new badges)

Badge Codex v31 has 8 categories (WIKI §15) and zero of them are tenure-based — the closest is the **Milestone** category's day-count streaks (7/14/21/30/50/60/90/100/180/365), which track *streak days*, not *subscription months*. A Usership member with gaps in their streak (travel, illness, a rough week) currently has no badge track that still honors "you've been a member for 8 months" independent of whether last Tuesday was logged.

```
CATEGORY          Usership Tenure                                 (NEW, v32 candidate)
COUNT             12
TRIGGER           now.diff(joinedAt, 'month') >= N, requires active 'usership' tag
                   at time of check (badge-eligibility-check job, J10, already
                   runs daily — this category rides the existing job, no new
                   scheduler entry needed for the badge award itself)

MONTH   BADGE NAME              RARITY       NOTE
──────────────────────────────────────────────────────────────────────────
1       First Signal            COMMON       Awarded day the pulse first fires
2       Second Wind             COMMON
3       Quarter Turn            UNCOMMON     Aligns with Citizen Index Stage 4
                                              (Collaborator, 90+ days)
4       Fourth Wall             UNCOMMON
5       Fifth Element           UNCOMMON
6       Half Circle              RARE        Aligns with Citizen Index Stage 5
                                              (Synthesizer, 180+ days)
7       Rare Air                 RARE        Matches existing MonthlyPulseWidget
                                              copy for month 7 verbatim
8       Eighth Gate               RARE
9       Ninth Habit              EPIC         "The self-care practice is a habit
                                              now" — existing month-9 copy
10      Tenth Threshold           EPIC
11      Eleventh Hour             EPIC
12      The Portrait Complete   LEGENDARY     Aligns with Citizen Index Stage 6
                                              (Elite, 365+ days) — the only
                                              LEGENDARY in this category,
                                              deliberately: this is the one
                                              that should feel earned, not
                                              routine.
──────────────────────────────────────────────────────────────────────────
TOTAL   +12 badges → Codex v32 candidate (781 → 793)
```

Word-turn, calendar-easter-egg, and secret-boss categories are all deliberately left out of this batch — tenure badges are the one category that should never be missable or hidden. They are the spine of the year, not a discovery.

---

## Deliverable 4 — The Month-by-Month Curve

The honest version of "tangible evolution" needs numbers, not adjectives. This table anchors each tenure-month to mechanics that **already exist and already fire** — the Citizen Index day-thresholds (WIKI §8), the Milestone badge day-counts (WIKI §15), and the existing `MonthlyPulseWidget` copy — so nothing here requires inventing a new progression system, only sequencing the ones already running.

```
MO   DAYS      CITIZEN INDEX          MILESTONE      LOG/SELF-CARE               UI STATE
     (approx)  STAGE REACHED          BADGES DUE     REALISTIC RANGE*            (barebones → dense)
──────────────────────────────────────────────────────────────────────────────────────────────
1    1–30      Observer→Participant   7·14·21·30d    5–20 log entries            Free-tier-style layout
                (Stage 1→2)                          3–10 self-care clicks       (System.tsx:414-537).
                                                                                  Memory Engine active from
                                                                                  answer 1. No compressed
                                                                                  monthly story yet — first
                                                                                  MonthlyPulseWidget fire
                                                                                  uses the static fallback.

2    31–60     Participant            50·60d         10–35 entries               First AI-compressed
                (Stage 2, en route                   8–20 self-care clicks       monthly story eligible
                to Stage 3)                                                      (J49 has one closed
                                                                                  month of data to work
                                                                                  with).

3    61–90     →Contributor           90d            15–45 entries               Pro layout threshold —
                (Stage 3: 30+ days,                  12–30 self-care clicks      Density Tier commonly
                Memory Engine 3+                                                 2–3 (Active/Engaged) for
                sessions — both                                                  a consistent operator.
                satisfied by month 3                                             Quarter Turn badge.
                for a regular user)

4    91–120    Contributor            —              20–50 entries               Interface Evolution
                                                                                  feature-gates (Level 5
                                                                                  custom themes, Level 10
                                                                                  widget arrange) start
                                                                                  landing for consistent
                                                                                  operators around here —
                                                                                  tenure and behavioral
                                                                                  maturity begin to
                                                                                  visibly converge.

5    121–150   Contributor→           —              20–55 entries               —
                Collaborator
                (approaching 90-
                180d band)

6    151–180   →Collaborator          180d           25–60 entries               HALFWAY. Half Circle
                (Stage 4: 90+                                                    badge (RARE). Public
                days, confirmed                                                  Profile tenure line
                by month 6)                                                      (Deliverable 2B) becomes
                                                                                  the most-checked field —
                                                                                  this is the psychological
                                                                                  midpoint, treat the copy
                                                                                  and compression quality
                                                                                  here as load-bearing.

7    181–210   Collaborator           —              25–60 entries               "Rare air" (existing
                                                                                  copy, now badge-backed
                                                                                  too).

8    211–240   Collaborator→          —              25–65 entries               —
                Synthesizer

9    241–270   →Synthesizer           —              30–70 entries               Self-care streak
                (Stage 5: 180+                                                   consistency, not novelty,
                days, cross-domain                                               is the story this month
                signal, stable                                                   — "the practice is a
                archetype)                                                       habit now" (existing
                                                                                  copy) should be backed
                                                                                  by the actual self-care
                                                                                  streak number, not just
                                                                                  said.

10   271–300   Synthesizer            —              30–75 entries               —

11   301–330   Synthesizer            —              30–75 entries               —

12   331–365+  →Elite                 365d            35–80+ entries              THE PORTRAIT COMPLETE.
                (Stage 6: 365+                                                   LEGENDARY tenure badge.
                days, all primary                                               boardProfile-shaped
                sources active,                                                 annual Memory Story —
                QIE P100+)                                                      same register as the
                                                                                  Machiavelli memoryStory
                                                                                  field, generated from a
                                                                                  full year of real signal
                                                                                  instead of hand-authored
                                                                                  copy. This is the moment
                                                                                  the schema and the demo
                                                                                  account visually
                                                                                  converge.
──────────────────────────────────────────────────────────────────────────────────────────────
```
\* Ranges are illustrative bands for a moderately consistent operator (roughly Density Tier 2–3 sustained), not hard gates — nothing in this document proposes penalizing an inconsistent month. Citizen Index stage advance is irreversible by design (WIKI §8) and this curve inherits that: a quiet Month 7 does not undo Month 6's Half Circle badge or Stage 4 status.

---

## What Does Not Change

- **No new onboarding wizard.** Research confirms none exists today — Day 1 is whatever `System.tsx` renders at Density Tier 0 / Citizen Index Stage 1 for a fresh `usership`-tagged account. That barebones state is correct and should stay; the ask was for the *evolution* to be tangible, not for Day 1 to be dressed up. The barebones start is the point of contrast that makes Month 12 legible.
- **No change to the Cockpit Rule.** Log bodies stay instrument-only (WIKI §20). The monthly compressed story is explicitly *not* a log entry — it lives in `user.metadata.monthlyStories` and renders in the pulse widget / a future Memory Story view, never in the Log stream itself.
- **No change to Density Tier or Interface Evolution mechanics.** Tenure is additive, not a replacement axis. A Month 2 operator can already be Density Tier 4 if they're intense about it; a Month 11 operator can be Tier 1 if they went quiet. Tenure badges honor calendar loyalty specifically *because* the other four axes already reward intensity — this is the one track that rewards simply staying.

---

## Open Questions for S-2

1. **Anniversary month vs. calendar month.** `MonthlyPulseWidget` already anchors to `joinedAt` (subscription-anniversary), not the 1st of the calendar month. This document keeps that convention throughout. Confirm that's still the intended anchor before J49 is built — calendar-month anchoring would be a materially different (and noisier) job.
2. **Does the Month 12 compressed story end the cadence, or does Month 13+ get a new tier of copy?** The Machiavelli account is effectively "Month 17,628" (`citizenSince: 'June 1469'`) — the schema clearly keeps accumulating past year one. This doc only scopes months 1–12; a follow-up should define what "Year 2" tenure badges/copy look like before a real cohort reaches month 13.
3. **Badge Codex version bump.** +12 tenure badges (781 → 793) is proposed as a v32 candidate here — confirm this ships as its own versioned batch (matching the existing one-batch-per-version discipline in WIKI §14) rather than folding into whatever else is queued for v32.

---

**LOT Systems Corporation**
**S-2: Vadik Marmeladov — CEO, Founder**
