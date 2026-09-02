<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation (2026-09-02)

**Scope**: Scheduled diagnostic scan. No open GitHub issue and no new user
report exists at time of writing — this is a proactive audit of the
button-lag/rendering surface following the recurring history of fixes below,
prompted by a recurring lag pattern this session was asked to re-check.

---

## 1. Recent history — this is a repeat offender

Button lag has been diagnosed and fixed at least **nine** separate times.
All of them trace back to one shape of bug: `intentionEngine` is a single
global nanostores atom, and every widget subscribed to it (currently ~7+ on
the System tab) re-renders whenever it is written. Writing to it from the
wrong place — render body, `useMemo`, or synchronously inside a click
handler — either blocks the click or cascades a re-render storm across every
subscriber.

| Commit | Date | Root cause fixed |
|---|---|---|
| `95de8e1` | pre-07-18 | Check-in widgets: made logged acknowledgment instant, shrank buttons |
| `bd9ef2a` | pre-07-18 | Planner buttons frozen — `AudioContext` recreated + unhandled sound errors per click |
| `863b333` | pre-07-18 | Widget lag — uncapped logs query + unthrottled stats polling |
| `b219cc3` | pre-07-18 | Store write inside `useMemo` blocked the render pipeline |
| `6e5007a` | ~07-24 | Render-phase atom write + off-tab churn caused a tab-switch stall |
| `ee88f4c` | ~07-25 | System background work not paused off-tab → tab-switch freeze |
| `d922509` | ~07-25 | Duplicate `SystemProgressWidget` mount (double the churn) |
| `b46f1ac` | 07-25 | **Definitive fix**: System tab now fully unmounts when inactive (`app.tsx`) instead of `display:none`, so its ~7 `intentionEngine` subscribers do zero work off-tab |
| `be3e8fa` | 07-28 | Two residual paths agent-flagged: `MemoryWidget` ran `analyzeIntentions()` (a store write) inside `useMemo`; `SystemProgressWidget`'s `handleGenerateReport` ran a ~139-pattern scan synchronously in the click handler |
| `9364aba` | 07-28 | Memoized remaining heavy per-render work in System subscriber widgets |

The doctrine that came out of this history, stated inline at several call
sites (`System.tsx:263-266`, `PatternRecognitionWidget.tsx:73-77`,
`intentionEngine.ts:231-235`):

1. **Never write the `intentionEngine` atom during render or inside
   `useMemo`.** Do it in `useEffect`, after paint.
2. **Never run `analyzeIntentions()` (the pattern scan, now 151 patterns)
   synchronously inside a click handler.** Defer it a macrotask, or run it
   off the interaction tick (`deferHeavy`, `schedulePersist`).
3. **Pause all background polling/writes when `document.hidden` is true, or
   the widget's tab is not the active in-app route.** Established in
   `ChakraErgonomicsWidget.tsx:52-57`, `ContextualPromptsWidget.tsx:25-29`,
   `EvolutionMilestoneToast.tsx:59-63`, `SystemPulseWidget.tsx:94-99`, and
   the `recomputeAssembly` interval in `SystemProgressWidget.tsx:1557-1567`.
4. **Fully unmount the System tab when it isn't active** (`app.tsx`
   `TabPanel unmountWhenInactive`), rather than `display:none`, so its
   subscriber tree does zero work off-tab.

## 2. What's new since the last fix (`9364aba` → `HEAD`)

Six new QIE pattern releases landed since the last button-lag fix
(P131–P151, Arch48–51, J45–J48 — astrology signal recording, circadian
phase, and ~20 new pattern names/handlers across `System.tsx`,
`PatternRecognitionWidget.tsx`, `QuantumEngineWidgets.tsx`, `Logs.tsx`,
`SystemProgressWidget.tsx`). All of it **follows the doctrine correctly**:

- The new astrology recompute (`System.tsx:196-234`) reads on a
  `document.hidden`-gated 15-min interval and writes the signal bus only
  once per calendar day from a `useEffect`, not render.
- `getCircadianPhase()` (`intentionEngine.ts:5049-5057`) is pure hour-of-day
  arithmetic — cheap, no store write — safe to call directly in JSX
  (`QuantumEngineWidgets.tsx:379`, `System.tsx:695`) despite looking similar
  to the `analyzeIntentions()` anti-pattern at a glance.
- New `Logs.tsx` event-type branches (PHYARC/QEMERG/SIGEWEB/CIRC-LK/DIMSAT/
  QIDCRYST/etc.) are static JSX renderers keyed off already-fetched log
  data — no new store writes.

**No regression found in the newly-added code.**

## 3. Suspected root cause still present: ungated 30-min QOS monitor

One gap survived every prior pass. `startBackgroundQOSMonitor()`
(`src/client/stores/intentionEngine.ts:5122-5140`) is started from
`SystemProgressWidget.tsx:1570-1573`:

```ts
// SystemProgressWidget.tsx:1569-1573
React.useEffect(() => {
  const stop = startBackgroundQOSMonitor()
  return stop
}, [])
```

```ts
// intentionEngine.ts:5122-5133
export function startBackgroundQOSMonitor(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (_qosMonitorHandle !== null) return () => {}

  analyzeIntentions()
  captureQOSSnapshot()

  _qosMonitorHandle = setInterval(() => {
    analyzeIntentions()
    captureQOSSnapshot()
  }, QOS_INTERVAL_MS)   // 30 minutes
  ...
```

Compare this to the **sibling effect three lines above it in the same
file**, guarding the same class of work:

```ts
// SystemProgressWidget.tsx:1557-1567
const interval = setInterval(() => {
  // Skip when the browser tab is hidden OR when the user is on another
  // in-app tab. recomputeAssembly() is heavy and writes the selfAssembly
  // atom (re-rendering several mounted-but-hidden widgets); pausing it off
  // the System tab keeps tab switching responsive.
  if (document.hidden) return
  if (!stores.isRouteActive('system')) return
  recomputeAssembly()
}, 60_000)
```

`startBackgroundQOSMonitor`'s interval has **no `document.hidden` check**
— unlike every other polling interval in the codebase (see doctrine §3
above). Because System now fully unmounts off-tab (`b46f1ac`), this only
runs while the user is on the in-app System tab, but it keeps firing every
30 minutes even if the *browser* tab itself is backgrounded (switched away
from at the OS/browser level, phone locked, etc.) while System is still the
open in-app route — e.g. left open in a background browser tab overnight.

Why this matters for "buttons lagging":

- `analyzeIntentions()` has only a 5-minute internal cooldown
  (`intentionEngine.ts:263`); a 30-minute interval always clears it, so
  **every firing runs the real 151-pattern scan and writes the atom** — the
  exact expensive/cascading operation `be3e8fa` and `b219cc3` fixed
  elsewhere.
- Browsers throttle/coalesce timers in backgrounded tabs. When the tab
  regains focus, a backlog of delayed `setInterval` callbacks can fire back
  to back, or fire immediately on visibility change — landing a full
  pattern-scan-plus-cascade exactly when the user starts clicking again.
  This reproduces the "lag right after switching back" symptom reported in
  several of the fixed issues above, but from a path none of those fixes
  touched.

## 4. Suggested next steps

1. **Primary candidate fix** — gate the interval in
   `startBackgroundQOSMonitor` (`intentionEngine.ts:5129-5132`) the same way
   `recomputeAssembly`'s sibling interval is gated:
   ```ts
   _qosMonitorHandle = setInterval(() => {
     if (document.hidden) return
     analyzeIntentions()
     captureQOSSnapshot()
   }, QOS_INTERVAL_MS)
   ```
   Low risk, one-line, matches existing doctrine exactly — no behavior
   change while the tab is actually visible.
2. If lag is still reported after that fix, capture a Chrome Performance
   trace (or React Profiler flamegraph) around the moment of the click —
   none of the fixes to date were based on profiling data because no
   trace/profile artifacts exist in this repo (`docs/diagnostics/DEBUG-PROFILE.md`
   and `PROFILE-DEBUG-GUIDE.md` document a *process* for this but no captured
   trace was found from this investigation). A real trace would confirm
   whether the QOS monitor firing lines up with the reported lag, or
   surface a different long task.
3. Audit `About.tsx:239-244` (60s analytics-fetch interval, also ungated
   on `document.hidden`) — lower severity since it only touches local
   `setData` on the About page, not the shared `intentionEngine` atom, but
   it's the other interval in the codebase that doesn't follow the pattern.
