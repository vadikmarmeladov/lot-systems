<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Follow-Up Diagnostic

**Issue**: Scheduled health-check investigation into button lag / rendering
performance, following up on the July 2026 perf pass (PRs #88, #85, #94, #95).
**Date**: September 5, 2026
**Trigger**: Recurring scheduled task, not a live user report — no open
GitHub issue or PR currently references button lag.

---

## Summary

No new user report or open issue exists. The last button-lag fixes landed
Jul 25–28, 2026 (PRs #88, #85, #94, #95) and the repo has had no commits
since Aug 5, 2026. This diagnostic re-audits `src/client` against
`docs/benchmark/LOT-DOCTRINE.md` ("Render Isolation" / "Async Signal
Recording") to check whether the same class of bug survives elsewhere.

**Result: yes.** Four unmemoized/undeferred call sites of the same shape as
the ones already fixed remain in `QuantumEngineWidgets.tsx`, `IntegrityWidget.tsx`,
and `Logs.tsx`. None of these were touched by the prior fix commits
(`9364aba`, `be3e8fa`, `b46f1ac`, `6e5007a`, `ee88f4c`, `b219cc3`, `863b333`).

---

## Prior fixes (for context)

| Commit | Fix |
|---|---|
| `b46f1ac` | Unmount System tab when inactive (`unmountWhenInactive` on TabPanel) to stop off-tab churn |
| `6e5007a` / `ee88f4c` | Stopped render-phase atom write + paused off-tab background work (tab-switch stall) |
| `be3e8fa` | MemoryWidget: moved `analyzeIntentions()` out of `useMemo` into `useEffect`; SystemProgressWidget: deferred `analyzeIntentions()` one macrotask so click responds instantly |
| `9364aba` | Memoized `SignalStreamWidget`'s sort and `UserMetricsWidget`'s `getUserIndex()`/`classifyPhysiologicalCohort()` on `engine.signals` identity |

Doctrine derived from these fixes, in `docs/benchmark/LOT-DOCTRINE.md`:
- **Render Isolation**: work that *writes* to a store must not run inside
  `useMemo`/render phase — move to `useEffect`.
- **Async Signal Recording**: synchronous QIE signal work (pattern analysis)
  must not block user-facing visual feedback — defer via `setTimeout(0)`.

---

## New findings (Sept 5, 2026)

### 1. `QuantumEngineWidgets.tsx:373-376` — duplicate unmemoized `classifyPhysiologicalCohort` call (highest confidence)

```tsx
{(() => {
  const live = engineState.signals.length > 0
    ? classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
    : null
```

This component subscribes to the whole engine via `useStore(intentionEngine)`
(line 165), so it re-renders on **every signal write app-wide**. The widget
already computes the same result correctly, memoized, as `cohortDirective`
(lines 201-205, keyed on `engineState.signals.length` / `recognizedPatterns.length`).
This second call is a plain IIFE in the render body with no memoization —
it re-runs the ~51-archetype scoring scan (`classifyPhysiologicalCohort`,
`intentionEngine.ts:4520`) on every render while `view === 'cohort'`. This is
the exact class of bug fixed in `UserMetricsWidget` by `9364aba`; the fix is
identical — delete the duplicate call and use `cohortDirective`/`live` from
the existing memo.

### 2. `QuantumEngineWidgets.tsx:568-570` — unmemoized `getQuantumOS()` in render body

```tsx
{view === 'qos-field' && (() => {
  const qos = getQuantumOS()
  const signalEntries = Object.entries(qos.signalMap).filter(...).sort(...)
```

`getQuantumOS()` (`intentionEngine.ts:5212`) filters the full week of signals
once, then filters again per-source across 10 sources, every render — same
component, same app-wide re-render trigger as finding #1. Needs a `useMemo`
keyed on `engineState.signals.length`.

### 3. `IntegrityWidget.tsx:341-424` — two unmemoized render-body IIFEs (`timeline`, `field` views)

Both views call `intentionEngine.get()` directly and re-filter 7 days of
signals (3x per day in the `timeline` view) with no `useMemo` at all. Re-runs
on every parent (System tab) re-render.

### 4. `IntegrityWidget.tsx:229-232` — existing `useMemo` keyed on the wrong dependency

```tsx
const integrity = React.useMemo(() => {
  const state = intentionEngine.get()
  return analyzeIntegrity(state.signals)
}, [logs])
```

`analyzeIntegrity` reads `intentionEngine`'s signals but the memo is keyed on
`logs` (a separate query). An unrelated `logs` refetch re-runs the full scan
needlessly; a signals-only update skips recompute when it shouldn't. Should
be keyed on `state.signals.length` (or similar), not `logs`.

### 5. `Logs.tsx:3975` — `analyzeIntentions()` run un-deferred on a `/qos` trigger

```tsx
} else if (trigger === 'qos-report') {
  try { analyzeIntentions() } catch {}
```

Runs inside a `useEffect` (not render phase, not a click handler), so it
does not block the current commit's paint — but unlike the `be3e8fa` fix to
`SystemProgressWidget`, which explicitly deferred this exact same call one
macrotask specifically because it's a "~139-pattern scan on a cooldown
miss," this call site invokes it directly. Lower confidence than #1/#2
(effects already run post-paint), but worth the same one-macrotask defer for
consistency and to avoid janking the very next keystroke.

### 6. `IntegrityWidget.tsx:281` — `transition-all duration-500` on 20 mapped bars (lowest confidence)

Broad `transition-all` on a per-bar `.map()` inside a widget that isn't a
direct `intentionEngine` subscriber — likely fine today, flagged only
because it's the same shape as prior CSS-jank notes; no evidence yet it
fires often enough to matter.

---

## Suspected root cause pattern (recap, not new)

All six findings are variations on one root cause already named in
`LOT-DOCTRINE.md` §"Render Isolation": **widgets that subscribe broadly to
`intentionEngine` (via `useStore(intentionEngine)` or a direct
`intentionEngine.get()` call in render) and then run an expensive
scan/classify/sort function in the render body without memoizing on a
stable signal-array dependency.** The July fixes addressed this in
`SignalStreamWidget`, `UserMetricsWidget`, `MemoryWidget`, and
`SystemProgressWidget`; `QuantumEngineWidgets.tsx` and `IntegrityWidget.tsx`
were not covered by that pass and carry the same pattern.

## Next steps

1. Apply the same memoization fix used in `9364aba`/`be3e8fa` to findings
   #1–#4 in `QuantumEngineWidgets.tsx` and `IntegrityWidget.tsx`.
2. Defer finding #5 (`Logs.tsx:3975`) via `setTimeout(0)` to match the
   `SystemProgressWidget` doctrine.
3. No evidence of a *new* user-visible lag report exists yet (no open
   GitHub issue references this) — these are latent risks surfaced by
   re-auditing against doctrine, not confirmed regressions. Recommend a
   headless-Chromium repro (per the `9364aba` methodology: seed 1000
   signals + 500 logs, rapid tab/view switches) to quantify actual paint
   cost before prioritizing a fix PR.
4. Widgets confirmed clean on this pass: `QuantumStateWidget`,
   `SystemPulseWidget`, `AIFeedbackWidget`, `SignalStreamWidget`,
   `UserMetricsWidget`, `MemoryWidget`, `SystemProgressWidget` — all
   correctly memoize on signal-array identity or defer via `useEffect`.
