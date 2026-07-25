<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-LEDGER

Append-only index of every LOT BENCHMARK cycle run via the `lot-benchmark` skill.
One line per benchmark, ever. Never edited, never reordered. This is the spine
that lets any future session, or a Plan-B rollback, locate the verbatim record
of any past run in `docs/LOT-SR-*.md`.

This ledger is distinct from — and does not replace — the repo's pre-existing,
richer self-assembly record under `docs/assembly/*.md` (dated session notes) and
`docs/wiki/LOT-WIKI-vNN.md` (the operator reference manual + LOT-DOCTRINE Revision
J). It tracks specifically the runs of this skill.

Format:

```
YYYYMMDD-NN | <CLASS> | <one-line summary> | <result> | <commit-hash> | ratio X.X:1
```

---

20260725-01 | ENGINEERING | Fixed dead event-filters in POST /story (log_entry/journal/memory_answer/self_care_checkin/energy_checkin never written anywhere; real values are 'note'/'answer') so the compressed story actually draws from journal + Memory data; wired orphaned /sil trigger as alias of /silent instead of leaving it dead | GREEN | <filled after commit> | ratio n/a (baseline session)
