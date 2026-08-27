# LOT Self-Assembly Session Report
## 2026-08-27 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-bfj4fz`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection
**Prior session:** `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md` (v1, merged via PR #92 / `b75f65b`)

---

## MISSION BRIEF

Standing recurring instruction (unchanged since v1): continue evolving the
Astrology block (today's zodiac hour, moon phase, rokuyo — ambient
conditions, not a personal natal chart) for user personalization and
synchronization with other widgets, keep it synchronized with Logs entries,
and push a full understanding + features breakdown document each session.

---

## PHASE 0 — ORIENTATION / WHAT v1 ALREADY SHIPPED

Confirmed all of v1's work is live on `master` (merged via PR #92,
`b75f65b`, later touched only by an unrelated merge conflict resolution in
`73edd95`). Re-verified the full feature map before starting:

| Piece | Location | State entering this session |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | Unchanged since v1 |
| Compute site | `System.tsx` `astrology` `useMemo` | Re-derives every 15 min while tab visible (v1 fix), but still reads `new Date()` — device-local time only |
| QIE signal bus | `intentionEngine.ts` | `astrology` registered as Tier 0 source, feeds `system`/`cosmic`; `recordAstrologySignal` emits one `ambient_reading`/day with an `auspicious` (Taian) flag — **still unread by anything** |
| Logs | `logs.ts` → `LogContext` | Every log snapshots `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/`astroWesternZodiac`, computed from the **user's saved `timeZone`** server-side |
| Logs render | `Logs.tsx` `SYS:` block | Only printed `{rokuyo} · {moonPhase}` — illumination % and hourly zodiac were already in `log.context` but silently dropped from the UI, same class of bug v1 fixed for the dashboard |

v1's own **PENDING / FUTURE WORK** section named three items. This session
picked up the two that were concretely scoped and left the third as-is:

1. ~~Client-side dashboard should read from `user.timeZone` instead of
   device-local time~~ → **done this session** (below).
2. ~~Logs render only shows `rokuyo`/`moonPhase`, dropping illumination and
   hourly zodiac that are already captured~~ → **done this session** (not
   explicitly named in v1's pending list, but the same "computed but
   discarded" bug class v1 flagged for the dashboard; found while auditing
   the Logs sync path this session).
3. A dedicated QIE pattern (`PXXX auspicious-day-alignment`) reacting to
   `astrology` + `goals`/`intentions` together — **still deferred**. Minting
   a new pattern number means a wiki/doctrine/lexicon/Field Manual version
   bump, which is its own dedicated self-assembly/benchmark pass, not a fold-in
   for this routine. Confirmed the `auspicious` flag recorded by
   `recordAstrologySignal` is still read by nothing — the prerequisite signal
   is flowing, no consumer exists yet.
4. `getJapaneseZodiac` (birth-year animal) / `getMoonEmoji` remain unused.
   Left alone deliberately: a birth-year zodiac is adjacent to natal-chart
   personalization, which the standing instruction explicitly excludes
   ("ambient conditions, not a personal natal chart"). Not attempted.

---

## PHASE 1 — BUILD

### 1. Personalized the client dashboard to the user's saved timeZone

`src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js` plugin
(alongside the existing `utc` plugin already loaded there), matching the
plugin set already used server-side in `src/server/utils/dayjs.ts`. This is
additive only — no existing `dayjs()` call site changes behavior.

`src/client/components/System.tsx` — the `astrology` `useMemo` now builds its
`now` reference the same way `logs.ts` already does server-side: if the
logged-in user (`me`, from `stores.me`) has a saved `timeZone`, take
`dayjs().tz(me.timeZone)` and flatten it to a wall-clock `Date` (same
`toWallClockDate` trick as `logs.ts`, inlined since it's a two-line
transform); otherwise fall back to device-local time exactly as before.
Added `me?.timeZone` to the memo's dependency array so a settings change
(which triggers a server-side timeZone re-derivation from city/country,
already existing logic in `api.ts`) is picked up without a reload once `me`
refreshes.

Net effect: a user who set their city/country in Settings — which already
silently derives and saves `user.timeZone` server-side via
`weather.getTimeZone(lat, lon)` — now sees an astrology reading anchored to
that saved location instead of whatever timeZone their current device
happens to be set to. This closes the gap v1 flagged: Logs were already
timeZone-aware, the live dashboard wasn't. No new personal data was
collected; this reuses a field the app was already deriving and storing.

### 2. `UserProfile` now carries `timeZone` to the client

The client only had `me.city`/`me.country`, not `me.timeZone` — the field
existed on the server `User` model but was excluded from
`useProfileView()`'s field-picker, so `/api/me` never returned it.

- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick([...])`
  list inside `useProfileView()`.
- `src/shared/types/index.ts` — added `timeZone?: string | null` to the
  `UserProfile` type (the `User` type already had it).

No new endpoint, no schema/migration change — same JSONB-free column
already used server-side, now surfaced through an existing response.

### 3. Surfaced moon illumination + hourly zodiac in the Logs journal view

`src/client/components/Logs.tsx` — the `system_snapshot` (`SYS:`) block's
`ASTRO:` line previously printed only `{rokuyo} · {moonPhase}`, even though
`log.context.astroMoonIllumination` and `log.context.astroHourlyZodiac` were
already being written by every log since v1. Extended the line to:

```
ASTRO: {hourlyZodiac} · {rokuyo} · {moonPhase} ({illumination}%)
```

guarded the same way the existing fields are (`&&`/`typeof … === 'number'`
checks), so older log rows written before v1 (which have no `astro*` fields
at all) render exactly as before — no backfill, no migration.

### 4. Synchronization with Logs — verified, not re-built

v1's Logs synchronization (`getLogContext` in `logs.ts` snapshotting the
ambient reading onto every new log) was audited and confirmed still correct
and untouched by any commit since. This session's Logs change (item 3 above)
is purely a render-layer completion of data that sync already produces.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (same as v1's environment note);
restored with `npm install --legacy-peer-deps` (pre-existing
`@nanostores/react`/`nanostores` peer conflict, unrelated to this session).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle;
                                 pre-existing duplicate-key warnings in
                                 badges.ts, unrelated to this session)
npm run build          -> PASS (both, end to end)
```

Additionally ran `npx tsc --noEmit -p tsconfig.json` (full client
type-check; not part of the normal build pipeline, which uses esbuild
without type-checking) before and after this session's diff to confirm zero
new type errors were introduced: **128 diagnostic lines before, 128 after**,
identical set. The pre-existing errors (badges.ts `BadgeType` mismatches,
`router.ts` generic constraint issues, several `UserProfile`/`Log` nullability
gaps, etc.) all predate this session and are out of scope.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — pure date-math, no external API, no
  personal birth data.
- **Personalization anchor:** ambient reading is now timeZone-aware in
  **both** places a reading is produced — the server-side Logs snapshot
  (since v1) and the live client dashboard (new this session) — both keyed
  off the same `user.timeZone` column, itself silently derived from the
  user's saved city/country in Settings. A user with no saved
  city/country still sees device-local time, unchanged.
- **Freshness:** dashboard recomputes every 15 minutes while the tab is
  visible (v1), now also re-keyed on `me.timeZone` so a location change
  updates the reading without a full reload.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), consumed by `system` and `cosmic`; emits one
  `ambient_reading` signal per calendar day, including an `auspicious`
  (Taian-day) flag. This flag has no consumer yet — flowing but unread,
  same status as v1 left it.
- **Logs synchronization:** every log's `context` JSONB snapshot carries the
  ambient reading at creation time (v1); the journal's `SYS:` block now
  renders all five captured fields (hourly zodiac, rokuyo, moon phase,
  illumination %) instead of two, closing a silent-drop gap of the same
  class v1 fixed for the dashboard.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign); a birth-year
  Chinese zodiac opt-in was considered again this session and set aside for
  the same reason as v1 — it sits adjacent to natal personalization even
  though no birth *time*/*place* would be needed, and the standing
  instruction's framing is strictly ambient/environmental.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-bfj4fz
Files changed: 5
  src/client/components/System.tsx        MODIFIED
  src/client/components/Logs.tsx          MODIFIED
  src/client/utils/dayjs.ts               MODIFIED
  src/server/models/user.ts               MODIFIED
  src/shared/types/index.ts               MODIFIED
  docs/assembly/2026-08-27_LOT-assembly_astrology-widget-personalization-sync-v2.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author the deferred QIE pattern reacting to `astrology`'s `auspicious`
  flag together with `goals`/`intentions` (e.g. a gentle nudge surfaced on
  Taian days) — still needs the full self-assembly treatment (pattern
  number, archetype/job wiring if warranted, wiki + doctrine + lexicon +
  Field Manual sync). Two sessions in a row have now confirmed the signal is
  live and simply unconsumed; this is ready to pick up whenever a dedicated
  benchmark session runs.
- `getJapaneseZodiac` / `getMoonEmoji` remain unused. Still out of scope
  while the feature stays strictly ambient (no birth data collected).
- Consider whether Settings should let a user *see* their derived
  `timeZone` (it is currently invisible — silently computed from
  city/country, never displayed anywhere in the UI) now that it also drives
  a visible personalization (the dashboard reading). Not attempted this
  session — a UI/copy decision, not a bug.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
