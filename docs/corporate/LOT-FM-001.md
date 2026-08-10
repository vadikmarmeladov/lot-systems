================================================================================
LOT SYSTEMS CORPORATION
FIELD MANUAL LOT-FM-001
BASIC — CIVILIAN RATION SUBSCRIPTION
================================================================================

DOCUMENT    LOT-FM-001
CLASS       RESTRICTED // S-2 EYES
AUTHORIZED  S-2 // VADIK MARMELADOV
DATE        2026-08-10
STATUS      MONTH 1 OF 3 — BUILD IN PROGRESS

================================================================================
SECTION 0 — SCOPE
================================================================================

This manual specifies the LOT civilian ration subscription as a single issued
system: product doctrine (0.1), the 23-item ration load (0.2), the visual
identity in formal military-spec language (0.3), the transfer of that identity
into LOT software (0.4), and the 90-day build sequence (0.5). It is the source
document for the BASIC (Basics tab) module. Nothing in this manual is sold —
it is issued.

--------------------------------------------------------------------------------
0.1 — DOCTRINE
--------------------------------------------------------------------------------

LOT issues. LOT does not sell.

A subscriber who enrolls in BASIC goes ON STRENGTH: entitled to draw, on a
fixed monthly cadence, against a standing 23-line ration. The ration is not a
curated box and not a surprise — it is a manifest, published in full, in the
same register a quartermaster reads a supply chit. What ships this month is
what the ledger says ships this month. There is no gap between the public
page and the shipping label.

Terms:
  - USD 100.00 / month. Flat. No tiers, no bundling, no upsell inside the tab.
  - No contract. STAND DOWN at will — drops the ration, keeps whatever else
    the subscriber holds (Usership / AI plan is untouched by a ration exit).
  - Landed cost ceiling: USD 40.00 per cycle. Gross margin floor: 60%. This
    ceiling is a hard architectural constraint, not a target — no item, no
    substitution, and no fulfillment change may cross it. Verified against
    supplier quotes before Month 3 ships (0.5, Month 3).
  - The ledger is the marketing. There is no brochure page, no lifestyle
    copy, no photography layer between the public tab and the manifest
    itself. What the operator reads is what the operator gets.

Voice: quartermaster. Imperative, terse, declarative. No marketing language,
no exclamation, no color-as-persuasion. A supply order, not a pitch.

--------------------------------------------------------------------------------
0.2 — THE 23-ITEM RATION LOAD
--------------------------------------------------------------------------------

23 lines. Each line carries a cadence: MONTHLY items ship every cycle;
QUARTERLY items ship every third cycle; ANNUAL items ship once per 12
cycles. All 23 lines are always listed on the manifest regardless of cadence
— the ledger shows the full standing order, not just what is in this
month's box (Month 3 introduces the box-by-box cadence engine that reads
this same table). COGS is tracked internally against the 0.1 ceiling and is
never rendered on the public ledger.

LINE  NOMENCLATURE                                CADENCE     CATEGORY
----  ------------------------------------------  ----------  ----------
01    FIELD NOTEBOOK, 96-LEAF, RULED               MONTHLY     STATIONERY
02    PEN, BALLPOINT, BLACK, 3-PACK                MONTHLY     STATIONERY
03    PENCIL, NO. 2, HEXAGONAL, 2-PACK             MONTHLY     STATIONERY
04    SOAP, BAR, UNSCENTED, 4 OZ                   MONTHLY     HYGIENE
05    TOOTHPASTE, FLUORIDE, TRAVEL SIZE            MONTHLY     HYGIENE
06    TOOTHBRUSH, MEDIUM BRISTLE                   MONTHLY     HYGIENE
07    RAZOR, DISPOSABLE, 5-BLADE, 2-PACK           MONTHLY     HYGIENE
08    DEODORANT, UNSCENTED, SOLID                  MONTHLY     HYGIENE
09    SOCKS, CREW, BLACK, 3-PAIR                   MONTHLY     APPAREL
10    UNDERSHIRT, CREW NECK, WHITE, 2-PACK         MONTHLY     APPAREL
11    HANDKERCHIEF, COTTON, WHITE, 2-PACK          MONTHLY     APPAREL
12    BATTERY, AA, ALKALINE, 4-PACK                MONTHLY     EDC
13    USB-C CABLE, 1M, BRAIDED                     QUARTERLY   EDC
14    FLASHLIGHT, EDC, AAA                         QUARTERLY   EDC
15    MULTITOOL, FOLDING, 6-FUNCTION               QUARTERLY   EDC
16    FIRST AID KIT, POCKET                        QUARTERLY   HOME
17    LIGHTER, REFILLABLE                          QUARTERLY   EDC
18    TOWEL, MICROFIBER, COMPACT                   QUARTERLY   HOME
19    SEWING KIT, TRAVEL                           QUARTERLY   HOME
20    DUFFEL, CANVAS, 30L                          ANNUAL      HOME
21    WATCH CAP, WOOL BLEND, BLACK                 ANNUAL      APPAREL
22    WATER BOTTLE, STEEL, 750 ML                  ANNUAL      HOME
23    LOT MANIFEST CARD, PRINTED, ISSUE-STAMPED    MONTHLY     ADMIN

Line 23 is the physical proof-of-issue: a printed card, stamped with the
issue date and NEXT ISSUE date, packed in every box regardless of what else
ships that cycle (Month 3, printed manifest card generation).

Internal landed-cost model (COGS ceiling verification, withheld from the
public ledger):
  monthly-cadence lines, summed per cycle             USD 17.05
  quarterly-cadence lines, amortized /3 per cycle      USD  6.20
  annual-cadence lines, amortized /12 per cycle        USD  1.45
  packaging (mailer / box)                             USD  3.50
  domestic ground shipping                             USD  8.50
  pick-and-pack labor                                  USD  2.00
                                                        ----------
  TOTAL LANDED, PER CYCLE                              USD 38.70
  CEILING (0.1)                                        USD 40.00
  MARGIN AT USD 100.00                                    61.3%

Under ceiling. Above margin floor. Recheck against real supplier quotes
before Month 3 ships — this is a planning model, not a locked BOM.

--------------------------------------------------------------------------------
0.3 — VISUAL SPEC (military-spec language)
--------------------------------------------------------------------------------

Ground:        white ground / black ink. Fixed. Does not follow the app's
                light/dark theme — a manifest reads the same regardless of
                device settings, the way a printed card does.
Type:          monospace, 'Liberation Mono' first, falling through the
                system mono stack. Bold for register headers and the status
                line; regular weight for ledger body text.
Hierarchy:     inversion only. One level of emphasis = solid black fill,
                white text. No color, no size ramp, no italics-as-emphasis.
Rule weight:   2px solid rules only. No 1px hairlines, no gradients, no
                drop shadows.
Corners:       square. No border-radius anywhere in this surface.
Grid:          fixed character grid — ledger columns are fixed-width, set in
                ch units, not flexible/auto columns.
Register:      IBM 3270 terminal register — dense, uppercase field labels,
                colon-terminated key/value pairs (STATUS: OPEN), no
                decorative iconography.
No color, no radius, no icons, no marketing copy anywhere in this surface.

--------------------------------------------------------------------------------
0.4 — SOFTWARE TRANSFER
--------------------------------------------------------------------------------

Surface:       Basics tab. src/client/components/Basics.tsx. Route `basics`,
                path /basics. Nav entry already reserved in Layout.tsx (was
                disabled placeholder; Month 1 wires it live).
Public surface ("OPEN TAB"): visible to any logged-in LOT member regardless
                of BASIC enrollment status — reading the manifest requires no
                purchase. ("Public" here means open to the whole roster, not
                gated behind the ration itself; the wider app has no
                unauthenticated browsing mode to gate against.)
Data:          src/client/lib/basics.ts — RATION_ITEMS (23-line table, no
                cost fields shipped to the client bundle), DOCTRINE text,
                PRICE_USD constant. COGS model lives only in this manual
                (0.2), never in shipped code, so "ledger is the marketing"
                holds at the bundle level, not just the UI level.
State machine
(Month 2):     USERSHIP/AI -> PENDING -> ON STRENGTH -> STEADY STATE, plus
                STAND DOWN (ON STRENGTH -> USERSHIP/AI, ration drops, AI
                plan retained). Defined fully in 0.5, Month 2.

--------------------------------------------------------------------------------
0.5 — 90-DAY BUILD SEQUENCE
--------------------------------------------------------------------------------

MONTH 1 — LEDGER & DOCTRINE (the system exists, read-only)
  Render the 23-item manifest as a ledger (nomenclature + cadence; COGS
  withheld). Doctrine statement. Price line. Status-line component.
  Terminal tokens + grid established.
  EXIT: a LOT member can read what BASIC issues and on what terms. Live.

MONTH 2 — UPGRADE & ROSTER (Usership AI -> BASIC)
  UPGRADE control + state machine (USERSHIP/AI -> PENDING -> ON STRENGTH ->
  STEADY STATE). Roster intake (sizing, shipping address, cadence start).
  Recurring $100/mo additive billing (does not replace Usership/AI billing).
  STAND DOWN downgrade (drops ration, retains AI). Issue log scaffold.
  EXIT: a Usership member can go ON STRENGTH and back OFF, end to end.

MONTH 3 — ISSUE & FULFILLMENT (the box ships)
  Month-by-month load engine reading the cadence table in 0.2. Supplier
  quotes confirmed against the COGS ceiling in 0.2. Printed manifest card
  generation (line 23). First issue scheduled and dispatched. Issue log
  accrues; NEXT ISSUE advances on the status line.
  EXIT: first real ration ships to a real subscriber. Margin verified >= 60%.

Ship a working increment every month. Each month ends in a demonstrable
state. Eliminate one distraction.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-FM-001
================================================================================
