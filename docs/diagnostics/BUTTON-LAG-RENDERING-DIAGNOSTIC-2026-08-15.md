# Button Lag / Rendering Diagnostic — 2026-08-15

Scheduled investigation into the recurring "buttons lagging" report. This
follows the same doctrine violation previously fixed in `be3e8fa` and
`9364aba` (2026-07-28) — see `docs/benchmark/LOT-DOCTRINE.md` §Render
Isolation — but confirms it has resurfaced in six additional widgets that
were not covered by those fixes.

## Prior history (context)

The codebase has an established "Render Isolation" doctrine: work that
*writes* to a nanostores atom must not run during a component's render
phase (directly in the render body, or inside `useMemo`), because the
write synchronously notifies every other subscriber of that store —
cascading re-renders across the whole `intentionEngine` subscriber tree
before the browser can paint. That cascade is what shows up to a user as
"I clicked and it lagged."

At least 8 prior commits have fixed instances of this and its sibling bug
(heavy synchronous work in click handlers): `863b333`, `b219cc3`,
`ee88f4c`, `6e5007a`, `b46f1ac`, `f4ca5a3`... most recently `be3e8fa`
("fix two residual button-lag paths") and `9364aba` ("memoize last heavy
per-render work"), both landed 2026-07-28 via PR #94. No open GitHub
issues or PRs currently reference button lag, and nothing in
`LOT-MANIFEST.md` flags it as outstanding — this investigation was a fresh
code scan, not a response to a filed report.

## New findings (verified against current source)

### 1. Render-body `recordSignal()` writes — the exact `be3e8fa` bug, unfixed in 6 widgets

`recordSignal()` (`src/client/stores/intentionEngine.ts:199`) is an
**unconditional** `intentionEngine.set(...)` — no cooldown, unlike
`analyzeIntentions()`. In six widgets it is called directly in the render
body, gated only by a `useRef` "once per mount" flag — which prevents
re-firing on every render, but does **not** move the write out of the
render phase on the mount render itself:

- `src/client/components/InterventionsWidget.tsx:37-44`
- `src/client/components/GoalJourneyWidget.tsx:46-54`
- `src/client/components/CohortConnectWidget.tsx:44-53`
- `src/client/components/MicroImageWidget.tsx:248-258`
- `src/client/components/EnergyCapacitor.tsx:50-57`
- `src/client/components/ChakraErgonomicsWidget.tsx:62-72` (also sorts
  `state.chakras` inline before the write)

Example (`InterventionsWidget.tsx:36-44`):

```tsx
// Record intervention signal once per mount
if (!hasRecordedRef.current) {
  recordSignal('mood', `intervention_${intervention.severity}`, {
    type: intervention.type,
    severity: intervention.severity,
    hour: new Date().getHours()
  })
  hasRecordedRef.current = true
}
```

This runs during render, synchronously notifying every other
`intentionEngine` subscriber (SignalStreamWidget, QuantumStateWidget,
SystemPulseWidget, AIFeedbackWidget, PatternRecognitionWidget,
UserMetricsWidget, QuantumEngineWidgets) mid-render, before paint — on
whatever tab-load or interaction first mounts any of these six widgets.
The `be3e8fa` fix for `MemoryWidget.tsx` established the correct pattern
(seed state with `useState`, move the write into `useEffect`); none of
these six followed it.

### 2. Unmemoized heavy work on `signals` in `QuantumEngineWidgets.tsx` — parallel to the `9364aba` bug

- **Line 375**: `classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])` runs unmemoized inside a JSX IIFE (cohort view). This is the same expensive call `9364aba` had to memoize in `UserMetricsWidget` — and it's already memoized once at lines 201-205 in this same file as `cohortDirective`, but this second call re-runs unmemoized on every render while the cohort view is active.
- **Lines 355-358**: `engineState.signals.filter(s => s.signal === 'full_stack_session' && ...)` runs inline in JSX, unmemoized, re-scanning up to ~1000 signals on every render — and this component subscribes to the whole `intentionEngine` via `useStore`, so it re-renders on *every* write anywhere in the app, not just its own.

### Checked and confirmed clean

- `SignalStreamWidget.tsx`, `UserMetricsWidget.tsx`, `MemoryWidget.tsx`,
  `SystemProgressWidget.tsx` — the `be3e8fa`/`9364aba` fixes hold, no
  regression.
- `PatternRecognitionWidget.tsx` — calls `analyzeIntentions()` inside a
  `useMemo`, but that function has a 5-minute cooldown making repeat calls
  a cheap no-write read in practice; not a live bug.
- No unmemoized `onClick` handlers doing heavy synchronous work without
  `setTimeout` deferral were found outside the already-fixed
  `SystemProgressWidget` report generator.
- `React.memo` is absent from all `intentionEngine` subscriber widgets,
  but per the codebase's own precedent this isn't the applicable fix —
  `useStore()` re-renders on store change regardless of props. The fix is
  the same one already used elsewhere: move the write to `useEffect`,
  wrap the derivation in `useMemo`.

## Suspected user-facing symptom

Any session where a tab first mounts one of the six affected widgets (most
notably `InterventionsWidget` and `GoalJourneyWidget`, which render
commonly on the primary tab) will take a synchronous re-render hit across
every other mounted `intentionEngine` subscriber at that moment — this is
the most likely source of ongoing "click, then a beat, then it happens"
reports, since the underlying mechanism is identical to the one already
diagnosed and fixed twice this cycle.

## Next steps

1. Apply the established `MemoryWidget.tsx` fix pattern (seed via
   `useState`, move the `recordSignal()` call into `useEffect`) to the six
   widgets listed under Finding 1.
2. Wrap the two unmemoized derivations in `QuantumEngineWidgets.tsx`
   (Finding 2) in `useMemo` keyed on `engineState.signals`, matching the
   `UserMetricsWidget` fix.
3. Given how often this class of bug has resurfaced (8+ fix commits to
   date, always in widgets outside the most recently touched set), it may
   be worth a lint rule or a one-time codemod pass that flags any
   store-writing function called outside `useEffect`/event
   handlers/`useCallback`, rather than continuing to fix instances
   piecemeal as they're found.

No profiling/APM data or user-reported error logs were available for this
investigation — findings are based on static analysis of the current
source against the documented doctrine and prior fix commits.
