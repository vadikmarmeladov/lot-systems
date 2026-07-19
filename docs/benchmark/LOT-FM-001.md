================================================================================
LOT SYSTEMS / SELF-ASSEMBLY DIRECTIVE
DOCUMENT: LOT-FM-001
TITLE:    BASIC (RATION) MODULE — 90-DAY BUILD
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-07-19
================================================================================

Field Manual for the BASIC ration subscription: the hardware/physical layer
of the LOT® System. Read this file to understand what BASIC is, the load it
issues, and the build sequence across the 90-day window.

================================================================================
01 // DOCTRINE
================================================================================

LOT does not sell products. LOT issues ration.

The operator is not a customer. The operator is ON STRENGTH. BASIC is the
physical expression of the same system that already runs the operator's
software — not a separate storefront, not an FMCG side-business, not a
brand extension. One ration per operator per month, on cadence, without
requisition. No SKU browsing. No cart. No upsell. The ledger is the
marketing — there is no layer between what a stranger can read on the
public OPEN TAB and what actually ships in the box.

BASIC is issued additive to LOT Usership (the AI plan). Usership continues
unchanged underneath it; BASIC stacks a physical ration on top for anyone
who wants the system to reach into the physical world. Dropping BASIC
(STAND DOWN) drops the ration and keeps the AI — the two are decoupled by
design, so leaving the hardware plan is never leaving the system.

Economics are a hard boundary, not a target:
  ISSUE RATE:    USD 100.00 / month, recurring, additive to Usership billing
  COGS CEILING:  USD 40.00 landed, per issue — never breached
  MARGIN FLOOR:  60%, mechanical consequence of the ceiling above

Visual identity is inherited from the terminal register the rest of LOT
already runs on, translated into formal military-spec language for this
module specifically: LiberationMono-Bold, white ground / black ink,
inversion-only hierarchy (fill + invert on select, never a new color),
2px rules for structural dividers, square corners throughout, a fixed
character grid for the ledger, IBM 3270 terminal register. No marketing
copy, no color, no border-radius, no icons. Voice: quartermaster —
imperative, terse.

================================================================================
02 // THE 23-ITEM RATION LOAD
================================================================================

Full manifest lives in code at src/client/components/basics/doctrine.ts
(RATION_MANIFEST) — this is the source of truth; the table below is a
reference snapshot, not a duplicate to maintain by hand.

CATEGORY    COUNT  CADENCE             LINES
NUTRITION   10     MONTHLY             01–10 (staples: grains, legumes,
                                        coffee, honey, oil, salt, pepper,
                                        vinegar, seeds)
HEALTH      7      MONTHLY             11–17 (D3, C, electrolytes, omega-3,
                                        probiotic, magnesium, zinc)
HYGIENE     5      MONTHLY/QUARTERLY   18–22 (soap, razor+blades, floss
                                        monthly; toothpaste, deodorant
                                        quarterly)
EQUIPMENT   1      QUARTERLY           23 (field journal, LOT-FM)

23 items total. COGS is tracked per item internally and withheld from the
public ledger — Month 1 renders nomenclature + spec + cadence only. Supplier
quotes against the per-item COGS ceiling are Month 3 work (Section 04).

================================================================================
03 // VISUAL SPEC → SOFTWARE TRANSLATION
================================================================================

MANIFEST TERM              IMPLEMENTATION
LiberationMono-Bold         tailwind.config.js: fontFamily.terminal =
                            ['"Liberation Mono"', ui-monospace, SFMono-Regular,
                            Menlo, Consolas, monospace]. Applied once on the
                            Basics tab root (font-terminal font-bold);
                            children inherit — no per-node font classes.
White ground / black ink    bac / acc tokens (existing app-wide convention),
                            no new palette introduced.
Inversion-only hierarchy    No accent color anywhere in the module. Emphasis
                            is opacity-only (text-acc/40, /50, /60) plus the
                            existing NavButton fill+invert for the active tab.
2px rules                   HeavyRule (border-t-2, header separator).
Square corners              No rounded-* class anywhere in Basics.tsx or
                            basics/doctrine.ts.
Fixed character grid        CSS grid, gridTemplateColumns: '28px 1fr auto
                            auto' shared by the ledger header and every row;
                            tabular-nums on the line-number column.
IBM 3270 register           SECTION 1 / SECTION 2 labeling, NO./NOMENCLATURE/
                            SPEC/CADENCE column heads, terse doctrine lines,
                            no prose paragraphs.

================================================================================
04 // 90-DAY BUILD SEQUENCE
================================================================================

--------------------------------------------------------------------------------
MONTH 1 — LEDGER & DOCTRINE (the System exists, read-only)   STATUS: SHIPPED
--------------------------------------------------------------------------------
BUILD:  OPEN TAB public surface at /basics. 23-item manifest rendered as a
        ledger (nomenclature + spec + cadence; COGS withheld). Doctrine
        statement. Price line. Status-line component (reads user tags —
        ON STRENGTH / USERSHIP / NONE). Terminal tokens + grid established.
EXIT:   A stranger can read what LOT issues and on what terms. Read-only.
        Live. — MET. Tab routed, nav enabled, builds green.

--------------------------------------------------------------------------------
MONTH 2 — UPGRADE & ROSTER (Usership AI → BASIC)              STATUS: PLANNED
--------------------------------------------------------------------------------
BUILD:  UPGRADE control replacing the current M1 placeholder block. State
        machine: USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE. Roster
        intake form (sizing where relevant, shipping address, cadence start
        date). Recurring USD 100.00/mo additive billing hook. STAND DOWN
        downgrade path (drops ration, retains AI/Usership). Issue log
        scaffold (empty ledger the Month 3 engine will populate).
        Server-side: formalize the 'Basic' string tag into UserTag.Basic on
        the shared enum once the state machine needs to branch on it
        server-side; DB migration for roster fields (address, sizing,
        cadence anchor date).
EXIT:   A Usership member can go ON STRENGTH and back OFF, end to end.

--------------------------------------------------------------------------------
MONTH 3 — ISSUE & FULFILLMENT (the box ships)                 STATUS: PLANNED
--------------------------------------------------------------------------------
BUILD:  Month-by-month load engine reading RATION_MANIFEST cadence to
        compute what's due on a given issue date. Supplier quotes confirmed
        against the per-item COGS ceiling (Section 02) — reject any quote
        that would breach the USD 40.00 landed total. Printed manifest card
        generation (physical card that ships in the box, mirroring the
        on-screen ledger). First issue scheduled and dispatched to a real
        subscriber. Issue log accrues in the roster record; NEXT ISSUE date
        advances on dispatch.
EXIT:   First real ration ships to a real subscriber. Margin verified ≥60%.

================================================================================
05 // OPERATING RULES (standing, all three months)
================================================================================

  - Issue, do not sell. The user is ON STRENGTH, never a "customer" in copy.
  - USD 100/mo ceiling on price, USD 40 ceiling on landed COGS. Neither
    moves without a doctrine revision to this file.
  - The ledger is the marketing. No landing page, no separate marketing
    site layer — the OPEN TAB in-app is the entire public surface.
  - Ship working increments monthly. Each month ends in a demonstrable
    state, not a partial one — Month 2 does not start ledger work that
    Month 1 didn't finish, and Month 3 does not start fulfillment work
    against an incomplete roster.
  - Eliminate one distraction: BASIC does not compete with, reference, or
    borrow pricing from unrelated FMCG concepts mentioned elsewhere in the
    codebase (e.g. the 2027 corporate FMCG plan in About.tsx) — those are a
    separate document and a separate price point. BASIC is USD 100/mo, full
    stop, per this manual.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-FM-001
================================================================================
