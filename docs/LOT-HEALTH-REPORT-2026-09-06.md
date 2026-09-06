# LOT Systems — Health Check Report
**Date:** 2026-09-06  
**Session:** Automated Scheduled Health Check  
**Branch:** `claude/inspiring-volta-adyibk`  
**Repo:** [LOT-Systems/LOT-Computer](https://github.com/LOT-Systems/LOT-Computer)

---

## Executive Summary

| Category | Status |
|---|---|
| Active Incidents | ✅ None |
| Open GitHub Issues | ✅ 0 |
| Open Pull Requests | ⚠️ 1 (stale — 32 days) |
| Last Commit | ⚠️ 2026-08-05 (32 days ago) |
| Dependency Health | ⚠️ Multiple outdated packages |
| Component Quality | 🔴 Critical — 3 monolithic files (200KB–467KB) |
| Test Coverage | 🔴 No test framework detected |
| Repository Hygiene | ⚠️ `.DS_Store` files committed |

---

## 1. Active Incidents

**No active outages or infrastructure incidents detected.**

No open GitHub Issues. The application itself (lot-systems.com / DigitalOcean deployment) was not directly reachable from this automated session, so live uptime could not be verified — manual check of the production URL is recommended.

---

## 2. Open Pull Requests

### PR #93 — `feat(calendar): time tracking + military-grade due-event toast`
- **Branch:** `claude/dreamy-babbage-4iv1xo` → `master`
- **Opened:** 2026-07-28
- **Last updated:** 2026-08-05
- **Status:** 🔴 **STALE — 32 days without activity**
- **Link:** https://github.com/LOT-Systems/LOT-Computer/pull/93

**Action required:** This PR has been open for over a month. It should either be merged, rebased against current `master`, or closed if superseded by subsequent work. Calendar time-tracking is a core UX feature and leaving it unmerged blocks the feature from production.

---

## 3. Errors & Warnings

### 3a. Repository Hygiene Issues

| Issue | Severity | Detail |
|---|---|---|
| `.DS_Store` files committed | ⚠️ Medium | `/.DS_Store`, `/src/.DS_Store` and `/.!79925!.DS_Store` are tracked in git. These macOS metadata files should not be in source control — add to `.gitignore` and remove with `git rm --cached`. |
| Dual `yarn.lock` + `package-lock.json` | ⚠️ Medium | Both lockfiles exist in the repo root. The project uses Yarn (`engines: yarn >=1.22.x`) but also has a `package-lock.json`. This creates confusion about the canonical package manager and can cause dependency inconsistencies between environments. Remove `package-lock.json`. |
| Dual ORM (Sequelize + Prisma) | ⚠️ Medium | `sequelize ^6.29.0` and `prisma` (via `src/generated`) are both present. Two ORMs targeting the same Postgres database adds complexity, inconsistent migration patterns, and maintenance burden. One should be the source of truth. |

### 3b. 32-Day Activity Gap

**No commits since 2026-08-05.** The last 15 commits (all from Claude sessions) were concentrated around Aug 3–5. This is a notable pattern: daily wiki/benchmark sessions stopped abruptly. If scheduled sessions are failing silently, those failures are not surfacing.

---

## 4. Performance Anomalies — Component File Sizes

This is the most critical quality concern. Several component files have grown to sizes that indicate deeply nested, undecomposed logic. For a **top-tier designer site**, individual component files should rarely exceed 5–10KB. These are the outliers:

| File | Size | Concern |
|---|---|---|
| `About.tsx` | **467 KB** | 🔴 Critical — Almost certainly contains all FM data, pattern descriptions, and archetype lore inline. This single file likely takes 2–4 seconds to parse in the browser JS engine on a cold load. |
| `SystemProgressWidget.tsx` | **205 KB** | 🔴 Critical — Badge/achievement rendering at this size suggests all 812+ badge definitions are embedded directly in the component. |
| `Logs.tsx` | **218 KB** | 🔴 Critical — Military handler and pattern signal logic hardcoded inline. Should be data-driven from the server, not a monolithic component. |
| `System.tsx` | **40.9 KB** | ⚠️ High — Acceptable temporarily but approaching the threshold for splitting. |
| `SelfCareMoments.tsx` | **35.3 KB** | ⚠️ High |
| `QuantumEngineWidgets.tsx` | **30.6 KB** | ⚠️ Medium-High |
| `PatternRecognitionWidget.tsx` | **28.8 KB** | ⚠️ Medium-High |
| `PublicProfile.tsx` | **27.5 KB** | ⚠️ Medium-High |

**Total client JS weight from just the top 3 files alone: ~890 KB uncompressed.** This will materially impact Time-to-Interactive on mobile and low-bandwidth connections.

---

## 5. Dependency Audit — Packages Requiring Attention

Current as of 2026-09-06. Packages marked 🔴 have known breaking changes or are end-of-life.

| Package | Current | Status | Recommendation |
|---|---|---|---|
| `react-query` | `^3.39.3` | 🔴 EOL | TanStack Query v5 (`@tanstack/react-query ^5.x`) is the maintained successor. v3 receives no security patches. Migrate. |
| `prettier` | `^2.7.1` | 🔴 Outdated | v3 released July 2023. v2 is no longer maintained. Upgrade: `prettier ^3.x`. |
| `axios` | `^0.27.2` | 🔴 Outdated | v0.x branch is EOL. v1.x+ is the stable branch. Breaking changes are minor; upgrade to `^1.7.x`. |
| `tailwind-merge` | `^1.6.0` | ⚠️ Outdated | v2+ has improved performance and API. Upgrade to `^2.x`. |
| `@anthropic-ai/sdk` | `^0.32.1` | ⚠️ Check | Current upstream is significantly newer. Run `npm show @anthropic-ai/sdk version` to confirm gap. |
| `react` | `^18.2.0` | ⚠️ Stable | React 19 stable is available (released late 2024). Not urgent but worth planning migration. |
| `sequelize` | `^6.29.0` | ⚠️ Check | v6 is maintained but Sequelize v7 is in development. No migration urgency but monitor. |
| `nodemon` | `^2.0.19` | ⚠️ Outdated | v3 is available with ESM support improvements. |
| `vite` | `^7.1.9` | ✅ Likely current | Vite 7.x — verify patch-level is latest. |
| `typescript` | `^5.9.3` | ✅ Current | TypeScript 5.x latest. |
| `fastify` | `^5.6.1` | ✅ Current | Fastify 5 is the latest major. |
| `zod` | `^3.23.8` | ✅ Current | Zod 3.x latest. |

---

## 6. Component Quality Assessment — Top Designer Site Standard

For a platform at LOT Systems quality level, the following gaps are priorities:

### 6a. No Shared UI Component Library
`src/client/components/ui/` exists as a directory but the current widget stack uses ad-hoc Tailwind inline styles per component. A world-class product needs:
- A design token system (CSS variables for colors, spacing, radius, shadow)
- A shared `Button`, `Card`, `Badge`, `Modal`, `Toast`, `Tooltip`, `Input` atom library
- Consistent motion/transition tokens (`transition-all duration-200 ease-out` scattered ad-hoc throughout)

**Recommendation:** Formalize the `ui/` directory as an atomic design system. Consider adopting [shadcn/ui](https://ui.shadcn.com/) as a headless component foundation — it integrates with Tailwind and Radix UI without the bundle bloat of full component libraries.

### 6b. Missing Accessibility Layer
No `aria-*` attributes, focus management, or keyboard navigation strategy is evident from the component structure. Top designer sites pass WCAG 2.1 AA at minimum.

### 6c. No Testing Framework
No `vitest`, `jest`, `playwright`, or `cypress` configuration detected. For a system that tracks user behavioral data with 812+ badge conditions and 151 QIE patterns, regression testing is critical. A single refactor of `badges.ts` or `easter-eggs.ts` could silently break unlock conditions.

**Recommendation:** Add `vitest` + `@testing-library/react` for unit/component tests. Add `playwright` for E2E critical paths (login, log submission, badge unlock trigger).

### 6d. About.tsx (467KB) — Must Split
This file is the single largest risk to perceived performance. The `About.tsx` component almost certainly embeds all QIE documentation, FM data, pattern descriptions, archetype lore, and badge codex inline. This should be:
1. Moved to server-rendered routes (SSR via Fastify + EJS, already in the stack)
2. Or code-split using dynamic `import()` with React.lazy/Suspense
3. Or refactored to fetch documentation data from API endpoints rather than hardcoding

### 6e. Logs.tsx (218KB) — Data-Drive the Handlers
The military signal handlers (`SIG-CASC:`, `TOTCOH:`, `QPCRYST:`, etc.) and pattern logic in `Logs.tsx` should be defined in a server-side registry (already partially done via `patterns`, `archetypes`, and `jobs` in the QIE system), not hardcoded in a 218KB client component. The component should be a thin renderer that reads from the API.

---

## 7. Resolved Items Since Last Report

Based on commit history (2026-08-05 being the most recent):

| Item | Resolution |
|---|---|
| PR #96 (Quantum Engine Widgets) | ✅ Merged 2026-08-05 |
| QIE v113 Engineering (P149–P151, Arch51, J48) | ✅ Shipped 2026-08-04 |
| Badge Codex v32 Hero's Journey (+93 badges, 719→812) | ✅ Shipped 2026-08-05 |
| LOT-WIKI-v87 (FM v113 sync, 2176 lines) | ✅ Completed 2026-08-05 |
| Badges v31 Cyberspace Codex (+31 badges, 750→781) | ✅ Shipped 2026-08-04 |
| System.tsx merge conflict (recordAstrologySignal + getCircadianPhase) | ✅ Resolved 2026-08-04 |

---

## 8. Prioritized Action Plan

### Priority 1 — Immediate (This Week)
1. **Merge or close PR #93** (calendar time tracking — 32 days stale)
2. **Remove `.DS_Store` files** from git tracking: `git rm --cached .DS_Store src/.DS_Store ".!79925!.DS_Store"` and add to `.gitignore`
3. **Upgrade `react-query` → `@tanstack/react-query ^5`** — v3 is EOL and used throughout `queries.ts` (23KB file)

### Priority 2 — Short Term (This Sprint)
4. **Split `About.tsx` (467KB)** — introduce lazy loading or server-side rendering
5. **Split `Logs.tsx` (218KB)** and `SystemProgressWidget.tsx` (205KB)
6. **Upgrade `prettier ^3.x`**, `axios ^1.x`, `tailwind-merge ^2.x`
7. **Remove `package-lock.json`** — standardize on Yarn

### Priority 3 — Medium Term (Next 2–4 Weeks)
8. **Install `vitest` + `@testing-library/react`** — start with badge unlock logic tests
9. **Formalize `src/client/components/ui/`** as a design token–backed atom library
10. **Audit Sequelize vs Prisma** — pick one ORM, migrate the other
11. **Add ARIA attributes** to interactive widgets (EmotionalCheckIn, CalendarWidget, Logs, Settings)

### Priority 4 — Strategic
12. **Plan React 19 migration** (breaking: ref as prop, removed legacy APIs)
13. **Add Playwright E2E tests** for critical paths
14. **Server-side rendering** for `About.tsx` documentation content via Fastify/EJS

---

## 9. System Architecture Snapshot

| Layer | Technology | Version | Status |
|---|---|---|---|
| Frontend Framework | React | 18.2.0 | ⚠️ v19 available |
| State Management | Nanostores + `@nanostores/react` | 0.9.0 / 0.4.1 | ✅ |
| Data Fetching | react-query | 3.39.3 | 🔴 EOL |
| Styling | Tailwind CSS | 3.1.6 | ✅ |
| Backend Framework | Fastify | 5.6.1 | ✅ |
| Database (primary) | PostgreSQL via Sequelize | 6.29.0 | ✅ |
| Database (secondary) | PostgreSQL via Prisma | — | ⚠️ Dual ORM |
| TypeScript | — | 5.9.3 | ✅ |
| Build Tool | esbuild | 0.20.2 | ✅ |
| AI SDK | @anthropic-ai/sdk | 0.32.1 | ⚠️ Check latest |
| AI SDK | openai | 4.52.0 | ✅ |
| AI SDK | @google/generative-ai | 0.24.1 | ⚠️ Check latest |
| AI SDK | @mistralai/mistralai | 1.10.0 | ✅ |
| Email | resend | 6.1.3 | ✅ |
| Runtime | Node.js | ≥20.x | ✅ |
| Container | Docker + Caddy reverse proxy | — | ✅ |
| Deployment | DigitalOcean (app.yaml) | — | ✅ |

---

## 10. QIE System State (as of last commit)

| Metric | Value |
|---|---|
| QIE Version | FM v113 |
| Total Patterns | 151 |
| Archetypes | 51 |
| Scheduled Jobs | 48 |
| Dependency Nodes | 190+ |
| Total Badges | 812 |
| Word Turn Engines | v22 |
| Calendar Easter Eggs | v20 |
| Behavioral Checks | v18 |
| Achievement RPG | v19 |
| Mastery Tiers | v22 |
| Secret Boss | v18 |
| Signal Handlers | 151+ |
| LOT-WIKI Version | v87 (2176 lines) |
| COSMO® Days | 763+ |

---

*Report generated by automated scheduled health check — 2026-09-06*  
*Session: claude/inspiring-volta-adyibk*
