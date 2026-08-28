<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering Diagnostic — 2026-08-28 Sweep

## Summary

A recurring "button lag" / rendering-stall issue was previously diagnosed and
fixed across four commits merged into `master` between 2026-07-19 and
2026-07-28 (PR #94, PR #95). This document is a **follow-up audit**: no new
user report, issue, or PR about button lag exists since that fix landed, and
the repository has had no commits at all since 2026-08-05 (23 days as of this
sweep). This sweep exists to confirm the fix held and to check whether the
151-pattern QIE growth since (P143→P151, Arch48→Arch51, J45→J48) reintroduced
the same class of bug. It finds the original fix intact, with one live,
narrower instance of the same root cause that predates the fix and was missed
by it.

## Prior fix history (for reference)

Four commits, all `Co-Authored-By: Claude`, merged via PR #94/#95:

| Commit | Date | Fix |
|---|---|---|
| [`6e5007a`](../../commit/6e5007a) | 2026-07-19 | Root cause of progressive tab-switch stall: `PatternRecognitionWidget` called a store-writing function (`analyzeIntentions` via `getOptimalWidget()`) **during render**, cascading re-renders across every `intentionEngine` subscriber. Also gated three ungated System-only intervals on `isRouteActive('system')`. |
| [`b46f1ac`](../../commit/b46f1ac) | 2026-07-25 | Definitive fix for the tab-switch freeze: System's ~7 subscriber widgets stayed mounted (`display:none`) after first visit, so any signal from *any* tab re-rendered them in the background. System now fully unmounts when inactive (`unmountWhenInactive` on `TabPanel`). |
| [`9364aba`](../../commit/9364aba) | 2026-07-28 | `SignalStreamWidget` (sorted up to 1000 signals) and `UserMetricsWidget` (`getUserIndex()` + `classifyPhysiologicalCohort()`) ran unmemoized on every render. Memoized both on stable sub-fields (`engine.signals`) instead of the whole store object. |
| [`be3e8fa`](../../commit/be3e8fa) | 2026-07-28 | `MemoryWidget`: `analyzeIntentions()` ran inside a `useMemo` (render phase) — moved to `useEffect` with a `useState` seed. `SystemProgressWidget.handleGenerateReport`: `analyzeIntentions()` (full ~139-pattern scan on cooldown miss) ran synchronously inside the click handler, blocking the button's visual response — deferred one macrotask via `setTimeout(build, 0)`. |

These fixes were codified as doctrine in `docs/benchmark/LOT-DOCTRINE.md` under
**Render Isolation** ("work that WRITES to a store must not run inside
useMemo — the writes schedule subscriber re-renders before the browser can
paint"), **Subscription Minimization**, and **Async Signal Recording**. The
standalone diagnostic doc referenced in `be3e8fa`'s commit message
(`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md`, agent-authored) is no
longer present in the tree — this document recreates that filename for the
follow-up sweep.

## Methodology

1. Reviewed `git log` since `be3e8fa` for any new/reintroduced render-phase
   store writes, unmemoized heavy per-render work, undeferred heavy work in
   click handlers, or ungated intervals in code touching
   `src/client/components/`.
2. Confirmed no GitHub issues or PRs about button lag exist beyond the
   already-merged PR #94 (`search_issues`/`search_pull_requests` for
   "button lag rendering slow"/"stall": 0 open matches).
3. Re-read `intentionEngine.ts`'s `recordSignal`/`analyzeIntentions` path
   directly: the 5-minute `ANALYSIS_COOLDOWN`, the `deferHeavy()` helper
   (`requestIdleCallback` with a 2s timeout, falling back to `setTimeout(fn,
   0)`), and the coalesced `schedulePersist()` localStorage write are all
   intact and unchanged since the fix.
4. Verified `src/client/components/ui/Button.tsx` directly: subscriptions
   remain narrowly split per variant (`PrimaryBtn` → `theme` only,
   `SecondaryRoundedBtn` → `isMirrorOn` only, `secondary` → no store), no new
   heavy inline work, Tailwind-default transition durations only.
5. Diffed `git diff be3e8fa..HEAD -- src/client/components/` file-by-file and
   grepped for `analyzeIntentions(`, `useMemo`, `setInterval`, `onClick` across
   the widgets touched by the four fix commits, to confirm none regressed.

## Findings

**No reintroduction of the fixed bug class in code added after `be3e8fa`.**
All five originally-fixed files remain fixed. The 12 pattern/archetype/job
additions since (`d7f076e`, `457f0be`, `bc4ef7b`, etc.) only touch static
display-name maps, changelog text (`SESSION_REPORTS` in
`SystemProgressWidget.tsx`, `About.tsx`), and `intentionEngine.ts`'s pattern
detection blocks themselves — none of which run in a render path.

### 1. Live instance of the fixed bug class, missed by the original sweep — `Logs.tsx:3974-3975`

```tsx
} else if (trigger === 'qos-report') {
  try { analyzeIntentions() } catch {}
```

This runs inside a `useEffect` (`Logs.tsx:3935`) that fires on every keystroke
in the log editor, scanning the text for inline triggers (`/qos`, `/prayer`,
etc.) since the last scan. When the `/qos` trigger is newly detected, it calls
`analyzeIntentions()` **synchronously and undeferred** — the same "~151-pattern
scan on a cooldown miss" function whose synchronous, undeferred call in
`SystemProgressWidget.handleGenerateReport` was exactly what `be3e8fa` fixed.
Unlike the sibling `assembly-check`/`ai-scan`/`prayer-mode` branches in the
same `for` loop, this one has no loading-state guard or macrotask deferral.
Because it's in a `useEffect` rather than the render body, it does not violate
Render Isolation (no store write during render), but on a cooldown miss it
still blocks the main thread synchronously right after the keystroke that
completes `/qos` — the same "type, then a beat, then it catches up" stall
described in the original diagnostic, just triggered by typing rather than a
button click. Introduced 2026-06-30 (`e9eee35`), predates the fix window, and
was not covered by the `be3e8fa` sweep because that sweep was scoped to
button click handlers.

**Suggested fix** (not applied — this task is investigation-only): defer with
the same `setTimeout(() => { try { analyzeIntentions() } catch {} }, 0)`
pattern used in `SystemProgressWidget.handleGenerateReport`.

### 2. Minor / suspicious — `QuantumEngineWidgets.tsx:568-613` (`qos-field` view)

`getQuantumOS()` runs unmemoized directly in a render-body IIFE every time
this view is active, filtering up to 1000 signals across 10 sources per
render. The sibling `qosModeData` a few lines above (`:290-293`) already
memoizes equivalent work on `engineState.signals`/`view`; this block doesn't.
`getQuantumOS()`'s own doc comment claims "no heavy computation," so actual
impact looks low, but it's the same unmemoized-render-body-work pattern
`9364aba` targeted. Worth memoizing to match its sibling, not urgent.

### 3. Minor / suspicious — `QuantumEngineWidgets.tsx:375` vs `:201-205`

`classifyPhysiologicalCohort(...)` runs twice per render when
`view === 'cohort'`: once memoized (`cohortDirective`, line 201) and once
unmemoized inline for `live` (line 375). The function itself is cheap
(fixed-size archetype list, `O(recentSignals)` filter), so this is redundant
work rather than a perceptible-lag bug, but matches the same class.

## Root cause classification (for anything found)

All three findings — the original four and the two new minor ones — share one
root cause: **a store-writing or store-scanning function called somewhere
other than a deferred, gated, or memoized path** (render body, `useMemo`,
synchronous click/keystroke handler, or ungated interval), against a shared
`intentionEngine` atom whose subscriber count has grown alongside the
pattern/archetype count (139 patterns in July → 151 now). CSS transitions and
DOM update volume were investigated and ruled out in the original diagnostic
(the `grid-fill-hover` hover effect is a pure `opacity` transition with
`will-change`, not implicated) and remain ruled out here — no new CSS
animation code was added to button paths since.

## Next steps

1. Apply the one-line `setTimeout` deferral to `Logs.tsx:3975` (item 1) —
   same fix shape as `be3e8fa`, low risk, closes the last known live instance.
2. Memoize `QuantumEngineWidgets.tsx:568-613`'s `getQuantumOS()` call and
   dedupe the double `classifyPhysiologicalCohort()` call at `:375` next time
   that file is touched — low priority, no evidence of user-visible impact.
3. No further investigation needed on the button-click path itself: `Button.tsx`
   and all four previously-fixed widgets are confirmed unchanged and correct.
4. Since there have been no commits to this repo in 23 days and no new issue
   reports, there is currently no live signal of a *new* button-lag complaint
   — this sweep was a preventive audit, not a response to a reproduced bug.
