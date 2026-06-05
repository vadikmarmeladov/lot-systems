================================================================================
LOT SYSTEMS / SELF-ASSEMBLY MANIFEST
DOCUMENT: LOT-MANIFEST
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
DATE:     2026-06-05
================================================================================

Central catalog of all self-assembly routines across all branches.
Read this file to know what exists, what's ready, and what to ship.

STATUS KEY:
  DRAFT       — pushed but incomplete or untested
  READY       — complete, not yet benchmark-verified
  BEST        — best iteration among competing branches (ship candidate)
  STAGED      — cherry-picked to staging, awaiting green gate
  SHIPPED     — merged to master via benchmark pipeline
  SUPERSEDED  — replaced by a newer iteration
  DEAD        — empty or broken branch, safe to prune

================================================================================
01 // FEATURE ROUTINES (ship candidates)
================================================================================

FEATURE          | BEST BRANCH                   | HASH     | ITER  | STATUS | FILES | LINES  | SUMMARY
──────────────     ─────────────────────────────   ────────   ─────   ──────   ─────   ──────   ──────────────────────
LOT Mail         | relaxed-hamilton-eRBVA        | 5bdd004  | 8/8   | BEST   | 12    | +619   | In-app email: /email trigger, Sync inbox, reply, MailWidget, SSE delivery
Basics Tab       | nifty-allen-jWyOe            | 8b07ca9  | 6/6   | BEST   | 24    | +1725  | LOT-FM-001 ration subscription: 3-month build, ledger, roster, fulfillment
Calendar Alerts  | gifted-lovelace-cZOWR         | 978cf52  | 6/6   | BEST   | 3     | +359   | Live clock, T-minus countdown, military alert overlay, today panel
QI-46 Engine     | gracious-gauss-WnL0k         | a8a48c6  | 7/7   | BEST   | 6     | +1218  | Soul engine + vocabulary extractor, COSMO safety, Claude inference
COSMO Hardware   | dazzling-shannon-ykKT5        | 9da5f7a  | 9/9   | BEST   | 14    | +4099  | Full hardware spec, BOM, firmware, device API, PDF manual
Health/Security  | gallant-mayer-GqGA0           | 4559e48  | 35/35 | BEST   | 4     | +148   | Model upgrade, debug endpoint removal, degraded status fix
Badge RPG        | upbeat-faraday-xviFF          | 5fd4a8c  | 2/2   | BEST   | 4     | +1584  | 57 badges, Easter eggs, character classes, codex markdown
Self-Assembly v45| pensive-rubin-4jhgF           | 95d47fa  | 5/5   | BEST   | 8     | +677   | Patterns 63-66, Archetype 18, QOS Mode, Background Job 9
IntegrityWidget  | quantum-engine-widgets-RgFfC  | 696741a  | 1/1   | READY  | 3     | +479   | Lie detector: 6 fracture types, 4 views, intent contradiction analysis
Perf Optimization| quantum-engine-widgets-RgFfC  | 5126e09  | 1/1   | SHIPPED| 4     | +200   | Router isolation, subscription reduction, memoization
Bug Fixes        | quantum-engine-widgets-RgFfC  | d609978  | 1/1   | SHIPPED| 3     | +30    | Biofield lag fix, calendar whitelist fix, sync type widening

================================================================================
02 // SELF-ASSEMBLY ENGINE (loving-goldberg progression)
================================================================================

These are sequential daily sessions, not competing alternatives.
Each builds on the prior master state. Listed chronologically.

DATE       | BRANCH                        | VERSION | PATTERNS    | ARCHETYPES | KEY ADDITIONS
──────────   ─────────────────────────────   ───────   ───────────   ──────────   ─────────────────────────
2026-04-25 | loving-goldberg-D9gc1         | v7      | P22         | —          | engagement-resurgence
2026-04-27 | loving-goldberg-NSusw         | —       | —           | —          | OS journal field entries
2026-04-28 | loving-goldberg-oQx03         | v10     | —           | —          | JournalReflection + GoalJourney wiring
2026-04-29 | loving-goldberg-5ZaLB         | v11     | P26         | —          | Journal depth, calendar signal
2026-04-30 | loving-goldberg-dchFt         | v12     | P27-30      | —          | Physiological Cohort Classifier
2026-05-01 | loving-goldberg-ZbFQV         | v14     | —           | —          | Pattern clock, tier graph, temporal exposure
2026-05-03 | loving-goldberg-O7scc         | —       | —           | —          | Quantum Cube heartbeat + 4 widget integrations
2026-05-04 | loving-goldberg-Pv59P         | —       | —           | —          | Quantum Cube + feedback route fix
2026-05-05 | loving-goldberg-xtfBd         | v17-18  | P35         | 9          | QOS trend, reflection-velocity
2026-05-08 | loving-goldberg-Rk7PH         | —       | —           | —          | Transmission view + personal feedback
2026-05-09 | loving-goldberg-pOAYg         | —       | —           | —          | Surface JournalReflection, AwarenessDashboard, GoalJourney
2026-05-10 | loving-goldberg-xDb8O         | v22     | P40-41      | 12         | Cascade detection
2026-05-11 | loving-goldberg-CDVQS         | v24     | P42         | 13         | Deep work cascade
2026-05-12 | loving-goldberg-hxMn6         | v26     | P44         | 14         | Social resonance arc
2026-05-13 | loving-goldberg-a83St         | —       | —           | —          | Transmission view: LOT voice channel
2026-05-14 | loving-goldberg-ZJscH         | v28     | P46         | 16         | Temporal Coherence Window
2026-05-18 | loving-goldberg-GXnv2         | —       | —           | —          | Deployment refresh
2026-05-20 | loving-goldberg-VYMxu         | v35     | P51         | —          | Signal silence detection
2026-05-23 | loving-goldberg-vfBvt         | v39     | —           | —          | Personal language engine, vocab view
2026-05-24 | loving-goldberg-Be9WE         | —       | —           | —          | Voice layer, journal vocabulary
2026-05-25 | loving-goldberg-uBZpt         | v45     | —           | —          | Journal vocabulary engine, voice mirror
2026-05-26 | loving-goldberg-Gfw4G         | v44     | P59         | —          | Index-erosion, EROS handler

================================================================================
03 // REDUNDANT CLUSTERS (prune candidates)
================================================================================

CLUSTER          | COUNT | KEEP              | PRUNE | REASON
──────────────     ─────   ─────────────────   ─────   ────────────────────────
gallant-mayer    | 35    | GqGA0             | 34    | Same health check fix iterated 35 times
pensive-rubin    | 5     | 4jhgF             | 4     | Strict superset progression
relaxed-hamilton | 8     | eRBVA             | 7     | LOT Mail iterations
dazzling-shannon | 9     | ykKT5             | 8     | COSMO hardware iterations
gifted-lovelace  | 6     | cZOWR             | 5     | Calendar alert iterations
nifty-allen      | 5     | jWyOe             | 4     | Basics Tab iterations
gracious-gauss   | 7     | WnL0k             | 6     | QI-46 Engine iterations
upbeat-faraday   | 2     | xviFF             | 1     | Badge RPG iterations
──────────────────────────────────────────────────────────────────────
TOTAL PRUNABLE:  | 77    |                   | 69    |

================================================================================
04 // STANDALONE BRANCHES
================================================================================

BRANCH                              | STATUS     | SUMMARY
──────────────────────────────────    ──────────   ────────────────────────────────────
february-2025-updates-HZZTF        | LEGACY     | Early feature work (pre-benchmark era)
December_2025_upgrades              | DRAFT      | Mobile cleanup, Memory Engine dupe fix
continue-last-commit-gLJWJ         | DRAFT      | Font rendering, Mood timing, Block fix
debug-loading-screen                | DRAFT      | Cold-start docs, admin pagination
deploy-status-page                  | MERGED     | Button styling (merged via PR #10)
January-2026-updates-gLJWJ         | DEAD       | Empty — no commits beyond master
migrate-akamai-server-b5UUv        | DRAFT      | Akamai infrastructure migration scripts
review-master-commits               | DRAFT      | Profile debug guide, PWA cache
starting-n                          | MERGED     | Deployment branch + AM/PM fix (PR #10)
together-ai-update                  | DRAFT      | Critical: mobile boot, auth email, sound
eager-clarke-wTEM6                  | DRAFT      | Basics Tab alt design (Settings enrollment)

================================================================================
05 // STATISTICS
================================================================================

TOTAL REMOTE BRANCHES:     125
CLAUDE FEATURE BRANCHES:   115
SESSION CLUSTERS:          23
SHIP-READY FEATURES:       8
ALREADY SHIPPED:           3 (on quantum-engine-widgets-RgFfC → master)
PRUNABLE BRANCHES:         ~69
DEAD BRANCHES:             2 (January-2026, deploy-status-page already merged)

TOTAL LINES ACROSS BEST ITERATIONS:  ~11,000+
TOTAL ASSEMBLY LOG VERSIONS:         v5 → v49 (34 sessions)
QIE PATTERNS IMPLEMENTED:            65
PHYSIOLOGICAL ARCHETYPES:            18

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
END LOT-MANIFEST
================================================================================
