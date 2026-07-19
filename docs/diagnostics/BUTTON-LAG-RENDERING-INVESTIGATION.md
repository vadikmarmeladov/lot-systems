<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering Investigation

**Date:** 2026-07-19
**Scope:** `src/client/` — button components, System-tab widgets, polling/query layer
**Trigger:** Scheduled investigation into reported button lag and rendering problems

## Summary

The team already fixed the major root causes of button/render lag in a burst of commits on
2026-07-18. That work is solid and verified. However, several widgets added or wired in that
same window (`88a5e67`, and pre-existing widgets never touched by the fix) reproduce the
**exact same anti-patterns** the 07-18 fixes eliminated elsewhere. Those are the most likely
source of any lag still being observed, and are documented below with file/line references.

## Root causes already fixed (2026-07-18)

| Commit | Fix | Root cause |
|---|---|---|
| [`b219cc3`](../../src/client/components/System.tsx) | `System.tsx` / `SystemProgressWidget.tsx` | `analyzeIntentions()` + `recomputeAssembly()` were called inside `useMemo`, which runs synchronously during React's render phase. Writing to nanostores atoms there cascaded **10 synchronous re-renders before the browser could paint** on every `logs` change. Moved to `useEffect` (post-paint) + eager `useState`. Also added a `document.hidden` guard to a 60s interval. |
| [`863b333`](../../src/client/queries.ts) | `queries.ts` / `routes/api.ts` | `GET /api/logs` had no `LIMIT` — long-term users with 30+ daily scheduled jobs could push 30k+ rows per call, starving the DB connection pool and causing a ~1-minute response delay on `IntentionsWidget` and other System-tab widgets. Added `LIMIT 500`, raised `useLogs` staleTime 30s→5min, and backed off all 7 stats-polling hooks from 30-60s to 120s with `refetchIntervalInBackground: false`. |
| [`e892ed4`](../../src/client/components/ui/Layout.tsx) | `Layout.tsx` (`NavButton`) | The active nav tab's solid fill was overpainted by the `grid-fill-hover::before` pseudo-element on hover (a Tailwind `!important` utility that was silently emitting no CSS at all), making the active button visually "deactivate" on hover. Replaced with a class confirmed present in compiled output. |
| [`bd9ef2a`](../../src/client/stores/plannerWidget.ts) (2026-07-04) | `plannerWidget.ts` | `playClickSound()` created a `new AudioContext()` on every button press. Browsers cap live `AudioContext` instances; once hit, the constructor throws and kills the click handler *before* `plannerWidget.set()` runs — the Planner widget's buttons went completely unresponsive. Fixed with one shared, reused `AudioContext` + a try/catch around the whole sound path. |
| [`1271cd3`](../../src/client/components/Logs.tsx) (2026-06-27) | `Logs.tsx`, `System.tsx`, `Sync.tsx`, `Settings.tsx` | Tab-switching lag: none of the four heavy tab components were wrapped in `React.memo`, so every route change fully re-rendered the active tab's whole component tree. Also fixed a sub-pixel label shift on hover by pre-promoting the `grid-fill-hover::before` GPU layer with `will-change: opacity`. |

No open GitHub issues or PRs currently describe button lag — this appears to be a
recently-and-actively-worked area with no unresolved external report.

## Findings: same patterns, not yet fixed, in newer/adjacent widgets

All verified directly against source (not just grepped).

### 1. Nanostore write during render (recurrence of the `b219cc3` bug, worse — no `useMemo` guard at all)

`recordSignal()` (`src/client/stores/intentionEngine.ts:166`) synchronously calls
`intentionEngine.set(...)`, the same nanostores atom write pattern that caused cascading
re-renders when called from `useMemo`. In the following widgets it's called **directly in the
render body**, guarded only by a `useRef` flag rather than `useEffect`:

- `src/client/components/GoalJourneyWidget.tsx:46-53` — `recordSignal('intentions', 'goals_viewed', ...)`, preceded by an unmemoized `.filter()` over `goals`.
- `src/client/components/CohortConnectWidget.tsx:44-53` — `recordSignal('mood', 'cohort_widget_viewed', ...)`.
- `src/client/components/ChakraErgonomicsWidget.tsx:56-65` — `recordSignal('selfcare', ...)`, preceded by a `.sort()` over `state.chakras` done directly in the render body.

Calling a store setter mid-render is a React anti-pattern independent of performance: it can
also trigger "Cannot update a component while rendering a different component" warnings and,
under React's concurrent/StrictMode double-invoke, could double-record the signal. **Fix:** move
each into a `useEffect(() => { ... }, [])` guarded the same way `hasRecordedRef` already guards
it — same shape as the `b219cc3` fix.

### 2. `setInterval` without a `document.hidden` guard (recurrence of the fixed-elsewhere pattern)

The 07-18 fix added `if (!document.hidden)` to `SystemProgressWidget`'s 60s interval and backed
off all `queries.ts` polling. These intervals were missed:

- `src/client/components/QuantumRandomWidget.tsx:38-54` — **two** independent 1000ms intervals (one per `useQuantumNumber()` call, lines 60-61), ticking every second with no visibility check, each calling `recordSignal` on countdown expiry (every 1-72s). In a background tab this is two live per-second timers plus periodic nanostore writes running indefinitely.
- `src/client/components/QuantumRandomWidget.tsx:64-69` — a third, 10s interval, same widget, no guard.
- `src/client/components/SystemPulseWidget.tsx:90-102` — 10s interval doing a real `fetch('/api/system/pulse')`. The inline comment even notes *"was 1s — reduced to prevent DB overload under traffic"* — the interval was already flagged as a DB-load risk once, but the `document.hidden` guard from the `863b333`/`b219cc3` fixes was never applied here.
- `src/client/components/ContextualPromptsWidget.tsx:24-29` — 15s interval, no guard (local state only, lower severity).
- `src/client/components/MicroCalculatorWidget.tsx:71` — 10s interval, no guard, cheap payload (minor).

### 3. Widgets not wrapped in `React.memo`

The `1271cd3` fix memoized the four top-level tab components (`Logs`, `System`, `Sync`,
`Settings`). It did not extend to the individual widgets `System.tsx` mounts internally —
`GoalJourneyWidget`, `CohortConnectWidget`, `MoodAnalytics`, `MicroCalculatorWidget`,
`PlannerWidget`, `ChakraErgonomicsWidget`, `QuantumRandomWidget`, `ContextualPromptsWidget`,
`SystemPulseWidget`, `MicroGameWidget` are all plain function components. Each is lazily mounted
via `LazyMount`, which helps initial load, but once mounted, any re-render of `System` (e.g. from
`stores.me`/`weather`/`theme` changes) re-renders all of them since none are memoized. Lower
severity than findings 1-2, but compounds with them.

### 4. Not a concern

`queries.ts` was re-audited end-to-end: every `/api/*` hook now has either a `staleTime`, an
explicit `refetchOnWindowFocus: false`, or `refetchIntervalInBackground: false` on its polling
interval. `MoodAnalytics.tsx`'s three `useMemo` blocks correctly memoize bounded (30-day)
computations — not a lag source. `CohortConnectWidget.tsx:93-107`'s unmemoized `.sort()` operates
on a small, bounded `matches` array — negligible.

## Suspected causes, ranked

1. **Nanostore writes in render body** (Finding 1) — most likely to visibly "lag" a button, since a write to `intentionEngine` fans out to every subscriber (including `System.tsx`'s `quantumState`), and it fires on first render of three separate widgets that can all be mounted simultaneously in the System tab.
2. **Unguarded per-second intervals** (Finding 2, `QuantumRandomWidget`) — two 1s timers is unlikely to single-handedly cause a stutter, but combined with the nanostore-write widgets above (all commonly visible on the same System-tab view) it adds continuous background work exactly where the 07-18 fixes were trying to eliminate it.
3. **Missing `React.memo` on widgets** (Finding 3) — amplifier, not a root cause on its own.

## Next steps

- Apply the `useEffect`-wrapping fix from `b219cc3` to `GoalJourneyWidget.tsx`, `CohortConnectWidget.tsx`, `ChakraErgonomicsWidget.tsx` (Finding 1).
- Add `document.hidden` guards to the four intervals in Finding 2, matching the guard already present in `SystemProgressWidget.tsx`.
- Wrap the widgets listed in Finding 3 in `React.memo`.
- No live user report or GitHub issue currently pins down *which* button specifically still lags — if a fresh report comes in, capture the exact tab/widget combination visible at the time, since Finding 1's three widgets only fire their store write once per mount and would be easy to miss without knowing which tab was open.
