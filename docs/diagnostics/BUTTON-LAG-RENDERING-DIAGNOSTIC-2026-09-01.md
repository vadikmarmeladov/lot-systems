# Button Lag / Rendering Diagnostic — 2026-09-01

Scheduled investigation into button-lag and rendering-performance reports.
Scope: git history review, current-codebase audit against the previously
established root-cause pattern, and identification of new/unfixed instances.

## 1. History — this has been diagnosed and fixed multiple times already

Six merged perf fixes between 2026-07-19 and 2026-07-28 all trace to the same
root cause: **`intentionEngine` is a single module-level store; any write to
it re-renders every mounted subscriber, and several System-tab widgets did
non-trivial unmemoized work per render.** With ~7-9 widgets permanently
mounted on the System tab, a store write anywhere fanned out into a
noticeable stall, and repeated writes (e.g. switching tabs, background
polling) compounded into the reported freeze.

| Commit | Fix |
|---|---|
| [`6e5007a`](https://github.com/LOT-Systems/LOT-Computer/commit/6e5007a4b5889967100b157116abba7cfdbc9521) | `perf: stop render-phase atom write + off-tab churn (tab-switch stall)` — `PatternRecognitionWidget` was writing to the store *during render*; gated three ungated System-only intervals on `isRouteActive('system')`. |
| [`b46f1ac`](https://github.com/LOT-Systems/LOT-Computer/commit/b46f1ac9550e5afdeb70f2e057be78096f92325e) | `perf: unmount System tab when inactive to end background churn` — System's subscriber widgets stayed mounted with `display:none`, so any `recordSignal` from *any* tab re-rendered them in the background. Added `unmountWhenInactive` on `TabPanel`. |
| `ee88f4c` | `perf: pause System background work off-tab to fix tab-switch freeze` |
| `b219cc3` | `perf: unblock render pipeline — move quantum state writes out of useMemo` |
| [`be3e8fa`](https://github.com/LOT-Systems/LOT-Computer/commit/be3e8fae8e799944bb35509d28ffd6b4e7c5c582) | `perf: fix two residual button-lag paths` — `MemoryWidget` ran `analyzeIntentions()` (a store write) inside a `useMemo`; `SystemProgressWidget`'s click handler ran it synchronously, blocking the button until a ~139-pattern scan finished. |
| [`9364aba`](https://github.com/LOT-Systems/LOT-Computer/commit/9364aba5d89615f7b2d03db0d42fa0cb2829478d) | `perf: memoize last heavy per-render work` — `SignalStreamWidget` re-sorted up to 1000 signals every render; `UserMetricsWidget` ran `getUserIndex()` + `classifyPhysiologicalCohort()` unmemoized every render. Both memoized on `engine.signals`. |

Note: `be3e8fa`'s message references a
`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` as the agent-authored
source of that fix. That file is **not present anywhere in git history**
(`git log --all -- '*BUTTON-LAG*'` is empty) — it was evidently produced and
consumed within a single agent session but never committed. This report
replaces it with a committed record.

No perf-labeled commits have landed since `9364aba` (2026-07-28), and there
are no open GitHub issues or PRs mentioning button lag, rendering, or perf as
of this run.

## 2. Current-state audit: the same anti-pattern has reappeared

The System tab has grown from the ~7-9 widgets in scope at the time of the
July fixes to **~24 widgets** as of this run (`System.tsx`, see the mount
list at lines 444-1061), many of them new `intentionEngine` subscribers
added by the recurring "self-assembly" / QIE cycles (`QuantumEngineWidgets`,
`QuantumStateWidget`, `QuantumRandomWidget`, `AIFeedbackWidget`,
`CorrelatedIndexesWidget`, `IntegrityWidget`, …). Each cycle adds widgets and
patterns without a perf pass, so the fan-out surface the July fixes were
built for keeps expanding. Two concrete unfixed instances found this run:

### a) `QuantumRandomWidget` writes to the store on an unthrottled, ungated timer

`src/client/components/QuantumRandomWidget.tsx:34-49`

```ts
const iv = setInterval(() => {
  setRemaining((prev) => {
    if (prev <= 1) {
      const next = quantumRandom(0, 99)
      const nextCountdown = pickCountdown()
      setNumber(next)
      setCountdown(nextCountdown)
      recordSignal('calculator', 'quantum_random', { value: next, interval: nextCountdown })
      return nextCountdown
    }
    return prev - 1
  })
}, 1000)
```

The widget mounts this timer twice (`const a = useQuantumNumber(); const b =
useQuantumNumber()`), so `recordSignal` — an `intentionEngine` write — fires
roughly every 1-72s per instance while the System tab is open, purely to
display a cosmetic random number. This is unrelated to any user action or
the widget's own functional purpose (unlike `MemoryWidget`/
`SystemProgressWidget`, which had a reason to write). Because it is mounted
on the System tab, this reproduces the exact "CPU fan-out" mechanism
`6e5007a` fixed — a periodic store write re-rendering every intentionEngine
subscriber on the tab — except this specific write serves no purpose and
isn't gated by `isRouteActive`/idle detection the way `ChakraErgonomicsWidget`,
`ContextualPromptsWidget`, and `EvolutionMilestoneToast` were fixed to be in
the same commit. It is currently *contained* (System fully unmounts off-tab
per `b46f1ac`, so it can't cause the cross-tab freeze), but while a user is
sitting on the System tab it injects a periodic re-render storm across ~15+
sibling widgets independent of anything the user did — a plausible source of
intermittent "button feels laggy" reports specific to that tab.

### b) `QuantumEngineWidgets` recomputes `classifyPhysiologicalCohort()` unmemoized in the render body

`src/client/components/QuantumEngineWidgets.tsx:373-379`

```tsx
{(() => {
  const live = engineState.signals.length > 0
    ? classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
    : null
  const archetype = cohortData?.archetype ?? live?.archetype
  const directive = cohortDirective ?? live?.directive
  const circadianPhase = getCircadianPhase()
  ...
```

`classifyPhysiologicalCohort` (`src/client/stores/intentionEngine.ts:4520`)
filters the full signals array, then scores every entry in
`PHYSIOLOGICAL_ARCHETYPES` (51 archetypes as of QIE v113) with a `Set`
lookup per archetype. This IIFE runs it a **second, unmemoized** time on every
render while `view === 'cohort'`, duplicating the already-memoized
`cohortDirective` computed three lines above it at line 201-203 with
effectively the same inputs. This is the identical class of bug fixed twice
already (`SignalStreamWidget`'s per-render sort, `UserMetricsWidget`'s
per-render cohort classification in `9364aba`) — reintroduced in a widget
added after that fix (comment trail dates this to the "v111 … Phase row in
System.tsx and QEW cohort view" cycle, ~2026-08-02).

## 3. Suspected causes, ranked

1. **Confirmed, current, unfixed:** (2a) and (2b) above — a cosmetic timer
   writing to the shared store, and a duplicated unmemoized classification
   call — both on the System tab, both matching the exact pattern the team
   has already fixed four separate times.
2. **Structural risk (not yet a proven incident):** the System tab's
   intentionEngine-subscriber surface has roughly tripled since the last
   perf pass, entirely through unreviewed additions from the recurring
   "self-assembly"/QIE content cycles. Each new widget in that cycle is a new
   opportunity to reintroduce a render-phase write or unmemoized per-render
   work, and nothing in the current process (see `docs/benchmark/*` session
   reports) includes a render-perf check as a gate.
3. **Not a cause:** CSS animations — none of the button/press styles found
   use expensive properties (no unbounded box-shadow/filter animations on
   click paths); the lag pattern in every prior fix was JS-side store
   fan-out, not paint cost.

## 4. Next steps

- Apply the same fix shape as `9364aba`/`b46f1ac` to the two instances above:
  gate or remove `QuantumRandomWidget`'s `recordSignal` call (it doesn't need
  to write to intentionEngine at all — it's a decorative widget), and drop
  the duplicate unmemoized `classifyPhysiologicalCohort()` call in
  `QuantumEngineWidgets.tsx` in favor of the existing `cohortDirective` memo.
- Re-run the headless-Chromium harness used in `9364aba`/`be3e8fa` (seeded
  with ~1000 signals, System tab open, 5 rapid interactions) to confirm
  before/after timing rather than reasoning from source alone.
- Since the fan-out surface is now ~24 widgets and growing every cycle,
  consider a standing check (lint rule or a short perf checklist in the
  `lot-benchmark` skill) that flags: store writes inside `useMemo`/render
  body, and `useMemo`/inline calls into `intentionEngine.ts` classification
  functions not keyed on the same dependency as an existing memo for that
  same value. That would catch this class of bug at the PR that introduces
  it rather than one full "self-assembly" cycle later.
- No open GitHub issue currently tracks button lag; if the user has a fresh,
  live report of lag *elsewhere* (not the System tab), that would need its
  own profile — everything found this run is specific to the System tab's
  intentionEngine fan-out.
