# LOT Self-Assembly Log

**Date:** 2026-05-23
**Session ID:** loving-goldberg-vfBvt
**Branch:** claude/loving-goldberg-vfBvt
**Run type:** Full (ASSEMBLE)

---

## Sources Read

1. **System Progress widget** — `SystemProgressWidget.tsx` read in full. ASSEMBLY_TRANSMISSIONS: 3 entries (2026-04-17, 2026-04-18, 2026-05-22). SESSION_REPORTS: 3 entries. Last run 1 day prior. Transmission Layer fully deployed.
2. **GitHub .MD files read:** WIDGETS.md, LOT-STYLE-GUIDE.md, 2026-05-22_LOT-assembly_transmission-layer.md, GoalJourneyWidget.tsx (full read), Logs.tsx (partial — log event type verification), shared/types/index.ts (Log model), api.ts route list
3. **Coding session history:** Prior assembly logs read. Pattern confirmed: `event: 'note'` is the journal text entry type. GoalJourneyWidget was built and deferred from last run. Journal vocabulary extraction was the explicit next-session recommendation.

---

## Feedback Signal Extracted

Verbatim directive driving this run (from last session's recommendation):
> "Journal vocabulary extraction → personal interface language injection"

Additional signals:
- GoalJourneyWidget explicitly deferred last run — "Safe to add but deferred per prompt instruction to be careful with new additions. Recommend next run." — P1 deferral now resolved
- "the interface starts speaking back in the user's own language" — vocabulary mirror as personalization vector
- "No two runs should produce the same output" — new engine, new view, no duplication of prior build

---

## Delta Analysis

| Priority | Item | Status |
|---|---|---|
| P1 | GoalJourneyWidget wired into System.tsx | BUILT |
| P1 | Journal vocabulary endpoint missing from server | BUILT |
| P1 | My Language view missing from SystemProgressWidget | BUILT |
| P2 | SESSION_REPORTS v5 entry appended | BUILT |
| P2 | ASSEMBLY_TRANSMISSIONS v5 entry appended | BUILT |
| P3 | Vocabulary injection into Memory questions | DEFERRED |
| P3 | Vocabulary injection into widget copy (contextual prompts, interventions) | DEFERRED |
| P4 | Time-of-day vocabulary clustering (morning words vs evening words) | DEFERRED |

---

## What Was Built

### 1. GoalJourneyWidget — `System.tsx`

Wired `GoalJourneyWidget` into the Bioethics stack, placed after `NarrativeWidget`. The widget detects personal goals through journey stages and cycles Journey / Goals / Path views. It already returns null when insufficient data exists — graceful degradation confirmed. One import line, one placement line. No structural changes.

**Files modified:**
- `src/client/components/System.tsx` — import added at line 35, placement at line 672

### 2. Journal Vocabulary Endpoint — `api.ts`

**Route:** `GET /api/journal/vocabulary`

**Logic:**
- Queries last 90 days of `event: 'note'` logs for the authenticated user, limit 500
- Extracts tokens, removes stopwords (52-word list covering common English + LOT-specific noise words)
- Builds unigram frequency map — words appearing 3+ times, not already in a bigram
- Builds bigram frequency map — adjacent non-stopword pairs appearing 2+ times
- Bigrams take priority (user's actual phrases, not isolated words)
- Returns top 15 phrases sorted by frequency with totalEntries and uniqueWords counts

**Return shape:** `{ phrases: { text: string, count: number }[], totalEntries: number, uniqueWords: number }`

**Files modified:**
- `src/server/routes/api.ts` — endpoint added before Cosmic Update section (line 4513)

### 3. My Language View — `SystemProgressWidget.tsx`

Added 6th cycle point to the widget. Cycle now: `deployment → assembly → feedback → report → transmission → vocab → deployment`.

**State added:** `vocab` — loaded on mount from `/api/journal/vocabulary`

**Label:** `My Language:` when active

**Three display states:**
- Loading: `"Loading language map..."`
- Empty (< 90 days of notes, no repeating phrases): `"No patterns found yet. Write more notes. The language map builds from your words."`
- Loaded: Frequency-ranked phrase list — top 3 at full opacity, remainder at 60%. Footer stats: notes scanned, unique words, 90-day window. Caption: `"The system listens. These are the words you return to."`

**Files modified:**
- `src/client/components/SystemProgressWidget.tsx` — type, state, fetch useEffect, cycleView, label, JSX view, SESSION_REPORTS v5, ASSEMBLY_TRANSMISSIONS v5

---

## Test Results

| Test | Result |
|---|---|
| TypeScript type check — System.tsx | PASS (no new errors) |
| TypeScript type check — SystemProgressWidget.tsx | PASS (no new errors) |
| TypeScript type check — api.ts | PASS (no new errors) |
| Pre-existing config errors (TS2688, TS5101, TS5107) | PRE-EXISTING — not introduced by this run |
| ProgressView type covers all 6 view states | PASS |
| cycleView covers vocab → deployment return | PASS |
| label variable handles vocab explicitly | PASS |
| GoalJourneyWidget placement: after NarrativeWidget, in Bioethics stack | PASS |
| Vocabulary endpoint: Op.and + Op.ne for null/empty filter | PASS |
| SESSION_REPORTS entry count: 4 | PASS |
| ASSEMBLY_TRANSMISSIONS entry count: 4 | PASS |

---

## Deploy Confirmation

**Commit message:** `[LOT-ASSEMBLY] 2026-05-23 — personal language engine, goal journey wired, vocab view`
**Branch:** `claude/loving-goldberg-vfBvt`
**Push:** `git push -u origin claude/loving-goldberg-vfBvt`

---

## What Was Deferred

- **Vocabulary injection into Memory questions** (P3) — Server now has user vocabulary data. Next logical step is to use the top phrases as context when generating Memory Engine questions — the AI asks questions using the user's own words. Requires `buildPrompt` modification in `src/server/utils/memory/question-generator.ts`. Deferred — not in scope for this run per "incremental and careful" directive.
- **Vocabulary injection into widget copy** (P3) — Contextual prompts, interventions, narrative could all reference user vocabulary. Requires a vocabulary context layer passed server-side. Future run.
- **Time-of-day vocabulary clustering** (P4) — Morning notes might use different words than evening notes. Interesting signal but not yet needed. Deferred.

---

## Next Session Recommendation

**Vocabulary injection into Memory questions:** pass the user's top 5 phrases as context to the AI question generator in `src/server/utils/memory/question-generator.ts` — the Memory Engine starts asking questions in the user's own language.

---

## Log 2 — System Transmission to Usership

```
ASSEMBLY RUN — 2026-05-23
Built: GoalJourneyWidget, journal vocabulary engine, My Language view
Feedback applied: "Journal vocabulary extraction → personal interface language injection"
Status: DEPLOYED
Next: Vocabulary injection — Memory Engine asks questions in your own words
```
