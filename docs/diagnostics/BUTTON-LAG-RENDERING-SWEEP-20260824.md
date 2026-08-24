<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Investigation Sweep

**Date**: August 24, 2026
**Trigger**: Scheduled diagnostic task — "investigate the buttons lagging issue and rendering problems"
**Branch**: `claude/brave-rubin-a1hpfa`
**Status**: 🟢 No active regression found — prior fixes hold at HEAD

---

## Scope

This was a recon sweep, not a response to a new bug report: no open GitHub issue or
PR currently mentions button lag (`search_issues` for "button lag rendering slow
click" → 0 results; the only open PR is #93, an unrelated calendar feature). The
sweep instead re-verified whether the button-lag class of bug — previously found
and fixed multiple times in this repo — has regressed at current `HEAD` (`98971f2`).

---

## History: this is a recurring failure class, not a one-off

Button/widget lag has been diagnosed and fixed **five separate times** in this
codebase, each time from the same root cause wearing a different hat:

| Commit | Date | Fix |
|---|---|---|
| `863b333` | fix: reduce widget lag — cap logs query and back off stats polling | Unbounded log queries + aggressive polling |
| `b219cc3` | perf: unblock render pipeline — move quantum state writes out of useMemo | First render-phase-write fix |
| `60bccff` | BENCHMARK: widget lag/PWA/hover/blank-msg/chat-gating | Broader pass |
| `ee88f4c` | perf: pause System background work off-tab to fix tab-switch freeze | Background timers running while tab hidden |
| `be3e8fa` | perf: fix two residual button-lag paths flagged by agent diagnostic | `MemoryWidget`, `SystemProgressWidget` (see below) |
| `9364aba` | perf: memoize last heavy per-render work in System subscriber widgets | `SignalStreamWidget`, `UserMetricsWidget` |

### Root cause pattern

Two variants of the same doctrine violation ("Render Isolation" — see
`System.tsx` comments) recur every time:

1. **Store write during render.** `analyzeIntentions()` (and similar functions)
   *write* to the `intentionEngine` nanostores atom. Calling it inside
   `useMemo`/render body — instead of `useEffect` — triggers a synchronous
   write mid-render, which cascades re-renders across every other component
   subscribed to that atom *before the browser can paint*. This shows up to
   the user as "click, then a beat, then it happens."
   - `be3e8fa`: `MemoryWidget`'s `getQuantumState()` called `analyzeIntentions()`
     inside a `useMemo` keyed on `question?.id`.
   - `b219cc3` (earlier instance): same pattern in `System.tsx`'s quantum-state
     computation.
   - `PatternRecognitionWidget.tsx:73`: `getOptimalWidget()` internally calls
     `analyzeIntentions()`; fixed by memoizing on already-analyzed `patterns`.

2. **Heavy synchronous work directly in a click handler.** `SystemProgressWidget`'s
   `handleGenerateReport` ran a ~139-pattern scan (`analyzeIntentions()` on a
   cooldown miss) synchronously inside `onClick`, blocking the button's visual
   response until the scan finished. Fixed in `be3e8fa` by deferring the work
   one macrotask (`setTimeout(build, 0)`) so the click responds instantly and
   the computation runs after.

3. **Unmemoized heavy per-render derivation** on widgets that stay mounted and
   re-render on every unrelated atom write (`9364aba`): `SignalStreamWidget`
   was copying+sorting up to 1000 signals on every render; `UserMetricsWidget`
   ran `getUserIndex()` + `classifyPhysiologicalCohort()` unmemoized on every
   render. Both fixed with `useMemo` keyed on `engine.signals`.

The `docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` doc referenced by
`be3e8fa`'s commit message (agent-authored diagnostic that drove that fix) is
no longer present in the tree — consistent with it having been a working
diagnostic doc consumed by the fix commit and later cleaned up, rather than
evidence of an unresolved issue.

---

## Current sweep (HEAD `98971f2`, 2026-08-24): no regression found

Re-checked every current call site of `analyzeIntentions()` and every
`useMemo` in `src/client/components` for the same anti-patterns:

- **`System.tsx`** (`src/client/components/System.tsx:264-271`): quantum
  state is seeded via `useState(() => getUserState())` and updated in
  `useEffect` keyed on `logs` — `analyzeIntentions()` and `recomputeAssembly()`
  both run post-paint. Comment in-code explicitly documents the doctrine
  ("Writing to nanostores atoms inside useMemo cascades 10 synchronous
  re-renders before the browser can paint").
- **`MemoryWidget.tsx:267-277`**: matches the `be3e8fa` fix — `useState` seed
  + `useEffect` keyed on `question?.id`.
- **`PatternRecognitionWidget.tsx:73-79`**: `getOptimalWidget()` memoized on
  `patterns` (not re-running on every signal write).
- **`SignalStreamWidget.tsx`** / **`UserMetricsWidget.tsx`**: memoization
  from `9364aba` intact, keyed on `engine.signals` / `engineState.signals`.
- **`SystemProgressWidget.tsx:1622-1635`**: `handleGenerateReport` still
  defers via `setTimeout(build, 0)`.
- **`Logs.tsx:3975`**: `/qos` trigger calls `analyzeIntentions()` inside an
  async command handler (not render/click-blocking path) — fine.
- **`System.tsx:231-240`** (newer code, merged in `73edd95` on 2026-08-05):
  `recordAstrologySignal(...)` — a store write — runs inside `useEffect`,
  gated by a `localStorage` once-per-day check. Correctly follows doctrine.
- **`QuantumEngineWidgets.tsx`** (newest widget file, added via PR #95/#96):
  `useMemo` calls (`userState`, `userIndex`, `cohortDirective`, `qosModeData`,
  `ecosystemNarrative`) are all read-only derivations, no writes; `onClick`
  handlers (`handleCarConnect`, etc.) are simple device-connect toggles, no
  heavy synchronous scans.
- No `useMemo` body anywhere in `src/client/components` currently calls
  `record*Signal`, `submit*`, `.set(`, `analyzeIntentions`, or
  `recomputeAssembly` — the grep that would have caught the `be3e8fa`/`b219cc3`
  pattern returns empty.

**Conclusion**: the specific failure class this repo has repeatedly hit
(render-phase store writes / synchronous scans in click handlers) is not
currently present in the codebase. Every prior fix location was re-inspected
and holds.

---

## `Button.tsx` itself

`src/client/components/ui/Button.tsx` is lean and not implicated in any of
the historical fixes:

- `PrimaryBtn` subscribes only to `stores.theme`.
- `SecondaryRoundedBtn` subscribes only to `stores.isMirrorOn`.
- Plain `secondary` kind has **no store subscription** at all.
- No `useMemo`/`useEffect`/side effects inside the component — it's a pure
  className composer. The lag has consistently originated in the *callers*
  (widgets driving heavy work from a click, or heavy per-render work
  elsewhere on the page that starves the button's paint), never in the
  `Button` component itself.

---

## Next steps / where to look if lag is reported again

Since no reproducer or new report currently exists, this sweep cannot
confirm a live issue — only that the known failure class hasn't regressed.
If a fresh report comes in:

1. **Ask which surface** (System tab, Memory, Logs, a specific widget) —
   every prior instance was widget-specific, not global.
2. **Re-run the same grep sweep** used here first (cheap, catches ~80% of
   prior incidents):
   ```
   grep -rn "useMemo(() =>" src/client/components --include="*.tsx" -A3 \
     | grep -E "record[A-Z]|submit[A-Z]|\.set\(|analyzeIntentions|recomputeAssembly"
   ```
3. **New widgets are the highest-risk surface.** Every regression so far
   came from a newly added widget re-implementing the quantum-state pattern
   without the `useState`-seed + `useEffect` idiom already established in
   `System.tsx`/`MemoryWidget.tsx`. Any new file under
   `src/client/components/*Widget.tsx` that calls `analyzeIntentions()`,
   `classifyPhysiologicalCohort()`, or similar `intentionEngine` reads should
   be checked against that idiom before merge.
4. **Headless-Chromium repro harness**: `be3e8fa` and `9364aba` were both
   verified with a headless-Chromium smoke test (`9364aba` specifically
   seeded 1000 signals + 500 logs and measured System↔Logs tab-switch cost).
   No such harness is currently checked into the repo as a reusable script —
   worth extracting into `scripts/` or `test/` if this class of bug recurs
   again, rather than re-authoring it per incident.
5. CSS-side causes (heavy `transition-all`, `backdrop-blur`, layout thrash)
   were not found in `Button.tsx`'s Tailwind classes, but were not
   exhaustively profiled across every screen in this pass — if a future
   report describes lag as a *visual* jank (not a *delayed-response* click)
   rather than "click does nothing for a beat," check `grid-fill-hover` and
   `transition-all` usage on the light-theme `PrimaryBtn` path next.

---

## Files referenced

- `src/client/components/ui/Button.tsx`
- `src/client/components/System.tsx`
- `src/client/components/MemoryWidget.tsx`
- `src/client/components/SystemProgressWidget.tsx`
- `src/client/components/SignalStreamWidget.tsx`
- `src/client/components/UserMetricsWidget.tsx`
- `src/client/components/PatternRecognitionWidget.tsx`
- `src/client/components/QuantumEngineWidgets.tsx`
- `src/client/components/Logs.tsx`
- `src/client/stores/intentionEngine.ts`

## Commits referenced

- `863b333`, `b219cc3`, `60bccff`, `ee88f4c`, `be3e8fa`, `9364aba`
