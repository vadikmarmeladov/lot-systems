# LOT Self-Assembly Session Report
## 2026-08-02 | Astrology Widget — TimeZone Personalization + Logs Completeness | v2

**Branch:** `claude/practical-curie-bpmbyy`
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

This is the second dedicated session against this instruction. The first
(2026-07-27, `b75f65b`, PR #92, documented in
`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`) fixed a
staleness bug, surfaced the previously-discarded moon illumination
percentage, wired `astrology` into the QIE signal bus as a Tier 0 source
consumed by `system`/`cosmic`, and started snapshotting the ambient reading
onto every Logs `context` JSONB payload. This session picks up its own
"pending / future work" list.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-verified the feature map is unchanged since the last session (confirmed
via `git log` on the touched files — no astrology work landed between
`b75f65b` on 2026-07-27 and this session's start on 2026-08-02):

| Piece | Location | Role |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | Pure, isomorphic functions: `getHourlyZodiac`, `getWesternZodiac`, `getRokuyo`, `getMoonPhase`, `getJapaneseZodiac` (unused), `getMoonEmoji` (unused) |
| Compute site | `src/client/components/System.tsx` | `astrology` useMemo, ticked every 15 min while tab visible |
| Render sites | `System.tsx` compact layout + cycling "pro" block | `westernZodiac • hourlyZodiac • rokuyo • moonPhase (illumination%)` |
| Signal bus | `src/client/stores/intentionEngine.ts` (QIE) | Tier 0 `astrology` source; `system`/`cosmic` depend on it; `recordAstrologySignal` emits one `ambient_reading`/day with an `auspicious` (Taian) flag |
| Logs | `src/server/utils/logs.ts` `getLogContext(user)` | Snapshots all 5 astrology fields per log entry, timeZone-aware via `user.timeZone` |
| Logs render | `src/client/components/Logs.tsx` `system_snapshot` block | Only printed 2 of the 5 stored fields (`astroRokuyo`, `astroMoonPhase`) |

Picked up the first item on last session's pending list: *"Consider whether
the client-side dashboard display should also read from `user.timeZone`
... instead of device-local time."* Traced why it wasn't done then — it
required a real gap to close, not just a wiring change:

- `GET /api/me` (`src/server/routes/api.ts:412`) returns
  `req.user.useProfileView()`.
- `useProfileView()` (`src/server/models/user.ts:46`) builds its response via
  `fp.pick([...])` over a fixed field list — `id, email, firstName, lastName,
  country, city, address, phone, tags, hideActivityLogs, timeChime`.
  **`timeZone` was not in that list**, even though `User.timeZone` exists on
  the model and is exactly what Logs already reads server-side. The client
  literally could not see its own saved timeZone.
- `System.tsx` already holds the full profile via `const me =
  useStore(stores.me)` (populated by `getMe()` on load/SSE
  `settings_updated`/tab-focus, per `src/client/entries/app.tsx`) — so once
  `timeZone` is exposed, no new fetch or store plumbing is needed to reach
  it from the astrology compute site.
- The client's shared `dayjs` instance (`src/client/utils/dayjs.ts`) has the
  `utc` plugin but not the `timezone` plugin, so the server's `.tz()`-based
  `toWallClockDate()` trick (`src/server/utils/logs.ts`) isn't directly
  reusable client-side, and adding a global dayjs plugin is out of
  proportion to this fix's blast radius.

Also confirmed the second gap flagged for follow-up: the Logs `system_snapshot`
render only ever printed `astroRokuyo` and `astroMoonPhase`, silently
dropping the other 3 fields (`astroMoonIllumination`, `astroHourlyZodiac`,
`astroWesternZodiac`) that `getLogContext()` has been writing to every log
since the prior session — data was being captured but never actually shown
to the user in the journal.

---

## PHASE 1 — BUILD

### 1. Closed the `timeZone` exposure gap

`src/server/models/user.ts` — added `'timeZone'` to the `useProfileView()`
pick list, so `GET /api/me` now returns it alongside the other profile
fields already exposed there.

`src/shared/types/index.ts` — added `timeZone?: string | null` to
`UserProfile` (optional, matching the existing `timeChime?` convention on
the same type) so the client's TypeScript surface matches the new server
response.

### 2. TimeZone-aware ambient reading, without a new dayjs plugin

`src/shared/utils/astrology.ts` — added
`getWallClockDateInTimeZone(timeZone, referenceDate?)`, the client-side
counterpart to the server's `toWallClockDate()`: uses
`Intl.DateTimeFormat(...).formatToParts()` (available in both browser and
Node, no new dependency) to read a moment's wall-clock components in a given
IANA timeZone, then round-trips them through the plain `Date` constructor —
same end effect as the server's dayjs-based version, without touching the
shared client `dayjs` config that dozens of other components rely on.

`src/client/components/System.tsx` — the `astrology` useMemo now resolves
`me?.timeZone ? getWallClockDateInTimeZone(me.timeZone) : new Date()`
(try/catch guarded, falling back to device-local time on any
unrecognized-timeZone edge case) and depends on `[astrologyTick,
me?.timeZone]`. Net effect: once a user has a saved timeZone (set via the
existing `city`/`country` → `weather.getTimeZone()` flow in
`/api/settings`), the dashboard's ambient reading and the journal's `ASTRO:`
line are now derived from the *same* timeZone-aware wall clock — a user
traveling with their device set to a different zone than their saved
profile now sees a consistent reading in both places, rather than the
dashboard silently reading raw device-local time as before.

### 3. Completed the Logs synchronization (all 5 fields, not 2)

`src/client/components/Logs.tsx` — the `system_snapshot` (`SYS:`) block's
`ASTRO:` line now renders all 5 fields already being written by
`getLogContext()`, in the same order/format as the dashboard's own display:

```
ASTRO: {westernZodiac} · {hourlyZodiac} · {rokuyo} · {moonPhase} (illumination%)
```

Previously only `{rokuyo} · {moonPhase}` were shown; `astroMoonIllumination`,
`astroHourlyZodiac`, and `astroWesternZodiac` were being captured on every
log entry since the prior session but never surfaced. This closes that gap
without any schema or backend change — the fields were already there.

### Deliberately not done this session

- **Minting a new QIE pattern** reacting to `astrology` + `goals`/`intentions`
  (e.g. a Taian-day nudge). Still correctly out of scope for this recurring
  routine per the prior session's own note — it needs the full self-assembly
  treatment (pattern number, archetype/job wiring, wiki + doctrine + lexicon
  + Field Manual sync), which is a dedicated benchmark session, not a
  standing-instruction pass.
- **Surfacing the `auspicious` (Taian) flag in the UI.** It already exists
  in the QIE signal metadata (`recordAstrologySignal`) but nowhere visible.
  Adding a visual marker would mean inventing a new UI convention (icon vs.
  text vs. color) without a clear existing pattern to follow in this
  plain-text/terminal-styled dashboard — left as a candidate for a session
  with UI design latitude rather than guessed here.
- **Birth-year Japanese zodiac (`getJapaneseZodiac`, still unused).** No
  birth-date field exists anywhere on the `User` model (re-confirmed no
  `birth*`/`natal` fields were added since last session) — stays out of
  scope while the feature remains ambient-only, as instructed.
- **New widget dependency-graph entries** (e.g. wiring `astrology` into
  `planner`/`goals`). Declining to add a dependency edge that isn't backed
  by an actual data/behavior link — that would be cosmetic graph noise, not
  real synchronization.

---

## PHASE 2 — TEST

```
npm install --legacy-peer-deps   -> OK (node_modules was absent this session's container; pre-existing @nanostores peer-version conflict, unrelated to this session, same workaround as last time)
npm run server:build             -> PASS (tsc --project tsconfig.server.json)
npm run client:build             -> PASS (postcss + esbuild client bundle)
```

Zero errors attributable to this session's changes. One pre-existing,
unrelated esbuild warning surfaced (`duplicate-object-key` on
`quarter_drop` in `src/client/utils/badges.ts`) — not touched by this
session, not introduced by it.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — all pure date-math, no external API,
  no personal birth data.
- **Personalization anchor:** ambient reading is now timeZone-aware
  end-to-end wherever `user.timeZone` exists — both server-side (Logs, since
  last session) and client-side (dashboard, new this session). Falls back
  cleanly to device-local time for users with no saved timeZone yet, or if
  timeZone resolution ever fails.
- **`/api/me` now returns `timeZone`** — previously silently excluded from
  the profile-view pick list even though the underlying `User` model column
  existed; this was the actual blocker to client-side timeZone awareness,
  not a missing store or fetch.
- **Freshness:** recomputes every 15 minutes while the tab is visible, now
  also re-deriving immediately if the user's saved timeZone changes
  mid-session (e.g. after updating city/country in Settings).
- **Widget synchronization:** unchanged this session — remains a Tier 0 QIE
  signal source (`astrology`), consumed by `system` and `cosmic`, emitting
  one `ambient_reading` signal per calendar day with an `auspicious`
  (Taian-day) flag in metadata.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  carries all 5 ambient astrology fields (unchanged, since last session);
  the journal UI now actually renders all 5, not 2 — the gap between what
  was captured and what was shown is closed.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-bpmbyy
Files changed: 5
  src/shared/utils/astrology.ts    MODIFIED  (+ getWallClockDateInTimeZone)
  src/shared/types/index.ts        MODIFIED  (+ UserProfile.timeZone)
  src/server/models/user.ts        MODIFIED  (+ timeZone in useProfileView pick list)
  src/client/components/System.tsx MODIFIED  (astrology useMemo reads me.timeZone)
  src/client/components/Logs.tsx   MODIFIED  (ASTRO: line renders all 5 fields)
  docs/assembly/2026-08-02_LOT-assembly_astrology-widget-timezone-personalization.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern that reacts to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on auspicious/Taian
  days) — needs the full self-assembly treatment (pattern number,
  archetype/job wiring if warranted, wiki + doctrine + lexicon + Field
  Manual sync). Carried forward again from last session; intentionally
  deferred to a dedicated benchmark session.
- Decide on and implement a visual treatment for the `auspicious` (Taian)
  flag somewhere in the UI — it has existed in QIE signal metadata since
  last session but is still not visible to the user anywhere.
- `getJapaneseZodiac` (year-based animal) and `getMoonEmoji` remain unused;
  still candidates for a future opt-in personalization pass, still blocked
  on there being no birth-date field on the `User` model, still out of
  scope while the feature stays ambient-only.
- Consider whether other widgets besides `system`/`cosmic` have a genuine
  (not cosmetic) reason to depend on `astrology` in the QIE dependency
  graph — none identified this session that weren't speculative.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
