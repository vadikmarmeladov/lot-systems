LOT SYSTEMS — SELF-ASSEMBLY LEDGER
================================================================================
Append-only index of every Benchmark run, ever. One line per run. Lines are
NEVER edited or reordered after being written — this file is the spine that
lets any future session, or a Plan-B rollback, locate the verbatim record of
any past run in docs/benchmark/LOT-SR-<id>.md.

Format:
YYYYMMDD-NN | <CLASS> | <one-line summary> | <result> | <commit-hash> | ratio X.X:1
--------------------------------------------------------------------------------
20260719-01 | ENGINEERING | Build LOT Email: /email command in Log, Sync delivery via SSE, community-ready recipient resolution | GREEN | (assigned after commit — see docs/benchmark/LOT-SR-20260719-01.md) | ratio 1.0:1
