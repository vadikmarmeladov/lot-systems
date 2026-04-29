import * as React from 'react'
import { useStore } from '@nanostores/react'
import { Block, Button } from '#client/components/ui'
import { recordSignal, intentionEngine, getPhysiologicalReport } from '#client/stores/intentionEngine'
import { getEcosystemNarrative } from '#client/utils/narrative'
import { useEnergy } from '#client/queries'
import { selfAssembly } from '#client/stores/selfAssembly'

function usePersistedState(key: string): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue] = React.useState(() => {
    try { return localStorage.getItem(key) === 'true' } catch { return false }
  })
  const setPersistedValue: React.Dispatch<React.SetStateAction<boolean>> = React.useCallback((action) => {
    setValue(prev => {
      const next = typeof action === 'function' ? action(prev) : action
      try { localStorage.setItem(key, String(next)) } catch {}
      return next
    })
  }, [key])
  return [value, setPersistedValue]
}

const TOTAL_DEVICES = 3

type QOSView = 'ecosystem' | 'biofield' | 'cohort'

export const QuantumEngineWidgets: React.FC = () => {
  const [carConnected, setCarConnected] = usePersistedState('qe-car-connected')
  const [homeConnected, setHomeConnected] = usePersistedState('qe-home-connected')
  const [computerConnected, setComputerConnected] = usePersistedState('qe-computer-connected')
  const [view, setView] = React.useState<QOSView>('ecosystem')

  const engineState = useStore(intentionEngine)
  const assemblyState = useStore(selfAssembly)
  const { data: energyData } = useEnergy()
  const [cohortData, setCohortData] = React.useState<{ archetype?: string; behavioralCohort?: string } | null>(null)
  const [readiness, setReadiness] = React.useState<number | null>(null)

  const connectedCount = [carConnected, homeConnected, computerConnected].filter(Boolean).length
  const ecosystemNarrative = React.useMemo(
    () => getEcosystemNarrative(connectedCount, TOTAL_DEVICES),
    [connectedCount]
  )

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

  // Compute readiness from physiological report
  React.useEffect(() => {
    if (engineState.signals.length === 0) return
    const report = getPhysiologicalReport()
    setReadiness(report.physiologicalReadiness)
  }, [engineState.signals.length])

  const handleCarConnect = () => {
    setCarConnected((prev) => {
      const next = !prev
      recordSignal('intentions', next ? 'car_connected' : 'car_disconnected', { timestamp: Date.now() })
      return next
    })
  }

  const handleHomeConnect = () => {
    setHomeConnected((prev) => {
      const next = !prev
      recordSignal('intentions', next ? 'home_connected' : 'home_disconnected', { timestamp: Date.now() })
      return next
    })
  }

  const handleComputerConnect = () => {
    setComputerConnected((prev) => {
      const next = !prev
      recordSignal('intentions', next ? 'computer_connected' : 'computer_disconnected', { timestamp: Date.now() })
      return next
    })
  }

  React.useEffect(() => {
    if (connectedCount === TOTAL_DEVICES) {
      recordSignal('intentions', 'ecosystem_full_coherence', {
        timestamp: Date.now(),
        devices: { car: carConnected, home: homeConnected, computer: computerConnected },
      })
    }
  }, [connectedCount])

  const cycleView = () => {
    setView(prev =>
      prev === 'ecosystem' ? 'biofield' :
      prev === 'biofield' ? 'cohort' :
      'ecosystem'
    )
  }

  const qosLabel =
    view === 'ecosystem' ? 'QOS:' :
    view === 'biofield'  ? 'Biofield:' :
    'Cohort:'

  const { energy, clarity, alignment, needsSupport } = engineState.userState
  const biofieldKnown = energy !== 'unknown'

  return (
    <>
      {/* QOS Summary Block — label cycles ecosystem / biofield / cohort */}
      <Block label={qosLabel} blockView onLabelClick={cycleView}>
        <div className="flex flex-col gap-y-8">

          {view === 'ecosystem' && (
            <>
              <div className="flex justify-between items-baseline">
                <span className="opacity-30">Nodes</span>
                <span className="tabular-nums">{connectedCount}/{TOTAL_DEVICES}</span>
              </div>
              <div className="flex gap-x-16">
                <span className={carConnected ? '' : 'opacity-20'}>CAR</span>
                <span className={homeConnected ? '' : 'opacity-20'}>HOME</span>
                <span className={computerConnected ? '' : 'opacity-20'}>CPU</span>
              </div>
              {assemblyState.overallAssembly > 0 && (
                <div className="flex justify-between items-baseline">
                  <span className="opacity-30">Assembly</span>
                  <span className="tabular-nums">{assemblyState.overallAssembly}%</span>
                </div>
              )}
              {connectedCount > 0 && (
                <div className="opacity-30 text-xs">{ecosystemNarrative}</div>
              )}
            </>
          )}

          {view === 'biofield' && (
            <>
              {biofieldKnown ? (
                <>
                  <div className="flex justify-between items-baseline">
                    <span className="opacity-30 uppercase tracking-widest">ATP</span>
                    <span className="capitalize">{energy}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="opacity-30 uppercase tracking-widest">Clarity</span>
                    <span className="capitalize">{clarity}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="opacity-30 uppercase tracking-widest">Alignment</span>
                    <span className="capitalize">{alignment}</span>
                  </div>
                  {needsSupport !== 'none' && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-30 uppercase tracking-widest">Support</span>
                      <span className="capitalize">{needsSupport}</span>
                    </div>
                  )}
                  {energyData?.energyState?.currentLevel !== undefined && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-30 uppercase tracking-widest">Capacitor</span>
                      <span className="tabular-nums">{energyData.energyState.currentLevel}%</span>
                    </div>
                  )}
                  {engineState.signals.filter(s =>
                    s.signal === 'full_stack_session' &&
                    Date.now() - s.timestamp < 4 * 60 * 60 * 1000
                  ).length > 0 && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-30 uppercase tracking-widest">Session</span>
                      <span className="opacity-60">Full-stack active</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="opacity-30">No biofield reading. Check in to anchor the signal.</div>
              )}
            </>
          )}

          {view === 'cohort' && (
            <>
              {cohortData?.archetype ? (
                <>
                  <div className="flex justify-between items-baseline">
                    <span className="opacity-30 uppercase tracking-widest">Archetype</span>
                    <span>{cohortData.archetype}</span>
                  </div>
                  {cohortData.behavioralCohort && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-30 uppercase tracking-widest">Cohort</span>
                      <span>{cohortData.behavioralCohort}</span>
                    </div>
                  )}
                  {readiness !== null && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-30 uppercase tracking-widest">Readiness</span>
                      <span className="tabular-nums">
                        {readiness}%{' '}
                        <span className="opacity-30">
                          {readiness >= 70 ? '▲' : readiness >= 40 ? '—' : '▼'}
                        </span>
                      </span>
                    </div>
                  )}
                  {energyData?.energyState?.needsReplenishment?.[0] && (
                    <div className="flex justify-between items-baseline">
                      <span className="opacity-30 uppercase tracking-widest">Priority</span>
                      <span className="capitalize">
                        {energyData.energyState.needsReplenishment[0].category}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="opacity-30">Cohort pending. Engage more widgets to surface pattern.</div>
              )}
            </>
          )}

        </div>
      </Block>

      {/* Device connect controls */}
      <Block label="Car:" containsSmallButton inProgress>
        <Button size="small" onClick={handleCarConnect}>
          {carConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
      <Block label="Home:" containsSmallButton inProgress>
        <Button size="small" onClick={handleHomeConnect}>
          {homeConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
      <Block label="Computer:" containsSmallButton inProgress>
        <Button size="small" onClick={handleComputerConnect}>
          {computerConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
    </>
  )
}
