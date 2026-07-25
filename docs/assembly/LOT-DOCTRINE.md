<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-DOCTRINE (lot-benchmark ledger)

Revision: A

Distilled, stable principles for `lot-benchmark` skill runs, written in current
LEXICON notation as they earn their place. This file tracks doctrine specific to
this skill's own ledger (`LOT-LEDGER.md`) — it does not supersede or duplicate
the repository's pre-existing product doctrine at `docs/wiki/LOT-WIKI-v78.md`
section 21 ("LOT-DOCTRINE Revision J", 10 clauses + engineering doctrines),
which remains the authoritative product-level doctrine. Clauses here are about
how this specific benchmark protocol should operate over time.

No clause below has yet crossed the fold-in threshold (a finding confirmed
stable across 2+ session reports). This file opens with one PROVISIONAL entry
from the first session — an observation, not yet doctrine.

```
[D-001 rev A · PROVISIONAL]  EVENT-STRING DRIFT CLASS. A backend log query that
    filters on a literal event-string value (`l.event === '...'`) is only as
    correct as its agreement with the actual LogEvent union
    (src/shared/types/index.ts) and the real values Log.create() call sites
    write (grep `event: '...'` across src/server before trusting a filter).
    SR-20260725-01 found POST /story filtering on five event values that were
    never written anywhere in the codebase, silently degrading the compressed
    story to mood-only data. Not yet folded into standing doctrine — this is
    one occurrence. If a future session finds the same class of bug again,
    fold as: "Any new log-event filter must be verified against a live grep of
    `event: '<value>'` writers before it ships."
```

Supersedes: none yet. Cites: SR-20260725-01.
