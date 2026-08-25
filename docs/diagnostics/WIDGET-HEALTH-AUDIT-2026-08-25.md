<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Widget Health Audit — Wiring, Data, UI, Lag

**Date:** August 25, 2026
**Scope:** Full read-only audit of all 39 `*Widget*.tsx` components — wiring, data storage, testing, LOT AI/System/Portrait integration, Quantum Intent Engine/Memory/Story integration, sync & logging, loading speed, and interaction lag.
**Method:** No code changed. Six parallel research passes over the live repo (`claude/charming-albattani-64jktz`, HEAD `98971f2`). Findings below are cited to file paths and, where relevant, line numbers found at audit time.
**Result:** Platform is fundamentally sound — every widget is wired, mounted, and error-isolated with two exceptions. The material risks are: (1) a real correctness bug (store mutation during render), (2) zero automated test coverage anywhere in the repo, (3) five widgets not yet covered by the established lag-fix pattern, and (4) two on-screen labels ("LOT AI") that don't match what's actually happening underneath.

---

## 1. Widget wiring, data storage, testing

**Inventory:** 39 widget components + `WidgetErrorBoundary.tsx` (shared crash isolator) + 13 stores in `src/client/stores/`. All 39 are imported and mounted — **zero orphaned/dead widget files**. Every widget is rendered from one place: `src/client/components/System.tsx` (mounted once at `src/client/entries/app.tsx:188`), across 14 named stacks (Header, Community Pulse, Context, Bioethics, Lifestyle, Intentions & Planning, Subscriber, Quantum Engine Connect, QIE, Dashboard, Stats, etc.). The free/non-paid layout mounts only 4 (`TimeWidget`, `MemoryWidget`, `MicroGameWidget`, `SubscribeWidget`); the Usership/R&D "pro" layout mounts essentially the full catalog.

**Error isolation gap:** `WidgetErrorBoundary` wraps 30 of the 39 mount points. Two widgets render **unguarded**: `TimeWidget` and `QuantumRandomWidget` (`System.tsx` lines ~444, 616–617). A crash in either takes down the whole System.tsx render tree instead of failing in isolation. Additionally, several boundaries wrap a *stack* of widgets together (e.g. "Bioethics" wraps 6, "Planning" wraps 5) — a crash in one sibling still takes its stack-mates down with it.

**Data storage — architecture correction:** The task brief and some internal references assume Prisma-backed models. That is not the case. `prisma/schema.prisma` is a 15-line unmodified stub with **no model definitions**, and no file in `src/server` imports `@prisma/client`. The real ORM is **Sequelize** (`src/server/models/*.ts`, migrations in `migrations/*.cjs`, 21 files spanning 2024‑03‑30 → 2026‑07‑18). Ten real models exist: `Answer`, `ChatMessage`, `ChatMessageLike`, `DirectMessage`, `EmailCode`, `LiveMessage`, `Log`, `Session`, `User`, `WeatherResponse`. There is **no per-widget table** — the overwhelming majority of widget-visible data is event-sourced through one generic `Log` table (`userId`, `event`, `metadata` JSON, `context` JSON), computed fresh per-request by ~15 dedicated API routes (`/api/patterns`, `/api/narrative`, `/api/goal-progression`, `/api/interventions`, `/api/cohorts`, `/api/pattern-evolution`, `/api/energy`, `/api/contextual-prompts`, `/api/chat-catalysts`, `/api/recipe-suggestion`, `/api/memory*`, `/api/system/pulse`, `/api/quantum-intent/sync`, `/api/stats/*`).

Roughly a third of widgets (`PlannerWidget`, `AngelInvestorWidget`, `ArchitectWidget`, `BenchmarkWidget`, `ChakraErgonomicsWidget`, `CorporatePlanWidget`, `CosmicUpdateWidget`, `DemoDayWidget`, `EvolutionWidget`, `InterfaceEvolutionWidget`, `MicroCalculatorWidget`, `MicroGameWidget`, `MicroImageWidget`, `QuantumRandomWidget`, `QuantumSignWidget`, `SubscribeWidget`, `TimeWidget`) have **no direct backend call at all** — they run entirely on client stores/`localStorage`, or (for the `intentionEngine`-backed ones) on locally-recorded signals that only reach the server via the single write-only `POST /api/quantum-intent/sync` batch flush.

**Testing — this is the sharpest finding of the audit: there is no automated test coverage anywhere in the repo, for widgets or anything else.**
- `package.json` has no `"test"` script and no test framework dependency (jest/vitest/mocha/@testing-library) — zero hits on a full dependency grep.
- Zero `*.test.ts(x)` / `*.spec.ts(x)` files and zero `__tests__` directories exist in the repo.
- `scripts/tests/` holds ad-hoc manual probe scripts (`test-cold-start.ts`, `test-db.ts`, `test-email.ts`, …), not an automated suite; none is CI-invoked (`.github/workflows/*.yml` contain no test step).
- The one script that runs against a live server, `test:cold-start` (`scripts/tests/test-cold-start.ts`, 461 lines), only asserts HTTP 200 + `<!DOCTYPE html>` on page shells and a handful of core routes (`/api/me`, `/api/weather`, `/api/live-message`, …). It never hydrates React and never touches any of the ~15 widget-data endpoints listed above — it cannot detect a broken widget, a broken widget API, or a client-side exception in any of the 39 components.

**Net:** wiring is essentially complete and healthy; storage is real but single-table and JSON-shaped rather than normalized per feature; testing coverage is a full gap, not a partial one.

---

## 2. LOT® AI, the System tab, and the Portrait (profile) page

**LOT® AI.** There is no persistent chat UI. The real LLM-backed surface is a slash-command interface inside the Log terminal (`src/client/components/Logs.tsx`: `/qi`, `/assembly`, `/prayer`, `/story`, `/phys`, `/qos`, …), backed by `POST /qi` and siblings in `src/server/routes/api.ts` (~4924–5550). `/qi` is genuinely widget-aware: its system prompt is assembled server-side from the same Log-derived data (mood/biofield timeline, goals, self-care, QIE patterns, journal, memory Q&A, calendar) plus a `quantumState`/`userIndex` block computed client-side by `getUserState()`/`getUserIndex()` — the identical store (`intentionEngine`) that drives `QuantumStateWidget`, `UserMetricsWidget`, and `PatternRecognitionWidget`. So the AI sees what the widgets show, via shared store/log data rather than DOM inspection.

**Mismatch found:** the one feature literally labeled **"LOT AI:"** on screen — the check-in prompt in `EmotionalCheckIn.tsx` — is **not AI-generated**. Its response comes from `generateCompassionateResponse()` (`src/server/routes/api.ts:55–134`), a static lookup table keyed by emotional state, with no LLM call and no widget context. The label promises more than the implementation delivers.

**System tab.** `System.tsx` is the dashboard, rendered by `app.tsx`'s tab router as route `system`. Confirmed: essentially the entire widget catalog mounts here for paid tiers (38 of 39 widgets across 14 stacks); the free tier gets a stripped 4-widget subset. This is complete by design, not a gap.

**Portrait / profile page.** There is no component literally named "Portrait" — the closest is `PublicProfile.tsx` (`src/client/entries/public-profile.tsx`, route `/u/:userIdOrUsername`, data from `GET /public/profile/:userIdOrUsername` in `src/server/routes/public-api.ts`). **Zero widget components are mounted on this page** — it hand-rolls its own JSX (`Block`/`Tag`/`TagsContainer`) fed by server-side recomputation that parallels (but does not reuse) widget logic: `extractUserTraits()`/`determineUserCohort()` (the same utility `/qi`'s trait block uses), `calculateCorrelatedIndexes()` (a server-side re-implementation of what `CorrelatedIndexesWidget` shows), and `user.metadata.quantumIntentState` (persisted by the same `/api/quantum-intent/sync` route that feeds `QuantumStateWidget`). The one real link between widgets and Portrait is that shared persisted metadata field — everything else is parallel, hand-maintained code. If the intent is "Portrait should show the same widgets, live," that link doesn't exist today.

---

## 3. LOT® Quantum Intent Engine, Memory, and Story

**Quantum Engine.** A real backend exists — `POST /api/quantum-intent/sync` (api.ts:3661) plus scheduled cron jobs read the signal stream and write `quantumIntentState`/`quantumIntentPatterns` into `user.metadata` — but it is a client-computed, periodically-synced behavioral pattern tracker, not literal quantum computing. `QuantumEngineWidgets.tsx`/`QuantumStateWidget.tsx` have real wiring on this basis. Two sibling widgets are decorative: `QuantumRandomWidget.tsx` generates numbers with plain `Math.random()` (line 23–25, confirmed no external entropy source — the in-code comment even jokes about it), and `QuantumSignWidget.tsx`'s "daily sign" is a deterministic array lookup keyed on the date, not a live computation. Both still emit real telemetry signals into the same engine, so the *label* is thematic branding, not the *plumbing*.

**Memory.** Real and substantial: `GET /api/memory` uses intelligent pacing + an LLM call (`buildPrompt`/`completeAndExtractQuestion` in `src/server/utils/memory.ts`) seeded with recent Log context and `quantumState`, falling back to a static question bank for non-Usership users. Answers persist to the Sequelize `Answer` model and a `Log` row. This is the exact system already tracked in `docs/diagnostics/MEMORY-QUESTIONS-NOT-SHOWING-DIAGNOSTIC.md`. **New finding while auditing:** that diagnostic doc tells operators to check `/api/memory/diagnostics` — **no such route exists**. The real debug endpoints are `GET /api/memory-status` and `GET /api/memory-debug` (also mirrored at `/admin-api/memory-debug`). The diagnostic doc should be corrected so it points at a route that actually resolves.

**Story.** `NarrativeWidget.tsx` reads `GET /api/narrative`, which is real and deterministic — not LLM-based. It loads the user's last 500 Log rows and runs rule-based level/chapter/achievement logic in `src/server/utils/rpg-narrative.ts`. No separate Story/Narrative table exists; it's computed fresh per request from `Log`. No decorative shortcuts found here — this widget's wiring is clean.

---

## 4. Sync, self-care logging, and the military-format Log

The task frames widget interactivity as something that should sync shared context (weather, time, users-online) and post to a "Log" in a disciplined, military-communications style. Checking what's real:

- **Weather** — real. `src/server/utils/weather.ts` calls Open-Meteo (no key required), cached in the Sequelize `WeatherResponse` model, served via `GET /api/weather`, and fanned out widely: memory/question-generation prompts, pattern analysis, `Log.context`, public profile (when `privacy.showWeather` is set), and client-side ambient sound modulation. (One decorative exception: a hardcoded "Florence weather" easter egg in a legacy demo profile — narrative flavor, not live data.)
- **Users online / presence** — real and live. `User.ping()`/`User.countOnline()` (15-minute window) pushed via a genuine Server-Sent-Events channel, `GET /api/sync` (api.ts:326–410, in-process event bus, 15s keepalive), consumed once globally in `app.tsx` and fanned into `stores.usersOnline`. This is the one true real-time channel in the app — everything else that looks live is REST polling or a local timer.
- **The Log itself** — real, generic, Sequelize-backed (`Log` model, `event` + JSON `metadata`/`context`), with dozens of named event types already reading like a military communications log (`operator_convergence`, `signal_crystallization`, `biorhythm_lock`, `os_vitals_snapshot`, etc.). **But coverage is partial, not systemic:** of the 39 widgets, only a handful (`RecipeWidget`, `PlannerWidget`, `CalendarWidget`, `ContextualPromptsWidget`, plus `EmotionalCheckIn` via its own endpoint) actually write to it. The majority — games, calculators, most quantum/pattern-recognition widgets — read from the Log for display/analytics but never write an entry back for their own interactions. If the goal is a complete data log of widget usage across the platform, today's coverage is roughly a fifth of the widget catalog.
- **15-month month-to-month UI reveal/build-up schedule** — searched the full `docs/` tree for this roadmap; no such document exists. Every apparent hit was a false positive on "$15/month" subscription pricing (R&D tier), not a UI-rollout calendar. Flagging this honestly rather than inventing a schedule: if this roadmap exists outside the repo, it isn't checked in, so widgets can't currently be scanned against it.

---

## 5. Loading speed and lag

**Bundle strategy:** No code-splitting exists anywhere in the client. `React.lazy`/`Suspense`/dynamic `import()` — zero matches across `src/client`. All 39 widgets are statically imported into one monolithic bundle via `System.tsx`. `esbuild.config`'s `splitting: true` is currently a **no-op** because splitting only activates on dynamic imports, and there are none. Separately, `client:js:build:metafile` (`package.json:39`) is a **dead script** — `scripts/build/client.build.ts` never reads argv or passes `metafile: true` to esbuild, so running it produces an ordinary build with no bundle-size report. There is currently no way to measure per-widget or total bundle size without fixing that script first.

**Historical lag fixes (real, already shipped):** three commits already establish the house fix pattern —
- `863b333` — unbounded `/api/logs` query + 7 unthrottled 30–60s stats-polling hooks starved the DB pool; fixed with a server-side `LIMIT 500`, longer `staleTime`, 120s intervals, and `refetchIntervalInBackground: false`.
- `b219cc3` — `System.tsx` wrote to nanostore atoms inside `useMemo` during React's render phase, forcing ~10 subscriber re-renders before paint; fixed by moving the writes to `useEffect`.
- `9364aba` — `SignalStreamWidget` and `UserMetricsWidget` re-sorted/re-classified on every store-wide render; fixed with `useMemo` keyed to the relevant signal slice.

**Unfixed instances of the same pattern found in this audit** (not yet touched by the above fixes):
- **`PatternRecognitionWidget.tsx` — a real correctness bug, not just a perf issue.** It subscribes broadly (`useStore(intentionEngine)`), then in the "confidence" view calls `patterns.sort(...)` directly on `engine.recognizedPatterns` — a live reference into the store, not a copy (`:291–292`). **This mutates the store's array in place during render.** The "active" view also recomputes the same filter three times per render. Zero targeted `useMemo` around this path.
- **`AIFeedbackWidget.tsx`** — full store subscription, unmemoized `.filter()` on every `getGuidance()` call, zero `useMemo` in the file.
- **`CohortConnectWidget.tsx`** — unmemoized `map`+`sort`+`slice` of match data directly in the render body, zero `useMemo` in the file.
- **`QuantumEngineWidgets.tsx`** — mostly memoized (5 `useMemo` calls) but two spots still filter/sort the full signal array (up to ~1000 entries) inline, unmemoized.
- **`GoalJourneyWidget.tsx`** — filters `goals` three times redundantly per render; lower risk since it's react-query-driven rather than store-wide-subscribed, but the same shape.
- For comparison, `IntegrityWidget.tsx` already does this correctly — its heaviest function is `useMemo`-wrapped keyed on `logs` — confirming the fix pattern is known, just not yet applied everywhere.

**Polling inventory:** most interval-driven widgets are correctly gated on `document.hidden`/route-active (`ChakraErgonomicsWidget`, `SystemPulseWidget`, `SystemProgressWidget`, `ContextualPromptsWidget`). Two are not: `QuantumRandomWidget.tsx` runs two ungated intervals (1s + 10s) and `MicroCalculatorWidget.tsx` runs an ungated 10s poll — both do cheap local work, so risk is low, but they're the same unguarded shape the historical incident was caused by.

**`React.memo` coverage:** 1 of 39 widgets (`MemoryWidget.tsx`) uses `React.memo` — about 3%. The codebase's actual mitigation strategy is targeted `useMemo` plus visibility gating on intervals, which is reasonable, but it's applied inconsistently, as the list above shows.

---

## Priority findings for follow-up

1. **Fix `PatternRecognitionWidget.tsx`'s in-place `.sort()` on live store state** — this is a correctness bug (mutates shared engine state during render), not only a lag risk.
2. **Wrap `TimeWidget` and `QuantumRandomWidget` in `WidgetErrorBoundary`** — currently the only two unguarded mounts in `System.tsx`.
3. **Apply the established `useMemo` fix pattern** to `AIFeedbackWidget`, `CohortConnectWidget`, `QuantumEngineWidgets` (2 remaining spots), and `GoalJourneyWidget`.
4. **Stand up a minimal automated test layer** — there is currently none. Even a smoke pass that hydrates `System.tsx` and hits the ~15 widget-data endpoints would catch regressions the cold-start script cannot see.
5. **Correct the stale `/api/memory/diagnostics` reference** in `MEMORY-QUESTIONS-NOT-SHOWING-DIAGNOSTIC.md` to point at the real `/api/memory-status` / `/api/memory-debug` routes.
6. **Decide the "LOT AI:" label's fate** — either wire `EmotionalCheckIn.tsx` to an actual model call, or rename the label so it stops promising an AI response it doesn't deliver.
7. **Fix the dead `client:js:build:metafile` script** so bundle size becomes measurable, then evaluate real code-splitting for the 39-widget bundle.
8. **If a documented 15-month UI rollout calendar exists, add it to `docs/`** — none was found in-repo to audit widgets against.

---

*This report is a read-only audit — no widget code, store, or route was modified while producing it.*

*Vadik*
*lot-systems.com/u/vadik*
