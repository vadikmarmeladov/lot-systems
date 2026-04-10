import React from 'react'
import { Block, Button } from '#client/components/ui'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { ProgressBars } from '#client/utils/progressBars'
import { selfAssembly, phaseSymbol, phaseLabel, recomputeAssembly, type AssembledModule } from '#client/stores/selfAssembly'

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

type ProgressView = 'deployment' | 'assembly' | 'feedback'

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

  // Recompute assembly on mount and periodically
  React.useEffect(() => {
    recomputeAssembly()
    const interval = setInterval(recomputeAssembly, 60_000) // Every minute
    return () => clearInterval(interval)
  }, [])

  const cycleView = () => {
    setView(prev => {
      switch (prev) {
        case 'deployment': return 'assembly'
        case 'assembly': return 'feedback'
        case 'feedback': return 'deployment'
        default: return 'deployment'
      }
    })
  }

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
    'System Feedback:'

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
      </div>
    </Block>
  )
}
