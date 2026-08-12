# LOT Self-Assembly Session Report
## 2026-08-12 | Astrology Widget — Personalization + Widget Sync v2 | v2

**Branch:** `claude/practical-curie-t6jhde`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection + static build/typecheck

---

## MISSION BRIEF

Standing recurring instruction: continue evolving the Astrology block (today's
zodiac hour, moon phase, rokuyo — ambient conditions, not a personal natal
chart) for user personalization and synchronization with other widgets, keep
it synchronized with Logs entries, and push a full understanding + features
breakdown document each session.

This is the second recorded pass on this feature. The first pass
(`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`, merged
via PR #92, commit `b75f65b`) fixed staleness, surfaced moon illumination,
wired the feature into the QIE signal bus, and synchronized Logs entries. Its
own "Pending / Future Work" section named three concrete follow-ups. This
session re-verified the feature's live state against that list (master moved
through QIE v106→v113+ in between, via unrelated sessions) and picked up the
genuinely outstanding items.

---

## PHASE 0 — RE-ORIENTATION

Re-read the full feature footprint before touching anything, since ~15
unrelated self-assembly sessions landed on master between the first pass and
this one:

| Piece | Location | State found |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | Unchanged since 07-27: `getHourlyZodiac`, `getWesternZodiac`, `getRokuyo`, `getMoonPhase` in active use; `getJapaneseZodiac`, `getMoonEmoji` still unused |
| Compute site | `System.tsx` | Staleness fix from 07-27 intact: 15-min tick, off-tab paused, `moonIllumination` surfaced in both render sites |
| Signal bus | `intentionEngine.ts` | `'astrology'` still a live Tier 0 source; `recordAstrologySignal` still called once/day from `System.tsx`; `system`/`cosmic` still declare it as a dependency |
| Logs | `src/server/utils/logs.ts` `getLogContext(user)` | `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/`astroWesternZodiac` still snapshotted per log, still rendered in `Logs.tsx`'s `SYS:` block |
| 07-27's Pending Item 1 | dedicated QIE pattern for astrology + goals/intentions | **Not done by anyone in the interim** — confirmed via `git log` on `astrology.ts`/`intentionEngine.ts`; the only astrology-touching commit since 07-27 is the merge itself |
| 07-27's Pending Item 2 | client-side timeZone-aware display | **Not done** — `System.tsx`'s astrology `useMemo` still read `new Date()` (device-local) at session start |
| 07-27's Pending Item 3 | `getJapaneseZodiac`/`getMoonEmoji` unused | **Still unused** — left alone this session too; no natal/birth-year opt-in exists to hang them on, and none was requested |

### A finding worth recording plainly

While tracing how QIE patterns actually get wired (to model my own addition on
a real, not decorative, pattern), every `record*` helper added by the two most
recent self-assembly passes before this one (v112 → P146/P147/P148, v113 →
P149/P150/P151 — six helper functions in `intentionEngine.ts`) has **zero call
sites anywhere in `src/`**, including inside `intentionEngine.ts` itself. The
session-log entries in `SystemProgressWidget.tsx` narrate "detection blocks
added after P145" for both, but no such blocks exist — only the `record*`
functions, which nothing calls. These six patterns are declared but inert:
they will never fire, because nothing produces the signal they'd react to.

This isn't corrected in this session — untangling six unrelated patterns is
out of scope for an astrology-focused pass and risks a larger, riskier diff
than the standing instruction asks for. It's recorded here, in the session
report, and folded into `LOT-DOCTRINE.md` (see the benchmark report), so the
next self-assembly pass that touches the QIE pattern registry knows to either
wire P146–P151 for real or retire them, instead of layering P152+ on top of
functions nothing calls. Per this protocol's own cardinal rule — "produce the
conditions for compressed notation; do not fabricate philosophy or call
provisional tokens a language" — minting a new decorative pattern this session
to keep pace with the numbering would repeat the same mistake, so this session
does not add a P152/archetype/job ceremonial entry. What it adds instead is
below, and it is wired.

---

## PHASE 1 — BUILD

### 1. Client-side dashboard is now timeZone-aware (closes 07-27 Pending Item 2)

The gap: `UserProfile` (the type behind the client's `me` store) never
included `timeZone`, even though the server `User` model has carried it for a
long time and `getLogContext()` was already timeZone-aware server-side. The
dashboard's own astrology block, `IntentionsWidget`, and everything else
reading `me` had no way to know the user's saved zone — only the device's.

- `src/shared/types/index.ts`: added `timeZone?: string | null` to
  `UserProfile`.
- `src/server/models/user.ts`: `useProfileView()`'s field-pick list now
  includes `'timeZone'`, so `GET /me` actually returns it.
- `src/client/utils/dayjs.ts`: extended the `dayjs/plugin/timezone.js` plugin
  (client dayjs previously only had `utc`, not `tz()`).
- `src/shared/utils/astrology.ts`: lifted the `toWallClockDate()` helper out
  of `src/server/utils/logs.ts` (where it was server-only, despite being pure
  date arithmetic) into the shared astrology module, duck-typed against a
  `{year()/month()/date()/hour()/minute()/second()}` shape so it works with
  a `dayjs.Dayjs` from either the client or server dayjs util without this
  shared file importing dayjs itself. `logs.ts` now imports it instead of
  redefining it — one fewer copy of the exact same trick to keep in sync.
- `System.tsx`: the astrology `useMemo` now does
  `me?.timeZone ? toWallClockDate(dayjs().tz(me.timeZone)) : new Date()` —
  same fallback-to-device-local behavior the server-side Logs snapshot
  already used, now applied on the client too.

Net effect: a user whose saved profile timeZone differs from their current
device's clock (traveling, a misconfigured device, a shared kiosk) now sees
the same ambient reading on the dashboard that their own Logs entries record
server-side, instead of two silently-disagreeing versions of "today's
astrology."

### 2. A real, wired personalization signal (partial answer to 07-27 Pending Item 1)

Rather than mint a new numbered QIE pattern with no detection logic (see the
finding above), this session added one small signal that is actually
produced and actually consumed by the existing signal bus:

- `intentionEngine.ts`: new `recordAuspiciousIntentionAlignment(alignedCount,
  alignedEvents)`, emitting `recordSignal('astrology',
  'auspicious_intention_alignment', {...})` — same `'astrology'` Tier-0
  source the ambient reading already uses, so no new dependency-map wiring
  is needed.
- `System.tsx`: a new effect, parallel to the existing daily
  `recordAstrologySignal` effect, checks whether today's `rokuyo` is
  `'Taian'` (the auspicious day in the six-day cycle) **and** whether the
  user has an `intention`, `goal_set`, or `goal_journey` log in the last 24h
  (read from `useLogs()`, which is already fetched on this screen — no new
  network call). If both hold, it calls the new record function once per
  calendar day (own `localStorage` guard key, independent from the base
  ambient-reading guard so the two don't interfere).

This is the ambient condition and the user's own declared direction
coinciding — a real correlation between two live signals, not a decorative
placeholder. It does not yet drive any UI (no toast, no nudge copy) —
authoring that surface, plus deciding whether it deserves a formal pattern
number and archetype, is exactly the kind of decision this protocol reserves
for a dedicated pass with its own green gate, not something to bolt onto an
astrology-scoped session.

### 3. Confirmed still correctly out of scope

No natal-chart fields (birth date/time/place) were added anywhere. Grepped
`User`/`UserProfile` for `birth`/`natal`/`zodiacSign` again this session —
still zero real hits, same as 07-27's finding. The feature remains strictly
ambient: zodiac hour, Western zodiac sign (from today's date, not a birth
date), rokuyo, and moon phase — all pure date-math, no external API, no
personal astrological data.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (fresh container); restored via
`npm install --legacy-peer-deps` (pre-existing peer-version conflict,
unrelated to this session's changes).

```
npm run server:build                          -> PASS (tsc --project tsconfig.server.json)
npm run client:build                          -> PASS (postcss + esbuild; 2 pre-existing
                                                  duplicate-badge-key warnings, unrelated)
npm run build                                  -> PASS (both, end to end)
npx tsc --project tsconfig.json --noEmit       -> 128 errors, IDENTICAL COUNT before and
                                                  after this session's diff (verified via
                                                  git stash), none in files this session
                                                  touched beyond pre-existing unrelated
                                                  errors in intentionEngine.ts's signal
                                                  source union — this is not a repo-defined
                                                  check (tsconfig.server.json excludes
                                                  src/client), run as an extra honesty pass
```

Zero new errors attributable to this session's changes, by exact before/after
count comparison against the unmodified branch tip.

Not run: a live browser session (no dev server / DB available in this
container). This is a real gap in verification, stated plainly rather than
implied — static build and type-check confirm the code compiles and the
existing signal/log pipeline shape is preserved, not that the rendered
dashboard looks correct.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — all pure date-math, no external API,
  no personal birth data.
- **Personalization anchor:** the ambient reading is now timeZone-aware
  end-to-end — both the server-side Logs snapshot (since 07-27) and the
  client-side dashboard display (new this session) resolve against the
  user's saved `timeZone` profile field when set, falling back to
  device-local time otherwise.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from 07-27).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`'astrology'`), consumed per the dependency graph by `system` and
  `cosmic`. Emits two distinct signals now: `ambient_reading` (once/day,
  unconditional) and `auspicious_intention_alignment` (once/day, only on
  Taian days where the user has also set a goal/intention in the last 24h —
  new this session, and confirmed wired with a real call site).
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time, timeZone-aware,
  rendered in the journal's `SYS:` block next to weather/location (unchanged
  from 07-27).
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. Re-confirmed this session.
- **Known unwired debt discovered elsewhere in the QIE (not astrology's, not
  fixed this session, documented for the next pass):** the six most recent
  pre-existing pattern `record*` helpers (P146–P151, from two sessions prior
  to this one) have no call sites anywhere in the codebase. They will never
  fire.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-t6jhde
Files changed: 7
  src/client/components/System.tsx        MODIFIED  (timeZone-aware astrology memo + new alignment effect)
  src/client/stores/intentionEngine.ts    MODIFIED  (+recordAuspiciousIntentionAlignment)
  src/client/utils/dayjs.ts               MODIFIED  (+timezone plugin)
  src/server/models/user.ts               MODIFIED  (useProfileView now includes timeZone)
  src/server/utils/logs.ts                MODIFIED  (toWallClockDate moved to shared, deduped)
  src/shared/types/index.ts               MODIFIED  (UserProfile.timeZone)
  src/shared/utils/astrology.ts           MODIFIED  (+toWallClockDate, shared)
  docs/assembly/2026-08-12_LOT-assembly_astrology-widget-personalization-sync-v2.md  ADDED
  docs/benchmark/LOT-SR-20260812-01.md    ADDED
```

---

## PENDING / FUTURE WORK

- Decide the fate of P146–P151: either wire real detection conditions for
  each (they were narrated as done but never were) or retire the six
  functions and their `SystemProgressWidget.tsx` log entries. Either
  decision needs a dedicated pass, not a fold-in.
- Author a UI surface for `auspicious_intention_alignment` (e.g. a gentle
  cosmic-widget nudge on Taian days when a goal/intention is already set) —
  the signal now exists and is real; nothing currently displays it. Deciding
  whether this warrants a formal QIE pattern number and archetype is a
  judgment call for a dedicated self-assembly pass with its own green gate.
- `getJapaneseZodiac` (birth-year animal) and `getMoonEmoji` remain unused;
  still candidates for a future *opt-in* personalization pass, still out of
  scope while the feature stays ambient-only with no birth data on the User
  model.
- No live-browser verification was possible this session (no dev server/DB
  in this container) — a future session with a running app should confirm
  the timeZone-aware dashboard reading renders correctly for a user with a
  saved `timeZone` different from the browser's local zone.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
