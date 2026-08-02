<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering — Diagnostic (2026-08-02)

**Trigger**: Scheduled investigation into "buttons lagging" and rendering problems.
**Scope**: `src/client/components/*`, `src/client/stores/intentionEngine.ts`.

---

## 1. Status of the known button-lag saga

The button-lag / tab-switch-stall issue has a well-documented history and was
already fixed across five merged PRs before this investigation started:

| PR | Date | Root cause fixed |
|----|------|-------------------|
| [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85) | 2026-07-19 | System background work (60s/10s intervals, `recordSignal`) kept running on background tabs; `document.hidden` guard didn't catch in-app tab switches. Added `isRouteActive(route)`. |
| [#87](https://github.com/LOT-Systems/LOT-Computer/pull/87) | 2026-07-19 | `SystemProgressWidget` was mounted twice, doubling mount-effect cost. |
| [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) | 2026-07-19 | `PatternRecognitionWidget` wrote to the `intentionEngine` store *during render* (`getOptimalWidget()` → `analyzeIntentions` → `.set`), cascading re-renders through every subscriber. Also three ungated intervals on System-only widgets. |
| [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94) | 2026-07-28 | `MemoryWidget` ran `analyzeIntentions()` (a store write) inside `useMemo`; `SystemProgressWidget`'s report-generation click handler ran a 139-pattern scan synchronously, blocking the click. |
| [#95](https://github.com/LOT-Systems/LOT-Computer/pull/95) | 2026-07-28 | `SignalStreamWidget` re-sorted up to 1000 signals every render; `UserMetricsWidget` re-ran `getUserIndex()`/`classifyPhysiologicalCohort()` every render. Both memoized on `engine.signals`. |

HEAD on `master` sits exactly at PR #95. There is no further button-lag work
pending from that saga, and re-auditing the codebase against the same four
anti-patterns (render-phase store writes, unmemoized heavy per-render work,
ungated intervals on background tabs, duplicate widget mounts) turned up
nothing new on the *lag* side — see §3.

## 2. What this investigation found instead: a live rendering crash

While re-checking the exact `useMemo` block PR #95 introduced
(`UserMetricsWidget.tsx:97-98`), the second memo turned out to be broken —
not slow, but throwing on every render.

```ts
// before (broken)
const qieCohort = React.useMemo(() => classifyPhysiologicalCohort(), [engineState.signals])
```

`classifyPhysiologicalCohort` (`intentionEngine.ts:4204`) takes three
**required** positional parameters — `signals`, `userState`,
`recognizedPatterns` — with no defaults:

```ts
export function classifyPhysiologicalCohort(
  signals: IntentionSignal[],
  userState: UserState,
  recognizedPatterns: IntentionPattern[]
): PhysiologicalCohortClassification {
  ...
  const recentSignals = signals.filter(s => s.timestamp > dayAgo) // signals is undefined
```

Called with zero arguments, `signals` is `undefined` and `signals.filter(...)`
throws a `TypeError` immediately. Every other call site in the codebase
(`System.tsx:277`, `QuantumEngineWidgets.tsx:193`, `QuantumEngineWidgets.tsx:365`)
passes all three arguments correctly — `UserMetricsWidget` is the outlier.

**Why it shipped clean and stayed hidden for a month:**
- The client bundle builds via esbuild (`scripts/build/client.build.ts`), which
  transpiles but does **not** type-check. `tsc --noEmit` does flag this call
  as a `TS2554: Expected 3 arguments, but got 0` today, but that check isn't
  in the client build/deploy path, so the arity mismatch never blocked a
  release.
- `git log -S` shows the 3-argument signature has been in place since
  `fc1677e` (2026-06-30); `UserMetricsWidget`'s zero-arg call predates that
  same day. It has been broken in production for **over a month**.
- The crash is swallowed by `WidgetErrorBoundary name="Dashboard"` in
  `System.tsx:1021-1035`. Because React error boundaries unmount the whole
  subtree under the boundary that threw, the crash in the *first* child
  (`UserMetricsWidget`) takes the entire CQGS Dashboard stack down with it —
  `CorrelatedIndexesWidget`, `SystemProgressWidget` (deployment info/feedback),
  and `SystemPulseWidget` (real-time metrics) all disappear too, replaced by
  one low-opacity "Dashboard: Failed to load. Retry" block. The **Retry**
  button re-renders the same broken tree and throws again immediately, so
  it's a dead end — this reads to a user like a quiet, permanent gap in the
  System tab rather than an obvious bug.

This is the kind of "rendering problem" the task description asked about,
even though it isn't lag — worth flagging as the headline finding.

**Fix applied** (`src/client/components/UserMetricsWidget.tsx`): pass the
same three arguments every other call site uses, sourcing `userState` via
the existing `getUserState()` export and adding `engineState.recognizedPatterns`
to the memo's dependency array:

```ts
const qieCohort = React.useMemo(
  () => classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? []),
  [engineState.signals, engineState.recognizedPatterns]
)
```

Verified against `tsc --noEmit` (no arity error remains for this file) and by
inspection against the three working call sites. Full esbuild/dev-server
verification wasn't possible in this sandbox (client deps not installed) —
flagged under Next Steps.

## 3. Fresh audit of the four known lag anti-patterns (no new fixes needed, but worth watching)

An Explore-agent pass over every widget added since PR #95 (RecipeWidget,
MonthlyPulseWidget, badge-engine widgets, QIE v99+ widgets, astrology, CUBIQ)
found no new render-phase store writes and no new unmemoized heavy work. Two
minor doctrine gaps, both low severity:

- **`QuantumRandomWidget.tsx:38-69`** — three `setInterval` polls (two 1s
  countdowns + a 10s pair-reveal) with no `document.hidden`/`isRouteActive`
  guard, unlike every sibling widget in the same file (`ChakraErgonomicsWidget`,
  `ContextualPromptsWidget`, `EvolutionMilestoneToast`, `SystemPulseWidget`
  all have this guard). Also calls `recordSignal(...)` on every countdown
  expiry — a store write that re-renders other `intentionEngine` subscribers
  while System is mounted. Since System fully unmounts when the in-app tab
  is inactive, the remaining exposure is a **backgrounded browser tab** while
  System stays the active in-app route: continuous ticking/re-rendering and a
  catch-up burst on refocus, not a foreground click-lag.
- **`MicroCalculatorWidget.tsx:71`** — same missing guard on a 10s interval,
  but the interval body is a cheap `Date` compare + `Set` lookup, so real-world
  impact is negligible; flagged only for consistency.
- **`IntentionPatterns.tsx:23-25`** — `Object.entries(patterns).filter().sort()`
  runs directly in the render body instead of `useMemo`. Dataset is bounded
  by the ~139 documented patterns, so cost is negligible today; would only
  matter if the pattern set grows substantially.

None of these three currently reproduce as a user-visible stall the way the
five fixed PRs did — they're consistency gaps against the codebase's own
established guard pattern, not confirmed regressions.

## 4. Next steps

1. **Deploy the `UserMetricsWidget` fix** and confirm in production that the
   CQGS Dashboard stack (Health/Performance/Version/Physiology/QOS,
   Correlated Indexes, System Progress, System Pulse) renders instead of the
   "Dashboard: Failed to load" fallback.
2. **Add `tsc --noEmit` to the build/CI gate** (or at minimum to the Benchmark
   pre-push check) — this is the second time in this repo's history a
   type-level bug (wrong arity / wrong arg) has shipped silently because the
   esbuild-only client pipeline doesn't type-check. A cheap, high-leverage
   guardrail.
3. Optionally gate `QuantumRandomWidget`'s intervals and `recordSignal` calls
   behind `document.hidden`/`isRouteActive`, matching sibling widgets — low
   urgency, do opportunistically.
4. If real "button feels slow" reports keep coming in *after* this fix ships,
   the next place to look is client-side profiling of the CQGS Dashboard
   mount cost now that it actually renders (it hasn't been measurable for a
   month since it was crashing before paint completed).
