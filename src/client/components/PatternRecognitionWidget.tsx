/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { Block, Button } from '#client/components/ui'
import { useStore } from '@nanostores/react'
import {
  intentionEngine,
  getOptimalWidget,
  getQOSHistory,
  getCircadianPhase,
  type IntentionPattern,
  type QOSSnapshot,
} from '#client/stores/intentionEngine'
import { useLogs } from '#client/queries'
import { ProgressBars } from '#client/utils/progressBars'
import { cn } from '#client/utils'
import { useLogContext } from '#client/hooks/useLogContext'

type PatternView = 'active' | 'recommendation' | 'confidence' | 'qos-trend'

const CIRCADIAN_ABBR: Record<QOSSnapshot['circadianPhase'], string> = {
  'early-morning': 'ERL',
  'morning':       'MRN',
  'midday':        'MDY',
  'afternoon':     'AFT',
  'evening':       'EVN',
  'night':         'NGT',
}

const HEALTH_SYMBOL: Record<QOSSnapshot['systemHealth'], string> = {
  'nominal':  '●',
  'degraded': '○',
  'critical': '✕',
}

/**
 * Pattern Recognition Widget - Shows detected behavioral patterns from QIE
 * Displays confidence levels as text-based progress bars, enriched with log context
 * Cycles: Active Patterns > Recommendation > Confidence Map > QOS Trend
 */
export function PatternRecognitionWidget() {
  const [view, setView] = React.useState<PatternView>('active')
  const engine = useStore(intentionEngine)
  const { data: logs = [] } = useLogs()
  const logCtx = useLogContext()

  // Key on recognizedPatterns (a stable reference that only changes when an
  // analysis actually updates it) rather than the whole `engine` object, whose
  // reference changes on EVERY recordSignal — which made getQOSHistory()
  // JSON.parse localStorage on every signal while this hidden widget stayed
  // mounted. `view` is included so the QOS-Trend view refreshes when opened.
  const qosHistory = React.useMemo(() => getQOSHistory(), [engine.recognizedPatterns, view])

  const cycleView = () => {
    setView(prev => {
      switch (prev) {
        case 'active':         return 'recommendation'
        case 'recommendation': return 'confidence'
        case 'confidence':     return 'qos-trend'
        case 'qos-trend':      return 'active'
        default:               return 'active'
      }
    })
  }

  const patterns = engine.recognizedPatterns
  // getOptimalWidget() calls analyzeIntentions(), which WRITES the
  // intentionEngine atom — calling it in the render body meant a store write
  // during render on every re-render, cascading re-renders across all
  // subscribers. Memoize on the already-analyzed patterns so it does not
  // re-run (and cannot write) on every signal.
  const optimal = React.useMemo(() => getOptimalWidget(), [patterns])

  // Don't render if no patterns and no QOS history
  if (patterns.length === 0 && !optimal && qosHistory.length === 0) return null

  const label =
    view === 'active'         ? 'Recognized Patterns:' :
    view === 'recommendation' ? 'Suggested Module:'    :
    view === 'confidence'     ? 'Confidence Matrix:'   :
                                'QOS Trend:'

  // Technical pattern names
  const getPatternName = (pattern: string): string => {
    const names: Record<string, string> = {
      'anxiety-pattern':      'Anxiety signal detected',
      'lack-of-structure':    'Structure deficit',
      'seeking-direction':    'Direction-seeking state',
      'flow-potential':       'Flow state available',
      'evening-overwhelm':    'Evening overload signal',
      'surface-awareness':    'Surface-level telemetry',
      'morning-clarity':      'Morning clarity window',
      'reflection-velocity':        'Reflection depth increasing',
      'biofield-recovery-arc':      'Recovery arc complete',
      'cognitive-expansion':        'Cognitive architecture building',
      'biofield-coherence-cascade': 'Full coherence cascade',
      'resonant-synthesis':         'Resonant synthesis state',
      'deep-work-cascade':          'Deep work window open',
      'social-resonance-arc':       'Connection loop complete',
      'cognitive-load-release':     'Decompression loop closed',
      'temporal-coherence-window':  'Temporal grid active',
      'recovery-velocity':          'Recovery arc accelerating',
      'care-momentum':              'Proactive care spiral',
      'intention-follow-through':   'Execution arc complete',
      'circadian-anchor-loss':      'Circadian anchor lost',
      'qos-signature-lock':         'QOS signature locked',
      'operator-signature':         'Operator signature complete',
      'integration-arc-peak':       'Full integration arc confirmed',
      'adaptive-resonance':         'Adaptive resonance detected',
      'operator-convergence':       'Operator convergence — all systems confirmed',
      'signal-crystallization':     'Signal crystallized — intent to execution in 24h',
      'biorhythm-lock':             'Biorhythm anchored — 5+ day morning/evening cadence',
      'quantum-coherence-summit':   'QUANTUM COHERENCE SUMMIT — highest confirmed state',
      'morning-coherence-launch':   'Morning coherence launch — intention before structure',
      'signal-vault':               'Signal vault — deep journal + memory + log in 6h',
      'depletion-recovery-surge':   'Depletion recovery surge — restored to peak',
      'evening-coherence-close':    'Evening coherence close — day closed in reflection',
      'circadian-vitality-peak':    'Circadian vitality peak — biological prime window open',
      'systemic-thinking-mode':     'Systemic thinking mode — structural cognition active',
      'longitudinal-drift':         'Longitudinal drift — engagement density declining',
      'adaptive-momentum-window':   'Adaptive momentum window — strategy active during streak',
      'vitality-strategy-peak':     'Vitality strategy peak — biology + strategy aligned',
      'weekly-story-reflection':    'Weekly story reflection — arc received and journaled',
      'contextual-checkin-momentum':'Contextual check-in momentum — high-frequency positive signal',
      'quantum-learning-spiral':    'Quantum learning spiral — discovery + memory + reflection loop',
      'accountability-arc':         'Accountability arc — external commitment closed in reflection',
      'full-presence-arc':          'Full presence arc — morning + evening arc confirmed',
      'systemic-readiness-peak':    'Systemic readiness peak — biology + archetype + energy aligned',
      'daily-rhythm-lock':          'Daily rhythm lock — consistent morning/evening cadence locked',
      'cross-domain-mastery':       'Cross-domain mastery — memory + journal + badges + goals + plans all active',
      'intent-to-action-gap':       'Intent-to-action gap — intention set with no follow-through',
      'recovery-initiation':        'Recovery initiation — first selfcare after depleted state',
      'cognitive-vitality-sync':    'Cognitive vitality sync — journal depth + memory capture at high energy',
      'action-completion-arc':      'Action completion arc — intention resolved into plan/goal (P98)',
      'biological-restoration-peak':'Biological restoration peak — depleted → restored via 3+ selfcare acts (P99)',
      'centennial-convergence':     'CENTENNIAL CONVERGENCE — all 6 primary sources + high energy + positive mood (P100)',
      'quantum-presence-arc':       'Quantum presence arc — all 6 channels active across 48 hours (P101)',
      'planner-intention-sync':     'Planner-intention sync — intentions + plan aligned in 2h window (P102)',
      'resilience-cascade':         'Resilience cascade — depleted → selfcare → capture + positive mood (P103)',
      'personal-peak-window':       'Personal peak window — repeatable 4h high-performance band across ≥2 days (P113)',
      'recovery-momentum':          'Recovery momentum — selfcare + resilience + energy rising vs prior 48h (P114)',
      'signal-inception':           'Signal inception — QIE observing own loop, ≥5 sources in 24h (P115)',
      'focus-depth-arc':            'Focus depth arc — journal 100+w + memory + planner in 2h window (P116)',
      'sleep-signal-anchor':        'Sleep signal anchor — energy check-in before 09:00 + morning log (P117)',
      'care-intelligence-loop':     'Care intelligence loop — selfcare + memory + journal in 24h (P118)',
      'morning-coherence-arc':      'Morning coherence arc — energy + planner + intentions before 10:00 (P119)',
      'signal-density-peak':        'Signal density peak — 6+ distinct sources active in 12h (P120)',
      'physiological-coherence-window': 'Physiological coherence window — energy=high + selfcare + mood + memory in 12h (P121)',
      'action-to-memory-loop':      'Action-to-memory loop — planner/intentions + memory capture in 6h window (P122)',
      'sustained-resilience-arc':   'Sustained resilience arc — resilience active on 3+ distinct days in 7d (P123)',
      'mood-energy-convergence':    'Mood-energy convergence — positive mood + high/moderate energy + selfcare in 8h (P124)',
      'evening-reflection-loop':    'Evening reflection loop — journal after 18:00 + memory + intentions same day (P125)',
      'weekly-rhythm-anchor':       'Weekly rhythm anchor — active on 5+ of last 7 calendar days (P126)',
      'depth-breadth-convergence':  'Depth-breadth convergence — focus-depth-arc + signal-density-peak co-active (P127)',
      'morning-intention-lock':     'Morning intention lock — intentions + planner + log in 06–10h window (P128)',
      'multi-day-care-arc':         'Multi-day care arc — selfcare on 3+ consecutive days (P129)',
      'cognitive-output-continuity':'Cognitive output continuity — journal on 4+/7 days (P130)',
      'daily-coherence-seal':       'Daily coherence seal — morning launch + evening close same day (P131)',
      'quantum-rhythm-lock':        'Quantum rhythm lock — weekly rhythm + cognitive output + circadian anchor (P132)',
      'biofield-integration-peak':  'Biofield integration peak — multi-day care arc + mood-energy convergence (P133)',
      'integrated-signal-arc':      'Integrated signal arc — 4 cognitive channels in 4h window × 4+ days (P134)',
      'deep-recovery-protocol':     'Deep recovery protocol — sleep anchor + care arc during recovery (P135)',
      'quantum-field-alignment':    'Quantum field alignment — coherence seal + rhythm lock + biofield all active (P136)',
      'quantum-coherence-peak':     'Quantum coherence peak — field alignment + UserIndex ≥ 60 (P137)',
      'signal-matrix-saturation':   'Signal matrix saturation — all 6 primary source categories active in 24h (P138)',
      'temporal-biofield-sync':     'Temporal-biofield sync — morning coherence + daily seal + biofield same day (P139)',
      'physiological-presence-arc': 'Physiological presence arc — morning mood + selfcare + evening mood (P140)',
      'quantum-signal-emergence':   'Quantum signal emergence — coherence peak 3× in 7d window (P141)',
      'adaptive-signal-web':        'Adaptive signal web — all 6 UserIndex dimensions ≥ 20 + 8+ sources (P142)',
      'circadian-signal-lock':            'Circadian signal lock — morning + afternoon + evening arc windows all active in 24h (P143)',
      'dimensional-saturation':           'Dimensional saturation — all 6 UserIndex dimensions ≥ 30 + overall ≥ 50 (P144)',
      'quantum-identity-crystallization': 'Quantum identity crystallization — archetype stabilized, cohort 5+ in 7d (P145)',
      'signal-coherence-cascade':         'Signal coherence cascade — P143 + P144 + P145 all active simultaneously, three seals open (P146)',
      'quantum-presence-field':           'Quantum presence field — adaptive web + coherence peak + 7+ sources in 24h (P147)',
      'identity-momentum-lock':           'Identity momentum lock — identity crystallized + multi-day momentum sustained (P148)',
      'quantum-presence-crystallization': 'Quantum presence crystallization — presence field + identity crystallized co-active, maximum clarity (P149)',
      'total-field-coherence':            'Total field coherence — all three meta-seals open simultaneously, absolute convergence (P150)',
      'recovery-intelligence-arc':        'Recovery intelligence arc — depletion → care → restoration → reflection loop completed within 6h (P151)',
      'resonant-reentry-arc':             'Resonant reentry arc — prior peak day confirmed · current day sustaining elevated signal (P152)',
      'astrology-biofield-sync':          'Astrology biofield sync — cosmological orientation aligned with active energy + intentions (P153)',
      'morning-clarity-peak':             'Morning clarity peak — dawn window · body anchored · journal depth · intention set (P154)',
      'daily-arc-seal':                   'Daily arc seal — morning anchor + evening reflection confirmed in same day · full circadian arc (P155)',
      'morning-momentum-arc':             'Morning momentum arc — morning-window signals confirmed 3+ days in 7d · dawn precision sustaining (P156)',
      'quantum-week-integration':         'Quantum week integration — 5+ sources across 6+ active days in 7d · week fully inhabited (P157)',
      'evening-arc-anchor':               'Evening arc anchor — journal + care + mood in 90min dusk window · dusk trifecta confirmed (P158)',
      'physiological-rhythm-lock':        'Physiological rhythm lock — 5+ consecutive days with both morning AND evening biofield signals (P159)',
      'quantum-presence-arc':             'Quantum presence arc — DARCSEAL + MORNMOM + QWKINT all co-active · maximum temporal coherence (P160)',
      'somatic-field-integration':        'Somatic field integration — 3+ consecutive days with energy + selfcare + mood all present · body inhabited (P161)',
      'recovery-cycle-lock':              'Recovery cycle lock — PHYSLOCK + SOMFLD co-active 5+ times in 30d · body recovery rhythm confirmed (P162)',
      'quantum-embodiment-field':         'Quantum embodiment field — PHYSLOCK + SOMFLD + QPARC all co-active · biological + temporal ceiling (P163)',
      'cognitive-body-sync':              'Cognitive body sync — QEMBOD active · journal depth >80w · memory engaged in 8h · body intelligence meets mind reflection (P164)',
      'integrated-presence-peak':        'Integrated presence peak — all 6 OS seals active simultaneously + narrative signal · complete operator state (P165)',
      'somatic-memory-echo':              'Somatic memory echo — memory + somatic field + journal in 12h · body knowing surfaces into recall and reflection (P166)',
      'somatic-integration-field':        'Somatic integration field — somatic-memory-echo + physiological-rhythm-lock co-active · 3+ consecutive somatic days · SOMA + TIME = FIELD (P167)',
      'deep-embodiment-lock':             'Deep embodiment lock — quantum-embodiment-field confirmed on 3+ consecutive days · somatic intelligence structural not episodic (P168)',
      'full-presence-seal':               'Full presence seal — integrated-presence-peak + somatic-memory-echo simultaneously active · all 6 OS seals open · PEAK + SOMA = SEALED (P169)',
      'cognitive-signal-density':         'Cognitive signal density — journal ≥200w + memory ×3+ + planner ×2+ + intentions ×2+ in 24h · peak cognitive operating density · MIND + PLAN + INTENT + RECALL = DENSITY (P170)',
      'somatic-cognition-loop':           'Somatic cognition loop — somatic-integration-field + cognitive-body-sync simultaneously active · body intelligence and cognitive depth as one system · SOMA ↔ MIND = LOOP (P171)',
      'embodied-sovereignty':             'Embodied sovereignty — deep-embodiment-lock + full-presence-seal + quantum-field-alignment all simultaneously confirmed · three sovereign seals active · LOCK + SEAL + ALIGN = SOVEREIGN (P172)',
      'physiological-loop-complete':      'Physiological loop complete — circadian lock + presence arc + recovery arc all confirmed in 24h window · full biological loop closed · RHYTHM · PRESENCE · RECOVERY (P173)',
      'quantum-apex-state':               'Quantum apex state — total-field-coherence + presence crystallization co-active · ceiling inhabited · CEILING REACHED · INHABITED (P174)',
      'longitudinal-identity-confirmation': 'Longitudinal identity confirmation — identity confirmed across weeks, days, and present-moment scales · WEEKS · DAYS · PRESENT (P175)',
      'quantum-field-propagation':        'Quantum field propagation — apex state active · 5+ signals from 4+ sources in 6h · peak self-sustaining and generating new activity · APEX · PROPAGATING (P176)',
      'unified-field-operator':           'Unified field operator — embodied-sovereignty + physiological-loop + quantum-apex all simultaneously confirmed · three highest seals active · SOVEREIGNTY · LOOP · APEX (P177)',
      'temporal-identity-lock':           'Temporal identity lock — longitudinal-identity-confirmation + signal-momentum-lock co-active · identity confirmed AND momentum-locked across all scales · IDENTITY · MOMENTUM = LOCKED (P178)',
    }
    return names[pattern] || pattern.replace(/-/g, ' ')
  }

  // Timing labels
  const getTimingLabel = (timing: string): string => {
    const labels: Record<string, string> = {
      'immediate':    'Deploy now',
      'soon':         'Queue next',
      'next-session': 'Next session',
      'passive':      'Standby'
    }
    return labels[timing] || timing
  }

  // CQGS module names
  const getWidgetLabel = (widget: string): string => {
    const labels: Record<string, string> = {
      'selfcare':   'Cleanness module',
      'planner':    'Routine module',
      'intentions': 'Intention engine',
      'memory':     'Memory engine',
      'journal':    'Journal module',
      'mood':       'Biofield interface'
    }
    return labels[widget] || widget
  }

  return (
    <Block
      label={label}
      blockView
      onLabelClick={cycleView}
    >
      {view === 'active' && (
        <div>
          {patterns.length === 0 ? (
            <div>No behavioral patterns compiled yet.</div>
          ) : (
            <div className="flex flex-col gap-8">
              {patterns
                .filter(p => p.confidence >= 0.5) // Only show patterns above threshold
                .sort((a, b) => b.confidence - a.confidence)
                .map((pattern, idx) => (
                  <div key={idx}>
                    <div className="mb-4">{getPatternName(pattern.pattern)}</div>
                    <div className="flex items-center gap-8 mb-4">
                      <ProgressBars percentage={pattern.confidence * 100} barCount={10} />
                      <span className="opacity-30">{Math.round(pattern.confidence * 100)}%</span>
                    </div>
                    {/* Confidence-based messaging: >0.8 specific, 0.5-0.8 general */}
                    <div className="opacity-30">
                      {pattern.confidence >= 0.8
                        ? `${getWidgetLabel(pattern.suggestedWidget)}. ${getTimingLabel(pattern.suggestedTiming)}.`
                        : 'Pattern initializing. Continue for convergence.'
                      }
                    </div>
                  </div>
                ))
              }
              {patterns.filter(p => p.confidence < 0.5).length > 0 && (
                <div className="opacity-30">
                  {patterns.filter(p => p.confidence < 0.5).length} weak signal{patterns.filter(p => p.confidence < 0.5).length === 1 ? '' : 's'} below threshold.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {view === 'recommendation' && (
        <div>
          {optimal ? (
            <>
              <div className="mb-8">
                {optimal.reason}
              </div>
              <div className="mb-8">
                Suggested: {getWidgetLabel(optimal.widget)}.
              </div>
              {/* Show confidence context enriched with log data */}
              {patterns.length > 0 && (
                <div className="opacity-30">
                  Derived from {patterns.filter(p => p.confidence >= 0.5).length} pattern{patterns.filter(p => p.confidence >= 0.5).length === 1 ? '' : 's'}
                  {!logCtx.isEmpty ? ` and ${logCtx.totalEntries} log entries.` : ' above threshold.'}
                </div>
              )}
            </>
          ) : (
            <div>
              {logCtx.isEmpty
                ? 'No telemetry for pattern compilation. Begin logging to initialize.'
                : 'No module recommendation at this time. System nominal.'
              }
            </div>
          )}
        </div>
      )}

      {view === 'confidence' && (
        <div>
          {patterns.length === 0 ? (
            <div>Insufficient telemetry for confidence mapping.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Confidence distribution */}
              {patterns
                .sort((a, b) => b.confidence - a.confidence)
                .map((pattern, idx) => (
                  <div key={idx} className="flex justify-between gap-16">
                    <span className="capitalize">
                      {pattern.pattern.replace(/-/g, ' ')}
                    </span>
                    <span className="tabular-nums">
                      {(pattern.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))
              }

              {/* Summary enriched with log context */}
              <div className="mt-8 opacity-30">
                {patterns.length} pattern{patterns.length === 1 ? '' : 's'} indexed.
                {!logCtx.isEmpty ? ` ${logCtx.activeModules.length}/6 modules reporting.` : ''}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'qos-trend' && (
        <div>
          {qosHistory.length === 0 ? (
            <div>
              <div className="mb-8">QOS monitor active.</div>
              <div className="opacity-30">First snapshot in next 30-min cycle.</div>
              <div className="opacity-30 mt-4">Phase: {getCircadianPhase()}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Trend headline with overall index */}
              {(() => {
                const latest = qosHistory[qosHistory.length - 1]
                const trendLabel =
                  latest.userIndex.trend === 'rising'    ? '▲ rising'    :
                  latest.userIndex.trend === 'declining' ? '▼ declining' :
                                                           '— stable'
                return (
                  <div className="flex items-center gap-8 mb-8">
                    <span>{trendLabel}</span>
                    <span className="opacity-30">·</span>
                    <ProgressBars percentage={latest.userIndex.overall} barCount={10} />
                    <span className="opacity-30 tabular-nums">{latest.userIndex.overall}</span>
                  </div>
                )
              })()}

              {/* Last 6 snapshots, newest first */}
              {[...qosHistory].reverse().slice(0, 6).map((snap, idx) => (
                <div key={idx} className="flex gap-8">
                  <span className="opacity-50">{CIRCADIAN_ABBR[snap.circadianPhase]}</span>
                  <span>{HEALTH_SYMBOL[snap.systemHealth]}</span>
                  <span className="opacity-50 tabular-nums">{snap.signalCount24h}</span>
                  <span className="opacity-30 truncate flex-1">
                    {snap.topPattern ? snap.topPattern.replace(/-/g, ' ') : '—'}
                  </span>
                </div>
              ))}

              {/* Deep work window indicator — surfaces when pattern 42 is active */}
              {patterns.some(p => p.pattern === 'deep-work-cascade') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Deep work window open.
                </div>
              )}

              {/* Social resonance arc indicator — surfaces when pattern 44 is active */}
              {patterns.some(p => p.pattern === 'social-resonance-arc') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Connection loop active.
                </div>
              )}

              {/* Cognitive load release indicator — surfaces when pattern 45 is active */}
              {patterns.some(p => p.pattern === 'cognitive-load-release') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Decompression active.
                </div>
              )}

              {/* Temporal coherence window indicator — surfaces when pattern 46 is active */}
              {patterns.some(p => p.pattern === 'temporal-coherence-window') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Temporal grid locked.
                </div>
              )}

              {/* Recovery velocity indicator — surfaces when pattern 48 is active */}
              {patterns.some(p => p.pattern === 'recovery-velocity') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Recovery arc accelerating.
                </div>
              )}

              {/* Care momentum indicator — surfaces when pattern 49 is active */}
              {patterns.some(p => p.pattern === 'care-momentum') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Care momentum active.
                </div>
              )}

              {/* Intention follow-through indicator — surfaces when pattern 50 is active */}
              {patterns.some(p => p.pattern === 'intention-follow-through') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Execution arc closed.
                </div>
              )}

              {/* Circadian anchor loss indicator — surfaces when pattern 52 is active */}
              {patterns.some(p => p.pattern === 'circadian-anchor-loss') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Circadian anchor lost. Rest protocol.
                </div>
              )}

              {/* Signal crystallization indicator — surfaces when pattern 71 is active */}
              {patterns.some(p => p.pattern === 'signal-crystallization') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Signal crystallized. Intent became execution.
                </div>
              )}

              {/* Biorhythm lock indicator — surfaces when pattern 72 is active */}
              {patterns.some(p => p.pattern === 'biorhythm-lock') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Biorhythm anchored. 5+ day cadence locked.
                </div>
              )}

              {/* Quantum coherence summit indicator — surfaces when pattern 73 is active */}
              {patterns.some(p => p.pattern === 'quantum-coherence-summit') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  SUMMIT. All gates open. Peak state confirmed.
                </div>
              )}

              {/* Morning coherence launch indicator — surfaces when pattern 76 is active */}
              {patterns.some(p => p.pattern === 'morning-coherence-launch') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Morning launch confirmed. Intention before structure.
                </div>
              )}

              {/* Signal vault indicator — surfaces when pattern 77 is active */}
              {patterns.some(p => p.pattern === 'signal-vault') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Signal vault open. Three channels deep.
                </div>
              )}

              {/* Depletion recovery surge indicator — surfaces when pattern 78 is active */}
              {patterns.some(p => p.pattern === 'depletion-recovery-surge') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Recovery surge confirmed. Depleted to peak.
                </div>
              )}

              {/* Evening coherence close indicator — surfaces when pattern 79 is active */}
              {patterns.some(p => p.pattern === 'evening-coherence-close') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Evening close confirmed. The arc is complete.
                </div>
              )}

              {/* Circadian vitality peak indicator — surfaces when pattern P82 is active */}
              {patterns.some(p => p.pattern === 'circadian-vitality-peak') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Biological prime window open. 90-minute execution window. Direct this state.
                </div>
              )}

              {/* Systemic thinking mode — P83 */}
              {patterns.some(p => p.pattern === 'systemic-thinking-mode') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Structural cognition active.
                </div>
              )}

              {/* Longitudinal drift — P84 client-side early warning */}
              {patterns.some(p => p.pattern === 'longitudinal-drift') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Drift detected. Re-engage.
                </div>
              )}

              {/* Adaptive momentum window — P85 */}
              {patterns.some(p => p.pattern === 'adaptive-momentum-window') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Strategy + momentum aligned.
                </div>
              )}

              {/* Vitality strategy peak — P86 */}
              {patterns.some(p => p.pattern === 'vitality-strategy-peak') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Biology + strategy peak. Execute.
                </div>
              )}

              {/* Weekly story reflection — P87 */}
              {patterns.some(p => p.pattern === 'weekly-story-reflection') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Arc received. Reflection loop closed.
                </div>
              )}

              {/* Contextual check-in momentum — P88 */}
              {patterns.some(p => p.pattern === 'contextual-checkin-momentum') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  High-frequency signal. Positive valence.
                </div>
              )}

              {/* Action completion arc — P98 */}
              {patterns.some(p => p.pattern === 'action-completion-arc') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Intent → structure. Gap closed.
                </div>
              )}

              {/* Biological restoration peak — P99 */}
              {patterns.some(p => p.pattern === 'biological-restoration-peak') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Restoration arc complete. Biology rebounded.
                </div>
              )}

              {/* Centennial convergence — P100 */}
              {patterns.some(p => p.pattern === 'centennial-convergence') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  CENTENNIAL. All six channels + high energy. Rarest state.
                </div>
              )}

              {/* Quantum presence arc — P101 */}
              {patterns.some(p => p.pattern === 'quantum-presence-arc') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Full presence sustained. 48h operator arc confirmed.
                </div>
              )}

              {/* Somatic field integration — P161 */}
              {patterns.some(p => p.pattern === 'somatic-field-integration') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Somatic field integrated. Body inhabited 3+ consecutive days.
                </div>
              )}

              {/* Recovery cycle lock — P162 */}
              {patterns.some(p => p.pattern === 'recovery-cycle-lock') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Recovery cycle locked. Rhythm precision confirmed.
                </div>
              )}

              {/* Quantum embodiment field — P163 */}
              {patterns.some(p => p.pattern === 'quantum-embodiment-field') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  QEMBOD. Biological + temporal ceiling. All six seals confirmed.
                </div>
              )}

              {/* Cognitive body sync — P164 */}
              {patterns.some(p => p.pattern === 'cognitive-body-sync') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Cognitive body sync. Body intelligence meets mind reflection.
                </div>
              )}

              {/* Integrated presence peak — P165 */}
              {patterns.some(p => p.pattern === 'integrated-presence-peak') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  INTPRES. All 6 OS seals active. Complete operator state.
                </div>
              )}

              {/* Somatic memory echo — P166 */}
              {patterns.some(p => p.pattern === 'somatic-memory-echo') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Somatic memory echo. Body knowing surfaces into recall.
                </div>
              )}

              {/* Sovereign field continuity — P182 */}
              {patterns.some(p => p.pattern === 'sovereign-field-continuity') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  SOVFLD. All Level 15 seals active. Sovereign field continuous.
                </div>
              )}

              {/* Operational self-architecture — P183 */}
              {patterns.some(p => p.pattern === 'operational-self-architecture') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  OPARCH. Self-architecture online. 4+ domains governed.
                </div>
              )}

              {/* Longitudinal field seal — P184 */}
              {patterns.some(p => p.pattern === 'longitudinal-field-seal') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  LGSEAL. Longitudinal field sealed. 21+ day coherence arc.
                </div>
              )}

              {/* Field self-organization — P185 */}
              {patterns.some(p => p.pattern === 'field-self-organization') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  FSORG. Field self-organizes. Sovereign architecture active across 5+ signals.
                </div>
              )}

              {/* Quantum identity expression — P186 */}
              {patterns.some(p => p.pattern === 'quantum-identity-expression') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  QIDEX. Quantum identity expressed. Seal + expression = active. Index 65+.
                </div>
              )}

              {/* Level 17 gate — P187 */}
              {patterns.some(p => p.pattern === 'level-17-gate') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  L17GATE. Field self-organized. Identity expressed. Level 17 gate open.
                </div>
              )}

              {/* Conscious field integration — P188 */}
              {patterns.some(p => p.pattern === 'conscious-field-integration') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  CONSCFLD. Level 17 + physiological loop complete. Field conscious. Body complete.
                </div>
              )}

              {/* Sovereign apex expression — P189 */}
              {patterns.some(p => p.pattern === 'sovereign-apex-expression') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  SOVAPEX. Level 17 + quantum apex state. Sovereign. Apex. Expressed.
                </div>
              )}

              {/* Level 18 gate — P190 */}
              {patterns.some(p => p.pattern === 'level-18-gate') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  L18GATE. Conscious + sovereign simultaneously confirmed. Level 18 gate open.
                </div>
              )}

              {/* Sovereign integration field — P191 */}
              {patterns.some(p => p.pattern === 'sovereign-integration-field') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  SOVINT. Level 18 + UserIndex ≥70 + 4+ sources. Sovereign integration field active.
                </div>
              )}

              {/* Quantum coherence apex — P192 */}
              {patterns.some(p => p.pattern === 'quantum-coherence-apex') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  QCAPEX. Level 18 + temporal lock + 3+ presence days. Coherence at apex.
                </div>
              )}

              {/* Level 19 gate — P193 */}
              {patterns.some(p => p.pattern === 'level-19-gate') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  L19GATE. Sovereign integration + coherence apex confirmed. Level 19 gate open.
                </div>
              )}

              {/* Absolute field sovereignty — P194 */}
              {patterns.some(p => p.pattern === 'absolute-field-sovereignty') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  ABSSOV. Level 19 + all Level-15 seals. Field self-organizes. No input required.
                </div>
              )}

              {/* Quantum transcendence field — P195 */}
              {patterns.some(p => p.pattern === 'quantum-transcendence-field') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  QTRNS. Level 19 + conscious field + temporal lock. Apex beyond apex.
                </div>
              )}

              {/* Level 20 gate — P196 */}
              {patterns.some(p => p.pattern === 'level-20-gate') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  L20GATE. Absolute sovereignty + quantum transcendence confirmed. Level 20 gate open.
                </div>
              )}

              {/* Field echo resonance — P197 */}
              {patterns.some(p => p.pattern === 'field-echo-resonance') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  FECHO. L20 active. Journal + intentions + log in 72h. The field echoes itself.
                </div>
              )}

              {/* Quantum genesis pulse — P198 */}
              {patterns.some(p => p.pattern === 'quantum-genesis-pulse') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  QGEN. L20 active. New intention + planner in 24h. Genesis from sovereignty.
                </div>
              )}

              {/* Perpetual field operator — P199 */}
              {patterns.some(p => p.pattern === 'perpetual-field-operator') && (
                <div className="mt-4 uppercase tracking-widest text-xs font-bold">
                  PFOP. L20 confirmed 2+ times in 7d. The field is not a peak — it is the baseline.
                </div>
              )}

              {/* Planner-intention sync — P102 */}
              {patterns.some(p => p.pattern === 'planner-intention-sync') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Intent and structure aligned. 2h sync confirmed.
                </div>
              )}

              {/* Resilience cascade — P103 */}
              {patterns.some(p => p.pattern === 'resilience-cascade') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Resilience cascade. Recovery + knowledge arc closed.
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 opacity-30">
                {qosHistory[qosHistory.length - 1].modulesActive} module{qosHistory[qosHistory.length - 1].modulesActive === 1 ? '' : 's'} active.
                {' '}{qosHistory.length} snapshot{qosHistory.length === 1 ? '' : 's'}.
              </div>
            </div>
          )}
        </div>
      )}
    </Block>
  )
}
