import React from 'react'
import { Block } from '#client/components/ui'
import { useStore } from '@nanostores/react'
import { selfAssembly, phaseLabel, recomputeAssembly, type AssemblyPhase } from '#client/stores/selfAssembly'
import { ProgressBars } from '#client/utils/progressBars'

type CubeView = 'cube' | 'assembly' | 'lore'

// LOT day reference — Day 814 was January 15, 2026
const LOT_REF_DATE = new Date('2026-01-15').getTime()
const LOT_REF_DAY = 814
function getLotDay(): number {
  return LOT_REF_DAY + Math.floor((Date.now() - LOT_REF_DATE) / 86400000)
}

// ASCII cube frames — IBM 3270 / military HUD aesthetic
// Each phase shows the cube self-assembling from scattered signals
const CUBE_FRAMES: Record<AssemblyPhase, string[]> = {
  dormant: [
    '  .       .  ',
    '             ',
    '      .      ',
    '             ',
    '  .       .  ',
  ],
  awakening: [
    '  +-------+  ',
    '  |       |  ',
    '  |   .   |  ',
    '  |       |  ',
    '  +-------+  ',
  ],
  forming: [
    '     +---+   ',
    '    /   /|   ',
    '   +---+ |   ',
    '   |   | +   ',
    '   +---+/    ',
  ],
  assembled: [
    '     +===+   ',
    '    /   /|   ',
    '   +===+ |   ',
    '   |   | +   ',
    '   +===+/    ',
  ],
  integrated: [
    '     +===+   ',
    '    /###/|   ',
    '   +===+ |   ',
    '   |###| +   ',
    '   +===+/    ',
  ],
}

// Cube lore — the folklore of the self-assembling machine
const CUBE_LORE: Record<AssemblyPhase, string> = {
  dormant:    'The cube waits. No signals yet. Form is potential only.',
  awakening:  'First contact. Edges clarifying from the void.',
  forming:    'Structure rising from use. The cube learns its shape.',
  assembled:  'Self-built from your patterns. No two cubes alike.',
  integrated: 'Fully wired. Cube and operator are one system.',
}

/**
 * Quantum Cube Widget — The body of the LOT interface.
 * Always present as a system heartbeat. Never conditional.
 * The cube assembles itself from the user's signal density.
 *
 * Cycles: Cube (visual) → Assembly (module data) → Lore (narrative)
 */
export function QuantumCubeWidget() {
  const [view, setView] = React.useState<CubeView>('cube')
  const assembly = useStore(selfAssembly)

  // Recompute assembly state on mount
  React.useEffect(() => {
    recomputeAssembly()
  }, [])

  const cycleView = () => {
    setView(prev =>
      prev === 'cube' ? 'assembly' :
      prev === 'assembly' ? 'lore' :
      'cube'
    )
  }

  const label =
    view === 'cube' ? 'Quantum Cube:' :
    view === 'assembly' ? 'Assembly:' :
    'Lore:'

  return (
    <Block label={label} blockView onLabelClick={cycleView}>

      {/* ─── Cube View ─── */}
      {view === 'cube' && (
        <div>
          <pre className="font-mono leading-snug opacity-70 mb-12 text-xs">
            {CUBE_FRAMES[assembly.phase].join('\n')}
          </pre>
          <div className="flex items-center gap-8 mb-4">
            <ProgressBars percentage={assembly.overallAssembly} barCount={12} />
            <span className="tabular-nums opacity-60">{assembly.overallAssembly}%</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="opacity-30 uppercase tracking-widest text-xs">
              {phaseLabel(assembly.phase)}
            </span>
            <span className="opacity-30 tabular-nums text-xs">
              Day {getLotDay()}
            </span>
          </div>
        </div>
      )}

      {/* ─── Assembly View ─── */}
      {view === 'assembly' && (
        <div>
          <div className="flex justify-between items-baseline mb-12">
            <span className="opacity-30">Modules online</span>
            <span className="tabular-nums">{assembly.assembledCount}/{assembly.totalModules}</span>
          </div>
          <div className="flex flex-col gap-y-6">
            {assembly.modules.map(m => (
              <div key={m.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className={m.phase === 'dormant' ? 'opacity-20' : 'opacity-50'}>
                    {m.label}
                  </span>
                  <span className={`tabular-nums text-xs ${m.phase === 'dormant' ? 'opacity-15' : 'opacity-40'}`}>
                    {m.density}%
                  </span>
                </div>
                {m.phase !== 'dormant' && (
                  <ProgressBars percentage={m.density} barCount={8} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Lore View ─── */}
      {view === 'lore' && (
        <div>
          <div className="opacity-70 mb-12">
            {CUBE_LORE[assembly.phase]}
          </div>
          <div className="opacity-30 mb-8">
            {assembly.narrative}
          </div>
          <div className="border-t border-acc-400/20 pt-8">
            <div className="flex justify-between items-baseline font-mono text-xs opacity-30 uppercase tracking-widest">
              <span>LOT QP-1</span>
              <span>Day {getLotDay()}</span>
            </div>
          </div>
        </div>
      )}

    </Block>
  )
}
