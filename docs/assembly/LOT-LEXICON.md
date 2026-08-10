<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-LEXICON — Controlled Vocabulary

Evolving, append-only-per-entry token registry for the LOT Benchmark self-assembly
corpus. A token is minted only after its concept has recurred in 3+ prior session
reports or been folded into doctrine twice (see `SELF-ASSEMBLY.md`). Tokens are
never deleted — superseded tokens are marked `DEPRECATED -> <new token>`.

This file did not exist before session `LOT-SR-20260810-01`. It is bootstrapped
here, seeded only with tokens that already demonstrably recur in the existing
`docs/LOT-SR-*.md` corpus — no vocabulary is invented at bootstrap.

```
TOKEN     MEANING                                                    REV    SINCE
-----     -------                                                    ---    -----
QIE       Quantum Intention Engine — client-side signal/pattern      A      20260810-01
          engine (src/client/stores/intentionEngine.ts) driving
          widget visibility, patterns, and archetype state. Recurs
          in 5+ prior LOT-SR reports (e.g. 20260801-01, 20260802-01,
          20260803-01, 20260804-02).
GATE      The CHECK-B green-gate decision point: no artifact         A      20260810-01
          advances past CHECK B while red. Recurs in 3+ prior
          LOT-SR reports (20260727-02, 20260801-01, 20260805-01,
          as "GREEN GATE: PASS").
```

## Provisional watch-list (not yet minted)

Concepts observed once in this session, held as prose until they recur:

```
CONCEPT                          WHERE OBSERVED
-------                          --------------
WIDGET-PERF                      window.__LOT_WIDGET_PERF__ mount-timing map
                                  (WidgetErrorBoundary), 50ms warn threshold.
LOG-CTX                          getLogContext() aggregation over the single
                                  generic `logs` table — the platform's one
                                  interaction/context ledger.
```
