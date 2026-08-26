<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering Investigation — 2026-08-26

**Scope**: Scheduled review of button-lag / rendering-performance reports.
**Verdict**: No open issue. Root causes previously identified are fixed and
holding; no regressions found in the code added since the fix.

---

## 1. History

Button lag has been a recurring theme in this repo, worked in several
passes as it resurfaced in newly added widgets:

| Commit | Date | Fix |
|---|---|---|
| `863b333` | pre-Jul 26 | reduce widget lag — cap logs query and back off stats polling |
| `b219cc3` | pre-Jul 26 | unblock render pipeline — move quantum state writes out of `useMemo` |
| `ee88f4c` | pre-Jul 26 | pause System background work off-tab (tab-switch freeze) |
| `6e5007a` | pre-Jul 26 | stop render-phase atom write + off-tab churn (tab-switch stall) |
| `b46f1ac` | pre-Jul 26 | unmount System tab when inactive to end background churn |
| `be3e8fa` | 2026-07-28 | **MemoryWidget**: moved `analyzeIntentions()` (a store write) out of a `useMemo` into a post-paint `useEffect`. **SystemProgressWidget**: `handleGenerateReport` ran a ~139-pattern scan synchronously inside the click handler, blocking the click; deferred one macrotask. |
| `9364aba` | 2026-07-28 | **SignalStreamWidget**: memoized the up-to-1000-signal copy+sort on `engine.signals` instead of re-running every render. **UserMetricsWidget**: memoized `getUserIndex()` + `classifyPhysiologicalCohort()`. |

The common root cause across every pass: a heavy or store-mutating call
(`analyzeIntentions()`, sorting large signal arrays, cohort classification)
running either **in the render body**, **in a `useMemo` with a write side
effect**, or **synchronously inside a click handler** — instead of in a
post-paint `useEffect` or a memo keyed on a stable dependency.

`be3e8fa` and `9364aba` (2026-07-28, PRs #94/#95) were the last commits
touching this class of bug. No commit since has reverted or reintroduced
the pattern in those four files.

## 2. Current state (as of this run)

- **No open GitHub issues or PRs** reference button lag, rendering, or
  performance (`search_issues` for "button lag rendering" → 0 results;
  the one open PR, #93, is unrelated calendar/time-tracking work).
- **No commits since 2026-07-28** address lag/freeze/stall/render
  performance — the topic has gone quiet for ~4 weeks of active
  development (22 commits since, mostly QIE pattern/badge content drops).
- The `docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` referenced in
  `be3e8fa`'s commit message (agent-authored diagnostic that produced the
  fix) was never committed to the repo — it existed only in the authoring
  session. Recorded here for traceability; it is not recoverable from git
  history.

### Regression sweep

Diffed every file touched by the two July 28 fixes (`MemoryWidget.tsx`,
`SystemProgressWidget.tsx`, `SignalStreamWidget.tsx`,
`UserMetricsWidget.tsx`) against `HEAD`, plus every other component that
gained a new `analyzeIntentions()` call since
(`PatternRecognitionWidget.tsx`, `System.tsx`, `Logs.tsx`,
`QuantumEngineWidgets.tsx`):

- `SystemProgressWidget.tsx` (`handleGenerateReport`, line ~1621) — still
  correctly deferred one macrotask before calling `analyzeIntentions()`.
  The doctrine comment explaining the original "click, then a beat, then
  it happens" bug is intact.
- `PatternRecognitionWidget.tsx` (line ~78) — new `getOptimalWidget()` call
  is memoized on `patterns` (`engine.recognizedPatterns`), with an explicit
  comment citing the same render-phase-write hazard. Correctly guarded.
- `System.tsx` — new `getCircadianPhase()` calls (in `QuantumEngineWidgets.tsx`
  and `System.tsx`, both added after the July fixes) call directly in the
  render body without memoization, but `getCircadianPhase()` is pure
  `Date`-based arithmetic with no store read/write (`src/client/stores/
  intentionEngine.ts:5049`) — not a hazard of the same class. The new
  `recordAstrologySignal()` call is correctly gated: inside a `useEffect`,
  once per calendar day via a `localStorage` guard.
- `SignalStreamWidget.tsx` / `UserMetricsWidget.tsx` — untouched since the
  July 28 fix; memoization still in place.

No instance of the render-phase-write or synchronous-click-handler pattern
found in code added over the last month.

## 3. Suspected causes (for future recurrence)

Given the pattern above, if button lag reports resurface, check first:

1. A new widget calling `analyzeIntentions()`, `getOptimalWidget()`,
   `classifyPhysiologicalCohort()`, or another QIE store-writing function
   directly in the render body or in a `useMemo` without a stable-ref key.
2. A click handler that runs a QIE pattern scan (cooldown miss) or a large
   array sort/copy synchronously before updating state.
3. A widget that stays mounted off-tab and keeps re-rendering from
   `intentionEngine` writes it doesn't need (the doctrine established in
   `b46f1ac`/`ee88f4c`/`6e5007a`: unmount or gate on `stores.isRouteActive()`
   and `document.hidden`).

## 4. Next steps

- No code change needed this run — the last known root causes are fixed
  and no regression was found.
- If a user or profiling report of lag comes in, capture where (which tab,
  which button) and reproduce with the headless-Chromium harness pattern
  used in `9364aba` (seed 1000 signals + 500 logs, measure task duration
  on tab switch / click).
- Consider committing the agent-authored diagnostic doc at fix time going
  forward (as `be3e8fa` intended) so this class of investigation doesn't
  have to reconstruct it from commit messages.

---

*Generated by a scheduled investigation routine. No code changes made.*
