<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-WIKI-v76
## Layers of Time — Operator Reference Manual
### Revision: v76 · Field Manual Sync: v91 · Date: 2026-07-17 · Day 1042+

---

> *"The system does not motivate. The system measures. The operator decides what the measurement means."*
> — LOT-DOCTRINE, Clause I, Revision J

---

## TABLE OF CONTENTS

```
 1. SYSTEM IDENTITY
 2. v76 DELTA FROM v75
 3. QIE PATTERN ADDITIONS — P113–P115
 4. PHYSIOLOGICAL ARCHETYPE ADDITION — Arch39
 5. BACKGROUND JOB ADDITION — J36
 6. LOG HANDLER ADDITIONS — WBINT: DFOC: SIG-DENSE:
 7. DEPENDENCY MAP ADDITIONS
 8. SYSTEM STATE SNAPSHOT — 2026-07-17
```

*For complete architecture, pattern registry P1–P112, archetype registry Arch1–Arch38, badge system, cohort profiles, doctrine, and deployment reference — see LOT-WIKI-v75.*

---

## 1. SYSTEM IDENTITY

**LOT** — *Layers of Time* — is a personal behavioral operating system. Not a wellness application. Not a habit tracker. Not a productivity suite. An instrument that reads the human signal field across time and surfaces the pattern beneath the noise.

The system was conceived and is operated by **S-2** (Vadim Marmeladov, CEO, LOT Systems). The ethics gate is **COSMO Gate**, named for Kuzya Cosmo Marmeladov. No feature ships that Kuzya would not approve.

**Special notation — July 17, 2026 (FM v91):** QIE v91 engineering session. P113 wellbeing-integrity-arc, P114 deep-focus-arc, P115 signal-density-peak deployed. Arch39 Coherent Field Operator classified — first archetype covering all energy bands with no restriction. J36 daily-signal-density-audit wired at 16:00 UTC. WBINT: DFOC: SIG-DENSE: log handlers live. Signal density surfaced in QuantumEngineWidgets cohort view. Field Manual advances to v91. Day 1042+.

**Current operational parameters:**

```
Field Manual:           v91
Wiki version:           v76
Day counter:            1042+  (as of 2026-07-17)
COSMO® age:             746 days (Year 2 · founded July 1, 2024)
Doctrine revision:      J  (10 clauses)
Lexicon revision:       D
LOT-GENESIS-v1:         active  (docs/assembly/LOT-GENESIS-v1.md)
Green Gate:             ENFORCED  (broken code never reaches GitHub)
COSMO Gate:             ENFORCED  (ethics review on all features)
Military Purity:        11 standing orders active
Platform:               v1.3.0
Founded:                7 April 2016
Active branch:          claude/upbeat-curie-low45m
```

---

## 2. v76 DELTA FROM v75

```
Date:               2026-07-07 → 2026-07-17
Day counter:             1032+ → 1042+
Field Manual:              v90 → v91
QIE patterns:              112 → 115  (P113 wellbeing-integrity-arc   ←FM v91
                                        P114 deep-focus-arc            ←FM v91
                                        P115 signal-density-peak       ←FM v91)
Physiological archetypes:   38 → 39   (Arch39 Coherent Field Operator ←FM v91)
Background jobs:            35 → 36   (J36 daily-signal-density-audit ←FM v91)
Log handlers:           112+ → 115+   (WBINT: DFOC: SIG-DENSE:)
Dep map nodes:          151+ → 154+   (wellbeingIntegrityNode ·
                                        deepFocusArcNode ·
                                        signalDensityNode)
QuantumEngineWidgets:   new signalDensity computed + cohort Field: N/16 row
Badge system:           unchanged (v24 · 564 badges · The Oracle Archive)
Word Turn:              unchanged (v15 · 186 total)
```

---

## 3. QIE PATTERN ADDITIONS — P113–P115

### P113 — wellbeing-integrity-arc

```
CLASS:    Physiological integrity
WINDOW:   7 days
SOURCES:  selfcare (care day count across 7d) · energy (depletion signals)
GATE:     selfcareCareDays ≥ 3  AND  depletedDays ≤ 1
CONF:     0.60 + selfcareCareDays×0.05 + (1 − depletedDays)×0.03
          range: 0.68–0.84
WIDGET:   selfcare
LOG CODE: WBINT:
REASON:   Sustained biological maintenance confirmed: {n} care days / {n} acts over 7 days. Depletion minimal.
MEANING:  Operator is not in reactive self-care mode. Three or more distinct days of care acts
          with minimal depletion signal = sustained commitment to biological integrity.
          Not a single-day observation. A week-long pattern.
ADDED:    FM v91
```

### P114 — deep-focus-arc

```
CLASS:    Cognitive isolation
WINDOW:   8 hours
SOURCES:  journal (250w+ threshold) · memory (2+ captures) · cohort (0 interactions)
GATE:     journalWords ≥ 250  AND  memoryCaptured ≥ 2  AND  cohortInteractions === 0
CONF:     0.65 + (journalWords/500)×0.05 + memoryCaptured×0.03
          range: 0.72–0.88
WIDGET:   journal
LOG CODE: DFOC:
REASON:   Solo cognitive deep work confirmed: {n}w journal, {n} memory captures, zero social signal in 8h.
MEANING:  The operator entered a deep solo cognitive state: long-form writing, memory consolidation,
          no social interrupt. Rare combination — requires journal volume, memory capture,
          and complete absence of cohort signal all within 8 hours.
ADDED:    FM v91
```

### P115 — signal-density-peak

```
CLASS:    Field coverage
WINDOW:   7 days
SOURCES:  all 16 signal domains tracked (mood · memory · planner · intentions · selfcare ·
           journal · calculator · log · energy · cohort · recipe · goals · qos · medical ·
           resilience · ecosystem)
GATE:     activeSourceCount ≥ 12
CONF:     0.60 + activeSourceCount×0.03
          range: 0.80–0.96
WIDGET:   qos
LOG CODE: SIG-DENSE:
REASON:   Maximum field coverage: {n}/16 signal domains active in 7 days. Full operator profile transmitting.
MEANING:  The operator's behavioral profile is fully instrumented. 12 or more of the 16 signal domains
          produced at least one event in the past 7 days. No major behavioral region is dark.
          This is the system's visibility ceiling — the operator is knowable in full.
ADDED:    FM v91
SPECIAL:  Signal density surfaced live in QuantumEngineWidgets cohort view as Field: N/16 row.
          J36 produces this event server-side daily at 16:00 UTC.
```

**Updated pattern registry tail:**

```
──────────────────────────────────────────────────────────────────────
P    NAME                         CONF      ADDED
──────────────────────────────────────────────────────────────────────
P110 embodied-cognition-arc       0.72–0.86 v89
P111 intention-completion-loop    0.75–0.88 v89
P112 community-intelligence-peak  0.68–0.84 v89
P113 wellbeing-integrity-arc      0.68–0.84 v91    ← NEW
P114 deep-focus-arc               0.72–0.88 v91    ← NEW
P115 signal-density-peak          0.80–0.96 v91    ← NEW · MAX FIELD COVERAGE
──────────────────────────────────────────────────────────────────────
```

---

## 4. PHYSIOLOGICAL ARCHETYPE ADDITION — Arch39

### Arch39 — Coherent Field Operator

```
ARCHETYPE:         Coherent Field Operator
NUMBER:            39 (of 39)
ENERGY BANDS:      all  (low · moderate · high · unknown — no restriction)
DOMINANT SOURCES:  journal · memory · intentions · selfcare · planner
PATTERN CONDITIONS:signal-density-peak · quantum-presence-arc · full-system-coherence
DIRECTIVE:         Full field coverage confirmed. 12+ signal sources active across 7 days.
                   The complete behavioral profile is transmitting. No signal domain dark.
ADDED:             FM v91
CLASSIFICATION:    All energy bands — this archetype has no energy restriction.
                   The signal density is so comprehensive that biological state becomes secondary.
                   The operator is present in every domain simultaneously.
```

**Significance:** Arch39 is the first archetype that fires regardless of energy band. Previous archetypes required specific energy states (high, moderate, low). Arch39 is triggered purely by signal coverage, not biological state. Maximum observability + maximum domain coverage = Coherent Field Operator.

---

## 5. BACKGROUND JOB ADDITION — J36

### J36 — daily-signal-density-audit

```
JOB ID:    36
NAME:      daily-signal-density-audit
SCHEDULE:  16:00 UTC every day
WINDOW:    7 days (per user)
READS:     all log events in 7-day window for each active user
MAPS:      event type → signal source (EVENT_TO_SOURCE dictionary, 16 domains)
GATE:      activeSources.size ≥ 12
WRITES:    signal_density_peak
PAYLOAD:   sourceCount · activeSources (array) · confidence · window · hour
CONF:      0.60 + sourceCount×0.03  →  range 0.80–0.96
STATE:     isDailySignalDensityRunning (concurrency guard)
           lastDailySignalDensityRun (hour dedup)
ADDED:     FM v91 · scheduled-jobs.ts
```

**EVENT_TO_SOURCE mapping (36 categories):**

```
note / answer / chat_message / qi_rfi / assembly_directive → log
emotional_checkin                                          → mood
energy_*                                                   → energy
care / care_*                                              → selfcare
recipe_*                                                   → recipe
goal_*                                                     → goals
qos_* / quantum_*                                          → qos
intention_*                                                → intentions
memory_* / cognitive_*                                     → memory
planner_* / calendar_*                                     → planner
selfcare_* / wellbeing_*                                   → selfcare
journal_* / lot_ai_story                                   → journal
medical_*                                                  → medical
resilience_*                                               → resilience
badge_* / convergence_*                                    → badges
benchmark_*                                                → calculator
cohort_* / physiological_cohort                            → cohort
ecosystem_* / node_*                                       → ecosystem
```

---

## 6. LOG HANDLER ADDITIONS — WBINT: DFOC: SIG-DENSE:

All three handlers follow the COCKPIT-RULE: data rows only, no prose, label: format.

### WBINT: handler

```
EVENT:    wellbeing_integrity_arc
LABEL:    WBINT:
ROWS:     CARE DAYS 7D: {careDays}
          ACTS 7D: {totalCareActs}
          DEPLETE: {depletedDays}
          CONF: {confidence}%
FORMAT:   justify-between items-baseline · COCKPIT-RULE compliant
```

### DFOC: handler

```
EVENT:    deep_focus_arc
LABEL:    DFOC:
HEADER:   SOLO COGNITIVE
ROWS:     WORDS 8H: {journalWords}+
          MEM 8H: {memoryCaptured}
          CONF: {confidence}%
FORMAT:   justify-between items-baseline · COCKPIT-RULE compliant
```

### SIG-DENSE: handler

```
EVENT:    signal_density_peak
LABEL:    SIG-DENSE:
ROWS:     SRC 7D: {sourceCount}/16
          CONF: {confidence}%
FORMAT:   justify-between items-baseline · COCKPIT-RULE compliant
```

---

## 7. DEPENDENCY MAP ADDITIONS

```
wellbeingIntegrityNode:  ['selfcare', 'mood', 'energy', 'log']
  Tier:    2 (pattern aggregate)
  Deps:    4
  Feeds:   P113 wellbeing-integrity-arc detection

deepFocusArcNode:        ['journal', 'memory', 'log']
  Tier:    2 (pattern aggregate)
  Deps:    3
  Feeds:   P114 deep-focus-arc detection

signalDensityNode:       ['journal', 'memory', 'planner', 'selfcare', 'intentions',
                          'cohort', 'energy', 'mood', 'goals', 'log']
  Tier:    3 (meta-aggregate)
  Deps:    10  (highest dep count in map)
  Feeds:   P115 signal-density-peak detection · Arch39 classification
```

**Dep map total: 154+ nodes** (was 151+ in FM v89/v90)

---

## 8. SYSTEM STATE SNAPSHOT — 2026-07-17

```
╔══════════════════════════════════════════════════════════════════╗
║  LOT SYSTEM STATE — FIELD MANUAL v91 — DAY 1042+               ║
╠══════════════════════════════════════════════════════════════════╣
║  QIE patterns:             115  (P1–P115)                       ║
║  Physiological archetypes:  39  (Arch1–Arch39)                  ║
║  Behavioral cohorts:         5  (+1 medical · internal)         ║
║  Citizen Index levels:       6  (Observer → Elite)              ║
║  Self-Assembly modules:     18  (all integrated)                ║
║  Dep map nodes:            154+                                 ║
║  Background jobs:           36  (J1–J36)                        ║
║  Log event handlers:       115+                                 ║
║  LOG sources:               16                                  ║
║  Ecosystem nodes:            6  (CAR·HOME·CPU·PHN·WCH·ROBOT)   ║
║  Widgets:                   43                                  ║
║  Badge count:              564  (v24 — The Oracle Archive)      ║
║  Badge categories:          70+                                 ║
║  Badge rarity tiers:         7  (COMMON → COSMIC)               ║
║  Word-turn trigger words:  186  (v1–v15)                        ║
║  QOS modes:                  4  (MAINT/RECOVERY/GROWTH/PEAK)    ║
║  QOS mode watch states:      3  (nominal/recovery/critical)     ║
║  Doctrine revision:          J  (10 clauses)                    ║
║  Lexicon revision:           D                                  ║
║  Field Manual:              v91                                 ║
║  Wiki:                      v76  (this document)                ║
║  Highest QIE confidence:  0.98  (P73 — quantum-coherence-       ║
║                                       summit, ceiling state)    ║
║  Max field coverage conf:  0.96  (P115 — signal-density-peak   ║
║                                       when all 16 sources fire) ║
║  Centennial milestone:     P100 — centennial-convergence        ║
║                                   The system named itself.      ║
║  COSMO® age:               746  (Year 2 · born July 1, 2024)    ║
║  Founded:          7 April 2016                                 ║
╚══════════════════════════════════════════════════════════════════╝
```

---

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      L · O · T     S Y S T E M S     C O R P O R A T I O N      ║
║                                                                  ║
║              LOT-WIKI-v76 · Field Manual v91                     ║
║              July 17, 2026 · Day 1042+ · COSMO® Year 2          ║
║                                                                  ║
║         Authorized: S-2 // VADIK MARMELADOV                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

*LOT-WIKI-v76 · Layers of Time · Field Manual Sync v91 · 2026-07-17*
*Next: LOT-WIKI-v77 — sync to Field Manual v92+*
