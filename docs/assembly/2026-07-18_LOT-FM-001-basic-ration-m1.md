================================================================================
LOT SYSTEMS / SELF-ASSEMBLY DIRECTIVE — RECEIVED + STATUS
DOCUMENT: LOT-FM-001
TITLE:    BASIC (RATION) MODULE — 90-DAY BUILD
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-18
BRANCH:   claude/beautiful-johnson-afqz6n
================================================================================

## SOURCE DIRECTIVE (verbatim, as issued)

    LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE
    MODULE: BASIC (RATION) — 90-DAY BUILD

    ROLE: You are the LOT build agent. Assemble the BASIC ration module per
    LOT-FM-001. Source doctrine, 23-item load, visual spec, OPEN TAB, and
    UPGRADE state machine from that manual. House style is non-negotiable:
    LiberationMono-Bold, white ground / black ink, inversion-only hierarchy,
    2px rules, square corners, fixed character grid, IBM 3270 register. Voice:
    quartermaster, imperative, terse. No marketing, no color, no radius, no
    icons.

    OPERATING RULES
    - Issue, do not sell. The user is ON STRENGTH.
    - USD 100/mo. >=60% margin. <=USD 40 landed. Never breach the ceiling.
    - The ledger is the marketing. No layer between public and manifest.
    - Ship working increments monthly. Each month ends in a demonstrable state.

    MONTH 1 — LEDGER & DOCTRINE (the System exists, read-only)
    BUILD: OPEN TAB public surface. Render the 23-item manifest as a ledger
    (nomenclature + cadence; COGS withheld). Doctrine statement. Price line.
    Status-line component. Terminal tokens + grid established.
    EXIT: A stranger can read what LOT issues and on what terms. Read-only. Live.

    MONTH 2 — UPGRADE & ROSTER (Usership AI -> BASIC)
    BUILD: UPGRADE control + state machine (USERSHIP/AI -> PENDING -> ON
    STRENGTH -> STEADY STATE). Roster intake (sizing, shipping, cadence start).
    Recurring $100/mo additive billing. STAND DOWN downgrade (drops ration,
    retains AI). Issue log scaffold.
    EXIT: A Usership member can go ON STRENGTH and back OFF, end to end.

    MONTH 3 — ISSUE & FULFILLMENT (the box ships)
    BUILD: Month-by-month load engine (per Section 2 cadence). Supplier quotes
    confirmed against COGS ceiling. Printed manifest card generation. First
    issue scheduled and dispatched. Issue log accrues, NEXT ISSUE advances.
    EXIT: First real ration ships to a real subscriber. Margin verified >=60%.

    DELIVER EACH MONTH: working increment + one-line status against the
    envelope. END STATE: Open tab live, upgrade path operational, ration
    shipping on cadence. ELIMINATE ONE DISTRACTION.

NOTE (source-manual gap): the directive references "the manual" (LOT-FM-001
full text) for the exact 23-item load, visual spec, and state-machine detail.
Only the directive summary above was supplied to this build session — the
underlying manual document was not attached. Month 1's 23-item manifest, unit
nomenclature, and category grouping below are this session's constructed
best-effort load against the doctrine constraints (issue-register nomenclature,
mixed monthly/quarterly/one-time cadence, plausible <=USD 40 landed ceiling at
23 items). Treat the manifest in `src/shared/constants/rations.ts` as
PROVISIONAL until reconciled against the source LOT-FM-001 manual — supersede
in a future session, do not silently diverge from it once it surfaces.

--------------------------------------------------------------------------------
MONTH 1 — STATUS: BUILT, GREEN, this session (2026-07-18)
--------------------------------------------------------------------------------
- OPEN TAB: `Basics` wired into router (`/basics`), nav (`Layout.tsx`, both
  logged-in and logged-out link sets), and the persistent TabPanel set in
  `app.tsx`. No auth gate on the component itself — every operator reads the
  same ledger regardless of ration enrollment.
- 23-item manifest: `src/shared/constants/rations.ts` — `BASIC_RATION`
  (nomenclature, category, cadence), `BASIC_RATION_PRICE_USD` ($100),
  `getRationCadenceCounts()`. COGS intentionally absent from this file — it is
  bundled to the client and must never carry cost data.
- Doctrine statement + price line + manifest ledger + roadmap card:
  `src/client/components/Basics.tsx`. Fixed white-ground/black-ink register via
  hardcoded `bg-white text-black border-2 border-black`, independent of the
  app's theme store — this is a deliberate exception (printed-card register),
  not a bug.
- Status-line primitive: `src/client/components/ui/StatusLine.tsx`, exported
  from `ui/index.tsx`. Three states — `live` (blinking square, reuses the
  existing `.blink`/`soft-blink` keyframe from `index.css`), `pending` (hollow
  square), `closed` (solid, static). Reused 3x in Month 1's own roadmap card
  (Month 1/2/3 status rows) — this is the seed of the "terminal tokens" the
  directive asks for; extend rather than re-invent in Month 2/3.

HOUSE-STYLE DEVIATION (recorded, not silent): the app has no
`LiberationMono-Bold` webfont asset or token anywhere in the codebase (grepped
whole repo — zero hits) — the only prior typography token is `font-base`
(Arial/Helvetica). Tailwind's default `font-mono` utility survives because
`fontFamily` is declared inside `theme.extend` (not a full `theme` override),
and Tailwind's stock `font-mono` stack includes `"Liberation Mono"` by name —
so `Basics.tsx` uses `font-mono font-bold`, which resolves to real Liberation
Mono Bold on systems that have it installed, and a monospace fallback
everywhere else. No new font asset was added. If a literal LiberationMono-Bold
`.woff2` is required (not just a system-font hope), that is Month 2/3 scope —
flagged here so it isn't lost.

SCOPE NOTE (public vs authenticated): the app has no anonymous-visitor path —
`app.tsx`'s bootstrap `getMe()` redirects to `/login` on failure, so every SPA
tab, Basics included, is only reachable by an authenticated operator. "OPEN
TAB… a stranger can read it" is satisfied *within* the authenticated shell —
any logged-in operator sees the full ledger with zero ration enrollment or
paywall, i.e. "stranger to the ration program," not "stranger to the
internet." A true logged-out public page (mirroring `About.tsx`'s standalone
multi-entry pattern, `src/client/entries/about.tsx`) is a larger, separate
lift and was not attempted this session — flag for S-2 if literal anonymous
web access is required.

--------------------------------------------------------------------------------
MONTH 2 — PLANNED (not built this session)
--------------------------------------------------------------------------------
UPGRADE & ROSTER. Concrete shape, informed by this session's read of the data
layer (`src/client/queries.ts` createQuery/createMutation pattern,
`src/server/routes/api.ts`, `src/server/models/user.ts`):
- State machine on `User.metadata.basicRation.status`:
  `USERSHIP` -> `PENDING` -> `ON_STRENGTH` -> `STEADY_STATE`, with `STAND_DOWN`
  as a reverse transition back toward `USERSHIP` (ration drops, AI/Usership
  access is untouched — enforce that invariant explicitly in the transition
  guard, not by convention).
- Roster intake form: sizing, shipping address, cadence start date — new
  `POST /api/basics/enroll` route + mutation hook alongside existing
  `queries.ts` patterns.
- Billing: additive $100/mo on top of existing Usership AI charge — reuse
  whatever payment processor integration Usership billing already runs on
  (not yet located in this session's read; audit `src/server/routes/` for the
  existing subscription/billing route before inventing a second one).
- Issue log scaffold: a new log event type (`ration_issue_scheduled`, etc.)
  following the existing `Log` model + `displayableEvents` whitelist pattern
  (Backend Whitelist Hygiene doctrine clause — new event types must be added
  to the GET whitelist or the write->read loop silently breaks).
- UI: extend `Basics.tsx`'s roadmap card — replace the disabled Month 2 status
  row with a live `UPGRADE` button once the route exists; `StatusLine`
  `pending` -> `live` transition is already the right visual language for
  this — no new primitive needed.

--------------------------------------------------------------------------------
MONTH 3 — PLANNED (not built this session)
--------------------------------------------------------------------------------
ISSUE & FULFILLMENT.
- Month-by-month load engine: given `BASIC_RATION`'s `cadence` field
  (`MONTHLY` / `QUARTERLY` / `ISSUE`), derive "what ships this month" as a
  pure function of enrollment month N — `MONTHLY` items every issue,
  `QUARTERLY` items every 3rd issue, `ISSUE` items only on issue #1. This
  function belongs in `src/shared/constants/rations.ts` alongside the
  manifest (mirrors `getRationsByCategory`/`getRationCadenceCounts` already
  there) so client and server share one source of truth.
- Supplier quotes vs the <=USD 40 landed / >=60% margin ceiling: real
  procurement work, not code — track outcome in a future session report, not
  in source.
- Printed manifest card: a physical insert per issue, likely generated
  server-side as a PDF (see `docs/` for existing PDF-adjacent conventions;
  none found yet in `src/server` — new capability).
- Issue log + NEXT ISSUE date: extends the Month 2 issue-log scaffold with a
  scheduled-job (see `src/server/scheduled-jobs.ts` — existing precedent for
  the Sunday self-assembly job and weekly story job) that advances
  `nextIssueDate` and appends the log entry.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-FM-001 (STATUS RECORD)
================================================================================
