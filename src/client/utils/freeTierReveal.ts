/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Free-Tier UI Reveal
 *
 * Non-paid accounts see the interface build up from a bare name over their
 * first month, then get monthly teased glimpses of LOT® AI / personalization
 * widgets through month 15. This is hardcoded to elapsed calendar time —
 * deliberately NOT behavior-gated like the paid tier's context-driven
 * evolution (interfaceEvolution.ts). A quiet, non-paying user should still
 * feel the system notice they've stayed.
 */

import dayjs from '#client/utils/dayjs'

// Missing joinedAt (legacy accounts predating this field) reads as fully
// revealed rather than stuck at day 0 — existing users never regress.
const FAR_FUTURE = Number.MAX_SAFE_INTEGER

export function getDaysSinceJoined(joinedAt: Date | string | null | undefined): number {
  if (!joinedAt) return FAR_FUTURE
  return Math.max(0, dayjs().diff(dayjs(joinedAt), 'day'))
}

export function getMonthsSinceJoined(joinedAt: Date | string | null | undefined): number {
  if (!joinedAt) return FAR_FUTURE
  return Math.max(0, dayjs().diff(dayjs(joinedAt), 'month'))
}

/**
 * Day thresholds for the functional free-tier ceiling (today's Time / Memory
 * / Community / MicroGame / Subscribe layout, staged instead of all-at-once).
 */
export const FREE_REVEAL_DAY = {
  time: 1,
  memory: 7,
  community: 21,
  microGame: 28,
  monthOneChrome: 30, // subscribe, astrology, mirror/sound/breathe, live message
} as const

export type TeaseKey =
  | 'quantumState'
  | 'recipe'
  | 'awareness'
  | 'calendar'
  | 'patterns'
  | 'chakra'
  | 'aiFeedback'
  | 'systemProgress'
  | 'quantumSign'

/**
 * Month thresholds for locked/teased glimpses of Usership/R&D-only widgets.
 * Recipe and Calendar stay paid-exclusive and never functionally unlock on
 * the free tier — they appear here as plain locked cards, not blurred data.
 */
export const TEASE_SCHEDULE: { month: number; key: TeaseKey }[] = [
  { month: 2, key: 'quantumState' },
  { month: 3, key: 'recipe' },
  { month: 4, key: 'awareness' },
  { month: 5, key: 'calendar' },
  { month: 6, key: 'patterns' },
  { month: 8, key: 'chakra' },
  { month: 10, key: 'aiFeedback' },
  { month: 12, key: 'systemProgress' },
  { month: 14, key: 'quantumSign' },
]
