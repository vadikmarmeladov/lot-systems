# LOT Self-Assembly Session Report
## 2026-08-30 | Astrology Widget — TimeZone Personalization + Emoji Sync | v2

**Branch:** `claude/practical-curie-ry985r`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection
**Prior session:** `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`

---

## MISSION BRIEF

Standing recurring instruction: continue evolving the Astrology block (today's
zodiac hour, moon phase, rokuyo — ambient conditions, not a personal natal
chart) for user personalization and synchronization with other widgets, keep
it synchronized with Logs entries, and push a full understanding + features
breakdown document each session.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-audited the feature against the prior session's report (2026-07-27,
commit `b75f65b`). Confirmed all four prior deliverables are live and correct
on the current head:

| Prior deliverable | Verified at |
|---|---|
| Periodic recompute (15-min tick, off-tab safe) | `System.tsx:197-203` `astrologyTick` |
| Moon illumination surfaced in both render sites | `System.tsx:474`, `:680` (pre-session) |
| QIE signal bus wiring (`astrology` Tier 0 source, `system`/`cosmic` deps, `recordAstrologySignal`) | `intentionEngine.ts:29,3800,3830,3834,4885` |
| Logs synchronization (`astroRokuyo`/`astroMoonPhase`/etc. in `LogContext`) | `logs.ts` `getLogContext`, `Logs.tsx:365-367` |

Read the prior report's **PENDING / FUTURE WORK** section, which named three
concrete gaps left open on purpose:

1. Author a dedicated QIE pattern reacting to `astrology` + `goals`/
   `intentions` (auspicious-day nudge) — explicitly deferred to "a dedicated
   benchmark session" needing full pattern/archetype/wiki/doctrine/lexicon/
   Field-Manual treatment. Out of scope for a routine sync pass; left
   deferred again this session for the same reason.
2. **Client-side dashboard display still used device-local time instead of
   the user's saved `timeZone`, unlike the server-side Logs snapshot.**
3. `getJapaneseZodiac` and `getMoonEmoji` remained unused.

Traced why (2) existed: `GET /api/me` returns `req.user.useProfileView()`
(`src/server/models/user.ts`), which explicitly `fp.pick()`s a fixed field
list — `timeZone` was never in that list, so the client's `me` atom
(`src/client/stores/state.ts`, typed `UserProfile`) never carried it despite
the server-side `User` model having had `timeZone` all along (set via the
`/settings` endpoint's reverse-geocode flow, `api.ts:585-598`). This session's
`me?.timeZone` was reachable only after closing that gap.

Also traced (3): `getMoonEmoji(phaseName)` existed in `astrology.ts` since
before the prior session but had zero call sites anywhere in `src/` — dead
code sitting next to a live `moonPhase` string that both render sites already
displayed as plain text.

---

## PHASE 1 — BUILD

### 1. Closed the timeZone gap end to end (client personalization)

- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick()` field
  list in `useProfileView()`, so `GET /api/me` now returns it.
- `src/shared/types/index.ts` — added `timeZone?: string | null` to
  `UserProfile`, matching the shape already used by `LogContext.timeZone`.
- `src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js` plugin
  (mirroring `src/server/utils/dayjs.ts`, which already had it), enabling
  `dayjs().tz(...)` client-side.
- `src/client/components/System.tsx` — the `astrology` `useMemo` now builds
  its `now` from `me?.timeZone ? toWallClockDate(dayjs().tz(me.timeZone)) :
  new Date()`, falling back to device-local time exactly as before when no
  profile timeZone is set (logged out, or never configured under Settings).
  Added `me?.timeZone` to the memo's dependency array so switching accounts
  or completing timeZone detection re-derives the reading.

Net effect: a user viewing the dashboard on a device set to a different
timeZone than their saved profile (e.g. traveling, or a shared/kiosk device)
now sees the same ambient reading in the dashboard block as in their Logs
journal, both keyed to their saved timeZone — closing the inconsistency the
prior session flagged but left open.

### 2. Deduplicated the wall-clock helper (widget/server sync, not just docs)

The `toWallClockDate()` helper existed only as a private function inside
`src/server/utils/logs.ts`. Needing the identical trick client-side (item 1
above) was the forcing function to promote it instead of copy-pasting a
second copy: moved to `src/shared/utils/astrology.ts` as an exported,
isomorphic helper typed against a minimal `WallClockMoment` structural
interface (`year/month/date/hour/minute/second`) rather than either
platform's concrete `dayjs.Dayjs`, so it type-checks against both the client
and server dayjs re-exports without either module importing the other's
config. `logs.ts` now imports it instead of defining its own copy. One
function, one behavior, used by both the server Logs snapshot and the client
dashboard block — the literal meaning of "synchronization" for this piece of
logic, not just a data hand-off.

### 3. Wired in the previously-dead `getMoonEmoji`

- `System.tsx`: the `astrology` memo now includes `moonEmoji:
  getMoonEmoji(moonPhase.phase)`; both render sites (compact layout and the
  cycling "pro" block) now show the emoji ahead of the phase name, e.g.
  `Taian • 🌔 Waxing Gibbous (78%)`.
- `Logs.tsx`: the journal's `SYS:` block `ASTRO:` line previously showed only
  `{rokuyo} · {moonPhase}`, silently dropping the illumination percentage
  that the dashboard block has shown since the prior session. Now shows
  `{rokuyo} · {emoji} {moonPhase} ({illumination}%)` — bringing the journal
  rendering to full parity with the dashboard rendering, both display
  surfaces now presenting the same fields in the same shape.

Deliberately **not** done this session: `getJapaneseZodiac` (birth-year
animal) remains unused. Wiring it in would require either (a) an opt-in
birth-year field, which starts drifting toward personal/natal data the
standing instruction explicitly scopes out, or (b) reusing account creation
year, which isn't the user's actual birth year and would be a misleading
label. Left as a candidate for a future explicitly-opt-in personalization
pass, not a default-on addition.

Also deliberately not done: the QIE auspicious-day pattern (item 1 above) —
same reasoning as the prior session, still belongs to a dedicated benchmark
pass with full pattern-authoring treatment.

---

## PHASE 2 — TEST

```
npm install --legacy-peer-deps   -> OK (node_modules was absent this
                                     session's container; same pre-existing
                                     @nanostores/react peer conflict as last
                                     session, same workaround, no code change)
npm run server:build             -> PASS (tsc --project tsconfig.server.json)
npm run client:build             -> PASS (postcss + esbuild client bundle;
                                     pre-existing duplicate-key warnings in
                                     badges.ts, unrelated to this session)
```

Zero errors attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** ambient reading is timeZone-aware everywhere a
  user context exists — **both** the server-side Logs snapshot (since prior
  session) **and** the client-side dashboard block (new this session), both
  reading the same saved `user.timeZone`, both built through the same shared
  `toWallClockDate()` helper. Falls back to device-local time only when no
  profile timeZone is set.
- **Freshness:** recomputes every 15 minutes while the tab is visible, and
  also re-derives immediately if the resolved profile timeZone changes
  (e.g. account switch, or first-load timeZone detection completing after
  the initial paint).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), consumed (per the dependency graph) by `system` and
  `cosmic`; emits one `ambient_reading` signal per calendar day, including an
  `auspicious` (Taian-day) flag other patterns can key off of in a future
  session.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time; the journal's
  `SYS:` block now renders it (rokuyo, emoji, phase, illumination %) at full
  parity with the dashboard block, instead of a reduced subset.
- **Display parity:** dashboard block and journal entry now show the
  identical field set in the identical shape — `{rokuyo} · {emoji}
  {phase} ({illumination}%)` — closing a display drift between the two
  surfaces that existed since the astrology-in-Logs feature was added.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. `getJapaneseZodiac`
  (year-based animal) stays unused for the same reason.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-ry985r
Files changed: 7
  src/client/components/System.tsx        MODIFIED
  src/client/components/Logs.tsx          MODIFIED
  src/client/utils/dayjs.ts               MODIFIED
  src/server/models/user.ts               MODIFIED
  src/server/utils/logs.ts                MODIFIED
  src/shared/types/index.ts               MODIFIED
  src/shared/utils/astrology.ts           MODIFIED
  docs/assembly/2026-08-30_LOT-assembly_astrology-widget-timezone-personalization.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern that reacts to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on
  auspicious/Taian days) — needs the full self-assembly treatment (pattern
  number, archetype/job wiring if warranted, wiki + doctrine + lexicon +
  Field Manual sync). Deferred two sessions running now; still intentionally
  scoped to a dedicated benchmark session rather than folded into this
  routine.
- Consider surfacing `me.timeZone` (now available client-side) in the
  Settings UI as a read-only confirmation of the detected timeZone, since
  users currently have no way to see what timeZone their ambient readings
  and Logs snapshots are actually keyed to.
- `getJapaneseZodiac` remains unused; still a candidate for a future
  explicit opt-in personalization pass (e.g. "your birth year animal"), not
  a default-on feature, since it would require collecting birth-year data
  the app doesn't currently ask for.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
