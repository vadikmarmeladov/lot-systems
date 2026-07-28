# LOT SYSTEMS — LEXICON
Evolving controlled vocabulary. A token is minted only once a concept has
recurred 3+ times in prior session reports, or been folded into doctrine
twice (see docs/assembly/../benchmark's SELF-ASSEMBLY doctrine for the rule).
Tokens are never deleted; superseded tokens are marked DEPRECATED -> <new>.

NOTE (LOT-SR-20260728-01): a longer-running lexicon and doctrine already
exist at `docs/benchmark/LOT-LEXICON.md` and `docs/benchmark/LOT-DOCTRINE.md`
(established 2026-06, ~75-230 lines each). This file is a same-session
bootstrap of `docs/assembly/` — the path this skill's orient step checks —
seeded only with tokens already recurring in the live repo. The two
vocabularies are NOT yet reconciled; a future session should either merge
them or make one canonical and point the other here. Recorded honestly
rather than silently forked further.

```
TOKEN     MEANING                                                     REV    SINCE
-----     -------                                                     ---    -----
QIE       Quantum Intention Engine — client-side signal capture,      A      LOT-SR-20260601-01
          pattern recognition, and archetype classification system
          (src/client/stores/intentionEngine.ts)
GATE      The CHECK-B green-gate decision point: no artifact          A      LOT-SR-20260601-01
          advances past a red build. Fix-loop or Plan-B only.
QOS       Quantum OS — versioned, aggregate snapshot of a user's      A      LOT-SR-20260605-02
          assembly progress, archetype, biofield ATP, and cohort
ATP       Bio-energy metric — the user's current energy reading as    A      LOT-SR-20260607-04
          surfaced in the Biofield/Quantum State table (quantumState.energy)
COHORT    Physiological cohort — live archetype classification        A      LOT-SR-20260601-01
          derived from recent signal state (classifyPhysiologicalCohort)
```
