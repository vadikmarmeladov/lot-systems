/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Easter Egg Detection Engine
 *
 * Scans time, dates, text, and behavioral patterns to award hidden badges.
 * Called from MemoryWidget, JournalWidget, and at check-in time.
 *
 * Categories:
 *   TIME   — hour-of-day triggers (Night Owl, Early Bird, Mirror Hour, Midnight Sigil)
 *   DATE   — calendar triggers (Solstice, Equinox, LOT Birthday, Palindrome Day, etc.)
 *   TEXT   — word-turn detection (ritual, breathe, ocean, LOT, etc.)
 *   BEHAV  — behavioral pattern triggers (overclock, ghost protocol, friday ritual)
 */

import { awardBadge, hasBadge, type BadgeType } from './badges'

// ── Time-based detection ─────────────────────────────────────────────────────

/** Award Night Owl badge if current time is between 01:00–04:00 AM */
export function checkNightOwl(): BadgeType | null {
  if (hasBadge('night_owl')) return null
  const h = new Date().getHours()
  if (h >= 1 && h < 4) {
    awardBadge('night_owl')
    return 'night_owl'
  }
  return null
}

/** Award Early Bird badge if current time is between 05:00–06:00 AM */
export function checkEarlyBird(): BadgeType | null {
  if (hasBadge('early_bird')) return null
  const h = new Date().getHours()
  if (h >= 5 && h < 6) {
    awardBadge('early_bird')
    return 'early_bird'
  }
  return null
}

/** Award Mirror Hour badge if time is exactly 11:11 (±30 seconds) */
export function checkMirrorHour(): BadgeType | null {
  if (hasBadge('mirror_hour')) return null
  const now = new Date()
  if (now.getHours() === 11 && now.getMinutes() === 11) {
    awardBadge('mirror_hour')
    return 'mirror_hour'
  }
  return null
}

/** Award Midnight Sigil when answering a memory question at exactly 00:00 */
export function checkMidnightSigil(): BadgeType | null {
  if (hasBadge('midnight_sigil')) return null
  const now = new Date()
  if (now.getHours() === 0 && now.getMinutes() < 5) {
    awardBadge('midnight_sigil')
    return 'midnight_sigil'
  }
  return null
}

/**
 * Run all time-based checks on a check-in event.
 * Returns array of newly awarded badge IDs.
 */
export function checkTimeEasterEggs(): BadgeType[] {
  const awarded: BadgeType[] = []
  const checks = [checkNightOwl, checkEarlyBird, checkMirrorHour]
  for (const check of checks) {
    const result = check()
    if (result) awarded.push(result)
  }
  return awarded
}

// ── Date-based detection ─────────────────────────────────────────────────────

/** Check if a date string (YYYY-MM-DD) is a palindrome */
function isPalindromeDate(dateStr: string): boolean {
  const d = dateStr.replace(/-/g, '')
  return d === d.split('').reverse().join('')
}

/** Award calendar easter egg badges based on current date */
export function checkCalendarEasterEggs(): BadgeType[] {
  const awarded: BadgeType[] = []
  const now = new Date()
  const month = now.getMonth() + 1  // 1-indexed
  const day = now.getDate()
  const dateStr = now.toISOString().slice(0, 10)

  // Solstice: June 21 or December 21
  if (!hasBadge('solstice') && (month === 6 && day === 21) || (month === 12 && day === 21)) {
    awardBadge('solstice')
    awarded.push('solstice')
  }

  // Equinox: March 20 or September 22
  if (!hasBadge('equinox') && ((month === 3 && day === 20) || (month === 9 && day === 22))) {
    awardBadge('equinox')
    awarded.push('equinox')
  }

  // LOT Birthday: April 7
  if (!hasBadge('lot_birthday') && month === 4 && day === 7) {
    awardBadge('lot_birthday')
    awarded.push('lot_birthday')
  }

  // New Year Sage: January 1
  if (!hasBadge('new_year_sage') && month === 1 && day === 1) {
    awardBadge('new_year_sage')
    awarded.push('new_year_sage')
  }

  // Pi Day: March 14
  if (!hasBadge('pi_day') && month === 3 && day === 14) {
    awardBadge('pi_day')
    awarded.push('pi_day')
  }

  // Palindrome Day
  if (!hasBadge('palindrome_day') && isPalindromeDate(dateStr)) {
    awardBadge('palindrome_day')
    awarded.push('palindrome_day')
  }

  return awarded
}

// ── Behavioral detection ─────────────────────────────────────────────────────

/** Check and award Friday Ritual badge (4 consecutive Fridays) */
export function checkFridayRitual(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('friday_ritual')) return null

  const now = new Date()
  if (now.getDay() !== 5) return null  // Not Friday

  try {
    const key = 'friday_ritual_dates'
    const stored = localStorage.getItem(key)
    const dates: string[] = stored ? JSON.parse(stored) : []
    const todayStr = now.toISOString().slice(0, 10)

    if (!dates.includes(todayStr)) {
      dates.push(todayStr)
      // Keep only last 30 days of Fridays
      const recent = dates.slice(-8)
      localStorage.setItem(key, JSON.stringify(recent))

      // Count consecutive Fridays (7 days apart)
      if (recent.length >= 4) {
        const sorted = [...recent].sort()
        let consecutive = 1
        for (let i = sorted.length - 1; i > 0; i--) {
          const diff = Math.round(
            (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime())
            / (1000 * 60 * 60 * 24)
          )
          if (diff === 7) {
            consecutive++
            if (consecutive >= 4) {
              awardBadge('friday_ritual')
              return 'friday_ritual'
            }
          } else {
            break
          }
        }
      }
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check and award Ghost Protocol badge (7-day absence then return).
 * Call this on every check-in — it reads lastActivity from localStorage.
 */
export function checkGhostProtocol(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('ghost_protocol')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince >= 7) {
      awardBadge('ghost_protocol')
      return 'ghost_protocol'
    }
  } catch { /* non-critical */ }

  return null
}

/**
 * Check and award Silent Hour badge (24h absence then return).
 * More gentle than Ghost Protocol.
 */
export function checkSilentHour(): BadgeType | null {
  if (typeof window === 'undefined') return null
  if (hasBadge('silent_hour')) return null

  try {
    const lastActivity = localStorage.getItem('last_activity_date')
    if (!lastActivity) return null

    const hoursSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60)
    )

    if (hoursSince >= 24 && hoursSince < 168) { // 24h–7d (Ghost Protocol takes over at 7d)
      awardBadge('silent_hour')
      return 'silent_hour'
    }
  } catch { /* non-critical */ }

  return null
}

/** Record the current time as last activity */
export function recordActivity(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('last_activity_date', new Date().toISOString())
  } catch { /* non-critical */ }
}

/**
 * Check Overclock badge: 20+ activities in one day.
 * activityCount should be today's total from the server.
 */
export function checkOverclock(activityCount: number): BadgeType | null {
  if (hasBadge('overclock')) return null
  if (activityCount >= 20) {
    awardBadge('overclock')
    return 'overclock'
  }
  return null
}

// ── Word turn detection ───────────────────────────────────────────────────────

/** Word turn map: phrase patterns → badge IDs */
const WORD_TURNS: Array<{ patterns: RegExp; badge: BadgeType }> = [
  { patterns: /\b(ritual|rituals)\b/i,             badge: 'ritual_keeper' },
  { patterns: /\b(breathe|breathing|breath)\b/i,   badge: 'breath_anchor' },
  { patterns: /\b(grateful|gratitude|thankful)\b/i,badge: 'gratitude_node' },
  { patterns: /\b(ocean|water|sea|tide|wave)\b/i,  badge: 'aquatic_resonance' },
  { patterns: /\b(stars?|cosmos|cosmic|galaxy|universe|constellation)\b/i, badge: 'stargazer' },
  { patterns: /\bhome\b/i,                          badge: 'grounded_signal' },
  { patterns: /\b(dream|dreaming|dreamed|dreamt)\b/i, badge: 'dream_log' },
  { patterns: /\b(pain|painful|difficult|struggle|hard|suffering)\b/i, badge: 'courage_pulse' },
  { patterns: /\b(love|heart|loving|beloved)\b/i,  badge: 'heart_signal' },
  { patterns: /\b(silence|quiet|still|stillness)\b/i, badge: 'the_quiet' },
  { patterns: /\b(future|tomorrow|ahead|forward)\b/i, badge: 'horizon_seeker' },
  { patterns: /\bLOT\b/,                            badge: 'meta_signal' },
]

/**
 * Scan text for word turn triggers.
 * Returns array of newly awarded badge IDs.
 * Call this when a memory answer or journal entry is submitted.
 */
export function detectWordTurns(text: string): BadgeType[] {
  if (!text || text.length < 2) return []

  const awarded: BadgeType[] = []

  for (const { patterns, badge } of WORD_TURNS) {
    if (!hasBadge(badge) && patterns.test(text)) {
      if (awardBadge(badge)) {
        awarded.push(badge)
      }
    }
  }

  return awarded
}

/**
 * Get the terminal response for a word turn.
 * Used by MemoryWidget to show a special message when a word turn fires.
 */
export function getWordTurnResponse(text: string): string | null {
  const lower = text.toLowerCase()

  if (/\b(i am fine|i'm fine)\b/.test(lower))
    return '↳ Fine. But what if you weren\'t? ∘'
  if (/\bnothing\b/.test(lower))
    return '↳ Nothing is data. ·'
  if (/\bi don\'?t know\b/.test(lower))
    return '↳ The unknown is a valid coordinate. ≈'
  if (/\bi failed\b/.test(lower))
    return '↳ A signal, not a verdict. The archive holds all of it. ∘'
  if (/\bi notice\b/.test(lower))
    return '↳ Self-observation token received. +XP ∘'
  if (/\bi am becoming\b/.test(lower))
    return '↳ Narrative evolution event. The story updates itself. ≈'
  if (/\bskip\b/.test(lower))
    return '↳ Counted. The silence is also data. ·'
  if (/\bhello\b/.test(lower))
    return '↳ HELLO. SYSTEM ONLINE. ∘'
  if (/\bstatus\b/.test(lower))
    return '↳ STATUS: ACTIVE. ARCHIVE RUNNING. QIE ONLINE.'
  if (/\binventory\b/.test(lower))
    return '↳ INVENTORY LOADED. Check your badge collection.'
  if (/\bload game\b/.test(lower))
    return '↳ LOADING... Memory story found. Chapter continues.'
  if (/\bsave\b/.test(lower))
    return '↳ Your story is always saved. ≋'
  if (/\bquit\b/.test(lower))
    return '↳ The system persists even when you step away.'
  if (/\boverride\b/.test(lower))
    return '↳ ▒▒░░▒ OVERRIDE SIGNAL RECEIVED ▒▒░░▒'
  if (/^\/debug$/.test(text.trim()))
    return '↳ DEBUG MODE — Signal integrity: ◉ — QIE: ARMED'
  if (/\bmap\b/.test(lower))
    return '↳ CQGS MAP LOADING... All modules visible.'
  if (/\bscore\b/.test(lower))
    return '↳ SCORE: XP ACCUMULATING. LEVEL CURRENT. MULTIPLIER ACTIVE.'
  if (/\bhistory\b/.test(lower))
    return '↳ HISTORY LOADED. Last 10 badge unlocks retrievable.'

  return null
}

// ── Anniversary detection ─────────────────────────────────────────────────────

/**
 * Check account anniversary badge.
 * signupDate should be ISO string from user profile.
 */
export function checkAnniversary(signupDate: string): BadgeType | null {
  if (hasBadge('anniversary')) return null

  try {
    const signup = new Date(signupDate)
    const now = new Date()

    const sameMonthDay =
      signup.getMonth() === now.getMonth() &&
      signup.getDate() === now.getDate()

    const differentYear = signup.getFullYear() < now.getFullYear()

    if (sameMonthDay && differentYear) {
      awardBadge('anniversary')
      return 'anniversary'
    }
  } catch { /* non-critical */ }

  return null
}

// ── Master check-in scanner ──────────────────────────────────────────────────

/**
 * Run all check-in time easter egg checks at once.
 * Call this when user performs any check-in action.
 * Returns all newly awarded badge IDs.
 */
export function runCheckInEasterEggs(activityCount?: number): BadgeType[] {
  const awarded: BadgeType[] = []

  // Time-based
  const timeResults = checkTimeEasterEggs()
  awarded.push(...timeResults)

  // Calendar-based
  const calResults = checkCalendarEasterEggs()
  awarded.push(...calResults)

  // Behavioral
  const ghost = checkGhostProtocol()
  if (ghost) awarded.push(ghost)

  const silent = checkSilentHour()
  if (silent) awarded.push(silent)

  const friday = checkFridayRitual()
  if (friday) awarded.push(friday)

  if (activityCount !== undefined) {
    const overclock = checkOverclock(activityCount)
    if (overclock) awarded.push(overclock)
  }

  // Record activity after all checks (so gap detection works next time)
  recordActivity()

  return awarded
}
