# Button Lag & Rendering — Diagnostic (2026-08-31)

**Session:** Automated scheduled investigation
**Branch:** `claude/brave-rubin-0465n5`
**Scope:** Recurring "button lag" history + current-state audit of `master` (`98971f2`, unchanged since 2026-08-05)

---

## 1. Summary

`master` has no reproduction of the classic "click, then a beat, then it happens" button-lag symptom — the last two fixes for that (PRs #94, #95, merged 2026-08-05) are intact and unregressed. However, this audit found a **live rendering bug** that the button-lag fix work itself introduced, plus several lower-severity instances of the same doctrine violation that caused every prior button-lag incident. These are new findings, not previously filed as issues or PRs.

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | `UserMetricsWidget.tsx` calls `classifyPhysiologicalCohort()` with 0 of 3 required args — throws on every render, crashes 4 widgets | **CRITICAL** | Live on master |
| 2 | 6 widgets call `recordSignal()` synchronously in the render body instead of `useEffect` | HIGH | Live on master |
| 3 | `QuantumEngineWidgets.tsx` runs unmemoized heavy scans in two render-body IIFEs | MEDIUM | Live on master |
| 4 | `CohortConnectWidget.tsx` sorts/maps in render body without `useMemo` | LOW | Live on master |
| — | PR #93 (calendar time-tracking) | — | Stale, merge-conflicted, but code itself follows doctrine correctly |

---

## 2. Historical pattern (why this keeps recurring)

Since June 2026 the codebase has fixed the *same* underlying bug shape at least eight separate times, under the informal "Render Isolation" / "Async Signal Recording" doctrine (`docs/wiki/LOT-WIKI-v55.md` clause 1; not yet promoted into `docs/assembly/LOT-DOCTRINE.md`, which is still an empty bootstrap file):

| Commit | Date | Root cause |
|---|---|---|
| `bd9ef2a` | — | Planner buttons frozen — AudioContext recreated per click |
| `863b333` | — | Logs query uncapped + stats polling too aggressive |
| `b219cc3` | — | `intentionEngine` writes running inside `useMemo` (render phase) |
| `ee88f4c` / `6e5007a` | Jul 19 | System tab background work not paused off-tab; render-phase atom write |
| `b46f1ac` | Jul 19 | System tab not unmounted when inactive — background churn continued |
| `be3e8fa` (PR #94) | Jul 28 | `MemoryWidget`: `analyzeIntentions()` (store write) inside `useMemo`; `SystemProgressWidget.handleGenerateReport`: ~139-pattern scan run synchronously inside the click handler, blocking the click |
| `9364aba` (PR #95) | Jul 28 | `SignalStreamWidget` sorted up to 1000 signals every render; `UserMetricsWidget` ran `getUserIndex()` + `classifyPhysiologicalCohort()` unmemoized every render |

**Root cause shape, every time:** a heavy computation (large-array sort/copy, the `analyzeIntentions` pattern scan, a cohort classification) or a store write (`recordSignal`, `analyzeIntentions`) runs either (a) inside a render-phase hook (`useMemo`/`useState` initializer) instead of `useEffect`, or (b) synchronously inside a click handler instead of deferred via `setTimeout`/microtask. Because `intentionEngine` is one global nanostore, a write from any widget re-renders every mounted subscriber — so the cost shows up as "buttons feel laggy" anywhere in the app, not just at the call site.

**Verified intact on current master:** `be3e8fa` and `9364aba`'s specific fixes are unregressed — `MemoryWidget.tsx:273` and `SystemProgressWidget.tsx:1621-1641` still defer correctly (see code comments there explaining the doctrine inline).

---

## 3. New finding — CRITICAL: `UserMetricsWidget.tsx` crashes on every render

```
src/client/components/UserMetricsWidget.tsx:97-98
const userIndex = React.useMemo(() => getUserIndex(), [engineState.signals])
const qieCohort = React.useMemo(() => classifyPhysiologicalCohort(), [engineState.signals])
```

`classifyPhysiologicalCohort` is declared with three required parameters, no defaults:

```
src/client/stores/intentionEngine.ts:4520-4524
export function classifyPhysiologicalCohort(
  signals: IntentionSignal[],
  userState: UserState,
  recognizedPatterns: IntentionPattern[]
): PhysiologicalCohortClassification {
```

and immediately does `signals.filter(...)` at line 4527. Called with zero arguments, `signals` is `undefined` and this throws a `TypeError` synchronously. Every other call site in the codebase passes all three args (`System.tsx:277`, `QuantumEngineWidgets.tsx:203,375`, `SystemPulseWidget.tsx:64`, `intentionEngine.ts:4708`) — this one was never updated.

The `useMemo` sits above the widget's early-return guards (lines 101/103), so it runs unconditionally on mount and every re-render. `System.tsx:1022-1031` wraps this widget together with `CorrelatedIndexesWidget`, `SystemProgressWidget`, and `SystemPulseWidget` in a single `<WidgetErrorBoundary name="Dashboard">` — so the throw takes down all four, replacing them with a "Dashboard: Failed to load. Retry" fallback every time the System tab mounts.

**Root cause is the fix itself:** `git log -p -L 90,99:src/client/components/UserMetricsWidget.tsx` shows this exact call was introduced by `9364aba` — the commit whose stated purpose was fixing System-tab button lag by memoizing this call. The memoization is correct; the argument list is not. This has been live on master, unnoticed, since 2026-07-28 (~5 weeks).

**Suggested fix:** pass the three required args, matching every other call site:
```ts
const qieCohort = React.useMemo(
  () => classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? []),
  [engineState.signals]
)
```
(also correct the two field reads at lines 259/269, which currently expect `.label`/`.dominant` — the real return type exposes `archetype`/`dominantModule`/`directive`/`confidence`.)

---

## 4. New finding — HIGH: render-phase `recordSignal()` writes in 6 widgets

None of these were touched by the `be3e8fa`/`b219cc3`/`6e5007a` fixes for the same pattern elsewhere. Each calls `recordSignal()` directly in the component body (guarded by a `useRef` "once" flag) rather than inside `useEffect`:

- `src/client/components/CohortConnectWidget.tsx:44-53`
- `src/client/components/MicroImageWidget.tsx:248-258`
- `src/client/components/InterventionsWidget.tsx:37-44`
- `src/client/components/GoalJourneyWidget.tsx:46-54`
- `src/client/components/ChakraErgonomicsWidget.tsx:62-72`
- `src/client/components/EnergyCapacitor.tsx:50-57`

Example (`InterventionsWidget.tsx:37-44`):
```tsx
if (!hasRecordedRef.current) {
  recordSignal('mood', `intervention_${intervention.severity}`, { ... })
  hasRecordedRef.current = true
}
```

All six widgets mount together on first System-tab visit, so up to 6 synchronous `intentionEngine.set()` writes fire mid-render-pass simultaneously. `recordSignal()`'s expensive parts (JSON persist, the `analyzeIntentions` scan) are already correctly deferred internally via `schedulePersist()`/`deferHeavy()` (`intentionEngine.ts:231-244`) — so this is not the severe "click blocks for 100ms+" class of bug — but the `intentionEngine.set()` call itself is still synchronous and still happens during render, not after paint, which is the specific thing the doctrine exists to prevent.

**Suggested fix:** move each call into a `useEffect` with the same ref-guard, matching the pattern already used correctly in `UserMetricsWidget.tsx:87-92` (`recordOSSignal` in `useEffect`) and `MemoryWidget.tsx:273` (`analyzeIntentions` in `useEffect`).

---

## 5. New finding — MEDIUM: unmemoized heavy scans in `QuantumEngineWidgets.tsx`

```
src/client/components/QuantumEngineWidgets.tsx:373-379  (cohort view)
const live = engineState.signals.length > 0
  ? classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
  : null
...
const circadianPhase = getCircadianPhase()

src/client/components/QuantumEngineWidgets.tsx:568-570  (qos-field view)
const qos = getQuantumOS()
const signalEntries = Object.entries(qos.signalMap).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1])
```

Both are inline IIFEs in JSX, not `useMemo`. `getQuantumOS()` runs 10 array-filter passes over up to 1000 signals (`intentionEngine.ts:5218-5225`) on every render while that view is active. This component subscribes to the entire `intentionEngine` store (`useStore(intentionEngine)`, line 165), so `recordSignal()` firing anywhere in the app re-renders it while mounted. Note a memoized `cohortDirective` (line 201) already computes a subset of the same result — the line-373 IIFE duplicates that work unmemoized.

---

## 6. New finding — LOW: `CohortConnectWidget.tsx:92-107`

```tsx
const topMatches = [...matches]
  .map((m) => { /* boost logic */ })
  .sort((a, b) => b.rankScore - a.rankScore)
  .slice(0, 5)
```
Not wrapped in `useMemo`; runs every render. Low severity — `matches` is a small server-paginated list, not signals/logs scale — but same missing-memoization shape as the historical `SignalStreamWidget` bug.

---

## 7. PR #93 — no anti-pattern reintroduced, but stale

[`feat(calendar): time tracking + military-grade due-event toast`](https://github.com/LOT-Systems/LOT-Computer/pull/93) — open since 2026-07-28, last updated 2026-08-05, now `mergeable_state: dirty` (conflicts with master, which has since gained 10+ commits).

Reviewed both changed components directly on the PR branch:
- `CalendarWidget.tsx`: `entries`/`upcomingEntries` correctly `useMemo`'d; `recordCalendarSignal()` fires inside the `createLog` mutation's `onSuccess` (post-commit, async) — correct pattern.
- `CalendarEventToast.tsx` (new): all logic inside `useEffect` + 30s `setInterval`, gated on `document.hidden || !isRouteActive('system')`; no render-phase writes, no unmemoized render-body scans.

Both files are clean. The PR itself needs conflict resolution before it can land — unrelated to rendering correctness.

---

## 8. Recommendations

1. **Fix `UserMetricsWidget.tsx:98` immediately** — this is a live, user-visible crash (4 widgets down on every System tab open), not a perf nit.
2. Move the 6 render-phase `recordSignal()` calls into `useEffect`, mirroring the already-correct pattern in the same files (`UserMetricsWidget.tsx:87-92`, `MemoryWidget.tsx:273`).
3. Wrap the two `QuantumEngineWidgets.tsx` IIFEs in `useMemo` keyed on `engineState.signals`.
4. Wrap `CohortConnectWidget.tsx:92-107` in `useMemo`.
5. Structural: this is the eighth time the same doctrine violation has been fixed piecemeal since June. Since the doctrine is well-understood but not encoded anywhere enforceable (`LOT-DOCTRINE.md`/`LOT-LEXICON.md` are still empty bootstrap files per PR #93), consider either (a) a small lint rule flagging calls to `recordSignal`/`analyzeIntentions`/other `intentionEngine` writers outside `useEffect`/event-handler-with-defer, or (b) a one-time full-repo grep-and-fix pass rather than continuing to catch instances one widget at a time as they're separately reported.

---

*Diagnostic compiled from git history (`master` @ `98971f2`), direct source review, and a targeted codebase audit for the four historical anti-pattern shapes.*
