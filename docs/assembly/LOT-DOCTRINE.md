# LOT SYSTEMS — ASSEMBLY DOCTRINE
Distilled, stable principles written increasingly in lexicon notation.
Doctrine compresses; session reports (docs/benchmark/LOT-SR-*.md) stay
verbatim. A clause here supersedes prose explanation in the reports it
cites — future sessions cite the clause instead of re-explaining.

Revision: A
Bootstrapped on LOT-SR-20260802-01 (first Benchmark run to touch this file).

--------------------------------------------------------------------------------

[D-001 rev A]  On GATE for client-widget sessions with no local DB/CI: diff
               a saved `tsc --noEmit` baseline against the post-change run.
               Zero new errors + unchanged pre-existing count = GREEN, even
               when the repo carries pre-existing type errors unrelated to
               the session (marked PASS* in block 02/04 of the report).
               `npm run build` (esbuild, non-typechecking) passing is a
               separate, additional requirement — not a substitute for the
               diff. This pattern recurs verbatim across dozens of prior
               session reports (the PASS* convention, e.g. LOT-SR-20260602-01
               through LOT-SR-20260605-04 and on); this clause is its first
               formal statement in doctrine rather than restated prose.

================================================================================
