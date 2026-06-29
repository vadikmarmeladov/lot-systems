================================================================================
LOT SYSTEMS — AUTOMATED HEALTH CHECK REPORT
DOCUMENT: LOT-HEALTH-20260629
DATE:     2026-06-29 12:07 UTC
CLASS:    ROUTINE // AUTOMATED MONITOR
S-2:      VADIM MARMELADOV
SCOPE:    GitHub CI · Codebase · Dependencies · Components
================================================================================

---

## EXECUTIVE SUMMARY

> **All primary systems nominal.** No open incidents. CI is GREEN (2 consecutive
> weekly rebuilds passed). Heavy fix cycle this week — 6 commits in 48h — all
> targeting and resolving known regressions. Three dependency-level advisories
> flagged below; none are production-blocking.

---

## 1. ACTIVE INCIDENTS

| # | Service | Severity | Status |
|---|---------|----------|--------|
| — | — | — | **No active incidents** |

- **GitHub Issues**: 0 open
- **GitHub PRs**: 0 open
- **DigitalOcean App**: Healthy (last confirmed by Weekly Rebuild CI — Jun 28 ✅)
- **Health endpoint**: `/health` → `{ status: "ok" }` (DigitalOcean-verified, 30s init delay)

---

## 2. ERRORS & WARNINGS

### ⚠️ W-01 — TypeScript 6.0 Server Config Deprecations (LOW)

| Field | Detail |
|-------|--------|
| **File** | `tsconfig.server.json` |
| **TS 6.0 warnings** | `moduleResolution: "node"` (now called `node10`) and `baseUrl` are deprecated |
| **Will break in** | TypeScript 7.0 (not yet released) |
| **Current impact** | **Zero** — production build uses TS `5.9.3` from local `node_modules` (pinned via `package.json`). Build is green. |
| **System global TS** | 6.0.2 — shows deprecation errors when `tsc` is run without `node_modules` installed |

**Recommended fix** (when upgrading TS or before TS 7.0):
1. Add explicit `"types"` array to `tsconfig.server.json` (mirror what root `tsconfig.json` has)
2. Add `"ignoreDeprecations": "6.0"` to silence warnings
3. Or migrate `moduleResolution` to `"bundler"` + remove `baseUrl` entirely

> **Do not apply `ignoreDeprecations` without also adding the `types` array** — TS 6.0 semantics change ambient type discovery behavior.

---

### ⚠️ W-02 — axios 0.27.2 — Major Version Lag (MEDIUM)

| Field | Detail |
|-------|--------|
| **Current** | `axios: ^0.27.2` (2022) |
| **Latest** | `1.9.x` (2025) |
| **Gap** | Major version behind — 3 years of patches, security fixes, proxy improvements |
| **CVE risk** | No known critical CVEs for this specific use case, but 0.x is unmaintained |
| **Files affected** | `src/server/utils/weather.ts` (HTTP calls to weather API) |

**Recommended fix**: Upgrade to `axios: ^1.9.0` — breaking changes are in headers casing and `formData` handling. Test weather API route after upgrade.

---

### ℹ️ W-03 — react-query v3 Legacy Package (LOW/INFORMATIONAL)

| Field | Detail |
|-------|--------|
| **Current** | `react-query: ^3.39.3` |
| **Current ecosystem** | `@tanstack/react-query` v5 |
| **Status** | v3 is functional but no longer maintained |
| **Migration cost** | High — API surface changes significantly (v3→v5) |
| **Risk today** | None — works correctly, no security issues |

**Recommended action**: Plan migration to `@tanstack/react-query` v5 as a dedicated sprint — not emergency.

---

### ℹ️ W-04 — tailwindcss 3.1.6 (LOW/INFORMATIONAL)

| Field | Detail |
|-------|--------|
| **Current** | `tailwindcss: ^3.1.6` |
| **Latest 3.x** | `3.4.x` |
| **Missing** | JIT performance improvements, new utilities (`text-balance`, `size-*`, `*:` variant) |
| **Risk** | None — 3.x is fully stable and backward-compatible within major |

**Recommended fix**: `yarn upgrade tailwindcss` — safe within `^3.x` range.

---

## 3. PERFORMANCE ANOMALIES

| Item | Status | Notes |
|------|--------|-------|
| Tab switching lag | ✅ RESOLVED Jun 27 | `React.memo` wrapping on Logs/System/Sync/Settings removed redundant re-renders |
| Tab label jitter | ✅ RESOLVED Jun 27 | `will-change: opacity` added to pre-promote GPU compositor layer before hover |
| Visitor stats perceived latency | ✅ RESOLVED Jun 29 | `localStorage` cache shows stale stats instantly while fresh data loads |
| Sync chat showing only last message | ✅ RESOLVED Jun 27 | SSE + React Query merge pattern; no more race condition on `hasInitiallyLoaded` |

**No unresolved performance regressions detected.**

---

## 4. RESOLVED ITEMS (since last check)

| Date | Commit | Item | Impact |
|------|--------|------|--------|
| Jun 29 | `cfa04bd` | Visitor stats: localStorage cache + fix Sequelize scope in raw SQL | UX — instant stats on reload |
| Jun 29 | `28b1159` | Fix Sync crash — missing `onChangeMessage` callback | Crash prevention |
| Jun 29 | `621ffa0` | Fix visitor stats — raw SQL bypasses Sequelize model scope issues | Data correctness |
| Jun 28 | `118e966` | Fix visitor stats — `countJoined()` + per-promise catch | Resilience |
| Jun 28 | `dc4d98c` | Fix visitor stats returning 0 — `User.count()` + fresh metadata fetch | Data correctness |
| Jun 27 | `1271cd3` | Fix tab label movement + tab switching lag | Performance |
| Jun 27 | `5b88c0f` | Fix `app.yaml` branch — point DO deployment to `master` | Deployment stability |
| Jun 27 | `38499cd` | Fix Sync chat showing only last message | Feature correctness |
| Jun 21 | CI run | Weekly Rebuild GREEN — [#27919181537](https://github.com/LOT-Systems/LOT-Computer/actions/runs/27919181537) | CI health |
| Jun 28 | CI run | Weekly Rebuild GREEN — [#28337473779](https://github.com/LOT-Systems/LOT-Computer/actions/runs/28337473779) | CI health |

> **CI trend note**: 3 consecutive failures (May 31 / Jun 7 / Jun 14) were resolved — Jun 21 and Jun 28 both confirmed green. CI is now stable.

---

## 5. COMPONENT QUALITY ASSESSMENT

### Stack Overview

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Runtime | Node.js | ≥20.x | ✅ Current |
| Server | Fastify | ^5.6.1 | ✅ Current |
| Client | React | ^18.2.0 | ✅ Stable (React 19 exists but not yet widespread) |
| ORM | Sequelize | ^6.29.0 | ✅ Current |
| State | Nanostores | ^0.9.x | ✅ Current |
| Build | esbuild | ^0.20.2 | ⚠️ 0.24.x available — minor drift |
| CSS | Tailwind | ^3.1.6 | ⚠️ 3.4.x available — safe upgrade |
| HTTP client | axios | ^0.27.2 | ❌ 1.9.x available — major lag |
| Data fetching | react-query | ^3.39.3 | ⚠️ Legacy — @tanstack/react-query v5 exists |
| TypeScript | ^5.9.3 | 5.9.3 | ✅ Current (TS 6.0 released, non-urgent upgrade) |
| AI SDK | @anthropic-ai/sdk | ^0.32.1 | ✅ Recent |

---

### Frontend Component Inventory

65+ React components verified present. Recent quality additions:

| Component | Quality Assessment |
|-----------|------------------|
| `Sync.tsx` | ✅ Correct SSE + React Query merge; `useCallback` properly used; no race conditions |
| `System.tsx` | ✅ localStorage cache with defensive try/catch; optimistic UX |
| `Settings.tsx` | ✅ `React.memo` applied — no unnecessary re-renders |
| `Logs.tsx` | ✅ `React.memo` applied |
| Diet widget (in System) | ✅ Context-aware hydration tips; fasting mode handling correct |

---

### Architecture Notes

| Item | Status | Recommendation |
|------|--------|----------------|
| `src/server/routes/api.ts` | ⚠️ ~192KB God-file | Future refactor: split by domain (visitor, weather, memory, chat) |
| `src/server/routes/` structure | ✅ Already has `auth.ts`, `admin-api.ts`, `public-api.ts`, `os-api.ts` | Continue splitting from `api.ts` |
| Security headers | ✅ `@fastify/helmet` + `security-config.ts` | Audited |
| Rate limiting | ✅ `@fastify/rate-limit` | In place |
| JWT auth | ✅ `jsonwebtoken` | Standard |
| Monitoring scripts | ✅ `/scripts/monitoring/` — health check, pool monitor, dashboard | Available for local ops |

---

## 6. CI HISTORY (all runs)

| Date | Run | Result |
|------|-----|--------|
| 2026-06-28 | [Weekly Rebuild #28337473779](https://github.com/LOT-Systems/LOT-Computer/actions/runs/28337473779) | ✅ SUCCESS |
| 2026-06-21 | [Weekly Rebuild #27919181537](https://github.com/LOT-Systems/LOT-Computer/actions/runs/27919181537) | ✅ SUCCESS |
| 2026-06-14 | [Weekly Rebuild #27513664894](https://github.com/LOT-Systems/LOT-Computer/actions/runs/27513664894) | ❌ FAILURE (resolved) |
| 2026-06-07 | [Weekly Rebuild #27106197975](https://github.com/LOT-Systems/LOT-Computer/actions/runs/27106197975) | ❌ FAILURE (resolved) |
| 2026-05-31 | [Weekly Rebuild #26725711844](https://github.com/LOT-Systems/LOT-Computer/actions/runs/26725711844) | ❌ FAILURE (resolved) |

---

## 7. PRIORITIZED ACTION ITEMS

| Priority | Item | Effort |
|----------|------|--------|
| P2 — Plan | Upgrade `axios` to `^1.9.0` | Small sprint — test weather API |
| P3 — Backlog | `tsconfig.server.json` TS 7.0 readiness | 30 min — add `types` array + `ignoreDeprecations` |
| P3 — Backlog | Upgrade `tailwindcss` to `^3.4.x` | 5 min — `yarn upgrade tailwindcss` |
| P3 — Backlog | Upgrade `esbuild` to `^0.24.x` | 5 min — `yarn upgrade esbuild` |
| P4 — Future | Migrate `react-query` → `@tanstack/react-query` v5 | Large sprint |
| P4 — Future | Split `api.ts` (~192KB) into domain modules | Architecture sprint |

---

================================================================================
RESULT:       GREEN — no blocking issues
AUTHORIZED:   Automated Monitor — S-2 LOT Systems
END:          LOT-HEALTH-20260629
================================================================================
