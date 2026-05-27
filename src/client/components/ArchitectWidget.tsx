/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Block } from '#client/components/ui'
import { ProgressBars } from '#client/utils/progressBars'
import {
  selfAssembly,
  recomputeAssembly,
  phaseSymbol,
  phaseLabel,
  type AssemblyPhase,
} from '#client/stores/selfAssembly'
import {
  intentionEngine,
  analyzeIntentions,
} from '#client/stores/intentionEngine'
import { UserTag } from '#shared/types'

const PHASE_ORDER: AssemblyPhase[] = ['integrated', 'assembled', 'forming', 'awakening', 'dormant']

function phaseRank(phase: AssemblyPhase): number {
  return PHASE_ORDER.indexOf(phase)
}

function coherenceLabel(c: number): string {
  if (c >= 80) return 'locked'
  if (c >= 60) return 'stable'
  if (c >= 40) return 'forming'
  if (c >= 20) return 'variable'
  return 'sparse'
}

function signalAge(ts: number | null): string {
  if (!ts) return '—'
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

export function ArchitectWidget() {
  const me = useStore(stores.me)
  const assembly = useStore(selfAssembly)
  const engine = useStore(intentionEngine)
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set())
  const [lastRecompute, setLastRecompute] = React.useState(Date.now())

  const isPaid = React.useMemo(() => {
    if (!me?.tags) return false
    return me.tags.some((tag: string) =>
      tag.toLowerCase() === UserTag.Usership.toLowerCase() ||
      tag.toLowerCase() === UserTag.RND.toLowerCase()
    )
  }, [me])

  React.useEffect(() => {
    if (!isPaid) return
    recomputeAssembly()
    analyzeIntentions()
    const interval = setInterval(() => {
      recomputeAssembly()
      setLastRecompute(Date.now())
    }, 30_000)
    return () => clearInterval(interval)
  }, [isPaid])

  if (!isPaid || !me) return null

  const sortedModules = [...assembly.modules].sort((a, b) => {
    const phaseD = phaseRank(a.phase) - phaseRank(b.phase)
    if (phaseD !== 0) return phaseD
    return b.density - a.density
  })

  const integrated = assembly.modules.filter(m => m.phase === 'integrated').length
  const assembled = assembly.modules.filter(m => m.phase === 'assembled').length
  const forming = assembly.modules.filter(m => m.phase === 'forming').length
  const awakening = assembly.modules.filter(m => m.phase === 'awakening').length
  const dormant = assembly.modules.filter(m => m.phase === 'dormant').length

  const signals7d = engine.signals.filter(s => Date.now() - s.timestamp < 7 * 24 * 60 * 60 * 1000)
  const signals24h = engine.signals.filter(s => Date.now() - s.timestamp < 24 * 60 * 60 * 1000)

  const sourceBreakdown = React.useMemo(() => {
    const counts: Record<string, number> = {}
    signals7d.forEach(s => {
      counts[s.source] = (counts[s.source] || 0) + 1
    })
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
  }, [signals7d])

  const toggleModule = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getPhaseColor = (phase: AssemblyPhase): string => {
    switch (phase) {
      case 'integrated': return 'text-acc'
      case 'assembled': return ''
      case 'forming': return 'opacity-70'
      case 'awakening': return 'opacity-50'
      case 'dormant': return 'opacity-20'
    }
  }

  return (
    <Block label="Architect:" blockView>
      <div className="flex flex-col gap-y-16 font-mono text-xs">

        {/* Brand header */}
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between items-baseline">
            <span className="uppercase tracking-widest">LOT® Self-Assembly®</span>
            <span className="opacity-30 tabular-nums">v{assembly.totalModules}.{assembly.assembledCount}</span>
          </div>
          <div className="opacity-30">
            Living software that builds itself from use. Each module assembles when your signal pattern reaches threshold. No synthetic data. No fake progress. Real assembly from real use.
          </div>
        </div>

        {/* System overview */}
        <div className="border-t border-acc-400/30 pt-16 flex flex-col gap-y-4">
          <div className="flex justify-between items-baseline">
            <span className="opacity-30 uppercase tracking-widest">System phase</span>
            <span>{phaseSymbol(assembly.phase)} {phaseLabel(assembly.phase)}</span>
          </div>
          <div className="flex items-center gap-8">
            <ProgressBars percentage={assembly.overallAssembly} barCount={17} />
            <span className="tabular-nums">{assembly.overallAssembly}%</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="opacity-30 uppercase tracking-widest">Modules</span>
            <span className="tabular-nums">
              {assembly.assembledCount}/{assembly.totalModules} online
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="opacity-30 uppercase tracking-widest">Signals 24h</span>
            <span className="tabular-nums">{signals24h.length}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="opacity-30 uppercase tracking-widest">Signals 7d</span>
            <span className="tabular-nums">{signals7d.length}</span>
          </div>
        </div>

        {/* Phase distribution */}
        <div className="border-t border-acc-400/30 pt-16">
          <div className="opacity-30 uppercase tracking-widest mb-8">Phase distribution</div>
          <div className="flex flex-col gap-y-2">
            {integrated > 0 && (
              <div className="flex justify-between">
                <span className="text-acc">{'◉'} Integrated</span>
                <span className="tabular-nums">{integrated}</span>
              </div>
            )}
            {assembled > 0 && (
              <div className="flex justify-between">
                <span>{'◯'} Assembled</span>
                <span className="tabular-nums">{assembled}</span>
              </div>
            )}
            {forming > 0 && (
              <div className="flex justify-between">
                <span className="opacity-70">{'○'} Forming</span>
                <span className="tabular-nums">{forming}</span>
              </div>
            )}
            {awakening > 0 && (
              <div className="flex justify-between">
                <span className="opacity-50">{'∘'} Awakening</span>
                <span className="tabular-nums">{awakening}</span>
              </div>
            )}
            {dormant > 0 && (
              <div className="flex justify-between">
                <span className="opacity-20">{'·'} Dormant</span>
                <span className="tabular-nums">{dormant}</span>
              </div>
            )}
          </div>
        </div>

        {/* Module telemetry — expandable rows */}
        <div className="border-t border-acc-400/30 pt-16">
          <div className="opacity-30 uppercase tracking-widest mb-8">Module telemetry</div>
          <div className="flex flex-col gap-y-8">
            {sortedModules.map(module => {
              const isExpanded = expanded.has(module.id)
              return (
                <div key={module.id}>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full text-left"
                  >
                    <div className="flex justify-between items-baseline">
                      <span className={getPhaseColor(module.phase)}>
                        {phaseSymbol(module.phase)} {module.label}
                      </span>
                      <span className="tabular-nums opacity-30">
                        {module.density > 0 ? `${module.density}%` : '—'}
                      </span>
                    </div>
                    {module.phase !== 'dormant' && (
                      <div className="flex items-center gap-8 mt-2">
                        <ProgressBars percentage={module.density} barCount={10} />
                        <span className="opacity-20 tabular-nums">
                          {signalAge(module.lastSignal)}
                        </span>
                      </div>
                    )}
                  </button>

                  {isExpanded && module.phase !== 'dormant' && (
                    <div className="pl-12 mt-4 flex flex-col gap-y-2 border-l border-acc-400/10">
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Signals</span>
                        <span className="tabular-nums">{module.signalCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Coherence</span>
                        <span className="tabular-nums">
                          {module.coherence}% {coherenceLabel(module.coherence)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">First signal</span>
                        <span className="tabular-nums">{signalAge(module.firstSignal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Last signal</span>
                        <span className="tabular-nums">{signalAge(module.lastSignal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-30 uppercase">Phase</span>
                        <span>{phaseLabel(module.phase)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Signal source breakdown */}
        {sourceBreakdown.length > 0 && (
          <div className="border-t border-acc-400/30 pt-16">
            <div className="opacity-30 uppercase tracking-widest mb-8">Signal sources · 7d</div>
            <div className="flex flex-col gap-y-2">
              {sourceBreakdown.map(([source, count]) => (
                <div key={source} className="flex justify-between">
                  <span className="opacity-50 uppercase">{source}</span>
                  <span className="tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Narrative */}
        <div className="opacity-30 pt-8">
          {assembly.narrative}
        </div>

        {/* Recompute timestamp */}
        <div className="opacity-20 text-right tabular-nums">
          {new Date(lastRecompute).toISOString().replace('T', ' ').slice(11, 19)}Z
        </div>
      </div>
    </Block>
  )
}
