# LOT-FM-001 — BASIC RATION
## Field Manual: The Civilian Ration Subscription

```
CLASS:    RESTRICTED // S-2 EYES (COGS section only — ledger nomenclature is public)
S-2:      VADIK MARMELADOV
REV:      A
DATE:     2026-09-07
STATUS:   MONTH 1 OF 3 — BUILD IN PROGRESS
```

---

## 0. DOCTRINE

LOT issues. LOT does not sell.

A subscriber is not a customer acquiring a product — they are ON STRENGTH,
carried on a roster, issued a standing load against a fixed monthly cadence.
The relationship is administrative, not transactional. There is no cart, no
checkout copy, no upsell language. There is a manifest, a rate, and a status.

**BASIC** is the physical ration tier of the LOT system. Where LOT Usership
issues software (the AI plan — memory engine, quantum intent signals, digital
network access), BASIC issues hardware: the small, recurring, physical load
that keeps a person equipped. Usership is the mind. BASIC is the kit.

The ledger is the marketing. There is no polished sales page sitting on top
of a hidden manifest — the page a stranger reads and the page a subscriber's
issue is drawn from are the same document. What is withheld (unit landed
cost, margin) is withheld everywhere, uniformly, not selectively concealed
from the public and revealed to the subscriber.

---

## 1. TERMS OF ISSUE

| Field | Value |
|---|---|
| Designation | BASIC RATION |
| Rate | USD 100.00 / month |
| Billing | Recurring, monthly, additive to any existing Usership (AI) plan |
| Minimum term | None. STAND DOWN at any time. |
| Eligibility | Any LOT Usership (AI plan) member. BASIC does not stand alone — it is issued on top of Usership. |
| Landed cost ceiling | USD 40.00 / month (hard ceiling, never breached) |
| Margin floor | 60% gross (target: ~70%, see §3) |
| Cadence | Monthly load; individual items ship monthly, bi-monthly, quarterly, semiannually, or annually per §2 — the box is not the same every month |

STAND DOWN drops the ration and its billing line. It does not touch
Usership — the AI plan continues unaffected. This is a downgrade, not a
cancellation of the underlying membership.

---

## 2. THE LOAD — 23 ITEMS

Public ledger shows **nomenclature + cadence only**. Landed cost is
S-2-restricted and is recorded here for margin verification, not for
display in any UI surface.

| # | NOMENCLATURE | CADENCE | LANDED / CYCLE | AMORTIZED / MO |
|---|---|---|---|---|
| 01 | Ration Manifest Card, printed | Monthly | $0.35 | $0.35 |
| 02 | Toothbrush, compact, replaceable head | Quarterly | $1.20 | $0.40 |
| 03 | Toothpaste, travel tube | Monthly | $0.90 | $0.90 |
| 04 | Soap, bar, unscented | Monthly | $0.75 | $0.75 |
| 05 | Razor cartridge, single-blade | Monthly | $1.10 | $1.10 |
| 06 | Deodorant, stick, travel | Bi-monthly | $1.50 | $0.75 |
| 07 | Nail clipper | Annual | $1.00 | $0.08 |
| 08 | Cotton swabs, 50ct | Quarterly | $0.60 | $0.20 |
| 09 | Dental floss, spool | Bi-monthly | $0.50 | $0.25 |
| 10 | Hand sanitizer, travel | Monthly | $0.70 | $0.70 |
| 11 | Adhesive bandages, 10ct | Quarterly | $0.80 | $0.27 |
| 12 | Vitamin D3, 30ct blister | Monthly | $1.80 | $1.80 |
| 13 | Electrolyte packets, 10ct | Monthly | $2.20 | $2.20 |
| 14 | Socks, 1 pair, LOT-marked | Quarterly | $3.50 | $1.17 |
| 15 | Badge pin, enamel, seasonal | Quarterly | $1.40 | $0.47 |
| 16 | Notebook, pocket, grid-ruled | Semiannual | $1.60 | $0.27 |
| 17 | Pen, LOT-marked, black ink | Semiannual | $0.90 | $0.15 |
| 18 | Earplugs, foam, 3 sets | Monthly | $0.40 | $0.40 |
| 19 | Sleep mask | Annual | $2.20 | $0.18 |
| 20 | Multi-tool, card-sized | Annual | $2.80 | $0.23 |
| 21 | USB-C cable, charge/data | Annual | $3.80 | $0.32 |
| 22 | Coffee, instant, 10 sachets | Monthly | $2.80 | $2.80 |
| 23 | Fulfillment: mailer, void-fill, label, pick-pack, parcel freight | Monthly | $14.00 | $14.00 |

**TOTAL LANDED: $29.74 / month amortized.**
**CEILING: $40.00. HEADROOM: $10.26 (25.7% of ceiling, unspent).**
**MARGIN: (100.00 − 29.74) / 100.00 = 70.26% gross. FLOOR: 60%. PASS.**

Cadence exists so the box is never the same twice in a row without
inflating cost — quarterly/semiannual/annual items rotate through the
monthly load per the engine built in Month 3 (§6).

---

## 3. VISUAL IDENTITY — MILITARY-SPEC TRANSLATION

House style, formalized as build constraints (non-negotiable):

- **Type:** monospace register — `Liberation Mono` where available, falling
  back to `Courier New` / `Consolas` / system `monospace`. Bold weight for
  all structural text (labels, headers, status). This is a font-stack
  decision, not a bundled webfont — no external font CDN, no CSP exception.
- **Ground:** white. **Ink:** black. No third color. No accent hue borrowed
  from the rest of the app's `--acc` theme system — BASIC is achromatic by
  doctrine.
- **Hierarchy:** inversion only. Emphasis = black-on-white flips to
  white-on-black. No bolding-via-color, no size ramp beyond two steps
  (label size, and one step up for the rate line).
- **Rules:** 2px solid black borders. No gradients, no shadows, no blur.
- **Corners:** square. `border-radius: 0` everywhere in this surface,
  overriding the app's default rounded system.
- **Grid:** fixed character grid — columns align like a fixed-width ledger
  printout (IBM 3270 terminal register). Tabular numerals where the
  runtime provides them.
- **Voice:** quartermaster. Imperative, terse, third-person-absent. No
  marketing adjectives ("amazing", "premium"). Status is reported, not sold.

This is scoped to the BASIC surface only (`Basics.tsx` and its standalone
entry). It does not change the rest of the app's rounded, `--acc`-themed
design system.

---

## 4. OPEN TAB — PUBLIC SURFACE (MONTH 1)

Route: `/basics`. Serves two audiences from one component
(`src/client/components/Basics.tsx`):

- **Logged out (a stranger):** standalone page, no app shell, no login
  wall. Renders the doctrine statement, the terms of issue, the 23-item
  ledger (nomenclature + cadence, COGS withheld), and the rate line.
  Read-only. This is the page a stranger reads to know "what LOT issues
  and on what terms."
- **Logged in (a Usership member):** the same component, mounted as the
  **Basics** tab inside the normal app shell/nav. Same content. Month 2
  adds the UPGRADE control and roster state on top of this surface for
  authenticated members; Month 1 ships it read-only for everyone.

No separate marketing copy layer exists between these two renders. Per
doctrine (§0), they are the same document.

---

## 5. UPGRADE STATE MACHINE (MONTH 2 — SPECIFICATION, NOT YET BUILT)

```
USERSHIP/AI ──(UPGRADE)──> PENDING ──(roster intake complete)──> ON STRENGTH ──> STEADY STATE
                                                                       │
                                                                  (STAND DOWN)
                                                                       │
                                                                       v
                                                                 USERSHIP/AI
```

- **USERSHIP/AI** — baseline. Member has the AI plan, no ration.
- **PENDING** — UPGRADE clicked, roster intake in progress (sizing,
  shipping address, cadence start date). No charge yet.
- **ON STRENGTH** — intake complete, first billing cycle started, first
  issue scheduled. Recurring $100/mo additive charge begins.
- **STEADY STATE** — ≥1 completed issue cycle. Roster entry is stable;
  issue log has ≥1 entry.
- **STAND DOWN** — subscriber-initiated downgrade from ON STRENGTH or
  STEADY STATE back to USERSHIP/AI. Ration billing line drops. AI plan
  billing is untouched.

Real payment processing in this codebase does not exist as an in-app
Stripe/PSP integration today — the one existing subscription surface
(`SubscribeWidget.tsx`) links out to `brand.lot-systems.com` for billing.
Month 2's "recurring $100/mo additive billing" must either (a) wire an
actual PSP integration in this repo, or (b) extend the existing
external-billing pattern with a return/webhook path back into this
roster state machine. That choice is a Month 2 decision, not assumed here.

---

## 6. ISSUE & FULFILLMENT (MONTH 3 — SPECIFICATION, NOT YET BUILT)

- Month-by-month load engine: given a subscriber's cadence start date and
  the table in §2, compute which of the 23 items are due this cycle.
  Monthly items appear every cycle; quarterly/semiannual/annual items
  rotate in on their own schedule anchored to the start date.
  Every load also carries item 01 (manifest card) and item 23
  (fulfillment) — one per cycle.
- Supplier quotes must be confirmed against the §2 ceiling before the
  first real box ships — §2's figures are planning estimates, not
  signed quotes.
- Printed manifest card generation: item 01 rendered per-subscriber,
  same visual spec as §3, listing that cycle's contents.
- Issue log: append-only record of what shipped, when, to whom. NEXT
  ISSUE date advances on each dispatch.
- Exit: first real ration ships to a real subscriber, margin verified
  ≥60% against actual (not estimated) landed cost.

---

## 7. NINETY-DAY BUILD STATUS

| Month | Scope | Status |
|---|---|---|
| 1 | OPEN TAB ledger, doctrine, price line, status line, terminal grid | **BUILT — this session** |
| 2 | UPGRADE control + state machine, roster intake, additive billing, STAND DOWN | Not started — spec above |
| 3 | Load engine, supplier quotes, manifest card generation, first real issue | Not started — spec above |

One session builds one demonstrable increment. Months 2 and 3 are
specified above so the next build session has ground truth to work from
without re-deriving doctrine.

---

**LOT SYSTEMS CORPORATION**
**Vadim Marmeladov — CEO, Owner LOT®**
