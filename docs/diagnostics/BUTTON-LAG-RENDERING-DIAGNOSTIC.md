<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation

Scheduled investigation, 2026-07-22. No open GitHub issue or PR currently
describes a live "buttons lagging" report — this is a proactive audit of the
render-performance history plus a scan for undiscovered instances of the
same root-cause class that was already found and partly fixed.

## 1. What was already found and fixed (last ~10 days)

The last three benchmark sessions (`LOT-SR-20260719-01`, and commits
`863b333`, `b219cc3`, `6e5007a`) already diagnosed and fixed a family of
render-fan-out bugs. Summary, newest first:

| Commit | Root cause | Fix |
|---|---|---|
| `6e5007a` (2026-07-19, latest on branch) | `PatternRecognitionWidget` called `getOptimalWidget()` → `analyzeIntentions()` → `intentionEngine.set()` **during render** (a store write in the render body), cascading re-renders across all ~7-9 permanently-mounted `System` widgets. Plus 3 widgets (`ChakraErgonomicsWidget` 2min, `ContextualPromptsWidget` 15s, `EvolutionMilestoneToast` 30s) kept ticking and writing state while the System tab was in the background. | Memoized the widget-selection call on `recognizedPatterns`; gated the three intervals on `isRouteActive('system')`. |
| `b219cc3` | `System.tsx` wrote a "quantum state" atom inside a `useMemo` (render phase). | Moved the write into a `useEffect` (post-paint). |
| `863b333` | `/api/logs` was fetched unbounded and re-polled every 30s; 7 separate stats queries polled every 30-60s — thundering-herd on both client render and the request pool. | Capped `GET /api/logs` at `LIMIT 500`; backed off `useLogs` staleTime to 5min and stats polling to 120s + `refetchIntervalInBackground: false`. |
| `bd9ef2a` (2026-07-04) | `PlannerWidget`'s click-sound handler created a **new `AudioContext()` on every button press**. Browsers cap live `AudioContext` instances; once the cap hit, the constructor threw mid-handler, killing `cycleValue`/`navigateCategory` before the state write — so the button visually did nothing (looked "frozen"). | Reuse one shared `AudioContext`; wrap the whole sound routine in try/catch so audio failures never block navigation. |

Root-cause pattern across all of these: `src/client/entries/app.tsx`'s
`TabPanel` keeps every visited tab mounted permanently (`display: contents`
vs `display: none`, gated by a `visitedRef`, not unmount/remount). Once the
System tab has been visited, all of its ~30+ widgets keep their `useEffect`
intervals and state alive even while hidden behind another tab. Any widget
that (a) fires a timer unconditionally, and/or (b) writes shared state
during React's render phase, causes the entire System subtree to
re-render — competing with the main thread for the frames a button click
handler needs, which reads as "buttons lag."

## 2. Suspected remaining instance of the same pattern (not yet fixed)

`QuantumRandomWidget` (`src/client/components/QuantumRandomWidget.tsx`,
mounted unconditionally near the top of `System.tsx:586`, inside the
always-visited System tab) still matches the exact pattern `6e5007a` fixed
for its siblings, but was not itself touched:

```tsx
// useQuantumNumber() — called TWICE per widget instance (a and b)
React.useEffect(() => {
  const iv = setInterval(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        ...
        setNumber(next)
        setCountdown(nextCountdown)
        recordSignal('calculator', 'quantum_random', { value: next, interval: nextCountdown })
        return nextCountdown
      }
      return prev - 1
    })
  }, 1000)
  return () => clearInterval(iv)
}, [])
```

- Two `setInterval(..., 1000)` timers run **every second, forever**, with
  no `document.hidden` or `isRouteActive('system')` guard (contrast with
  `SystemPulseWidget` and `SystemProgressWidget`, which both gate their
  intervals on exactly those two checks).
- Every tick calls `setState`, which re-renders `QuantumRandomWidget` and,
  depending on memoization boundaries in `System.tsx`, can ripple into the
  parent subtree.
- `recordSignal(...)` is called once per countdown cycle (every 1-72s) and
  ultimately touches `intentionEngine` — the same module whose render-phase
  write was the root cause in `6e5007a`.

Net effect: once a user visits the System tab, these two 1s timers never
stop, including while the tab is hidden behind Logs/Sync/Settings/etc.
This is the same "off-tab churn" class already fixed for
`ChakraErgonomicsWidget` / `ContextualPromptsWidget` / `EvolutionMilestoneToast`
— just not yet applied here.

**Suggested fix** (small, same shape as `6e5007a`): early-return inside the
interval callback when `document.hidden || !isRouteActive('system')`,
mirroring `SystemPulseWidget.tsx:97-98`.

## 3. Other timers audited, not suspected

Swept every `setInterval`/`setTimeout` under `src/client/components/`
(~25 files). Everything else either:
- already gates on `isRouteActive`/`document.hidden`
  (`SystemPulseWidget`, `SystemProgressWidget`, `TimeWidget` via
  `visibilitychange`, the three widgets fixed in `6e5007a`),
- only fires a one-shot `setTimeout` tied to a user action (toast
  auto-dismiss, sound-toggle debounce, export-status reset — all bounded,
  not recurring), or
- is gated on viewport visibility already (`MicroGameWidget`'s canvas loop
  checks `inViewport` before starting its interval).
- `MicroCalculatorWidget`'s 10s poll only calls `setState` when magic-time
  status actually changes (rare), not on every tick — low risk.

No other unconditional per-second (or faster) recurring `setState` was
found outside `QuantumRandomWidget`.

## 4. CSS hover path (`grid-fill-hover`)

Checked `.grid-fill-hover` (`src/client/index.css:102-158`), used by every
`Button`/`GhostButton` variant. It's a pure CSS `::before` opacity
transition (`will-change: opacity`, 180ms), not JS/mousemove-driven, so
it's not a per-click cost. `e892ed4` already fixed a related visual bug
(active nav tab losing its fill on hover); no lag mechanism found here.

## 5. Next steps

1. Apply the same `isRouteActive('system')` / `document.hidden` guard to
   `QuantumRandomWidget`'s two intervals (low-risk, same fix shape as
   `6e5007a`; can be verified with the existing green-gate build).
2. If button lag reports continue after that, the next place to look is
   input-latency profiling (Chrome Performance panel, "Interaction to Next
   Paint") on the System tab specifically, since that's where the vast
   majority of always-mounted widgets live — no profiling data or user
   reports were available in this repo to confirm real-world severity, this
   audit is static-analysis only.
3. No open GitHub issues or PRs currently track a live button-lag
   complaint — if one arrives, link it here.
