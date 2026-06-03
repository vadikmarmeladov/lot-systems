# LOT-DOCTRINE  rev C

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
