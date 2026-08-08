<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation Report

**Date**: August 8, 2026
**Trigger**: Scheduled investigation (no live user report attached)
**Branch**: `claude/brave-rubin-xaur4q`
**Status**: 🔴 Action needed — one crash-class regression found, plus one re-opened render-phase-write bug

---

## Summary

This is a recurring bug class in this codebase, not a new issue. Five prior PRs (#85, #88, #92 partial, #94, #95 — see history below) each fixed a variant of the same root cause: code that writes to the `intentionEngine` nanostore atom (via `analyzeIntentions()` or functions that call it internally) synchronously during React's render phase, or that does unmemoized heavy work in components that re-render on every store write. Each fix closed specific call sites; each time, a sibling call site elsewhere in the widget tree turned out to have the same shape and kept the bug alive for users hitting a different widget.

This pass found that pattern is **still present** in two call sites (one of which was previously "fixed" in name only), plus a **separate, more severe bug** introduced by the July 28 memoization fix itself: a required-argument function now called with zero arguments, which throws on every render.

No open GitHub issues or PRs currently reference this by name (checked via `search_issues`/`search_pull_requests`), and all recent CI runs (`Benchmark Tag Lattice`, `Weekly Rebuild & Self-Assembly Sync`) are green — this class of bug doesn't fail CI because esbuild (this project's client bundler) does not type-check, so a TypeScript arity error like finding #2 below ships silently and only surfaces at runtime in the browser.

---

## Findings

### 1. `UserMetricsWidget.tsx:98` — `classifyPhysiologicalCohort()` called with 0 of 3 required arguments — **CRITICAL, crash not lag**

```ts
// src/client/components/UserMetricsWidget.tsx:98
const qieCohort = React.useMemo(() => classifyPhysiologicalCohort(), [engineState.signals])
```

```ts
// src/client/stores/intentionEngine.ts:4520 — no default parameter values
export function classifyPhysiologicalCohort(
  signals: IntentionSignal[],
  userState: UserState,
  recognizedPatterns: IntentionPattern[]
): PhysiologicalCohortClassification {
  ...
  const recentSignals = signals.filter(s => s.timestamp > dayAgo)  // line 4527 — throws: Cannot read properties of undefined
```

This line was introduced by commit `9364aba` ("perf: memoize last heavy per-render work in System subscriber widgets", PR #95, merged Jul 28). The intent was sound — move `classifyPhysiologicalCohort()` into a `useMemo` so it stops re-running unmemoized on every render — but the call was never given its three required arguments. `strict: true` is set in `tsconfig.json`, so `tsc --noEmit` would flag this (`TS2554: Expected 3 arguments, but got 0`), but the client build (`client:js:build`, `scripts/build/client.build.ts`) runs through **esbuild**, which transpiles without type-checking. Nothing in CI catches this.

Every call to `signals.filter(...)` inside the function body on line 4527 will throw a `TypeError` the first time `UserMetricsWidget` renders (`engineState.signals` is always defined after mount). `UserMetricsWidget` is mounted at `System.tsx:1025` inside the shared `WidgetErrorBoundary name="Dashboard"` block (`System.tsx:1022-1036`), alongside `CorrelatedIndexesWidget`, `SystemProgressWidget`, and `SystemPulseWidget` (`System.tsx:1028-1034`) — so this doesn't just blank one widget, it takes the whole Dashboard boundary group down for every user who opens the System tab.

**Fix**: pass the three arguments the function already has in scope via `engineState` (`engineState.signals`, `engineState.userState`, `engineState.recognizedPatterns`), matching the existing internal call site at `intentionEngine.ts:4708`.

### 2. `System.tsx:377` and `PatternRecognitionWidget.tsx:78` — `getOptimalWidget()` runs `analyzeIntentions()` synchronously inside `useMemo` (render phase) — **HIGH, the original bug class, re-opened**

```ts
const optimalWidget = React.useMemo(() => getOptimalWidget(), [logs])       // System.tsx:377
const optimal = React.useMemo(() => getOptimalWidget(), [patterns])         // PatternRecognitionWidget.tsx:78
```

`getOptimalWidget()` (`intentionEngine.ts:3666`) calls `analyzeIntentions()` internally, which — once its 5-minute cooldown elapses — calls `intentionEngine.set(...)` (`intentionEngine.ts:3443`), a full atom write. `useMemo` runs synchronously during React's render phase, so any store write inside it cascades re-renders across every `intentionEngine` subscriber before the browser can paint. This is precisely the bug fixed at `System.tsx:262-271` (commit `b219cc3`) and in `MemoryWidget.tsx` (commit `be3e8fa`) — but those fixes only touched the `quantumState` call sites; this sibling call, four lines down in the same file, was missed both times.

`PatternRecognitionWidget.tsx:73-77` even carries a comment claiming this was handled:

> `getOptimalWidget()` calls `analyzeIntentions()`, which WRITES the intentionEngine atom... Memoize on the already-analyzed patterns so it does not re-run (and cannot write) on every signal.

That's not quite right: memoizing on `patterns`/`logs` only stops the call from re-running on *every* re-render — it does not stop the write from happening *during render* on the renders where it does run (e.g., whenever `logs`/`patterns` changes, which is routine). It needs the same treatment as `System.tsx`'s `quantumState`: seed with `useState` for an identical first paint, then call `getOptimalWidget()` in a `useEffect` (post-paint), keyed the same way.

### 3. `QuantumEngineWidgets.tsx:568-569` — unmemoized signal-map scan in a frequently-re-rendered subscriber — **MEDIUM**

```ts
const qos = getQuantumOS()
const signalEntries = Object.entries(qos.signalMap).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1])
```

Runs directly in the `view === 'qos-field'` render branch, not wrapped in `useMemo`. `getQuantumOS()` does an O(sources × signals) pass over the full signal history. `QuantumEngineWidgets` subscribes to `intentionEngine` via `useStore`, so while this view is showing, the scan re-runs on every signal recorded anywhere in the app — the same shape of bug fixed for `SignalStreamWidget` and `UserMetricsWidget`'s other derivations in commit `9364aba`, just not caught in this file.

### Lower priority (flagged for completeness, not urgent)

- `StatusPage.tsx:104`, `QuantumRandomWidget.tsx:39,65`, `MicroCalculatorWidget.tsx:71` — `setInterval` loops with no `isRouteActive`/`document.hidden` guard (the doctrine established in commit `ee88f4c`). Work per tick is cheap (fetch/RNG/timer text), so risk is low, but they're inconsistent with the rest of the codebase's off-tab discipline.
- `intentionEngine.ts:5129` `startBackgroundQOSMonitor`'s 30-min interval also lacks a visibility guard, but is self-limited by `analyzeIntentions()`'s own 5-minute cooldown.
- `Button.tsx` and `onClick` handlers across widgets: no un-deferred heavy work found. `SystemProgressWidget.handleGenerateReport`'s `setTimeout(build, 0)` deferral (commit `be3e8fa`) is intact and correctly isolates the click response from the ~139-pattern scan.

---

## Prior history (for context)

| Commit | PR | What it fixed |
|---|---|---|
| `863b333` | — | Logs API unbounded query + slow stats polling → ~1 min widget response delay |
| `b219cc3` | — | `System.tsx` `quantumState` write inside `useMemo` during render |
| `ee88f4c` | #85 | Background intervals kept running on inactive tabs (`document.hidden` doesn't catch in-app tab switches) |
| `6e5007a` | #88 | `PatternRecognitionWidget.getOptimalWidget()` render-phase write (first occurrence — see finding #2, it came back) |
| `be3e8fa` | #94 | `MemoryWidget` render-phase write; `SystemProgressWidget.handleGenerateReport` blocking click handler |
| `9364aba` | #95 | `SignalStreamWidget`/`UserMetricsWidget` unmemoized per-render work — **introduced finding #1 as a side effect** |

Worth noting: commit `6e5007a` ("perf: stop render-phase atom write + off-tab churn", PR #88) already fixed a `PatternRecognitionWidget` render-phase write once. Finding #2 in `PatternRecognitionWidget.tsx` is the same widget, same underlying `getOptimalWidget()` call, reintroduced or never fully cleared — worth a `git log -p --follow` on that specific line if a code owner wants to trace exactly when it regressed.

## Recommended next steps

1. Fix finding #1 first — it's a crash, not lag, and it's currently live on every System-tab pageview.
2. Apply the same `useState`-seed + `useEffect` pattern to `System.tsx:377` and `PatternRecognitionWidget.tsx:78` (finding #2), matching the existing `quantumState` pattern in `System.tsx:262-271`.
3. Wrap the `QuantumEngineWidgets.tsx:568-569` scan in `useMemo` keyed on `engineState.signals` (finding #3).
4. Given that esbuild's lack of type-checking let finding #1 ship silently, consider adding a `tsc --noEmit` step to CI (or a pre-push hook) — this exact bug class (function signature changes that pass a build but fail at runtime) is likely to recur otherwise.
5. No user-facing performance metrics or profiling artifacts were found in-repo for this session (no APM/RUM integration located); the headless-Chromium smoke tests referenced in past commit messages appear to have been ad hoc, not checked in. If button lag reports continue after the above fixes land, the next investigation should start with a checked-in profiling harness rather than one-off manual runs.

---

*Investigation performed by scheduled automated review. Findings verified by direct source inspection (grep + read) against `src/client/components/System.tsx`, `PatternRecognitionWidget.tsx`, `UserMetricsWidget.tsx`, `QuantumEngineWidgets.tsx`, and `src/client/stores/intentionEngine.ts` on branch `claude/brave-rubin-xaur4q` at commit `98971f2`.*
