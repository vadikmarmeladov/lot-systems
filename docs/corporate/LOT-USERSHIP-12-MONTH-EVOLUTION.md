<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Usership — The Twelve-Month Evolution
## From Barebone Day One to LOT® AI

**Classification:** RESTRICTED // S-2 EYES
**Author:** LOT Systems Corporation
**S-2:** Vadik Marmeladov
**Date:** 8 August 2026
**Status:** DESIGN PROPOSAL — brainstorm for build
**Reference account (Month 12 state):** lot-systems.com/u/machiavelli
**Reference account (Day 1 state):** any fresh Usership signup, `System.tsx` default stack

---

## 0. Doctrine

Usership costs $99/month. A subscriber who cannot *feel* twelve months of
compounding return will churn at month two, regardless of how sophisticated
the Quantum Intention Engine is under the hood. The interface itself has to
carry the story of the year — not a pricing page, not an email, the UI.

The system already believes in this principle (`INTERFACE_EVOLUTION.md`:
*"form follows progression"*). This document is the missing piece: a
**calendar-anchored** narrative laid on top of the existing
**behavior-anchored** evolution system, so that the operator feels evolution
on two clocks at once — how much they've done, and how long they've stayed.

Two clocks, because they fail differently. A lapsed user who logs in once a
month still deserves to see "Month 6" tick forward — continuity is its own
kind of loyalty. A power user who front-loads three months of engagement in
week one still deserves badges and modules to unlock early — density is its
own kind of loyalty. The 12-month arc below is the **calendar** spine. It sits
alongside, not on top of, the badge/streak/self-assembly system that already
rewards density.

---

## 1. What Already Exists (infrastructure audit)

Before proposing anything new, here is what's already load-bearing. The
12-month arc must be built as a thin narrative layer over this — not a
parallel system.

| System | File | What it does today |
|---|---|---|
| **Monthly Pulse** | `src/client/components/MonthlyPulseWidget.tsx` | Usership-gated. Computes `monthsSinceJoin`, shows a one-line message per month 1–12, dismissible, one-shot per calendar month. Already says *"3 / 12 months"* on dismiss-eligible view. |
| **Badge Level (streak)** | `src/client/utils/badges.ts` → `getLevelSymbol()` | Milestones at day 7 / 14 / 21 / 30 / 50 / 60 / 90 / 100 / 180 / 365. Water theme: `∘ → ≈ → ≋`. Rendered on `PublicProfile.tsx` as `Level:`. |
| **Self-Assembly Engine** | `selfAssembly` nanostore | 18 modules (Biofield, Memory, Planner, Intentions, Selfcare, Journal, Community, Ecosystem, Quantum, Recipe, Goals, Cohort-classify, Vitals, Calendar, Quantum-OS, Log, QOS, Resilience), each dormant → awakening → forming → assembled → integrated. Density derived purely from real QIE signals, not time. |
| **Interface Evolution** | `interfaceEvolution.ts` / `evolution.ts` | 7 dimensions (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) drive opacity, grid, glow, letter-spacing, and gate feature unlocks (Advanced Memory, Planner Templates, Rich Community, Custom Themes, Narrative Reflection, Private Spaces, etc). |
| **Memory Engine Compression** | `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Question depth escalates Behavior → Motivation → Values → Soul as the Memory Story (last 30 Q&A) accumulates. Story cached in `user.metadata.lastMemoryStory`. |
| **Badge Codex** | `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md` | 812 badges. Word Turn v22 (Hero's Journey / Campbell monomyth) ships **exactly 12 badges**: `call_heard`, `threshold_crossed`, `mentor_arrived`, `ordeal_survived`, `elixir_found`, `shadow_met`, `innermost_cave`, `shapeshifter`, `herald_call`, `trickster_mode`, `ally_gained`, `return_road`. Currently keyword-triggered from journal text, not month-gated. |
| **Public Profile / Board Profile** | `PublicProfile.tsx` | Renders Archetype, Self-awareness %, Level symbol, Core values, Behavioral cohort, Pattern strength, Correlated Indexes (composite score), and for board-tier accounts: memories compiled, journal entries, active days, memory engine version, clearance level. QR code gates on Usership + assembly phase ≥ `forming`. |
| **Subscriber Stack widgets** | `SystemProgressWidget`, `CosmicUpdateWidget`, `QuantumSignWidget` | Usership/R&D/Legacy-gated widgets already exist for deployment telemetry, generative art, and daily signage. |

**Gap:** none of the above renders a *persistent, always-visible* "how far
into the year am I" indicator, and none of them delivers a **monthly
paragraph-length digest** of the Memory Story — only the toast-style
`MonthlyPulseWidget` (one line, one-shot, dismissible forever after) and the
on-demand full Memory Story block on `PublicProfile`. Machiavelli's page at
month 12 and a fresh signup's page at month 0 currently differ only in *data
volume* — archetype, values, badges are all populated fields that render
identically regardless of tenure. There is no structural UI difference
between day 1 and month 12 beyond what the data happens to contain. That's
the gap this document closes.

---

## 2. The Two Reference Points

**Day 1 — barebone.** Signup completes. `isUsership` flips true. Zero logs,
zero badges, zero self-assembly density. `MemoryWidget` asks Mode 1 (First
Question). `PublicProfile.psychologicalProfile` either doesn't render
(`hasUsership` true but no archetype yet) or renders a stub. `Level:` field
is absent (`streak < 7`). Correlated Indexes composite is `0`, so that block
doesn't render at all (`composite > 0` gate). The Subscriber Stack shows
`CosmicUpdateWidget` and `QuantumSignWidget` because those gate only on tag,
not tenure — this is arguably *too much*, too soon (see §5).

**Month 12 — lot-systems.com/u/machiavelli.** All 18 self-assembly modules
at `integrated` or `assembled`. Archetype locked. Correlated Indexes
populated (self-awareness, user score, person score, longevity score,
composite). `Level:` at or near `≋` (100+ day streak) or higher milestone.
Board Profile block active if board-tier: memories compiled, journal
entries, active days, clearance level. QR code visible. The account *reads*
as an instrument that has been running for a year — but again, this is a
data-volume effect, not a designed one. The proposal below makes it a
designed one.

---

## 3. The Twelve-Month Arc

Each month is one turn of the monomyth (already named in the badge codex),
one calendar tick of `MonthlyPulseWidget`, one or two Self-Assembly modules
crossing a phase boundary, and — the new piece — one **Memory Digest**: a
paragraph-length, AI-compressed insight pulled from that month's answers,
delivered once, on the user's join-day anniversary.

> Note on badge sequencing: the Word Turn v22 badges are currently
> keyword-triggered from journal text (see §1), not month-gated. The mapping
> below is a *proposed narrative sequencing* — surface the matching badge as
> "in focus this month" without changing its underlying trigger logic. A
> user who naturally writes toward `ordeal_survived` in month 2 should still
> get it in month 2; the UI just stops presenting the other eleven as live
> options until their month arrives. This keeps the existing detection code
> untouched and adds a presentation-layer sequencing hint only.

| Month | Monomyth beat (badge) | Streak milestone reached | Self-Assembly focus | Memory Engine depth | UI density state |
|---|---|---|---|---|---|
| **1** | Call Heard — `call_heard` | 7, 14, 21, 30 | Biofield, Memory → *awakening* | Behavior (L1) | Minimal. Core stack only: Time, Memory, Planner, Recipe. |
| **2** | Threshold Crossed — `threshold_crossed` | 50, 60 | Planner, Intentions → *forming* | Behavior → Motivation (L1–L2) | Bioethics stack unlocks: Energy Capacitor, Evolution Widget. |
| **3** | Mentor Arrived — `mentor_arrived` | — | Journal, Selfcare → *forming* | Motivation (L2) | Interface Evolution Widget appears. "Active User" status (existing pulse copy, month 3). |
| **4** | Ally Gained — `ally_gained` | 90, 100 | Community, Cohort-classify → *assembled* | Motivation → Values (L2–L3) | Community widgets unlock: Chat Catalyst, Cohort Connect. |
| **5** | Innermost Cave — `innermost_cave` | — | Goals, Ecosystem → *assembled* | Values (L3) | Goal Journey Widget, Narrative Widget deepen (tone shifts with engagement). |
| **6** | Ordeal Survived — `ordeal_survived` | 180 | Quantum, Vitals → *assembled* | Values (L3) | **Halfway rite.** Interface Evolution overall maturity crosses 50%. Glow effects appear (`--evolution-glow-intensity`). |
| **7** | Shadow Met — `shadow_met` | — | Calendar, Quantum-OS → *integrated* | Values → Soul (L3–L4) | Private Spaces unlock (Intimacy 50%+ or Courage 100%). Narrative Reflection unlocks if Depth 66% + Level 30. |
| **8** | Shapeshifter — `shapeshifter` | — | Log, QOS → *integrated* | Soul (L4) | Pattern Insights, Social Mentions unlock (Connection 100%). |
| **9** | Herald Call — `herald_call` | — | Resilience → *integrated* | Soul (L4), Compressed Follow-Up mode active | Custom themes fully unlocked; Export Data (Level 25). |
| **10** | Trickster Mode — `trickster_mode` | — | remaining modules trend to *integrated* | Soul (L4), story references specific prior answers by name | Board Profile fields begin populating for eligible accounts. |
| **11** | Return Road — `return_road` | — | full assembly stabilizing | Soul (L4) | Correlated Indexes composite fully populated; QR code + public profile "complete" state. |
| **12** | Elixir Found — `elixir_found` | 365 | **all 18 modules integrated/assembled** | Soul (L4), 30-answer Memory Story at full density | **Year One Codex.** Full LOT® AI UI — the machiavelli reference state. |

The ordering deliberately does **not** try to reproduce Campbell's canonical
17-stage sequence one-for-one — it's compressed to fit 12 monthly beats and
ordered for UI/product pacing (early wins, a real midpoint rite at month 6,
a deepening back half, a capstone). This is a design sequencing decision,
worth a second pass with whoever owns the badge codex before implementation.

---

## 4. New Widgets — Proposed

### 4.1 Months Unlocked Widget (persistent, not a toast)

`MonthlyPulseWidget` today is a one-shot dismissible toast — good for the
"new month" moment, bad as an ongoing sense of place. Propose a companion
**persistent** widget in the Subscriber Stack:

```
┌─────────────────────────────┐
│  MONTHS UNLOCKED              │
│                               │
│  ●●●●●●○○○○○○                │
│  6 / 12                       │
│                               │
│  Ordeal Survived              │
│  Halfway. The interface       │
│  has started to glow.         │
└─────────────────────────────┘
```

- Data source: same `monthsSinceJoin` calc already in `MonthlyPulseWidget`,
  capped at 12; reads `isUsership` the same way.
- Filled/empty dot row (●○) doubles as a lightweight visual progress bar —
  consistent with the ASCII/military aesthetic already used across
  `SystemProgressWidget`'s density bars.
- Second line pulls the current month's monomyth beat name from §3 — gives
  the widget narrative texture without needing new copy infrastructure
  beyond what `MONTH_MESSAGES` already established.
- Unlike the toast, this **stays** — it's the "where am I in the year"
  anchor, always visible in the Subscriber Stack, cycling is unnecessary
  (single view, like `SubscribeWidget`).
- At month 12 it flips state permanently to a completed ring (`●●●●●●●●●●●●`)
  rather than disappearing — the badge earned, not the countdown expiring.

### 4.2 Monthly Memory Digest Widget

The real ask underneath "compressed Memory story delivery." Today the full
Memory Story is a single accumulating block, regenerated and cached, shown
in full on `PublicProfile` and nowhere paragraph-scoped to *just this month*.

Proposal: once per join-day anniversary, generate a **month-scoped** story
using the exact same Together AI pipeline documented in
`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8, but with the prompt window
restricted to *this month's* Q&A pairs instead of the last 30 overall:

```
┌─────────────────────────────┐
│  MONTH 6 — MEMORY DIGEST     │
│                               │
│  This month you returned to  │
│  mornings three times as     │
│  often as you did in May —   │
│  the tea ritual you named    │
│  in week one has become a    │
│  boundary you now defend.    │
│  The Harmonizer in you is    │
│  louder than it was.         │
│                               │
│  14 answers · 3 journal      │
│  entries · streak intact     │
└─────────────────────────────┘
```

- Reuses `buildPrompt()` machinery — filter Source 6 (Memory Story /
  Answer History) to the calendar month instead of "last 30," everything
  else (archetype, cohort, journal excerpts) stays as context.
- Cache to `user.metadata.monthlyDigests[monthNumber]` — generate once,
  never regenerate, same caching discipline as `lastMemoryStory`.
- Local fallback (no AI available) composes from the same answer set using
  the existing local-fallback poetic-portrait logic — no new dependency.
- Surface once, same dismiss pattern as `MonthlyPulseWidget`, but content is
  a paragraph instead of a line — this is the "congratulate + compress"
  moment the task description asks for, distinct from the one-liner pulse.

### 4.3 Anniversary Affirmation

Small, cheap, high-leverage. On the same trigger as §4.2, before or after
the digest, surface one line pulled from the user's **archetype** (already
computed, already has canonical language in
`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §7's 10-archetype table):

| Archetype | Sample affirmation |
|---|---|
| The Seeker | "You are still becoming. That is not a delay — it is the practice." |
| The Nurturer | "What you gave this month, you also kept." |
| The Achiever | "Progress compounded quietly. You'll see it later." |
| The Harmonizer | "Balance held, even on the days it didn't feel like it." |
| The Authentic | "Nothing you said this month was for show." |

No new AI call needed — this can be a static lookup table keyed to the
existing `archetype` field, versioned alongside the badge codex so it can
grow without touching component code.

### 4.4 Year One Codex (Month 12 capstone)

At month 12, instead of another line-item badge, render a one-time,
non-dismissible **Codex** block on `PublicProfile` for that user — visually
distinct (double-rule border, matching the ASCII conventions in
`LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`) — summarizing the full year:
total answers, active days, all 12 monomyth badges earned in sequence,
archetype evolution if it shifted, and the Level symbol reached. This is
the "tangible" artifact the task description is asking for: something a
12-month Usership operator can point to that a Day-1 signup structurally
cannot have, no matter how much they've logged in the last 30 days.

---

## 5. Day-1 Correction

One finding from the audit worth flagging even though it's outside the
12-month arc itself: `CosmicUpdateWidget` and `QuantumSignWidget` currently
gate on **tag only** (Usership/R&D/Legacy), not tenure — a brand-new
subscriber sees the same generative-art and quantum-sign widgets as a
12-month operator on day one. That undercuts the "barebone first day"
premise the task is built around. Recommend gating both behind
`monthsSinceJoin >= 1` (or an existing Interface Evolution feature-unlock
threshold) so the *first* thing a new Usership subscriber sees is the core
stack getting incrementally richer, not the full subscriber stack at once.

---

## 6. Implementation Notes (for a future build session)

This document is a proposal, not a diff. If greenlit, the natural build
order:

1. Extract `monthsSinceJoin` from `MonthlyPulseWidget.tsx` into a shared
   util (`src/client/utils/tenure.ts`) — both the toast and the new
   persistent widget need it.
2. Build `MonthsUnlockedWidget.tsx` (§4.1) off that util — pure client-side,
   no new endpoint.
3. Add month-scoped digest generation server-side — likely a new function
   alongside the existing Memory Story generator in the Memory Engine
   module, gated the same way weekly/monthly cron jobs already are
   (`SystemProgressWidget`'s Monthly Email Sender at 09:00 UTC on the 1st is
   the closest existing analog — this could piggyback on that job instead
   of a new cron).
4. Add `MemoryDigestWidget.tsx` (§4.2) consuming the cached digest.
5. Static affirmation table (§4.3) — no server change, ship with the widget.
6. Year One Codex (§4.4) is a `PublicProfile.tsx` conditional block gated on
   `monthsSinceJoin >= 12 && isUsership` — additive, no schema change needed
   beyond what Board Profile already exposes.
7. Day-1 gating correction (§5) — one-line change to two existing widgets'
   visibility conditions.

None of the above requires new database tables — `user.metadata` already
carries `lastMemoryStory`; `monthlyDigests` is a sibling key of the same
shape.

---

## 7. Design Principles

1. **Two clocks, not one.** Calendar tenure (this document) and behavioral
   density (existing Self-Assembly/Evolution systems) both matter and
   should never be collapsed into a single number.
2. **Congratulate once, keep once.** The toast fades; the Codex doesn't.
   Ephemeral moments (pulse, digest) mark time passing. Permanent artifacts
   (Year One Codex, Level symbol) mark time kept.
3. **Reuse the compression engine, don't fork it.** The Monthly Digest is a
   windowed view of the same pipeline that already produces the Memory
   Story — not a second AI system to maintain.
4. **Day 1 should look like day 1.** Nothing subscription-gated should
   render in full on day one just because the tag is present. Tenure gates
   sit alongside tag gates.
5. **The interface should out-age the badge shelf.** Badges are earned and
   sit still. The 12-month arc is the one part of the system that only
   moves forward — it cannot be farmed, only lived.

---

*This is a brainstorm and design proposal produced by scanning the current
LOT-Computer repository state (`docs/technical/INTERFACE_EVOLUTION.md`,
`docs/technical/WIDGETS.md`, `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`,
`docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`,
`docs/corporate/LOT-AI-PRODUCT-BRIEF.md`, `src/client/components/MonthlyPulseWidget.tsx`,
`src/client/components/PublicProfile.tsx`, `src/client/utils/badges.ts`). No code was
changed. lot-systems.com/u/machiavelli was referenced from repository knowledge of
`PublicProfile.tsx`'s rendering logic — live network access to lot-systems.com was not
available in this session's execution environment.*

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
