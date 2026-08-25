<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# Log / Journal Command System

**Technical Reference — the passive-AI Log input, its context capture, and its
in-line slash commands (`/system`, `/story`, and neighbors).**

This is the first dedicated spec for the Log/Journal feature. Prior to this
document, its behavior was only recoverable by reading the component and the
session-report history (`docs/benchmark/LOT-SR-*.md`). This file describes
the system as it exists in code today — not an aspiration.

---

## 1. What the Log is

The Log is a **passive** journal: the user types free text with no prompts,
no questions, no required fields. There is exactly one live, editable entry
at a time (`event: 'note'`); saving it (7s idle autosave, or Ctrl+Enter)
pushes it into read-only history and a fresh empty entry opens at the top.

- Client: `src/client/components/Logs.tsx` — `Logs` (list/orchestration),
  `NoteEditor` (the live input + autosave + slash-command handling),
  `LogContainer` (read-only past entries).
- Server: `src/server/routes/api.ts` — `GET /logs`, `POST /logs`,
  `PUT /logs/:id`. Model: `src/server/models/log.ts` (table `logs`).

Every Log row carries two JSONB columns beyond its text:
- `metadata` — event-specific structured data (varies by `event` type).
- `context` — the environment snapshot at write time (§2).

## 2. Context snapshot (the "click creates a record" mechanism)

Every log write captures an environment snapshot via
`getLogContext(user)` in `src/server/utils/logs.ts`:

```ts
export async function getLogContext(user: User): Promise<LogContext>
```

| Field | Source |
|---|---|
| `city`, `country` | user settings (not live geolocation) |
| `timeZone`, `date` | user settings; wall-clock date built in that zone |
| `temperature`, `humidity`, `weatherDescription` | cached `WeatherResponse` row for the user's city/country, within `WEATHER_STALE_TIME_MINUTES` — no live weather call at write time |
| `astroRokuyo`, `astroMoonPhase`, `astroMoonIllumination`, `astroHourlyZodiac`, `astroWesternZodiac` | `src/shared/utils/astrology.ts`, computed off the same wall-clock date |

This is entirely server-side; there is no client-side context hook. The
primary editable entry is created empty by `GET /logs` (no context yet) and
is lazily backfilled on its *first* save (`PUT /logs/:id`, only if
`context` is still `{}`). Every AI-facing endpoint that creates a Log row
(`/prayer`, `/story`, memory answers, etc.) calls `getLogContext()` fresh at
that moment.

**Honest boundary**: "a record of the moment without a photo or sound" is
accurate — the snapshot is structured environmental/astrological metadata,
not sensor capture. There is no camera or microphone access anywhere in this
path.

## 3. Slash commands

`src/client/utils/logTriggers.ts` is a pure, store-free detector module.
`detectNewTriggers(text, previousText)` returns only *newly appeared*
triggers (diffed against the previous keystroke's text) so editing around an
existing `/command` does not re-fire it. `NoteEditor`'s effect
(`Logs.tsx`, the trigger-scan `useEffect`) switches on each fresh trigger.

Full command list, as rendered by `/system` itself:

```
/prayer           Generate contextual scripture
/story [period]   Compressed story — day / week / month / year
/scan             System status overview
/qi [query]       Ask the Quantum Intelligence engine
/assembly         Self-assembly module status
/phys             Physiological cohort report
/qos              Quantum OS state analysis
/fast             Orthodox fasting calendar
/breathe          4-2-6 breathing exercise
/freeze           Pause and reflect protocol
/silent           Signal silence check
/synth            Toggle keyboard sound
/radio            Toggle radio
/night            Dark mode
/how              Open LOT AI check-in (System tab)
/system           This help screen
```

`/system` is a pure client-side static list — no network call. `/story`,
`/prayer`, `/qi`, and `/assembly` call an AI-backed endpoint and splice the
response back into the live entry's text (prefixed with an emoji marker),
so the generated content becomes part of the user's own journal entry
rather than a separate, disconnected reply.

## 4. `/story` — compressed narrative

**Endpoint**: `POST /api/story` (`src/server/routes/api.ts`).
**Gate**: Usership tag only (`req.user.tags`); returns HTTP 403 with a
static message otherwise. Rate-limited to 5/minute.

### 4.1 Compression window

`/story` alone behaves as it always has — a `RECENT JOURNEY` compression
over the last 200 logs, unscoped by date. Appending a period narrows the
window and the source query:

```
/story        → RECENT JOURNEY   (last 200 logs, unscoped — legacy behavior)
/story day    → PAST 24 HOURS    (createdAt >= now - 1 day, limit 500)
/story week   → PAST WEEK        (createdAt >= now - 7 days, limit 500)
/story month  → PAST MONTH       (createdAt >= now - 1 month, limit 500)
/story year   → PAST YEAR        (createdAt >= now - 1 year, limit 500)
```

The period is parsed client-side (`Logs.tsx`, the `story-mode` branch) via
`value.match(/\/story\s+(day|week|month|year)\b/i)` — the same pattern
already used for `/qi <query>`.

### 4.2 What feeds the prompt

Within the window, the handler assembles four blocks:

1. **Journal text** — `Log` rows with `event === 'note'`, most recent 10,
   200 chars each.
2. **Moods** — `emotional_checkin` rows, most recent 10.
3. **Self-care notes** — `memory_answer` / `self_care_checkin` /
   `energy_checkin` rows, question+answer pairs.
4. **Environment** — the freshest `context` snapshot on a Log row within
   the window (falling back to a live `getLogContext()` read): location,
   sky/weather + temperature/humidity, moon phase + illumination, zodiac
   hour, rokuyo. Rendered into the prompt as an `ENVIRONMENT AT TIME OF
   WRITING` block, with an explicit instruction to weave it in "only where
   it earns its place — a texture, not a weather report."

Plus, from the client request body: `quantumState` and `userIndex` (Quantum
Intent Engine snapshot, computed 100% client-side — see
`docs/technical/MEMORY-AND-QUANTUM-INTENT-ENGINES.md`) and `arcadeProgress`
(§5).

The assembled prompt is sent to `aiEngineManager.getEngine('together')` →
`.generateCompletion(prompt, 512)` (`src/server/utils/ai-engines.ts` — the
same AI-vendor abstraction documented in `AI-ENGINE-GUIDE.md`; Together AI
is the default preference, with automatic fallback through Gemini, Mistral,
Claude, OpenAI on failure). The result is persisted as its own `Log` row
(`event: 'generated_story'`) with `period` and `arcadeProgress` recorded in
`metadata`, and returned to the client, which appends it to the live entry.

### 4.3 Corrected defect: the `event` filter

Before this session, the journal-text filter read:
```ts
logs.filter(l => l.event === 'log_entry' || l.event === 'journal')
```
Neither `'log_entry'` nor `'journal'` is ever written to a Log row — real
free-text entries are always saved with `event: 'note'` (see `POST /logs`
and `GET /logs` in `api.ts`). The filter matched nothing, silently, since
the feature shipped: `/story` had never actually read a user's journal
text, only mood and self-care metadata. Fixed to `event === 'note'`. See
`docs/benchmark/LOT-DOCTRINE.md` §"Silent Filter Erasure" for the general
pattern this belongs to.

## 5. Arcade / gamified evolution

LOT already runs a large badge system — not something this session
introduces. `src/client/utils/badges.ts` defines `BADGES` (hundreds of
entries, including a section literally marked "Sci-Fi Arcade Expansion"),
with rarity tiers, unlock messages, and character-class-style theming;
`getEarnedBadges()` reads what the current user has unlocked. The canonical
spec lives in `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v*.md`
(versioned, latest ~v32) — this document does not duplicate it.

This session's addition is narrow: `/story`'s prompt now receives
`arcadeProgress: { earned, total }` from the client (computed via the same
`getEarnedBadges()` / `BADGES` already used by `/scan`) and folds it into
the compressed narrative as "a marker of momentum, not a scoreboard
callout" — so the gamified layer becomes one more thread the AI can draw
into the story, not a separate report.

## 6. Related documents

- `docs/technical/MEMORY-AND-QUANTUM-INTENT-ENGINES.md` — Memory Engine
  (server) and Quantum Intent Engine (client) architecture.
- `docs/technical/AI-ENGINE-GUIDE.md` — the 5-provider AI vendor
  abstraction `/story` calls into.
- `docs/badges/LOT_BADGES_ACHIEVEMENTS_MASTER_CODEX_v*.md` — Arcade/badge
  canon.
- `docs/benchmark/LOT-DOCTRINE.md` — "Widget→Memory Compression Loop" and
  "Silent Filter Erasure" clauses, both relevant to extending any log-based
  AI prompt safely.

---

*First written: 2026-08-25, session LOT-SR-20260825-01.*
