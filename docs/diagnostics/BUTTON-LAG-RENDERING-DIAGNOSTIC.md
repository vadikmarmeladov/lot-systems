# Button Lag / Rendering Diagnostic — 2026-08-30

Scheduled investigation into button-lag and rendering-performance reports. No
open GitHub issues or PRs currently describe button lag (checked
`LOT-Systems/LOT-Computer` issues + PRs on 2026-08-30) — this is a proactive
code audit against the doctrine established by the last lag-fix series, to
catch regressions introduced since.

## Prior history (for context)

Button lag has been a recurring class of bug in this codebase, always the
same root cause: **`intentionEngine` is one shared nanostore that nearly
every widget subscribes to via `useStore(intentionEngine)`.** Any signal
write anywhere in the app re-renders every subscriber. Two failure modes
recur:

1. **Render-phase store writes.** Calling a function that writes the atom
   (`analyzeIntentions()`, `recordAstrologySignal()`, …) inside `useMemo`
   (evaluated synchronously during render) instead of `useEffect` (runs after
   paint) cascades a chain of synchronous re-renders across every subscriber
   before the browser can paint — visible as UI freeze on the triggering
   click.
2. **Unmemoized heavy reads.** Calling an O(signals)/O(patterns) function
   (`classifyPhysiologicalCohort()`, sorting/filtering `engineState.signals`)
   directly in the render body, so it reruns on *every* re-render the
   component receives — including ones caused by unrelated store writes,
   not just its own dependency changing.

Fix history (both merged, both green):

- `be3e8fa` / PR #94 — `MemoryWidget.tsx` (mode 1: `analyzeIntentions()` in
  `useMemo` → moved to `useEffect`) and `SystemProgressWidget.tsx` (mode 1
  variant: heavy sync work inside a click handler → deferred one macrotask).
- `9364aba` / PR #95 — `SignalStreamWidget.tsx` and `UserMetricsWidget.tsx`
  (mode 2: unmemoized sort/classify on every render → wrapped in `useMemo`
  keyed on `engineState.signals`).

Both were driven by `docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md`
(agent-authored at the time) — that file is no longer present in the repo
(never committed; this document supersedes it).

## Current finding: residual mode-2 instance in `QuantumEngineWidgets.tsx`

**File:** `src/client/components/QuantumEngineWidgets.tsx`, lines 373–379
(cohort view of the QIE widget).

```tsx
const engineState = useStore(intentionEngine)   // re-renders on EVERY signal write, line 165

...

const cohortDirective = React.useMemo(() => {    // correctly memoized, line 201
  if (engineState.signals.length === 0) return null
  const result = classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
  return result?.directive ?? null
}, [engineState.signals.length, engineState.recognizedPatterns?.length])

...

{view === 'cohort' && (
  <>
    {(() => {
      const live = engineState.signals.length > 0
        ? classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])  // line 375 — NOT memoized
        : null
      ...
```

`classifyPhysiologicalCohort()` is the exact same 9-archetype classifier
(`src/client/stores/intentionEngine.ts:4520`, filters the full signal array
to a 24h window, tallies source counts, scores against all archetypes) that
was the subject of the `UserMetricsWidget` fix in PR #95. Every other call
site in the codebase wraps it in `useMemo`/`useEffect`:

| Call site | Memoized? |
|---|---|
| `QuantumEngineWidgets.tsx:203` (`cohortDirective`) | ✅ `useMemo` |
| `QuantumEngineWidgets.tsx:375` (`live`, cohort-view render) | ❌ **inline in render body** |
| `SystemPulseWidget.tsx:64` (`cohortClassification`) | ✅ `useMemo` |
| `UserMetricsWidget.tsx:98` (`qieCohort`) | ✅ `useMemo` (this is the PR #95 fix) |
| `System.tsx:277` (`physiologicalCohort`) | ✅ `useMemo` |

Line 375 is a duplicate of the already-memoized `cohortDirective` computed
16 lines above it — same function, same three arguments, same store — just
recomputed a second time, unmemoized, purely to read `.archetype` /
`.energyBand` instead of `.directive`.

**Why it matters:** `git blame` puts this at `c867e4c2`, 2026-07-27 —
**one day before** the PR #94/#95 fix series (2026-07-28). It was never
covered by the diagnostic that drove those fixes, so it shipped as a
residual instance of the same bug class the very next day's fixes were
written to eliminate. Nothing has touched it since (`d7f076e`, 2026-08-04,
only added the adjacent `getCircadianPhase()` call at line 379, which is
cheap — a same-day `Date().getHours()` comparison — and not implicated).

**Impact:** every write to `intentionEngine` (check-ins, log entries, the
30-minute background QOS monitor, astrology signal sync, etc.) re-renders
`QuantumEngineWidgets`. While a user has the widget's `view` set to
`'cohort'`, each such re-render re-scans the full signal history
synchronously during render/commit — on accounts with large signal
histories (this project's own field-manual counters put long-running
accounts at 1000+ signals — the same scale that made the `SignalStreamWidget`
sort visible in PR #95's profiling) this is exactly the shape of main-thread
work that read as "button lag" in the prior incidents, just triggered by
*any* store write while the tab is open, not necessarily the click itself.

## Recommended fix

Memoize line 375 the same way `cohortDirective` already is — ideally by
reusing `cohortDirective`'s memo instead of recomputing:

```tsx
const liveCohort = React.useMemo(() => {
  if (engineState.signals.length === 0) return null
  return classifyPhysiologicalCohort(engineState.signals, getUserState(), engineState.recognizedPatterns ?? [])
}, [engineState.signals.length, engineState.recognizedPatterns?.length])
```

and reference `liveCohort` from both the `cohortDirective` memo and the
render body, removing the duplicate call entirely. Small, mechanical,
consistent with the PR #95 pattern — not applied here since this run is a
diagnostic pass, not a fix commit.

## What's not implicated

- `Button.tsx` / `GhostButton` (`src/client/components/ui/Button.tsx`) — no
  store subscriptions on the `secondary`/default path; `primary` and
  `secondary-rounded` variants each subscribe to a single narrow atom
  (`stores.theme`, `stores.isMirrorOn`) already scoped to avoid the
  shared-store cascade. Not a source of lag.
- `System.tsx`'s `analyzeIntentions()` / `recordAstrologySignal()` calls
  (lines 231, 268) — both correctly run inside `useEffect`, with an explicit
  doctrine comment at line 263–265 warning against the render-phase-write
  regression. Not implicated.
- AudioContext-per-click (the root cause of `bd9ef2a`, "Planner buttons
  frozen") — checked all five `new AudioContext(...)` call sites
  (`plannerWidget.ts`, `sound.ts`, `sovietGameSounds.ts`,
  `sovietKeyboard.ts`, `sovietChime.ts`); all use a module-level cached
  instance, none construct a fresh context per click.
- No open GitHub issues or PRs reference button lag, freezing, or rendering
  performance as of 2026-08-30. No profiling artifacts (Chrome traces,
  Lighthouse runs) are checked into the repo to cross-reference.

## Next steps

1. Apply the one-line memoization fix above and verify with the same
   headless-Chromium harness used for PR #95 (seed 1000+ signals, toggle
   `QuantumEngineWidgets` to the `cohort` view, fire signal writes, confirm
   no heavy task on unrelated re-renders).
2. Audit is static/read-only for this pass — no live profiling was run. If
   button lag is still reported by users after this fix, capture a Chrome
   Performance trace during the complaint (which tab, which view) and check
   it against this list of previously-fixed + newly-found instances first,
   since every confirmed incident so far has been the same
   `intentionEngine`-fan-out pattern.
3. Given how often this pattern recurs, consider a lint rule or code-review
   checklist item: any call to `analyzeIntentions`, `classifyPhysiologicalCohort`,
   or other O(signals) reads of `intentionEngine` state must be wrapped in
   `useMemo`/`useEffect`, never called bare in a render body or JSX
   expression — this is the fourth time this exact shape of bug has shipped.
