/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

# Button Lag & Rendering Diagnostic — 2026-07-28

Scheduled investigation into reported "buttons lagging" / rendering problems.
No GitHub issue or PR currently open on this; investigation is code- and
history-driven. Scope: `src/client/components/ui/Button.tsx` and its
callers, the render-isolation doctrine in `docs/benchmark/LOT-DOCTRINE.md`,
and every past perf-fix commit that touched button/render behavior.

## Summary

The historical "button lag" class of bugs (tab-switch stall, off-tab churn,
render-phase store writes) was diagnosed and fixed across a well-documented
series of PRs (#85, #87, #88, and doctrine entries SR-20260602-01 through
SR-20260719-01). Those fixes are **durably present** in current code — verified
directly, not assumed from commit messages. A separate, very recent crash
(`f4ca5a3`, merged ~5.5h before this report) took the whole app down in a way
that could plausibly be *reported* as "buttons not responding." On top of
that baseline, this investigation found **two live, code-grounded issues**
that were missed by prior perf passes:

1. A render-phase store write in `MemoryWidget.tsx` — the exact anti-pattern
   the project's own doctrine names and fixed elsewhere, but not here.
2. A synchronous, potentially-expensive `analyzeIntentions()` call wired
   directly into two button `onClick` handlers in `SystemProgressWidget.tsx`.

Neither is confirmed as *the* cause of a specific user report (none was
attached to this task) — both are concrete, reproducible code paths that
match the reported symptom class and are worth fixing regardless.

## 1. Recent full-app crash (likely root cause of any "frozen" reports today)

`f4ca5a3` ("fix: crash 'Cannot access userState before initialization' (prod
down)", merged 2026-07-28 00:38 UTC) fixed a temporal-dead-zone bug in
`analyzeIntentions()` (`src/client/stores/intentionEngine.ts:3066`, Pattern
135): it read the bare local `userState` before that `const` was declared at
line 3108, throwing on every render of the System tab and taking down the
whole app. The same commit also broke a circular import
(`ui/Layout.tsx` → `ui` barrel → `Layout` again) that esbuild code-splitting
could turn into the same crash class.

**Status: fixed.** Verified no other bare `userState` reads exist before the
line-3108 declaration. If "buttons lagging" reports came in before this fix
landed, a full white-screen crash is a far more likely explanation than
incremental lag — it would present as "nothing responds."

## 2. Confirmed-fixed history (verified against current code, not just commit messages)

| Symptom | Root cause | Fix | PR/commit | Status |
|---|---|---|---|---|
| Tab-switch progressive stall | `PatternRecognitionWidget` called `analyzeIntentions()` (which writes the `intentionEngine` atom) inside a render-phase `useMemo` with no memoization guard — store write during render cascaded re-renders across ~7-9 permanently-mounted System widgets | Memoized on `recognizedPatterns` so it only reruns when patterns actually changed | #88 / `6e5007a` | Present at `PatternRecognitionWidget.tsx:78` |
| Tab-switch freeze | Widgets stayed mounted (`display:none`) off-tab; `document.hidden` doesn't change on in-app nav so intervals never paused | `stores.isRouteActive(route)` gate added; `SystemProgressWidget`'s 60s recompute and `SystemPulseWidget`'s 10s poll now check it | #85 / `ee88f4c` | Present, `SystemProgressWidget.tsx:1454-1462` gates on `!document.hidden && isRouteActive('system')` |
| Widget lag on every signal | `recordSignal` synchronously `JSON.stringify`'d up to 1000 signal objects and ran a 125+ pattern scan per interaction | localStorage persist coalesced (one write per burst); `analyzeIntentions` deferred via `requestIdleCallback`/`setTimeout(0)` | #85, 863b333 | Present |
| Duplicate background work | `SystemProgressWidget` mounted twice (stray instance + grouped instance), doubling intervals and mount effects | Removed the stray mount | #87 | Present |
| Button re-renders on every theme/mirror toggle | `Button.tsx` was one component subscribing to both `stores.theme` and `stores.isMirrorOn` regardless of `kind` | Split into `PrimaryBtn` (theme only), `SecondaryRoundedBtn` (isMirrorOn only), plain `secondary` (zero subscriptions) | SR-20260603-02 | Present, `Button.tsx:65-131` |
| Planner buttons frozen | `AudioContext` recreated per click | Reused via module-level singleton | `bd9ef2a` | Present, `sovietChime.ts:31-37`, `plannerWidget.ts` |

## 3. New findings — still-live doctrine violations

### 3a. `MemoryWidget.tsx:253-268` — render-phase store write, unmemoized against the write's own trigger

```
const getQuantumState = () => {
  try {
    analyzeIntentions()          // WRITES the intentionEngine atom (intentionEngine.ts:3186-3193)
    return getUserState()
    ...
}
const quantumState = React.useMemo(getQuantumState, [question?.id])
```

`analyzeIntentions()` calls `intentionEngine.set(...)` synchronously
(`intentionEngine.ts:3186-3193`) — this is precisely the pattern
`LOT-DOCTRINE.md` names under "Render Isolation": *"work that WRITES to a
store must not run inside useMemo (render phase) — the writes schedule
subscriber re-renders before the browser can paint."* `PatternRecognitionWidget.tsx:78`
has the same call but is memoized on `patterns` (the store's own
`recognizedPatterns`), which is self-limiting — the 5-minute cooldown inside
`analyzeIntentions()` means it converges. `MemoryWidget`'s dependency is
`question?.id`, which is unrelated to `intentionEngine` state, so every time
a new Memory question loads, this fires a synchronous store write during
render, which — per the doctrine's own reasoning — schedules a cascading
re-render across every `intentionEngine` subscriber (multiple System-tab
widgets) before the browser paints the new question. This code path has
existed since `621ffa0` (2026-06-29), predating the `b219cc3` render-pipeline
fix (2026-07-19) that addressed the same bug class in
`PatternRecognitionWidget` but did not touch this file.

**Why this matters for "rendering problems":** every time the Memory tab
loads a new question, this can produce a visible re-render cascade — the
same failure mode documented for the tab-switch stall, just triggered by
question rotation instead of tab switching.

### 3b. `SystemProgressWidget.tsx:1518-1522` — synchronous pattern scan in two button click handlers

```
const handleGenerateReport = React.useCallback(() => {
  analyzeIntentions()
  const r = getEnrichedPhysiologicalReport()
  setReport(r)
  setQos(getQuantumOS())
  ...
```

Bound directly to `onClick={handleGenerateReport}` at `SystemProgressWidget.tsx:1964`
and `:2262` (the report/refresh buttons in the System tab). `analyzeIntentions()`
has a 5-minute cooldown (`intentionEngine.ts:263-265`) that makes it a cheap
no-op on most clicks, but on a cache-miss it runs the full ~139-pattern scan
over the signal history synchronously on the main thread, inside the click
handler, before any state updates — so the click will not visually respond
until the scan (plus `getEnrichedPhysiologicalReport()` and `getQuantumOS()`)
finishes. This is the exact "click, then a beat, then something happens"
symptom users describe as button lag, on whichever button triggers the
cache-miss path.

## 4. Reviewed and cleared (not causes)

- `.grid-fill-hover` CSS (`index.css:102-125`) only transitions `opacity` on
  a `::before` pseudo-element; background-image/size are static per state,
  not animated — cheap compositing, not a repaint storm.
- All 7 stats queries in `queries.ts` use `refetchInterval: 120000` +
  `refetchIntervalInBackground: false`.
- `TimeWidget.tsx`'s 1s interval only does a cheap hour comparison, no
  re-render unless the chime actually fires.
- Two low-severity ungated intervals exist (`intentionEngine.ts:4813`
  30-min QOS monitor, `MicroCalculatorWidget.tsx:71` 10s cheap check) —
  neither does expensive per-tick work; not implicated.
- No open GitHub issues or PRs reference button lag as of this report.

## 5. Recommended next steps

1. Fix `MemoryWidget.tsx:268` the same way `PatternRecognitionWidget.tsx:78`
   was fixed: move the `analyzeIntentions()` call to a `useEffect` keyed on
   `question?.id`, seed `quantumState` with `useState(() => getUserState())`
   for the first paint, matching the pattern already established in
   `System.tsx:262-268`.
2. Move `analyzeIntentions()` out of `handleGenerateReport`'s synchronous
   path — either defer via `setTimeout(0)`/`requestIdleCallback` (as already
   done for `recordSignal`, per doctrine "Async Signal Recording"), or show
   an immediate pending/optimistic UI state before running it.
3. No further action needed on the tab-switch/off-tab-churn class — it's
   confirmed fixed and should not need re-investigation unless a new
   regression is reported.
4. If a fresh "buttons lagging" report comes in, ask which specific button
   and tab — "Generate Report" in System and "next question" in Memory are
   now the two identified suspects; anything else would need new
   investigation.
