# LOT Systems — Health Check & Component Quality Audit

**Date:** 2026-08-27  
**Session:** Automated scheduled routine  
**Repository:** `LOT-Systems/LOT-Computer`  
**Branch audited:** `master` @ `98971f2`

---

## 1. Active Incidents

**Status: No active incidents.**

GitHub Issues: **0 open**.  
No outages, no error-state labels, no flagged deploys.

> All systems nominal as observed from repository signals.

---

## 2. Open PR Requiring Attention

| PR | Title | Age | Status |
|----|-------|-----|--------|
| [#93](https://github.com/LOT-Systems/LOT-Computer/pull/93) | `feat(calendar): time tracking + military-grade due-event toast` | 30 days open (since Jul 28) | Awaiting merge |

**Details:** PR #93 adds optional time-of-day field to `CalendarWidget.tsx`, a `CalendarEventToast.tsx` component for 10-minute due-window alerts, and `CAL:` log renderer update. No new DB columns, no new routes. Implementation is complete with a test plan.

**Recommendation:** Review and merge. This has been open for 30 days with no conflicts noted (last updated Aug 5 after master conflict resolved). No further blockers are visible.

---

## 3. Errors & Warnings — Code-Level

### 3.1 DEBUG ARTIFACT in production CSS (HIGH)

**File:** `src/client/index.css`

```css
.input-resizible-v::after {
  content: attr(data-value) ' ';
  visibility: hidden;
  outline: 1px dashed red;   /* ← debug outline */
  color: red;                /* ← debug color */
  white-space: pre-wrap;
  word-wrap: break-word;
  pointer-events: none;
}
```

The `::after` pseudo-element on `.input-resizible-v` carries `outline: 1px dashed red` and `color: red`. These are invisible because `visibility: hidden` hides the element — but they ship into production CSS and will appear unexpectedly if `visibility` is ever changed during debugging or DevTools inspection. Remove both debug declarations.

### 3.2 `.DS_Store` files tracked in git (MEDIUM)

Four macOS system files are committed to the repository:
- `.!79925!.DS_Store`
- `.DS_Store`
- `src/client/.DS_Store`
- `src/.DS_Store`

These should never be tracked. They bloat the repo, leak local filesystem metadata, and indicate `.gitignore` is not being enforced globally. **Action:** remove from tracking via `git rm --cached` and ensure `.gitignore` includes `**/.DS_Store`.

### 3.3 `.pgpass` committed to repository (SECURITY — HIGH)

**File:** `.pgpass`

A `.pgpass` file containing PostgreSQL credentials is committed to the repository. Even if the credentials are rotated or environment-specific, this file should not be in version control. Remove it, rotate any credentials it ever contained, and add `.pgpass` to `.gitignore`.

---

## 4. Performance Anomalies

No runtime performance metrics are accessible through repository signals alone. However, the following architectural patterns are noted:

- `StatusPage.tsx` auto-refreshes every **2 minutes** with `setInterval` — correct and conservative.
- `QuantumEngineWidgets.tsx` calls `fetch('/api/user-profile')` on every mount with no caching layer beyond React state. For a widget that renders on the main dashboard, consider memoizing this call or moving it to a nanostore that persists across navigation.
- The Dockerfile copies the entire source tree before building, including `node_modules` if present locally. A `.dockerignore` file should exclude `node_modules`, `dist`, and `.DS_Store` to prevent cache-busting and oversized images.

---

## 5. Resolved Items

**Since last session (prior to Aug 5, 2026):**

| Item | Resolution | Commit |
|------|-----------|--------|
| Merge conflict in `System.tsx` (dual import: `recordAstrologySignal` + `getCircadianPhase`) | Resolved — both imports retained | `73edd95` |
| QIE v112 → v113 engineering (P146–P151, Arch50–51, J47–J48) | Fully committed | `d7f076e`, `1846b80` |
| Badge Codex v30 → v32 (719 → 812 badges) | Three badge engines shipped: CODEX READER, CYBERSPACE CODEX, HERO'S JOURNEY | `5b2ef49`, `a9dd764`, `91e3648` |
| PR #96 (Quantum Engine Widgets `RgFfC`) | Merged Aug 5 | `98971f2` |
| LOT-WIKI v86 → v87 sync (FM v112 → v113, 151 patterns, 51 archetypes) | Merged | `8ac3690` |

---

## 6. Component Quality Audit — Top-Designer Standard

Assessed against the bar for a world-class, production-quality design system.

### 6.1 Design System (CSS / Tailwind) — STRONG ✓

`src/client/index.css` and `tailwind.config.js` demonstrate a mature, intentional design system:

- **CSS custom properties** are used correctly for theming (`--acc-color-*`, `--base-color`, `--evolution-*`)
- **Evolution system** — CSS variables tied to user progression (opacity, letter-spacing, grid density, transition speed) is architecturally elegant and unique
- **Density-aware hover states** (`[data-density="breathable"]` → `[data-density="instrument"]`) provide progressive visual richness
- **Dark mode** uses the `class` strategy (Tailwind `darkMode: 'class'`) — correct for an app-driven toggle
- **Font smoothing** (`-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`) is applied globally — correct
- **Convergence pulse animations** use CSS variables for timing/opacity rather than hardcoded values — good

**Recommendation:** Tailwind v3.1.6 is pinned. Tailwind v4 (Oxide engine, CSS-first config) is now stable. Migration path exists; plan an upgrade cycle to gain ~30–50% faster builds and native CSS cascade layers.

### 6.2 `StatusPage.tsx` — GOOD ✓

Clean, idiomatic React:
- `useCallback` on `fetchStatus` correctly stabilises the fetch function
- Two `useEffect` hooks (mount + interval) with proper cleanup on the interval
- Error and loading states are handled distinctly
- The `btoa(dayjs().format(...))` timestamp encoding for the memory-status endpoint is a pragmatic anti-caching measure — acceptable
- `formatDate` wraps `new Date()` in try/catch — correct boundary handling

**Minor:** The `getStatusIcon` switch case returns `'?'` for `'unknown'` — consider returning `'–'` (en-dash) for clearer visual hierarchy on a terminal-aesthetic site.

### 6.3 `QuantumEngineWidgets.tsx` — GOOD, with notes ✓

370+ lines, 7 cycling views, multiple stores, live API calls. Despite the complexity:
- `usePersistedState` is cleanly abstracted with a typed generic signature
- `computeQOSMode` is a pure function — testable, no side effects
- `PATTERN_DISPLAY` lookup table prevents scattered string formatting
- `cycleView` state machine is clear
- Device-connect handlers are idiomatic (functional `setState` with side-effect `recordSignal`)

**Issues:**
- `React.useMemo(() => getUserState(), [view])` — `getUserState()` likely reads from a store, not from `view`. The memo dependency `[view]` is misleading; it recalculates on view change but the actual invalidation should be tied to the store. Use `useStore` from `@nanostores/react` for these values instead, or remove the memo.
- `React.useMemo(() => getUserIndex(), [view])` — same issue.
- `useEffect(() => { recomputeAssembly() }, [])` — fires once, no cleanup, no dependency. This is correct for a one-time recompute but should be documented with a comment explaining *why* it only runs once (to avoid someone adding `[assemblyState]` and creating a loop).

### 6.4 Package Dependencies — NEEDS ATTENTION

| Package | Current | Latest | Action |
|---------|---------|--------|--------|
| `@anthropic-ai/sdk` | `^0.32.1` | `~0.39+` | Update — tool-use and streaming API improvements |
| `openai` | `^4.52.0` | `^4.90+` | Update — structured outputs, realtime API |
| `react-query` | `^3.39.3` | TanStack Query v5 | Plan migration — v3 is unmaintained; v5 has breaking API changes but significantly better DX |
| `axios` | `^0.27.2` | `^1.7+` | Update — v0.x is legacy; security patches only in v1 |
| `prettier` | `^2.7.1` | `^3.x` | Update — v2 is EOL |
| `nodemon` | `^2.0.19` | `^3.x` | Update |
| `tailwindcss` | `^3.1.6` | `^3.4.x` / v4 available | Update within v3 now; plan v4 |
| `@mistralai/mistralai` | `^1.10.0` | Current | OK |
| `fastify` | `^5.6.1` | Current | OK |
| `typescript` | `^5.9.3` | Current | OK |
| `zod` | `^3.23.8` | Current | OK |

### 6.5 Docker / Build Pipeline — GOOD ✓

- Node 22 Alpine base — current LTS, correct choice
- `--frozen-lockfile` install — prevents lockfile drift in CI
- Build verification step (`ls -la dist/server/server/index.js && wc -c`) is solid
- Migrations run at container start via CMD — correct for this architecture

**Missing:** `.dockerignore` — without it, the `COPY . .` step copies `node_modules`, `dist`, `.DS_Store`, and local `.env` files into the build context, inflating image size and potentially exposing secrets. Create a `.dockerignore` with at minimum:
```
node_modules/
dist/
.DS_Store
.env
.env.*
!.env.example
```

### 6.6 GitHub Actions — MINIMAL

Two workflows exist:
- `benchmark-tag-lattice.yml`
- `weekly-rebuild.yml`

No CI test runner, no lint check, no TypeScript compile check on PRs. For a top-tier site, adding a lightweight PR check (lint → typecheck → build) would catch regressions before they reach master. The `server:build` script (`tsc + fix-esm-imports`) is the natural CI gate.

---

## 7. Priority Summary

| Priority | Item | File/Location |
|----------|------|---------------|
| 🔴 HIGH | Remove `.pgpass` from git, rotate credentials | `.pgpass` |
| 🔴 HIGH | Remove debug CSS (red outline) from production | `src/client/index.css` |
| 🟡 MEDIUM | Remove `.DS_Store` files from tracking | repo-wide |
| 🟡 MEDIUM | Add `.dockerignore` | root |
| 🟡 MEDIUM | Merge open PR #93 (30 days) | PR #93 |
| 🟡 MEDIUM | Update `axios` 0.27 → 1.x, `react-query` v3 → TanStack v5 (plan) | `package.json` |
| 🟢 LOW | Fix misleading `useMemo` dependencies in QuantumEngineWidgets | `QuantumEngineWidgets.tsx` |
| 🟢 LOW | Add PR-triggered CI workflow (typecheck + build) | `.github/workflows/` |
| 🟢 LOW | Update `@anthropic-ai/sdk`, `openai`, `prettier`, `nodemon` | `package.json` |

---

## 8. Overall Assessment

The LOT Systems codebase is **architecturally healthy** and moving at a high velocity. The design system is genuinely differentiated — the evolution-aware CSS variables, density-aware hover states, and QOS operating model are original and well-executed.

The three items that need immediate attention are the `.pgpass` credential file, the debug CSS in production, and the open PR. None of these block the current release but they carry real risk if left unaddressed.

The badge and QIE engineering cadence (v30→v32 badges, P149–P151 patterns, Arch51, J48 in three weeks) shows strong output velocity. The wiki sync (v86→v87) and ledger discipline are exemplary for a solo/small-team project.

---

*Generated by Claude Code — automated health check routine*  
*Next scheduled check: 2026-08-28*
