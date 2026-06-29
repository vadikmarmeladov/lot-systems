================================================================================
LOT SYSTEMS / SESSION REPORT
DOCUMENT: LOT-SR-BUTTON-LAG-INVESTIGATION
TITLE:    Button Lagging & Rendering Performance — Full Audit
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-06-29
BRANCH:   claude/brave-rubin-a2fupn
================================================================================


--------------------------------------------------------------------------------
00 // EXECUTIVE SUMMARY
--------------------------------------------------------------------------------

This document audits all button lagging and rendering performance issues found
in the LOT-Computer codebase as of 2026-06-29. Five confirmed root causes were
identified across the history — all now fixed. Four areas carry residual risk
and require attention before the next Benchmark cycle.

VERDICT: No current critical regressions. Residual risk is real but manageable.


--------------------------------------------------------------------------------
01 // CONFIRMED ISSUES — FIXED
--------------------------------------------------------------------------------

──────────────────────────────────────────────────
I-01 · Memory Button Lag — recordSignal() blocking visual commit
──────────────────────────────────────────────────
COMMIT:      78745c3  (Jun 21, 2026)
FILE:        src/client/components/MemoryWidget.tsx
STATUS:      FIXED

ROOT CAUSE:
  The "Memory" button's onClick called recordSignal() synchronously before
  React could commit the button's pressed/active visual state. recordSignal()
  performs synchronous localStorage reads/writes + QIE pattern analysis on the
  main thread. React queued its visual update but the synchronous work blocked
  the JS thread long enough for the interaction to feel unresponsive — the
  button appeared to hang before changing state.

EVIDENCE:
  Commit message: "Fix Memory button lag: defer recordSignal() via setTimeout(0)
  so React commits visual feedback before synchronous localStorage + pattern
  analysis."

FIX APPLIED:
  recordSignal() deferred via setTimeout(0). React commits the visual update in
  the current microtask frame; recordSignal() runs in the next macrotask.
  Visual feedback is now instant; the work still runs but off the critical path.

RESIDUAL RISK:
  recordSignal() still runs synchronously on the main thread (just deferred).
  If the function grows heavier, a Web Worker or async chunking will be needed.
  See I-OPEN-03 below.

──────────────────────────────────────────────────
I-02 · Tab Label Text Shift on Hover — missing GPU layer pre-promotion
──────────────────────────────────────────────────
COMMIT:      1271cd3  (Jun 27, 2026)
FILE:        src/client/index.css  (.grid-fill-hover::before)
STATUS:      FIXED

ROOT CAUSE:
  .grid-fill-hover::before uses `transition: opacity 180ms ease` for the button
  hover fill animation. Without `will-change: opacity`, the browser promotes the
  element to a GPU compositor layer only at hover time — not before. This on-
  demand promotion causes a sub-pixel text-position reflow at the start of the
  transition. Visible as label text "jumping" by ~1px when hovering nav buttons.

FIX APPLIED:
  Added `will-change: opacity` to .grid-fill-hover::before. The GPU layer is
  now pre-promoted at paint time; no on-demand promotion at hover start.

RESIDUAL RISK:
  will-change pre-allocates GPU memory for every element with this class.
  Grid-fill-hover is used on all secondary buttons, nav buttons, and ghost
  buttons. On memory-constrained mobile devices (< 2 GB RAM), this increases
  compositor memory pressure. Acceptable at current volume; worth monitoring
  at scale.

──────────────────────────────────────────────────
I-03 · Tab Switching Lag — all tabs re-rendering on every route change
──────────────────────────────────────────────────
COMMITS:     ad37d19 (Jun 23) → b68e842 (Jun 27) → 1271cd3 (Jun 27)
FILE:        src/client/entries/app.tsx + individual tab components
STATUS:      FIXED (after two correction iterations)

ROOT CAUSE (full timeline):

  Attempt 1 — FAILED (commit b7563ca, Jun 2 — reverted same session):
    React.memo applied directly to propless tab components (System, Sync, etc.).
    Since they receive no props, shallow comparison always returns true → memo
    cached the initial render permanently → tab content never re-rendered.
    Required a full page reload to switch views. Reverted within the same
    benchmark session.

  Attempt 2 — PARTIAL FIX (commit ad37d19, Jun 23):
    All 5 TabPanel instances independently subscribed to stores.router, causing
    all tabs — including System with 14+ internal store subscriptions and 40+
    widgets — to re-render on every route change. Fixed by consolidating the
    router subscription into a single TabPanels parent; TabPanel receives
    `active: boolean` as a prop with a custom comparator that only re-renders
    the tab whose active state actually changed.

  Attempt 3 — COMPLETE FIX (commits b68e842 + 1271cd3, Jun 27):
    App component re-renders on isSoundOn / isRadioOn / isMirrorOn / me store
    changes. These cascaded through Layout → TabPanels even when the route
    hadn't changed, negating the ad37d19 isolation. Fixed by wrapping TabPanels
    and DynamicRoutes in React.memo (no-props = always equal). Also re-applied
    React.memo with named inner functions to Logs, Sync, Settings, System — these
    subscribe to stores internally, so memo fires correctly (subscription changes
    trigger their own re-renders; parent-driven re-renders are now blocked).

CURRENT STATE (app.tsx):
  TabPanel:   React.memo with custom comparator (prev.active === next.active)
  TabPanels:  React.memo (no props, blocks App cascade)
  DynamicRoutes: React.memo (no props, blocks App cascade)
  Logs/Sync/Settings/System: React.memo with named inner functions

──────────────────────────────────────────────────
I-04 · Button Store Subscription Waste — all variants subscribed to all stores
──────────────────────────────────────────────────
COMMIT:      4d48dfb  (Jun 3, 2026)
FILE:        src/client/components/ui/Button.tsx
STATUS:      FIXED

ROOT CAUSE:
  Every Button instance (regardless of kind) called useStore(stores.theme) and
  useStore(stores.isMirrorOn). The secondary kind (the default, used across the
  entire app) reads neither store. On any theme or mirror toggle, every button
  on the page re-rendered even though their output was identical.

FIX APPLIED:
  Button split into kind-specific private sub-components:
  - PrimaryBtn:          useStore(stores.theme) only
  - SecondaryRoundedBtn: useStore(stores.isMirrorOn) only
  - secondary (default): no store subscriptions

IMPACT:
  Default secondary buttons (used across all tabs, nav, settings forms) are now
  completely isolated from theme and mirror changes. Re-render cost on toggle
  reduced from O(all buttons) to O(primary + secondary-rounded buttons only).

──────────────────────────────────────────────────
I-05 · NavButton Re-renders on Route Change
──────────────────────────────────────────────────
FILE:        src/client/components/ui/Layout.tsx  (NavButton)
STATUS:      FIXED

ROOT CAUSE:
  All nav buttons re-rendered whenever the route changed, even if their active
  state didn't change (e.g. clicking "System" re-rendered Sync, Log, Settings,
  API, Settings buttons unnecessarily).

FIX APPLIED:
  NavButton wrapped in React.memo with explicit props (link, isActive, isMirrorOn).
  Only the button whose isActive flips re-renders on navigation.


--------------------------------------------------------------------------------
02 // OPEN RISKS — NOT YET FIXED
--------------------------------------------------------------------------------

──────────────────────────────────────────────────
I-OPEN-01 · grid-fill CSS transitions — non-compositable properties
──────────────────────────────────────────────────
FILE:        src/client/index.css  (.grid-fill)
SEVERITY:    MEDIUM

The .grid-fill class (used on the main background grid) transitions
background-size and background-image at 400ms on theme/evolution changes:

  transition: background-size 400ms ease, background-image 400ms ease;

Neither background-size nor background-image is GPU-compositable. These
transitions require a full re-raster of the element on every frame, running on
the main thread. On the System tab (which uses grid-fill as the page
background), a theme change or evolution-level change triggers 400ms of
per-frame raster work. This competes with JS and can cause input lag during
the transition window.

RECOMMENDED FIX:
  Replace with opacity or transform-based transitions using a pseudo-element,
  similar to how grid-fill-hover already works. Pre-render both states as
  ::before and ::after, crossfade via opacity. Zero raster cost post-paint.

──────────────────────────────────────────────────
I-OPEN-02 · evolution-transition-speed: 400ms — too slow for interactive elements
──────────────────────────────────────────────────
FILE:        src/client/index.css  (--evolution-transition-speed)
SEVERITY:    LOW-MEDIUM

The global CSS custom property --evolution-transition-speed is set to 400ms
and applied to color, letter-spacing, line-height, opacity, text-shadow, and
filter transitions across many components. For background or decorative
transitions, 400ms is fine. For interactive elements (buttons, nav links,
toggles), the HIG target is 100–200ms. At 400ms, theme changes that affect
button text color feel sluggish.

RECOMMENDED FIX:
  Introduce a separate --interactive-transition-speed: 150ms and apply it to
  button and nav element transitions. Leave --evolution-transition-speed for
  ambient/decorative transitions only.

──────────────────────────────────────────────────
I-OPEN-03 · recordSignal() / pattern analysis — main-thread synchronous work
──────────────────────────────────────────────────
FILE:        src/client/stores/intentionEngine.ts (called from MemoryWidget, Logs, etc.)
SEVERITY:    MEDIUM

recordSignal() performs synchronous localStorage I/O + QIE pattern analysis
each time a button is clicked or a log is saved. The setTimeout(0) fix in
I-01 removed it from the visual commit path, but the work still runs on the
main thread and blocks input processing for its duration.

As the QIE grows (currently 72+ patterns, 126+ dep nodes), this synchronous
analysis window will grow. Any button click that triggers recordSignal() will
cause an INP spike during the analysis phase, particularly on lower-end devices.

RECOMMENDED FIX:
  Move recordSignal() and analyzeIntentions() to a Web Worker or use
  scheduler.postTask() / scheduler.yield() to chunk the work. The
  intentionEngine already reads from localStorage — a structured-clone bridge
  to a worker is straightforward.

──────────────────────────────────────────────────
I-OPEN-04 · System tab component weight
──────────────────────────────────────────────────
FILE:        src/client/components/System.tsx
SEVERITY:    MEDIUM

The System tab subscribes to 14+ stores and renders 40+ widgets. Even with
TabPanel isolation (I-03), the first mount of System.tsx costs ~150ms of JS
execution per the SR-20260603 notes. Subsequent tab switches back to System
trigger no re-render (React.memo holds), but the initial cold mount is heavy.

The SR-20260603-01 deferred target was "heavy widget lazy-mount" for
MicroGameWidget (150ms game loop) and QuantumEngineWidgets.
MicroGameWidget is now viewport-gated via useActiveViewport (confirmed in
USERSHIP_TRANSMISSION). QuantumEngineWidgets lazy-mount status is unconfirmed.

RECOMMENDED FIX:
  - Verify QuantumEngineWidgets is viewport-gated or lazy-mounted.
  - Consider React.lazy() + Suspense for the heaviest widgets (QuantumEngine,
    SystemPulse) to shift their parse+execute cost out of the initial System mount.
  - Add a lightweight skeleton/placeholder during first mount to prevent perceived
    lag at initial tab open.

──────────────────────────────────────────────────
I-OPEN-05 · MemoryWidget nested setTimeout chains
──────────────────────────────────────────────────
FILE:        src/client/components/MemoryWidget.tsx
SEVERITY:    LOW

MemoryWidget contains deeply nested setTimeout chains (up to 4 levels deep at
lines 75→90→92→94 and 195→197→203→206) for animation orchestration. These
accumulate in the macrotask queue and can cause timing drift under heavy load.
If multiple button interactions fire quickly (e.g. double-tap), timers from the
first interaction may fire mid-second-interaction, causing visual glitches.

RECOMMENDED FIX:
  Replace nested setTimeout animation chains with CSS keyframe animations or
  the Web Animations API. Move state transitions to CSS classes toggled by a
  single setState. Zero JS timing overhead for the visual path.


--------------------------------------------------------------------------------
03 // PERFORMANCE INFRASTRUCTURE — CURRENT STATE
--------------------------------------------------------------------------------

OBSERVER:    initPerfObserver() (src/client/utils/perf.ts) — initialized in
             App useEffect. Likely an INP / LoAF observer. No data surface
             found — metrics appear console-only. Consider feeding to a
             server-side log for production visibility.

INTERVALS ACTIVE:
  SystemPulseWidget:     10_000ms (was 1_000ms — reduced to prevent DB overload)
  ContextualPrompts:     unknown interval (src/client/components/ContextualPromptsWidget.tsx:25)
  SystemProgressWidget:  60_000ms (recomputeAssembly)
  Clock:                 caller-defined (flexible)
  MicroGameWidget:       gated via useActiveViewport — only runs when in viewport

CSS CONTAINMENT:
  grid-fill-hover uses isolation: isolate — correct, prevents stacking context
  bleed. No content-visibility: auto found on heavy tab panels — this would
  skip layout/paint for off-screen tabs entirely and is worth evaluating.


--------------------------------------------------------------------------------
04 // TIMELINE
--------------------------------------------------------------------------------

DATE         COMMIT   EVENT
-----------  -------  ---------------------------------------------------------
2026-06-02   b7563ca  First React.memo attempt on tab components — REVERTED
                      (propless memo blocked all tab content updates)
2026-06-03   4d48dfb  Button.tsx subscription reduction — secondary kind: 0 subs
2026-06-21   78745c3  Memory button lag fixed — recordSignal() deferred to
                      setTimeout(0) so visual commit runs first
2026-06-23   ad37d19  Tab navigation lag: TabPanel memo + router consolidation
2026-06-27   b68e842  TabPanels + DynamicRoutes wrapped in React.memo to block
                      App store cascade
2026-06-27   1271cd3  Tab label text shift fixed (will-change: opacity);
                      React.memo re-applied to Logs/Sync/Settings/System with
                      named inner functions


--------------------------------------------------------------------------------
05 // NEXT STEPS (PRIORITY ORDER)
--------------------------------------------------------------------------------

  P1.  Verify QuantumEngineWidgets lazy-mount / viewport-gating status
       (I-OPEN-04). Confirm the SR-20260603-01 deferred target was completed.

  P2.  Replace grid-fill background-size/image transition with opacity crossfade
       using a GPU-compositable pseudo-element approach (I-OPEN-01).

  P3.  Introduce --interactive-transition-speed: 150ms for button/nav transitions
       separate from --evolution-transition-speed: 400ms (I-OPEN-02).

  P4.  Surface initPerfObserver() INP data to a server log for production
       visibility rather than console-only output.

  P5.  Move recordSignal() / analyzeIntentions() to a Web Worker or use
       scheduler.postTask() chunking as QIE pattern count grows (I-OPEN-03).

  P6.  Replace MemoryWidget nested setTimeout animation chains with CSS
       keyframe animations (I-OPEN-05).


--------------------------------------------------------------------------------
06 // RELEVANT CODE LOCATIONS
--------------------------------------------------------------------------------

src/client/components/ui/Button.tsx          Button subscription isolation
src/client/components/ui/Layout.tsx          NavButton memo
src/client/entries/app.tsx                   TabPanel / TabPanels / DynamicRoutes memo
src/client/index.css                         grid-fill, grid-fill-hover, evolution-speed
src/client/components/MemoryWidget.tsx       recordSignal() defer fix
src/client/components/System.tsx             Heavy tab — 14+ stores, 40+ widgets
src/client/components/QuantumEngineWidgets.tsx  Lazy-mount status unconfirmed
src/client/utils/perf.ts                     INP observer (console-only)
src/client/stores/intentionEngine.ts         recordSignal / analyzeIntentions


================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-SR-BUTTON-LAG-INVESTIGATION
================================================================================
