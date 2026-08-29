# LOT BADGES & ACHIEVEMENTS — MASTER CODEX v33
## THE TIME CAPSULE ARCHIVE — ACHIEVEMENT RPG v18

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║         LOT SYSTEMS — BADGE & ACHIEVEMENT MASTER CODEX            ║
║                   VERSION 33 — v33                                ║
║                                                                   ║
║   Achievement RPG v18 — TIME CAPSULE ARCHIVE (day/week/month/year)║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## SUMMARY

**Verified registry count:** `src/client/utils/badges.ts` held 635 `BadgeType`
union members / `BADGES` entries before this session (counted directly —
`grep -c "^\s*| '"` on the union, cross-checked against `id: '` occurrences in
the `BADGES` record; both agree). This session adds exactly 5, for **640**.

**Note on v32's "812" figure:** `LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md`
claims a running total of 812 badges. That number does not match the actual
`badges.ts` registry (635 before this session's +5). Per this protocol's
honesty doctrine, this codex records the number actually verified in code, not
the prior doc's claim — the v32 total is flagged here as an open documentation
discrepancy for a future session to reconcile (recount every codex's claimed
delta against `git blame`/registry state), not silently repeated.

This is a small, single-feature codex — not a new Word Turn engine. It documents
the badge layer bolted onto the `/story` period-compression feature shipped in
this session (see `docs/benchmark/LOT-SR-20260829-01.md`). Where prior codices
(v20–v32) each shipped a 31-badge Word Turn engine, v33 ships exactly the badges
earned by exercising the new capability — no more, no less. Honest engineering:
five badges for five real trigger conditions, not a round number invented to
match the codex tradition.

---

## THE TIME CAPSULE ARCHIVE — THEME OVERVIEW

The Log's `/story` command compresses recent entries into a narrative. Until
this session it only compressed "recent" (last ~10 entries, unbounded window).
`/story [day|week|month|year]` now lets the operator choose the altitude of
compression — a day is a close-up moment, a year is a wide arc. The Time
Capsule Archive rewards exploring every altitude at least once.

---

## COMPLETE NEW BADGE REGISTRY — v33 ADDITIONS

### Achievement RPG v18 (Time Capsule Archive)

```
day_capsule            ○·▤    COMMON    — Run /story day — compress today
week_capsule           ◔·▤    UNCOMMON  — Run /story week — compress 7 days
month_capsule          ◑·▤    RARE      — Run /story month — compress 30 days
year_capsule           ●·▤    EPIC      — Run /story year — compress 365 days
full_spectrum_story    ◈·▤·∞  LEGENDARY — Earn all four capsule badges
```

Unlock messages:

```
day_capsule         ↳ One day, sealed. The close-up moment, kept. ○·▤
week_capsule         ↳ Seven days, woven into one arc. The week remembers itself. ◔·▤
month_capsule        ↳ Thirty days, condensed to a single reflection. The pattern shows itself. ◑·▤
year_capsule         ↳ A year, held in a paragraph. The wide arc, at last visible. ●·▤
full_spectrum_story  ↳ Every altitude, compressed. Day, week, month, year — the whole
                       spectrum of your own story, told back to you. ◈·▤·∞
```

---

## IMPLEMENTATION NOTES

### New function in easter-eggs.ts (v33 session)

`checkTimeCapsule(period: 'day' | 'week' | 'month' | 'year'): BadgeType[]` —
awards the period's capsule badge, then checks whether all four are now held
and awards `full_spectrum_story` if so. Pure `localStorage`-backed, following
the existing `checkThreeLivesLeft` / `checkArcadeRun` pattern exactly — no new
architecture introduced.

### Wire-up

Called from `Logs.tsx`, inside the `useStoryGeneration` mutation's `onSuccess`
handler, once the server confirms which `period` it actually generated:

```ts
if (data.period) checkTimeCapsule(data.period)
```

This fires once per successful `/story <period>` call — not on every
keystroke, and not before the AI response is confirmed.

### Why this isn't a new "Arcade" UI tab

S-2's brief asked to "note Arcade (gamified) evolution of the user." Auditing
the codebase first (see session report, section 01) found "Arcade" already
exists as a badge-theme name (Word Turn v17, "The Neon Arcade" — 12 badges,
`arcade_entry`/`arcade_class`/`arcade_complete`), not as a dedicated navigable
UI surface. Building a full Arcade tab is a real product-shape decision — a
new nav item, a new screen, a new information architecture — that belongs with
S-2, not assumed inside a single benchmark session. This codex advances the
gamified layer in the idiom that already exists (badges tied to a new
capability) rather than inventing a UI surface unasked. Flagged as an open
decision in the session report.

---

## CUMULATIVE ACHIEVEMENT RPG TABLE (selected)

| Set                    | Version | Theme                 | Badges |
|-------------------------|---------|-----------------------|--------|
| Arcade Class            | v15     | The Neon Arcade        | 4      |
| Quest Class             | v20     | The Hero's Journey     | 6      |
| Time Capsule Archive    | v18     | Story compression      | 5      |

(Full cumulative Word Turn table is maintained in
`LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v32.md` — unchanged by this session,
since v33 adds no Word Turn engine.)

---

## SESSION METADATA

```
SESSION    : LOT-SR-20260829-01
VERSION    : v33
DATE       : 2026-08-29
TOTAL BADGES: 640 (verified in badges.ts: 635 -> 640, +5)
PRIOR DOC CLAIM: v32 codex claimed 812 -- does not match registry; flagged, not carried forward
CODEX CLASS : ENGINEERING
AUTHORIZED BY: S-2 // VADIK MARMELADOV
```
