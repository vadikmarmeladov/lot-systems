/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { getAstrologySnapshot, type AstrologySnapshot } from '#shared/utils/astrology'

/**
 * useTodayAstrology — single source of truth for "today's ambient conditions"
 * (zodiac hour, zodiac season, moon phase, rokuyo) shared by every widget
 * that surfaces astrology. Recomputes on the hour so the zodiac hour segment
 * doesn't go stale across a long-lived tab, without a per-minute re-render.
 */
export function useTodayAstrology(): AstrologySnapshot {
  const [snapshot, setSnapshot] = React.useState<AstrologySnapshot>(() =>
    getAstrologySnapshot(new Date())
  )

  React.useEffect(() => {
    const tick = () => {
      const next = getAstrologySnapshot(new Date())
      setSnapshot(prev => (
        prev.hourlyZodiac === next.hourlyZodiac &&
        prev.rokuyo === next.rokuyo &&
        prev.moonPhase === next.moonPhase &&
        prev.westernZodiac === next.westernZodiac
          ? prev
          : next
      ))
    }
    const interval = setInterval(tick, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return snapshot
}
