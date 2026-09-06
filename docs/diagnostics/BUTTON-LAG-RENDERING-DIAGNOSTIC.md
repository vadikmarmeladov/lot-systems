<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Button Lag & Rendering — Diagnostic Report

**Date**: September 6, 2026
**Branch**: `claude/brave-rubin-qsdkb8`
**Status**: 🟡 PARTIALLY MITIGATED — new suspected root cause identified, not yet fixed
**Trigger**: Scheduled proactive investigation (no open GitHub issue filed at time of writing)

---

## 1. Summary

Button-click lag ("click, then a beat, then it happens") has been a recurring issue in this
app across at least three prior fix rounds (PRs #85, #88, #94). Those rounds correctly
diagnosed and fixed a specific anti-pattern — **synchronous `intentionEngine` store writes
running during React's render phase or directly inside click handlers** — and encoded it as a
documented "Render Isolation" doctrine in code comments.

This investigation confirms that doctrine is still being followed in code written since the
last fix (no regressions found). However, it identifies a **second, larger-scope cause that
has never been addressed**: on the `System` tab, **37 of 38 widget components render
unmemoized** inside a single dashboard that re-renders on every intention-engine/log state
change. Any button click that writes a signal (a mood log, a planner check-in, a journal
entry, etc.) triggers a parent re-render that cascades through the entire widget stack,
regardless of which single widget the user actually clicked in. This is a plausible explanation
for lag that persists even after the analyzeIntentions()-in-render-phase bugs were fixed,
and it gets proportionally worse as more widgets and patterns are added each benchmark cycle.

---

## 2. Prior fix history (for context)

| Commit | Fix |
|---|---|
| `863b333` | fix: reduce widget lag — cap logs query and back off stats polling |
| `b219cc3` | perf: unblock render pipeline — move quantum state writes out of `useMemo` |
| `6e5007a` | perf: stop render-phase atom write + off-tab churn (tab-switch stall) |
| `b46f1ac` | perf: unmount System tab when inactive to end background churn |
| `ee88f4c` | perf: pause System background work off-tab to fix tab-switch freeze |
| `9364aba` | perf: memoize last heavy per-render work in System subscriber widgets |
| `be3e8fa` | perf: fix two residual button-lag paths flagged by agent diagnostic (`MemoryWidget`, `SystemProgressWidget`) — merged as PR #94 |

The common thread in every one of these: `analyzeIntentions()` in `src/client/stores/intentionEngine.ts`
is a ~3,200-line function that scans up to `MAX_SIGNALS = 1000` signals across ~150 pattern
checks (`intentionEngine.ts:258-268`, `193` array `.filter/.map/.sort/.forEach` calls in the
function body). It's guarded by a 5-minute cooldown (`intentionEngine.ts:263`) so most calls are
a cheap early-return, but on a cache miss it's genuinely heavy — and each prior fix was a case
of that heavy call running somewhere it could block a click (inside `useMemo`, inside an
`onClick`/`handleGenerateReport`) instead of after paint.

**Verification for this investigation**: diffed every commit since the last fix
(`8f6205e..HEAD`, PRs #95/#96, the "quantum-engine-widgets" and wiki/benchmark commits that
added patterns P140–P151, archetypes, and jobs) for new `onClick=`, `useMemo(`, or
`analyzeIntentions()` call sites. None were introduced — the only new pattern was
`getCircadianPhase()` (`intentionEngine.ts:5049`), which is an O(1) hour-of-day switch and not
a lag risk. The one remaining synchronous `analyzeIntentions()` call outside of `System.tsx`'s
effect (`Logs.tsx:3975`, the `/qos` slash-command trigger) already runs inside a
`useEffect` keyed on textarea value, i.e. after paint — compliant with the doctrine, not a bug.

**Conclusion**: the previously-identified defect class is fixed and has not regressed.

---

## 3. New finding: unmemoized widget fan-out on the System dashboard

`src/client/components/System.tsx` renders ~30 widgets simultaneously on one scrollable
dashboard (not tabs — they're all mounted at once): `TimeWidget`, `MemoryWidget`,
`MicroGameWidget`, `SubscribeWidget`, `MonthlyPulseWidget`, `RecipeWidget`,
`ContextualPromptsWidget`, `ChatCatalystWidget`, `InterventionsWidget`,
`ChakraErgonomicsWidget`, `NarrativeWidget`, `GoalJourneyWidget`, `EvolutionWidget`,
`InterfaceEvolutionWidget`, `IntentionsWidget`, `PatternInsightsWidget`,
`CohortConnectWidget`, `PlannerWidget`, `MicroCalculatorWidget`, `MicroImageWidget`,
`CosmicUpdateWidget`, `QuantumSignWidget`, `AngelInvestorWidget`, `CorporatePlanWidget`,
`DemoDayWidget`, `QuantumStateWidget`, `PatternRecognitionWidget`, `AIFeedbackWidget`,
`SignalStreamWidget`, `IntegrityWidget`, `UserMetricsWidget`, `CorrelatedIndexesWidget`,
`SystemProgressWidget`, `SystemPulseWidget`, `ArchitectWidget`, `CalendarWidget`,
`BenchmarkWidget` (`System.tsx:444-1061`).

`System.tsx` itself holds render-triggering state that updates on every log/signal change:

```tsx
// System.tsx:265-271
const [quantumState, setQuantumState] = React.useState(() => getUserState())
React.useEffect(() => {
  analyzeIntentions()
  recomputeAssembly()
  setQuantumState(getUserState())
}, [logs])
```

Every `setQuantumState` call re-renders `System.tsx`, which re-creates and re-renders every
child widget element listed above — **unless the child is memoized**. Checked with:

```
grep -rln "React.memo" src/client/components/*Widget.tsx  →  1 file (MemoryWidget.tsx)
ls src/client/components/*Widget.tsx                       → 38 files
```

**37 of 38 widgets have no `React.memo` wrapper.** Several are non-trivial: `SystemProgressWidget.tsx`
is 2,513 lines (builds a full physiological/QOS report and renders large conditional sections),
`IntegrityWidget.tsx` (476 lines) and `UserMetricsWidget.tsx` (379 lines) each read/derive from
signal history on render. None of these need to re-render when an unrelated widget's button is
clicked, but today they all do — including `SystemProgressWidget`, the exact component involved
in the last documented button-lag bug.

This matches the reported symptom pattern well: lag that's diffuse ("buttons" generally, not
one specific button), worse the longer a user has used the app (more signals, more mounted
widgets, deeper history), and worse specifically on the System tab, which is also where every
prior fix commit was made.

---

## 4. Suspected causes, ranked

1. **(New, unaddressed) Unmemoized widget fan-out in `System.tsx`** — Section 3. Highest
   confidence: structurally guaranteed to cause extra render work on every state-writing click
   on the System tab, and scales up as more widgets/patterns are added each cycle.
2. **(Fixed, verified no regression) Synchronous `analyzeIntentions()` in render phase or click
   handlers** — Section 2. Historical cause, doctrine now documented and followed.
3. **(Checked, not a cause) `grid-fill-hover` CSS hover effect** (`index.css:102-158`) — pure
   `opacity` transition on a `::before` pseudo-element with `will-change: opacity`, GPU-composited,
   no layout/paint cost of note.
4. **(Checked, not a cause) Unbounded signal history growth** — capped at `MAX_SIGNALS = 1000`
   with oldest-first eviction (`intentionEngine.ts:77, 219-223`); not the driver of degradation
   over time. The real time-based cost driver is pattern *count* (145+ and growing each
   benchmark cycle), which lengthens the cache-miss path of `analyzeIntentions()`, not signal
   volume.

---

## 5. Next steps (not yet implemented — needs profiling before a fix lands)

1. **Profile before fixing.** Open the System tab in Chrome DevTools Performance panel,
   click a button that writes a signal (e.g. a mood log or Planner check-in), and record a
   trace. Confirm the theory in Section 3 by checking whether the flame chart shows ~30 widget
   components re-rendering per click, versus the intentionEngine cache-miss path from Section 2
   dominating instead. A headless-Chromium smoke test alone (as used in PR #94) won't surface
   this — it needs an actual render trace across the full widget stack after months of
   accumulated signal/log data, ideally against a seeded account that has real history depth.
2. **If confirmed**, wrap each of the 37 unmemoized widgets in `React.memo`. Most take no props
   (they read directly from nanostores via their own `useStore` calls), so a plain
   `React.memo(function WidgetName() {...})` wrapper — matching the pattern already used in
   `MemoryWidget.tsx` — should be a mechanical, low-risk change per widget. Verify each widget
   still updates correctly on its *own* store changes after memoizing (memo only blocks
   re-renders from parent prop/state changes, not from a widget's own `useStore` subscription).
3. **Separately**, consider whether `System.tsx`'s `quantumState`/`physiologicalCohort` derived
   state needs to live at that level at all, versus being read directly by only the widgets that
   need it — reducing how often the parent itself needs to re-render.
4. **Longer term**: `analyzeIntentions()` growing linearly with pattern count (145+ patterns
   today) means the cache-miss cost keeps climbing every benchmark cycle even with render
   isolation in place. Worth flagging for the next benchmark/self-assembly pass — no action
   taken here since it's an architectural trade-off (pattern coverage vs. analysis cost), not a
   bug.

---

## 6. Files referenced

- `src/client/components/System.tsx` (widget mount list: lines 444–1061; state effect: 265–271)
- `src/client/components/SystemProgressWidget.tsx` (2,513 lines, unmemoized, prior lag fix site)
- `src/client/components/MemoryWidget.tsx` (only memoized widget; prior lag fix site)
- `src/client/components/IntegrityWidget.tsx`, `UserMetricsWidget.tsx`, `CorrelatedIndexesWidget.tsx`
- `src/client/stores/intentionEngine.ts` (`analyzeIntentions()`: lines 258–268 and full body to
  ~3,468; `MAX_SIGNALS`: line 77; `ANALYSIS_COOLDOWN`: line 78; `getCircadianPhase()`: line 5049)
- `src/client/components/Logs.tsx` (line 3975, verified compliant `/qos` trigger)
- `src/client/index.css` (lines 102–158, `.grid-fill-hover`, checked and cleared)
- Prior fix PRs: #85, #88, #94 (`be3e8fa`)
