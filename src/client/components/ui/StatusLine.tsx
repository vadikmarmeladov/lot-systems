/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { cn } from '#client/utils'

/**
 * LOT-FM-001 terminal register — status-line component.
 *
 * A single-row readout of LABEL: VALUE segments, IBM 3270 style. Hierarchy
 * is inversion-only (black-on-white vs. white-on-black) — no opacity, no
 * color. Segments are equal weight, separated by a 2px rule.
 */

type Segment = {
  label: string
  value: string
}

type Props = {
  segments: Segment[]
  invert?: boolean
  className?: string
}

export const StatusLine: React.FC<Props> = ({ segments, invert = true, className }) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-stretch font-term font-bold text-[12px] phone:text-[13px] tracking-wide uppercase border-[length:var(--lot-term-rule)] rounded-none',
        invert
          ? 'bg-[color:var(--lot-term-ink)] text-[color:var(--lot-term-ground)] border-[color:var(--lot-term-ink)]'
          : 'bg-[color:var(--lot-term-ground)] text-[color:var(--lot-term-ink)] border-[color:var(--lot-term-ink)]',
        className
      )}
    >
      {segments.map((seg, i) => (
        <div
          key={seg.label}
          className={cn(
            'flex items-center gap-x-8 px-12 py-6',
            i > 0 && 'border-l-[length:var(--lot-term-rule)]',
            i > 0 && (invert ? 'border-[color:var(--lot-term-ground)]' : 'border-[color:var(--lot-term-ink)]')
          )}
        >
          <span>{seg.label}:</span>
          <span>{seg.value}</span>
        </div>
      ))}
    </div>
  )
}
