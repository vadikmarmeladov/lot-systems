# LOT® BASIC — RATION SUBSCRIPTION ROADMAP
LOT Systems Corporation · S-2: Vadim Marmeladov
Source doctrine: LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE — MODULE: BASIC (RATION), 90-DAY BUILD
Version 1.0 · Month 1 delivered 2026-07-26

---

## Doctrine (verbatim, condensed)

- Issue, do not sell. The subscriber is ON STRENGTH, not a customer.
- USD 100/mo. Flat rate. No tiers.
- ≥60% margin. ≤USD 40 landed COGS ceiling. Never breach it.
- The ledger is the marketing — no layer between the public page and the manifest.
- House style: LiberationMono, white ground / black ink, inversion-only hierarchy,
  2px rules, square corners, fixed character grid, IBM 3270 register. No color,
  no radius, no icons. Voice: quartermaster, imperative, terse.
- Ship working increments monthly. Each month ends in a demonstrable state.

---

## MONTH 1 — LEDGER & DOCTRINE — DELIVERED

**Exit criteria:** a stranger can read what LOT issues and on what terms. Read-only. Live.

**Built this session:**

| Component | Path | Purpose |
|---|---|---|
| Ration data (23-item load) | `src/shared/constants/ration.ts` | Nomenclature, category, cadence, unit. COGS deliberately absent — withheld per doctrine. |
| Shared ledger UI | `src/client/components/basics/BasicsLedger.tsx` | Fixed-grid, black-on-white, LiberationMono register. Doctrine block, price line, status line, ledger table grouped by cadence. |
| In-app tab | `src/client/components/Basics.tsx` + `router.ts` (`basics` route) + `Layout.tsx` nav + `app.tsx` TabPanel | Wires the pre-existing disabled "Basics" nav button (`Layout.tsx`) to a live route. |
| Public OPEN TAB | `src/client/components/OpenTabPage.tsx` + `src/client/entries/open-tab.tsx` + `GET /open-tab` (`src/server/index.ts`) | Standalone page, no login required — mirrors the existing `/status` pattern. This is the literal "OPEN TAB" surface named in doctrine. |

**Why two surfaces, not one:** the in-app "Basics" tab (`/basics`, requires session) is where an existing Usership member will later see UPGRADE state (Month 2) and issue status (Month 3). The public `/open-tab` page is the doctrine surface a stranger reaches with no account — it renders the same `BasicsLedger` component so the two never drift.

**23-item ration load** — authored this session (no prior LOT-FM-001 SKU list existed in-repo; `docs/corporate/LOT-FEATURE-INVENTORY-2026.md` records only "Basics Tab — physical supply subscription layer (LOT-FM-001) — IN-DEV" with no item detail). Categories: HYGIENE (7), APPAREL (4), SUSTAINMENT (3), HOME (5), FIELD GEAR (4). Cadence split: 10 MONTHLY, 8 QUARTERLY, 3 ANNUAL, 2 ON-ENROLLMENT. This split is what lets a $100/mo rate amortize higher-cost annual/enrollment items without breaching the $40 landed ceiling in any given month — see the internal worksheet below.

**Internal COGS worksheet (not rendered publicly — doctrine: landed cost withheld):**

A rough per-month amortized landed-cost model, given the cadence split above, using placeholder unit costs typical for bulk-procured consumer staples:

```
MONTHLY items (10):   ~$14 landed, issued every cycle
QUARTERLY items (8):  ~$18 landed / 3  = ~$6/mo amortized
ANNUAL items (2):     ~$14 landed / 12 = ~$1.20/mo amortized
ON-ENROLLMENT (2):    ~$9 landed, amortized over a 12-mo assumed tenure = ~$0.75/mo
                                                    -----
                                     Amortized landed COGS ≈ $22/mo
```

At $100/mo revenue and ~$22/mo amortized landed cost, gross margin ≈ 78% — comfortably inside the ≥60% floor and the $40 ceiling, leaving headroom for shipping/packaging/payment-processing overhead (not modeled here) before the ceiling is threatened. This is a planning estimate, not a supplier quote — Month 3 replaces it with confirmed quotes.

---

## MONTH 2 — UPGRADE & ROSTER — PLANNED (not built this session)

**Exit criteria:** a Usership member can go ON STRENGTH and back OFF, end to end.

**State machine:**

```
USERSHIP/AI ──UPGRADE──▶ PENDING ──intake complete──▶ ON STRENGTH ──30d──▶ STEADY STATE
     ▲                                                      │
     └───────────────────── STAND DOWN ────────────────────┘
```

- `USERSHIP/AI` — existing Usership (AI plan) member, no ration.
- `PENDING` — UPGRADE clicked; roster intake (sizing, shipping address, cadence start date) not yet complete.
- `ON STRENGTH` — intake complete, first billing cycle active, ration issuing.
- `STEADY STATE` — 30+ days ON STRENGTH, cadence stable (no schedule changes pending).
- `STAND DOWN` — downgrade path. Drops the ration; retains the underlying AI/Usership plan. Not a full cancellation.

**Planned build:**
- `UpgradeControl` component on the in-app Basics tab — single button, state-gated by the machine above.
- Roster intake form: sizing (apparel line items), shipping address, cadence start date. Minimal fields — doctrine forbids upsell-style forms.
- Billing: additive $100/mo charge on top of existing Usership billing (reuses whatever payment processor Usership already runs on — needs confirmation before build; not yet investigated this session).
- `STAND DOWN` handler: cancels the ration billing line, sets state back to `USERSHIP/AI`, leaves Usership/AI plan untouched.
- Issue log scaffold: a `RationIssue` model (user, cycle date, line items, status) — empty/unpopulated until Month 3's load engine writes to it.

**Open questions for Month 2 (flag for S-2 before build starts):**
1. Which payment processor handles the additive $100/mo — same one as Usership, or new integration?
2. Does STAND DOWN prorate the current cycle or take effect at next billing date?
3. Roster intake — collected once at PENDING, or editable later from Settings?

---

## MONTH 3 — ISSUE & FULFILLMENT — PLANNED (not built this session)

**Exit criteria:** first real ration ships to a real subscriber. Margin verified ≥60%.

**Planned build:**
- Month-by-month load engine: given a subscriber's cadence start date, compute which of the 23 lines are due this cycle (MONTHLY always; QUARTERLY/ANNUAL/ISSUE on their schedule offset from start date).
- Supplier quotes confirmed against the $40 COGS ceiling — replaces the Month-1 placeholder worksheet above with real numbers; this is the gate that gets the ceiling from "estimated" to "verified."
- Printed manifest card generation — a physical card per shipment listing that cycle's line items (nomenclature + quantity, no pricing), generated from the same `RATION_ITEMS` data the public ledger renders from. No second source of truth.
- First issue scheduled and dispatched; `RationIssue` log (scaffolded Month 2) accrues; NEXT ISSUE date advances on the Basics tab.

---

## Non-goals for this module (all three months)

- No color, icons, or rounded corners anywhere in the BASIC surfaces — a deliberate visual break from the rest of the app's Arial/opacity-hierarchy style guide. This is intentional per LOT-FM-001, not an inconsistency to fix.
- No public display of landed cost, margin, or supplier identity at any point — doctrine is permanent, not a Month-1-only restriction.
- No tiering, discounting, or upsell flows — one rate, one ration.
