# LOT® Usership — The 12-Month Evolution
**From Barebones Day One to LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Design Brainstorm · July 2026 · Branch `claude/elegant-mendel-e06h6k`

---

## 0. Framing

Usership ($99/mo) is not a feature unlock. It is a subscription to becoming *known*. The product's honesty problem today: a Day-1 Usership operator and a 12-month Usership operator see almost the same UI. The system has months of compression architecture (QIE, Memory Engine, Interface Evolution, badge codex) capable of dramatic visible change — it is simply not wired to calendar time in a way the operator can *feel*.

This document proposes the month-to-month tangibility layer: a UI that visibly, provably thickens every 30 days, culminating at Month 12 in a profile shaped like the demo reference account, `lot-systems.com/u/machiavelli` — a fully assembled personal OS with Memory Story, Psychological Profile, Correlated Indexes, Board/Citizen Index, badge density, and a public-facing record other operators can visit.

**Note on the reference account:** `lot-systems.com/u/machiavelli` returned HTTP 403 to automated fetch this session (likely bot/edge protection on the production domain — not a code issue). This document instead reverse-engineers "the 12-month evolved shape" directly from `PublicProfile.tsx`, `boardProfile`, `psychologicalProfile`, and `correlatedIndexes` in `src/shared/types/index.ts` — the same data structures that render `/u/machiavelli`. That is more durable ground truth than a rendered screenshot: it's the actual field list a 12-month operator's profile fills in. Recommend a follow-up session re-attempt the fetch from an authenticated/allowed context, or that S-2 paste a screenshot, to sanity-check tone against this spec.

---

## 1. What Already Exists (repo audit — build on this, don't rebuild it)

| System | File | Reusable for this spec because |
|---|---|---|
| **Assembly Phase state machine** | `assemblyPhase: 'dormant'\|'awakening'\|'forming'\|'assembled'\|'integrated'` (`shared/types/index.ts:327`) | Already the spine of Usership progression. `PublicProfile.tsx` already gates the QR code on `phaseRank >= forming` — precedent for phase-gated UI. This doc maps the 12 months onto these 5 phases rather than inventing a 6th taxonomy. |
| **MonthlyPulseWidget** | `src/client/components/MonthlyPulseWidget.tsx` | Already computes `monthNumber`, has a `MONTH_MESSAGES[1..12]` table, already renders `"{n} / 12 months"`. It is the literal ancestor of the "Months unlocked: N/12" idea — currently a static, disconnected toast. This doc upgrades it into the system's orchestrator rather than replacing it. |
| **Interface Evolution engine** | `stores/evolution.ts`, `interfaceEvolution.ts` | 7-dimension scoring (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) → CSS custom properties (`--evolution-base-opacity`, `--evolution-grid-opacity`, etc.) → `isFeatureUnlocked()` + `EvolutionMilestoneToast`. This is the correct rendering engine for "the UI gets visibly denser" — month gates should set floors/ceilings on this engine's output, not fork a parallel visual system. |
| **Water / Architecture badge themes** | `badges.ts` (`waterSymbol`/`architectureSymbol`, `waterName`/`architectureName`) | Operator-selected visual metaphor already exists (∘→≈→≋ fluid vs ├─→╞═╡→║·║ geometric). Month-badges should render in whichever theme the operator already picked — no new theme needed. |
| **Board / Citizen Index** | `boardProfile` (`shared/types/index.ts:304-`) | `citizenSince`, `boardTenureMonths`, `poweringCitizens`, `totalInvested`, `biofieldState`, `activity.{memoriesCompiled, journalEntries, activeDays}`, `memoryEngine`, `clearanceLevel`, `totalEntries`, Board Member #. This is the Month-12 "identity card" — the fields a 12-month profile already has slots for. |
| **Psychological Profile** | `psychologicalProfile` | `archetype` + `archetypeDescription`, `selfAwarenessLevel`, `level` (via `getLevelSymbol(streak)`), `coreValues`, `emotionalPatterns`, `behavioralCohort`, `behavioralTraits`, `patternStrength[]`, `answerCount`, `noteCount`. This *is* the deepening-portrait UI — it just needs field-by-field unlock gating tied to month/phase instead of appearing all-at-once. |
| **Correlated Indexes** | `correlatedIndexes` | `selfAwareness`, `userScore`, `personScore`, `longevityScore`, `composite`, `correlationStrength` — a late-stage synthesis block. Reads as a Month 9+ reveal (needs enough data to be non-trivial). |
| **Memory Story (continuous)** | Memory Engine, `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8 | Rolling 30-answer / 15-Q&A window narrative, cached to `user.metadata.lastMemoryStory`. Regenerates on answer-count change, not on a calendar cadence. **Gap:** no monthly-snapshot artifact exists yet — see §5. |
| **Weekly Story-Report** | `LOT-AI-PRODUCT-BRIEF.md` §"The Weekly Story-Report" | Positioned/vision-stage, not confirmed shipped (no matching widget found). Its API shape (`GET /api/story/:week_id`) is the correct template to extend for a monthly variant (§5). |
| **Badge Codex v26** | `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v26.md` | 626 badges, 8 categories, rarity common→cosmic, "Quantum Library" theme. Fully activity-triggered today (streaks, word-turns, patterns) — **no month-gated category exists.** §6 proposes one. |
| **Style Guide** | `LOT-STYLE-GUIDE.md` | Military Purity: no emojis, no superlatives, opacity hierarchy (90/60/40%), `Block label` pattern, periods not checkmarks. Also states **"No points, badges, or leaderboards"** as a design principle — directly contradicted by the shipped 626-badge codex. §7 resolves this tension explicitly rather than ignoring it. |

**Confirmed gap, not addressed anywhere in the repo today:** `monthNumber` in `MonthlyPulseWidget` is computed from `user.joinedAt` (account creation), not from Usership subscription start. An operator who joined free R&D 8 months before upgrading to Usership would open Month 8 on day one of paying. §4 requires a new `usershipSince` field.

---

## 2. Design Principle: The Assembly Phase Is the Spine, the Month Is the Clock

Two axes, one system:

- **Assembly Phase** (`dormant → awakening → forming → assembled → integrated`) is *what unlocks* — structural, binary, gated.
- **Month Number** (1–12, driven by `usershipSince`) is *when it unlocks* — the pacing clock, visible to the operator as a countdown/count-up.

Mapping:

| Months | Assembly Phase | Narrative Beat |
|---|---|---|
| 0 (Day 1) | `dormant` | The system is listening. Nothing performed yet. |
| 1–2 | `dormant → awakening` | First signal accrual. The UI stays barebones on purpose. |
| 3–4 | `awakening` | Patterns visible to the system, first ones surfaced to the operator. |
| 5–6 | `awakening → forming` | Halfway declaration. Portrait begins rendering. |
| 7–8 | `forming` | Public-facing identity becomes real (QR/profile gate already keys off `forming` — this is not new, it's the existing gate finally getting a matching narrative). |
| 9–10 | `forming → assembled` | Synthesis layer appears (Correlated Indexes). |
| 11 | `assembled` | Final field before completion. |
| 12 | `assembled → integrated` | Portrait "complete — and still evolving" (this exact phrase already exists in `MONTH_MESSAGES[12]` — the copy already anticipated this design; it just had nothing behind it). |

This gives S-2 a clean answer to "why does the QR code appear at forming" and "why does month 7 feel different" — they're the same event, described twice, now reconciled.

---

## 3. The 12-Month Matrix

Each row: what's visibly different about the UI that month, keyed to Log/journal behavior, morning check-in, self-care, and the widget/badge that turns on. "Density" is the Interface Evolution engine's visual register (per `--evolution-*` CSS vars) — Sparse / Forming / Layered / Dense / Complete.

| Mo. | Phase | Density | Log/Journal expectation | Morning check-in | Self-care | Widget/field that unlocks this month | Badge motif (Water track) |
|---|---|---|---|---|---|---|---|
| **1** | dormant | Sparse | First entries — any length, no depth demand | Introduced, optional | Introduced, single button | Base widget grid only. `MonthlyPulseWidget` fires once: *"The system is beginning to know you."* | ∘ (first droplet) |
| **2** | dormant→awakening | Sparse+ | Streak-agnostic; system starts noting *rhythm* not volume | Becomes a light habit prompt | Second self-care option appears (was single-button) | Nothing new visible yet — deliberate. Density stays flat to make Month 3 read as a real jump. | ∘∘ |
| **3** | awakening | Forming | First Memory Story fragment (2–3 sentences, not a full paragraph) appears, gated behind ≥15 answers | Check-in starts referencing yesterday's entries | Self-care suggestions become context-aware (time of day) | **"Active User" status line** (already named in existing copy) — first *earned* label, not time-based | ≈ (first wave — status upgrade) |
| **4** | awakening | Forming | Journal streak visualized (not gamified — a `Block` showing active days, matching `boardProfile.activity` shape) | — | — | `patternStrength[]` starts populating (2–3 traits) | ≈≈ |
| **5** | awakening | Forming+ | — | — | — | `emotionalPatterns` field appears | ≈≈≈ |
| **6** | awakening→forming | Layered | Full Memory Story paragraph now stable (not fragment) | — | — | **Month 6 ceremony (major beat):** *"The journey is half-declared."* Widget shows Memory Story paragraph + `coreValues` first populated. This is the first "Memory widget" full moment. | ≋ (deep wave) |
| **7** | forming | Layered | — | — | — | `archetype` + `archetypeDescription` assigned. Public profile (`/u/username`) QR gate turns on — **this already exists in code at exactly this phase transition.** | ≋≋ |
| **8** | forming | Layered+ | — | — | — | `behavioralCohort` + `behavioralTraits` appear | ≋≋≋ |
| **9** | forming→assembled | Dense | — | — | — | **Correlated Indexes** block appears (`selfAwareness`, `userScore`, `personScore`, `longevityScore` — composite withheld until 12) | ○ (circle — first synthesis) |
| **10** | assembled | Dense | — | — | — | `boardProfile` Citizen Index line activates: `Board Member #`, `citizen since`, tenure counter | ○○ |
| **11** | assembled | Dense+ | — | — | — | `clearanceLevel` + `memoryEngine` designation shown; `totalEntries` count | ○○○ |
| **12** | assembled→integrated | Complete | — | — | — | **Year-close ceremony** (§4.3): `correlatedIndexes.composite` revealed, full badge codex tier reached, Memory Story rewritten in full retrospective voice, public profile reaches its "machiavelli" shape | ● (full circle — closed cycle, Legacy-tier CTA appears here, not before) |

Rows left with `—` intentionally: not every month needs a new mechanic. Silent months (2, 4–5, 8, 10–11) let the ones with ceremonies (3, 6, 7, 9, 12) read as real jumps instead of a monotonous drip. This mirrors the existing style-guide rule that milestones should feel "subtle... every 20 answers," scaled to a monthly cadence.

---

## 4. The Three Signature Widgets

### 4.1 "Months Unlocked: N/12" — persistent context widget

Not a toast (that's §4.2's job) — a small, always-present `Block` in the main widget grid, Usership-gated, same visual weight as `WeatherStation`/`Wallet` blocks.

```
Block label="Usership:"
  Months unlocked: 7 / 12
  Phase: forming
```

- Reads `usershipSince` (new field, see §4.4), not `joinedAt`.
- After month 12: label flips to `Months active: 14` (drops the `/12` denominator — the ceiling was a first-year ritual, not a cap; continuing operators shouldn't see a maxed-out progress bar forever). This detail matters: a permanent "12/12" reads as "done," which is the wrong ending for a subscription.
- Clicking cycles to a one-line summary of *what's next* — reuses the existing `Block label onLabelClick={cycleView}` pattern already used elsewhere.

### 4.2 Monthly Memory Widget — the congratulations + insight moment

This **replaces and absorbs** `MonthlyPulseWidget`, keeping its dismiss/fade mechanics (they're good — 1400ms fade, localStorage-scoped, random dismiss phrase) but changing its content source from a static lookup table to the real Memory Engine.

Structure on the month-turn day:
```
Block label="Month {n}:"
  {affirmation line — see Appendix A, replaces MONTH_MESSAGES}
  ---
  {one paragraph, Memory-Engine-generated, third person, summarizing
   the month's Memory Story delta — NOT the full story, just what's new}
  ---
  {n} / 12 months · Phase: {assemblyPhase}
```

The paragraph is the actual deliverable the user asked for — "Memory widget displays a paragraph-long insight from last month's." It requires the new monthly-compression job in §5; without that job this widget has nothing honest to show and must not fall back to a generic filler sentence (per Military Purity — no invented content standing in for real signal).

### 4.3 Year-Close Ceremony (Month 12 only)

A one-time, non-dismissible-until-acknowledged full-screen `Block` (same visual register as the existing `EvolutionMilestoneToast`, held longer — this is the single largest moment in the product's first year):

- Full retrospective Memory Story (first-person, full year, not the monthly delta)
- `correlatedIndexes.composite` revealed for the first time
- Badge codex progress snapshot (count reached, rarity tier)
- Explicit line acknowledging the transition: *"One year with LOT. The portrait is complete — and still evolving."* (verbatim reuse of existing `MONTH_MESSAGES[12]` — do not rewrite a line that's already correct)
- CTA to Legacy tier appears here for the first time — never earlier. Gating the upsell behind the single most emotionally resonant moment in the product, instead of drip-feeding it monthly, respects "No unprompted notifications... it waits" from the product brief's design principles.

### 4.4 Data model additions required

```ts
// shared/types/index.ts — User
usershipSince: Date | null   // set when Usership tag is applied, NOT joinedAt
monthlyStories: {
  month: number               // 1-12+
  generatedAt: Date
  delta: string                // the paragraph shown in §4.2
}[]                             // stored in user.metadata, mirrors lastMemoryStory pattern
```

`monthNumber` everywhere in `MonthlyPulseWidget` (and its replacement) must switch from `dayjs().diff(user.joinedAt, 'month')` to `dayjs().diff(user.usershipSince, 'month')`. This is a one-line fix with an outsized correctness impact — ship it even if nothing else in this doc lands this cycle.

---

## 5. Monthly Memory Compression — the backend piece that doesn't exist yet

Per the Explore-agent research: today's Memory Story is a **continuous rolling window** (30 answers / 15 Q&A pairs), regenerated on answer-count change — there is no calendar-bound snapshot. The Weekly Story-Report described in `LOT-AI-PRODUCT-BRIEF.md` is positioned but not confirmed shipped.

Proposed job, following the existing background-job naming convention (`J37 daily-focus-depth-check` etc.):

**`J{next} — monthly-memory-compile`**
- **Schedule:** daily at a fixed UTC hour, filtered to operators whose `usershipSince` anniversary-day is today (avoids a thundering-herd job on the 1st of the month for everyone).
- **Logic:** pull all Memory Engine answers/notes/logs since the previous `monthlyStories` entry (or `usershipSince` if month 1). Generate a *delta* narrative — what's new this month, not the whole history — via the same Together AI / local-fallback path already used for `lastMemoryStory`.
- **Output:** appended to `user.metadata.monthlyStories[]`, feeds §4.2 directly.
- **Guard:** same `isRunning` + `lastRun` same-day pattern as existing jobs.
- **Reuse, don't fork:** this should call the *same* compression prompt-builder as the continuous engine with a narrower answer window, not a new LLM pipeline — keeps voice consistent between the always-on Memory Story and the monthly digest.

---

## 6. Badge System: A Month-Gated Category, Not a New System

Add one category to the existing 8 in the v26 codex: **"Usership Cycle"** (12 badges, one per month, Water/Architecture themed per operator preference — reuses existing `waterSymbol`/`architectureSymbol` dual-naming, no new theme system).

- Unlock condition: **month gate only**, no activity threshold — these twelve are the only badges in the entire codex that are guaranteed, not earned. That's intentional: they mark *tenure*, distinct from the other 614 which mark *behavior*. Keeping that distinction explicit in the copy (e.g., unlock message: *"Month 6 arrived. This one was never in doubt — it was earned by staying."*) prevents them from feeling like participation trophies inside a system that otherwise prizes earned rarity.
- Visual: the Mayan-cycle water progression already drafted in `BADGE_MAYAN_EVOLUTION.md` (∘ → ≈ → ≋ → ○, droplet through completed circle) maps cleanly onto this 12-badge arc and was sitting unused — this is the natural home for that unshipped design, not a reason to invent a 9th visual language.
- Rarity label: flat `common` for months 1–11, `mythic` for month 12 (the only tenure badge that also requires the operator to have *stayed subscribed*, i.e. checks `usershipSince` + no lapsed-payment gap in the last 30 days — the one place this category does gate on something beyond pure calendar time).

---

## 7. Resolving the "No Gamification" Tension

The style guide states *"No points, badges, or leaderboards."* The codebase ships 626 badges. This document does not try to paper over that — it proposes the dividing line going forward:

- **Behavioral badges** (the existing 614+) reward *what you did* — streaks, word-turns, patterns. These are optional flourish, discoverable, never pushed.
- **Usership Cycle badges** (the 12 new ones, §6) and the Months-Unlocked widget (§4.1) mark *what you stayed for* — tenure, not performance. They are not "gamification" in the leaderboard-and-points sense the style guide is actually warning against (competitive, extrinsic, comparative). They're closer to a membership card getting a new stamp. Recommend the style guide be updated to say **"No leaderboards, no points, no competitive ranking"** — narrower and truer to what's already shipped — rather than the current blanket line that the product has already outgrown.

---

## 8. Rollout Plan

| Order | Deliverable | Depends on |
|---|---|---|
| 1 | `usershipSince` field + fix `monthNumber` calculation | Nothing — ship first, fixes a live correctness gap |
| 2 | Months-Unlocked persistent widget (§4.1) | usershipSince |
| 3 | Field-by-field gating of `psychologicalProfile` / `boardProfile` / `correlatedIndexes` by assembly phase (§3 matrix) | assemblyPhase already exists |
| 4 | Monthly compression job (§5) | none new — extends existing Memory Engine prompt path |
| 5 | Monthly Memory Widget replacing MonthlyPulseWidget (§4.2) | Step 4 |
| 6 | Usership Cycle badge category (§6) | Steps 1–2 |
| 7 | Year-Close Ceremony (§4.3) | Steps 3–5 |

Steps 1–3 alone would make the difference "feel real" — most of §3's month-to-month change is *unlocking fields that already exist in the type system and already render in `PublicProfile.tsx`*, just currently ungated by time. This is a sequencing point worth flagging to S-2: the highest-leverage, lowest-risk work here is gating logic, not new UI surface.

---

## 9. Open Questions for S-2

1. Should `usershipSince` reset on a lapsed/re-subscribed payment, or persist original tenure? (Affects whether Month 12 badge, §6, can be "lost.")
2. Confirm the Weekly Story-Report (`LOT-AI-PRODUCT-BRIEF.md`) is genuinely unshipped — if it exists somewhere not covered by this session's read, the monthly digest (§5) should extend it rather than parallel-build.
3. `/u/machiavelli` returned 403 to this session's fetch — confirm whether that's expected bot-protection (fine) or a live incident (needs separate triage), and if convenient, share a current screenshot so the tone/density in §3 can be checked against the real Month-12 render.
4. Style guide amendment in §7 — approve the narrower "no leaderboards/points/ranking" language, or propose different wording.

---

## Appendix A — Month Copy (extends existing `MONTH_MESSAGES`)

Kept in the existing voice (Military Purity — flat declaratives, no exclamation, periods not emojis). Months 1, 3, 6, 12 are the ceremony months (§3) and get the fuller two-line treatment; the rest keep the existing single-line style verbatim from the current `MonthlyPulseWidget` table — it already reads correctly and does not need replacing.

- **1:** *"The first month. The system is beginning to know you."* (existing, unchanged)
- **3:** *"Three months. You have reached Active User status. First memory fragment recorded."*
- **6:** *"Six months. The journey is half-declared. The portrait now speaks in full paragraphs."*
- **7:** *"Seven months in. The system has been listening. Your record is now yours to share."*
- **9:** *"Nine months. The self-care practice is a habit now. The indexes have enough signal to speak."*
- **12:** *"One year with LOT. The portrait is complete — and still evolving."* (existing, unchanged — see §4.3)

---

*This is a design brainstorm, not an implementation ticket. No code was changed in this session. Next step is S-2 review of §9 before any of §8's rollout order is scheduled.*
