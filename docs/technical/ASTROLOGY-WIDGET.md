<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Astrology Block — Understanding & Features Breakdown

> Living doc for the Astrology widget. Updated each session it's touched; the
> Session Log at the bottom tracks what changed and why. See also
> `docs/technical/WIDGETS.md` for the one-paragraph reference entry.

---

## What it is

Ambient time-and-date conditions, displayed the same way for every user —
**not a personal natal chart**. No birth date, birth time, or birth place is
ever used. Four ambient signals, all derived purely from *now*:

| Signal | Meaning | Cycle |
|---|---|---|
| Western zodiac | Calendar zodiac season (e.g. "Cancer" on July 22) | ~30 days |
| Zodiac hour | Traditional Japanese 12-animal hour cycle | 2 hours |
| Rokuyo (六曜) | Six-day Japanese auspicious-day cycle | 6 days |
| Moon phase | Phase name + illumination % | ~29.5 days |

This keeps it squarely "ambient conditions" — the same for every user on
Earth at a given moment (zodiac hour/moon phase) or in a given timezone
(rokuyo, western zodiac by local date) — rather than a chart computed from
anyone's personal data.

## Where it lives

- `src/shared/utils/astrology.ts` — pure date math, zero dependencies, safe
  to import from both client and server. Exposes the individual calculators
  (`getHourlyZodiac`, `getWesternZodiac`, `getMoonPhase`, `getRokuyo`,
  `getMoonEmoji`) plus two higher-level functions added this session:
  - `getAstrologySnapshot(date)` — bundles all four signals plus
    `moonEmoji` and `rokuyoMeaning` into one object. This is now the single
    source every caller should use instead of calling the four calculators
    separately (previously System.tsx and the server each duplicated that
    wiring).
  - `getResonantLogWindows(logs, today)` — personalization. Looks at which
    zodiac hour / rokuyo the user's *own* past Log entries were written
    under (from the stamp described below) and reports whether today's
    conditions match their historical pattern. Purely statistical over the
    user's own data — still no natal chart, still no birth data.
- `src/client/hooks/useTodayAstrology.ts` — React hook wrapping
  `getAstrologySnapshot`. Recomputes every 60s but only triggers a re-render
  when a signal actually changes (zodiac hour flips every 2h, rokuyo/moon
  flip daily), so long-lived tabs don't show a stale hour by evening.
- `src/server/utils/logs.ts` (`getLogContext`) — stamps every newly created
  Log's `context` with the astrology snapshot active **in the user's own
  timezone** at write time.
- `src/shared/types/index.ts` (`LogContext`) — carries the stamp:
  `hourlyZodiac`, `westernZodiac`, `moonPhase`, `moonIllumination`,
  `moonEmoji`, `rokuyo`.

## Where it's shown

1. **System.tsx, free layout** — static `Astrology:` block:
   `{westernZodiac} • {hourlyZodiac} • {rokuyo} • {moonEmoji} {moonPhase}`.
2. **System.tsx, paid layout** — one view in the cycling
   Astrology/Psychology/Journey/Biofield block. Same line as above, plus:
   - `rokuyoMeaning` as a one-line ambient gloss (e.g. "favors starting
     things" for Taian).
   - A personalization line from `getResonantLogWindows`, shown only once
     the user has 5+ logs carrying an astrology stamp: *"You tend to log
     during Dragon hour — today matches."* Silent otherwise — no
     insight is invented from too small a sample.
3. **Quantum Sign Widget** (`QuantumSignWidget.tsx`) — the "patches" view's
   astrology patch now reads `useTodayAstrology()` directly: patch name is
   `{rokuyo} · {moonEmoji} {moonPhase}`, description is the rokuyo meaning
   plus illumination %. Before this session it showed one of four
   hardcoded, unrelated strings ("Lunar Reset", "Mercury Direct", ...) that
   had no connection to the actual date — a subscriber could see
   "Mercury Direct" in the Quantum Sign Widget and "Waning Gibbous" in the
   System tab with no way to reconcile them. Both widgets now read the same
   snapshot.
4. **Logs.tsx** — every journal entry's hover tooltip and the
   `system_snapshot` log's `SYS:` detail block now include the astrology
   stamp (`MOON: 🌔 Taian`) next to the existing weather stamp
   (`TMP:`/`HUM:`/`POS:`), pulling from `log.context` rather than
   recomputing anything — it's just displaying what the server already
   wrote down when the entry was created.

## Data flow

```
getAstrologySnapshot(date)  [shared/utils/astrology.ts]
        │
        ├── client: useTodayAstrology() ──┬── System.tsx (both layouts)
        │                                  └── QuantumSignWidget.tsx
        │
        └── server: getLogContext(user) ── stamped onto every new Log.context
                                                     │
                                                     ▼
                                     Logs.tsx reads log.context.{rokuyo,moonEmoji,...}
                                                     │
                                                     ▼
                              getResonantLogWindows(logs, todaySnapshot)
                                                     │
                                                     ▼
                          System.tsx personalization line (paid layout only)
```

## Personalization model

The personalization line does *not* predict anything about the user or
claim any astrological effect. It's a plain frequency count: of the user's
own logs that happen to carry an astrology stamp (only logs written after
this session's stamping went live), which zodiac hour and which rokuyo
appear most often, and whether today's live conditions match either. It
needs 5+ stamped logs before it says anything, and says nothing at all if
neither matches. This is deliberately the entire "personalization" surface
for this widget — anything birth-data-based (sun sign from DOB, houses,
aspects) is explicitly out of scope per the "not a natal chart" framing.

## Known limitations / next steps

- Personalization has zero historical depth right now — the stamp only
  applies going forward from this session, so `getResonantLogWindows` will
  report `sampleSize: 0` for every existing user until they log a handful
  more entries. This is intentional (no backfill/migration was run against
  old logs) but worth knowing before wondering why the line isn't showing.
- Rokuyo meanings are a short one-line gloss, not exhaustive — could grow a
  richer description per rokuyo if the widget earns more surface area.
- `useTodayAstrology`'s 60s poll is cheap (pure date math, no I/O) but could
  become a `setTimeout` aligned to the next 2-hour boundary if it ever needs
  to be tighter than a 1-minute worst-case lag on the hour flip.

---

## Session Log

### 2026-07-22 — Personalization + cross-widget sync + Log stamping

- Added `getAstrologySnapshot()` and `getResonantLogWindows()` to
  `shared/utils/astrology.ts`; added `getRokuyoMeaning()`.
- Extended `LogContext` with astrology fields; `getLogContext()` now stamps
  every new Log with the ambient conditions active in the user's own
  timezone at write time.
- Added `useTodayAstrology()` client hook as the single source of truth;
  wired into `System.tsx` (replacing a duplicated, never-refreshing
  `useMemo`) and `QuantumSignWidget.tsx` (replacing four hardcoded, date-
  unrelated "astrology patches").
- Added a personalization line to the paid-layout Astrology view, gated on
  5+ stamped logs, using `getResonantLogWindows`.
- Surfaced the astrology stamp on Log entries in `Logs.tsx` (hover tooltip
  + `system_snapshot` detail block), deduping two copy-pasted `contextText`
  builders into one `formatLogContext()` helper in the process.
- Updated `docs/technical/WIDGETS.md`: corrected the Quantum Sign Widget
  entry (no longer describes fake hardcoded patches) and added a dedicated
  Astrology Block entry under System & Metrics Widgets.
- Verified: `tsc --noEmit` shows zero new errors introduced (65 pre-existing
  vs. 68 baseline before this session's changes — the deltas are pure line-
  number shifts in files I edited elsewhere in the same file, confirmed by
  diffing the full error list before/after); `client:build` (esbuild)
  passes; server-side `tsc --project tsconfig.server.json --noEmit` shows no
  errors in touched files. No test suite exists for this widget to run.
