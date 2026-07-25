# Button Lag / Rendering Investigation — 2026-07-25

Scheduled investigation into reported button lag and rendering problems.
Scope: recent commits, PRs, and issues touching button components and
render performance; current-state check of the patterns that caused past
lag, to confirm they're not regressing.

## Result: no open issue, no reproducible lag on current `master` (`add997e`)

There is no open GitHub issue or PR describing button lag right now, and no
commits have landed since **2026-07-19** (`add997e`, PR #88). That merge is
itself the tail end of a dedicated lag-fixing session
(`docs/benchmark/LOT-SR-20260719-01.md`, ledger entry `20260719-01`), which
root-caused and fixed the exact symptom class this task asked about:
buttons/widgets freezing or stalling on interaction and on tab switch.
Everything below is what that investigation found, plus a check of whether
any of it has regressed or has unpatched siblings elsewhere in the codebase.

## Root causes found and fixed (chronological, all merged)

| Commit | Symptom | Root cause | Fix |
|---|---|---|---|
| [`bd9ef2a`](https://github.com/LOT-Systems/LOT-Computer/commit/bd9ef2a1a0f378d51c4bcc3bb6ef044185de3d7e) | Planner buttons freeze after repeated clicks | `playClickSound()` called `new AudioContext()` on every click; browsers cap live `AudioContext` instances, so the constructor eventually throws — killing `cycleValue`/`navigateCategory` *before* `plannerWidget.set()` runs, so state never updates | Single shared `_audioCtx` reused across clicks, entire sound path wrapped in try/catch so an audio failure can never block navigation |
| [`863b333`](https://github.com/LOT-Systems/LOT-Computer/commit/863b3337579ece2b962db7b4393c3f9ce81830cd) | ~1-minute response delay on IntentionsWidget and other System-tab widgets | Unbounded `GET /api/logs` (30k+ rows for long-term users) refetched every 30s; 7 stats-polling hooks at 30–60s intervals, all fetching even while backgrounded → DB connection-pool starvation | `LIMIT 500` on the logs query, `useLogs` staleTime 30s→5min, stats polls 30–60s→120s + `refetchIntervalInBackground: false` |
| [`b219cc3`](https://github.com/LOT-Systems/LOT-Computer/commit/b219cc37c1acf419c787aa8db44cfbd2ef79012c) | Visible lag on every logs change in `System.tsx` | `analyzeIntentions()` + `recomputeAssembly()` (both write nanostore atoms) were called inside `useMemo` — render-phase execution — scheduling ~10 re-renders before the browser could paint | Moved both calls into `useEffect` (post-paint); derived value seeded via `useState` so first render is unchanged |
| [`ee88f4c`](https://github.com/LOT-Systems/LOT-Computer/commit/ee88f4c871aadbd481141cae4bf1343a5015d55b) | Progressive freeze after 2–3 in-app tab switches; every tab stays mounted via `display:none` | Background intervals only checked `document.hidden`, which stays `false` when switching *in-app* tabs (the browser tab itself is still visible) — so heavy System work never actually paused off-tab | Added `stores.isRouteActive(route)`, a subscription-free current-route check; gated `SystemProgressWidget`'s 60s `recomputeAssembly` and `SystemPulseWidget`'s 10s poll on it; deferred `recordSignal`'s localStorage persist (coalesced via `setTimeout`) and `analyzeIntentions` (125-pattern scan, via `requestIdleCallback`) off the interaction tick |
| [`d922509`](https://github.com/LOT-Systems/LOT-Computer/commit/d922509b346ca85ff49fb4df41c47943f7c1cdc8) | Duplicate work | `SystemProgressWidget` was accidentally mounted twice in `System.tsx`, doubling its mount effects (`recomputeAssembly`, `analyzeIntentions`, the 60s interval, an API fetch) | Removed the stray instance |
| [`6e5007a`](https://github.com/LOT-Systems/LOT-Computer/commit/6e5007a4b5889967100b157116abba7cfdbc9521) | Stall returns after 2–3 tab switches even with the above fixes | `PatternRecognitionWidget.getOptimalWidget()` (which internally calls `analyzeIntentions()` → writes the `intentionEngine` atom) ran unmemoized in the render body — a store write *during render*, cascading re-renders across all ~7–9 permanently-mounted System subscriber widgets on every signal. Three more intervals (`ChakraErgonomicsWidget` 2min, `ContextualPromptsWidget` 15s, `EvolutionMilestoneToast` 30s) were still ungated | Memoized `getOptimalWidget()` on `recognizedPatterns`; fixed a `useMemo` dependency from the whole `engine` object (new ref every signal) to `recognizedPatterns`+`view`; gated the three remaining intervals on `isRouteActive('system')` |
| [`e892ed4`](https://github.com/LOT-Systems/LOT-Computer/commit/e892ed41af5ea0d5d7d35daf1675411e5e7c16e1) | Active nav tab visually "deactivates" on hover (rendering artifact, not lag) | `hover:before:!opacity-0` compiled to no CSS at all — this Tailwind config emits zero `!important` utilities — so the `grid-fill-hover::before` pseudo-element's opaque backdrop painted over the active tab's solid fill on hover | Replaced with `before:!hidden`, confirmed present in compiled output |

Doctrine updated accordingly: `docs/benchmark/LOT-DOCTRINE.md` → **Render
Isolation** now carries a standing corollary ("work that WRITES to a store
must not run inside `useMemo`; move it to `useEffect`") and a new **Client
Cache Freshness** section.

## Verification pass performed today

To check whether any of the above regressed, or whether the same bug
classes exist elsewhere unpatched:

- **`AudioContext`-per-click bug (the `bd9ef2a` class).** Checked every
  other site that constructs a `Web Audio` context:
  `src/client/utils/sovietGameSounds.ts`, `sovietKeyboard.ts`,
  `sovietChime.ts`, and `src/client/utils/sound.ts`'s `useSound()` hook.
  All four already use a shared/cached context (module-level `let` reused
  across calls, or a `React.useRef`), and three wrap creation in try/catch.
  No unpatched sibling found.
- **Ungated global-store-writing intervals (the `6e5007a`/`ee88f4c`
  class).** Grepped every `setInterval` under
  `src/client/components/**/*.tsx`. The System-tab widgets
  (`SystemProgressWidget`, `SystemPulseWidget`, `ChakraErgonomicsWidget`,
  `ContextualPromptsWidget`, `EvolutionMilestoneToast`) all now gate on
  `document.hidden`/`isRouteActive('system')` as expected. The remaining
  ungated intervals (`StatusPage` 2min status poll, `About.tsx` 60s public
  analytics poll, `MicroGameWidget`'s game-loop tick, `TimeWidget`/`Clock`
  1s clock ticks) are local `useState` only — no nanostore writes — and
  three of them live on standalone routes rather than permanently-mounted
  System-tab widgets, so they're not instances of the same bug. Not
  flagged as issues.
- **`grid-fill-hover` CSS cost** (the pseudo-element painted on every
  `Button`/`GhostButton` hover, `src/client/index.css:102-158`): animates
  only `opacity` with `will-change: opacity`, no layout-triggering
  properties. Not a lag source.
- **Current branch state**: `master`/`add997e` — no commits since
  2026-07-19, no open PRs, no open GitHub issues matching lag/freeze/render
  keywords.

## Conclusion

The button-lag and rendering-artifact reports this task was asked to
investigate appear to already be resolved on `master` as of the
2026-07-19 benchmark session (`LOT-SR-20260719-01`, ledger `20260719-01`,
GREEN gate). No new regressions or unpatched instances of the same bug
classes were found in today's pass.

## Next steps (if lag is still being observed live)

1. **Get a fresh repro**: which page/widget, which browser, does it
   correlate with tab-switch count (the `6e5007a` symptom) or first-load
   (a different cause)? The fixes above were all diagnosed from specific
   repro patterns — a vague "buttons feel laggy" report needs a repro to
   go further than this pass did.
2. If it reproduces, capture a Performance-panel trace or React Profiler
   flamegraph around the interaction — every fix above was found by
   tracing re-render fan-out, not by code reading alone.
3. Check whether it's client-side (render fan-out — the pattern above) or
   server-side (API latency, DB pool pressure — the pattern behind
   `863b333`) using the Network panel first; the two have different fixes.
