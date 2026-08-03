<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-FM-001 — BASIC RATION MANUAL

MODULE: BASIC (RATION) · CIVILIAN ISSUE SUBSCRIPTION · $100/MONTH

---

## 0. DOCTRINE

LOT does not sell consumables. LOT issues them.

The Usership AI plan already tracks the digital layer of the operator's life —
memory, intention, pattern. BASIC extends that same doctrine to the physical
layer: hygiene, consumables, apparel basics, field maintenance. Not a
subscription box. A ration.

1. LOT does not sell consumables. LOT issues them.
2. ON STRENGTH means the ration is on the books — not a subscription, a
   manifest entry.
3. $100/month holds you on the roster. It is not a purchase you evaluate item
   by item.
4. The System already tracks what the operator runs on. The ration puts the
   physical layer on the same schedule as the digital one.
5. No upsell. No SKU browsing. Read the ledger. Do not shop it.

**The ledger is the marketing.** There is no layer between the public surface
and the manifest — what a stranger reads on OPEN TAB is the same list that
ships.

---

## 1. ECONOMIC ENVELOPE

| Line | Value |
|---|---|
| Price | USD 100.00 / month |
| Margin floor | ≥ 60% |
| Landed COGS ceiling | ≤ USD 40.00 / month |
| Billing | Additive to Usership (AI), recurring monthly |

COGS is never rendered on any public surface. The ceiling is an internal
constraint on sourcing, not a number the operator sees.

---

## 2. THE 23-ITEM RATION LOAD

Grouped by category. Cadence governs how often each line reships — not every
item ships every month; the Month 3 load engine staggers issue against
cadence so the box total stays under the COGS ceiling.

### FIELD HYGIENE

| Code | Nomenclature | Cadence |
|---|---|---|
| FH-01 | Toothbrush, soft bristle | QUARTERLY |
| FH-02 | Toothpaste, travel tube | MONTHLY |
| FH-03 | Soap, bar, unscented | MONTHLY |
| FH-04 | Deodorant, unscented | MONTHLY |
| FH-05 | Razor, disposable, 3-pack | MONTHLY |
| FH-06 | Nail clipper | SEMI-ANNUAL |
| FH-07 | Cotton swabs, 100 ct | QUARTERLY |

### CONSUMABLES

| Code | Nomenclature | Cadence |
|---|---|---|
| CN-01 | Coffee, instant, single-origin, 10-pack | MONTHLY |
| CN-02 | Electrolyte tablets, 10-pack | MONTHLY |
| CN-03 | Multivitamin, 30 ct | MONTHLY |
| CN-04 | Field notebook, pocket, 96 pg | MONTHLY |
| CN-05 | Pen, black ink, retractable | MONTHLY |
| CN-06 | Duct tape, mini roll | QUARTERLY |

### APPAREL, BASIC

| Code | Nomenclature | Cadence |
|---|---|---|
| AB-01 | Undershirt, crew, black | QUARTERLY |
| AB-02 | Socks, crew, 3-pack, black | QUARTERLY |
| AB-03 | Undergarment, brief, 3-pack, black | QUARTERLY |
| AB-04 | Bandana, black | SEMI-ANNUAL |
| AB-05 | Sleep mask | SEMI-ANNUAL |

### FIELD MAINTENANCE

| Code | Nomenclature | Cadence |
|---|---|---|
| FM-01 | Batteries, AA, 4-pack | MONTHLY |
| FM-02 | Cloth, microfiber | QUARTERLY |
| FM-03 | Zip ties, 20-pack | SEMI-ANNUAL |
| FM-04 | Adhesive, single-use | QUARTERLY |
| FM-05 | Fire starter, waterproof | SEMI-ANNUAL |

23 lines. Source of truth: `src/shared/constants/basicsRation.ts`
(`RATION_MANIFEST`) — the manual and the code must never drift; the manual
is descriptive, the constant is canonical.

---

## 3. VISUAL IDENTITY — FORMAL SPEC

House style is non-negotiable on every BASIC surface:

- Typeface: LiberationMono-Bold (fallback: Courier New, ui-monospace).
- Ground: white. Ink: black. No third color.
- Hierarchy by inversion only (black-on-white ↔ white-on-black). No color,
  no shadow, no gradient for emphasis.
- Rules: 2px solid, black.
- Corners: square. `border-radius: 0` everywhere.
- Grid: fixed character grid, monospace-driven layout.
- Register: IBM 3270 terminal — status lines, block cursor motifs, uppercase
  field labels.
- Voice: quartermaster. Imperative, terse. No marketing copy, no icons.

Implementation: `src/client/components/BasicsPage.tsx`.

---

## 4. OPEN TAB

Public, unauthenticated, read-only. Route: `GET /basics`. Data:
`GET /api/public/basics-manifest` — returns doctrine, price, and the 23-item
manifest (nomenclature + cadence). COGS is withheld at the API layer, not
just the UI layer.

A stranger with no LOT account can read exactly what LOT issues and on what
terms. Nothing more, nothing less.

---

## 5. UPGRADE STATE MACHINE (Month 2)

```
USERSHIP / AI  →  PENDING  →  ON STRENGTH  →  STEADY STATE
                                    ↓
                               STAND DOWN
                          (drops ration, retains AI)
```

- **USERSHIP / AI** — baseline digital plan, no ration.
- **PENDING** — UPGRADE submitted, roster intake in progress (sizing,
  shipping address, cadence start date), billing not yet active.
- **ON STRENGTH** — first billing cycle confirmed, operator is on the roster,
  first issue scheduled.
- **STEADY STATE** — recurring cycle, issue log accruing, NEXT ISSUE date
  tracked.
- **STAND DOWN** — downgrade path. Drops the $100/month ration charge,
  retains the underlying Usership (AI) plan. Reversible — STAND DOWN can
  re-UPGRADE back to PENDING.

Not built in Month 1. Scaffolding only (`RationStrengthStatus` type in
`src/shared/constants/basicsRation.ts`).

---

## 6. FULFILLMENT (Month 3)

Month-by-month load engine selects which of the 23 lines ship this cycle per
their cadence (MONTHLY every cycle; QUARTERLY every 3rd; SEMI-ANNUAL every
6th, staggered by roster join date). Supplier quotes are confirmed against
the COGS ceiling before any line is added to a live cycle. Printed manifest
card accompanies each physical issue. Not built in Month 1.

---

## 7. BUILD ENVELOPE (this directive)

| Month | Scope | Exit condition |
|---|---|---|
| 1 | OPEN TAB, doctrine, 23-item ledger, price line, status-line, terminal tokens | A stranger can read what LOT issues and on what terms. Read-only. Live. |
| 2 | UPGRADE control + state machine, roster intake, recurring billing, STAND DOWN, issue log scaffold | A Usership member can go ON STRENGTH and back OFF, end to end. |
| 3 | Load engine, supplier quotes vs. COGS ceiling, printed manifest card, first issue dispatched | First real ration ships to a real subscriber. Margin verified ≥60%. |

Status of this manual: MONTH 1 COMPLETE. See session report
`docs/benchmark/LOT-SR-20260803-01.md` for the build record.
