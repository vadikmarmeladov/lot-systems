<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering Diagnostic

Scheduled investigation, 2026-08-12. Reviews the button-lag/rendering fix
history on `master`, checks whether the fixes are still intact, and flags
one live gap found during this pass.

## 1. History — this has been chased down before

Between 2026-07-27 and 2026-07-28 a chain of commits addressed button-click
lag and tab-switch stalls in `System.tsx` and its subscriber widgets:

| Commit | Fix |
|---|---|
| `b219cc3` | Moved quantum-state atom writes out of `useMemo` (render-phase store write → cascading re-renders) |
| `863b333` | Capped the Logs query and backed off stats polling to reduce widget lag |
| `ee88f4c` | Paused System background work when the tab isn't active (fixed tab-switch freeze) |
| `6e5007a` | Stopped a render-phase atom write causing tab-switch stall |
| `b46f1ac` | Unmounted the System tab's subtree when inactive (`unmountWhenInactive`), ending background churn |
| `be3e8fa` | Fixed two residual button-lag paths: `MemoryWidget` ran `analyzeIntentions()` (a store write) inside a `useMemo`; `SystemProgressWidget.handleGenerateReport` ran a ~139-pattern scan synchronously inside the click handler, blocking the click response |
| `9364aba` | Memoized heavy per-render work in `SignalStreamWidget` (sorting up to 1000 signals) and `UserMetricsWidget` (`getUserIndex()` + `classifyPhysiologicalCohort()`) |

The root doctrine that emerged, and is now commented at each call site: **never
write to a nanostores atom (`analyzeIntentions()`, `recordSignal()`, etc.)
during React's render phase** — not in `useMemo`, not inline in the render
body. Atom writes belong in `useEffect` (after paint) or are deferred a
macrotask/idle-callback off the click path. `deferHeavy()` and
`schedulePersist()` in `src/client/stores/intentionEngine.ts:166-197`
formalize this: heavy JSON serialization and the 139-pattern
`analyzeIntentions()` scan are coalesced and pushed off the interaction
tick.

**Note:** `be3e8fa`'s commit message references
`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` as the agent-authored
diagnostic that drove that fix, but that file was never actually committed
to the repo (confirmed via full history search — it exists nowhere in
`git log --all`). This file fills that gap and extends it with today's
findings.

## 2. Verified still in place

Checked each fix above against current `master` (`98971f2`):

- `System.tsx:266-271` — `analyzeIntentions()` / `recomputeAssembly()` still
  correctly live in a `useEffect`, with a `useState(() => getUserState())`
  seed for an identical first render, matching the documented pattern.
- `SystemProgressWidget.tsx:1621-1642` — `handleGenerateReport` still defers
  the full build (`analyzeIntentions()` + report builders) via
  `setTimeout(build, 0)`, so the click responds before the scan runs.
- `app.tsx:187` — `<TabPanel active={... 'system'} unmountWhenInactive>`
  still wraps `<System />`, so the System tab's subtree (and its
  `setInterval`/subscription churn) is torn down when another tab is active.
- `SignalStreamWidget.tsx` / `UserMetricsWidget.tsx` — sort and
  `getUserIndex()`/`classifyPhysiologicalCohort()` calls remain memoized on
  stable engine refs.

No regression found in the previously-fixed paths.

## 3. New finding this pass — impure `setState` updaters in `QuantumEngineWidgets.tsx`

`src/client/components/QuantumEngineWidgets.tsx:207-253` — the six
device-connect toggle buttons (car / home / computer / phone / watch /
robot) call `recordSignal()` **inside** the `setXConnected(prev => {...})`
functional updater, e.g.:

```tsx
const handleComputerConnect = () => {
  setComputerConnected((prev) => {
    const next = !prev
    recordSignal('intentions', next ? 'computer_connected' : 'computer_disconnected', { timestamp: Date.now() })
    return next
  })
}
```

(same shape at lines 208, 216, 224, 232, 240, 248 — six buttons total.)

React state updater functions are expected to be pure — React reserves the
right to invoke them more than once for a single dispatch (StrictMode
double-invoke in dev, and replay under concurrent-rendering interruption).
`recordSignal()` is not pure: it writes to the `intentionEngine` atom,
schedules a debounced `localStorage` persist, and can trigger
`deferHeavy(analyzeIntentions)` every 5th signal. If the updater is ever
replayed, a single click would silently double-record a device-connect
signal (throwing off any counts/streaks derived from signal history) or,
if analysis happens to trigger on the replay, momentarily churn the engine
twice on one click.

The same shape appears once more, on a timer rather than a click, in
`QuantumRandomWidget.tsx:40-46` inside a `setInterval` callback.

**Risk today is low but not zero:** the app does not currently wrap its
tree in `<React.StrictMode>` (confirmed — no match anywhere under
`src/client`), so the dev-mode double-invoke doesn't fire, and the
production risk is limited to the rarer concurrent-replay case. It is not
implicated in the pre-August lag reports (those were render-phase writes on
*every* render; this is a possible-double-write on a subset of clicks) —
but it's the same doctrine violation in miniature and is worth closing
before someone enables StrictMode or the engine schema starts depending on
exact signal counts.

**Suggested fix:** move `recordSignal(...)` out of the updater body, e.g.:

```tsx
const handleComputerConnect = () => {
  const next = !computerConnected
  setComputerConnected(next)
  recordSignal('intentions', next ? 'computer_connected' : 'computer_disconnected', { timestamp: Date.now() })
}
```

## 4. Current state — no open lag reports

- No open GitHub issues in `lot-systems/lot-computer` reference button lag
  or rendering.
- Only one open PR (`#93`, calendar time-tracking), unrelated to
  performance.
- No `React.memo`-wrapped widgets among the 62 components in
  `src/client/components` (7 files use a bare `memo(...)` reference in
  comments/unrelated code, not component wrapping) — not a current problem
  since the render-phase-write doctrine addresses the actual cause, but
  worth knowing there's no re-render firewall if a future widget
  reintroduces a heavy synchronous computation.
- No CSS `@keyframes` found in components except
  `EvolutionMilestoneToast.tsx`; no matches for `transition: all` or
  `will-change` abuse. CSS animation was not and is not implicated.

## 5. Next steps if lag resurfaces

1. Reproduce with the same headless-Chromium harness pattern used in
   `9364aba`/`be3e8fa` (seed 1000 signals + 500 logs, profile a System↔Logs
   tab switch) before guessing at a cause — the last two rounds of "fixes"
   that didn't use this harness were the ones that missed residual paths.
2. Grep first for the two known-bad shapes before reading component code
   line by line:
   - `analyzeIntentions(`, `recordSignal(`, `getUserIndex(`,
     `classifyPhysiologicalCohort(` used inside `useMemo(` or inline in a
     render body (render-phase store write).
   - Same store-write calls inside a `setState(prev => {...})` functional
     updater (impure updater, see §3).
3. Apply the fix in §3 to `QuantumEngineWidgets.tsx` and
   `QuantumRandomWidget.tsx` proactively — cheap, low-risk, and removes the
   only doctrine violation currently on `master`.
