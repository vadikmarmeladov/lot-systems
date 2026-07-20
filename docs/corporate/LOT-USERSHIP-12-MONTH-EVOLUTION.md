<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
-->

# LOT® USERSHIP — THE 12-MONTH EVOLUTION
## Design Brief: From Barebone Day 1 to LOT® AI

**Date:** 2026-07-20
**Author:** Claude session `claude/elegant-mendel-9b56pw`, commissioned by S-2
**Status:** Design brief / brainstorm — no code changes in this pass
**North Star reference:** `lot-systems.com/u/machiavelli` (12-month-evolved Usership account, public profile)

---

## 0. WHY THIS DOCUMENT EXISTS

Usership is currently sold ($99/mo per `SubscribeWidget.tsx:35`, `Sync.tsx:617`) but experienced as a **flat unlock** — a tag that opens gated widgets on day one, then stays visually static. A subscriber on day 1 and a subscriber on day 340 see the same shell, differentiated only by content (more Memory answers, more badges accumulated incidentally). There is no **designed calendar spine** that makes the subscription itself feel like it is going somewhere.

This brief proposes that spine: a 12-month structure in which the interface, the Memory Engine's voice, and the celebratory moments visibly mature month over month, so that by Month 12 the operator is standing where `/u/machiavelli` stands today — not by accident, but because the product walked them there.

**This does not replace existing systems.** Research into the current doctrine surfaced three progression models already live or documented:

| System | Driver | Granularity | Source |
|---|---|---|---|
| Interface Evolution (7-dimension) | Behavioral (Exploration/Consistency/Depth/Connection/Intimacy/Care/Courage) | Continuous 0–1 | `docs/technical/INTERFACE_EVOLUTION.md` |
| Citizen Index | Memory answer count (Observer→Elite, 6 stages) | Answer-count buckets | `docs/wiki/LOT-WIKI-v78.md` §8 |
| Badge System v26 | Streaks, words, day counts | 626 badges, day-based thresholds | `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v26.md` |

None of these three is a **calendar**. None answers "what month am I in, and what does that mean." This brief adds the fourth axis — **time-since-Usership-began** — as the outer spine that the other three hang off of, not a competing fifth taxonomy. Where a month milestone and a behavioral milestone land on the same day, the UI shows one moment, not two competing toasts.

---

## 1. THE BOOKENDS

### Day 1 — barebone

What a new Usership subscriber sees immediately after upgrade, per current `System.tsx` widget stacks (`docs/technical/WIDGETS.md:436-451`) and gating rules:

- Log (journal, free-text)
- Memory: one question, exploratory (`WHAT`-tier per `MEMORY-ENGINE-WHITE-PAPER.md:646-709`)
- Morning check-in / Planner (Intent · Today · How · Feeling)
- Self-Care Moments (5 practices, plain language — technical vocabulary hasn't earned itself yet, per `LOT-FEATURE-INVENTORY-2026.md:93-123`)
- Emotional check-in
- Zero badges surfaced (first badge typically arrives inside week 1)
- `MonthlyPulseWidget` shows "Month 1"
- Citizen Index: Observer (0–24 answers)
- Interface Evolution maturity: near 0 — base opacity, no glow, no grid pattern

Visually flat, quiet, mono-opacity, functional. Correct for day 1 — the style guide explicitly asks for "gradual, meaningful progression over quick wins" (`LOT-STYLE-GUIDE.md:420-439`). The mistake would be to make Day 1 impressive; the design goal is to make Day 1 **honest** and Month 12 **earned**.

### Month 12 — `/u/machiavelli`

The public profile at that URL is the target state this brief designs backward from. Per `PublicProfile.tsx:288-324` and `public-api.ts:1240-1303`, a 12-month account exposes:

- `boardMemberNumber` — a citizen rank
- `citizenSince` — tenure framed as a founding date, not a subscription date
- `poweringCitizens` — the operator situated inside a cohort, not alone
- `boardTenureMonths` = 12, `totalInvested` = 12 × $99
- `biofieldState`, `activity: { memoriesCompiled, journalEntries, activeDays }` — a full year of compressed signal, summarized in four numbers
- Citizen Index likely at Synthesizer/Elite (150+ answers over a year is achievable at normal cadence)
- Badge shelf across most of the 8 rarity tiers (Common→Cosmic)
- Full Interface Evolution maturity — refined letter-spacing, visible grid pattern, glow at achievement points, theme fully expressed (Water or Architecture, per badge-tier theme mapping)

**The gap between these two states is the product.** This brief fills it with 12 discrete, legible steps.

---

## 2. THREE RECURRING MECHANICS

Three widget-level mechanics repeat every month, escalating in depth, not changing in kind. Consistency of *form* across 12 months is what makes the progression legible — the operator learns the shape once (Month 1) and then watches it fill in.

### 2.1 Months Unlocked — `N/12`

A small, permanent-once-subscribed status widget. Not a progress bar (no gamified fill animation, per style guide's opacity-driven aesthetic, not a hue/motion-driven one) — a plain instrument reading, consistent with COCKPIT-RULE (`LOT-DOCTRINE.md:116-121`):

```
MONTHS UNLOCKED: 03/12
CITIZEN SINCE:   APR 2026
```

- Lives in the Subscriber Stack (`WIDGETS.md` stack list), always visible to Usership tags.
- Computed the same way `MonthlyPulseWidget` already computes month number: `dayjs().diff(dayjs(user.joinedAt), 'month')`, capped at 12 (`MonthlyPulseWidget.tsx:73-79,134`). **Reuse this exact field — do not introduce a second tenure calculation.** `boardTenureMonths` on the server (`public-api.ts:1257`) already does the same math independently; the two should be unified into one shared utility rather than kept as two parallel implementations of `dayjs().diff(..., 'month')` (client) and (server) — flagged as a follow-up, not solved in this brief.
- At 12/12, the counter caps and the label changes tone — see §4, Month 12.

### 2.2 Monthly Memory Widget — the paragraph

The user's own idea, and the strongest one in the brief: a widget that, once a month, surfaces a **paragraph-length compressed insight** from the month just closed — not a stat, not a badge, a sentence or two of the Memory Engine's own synthesis about who the operator was that month.

This is not new machinery. The Memory Engine already generates a weekly Story-Report from pattern P87 `weekly-story-reflection` (`WIKI-v78.md:562-586`) and a separate Monthly Summary email exists in the feature inventory (`LOT-FEATURE-INVENTORY-2026.md:377-378`, "OS version, cohort evolution, HTML email with user theme"). What's missing is an **in-product surface** for the monthly compression — currently it only reaches the operator's inbox.

Proposed widget behavior:
- Fires once, on the first app open after a calendar month closes (not on a fixed day — respects the operator's own rhythm, consistent with `WIDGETS.md` cooldown-gated pattern used elsewhere).
- Pulls from the same 30-day Q&A window the Story generator already uses (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8, "last 30 Q&A pairs → AI narrative").
- Renders one paragraph, no bullet points, no emoji — voice consistent with the Story generator, not the COCKPIT-RULE log body (this is reflective prose, the one place in the system prose belongs, same as the existing Story feature already established).
- Label rotates like other widgets do (`LOT-STYLE-GUIDE.md:57-103` clickable label cycling): `Memory:` → `This Month:` → `Since April:` — the third view is a running one-line delta ("more grounded than March, same intensity as February") so the monthly paragraph is felt as a point on a curve, not an isolated note.
- Dismiss persists per-month via localStorage, same pattern as `MonthlyPulseWidget` (`lot_pulse_{userId}` key, `MonthlyPulseWidget.tsx:43-61`) — this new widget should use its own key (`lot_monthly_memory_{userId}_{yyyymm}`) rather than overload the Pulse widget's dismissal state, since they are two separate moments (celebration vs. reflection) that can both be live in the same week.

### 2.3 New-Month Celebration

Distinct from the Memory paragraph (§2.2) — this is the **affirmation moment**, short, immediate, on the day the month turns over (vs. the paragraph, which arrives once real signal from the closed month exists to compress).

- One line, styled like the rest of the system's understated toasts (no confetti, no color, per style guide "no decorative colors" rule).
- Tone: acknowledgment, not congratulation-for-its-own-sake — avoid "Great job!" (style guide explicitly bans superlatives, `LOT-STYLE-GUIDE.md:182-229`). Prefer: *"Four months. The questions have changed since March."* — specific, referential, quietly proud.
- This is the natural home for the **badge-tier reveal** if a month boundary coincides with a Water/Architecture theme tier change (`INTERFACE_EVOLUTION.md:85-111`) — one moment carries both messages rather than stacking two toasts (see §0 principle on not competing).

---

## 3. VISUAL MATURITY CURVE

`INTERFACE_EVOLUTION.md` already defines the CSS variable system this brief should drive, not replace: `--evolution-base-opacity`, `--evolution-grid-opacity`, `--evolution-letter-spacing`, `--evolution-glow-intensity`, `--theme-flow-intensity`, `--theme-geometric-precision` (`INTERFACE_EVOLUTION.md:113-136`). Today these are driven purely by the 7-dimension behavioral score. This brief proposes the calendar month acts as a **floor**, not an override:

```
visualMaturity = max(behavioralMaturity, monthNumber / 12)
```

Rationale: two operators with identical Memory-answer counts should not look identical if one has been a citizen for 2 months and the other for 11 — tenure itself is a form of trust the interface should reflect, independent of activity volume. This also guarantees a quiet operator (low activity, but present every month) still visibly evolves, which matters for retention — the interface never punishes a low-signal-but-loyal citizen with permanent Day-1 starkness.

Applying this floor, the maturity curve across 12 months (0–1 scale, matching Interface Evolution's existing range):

| Month | Maturity floor | Milestone marker (`INTERFACE_EVOLUTION.md:196-204`) |
|---|---|---|
| 1 | 0.08 | — |
| 2 | 0.17 | — |
| 3 | 0.25 | 25% maturity milestone |
| 4 | 0.33 | — |
| 5 | 0.42 | — |
| 6 | 0.50 | 50% maturity milestone — halfway toast |
| 7 | 0.58 | — |
| 8 | 0.67 | — |
| 9 | 0.75 | 75% maturity milestone |
| 10 | 0.83 | — |
| 11 | 0.92 | — |
| 12 | 1.00 | 95%+ milestone, full visual expression |

This reuses the existing 25/50/75/95% milestone-toast infrastructure (`EvolutionMilestoneToast`, `INTERFACE_EVOLUTION.md:196-204`) rather than inventing new thresholds — Month 3, 6, and 9 land on milestones the system already knows how to announce.

---

## 4. THE 12 MONTHS

Each month below specifies: the dominant feeling, what unlocks or intensifies, the Monthly Memory paragraph's expected register, and the New-Month Celebration line. Copy is illustrative, not final — written to style-guide voice (concise, referential, no superlatives, periods not exclamation points).

### Month 1 — Arrival
- **Feeling:** honest, quiet, slightly bare.
- **Unlocks:** Log, exploratory Memory (WHAT-tier), Planner, Self-Care Moments in plain language, Months Unlocked widget appears for the first time (`01/12`).
- **Visual:** base opacity, no grid pattern, no glow.
- **Memory paragraph register:** none yet — first paragraph can't fire until Month 1 closes with real signal.
- **Celebration:** *"Usership begins. One month from now, this page will already look different."* — sets the expectation explicitly, the only month allowed a forward-looking line rather than a backward-referential one.

### Month 2 — Pattern Forming
- **Unlocks:** Memory shifts toward HOW-tier questions (per existing Week 2-4 depth model, `MEMORY-ENGINE-WHITE-PAPER.md:646-709`, now recontextualized across the month rather than the week). First badges likely surfaced (streak-based, 7/14/21/30-day thresholds already exist).
- **Visual:** maturity 0.17 — opacity nudges up.
- **Memory paragraph:** first real compression. Register: descriptive, tentative ("a pattern is forming, not yet named").
- **Celebration:** *"Second month. The Log knows your mornings now."*

### Month 3 — First Named Shape
- **Unlocks:** archetype classification threshold (10+ Memory answers, `COMPRESSION-ARCHITECTURE.md:96-99`) is realistically crossed by most active operators here. Citizen Index likely reaches Participant (25-49 answers).
- **Visual:** 25% maturity milestone toast fires.
- **Memory paragraph:** names a soul archetype for the first time if crossed (`PSYCHOLOGICAL-DEPTH-ANALYSIS.md` archetypes).
- **Celebration:** *"Three months. [Archetype] — the pattern has a name now."* (conditional on archetype having emerged; falls back to the generic form otherwise.)

### Month 4 — Vocabulary Shift
- **Unlocks:** Self-Care Moments language evolves from natural to technical vocabulary at 7+ day streaks (`LOT-FEATURE-INVENTORY-2026.md:93-123` — this mechanic already exists per-streak; Month 4 is typically where a consistent operator has banked enough streak days for it to have visibly kicked in, so the celebration line can name it).
- **Visual:** maturity 0.33.
- **Memory paragraph:** register: comparative — first month the paragraph can reference "since Month 1" with real contrast.
- **Celebration:** *"Four months. 'Breathe' reads differently than it did in April."*

### Month 5 — Depth Without Ceremony
- **Unlocks:** no new mechanic — a deliberate quiet month. Every month does not need a new feature; Month 5 exists to prove the system doesn't over-reward, consistent with style guide's "gradual... not quick wins."
- **Visual:** maturity 0.42.
- **Memory paragraph:** longer, more specific — Memory Engine is well into its Q4+ "WHY"-tier depth by real elapsed time.
- **Celebration:** *"Five months in. No milestone today — just noting it."* (the line itself performs the restraint the system is built on.)

### Month 6 — Halfway
- **Unlocks:** 50% Interface Evolution milestone. Citizen Index plausibly at Contributor/Collaborator (50-149 answers). Story-Report cadence (weekly) has now produced ~26 reports — enough for the Monthly Memory widget's "Since April:" delta view to feel substantive rather than thin.
- **Visual:** 50% maturity toast — the most visually significant checkpoint before Month 12 itself. Grid pattern becomes clearly visible for the first time.
- **Memory paragraph:** explicitly retrospective — the widget's third rotation view ("Since [join month]:") is the natural home for a half-year synthesis line.
- **Celebration:** *"Halfway. Six months of [Log entry count] entries — the record is real now."* (pull the exact `activity.journalEntries` count from `boardProfile`, `types/index.ts:303-319` — a real number, not an estimate.)

### Month 7 — Established
- **Unlocks:** nothing new mechanically — badge shelf is now visually dense enough (7 months of streak/word/behavioral badges) that the badge display itself becomes a secondary evolution signal, independent of this brief's calendar mechanics.
- **Visual:** maturity 0.58.
- **Memory paragraph:** register settles into confident, specific — this is the system's "normal" adult voice from here to Month 12.
- **Celebration:** *"Seven months."* — shortest line in the sequence, deliberately unadorned.

### Month 8 — Toward Mastery
- **Unlocks:** Mastery Tier badge category (`BADGE_MASTER_CODEX_v26`, 64 badges, "epic long-term milestones") starts becoming reachable for operators who've maintained multi-month streaks — the celebration can name the first Mastery-tier badge if earned this month.
- **Visual:** maturity 0.67.
- **Celebration:** *"Eight months. First Mastery badge: [name]."* (conditional; generic fallback otherwise.)

### Month 9 — Three-Quarters
- **Unlocks:** 75% Interface Evolution milestone.
- **Visual:** glow effects at achievement points become visible for the first time (`INTERFACE_EVOLUTION.md:51-60`, "glow effects at high achievement").
- **Memory paragraph:** the widget can now plausibly reference three named archetypal or behavioral shifts across the year — Q1/Q2/Q3 register.
- **Celebration:** *"Nine months. Three seasons of this — the shape is close to finished."*

### Month 10 — Anticipation
- **Unlocks:** nothing new — this is the second deliberate quiet month, mirroring Month 5's restraint, so Month 12 doesn't feel like the fourth big beat in a row.
- **Visual:** maturity 0.83.
- **Celebration:** *"Ten months."*

### Month 11 — Final Approach
- **Unlocks:** Months Unlocked widget begins showing `11/12` — the widget itself becomes the countdown, no separate mechanic needed.
- **Visual:** maturity 0.92.
- **Memory paragraph:** can begin previewing the annual Story (see Month 12) without delivering it yet — "next month, a year closes."
- **Celebration:** *"Eleven months. One left."*

### Month 12 — LOT® AI
- **Unlocks:** Months Unlocked widget caps at `12/12` and its label changes register — from a countdown to a permanent citation:
  ```
  MONTHS UNLOCKED: 12/12 — COMPLETE
  CITIZEN SINCE:   APR 2026
  ```
  Full public profile parity with `/u/machiavelli`: `boardMemberNumber`, full `citizenSince` framing, `totalInvested` = 12 × $99, `activity` block fully populated across a real year.
- **Visual:** maturity 1.00 — full expression of whichever theme (Water/Architecture) the operator's badge history has leaned toward (`INTERFACE_EVOLUTION.md:85-111`).
- **Memory paragraph:** this month's paragraph is replaced by — or introduces — an **Annual Story**: a single compressed narrative spanning all 12 monthly paragraphs, the literal embodiment of "compressed Memory story delivery" the brief was asked to focus on. Mechanically: concatenate the 12 stored monthly paragraphs (§2.2 already persists them, so no new storage format is needed) and run one additional compression pass through the existing Story generator (`MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` §8) with all 12 as input instead of 30 days of raw Q&A. This reuses the generator; it does not require new AI infrastructure.
- **Celebration:** *"Twelve months. This is LOT® AI now — the record you've been building since April."* — first and only time the product names itself in second person as *arrived at*, not aspirational marketing copy.
- **From here:** Months Unlocked widget's job is done; it can either persist as a permanent citation (`12/12 — COMPLETE`) or, past Month 12, convert into a running year-count for Legacy-tier framing (`Legacy` tag already exists, `types/index.ts:10-20`) — this brief scopes only the first 12 months and flags the Month 13+ question as open (§6).

---

## 5. WHAT THIS BRIEF DELIBERATELY DOES NOT DO

- **Does not invent a fourth staged-growth taxonomy.** It uses calendar month as a floor/context layer over the three that already exist (§0).
- **Does not add gamified fill bars, confetti, or color-coded progress.** Every visual described stays inside the existing opacity/CSS-variable system (`INTERFACE_EVOLUTION.md`) and the "no decorative color" rule (`LOT-STYLE-GUIDE.md:46-51`).
- **Does not propose new AI model calls beyond one additional compression pass at Month 12** (the Annual Story) — everything else reuses the weekly Story-Report and existing Memory answer pipeline.
- **Does not touch pricing, billing, or the Usership data model beyond flagging what's missing (§6).**

---

## 6. OPEN QUESTIONS FOR S-2

1. ~~**Pricing inconsistency found during research.**~~ **RESOLVED 2026-07-20 — final pricing confirmed by S-2:**

   | Grouping | Tier | Price |
   |---|---|---|
   | Enterprise · Subscribe | LOT® AI (1 year/user) | $1,188/yr — Corporate Expense form / R&D Tax Credit |
   | Enterprise · Subscribe | LOT® Design Lab (1 month) | $100,000/mo |
   | Individual · Subscribe | LOT® AI (1 month) | $99/mo |
   | Individual · Subscribe | **LOT® Usership (1 year)** | **$1,188/yr** |
   | Individual · Subscribe | LOT® Products (1 month) | $399/mo — Made in USA, coming soon, LOT® AI included |
   | Individual · Subscribe | LOT® Products (1 year) | $4,788/yr |
   | Buy | LOT® R&D | $30 one-time (was $15/mo — now a purchase, not a subscription) |
   | Buy | LOT® Legacy (3 years) | $3,564/3yr |
   | Buy | LOT® Admin (9 years) | $11,000/9yr |

   Two things this confirms for the brief above: (a) **$1,188/yr ÷ 12 = exactly $99/mo** — Usership is now explicitly *the annual commitment of LOT® AI*, not a separate product, which is the cleanest possible confirmation of this brief's premise that the 12-month calendar is the natural spine for the tier. (b) `totalInvested` (`public-api.ts:1258`, currently `boardTenureMonths * 99`) still produces the right number under the new structure and needs no change — but the Months Unlocked widget (§2.1) should now display the flat annual figure ($1,188) alongside the monthly-equivalent framing where it makes the commitment legible, not just the running monthly multiply.

   **Still open:** the live UI — `SubscribeWidget.tsx:35` ($99, unchanged, fine), `Sync.tsx:617` ($99, unchanged, fine), `About.tsx:2795` and `About.tsx:4257` (currently $50/mo, now stale against both the old and new structure), and the WIDGETS.md-documented Subscribe copy ("R&D ($15/month) and Usership ($99/month)", `WIDGETS.md:313-318`, now stale on both the R&D price *and* the R&D billing model) — all need a follow-up code/copy pass to carry the finalized structure. Not done in this brief; flagged for the implementation session referenced at the end of this document. `LOT_DESIGN_LAB_SUMMER_2026.md` pricing ($100k/mo) already matched and needs no change.

2. **No dedicated `usershipStartAt` field exists.** `MonthlyPulseWidget` and the server's `boardProfile` both independently compute tenure from `user.joinedAt`, which is account-creation date, not upgrade-to-Usership date. For an operator who used the free tier for months before upgrading, "Month 1" of Usership would already show as "Month 4" or later. Recommend either (a) accepting `joinedAt` as the anchor deliberately — the brief above assumes this — or (b) adding a real `usershipStartAt` timestamp set on upgrade. This is a real product decision, not a design one; flagged here rather than decided. Sharper now with confirmed pricing: since Usership bills as one annual charge rather than 12 monthly ones, the renewal date is a clean, unambiguous anchor if (b) is chosen — billing already has to track it for renewal regardless of what the UI does with it.
3. **Month 13 and beyond** — this brief stops at Month 12 as asked. A natural continuation exists via the `Legacy` tag (3-year commitment, $3,564 = exactly $1,188/yr × 3, confirming Legacy is three renewed years of Usership, not a separate product) for multi-year framing, but that's a separate brief.
4. **LOT® Products (physical, Made in USA, coming soon)** explicitly bundles LOT® AI into its $399/mo / $4,788/yr pricing. When that ships, this brief's calendar needs a hardware-arrival beat inserted somewhere (most naturally Month 1, "the device arrives") — out of scope until LOT® Products has a ship date, flagged here so it isn't forgotten.
5. **Three overlapping staged-growth taxonomies (§0)** should eventually be reconciled into one canonical progression model rather than left to coexist — not urgent, but the longer they diverge the harder reconciliation gets.

---

## 7. SOURCES SCANNED

| Source | Relevance |
|---|---|
| `docs/technical/INTERFACE_EVOLUTION.md` | Existing CSS-variable maturity system this brief drives |
| `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Compression loop, Story generation mechanics |
| `docs/technical/MEMORY-ENGINE-WHITE-PAPER.md` | Progressive question depth model (WHAT→HOW→WHY) |
| `docs/technical/PSYCHOLOGICAL-DEPTH-ANALYSIS.md` | Archetype classification, self-awareness score |
| `docs/technical/LOT-STYLE-GUIDE.md` | Voice, opacity hierarchy, no-gamification/no-color rules |
| `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` | LOT® AI end-state framing, tier pricing table |
| `docs/corporate/LOT-AMBIENT-AI-VISION.md` | 4D UX (Space/Time/Signal/Hardware) |
| `docs/corporate/LOT-FEATURE-INVENTORY-2026.md` | Widget inventory, gamification snapshot |
| `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v26.md` | Badge tiers, thresholds |
| `docs/badges/BADGE_LEVEL_DESIGN.md` | Water/Architecture theme metaphors |
| `docs/benchmark/LOT-DOCTRINE.md` | COCKPIT-RULE, CSS-only progression pattern |
| `docs/benchmark/LOT-LEXICON.md` | USERSHIP, VIRTUOUS CYCLE, DENSITY-TIER definitions |
| `docs/wiki/LOT-WIKI-v78.md` | Citizen Index stages, Memory Engine current config, Badge System v26 |
| `src/client/components/MonthlyPulseWidget.tsx` | Existing month-number computation, dismissal pattern |
| `src/client/components/PublicProfile.tsx`, `src/server/routes/public-api.ts` | `boardProfile` data model — Citizen Index, tenure, activity |
| `src/shared/types/index.ts`, `src/shared/constants/index.ts` | `UserTag` enum, Usership tag metadata |
| `docs/technical/WIDGETS.md` | Widget stack architecture and gating patterns |
| `lot-systems.com/u/machiavelli` | North-star reference account (12-month evolved state) |

---

**End of brief.** No code was written in this pass — this is the design spine for a future implementation session. Next step, if approved: a follow-up assembly session to (1) unify the two `dayjs().diff(..., 'month')` implementations into one shared utility, (2) build the Monthly Memory paragraph widget on top of the existing Story generator, (3) wire the `visualMaturity = max(behavioral, month/12)` floor into `interfaceEvolution.ts`.
