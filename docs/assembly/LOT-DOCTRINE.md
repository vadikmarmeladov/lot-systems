# LOT SYSTEMS — ASSEMBLY DOCTRINE
Distilled, stable principles, written increasingly in lexicon notation
(`docs/assembly/LOT-LEXICON.md`). A finding becomes a doctrine clause only
once it has been confirmed across sessions — recurred, not decreed on first
sight (see `docs/assembly/SELF-ASSEMBLY.md` distillation rule). Doctrine
compresses; session reports (`docs/LOT-SR-*.md`) stay the verbatim record.

REV: A
CLAUSES: none yet — this is the bootstrap revision.

--------------------------------------------------------------------------------
PROVISIONAL OBSERVATIONS (not yet doctrine — logged for recurrence-watching)
--------------------------------------------------------------------------------

[P-001, first seen LOT-SR-20260804-01]  Event-name drift: a Log `event`
string referenced in a filter/query stops matching reality when the write
path's actual event name is renamed, aliased, or was simply guessed at
authoring time, and nothing fails loudly — the query just returns fewer or
zero rows. One route (`POST /api/story`) carried three such mismatches
(`log_entry`/`journal` vs. the real `note`; `memory_answer`/
`self_care_checkin`/`energy_checkin` vs. the real `answer`/`self_care`/
`energy_state`/`energy_update`), silently starving its own AI prompt of the
data it was written to compress. PROVISIONAL because this is a first
occurrence — not yet confirmed as a recurring class across sessions. If a
second unrelated occurrence is found in a future Benchmark, fold into a
doctrine clause recommending a shared `LogEvent`-typed constant (or a
lint/type check against the `#shared/types` `LogEvent` union) at every Log
`event` filter site, rather than restating the individual bug each time.
