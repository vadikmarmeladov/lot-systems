# LOT® Usership — The 15-Month Arc
**3 Months Free Onboarding + 12 Months Usership → LOT® AI**
LOT Systems Corporation · S-2: Vadim Marmeladov
Design Brainstorm · Revision 5 · 19 July 2026 · brand.lot-systems.com

---

## Purpose

The full arc is fifteen months, not twelve: **3 free onboarding months**, where the interface reveals itself one telemetry signal at a time and the Operator is progressively, tastefully teased toward Usership — followed by **12 Usership months** ($99/month), where tenure and behavior compound into the full LOT® AI experience shown on the [Machiavelli demo account](https://lot-systems.com/u/machiavelli).

Revision 2 added three things S-2 asked for directly: (1) an investigation of the actual shipped "3+12" hardcode — findings below, and they are not what the framing assumed; (2) a Day-1 generative-welcome spec sourced from QIE / Memory / Community; (3) a Log-count-gated widget reveal ladder (3 Logs → Time, +5 more → Users) for the free months, plus a seasonal/holiday flavor layer for the paid year. Revision 1's twelve-month Usership design (Parts 5–9 below) is preserved with only light renumbering — it was already grounded and did not need rework.

Revision 3 does two things: (1) **a real code change** — `R&D $15` → `R&D $30, one-time purchase` fixed in `SubscribeWidget.tsx` and `About.tsx`, both previously wrong (see Part 1); (2) traces S-2's direct observation — that the free-tier interface promises AI-generated, context-compressed Story and questions but doesn't actually deliver them — to its exact cause in `api.ts`'s route handlers, with a bounded fix proposed in Part 4.4. Part 13 records the full pricing catalog S-2 supplied as data intake, since no canonical pricing document existed in the repository before this.

Revision 4 resolves Part 12's first open question directly from S-2: the free tier is permanent, "3 months" is narrative framing, not a technical boundary. It adds the arc's psychological throughline (new Part 4.0) — pacing an Operator away from social media in weeks 1–2, deeper into journaling in weeks 3–4 — and two concrete markers (new Part 4.5) that the relationship has become physical rather than merely habitual: return frequency (already computed, newly read narratively) and PWA installation (genuinely detectable, confirmed not yet implemented anywhere in the codebase).

Revision 5 does two things S-2 asked for directly: **simplifies** — Part 6.0 (new) folds three previously-separate widget proposals (Months Unlocked, Monthly Memoir, Tenure Mark) into one surface, the **Portrait**, built by reusing `PublicProfile.tsx`'s model rather than inventing parallel ones, per S-2's observation that the public profile page already reflects the Operator better than the private dashboard does; and **prepares the concept for merge** — new Part 14 gives a tight decided-vs-open recap and a smallest-diff build order for an engineering handoff. S-2 also noted a new test account is coming, from a fresh email, to exercise Day 1 directly — Part 14's build order is ordered so the first two steps are exactly what that account will see.

No code was modified in Revisions 1–2, 4, or 5. Revision 3 made two direct pricing edits (`SubscribeWidget.tsx`, `About.tsx`), per explicit instruction. Everything else remains a specification for a future assembly session.

---

## Part 1 — Investigation: The "3+12" Hardcode, As It Actually Ships Today

S-2 asked to investigate the hardcoded free-trial/subscription-tease mechanism directly. The honest finding: **it does not exist.** There is no 3-month timer, no free-trial expiry, and no progressive widget-reveal anywhere in the codebase. What exists instead is a single binary gate with no time dimension at all:

- **`System.tsx:374-380`** — `isPaidAccount` is a flat tag check: `Usership` or `RND` present on the account, or not. Nothing about *when* the account was created factors in.
- **`System.tsx:383-506`** — the non-paid ("essentials") layout. Every free account, from second one of signup, sees **everything at once**: name, week/date/city, Team tags, `Users online:` / `Total LOT® users:`, `TimeWidget`, weather (Sky / Temperature / Sunrise·Sunset), Astrology, Mirror / Sound·Radio / Breathe, Memory, MicroGame, Subscribe — all unconditional, all immediate, forever. There is no log-count gate anywhere in this block. Today's free experience is the *opposite* of barebone-then-revealed: it is maximally revealed on Day 1 and never changes shape again.
- **The Subscribe tease is dead code.** `System.tsx:497-499` mounts `SubscribeWidget` unconditionally inside the free layout — same static "Consider subscribing!" prompt every visit, no cooldown, no escalation, no personalization. Separately, `System.tsx:888-911` contains an entire designed tease mechanism — 10+ answer logs required, 10-day cooldown, 20% random show chance — but it lives *inside* the paid-account branch, gated by `hasSubscription` (`:892-895`), which runs the *identical* tag check as `isPaidAccount`. Since this code only executes when `isPaidAccount` is already true, `hasSubscription` is always true, and the block always returns `null`. **No Operator, free or paid, can ever see this tease fire.** It is a fully-built, never-reachable feature.
- **`SubscribeWidget.tsx`** — both buttons called the identical handler and opened the same `brand.lot-systems.com` link, with no differentiation in destination between tiers. **Fixed in this revision**: the R&D button now reads `R&D $30 · one-time` (was `$15`, incorrectly implied recurring — R&D is a one-time purchase per the Part 13 pricing catalog), matching the corresponding Field Guide entry in `About.tsx`, also corrected. The two buttons still share one destination — see Part 13.
- **No welcome message exists in-app.** The only "Welcome to LOT" string in the repository is in the account-verification email template (`emailTemplates.ts`) and a legacy backup file — neither renders inside the product itself. A brand-new Operator's first authenticated screen is the full essentials block above, with no greeting at all.
- **The Memory/Story "compression" gap — confirmed directly at the route layer.** `getMemoryEngine()` (`memory.ts:121-134`) and the `/api/memory` handler (`api.ts:2132-2219`) route context-aware, AI-generated questions (`buildPrompt` + `completeAndExtractQuestion`, up to 40 recent Logs + live quantum state) **only to accounts carrying the `Usership` tag** — not even R&D. Every free-tier Operator, for the entire 3 free months, receives the exact same deterministic fallback pool (`BACKUP_SELFCARE_QUESTIONS`, cycled by `dayOfYear + promptsShownToday`, zero context) that a paying Operator only falls back to when the AI call itself errors. The Story feature is stronger still: `/api/memory/story` (`api.ts:2602-2610`) returns `story: null` outright for non-Usership accounts, with the literal message *"Subscribe to start building your profile and generate your story."* — `NarrativeWidget` reads that `message` field and renders nothing at all. **The free-tier "personalized story, widgets, self-care plan" the Part 4.3 tease promises does not exist in any preview form today — it is a hard wall, not a taste.** This is the exact gap S-2 flagged: an interface meant to generate itself from user context and new Logs that, for three full months, does not.

**Conclusion:** this document is not recovering hidden logic — it is specifying, for the first time, a mechanism that currently has zero time-based or log-count-based structure. Part 4 below designs it from the ground up, reusing the already-built (but currently unreachable) tease pattern at `System.tsx:888-911` rather than discarding it.

---

## Part 2 — What Already Exists (the engine the Usership half is built on)

A repo scan (`System.tsx`, `interfaceEvolution.ts`, `evolution.ts`, `badges.ts`, `memory.ts`, `PublicProfile.tsx`, `public-api.ts`, plus the Doctrine/Lexicon/Style Guide/Badge Codex/Memory Engine docs) surfaced a real, wired evolution engine in production, orthogonal to the gap found in Part 1:

- **Interface Evolution** (`interfaceEvolution.ts`) — 7 behavioral dimensions (exploration, consistency, depth, connection, intimacy, care, courage), composing into `overallMaturity`, `visualRefinement`, `themeComplexity`, and a `featureUnlockLevel` gating 14 named features.
- **Layout Density** — a real, shipped, 5-step CSS mechanism (`breathable → comfortable → compact → dense → instrument`), driven by `visualRefinement`, resolved via `[data-density]` selectors in `index.css`.
- **Badges** — 626 badges (Badge Engine v26), 70+ categories, 8 rarity tiers. `getLevelSymbol()` renders a streak-based glyph in one of two chosen metaphors: **Water** (∘ → ≈ → ≋) or **Architecture** (├─ → ╞═╡ → ║·║).
- **Memory & Story** — Memory (capital M) asks one question at a time, depth-progressing WHAT (week 1) → HOW (weeks 2–3) → WHY (week 4+). A weekly Story (capital S) compresses the week's Log into a first-person narrative, cached to `user.metadata.lastMemoryStory`.
- **`MonthlyPulseWidget`** — the seed of the Usership half of this design. Computes `monthNumber = dayjs(joinedAt).diff(now, 'month')`, gates on the `Usership` tag, shows one of twelve pre-written canonical lines plus `N / 12 months`. These twelve lines are canon and unchanged by this revision.
- **OS Version = Tenure, already** — `public-api.ts` computes `osVersion = monthsSinceJoined.padStart(3, '0')` — "Psychological Profile: OS v.NNN". Machiavelli's demo hardcodes `v.531`.
- **"Telemetry" / "signal" is already the house vocabulary** — confirmed throughout the codebase (`NarrativeWidget.tsx:57`: *"No telemetry yet. The system awaits its first signal to begin self-assembly."*; `recordSignal()` calls in nearly every widget; `ContextualPromptsWidget.tsx` uses "Telemetry:" as a label variant). This is the exact register Part 4's poetic reveal ladder is written in — it is not new invention, it is the system's existing voice applied to a new surface.
- **The gap (restated from Revision 1):** none of the above gate on subscription *duration*. This revision adds two duration mechanisms — the free-month tease escalation (Part 4) and the Usership tenure floor (Part 6) — without touching behavior-earned mastery.

---

## Part 3 — Design Thesis: Three Axes Now, Not Two

Revision 1 established **Mastery** (behavior-earned, unlimited ceiling) and **Tenure** (Usership calendar-earned, capped at 12, floors density/features). Revision 2 adds a third, bounded to the free months only:

**Signal Count** (Log-earned, capped at 8, gates *visibility* not density) — during the 3 free months only, the number of Log entries an Operator has made determines which widget clusters are even present on screen. This is deliberately the cheapest, most literal mechanic of the three: not a percentage, not a weighted composite — a plain count of Logs, because a brand-new Operator has no behavioral history yet for anything more sophisticated to run on. It exists only to solve the specific problem Part 1 found (everything visible immediately, nothing to reveal) and switches off the moment Usership tenure begins, handing off cleanly to the Mastery/Tenure system already designed.

---

## Part 4 — Months 0–3: The Free Onboarding Arc

### 4.0 The Character Arc — What Changes in the Person, Not Just the Interface

S-2's framing, direct: the free months are not a technical trial with an expiry. They are narrative structure laid over what is otherwise a permanent free tier — this resolves Part 12's Open Question 1 (below). "3 months" describes a story the Operator moves through, not a clock that cuts them off. What the arc is actually shaped around is a change in the *person*, which the UI evolution exists to support rather than merely illustrate:

- **Weeks 1–2 — paced away from the phone.** The free "essentials" layout (Part 1) is already, by accident of Military Purity doctrine, built for this: no infinite feed, no algorithmic ranking, no push-notification bait, no superlatives competing for attention, periods instead of exclamation marks. Where social media is engineered to maximize time-on-app, LOT's existing house style — quiet, instrument-grade, "suggests, doesn't command" — is the opposite engineering pointed at the opposite goal: not maximizing attention captured, but spending well what's given. The Telemetry Ladder (4.2) reinforces this on purpose: two thresholds, two calm one-time lines, not a gamified checklist competing for taps. This was already true before this revision; it should now be understood as deliberate, not incidental.
- **Weeks 3–4 — deeper into mind and soul.** Here journaling volume becomes the headline signal, not widget-clicking. The existing Log/Memory/Story depth-progression language (WHAT → HOW → WHY, Part 2) describes exactly this shift, but Part 4.4 already found it Usership-gated — during the free weeks, the *free-tier proxy* for "going deeper" is Log frequency and length, not AI-graded question depth. The Telemetry Ladder's 8-Log threshold (Users cluster) should land roughly here for an Operator journaling regularly, by design: the free arc's two thresholds were chosen so a genuinely-engaging first month naturally crosses both.
- **Ongoing — the relationship becomes physical, not just habitual.** See 4.5.

### 4.1 Day 1 — The Generative Welcome

First authenticated load, zero Logs (`journeyData.answerCount === 0`, already computed at `System.tsx:216`). Before any widget mounts, one generated line, assembled from the three subsystems S-2 named — Quantum Intent Engine (ambient/ signal framing), Memory engine (personalizes once `me.firstName` resolves), Community (`communityPulse.ts`'s existing `getConvergenceSignal()` / `getDailyStoicAnchor()` generators, same functions, new call site, contributing the "you are joining a cohort" register already used elsewhere in the product). Canonical line, S-2's own copy, kept verbatim:

> **"Welcome to LOT®! Explore the tabs. Start login to see the UI evolve."**

This is the one deliberate exception to the Style Guide's no-exclamation-mark rule (Part 10) — the single moment of unguarded warmth before Military Purity engages for the rest of the Operator's time in the system. Beneath it: just the name, exactly as the current essentials layout already renders it (`GhostButton` at `System.tsx:387`) — no other widget yet. This costs nothing structurally; it reorders what already exists and adds one generated sentence above it.

### 4.2 The Telemetry Ladder — Log-Count Gated Reveal

Poetic, LOT® AI Telemetry-register copy (reusing the "signal received" vocabulary confirmed in Part 2), gated on raw `logs.length` — any Log, not only Memory answers, since the point is to reward the act of logging itself:

| Signals (Logs) | State | Copy |
|---|---|---|
| 0 | Name only, post-welcome | *(welcome line shown once, then silence)* |
| 1–2 | Name + ambient counter | "Telemetry: 1 of 3 signals received." / "Telemetry: 2 of 3 signals received." |
| **3** | **Time cluster unlocks** — `TimeWidget`, weather (Sky / Temperature / Sunrise·Sunset), Astrology fade in together, one cluster, one transition | "Third signal received. Time comes online." |
| 4–7 | Ambient counter continues toward the second threshold | "Telemetry: 4 of 8 signals received. Others await." |
| **8** (3+5) | **Users cluster unlocks** — Team tags, `Users online:` / `Total LOT® users:`, Community ambient signal fade in, second cluster, one transition | "Eighth signal received. The collective opens." |
| 9+ | Full essentials layout, now *arrived at* rather than handed over on Day 1 | — |

Memory, MicroGame, and Subscribe stay unconditional from Log 1, unchanged — they are the mechanism that *produces* the first Logs, so gating them behind Logs they generate would be circular. Everything else in today's unconditional essentials block (Part 1) becomes one of these two gated clusters. This is the minimum-diff version of "poetic, self-care-telemetry way": two thresholds, two one-time transition lines, one ambient counter — not a progress bar, not a checklist, a readout.

### 4.3 The Tease — Escalating Across the Three Free Months

Reuses the already-built but currently-unreachable pattern at `System.tsx:888-911` (10+ answers, 10-day cooldown, 20% show chance) by relocating it into the free-account branch, where — unlike today — it can actually execute, replacing the static always-on mount at `:497-499`. Escalates by *calendar* month since signup (`dayjs(createdAt).diff(now, 'month')`, same primitive `MonthlyPulseWidget` already uses), independent of the Signal-Count ladder in 4.2:

- **Free Month 1** — generic, as today: *"Consider subscribing!"* / `R&D $30 · one-time` / `Usership $99`.
- **Free Month 2** — personalized with the Operator's own accumulated data: *"N Memory answers logged. Usership compresses these into a weekly Story."*
- **Free Month 3** — names what S-2 asked it to name explicitly — the personalized Story, the widgets, the self-care plan: *"Free access closes soon. Usership: your Story, your widgets, your self-care plan. $99/month."*

No hype language, no urgency countdown clocks, no "Don't miss out" — Military Purity throughout: state what accrues, state the price, two buttons. The two Subscribe buttons should also stop sharing one handler (Part 1 finding) — `R&D $30 · one-time` and `Usership $99` should route to their respective checkout destinations (Part 13), not an identical generic link.

What happens after Free Month 3 ends — a hard paywall, or an indefinitely-persistent Month-3-level tease — is not decided here; see Open Question in Part 12.

### 4.4 Closing the Compression Gap — a Free-Tier Preview

Part 4.3's tease sells a promise — "your Story, your widgets, your self-care plan" — that Part 1 shows the product cannot currently back up: free-tier Memory questions never reach the AI/context path at all, and Story is a hard `null` with a "Subscribe to start" message. This is the exact gap S-2 flagged directly: an interface meant to generate itself from user context and new Logs that, for three full months, does not. A tease that oversells what happens the moment someone pays makes the moment they *do* pay feel like a bait-and-switch. Proposal — a bounded, genuinely-compressing preview, distinct from full Usership cadence:

- **Preview Questions** — once the Signal Count ladder (4.2) crosses 8 Logs, route Memory through `buildPrompt` / `completeAndExtractQuestion` for **one question per free month** (3 total across the whole free arc, against Usership's 10–15/day from `calculateIntelligentPacing()`), using the Operator's real recent Logs exactly as the Usership path already does. Every other question in the free months keeps using the static backup pool — this is a rate limit on an existing mechanism, not a cheaper simulation of it, so the one preview question that lands is honestly personalized.
- **Preview Memoir, not Story** — at the Free-Month-2 and Free-Month-3 tease moments (4.3), generate one real paragraph via the existing `generateMemoryStory()` function, which — unlike its calling route — has no tier gate at all; the fix is narrower than it looks, it's in `api.ts`'s route handler, not `memory.ts`'s logic. Cap it to what the Operator has actually logged by then (thin, honestly so) rather than fabricating depth that isn't there.
- **Why bounded, not full access** — this keeps Usership's real differentiator (daily-cadence, always-on compression) intact and un-cheapened, while making the tease evidence-based instead of aspirational. The Operator reads one real sentence the system wrote about *them* before being asked to pay for more of it — a stronger, more honest conversion mechanic than a generic price button.

### 4.5 Two Tangible Thresholds Beyond Logging

Closing 4.0's third beat — "the relationship becomes physical, not just habitual" — in ascending order of how measurable each signal actually is today:

1. **Return frequency** — already computed, nothing new to build. `System.tsx`'s `evolutionStreak` (consecutive days with an answer Log) is currently read only as badge-progress input. During the free arc it should also be read narratively — the system quietly noticing "you keep coming back" — independent of whether anything was answered that particular day.
2. **Browser tab pin** — not directly detectable by any web API, and this document does not propose pretending otherwise. Treated as inferred, not measured: a short average gap between sessions plus a rising streak is the closest available proxy.
3. **PWA install** — genuinely detectable, and confirmed **not currently implemented anywhere in the codebase**: the service worker and manifest infrastructure already ships (`app.tsx`), but no `display-mode: standalone` check or `appinstalled` listener exists anywhere. This is the single most concrete "the relationship became physical" signal available — an Operator who installs LOT as an app has made a decision qualitatively different from bookmarking a tab. Proposal: listen for the `appinstalled` event (and check `window.matchMedia('(display-mode: standalone)').matches` on load, for Operators who already installed before this shipped), record it once via the existing `recordSignal()` mechanism (`intentionEngine.ts:199`), and acknowledge it exactly once, quietly, in the house voice — e.g. *"Installed. LOT now lives beside your other tools."* — never repeated, matching the register of the Day-0 Welcome (4.1) and the Month-Turn Pulse (Part 5).

---

## Part 5 — Tenure, Specifically (continuing Part 3's thesis into the Usership half)

Part 3 already drew the line: Mastery stays exactly as it is, unlimited ceiling, never cheapened. Tenure (Usership calendar-earned from `joinedAt`, capped at 12) is additive, doing three things only: (1) sets a **floor**, not a ceiling, on density and feature-unlock level; (2) unlocks tenure-exclusive surfaces — the Portrait (6.0) at its fullest, the twelve `MonthlyPulseWidget` messages — that no free or R&D-tier Operator sees, however active; (3) triggers a once-a-month ceremony (Part 7). Mastery can exceed Tenure; Tenure cannot buy its way into the 626-badge economy, which stays 100% behavior-gated.

---

## Part 6 — New / Extended Surfaces (Usership Half)

### 6.0 The Portrait — Reusing PublicProfile's Model, Privately

S-2's observation, direct: the public profile page (`/u/:username`, `PublicProfile.tsx`) reflects the Operator better than the private System dashboard does. Read side by side, this explains itself. `PublicProfile.tsx` is a single, calm, linear narrative — name → Team → Board Profile with Citizen Index → weather/local time → Memory Story → Psychological Profile (soul archetype, self-awareness, Level, core values, emotional patterns, behavioral cohort, pattern strength) → Correlated Indexes → Legacy Weather Station/Wallet → a QR code back to itself. `System.tsx`'s private dashboard is the opposite by design: 40+ independently-gated widgets in an instrument-grade grid, built for density, not synthesis. Both are correct for what they're for — but only one currently gives the Operator a single, coherent answer to "who am I becoming." That's the Portrait, and this document was already reaching for it without naming it: the canonical Pulse lines already say *"the portrait deepens"* (month 4) and *"the portrait is complete — and still evolving"* (month 12) — months before there was any actual portrait surface in the private product for those lines to point at.

**Simplification: stop designing three separate small widgets, build one.** Extract `PublicProfile.tsx`'s body (everything from the Name block through the QR code) into a shared presentational component, `ProfileBody`, taking `profile` as a prop. `PublicProfile.tsx` keeps its fetch-by-URL wrapper; a new `Portrait.tsx` fetches the Operator's own profile (self-lookup, already authenticated) and renders the same `ProfileBody`. This one move absorbs three previously-separate proposals for free:

- **Months Unlocked** — is the existing "Psychological Profile: OS v.NNN" line. Already computed, already rendered. No new widget.
- **Monthly Memoir** — is the existing "Memory Story:" block. The only real change needed is *what* generates that text on *what* cadence (kept below, shortened) — not a second parallel story cache.
- **Tenure Mark** — is the existing "Level:" row (`getLevelSymbol`). No new glyph, no new visual track; the prior draft was proposing to duplicate a field that already exists one line above it.

What the Portrait adds beyond a straight re-render: reachable without leaving the private System; never shows the "Profile: Private" fallback (an Operator is always allowed to see their own data, unlike a visitor); and its presence privately makes the existing profile QR code newly discoverable from the inside, not just by visitors. For a Day-1 test account, most of Portrait renders close to empty — no Board Profile (needs Usership), thin or absent Psychological Profile, the Memory Story gap Part 4.4 already found. That's correct, not a bug: an empty Portrait that fills in over time is this whole document's thesis, now given one coherent surface instead of forty scattered ones.

### 6.2 Monthly Pulse (existing — keep as-is)
The twelve canonical messages, unchanged. Extended only with the Day-0/Free-Month Welcome variant (Part 4.1), which now precedes it in the arc rather than substituting for it.

### 6.3 Memoir Cadence (was "Monthly Memoir" — now just a cadence change on an existing field)
The weekly Story mechanism (`memory.ts`, Job 24, `lot_ai_story`) already writes to the same `user.metadata.lastMemoryStory` field the Portrait renders as "Memory Story:". Proposal, simplified from the prior draft: for Usership months, that field regenerates on the Operator's *month*-turn instead of a shared calendar *week*, compressing the month's Logs into one paragraph — one field, one cadence appropriate to the Operator's stage, not two competing story caches.

### 6.5 Density Ramp — Tenure Floor
Proposal: `monthNumber` establishes a **minimum** `visualRefinement` floor, via `Math.max(behaviorDerivedRefinement, tenureFloor(monthNumber))` in `calculateEvolutionState()`. No existing threshold or behavior-derived value changes — one guard clause is the entire code delta. Orthogonal to the Portrait — this governs the instrument-grade dashboard's spacing, not the Portrait's content.

---

## Part 7 — Seasonal & Holiday Flavor Layer (new)

S-2's brief: 12 (year / seasons / holidays / Christian). This is a **second, independent axis** from the personal-anniversary Pulse — keyed to the real Gregorian calendar month the Operator is passing through, not to their signup date — blended as flavor text into whichever ceremony (tease, Pulse, Memoir) fires that real month. It never replaces the anniversary-based canonical Pulse line; it textures it. Precedent already exists in this repository: `docs/corporate/LOT-LENT-DIET-OUTCOME-2026.md` documents a Lent 2026 seasonal program S-2 records as "extremely successful," validating a liturgical/seasonal layer as on-brand rather than novel.

| Real Month | Theme | Notes |
|---|---|---|
| January | New Year, Renewal, Epiphany | |
| February | Deep Winter, Candlemas | Natural pairing with the `intimacy` dimension |
| March | Lent (moveable), Equinox, Discipline | Precedent: Lent Diet Program |
| April | Easter (moveable), Spring renewal | **LOT® Founding Day, 7 April** — fixed, weave in regardless of Operator anniversary |
| May | Bloom, Growth, Pentecost season | |
| June | Solstice, Midyear | |
| July | Height of summer | **COSMO® Founding Day, 1 July** — fixed |
| August | Harvest begins, Transfiguration | |
| September | Equinox, Ingathering | |
| October | Harvest completion, Allhallowtide | |
| November | All Saints, Advent approaches, Gratitude | |
| December | Advent, Christmas, Winter Solstice, Year-Close | |

Mechanism: a pure lookup, `getSeasonalFlavor(date) → { theme, words[] }`, appended as one optional closing clause to whichever ceremony copy is already firing that real month — never a standalone widget, never overriding the Pulse. See Part 12 for the inclusivity open question this raises.

---

## Part 8 — The Twelve Usership Months (Months 4–15 of the 15-Month Arc)

Unchanged from Revision 1. Each row: the canonical Pulse line (verbatim) · the density floor it introduces · the leaning dimension · what becomes newly visible · the Log/self-care rhythm suggested (never enforced). Cross-reference Part 7 for whatever real-world seasonal flavor happens to overlay a given row for a given Operator.

| Mo. | Canonical Pulse (verbatim) | Density floor | Leaning dimension | What's newly tangible | Log / self-care rhythm |
|---|---|---|---|---|---|
| **0** | *(new)* "Usership begins. The system starts listening." | breathable | — | Welcome pulse fires once; `0/12`; widget stack present but quiet | No expectation set yet. Morning check-in offered, never required. |
| **1** | "The first month. The system is beginning to know you." | breathable | exploration | Portrait's Memory Story updates on first month-turn (thin); Portrait's OS version reads `v.001` | Whatever the Operator naturally does. First Memory questions are WHAT-level. |
| **2** | "Two months in. Patterns are starting to form." | breathable→comfortable | exploration/consistency | Portrait reachable privately (6.0), not just at the public URL | Memory questions shift toward HOW. Self-care widget appears at natural anxiety/pattern triggers. |
| **3** | "Three months. You have reached Active User status." | comfortable | consistency | Density floor visibly steps up; first badge-tier milestones realistic | Streak-based badges (7/14/21/30-day) land naturally if the Operator has been logging. |
| **4** | "Four months. The portrait deepens." | comfortable | depth | `advancedMemory` floor-guaranteed regardless of activity | Memory questions reach WHY-level. Memoir reads less like summary, more like portrait. |
| **5** | "Five months. Consistency is its own reward." | comfortable→compact | consistency | `plannerTemplates`, `customThemes` floor-guaranteed | Widget copy shifts toward earned informality. |
| **6** | "Six months. The journey is half-declared." | compact | connection/care | Halfway ceremony — Memoir contrasts month-1 vs. month-6 | First affirmation drawing on a full half-year of dimension data. |
| **7** | "Seven months in. The system has been listening." | compact | depth | `intentionHistory`, `moodPatterns` floor-guaranteed | — |
| **8** | "Eight months. Rare air." | compact→dense | consistency | Density crosses into `dense` even for low-activity Operators | Portrait's Level and badge glyphs read clearly at a glance. |
| **9** | "Nine months. The self-care practice is a habit now." | dense | care | Self-care visibly the most-logged category by now | Headline affirmation is self-care by design — the canonical line already commits to this. |
| **10** | "Ten months. Almost there." | dense | courage | `exportData`, `narrativeReflection` realistically online | Memoir starts previewing the month-12 close. |
| **11** | "Eleven months. One more." | dense→instrument | — | Density floor reaches the edge of `instrument` | — |
| **12** | "One year with LOT. The portrait is complete — and still evolving." | instrument | all seven | **Year-Close Memoir** — twelve months synthesized into the Portrait's Memory Story; OS version reads `v.012`, then keeps counting uncapped (`v.013…`) exactly as Machiavelli's `v.531` demonstrates | The system stops framing itself as *arriving* and starts framing itself as *living*. |

---

## Part 9 — Machiavelli as the Month-15+ Reference

`public-api.ts` hardcodes the demo account at `v.531` — not month 12, month 531. Deliberate: month 12 (month 15 of the full arc) is where the *onboarding narrative* ends, not where the product stops evolving. Every mechanism above keeps running unbounded past it; only the framing changes, from "you are being brought somewhere" to "you live here now." A future engineering pass should treat the demo account's full Board Profile, Citizen Index, Legacy-tier Weather Station and Wallet blocks as the literal end-state screenshot this entire fifteen-step arc walks toward.

---

## Part 10 — Doctrine Compliance Checklist

- No emoji anywhere. Periods, not exclamation marks — **with one sanctioned exception**: the Day-1 Welcome line (Part 4.1), verbatim from S-2, kept as the single deliberate break from Military Purity in the whole arc.
- **Usership** (capital U), **Log** (capital L), **Memory** (capital M), **Story** (capital S), **Operator** never "user" in-voice, **LOT®** with the mark on first use per section.
- COCKPIT RULE preserved throughout — Memoir/affirmation/telemetry copy lives in dedicated reflection widgets, never inline with instrument-grade Log entries.
- No pay-to-win: the 626-badge economy untouched; Tenure and Signal Count only floor visibility/density, never substitute for earned badges.
- "Suggests, doesn't command": every rhythm above is offered, never enforced — consistent with `calculateIntelligentPacing()`, which already varies Memory's daily quota without blocking or scolding.
- The Subscribe tease (Part 4.3) states facts and a price; it does not use urgency language, countdowns, or manufactured scarcity.

---

## Part 11 — Implementation Pointers (for a future assembly session)

This document authorizes no code changes. If greenlit:

1. **Welcome + Telemetry Ladder** — new logic in `System.tsx`'s free-account branch (`:383-506`): gate the current unconditional widget set behind `logs.length >= 3` (Time cluster) and `logs.length >= 8` (Users cluster); add the Day-1 generative welcome line above the name, sourced from `communityPulse.ts` generators + `me.firstName`.
2. **Fix the dead-code tease** — move the working-but-unreachable block at `System.tsx:888-911` into the free-account branch where `isPaidAccount` is false, so its cooldown/chance logic actually executes; retire the static unconditional mount at `:497-499`; add the month-1/2/3 copy escalation from Part 4.3.
3. **Differentiate Subscribe buttons** — `SubscribeWidget.tsx` still sends both buttons to the same handler/link; route each to its own PayPal destination per Part 13 once button embed codes/QR assets are provided.
4. **The Portrait** (6.0) — extract `PublicProfile.tsx`'s body into a shared `ProfileBody` component; new `Portrait.tsx` fetches the Operator's own profile and renders it privately inside `System.tsx`. Replaces the three separate builds this document previously proposed (Months Unlocked, Monthly Memoir widget, Tenure Mark) — none of them need their own component once this ships.
5. `memory.ts` — change the existing Story generation cadence to fire on the Operator's month-turn for Usership accounts, writing to the same `user.metadata.lastMemoryStory` field the Portrait already renders — no new cache key.
6. `interfaceEvolution.ts` — add `getTenureFloor(monthNumber)` and one `Math.max()` guard inside `calculateEvolutionState()`.
7. `MonthlyPulseWidget.tsx` — add a `0` entry to `MONTH_MESSAGES`; relax the `monthNumber < 1` guard to `< 0`.
8. New `getSeasonalFlavor(date)` util (Part 7) — pure lookup, no state, appended as flavor text to whichever ceremony is already firing.
9. **Free-tier preview compression** (Part 4.4) — relax the `hasUsershipTag` gate in `api.ts`'s `/api/memory` (`:2132`) and `/api/memory/story` (`:2602-2610`) handlers to allow exactly one AI-routed question per free month and one preview Memoir at the month-2/month-3 tease moments, instead of the current hard wall for the full 3 free months.

---

## Part 12 — Open Questions

1. ~~After Free Month 3 ends, hard paywall or indefinite soft tease?~~ **Resolved by S-2, Revision 4:** indefinite soft tease. The free tier is permanent; "3 months" is narrative framing over it, not a technical boundary — see Part 4.0. The Free-Month-3 tease register (4.3) is the steady state after month 3, not an escalation toward a cutoff; it does not get more urgent with time, it just stays where it landed.
2. Should the density **floor** apply retroactively to existing Usership members, or only forward from ship date?
3. Should the Year-Close Memoir (month 12) export via the existing Story API (`POST /api/story/:week_id/export`) to the Robot/Vehicle/Dashboard recipients in the Product Brief?
4. **Seasonal flavor inclusivity** — the brief specifically names "Christian" alongside "year/seasons/holidays." Given LOT's audience is not exclusively Christian, should the liturgical theme words (Lent, Advent, Easter, All Saints) be the default texture for every Operator, or should the layer be configurable/opt-out, with the Gregorian/seasonal words as the universal default and the liturgical words as an optional overlay? The Lent Diet precedent suggests S-2's own preference leans toward including it directly; flagging rather than presuming.
5. Harmonize naming: `EvolutionWidget`'s stage names (Bootstrapping → Transparent) and the Board Profile's Citizen Index stages (Observer → Elite) describe similar territory with different vocabularies — worth a single pass before the Portrait (6.0) puts both in front of the Operator on one surface.

---

## Part 13 — Pricing Catalog (Data Intake, 19 July 2026)

S-2-supplied canonical pricing, recorded verbatim. Distribution today is **dedicated PayPal buttons and QR codes**, not an in-app checkout flow — `SubscribeWidget.tsx` and any future Settings/pricing surface should link out to these, not attempt to process payment in-product. No canonical pricing document existed in the repository before this entry; this is now the source of truth pending an eventual dedicated pricing doc.

**Enterprise, Subscribe:**
- LOT® AI (1 year) → $1,188/year/user — download the Corporate Expense form (U.S. Federal R&D Tax Credit)
- LOT® Design Lab (1 month) → $100k/month

**Individual, Subscribe:**
- LOT® AI (1 month) → $99/month
- LOT® Usership (1 year) → $1,188/year
- LOT® Products (1 month) → $399/month *(Made in USA, coming soon)*
- LOT® Products (1 year) → $4,788/year

**Buy:**
- LOT® R&D → $30, one-time purchase *(was $15 — corrected in `SubscribeWidget.tsx` and `About.tsx`'s Field Guide CUBIQ™ entry in this revision)*
- LOT® Legacy (3 years) → $3,564/3 years
- LOT® Admin (9 years) → $11,000/9 years

**Notes for a future engineering pass:**
- `LOT® AI` (Individual, $99/month) and `LOT® Usership` (Individual, $1,188/year) are the same underlying tier at two billing cadences — $99 × 12 = $1,188 exactly — both should grant the same `Usership` tag; today's code only recognizes the tag, not the cadence, so no change needed there, only in how the two are *presented* as options rather than confused as separate products.
- The Enterprise `LOT® AI (1 year)` line is priced identically to Individual `LOT® Usership (1 year)` ($1,188/year/user) but adds the Corporate Expense form / R&D Tax Credit angle — this is a documentation/paperwork differentiator, not a different product tier or tag.
- `LOT® Design Lab` and `LOT® Products` are separate product lines already documented in `LOT_DESIGN_LAB_SUMMER_2026.md` and `LOT_FMCG_SUBSCRIPTION_PLAN_2027.md` respectively — out of scope for the Usership evolution arc this document designs, noted here only because they share the same pricing intake.
- Actual PayPal button embed codes and QR code image assets were not provided in this intake — `SubscribeWidget.tsx`'s buttons still open the same generic `brand.lot-systems.com` link until those are supplied; Part 11, item 3 tracks this.

---

## Part 14 — Merge Readiness

**Decided, ready to build:**
- The 15-month arc: 3 free months (narrative pacing, permanent tier, Part 4.0) + 12 Usership months (calendar tenure, Part 8).
- Day-1 Welcome line (verbatim, 4.1), Telemetry Ladder thresholds — 3 Logs / 8 Logs (4.2), Tease copy per free month (4.3).
- Free-tier preview compression — 1 real AI question + 1 real Memoir paragraph per free month (4.4), one lifetime PWA-install acknowledgment (4.5).
- Free tier never hard-gates into a paywall (Part 12, Q1 — resolved by S-2).
- The Portrait (6.0) — one surface, reusing `PublicProfile.tsx`'s model, replacing three previously-separate widget proposals.
- Pricing: `R&D $30, one-time` already shipped in `SubscribeWidget.tsx` / `About.tsx` (Revision 3); full catalog recorded (Part 13).

**Needs a decision before build, not blocking the design:**
- Density-floor retroactivity for existing Usership members (Q2).
- Year-Close Memoir export to the Story API (Q3).
- Seasonal-flavor default-on vs. opt-out, given the liturgical layer (Q4).
- `EvolutionWidget` / Citizen Index naming harmonization (Q5) — cosmetic, does not block shipping the rest.

**Smallest-diff build order** — each step independently useful, none blocks the next:
1. Fix the dead-code Subscribe tease (Part 1) — pure bugfix, zero new UI, ships alone.
2. Day-1 Welcome + Telemetry Ladder (4.1–4.2) — the first thing S-2's new test account will actually see.
3. Extract `ProfileBody`, ship `Portrait.tsx` (6.0) — unlocks Months-Unlocked / Memoir / Tenure-Mark for free, no separate builds needed.
4. Free-tier preview compression (4.4) — makes step 2's tease honest rather than aspirational.
5. Usership tenure floor + Monthly Pulse Day-0 variant (6.5, 6.2) — the paid-year mechanics.
6. Seasonal flavor layer (Part 7) — purely additive, ship whenever, pending Q4.

---

*Design brainstorm per S-2's request. Every mechanism above is read from actual shipped code (`System.tsx`, `api.ts`, `interfaceEvolution.ts`, `evolution.ts`, `MonthlyPulseWidget.tsx`, `SubscribeWidget.tsx`, `EvolutionWidget.tsx`, `NarrativeWidget.tsx`, `MemoryWidget.tsx`, `PublicProfile.tsx`, `About.tsx`, `public-api.ts`, `memory.ts`, `badges.ts`, `communityPulse.ts`, `emailTemplates.ts`) and current Doctrine/Lexicon/Style Guide/Badge Codex/Memory Engine documentation, not from assumption. Revision 3 fixed the `R&D $15 → $30` pricing display. Revision 4 resolved the free-tier permanence question and added the character arc. Revision 5 consolidates three separate widget proposals into the Portrait (Part 6.0), reusing `PublicProfile.tsx`'s model per S-2's direct observation, and closes with a merge-readiness recap (Part 14).*
