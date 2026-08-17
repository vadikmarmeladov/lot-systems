# LOT Self-Assembly Session Report
## 2026-08-17 | Astrology Widget — Personalization + Widget Sync v2 | v2

**Branch:** `claude/practical-curie-vvxclt`
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

This is the second session against this instruction. The first
(2026-07-27, `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`)
fixed staleness, surfaced moon illumination, wired the astrology signal into
the QIE bus (Tier 0 source, `system`/`cosmic` registered as consumers), and
synchronized every new Log entry's `context` with the ambient reading at
creation time. Its "Pending / Future Work" section named three concrete gaps
this session picks up.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-confirmed the map from the prior session (math in
`src/shared/utils/astrology.ts`, compute+render inlined in
`src/client/components/System.tsx`, QIE bus in
`src/client/stores/intentionEngine.ts`, Logs sync via
`src/server/utils/logs.ts` → `LogContext`) and found three things the prior
report flagged as open but unimplemented:

| Gap (from 2026-07-27 report) | Status found this session |
|---|---|
| Client dashboard reads `new Date()` (device-local), not `user.timeZone` | Confirmed still device-local. Also confirmed `UserProfile` (the client-facing `me` type, built by `User.useProfileView()` in `src/server/models/user.ts`) never exposed `timeZone` to the client at all — the gap was one layer deeper than the prior report described. |
| `cosmic` widget declared as an `astrology` signal consumer in `WIDGET_DEPENDENCY_MAP` but never actually reads it | Confirmed — `CosmicUpdateWidget.tsx` picks its Japanese-woodblock-vs-car-audio pixel art style with plain `Math.random()`, no signal read anywhere in the file. |
| `getMoonEmoji()` in `astrology.ts` computed but unused everywhere | Confirmed still unused, both render sites and the Logs `ASTRO:` line print `{moonPhase}` as text only. |

---

## PHASE 1 — BUILD

### 1. Client-side timeZone personalization (closes gap 1)

`src/shared/types/index.ts` — added `timeZone: string | null` to
`UserProfile`. `src/server/models/user.ts` — added `'timeZone'` to the
`fp.pick([...])` allowlist in `useProfileView()`, the single function that
shapes every `/me`-style response; no new field to add, `timeZone` already
lived on the underlying `User` model, it just wasn't being sent to the
client.

`src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js` plugin
(client dayjs previously only had `utc`, not `timezone`; the server-side
`dayjs.ts` already had both).

`src/client/components/System.tsx` — the `astrology` `useMemo` now builds
its reference `Date` from `me.timeZone` (falling back to device-local
`dayjs()` when unset), using the exact same wall-clock-passthrough
construction as the server's `toWallClockDate()` in `logs.ts`:

```ts
const localMoment = me?.timeZone ? dayjs().tz(me.timeZone) : dayjs()
const now = new Date(
  localMoment.year(), localMoment.month(), localMoment.date(),
  localMoment.hour(), localMoment.minute(), localMoment.second()
)
```

Using `.toDate()` instead of this construction would silently defeat the
whole change — `.toDate()` stays anchored to the browser's own timeZone, and
`astrology.ts`'s `getHours()`/`getMonth()`/`getDate()` reads would still see
device-local time. Documented this trap in a code comment since it's easy to
reintroduce by "simplifying" the line later.

Net effect: a user whose profile timeZone differs from their device's now
sees their own zodiac hour on the dashboard, not the device's — this is the
first astrology change that's actually personalized to the *user* rather
than ambient-to-the-viewer.

### 2. Surfaced moon emoji (closes gap 3)

`astrology.ts`'s `getMoonEmoji()` is now called from the `astrology`
`useMemo` in `System.tsx` (both render sites: compact layout and the "pro"
cycling block) and from the `Logs.tsx` `system_snapshot` (`SYS:`) renderer,
so `{moonPhase}` now reads e.g. `🌔 Waxing Gibbous` instead of plain text in
both the live dashboard and the historical journal.

### 3. Wired `CosmicUpdateWidget` into the astrology signal (closes gap 2)

`src/client/components/CosmicUpdateWidget.tsx` now reads the latest
`'astrology'` signal directly off the QIE bus (`intentionEngine.get()`,
same access pattern already used by `ArchitectWidget`/`IntegrityWidget`/
`System.tsx` itself) and uses `metadata.moonIllumination` to bias which
pixel-art style pool `getPixelPrompt()` draws from — waxing-to-full moon
(≥50%) leans toward the existing Japanese woodblock/zen pool, waning-to-new
leans toward the car-audio pool — instead of a flat 50/50
`Math.random()` across all eight prompts. When `metadata.auspicious`
(Taian-day) is set, the pre-generation caption also changes from "a
monochrome transmission" to "auspicious conditions, signal clarity
elevated."

This is the actual consumption side of the dependency the prior session
registered (`cosmic: ['mood', 'energy', 'intentions', 'astrology']` in
`WIDGET_DEPENDENCY_MAP`) — before this session that entry was accurate
about intent but not about behavior.

### 4. Tightened the Logs sync (extends the 2026-07-27 work)

`Logs.tsx`'s `ASTRO:` line now also surfaces the auspicious flag, derived
client-side from `log.context.astroRokuyo === 'Taian'` (no new `LogContext`
field needed — the QIE signal already computes this exact condition from
the same rokuyo string, so deriving it again from the persisted string
keeps the journal and the signal bus in agreement without a schema change):

```
ASTRO: Taian ✨ · 🌔 Waxing Gibbous
```

---

## PHASE 2 — TEST

Dependencies were not pre-installed in this session's container
(`node_modules` absent, and the environment's global `tsc` resolved to
6.0.2 instead of the pinned `^5.9.3` — same class of environment gap as the
prior session, worked around the same way).

```
npm install --legacy-peer-deps   -> 702 packages installed
npm run server:build             -> PASS (tsc --project tsconfig.server.json)
npm run client:build             -> PASS (postcss + esbuild client bundle;
                                     pre-existing duplicate-key warnings in
                                     badges.ts, unrelated to this session)
npm run build                    -> PASS (both, end to end)
npx tsc --noEmit -p tsconfig.json -> 128 pre-existing errors, byte-identical
                                     count before and after this session's
                                     diff (confirmed via git stash A/B) —
                                     zero new type errors introduced
```

Zero errors attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** the client-side dashboard now reads the
  user's saved `timeZone` (newly exposed on `UserProfile`) the same way the
  server-side Logs snapshot always has — a user viewing from a device set to
  a different timeZone than their profile now sees their own zodiac hour,
  not the device's. Falls back to device-local time when no profile
  timeZone is set.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from the prior session), now also re-derives when
  `me.timeZone` changes.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`); `system` consumes it for display, and `cosmic`
  (`CosmicUpdateWidget`) now actually reads it — moon illumination biases
  the pixel-art style pool, the auspicious flag changes the pre-generation
  caption. One `ambient_reading` signal emitted per calendar day, unchanged.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time (unchanged from
  2026-07-27); the journal's `SYS:` render now also shows the moon emoji and
  an auspicious-day marker, both derived from already-stored fields with no
  schema change.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-vvxclt
Files changed: 6
  src/client/components/System.tsx              MODIFIED
  src/client/components/CosmicUpdateWidget.tsx   MODIFIED
  src/client/components/Logs.tsx                 MODIFIED
  src/client/utils/dayjs.ts                      MODIFIED
  src/server/models/user.ts                      MODIFIED
  src/shared/types/index.ts                      MODIFIED
  docs/assembly/2026-08-17_LOT-assembly_astrology-widget-v2.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern that reacts to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on
  auspicious/Taian days) — still deferred; needs the full self-assembly
  treatment (pattern number, archetype/job wiring if warranted, wiki +
  doctrine + lexicon + Field Manual sync) rather than folding into this
  lighter recurring routine.
- `system_snapshot` is currently the only Logs event type that renders the
  astrology context. Consider whether other event branches in `Logs.tsx`
  (e.g. `emotional_checkin`, `answer`) would benefit from the same `ASTRO:`
  line, now that it carries the auspicious marker — would let a user
  correlate mood/journal entries against auspicious days directly in the
  journal, not just in aggregate QIE analysis.
- `getJapaneseZodiac` (year-based animal) remains unused; still a candidate
  for a future personalization pass (e.g. a "your birth year animal"
  opt-in), out of scope while the feature stays ambient-only.
- `docs/technical/WIDGETS.md` still documents astrology only as a sub-bullet
  of "Time & Environment," not as a first-class widget entry with its own
  section — noted but not fixed this session to keep the diff focused on
  behavior over documentation restructuring.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
