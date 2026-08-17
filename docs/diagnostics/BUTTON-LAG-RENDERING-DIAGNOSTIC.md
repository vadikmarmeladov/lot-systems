# Button Lag & Rendering Diagnostic

**Date:** 2026-08-17
**Scope:** Investigation of button-lag / rendering-freeze reports across `src/client/components`, triggered as a scheduled repo health check. No open GitHub issue or PR currently tracks this — this doc is the first committed write-up of the pattern (an earlier session referenced a file at this same path in commit `be3e8fa`, but never actually committed it; this doc fills that gap and supersedes that reference).

## Summary

There is no active regression today — the last two merged perf PRs (#94, #95, both 2026-07-28) closed out the reported lag. But the underlying root cause has recurred **four times** across three different widgets since mid-July, and a **narrower instance of the same bug is still present** in `PatternRecognitionWidget.tsx`. This doc documents the pattern so it stops recurring, and flags the one residual instance found.

## Root cause pattern (confirmed across all prior fixes)

Every button-lag / tab-freeze fix in this repo's history traces to the same architectural issue: **calling a store-writing function during React's render phase** instead of in an event handler or a post-paint `useEffect`.

The repeat offender is `analyzeIntentions()` in `src/client/stores/intentionEngine.ts:258`. On a cache miss (>5 min since `state.lastAnalysis`, a single global cooldown) it runs a synchronous ~139-pattern scan over the signal history and then writes `recognizedPatterns` + `lastAnalysis` back into the shared `intentionEngine` nanostore (`intentionEngine.ts:3186`). Because ~10+ widgets across `System.tsx` subscribe to that store, any write during render triggers a cascading re-render of all of them — and if the write happens synchronously inside a click handler, the button visibly doesn't respond until the scan finishes ("click, then a beat, then it happens").

`getOptimalWidget()` (`intentionEngine.ts:3666`) and `shouldShowWidget()` both call `analyzeIntentions()` internally, which makes them just as dangerous to call from render as calling it directly — that indirection is what let this slip past review more than once.

### Timeline of fixes for this same root cause

| Commit | Date | Widget(s) | What broke |
|---|---|---|---|
| `b219cc3` | 2026-07-19 | System.tsx | `analyzeIntentions()`-derived state written inside `useMemo` during render — "unblock render pipeline" |
| `6e5007a` | 2026-07-19 | System.tsx, **PatternRecognitionWidget.tsx** | Same class, different call site — "stop render-phase atom write + off-tab churn (tab-switch stall)" |
| `9364aba` | 2026-07-28 | SignalStreamWidget, UserMetricsWidget | Not a store write, but unmemoized heavy per-render work (sort of up to 1000 signals; cohort classification) on every `intentionEngine` write |
| `be3e8fa` | 2026-07-28 | MemoryWidget, SystemProgressWidget | Same root cause as `6e5007a`, but the earlier fix (re-key a `useMemo`) turned out to be **insufficient** — a `useMemo` still executes during render. This commit moved both widgets to `useEffect` (post-paint) + a `useState` seed for the first render, and deferred `SystemProgressWidget`'s click-triggered report build with `setTimeout(build, 0)` so the click responds before the scan runs. |

The pattern across this timeline: `useMemo` was tried first as the fix (`6e5007a`), then found to still be render-phase and replaced with `useEffect` (`be3e8fa`). That correction was applied to `MemoryWidget` and `SystemProgressWidget` — but **not back-ported to `PatternRecognitionWidget.tsx`**, which `6e5007a` had touched with the same (now-superseded) `useMemo` approach.

## Residual finding: `PatternRecognitionWidget.tsx:78`

```tsx
// src/client/components/PatternRecognitionWidget.tsx:72-78
const patterns = engine.recognizedPatterns
// getOptimalWidget() calls analyzeIntentions(), which WRITES the
// intentionEngine atom — calling it in the render body meant a store write
// during render on every re-render, cascading re-renders across all
// subscribers. Memoize on the already-analyzed patterns so it does not
// re-run (and cannot write) on every signal.
const optimal = React.useMemo(() => getOptimalWidget(), [patterns])
```

This is the `6e5007a` (2026-07-19) fix, still in place. It is a real improvement over calling `getOptimalWidget()` unmemoized in the render body, but it does not fully close the bug: `useMemo`'s factory still runs synchronously during render whenever its dependency (`patterns`, i.e. `engine.recognizedPatterns`) changes reference. In practice this is now low-frequency (the write only fires on an actual cache-miss, gated by the same global 5-minute cooldown that protects other call sites — so most re-renders hit the cheap early-return path in `analyzeIntentions()`), but on a genuine cache miss — e.g. this widget mounting after the app has been idle for 5+ minutes — it still performs a render-phase store write, the same class of bug that caused the visible cascades fixed in `be3e8fa`.

**Recommended fix**, matching the pattern already applied to `MemoryWidget.tsx` and `SystemProgressWidget.tsx`: seed `optimal` from a cheap read in `useState`, then recompute it in a `useEffect` keyed on `patterns` (post-paint, not render-phase).

Not applied in this pass — this diagnostic is documentation-only per the scheduled task's scope. Flagging for the next implementation session.

## Areas checked and found clean

- **`Button.tsx`** (`src/client/components/ui/Button.tsx`) — already well-isolated: `kind="primary"` and `kind="secondary-rounded"` are split into separate components (`PrimaryBtn`, `SecondaryRoundedBtn`) so each only subscribes to the one store it actually needs (`theme`, `isMirrorOn` respectively); plain `secondary` buttons (the majority) have no store subscription at all. No lag source here.
- **`.grid-fill-hover` CSS** (`src/client/index.css:102`) — the hover-fill effect used by most buttons is an `opacity` transition on a `::before` pseudo-element background-image; GPU-cheap, not a plausible source of perceived lag.
- **`SystemProgressWidget.handleGenerateReport`** (`SystemProgressWidget.tsx:1621`) — correctly defers the `analyzeIntentions()` + report-build work one macrotask via `setTimeout(build, 0)`, matching the `be3e8fa` fix; the click responds immediately.
- **New astrology re-tick timer** added to `System.tsx` since the last perf pass (part of the unrelated QIE v113 work) — a 15-minute `setInterval` guarded by `if (!document.hidden)`, following the established "pause background work off-tab" doctrine from `ee88f4c`/`b46f1ac`. Not a lag source.
- **`Logs.tsx`** slash-trigger detection (`detectNewTriggers`, ~line 3935) that can call `analyzeIntentions()` on a `/qos-report` trigger — runs inside a `useEffect`, not render body or a click handler, so it's off the paint-blocking path.

## No open GitHub issue/PR

Searched issues (0 open) and PRs (title/body match on "button lag", "render", "freeze", "stall") in `LOT-Systems/LOT-Computer` — the four merged PRs above (#85, #88, #94, #95) are the only history; nothing is currently open or reopened.

## Next steps

1. Apply the `useEffect` + `useState`-seed fix to `PatternRecognitionWidget.tsx:78`, mirroring `MemoryWidget.tsx` / `SystemProgressWidget.tsx`.
2. This root cause has now been independently rediscovered 4 times across different widgets as new ones get added (39 widget files today and growing) — worth a lightweight guardrail rather than relying on each new widget's author to know the doctrine: e.g. a one-line comment/lint convention flagging any call to `analyzeIntentions`, `getOptimalWidget`, or `shouldShowWidget` outside a `useEffect` or event handler, or a wrapper hook (`useOptimalWidget()`) that encapsulates the correct deferred pattern so widgets can't call the raw store-writing functions directly.
3. No profiling/APM tooling or synthetic performance test currently guards against this class of regression in CI — the fixes above were each verified manually via headless-Chromium smoke tests per the commit messages, not by an automated check. Out of scope for this pass, but worth flagging if button lag becomes a recurring theme in user reports.
