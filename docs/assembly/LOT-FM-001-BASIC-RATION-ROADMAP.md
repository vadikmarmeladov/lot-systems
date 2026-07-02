# LOT-FM-001 — BASIC RATION MODULE — 90-DAY BUILD ROADMAP

DOCUMENT CLASS: SELF-ASSEMBLY
MANUAL REF: LOT-FM-001
TAB: Basics (`/basics`) — the hardware/physical layer of the LOT® System
STATUS AS OF: 2026-07-02

--------------------------------------------------------------------------------
DOCTRINE
--------------------------------------------------------------------------------
BASIC is the physical layer of the LOT® System. The Sync/System/Log tabs run the
AI (USERSHIP). The Basics tab issues the ration — the material layer the AI
layer references but cannot ship. Issue, do not sell. The user is ON STRENGTH,
not a customer. The ledger is the marketing: no landing page, no upsell copy,
no layer between the public and the manifest. Terminal house style throughout —
LiberationMono-Bold register (rendered in the app's fixed-width mono stack),
white ground / black ink (theme-token driven, no hardcoded color), inversion-only
hierarchy, 2px rules, square corners, fixed character grid, IBM 3270 register.
Voice: quartermaster, imperative, terse. No marketing, no icons.

ECONOMIC ENVELOPE (never breach):
  PRICE:   USD 100.00 / MO
  COGS:    ≤ USD 40.00 landed per ration
  MARGIN:  ≥ 60%

--------------------------------------------------------------------------------
MONTH 1 — LEDGER & DOCTRINE (the System exists, read-only)          [SHIPPED]
--------------------------------------------------------------------------------
BUILT: `/basics` route + nav tab live (`src/client/components/Basics.tsx`,
`src/client/components/basics/doctrine.ts`). Public OPEN TAB surface: doctrine
statement, USD 100.00/MO price line, 23-item ration manifest rendered as a
quartermaster ledger — nomenclature + spec + cadence, grouped NUTRITION (10) /
HEALTH (7) / HYGIENE (5) / EQUIPMENT (1) — COGS withheld from every row.
Status-line reads the operator's live tags (`ON STRENGTH` / `USERSHIP / AI` /
`NONE`) — no separate enrollment state to fake or drift out of sync. Upgrade
scaffold visible but inert (enrollment gated to M2). Terminal grid tokens
(HeavyRule, ThinRule, SectionLabel, LedgerRow) established for reuse in M2/M3.
EXIT MET: a stranger can open `/basics` and read exactly what LOT issues, at
what cadence, and on what terms, with no account and no purchase. Read-only.
Originally built 2026-06-12 on a superseded iteration branch; cherry-picked
clean onto the current ship line 2026-07-02 (see LOT-SR-20260702-01).

--------------------------------------------------------------------------------
MONTH 2 — UPGRADE & ROSTER (Usership AI → BASIC)                    [PLANNED]
--------------------------------------------------------------------------------
BUILD:
  - UPGRADE control on the Basics tab, visible only to USERSHIP/AI tag holders
    without the BASIC tag. Single imperative action, no cart, no form wizard.
  - State machine: USERSHIP/AI -> PENDING -> ON STRENGTH -> STEADY STATE.
    PENDING = roster intake incomplete (sizing/shipping not yet captured).
    ON STRENGTH = intake complete, first cadence date assigned.
    STEADY STATE = 1+ issue cycle completed without incident.
  - Roster intake: sizing (razor/soap variant if ever needed — none in v1
    manifest, so this is address + household size only for M1's fixed load),
    shipping address, cadence start date. Server-side record, not a form
    dumped into user.metadata blindly — needs its own roster table/column.
  - Recurring $100/mo additive billing on top of existing USERSHIP billing
    (additive line item, not a plan swap).
  - STAND DOWN control: downgrade path that drops the ration (stops billing,
    stops shipments) but explicitly retains the USERSHIP/AI base plan — must
    not accidentally cancel the AI subscription.
  - Issue log scaffold: append-only record of ration cycles (date, status),
    surfaced back into the Basics tab as history once populated.
EXIT: a USERSHIP member can go ON STRENGTH and back OFF, end to end, with
billing and state reflected correctly and the AI plan untouched by STAND DOWN.

--------------------------------------------------------------------------------
MONTH 3 — ISSUE & FULFILLMENT (the box ships)                       [PLANNED]
--------------------------------------------------------------------------------
BUILD:
  - Month-by-month load engine: resolves the correct subset of the 23-item
    manifest for a given cycle per Section 1 cadence (MONTHLY items every
    cycle; QUARTERLY items every 3rd cycle only — TOOTHPASTE, DEODORANT,
    JOURNAL).
  - Supplier quotes confirmed against the COGS ceiling before the first real
    order — landed cost per ration must be priced and checked against the
    ≤USD 40.00 ceiling with the ≥60% margin floor before shipping, not after.
  - Printed manifest card generation: a physical card (PDF) that ships inside
    the box, listing that cycle's contents — the ledger made physical.
  - First issue scheduled and dispatched to a real ON STRENGTH subscriber.
  - Issue log accrues (from M2 scaffold); NEXT ISSUE date advances on the
    Basics tab status line after each dispatch.
EXIT: first real ration ships to a real subscriber; margin verified ≥60% on
the actual landed cost, not an estimate.

--------------------------------------------------------------------------------
DISTRACTION ELIMINATED THIS SESSION
--------------------------------------------------------------------------------
Two competing Basics Tab iteration lines existed (`nifty-allen-*`, superseded,
and `beautiful-johnson-56p7ov`, BEST) sitting unshipped in the manifest ship
queue while master had no Basics tab at all. Rather than author a third
divergent implementation, the BEST M1 commit was cherry-picked onto the
current ship line and green-gated — one ledger, one tab, no forked doctrine.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
================================================================================
