# Button Lag & Rendering — Diagnostic Report

**Date:** 2026-07-07
**Class:** Investigation (no code changes in this pass)
**Scope:** Recurring "buttons feel laggy / frozen" reports across widgets

---

## 1. Summary

Button lag has been diagnosed and fixed **three separate times** in this repo,
each time in a single widget, under a different name:

| Date | Report | Widget fixed | Root cause |
|---|---|---|---|
| 2026-06-04 | `LOT-SR-20260604-01.md` | Biofield (~1.5s lag) | `recordSignal()` ran synchronously before visual feedback |
| 2026-06-22 | `LOT-SR-20260622-01.md` | MemoryWidget | Same `recordSignal()` pattern — `localStorage.setItem` + conditional `analyzeIntentions()` (60+ pattern matchers) blocking the render commit |
| 2026-07-04 | `bd9ef2a` (commit) | PlannerWidget | `new AudioContext()` created on every click; browser context cap eventually threw and killed the handler before `plannerWidget.set()` ran |

Each fix was applied **locally to the one widget that got reported**, not to
the shared function causing it. Grepping the current codebase shows both
root causes are still present at dozens of other call sites. This is very
likely why the lag keeps resurfacing under new widget names — it's the same
underlying bug, unfixed at the source.

---

## 2. Root cause #1 (primary suspect): `recordSignal()` is still synchronous

`recordSignal()` in `src/client/stores/intentionEngine.ts:166` does, on the
calling thread, every time it's invoked:

- `intentionEngine.get()` + array spread/filter/sort over up to `MAX_SIGNALS`
  (1000) signals
- `JSON.stringify` + `localStorage.setItem` of the full signal list
- conditionally (`recentSignals.length % 5 === 0`) a synchronous call into
  `analyzeIntentions()` — a large pattern-matching pass over signal history
- conditionally a `syncToServer()` call

The 2026-06-22 fix (`docs/benchmark/LOT-SR-20260622-01.md`, "MEMORY BUTTON LAG
FIX") diagnosed this precisely: *"recordSignal() called synchronously between
setClickedButtonIndex (visual feedback) and createMemory (API call)... Both
block the React render commit."* The fix moved **that one call site** into
`setTimeout(0)` and documented it as doctrine ("Async Signal Recording,
rev K") — `src/client/components/MemoryWidget.tsx:139`.

`recordSignal()` itself was never changed. Every other call site still calls
it inline, synchronously, as the first statement in a click handler, before
the visual state update:

- `src/client/components/PlannerWidget.tsx:53` — `handleSetPlan()` calls
  `recordSignal(...)` **before** `createLog(...)` and `setCompletionMessage(...)`.
  This is the same widget whose buttons were "fixed" on 2026-07-04, but only
  the `AudioContext` piece of that report was patched — this earlier
  blocking call is still there.
- `src/client/components/IntentionsWidget.tsx:83` — `handleSetIntention()`
  calls `recordSignal(...)` before `localStorage.setItem`, `setIntention`,
  `setInputValue`, `setIsSettingIntention`, `setView`.
- `src/client/components/InterventionsWidget.tsx:38`,
  `EmotionalCheckIn.tsx:192`, `SelfCareMoments.tsx:193`,
  `EnergyCapacitor.tsx:51`, `GoalJourneyWidget.tsx:48`,
  `ChakraErgonomicsWidget.tsx:59`, `ChatCatalystWidget.tsx:51`,
  `RecipeWidget.tsx:253`, `CohortConnectWidget.tsx` (4 call sites),
  `QuantumEngineWidgets.tsx` (6 call sites), `MicroCalculatorWidget.tsx`
  (2 call sites), `MicroGameWidget.tsx:779`, `MicroImageWidget.tsx`
  (2 call sites), `QuantumRandomWidget.tsx:46`,
  `PatternInsightsWidget.tsx` (3 call sites),
  `ContextualPromptsWidget.tsx` (2 call sites) — same pattern, unpatched.

**Fix direction:** don't chase this one widget at a time. Either make
`recordSignal()` itself defer its localStorage/analysis work (wrap the body
after the in-memory `.set()` in a `setTimeout(0)`/microtask), or provide a
`recordSignalAsync()` wrapper and switch all ~40 call sites to it. The
in-memory `intentionEngine.set()` (cheap) can stay synchronous for
consistency; the localStorage write + `analyzeIntentions()` pass is the
expensive part and is what should move off the click path.

---

## 3. Root cause #2 (secondary, same class as the Planner AudioContext bug):

`src/client/utils/sovietGameSounds.ts:15` — `getCtx()` — creates
`new AudioContext()` with **no try/catch**, unlike every other AudioContext
helper in the codebase that was hardened after the 2026-07-04 Planner
incident:

- `src/client/stores/plannerWidget.ts:246` (`getAudioContext`) — try/catch, returns `null` on failure
- `src/client/utils/sovietKeyboard.ts:29` (`getCtx`) — try/catch, returns `null` on failure
- `src/client/utils/sovietGameSounds.ts:15` (`getCtx`) — **no try/catch**, return type is `AudioContext` (non-nullable)
- `src/client/utils/sovietChime.ts:33` (`getAudioContext`) — **no try/catch**, same shape

None of the eight `play*Sound()` exports in `sovietGameSounds.ts` wrap their
own call to `getCtx()` in try/catch either. These are called directly from
the on-screen D-pad buttons in `MicroGameWidget.tsx` (lines 959-965,
`<Button onClick={handleUp}>` etc.) and from inside the `setInterval` game
loop (lines 803-818: `playLineClearSound`, `playGameOverSound`,
`playScoreSound`, `playEnemyHitSound`).

If AudioContext creation throws here (autoplay-policy rejection, context cap,
etc.), it's uncaught. In the D-pad handlers the ref mutation happens before
the sound call, so the game state itself won't visibly freeze — but every
subsequent press keeps re-throwing (since a failed `getCtx()` never
recovers), spamming the console on every button press, and inside the
`setInterval` tick it aborts whatever remaining logic follows the throw
point. `TimeWidget.tsx:103` (`playSovietChime`, also unhardened) has the same
gap but fires at most once an hour, so it's lower exposure.

**Fix direction:** apply the same try/catch pattern already used in
`plannerWidget.ts` / `sovietKeyboard.ts` to `sovietGameSounds.ts` and
`sovietChime.ts`.

---

## 4. Things already fixed and confirmed NOT the current cause

- Tab-switch lag / label shift — fixed in `1271cd3` (`will-change: opacity`
  on `.grid-fill-hover::before`, `React.memo` on Logs/System/Sync/Settings)
  and `b68e842` (`React.memo` on TabPanels/DynamicRoutes). Verified still in
  place in `src/client/index.css:120` and the memoized components.
- `Button.tsx` itself (`src/client/components/ui/Button.tsx`) is already
  split into `PrimaryBtn`/`SecondaryRoundedBtn`/plain-secondary variants
  specifically so each subscribes to only the one store it needs — no
  over-subscription found here.
- Planner `AudioContext`-per-click bug — fixed in `bd9ef2a` (shared,
  try/catch-wrapped context). Confirmed fixed; see Section 3 for the
  sibling files that never got the same treatment.

---

## 5. What this pass could not check

GitHub API access (`mcp__github__*`) returned "token expired" for this
session, so open issues/PRs and any user-reported bug threads could not be
cross-referenced — this report is based entirely on git history, committed
session reports under `docs/benchmark/`, and static code inspection. Re-run
the issue/PR search once the GitHub connector is re-authorized to check for
newer user reports not yet reflected in commits.

No runtime profiling (React DevTools Profiler, Chrome Performance panel) was
captured in this pass — the findings above are structural (same diagnosed
bug class recurring at unpatched call sites), not measured. Recommend
profiling `handleSetPlan` / `handleSetIntention` on click to confirm the
`recordSignal()` blocking-time hypothesis with real numbers before rolling
the fix out to all ~40 call sites.

---

## 6. Suggested next steps, in order

1. Profile one affected widget (Planner or Intentions) clicking through
   React DevTools Profiler to confirm `recordSignal()` shows up as a long
   synchronous task on the click.
2. Defer the expensive tail of `recordSignal()` (localStorage write +
   `analyzeIntentions()`) behind a `setTimeout(0)`/microtask inside the
   function itself, rather than patching call sites one at a time.
3. Add try/catch to `sovietGameSounds.ts:getCtx()` and
   `sovietChime.ts:getAudioContext()`, matching the pattern already in
   `plannerWidget.ts` and `sovietKeyboard.ts`.
4. Re-run the GitHub issue/PR search once the connector is re-authorized to
   confirm no other reported cause is being missed.
