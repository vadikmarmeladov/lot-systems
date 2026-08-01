<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Arcade — Gamified Evolution Layer

**Status: PROVISIONAL / SCAFFOLD** — a design note and a non-wired component,
not a shipped feature. This document exists so the next session (human or
Claude) can pick this up without re-deriving the reasoning.

---

## Why "Arcade" in a self-care company

LOT's stated philosophy is *"from metrics to meaning"* — the product is not
supposed to feel like a leaderboard. But the codebase already tracks real
progression (CQGS's seven evolution dimensions, badge tiers, streak levels,
the RPG-style Narrative Widget) and currently surfaces it in several
different, disconnected widgets (`EvolutionWidget`, `InterfaceEvolutionWidget`,
`NarrativeWidget`, `BadgeUnlockFeed`, `GrowthMilestones`). "Arcade" is not a
new scoring system — it is a proposed *single, legible, game-cabinet-styled
window* onto data that already exists, for users who respond well to that
framing. It should never be the only way to see this data (some users find
gamification alienating in a wellness context), and it must never introduce
a new incentive that rewards volume over honesty (e.g. no leaderboard against
other users, no penalty for a broken streak beyond what `badges.ts` already
does).

## What already exists (reused, not duplicated)

- `src/client/stores/evolution.ts` — `$evolutionState` (7 CQGS dimensions,
  `level`, `chapter`, `badgeTier`) is the actual state; `$featureUnlocks` and
  `$visualEffects` are its derived side effects.
- `src/client/utils/badges.ts` — `BADGES` registry, `getEarnedBadges()`,
  `getLevelSymbol()/getLevelName()` (streak → level name/symbol), `awardBadge()`.
- `src/server/utils/rpg-narrative.ts` + `NarrativeWidget.tsx` — the existing
  "Story/Achievements/Quests/Context" RPG framing, which already covers a
  large part of what an "Arcade" surface would want to show.
- `src/client/components/stats/BadgeUnlockFeed.tsx`,
  `GrowthMilestones.tsx` — existing community/personal badge displays.

## What this session added

`src/client/components/ArcadeWidget.tsx` — a scaffold component. It:

- Reads `$evolutionState` and `badges.ts` directly — **zero new scoring
  logic, zero new server routes.**
- Renders two views: `cabinet` (level/symbol/name + the 6 CQGS dimensions
  as a compact score line) and `highscores` (earned badges, arcade-style).
- Is **not** imported or rendered anywhere yet — deliberately, since adding
  a new widget to the live `System.tsx` stack is a design decision (where
  does it sit, does it replace or sit alongside `EvolutionWidget`, does the
  "Arcade" framing test well with real users) that shouldn't be made
  unilaterally inside an unattended benchmark run.

## Wiring it in (next step, needs design sign-off)

1. Decide placement: candidate is directly below `InterfaceEvolutionWidget`
   in `System.tsx`, or as a new `astrologyView` cycle state (`'arcade'`)
   alongside the existing `astrology / psychology / journey / quantum` cycle
   — the astrology block already cycles through 4 views with the same click
   pattern this widget would need.
2. Import and render `<ArcadeWidget />` from `System.tsx` (or wherever
   placement is decided) — the component takes no props today.
3. Consider whether `getLevelSymbol(streak)` should read a *real* streak
   value (currently the scaffold approximates streak from
   `evolution.consistency * 100`, which is a proxy, not the actual
   day-streak counter used elsewhere — check `src/client/utils/logs.ts` or
   wherever the canonical streak count lives before shipping this for real).
4. User-test the framing before wide rollout — "gamified" self-care can
   land as either delightful or tone-deaf depending entirely on execution;
   this doc does not resolve that, a real user does.

## Honest boundary

This is presentation, not a new subsystem. It compresses existing badge and
evolution data into an arcade-cabinet visual metaphor. It is marked
PROVISIONAL per the LOT self-assembly doctrine's honesty rule: this is a
scaffold with a clear seam to real wiring, not a finished feature, and it
should not be described to users or investors as more than that until it is
actually placed in the app and validated.
