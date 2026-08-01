/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { Block } from '#client/components/ui'
import { $evolutionState } from '#client/stores/evolution'
import { BADGES, getEarnedBadges, getLevelSymbol, getLevelName } from '#client/utils/badges'

/**
 * Arcade — gamified evolution layer (SCAFFOLD, not yet wired into a tab)
 *
 * LOT is a self-care company, not a game — the Arcade framing exists to
 * make already-real progress (CQGS dimensions, badge tier, streak level)
 * legible at a glance, the way a game cabinet shows a score without
 * turning self-care into a competition against other people. Everything
 * this widget reads already exists (`$evolutionState`, `badges.ts`); this
 * is presentation only, no new scoring logic, no new incentive to game.
 *
 * See docs/technical/ARCADE-EVOLUTION-LAYER.md for the design rationale,
 * the honest boundary (what this is/isn't), and the wiring steps to add
 * it to the System.tsx widget stack when ready for design review.
 *
 * PROVISIONAL — scaffold only, not yet rendered anywhere in the app.
 */
export const ArcadeWidget: React.FC = () => {
  const evolution = useStore($evolutionState)
  const [view, setView] = React.useState<'cabinet' | 'highscores'>('cabinet')

  if (!evolution) return null

  const earned = getEarnedBadges()
  const streak = Math.round(evolution.consistency * 100)
  const symbol = getLevelSymbol(streak)
  const levelName = getLevelName(streak)

  const dimensions: Array<[string, number]> = [
    ['EXPLORE', evolution.exploration],
    ['CONSIST', evolution.consistency],
    ['DEPTH', evolution.depth],
    ['CONNECT', evolution.connection],
    ['CARE', evolution.care],
    ['COURAGE', evolution.courage],
  ]

  return (
    <Block
      label="Arcade:"
      onLabelClick={() => setView(prev => (prev === 'cabinet' ? 'highscores' : 'cabinet'))}
    >
      {view === 'cabinet' ? (
        <div style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <div>
            {symbol} LEVEL {evolution.level} — {levelName.toUpperCase()} — CH.{evolution.chapter}
          </div>
          <div className="opacity-60" style={{ fontSize: '13px', marginTop: '4px' }}>
            {dimensions.map(([label, value]) => `${label} ${Math.round(value * 100)}`).join('  ·  ')}
          </div>
        </div>
      ) : (
        <div className="opacity-70" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '13px' }}>
          {earned.length === 0
            ? 'NO BADGES EARNED YET'
            : earned.slice(0, 8).map(id => {
                const badge = BADGES[id]
                return badge ? (
                  <div key={id}>
                    {badge.symbol} {badge.name}
                  </div>
                ) : null
              })}
        </div>
      )}
    </Block>
  )
}
