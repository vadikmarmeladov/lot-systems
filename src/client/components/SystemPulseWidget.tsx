/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { Block } from '#client/components/ui'
import { ProgressBars } from '#client/utils/progressBars'
import { useLogContext } from '#client/hooks/useLogContext'

interface PulseData {
  eventsPerMinute: number
  quantumFlux: number
  neuralActivity: number
  resonanceHz: number
  lastUpdate: number
}

type PulseView = 'metrics' | 'activity' | 'userload'

/**
 * SystemPulseWidget - Real-time system heartbeat + user activity telemetry
 * Updates every 1 second with live activity data, cross-referenced with log context
 * Cycles: Metrics > Activity > User Load
 */
export function SystemPulseWidget() {
  const [pulse, setPulse] = React.useState<PulseData | null>(null)
  const [isLive, setIsLive] = React.useState(true)
  const [view, setView] = React.useState<PulseView>('metrics')
  const intervalRef = React.useRef<NodeJS.Timeout>()
  const lastFetchRef = React.useRef<number>(Date.now())
  const logCtx = useLogContext()

  const cycleView = () => {
    setView(prev => {
      switch (prev) {
        case 'metrics': return 'activity'
        case 'activity': return 'userload'
        case 'userload': return 'metrics'
        default: return 'metrics'
      }
    })
  }

  // Fetch pulse data
  const fetchPulse = React.useCallback(async () => {
    try {
      const response = await fetch('/api/system/pulse')
      if (!response.ok) return

      const data = await response.json()
      setPulse(data)
      lastFetchRef.current = Date.now()
      setIsLive(true)
    } catch (error) {
      console.error('Failed to fetch pulse:', error)
      setIsLive(false)
    }
  }, [])

  // Auto-fetch every 10 seconds (was 1s — reduced to prevent DB overload under traffic)
  React.useEffect(() => {
    fetchPulse()

    intervalRef.current = setInterval(() => {
      fetchPulse()
    }, 10_000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchPulse])

  const label =
    view === 'metrics' ? 'System Pulse:' :
    view === 'activity' ? 'System Load:' :
    'User Telemetry:'

  if (!pulse) {
    return (
      <Block label={label} blockView onLabelClick={cycleView}>
        <div className="opacity-30">Connecting.</div>
      </Block>
    )
  }

  return (
    <Block label={label} blockView onLabelClick={cycleView}>
      {view === 'metrics' && (
        <div>
          {/* Live status with user context */}
          <div className="mb-8 opacity-30">
            {isLive ? 'Live.' : 'Reconnecting.'}
            {!logCtx.isEmpty && logCtx.sessionDepth > 0 ? ` Session depth: ${logCtx.sessionDepth}.` : ''}
          </div>

          {/* Events per minute */}
          <div className="flex justify-between items-baseline mb-8">
            <span className="opacity-30">Events/min</span>
            <span className="tabular-nums">{Math.round(pulse.eventsPerMinute).toLocaleString()}</span>
          </div>

          {/* Quantum Flux */}
          <div className="flex justify-between items-baseline mb-8">
            <span className="opacity-30">Quantum flux</span>
            <span className="tabular-nums">{pulse.quantumFlux.toFixed(1)}%</span>
          </div>

          {/* Neural Activity */}
          <div className="flex justify-between items-baseline mb-8">
            <span className="opacity-30">Neural activity</span>
            <span className="tabular-nums">{Math.round(pulse.neuralActivity).toLocaleString()}</span>
          </div>

          {/* Resonance */}
          <div className="flex justify-between items-baseline">
            <span className="opacity-30">Resonance</span>
            <span className="tabular-nums">{pulse.resonanceHz.toFixed(1)} Hz</span>
          </div>
        </div>
      )}

      {view === 'activity' && (
        <div>
          {/* Activity level as progress bars */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <span className="opacity-30">Load</span>
              <span className="tabular-nums">{Math.min(100, Math.round(pulse.eventsPerMinute))}%</span>
            </div>
            <ProgressBars percentage={Math.min(100, pulse.eventsPerMinute)} barCount={20} />
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <span className="opacity-30">Flux</span>
              <span className="tabular-nums">{pulse.quantumFlux.toFixed(1)}%</span>
            </div>
            <ProgressBars percentage={pulse.quantumFlux} barCount={20} />
          </div>

          {/* Status */}
          <div className="opacity-30">
            {isLive ? 'System operational.' : 'Connection interrupted.'}
          </div>
        </div>
      )}

      {view === 'userload' && (
        <div>
          {logCtx.isEmpty ? (
            <div className="opacity-30">No user telemetry. Begin logging to populate.</div>
          ) : (
            <>
              {/* Today's user activity metrics */}
              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Today signals</span>
                <span className="tabular-nums">{logCtx.todayActivity.length.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Weekly rate</span>
                <span className="tabular-nums">{logCtx.weeklyRate.toLocaleString()}/wk</span>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Module coverage</span>
                <span className="tabular-nums">{logCtx.activeModules.length}/6</span>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-30">Engagement</span>
                <span className="capitalize">{logCtx.engagementLevel}</span>
              </div>

              {logCtx.lastActivityAgo && (
                <div className="flex justify-between items-baseline mb-8">
                  <span className="opacity-30">Last signal</span>
                  <span>{logCtx.lastActivityAgo}</span>
                </div>
              )}

              {logCtx.peakHour !== null && (
                <div className="flex justify-between items-baseline">
                  <span className="opacity-30">Peak hour</span>
                  <span className="tabular-nums">{logCtx.peakHour}:00</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Block>
  )
}
