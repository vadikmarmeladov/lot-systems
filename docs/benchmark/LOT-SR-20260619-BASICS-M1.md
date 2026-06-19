================================================================================
LOT SYSTEMS / SESSION REPORT
DOCUMENT: LOT-SR-20260619-BASICS-M1
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-06-19
SESSION:  claude/beautiful-johnson-yziexa
PHASE:    LOT-FM-001 MONTH 1 — LEDGER & DOCTRINE
================================================================================

STATUS:   COMPLETE
ENVELOPE: OPEN TAB live, read-only, zero COGS withheld, doctrine posted.

--------------------------------------------------------------------------------
01 // WHAT WAS BUILT
--------------------------------------------------------------------------------

MONTH 1 DELIVERABLE: LEDGER & DOCTRINE

Files created / modified:

  src/client/stores/router.ts
    — Added route `basics: void` + URL `/basics` to the router type and map.

  src/client/components/ui/Layout.tsx
    — Wired `{ label: 'Basics', route: 'basics' }` for both logged-in and
      logged-out nav arrays. Tab is now clickable and navigates.

  src/client/entries/app.tsx
    — Imported `Basics` component.
    — Added `'basics'` to the PersistentRoute type.
    — Added `<TabPanel route="basics"><Basics /></TabPanel>`.

  src/client/components/basics/doctrine.ts  [NEW]
    — 23-item RATION_MANIFEST typed with line, nomenclature, spec, cadence,
      category. All 23 items present per LOT-FM-001.
    — DOCTRINE_LINES (4 tenets), PRICE_LINE, MANUAL_REF, RATION_COUNT.
    — UpgradeState union type (NONE / USERSHIP / PENDING / ON_STRENGTH /
      STEADY_STATE / STAND_DOWN) — scaffold for M2.
    — BUILD_CYCLE array (3 phases with status and exit criteria).

  src/client/components/Basics.tsx  [NEW]
    — OPEN TAB component. Read-only. Zero billing, zero state transitions.
    — Sections:
        HEADER     — "BASICS" + LOT-FM-001 manual reference
        DOCTRINE   — 4 tenet lines + price line + margin floor
        SECTION 1  — 23-item ration ledger grouped by category
                     (NUTRITION 10 / HEALTH 7 / HYGIENE 5 / EQUIPMENT 1)
                     Columns: NO. | NOMENCLATURE | SPEC | CADENCE
        SECTION 2  — STATUS LINE (PLAN / RATION / NEXT ISSUE / PRICE)
                     reads user tags; shows ON STRENGTH or NOT ON STRENGTH
        SECTION 3  — UPGRADE PROMPT (shown when not ON STRENGTH)
                     detects Usership tag; routes to M2 enrollment gate
        BUILD CYCLE — 90-day phase tracker (M1 COMPLETE, M2/M3 PENDING)

--------------------------------------------------------------------------------
02 // RATION MANIFEST (23 items, COGS withheld per doctrine)
--------------------------------------------------------------------------------

LINE  NOMENCLATURE                       SPEC             CADENCE
────  ─────────────────────────────────  ───────────────  ─────────
01    ROLLED OATS                        40 OZ            MONTHLY
02    LENTILS, RED                       2 LB             MONTHLY
03    RICE, BROWN LONG GRAIN             3 LB             MONTHLY
04    COFFEE, DARK ROAST GROUND          12 OZ            MONTHLY
05    HONEY, RAW WILDFLOWER              12 OZ            MONTHLY
06    OLIVE OIL, COLD-PRESSED EVOO       750 ML           MONTHLY
07    SALT, KOSHER                       1 LB             MONTHLY
08    BLACK PEPPER, WHOLE                2 OZ             MONTHLY
09    APPLE CIDER VINEGAR, RAW           16 OZ            MONTHLY
10    SEEDS, MIXED (HEMP/CHIA/FLAX)      12 OZ            MONTHLY
11    VITAMIN D3                         2000 IU / 90 CT  MONTHLY
12    VITAMIN C                          500 MG / 90 CT   MONTHLY
13    ELECTROLYTE POWDER                 30 SRV           MONTHLY
14    OMEGA-3, FISH OIL                  1000 MG / 60 CT  MONTHLY
15    PROBIOTIC, MULTI-STRAIN            30 CT            MONTHLY
16    MAGNESIUM GLYCINATE                400 MG / 60 CT   MONTHLY
17    ZINC, CHELATED                     15 MG / 60 CT    MONTHLY
18    SOAP, CASTILE UNSCENTED            2 BAR            MONTHLY
19    RAZOR, SAFETY + BLADES             1 HDL / 10 BL    MONTHLY
20    FLOSS, UNWAXED                     2 CT             MONTHLY
21    TOOTHPASTE, FLUORIDE-FREE          4 OZ             QUARTERLY
22    DEODORANT, CRYSTAL MINERAL         3.5 OZ           QUARTERLY
23    JOURNAL, FIELD (LOT-FM)            1 EA             QUARTERLY

--------------------------------------------------------------------------------
03 // BUILD CYCLE STATUS
--------------------------------------------------------------------------------

■ M1  LEDGER & DOCTRINE     COMPLETE
      Exit: Stranger reads manifest and terms. Read-only. Live.

□ M2  UPGRADE & ROSTER      PENDING
      Exit: Usership member goes ON STRENGTH and back OFF, end to end.
      Build:
        — UPGRADE control + state machine
          (USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE)
        — Roster intake (sizing, shipping address, cadence start)
        — Additive billing +USD 100.00/MO via Stripe
        — STAND DOWN downgrade (drops ration, retains AI plan)
        — Issue log scaffold (per-subscriber history)
        — Server: /api/basics/enroll, /api/basics/stand-down routes
        — DB: ration_subscriptions table migration
      Requires: Stripe or equivalent billing integration, real shipping address.

□ M3  ISSUE & FULFILLMENT   PENDING
      Exit: First real ration ships. Margin verified ≥60%.
      Build:
        — Month-by-month load engine (per Section 2 cadence rules)
        — Supplier quotes locked against COGS ≤USD 40.00 ceiling
        — Printed manifest card generation (PDF or thermal-print format)
        — First issue scheduled + dispatched
        — Issue log accrues; NEXT ISSUE date advances monthly
      Requires: Fulfillment partner, supplier contracts, warehouse or 3PL.

--------------------------------------------------------------------------------
04 // DOCTRINE (posted verbatim on OPEN TAB)
--------------------------------------------------------------------------------

  BASIC is the physical layer of the LOT® System.
  One ration per operator per month. Issued. Not sold.
  The ledger is the marketing. No layer between public and manifest.
  COGS ceiling: USD 40.00 landed. Margin floor: 60%. Never breached.

  USD 100.00 / MO.

--------------------------------------------------------------------------------
05 // NOTES
--------------------------------------------------------------------------------

  — Visual style: font-mono throughout. No icons, no color, no border-radius.
    Square corners. 2px heavy rules at section breaks. Thin rules within.
    Cadence column: MONTHLY full-opacity, QUARTERLY at 50%, ANNUALLY at 30%.

  — Mirror mode: isMirrorOn flag passes text-white override (existing pattern).

  — Upgrade prompt renders only when user is NOT ON STRENGTH.
    Usership detection via UserTag.Usership enum match on me.tags array.
    Basic tag checked as string 'Basic' (not yet in UserTag enum — M2 adds it).

  — BUILD CYCLE section at bottom of page documents the 90-day plan in-product.
    Glyphs: ■ = COMPLETE, ▶ = ACTIVE, □ = PENDING.

  — Pre-existing client:js:build failure (npx esr not found in CI env) is
    unrelated to this changeset. TypeScript type-check clean on all new files.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-SR-20260619-BASICS-M1
================================================================================
