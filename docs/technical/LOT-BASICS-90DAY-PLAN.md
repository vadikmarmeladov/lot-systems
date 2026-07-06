================================================================================
LOT SYSTEMS / TECHNICAL SPEC
DOCUMENT: LOT-BASICS-90DAY-PLAN
TITLE:    BASICS (Basic Ration Module) — 90-Day Build Plan
REF:      LOT-FM-001 Self-Assembly Directive
S-2:      VADIK MARMELADOV
DATE:     2026-07-06
STATUS:   MONTH 1 SHIPPED · MONTH 2 SCOPED · MONTH 3 SCOPED
================================================================================

Doctrine: Issue, do not sell. USD 100/mo. ≥60% margin. ≤USD 40 landed COGS.
The ledger is the marketing — no layer between public and manifest.

--------------------------------------------------------------------------------
MONTH 1 — LEDGER & DOCTRINE  ·  SHIPPED (this session, trunk)
--------------------------------------------------------------------------------
Live at /basics. Public, read-only, no auth required to view.

  src/client/components/basics/doctrine.ts   23-item RATION_MANIFEST, DOCTRINE_LINES,
                                              PRICE_LINE, MANUAL_REF, RATION_COUNT
  src/client/components/Basics.tsx           Ledger render, status line, upgrade scaffold
  src/client/stores/router.ts                 basics: '/basics'
  src/client/components/ui/Layout.tsx         Nav wired (was coming-soon-grayed, now live)
  src/client/entries/app.tsx                  TabPanel registered

Exit condition met: a stranger visiting /basics reads the doctrine, the price,
and all 23 items with nomenclature + spec + cadence. COGS withheld. No auth wall.

--------------------------------------------------------------------------------
MONTH 2 — UPGRADE & ROSTER  ·  NEXT BUILD
--------------------------------------------------------------------------------
Exit condition: a Usership member can go ON STRENGTH and back OFF, end to end.

DATA MODEL (this repo has no payment processor — tags + a new table, matching
the existing pattern used by UserTag and the agent_ledger migration):

  1. Add 'Basic' to UserTag enum (src/shared/types/index.ts). Tag presence is
     the source of truth for ration entitlement, same as every other tier.
  2. New table `ration_roster` (migration, mirrors 20260530120000_add-agent-ledger-table
     shape): userId, size (S/M/L/XL — for the field journal / apparel-adjacent
     items only), shippingAddress, cadenceStartDate, status
     (PENDING/ON_STRENGTH/STAND_DOWN), createdAt, updatedAt.
  3. New table `ration_issue_log` (scaffold only this month — populated M3):
     userId, issueDate, itemsSnapshot (jsonb — manifest at time of issue,
     since the manifest will evolve), status (SCHEDULED/DISPATCHED).

STATE MACHINE (client + server, enforced server-side):

  USERSHIP/AI (existing tag)
    │  UPGRADE (requires Usership tag; additive, does not replace it)
    ▼
  PENDING           — roster intake form submitted, awaiting cadence start date
    │  cadence start date reached (scheduled job, see scheduled-jobs.ts pattern)
    ▼
  ON STRENGTH       — 'Basic' tag applied, $100/mo additive charge begins,
    │                  NEXT ISSUE date computed and shown in status line
    │  STAND DOWN (user-initiated)
    ▼
  STEADY STATE      — ration active, recurring cadence, no further data entry
                       until STAND DOWN or a manifest-driven resupply event

STAND DOWN: drops 'Basic' tag, cancels the additive $100 charge, retains
'Usership' (AI layer untouched) and roster history (append-only — never
delete a roster record, mark STAND_DOWN status instead, matching the
ledger's append-only doctrine).

BILLING: no Stripe/payment processor exists in this codebase today. $100/mo
"additive billing" for M2 means: an admin-visible recurring charge record,
not an automated card charge. (Existing precedent: public-api.ts's Usership
transaction history is already a recorded ledger, not a live payment gateway.)
Real payment processing is out of scope for M2 unless S-2 explicitly directs
integrating a processor — flag this gap in the M2 session report rather than
quietly building a fake "charge succeeded" state.

UI additions to Basics.tsx:
  - UPGRADE button replaces the current static "ENROLLMENT OPENS — M2 BUILD
    CYCLE" placeholder text once Usership is confirmed.
  - Roster intake form (size, shipping address, cadence start) — reuses
    existing form patterns from Settings.tsx.
  - STAND DOWN control in the status-line section, visible only when
    ON STRENGTH.
  - Status line gains NEXT ISSUE date once ON STRENGTH.

--------------------------------------------------------------------------------
MONTH 3 — ISSUE & FULFILLMENT  ·  SCOPED
--------------------------------------------------------------------------------
Exit condition: first real ration ships to a real subscriber. Margin verified
≥60%.

  1. Load engine: month-by-month cadence resolver reading RATION_MANIFEST
     cadence field (MONTHLY/QUARTERLY/ANNUALLY) to compute which of the 23
     items are due on a given roster member's NEXT ISSUE date.
  2. Supplier quotes: manual COGS entry per item (admin-only, not public —
     the ledger withholds COGS per doctrine) checked against the USD 40.00
     landed ceiling; a session/report must record the actual verified
     landed cost before the first ship, not an estimate.
  3. Printed manifest card: server-rendered document (existing pdfkit
     dependency already used by the badge codex generator scripts) listing
     the operator's NEXT ISSUE contents — accompanies the physical box.
  4. Scheduled job (src/server/scheduled-jobs.ts pattern) advances
     ration_issue_log: on cadence date, snapshot due items, mark SCHEDULED,
     then DISPATCHED once a human confirms physical shipment (this system
     does not control a warehouse — dispatch confirmation is manual).
  5. Status line reads ration_issue_log for NEXT ISSUE date + last dispatch.

Margin check before first ship: sum verified landed COGS for the cadence's
due items ≤ USD 40.00, and 100 − COGS ≥ 60 (60% margin floor). If a supplier
quote breaches the ceiling, the item is held out of that cycle's issue and
logged — never silently absorbed into a lower margin.

--------------------------------------------------------------------------------
OUT OF SCOPE (flag, don't silently build)
--------------------------------------------------------------------------------
  - Real payment processor integration (Stripe or similar) — not present
    anywhere in this codebase today; M2's "$100/mo additive billing" is a
    recorded charge, not a live transaction, until S-2 directs otherwise.
  - Warehouse/inventory automation — M3's fulfillment is human-confirmed
    dispatch, not an automated pick-pack-ship pipeline.
  - Supplier API integration — COGS entry is manual admin input each cycle.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-BASICS-90DAY-PLAN
================================================================================
