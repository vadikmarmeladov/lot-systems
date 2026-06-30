# LOT ASSEMBLY — 2026-06-30 — v74

**SESSION REPORT:** LOT-SR-20260630-01
**BRANCH:** claude/exciting-ritchie-jg49l4
**DATE:** 2026-06-30

---

## SOURCES READ

| Source | Content |
|--------|---------|
| docs/benchmark/LOT-LEDGER.md | 64 entries through 20260628-01 |
| docs/benchmark/LOT-DOCTRINE.md | Rev L — 12 clauses |
| docs/benchmark/LOT-LEXICON.md | Rev D — 43 tokens |
| docs/assembly/2026-06-27_LOT-assembly-wiki-v66.md | FM v73 baseline |
| docs/assembly/2026-06-25_LOT-assembly-v72.md | QIE v72 state |
| src/client/components/SystemProgressWidget.tsx | USERSHIP_TRANSMISSION v72 (2026-06-25) |
| src/client/components/About.tsx | FM v73 · Day 1023+ |
| git diff origin/master...HEAD | 10 commits, 4 files changed |

---

## ORIENTATION SUMMARY

**Current system state:** QIE at 86 patterns / 29 archetypes / 23 jobs / 389 badges / FM v73 / Day 1026+.

**The delta:** Branch `claude/exciting-ritchie-jg49l4` carries 10 unbenchmarked commits (visitor stats accuracy, APP_VERSION live injection, Sync crash fix, stores.appVersion wiring). USERSHIP_TRANSMISSION stale at 2026-06-25 (v72). About.tsx shows Day 1023+ / FM v73. System Progress widget unreachable (403 — auth required); signal read from source code only.

**Most recent expressed intent:** Visitor stats were broken — totalSiteVisitors row was removed, My OS visitors preserved, label updated to "Total LOT® users:". Version labels needed to auto-update from package.json without manual edits.

**This session must accomplish:** Green-gate the branch work. Update About.tsx to FM v74 / Day 1026+. Push USERSHIP_TRANSMISSION reflecting the actual changes.

---

## WHAT WAS BUILT

### scripts/build/client.build.ts — APP_VERSION live injection

Reads `version` from `package.json` at build time via `readFileSync`. Injects as `process.env.APP_VERSION` via esbuild `define`. Version labels in System tab now resolve to the live package version without manual source edits. v1.3.0.

### src/client/components/Sync.tsx — onChangeMessage crash fix

`onChangeMessage` callback was being passed to a child component but was never defined — crash on message input. Added `useCallback` handler that calls `setMessage(value)`. Stable.

### src/client/components/System.tsx — visitor stats accuracy

Removed the `Total LOT® visitors:` row (was sourcing from `visitorStats.totalSiteVisitors` which was unreliable). Label `Total users:` → `Total LOT® users:` (two display locations). `My OS visitors:` preserved using `displayStats` (null-safe alias for `visitorStats`). No more undefined-crash path on missing stats.

### src/server/routes/api.ts — visitor-stats route simplified

Removed the `Promise.all` parallel query pattern. Direct `req.user.metadata` access for `profileVisits` (already available on the request object). `countJoined()` retained for total users. Entire handler wrapped in `try/catch`: errors logged to console, returns `{totalSiteVisitors: 0, userProfileVisits: 0}` on failure.

### About.tsx — FM v74 · Day 1026+

Day counter advanced from 1023+ (June 27) to 1026+ (June 30, 2026). Field Manual version v73 → v74. Self-assembly phase row prepended with v74 entry. Version log code block updated. Bottom status block updated.

### SystemProgressWidget.tsx — SESSION_REPORTS v74 + USERSHIP_TRANSMISSION

SESSION_REPORTS: v74 entry appended (6 assembled items). USERSHIP_TRANSMISSION updated to 2026-06-30 with 8 transmission lines describing the actual changes.

---

## FILES CHANGED

| file | change |
|------|--------|
| `scripts/build/client.build.ts` | APP_VERSION injection from package.json |
| `src/client/components/Sync.tsx` | onChangeMessage crash fix |
| `src/client/components/System.tsx` | visitor stats label + row cleanup |
| `src/server/routes/api.ts` | visitor-stats route simplify + error wrap |
| `src/client/components/About.tsx` | FM v73→v74 · Day 1023+→1026+ |
| `src/client/components/SystemProgressWidget.tsx` | SESSION_REPORTS v74 · USERSHIP_TRANSMISSION |
| `docs/benchmark/LOT-SR-20260630-01.md` | session report |
| `docs/assembly/2026-06-30_LOT-assembly-v74.md` | this file |
| `docs/benchmark/LOT-LEDGER.md` | ledger append |

---

## SYSTEM STATE POST-v74

```
FIELD MANUAL     v74
DAY              1026+  (as of June 30, 2026)
QIE PATTERNS     86  (P1–P86)
ARCHETYPES       29
BACKGROUND JOBS  23
LOG HANDLERS     85+
BADGES           389  (v19 Quantum Protocol · 50 categories · 326 hidden)
WORD TURNS       126 triggers (v1–v10)
DEP MAP          126+ nodes
WIKI VERSION     v66
ABOUT.TSX        FM v74 · v1.3.0
BRANCH           claude/exciting-ritchie-jg49l4
```

---

## DEFERRED

- Badge Codex v20 (no new badge categories in this session)
- QIE P87 (no new behavioral pattern; 86 is current ceiling)
- Duplicate key warning in badges.ts (`first_signal` appears twice) — deferred, pre-existing
- Wiki v67 / FM v75 — documentation-only session not warranted today

---

## NEXT SESSION RECOMMENDATION

Audit `badges.ts` for duplicate keys (at minimum the `first_signal` at lines 1827 and 3112) and resolve before it multiplies. Then evaluate Badge Codex v20 or a new QIE pattern if live signal data surfaces a recurring unmapped behavior.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
