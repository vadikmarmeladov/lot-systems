# Button Lag / Rendering Performance — Diagnostic

**Date:** 2026-07-20
**Type:** Investigation (no code changes in this pass)
**Status:** 2 confirmed live regressions, same bug class as 3 recently-fixed commits

## Summary

Button/widget lag has been a recurring bug class in this codebase, fixed and
re-appearing in slightly different components five times in the last ~7 weeks
(SR-20260602-01, SR-20260603-01, `b219cc3`, `ee88f4c`, `6e5007a`). The most
recent fix landed yesterday (2026-07-19, commit `6e5007a`, merged via PR #88)
and eliminated a render-phase store write in `PatternRecognitionWidget`. This
investigation swept the rest of the client for the same two anti-patterns that
have caused every prior occurrence, to check whether other instances remain.

**Result: yes.** Two live instances of "store write during React's render
phase" and three live instances of "unguarded interval keeps running on
permanently-mounted, off-screen tabs" were found, unfixed.

## Root cause pattern (established doctrine)

Per `docs/benchmark/LOT-DOCTRINE.md` → *Render Isolation*:

1. Tabs (System, Sync, Settings, etc.) stay mounted with `display:none` when
   inactive rather than unmounting — so any interval or store subscription
   inside them keeps running and re-rendering off-screen.
2. Any function that writes to a nanostore/atom must not run inside
   `useMemo` — `useMemo` runs synchronously during React's render phase, so
   the write schedules subscriber re-renders *before the browser can paint*,
   which is felt as click/UI lag, especially when the write cascades to
   several other permanently-mounted subscriber widgets.

## Confirmed findings (not yet fixed)

### A. Render-phase store writes (same class as `6e5007a`)

| File | Line | Pattern | Frequency |
|---|---|---|---|
| `src/client/components/System.tsx` | 346 | `React.useMemo(() => getOptimalWidget(), [logs])` — `getOptimalWidget()` calls `analyzeIntentions()`, which calls `intentionEngine.set(...)` at `src/client/stores/intentionEngine.ts:2712` whenever its 5-min cooldown has elapsed | Periodic: fires whenever `logs` changes *and* the 5-min `analyzeIntentions` cooldown has expired — i.e. roughly every logs refetch after the cooldown window, on the main System tab |
| `src/client/components/MemoryWidget.tsx` | 268 | `React.useMemo(getQuantumState, [question?.id])` — `getQuantumState()` calls `analyzeIntentions()` directly (line 253) | Fires on every new quiz question load |

Both call the exact function (`analyzeIntentions`) whose render-phase
invocation was the root cause fixed in `b219cc3` (System.tsx's own
`quantumState` useMemo) and echoed again in `6e5007a`
(`PatternRecognitionWidget`). These two call sites reintroduce the same
pattern rather than being covered by either prior fix.

### B. Unguarded intervals in permanently-mounted tabs (same class as `ee88f4c`)

| File | Line | Interval | Guard present? |
|---|---|---|---|
| `src/client/components/QuantumRandomWidget.tsx` | 39, 65 | Two 1s `setInterval`s (one per `useQuantumNumber()` instance, mounted twice) driving `setState` every second, plus a 10s `setInterval` toggling `showPair` | **None** — no `isRouteActive`/`document.hidden` check |
| `src/client/components/MicroCalculatorWidget.tsx` | 71 | 10s `setInterval(check, 10000)` | **None** |
| `src/client/components/ui/Clock.tsx` | 26 (shared) | Used with `interval={5e3}` in `Sync.tsx:203` and `interval={1e3*60}` in `System.tsx:390,516` | **None** — the shared `Clock` component has no visibility gating at all |

`QuantumRandomWidget` is the most severe of these: it is mounted in
`System.tsx`, runs two independent 1-second timers forever once the System
tab has ever been visited, and each tick calls `setState` (a React
re-render), matching exactly the bug class `ee88f4c` fixed for
`SystemPulseWidget`'s 10s poll — except at 10x the frequency and on two
timers instead of one.

Already correctly gated (verified, not re-flagged): `EvolutionMilestoneToast`,
`ChakraErgonomicsWidget`, `ContextualPromptsWidget`, `SystemPulseWidget`, and
`SystemProgressWidget`'s `recomputeAssembly` interval — all check
`stores.isRouteActive('system')` and/or `document.hidden`.

### C. AudioContext-per-click (bug class of `bd9ef2a`)

No unfixed instances. All `AudioContext` construction sites (`sound.ts`,
`sovietChime.ts`, `sovietGameSounds.ts`, `sovietKeyboard.ts`,
`plannerWidget.ts`) use a reused module-level singleton.

### D. Other side-effecting `useMemo`s

Full sweep of ~65 `useMemo` call sites in `src/client` found no other
instances beyond A above — the rest are pure derivations (filter/map/sort)
with no store writes, fetches, or `localStorage` writes.

## Suspected user-facing symptom

Given (A) and (B) both live in `System.tsx` and are both wired into the
always-mounted System tab, the reported "buttons lagging" is most consistent
with: intermittent stutter on the System tab (every few minutes, when the
`analyzeIntentions` cooldown clears) plus a steady background tax — two 1Hz
re-renders forever — that compounds with any other work scheduled on the same
tick, exactly the "progressive stall" shape described in `6e5007a`'s commit
message but not fully eliminated by it.

## Recommended next steps

1. `System.tsx:346` — memoize `optimalWidget` the same way `6e5007a` fixed
   `PatternRecognitionWidget`: key the `useMemo` off a narrow derived value
   (e.g. `intentionEngine.get().recognizedPatterns`) instead of raw `logs`,
   or move the call into a `useEffect` + `useState` pair so the write lands
   after paint.
2. `MemoryWidget.tsx:268` — same treatment; `analyzeIntentions()` should not
   run inside `useMemo`.
3. `QuantumRandomWidget.tsx` — gate both `setInterval`s (lines 39, 65) on
   `stores.isRouteActive('system')`, matching the pattern already used in
   `ChakraErgonomicsWidget`/`ContextualPromptsWidget`.
4. `MicroCalculatorWidget.tsx:71` — same gating.
5. `ui/Clock.tsx` — consider adding visibility gating to the shared
   component itself (pause the interval via an IntersectionObserver or a
   `document.hidden`/route check) so every current and future caller gets
   the fix once, rather than patching each call site individually.
6. Given this is the fifth occurrence of the same two anti-patterns, it may
   be worth a lint rule / code-review checklist item ("no store-writing call
   inside `useMemo`"; "every `setInterval` in a component reachable from a
   permanently-mounted tab must check `isRouteActive`") rather than
   continuing to fix instances as they're discovered.

## Method

- Reviewed git log for prior lag/perf commits (`bd9ef2a`, `863b333`,
  `b219cc3`, `ee88f4c`, `6e5007a`) and their diffs.
- Read `docs/benchmark/LOT-DOCTRINE.md` (Render Isolation clause) and
  `docs/benchmark/LOT-SR-20260719-01.md` (yesterday's session report).
- Checked GitHub for open issues/PRs mentioning button/lag/render — none
  found; this bug class has so far only been tracked via benchmark session
  reports, not GitHub issues.
- Swept `src/client` for: store writes (`.set(`) inside `useMemo` bodies;
  `setInterval`/`setTimeout` calls without `isRouteActive`/`document.hidden`
  guards; `new AudioContext(` outside a singleton pattern; other
  side-effecting `useMemo`s. Findings above were individually verified by
  reading the referenced source lines.
