/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
 *
 * Basics tab state — persisted to localStorage.
 * In production, status transitions are confirmed server-side after billing clears.
 */

import { persistentAtom } from '@nanostores/persistent'
import type { BasicsState } from './types'

const DEFAULT_STATE: BasicsState = {
  status: 'OFF',
  roster: null,
  issues: [],
  enrolledAt: null,
  nextIssueDate: null,
}

export const basicsState = persistentAtom<BasicsState>(
  'lot-basics-state',
  DEFAULT_STATE,
  {
    encode: JSON.stringify,
    decode: (v) => {
      try { return JSON.parse(v) } catch { return DEFAULT_STATE }
    },
  }
)

// Next first-of-month date from today
export function nextFirstOfMonth(): string {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return next.toISOString().split('T')[0]
}

export function computeNextIssueDate(enrolledAt: string): string {
  const enrolled = new Date(enrolledAt)
  const now = new Date()
  // Advance to next 1st of month at or after enrolled date
  let candidate = new Date(enrolled.getFullYear(), enrolled.getMonth(), 1)
  while (candidate <= now) {
    candidate = new Date(candidate.getFullYear(), candidate.getMonth() + 1, 1)
  }
  return candidate.toISOString().split('T')[0]
}
