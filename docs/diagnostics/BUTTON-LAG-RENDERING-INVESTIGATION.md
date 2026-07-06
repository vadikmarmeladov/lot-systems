# Button Lag & Rendering Investigation

**Date:** 2026-07-06
**Requested by:** S-2 (scheduled investigation)
**Status:** No currently-open lag issue found — history below documents an actively-maintained, already-fixed problem class. Two minor residual observations noted for future attention.

## Summary

"Buttons lagging / rendering problems" has been a recurring, well-documented issue in this codebase since early June 2026. It was **not one bug** but a series of distinct root causes, each found and fixed in its own benchmark session, spanning three categories:

1. **Unnecessary re-renders** (React store-subscription cascades)
2. **A crashing click handler** (Web Audio API misuse that froze navigation)
3. **CSS/paint jank** (missing GPU layer promotion, effect timing)

As of the current HEAD (`892438d`, branch `claude/brave-rubin-l9qreu` / `master`), all previously-identified causes have corresponding merged fixes. No open GitHub issues or PRs reference lag/freeze/slow buttons (`search_issues`/`search_pull_requests` for `LOT-Systems/LOT-Computer` returned zero matches for button+lag/freeze/slow/unresponsive terms).

## Timeline of related fixes

| Date | Commit | Root cause | Fix |
|---|---|---|---|
| 2026-06-02 | `5126e09` | Router subscribed at `App` level re-rendered the entire 130+ widget tree on every tab switch | Isolated router subscription into `TabPanel` wrappers; memoized `getOptimalWidget()` |
| 2026-06-03 | `0050853` | Over-broad store subscriptions in Block/Sync/nav components | Reduced subscriptions to only the fields each component actually reads |
| 2026-06-03 | `4d48dfb` | `Button.tsx` subscribed to multiple stores on every instance, including the default "secondary" kind used everywhere | Split into kind-specific sub-components (`PrimaryBtn`, `SecondaryRoundedBtn`); default `secondary` kind now has **zero** store subscriptions. Doctrine: "Subscription Minimization"; Lexicon: `RENDER-ISOLATION` token minted |
| 2026-06-04 | `d609978` | Biofield widget re-computation lag | Fixed alongside calendar retrieval issue |
| 2026-06-09 | `f07da921` | (a) `Layout` subscribed to the full `me` object — any metadata change (badge sync, theme save) re-rendered all `NavButton`s; (b) `Settings` duplicated a `/api/public/status` fetch; (c) chime toggle's click target excluded its own label | (a) Computed boolean `isLoggedIn` replaces raw `me` subscription; (b) Settings reads from existing `stores.appVersion`; (c) full-row `onClick`, plus AudioContext pre-warmed on the user gesture |
| 2026-06-27 | `b68e842`/`fafd50e` | `App` re-renders on `isSoundOn`/`isRadioOn`/`isMirrorOn`/`me` changes cascade into `TabPanels`/`DynamicRoutes` even when the route didn't change | Wrapped `TabPanels` and `DynamicRoutes` in `React.memo` (no props ⇒ always equal) so they only re-render on their own router subscription |
| 2026-06-27 | `1271cd3` | (a) Visible sub-pixel text shift on button hover transitions (label movement); (b) full re-render of the active tab's heavy component tree on every route change | (a) `will-change: opacity` on `.grid-fill-hover::before` pre-promotes the GPU compositor layer; (b) `Logs`/`System`/`Sync`/`Settings` wrapped in `React.memo` |
| 2026-07-04 | `bd9ef2a` | **Planner buttons frozen** — `playClickSound()` created a `new AudioContext()` on every click; browsers cap live AudioContext instances, so once the cap was hit the constructor threw *before* `plannerWidget.set()` ran, silently killing `cycleValue`/`navigateCategory` and freezing the UI | Single shared `_audioCtx` reused across clicks (recreated only if closed) + `try/catch` around the entire `playClickSound` body so any Web Audio failure never blocks navigation |
| 2026-07-04 | `d5de98b` | (a) `useMouseInactivity` re-registered its mousemove listener on every state change because `isMoving` was a dependency, occasionally leaving nav `pointer-events: none` stuck; (b) `Logs`' `#page` click handler fired on other tabs since `Logs` stays mounted globally, overriding navigation | (a) Rewrote to use a closure var instead of state in the effect's deps; (b) added a route guard; also added `z-10` to `#nav` so it renders above page widgets |
| 2026-07-04 | `f6c7caf` | Tab-switch scroll used `useEffect` (post-paint), producing a visible blank/stale frame between tab switches | Changed to `useLayoutEffect` so scroll-to-top happens in the same frame as the DOM mutation, before paint |

## Root cause categories (for future triage)

- **Slow/crashing event handlers:** `AudioContext` created per-click was the single most damaging pattern — it doesn't just add latency, a thrown constructor error can abort the whole handler before app state updates, which reads to users as a fully frozen button. This anti-pattern was found and fixed in `plannerWidget.ts` and confirmed already fixed system-wide in `sound.ts`, `sovietKeyboard.ts`, `sovietChime.ts`, and `sovietGameSounds.ts` (all use a shared, lazily-recreated context guarded by try/catch).
- **Unnecessary re-renders:** the dominant category. Nanostores (`@nanostores/react`) subscriptions at high tree levels (`App`, `Layout`) re-rendered far more of the tree than necessary on unrelated state changes (theme save, badge sync, sound/radio/mirror toggles). Fixed via subscription minimization + `React.memo` boundaries at the `TabPanels`/route level (documented in the Lexicon as `RENDER-ISOLATION`).
- **CSS/paint jank:** one confirmed case — missing `will-change: opacity` caused a GPU layer to be promoted *during* the first hover instead of ahead of time, producing a visible sub-pixel text shift.
- **Effect timing:** `useEffect` vs `useLayoutEffect` mismatches caused a visible stale frame on tab switch (separate from re-render volume).

## Current state verification

Spot-checked the current code against each fix to confirm none has regressed:
- `src/client/components/ui/Button.tsx:110-132` — default `secondary` kind still has zero store subscriptions; `primary`/`secondary-rounded` are isolated sub-components.
- `src/client/components/ui/Layout.tsx:53` — `Layout` subscribes to computed `isLoggedIn`, not raw `me`; `NavButton` (line 19) is `React.memo`-wrapped.
- `src/client/utils/hooks.ts:115-144` — `useMouseInactivity` uses a closure var (`isMoving`), not state, in the timer logic; effect deps are just `[delay]`.
- No remaining `new AudioContext()` calls outside the four shared-instance modules (`sound.ts`, `sovietKeyboard.ts`, `sovietChime.ts`, `sovietGameSounds.ts`) — all guarded by try/catch and instance reuse.
- `src/client/index.css:107-125` — `.grid-fill-hover::before` still has `will-change: opacity` (line 120).

No regressions found in the areas covered by the fixes above.

## Residual observations (not confirmed as bugs — worth a closer look if lag reports resume)

1. `src/client/entries/app.tsx:210-213` — the top-level `App`/entry component still subscribes directly to `stores.me`, `stores.isMirrorOn`, `stores.isSoundOn`, `stores.isRadioOn`. This is by design per the `b68e842` fix (the cascade is absorbed by memoized `TabPanels`/`DynamicRoutes` rather than removed at the source), but it means any *new* child component added under `App` without a memo boundary would silently reintroduce the cascade. Worth a lint rule or comment guarding this invariant if it isn't already documented in `LOT-DOCTRINE.md`.
2. No JS profiling data (Chrome Performance traces, React Profiler flame charts) or user-submitted timing numbers were found anywhere in the repo — all prior fixes were diagnosed by code-reading root-cause analysis rather than measured profiling. If lag is reported again, capturing a Performance trace or React DevTools Profiler recording would confirm whether it's a new instance of the render-cascade pattern or something new (e.g., network waterfall, server latency) before assuming it's the same class of bug.

## Next steps if a new report comes in

- Ask for: which screen/tab, which specific button, and whether it's a one-time freeze (→ suspect a thrown error killing a handler, check DevTools console) vs. a persistent sluggishness (→ suspect a re-render cascade, check React Profiler "why did this render").
- Grep for `new AudioContext` / `new (window.AudioContext` first — it has been the single highest-severity root cause found so far.
- Check whether the component in question (or an ancestor) subscribes to a store broader than what it reads, per the `RENDER-ISOLATION` / "Subscription Minimization" doctrine clauses in `docs/benchmark/LOT-DOCTRINE.md`.
