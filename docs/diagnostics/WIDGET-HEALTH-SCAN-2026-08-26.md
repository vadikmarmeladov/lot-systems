<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

================================================================================
LOT SYSTEMS / DIAGNOSTIC REPORT
DOCUMENT:  WIDGET-HEALTH-SCAN-20260826
TITLE:     Widget Wiring, UI & Lag Health Scan — full dashboard sweep
CLASS:     RESTRICTED // S-2 EYES
S-2:       VADIK MARMELADOV
VERSION:   98971f2 (branch HEAD at scan time)
BRANCH:    claude/charming-albattani-trftks
DATE:      2026-08-26
RESULT:    YELLOW — operational, 6 findings, 0 critical breaks
================================================================================

This is a read-only reconnaissance scan of the widget layer, not a
self-assembly build session. No production code was changed. All claims
below are verified against source at file:line; nothing here is inferred
from documentation alone — where documentation and code disagreed, code
wins and the doc is flagged.

--------------------------------------------------------------------------------
00 // SCOPE
--------------------------------------------------------------------------------
Scanned: ~53 widget components under src/client/components/*.tsx, their
backing nanostores (src/client/stores/), hooks (src/client/hooks/), the
Quantum Intention Engine signal bus (intentionEngine.ts), the Log/Signal
Archive pipeline (/api/logs, /api/quantum-intent/sync), the interface
evolution / progressive-reveal system, and the client build pipeline
(scripts/build/client.build.ts, esbuild).

Method: static source audit + grep-verified cross-reference against
docs/technical/WIDGETS.md and docs/technical/INTERFACE_EVOLUTION.md.

--------------------------------------------------------------------------------
01 // WIDGET WIRING, DATA STORAGE, TESTING
--------------------------------------------------------------------------------
STATUS: DEGRADED (wiring mostly sound; testing absent)

WIRING — 51/53 widgets confirmed live: imported into an active entry point
(System.tsx, About.tsx, StatusPage.tsx, PublicProfile.tsx, or app.tsx),
backed by a real store or a real /api endpoint that resolves to a
registered server route.

Two dead widgets found — fully coded, never mounted anywhere:
  - src/client/components/AwarenessDashboard.tsx
      useProfile() wired at line 28, recordSignal import at line 12.
      docs/technical/WIDGETS.md:170-176 claims it is "integrated into the
      System.tsx layout" — that line is false. Grep confirms zero imports
      of AwarenessDashboard anywhere in src/client.
  - src/client/components/JournalReflection.tsx
      Defined at line 19, exported, never imported anywhere.

DATA STORAGE — confirmed real. Widget signals persist to a Sequelize
`Log` model (src/server/models/log.ts): id (UUID), userId (UUID, FK→users,
cascade delete), text, event, metadata (JSONB), context (JSONB),
createdAt/updatedAt, table `logs`. Note: prisma/schema.prisma is a
15-line stub with zero models — Prisma is present in package.json but is
NOT the production ORM. Anyone reaching for "the schema" via Prisma will
find nothing; the real schema lives in src/server/models/log.ts.

TESTING — 0/53 widgets have any automated test coverage. Repo-wide search
for *.test.ts*/*.spec.ts* returns zero hits outside node_modules.
package.json has no "test" script at all. scripts/tests/ contains six
manual ops smoke-scripts (cold-start, db, email, env, production,
resend) — infrastructure checks, not widget tests. This is the single
largest structural gap found in this scan.

--------------------------------------------------------------------------------
02 // LOT AI · SYSTEM TAB · PORTRAIT (PROFILE)
--------------------------------------------------------------------------------
STATUS: DEGRADED — wiring is live, but "Portrait" as a page does not exist

AIFeedbackWidget.tsx is genuinely QIE-grounded: imported System.tsx:63,
rendered System.tsx:1015, pulls intentionEngine state plus
useOSDiagnostics/useProfile/useLogs/useLogContext. Together AI
(TogetherAIEngine, src/server/utils/ai-engines.ts:213) is the real model
backing Memory-engine question generation (src/server/utils/memory.ts:51,
936), the /api/qi terminal (About.tsx:3764), and /prayer.

"Portrait" is not a shipped route or component. Grep across the full
repo finds "Portrait" only as flavor copy inside Memory-engine strings
(src/server/utils/memory.ts:972,1032; MonthlyPulseWidget.tsx:22,30) and
marketing docs — never a page, never a route. The real profile surfaces
today are:
  - PublicProfile.tsx → GET /api/public/profile/:userIdOrUsername
    (registered src/server/routes/public-api.ts:741, mounted under
    /api/public at src/server/index.ts:223)
  - useProfile() hook → GET /api/user-profile
    (src/client/queries.ts:314; server route src/server/routes/api.ts:2714)

Recommendation: either build the "Portrait" page as a real route wrapping
useProfile()/PublicProfile, or retire the term from user-facing/marketing
copy so it stops implying a feature that isn't there.

--------------------------------------------------------------------------------
03 // QUANTUM INTENT ENGINE · MEMORY · STORY
--------------------------------------------------------------------------------
STATUS: HEALTHY

recordSignal() (src/client/stores/intentionEngine.ts:199-251) is called
correctly by MemoryWidget.tsx:147 and NarrativeWidget.tsx:38 (Story).
No TODO/FIXME/HACK markers found across the 6,503-line intentionEngine.ts.
Signal names are consistent with the source unions used elsewhere in the
codebase — no stale references found.

Persistence path: signal → localStorage key `intention-signals`
immediately (line 113) → batch-synced to server every 10 signals
(SYNC_INTERVAL=10, line 79) with a 5-minute cooldown (SYNC_COOLDOWN,
line 80) via POST /api/quantum-intent/sync (src/server/routes/api.ts:3661).

--------------------------------------------------------------------------------
04 // INTERACTIVE WIDGETS → CONTEXT SYNC → LOG (Signal Archive)
--------------------------------------------------------------------------------
STATUS: DEGRADED — two undocumented persistence tiers, one fragile

Two distinct paths reach the same `logs` table, and WIDGETS.md does not
distinguish them:

  DIRECT-TO-LOG (fast, durable)
    PlannerWidget.tsx calls both recordSignal (line 53) and
    useCreateLog()/createLog (lines 37, 63) → immediate POST /api/logs
    (src/server/routes/api.ts:1562). Written the moment the action fires.

  QIE-BATCHED-TO-LOG (slower, at-risk)
    QuantumRandomWidget.tsx:46 and the ecosystem Car/Home/Computer/Phone
    Connect toggles in QuantumEngineWidgets.tsx:207-235 call recordSignal
    ONLY — no createLog call. These reach the `logs` table exclusively
    via the batched bulkCreate on /api/quantum-intent/sync
    (api.ts:3684, event: quantum_intent_signal), which only fires every
    10 signals or after the 5-minute cooldown. A user who toggles
    "Car Connect" once and closes the tab before the batch threshold is
    reached loses that log entry entirely — the signal exists in
    localStorage only, never reaches the server.

This is not "broken" (the QIE state itself is fine), but it is
meaningfully more fragile than the direct-to-log widgets for the specific
purpose of building a complete usage log, and the gap is silent —
nothing surfaces to the user or to an operator that a toggle event may
never make it into the Signal Archive.

Recommendation: either lower SYNC_INTERVAL for discrete toggle-style
events, flush on `visibilitychange`/`pagehide` (the log editor already
does something similar — see the 7s debounce below), or route toggle
signals through the same direct createLog path Planner uses.

--------------------------------------------------------------------------------
05 // 15-MONTH PROGRESSIVE UI REVEAL
--------------------------------------------------------------------------------
STATUS: NOT-IMPLEMENTED AS DESCRIBED — the mechanism is not calendar-based

Read src/client/utils/interfaceEvolution.ts in full (477 lines) and
docs/technical/INTERFACE_EVOLUTION.md (245 lines). The progressive reveal
is entirely achievement/behavior-based, not time-based:

  - calculateEvolutionState() (line 127) derives seven dimensions
    (exploration, consistency, depth, connection, intimacy, care,
    courage) from achievement IDs, level, and badge counts.
  - getLayoutDensity() (line 442) gates five UI density tiers purely off
    `visualRefinement`, a weighted function of consistency + depth +
    level (lines 193-197).
  - getFeatureUnlocks() (line 303) gates by level thresholds
    (5/10/15/20/25/30) and dimension scores — never by elapsed calendar
    time.

Grepped both files for "15" near "month": zero matches. The only "15"
hit in the file is `intentionHistory: level >= 15` (line 323) — a level
gate, unrelated to months. No calendar-month epoch exists anywhere in
this code path. If a 15-month cadence is the intended design, it is not
yet built; today's system unlocks purely on usage depth, so two users at
very different account ages but similar engagement see the same reveal
state, and a single very-active user could see the full reveal in weeks.

--------------------------------------------------------------------------------
06 // WIDGET LOADING SPEED
--------------------------------------------------------------------------------
STATUS: DEGRADED — no code-splitting at the widget level

No React.lazy, lazy(), Suspense, or dynamic import() anywhere in
src/client/components or src/client/entries. scripts/build/client.build.ts
(lines 14-28) builds 7 static entry points (app, login, ui-lib, us,
status, public-profile, about) with esbuild `splitting: true` — that only
shares chunks BETWEEN entry points, not per-widget. All ~47 widgets
rendered from System.tsx ship inside one synchronous app.tsx bundle,
including subscriber-gated, investor-mode-only, and offline-only widgets
that most sessions never render.

Size check: System.tsx itself is 1,071 lines / 41KB — not the real
weight problem. intentionEngine.ts is 6,503 lines / 307KB and is
imported synchronously by nearly every widget that calls recordSignal(),
making it the single heaviest module in the always-loaded path.
Production minification is enabled (client.build.ts:28).

Recommendation: lazy-load the investor-mode widgets (AngelInvestorWidget,
CorporatePlanWidget, DemoDayWidget, FlashDriveManifest — all gated behind
a localStorage flag already, so they're natural Suspense boundaries) and
the subscriber-gated widgets (CosmicUpdateWidget, QuantumSignWidget).
That alone removes several widgets most users never see from the
critical bundle without touching intentionEngine.ts.

--------------------------------------------------------------------------------
07 // LAG TEST — POLLING, TIMERS, DEBOUNCE
--------------------------------------------------------------------------------
STATUS: HEALTHY — better than current documentation claims

17 setInterval call sites across 13 component files, every one checked
has a matching clearInterval in its useEffect cleanup (e.g.
SystemPulseWidget.tsx:100-107, StatusPage.tsx:104-109,
ChakraErgonomicsWidget.tsx) — no leak pattern found. Most intervals also
pause work when the tab is hidden or the route is inactive
(ContextualPromptsWidget.tsx:25-30 checks document.hidden;
SystemProgressWidget.tsx:1557-1566 checks !isRouteActive('system')).

CORRECTION TO EXISTING DOCS: docs/technical/WIDGETS.md:238-244 states
System Pulse Widget polls "every second." That is stale. The actual code
(SystemPulseWidget.tsx:94-100) polls every 10 seconds, with an inline
comment recording the history: "Auto-fetch every 10 seconds (was 1s —
reduced to prevent DB overload under traffic)." The fix already happened
in code; the reference doc was never updated. Flagging for a doc pass.

Debounce: Logs.tsx:3767-3768 uses a 7-second debounce
(useDebounce, src/client/utils/hooks.ts:12-23) for editor autosave,
correctly clearing its setTimeout on cleanup — no leak.

No further lag indicators found in this static pass (button/sound/control
latency requires an in-browser run, which this scan did not perform —
see Limitations below).

--------------------------------------------------------------------------------
08 // DATA LOG OF WIDGET USAGE ACROSS THE PLATFORM
--------------------------------------------------------------------------------
STATUS: HEALTHY

/api/logs (POST src/server/routes/api.ts:1562-1584, GET line 1082) and
/api/quantum-intent/sync (line 3661) are both real, registered routes
under the /api prefix (src/server/index.ts:322). Both write into the
same Sequelize `Log` table (src/server/models/log.ts) described in
section 01. Signal Archive rendering (military-format log lines per
WIDGETS.md) reads from this same table — confirmed as a single coherent
pipeline, not two divergent stores. See section 04 for the one fragility
in how interactive-toggle signals reach this table.

--------------------------------------------------------------------------------
09 // FINDINGS SUMMARY (doc-vs-code gaps, ranked by impact)
--------------------------------------------------------------------------------
  1. Zero automated test coverage across ~53 widgets — no test script,
     no test files. Highest-impact gap in this scan.
  2. Toggle-style widgets (ecosystem Connect, QuantumRandomWidget) can
     silently lose their log entry if the tab closes before the QIE
     batch threshold (10 signals / 5 min) — see section 04.
  3. AwarenessDashboard.tsx and JournalReflection.tsx are dead code;
     WIDGETS.md falsely documents AwarenessDashboard as live.
  4. "Portrait" does not exist as a page/route anywhere in the codebase —
     it is copy only. PublicProfile + useProfile are the real surfaces.
  5. No widget-level code-splitting — investor-mode and subscriber-gated
     widgets ship to every session regardless of visibility.
  6. WIDGETS.md's "1-second polling" claim for System Pulse is stale;
     actual interval is 10s (already fixed in code, not in docs).

No findings rise to CRITICAL/broken — the platform is operational. The
QIE, Memory, Story, and Log pipelines are sound. This is a maintenance
and documentation-hygiene report, not an incident report.

--------------------------------------------------------------------------------
10 // LIMITATIONS OF THIS SCAN
--------------------------------------------------------------------------------
This was a static source audit, not a live-browser run. Button/sound/
control latency, actual perceived load time, and the "15-month reveal"
question as experienced by a real long-lived account were not measured
in-browser. A follow-up pass with a running dev server and browser
timing (Lighthouse / DevTools Performance) would be needed to quantify
section 06/07 in wall-clock terms rather than structurally.

================================================================================
END OF REPORT
================================================================================

*Vadik*
*lot-systems.com/u/vadik*
