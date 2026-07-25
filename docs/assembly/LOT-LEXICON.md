<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-LEXICON

Evolving controlled vocabulary for `lot-benchmark` skill session reports
(`docs/LOT-SR-*.md`). A concept earns a token here only after it has appeared in
3 or more prior session reports under this ledger, OR has been folded into
`LOT-DOCTRINE.md` twice (see minting rule in the skill's SELF-ASSEMBLY.md).

**First-run bootstrap (this file, 2026-07-25):** seeded only with tokens that
already recur dozens of times across the existing repository documentation
(`docs/wiki/LOT-WIKI-v78.md`, `docs/assembly/*.md`, `docs/assembly/LOT-GENESIS-v1.md`)
— not invented for this ledger. No new tokens were minted this session; nothing
in a single session can cross the 3-report recurrence threshold.

```
TOKEN     MEANING                                                    REV    SINCE
-----     -------                                                    ---    -----
S-2       Vadik Marmeladov — system operator, sole authorizer         A      20260725-01
QIE       Quantum Intent Engine — runtime pattern-recognition         A      20260725-01
                store src/client/stores/intentionEngine.ts
COSMO GATE  Ethics review gate on every shipped feature, named for    A      20260725-01
                Kuzya Cosmo Marmeladov (LOT-DOCTRINE Clause 2)
GREEN GATE  Broken code never reaches GitHub (LOT-DOCTRINE Clause 3)  A      20260725-01
FM        Field Manual — src/client/components/About.tsx, canonical   A      20260725-01
                source of truth for shipped system state
```

Tokens are never deleted. If a concept is superseded, mark it
`DEPRECATED -> <new token>` so old reports remain legible.
