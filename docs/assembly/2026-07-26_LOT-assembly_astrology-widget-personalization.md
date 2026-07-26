<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# MACHINE-TO-MACHINE REBUILD PROMPT
## Astrology Widget — Personalization & Logs Synchronization
### LOT® Self-Assembly™ | Session 2026-07-26 | Scheduled evolution run

---

## PURPOSE

This document is a complete, standalone specification of the Astrology block as
it exists after this session, written for an AI agent with no memory of prior
sessions. It covers: what the widget was, what changed, why, and what the next
scheduled run should consider. Read this file and the referenced source files;
nothing else is required to continue the work.

This is a recurring scheduled task ("continue to evolve this widget for user
personalization and other widgets synchronization"). Each firing should land
one bounded, tasteful increment — not a rewrite — and leave a dated report like
this one behind so the next run picks up where this one left off.

---

## WHAT THE ASTROLOGY BLOCK IS

Ambient temporal context, not a personal natal chart. Three calendar traditions
layered into one cycling read, computed locally with no external API:

- **Western zodiac** — 12 solar-position signs, standard tropical dates.
- **Japanese hourly zodiac** — 12 animals, one governing each 2-hour window of
  the day (Rat 23:00–01:00 … Pig 21:00–23:00).
- **Rokuyo (六曜)** — Japanese 6-day fortune cycle (Sensho, Tomobiki, Senpu,
  Butsumetsu, Taian, Shakku), computed as `days-since-2000-01-01 % 6`.
- **Moon phase** — 8-phase lunar cycle with illumination %, computed from a
  known new-moon epoch (2000-01-06T18:14Z) and the 29.53059-day lunar cycle.

Source of truth: `src/shared/utils/astrology.ts`. Rendered inline inside
`src/client/components/System.tsx` (no separate `AstrologyWidget.tsx` file —
it lives in the System block alongside Team/Users/Weather). Documented for
end users in `src/client/components/About.tsx` (`#astrology` section).

**Design law already in force, unchanged by this session:** "No horoscope
predictions — only structural time context. The widget observes calendars,
not fortunes." Any future personalization must stay on the observation side
of that line — describing what happened, never predicting what will.

### Two tiers, two presentations

- **Free tier** (`!isPaidAccount` branch, `System.tsx` ~L383-440): static
  ambient line only, no cycling, no AI, no personalization. By design — this
  tier is explicitly "no AI, just essentials."
- **Paid tier** (R&D / Usership, `isPaidAccount` branch, ~L510+): the block's
  label cycles Astrology → Psychology → Journey → Biofield (Quantum) on click,
  sharing one `astrologyView` state slot with three otherwise-unrelated views.

---

## WHAT CHANGED THIS SESSION

1. **Moon emoji surfaced.** `getMoonEmoji()` existed in `astrology.ts` since
   the widget's original build but was never called — dead code. Now prefixed
   onto the ambient reading in both the free-tier line and the paid-tier
   Astrology view: `🌘 Scorpio • Rat • Taian • Waning Crescent`.

2. **`getPersonalRhythm()` added** (`src/shared/utils/astrology.ts`). Pure
   function, no side effects:

   ```ts
   function getPersonalRhythm(logTimestamps: Date[]): {
     dominantHourZodiac: string | null   // hourly-zodiac window this user logs in most
     dominantHourShare: number           // 0-100, % of their entries in that window
     taianEntries: number                // count of entries logged on a Taian day
     sampleSize: number                  // total timestamps considered
   }
   ```

   It replays the *existing* `getHourlyZodiac()` / `getRokuyo()` functions over
   the user's own log timestamps instead of `now`. No new calendar math, no
   new concept — same cycles, pointed at the user's history instead of the
   clock. That is what keeps it inside the "observes calendars, not fortunes"
   law: it is descriptive statistics over the user's own actions, not a claim
   about fate.

3. **Wired into `System.tsx`** (paid tier only, Astrology view only):

   ```tsx
   const personalRhythm = React.useMemo(
     () => getPersonalRhythm(logs.map((log) => new Date(log.createdAt))),
     [logs]
   )
   ```

   Rendered as a second, muted (`opacity-30`) line beneath the ambient reading,
   gated on `personalRhythm.sampleSize >= 5` so brand-new accounts never see a
   statistically meaningless line:

   ```
   🌘 Scorpio • Rat • Taian • Waning Crescent
   Your rhythm: Dragon hour (34%) • 6 Taian entries
   ```

4. **Docs synced in the same commit:**
   - `About.tsx` — new "Personal Rhythm" subsection under the Astrology Widget
     entry, explaining the observed-not-predicted framing to end users.
   - `docs/technical/WIDGETS.md` — the Astrology Widget had no entry at all
     despite existing since v1.0.0 (see `RELEASE-NOTES-v1.0.0.md`). Added one
     in the Core Widgets section, matching the Data Source / Connection format
     every other widget entry uses.

### Files touched

- `src/shared/utils/astrology.ts` — `getPersonalRhythm()` added, `PersonalRhythm` type exported.
- `src/client/components/System.tsx` — moon emoji in both tiers; personal-rhythm line in paid-tier Astrology view; imports `getMoonEmoji`, `getPersonalRhythm`.
- `src/client/components/About.tsx` — Astrology Widget section extended.
- `docs/technical/WIDGETS.md` — new Astrology Widget entry.
- This file.

### Why this scope and no more

Log-derived personalization is explicitly what was asked for
("synchronize with Logs entries"), but the free tier's "no AI, just essentials"
framing and the widget's own "not a natal chart" design law both argue against
going further in one increment (e.g. cross-referencing mood/energy logs
against moon phase, which starts to read as a claim of causation rather than
observation). That direction is left as a candidate for a future session,
flagged below rather than built now, so it can get its own scrutiny.

---

## SYNCHRONIZATION WITH OTHER WIDGETS

The Astrology view already shared its `astrologyView` cycle slot with three
log-derived views before this session — Psychology (`profile?.archetype`),
Journey (`journeyData`, itself derived from `answerLogs`), and Biofield/Quantum
(`quantumState`, `physiologicalCohort`, both derived from `intentionEngine`
signals). This session's `personalRhythm` reads the same `useLogs()` call
already in scope at the top of `SystemInner()` — no new fetch, no new
subscription. All four views in that cycle are now log-driven in some form,
which keeps the cycle conceptually coherent: each click reveals a different
lens on the same underlying log history.

`QuantumSignWidget.tsx` also references "Astrology" (a rotating "patch" name
like "Lunar Reset" / "Mercury Direct") but this is a separate, self-contained
subscriber-motivation gimmick — it does not call into `astrology.ts` and was
deliberately left alone this session. If a future run wants true synchronization
there (making its "patches" reflect the actual current moon phase / rokuyo
instead of an unrelated day-of-year rotation), that is a larger, more visible
behavior change and should be its own reviewed increment, not folded in here.

---

## VERIFICATION PERFORMED

- `npm install --legacy-peer-deps` (yarn's registry fetch was flaky this
  session; npm succeeded — lockfile/dependency set unchanged, no package.json
  edits made).
- `npx tsc --noEmit -p tsconfig.json` — 65 pre-existing errors before and
  after this change (confirmed via `git stash` diff), none in the touched
  files beyond one pre-existing, unrelated `weather.humidity` nullability
  warning in `System.tsx` that predates this session.
- `NODE_ENV=production npx esr ./scripts/build/client.build.ts -prod` —
  production client bundle builds clean.
- No server-side or schema changes; nothing touches `/api/logs` persistence,
  only reads already-fetched `logs` client-side.

---

## CANDIDATE WORK FOR THE NEXT SCHEDULED RUN

Left deliberately undone this session — pick one, keep the increment bounded:

1. **`QuantumSignWidget` astrology patches** — replace the day-of-year-rotation
   fake patches with real current moon phase / rokuyo, for genuine
   cross-widget consistency (see Synchronization section above).
2. **Rokuyo × mood correlation** — if pursued, frame strictly as "you logged N
   check-ins on Taian days vs M on Butsumetsu days" (a count), never as
   "Taian days improve your mood" (a claim). The distinction matters for the
   widget's stated design law.
3. **Free-tier personal rhythm** — currently gated to paid tiers because it's
   log-derived and the free tier is "no AI, just essentials." Worth revisiting
   only if product direction changes that framing — not a code limitation.
4. **Tests** — there is no existing test coverage for `astrology.ts`; a future
   session could add unit tests for `getPersonalRhythm()` (empty input, single
   timestamp, tie-breaking between equally-frequent hourly zodiacs) since none
   of the surrounding widget code in this repo appears to have a test harness
   wired up yet either.

---

AUTHORIZED BY: Scheduled task (S-2 VADIK MARMELADOV account)
LOT SYSTEMS CORPORATION | 2026-07-26
