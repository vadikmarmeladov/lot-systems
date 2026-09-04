<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation Report

**Scope**: scheduled audit of button responsiveness and render performance across `src/client`
**Date**: September 4, 2026
**Status**: no reproducible lag found in current `master` (HEAD `98971f2`) — root causes from the July 2026 incident were fixed and merged; two low-risk residual patterns flagged below for future cleanup, not urgent.

---

## 1. Summary

This repo has a well-documented history of a real "button lag" problem — clicking a button visibly delayed its response — traced to two root causes: **nanostore atom writes happening during React's render phase**, and **heavy synchronous work running inside click handlers**. Both were diagnosed and fixed across five PRs between July 19 and July 28, 2026 (all merged to `master`). No new occurrences, complaints, or open issues reference button lag since. This audit re-derives the doctrine, verifies the fixes are intact on current `HEAD`, and flags two lower-severity patterns worth cleaning up next.

## 2. Root causes (from the historical incident)

### 2a. Render-phase store writes ("Render Isolation" violation)
`analyzeIntentions()` (in `src/client/stores/intentionEngine.ts`) both reads *and writes* the shared `intentionEngine` nanostore atom (a ~125–149-pattern scan). Several widgets called it from inside `React.useMemo(...)`, which runs **during** render. Because nanostores notifies subscribers synchronously on `.set()`, this cascaded a burst of synchronous re-renders across every other widget subscribed to the same atom — all before the browser could paint. On a page with ~7+ `intentionEngine`-subscriber widgets mounted at once, this is what read as a sluggish button.

- Fixed in `System.tsx` — [`b219cc3`](../../) "perf: unblock render pipeline — move quantum state writes out of useMemo" (moved to `useState` seed + `useEffect`).
- Fixed in `PatternRecognitionWidget.tsx` and `MemoryWidget.tsx` — PR [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) and PR [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94) (same pattern: seed via `useState`, run the write in `useEffect`).

### 2b. Synchronous heavy work inside click handlers
`SystemProgressWidget.tsx`'s `handleGenerateReport` ran `analyzeIntentions()` (full pattern scan on a cache miss) plus several report builders directly inside the `onClick` callback, blocking the click from visually responding until the whole build finished — "click, then a beat, then it happens."

- Fixed in PR [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94): the build is deferred one macrotask (`setTimeout(build, 0)`) so the button's own state change paints first.
- Fixed at the source in `intentionEngine.ts` (PR [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85)): `recordSignal()` used to `JSON.stringify` up to 1000 signals into `localStorage` **and** call `analyzeIntentions()` synchronously on every single signal. Replaced with `schedulePersist()` (coalesced, 250ms-debounced write) and `deferHeavy()` (uses `requestIdleCallback`, falls back to `setTimeout`).

### 2c. Off-tab background churn (secondary, compounding cause)
Several widgets polled or recomputed on fixed intervals (30s–2min) even while the user had navigated to a different in-app tab (`document.hidden` stays `false` when switching in-app tabs, since the browser tab itself is still visible) — `ChakraErgonomicsWidget`, `ContextualPromptsWidget`, `EvolutionMilestoneToast`, `SystemPulseWidget`, `SystemProgressWidget`'s assembly recompute. Each accumulated re-render load in the background until the main thread saturated, which surfaced as freezes when switching tabs and, more generally, as general lag under load.

- Fixed via a new `isRouteActive(route)` helper (`src/client/stores/router.ts`) checked inside each interval callback — PR [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85).
- Definitive fix: `System` (~7 subscriber widgets) now fully **unmounts** when its tab isn't active, instead of `display:none` — commit `b46f1ac` "perf: unmount System tab when inactive to end background churn".

## 3. Verification against current `HEAD`

Confirmed on `master` (`98971f2`) / this branch:
- `be3e8fae8e79...` (PR #94) and `9364aba` (PR #95) are both ancestors of `HEAD` — the fixes are live, not stranded on an unmerged branch.
- `System.tsx:266-271` — quantum state write correctly lives in `useEffect`, seeded via `useState`, with the doctrine comment intact.
- `MemoryWidget.tsx:267-278`, `PatternRecognitionWidget.tsx:58-78` — same pattern, intact.
- `SystemProgressWidget.tsx:1616-1633` — `handleGenerateReport` still defers via `setTimeout(build, 0)`.
- `intentionEngine.ts` — `schedulePersist()` / `deferHeavy()` still in place in `recordSignal()`.
- No commits or PRs since August 5, 2026 touch these files; no new GitHub issues or PRs mention "lag", "slow", "freeze", or "render" for buttons.

**Conclusion: the historical button-lag bug is fixed and has stayed fixed.** No reproduction was attempted in a live browser session as part of this audit (static/history review only) — see Next Steps if a live profiling pass is wanted.

## 4. Residual patterns worth cleaning up (low severity, not currently causing visible lag)

1. **`Logs.tsx:3975`** — the `/qos` inline trigger calls `analyzeIntentions()` synchronously inside a `useEffect` (fires when the user types the trigger word in the log textarea). It's in an effect, not render phase or a click handler, so it doesn't block paint the way the fixed cases did — but it's the same "cache-miss pattern scan on the interaction path" shape as the bug fixed in PR #94, just one step removed. Wrapping it in `deferHeavy()` (already exported from `intentionEngine.ts`) would make it consistent with the rest of the codebase's doctrine and remove any risk if this trigger path grows.
2. **`Button.tsx` `PrimaryBtn`** uses `transition-all` (`src/client/components/ui/Button.tsx:77`). `transition-all` animates every animatable property instead of the specific ones in use (`background-color`), which is marginally more expensive for the browser's style-invalidation pass. Not a measured problem today; only worth narrowing if a future profiling pass shows paint cost on buttons specifically.

## 5. Next steps if button lag is reported again

1. Reproduce with the React DevTools Profiler (record a click, look for a render burst across unrelated components — the signature of a render-phase store write) rather than guessing from code review alone.
2. Check `chrome://tracing` or the Performance tab for long tasks (>50ms) starting at `pointerdown`/`click` — heavy synchronous work in a handler shows up as one long "Task" blocking the next frame.
3. Grep for the two anti-patterns directly: a store-writing function (`analyzeIntentions()`, `recomputeAssembly()`, `recomputeChakras()`, etc.) called inside `useMemo(...)` or the render body (not `useEffect`/`useCallback`/interval), and any `onClick` handler that calls one of those functions without deferring via `setTimeout`/`requestIdleCallback`/`deferHeavy()`.
4. Confirm the widget in question isn't kept mounted (`display:none`) off its active tab — check whether it needs `unmountWhenInactive` on its `TabPanel`, per the `System` precedent.
5. No automated regression coverage exists for this class of bug (no Lighthouse CI, no React Profiler test, no long-task budget check in CI). If button lag recurs, consider adding a lightweight headless-Chromium smoke test that records a click and asserts no long task follows it, so future regressions are caught before merge rather than by user report.

## 6. References

- PR [#85](https://github.com/LOT-Systems/LOT-Computer/pull/85) — perf: pause System background work off-tab to fix tab-switch freeze
- PR [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) — perf: stop render-phase atom write + off-tab churn (tab-switch stall)
- PR [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94) — perf: fix two residual button-lag paths flagged by agent diagnostic
- PR [#95](https://github.com/LOT-Systems/LOT-Computer/pull/95) — perf: memoize last heavy per-render work in System subscriber widgets
- Commit `b219cc3` — perf: unblock render pipeline — move quantum state writes out of useMemo
- Commit `b46f1ac` — perf: unmount System tab when inactive to end background churn
