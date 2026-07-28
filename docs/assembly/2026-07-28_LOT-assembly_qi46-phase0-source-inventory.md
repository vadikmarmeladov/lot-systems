# QI·46 — Phase 0 · Source Inventory (Step 0.1)

Date: 2026-07-28
Session: LOT-SR-20260728-01
Author: Vadik (S-2) — session executed by Claude Code, LOT self-assembly protocol
Spec reference: `docs/corporate/LOT_QI46_ENGINE.md` — Phase 0, Step 0.1

---

## Scope of this artifact

`LOT_QI46_ENGINE.md` § III/IV lays out a 5-phase self-assembly plan for the
QI·46 engine, running Q3 2026 (Phase 0 — Corpus Assembly) through Q3 2027
(Phase 4 — External Licensing). This document begins Phase 0, Step 0.1
(Source Inventory) honestly, against the repository as it actually exists
today — no more, no less.

**What this document is:** a catalogue mapping the spec's proposed
`/corpus/*` categories onto real, existing repository artifacts (docs and
source files already in this repo, already reviewed/shipped through prior
Benchmark cycles).

**What this document is not:** a fine-tuning corpus, a subscriber data
export, or a claim that training has begun. This session has no access to
production subscriber data, no provisioned training infrastructure, and no
S-2 sign-off on the corpus sample per Checkpoint 0's requirement ("Vadik
review: corpus sample approved — minimum 100 random examples reviewed").
Steps 0.2 (tagging real subscriber content) and Phase 1 (fine-tuning run)
require that live data access and infrastructure decision explicitly, in a
session where S-2 is present — they are correctly out of scope for an
unattended run and are deferred, not skipped silently.

---

## Source inventory — spec category → live repo mapping

```
SOURCE INVENTORY (Step 0.1 — real repo mapping)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/corpus/institute/     docs/corporate/         26 documents
                        White papers: CQGS, Quantum Cube, QI·46 spec itself,
                        LOT-AI-PRODUCT-BRIEF, LOT-AMBIENT-AI-VISION, etc.

/corpus/brand/          docs/technical/         30 documents
                        LOT-STYLE-GUIDE, Terminal Grid conventions,
                        AI-ENGINE-GUIDE, INTERFACE_EVOLUTION
                        docs/wiki/              28 documents (LOT-WIKI-v55..v82)
                        Field Manual voice history, session-by-session

/corpus/bioelectric/    docs/corporate/ subset  (LOT_ROBOTICS_COSMO,
                        LOT-CUBIQ-QUANTUM-CUBE-v0, LOT-CUBIQ-VISION,
                        LOT-CUBIQ-OPERATOR, LOT-NODE-0-RIG-SPEC)

/corpus/platform/       src/client/components/  17 components reference
                        "journal" (JournalReflection.tsx, GoalJourneyWidget,
                        PlannerWidget, etc.) — these are the CODE that
                        produces subscriber journal data at runtime, not a
                        corpus of that data itself. Actual subscriber
                        journal content lives in production PostgreSQL and
                        is NOT accessible from this session.

/corpus/cosmo/          194 source files reference cosmo/COSMO across
                        src/client + src/server — again, this is the
                        CODE implementing the COSMO detection/FAX/audit
                        pipeline, not an exported log corpus.

/corpus/consumables/    No dedicated source found. Sock/toothbrush/Quantum
                        Cube consumable feedback records are referenced in
                        the spec as a target category but no corresponding
                        collection mechanism exists yet in src/. Flagged
                        as a gap for a future ENGINEERING session, not
                        filled here.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Assessment against Checkpoint 0

```
[x] All sources inventoried and catalogued            — this document
[ ] All documents tagged per schema                    — deferred (0.2)
[ ] COSMO cleared: true on all training examples        — deferred (0.2)
[ ] Corpus size > 10,000 training pairs                 — deferred (needs
                                                            live subscriber
                                                            data access)
[ ] JSONL format validated                              — deferred (0.3)
[ ] Vadik review: corpus sample approved                — requires S-2
                                                            live session
```

Checkpoint 0 does not pass this session — correctly. Step 0.1 is complete;
0.2/0.3 are gated on data access and S-2 review this session does not have.

## Next session

Step 0.2 (tagging schema) can begin once S-2 designates which of the
`docs/` sources above are cleared for corpus inclusion, and whether platform
journal/COSMO data should be sampled from production or left out of v0.1
entirely (bootstrapping the corpus from LOT® institute/brand docs alone is a
legitimate, smaller-scope Phase 0 path — worth a decision, not an
assumption).
