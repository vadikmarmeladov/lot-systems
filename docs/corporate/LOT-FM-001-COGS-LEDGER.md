================================================================================
LOT-FM-001 — COGS LEDGER (INTERNAL — NOT SHIPPED TO CLIENT)
CLASS: RESTRICTED // S-2 EYES
================================================================================

Unit cost worksheet for the 23-item ration load (see
`src/shared/basicsRation.ts` for nomenclature + cadence — the client-safe
half of this manifest). This ledger holds the other half: landed unit
cost per item, monthly-equivalent cost, and the margin check against the
$100/mo issue price. Ceiling: $40/mo landed, floor: 60% margin.

ALL UNIT COSTS BELOW ARE ESTIMATE — small-batch commodity FMCG pricing,
not confirmed supplier quotes. Real quotes are a procurement action, not
a code change; this worksheet is the tracking surface for that work, not
a substitute for it. Do not report margin as "verified" until the
ESTIMATE column is replaced with QUOTED and a supplier + unit cost are
on file.

--------------------------------------------------------------------------------
MONTHLY-CADENCE ITEMS (12 items, cost applied every issue)
--------------------------------------------------------------------------------
CODE       NOMENCLATURE                    UNIT COST   STATUS
FM001-01   TOOTHBRUSH, SOFT BRISTLE         $0.35      ESTIMATE
FM001-02   TOOTHPASTE, FLUORIDE, 3OZ        $0.60      ESTIMATE
FM001-03   FLOSS, WAXED, 50M SPOOL          $0.40      ESTIMATE
FM001-04   SOAP, BAR, UNSCENTED             $0.45      ESTIMATE
FM001-05   SHAMPOO, 3OZ TRAVEL              $0.55      ESTIMATE
FM001-06   DEODORANT, ALUMINUM-FREE         $1.10      ESTIMATE
FM001-07   RAZOR CARTRIDGE, 4-PACK          $2.20      ESTIMATE
FM001-08   HAND SANITIZER, 2OZ              $0.50      ESTIMATE
FM001-09   MULTIVITAMIN, 30-DAY SUPPLY      $2.50      ESTIMATE
FM001-10   ELECTROLYTE PACKET, 10-COUNT     $1.80      ESTIMATE
FM001-11   PEN, BLACK INK, RETRACTABLE      $0.25      ESTIMATE
                                            ─────
SUBTOTAL (monthly items, per issue)         $10.70

--------------------------------------------------------------------------------
QUARTERLY-CADENCE ITEMS (8 items, cost applied 1-in-3 issues → /3)
--------------------------------------------------------------------------------
CODE       NOMENCLATURE                    UNIT COST   MONTHLY-EQUIV   STATUS
FM001-12   LIP BALM, SPF 15                 $0.60      $0.20           ESTIMATE
FM001-13   NAIL CLIPPER, STEEL              $0.90      $0.30           ESTIMATE
FM001-14   COTTON SWAB, 100-COUNT           $0.50      $0.17           ESTIMATE
FM001-15   UNDERSHIRT, COTTON, CREW         $4.50      $1.50           ESTIMATE
FM001-16   BRIEF, COTTON, 3-PACK            $6.00      $2.00           ESTIMATE
FM001-17   SOCK, WOOL-BLEND, 3-PACK         $5.40      $1.80           ESTIMATE
FM001-18   NOTEBOOK, POCKET 3.5X5.5         $1.20      $0.40           ESTIMATE
FM001-19   BATTERY, AA, 4-PACK              $1.50      $0.50           ESTIMATE
FM001-20   LIGHTER, WATERPROOF              $1.80      $0.60           ESTIMATE
                                                        ─────
SUBTOTAL (quarterly items, monthly-equivalent)          $7.47

--------------------------------------------------------------------------------
SEMI-ANNUAL / ANNUAL ITEMS (2 items)
--------------------------------------------------------------------------------
CODE       NOMENCLATURE                    UNIT COST   MONTHLY-EQUIV   STATUS
FM001-21   SUNSCREEN, SPF 30, TRAVEL        $2.40      $0.40           ESTIMATE
FM001-22   FIRST-AID KIT, COMPACT           $6.00      $1.00           ESTIMATE
FM001-23   SEWING KIT, TRAVEL               $3.00      $0.25           ESTIMATE
                                                        ─────
SUBTOTAL (semi/annual, monthly-equivalent)              $1.65

--------------------------------------------------------------------------------
LANDED COST ROLLUP (per issue, average month)
--------------------------------------------------------------------------------
GOODS SUBTOTAL (monthly-equivalent)                     $19.82
PACKAGING + INSERT (manifest card, mailer)     ESTIMATE  $2.50
SHIPPING (domestic, small parcel)              ESTIMATE  $6.50
                                                        ─────
LANDED COST, PER ISSUE                                  $28.82

ISSUE PRICE                                             $100.00
MARGIN                                                  71.2%
MARGIN FLOOR (LOT-FM-001)                               60%
CEILING CHECK                                           $28.82 ≤ $40.00 ceiling — HOLDS (ESTIMATE)

--------------------------------------------------------------------------------
NEXT ACTIONS (S-2 — procurement, not code)
--------------------------------------------------------------------------------
1. Request quotes for all 23 lines from 2+ suppliers each (bulk small-batch).
2. Replace ESTIMATE with QUOTED + supplier name once confirmed.
3. Re-run this rollup with quoted numbers before the first real dispatch —
   do not report "margin verified" (Month 3 exit criterion) until every
   line reads QUOTED.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
================================================================================
