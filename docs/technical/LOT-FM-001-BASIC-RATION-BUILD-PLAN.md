# LOT-FM-001 — BASIC (RATION) MODULE — 90-DAY BUILD PLAN

CLASS: RESTRICTED // S-2 EYES
S-2: VADIK MARMELADOV
STATUS: MONTH 1 COMPLETE (this session) — MONTH 2/3 PLANNED, NOT BUILT

Source directive: LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE — MODULE: BASIC (RATION).
This document is the working plan that carries the module across its
three build months. Update it in place at the start of each month's
session; do not create a new file per month — this is the live plan, the
session reports (`docs/benchmark/LOT-SR-*.md`) are the immutable record of
what actually shipped each time.

## Doctrine, restated

LOT issues. LOT does not sell. The user who enrolls is ON STRENGTH — issued
a fixed physical load, accounted on a ledger, re-supplied on cadence. Price
is USD 100/month flat. Margin floor 60%. Landed COGS ceiling USD 40/month.
The ledger is the marketing — there is no layer between the public surface
and the actual manifest. Ship one demonstrable increment per month.

## House style (non-negotiable, all three months)

LiberationMono-Bold (fallback: Courier New, monospace). White ground /
black ink — fixed, does not follow the app's light/dark/mirror theme, the
way a printed manifest doesn't change with the light in the room.
Inversion-only hierarchy: the only emphasis device is swapping foreground
and background: no color, no font-size ramps, no icons, no border-radius.
2px rules between sections. Fixed character grid for tabular data (ch-unit
CSS grid columns). Voice: quartermaster, imperative, terse. No marketing
copy, no exclamation points, no adjectives that aren't load-bearing.

## MONTH 1 — LEDGER & DOCTRINE — STATUS: LIVE

Built this session, on branch `claude/beautiful-johnson-9gjia4`:

- `src/client/components/Basics.tsx` — the OPEN TAB surface: `RationStatusLine`
  (reusable status-line component), Doctrine block, Issue Terms block (price
  line: USD 100/mo flat), 23-item Ration Ledger (nomenclature + category +
  cadence — COGS deliberately withheld from this public surface), Build
  Status block (honest month-by-month state, so the tab never overclaims
  what's live).
- `src/client/stores/router.ts` — `basics` route (`/basics`) registered.
- `src/client/components/ui/Layout.tsx` — nav 'Basics' label wired to the
  new route (was a disabled placeholder — `{ label: 'Basics' }` with no
  `route`, alongside still-disabled 'Self-care' / 'Kids' / 'Home').
- `src/client/entries/app.tsx` — `Basics` mounted as a persistent `TabPanel`.

Read-only. No billing, no roster, no enrollment logic — Month 1 exit
criterion is exactly "a stranger can read what LOT issues and on what
terms," nothing more.

**Known scope gap, logged honestly:** the tab is reachable by any
authenticated LOT session (no Usership/paid-tier gate — that's the "OPEN"
part relative to the rest of the app), but it is not yet reachable by a
fully logged-out visitor. This app's client bundle currently loads behind
`getMe()` in `app.tsx` — there's no unauthenticated route into the SPA
today (the truly public surfaces are separate bundles: `/about`, `/login`,
`/public-profile`). Making Basics reachable pre-login would mean either a
new public entry point (new webpack entry + server route, mirroring
`about.tsx`) or loosening the app shell's auth gate — both are real
architecture decisions, not a Month 1 sub-task, and are logged here as a
candidate for a future session rather than silently declared done.

## MONTH 2 — UPGRADE & ROSTER — STATUS: PLANNED, NOT BUILT

Goal: a Usership (AI plan) member can go ON STRENGTH and back OFF, end to
end, inside the app.

Planned surface:
- **State machine** (client store, e.g. `src/client/stores/basicsRation.ts`):
  `USERSHIP_AI -> PENDING -> ON_STRENGTH -> STEADY_STATE`, with `STAND_DOWN`
  transitioning `ON_STRENGTH`/`STEADY_STATE` back toward `USERSHIP_AI`
  (drops the ration, always retains the AI plan — never downgrades AI
  access as a side effect of ration cancellation).
- **UPGRADE control** on the Basics tab: replaces the current static
  "UPGRADE CONTROL: NOT YET ISSUED" line with a real control, gated to
  users already carrying `UserTag.Usership`. Disabled/absent for accounts
  without Usership — BASIC is additive on top of Usership, not a
  standalone entry point (per directive: "additive $100/mo billing").
- **Roster intake form**: sizing (garment sizes for undergarments/socks),
  shipping address, cadence start date. Server-side: new `user` fields or
  a `RationEnrollment` model (mirror the existing `models/` pattern, e.g.
  `src/server/models/user.ts` conventions) — decide during that session
  whether this is columns on `User` or its own table; a monthly recurring
  ration with its own status lifecycle likely wants its own model so
  Month 3's issue log has somewhere to live.
- **Recurring billing**: additive $100/mo on top of existing Usership
  billing. Reuse whatever payment rail already handles Usership
  subscriptions (check `src/server/routes/` and `src/server/utils/` for
  the existing subscription/payment integration before building a new
  one — Month 2's first task is reading that code, not assuming Stripe).
- **STAND DOWN downgrade**: cancels the ration, does not touch Usership/AI
  tags or access.
- **Issue log scaffold**: empty/ready structure for Month 3 to write into
  (`NEXT ISSUE` field, issue history array) — scaffolded, not populated.

Exit criterion: a real Usership member can click UPGRADE, complete roster
intake, see status flip to ON STRENGTH, and click STAND DOWN to revert —
without losing their Usership/AI access at any point in that cycle.

## MONTH 3 — ISSUE & FULFILLMENT — STATUS: PLANNED, NOT BUILT

Goal: the first real ration ships to a real subscriber, margin verified
≥60%.

Planned surface:
- **Month-by-month load engine**: walks the 23-item cadence table from
  Month 1 (`RATION_LOAD` in `Basics.tsx` — promote it to a shared
  `#shared/constants` module once Month 3 needs it server-side too) and
  computes which items are due in a given calendar month for a given
  enrollment start date (MONTHLY items every month, QUARTERLY every 3rd
  month from enrollment, BI-MONTHLY every 2nd, ANNUAL once/year).
- **Supplier quotes vs. COGS ceiling**: a real sourcing pass — get actual
  landed quotes per item (unit cost + shipping + packaging), sum the
  active month's load, confirm total stays ≤ USD 40.00. This is the one
  step in the whole module that is genuinely external/manual (supplier
  outreach), not something to fabricate — if quotes aren't in yet when
  this session runs, say so plainly rather than inventing numbers.
- **Printed manifest card**: a physical card that ships inside the box
  each cycle, listing that month's contents in the same house style as
  the Basics tab (LiberationMono-Bold, white/black, 2px rules) — the
  digital ledger and the physical card should read as the same document.
  Generate as a print-ready PDF/HTML (check if `docs/badges/` PDF
  generation tooling — used for the Badge Codex — is reusable here before
  building new tooling).
- **First issue dispatch**: schedule and mark dispatched for the first
  real subscriber; wire `NEXT ISSUE` to advance on the roster record from
  Month 2.
- **Issue log accrual**: each dispatch appends to the issue log scaffolded
  in Month 2.

Exit criterion: first real ration physically ships, margin verified ≥60%
against real supplier quotes (not estimates).

## Carry-forward notes for whoever runs Month 2/3

- The 23-item load and category assignments in `Basics.tsx` were
  originated this session (no prior LOT-FM-001 item list existed in the
  repo) — internally consistent with the About.tsx FMCG Subscription lore
  (toothbrushes, underwear, packaged goods, personal hygiene) but not
  identical to it (About.tsx describes a separate, larger, pre-existing
  $399/mo "Basic Essentials" concept — do not conflate the two; LOT-FM-001
  BASIC is the $100/mo ration specifically, additive to Usership).
- `About.tsx` is WIKI-GUARD protected (master-authoritative, rewritten by
  every wiki session) — Month 2/3 work should not edit it directly except
  through a wiki session; if the Basics feature needs an About.tsx
  mention, flag it for the next wiki pass instead of editing it inline
  from a feature session.
- COGS figures are intentionally absent from both the public tab and this
  plan doc's Month 1/2 sections — they belong in an internal-only
  document once real supplier numbers exist (Month 3), not fabricated
  here.
