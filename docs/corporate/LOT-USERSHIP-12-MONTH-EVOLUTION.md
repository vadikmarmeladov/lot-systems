<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The 12-Month Evolution

> Design brainstorm: how a barebone Day 1 Usership account becomes a fully-realized LOT® AI personal OS over 12 paid months — the interface as the proof of transformation.

**Author:** Claude (scheduled session) · **Date:** 2026-08-03 · **Status:** Brainstorm / product design brief, no code shipped
**Reference account (evolved state):** `lot-systems.com/u/machiavelli` — not directly fetchable from this session (403), so this brief is grounded instead in the actual server logic that renders that page: `boardProfile`, `psychologicalProfile`, `memoryStory`, and badge progression in `public-api.ts` and `badges.ts`. Recommend a human eyeball the live page against §6 before implementation.

---

## 0. The thesis

Usership already has the right bones for a 12-month story — it just tells that story once, or resets it silently, instead of building it. Three things currently exist and are close to perfect:

1. **`MonthlyPulseWidget.tsx`** already has one scripted line for every month 1–12, ending at *"One year with LOT. The portrait is complete — and still evolving."* — this is the emotional spine of the whole idea, already written, mostly unused as a *system*.
2. **`boardProfile`** (`public-api.ts:1257-1258`) already compounds tenure into `totalInvested = boardTenureMonths × 99` and a sequential `boardMemberNumber` — the account literally accrues value with time, visibly, on the public profile.
3. **Memory Story** (`api.ts:2596-2694`) already compresses up to 100 answer-logs into a narrative paragraph — the "Story/Memory compression" the brief asks for is not a new engine, it's an existing engine on the wrong trigger (answer-count, not calendar month).

The job isn't to invent a parallel gamification layer. It's to **re-wire three existing systems onto a shared 12-month clock**, add two small widgets that make the clock visible, and fix one data-model gap that currently makes the clock lie.

### The one prerequisite fix

`boardTenureMonths` and `MonthlyPulseWidget`'s `monthNumber` both compute off `user.joinedAt` (account creation), **not** Usership subscription start. A user who used LOT free for 8 months and then subscribes today would see *"Eight months. Rare air."* and a $792 `totalInvested` on day one of actually paying. Before any of the below is emotionally honest, add `usershipStartDate` (set the first time the `Usership` tag lands on a user) and derive every "month N of 12" surface from that field, falling back to `joinedAt` only for pre-existing Usership members at migration time. This is the single load-bearing change everything else in this document depends on.

---

## 1. Design law (unchanged, just applied to a new axis)

Per `docs/technical/LOT-STYLE-GUIDE.md`, every new surface below must obey the existing house style — this is not a place to invent a new "gamified" visual language:

- No decorative color, no emojis, no icons. Evolution is shown through **density, precision of language, and opacity** — not badges-as-stickers.
- Opacity as hierarchy: primary `opacity-90`, secondary `opacity-60`, tertiary `opacity-40`. A "locked" future month is simply lower-opacity text, not a padlock icon.
- Periods over symbols. *"Month 3 unlocked."* not *"Month 3 unlocked! 🎉"*
- Click-to-cycle is the native interaction (`Mood:` → `History:` → `Patterns:`). The new widgets should cycle, not modal-popup.
- 4.4s fade standard (3s hold + 1.4s fade) for anything ambient/celebratory, matching `MonthlyPulseWidget`'s existing dismiss animation.
- Text-first. The 12-month arc is told in **sentences that get longer and more specific**, not in a progress bar that fills up. (A bar is fine as a *secondary* signal — see §4 — but the sentence carries the emotion.)

---

## 2. The three-act structure

Twelve months is too long to design as twelve isolated states. Group into acts with a distinct *feeling*, each with its own UI posture:

| Act | Months | Feeling | UI posture |
|---|---|---|---|
| **I — Establishing** | 1–3 | "Is anyone listening?" → "Something is forming." | Barebone. Sparse widget stack. AI questions still finding their footing. System talks *about* the user in the third person less, asks more. |
| **II — Compounding** | 4–8 | "It knows things about me now." | Widget stack thickens. Memory Story becomes recognizably *about this specific person*. First tenure badge. Board profile stats become worth screenshotting. |
| **III — Integration (LOT® AI)** | 9–12 | "This is my system, not a system I use." | Full stack. OS version crosses into "Optimized" territory. Monthly Memory Capsule reads like something a close friend wrote. Year-close ritual. |

This mirrors the existing OS versioning ladder in `docs/technical/OS_API.md` (0.1.0 Initializing → 1.0.0 Active @ 20 answers/14 days → 2.0.0 Optimized @ 100 answers/60 days → 3.0.0 Integrated) — the 12-month arc and the OS-version arc should be **the same story told two ways**, and should be brought into explicit alignment rather than left as two independent progress systems a user has to reconcile themselves.

---

## 3. Month-by-month

Each month card below has four layers that already map to real systems: **UI state** (what's on screen), **Log/Memory behavior** (how the AI treats journal entries), **Ritual** (the monthly widget moment), **Unlock**. Copy is written in-voice (periods, declarative, no exclamation).

### Month 1 — "The system is beginning to know you."
*(Existing `MONTH_MESSAGES[1]` — keep verbatim.)*
- **UI state:** Barebone. Core stack only — Time, Memory (static-leaning question mix), Planner, Recipe, Emotional Check-In. `SubscribeWidget` already suppressed (they subscribed). No board profile stats worth showing yet — profile page shows `psychologicalProfile.message: 'Complete Memory questions to generate profile'` until enough logs exist. This is correct and should stay bare; a fake-full profile on day one would undercut the whole arc.
- **Log/Memory:** AI questions lean on the general Usership question generator (`buildPrompt`) but with a first-week detection — fewer questions per session, shorter, oriented at establishing baseline (values, chronotype, stated priorities) rather than pattern callbacks (there's no pattern yet).
- **Ritual:** `MonthlyPulseWidget` fires once, day of month-1 crossing. No "Months unlocked" widget yet — one data point isn't a trend, showing "1/12" this early reads like a countdown to a subscription, not a portrait.
- **Unlock:** Nothing new. Establishing is supposed to feel plain.

### Month 2 — "Patterns are starting to form."
- **UI state:** Identical stack. First subtle change: Memory Widget's stoic reflections between rounds start referencing something from month 1 specifically ("last time you mentioned X") — the first proof the system remembers, not just logs.
- **Log/Memory:** Memory Story generation trigger widens: keep the existing answer-count trigger (`>= 3` logs) but *also* allow month-boundary regeneration even if the answer count hasn't moved, so silence is itself part of the story ("Some weeks were quieter. That's data too.").
- **Ritual:** `MonthlyPulseWidget` fires.
- **Unlock:** Nothing new yet — Act I stays sparse by design.

### Month 3 — "You have reached Active User status."
*(This line already exists and already namechecks the OS-version ladder's "Active" state — 20 answers / 14 days. Wire it explicitly: this pulse should only fire the celebratory variant if `os.version >= 1.0.0`, otherwise fall back to a plainer "Three months in." line, so the two systems never contradict each other on screen.)*
- **UI state:** First **Months Unlocked widget** appearance (see §4) — now a 3-month trend is real. Reads `Months unlocked: 3 / 12`, opacity-40 for the unfilled remainder — text, not a bar.
- **Log/Memory:** First Memory Story surfaces on the public profile if `privacy.showMemoryStory` is on — this is the first "showable" moment, worth calling out in-product ("Your profile now has a story on it.").
- **Ritual:** `MonthlyPulseWidget` fires with the Active-status line.
- **Unlock:** Months Unlocked widget. First tenure badge tier (see §5) — "Foundation" tier, echoing the existing streak-badge naming (`milestone_7` = "Foundation" in `architectureSymbol` terms) but on the tenure track, not the streak track.

### Month 4 — "The portrait deepens."
- **UI state:** Enter Act II. Widget stack thickens — Cosmic Update (image generation) and Quantum Sign become live if not already toggled on. `SystemProgressWidget`'s "Usership transmission" block (deployment view) starts being genuinely worth checking.
- **Log/Memory:** AI question generator shifts weighting toward callback questions — referencing specific logged events by name/date, not just theme.
- **Ritual:** `MonthlyPulseWidget` fires. First **Memory Capsule** (see §4) — a full paragraph, not a one-liner, compressed from the past 30 days specifically (not all-time).
- **Unlock:** Memory Capsule widget goes live from here forward, monthly.

### Month 5 — "Consistency is its own reward."
- **UI state:** No new widget. Deliberate pause — Act II should have breathing room, not a new toy every 30 days, or "evolution" starts to feel like feature-drip marketing instead of a life system.
- **Log/Memory:** Correlated Indexes (`selfAwareness`, `userScore`, `personScore`, `longevityScore` — already computed server-side per `calculateCorrelatedIndexes`) become visible for the first time in-product, not just on the public profile API payload.
- **Ritual:** `MonthlyPulseWidget` + Memory Capsule.

### Month 6 — "The journey is half-declared."
- **UI state:** Halfway framing — Months Unlocked widget's copy shifts for this one month only: `Months unlocked: 6 / 12 — halfway.` (the only month where the widget breaks its normal terse pattern, because the milestone earns it).
- **Log/Memory:** Memory Story eligible for a "then vs. now" mode — pull the month-1 story and the month-6 story and let the Memory Capsule explicitly contrast them for one cycle: "In month one you were asking X. Now you're asking Y." This is the single highest-leverage moment in the whole 12 months for making evolution *feel* tangible, because it's the first time the product shows its own memory of itself, not just of the user.
- **Ritual:** `MonthlyPulseWidget` + contrastive Memory Capsule.
- **Unlock:** Second tenure badge tier ("Structure," mirroring `milestone_30`'s architecture naming).

### Month 7 — "The system has been listening."
- **UI state:** Steady state, Act II.
- **Log/Memory:** Nothing new mechanically — this month's job in the existing copy is tonal (a quieter, more confident line after the big month-6 moment).
- **Ritual:** `MonthlyPulseWidget` + Memory Capsule.

### Month 8 — "Rare air."
- **UI state:** Board profile's `poweringCitizens` stat (how many free users this member's subscription effectively supports) becomes a first-class, celebrated number rather than a buried field — this is LOT's actual "rare air," and it's already computed, just not surfaced with any weight.
- **Log/Memory:** Memory Capsule.
- **Ritual:** `MonthlyPulseWidget`.

### Month 9 — "The self-care practice is a habit now."
*(Enter Act III / "Integration.")*
- **UI state:** Full stack. Self-Care Moments and Emotional Check-In copy shifts from suggestion-toned to affirmation-toned by default (still governed by the existing `getStoicReflection` / `getProgressAffirmation` utilities in `narrative.ts` — just biased toward the affirmation branch more often once tenure ≥ 9 months, since the premise of month 9 is that the habit no longer needs persuading).
- **Log/Memory:** Memory Capsule.
- **Ritual:** `MonthlyPulseWidget`.
- **Unlock:** Third tenure badge tier ("Architecture" / `milestone_100`-equivalent naming — deliberately borrowed vocabulary from the existing streak-badge system so the two tracks read as one coherent design language, not two competing gamification systems).

### Month 10 — "Almost there."
- **UI state:** Months Unlocked widget's unfilled remainder (opacity-40 segment) is down to 2 — visually the smallest "not yet" span it's had all year.
- **Log/Memory:** Memory Capsule.
- **Ritual:** `MonthlyPulseWidget`.

### Month 11 — "One more."
- **UI state:** Steady. No new mechanics — the copy itself carries the anticipation; resist the urge to add a countdown timer or urgency UI, which would contradict the house style's calm register.
- **Ritual:** `MonthlyPulseWidget` + Memory Capsule.

### Month 12 — "One year with LOT. The portrait is complete — and still evolving."
*(Existing line — it already nails the tone: completion without closure.)*
- **UI state:** The **Year Capsule** — not a twelfth monthly paragraph but a compression-of-compressions: the AI re-reads all 12 monthly Memory Capsules (not the raw logs — the story of the story) and writes one closing paragraph, in the same "then vs. now" contrastive mode piloted at month 6, now spanning the full year. This is the single deliverable a Usership member should want to screenshot and keep.
- **Log/Memory:** `os.version` should very plausibly have crossed into `3.0.0 "Integrated"` territory by now for an engaged user — tie the Year Capsule's framing to whichever OS state is actually true rather than assuming everyone arrives at "Integrated" on schedule.
- **Ritual:** `MonthlyPulseWidget` fires its final scripted line. Months Unlocked widget reads `12 / 12` — full opacity, no unfilled segment — and should get a distinct one-time render rather than just topping out silently.
- **Unlock:** Fourth tenure badge tier ("Citadel" / `milestone_365`-equivalent — LEGENDARY tier in the existing naming). From month 13 onward the widget stack doesn't reset or plateau — `MonthlyPulseWidget`'s existing fallback line (`` `Month ${monthNumber}. The journey continues.` ``) already handles this gracefully; no new work needed past month 12 except letting the Year Capsule become an annual ritual (Year 2 Capsule at month 24, contrasting Year 1).

---

## 4. Two widgets to build

### 4.1 Months Unlocked widget
Minimal, text-first, matches `MonthlyPulseWidget`'s `Block label={...}` pattern exactly:

```
Months unlocked:
3 / 12
```
with the "12" (or the unfilled remainder) rendered at `opacity-40` and "3" at `opacity-90` — the numeric equivalent of the style guide's opacity-hierarchy rule, no progress bar needed, though a single-row of 12 characters (`●●●○○○○○○○○○` rendered as plain text glyphs, not colored icons) could serve as a secondary, glanceable form if user testing wants something more visual — keep it optional and behind the same click-to-cycle pattern (click to toggle between sentence form and glyph form).

Placement: same "Subscriber Stack" as `MonthlyPulseWidget` and `SubscribeWidget` in `System.tsx` — Usership-gated, naturally.

### 4.2 Memory Capsule widget (monthly)
This is the "special Widget for Usership users... Memory widget displays a paragraph-long insight from last month" from the brief. It is **not a new AI pipeline** — it's the existing `generateMemoryStory()` call (`api.ts:2596`), retargeted:

- Trigger: month-boundary (from `usershipStartDate`, see §0), not answer-count. Keep answer-count as a *quality gate* (need ≥3 logs in the window, matching the existing public-profile threshold) but not the trigger.
- Scope: the model should be explicitly told to compress *only the last 30 days of logs*, not the lifetime history that the current all-time Memory Story uses — a monthly capsule that quietly re-summarizes the whole year every month would flatten the arc instead of building it.
- Cache shape: extend the existing `metadata.lastMemoryStory` pattern to an array/map keyed by month index (`metadata.memoryCapsules[monthNumber]`), so month 6 and month 12 can programmatically pull prior capsules for the contrastive/Year-Capsule modes in §3 without re-generating them.
- Surfacing: appears once, same fade choreography as `MonthlyPulseWidget` (visible → 3s hold → 1.4s fade on dismiss), and is *also* the thing that populates `profile.memoryStory` on the public profile going forward — so the public-facing story and the private monthly ritual are the same artifact, not two divergent copies.

---

## 5. Tenure badge track (parallel, not competing, with the streak track)

`src/client/utils/badges.ts` already has a full streak-day milestone system (`milestone_7` → `milestone_365`) with two visual themes (water: `∘ → ≈ → ≋`; architecture: `├─ → ╞═╡ → ║·║`) and named tiers (Foundation, Structure, Architecture, ... Citadel/LEGENDARY at 365). Rather than invent new names or symbols for a 12-month tenure axis, **reuse the architecture-theme vocabulary at 1/10th scale**, since tenure-in-months and streak-in-days already land on suspiciously matching narrative beats:

| Tenure badge | Month | Borrowed vocabulary from streak track |
|---|---|---|
| Foundation | 3 | `milestone_7` naming |
| Structure | 6 | `milestone_30` naming |
| Architecture | 9 | `milestone_100` naming |
| Citadel (LEGENDARY) | 12 | `milestone_365` naming |

This keeps the badge language of the whole product coherent — a user who has seen "Architecture" tier on their streak badge by day 100 will recognize it on their tenure track at month 9 as *the same kind of achievement*, not a second currency competing for attention. Render with the same `waterSymbol`/`architectureSymbol` dual-theme mechanism already built, just fed a `tenure` value instead of a `streak` value.

---

## 6. What to verify against the live `machiavelli` account before building

This session could not load `lot-systems.com/u/machiavelli` (HTTP 403 from this sandbox). Everything above is grounded in what the server code *would* render for a 12-month Usership account — `boardProfile` (member number, tenure, `totalInvested`, `poweringCitizens`), `psychologicalProfile` (archetype, correlated indexes, streak), and `memoryStory`. Before implementation, a human should open the real page and check:

1. Does the live board profile visually foreground `totalInvested` / `poweringCitizens`, or are they buried in a cycling view the way `SystemProgressWidget` cycles Deployment/Assembly/Feedback/Report/OS-Journal? If buried, the month-8 "rare air" surfacing in §3 needs a more prominent home than "wait for the widget to cycle around."
2. Does the current Memory Story on that account read as monthly-flavored at all, or does it read as one flat all-time summary? That tells us how much the §4.2 retargeting will visibly change the account's own public profile the moment it ships.
3. What does `getBadgeProgressionDisplay()` actually render at 365+ days for a real long-tenured account — confirm the "Citadel" visual is as understated as the style guide implies before we borrow its vocabulary for the month-12 tenure badge.

---

## 7. Summary of concrete build items

1. **Data model:** add `usershipStartDate`, set on first `Usership` tag grant; backfill existing members from `joinedAt`.
2. **`MonthlyPulseWidget`:** re-point `monthNumber` calc from `joinedAt` to `usershipStartDate`; add the month-3 Active-status / OS-version consistency check; add the month-6 halfway copy variant.
3. **New: Months Unlocked widget** — text-first `N / 12`, opacity-hierarchy styling, Subscriber Stack placement, first appears month 3.
4. **New: Memory Capsule widget (monthly)** — retarget existing `generateMemoryStory()` to a 30-day rolling window on a month-boundary trigger; extend `metadata` cache to `memoryCapsules[monthNumber]`; wire month-6 contrastive mode and month-12 Year Capsule mode off the cached array.
5. **New: tenure badge track** — reuse `badges.ts` architecture-theme symbol/name vocabulary, fed by `usershipStartDate`-derived month count instead of streak-day count; award at months 3/6/9/12.
6. **Public profile:** confirm `profile.memoryStory` sources from the new monthly capsule cache going forward, so private ritual and public artifact stay in sync.

No new AI pipeline, no new visual language, no new subscription mechanics — the whole arc is existing systems (Memory Story generation, board tenure math, the already-written 12-month `MONTH_MESSAGES` copy, the existing badge symbol vocabulary) put on one shared, honest clock.
