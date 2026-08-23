<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering — Scheduled Investigation Report

**Date**: August 23, 2026
**Branch**: `claude/brave-rubin-g475op`
**Trigger**: Scheduled routine — "Investigate the buttons lagging issue and rendering problems"
**Status**: ✅ NO ACTIVE REGRESSION FOUND — prior fixes hold, no new reports

---

## Summary

This was a scheduled sweep, not a response to a new report. No new button-lag or
rendering issue exists in open GitHub issues/PRs, and a code audit of the known
root-cause pattern (synchronous `analyzeIntentions()` store writes on the render
or click path) shows every previously-flagged call site is still correctly
guarded. The repository has had no commits since **August 5, 2026** (18 days
quiet as of this report).

## What was checked

1. **Git history** — `git log --grep="button|lag|perf|render"` across all
   branches. Button lag was a heavily-worked area between late July and
   Aug 5, 2026, resolved across ~9 dedicated commits (see below).
2. **GitHub issues/PRs** — `search_issues` for "button lag / rendering slow /
   performance" → **0 results**. `list_issues` (open) → **0 open issues**.
   `list_pull_requests` (open) → **1 open PR** (#93, calendar time-tracking
   feature, unrelated to buttons/rendering).
3. **Code audit** — every `analyzeIntentions()` call site in `src/client`
   (the recurring root cause: a ~139-pattern nanostores atom write) checked
   for render-phase execution:
   - `System.tsx:268` — inside `useEffect` (not `useMemo`), cooldown-gated,
     with an explicit comment warning against reintroducing the useMemo
     version.
   - `SystemProgressWidget.tsx:1555/1629` — inside click handler, deferred
     one macrotask, 5-min cooldown no-op guard.
   - `MemoryWidget.tsx:274` — moved to `useEffect` with a `useState` seed
     (fixed in `be3e8fa`).
   - `Logs.tsx:3975` — fires only from an explicit user-typed `/qos` slash
     command handler, not render path.
   - `intentionEngine.ts:243` — wrapped in `deferHeavy()`, gated by
     `ANALYSIS_COOLDOWN` (5 min).
   All are correctly isolated from the render/click-response path. No new
   violations found.
4. **`Button.tsx`** (`src/client/components/ui/Button.tsx`) — store
   subscriptions are already split per button `kind` (`PrimaryBtn` only
   subscribes to `stores.theme`, `SecondaryRoundedBtn` only to
   `stores.isMirrorOn`, plain `secondary` subscribes to nothing), so a
   theme/mirror toggle doesn't cascade re-renders through buttons that don't
   care about that store.
5. **CSS hover fill** (`.grid-fill-hover` in `index.css`) — pseudo-element
   `opacity` transition with `will-change: opacity`, cheap to composite;
   density-variant background-image patterns (`dense`/`instrument`) are only
   painted on hover, not a steady-state cost.

## Prior fix history (for reference)

| Commit | Fix |
|---|---|
| `863b333` | Cap logs query, back off stats polling — reduce widget lag |
| `b219cc3` | Move quantum state writes out of `useMemo` — unblock render pipeline |
| `ee88f4c` | Pause System background work off-tab — fix tab-switch freeze |
| `6e5007a` | Stop render-phase atom write + off-tab churn — tab-switch stall |
| `b46f1ac` | Unmount System tab when inactive — end background churn |
| `bd9ef2a` | Reuse AudioContext, catch sound errors — Planner buttons frozen |
| `be3e8fa` | Fix two residual button-lag paths (MemoryWidget, SystemProgressWidget) flagged by an agent diagnostic |
| `9364aba` | Memoize heavy per-render work in System subscriber widgets (SignalStreamWidget, UserMetricsWidget) |

The `be3e8fa` commit message references `docs/diagnostics/BUTTON-LAG-RENDERING-DIAGNOSTIC.md`
as the agent-authored source of those two fixes, but that file was never
committed to the repo (working-tree artifact only) — noted here so a future
sweep doesn't go looking for it.

## Suspected causes (historical, now mitigated)

- Synchronous `analyzeIntentions()` (heavy pattern scan) executing inside
  `useMemo`/render or inside a click handler, blocking paint/click response.
- Unmemoized heavy computation (sort/classify) re-run on every render from
  unrelated store writes.
- Background polling/timers continuing to run on inactive tabs.
- Broad store subscriptions in shared components (e.g. `Button`) causing
  unrelated re-renders — mitigated by per-kind subscription splitting.

## Next steps

- No action required right now — nothing is currently broken.
- If button lag resurfaces, start with the same root cause class: search for
  new `analyzeIntentions()` (or similarly heavy store-write) call sites added
  since Aug 5, and check whether any new widget skipped the `useEffect`-not-
  `useMemo` / cooldown pattern established above.
- Consider profiling with the headless-Chromium harness used in `9364aba` /
  `be3e8fa` (1000 signals + 500 logs seed, rapid tab switches) as a
  regression check before the next release, since no automated perf test
  currently guards these fixes.
