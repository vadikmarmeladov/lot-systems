# LOT® USERSHIP — THE 12-MONTH EVOLUTION
**From Barebone Day One to LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · August 2026 · brand.lot-systems.com

---

## 0. Premise

A Usership member ($99/mo, `UserTag.Usership`) pays for one thing above the free tier: **the system starts talking back with more of itself, on a schedule that mirrors a year of their own life.**

Today that arc already half-exists in the codebase, scattered across three components that don't yet know about each other:

| Existing hook | File | What it already does |
|---|---|---|
| Monthly milestone toast | `MonthlyPulseWidget.tsx` | 12 hand-written messages, one per month, `"{n} / 12 months"` counter, Usership-gated |
| Board identity record | `src/shared/types/index.ts` → `boardProfile` | `boardMemberNumber`, `citizenSince`, `boardTenureMonths`, `activity.journalEntries`, `activity.memoriesCompiled`, `activity.activeDays` |
| Self-Assembly map | `SystemProgressWidget.tsx` | 12 modules (Biofield Engine, Memory Architecture, Routine Compiler, Intention Core, Cleanness Protocol, Reflection Layer, Community Mesh, Ecosystem Bridge, Quantum Substrate, Nutrition Protocol, Goal Architecture, Archetype Classifier), each with 5 phases: Dormant → Awakening → Forming → Assembled → Integrated |

Nobody designed these to line up 1:1 with a calendar year — but they do, almost exactly. This document proposes locking that alignment: **Month N of Usership = Module N assembling, badge tier N unlocking, Memory Story chapter N compressing.** The demo account at `lot-systems.com/u/machiavelli` is what Month 12+ looks like once this is stitched together; a brand-new Usership sign-up today is what Month 0 looks like. The distance between those two screens *is* the product.

**Docs read for this session:** `README.md`, `docs/README.md`, `docs/technical/LOT-STYLE-GUIDE.md`, `docs/technical/WIDGETS.md`, `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`, `docs/technical/MEMORY-ENGINE-TIMELINE.md`, `docs/corporate/LOT-AI-PRODUCT-BRIEF.md`, `docs/assembly/2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md`, plus direct reads of `MonthlyPulseWidget.tsx`, `PublicProfile.tsx`, `src/shared/types/index.ts`, and a structural pass over `badges.ts`.

---

## 1. The Governing Rule

> **Nothing about Month N is announced by copy alone. Something the user can point at must have changed.**

Concretely, every month-turn does all four of these, never fewer:
1. A **module** in the Self-Assembly map advances a phase.
2. A **badge** tied to that month's tenure threshold unlocks.
3. The **Memory Story** gains a new, dated chapter compressed from that month's logs.
4. The **public profile** (`/u/username`) visibly looks different than it did 30 days ago.

If a month can't produce all four, the month doesn't ship as "complete" — this is the tangibility test for every row in the table below.

---

## 2. The Two Inputs That Actually Drive Advancement

The user named these explicitly, and they map to fields that already exist:

- **Log density** → `boardProfile.activity.journalEntries` + `memoriesCompiled`. Not a vanity counter — it is read by the Memory Engine's compression pass (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8) to decide whether a monthly Story chapter has enough source material to write well. Thin months get an honest, shorter chapter — never a padded one.
- **Check-in / self-care regularity** → `activity.activeDays`, plus existing `self_care_completed` / `emotional_checkin` log events. This is what should gate *phase advancement* (below), not raw tenure — a Usership member who pays but never opens the app should see monthly tenure tick up, but their Self-Assembly modules should visibly stall at "Awakening." Time bought ≠ evolution earned. That distinction is the whole emotional stakes of the arc.

Advancement formula per module, per month:
```
phase advances IF activeDays_thisMonth >= 12   (≈ 3x/week)
phase holds    IF 4 <= activeDays_thisMonth < 12
phase can regress one step IF activeDays_thisMonth < 4 for 2 consecutive months
```
Regression is rare and gentle (never below "Forming" once reached) — the point is that the map is alive, not a progress bar that only goes up regardless of behavior.

---

## 3. Month-by-Month Structure

Each row: the module that assembles, the badge tier, the Memory Story compression grain, and the celebration copy. Widget/badge names in *italics* are proposed additions; unmarked names already exist.

| Mo. | Self-Assembly module → phase | Badge unlocked | Memory Story chapter grain | New-month celebration line |
|---|---|---|---|---|
| **0** | *(none — barebone)* | *(none)* | none yet — raw log stream only | *(no widget yet — see §4)* |
| **1** | Biofield Engine: Dormant → Awakening | `memory_keeper_30`-class *(first 30 distinct days)* | Single paragraph, plain: what you logged, no interpretation yet | *"The first month. The system is beginning to know you."* (existing) |
| **2** | Memory Architecture: Awakening | *"Second Signal"* (uncommon) | First pattern surfaced: one repeated behavior named | *"Two months in. Patterns are starting to form."* (existing) |
| **3** | Routine Compiler: Awakening → Forming | *"Active User"* (uncommon) | First archetype hint appears in the Story's voice | *"Three months. You have reached Active User status."* (existing) |
| **4** | Intention Core: Forming | *"Quarter Deep"* (rare) | Story starts referencing Month 1 in past tense — first callback | *"Four months. The portrait deepens."* (existing) |
| **5** | Cleanness Protocol: Forming | *"Consistency Mark"* (rare) | Seasonal/temporal awareness enters the Story (weather, rhythm shifts) | *"Five months. Consistency is its own reward."* (existing) |
| **6** | Reflection Layer: Forming → Assembled | `perfect_month`-tier if earned; else *"Halfway Point"* (epic) | **Half-Year Story**: full compression of Months 1–6 into one retrospective chapter, distinct from the monthly ones | *"Six months. The journey is half-declared."* (existing) — paired with a dedicated Half-Year widget, see §5 |
| **7** | Community Mesh: Assembled | *"Rare Air"* (epic) | Story begins cross-referencing cohort/archetype language (`ChatCatalystWidget` context folds in) | *"Seven months in. The system has been listening."* (existing) |
| **8** | Ecosystem Bridge: Assembled | *"Rare Air II"* — reuse existing `century_explorer`-track if 200+ cumulative days hit here | Story voice shifts fully first-person-adjacent (the "curious machine" tone from `LOT-AI-PRODUCT-BRIEF.md`) | *"Eight months. Rare air."* (existing) |
| **9** | Quantum Substrate: Assembled → Integrated | *"Practiced"* (legendary track begins) | Story explicitly names the practice as habitual — mirrors `MONTH_MESSAGES[9]` | *"Nine months. The self-care practice is a habit now."* (existing) |
| **10** | Nutrition Protocol: Integrated | *"Near Complete"* | Story begins previewing the coming year-close chapter | *"Ten months. Almost there."* (existing) |
| **11** | Goal Architecture: Integrated | *"Final Approach"* | Story compresses toward closure without resolving it yet — deliberate anticipation | *"Eleven months. One more."* (existing) |
| **12** | Archetype Classifier: Integrated — **all 12 modules now Integrated** | **`speedrun_record`**-class capstone badge (mythic/cosmic), permanently displayed on public profile | **The Year Story**: full compression of all 12 chapters into one paragraph-long portrait — this is what `/u/machiavelli` shows | *"One year with LOT. The portrait is complete — and still evolving."* (existing) |

Months are capped display-wise at 12 (`Math.min(monthNumber, 12)`, already the pattern in `MonthlyPulseWidget.tsx`) — Month 13+ doesn't reset, it starts a **second ring**: the same 12 modules re-enter a subtler "Integrated → Mastering" phase, and the public profile badge shelf keeps extending past Year 1. The arc doesn't end at 12; it just stops being the *onboarding* arc.

---

## 4. Month 0 — The Barebone Day

This is the state the task asked to design *from*, and it currently doesn't exist as a distinct screen — a new Usership sign-up today just gets the ordinary `System.tsx` stack with every conditional widget suppressed by empty data. That's actually close to correct, but it should be *deliberately* bare, not incidentally bare:

- No `MonthlyPulseWidget` (month 0, `monthNumber < 1` already suppresses it — correct, keep).
- No Self-Assembly modules rendered at all — not "Dormant" labels, just absent. The map itself should only appear once module 1 begins Awakening (end of week 1, not day 1), so the user isn't shown eleven greyed-out things on day one.
- One quiet, permanent element: a single-line footer under the log composer — `Day 1 · Usership begins.` — using the existing `journeyData.daysSinceStart` counter pattern from `System.tsx`, just surfaced earlier and smaller than it currently is.
- The **first** widget a Usership member should see that a free-tier member never sees is not a badge or a module — it's the `SubscribeWidget`'s successor state: a one-line confirmation, no animation, no fanfare. *"Usership active. The system will check in as it learns you."* Understated on purpose — the payoff is supposed to feel earned over months, not front-loaded.

---

## 5. The New-Month Ritual — Widget Spec

Three proposed additions, all extending existing patterns rather than new subsystems:

### 5.1 `MonthlyPulseWidget` → gains a Memory paragraph
Currently the widget shows one hardcoded line + a fraction. Extend it to a second view (existing clickable-label-cycling pattern, `LOT-STYLE-GUIDE.md` §"Clickable Label Cycling"):

```
Label: "Month 6:"          → existing hardcoded line, unchanged
Label: "Memory:" (click)   → NEW: paragraph-long insight pulled from
                              user.metadata.lastMemoryStory, scoped to
                              just the prior month's logs, not the full
                              cumulative Story
Label: "Unlocked:" (click) → NEW: "6 / 12 months" + one line naming the
                              module that just advanced phase
```
This reuses the exact `Memory: → Reflection: → Insights:` cycling convention already documented in the style guide — no new interaction pattern to teach the user.

### 5.2 *Months Unlocked* — a standalone, always-on widget for Usership
The user's third bullet ("context-based widget 'Months unlocked: 3/12'") is distinct from the celebratory pulse — it should persist quietly in the stack year-round, not just on rollover day, the same way `SystemProgressWidget` persists. Minimal spec:

```tsx
<Block label="Months unlocked:" blockView>
  <div className="opacity-90">{cappedMonth} / 12</div>
  <div className="opacity-60 mt-4 text-sm">{modulesIntegrated} of 12 modules integrated</div>
</Block>
```
Placed in the existing "Subscriber Stack" position in `System.tsx` (alongside `CosmicUpdateWidget`/`QuantumSignWidget`), Usership-gated, no cooldown — it's meant to be a stable landmark, not a one-time toast.

### 5.3 Half-Year and Year Story — distinct from the monthly chapter
Month 6 and Month 12 don't just get a bigger badge; they get a Story of a different *kind*, generated the same way the existing Memory Story is (Together AI compression of up to 30 Q&A pairs, per `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8) but scoped to 6 or 12 months of chapters-of-chapters rather than raw logs — a compression of compressions. Cached the same way (`user.metadata`, versioned, regenerated only when input changes) so it's cheap to keep showing.

---

## 6. What Changes on the Public Profile Every Month

`PublicProfile.tsx` today renders theme, tags, weather, and an optional Memory Story string — flat, no sense of time depth. Proposed additions, all sourced from fields that already exist on `boardProfile`:

- **Citizen since** `{citizenSince}` — already modeled, just needs surfacing.
- **Tenure line** — `"{boardTenureMonths} months · Board Member #{boardMemberNumber}"`.
- **Activity trace** — `{activity.journalEntries} entries · {activity.activeDays} active days` — this is the direct, honest answer to "the amount of journal entries and thoughts put into Log" the user asked to make visible; it should read as a trace of effort, not a leaderboard stat (no ranking against other users, consistent with the style guide's non-gamification stance on comparison, even though the product does use badges internally — see §7).
- **Module shelf** — twelve small marks, filled proportional to Integrated modules. This is the single glance that makes Month 2's profile look visibly thinner than Month 11's — the tangibility test from §1, applied to the one screen other people actually see.
- **Badge shelf, capped and curated** — not all 700+ badges; the profile should surface only the tenure-milestone badges from the table in §3, in order, so the shelf itself narrates the year rather than becoming noise.

---

## 7. One Open Tension to Resolve Before Building

`LOT-STYLE-GUIDE.md` §"Metrics & Growth Philosophy" states plainly: *"No gamification: No points, badges, or leaderboards."* The live product already has 700+ badges (`badges.ts`) with rarity tiers up to `cosmic`. This document leans into badges as the primary tangibility mechanism for the 12-month arc, because the user's brief explicitly asks for them ("celebrates each month... including the badges"). That's a real contradiction between the written style guide and both the shipped product and this brief — worth a deliberate decision (update the style guide's stance, or scope badges specifically to Usership-tenure milestones as a bounded exception) before this arc gets built, not discovered mid-implementation.

---

## 8. Non-Goals of This Document

This is a design brainstorm, not an implementation plan — no code was changed in this session. Before building: confirm the phase-advancement formula in §2 against real `activeDays` distributions (it's a first guess, not measured), decide the §7 tension, and scope §5.3's compression-of-compressions cost against the existing Together AI usage budget in `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`.
