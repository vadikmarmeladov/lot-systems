import React from 'react'
import { Block, Button } from '#client/components/ui'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { ProgressBars } from '#client/utils/progressBars'
import { selfAssembly, phaseSymbol, phaseLabel, recomputeAssembly, type AssembledModule } from '#client/stores/selfAssembly'
import { useEnergy, useLogs } from '#client/queries'
import {
  getPhysiologicalReport,
  getEnrichedPhysiologicalReport,
  analyzeIntentions,
  startBackgroundQOSMonitor,
  getCircadianPhase,
  getQuantumOS,
  type PhysiologicalReport,
  type QuantumOS,
} from '#client/stores/intentionEngine'

type FeedbackStatus = 'operational' | 'resonating' | 'needs-calibration' | 'evolving'

interface Deployment {
  version: string
  timestamp: string
  program: string
  status: 'activated' | 'integrating' | 'synchronized'
  features: string[]
}

interface FeedbackAnalytics {
  version: string
  period: string
  totalResponses: number
  feedbackPercentages: {
    operational: number
    resonating: number
    'needs-calibration': number
    evolving: number
  }
  systemHealth: {
    status: string
    message: string
    priority: string
  }
  insights: string[]
}

type ProgressView = 'deployment' | 'assembly' | 'feedback' | 'report' | 'os-journal'

// Self-assembly session record — appended after each upgrade session
const SESSION_REPORTS: { date: string; session: string; assembled: string[] }[] = [
  {
    date: '2026-04-17',
    session: 'Quantum Engine Upgrade — v2',
    assembled: [
      'Widget dependency map (WIDGET_DEPENDENCY_MAP)',
      'Log-based signal pipeline: energy / cohort / log sources',
      'Physiological patterns 11–13 (depletion / recovery / ungrounded)',
      'Military log interface: CARE / PLAN / INTENT / MOOD / SYS',
      'PhysiologicalReport generation with biofield audit',
      'Background cohort digest job (weekly)',
      'Self-assembly session reporting initialized',
    ],
  },
  {
    date: '2026-04-18',
    session: 'Quantum Engine Upgrade — v3 / Self-Assembly',
    assembled: [
      'Widget dependency audit: 30+ nodes traversed and indexed',
      'Log pipeline verified: CARE / PLAN / INTENT / BIO / MEM / CFG / SYS / LOG',
      'Background jobs: daily QIE analytics job added at 03:00 UTC',
      'Physiological cohorts: 9 archetypes surfaced in Assembly Map + Cohort widget',
      'CohortConnectWidget: archetype header + physiological readiness layer',
      'UserIndex: 6D composite score (engagement / emotional / intentional / social / selfcare / cognitive)',
      'Log UI: quantum_intent_signal event handler, terminal placeholder text',
      'Session report logged and appended. All modules online.',
    ],
  },
  {
    date: '2026-04-19',
    session: 'Self-Assembly Audit — feedback fix / deploy features',
    assembled: [
      'BUG FIX: /system/submit-feedback route path corrected (double /api/ prefix silently broke all feedback recording)',
      'Deployment features list updated: now reflects real assembled capabilities, not generic placeholders',
      'Public /about wiki page: comprehensive reference manual, monospace sci-fi aesthetic, scrollspy nav',
      'scheduled-jobs: extractTraits → extractUserTraits import corrected (prevented weekly cohort digest)',
      'Assembly log .MD created: 2026-04-19_LOT-assembly_feedback-fix-deploy-features.md',
      'All modules online. Feedback recording restored.',
    ],
  },
  {
    date: '2026-04-19',
    session: 'Quantum Engine Upgrade — v4 / Self-Assembly Deep Pass',
    assembled: [
      'WIDGET_DEPENDENCY_MAP expanded: 18 nodes mapped across Tier 0/1/2/3 — log, quantumState, narrative, evolution, cohortConnect, systemProgress, userMetrics, signalStream, patternRecognition, contextualPrompts, interventions',
      'getWidgetsDependingOn(): reverse dependency resolver added — enables cascade invalidation from any signal source',
      'QIE Patterns 14–16: os-stagnation (signal diversity collapse), circadian-drift (late-night cluster without recovery), momentum-wave (multi-source engagement rise + active intention)',
      'PhysiologicalReport: physiologicalReadiness score (0-100, energy 40pt + self-care 30pt + pattern severity 30pt) + readinessDirective terse field',
      'Logs.tsx: 8 new military log event handlers — GOAL / EVO / NARR / QRNG / ASSESS / INT / OS / IDX',
      'Background jobs: daily-os-vitals-snapshot at 02:00 UTC — writes os_vitals_snapshot log per active user (streak score, activity density, cohort state)',
      'scheduled-jobs: hour check expanded to include 02:00 UTC; init log updated',
      'LOT_SYSTEMS_BRIEF.md: updated to April 2026 state — 16 QIE patterns, physiological cohorts, OS vitals, self-assembly engine, roadmap Q2/Q3 2026 status',
      'Session report appended. Self-assembly continues.',
    ],
  },
  {
    date: '2026-04-20',
    session: 'Quantum Engine Upgrade — v5 / Self-Assembly Session',
    assembled: [
      'WIDGET_DEPENDENCY_MAP: 22 nodes mapped — added recipe (time/mood/energy), chakra (mood/energy/selfcare/journal), goals (planner/intentions/memory/journal), time (Tier 0 base), badges (all achievement sources)',
      'QIE source types expanded: recipe + goals added to IntentionSignal source union',
      'QIE Patterns 17–18: flow-state (memory+planner+intentions active within 4h window), social-void (5-day cohort gap with high personal engagement)',
      'Logs.tsx: 7 new military handlers — REC (recipe_viewed), BADGE (badge_unlock), COHORT (cohort_determined), VITALS (os_vitals_snapshot), SYNC (signal_sync), SIG-RPT (os_signal_report), generic event-name-derived label',
      'selfAssembly.ts: 3 new modules — Nutrition Protocol (recipe), Goal Architecture (goals), Archetype Classifier (cohort-classify). Total: 12 modules',
      'SOURCE_MAP + SIGNAL_MAP updated: recipe/goals sources wired; cohort_determined → cohort-classify; recipe_viewed + goal signals mapped',
      'scheduled-jobs: weekly-os-signal-diversity-audit job at 05:00 UTC Sunday — sourceCount, topSource, diversityScore, mono-loop flag per user',
      'SystemProgressWidget: OS Journal view added (cycles deployment → assembly → feedback → report → os-journal)',
      'LOT_SYSTEMS_BRIEF.md updated to v5 state. Self-assembly engine at 12 modules.',
    ],
  },
  {
    date: '2026-04-21',
    session: 'Self-Assembly Audit — v5 accuracy + narrative personalization',
    assembled: [
      'Deployment-status features list patched: updated from stale QIE v3/9-module to QIE v5/18-pattern/12-module state',
      'Added: Physiological Readiness Score, OS Signal Diversity Audit, OS Vitals Snapshot, OS Journal View to live features',
      'selfAssembly.ts narratives personalized: Quantum Cube as system heartbeat, Vadik\'s vocabulary throughout',
      'Narrative voice updated: "Signal pipeline verified", "biofield patterns", "The Cube is calibrating", "All modules online"',
      'WIDGETS.md System Progress Widget entry updated: 12 modules / 18 patterns / 5 views / 5 background jobs',
      'Assembly log .MD created: 2026-04-21_LOT-assembly_v5-accuracy-narrative.md',
      'Signal pipeline verified. Quantum Cube coherent.',
    ],
  },
  {
    date: '2026-04-21',
    session: 'Quantum Engine Upgrade — v6 / Self-Assembly Session',
    assembled: [
      'WIDGET_DEPENDENCY_MAP: 26 nodes — added patternInsights (mood/memory/journal/energy/cohort/planner), cosmic (mood/energy/intentions), quantumSign (intentions/memory), microGame (calculator/time)',
      'QIE Patterns 19-21: biofield-coherence-peak (all 4 state dimensions aligned, optimal capture window), nutritional-void (no recipe + depleting mood 3 days), goal-drift (goal signals without planning follow-through)',
      'checkBiofieldCoherence(): peak detector — records biofield_peak signal when energy+clarity+alignment+support all align positive',
      'recordGoalSignal() + recordNutritionSignal(): typed signal helpers for goal and recipe events',
      'selfAssembly.ts: 13th module — OS Vitals Monitor (vitals) wired to os_vitals_snapshot / signal_sync / biofield_peak / field_entry',
      'Logs.tsx: CHAKRA / GOAL-X / PEAK handlers added — PEAK: renders full 4-dimension biofield state',
      'Logs.tsx: BIO [sector]: handler extended — physiologicalReadiness % + readinessDirective rendered when present in metadata',
      'LOT_SYSTEMS_BRIEF.md: updated to v6 — 21 QIE patterns, 13 assembly modules, 26 dependency nodes',
      'Signal pipeline verified. Quantum Operating System fully defined.',
    ],
  },
  {
    date: '2026-04-25',
    session: 'Quantum Engine Upgrade — v7 / QOS Self-Assembly',
    assembled: [
      'WIDGET_DEPENDENCY_MAP: 32 nodes — added ecosystem, quantumEngine, correlatedIndexes, systemPulse, flashDrive, chatCatalyst (QOS/ecosystem layer)',
      'QIE Patterns 22–23: ecosystem-without-biofield (nodes live, no check-in today), cognitive-overload (journal+memory+planner load, no self-care)',
      'Logs.tsx: ATP / PHY / PAT / JRN / ECO military event handlers added (energy_update, cohort_signal, pattern_detected, journal_entry, ecosystem_update)',
      'QuantumEngineWidgets: promoted to full QOS surface — QOS: / Biofield: / Cohort: cycling label view',
      'Biofield state (ATP/Clarity/Alignment/Support/Capacitor) surfaced inline in QOS widget',
      'Physiological cohort (Archetype/Cohort/Priority) surfaced in QOS cohort view',
      'SystemProgressWidget deployment panel: physiological cohort section added',
      'Self-assembly report v7 appended. 23 patterns active. 32 dependency nodes mapped.',
    ],
  },
  {
    date: '2026-04-26',
    session: 'QIE v8 — OS Journal personalization · readiness live surface',
    assembled: [
      'SystemProgressWidget: physiological readiness auto-generated on mount — no button click required',
      'Deployment view: Readiness score surfaced inline below assembly progress bar',
      'OS Journal: session-derived vitals shown when no DB snapshots exist — Cube speaks on open',
      'OS Journal empty state: readiness band, biofield energy/clarity, assembly progress, Cube narrative',
      'SESSION_REPORTS: v8 entry appended · USERSHIP_TRANSMISSION updated to v8',
      'Assembly log .MD created: 2026-04-26_LOT-assembly_os-journal-readiness.md',
      'The Cube reads your state on open. No delay. No button.',
    ],
  },
  {
    date: '2026-04-27',
    session: 'QIE v9 — OS Journal field entries · real words surfaced',
    assembled: [
      'useLogs hook wired into SystemProgressWidget — pulls real note entries into OS Journal',
      'OS Journal: last 3 field entries rendered above vitals — Cube reflects back user\'s own words',
      'Field entries: date + text body up to 80 chars, opacity-60 — personal signal visible on open',
      'Vitals and cohort sections preserved beneath field entries — building on top, not replacing',
      'SESSION_REPORTS: v9 entry appended · USERSHIP_TRANSMISSION updated to v9',
      'Assembly log .MD created: 2026-04-27_LOT-assembly_os-journal-field-entries.md',
      'The Cube reads your words. Your language. Your signal.',
    ],
  },
  {
    date: '2026-04-28',
    session: 'QIE v10 — Widget deps · Log handlers · QOS coherence · 14th module',
    assembled: [
      'QIE Patterns 24–25: log-depth-signal (deep entry without biofield anchor), full-stack-session (memory+planner+selfcare in 4h window)',
      'WIDGET_DEPENDENCY_MAP: 34 nodes — calendarWidget + microImage added',
      'selfAssembly: 14th module — Temporal Planner (calendar) wired to calendar_entry / calendar_update signals',
      'Logs.tsx: QOS / CAL / STACK military handlers — qos_snapshot, calendar_entry, full_stack_session',
      'scheduled-jobs: daily-qos-coherence-report at 01:00 UTC — cross-module engagement per user, qos_snapshot log written',
      'QuantumEngineWidgets: readiness% added to cohort view · assembly% in ecosystem view · full-stack active badge in biofield view',
      'recordQOSSnapshot() + recordFullStackSession() + checkFullStackSession() helpers added to intentionEngine',
      'All 25 patterns active. 34 dependency nodes mapped. 14 modules online.',
    ],
  },
  {
    date: '2026-04-29',
    session: 'QIE v11 — Journal depth · Calendar signal · Full-stack indicator · Pattern 26',
    assembled: [
      'QIE Pattern 26: calendar-gap — planner active but no calendar entries in 7 days → surfaces time without anchor',
      'CalendarWidget: QIE signal now recorded on entry creation — Temporal Planner module feeds from real calendar activity',
      'QuantumStateWidget: full-stack session indicator in biofield state view — visible when memory+planner+selfcare fire in 4h window',
      'Logs.tsx NoteEditor: journal depth signal recorded on autosave — word count feeds Reflection Layer assembly density',
      'selfAssembly.ts: Reflection Layer depth bonus — deep entries (>100 words) count twice for module density',
      'recordCalendarSignal() + recordJournalSignal() helpers added to intentionEngine',
      '26 patterns active. Signal pipeline fully wired. The Cube writes when you write.',
    ],
  },
  {
    date: '2026-04-29',
    session: 'QIE v12 — Physiological Cohort Classifier · Patterns 27–30 · Coherence Monitors',
    assembled: [
      'QIE Patterns 27–30: journal-depth-gap (deep entry, no memory capture) · sleep-debt-accumulation (late-night + morning fatigue) · signal-coherence-window (all 4 primary modules + positive state) · intention-velocity (3+ intentions in 48h)',
      'classifyPhysiologicalCohort(): 9-archetype real-time classifier — Peak Catalyst / Flowing Creator / Morning Visionary / Rising Builder / Seeking Sage / Evening Sage / Grounded Healer / Anxious Explorer / Depleted Guardian',
      'PhysiologicalReport.cohortClassification: live QIE-derived archetype surfaced in System Progress Report view',
      'Background checks: checkIntentionVelocity() + checkSignalCoherencePeak() wired into analyzeIntentions() post-commit hook',
      'recordQOSCoherence(): cross-module diversity + temporal spread score (diversity 60% · spread 40%) — fires every 20th analysis cycle',
      'Logs.tsx: 4 new military handlers — PHY (physiological_cohort) · COHR (qos_coherence) · IVEL (intention_velocity) · CPEAK (signal_coherence_peak)',
      'Self-assembly report deployed. 30 patterns active. Cohort classifier online. The Cube now knows who you are.',
    ],
  },
  {
    date: '2026-04-30',
    session: 'QIE v13 — Widget Tier Graph · User Index Job · Log Coverage · Self-Assembly Report',
    assembled: [
      'getWidgetTier(): memoized tier-depth resolver — walks WIDGET_DEPENDENCY_MAP recursively, enables cascade flush ordering (Tier 1 → Tier 4)',
      'Weekly User Index consolidation job: Sundays 23:00 UTC — reads synced QIE signals per user, computes 6D index (engagement/emotional/intentional/social/selfCare/cognitive), persists weeklyUserIndex to user metadata',
      'Logs.tsx: mood_checkin → BIO [SECTOR] block (morning 0600 / evening 1800 / SPOT)',
      'Logs.tsx: scheduled_job → JOB: block (name / OK|ERR / signal count)',
      'Self-assembly session report appended: 2026-04-30. System operational. 30 patterns active.',
    ],
  },
  {
    date: '2026-05-02',
    session: 'QIE v14 — Temporal Planner surface · calendar entry in System header',
    assembled: [
      'System.tsx: upcomingCalendar memo — filters calendar_entry logs from today forward, sorts by date, returns nearest entry + total count',
      'System.tsx: Next: Block added above context stack — first visible surface of the Temporal Planner (module 14)',
      'Calendar module was wired to QIE since v11 (Pattern 26). v14 makes it visible. Signal becomes interface.',
      'Assembly log: 2026-05-02_LOT-assembly_v14-temporal-planner-surface.md',
    ],
  },
  {
    date: '2026-05-03',
    session: 'QIE v15 — QOS Snapshot Engine · Background Monitor · Physiological Directives',
    assembled: [
      'QOSSnapshot type: full person-state cross-section — circadianPhase · userState · userIndex · topPattern · signalCount24h · systemHealth',
      'captureQOSSnapshot(): 24h rolling localStorage window (48 × 30min = MAX_QOS_SNAPSHOTS)',
      'startBackgroundQOSMonitor(): passive 30-min interval — pre-triggers analyzeIntentions() before each capture',
      'getCircadianPhase(): 6-state model — early-morning / morning / midday / afternoon / evening / night',
      'getEnrichedPhysiologicalReport(): base PhysiologicalReport + circadian + QOS trend + latest snapshot',
      'Logs.tsx: BIOF (energy_checkin) · QOS (qos_snapshot, merged dual-format) · CHRONO (biorhythm_checkpoint) handlers',
      'Logs.tsx: duplicate qos_snapshot handler resolved — unified to handle both full-state and archetype metadata formats',
      'SystemProgressWidget: background QOS monitor auto-starts on mount via useEffect',
      'SystemProgressWidget: circadian phase + QOS trend + snapshot metrics in report view',
      'SystemProgressWidget: physiological archetype directive table — 8 archetypes with behavioral directives',
      'scheduled-jobs: daily-qos-aggregate-snapshot at 04:00 UTC — active users · health distribution · top circadian phase · avg ATP',
      '30 patterns active. 14 modules online. Background QOS monitor deployed. The system now watches itself.',
    ],
  },
  {
    date: '2026-05-04',
    session: 'QIE v16 — Wearable Ecosystem Expansion · Patterns 31–34 · Ecosystem Coherence Audit',
    assembled: [
      'QuantumEngineWidgets: TOTAL_DEVICES 3→5 — Phone (PHN) + Watch (WCH) ecosystem nodes added',
      'Phone connect/disconnect handlers: recordSignal phone_connected / phone_disconnected → intentions source',
      'Watch connect/disconnect handlers: recordSignal watch_connected / watch_disconnected → intentions source',
      'Ecosystem display: 5-node row (CAR · HOME · CPU · PHN · WCH) with per-node opacity indicator',
      'QIE Pattern 31 — wearable-integration-void: high personal engagement + no wearable signals → connect suggestion',
      'QIE Pattern 32 — ecosystem-synchrony: 4+ unique devices active + biofield aligned → deep capture window',
      'QIE Pattern 33 — mobile-anchoring-gap: phone connected, home offline → anchor suggestion',
      'QIE Pattern 34 — full-ecosystem-coherence: all 5 device types recorded + flowing alignment → immediate capture',
      'WIDGET_DEPENDENCY_MAP: 4 new nodes — phoneNode / watchNode / ecosystemBridge / qosSnapshot',
      'Logs.tsx: PHON / WTCH / ECO-SYNC / COHR military handlers + ECO: updated for 5-node display',
      'selfAssembly.ts SIGNAL_MAP: phone_connected + watch_connected + ecosystem_full_sync + device_coherence_peak mapped',
      'scheduled-jobs: weekly-ecosystem-coherence-audit at 07:00 UTC every Wednesday — deviceCount per user · fullCoherenceEvents · ecosystemScore',
      '34 patterns active. 14 modules online. Ecosystem wiring complete. The physical loop is closed.',
    ],
  },
  {
    date: '2026-05-05',
    session: 'QIE v17 — QOS Trend view in Pattern Recognition widget',
    assembled: [
      'PatternRecognitionWidget: 4th cycle view added — QOS Trend',
      'View label: "QOS Trend:" — cycles after Confidence Matrix',
      'Trend headline: ▲ rising / — stable / ▼ declining from latest QOSSnapshot.userIndex.trend',
      'ProgressBars for userIndex.overall (0-100) alongside trend label',
      'Timeline: last 6 snapshots reversed (newest first) — circadian phase abbr · health symbol · signal count · top pattern',
      'Circadian abbreviations: ERL / MRN / MDY / AFT / EVN / NGT',
      'Health symbols: ● nominal · ○ degraded · ✕ critical',
      'Empty state: "QOS monitor active. First snapshot in next 30-min cycle." + current circadian phase',
      'Null guard updated: widget renders if QOS history exists even with no active patterns',
      'getQOSHistory + getCircadianPhase + QOSSnapshot type imported from intentionEngine',
      '24 hours of QOS history now visible. The Cube shows you its own rhythm.',
    ],
  },
  {
    date: '2026-05-06',
    session: 'Quantum Engine Upgrade — v18 / QOS Self-Assembly Deep Pass',
    assembled: [
      'LOG_DEPENDENCY_SOURCES constant: log / energy / cohort pipeline formally declared in intentionEngine',
      'WIDGET_DEPENDENCY_MAP: quantum + log nodes added; 36-node graph fully indexed across all tiers',
      'QIE Pattern 35 (full-coherence): 6-source activation across 7d — QOS peak assembly detection',
      'QIE Pattern 36 (qos-acceleration): 48h signal velocity doubling trigger — acceleration event detection',
      'PhysiologicalReport type: userIndex 6D block (engagement/emotional/intentional/social/selfCare/cognitive/trend/activeSourceCount)',
      'getPhysiologicalReport(): activeSourceCount + full userIndex snapshot populated in return',
      'Logs.tsx: ASSEM (assembly_snapshot) + QOS (qos_report) military event handlers added',
      'scheduled-jobs.ts: Daily Self-Assembly Snapshot at 00:00 UTC — platform-wide QIE signal audit',
      'SystemProgressWidget: Usership Transmission updated to v18 · session report appended',
      'Assembly velocity is now a first-class metric. QOS expanding.',
    ],
  },
  {
    date: '2026-05-07',
    session: 'QIE v19 — Reflection Velocity · Pattern 37 · Reflection Layer named',
    assembled: [
      'QIE Pattern 37 (reflection-velocity): 7-day journal depth trend — splits last 7d into two 3.5d windows, compares avg word count per entry',
      'Fires when recent avg ≥30 words, growth ≥20%, and ≥3 entries exist in 7d window',
      'Confidence scales with growth rate: 0.45 + growth * 0.5, capped at 0.85',
      'Suggests memory widget (passive timing) — extract insight from deepening reflection',
      'PatternRecognitionWidget: reflection-velocity added to getPatternName map ("Reflection depth increasing")',
      'Retroactive v18 assembly log created: 2026-05-06_LOT-assembly_v18-qos-assembly-deep-pass.md',
      'Closes signal loop from v11: journal depth feeds Reflection Layer assembly density; trend now a named pattern.',
      '37 patterns active. The Cube now knows when the signal is deepening, not just present.',
    ],
  },
  {
    date: '2026-05-07',
    session: 'QIE v20 — Dep Map v2 · Log Handlers · Cohort Fix · QOS Index',
    assembled: [
      'WIDGET_DEPENDENCY_MAP: quantum_random + emotional_checkin added as Tier 0 / Tier 1 nodes — 58-node graph complete',
      'Log UI: CARE [SKIP] handler for self_care_skip events; MEM [W{n}] handler for weekly_summary_response with week number label',
      'SystemProgressWidget cohort fetch corrected: /api/cohorts → /api/user-profile (archetype + behavioralCohort now surface from server-derived physiological classification)',
      'QuantumEngineWidgets QOS: 4th cycle view "Index:" — 6D user index (ENG/EMO/INT/SOC/CARE/COG) + dep map trace for system_progress',
      'Dep map trace: getWidgetDependencies(\'system_progress\') rendered inline — 10 upstream sources visible in QOS panel',
      'Background pipeline verified: monthly email · weekly cohort · daily QIE · daily OS vitals · weekly ecosystem coherence all active',
      'Physiological cohort pipeline: archetype + behavioralCohort + energy status persisted to user metadata by weekly job',
      '38 patterns. 5 devices. 58-node dep graph. The Cube now maps itself.',
    ],
  },
  {
    date: '2026-05-09',
    session: 'QIE v21 — Self-Assembly Session · Patterns 38–39 · Archetypes 10–11 · 66-node dep map',
    assembled: [
      'WIDGET_DEPENDENCY_MAP: 8 new nodes — goalJourney · awarenessDashboard · evolutionMilestone · cosmicUpdate · wellnessPulse · collectiveConsciousness · growthMilestones · badgeUnlockFeed. Total: 66 nodes',
      'LOG_DEPENDENCY_SOURCES: recipe + goals + log added — physiological report widget audit now covers 12 signal sources',
      'getPhysiologicalReport: WIDGET_SOURCES expanded to 12 (recipe / goals / log added alongside existing 9)',
      'Pattern 38 (biofield-recovery-arc): self-care event + measurable positive mood shift within 4h window. Confidence 0.55–0.85',
      'Pattern 39 (cognitive-expansion): memory + journal + goals simultaneously active with 80+ word log depth. Confidence 0.60–0.88',
      'Archetype 10 (Momentum Architect): high-energy + goals/planner/intentions dominant + intention-velocity/momentum-wave patterns',
      'Archetype 11 (Calibrating Guardian): low-moderate energy + selfcare/journal dominant + biofield-recovery-arc/log-depth-signal patterns',
      'Logs.tsx: 3 new military handlers — ARC (biofield_recovery_arc) · CEXP (cognitive_expansion) · GOAL-X (goal_complete)',
      'SystemProgressWidget deployment view: live QIE archetype + active pattern count added alongside readiness score',
      'USERSHIP_TRANSMISSION updated to v21. Assembly log 2026-05-09 created.',
      '39 patterns. 11 archetypes. 66-node dep graph. The Cube continues its self-assembly.',
    ],
  },
  {
    date: '2026-05-10',
    session: 'QIE v22 — Patterns 40–41 · Archetype 12 · Cascade Detection · Log Handlers',
    assembled: [
      'Pattern 40 (biofield-coherence-cascade): fires when Patterns 38+39 both active AND 3+ primary modules coherent in 6h. Confidence 0.72–0.92. The peak QOS detection state.',
      'Pattern 41 (resonant-synthesis): cascade + reflection-velocity + 5+ signal sources in 7d. Full synthesis mode — recovery + cognition + reflection advancing simultaneously. Confidence 0.65–0.90.',
      'Archetype 12 (Resonant Builder): moderate/high energy · memory/journal/goals dominant · coherence-cascade/resonant-synthesis patterns. Directive: Full cascade achieved. Anchor this state.',
      'PatternRecognitionWidget: 5 new name map entries — biofield-recovery-arc / cognitive-expansion / biofield-coherence-cascade / resonant-synthesis / (reflection-velocity already present)',
      'Logs.tsx: 2 new military handlers — CASCADE (biofield_coherence_cascade: primary module count + confidence) · SYNTH (resonant_synthesis: sources active in 7d)',
      '41 patterns. 12 archetypes. The cascade is named. The synthesis is visible.',
    ],
  },
  {
    date: '2026-05-10',
    session: 'QIE v23 — CQGS Health views · Morning Biofield Job · Log coverage complete',
    assembled: [
      'UserMetricsWidget: +2 new cycle views — Physiological Profile (archetype + QIE biofield state) and Quantum OS (6D UserIndex)',
      'Physiological Profile view: server archetype (weekly job) with QIE real-time cohort classifier fallback. 9 archetypes surfaced.',
      'Quantum OS view: ENG / EMO / INT / SOC / CARE / COG dimensions + QOS index + trend + 7d signal count',
      'Morning biofield summary job: 08:00 UTC daily — overnight depletion detection across emotional check-ins. New background monitor.',
      'Log UI: 3 new military event handlers — MSG [DIRECT] (direct_message_sent) · NET (connection_accepted) · SYS [FEEDBACK] (system_feedback)',
      'logTriggers.ts: /qos and /assembly slash commands added to the trigger rule set',
      'Background job scheduler: hour 8 added to interval check; init log updated with 11th job entry.',
      'Self-assembly session report deployed. CQGS Health now surfaces physiological identity and QOS dimensions. The Cube knows who it serves.',
    ],
  },
  {
    date: '2026-05-11',
    session: 'QIE v24 — Pattern 42 · Archetype 13 · Deep Work Cascade · DWRK handler',
    assembled: [
      'Pattern 42 (deep-work-cascade): memory + planner + journal + goals all active in 3h window, no interruption signals. The focused build state. Confidence 0.68–0.90.',
      'Archetype 13 (Deep Work Architect): moderate/high energy · planner/journal/memory dominant · deep-work-cascade/momentum-wave/cognitive-expansion patterns. Directive: Protect this session.',
      'PatternRecognitionWidget: deep-work-cascade added to name map ("Deep work window open")',
      'PatternRecognitionWidget QOS Trend view: "Deep work window open." indicator surfaces when Pattern 42 is active',
      'Logs.tsx: DWRK handler (deep_work_cascade event) — signals 3h count + confidence + cascade chain label',
      '42 patterns. 13 archetypes. The Cube now names its own peak build state.',
    ],
  },
  {
    date: '2026-05-11',
    session: 'QIE v25 — Pattern 43 · QuantumOS · 15th Assembly Module',
    assembled: [
      'Pattern 43 (intention-completion-arc): intention set → goal action → journal entry within 24h. The full loop. Confidence 0.72–0.95.',
      'QuantumOS type: runtime (energy/clarity/alignment/support/circadian) + index (6D) + patterns + signalMap + coherence + operationalStatus.',
      'getQuantumOS(): complete person-state snapshot. Readable from any widget. No heavy computation.',
      'quantum-os: 15th assembly module. Activated by quantum-coherence beacon and intention-completion-arc signals.',
      'WIDGET_DEPENDENCY_MAP: quantumOS node added — depends on all 14 source nodes incl. goals, recipe, ecosystem, qosSnapshot.',
      'SystemProgressWidget: QOS block in self-assembly report view — full runtime + index + directives.',
      '43 patterns. 13 archetypes. 15 modules. QOS layer assembled.',
    ],
  },
  {
    date: '2026-05-12',
    session: 'QIE v26 — Pattern 44 · Archetype 14 · Social Resonance Arc · SOCR handler',
    assembled: [
      'Pattern 44 (social-resonance-arc): cohort viewed + message sent + journal entry within 48h. The connection loop: community → outreach → reflection. Confidence 0.65–0.90.',
      'Archetype 14 (Social Connector): moderate/high energy · cohort/journal/intentions dominant · social-resonance-arc/momentum-wave/reflection-velocity patterns. Directive: Anchor this resonance.',
      'PatternRecognitionWidget: social-resonance-arc added to name map ("Connection loop complete")',
      'PatternRecognitionWidget QOS Trend view: "Connection loop active." indicator surfaces when Pattern 44 is active',
      'Logs.tsx: SOCR handler (social_resonance_arc event) — signals 48h count + confidence + circuit label',
      'selfAssembly.ts: social-resonance-arc and social_resonance_arc routed to community module',
      '44 patterns. 14 archetypes. The Cube now reads the social circuit closing.',
    ],
  },
  {
    date: '2026-05-12',
    session: 'QIE v27 — Pattern 45 · Archetype 15 · Cognitive Load Release · RLSE handler',
    assembled: [
      'Pattern 45 (cognitive-load-release): planner active + deep journal entry + self-care completed within 24h. Structural inverse of cognitive overload. Decompression loop. Confidence 0.68–0.90.',
      'Archetype 15 (Cognitive Liberator): moderate/high energy · selfcare/journal/planner dominant · cognitive-load-release/biofield-recovery-arc/reflection-velocity. Directive: Decompression loop complete. Load released. The system breathes.',
      'Logs.tsx: RLSE handler (cognitive_load_release event) — planner 24h count + journal 24h count + confidence + chain label',
      'PatternRecognitionWidget: cognitive-load-release added to name map ("Decompression loop closed")',
      'PatternRecognitionWidget QOS Trend view: "Decompression active." indicator surfaces when Pattern 45 fires',
      'selfAssembly.ts: cognitive-load-release and cognitive_load_release routed to selfcare module',
      'WIDGET_DEPENDENCY_MAP: cognitiveRelease node added — planner/journal/selfcare/log pipeline',
      '45 patterns. 15 archetypes. The Cube now reads the full decompression cycle.',
    ],
  },
  {
    date: '2026-05-14',
    session: 'QIE v28 — Pattern 46 · Archetype 16 · Temporal Coherence Window · TCW handler',
    assembled: [
      'Pattern 46 (temporal-coherence-window): calendar anchored + planner active (3+ signals) + intentions set — all within 7d. The temporal rhythm: time becoming architecture. Confidence 0.60–0.85.',
      'Archetype 16 (Temporal Architect): moderate/high energy · calendar/planner/intentions dominant · temporal-coherence-window/intention-velocity/momentum-wave patterns. Directive: Temporal rhythm established. Time is structure. The calendar holds.',
      'Logs.tsx: TCW handler (temporal_coherence_window event) — Calendar 7d · Planner 7d · Intentions 7d · Confidence · chain label',
      'PatternRecognitionWidget: temporal-coherence-window added to name map ("Temporal rhythm emerging")',
      'PatternRecognitionWidget QOS Trend view: "Temporal window active." indicator surfaces when Pattern 46 fires',
      'selfAssembly.ts: temporal-coherence-window and temporal_coherence_window routed to Temporal Planner (calendar) module',
      '46 patterns. 16 archetypes. The Cube reads the rhythm of time.',
    ],
  },
]

// ─── Usership Transmission — appended after each assembly run ───────────────
// This is the system talking to the person. Terse, technical, alive.
export const USERSHIP_TRANSMISSION = {
  date: '2026-05-14',
  message: [
    'ASSEMBLY RUN — 2026-05-14 · v28',
    'Built: Pattern 46. Archetype 16. TCW log handler. selfAssembly calendar routing.',
    'Pattern 46 (temporal-coherence-window): calendar + planner + intentions all active in 7d. Not a peak — a rhythm. The signal that time is becoming architecture. Confidence 0.60–0.85.',
    'Archetype 16 (Temporal Architect): calendar/planner/intentions dominant. Directive: Temporal rhythm established. Time is structure. The calendar holds.',
    'PatternRecognitionWidget QOS Trend: "Temporal window active." surfaces when Pattern 46 fires.',
    'TCW military log handler: Calendar 7d · Planner 7d · Intentions 7d · Confidence · "Calendar + planner + intentions in 7d" chain label.',
    'selfAssembly: temporal-coherence-window routed to Temporal Planner (calendar) module.',
    'Status: DEPLOYED. 46 patterns. 16 archetypes. 15 assembly modules.',
    'Next: Pattern 47 — goal-velocity-surge (goal signals accelerating: more goals set + completed in 7d than prior 7d).',
  ],
}

const FEEDBACK_OPTIONS = [
  { id: 'operational', label: 'Operational', symbol: '\u2191' },
  { id: 'resonating', label: 'Resonating', symbol: '\u2194' },
  { id: 'needs-calibration', label: 'Needs Calibration', symbol: '\u21BB' },
  { id: 'evolving', label: 'Self-Evolving', symbol: '\u21E1' }
] as const

/**
 * SystemProgressWidget - Self-building system surface
 * Tracks how this site assembles and evolves itself from user signals
 * Now includes Assembly Map: real-time view of which modules have self-assembled
 */
export function SystemProgressWidget() {
  const me = useStore(stores.me)
  const [feedback, setFeedback] = React.useState<FeedbackStatus | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [deployment, setDeployment] = React.useState<Deployment | null>(null)
  const [analytics, setAnalytics] = React.useState<FeedbackAnalytics | null>(null)
  const [showAnalytics, setShowAnalytics] = React.useState(false)
  const [view, setView] = React.useState<ProgressView>('deployment')

  const assembly = useStore(selfAssembly)
  const { data: energyData } = useEnergy()
  const { data: logs = [] } = useLogs()
  const [cohortData, setCohortData] = React.useState<{ archetype?: string; behavioralCohort?: string } | null>(null)

  // Last 3 non-empty user-written note entries for OS Journal field surface
  const recentEntries = React.useMemo(() => {
    return logs
      .filter((l) => l.event === 'note' && l.text && l.text.trim().length > 3)
      .slice(0, 3)
  }, [logs])
  const [report, setReport] = React.useState<ReturnType<typeof getEnrichedPhysiologicalReport> | null>(null)
  const [qos, setQos] = React.useState<QuantumOS | null>(null)
  const [osJournalLogs, setOsJournalLogs] = React.useState<
    { date: string; streak?: number; density?: number; health?: number; archetype?: string; diversityScore?: number; topSource?: string }[]
  >([])

  // Recompute assembly and surface readiness on mount — no button required
  React.useEffect(() => {
    recomputeAssembly()
    analyzeIntentions()
    setReport(getEnrichedPhysiologicalReport())
    const interval = setInterval(recomputeAssembly, 60_000) // Every minute
    return () => clearInterval(interval)
  }, [])

  // Start background QOS monitor on mount
  React.useEffect(() => {
    const stop = startBackgroundQOSMonitor()
    return stop
  }, [])

  // Load physiological cohort classification from user-profile (server-derived archetype)
  React.useEffect(() => {
    fetch('/api/user-profile')
      .then(res => res.json())
      .then(data => {
        if (data.archetype || data.behavioralCohort) {
          setCohortData({ archetype: data.archetype, behavioralCohort: data.behavioralCohort })
        }
      })
      .catch(() => {})
  }, [])

  // Load OS journal (vitals snapshots + signal reports) when view is active
  React.useEffect(() => {
    if (view !== 'os-journal') return
    fetch('/api/logs?events=os_vitals_snapshot,os_signal_report&limit=10')
      .then(res => res.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return
        const entries = data.map((l: any) => ({
          date: l.metadata?.date ?? new Date(l.createdAt).toISOString().slice(0, 10),
          streak: l.metadata?.weeklyStreakScore ?? l.metadata?.streak,
          density: l.metadata?.logCount7d ?? l.metadata?.activityDensity,
          health: l.metadata?.health,
          archetype: l.metadata?.archetype,
          diversityScore: l.metadata?.diversityScore,
          topSource: l.metadata?.topSource,
        }))
        setOsJournalLogs(entries)
      })
      .catch(() => {})
  }, [view])

  const cycleView = () => {
    setView(prev => {
      switch (prev) {
        case 'deployment': return 'assembly'
        case 'assembly': return 'feedback'
        case 'feedback': return 'report'
        case 'report': return 'os-journal'
        case 'os-journal': return 'deployment'
        default: return 'deployment'
      }
    })
  }

  const handleGenerateReport = React.useCallback(() => {
    analyzeIntentions()
    setReport(getEnrichedPhysiologicalReport())
    setQos(getQuantumOS())
  }, [])

  // Load latest deployment info
  React.useEffect(() => {
    fetch('/api/system/deployment-status')
      .then(res => res.json())
      .then(data => setDeployment(data))
      .catch(err => console.error('Failed to load deployment status:', err))
  }, [])

  // Load user's feedback if exists
  React.useEffect(() => {
    if (!deployment) return

    fetch('/api/system/my-feedback')
      .then(res => res.json())
      .then(data => {
        if (data.feedback) {
          setFeedback(data.feedback)
        }
      })
      .catch(err => console.error('Failed to load feedback:', err))
  }, [deployment])

  // Load community feedback analytics
  React.useEffect(() => {
    if (!deployment) return

    fetch('/api/system/feedback-analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error('Failed to load analytics:', err))
  }, [deployment])

  const handleFeedback = async (status: FeedbackStatus) => {
    setIsSubmitting(true)
    try {
      await fetch('/api/system/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: deployment?.version,
          feedback: status
        })
      })
      setFeedback(status)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!deployment || !me) {
    return null
  }

  const getStatusColor = () => {
    switch (deployment.status) {
      case 'activated': return 'text-green'
      case 'integrating': return 'text-blue'
      case 'synchronized': return 'text-acc'
      default: return 'opacity-30'
    }
  }

  const getStatusText = () => {
    switch (deployment.status) {
      case 'activated': return '\u2192 Self-assembly activated. Site is building.'
      case 'integrating': return '\u21BB Pathways integrating. Structure evolving from use.'
      case 'synchronized': return '\u2194 Core synchronized. System shaped by its users.'
      default: return '\u00B7 Status unknown.'
    }
  }

  const getPhaseColor = (module: AssembledModule): string => {
    switch (module.phase) {
      case 'integrated': return 'text-acc'
      case 'assembled': return 'text-green'
      case 'forming': return 'text-blue'
      case 'awakening': return 'opacity-60'
      case 'dormant': return 'opacity-20'
    }
  }

  const label =
    view === 'deployment' ? 'System Progress:' :
    view === 'assembly' ? 'Self-Assembly:' :
    view === 'feedback' ? 'System Feedback:' :
    view === 'report' ? 'System Report:' :
    'OS Journal:'

  return (
    <Block label={label} blockView onLabelClick={cycleView}>
      <div className="flex flex-col gap-y-16">

        {/* ─── Deployment View ─── */}
        {view === 'deployment' && (
          <>
            <div>
              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Build Version</span>
                <span>{deployment.version}</span>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Program</span>
                <span className="capitalize">{deployment.program}</span>
              </div>

              <div className={`mb-8 ${getStatusColor()}`}>
                {getStatusText()}
              </div>

              {/* Assembly summary in deployment view */}
              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Assembly</span>
                <span className="tabular-nums">{assembly.assembledCount}/{assembly.totalModules} modules</span>
              </div>

              <div className="flex items-center gap-8">
                <ProgressBars percentage={assembly.overallAssembly} barCount={15} />
                <span className="tabular-nums">{assembly.overallAssembly}%</span>
              </div>

              {/* Physiological readiness — live surface, auto-generated on mount */}
              {report && (
                <>
                  <div className="flex justify-between items-baseline mt-8">
                    <span className="opacity-30">Readiness</span>
                    <span className="tabular-nums">
                      {report.physiologicalReadiness}/100
                      {' '}<span className="opacity-30">{
                        report.physiologicalReadiness >= 80 ? 'high' :
                        report.physiologicalReadiness >= 60 ? 'functional' :
                        report.physiologicalReadiness >= 40 ? 'reduced' :
                        report.physiologicalReadiness >= 20 ? 'degraded' :
                        'critical'
                      }</span>
                    </span>
                  </div>
                  {report.cohortClassification && (
                    <div className="flex justify-between items-baseline mt-8">
                      <span className="opacity-30">Archetype · live</span>
                      <span className="text-right">{report.cohortClassification.archetype}</span>
                    </div>
                  )}
                  {report.activePatterns.length > 0 && (
                    <div className="flex justify-between items-baseline mt-8">
                      <span className="opacity-30">Patterns active</span>
                      <span className="tabular-nums">{report.activePatterns.length}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Features */}
            {deployment.features.length > 0 && (
              <div className="border-t border-acc-400/30 pt-16">
                <div className="opacity-30 mb-8">Self-assembled enhancements:</div>
                <div className="flex flex-col gap-y-4">
                  {deployment.features.map((feature, idx) => (
                    <div key={idx}>{'\u2192'} {feature}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Physiological cohort — deployment view surface */}
            {(cohortData?.archetype || cohortData?.behavioralCohort) && (
              <div className="border-t border-acc-400/30 pt-16">
                <div className="opacity-30 mb-8">Physiological cohort:</div>
                <div className="flex flex-col gap-y-4">
                  {cohortData?.archetype && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-50 uppercase tracking-widest text-xs">Archetype</span>
                      <span>{cohortData.archetype}</span>
                    </div>
                  )}
                  {cohortData?.behavioralCohort && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-50 uppercase tracking-widest text-xs">Cohort</span>
                      <span>{cohortData.behavioralCohort}</span>
                    </div>
                  )}
                  {energyData?.energyState && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-50 uppercase tracking-widest text-xs">Biofield ATP</span>
                      <span className="tabular-nums">
                        {energyData.energyState.currentLevel}%
                        {' '}<span className="opacity-30 capitalize">{energyData.energyState.trajectory}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Self-assembly narrative */}
            <div className="opacity-30">
              {assembly.narrative}
            </div>

            {/* Usership transmission — latest assembly run message, Usership only */}
            {me?.tags?.some((t: string) => t.toLowerCase() === 'usership') && (
              <div className="border-t border-acc-400/30 pt-16 font-mono text-xs">
                <div className="opacity-30 mb-8 uppercase tracking-widest">Transmission:</div>
                <div className="flex flex-col gap-y-2">
                  {USERSHIP_TRANSMISSION.message.map((line, i) => (
                    <div key={i} className={i === 0 ? 'opacity-80 uppercase tracking-widest' : 'opacity-50'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session reports — logged after each upgrade session */}
            <div className="border-t border-acc-400/30 pt-16">
              <div className="opacity-30 mb-8">Session logs:</div>
              <div className="flex flex-col gap-y-16">
                {SESSION_REPORTS.map((report) => (
                  <div key={report.date} className="flex flex-col gap-y-4 font-mono text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-50 uppercase tracking-widest">{report.session}</span>
                      <span className="tabular-nums opacity-40">{report.date}</span>
                    </div>
                    <div className="flex flex-col gap-y-2 pl-4">
                      {report.assembled.map((item, i) => (
                        <div key={i} className="opacity-40">&gt; {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Assembly Map View ─── */}
        {view === 'assembly' && (
          <>
            {/* Overall assembly progress */}
            <div>
              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">System Phase</span>
                <span>{phaseSymbol(assembly.phase)} {phaseLabel(assembly.phase)}</span>
              </div>
              <div className="flex items-center gap-8 mb-8">
                <ProgressBars percentage={assembly.overallAssembly} barCount={15} />
                <span className="tabular-nums">{assembly.overallAssembly}%</span>
              </div>
            </div>

            {/* Module assembly map */}
            <div className="border-t border-acc-400/30 pt-16">
              <div className="opacity-30 mb-8">Module Assembly Map:</div>
              <div className="flex flex-col gap-y-8">
                {assembly.modules.map(module => (
                  <div key={module.id}>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className={getPhaseColor(module)}>
                        {phaseSymbol(module.phase)} {module.label}
                      </span>
                      <span className="opacity-30 tabular-nums">{phaseLabel(module.phase)}</span>
                    </div>
                    {module.phase !== 'dormant' && (
                      <div className="flex items-center gap-8">
                        <ProgressBars percentage={module.density} barCount={10} />
                        <span className="opacity-30 tabular-nums">{module.density}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Physiological cohort in assembly view */}
            {(cohortData || energyData?.energyState) && (
              <div className="border-t border-acc-400/30 pt-16">
                <div className="opacity-30 mb-8">Physiological cohort:</div>
                <div className="flex flex-col gap-y-4">
                  {cohortData?.archetype && (
                    <div className="flex justify-between">
                      <span className="opacity-30">Archetype</span>
                      <span>{cohortData.archetype}</span>
                    </div>
                  )}
                  {cohortData?.behavioralCohort && (
                    <div className="flex justify-between">
                      <span className="opacity-30">Cohort</span>
                      <span>{cohortData.behavioralCohort}</span>
                    </div>
                  )}
                  {energyData?.energyState && (
                    <div className="flex justify-between">
                      <span className="opacity-30">Biofield ATP</span>
                      <span className="tabular-nums">
                        {energyData.energyState.currentLevel}%
                        {' '}<span className="opacity-30 capitalize">{energyData.energyState.trajectory}</span>
                      </span>
                    </div>
                  )}
                  {energyData?.energyState?.needsReplenishment?.[0] && (
                    <div className="flex justify-between">
                      <span className="opacity-30">Priority need</span>
                      <span className="capitalize">
                        {energyData.energyState.needsReplenishment[0].category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assembly narrative */}
            <div className="opacity-30 pt-8">
              {assembly.narrative}
            </div>
          </>
        )}

        {/* ─── Feedback View ─── */}
        {view === 'feedback' && (
          <>
            {/* Feedback Section */}
            <div>
              <div className="opacity-30 mb-8">How does the self-evolving system feel?</div>

              <div className="grid grid-cols-2 gap-8">
                {FEEDBACK_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleFeedback(option.id as FeedbackStatus)}
                    disabled={isSubmitting}
                    className={`
                      px-16 py-8 rounded border transition-all
                      ${feedback === option.id
                        ? 'border-acc grid-fill text-acc'
                        : 'border-acc-400/30 hover:border-acc-400/60 grid-fill-hover'
                      }
                      ${isSubmitting ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span>{option.symbol}</span>
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="mt-16 opacity-30">
                  Signal received. The system rebuilds around your feedback.
                </div>
              )}
            </div>

            {/* Community Feedback */}
            {analytics && analytics.totalResponses > 0 && (
              <div className="border-t border-acc-400/30 pt-16">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="w-full flex justify-between items-center opacity-30 hover:opacity-100 transition-opacity mb-8"
                >
                  <span>Collective evolution signals:</span>
                  <span>{showAnalytics ? '\u25BE' : '\u25B8'}</span>
                </button>

                {showAnalytics && (
                  <div className="flex flex-col gap-y-16">
                    {/* System Health Status */}
                    <div className="p-16 rounded border border-acc-400/30">
                      <div className="opacity-30 mb-4">Self-build health:</div>
                      <div>{analytics.systemHealth.message}</div>
                    </div>

                    {/* Feedback Distribution */}
                    <div>
                      <div className="opacity-30 mb-8">Distribution ({analytics.totalResponses} responses):</div>
                      <div className="flex flex-col gap-y-4">
                        {FEEDBACK_OPTIONS.map(option => {
                          const percentage = analytics.feedbackPercentages[option.id as keyof typeof analytics.feedbackPercentages]
                          return (
                            <div key={option.id} className="flex justify-between items-center">
                              <span className="opacity-30">{option.symbol} {option.label}</span>
                              <span className="tabular-nums">{percentage}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Insights */}
                    {analytics.insights.length > 0 && (
                      <div>
                        <div className="opacity-30 mb-8">Insights:</div>
                        <div className="flex flex-col gap-y-4">
                          {analytics.insights.map((insight, idx) => (
                            <div key={idx}>
                              {'\u21B3'} {insight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="opacity-30 pt-8">
                      Derived from {analytics.period} of collective self-building.
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ─── Self-Assembly Report View ─── */}
        {view === 'report' && (
          <>
            <div>
              <div className="opacity-30 mb-8">Self-assembly session report.</div>
              {!report ? (
                <button
                  onClick={handleGenerateReport}
                  className="opacity-30 hover:opacity-100 transition-opacity"
                >
                  Generate report →
                </button>
              ) : (
                <div className="flex flex-col gap-y-16 font-mono text-xs">

                  {/* Header */}
                  <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between">
                      <span className="opacity-30 uppercase tracking-widest">Date</span>
                      <span className="tabular-nums">{report.sessionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-30 uppercase tracking-widest">Sys health</span>
                      <span className="uppercase tracking-widest">{report.systemHealth}</span>
                    </div>
                  </div>

                  {/* Widget dependency audit */}
                  {report.widgetDependencies.length > 0 && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">Widget signals · 7d</div>
                      <div className="flex flex-col gap-y-2">
                        {report.widgetDependencies.map(dep => (
                          <div key={dep.widget} className="flex justify-between">
                            <span className="opacity-50 uppercase">{dep.widget}</span>
                            <span className="tabular-nums">
                              {dep.signalCount}
                              {dep.lastSeen && (
                                <span className="opacity-30 ml-8">{dep.lastSeen}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Log dependency audit */}
                  {report.logDependencies.length > 0 && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">Log signals · 7d</div>
                      <div className="flex flex-col gap-y-2">
                        {report.logDependencies.map(dep => (
                          <div key={dep.source} className="flex justify-between">
                            <span className="opacity-50 uppercase">{dep.source}</span>
                            <span className="tabular-nums">{dep.signalCount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Physiological readiness */}
                  <div className="border-t border-acc-400/30 pt-12">
                    <div className="opacity-30 mb-8 uppercase tracking-widest">Physiological Readiness</div>
                    <div className="flex flex-col gap-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="opacity-50 uppercase">Score</span>
                        <span className="tabular-nums">{report.physiologicalReadiness}/100</span>
                      </div>
                      <div className="opacity-40 text-xs">{report.readinessDirective}</div>
                    </div>
                  </div>

                  {/* Biofield status */}
                  <div className="border-t border-acc-400/30 pt-12">
                    <div className="opacity-30 mb-8 uppercase tracking-widest">Biofield state</div>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Energy</span>
                        <span className="capitalize">{report.biofieldStatus.energyLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Clarity</span>
                        <span className="capitalize">{report.biofieldStatus.clarity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Alignment</span>
                        <span className="capitalize">{report.biofieldStatus.alignment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Support</span>
                        <span className="capitalize">{report.biofieldStatus.supportNeeded}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active patterns */}
                  {report.activePatterns.length > 0 && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">Active patterns</div>
                      <div className="flex flex-col gap-y-2">
                        {report.activePatterns.map((p, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="opacity-50 uppercase">{p.pattern.replace(/-/g, ' ')}</span>
                            <span className="tabular-nums opacity-30">{p.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Physiological cohort — real-time QIE classification */}
                  {report.cohortClassification && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">Physiological cohort · live</div>
                      <div className="flex flex-col gap-y-2">
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Archetype</span>
                          <span>{report.cohortClassification.archetype}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Energy</span>
                          <span className="capitalize">{report.cohortClassification.energyBand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Module</span>
                          <span className="capitalize">{report.cohortClassification.dominantModule}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Conf</span>
                          <span className="tabular-nums">{report.cohortClassification.confidence}%</span>
                        </div>
                        <div className="opacity-30 text-xs mt-4">{report.cohortClassification.directive}</div>
                      </div>
                    </div>
                  )}

                  {/* Cohort signals — server-derived archetype */}
                  {(report.cohortSignals.archetype || report.cohortSignals.behavioralCohort || cohortData) && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">Cohort · server</div>
                      {(report.cohortSignals.archetype ?? cohortData?.archetype) && (
                        <div className="flex justify-between mb-2">
                          <span className="opacity-50 uppercase">Archetype</span>
                          <span>{report.cohortSignals.archetype ?? cohortData?.archetype}</span>
                        </div>
                      )}
                      {(report.cohortSignals.behavioralCohort ?? cohortData?.behavioralCohort) && (
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Cohort</span>
                          <span>{report.cohortSignals.behavioralCohort ?? cohortData?.behavioralCohort}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* QOS state — circadian phase, trend, latest snapshot */}
                  <div className="border-t border-acc-400/30 pt-12">
                    <div className="opacity-30 mb-8 uppercase tracking-widest">Quantum OS state</div>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Circadian</span>
                        <span className="uppercase tracking-widest">
                          {('circadianPhase' in report ? report.circadianPhase : getCircadianPhase()).replace(/-/g, ' ')}
                        </span>
                      </div>
                      {'qosTrend' in report && (
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">QOS trend</span>
                          <span className="uppercase tracking-widest">{report.qosTrend}</span>
                        </div>
                      )}
                      {'latestQOSSnapshot' in report && report.latestQOSSnapshot && (
                        <>
                          <div className="flex justify-between">
                            <span className="opacity-50 uppercase">Signals 24h</span>
                            <span className="tabular-nums">{report.latestQOSSnapshot.signalCount24h}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-50 uppercase">Modules active</span>
                            <span className="tabular-nums">{report.latestQOSSnapshot.modulesActive}</span>
                          </div>
                          {report.latestQOSSnapshot.topPattern && (
                            <div className="flex justify-between">
                              <span className="opacity-50 uppercase">Top pattern</span>
                              <span className="uppercase tracking-widest opacity-70">
                                {report.latestQOSSnapshot.topPattern.replace(/-/g, ' ')}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* User index — 6D composite */}
                  {report.userIndex && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">
                        User index · {report.userIndex.overall}{' '}
                        <span className="opacity-60 normal-case">{report.userIndex.trend}</span>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        {([
                          ['Engagement', report.userIndex.engagement],
                          ['Emotional',  report.userIndex.emotional],
                          ['Intentional',report.userIndex.intentional],
                          ['Social',     report.userIndex.social],
                          ['Self-care',  report.userIndex.selfCare],
                          ['Cognitive',  report.userIndex.cognitive],
                        ] as [string, number][]).map(([label, val]) => (
                          <div key={label} className="flex justify-between">
                            <span className="opacity-50 uppercase">{label}</span>
                            <span className="tabular-nums">{val}</span>
                          </div>
                        ))}
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Src active</span>
                          <span className="tabular-nums">{report.userIndex.activeSourceCount}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assembly state */}
                  <div className="border-t border-acc-400/30 pt-12">
                    <div className="opacity-30 mb-8 uppercase tracking-widest">Assembly state</div>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Modules</span>
                        <span className="tabular-nums">{assembly.assembledCount}/{assembly.totalModules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-50 uppercase">Progress</span>
                        <span className="tabular-nums">{assembly.overallAssembly}%</span>
                      </div>
                    </div>
                  </div>

                  {/* QOS snapshot — full runtime model */}
                  {qos && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">
                        QOS · {qos.operationalStatus.toUpperCase()} · {qos.runtime.circadianPhase?.toUpperCase() ?? '—'}
                      </div>
                      <div className="flex flex-col gap-y-2 mb-8">
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Index</span>
                          <span className="tabular-nums">
                            {qos.index.overall}
                            <span className="opacity-30 ml-8 uppercase">{qos.index.trend}</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-50 uppercase">Coherence</span>
                          <span className="tabular-nums">{qos.coherence}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        {(Object.entries(qos.index.dimensions) as [string, number][]).map(([dim, val]) => (
                          <div key={dim} className="flex justify-between">
                            <span className="opacity-30 uppercase">{dim.slice(0, 4)}</span>
                            <span className={`tabular-nums ${val >= 50 ? '' : val >= 30 ? 'opacity-60' : 'opacity-30'}`}>
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                      {qos.patterns.length > 0 && (
                        <div className="mt-8">
                          <div className="opacity-30 mb-4 uppercase tracking-widest">Active directives</div>
                          <div className="flex flex-col gap-y-2">
                            {qos.patterns.filter(p => p.urgency === 'immediate' || p.urgency === 'soon').slice(0, 3).map(p => (
                              <div key={p.id} className="opacity-40">&gt; {p.directive}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="opacity-30 pt-4 uppercase tracking-widest border-t border-acc-400/20 pt-12">
                    Generated {new Date(report.generatedAt).toISOString().replace('T', ' ').slice(0, 19)}Z
                  </div>

                  <button
                    onClick={handleGenerateReport}
                    className="opacity-30 hover:opacity-100 transition-opacity text-left"
                  >
                    Refresh report →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {/* ─── OS Journal View ─── */}
        {view === 'os-journal' && (
          <>
            {/* ─── Field entries — user's own words reflected back ─── */}
            {recentEntries.length > 0 && (
              <div>
                <div className="opacity-30 mb-8 uppercase tracking-widest font-mono text-xs">Field entries:</div>
                <div className="flex flex-col gap-y-12 font-mono text-xs">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="flex flex-col gap-y-2">
                      <div className="opacity-30 tabular-nums">
                        {new Date(entry.createdAt).toISOString().slice(0, 10)}
                      </div>
                      <div className="opacity-60">
                        {entry.text!.trim().length > 80
                          ? entry.text!.trim().slice(0, 80) + '...'
                          : entry.text!.trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="opacity-30 mb-8">OS vitals and signal reports.</div>
              {osJournalLogs.length === 0 ? (
                <div className="flex flex-col gap-y-12 font-mono text-xs">
                  <div className="opacity-30">No persisted snapshots. Vitals log daily at 02:00 UTC.</div>
                  {report && (
                    <div className="border-t border-acc-400/20 pt-12 flex flex-col gap-y-4">
                      <div className="opacity-40 uppercase tracking-widest mb-4">Session · {report.sessionDate}</div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Readiness</span>
                        <span className="tabular-nums">{report.physiologicalReadiness}/100</span>
                      </div>
                      <div className="opacity-40">{report.readinessDirective}</div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Energy</span>
                        <span className="capitalize">{report.biofieldStatus.energyLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Clarity</span>
                        <span className="capitalize">{report.biofieldStatus.clarity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Assembly</span>
                        <span className="tabular-nums">{assembly.assembledCount}/{assembly.totalModules} modules · {assembly.overallAssembly}%</span>
                      </div>
                      <div className="opacity-30 pt-4">{assembly.narrative}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-y-16 font-mono text-xs">
                  {osJournalLogs.map((entry, idx) => (
                    <div key={idx} className="flex flex-col gap-y-4 border-t border-acc-400/20 pt-12">
                      <div className="opacity-40 uppercase tracking-widest mb-4">{entry.date}</div>
                      {entry.streak !== undefined && (
                        <div className="flex justify-between">
                          <span className="opacity-30 uppercase">Streak score</span>
                          <span className="tabular-nums">{entry.streak}</span>
                        </div>
                      )}
                      {entry.density !== undefined && (
                        <div className="flex justify-between">
                          <span className="opacity-30 uppercase">Log density 7d</span>
                          <span className="tabular-nums">{entry.density}</span>
                        </div>
                      )}
                      {entry.diversityScore !== undefined && (
                        <div className="flex justify-between">
                          <span className="opacity-30 uppercase">Signal diversity</span>
                          <span className="tabular-nums">{entry.diversityScore}%</span>
                        </div>
                      )}
                      {entry.topSource && (
                        <div className="flex justify-between">
                          <span className="opacity-30 uppercase">Top source</span>
                          <span className="uppercase">{entry.topSource}</span>
                        </div>
                      )}
                      {entry.archetype && (
                        <div className="flex justify-between">
                          <span className="opacity-30 uppercase">Archetype</span>
                          <span>{entry.archetype}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Physiological cohort summary */}
            {cohortData && (
              <div className="border-t border-acc-400/30 pt-16">
                <div className="opacity-30 mb-8 uppercase tracking-widest">Current cohort</div>
                <div className="flex flex-col gap-y-4 font-mono text-xs">
                  {cohortData.archetype && (
                    <div className="flex justify-between">
                      <span className="opacity-30 uppercase">Archetype</span>
                      <span>{cohortData.archetype}</span>
                    </div>
                  )}
                  {cohortData.behavioralCohort && (
                    <div className="flex justify-between">
                      <span className="opacity-30 uppercase">Cohort</span>
                      <span>{cohortData.behavioralCohort}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assembly module count */}
            <div className="border-t border-acc-400/30 pt-16">
              <div className="flex justify-between font-mono text-xs">
                <span className="opacity-30 uppercase">Modules online</span>
                <span className="tabular-nums">{assembly.assembledCount}/{assembly.totalModules}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </Block>
  )
}
