LOT SYSTEMS — SELF-ASSEMBLY LEXICON
================================================================================
Evolving controlled vocabulary. A concept earns a token only after it has
appeared in 3 or more prior session reports OR has been folded into doctrine
twice (see docs/assembly/LOT-DOCTRINE.md, SELF-ASSEMBLY.md minting rule).
Tokens are never deleted; a superseded token is marked DEPRECATED -> <new>.

TOKEN     MEANING                                              REV    SINCE
-----     -------                                              ---    -----
(none minted yet — bootstrap session, see note below)

--------------------------------------------------------------------------------
NOTE — bootstrap session (20260719-01)

This is the first run of the LOT-LEDGER / LOT-LEXICON / LOT-DOCTRINE mechanism
for this repository; no prior formal lexicon existed to inherit from, so no
tokens are seeded here. Per the minting rule, tokens are earned from usage, not
decreed — nothing in this session recurred 3+ times, so nothing mints yet.

Flag for a future session: prior commit history shows dense ad-hoc notation
already in informal use before this mechanism existed (e.g. commit 8466b1b
"BENCHMARK: ENGINEERING — QIE v95 P113-P115 - Arch39 - J36 - PPEAK/RMOM/INCEP
- 154+ dep nodes [VM]"). Those tokens (QIE, Arch39, J36, PPEAK, RMOM, INCEP,
etc.) were NOT audited against the 3-occurrence threshold in this session —
doing so honestly requires mining the 77 existing docs/benchmark/*.md reports,
which this session did not have scope to do. A future Benchmark run should mine
that corpus and backfill any token that clears the threshold, citing the
sessions it recurred in under SINCE.
