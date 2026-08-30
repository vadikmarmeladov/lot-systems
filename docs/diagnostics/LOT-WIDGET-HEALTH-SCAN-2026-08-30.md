<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Widget Health Scan — 2026-08-30

Full-fleet audit of all 38 widget components under `src/client/components/*Widget.tsx`:
wiring, data storage, System-tab/Portrait/AI integration, Quantum Intent Engine/Memory/Story
integration, container-vs-display classification, log coverage, loading speed, and lag.
Read-only investigation (no functional code changed) — see `docs/benchmark/LOT-SR-20260830-01.md`
for the build/green-gate record this scan was filed under.

**Method:** four parallel read-only code audits (client↔AI/System/Portrait wiring,
client↔QIE/Memory/Story wiring, per-widget log coverage, load/lag) plus a live
`npm run build` on the current branch. All claims below cite file:line; nothing is
inferred without a grep/read confirming it.

---

## 1. Widget wiring & data storage — fleet summary

38 widget files exist. None owns a dedicated Sequelize model or its own DB table —
all server writes funnel through shared paths:

- **Direct, immediate writes** (~7 widgets): `CalendarWidget`, `PlannerWidget`,
  `RecipeWidget`, `MemoryWidget`, `CosmicUpdateWidget`, `ContextualPromptsWidget`
  (dismiss path only), `SystemProgressWidget` (partial) — these call
  `useCreateLog`/`useCreateMemory`/`useCosmicUpdate` (`src/client/queries.ts`) or
  `axios.post('/api/logs')` directly and await the result.
- **Batched, best-effort writes** (~13 widgets): route through `recordSignal()`
  in `src/client/stores/intentionEngine.ts` (fires to `POST /api/quantum-intent/sync`
  every 10 signals or every 5 minutes, whichever first — `SYNC_INTERVAL=10`,
  `SYNC_COOLDOWN=300000ms`, lines 79-80, 244-250). Fire-and-forget: no retry, and a
  closed tab before the next flush silently drops the signal.
- **No server trace at all** (~18 widgets, ~47% of the fleet): `AIFeedbackWidget`,
  `AngelInvestorWidget`, `ArchitectWidget`, `BenchmarkWidget`, `ChakraErgonomicsWidget`
  (own store, `localStorage` only), `CorporatePlanWidget`, `CorrelatedIndexesWidget`,
  `DemoDayWidget`, `EvolutionWidget`, `IntegrityWidget`, `InterfaceEvolutionWidget`,
  `MonthlyPulseWidget`, `QuantumSignWidget`, `QuantumStateWidget`, `SignalStreamWidget`,
  `SubscribeWidget`, `SystemPulseWidget`, `TimeWidget`. Most of these are legitimately
  read-only displays; a few (`MonthlyPulseWidget`, `QuantumSignWidget`, `TimeWidget`)
  are interactive but persist only to `localStorage`, invisible to server-side analysis.

**Testing:** no widget-level unit or component tests exist in the repo (no
`*.test.tsx`/`*.spec.tsx` found under `src/client/components`). The only automated
test scripts in `package.json` are `test:cold-start` / `test:cold-start:prod`, which
exercise server boot, not widget behavior. Widget correctness is currently verified
only by manual use and the `npm run build` type/bundle gate — confirmed GREEN this
session, but that gate does not execute component logic.

---

## 2. Wiring with LOT AI, the System tab, and Portrait (public profile)

- **LOT AI**: the real LLM abstraction is `AIEngineManager` in
  `src/server/utils/ai-engines.ts` (lines 44-635; engines: Ollama, Together, Gemini,
  Mistral, Claude, OpenAI). It powers Memory question generation
  (`src/server/utils/memory/question-generator.ts:81`), recipe suggestions
  (`recipe-suggestions.ts:193`), and story generation (`story-generator.ts:160,265`) —
  all live, called from registered routes in `src/server/routes/api.ts`
  (e.g. lines 5075, 5294, 5438, 5582).
  **Finding:** `AIFeedbackWidget.tsx` (lines 1-311) — the widget whose name most
  directly suggests it surfaces LOT AI — does **not** call this engine. It is a
  deterministic if/else summarizer (`getStateInsight`, `getGuidance`, lines 54-184)
  reading `intentionEngine`, `useOSDiagnostics`, `useProfile`, `useLogs`. Not broken,
  but the name overstates what it does — it is a rules-based "quantum state" reader,
  not an AI-feedback surface. The genuine LLM output (memory questions, recipes,
  weekly story) surfaces through separate widgets/paths, disconnected from this one.

- **System tab** (`src/client/components/System.tsx`): the aggregation point for the
  whole fleet — imports and renders all 38 widgets (import list lines 30-81, render
  tree 104-1071). A stripped `!isPaidAccount` view shows only `TimeWidget`,
  `MemoryWidget`, `MicroGameWidget`, `SubscribeWidget` (lines 414-538); the full
  Usership/R&D layout renders the remaining ~30 inside `WidgetErrorBoundary` groups.
  Derived stats (`journeyData`, `userIndex`, `physiologicalCohort`, `evolutionStreak`,
  lines 241-323) are computed from live `logs`/`profile`, not hardcoded. No orphaned
  imports found — every imported widget is mounted somewhere in the tree.

- **Portrait (public profile)**: `src/client/entries/public-profile.tsx` renders
  `PublicProfile.tsx`, which fetches `/api/public/profile/:userIdOrUsername` (line 44)
  — confirmed registered at `src/server/routes/public-api.ts:741`, mounted at
  `/api/public` (`src/server/index.ts:223`, `src/server/routes/index.ts:20`).
  `psychologicalProfile`/`correlatedIndexes` are computed live from
  `extractUserTraits(logs)`, `determineUserCohort()`, `calculateCorrelatedIndexes()`
  (lines 1154-1222) — the same trait/cohort pipeline that feeds
  `PatternInsightsWidget`/`EvolutionWidget`/`CorrelatedIndexesWidget` on the System
  tab, so the Portrait and the System tab are genuinely reading the same substrate,
  not two disconnected views. One demo-only branch exists for a fixed username
  (`machiavelli`, lines 747-886+) returning fabricated showcase data — clearly
  code-commented as intentional, not a bug. `src/client/entries/us.tsx` is the admin
  user-list page, not the personal profile — worth not conflating the two by name.

---

## 3. Wiring with the Quantum Intent Engine, Memory, and Story

- **Quantum Intent Engine (QIE)**: the pattern-recognition logic actually lives
  client-side in `src/client/stores/intentionEngine.ts` (150+ hardcoded pattern
  rules) — this file, not a server engine, is the real "QIE." Widgets
  (`QuantumStateWidget`, `QuantumSignWidget`, `PatternRecognitionWidget`) read this
  local store plus `useLogs()`. The server round-trip exists and is live —
  `POST /api/quantum-intent/sync` (`intentionEngine.ts:3735` → handler at
  `src/server/routes/api.ts:3661`, which bulk-inserts to the `Log` model with
  `event: 'quantum_intent_signal'`) — but it is for persistence/analytics, not for
  sourcing the "quantum" values themselves. `PatternInsightsWidget` additionally
  calls `/api/patterns`, `/api/cohorts`, `/api/pattern-evolution` (`api.ts:3200,
  3241, 3437`) — all live, registered, non-404 endpoints.

- **Memory**: `MemoryWidget.tsx` → `useMemory`/`useCreateMemory`
  (`src/client/queries.ts:149`) → `GET/POST /api/memory` (`src/server/routes/api.ts:1957`,
  live handler with real date-window and user lookups, not stubbed). Story-gated
  variant at `GET /api/memory/story` (`api.ts:2610`) — genuinely gated on Usership
  and an answer-count cache, not a placeholder.

- **Story (Job 24, "weekly LOT AI story")**: implemented in
  `src/server/scheduled-jobs.ts:834-1000` — explicitly commented in-code as
  **template-based, no AI call**, despite the "AI Story" name (deterministic
  mood-tally → string templating). Confirmed scheduled live: the hourly interval at
  `scheduled-jobs.ts:5616-5628` calls into `checkAndRunScheduledJobs()`, which
  self-gates the job to Sunday 18:00 UTC. Output is a `Log` row
  (`event: 'lot_ai_story'`) plus `user.metadata.weeklyStory` (lines 952-987).
  **Finding:** none of the three widgets whose names suggest "story" display
  (`NarrativeWidget`, `MonthlyPulseWidget`, `CosmicUpdateWidget`) reference
  `weeklyStory` or `lot_ai_story` anywhere (zero grep hits outside changelog text).
  The only place the weekly story actually surfaces to the user is the generic
  `Logs.tsx` terminal feed's `STORY:` block (`Logs.tsx:2648-2657`). The job is
  correctly wired end-to-end; its display path just isn't where the widget names
  imply it would be.

---

## 4. Container vs. display, interactivity, and synchronized-context logging

No widget in the fleet renders "weather" or "users online / presence" — grep
confirms `usersOnline`, `usersTotal`, `liveMessage` (`src/client/stores/state.ts:18-20`)
and the weather store (`state.ts:28`, `#server/utils/weather.ts`) are not consumed by
any of the 38 `*Widget.tsx` files. Those sync primitives exist (fed by `/api/sync`,
per `Sync.tsx`) but currently have no widget-level display or log hook — so the
scan's premise ("if a widget shows live synchronized context, is it logged?") has a
short honest answer for this fleet: **the synchronized-context widgets don't exist
yet in this component set**; weather/presence are ambient app-level state, not
widget-surfaced state today.

Of the widgets that are interactive:

| Widget | Type | Interactive | Server log |
|---|---|---|---|
| TimeWidget | display + local toggle/stopwatch/chime | Y | **N** — no server call at all |
| SystemPulseWidget | pure display (GET `/api/system/pulse`) | N | N/A (read-only) |
| UserMetricsWidget | display + heartbeat | Y (indirect) | batched (`recordSignal`, health_check) |
| SignalStreamWidget | pure display of in-memory signal buffer | N | N/A |
| CohortConnectWidget | interactive (view/message/expand) | Y | batched (`recordSignal`) |
| ChatCatalystWidget | interactive (connect) | Y | batched (`recordSignal`) |
| ContextualPromptsWidget | interactive (accept/skip) | Y | **split**: skip → immediate `POST /api/logs` (line 232); accept → batched only |
| MonthlyPulseWidget, QuantumSignWidget | interactive | Y | **N** — `localStorage` only |

The `ContextualPromptsWidget` split is the clearest concrete gap: dismissing a
suggestion is reliably recorded; accepting one is not (until the next
batch flush, and never if the tab closes first) — the more positive/valuable signal
is the less reliably captured one.

---

## 5. Interface standard — the "monk lifestyle" framing

The scan brief frames LOT AI as a support for a disciplined, transparent daily
practice, and logging in "military communications" terms. This is not a new
requirement to invent language for — the repo already carries two lexicon tokens
that are the real, in-force version of exactly this idea (`docs/benchmark/LOT-LEXICON.md`):
**MILITARY PURITY** ("interface standard: no decoration, no emojis, no
superlatives") and **COCKPIT-RULE** ("log body = instrument readings only; label
names the event; no narration"). Both are enforced today in `Logs.tsx`'s block
renderer and the terminal-style widget UI. No further doctrine is warranted here —
the "monk"/self-discipline framing matches what MILITARY PURITY and COCKPIT-RULE
already encode; restating it as new philosophy would be padding, not information.

---

## 6. Month-to-month UI reveal — actual state vs. the "15-month" framing

No 15-month roadmap document exists in this repo (`docs/` searched for
"roadmap"/"reveal"/"15-month"/"month-to-month" — no hits describing a build-up
schedule). The real, implemented month-to-month reveal is `MonthlyPulseWidget.tsx`:
a 12-rung ladder (`MONTH_MESSAGES`, lines 18-31) keyed off `dayjs(user.joinedAt)`,
one message per membership month 1–12, capped and generic beyond that
("Month N. The journey continues."). This is a genuine, working progressive-disclosure
mechanic — just a 12-month one, not 15. If a 15-month cadence is the intended target,
it isn't built yet; recommend either re-scoping `MONTH_MESSAGES` to 15 entries or
confirming 12 is the intended ceiling before treating this as a gap.
**Type-check note:** `tsc --noEmit` flags `user.joinedAt` as not existing on the
`UserProfile` type (`MonthlyPulseWidget.tsx:74-79`) — the field is used at runtime
but undeclared in `#shared/types`. Likely works today (JS doesn't enforce the
missing declaration) but is a live type-drift risk if `UserProfile` is ever
tightened or auto-generated from the type.

---

## 7. Widget loading speed

`npm run build` is GREEN on this branch (client + server, see session report).
Bundle-splitting (`splitting: true`, `scripts/build/client.build.ts:16-21`) only
produces shared chunks *between* the app's entry points (app.tsx, login.tsx, etc.) —
there is no `React.lazy`/dynamic `import()` for any widget, confirmed by a full
repo grep. `System.tsx` statically imports all 38 widgets, so they are all part of
one JS bundle and constructed eagerly on first render of the System tab.

A proven mitigation already exists but is applied to exactly one widget group:
`LazyMount` (`System.tsx:85-92`, backed by `useInViewport`,
`src/client/hooks/useInViewport.ts`) defers mounting until the element scrolls into
view via `IntersectionObserver`; it currently wraps only `QuantumEngineWidgets`
(`System.tsx:1005-1007`), matching the "Viewport Isolate" entry in
`docs/benchmark/LOT-MANIFEST.md`. The other ~35 widgets mount immediately.
`TabPanel` in `app.tsx` does fully unmount `System` when the tab is inactive, which
is correct and prevents background churn — but does nothing for first-load cost
while the System tab is open.

**Recommendation (not applied this session — no browser available to visually
verify the change):** extend `LazyMount` to the below-the-fold widget groups in
`System.tsx` (Investor widgets, Stats dashboard, Community section are good
candidates — they render lower in the layout and are less likely to be
above-the-fold on first paint).

---

## 8. Lag test — buttons, sounds, controls, loading

- **Buttons/hover:** the historical fix recorded in the manifest ("GPU-composited
  `::before` opacity hover replacing background-image") is confirmed live —
  `src/client/index.css:123-125` toggles `opacity` on a pseudo-element; no
  `background-image` swap exists inside any `:hover` rule in the stylesheet.
- **Scroll/mouse handlers:** zero `onScroll`/`onMouseMove` handlers exist anywhere
  in `src/client` — nothing unthrottled to flag.
- **TimeWidget ticking:** correctly isolated — the second-hand tick lives inside
  `<Clock interval={100} />` (`src/client/components/ui/Clock.tsx:17-38`), which owns
  its own `setInterval`/local state; `TimeWidget`/`System` do not re-render on tick.
- **Sound:** ambient soundscape and the hourly chime (`src/client/utils/sound.ts`,
  `sovietChime.ts`) are synthesized via Web Audio oscillators, not file playback —
  nothing to preload or block on. The one real audio-file player, `useRadio`
  (`src/client/utils/radio.ts:24-203`), fetches track metadata async and waits for
  the `canplay` event before calling `.play()` (lines 145-176) — correct
  non-blocking pattern.
- **Conclusion:** no new lag source found in buttons, controls, or sound this
  session — prior fixes (button hover, biofield lag, `20260719-01`'s log
  `LIMIT 500`/`staleTime`/polling-interval pass) hold. The one open lag-adjacent
  item is the loading-speed finding in §7 (eager widget mount, not per-widget jank).

---

## 9. Data-log coverage across the platform

Restating §1/§4's numbers as the platform-wide answer to "is widget usage logged":
of 38 widgets, **~7 (18%) write immediately and reliably**, **~13 (34%) write
eventually and best-effort** via the throttled `recordSignal()` batch (drops
silently on tab-close before flush, no retry), and **~18 (47%) leave no server
trace at all** (pure display or `localStorage`-only interactivity). This is not
necessarily wrong — several of the "no trace" widgets are legitimately
presentation-only (`SystemPulseWidget`, `SignalStreamWidget`) — but three
interactive ones (`TimeWidget`, `MonthlyPulseWidget`, `QuantumSignWidget`) persist
user interaction only to `localStorage`, which means that data is invisible to any
server-side pattern/cohort analysis QIE performs on the rest of the fleet.

Separately noted, not scored: `prisma/schema.prisma` (15 lines, last touched
2026-06-29) appears vestigial — the live DB layer is Sequelize
(`src/server/models/`, `log.ts` → the `logs` table that everything above actually
writes to).

---

## Incidental finding (not requested, found during the build check)

`npm run build` is GREEN, but emits two pre-existing esbuild warnings for
duplicate object keys in `src/client/utils/badges.ts`: `quarter_drop` (lines 3214
and 5501) and `elixir_found` (lines 4825 and 6883). The second definition silently
wins at runtime; the first is dead. Not touched this session (badge data, outside
this scan's scope, and a fix would need to confirm which definition is the intended
one before deleting the other) — flagging for a future ENGINEERING pass.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
