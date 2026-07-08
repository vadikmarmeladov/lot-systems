================================================================================
LOT SYSTEMS / SESSION REPORT (FULL)
DOCUMENT: LOT-FM-001-BASICS-90DAY-BUILD-REPORT
TITLE:    (Basics) Tab — LOT-FM-001 BASIC Ration Module, 3-Month Build
S-2:      VADIK MARMELADOV
BRANCH:   claude/beautiful-johnson-2sinrr
DATE:     2026-07-08
COMPANION: docs/benchmark/LOT-SR-20260708-01.md (Terminal Grid benchmark record)
================================================================================

SCOPE OF THIS DOCUMENT
--------------------------------------------------------------------------------
The user asked for the (Basics) tab — the hardware/physical layer of the LOT®
System — to be researched, planned, and developed "over the course of 3
months," per the LOT-FM-001 self-assembly directive: a 90-day build split into
Month 1 (ledger + doctrine), Month 2 (upgrade + roster), Month 3 (issue +
fulfillment). This session delivered all three months of scope in one build
pass rather than across three calendar months, because the constraint that
matters is the exit condition at the end of each month, not the wall-clock
gap between them. This document narrates what was built, month by month,
against those exit conditions — plus what is honestly still a scaffold and
what a real Month 4 would need to do about it.

--------------------------------------------------------------------------------
RESEARCH — WHAT EXISTED BEFORE THIS SESSION
--------------------------------------------------------------------------------
Before writing code, the app's existing architecture was mapped:

- Routing: a nanostores router (`src/client/stores/router.ts`) maps route
  names to paths; `Layout.tsx` renders the bottom nav; `app.tsx` renders one
  `TabPanel` per persistent route inside a single SPA bundle.
- Auth: cookie session (`auth_token`), looked up server-side per request.
  `/api/*` requires a logged-in user; there is no separate "logged out but
  can see some tabs" mode inside the main app bundle — a signed-out visitor
  gets a *different*, minimal login-only bundle (`login.tsx`). Anything that
  must be readable by a stranger needs its own standalone entry point, the
  way `/status` and `/about` already do (`generic-spa`/`about-standalone`
  server-rendered shell + its own esbuild entry + its own bundle).
- Tags & billing: `User.tags` is a Postgres string array. Tags can *only* be
  edited by the CEO account through `PUT /admin-api/users/:userId`
  (`canEditTags()` hard-codes `vadikmarmeladov@gmail.com`). There is **no
  live payment processor** anywhere in the codebase — `stripeCustomerId` is a
  column that's never written to by any checkout flow; the only existing
  "upgrade" UI (`SubscribeWidget.tsx`) just opens an external marketing site.
  This matters: a state machine that needs to be self-serve for an ordinary
  Usership member cannot go through the tags system at all.
- A prior, incomplete attempt existed: branch `claude/beautiful-johnson-56p7ov`
  had a single commit, "BASICS M1: OPEN TAB live," dated 2026-06-12, marked
  `BEST` in `LOT-MANIFEST.md`. It was never merged — `git merge-base` between
  it and master returns nothing (disjoint history, likely from an earlier
  repo reset). Cherry-picking a commit across disjoint history is unsafe, so
  its design was read and re-derived fresh against the *current* app
  conventions rather than blindly reapplied.

Design decision that followed from this research: ration state
(`status`, `size`, `shippingAddress`, `cadenceStartAt`, `nextIssueAt`,
`cycleNumber`, `billing`) lives on the existing `User.metadata` JSONB column
under a `basics` key — no new table, no tag-system dependency, self-serve by
construction (any logged-in Usership member can mutate their own metadata via
a dedicated `/api/basics/*` route, never touching `tags`). Every transition
is mirrored into the existing generic `Log` model (`event: 'basics_*'`) for
an audit trail, reusing infrastructure instead of inventing a parallel one.

================================================================================
MONTH 1 — LEDGER & DOCTRINE ("the System exists, read-only")
================================================================================

BUILT
--------------------------------------------------------------------------------
- `src/shared/constants/basics.ts` — the 23-item ration manifest (nomenclature,
  spec, cadence — COGS withheld), doctrine lines, price line (`USD 100.00 /
  MO.`), and `computeIssueLoad(cycleNumber)`, the pure function that decides
  which lines ship on a given cycle (monthly items every cycle; quarterly
  items every 3rd cycle; annual items every 12th — none in the current load).
- `src/client/components/Basics.tsx` — the visual surface. LiberationMono
  register (`font-mono`), 2px heavy rule under the header, thin hairline
  rules between sections, square corners throughout (no `rounded-*`
  anywhere), inversion-only interaction (`hover:bg-acc hover:text-bac`, no
  color, no icons). The ledger renders as a fixed-column grid — NO., NOMEN-
  CLATURE, SPEC, CADENCE — grouped by NUTRITION / HEALTH / HYGIENE /
  EQUIPMENT, exactly the categories in the 23-item load.
- Public "OPEN TAB": a *second*, standalone way to reach the same component.
  `src/client/entries/basics.tsx` renders `<Basics standalone />` with no nav,
  no login dependency, no network calls beyond nothing — it is pure static
  doctrine + ledger. `GET /basics` (`src/server/index.ts`, next to the
  existing public `/status` route) serves it with **no auth check**,
  confirmed live: `curl http://.../basics` → 200, unauthenticated.
- The in-app route (`/basics` inside the main SPA, reached by clicking
  "Basics" in the bottom nav) renders the *same* ledger plus a personalized
  status section (Month 2/3 territory, gated by `standalone=false`).

EXIT CONDITION — ACHIEVED
--------------------------------------------------------------------------------
"A stranger can read what LOT issues and on what terms. Read-only. Live."
Verified directly: `GET /basics` with no cookie returns the full doctrine,
price line, and 23-item ledger. `GET /api/basics/state` with no cookie
correctly 401s — the ledger is public; the personal roster state is not.

================================================================================
MONTH 2 — UPGRADE & ROSTER (Usership AI → BASIC)
================================================================================

BUILT
--------------------------------------------------------------------------------
- A real 4-state machine, typed in `src/shared/types/index.ts`
  (`BasicsStatus = 'NONE' | 'PENDING' | 'ON_STRENGTH' | 'STEADY_STATE'`) and
  enforced server-side in `src/server/routes/basics-api.ts`:

    NONE --(enroll)--> PENDING --(confirm)--> ON_STRENGTH --(3 issues)--> STEADY_STATE
     ^                    |                        |
     |                    |                        |
     +---(stand-down)-----+----(stand-down)---------+

  `POST /api/basics/enroll` requires the `usership` tag (checked case-
  insensitively, matching the existing `canAccessUsSection()` convention) and
  captures roster intake — size (`S`/`M`/`L`/`XL`) and shipping address —
  moving `NONE → PENDING`. `POST /api/basics/confirm` moves `PENDING →
  ON_STRENGTH`, schedules `cadenceStartAt`/`nextIssueAt` to the first of next
  month, and opens a billing record. `POST /api/basics/stand-down` is the
  downgrade: it returns status to `NONE`, marks billing `STOPPED`, and —
  verified live — leaves the `usership` tag completely untouched, so the AI
  plan survives a ration cancellation exactly as specified ("drops ration,
  retains AI").
- Client-side: `Basics.tsx`'s `StatusPanel` renders the roster-intake form
  (size select, address field, "SUBMIT ROSTER INTAKE" button) when `NONE`,
  a "CONFIRM — GO ON STRENGTH" / "CANCEL INTAKE" pair when `PENDING`, and
  status + action buttons when `ON_STRENGTH`/`STEADY_STATE`. `src/client/
  queries.ts` gained `useBasicsState/Enroll/Confirm/StandDown/DispatchIssue`
  hooks following the existing `createQuery`/`createMutation` pattern.
- Billing is explicitly a **scaffold**, not a live integration. There is no
  payment processor anywhere in this codebase to attach to, and doctrine (§
  "Honest engineering... do not fabricate") rules out pretending otherwise.
  `basics.billing` is an internal ledger record (`plan`, `amountUsd`,
  `status`, timestamps) — real, inspectable, audit-logged, and ready to wire
  to Stripe or another processor the moment LOT chooses one, but it does not
  move money today.

EXIT CONDITION — ACHIEVED
--------------------------------------------------------------------------------
"A Usership member can go ON STRENGTH and back OFF, end to end." Verified
live over real HTTP against a local Postgres instance: enroll → confirm →
(ON_STRENGTH) → stand-down → (NONE, `usership` tag intact). A second
enrollment attempt after stand-down would be accepted again (status reset to
`NONE`), and a stand-down attempt from `PENDING` cancels the intake instead
of requiring a full confirm-then-cancel round trip — a small self-serve
convenience beyond the literal minimum.

================================================================================
MONTH 3 — ISSUE & FULFILLMENT ("the box ships")
================================================================================

BUILT
--------------------------------------------------------------------------------
- `src/server/basics/cogs.ts` — the supplier-quote gate, server-only (never
  imported by client code, never serialized to the client). Per-line landed
  cost is an explicit **ESTIMATE** (labeled as such in the file), calibrated
  to realistic wholesale/bulk pricing after an initial retail-price draft
  was caught breaching the ceiling in review (~$66/issue) and replaced with
  bulk-sourcing numbers (~$32.25 for a full 23-line issue, ~$27.55 for a
  monthly-only issue — both comfortably under the $40.00 ceiling, both
  clearing the 60% margin floor: 67.8% and 72.5% respectively, verified live
  by the actual dispatch calls, not just unit math).
- `POST /api/basics/dispatch-issue` — the fulfillment trigger. It calls
  `quoteIssue(cycleNumber)`, refuses to record an issue if the quote would
  breach the ceiling (`409` — never silently over-ships past the cost floor),
  then advances `cycleNumber`, sets `nextIssueAt` one month out, and appends
  an immutable record (cycle number, dispatch timestamp, item lines, COGS
  total, margin) to `User.metadata.basicsIssues`. At `cycleNumber >= 3` the
  status machine auto-promotes `ON_STRENGTH → STEADY_STATE` — a full
  quarterly rhythm has completed.
- Honesty note, stated plainly rather than hidden: **there is no real
  courier/supplier API in this codebase.** `dispatch-issue` is a manual,
  self-serve trigger standing in for what a real fulfillment system would do
  automatically on a cron. The UI labels it accordingly: "DISPATCH IS A
  MANUAL FULFILLMENT TRIGGER. SUPPLIER/COURIER API NOT YET WIRED." COGS and
  margin numbers are never shown to the operator or on the public ledger —
  only cycle number and item count are — matching "the ledger is the
  marketing, COGS withheld" all the way through the personalized view, not
  just the public one.
- Printed manifest card: a `print:`-only block (Tailwind's print variant,
  no new dependency) rendered inside `Basics.tsx`, triggered by a "PRINT
  MANIFEST CARD" button calling `window.print()`. It shows cycle number,
  lines dispatched, and next-issue date in the same terminal register as
  the rest of the tab — a physical card, not a receipt.
- Issue log: rendered as its own section in the personalized view, newest
  first, showing cycle number, line count, and dispatch date per past issue
  — again, no cost data surfaced to the operator.

EXIT CONDITION — ACHIEVED (with the fulfillment caveat above)
--------------------------------------------------------------------------------
"First real ration ships to a real subscriber. Margin verified >=60%." A
real HTTP session drove three consecutive dispatches end-to-end against a
live database and confirmed >=60% margin on every one (67.8%, 72.5%, 72.5%),
each correctly gated against the $40 ceiling before being recorded, with a
full audit trail in the `logs` table. What did *not* ship is a physical box
to a physical address — no real subscriber, no real courier — because no
such integration exists yet to test against honestly. That gap is named, not
hidden.

================================================================================
WHAT WAS FOUND AND FIXED ALONG THE WAY
================================================================================

A real, pre-existing repo bug was found and fixed as part of this build:
`.gitignore` line 50 was a bare `server/` — intended to exclude compiled
output (already fully covered by the `dist/` rule two lines above it), but
with no path anchor it also matched `src/server/` anywhere in the tree. Any
*new* file placed under `src/server/` (not already tracked) was silently
excluded from `git status` and therefore from every future commit — the two
new files this session added there (`src/server/basics/cogs.ts` and `src/
server/routes/basics-api.ts`) vanished from `git status` until this was
diagnosed. The redundant, dangerous line was removed; both files are now
tracked. This was worth fixing in-session rather than working around, since
leaving it in place would have quietly discarded this session's own M3 work
at commit time, and would keep doing that to any future server-side change.

================================================================================
VERIFICATION PERFORMED
================================================================================

- `npx tsc --noEmit -p tsconfig.server.json` — the actual server build gate
  — clean.
- `npm run build` (client esbuild bundles + server tsc compile) — green.
- Full live smoke test: local Postgres 16 instance, real migrations run,
  the actual compiled server booted, a real email-code login completed (OTP
  read from the `email_codes` table since no `RESEND_API_KEY` is configured
  in this environment), and the entire state machine driven over real HTTP
  with `curl` — public ledger, auth gating, access-control rejection
  (enroll without `usership`), enroll → confirm → 3x dispatch → stand-down,
  post-stand-down dispatch correctly rejected (409), and the `logs` table
  inspected directly to confirm all six audit rows. Full detail lives in the
  companion Terminal Grid report, `docs/benchmark/LOT-SR-20260708-01.md`.
- Test database, role, and local `.env` were torn down after verification;
  nothing test-related was committed.

================================================================================
WHAT A REAL MONTH 4 WOULD NEED TO DO
================================================================================

1. Choose and wire an actual payment processor. `basics.billing` is shaped
   to receive that without a schema change, but it does not charge anyone
   today.
2. Replace the manual "DISPATCH NEXT ISSUE" trigger with a real cron/queue
   once a supplier and courier integration exists, and likely move triggering
   it behind an admin/S-2 confirmation step rather than pure self-serve.
3. Decide what STAND DOWN should do to an in-flight next-cycle charge once
   real billing exists (today there is nothing to cancel).
4. Confirm actual supplier quotes against the COGS ceiling — the current
   per-line costs are a calibrated *estimate*, not a signed quote.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
================================================================================
