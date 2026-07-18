# Button Lag & Rendering Investigation

**Date:** 2026-07-18
**Trigger:** Scheduled investigation task — no specific user-reported incident attached.
**Scope:** Button responsiveness and rendering performance across the client app.

## Summary

No open GitHub issues or PRs currently report button lag or rendering
problems (`list_issues` on `lot-systems/lot-computer` returns zero open
issues; targeted search for lag/slow/render/freeze/jank terms also returns
zero). There is no profiling data or APM output checked into the repo to
corroborate a live regression.

However, git history shows **three confirmed, previously-shipped button/nav
lag bugs**, all with clear root causes and fixes. This document records
those fixes, confirms they are still intact on `master`, and flags one
unconfirmed area worth deeper profiling if lag reports resurface.

## Confirmed historical incidents (fixed, verified still in place)

### 1. Planner buttons freezing — `AudioContext` exhaustion
- Commit: [`bd9ef2a`](https://github.com/lot-systems/lot-computer/commit/bd9ef2a1a0f378d51c4bcc3bb6ef044185de3d7e) — *Fix Planner buttons frozen: reuse AudioContext, catch sound errors*
- File: `src/client/stores/plannerWidget.ts`
- Root cause: `playClickSound()` created a `new AudioContext()` on every
  button press. Browsers cap concurrent live `AudioContext` instances; once
  hit, the constructor throws synchronously, which killed
  `cycleValue`/`navigateCategory` before `plannerWidget.set()` was reached —
  the store never updated, so the button appeared frozen.
- Fix: a single shared `_audioCtx`, recreated only if closed, wrapped in
  try/catch so any Web Audio failure is swallowed and never blocks
  navigation.
- **Verified still present**: `getAudioContext()` singleton pattern is in
  `plannerWidget.ts:246-256` today. Same singleton pattern is also used
  correctly in `sovietGameSounds.ts`, `sovietKeyboard.ts`, `sovietChime.ts`,
  and `sound.ts` (all via a module-level `ctx`/ref, not per-call
  instantiation) — no regressions of this pattern found elsewhere.

### 2. All nav buttons unclickable after visiting Logs tab
- Commit: [`89da563`](https://github.com/lot-systems/lot-computer/commit/89da5632832f3091a438686ea57ed6fff1aae05a) — *Fix tab navigation: Logs mouse-inactivity timer was disabling nav across all tabs*
- File: `src/client/components/Logs.tsx`
- Root cause: `Logs` uses `useMouseInactivity` to hide the nav bar after 2s
  idle by adding `pointer-events-none` to `#nav`. Because `TabPanel` keeps
  tab components mounted (`display:none` rather than unmounting), the
  inactivity timer kept running after the user navigated away from Logs,
  eventually adding `pointer-events-none` to `#nav` while on a *different*
  tab — making every nav button unclickable app-wide.
- Fix: guard `onMouseActivityChange` to only touch `#nav` while actually on
  the logs route, plus a router-listen cleanup that restores nav on route
  change.
- **Verified still present**: guard and cleanup logic present at
  `Logs.tsx:158-179`. No other component in the codebase currently toggles
  `pointer-events-none` on a shared/global element from inside a
  timer (`grep` of `pointer-events-none` usages elsewhere are static/local
  classes, not cross-tab side effects).

### 3. Tab-switch lag from unnecessary full re-renders
- Commit: [`1271cd3`](https://github.com/lot-systems/lot-computer/commit/1271cd3ece9a46e4e59c1bdc70bd6e916fc01407) — *Fix tab label movement and tab switching lag*
- Files: `Logs.tsx`, `Settings.tsx`, `Sync.tsx`, `System.tsx`, `index.css`
- Root cause: `Logs`, `System`, `Sync`, `Settings` take no external props
  and read everything from stores. Without `React.memo`, every `TabPanel`
  re-render on route change forced a full re-render of the *active* tab's
  entire (heavy) component tree, causing visible jank on tab switch.
  Separately, `.grid-fill-hover::before` lacked `will-change: opacity`,
  causing a GPU-layer promotion cost on first hover (sub-pixel text shift).
- Fix: wrap all four components in `React.memo`; add
  `will-change: opacity` to the hover-fill pseudo-element.
- **Verified still present**: `React.memo` wraps all four components today
  (`Logs.tsx:44`, `System.tsx:102`, `Sync.tsx:43`, `Settings.tsx:27`), and
  `TabPanel`/`TabPanels` in `src/client/entries/app.tsx:145,162` are also
  memoized. `will-change: opacity` present in `index.css:120`.

## Current `Button` component (`src/client/components/ui/Button.tsx`)

Already split into per-`kind` subcomponents (`PrimaryBtn`,
`SecondaryRoundedBtn`, plain `secondary`) so each only subscribes to the
one store it actually needs (`theme` or `isMirrorOn`), rather than one
monolithic `Button` re-rendering on every store change regardless of kind.
No issues found here.

## Unconfirmed area flagged for future profiling

`SystemPulseWidget` (`src/client/components/SystemPulseWidget.tsx`)
subscribes to the global `intentionEngine` store (`useStore(intentionEngine)`),
which is written to via `recordSignal(...)` from many discrete user actions
across the app (log entries, goal changes, recipe views, energy checks,
etc. — see `intentionEngine.ts`). Every such signal re-renders
`SystemPulseWidget` (and any other subscriber) even when the signal is
unrelated to what the widget displays. This is action-driven rather than
continuous/high-frequency, so it is **not** confirmed as a live lag source,
but if button-lag reports resurface specifically on the System tab, this
fan-out is the first thing worth profiling (React DevTools Profiler,
looking for `SystemPulseWidget` commits correlated with unrelated
interactions elsewhere in the app).

## Next steps

1. No corrective action taken — no reproducible, currently-open bug was
   found; the three known historical fixes are intact.
2. If a specific button-lag report comes in, capture a React DevTools
   Profiler trace during the interaction and check whether
   `SystemPulseWidget` (or another `intentionEngine` subscriber) is
   committing on unrelated store writes.
3. Consider adding a lightweight interaction-to-paint timing log (e.g. via
   the Web Vitals `INP` metric) if recurring vague "lag" reports continue,
   since there is currently no in-repo telemetry to confirm or rule out
   perceived lag quantitatively.
