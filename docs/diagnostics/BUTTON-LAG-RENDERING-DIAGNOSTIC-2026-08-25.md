<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering Diagnostic — 2026-08-25

Scheduled investigation into reports of button lag / rendering slowness. This
is a follow-up audit, not a first pass — two prior PRs (#94, #95, late July)
already fixed the same class of bug in several places. This pass checked
whether the pattern has resurfaced, since it did resurface once already
between #94 and #95.

## Summary

- No open GitHub issue and no new PR currently describes button lag — this
  was a proactive scan, not a response to a live report.
- The root cause class is well understood and documented in-repo: **heavy,
  unmemoized `intentionEngine` reads (or writes) executed during React
  render**, on widgets that re-render every time any store subscriber writes
  a signal. As the Quantum Intent Engine (QIE) has grown — 139 → 151
  patterns, 47 → 51 archetypes, 44 → 48 jobs, 178+ → 184+ dependency nodes,
  all in the last month — the per-render cost of any *unfixed* instance of
  this pattern keeps increasing, so previously-tolerable code can degrade
  into visible lag without anyone touching that file.
- **One live instance of the pattern was found and is documented below**
  (`QuantumEngineWidgets.tsx`, cohort view). It was introduced after the
  July 28 fix commits and was not covered by them.

## Prior fixes (context)

| Commit | Date | Fix |
|---|---|---|
| `bd9ef2a` | 2026-07-04 | Planner buttons froze: `playClickSound()` created a new `AudioContext()` per click; browsers cap live contexts, so the constructor eventually threw and killed the handler before state updated. Fixed by reusing one `AudioContext` + wrapping in try/catch. |
| `be3e8fa` | 2026-07-28 | Two "residual button-lag paths": `MemoryWidget` ran `analyzeIntentions()` (a store **write**) inside a render-phase `useMemo`, cascading re-renders to every `intentionEngine` subscriber on every new question. `SystemProgressWidget.handleGenerateReport` ran the same ~139-pattern scan synchronously inside the click handler, blocking the button until it finished. |
| `9364aba` | 2026-07-28 | `SignalStreamWidget` re-sorted up to 1000 signals every render; `UserMetricsWidget` re-ran `getUserIndex()` + `classifyPhysiologicalCohort()` every render. Both memoized on `engine.signals` / `engineState.signals`. Reproduced in a headless-Chromium harness (1000 signals + 500 logs): System↔Log tab switches dropped from "a heavy task per switch" to a one-time ~118ms mount cost. |

The house doctrine that came out of this (see comments in `System.tsx`,
`MemoryWidget.tsx`, `PatternRecognitionWidget.tsx`): **never write to a
nanostore atom during render**, and **never call an O(signals) /
O(patterns) engine function in a render body without memoizing it on a
stable dependency** (`engine.signals`, `engineState.signals.length`, etc.,
not on every re-render).

## New finding: `QuantumEngineWidgets.tsx` cohort view

`src/client/components/QuantumEngineWidgets.tsx:373-379`:

```tsx
{view === 'cohort' && (
  <>
    {(() => {
      const live = engineState.signals.length > 0
        ? classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
        : null
      ...
```

This calls `classifyPhysiologicalCohort()` — which filters the *entire*
`signals` array down to the last 24h, builds a `Set` of active pattern
names, and tallies per-source counts (`src/client/stores/intentionEngine.ts:4520`)
— directly in the render body, unmemoized, every time this component
re-renders while `view === 'cohort'`.

This is the exact anti-pattern `9364aba` already fixed once, in
`UserMetricsWidget`, for the same function. It was not caught then because
this call site didn't exist yet — it sits right next to a *correctly*
memoized call to the same function 170 lines earlier:

```tsx
// Live physiological cohort directive for cohort view
const cohortDirective = React.useMemo(() => {
  if (engineState.signals.length === 0) return null
  const result = classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
  return result?.directive ?? null
}, [engineState.signals.length, engineState.recognizedPatterns?.length])
```

The unmemoized `live` copy at line 375 duplicates this work just to read a
few extra fields (`energyBand`, `dominantModule`, `confidence`) that
`cohortDirective` throws away. **Practical impact:** any signal write from
anywhere in the app (a check-in, a journal autosave, the 30-min background
QOS monitor, another widget's `recordSignal()`) re-renders every
`intentionEngine` subscriber, including this one. If a user is sitting on
the System panel's cohort view when that happens, this component
re-scans the full signal history synchronously, on the main thread, before
paint — visible as the same "click, pause, then it happens" jank
`SystemProgressWidget` had before `be3e8fa`.

### Suggested fix

Memoize the `live` computation the same way `cohortDirective` already is,
keyed on `engineState.signals.length` / `engineState.recognizedPatterns?.length`
(not the whole objects, to avoid new-reference invalidation), and drop the
inline IIFE:

```tsx
const liveCohort = React.useMemo(() => {
  if (engineState.signals.length === 0) return null
  return classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
}, [engineState.signals.length, engineState.recognizedPatterns?.length])
```

Then reuse `liveCohort` in place of the inline `live` at line 373-409, and
consider dropping the separate `cohortDirective` memo in favor of
`liveCohort?.directive`, since they're computed from identical inputs.

Not applied in this pass — this diagnostic is documentation of a proactive
scan, not an authorized code change. Flagging for the next benchmark pass
to pick up.

## Other areas checked, no issue found

- `System.tsx`, `MemoryWidget.tsx`, `PatternRecognitionWidget.tsx`,
  `SignalStreamWidget.tsx`, `UserMetricsWidget.tsx`,
  `SystemProgressWidget.tsx`, `Logs.tsx` — all still follow the
  write-after-paint / memoize-on-stable-key doctrine from the July 28
  fixes; no regressions found in these files.
- `src/client/components/ui/Button.tsx` itself is lean: `secondary` (the
  default) has zero store subscriptions; `primary` and `secondary-rounded`
  each subscribe to exactly one atom (`theme`, `isMirrorOn`). Not a source
  of lag on its own — the lag consistently traces back to *parent widgets*
  re-rendering expensively, not the `Button` component.
- CSS: button styles are plain Tailwind utility classes + `transition-all` /
  `transition-[background-color]`, no heavy animations, no layout-thrashing
  transitions. Ruled out as a cause.

## Next steps

1. Apply the `liveCohort` memoization fix above (small, low-risk, matches
   the existing pattern in the same file).
2. Given this is the second time an engine function has escaped
   memoization after a fix was already landed elsewhere in the same file,
   consider a lightweight lint rule or a `README`/doctrine note in
   `src/client/stores/intentionEngine.ts` flagging `classifyPhysiologicalCohort`,
   `analyzeIntentions`, `getOptimalWidget`, and other O(signals)/O(patterns)
   exports as "render-unsafe unless memoized" — so new call sites get
   caught in review rather than by the next perf audit.
3. No profiling harness output was available for this pass (the
   headless-Chromium harness used in `9364aba` was run ad hoc and not
   committed). If lag reports continue, worth committing that harness under
   `scripts/` or `docs/diagnostics/` so future passes can reproduce numbers
   instead of reasoning from code inspection alone.
