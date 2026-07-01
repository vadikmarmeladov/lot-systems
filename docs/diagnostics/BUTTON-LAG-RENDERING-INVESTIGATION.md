<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering Investigation

**Date:** 2026-07-01
**Scope:** Client-side button responsiveness / render performance
**Trigger:** Scheduled investigation — no open GitHub issue filed at time of writing
**Status:** No currently-open defect found. Extensive prior remediation exists;
one residual gap identified (no server-side perf telemetry).

## 1. Summary

Searched git history, GitHub issues/PRs, and `docs/benchmark/` session reports
for "button lag" / rendering problems. There is **no open GitHub issue** and
**no unresolved defect** on this topic right now — but the repo has a long,
well-documented history (2026-06-02 through 2026-06-30) of exactly this class
of bug being found and fixed repeatedly, which suggests it's a recurring
regression risk rather than a one-off. `LOT-DOCTRINE.md` has codified four
named patterns from these fixes. Findings below cover what was fixed, what's
currently in place, and one gap worth closing.

## 2. Timeline of prior fixes (git log + docs/benchmark/)

| Date | Commit | Fix |
|---|---|---|
| 2026-06-02 | (SR-20260602-01) | Router moved from `App` to `TabPanel` — eliminated a full `System` re-render on every tab switch |
| 2026-06-03 | (SR-20260603-01) | Removed unused `Block` store subscriptions; nav buttons memoized so only active-state changes re-render |
| 2026-06-03 | (SR-20260603-02) | `Button.tsx` split into `PrimaryBtn` (subscribes to `theme` only), `SecondaryRoundedBtn` (subscribes to `isMirrorOn` only), and inline `secondary` (no subscriptions) — see [`src/client/components/ui/Button.tsx`](../../src/client/components/ui/Button.tsx) |
| 2026-06-04 | (SR-20260604-01) | `recordSignal()` (localStorage write + pattern analysis) deferred via `setTimeout(0)` so React commits the visual click response before the synchronous work runs |
| 2026-06-12 | (SR-20260612-04) | Density tiers (5 variants) implemented via `[data-density]` CSS selectors instead of component subscriptions — zero new re-render triggers added to `Button.tsx` |
| 2026-06-21 | [`78745c3`](../../) | "Memory button lag" — same `setTimeout(0)` deferral pattern applied to `MemoryWidget.tsx` |
| 2026-06-27 | [`b68e842`](../../) / [`fafd50e`](../../) | `TabPanels` and `DynamicRoutes` wrapped in `React.memo` in [`src/client/entries/app.tsx`](../../src/client/entries/app.tsx) — stops cascade re-renders from unrelated store changes (`isSoundOn`/`isRadioOn`/`isMirrorOn`/`me`) |
| 2026-06-27 | [`1271cd3`](../../) | "Fix tab label movement and tab switching lag" — `will-change: opacity` added to `.grid-fill-hover::before` (pre-promotes the GPU compositor layer, eliminates sub-pixel text shift on hover) + `Logs`/`System`/`Sync`/`Settings` wrapped in `React.memo` |
| 2026-06-30 | [`95de8e1`](../../) | `EmotionalCheckIn` / `PatternInsightsWidget`: added `pendingState` optimistic UI so a button click shows "`[State] — logged.`" immediately instead of a blank gap while the API call is in flight; buttons switched to `size="small"` |

## 3. Current state (verified 2026-07-01)

- **`Button.tsx`** ([src/client/components/ui/Button.tsx](../../src/client/components/ui/Button.tsx)): subscription-minimized as documented — `secondary` (the default/most common kind) subscribes to nothing.
- **`.grid-fill-hover::before`** ([src/client/index.css:107-121](../../src/client/index.css)): uses `will-change: opacity` and only transitions `opacity` — no layout-triggering properties (`transition-all` is *not* used here, contrary to what the fix commit message might suggest at a glance; it's scoped to `transition: opacity 180ms ease`).
- **`transition-all`** is used in only 4 places repo-wide (`Button.tsx` primary/light-theme variant, `ToggleSection.tsx`, `SystemProgressWidget.tsx`, `IntegrityWidget.tsx`). None currently show up as a reported problem, but `transition-all` is a known perf anti-pattern (animates layout-affecting properties, not just compositor-friendly ones) worth narrowing to explicit properties if any of these are ever implicated.
- **`recordSignal()`** call sites (34 across the codebase): spot-checked — all fire-and-forget from click handlers, consistent with the deferred/async pattern from the doctrine. No new synchronous-heavy call sites found.
- **Synchronous `localStorage` in click handlers** (`QuantumSignWidget.tsx`, `SubscribeWidget.tsx`, etc.): all are single `setItem` calls — negligible cost, not a plausible lag source.
- **`app.tsx`**: `TabPanels`/`DynamicRoutes` memoization from `b68e842` is still in place.

## 4. Existing telemetry — and the gap

There **is** a client-side performance observer already wired up:
[`src/client/utils/perf.ts`](../../src/client/utils/perf.ts) (added 2026-06-10,
`initPerfObserver()` called from `app.tsx`). It watches:
- `PerformanceObserver({type: 'event'})` — flags interactions over 50ms, warns on >200ms (INP threshold)
- `PerformanceObserver({type: 'long-animation-frame'})` — flags long animation frames

**Gap:** this only `console.warn`s in the browser and exposes `window.__LOT_PERF__.getEntries()`
for manual inspection. There is no server-side beacon/reporting, so none of this
data is aggregated or queryable after the fact — if a user hits a slow interaction,
that signal is lost unless someone is watching devtools live. This means the team
has no way to confirm or deny "buttons are lagging" from real user sessions
without asking the user to open devtools.

## 5. Suspected causes (ranked)

Given no active bug is confirmed, these are the most plausible *future* causes,
ranked by how much of the codebase's own history points at them:

1. **Store-subscription cascades reintroduced by new widgets.** This is the
   single most repeated root cause in the doctrine (4 of 8 documented fixes).
   Any new component that reads `stores.me`, `stores.theme`, etc. without
   scoping the subscription to a narrow sub-component reintroduces this class
   of bug. Given ~62 components and heavy widget churn (many `BENCHMARK:` /
   quantum-engine-widgets PRs landing weekly), this is the highest-probability
   regression vector.
2. **Missing optimistic/pending UI on new async button actions.** The
   `EmotionalCheckIn`/`PatternInsightsWidget` fix (2026-06-30) shows this is
   an ongoing pattern-application task, not a one-time fix — every new
   "click → mutate → wait for server" button needs the same `pendingState`
   treatment or it will *feel* laggy even if render performance is fine.
3. **No production-observable telemetry.** Per §4, if a user reports lag
   today, there's no historical data to confirm which button, how long, or
   how often — the team would be diagnosing blind.

## 6. Next steps

- Add server-side (or at least persisted client-side) reporting for the
  `perf.ts` interaction observer — even a simple `navigator.sendBeacon` to an
  existing log endpoint on threshold breach would close the gap in §4 and let
  future investigations use real data instead of static code review.
- When reviewing new widget PRs, check for the two doctrine violations most
  likely to recur: (a) unscoped store subscriptions in a shared component,
  (b) a button `onClick` that awaits a mutation with no immediate visual
  feedback.
- No code changes made in this investigation — this is a documentation-only
  pass. If a specific user report of lag surfaces (device, browser, which
  button, when), re-open this doc and correlate against `window.__LOT_PERF__.getEntries()`
  output from that session.

## 7. References

- [`docs/benchmark/LOT-DOCTRINE.md`](../benchmark/LOT-DOCTRINE.md) — "Render Isolation", "Subscription Minimization", "Async Signal Recording" sections
- [`src/client/components/ui/Button.tsx`](../../src/client/components/ui/Button.tsx)
- [`src/client/entries/app.tsx`](../../src/client/entries/app.tsx)
- [`src/client/utils/perf.ts`](../../src/client/utils/perf.ts)
- [`src/client/index.css`](../../src/client/index.css) — `.grid-fill-hover` rules
