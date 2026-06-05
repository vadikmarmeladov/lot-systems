# LOT-DOCTRINE  rev D

## Render Isolation

When a store subscription triggers a re-render, the blast radius is every
component in the subscribing tree. Move subscriptions to the narrowest
component that needs the value. Shared parent state that only toggles
visibility belongs in lightweight wrapper components, not the root.
The LazyMount pattern defers all subscriptions in a below-the-fold block
until the block enters the viewport — once mounted it stays mounted, so
there is no thrash. Apply LazyMount to any block whose widgets subscribe
to heavy stores (intentionEngine, selfAssembly) and are not visible on
initial load.
(SR-20260602-01: router moved from App to TabPanel; System re-render
eliminated on tab switch. SR-20260603-01: unused Block subscriptions
removed; per-item subscriptions lifted to parent in Sync; nav buttons
memoized so only active-state changes trigger re-render.
SR-20260604-01: MicroGameWidget loop gated by useActiveViewport;
QuantumEngineWidgets wrapped in LazyMount.
SR-20260605-02: CQGS Biofield Engine block — QuantumStateWidget,
PatternRecognitionWidget, AIFeedbackWidget, SignalStreamWidget,
IntegrityWidget — wrapped in LazyMount. Five intentionEngine subscribers
now dormant until operator scrolls into range.)

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
