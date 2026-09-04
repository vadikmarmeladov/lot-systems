# LOT Self-Assembly Session Report
## 2026-09-04 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-fvgcww`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Prior session:** `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md` (v1, merged `b75f65b`/`73edd95`)

---

## MISSION BRIEF

Standing recurring instruction, unchanged since v1: continue evolving the
Astrology block (today's zodiac hour, moon phase, rokuyo — ambient
conditions, not a personal natal chart) for user personalization and
synchronization with other widgets, keep it synchronized with Logs entries,
and push a full understanding + features breakdown document each session.

---

## PHASE 0 — ORIENTATION (what changed since v1, what's still open)

Re-read the feature as v1 left it and confirmed all four claims in that
report's PHASE 3 still hold on current `master`-merged state:
15-minute recompute tick (off-tab gated), moon illumination surfaced, the
`astrology` Tier 0 QIE signal source registered with `recordAstrologySignal`
emitting one `ambient_reading`/day, and Logs' `getLogContext` snapshotting
`astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/
`astroWesternZodiac` per entry. No regressions found.

v1's PENDING/FUTURE WORK listed three items. This session closes two of the
three in full and advances the third's groundwork:

1. **QIE pattern reacting to `astrology` + intentions/goals** — open, closed
   this session (see PHASE 1.1).
2. **Client dashboard should read `user.timeZone`, not device-local time** —
   open, closed this session (see PHASE 1.2). Root cause confirmed by
   reading the stack: `UserProfile` (the type behind the client's `stores.me`
   atom, populated by `GET /api/me`) never carried `timeZone` — the field
   exists on the server `User` model and is used server-side (Logs,
   settings), but `User.useProfileView()`'s `fp.pick(...)` list omitted it,
   so it never reached the browser at all. Not a display bug — a missing
   field.
3. **`getJapaneseZodiac` / `getMoonEmoji` unused** — `getMoonEmoji` is now
   wired (see PHASE 1.3); `getJapaneseZodiac` (birth-year animal) remains
   unused by design — it needs a personalization opt-in with actual birth
   data, which still does not exist anywhere in the `User` model. Left
   pending; ambient-only doctrine holds.

---

## PHASE 1 — BUILD

### 1.1 QIE Pattern 152 — `auspicious-alignment` (widget synchronization)

`src/client/stores/intentionEngine.ts`: added Pattern 152, the first pattern
to read the `astrology` signal source as a detection *input* rather than
only a dependency-graph node. Fires when a Taian-day (`auspicious: true`)
`ambient_reading` signal and at least one `intentions` or `goals` signal
both land within the same calendar day. Confidence intentionally capped low
(`0.58` base, `+0.05` per direction signal, hard cap `0.75`) — this is
framed as a gentle passive observation, never a directive, consistent with
the standing "ambient conditions, not a natal chart" instruction: the
astrology reading should never be positioned as prescriptive.

`suggestedWidget: 'cosmic'` — the `cosmic` widget already lists `astrology`
and `intentions` as dependencies in `WIDGET_DEPENDENCY_MAP` (from v1), so the
new pattern's suggestion target matches an existing consumer rather than
inventing a new one.

`src/client/components/QuantumEngineWidgets.tsx`: added
`'auspicious-alignment': 'AUSPALIGN'` to `PATTERN_DISPLAY` so the pattern
renders with a label consistent with all 151 prior patterns.

Deliberately **not** done: minting a new archetype or scheduled server job
for this pattern. `LOT-LEXICON.md`'s minting rule requires a concept to
recur across 3+ prior reports before earning a token — `auspicious-alignment`
appears in exactly one report (this one) — so no lexicon token was minted
this session either; recorded here in prose, to be minted if and when it
recurs. Adding an Arch/Job pairing for a single-occurrence pattern would be
decreeing vocabulary, not earning it.

### 1.2 TimeZone-aware client display (personalization)

Closes v1's second pending item. Chain of changes, one field threaded
through three layers:

- `src/shared/types/index.ts` — added `timeZone?: string | null` to
  `UserProfile` (the wire type for `GET /api/me`).
- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick([...])`
  list inside `User.useProfileView()`. This is the only place that needed to
  change server-side; the field was already on the `User` model and already
  populated (server derives it from `city`+`country` via
  `weather.getTimeZone` on settings save).
- `src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js` plugin
  (alongside the already-loaded `utc` plugin it depends on), enabling
  `dayjs().tz(ianaName)`.
- `src/client/components/System.tsx` — the `astrology` `useMemo` now reads
  `me?.timeZone` (from the existing `stores.me` atom, already subscribed at
  the top of the component) and, when present, computes a wall-clock `Date`
  in that timeZone via the same reconstruction trick already used
  server-side in `src/server/utils/logs.ts`'s `toWallClockDate` — take the
  zoned year/month/date/hour/minute/second and build a plain local `Date`
  from those components, so `getHourlyZodiac`/`getWesternZodiac`/
  `getMoonPhase`/`getRokuyo` (all of which read local getters like
  `.getHours()`) operate on the user's civil time instead of the device's.
  Falls back to `new Date()` (device-local) when `timeZone` is null/absent
  or the IANA string is unrecognized (wrapped in try/catch).

Net effect: a user whose profile timeZone is `America/New_York` but who
opens the dashboard on a device set to `Asia/Tokyo` now sees their own
zodiac hour and day boundary, not the device's — closing the gap v1 flagged
between the (already timeZone-aware) Logs snapshot and the (previously
device-only) live dashboard display.

### 1.3 Moon emoji surfaced (personalization, small)

`getMoonEmoji` (in `src/shared/utils/astrology.ts`) existed since before v1
but was never called. Both render sites in `System.tsx` (compact layout +
cycling "pro" block) now show it inline: `{moonEmoji} {moonPhase}
({moonIllumination}%)`. Purely additive to the visual density already
established by v1's illumination-percentage fix — no layout restructuring.

---

## PHASE 2 — TEST

Dependencies were not pre-installed in this session's container; ran
`npm install --legacy-peer-deps` to restore `node_modules` (pre-existing
`@nanostores/react`/`nanostores` peer conflict, unrelated to this session).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (esbuild + postcss)
```

Also ran `npx tsc --noEmit -p tsconfig.json` (the root, stricter config —
not one of the repo's defined build gates, but useful as an extra check) as
a diff against the pre-session tree via `git stash`: the root config
reports several hundred pre-existing errors across unrelated files
(`AdminUser.tsx`, `router.ts`, `badges.ts`, etc.) both before and after this
session's changes, confirming this session introduced zero new type errors.
The one `System.tsx` hit in that stricter pass (`weather.humidity possibly
null`, line 639) is pre-existing — same error, same file, at line 624 before
this session's line insertions shifted it down.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** ambient reading is now timeZone-aware in both
  places a server-side or client-side user context exists — Logs (since v1)
  and the live dashboard display (new this session). Falls back gracefully
  to device-local time when no profile timeZone is on file.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (v1), now also re-derives immediately if the resolved `timeZone` changes
  (e.g. profile settings updated mid-session).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (v1); now also feeds pattern detection directly — Pattern 152
  (`auspicious-alignment`) correlates the daily ambient reading with
  declared intentions/goals and surfaces on the `cosmic` widget as a passive
  observation. 152 total patterns in the QIE registry.
- **Logs synchronization:** unchanged from v1 — every new log entry's
  `context` JSONB snapshot includes the ambient astrology reading at
  creation time, timeZone-aware, rendered in the journal's `SYS:` block.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. `getJapaneseZodiac`
  (birth-year animal) remains unused, blocked on the same absence of birth
  data noted in v1.

---

## PENDING / FUTURE WORK

- `getJapaneseZodiac` (year-based animal) still unused — would need a
  birth-year opt-in field on `User`, which does not exist. Out of scope
  while ambient-only.
- Pattern 152 (`auspicious-alignment`) is a single-occurrence concept per
  `LOT-LEXICON.md`'s minting rule — revisit lexicon/doctrine once it
  recurs in 2 more reports.
- Consider whether `recordAstrologySignal`'s once-per-calendar-day guard
  (keyed on device-local date via `dayjs().format('YYYY-MM-DD')` in
  `System.tsx`) should also move to the user's profile timeZone for
  consistency with the display fix in this session — currently the display
  is timeZone-aware but the once-per-day QIE recording guard is not. Left
  as-is this session to keep the change small and reviewable; flagging for
  the next pass.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
