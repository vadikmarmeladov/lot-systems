<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Usership 12-Month Evolution — From Barebone Day 1 to LOT® AI

**Author:** Vadik Marmeladov, CEO & Founder, LOT Systems
**Session Class:** DESIGN / PRODUCT BRAINSTORM (no code shipped this session)
**Reference account:** [lot-systems.com/u/machiavelli](https://lot-systems.com/u/machiavelli) — demo profile, shown throughout as the "Month 12" end state
**Copyright:** © 2025-2026 LOT Systems. All rights reserved.

---

## 0. Purpose

Usership is the paid tier. A Usership subscriber's Day 1 UI and their Month 12 UI should not read like the same product wearing a different coat of paint — they should read like two different chapters of the same person's story, with the second one earned by the first eleven. This document maps that arc month by month, names the widgets and rituals that carry it, and inventories what already exists in this codebase versus what still needs to be built.

This is a **design and brainstorm document**, per the requesting framework. It does not implement code. It is meant to seed the next engineering benchmark session(s).

---

## 1. The Core Distinction: Tenure vs. Behavior

LOT already has a progression engine — `docs/technical/INTERFACE_EVOLUTION.md` — that evolves the interface across **7 behavioral dimensions** (Exploration, Consistency, Depth, Connection, Intimacy, Care, Courage), driven by what a user *does*. That system is correct and should not be duplicated.

What's missing is a second, simpler axis: **how long you've been a Usership member.** Tenure is not a proxy for effort — a user who journals daily for one month has done more *work* than a lapsed user who has been subscribed for six — but tenure is a proxy for something else the behavioral engine can't give you: **the felt sense of "this has been with me for a while."** A relationship, not just a metric.

The two axes should compose, not compete:

| Axis | Source | Governs | Existing system |
|---|---|---|---|
| **Behavioral maturity** | Logs, streaks, answers, achievements | Visual refinement, feature unlocks, badge density | Interface Evolution System (`interfaceEvolution.ts`, `evolution.ts`) |
| **Usership tenure** | `joinedAt` + calendar months elapsed | **Which chapters of the Memory Story exist**, monthly rituals, anniversary badges, the "Months unlocked" narrative | `MonthlyPulseWidget.tsx` (partial), `monthly-summary.ts` (backend, email-only) |

A user could theoretically be behaviorally "Integrated" (assembly phase, per `public-api.ts`) in month 2 through heavy daily use — the interface should look sophisticated for them already. But they should still only have **2 Memory Story chapters**, because a chapter needs a month of calendar time to compress into. Tenure gates the *story*; behavior gates the *interface density*. Together they make Month 12 feel earned on both fronts, which is exactly what `/u/machiavelli` currently demonstrates as a static preview (high badge density **and** a full Legacy-tier feature set, standing in for "lots of both axes maxed").

---

## 2. What Already Exists (audit)

Before proposing anything new, here is the actual inventory — because most of the raw material for this system is already built, just not assembled into a single evolving story:

| Piece | File | What it does today | Gap |
|---|---|---|---|
| **Monthly Pulse Widget** | `src/client/components/MonthlyPulseWidget.tsx` | Usership-only. Computes `monthNumber` from `joinedAt`, shows one hand-written message per month (1–12), a dismiss ritual with rotating phrases, and a literal `"N / 12 months"` counter. | This is already the seed of "Months unlocked: N/12." It fires once per calendar month and then disappears — there's no persistent trace of it afterward. |
| **Cosmic Update Widget** | `src/client/components/CosmicUpdateWidget.tsx` | Usership/R&D/Legacy-only. On-demand AI pixel-art "reflection" of the user, monochrome 64×64, regenerable. | Not tied to month number at all today — it's an evergreen reward widget, not a monthly ritual. Prime candidate to become the **visual face of each month's chapter**. |
| **Monthly Summary Generator** | `src/server/utils/monthly-summary.ts` | Full backend pipeline: presence/consistency, energy trajectory, dominant themes, emotional evolution, level/achievements gained, cohort evolution, **and a generated Memory Story** — all compressed into a narrative + HTML email, sent in the first 3 days of the new month. | **This is the compression engine the brief is asking for — and it currently only reaches the user by email.** There is no in-app surface for it. Once it's emailed, it's gone from the product experience. |
| **Memory Story generator** | `src/server/utils/memory.ts` (`generateMemoryStory`) | Synthesizes a narrative paragraph from the user's answered Memory questions. | Already used by `monthly-summary.ts` and shown on `PublicProfile.tsx` as a single *current* story — not as a dated, month-numbered archive. |
| **Badge system** | `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`, `badges.ts` | 800+ badges across many families (behavioral, calendar, mastery, secret-boss, word-turn). Dot-density visual language: a trait goes from `mindful` → `mindful ⋆·` → `mindful ⋆⋆⋆` as mastery deepens (`docs/badges/BADGE_PROGRESSION_PREVIEW.md`). | No badge family is scoped to **Usership anniversary** specifically. All existing badges are behavior/calendar-date/mastery triggered, not "you have been a paying member for N months" triggered. |
| **Interface Evolution System** | `docs/technical/INTERFACE_EVOLUTION.md`, `interfaceEvolution.ts`, `evolution.ts` | CSS-variable-driven visual refinement (opacity, letter-spacing, glow, grid density) keyed to 7 behavioral dimensions. | Correctly orthogonal to tenure (see §1) — should stay behavior-only, but needs a documented interaction rule with the new tenure axis (see §7). |
| **Public Profile "Legacy" preview** | `src/client/components/PublicProfile.tsx` | Demo accounts (`isDemo: true`, e.g. `/u/machiavelli`) show Legacy-tier features — Weather Station, Wallet, clearance level, self-awareness %, badge dot-density, Memory Story — as a static "what full evolution looks like" preview, with the line *"This is a demo account. Legacy level features shown as preview."* | This is functionally the Month 12 mood board already. It just isn't connected to an actual 12-month journey a subscriber lives through — it's a permanently-maxed showcase, not a destination you arrive at. |
| **Assembly Phase** | `src/server/routes/public-api.ts` | 5-stage behavioral phase: `dormant → awakening → forming → assembled → integrated`, driven by log diversity/volume/active days. | A third axis, purely behavioral (like Interface Evolution). Worth referencing in copy ("assembled" pairs well narratively with a mid-tenure month) but should not be conflated with tenure. |

**Conclusion of the audit:** the compression engine, the visual reward mechanism, the monthly cadence hook, and the "fully evolved" mood board all already exist as separate parts. Nothing currently threads them into one felt story across 12 months, and the richest artifact of all — the generated Memory Story chapter — never appears inside the product itself.

---

## 3. The Proposed System: **The Almanac**

Working name: **the Usership Almanac** (alt. considered: "The Codex Year," "12 Chapters," "The Ledger" — Almanac wins because it evokes a personal, dated record that accrues page by page, matches LOT's plain-text/terminal aesthetic, and doesn't collide with the existing "Codex" branding already used for the badge system).

The Almanac is not a new backend system. It's the **assembly layer** that gives the existing Memory Story + monthly-summary pipeline a permanent, in-app, chapter-by-chapter home — and gives the Usership tenure counter something to build toward besides a number.

### 3.1 Three new surfaces

**A. Months Unlocked widget** *(extends `MonthlyPulseWidget`)*
A persistent (not just once-per-month-then-gone) small widget, always present for Usership members, showing:
```
Months unlocked: 3 / 12
▪ ▪ ▪ · · · · · · · · ·
```
Each filled mark is a month lived, not a month paid — i.e. it only fills once that month's Memory Story chapter has actually been compressed (see 3.2), so a lapsed or brand-new billing cycle doesn't fill a mark it hasn't earned narratively. This reuses `monthNumber` logic already in `MonthlyPulseWidget.tsx`; it just needs to persist beyond the dismiss action instead of disappearing.

**B. The Story Vault / Memory Chapter card** *(new — surfaces `monthly-summary.ts` in-app)*
The single biggest gap. Once a month closes, its `MonthlySummary.memoryStory` (already generated server-side, currently email-only) becomes a dated card the user can open inside the System tab:
```
Chapter III — October
"You kept circling back to the mornings. Tea, quiet,
the version of you that shows up before anyone
needs anything from you..."
                                        [Read Month III]
```
By Month 12 this becomes a **scrollable vault of 12 chapters** — the tangible artifact the brief asks for. This is where "the amount of journal entries and thoughts put into Log" becomes visible as *compressed prose*, not a raw count.

**C. New Month threshold moment** *(extends `MonthlyPulseWidget`'s dismiss ritual)*
Right now `MonthlyPulseWidget` shows a static message per month number and a random dismiss phrase. Recommend splitting this into two beats:
1. **Arrival** — the existing message (`"Three months. You have reached Active User status."`)
2. **Affirmation** — one sentence pulled from *that month's own data* via `monthly-summary.ts` (`notableProgress`, `cohortEvolution`, `forwardLook`) rather than a hand-authored generic line. This is what makes each month's celebration feel earned instead of scripted — the copy for Month 7 should be able to say something only true of *this* user's Month 7.

### 3.2 The chapter-close event

Today, `shouldShowMonthlySummary()` fires an email in the first 3 days of the new month. Recommend that same trigger also:
1. Writes the `MonthlySummary` (already fully computed) to a durable per-user, per-month record — this is the missing persistence layer; everything else in `monthly-summary.ts` already exists, it just isn't saved anywhere, only emailed and discarded.
2. Marks that month's slot filled in the Almanac (§3.1a).
3. Fires the New Month threshold moment (§3.1c) the next time the user opens the app.
4. Unlocks that month's Usership Anniversary Badge (§4).

No new analysis logic is needed — only a small persistence table and a UI surface for something the backend already computes and currently throws away after sending an email.

---

## 4. Usership Anniversary Badges — a new, small badge family

Distinct from the 800+ behavioral badges. Twelve badges, one per month of continuous Usership, unlocked purely by tenure + a completed chapter (not by activity volume — a quiet month still earns its badge, because showing up as a *subscriber* for a year is itself the achievement being honored, independent of how loud that year was).

Suggested visual language, consistent with the existing dot-density system (`BADGE_PROGRESSION_PREVIEW.md`) but using a distinct glyph family so it reads as its own lineage rather than competing with behavioral badges:

| Month | Badge glyph | Name | Trigger |
|---|---|---|---|
| 1 | `○` | First Light | Chapter I closes |
| 2 | `○○` | Return | Chapter II closes |
| 3 | `○○○` | Active User (existing status line) | Chapter III closes |
| 4 | `◐` | Half-turn | Chapter IV closes |
| 5 | `◐○` | Held | Chapter V closes |
| 6 | `◑◑` | Halfway Declared | Chapter VI closes — **mid-year threshold, treat as a minor milestone tier like Month 3 and Month 12** |
| 7 | `◒` | Rare Air (existing message) | Chapter VII closes |
| 8 | `◒◒` | Practiced | Chapter VIII closes |
| 9 | `◓◓◓` | Habitual | Chapter IX closes |
| 10 | `◔◔◔◔` | Almost | Chapter X closes |
| 11 | `◕◕◕◕` | One More | Chapter XI closes |
| 12 | `●●●●●●●●●●●●` (full ring, 12 marks) | **The Portrait Complete** | Chapter XII closes — full Almanac, all 12 chapters present |

At Month 12 the twelve individual marks resolve into a single closed ring — the visual payoff for the whole year, echoing `MonthlyPulseWidget`'s own existing Month 12 copy: *"One year with LOT. The portrait is complete — and still evolving."* This line already exists in the code and is the correct emotional target for this entire system; the Almanac is the mechanism that makes it true rather than just declared.

---

## 5. Month-by-Month UI Arc

This table is the spine of the brief: "outline and brainstorm month-to-month evolution of the UI." Each row assumes a Usership member using the product at an ordinary, moderate pace — not a power user, not a lapsed one. "Machiavelli reference" points to the specific field on the demo profile that this month's state is building toward.

| Month | UI state | What newly appears | Almanac / badge | Memory Story chapter tone | Machiavelli (Month 12) reference point |
|---|---|---|---|---|---|
| **1** | Barebone. Time widget, Memory Widget (questions), Log, Planner. No badges yet, no dot-density on traits. `MonthlyPulseWidget`: *"The first month. The system is beginning to know you."* | Months Unlocked: `▪·············· 1/12` appears for the first time — deliberately sparse, almost embarrassing in its emptiness. This is intentional: Month 1 should look thin. | First Light `○` | Sparse, tentative — the story generator has few answers to draw from; chapter reads as an outline, not prose ("Early signals only.") | Clearance level 1 equivalent; no Weather Station, no Wallet |
| **2** | First behavioral badge dots may appear (`mindful ⋆·`) if the user has been active — independent axis. Almanac fills a second mark. | Cosmic Update Widget becomes usable for the first time this month if not already discovered. | Return `○○` | First real thread starts to show — one theme repeats. | — |
| **3** | `MonthlyPulseWidget`: *"Active User status"* — this existing status line should now visibly promote the user in the UI, not just say it (e.g. profile clearance label updates). | Story Vault has 3 chapters — first time it's worth opening as a "vault" rather than a single card. | Active User `○○○` | Patterns named explicitly for the first time (`dominantThemes` in `monthly-summary.ts` starts being reliable at this volume). | Clearance level begins stepping up |
| **4** | Interface Evolution's behavioral dimensions (independent of tenure) likely crossing first thresholds for a moderate user — subtle opacity/glow increases. | Almanac: `◐···` | Half-turn `◐` | Story references a *change* from month 3 — first month the narrative can say "unlike last month..." | — |
| **5** | — | — | Held `◐○` | Seasonal/consistency language enters (`monthly-summary.ts` already tracks trajectory + consistency ratio). | — |
| **6** | **Mid-year threshold** — treat visually like a minor version bump, similar weight to Month 3. `MonthlyPulseWidget`: *"The journey is half-declared."* Recommend the Almanac widget itself gets a one-time richer render this month (e.g. the row of marks briefly shows a horizontal midline). | Weather Station-class features (Legacy preview on machiavelli) become plausible to unlock here for consistently active users — first "physical world" surface beyond the self-care loop. | Halfway Declared `◑◑` | Longest chapter yet — six months is enough data for `emotionalEvolution` (early→mid→late thirds) to say something with real shape. | Weather Station begins appearing |
| **7** | `MonthlyPulseWidget`: *"Rare air."* | — | Rare Air `◒` | Story can start referencing earlier chapters by name ("Chapter III mentioned tea; this one is quieter"). | — |
| **8** | — | — | Practiced `◒◒` | — | — |
| **9** | `MonthlyPulseWidget`: *"a habit now."* Self-Care button click-through rate and morning check-in consistency should now visibly shape the Interface Evolution glow/opacity — the interface should look tangibly calmer/denser for a consistent user by this point. | Wallet-class feature (Legacy preview) becomes plausible — signals the product trusts this user with more. | Habitual `◓◓◓` | — | Wallet begins appearing |
| **10** | — | — | Almost `◔◔◔◔` | — | — |
| **11** | `MonthlyPulseWidget`: *"One more."* Anticipation framing — UI can start hinting at what completes at 12 (e.g. Almanac shows `···●` ghosted-in for the final slot). | — | One More `◕◕◕◕` | Retrospective tone begins — story starts summarizing the arc, not just the month. | — |
| **12** | **Full Legacy-tier state — this is `/u/machiavelli`.** Clearance level maxed, Weather Station + Wallet fully live, badge dot-density at its densest tier (`✦✧✦` per `BADGE_PROGRESSION_PREVIEW.md`), self-awareness % high, Memory Story rich and cross-referential, Almanac ring closed. | **LOT® AI** framing arrives here: the product stops presenting as "a self-care app with an AI feature" and starts presenting as an AI that has spent a year with this specific person. Copy shifts from generic ("the system") to possessive/personal register throughout. | The Portrait Complete `●●●●●●●●●●●●` | A true year-in-review — synthesizes all 12 chapters, the closest thing the product has to a birthday letter. | This *is* the reference profile |

---

## 6. What "LOT® AI" Means at Month 12 (vs. Day 1)

The brief asks the UI to evolve "to LOT® AI" by month 12. Concretely, this should not be a rebrand or a new feature — it should be the same product, but the *register* of the language and the *density* of what's visible both shift:

- **Day 1:** the product speaks in second person, generic, exploratory — *"What is your morning beverage preference?"*
- **Month 12:** the product speaks with specific memory — *"Now that it's colder, you mentioned loving your morning tea ritual with reading. Has your tea preference changed with the season?"* (this exact example already exists in `README.md`'s Memory Engine walkthrough — it is the correct target voice, it just needs to be visibly, structurally tied to month-12 UI state rather than floating as an abstract example).
- **Day 1 UI:** sparse widget stack, `0/12` almanac, no badges, no Wallet/Weather Station.
- **Month 12 UI:** everything `/u/machiavelli` already shows as a "preview" — except it's no longer a preview, it's an arrival.

The through-line: **Day 1 LOT talks like a stranger asking good questions. Month 12 LOT talks like it was there.** Every UI decision in §5 should be graded against whether it makes that difference *visible*, not just true in the copy.

---

## 7. Interaction Rule: Tenure × Behavior

To avoid the two axes fighting each other in the UI:

- **Tenure (Almanac) gates narrative depth and anniversary badges.** It cannot be rushed by activity — a chapter needs a real month to compress.
- **Behavior (Interface Evolution + assembly phase) gates visual refinement and feature richness within whatever tenure allows.** A highly active Month 2 user should already look more "awake" than a dormant Month 2 user — but neither should have Month 6+ features like the Weather Station, because those are tenure-gated regardless of activity.
- Recommended rule of thumb for any future feature unlock: **ask which axis it actually depends on.** "Does this need calendar time to mean anything (a story, an anniversary, a sense of history), or does it just need proof of engagement (a badge, a glow, a density bump)?" File it on the correct axis; don't let one masquerade as the other.

---

## 8. Data/Engineering Notes for the Next Benchmark Session

Kept intentionally light — this document is the design brief, not the implementation plan — but flagging the shape of the work so it's not re-discovered from scratch:

1. **Persistence gap:** `generateMonthlySummary()` in `monthly-summary.ts` computes everything the Almanac needs but only ever gets piped into an email (`generateMonthlyEmailBody` / `generateMonthlyEmailHtml`). The single highest-leverage change is adding a small table (or reusing the existing `Log`/event system with a dedicated `monthly_chapter_closed` event carrying the serialized summary in `metadata`) so this data survives past the email send.
2. **`MonthlyPulseWidget` → Months Unlocked:** mostly a persistence + placement change, not new logic. `monthNumber` and the message table already exist.
3. **`CosmicUpdateWidget` → chapter portrait:** consider pinning one generated image per closed chapter (rather than always-regenerable) so the Story Vault has a consistent visual per month, alongside the prose.
4. **Anniversary badges:** new `BadgeType` union entries (§4), award logic keyed to `monthNumber` + chapter-closed event, following the existing pattern in `badges.ts`.
5. **`WIDGETS.md`** should get new entries for Months Unlocked and the Story Vault once built, under "Conditional & Subscriber Widgets" alongside the existing Cosmic Update / Subscribe Widget entries.

---

## 9. Open Questions

- Should a lapsed/paused Usership month leave a *visible gap* in the Almanac ring, or should the ring only count consecutive completed chapters? (Recommend: visible gap — "◇" for a skipped month — since honesty about the real shape of a year is more in keeping with LOT's plain-text, non-manipulative tone than silently renumbering.)
- Should Month 6 and Month 12 badges be retroactively re-skinned if a user upgrades from a lower tier mid-year, or does the Almanac only start counting from the Usership `joinedAt` date specifically (recommended, for consistency with `MonthlyPulseWidget`'s existing logic)?
- Does the Story Vault need an export/PDF option at Month 12, mirroring the existing badge Codex PDF generation pattern in `docs/badges/`? (Natural fit given the "invaluable vault" language already in `README.md`.)

---

*The interface evolves with you, honoring your journey from first breath to mastery — and now, chapter by chapter, from Day 1 to the year that made you a portrait instead of a sketch.*
