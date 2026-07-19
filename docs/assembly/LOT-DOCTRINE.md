LOT SYSTEMS — SELF-ASSEMBLY DOCTRINE
================================================================================
rev A

Distilled, stable principles, written increasingly in lexicon notation as the
lexicon earns tokens. Doctrine compresses; session reports (docs/benchmark/)
stay verbatim. No clauses yet — this is the bootstrap revision, first run of
the ledger/lexicon/doctrine mechanism (session 20260719-01). Clauses fold in
once a finding is confirmed stable across 2+ sessions per SELF-ASSEMBLY.md; a
single session's findings are recorded in its own report, not decreed into
doctrine prematurely.

Candidate for future folding (observed once, 20260719-01, not yet doctrine):
  the root .gitignore's bare `server/` pattern (line 50, intended for compiled
  output) has no leading slash and therefore also matches src/server/ — new
  files placed under src/server/ are silently untracked by `git add -A` and
  require `git add -f`. If a second session independently rediscovers this,
  fold it into a doctrine clause on repo-hygiene / gitignore anchoring.
