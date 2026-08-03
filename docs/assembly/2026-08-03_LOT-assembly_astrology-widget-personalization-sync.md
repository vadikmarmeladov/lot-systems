# LOT Self-Assembly Session Report
## 2026-08-03 | Astrology Widget — TimeZone Personalization + Signal Bus Consumer | v2

**Branch:** `claude/practical-curie-5kearm`
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

This is the second session against this instruction. The first session
(`docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`)
fixed staleness, surfaced moon illumination, wired the feature into the QIE
signal bus as a Tier 0 source, and snapshotted the reading onto every new Log
entry. It left three items explicitly pending — this session closes two of
them and makes a start on the visibility of the third.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-verified the full map of the feature at session start (unchanged locations
from the prior session, re-confirmed by fresh grep/read rather than assumed):

| Piece | Location | Role |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | Pure, isomorphic functions: `getHourlyZodiac`, `getWesternZodiac`, `getRokuyo`, `getMoonPhase`, `getMoonEmoji`, `getJapaneseZodiac` (still unused) |
| Compute site | `src/client/components/System.tsx` | `const astrology = useMemo(...)`, ticked every 15 min off-tab-paused |
| Render sites | `System.tsx` compact layout + "pro" cycling block | Both print the same computed reading |
| Signal bus | `src/client/stores/intentionEngine.ts` | `astrology` registered as Tier 0 source; `system`/`cosmic` declared dependents; `recordAstrologySignal` emits one `ambient_reading`/day |
| Logs | `src/server/utils/logs.ts` `getLogContext(user)` → `LogContext` | Snapshots `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/`astroWesternZodiac` on every new log row, timeZone-aware server-side |
| Docs | `docs/technical/WIDGETS.md` | Astrology previously had no dedicated `###` section — only inline mentions |

Read the prior session's own "PENDING / FUTURE WORK" section as this
session's starting brief:

1. Author a QIE pattern reacting to `astrology` + `goals`/`intentions`
   together (auspicious-day nudge) — explicitly flagged as needing the full
   self-assembly treatment (pattern number, archetype/job wiring, wiki +
   doctrine + lexicon + Field Manual sync). **Deliberately still deferred**
   this session too — minting a new pattern number without doing that full
   cross-doc sync would leave the wiki/doctrine/lexicon inconsistent with the
   code, which is a worse state than leaving it pending. This belongs to a
   dedicated benchmark session, not a routine widget-evolution pass.
2. Client-side dashboard display should read from `user.timeZone` instead of
   device-local time — **closed this session**, see Phase 1.
3. `getJapaneseZodiac`/`getMoonEmoji` remain unused — **`getMoonEmoji` closed
   this session** (now rendered in both dashboard sites and in the Logs
   `SYS:` block); `getJapaneseZodiac` (year-based birth-animal) intentionally
   still unused, since surfacing it would edge toward personal-identity
   astrology rather than the ambient/environmental scope this feature is
   scoped to.

Also confirmed via grep that **no widget was actually consuming** the
`astrology` QIE signal — it was a registered Tier 0 source with real
dependents declared in `WIDGET_DEPENDENCY_MAP`, but every consumer of
`intentionEngine.signals` (`SignalStreamWidget`, `SystemPulseWidget`,
`QuantumEngineWidgets`, etc.) either filtered it out or rendered it through
the same generic "underscore→words" fallback as every other signal, with no
`source === 'astrology'` special-casing anywhere in the codebase. That gap —
declared dependency, zero real reader — is what "other widgets
synchronization" was still missing.

---

## PHASE 1 — BUILD

### 1. TimeZone personalization (closes prior pending item #2)

`src/shared/utils/astrology.ts`: promoted the `toWallClockDate()` helper that
the server-side Logs snapshot already used (build a `Date` from a moment's
local wall-clock fields so `getHours()`/`getMonth()`/`getDate()` reads reflect
the target zone regardless of the runtime's own zone) out of
`src/server/utils/logs.ts` and into the shared, isomorphic astrology module —
one implementation instead of two, importable from both client and server.

`src/client/utils/dayjs.ts`: extended the client dayjs instance with the
`timezone` plugin (server-side dayjs already had it; client-side didn't). Pure
addition — existing plugin extensions and every other call site are
untouched.

`src/client/components/System.tsx`: the `astrology` `useMemo` now builds its
`now` from `me?.timeZone ? toWallClockDate(dayjs().tz(me.timeZone)) : new
Date()` — `me` (the logged-in `User`) already carries `timeZone` client-side
via `stores.me`, no new query needed. Falls back to device-local time exactly
as before when no timeZone is on file, so this is additive personalization,
not a behavior change for users without a saved timeZone. Added `me?.timeZone`
to the memo's dependency array.

Net effect: a user who saved a timeZone in their profile now sees the same
ambient reading on the dashboard regardless of which device/system-timeZone
they're viewing from — closing the exact gap the prior session flagged
("client-side dashboard display still uses device-local time").

### 2. Surfaced the moon emoji (closes prior pending item #3, partial)

`getMoonEmoji()` was computed-and-discarded infrastructure — defined, typed,
exported, never called. `System.tsx`'s `astrology` object now includes
`moonEmoji: getMoonEmoji(moonPhase.phase)`, rendered in both dashboard sites
right before the phase name: `{rokuyo} • {moonEmoji} {moonPhase} (…%)`.
`src/client/components/Logs.tsx`'s `SYS:` block gained the same emoji on its
`ASTRO:` line. Purely additive visual detail — no computation changed, just a
previously-unused pure function now wired to its call sites.

### 3. First real consumer of the `astrology` QIE signal (widget synchronization)

`src/client/components/SignalStreamWidget.tsx` is the terminal-style feed
that renders the last 12 signals from every QIE source generically. Before
this session, an `astrology` `ambient_reading` signal arriving here rendered
through the same fallback as any unrecognized signal name — "Ambient
reading" — discarding the actual rokuyo/moon-phase/auspicious metadata that
`recordAstrologySignal` already attaches.

Added `formatAstrologySignal()`, used only when `signal.source ===
'astrology'`, which reads `signal.metadata.rokuyo` / `.moonPhase` /
`.auspicious` and renders e.g. `Taian · Full Moon ✨` (the ✨ only on
Taian/auspicious days) instead of the generic label. This is the first widget
in the codebase to branch on `source === 'astrology'` at all — the
`WIDGET_DEPENDENCY_MAP` entries for `system`/`cosmic` declare the dependency,
and now at least one real signal consumer honors it with source-specific
rendering, rather than the dependency graph being purely declarative.

### 4. Logs synchronization — already covered, extended cosmetically

The prior session already wired `getLogContext()` to snapshot the ambient
reading onto every new Log row, timeZone-aware. This session's only Logs
change is the moon-emoji addition above (#2) — the underlying sync mechanism
was sound and needed no rework, confirmed by re-reading `logs.ts` and the
`Log`/`LogContext` types before touching anything.

---

## PHASE 2 — TEST

`node_modules` was absent at session start; restored via `npm install
--legacy-peer-deps` (same pre-existing `@nanostores/react`/`nanostores` peer
conflict as last session, unrelated to this session's changes).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle)
npm run build          -> PASS (both, end to end)
```

One pre-existing, unrelated esbuild warning surfaced during `client:build`
(`Duplicate key "quarter_drop"` in `src/client/utils/badges.ts:3103` and
`:5390`) — not touched by this session, left as-is since it predates this
work and is out of scope for a widget-evolution routine.

Zero errors attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** timeZone-aware end to end now — both the
  server-side Logs snapshot (since last session) and the client-side
  dashboard display (new this session) read from the user's saved profile
  `timeZone` when set, falling back to device-local time only when no
  timeZone is on file.
- **Freshness:** recomputes every 15 minutes while the tab is visible,
  paused off-tab.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), declared as a dependency of `system` and `cosmic`; emits one
  `ambient_reading` signal per calendar day carrying an `auspicious`
  (Taian-day) flag. The Signal Stream Widget is now a real consumer,
  rendering the rokuyo/moon-phase reading (with a ✨ mark on auspicious days)
  instead of a generic fallback label.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time, rendered in the
  journal's `SYS:` block next to weather/location, now with the moon emoji.
- **Documentation:** `docs/technical/WIDGETS.md` gained a dedicated
  `### Astrology (Ambient Conditions)` section (previously only mentioned
  inline), following the same Assembly Module / Sources / Log Renderings /
  Connection bullet convention used throughout the file.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. `getJapaneseZodiac`
  (year-based birth-animal) remains unused for the same reason.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-5kearm
Files changed: 8
  src/shared/utils/astrology.ts                                                   MODIFIED
  src/server/utils/logs.ts                                                        MODIFIED
  src/client/utils/dayjs.ts                                                       MODIFIED
  src/client/components/System.tsx                                                MODIFIED
  src/client/components/Logs.tsx                                                  MODIFIED
  src/client/components/SignalStreamWidget.tsx                                    MODIFIED
  docs/technical/WIDGETS.md                                                       MODIFIED
  docs/assembly/2026-08-03_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern that reacts to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on auspicious/Taian
  days) — still needs the full self-assembly treatment (pattern number,
  archetype/job wiring if warranted, wiki + doctrine + lexicon + Field Manual
  sync). Deliberately deferred a second session running rather than folded in
  partially.
- `system` and `cosmic` are declared dependents of `astrology` in
  `WIDGET_DEPENDENCY_MAP`, but `SignalStreamWidget` (generic signal feed) is
  the only widget rendering it specially so far — `system` (`System.tsx`
  itself, the compute site) and a genuine `cosmic`-tagged consumer are
  candidates for a future pass, e.g. theming or a subtle auspicious-day
  indicator on the dashboard's own Astrology block.
- `getJapaneseZodiac` (year-based birth animal) remains unused; still
  intentionally out of scope while the feature stays ambient-only — would
  need an explicit opt-in birth-year field to surface without drifting toward
  natal-chart territory.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
