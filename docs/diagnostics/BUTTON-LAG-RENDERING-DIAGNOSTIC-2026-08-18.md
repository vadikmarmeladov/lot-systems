<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Status Check

**Scope**: Scheduled investigation into button-lag and rendering-performance reports.
**Date**: August 18, 2026
**Result**: No new lag paths found. Prior fixes (PRs #94, #95) remain intact.

---

## 1. Prior Incidents (already fixed, for reference)

Two merged PRs previously addressed a confirmed "click, then a beat, then it
happens" button-lag pattern, root-caused as violations of what the codebase
calls **Render Isolation doctrine**: writing to a nanostores atom during the
render phase (inside `useMemo`) instead of after paint (inside `useEffect`),
which cascades synchronous re-renders across every subscriber of that store
before the browser can paint.

- **PR #94** — [`be3e8fa`](../../) `perf: fix two residual button-lag paths flagged by agent diagnostic` (2026-07-28)
  - `src/client/components/MemoryWidget.tsx`: `analyzeIntentions()` (a store
    write) ran inside `useMemo(..., [question?.id])`. Moved to `useEffect`
    with a `useState` seed for an identical first paint.
  - `src/client/components/SystemProgressWidget.tsx`: `handleGenerateReport`
    ran a ~139-pattern `analyzeIntentions()` scan synchronously inside the
    click handler, blocking the click response. Deferred via `setTimeout(build, 0)`
    so the button responds before the heavy work runs.
- **PR #95** — [`9364aba`](../../) `perf: memoize last heavy per-render work in System subscriber widgets` (2026-07-28)
  - `src/client/components/SignalStreamWidget.tsx`: was copying+sorting up to
    1000 signals on every render. Memoized on `engine.signals`.
  - `src/client/components/UserMetricsWidget.tsx`: ran `getUserIndex()` +
    `classifyPhysiologicalCohort()` unmemoized every render. Moved into
    `useMemo` keyed on `engineState.signals`.
  - Reported result: 5 rapid System↔Log tab switches dropped from "a heavy
    task per switch" to a one-time ~118ms System mount cost.

The diagnostic doc these PRs cite (`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md`,
agent-authored) is not present in the current tree — it was evidently a
working file consumed by the fix and not committed.

## 2. What this check looked for

1. **Recent commits/PRs/issues** referencing buttons or rendering — searched
   git log and GitHub issues/PRs. No open issues or PRs currently report
   button lag; the only matches are the closed PRs above.
2. **Regressions of the same anti-pattern** — grepped for every
   `analyzeIntentions()` call site and every `React.useMemo` body calling a
   store-writing function (`record*`, `recompute*`, `save*`, `persist*`,
   `write*`, `analyze*`) across `src/client/components/**/*.tsx`.
   - All `analyzeIntentions()` call sites are inside `useEffect` or a
     deferred click handler (`System.tsx:268`, `SystemProgressWidget.tsx:1555`
     on-mount effect, `SystemProgressWidget.tsx:1629` deferred build,
     `MemoryWidget.tsx:274` post-paint effect, `Logs.tsx:3975` command
     handler). None run inside `useMemo`/render phase.
   - Checked `recordAstrologySignal()` specifically, since it was introduced
     after the fixes (merge `73edd95`, System.tsx conflict resolution) and
     touches the same file as the original MemoryWidget bug. It's correctly
     isolated inside a `useEffect` gated by a once-per-day `localStorage`
     check (`System.tsx:226-239`) — follows doctrine, no regression.
3. **`Button.tsx` / `GhostButton` itself** — `src/client/components/ui/Button.tsx`.
   Already split into `PrimaryBtn` / `SecondaryRoundedBtn` subcomponents so
   each only subscribes to the one store it needs (`stores.theme` or
   `stores.isMirrorOn` respectively), keeping re-render scope narrow. No
   heavy work in the component itself.
4. **CSS-side causes** — `src/client/index.css` has 27 `transition` /
   `box-shadow` / `animation` declarations; none inspected show unbounded or
   layout-thrashing properties (e.g. animating `width`/`height`/`top` at
   high frequency). Not a focus area this pass — see Next Steps.

## 3. Suspected causes (historical, now mitigated)

- Store writes (nanostores atom updates) executed during React's render
  phase instead of after paint — the dominant root cause found previously.
- Expensive synchronous computation (large-array sort/filter, multi-hundred
  pattern classification scans) run directly inside `onClick` handlers or
  unmemoized render bodies, re-done on every render rather than only when
  inputs change.

Neither pattern was found newly introduced since the July 28 fixes.

## 4. Next steps / deeper investigation areas (not yet covered)

No active lag was found, so nothing here is urgent — listed for whoever
picks up the next perf pass:

- No headless-Chromium profiling run was done this pass (the prior fixes
  were verified with one). If a fresh user report of lag comes in, re-run
  that harness rather than trusting static analysis alone.
- CSS animation cost on `index.css` (27 transition/animation rules) has not
  been profiled for paint/layout cost — only checked for the obvious
  render-phase-write anti-pattern.
- The QIE pattern-engine expansions since July 28 (P143–P151, Arch48–51,
  J45–48, `QuantumEngineWidgets.tsx`, cosmic/circadian widgets) add more
  `intentionEngine` subscribers on the System tab. Each new subscriber is a
  candidate for the same class of bug going forward — worth a periodic grep
  for `useMemo` bodies calling store-writing functions as this engine grows.
- No user-facing lag reports or profiling data were available to review this
  pass (no open GitHub issues, no attached traces) — if the user has a
  specific screen/interaction that currently feels laggy, that's the fastest
  way to narrow this further.

---

*Generated by an automated scheduled investigation. No code changes made —
this is a status/documentation check only.*
