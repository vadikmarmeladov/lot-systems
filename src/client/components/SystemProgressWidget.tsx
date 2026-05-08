import React from 'react'
import { Block, Button } from '#client/components/ui'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { ProgressBars } from '#client/utils/progressBars'
import { selfAssembly, phaseSymbol, phaseLabel, recomputeAssembly, type AssembledModule } from '#client/stores/selfAssembly'
import { useEnergy } from '#client/queries'
import { getPhysiologicalReport, analyzeIntentions, type PhysiologicalReport } from '#client/stores/intentionEngine'

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

type ProgressView = 'deployment' | 'assembly' | 'feedback' | 'report'

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
    date: '2026-05-08',
    session: 'Quantum Engine Upgrade — v4 / QOS Runtime',
    assembled: [
      'Log pipeline: ATP / AUTH / ENV / FOOD / ASM blocks added in military style',
      'QIE Patterns 14-16: cognitive-overload, momentum-building, social-cohort-gap',
      'WIDGET_DEPENDENCY_MAP expanded: log source wired into memory, planner, journal, system, qos',
      'QOS Runtime module added to self-assembly (10th module, all sources converge)',
      'selfAssembly SOURCE_MAP: mood/memory/planner/intentions/selfcare/journal/log/energy/cohort all feed qos',
      'CohortConnectWidget: physiological readiness indicators from QIE active patterns',
      'Self-assembly session report generated and appended. QOS online.',
    ],
  },
]

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
  const [cohortData, setCohortData] = React.useState<{ archetype?: string; behavioralCohort?: string } | null>(null)
  const [report, setReport] = React.useState<PhysiologicalReport | null>(null)

  // Recompute assembly on mount and periodically
  React.useEffect(() => {
    recomputeAssembly()
    const interval = setInterval(recomputeAssembly, 60_000) // Every minute
    return () => clearInterval(interval)
  }, [])

  // Load physiological cohort classification
  React.useEffect(() => {
    fetch('/api/cohorts')
      .then(res => res.json())
      .then(data => {
        if (data.archetype || data.behavioralCohort) {
          setCohortData({ archetype: data.archetype, behavioralCohort: data.behavioralCohort })
        }
      })
      .catch(() => {})
  }, [])

  const cycleView = () => {
    setView(prev => {
      switch (prev) {
        case 'deployment': return 'assembly'
        case 'assembly': return 'feedback'
        case 'feedback': return 'report'
        case 'report': return 'deployment'
        default: return 'deployment'
      }
    })
  }

  const handleGenerateReport = React.useCallback(() => {
    analyzeIntentions()
    setReport(getPhysiologicalReport())
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
    'System Report:'

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

            {/* Self-assembly narrative */}
            <div className="opacity-30">
              {assembly.narrative}
            </div>

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

                  {/* Cohort classification */}
                  {(report.cohortSignals.archetype || report.cohortSignals.behavioralCohort || cohortData) && (
                    <div className="border-t border-acc-400/30 pt-12">
                      <div className="opacity-30 mb-8 uppercase tracking-widest">Physiological cohort</div>
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
      </div>
    </Block>
  )
}
