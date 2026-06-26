# LOT-DOCTRINE  rev L

## Render Isolation

When a store subscription triggers a re-render, the blast radius is every
component in the subscribing tree. Move subscriptions to the narrowest
component that needs the value. Shared parent state that only toggles
visibility belongs in lightweight wrapper components, not the root.
(SR-20260602-01: router moved from App to TabPanel; System re-render
eliminated on tab switch. SR-20260603-01: unused Block subscriptions
removed; per-item subscriptions lifted to parent in Sync; nav buttons
memoized so only active-state changes trigger re-render.)

## Subscription Minimization

When a component serves multiple variants via a `kind` prop, each variant
should subscribe only to the stores its rendering path requires. Variant
dispatch (primary / secondary / secondary-rounded) belongs in thin private
sub-components, not a single top-level component. The default variant
(secondary) subscribes to nothing — any store added must earn its presence
by being read in the render output.
(SR-20260603-02: Button.tsx split into PrimaryBtn [theme only],
SecondaryRoundedBtn [isMirrorOn only], secondary inline [no subscriptions].
Eliminates wasted re-renders on every theme and mirror toggle for the
majority of button instances in the system.)

## Async Signal Recording

Synchronous QIE signal work (localStorage serialization, pattern analysis)
must not block user-facing visual feedback. Defer signal recording via
setTimeout(0) so React commits the render before expensive work runs.
(SR-20260604-01: biofield cascade animation blocked by recordSignal;
deferred to allow immediate visual response.)

## Backend Whitelist Hygiene

User-facing event types created via POST must appear in the GET
displayableEvents whitelist or the write→read loop is silently broken.
(SR-20260604-01: calendar_entry saved but never returned.)

## Ship Mode Discipline

When multiple session branches develop the same feature independently,
competing iterations accumulate. MANIFEST catalogs all branches, marks
the BEST iteration per feature, and Ship mode cherry-picks that single
iteration onto a staging branch for green-gated merge to master.
One feature per ship. Master never touched while red. Cherry-pick not
merge (avoids dragging divergent branch history into the main line).
(SR-20260605-01: 115 branches across 23 clusters; 69 redundant
iterations identified; 8 features ready for ship-mode merge.)

## Operator RFI Pattern

The system prompts the operator (Memory Engine: daily questions based on signal
density). The inverse — operator queries the system — is a Request for
Information (RFI) through the QI terminal. The QI is not a chatbot; it is an
intelligence analyst reading the operator's own record. Response format is
INTSUM: direct assessment, specific data points, one recommendation.
The same data pipeline that builds the Memory prompt serves the QI response.
New event types from RFI responses (qi_rfi) must appear in displayableEvents
(Backend Whitelist Hygiene) so the write→read loop persists in the LOG.
(SR-20260605-04: /qi trigger → POST /api/qi → Together AI → qi_rfi log;
reuses QIE getUserState + getUserIndex from client side.)

## Graceful Degradation

When a server-side computation feeds a client-side gate (feature visibility,
access control, UI rendering), the catch-block fallback must not be a value
that blocks the feature. If the computation fails, the field should stay
absent (undefined) and the client gate should treat absence as "not computed,
allow" rather than "denied." A forced fallback to a restrictive default
(e.g. 'dormant') silently disables features whenever the computation errors,
with no signal to the operator that anything is wrong.
(SR-20260607-02: assembly phase catch set 'dormant' → QR disappeared;
client defaulted undefined to 'dormant' → double block. Fix: server omits
field on error, client skips gate when field absent.)

## Cross-Device Sync

When a user modifies state on one device (settings, theme, privacy), all
other active sessions for the same user must converge without full page
reload. The mechanism is SSE event emission scoped to the owning userId —
never broadcast to all clients. The receiving client refetches the full
user profile (getMe) to re-hydrate stores. Visibility change (tab return)
is the fallback path for sessions where SSE was disconnected. Server-side
dedup guards prevent duplicate writes when the same action arrives from
multiple open tabs within a short window (30 seconds for memory answers).
Process.nextTick callbacks that perform async work (geocoding, logging)
must be try-catch wrapped — an unhandled rejection in a fire-and-forget
callback crashes the server process.
(SR-20260611-01: Settings crash from unguarded timezone lookup in
process.nextTick; answer dedup guard on POST /memory/answer; SSE
settings_updated event on /settings, /theme-change, /update-privacy;
visibility refetch on document.visibilitychange.)


## Log Military Style (COCKPIT-RULE)
The log event body contains instrument readings only — codes, metrics, tabular
key-value pairs. The Block label names the event (CIRC:, SIL:, CASCADE:, etc.).
Prose narration does not belong in the body. "Biofield coherence cascade detected"
is the label's job (done), not the body's job. Body = data.
(SR-20260611-02: 8 handlers compressed; COCKPIT-RULE minted in LEXICON rev C.)

## CSS-Only Progression

When a visual property varies by user progression tier, prefer a data attribute
on the document root (`data-density`, `data-theme`, etc.) with CSS descendant
selectors over per-component store subscriptions. The store sets the attribute
once on state change; CSS resolves the correct visual without any component
knowing its own tier. This extends RENDER-ISOLATION from "narrow scope" to
"zero scope" — the component subscribes to nothing, yet its appearance evolves.
(SR-20260612-04: 5 density tiers override grid-fill-hover::before pattern via
[data-density] selectors. Zero new subscriptions in Button.tsx.)

## Manifest Hygiene

When competing branches accumulate (N iterations of the same feature), the
MANIFEST must track which iteration is BEST and which are SUPERSEDED. On each
self-assembly audit, re-evaluate BEST by checking: (1) most recent iteration,
(2) freshest base (forked from latest master merge), (3) fewest file conflicts
with other BEST branches. Superseded clusters are prunable but never deleted
without S-2 confirmation — they are provenance records. The MANIFEST date field
updates on every audit; feature rows update when a new iteration supersedes.
(SR-20260605-01: MANIFEST created, 115 branches cataloged, 8 BEST identified.
SR-20260606-02: Week 23 ship report referenced MANIFEST for feature count.
SR-20260612-06: MANIFEST v2 — 144 branches, 5 BEST superseded, 90 prunable.)

## Signal Momentum Architecture

The DIURNAL ARC (P76→P79→P80) is the complete named engagement loop in the QIE.
P76 morning-launch-sequence fires when 3+ intentions + journal + memory appear
within the first 3 hours of the operator's day. P79 evening-coherence-close fires
when journal + reflection + reduced pace appear in the final 2 hours. P80
signal-momentum-lock fires when 5+ of the last 7 days each contain 3+ unique
signal sources. Together they detect ignition, closure, and sustained multi-day
engagement. No single pattern captures all three; no two are redundant. The arc
is the unit of behavioral intelligence.
A background job (Job 19 at 20:00 UTC) writes the signal_momentum log entry daily
for operators who have maintained the lock. The MOM: block handler surfaces it in
the LOG in military instrument style.
(SR-20260619-01: P76 minted; SR-20260621-01: P79 + EVE: minted;
SR-20260621-02: P80 + MOM: + MOMENTUM LOCK minted. DIURNAL ARC named.)

## Query Batching

When a route handler issues multiple independent database queries sequentially,
wrap them in Promise.all. When a loop issues one query per user (N+1), replace
with a single IN-clause query and group results in a Map. Unbounded findAll
calls on user-facing routes get a limit — 365 for historical data, 200 for
cohort matching, 500 for admin views. The database constraint is not touched;
the protection is at the query layer.
(SR-20260614-02: analytics N+1 streak loop eliminated — 50 sequential Answer
queries replaced with single batched IN query. user-stats 4 sequential queries
parallelized. chat-messages users+likes parallelized. cohort limited to 200.
Client: 3 redundant analyzeIntentions() calls removed — already has 5-min
cooldown at intentionEngine.ts:231.)

## BASIC Plan — Hardware Layer

The BASIC plan is the hardware tier of the LOT® System: a physical ration issued
monthly to ON-STRENGTH subscribers at USD 100/30 days. The RATION-MANIFEST is
23 items (nutrition, supplement, hygiene, field equipment, documentation). COGS
ceiling is USD 40 landed; margin floor is 60%; both are inviolable per LOT-FM-001.
The OPEN TAB is the public surface: nomenclature + cadence displayed; COGS
withheld. No marketing, no color, no radius, no icons. Voice: quartermaster,
imperative, terse. Style: LiberationMono-Bold, white ground, black ink, 2px rules,
inversion-only hierarchy, fixed character grid, IBM 3270 register.
Month 1 delivers the ledger (read-only, live). Month 2 wires the UPGRADE path
(USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE). Month 3 ships the first box.
(SR-20260626-01: BASICS M1 delivered — OPEN TAB live on /basics.)
