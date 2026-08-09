================================================================================
LOT SYSTEMS / FIELD MANUAL
DOCUMENT: LOT-FM-001
TITLE:    BASIC (RATION) — CIVILIAN RATION SUBSCRIPTION, 90-DAY BUILD
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
STATUS:   MONTH 1 OF 3 — LIVE (docs/benchmark/LOT-SR-20260809-01.md)
DATE:     2026-08-09 (updated)
================================================================================

--------------------------------------------------------------------------------
00 // DOCTRINE
--------------------------------------------------------------------------------
LOT ISSUES. LOT DOES NOT SELL.

The Basic ration is the hardware/physical layer of the LOT System — the
material translation of what the software already tracks (journal, recovery,
focus, grounding). It is standard issue, not a purchase. On enrollment the
operator goes ON STRENGTH: carried on the roster, resupplied on cadence,
accountable for the return of non-consumable issue on STAND DOWN.

The ledger is the marketing. There is no layer between the public manifest
and what actually ships — the OPEN TAB is the complete public account of
what LOT issues and on what terms, before enrollment exists.

Not a store. A ration distribution system. (Consistent with the earlier
framing in docs/corporate/LOT-FEATURE-INVENTORY-2026.md:598-601 — this
build supersedes the code from that framing's now-deleted feature branches;
the doctrine carries forward, the implementation is new.)

--------------------------------------------------------------------------------
01 // OPERATING RULES (non-negotiable across all 3 months)
--------------------------------------------------------------------------------
PRICE:        USD 100.00 / month, additive to Usership (does not replace the
              $99/mo AI plan — a Basic subscriber carries both charges).
MARGIN:       >= 60% gross margin, every issue, every month.
COGS CEILING: <= USD 40.00 landed cost per monthly issue. Never breached.
VOICE:        Quartermaster. Imperative. Terse. No marketing copy, no color,
              no icons, no border-radius. (MILITARY PURITY, LOT-LEXICON rev A,
              20260603 — reused, not reinvented, for this tab.)
CADENCE:      Ship one demonstrable increment per month. Each month ends in a
              working state a real user (or S-2) can exercise end to end.

--------------------------------------------------------------------------------
02 // THE 23-ITEM RATION LOAD
--------------------------------------------------------------------------------
Public-facing nomenclature and cadence (COGS withheld from the public ledger
by design — it is not a marketing input). Full table lives in
src/client/components/BasicsPage.tsx (RATION_LOAD) and renders live on the
Basics tab (OPEN TAB).

CORE (every issue, 3 items):        FIELD LOG, QM PEN, STATUS CARD
ROTATING (14 items, cycles across
  the catalog on the monthly load
  engine, Month 3):                 JOURNAL (2), RECOVERY (5), FOCUS (4),
                                     GROUND (3)
QUARTERLY (3 items):                FIELD PATCH, KIT BAG, FM BOOKLET
SEMI-ANNUAL (1 item):                RANK PIN
ON ENROLLMENT / ANNIVERSARY (2):    DOG TAG, ANNIVERSARY PATCH SET

Design intent: 3 CORE items anchor every box (recognizable, low-COGS,
consumable-adjacent). The 14 ROTATING items are the load-engine's job in
Month 3 — pick a combination per month that (a) touches the full catalog on
a reasonable rhythm and (b) stays under the $40 landed ceiling together with
the 3 CORE items. QUARTERLY/SEMI-ANNUAL/ANNUAL items are low-frequency,
higher-perceived-value issue (insignia, printed FM) that do not recur monthly
and so do not pressure the monthly COGS ceiling.

--------------------------------------------------------------------------------
03 // MONTH-BY-MONTH BUILD
--------------------------------------------------------------------------------

MONTH 1 — LEDGER & DOCTRINE  ................................  STATUS: DONE
  Built:  Basics tab wired into the nav (Layout.tsx `Basics` link, previously
          present but disabled with no route — now `route: 'basics'`).
          New `basics` route (router.ts) rendering BasicsPage.tsx: doctrine
          statement, 23-item ledger table, price line, status-line component
          (MODE / ACCESS / ROSTER / NEXT ISSUE), forced terminal register.
          No login required — public, read-only, matches OPEN TAB doctrine.
  Exit:   A stranger can read what LOT issues and on what terms. Confirmed —
          page renders with no `me` dependency, no auth gate.

MONTH 2 — UPGRADE & ROSTER (Usership AI -> BASIC)  ..........  STATUS: PLANNED
  Build:
    - UPGRADE control on the Basics tab, visible only to UserTag.Usership /
      UserTag.RND / UserTag.Admin holders (existing tag-gate pattern, see
      Settings.tsx / System.tsx `isPaidAccount` checks).
    - State machine: USERSHIP/AI -> PENDING -> ON STRENGTH -> STEADY STATE.
      Persisted server-side (new `me.metadata.basicsStatus` field or a
      dedicated table — decide at build time based on roster-intake shape;
      SR-20260605-01 flagged "2 DB tables" for the original design, worth
      re-validating against actual Month-2 scope rather than assumed).
    - Roster intake form: sizing, shipping address, cadence start date.
      Mirror the Settings.tsx pattern (local useState per group, curried
      onChange, immediate-save toggles, single submit for the address block).
    - Recurring $100/mo additive billing. Repo has NO existing Stripe
      integration (`stripeCustomerId` column exists on User but is narrative
      flavor text only, never called — confirmed this session). Two paths:
      (a) integrate real Stripe Checkout/Billing before Month 2 ships
          real charges, or
      (b) ship the state machine and roster with billing marked
          SIMULATED/PENDING, matching the honest-engineering doctrine rather
          than faking a charge. Recommend (b) for the Month-2 demo, (a) as a
          prerequisite before any real operator goes ON STRENGTH for money.
    - STAND DOWN downgrade path: drops the ration (STEADY STATE -> USERSHIP/
      AI), retains the Usership AI plan. Symmetric to the UPGRADE control.
    - Issue log scaffold: an append-only table/log recording each ration
      event (ENROLLED, ISSUED, STAND_DOWN), separate from the QIE `logs`
      event stream (different domain — physical fulfillment, not behavioral
      signal) but reusing the same event-log architecture pattern.
  Exit:  A Usership member can go ON STRENGTH and back OFF, end to end,
         against real persisted state (billing may be simulated pending
         Stripe integration — see above).

MONTH 3 — ISSUE & FULFILLMENT  ...............................  STATUS: PLANNED
  Build:
    - Month-by-month load engine: for a given roster member and calendar
      month, select the CORE 3 + a ROTATING slice from the 14-item catalog
      such that (a) no item repeats within its declared cadence window and
      (b) landed cost stays <= $40. Simplest correct approach: precomputed
      12-month rotation table (deterministic, auditable, no runtime
      optimization needed for a 14-item/12-month catalog) rather than a
      live bin-packing solver.
    - Supplier quotes confirmed against the COGS ceiling (an S-2/ops task,
      not code — but the load-engine's item costs must be data the system
      can check margin against; add a COGS field to the item catalog,
      server-side only, never serialized to the public ledger response).
    - Printed manifest card generation: a per-issue PDF/print artifact
      (candidate: reuse the `pdf` skill / existing PDF generation pattern
      already used for badge codices — `docs/badges/pdf` exists as
      precedent) listing that month's specific items for that operator.
    - First issue scheduled and dispatched (real-world fulfillment action —
      out of scope for automated code, but the system must produce the
      manifest + shipping record the operator hands to fulfillment).
    - Issue log accrues (from Month 2 scaffold); NEXT ISSUE field on the
      Basics tab status line advances from the placeholder "—" to a real
      date once a roster member has an active cadence.
  Exit:  First real ration ships to a real subscriber. Margin verified
         >= 60% against actual landed costs, not estimates.

--------------------------------------------------------------------------------
04 // DEPENDENCIES AND OPEN RISKS (carried to Month 2 planning)
--------------------------------------------------------------------------------
- No Stripe (or any payment processor) integration exists anywhere in this
  codebase today. Month 2's "recurring $100/mo additive billing" cannot be
  real money without this. Flag for S-2 decision: build Stripe now, or ship
  Month 2's state machine on simulated billing and gate real enrollment
  behind a manual/S-2-approved flip.
- No physical-fulfillment or shipping-carrier integration exists. Month 3's
  "dispatch" step is either a manual ops handoff (S-2 or a fulfillment
  partner reads the generated manifest and ships by hand) or a future
  carrier-API integration — out of scope for this build unless directed.
- Roster intake needs a decision on data model: extend `User`/`me.metadata`
  (fast, consistent with how other LOT features store per-user state) vs. a
  dedicated `BasicsRoster` table (cleaner audit trail for a program that
  involves real shipping addresses and real money). Recommend the dedicated
  table given the PII/financial sensitivity — decide at Month 2 build time.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-FM-001
================================================================================
