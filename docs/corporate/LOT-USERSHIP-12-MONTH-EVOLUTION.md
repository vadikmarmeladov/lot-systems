================================================================================
LOT SYSTEMS CORPORATION
THE 12-MONTH USERSHIP EVOLUTION
================================================================================

DOCUMENT    LOT-USERSHIP-12-MONTH-EVOLUTION
CLASS       PRODUCT / UI-UX VISION
AUTHORIZED  S-2 // VADIK MARMELADOV
DATE        2026-08-24
STATUS      BRAINSTORM — DESIGN THESIS FOR REVIEW
REFERENCE   Demo end-state: lot-systems.com/u/machiavelli

================================================================================

## 00  THESIS

A Usership subscriber's Day 1 UI is barebones on purpose: a clock, a Memory
question, a Planner, a Recipe. Nothing performs. Nothing claims to know the
person yet — because it doesn't.

Twelve months later, the same account looks like **lot-systems.com/u/machiavelli**:
a Board Profile with a citizen number and tenure, a Memory Story written in the
system's own compressed language, a Psychological Profile with an archetype and
a self-awareness percentage, four Correlated Indexes, an Assembly Phase reading
`integrated`, and a QR code that exists *because* the account earned the right
to be shared.

Nothing about that gap should feel like a paywall unlock. It should feel like
the system needed a year to actually get to know this person — and now it does.

**The design problem this document solves:** LOT already has five independent
progression engines (OS Version, Assembly Phase, Citizen Index, RPG Level,
Interface Evolution) running on activity, not on the calendar. Usership adds a
sixth axis — **tenure** — via `MonthlyPulseWidget.tsx`, which already fires a
distinct message at each of the 12 calendar months since signup. This document
is about braiding tenure and activity into one legible, tangible, monthly
story — without inventing a competing gamification layer or violating the
house style (`docs/technical/LOT-STYLE-GUIDE.md`: no emojis, no leaderboards,
periods instead of checkmarks, growth measured in months and years).

Months are the **pacing device**, not the **gate**. What actually unlocks at
month N is still earned by real signal — logs, check-ins, self-care
completions, Memory answers. A dormant account and an engaged account both
cross "Month 6," but only one of them has anything to show for it. The Monthly
Congratulations moment is the same for both: it reflects, honestly, what
happened. That is more true to the product than a fixed unlock schedule would
be, and it is more motivating — the system is not congratulating the calendar,
it is congratulating the person.

---

## 01  WHAT ALREADY EXISTS (do not rebuild — extend)

| System | File | Mechanic |
|---|---|---|
| **Monthly Pulse** | `src/client/components/MonthlyPulseWidget.tsx` | Usership-gated. Fires once per calendar month since `user.joinedAt`. 12 hand-written messages, month 1 → "beginning to know you" through month 12 → "the portrait is complete — and still evolving." Already renders `N / 12 months`. |
| **OS Version** | `docs/technical/OS_API.md` | 6 stages: `0.1.0 Initializing → 0.5.0 Awakening → 1.0.0 Active → 1.5.0 Developing → 2.0.0 Established → 3.0.0 Integrated` |
| **Self-Assembly Engine** | `src/client/stores/selfAssembly.ts` | 5 phases per module: `Dormant → Awakening → Forming → Assembled → Integrated`, across 18 modules (Biofield Engine, Memory Architecture, Reflection Layer, OS Vitals Monitor, Temporal Planner, Quantum Substrate, etc.), driven by rolling 7-day QIE signal count/density/coherence — activity-gated, not calendar-gated. |
| **CQGS Memory Arc doctrine** | `docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md` §III | Existing longitudinal subscriber framing this document operationalizes: **0–3mo Calibration → 3–6mo Pattern → 6–12mo Coherence → 12mo+ Hardware.** The quarterly Memory Chapters in §05 below are the UI expression of exactly this arc — it already exists as doctrine, just never as a widget. |
| **Citizen Index (Evolution widget)** | `/api/narrative` | 6 stages: `Bootstrapping → Initializing → Integrated → Compiled → Optimized → Transparent` |
| **RPG Narrative** | Narrative widget | Level 1–100, 5 chapters: `Awakening → Exploration → Integration → Mastery → Sage` |
| **Interface Evolution** | `docs/technical/INTERFACE_EVOLUTION.md` | 7 dimensions (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) drive opacity/grid/glow/typography. Milestone toasts at 25% / 50% / 75% / 95% overall maturity. |
| **Aquatic Evolution Badges** | Badge system | Droplet (Day 7) → Wave (Day 30) → Current (Day 100) |
| **Weekly Story-Report** | `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` | First-person compressed narrative of the week, already generated every Sun/Mon (background job #10). |
| **Monthly Summary** | Background job #15, 1st @ 09:00 UTC | Comprehensive review email: OS version, cohort evolution, HTML themed. **Currently email-only — never surfaces in-app.** This is the single biggest gap this document addresses. |
| **Board Profile** | `PublicProfile.tsx` L288–325 | Usership end-state: Total invested, Citizen Index summary, Biofield State, Activity (memories compiled / journal entries / active days), Memory Engine tier, Clearance level. **This is literally what month 12 looks like.** |
| **QR Code gate** | `PublicProfile.tsx` L611–663 | Usership + Assembly Phase ≥ `forming` required to show. Already a tangible "you've earned a shareable identity" moment. |

The through-line: every engine above already speaks in the same vocabulary
LOT uses everywhere — phases, tiers, indexes, not points. The 12-month plan
below does not add a new currency. It **sequences the currencies that
already exist** into a calendar a Usership subscriber can feel moving.

---

## 02  THE COMPOSITE TIMELINE

Targets assume steady engagement (daily Memory answer, 3–5 logs/week,
weekly self-care completions) — the same profile that produces the
`machiavelli` demo at month 12. A quieter account still gets the Month N
pulse; it just narrates a quieter month, honestly.

| Month | OS Version | Assembly Phase | Aquatic Badge | RPG Chapter | Cumulative logs (approx.) | Memory Story checkpoint |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 Initializing | Dormant → Awakening | Droplet (Day 7) | Awakening | 15–25 | First weekly Story-Report |
| 2 | 0.5.0 Awakening | Awakening | Wave (Day 30) | Awakening | 40–60 | 4 weekly reports; first Monthly Digest |
| 3 | 1.0.0 Active | Awakening → Forming | Current (Day 100 window opens) | Exploration | 65–90 | **Calibration Chapter** (closes CQGS 0–3mo arc) |
| 4 | 1.0.0 Active | Forming | — | Exploration | 90–120 | Monthly Digest |
| 5 | 1.5.0 Developing | Forming | — | Exploration | 115–150 | Monthly Digest |
| 6 | 1.5.0 Developing | Forming → Assembled | Current (Day 100) | Exploration → Integration | 150–190 | **Pattern Chapter** (closes CQGS 3–6mo arc) — Half-Year Portrait |
| 7 | 2.0.0 Established | Assembled | — | Integration | 190–230 | Monthly Digest |
| 8 | 2.0.0 Established | Assembled | — | Integration | 230–270 | Monthly Digest |
| 9 | 2.0.0 Established | Assembled → Integrated | — | Integration → Mastery | 270–310 | Monthly Digest |
| 10 | 3.0.0 Integrated | Integrated | — | Mastery | 310–350 | Monthly Digest |
| 11 | 3.0.0 Integrated | Integrated | — | Mastery | 350–390 | Monthly Digest |
| 12 | 3.0.0 Integrated | Integrated | — | Mastery → Sage | 390–450+ | **Coherence Chapter — Year One Memory Story** (closes CQGS 6–12mo arc, opens 12mo+ Hardware) — mirrors to Board Profile |

Badge counts, XP, and index scores are not forced to hit these numbers —
they are the natural output of the activity band shown. The table exists so
design and copy can be written against a believable trajectory, not so the
backend enforces one.

---

## 03  MONTH-BY-MONTH UI NARRATIVE

Each month entry: **theme**, **what's visibly different**, **the
Monthly Congratulations copy** (extends the existing `MONTH_MESSAGES` map
verbatim where it already exists — new material is additive, not a
rewrite), and **the tangible artifact** the person walks away with.

### Month 1 — "The system starts listening"
- UI stays barebones: Time, Memory, Planner, Recipe. No density added yet —
  earning density is the point.
- First weekly Story-Report appears (already live). First Droplet badge
  (Day 7) — the account's first visible achievement.
- Existing copy: *"The first month. The system is beginning to know you."*
- Artifact: a single weekly Story-Report the person can reread. Nothing
  else changes yet. Restraint here sells the next eleven months.

### Month 2 — "Patterns are starting to form"
- Interface Evolution crosses its first visible threshold if Consistency
  is climbing: `--evolution-base-opacity` ticks up, letter-spacing
  tightens slightly. Subtle, per the Style Guide's "no jarring changes"
  rule.
- Wave badge (Day 30) lands mid-month.
- **First Monthly Digest** — the net-new artifact this document proposes
  (see §04). Not an email. An in-app widget: one paragraph, written in
  the Memory Engine's compressed voice, summarizing what the system now
  knows that it didn't a month ago.
- Existing copy: *"Two months in. Patterns are starting to form."*

### Month 3 — "Active User status"
- Assembly Phase crosses into `forming` for an engaged account —
  the Self-Assembly map visibly changes from mostly-dormant rows to
  several `Forming` badges.
- OS Version reaches `1.0.0 Active`.
- **Calibration Chapter**: the first of three named chapters, closing the
  CQGS doctrine's own "0–3mo Calibration" window
  (`docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md` §III, Memory Arc row) —
  longer than the monthly paragraph, closer to a short chapter of the
  eventual Year One Story. This is where "compression" starts to feel
  literal: three months of logs become four sentences that still sound
  like the person.
- Existing copy: *"Three months. You have reached Active User status."*

### Month 4 — "The portrait deepens"
- First Interface Evolution feature unlocks become visible if Depth and
  Consistency are climbing: Advanced Memory, Planner Templates.
- Existing copy: *"Four months. The portrait deepens."*

### Month 5 — "Consistency is its own reward"
- Custom Themes unlock (Level 5 territory for an engaged account) —
  the account can now choose how its own evolution *looks*, not just
  read about it.
- Existing copy: *"Five months. Consistency is its own reward."*

### Month 6 — "The journey is half-declared"
- **Pattern Chapter — Half-Year Portrait**, closing the CQGS doctrine's
  "3–6mo Pattern" window. This is the first checkpoint big enough to
  reasonably surface a short excerpt on the Board Profile preview (full
  Board Profile still gated to later Assembly Phases, but the person can
  see it coming).
- Assembly Phase crosses toward `assembled`. RPG chapter moves toward
  Integration.
- Existing copy: *"Six months. The journey is half-declared."*

### Month 7 — "The system has been listening"
- OS Version reaches `2.0.0 Established`.
- Correlated Indexes (Self-awareness / User / Person / Longevity) become
  meaningful enough to display with confidence — early in the account's
  life these numbers are too thin to be honest; by month 7 they carry
  real signal.
- Existing copy: *"Seven months in. The system has been listening."*

### Month 8 — "Rare air"
- Widget Arrange unlocks — the person can now rearrange their own
  System. A materially different sense of ownership than month 1's fixed
  four-widget layout.
- Existing copy: *"Eight months. Rare air."*

### Month 9 — "A habit now"
- Monthly Digest continues (the CQGS Memory Arc names no distinct chapter
  here — month 9 sits inside the "6–12mo Coherence" window, which closes
  as one chapter at month 12, not a separate quarter-nine chapter).
- Assembly Phase reaches `integrated` for engaged accounts — every one of
  the 18 self-assembly modules has moved off `Dormant`.
- Existing copy: *"Nine months. The self-care practice is a habit now."*

### Month 10 — "Almost there"
- Export Data unlocks (Level 25 territory) — the person's compressed
  story becomes portable, echoing the LOT philosophy line "Your story,
  your data."
- Existing copy: *"Ten months. Almost there."*

### Month 11 — "One more"
- Narrative Reflection unlocks (Depth 66% + Level 30 territory) — the
  RPG narrative widget starts writing in first person about the
  account's own arc, not a generic template.
- Existing copy: *"Eleven months. One more."*

### Month 12 — "The portrait is complete — and still evolving"
- **Coherence Chapter — Year One Memory Story.** The full compression of
  12 months into one narrative, closing the CQGS doctrine's "6–12mo
  Coherence" window and opening onto "12mo+ Hardware" (the same document
  ties this straight into COSMO / NODE-0 hardware roadmap territory,
  `docs/corporate/LOT-FEATURE-INVENTORY-2026.md` §15 — outside this
  document's scope, but the naming continuity is deliberate). This
  narrative is the artifact that becomes the Memory Story block on the
  public profile (`PublicProfile.tsx` L356–363), mirrored from the
  in-app widget.
- Board Profile fields go live for the first time if not already earned:
  Citizen Index summary, Biofield State, Activity rollup, Memory Engine
  tier, Clearance level — this is the exact block the `machiavelli` demo
  shows permanently. At month 12 it stops being a demo and becomes this
  account's real profile.
- QR Code becomes available if Assembly Phase ≥ `forming` (true for
  virtually every engaged account by now).
- A **month 13+ state** is intentionally undefined in copy — the existing
  fallback (`Month ${monthNumber}. The journey continues.`) already
  handles it, and correctly refuses to promise a "month 13 unlock."
  Growth continues on the activity engines; tenure has done its job.
- Existing copy: *"One year with LOT. The portrait is complete — and
  still evolving."*

---

## 04  THREE WIDGETS — SPEC

Written to the existing widget template
(`docs/technical/LOT-STYLE-GUIDE.md` §Component Architecture): `Block` +
`blockView`, label-click cycling, 2–3 views, fade-out on dismiss, database
logs not localStorage for anything cross-device, no emojis, periods not
checkmarks.

### 04.1 Monthly Congratulations — extend `MonthlyPulseWidget.tsx`

Already built and already good. Two additive changes, no rewrite:

1. **Second view via label-click cycling** (`Pulse:` → `This Month:`).
   Currently the widget is single-view. Add a second view that pulls the
   month's Monthly Digest paragraph (§04.2) inline, so the celebratory
   moment and the substance sit in the same widget instead of two.
2. **Badge tie-in line.** When a badge unlocked *during this specific
   calendar month* (Droplet/Wave/Current, or any milestone badge with a
   `unlockedAt` timestamp in-month), append one line under the existing
   message: e.g. `Wave badge earned this month.` No icon, no confetti —
   just the fact, in the same voice as everything else in the system.

```tsx
// MONTH_MESSAGES stays exactly as-is.
// New: second cycling view, reusing the existing Block/onLabelClick pattern.
const [view, setView] = useState<'pulse' | 'digest'>('pulse')
const label = view === 'pulse' ? label : 'This Month:'
```

Data source: no new endpoint required for the badge line — badge unlock
timestamps already exist in the badge system; filter to current calendar
month client-side, same pattern as the existing `monthNumber` calculation.

### 04.2 Memory Digest Widget — net-new, in-app surface for the Monthly Summary job

The single highest-leverage gap: **Monthly Summary (background job #15)
currently only reaches the inbox.** A Usership subscriber checking their
System in-app never sees it. This widget puts it where the person actually
is.

- **Views** (label-click cycling, matching Memory widget's own pattern):
  `Insight:` → `Compare:` → `Chapter:`
  - `Insight:` — the one-paragraph compressed insight from last month,
    in the Memory Engine's own voice. This is exactly the "paragraph-long
    insight from last month" requested — reuse the Monthly Summary
    generation pipeline (Together AI, same infra as the Weekly
    Story-Report), just render it in-app instead of only emailing it.
  - `Compare:` — one line contrasting this month's dominant pattern
    against last month's (e.g. "Evening reflection replaced morning
    check-ins as the dominant window.") — grounded in real log-time
    distribution, not invented.
  - `Chapter:` — visible only in months 3, 6, 12: the Calibration,
    Pattern, or Coherence chapter (§05) instead of the monthly paragraph.
- **Visibility gate:** Usership tag, and only after the Monthly Summary
  job has run for the current month (first appearance ~1st of the month,
  matching job #15's schedule).
- **Persistence:** server-side (the digest text is already generated and
  stored for the email job — reuse the same field, don't regenerate).
- **Voice example** (not final copy, illustrative of register):
  > *Insight: February leaned quieter than January — fewer memory
  > answers, more unprompted notes. The system read that as depth, not
  > disengagement: the notes ran longer and returned to the same three
  > themes each time.*

### 04.3 "Months Unlocked" context strip

The requested `Months unlocked: 3/12` framing **already exists** as the
`{capped} / 12 months` line inside `MonthlyPulseWidget.tsx` L133–135 — it
just currently only shows while the monthly pulse is visible (once per
month, dismissible). Two options, in order of preference:

1. **Preferred — promote it, don't duplicate it.** Surface the same
   `N / 12 months` line as a persistent secondary metric inside the
   System Progress widget's Deployment view (`System Progress Widget`,
   `docs/technical/WIDGETS.md` L229), next to build version and assembly
   summary — it already lives in a "here's where the system stands"
   context, and 12-month tenure belongs there permanently, not only in
   the once-a-month celebratory pop-in.
2. **Alternative — standalone strip**, only if product wants it visible
   independent of System Progress: a single-line, non-dismissible,
   Usership-gated context widget, e.g.:
   `Months unlocked: 3/12 · next: Calibration Chapter`
   The "next:" clause previews the *next checkpoint*, not a guaranteed
   unlock — consistent with §00's principle that months pace, not gate.

Avoid a progress bar. LOT's metrics philosophy
(`LOT-STYLE-GUIDE.md` §Metrics & Growth Philosophy) explicitly favors
text over decorative fill — a numeric ratio in the existing house
typography does the job without introducing a new visual primitive.

---

## 05  MEMORY COMPRESSION — THE 12-MONTH DELIVERY SPEC

This is the mechanism the whole document hangs off, so it gets its own
section.

```
DAILY      → weekly Story-Report (existing, job #10, Sun/Mon)
WEEKLY     → monthly digest paragraph (existing generation, job #15 — currently email-only, §04.2 surfaces it in-app)
MONTHLY    → Calibration Chapter @ month 3, Pattern Chapter @ month 6 (net-new — closes CQGS 0–3mo / 3–6mo arc windows)
QUARTERLY  → Coherence Chapter — Year One Memory Story @ month 12 (net-new — closes CQGS 6–12mo arc window)
ANNUAL     → Board Profile Memory Story block (existing field, PublicProfile.tsx L356–363 — becomes populated FROM the Year One compression instead of an ad-hoc generation)
```

The chapter names and windows (Calibration / Pattern / Coherence /
Hardware) are not invented for this document — they are the CQGS Memory
Arc doctrine already on file
(`docs/corporate/CQGS-WHITE-PAPER-SNAPSHOT.md` §III, Layer 4). This
section is that doctrine's first concrete UI implementation.

Each tier is a **further compression of the tier below it**, not an
independent generation — this matters for cost (reuse Together AI outputs
rather than re-summarizing raw logs three times) and for narrative
coherence (the Year One Story should read as the natural conclusion of
the Calibration and Pattern chapters, which read as the natural
conclusion of twelve monthly digests, which read as the natural
conclusion of fifty-two weekly reports). The compression loop already
described in
`docs/corporate/LOT-AI-PRODUCT-BRIEF.md` (`LOG → OBSERVE → COMPRESS → ASK
→ COMPRESS AGAIN`) extends cleanly: this just adds three more compression
rungs above "weekly."

**Tangibility test for each rung:** the person should be able to point to
a specific screen and say "that's this month" / "that's this chapter" /
"that's my year." Today only the weekly rung and the (email-only,
functionally invisible) monthly rung exist. The Calibration, Pattern, and
Coherence chapters are the actual net-new work this document is
proposing — everything else in §04 is UI plumbing to surface generation
that mostly already runs.

**Public mirroring:** the Year One Story is the only tier that should ever
sync to the public Board Profile Memory Story field by default — monthly
and chapter-level digests stay private, in-app only, unless the person
explicitly re-shares. This matches the existing privacy model
(`privacySettings.showMemoryStory` toggle, opt-in per field) and avoids
turning the public profile into a running diary.

---

## 06  VISUAL EVOLUTION LANGUAGE (tie-in, not new system)

No new visual system is proposed. The Interface Evolution engine
(`docs/technical/INTERFACE_EVOLUTION.md`) already computes exactly the
kind of "the UI itself looks different by month 12" effect requested —
this document just asks that its existing milestone thresholds (25% / 50%
/ 75% / 95% overall maturity) be read against the month table in §02 when
writing onboarding copy and screenshots, so marketing and product describe
the same curve. A month-1 screenshot and a month-12 screenshot
(`machiavelli`) should differ in exactly the ways
`--evolution-base-opacity`, `--evolution-grid-opacity`, and
`--evolution-glow-intensity` already differ — nothing hand-tuned per
month, the existing formula already produces this if activity tracks the
band in §02.

---

## 07  WHAT IS ALREADY LIVE vs. NET-NEW

| Item | Status |
|---|---|
| Monthly Pulse widget, 12 messages, `N/12` display | **Live** — `MonthlyPulseWidget.tsx` |
| Weekly Story-Report | **Live** — background job #10 |
| Monthly Summary generation | **Live, email-only** — background job #15 |
| Board Profile end-state (Citizen Index, Biofield, Activity, Memory Engine tier, Clearance) | **Live** — `PublicProfile.tsx` L288–325 |
| Assembly Phase gate on QR code | **Live** — `PublicProfile.tsx` L611–663 |
| Interface Evolution visual system | **Live** — `interfaceEvolution.ts`, `evolution.ts` |
| Monthly Pulse: second cycling view + badge tie-in line | **Net-new**, §04.1 — additive to existing component |
| Memory Digest widget (in-app surface for Monthly Summary) | **Net-new**, §04.2 — reuses existing generation pipeline |
| Calibration Chapter (month 3) / Pattern Chapter (month 6) | **Net-new**, §05 — new compression rung implementing the existing CQGS Memory Arc doctrine |
| Coherence Chapter — Year One Memory Story (month 12) | **Net-new**, §05 — new compression rung, feeds existing Board Profile field |
| `N/12` promoted into System Progress Deployment view | **Net-new**, §04.3 option 1 — UI placement only, no new data |

---

## 08  SUCCESS CRITERION

A Usership subscriber, asked at any point in the year "has this app changed
since you started," should be able to answer without checking a changelog —
by pointing at their own Memory Digest, their Assembly map, their Board
Profile fields lighting up one at a time. If the honest answer to "what's
different this month" is ever "nothing, we just showed you a number," the
month has failed §00's thesis. Every month in §03 above ties its
celebration to something the person actually did.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION                                        LOS ANGELES, CA
================================================================================
