<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT-WIKI-v67
## Layers of Time — Operator Reference Manual
### Revision: v67 · Field Manual Sync: v74 · Date: 2026-06-28 · Day 1024+

---

> *"The system does not motivate. The system measures. The operator decides what the measurement means."*
> — LOT-DOCTRINE, Clause I, Revision M

---

## TABLE OF CONTENTS

```
 1. SYSTEM IDENTITY
 2. CORE ARCHITECTURE
 3. QUANTUM INTENT ENGINE (QIE)
 4. QIE PATTERN REGISTRY — P1–P90
 5. QUANTUM OPERATING SYSTEM (QOS)
 6. PHYSIOLOGICAL ARCHETYPES — 30 TYPES
 7. BEHAVIORAL COHORTS — FULL PROFILES
 8. CITIZEN INDEX
 9. MEMORY ENGINE
10. SELF-ASSEMBLY ENGINE
11. BACKGROUND JOB SCHEDULER
12. LOG EVENT SYSTEM
13. ECOSYSTEM NODE MAP
14. BADGE SYSTEM v19 — THE QUANTUM PROTOCOL
15. BADGE CATEGORY INDEX
16. WORD TURN ENGINE — COMPLETE LEXICON v10
17. DISPLAY ARCHITECTURE
18. DENSITY TIER SYSTEM
19. OPACITY HIERARCHY
20. COCKPIT RULE
21. LOT-DOCTRINE (Revision M)
22. FIELD MANUAL (About.tsx)
23. DEPLOYMENT & STACK
24. LOT-GENESIS-v1
25. CUBIQ™ — THE QUANTUM CUBIC EXPERIENCE
26. VOCABULARY INDEX — EXPANDED
27. SYSTEM STATE SNAPSHOT
```

---

## 1. SYSTEM IDENTITY

**LOT** — *Layers of Time* — is a personal behavioral operating system. Not a wellness application. Not a habit tracker. Not a productivity suite. An instrument that reads the human signal field across time and surfaces the pattern beneath the noise.

The system was conceived and is operated by **S-2** (Vadim Marmeladov, CEO, LOT Systems). The ethics gate is **COSMO Gate**, named for Kuzya Cosmo Marmeladov. No feature ships that Kuzya would not approve.

**Current operational parameters:**

```
Field Manual:           v74
Wiki version:           v67
Day counter:            1024+  (as of 2026-06-28)
Doctrine revision:      M  (11 clauses)
Lexicon revision:       C
LOT-GENESIS-v1:         active  (docs/assembly/LOT-GENESIS-v1.md)
Green Gate:             ENFORCED  (broken code never reaches GitHub)
COSMO Gate:             ENFORCED  (ethics review on all features)
Military Purity:        11 standing orders active
Platform:               v1.3.0
Founded:                7 April 2016
Active branch:          claude/upbeat-curie-y9086k
```

**v67 Delta from v66:**

```
Date:               2026-06-27 → 2026-06-28
Field Manual:       v73 → v74
QIE Patterns:       86 → 90  (+4: P87 P88 P89 P90)
Archetypes:         29 → 30  (+1: Restorative Architect)
Background Jobs:    23 → 25  (+2: Job 24 LOT AI Story · Job 25 restoration-arc-check)
Log Handlers:       85+ → 88+  (+3: RESTORE: CIRC-ARC: MEM-BRIDGE:)
Dep Map Nodes:      126+ → 130+  (+4: restorationArcNode circadianCoherenceNode
                                      memoryIntentionBridgeNode depthDiversityNode)
Doctrine clauses:   10 → 11  (Restoration Arc Pattern Cluster added rev M)
Lexicon tokens:     +3 (RESTORATION-ARC MEM-BRIDGE: CIRC-ARC: rev C)
API events:         +3 (restoration_arc · circadian_coherence · memory_intention_bridge)
```

---

## 2. CORE ARCHITECTURE

*(Unchanged from v66. Four subsystems: Memory Engine · Quantum Intent Engine · Self-Assembly Engine · Punctuation & Intonation Engine.)*

QIE now at **90 patterns** active. Zero server communication for pattern detection. 7-day localStorage signal retention. 86 → 90 pattern expansion adds four restorative/temporal detection vectors:
- Temporal breadth (full-day phase coverage)
- Cognitive-behavioral bridge (insight → action pipeline)
- Restorative arc (confirmed recovery with velocity)
- Convergence (depth + breadth simultaneous)

---

## 3. QUANTUM INTENT ENGINE (QIE)

**Pattern count:** 90 (P87–P90 added 2026-06-28)

**Core functions (unchanged):**
- `analyzeIntentions(signals, now)` — main analysis loop, 90 pattern checks
- `classifyPhysiologicalCohort()` — 30-archetype real-time classifier
- `getQuantumOS()` — full person-state snapshot
- `getLogDependencySummary()` — live 7d source-frequency audit
- `recordRestorationArcSignal(careCount, priorEnergy)` — P89 signal helper (NEW v74)
- `recordMemoryIntentionBridge(intervalMinutes)` — P88 signal helper (NEW v74)

---

## 4. QIE PATTERN REGISTRY — P1–P90

*P1–P86: See LOT-WIKI-v66 Section 4 for full documentation.*

### NEW PATTERNS (v74)

#### P87: circadian-coherence-arc
- **Detection:** 3+ distinct circadian phases (morning/midday/afternoon/evening) present in same calendar day
- **Confidence:** 0.65 (3 phases) → 0.88 (4 phases)
- **Suggested widget:** systemProgress
- **Signal source:** mood · energy · log · journal · selfcare
- **Dep map node:** `circadianCoherenceNode`
- **Inverse of:** P52 circadian-anchor-loss (chronic counterpart); P87 is the daily confirmation
- **Log handler:** `CIRC-ARC:` (circadian_coherence event)

#### P88: memory-intention-bridge
- **Detection:** Memory capture (answer/memory source) followed by an intention signal within 2h on same calendar day
- **Confidence:** 0.72 (fixed — single-link bridge, high reliability)
- **Suggested widget:** intentions
- **Signal source:** memory · intentions · planner
- **Dep map node:** `memoryIntentionBridgeNode`
- **Relationship:** Closes the insight→action loop that P39 (cognitive-expansion) initiates
- **Log handler:** `MEM-BRIDGE:` (memory_intention_bridge event)
- **Signal helper:** `recordMemoryIntentionBridge(intervalMinutes)`

#### P89: restoration-acceleration
- **Detection:** Prior depletion event (depleted/low mood or depleted energy) + 3+ selfcare signals + energy improved, all within 24h
- **Confidence:** 0.70 base → +0.10 per care act beyond 3, cap 0.90
- **Suggested widget:** selfcare
- **Signal source:** selfcare · mood · energy · log
- **Dep map node:** `restorationArcNode`
- **Distinct from:** P12 (binary: any care after any depletion) · P48 (velocity: mood arc rate)
- **Confirmed by:** Job 25 daily-restoration-arc-check at 21:00 UTC
- **Log handler:** `RESTORE:` (restoration_arc event)
- **Signal helper:** `recordRestorationArcSignal(careCount, priorEnergy)`

#### P90: depth-diversity-convergence
- **Detection:** Journal entry >100 words + memory capture + 3+ distinct signal sources, all on same calendar day
- **Confidence:** 0.68 base → +0.04 per additional source beyond 3, cap 0.88
- **Suggested widget:** narrative
- **Signal source:** journal · memory · mood · energy · selfcare
- **Dep map node:** `depthDiversityNode`
- **Relationship:** Combines P77 (signal-vault: depth + channels) with multi-source breadth requirement
- **Log handler:** none yet (depth_diversity events not yet surfaced to LOG)

---

## 5. QUANTUM OPERATING SYSTEM (QOS)

*(Unchanged from v66. 6 widget views: Ecosystem · Biofield · Cohort · Index · Assembly · Mode.)*

The QOS now integrates P87–P90 pattern states. When the operator is in a restoration arc, the Cohort view shows Archetype 30 (Restorative Architect) with its directive. When circadian-coherence-arc fires, systemProgress is surfaced as the suggested action.

---

## 6. PHYSIOLOGICAL ARCHETYPES — 30 TYPES

*Archetypes 1–29: See LOT-WIKI-v66 Section 6 for full documentation.*

### Archetype 30: Restorative Architect (NEW v74)

```
ARCHETYPE:       Restorative Architect
ENERGY BANDS:    depleted · low · moderate
DOMINANT:        selfcare · mood · energy
PATTERNS:        restoration-acceleration (P89) · recovery-window (P12) · circadian-coherence-arc (P87)
DIRECTIVE:       Restoration arc confirmed. Biology is rebuilding. Protect recovery momentum —
                 every hour of rest is architecture.
```

**Classification logic:** Fires when the operator shows P89 (full restorative arc confirmed) AND full diurnal temporal coverage (P87). The archetype recognizes that the operator is not only recovering but maintaining systemic presence across all phases of the day despite the depletion state. The biological system is rebuilding while the operator remains structurally present.

**Distinct from:**
- Archetype 11 Calibrating Guardian: moderate/depleted, care-dominant but without circadian coverage requirement
- Archetype 18 Coherence Holder: cross-domain coherence state (mood+journal+selfcare+memory), not recovery-arc-specific

---

## 7. BEHAVIORAL COHORTS — FULL PROFILES

*(Unchanged from v66 Section 7. 6 detailed cohort profiles documented.)*

---

## 8. CITIZEN INDEX

*(Unchanged from v66. 6 dimensions: ENG · EMO · INT · SOC · CARE · COG.)*

---

## 9. MEMORY ENGINE

*(Unchanged from v66.)*

---

## 10. SELF-ASSEMBLY ENGINE

*(Unchanged from v66. 18 modules.)*

The new pattern cluster (P87–P90) feeds existing modules:
- `circadian-coherence-arc` → systemProgress module (temporal awareness)
- `memory-intention-bridge` → intentions module (execution signal)
- `restoration-acceleration` → selfcare module (Cleanness Protocol)
- `depth-diversity-convergence` → Reflection Layer (journal depth + source breadth)

---

## 11. BACKGROUND JOB SCHEDULER

**Total jobs: 25**

*Jobs 1–23: See LOT-WIKI-v66 Section 11.*

### Job 24: weekly-lot-ai-story (NEW — pre-existing, not previously documented)
- **Schedule:** Fridays 11:00 UTC
- **Function:** Generates weekly AI-authored LOT narrative story

### Job 25: daily-restoration-arc-check (NEW v74)
- **Schedule:** 21:00 UTC every day
- **Function:** Scans all active users' 24h logs; checks for: depletion event + 3+ selfcare logs + energy improved. Writes `restoration_arc` log event per qualifying user with metadata: `careCount` · `priorEnergy` · `currentEnergy` · `window: 24h`
- **Hour:** 21 added to scheduler interval guard
- **Log handler:** `RESTORE:` (surfaces in field LOG)

---

## 12. LOG EVENT SYSTEM

**Handler count: 88+**

*Handlers 1–85+: See LOT-WIKI-v66 Section 12.*

### NEW HANDLERS (v74)

#### RESTORE: — restoration_arc
```
RESTORE: {label}
  PRIOR ATP   {metadata.priorEnergy}
  CARE OPS    {metadata.careCount}
  WINDOW      {metadata.window}
```
**Trigger:** Job 25 at 21:00 UTC + client `recordRestorationArcSignal()`  
**Military format:** COCKPIT-RULE applied. Data rows only.

#### CIRC-ARC: — circadian_coherence
```
CIRC-ARC: {label}
  PHASES      {metadata.phases}
  COVERAGE    {metadata.coverage}
  WINDOW      {metadata.window}
```
**Trigger:** P87 fire in QIE analysis cycle  
**Military format:** COCKPIT-RULE applied.

#### MEM-BRIDGE: — memory_intention_bridge
```
MEM-BRIDGE: {label}
  FLOW        memory→intention
  INTERVAL    {metadata.intervalMinutes}m
```
**Trigger:** P88 fire in QIE analysis cycle + `recordMemoryIntentionBridge()`  
**Military format:** COCKPIT-RULE applied.

### displayableEvents whitelist additions (v73 block in api.ts)
```
'restoration_arc',
'circadian_coherence',
'memory_intention_bridge',
```

---

## 13. ECOSYSTEM NODE MAP

*(Unchanged from v66. 6 nodes: CAR · HOME · CPU · PHN · WCH · ROBOT.)*

---

## 14–16. BADGE SYSTEM / WORD TURN ENGINE

*(Unchanged from v66. Badge Codex v19 · 389 badges · Word Turn v10.)*

---

## 17–20. DISPLAY / DENSITY / OPACITY / COCKPIT RULE

*(Unchanged from v66.)*

---

## 21. LOT-DOCTRINE (Revision M — 11 clauses)

**11 clauses active.** Clauses 1–10 unchanged from v66 (Revision L).

### Clause 11 (NEW v74): Restoration Arc Pattern Cluster

Recovery is not a single event but a three-state sequence: depletion detected → care intervention applied → energy improved. Each state is independently observable through QIE signals. The QIE represents this cluster in three distinct patterns across two detection timescales:

```
P12  recovery-window          binary: any care after any depletion signal (passive)
P48  recovery-velocity        arc: negative mood → selfcare → positive mood, with
                              velocity score (inverse of recovery window duration)
P89  restoration-acceleration full 24h arc: depletion log + 3+ care acts + energy
                              improved within 24h window (confirmed restoration)
```

Archetype 30 Restorative Architect classifies the operator in this state when P89 + P12 + P87 are simultaneously present — the operator is rebuilding while maintaining full diurnal arc coverage. The patterns are not redundant: P12 is the earliest signal, P48 is the rate, P89 is the confirmed arc. Job 25 runs the server-side confirmation at end-of-day when arc completion is assessable.

*(References: SR-20260516-01 P48 minted; SR-20260628-01 P89 + Arch30 + Job25 minted; RESTORATION-ARC entered LEXICON rev C.)*

---

## 22. FIELD MANUAL (About.tsx)

**Current: Field Manual v74.** Synchronized to v74 state as of 2026-06-28.

```
Version:              v74  (QIE Engineering June 28)
Day:                  1024+ (as of June 28, 2026)
Patterns:             90 active
Archetypes:           30
Background jobs:      25
Log handlers:         88+
Dep map nodes:        130+
Self-assembly:        18 modules
```

*Version history v1–v74 maintained in About.tsx Self-Assembly Log section.*

---

## 23. DEPLOYMENT & STACK

*(Unchanged from v66.)*

**tsconfig.server.json:** `"ignoreDeprecations": "6.0"` added to suppress TS6.0 deprecation warnings for `moduleResolution: node` and `baseUrl`. Required for TypeScript 6.0+ compatibility.

---

## 24. LOT-GENESIS-v1

*(Unchanged from v66.)*

---

## 25. CUBIQ™ — THE QUANTUM CUBIC EXPERIENCE

*(Unchanged from v66.)*

---

## 26. VOCABULARY INDEX — EXPANDED

*Full index in LOT-WIKI-v66. Additions for v67:*

```
RESTORATION-ARC        P89 + Archetype 30 — depletion → 3+ care → energy recovered in 24h; full arc confirmed
MEM-BRIDGE:            Memory-Intention Bridge — log block label for memory_intention_bridge events (P88)
CIRC-ARC:              Circadian Coherence Arc — log block label for circadian_coherence events (P87)
RESTORATIVE ARCHITECT  Archetype 30 — operator in confirmed restoration arc with full diurnal coverage
```

---

## 27. SYSTEM STATE SNAPSHOT

```
DATE:                 2026-06-28
FIELD MANUAL:         v74
WIKI:                 v67
QIE PATTERNS:         90 active
PHYSIOLOGICAL:        30 archetypes
BACKGROUND JOBS:      25
LOG HANDLERS:         88+
DEP MAP NODES:        130+
SELF-ASSEMBLY:        18 modules · overallAssembly tracked
LEXICON:              rev C
DOCTRINE:             rev M · 11 clauses
DAY:                  1024+
BADGE CODEX:          v19 · 389 badges · 50 categories · 326 hidden
WORD TURN:            v10 · 126 triggers
PLATFORM:             v1.3.0
BRANCH:               claude/upbeat-curie-y9086k
```

**Pattern milestones:**
```
P1–P30     Core behavioral detection (v2–v12)
P31–P50    Ecosystem, cascade, arc, completion patterns (v16–v33)
P51–P65    Temporal, burst, cross-domain, recovery patterns (v35–v45)
P66–P80    Signature lock, convergence, momentum patterns (v58–v67)
P81–P86    Depth, vitality, strategy, adaptive patterns (v68–v72)
P87–P90    Restorative, temporal breadth, bridge patterns (v74)
```

**Archetype milestones:**
```
Arch1–9    Core physiological states (v12)
Arch10–12  Momentum, calibrating, resonant states (v21–v22)
Arch13–16  Work modes, social, cognitive states (v24–v33)
Arch17–20  Meridian, achievement, temporal, signal states (v44–v58)
Arch21–26  Integration, convergence, momentum, cognitive states (v60–v68)
Arch27–30  Cartographer, vital, vital architect, restorative states (v68–v74)
```

---

*LOT-WIKI-v67 — Synchronized to Field Manual v74 — 2026-06-28 — S-2: VADIK MARMELADOV*
