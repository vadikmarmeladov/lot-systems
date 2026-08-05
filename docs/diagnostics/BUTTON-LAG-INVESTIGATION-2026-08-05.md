<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag / Rendering Investigation — 2026-08-05

Scheduled audit. No new user report or GitHub issue triggered this — it's a
periodic check on the health of the button-lag/rendering fix line that ran
through July 2026. Conclusion: **the known lag paths are already fixed and
merged to `master`; nothing new was found.** This doc records what was
checked, what the fix history looked like, and where to look first if lag
resurfaces.

## Scope checked

- `git log` across the whole repo for perf/lag/button/render commits
- All 4 merged PRs matching "lag"/"button"/"render" (#88, #94, #95, plus #7
  which was a color-contrast fix, unrelated to timing)
- GitHub issue search for "button"/"lag"/"rendering" — **0 open issues**
- Every remaining call site of `analyzeIntentions()` (the known hot path —
  a ~139-pattern signal scan that also *writes* the `intentionEngine`
  nanostore atom) across `src/client/components/`
- `src/client/components/ui/Button.tsx` (shared Button/GhostButton
  components) and the `.grid-fill-hover` hover-fill CSS in `index.css`
- `docs/benchmark/LOT-DOCTRINE.md` "Render Isolation" doctrine section

## Fix history (already on `master`)

A recurring "click, then a beat, then it happens" lag was chased across five
PRs from 2026-07-18 through 2026-07-28, each catching a residual case the
last one missed:

| Date | Commit | What it fixed |
|---|---|---|
| 2026-07-18 | [`863b333`](https://github.com/LOT-Systems/LOT-Computer/commit/863b333) | Capped the Logs query size and backed off stats polling frequency (fix: reduce widget lag) |
| 2026-07-18 | [`b219cc3`](https://github.com/LOT-Systems/LOT-Computer/commit/b219cc3) | Moved `intentionEngine` writes out of `useMemo` (render phase) into `useEffect` (post-paint) — the first "unblock render pipeline" pass |
| 2026-07-19 | [`ee88f4c`](https://github.com/LOT-Systems/LOT-Computer/commit/ee88f4c) / [`6e5007a`](https://github.com/LOT-Systems/LOT-Computer/commit/6e5007a) — PR [#88](https://github.com/LOT-Systems/LOT-Computer/pull/88) | Root cause of a *progressive* stall (fine for 2-3 tab switches, then freezes): `PatternRecognitionWidget` called `getOptimalWidget()` — which itself calls `analyzeIntentions()` → atom write — **during render**, cascading re-renders across all ~7-9 permanently-mounted System-tab subscriber widgets. Also gated three System-only intervals (2min/15s/30s) on `isRouteActive('system')` so they stop firing while the user is on another tab. |
| 2026-07-25 | [`b46f1ac`](https://github.com/LOT-Systems/LOT-Computer/commit/b46f1ac) | Unmounts the System tab entirely when inactive, instead of just hiding it, to stop its background churn outright |
| 2026-07-28 | [`be3e8fa`](https://github.com/LOT-Systems/LOT-Computer/commit/be3e8fa) — PR [#94](https://github.com/LOT-Systems/LOT-Computer/pull/94) | Two residual cases flagged by an agent diagnostic: `MemoryWidget` ran `analyzeIntentions()` inside a `useMemo` (same render-phase-write bug as above, different widget); `SystemProgressWidget.handleGenerateReport` ran a full pattern scan **synchronously inside the click handler itself**, blocking the button's own click response until the scan finished. Deferred with `setTimeout(build, 0)` so the click responds before the scan runs. |
| 2026-07-28 | [`9364aba`](https://github.com/LOT-Systems/LOT-Computer/commit/9364aba) — PR [#95](https://github.com/LOT-Systems/LOT-Computer/pull/95) | Last heavy *unmemoized* per-render work: `SignalStreamWidget` copy+sorted up to 1000 signals every render regardless of whether signals changed; `UserMetricsWidget` ran two derivation functions unmemoized. Both moved into `useMemo` keyed on the actual dependency. |

The team's own before/after number from the last fix: 5 rapid System↔Logs tab
switches went from "a heavy task per switch" to "one 118ms cost on first
System mount, cheap thereafter."

This produced a standing rule, now codified in `docs/benchmark/LOT-DOCTRINE.md`
under **Render Isolation**:

> work that WRITES to a store must not run inside `useMemo` (render phase) —
> the writes schedule subscriber re-renders before the browser can paint.
> Move such work to `useEffect` so atom writes land after paint; seed the
> derived value with `useState` for an identical first render.

## What this audit re-verified today

Re-checked every remaining `analyzeIntentions()` call site for the same two
anti-patterns (render-phase atom write, and synchronous heavy work inside a
click handler):

- `System.tsx:268` — in a `useEffect`, `useState`-seeded. Matches doctrine. OK.
- `SystemProgressWidget.tsx` (mount effect, line ~1452) — runs once in a
  `useEffect` on mount, not on the render path or in a click handler. OK.
- `SystemProgressWidget.tsx:1526` (`handleGenerateReport`) — confirmed still
  deferred via `setTimeout`, as fixed in `be3e8fa`. OK.
- `MemoryWidget.tsx:274` — confirmed still in the `useEffect`/`useState`-seed
  pattern from `be3e8fa`. OK.
- `Logs.tsx:3609` — `analyzeIntentions()` fires from a `/qos` slash-command
  trigger handler, not a `useMemo`. Same shape as the already-fixed cases in
  spirit (synchronous scan on a user action) but it's a rare, explicit
  power-user command rather than a primary button, and was called out in
  `About.tsx` docs as an intentional "on demand" trigger. Low priority, but
  worth a look if `/qos` itself is reported as slow.
- `IntegrityWidget.tsx` — imports `analyzeIntentions` but never calls it.
  Dead import, not a perf issue.

`src/client/components/ui/Button.tsx` (the shared `Button`/`GhostButton`
used everywhere): `kind="secondary"` (the default) subscribes to no stores
at all. `kind="primary"` subscribes only to `stores.theme`; `secondary-rounded`
only to `stores.isMirrorOn`. Both are narrow, single-value store reads — this
matches the Render Isolation doctrine's "narrowest component" rule and isn't
a lag source.

`.grid-fill-hover` (the hover-fill effect under most buttons, `index.css:102`)
animates `opacity` on a `::before` pseudo-element with `will-change: opacity`
— GPU-compositable, not a layout/paint-triggering property. Not a jank source.

## Current state

No open GitHub issue and no commit since `9364aba` (2026-07-28) references
button lag or rendering. The working tree is clean and this branch
(`claude/brave-rubin-4vc5h9`) is even with `master` — there is no pending
uncommitted lag fix in flight. Best read: **the reported lag was resolved by
the July 2026 fix line; there is no currently-active instance in the code.**

## If lag resurfaces, check first

1. Any new widget added to the System tab's permanently-mounted subscriber
   list — the failure mode was never one bad widget, it was N widgets each
   doing small unmemoized work on every `intentionEngine` write.
2. Any new `analyzeIntentions()` (or other store-writing function) called
   from inside a `useMemo`, or synchronously inside an `onClick` — grep
   `analyzeIntentions()` first since it's the known hot path, but the same
   bug class applies to any store-write function.
3. `Logs.tsx`'s `/qos` trigger (line ~3609) is the one remaining synchronous
   call on a user action that hasn't been explicitly load-tested — a
   reasonable next target if a specific report names it.
4. Get an actual repro (which button, which tab/widget state, cold vs warm)
   before code-diving — every fix in the July line came from reproducing the
   stall in a headless-Chromium harness with realistic seed data (1000
   signals / 500 logs), not from reading code alone. Without a repro this
   audit is static-only and can miss timing-dependent regressions.

## Links

- PR #88: https://github.com/LOT-Systems/LOT-Computer/pull/88
- PR #94: https://github.com/LOT-Systems/LOT-Computer/pull/94
- PR #95: https://github.com/LOT-Systems/LOT-Computer/pull/95
- Session report covering the first pass: `docs/benchmark/LOT-SR-20260719-01.md`
- Doctrine: `docs/benchmark/LOT-DOCTRINE.md` — "Render Isolation"
