================================================================================
LOT SYSTEMS / FIELD MANUAL
DOCUMENT: LOT-FM-001
TITLE:    BASIC RATION MODULE — CIVILIAN RATION SUBSCRIPTION
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
STATUS:   MONTH 1 LIVE · MONTH 2 SCOPED · MONTH 3 SCOPED
DATE:     2026-08-12
================================================================================

This manual specifies the LOT civilian ration subscription as a single issued
system: doctrine, the 23-item ration load, the visual identity in formal
military-spec language, and its transfer into LOT software — the public
OPEN TAB and the UPGRADE path from LOT Usership (AI plan) into BASIC.

--------------------------------------------------------------------------------
SECTION 0 — DOCTRINE
--------------------------------------------------------------------------------

BASIC is the physical layer of the LOT® System. The Memory Engine, Quantum
Intent Engine, and Badge Codex govern the operator's digital record. BASIC
governs material resupply. Same operator, same record, second layer.

Governing rules, non-negotiable:

  1. ISSUE, DO NOT SELL.        The user is ON STRENGTH, not a customer.
  2. USD 100.00 / MONTH.        Flat. No tiers inside BASIC.
  3. MARGIN FLOOR: 60%.         COGS ceiling USD 40.00 landed. Never breached.
  4. THE LEDGER IS THE MARKETING.  No layer between public and manifest —
     the ration list a stranger reads is the same list that ships.
  5. SHIP WORKING INCREMENTS MONTHLY.  Each of the three build months ends
     in a demonstrable, live state — not a design document.

--------------------------------------------------------------------------------
SECTION 1 — VISUAL IDENTITY (formal spec)
--------------------------------------------------------------------------------

  TYPEFACE:     LiberationMono register (font-mono stack; bold for structure,
                regular for ledger body). No serif, no display face.
  GROUND / INK: Fixed white ground / black ink. Not theme-reactive — the
                ration ledger reads identically for every operator and every
                stranger, regardless of the viewer's app theme.
  HIERARCHY:    Inversion-only. Emphasis is black-on-white flipped to
                white-on-black (the STATUS LINE bar), never color, never size
                alone.
  RULES:        2px solid rule under structural headers and around the
                UPGRADE block. 1px rule between ledger rows and section
                dividers. No other border weights.
  CORNERS:      Square. border-radius: 0 throughout. No exceptions.
  GRID:         Fixed-column layout (NO. / NOMENCLATURE / SPEC / CADENCE),
                tabular alignment, uppercase tracked labels.
  VOICE:        Quartermaster. Imperative, terse. No marketing copy, no
                superlatives, no icons — glyphs and rules only.

--------------------------------------------------------------------------------
SECTION 2 — RATION MANIFEST (23 items)
--------------------------------------------------------------------------------

Source of truth: src/client/components/basics/doctrine.ts (RATION_MANIFEST).
Public ledger shows NOMENCLATURE + SPEC + CADENCE. COGS withheld from the
public surface — see Section 5 for the internal planning estimate.

  NUTRITION (10, all MONTHLY)
    01 Rolled oats            40 oz
    02 Lentils, red           2 lb
    03 Rice, brown long grain 3 lb
    04 Coffee, dark roast     12 oz
    05 Honey, raw wildflower  12 oz
    06 Olive oil, cold-press  750 ml
    07 Salt, kosher           1 lb
    08 Black pepper, whole    2 oz
    09 Apple cider vinegar    16 oz
    10 Seeds, mixed           12 oz

  HEALTH (7, all MONTHLY)
    11 Vitamin D3             2000 IU / 90 ct
    12 Vitamin C              500 mg / 90 ct
    13 Electrolyte powder     30 srv
    14 Omega-3, fish oil      1000 mg / 60 ct
    15 Probiotic, multi       30 ct
    16 Magnesium glycinate    400 mg / 60 ct
    17 Zinc, chelated         15 mg / 60 ct

  HYGIENE (5: 3 MONTHLY, 2 QUARTERLY)
    18 Soap, castile          2 bar          MONTHLY
    19 Razor + blades         1 hdl / 10 bl  MONTHLY
    20 Floss, unwaxed         2 ct           MONTHLY
    21 Toothpaste, fluor-free 4 oz           QUARTERLY
    22 Deodorant, mineral     3.5 oz         QUARTERLY

  EQUIPMENT (1, QUARTERLY)
    23 Journal, field (LOT-FM) 1 ea

--------------------------------------------------------------------------------
SECTION 3 — OPEN TAB (Month 1 — BUILT, LIVE)
--------------------------------------------------------------------------------

STATUS: LIVE on this branch. Read-only. No sale flow.

  In-app tab:  Basics nav button -> client route /basics (src/client/stores/
               router.ts) -> TabPanel in src/client/entries/app.tsx renders
               <Basics /> inside the authenticated app shell.
  Public page: GET /basics (src/server/index.ts) — no authentication hook,
               serves its own bundle (src/client/entries/basics.tsx ->
               dist/client/js/basics.js) via templates/basics-standalone.ejs.
               A stranger with no LOT account can load this URL and read the
               full manifest, doctrine, and price line.
  Component:   src/client/components/Basics.tsx — renders the inverted
               STATUS LINE bar, doctrine + price line, the 23-item ledger by
               category, an OPERATOR STATUS block (PLAN / RATION — reads
               user.tags when authenticated, shows NONE for a stranger), and
               an UPGRADE PATH block that is informational only this month
               ("ENROLLMENT OPENS — M2 BUILD CYCLE").
  Data:        src/client/components/basics/doctrine.ts — RATION_MANIFEST,
               DOCTRINE_LINES, PRICE_LINE. Single source of truth; the public
               page and the in-app tab render the same data, so the ledger
               cannot drift from the manifest (Rule 4).

EXIT CONDITION MET: a stranger can read what LOT issues and on what terms.

--------------------------------------------------------------------------------
SECTION 4 — UPGRADE & ROSTER (Month 2 — SCOPED, NOT BUILT)
--------------------------------------------------------------------------------

Not implemented this session by design — this section is the build order for
the next monthly increment, not a partial implementation. An earlier,
now-divergent prototype (branch claude/nifty-allen-jWyOe, 2026-05-30) built a
full first pass of this scope; its schema and route shape are recorded below
as the reference design to re-verify against current master before building.

STATE MACHINE
  USERSHIP/AI -> PENDING -> ON_STRENGTH -> STEADY_STATE
  ON_STRENGTH -> STAND DOWN -> USERSHIP/AI  (drops ration, retains AI plan)

  UPGRADE requires USERSHIP/AI as the base layer (BASIC is additive, never
  standalone — a BASIC-only account is not a defined state).

DATA MODEL (reference shape — verify column set against current User model
before migrating; the prototype predates ~2.5 months of schema drift)
  basic_subscriptions
    id, userId (FK users, unique), status ('PENDING'|'ON_STRENGTH'|
    'STEADY_STATE'|'STOOD_DOWN'), shippingName/Line1/Line2/City/State/Zip/
    Country, shirtSize, shoeSize, cadenceStart, createdAt, updatedAt

ROUTES (reference — prefix under /api, mirror existing auth middleware
pattern in src/server/routes/api.ts)
  GET  /basic/subscription   current user's BASIC state
  POST /basic/upgrade        USERSHIP/AI -> PENDING (records intent)
  POST /basic/roster         sizing + shipping intake -> PENDING -> ON_STRENGTH
  POST /basic/stand-down     ON_STRENGTH -> USERSHIP/AI (STAND DOWN)

BILLING
  Additive recurring charge, +USD 100.00/MO on top of the existing Usership
  charge. Reuse the existing Stripe customer (stripeCustomerId on User) —
  add a second subscription item, do not create a parallel billing identity.

UI ADDITIONS (Basics.tsx, Section 3 block becomes interactive)
  UpgradeBlock — replaces the current informational-only card with a real
  control once USERSHIP/AI is confirmed: "REQUEST UPGRADE" -> PENDING state.
  RosterBlock  — sizing + shipping form, gates PENDING -> ON_STRENGTH.
  STAND DOWN control, visible only to ON_STRENGTH / STEADY_STATE users.

EXIT CONDITION (Month 2): a Usership member can go ON STRENGTH and back OFF,
end to end, with real billing and a persisted roster record.

--------------------------------------------------------------------------------
SECTION 5 — ISSUE & FULFILLMENT (Month 3 — SCOPED, NOT BUILT)
--------------------------------------------------------------------------------

DATA MODEL (reference shape, same provenance note as Section 4)
  basic_issues
    id, subscriptionId (FK basic_subscriptions), userId (FK users),
    issueNumber, periodLabel, itemCount, status ('SCHEDULED'|'SHIPPED'|
    'DELIVERED'), issuedAt, shippedAt, deliveredAt, trackingNumber,
    createdAt, updatedAt — indexed on subscriptionId and userId.

LOAD ENGINE
  Builds each month's actual box from RATION_MANIFEST filtered by cadence
  (MONTHLY every issue; QUARTERLY every 3rd; ANNUALLY every 12th, from
  cadenceStart). Confirms the resulting item set against supplier quotes
  before the COGS ceiling check below.

ROUTES (reference)
  GET  /basic/issues              issue log for current user
  POST /basic/issues/:id/advance  SCHEDULED -> SHIPPED -> DELIVERED;
                                   DELIVERED auto-creates the next issue

MARGIN CHECK (internal planning estimate — never rendered on the public
ledger; Rule 4 withholds COGS from the public surface, not from this manual)

  Category    Monthly landed cost estimate (23-item load, USD, ESTIMATE)
  NUTRITION   ~14.50
  HEALTH      ~9.00
  HYGIENE     ~4.50 (quarterly items prorated /3)
  EQUIPMENT   ~1.25 (quarterly item prorated /3)
  ------------------------------------------------
  TOTAL       ~29.25   ceiling USD 40.00 — headroom ~10.75
  Margin at USD 100.00 price: ~70.75% — clears the 60% floor.

  Mark ESTIMATE until real supplier quotes are confirmed per Rule 3 — do not
  present this table as final pricing.

MANIFEST CARD
  Printable, full-screen issue manifest (per-issue item list + tracking) —
  same terminal-grid identity as the OPEN TAB, generated from the same
  RATION_MANIFEST + issue record. No new visual language.

EXIT CONDITION (Month 3): first real ration ships to a real subscriber;
margin verified >= 60% against actual (not estimated) landed cost.

--------------------------------------------------------------------------------
SECTION 6 — PROVENANCE
--------------------------------------------------------------------------------

This module has been attempted on prior sessions of this recurring build
task and never shipped to master:
  claude/nifty-allen-jWyOe        2026-05-30  full 3-month attempt, 24 files,
                                   +1725 (DB + API + UI). Base predates PR
                                   #50 — too drifted to cherry-pick cleanly;
                                   its schema/route design is preserved above.
  claude/beautiful-johnson-56p7ov 2026-06-12  Month-1-only attempt, 5 files,
                                   +293. Closer to current master; this
                                   session's Basics.tsx and doctrine.ts are a
                                   rewrite in that lineage, adapted to the
                                   current router/Layout/app.tsx shape and
                                   converted to fixed (non-theme-reactive)
                                   styling per the stricter visual spec.

Neither prior branch was cherry-picked; both were read for content and
design, then re-implemented against current master to avoid carrying
~2-2.5 months of drift into a single merge. See LOT-DOCTRINE.md, Cross-
Session Continuity clause.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-FM-001
================================================================================
