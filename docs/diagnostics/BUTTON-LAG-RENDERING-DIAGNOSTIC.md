<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering — Investigation

Date: 2026-07-02
Scope: `src/client` — button components, tab switching, widget click handlers

## Summary

Button/tab lag has already been diagnosed and partially fixed across three prior
commits. The root mechanism is well understood: **synchronous work inside a click
handler (or inside the state-updater callback) blocks React's paint of the visual
feedback**, so the button appears to "lag" between click and visible response.

The fix pattern (defer non-visual work with `setTimeout(fn, 0)` after the state
update) was applied to `MemoryWidget.tsx` but **not propagated to ~10 other widgets
that call the same expensive `recordSignal()` function directly inside click
handlers**. That is the most likely source of remaining/recurring lag reports.

## Already fixed (prior commits)

| Commit | Fix | File(s) |
|---|---|---|
| [`78745c3`](../../commit/78745c3) | Defer `recordSignal()` via `setTimeout(0)` so React commits visual feedback before synchronous localStorage write + pattern analysis | `MemoryWidget.tsx` |
| [`1271cd3`](../../commit/1271cd3) | Add `will-change: opacity` to `.grid-fill-hover::before`, pre-promoting the GPU layer so hover fill doesn't cause sub-pixel text shift on transition start | `index.css` |
| [`1271cd3`](../../commit/1271cd3) | Wrap `Logs`, `System`, `Sync`, `Settings` tab panels in `React.memo` — these read only from stores and take no props, so without memo every route change re-rendered the full active tab tree | `Logs.tsx`, `System.tsx`, `Sync.tsx`, `Settings.tsx` |
| [`b68e842`](../../commit/b68e842) / [`fafd50e`](../../commit/fafd50e) | Wrap `TabPanels` and `DynamicRoutes` in `React.memo` to stop `App` re-renders (triggered by `isSoundOn`/`isRadioOn`/`isMirrorOn`/`me` store changes) from cascading into the tab tree on non-routing updates | `entries/app.tsx` |
| [`95de8e1`](../../commit/95de8e1) | `EmotionalCheckIn`: added `pendingState` so a click shows "`[State] — logged.`" immediately instead of a blank gap during the in-flight API call; buttons set to `size="small"` | `EmotionalCheckIn.tsx`, `PatternInsightsWidget.tsx` |

`src/client/components/ui/Button.tsx` itself is already lean: `PrimaryBtn` and
`SecondaryRoundedBtn` each subscribe to exactly one store (`theme`, `isMirrorOn`
respectively) and the plain `secondary` kind subscribes to nothing, so the base
component is not a rendering bottleneck.

## Root cause still present: `recordSignal()` called synchronously in ~10 widgets

`recordSignal()` (`src/client/stores/intentionEngine.ts:166`) is not cheap:

1. `JSON.stringify` + synchronous `localStorage.setItem` on every call
2. Every 5th signal (`recentSignals.length % 5 === 0`), it calls `analyzeIntentions()`
   synchronously — a ~19-operation pass (filter/map/reduce/sort) over up to
   `MAX_SIGNALS` signals to recompute patterns
3. Periodically also triggers `syncToServer()`

Commit `78745c3` fixed exactly this for `MemoryWidget` by moving the
`recordSignal()` call into a `setTimeout(fn, 0)` **after** `setClickedButtonIndex`
so the click's visual feedback commits first. The same call is still made
**synchronously, inline in the click handler**, in:

- `src/client/components/QuantumEngineWidgets.tsx:138,146,154,162,170,178` — every
  device connect/disconnect toggle calls `recordSignal()` **inside** the
  `setXConnected(prev => { ...; recordSignal(...); return next })` updater, i.e.
  before React can commit the toggle's visual state at all
- `src/client/components/ContextualPromptsWidget.tsx:197,223` — `handleAction`
  calls `recordSignal()` before `stores.goTo(...)`, delaying the tab navigation
  the button triggers
- `src/client/components/PlannerWidget.tsx:53`
- `src/client/components/PatternInsightsWidget.tsx:96,108,120` — the Check
  in/Reflect/Integrate buttons referenced in `95de8e1`
- `src/client/components/EnergyCapacitor.tsx:51`
- `src/client/components/GoalJourneyWidget.tsx:48`
- `src/client/components/ChakraErgonomicsWidget.tsx:59`
- `src/client/components/InterventionsWidget.tsx:38`
- `src/client/components/IntentionsWidget.tsx:83`
- `src/client/components/ChatCatalystWidget.tsx:51`
- `src/client/components/MicroImageWidget.tsx:249,262`
- `src/client/components/CohortConnectWidget.tsx:45,110,120,132`

`MicroCalculatorWidget.tsx:133` and `MicroGameWidget.tsx:779` also call it
synchronously, though those are lower click-frequency paths.

Since `analyzeIntentions()` cadence is driven by a global signal counter
(`recentSignals.length % 5 === 0`), the expensive path can trigger from *any* of
these widgets depending on how many signals have accumulated app-wide — so the
lag can appear to "jump between" unrelated buttons, which matches an
intermittent, hard-to-pin-down lag report.

## Suspected causes, ranked

1. **Confirmed, high confidence**: synchronous `recordSignal()` (and its
   occasional `analyzeIntentions()`/`syncToServer()` payload) running inside the
   click handler before paint, in the ~10 files above. Same class of bug as
   `78745c3`, just not applied everywhere the function is called.
2. **Fixed**: tab-switch cascade re-renders (`b68e842`/`fafd50e`/`1271cd3`) —
   already resolved, listed here so it isn't re-investigated.
3. **Fixed**: hover-fill sub-pixel shift from missing `will-change` (`1271cd3`) —
   already resolved.
4. **Low likelihood**: `Button.tsx` itself — ruled out, no unnecessary store
   subscriptions or heavy work in the shared component.

## Next steps

- Apply the same `setTimeout(fn, 0)` deferral (or move `recordSignal` off the
  critical path entirely, e.g. via `requestIdleCallback`) to the ~10 call sites
  listed above, starting with `QuantumEngineWidgets.tsx` (toggle buttons, called
  from inside the state updater — the most severe case) and
  `ContextualPromptsWidget.tsx` (delays actual navigation, not just visual
  feedback).
- Consider moving the deferral into `recordSignal()` itself (wrap the body in
  `setTimeout(..., 0)` once, centrally) rather than requiring every call site to
  remember to defer — the current pattern is easy to regress on new widgets.
- No open GitHub issues or PRs currently reference button lag or rendering
  performance in this repo; all context comes from commit history. If lag
  reports continue after the above fix, the next thing to profile is
  `analyzeIntentions()` itself (19 array ops per run) under a large signal
  history (near `MAX_SIGNALS`), and whether `SYNC_INTERVAL` sync calls are also
  firing synchronously on the same tick.
