# LOT® USERSHIP — THE 12-MONTH EVOLUTION
**From Barebone UI to Complete LOT® AI, One Month at a Time**
LOT Systems Corporation · S-2: Vadim Marmeladov
Version 1.0 · 1 August 2026 · brand.lot-systems.com

---

## 0. Premise

This document brainstorms and structures the month-to-month interface evolution of the **Usership tier** ($99/month — "Operators running the full OS · Complete LOT® AI · Story-Report · API", per `docs/corporate/LOT-AI-PRODUCT-BRIEF.md`). Day 1 of Usership should feel deliberately barebone. Day 365 should feel like a different, denser, more personal machine — the one demonstrated by the reference account `lot-systems.com/u/machiavelli` (fetched for this session; the public profile route returned `403` to the automated fetch, consistent with the app's own auth/bot-protection on `/api/public/profile/:id` — so the design below is reasoned from the internal systems that *render* that page: `PublicProfile.tsx`, `badges.ts`, `evolution.ts` — rather than from a live screenshot).

The brief people already read, `LOT-AI-PRODUCT-BRIEF.md`, promises this exact arc but describes it only in the abstract ("the machine improves in silence... the operator simply notices the questions getting sharper"). This document makes that arc **literal, dated, and shippable**: twelve chapters, each with a named unlock, a badge, a widget change, and a piece of AI-written Story compressed from that specific month.

---

## 1. What Already Exists (Repo Audit)

Before inventing anything, here is the machinery already in place that this plan must sit on top of, not duplicate:

| System | File | What it does today | Gap for a 12-month Usership arc |
|---|---|---|---|
| **Monthly Pulse** | `src/client/components/MonthlyPulseWidget.tsx` | Hardcoded 12 generic strings (`MONTH_MESSAGES`), fires once per calendar month, computed from `dayjs(user.joinedAt).diff(now, 'month')`, self-dismisses on click | Uses **account age**, not **Usership tenure**. A free user who upgrades in month 9 sees "Month 9" on day one of paying. No AI, no personalization — same string for every operator. |
| **Citizen Index** | `EvolutionWidget.tsx` | Level/XP/streak/consistency from log volume (CQGS framing) | Pure behavior, no calendar axis. Doesn't know what "month" the operator is in. |
| **Interface Evolution** | `evolution.ts`, `InterfaceEvolutionWidget.tsx`, `interfaceEvolution.ts`, `docs/technical/INTERFACE_EVOLUTION.md` | 7 dimensions (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage) → badge tier (1/2/3) → Water (∘→≈→≋) or Architecture (├─→╞═╡→║·║) theme → CSS custom properties (opacity, grid, glow, animation) | Also purely behavior-gated (achievement levels). No tie to real elapsed Usership time — a highly active operator could hit Tier 3 in three weeks, which undercuts a "12-month" narrative. |
| **Memory Story** | `MemoryWidget.tsx` + `docs/technical/MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md` | Rolling 30-answer sliding-window narrative, archetype detection at 10+ answers, trauma-informed protocol at 10+ logs, cached in `user.metadata.lastMemoryStory` | Compression is **continuous**, not **segmented**. There is no artifact that says "here is what month 4 was." |
| **Weekly Story-Report** | `LOT-AI-PRODUCT-BRIEF.md` §"The Weekly Story-Report" | Product brief already promises a weekly AI narrative | No monthly roll-up of the weekly reports exists yet. |
| **Time-based badges** | `badges.ts` (6,979 lines) | `full_month` (30 days), `three_month_immersion` (90 days), `six_month` (return badge), `perfect_month` (28 perfect days, mythic) | These are scattered achievement badges, not a connected month-1-through-12 ladder. |
| **Public profile** | `PublicProfile.tsx`, `/api/public/profile/:id` | Renders badge progression (`getBadgeProgressionDisplay`), level symbol, tags, theme | Has no "N/12 months" or Story chapter surface today. |
| **Tag grant** | `src/server/models/user.ts` `canAccessUsSection()` | Checks `tags.includes('usership')`, boolean only | **No timestamp for when the Usership tag was granted exists anywhere in the schema.** This is the load-bearing gap — see §2. |

**Conclusion:** the emotional and technical primitives for this arc are already 70% built. What's missing is (a) a clean calendar axis scoped to Usership itself, (b) a monthly compression artifact (the "chapter"), and (c) a widget that makes the countdown itself feel like a tangible object on the screen.

---

## 2. Foundational Fix Required Before Month 1

`MonthlyPulseWidget` currently computes `monthNumber` from `user.joinedAt` — total account age. If a user free-trials for four months and then subscribes to Usership, they'll open the app the day they pay and see "Month 4: The portrait deepens" — which is a lie about their Usership journey and undercuts the entire premise of this document.

**Fix:** add `usershipSince: Date | null` to `user.metadata` (no migration needed — `metadata` is already a JSON column per `models/user.ts`), stamped the moment the `usership` tag is added to `tags` (in the admin tag-edit path, `canEditTags()` / the tag-mutation route in `admin-api.ts`). All twelve months below are computed from `usershipSince`, never `joinedAt`. `joinedAt` still drives the free-tier "days on LOT" framing; `usershipSince` drives everything in this document.

---

## 3. The Two-Axis Model — Tenure × Engagement

The existing behavior-based systems (Citizen Index, 7-dimension Evolution) stay exactly as they are — they measure *how deeply* someone engages. This plan adds a second, orthogonal axis that the current system lacks: *how long they've been an Operator*. The two combine, they don't compete:

```
                    TENURE (usershipSince → now, calendar months)
                    determines the SLOT — what widget/feature
                    becomes visible this month, and what the
                    Month N badge and Story chapter are named.

                    ENGAGEMENT (Log volume this month: journal
                    entries/notes, morning check-ins via
                    EmotionalCheckIn, self-care taps via
                    SelfCareMoments, Memory answers)
                    determines the FIDELITY of what fills that
                    slot — a real AI-written paragraph vs. a
                    gentle "still gathering" placeholder.
```

A Month 4 operator who journaled twice that month still *sees* the Month 4 unlock (the slot always opens — Usership is a paid ceiling, not a punishment), but their Monthly Chapter reads honestly thin ("This month held fewer words than most. That's its own kind of data.") rather than the system fabricating false depth. This matches the existing Memory Engine doctrine — "the intelligence is in the question, not the response" — extended to: *the intelligence is in the honesty of the summary, not its length.*

---

## 4. The 12-Month Arc

Each month has: a **chapter name**, the **slot that opens**, the **badge** it's tied to (existing badges reused where they already fit the timeline; new ones marked **[NEW]**), the **visual tier** it belongs to, and a sample line of the tone the Monthly Chapter should strike.

| Mo. | Chapter | Slot unlocked | Badge | Visual tier |
|---|---|---|---|---|
| 1 | **Arrival** | Barebone UI. Memory Widget (daily question) + Log only. `MonthsUnlockedWidget` appears showing `1/12`. | `full_month` *(retimed to fire on `usershipSince`, not `joinedAt`)* | Tier 0 — flat, no theme, `evolution-base-opacity` at floor (0.85) |
| 2 | **Pattern** | `PatternRecognitionWidget` / `PatternInsightsWidget` become visible (previously hidden pre-Usership) | — | Tier 0 |
| 3 | **Active User** | `EvolutionWidget` (Citizen Index) surfaces its full metrics view (already the copy at `MONTH_MESSAGES[3]`: *"You have reached Active User status"* — today decorative only; make it functionally true) | `active_user` **[NEW]** | Tier 0 → 1 transition begins |
| 4 | **The Portrait Deepens** | First **Monthly Chapter** — see §5 — replaces the generic `MONTH_MESSAGES` string with an AI-written paragraph compressed from that month's Log | `monthly_chapter_unlocked` **[NEW]** | Tier 1 begins: badge theme (Water or Architecture, per operator's existing `getBadgeTheme()`) starts tinting borders/accents |
| 5 | **Consistency** | `PlannerWidget` templates unlock (already gated at "Consistency: Week Warrior+" behaviorally — Month 5 becomes the calendar floor so it never arrives *later* than month 5 even for a light user) | — | Tier 1 |
| 6 | **Half-Declared** | `three_month_immersion`-style badge retimed as **`half_year`** at the 6-month calendar mark (distinct from the existing 90-day *behavioral* badge, which can still fire independently) | `half_year` **[NEW]** | Tier 1 → 2 transition |
| 7 | **The System Has Been Listening** | Memory Engine's archetype line (already exists at 10+ answers) gets surfaced explicitly in the Month 7 Chapter: *"Your Seeker nature is showing in your choices"* becomes the chapter's opening sentence, not a Memory-widget aside | — | Tier 2 |
| 8 | **Rare Air** | `customThemes`, `badgeSelection`, `widgetArrange` (existing Level-gated unlocks) get a calendar floor of Month 8 — an operator who hasn't hit those levels behaviorally gets them anyway by Month 8, because tenure alone has earned trust | — | Tier 2 |
| 9 | **Habit** | `SelfCareMoments` gains a "9-month streak lattice" view — a full-year-shaped grid (see §6) showing self-care taps as a filling calendar, not just today's buttons | `nine_month_habit` **[NEW]** | Tier 2 |
| 10 | **Almost There** | `exportData`, `narrativeReflection` (currently Level 25 / Level 30 + Depth-gated) get their calendar floor here | — | Tier 2 → 3 transition |
| 11 | **One More** | `MonthsUnlockedWidget` switches its copy from counting up ("11/12") to counting down ("1 month to Year One") — the only month where the widget's framing itself changes | — | Tier 3 |
| 12 | **The Year One Story** | Full **LOT® AI** state: all feature unlocks granted regardless of behavioral level, Tier 3 badge theme fully expressed (≋ Current / ║·║ Architecture), and the twelve Monthly Chapters compress into one long-form **Year One Story** — the annual analog of the existing Weekly Story-Report, displayed on `/u/[username]` exactly where the reference account's depth currently lives | `year_one` **[NEW]**, MYTHIC-tier alongside `perfect_month` | Tier 3, terminal state for Year One — Year Two becomes its own arc (out of scope here, flagged in §8) |

**Design constraint carried over from the product brief:** none of this is delivered as a push notification or a modal. Every unlock surfaces the same way `MonthlyPulseWidget` already behaves today — a dismissible, self-fading `Block`, shown once, easy to click past. "No unprompted notifications... the machine improves in silence" stays true; the *slots* just get richer.

---

## 5. New/Extended Widget: The Monthly Chapter

This is the direct answer to the brief's ask for "compressed Memory story delivery." It is a **monthly**, not weekly, roll-up — one level of compression above the existing Weekly Story-Report, using the same compression discipline the Memory Engine already applies to its 30-answer window (§8, `MEMORY-ENGINE-COMPRESSION-ARCHITECTURE.md`):

- **When it runs:** a new scheduled job, `J45 monthly-tenure-chapter-check`, following the exact convention of `J39`–`J44` in `scheduled-jobs.ts` / `LOT-WIKI-v82.md`. Fires once per Usership operator at the `usershipSince` day-of-month rollover (not calendar month boundary — each operator's "month" starts the day they subscribed).
- **What it reads:** that calendar month's Log rows (journal `note` events, `emotional_checkin`, `self_care_complete`/`skip`, Memory answers, Planner activity) — the same eight context sources `buildPrompt()` already assembles, scoped to a 30-day window instead of "recent."
- **What it writes:** one paragraph (Together AI Llama 3.3 70B primary, same fallback chain as the Memory Engine, local poetic-composition fallback per existing doctrine — no new AI dependency introduced) stored as `user.metadata.monthlyChapters[N]`, immutable once written (a chapter, once closed, doesn't get rewritten by later behavior — this is what makes it feel like a real memory rather than a live-updating stat).
- **Where it surfaces:**
  1. Inline in `MonthlyPulseWidget` the first time the widget shows that month — replacing the static `MONTH_MESSAGES[N]` string with the real paragraph once Month ≥ 4 (Month 1–3 keep the existing generic lines; there isn't enough Log yet for an honest paragraph, and forcing one this early would read as generic AI filler dressed up as insight).
  2. A **"Memory"** row in `SystemProgressWidget` / a new `MemoryEngineStats.tsx` view: a scrollable list of closed chapters, oldest first — this becomes the operator's own private "Story so far" page, the seed of the Year One Story at Month 12.
- **Honesty rule (from §3):** if that month had fewer than ~8 qualifying Log entries, the chapter says so plainly rather than inventing texture. Confidence in the writing should visibly track density of the actual month — an operator should be able to tell, just from reading, which months they showed up for.

---

## 6. New Widget: "Months Unlocked: N/12"

A small, persistent, context-based readout — same register as `QuantumSignWidget` or `ContextualPromptsWidget`, *not* a celebratory toast like `MonthlyPulseWidget`. It is always present (for Usership operators only), quiet, and factual:

```
Months unlocked: 4/12
```

- Ticks up the moment `usershipSince` rolls a full calendar month — independent of whether the operator has dismissed that month's Pulse toast.
- At Month 11 it flips framing per §4 ("1 month to Year One") — the single deliberate break in an otherwise unchanging format, so the approach to Month 12 feels different from every month before it.
- At Month 12 it terminates as `12/12 · Year One` and stays pinned at that state (it does not reset or start counting a "Year Two" — see §8).
- Visually inherits whatever Tier/theme (`Water`/`Architecture`) the operator is already in via `evolution.ts`, so it never looks like a bolted-on progress bar — it should look native to the same interface family as `InterfaceEvolutionWidget`.
- Clicking it does not dismiss anything (unlike the Pulse widget) — it should feel like checking a gauge, not closing a card. Optional: click cycles to a compact list of which slots opened at which month (the right column of the table in §4), so a curious operator can see the whole ladder at once without it being advertised as a roadmap/upsell.

---

## 7. What "LOT® AI at Month 12" Actually Means

Per the product brief, "Usership" already *is* "Complete LOT® AI." What Month 12 changes is not access — Usership operators have full API/Story-Report access from Day 1 by contract — but **density**. The Month 12 state is:

1. All feature unlocks in `InterfaceEvolutionWidget`'s three categories (Widgets / Customization / Advanced) granted regardless of behavioral level — tenure alone has fully vested them.
2. Badge Tier 3 fully expressed — `≋` (Current) for Water-theme operators, `║·║` (Architecture) for structure-theme operators — the deepest visual register the interface currently defines, per `docs/technical/INTERFACE_EVOLUTION.md` §"Badge Theme Aesthetics."
3. Twelve closed Monthly Chapters compress into one **Year One Story** — a single long-form narrative, written the same way the existing local-fallback "poetic portrait" composer works, but spanning a year instead of 30 answers. This is the artifact a public profile like `/u/machiavelli` would plausibly be showcasing — badge progression plus a resolved, dated, personal story — rather than a raw stat block.
4. The `year_one` badge (MYTHIC tier, sitting beside the existing `perfect_month`) becomes visible on the public profile.
5. `MonthsUnlockedWidget` settles at its terminal `12/12` state rather than looping — Year One is meant to read as *completed*, not as a treadmill.

---

## 8. Implementation Map (for whoever picks this up next)

| Change | File(s) |
|---|---|
| Stamp `usershipSince` on tag grant | `src/server/models/user.ts`, tag-mutation path in `src/server/routes/admin-api.ts` |
| Recompute `monthNumber` from `usershipSince` | `src/client/components/MonthlyPulseWidget.tsx` (currently `dayjs(user.joinedAt).diff(now, 'month')`) |
| New scheduled job | `src/server/scheduled-jobs.ts` — add `J45 monthly-tenure-chapter-check`, follow `J39`–`J44` pattern |
| Monthly Chapter generation | Extend `src/server/utils/memory/` (reuse `buildPrompt`-style context assembly, 30-day scope) |
| New badges | `src/client/utils/badges.ts` — `active_user`, `monthly_chapter_unlocked`, `half_year`, `nine_month_habit`, `year_one` (MYTHIC) |
| Calendar floors on existing level-gated unlocks | `src/client/utils/interfaceEvolution.ts`, `src/client/stores/evolution.ts` — `Math.max(behaviorGate, tenureGate(monthNumber))` |
| New widget | `src/client/components/MonthsUnlockedWidget.tsx` (new file, modeled on `QuantumSignWidget.tsx`) |
| Chapter archive view | New `MemoryEngineStats.tsx` section or extend `SystemProgressWidget.tsx` |
| Public surfacing | `PublicProfile.tsx` — Year One Story + `year_one` badge display |

---

## 9. Open Questions for S-2

1. Should `usershipSince` reset if a subscription lapses and is later renewed, or does tenure persist (a returning Legacy/Usership operator keeps their month count)? The existing `six_month` *return* badge (`"Six months away. The system held your place."`) suggests LOT's existing doctrine already leans toward **continuity over reset** — worth confirming before J45 is built.
2. Does "Year Two" get its own arc, or does Month 12 become a steady-state (behavior-only, as it is today) once Year One closes? This document deliberately scopes to Year One only.
3. Confirm whether the Month 12 Year One Story should be exportable via the existing Story API (`LOT-AI-PRODUCT-BRIEF.md` mentions encrypted Story exports) as a literal deliverable an operator can keep.

---

*LOT® Founded 7 April 2016 · COSMO® Founded 1 July 2024*
*Made in the USA · brand.lot-systems.com*
