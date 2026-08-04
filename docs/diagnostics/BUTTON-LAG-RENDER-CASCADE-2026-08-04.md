<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation Report

**Date**: August 4, 2026
**Trigger**: Scheduled investigation — "buttons lagging issue and rendering problems"
**Branch**: `claude/brave-rubin-zmkgs7`
**Status**: 🟡 ROOT CAUSE PATTERN IDENTIFIED (not yet fixed) — this is a diagnostic-only pass

---

## 1. Summary

Button lag on this repo has a long, well-documented history (5+ dedicated perf
commits since June 2026), and the previously-identified root causes are all
fixed on `master` as of the last perf commit (`9364aba`, Jul 28 2026). This
report:

1. Confirms the prior fixes are intact and working as designed.
2. Identifies **one still-live instance of the same anti-pattern** the prior
   fixes were written to eliminate — six `System` tab widgets call
   `recordSignal()` directly in the render body (not inside `useEffect`),
   which is exactly the "render-phase store write" bug that was fixed once
   already in `MemoryWidget.tsx` (commit `be3e8fa`) but was never generalized
   to the rest of the codebase.

No code changes were made in this pass — findings and a recommended fix are
documented below for a follow-up session.

---

## 2. Prior fix history (confirmed intact)

This repo has fixed button-lag / System-tab rendering issues repeatedly. All
of the following are present and correct on `master`:

| Date | Commit | Fix |
|---|---|---|
| 2026-06-03 | `SR-20260603-02` | `Button.tsx` split into 3 kind-specific inner components so most buttons carry zero store subscriptions (`src/client/components/ui/Button.tsx:65-132`) |
| 2026-06-04 | `SR-20260604-01` | Biofield button lag — `recordSignal()` deferred via `setTimeout(0)` so cascade animation isn't blocked by synchronous `localStorage` |
| 2026-06-22 | `SR-20260622-01` | Memory button lag — `recordSignal()` moved out of the synchronous path between visual feedback and the API call |
| 2026-07-19 | `ee88f4c` | System tab paused/unmounted background work when inactive (`b46f1ac`, `6e5007a`, `ee88f4c`) — fixes the "can't leave System tab" freeze |
| 2026-07-19 | `ee88f4c` | **Root-level fix in `intentionEngine.ts`**: `recordSignal()` now only does a cheap array copy/filter synchronously; `localStorage` persistence is coalesced via `schedulePersist()` (250ms debounce) and `analyzeIntentions()` is deferred via `deferHeavy()` (`requestIdleCallback`, falling back to `setTimeout`) — see `src/client/stores/intentionEngine.ts:166-253` |
| 2026-07-28 | `be3e8fa` | `MemoryWidget.tsx`: moved a render-phase `analyzeIntentions()` call (inside `useMemo`) into `useEffect` — this was cascading re-renders across every `intentionEngine` subscriber on every new Memory question |
| 2026-07-28 | `be3e8fa` | `SystemProgressWidget.tsx`: `handleGenerateReport` deferred its `analyzeIntentions()` + report build one macrotask so the click responds before the ~139-pattern scan runs |
| 2026-07-28 | `9364aba` | `SignalStreamWidget.tsx` / `UserMetricsWidget.tsx`: memoized per-render sort/classification work keyed on `engine.signals` |

**Net effect of the July 19 fix**: `recordSignal()` itself is no longer
expensive to call synchronously from a click handler — the ~15 remaining
click-handler call sites (`PatternInsightsWidget.tsx`, `CohortConnectWidget.tsx`,
`IntentionsWidget.tsx`, `ChatCatalystWidget.tsx`, `QuantumEngineWidgets.tsx`,
`MicroGameWidget.tsx`, `QuantumRandomWidget.tsx`, `JournalReflection.tsx`,
`AwarenessDashboard.tsx`, `NarrativeWidget.tsx`) were checked and are **not**
a current lag source — they call into an already-deferred path.

---

## 3. New finding: render-phase `recordSignal()` calls (unfixed)

Six `System`-tab widgets call `recordSignal()` directly in the component
render body, guarded only by a `useRef` "once per mount" flag — **not**
inside a `useEffect`:

| Widget | Location | Guard |
|---|---|---|
| `EnergyCapacitor.tsx` | `:50-57` | `if (!hasRecordedRef.current && energyState)` |
| `InterventionsWidget.tsx` | `:37-44` | `if (!hasRecordedRef.current)` |
| `CohortConnectWidget.tsx` | `:44-53` | `if (!hasRecordedRef.current && cohortData?.matches?.length)` |
| `GoalJourneyWidget.tsx` | `:46-54` | `if (!hasRecordedRef.current)` |
| `ChakraErgonomicsWidget.tsx` | `:62-72` | `if (!hasInitRef.current)` |
| `MicroImageWidget.tsx` | `:248-258` | `if (!hasRecordedRef.current && punctuation.sampleSize > 0)` |

Every one of these is mounted directly inside `System.tsx`
(`InterventionsWidget` :744, `EnergyCapacitor` :752, `ChakraErgonomicsWidget`
:755, `GoalJourneyWidget` :761, `CohortConnectWidget` :954, `MicroImageWidget`
:973) — the **same tab** that hosts the seven components subscribed to the
`intentionEngine` store (`SystemPulseWidget`, `UserMetricsWidget`,
`QuantumEngineWidgets`, `QuantumStateWidget`, `SignalStreamWidget`,
`PatternRecognitionWidget`, `AIFeedbackWidget`).

### Why this matters

`recordSignal()` calls `intentionEngine.set(...)` synchronously
(`src/client/stores/intentionEngine.ts:226-229`) before doing any of its
deferred work. A nanostore `.set()` call notifies all subscribers
synchronously. When it fires **during another component's render** (as
opposed to an event handler or effect), React has no chance to batch it
cleanly — this is the identical failure mode already diagnosed and fixed
once in `MemoryWidget.tsx` (`be3e8fa`):

> "`analyzeIntentions()` (a store write) ran inside a `useMemo` keyed on
> `question?.id` — a render-phase atom write that cascaded re-renders
> across all `intentionEngine` subscribers every time a new Memory
> question loaded."

The six widgets above reproduce the same shape of bug with `recordSignal()`
instead of `analyzeIntentions()`: any time one of them completes its first
successful data-fetch render on the System tab (each has its own React Query
load, so these fire independently, not all at once), it can trigger a
synchronous re-render pass across the 7 `intentionEngine`-subscribed widgets
mid-render. On a System tab with async data resolving at slightly different
times, this reads as the same "stutter" / delayed responsiveness pattern
already reported as "button lag," even though no button click is directly
involved this time — it's triggered by data arriving while the tab is open.

This is a **plausible, not yet confirmed-in-production** cause: it wasn't
reproduced against a profiling trace in this pass (no profiler run was
available), it's inferred from the code shape matching a previously-confirmed
bug class exactly. It should be verified with a headless-Chromium repro
(seeded signals + slow-resolving queries for the 6 widgets) the same way
`9364aba` and `be3e8fa` verified their fixes, before treating it as
confirmed.

### Recommended fix (not applied in this pass)

Match the pattern already established in `MemoryWidget.tsx` /
`System.tsx`: move each guarded `recordSignal()` block into a `useEffect`
with the same dependency (data-ready condition), keeping the `useRef` guard
for the "once per mount" semantics. This defers the store write to after
paint/commit for all six widgets, consistent with the "Async Signal
Recording doctrine" referenced in `MemoryWidget.tsx:267-274`.

---

## 4. Other areas checked, ruled out

- **`Button.tsx` itself** — already split by `kind` so most instances (the
  `secondary` default) subscribe to nothing. No regression found.
- **CSS animations / transitions** — `Button.tsx` and `GhostButton` use
  Tailwind `transition-all` / `transition-[background-color]` on hover
  states only, not on click; nothing found that would block click response.
- **Direct `analyzeIntentions()` calls outside `recordSignal()`** — only 3
  call sites exist (`Logs.tsx:3609` on the deliberate `/qos` slash command,
  `SystemProgressWidget.tsx:1452` inside `useEffect`,
  `MemoryWidget.tsx:274` inside `useEffect`). All are already correctly
  deferred/post-paint.
- **Open PR #93** (`claude/dreamy-babbage-4iv1xo`, "Psychological Depth
  Analysis System") is unrelated to rendering — it's an unmerged, conflicting
  (`mergeable_state: dirty`) feature PR, not currently affecting `master`.

---

## 5. Next steps

1. Reproduce the render-phase cascade with a headless-Chromium harness
   (seed slow/staggered React Query responses for the 6 widgets on System
   tab mount) to confirm the theorized cascade actually measurably degrades
   frame time, following the same methodology `9364aba` used.
2. If confirmed, apply the `useEffect` fix to all 6 widgets in one pass
   (same shape of change, low risk, consistent with existing doctrine).
3. Grep the codebase periodically for `recordSignal(` / `analyzeIntentions(`
   appearing outside a `useEffect`/handler body — this is the third time
   this exact pattern has recurred (Memory, SystemProgressWidget, now these
   6) and would benefit from a lint rule or a shared `useSignalOnMount()`
   hook so new widgets can't reintroduce it.
