<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering Diagnostic

Automated investigation, 2026-08-29. Scope: recent commits, PRs, and live
code for the "buttons feel laggy" / rendering-jank class of report.

## Summary

Two prior fix passes (PR #94, PR #95, both merged into `master` on
2026-07-28) already addressed the two most severe instances of the
underlying bug class: **a nanostores atom write executing synchronously
during React's render phase**, which cascades a burst of re-renders across
every `intentionEngine` subscriber before the browser can paint. That is
what actually reads as "click, then a beat, then it happens."

While re-auditing all `analyzeIntentions()` call sites for regressions, one
call site was found that **still has the fixed bug** —
`PatternRecognitionWidget.tsx` — apparently missed by both prior passes
because its symptom is intermittent (cooldown-gated) rather than on every
render, so it didn't show up in a short profiling session.

No open GitHub issue or PR currently tracks button lag (checked via
`search_issues` / `list_pull_requests` on 2026-08-29) — this doc is the
first record of the residual case below.

## Background: the doctrine and the two fixed cases

`analyzeIntentions()` (`src/client/stores/intentionEngine.ts:258`) is a
~156-pattern behavioral scan over up to 1000 signals. It has a 5-minute
cooldown (`intentionEngine.ts:263`): inside the window it's a cheap read
(`return state.recognizedPatterns`), but on a cache miss it runs the full
scan and unconditionally calls `intentionEngine.set(...)`
(`intentionEngine.ts:3443`) with a **new** `recognizedPatterns` array
reference — which fires every `useStore(intentionEngine)` subscriber.

Calling `analyzeIntentions()` (directly or via a wrapper like
`getOptimalWidget()`) inside `useMemo`/render body means that atom write
happens *during render*, not after paint. Two components had this bug and
were fixed in commit `be3e8fae` ("perf: fix two residual button-lag paths
flagged by agent diagnostic", PR #95):

- **`MemoryWidget.tsx`** — `analyzeIntentions()` ran inside a
  `useMemo(..., [question?.id])`. Fixed by seeding state with
  `React.useState` for an identical first paint, then running the analysis
  in a `React.useEffect` (`MemoryWidget.tsx:267-276`).
- **`SystemProgressWidget.tsx`** — `handleGenerateReport` ran
  `analyzeIntentions()` synchronously inside the button's click handler,
  blocking the click response until the scan finished. Fixed by deferring
  the whole build one macrotask via `setTimeout(build, 0)`
  (`SystemProgressWidget.tsx:1621-1633`).

`System.tsx` already used the correct pattern
(`useState` seed + `useEffect`, `System.tsx:266-270`), and a companion
commit `9364aba5` ("perf: memoize last heavy per-render work in System
subscriber widgets", PR #94) memoized unrelated heavy per-render work in
`SignalStreamWidget.tsx` and `UserMetricsWidget.tsx` that was redone on
every re-render this bug class caused.

## Residual case: `PatternRecognitionWidget.tsx` (not fixed)

`src/client/components/PatternRecognitionWidget.tsx:72-78`:

```tsx
const patterns = engine.recognizedPatterns
// getOptimalWidget() calls analyzeIntentions(), which WRITES the
// intentionEngine atom — calling it in the render body meant a store write
// during render on every re-render, cascading re-renders across all
// subscribers. Memoize on the already-analyzed patterns so it does not
// re-run (and cannot write) on every signal.
const optimal = React.useMemo(() => getOptimalWidget(), [patterns])
```

`getOptimalWidget()` (`intentionEngine.ts:3666-3667`) unconditionally calls
`analyzeIntentions()`. The comment's reasoning — that keying the memo on
`patterns` (`engine.recognizedPatterns`) stops it from writing — is
incomplete:

- **`useMemo` always executes on mount**, regardless of the dependency
  array (there is no "previous" value to diff against). Every time this
  widget mounts — i.e. every time a user opens the System tab, since it's
  rendered unconditionally at `System.tsx:1014` — the memo runs
  `getOptimalWidget()` → `analyzeIntentions()` during render.
- The dependency itself, `patterns`, **is the exact atom field
  `analyzeIntentions()` writes**. So the memo is self-referential: it reads
  the last value of the thing it's about to overwrite.
- If the 5-minute cooldown has expired by the time the tab is opened (easy
  — 5 minutes is shorter than most sessions on another tab), this mount
  triggers the full ~156-pattern synchronous scan **during React's render
  phase**, then writes a new `recognizedPatterns` reference, which
  re-renders this widget plus every other `useStore(intentionEngine)`
  subscriber on the page (`System.tsx`, `SignalStreamWidget`,
  `UserMetricsWidget`, `SystemProgressWidget`, etc.) — the same cascade
  documented and fixed for `MemoryWidget`/`SystemProgressWidget` in
  `be3e8fae`.

This reproduces as: switch away from System for 5+ minutes, switch back —
first paint blocks on the scan, then a second cascading render pass. It's
intermittent (cooldown-gated) rather than on every render, which likely
explains why it survived both the `be3e8fae` and `9364aba5` passes — a
short profiling session can land entirely inside the cooldown window and
see nothing.

### Suggested fix (not applied by this investigation — doc only)

Mirror the `MemoryWidget.tsx:267-276` / `System.tsx:266-270` pattern:
seed `optimal` with `React.useState(() => getOptimalWidget())` for an
identical first paint, then recompute it inside a `React.useEffect` keyed
on `patterns` (or on mount) so the analysis — and its store write — happens
after paint instead of during render.

## Other areas checked, no issue found

- All other `useMemo`/`useCallback` call sites under
  `src/client/components/**` were greped and spot-checked; none besides
  `PatternRecognitionWidget.tsx` call `analyzeIntentions()` (directly or
  via `getOptimalWidget()`) from the render path. `System.tsx`,
  `SystemProgressWidget.tsx`, `MemoryWidget.tsx`, and `Logs.tsx` all call it
  from `useEffect`, an interval, or an explicit user-triggered log-command
  handler.
- `classifyPhysiologicalCohort()`, used in `useMemo` in
  `QuantumEngineWidgets.tsx`, `SystemPulseWidget.tsx`, and
  `ArchitectWidget.tsx`, does not call `analyzeIntentions()` and does not
  write the store — read-only, no render-isolation concern.
- `Button.tsx` / `ui/Button.tsx` itself has no store-write or heavy compute
  in its render path; `PrimaryBtn` and `SecondaryRoundedBtn` each subscribe
  to exactly one narrow store (`stores.theme`, `stores.isMirrorOn`) and the
  plain `secondary` kind subscribes to nothing. The lag pattern is not in
  the button primitive — it's in what re-renders *around* buttons when a
  parent's atom write cascades.

## Next steps

1. Apply the suggested fix to `PatternRecognitionWidget.tsx` (small, same
   shape as the two already-merged fixes — low risk).
2. After fixing, re-run the headless-Chromium repro used for `be3e8fae`
   (`be3e8fae`'s message references "Verified green + clean render via
   headless-Chromium smoke test") but seed `lastAnalysis` to force a
   cooldown-miss on mount, to actually exercise this path — a same-session
   smoke test would land inside the cooldown window and falsely pass, as
   apparently happened twice already.
3. Longer term: `analyzeIntentions()`'s "unconditionally write a new array
   reference even when `recomputeAssembly`/pattern content is unchanged" is
   what makes render-phase calls dangerous in the first place. Consider
   returning the previous `recognizedPatterns` reference when the computed
   pattern list is shallow-equal to the prior one, so a write that changes
   nothing doesn't fan out a re-render cascade. That would make this whole
   bug class inert even if a future widget reintroduces a render-path call.
