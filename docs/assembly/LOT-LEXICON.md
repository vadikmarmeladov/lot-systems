<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-LEXICON — Evolving Controlled Vocabulary

The compression substrate. As concepts recur across Benchmark sessions, they
earn short stable tokens, so later doctrine and reports can say in one token
what once took a sentence. Tokens are minted only after a concept has
appeared in 3+ prior session reports OR been folded into doctrine twice —
until then it stays as plain words (see `SELF-ASSEMBLY.md` in the
`lot-benchmark` skill for the minting rule).

This file bootstrapped on 2026-07-17. Seeded only with tokens that already
recur across the existing repo corpus (`docs/assembly/`, `docs/technical/`,
`docs/corporate/`) prior to this skill's first run — no vocabulary invented.

```
TOKEN     MEANING                                              REV    SINCE
-----     -------                                              ---    -----
QIE       Quantum Intent Engine (pattern/archetype/cohort       A      pre-existing
          recognition system; 65+ patterns, 19+ archetypes)
QOS       Quantum Operating System (self-assembling runtime     A      pre-existing
          layer built from QIE signal analysis)
GATE      The CHECK-B green-gate decision point in the          A      pre-existing
          benchmark pipeline — nothing advances past it red
S-2       Vadik Marmeladov, in his authorizing/reviewing         A      pre-existing
          capacity over session reports and irreversible actions
```

Tokens are never deleted; if a concept is superseded, mark it
`DEPRECATED -> <new token>` so old reports remain legible.
