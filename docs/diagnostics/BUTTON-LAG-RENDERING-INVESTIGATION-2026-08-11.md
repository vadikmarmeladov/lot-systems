<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering — Scheduled Investigation

**Trigger**: Scheduled routine, "investigate the buttons lagging issue and rendering problems"
**Date**: 2026-08-11
**Result**: No active/new regression found. Pattern is well-documented and the
last two fixes (Jul 28) closed the known instances. One residual risk flagged
below for a future pass.

---

## 1. Summary

"Button lag" is a recurring, named failure mode in this codebase, not a new
report. It has its own doctrine clause (`docs/benchmark/LOT-DOCTRINE.md` §
Async Signal Recording / Render Isolation) and at least five prior fix
sessions going back to June 2026. This investigation re-audited every current
call site of the two functions responsible for all previously-found
instances — `recordSignal()` and `analyzeIntentions()` — and found no
un-fixed occurrence of the pattern in the code currently on `master`
(HEAD `8ac3690`). The architecture has also moved from "patch every call
site" to a source-level fix, which is a durable improvement.

## 2. Root-cause pattern (confirmed across all prior incidents)

Two flavors of the same mistake, both in `src/client/stores/intentionEngine.ts`
consumers:

1. **Render-phase store writes.** A component ran `analyzeIntentions()`
   (writes the `intentionEngine` atom) inside `useMemo`. Because the write
   happens during render, it schedules re-renders in every subscriber
   *before* the browser can paint the current frame — the click appears to
   do nothing for a beat, then everything updates at once.
2. **Synchronous heavy work in the click handler.** `recordSignal()` used to
   do, inline, on the calling stack: `JSON.stringify` of up to 1000 signal
   objects to `localStorage`, plus — every 5th signal — a full run of
   `analyzeIntentions()` (a ~150-pattern scan, growing every QIE version).
   Both ran between the click and React's commit of the visual "pressed"
   state, so the button visibly waited before responding.

## 3. Fix history (chronological)

| Date | Session | Fix |
|---|---|---|
| 2026-06-03/04 | SR-20260604-01 | `EmotionalCheckIn.tsx` — deferred `recordSignal()` via `setTimeout(0)` so the biofield cascade animation isn't blocked. Doctrine clause "Async Signal Recording" added. |
| 2026-06-03 | LOT-WEEKLY-2026-W23 | `Button.tsx` — removed unnecessary store subscriptions; `Layout.tsx` — extracted `NavButton` with `React.memo`, cut nav re-renders 10→2 per tab switch. |
| 2026-06-22 | SR-20260622-01 | `MemoryWidget.tsx` — moved `recordSignal()` into `setTimeout(0)` after the `createMemory` call. |
| 2026-07-19 | (doctrine log, SR-20260719-01) | `System.tsx` — `analyzeIntentions()` + `recomputeAssembly()` moved from `useMemo` to `useEffect`, `useState`-seeded for identical first paint. |
| 2026-07-28 | `be3e8fa` | `MemoryWidget.tsx` — the *quantum state* memo (separate from the June fix) still ran `analyzeIntentions()` inside `useMemo`; moved to `useEffect`. `SystemProgressWidget.tsx` — `handleGenerateReport` ran `analyzeIntentions()` synchronously in the click handler; deferred one macrotask via `setTimeout(0)`. |
| 2026-07-28 | `9364aba` | `SignalStreamWidget.tsx` — unmemoized copy+sort of up to 1000 signals on every render; memoized on `engine.signals`. `UserMetricsWidget.tsx` — `getUserIndex()` / `classifyPhysiologicalCohort()` unmemoized every render; memoized before the early returns. Measured: 5 rapid System↔Log tab switches went from a heavy task per switch to a one-time ~118ms mount cost. |

The `be3e8fa` commit message references an agent-authored
`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` that no longer exists in
the tree (`git log --all` shows no history for that path — it was generated
and consumed within an agent session, not committed). This report is its
spiritual successor for the current pass.

## 4. What changed architecturally since the last fix

`recordSignal()` (`src/client/stores/intentionEngine.ts:199-253`) no longer
relies on every caller remembering to defer it. The expensive parts are now
deferred **inside the function itself**:

```
schedulePersist()                         // debounced 250ms, coalesces bursts
if (shouldAnalyze) deferHeavy(() => analyzeIntentions())   // off the interaction tick
```

This is a better fix than the earlier per-call-site `setTimeout` patches: new
widgets that call `recordSignal()` directly (and there are ~25 of them —
`IntentionsWidget`, `InterventionsWidget`, `RecipeWidget`,
`ChakraErgonomicsWidget`, `GoalJourneyWidget`, `CohortConnectWidget`,
`MicroGameWidget`, `NarrativeWidget`, `AwarenessDashboard`, `PlannerWidget`,
`EnergyCapacitor`, `ContextualPromptsWidget`, `MicroCalculatorWidget`,
`SelfCareMoments`, `JournalReflection`, `PatternInsightsWidget`, etc.) get the
non-blocking behavior for free, with no risk of a future contributor
forgetting the wrapper.

## 5. Current-state audit (this session)

Re-checked every call site of `recordSignal(` and `analyzeIntentions(` in
`src/client/components/*.tsx` (grep, ~50 matches once display-string false
positives in `About.tsx`/`SystemProgressWidget.tsx` comments are excluded):

- All direct `recordSignal()` callers rely on the now-deferred implementation
  — no remaining bare/blocking calls found.
- Remaining direct `analyzeIntentions()` calls are all inside `useEffect`
  (`System.tsx:268`, `MemoryWidget.tsx:274`) or explicit user-initiated
  slash-commands with a 5-minute cooldown (`Logs.tsx:3975` `/qos`,
  `SystemProgressWidget.tsx:1629` behind the `setTimeout(0)` deferral from
  `be3e8fa`) — none run in render phase or synchronously inside a plain
  button click handler.
- Reviewed every component touched since the last fix (`9364aba..HEAD`,
  `git log --stat`): mostly QIE pattern-name lookup-table additions
  (`PatternRecognitionWidget.tsx`, static object literals, no render-path
  risk) and the astrology feature (`b75f65b`, 2026-07-27). The astrology
  commit adds `recordAstrologySignal()` correctly inside a `useEffect`
  (after paint), matching doctrine — not a new instance of the bug.
- No open GitHub issues in `LOT-Systems/LOT-Computer` mention lag, rendering,
  or button responsiveness. One open PR (#93, calendar time-tracking +
  toast) is unrelated to this pattern.

**Conclusion: no un-fixed button-lag instance found in the current tree.**

## 6. Residual risk / next steps

Nothing found rises to "fix now," but two things are worth a closer look on
a future pass rather than being asserted clean here:

1. **`deferHeavy()` and `schedulePersist()` themselves weren't line-audited
   this pass** — only their call sites and the `recordSignal()` wiring were
   confirmed. Worth a quick read of their implementations to make sure
   `deferHeavy` genuinely yields to paint (e.g. `requestIdleCallback` /
   `setTimeout(0)`) rather than just wrapping in a Promise that still runs
   on a hot microtask queue.
2. **No regression test / perf harness guards this pattern.** All prior
   fixes were verified manually (headless-Chromium smoke tests, ad hoc
   timing) inside individual agent sessions and the results weren't kept as
   a repeatable check. Given this is the fourth+ time the same bug class has
   been reintroduced by new widgets over ~2 months, a lightweight lint rule
   or unit test (e.g. "no `analyzeIntentions(` / `getEnrichedPhysiologicalReport(`
   etc. call directly inside a function passed to `useMemo`, or directly
   inside an `onClick`") would catch the next instance before it needs a
   dedicated fix session.

## 7. References

- `docs/benchmark/LOT-DOCTRINE.md` — "Render Isolation" and "Async Signal
  Recording" clauses.
- `docs/benchmark/LOT-SR-20260604-01.md` — first documented instance
  (biofield button).
- `docs/benchmark/LOT-SR-20260622-01.md` — Memory button instance.
- `docs/benchmark/LOT-WEEKLY-2026-W23.md` — Button.tsx / NavButton fix.
- Commits `be3e8fa`, `9364aba` (2026-07-28) — most recent fixes.
- `src/client/stores/intentionEngine.ts:199-253` — current `recordSignal()`
  source-level defer implementation.
