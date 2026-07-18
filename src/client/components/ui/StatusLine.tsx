/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { cn } from '#client/utils'

type StatusLineState = 'live' | 'pending' | 'closed'

type Props = {
  label: string
  value: string
  state?: StatusLineState
  className?: string
}

/**
 * Fixed-register terminal readout: [indicator] LABEL: VALUE. IBM 3270
 * style — LiberationMono, black ink, no color. `live` blinks (soft-blink,
 * reused from index.css), `pending` is a hollow square, `closed` is solid
 * with no motion.
 */
export const StatusLine: React.FC<Props> = ({ label, value, state = 'live', className }) => {
  return (
    <div className={cn('flex items-center gap-8 font-mono font-bold text-[13px] tracking-wide leading-none', className)}>
      <span
        className={cn(
          'inline-block w-8 h-8 flex-shrink-0 border-2 border-black',
          state === 'live' && 'bg-black blink',
          state === 'closed' && 'bg-black'
        )}
      />
      <span className="uppercase">{label}:</span>
      <span className="uppercase">{value}</span>
    </div>
  )
}
