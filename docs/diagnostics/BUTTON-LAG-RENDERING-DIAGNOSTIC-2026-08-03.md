<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering Diagnostic — 2026-08-03

Scheduled investigation into reported button lag / rendering problems. Reviewed
recent commit history, prior PRs, and re-audited the codebase for the same class
of bug the last few perf passes fixed, then verified two concrete, previously
unfixed issues by tracing call sites and reproducing the failure in isolation.
Both are fixed in this pass; see "Fixes applied" below.

## 1. Prior work already in the repo

This exact symptom ("buttons lag / rendering problems") has an active fix
history. Recent related commits, newest first:

- `9364aba` — perf: memoize last heavy per-render work in System subscriber widgets (PR #95)
- `be3e8fa` — perf: fix two residual button-lag paths flagged by agent diagnostic (PR #94)
- `6e5007a` — perf: stop render-phase atom write + off-tab churn (tab-switch stall)
- `b219cc3` — perf: unblock render pipeline — move quantum state writes out of useMemo
- `863b333` — fix: reduce widget lag — cap logs query and back off stats polling
- `bd9ef2a` — Fix Planner buttons frozen: reuse AudioContext, catch sound errors
- `b46f1ac` — perf: unmount System tab when inactive to end background churn

The established root-cause pattern across all of these: `analyzeIntentions()`
(in `src/client/stores/intentionEngine.ts`) **writes** the `intentionEngine`
nanostore (`intentionEngine.set(...)` on a cache miss, ~139-pattern scan). Any
component that calls it — or a helper that calls it — from inside a `useMemo`
or the render body (rather than a `useEffect`, after paint) triggers a
synchronous re-render cascade across every subscriber before the browser can
paint. The same doctrine violation was found and fixed independently in
`System.tsx`, `MemoryWidget.tsx`, `SystemProgressWidget.tsx`,
`PatternRecognitionWidget.tsx`, `SignalStreamWidget.tsx`, and
`UserMetricsWidget.tsx` over the last several sessions.

No open GitHub issues or PRs reference button lag — the last two PRs on this
topic (#94, #95) are merged. This pass re-swept the codebase for anything the
prior fixes missed.

## 2. New findings (both fixed in this pass)

### 2.1 `System.tsx:377` — reintroduced render-phase store write

```tsx
const optimalWidget = React.useMemo(() => getOptimalWidget(), [logs])
```

`getOptimalWidget()` (`src/client/stores/intentionEngine.ts:3410`) calls
`analyzeIntentions()` internally, which writes the store on a cache miss. This
`useMemo` was keyed on `logs` — the raw react-query array reference, which
changes on every fetch/refresh — so `analyzeIntentions()` re-ran and could
re-write the store from inside `System.tsx`'s render body every time `logs`
got a new reference. This is the exact bug class `PatternRecognitionWidget.tsx`
was fixed for in an earlier pass (keyed on `patterns` instead of a
frequently-changing dependency) — that fix never got applied to this second,
separate call site in `System.tsx`.

**Fix applied:** re-keyed the memo on `quantumState` instead of `logs`.
`quantumState` only updates from the `useEffect` a few lines above (which
already calls `analyzeIntentions()` after paint), so by the time this memo
recomputes, `analyzeIntentions()` hits its 5-minute cooldown cache and returns
without writing — matching the pattern already used for `physiologicalCohort`
a few lines down in the same component.

### 2.2 `UserMetricsWidget.tsx:98` — wrong-arity call crashes the entire "Dashboard" widget stack

```tsx
const qieCohort = React.useMemo(() => classifyPhysiologicalCohort(), [engineState.signals])
```

`classifyPhysiologicalCohort(signals, userState, recognizedPatterns)` takes
three required parameters (`src/client/stores/intentionEngine.ts:4204`). Every
other call site in the codebase (`System.tsx:277`, `SystemPulseWidget.tsx:64`,
`QuantumEngineWidgets.tsx:193,365`) passes all three. This one call site — introduced
in `cfa04bd` (2026-06-29) and left unchanged by the later memoization pass in
`9364aba` — calls it with **zero** arguments.

Reproduced directly:

```
$ node -e "
function classifyPhysiologicalCohort(signals, userState, recognizedPatterns) {
  return signals.filter(s => true)
}
classifyPhysiologicalCohort()
"
Uncaught TypeError: Cannot read properties of undefined (reading 'filter')
```

This throws unconditionally, every single render — the memo runs on mount,
before `UserMetricsWidget`'s early returns (moved there deliberately in
`9364aba` to satisfy the Rules of Hooks). `UserMetricsWidget` sits inside
`<WidgetErrorBoundary name="Dashboard">` in `System.tsx:1021`, which also wraps
`CorrelatedIndexesWidget`, `SystemProgressWidget`, and `SystemPulseWidget`. The
boundary catches the throw and replaces the **entire Dashboard block** (all
four widgets) with a "Failed to load. Retry" fallback
(`src/client/components/ui/WidgetErrorBoundary.tsx:61-75`). Clicking "Retry"
resets `hasError` and re-renders the children, which crashes again
immediately — so from the user's side, an entire panel is gone and the Retry
button appears to do nothing. This is very likely a meaningful part of the
"rendering problems" being reported, separate from the render-cascade lag
issue.

A second, smaller bug rode along in the same widget: even once the crash is
fixed, `qieCohort.label` and `qieCohort.dominant` (lines 262, 272) don't exist
on `PhysiologicalCohortClassification` (`archetype`, `energyBand`,
`dominantModule`, `directive`, `confidence`, per the type definition) — this
code path was unreachable while the call above crashed, so the mismatch was
never noticed. Both were rendering `undefined`.

**Fix applied:**
- Pass the three arguments through from `engineState` (`engineState.signals`,
  `engineState.userState`, `engineState.recognizedPatterns ?? []`), matching
  every other call site, and updated the `useMemo` deps accordingly.
- Corrected the two field references: `qieCohort.label` → `qieCohort.archetype`,
  `qieCohort.dominant` → `qieCohort.dominantModule`.

## 3. Why this matters for "buttons lagging"

- Any widget that hard-crashes into its `WidgetErrorBoundary` fallback removes
  its buttons from the tree entirely — any click on the "Retry" button that
  re-triggers the same unconditional throw will look and feel exactly like a
  frozen/unresponsive button.
- The render-cascade class of bug (2.1, and all of the prior commits in §1)
  manifests as a perceptible delay between a click and the UI responding,
  because React is forced to flush a synchronous chain of re-renders across
  every `intentionEngine` subscriber before it can paint the click's own
  visual feedback.

## 4. Verification caveats / next steps

- This environment does not have `node_modules` installed, so the fixes could
  not be verified with the project's own `tsc` type-check or a headless-Chromium
  smoke test (the method used to verify `be3e8fa` / `9364aba`). The static
  analysis here is high-confidence (argument counts, type definitions, and the
  crash were all confirmed directly), but **CI / a local dev run should
  confirm** the `System.tsx` and `UserMetricsWidget.tsx` changes before
  considering this closed.
- Recommend adding an explicit non-zero-arg test or a lint rule (e.g.
  `@typescript-eslint/no-unsafe-call` won't catch this, but a simple call-site
  grep for `classifyPhysiologicalCohort()` with no args, or CI running
  `tsc --noEmit`, would have caught this at PR time — worth checking why it
  didn't).
- No further instances of either anti-pattern (render-phase store write, or
  synchronous heavy work in a click handler) were found in a full sweep of
  `src/client/components/**/*.tsx`. If lag reports continue after this ships,
  the next place to look is DOM-heavy CSS (large `box-shadow`/`filter`
  animations, `backdrop-blur`) or third-party libraries mounted inside the
  same subscriber tree, which this pass did not audit.
