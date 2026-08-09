# LOT Systems — Health Check Report
**Date:** 2026-08-09 · Session: Automated Monitoring · Branch: `claude/inspiring-volta-scodiy`

---

## Executive Summary

All primary systems are operational. One open PR has a merge conflict requiring resolution. Three code-quality defects and several dependency staleness issues identified. No production incidents or active outages detected.

---

## 1. Active Incidents

### MEDIUM — PR #93 Merge Conflict (Stale)
- **PR:** [#93 feat(calendar): time tracking + military-grade due-event toast](https://github.com/LOT-Systems/LOT-Computer/pull/93)
- **State:** `dirty` — merge conflict against `master` (base SHA `7c1d1cf`, now 4 commits behind)
- **Opened:** 2026-07-28 · **Last updated:** 2026-08-05
- **Impact:** Feature blocked — CalendarWidget time-tracking and due-event toast cannot ship until conflict is resolved. `+483 / −3` lines across 9 files.
- **Action:** Merge `master` into `claude/dreamy-babbage-4iv1xo`, resolve conflicts (likely in `CalendarWidget.tsx`, `Logs.tsx`), re-push.

### LOW — `scripts/monitoring/dashboard.ts` Non-Functional
- **File:** `scripts/monitoring/dashboard.ts`
- **Issue:** Imports `blessed` and `blessed-contrib` at the top level. Neither package is listed in `package.json`. The file crashes on any execution attempt.
- **Impact:** Local TUI monitoring dashboard is dead. `health-check.ts` and `pool-monitor.ts` are unaffected.
- **Action:** Either add `blessed` + `blessed-contrib` to devDependencies or remove/rewrite `dashboard.ts`.

---

## 2. Errors & Warnings

### WARNING — Committed Backup File
- **File:** `src/client/entries/login.tsx.backup`
- **Issue:** A `.backup` file is committed to the source tree. It inflates the repo, confuses search tools, and risks serving stale code if mistakenly referenced.
- **Action:** Delete and add `*.backup` to `.gitignore`.

### WARNING — `axios ^0.27.2` (EOL 0.x series)
- **Package:** `axios` at `^0.27.2`
- **Issue:** The 0.x series is end-of-life. Axios 1.x introduced breaking changes but resolved known SSRF-class issues present in `0.x`. Any project using `axios` for server-side requests (proxy, weather API calls) should be on `>=1.x`.
- **Current stable:** `1.7.x`
- **Action:** `yarn upgrade axios@^1.7.0`; test weather-API and any server-side fetch callsites.

### WARNING — `react-query ^3.39.3` (two major versions behind)
- **Package:** `react-query` at `^3.39.3`
- **Issue:** TanStack Query v5 is current (v3 is years old). v5 features automatic garbage collection, built-in suspense, and significantly smaller bundle size. Migration has a documented codemods path.
- **Current stable:** `@tanstack/react-query@^5.x`
- **Action:** Planned migration; not urgent if v3 meets current needs, but document as technical debt.

### WARNING — `prettier ^2.7.1` (major version behind)
- **Package:** `prettier` at `^2.7.1`
- **Issue:** Prettier 3.x is current; v2 is no longer receiving updates. v3 drops CJS support and changes some formatting defaults.
- **Action:** `yarn upgrade prettier@^3.x`, re-format codebase once.

### NOTICE — `@anthropic-ai/sdk ^0.32.1` (check for updates)
- **Package:** `@anthropic-ai/sdk` at `^0.32.1`
- **Issue:** The Anthropic SDK releases frequently. Verify `^0.32.1` is current or bump to latest (`^0.38+` as of August 2026) to pick up any model-routing or streaming fixes.
- **Action:** `yarn upgrade @anthropic-ai/sdk` and run smoke test on Story AI flow.

---

## 3. Performance Anomalies

### NOTICE — Monolithic Files (Render & Bundle Risk)

| File | Lines | Size |
|---|---|---|
| `stores/intentionEngine.ts` | ~3,000+ | **307 KB** |
| `About.tsx` | 4,889 | **468 KB** |
| `Logs.tsx` | 4,506 | **218 KB** |
| `SystemProgressWidget.tsx` | 2,513 | **206 KB** |
| `src/server/scheduled-jobs.ts` | 5,633 | — |
| `src/server/routes/api.ts` | 5,617 | — |

- `intentionEngine.ts` is the single largest file in the entire repo at 307 KB. It is imported by `System.tsx`, `Logs.tsx`, `SystemPulseWidget.tsx`, and many others. Any edit triggers a full re-parse of the barrel.
- `About.tsx` (468 KB, 4,889 lines) is the largest component. As a route entry point it loads synchronously and delays Time to Interactive.
- **Recommendation:** Split `intentionEngine.ts` into focused sub-modules (signal bus, pattern evaluators, cohort classifier, jobs). Code-split `About.tsx` and `Logs.tsx` behind `React.lazy()`. The perf fix for `SignalStreamWidget` and `UserMetricsWidget` (PR #95, merged 2026-07-28) is a template for the approach.

### NOTICE — `SystemPulseWidget` Polls When Tab Is Hidden (Pattern)
- **File:** `src/client/components/SystemPulseWidget.tsx:91-107`
- **Current:** 10-second interval, guarded by `document.hidden` check inside `setInterval`. The guard correctly skips the fetch, but the interval still ticks and evaluates the guard 6× per minute.
- **Best practice:** Use `visibilitychange` event to pause/resume the interval entirely, eliminating all dead ticks.
- **Impact:** Low — 6 noop evaluations/min per user. Relevant when System tab is backgrounded for extended periods.

### NOTICE — WidgetErrorBoundary Mount Timing in Production
- **File:** `src/client/components/ui/WidgetErrorBoundary.tsx:43-49`
- **Current:** Warns when `elapsed > 50ms` in `componentDidMount`. The 50ms threshold is correct for development but may flood production logs under cold-start conditions (e.g., after weekly rebuild or deploy).
- **Suggestion:** Gate the console warning behind `process.env.NODE_ENV !== 'production'` or increase threshold to 200ms for production.

---

## 4. Resolved Items (Since Last Check)

| Date | Item | Status |
|---|---|---|
| 2026-08-05 | PR #96 merged — `QuantumEngineWidgets` | ✓ Shipped |
| 2026-08-05 | PR #95 merged — `memoize SignalStreamWidget + UserMetricsWidget` (perf) | ✓ Shipped |
| 2026-08-05 | BENCHMARK v32 — Hero's Journey Codex (+93 badges, 719→812) | ✓ Committed |
| 2026-08-05 | LOT-WIKI-v87 — FM v113 sync · QIE v113 full documentation | ✓ Committed |
| 2026-08-04 | BENCHMARK QIE v113 — P149 QPCRYST · P150 TOTCOH · P151 RECINTEL · Arch51 · J48 | ✓ Committed |
| 2026-08-04 | BENCHMARK Badge v31 — Cyberspace Codex +31 badges (750→781) | ✓ Committed |
| 2026-08-03 | LOT-WIKI-v85/v86 — Circadian Architecture Doctrine complete | ✓ Committed |
| 2026-08-03 | BENCHMARK QIE v112 — Signal Coherence Cascade (P146–P148 · Arch50 · J47) | ✓ Committed |
| 2026-08-03 | CODEX v30 — The Codex Reader · 750 badges · Sci-Fi Literature Word Turn Engine | ✓ Committed |

---

## 5. Component Quality Assessment

### System Architecture (LOT QIE Engine) — Grade: A−

The QIE architecture is sophisticated and consistently structured. The `WidgetErrorBoundary` pattern with per-widget mount timing is top-tier defensive engineering. `LazyMount` (viewport-deferred subscriptions) is correctly implemented in `System.tsx:86-93`. The `useEvolutionSync` hook, `$layoutDensity` density store, and memoization discipline in `System.tsx` are all sound.

**Areas to elevate:**

| Component | Issue | Fix |
|---|---|---|
| `StatusPage.tsx` | `getStatusIcon()` uses `'✓'` / `'✕'` text characters instead of proper accessible icons | Replace with `<svg aria-hidden>` or `role="img" aria-label` |
| `StatusPage.tsx` | `formatDate()` duplicates `dayjs` formatting already used throughout app | Use `dayjs(dateString).format(DATE_TIME_FORMAT)` for consistency |
| `System.tsx:832-877` | `SelfCareMoments` visibility IIFE calls `localStorage` on every render cycle | Lift to `useMemo` or `useRef` — avoid re-reading storage per render |
| `System.tsx:882-918` | Intentions IIFE uses `Math.random()` for cooldown period — introduces non-determinism on every render | Pre-compute once in `useState` initializer or `useMemo` |
| `System.tsx:940-942` | `Math.random() < 0.2` for Subscribe widget — re-evaluated on every render | Move to `useState(() => Math.random() < 0.2)` |
| `Button.tsx` | `isButton()` detection is heuristic (checks `type === 'submit'` then `href`) — does not handle `<button>` elements with no onClick (e.g., form submit by proximity) | Acceptable for current use but document the contract |
| `CalendarWidget.tsx` | No delete/edit path for existing entries; entries are append-only in the log model | Out of scope but flagged as UX gap |
| `WidgetErrorBoundary.tsx` | `componentDidMount` timing logged to `window.__LOT_WIDGET_PERF__` in production | Gate behind `process.env.NODE_ENV !== 'production'` |

### CI/CD — Grade: A

- `benchmark-tag-lattice.yml` correctly uses `contents: write` and handles duplicate-tag deduplication. Solid rollback-lattice infrastructure.
- `weekly-rebuild.yml` is cleanly structured with `doctl` and validates the final phase. The 15-minute timeout is appropriate.
- No type-checking or test CI step exists — the build succeeds if esbuild + tsc emit without error, but runtime regressions have no automated catch. **Recommended:** add a `tsc --noEmit` check to the benchmark workflow.

### Dependency Health Summary

| Package | Current | Latest | Action |
|---|---|---|---|
| `axios` | `^0.27.2` | `^1.7.x` | **Upgrade — EOL** |
| `react-query` | `^3.39.3` | `^5.x` | Planned migration |
| `prettier` | `^2.7.1` | `^3.x` | Upgrade |
| `@anthropic-ai/sdk` | `^0.32.1` | `^0.38+` | Verify / bump |
| `react` | `^18.2.0` | `^18.3.x` | Minor bump available |
| `tailwindcss` | `^3.1.6` | `^3.4.x` | Patch bump available (v4 is major) |
| `fastify` | `^5.6.1` | Current | ✓ OK |
| `zod` | `^3.23.8` | Current | ✓ OK |
| `dayjs` | `^1.11.10` | Current | ✓ OK |
| `sequelize` | `^6.29.0` | Current | ✓ OK |

---

## 6. All-Systems Status Matrix

| System | Status | Notes |
|---|---|---|
| Production server | ✓ Operational | DO App Platform nyc3; basic-xs |
| Health endpoint `/api/public/status` | ✓ OK | 9-check, 2-min cache |
| `/health` (DO probe) | ✓ OK | 30s initial delay |
| Database (PostgreSQL) | ✓ OK | Sequelize v6, 21 migrations applied |
| Story AI (Anthropic) | ✓ OK | `ANTHROPIC_API_KEY` present |
| Email (Resend v6) | ✓ OK | `RESEND_API_KEY` present |
| Weather API | ✓ OK | Called in Engine stack check |
| PWA / Service Worker | ✓ OK | `public/manifest.webmanifest` present |
| Weekly Rebuild CI | ✓ Scheduled | Sundays 21:00 UTC |
| Benchmark Tag CI | ✓ Active | Fires on every master push |
| QIE Engine | ✓ Active | FM v113 · 151P · 51A · 48J · 812 badges |
| Open PRs | ⚠ 1 open | PR #93 — merge conflict |
| Open Issues | ✓ None | Zero open issues |
| `dashboard.ts` monitoring | ✗ Broken | Missing `blessed` dep |

---

## Recommended Actions (Priority Order)

1. **Resolve PR #93 merge conflict** — merge `master` into `claude/dreamy-babbage-4iv1xo`, resolve, push. Calendar time-tracking is a user-facing feature blocked for 12+ days.
2. **Upgrade `axios` to v1.x** — EOL 0.x with known vulnerability class.
3. **Fix `dashboard.ts`** — add `blessed`/`blessed-contrib` to devDeps or replace with a `chalk`-based implementation that has no missing deps.
4. **Delete `src/client/entries/login.tsx.backup`** — clean source tree.
5. **Fix three `Math.random()` renders** in `System.tsx` — pre-compute in state initializers.
6. **Upgrade `prettier` to v3** — unblock formatting consistency.
7. **Gate `WidgetErrorBoundary` perf logging** behind `NODE_ENV !== 'production'`.
8. **Add `tsc --noEmit` to CI** — catch TypeScript errors pre-merge.

---

*Report generated: 2026-08-09 UTC — LOT-Systems Health Monitor · Automated*
*Field Manual: v113 · QIE: v113 · Badge Universe: 812 · Day 1077+*
