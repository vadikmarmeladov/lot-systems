<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Recurring Diagnostic

**Scope**: periodic audit of click-responsiveness and re-render cost across `src/client/components`
**Date**: August 16, 2026 (scheduled routine sweep)
**Status**: no open issue, no reproducible lag found — previous fixes verified holding, no regressions

---

## Why this doc exists

Commits `be3e8fa` (PR #94) and `9364aba` (PR #95, 2026-07-28) both reference an
"agent-authored" `docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` as the
source of their fixes, but that file was never actually committed to the repo —
only the fixes it prescribed landed. This doc recreates it as a living record
and adds the results of a fresh sweep, so future passes have a fixed point of
reference instead of re-deriving doctrine from commit messages.

## LOT-DOCTRINE: Render Isolation (recovered from commit history)

Two failure modes have caused real, shipped button lag in this codebase:

1. **Render-phase store write** — a store mutation (`analyzeIntentions()`,
   `record*()`, `recompute*()`, etc.) invoked inside `useMemo`/render body
   instead of `useEffect`. Because the store is subscribed by many widgets,
   the write cascades a re-render across every subscriber *before* the
   browser can paint the current frame — the classic "click, then a beat,
   then it happens" stutter.
2. **Synchronous heavy work in a click handler** — a click handler that runs
   an expensive scan (e.g. the ~139-pattern `analyzeIntentions()` full scan
   on a cooldown miss) directly, blocking the event handler — and therefore
   the button's visual response — until the scan finishes.

The fix pattern used both times: seed a `useState` for an identical first
paint, move the write into `useEffect` (runs after paint), and for handlers,
defer the heavy branch one macrotask (`setTimeout(fn, 0)` / equivalent) so
the click can paint its response immediately and the real work happens off
the event path.

## Prior incidents (for reference)

| Commit | PR | File | Violation | Fix |
|---|---|---|---|---|
| `be3e8fa` | #94 | `MemoryWidget.tsx` | `analyzeIntentions()` write inside `useMemo` keyed on `question?.id` | Moved to `useEffect` w/ `useState` seed |
| `be3e8fa` | #94 | `SystemProgressWidget.tsx` | `handleGenerateReport` ran `analyzeIntentions()` synchronously in the click handler | Deferred build one macrotask |
| `9364aba` | #95 | `SignalStreamWidget.tsx` | Copied+sorted up to 1000 signals every render | Memoized on `engine.signals` |
| `9364aba` | #95 | `UserMetricsWidget.tsx` | `getUserIndex()` + `classifyPhysiologicalCohort()` unmemoized every render | Moved into `useMemo` keyed on `engineState.signals`, before early returns |

## This sweep's findings (2026-08-16)

- **No open GitHub issues or PRs** mention button lag, rendering, or
  performance regressions (`search_issues`/`search_pull_requests` both
  scoped to `LOT-Systems/LOT-Computer`, zero relevant open results — the
  three PR hits were the historical #94 fix and two unrelated legacy PRs
  from Nov 2025).
- **Both prior fixes verified still in place** in current `master`:
  - `MemoryWidget.tsx:272-276` — `analyzeIntentions()` still runs inside
    `useEffect` keyed on `question?.id`, seeded via `useState(readQuantumState)`.
  - `SystemProgressWidget.tsx:1621-1629` — `handleGenerateReport` still
    defers the `analyzeIntentions()` + report build one macrotask past the
    click.
  - `SignalStreamWidget.tsx:45-47` — sort still memoized on `engine.signals`.
  - `UserMetricsWidget.tsx:97-98` — both heavy calls still memoized on
    `engineState.signals`.
- **No new instances of either violation found** in a repo-wide sweep of:
  - every `onClick=` handler for synchronous calls into
    `analyzeIntentions`, `getEnrichedPhysiologicalReport`,
    `classifyPhysiologicalCohort`, `recomputeAssembly`, `getQuantumOS()`
  - every `useMemo(...)` body for `record*`/`submit*`/`analyze*`/
    `recompute*`/`.set(` calls (store writes)
  - every `cycleView`/`cycle*` handler used by the widget carousels
- One adjacent read worth noting, not a bug: `IntegrityWidget.tsx:229-232`
  calls `intentionEngine.get()` + `analyzeIntegrity(state.signals)` inside a
  `useMemo` keyed on `logs` — this is a pure read (snapshot + pure compute),
  not a store write, so it doesn't trigger the cascade. Flagged here only so
  a future pass doesn't have to re-verify it from scratch.
- `Logs.tsx:3975` still calls `analyzeIntentions()` synchronously inside the
  `qos-report` slash-command trigger branch. This is a command dispatch path
  (not a widget button), and the call is cooldown-gated (no-op within 5 min
  per the `SystemProgressWidget.tsx:1622` comment), so it's lower-risk than
  the fixed cases — but on a cache-miss `/qos` invocation it would still run
  the full scan on the dispatch path. Not confirmed as user-visible lag;
  listed under Next Steps below rather than fixed speculatively.

## Next steps (if lag is reported again)

1. Reproduce with the headless-Chromium harness pattern from `9364aba`
   (seed `intentionEngine` with ~1000 signals + 500 logs, measure task
   duration across rapid tab/view switches) rather than fixing blind.
2. If `Logs.tsx:3975`'s `/qos` trigger is implicated, apply the same
   macrotask-defer pattern used in `SystemProgressWidget.tsx:1621-1629`.
3. Sweep any *new* widgets added since this date for the same two violation
   shapes before assuming a novel cause — regressions of the same doctrine
   violation are the most likely repeat offender in this codebase.
4. If neither violation shape reproduces the report, profile with the
   React DevTools Profiler / Chrome Performance panel for CSS-driven causes
   (animation/transition thrash, layout thrashing from unbatched DOM reads)
   — out of scope for this sweep since no reproducible case exists yet.
