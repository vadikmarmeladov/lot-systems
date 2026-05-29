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
  analyzeIntentions,
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

  // Trigger analysis
  React.useEffect(() => {
    analyzeIntentions()
  }, [logs])

  const qosHistory = React.useMemo(() => getQOSHistory(), [engine])

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
  const optimal = getOptimalWidget()

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
      'nocturnal-peak':             'Night build window open',
      'integration-burst':          'Full-spectrum burst active',
      'clarity-cascade':            'Clarity cascade aligned',
      'care-drought':               'Care protocol overdue'
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

              {/* Nocturnal peak indicator — surfaces when pattern 63 is active */}
              {patterns.some(p => p.pattern === 'nocturnal-peak') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Night architecture active. Build window open.
                </div>
              )}

              {/* Clarity cascade indicator — surfaces when pattern 65 is active */}
              {patterns.some(p => p.pattern === 'clarity-cascade') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Clarity cascade locked. Direction is clear.
                </div>
              )}

              {/* Care drought indicator — surfaces when pattern 66 is active */}
              {patterns.some(p => p.pattern === 'care-drought') && (
                <div className="mt-4 uppercase tracking-widest text-xs">
                  Care drought. Protocol needed.
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
