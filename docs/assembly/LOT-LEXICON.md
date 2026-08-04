# LOT SYSTEMS — ASSEMBLY LEXICON
Evolving controlled vocabulary. A token is minted only after the concept it
names has recurred in 3+ prior session reports, or been folded into doctrine
twice (see `docs/assembly/LOT-DOCTRINE.md`, minting rule). Tokens are never
deleted; superseded tokens are marked `DEPRECATED -> <new token>` so old
reports stay legible.

First-run bootstrap (2026-08-04, LOT-SR-20260804-01): the six tokens below
were not minted by this session — they already recur dozens to hundreds of
times across the existing `docs/` corpus (grep count over `docs/**/*.md`:
QIE 175 files, GATE 121, QOS 106, CQGS 69, ATP 54, LP 22) and across the live
app's own naming (event types, component names, help text). This bootstrap
seeds the lexicon with what the repo already, honestly, uses — it does not
invent a starting vocabulary. `SINCE` is stamped to this session because it
is the first session in which a lexicon file exists to record them.

TOKEN     MEANING                                                      REV    SINCE
-----     -------                                                      ---    -----
QIE       Quantum Intent(ion) Engine — client pattern/signal recognizer A     20260804-01
CQGS      Citizen index dimensions: Cleanness, Routine(Q), Growth,      A     20260804-01
          Sociality — the 7-axis user evolution/Arcade substrate
ATP       Personal energy metric (biofield "fuel" level, 0-100 band)    A     20260804-01
QOS       Quantum OS — the client's mode/phase state machine            A     20260804-01
LP        Calibration Loop (deliberate vs. passive feedback cycle)      A     20260804-01
GATE      The CHECK-B green-gate decision point in the Benchmark        A     20260804-01
          pipeline — nothing advances past it red

Provisional (recurs but below the 3-report minting threshold — tracked in
prose, not tokenized yet):
- "event-name drift" — a Log `event` string used in a filter/query that no
  write path actually produces. Appeared once this session
  (LOT-SR-20260804-01, three instances in one route). Watching for
  recurrence before minting.
