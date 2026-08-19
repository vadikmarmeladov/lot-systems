<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Scheduled Investigation Report

**Date**: August 19, 2026
**Trigger**: Scheduled routine — periodic sweep for button-lag / rendering regressions
**Branch**: `claude/brave-rubin-t1wwtm`
**Status**: ✅ No active regression found — prior fixes holding, one forward-looking risk flagged

---

## Summary

This was a scheduled audit, not a response to a fresh report. No open GitHub
issues or PRs currently mention button lag, freezing, or rendering stalls on
`LOT-Systems/LOT-Computer`. The last confirmed button-lag bugs were diagnosed
and fixed on **2026-07-28**, and spot-checking the current code shows those
fixes are still in place and the doctrine they established is being followed
by code added since. One structural risk is worth tracking going forward
(see [Next Steps](#next-steps)).

---

## History: prior button-lag fix chain (all merged, for context)

A cluster of button-lag / tab-switch-freeze bugs were found and fixed across
late July, each narrowing in on the same root pattern — **heavy synchronous
work (`analyzeIntentions()`, sorts over hundreds of signals, cohort
classification) running either in render phase (inside `useMemo`) or directly
inside a click handler**, both of which block the paint of the button's own
visual response:

| Commit | Fix |
|---|---|
| `863b333` | reduce widget lag — cap logs query and back off stats polling |
| `b219cc3` | unblock render pipeline — move quantum state writes out of `useMemo` |
| `ee88f4c` | pause System background work off-tab to fix tab-switch freeze |
| `6e5007a` | stop render-phase atom write + off-tab churn (tab-switch stall) |
| `b46f1ac` | unmount System tab when inactive to end background churn |
| `be3e8fa` | fix two residual button-lag paths (MemoryWidget useMemo→useEffect; SystemProgressWidget click handler deferred one macrotask) |
| `9364aba` | memoize last heavy per-render work in System subscriber widgets (SignalStreamWidget sort, UserMetricsWidget cohort calc) |
| `bd9ef2a` | Planner buttons frozen: reuse AudioContext, catch sound errors |

The doctrine that emerged (documented inline at `src/client/components/System.tsx:263-266`
and `SystemProgressWidget.tsx:1622-1627`): **never write to a nanostores atom or
run `analyzeIntentions()` inside `useMemo` or a click handler body** — always
`useEffect` (after paint) or a deferred macrotask, so the click/tab-switch
response paints immediately and heavy state derivation happens after.

Note: `be3e8fa`'s commit message references an agent-authored
`docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md` as the source of the two
fixes it applied, but that file was never committed to the repo (no trace in
`git log --all --follow`) — likely a local scratch file from that session that
didn't make it into the PR. Nothing is lost since the fixes themselves landed,
but if that diagnostic's other findings (if any) weren't all applied, they're
now unrecoverable from this repo's history.

---

## Current-state check (this sweep)

Verified the fixed call sites and the general `analyzeIntentions()` usage
pattern are still correct:

- `System.tsx:267-269` — `analyzeIntentions()` still runs inside a
  `useEffect`, not `useMemo`. ✅
- `SystemProgressWidget.tsx:1621-1634` (`handleGenerateReport`) — still
  defers the `analyzeIntentions()` + report build one macrotask past the
  click. ✅
- `Logs.tsx:3975` (`/qos` trigger) and `SystemProgressWidget.tsx:1555`
  (mount-time `useEffect`) — both call `analyzeIntentions()` from an event
  handler or effect, not render phase. ✅
- `QuantumEngineWidgets.tsx` (newest large widget file, 30 KB, last touched
  Aug 15) — reviewed all `useMemo`/`onClick` usage; all memoized reads are
  cheap (`getUserState()`, `getUserIndex()`) and all click handlers are plain
  connect-toggle callbacks. No heavy or store-writing work found in render
  path. ✅
- `ui/Button.tsx` — subscribes only to the `theme` store when
  `kind === 'primary'`; CSS transitions are simple `background-color`/`all`
  transitions, no animation loops or `will-change` misuse. ✅
- `intentionEngine.ts` — `analyzeIntentions()` (the expensive ~150-pattern
  scan) is cooldown-gated to 5 minutes (`ANALYSIS_COOLDOWN`) and, at most
  call sites, wrapped in `deferHeavy()` in addition to the cooldown. ✅

No GitHub issues or PRs (open or recently closed) reference button lag,
freezing, or slow rendering. The one currently open PR (#93, calendar time
tracking, opened 2026-07-28) is unrelated and untouched by this sweep.

---

## Suspected causes (historical, for reference)

The recurring root cause across the whole fix chain was **render-phase or
click-phase side effects**, specifically:

1. Store writes (`analyzeIntentions()`) executed inside `useMemo` — a
   render-phase write that triggers nanostores subscriber cascades
   synchronously during React's render pass.
2. O(n) work (sorting up to 1000 signals, cohort classification) re-run on
   every render instead of memoized on a stable dependency.
3. Heavy synchronous computation running directly inside an `onClick`
   handler, blocking the button's own visual/active-state paint until the
   computation finished.
4. Background polling/timers continuing to fire on inactive tabs, causing
   churn that stole main-thread time from the active tab's interactions.

No new instance of any of these four patterns was found in this sweep.

---

## Next steps

- **Pattern-scan cost is monotonically growing.** `analyzeIntentions()` has
  grown from ~125 patterns (per a stale in-code comment) to **151 patterns**
  as of the latest BENCHMARK commit (`d7f076e`, QIE v113), and each new
  BENCHMARK/self-assembly cycle adds more (Arch51, J48, etc.). The 5-minute
  cooldown and `deferHeavy()` wrapping currently absorb this, but the
  worst-case scan cost (on a cooldown miss) rises with every pattern added.
  Worth a periodic profiling check (headless-Chromium harness, as used in
  `9364aba`) to confirm the cooldown-miss cost is still acceptable as the
  pattern count keeps climbing — no fixed ceiling currently caps it.
- **Recover or recreate the missing diagnostic doc.** If
  `BUTTON-LAG-RENDERING-DIAGNOSTIC.md` (referenced by `be3e8fa` but absent
  from history) contained additional findings beyond the two that were
  applied, it would be worth re-running that diagnostic pass to confirm
  nothing was left on the table.
- **No live report or profiling data exists for this sweep** beyond static
  code review — there was no fresh user complaint or performance-metrics
  source to investigate against. If button lag resurfaces, the fastest path
  is the same headless-Chromium repro harness used in `9364aba` (seed with
  ~1000 signals + 500 logs, measure task duration across rapid tab
  switches/clicks).

---

## Conclusion

No open button-lag or rendering-performance issue was found. The three
rounds of July fixes remain intact and their doctrine (defer heavy
store-writing work out of render/click phase) is being followed by code
added since. The only actionable item is proactive: keep an eye on
`analyzeIntentions()`'s growing pattern count as a future performance risk,
not a current bug.
