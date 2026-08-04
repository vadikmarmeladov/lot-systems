# LOT SYSTEMS — ASSEMBLY DOCTRINE
rev A

Distilled, stable principles, written increasingly in lexicon notation as
tokens are minted (see LOT-LEXICON.md). Doctrine compresses; session
reports (docs/LOT-SR-*.md) stay verbatim. Cite a clause instead of
restating its prose once it is folded here.

[D-001 rev A]  On repeated non-landing: a manifest STATUS of BEST does not
               mean SHIPPED, and a scheduled brief re-firing does not mean
               no prior session answered it. Before writing a new spec,
               check whether prior sessions on sibling/disposable branches
               already produced verified content for the same brief —
               `git log --all --oneline` across the branch family, not
               just the current branch's own history. If verified content
               exists, carry it forward (re-check its factual claims
               against the live tree, land it, cite it) instead of
               re-deriving a near-duplicate. Established by
               LOT-SR-20260804-01, which found the COSMO® Cube hardware-
               computer brief had produced spec documents on 20+ branches
               since 2026-05-26 with zero reaching master, because each
               session treated the manifest's stale "already shipped" note
               (docs/benchmark/LOT-MANIFEST.md) as ground truth without
               checking the remote.

[D-002 rev A]  PROVISIONAL — On GATE: no artifact advances past CHECK B
               while red; fix-loop until green, or execute PLAN B. This
               restates the pipeline's own cardinal rule
               (references/PIPELINE.md step 04) rather than distilling an
               observed recurrence — it has not yet been independently
               confirmed by a second session's finding, so it stays
               PROVISIONAL until one does.
