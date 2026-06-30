================================================================================
LOT SYSTEMS / DIAGNOSTIC REPORT
DOCUMENT: BUTTON-LAG-INVESTIGATION
TITLE:    Button Lag & Rendering Performance Investigation
CLASS:    ENGINEERING
S-2:      VADIM MARMELADOV
DATE:     2026-06-30
STATUS:   ACTIVE — partial fixes shipped, residual issues remain
================================================================================

---

## 1. EXECUTIVE SUMMARY

Button lag and rendering jank were traced to four root causes. Two were fixed
on June 27, 2026 (tab switching lag and label text shift). Two remain active:
`Block.tsx` mass re-renders on store changes, and `ToggleSection` using a
layout-thrashing CSS transition anti-pattern.

A live INP (Interaction to Next Paint) observer runs in production — data
retrievable via `window.__LOT_PERF__.getEntries()` in browser DevTools.

---

## 2. FIXES ALREADY SHIPPED

### 2a. Tab switching lag — FIXED (commit 1271cd3, 2026-06-27)

**Symptom:** Clicking a nav button to switch tabs felt sluggish; the new tab
contents took a visible frame or two to appear.

**Root cause:** `App` re-renders on `isSoundOn`, `isRadioOn`, `isMirrorOn`,
and `me` store changes. Without memoization, every such re-render caused a
full cascade: `App → Layout → TabPanels → TabPanel → System/Logs/Sync/Settings`.
The active tab's heavy component tree (System has ~80 Block instances) re-rendered
on every unrelated store change.

**Fix:** Wrapped `TabPanels`, `DynamicRoutes`, `Logs`, `System`, `Sync`,
`Settings`, and `NavButton` in `React.memo`. `TabPanel` got a custom comparator
`(prev, next) => prev.active === next.active` so it only re-renders when
visibility actually changes.

**Files changed:**
- `src/client/entries/app.tsx` — TabPanel, TabPanels, DynamicRoutes
- `src/client/components/Logs.tsx`
- `src/client/components/System.tsx`
- `src/client/components/Sync.tsx`
- `src/client/components/Settings.tsx`
- `src/client/components/ui/Layout.tsx` — NavButton

---

### 2b. Label text shift on button hover — FIXED (commit 1271cd3, 2026-06-27)

**Symptom:** On hover, the text inside grid-fill buttons would shift by a
sub-pixel before the transition settled.

**Root cause:** `.grid-fill-hover::before` (the pseudo-element that fades in
the grid pattern) was not pre-promoted to a GPU compositor layer. The first
hover event caused a layer promotion mid-transition, which triggered a layout
recalculation and visibly shifted sibling text.

**Fix:** Added `will-change: opacity` to `.grid-fill-hover::before` in
`src/client/index.css`. This pre-promotes the layer before any hover event,
so the transition starts on a stable GPU layer with no text shift.

---

## 3. REMAINING ISSUES

### 3a. Block.tsx — mass re-renders on theme and mirror store changes

**File:** `src/client/components/ui/Block.tsx`

**Priority:** HIGH

**Problem:** `Block` is the standard label-content row component used in
virtually every widget. It calls `useStore(stores.theme)` and
`useStore(stores.isMirrorOn)` at the top level. It has no `React.memo`
wrapper.

Consequence: when the user toggles Mirror mode, **every visible Block
instance re-renders simultaneously**. The System tab alone has ~80 Block
rows. Each Block re-renders to recompute `hoverClassName` and `progressStyle`
(a `useMemo` that gates on `theme` and `isMirrorOn`). This produces a
~80-component synchronous render batch that blocks the main thread during
the button press that triggered the toggle.

**Evidence:** The `progressStyle` memo already guards against unnecessary
recomputation, but `React.memo` on the Block component itself is missing —
so parent re-renders (which don't change any Block prop) still cause all
Block instances to re-render.

**Fix path:** Wrap `Block` in `React.memo`. Since Block takes object props
(`style`, `className`, etc.) a shallow comparison is sufficient. Alternatively,
extract the two `useStore` calls into a thin inner component so only that
thin shell re-renders on store changes.

```tsx
// Option A — simplest
export const Block = React.memo<Props>(function Block({ blockView = false, ...props }) {
  ...
})
```

---

### 3b. ToggleSection — `transition-all` on `max-height` causes layout reflow

**File:** `src/client/components/ui/ToggleSection.tsx:66`

**Priority:** MEDIUM

**Problem:** The expand/collapse animation uses:
```css
transition-all duration-300
max-h-[2000px] opacity-100  /* open */
max-h-0 opacity-0           /* closed */
```

`transition-all` is a broad directive that animates every animatable CSS
property. More critically, `max-height` animation forces the browser to
recalculate layout on **every animation frame** for 300ms, since the browser
must compute exactly how tall the content is at each step. This is not
GPU-accelerated and is classified as a "layout-thrashing animation."

When a ToggleSection is inside a heavy widget (e.g., the Logs tab or
Settings), expanding or collapsing it stalls the main thread for the full
300ms duration, which degrades button click responsiveness.

**Fix path:** Replace `max-height` animation with the CSS Grid `grid-template-rows`
trick — this animates only the grid row height, which the compositor can
handle without layout reflow:

```tsx
// Replace the content div:
<div
  className="grid transition-[grid-template-rows] duration-300"
  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
>
  <div className="overflow-hidden">
    <div className="py-4">{children}</div>
  </div>
</div>
```

Or, if CSS grid approach is not acceptable, wrap children in `display: none`
when fully closed (no animation needed if transitions are kept under 100ms
with `opacity` only).

---

### 3c. Body-level CSS transitions — 400ms on text across the whole page

**File:** `src/client/index.css:69–71`

**Priority:** LOW–MEDIUM

**Problem:**
```css
body {
  transition: color 400ms ease,
              letter-spacing 400ms ease,
              line-height 400ms ease;
}
```

When the evolution system writes new values to `--evolution-letter-spacing`,
`--evolution-line-height`, or `--acc-color-default` (which drives `color`
via `rgb(var(--acc-color-default) / ...)`), the entire page text animates
for 400ms. This is intentional UX, but it means any evolution-system store
update during a click event creates a 400ms period of animated text — which
can look like the UI is "thinking" or lagging after a button press that
triggers a log event.

**Fix path:** No code change needed if evolution transitions are intentional.
However, if the 400ms feels slow, reduce `--evolution-transition-speed` at
the lower evolution tiers (e.g., 200ms for tier 0–2, stepping up to 400ms
only at higher tiers). The variable is already dynamic — the evolution store
just needs to write smaller values for new users.

---

### 3d. SecondaryRoundedBtn — per-instance `isMirrorOn` subscription

**File:** `src/client/components/ui/Button.tsx:93`

**Priority:** LOW

**Problem:** Every `Button` with `kind="secondary-rounded"` (including all 9
nav buttons) independently subscribes to `stores.isMirrorOn`. When mirror is
toggled, 9 button instances re-render simultaneously. This is not currently
causing lag but will scale poorly if more secondary-rounded buttons are added
to visible views.

**Fix path:** Hoist the `isMirrorOn` read to the caller or pass it as a prop
from Layout (which already reads it). NavButton already receives `isMirrorOn`
as a prop — the `SecondaryRoundedBtn` sub-component re-subscribes redundantly.

---

## 4. PERFORMANCE OBSERVABILITY

### Built-in INP observer (`src/client/utils/perf.ts`)

The app ships a lightweight Interaction-to-Next-Paint observer that logs
all interactions exceeding 50ms (and console.warns above 200ms). It is
initialized at app start in `src/client/entries/app.tsx:278`.

**To read live data in production:**
1. Open browser DevTools → Console
2. Run: `window.__LOT_PERF__.getEntries()`
3. Returns array of `{ name, duration, target, timestamp }` for all slow
   interactions since page load. Sort by `duration` descending to see worst
   offenders.

**Long-animation-frame (LoAF) warnings** are also logged to the console
automatically when any animation frame exceeds 50ms.

---

## 5. INVESTIGATION METHODOLOGY

| Source | What was checked |
|--------|-----------------|
| `git log --oneline -30` | Recent commits for button/rendering changes |
| `src/client/components/ui/Button.tsx` | Component structure, store subscriptions |
| `src/client/components/ui/Block.tsx` | Memoization, store subscriptions |
| `src/client/components/ui/Layout.tsx` | NavButton memo, onClick patterns |
| `src/client/components/ui/ToggleSection.tsx` | Animation anti-patterns |
| `src/client/entries/app.tsx` | TabPanel/TabPanels/DynamicRoutes, App subscriptions |
| `src/client/index.css` | Transition definitions, will-change usage |
| `src/client/utils/perf.ts` | Built-in performance observer |
| GitHub commits 1271cd3, b68e8425 | Previous lag fixes (June 27) |
| `docs/benchmark/` | Prior session reports |

---

## 6. NEXT STEPS

| Priority | Action | Owner | File |
|----------|--------|-------|------|
| HIGH | Add `React.memo` to `Block.tsx` | Engineering | `src/client/components/ui/Block.tsx` |
| MEDIUM | Replace `transition-all / max-h-[2000px]` in ToggleSection with CSS grid rows trick | Engineering | `src/client/components/ui/ToggleSection.tsx` |
| LOW | Reduce `--evolution-transition-speed` for low-tier users | Engineering | `src/client/stores/evolution.ts` |
| LOW | Remove redundant `isMirrorOn` subscription from `SecondaryRoundedBtn` | Engineering | `src/client/components/ui/Button.tsx` |
| ONGOING | Capture `window.__LOT_PERF__.getEntries()` during a lagging session and paste here | S-2 | — |

---

## 7. RELATED COMMITS

| SHA | Date | Description |
|-----|------|-------------|
| `1271cd3` | 2026-06-27 | Fix tab label movement and tab switching lag |
| `b68e8425` | 2026-06-27 | Memo TabPanels + DynamicRoutes — prevent tab cascade |

---

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END BUTTON-LAG-INVESTIGATION
================================================================================
