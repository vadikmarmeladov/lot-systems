<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering Diagnostic — 2026-08-10

**Scope**: Scheduled investigation into button lag and rendering problems.
**Trigger**: Automated routine, not a live user-reported incident.
**Verdict**: No new open issue or user report exists. The prior four-PR fix arc
(#85, #88, #94, #95, all merged by 2026-07-28) is holding. However, this audit
found **two widgets added since that arc that reintroduce the exact same
root-cause anti-pattern** the arc fixed elsewhere. They have not yet caused a
reported incident but are latent regressions of a known bug class.

---

## 1. History reviewed

Button lag / tab-switch freeze has been a recurring, actively-tracked issue in
this repo, fixed across four merged PRs, all authored by an agent session and
all citing the same root cause family — the `intentionEngine` nanostore
(`src/client/stores/intentionEngine.ts`) is subscribed to by ~9 permanently
mounted System widgets, so any store write from any one of them re-renders
all the others:

| PR | Date | Root cause fixed |
|----|------|-------------------|
| [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85) | 2026-07-19 | `System` background work (60s/10s intervals, signal persistence, `analyzeIntentions`) kept running on inactive tabs because guards checked only `document.hidden`, which stays `false` on in-app tab switches. |
| [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) | 2026-07-19 | `PatternRecognitionWidget` called `getOptimalWidget()` (which triggers `analyzeIntentions` → `intentionEngine.set`) **in the render body**, a render-phase store write that cascades re-renders. Three more System-only intervals were ungated. |
| [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94) | 2026-07-28 | `MemoryWidget` ran `analyzeIntentions()` (a store write) inside a `useMemo` — still render-phase. `SystemProgressWidget.handleGenerateReport` ran a ~139-pattern scan **synchronously inside the click handler**, blocking the button until it finished. |
| [#95](https://github.com/LOT-Systems/LOT-Computer/pull/95) | 2026-07-28 | `SignalStreamWidget` and `UserMetricsWidget` re-did expensive sort/classify work on every render instead of memoizing on `engine.signals`. |

The doctrine that came out of this arc (see comments in `System.tsx` and
`intentionEngine.ts`):
1. Never write to `intentionEngine` during render — only in `useEffect`,
   event handlers, or deferred via `requestIdleCallback`/macrotask.
2. Memoize expensive per-render work on a stable dependency
   (`engine.signals`), not the whole `engine` object.
3. Never run `analyzeIntentions()` (a 139+-pattern scan) synchronously inside
   a click handler — defer it a macrotask so the click responds instantly.
4. Gate background intervals on `isRouteActive('system')`, not
   `document.hidden`.

No GitHub issue or PR has been opened about button lag since PR #95
(2026-07-28 → today, 2026-08-10). `git log` shows 32 commits in that window,
none tagged perf/lag/freeze — all badge/wiki/QIE content work.

## 2. Scale growth since the last fix

`analyzeIntentions()`'s scan cost is a function of the intention-pattern
library size. Since the 2026-07-28 baseline (~139 patterns / 47 archetypes /
44 jobs / 178 dependency nodes), the engine has grown to:

- **151 patterns** (P1–P151)
- **51 archetypes** (Arch51, plus 9 physiological cohort archetypes tracked
  separately)
- **48 jobs** (J48)
- **190+ dependency nodes** in `WIDGET_DEPENDENCY_MAP`

That's roughly a 9% increase in scan cost per `analyzeIntentions()` call
since the last perf pass — worth keeping an eye on, though not itself a bug.

## 3. New findings: the render-phase-write bug has recurred

Two widgets added after the fix arc closed reintroduce the same class of bug
fixed in PR #88 (render-phase `intentionEngine` write), just via a different
entry point (`recordSignal()` instead of `getOptimalWidget()`/
`analyzeIntentions()`):

### `GoalJourneyWidget.tsx:46-53` — confirmed

```tsx
// Record goal signal once per mount
if (!hasRecordedRef.current) {
  const activeGoals = goals?.filter(...) || []
  recordSignal('intentions', 'goals_viewed', { ... })
  hasRecordedRef.current = true
}
```

This runs directly in the component body, guarded only by a ref (not
`useEffect`). `recordSignal()` (`intentionEngine.ts:199-253`) calls
`intentionEngine.set(...)` **synchronously on line 226** — only the
persistence (`schedulePersist()`) and `analyzeIntentions()` re-scan are
deferred. Because `System` fully unmounts/remounts on every tab switch
(`unmountWhenInactive` in `app.tsx`), this write fires on *every* visit to
the System tab while goal data is loaded, cascading a re-render across every
other `intentionEngine` subscriber mid-render — the same failure mode PR #88
fixed for `PatternRecognitionWidget`.

### `CohortConnectWidget.tsx:44-53` — confirmed, same pattern

```tsx
if (!hasRecordedRef.current && cohortData?.matches?.length) {
  recordSignal('mood', 'cohort_widget_viewed', { ... })
  hasRecordedRef.current = true
}
```

Same shape: `recordSignal()` called in the render body behind a ref guard,
not in `useEffect`. This one predates the newest feature batch (added
2026-06-29) and was apparently missed by all four passes of the fix arc,
since it isn't in the intention-engine subscriber list any of those PRs
audited.

**Suspected impact**: Both fire once per widget mount, not per render, so
they're less severe than the original `PatternRecognitionWidget` bug (which
fired every signal). But since `System` remounts on every tab switch and both
widgets are commonly populated (most users have goal/cohort data), this is a
plausible contributor to an occasional single extra render-cascade hitch on
first System-tab paint — consistent with "lag" reports being intermittent
and hard to pin down.

### Minor / theoretical — not urgent

- `QuantumEngineWidgets.tsx:373-379, 568-570` — `classifyPhysiologicalCohort()`,
  `getCircadianPhase()`, `getQuantumOS()`, and an `Object.entries(...).filter().sort()`
  run unmemoized inside JSX IIFEs for the `cohort`/`qos-field` sub-views,
  duplicating work already available from a memoized `cohortDirective`
  nearby. No store writes; cheap relative to a full pattern scan. Cleanup
  candidate, not a lag source.
- `System.tsx:198-203` — the `astrologyTick` interval gates on
  `document.hidden` only, inconsistent with sibling widgets that gate on
  `isRouteActive('system')`. Not an active bug (the parent unmounts on tab
  switch, so the interval's cleanup still fires), but worth normalizing for
  consistency with the established doctrine.

### Confirmed clean

`System.tsx` (`analyzeIntentions` correctly in `useEffect`), `MoodAnalytics.tsx`
(all heavy computation `useMemo`'d), `MonthlyPulseWidget.tsx` (localStorage
read confined to `useEffect`), `RecipeWidget.tsx` (`recordSignal` fires from
a click handler, not render).

## 4. Suspected causes, ranked

1. **Most likely, confirmed in code**: `GoalJourneyWidget` and
   `CohortConnectWidget` performing render-phase `intentionEngine` writes —
   direct recurrence of the PR #88 bug class via `recordSignal()`.
2. **Contributing, not a bug**: `analyzeIntentions()` scan surface has grown
   ~9% since the last fix (139→151 patterns), raising the cost of every
   deferred scan slightly.
3. **Cosmetic/inconsistent, not currently causal**: `astrologyTick` interval
   gating and `QuantumEngineWidgets` unmemoized sub-view computations.

## 5. Next steps

- Fix `GoalJourneyWidget.tsx:46-53` and `CohortConnectWidget.tsx:44-53` by
  moving the `recordSignal()` call into a `useEffect` keyed on the same data
  that currently gates it (mirrors the `MemoryWidget` fix in PR #94).
- Normalize `astrologyTick` in `System.tsx` onto `isRouteActive('system')`
  for consistency with sibling widgets (low priority — not currently causal).
- Consider memoizing the `QuantumEngineWidgets` cohort/qos-field sub-view
  IIFEs (low priority — cheap, no store writes).
- No user-facing report or GitHub issue currently exists for this — this
  diagnostic is preemptive. If a fresh lag report comes in, check these two
  widgets first before re-running a full profiling pass.
