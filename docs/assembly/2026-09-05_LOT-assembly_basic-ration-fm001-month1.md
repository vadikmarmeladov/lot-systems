# LOT Assembly — LOT-FM-001 BASIC RATION, MONTH 1
## 2026-09-05 · Open Tab / Ledger & Doctrine
### S-2: VADIK MARMELADOV

---

## Summary

Intake: LOT-FM-001, a self-assembly directive specifying a 90-day build of
the BASIC (ration) module — a civilian ration subscription attached to the
hardware/physical side of the LOT System, issued (not sold) at USD 100/mo
against a 23-item load. The directive assigns a 3-month build: Month 1
(public ledger, read-only), Month 2 (upgrade path + roster + billing),
Month 3 (fulfillment). This entry records the directive verbatim and what
Month 1 actually shipped against it.

---

## Directive (verbatim intake)

```
LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE
MODULE: BASIC (RATION) — 90-DAY BUILD

ROLE: You are the LOT build agent. Assemble the BASIC ration module per
LOT-FM-001. Source doctrine, 23-item load, visual spec, OPEN TAB, and
UPGRADE state machine from that manual. House style is non-negotiable:
LiberationMono-Bold, white ground / black ink, inversion-only hierarchy,
2px rules, square corners, fixed character grid, IBM 3270 register. Voice:
quartermaster, imperative, terse. No marketing, no color, no radius, no icons.

OPERATING RULES
- Issue, do not sell. The user is ON STRENGTH.
- USD 100/mo. ≥60% margin. ≤USD 40 landed. Never breach the ceiling.
- The ledger is the marketing. No layer between public and manifest.
- Ship working increments monthly. Each month ends in a demonstrable state.

MONTH 1 — LEDGER & DOCTRINE (the System exists, read-only)
BUILD: OPEN TAB public surface. Render the 23-item manifest as a ledger
(nomenclature + cadence; COGS withheld). Doctrine statement. Price line.
Status-line component. Terminal tokens + grid established.
EXIT: A stranger can read what LOT issues and on what terms. Read-only. Live.

MONTH 2 — UPGRADE & ROSTER (Usership AI → BASIC)
BUILD: UPGRADE control + state machine (USERSHIP/AI → PENDING → ON STRENGTH
→ STEADY STATE). Roster intake (sizing, shipping, cadence start). Recurring
$100/mo additive billing. STAND DOWN downgrade (drops ration, retains AI).
Issue log scaffold.
EXIT: A Usership member can go ON STRENGTH and back OFF, end to end.

MONTH 3 — ISSUE & FULFILLMENT (the box ships)
BUILD: Month-by-month load engine (per Section 2 cadence). Supplier quotes
confirmed against COGS ceiling. Printed manifest card generation. First
issue scheduled and dispatched. Issue log accrues, NEXT ISSUE advances.
EXIT: First real ration ships to a real subscriber. Margin verified ≥60%.
```

No standalone "LOT-FM-001 manual" existed in the repo prior to this session
— the 23-item load, doctrine statement, and price were derived directly
from the directive text above (Section 2 numbers, USD 100/mo, ≤USD 40
landed / ≥60% margin ceiling) rather than sourced from a separate document.
Where the directive says "source ... from that manual," this session's
manual **is** the directive quoted above.

---

## Month 1 — what shipped

**Route.** `basics` added to the router (`/basics`) and to `Layout.tsx`'s
`RouteName` union. The existing "Basics" nav button — present since an
earlier session but permanently disabled (`!link.route` → `opacity-30
pointer-events-none`) — now has a route and is clickable, for both the
logged-in and logged-out nav variants. No auth gate: per doctrine, OPEN TAB
is a public surface a stranger can read.

**Component.** `src/client/components/Basics.tsx` — a self-contained,
read-only render of the OPEN TAB: a status line (`OPEN TAB // PUBLIC //
READ-ONLY`, current phase, live UTC clock), the doctrine statement in
quartermaster voice, the price line (USD 100.00/month, cancellation terms),
and the 23-item ration load as a plain HTML table (nomenclature + cadence:
EVERY ISSUE / QUARTERLY / FIRST ISSUE ONLY). COGS is not rendered anywhere
in the component — only a note that it is withheld and margin is held
≥60%. `BASIC_RATION_LOAD` is exported so Month 2/3 work (roster intake,
issue log, load engine) can consume the same array rather than re-deriving
it.

**Style.** No new design-system tokens were added. The existing `bg-bac`
(white) / `text-acc` (black) pair already gives the white-ground/black-ink
base the directive asks for, so Basics uses those directly. Square corners
and 2px rules are enforced locally inside Basics.tsx (plain `<table>`,
`border-collapse`, a 2px `Rule` divider) rather than via the shared `Block`/
`Table` components, which carry `rounded`/`rounded-lg` classes elsewhere in
the app — reusing them here would have broken the "no radius" requirement.
The inverted status line (`bg-acc text-bac`) is the one inversion-hierarchy
element on the page. Font stack is `'Liberation Mono', 'Courier New',
monospace`, applied inline — no `@font-face` was added; no font file ships
with this app, so the IBM-3270 register depends on the viewer's system
having Liberation Mono (common on Linux) and otherwise falls back to
Courier New, which is metrically similar.

**Honest gaps against the directive, marked explicitly:**
- No supplier quotes exist; the ≤USD 40 landed ceiling and ≥60% margin
  are stated as policy in the doctrine copy, not verified against real
  procurement numbers. Real COGS data does not exist in this codebase.
- UPGRADE control, roster intake, and billing (Month 2) are not built.
  Basics.tsx says so on-page: "UPGRADE PATH ... AND ISSUE FULFILLMENT ARE
  NOT YET LIVE ON THIS TAB."
- Nothing in this session contacts a payment processor, a fulfillment
  vendor, or ships a physical object. This is a UI/content build against
  a fictional/simulated commerce doctrine already established elsewhere in
  this app's house style (LOT is a personal-systems product, not a live
  storefront in this repo).

---

## Files

- `src/client/components/Basics.tsx` — new
- `src/client/stores/router.ts` — `basics` route added
- `src/client/components/ui/Layout.tsx` — `RouteName` union + both nav
  arrays wired to the new route
- `src/client/entries/app.tsx` — `Basics` imported, mounted as a
  `TabPanel` alongside System/Logs/Sync/Settings/ApiPage

---

## Next (Month 2, per LOT-FM-001)

UPGRADE control + state machine (USERSHIP/AI → PENDING → ON STRENGTH →
STEADY STATE), roster intake (sizing, shipping address, cadence start),
recurring $100/mo additive billing wired to whatever payment rail this
app already uses for Usership, STAND DOWN downgrade, and an issue-log
scaffold consuming `BASIC_RATION_LOAD`. Flagged for the next session as a
distinct build, not folded into this one — Month 1's exit is "read-only,
live," and it should ship as exactly that before Month 2 adds state.
