<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Scheduled Investigation (2026-08-27)

Automated follow-up on the recurring "buttons lagging" reports. This is a
history review + static-code audit, not a fresh profiling run — no
headless-Chromium repro was executed this pass.

## Status: no new regression found; one residual anti-drift risk flagged

## 1. History of this issue

The "button lag" symptom has been diagnosed and fixed in **four** prior
rounds, all following the same root-cause family: **render-phase writes to
the `intentionEngine` nanostore atom**, which cascade synchronous
re-renders across every subscribed widget before the browser can paint —
felt by the user as "I click, then a beat, then it responds."

| Date | PR | Fix |
|------|----|-----|
| 2026-07-19 | [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85) | `perf: pause System background work off-tab to fix tab-switch freeze` |
| 2026-07-19 | [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) | `perf: stop render-phase atom write + off-tab churn (tab-switch stall)` |
| 2026-07-28 | [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94) | `perf: fix two residual button-lag paths flagged by agent diagnostic` — `MemoryWidget` moved `analyzeIntentions()` out of a `useMemo` into a post-paint `useEffect`; `SystemProgressWidget.handleGenerateReport` deferred its heavy build one macrotask so the click paints before the ~139-pattern scan runs |
| 2026-07-28 | [#95](https://github.com/LOT-Systems/LOT-Computer/pull/95) | `perf: memoize last heavy per-render work in System subscriber widgets` — `SignalStreamWidget` (sort of up to 1000 signals) and `UserMetricsWidget` (`getUserIndex()` + `classifyPhysiologicalCohort()`) moved into `useMemo` keyed on `engine.signals`, cutting a rapid System↔Log tab switch from "heavy task per switch" to a one-time mount cost |

PR #94's commit message references an agent-authored
`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` — that file is no
longer present in the repo (its findings were applied and it wasn't kept
around), which is why this pass writes a fresh, dated one instead of
updating in place.

Earlier related fixes in the same family: `6e5007a` (`perf: stop
render-phase atom write + off-tab churn`), `b46f1ac` (`perf: unmount System
tab when inactive to end background churn`), `863b333` (`fix: reduce
widget lag — cap logs query and back off stats polling`), `b219cc3`
(`perf: unblock render pipeline — move quantum state writes out of
useMemo`).

## 2. What was checked this pass

- **GitHub issues/PRs**: no open issues match "button lag / rendering slow
  / freeze / unresponsive click." One open PR (#93, `feat(calendar): time
  tracking + military-grade due-event toast`, opened 2026-07-28) is
  unrelated and unmerged — not a rendering-perf PR.
- **Git history since the last fix** (2026-07-28 → today, 22 commits): all
  are wiki/badge/benchmark/assembly commits, no further `perf:` or
  lag-titled commits. No regression appears to have been reported or
  reintroduced since PR #94/#95 landed.
- **Static re-audit of the known anti-pattern** (`analyzeIntentions()` /
  `recomputeAssembly()` calls, and `useMemo` blocks that pair with store
  writes) across `src/client/components/`: the previously-fixed call sites
  (`System.tsx`, `MemoryWidget.tsx`, `SystemProgressWidget.tsx`,
  `PatternRecognitionWidget.tsx`) are still correctly isolated — writes
  happen in `useEffect` (post-paint) or are deferred with `setTimeout`,
  matching the documented doctrine.

## 3. Residual risk found (not yet a confirmed regression)

`src/client/components/QuantumEngineWidgets.tsx` was **not** touched by
any of the four fix rounds above (last edited 2026-07-05, before the
render-isolation doctrine was established). It contains the same shape of
unmemoized heavy read on every render, gated only by which sub-view is
active:

- `QuantumEngineWidgets.tsx:568-570` — the `qos-field` view calls
  `getQuantumOS()` directly in the render body (an IIFE, not `useMemo`).
  `getQuantumOS()` (`src/client/stores/intentionEngine.ts:5212`) filters
  the full signals array once for the 7-day window and then filters it
  again per-source across 10 sources (`allSources.map(src =>
  weekSignals.filter(...))`), plus a `.sort()` on the resulting map.
- `QuantumEngineWidgets.tsx:373-376` — the `cohort` view calls
  `classifyPhysiologicalCohort(...)` directly in render (also an IIFE),
  which filters signals to the last 24h and scores every entry in
  `PHYSIOLOGICAL_ARCHETYPES` with a `.sort()`.

Neither function **writes** to the store (both are pure reads over
`intentionEngine.get()`), so this is not the "render-phase atom write"
class of bug that caused the worst freezes. But because the calls are
plain function calls in the render body rather than `useMemo`-gated on a
stable dependency (the same pattern fixed in `SignalStreamWidget` and
`UserMetricsWidget` in PR #95), this widget re-does that
filter/sort/score work on **every** re-render it receives while the
`cohort` or `qos-field` view is showing — including re-renders triggered
by unrelated `intentionEngine` signal writes from other widgets. On an
account with a large `signals` history (the PR #95 fix was validated
against a 1000-signal seed), this is a plausible contributor to
intermittent button-lag reports if this widget happens to be mounted and
on one of these two views when a signal fires elsewhere in the app.

This is a **static-analysis finding, not a confirmed repro** — no
profiling was run this pass to measure actual cost at realistic signal
volumes.

## 4. Suggested next steps

1. Reproduce with the same headless-Chromium harness used for PR #95
   (seed ~1000 signals + 500 logs, mount `QuantumEngineWidgets` on the
   `cohort` and `qos-field` views, fire a background signal, measure the
   render cost) to confirm whether this is actually observable or just
   theoretically unmemoized-but-cheap.
2. If confirmed, apply the same fix shape as PR #95: wrap both IIFEs in
   `React.useMemo` keyed on `engineState.signals` (cohort) /
   `engineState.signals` + `engineState.recognizedPatterns` (qos-field),
   matching the pattern already used for `cohortDirective` a few lines
   above (`QuantumEngineWidgets.tsx:201`).
3. Consider committing the ad-hoc headless-Chromium perf harness used in
   PRs #94/#95 as a real script under `scripts/` so future button-lag
   passes don't have to reconstruct it from scratch each time — none of
   the prior fixes left a reusable harness in the repo.
4. No user-facing report or profiling data was available to this pass
   confirming buttons are *currently* lagging in production; if this
   task was triggered by a live user report, get the specific
   button/screen and device so the repro can be scoped precisely rather
   than re-auditing the whole store.
