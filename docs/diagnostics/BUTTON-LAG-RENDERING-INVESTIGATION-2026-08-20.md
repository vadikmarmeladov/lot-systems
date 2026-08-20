# Button Lag / Rendering Investigation — 2026-08-20

Scheduled diagnostic sweep. No live user report triggered this — it's a
periodic check of the recurring "button lag" failure class against the
current state of `master` (branch `claude/brave-rubin-7c67qk`, which is
even with `master` as of this scan, commit `98971f2`).

## Summary

The button-lag issue is a **recurring architectural failure class**, not a
single bug. It stems from the `intentionEngine` nanostores atom pattern:
~7–9 widgets stay subscribed to the same store, so any write fans out a
re-render to all of them. When one of those writes happens synchronously
inside render (a `useMemo` body) or inside a click handler ahead of a heavy
computation, the button appears to freeze — click registers, then a
noticeable beat, then the UI catches up.

This has been found and fixed **five times** since June 2026, each time in
a different widget, and the project has since codified the fix as doctrine.
As of this scan, a full re-audit of every `analyzeIntentions()` /
`recomputeAssembly()` / `record*Signal()` call site in `src/client/components`
found **no new occurrence** of the pattern — every current call site runs
inside a `useEffect` or an event handler, not render phase. No open GitHub
issue or PR currently references button lag or rendering performance.

## Fix history (chronological)

| Date | Commit | Root cause | Fix |
|---|---|---|---|
| 2026-06-02 | SR-20260602-01 | Router lived in `App`, so every route change re-rendered `System` | Router moved to `TabPanel` |
| 2026-06-03 | SR-20260603-01 | Unused `Block` store subscriptions; per-item subs not lifted; nav buttons re-rendering on every state change | Removed dead subs, lifted per-item subs in `Sync`, memoized nav buttons |
| [`6e5007a`](https://github.com/LOT-Systems/LOT-Computer/commit/6e5007a4b5889967100b157116abba7cfdbc9521) | 2026-07-19 | `PatternRecognitionWidget` called `getOptimalWidget()` (→ `analyzeIntentions` → atom write) **during render**; 3 System-only intervals ran even while off-tab | Memoized on `recognizedPatterns`; gated intervals on `isRouteActive('system')` |
| [`b46f1ac`](https://github.com/LOT-Systems/LOT-Computer/commit/b46f1ac9550e5afdeb70f2e057be78096f92325e) | 2026-07-25 | System's ~7 subscriber widgets stayed mounted (`display:none`) after first visit, so *any* signal from *any* tab re-rendered them in the background until the main thread saturated | System tab fully unmounts when inactive (`unmountWhenInactive` on `TabPanel`) |
| [`be3e8fa`](https://github.com/LOT-Systems/LOT-Computer/commit/be3e8fae8e799944bb35509d28ffd6b4e7c5c582) | 2026-07-28 | `MemoryWidget`: `analyzeIntentions()` (a store write) ran inside a `useMemo` keyed on `question?.id`. `SystemProgressWidget.handleGenerateReport`: ran a ~139-pattern synchronous scan directly in the click handler | Moved to `useEffect` w/ `useState` seed; deferred the report build one macrotask via `setTimeout(build, 0)` so the click responds before the scan runs |
| [`9364aba`](https://github.com/LOT-Systems/LOT-Computer/commit/9364aba5d89615f7b2d03db0d42fa0cb2829478d) | 2026-07-28 | `SignalStreamWidget` re-sorted up to 1000 signals every render; `UserMetricsWidget` ran `getUserIndex()` + `classifyPhysiologicalCohort()` unmemoized every render | Memoized both on stable deps (`engine.signals` / `engineState.signals`) |

Doctrine for this pattern is now written up in
[`docs/benchmark/LOT-DOCTRINE.md`](../benchmark/LOT-DOCTRINE.md#render-isolation)
under **Render Isolation**:

> Corollary: work that WRITES to a store must not run inside `useMemo`
> (render phase) — the writes schedule subscriber re-renders before the
> browser can paint. Move such work to `useEffect` so atom writes land
> after paint; seed the derived value with `useState` for an identical
> first render.

## What this scan checked

- `git log` across `master` and all branches for button/lag/perf/render
  commits and open work.
- Every `React.useMemo(...)` body in `src/client/components/*.tsx` for a
  store `.set()` / `record*Signal()` call running in render phase — none
  found; the one borderline hit (`QuantumEngineWidgets.tsx:210`) is inside
  a `setState` updater callback triggered from a click handler, which is
  fine.
- Every remaining `analyzeIntentions()` / `recomputeAssembly()` call site
  (`About.tsx`, `IntegrityWidget.tsx`, `Logs.tsx`, `MemoryWidget.tsx`,
  `PatternRecognitionWidget.tsx`, `QuantumEngineWidgets.tsx`,
  `SignalStreamWidget.tsx`, `System.tsx`, `SystemProgressWidget.tsx`) —
  all now sit inside `useEffect` or event handlers. `IntegrityWidget.tsx`
  imports `analyzeIntentions` but never calls it (dead import, not a perf
  issue).
- `Button.tsx` and its hover CSS (`.grid-fill-hover`) — the hover fill is a
  compositor-only `opacity` transition with `will-change: opacity`, cheap
  and not implicated in click lag.
- Open GitHub issues/PRs on `LOT-Systems/LOT-Computer` for "button" /
  "lag" / "rendering" — zero matches. One open PR (#93, calendar time
  tracking) is unrelated.

## Current status

No active or newly-introduced button-lag regression found as of this scan.
The doctrine fix has held since the 2026-07-28 commits; nothing has
regressed it through the 2026-08-05 merges (`#95`, `#96`), which were
badge/wiki/documentation content, not widget logic.

## Next steps if lag resurfaces

1. **Regression guard**: there's no automated test asserting click-to-paint
   latency on the System-tab widgets. A headless-Chromium smoke test (the
   kind used ad hoc to verify `be3e8fa`/`9364aba`) could be made permanent
   in `scripts/tests/` to catch a reintroduced render-phase write before
   merge.
2. **New widget checklist**: any new `intentionEngine` subscriber widget
   should be checked against the Render Isolation doctrine before merge —
   specifically, no store write inside `useMemo`, and no unmemoized O(n)
   work over `logs`/`signals` in the render body.
3. **If a live report comes in**: capture a Chrome DevTools Performance
   trace of the specific click — the prior fixes were only findable by
   profiling, not by code reading alone (the `SystemProgressWidget` cooldown
   masked the cost most of the time).
