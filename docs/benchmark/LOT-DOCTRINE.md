# LOT-DOCTRINE  rev B

## Render Isolation

When a store subscription triggers a re-render, the blast radius is every
component in the subscribing tree. Move subscriptions to the narrowest
component that needs the value. Shared parent state that only toggles
visibility belongs in lightweight wrapper components, not the root.
(SR-20260602-01: router moved from App to TabPanel; System re-render
eliminated on tab switch. SR-20260603-01: unused Block subscriptions
removed; per-item subscriptions lifted to parent in Sync; nav buttons
memoized so only active-state changes trigger re-render.)
