/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { Block, Link } from '#client/components/ui'

type Props = {
  label: string
  teaseText: string
  /**
   * Real, computed widget data — genuinely personal, not a mockup, since the
   * Quantum Intention Engine records signals for every account regardless of
   * tier. Rendered blurred. Omit for widgets with no meaningful data to blur
   * (Recipe, Calendar) — those show as a plain locked card.
   */
  blurred?: React.ReactNode
}

/**
 * A grayed/blurred glimpse of a Usership/R&D-only widget, shown to non-paid
 * accounts during the free-tier tease window (months 2-14).
 */
export function LockedTease({ label, teaseText, blurred }: Props) {
  return (
    <Block label={label} blockView>
      {blurred && (
        <div className="blur-[3px] opacity-50 select-none pointer-events-none">
          {blurred}
        </div>
      )}
      <div className={blurred ? 'mt-8 opacity-30' : 'opacity-30'}>
        {teaseText}
      </div>
      <div className="mt-8">
        <Link href="https://brand.lot-systems.com" target="_blank">
          Unlock with Usership / R&D
        </Link>
      </div>
    </Block>
  )
}
