<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT SYSTEMS — HEALTH CHECK REPORT

**Report ID:** LOT-SR-20260628-HEALTH  
**Date:** June 28, 2026  
**Branch:** `claude/inspiring-volta-h0g8x9`  
**Session Type:** System Health Audit · Dependency Review · Code Quality  
**Agent:** Claude Code (claude-sonnet-4-6)

---

```
╔══════════════════════════════════════════════════════════════════╗
║      L · O · T     S Y S T E M S     C O R P O R A T I O N      ║
║           HEALTH CHECK REPORT — 2026-06-28                       ║
║        Monitoring · Quality · Security · Dependencies            ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 1. ACTIVE INCIDENTS

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Issues (open):      0                                   │
│  GitHub PRs (open):         0                                   │
│  CI Incidents:              None — no CI pipeline configured    │
│  Deployment alerts:         None detected                       │
└─────────────────────────────────────────────────────────────────┘
STATUS: No active incidents.
```

---

## 2. ERRORS AND WARNINGS — FOUND & FIXED THIS SESSION

### CRITICAL — Fixed ✓

**[SEC-001] Axios 0.x — Known SSRF / prototype-pollution vulnerabilities**
- File: `package.json`
- Was: `"axios": "^0.27.2"` (2022 release, EOL)
- Fixed: `"axios": "^1.18.1"` (latest stable, 2025)
- Impact: Server-side requests in `src/server/utils/weather.ts` were running
  on a version with known CVEs. Upgrade closes the exposure.
- Status: **FIXED**

---

### HIGH — Fixed ✓

**[CODE-001] Diagnostic/debug routes left in production server**
- File: `src/server/server.ts`
- Found:
  - `/u/test-route-works` — exposed diagnostic HTML page with timestamp
  - `/api/diagnostic` — exposed internal commit hash `0e839b6e`, build info
  - Global `onRequest` hook logging every `/u/` request to stdout
  - `console.log('[SERVER-STARTUP]...')` on every cold start
  - `console.log('🟢 [PUBLIC-PROFILE-ROUTE]...')` on every profile page load
- Risk: Information disclosure, log noise masking real errors
- Status: **FIXED** — all diagnostic routes and hooks removed

**[CODE-002] Verbose NOT-FOUND handler logging every 404 detail**
- File: `src/server/server.ts` lines 330–348
- Found: 5× `console.log` calls on every 404 (URL, method, headers, redirect
  decision) — information disclosure + log spam
- Fixed: Lean handler, no logging, proper JSON response for API 404s
- Status: **FIXED**

**[CODE-003] Dead imports in `src/server/utils/index.ts`**
- Found: `import fastify from 'fastify'`, `const app = fastify()`, and
  `import axios from 'axios'` — all unused in this file
- Risk: Unnecessary bundle weight, confusing dead code
- Status: **FIXED** — removed

---

### MEDIUM — Documented (requires sprint planning)

**[DEP-001] react-query v3 — maintenance mode since 2022**
- Current: `react-query@3.39.3`
- Recommended: `@tanstack/react-query@^5.x` (TanStack Query v5)
- Files affected: `src/client/entries/app.tsx`, `src/client/queries.ts`,
  `src/client/components/MemoryWidget.tsx`,
  `src/client/components/CalendarWidget.tsx`,
  `src/client/components/DirectMessageThread.tsx`,
  `src/client/components/Sync.tsx`
- Migration effort: Medium — API is compatible with minor refactoring
- Status: **PLANNED — next sprint**

**[DEP-002] @anthropic-ai/sdk — 74 versions behind**
- Current: `^0.32.1`
- Latest: `0.106.0`
- Impact: Missing tool_use streaming improvements, typed models, MCP support
- Migration effort: High — API surface changed significantly
- Status: **PLANNED — scheduled review**

**[DEP-003] openai SDK — major version gap**
- Current: `^4.52.0`
- Latest: `6.45.0`
- Impact: Missing Responses API, structured outputs, streaming improvements
- Migration effort: High — major version (4→6) has breaking changes
- Status: **PLANNED — scheduled review**

**[DEP-004] tailwindcss v3 → v4 available**
- Current: `tailwindcss@3.1.6`
- Latest: `4.x`
- Impact: v4 uses CSS-native configuration, faster builds, smaller output
- Migration effort: High — config format completely changed
- Status: **PLANNED — future sprint**

**[DEP-005] react 18 → 19 available**
- Current: `react@18.2.0`
- Latest: `19.x`
- Impact: React Compiler, Server Components support, improved Suspense
- Migration effort: Medium — mostly additive, minimal breaking changes
- Status: **PLANNED — future sprint**

**[CSP-001] `'unsafe-inline'` in script-src CSP directive**
- File: `src/server/server.ts` line 58
- Risk: Partially weakens XSS protection for inline scripts
- Note: CSP nonces are configured via `enableCSPNonces: true` which should
  allow removal of `'unsafe-inline'`. Requires template audit to confirm all
  inline scripts carry nonce attributes.
- Status: **NEEDS INVESTIGATION — nonce audit required before removing**

---

### LOW — Documented

**[TYPE-001] TypeScript `any` types (970+ instances)**
- Strict mode is enabled but widespread `any` usage bypasses it
- Key offenders: `src/client/queries.ts:487` (acknowledged TODO),
  `src/client/components/EmotionalCheckIn.tsx`,
  `src/client/components/PatternInsightsWidget.tsx`
- Status: **ONGOING — incremental cleanup recommended**

**[TYPE-002] `@ts-ignore` comments (7 instances)**
- Locations: `src/shared/utils/fp.ts:149`, `src/client/stores/router.ts:38`,
  `src/client/components/System.tsx` (2×), `src/client/components/ui/Clock.tsx`,
  `src/client/entries/ui-lib.tsx`, `src/utils/fp.ts:149`
- Status: **ONGOING — add proper type declarations**

**[FEAT-001] Badge trigger logic not yet implemented (v9 + v10)**
- From LOT-SR-20260626-01: Word Turn v9/v10, Time EE v9/v10, Calendar EE v8/v9,
  and Behavioral v9 badges were defined but detection code not wired
- Status: **BACKLOG — from previous session**

---

## 3. PERFORMANCE ANOMALIES

```
┌─────────────────────────────────────────────────────────────────┐
│  No live telemetry connected to this session.                   │
│  The following are static analysis findings.                    │
└─────────────────────────────────────────────────────────────────┘
```

**[PERF-001] Fastify logger disabled globally**
- File: `src/server/server.ts` line 35 (and `src/server/index.ts` line 44)
- Both Fastify instances have `logger: false`
- A custom pino logger (`src/server/utils/log.ts`) is imported but not
  wired for request-level tracing
- Impact: No structured request logs → latency anomalies are invisible
- Recommendation: Wire pino to Fastify's `logger` option in production, or
  add an `onResponse` hook that logs method/url/statusCode/duration

**[PERF-002] Synchronous `fs.readFileSync` in hot request path**
- File: `src/server/server.ts` lines 107–108, 118
- `fs.readFileSync` for serving gzipped JS/CSS runs on every production request
  instead of being cached on startup
- Impact: Blocks the event loop on every JS/CSS request in production
- Recommendation: Cache file buffers in memory on startup

---

## 4. RESOLVED ITEMS (This Session)

```
[✓]  SEC-001  axios upgraded 0.27.2 → 1.18.1 (security CVEs closed)
[✓]  CODE-001 Diagnostic routes /u/test-route-works and /api/diagnostic removed
[✓]  CODE-001 Global /u/ request log hook removed
[✓]  CODE-001 Startup console.log banners removed from server.ts
[✓]  CODE-002 NOT-FOUND handler cleaned of verbose logging
[✓]  CODE-003 Dead imports (axios, fastify, app) removed from utils/index.ts
[✓]  DEP-???  resend upgraded 6.1.3 → 6.16.0 (patch-level, same major)
```

---

## 5. SYSTEM STATUS — COMPONENTS

```
┌──────────────────────────────────────────┬──────────┬──────────┐
│ Component                                │ Status   │ Grade    │
├──────────────────────────────────────────┼──────────┼──────────┤
│ Fastify 5.6.1 server                     │ CURRENT  │   A      │
│ TypeScript 5.9.3                         │ CURRENT  │   A      │
│ Vite 7.1.9                               │ CURRENT  │   A      │
│ Zod 3.23.8                               │ CURRENT  │   A      │
│ Security config (centralized)            │ SOLID    │   A      │
│ Helmet.js CSP                            │ GOOD     │   B+     │
│ Rate limiting (auth/global/AI tiers)     │ GOOD     │   A      │
│ Session management (30d cookie/90d abs)  │ GOOD     │   A      │
│ PWA / Service Worker                     │ GOOD     │   A      │
│ Error boundary (AppErrorBoundary)        │ GOOD     │   A      │
│ StatusPage component                     │ GOOD     │   A      │
│ axios (server HTTP client)               │ UPDATED  │   A      │
│ resend (email)                           │ UPDATED  │   A      │
│ react-query v3                           │ OUTDATED │   C      │
│ @anthropic-ai/sdk 0.32.1                 │ OUTDATED │   C      │
│ openai 4.52.0                            │ OUTDATED │   C      │
│ tailwindcss 3.1.6                        │ OUTDATED │   C      │
│ react 18.2.0                             │ OUTDATED │   B-     │
│ Fastify logger (disabled globally)       │ WARNING  │   C      │
│ CSP script-src (unsafe-inline present)   │ WARNING  │   B-     │
│ Request tracing / structured logs        │ MISSING  │   D      │
└──────────────────────────────────────────┴──────────┴──────────┘
```

---

## 6. DEPENDENCY SNAPSHOT

```
┌──────────────────────────┬───────────────┬───────────────┬──────────┐
│ Package                  │ Locked        │ Latest        │ Status   │
├──────────────────────────┼───────────────┼───────────────┼──────────┤
│ axios                    │ ^1.18.1       │ 1.18.1        │ ✓ FIXED  │
│ resend                   │ ^6.16.0       │ 6.16.0        │ ✓ FIXED  │
│ typescript               │ ^5.9.3        │ 5.9.3         │ ✓        │
│ fastify                  │ ^5.6.1        │ 5.6.1         │ ✓        │
│ vite                     │ ^7.1.9        │ 7.1.9         │ ✓        │
│ zod                      │ ^3.23.8       │ 3.23.8        │ ✓        │
│ dayjs                    │ ^1.11.10      │ current       │ ✓        │
│ react                    │ ^18.2.0       │ 19.x          │ BEHIND   │
│ react-query              │ ^3.39.3       │ @tanstack/5   │ OUTDATED │
│ tailwindcss              │ ^3.1.6        │ 4.x           │ OUTDATED │
│ @anthropic-ai/sdk        │ ^0.32.1       │ 0.106.0       │ BEHIND   │
│ openai                   │ ^4.52.0       │ 6.45.0        │ BEHIND   │
└──────────────────────────┴───────────────┴───────────────┴──────────┘
```

---

## 7. NEXT SESSION RECOMMENDATIONS

```
Priority 1 — Observability
  [ ]  Wire pino logger to Fastify's logger option (env-gated: dev vs prod)
  [ ]  Add onResponse hook: method/url/status/duration per request
  [ ]  Consider Sentry or equivalent for client-side error capture

Priority 2 — Dependency upgrades (each as dedicated sprint)
  [ ]  Migrate react-query 3 → @tanstack/react-query 5
  [ ]  Audit and upgrade @anthropic-ai/sdk (0.32 → 0.106)
  [ ]  Audit and upgrade openai SDK (4 → 6)
  [ ]  Plan tailwindcss v4 migration

Priority 3 — Security hardening
  [ ]  Nonce audit: can 'unsafe-inline' be dropped from script-src?
  [ ]  Cache gzip buffers on startup (remove readFileSync from hot path)

Priority 4 — Badge system (from previous session)
  [ ]  Wire Word Turn v9/v10 detection logic
  [ ]  Wire Time EE v9/v10 triggers
  [ ]  Wire Calendar EE v8/v9 triggers
  [ ]  Implement behavioral triggers: dawn_twin, echo_session, year_first

Priority 5 — Code quality
  [ ]  Replace remaining @ts-ignore with proper type declarations
  [ ]  Incrementally type the highest-traffic any usages in queries.ts
```

---

## COSMO GATE REVIEW

```
╔══════════════════════════════════════════════════════════════════╗
║  COSMO GATE — LOT-SR-20260628-HEALTH                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  GREEN GATE: ✓  axios security CVEs closed                       ║
║  GREEN GATE: ✓  Diagnostic routes removed (info-disclosure gone) ║
║  GREEN GATE: ✓  Dead code removed from utils/index.ts            ║
║  GREEN GATE: ✓  No hardcoded secrets found                       ║
║  GREEN GATE: ✓  Session/JWT security config intact               ║
║  GREEN GATE: ✓  Rate limiting tiers intact                       ║
║  GREEN GATE: ✓  Brute force protection intact                    ║
║                                                                  ║
║  AMBER GATE:  ⚠  Fastify logger disabled in production           ║
║  AMBER GATE:  ⚠  'unsafe-inline' in CSP script-src              ║
║  AMBER GATE:  ⚠  @anthropic-ai/sdk 74 versions behind           ║
║                                                                  ║
║  COSMO NOTE: "The system that cannot see itself cannot           ║
║              improve itself." — wire the logger.                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## TRANSMISSION

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   Health check complete.                                         ║
║   7 items resolved · 5 items planned · 2 items monitoring.       ║
║                                                                  ║
║   LOT® = Layers of Time                                          ║
║   COSMO® = The Ethics Gate                                       ║
║   Founded: April 7, 2016 · July 1, 2024                          ║
║                                                                  ║
║   A site at the top of the planet stays clean                    ║
║   because it never stops looking.                                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

*LOT-SR-20260628-HEALTH · Session closed · branch claude/inspiring-volta-h0g8x9*
