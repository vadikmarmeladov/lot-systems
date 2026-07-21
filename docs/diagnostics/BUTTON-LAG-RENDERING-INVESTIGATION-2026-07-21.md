# Button Lag / Rendering Investigation — 2026-07-21

Scheduled investigation into reports of buttons lagging and rendering
problems. Scope: review recent history for related fixes, check whether the
underlying pattern is fully closed, and flag anything still open.

## 1. Prior art — this has been an active, recurring bug class

Git history shows five prior fix rounds targeting the same two failure
modes (button-press freezes and tab-switch/render stalls), most recently
two days ago:

| Commit | Date | Fix |
|---|---|---|
| `bd9ef2a` | 07-04 | **Planner buttons frozen** — `playClickSound()` created a `new AudioContext()` on every click; once the browser's per-page AudioContext cap was hit, the constructor threw and killed the click handler *before* `plannerWidget.set()` ran, so the button visibly did nothing. Fixed by reusing one `AudioContext` + wrapping the whole sound path in try/catch so audio failures never block state updates. |
| `863b333` | 07-19 | **Widget lag** — `GET /api/logs` was unbounded (capped to 500) and 7 stats polls (30–60s) were thundering-herding the connection pool. |
| `ee88f4c` | 07-19 | **Tab-switch freeze** — tabs stay permanently mounted at `display:none` (see `TabPanel` in `src/client/entries/app.tsx:143-156`); System's background intervals kept running full-speed on hidden tabs because the only guard was `document.hidden`, which stays `false` for in-app tab switches. Added `isRouteActive(route)` and gated `SystemProgressWidget`'s 60s recompute and `SystemPulseWidget`'s 10s poll on it; also deferred `recordSignal`'s localStorage persist + pattern analysis off the interaction tick. |
| `d922509` | 07-19 | Removed a duplicate `SystemProgressWidget` mount that was doubling all of the above work. |
| `6e5007a` | 07-19 (latest) | **Progressive stall** ("works 2-3 switches, then freezes") — root cause was CPU fan-out, not a leak: `PatternRecognitionWidget` called `getOptimalWidget()` (→ `analyzeIntentions` → an `intentionEngine.set()` **write**) directly in the render body, so every re-render triggered another atom write, cascading into more re-renders across all ~7-9 permanently-mounted System subscriber widgets. Memoized it; also gated `ChakraErgonomicsWidget` (2min), `ContextualPromptsWidget` (15s), `EvolutionMilestoneToast` (30s) on `isRouteActive('system')`. |

All five are merged to `master` (PRs #78–#88) and recorded GREEN in
`docs/benchmark/LOT-SR-20260719-01.md`.

## 2. Finding: the fan-out pattern was not fully closed

The 07-19 fixes gated **5** of the System-tab widgets that run background
intervals (`SystemProgressWidget`, `SystemPulseWidget`,
`ChakraErgonomicsWidget`, `ContextualPromptsWidget`,
`EvolutionMilestoneToast`) on `isRouteActive('system')`. Auditing every
`setInterval` under `src/client/components/` turned up two more System-tab
widgets with the *same* un-gated pattern that appear to have been missed:

- **`QuantumRandomWidget`** (`src/client/components/QuantumRandomWidget.tsx:38-54, 64-69`)
  — mounted twice in `System.tsx` (lines 586, and via `useQuantumNumber()`
  called twice within one instance). Runs a **1-second** `setInterval` per
  instance (two of them) plus a 10-second `setInterval`, all calling
  `setState` unconditionally with no `isRouteActive`/`document.hidden` guard.
  When the countdown expires it also calls `recordSignal(...)`
  (`intentionEngine.set()`), the exact same atom-write-triggers-fan-out chain
  that `6e5007a` fixed for the other widgets — but this one still fires it
  continuously in the background on whatever cadence (1–72s) the countdown
  lands on, regardless of which tab the user is viewing.
- **`MicroCalculatorWidget`** (`src/client/components/MicroCalculatorWidget.tsx:47-73`)
  — a 10-second `setInterval` calling `detectMagicTime()` unconditionally;
  on a match it also calls `recordSignal('calculator', 'magic_time', ...)`.
  Same gap, lower frequency.

By contrast, `MicroGameWidget` (also in `System.tsx`) already does this
correctly — its game-loop interval is gated on an `inViewport` check
(`src/client/components/MicroGameWidget.tsx:783-823`), which naturally goes
false when the parent `TabPanel` switches to `display:none`. That's the
reference pattern the other two widgets should follow.

**Net effect:** once a user has ever opened the System tab, these two
widgets stay mounted (per the `TabPanel`/`visitedRef` pattern in
`src/client/entries/app.tsx:150-156`) and keep ticking every 1–10 seconds
in the background on every other tab, periodically re-triggering the
`intentionEngine` atom write that `6e5007a` specifically called out as the
progressive-stall root cause. This is a plausible explanation for lingering
button-lag/stall reports even after the 07-19 GREEN gate, since the fix
covered 5 of 7 affected widgets.

## 3. Other angles checked, ruled out

- No open GitHub issues or PRs reference button lag or rendering — this
  problem class has been tracked entirely through commit messages and
  `docs/benchmark/` session reports, not GitHub issues.
- No other `AudioContext`-per-call patterns remain (`sound.ts`,
  `sovietGameSounds.ts`, `sovietKeyboard.ts`, `sovietChime.ts` all already
  use a shared/cached context, same fix shape as `bd9ef2a`).
- `About.tsx` and `StatusPage.tsx` also have un-gated intervals, but neither
  is part of the permanently-mounted tab set in `app.tsx` (`About` isn't
  routed through the SPA tab system at all; `StatusPage` renders via
  `DynamicRoutes`, which unmounts on route change rather than hiding via
  `display:none`) — not a contributor here.

## 4. Recommended next step

Apply the same `isRouteActive('system')` (or `document.hidden`) guard used
in `6e5007a`/`ee88f4c` to the two intervals in `QuantumRandomWidget.tsx` and
the one in `MicroCalculatorWidget.tsx`, mirroring the existing gated
widgets in the same file. This is a small, low-risk follow-up in the same
shape as the last four merged fixes — not yet applied in this pass since it
was out of scope for a read-only investigation.
