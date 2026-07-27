# Button Lag / Rendering Diagnostic

**Date:** 2026-07-27
**Scope:** Investigation of reported button-lag and rendering-performance issues.
**Trigger:** Scheduled investigation task (no new user report attached).

## Summary

No open GitHub issue or PR currently describes a *live* button-lag report. The
three most recent lag/freeze fixes (PRs #85, #87, #88, merged 2026-07-19) already
targeted this exact symptom class — "tab-switch stall," widget lag, and a
render-phase store write that cascaded re-renders across the System screen.
Since that merge (`add997e`, 8 days ago) there have been no further commits
touching rendering or interaction performance, and no new issues/PRs reference
buttons, lag, or freezes. The investigation below (a) confirms what was already
fixed, and (b) flags one residual architectural pattern that can still produce
button-click jank going forward, even though it wasn't the subject of the July
19 fixes.

## What was already found and fixed (2026-07-18 → 2026-07-19)

| PR | Commit | Root cause | Fix |
|----|--------|------------|-----|
| [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85) | `ee88f4c` | Every visited tab stays mounted (`display:none`); `document.hidden` doesn't go true on in-app tab switches, so background work (60s `recomputeAssembly`, 10s pulse poll, synchronous `localStorage` persist + 125-pattern `analyzeIntentions` scan on every signal) kept running full-tilt regardless of the visible tab. | Added `stores.isRouteActive(route)` gate; deferred `recordSignal`'s expensive persist (coalesced write) and analysis (`requestIdleCallback`) off the interaction tick — see `src/client/stores/intentionEngine.ts:167-244`. |
| [#87](https://github.com/LOT-Systems/LOT-Computer/pull/87) | `d922509` | `SystemProgressWidget` was mounted twice (stray instance + the intended grouped one), doubling its mount effects and 60s interval. | Removed the duplicate mount. |
| [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) | `6e5007a` | `PatternRecognitionWidget.getOptimalWidget()` called `analyzeIntentions()` → `intentionEngine.set()` **during render**, so a store write fired on every render, which re-rendered all ~7–9 permanently-mounted System subscriber widgets, several doing un-memoized work — a self-sustaining cascade that got worse over consecutive tab switches. | Memoized on `recognizedPatterns`; fixed a `useMemo` dependency that was the whole `engine` object (new reference every signal) instead of the actual fields used, so it stopped re-parsing `localStorage` every signal. Also gated three previously-ungated System-only intervals on `isRouteActive('system')`. |

Also in the same window, [`e892ed4`](https://github.com/LOT-Systems/LOT-Computer/commit/e892ed41af5ea0d5d7d35daf1675411e5e7c16e1)
fixed a visual bug on the active nav button (hover repainted its solid fill via
a dead `!important` guard that this Tailwind build never emits) — cosmetic,
not a perf issue, but it's the closest prior work to "buttons" specifically
rather than widgets.

**Current state:** all of the above is merged to `master`. `git log` shows no
commits since `add997e` (2026-07-19) touching `System.tsx`,
`SystemProgressWidget.tsx`, `intentionEngine.ts`, or `ui/Button.tsx` /
`ui/Layout.tsx`.

## Residual risk (not yet a confirmed live bug — flagged for next investigation)

The System screen's widget tree (`src/client/components/System.tsx`) mounts
40+ widgets, a large fraction of which read from the shared `intentionEngine`
nanostore (`WIDGET_DEPENDENCY_MAP` in `intentionEngine.ts` documents 100+
dependency nodes). `recordSignal()` — called from many user actions across
the app (journal entries, goal updates, recipe views, badge unlocks, etc., not
only System-tab widgets) — still does a synchronous `intentionEngine.set()` on
every call (`intentionEngine.ts:227-230`). That store write is what triggers
the re-render fan-out described in PR #88; the July 19 fixes removed the
worst offender (a write happening *during* render) and gated a few intervals,
but they did not change the fact that **any button whose handler calls
`recordSignal` still re-renders every mounted `intentionEngine` subscriber**,
System-tab-gated or not, if the user is on the System tab. If a future widget
is added to that subscriber set without memoizing its expensive work (the
same mistake `PatternRecognitionWidget` made), the cascade returns under a
different component name.

Secondary, lower-confidence observations, worth a closer look only if lag
resurfaces:
- `startBackgroundQOSMonitor` (`intentionEngine.ts:4213-4229`) runs a
  module-level `setInterval` (not React-lifecycle-gated, not routed through
  `isRouteActive`) every `QOS_INTERVAL_MS` that calls `analyzeIntentions()` —
  low frequency (30 min), so unlikely to be a primary cause, but it is the one
  remaining interval in this store that isn't tab-gated.
- `Button.tsx`'s `primary` variant uses Tailwind's `transition-all`
  (`src/client/components/ui/Button.tsx:77`), which is broader than necessary
  (transitions every animatable property instead of just
  `background-color`/`border-color`). Not expected to be perceptible on its
  own; only worth trimming if profiling shows repaint cost on that button.

## What would confirm or rule this out

No profiling data, Sentry/analytics traces, or user-submitted repro steps were
found attached to this task or in the repo. To move from "residual risk" to
"confirmed cause," the next session should:
1. Get a concrete repro (which button, which screen, cold vs. warm session,
   how long the session had been open) — the July 19 fixes were specifically
   about *cumulative* lag over a session, so time-since-load matters.
2. Record a Chrome Performance trace on a click that feels laggy and check
   whether the long task is inside an `intentionEngine` subscriber's render
   (same signature as the fixed bug) or elsewhere.
3. Check whether the issue is isolated to the System tab (where the fixed
   widgets live) or general (other tabs/screens), since the July 19 fixes
   were System-tab-scoped.

## Conclusion

The known, previously-reported button/widget lag has fixes merged and shipped
(PRs #85/#87/#88, 2026-07-19). No new lag reports, issues, or profiling data
exist to investigate beyond that. The main forward-looking risk is
architectural: the `intentionEngine` store's broad subscriber fan-out means
new widgets or new `recordSignal` call sites can reintroduce the same class of
jank unless they memoize their derived work, as `PatternRecognitionWidget`
originally failed to do.
