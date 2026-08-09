<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation Report

**Date**: August 9, 2026
**Trigger**: Scheduled investigation (no live user report attached)
**Branch**: `claude/brave-rubin-drabgm` (based on `master` @ `98971f20`)
**Status**: 🔴 Action needed — confirmed live crash, unfixed, untracked by any open PR

---

## Summary

This is a recurring bug class in this codebase — at least nine prior scheduled
investigations of "button lag / rendering" exist in git history (see table
below), most on throwaway session branches that were never merged to `master`.

The most recent prior investigation (`696e17f8`, Aug 8 2026, on branch
`claude/brave-rubin-xaur4q`) found three live issues. **That branch was never
merged and has no open PR** (`search_pull_requests head:claude/brave-rubin-xaur4q`
→ 0 results). This pass re-verified all three findings directly against
`master`/current branch source and confirms **all three are still present,
one full day later, with no fix in flight anywhere**:

1. **Confirmed crash**, not lag — `UserMetricsWidget.tsx:98` throws on every render.
2. **Confirmed re-opened render-phase write** — `System.tsx:377`, `PatternRecognitionWidget.tsx:78`.
3. **Confirmed unmemoized scan** — `QuantumEngineWidgets.tsx:570`.

No GitHub issue or PR anywhere in the repo currently references this bug class
(`search_issues`/`search_pull_requests` for "button lag" / `classifyPhysiologicalCohort`
→ 0 results). The only open PR in the repo (`#93`) is unrelated (calendar
time-tracking). This means the crash below is currently shipping to every user
who opens the System tab on `master`, with zero tracking.

---

## Findings (re-verified against current source, 2026-08-09)

### 1. `UserMetricsWidget.tsx:98` — crashes on every render — **CRITICAL, confirmed live**

```ts
// src/client/components/UserMetricsWidget.tsx:97-98
const userIndex = React.useMemo(() => getUserIndex(), [engineState.signals])
const qieCohort = React.useMemo(() => classifyPhysiologicalCohort(), [engineState.signals])
```

```ts
// src/client/stores/intentionEngine.ts:4520 — three required params, no defaults
export function classifyPhysiologicalCohort(
  signals: IntentionSignal[],
  userState: UserState,
  recognizedPatterns: IntentionPattern[]
): PhysiologicalCohortClassification {
  const now = Date.now()
  const dayAgo = now - 24 * 60 * 60 * 1000
  const recentSignals = signals.filter(s => s.timestamp > dayAgo)  // throws: Cannot read properties of undefined (reading 'filter')
```

Introduced by commit `9364aba` (PR #95, merged Jul 28) — a memoization fix
that moved the call into `useMemo` but never passed its three arguments.
`tsconfig.json` has `strict: true`, so `tsc --noEmit` would catch this
(`TS2554: Expected 3 arguments, but got 0`), but the client bundle
(`scripts/build/client.build.ts`) goes through esbuild, which transpiles
without type-checking — nothing in CI catches it.

`UserMetricsWidget` is mounted at `System.tsx:1025` inside the shared
`WidgetErrorBoundary name="Dashboard"` (`System.tsx:1022`), alongside
`CorrelatedIndexesWidget`, `SystemProgressWidget`, and `SystemPulseWidget`.
Every render of `UserMetricsWidget` throws, which trips that shared boundary
and blanks the whole Dashboard widget group for every user on the System tab
— not a lag complaint, a hard crash.

**Fix** (confirmed available in scope, `engineState` already destructured at
line 31 and used with these exact fields elsewhere in the same file, e.g.
lines 277, 294, 367):

```ts
const qieCohort = React.useMemo(
  () => classifyPhysiologicalCohort(engineState.signals, engineState.userState, engineState.recognizedPatterns),
  [engineState.signals]
)
```

This matches the existing internal call site at `intentionEngine.ts:4708`.

### 2. `System.tsx:377` / `PatternRecognitionWidget.tsx:78` — render-phase store write, re-opened — **HIGH, confirmed live**

```ts
const optimalWidget = React.useMemo(() => getOptimalWidget(), [logs])       // System.tsx:377
const optimal = React.useMemo(() => getOptimalWidget(), [patterns])         // PatternRecognitionWidget.tsx:78
```

`getOptimalWidget()` (`intentionEngine.ts:3666`) calls `analyzeIntentions()`
internally, which writes the `intentionEngine` atom once its 5-minute cooldown
elapses. Because this happens inside `useMemo` (synchronous, render-phase),
the store write can cascade re-renders across every `intentionEngine`
subscriber before the browser paints — the exact class of bug fixed for
`System.tsx`'s `quantumState` (commit `b219cc3`) and `MemoryWidget`
(commit `be3e8fa`), but not applied to this sibling call site in either file.

`PatternRecognitionWidget.tsx:73-77` carries a comment claiming this is
already handled by memoizing on `patterns` — that only stops the call from
re-running on *every* re-render, it does not stop the write from happening
*during render* on the renders where `patterns`/`logs` does change (routine).

**Fix**: same `useState`-seed + `useEffect` (post-paint) pattern already used
for `quantumState` at `System.tsx:262-271`.

### 3. `QuantumEngineWidgets.tsx:570` — unmemoized O(sources × signals) scan — **MEDIUM, confirmed live**

```ts
const qos = getQuantumOS()
const signalEntries = Object.entries(qos.signalMap).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1])
```

Runs directly in the `view === 'qos-field'` render branch, not wrapped in
`useMemo`. `QuantumEngineWidgets` subscribes to `intentionEngine` via
`useStore`, so this re-scans the full signal map on every signal recorded
anywhere in the app while this view is open — same shape as the bug fixed
for `SignalStreamWidget`/`UserMetricsWidget`'s other derivations in commit
`9364aba`, just not caught in this file.

**Fix**: wrap in `useMemo` keyed on `engineState.signals`.

### Checked, not re-flagged

- `Button.tsx` and widget `onClick` handlers: no un-deferred heavy work found.
  `SystemProgressWidget.handleGenerateReport`'s `setTimeout(build, 0)`
  deferral (commit `be3e8fa`) is intact.
- `StatusPage.tsx`, `QuantumRandomWidget.tsx`, `MicroCalculatorWidget.tsx`
  `setInterval` loops still lack an `isRouteActive`/`document.hidden` guard
  (low severity — cheap per-tick work), consistent with the Aug 8 report.

---

## Prior history

| Commit | PR | Branch state | What it found/fixed |
|---|---|---|---|
| `863b333` | — | merged | Logs API unbounded query + slow stats polling |
| `b219cc3` | — | merged | `System.tsx` `quantumState` write inside `useMemo` |
| `ee88f4c` | #85 | merged | Background intervals running on inactive tabs |
| `6e5007a` | #88 | merged | `PatternRecognitionWidget.getOptimalWidget()` render-phase write (1st occurrence) |
| `be3e8fa` | #94 | merged | `MemoryWidget` render-phase write; blocking click handler |
| `9364aba` | #95 | merged | Memoized `SignalStreamWidget`/`UserMetricsWidget` — **introduced finding #1 as a side effect** |
| `696e17f8` | — | **unmerged**, no PR (`claude/brave-rubin-xaur4q`) | Prior investigation — found the same 3 findings below, 24h ago |
| `dad7429b` | — | **unmerged**, no PR (`claude/charming-albattani-f4oihr`) | Separate widget-fleet audit (wiring/data-sourcing, not this bug class) |

The pattern across this history: fixes land for the specific call site that
was reported, a sibling call site with the same shape survives, and
investigation reports themselves are increasingly landing on scheduled-task
branches that never get merged — so even a correctly diagnosed bug (like this
one, diagnosed 24h ago) doesn't reach `master`.

## Recommended next steps

1. **Fix finding #1 immediately** — it's a crash currently live on `master`
   for every System-tab pageview, not a lag issue. One-line fix, given above.
2. Apply the `useState`-seed + `useEffect` pattern to finding #2 (two call
   sites, one pattern, already proven at `System.tsx:262-271`).
3. Wrap finding #3 in `useMemo` keyed on `engineState.signals`.
4. Add a `tsc --noEmit` step to CI or a pre-push hook — esbuild's lack of
   type-checking is why finding #1 shipped silently and why it will recur.
5. Process gap, not a code gap: the Aug 8 investigation diagnosed this
   correctly but landed on a session branch with no PR opened, so the fix
   never reached `master`. Scheduled investigation tasks that find
   actionable, isolated fixes (like finding #1 here) should open a PR against
   `master` rather than only committing a docs-only report to an ephemeral
   branch.

---

*Investigation performed by scheduled automated review. Findings verified by
direct source inspection (grep + read) against `src/client/components/System.tsx`,
`PatternRecognitionWidget.tsx`, `UserMetricsWidget.tsx`, `QuantumEngineWidgets.tsx`,
and `src/client/stores/intentionEngine.ts`, cross-checked against the prior
`696e17f8` report and confirmed via `git branch --contains` that neither that
report's branch nor its fixes ever reached `master`. Branch: `claude/brave-rubin-drabgm`
at commit `98971f20`.*
