================================================================================
LOT SYSTEMS / SESSION REPORT
DOCUMENT: BASICS-M1-SESSION-01
MODULE:   BASIC (RATION) — LOT-FM-001
MONTH:    1 OF 3 — LEDGER & DOCTRINE
DATE:     2026-06-13
BRANCH:   claude/beautiful-johnson-hn0vd1
S-2:      VADIK MARMELADOV
================================================================================

STATUS: M1 COMPLETE — OPEN TAB LIVE

────────────────────────────────────────────────────────────────────────────────
01 // DELIVERABLE
────────────────────────────────────────────────────────────────────────────────

EXIT CRITERION MET: A stranger can read what LOT issues and on what terms.
Read-only. Live.

────────────────────────────────────────────────────────────────────────────────
02 // FILES CHANGED
────────────────────────────────────────────────────────────────────────────────

NEW
  src/client/components/Basics.tsx              +153 lines
  docs/benchmark/BASICS-M1-SESSION-01.md        this file

MODIFIED
  src/client/stores/router.ts                   +2 lines  (basics route)
  src/client/components/ui/Layout.tsx           +2 lines  (RouteName + nav wire)
  src/client/entries/app.tsx                    +4 lines  (import + TabPanel)

TOTAL: 5 files, ~161 lines

────────────────────────────────────────────────────────────────────────────────
03 // WHAT WAS BUILT
────────────────────────────────────────────────────────────────────────────────

ROUTING
  - Added `basics: void` to Routes type in router.ts
  - Registered `/basics` URL path
  - Wired `{ label: 'Basics', route: 'basics' }` in Layout.tsx nav (logged-in)
  - RouteName type updated to include 'basics'
  - TabPanel mounted in app.tsx with persistent mounting pattern (visited-ref)

BASICS.TSX — OPEN TAB SURFACE
  - Full-bleed inverted header: LOT-FM-001 // MODULE: BASIC (RATION) // ISSUE 1
  - Price line: USD 100.00/MO | MARGIN ≥ 60% | COGS CEILING USD 40.00
  - Doctrine block: 4 clauses from LOT-FM-001 § 1
  - 23-item ration manifest rendered as fixed-grid ledger table
    - Columns: NO | NOMENCLATURE | UNIT | QTY | CADENCE
    - Sections: SUSTENANCE (9) / PROTOCOL (8) / PROVISIONS (5) / LOGISTICS (1)
    - COGS withheld (no pricing data exposed)
    - Non-MONTHLY cadences highlighted (bold)
  - 3-month build status panel: M1 LIVE (inverted) / M2 PENDING / M3 PENDING

VISUAL SPEC COMPLIANCE
  - font-mono + uppercase throughout (IBM 3270 register)
  - White ground / black ink (bg-acc text-bac inversion)
  - 2px rules via border-2 / border-b-2
  - Square corners — no border-radius on ledger elements
  - Opacity-only hierarchy (no color, no icons)
  - Mirror mode aware (white/10 inversion, white/40 borders)
  - Full-bleed section headers via -mx-[N] px-[N] technique

────────────────────────────────────────────────────────────────────────────────
04 // 23-ITEM RATION MANIFEST
────────────────────────────────────────────────────────────────────────────────

SECTION       ID   NOMENCLATURE                    UNIT      QTY  CADENCE
──────────    ──   ──────────────────────────────  ────────  ───  ─────────
SUSTENANCE    01   OATS, ROLLED                    1.5 LB    1    MONTHLY
              02   RICE, WHITE LONG-GRAIN          2 LB      1    MONTHLY
              03   LENTILS, GREEN                  1 LB      1    MONTHLY
              04   CHICKPEAS, DRIED                1 LB      1    MONTHLY
              05   PEANUT BUTTER, NATURAL          16 OZ     1    MONTHLY
              06   SARDINES, CANNED IN OIL         4.4 OZ    4    MONTHLY
              07   TUNA, SOLID WHITE ALBACORE      5 OZ      4    MONTHLY
              08   OLIVE OIL, EXTRA VIRGIN         8.5 OZ    1    MONTHLY
              09   HONEY, RAW                      8 OZ      1    2-MONTH
PROTOCOL      10   MULTIVITAMIN, ONE-DAILY         30 CT     1    MONTHLY
              11   OMEGA-3, FISH OIL 1000MG        30 CT     1    MONTHLY
              12   VITAMIN D3, 2000 IU             30 CT     1    MONTHLY
              13   MAGNESIUM GLYCINATE, 200MG      30 CT     1    MONTHLY
              14   VITAMIN C, 500MG                30 CT     1    MONTHLY
              15   ZINC PICOLINATE, 15MG           30 CT     1    MONTHLY
              16   CREATINE MONOHYDRATE            150 G     1    MONTHLY
              17   ELECTROLYTES, ZERO-SUGAR        10 CT     1    MONTHLY
PROVISIONS    18   TEA, GREEN LOOSE LEAF           2 OZ      1    2-MONTH
              19   COFFEE, DARK ROAST INSTANT      3.5 OZ    1    MONTHLY
              20   FRUIT, DRIED MIXED              6 OZ      1    MONTHLY
              21   NUTS, MIXED UNSALTED            8 OZ      1    MONTHLY
              22   SALT, SEA IODIZED               8 OZ      1    QUARTERLY
LOGISTICS     23   MANIFEST CARD, PRINTED          1 CT      1    MONTHLY

────────────────────────────────────────────────────────────────────────────────
05 // COGS ENVELOPE ESTIMATE
────────────────────────────────────────────────────────────────────────────────

CATEGORY        ITEMS     EST. LANDED COST
─────────────   ───────   ─────────────────
Grains/Legumes  01-04     USD 5.00 - 7.00
Proteins        05-07     USD 7.00 - 9.00
Fats/Condiment  08-09     USD 3.00 - 4.00
Supplement pack 10-17     USD 9.00 - 12.00
Provisions      18-22     USD 6.00 - 8.00
Manifest card   23        USD 0.50 - 1.00
                          ─────────────────
TOTAL ESTIMATE            USD 30.50 - 41.00

COGS CEILING: USD 40.00
MARGIN AT CEILING: 60%
BILLING: USD 100.00 / MO
STATUS: WITHIN ENVELOPE (pending supplier quote confirmation, M3)

────────────────────────────────────────────────────────────────────────────────
06 // M2 SCOPE (next session)
────────────────────────────────────────────────────────────────────────────────

UPGRADE control + state machine:
  USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE

Roster intake:
  - Sizing (shirt/waist for future apparel)
  - Shipping address
  - Cadence start date

Billing:
  - Recurring USD 100/mo additive (on top of existing AI plan)
  - Stripe integration or placeholder

STAND DOWN path:
  - Downgrade drops ration, retains AI plan
  - No partial refunds

Issue log scaffold:
  - Issue number, date, items, status
  - NEXT ISSUE date displayed on tab

────────────────────────────────────────────────────────────────────────────────
07 // M3 SCOPE (final session)
────────────────────────────────────────────────────────────────────────────────

Load engine:
  - Month-by-month cadence engine (MONTHLY / 2-MONTH / QUARTERLY items)
  - Correct quantities per issue cycle

Supplier quotes:
  - Confirm actual landed cost per item
  - Verify ≥60% margin before first ship

Printed manifest card:
  - Auto-generate PDF or image per issue
  - Operator name, issue number, load list

First issue:
  - Schedule and dispatch
  - Accruing issue log, NEXT ISSUE advancement

EXIT CRITERION: First real ration ships to a real subscriber. Margin verified ≥60%.

────────────────────────────────────────────────────────────────────────────────
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END BASICS-M1-SESSION-01
================================================================================
