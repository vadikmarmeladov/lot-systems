<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering Problems — Investigation Report

**Date**: July 5, 2026
**Branch**: `claude/brave-rubin-ii1ckt`
**Status**: 🟡 PARTIALLY FIXED — three root causes shipped July 4; one structural risk still open

---

## 🔍 Summary

"Buttons lagging" turned out to be at least **three distinct bugs**, all fixed in
the 24 hours before this investigation (commits `bd9ef2a`, `89da563`, `d5de98b`,
`f6c7caf` on `master`). Two of the three were not really "lag" — they were total
input freezes that would read to a user as extreme lag or a hung tab. The
underlying architectural pattern that made all three possible — every top-level
tab staying mounted forever (`display:none` instead of unmount) — is still in
place and is flagged below as the area needing deeper investigation.

---

## ✅ Already fixed (shipped July 4, 2026)

### 1. Planner buttons frozen — new `AudioContext` per click
**Commit**: [`bd9ef2a`](https://github.com/LOT-Systems/LOT-Computer/commit/bd9ef2a1a0f378d51c4bcc3bb6ef044185de3d7e) · `src/client/stores/plannerWidget.ts`

`playClickSound()` created a `new AudioContext()` on every single button press.
Browsers cap the number of live `AudioContext` instances; once the cap was hit
(or any Web Audio error occurred), the constructor **threw**, which killed
`cycleValue()` / `navigateCategory()` before `plannerWidget.set()` ran. State
never updated → the Planner widget's cycle/nav buttons went dead after enough
clicks in a session.

**Fix**: one shared `_audioCtx` reused across clicks, recreated only if closed,
wrapped in try/catch so any Web Audio failure is swallowed instead of aborting
navigation.

### 2. Global nav unclickable after visiting Logs
**Commits**: [`89da563`](https://github.com/LOT-Systems/LOT-Computer/commit/89da5632832f3091a438686ea57ed6fff1aae05a), [`d5de98b`](https://github.com/LOT-Systems/LOT-Computer/commit/d5de98b771c7d472f42c4ea78111147cb507014a) · `src/client/components/Logs.tsx`, `src/client/utils/hooks.ts`, `src/client/components/ui/Layout.tsx`

`Logs` uses `useMouseInactivity(2000, cb)` to hide the nav bar after 2s of
mouse idle. Because tabs are kept mounted (see architecture note below), this
timer **kept running after navigating away from Logs**, periodically adding
`pointer-events-none` to `#nav` — making every nav button on every tab
unclickable at random intervals. Compounding bug: `useMouseInactivity`'s
`useEffect` depended on its own `isMoving` state, so the effect re-registered
on every mouse move, occasionally leaving the idle-timeout callback firing
after the tab had changed and the `pointer-events-none` class stuck.

**Fix**: `useMouseInactivity` rewritten to track `isMoving` via a closure
variable (not a state dependency); `Logs` now guards `onMouseActivityChange`
and the `#page` click handler to only act while the route is actually `logs`,
plus a `router.listen` cleanup that force-restores nav on route change;
`Layout` gives `#nav` `z-10` so it can't be visually/interactively buried.

**This is the single most likely explanation for reports of "buttons lagging"**
— from the user's side, a nav button that silently gained
`pointer-events-none` for ~2s at a time reads exactly like input lag, not a
frozen app.

### 3. Visible blank frame on tab switch (scroll-to-top timing)
**Commit**: [`f6c7caf`](https://github.com/LOT-Systems/LOT-Computer/commit/f6c7caf6c96ee9e7180388fc6503123bf4be7461) · `src/client/entries/app.tsx`

Scroll-to-top on route change ran in a `useEffect`, which fires **after**
paint — so users saw the old tab's content for one frame, then a visible
scroll jump. Changed to `useLayoutEffect`, which runs synchronously after DOM
mutation but before paint, so the scroll happens in the same frame as the tab
switch. Not a lag bug per se, but exactly the kind of "rendering problem" /
janky-feeling transition a user would lump in with "buttons feel slow."

---

## 🏗️ Structural risk — still open, needs deeper investigation

**All five top-level tabs (`system`, `logs`, `sync`, `settings`, `api`) stay
mounted for the lifetime of the session.**

`src/client/entries/app.tsx:145-190` — `TabPanel` renders every tab's subtree
at all times and toggles visibility with `style={{ display: active ? 'contents' : 'none' }}`
rather than unmounting the inactive ones:

```tsx
const TabPanel = React.memo(function TabPanel({ active, children }) {
  return <div style={{ display: active ? 'contents' : 'none' }}>{children}</div>
})
```

This is almost certainly intentional (avoids remount cost / preserves scroll
position and in-progress state when switching tabs), but it means:

- Every `setInterval`/`useEffect` timer started by a widget on any
  previously-visited tab **keeps running in the background forever** —
  confirmed examples: `System.tsx` `LoadingDots` (500ms), `SystemProgressWidget`
  `recomputeAssembly` (60s), `ChakraErgonomicsWidget` (2min), `TimeWidget`
  `checkHour` (1s), `StatusPage`, `ContextualPromptsWidget`,
  `MicroCalculatorWidget` (10s), `EvolutionMilestoneToast` (30s), plus the QOS
  monitor in `intentionEngine.ts` (30min). None of these are individually
  expensive, but they accumulate the longer a session runs and the more tabs
  have been visited — exactly the "gets laggier over time" pattern a lagging
  bug report usually describes.
- It's exactly the mechanism that caused bug #2 above (`Logs`'s inactivity
  timer firing on other tabs) — and the same class of bug (an effect that
  assumes "I'm the only mounted screen") could exist in other persistent-tab
  widgets and hasn't been audited yet.
- `System.tsx` renders ~40 widget components, but only **one** of them
  (`ContextualPromptsWidget`, line 960) is wrapped in the `LazyMount` /
  `useInViewport` gate that the code comment says exists specifically to
  "prevent heavy store subscriptions from running before the widget is
  needed" (`src/client/components/System.tsx:84-90`). The other ~39 widgets
  mount immediately and subscribe to their stores regardless of scroll
  position, which is inconsistent with the apparent intent of that helper.

**Next steps** (not yet done in this investigation):
1. Profile the System tab with the React DevTools profiler / Chrome
   Performance panel after a session that has visited all five tabs, to
   confirm whether the background interval/store-subscription load actually
   shows up as measurable main-thread time near a button click.
2. Audit each persistent-tab widget's effects for the same "assumes it's the
   only active screen" assumption that caused bug #2 (mouse activity, focus,
   visibility listeners in particular).
3. Decide whether more widgets in `System.tsx` should be wrapped in
   `LazyMount`, matching the stated intent of that helper.

---

## 🎯 CSS / animation review (no issues found)

`grid-fill-hover` (`src/client/index.css:100-124`), used by `Button`,
`GhostButton`, `Input`, `Block`, and several widget rows, animates only
`opacity` on a `::before` pseudo-element and already sets `will-change:
opacity`. This is a GPU-compositable property and not a plausible source of
input lag — ruled out.

---

## 📋 GitHub search results

No open GitHub issues or PRs matched "button lag/freeze/frozen/slow" in this
repo at the time of this report (`search_issues` / `search_pull_requests`
both returned 0 relevant results beyond two unrelated 2025 PRs about button
dark-mode contrast and mobile spacing). The lag reports appear to have been
handled directly as commits rather than tracked issues.

---

## Bottom line

The acute, reproducible freezes (Planner dead buttons, global nav going
unclickable) are fixed and already on `master` as of July 4. The remaining
open question is whether the "stays mounted forever" tab architecture causes
a slower, cumulative degradation over a long session — that requires a
profiling pass, not just a code read, to confirm or rule out.
