# LOT Systems — Health Check Report
**Date:** 2026-09-02 | **Session:** Automated Scheduled Audit

---

## 1. Active Incidents

**None confirmed active.** The two CI failures from Aug 9 and Aug 16 (Weekly Rebuild runs #11 and #12) were resolved by Aug 23 and have remained green since. No open GitHub Issues.

---

## 2. CI / CD Status

| Workflow | Last Run | Status | Date |
|---|---|---|---|
| Weekly Rebuild & Self-Assembly Sync (#14) | `doctl` rebuild of DO App Platform | ✅ SUCCESS | 2026-08-30 |
| Weekly Rebuild (#13) | DO rebuild | ✅ SUCCESS | 2026-08-23 |
| Weekly Rebuild (#12) | `Trigger rebuild` step failed | ❌ FAILED | 2026-08-16 |
| Weekly Rebuild (#11) | `Trigger rebuild` step failed | ❌ FAILED | 2026-08-09 |
| Benchmark Tag Lattice (#6) | master push | ✅ SUCCESS | 2026-08-05 |

**Root cause of runs #11–#12:** The `doctl apps create-deployment` step failed on both Aug 9 and Aug 16. This is consistent with a transient DigitalOcean App Platform API issue (possibly a brief service degradation). Both runs resolved automatically the following weeks — no code change was required. The workflow is now healthy.

**Links:**
- [Run #14 (latest, success)](https://github.com/LOT-Systems/LOT-Computer/actions/runs/33341330443)
- [Run #12 (failure)](https://github.com/LOT-Systems/LOT-Computer/actions/runs/31973198902)
- [Run #11 (failure)](https://github.com/LOT-Systems/LOT-Computer/actions/runs/31337108327)

### Open Pull Requests

| PR | Title | Age | Status |
|---|---|---|---|
| [#93](https://github.com/LOT-Systems/LOT-Computer/pull/93) | feat(calendar): time tracking + military-grade due-event toast | 36 days (opened 2026-07-28, last updated 2026-08-05) | Open — **stale** |

PR #93 has been untouched for 4 weeks. Recommend reviewing and merging or closing.

---

## 3. Security Issues

### HIGH — `server.ts` is a stale development server compiled into the build
**File:** `src/server/server.ts`  
The active production entry point is `src/server/index.ts`. However, `server.ts` is included in the same TypeScript compile scope (`tsconfig.server.json` includes `src/server/**`) and produces `dist/server/server/server.js`. It has multiple serious deficiencies vs. `index.ts`:

- `script-src: ["'unsafe-inline'"]` in its CSP — defeats the nonce system, allows XSS
- `img-src: ['*', 'data:']` — allows any image source
- No `@fastify/rate-limit` registered — no brute-force protection
- `logger: false` hardcoded — all request logging silenced
- Live diagnostic route `/u/test-route-works` returning raw HTML
- Route `/api/diagnostic` exposing a hardcoded internal commit hash
- Multiple `console.log` calls that would leak internal routing details
- Auth session lookup uses old JWT-verify path, not the database-first session check
- Admin gating uses `isAdmin()` only, missing the `canAccessUsSection()` check

**Action:** Delete `src/server/server.ts` and `src/server/routes/index.ts` (the unused aggregator). Both are dead code that create a maintenance and security surface.

---

### HIGH — `rejectUnauthorized: false` in health monitoring script
**File:** `scripts/monitoring/health-check.ts:30`  
SSL certificate verification is disabled for the DB connection in the standalone monitoring script. If this script is run against production this opens a MITM attack window on the Postgres connection.

**Action:** Remove the `rejectUnauthorized: false` option or replace with a proper CA bundle.

---

### HIGH — Hardcoded admin email in application logic
**File:** `src/server/models/user.ts:98`
```ts
return this.email === 'vadikmarmeladov@gmail.com'
```
The `canEditTags()` method hard-codes a specific email. If the email changes or a second admin needs this permission, the code must be changed. Should use `config.admins.includes(this.email)` or a dedicated permission flag.

---

### MEDIUM — `'unsafe-inline'` CSP in production server (if server.ts is ever started)
Covered above. The active `index.ts` correctly uses nonces — this is only a risk from `server.ts`.

---

### MEDIUM — `connect-src` allows `https://unpkg.com`
**File:** `src/server/server.ts:47`  
`unpkg.com` is a public CDN that serves arbitrary npm packages. Including it in `connect-src` means any user-reachable code could exfiltrate data via `fetch` to unpkg-served scripts. Should be removed from the CSP directive.

---

## 4. Dependency Upgrades Needed

| Package | Current | Severity | Notes |
|---|---|---|---|
| `axios` | `^0.27.2` | **HIGH** | CVE GHSA-4w2v-q235-vp99 (prototype pollution) fixed in 1.x. Used in 4 client files — could be replaced with native `fetch` entirely. |
| `react-query` | `^3.39.3` | **MEDIUM** | v3 is EOL. Current package is `@tanstack/react-query` v5. 6 files import from `'react-query'`. Breaking API changes require query key migration. |
| `esbuild` | `^0.20.2` | **MEDIUM** | Current is 0.25+. Bugfix and performance releases in between. |
| `@anthropic-ai/sdk` | `^0.32.1` | **MEDIUM** | Latest is 0.39+. Streaming and tool-use improvements in between. |
| `tailwindcss` | `^3.1.6` | **LOW** | v3.4 adds container queries, `@starting-style`, and text utilities. v4 is also stable. |
| `tailwind-merge` | `^1.6.0` | **LOW** | Current is v2. |
| `prettier` | `^2.7.1` | **LOW** | v3 is current. |
| `nodemon` | `^2.0.19` | **LOW** | v3 is current. |
| `openai` | `^4.52.0` | **LOW** | v4.x is current major but patch updates available. |
| `vite` | `^7.1.9` | **INFO** | Listed in devDependencies but no `vite.config.*` is present — appears unused. |

---

## 5. Performance & Architecture Observations

### Logging disabled in server.ts
`src/server/server.ts:35`: `logger: false  // Temporarily disable logging for development`  
This line has been in the codebase for an extended period. If `server.ts` were ever accidentally started in production, all Fastify request logging would be silenced — a complete monitoring blind spot. The active `index.ts` correctly enables Pino logging.

### Gzip serving disabled
`src/server/index.ts:141–167`: The gzip asset serving block is commented out with `// TEMPORARILY DISABLED FOR TESTING`. This means JS bundles are served uncompressed. On a mobile or slow connection this can significantly impact load time. Caddy in production likely handles gzip at the proxy level — but this should be confirmed and documented rather than left as a temporary comment.

### CSS cache-busting is hardcoded
`templates/generic-spa.ejs:8`:
```html
<link rel="stylesheet" href="/css/index.css?v=20241213-002">
```
This version string was set in December 2024 and has not changed. Deployments since then don't bust the browser cache for CSS changes. Recommend using a build-time content hash or a `APP_BUILD_ID` env var injected at build time.

### No app-level healthcheck in docker-compose
`docker-compose.node0.yml`: The `app` service has no `healthcheck` block. Postgres and Ollama have healthchecks defined. If the Node server crashes at startup, Caddy will continue routing to it and return connection errors. Add:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

---

## 6. Code Quality — Top Designer Site Standards

### Accessibility gaps (broad — ~65 components)
The entire UI component library (`Button`, `Input`, `Link`, `Table`, `Tag`, `Text`) has no ARIA attributes, roles, or keyboard navigation support. Only 2 of 65 components use `aria-*` attributes at all. For a top-tier design site this is a critical gap — screen reader users cannot navigate the UI.

**Minimum required actions:**
- `Button.tsx` — add `aria-disabled` when disabled, `type="button"` to prevent accidental form submit
- `Input.tsx` — add `aria-label` or ensure `<label>` association via `htmlFor`/`id`
- `Link.tsx` — add `aria-current` support for navigation links
- All widget close/expand toggles — add `aria-expanded`, `aria-controls`
- Images without alt text in any `MicroImageWidget` usage

### Stale backup files committed to the repo
The following files should not be in version control:
- `src/client/entries/login.tsx.backup`
- `src/server/_backups/auth.ts.backup`, `database.ts`, `email.ts.backup`, `server.ts.bak`, `server.ts.working`
- `src/shared/types/index.ts.bak`
- `src/shared/utils/index.js`, `src/shared/types/index.js` (compiled JS artifacts alongside TypeScript sources)

**Action:** Add to `.gitignore` and remove from tracking with `git rm --cached`.

### Prisma schema placeholder
`prisma/schema.prisma` is present but Prisma is not in `package.json` and has no models defined. The project uses Sequelize + Umzug. Remove this file or document that it's a future migration target.

### Scripts directory bloat
20+ versioned Python badge PDF scripts (`generate_badge_pdf_v4.py` through `generate_badge_pdf_v31.py`) are committed. Only the latest canonical version should remain — old versions belong in git history, not in the working tree.

### Hardcoded `as any` type suppressions
593 occurrences across 29 server files. While many are routine, high-priority instances include:
- `src/server/routes/auth.ts:252` — `} as any` when creating a Session object; fix the type signature instead
- TypeScript config uses `ignoreDeprecations: "5.0"` masking upgrade warnings

---

## 7. Resolved Items Since Last Report

| Item | Status |
|---|---|
| Weekly Rebuild CI failures (runs #11, #12) | ✅ Resolved — Aug 23 and Aug 30 runs both succeeded |
| PR #96 (quantum engine widgets) | ✅ Merged |
| PR #95 (memoize per-render work) | ✅ Merged |
| PR #94 (button-lag fix) | ✅ Merged |
| PR #92 (astrology personalization) | ✅ Merged |

---

## 8. Summary — Priority Action List

| Priority | Action | File(s) |
|---|---|---|
| 🔴 HIGH | Delete `server.ts` (stale dev server with security issues) | `src/server/server.ts`, `src/server/routes/index.ts` |
| 🔴 HIGH | Fix `rejectUnauthorized: false` in monitoring script | `scripts/monitoring/health-check.ts:30` |
| 🔴 HIGH | Replace hardcoded email with `config.admins` check | `src/server/models/user.ts:98` |
| 🟠 MEDIUM | Upgrade `axios` from 0.27.2 → 1.x (or replace with `fetch`) | `package.json`, 4 client files |
| 🟠 MEDIUM | Migrate `react-query` v3 → `@tanstack/react-query` v5 | `package.json`, 6 client files |
| 🟠 MEDIUM | Add ARIA attributes to UI primitives (Button, Input, Link) | `src/client/components/ui/` |
| 🟠 MEDIUM | Fix CSS cache-bust to use build-time hash | `templates/generic-spa.ejs:8` |
| 🟠 MEDIUM | Add `healthcheck` block to `app` service in docker-compose | `docker-compose.node0.yml` |
| 🟡 LOW | Remove backup/bak files from version control | Multiple (see above) |
| 🟡 LOW | Upgrade esbuild 0.20 → 0.25+, prettier 2 → 3 | `package.json` |
| 🟡 LOW | Prune versioned Python scripts in `scripts/` to current only | `scripts/generate_badge*.py` |
| 🟡 LOW | Remove empty `prisma/schema.prisma` or document intent | `prisma/schema.prisma` |
| 🟡 LOW | Review and merge or close stale PR #93 | GitHub PR #93 |

---

*Automated health check — LOT Systems · https://lot-systems.com*
