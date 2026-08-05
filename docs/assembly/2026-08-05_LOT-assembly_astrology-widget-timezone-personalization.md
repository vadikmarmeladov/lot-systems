# LOT Self-Assembly Session Report
## 2026-08-05 | Astrology Widget — TimeZone Personalization + Visible Sync | v2

**Branch:** `claude/practical-curie-8v4pz3`
**Base commit:** `8f6205e`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection

---

## MISSION BRIEF

Standing recurring instruction: continue evolving the Astrology block (today's
zodiac hour, moon phase, rokuyo — ambient conditions, not a personal natal
chart) for user personalization and synchronization with other widgets, keep
it synchronized with Logs entries, and push a full understanding + features
breakdown document each session.

This is the second session against this standing instruction. The first
(`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`, merged
via PR #92, commit `b75f65b`) fixed a staleness bug, surfaced the previously
discarded moon-illumination %, wired `astrology` into the QIE signal bus as a
Tier 0 source, and synchronized every new Logs entry with the ambient reading
at creation time (user-timeZone-aware, server side). It left three items
explicitly pending. This session picks up the first of them.

---

## PHASE 0 — ORIENTATION / RE-VERIFICATION

Confirmed the prior session's work is live on `master` (commit `b75f65b`,
merged via PR #92) and unchanged since: `astrologyTick` recompute cadence,
moon illumination display, `WIDGET_DEPENDENCY_MAP['astrology']` entry,
`recordAstrologySignal`, and the Logs `astroRokuyo`/`astroMoonPhase`/etc.
context fields are all present exactly as documented. Re-read that session's
"PENDING / FUTURE WORK" section as this session's starting brief:

1. Author a dedicated QIE pattern reacting to the `astrology` signal +
   `goals`/`intentions` (auspicious-day nudge) — flagged as needing the full
   self-assembly treatment (pattern number, archetype/job wiring, wiki +
   doctrine + lexicon + Field Manual sync), deliberately out of scope for a
   routine session.
2. Whether the **client-side dashboard display** should read from
   `user.timeZone` instead of device-local time, matching what the
   server-side Logs snapshot already does.
3. `getJapaneseZodiac`/`getMoonEmoji` remain unused — candidates for a future
   personalization pass.

Dispatched a research pass (read-only, no edits) to answer, with file:line
precision, whether item 2 was actually feasible and what item 1's "widget
synchronization" claim rested on. Findings:

- **TimeZone was not reachable from the client at all.** `System.tsx` already
  has the logged-in user in scope (`me = useStore(stores.me)`,
  `src/client/stores/state.ts:14`, populated from `GET /api/me`), but the
  `UserProfile` type/`useProfileView()` pick-list
  (`src/server/models/user.ts:46-58`) never included `timeZone` — it exists
  only on the server-internal `User` type and inside `LogContext`. Item 2 was
  blocked on a small server change, not just a client one.
- **The `WIDGET_DEPENDENCY_MAP['astrology']` entries added last session are
  still purely declarative.** `getWidgetsDependingOn()` is defined
  (`intentionEngine.ts:3811`) but has zero call sites anywhere in the client;
  no widget (including `cosmic`/`CosmicUpdateWidget.tsx`, which has no
  astrology/rokuyo/moonPhase reference at all) actually subscribes to and
  re-renders from an upstream signal today. The established pattern across
  ~80+ `record*Signal` wrappers is producer-only (widgets write signals for
  later aggregate scoring via `getUserIndex`/`getUserState`); reactive
  cross-widget subscription isn't a pattern that exists anywhere yet to
  extend. Inventing one from scratch for a single signal, in a routine
  session, would be new architecture, not evolution of what's there —
  correctly out of scope, same call as last session's PENDING item 1.

This reframed the session's real, achievable scope: finish item 2 properly
(it needed one more small piece than previously realized), put the unused
`getMoonEmoji` to use (item 3, partially), and — since last session made the
`auspicious` (Taian-day) flag exist inside a signal's metadata but genuinely
invisible anywhere a person could see it — surface that flag directly on the
block itself. That's real "personalization + visible synchronization" work
without minting new cross-widget architecture that isn't there yet.

---

## PHASE 1 — BUILD

### 1. Client dashboard now honors the user's saved timeZone

`src/server/models/user.ts` — added `'timeZone'` to `useProfileView()`'s
`fp.pick([...])` list (was previously omitted, unlike `city`/`country`, which
already round-trip to the client for the Settings page).

`src/shared/types/index.ts` — added `timeZone?: string | null` to
`UserProfile`.

`src/shared/utils/astrology.ts` — added `toTimeZoneWallClock(date, timeZone)`,
an isomorphic helper using native `Intl.DateTimeFormat` (no new dependency,
works identically in the browser and in Node) that mirrors the wall-clock
trick `src/server/utils/logs.ts` already uses via `dayjs().tz()`: extract the
target timeZone's wall-clock year/month/day/hour/minute/second, then
construct a `Date` from those components via the local constructor, so every
existing `get*()`-based astrology function reads the target timeZone's clock
regardless of the runtime's own. Falls back to the input `Date` unchanged if
the timeZone string is invalid, rather than throwing and breaking the whole
dashboard render.

`src/client/components/System.tsx` — the `astrology` `useMemo` now computes
`toTimeZoneWallClock(new Date(), me.timeZone)` when the profile has a saved
timeZone, falling back to device-local `new Date()` otherwise (e.g. logged
out, or timeZone not yet resolved from city/country). Added `me?.timeZone` to
the memo's dependency array.

Net effect: a user's zodiac hour, rokuyo, and moon reading now reflect their
saved home timeZone rather than whatever clock the viewing device happens to
have — the actual "personalization" the standing instruction asks for,
matching what Logs already did server-side, closing the gap between the two.

### 2. Surfaced the previously-unused moon emoji

`getMoonEmoji()` (`astrology.ts`) has existed since before the previous
session but was never called. Both dashboard render sites in `System.tsx`
(compact layout and the cycling "pro" block) now show it inline next to the
phase name. `Logs.tsx`'s `SYS:` snapshot block does the same for the
persisted `astroMoonPhase` on each log entry.

### 3. Made the "auspicious" flag actually visible

Last session added `auspicious: rokuyo === 'Taian'` to the metadata of the
daily `recordAstrologySignal` QIE write — real signal, zero UI surface. Both
`System.tsx` render sites and the `Logs.tsx` `SYS:` block now append a small
`✦` marker after the rokuyo name specifically on Taian days. This isn't new
architecture (no subscription, no cross-widget wiring) — it's the same
computed `rokuyo === 'Taian'` boolean the signal-recording code already
derives, rendered where a person can actually see it, in the same block and
the same Logs entry the ambient reading already lives in.

---

## PHASE 2 — TEST

Dependencies were not pre-installed in this session's container
(`node_modules` absent); ran `npm install --legacy-peer-deps` to restore them
(pre-existing peer-version conflict unrelated to this session, same
workaround the prior session documented).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle)
npm run build          -> PASS (both, end to end)
npx tsc --noEmit -p tsconfig.json -> pre-existing unrelated errors only
                                     (badges.ts, app.tsx, router.ts, etc.);
                                     zero errors in any file this session
                                     touched (System.tsx, Logs.tsx,
                                     astrology.ts, user.ts, types/index.ts)
```

Confirmed the one `System.tsx` error surfaced by the standalone `tsc --noEmit`
pass (`weather.humidity` possibly null, line 629) pre-dates this session by
diffing against the pre-session `HEAD` copy of the file — unrelated to the
astrology block, not introduced here.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — pure date-math, no external
  API, no personal birth data.
- **Personalization anchor:** the ambient reading is now timeZone-aware
  *everywhere* a saved timeZone exists — both the server-side Logs snapshot
  (since last session) and, new this session, the client dashboard display
  itself (falls back to device-local time only when no saved timeZone is
  available yet).
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from last session).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), declared as a dependency of `system` and `cosmic` in
  `WIDGET_DEPENDENCY_MAP` (unchanged from last session — confirmed still
  bookkeeping-only; no widget in this codebase reactively subscribes to a QIE
  signal today, astrology included). Emits one `ambient_reading` signal per
  calendar day with an `auspicious` (Taian) flag.
- **Visible synchronization:** the `auspicious` flag and the moon emoji —
  both previously computed-but-invisible or unused — now render directly in
  the dashboard block and in every Logs entry's `SYS:` snapshot, alongside
  weather/location, exactly where the ambient reading already lives.
- **Logs synchronization:** unchanged from last session — every new log
  entry's `context` JSONB snapshot includes the ambient astrology reading at
  creation time; this session only changed how that same data renders (emoji
  + auspicious marker), not what's captured.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-8v4pz3
Files changed: 6
  src/server/models/user.ts        MODIFIED
  src/shared/types/index.ts        MODIFIED
  src/shared/utils/astrology.ts    MODIFIED
  src/client/components/System.tsx MODIFIED
  src/client/components/Logs.tsx   MODIFIED
  docs/assembly/2026-08-05_LOT-assembly_astrology-widget-timezone-personalization.md  ADDED
```

---

## PENDING / FUTURE WORK

- Authoring a dedicated QIE pattern reacting to `astrology` +
  `goals`/`intentions` remains the right call to defer to a dedicated
  self-assembly/benchmark pass (pattern number, archetype/job wiring, wiki +
  doctrine + lexicon + Field Manual sync) — restated from last session,
  still true.
- More fundamentally: `getWidgetsDependingOn()` and the reactive half of
  `WIDGET_DEPENDENCY_MAP` are unused across the *entire* codebase, not just
  for astrology. Before minting an astrology-specific consumer, a future
  session should decide whether to establish the first real
  subscribe-and-re-render consumer pattern generally (which astrology could
  then be the first user of) rather than building a one-off just for this
  signal.
- `getJapaneseZodiac` (year-based animal) remains unused. Using it for the
  *current* year (not a birth year) would stay within the ambient-only
  constraint and could be added as a further display field in a future
  session; using it for a birth-year animal would require collecting birth
  data, which is explicitly out of scope.
- Consider whether `me.timeZone` should also gate the *Logs list itself* on
  the client (e.g. relative "today" grouping) now that the client has access
  to it for the first time this session — currently only the astrology block
  consumes it.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
