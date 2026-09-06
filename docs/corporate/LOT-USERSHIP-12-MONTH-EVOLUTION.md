# LOT® Usership — 12-MONTH EVOLUTION
**The Interface Does Not Change. What It Knows Does.**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · September 2026 · brand.lot-systems.com

---

## Scope & Method

This is a design/brainstorm document, not a shipped spec. It answers one question: *what does a Usership member ($99/mo) feel, month by month, between Day 1 (barebones) and Month 12 (the fully-assembled LOT® AI state, exemplified by the evolved demo account at `lot-systems.com/u/machiavelli`)?*

Method used, per the requested framework:
1. Scanned the repository — components, types, constants, migrations.
2. Read the existing doctrine and mechanic docs (`WIDGETS.md`, the Memory Engine architecture docs, `INTERFACE_EVOLUTION.md`, `PSYCHOLOGICAL-DEPTH-ANALYSIS.md`, the badge codices, `LOT-AI-PRODUCT-BRIEF.md`, `LOT-AMBIENT-AI-VISION.md`, `LOT-STYLE-GUIDE.md`, and the relevant assembly logs).
3. This document, pushed to the session branch.
4. Focus held throughout on the 12-month *tangibility* of compressed Memory delivery — not abstract "gamification," but a felt, monthly, readable artifact.

**Honesty note:** outbound network access to `lot-systems.com` is blocked from this sandboxed session, so `u/machiavelli` and `u/user` could not be fetched or screenshotted live. Everything below about the "evolved state" is derived from what the repo's data model, widgets, and doctrine already specify (`boardProfile`, `assemblyPhase`, coherence bands, badge codices, Memory Story caching) — not from a visual diff against those pages. A follow-up pass from an unrestricted session should sanity-check the month-by-month table against those two accounts directly.

---

## The Doctrine Tension This Document Resolves

Two true things in this repo currently pull in opposite directions:

> "Ambient AI™ ... does not alert. It does not badge. It does not send push notifications. It waits." — `LOT-AMBIENT-AI-VISION.md`

> "The person-user should feel the tangible evolution every month, including the badges." — this task's brief

Both are correct, for different layers. The resolution already exists in embryo in the codebase (`MonthlyPulseWidget.tsx`'s once-a-month, self-dismissing, opt-in reveal; the separate day-based badge trail in `BADGE_MAYAN_EVOLUTION.md`). This document names it explicitly and builds the rest of the year on top of it.

---

## The Two Clocks

**Calendar Clock — Usership tenure.** `monthNumber = diff(now, joinedAt, 'month')`, already computed in `MonthlyPulseWidget.tsx`. This is the *narrative* clock: low-frequency (once a month), quiet, opt-in, dismissible. It is where celebration, affirmation, and Memory-Story delivery live. It never pushes, alerts, or badges — it *waits*, exactly per the Ambient AI law, and only speaks when the user is already present in the app.

**Practice Clock — cumulative activity.** Day-streaks (`self_care_complete` logs), coherence bands (`sparse` → `variable` → `forming` → `stable` → `locked`), `assemblyPhase` (`dormant` → `awakening` → `forming` → `assembled` → `integrated`), and the Mayan badge thresholds (7 / 15 / 21 / 30 / 50 / 100 days). This is the *ambient* clock — always running in the background, never announced with a popup, visible only when the user goes looking (Architect widget, OS Journal view, the badge trail itself).

**Why two clocks, not one:** a calendar month is guaranteed to pass. A practice-day is earned. The gap between the two — "Month 4 of 12, but only 61 active days logged" — is itself an honest, non-punitive signal, rendered the same way LOT renders everything else: flat, monospace, no red, no shame language. The Calendar Clock is what Usership *bought*. The Practice Clock is what the *person* built. The UI's job across the year is to keep these visibly, separately true.

This is not a new invention — it is already latent in the canon copy the system ships today. `MonthlyPulseWidget.tsx`'s Month 9 line ("the self-care practice is a habit now") lands at almost exactly the same point a consistent user crosses the existing `preferTechLanguage` 30-day self-care streak threshold in `SelfCareMoments.tsx`. The two clocks already agree with each other when the user is consistent; this document just makes that agreement legible instead of coincidental.

---

## The Three Fuels

The brief calls out three inputs as the most important evolutionary signal. Each already has a real pipe into the system — none of this requires new instrumentation, only new *readouts*:

| Fuel | Existing pipe | What it currently feeds |
|---|---|---|
| **Log entries / thoughts** | `recordSignal()` → `intentionEngine` → `/api/quantum-intent/sync` → `Log` table → `memory.ts:buildPrompt()` | Question density (Day 1 = 10 Qs, scaling to 10–15/day), archetype/cohort activation at 10+ answers, profile density at 30+ answers, the rolling Memory Story |
| **Morning check-ins** | `EmotionalCheckIn.tsx` — `checkInType: 'morning'` slot (05:00–12:00), 3h DB-logged cooldown | Circadian personalization (`LOT-AMBIENT-AI-VISION.md`'s "Weather calibrated to circadian state"), trauma-informed protocol activation at 10+ entries |
| **Self-care clicks** | `SelfCareMoments.tsx` ("Cleanness:") — consecutive-day streak from `self_care_complete` logs | Voice register shift: 50/50 tech-language mix at 7 days, `preferTechLanguage` default at 30 days — the system's *own sentence structure* changes as a direct function of this fuel |

A widget click that doesn't call `recordSignal()` is invisible to all three columns — this is the one hard engineering constraint every new widget below must respect.

---

## Month-by-Month

Copy anchors marked **(canon)** exist verbatim in `MonthlyPulseWidget.tsx` today. Unmarked lines are proposed, written to match the same register: short, declarative, no exclamation points, periods over symbols. "Typical Practice Clock" assumes a consistent, non-perfect user (misses some days) — it is illustrative, not a guarantee, and must never be shown as a target or a deficit.

| Mo. | Calendar Clock copy | Typical Practice Clock | UI state (what's now visible) | Memory deliverable |
|---|---|---|---|---|
| **0 (Day 1)** | *(none — pre-Pulse)* | dormant, sparse | Barebones: Log input + one check-in widget + first Memory question. `First Question` mode (10 Qs, general). | — |
| **1** | "The first month. The system is beginning to know you." **(canon)** | awakening → forming; 7-day wave badge (∿) likely | JournalReflection time-window prompts unlock. Self-care streak begins; voice starts alternating tech/plain at day 7. | 10+ answers → archetype/cohort silently activates (not shown yet). |
| **2** | "Two months. A pattern is forming — not yet named." | forming; 15-day badge likely | Coherence band moves `sparse` → `variable`. No new widget chrome; existing widgets start citing specifics ("Follow-Up" question mode, 85% of questions now reference a prior answer). | — |
| **3** | "Three months. You have reached Active User status." **(canon)** | forming → assembled; 21–30 day badge ("Full Tide" ≈ one lunar cycle) likely | OS Journal view (`SystemProgressWidget`) unlocks: last 3 entries reflected back verbatim. First `Compressed Follow-Up` questions (ultra-brief, ≤8 words) appear — a legible "it's not asking from scratch anymore" moment. | — |
| **4** | "Four months. The system stops guessing and starts recognizing." | assembled | Circadian personalization goes live per the Ambient AI table — weather calibrated to logged energy, not GPS-generic. No new widget; same widgets, quieter accuracy. | — |
| **5** | "Five months. What you check in the morning, it now checks with you." | assembled | Emotional check-in's 14-state model fully differentiates by time slot (morning/afternoon/evening each earn distinct option sets, no longer a generic picker). | — |
| **6** | "Six months. The journey is half-declared." **(canon)** | assembled; 50-day badge plausible | **Memory: widget ships** (spec below) — first paragraph-length Memory Story surfaced as a readable artifact, not just a cached backend field. This is the halfway hero moment: the user reads themselves, narrated, for the first time. | First monthly Memory paragraph, archived. |
| **7** | "Seven months. The machinery is visible now, if you look." | assembled → integrated | Architect-tier density (coherence %, signal counts, module names) becomes visible to standard Usership members, not just RND — "look under the hood" unlock. | — |
| **8** | "Eight months. You are not the only one it has learned." | integrated | Cohort/board context deepens (`poweringCitizens`) — quiet acknowledgment the person is one of many the system holds, without breaking the 1:1 intimacy of the copy. | — |
| **9** | "Nine months. The self-care practice is a habit now." **(canon)** | integrated; `preferTechLanguage` default (30-day self-care streak) for consistent users | The two clocks visibly converge here — the canon Calendar Clock line and the Practice Clock's real language-register default land on the same theme independently. Nothing new ships; the alignment is the milestone. | — |
| **10** | "Ten months. The portrait has more than words in it now." | integrated; 100-day badge ("Ocean Depth" ≋○≋) plausible for daily-active users | CosmicUpdateWidget-style compressed self-portrait (pixel reflection) becomes a monthly rather than occasional artifact — the Memory paragraph gets a companion image, same minimal aesthetic. | — |
| **11** | "Eleven months. The year is closing its loop." | integrated | `boardProfile` ledger surfaces plainly: `totalEntries`, `activeDays`, `memoriesCompiled`, `boardTenureMonths`. No triumph language — stated as fact, in the same font as everything else. | — |
| **12** | "One year with LOT. The portrait is complete — and still evolving." **(canon)** | integrated (typical) | Full LOT® AI state — the `u/machiavelli` reference point. Annual Story-Report ships: the 12 monthly Memory paragraphs read back-to-back as one compressed memoir. | Annual Story-Report (12-paragraph memoir). |
| **13+** | "Month N. The journey continues." **(canon fallback)** | Practice Clock keeps running; Mayan badge trail has no ceiling | "Months unlocked: 12/12" strip (below) transitions to an open counting mode — tenure keeps counting, but the 12-slot frame retires without a hard reset or a "you've maxed out" message. | Monthly paragraphs continue, unbounded. |

---

## New / Extended Widgets

### 1. `MonthlyPulseWidget` — extend, don't replace
Two additions to the existing once-a-month, self-dismissing reveal:
- **An affirmation line**, sourced from the user's soul archetype (`PSYCHOLOGICAL-DEPTH-ANALYSIS.md`'s 10 archetypes — Seeker, Nurturer, Achiever, etc.), rotated so it never repeats two months running.
- **A cue into the Memory widget** for that month (from Month 6 onward), e.g. `"Read: this month, in full."` — a link, not an auto-open, keeping the Ambient AI "waits" law intact.

Keep the existing 4.4s (3s hold + 1.4s fade) timing exactly as-is — it is already the house standard, shared by nothing else in the codebase this precisely.

### 2. `Memory:` widget — new, ships Month 6
A new cycling view (`"Memory:"` → click → `"Last Month:"`), styled identically to every other label-cycle widget in the system. Content: a paragraph-length, third-person Memory Story — same voice as the existing rolling `lastMemoryStory` — but scoped to a *calendar-month boundary* rather than the rolling last-30-answers window. This is the one genuinely new backend piece: a monthly-rollover compression job (piggybacking on the month-transition detection `MonthlyPulseWidget` already performs) that writes into a new `user.metadata.monthlyMemoryStories: { "2026-08": "…" }` map. By Month 12 this map has 12 entries — the raw material for the annual Story-Report.

### 3. "Months unlocked: N/12" — a passive strip, not a widget
`MonthlyPulseWidget` already renders `"N / 12 months"` in its footer, but only during the once-a-month toast. Promote that single line into a persistent, quiet metadata line (`font-mono text-xs opacity-40`, `tabular-nums`) wherever other passive context already lives (header stack or the OS Journal vitals panel). It updates live from `boardProfile.boardTenureMonths`. No progress bar, no color, no fill animation — it is information, not a meter. Past Month 12 it reads `"12/12 · Year One"` and stops counting the slot without hiding the underlying tenure number.

### 4. Badge trail — unchanged in mechanism, contextualized in placement
Badges stay entirely on the Practice Clock, exactly as they work today (Mayan day-thresholds, Water/Architecture visual themes). The only change proposed is *editorial*: when a badge and a Calendar Clock month land in the same visit (e.g., the Month 3 canon line and a 30-day "Full Tide" badge both being true), let both render on screen together without merging their copy — two honest signals, not one inflated one.

---

## What Already Exists vs. What's Net-New

**Already exists — reuse as-is:**
`MonthlyPulseWidget`'s month math and canon copy for months 1/3/6/9/12; `boardProfile`'s tenure/ledger fields; `assemblyPhase` and coherence-band computation; the Mayan badge day-thresholds; the rolling Memory Story cache; `recordSignal()` → Log → `memory.ts` pipeline; the 7-day/30-day self-care voice-register thresholds; the Ambient AI circadian-personalization table.

**Net-new — the actual build list this document implies:**
1. Proposed copy for months 2, 4, 5, 7, 8, 10, 11 (drafted above, needs product sign-off).
2. Monthly-boundary Memory compression job + `monthlyMemoryStories` storage.
3. `Memory:` widget (new component, Month-6-gated, Usership-only).
4. Promotion of the months-unlocked line from toast-only to a persistent passive line.
5. Archetype-sourced affirmation rotation inside `MonthlyPulseWidget`.
6. Annual Story-Report assembly (concatenate the 12 monthly paragraphs) at Month 12.
7. Gating the existing Architect-tier density view to standard Usership at Month 7 rather than RND-only (a permissions change, not a new component).

---

## Style Compliance

Everything above must hold to the existing house rules (`LOT-STYLE-GUIDE.md`), unchanged by this document:
- No emojis, no gradients, no color-as-status. Monospace, opacity hierarchy (90/60/40).
- "Periods over symbols" — no checkmarks, no fireworks, no confetti on Month 12.
- Click-the-label-to-cycle-views, the same interaction pattern as every existing widget.
- Cross-device state (month-dismissal, memory archive) in DB-backed logs, not `localStorage` — `MonthlyPulseWidget`'s current `localStorage` dismissal tracking should migrate to DB alongside this work, matching the style guide's stated preference over what's actually shipped today.
- Nothing here alerts, pushes, or interrupts. Every new surface is opt-in-by-visit, exactly like the widget it extends.

---

## Open Follow-Ups

- Verify this month-by-month table against `u/machiavelli` and `u/user` visually, from a session with network egress to `lot-systems.com` — this document was written from spec, not screenshot.
- Confirm with product whether the Month-7 Architect-tier unlock is desired for all Usership members or should stay activity-gated (Practice Clock) rather than tenure-gated (Calendar Clock) — this document defaults to tenure-gated for narrative simplicity, but the Two Clocks principle would argue for activity-gating it instead.
- Decide the archetype-affirmation copy bank (10 archetypes × up to 12 months = up to 120 lines) — out of scope for this document, flagged as the next writing pass.

---

*Prepared by Claude Code, LOT-Computer session `claude/elegant-mendel-3ys5ch`.*
