# LOT SYSTEMS — ASSEMBLY LEXICON
Evolving controlled vocabulary. A concept earns a token only after it has
recurred in 3+ prior session reports/docs, or been folded into doctrine
twice (see docs/assembly/LOT-DOCTRINE.md, SELF-ASSEMBLY.md). Tokens are
never deleted — superseded tokens are marked DEPRECATED -> <new token>.

Bootstrapped LOT-SR-20260804-01. Seeded only with tokens already recurring
in the live repo corpus at bootstrap time (docs/assembly/, docs/benchmark/)
— no vocabulary invented ahead of usage.

TOKEN     MEANING                                                REV    SINCE
-----     -------                                                ---    -----
GATE      CHECK-B green-gate decision point (no red push;         A      LOT-SR-20260601-01
          fix-loop or PLAN-B rollback)
INTARC    Integrated Signal Arc — P134, cross-channel signal       A      LOT-SR-20260726-01
          integration pattern
DREC      Deep Recovery Protocol — P135, sustained-recovery        A      LOT-SR-20260726-01
          detection pattern
QFIELD    Quantum Field Alignment — P136, multi-module field-      A      LOT-SR-20260726-01
          alignment pattern
