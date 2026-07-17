# Button Lag / Rendering — Investigation

**Date:** 2026-07-17
**Scope:** src/client/components/ui/Button.tsx and consumers
**Trigger:** Routine background sweep for button-lag / rendering-performance issues (no open GitHub issue or PR referencing this at time of writing — `search_issues`/`search_pull_requests` for `button lag|render|performance|slow` returned 0 relevant results in LOT-Systems/LOT-Computer).

## Summary

No currently-open regression was found. Two real button-lag bugs were identified and fixed earlier this cycle; both fixes are present on `master` and on this branch. This doc records what they were, why they happened, and what to watch for if lag reports come back.

## Fixed issue #1 — Planner buttons froze on repeated clicks

- **Commit:** `bd9ef2a` — "Fix Planner buttons frozen: reuse AudioContext, catch sound errors [VM]" (2026-07-04)
- **File:** `src/client/stores/plannerWidget.ts`
- **Root cause:** `playClickSound()` called `new AudioContext()` on every button press. Browsers cap the number of live `AudioContext` instances; once the cap was hit (or any Web Audio error occurred), the constructor threw *before* `plannerWidget.set()` ran, so `cycleValue`/`navigateCategory` silently died mid-handler and the widget stopped responding to clicks.
- **Fix:** one shared `_audioCtx` reused across clicks (recreated only if closed), and the whole sound path wrapped in try/catch so any audio failure never blocks state updates.
- **Status:** present on current HEAD (`getAudioContext()` singleton pattern, `plannerWidget.ts:241-`).

## Fixed issue #2 — Tab switching lag + hover label shift

- **Commit:** `1271cd3` — "Fix tab label movement and tab switching lag" (2026-06-27)
- **Root causes (two distinct):**
  1. `Logs`, `System`, `Sync`, `Settings` were unmemoized. They take no props and read everything from stores, but every `TabPanel` re-render on route change forced a full re-render of the active tab's entire (heavy) component tree.
  2. `.grid-fill-hover::before` (the hover-fill pseudo-element used by every `Button`) lacked `will-change: opacity`, so the GPU compositor layer wasn't pre-promoted — first hover caused a layout/paint hit that showed up as a sub-pixel text shift on the tab label.
- **Fix:** wrapped the four tab components in `React.memo`; added `will-change: opacity` to `.grid-fill-hover::before` in `src/client/index.css`.
- **Status:** present on current HEAD — verified `React.memo` wraps `Logs`, `Settings`, `Sync`, `System` (`grep` confirms all four); `will-change: opacity` present at `src/client/index.css:120`.

## Resulting doctrine (already codified)

`docs/benchmark/LOT-DOCTRINE.md` records a **RENDER-ISOLATION** principle born from these fixes: prefer setting evolution/theme attributes (`data-density`, `data-theme`) on the document root and resolving appearance via CSS descendant selectors, instead of adding per-component store subscriptions. `Button.tsx` itself follows this — the density-tier hover-pattern work (`LOT-SR-20260612-04`, 2026-06-12) added 5 new visual tiers to `.grid-fill-hover::before` via `[data-density]` CSS selectors with **zero new store subscriptions** in `Button.tsx`.

`Button.tsx`'s current subscription surface is intentionally narrow and by-design:
- `PrimaryBtn` subscribes to `stores.theme` only (rendered when `kind="primary"`)
- `SecondaryRoundedBtn` subscribes to `stores.isMirrorOn` only (rendered when `kind="secondary-rounded"`)
- plain `secondary` (the default) and `GhostButton` subscribe to nothing

## Things checked and ruled out this pass

- No other `new AudioContext()` call sites recreate a context per-interaction — `sovietChime.ts`, `sovietKeyboard.ts`, `sovietGameSounds.ts`, `sound.ts`, and `plannerWidget.ts` all use a cached/lazy singleton pattern (`if (!ctx || ctx.state === 'closed') ctx = new AudioContext()`).
- Newest widgets touching buttons (`RecipeWidget.tsx`, `MonthlyPulseWidget.tsx`, added 2026-07-07 to -09) have trivial `onClick` handlers (state setters / one `setTimeout`) — nothing synchronously expensive.
- CI (`Weekly Rebuild & Self-Assembly Sync`) has been green for the last 4 runs (2026-06-21 through 2026-07-12); no build/type-check regressions in that window that would correlate with a rendering issue.
- No open GitHub issues or PRs in `LOT-Systems/LOT-Computer` currently reference button lag, rendering, or performance.

## Where to look next if a *new* lag report comes in

1. **Reproduce with a name.** "Buttons lag" is broad — get which surface (Planner, tab bar, a specific widget) and whether it's first-interaction-only (compositor promotion) or sustained (re-render storm or blocked main thread).
2. **Check for new unmemoized heavy components mounted under a frequently-updating parent** — same shape as issue #2. `SystemProgressWidget.tsx` (2189 lines, 2 `Button` usages) and `QuantumEngineWidgets.tsx` (566 lines, 19 `Button` usages) are the largest button-bearing files and are the most likely place for this pattern to recur as they grow.
3. **Check for new per-click resource allocation** (AudioContext, canvas contexts, WebSocket, large `JSON.parse`/`stringify`) in any new `onClick` handler — same shape as issue #1.
4. **Profile with React DevTools / Chrome Performance** on the specific button — this doc is a static-analysis pass, not a runtime profile; no flame graphs or React Profiler traces were captured this cycle because no live repro was available.

## Next steps

- No action required — both known causes are already fixed and merged.
- Nothing was pushed to `master`; this file documents the investigation only.
