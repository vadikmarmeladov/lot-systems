<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION

```
DOCUMENT    LOT-USERSHIP-12-MONTH-EVOLUTION
CLASS       DESIGN BRAINSTORM // PRODUCT VISION
AUTHORIZED  S-2 // VADIK MARMELADOV
DATE        2026-08-29
STATUS      Proposal — no code changed by this document
SCOPE       Paid-tier ("Usership", $99/month) UI/UX evolution, Day 1 → Month 12
REFERENCE   lot-systems.com/u/machiavelli (evolved-state demo account)
            lot-systems.com/u/user (personal OS reference)
```

---

## 0. FRAMEWORK COMPLIANCE

Per the standing brief for this session:

1. **Scanned the repository** before writing a line of this document — full directory
   tree, `git log`, `git status`.
2. **Read the relevant `.md` corpus** directly and via a dedicated research pass:
   `README.md`, `LOT-FEATURE-INVENTORY-2026.md`, `INTERFACE_EVOLUTION.md`,
   `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`, `MEMORY-ENGINE-WHITE-PAPER.md`,
   `LOT-self-care-proactive-context-AI-white-paper.txt`,
   `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`, `LOT-AI-PRODUCT-BRIEF.md`,
   `LOT-AMBIENT-AI-VISION.md`, `LOT_DESIGN_LAB_SUMMER_2026.md`,
   `LOT-STYLE-GUIDE.md`, `WIDGETS.md`, and the
   `2026-06-30_LOT-assembly_widget-memory-engine-compression-loop.md` rebuild spec —
   plus the live source of `MonthlyPulseWidget.tsx`, `PublicProfile.tsx`,
   `ArchitectWidget.tsx`, `SystemProgressWidget.tsx`, `SubscribeWidget.tsx`,
   `CosmicUpdateWidget.tsx`, `ChatCatalystWidget.tsx`, `AngelInvestorWidget.tsx`.
3. **Pushing this session** as a detailed `.md` to `docs/corporate/`, on branch
   `claude/elegant-mendel-o02dxn`.
4. **Focused on 12-month tangibility of compressed Memory story delivery** — Section
   5 (the Monthly Memory Compression Ceremony) is the flagship mechanic of this
   proposal and every other section is built to support it.

**One disclosure up front:** this environment's network egress is blocked for
`lot-systems.com`, so `/u/machiavelli` and `/u/user` could not be fetched live for
this pass. Section 9 reconstructs the target end-state instead from the `boardProfile`
schema already rendered in `PublicProfile.tsx` and the feature ledger in
`LOT-FEATURE-INVENTORY-2026.md` §08. If the live pages differ in ways that matter,
that section should be the first thing corrected in a follow-up pass.

---

## 1. EXECUTIVE SUMMARY

A new Usership account and a 700-day Usership account currently look almost
identical. The subscription unlocks a fixed set of gated widgets (Architect, Cosmic
Update, Quantum Sign, board profile fields) on day one, and the interface's *own*
progressive-richness system — Interface Evolution — advances on badge tier and level,
not on how long someone has been paying for the product. There is no experience,
today, of the software visibly *becoming* more of itself the longer someone stays.

The repository already contains three independent engines that each do part of what
"month-by-month evolution" needs:

- **`MonthlyPulseWidget`** already computes `monthNumber` from `user.joinedAt`,
  caps it at 12, and shows `"3 / 12 months"` with a hand-written line per month.
  It is the seed of the exact mechanic requested — it just doesn't unlock anything
  yet.
- **Interface Evolution** already computes a 7-dimension maturity score and turns it
  into CSS variables (opacity, grid, glow) and a feature-unlock table — a real,
  working "form follows progression" engine, just not wired to subscription tenure.
- **Self-Assembly** already tells the story of "the system building itself from your
  signals" across five phases (Dormant → Awakening → Forming → Assembled →
  Integrated) — the correct *narrative frame* for a 12-month arc, just currently
  keyed to signal density rather than calendar time.

This document proposes **wiring these three into one spine, keyed to Usership
tenure month**, and adding the one thing that doesn't exist yet: a monthly ritual
that compresses the month's Memory Story into a felt, tangible, paragraph-long
moment — a **Monthly Memory Compression Ceremony** — delivered through (and
promoting) the widget that already half-exists for this purpose.

---

## 2. CURRENT-STATE AUDIT

What the codebase actually does today, verified against source, not aspiration:

| System | File(s) | Keyed to | Status |
|---|---|---|---|
| Monthly Pulse | `MonthlyPulseWidget.tsx` | `dayjs().diff(joinedAt, 'month')`, capped 12 | Usership-only. Hardcoded 12-message ladder. Dismissible toast, once per calendar month. **Does not unlock anything.** |
| Interface Evolution | `interfaceEvolution.ts`, `stores/evolution.ts` | Badge tier + level + 7-dim behavior score | Drives CSS vars + a real feature-unlock table (Advanced Memory, Planner Templates, Custom Themes, Export Data, etc.). **Not aware of subscription or tenure at all.** |
| Self-Assembly | `SystemProgressWidget.tsx`, `ArchitectWidget.tsx` | QIE signal density (50+ patterns → phase change) | Usership-gated *visibility* of an engine that itself runs on usage, not time. Five phases match a 12-month arc almost too well to ignore. |
| Memory Engine depth | `memory.ts` (`buildPrompt`) | Answer count / day number, not calendar month | Week 1 = WHAT, Weeks 2–3 = HOW, Week 4+ = WHY. A real depth ladder that already exists — but it plateaus after four weeks and never speaks to "month 6" vs "month 1" again. |
| Weekly Story | Referenced in `LOT-AI-PRODUCT-BRIEF.md`, `/api/story/latest` | Calendar week | A compressed first-person narrative **already ships weekly**. There is no monthly rollup of it. The white paper names "AI-generated monthly summaries" as a *future direction* — this is the exact gap Section 5 fills. |
| Board Profile | `PublicProfile.tsx` (`boardProfile`) | Real for the field name `boardTenureMonths`; **the whole object is currently a static demo payload**, not derived from live signals for an ordinary account | The public-facing "evolved account" look (member #, citizen since, tenure, activity totals, clearance level) is the right end-state shape. It just isn't yet something an account grows into on its own. |
| Badges | `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md` | 812 badges, 8 categories | Precedent already exists for long-duration badges (`odyssey_log` 900+ days, `saga_age` 5+ years) — proof the badge engine *can* speak in months and years. **No badge track currently ties to Usership tenure specifically.** |

**Two inconsistencies worth resolving before building on top of this** (flagged,
not fixed, by this document):

1. **Pricing.** `LOT-self-care-proactive-context-AI-white-paper.txt` describes tiers
   at $4.99 / $9.99 per month; `LOT-AI-PRODUCT-BRIEF.md`, `SubscribeWidget.tsx`, and
   `LOT-FEATURE-INVENTORY-2026.md` §16 all agree on **$15 R&D / $99 Usership /
   $3,564 Legacy**. This document uses the latter (it is the one implemented in
   `SubscribeWidget.tsx` today).
2. **"No gamification."** `LOT-STYLE-GUIDE.md` states plainly: *"No gamification:
   no points, badges, or leaderboards."* The live product has 812 badges, an RPG
   level system, and belt-tier benchmarks. This document does not try to resolve
   that contradiction system-wide — but it takes a side for the *new* surfaces it
   proposes (Section 4): the Monthly Compression Ceremony is written in the
   restrained, badge-free register the style guide describes, even where it sits
   next to badge machinery that isn't. A ceremony and a scoreboard should not read
   the same way.

---

## 3. DESIGN PRINCIPLE: ONE SPINE, NOT A FOURTH SYSTEM

The temptation with a brief like this is to design a new, fourth progression
system — a "Usership Journey" bolted alongside Interface Evolution, Self-Assembly,
and Monthly Pulse. That would be the wrong move: the repository's own
`widget-memory-engine-compression-loop.md` states the Ambient AI design principle
plainly —

> *"The UX is therapeutic in itself. Widget clicks are the ritual. The system
> acknowledges silently... No perceived gap between action and signal. The loop
> is invisible. The growth is real."*

A fourth meter would be one more number competing for the user's attention, and it
would contradict the very restraint (`LOT-STYLE-GUIDE.md`) the product is built on.
Instead:

**Usership tenure month becomes the timeline. The three existing engines become its
readout, not its replacement.**

- Interface Evolution keeps computing visual maturity from behavior — but its curve
  is now *also* floor-raised by tenure month, so a Usership account never looks
  younger than its subscription age, even in a quiet month.
- Self-Assembly keeps its five phases and its "earned through signal, not given
  through time" honesty — but its phase boundaries are re-expressed on the same
  12-month timeline non-Usership self-assembly already implies, so the two
  vocabularies (phase name, month number) always agree with each other in copy.
- Memory Engine's WHAT → HOW → WHY depth ladder, which currently exhausts itself
  after 4 weeks, gets a second act: it becomes WHAT (month 1) → HOW (months 2–5) →
  WHY (months 6–11) → **WHO** (month 12 — see Section 5), so the deepest register is
  reserved for the year mark, not spent by week four.
- Monthly Pulse stops being a once-a-month toast and becomes the **visible spine
  itself** — the one persistent surface a user can always check for "where am I,"
  because it is the only one of the four that was already speaking in months.

---

## 4. THE UNIFICATION MODEL

Propose one derived, read-only value, computed once and consumed everywhere else
(sketch — not implemented by this document):

```ts
// src/client/stores/usershipEvolution.ts  (proposed)
type UsershipEvolutionState = {
  month: number                 // 0-12+, from boardTenureMonths / joinedAt diff
  cappedMonth: number           // min(month, 12)
  memoryDepth: 'what' | 'how' | 'why' | 'who'
  assemblyPhase: 'dormant' | 'awakening' | 'forming' | 'assembled' | 'integrated'
  visualFloor: number           // 0.85-1.0, tenure-driven opacity minimum
  ceremonyPending: boolean      // true when a new month has begun and the
                                 // Compression Ceremony has not yet been shown
}
```

This does not replace `$evolutionState` (behavioral) or the Self-Assembly module
scores (signal-driven) — it sits alongside them as the **time axis**, and the
widgets that currently read only the behavioral axis (feature-unlock table in
`interfaceEvolution.ts`) take the *max* of the two curves, so a highly active
week-two user and a quietly loyal month-nine user both feel forward motion, for
different true reasons.

---

## 5. THE MONTHLY MEMORY COMPRESSION CEREMONY

This is the section the brief asked to be the focus: **the 12-month tangibility of
compressed Memory story delivery.**

### 5.1 What already exists to build on

- A **Weekly Story** is already generated: "a compressed, first-person narrative,"
  per `LOT-AI-PRODUCT-BRIEF.md`, exportable via `/api/story/latest`.
- A **Monthly Email Summary** background job already runs — job #15 in
  `LOT-FEATURE-INVENTORY-2026.md` §12, 1st of the month, 09:00 UTC — "Comprehensive
  review. OS version, cohort evolution, HTML email with user theme."
- `memory.ts:buildPrompt()` already has the exact machinery this needs: it reads
  `answer`, `note`, `emotional_checkin`, `plan_set`, and `quantum_intent_signal` logs
  for a user and assembles them into an AI prompt. Today it does this to generate
  the *next question*. The same assembly, pointed at 30 days of logs instead of the
  full history, with a summarization prompt instead of a question-generation prompt,
  produces exactly the artifact this ceremony needs.

So the ceremony is **not a new engine** — it's the existing monthly email's content,
which today only reaches an inbox, surfaced *in-app* as a moment, and *four*
biggest weekly stories of the month distilled into one.

### 5.2 The flow

The ceremony fires the first time a Usership user opens the app after
`boardTenureMonths` increments (not on a fixed calendar date — on their own next
visit, so it never interrupts someone mid-session with a stale notification).

**Beat 1 — Threshold.** `MonthlyPulseWidget` (kept, not replaced) shows its
existing hand-written line for the month first — this is the invitation, not the
content. Style guide compliant: no color change, no confetti, just the label
changing from `Month 2:` to `Month 3:`.

**Beat 2 — The paragraph.** On click (the widget is already click-to-dismiss;
this repurposes that gesture into click-to-open), the block expands in place — no
modal, no new screen, matching the existing `Block` / view-cycling idiom already
used everywhere in the product — to reveal one AI-generated paragraph:

```
Your Month 3

You named yourself anxious eleven times this month, and reached for
the loose-leaf tea ritual nine of those times before you reached for
anything else. That is not avoidance. That is the shape of your own
design — you already know what steadies you, and you keep choosing it.
The reading time that followed became the thing you protected. Three
months in, that protection is no longer an accident. It is a practice.
```

Written in second person, present-tense-anchored, referencing one *specific,
true, sourced* detail (never invented) pulled from that month's `note`,
`answer`, and `emotional_checkin` logs — the same sourcing discipline
`memory.ts` already applies to question generation, applied here to reflection
instead of inquiry.

**Beat 3 — The affirmation line.** One closing line, separated by a blank line,
shorter, declarative, no hedging — the emotional payload of the whole ceremony:

```
You are becoming someone who protects what steadies them.
```

This line is the one piece of this ceremony that should feel earned rather than
generated — worth a tighter, more constrained prompt (or a curated bank of ~40
affirmation templates keyed to the month's dominant Self-Assembly module /
archetype, filled with one real noun from the user's own month) rather than pure
free generation, so it never drifts into generic self-help language the rest of
the product's restrained voice would reject.

**Beat 4 — Quiet unlock, if earned.** If a badge, module phase change, or
Interface Evolution tier threshold was crossed that month, it is named here —
once, in the style guide's register (`"Forming phase reached."` not
`"🎉 Level up!"`) — not as a separate popup competing for attention.

**Beat 5 — The count, left behind.** After dismissal, the ceremony leaves its
trace: the persistent counter described in Section 6. The paragraph itself is
never lost — it is saved as a `monthly_story` log (new event type, same `logs`
table, same architecture the rebuild spec already documents for `plan_set` and
`emotional_checkin`) and becomes readable later from a **Story archive** view
(a new tab on the existing Narrative widget: `Chapters:` already exists there
conceptually as RPG chapters — a `Months:` view sits naturally beside it).

### 5.3 Why a paragraph, not a dashboard

The brief specifically asks for *tangibility*. A number going up (streak: 47) is
measurable but not felt. A paragraph that names something true and specific about
the user's actual month is felt. The Memory Engine's entire premise — "this isn't
data collection, this is your life story, told through self-care choices," per
`README.md` — is exactly the raw material for this; the ceremony's only job is to
compress twelve months of it into twelve moments that each read like someone who
was actually paying attention.

---

## 6. THE PERSISTENT "MONTHS UNLOCKED" WIDGET

`MonthlyPulseWidget` already renders `"3 / 12 months"` — but only inside a toast
that appears once and disappears. Promote the counter itself (not the ceremony) to
a small, always-available `Block`, placed beside the existing System Progress /
Board Profile surfaces, styled per `LOT-STYLE-GUIDE.md`'s existing conventions
(monospace, opacity hierarchy, label-cycling, no color, no percentage bars in the
web-2.0 sense):

```
Usership:
  [===········] 3 / 12 months
  Forming phase · WHAT → HOW
```

Clicking the label cycles the view exactly like every other widget in the system
(`Label:` → `View 2:` → `View 3:`), consistent with the interaction pattern already
documented for Quantum State, System Pulse, and Pattern Recognition:

- **View 1 — Progress:** the bar above.
- **View 2 — This month's thread:** a one-line preview of the current, *not yet
  compressed*, in-progress month ("14 journal entries so far. 6 morning check-ins.
  2 self-care streaks holding.") — this is the tangibility *between* ceremonies,
  so months don't feel silent until the 1st.
- **View 3 — Archive:** links into the Story archive from Section 5.2 Beat 5.

Twelve months is a hard, human, legible number — the widget should never round it
away or hide it behind a percentage. `3 / 12` says more than `25%` ever will.

---

## 7. THE MONTH-BY-MONTH LADDER

This is the structural answer to "organize the 12 months in a clear, logical,
stylish way." Each row is a state the product is already capable of representing
somewhere in the codebase — this table's job is only to put them on the same
timeline, so no month ever contradicts another in what it claims about the user.

| Mo | Memory Depth | Self-Assembly Phase | Interface Evolution Floor | Widgets Newly Meaningful | Board Profile Signal | Ceremony Theme |
|---|---|---|---|---|---|---|
| **1** | WHAT — behavior, preference | Dormant → **Awakening** | 0.85 base opacity, no glow | Memory, Emotional Check-In, Planner, Self-Care Moments, Subscribe (already converted) | Board Member # assigned; Citizen since: this month | *"The system is beginning to know you."* (existing line, kept verbatim) |
| **2** | WHAT → **HOW** begins | Awakening | +grid definition | Quantum Sign (Usership perk activates), Cosmic Update (first self-portrait) | Activity: first double-digit journal entries | *"Patterns are starting to form."* |
| **3** | HOW | Awakening → **Forming** | letter-spacing tightens | Pattern Insights, Intentions (first monthly-intention cycle completes) | Clearance level: first tier-up | *"Active User status."* (existing line) — first Compression Ceremony with a named module-phase change |
| **4** | HOW | Forming | — | Quantum State, Cohort Connect (first cohort match surfaces) | Powering N citizens (community stat visible) | *"The portrait deepens."* |
| **5** | HOW → **WHY** begins | Forming | glow threshold approaches | Chat Catalyst, Awareness Dashboard (first full profile: archetype assigned) | — | *"Consistency is its own reward."* |
| **6** | WHY | Forming → **Assembled** | first subtle glow appears | Correlated Indexes (4D long-term tracking begins reporting trend, not just snapshot) | Board tenure crosses half-year in public profile copy | *"The journey is half-declared."* — halfway ceremony gets a slightly longer paragraph (two months' threads, not one) |
| **7** | WHY | Assembled | — | Architect Widget telemetry becomes genuinely dense (Self-Assembly modules mostly lit) | — | *"The system has been listening."* |
| **8** | WHY | Assembled | grid pattern at theme-specific richness | Custom Themes fully earned (Water vs Architecture track visibly diverges by now) | — | *"Rare air."* |
| **9** | WHY | Assembled → **Integrated** begins | — | Export Data, Narrative Reflection unlock (Depth + tenure both satisfied) | Self-care streak language flips to technical register (existing 30-day mechanic, now framed as a tenure landmark too) | *"The self-care practice is a habit now."* |
| **10** | WHY | Integrated | near-ceiling opacity/glow | Private Spaces (Intimacy/Courage-gated features become tenure-supported, not just behavior-gated) | — | *"Almost there."* |
| **11** | WHY → **WHO** priming | Integrated | — | Full 6-view Quantum Engine dashboard fluent (Ecosystem, Biofield, Cohort, Index, Self-Assembly map, QOS Mode) | — | *"One more."* |
| **12** | **WHO** — identity, not just pattern | Integrated (stable) | ceiling: 1.0 opacity, full glow, full theme expression | Everything in Section 9's end-state spec | Board Profile now indistinguishable in *shape* from the `/u/machiavelli` reference (values differ, structure matches) | *"The portrait is complete — and still evolving."* (existing line, kept verbatim) — **Anniversary Ceremony**: the paragraph synthesizes all twelve months' `monthly_story` logs into one origin-to-now narrative, the single richest artifact the product produces all year |

**Why WHO at month 12, and not before:** the Memory Engine white paper's own
depth model stops at WHY ("soul-level values"). A twelfth-month register that goes
one step further — from *why you do this* to *who you have become by doing it* —
gives the anniversary a real, distinct voice instead of just repeating month-six's
tone louder. It also mirrors `MonthlyPulseWidget`'s own month-12 line, which already
says "the portrait is *complete*" — a claim about identity, not just behavior.

---

## 8. VISUAL EVOLUTION IN DETAIL

Layered onto the existing `--evolution-*` CSS custom properties
(`interfaceEvolution.ts`), tenure contributes a **floor**, never a ceiling — an
active new user can still out-pace their own tenure through behavior; tenure just
guarantees a Usership account never regresses in feel:

```
Month  1– 2   --evolution-base-opacity: 0.85   --evolution-glow-intensity: 0
Month  3– 5   --evolution-base-opacity: 0.90   --evolution-grid-opacity: 0.25
Month  6– 8   --evolution-base-opacity: 0.94   --evolution-glow-intensity: 0.10
Month  9–11   --evolution-base-opacity: 0.97   --evolution-glow-intensity: 0.20
Month 12+     --evolution-base-opacity: 1.00   --evolution-glow-intensity: 0.30
```

The Water/Architecture theme split (existing, badge-metaphor-driven) is untouched
by tenure — it stays a choice the user's badge history expresses, not something
tenure should flatten. What tenure changes is *how clearly* whichever theme they're
in gets to speak: a month-1 Water-track account and a month-12 Water-track account
should look like the same aesthetic, one further along, not two different
aesthetics.

---

## 9. THE END-STATE TARGET: RECONSTRUCTING THE "MACHIAVELLI" SPEC

Live fetch of `/u/machiavelli` was blocked in this environment (see Section 0).
Reconstructed instead from `PublicProfile.tsx`'s `boardProfile` type and
`LOT-FEATURE-INVENTORY-2026.md` §08, which explicitly names it: *"Demo Account.
Niccolo Machiavelli. Simulated Florence weather."* A genuinely-evolved month-12
Usership account should match this **shape** (not necessarily these exact numbers):

```
Board Member #[N]                    ← assigned month 1, low-order digits by year 2
Citizen since [Month, Year]          ← 12 months back from now, exactly
Powering [N] citizens                ← community stat, grows independent of tenure
Board tenure 12 months                ← boardTenureMonths, the master clock of this doc
Biofield State: [clarity · alignment · energy]   ← QOS-derived, live not static
Activity: [N] memories compiled · [N] journal entries · [N] active days
Memory Engine: → [tier]              ← should read distinctly richer than month 1
Clearance level: → [tier] ([N] entries)
```

Plus, by month 12 and not before:
- **QR code** unlocked (Usership + Forming-phase gate, already implemented —
  should already be true well before month 12; confirms the gate is set correctly
  low)
- **Custom theme** fully expressed (Water or Architecture, visibly matured per
  Section 8)
- **Architect Widget** showing a mostly-lit Self-Assembly module map, Integrated
  phase
- **Cosmic Update** gallery of (up to) 12 monthly self-portraits — a second,
  visual archive running parallel to the Story archive from Section 5.2
- **Quantum Engine** 6-view dashboard fluent, not sparse
- A **Story archive** of 12 `monthly_story` entries (new, this document) — the
  actual deliverable Section 5 exists to produce, and the most tangible proof of
  "twelve months, felt" the account can show

The single most important gap to close, engineering-wise, to make this true for
*real* accounts and not just the demo: **`boardProfile` in `PublicProfile.tsx` is
currently a static/hard-coded payload for the demo path.** Every real Usership
account needs the same object computed live from its own `logs`, `badges`, and
Self-Assembly state — otherwise month 12 will always look like month 1 on a real
profile no matter what this document proposes.

---

## 10. WHAT THIS DOCUMENT DOES NOT DO

In keeping with the scope of a design brainstorm rather than a build session:

- No widget code, store, migration, or backend route was modified.
- No new badge was added to the 812-badge codex — Section 7's per-month landmarks
  reuse existing categories (module-phase change, tier-up, streak-flip) rather than
  inventing a 13th badge track that would need its own artwork and rarity pass.
- No pricing was changed; the $15/$99/$3,564 structure from
  `LOT-FEATURE-INVENTORY-2026.md` §16 is treated as ground truth, with the
  white-paper figures flagged (Section 2) as the item needing reconciliation.
- The live `/u/machiavelli` and `/u/user` pages were not observed directly this
  session (network egress blocked) — Section 9 should be the first section
  re-verified against the real pages in an environment with access.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | LOS ANGELES, CA
