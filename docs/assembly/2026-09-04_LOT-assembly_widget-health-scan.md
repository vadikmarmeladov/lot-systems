<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Widget Health Scan — 2026-09-04

## Full-Platform Wiring, UI, and Lag Audit

**Session:** Scheduled Health Scan
**Date:** 2026-09-04
**Base commit:** `98971f2` (2026-08-05)
**Status:** SCAN COMPLETE — READ-ONLY (no code changed in this session)
**Method:** 4 parallel static-analysis passes over ~48 widget components, server routes, the QIE/Memory/Story signal pipeline, and the client build/perf surface.

---

### Scope

Per the standing directive to check widget wiring, data storage, LOT® AI / System tab / Portrait, LOT® Quantum Intent Engine / Memory / Story, interactive-widget context sync and military-style Log posting, loading speed, and lag — this scan covers all four in one pass. No "15-month month-to-month UI reveal" schedule document exists anywhere in the repo today (searched for reveal/rollout/build-up naming under `docs/` and `src/`); if such a cadence exists it currently lives outside version control. Flagging this as its own finding below rather than guessing at a rollout the code doesn't encode.

---

## 1. Widget Wiring & Data Storage

**Overall:** the *code* is sound — every sampled widget's actual `fetch`/nanostore wiring resolves to a real, registered server route. The *documentation* (`docs/technical/WIDGETS.md`) has drifted hard from the code and should not be trusted for endpoint names or counts.

### 1a. Doc-vs-code endpoint mismatches (code is correct; `WIDGETS.md` is stale)

| Widget | Doc claims | Actual route |
|---|---|---|
| User Metrics Widget | `/api/os-status`, `/api/os-performance`, `/api/os-version` | `/api/os/status`, `/api/os/performance`, `/api/os/version` (`os-api.ts:34,93,183`) |
| Feedback / System Progress Widget | `/api/os-diagnostics` | `/api/os/diagnostics` (`os-api.ts:238`) |
| System Progress Widget | `/api/cohorts` for physiological cohort | `/api/user-profile` — **already fixed in code**, with an in-file changelog note at `SystemProgressWidget.tsx:349` ("cohort fetch corrected: /api/cohorts → /api/user-profile"). Doc never updated. |
| Growth / Badge / Wellness / Memory-Engine / Intention stats widgets | `/api/growth-stats`, `/api/badge-stats`, `/api/wellness-pulse`, `/api/memory-stats`, `/api/intention-patterns` | `/api/stats/growth`, `/api/stats/badges`, `/api/stats/wellness`, `/api/stats/memory-engine`, `/api/stats/patterns` — none of the doc's paths exist server-side |
| Collective Consciousness | `/api/community-consciousness` | `useCollectiveStats` → `/api/stats/collective`. A different real route, `/api/community-emotion` (`api.ts:3904`), exists but is unused — likely doc conflation of two similar endpoints |
| System Pulse Widget | "polled every second" | Reduced to 10s in code (`SystemPulseWidget.tsx:91`, comment: "was 1s — reduced to prevent DB overload under traffic") |

**Fix effort:** low — this is a documentation-only pass over `docs/technical/WIDGETS.md`, not a code fix. Recommend a dedicated doc-sync session before the next widget count is quoted anywhere external-facing (investor deck, wiki).

### 1b. Orphaned widget

`src/client/components/AwarenessDashboard.tsx` is **never imported anywhere** in the codebase. `WIDGETS.md:175` explicitly (and incorrectly) claims it's "integrated into the System.tsx layout." It is dead UI — either finish wiring it into System.tsx or remove it.

### 1c. Real bug — silent QIE signal data-shape mismatch (Signal Archive / Log)

`Logs.tsx:377–402` renders the `quantum_intent_signal` event by reading `metadata?.pattern`, `.confidence`, `.reason`. But the only writer, `POST /api/quantum-intent/sync` (`api.ts:3661–3695`), stores the signal name under `metadata.signal` (not `.pattern`), with confidence/reason nested under `metadata.signalMetadata`. **Every synced QIE signal in the Log therefore displays a bare `QIE:` block with pattern, confidence, and reason permanently `undefined`.** The real pattern objects from `analyzeIntentions()` are saved separately to `user.metadata.quantumIntentPatterns` — never written to a Log row at all, so the field the renderer expects is structurally unreachable. This is the single highest-value fix in this scan: either change the sync route to write `metadata.pattern`/`.confidence`/`.reason`, or change the renderer to read `metadata.signal`/`metadata.signalMetadata`.

### 1d. Error handling

Widespread `.catch(() => {})` on raw `fetch()` calls (`UserMetricsWidget.tsx:53,66`, `SystemProgressWidget.tsx:1603`, and others) swallows network errors silently — the widget just renders nothing, with no visible error or retry affordance. Contrast with `CosmicUpdateWidget.tsx`, which has an explicit loading/error/"Retry" state machine and is the model to copy.

### 1e. Test coverage

**Zero.** No `*.test.ts(x)` / `*.spec.ts(x)` files exist anywhere in the repo, no `vitest`/`jest` config, no `test` script in `package.json`. None of the 48 widget components or the API routes behind them have any automated coverage — `test:cold-start` only smoke-tests server boot. This is the biggest structural gap uncovered in this scan.

---

## 2. LOT® AI, System Tab, and Portrait (Personal Profile)

- **System.tsx vs. the doc:** all 14 documented stacks correspond to real render blocks, and no documented widget is missing from the code. But **12 live, rendered widgets have no entry in `WIDGETS.md` at all**: `ChakraErgonomicsWidget`, `MoodAnalytics`, `CohortConnectWidget`, `MicroImageWidget`, `FourDimensionalUI`, `QuantumEngineWidgets`, `IntegrityWidget`, `CorrelatedIndexesWidget`, `ArchitectWidget`, `CalendarWidget`, `BenchmarkWidget`, `MonthlyPulseWidget`. The doc undercounts the real widget surface by roughly a quarter.
- **Portrait** is not a literal component name — it's the vision-doc metaphor for `PublicProfile.tsx`, served via its own bundle entry at `GET /u/:userIdOrUsername` (`server.ts:182`), pulling from `/api/public/profile/:userIdOrUsername` (`public-api.ts:741`). Routing, entry registration, and the API are all correctly wired end to end — theme, weather, tags, board profile, Memory Story, psychological profile, correlated indexes, and a Usership-gated QR code all load correctly.
- **Fragile spot:** `Settings.tsx:470-473` renders a user's own Portrait link as **plain, non-clickable text**, not an `<a href>`. A user can copy it but can't click through to their own public page from Settings — a small missed affordance, not a break.
- **LOT AI reality check:** the real Together.AI-backed features are `CosmicUpdateWidget` (image generation, `POST /api/cosmic-update`) and the `/qi` command inside the Log editor (`POST /api/qi`) — both genuinely call `TogetherAIEngine` (`src/server/utils/ai-engines.ts:213-337`) with graceful 503/500 degradation and rate limiting. **`AIFeedbackWidget` is misdocumented** — despite its name and the doc's claim of being "a raw engine plugin powered by Together.AI" (`WIDGETS.md:200`), it is purely local rule-based logic over `intentionEngine`/`useOSDiagnostics`/`useProfile`/`useLogs` state, with no LLM call anywhere in the file. Worth correcting the doc so "LOT AI" isn't overclaimed to users or investors.

---

## 3. Quantum Intention Engine, Memory, and Story

`src/client/stores/intentionEngine.ts` (6,503 lines) is the real center of gravity here, and it has grown far past what any doc currently claims:

| Metric | Doc says | Code actually has |
|---|---|---|
| QIE patterns | 14 (WIDGETS.md) / 25 (Apr 2026 assembly log) | **151 unique patterns** (152 entries — `intention-completion-arc` is defined twice, at lines 1088 and 1454; the second is a dead duplicate) |
| Signal sources | 11 | **17** (the `IntentionSignal['source']` union) |
| Self-assembly modules | 11–14 across various docs | **18** (`selfAssembly.ts`) |
| Log event renderers | "14+" | **154** distinct `log.event ===` cases in `Logs.tsx`, plus a graceful generic fallback for anything unmatched — so an unrenderable/raw-JSON failure mode does not occur |
| `/api/badge-stats` | documented as existing | **does not exist** — badges are computed client-side from `/api/user-stats` |

Treat every count in `docs/assembly/*.md` and the in-app narrative flavor text (`About.tsx`, `SystemProgressWidget.tsx`) as hand-authored storytelling, not a derived-from-code figure — only counts pulled directly from source, as above, are current.

**Memory widget:** wiring is correct end to end. `/api/memory`, `/api/memory/answer`, `/api/memory/story` all exist; answering records a signal via `recordSignal()` and correctly triggers `checkAndAwardBadges()` off real `/api/user-stats` data.

**Narrative/Story widget:** correct end to end. `/api/narrative`'s three response shapes (`narrative` / `null+message` / `null+error`) match the widget's guard clauses exactly, and `useLogContext()`'s `engagementLevel` enum matches the widget's narrative-tone map with no drift.

**Dead code found:**
- `LOG_DEPENDENCY_SOURCES` includes `'ecosystem'`, which is **not** in the `IntentionSignal['source']` type union (a latent type inconsistency), and omits `'astrology'`, which is. It's only consumed by decorative flavor-text strings, not real filtering.
- `WIDGET_DEPENDENCY_MAP` (179 keys) is genuinely used by exactly one call site (a cosmetic list in `QuantumEngineWidgets.tsx`); its three sibling accessor functions (`getWidgetsDependingOn`, `getWidgetTier`, `getWidgetDepth`) have zero real call sites anywhere — dead exports.

---

## 4. Interactive Widget Context Sync & the Military Log

Context-sync widgets (weather, time, online-user counts) push into the Signal Archive correctly, and the Log's 154-case renderer degrades gracefully on anything it doesn't recognize (falls back to a plain `LOG:` block rather than failing) — this is the one place in the whole scan where "unknown input" is handled defensively by design. The one exception is the QIE-sync data-shape bug in §1c, which is a genuine gap in that otherwise-solid posture.

---

## 5. Loading Speed & Lag

**Polling hygiene is good overall.** All 17 `setInterval` sites checked have matching `clearInterval` cleanup — no leaked timers found. Several widgets (`SystemPulseWidget`, `ChakraErgonomicsWidget`, `ContextualPromptsWidget`) correctly gate polling on `document.hidden` / active-route checks. The one widget worth tightening: **`QuantumRandomWidget`** runs two independent 1-second tickers per instance plus a 10-second ticker, with no visibility gating at all — the least-throttled widget in the app, ticking forever in the background once mounted.

**No code-splitting for widgets.** `client.build.ts` sets `splitting: true`, but that only shares chunks between the app's 7 static entry points — there is no `React.lazy`/dynamic `import()` for any of the ~40 widgets `System.tsx` statically imports (lines 30-81). They all ship in one bundle and mount eagerly on load. `LazyMount` (an `IntersectionObserver`-gated deferred-mount wrapper) exists and works well, but is applied to exactly **1 of ~40** widget groups (`QuantumEngineWidgets`). This is the highest-leverage initial-load-speed improvement available: extending `LazyMount` to the Stats Stack, Subscriber Stack, and Investor widgets (all below-the-fold or conditionally shown) would cut initial JS execution meaningfully with no behavior change.

**Render-perf:** only 1 of 38 widget files uses `React.memo` (`MemoryWidget.tsx`); `System` itself is memoized. No egregious render-body loops or sorts were found in the widgets sampled. `SystemProgressWidget.tsx:1621-1642` already contains a deliberate, documented fix for click lag — a ~139-pattern analysis was moved off the click handler into `setTimeout(build, 0)` specifically to kill "click, then a beat, then it happens" — good prior art worth repeating elsewhere if similar lag surfaces.

**Audio/sound:** clean. `sovietChime.ts` and `sound.ts` both lazily create and reuse a single `AudioContext` rather than `new Audio()` per render; `radio.ts` creates its one `Audio()` element behind a ref guard. No audio-related lag risk found.

**Bundle-size tooling is a no-op.** `package.json` defines `client:js:build:metafile`, but `client.build.ts` never reads `process.argv` or passes `metafile: true` — running that script produces no metafile today. There is no checked-in bundle-size baseline and no documented size budget. Worth wiring up for real before the widget count grows further.

**Existing mitigations worth crediting:** `useInViewport`/`useActiveViewport` hooks, `document.hidden` polling gates, per-widget mount-time instrumentation in `WidgetErrorBoundary.tsx` (`window.__LOT_WIDGET_PERF__`, warns on >50ms mounts) with crash isolation, and `useDebounce` on autosave/search inputs.

---

## Summary Table

| Area | Status | Top action |
|---|---|---|
| Widget → API wiring (code) | ✅ Sound | — |
| Widget docs (`WIDGETS.md`) | ⚠️ Stale | Doc-sync pass: endpoint names, pattern/source/module counts, 12 undocumented widgets |
| Orphaned UI | ⚠️ 1 found | Wire in or delete `AwarenessDashboard.tsx` |
| QIE Log rendering | 🔴 1 real bug | Fix `metadata.pattern`/`.signal` mismatch, `Logs.tsx:377` / `api.ts:3661` |
| LOT AI accuracy | ⚠️ Misdocumented | Correct `AIFeedbackWidget` doc claim; it has no LLM call |
| Portrait link UX | ⚠️ Minor | Make Settings' own-profile link clickable (`Settings.tsx:470`) |
| Automated tests | 🔴 None | Zero coverage across 48 widgets + API routes |
| Polling/timers | ✅ Mostly clean | Gate `QuantumRandomWidget`'s tickers on visibility |
| Code-splitting | ⚠️ 1/40 widgets | Extend `LazyMount` to below-the-fold stacks |
| Bundle-size tooling | ⚠️ No-op | Wire up `-metafile` flag for real |
| Audio/sound | ✅ Clean | — |
| Dead code | ⚠️ Minor | Duplicate pattern def, unused dependency-map accessors |
| 15-month UI reveal cadence | ❓ Not found in repo | Confirm whether this schedule lives outside version control, or should be documented |

---

### Next session targets

- Fix the QIE Log data-shape bug (§1c) — highest-value, lowest-risk fix in this scan.
- Doc-sync `docs/technical/WIDGETS.md` against current code (endpoints, counts, 12 missing widgets).
- Decide: finish `AwarenessDashboard.tsx` or remove it.
- Extend `LazyMount` beyond `QuantumEngineWidgets` to the Stats/Subscriber/Investor stacks.
- Stand up a minimal test harness (even smoke-level) — currently the single largest gap in platform health.

---

*Vadik*
*lot-systems.com/u/vadik*
