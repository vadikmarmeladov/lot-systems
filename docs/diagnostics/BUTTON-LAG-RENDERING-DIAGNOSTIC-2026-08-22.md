<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation Report

**Date**: August 22, 2026
**Trigger**: Scheduled automated investigation ("investigate the buttons lagging issue and rendering problems")
**Branch**: `claude/brave-rubin-74lk2i`
**Status**: ✅ NO ACTIVE REGRESSION FOUND — prior fixes intact, doctrine holding

---

## 🔍 Summary

This was a scan for a reported "buttons lagging" issue. No new report, issue, or
failing check triggered it — it's a periodic sweep. Conclusion: the button-lag
problem was already diagnosed and fixed on **July 28, 2026** (PRs #94, #95), and
nothing merged since has reintroduced the pattern. Spot-checks of the widgets
most likely to regress (`System.tsx`, `PatternRecognitionWidget.tsx`,
`QuantumEngineWidgets.tsx`, `Logs.tsx`) show the fix's render-isolation rule is
still being followed correctly.

---

## 📜 What was already fixed (July 28, 2026)

Two commits, both on `claude/quantum-engine-widgets-RgFfC`, merged via PR #94
and PR #95:

### PR #94 — [`be3e8fa`](../../commit/be3e8fae8e799944bb35509d28ffd6b4e7c5c582) "perf: fix two residual button-lag paths flagged by agent diagnostic"

Root cause: **render-phase store writes**. `analyzeIntentions()` writes the
`intentionEngine` nanostore atom. Calling it from inside a `useMemo`/click
handler during the render/commit phase cascades synchronous re-renders across
every `intentionEngine` subscriber *before the browser can paint* — this is
what reads to a user as "I clicked, there was a beat, then it happened."

- `MemoryWidget.tsx`: `analyzeIntentions()` ran inside a `useMemo` keyed on
  `question?.id` (a render-phase atom write). Fixed by seeding state with
  `useState` for an identical first paint, then running the write in a
  `useEffect` (after paint) — matching the pattern already used in
  `System.tsx`.
- `SystemProgressWidget.tsx`: `handleGenerateReport` (the report-generation
  button) ran `analyzeIntentions()` — a ~139-pattern scan on a cooldown miss —
  synchronously inside the `onClick` handler, blocking the click from
  responding until the scan finished. Fixed with `setTimeout(build, 0)` so the
  click responds instantly and the scan runs on the next macrotask.

### PR #95 — [`9364aba`](../../commit/9364aba5d89615f7b2d03db0d42fa0cb2829478d) "perf: memoize last heavy per-render work in System subscriber widgets"

Root cause: **unmemoized heavy derivations on every re-render**, not just on
data change.

- `SignalStreamWidget.tsx`: copied + sorted up to 1000 signals on *every*
  render, including renders triggered by unrelated `intentionEngine` writes.
  Memoized on `engine.signals`.
- `UserMetricsWidget.tsx`: `getUserIndex()` + `classifyPhysiologicalCohort()`
  ran unmemoized on every render. Moved into `useMemo` keyed on
  `engineState.signals`, placed before the early returns per Rules of Hooks.

Reproduced with a headless-Chromium harness seeded with 1000 signals + 500
logs; 5 rapid System↔Log tab switches went from a heavy task per switch down
to a one-time ~118ms System mount.

Both PRs reference an agent-authored diagnostic,
`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md`. That file was never
committed to the repo (session-local artifact) — this report supersedes it as
the durable record.

---

## ✅ Current-state check (August 22, 2026)

No commits, PRs, or issues mentioning `button`, `lag`, or rendering
performance exist between `be3e8fa` (Jul 28) and `HEAD` (`98971f2`). Files
touched since the fix that are relevant to the pattern:

- `System.tsx`, `SystemProgressWidget.tsx`, `PatternRecognitionWidget.tsx`,
  `QuantumEngineWidgets.tsx`, `UserMetricsWidget.tsx`, `SignalStreamWidget.tsx`,
  `Logs.tsx`, `About.tsx`

Reviewed each for the two anti-patterns above:

- `System.tsx:263-271` — `analyzeIntentions()` still isolated inside
  `useEffect`, keyed on `[logs]`, with a `useState` seed for first paint.
  Comment explicitly documents the doctrine ("Render Isolation").
- `PatternRecognitionWidget.tsx:72-78` — `getOptimalWidget()` (which calls
  `analyzeIntentions()`) is memoized on `patterns`, not called in the render
  body.
- `QuantumEngineWidgets.tsx:172-264` — all `recordSignal(...)` calls for the
  ecosystem-connect buttons (car/home/computer/phone/watch/robot) fire from
  inside their respective `onClick` handlers, which is the correct place for
  a user-triggered write (not render phase).
- `Logs.tsx:3974-3975` — the `/qos` trigger's `analyzeIntentions()` call runs
  inside a `useEffect` reacting to text-value changes, not inside the render
  body or a synchronous click path.
- `Button.tsx` itself is clean: `PrimaryBtn` and `SecondaryRoundedBtn`
  subscribe to exactly one nanostore each (`theme`, `isMirrorOn`), the
  `secondary` kind subscribes to nothing, and no widget does heavy work in the
  button component itself — all click-triggered heavy work lives in the
  calling widgets covered above.

No open GitHub issues or PRs reference lag/slow/performance for this repo as
of this scan.

---

## 🧭 Doctrine (for future changes)

Two rules, now proven twice against real user-visible lag:

1. **Never write a nanostore atom during render** (i.e. inside a component
   body or a `useMemo`/`useState` initializer that runs on every render).
   Seed with `useState(() => readOnlyRead())` for the first paint, then write
   in a `useEffect` keyed on the actual dependency.
2. **Never run expensive derivation work inside an `onClick` handler
   synchronously if it can be deferred.** Update whatever UI state makes the
   click *feel* instant first; defer the heavy computation with
   `setTimeout(fn, 0)` or an effect.
3. **Memoize heavy per-render derivations** (sorts/copies over signal or log
   arrays, classification calls) on the actual data dependency, not
   recomputed on every render a subscriber widget receives.

## Next steps

None required right now — no active regression. Recommended as ongoing
hygiene, not urgent:

- When adding a new widget that subscribes to `intentionEngine` or calls
  `analyzeIntentions()`/`getUserIndex()`/`classifyPhysiologicalCohort()`,
  apply the three rules above before merging.
- No profiling/APM tooling currently reports button-response times in
  production, so a real regression would currently only surface via user
  report or a future headless-Chromium smoke test like the one used in
  `9364aba`. Worth considering a lightweight synthetic check (e.g. a Playwright
  smoke test asserting time-to-click-response) if this class of bug recurs.
