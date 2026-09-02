# LOT Self-Assembly Session Report
## 2026-09-02 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-pum4zh`
**Base commit:** `98971f2`
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

This is the second dated session against this feature. The first
(`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`, merged
via `b75f65b` / `73edd95`) fixed a staleness bug, surfaced moon illumination,
wired the block into the QIE signal bus, and synchronized the ambient reading
onto every new Logs entry. This session starts from that report's own
**PENDING / FUTURE WORK** list rather than re-deriving the feature from
scratch.

---

## PHASE 0 — ORIENTATION / RE-VERIFICATION

Re-read the prior session's report and confirmed against current `HEAD`
(`98971f2`) that everything it claimed is actually live:

| Prior claim | Verified in current code |
|---|---|
| 15-min recompute tick, paused off-tab | `System.tsx` — `astrologyTick` + `setInterval` gated on `!document.hidden` — present |
| Moon illumination surfaced | Both render sites show `{moonPhase} ({moonIllumination}%)` — present |
| `astrology` registered as Tier 0 QIE signal source, `system`/`cosmic` depend on it | `intentionEngine.ts` — `WIDGET_DEPENDENCY_MAP` — present |
| `recordAstrologySignal(...)` fires once/day via localStorage date-stamp | `System.tsx` `useEffect` — present |
| Logs `context` carries `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/`astroWesternZodiac` | `src/server/utils/logs.ts` `getLogContext` + `shared/types/index.ts` `LogContext` — present |
| Logs journal `SYS:` block prints `ASTRO: {rokuyo} · {moonPhase}` | `Logs.tsx` — present |

No regressions found. Picked up the first unaddressed item from the prior
report's pending list:

> Consider whether the client-side dashboard display should also read from
> `user.timeZone` (via a profile query) instead of device-local time, for
> users viewing the dashboard from a device set to a different timeZone than
> their saved profile — currently only the server-side Logs snapshot is
> timeZone-aware.

Traced why this was a real gap, not just a nice-to-have: `getLogContext`
(server) already resolves the ambient reading from `user.timeZone` via a
`toWallClockDate` helper. But the client dashboard's `astrology` `useMemo` in
`System.tsx` called `getHourlyZodiac`/`getWesternZodiac`/etc. with a bare
`new Date()` — device-clock time, unconditionally. Net effect: a user whose
saved profile timeZone differs from the device they're currently looking at
(a laptop left on the wrong system clock, a shared/kiosk device, a trip
across time zones with the OS timeZone not updated) would see a dashboard
astrology reading that **disagreed with their own Logs entries** for the
same moment — exactly the kind of cross-widget desync the standing
instruction is watching for.

Also confirmed the client bundle had no way to even attempt this: `me`
(`stores.me`, the `UserProfile` returned by the profile endpoint) had no
`timeZone` field at all — `useProfileView()` (`src/server/models/user.ts`)
picks a fixed field list from the `User` model that stopped at `phone`,
skipping the `timeZone` column that already exists on `User`. And
`src/client/utils/dayjs.ts` never loaded `dayjs/plugin/timezone.js`, so
`.tz()` wasn't available client-side even if the value had been present.

---

## PHASE 1 — BUILD

### 1. Exposed `timeZone` on the client user profile

- `src/shared/types/index.ts` — added `timeZone: string | null` to
  `UserProfile` (previously only on the server-only `User` type).
- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick([...])`
  field list inside `useProfileView()`. No new query, no migration — the
  column already existed and was simply excluded from the client-facing
  view.

### 2. Made the client dayjs instance timeZone-aware

- `src/client/utils/dayjs.ts` — added and extended
  `dayjs/plugin/timezone.js` alongside the existing `utc` plugin, so
  `dayjs().tz(x)` is available anywhere the shared client `dayjs` import is
  used (it already carries `utc`, `relativeTime`, `weekOfYear`, `isoWeek`,
  `advancedFormat`, `dayOfYear`).

### 3. Astrology `useMemo` now reads the profile timeZone, with the same wall-clock trick as the server

`System.tsx`: `date.getHours()`/`getMonth()`/`getDate()` (what every function
in `astrology.ts` reads) always resolve through the **browser's own** local
timeZone, regardless of what timeZone a `dayjs` moment was built with —
`dayjs().tz(x).toDate()` collapses back to an absolute instant and loses the
shift. This is exactly why the server-side `getLogContext` doesn't call
`.toDate()` directly either; it goes through a `toWallClockDate` helper that
reads the moment's tz-shifted wall-clock fields (`year()`, `month()`,
`date()`, `hour()`, `minute()`, `second()`) and re-assembles them into a
`Date` via the local constructor, whose getters then report those values
regardless of the runtime's actual timeZone.

Mirrored that trick client-side:

```ts
const localMoment = me?.timeZone ? dayjs().tz(me.timeZone) : dayjs()
const now = new Date(
  localMoment.year(), localMoment.month(), localMoment.date(),
  localMoment.hour(), localMoment.minute(), localMoment.second()
)
```

Falls back to device-local time (previous behavior, unchanged) when the
viewer is logged out or hasn't set a profile timeZone yet — this is
additive personalization, not a behavior change for users without a saved
timeZone. Added `me?.timeZone` to the `useMemo`'s dependency array so a
timeZone change (e.g. updating it in settings) re-derives the reading
without waiting for the next 15-minute tick.

### 4. Surfaced the already-computed moon emoji

`getMoonEmoji(phaseName)` existed in `astrology.ts` since before the prior
session but was never called from anywhere — flagged in the prior report's
pending list as "candidates for a future personalization pass." This is a
pure display touch (no new signal, no new data), so folded it in now rather
than deferring further:

- `System.tsx` — both render sites (compact layout `Block label="Astrology:"`
  and the cycling "pro" layout block) now show
  `{moonEmoji} {moonPhase} ({moonIllumination}%)` instead of the bare phase
  name.
- `Logs.tsx` — the `ASTRO:` journal line now matches: `ASTRO: {rokuyo} ·
  {moonEmoji} {moonPhase}`, importing the same shared `getMoonEmoji` used by
  the dashboard, so the visual language for a moon phase reads identically
  whether it's live on the dashboard or archived in a journal entry — the
  "synchronize with Logs entries" requirement extended from data-parity to
  presentation-parity.

`getJapaneseZodiac` (year-based birth-year animal) remains unused and
out of scope this session — it implies asking the user for a birth year,
which edges toward the natal-chart personalization the standing instruction
explicitly excludes ("ambient conditions, not a personal natal chart").
Left as a candidate for an explicit opt-in feature, not folded into this
routine.

---

## PHASE 2 — TEST

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle)
```

Client build emits two pre-existing warnings (`duplicate-object-key` in
`src/client/utils/badges.ts`, `quarter_drop` and `elixir_found`) — present
before this session's changes, unrelated to the astrology feature, left
untouched per this routine's scope.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** the ambient reading is now timeZone-aware on
  **both** surfaces it appears on — the server-side Logs snapshot (since the
  prior session) and, as of this session, the client dashboard display —
  both resolving from the same `user.timeZone` profile field via the same
  wall-clock-passthrough technique. A user viewing the dashboard from a
  device whose system clock is in a different zone than their saved profile
  now sees the same reading their journal entries record; a logged-out
  viewer or one without a saved timeZone still gets device-local time,
  unchanged from before.
- **Freshness:** recomputes every 15 minutes while the tab is visible, and
  immediately on a profile timeZone change, instead of only once per mount.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), consumed (per the dependency graph) by `system` and
  `cosmic`; emits one `ambient_reading` signal per calendar day, including an
  `auspicious` (Taian-day) flag other patterns can key off of in a future
  session.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  carries the ambient astrology reading at creation time; the journal's
  `SYS:` block renders it with the same moon emoji used on the live
  dashboard, so the presentation — not just the underlying data — matches
  across both surfaces.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. `getJapaneseZodiac`
  (birth-year animal) stays unused for the same reason.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-pum4zh
Files changed: 6
  src/client/components/System.tsx          MODIFIED
  src/client/components/Logs.tsx            MODIFIED
  src/client/utils/dayjs.ts                 MODIFIED
  src/server/models/user.ts                 MODIFIED
  src/shared/types/index.ts                 MODIFIED
  docs/assembly/2026-09-02_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern that reacts to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on
  auspicious/Taian days) — needs the full self-assembly treatment (pattern
  number, archetype/job wiring if warranted, wiki + doctrine + lexicon +
  Field Manual sync). Still intentionally deferred to a dedicated benchmark
  session rather than folded into this lighter recurring routine — carried
  over unaddressed from the prior session's pending list for a second time,
  noting it here so it isn't lost.
- Consider a settings-page opt-in for a birth-year Japanese zodiac animal
  (`getJapaneseZodiac`, currently unused), clearly separated in the UI from
  the ambient reading so it doesn't blur into natal-chart territory.
- The `auspicious` (Taian-day) flag is recorded in the QIE signal metadata
  but nothing currently reads it back out for display or theming — a small
  follow-up (e.g. a subtle dashboard indicator on Taian days) would use
  data that already exists end-to-end without minting a new pattern.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
