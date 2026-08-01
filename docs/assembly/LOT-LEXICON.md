# LOT SYSTEMS — LEXICON
Evolving controlled vocabulary for the Benchmark self-assembly protocol.
Tokens are minted only after a concept has recurred in 3+ prior session
reports, or has been folded into doctrine twice (see LOT-DOCTRINE.md and
the `lot-benchmark` skill). Tokens are never deleted — a superseded token
is marked `DEPRECATED -> <new token>` so old reports stay legible.

**Bootstrap note:** this file did not exist before `LOT-SR-20260801-01`.
The entries below are seeded from tokens that already recurred across the
live `docs/` corpus at bootstrap time (recurrence verified against the
tree, not invented) — see `SELF-ASSEMBLY.md`, "First-run bootstrap."
`SINCE` is set to the earliest ledger entry (`20260725-01`) since these
tokens predate this file and the ledger does not reach further back.

| TOKEN    | MEANING                                                                    | REV | SINCE       |
|----------|-----------------------------------------------------------------------------|-----|-------------|
| QIE      | Quantum Intent Engine — pattern/archetype/job intent-recognition system     | A   | 20260725-01 |
| FM       | Field Manual — the versioned pattern/archetype/job counter document         | A   | 20260725-01 |
| GATE     | The CHECK-B green-gate decision point (Benchmark pipeline step 04)          | A   | 20260725-01 |
| ATP      | Physiological energy metric surfaced in BIO/energy log widgets              | A   | 20260725-01 |
| ARCH\<n\> | Archetype #n in the QIE archetype catalog (e.g. Arch47)                    | A   | 20260725-01 |
| DAY\<n\>+ | Running system-age counter ("Day 1066+") carried across session reports    | A   | 20260725-01 |
