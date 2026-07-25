================================================================================
LOT SYSTEMS / SELF-ASSEMBLY DOCTRINE
DOCUMENT: LOT-DOCTRINE
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
REV:      A
================================================================================

Distilled, stable principles written increasingly in lexicon notation. This
file compresses over time — findings confirmed stable across multiple
sessions get folded in here as dense clauses, and future reports cite the
clause instead of restating the finding in prose.

This is the first bootstrap of this file (rev A). No clause has yet crossed
the stability bar (confirmed in 2+ independent sessions), so nothing below
is canonical doctrine yet. One clause is recorded PROVISIONAL — a finding
from this session worth watching, not yet earned.

--------------------------------------------------------------------------------
DOCTRINE CLAUSES
--------------------------------------------------------------------------------
[D-001 rev A, PROVISIONAL]
Before implementing a requested feature, check docs/benchmark/LOT-MANIFEST.md
for an existing BEST/READY iteration of the same feature on a sibling branch.
Port the scoped implementation commit forward (cherry-pick + conflict
resolution against current master) rather than reimplementing from scratch.
Reduces redundant "determined-turing"-style branch proliferation and keeps
the self-assembly catalog honest about what already exists.
Observed once: SR-20260725-01 (LOT Mail — ported from stale branch
determined-turing-f6bw7r, commit 19f7906e, onto current master after 5 weeks
of drift; 3 files needed manual conflict resolution, 9 files auto-merged
clean). Needs a second independent confirmation before promotion to
canonical doctrine.
