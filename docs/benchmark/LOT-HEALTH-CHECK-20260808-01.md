# LOT Systems — Health Check Report
## Session: 2026-08-08 · Scheduled Automated Run

**Repo:** `LOT-Systems/LOT-Computer` · **Branch:** `master` @ `98971f2`  
**Stack:** v1.3.0 · React 18 / Fastify 5 / Postgres / Digital Ocean App Platform (nyc3)  
**FM Version:** v113 · **QIE:** 151 patterns / 51 archetypes / 48 jobs  
**Badge Universe:** 812 badges · **Wiki:** v87 · **Day 1076+**

---

## 1. Active Incidents

### 🔴 PR #93 — MERGE CONFLICT (Blocking)

| Field | Value |
|---|---|
| PR | [#93 feat(calendar): time tracking + military-grade due-event toast](https://github.com/LOT-Systems/LOT-Computer/pull/93) |
| State | `open` · `mergeable_state: dirty` |
| Age | **11 days** (opened 2026-07-28, last updated 2026-08-05) |
| Branch | `claude/dreamy-babbage-4iv1xo` |
| Base | `7c1d1cf` — master has moved **9 commits ahead** since |

**What happened:** PR #93 was opened July 28 atop master commit `7c1d1cf`. Since then, five engineering sessions landed large commits — QIE v112/v113 (P143–P151, Arch49–51, J46–J48), Badge Codex v30/v31/v32 (+93 badges), Wiki v85–v87, and the astrology signal merge (`73edd95`) — all of which touched `Logs.tsx` and/or `SystemProgressWidget.tsx`. The PR's `Logs.tsx` changes (CAL: time display renderer) now conflict with the `CIRC-LK: / DIMSAT: / QIDCRYST: / SIG-CASC: / QPFIELD: / IDLOCK: / PHYARC: / QEMERG: / SIGEWEB: / QPCRYST: / TOTCOH: / RECINTEL:` handler blocks added in QIE v111–v113.

**Impact:** Calendar time-tracking and due-event toast feature unavailable in production. The `CalendarWidget.tsx` in master (9.4 KB) still has no time-of-day field or `CalendarEventToast.tsx`.

**Action required:** Rebase `claude/dreamy-babbage-4iv1xo` onto current master, resolve conflicts in `Logs.tsx` (preserve both CAL: time renderer and all QIE military handlers), then re-push.

---

## 2. Errors and Warnings

### 🟡 DS_Store Files Committed to Repo

Macintosh metadata files are tracked in git and served via GitHub:

| File | Path |
|---|---|
| `.DS_Store` | root |
| `src/.DS_Store` | src/ |
| `src/client/.DS_Store` | src/client/ |
| `.!79925!.DS_Store` | root (corrupted name) |

These are harmless in production but pollute the repository history, bloat diffs, and are a minor professionalism signal when the repo is public or reviewed by investors/engineers. Add all DS_Store patterns to `.gitignore` and remove them from tracking with `git rm --cached`.

### 🟡 Stale Dependency Versions

| Package | Pinned | Latest (2026-Q3) | Risk |
|---|---|---|---|
| `axios` | `^0.27.2` | `1.7.x` | Medium — 0.x has known SSRF/CSRF advisories |
| `react-query` | `^3.39.3` | TanStack Query `5.x` | Low — v3 still maintained but missing v5 structural queries |
| `tailwindcss` | `^3.1.6` | `4.x` | Low — v4 has breaking config changes, pin upgrade to planned sprint |
| `@anthropic-ai/sdk` | `^0.32.1` | `^0.55+` | Medium — missing tool_choice streaming, prompt caching updates |
| `prettier` | `^2.7.1` | `3.x` | Low — v3 has better TS printer |
| `nodemon` | `^2.0.19` | `3.x` | Low |

**Priority:** The `axios` version should be upgraded first — it is used in server-side code and carries SSRF risk in older releases.

### 🟡 Monolithic File Sizes (Bundle / Maintainability Risk)

The following files are abnormally large for a React/Node codebase:

| File | Size | Risk |
|---|---|---|
| `src/client/components/About.tsx` | **467 KB** | Bundle bloat; this entire component loads on `/about` |
| `src/client/components/Logs.tsx` | **218 KB** | High conflict surface; merge conflicts in every engineering session |
| `src/client/components/SystemProgressWidget.tsx` | **205 KB** | Heavy on System tab; all 151 patterns inline |
| `src/server/scheduled-jobs.ts` | **218 KB** | Monolith; 48 jobs in one file |
| `src/server/routes/api.ts` | **200 KB** | All user-facing routes in one file |
| `src/server/utils/memory.ts` | **89 KB** | Core AI inference engine |

`About.tsx` at 467 KB is the dominant concern. On a `basic-xs` DO instance, this serializes the entire Field Manual into the initial bundle. It should be code-split into lazy-loaded sections (each doctrine chapter, each FM section). Consider `React.lazy()` + `<Suspense>` per chapter, or a dedicated `/field-manual/:section` route.

`Logs.tsx` at 218 KB is a continuous conflict magnet — every QIE engineering session adds 3 military handlers there. The handler registry pattern should be extracted to a separate file (`lot-log-handlers.ts`) with auto-import, so the base component stays stable between engineering sessions.

---

## 3. Performance Anomalies

### ✅ System Tab Render — Fixed (PR #95, merged 2026-07-28)

The previously flagged System tab render stall is confirmed resolved:
- `SignalStreamWidget`: signals sort memoized on `engine.signals` ref — no longer re-sorts on every intention write
- `UserMetricsWidget`: `getUserIndex()` + `classifyPhysiologicalCohort()` memoized on `engineState.signals`
- Measured: 5 rapid System↔Log switches dropped from heavy-task-per-switch to ~118ms one-time mount cost

### 🟡 CalendarWidget — No Time-of-Day Indexing

Current `CalendarWidget.tsx` (9.4 KB, master) has no timed-entry capability. The pending PR #93 adds it, but until that lands, any calendar entry that should fire a due-event toast is silently dropped. The 10-minute due-window polling mechanism in PR #93 relies on `localStorage` self-deduplication — verify the polling interval doesn't become a battery drain on mobile sessions once merged.

### 🟡 No External APM / Error Tracking

All monitoring is first-party:
- `/health` endpoint → `{status: 'ok'}` (DO health check only)
- `scripts/monitoring/health-check.ts` — PG connectivity + heap stats (manual run)
- `scripts/monitoring/pool-monitor.ts` — PG pool stats (manual run)
- `scripts/monitoring/dashboard.ts` — terminal dashboard (manual run)

There is no automatic error capture (no Sentry, no Datadog, no Axiom). If the production server throws an unhandled rejection, it is only visible in DO console logs. Recommend integrating a lightweight error sink — even a simple `process.on('uncaughtException')` handler that writes to a separate log file, or a free Sentry project, would provide real incident alerting.

---

## 4. Resolved Since Last Session

All of the following shipped clean (GREEN) and are confirmed merged to master:

| Date | Item | Commit |
|---|---|---|
| 2026-08-05 | **PR #96 merged** — Badge v32 Hero's Journey Codex (+93 badges, 719→812 total) | `91e3648` |
| 2026-08-05 | Wiki v87 · FM v113 sync · QIE v113 + Badge v31 documentation (48/48 checks) | `8ac3690` |
| 2026-08-04 | **QIE v113** — P149 QPCRYST / P150 TOTCOH (ceiling) / P151 RECINTEL · Arch51 · J48 | `d7f076e` |
| 2026-08-04 | **Badge Codex v31** Cyberspace Codex +31 badges (750→781) | `a9dd764` |
| 2026-08-04 | Merge conflict in `System.tsx` resolved — `recordAstrologySignal` + `getCircadianPhase` both imported | `73edd95` |
| 2026-08-03 | **QIE v112** — P146 signal-coherence-cascade / P147 quantum-presence-field / P148 identity-momentum-lock · Arch50 · J47 | `1846b80` |
| 2026-08-03 | **Badge Codex v30** The Codex Reader +31 badges (719→750) · Sci-Fi Literature Word Turn Engine | `5b2ef49` |
| 2026-07-28 | **PR #95** — `SignalStreamWidget` + `UserMetricsWidget` memoized (System tab render fix) | `9364aba` |
| 2026-07-28 | **PR #94** — Two residual button-lag paths fixed | `be3e8fa` |
| 2026-07-28 | **PR #92** — Astrology widget personalised, QIE-synced, staleness fixed | merged |

---

## 5. Component Quality Audit — TOP Designer Standard

Standards reference: top-tier product sites (Linear, Vercel, Stripe, Notion) for 2026.

### ✅ Strengths

- **Component naming** is consistently precise (`CalendarWidget`, `PatternRecognitionWidget`, `SystemPulseWidget`) — no generic component soup
- **Nanostores** architecture is correct for this workload — fine-grained subscriptions prevent re-render cascades
- **`useMemo` discipline** is improving (PRs #94/#95 set good precedent)
- **Military log handler pattern** (`CAL:`, `CIRC-LK:`, etc.) is clean and consistent in `Logs.tsx`
- **`WidgetErrorBoundary`** in `src/client/components/ui/` — good fault isolation per widget
- **esbuild** with separate entries per page (`app`, `login`, `status`, `about`, `public-profile`, `ui-lib`) — correct for aggressive code-splitting

### 🔧 Improvements Needed

#### 1. `About.tsx` (467 KB) — Split into lazy sections
```tsx
// Current: one giant component
import { About } from './About'  // 467 KB loaded synchronously

// Target: lazy-load each chapter
const FieldManual = React.lazy(() => import('./FieldManual'))
const OperatorCodex = React.lazy(() => import('./OperatorCodex'))
```
This is the single highest-impact optimization available. At 467 KB, the `/about` entry point alone exceeds the combined size of all other widgets.

#### 2. `Logs.tsx` (218 KB) — Extract handler registry
The QIE military handler dispatch table (150+ handlers) should live in `src/client/utils/lot-log-handlers.ts` and be imported as a map. The Logs component becomes a thin renderer. This eliminates the merge conflict surface in every engineering session.

#### 3. `CalendarWidget.tsx` — Missing time-of-day (pending PR #93)
The current widget is complete for date-only entries. Once PR #93 lands (after conflict resolution), the time-of-day UX will follow the Terminal Grid aesthetic established by `EvolutionMilestoneToast.tsx`. Verify the toast z-index doesn't collide with `EvolutionMilestoneToast` on mobile viewports.

#### 4. `react-query` v3 → TanStack Query v5
`useQueryClient`, `useLogs`, `useCreateLog` — all from react-query v3. v5 has structural `queryOptions` and better TypeScript inference. Plan for a migration sprint; it is not a same-day drop-in.

#### 5. `axios` 0.x → 1.x (security)
Server-side code uses `axios ^0.27.2`. Version 0.x has known SSRF-adjacent issues with redirect following. Upgrade to `axios ^1.7.x` — the API is backwards-compatible in all usage patterns found in this repo.

#### 6. `.gitignore` — Add DS_Store entries
```
# macOS
.DS_Store
**/.DS_Store
*.DS_Store
```
Then `git rm -r --cached .DS_Store src/.DS_Store src/client/.DS_Store ".!79925!.DS_Store"`.

#### 7. `SystemProgressWidget.tsx` (205 KB) — Pattern registry extraction
The 151-pattern inline map should be auto-generated from the QIE source of truth. A `scripts/generate-pattern-display-names.ts` script would eliminate the manual update step every engineering session and prevent the 205 KB file from growing unbounded.

---

## Summary Scorecard

| Area | Status | Notes |
|---|---|---|
| Active Incidents | 🔴 1 | PR #93 merge conflict — calendar feature blocked |
| Open Issues | ✅ 0 | Issue tracker clean |
| Open PRs | 🟡 1 | PR #93 — 11 days old, dirty |
| Last Commit | 🟡 Aug 5 | 3 days idle |
| Dependency Health | 🟡 | `axios` 0.x needs upgrade |
| Bundle / Files | 🟡 | About.tsx 467 KB critical |
| Monitoring | 🟡 | First-party only, no APM sink |
| Render Performance | ✅ | System tab fixed (PR #94/#95) |
| QIE Engine | ✅ | v113 / P149–P151 / Arch51 / J48 |
| Badge Universe | ✅ | 812 badges / Hero's Journey v32 |
| Wiki | ✅ | v87 current / 2176 lines / 48/48 checks |

---

## Recommended Next Actions (Priority Order)

1. **[URGENT]** Rebase PR #93 onto master, resolve `Logs.tsx` conflict, re-push → merge calendar feature
2. **[HIGH]** Upgrade `axios` to `^1.7.x` (security)
3. **[HIGH]** Clean DS_Store files from git tracking
4. **[MEDIUM]** Split `About.tsx` into lazy-loaded sections (largest bundle win)
5. **[MEDIUM]** Extract QIE handler registry from `Logs.tsx` into standalone file
6. **[LOW]** Add lightweight error sink (Sentry free tier or uncaughtException handler)
7. **[LOW]** Upgrade react-query → TanStack Query v5 (plan for dedicated sprint)

---

*Report generated by automated health-check routine · LOT-HEALTH-CHECK-20260808-01*  
*Next scheduled run: 2026-08-09*
