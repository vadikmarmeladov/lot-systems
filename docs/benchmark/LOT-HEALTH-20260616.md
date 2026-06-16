================================================================================
LOT SYSTEMS / HEALTH CHECK REPORT
DOCUMENT: LOT-HEALTH-20260616
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-06-16
TIME:     12:10 UTC
RESULT:   AMBER — 1 CRITICAL, 2 WARNINGS, BUILD GREEN
================================================================================

────────────────────────────────────────────────────────────────────────────────
00 // EXECUTIVE SUMMARY
────────────────────────────────────────────────────────────────────────────────

OVERALL STATUS: AMBER

  CRITICAL   CI pipeline broken — DIGITALOCEAN_ACCESS_TOKEN secret missing (3 consecutive weekly rebuild failures)
  WARNING    Production gzip serving disabled (index.ts, perf impact)
  WARNING    Stale dependency versions in 8 packages
  INFO       server.ts debug artifacts cleaned — 2 diagnostic routes removed, 12 console.log calls replaced
  INFO       0 open GitHub issues | 0 open pull requests
  INFO       Last benchmark: 20260615-01 GREEN — QIE v62 P71-P73

────────────────────────────────────────────────────────────────────────────────
01 // ACTIVE INCIDENTS
────────────────────────────────────────────────────────────────────────────────

  SEVERITY: CRITICAL
  SYSTEM:   GitHub Actions / DigitalOcean Auto-Rebuild
  STATUS:   ONGOING — 3 consecutive failures (3 weeks)
  LINK:     https://github.com/LOT-Systems/LOT-Computer/actions/runs/27513664894

  ROOT CAUSE:
    The weekly-rebuild.yml workflow requires `DIGITALOCEAN_ACCESS_TOKEN` as a
    GitHub Actions secret. The secret is absent from the repository's Actions
    settings. Every Sunday at 21:00 UTC, the workflow fails at the
    `digitalocean/action-doctl@v2` step with:

      ##[error] Input required and not supplied: token

  IMPACT:
    Auto-rebuild on DigitalOcean App Platform is completely broken. Any
    production deploys since this broke have been manual only. No automated
    release pipeline. The DO app itself may still be running on an older build.

  FIRST FAILURE:  2026-05-31T22:01 UTC
  LATEST FAILURE: 2026-06-14T22:12 UTC
  RUNS FAILED:    27513664894 / 27106197975 / 26725711844

  FIX (REQUIRED):
    1. Go to GitHub → Settings → Secrets and variables → Actions
    2. Add secret: DIGITALOCEAN_ACCESS_TOKEN = <your DO personal access token>
    3. Trigger a manual workflow run to verify: Actions → Weekly Rebuild → Run workflow

────────────────────────────────────────────────────────────────────────────────
02 // ERRORS AND WARNINGS
────────────────────────────────────────────────────────────────────────────────

  W1 — PRODUCTION GZIP DISABLED
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ File: src/server/index.ts, lines 141-167                                │
  │ The entire gzip asset-serving block is commented out:                   │
  │   // gzip assets - TEMPORARILY DISABLED FOR TESTING                     │
  │ Production serves uncompressed JS bundles (~2-4× larger payloads).      │
  │ Impact: page load time, bandwidth cost on DO, user perceived perf.       │
  │ Action: Re-enable after confirming .gz files are present in dist/client/ │
  └──────────────────────────────────────────────────────────────────────────┘

  W2 — PEER DEPENDENCY MISMATCHES (yarn install warnings)
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ @nanostores/react@0.4.1 expects nanostores@^0.7.0 (installed: ^0.9.0)  │
  │ @nanostores/router@0.9.1 expects nanostores@^0.8.0 (installed: ^0.9.0) │
  │ @types/react-dom@19.2.2 expects @types/react@^19.2.0 (have: ^18.0.15)  │
  │ Not blocking, but signals version drift.                                 │
  └──────────────────────────────────────────────────────────────────────────┘

  W3 — STALE BROWSERSLIST / CANIUSE DATA
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ "Browserslist data is 8 months old" — fires on every client build.      │
  │ Fix: npx update-browserslist-db@latest (one-time, commit updated pkg)   │
  └──────────────────────────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────────────────────────────
03 // PERFORMANCE ANOMALIES
────────────────────────────────────────────────────────────────────────────────

  P1 — UNCOMPRESSED JS/CSS IN PRODUCTION
    As noted in W1, gzip is disabled. JS bundles ship uncompressed.
    Estimated payload increase: 2-4× on initial page load.
    Caddy (reverse proxy) may apply transparent gzip if configured,
    but relying on that is not guaranteed — re-enable app-level gzip.

  P2 — REACT QUERY v3 (TanStack Query v5 is current)
    react-query@3.39.3 is 2 major versions behind TanStack Query v5.
    v3 uses older cache invalidation patterns. Not an immediate perf
    issue but limits access to stale-while-revalidate improvements and
    the structural sharing optimizations in v4/v5.
    Migration is a significant effort — flag for a dedicated sprint.

────────────────────────────────────────────────────────────────────────────────
04 // RESOLVED ITEMS (this session)
────────────────────────────────────────────────────────────────────────────────

  R1 — server.ts debug artifacts CLEARED  [this session — 20260616]
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ Removed:                                                                 │
  │   /u/test-route-works — diagnostic HTML route (hardcoded success page)  │
  │   /api/diagnostic — route exposing stale commit hash (0e839b6e)         │
  │                                                                          │
  │ Cleaned:                                                                 │
  │   12× console.log → logger.info (structured pino output)               │
  │   Not-found handler stripped of 6 debug prints                          │
  │   Startup: console.log → logger.info                                    │
  │   "Temporarily disable logging for development" comment removed          │
  │                                                                          │
  │ Build: GREEN (8.73s) ✓                                                  │
  └──────────────────────────────────────────────────────────────────────────┘

  R2 — Last security benchmark CLOSED GREEN [20260614-03]
    Production hardening + 503 incident resolved.

  R3 — Cross-device sync bug SHIPPED [bea4cefb]
    SSE sync + Settings crash fix + v1.3.0 version sync — all merged to master.

────────────────────────────────────────────────────────────────────────────────
05 // COMPONENT QUALITY AUDIT
────────────────────────────────────────────────────────────────────────────────

  Codebase: 64 React components in src/client/components/

  CURRENT STATE vs TOP DESIGNER SITE STANDARD:

  ✓ STRONG
  ──────────────────────────────────────────────────────────────────────────
  ConnectionStatus.tsx       Clean reactive design, no flash on initial load,
                             graceful offline banner — top-shelf UX pattern.

  WidgetErrorBoundary.tsx    Exists and is wired — prevents widget crashes
                             from cascading to full-page errors.

  IntegrityWidget.tsx        Sophisticated signal analysis (6 fracture types,
                             timeline + field views). Strong domain logic.

  security-config.ts         Centralized, auditable. Rate limits, brute force,
                             session lifetimes all in one file — correct
                             architecture for a top designer site.

  index.ts (server)          Fastify 5.x + Helmet CSP nonces + rate limiting +
                             vulnerability scan detection + session expiry
                             enforcement — production-hardened.

  ✗ GAPS / IMPROVEMENTS NEEDED
  ──────────────────────────────────────────────────────────────────────────
  react-query v3             API changed significantly in v4/v5. Current
                             useQuery/useMutation calls will need a migration
                             path before v3 reaches EOL.

  Tailwind 3.1.6 → 3.4+     3.4 adds animate-*, @starting-style, and
                             interpolate-colors support. Upgrade is non-breaking.
                             Run: yarn add tailwindcss@latest

  prettier 2.7 → 3.x        v3 drops CJS, requires ESM config. Breaking.
                             Schedule for a dedicated formatting pass.

  @anthropic-ai/sdk 0.32     Current release is 0.53+. The streaming API
                             and tool_use format changed in 0.39+.
                             Upgrade may require updating any stream handlers.

  axios 0.27 → 1.x           v0.x is in maintenance mode. axios 1.x has
                             better AbortController integration and improved
                             error handling. Migration is mostly non-breaking.

  @types/node 18 → 20        Project runs Node 20+. Type stubs should match.
                             yarn add -D @types/node@20 — low risk.

  server.ts diagnostic       Two production-unsafe diagnostic routes have been
  routes (FIXED this session) removed. /u/test-route-works returned raw HTML
                             with routing internals exposed. /api/diagnostic
                             returned a stale hardcoded commit hash. Both
                             represent information disclosure risk — now gone.

────────────────────────────────────────────────────────────────────────────────
06 // DEPENDENCY VERSION MATRIX
────────────────────────────────────────────────────────────────────────────────

  PACKAGE                   INSTALLED       STATUS
  ──────────────────────────────────────────────────────────────────────────
  fastify                   ^5.6.1          ✓ Current
  typescript                ^5.9.3          ✓ Current
  vite                      ^7.1.9          ✓ Current
  react                     ^18.2.0         ✓ Stable (v19 exists, not needed)
  zod                       ^3.23.8         ✓ Current
  pino-pretty               ^13.1.1         ✓ Current
  dayjs                     ^1.11.10        ✓ Current
  sequelize                 ^6.29.0         ✓ Current (v7 alpha)
  @fastify/helmet           ^12.0.0         ✓ Current
  @fastify/rate-limit       ^10.3.0         ✓ Current
  tailwindcss               ^3.1.6          ⚠ Outdated (3.4.x available)
  prettier                  ^2.7.1          ⚠ Outdated (3.5.x, breaking)
  react-query               ^3.39.3         ⚠ 2 major versions behind (v5)
  @anthropic-ai/sdk         ^0.32.1         ⚠ Outdated (0.53+ available)
  axios                     ^0.27.2         ⚠ v0.x maintenance mode (→ 1.x)
  @types/node               ^18.0.3         ⚠ Project runs Node 20+
  nodemon                   ^2.0.19         ⚠ Outdated (3.x available)
  esbuild                   ^0.20.2         ⚠ Outdated (0.25.x available)
  @types/react-dom          ^19.2.2         ⚠ React 18 mismatch (→ ^18.x)

────────────────────────────────────────────────────────────────────────────────
07 // CI/CD PIPELINE STATUS
────────────────────────────────────────────────────────────────────────────────

  WORKFLOW: Weekly Rebuild & Self-Assembly Sync
  SCHEDULE: Sunday 21:00 UTC
  STATUS:   FAILED (3 consecutive weeks)

  RUN ID          DATE                  CONCLUSION
  ──────────────────────────────────────────────────────────────────────────
  27513664894     2026-06-14 22:12 UTC  failure  ← most recent
  27106197975     2026-06-07 22:05 UTC  failure
  26725711844     2026-05-31 22:01 UTC  failure

  CAUSE: `DIGITALOCEAN_ACCESS_TOKEN` secret not present in repo secrets.
  FIX:   Add secret in GitHub Settings → Secrets and variables → Actions.

  LAST SUCCESS: 2025-10-10 (Dependabot npm update — unrelated to rebuild)

────────────────────────────────────────────────────────────────────────────────
08 // MONITORING COVERAGE ASSESSMENT
────────────────────────────────────────────────────────────────────────────────

  COVERAGE             STATUS
  ──────────────────────────────────────────────────────────────────────────
  App uptime           DigitalOcean App Platform health check at /health ✓
  Error logging        Pino (structured JSON) to stdout — captured by DO ✓
  Security audit log   AuditEvent system (auth, session, admin, suspicious) ✓
  Rate limiting        Fastify rate-limit (100 req/min global, 10 auth) ✓
  Session security     Expiry enforcement + idle timeout + prune job ✓
  Build CI             GitHub Actions weekly-rebuild — BROKEN (see §01) ✗
  Error tracking       No Sentry / Datadog / Rollbar — logs only ⚠
  Uptime alerting      No PagerDuty / OpsGenie — manual monitoring ⚠
  Performance APM      None — no latency histograms or p95 tracking ⚠

  RECOMMENDATION: For a production-grade site, add Sentry (free tier sufficient
  for this scale) for error aggregation with stack traces. Current stdout-only
  logging requires manual DO dashboard checks to catch errors.

────────────────────────────────────────────────────────────────────────────────
09 // BENCHMARK ENGINE STATUS
────────────────────────────────────────────────────────────────────────────────

  LAST SESSION:   LOT-SR-20260615-01 — QIE v62 P71-P73 · Archetype 22 · Job 15
  RESULT:         GREEN (build 8.73s — client 2.33s + server 5.26s + 0.17s gzip)
  TOTAL GREENS:   28 all-time benchmarks green
  MANIFEST:       10 BEST-status features pending ship
  QIE:            v62, 73 patterns, 22 archetypes, 15 background jobs
  DEP MAP:        111+ nodes
  LAST LEDGER ID: 20260615-01

  OPEN SHIP CANDIDATES (BEST status):
    LOT Mail, Basics Tab, Calendar Alerts, QI-46 Engine, COSMO Hardware,
    Health/Security, Badge RPG, Self-Assembly v45

────────────────────────────────────────────────────────────────────────────────
10 // PRIORITY ACTION LIST
────────────────────────────────────────────────────────────────────────────────

  P1  CRITICAL — Add DIGITALOCEAN_ACCESS_TOKEN to GitHub repo secrets
      Without this, no automatic deploys. Every release is manual.
      Link: https://github.com/LOT-Systems/LOT-Computer/settings/secrets/actions

  P2  HIGH — Re-enable production gzip in src/server/index.ts (lines 141-167)
      Uncomment the gzip block. Verify dist/client/js/*.gz files exist post-build.

  P3  MEDIUM — Update browserslist DB
      npx update-browserslist-db@latest && commit updated caniuse-lite

  P4  MEDIUM — Update @types/node to ^20 (matches engine requirement)
      yarn add -D @types/node@20

  P5  LOW — Upgrade tailwindcss to 3.4.x
      yarn add tailwindcss@^3.4 — non-breaking, adds animation + color APIs

  P6  LOW — Upgrade esbuild to 0.25.x
      yarn add -D esbuild@^0.25 — performance improvements in bundler

  P7  PLANNED — React Query v3 → TanStack Query v5 migration
      Breaking changes require dedicated sprint. Not urgent but a tech debt clock.

  P8  PLANNED — Sentry error monitoring integration
      Replace console.error-only error reporting with structured, alerted
      error tracking. Sentry SDK + @fastify/sentry or manual onError hook.

================================================================================
END REPORT
LOT-HEALTH-20260616 | 2026-06-16 12:10 UTC | claude/inspiring-volta-jyv78c
================================================================================
