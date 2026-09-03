# Button Lag / Rendering Diagnostic — 2026-09-03

Scheduled investigation into button responsiveness and rendering
performance. No new user report triggered this pass — it is a periodic
health check following the two prior button-lag fix rounds
(PRs [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94),
[#95](https://github.com/LOT-Systems/LOT-Computer/pull/95), both merged
2026-07-28) and the earlier tab-switch-stall fixes
([#85](https://github.com/LOT-Systems/LOT-Computer/pull/85),
[#87](https://github.com/LOT-Systems/LOT-Computer/pull/87),
[#88](https://github.com/LOT-Systems/LOT-Computer/pull/88), 2026-07-19).

## Prior fixes (context)

The button-lag issue has a well-established pattern in this codebase: a
store write (`analyzeIntentions()`, `recomputeAssembly()`) runs
synchronously during React's render phase or inside a click handler,
cascading re-renders across every subscriber of the shared
`intentionEngine` / `selfAssembly` nanostores atoms before the browser can
paint. Two fix rounds have already addressed six instances of this:

- `MemoryWidget.tsx` — `analyzeIntentions()` moved out of a `useMemo` into
  a post-paint `useEffect` (be3e8fa).
- `SystemProgressWidget.tsx` `handleGenerateReport` — deferred one
  macrotask so the click responds before the ~139-pattern scan runs
  (be3e8fa).
- `SignalStreamWidget.tsx`, `UserMetricsWidget.tsx` — heavy per-render
  sort/classification work memoized (9364aba).
- `System.tsx`, `SystemProgressWidget.tsx` (earlier round) — render-phase
  atom writes moved to effects; System tab unmounted when inactive to stop
  background churn (6e5007a, b46f1ac, ee88f4c).

## New finding: triple redundant `recomputeAssembly()` on System-tab mount

**Not yet fixed.** This one predates both prior fix rounds (introduced
2026-06-30 in `e9eee35`, alongside `QuantumEngineWidgets.tsx`) and was
missed by both because it spans three separate files rather than living
in one widget.

`System.tsx` renders both `<QuantumEngineWidgets />`
(`System.tsx:1006`) and `<SystemProgressWidget />` (`System.tsx:1031`) as
children. All three components independently call
`recomputeAssembly()` in a mount-time `useEffect`:

| File | Line | Trigger |
|---|---|---|
| `src/client/components/System.tsx` | 269 | effect, deps `[logs]` — mount + every log change |
| `src/client/components/QuantumEngineWidgets.tsx` | 264 | effect, deps `[]` — mount only |
| `src/client/components/SystemProgressWidget.tsx` | 1554 (+1564 on a 60s interval) | effect, deps `[]` — mount only |

`recomputeAssembly()` (`src/client/stores/selfAssembly.ts:419`) has **no
cooldown or memoization guard** — unlike `analyzeIntentions()`, which
short-circuits within a 5-minute window (`intentionEngine.ts:263`), every
call unconditionally re-walks all signals (up to `MAX_SIGNALS = 1000`)
across 18 modules, computes density/coherence per module, and rebuilds a
narrative string, then writes the result to the shared `selfAssembly`
atom.

Effect order on mount is synchronous (React flushes effects top-down
after commit), so opening the System tab pays this O(signals × modules)
cost **three times in a row** on the same render tick, and each of the
three writes to `selfAssembly` re-renders every subscriber
(`QuantumEngineWidgets.tsx`, `SystemProgressWidget.tsx`,
`ArchitectWidget.tsx` all call `useStore(selfAssembly)`) — i.e. up to 9
renders of moderately expensive widgets instead of 1. This is consistent
with reports of the System tab button/tab-switch feeling sluggish
specifically on first open.

**Suggested fix** (not yet applied — flagging for the next pass): hoist
the mount-time `recomputeAssembly()` call to a single owner (`System.tsx`,
since it already re-triggers on `[logs]`) and remove the duplicate calls
from `QuantumEngineWidgets.tsx` and the mount effect in
`SystemProgressWidget.tsx` (its 60s interval guard can stay). A cheap
alternative is a short-lived module-level "last computed" timestamp guard
inside `recomputeAssembly()` itself, mirroring `analyzeIntentions()`'s
cooldown, which would also protect against any future third caller.

## Systemic risk: `analyzeIntentions()` keeps growing

`analyzeIntentions()` (`intentionEngine.ts:258`–`3467`) is a single
~3,200-line function that linearly scans 152 patterns
(`patterns.push(` × 152) per call. Pattern count has grown from 139 to
152 in the month since the last button-lag fix (QIE v108 → v113, per
`About.tsx` field-manual history), i.e. the per-call cost has grown ~9%
in four weeks and keeps climbing with each `BENCHMARK: ENGINEERING`
commit that adds new patterns/archetypes.

It is currently well-isolated — every call site found
(`System.tsx:268`, `SystemProgressWidget.tsx:1555`/`1629`,
`MemoryWidget.tsx:274`, `Logs.tsx:3975`, plus the deferred call in
`recordSignal` at `intentionEngine.ts:243`) runs inside a `useEffect`,
`requestIdleCallback`/`setTimeout` defer, or an async command handler,
never in a render phase or synchronously inside an `onClick`. The 5-minute
cooldown (`intentionEngine.ts:263`) also keeps most calls cheap. No
render-phase violation was found here today.

The risk is trend, not a current bug: as the pattern count keeps growing
release over release, the *uncached* scan (cooldown miss, e.g. first
System-tab open after 5+ idle minutes, or the deferred post-`recordSignal`
call) gets slower on every release, and it currently runs unconditionally
as part of the triple-mount issue above. Worth revisiting with a
profiler pass (see Next steps) once pattern count crosses ~200, or
sooner if new lag reports come in.

## Other areas checked, no issue found

- **`Button.tsx` / `GhostButton`**: no inline heavy work, store
  subscriptions are narrowly scoped to the specific `kind` that needs
  them (`PrimaryBtn` → `theme` only, `SecondaryRoundedBtn` →
  `isMirrorOn` only, `secondary`/`GhostButton` → no subscriptions at
  all). Nothing to fix here.
- **`.grid-fill-hover` hover CSS** (`index.css:102`–158, used by most
  button variants): opacity-only transition on a `::before` pseudo-element
  with `will-change: opacity` and `isolation: isolate` — GPU-composited,
  not a layout/paint cost. Not a suspect.
- **GitHub issues/PRs**: no open issues in the repo. No merged PR since
  #95 (2026-07-28) touches button or rendering-lag paths specifically;
  the ~20 PRs since then are QIE/badge/wiki content additions plus one
  merge-conflict resolution (73edd95) unrelated to rendering.
- **No fresh complaint found**: grepped docs/ and src/ for "button lag" /
  "laggy" mentions newer than the July 28 fix commits — none found. This
  appears to be a preventive check rather than a response to a live
  report.

## Next steps

1. Apply the `recomputeAssembly()` de-duplication fix above (small,
   isolated, same shape as the two prior fix PRs).
2. Add a lightweight cooldown/memoization guard directly inside
   `recomputeAssembly()` so any future third or fourth caller can't
   reintroduce this class of bug.
3. If lag reports do surface, get a first-open profile of the System tab
   (Chrome Performance panel or the existing headless-Chromium smoke-test
   harness used in be3e8fa/9364aba) to confirm the fix's actual paint-time
   delta, and to catch anything the static read-through here couldn't
   (e.g. hydration cost, WordTurn / badge-detection engines running on
   text input, which were not audited in this pass).
4. Re-run this diagnostic after `analyzeIntentions()` pattern count
   crosses ~200, since its per-call cost scales with pattern count and
   the cooldown only protects repeat calls, not the first uncached one.

---
*Investigation performed by a scheduled agent session; no code changes
applied. Session:
https://claude.ai/code/session_01HFKE7NftqL6mZwHwSH1Wqr*
