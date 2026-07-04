# Button Lag & Rendering Investigation

**Date:** 2026-07-04
**Type:** Diagnostic / historical audit (no code changes)
**Branch reviewed:** `claude/brave-rubin-o3s7zc` (HEAD `cc33b8b`), cross-checked against `master`
**Trigger:** Scheduled review of "buttons lagging" / rendering complaints

## Summary

No open GitHub issue or PR currently reports button lag (`search_issues`/`search_pull_requests`
for lag/render/performance on `lot-systems/lot-computer` returned zero open items). However,
this exact class of bug — sluggish buttons and unnecessary re-renders — has a long, well-documented
history in this codebase and has been fixed **at least six times** between 2026-06-02 and
2026-06-27. All of those fixes are confirmed present in the current `HEAD`. This doc consolidates
that history, verifies current state, and flags two gaps worth closing.

## Confirmed root causes (historical, all fixed and verified still in place)

| Date | Root cause | Fix | Commit | Verified in HEAD? |
|---|---|---|---|---|
| 06-02 | Full component tree re-rendered on every tab switch | Router isolation + `System.tsx` memoization | `5126e09` | ✅ |
| 06-03 | `Block.tsx` subscribed to 2 unused stores × 16 instances (32 wasted subs); `Sync.tsx` per-message time-format subscription (12 instances) | Removed unused subs; lifted shared state to parent; extracted `NavButton` with `React.memo` | `0050853` | ✅ `Layout.tsx:20` (`NavButton = React.memo(...)`) |
| 06-03 | `Button.tsx` subscribed to `theme` and `isMirrorOn` for **every** kind, even `secondary` (the majority case) | Split into `PrimaryBtn` / `SecondaryRoundedBtn` sub-components; plain `secondary` kind now has **zero** store subscriptions | `4d48dfb` | ✅ `src/client/components/ui/Button.tsx:66-131` |
| 06-05 | Biofield check-in button's dismiss animation waited for the API round-trip before firing | Moved `setIsPromptShown(false)` into the click handler, ahead of the mutation (**Async Signal Recording** doctrine) | `48aa898` | ✅ (pattern reused again 07-01 in `EmotionalCheckIn`/`PatternInsightsWidget`, commit `95de8e1`) |
| 06-09 | `Layout.tsx` subscribed to the entire `me` object; any metadata write (badge sync, theme save) re-rendered all 10 nav buttons | Replaced with a derived `isLoggedIn` boolean store | `f07da921` | ✅ `Layout.tsx:53` (`useStore(stores.isLoggedIn)`) |
| **06-12/06-13** | **`grid-fill-hover` (used by every `Button`, `GhostButton`, and `Block`) animated `background-image` on hover — two linear-gradients recomputed from CSS custom properties on every hover, which the browser cannot GPU-composite, causing jittery repaints across 20+ interactive elements** | Rewrote as a pre-rendered `::before` pseudo-element; hover only toggles `opacity` (GPU-compositable, zero repaint) | landed via PR #66 merge `02de5f5` (authored as `2c0da2ff`, see note below) | ✅ `src/client/index.css:102-125` |
| 06-27 | Residual sub-pixel text shift on hover start; `TabPanel` re-rendered the entire active tab (`Logs`/`System`/`Sync`/`Settings`) on every route change | Added `will-change: opacity` to pre-promote the compositor layer; wrapped the four heavy tab components in `React.memo` | `1271cd3` | ✅ all four components confirmed `React.memo`-wrapped |
| 06-14 | N+1 query patterns across 5 endpoints/3 widgets adding latency that read as UI lag | Query batching + client-side dedup | `27a16352` | not re-verified this pass (out of scope: server-side) |

**Note on `2c0da2ff`:** this is the single most on-point fix — its commit message is literally
*"Fix button hover lag: replace background-image transition with GPU-composited opacity"* and
calls out that the old approach caused jitter "across all 20+ interactive elements." The commit
object exists in the local repo but isn't reachable from any branch or tag (`git branch --all
--contains 2c0da2ff` returns nothing) — it was almost certainly folded into the PR #66 squash/merge
under a different hash. The resulting CSS is present and correct in current `HEAD`, so the fix
did ship; only the manifest bookkeeping is stale (see Gap 1 below).

## Current state assessment

Walked the current `Button.tsx`, `Layout.tsx`, `index.css`, and the four memoized tab components —
every historical fix listed above is present and un-reverted. No new store-subscription regressions
were found in a scan of the 17 components currently subscribing to `stores.me`; the only broad,
frequently-firing store write (`stores.lastUpdate`, set on every SSE message) has exactly one
narrow subscriber (`ConnectionStatus.tsx`), so it isn't fanning out re-renders.

One adjacent (not button-specific) performance fix landed very recently: `cc33b8b` (2026-07-03)
added a missing index on `chat_messages(createdAt)` — the table had been doing a sequential scan
that could hit the 30s statement timeout under load and silently return `500`s. Worth watching in
case any user reports of "everything feels slow" are actually this, now resolved.

## Gaps identified (next steps)

1. **Stale manifest entry.** `docs/benchmark/LOT-MANIFEST.md` still lists `Button Perf |
   quantum-engine-widgets-RgFfC | 2c0da2ff | READY` (i.e., "tested, not yet shipped"). It has, in
   fact, shipped (see above). Low priority, but worth a one-line correction so the manifest doesn't
   mislead the next session into re-doing this work.

2. **No telemetry pipeline for interaction lag.** `src/client/utils/perf.ts` already installs a
   `PerformanceObserver` for both slow `event` interactions (>200ms) and long animation frames
   (>50ms), and exposes `window.__LOT_PERF__.getEntries()` — but it only `console.warn`s. Nothing
   sends these events to the server. If a button-lag regression reappears in production, the only
   way to catch it today is a user with devtools open. Recommend wiring `initPerfObserver`'s
   threshold breaches to a lightweight beacon (`navigator.sendBeacon`) into the existing `/api/sync`
   or a new `/api/perf` endpoint, batched, so real user lag becomes visible in logs rather than
   silently discarded. This is the most actionable gap for actually *catching* a future recurrence
   instead of relying on someone reporting it.

3. **Not verified this pass:** whether the `27a16352` query-batching fix (06-14) still covers all
   originally-affected endpoints, and whether any widget added since 06-27 (e.g. `RecipeWidget`,
   `MemoryWidget`, `CohortConnectWidget` — all touched in the last week) introduces a new broad
   store subscription. A follow-up pass should specifically diff those newest widgets against the
   RENDER-ISOLATION doctrine (`docs/benchmark/LOT-DOCTRINE.md`).

## Conclusion

No currently-active button-lag bug was found in code or in open issues/PRs — the historical fixes
are all intact. The doctrine this team built (`RENDER-ISOLATION`, `Async Signal Recording`,
`CSS-Only Progression`) has meaningfully reduced recurrence over the past month. The main risk
going forward isn't a known bug, it's the absence of telemetry (Gap 2) — the team's ability to
detect a *new* regression currently depends on someone noticing and reporting it manually.
