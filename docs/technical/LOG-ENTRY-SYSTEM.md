================================================================================
LOT SYSTEMS / TECHNICAL DOCUMENTATION
DOCUMENT: LOG ENTRY SYSTEM — JOURNAL, SLASH COMMANDS, COMPRESSION PIPELINE
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-08-19
REF:      LOT-SR-20260819-01 (introduces /story period compression)
================================================================================

--------------------------------------------------------------------------------
00 // PURPOSE
--------------------------------------------------------------------------------
This document is the operator-facing reference for the Log ("Journal") system:
how a click becomes a context snapshot, how a typed entry becomes a passive
Journal record, how the machine follows up on it, and how the slash-command
layer (`/system`, `/story`, and thirteen siblings) exposes the Quantum Intent
Engine → AI vendor → personalized-data pipeline directly inside the log input.
It also records where the Arcade (gamified) layer plugs into the same signal
stream, since every Log write is also a game move.

--------------------------------------------------------------------------------
01 // ENVIRONMENT CONTEXT — THE SNAPSHOT WITHOUT A PHOTO
--------------------------------------------------------------------------------
Every Log write is stamped with a `LogContext` object before it reaches the
database — no image, no audio, just structured environment state at the
moment of the click:

  src/server/utils/logs.ts :: getLogContext(user)
    temperature, humidity, weatherDescription   — cached WeatherResponse,
                                                    30-min staleness window
    country, city, timeZone, date               — from User row
    astroRokuyo                                  — Japanese six-day calendar
    astroMoonPhase, astroMoonIllumination        — lunar cycle at local date
    astroHourlyZodiac, astroWesternZodiac        — astrology overlays

The context is attached server-side on write (`Log.context`), never
reconstructed after the fact — it is a fact about the moment, not a query
run later. `LogContainer` (src/client/components/Logs.tsx) renders it as a
quiet hover-reveal next to the timestamp, never as primary content.

--------------------------------------------------------------------------------
02 // THE LOG — A PASSIVE JOURNAL, NOT A PROMPT
--------------------------------------------------------------------------------
The Logs tab (`src/client/components/Logs.tsx`, `NoteEditor` inner component)
is a single always-open textarea. No question precedes it. The operator types;
`useUpdateLog` autosaves; after a 7-second read pause the entry is pushed down
into history and a fresh empty log opens (`Logs.tsx:78-91`). There is no
prompt-response turn structure — this is the "passive AI UI" specified in the
product brief: the machine reads, it does not interview, on this surface.

Follow-up is a SEPARATE, asynchronous mechanism: `intentionEngine.ts` scans
signals recorded from Log/Journal writes (`recordLogSignal`,
`recordJournalSignal`, `recordBadgeSignal`) for spikes and pattern breaks
(151+ patterns as of QIE v113 per `docs/benchmark/LOT-LEDGER.md`), and the
Memory Engine (`src/server/utils/memory.ts`) surfaces a question on a LATER
visit — never inline in the Log input. The proactive question happens on
System-tab widgets or the morning check-in, matching the product brief:
"the machine asks first, either through the question in the morning ... or
through widgets on the site."

--------------------------------------------------------------------------------
03 // SLASH COMMAND SYSTEM
--------------------------------------------------------------------------------
Detection is pure and testable: `src/client/utils/logTriggers.ts` exports
`detectTriggers(text)` / `detectNewTriggers(text, previousText)`. Each rule
matches either a literal emoji or a `/word` token (word-boundary regex, so
`/scandalous` does not fire `/scan`). Effects are wired at the call site in
`NoteEditor`'s trigger-handling `useEffect` (`Logs.tsx`, ~line 3960-4168).

  COMMAND     TRIGGER          EFFECT
  ---------   --------------   ----------------------------------------------
  /system     system-help      Lists every command below (this block, live)
  /story      story-mode       Compressed narrative — see §04
  /scan       ai-scan          Local system status (assembly %, badges, QIE)
  /qi <text>  qi-rfi           Quantum Intelligence RFI — free-text query
  /assembly   assembly-check   Self-assembly module status directive
  /phys       phys-report      Physiological cohort report
  /qos        qos-report       Quantum OS state analysis
  /fast       force-fast       Orthodox fasting calendar for today
  /breathe    breathe          4-2-6 breathing exercise, live display
  /freeze     freeze-widgets   Pause-and-reflect protocol, timestamped
  /silent     silent-mode      Signal-silence check (hours since last signal)
  /prayer     prayer-mode      Contextual scripture generation (Together AI)
  /synth      toggle-synth     Toggle Soviet-keyboard synth click sound
  /radio      radio-toggle     Toggle ambient radio
  /night      night-mode       Dark mode
  /how        how-checkin      Navigate to System tab check-in

`/system` renders every row above (plus shortcuts) directly inside the log —
typing it is non-destructive: the help block appears below the entry, the
entry itself is untouched, matching the brief's "all commands appear."

--------------------------------------------------------------------------------
04 // /story — COMPRESSED PERSONAL NARRATIVE (THE PIPELINE, END TO END)
--------------------------------------------------------------------------------
This is the concrete implementation of the product brief's third mechanism:
"a compressed story of your day/week/month/year ... sent back as a prompt/
story/compression ... to surface more intimate high and low peaks."

  LOT USER DATA            Log rows (journal text, moods, self-care answers,
                            plan_set intent) scoped to the requested window
        |
        v
  LOT QUANTUM INTENT ENGINE  Client-side getUserState()/getUserIndex()
                              (src/client/stores/intentionEngine.ts) — energy,
                              clarity, alignment, needsSupport + 0-100 index
        |
        v
  AI VENDOR PROCESSOR       aiEngineManager.getEngine('together')
                            (src/server/utils/ai-engines.js) — Together AI
                            primary, auto-fallback chain (see DOCTRINE)
        |
        v
  LOT PERSONALIZED DATA     Log.create({ event: 'generated_story', ... })
  STORED                    — lives in LOT's DB, never in the AI vendor

Client entry point: `Logs.tsx`, `story-mode` branch (~line 4150).
Server endpoint:    `POST /api/story` (`src/server/routes/api.ts`, ~line 5486).
Gate:                Usership tag required; 5 requests/minute rate limit.

  NEW THIS SESSION (LOT-SR-20260819-01) — period-scoped compression:

  `/story`             (no arg)  — prior behavior: most recent 200 logs,
                                    unbounded window, 10-item samples.
  `/story day`                   — last 24h,   1000-log cap, 10-item samples
  `/story week`                  — last 7d,    1000-log cap, 15-item samples
  `/story month`                 — last 30d,   1000-log cap, 25-item samples
  `/story year`                  — last 365d,  1000-log cap, 40-item samples

  Implementation: `periodMatch` regex on the raw log text extracts the
  trailing word; the server clamps `createdAt` with `Op.gte` against
  `dayjs().subtract(N, 'day')` and widens the AI prompt's "COMPRESSION
  WINDOW" line so the model is told explicitly what span it is compressing
  and instructed to surface real peaks, not an average ("This is a
  compression: surface the actual high and low peaks, not an average").
  The response and the stored `generated_story` Log both carry
  `period: 'day'|'week'|'month'|'year'|null` so downstream QIE pattern
  detection can eventually distinguish on-demand story requests by scope.

  This is DISTINCT from the standing Sunday job (Job 24,
  `executeWeeklyLOTAIStory` in `src/server/scheduled-jobs.ts:834`), which is
  template-based (no AI call), runs unconditionally for every active user at
  18:00 UTC Sunday, and writes `lot_ai_story` + `user.metadata.weeklyStory`.
  `/story` is operator-invoked and AI-generated; Job 24 is automatic and
  deterministic. Both write into the Log stream and both close the loop the
  brief describes ("further compress the loop, understand the person").

--------------------------------------------------------------------------------
05 // ARCADE — THE GAMIFIED EVOLUTION TRACK
--------------------------------------------------------------------------------
S-2 asked this session to note the Arcade layer explicitly: LOT is a
self-care company, but the Log/Journal stream doubles as the state machine
for an RPG. This is not a new build — it is already load-bearing and should
be documented as a first-class consequence of every Log write, not a
side project:

  - `src/client/components/About.tsx:332` states the product framing
    directly: "LOT is also an RPG and an Arcade. Every check-in is a move."
  - `src/client/utils/badges.ts` — Badge Codex, 750+ badges (v30) as of the
    most recent LOT-LEDGER entries, organized into rarity tiers and
    character-class-like categories (`achievement_rpg`, `secret_boss`, word-
    turn lexicon triggers).
  - Every Log write already calls `recordBadgeSignal` alongside
    `recordLogSignal`/`recordJournalSignal` (`Logs.tsx:33`) — the same
    keystroke that feeds the Quantum Intent Engine also feeds the Arcade.
  - QIE pattern/archetype detection (151 patterns, 51 archetypes as of QIE
    v113) is the scoring layer underneath both the self-care insight surface
    AND the badge-unlock surface — one signal stream, two presentations.

  PROVISIONAL — no new Arcade UI was built this session; this section
  records the existing architecture so the next session extending Arcade
  starts from what already exists instead of re-discovering it. A dedicated
  Arcade tab (distinct from badge notifications inside System) remains
  unbuilt as of this document.

--------------------------------------------------------------------------------
06 // FILES OF RECORD
--------------------------------------------------------------------------------
  src/client/components/Logs.tsx           NoteEditor, LogContainer, all
                                            event-type render cases, slash-
                                            command effect handlers
  src/client/utils/logTriggers.ts          Pure trigger detection (tested
                                            independent of stores/DOM)
  src/client/queries.ts                    useStoryGeneration, useQiQuery,
                                            useAssemblyDirective,
                                            usePrayerScripture mutations
  src/server/routes/api.ts                 POST /api/story, /api/prayer,
                                            /api/qi, /api/assembly-directive
  src/server/utils/logs.ts                 getLogContext — environment
                                            snapshot on write
  src/server/scheduled-jobs.ts             Job 24 — weekly template story
  src/client/stores/intentionEngine.ts     Quantum Intent Engine — signals,
                                            patterns, archetypes, user index
  src/client/utils/badges.ts               Arcade / Badge Codex

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOG-ENTRY-SYSTEM
================================================================================
