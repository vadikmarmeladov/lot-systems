<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Status Audit

**Date**: August 1, 2026
**Branch**: `claude/brave-rubin-n4ihfk` (scheduled investigation, no code changes)
**Trigger**: Scheduled routine — "Investigate the buttons lagging issue and rendering problems"
**Status**: 🟡 No active regression found; residual architectural risk documented

---

## 1. Summary

Button lag / render-stall has been an actively-worked issue on this repo for two
weeks. Eight PRs (#85, #87, #88, #92, #94, #95, plus two direct commits) landed
between **July 19** and **July 28, 2026**, each fixing a distinct root cause under
the same umbrella: heavy, un-memoized, or render-phase work running on the
`intentionEngine` nanostore's write path, which fans out to every permanently-mounted
System-tab subscriber widget.

As of this audit (`master` @ `8f6205e`, in sync with `origin/master`):

- **No open GitHub issues or PRs currently reference lag, buttons, or rendering.**
- The last fix (`9364aba`, Jul 28) is merged and nothing has landed since.
- A source audit for the specific patterns that caused every prior incident
  (render-phase store writes, un-gated intervals, synchronous heavy work in click
  handlers) found no new violations — see §3.
- One **un-addressed residual risk** remains and is documented in §4 as the next
  thing to look at if lag reports resurface.

## 2. Prior Fix History (chronological)

| Date | Commit / PR | Root cause fixed |
|---|---|---|
| Jul 19 | `bd9ef2a` / — | Planner buttons frozen — reused `AudioContext`, caught sound errors |
| Jul 19 | `863b333` / — | Widget lag — capped logs query, backed off stats polling |
| Jul 19 | [`#85`](https://github.com/LOT-Systems/LOT-Computer/pull/85) | Tab-switch freeze: `document.hidden` doesn't catch in-app tab switches; added `stores.isRouteActive(route)`; gated `SystemProgressWidget`'s 60s `recomputeAssembly` and `SystemPulseWidget`'s 10s poll to the active tab; coalesced `recordSignal`'s localStorage persist and deferred `analyzeIntentions` via `requestIdleCallback` |
| Jul 19 | [`#87`](https://github.com/LOT-Systems/LOT-Computer/pull/87) | Duplicate `SystemProgressWidget` mount running mount effects twice |
| Jul 19 | [`#88`](https://github.com/LOT-Systems/LOT-Computer/pull/88) / `6e5007a` | `PatternRecognitionWidget` wrote the `intentionEngine` atom **during render** via an un-memoized `getOptimalWidget()`; gated three off-tab System-only intervals |
| Jul 28 | [`#92`](https://github.com/LOT-Systems/LOT-Computer/pull/92) | Astrology block staleness (unrelated to lag, same session) |
| Jul 28 | [`#94`](https://github.com/LOT-Systems/LOT-Computer/pull/94) / `be3e8fa` | `MemoryWidget`: `analyzeIntentions()` (a store write) ran inside a `useMemo` — moved to a post-paint `useEffect`. `SystemProgressWidget.handleGenerateReport`: synchronous ~139-pattern scan blocked the click; deferred one macrotask via `setTimeout(build, 0)` |
| Jul 28 | [`#95`](https://github.com/LOT-Systems/LOT-Computer/pull/95) / `9364aba` | `SignalStreamWidget` re-sorted up to 1000 signals every render — memoized on `engine.signals`. `UserMetricsWidget` ran `getUserIndex()` + `classifyPhysiologicalCohort()` unmemoized every render — moved into `useMemo` |

**Doctrine established across these fixes** (referred to in commit messages as
"Render Isolation" / "async-signal doctrine"): nanostore atom writes must never
happen inside `useMemo` or a component's render body — only in `useEffect` (after
paint) or event handlers, and even then, expensive scans (`analyzeIntentions()`,
report builders) should be deferred off the click path with `setTimeout`/
`requestIdleCallback` so the button's own paint isn't blocked.

## 3. What I checked for regressions (Aug 1)

Grepped every current `analyzeIntentions()` call site (the specific store-write
function responsible for 4 of the 6 prior incidents):

- `System.tsx:268`, `MemoryWidget.tsx:274`, `SystemProgressWidget.tsx:1452` — all
  inside `useEffect`. ✅
- `SystemProgressWidget.tsx:1526` — inside the `setTimeout`-deferred `build()` from
  `#94`. ✅
- `Logs.tsx:3609` — inside an async slash-command handler (`/qos` trigger), not a
  render path. ✅
- `intentionEngine.ts` internal call sites are the store's own implementation. N/A

No `useMemo` body in `src/client/components` currently calls a store-write-like
function (`analyzeIntentions`, `recordSignal`, `recordQOSSignal`, `.set(`,
`setState`) — the specific anti-pattern from `#88` and `#94` has not recurred.

All 13 files using `setInterval` were spot-checked for the `isRouteActive`/
`document.hidden` gate established in `#85`/`#88`; the System-tab-only ones
(`SystemPulseWidget`, `SystemProgressWidget`, `ChakraErgonomicsWidget`,
`ContextualPromptsWidget`) still have it.

## 4. Residual risk (not a confirmed bug — flag for next investigation)

11 components subscribe directly to the `intentionEngine` store (`useStore(intentionEngine)`
or `intentionEngine.get()`), meaning **every** signal write re-renders all of them
if they're mounted:

```
QuantumStateWidget, System, PatternRecognitionWidget, SystemPulseWidget,
QuantumEngineWidgets, IntegrityWidget, UserMetricsWidget, ArchitectWidget,
AIFeedbackWidget, Logs, SignalStreamWidget
```

Of these, only `System.tsx` and `Logs.tsx` are wrapped in `React.memo`. The other
9 — including `SignalStreamWidget` and `UserMetricsWidget`, the two widgets patched
for *internal* memoization in `#95` — have no memo boundary at all. This means:

- The expensive work inside them (sort, `getUserIndex()`, `classifyPhysiologicalCohort()`)
  is now correctly cached across re-renders (per `#95`), **but**
- The component function itself still re-executes and reconciles on every
  `intentionEngine` write, even when its own memoized inputs didn't change —
  pure render/reconciliation overhead, not the "heavy scan per keystroke" class of
  bug from before, but it compounds with signal volume (the `#95` repro used 1000
  signals + 500 logs).

**Next step if lag reports resurface**: wrap the 9 un-memoized `intentionEngine`
subscribers in `React.memo`, matching `System.tsx`/`Logs.tsx`. This is a
mechanical, low-risk change but wasn't in scope for this audit (no active bug to
attach it to, and it touches 9 files/widgets that would each need a render-storm
regression test to confirm no `prop`-identity issues sneak in).

## 5. Bottom line

No open issue, no open PR, and no code regression exists against the specific
failure modes this repo has hit six times in two weeks. The fix lineage in §2
appears to have closed out the reported symptom as of `9364aba` (Jul 28). If a
new lag report comes in, start with §4 (memo the remaining 9 subscribers) before
re-deriving root cause from scratch — the render-isolation doctrine in the prior
PRs is the fastest lens to check new code against.
