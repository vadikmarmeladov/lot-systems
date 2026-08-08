# LOT SYSTEMS — ASSEMBLY LEXICON
Evolving controlled vocabulary for LOT-BENCHMARK session reports. A concept
earns a token only after recurring in 3+ prior session reports, or being
folded into doctrine twice (see docs/assembly/LOT-DOCTRINE.md and the
minting rule in the lot-benchmark skill's SELF-ASSEMBLY.md). Tokens are
never deleted; superseded tokens are marked DEPRECATED -> <new token>.

Bootstrapped 2026-08-08 (first LOT-BENCHMARK-skill run on this repo). Seeded
with one token that already recurs across the pre-existing docs/LOT-SR-*.md
corpus (a distinct, informal report lineage that predates this skill and
never formalized its own lexicon file). No other prior term was minted
retroactively — the rest of that lineage's dense in-report notation
(Arch##, J##, P###, per-session codes like QPCRYST/TOTCOH/RECINTEL) belongs
to that lineage's own reports and is not re-litigated here; only what
plainly recurs system-wide, independent of any single session's coinage,
is seeded.

| TOKEN | MEANING                                                      | REV | SINCE          |
|-------|---------------------------------------------------------------|-----|----------------|
| QIE   | Quantum Intent Engine (client-side pattern/signal engine,     | A   | pre-existing — |
|       | src/client/stores/intentionEngine.ts)                          |     | recurs in 40+  |
|       |                                                                 |     | prior reports  |

No further tokens minted this session. D1/D2/D3 (see LOT-SR-20260808-01)
are one-off findings, not yet-recurring concepts — held in prose in the
session report and doctrine clause D-001, not compressed into notation
before they've earned it.
