# LOT-DOCTRINE  rev G

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

## Security Surface Minimization

Diagnostic endpoints are development tools, not production features. Any
endpoint that reveals system internals — API key presence or fragments,
admin email lists, error constructor names, internal search method names —
must be behind authentication or removed entirely. "Masked" API key
fragments (first-8 + last-4) are still a leak: they confirm the key is set,
reveal its format, and narrow an attacker's search space. Debug endpoints
that make live API calls with production credentials on every unauthenticated
GET request are especially dangerous. Batch security rollbacks caused by
deploying too many changes at once are preventable: apply one fix, verify,
deploy, repeat. Error responses must never echo internal error.message or
error.constructor.name to callers — those belong in server logs only.
(SR-20260607-03: 5 public debug endpoints removed; private profile sealed
to { isPrivate: true }; 404/500 debug fields stripped.)
