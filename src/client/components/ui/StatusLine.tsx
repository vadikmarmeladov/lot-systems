/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { cn } from '#client/utils'

type Props = {
  fields: string[]
  className?: string
}

// Fixed military status readout — LOT-FM-001 register. One line, inverted
// (black ground / white ink), fields joined by a middle dot on a fixed
// character grid. No color, no radius — inversion is the only hierarchy.
export const StatusLine: React.FC<Props> = ({ fields, className }) => {
  return (
    <div
      className={cn(
        'bg-acc text-bac font-mono font-bold uppercase tracking-wide',
        'text-[13px] leading-[1.5] px-12 py-8',
        'whitespace-pre-wrap break-words',
        className
      )}
    >
      {fields.join('  ·  ')}
    </div>
  )
}
