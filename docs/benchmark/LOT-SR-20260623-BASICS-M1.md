================================================================================
LOT SESSION REPORT
DOC:    LOT-SR-20260623-BASICS-M1
CLASS:  INTERNAL / S-2 EYES
DATE:   2026-06-23
BRANCH: claude/beautiful-johnson-18koxd
MODULE: BASICS / FM-001 CIVILIAN RATION — MONTH 1
================================================================================

STATUS: M1 DELIVERED — OPEN TAB LIVE

================================================================================
01 // MISSION
================================================================================

Build Month 1 of the LOT-FM-001 BASICS module per self-assembly directive.
Exit criterion: a stranger can read what LOT issues and on what terms. Read-only. Live.

================================================================================
02 // WHAT SHIPPED
================================================================================

FILES MODIFIED / CREATED: 5

  src/client/components/Basics.tsx          [NEW]     +215 lines
  src/client/stores/router.ts               [EDITED]    +2 lines
  src/client/components/ui/Layout.tsx       [EDITED]    +2 lines
  src/client/entries/app.tsx                [EDITED]    +4 lines
  src/client/components/About.tsx           [EDITED]    +1 line

ROUTE: /basics — persistent tab, mounted on first visit, hidden not unmounted.

================================================================================
03 // OPEN TAB SURFACE
================================================================================

HEADER: LOT® BASICS / FM-001 CIVILIAN RATION — inverted (black/white)

STATUS LINE:
  STATUS: OPEN | RATE: USD 100.00 / MO | AS OF: [date]

DOCTRINE (4 clauses):
  01  Issue, do not sell. The operator is ON STRENGTH.
  02  The ledger is the marketing. No layer between public and manifest.
  03  USD 100/mo. Margin certified ≥60%. COGS ceiling USD 40 landed.
  04  The Memory Engine knows what the operator uses. Supply aligns with profile.

================================================================================
04 // 23-ITEM RATION MANIFEST (LOT-FM-001 § 2)
================================================================================

ITEM  NOMENCLATURE                    UNIT    CADENCE
────  ──────────────────────────────  ──────  ─────────
01    COFFEE, DARK ROAST              250g    MONTHLY
02    OATS, STEEL-CUT                 500g    MONTHLY
03    HONEY, RAW                      250g    MONTHLY
04    OLIVE OIL, EXTRA VIRGIN         250ml   MONTHLY
05    ALMONDS, RAW                    150g    MONTHLY
06    VITAMIN D3 + K2                 30ct    MONTHLY
07    MAGNESIUM GLYCINATE             30ct    MONTHLY
08    SOAP, CASTILE BAR               x2      MONTHLY
09    TOOTHPASTE, NATURAL             100ml   MONTHLY
10    DENTAL FLOSS                    30m     MONTHLY
11    DEODORANT, NATURAL              65g     MONTHLY
12    DISH SOAP, CONCENTRATE          100ml   MONTHLY
13    LAUNDRY SOAP BAR                x2      MONTHLY
14    BEESWAX CANDLE                  4oz     MONTHLY
15    MATCHES, SAFETY                 1 box   MONTHLY
16    BANDAGE STRIP, FABRIC           10ct    MONTHLY
17    TOOTHBRUSH                      x1      QUARTERLY
18    SHAMPOO BAR                     x1      QUARTERLY
19    COTTON CLOTH, 12"x12"           x2      QUARTERLY
20    NOTEBOOK, FIELD                 x1      QUARTERLY
21    PEN, BALLPOINT                  x2      QUARTERLY
22    COTTON SOCKS, HEAVY             2 pr    QUARTERLY
23    COTTON T-SHIRT, HEAVYWEIGHT     x1      BIANNUAL

FOOTNOTE: COGS WITHHELD. MARGIN CERTIFIED ≥60%. LANDED CEILING USD 40. NOT A STORE — A RATION.

CATEGORIES (by cadence):
  MONTHLY (16 items)  — nutrition, personal care, household consumables
  QUARTERLY (6 items) — durable goods, field kit, wardrobe basics
  BIANNUAL (1 item)   — heavyweight wardrobe anchor

================================================================================
05 // VISUAL IDENTITY — HOUSE STYLE APPLIED
================================================================================

FONT:       Liberation Mono, Courier New, Courier, monospace — bold weight
GROUND:     #fff (white) — enforced at component root, overrides theme
INK:        #000 (black) — absolute, no accent color leak
HIERARCHY:  Inversion-only — inverted bars for headers (black bg / white text)
BORDERS:    2px solid #000 — all section containers, table header
            1px solid rgba(0,0,0,0.10) — table row separators
RADIUS:     0 — square corners throughout. No radius anywhere.
GRID:       Fixed character columns via CSS grid (28px / 1fr / 56px / 88px)
ICONS:      None.
COLOR:      None beyond black and white.
VOICE:      Quartermaster. Imperative. Terse. No marketing copy.

Dim progression:
  MONTHLY rows   — full opacity (1.0) — primary issue
  QUARTERLY rows — 0.70 opacity      — secondary issue
  BIANNUAL rows  — 0.50 opacity      — infrequent issue

================================================================================
06 // MONTH 2 PLACEHOLDER
================================================================================

Footer block surfaced: "UPGRADE PATH: USERSHIP / AI → ON STRENGTH — M2 PENDING"
This reserves the upgrade state machine territory for Month 2.

M2 scope (not yet built):
  - UPGRADE control + state machine (USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE)
  - Roster intake (sizing, shipping address, cadence start)
  - Recurring $100/mo additive billing
  - STAND DOWN downgrade (drops ration, retains AI)
  - Issue log scaffold

================================================================================
07 // ENVELOPE CHECK
================================================================================

  M1 exit criterion: A stranger can read what LOT issues and on what terms. Read-only. Live.
  STATUS: MET.

  The Basics tab is live at /basics.
  The 23-item manifest is public. Cadences are visible. COGS is withheld.
  Doctrine is stated. Price line is stated. No upgrade path yet (M2 territory).

================================================================================
08 // NEXT SESSION
================================================================================

  M2 — UPGRADE & ROSTER
  Build: UPGRADE control, state machine, roster intake, billing scaffold, STAND DOWN path.
  Exit: A Usership member can go ON STRENGTH and back OFF, end to end.

================================================================================
EOF
