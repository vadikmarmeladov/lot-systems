# Button Lag & Rendering Investigation

**Date:** 2026-07-03
**Investigator:** Claude (scheduled routine — codebase audit)
**Status:** Root cause identified · fix not yet applied · scoped for follow-up
**Severity:** Medium-High — affects perceived responsiveness across ~20 widgets

---

## 1. Summary

The app has a **known, documented, previously-fixed** class of button lag bug —
synchronous `recordSignal()` calls blocking React's visual-feedback commit — but
the fix was only ever applied to **2 of ~21 affected components**
(`MemoryWidget.tsx` and `EmotionalCheckIn.tsx`). The other 19 components still
call `recordSignal()` synchronously inside their click handlers, meaning most
buttons in the QIE-instrumented widget surface are still subject to the same
lag the team already diagnosed and wrote a doctrine clause about.

There is no open GitHub issue or user report filed yet — this was surfaced by
auditing commit history against current source, not an incoming complaint.

---

## 2. Prior art (already fixed, already documented)

Two commits previously diagnosed and fixed this exact issue:

- **`78745c3`** — *"Bug fixes: /prayer persistence + /story command + /system
  help + Memory button lag"* (2026-06-21)
  Root cause per `docs/benchmark/LOT-SR-20260622-01.md`:
  > `recordSignal()` called synchronously between `setClickedButtonIndex`
  > (visual feedback) and `createMemory` (API call). `recordSignal` does:
  > localStorage.setItem with JSON.stringify of up to 1000 signals, plus
  > conditional `analyzeIntentions()` with 60+ pattern matchers. Both block
  > the React render commit.

  Fix: wrapped the `recordSignal` call in `setTimeout(() => ..., 0)` so React
  commits the click's visual feedback before the expensive work runs.
  See `src/client/components/MemoryWidget.tsx:127-138`.

- **`95de8e1`** — *"Check-in widgets: instant logged acknowledgment, small
  buttons"* — same pattern applied to `EmotionalCheckIn.tsx:190-193`.

- This is codified as a standing doctrine clause in
  `docs/benchmark/LOT-DOCTRINE.md` (rev M):
  > **Async Signal Recording** — Synchronous QIE signal work (localStorage
  > serialization, pattern analysis) must not block user-facing visual
  > feedback. Defer signal recording via `setTimeout(0)` so React commits the
  > render before expensive work runs.

Related tab-switching lag was also fixed separately in **`1271cd3`** /
**`b68e842`** (`React.memo` around `TabPanels`, `DynamicRoutes`, and heavy
tab components — `Logs`, `System`, `Sync`, `Settings` — to stop cascade
re-renders from unrelated store changes like `isSoundOn`/`isMirrorOn`/`me`).

---

## 3. What's actually causing lag right now

### 3.1 `recordSignal()` is expensive and still runs synchronously in ~19 files

`recordSignal()` (`src/client/stores/intentionEngine.ts:166-221`) does, on
every call, **synchronously in the click handler**:

1. Spreads and filters the full signal array (up to `MAX_SIGNALS = 1000`)
2. `intentionEngine.set(...)` — a Nanostores update that synchronously
   re-renders every subscriber (see §3.2)
3. `localStorage.setItem('intention-signals', JSON.stringify(recentSignals))`
   — synchronous serialization of up to 1000 objects
4. Conditionally (`recentSignals.length % 5 === 0`) calls
   `analyzeIntentions()` — a **~1,838-line function** doing pattern analysis
   over the signal history
5. Conditionally (`% SYNC_INTERVAL === 0`) calls `syncToServer()`

Grep across `src/client/components` shows 21 files calling `recordSignal(`
(32 call sites). Only `MemoryWidget.tsx` and `EmotionalCheckIn.tsx` defer it
via `setTimeout(0)`. The remaining 19 files call it **synchronously inside
the click handler**, before or interleaved with the state update that drives
the button's own visual feedback:

| File | Call sites | Deferred? |
|---|---|---|
| `AwarenessDashboard.tsx` | 1 | ❌ |
| `EnergyCapacitor.tsx` | 1 | ❌ |
| `QuantumEngineWidgets.tsx` | 7 | ❌ |
| `JournalReflection.tsx` | 1 | ❌ |
| `PatternInsightsWidget.tsx` | 3 | ❌ |
| `PlannerWidget.tsx` | 1 | ❌ |
| `ChakraErgonomicsWidget.tsx` | 1 | ❌ |
| `MicroCalculatorWidget.tsx` | 2 | ❌ |
| `GoalJourneyWidget.tsx` | 1 | ❌ |
| `ContextualPromptsWidget.tsx` | 2 | ❌ |
| `CohortConnectWidget.tsx` | 4 | ❌ |
| `SelfCareMoments.tsx` | 1 | ❌ |
| `NarrativeWidget.tsx` | 1 | ❌ |
| `RecipeWidget.tsx` | 1 | ❌ |
| `IntentionsWidget.tsx` | 1 | ❌ |
| `InterventionsWidget.tsx` | 1 | ❌ |
| `ChatCatalystWidget.tsx` | 1 | ❌ |
| `MicroGameWidget.tsx` | 1 | ❌ |
| `QuantumRandomWidget.tsx` | 1 | ❌ |
| `MicroImageWidget.tsx` | 2 | ❌ |
| `MemoryWidget.tsx` | 1 | ✅ (fixed 78745c3) |
| `EmotionalCheckIn.tsx` | 1 | ✅ (fixed 95de8e1) |

Example — `RecipeWidget.tsx:136-142`, `handleDismiss`:
```tsx
const handleDismiss = () => {
  try {
    recordSignal('selfcare', state.isFasting ? 'fasting_acknowledged' : 'recipe_acknowledged', {
      mealTime: state.mealTime, hour: new Date().getHours(), fastingMode: state.fastingMode,
    })
  } catch (e) {}
  // ...visual feedback (farewell phrase, fade animation) happens after this
```
Every 5th call across the whole app triggers `analyzeIntentions()`
synchronously on the click's event handler — a long task on the main thread
that delays paint of the button's own pressed/dismissed state.

**This is the most likely cause of "buttons lagging"** — it reproduces the
exact symptom already fixed once in `MemoryWidget`, just in every other
widget that logs a QIE signal on click.

### 3.2 Cascading re-renders on every signal

`intentionEngine` store has 7 direct subscribers, each re-rendering on
**every** `recordSignal()` call anywhere in the app (not just their own):

- `QuantumStateWidget.tsx`
- `PatternRecognitionWidget.tsx`
- `SystemPulseWidget.tsx`
- `QuantumEngineWidgets.tsx`
- `UserMetricsWidget.tsx`
- `AIFeedbackWidget.tsx`
- `SignalStreamWidget.tsx`

None of these subscribe to a derived/scoped slice — they all pull the raw
`intentionEngine` state (`useStore(intentionEngine)`), so a signal recorded
by e.g. `RecipeWidget` re-renders 7 unrelated widgets synchronously, on top
of the `recordSignal` cost itself. This compounds whatever lag point 3.1
already causes, and is the same class of issue the **Render Isolation**
doctrine clause (rev M) was written for — narrower subscriptions weren't
applied here.

### 3.3 CSS — not currently a suspect

`Button.tsx` and `grid-fill-hover` (the shared hover-fill effect used by
most buttons) look fine:
- `Button.tsx` already follows the **Subscription Minimization** doctrine
  clause (rev M) — `PrimaryBtn` subscribes only to `theme`,
  `SecondaryRoundedBtn` only to `isMirrorOn`, plain `secondary` buttons
  subscribe to nothing.
- `grid-fill-hover::before` uses `opacity` transitions with `will-change:
  opacity` (added in `1271cd3` specifically to fix a hover label-shift bug),
  which is compositor-only and cheap.
- No `@keyframes` or layout-affecting transitions found on button elements;
  the 16 `transition`/`@keyframes` occurrences in `index.css` are scoped
  to other UI (grid backgrounds, badges, etc.), not implicated here.

CSS/animation is not ruled out entirely but is a low-priority suspect given
the CSS-side fixes already applied and the much stronger JS-side evidence.

---

## 4. Suspected root cause (ranked)

1. **High confidence** — Synchronous `recordSignal()` in 19 widget click
   handlers, per §3.1. Directly matches the previously-diagnosed and
   previously-fixed Memory button lag, just unrolled to every other
   QIE-instrumented button. Doctrine clause exists; rollout was incomplete.
2. **Medium confidence, compounding** — Un-scoped `intentionEngine` store
   subscriptions (§3.2) mean every click's signal write re-renders 7
   additional widgets app-wide, regardless of whether the clicked button is
   even visible near them.
3. **Low confidence** — CSS/animation. No direct evidence found; prior CSS
   lag issues (tab label shift) were already fixed in `1271cd3`.

---

## 5. Next steps

1. **Apply the Async Signal Recording doctrine to the remaining 19 files.**
   Same mechanical fix as `78745c3`/`95de8e1`: move each `recordSignal(...)`
   call into `setTimeout(() => { ... }, 0)`, keeping any state updates that
   drive visible feedback (button pressed state, fade-outs, etc.) outside
   the deferred block so they commit first. `QuantumEngineWidgets.tsx` (7
   call sites) and `CohortConnectWidget.tsx` (4 call sites) are the highest
   -value targets.
2. **Scope `intentionEngine` subscriptions.** The 7 widgets in §3.2 likely
   only need a derived slice (e.g. latest pattern, latest N signals) rather
   than the full store. Selector-based subscription (or splitting
   `intentionEngine` into a `signals` store and a `patterns` store) would
   stop the cross-widget re-render cascade without changing behavior.
3. **Profile to confirm before/after.** No profiling data exists yet in this
   repo for this issue — recommend a quick React DevTools Profiler pass
   (record a click on e.g. `RecipeWidget`'s dismiss button) to get an actual
   main-thread-blocked duration before and after the fix, rather than relying
   on code inspection alone. Worth checking whether `analyzeIntentions()`
   (1,838 lines) itself should also be chunked/moved off the critical signal
   count if it's independently slow even when deferred.
4. **No GitHub issue currently tracks this** — recommend filing one if this
   is a live user complaint, referencing this doc and `LOT-SR-20260622-01.md`.

---

## 6. Files referenced

- `src/client/stores/intentionEngine.ts` (`recordSignal`, `analyzeIntentions`)
- `src/client/components/MemoryWidget.tsx` (reference fix)
- `src/client/components/EmotionalCheckIn.tsx` (reference fix)
- `src/client/components/RecipeWidget.tsx`, `IntentionsWidget.tsx`,
  `PlannerWidget.tsx`, `SelfCareMoments.tsx`, `QuantumEngineWidgets.tsx`,
  and 14 other widgets listed in §3.1 (unfixed)
- `src/client/components/ui/Button.tsx`, `src/client/index.css` (`.grid-fill-hover`)
- `docs/benchmark/LOT-DOCTRINE.md` (Async Signal Recording, Render Isolation,
  Subscription Minimization clauses)
- `docs/benchmark/LOT-SR-20260622-01.md` (original Memory button lag fix report)
- Commits: `78745c3`, `95de8e1`, `1271cd3`, `b68e842`/`fafd50e`
