<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Widget Health Scan — 2026-08-10

Scheduled scan of widget wiring, data storage, UI, and load/lag health across
`System.tsx` and its widget tree. Companion to `LOT-SR-20260810-01`. Findings
below are grounded in the live repo tree as of commit `98971f2`
(branch `claude/charming-albattani-1hz711`); every claim is file:line-backed.

Naming note up front: this scan was requested against "LOT AI", "Portrait",
and "Story" as named surfaces. None of the three exist as named entities in
the codebase today. Where a real, functionally-equivalent surface exists,
it's identified below; where it doesn't, that's reported as a gap rather than
papered over.

---

## 1. Widget inventory

**38** `*Widget.tsx` components under `src/client/components/`, catalogued in
the existing hand-maintained reference `docs/technical/WIDGETS.md`. No
dedicated widget registry file exists — wiring is direct import into
`src/client/components/System.tsx` (1071 lines), grouped into 14 stacks
(`WIDGETS.md:434-451`): Header, Community Pulse, Tags & Team, Time &
Environment, Context Stack, Bioethics Stack, Settings, Lifestyle Stack,
Intentions & Planning, Subscriber Stack, Quantum Engine Connect, QIE Stack,
Dashboard Stack, Stats Stack.

Category breakdown: Core (TimeWidget, MemoryWidget, PlannerWidget,
RecipeWidget), Biofield/Evolution (EnergyCapacitor, EmotionalCheckIn,
EvolutionWidget, InterfaceEvolutionWidget, NarrativeWidget, GoalJourneyWidget),
Community (ContextualPromptsWidget, InterventionsWidget, ChatCatalystWidget,
PatternInsightsWidget, CohortConnectWidget, IntentionsWidget, SelfCareMoments,
AwarenessDashboard), QIE (QuantumStateWidget, PatternRecognitionWidget,
AIFeedbackWidget, SignalStreamWidget, QuantumRandomWidget), System/Metrics
(UserMetricsWidget, SystemProgressWidget — 1500+ lines, SystemPulseWidget),
Utility (MicroCalculatorWidget, MicroGameWidget, MicroImageWidget), Stats
(`src/client/components/stats/`: CollectiveConsciousness, WellnessPulse,
MemoryEngineStats, IntentionPatterns, BadgeUnlockFeed, GrowthMilestones),
Subscriber-gated (SubscribeWidget, QuantumSignWidget, CosmicUpdateWidget),
Investor/Demo (AngelInvestorWidget, CorporatePlanWidget, DemoDayWidget,
FlashDriveManifest), and `QuantumEngineWidgets.tsx` (Car/Home/Computer connect
toggles).

## 2. Wiring, data storage — container vs. interactive

Mixed, as expected for a dashboard this size:

- **Pure display** — `SystemPulseWidget` (1s poll on `/api/system/pulse`),
  every widget in `stats/` (single GET each).
- **Interactive, logged** — `MemoryWidget` (answers → `/api/logs`),
  `PlannerWidget` (keyboard-nav grid → `plannerWidget` nanostore →
  `/api/logs`), `IntentionsWidget`, `QuantumEngineWidgets` (on/off toggles).
- **Interactive, navigational only** — `ChatCatalystWidget` (click routes to
  chat, no log write observed).

Data sources: REST under `src/server/routes/api.ts` (`/logs`, `/weather`,
`/api/memory`, `/api/energy`, `/api/narrative`, `/api/patterns`,
`/api/cohorts`, `/api/system/*`), nanostores in `src/client/stores/`
(`intentionEngine.ts`, `selfAssembly.ts`, `evolution.ts`, `state.ts`), and
`localStorage` for cooldowns/preferences. **No websocket** in the client for
widget data; the server pushes `users_online` via an SSE-style `write()` call
(`src/server/routes/api.ts:345-349`).

**Storage reality:** there is no per-widget table. Every widget interaction
that gets persisted funnels into one generic `logs` table
(migration `migrations/20240525154723_add-logs.cjs`: `id, userId, text,
metadata JSONB, event, createdAt`), discriminated by an `event` string (e.g.
`plan_set`, `energy_*`, `magic_time`, `car_connected`). `getLogContext()`
(`src/server/utils/logs.ts`, imported at `System.tsx:36`) aggregates it back
out for display. Supporting migrations: `20240613124003_add-log-context.cjs`,
`20260630150000_add-logs-userid-createdat-index.cjs`. This is a legitimate,
working design — but it means the request for "a data log of all widget
usage across the platform" is **already partially true and partially not**:
the interactive widgets that call `/api/logs` are logged; the pure-display
widgets (stats, pulse, metrics) are read-only GETs with no corresponding
usage record. If usage analytics on the *display* widgets is wanted, that's
new instrumentation, not something already wired.

## 3. Wiring to LOT AI / System tab / Portrait

- **"LOT AI"** — no literal `LOT AI` / `LotAI` string exists anywhere in
  `src/`. The AI-backed widgets (`AIFeedbackWidget`, `CosmicUpdateWidget`)
  are documented in `WIDGETS.md` as powered by **Together.AI** (image
  generation + feedback text), not a named in-house "LOT AI" product. If
  "LOT AI" is meant as the umbrella brand for these AI-touched widgets, that
  branding doesn't exist in code yet — it's a naming gap, not a wiring gap.
- **System tab** — `System.tsx` is confirmed the master dashboard, routed at
  `src/client/entries/app.tsx:187-189` (`currentRoute === 'system'`). It
  **fully unmounts when inactive** (`app.tsx:156-164`), a deliberate fix
  documented in-code for a real historical bug: background widget re-renders
  from the QIE subscriber were saturating the main thread. This unmount
  behavior is the single most consequential performance decision in the
  widget system and is currently intact and doing its job.
- **"Portrait" / personal profile page** — no file or string `Portrait`
  exists anywhere in the repo. The functional equivalent is
  `src/client/components/PublicProfile.tsx` / `ProfileQRCode.tsx`, backed by
  `useProfile()` (`src/client/queries.ts`) hitting `/api/profile` and
  `/api/user-profile`. Wiring to that surface is intact; the name "Portrait"
  is not in use anywhere in the product.

## 4. Wiring to Quantum Intent Engine, Memory, Story

- **QIE** — real, and the most heavily-versioned subsystem in the repo
  (`src/client/stores/intentionEngine.ts`, exporting `getOptimalWidget`,
  `shouldShowWidget`, `getUserState`, `recognizedPatterns`, `signals`).
  Per `WIDGETS.md:457`: 14 patterns, 11 signal sources, 4D user state, widget
  dependency map with depth ordering. Commit history shows this engine
  actively versioned through the QIE session line (v100 → v113 across the
  log, most recently `d7f076e`: "QIE v113 / P149–P151 · Arch51 · J48").
  Related: `src/client/stores/selfAssembly.ts` feeding `SystemProgressWidget`.
- **Memory** — real, is `MemoryWidget.tsx` (self-reflection Q&A) backed by
  `/api/memory`. Not a separate tab; it's a widget within System.
- **"Story"** — no dedicated Story tab or file. The closest equivalent is
  `NarrativeWidget.tsx` (RPG-style story progression, backed by
  `/api/narrative`). The app's actual top-level routes are
  `system | logs | sync | settings | api` (`app.tsx:143`) — there is no
  `memory` or `story` route; both live as widgets inside `system`.

## 5. Context sync → Log

Confirmed real for the two examples named in the brief:

- **Weather** — `weather` atom in `src/client/stores/state.ts:19`, populated
  from `GET /weather` (`src/server/utils/weather.ts`, `api.ts:1038`).
- **Users online** — `usersOnline` atom in `state.ts:28`, pushed server-side
  via the SSE-style `write({event:'users_online', ...})` call at
  `api.ts:345-349`.
- **Time / circadian** — partial gap. `getCircadianPhase()` exists as a pure
  client-side function in `intentionEngine.ts` — it computes a phase but
  there is **no corresponding server-side log write**. So weather and
  presence reach the Log; circadian phase, today, does not. If the intent is
  "every synchronized context value gets a Log entry," circadian phase is
  the one gap found.

## 6. Loading speed & lag

- **Instrumentation already exists.** `WidgetErrorBoundary`
  (`src/client/components/ui/WidgetErrorBoundary.tsx:11-49`) times every
  widget's mount via `performance.now()`, stores results on
  `window.__LOT_WIDGET_PERF__`, and `console.warn`s past a 50ms threshold
  (line 47-48). Most widgets in System are wrapped in it.
- **No code-splitting.** All 38 widgets are eagerly imported into
  `System.tsx` and ship in one client bundle — no `React.lazy` /
  `import()` boundaries found anywhere in `src/client`. This is the single
  biggest available lever for "optimize widget loading speed": splitting
  the Subscriber/Investor/Demo-gated widgets (a meaningful fraction of the
  38, and mutually exclusive with most users) out of the main bundle would
  cut initial System-tab payload without touching wiring. **Not applied in
  this session** — bundle-splitting 38 interdependent widgets safely is a
  real engineering change with real regression risk, and this was a
  read-only scan, not a refactor session. Flagged as the top follow-up.
- **Viewport gating exists** — `useInViewport` / `useActiveViewport`
  (`src/client/hooks/useInViewport.ts`) support activating work only when a
  widget is actually visible; not confirmed wired into every eligible widget.
- **Lag test (buttons/sounds/controls/loading):** could not be executed
  live this session. This sandbox has no Postgres instance and no
  `.env` configured (`pg_isready` → no response; only `.env.example` files
  present) — there is no live server to click through. This is an
  environment limitation, not a code finding; it should not be read as
  "widgets are laggy." The passive proxy signal — the `WidgetErrorBoundary`
  mount-timer — is in place and already flags anything over 50ms at
  runtime; recommend a follow-up session with a live server/DB for an
  actual interaction-latency pass.

## 7. "15-month" UI reveal / build-up schedule

Not found in code. The "Day 1072+", "Day 1073+" markers seen in commit
messages and `About.tsx:364` ("Day counter: Day 1072+ (as of August 4,
2026)") are a **narrative day-counter used as documentation/changelog
metadata**, not a feature gate — no `launchDate` / day-threshold gating logic
exists anywhere in `src/client`. The visibility gating that *does* exist
(`WIDGETS.md:474-482`) is: time-of-day, cooldown, activity-count,
subscription-tier, mode-flag (`lot-investor-mode`), and QIE pattern-based.
None of these are calendar/month-indexed. If a 15-month phased reveal is a
real product intention, it isn't implemented today — reporting this plainly
rather than asserting a schedule that doesn't exist in the tree.

## 8. Tests

Zero. No `*.test.ts*` files and no `__tests__/` directories exist anywhere in
the repo outside `node_modules`. This applies to the whole codebase, not just
widgets — flagged as a standing gap, not new this session.

## 9. Build health (this session's CHECK A / CHECK B)

- `npm run server:build` (`tsc --project tsconfig.server.json` +
  `scripts/fix-esm-imports.js`): **PASS**.
- `npm run client:build` (`postcss` + `esbuild` via `scripts/build/client.build.ts`):
  **PASS**, with two non-fatal esbuild warnings worth a follow-up fix:
  - `src/client/utils/badges.ts:3214` and `:5501` both define a
    `quarter_drop` badge key with different content (arcade first-unlock
    vs. midnight check-in). The second silently overwrites the first in the
    built object — the arcade badge as originally written is unreachable.
  - Same pattern at `src/client/utils/badges.ts:4825` and `:6883` for
    `elixir_found` (two different unlock conditions, same key).
  - Neither breaks the build; both are real data-integrity bugs in the
    badge/stats data feeding `BadgeUnlockFeed`. Not fixed in this session
    (out of scope for a read-only scan; recommend a small dedicated
    ENGINEERING pass to rename one of each pair).
- `npm run test:cold-start`: **SKIPPED** — requires a live server + DB
  (`APP_HOST`, default `localhost:4400`); unavailable in this sandbox.
- Dependency install note: this repo's real install path is `yarn install
  --frozen-lockfile` (`Dockerfile:11`, `app.yaml:10`), but `registry.yarnpkg.com`
  is not reachable from this sandbox's network egress policy (confirmed
  403 via the agent proxy status endpoint — a policy denial, not a code
  issue). Used `npm install --legacy-peer-deps` locally, against the
  allowlisted `registry.npmjs.org`, purely to run the checks above; no
  lockfile or `package.json` was modified.
- Pre-existing, non-blocking finding surfaced by that install: root
  `package.json` pins `nanostores@^0.9.0` (required by
  `@nanostores/persistent@^0.9.1`), while `@nanostores/react@^0.4.1`
  declares a peer of `nanostores@^0.7.0`. Yarn's default loose peer
  resolution tolerates this; strict npm does not. Not a runtime bug today —
  worth tightening in a future dependency-hygiene pass.

## 10. On the "monk lifestyle" framing

The brief frames LOT AI as a way to "maintain a pure and transparent
lifestyle" via military-style context logging. Recording this honestly per
the self-assembly protocol's own rule against fabricated philosophy: this is
a narrative lens, not a code mechanism, and nothing in the codebase currently
names or implements it as such. What *is* real and does support that framing
functionally: the unified `logs` table plus `getLogContext()` genuinely does
create one continuous, queryable behavioral record across every widget that
writes to it (section 2), and QIE's 14-pattern signal layer genuinely does
turn that record into live widget-visibility decisions (section 4). That's a
real, working "everything you do becomes signal" substrate — it just isn't
badged, documented, or branded as "LOT AI" or a monk-lifestyle doctrine
anywhere in the repo today. Marked `PROVISIONAL` per doctrine convention.

---

## Summary

| Area | Status |
|---|---|
| Widget wiring (System.tsx → 38 widgets) | Intact |
| QIE wiring | Intact, actively versioned |
| Memory wiring | Intact |
| "LOT AI" / "Portrait" / "Story" as named surfaces | Not present — functional equivalents identified |
| Weather / users-online → Log | Intact |
| Circadian phase → Log | Gap — computed client-side, never logged |
| Widget usage log | Partial — interactive widgets log; display widgets don't |
| Loading speed | No code-splitting on 38-widget bundle (top optimization target) |
| Lag test | Not executable this session — no live server/DB in sandbox |
| 15-month UI reveal schedule | Not implemented in code |
| Tests | None exist |
| Build | GREEN (2 non-fatal warnings: duplicate badge keys) |

Full session mechanics (checks, push, tag) recorded in `LOT-SR-20260810-01.md`.

---
*Vadik*
*lot-systems.com/u/vadik*
