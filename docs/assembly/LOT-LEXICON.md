# LOT SYSTEMS — LEXICON

Evolving controlled vocabulary for the Benchmark self-assembly corpus. A
concept earns a token only after it has recurred in **3 or more** prior
session reports, or has been folded into doctrine twice (see
`LOT-DOCTRINE.md`). Tokens are never deleted; superseded tokens are marked
`DEPRECATED -> <new token>` so old reports stay legible.

This file is bootstrapped on 2026-08-10 (LOT-SR-20260810-01), the first
Benchmark run to use the `lot-benchmark` skill's ledger/lexicon/doctrine
triad on this repo. `docs/assembly/LOT-LEDGER.md` and the ~95 dated
`LOT-assembly_*.md` files already carry years of session history and an
extensive ad-hoc notation (QIE pattern IDs, archetype numbers, job numbers,
per-session badge-engine tokens like `QPCRYST:`, `TOTCOH:`, `RECINTEL:`).
That existing notation is the corpus's real lexicon in practice — this file
formalizes the subset that is stable across the whole project, not just
within one badge-engine arc. Mining the full historical archive into this
table is future work for later Benchmark sessions; seeding here is
deliberately conservative per the minting rule.

| TOKEN | MEANING                                                          | REV | SINCE           |
|-------|-------------------------------------------------------------------|-----|------------------|
| QIE   | Quantum Intent Engine — client-side pattern-recognition engine that infers user need from behavioral signals, zero server round-trip for the inference itself | A | LOT-SR-20260810-01 (recurs in every dated `LOT-assembly_qie-v*.md` since 2026-07) |
| ASM   | Self-Assembly module state — `getAssemblyState()`, tracks per-module density/phase toward full system assembly | A | LOT-SR-20260810-01 (recurs across `docs/assembly/*` and `System.tsx`) |
| GATE  | The CHECK-B green-gate decision point — no artifact advances past a red gate | A | LOT-SR-20260810-01 |
| ARCH-N | Archetype slot N in the QIE's physiological/behavioral archetype ladder (e.g. `Arch51`) | A | LOT-SR-20260810-01 (recurs across ledger entries 20260725→20260805) |
| J-N   | Job slot N in the QIE's background job ladder (e.g. `J48`) | A | LOT-SR-20260810-01 (recurs across ledger entries 20260725→20260805) |
| P-N   | Pattern slot N in the QIE's recognized-pattern ladder (e.g. `P149`) | A | LOT-SR-20260810-01 (recurs across ledger entries 20260725→20260805) |

REV column reflects the doctrine revision in force when the token entered
(see `LOT-DOCTRINE.md`, currently rev A).
