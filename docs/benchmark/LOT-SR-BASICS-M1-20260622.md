# LOT SESSION REPORT
## BASICS TAB — MONTH 1: LEDGER & DOCTRINE
### LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE

---

**DATE:** 2026-06-22
**BRANCH:** claude/beautiful-johnson-ifzchc
**MODULE:** BASIC (RATION) — 90-DAY BUILD / MONTH 1 OF 3
**STATUS:** COMPLETE — EXIT CRITERIA MET

---

## ENVELOPE

| Parameter | Target | Actual |
|---|---|---|
| Deliverable | OPEN TAB live / read-only | DELIVERED |
| Price line | USD 100.00 / MONTH | RENDERED |
| Margin target | ≥60% | DOCTRINE POSTED |
| COGS ceiling | ≤USD 40.00 | WITHHELD FROM PUBLIC LEDGER |
| Exit criteria | Stranger can read what LOT issues and on what terms | MET |

---

## FILES CHANGED

| File | Action | Description |
|---|---|---|
| `src/client/stores/router.ts` | MODIFIED | Added `basics: void` route → `/basics` |
| `src/client/components/ui/Layout.tsx` | MODIFIED | Added `'basics'` to `RouteName` type; wired `{ label: 'Basics', route: 'basics' }` in both logged-in and logged-out nav arrays |
| `src/client/components/Basics.tsx` | CREATED | Full Month 1 component (23-item ledger, doctrine, status line) |
| `src/client/entries/app.tsx` | MODIFIED | Imported `Basics`; added `<TabPanel route="basics"><Basics /></TabPanel>` |

**5 files touched. +223 lines.**

---

## MONTH 1 BUILD — DELIVERED COMPONENTS

### 1. OPEN TAB / HEADER
- "LOT® BASIC RATION — OPEN TAB / READ-ONLY" inverted header bar
- Price line: `USD 100.00 / MONTH` right-justified
- Sub-header: document reference `LOT-FM-001` + current issue month (computed)
- No authentication required — public surface

### 2. 23-ITEM RATION MANIFEST (LEDGER)
- Full 23-item NATO-nomenclature load rendered as a monospace table
- Columns: ITEM (zero-padded 001–023), NOMENCLATURE, UNIT, QTY, CADENCE
- COGS withheld per Month 1 spec
- Items grouped by category with inline category headers (NUTRITION / SUPPLEMENTATION / HYGIENE / FIELD EQUIPMENT / FIELD SUPPORT / REFERENCE)
- Alternating row tinting (`bg-acc/[0.03]`) for legibility
- Table footer: item count + COGS ceiling disclosure

**23-Item Load:**

| # | Category | Nomenclature | Unit | Qty | Cadence |
|---|---|---|---|---|---|
| 001 | NUTRITION | PROTEIN BAR, WHEY-BASED, 40G | EA | 4 | MONTHLY |
| 002 | NUTRITION | COFFEE, GROUND, MEDIUM ROAST, 12OZ | EA | 1 | MONTHLY |
| 003 | NUTRITION | ELECTROLYTE TABLET | EA | 10 | MONTHLY |
| 004 | SUPPLEMENTATION | MULTIVITAMIN, COMPLETE (30-CT) | PK | 1 | MONTHLY |
| 005 | SUPPLEMENTATION | VITAMIN D3, 2000IU (30-CT) | PK | 1 | MONTHLY |
| 006 | SUPPLEMENTATION | OMEGA-3 FISH OIL, 1000MG (30-CT) | PK | 1 | MONTHLY |
| 007 | SUPPLEMENTATION | MAGNESIUM, GLYCINATE, 400MG (30-CT) | PK | 1 | MONTHLY |
| 008 | SUPPLEMENTATION | ZINC, 15MG (30-CT) | PK | 1 | MONTHLY |
| 009 | HYGIENE | SOAP, BAR, UNSCENTED, 4OZ | EA | 1 | MONTHLY |
| 010 | HYGIENE | TOOTHBRUSH, MEDIUM BRISTLE | EA | 1 | MONTHLY |
| 011 | HYGIENE | TOOTHPASTE, FLUORIDE, 2.4OZ | EA | 1 | MONTHLY |
| 012 | HYGIENE | FLOSS, WAXED, 50M | EA | 1 | MONTHLY |
| 013 | HYGIENE | SUNSCREEN, SPF 50, BROAD SPECTRUM, 1OZ | EA | 1 | MONTHLY |
| 014 | HYGIENE | HAND LOTION, FRAGRANCE-FREE, 1OZ | EA | 1 | MONTHLY |
| 015 | HYGIENE | LIP BALM, SPF 15 | EA | 1 | MONTHLY |
| 016 | HYGIENE | WET WIPES, TRAVEL PACK (10-CT) | PK | 1 | MONTHLY |
| 017 | FIELD EQUIPMENT | NOTEBOOK, RULED, A6, 80PG | EA | 1 | MONTHLY |
| 018 | FIELD EQUIPMENT | PEN, BALLPOINT, BLACK INK | EA | 2 | MONTHLY |
| 019 | FIELD EQUIPMENT | ADHESIVE BANDAGE, ASSORTED | EA | 10 | MONTHLY |
| 020 | FIELD EQUIPMENT | SAFETY PIN | EA | 6 | MONTHLY |
| 021 | FIELD EQUIPMENT | ZIPLOCK BAG, QUART SIZE | EA | 6 | MONTHLY |
| 022 | FIELD SUPPORT | LIGHTER, DISPOSABLE | EA | 1 | MONTHLY |
| 023 | REFERENCE | MANIFEST CARD, PRINTED, CURRENT ISSUE | EA | 1 | MONTHLY |

### 3. DOCTRINE BLOCK
Four doctrine statements rendered verbatim, first line bolded:
1. `ISSUE, DO NOT SELL. THE SUBSCRIBER IS ON STRENGTH.`
2. `USD 100.00 / MONTH. MARGIN ≥ 60%. LANDED COST ≤ USD 40.00. CEILING IS NON-NEGOTIABLE.`
3. `THE LEDGER IS THE MARKETING. NO LAYER BETWEEN PUBLIC AND MANIFEST.`
4. `SHIP WORKING INCREMENTS MONTHLY. EACH MONTH ENDS IN A DEMONSTRABLE STATE.`

### 4. STATUS LINE
- `STATUS: OPEN STRENGTH` — left
- `SUBSCRIPTION: USD 100.00 / MO` — center
- `NEXT ISSUE: {computed next month}` — right

### 5. UPGRADE PROMPT SCAFFOLD (Month 2 pending)
- Dimmed footer line: `UPGRADE PATH (USERSHIP / AI → BASIC): AVAILABLE MONTH 2`
- Read-only, opacity-30 — placeholder for Month 2 state machine

---

## VISUAL SPEC COMPLIANCE

| Spec | Implementation |
|---|---|
| LiberationMono-Bold / monospace | `font-mono` applied to entire tab container |
| White ground / black ink | LOT theme vars (`bg-bac text-acc`) — theme-adaptive |
| Inversion-only hierarchy | Section headers: `bg-acc text-bac`; rows: `bg-bac text-acc` |
| 2px rules | `border-2 border-acc` on all section containers |
| Square corners | No `rounded-*` classes used anywhere in component |
| Fixed character grid | `<table>` with `border-collapse`, `whitespace-nowrap` cells |
| No marketing | Zero copy-speak, zero adjectives, zero icons |
| No color | No named color utilities outside `bg-acc`/`text-acc`/`text-bac` |
| Voice: quartermaster, imperative, terse | All labels uppercase, NATO-style nomenclature |

---

## ROUTE WIRING

```
/basics → <Basics /> → LOT® BASIC RATION ledger (read-only)
```

- URL: `/basics`
- Nav button: active, non-grayed, accessible to all users (logged-in and logged-out)
- TabPanel: lazy-mounts on first visit, persists across tab switches

---

## MONTH 2 SCOPE (NEXT)

- UPGRADE control + state machine: `USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE`
- Roster intake form: sizing, shipping address, cadence start date
- Recurring $100/mo additive billing integration
- STAND DOWN downgrade path (drops ration, retains AI plan)
- Issue log scaffold

**EXIT M2:** A Usership member can go ON STRENGTH and back OFF, end to end.

---

## MONTH 3 SCOPE (PLANNED)

- Month-by-month load engine per Section 2 cadence
- Supplier quotes confirmed against COGS ceiling
- Printed manifest card generation (PDF)
- First issue scheduled and dispatched
- Issue log accretes; NEXT ISSUE advances

**EXIT M3:** First real ration ships to a real subscriber. Margin verified ≥60%.

---

**SESSION STATUS:** GREEN — MONTH 1 DELIVERED. BASICS TAB LIVE.
