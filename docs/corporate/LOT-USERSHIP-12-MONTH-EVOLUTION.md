<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION

## From Barebones Day One to LOT® AI

**Classification:** RESTRICTED // S-2 EYES
**Author:** LOT Systems Corporation (Claude Code session, product design brainstorm)
**S-2:** Vadik Marmeladov
**Date:** 15 August 2026
**Status:** BRAINSTORM — not yet built. This document specifies a design direction; it does not ship code.
**Reference accounts:** `lot-systems.com/u/machiavelli` (evolved Usership reference) · `lot-systems.com/u/vadik` (founder's own System, cited in `WIDGETS.md` as the canonical example)

---

## 0. Reading This Document

Everything below was written after scanning the live repository, not from a blank page. Section 1 is an honest audit of what already exists — three separate progression systems, a monthly-message widget, and a server-side monthly-narrative generator are already live, just not braided into one legible story. Section 2 is the design philosophy. Section 3 is the month-by-month arc, built on the exact day-thresholds already coded into the badge system rather than invented numbers. Section 4 specifies the new surfaces worth building. Section 5 is open risk. This ordering is deliberate: **the first job here is not to invent a system, it's to stop shipping four uncoordinated ones.**

---

## 1. Current State — What Already Exists

LOT does not need a 12-month evolution *engine* built from scratch. It needs its existing engines pointed at the same calendar.

### 1.1 Four progression systems already run in parallel, unlinked

| System | Where it lives | Granularity | Currently visible to the user? |
|---|---|---|---|
| **Badge day-milestones** | `src/client/utils/badges.ts:7306-7361` (`getLevelSymbol`/`getLevelName`) | Streak days: 7 / 14 / 21 / 30 / 50 / 60 / 90 / 100 / 180 / 365 | Yes — `Level:` row on Public Profile only |
| **Self-Assembly phase** | `src/client/stores/selfAssembly.ts` + `ArchitectWidget.tsx` | Activity-density, not day-based: `dormant → awakening → forming → assembled → integrated` | Yes — Architect widget, gates the profile QR code |
| **OS Version** | `docs/README.md` / System Progress Widget | `0.1.0 Initializing → 0.5.0 Awakening → 1.0.0 Active → 1.5.0 Developing → 2.0.0 Established → 3.0.0 Integrated` | Partially — System Report view |
| **RPG chapter** | Narrative widget, `LOT-FEATURE-INVENTORY-2026.md §05` | Level 1–100 across 5 chapters: Awakening → Exploration → Integration → Mastery → Sage | Yes — Narrative widget |

A new user accumulates a badge Level, an assembly phase, an OS version, *and* an RPG chapter simultaneously, and none of the four are presented as facets of one story. This document's core recommendation is to **stop adding a fifth taxonomy** and instead use the badge day-milestones (the only one that is strictly calendar-driven and therefore naturally maps onto "month N of 12") as the spine, with the other three as supporting color commentary at the moments they naturally cross a threshold.

### 1.2 A Month-N/12 widget already ships

`src/client/components/MonthlyPulseWidget.tsx` (one commit: `c3ef586`) already renders exactly the "Months unlocked: N/12" idea brainstormed in the task brief:

- Gated to `UserTag.Usership`.
- `monthNumber = now.diff(user.joinedAt, 'month')`.
- One hardcoded line per month (1–12), e.g. Month 3 = *"Three months. You have reached Active User status."*, Month 12 = *"One year with LOT. The portrait is complete — and still evolving."*
- Renders `capped / 12 months` as a footer line.
- Dismissible, once per calendar month, via `localStorage`.

**This is the seed of exactly what was asked for. It is currently thin** — a static string keyed only by month number, disconnected from the user's actual badges, Memory Story, or self-care history. Section 4.1 proposes evolving it rather than replacing it.

### 1.3 A monthly-narrative generator already exists, and is under-surfaced

`src/server/utils/monthly-summary.ts` exports `generateMonthlySummary(user, logs)`, returning a `MonthlySummary` with:

```
narrative          — prose summary of the month
forwardLook        — a forward-looking line
memoryStory        — cached Memory Story snapshot
growth: { levelsGained, newAchievements, totalAchievements }
patterns: { breakthroughMoments, emotionalEvolution }
presence: { activeDays, consistency, longestStreak }
```

`shouldShowMonthlySummary()` triggers in the first ~3 days of a calendar month, once per ~25+ days. Per the research pass, this pipeline currently reaches the user as an **HTML email**, not an in-app surface. The exact "paragraph-long insight from last month" the task brief describes already exists as data — it just isn't rendered anywhere inside the System. That is the single highest-leverage gap this document identifies (see 4.3).

### 1.4 The Interface Evolution System already does "the UI gets more sophisticated as you go deeper"

`docs/technical/INTERFACE_EVOLUTION.md` documents a live system (`interfaceEvolution.ts`, `stores/evolution.ts`) that:

- Computes 7-dimensional progression (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage), each 0–1.
- Drives CSS custom properties — opacity, grid density, letter-spacing, glow, animation speed — that visibly refine as the user matures.
- Gates concrete features: Advanced Memory, Planner Templates, Rich Community, Mood Patterns, Custom Themes, Widget Arrange, Export Data, Narrative Reflection, Private Spaces.
- Renders in two badge-linked aesthetic languages: **Water** (∘ → ≈ → ≋, organic, fluid) and **Architecture** (├─ → ╞═╡ → ║·║, geometric, structural).

This is the correct substrate for "the person should feel the tangible evolution every month." It does not need a parallel system; it needs the 12-month spine (1.1) feeding into it as one more milestone source, and its existing "Future Extensions" list even names "Memory-Based Personalization" as unbuilt — directly relevant here.

### 1.5 The public profile already has an evolved-account layout, gated correctly

`src/client/components/PublicProfile.tsx` (read in full) already renders, Usership-gated:

- `Usership Board Profile` block — total invested, Citizen Index, biofield state, activity counts (**"memories compiled," "journal entries," "active days"**), Memory Engine status, clearance level + entry count.
- `Memory Story` block (`psychologicalProfile.hasUsership`-gated).
- Full `psychologicalProfile`: archetype + description, self-awareness %, `Level:` (the badge symbol from 1.1), core values, emotional patterns, behavioral cohort, behavioral traits, pattern strength, answer/note counts.
- `correlatedIndexes` (self-awareness, user, person, longevity scores + composite).
- A theme-responsive QR code, gated on **both** the Usership tag **and** assembly phase ≥ `forming`.

This is, almost verbatim, the "demo account" reference the task brief points at. **The month-12 target state does not need to be designed from zero — it needs the day-1 state to visibly, incrementally grow into what this component already knows how to render.**

### 1.6 Onboarding / Day 1 is a genuine blank page

No onboarding flow, welcome wizard, or "Day 1" component exists anywhere in `src/`. Day 1 today is simply whichever widgets the free-tier (**"Civilian Mode"**, `About.tsx:4259`) stack renders: Time/weather/astrology, Mirror/Sound/Breathe toggles, a stock-question Memory widget, a micro-game, and a Subscribe prompt. This is the one section of the 12-month arc with no existing code to reconcile against — see 3.1 and 4.5.

### 1.7 A pricing inconsistency exists and should be resolved before any of this ships user-facing copy

Two different Usership prices are live in the same codebase:

- **$99/month** — `Settings.tsx:617` ("Available with LOT Usership — $99/month, 12 months."), `SubscribeWidget.tsx`, `About.tsx:2867` (CUBIQ tier table), `docs/corporate/LOT-AI-PRODUCT-BRIEF.md`.
- **$50/month** — `About.tsx:2807` and the canonical "Usership Tiers" section at `About.tsx:4269`.

`Settings.tsx:617` is also the *only* place in the codebase that already says "12 months" in direct connection to Usership pricing — it is the literal textual anchor for this entire document's premise, but it currently disagrees with the app's own About page on the number. **This should be resolved by S-2/product before a "12 months of Usership" narrative is put in front of users**, since the arc proposed here will make the tenure length visible and countable in the UI (Section 3), and a visible discrepancy between "12 months" and an unresolved price is worse than no messaging at all.

### 1.8 Usership has no activation timestamp — `joinedAt` is the wrong anchor

Usership is an admin-assigned tag (`About.tsx:4255`: *"No self-serve upgrade path. Access is granted, not purchased through a flow."*), not a subscription event with a start date. `MonthlyPulseWidget.tsx` currently anchors month-count to `user.joinedAt` — the account creation date. A user who joins free, uses LOT for eight months, and is *then* tagged Usership would immediately see "Month 8 of 12" with zero days of actual paid-tier history. This breaks the entire premise of a 12-month Usership arc and should be fixed before Section 3 is implemented (see 4.6).

---

## 2. Design Philosophy

Three doctrines already exist in the repo and this document adopts all three rather than inventing a fourth:

1. **"Form follows progression"** (`INTERFACE_EVOLUTION.md`) — the interface starts minimal and earns complexity. Month 1 should look *unfinished on purpose*, not like a locked, greyed-out version of month 12.
2. **"LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN"** (`LOT-AI-PRODUCT-BRIEF.md`) — the machine never demands data; it earns questions through passive observation. The 12-month arc should feel like the natural exhaust of this loop running for a year, not a separate gamification layer bolted on top of it.
3. **"The machine improves in silence... the operator notices the questions getting sharper"** — celebration moments (Section 4.4) should be rare and earned, not a constant XP-bar hum. LOT already resists "unprompted notifications" as a stated design principle; a monthly ritual is the correct cadence — weekly would violate this doctrine, daily badges already exist and are the wrong layer for *this* narrative.

**The tangibility test for every idea in Section 3 and 4:** does this change something the user can *point at* — a new block on their profile, a new paragraph they didn't have last month, a symbol next to their name — or is it an internal number nobody sees? Internal-only progress (assembly `density` scores, QIE pattern counts) stays internal. User-facing progress must render.

---

## 3. The 12-Month Arc

### 3.1 The spine: existing badge day-thresholds, not new numbers

Badge milestones already exist at exactly the day-counts a 12-month arc needs (`badges.ts:805-947`). This document maps months onto them as-is:

| Month | Day (streak) | Existing badge (Water · Architecture) | Existing message (`MonthlyPulseWidget.tsx`) | Memory Engine depth (per `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`) |
|---|---|---|---|---|
| **0 → Day 1** | 0 | — (pre-milestone) | — | Mode 1: First Question. Open, welcoming, surface preferences. |
| **1** | 7 → 30 | `∘` Droplet → `≈` Wave | *"The first month. The system is beginning to know you."* | 3+ answers: trait/archetype extraction activates. 10+: psychological cohort + trauma-informed protocol activate. |
| **2** | 30 → 60 | `≈` Wave → `≈≈` Dual Wave | *"Two months in. Patterns are starting to form."* | Follow-up mode (85%) dominant; Level 1 depth (Behavior) → Level 2 (Motivation) questions begin. |
| **3** | 60 → 90 | `≈≈` Dual Wave → `≋∘` Deep Reach | *"Three months. You have reached Active User status."* | 30 answers: "enough profile density to reference specific prior choices" — the compression ratio the whole system is named for becomes visible in question phrasing. |
| **4** | 90 → 100 | `≋∘` Deep Reach → `≋` Current | *"Four months. The portrait deepens."* | Level 3 (Values) questions become common. |
| **5** | 100 → 130 | `≋` Current (held) | *"Five months. Consistency is its own reward."* | Compressed follow-up mode (Mode 5) starts appearing on well-explored topics — 8-word questions, 2-3 tap options. |
| **6** | 130 → 180 | `≋` → `≋≋` Voyager | *"Six months. The journey is half-declared."* | Level 4 (Soul) questions now reachable. |
| **7** | 180 (held) | `≋≋` Voyager | *"Seven months in. The system has been listening."* | — |
| **8** | 180 (held) | `≋≋` Voyager | *"Eight months. Rare air."* | — |
| **9** | 180 (held) | `≋≋` Voyager | *"Nine months. The self-care practice is a habit now."* | Self-Care language fully technical (streak ≥ 30 already triggers this at `SelfCareMoments.tsx:397`; by month 9 it is long-settled, not new). |
| **10** | 180 → 365 | `≋≋` → approaching `≋≋≋` | *"Ten months. Almost there."* | — |
| **11** | 180 → 365 | approaching `≋≋≋` The Long Count | *"Eleven months. One more."* | — |
| **12** | 365 | `≋≋≋` The Long Count | *"One year with LOT. The portrait is complete — and still evolving."* | Full Memory Story, full trauma-informed protocol maturity, full archetype confidence. |

Note the honest gap between months 4–5 and 7–9: the existing badge ladder has no milestone between day 100 and day 180 (a 2.5-month plateau) and none between day 180 and day 365 (a 6-month plateau). **Rather than inventing new badge tiers to fill these** (which would fragment the already-812-badge system further), Section 4.2 proposes that the *supporting* signals — Memory Story density, self-assembly phase crossings, self-care streak language shifts — carry the felt sense of progress during plateau months, while the badge symbol itself only visibly changes at the six true thresholds (30/60/90/100/180/365 days ≈ months 1/2/3/3.3/6/12).

### 3.2 Assembly phase and OS version as secondary, non-strict overlays

Because Self-Assembly phase is activity-density-driven, not day-driven, it cannot be pinned to specific months for every user. Typical velocity for an engaged Usership operator (per `LOT-SYSTEM-OUTLINE.md` cohort data referenced in the weekly ship reports) tends to look like:

- **Month 1** — `dormant → awakening`. QR code on public profile stays hidden (requires `forming`).
- **Month 2–3** — `awakening → forming`. QR code unlocks. This is the first month-over-month change a *visitor* to the user's public profile would notice, not just the user themselves.
- **Month 4–6** — `forming → assembled`.
- **Month 7–12** — `assembled → integrated` for consistently engaged users; plenty of real Usership operators plateau at `assembled`, which is fine and should be presented as fine (per the QOS doctrine in `README.md`: *"the QOS does not direct the person — it mirrors their actual state with precision"*).

This should be surfaced as **"typically around month X"** language, never as a hard gate promise, to avoid the system contradicting itself when an unusually active or unusually quiet user doesn't match the median.

### 3.3 One narrative sentence per month (copy direction, not final copy)

For the *tangibility* the brief asks for, each month needs one clear, ownable idea beyond the existing generic `MonthlyPulseWidget` line — something that ties to what actually happened, using the `MonthlySummary` data already generated server-side (1.3):

| Month | The one thing that should feel different |
|---|---|
| 1 | The Memory Engine starts referencing something specific the user said. First time a question begins "Since you mentioned..." |
| 2 | First self-care streak visibly changes vocabulary (natural → mixed technical, per `SelfCareMoments.tsx:396`). |
| 3 | Public profile stops saying "Free — Civilian Mode" in spirit — full psychological profile block goes live. "Active User" badge threshold (existing copy). |
| 4 | QR code appears on the public profile (assembly `forming`) — the first change a *friend* can see without the user telling them. |
| 5 | Memory Engine starts asking shorter, sharper questions (Compressed Follow-Up mode) — the compression the whole product is built on becomes perceptible, not just conceptual. |
| 6 | Halfway anniversary. First "paragraph-long insight" month-in-review surfaces in-app (see 4.3), not just by email. |
| 7–8 | Quiet consolidation months — no new badge tier, so this is where the monthly paragraph insight (4.3) carries the entire felt sense of progress. This is deliberate, not a gap: constant escalation would violate the "no unprompted, no forced pace" doctrine. |
| 9 | Self-care fully in "technical mastery" register. Behavioral cohort classification is stable and rarely reclassifies month to month. |
| 10–11 | Approach to the one-year badge is visible on the persistent "Months Unlocked" widget (4.2) as a literal countdown, the only place a countdown is appropriate in a system that otherwise avoids urgency mechanics. |
| 12 | The Long Count. Full anniversary ritual (4.4). Memory Story is presented as a complete first chapter, with explicit language that it is *not* an ending — echoing the existing widget copy: *"the portrait is complete — and still evolving."* |

---

## 4. New Surfaces to Design

Ordered by leverage (highest-value, lowest-new-engineering first), since three of the five reuse data or components that already exist.

### 4.1 `MonthlyPulseWidget` v2 — make the existing widget reference reality

Keep the mechanic (fade-in toast, dismiss-once-per-month, `Block label="Month N:"`). Change the content source:

- Replace the fixed `MONTH_MESSAGES` record with a template that interpolates: the month's badge symbol (from `getLevelSymbol`), one clause pulled from that month's `MonthlySummary.narrative` (1.3), and the existing hand-written emotional beat as a closing line — so the copy stays warm and authored, but is no longer identical for every user who hits month 6.
- Fix the anchor date per 4.6 before this ships.

### 4.2 "Months Unlocked: N / 12" — a persistent widget, distinct from the dismissible toast

The task brief specifically calls for a *context-based, persistently visible* widget, separate from `MonthlyPulseWidget`'s once-a-month toast. Proposed placement: the **Stats / Dashboard** stack (alongside `GrowthMilestones.tsx`, which already renders "badge level" as one summary stat — this is a sibling stat card, not a new pattern).

Contents: a slim progress bar (0–12), current badge symbol, and one forward-looking line — *"18 days to Wave ≈"* style — computed from the same day-count already used for `getLevelSymbol`. No new backend needed; this is a read-only client composition of data already in `me.joinedAt` (once fixed per 4.6) and `badges.ts`.

### 4.3 In-app Memory / Monthly Insight widget — surface data that already exists but currently only reaches email

This is the single highest-leverage item in this document. `generateMonthlySummary()` and `shouldShowMonthlySummary()` (1.3) already compute exactly the "paragraph-long insight from last month" the brief asks for. Today it appears to only reach the user as an HTML email. Proposed: a widget, gated the same way (`shouldShowMonthlySummary()`, Usership-only, first ~3 days of the month), rendering `narrative` + `forwardLook` as a `Block label="This Month:"` in-app — the in-app twin of the email, not a replacement for it. This gives the Memory system a monthly voice inside the product itself, which is where the brief's "Memory widget displays a paragraph-long insight from last month" request is actually best satisfied — reusing `monthly-summary.ts` rather than building new summarization.

### 4.4 Anniversary ritual — upgrade the true milestone months (1/2/3/6/12) beyond a toast

At the six months where the badge symbol *actually changes* (3.1), replace the standard toast with a slightly heavier, still-brief moment: full-screen fade (matching the existing 1400ms Memory Engine transition language for consistency, per `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md §3.3`), the new badge symbol revealed, one line from that month's Memory Story, and a single dismiss tap — no share-flow friction, no forced CTA, consistent with the "no unprompted, no forced pace" doctrine. Month 12 is the only one that should feel materially larger than the others: it is the one true "portrait complete" moment referenced in the existing widget copy.

### 4.5 Day-1 onboarding — the one section with no existing code to build from

Since 1.6 confirms this is greenfield, the recommendation is to keep it minimal rather than build a multi-step wizard the rest of the product doesn't otherwise have (LOT has no other onboarding flow — a first-run wizard would be an aesthetic outlier). Proposed: Day 1 is simply the current Civilian Mode stack, unchanged, *plus* a single first-run acknowledgment of Mode 1 (First Question) — the Memory Engine's own "Day 1, 0 answers" mode already exists and already frames the first interaction correctly (§5.1 of the compression doc). No new onboarding component is needed; what's needed is making sure the *first* Memory question the user sees is visibly, textually different in tone from question #50, so the barebones feeling is a real product state, not a placeholder.

### 4.6 Fix the tenure anchor before any of the above ships

Introduce a `usershipGrantedAt` (or equivalent) timestamp, set when the `Usership` tag is applied, separate from `user.joinedAt`. This is a small backend change but a prerequisite for Sections 3 and 4.1–4.4 to mean anything for a user who wasn't Usership from day one of their account — which, given tags are admin-assigned per 1.7, is presumably the common case, not the exception.

### 4.7 Public profile — extend the tenure line beyond Board members

`PublicProfile.tsx:288-325` already renders `boardProfile.boardTenureMonths` and `citizenSince` — but only for the Board/Legacy tier, not standard Usership. Proposed: a lightweight one-line equivalent for all Usership profiles — *"Usership since {date} · Month {N}/12"* — giving the 12-month arc a public, shareable face, not just a private in-app toast. This is the most direct answer to "the demo account is a great example": the demo account's evolved feel should not require the visitor to be logged in to notice.

---

## 5. Risks and Open Questions

1. **Pricing discrepancy ($99 vs $50/mo, 1.7)** must be resolved by product/S-2 before any UI states "12 months" next to a dollar figure. This document takes no position on which number is correct.
2. **Tags are admin-assigned with no self-serve flow** (1.7) — a 12-month arc implies a subscription with a start date and renewal cadence. Confirm whether Usership is actually intended to *lapse* at month 12 (renewal) or whether "12 months" in `Settings.tsx:617` refers to a minimum commitment term inside an otherwise open-ended tag. The narrative in Section 3 currently assumes the latter (an ongoing relationship whose first year is being celebrated) — if it's actually the former, months 10–12 need materially different, renewal-aware copy.
3. **Docs-vs-code drift is a known, recent, real failure mode in this repo** — `docs/LOT-SR-20260805-01.md` documents Badge Codex v20/v21 existing only in markdown for an extended period before being implemented in TypeScript. Nothing in this document should be treated as shipped until it exists in `src/`. Recommend prototyping 4.1–4.3 (all mechanical extensions of existing widgets/data) before 4.4–4.5 (net-new UI).
4. **`/u/{username}` vs `/os/{username}`** — `About.tsx:4265` references `/os/{username}` for the free-tier public profile path while every other reference in the codebase (README, `PublicProfile.tsx`, `ProfileQRCode`) uses `/u/{username}`. Worth a one-line engineering confirmation before 4.7 ships, so tenure-line copy points at a real route.
5. **Assembly-phase timing is a median, not a guarantee** (3.2) — copy must avoid promising "the QR code unlocks in month 2" as a hard fact for every user; the existing QOS doctrine ("mirrors, does not direct") should govern the tone here too.

---

## 6. Recommended Build Order

Not a sprint plan — a dependency order, respecting the existing `lot-benchmark` discipline of shipping green, working increments rather than a big-bang release:

1. **4.6** (tenure anchor fix) — everything else depends on this being correct.
2. **4.1** (MonthlyPulseWidget v2) — smallest surface area, reuses an existing, already-shipped component.
3. **4.3** (in-app monthly insight) — reuses `monthly-summary.ts` entirely; no new generation logic, only a new render path.
4. **4.2** (persistent Months Unlocked widget) — pure client composition of data already available after step 1.
5. **4.7** (public profile tenure line) — small, high-visibility, no dependency on 4.4/4.5.
6. **4.4** (anniversary ritual) — the first genuinely new interaction pattern in this list; build last so it can reuse whatever visual language 4.1–4.3 establish.
7. **4.5** (Day-1 framing pass) — lowest urgency; the existing Civilian Mode stack already functions, this is a polish pass on tone, not a missing feature.

---

## Appendix — File Reference Index

For whoever implements this next:

```
src/client/components/MonthlyPulseWidget.tsx        — existing Month N/12 toast (4.1 target)
src/client/utils/badges.ts:805-947                   — milestone_7/14/21/30/50/60/90/100/180/365 definitions
src/client/utils/badges.ts:7306-7361                 — getLevelSymbol / getLevelName
src/server/utils/monthly-summary.ts                  — generateMonthlySummary, shouldShowMonthlySummary (4.3 source)
src/client/components/PublicProfile.tsx:288-325      — Usership Board Profile block (4.7 reference pattern)
src/client/components/PublicProfile.tsx:611-663      — QR code, Usership + assemblyPhase gated
src/client/stores/selfAssembly.ts                    — assembly phase state (3.2)
src/client/components/ArchitectWidget.tsx             — self-assembly UI
src/client/components/SelfCareMoments.tsx:391-398    — streak-based language register shift
docs/technical/INTERFACE_EVOLUTION.md                — evolution store, feature-unlock substrate (§1.4)
docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md — question depth levels, compression doctrine
docs/corporate/LOT-AI-PRODUCT-BRIEF.md               — LOG→OBSERVE→COMPRESS→ASK loop, tier pricing table
src/client/components/Settings.tsx:617               — "$99/month, 12 months" (1.7)
src/client/components/About.tsx:4251-4299             — canonical Usership Tiers doc ($50/month) (1.7)
src/client/components/stats/GrowthMilestones.tsx     — sibling pattern for 4.2
```

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
