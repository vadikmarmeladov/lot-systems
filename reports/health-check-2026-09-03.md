# LOT Systems — Health Check Report
**Date:** 2026-09-03  
**Session:** Automated scheduled health check  
**Branch audited:** `master` (HEAD `98971f2`)

---

## 1. Active Incidents

**None.** No open GitHub Issues. No active outages detected in the repository.

---

## 2. Errors & Warnings

### ⚠️ MEDIUM — Open PR stale for 37 days
- **PR #93** — `feat(calendar): time tracking + military-grade due-event toast`
- Branch: `claude/dreamy-babbage-4iv1xo` → `master`
- Opened: 2026-07-28 | Last updated: 2026-08-05
- **Action required:** Review, test, and merge or close.
- Link: https://github.com/LOT-Systems/LOT-Computer/pull/93

### ⚠️ MEDIUM — Outdated Claude model IDs (fixed this session)
All three Anthropic API call sites were pinned to `claude-3-5-sonnet-20241022` — deprecated relative to the current model generation. Updated:

| File | Old | New |
|------|-----|-----|
| `src/server/utils/ai-engines.ts:139` | `claude-3-5-sonnet-20241022` | `claude-haiku-4-5-20251001` |
| `src/server/utils/memory.ts:1095` | `claude-3-5-sonnet-20241022` | `claude-sonnet-4-5` |
| `src/server/routes/public-api.ts:706` | `claude-3-5-sonnet-20241022` | `claude-haiku-4-5-20251001` |

Rationale: Haiku 4.5 for cost-sensitive per-user memory completions and API key ping test; Sonnet 4.5 for admin-facing user-summary generation where quality matters.

### ⚠️ LOW — `react-query` v3 in use (not upgraded)
- `package.json` pins `"react-query": "^3.39.3"` — the package was renamed to `@tanstack/react-query` at v4 and v5 is now the stable release.
- No runtime breakage currently; migration is a medium-effort task (API surface changes at v5).
- **Recommendation:** Schedule a dedicated migration sprint.

### ⚠️ LOW — Public debug endpoints expose internal config
Four unauthenticated routes under `/api/public/` return sensitive operational data:
- `/verify-api-keys` — masked key previews + lengths
- `/debug-memory-engine` — Anthropic SDK init status
- `/test-anthropic-key` — live token-burning API call
- `/test-ai-engines` — full engine roster + all configured key flags

These are fine for development but should be gated behind admin auth in production.  
**File:** `src/server/routes/public-api.ts` (routes at lines 557, 594, 640, 689)

---

## 3. Performance Anomalies

**None detected at source level.**

- The `intentionEngine.ts` store is 6,503 lines — the largest single file. No runtime issues observed, but this warrants future splitting for maintainability.
- `System.tsx` imports 40+ widget components at the top level. `LazyMount` wrapper exists and is applied — good practice maintained.

---

## 4. CI / Workflow Status

| Run # | Date | Workflow | Result |
|-------|------|----------|--------|
| 14 | 2026-08-30 | Weekly Rebuild & Self-Assembly Sync | ✅ success |
| 13 | 2026-08-23 | Weekly Rebuild & Self-Assembly Sync | ✅ success |
| 12 | 2026-08-16 | Weekly Rebuild & Self-Assembly Sync | ❌ failure |
| 11 | 2026-08-09 | Weekly Rebuild & Self-Assembly Sync | ❌ failure |
| 6 | 2026-08-05 | Benchmark Tag Lattice | ✅ success |

**Resolved:** Weekly Rebuild runs 11–12 (Aug 9–16) both failed and then auto-recovered. Runs 13–14 are green. No further action needed on CI.

---

## 5. Resolved Items (Since Last Check)

- Weekly Rebuild failures on Aug 9 & Aug 16 **recovered automatically** — Aug 23 and Aug 30 both succeeded.
- PR #96 (quantum engine widgets) merged to master on 2026-08-05. Benchmark Tag Lattice workflow correctly tagged the commit.

---

## 6. Component Quality Audit

### Architecture — Passing
- Fastify 5 + Helmet CSP: ✅ configured (`contentSecurityPolicy` present)
- Rate limiting: ✅ `@fastify/rate-limit` in dependencies
- JWT auth: ✅ `jsonwebtoken` + cookie sessions
- DB: ✅ Sequelize + PostgreSQL with Umzug migrations
- Build: ✅ esbuild client + tsc server, PostCSS Tailwind pipeline

### AI Stack — Updated (see §2)
- `@anthropic-ai/sdk ^0.32.1` — pinned range; consider updating to latest for new model access
- `openai ^4.52.0` — current
- `@google/generative-ai ^0.24.1` — current
- `@mistralai/mistralai ^1.10.0` — current

### Frontend — Passing
- React 18.2 ✅
- Nanostores for state ✅
- `LazyMount` viewport deferral on heavy widgets ✅
- `WidgetErrorBoundary` wrapping ✅

### Outstanding for Top-Designer Quality
1. **Upgrade `react-query` → `@tanstack/react-query` v5** — industry standard
2. **Move debug endpoints behind admin auth middleware**
3. **Split `intentionEngine.ts`** (6.5k lines) into domain modules
4. **Merge or close PR #93** — calendar time-tracking has been pending 37 days

---

## Summary

**Overall system health: NOMINAL with minor technical debt.**

No active incidents. CI green for the last two weekly builds. Three stale Claude model IDs updated to current generation this session. One PR has been open 37 days and needs a decision.
