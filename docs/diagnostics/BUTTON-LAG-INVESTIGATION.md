# Button Lag & Rendering Investigation
**Date:** 2026-06-27  
**Branch:** `claude/brave-rubin-nycgzt`  
**Status:** All known root causes fixed; two areas flagged for future investigation.

---

## Summary

Four distinct categories of button lag / rendering delay were identified in the LOT-Computer codebase. All have been addressed through a series of surgical fixes between June 3–27, 2026. The fix history reflects a deliberate engineering arc: CSS compositing → subscription isolation → React memoization.

---

## Confirmed Issues & Fixes

### 1. Button Hover Lag — CSS (Fixed Jun 12)
**Commit:** [`2c0da2f`](../../src/client/index.css) — *Fix button hover lag: replace background-image transition with GPU-composited opacity*

**Root Cause:**  
`.grid-fill-hover` transitioned `background-image` — two CSS custom-property linear-gradients. Browsers cannot GPU-accelerate `background-image` transitions. Every hover event across all 20+ interactive elements (buttons, GhostButtons, Blocks) triggered synchronous, jittery repaints on the main thread.

**Fix:**  
Replaced with a `::before` pseudo-element. The grid pattern is pre-rendered on the pseudo permanently; hover only animates `opacity` — GPU-composited at zero repaint cost. Then followed up (Jun 27, `1271cd3`) with `will-change: opacity` on that pseudo to pre-promote the compositor layer before the first hover, eliminating a secondary sub-pixel text shift.

**Files:** `src/client/index.css` (`.grid-fill-hover::before`, line 107–121)

---

### 2. Memory Widget Button Lag — Synchronous Signal Blocking (Fixed Jun 21)
**Commit:** `78745c3` — *Bug fixes: Memory button lag*

**Root Cause:**  
On every Memory question answer, `recordSignal()` fired synchronously inside the click handler — before React could commit the visual state change (button highlight). `recordSignal()` includes localStorage reads/writes, keyword-matching over medical/trauma arrays, and pattern analysis. This blocked the browser paint, making the button appear frozen for a visible moment.

**Fix:**  
Wrapped `recordSignal()` in `setTimeout(0)` — defers the expensive synchronous work to after React's render cycle. Visual feedback appears instantly; signal recording runs in the next JavaScript task.

**File:** `src/client/components/MemoryWidget.tsx` (~line 115)

---

### 3. Button Component Store Over-Subscription (Fixed Jun 3)
**Commit:** `4d48dfb` — *BENCHMARK: ENGINEERING — Button.tsx subscription reduction*

**Root Cause:**  
Every button instance — regardless of `kind` — subscribed to both `stores.theme` AND `stores.isMirrorOn`. On any theme toggle or mirror toggle, every button in the UI re-rendered. `secondary` buttons (the default, used ~80% of the time) have no visual dependency on either store.

**Fix:**  
Split into kind-specific private sub-components:
- `PrimaryBtn` → subscribes to `stores.theme` only
- `SecondaryRoundedBtn` → subscribes to `stores.isMirrorOn` only
- `secondary` (default kind) → **zero store subscriptions**

**File:** `src/client/components/ui/Button.tsx` (lines 66–131)

---

### 4. Tab Switching Lag — React Re-render Cascade (Fixed Jun–Jun 27)

This was addressed in three separate waves:

#### 4a. Nav subscription over-reach (Jun 9) — `4355723`
Layout subscribed to the full `me` store. Badge syncs, theme saves, and metadata updates all triggered the entire nav to re-render even when auth state was unchanged.  
**Fix:** Changed subscription to computed `isLoggedIn` store.

#### 4b. CSS `contain:layout` / `inert` attempt (Jun 2) — REVERTED `eb7bf79`
Attempted `contain:layout` and the `inert` attribute for isolation. These broke tab switching (required page reload) and broke Sync chat loading. **Fully reverted.** Lesson: DOM isolation via `inert` interferes with React's event delegation model.

#### 4c. TabPanels + DynamicRoutes cascade (Jun 27) — `b68e842`
`App` re-renders on `isSoundOn`, `isRadioOn`, `isMirrorOn`, and `me` store changes. Without memoization, this cascaded into `Layout → TabPanels → DynamicRoutes` on every such change, even when the route was unchanged.  
**Fix:** `TabPanels` and `DynamicRoutes` wrapped in `React.memo`. They take no external props and subscribe only to `stores.router` — no other store change should re-render them.  
**File:** `src/client/entries/app.tsx` (lines 151, 173)

#### 4d. Heavy tab components without memo (Jun 27) — `1271cd3`
`Logs`, `System`, `Sync`, `Settings` took no external props and read everything from stores, but were not memoized. Every `TabPanel` re-render on route change caused a full re-render of the active tab's entire component tree.  
**Fix:** All four wrapped in `React.memo`.  
**Files:** `src/client/components/Logs.tsx`, `System.tsx`, `Sync.tsx`, `Settings.tsx`

---

## No Open GitHub Issues Found

`list_issues` returned 0 open issues. All resolved issues are tracked through internal benchmark ledger (`docs/benchmark/`) rather than GitHub issues.

---

## Remaining Concerns (Not Yet Fixed)

### A. `Block.tsx` onClick — Unguarded DOM Traversal
**File:** `src/client/components/ui/Block.tsx` (lines 61–85)  
The inline `onClick` handler walks up the DOM tree in a `while` loop to check for interactive ancestors. This handler is not wrapped in `useCallback`, meaning it recreates on every render. If `Block` is frequently re-rendered (e.g. inside a list that re-renders on store change), this creates garbage-collection pressure. Low severity at current page sizes, but worth memoizing.

**Suggested fix:**
```ts
const handleClick = React.useCallback((e: React.MouseEvent) => {
  // ... existing DOM traversal logic
}, [props.onClick])
```

### B. Evolution Transitions — Non-GPU-Accelerated Properties
**File:** `src/client/index.css` (lines 38, 69–71, 98–99, 172–216)  
`--evolution-transition-speed: 400ms` drives transitions on `letter-spacing`, `line-height`, `background-size`, `background-image`, and `text-shadow` across evolved text and grid elements. None of these are GPU-composited. If theme evolution triggers while the user is actively interacting, these could compete with click handlers on the main thread.  
**Mitigation:** Consider limiting evolution transitions to `opacity` and `transform` only — both GPU-composited.

### C. MicroGameWidget 150ms Game Loop
Noted in the USERSHIP_TRANSMISSION: "MicroGameWidget runs a 150ms game loop." This is an always-on `setInterval` on the System tab. If the game loop does non-trivial work, it could cause periodic jitter on button clicks that happen to land in the same task queue slot.  
**Next step:** Profile with Chrome DevTools Performance tab; check if the interval callback is causing long tasks.

### D. QuantumEngineWidgets — Dependency Weight
Also flagged in USERSHIP_TRANSMISSION: "QuantumEngineWidgets carries the most dependency weight." Heavy widget trees slow tab-mount time, which can be perceived as button/tab lag.  
**Next step:** Measure component mount time with React DevTools Profiler; lazy-mount if >16ms.

---

## Fix Timeline

| Date | Commit | Category | Fix |
|------|--------|----------|-----|
| Jun 3 | `4d48dfb` | Store subscriptions | Button.tsx per-kind subscription isolation |
| Jun 9 | `4355723` | Nav re-renders | Layout: `me` store → `isLoggedIn` computed |
| Jun 12 | `2c0da2f` | CSS hover lag | `grid-fill-hover`: `background-image` → `opacity` on `::before` |
| Jun 21 | `78745c3` | Click handler blocking | MemoryWidget: `recordSignal()` deferred via `setTimeout(0)` |
| Jun 27 | `b68e842` | React cascade | `TabPanels` + `DynamicRoutes` wrapped in `React.memo` |
| Jun 27 | `1271cd3` | React cascade + label shift | Logs/System/Sync/Settings `React.memo` + `will-change: opacity` |

---

## Key Files

| File | Relevance |
|------|-----------|
| `src/client/components/ui/Button.tsx` | Core button component; per-kind store isolation |
| `src/client/components/ui/Block.tsx` | Label+content click delegation; unguarded DOM traversal |
| `src/client/components/MemoryWidget.tsx` | `setTimeout(0)` deferral pattern |
| `src/client/entries/app.tsx` | `TabPanels`/`DynamicRoutes` memo |
| `src/client/components/Logs.tsx` | `React.memo` wrapping |
| `src/client/index.css` | `grid-fill-hover`, `will-change`, evolution transitions |

---

*Investigated by Claude Sonnet 4.6 — 2026-06-27*
